# Trustfall — Access Control Report — Staked USDe (sUSDe)

| Field | Value |
|---|---|
| Contract | `0x9D39A5DE30e57443BfF2A8307A4256c8797A3497` |
| Token | Staked USDe (sUSDe) |
| Name | StakedUSDeV2 |
| Chain | Ethereum |
| Proxy Status | ✅ No |
| OZ AccessControl | ✅ Yes |
| Ownable | ✅ Yes |
| Pausable | — |
| ERC-4626 Vault | ✅ Underlying: `0x4c9EDD5852cd905f086C759E8383e09bff1E68B3` |
| Control Surface | — |
| Scan Integrity | ✅ No issues detected |
| Report Date | 2026-06-25 23:07 UTC |

### Surface Summary

| Field | Value |
|---|---:|
| Contracts | 5 |
| Role slots | 13 |
| Privileged Fns | 18 |
| EOA Holders | 3 ⚠️ |
| Critical Roles | 2 ⚠️ |

## Changes Since Last Scan

> Comparing **2026-06-02T22:18:17Z** (block 25232619) → **2026-06-25T23:06:57Z** (block 25397797).

### Roles
- 🔄 `FULL_RESTRICTED_STAKER_ROLE` on **StakedUSDeV2** (`0x9d39a5…3497`)
    - member ➕ `0x024304…7ef1`
    - member ➕ `0x05a2a0…56f1`
    - member ➕ `0x05d25f…d0b2`
    - member ➕ `0x061d5d…a153`
    - member ➕ `0x07c5bb…6292`
    - member ➕ `0x0af4e0…7a35`
    - member ➕ `0x0bf40d…2d95`
    - member ➕ `0x0cfea1…bfa2`
    - member ➕ `0x0eed55…f0ab`
    - member ➕ `0x10c5b5…87f7`
    - member ➕ `0x10ef12…a3d6`
    - member ➕ `0x131015…38e0`
    - member ➕ `0x198c6d…247c`
    - member ➕ `0x1c2328…fff8`
    - member ➕ `0x1d60ab…cb65`
    - member ➕ `0x1e5a12…acad`
    - member ➕ `0x267028…de39`
    - member ➕ `0x26aa47…a9e7`
    - member ➕ `0x26caf6…0318`
    - member ➕ `0x27c036…51f2`
    - member ➕ `0x2add70…354c`
    - member ➕ `0x35e6ef…a57e`
    - member ➕ `0x3e797d…df48`
    - member ➕ `0x420554…a9eb`
    - member ➕ `0x4243bf…f359`
    - member ➕ `0x45c603…2c4d`
    - member ➕ `0x462f21…1f9b`
    - member ➕ `0x46c5ae…ffba`
    - member ➕ `0x46c6e1…7313`
    - member ➕ `0x48467b…4aa6`
    - member ➕ `0x494852…c855`
    - member ➕ `0x4b9cd4…0801`
    - member ➕ `0x4f4e21…b291`
    - member ➕ `0x5062d1…d80b`
    - member ➕ `0x509253…3bc9`
    - member ➕ `0x518d80…d4a5`
    - member ➕ `0x530b81…b808`
    - member ➕ `0x54297f…ef5a`
    - member ➕ `0x548abe…49d2`
    - member ➕ `0x586849…a3d6`
    - member ➕ `0x5910a9…e697`
    - member ➕ `0x5af96f…f2f7`
    - member ➕ `0x5c278f…e72b`
    - member ➕ `0x6485bb…a83c`
    - member ➕ `0x65319d…51ab`
    - member ➕ `0x65991e…4b50`
    - member ➕ `0x67b482…a7f6`
    - member ➕ `0x688d5c…c463`
    - member ➕ `0x6dd526…5688`
    - member ➕ `0x6e8e8c…721d`
    - member ➕ `0x6e9c5a…e190`
    - member ➕ `0x71a478…4a4a`
    - member ➕ `0x726920…119f`
    - member ➕ `0x735e74…52f3`
    - member ➕ `0x739466…6fd1`
    - member ➕ `0x739dea…452f`
    - member ➕ `0x7408ee…631c`
    - member ➕ `0x7849ba…a32e`
    - member ➕ `0x78cfe1…0367`
    - member ➕ `0x79f798…14e8`
    - member ➕ `0x7ab33a…a22e`
    - member ➕ `0x7cbc8f…705c`
    - member ➕ `0x7e96a4…7f9d`
    - member ➕ `0x86bc48…ef88`
    - member ➕ `0x86bf73…cefe`
    - member ➕ `0x8773db…3c01`
    - member ➕ `0x881fd9…4185`
    - member ➕ `0x8c0528…c848`
    - member ➕ `0x8d87fe…e680`
    - member ➕ `0x8e2b06…b738`
    - member ➕ `0x8eaacd…58e6`
    - member ➕ `0x906e6c…927e`
    - member ➕ `0x92d208…23ca`
    - member ➕ `0x978d82…b984`
    - member ➕ `0x99f512…0f02`
    - member ➕ `0x9a9c93…eac4`
    - member ➕ `0x9ab00d…03d5`
    - member ➕ `0x9be57b…7516`
    - member ➕ `0x9be5b8…7516`
    - member ➕ `0xa04a19…d359`
    - member ➕ `0xa25e59…340f`
    - member ➕ `0xa56ab8…45ed`
    - member ➕ `0xa5ddd7…6fda`
    - member ➕ `0xa6c2df…3846`
    - member ➕ `0xa70341…cd8f`
    - member ➕ `0xa93c5d…0b92`
    - member ➕ `0xa95d91…d09f`
    - member ➕ `0xaba491…33f5`
    - member ➕ `0xb1449b…6998`
    - member ➕ `0xb22684…a573`
    - member ➕ `0xb2431e…c924`
    - member ➕ `0xb593d5…c75f`
    - member ➕ `0xb5f715…5480`
    - member ➕ `0xb757df…77a3`
    - member ➕ `0xb8de72…7c5a`
    - member ➕ `0xbc6313…d559`
    - member ➕ `0xbd1504…5daa`
    - member ➕ `0xbe85fe…606b`
    - member ➕ `0xbf5ca1…9a13`
    - member ➕ `0xbf72ca…19a9`
    - member ➕ `0xc0db7f…3d86`
    - member ➕ `0xc0de34…a4fb`
    - member ➕ `0xc2bb00…0267`
    - member ➕ `0xca29b1…fbe1`
    - member ➕ `0xcb8697…eb55`
    - member ➕ `0xcbb691…a9cf`
    - member ➕ `0xd09e06…72ac`
    - member ➕ `0xd2c4f9…890f`
    - member ➕ `0xd2f8ec…2276`
    - member ➕ `0xd7e42d…bd22`
    - member ➕ `0xe0a4be…4894`
    - member ➕ `0xe39a4f…2e57`
    - member ➕ `0xe72295…e9a8`
    - member ➕ `0xe79538…82ba`
    - member ➕ `0xe88cc9…1869`
    - member ➕ `0xe99d1b…2430`
    - member ➕ `0xea6268…4e78`
    - member ➕ `0xeced01…cfa4`
    - member ➕ `0xee1a24…791c`
    - member ➕ `0xf9926b…3c04`
    - member ➕ `0xf9a04c…7627`
    - member ➕ `0xfb96e3…9403`
    - member ➕ `0xfbe891…b90d`
    - member ➕ `0xfc384d…8545`
    - member ➕ `0xfe20dd…a699`

### Parameters
- 🔄 `transferInRewards` on **StakingRewardsDistributor** (`0xf2fa33…b439`)
    - set_at_block: `25230944` → `25396095`


## 📋 Protocol Context

> *From protocol profile: Ethena / StakedUSDeV2 (ERC-4626 Vault)*

<details>
<summary><strong>Architecture</strong></summary>

- **Architectural shape:** Inherits USDe's authority model — Safe 5/10 holds REWARDER_ROLE + DEFAULT_ADMIN_ROLE; one EOA holds operator() on StakingRewardsDistributor (downstream reward inflows). Cooldown duration is the primary withdrawal-control lever. 70 sanctioned addresses correctly enforced via FULL_RESTRICTED_STAKER_ROLE blacklist.
- **ERC-4626 vault:** deposit USDe, receive sUSDe shares that appreciate as rewards stream in
- **Yield accrual:** REWARDER_ROLE calls transferInRewards() -> USDe added without minting shares -> price-per-share rises
- **Vesting:** incoming rewards vest linearly over VESTING_PERIOD (8 hours) via StakedUSDe.getUnvestedAmount()
- **Cooldown system:** when cooldownDuration > 0, withdraw/redeem revert; users must call cooldownShares/cooldownAssets then unstake() after the wait
- USDeSilo (0x7fc7...3425) escrows USDe during the cooldown window — funds are held by the silo, not the vault
- **Two-tier blacklist:** FULL_RESTRICTED (cannot send/receive/redeem; seizable) vs SOFT_RESTRICTED (cannot deposit/mint)
- **SingleAdminAccessControl:** only one DEFAULT_ADMIN at a time, with two-step transferAdmin + acceptAdmin handoff
- NOT a proxy — direct deployment, bytecode is immutable; silo() reference is immutable

</details>

<details>
<summary><strong>Function Interaction Paths</strong></summary>

- **`addToBlacklist(addr, isFullBlacklisting=true)`** (`BLACKLIST_MANAGER_ROLE (or DEFAULT_ADMIN_ROLE)`)
  - _beforeTokenTransfer reverts when from OR to holds FULL_RESTRICTED_STAKER_ROLE — blocks deposit, redeem, transfer, and cooldown flows
  - Target's sUSDe balance becomes inaccessible — cannot be moved, unstaked, or redeemed by the user
  - Admin gains the ability to call redistributeLockedAmount() to reassign the frozen balance
  - ⚠️ *FULL blacklist has SUPPLY-level blast radius — it freezes vault shares, not just outbound transfers. Currently held by two EOAs (single-key risk).*
- **`addToBlacklist(addr, isFullBlacklisting=false)`** (`BLACKLIST_MANAGER_ROLE (or DEFAULT_ADMIN_ROLE)`)
  - Target gains SOFT_RESTRICTED_STAKER_ROLE — deposit() and mint() revert for this address
  - Existing sUSDe remains transferable; cooldown and redeem flows continue to work
  - ⚠️ *Soft tier is a deposit gate only — no fund-seizure path, no transfer block*
- **`setCooldownDuration(0)`** (`DEFAULT_ADMIN_ROLE`)
  - Contract switches to standard ERC-4626 mode — withdraw() and redeem() become callable
  - cooldownShares/cooldownAssets revert (OperationNotAllowed)
  - USDeSilo still holds any in-flight cooldown balances from the prior mode
  - ⚠️ *Removes all withdrawal friction — enables instant exits, which is a bank-run vector on a vault backing FiRM collateral*
- **`setCooldownDuration(7776000)`** (`DEFAULT_ADMIN_ROLE`)
  - Sets cooldown to the contract maximum (MAX_COOLDOWN_DURATION = 90 days)
  - withdraw/redeem revert; users must go through cooldownShares -> wait -> unstake
  - USDeSilo holds all unstaking USDe for up to 90 days
  - ⚠️ *Max cooldown traps user funds for 90 days — critical liquidity risk for any lending protocol pricing sUSDe as near-liquid collateral*
- **`transferInRewards(amount)`** (`REWARDER_ROLE`)
  - Pulls USDe from caller into the vault; no new sUSDe shares minted
  - Amount vests over 8h via getUnvestedAmount() — totalAssets() rises gradually
  - Exchange rate sUSDe/USDe increases for all holders proportionally
  - ⚠️ *Yield injection point. Oversized or mistimed amounts distort sUSDe pricing; underflow to zero starves yield but does not burn principal.*
- **`redistributeLockedAmount(from, to)`** (`DEFAULT_ADMIN_ROLE`)
  - Requires `from` to hold FULL_RESTRICTED_STAKER_ROLE — reverts otherwise
  - Burns the entire sUSDe balance of `from`; mints an equal share amount to `to`
  - If `to == address(0)`, the USDe backing those shares is withdrawn to the admin
  - ⚠️ *Confiscation primitive — admin can seize sanctioned users' vault shares or unwind them to underlying USDe. Scanner observed 1 historical call on 2026-01-15.*
- **`rescueTokens(token, amount, to)`** (`DEFAULT_ADMIN_ROLE`)
  - Transfers arbitrary ERC20 balances out of the vault
  - Explicitly reverts when token == USDe — protects underlying vault backing
  - ⚠️ *Cannot touch USDe principal. Risk is limited to reward tokens or stuck transfers.*

</details>

<details>
<summary><strong>Cross-Contract Dependencies</strong></summary>

- **`USDe`** — `0x4c9EDD5852cd905f086C759E8383e09bff1E68B3`
  - *Relation:* Underlying asset (ERC-4626 asset()) — cannot be rescued out; vault is pure wrapper
- **`USDeSilo`** — `0x7fC7C91D556b400aFa565013e3F32055A0713425`
  - *Relation:* Cooldown escrow — holds unstaking USDe during the cooldown window; silo() is immutable on vault
- **`StakingRewardsDistributor`** — `0xf2fa332bD83149c66b09B45670bCe64746C6b439`
  - *Relation:* Holds REWARDER_ROLE — its operator() (EOA 0xe388...646e, CRITICAL) triggers transferInRewards
- **`Safe_5of11_Admin`** — `0x3B0AAf6e6fCd4a7cEEf8c92C32DFeA9E64dC1862`
  - *Relation:* DEFAULT_ADMIN_ROLE + REWARDER_ROLE — primary governance multisig
- **`Safe_3of11_Rewarder`** — `0x71E4f98e8f20C88112489de3DDEd4489802a3A87`
  - *Relation:* REWARDER_ROLE — secondary rewarder multisig (3/10 threshold)

</details>

## 📑 Table of Contents

1. [Analyst Focus Areas](#analyst-focus-areas)
2. Contracts
   - [sUSDe ★](#c-0x9d39a5de30e57443bff2a8307a4256c8797a3497)
   - [StakingRewardsDistributor](#c-0xf2fa332bd83149c66b09b45670bce64746c6b439)
   - [USDeSilo](#c-0x7fc7c91d556b400afa565013e3f32055a0713425)
3. [⚡ Authority Concentration](#-authority-concentration)
4. [⛔ Sanctions Screening](#-sanctions-screening)
5. [EOA Exposure Summary](#eoa-exposure-summary)
6. [✅ Scan Integrity](#scan-integrity)

## Analyst Focus Areas

> **Observational findings — not risk determinations.** Each item below is a focus point for the Risk Analyst to interpret against collateralization context and the protocol's stated intent. Attention levels (CRITICAL / HIGH / LOW) reflect the scanner's heuristic weight — not a realized risk to FiRM. These observations support future risk assessments; they do not constitute one.

> **1 critical-attention** and **13 high-attention** observation(s) across 5 contract(s).


### 🔴 CRITICAL (1)

- 🔴 [**Observed: EOA holds `operator()` on StakingRewardsDistributor**](#c-0xf2fa332bd83149c66b09b45670bce64746c6b439) — `0xe3880B792F6F0f8795CbAACd92E7Ca78F5d3646e` (EOA) — single key controls [SUPPLY] capability. Assess custody and intent.

### 🟠 HIGH (13)

- 🟠 [**Observed: EOA holds `BLACKLIST_MANAGER_ROLE` on StakedUSDeV2**](#c-0x9d39a5de30e57443bff2a8307a4256c8797a3497) — `0x21F9236e8EE76474284FE8cdE6EcE6c8D19D781e` (EOA) — single key controls privileged functions. Assess custody and intent.
- 💰 **Observed: 3 role(s) with supply-altering capability** — Supply-altering surface detected: `DEFAULT_ADMIN_ROLE` on StakedUSDeV2, `REWARDER_ROLE` on StakedUSDeV2, `operator()` on StakingRewardsDistributor. Assess each holder's custody and governance.
- 🚦 **Observed: no observable pause mechanism for supply** — Supply-altering surface detected on `StakedUSDeV2`, `StakingRewardsDistributor` but no PAUSE-capable role or pause()/unpause() ABI declaration was found across any in-scope contract. In an incident, there is no on-chain path to halt new issuance. Verify whether this is intentional (e.g. supply gated at a higher-level Fed or Custodian contract) or an oversight.
- 🔗 [**Observed: supply authority chain on GnosisSafe**](#c-0x9d39a5de30e57443bff2a8307a4256c8797a3497) — Chain: StakedUSDeV2 → `REWARDER_ROLE` → GnosisSafe. Controlled by: `Safe Owners (3/10 required)`. Assess custody — compromise of this chain could affect root token supply.
- 🔗 [**Observed: supply authority chain on StakingRewardsDistributor**](#c-0xf2fa332bd83149c66b09b45670bce64746c6b439) — Chain: StakedUSDeV2 → `REWARDER_ROLE` → StakingRewardsDistributor. Controlled by: `operator()`, `owner()`. Assess custody — compromise of this chain could affect root token supply.
- ⚠️ [**No Timelock in admin chain: `REWARDER_ROLE` on StakedUSDeV2**](#c-0x9d39a5de30e57443bff2a8307a4256c8797a3497) — `REWARDER_ROLE` has SUPPLY capability and is held by: `0x3B0A...1862` (Safe), `0x71E4...3A87` (Safe), `0xf2fa...b439` (Contract). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `DEFAULT_ADMIN_ROLE` on StakedUSDeV2**](#c-0x9d39a5de30e57443bff2a8307a4256c8797a3497) — `DEFAULT_ADMIN_ROLE` has SUPPLY capability and is held by: `0x3B0A...1862` (Safe). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `operator()` on StakingRewardsDistributor**](#c-0xf2fa332bd83149c66b09b45670bce64746c6b439) — `operator()` has SUPPLY capability and is held by: `0xe388...646e` (EOA). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.

<details>
<summary>🔄 **4 volatile parameter(s) observed across 2 contract(s) (≥5 historical changes each)** — Operational tempo signal — high-velocity setters indicate active governance maintenance, oracle keepers, or routinely-tuned risk parameters. Expand to review each parameter's change count and current value; assess against the protocol's stated intent.</summary>

- 🔄 [**Observed: volatile parameter `cooldownDuration` on StakedUSDeV2**](#c-0x9d39a5de30e57443bff2a8307a4256c8797a3497) — `setCooldownDuration(uint24 duration)` changed 7 times. Current value: `86400`. Assess change pattern.
- 🔄 [**Observed: volatile parameter `transferInRewards` on StakedUSDeV2**](#c-0x9d39a5de30e57443bff2a8307a4256c8797a3497) — `transferInRewards(uint256 amount)` changed 7 times. Current value: ``. Assess change pattern.
- 🔄 [**Observed: volatile parameter `operator` on StakingRewardsDistributor**](#c-0xf2fa332bd83149c66b09b45670bce64746c6b439) — `setOperator(address _newOperator)` changed 6 times. Current value: `0xe3880B792F6F0f8795CbAACd92E7Ca78F5d3646e`. Assess change pattern.
- 🔄 [**Observed: volatile parameter `transferInRewards` on StakingRewardsDistributor**](#c-0xf2fa332bd83149c66b09b45670bce64746c6b439) — `transferInRewards(uint256 _rewardsAmount)` changed 2489 times. Current value: ``. Assess change pattern.

</details>


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
<a id="c-0x9d39a5de30e57443bff2a8307a4256c8797a3497"></a>
## StakedUSDeV2 `0x9D39A5DE30e57443BfF2A8307A4256c8797A3497`

🔒 **Immutable References:** `silo()` → USDeSilo

✅ **Two-step admin transfer:** `transferAdmin + acceptAdmin` — prevents accidental hand-off (request → accept flow).

### 🟢 `DEFAULT_ADMIN_ROLE`

**Hash:** `0x0000000000000000000000000000000000000000000000000000000000000000`  
**Managed by:** `DEFAULT_ADMIN_ROLE`  
**Privileged write functions:**  
**Capabilities:** ⚙️ **CONFIG** 💰 **SUPPLY**
- `setCooldownDuration(uint24 duration)` — Set cooldown duration. If cooldown duration is set to zero, the StakedUSDeV2 behavior changes to follow ERC4626 standard and disables cooldownShares and cooldownAssets methods. If cooldown duration is greater than zero, the ERC4626 withdrawal and redeem functions are disabled, breaking the ERC4626 standard, and enabling the cooldownShares and the cooldownAssets functions. `[CONFIG]`
- `rescueTokens(address token, uint256 amount, address to)` — Allows the owner to rescue tokens accidentally sent to the contract. Note that the owner cannot rescue USDe tokens because they functionally sit here `[CONFIG]`
- `redistributeLockedAmount(address from, address to)` — Burns the full restricted user amount and mints to the desired owner address. / `[SUPPLY]`
- `transferAdmin(address newAdmin)` — Transfer the admin role to a new address This can ONLY be executed by the current admin
- `grantRole(bytes32 role, address account)` — grant a role can only be executed by the current single admin admin role cannot be granted externally
- `revokeRole(bytes32 role, address account)` — revoke a role can only be executed by the current admin admin role cannot be revoked
- `acceptAdmin()` — Second step of `transferAdmin + acceptAdmin` — callable by the pending holder set via `transferAdmin`, not by the current role. Included here to surface the full transfer handoff. `[CONFIG]`

**Members (1):**

| Address | Name / Type | Risk | Granted | Source | Details |
|---|---|---|---|---|---|
| `0x3B0AAf6e6fCd4a7cEEf8c92C32DFeA9E64dC1862` | GnosisSafeProxy | 🟢 LOW | 2023-11-14 | Events only · hasRole ✓ | 5/10 signers |

**Signers of `GnosisSafeProxy` (0x3B0A...1862):**

| Signer | Type | Owner Since | Notes |
|---|---|---|---|
| `0x18d32B1AB042b5E9a3430e77fDE8B4783A019234` | EOA | 2025-04-29 | EOA |
| `0xb93C042c688F1Cf038bab03C4F832F2630Bb7d8F` | EOA | 2025-04-11 | EOA |
| `0x66892C66711B2640360C3123E6C23C0cFa50550F` | EOA | 2024-04-04 | EOA |
| `0xE3F95F2e1aDEC092337FB5D93C1fE87558658b11` | EOA | 2024-04-04 | EOA |
| `0x99682F56F4ccCF61BD7e449924f2f62D395e1E45` | EOA | 2024-02-21 | EOA |
| `0x980742eDEA6b0df3566C19Ff4945c57E95449a13` | EOA | 2025-10-15 | EOA |
| `0x54D0D64f7326b128959bf37Ed7B5f2510656a471` | EOA | 2023-11-20 | EOA |
| `0xFBE49A82CB2BFF6Fa4C2B1F0d165A5E1175Aac83` | EOA | — | EOA |
| `0xE987E14b2E204fdf5827a3cFCa7D476E8Df6a99E` | EOA | 2023-11-15 | EOA |
| `0xe5cA87dA3A209aD85FdcbB515e1bD92644e9E1A6` | EOA | 2023-11-15 | EOA |

**Quorum history:**
  - 2023-11-14: 🔴 decreased 5 → 2
  - 2023-11-20: 🟢 increased 2 → 3
  - 2023-11-20: 🟢 increased 3 → 4
  - 2024-01-17: 🟢 increased 4 → 5

### 🟠 `REWARDER_ROLE`

**Hash:** `0xbeec13769b5f410b0584f69811bfd923818456d5edcf426b0e31cf90eed7a3f6`  
**Managed by:** `DEFAULT_ADMIN_ROLE`  
**Privileged write functions:**  
**Capabilities:** 💰 **SUPPLY**
- `transferInRewards(uint256 amount)` — Allows the owner to transfer rewards from the controller contract into this contract. / `[SUPPLY]`

**Members (3):**

| Address | Name / Type | Risk | Granted | Source | Details |
|---|---|---|---|---|---|
| `0x3B0AAf6e6fCd4a7cEEf8c92C32DFeA9E64dC1862` | GnosisSafeProxy | 🟢 LOW | 2023-11-14 | Events only · hasRole ✓ | 5/10 signers |
| `0x71E4f98e8f20C88112489de3DDEd4489802a3A87` | Gnosis Safe 3/10 | 🟢 LOW | 2024-01-17 | Events only · hasRole ✓ | 3/10 signers |
| `0xf2fa332bD83149c66b09B45670bCe64746C6b439` | StakingRewardsDistributor | 🟠 HIGH | 2024-03-12 | Events only · hasRole ✓ |  |

**Signers of `GnosisSafeProxy` (0x3B0A...1862):**

| Signer | Type | Owner Since | Notes |
|---|---|---|---|
| `0x18d32B1AB042b5E9a3430e77fDE8B4783A019234` | EOA | 2025-04-29 | EOA |
| `0xb93C042c688F1Cf038bab03C4F832F2630Bb7d8F` | EOA | 2025-04-11 | EOA |
| `0x66892C66711B2640360C3123E6C23C0cFa50550F` | EOA | 2024-04-04 | EOA |
| `0xE3F95F2e1aDEC092337FB5D93C1fE87558658b11` | EOA | 2024-04-04 | EOA |
| `0x99682F56F4ccCF61BD7e449924f2f62D395e1E45` | EOA | 2024-02-21 | EOA |
| `0x980742eDEA6b0df3566C19Ff4945c57E95449a13` | EOA | 2025-10-15 | EOA |
| `0x54D0D64f7326b128959bf37Ed7B5f2510656a471` | EOA | 2023-11-20 | EOA |
| `0xFBE49A82CB2BFF6Fa4C2B1F0d165A5E1175Aac83` | EOA | — | EOA |
| `0xE987E14b2E204fdf5827a3cFCa7D476E8Df6a99E` | EOA | 2023-11-15 | EOA |
| `0xe5cA87dA3A209aD85FdcbB515e1bD92644e9E1A6` | EOA | 2023-11-15 | EOA |

**Quorum history:**
  - 2023-11-14: 🔴 decreased 5 → 2
  - 2023-11-20: 🟢 increased 2 → 3
  - 2023-11-20: 🟢 increased 3 → 4
  - 2024-01-17: 🟢 increased 4 → 5

**Signers of `Gnosis Safe 3/10` (0x71E4...3A87):**

| Signer | Type | Owner Since | Notes |
|---|---|---|---|
| `0x66096e581863EC2682e4E317Da41B80510a274F6` | EOA | 2026-05-28 🆕 | EOA |
| `0x18d32B1AB042b5E9a3430e77fDE8B4783A019234` | EOA | 2025-04-29 | EOA |
| `0xb93C042c688F1Cf038bab03C4F832F2630Bb7d8F` | EOA | 2025-04-10 | EOA |
| `0x66892C66711B2640360C3123E6C23C0cFa50550F` | EOA | 2025-01-02 | EOA |
| `0xE3F95F2e1aDEC092337FB5D93C1fE87558658b11` | EOA | 2024-10-10 | EOA |
| `0x99682F56F4ccCF61BD7e449924f2f62D395e1E45` | EOA | 2024-02-21 | EOA |
| `0x980742eDEA6b0df3566C19Ff4945c57E95449a13` | EOA | 2025-10-16 | EOA |
| `0x54D0D64f7326b128959bf37Ed7B5f2510656a471` | EOA | — | EOA |
| `0xE987E14b2E204fdf5827a3cFCa7D476E8Df6a99E` | EOA | — | EOA |
| `0xe5cA87dA3A209aD85FdcbB515e1bD92644e9E1A6` | EOA | — | EOA |

**Quorum history:**
  - 2025-10-23: ⚪ unchanged 3 → 3

### 🟢 `admin()`


**Members (1):**

| Address | Name / Type | Risk | Granted | Source | Details |
|---|---|---|---|---|---|
| `0x3B0AAf6e6fCd4a7cEEf8c92C32DFeA9E64dC1862` | GnosisSafeProxy | 🟢 LOW | — | Events only | 5/10 signers |

**Signers of `GnosisSafeProxy` (0x3B0A...1862):**

| Signer | Type | Owner Since | Notes |
|---|---|---|---|
| `0x18d32B1AB042b5E9a3430e77fDE8B4783A019234` | EOA | 2025-04-29 | EOA |
| `0xb93C042c688F1Cf038bab03C4F832F2630Bb7d8F` | EOA | 2025-04-11 | EOA |
| `0x66892C66711B2640360C3123E6C23C0cFa50550F` | EOA | 2024-04-04 | EOA |
| `0xE3F95F2e1aDEC092337FB5D93C1fE87558658b11` | EOA | 2024-04-04 | EOA |
| `0x99682F56F4ccCF61BD7e449924f2f62D395e1E45` | EOA | 2024-02-21 | EOA |
| `0x980742eDEA6b0df3566C19Ff4945c57E95449a13` | EOA | 2025-10-15 | EOA |
| `0x54D0D64f7326b128959bf37Ed7B5f2510656a471` | EOA | 2023-11-20 | EOA |
| `0xFBE49A82CB2BFF6Fa4C2B1F0d165A5E1175Aac83` | EOA | — | EOA |
| `0xE987E14b2E204fdf5827a3cFCa7D476E8Df6a99E` | EOA | 2023-11-15 | EOA |
| `0xe5cA87dA3A209aD85FdcbB515e1bD92644e9E1A6` | EOA | 2023-11-15 | EOA |

**Quorum history:**
  - 2023-11-14: 🔴 decreased 5 → 2
  - 2023-11-20: 🟢 increased 2 → 3
  - 2023-11-20: 🟢 increased 3 → 4
  - 2024-01-17: 🟢 increased 4 → 5

### 🟢 `owner()`


**Members (1):**

| Address | Name / Type | Risk | Granted | Source | Details |
|---|---|---|---|---|---|
| `0x3B0AAf6e6fCd4a7cEEf8c92C32DFeA9E64dC1862` | GnosisSafeProxy | 🟢 LOW | — | Storage only | 5/10 signers |

**Signers of `GnosisSafeProxy` (0x3B0A...1862):**

| Signer | Type | Owner Since | Notes |
|---|---|---|---|
| `0x18d32B1AB042b5E9a3430e77fDE8B4783A019234` | EOA | 2025-04-29 | EOA |
| `0xb93C042c688F1Cf038bab03C4F832F2630Bb7d8F` | EOA | 2025-04-11 | EOA |
| `0x66892C66711B2640360C3123E6C23C0cFa50550F` | EOA | 2024-04-04 | EOA |
| `0xE3F95F2e1aDEC092337FB5D93C1fE87558658b11` | EOA | 2024-04-04 | EOA |
| `0x99682F56F4ccCF61BD7e449924f2f62D395e1E45` | EOA | 2024-02-21 | EOA |
| `0x980742eDEA6b0df3566C19Ff4945c57E95449a13` | EOA | 2025-10-15 | EOA |
| `0x54D0D64f7326b128959bf37Ed7B5f2510656a471` | EOA | 2023-11-20 | EOA |
| `0xFBE49A82CB2BFF6Fa4C2B1F0d165A5E1175Aac83` | EOA | — | EOA |
| `0xE987E14b2E204fdf5827a3cFCa7D476E8Df6a99E` | EOA | 2023-11-15 | EOA |
| `0xe5cA87dA3A209aD85FdcbB515e1bD92644e9E1A6` | EOA | 2023-11-15 | EOA |

**Quorum history:**
  - 2023-11-14: 🔴 decreased 5 → 2
  - 2023-11-20: 🟢 increased 2 → 3
  - 2023-11-20: 🟢 increased 3 → 4
  - 2024-01-17: 🟢 increased 4 → 5

### 🔴 `BLACKLIST_MANAGER_ROLE`

**Hash:** `0xf988e4fb62b8e14f4820fed03192306ddf4d7dbfa215595ba1c6ba4b76b369ee`  
**Managed by:** `DEFAULT_ADMIN_ROLE`  
**Privileged write functions:**
- `addToBlacklist(address target, bool isFullBlacklisting)` — Allows the owner (DEFAULT_ADMIN_ROLE) and blacklist managers to blacklist addresses. /
- `removeFromBlacklist(address target, bool isFullBlacklisting)` — Allows the owner (DEFAULT_ADMIN_ROLE) and blacklist managers to un-blacklist addresses. /

**Members (3):**

| Address | Name / Type | Risk | Granted | Source | Details |
|---|---|---|---|---|---|
| `0x21F9236e8EE76474284FE8cdE6EcE6c8D19D781e` | EOA | 🔴 CRITICAL | 2024-06-18 | Events only · hasRole ✓ | ⚠️ Single private key |
| `0x3B0AAf6e6fCd4a7cEEf8c92C32DFeA9E64dC1862` | GnosisSafeProxy | 🟢 LOW | 2024-04-29 | Events only · hasRole ✓ | 5/10 signers |
| `0x49e9f81A5cE0d492799c14049aEF12Df7BC955fE` | EOA | 🔴 CRITICAL | 2026-01-13 | Events only · hasRole ✓ | ⚠️ Single private key |

**Signers of `GnosisSafeProxy` (0x3B0A...1862):**

| Signer | Type | Owner Since | Notes |
|---|---|---|---|
| `0x18d32B1AB042b5E9a3430e77fDE8B4783A019234` | EOA | 2025-04-29 | EOA |
| `0xb93C042c688F1Cf038bab03C4F832F2630Bb7d8F` | EOA | 2025-04-11 | EOA |
| `0x66892C66711B2640360C3123E6C23C0cFa50550F` | EOA | 2024-04-04 | EOA |
| `0xE3F95F2e1aDEC092337FB5D93C1fE87558658b11` | EOA | 2024-04-04 | EOA |
| `0x99682F56F4ccCF61BD7e449924f2f62D395e1E45` | EOA | 2024-02-21 | EOA |
| `0x980742eDEA6b0df3566C19Ff4945c57E95449a13` | EOA | 2025-10-15 | EOA |
| `0x54D0D64f7326b128959bf37Ed7B5f2510656a471` | EOA | 2023-11-20 | EOA |
| `0xFBE49A82CB2BFF6Fa4C2B1F0d165A5E1175Aac83` | EOA | — | EOA |
| `0xE987E14b2E204fdf5827a3cFCa7D476E8Df6a99E` | EOA | 2023-11-15 | EOA |
| `0xe5cA87dA3A209aD85FdcbB515e1bD92644e9E1A6` | EOA | 2023-11-15 | EOA |

**Quorum history:**
  - 2023-11-14: 🔴 decreased 5 → 2
  - 2023-11-20: 🟢 increased 2 → 3
  - 2023-11-20: 🟢 increased 3 → 4
  - 2024-01-17: 🟢 increased 4 → 5

### 🔴 `FULL_RESTRICTED_STAKER_ROLE` 🔄 741 changes · 👤 user

**Hash:** `0x0a4af4bcc1942295207d9f047442ebdae6170a6e324850f758b14cf99b65c3bd`  
**Managed by:** `DEFAULT_ADMIN_ROLE`  

**Members: 705** _(KYC-whitelisted participants — individual addresses omitted)_


#### 🔧 Permissioned Parameters

**`cooldownDuration`** 🔄 **ACTIVE** (7 changes)

> ⚠️ This parameter has been changed **7 times** — monitor for unexpected modifications.

| Field | Value |
|---|---|
| Current Value | `86400` |
| Hard cap | 🔒 `7776000` (MAX_COOLDOWN_DURATION) |
| Setter | `setCooldownDuration(uint24 duration)` |
| Gated by | `DEFAULT_ADMIN_ROLE` |
| Tags | `CONFIG` |
| Last changed | 2026-03-16 |
| Changed by | `0x3B0A...1862` (GnosisSafeProxy) |
| Total changes | 7 🔄 |

**Recent changes (showing last 5 of 7):**

| # | Value | Set By | Date |
|---|---|---|---|
| 1 | `duration=86400` | `0x3B0A...1862` (GnosisSafeProxy) | 2026-03-16 |
| 2 | `duration=86400` | `0x3B0A...1862` (GnosisSafeProxy) | 2026-03-16 |
| 3 | `duration=86400` | `0x3B0A...1862` (GnosisSafeProxy) | 2026-03-16 |
| 4 | `duration=86400` | `0x3B0A...1862` (GnosisSafeProxy) | 2026-03-16 |
| 5 | `duration=86400` | `0x3B0A...1862` (GnosisSafeProxy) | 2026-03-16 |

#### 💰 Supply Actions

_Mint / redeem / burn call tracking — last 5 calls per function, total counts preserved._

**`redistributeLockedAmount`** *(per-asset)*

| Field | Value |
|---|---|
| Setter | `redistributeLockedAmount(address from, address to)` |
| Gated by | `DEFAULT_ADMIN_ROLE` |
| Tags | `SUPPLY` |
| Last called | 2026-05-12 |
| Called by | `0x3B0A...1862` (GnosisSafeProxy) |
| Total calls | 2 |

**Recent changes:**

| # | Asset | Value | Set By | Date |
|---|---|---|---|---|
| 1 | EOA | `to=0x3B0AAf6e6fCd4a7cEEf8c92C32DFeA9E64dC1862` | `0x3B0A...1862` (GnosisSafeProxy) | 2026-05-12 |
| 2 | EOA | `to=0x3B0AAf6e6fCd4a7cEEf8c92C32DFeA9E64dC1862` | `0x3B0A...1862` (GnosisSafeProxy) | 2026-01-15 |

**`transferInRewards`** 🔄 **ACTIVE** (7 changes)

> ⚠️ This parameter has been changed **7 times** — monitor for unexpected modifications.

| Field | Value |
|---|---|
| Setter | `transferInRewards(uint256 amount)` |
| Gated by | `REWARDER_ROLE` |
| Tags | `SUPPLY` |
| Last called | 2024-03-07 |
| Called by | `0x71E4...3A87` (Gnosis Safe 3/10) |
| Total calls | 7 🔄 |

**Recent changes (showing last 5 of 7):**

| # | Value | Set By | Date |
|---|---|---|---|
| 1 | `amount=2213611000000000000000000 (2,213,611.000000e18)` | `0x71E4...3A87` (Gnosis Safe 3/10) | 2024-03-07 |
| 2 | `amount=1066248000000000000000000 (1,066,248.000000e18)` | `0x71E4...3A87` (Gnosis Safe 3/10) | 2024-02-29 |
| 3 | `amount=227500000000000000000000 (227,500.000000e18)` | `0x71E4...3A87` (Gnosis Safe 3/10) | 2024-02-23 |
| 4 | `amount=403438000000000000000000 (403,438.000000e18)` | `0x71E4...3A87` (Gnosis Safe 3/10) | 2024-02-22 |
| 5 | `amount=604063000000000000000000 (604,063.000000e18)` | `0x71E4...3A87` (Gnosis Safe 3/10) | 2024-02-15 |

---
<a id="c-0xf2fa332bd83149c66b09b45670bce64746c6b439"></a>
## > StakingRewardsDistributor `0xf2fa332bD83149c66b09B45670bCe64746C6b439`

> > 💰 **Inherited supply authority** — holds `REWARDER_ROLE` on **StakedUSDeV2**. Access controls on this contract gate root token supply.

> 🔒 **Immutable References:** `USDE_TOKEN()` → USDe (USDe), `mintContract()` → EthenaMinting, `STAKING_VAULT()` → sUSDe (StakedUSDeV2)

> ✅ **Two-step admin transfer:** `OZ Ownable2Step` — prevents accidental hand-off (request → accept flow).

### > 🔴 `operator()`

> **Privileged write functions:**  
> **Capabilities:** 💰 **SUPPLY**
> - `transferInRewards(uint256 _rewardsAmount)` — only the operator can call transferInRewards in order to transfer USDe to the staking contract In order to use this function, we need to set this contract as the REWARDER_ROLE in the staking contract `[SUPPLY]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xe3880B792F6F0f8795CbAACd92E7Ca78F5d3646e` | EOA | 🔴 CRITICAL | — | Storage+Events | ⚠️ Single private key |

### > 🟢 `owner()`

> **Privileged write functions:**  
> **Capabilities:** ⚙️ **CONFIG**
> - `rescueTokens(address _token, address _to, uint256 _amount)` — owner can rescue tokens that were accidentally sent to the contract only available for the owner `[CONFIG]`
> - `setMintingContract(EthenaMinting _newMintingContract)` — sets a new minting contract only available for the owner, high probability that this function never gets called
> - `approveToMintContract(address[] memory _assets)` — approves the desired assets to the minting contract only available for the owner
> - `revokeApprovals(address[] memory _assets, address _target)` — revokes the previously granted ERC20 approvals from a specific address only available for the owner. Can't revoke the approvals from the current minting contract
> - `setOperator(address _newOperator)` — sets a new operator and delegated signer, removing the previous one only available for the owner. We allow the address(0) as a new operator
> - `transferOwnership(address newOwner)` — Starts the ownership transfer of the contract to a new account. Replaces the pending transfer if there is one. Can only be called by the current owner.
> - `acceptOwnership()` — Second step of `OZ Ownable2Step` — callable by the pending holder set via `transferOwnership`, not by the current role. Included here to surface the full transfer handoff. `[CONFIG]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x3B0AAf6e6fCd4a7cEEf8c92C32DFeA9E64dC1862` | GnosisSafeProxy | 🟢 LOW | — | Storage+Events | 5/10 signers |

> **Signers of `GnosisSafeProxy` (0x3B0A...1862):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x18d32B1AB042b5E9a3430e77fDE8B4783A019234` | EOA | 2025-04-29 | EOA |
> | `0xb93C042c688F1Cf038bab03C4F832F2630Bb7d8F` | EOA | 2025-04-11 | EOA |
> | `0x66892C66711B2640360C3123E6C23C0cFa50550F` | EOA | 2024-04-04 | EOA |
> | `0xE3F95F2e1aDEC092337FB5D93C1fE87558658b11` | EOA | 2024-04-04 | EOA |
> | `0x99682F56F4ccCF61BD7e449924f2f62D395e1E45` | EOA | 2024-02-21 | EOA |
> | `0x980742eDEA6b0df3566C19Ff4945c57E95449a13` | EOA | 2025-10-15 | EOA |
> | `0x54D0D64f7326b128959bf37Ed7B5f2510656a471` | EOA | 2023-11-20 | EOA |
> | `0xFBE49A82CB2BFF6Fa4C2B1F0d165A5E1175Aac83` | EOA | — | EOA |
> | `0xE987E14b2E204fdf5827a3cFCa7D476E8Df6a99E` | EOA | 2023-11-15 | EOA |
> | `0xe5cA87dA3A209aD85FdcbB515e1bD92644e9E1A6` | EOA | 2023-11-15 | EOA |

> **Quorum history:**
>   - 2023-11-14: 🔴 decreased 5 → 2
>   - 2023-11-20: 🟢 increased 2 → 3
>   - 2023-11-20: 🟢 increased 3 → 4
>   - 2024-01-17: 🟢 increased 4 → 5

### > 🟠 `mintingContract()` · 📋 operational


> **Members (1):**

> | Address | Name / Type | Granted | Source | Details |
> |---|---|---|---|---|
> | `0xe3490297a08d6fC8Da46Edb7B6142E4F461b62D3` | EthenaMinting | — | Events only |  |

> #### 🔧 Permissioned Parameters

> **`operator`** 🔄 **ACTIVE** (6 changes)

> > ⚠️ This parameter has been changed **6 times** — monitor for unexpected modifications.

> | Field | Value |
> |---|---|
> | Current Value | `0xe3880B792F6F0f8795CbAACd92E7Ca78F5d3646e` |
> | Setter | `setOperator(address _newOperator)` |
> | Gated by | `owner()` |
> | Tags | — |
> | Last changed | 2024-07-11 |
> | Changed by | `0x3B0A...1862` (GnosisSafeProxy) |
> | Total changes | 6 🔄 |

> **Recent changes (showing last 5 of 6):**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `_newOperator=0xe3880B792F6F0f8795CbAACd92E7Ca78F5d3646e` | `0x3B0A...1862` (GnosisSafeProxy) | 2024-07-11 |
> | 2 | `_newOperator=0xe3880B792F6F0f8795CbAACd92E7Ca78F5d3646e` | `0x3B0A...1862` (GnosisSafeProxy) | 2024-07-11 |
> | 3 | `_newOperator=0xe3880B792F6F0f8795CbAACd92E7Ca78F5d3646e` | `0x3B0A...1862` (GnosisSafeProxy) | 2024-07-11 |
> | 4 | `_newOperator=0xe3880B792F6F0f8795CbAACd92E7Ca78F5d3646e` | `0x3B0A...1862` (GnosisSafeProxy) | 2024-07-11 |
> | 5 | `_newOperator=0xe3880B792F6F0f8795CbAACd92E7Ca78F5d3646e` | `0x3B0A...1862` (GnosisSafeProxy) | 2024-07-11 |

> #### 💰 Supply Actions

> _Mint / redeem / burn call tracking — last 5 calls per function, total counts preserved._

> **`transferInRewards`** 🔄 **ACTIVE** (2489 changes) 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > ⚠️ This parameter has been changed **2489 times** — monitor for unexpected modifications.

> | Field | Value |
> |---|---|
> | Setter | `transferInRewards(uint256 _rewardsAmount)` |
> | Gated by | `operator()` |
> | Tags | `SUPPLY` |
> | Last called | 2026-06-25 |
> | Called by | `0xe388...646e` (EOA) |
> | Total calls | 2489 🔄 |

> **Recent changes (showing last 5 of 2489):**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `54449105714285714285714 (54,449.105714e18)` | `0xe388...646e` (EOA) | 2026-06-25 |
> | 2 | `54449105714285714285714 (54,449.105714e18)` | `0xe388...646e` (EOA) | 2026-06-25 |
> | 3 | `54449105714285714285714 (54,449.105714e18)` | `0xe388...646e` (EOA) | 2026-06-25 |
> | 4 | `54449105714285714285714 (54,449.105714e18)` | `0xe388...646e` (EOA) | 2026-06-24 |
> | 5 | `54449105714285714285714 (54,449.105714e18)` | `0xe388...646e` (EOA) | 2026-06-24 |

---
<a id="c-0x7fc7c91d556b400afa565013e3f32055a0713425"></a>
## > USDeSilo `0x7FC7c91D556B400AFa565013E3F32055a0713425`

> _No roles detected._

---
## ⚡ Authority Concentration

The following addresses hold permissions across multiple contracts or roles in this dependency stack. Concentration of authority increases systemic risk — a single compromised key or colluding multisig can affect multiple systems.

### 🟢 `0x3B0AAf6e6fCd4a7cEEf8c92C32DFeA9E64dC1862` — GnosisSafeProxy
Controls **4 role(s)** across **2 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| StakedUSDeV2 `0x9D39...3497` | `BLACKLIST_MANAGER_ROLE` | `addToBlacklist(address target, bool isFullBlacklisting)`, `removeFromBlacklist(address target, bool isFullBlacklisting)` | 2024-04-29 |
| StakedUSDeV2 `0x9D39...3497` | `REWARDER_ROLE` | `transferInRewards(uint256 amount)` | 2023-11-14 |
| StakedUSDeV2 `0x9D39...3497` | `DEFAULT_ADMIN_ROLE` | `setCooldownDuration(uint24 duration)`, `rescueTokens(address token, uint256 amount, address to)`, `redistributeLockedAmount(address from, address to)`, `transferAdmin(address newAdmin)` +3 more | 2023-11-14 |
| StakingRewardsDistributor `0xf2fa...b439` | `owner()` | `rescueTokens(address _token, address _to, uint256 _amount)`, `setMintingContract(EthenaMinting _newMintingContract)`, `approveToMintContract(address[] memory _assets)`, `revokeApprovals(address[] memory _assets, address _target)` +3 more | — |


---
## ⛔ Sanctions Screening

| Source | Status |
|---|---|
| OFAC SDN | ✅ OFAC SDN screened (97 ETH addresses, cache: 2026-06-25) |
| Chainalysis | ✅ Chainalysis screened |
| **Result** | 751 addresses screened · ⛔ **76 flagged** |

The following addresses were flagged against OFAC SDN and/or Chainalysis databases.  
**Active holders** currently hold a role. **Prev holders** had their role revoked.

### ⛔ `0x038989cBB1710C72b9920Dc4Fa529158f463e72c` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Armando de Jesus Ojeda Aviles 2026-05-20 038989cbb1710c72b9920dc4fa529158f463e72c (sanctioned entity)
- **OFAC**: Armando de Jesus OJEDA AVILES (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0x04DBA1194ee10112fE6C3207C0687DEf0e78baCf` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Alex Adrianus Martinus Peijnenburg 2022-11-09 04dba1194ee10112fe6c3207c0687def0e78bacf (sanctioned entity)
- **CHAINALYSIS**: SANCTIONS: OFAC SDN Alex Adrianus Martinus Peijnenburg 2022-11-09 04dba1194ee10112fe6c3207c0687def0e78bacf (sanctions)
- **OFAC**: Alex Adrianus Martinus PEIJNENBURG (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0x08723392Ed15743cc38513C4925f5e6be5c17243` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONS: MOFA FSC Lazarus Group 2023-02-10  08723392ed15743cc38513c4925f5e6be5c17243 (sanctions)
- **CHAINALYSIS**: SANCTIONED ENTITY: MOFA FSC Lazarus Group 2023-02-10  08723392ed15743cc38513c4925f5e6be5c17243 (sanctioned entity)
- **CHAINALYSIS**: SANCTIONED ENTITY: MOFA JP Lazarus Group 2022-12-12 08723392ed15743cc38513c4925f5e6be5c17243 (sanctioned entity)
- **CHAINALYSIS**: SANCTIONS: MOFA JP Lazarus Group 2022-12-12 08723392ed15743cc38513c4925f5e6be5c17243 (sanctions)
- **CHAINALYSIS**: SANCTIONS: OFAC SDN Lazarus Group 2022-05-06 08723392ed15743cc38513c4925f5e6be5c17243 (sanctions)
- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Lazarus Group 2022-05-06 08723392ed15743cc38513c4925f5e6be5c17243 (sanctioned entity)
- **OFAC**: LAZARUS GROUP (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0x08b2eFdcdB8822EfE5ad0Eae55517cf5DC544251` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONS: OFAC SDN Alex Adrianus Martinus Peijnenburg 2022-11-09 08b2efdcdb8822efe5ad0eae55517cf5dc544251 (sanctions)
- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Alex Adrianus Martinus Peijnenburg 2022-11-09 08b2efdcdb8822efe5ad0eae55517cf5dc544251 (sanctioned entity)
- **OFAC**: Alex Adrianus Martinus PEIJNENBURG (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0x0931cA4D13BB4ba75D9B7132AB690265D749a5E7` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Cryptex 2024-09-26 0931ca4d13bb4ba75d9b7132ab690265d749a5e7 (sanctioned entity)
- **OFAC**: CRYPTEX (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0x098B716B8Aaf21512996dC57EB0615e2383E2f96` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONS: MOFA JP Lazarus Group 2022-12-12  098b716b8aaf21512996dc57eb0615e2383e2f96 (sanctions)
- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Lazarus Group 2022-04-14 098b716b8aaf21512996dc57eb0615e2383e2f96 (sanctioned entity)
- **CHAINALYSIS**: SANCTIONED ENTITY: MOFA JP Lazarus Group 2022-12-12  098b716b8aaf21512996dc57eb0615e2383e2f96 (sanctioned entity)
- **CHAINALYSIS**: SANCTIONS: MOFA FSC Lazarus Group 2023-02-10  098b716b8aaf21512996dc57eb0615e2383e2f96 (sanctions)
- **CHAINALYSIS**: SANCTIONED ENTITY: MOFA FSC Lazarus Group 2023-02-10  098b716b8aaf21512996dc57eb0615e2383e2f96 (sanctioned entity)
- **CHAINALYSIS**: SANCTIONS: OFAC SDN Lazarus Group 2022-04-14 098b716b8aaf21512996dc57eb0615e2383e2f96 (sanctions)
- **OFAC**: LAZARUS GROUP (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0x0Ee5067b06776A89CcC7dC8Ee369984AD7Db5e06` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Alex Adrianus Martinus Peijnenburg 2022-11-09 0ee5067b06776a89ccc7dc8ee369984ad7db5e06 (sanctioned entity)
- **CHAINALYSIS**: SANCTIONS: OFAC SDN Alex Adrianus Martinus Peijnenburg 2022-11-09 0ee5067b06776a89ccc7dc8ee369984ad7db5e06 (sanctions)
- **OFAC**: Alex Adrianus Martinus PEIJNENBURG (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0x14779CEC0B117d5194c750C55Ea1f42086631964` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Armando de Jesus Ojeda Aviles 2026-05-20 14779cec0b117d5194c750c55ea1f42086631964 (sanctioned entity)
- **OFAC**: Armando de Jesus OJEDA AVILES (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0x175d44451403Edf28469dF03A9280c1197ADb92c` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONED ENTITY: OFSI Gaza Now 2024-03-27 175d44451403edf28469df03a9280c1197adb92c (sanctioned entity)
- **CHAINALYSIS**: SANCTIONED ENTITY: OFSI Gaza Now 2024-03-27 175d44451403edf28469df03a9280c1197adb92c (sanctioned entity)
- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Gaza Now 2024-03-27 175d44451403edf28469df03a9280c1197adb92c (sanctioned entity)
- **OFAC**: GAZA NOW (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0x1967D8Af5Bd86A497fb3DD7899A020e47560dAAF` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Matthew Simon Grimm 2022-11-09 1967d8af5bd86a497fb3dd7899a020e47560daaf (sanctioned entity)
- **CHAINALYSIS**: SANCTIONS: OFAC SDN Matthew Simon Grimm 2022-11-09 1967d8af5bd86a497fb3dd7899a020e47560daaf (sanctions)
- **OFAC**: Matthew Simon GRIMM (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0x1999EF52700c34De7EC2b68a28aAFB37db0C5ade` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Khadzhi Murat Dalgatovich Magomedov 2024-12-04 1999ef52700c34de7ec2b68a28aafb37db0c5ade (sanctioned entity)
- **OFAC**: Khadzhi Murat Dalgatovich MAGOMEDOV (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0x19Aa5Fe80D33a56D56c78e82eA5E50E5d80b4Dff` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN SUEX.io 2021-09-21 19aa5fe80d33a56d56c78e82ea5e50e5d80b4dff (sanctioned entity)
- **CHAINALYSIS**: SANCTIONS: OFAC SDN SUEX.io 2021-09-21 19aa5fe80d33a56d56c78e82ea5e50e5d80b4dff (sanctions)
- **OFAC**: SUEX OTC, S.R.O. (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0x19F8f2B0915Daa12a3f5C9CF01dF9E24D53794F7` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN OKO Design Bureau 2024-05-01 19f8f2b0915daa12a3f5c9cf01df9e24d53794f7 (sanctioned entity)
- **OFAC**: OKO DESIGN BUREAU (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0x1da5821544e25c636c1417Ba96Ade4Cf6D2f9B5A` — UserWallet [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Secondeye Solution 2021-04-15 1da5821544e25c636c1417ba96ade4cf6d2f9b5a (sanctioned entity)
- **CHAINALYSIS**: SANCTIONS: OFAC SDN Secondeye Solution 2021-04-15 1da5821544e25c636c1417ba96ade4cf6d2f9b5a (sanctions)
- **OFAC**: SECONDEYE SOLUTION (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0x21B8d56BDA776bbE68655A16895afd96F5534feD` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Gaza Now 2024-03-27 21b8d56bda776bbe68655a16895afd96f5534fed (sanctioned entity)
- **CHAINALYSIS**: SANCTIONED ENTITY: OFSI Gaza Now 2024-03-27 21b8d56bda776bbe68655a16895afd96f5534fed (sanctioned entity)
- **OFAC**: GAZA NOW (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0x2f389cE8bD8ff92De3402FFCe4691d17fC4f6535` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN SUEX.io 2021-09-21 2f389ce8bd8ff92de3402ffce4691d17fc4f6535 (sanctioned entity)
- **CHAINALYSIS**: SANCTIONS: OFAC SDN SUEX.io 2021-09-21 2f389ce8bd8ff92de3402ffce4691d17fc4f6535 (sanctions)
- **OFAC**: SUEX OTC, S.R.O. (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0x308eD4B7b49797e1A98D3818bFF6fe5385410370` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONS: OFAC SDN SUEX.io 2021-09-21 308ed4b7b49797e1a98d3818bff6fe5385410370 (sanctions)
- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN SUEX.io 2021-09-21 308ed4b7b49797e1a98d3818bff6fe5385410370 (sanctioned entity)
- **OFAC**: SUEX OTC, S.R.O. (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0x32dA24Ca413F3E7B53145D4737e172C3bdF81e3e` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Armando de Jesus Ojeda Aviles 2026-05-20 32da24ca413f3e7b53145d4737e172c3bdf81e3e (sanctioned entity)
- **OFAC**: Armando de Jesus OJEDA AVILES (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0x35fB6f6DB4fb05e6A4cE86f2C93691425626d4b1` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONED ENTITY: MOFA JP Lazarus Group 2022-12-12 35fb6f6db4fb05e6a4ce86f2c93691425626d4b1 (sanctioned entity)
- **CHAINALYSIS**: SANCTIONS: OFAC SDN Lazarus Group 2022-05-06 35fb6f6db4fb05e6a4ce86f2c93691425626d4b1 (sanctions)
- **CHAINALYSIS**: SANCTIONS: MOFA JP Lazarus Group 2022-12-12 35fb6f6db4fb05e6a4ce86f2c93691425626d4b1 (sanctions)
- **CHAINALYSIS**: SANCTIONED ENTITY: MOFA FSC Lazarus Group 2023-02-10  35fb6f6db4fb05e6a4ce86f2c93691425626d4b1 (sanctioned entity)
- **CHAINALYSIS**: SANCTIONS: MOFA FSC Lazarus Group 2023-02-10  35fb6f6db4fb05e6a4ce86f2c93691425626d4b1 (sanctions)
- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Lazarus Group 2022-05-06 35fb6f6db4fb05e6a4ce86f2c93691425626d4b1 (sanctioned entity)
- **OFAC**: LAZARUS GROUP (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0x38735f03b30FbC022DdD06ABED01F0Ca823C6a94` — EOA [ACTIVE HOLDER]

- **OFAC**: John Desmond HANAFIN (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0x39D908dac893CBCB53Cc86e0ECc369aA4DeF1A29` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Jonatan Zimenkov 2023-02-01 39d908dac893cbcb53cc86e0ecc369aa4def1a29 (sanctioned entity)
- **CHAINALYSIS**: SANCTIONS: OFAC SDN Jonatan Zimenkov 2023-02-01 39d908dac893cbcb53cc86e0ecc369aa4def1a29 (sanctions)
- **OFAC**: Jonatan ZIMENKOV (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0x3AD9dB589d201A710Ed237c829c7860Ba86510Fc` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONS: OFAC SDN Task Force Rusich 2022-09-15 3ad9db589d201a710ed237c829c7860ba86510fc (sanctions)
- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Task Force Rusich 2022-09-15 3ad9db589d201a710ed237c829c7860ba86510fc (sanctioned entity)
- **OFAC**: TASK FORCE RUSICH (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0x3CBdeD43EFdAf0FC77b9C55F6fC9988fCC9b757d` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN SouthFront 2021-04-15 3cbded43efdaf0fc77b9c55f6fc9988fcc9b757d (sanctioned entity)
- **OFAC**: SOUTHFRONT (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0x3Cffd56B47B7b41c56258D9C7731ABaDc360E073` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONED ENTITY: MOFA JP Lazarus Group 2022-12-12 3cffd56b47b7b41c56258d9c7731abadc360e073 (sanctioned entity)
- **CHAINALYSIS**: SANCTIONED ENTITY: MOFA FSC Lazarus Group 2023-02-10  3cffd56b47b7b41c56258d9c7731abadc360e073 (sanctioned entity)
- **CHAINALYSIS**: SANCTIONS: MOFA FSC Lazarus Group 2023-02-10  3cffd56b47b7b41c56258d9c7731abadc360e073 (sanctions)
- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Lazarus Group 2022-04-22 3cffd56b47b7b41c56258d9c7731abadc360e073 (sanctioned entity)
- **CHAINALYSIS**: SANCTIONS: MOFA JP Lazarus Group 2022-12-12 3cffd56b47b7b41c56258d9c7731abadc360e073 (sanctions)
- **CHAINALYSIS**: SANCTIONS: OFAC SDN Lazarus Group 2022-04-22 3cffd56b47b7b41c56258d9c7731abadc360e073 (sanctions)
- **OFAC**: LAZARUS GROUP (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0x3e37627dEAA754090fBFbb8bd226c1CE66D255e9` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONS: MOFA JP Lazarus Group 2022-12-12 3e37627deaa754090fbfbb8bd226c1ce66d255e9 (sanctions)
- **CHAINALYSIS**: SANCTIONS: OFAC SDN Lazarus Group 2022-05-06 3e37627deaa754090fbfbb8bd226c1ce66d255e9 (sanctions)
- **CHAINALYSIS**: SANCTIONED ENTITY: MOFA JP Lazarus Group 2022-12-12 3e37627deaa754090fbfbb8bd226c1ce66d255e9 (sanctioned entity)
- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Lazarus Group 2022-05-06 3e37627deaa754090fbfbb8bd226c1ce66d255e9 (sanctioned entity)
- **CHAINALYSIS**: SANCTIONS: MOFA FSC Lazarus Group 2023-02-10  3e37627deaa754090fbfbb8bd226c1ce66d255e9 (sanctions)
- **CHAINALYSIS**: SANCTIONED ENTITY: MOFA FSC Lazarus Group 2023-02-10  3e37627deaa754090fbfbb8bd226c1ce66d255e9 (sanctioned entity)
- **OFAC**: LAZARUS GROUP (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0x43fa21d92141BA9db43052492E0DeEE5aa5f0A93` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Roman Semenov 43fa21 2023-08-23 43fa21d92141ba9db43052492e0deee5aa5f0a93 (sanctioned entity)
- **OFAC**: Roman SEMENOV (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0x48549A34AE37b12F6a30566245176994e17C6b4A` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONS: OFAC SDN Chatex.com 2021-11-08 48549a34ae37b12f6a30566245176994e17c6b4a (sanctions)
- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Chatex.com 2021-11-08 48549a34ae37b12f6a30566245176994e17c6b4a (sanctioned entity)
- **OFAC**: CHATEX (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0x4F428c11Dc82388fa5136D636e613ad923Eb700B` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Armando de Jesus Ojeda Aviles 2026-05-20 4f428c11dc82388fa5136d636e613ad923eb700b (sanctioned entity)
- **OFAC**: Armando de Jesus OJEDA AVILES (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0x4F47Bc496083C727c5fbe3CE9CDf2B0f6496270c` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONS: OFAC SDN Hyon Sop Sim 2023-04-24 4f47bc496083c727c5fbe3ce9cdf2b0f6496270c (sanctions)
- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Hyon Sop Sim 2023-04-24 4f47bc496083c727c5fbe3ce9cdf2b0f6496270c (sanctioned entity)
- **CHAINALYSIS**: SANCTIONED ENTITY: MOF JP Sim Hyon Sop 2023-09-01 4f47bc496083c727c5fbe3ce9cdf2b0f6496270c (sanctioned entity)
- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Sim Hyon Sop 2023-04-24 4f47bc496083c727c5fbe3ce9cdf2b0f6496270c (sanctioned entity)
- **OFAC**: Hyon Sop SIM (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0x502371699497d08D5339c870851898D6D72521Dd` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Alex Adrianus Martinus Peijnenburg 2022-11-09 502371699497d08d5339c870851898d6d72521dd (sanctioned entity)
- **CHAINALYSIS**: SANCTIONS: OFAC SDN Alex Adrianus Martinus Peijnenburg 2022-11-09 502371699497d08d5339c870851898d6d72521dd (sanctions)
- **OFAC**: Alex Adrianus Martinus PEIJNENBURG (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0x530A64c0Ce595026a4A556b703644228179E2d57` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Shen Xingbiao 2023-10-03 530a64c0ce595026a4a556b703644228179e2d57 (sanctioned entity)
- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Shen Xingbiao 2023-10-03 530a64c0ce595026a4a556b703644228179e2d57 (sanctioned entity)
- **OFAC**: Xingbiao SHEN (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0x53b6936513e738f44FB50d2b9476730C0Ab3Bfc1` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONS: MOFA JP Lazarus Group 2022-12-12 53b6936513e738f44fb50d2b9476730c0ab3bfc1 (sanctions)
- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Lazarus Group 2022-04-22 53b6936513e738f44fb50d2b9476730c0ab3bfc1 (sanctioned entity)
- **CHAINALYSIS**: SANCTIONED ENTITY: MOFA FSC Lazarus Group 2023-02-10  53b6936513e738f44fb50d2b9476730c0ab3bfc1 (sanctioned entity)
- **CHAINALYSIS**: SANCTIONS: MOFA FSC Lazarus Group 2023-02-10  53b6936513e738f44fb50d2b9476730c0ab3bfc1 (sanctions)
- **CHAINALYSIS**: SANCTIONS: OFAC SDN Lazarus Group 2022-04-22 53b6936513e738f44fb50d2b9476730c0ab3bfc1 (sanctions)
- **CHAINALYSIS**: SANCTIONED ENTITY: MOFA JP Lazarus Group 2022-12-12 53b6936513e738f44fb50d2b9476730c0ab3bfc1 (sanctioned entity)
- **OFAC**: LAZARUS GROUP (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0x5512d943eD1f7c8a43F3435C85F7aB68b30121b0` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Chatex.com 2021-11-08 5512d943ed1f7c8a43f3435c85f7ab68b30121b0 (sanctioned entity)
- **CHAINALYSIS**: SANCTIONS: OFAC SDN Chatex.com 2021-11-08 5512d943ed1f7c8a43f3435c85f7ab68b30121b0 (sanctions)
- **OFAC**: CHATEX (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0x5A14E72060c11313E38738009254a90968F58f51` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONS: OFAC SDN Alex Adrianus Martinus Peijnenburg 2022-11-09 5a14e72060c11313e38738009254a90968f58f51 (sanctions)
- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Alex Adrianus Martinus Peijnenburg 2022-11-09 5a14e72060c11313e38738009254a90968f58f51 (sanctioned entity)
- **OFAC**: Alex Adrianus Martinus PEIJNENBURG (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0x5A7a51bFb49F190e5A6060a5bc6052Ac14a3b59f` — Gnosis Safe 2/6 [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Roman Semenov 5a7a51 2023-08-23 5a7a51bfb49f190e5a6060a5bc6052ac14a3b59f (sanctioned entity)
- **OFAC**: Roman SEMENOV (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0x5f48C2A71B2CC96e3F0CCae4E39318Ff0dc375b2` — Vesting [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Roman Semenov 5f48c2 2023-08-23 5f48c2a71b2cc96e3f0ccae4e39318ff0dc375b2 (sanctioned entity)
- **OFAC**: Roman SEMENOV (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0x67d40EE1A85bf4a4Bb7Ffae16De985e8427B6b45` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Chatex.com 2021-11-08 67d40ee1a85bf4a4bb7ffae16de985e8427b6b45 (sanctioned entity)
- **CHAINALYSIS**: SANCTIONS: OFAC SDN Chatex.com 2021-11-08 67d40ee1a85bf4a4bb7ffae16de985e8427b6b45 (sanctions)
- **OFAC**: CHATEX (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0x6Be0aE71e6c41f2f9D0D1A3B8d0f75E6f6A0b46e` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Roman Semenov 6be0ae 2023-08-23 6be0ae71e6c41f2f9d0d1a3b8d0f75e6f6a0b46e (sanctioned entity)
- **OFAC**: Roman SEMENOV (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0x6F1cA141A28907F78Ebaa64fb83A9088b02A8352` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONS: OFAC SDN Chatex.com 2021-11-08 6f1ca141a28907f78ebaa64fb83a9088b02a8352 (sanctions)
- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Chatex.com 2021-11-08 6f1ca141a28907f78ebaa64fb83a9088b02a8352 (sanctioned entity)
- **OFAC**: CHATEX (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0x6aCDFBA02D390b97Ac2b2d42A63E85293BCc160e` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONS: OFAC SDN Chatex.com 2021-11-08 6acdfba02d390b97ac2b2d42a63e85293bcc160e (sanctions)
- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Chatex.com 2021-11-08 6acdfba02d390b97ac2b2d42a63e85293bcc160e (sanctioned entity)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0x72a5843cc08275C8171E582972Aa4fDa8C397B2A` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONS: OFAC SDN Secondeye Solution 2021-04-15 72a5843cc08275c8171e582972aa4fda8c397b2a (sanctions)
- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Secondeye Solution 2021-04-15 72a5843cc08275c8171e582972aa4fda8c397b2a (sanctioned entity)
- **OFAC**: SECONDEYE SOLUTION (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0x797d7Ae72EbddCDea2a346c1834E04d1F8dF102b` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Roman Semenov 797d7a 2023-08-23 797d7ae72ebddcdea2a346c1834e04d1f8df102b (sanctioned entity)
- **OFAC**: Roman SEMENOV (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0x7Db418b5D567A4e0E8c59Ad71BE1FcE48f3E6107` — UserWallet [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONS: OFAC SDN Secondeye Solution 2021-04-15 7db418b5d567a4e0e8c59ad71be1fce48f3e6107 (sanctions)
- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Secondeye Solution 2021-04-15 7db418b5d567a4e0e8c59ad71be1fce48f3e6107 (sanctioned entity)
- **OFAC**: SECONDEYE SOLUTION (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0x7F19720A857F834887FC9A7bC0a0fBe7Fc7f8102` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Secondeye Solution 2021-04-15 7f19720a857f834887fc9a7bc0a0fbe7fc7f8102 (sanctioned entity)
- **CHAINALYSIS**: SANCTIONS: OFAC SDN Secondeye Solution 2021-04-15 7f19720a857f834887fc9a7bc0a0fbe7fc7f8102 (sanctions)
- **OFAC**: SECONDEYE SOLUTION (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0x7F367cC41522cE07553e823bf3be79A889DEbe1B` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Danil Potekhin 7F36 2020-09-16 7f367cc41522ce07553e823bf3be79a889debe1b (sanctioned entity)
- **CHAINALYSIS**: SANCTIONS: OFAC SDN Danil Potekhin 7F36 2020-09-16 7f367cc41522ce07553e823bf3be79a889debe1b (sanctions)
- **OFAC**: Danil POTEKHIN (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0x7FF9cFad3877F21d41Da833E2F775dB0569eE3D9` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Garantex.io 2022-04-05 7ff9cfad3877f21d41da833e2f775db0569ee3d9 (sanctioned entity)
- **CHAINALYSIS**: SANCTIONS: OFSI Garantex Europe OU 2022-05-03 7ff9cfad3877f21d41da833e2f775db0569ee3d9 (sanctions)
- **CHAINALYSIS**: SANCTIONED ENTITY: OFSI Garantex Europe OU 2022-05-03 7ff9cfad3877f21d41da833e2f775db0569ee3d9 (sanctioned entity)
- **CHAINALYSIS**: SANCTIONS: OFAC SDN Garantex.io 2022-04-05 7ff9cfad3877f21d41da833e2f775db0569ee3d9 (sanctions)
- **OFAC**: GARANTEX EUROPE OU (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0x83E5bC4Ffa856BB84Bb88581f5Dd62A433A25e0D` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONS: OFAC SDN Alex Adrianus Martinus Peijnenburg 2022-11-09 83e5bc4ffa856bb84bb88581f5dd62a433a25e0d (sanctions)
- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Alex Adrianus Martinus Peijnenburg 2022-11-09 83e5bc4ffa856bb84bb88581f5dd62a433a25e0d (sanctioned entity)
- **OFAC**: Alex Adrianus Martinus PEIJNENBURG (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0x8576aCC5C05D6Ce88f4e49bf65BdF0C62F91353C` — Contract [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONS: OFAC SDN Anton Nikolaeyvich Andreyev 2020-09-10 8576acc5c05d6ce88f4e49bf65bdf0c62f91353c (sanctions)
- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Anton Nikolaeyvich Andreyev 2020-09-10 8576acc5c05d6ce88f4e49bf65bdf0c62f91353c (sanctioned entity)
- **OFAC**: Anton Nikolaeyvich ANDREYEV (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0x901bb9583b24D97e995513C6778dc6888AB6870e` — Contract [ACTIVE HOLDER]

- **OFAC**: Artem Mikhaylovich LIFSHITS (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0x931546D9e66836AbF687d2bc64B30407bAc8C568` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Roman Semenov 931546 2023-08-23 931546d9e66836abf687d2bc64b30407bac8c568 (sanctioned entity)
- **OFAC**: Roman SEMENOV (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0x961C5Be54a2ffC17CF4Cb021d863c42daCd47Fc1` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Zhang Wei 2023-10-03 961c5be54a2ffc17cf4cb021d863c42dacd47fc1 (sanctioned entity)
- **OFAC**: Wei ZHANG (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0x97B1043ABD9E6FC31681635166d430a458D14F9C` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONS: OFAC SDN Sang Man Kim 2023-05-23 97b1043abd9e6fc31681635166d430a458d14f9c (sanctions)
- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Sang Man Kim 2023-05-23 97b1043abd9e6fc31681635166d430a458d14f9c (sanctioned entity)
- **OFAC**: Sang Man KIM (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0x983a81ca6FB1e441266D2FbcB7D8E530AC2E05A2` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Valerian Labs Inc. 2023-10-03 983a81ca6fb1e441266d2fbcb7d8e530ac2e05a2 (sanctioned entity)
- **OFAC**: VALERIAN LABS, INC. (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0x9Be599d7867f5E1a2D7Ec6dB9710dF2b98A15573` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Amnokgang Technology Development Company 2026-03-12 9be599d7867f5e1a2d7ec6db9710df2b98a15573 (sanctioned entity)
- **OFAC**: AMNOKGANG TECHNOLOGY DEVELOPMENT COMPANY (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0x9C2Bc757B66F24D60F016B6237F8CdD414a879Fa` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Mario Alberto Jimenez Castro 2023-09-26 9c2bc757b66f24d60f016b6237f8cdd414a879fa (sanctioned entity)
- **OFAC**: Mario Alberto JIMENEZ CASTRO (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0x9F4cda013E354b8fC285BF4b9A60460cEe7f7Ea9` — EOA [ACTIVE HOLDER]

- **OFAC**: SOUTHFRONT (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0xA7e5d5A720f06526557c513402f2e6B5fA20b008` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Artem Mikhaylovich Lifshits 2020-09-10 a7e5d5a720f06526557c513402f2e6b5fa20b008 (sanctioned entity)
- **OFAC**: Artem Mikhaylovich LIFSHITS (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0xC455f7fd3e0e12afd51fba5c106909934D8A0e4a` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Chatex.com 2021-11-08 c455f7fd3e0e12afd51fba5c106909934d8a0e4a (sanctioned entity)
- **CHAINALYSIS**: SANCTIONS: OFAC SDN Chatex.com 2021-11-08 c455f7fd3e0e12afd51fba5c106909934d8a0e4a (sanctions)
- **OFAC**: CHATEX (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0xD0975B32cEa532eaDDdFC9c60481976e39dB3472` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Matthew Simon Grimm 2022-11-09 d0975b32cea532eadddfc9c60481976e39db3472 (sanctioned entity)
- **CHAINALYSIS**: SANCTIONS: OFAC SDN Matthew Simon Grimm 2022-11-09 d0975b32cea532eadddfc9c60481976e39db3472 (sanctions)
- **OFAC**: Matthew Simon GRIMM (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0xE1D865c3D669dCc8c57c8D023140CB204e672ee4` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Yunhe Wang 2024-05-28 e1d865c3d669dcc8c57c8d023140cb204e672ee4 (sanctioned entity)
- **OFAC**: Yunhe WANG (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0xE950DC316b836e4EeFb8308bf32Bf7C72a1358FF` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Gaza Now 2024-03-27 e950dc316b836e4eefb8308bf32bf7c72a1358ff (sanctioned entity)
- **CHAINALYSIS**: SANCTIONED ENTITY: OFSI Gaza Now 2024-03-27 e950dc316b836e4eefb8308bf32bf7c72a1358ff (sanctioned entity)
- **OFAC**: GAZA NOW (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0xEFE301d259F525cA1ba74A7977b80D5b060B3ccA` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Alex Adrianus Martinus Peijnenburg 2022-11-09 efe301d259f525ca1ba74a7977b80d5b060b3cca (sanctioned entity)
- **CHAINALYSIS**: SANCTIONS: OFAC SDN Alex Adrianus Martinus Peijnenburg 2022-11-09 efe301d259f525ca1ba74a7977b80d5b060b3cca (sanctions)
- **OFAC**: Alex Adrianus Martinus PEIJNENBURG (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0xF2235D55b2950a0B1317469d72d07Ae65b2e27CB` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Armando de Jesus Ojeda Aviles 2026-05-20 f2235d55b2950a0b1317469d72d07ae65b2e27cb (sanctioned entity)
- **OFAC**: Armando de Jesus OJEDA AVILES (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0xF7B31119c2682c88d88D455dBb9d5932c65Cf1bE` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONED ENTITY: MOFA JP Lazarus Group 2022-12-12 f7b31119c2682c88d88d455dbb9d5932c65cf1be (sanctioned entity)
- **CHAINALYSIS**: SANCTIONS: OFAC SDN Lazarus Group 2022-05-06 f7b31119c2682c88d88d455dbb9d5932c65cf1be (sanctions)
- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Lazarus Group 2022-05-06 f7b31119c2682c88d88d455dbb9d5932c65cf1be (sanctioned entity)
- **CHAINALYSIS**: SANCTIONED ENTITY: MOFA FSC Lazarus Group 2023-02-10  f7b31119c2682c88d88d455dbb9d5932c65cf1be (sanctioned entity)
- **CHAINALYSIS**: SANCTIONS: MOFA FSC Lazarus Group 2023-02-10  f7b31119c2682c88d88d455dbb9d5932c65cf1be (sanctions)
- **CHAINALYSIS**: SANCTIONS: MOFA JP Lazarus Group 2022-12-12 f7b31119c2682c88d88d455dbb9d5932c65cf1be (sanctions)
- **OFAC**: LAZARUS GROUP (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0xFAC583C0cF07Ea434052c49115a4682172aB6b4F` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Wang Mingming 2023-10-03 fac583c0cf07ea434052c49115a4682172ab6b4f (sanctioned entity)
- **OFAC**: Mingming WANG (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0xa0e1c89Ef1a489c9C7dE96311eD5Ce5D32c20E4B` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONS: MOFA JP Lazarus Group 2022-12-12  a0e1c89ef1a489c9c7de96311ed5ce5d32c20e4b (sanctions)
- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Lazarus Group 2022-04-22 a0e1c89ef1a489c9c7de96311ed5ce5d32c20e4b (sanctioned entity)
- **CHAINALYSIS**: SANCTIONED ENTITY: MOFA FSC Lazarus Group 2023-02-10  a0e1c89ef1a489c9c7de96311ed5ce5d32c20e4b (sanctioned entity)
- **CHAINALYSIS**: SANCTIONS: MOFA FSC Lazarus Group 2023-02-10  a0e1c89ef1a489c9c7de96311ed5ce5d32c20e4b (sanctions)
- **CHAINALYSIS**: SANCTIONS: OFAC SDN Lazarus Group 2022-04-22 a0e1c89ef1a489c9c7de96311ed5ce5d32c20e4b (sanctions)
- **CHAINALYSIS**: SANCTIONED ENTITY: MOFA JP Lazarus Group 2022-12-12  a0e1c89ef1a489c9c7de96311ed5ce5d32c20e4b (sanctioned entity)
- **OFAC**: LAZARUS GROUP (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0xaC4cC4B68ea24BbFAAC8fD127B67Ed445ACcCE22` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Rodrigo Alarcon Palomares 2026-05-20 ac4cc4b68ea24bbfaac8fd127b67ed445accce22 (sanctioned entity)
- **OFAC**: Rodrigo ALARCON PALOMARES (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0xb6f5ec1A0a9cd1526536D3F0426c429529471F40` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Sang Man Kim 2023-05-23 b6f5ec1a0a9cd1526536d3f0426c429529471f40 (sanctioned entity)
- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Sang Man Kim 2023-05-23 b6f5ec1a0a9cd1526536d3f0426c429529471f40 (sanctioned entity)
- **CHAINALYSIS**: SANCTIONED ENTITY: MOFA KR Jinyong IT Cooperation Company 2023-05-23 b6f5ec1a0a9cd1526536d3f0426c429529471f40 (sanctioned entity)
- **CHAINALYSIS**: SANCTIONED ENTITY: MOFA KR Jinyong IT Cooperation Company 2023-05-23 b6f5ec1a0a9cd1526536d3f0426c429529471f40 (sanctioned entity)
- **CHAINALYSIS**: SANCTIONS: MOFA KR Jinyong IT Cooperation Company 2023-05-23 b6f5ec1a0a9cd1526536d3f0426c429529471f40 (sanctions)
- **CHAINALYSIS**: SANCTIONS: MOFA KR Jinyong IT Cooperation Company 2023-05-23 b6f5ec1a0a9cd1526536d3f0426c429529471f40 (sanctions)
- **CHAINALYSIS**: SANCTIONS: OFAC SDN Sang Man Kim 2023-05-23 b6f5ec1a0a9cd1526536d3f0426c429529471f40 (sanctions)
- **CHAINALYSIS**: SANCTIONED ENTITY: MOFA KR Jinyong IT Cooperation Company 2023-05-23 b6f5ec1a0a9cd1526536d3f0426c429529471f40 (sanctioned entity)
- **CHAINALYSIS**: SANCTIONS: MOFA KR Jinyong IT Cooperation Company 2023-05-23 b6f5ec1a0a9cd1526536d3f0426c429529471f40 (sanctions)
- **CHAINALYSIS**: SANCTIONS: OFAC SDN Sang Man Kim 2023-05-23 b6f5ec1a0a9cd1526536d3f0426c429529471f40 (sanctions)
- **OFAC**: Sang Man KIM (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0xc2a3829F459B3Edd87791c74cD45402BA0a20Be3` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Task Force Rusich 2022-09-15 c2a3829f459b3edd87791c74cd45402ba0a20be3 (sanctioned entity)
- **CHAINALYSIS**: SANCTIONS: OFAC SDN Task Force Rusich 2022-09-15 c2a3829f459b3edd87791c74cd45402ba0a20be3 (sanctions)
- **OFAC**: TASK FORCE RUSICH (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0xd5ED34b52AC4ab84d8FA8A231a3218bbF01Ed510` — EOA [ACTIVE HOLDER]

- **OFAC**: FUNNULL TECHNOLOGY INC (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0xd882cFc20F52f2599D84b8e8D58C7FB62cfE344b` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Dmitrii Karasavidi 2020-09-16 d882cfc20f52f2599d84b8e8d58c7fb62cfe344b (sanctioned entity)
- **CHAINALYSIS**: SANCTIONS: OFAC SDN Dmitrii Karasavidi 2020-09-16 d882cfc20f52f2599d84b8e8d58c7fb62cfe344b (sanctions)
- **OFAC**: Dmitrii KARASAVIDI (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0xdcbEfFBECcE100cCE9E4b153C4e15cB885643193` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Roman Semenov dcbEfF 2023-08-23 dcbeffbecce100cce9e4b153c4e15cb885643193 (sanctioned entity)
- **OFAC**: Roman SEMENOV (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0xe7aa314c77F4233C18C6CC84384A9247c0cf367B` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN SUEX.io 2021-09-21 e7aa314c77f4233c18c6cc84384a9247c0cf367b (sanctioned entity)
- **CHAINALYSIS**: SANCTIONS: OFAC SDN SUEX.io 2021-09-21 e7aa314c77f4233c18c6cc84384a9247c0cf367b (sanctions)
- **OFAC**: SUEX OTC, S.R.O. (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0xeD6e0A7e4Ac94D976eeBfB82ccf777A3c6baD921` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Roman Semenov ed6e0a 2023-08-23 ed6e0a7e4ac94d976eebfb82ccf777a3c6bad921 (sanctioned entity)
- **OFAC**: Roman SEMENOV (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE` via Gnosis Safe 2/6; StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0xf3701F445b6BDaFeDbcA97D1e477357839e4120D` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Ivan Gennadievich Kondratiev 2024-02-20 f3701f445b6bdafedbca97d1e477357839e4120d (sanctioned entity)
- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Ivan Gennadievich Kondratiev 2024-02-20 f3701F f3701f445b6bdafedbca97d1e477357839e4120d (sanctioned entity)
- **OFAC**: Ivan Gennadievich KONDRATIEV (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_

### ⛔ `0xfEC8A60023265364D066a1212fDE3930F6Ae8da7` — EOA [ACTIVE HOLDER]

- **CHAINALYSIS**: SANCTIONS: OFAC SDN Yevgeniy Igorevich Polyanin 2021-11-08 fec8a60023265364d066a1212fde3930f6ae8da7 (sanctions)
- **CHAINALYSIS**: SANCTIONED ENTITY: OFAC SDN Yevgeniy Igorevich Polyanin 2021-11-08 fec8a60023265364d066a1212fde3930f6ae8da7 (sanctioned entity)
- **OFAC**: Yevgeniy Igorevich POLYANIN (sanctions)

_Seen in: StakedUSDeV2 / `FULL_RESTRICTED_STAKER_ROLE`_


---
## EOA Exposure Summary

The following roles are held by EOAs:

- **StakedUSDeV2** → `BLACKLIST_MANAGER_ROLE` held by EOA `0x21F9236e8EE76474284FE8cdE6EcE6c8D19D781e`
  Functions: `addToBlacklist(address target, bool isFullBlacklisting)`, `removeFromBlacklist(address target, bool isFullBlacklisting)`
- **StakedUSDeV2** → `BLACKLIST_MANAGER_ROLE` held by EOA `0x49e9f81A5cE0d492799c14049aEF12Df7BC955fE`
  Functions: `addToBlacklist(address target, bool isFullBlacklisting)`, `removeFromBlacklist(address target, bool isFullBlacklisting)`
- **StakingRewardsDistributor** → `operator()` held by EOA `0xe3880B792F6F0f8795CbAACd92E7Ca78F5d3646e`
  Functions: `transferInRewards(uint256 _rewardsAmount)`

---
## ✅ Scan Integrity

No issues detected. All block ranges covered, source and ABI resolved for all contracts.
