# Trustfall — Access Control Report — Savings crvUSD (scrvUSD)

| Field | Value |
|---|---|
| Contract | `0x0655977FEb2f289A4aB78af67BAB0d17aAb84367` |
| Token | Savings crvUSD (scrvUSD) |
| Name | Yearn V3 Vault |
| Chain | Ethereum |
| Proxy Status | ✅ No |
| OZ AccessControl | ❌ No |
| Ownable | ❌ No |
| Pausable | — |
| ERC-4626 Vault | ✅ Underlying: `0xf939E0A03FB07F59A73314E73794Be0E57ac1b4E` |
| Control Surface | ✅ Fully on-chain |
| Scan Integrity | ✅ No issues detected |
| Report Date | 2026-06-29 21:55 UTC |

### Surface Summary

| Field | Value |
|---|---:|
| Contracts | 4 |
| Role slots | 15 |
| Privileged Fns | 13 |
| EOA Holders | 0 |
| Critical Roles | 0 |

## Changes Since Last Scan

> Comparing **2026-06-22T15:49:38Z** (block 25374132) → **2026-06-29T21:55:12Z** (block 25426138).

> ✅ No changes to roles, parameters, contracts, or findings.


## 📋 Protocol Context

> *From protocol profile: Curve Finance (Savings crvUSD) / scrvUSD (Yield-bearing Stablecoin (ERC-4626 vault))*

<details>
<summary><strong>Architecture</strong></summary>

- **Architectural shape:** UNMODIFIED Yearn V3 `VaultV3.vy` (Vyper 0.3.7, apiVersion 3.0.4, ERC-4626), deployed via the Yearn Vault Factory (0x770d0d1fb036483ed4abb6d53c1c88fb277d812f). NOT a proxy — immutable bytecode, no upgrade function (Etherscan Proxy=0). asset() = crvUSD (0xf939E0A03FB07F59A73314E73794Be0E57ac1b4E). Token name 'Savings crvUSD', symbol 'scrvUSD', 18 decimals.
- IDLE / DONATION vault — NOT strategy-allocating. On-chain (2026-06-02 recon): totalDebt()=0, get_default_queue()=[] (empty, no strategies ever registered — StrategyChanged history is empty), accountant()=0x0, deposit_limit_module()=0x0, withdraw_limit_module()=0x0. 100% of crvUSD sits idle in the vault (totalAssets≈totalIdle≈20.2M crvUSD at recon; pricePerShare≈1.10, TVL time-varying — scanner reads live). Curve's own repo states the vault 'doesn't contain any strategies' and uses Yearn v3's 'report on self'. CONSEQUENCE: no external strategy custody, no strategy-loss vector, and redemptions are ALWAYS serviceable from idle — there is no withdrawal-freeze surface today.
- Yield source = crvUSD BORROW (admin) FEES, not an external strategy. crvUSD minting-market controllers (9) accrue interest; the Curve FeeSplitter (0x2dfd89449faFF8a532790667baB21Cf733C064f2, v0.1.0) claims those fees (multiclaim, n_controllers=9) and splits crvUSD across receivers: receivers[0] = scrvUSD RewardsHandler (dynamic weight, hard 50% cap = 5000 bps), receivers[1]/excess = Curve FeeCollector 0xa2Bcd1a4Efbd04B63cd03f5aFf2561106ebCCE00 (the veCRV burn pipeline). The fee share to scrvUSD is DYNAMIC: 5% floor (RewardsHandler minimum_weight=500/scaling=10000), 50% cap, TWA-weighted by (crvUSD-in-vault / crvUSD-circulating-supply); current weight ≈26% (2629/10000).
- Yield delivery = DONATION + SELF-REPORT (no CowSwap into the vault). RewardsHandler.process_rewards() does `crvUSD.transfer(vault, balance)` then `vault.process_report(vault)` — crvUSD is donated to the vault and booked as profit on the vault's own (self) strategy, then streamed into pricePerShare over profitMaxUnlockTime = 604800s (7 days). process_rewards()/take_snapshot() are PERMISSIONLESS; crvUSD sent to the RewardsHandler is irrecoverable (recover_erc20 rescues every token EXCEPT crvUSD) — it can only add yield, never remove principal.
- **Governance / authority:** role_manager = Curve DAO Ownership Agent (0x40907540…9968, Aragon Agent) — the SAME ultimate authority as crvUSD. Control flow: Curve Community/Ownership DAO vote → Aragon Voting → Aragon Agent → vault. Ownership-tier votes: 30% quorum, 51% support, 1-week voting window that cannot execute until the full week elapses (this is the '~7-day timelock' — a voting/execution delay, NOT a separate TimelockController). The deployer's bootstrap admin was granted+revoked in the same block (clean handoff).
- Operational roles are SPLIT and minimal (only 2 holders): RewardsHandler holds REPORTING+PROFIT_UNLOCK (the yield engine); a 2-of-5 Safe holds DEPOSIT_LIMIT+EMERGENCY (can pause deposits / shutdown WITHOUT a DAO vote). All 10 other Yearn V3 roles are UNASSIGNED — the strategy/accountant/withdraw-gate/debt powers are ungranted today.
- scrvUSD PPS (pricePerShare / convertToAssets) is a SOFT, manipulable exchange rate — NOT a hardened oracle. The reward weight is set by a TWA whose snapshots are permissionless; ChainSecurity documents (and Curve ACCEPTS) that flashloan-sandwiched deposits/withdrawals can skew the TWA over many snapshots to game the yield RATE. This is a yield-rate manipulation, not a principal-theft vector — but any FiRM integration must NOT treat scrvUSD share-price growth as a trusted oracle input.
- FiRM-lens observation context (2026-06-02): scrvUSD is the yield-bearing sibling of crvUSD, which was OFFBOARDED from Inverse FiRM on 2026-02-18 (GovernorMills #350) amid crvUSD peg instability + the Yield Basis 1B crvUSD credit line. scrvUSD is fully backed by and redeemable into crvUSD, so any crvUSD depeg / bad-debt event flows STRAIGHT THROUGH to scrvUSD principal — its dominant risk is INHERITED crvUSD backing risk, not vault-specific. The RWG is in an OBSERVATION PHASE for both assets; this recon/scan is an architecture-observation checkpoint, NOT a re-onboarding. See decisions[] + profiles/crvUSD.yaml.

</details>

<details>
<summary><strong>Function Interaction Paths</strong></summary>

- **`transfer_role_manager(addr) → accept_role_manager()`** (`role_manager() = Curve DAO Ownership Agent`)
  - 2-step rotation of the META-AUTHORITY. A new role_manager can grant itself every operational role bit.
  - Currently held by the Curve DAO Agent → rotation requires a Curve Ownership vote (~7-day window).
  - ⚠️ *The ultimate control lever. A malicious/compromised role_manager could grant itself ADD_STRATEGY + DEBT + MAX_DEBT and route the idle crvUSD out (see next path). Likelihood is gated by Curve DAO governance (same trust as crvUSD), not a single key.*
- **`add_strategy(s) → update_max_debt_for_strategy(s, X) → update_debt(s, X)`** (`ADD_STRATEGY_MANAGER + MAX_DEBT_MANAGER + DEBT_MANAGER (all currently UNASSIGNED)`)
  - Registers an ERC-4626 strategy (must have asset()==crvUSD) and moves idle crvUSD INTO it — the only path by which depositor crvUSD leaves the vault.
  - Today: totalDebt=0, no strategies, and these manager roles have NO holder → the path is ungranted + unused.
  - ⚠️ *The latent custody/withdrawal-risk path. Activating it requires role_manager (Curve DAO, ~7-day vote) to FIRST grant the strategy/debt roles, THEN add a strategy. A malicious or lossy strategy could impair principal. OBSERVATION-PHASE WATCH-ITEM: any strategy registration or role grant here is a material change.*
- **`set_withdraw_limit_module(module)`** (`WITHDRAW_LIMIT_MANAGER (currently UNASSIGNED; withdraw_limit_module = 0x0)`)
  - Installs a module whose available_withdraw_limit() gates redemptions — a module returning 0 would BLOCK withdrawals.
  - ⚠️ *The only on-chain path to a redemption FREEZE on scrvUSD (FiRM-critical: liquidations must be able to exit scrvUSD→crvUSD). Currently no module is set and the role is unassigned → no freeze surface today. Activation requires a DAO role grant. OBSERVATION-PHASE WATCH-ITEM.*
- **`shutdown_vault()`** (`EMERGENCY_MANAGER = 2/5 Safe 0xe286…Dcf2`)
  - Irreversibly sets shutdown=true + deposit_limit=0 (freezes NEW deposits) and grants the caller DEBT_MANAGER.
  - Withdrawals/redemptions REMAIN OPEN — shutdown only pulls funds, never blocks exit.
  - ⚠️ *Deposit-freeze, exercisable by a 2/5 multisig WITHOUT a DAO vote. Low FiRM concern: principal exit is preserved (V3 emergency design does not pause withdrawals).*
- **`set_deposit_limit(0) / set_deposit_limit_module(m)`** (`DEPOSIT_LIMIT_MANAGER = 2/5 Safe 0xe286…Dcf2`)
  - Caps or halts new deposits (0 = no new deposits). Does not affect existing holders' redemptions.
  - ⚠️ *Inflow control by the 2/5 Safe without a DAO vote. Doesn't touch principal exit. MEDIUM/LOW.*
- **`setProfitMaxUnlockTime(t)`** (`PROFIT_UNLOCK_MANAGER = RewardsHandler 0xe8D1…6F56`)
  - Controls the profit-unlock stream. Setting to 0 instantly unlocks all locked profit → immediate PPS jump; mis-setting enables yield-gaming (exit-before / enter-after a report).
  - ⚠️ *PPS-smoothness / yield-fairness lever, not a principal lever. Reinforces that scrvUSD PPS is a soft rate. Held by the RewardsHandler contract (whose RATE/admin roles are Curve-DAO-held).*
- **`set_accountant(a)`** (`ACCOUNTANT_MANAGER (currently UNASSIGNED; accountant = 0x0)`)
  - Sets the fee assessor. A hostile accountant could charge fees (minted as shares = dilution) and pull approved refunds; process_report reentrancy was intentionally left enabled on the assumption the accountant is trusted.
  - ⚠️ *Latent fee/dilution + reentrancy-trust surface. Currently no accountant and the role is unassigned → no fees charged today. Activation requires a DAO grant. HIGH if activated.*
- **`FeeSplitter.set_receivers(...) / receiver weight change`** (`FeeSplitter.owner() = Curve DAO Ownership Admin (0x40907540…9968)`)
  - Curve DAO can cut scrvUSD's fee share to the 5% floor (or change the receiver set) — reduces scrvUSD APR.
  - ⚠️ *Upstream yield-rate lever (on the FeeSplitter dependency, not the vault). Affects yield, not principal. LOW for lenders.*
- **`RewardsHandler RATE_MANAGER weight tuning: set_minimum_weight / set_scaling_factor / set_twa_window / set_twa_snapshot_dt / set_distribution_time (+ LENS_MANAGER set_stablecoin_lens)`** (`RATE_MANAGER + LENS_MANAGER on RewardsHandler — both = Curve DAO Ownership Agent (0x40907540…9968), the SAME authority as role_manager`)
  - Tunes the DYNAMIC fee weight() the FeeSplitter reads (the 5%–50% share) and the profit-unlock distribution window — i.e. scrvUSD's APR and PPS-smoothness. [discovered_by_scan + debrief 2026-06-03 — cycle-1 RewardsHandler full source read]
  - Confirms the fee-weight lever lives on BOTH sides: the FeeSplitter (cap/receivers, entry above) AND the RewardsHandler (the dynamic-weight formula params). Both gated by the same Curve DAO Agent.
  - ⚠️ *Vault-side yield-rate lever. Reinforces that scrvUSD PPS / APR is a SOFT, Curve-DAO-tunable + TWA-manipulable rate (do NOT use as a trusted oracle). YIELD, not principal — LOW for lenders. NOT enumerated as separate critical_parameters entries (see decisions[] 'RewardsHandler yield-rate levers — documented as surface, not enumerated').*

</details>

<a id="sec-critical-params"></a>
<details>
<summary><strong>🎚️ Critical Parameter Levers</strong></summary>

> *6 on-chain parameter levers that are curated as high-impact for lender-side risk (direct dilution / safety-mechanism closure / authority transfer / oracle repointing). Each entry shows current value, the threshold that triggers the impact, and the role-holder controlling the lever.*

- **`transfer_role_manager(address role_manager)`** 🔴 on [**scrvUSD (0x0655977FEb2f289A4aB78af67BAB0d17aAb84367)**](#c-0x0655977feb2f289a4ab78af67bab0d17aab84367)
    - *Role gate:* role_manager() = Curve DAO Ownership Agent 0x40907540d8a6C65c637785e8f8B742ae6b0b9968 (Aragon Agent)
    - *Live current value (as of block 21,150,731):* `0x40907540d8a6C65c637785e8f8B742ae6b0b9968`
    - *Recorded changes:* 1 historical event(s); last setter `0x40907540d8a6C65c637785e8f8B742ae6b0b9968`
    - *Profile-declared value (verified at block 25,238,745):* `role_manager = Curve DAO Ownership Agent; future_role_manager = 0x0 (no pending transfer)`
    - *Threshold:* Any rotation hands the meta-authority (grant/revoke every role) to a new address.
    - *Impact:* AUTHORITY / META (lender-critical capability). The root of the vault's control tree. A captured role_manager can grant itself the strategy/debt roles and route idle crvUSD out, or grant a withdraw-limit module to freeze exits. Likelihood gated by Curve DAO Ownership vote (~7-day window) — the SAME governance as crvUSD. No separate timelock contract.
- **`add_strategy(address new_strategy, bool add_to_queue) + update_debt(address strategy, uint256 target_debt, uint256 max_loss)`** 🟠 on [**scrvUSD (0x0655977FEb2f289A4aB78af67BAB0d17aAb84367)**](#c-0x0655977feb2f289a4ab78af67bab0d17aab84367)
    - *Role gate:* ADD_STRATEGY_MANAGER + DEBT_MANAGER (both currently UNASSIGNED — no holder)
    - *Profile-declared value (verified at block 25,238,745):* `No strategies registered (get_default_queue=[], totalDebt=0). Manager roles unassigned. The custody-flow path is ungranted + unused.`
    - *Threshold:* Registering a strategy + allocating debt is the ONLY path by which depositor crvUSD leaves the idle vault.
    - *Impact:* CUSTODY / principal (lender-HIGH if activated). A malicious or lossy strategy could impair principal; force_revoke_strategy can realize a strategy loss onto the vault (PPS hit). Currently inert — requires a Curve DAO role grant (~7-day vote) to even begin. OBSERVATION-PHASE WATCH-ITEM: flag any StrategyChanged(ADDED) or RoleSet granting these roles.
- **`set_withdraw_limit_module(address withdraw_limit_module)`** 🟠 on [**scrvUSD (0x0655977FEb2f289A4aB78af67BAB0d17aAb84367)**](#c-0x0655977feb2f289a4ab78af67bab0d17aab84367)
    - *Role gate:* WITHDRAW_LIMIT_MANAGER (currently UNASSIGNED)
    - *Profile-declared value (verified at block 25,238,745):* `withdraw_limit_module = 0x0 (none). Role unassigned. Redemptions are unconditionally serviceable from idle crvUSD.`
    - *Threshold:* Installing a module whose available_withdraw_limit() returns 0 would block redemptions.
    - *Impact:* REDEMPTION FREEZE (lender-HIGH if activated). The only on-chain path to halt scrvUSD→crvUSD exit — directly relevant to FiRM liquidation. No freeze surface today (no module, role unassigned). Activation requires a DAO role grant. OBSERVATION-PHASE WATCH-ITEM.
- **`shutdown_vault()`** 🟡 on [**scrvUSD (0x0655977FEb2f289A4aB78af67BAB0d17aAb84367)**](#c-0x0655977feb2f289a4ab78af67bab0d17aab84367)
    - *Role gate:* EMERGENCY_MANAGER = 2/5 Gnosis Safe 0xe286b81d16FC7e87eD9dc2a80dd93b1816F4Dcf2
    - *Profile-declared value (verified at block 25,238,745):* `isShutdown = False`
    - *Threshold:* Single call irreversibly freezes new deposits (deposit_limit→0). Withdrawals remain open.
    - *Impact:* PAUSE (deposit-side only; lender-MEDIUM). Exercisable by a 2/5 multisig WITHOUT a DAO vote or delay. Principal EXIT is preserved (V3 does not pause withdrawals), so low FiRM-liquidation concern; surfaced because emergency authority sits in a multisig of EOA signers outside the DAO gate.
- **`setProfitMaxUnlockTime(uint256 new_profit_max_unlock_time)`** 🟡 on [**scrvUSD (0x0655977FEb2f289A4aB78af67BAB0d17aAb84367)**](#c-0x0655977feb2f289a4ab78af67bab0d17aab84367)
    - *Role gate:* PROFIT_UNLOCK_MANAGER = RewardsHandler 0xe8D1e2531761406AF1615a6764b0d5fF52736F56
    - *Live current value:* `604800`
    - *Profile-declared value (verified at block 25,238,745):* `profitMaxUnlockTime = 604800 (7 days)`
    - *Threshold:* 0 instantly unlocks all locked profit (PPS jump); too-small values enable yield-gaming (exit/enter around reports).
    - *Impact:* PPS / yield-fairness (lender-MEDIUM). Not a principal lever. Reinforces that scrvUSD pricePerShare is a SOFT, manipulable rate — do NOT use as a trusted oracle. Held by the RewardsHandler contract (RATE/admin roles Curve-DAO-held).
- **`set_accountant(address new_accountant)`** 🟡 on [**scrvUSD (0x0655977FEb2f289A4aB78af67BAB0d17aAb84367)**](#c-0x0655977feb2f289a4ab78af67bab0d17aab84367)
    - *Role gate:* ACCOUNTANT_MANAGER (currently UNASSIGNED)
    - *Profile-declared value (verified at block 25,238,745):* `accountant = 0x0 (no accountant; no fees charged at the vault level)`
    - *Threshold:* Setting a hostile accountant enables fee minting (share dilution) + refund pulls; process_report reentrancy is intentionally enabled on accountant-trust.
    - *Impact:* FEE / dilution (lender-HIGH if activated). Currently inert (no accountant, role unassigned). Activation requires a DAO grant. The audited trust model assumes the accountant is fully trusted and holds no other role.

</details>

## 📑 Table of Contents

1. [Analyst Focus Areas](#analyst-focus-areas)
2. Contracts
   - [scrvUSD ★](#c-0x0655977feb2f289a4ab78af67bab0d17aab84367)
   - [Agent](#c-0x40907540d8a6c65c637785e8f8b742ae6b0b9968)
   - [Rewards Handler](#c-0xe8d1e2531761406af1615a6764b0d5ff52736f56)
3. [⚡ Authority Concentration](#-authority-concentration)
4. [⛔ Sanctions Screening](#-sanctions-screening)
5. [EOA Exposure Summary](#eoa-exposure-summary)
6. [✅ Scan Integrity](#scan-integrity)

## Analyst Focus Areas

> **Observational findings — not risk determinations.** Each item below is a focus point for the Risk Analyst to interpret against collateralization context and the protocol's stated intent. Attention levels (CRITICAL / HIGH / LOW) reflect the scanner's heuristic weight — not a realized risk to FiRM. These observations support future risk assessments; they do not constitute one.

> **1 critical-attention** and **5 high-attention** observation(s) across 4 contract(s).


### 🔴 CRITICAL (1)

- 🎚️ [**Observed: 6 critical parameter levers (CRITICAL: 1, HIGH: 2, MEDIUM: 3)**](#sec-critical-params) — Asset has 6 on-chain parameter levers curated as high-impact for lender-side risk. See the 🎚️ Critical Parameter Levers section for the role gate, current value, threshold, and impact of each. These are singular setters / function calls that flip risk surface in one tx — direct dilution, safety-mechanism closure, authority transfer, or oracle repointing. Verify role-gate identities and threshold distance-to-trigger against current operating posture.

### 🟠 HIGH (5)

- 💰 **Observed: 2 role(s) with supply-altering capability** — Supply-altering surface detected: `PROFIT_UNLOCK_MANAGER` on Yearn V3 Vault, `REPORTING_MANAGER` on Yearn V3 Vault. Assess each holder's custody and governance.
- ⏸️ **Observed: 1 role(s) with pause capability** — Pause surface detected: `EMERGENCY_MANAGER` on Yearn V3 Vault. Assess pause authority governance.
- 🔗 [**Observed: supply authority chain on Rewards Handler**](#c-0xe8d1e2531761406af1615a6764b0d5ff52736f56) — Chain: Yearn V3 Vault → `REPORTING_MANAGER` → Rewards Handler. Controlled by: `DEFAULT_ADMIN_ROLE`, `LENS_MANAGER`, `RATE_MANAGER`. Assess custody — compromise of this chain could affect root token supply.
- ⚠️ [**No Timelock in admin chain: `REPORTING_MANAGER` on Yearn V3 Vault**](#c-0x0655977feb2f289a4ab78af67bab0d17aab84367) — `REPORTING_MANAGER` has SUPPLY capability and is held by: `0xE8d1...6F56` (Contract). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `PROFIT_UNLOCK_MANAGER` on Yearn V3 Vault**](#c-0x0655977feb2f289a4ab78af67bab0d17aab84367) — `PROFIT_UNLOCK_MANAGER` has SUPPLY capability and is held by: `0xE8d1...6F56` (Contract). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.

### 🟢 LOW (1)

- 🟢 [**Observed: Aragon-gated upgrade path on Agent**](#c-0x40907540d8a6c65c637785e8f8b742ae6b0b9968) — Upgrades go through the aragonOS Kernel ACL (`APP_MANAGER_ROLE`) held by Curve: Ownership Agent (`0x40907540d8a6C65c637785e8f8B742ae6b0b9968`) — enacted only via a DAO governance vote. The vote period is the on-chain observation window; there is no separate TimelockController contract.

> **Standard review checklist:** Verify role-holder identities, timelock delays, multisig quorum and signers, upgrade-path custody, and parameter bounds against current protocol spec — regardless of findings above.

## Attention Legend

> Attention levels indicate how prominently a signal should feature in the analyst's review — not the realized risk to FiRM.

| Icon | Attention | Meaning |
|---|---|---|
| 🔴 | CRITICAL | EOA private key, unknown upgrader, or unprotected upgrade path — verify immediately |
| 🟠 | HIGH | Unrecognised contract or elevated privilege pattern — requires investigation |
| 🟢 | LOW | Standard custodial pattern — Gnosis Safe, TimelockController, ERC-4626 vault, OZ Governor, Aragon Agent |
| 🔵 | DISCREPANCY | Storage and event history disagree — investigate for data integrity |

---
<a id="c-0x0655977feb2f289a4ab78af67bab0d17aab84367"></a>
## Yearn V3 Vault `0x0655977FEb2f289A4aB78af67BAB0d17aAb84367`

### 🟠 `PROFIT_UNLOCK_MANAGER`

**Hash:** `yearn_role_11`  
**Privileged write functions:**  
**Capabilities:** ⚙️ **CONFIG** 💰 **SUPPLY**
- `setProfitMaxUnlockTime(uint256 new_profit_max_unlock_time)` — @notice Set the new profit max unlock time. `[CONFIG, SUPPLY]`

**Members (1):**

| Address | Name / Type | Risk | Granted | Source | Details |
|---|---|---|---|---|---|
| `0xE8d1E2531761406Af1615A6764B0d5fF52736F56` | Rewards Handler | 🟠 HIGH | — | Storage only |  |

### 🟠 `REPORTING_MANAGER`

**Hash:** `yearn_role_5`  
**Privileged write functions:**  
**Capabilities:** 💰 **SUPPLY**
- `process_report(address strategy)` — @notice Process the report of a strategy. `[SUPPLY]`

**Members (1):**

| Address | Name / Type | Risk | Granted | Source | Details |
|---|---|---|---|---|---|
| `0xE8d1E2531761406Af1615A6764B0d5fF52736F56` | Rewards Handler | 🟠 HIGH | — | Storage only |  |

### 🟢 `DEPOSIT_LIMIT_MANAGER`

**Hash:** `yearn_role_8`  
**Privileged write functions:**  
**Capabilities:** ⚙️ **CONFIG**
- `set_deposit_limit(uint256 deposit_limit)` — @notice Set the new deposit limit. `[CONFIG]`
- `set_deposit_limit_module(address deposit_limit_module)` — @notice Set a contract to handle the deposit limit. `[CONFIG]`

**Members (1):**

| Address | Name / Type | Risk | Granted | Source | Details |
|---|---|---|---|---|---|
| `0xe286b81d16FC7e87eD9dc2a80dd93b1816F4Dcf2` | Gnosis Safe 2/5 | 🟢 LOW | — | Storage only | 2/5 signers |

**Signers of `Gnosis Safe 2/5` (0xe286...Dcf2):**

| Signer | Type | Owner Since | Notes |
|---|---|---|---|
| `0x7ebA24233f7b5966047F637aec558dfF3344883f` | EOA | 2024-10-17 | EOA |
| `0xFe45baf0F18c207152A807c1b05926583CFE2e4b` | EOA | 2024-10-17 | EOA |
| `0xE6DA683076b7eD6ce7eC972f21Eb8F91e9137a17` | EOA | 2024-10-17 | EOA |
| `0xb101b2b0aa02b7167D238B98dc1B0b0404a760E8` | EOA | — | EOA |
| `0x8CF577a014e341AC303A45974e3c7C9Aa303d067` | EOA | — | EOA |

### 🟢 `EMERGENCY_MANAGER`

**Hash:** `yearn_role_13`  
**Privileged write functions:**  
**Capabilities:** ⏸️ **PAUSE**
- `shutdown_vault()` — @notice Shutdown the vault. `[PAUSE]`

**Members (1):**

| Address | Name / Type | Risk | Granted | Source | Details |
|---|---|---|---|---|---|
| `0xe286b81d16FC7e87eD9dc2a80dd93b1816F4Dcf2` | Gnosis Safe 2/5 | 🟢 LOW | — | Storage only | 2/5 signers |

**Signers of `Gnosis Safe 2/5` (0xe286...Dcf2):**

| Signer | Type | Owner Since | Notes |
|---|---|---|---|
| `0x7ebA24233f7b5966047F637aec558dfF3344883f` | EOA | 2024-10-17 | EOA |
| `0xFe45baf0F18c207152A807c1b05926583CFE2e4b` | EOA | 2024-10-17 | EOA |
| `0xE6DA683076b7eD6ce7eC972f21Eb8F91e9137a17` | EOA | 2024-10-17 | EOA |
| `0xb101b2b0aa02b7167D238B98dc1B0b0404a760E8` | EOA | — | EOA |
| `0x8CF577a014e341AC303A45974e3c7C9Aa303d067` | EOA | — | EOA |

### 🟢 `role_manager()`

**Privileged write functions:**
- `setName(string name)` — @notice Change the vault name.
- `setSymbol(string symbol)` — @notice Change the vault symbol.
- `set_role(address account, uint256 role)` — @notice Set the roles for an account.
- `add_role(address account, uint256 role)` — @notice Add a new role/s to an address.
- `remove_role(address account, uint256 role)` — @notice Remove a role/s from an account.
- `transfer_role_manager(address role_manager)` — @notice Step 1 of 2 in order to transfer the

**Members (1):**

| Address | Name / Type | Risk | Granted | Source | Details |
|---|---|---|---|---|---|
| `0x40907540d8a6C65c637785e8f8B742ae6b0b9968` | Curve: Ownership Agent | 🟢 LOW | — | Storage only |  |

#### 🔧 Permissioned Parameters

**`deposit_limit`**

| Field | Value |
|---|---|
| Current Value | `115792089237316195423570985008687907853269984665640564039457584007913129639935 (115,792,089,237,316,203,707,617,735,395,386,539,918,674,240,093,853,421,928,448.000000e18)` |
| Setter | `set_deposit_limit(uint256 deposit_limit)` |
| Gated by | `DEPOSIT_LIMIT_MANAGER` |
| Tags | `CONFIG` |
| Last changed | 2024-11-01 |
| Changed by | `0x8CF5...d067` (EOA) |
| Total changes | 1 |

**Recent changes:**

| # | Value | Set By | Date |
|---|---|---|---|
| 1 | `115792089237316195423570985008687907853269984665640564039457584007913129639935 (115,792,089,237,316,203,707,617,735,395,386,539,918,674,240,093,853,421,928,448.000000e18)` | `0x8CF5...d067` (EOA) | 2024-11-01 |

**`deposit_limit_module`** ❄️ **DORMANT**

> This parameter has never been changed since deployment.

| Field | Value |
|---|---|
| Current Value | `0x0000000000000000000000000000000000000000` |
| Setter | `set_deposit_limit_module(address deposit_limit_module)` |
| Gated by | `DEPOSIT_LIMIT_MANAGER` |
| Tags | `CONFIG` |
| Last changed | — |
| Changed by | — |
| Total changes | 0 ❄️ |

**`profitMaxUnlockTime`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)*

> This parameter has never been changed since deployment.

| Field | Value |
|---|---|
| Current Value | `604800` |
| Setter | `setProfitMaxUnlockTime(uint256 new_profit_max_unlock_time)` |
| Gated by | `PROFIT_UNLOCK_MANAGER` |
| Tags | `CONFIG` `SUPPLY` |
| Last changed | — |
| Changed by | — |
| Total changes | 0 ❄️ |

**`role_manager`**

| Field | Value |
|---|---|
| Current Value | `0x40907540d8a6C65c637785e8f8B742ae6b0b9968` |
| Setter | `transfer_role_manager(address role_manager)` |
| Gated by | `role_manager()` |
| Tags | — |
| Last changed | 2024-11-09 |
| Changed by | `0x4090...9968` (Curve: Ownership Agent) |
| Total changes | 1 |

**Recent changes:**

| # | Value | Set By | Date |
|---|---|---|---|
| 1 | `0x40907540d8a6C65c637785e8f8B742ae6b0b9968` | `0x4090...9968` (Curve: Ownership Agent) | 2024-11-09 |

**`shutdown_vault`** ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> This parameter has never been changed since deployment.

| Field | Value |
|---|---|
| Setter | `shutdown_vault()` |
| Gated by | `EMERGENCY_MANAGER` |
| Tags | `PAUSE` |
| Last called | — |
| Called by | — |
| Total calls | 0 ❄️ |

#### 💰 Supply Actions

_Mint / redeem / burn call tracking — last 5 calls per function, total counts preserved._

**`process_report`** *(per-asset)* ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> This parameter has never been changed since deployment.

| Field | Value |
|---|---|
| Setter | `process_report(address strategy)` |
| Gated by | `REPORTING_MANAGER` |
| Tags | `SUPPLY` |
| Last called | — |
| Called by | — |
| Total calls | 0 ❄️ |

---
<a id="c-0x40907540d8a6c65c637785e8f8b742ae6b0b9968"></a>
## > Agent `0x40907540d8a6C65c637785e8f8B742ae6b0b9968`

> > ✅ **Proxy — immutable** (Proxy (ERC-1967), impl exposes no upgrade function) — impl: `0x3A93C17FC82CC33420d1809dDA9Fb715cc89dd37`

> 🔒 **Immutable References:** `getEVMScriptRegistry()` → AppProxyPinned, `kernel()` → KernelProxy

### > 🟢 `upgradeability (Proxy (ERC-1967))`

> > ⚠️ **CRITICAL** — Upgradeability allows arbitrary code replacement. Must be behind both a Multisig AND a Timelock.

> **Privileged write functions:**  
> **Capabilities:** ⬆️ **UPGRADE**
> - `upgradeTo(address)` — Upgrade proxy implementation to a new address `[UPGRADE]`
> - `upgradeToAndCall(address,bytes)` — Upgrade proxy implementation and call an initializer `[UPGRADE]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x40907540d8a6C65c637785e8f8B742ae6b0b9968` | Curve: Ownership Agent | 🟢 LOW | — | Storage only |  |

> #### 🔧 Permissioned Parameters

> **`PROTECTED_TOKENS_CAP`** 🔒 **IMMUTABLE**

> > 🔒 **Immutable** — declared as a constant in the contract source; cannot be changed without a contract upgrade. Bounds the reachable extreme of any setter that writes a related storage variable.

> | Field | Value |
> |---|---|
> | Current Value | `10` |
> | Mutability | 🔒 immutable (constant) |
> | Tags | `IMMUTABLE` |

---
<a id="c-0xe8d1e2531761406af1615a6764b0d5ff52736f56"></a>
## > Rewards Handler `0xE8d1E2531761406Af1615A6764B0d5fF52736F56`

> > 💰 **Inherited supply authority** — holds `REPORTING_MANAGER` on **Yearn V3 Vault**. Access controls on this contract gate root token supply.

> 🔒 **Immutable References:** `stablecoinLens()` → StablecoinLens, `vault()` → scrvUSD (Yearn V3 Vault), `stablecoin_lens()` → StablecoinLens

### > 🟢 `DEFAULT_ADMIN_ROLE`

> **Hash:** `0x0000000000000000000000000000000000000000000000000000000000000000`  
> **Managed by:** `DEFAULT_ADMIN_ROLE`  

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x40907540d8a6C65c637785e8f8B742ae6b0b9968` | Curve: Ownership Agent | 🟢 LOW | 2024-10-31 | Events only · hasRole ✓ |  |

> **🕘 Previous Holders (1)** _(verified inactive — `hasRole`/`is` returned false)_:

> | Address | Name / Type | Granted | Status |
> |---|---|---|---|
> | `0xb101b2b0aa02b7167D238B98dc1B0b0404a760E8` | EOA | 2024-10-31 | 🕘 HISTORICAL |

### > 🟢 `LENS_MANAGER` · 📋 operational

> **Hash:** `0xda48e4b668058d3fba0457cbd354097a71b7af766cfd3360061fc7ee0caccd1f`  
> **Managed by:** `DEFAULT_ADMIN_ROLE`  

> **Members (1):**

> | Address | Name / Type | Granted | Source | Details |
> |---|---|---|---|---|
> | `0x40907540d8a6C65c637785e8f8B742ae6b0b9968` | Curve: Ownership Agent | 2024-10-31 | Events only · hasRole ✓ |  |

### > 🟢 `RATE_MANAGER` · 📋 operational

> **Hash:** `0x2eb8ae3bf4f7ccce3124b351006550c82803b59ffcc079d490ebdc6c9946d68c`  
> **Managed by:** `DEFAULT_ADMIN_ROLE`  

> **Members (1):**

> | Address | Name / Type | Granted | Source | Details |
> |---|---|---|---|---|
> | `0x40907540d8a6C65c637785e8f8B742ae6b0b9968` | Curve: Ownership Agent | 2024-10-31 | Events only · hasRole ✓ |  |

### > 🟢 `RECOVERY_MANAGER` · 📋 operational

> **Hash:** `0xd4642f75fae05b9b88e341ded4f1799e22f9c409bebe008735b6133e65e6507b`  
> **Managed by:** `DEFAULT_ADMIN_ROLE`  

> **Members (1):**

> | Address | Name / Type | Granted | Source | Details |
> |---|---|---|---|---|
> | `0x40907540d8a6C65c637785e8f8B742ae6b0b9968` | Curve: Ownership Agent | 2024-10-31 | Events only · hasRole ✓ |  |

---
## ⚡ Authority Concentration

The following addresses hold permissions across multiple contracts or roles in this dependency stack. Concentration of authority increases systemic risk — a single compromised key or colluding multisig can affect multiple systems.

### 🟢 `0x40907540d8a6C65c637785e8f8B742ae6b0b9968` — Curve: Ownership Agent
Controls **2 role(s)** across **2 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| Yearn V3 Vault `0x0655...4367` | `role_manager()` | `setName(string name)`, `setSymbol(string symbol)`, `set_role(address account, uint256 role)`, `add_role(address account, uint256 role)` +2 more | — |
| Agent `0x4090...9968` | `upgradeability (Proxy (ERC-1967))` | `upgradeTo(address)`, `upgradeToAndCall(address,bytes)` | — |

### 🟠 `0xE8d1E2531761406Af1615A6764B0d5fF52736F56` — Rewards Handler
Controls **2 role(s)** across **1 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| Yearn V3 Vault `0x0655...4367` | `REPORTING_MANAGER` | `process_report(address strategy)` | — |
| Yearn V3 Vault `0x0655...4367` | `PROFIT_UNLOCK_MANAGER` | `setProfitMaxUnlockTime(uint256 new_profit_max_unlock_time)` | — |

### 🟢 `0xe286b81d16FC7e87eD9dc2a80dd93b1816F4Dcf2` — Gnosis Safe 2/5
Controls **2 role(s)** across **1 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| Yearn V3 Vault `0x0655...4367` | `DEPOSIT_LIMIT_MANAGER` | `set_deposit_limit(uint256 deposit_limit)`, `set_deposit_limit_module(address deposit_limit_module)` | — |
| Yearn V3 Vault `0x0655...4367` | `EMERGENCY_MANAGER` | `shutdown_vault()` | — |


---
## ⛔ Sanctions Screening

| Source | Status |
|---|---|
| OFAC SDN | ✅ OFAC SDN screened (97 ETH addresses, cache: 2026-06-29) |
| Chainalysis | ✅ Chainalysis screened |
| **Result** | 12 addresses screened · ✅ 0 flagged |

---
## EOA Exposure Summary

✅ No direct EOA role holders detected.

---
## ✅ Scan Integrity

No issues detected. All block ranges covered, source and ABI resolved for all contracts.
