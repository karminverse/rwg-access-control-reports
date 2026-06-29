# Trustfall — Access Control Report — Frax USD (frxUSD)

| Field | Value |
|---|---|
| Contract | `0xCAcd6fd266aF91b8AeD52aCCc382b4e165586E29` |
| Token | Frax USD (frxUSD) |
| Name | FrxUSD |
| Chain | Ethereum |
| Proxy Status | ⚠️ **YES** — TransparentUpgradeable (upgradable) → `0x0000000048D2c8baf31742f6765383278BAda4d5` |
| OZ AccessControl | ❌ No |
| Ownable | ✅ Yes |
| Pausable | — |
| ERC-4626 Vault | — |
| Control Surface | — |
| Scan Integrity | ✅ No issues detected |
| Report Date | 2026-06-25 23:06 UTC |

### Surface Summary

| Field | Value |
|---|---:|
| Contracts | 11 |
| Role slots | 48 |
| Privileged Fns | 98 |
| EOA Holders | 0 |
| Critical Roles | 7 ⚠️ |

## Changes Since Last Scan

> Comparing **2026-06-02T22:25:07Z** (block 25232656) → **2026-06-25T23:05:52Z** (block 25397795).

### Contracts in scan
- ➕ `0xb898ad…e503` entered the scan
- ➕ `0xffffff…3937` entered the scan
- ➖ `0xb1748c…3f27` left the scan

### Roles
- ➕ New role `pendingOwner()` (`0x4f95c5…d87c`)
- ➕ New role `pendingOwner()` (`0x5fbaa3…4f33`)
- ➕ New role `pendingOwner()` (`0x860cc7…7857`)
- ➕ New role `admin()` (`0xb898ad…e503`)
- ➕ New role `pendingOwner()` (`0xcacd6f…6e29`)
- ➕ New role `pendingOwner()` (`0xe827ab…4e9c`)
- ➕ New role `pendingOwner()` (`0xfe2ea8…0a29`)
- ➕ New role `Safe Owners (4/7 required)` (`0xffffff…3937`)
- ➖ Role `Safe Owners (3/5 required)` no longer surfaced (`0xb1748c…3f27`)
- ➖ Role `freezer()` no longer surfaced (`0xcacd6f…6e29`)
- 🔄 `owner()` on **FraxOFTMintableAdapterUpgradeable** (`0x566a64…e4b0`)
    - member ➕ `0xffffff…3937`
    - member ➖ `0xb1748c…3f27`
- 🔄 `upgradeability (TransparentUpgradeable)` on **FrxUSDCustodianWithReceiver** (`0x860cc7…7857`)
    - member ➕ `0xb898ad…e503`
    - member ➖ `0xb1748c…3f27`
- 🔄 `owner()` on **FrxUSDCustodian** (`0xe827ab…4e9c`)
    - member ➕ `0xffffff…3937`
    - member ➖ `0xb1748c…3f27`
- 🔄 `upgradeability (TransparentUpgradeable)` on **FrxUSDCustodian** (`0xe827ab…4e9c`)
    - member ➕ `0xb898ad…e503`
    - member ➖ `0xb1748c…3f27`
- 🔄 `owner()` on **FrxUSDCustodian** (`0xfe2ea8…0a29`)
    - member ➕ `0xffffff…3937`
    - member ➖ `0xb1748c…3f27`
- 🔄 `owner()` on **FrxUSDCustodianUsdc** (`0x4f95c5…d87c`)
    - member ➕ `0xffffff…3937`
    - member ➖ `0xb1748c…3f27`
- 🔄 `upgradeability (TransparentUpgradeable)` on **FrxUSDCustodian** (`0xfe2ea8…0a29`)
    - member ➕ `0xb898ad…e503`
    - member ➖ `0xb1748c…3f27`
- 🔄 `upgradeability (TransparentUpgradeable)` on **FraxOFTMintableAdapterUpgradeable** (`0x566a64…e4b0`)
    - member ➕ `0xb898ad…e503`
    - member ➖ `0xb1748c…3f27`
- 🔄 `owner()` on **FrxUSDCustodianWithReceiver** (`0x860cc7…7857`)
    - member ➕ `0xffffff…3937`
    - member ➖ `0xb1748c…3f27`
- 🔄 `owner()` on **FrxUSD** (`0xcacd6f…6e29`)
    - member ➕ `0xffffff…3937`
    - member ➖ `0xb1748c…3f27`
- 🔄 `upgradeability (TransparentUpgradeable)` on **FrxUSDCustodianUsdc** (`0x4f95c5…d87c`)
    - member ➕ `0xb898ad…e503`
    - member ➖ `0xb1748c…3f27`
- 🔄 `owner()` on **ProxyAdmin** (`0x0b2c3d…4ed6`)
    - member ➕ `0xb898ad…e503`
    - member ➖ `0xb1748c…3f27`
- 🔄 `upgradeability (TransparentUpgradeable)` on **FrxUSD** (`0xcacd6f…6e29`)
    - member ➕ `0xb898ad…e503`
    - member ➖ `0xb1748c…3f27`
- 🔄 `upgradeability (TransparentUpgradeable)` on **FrxUSDCustodianWithOracle** (`0x5fbaa3…4f33`)
    - member ➕ `0xb898ad…e503`
    - member ➖ `0xb1748c…3f27`
- 🔄 `minter()` on **FrxUSD** (`0xcacd6f…6e29`)
    - member ➕ `0xb898ad…e503`
    - member ➖ `0xb1748c…3f27`
- 🔄 `owner()` on **FrxUSDCustodianWithOracle** (`0x5fbaa3…4f33`)
    - member ➕ `0xffffff…3937`
    - member ➖ `0xb1748c…3f27`

### Parameters
- ➕ New tracked parameter `MAXIMUM_DELAY` (`0xb898ad…e503`)
- ➕ New tracked parameter `MINIMUM_DELAY` (`0xb898ad…e503`)
- ➕ New tracked parameter `changeThreshold(uint256)` (`0xffffff…3937`)
- ➖ Parameter `changeThreshold(uint256)` no longer surfaced (`0xb1748c…3f27`)
- 🔄 `addMinter` on **FrxUSD** (`0xcacd6f…6e29`)
    - set_at_block: `23592684` → `25238508`
- 🔄 `deposit` on **FrxUSDCustodianUsdc** (`0x4f95c5…d87c`)
    - set_at_block: `25232659` → `25397722`
- 🔄 `removeMinter` on **FrxUSD** (`0xcacd6f…6e29`)
    - set_at_block: `22433283` → `25238508`
- 🔄 `mint` on **FrxUSDCustodianWithOracle** (`0x5fbaa3…4f33`)
    - set_at_block: `24750741` → `22297074`
    - silent_setter: `False` → `True`
- 🔄 `isApprovedOperator` on **FrxUSDCustodianUsdc** (`0x4f95c5…d87c`)
    - current_value: `EOA: True · EOA: True` → `EOA: False · EOA: True`
    - set_at_block: `24027941` → `25319375`
- 🔄 `mintFee` on **FrxUSDCustodian** (`0xfe2ea8…0a29`)
    - silent_setter: `False` → `True`
- 🔄 `isApprovedOperator` on **FrxUSDCustodianWithReceiver** (`0x860cc7…7857`)
    - current_value: `EOA: True · EOA: True` → `EOA: False · EOA: True`
    - set_at_block: `23992023` → `25319375`
- 🔄 `mint` on **FrxUSDCustodianUsdc** (`0x4f95c5…d87c`)
    - set_at_block: `25195093` → `24748745`
    - silent_setter: `False` → `True`
- 🔄 `owner` on **FrxUSD** (`0xcacd6f…6e29`)
    - current_value: `0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27` → `0xfFFffF4F3baC444b2C0ecf2A1840d018bE783937`
- 🔄 `minter_mint` on **FrxUSD** (`0xcacd6f…6e29`)
    - silent_setter: `False` → `True`
- 🔄 `mintCap` on **FrxUSDCustodianWithReceiver** (`0x860cc7…7857`)
    - current_value: `100000000000000000000000 (100,000.000000e18)` → `25000000000000000000000000 (25,000,000.000000e18)`
    - set_at_block: `0` → `25290175`

### Analyst Focus Areas
- ➕ New: HIGH::Observed: Compound Timelock (1d) controls both admin and upgrades
- ➕ New: HIGH::Observed: volatile parameter `mint` on FrxUSDCustodianUsdc
- ➖ Resolved (no longer surfaced): CRITICAL::Observed: upgrade path has no timelock on FraxOFTMintableAdapterUpgradeable
- ➖ Resolved (no longer surfaced): CRITICAL::Observed: upgrade path has no timelock on FrxUSD
- ➖ Resolved (no longer surfaced): CRITICAL::Observed: upgrade path has no timelock on FrxUSDCustodian
- ➖ Resolved (no longer surfaced): CRITICAL::Observed: upgrade path has no timelock on FrxUSDCustodianUsdc
- ➖ Resolved (no longer surfaced): CRITICAL::Observed: upgrade path has no timelock on FrxUSDCustodianWithOracle
- ➖ Resolved (no longer surfaced): CRITICAL::Observed: upgrade path has no timelock on FrxUSDCustodianWithReceiver
- ➖ Resolved (no longer surfaced): HIGH::Observed: Gnosis Safe 3/5 controls both admin and upgrades
- ➖ Resolved (no longer surfaced): HIGH::Observed: volatile parameter `minter_mint` on FrxUSD


## 📋 Protocol Context

> *From protocol profile: Frax Finance / frxUSD (Stablecoin)*

<details>
<summary><strong>Architecture</strong></summary>

- **Architectural shape:** Safe-only authority with NO Timelock anywhere in governance chain — single 3/5 Gnosis Safe gates owner() across the entire frxUSD stack (token + 4 custodians + ProxyAdmin); upgrades and admin actions land immediately
- ERC-20 stablecoin with ERC-1967 TransparentUpgradeableProxy pattern
- **Inherits:** ERC20, ERC20Permit, ERC20Burnable, Ownable2Step, EIP712Module, EIP3009Module
- **Minter system:** owner adds/removes addresses to minters mapping via addMinter/removeMinter
- Minters call minter_mint(addr, amount) and minter_burn_from(addr, amount) — NOT standard mint/burn names
- **Freeze system:** owner adds/removes freezer addresses; freezers can freeze/thaw accounts, blocking all transfers
- **Pausable:** owner can pause() / unpause() all transfers globally; owner bypasses pause and freeze checks
- **Burn capability:** owner can burn(addr, amount) and burnMany() from any account — confiscation risk
- **EIP-3009 meta-transactions:** transferWithAuthorization, receiveWithAuthorization, cancelAuthorization
- ProxyAdmin (0x0b2C3dF006b2bd43cBCC60075e7a0bf314474eD6) owned by same Gnosis Safe as token owner
- No timelock anywhere in the governance chain — upgrades and admin actions are immediate
- 4 implementation upgrades since deployment (2025-01-03), adding freeze, pause, burn, EIP-3009, freezer delegation
- LayerZero v2 OFT bridge sub-stack surfaced via FraxOFTMintableAdapterUpgradeable (minter(#2)): EndpointV2 (0x1a44...728c) → OneSig (owner) · ReceiverLZ (0x0e46...73e9, OApp receiver) → Receiver (0x5317...aE26, holds gateKeeper admin). Both ReceiverLZ.owner() and Receiver.DEFAULT_ADMIN_ROLE are controlled by EOA 0x89c0a6BF...C6b1 — second independent supply-authority surface alongside the Gnosis Safe 3/5 bridge path
- **OApp pause state:** Frax paused the OFT adapter on 2026-04-19 by clearing its peer set (0 peers on EndpointV2). Inbound LZ path is structurally disabled — ReceiverLZ/Receiver no longer reachable via BFS. Dual supply surface from the LZ sub-stack is INERT in the current snapshot. Un-pause is a single `setPeer` tx from the Gnosis Safe 3/5 away; monitor 0x566a6442... for setPeer events to re-enable the path.

</details>

<details>
<summary><strong>Function Interaction Paths</strong></summary>

- **`addMinter(address)`** (`owner()`)
  - Grants address the ability to call minter_mint() — unbounded token supply inflation
  - Also grants minter_burn_from() — can destroy tokens from any approved address
  - No cap or rate limit on minting — minter can mint arbitrary amounts in a single tx
  - ⚠️ *Each minter is an uncapped supply authority. Owner adding a malicious minter = infinite mint.*
- **`freeze(address) / freezeMany(address[])`** (`isFreezer / owner()`)
  - _update() override checks frozen status — ALL transfers to/from frozen address revert
  - Frozen account cannot send, receive, or be approved for transfers
  - Owner can subsequently call burn() to destroy frozen account's balance
  - ⚠️ *Freeze + burn = full confiscation path. Freezer role alone cannot burn — requires owner cooperation.*
- **`burn(address, uint256) / burnMany(address[], uint256[])`** (`owner()`)
  - Destroys tokens from ANY account — if amount is 0, entire balance is burned
  - No requirement for account to be frozen first (though typically used on frozen accounts)
  - burnMany has no per-account event — silent batch confiscation
  - ⚠️ *Owner can unilaterally destroy any user's balance. burnMany is silent (no granular event). Critical confiscation risk.*
- **`pause()`** (`owner()`)
  - All transfers, approvals, and minting revert for non-owner addresses
  - Owner bypasses pause check — can still transfer and operate while paused
  - Minters cannot mint while paused (they are not owner)
  - ⚠️ *Global halt — freezes all DeFi integrations. Owner retains full functionality during pause.*
- **`addFreezer(address)`** (`owner()`)
  - Delegates freeze/thaw authority to a new address
  - Freezer can freeze any account but CANNOT burn — separation of duties
  - Multiple freezers can coexist (mapping, not single slot)
  - ⚠️ *Operational delegation — allows fast compliance response without owner multisig latency.*
- **`upgradeToAndCall(address, bytes)`** (`ProxyAdmin owner (Gnosis Safe 3/5)`)
  - Replaces entire implementation contract — arbitrary code change
  - Can add new functions, remove existing ones, change storage layout
  - No timelock — upgrade is effective immediately upon multisig execution
  - ⚠️ *Instant upgrade without timelock is CRITICAL — 3/5 signers can replace all contract logic with no user exit window.*
- **`multi-bridge minter sprawl (7 active + 1 historical-removed)`** (`owner() — cumulative over time`)
  - 8 cumulative addMinter events to date; scanner resolves minter() to 7 ACTIVE members and 1 historical-removed as of 2026-04-17 rescan (soft-delete zero-skip fix applied)
  - Active set (verified on-chain via minters(addr) → true): Gnosis Safe 3/5 (0xB174...3f27, also holds owner()) + 6 bridge/custodian proxies — FrxUSDCustodianUsdc (0x4F95), FraxOFTMintableAdapterUpgradeable (0x566a), FrxUSDCustodianWithOracle (0x5fbA), FrxUSDCustodianWithReceiver (0x860C), FrxUSDCustodian (0xE827), TransparentUpgradeableProxy (0xFE2E)
  - Historical removed (explicit MinterRemoved event): 0x3c2f...2E91 — 1 address
  - All 6 bridge/custodian minters are themselves upgradeable proxies. Compromise or upgrade of ANY bridge proxy grants uncapped mint authority on frxUSD
  - ⚠️ *Active minter surface is 7 addresses including 6 independent upgradeable bridge/custodian proxies. Blast radius is the UNION of all bridge proxy upgrade paths — compromise of any single bridge proxy (or its upgrade controller) yields root-token mint authority. Verify custody and upgrade controls on each bridge proxy individually; aggregating them into a single "Safe 3/5" authority would under-estimate risk.
*

</details>

## 📑 Table of Contents

1. [Analyst Focus Areas](#analyst-focus-areas)
2. Contracts
   - [frxUSD ★](#c-0xcacd6fd266af91b8aed52accc382b4e165586e29)
   - [FrxUSDCustodianUsdc](#c-0x4f95c5ba0c7c69fb2f9340e190ccee890b3bd87c)
   - [FraxOFTMintableAdapterUpgradeable](#c-0x566a6442a5a6e9895b9dca97cc7879d632c6e4b0)
   - [FrxUSDCustodianWithOracle](#c-0x5fbaa3a3b489199338fbd85f7e3d444dc0504f33)
   - [FrxUSDCustodianWithReceiver](#c-0x860cc723935fc9a15ff8b1a94237a711dfef7857)
   - [FrxUSDCustodian (0xE827...4E9c)](#c-0xe827abf9f462ac4f147753d86bc5f91e186e4e9c)
   - [FrxUSDCustodian (0xFE2E...0a29)](#c-0xfe2ea8de262d956e852f12de108fda57171a0a29)
   - [Timelock](#c-0xb898ad2976b4d8f2e21521c9db16b7497825e503)
   - [EndpointV2](#c-0x1a44076050125825900e736c501f859c50fe728c)
3. [⚡ Authority Concentration](#-authority-concentration)
4. [⛔ Sanctions Screening](#-sanctions-screening)
5. [EOA Exposure Summary](#eoa-exposure-summary)
6. [✅ Scan Integrity](#scan-integrity)

## Analyst Focus Areas

> **Observational findings — not risk determinations.** Each item below is a focus point for the Risk Analyst to interpret against collateralization context and the protocol's stated intent. Attention levels (CRITICAL / HIGH / LOW) reflect the scanner's heuristic weight — not a realized risk to FiRM. These observations support future risk assessments; they do not constitute one.

> **5 critical-attention** and **16 high-attention** observation(s) across 11 contract(s).


### 🔴 CRITICAL (5)

- 🔴 [**Observed: upgrade surfaced new inflationary/upgrade authority on FrxUSD**](#c-0xcacd6fd266af91b8aed52accc382b4e165586e29) — Upgrade on 2025-08-05 (+9/-0 fn) [+BLACKLIST, PAUSE, SUPPLY]. Review the Upgrade History table to verify intent.
- 🔴 [**Observed: upgrade surfaced new access-control authority on FrxUSD**](#c-0xcacd6fd266af91b8aed52accc382b4e165586e29) — Upgrade on 2026-04-02 (+3/-0 fn) [+ACCESS_CONTROL]. Access-control primitives: added `addFreezer`, `removeFreezer`. Review the Upgrade History table to verify intent.
- 🔴 [**Observed: upgrade surfaced new inflationary/upgrade authority on FrxUSDCustodianUsdc**](#c-0x4f95c5ba0c7c69fb2f9340e190ccee890b3bd87c) — Upgrade on 2025-11-21 (+1/-0 fn) [+SUPPLY]. Review the Upgrade History table to verify intent.
- 🔴 [**Observed: upgrade surfaced new access-control authority on FraxOFTMintableAdapterUpgradeable**](#c-0x566a6442a5a6e9895b9dca97cc7879d632c6e4b0) — Upgrade on 2025-02-04 (+6/-0 fn) [+ACCESS_CONTROL]. Access-control primitives: added `renounceOwnership`, `transferOwnership`. Review the Upgrade History table to verify intent.
- 🔴 [**Observed: upgrade surfaced new inflationary/upgrade authority on FrxUSDCustodianWithReceiver**](#c-0x860cc723935fc9a15ff8b1a94237a711dfef7857) — Upgrade on 2025-11-21 (+1/-0 fn) [+SUPPLY]. Review the Upgrade History table to verify intent.

### 🟠 HIGH (16)

- 🟠 [**Observed: Compound Timelock (1d) controls both admin and upgrades**](#c-0xb898ad2976b4d8f2e21521c9db16b7497825e503) — `0xb898Ad2976b4d8f2E21521C9db16b7497825E503` holds admin + upgrade authority across FraxOFTMintableAdapterUpgradeable, FrxUSD, FrxUSDCustodian, FrxUSDCustodianUsdc, FrxUSDCustodianWithOracle, FrxUSDCustodianWithReceiver, ProxyAdmin — single entity controls full stack. Verify governance design.
- 💰 **Observed: 13 role(s) with supply-altering capability** — Supply-altering surface detected: `minter()` on FrxUSD, `owner()` on FrxUSD, `frxUSD()` on FrxUSDCustodian +10 more. Assess each holder's custody and governance.
- ⏸️ **Observed: 1 role(s) with pause capability** — Pause surface detected: `owner()` on FrxUSD. Assess pause authority governance.
- 🚫 **Observed: 1 role(s) with blacklist/freeze capability** — Blacklist/freeze surface detected: `owner()` on FrxUSD. Assess censorship implications for FiRM collateral.
- 🔗 [**Observed: supply authority chain on FraxOFTMintableAdapterUpgradeable**](#c-0x566a6442a5a6e9895b9dca97cc7879d632c6e4b0) — Chain: FrxUSD → `minter()` → FraxOFTMintableAdapterUpgradeable. Controlled by: `endpoint()`, `owner()`, `upgradeability (TransparentUpgradeable)`. Assess custody — compromise of this chain could affect root token supply.
- 🔗 [**Observed: supply authority chain on FrxUSDCustodian**](#c-0xe827abf9f462ac4f147753d86bc5f91e186e4e9c) — Chain: FrxUSD → `minter()` → FrxUSDCustodian. Controlled by: `frxUSD()`, `owner()`, `upgradeability (TransparentUpgradeable)`. Assess custody — compromise of this chain could affect root token supply.
- ⚠️ [**No Timelock in admin chain: `owner()` on FrxUSD**](#c-0xb898ad2976b4d8f2e21521c9db16b7497825e503) — `owner()` has SUPPLY capability and is held by: `0xfFFf...3937` (Safe). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `owner()` on FrxUSDCustodianUsdc**](#c-0x4f95c5ba0c7c69fb2f9340e190ccee890b3bd87c) — `owner()` has SUPPLY capability and is held by: `0xfFFf...3937` (Safe). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `WTGXX_CUSTODIAN_MAINNET()` on FrxUSDCustodianUsdc**](#c-0x4f95c5ba0c7c69fb2f9340e190ccee890b3bd87c) — `WTGXX_CUSTODIAN_MAINNET()` has SUPPLY capability and is held by: `0x860C...7857` (Contract). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `owner()` on FrxUSDCustodianWithOracle**](#c-0x5fbaa3a3b489199338fbd85f7e3d444dc0504f33) — `owner()` has SUPPLY capability and is held by: `0xfFFf...3937` (Safe). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `owner()` on FrxUSDCustodianWithReceiver**](#c-0x860cc723935fc9a15ff8b1a94237a711dfef7857) — `owner()` has SUPPLY capability and is held by: `0xfFFf...3937` (Safe). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `owner()` on FrxUSDCustodian**](#c-0xe827abf9f462ac4f147753d86bc5f91e186e4e9c) — `owner()` has SUPPLY capability and is held by: `0xfFFf...3937` (Safe). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.

<details>
<summary>🔄 **3 volatile parameter(s) observed across 2 contract(s) (≥5 historical changes each)** — Operational tempo signal — high-velocity setters indicate active governance maintenance, oracle keepers, or routinely-tuned risk parameters. Expand to review each parameter's change count and current value; assess against the protocol's stated intent.</summary>

- 🔄 [**Observed: volatile parameter `addMinter` on FrxUSD**](#c-0xcacd6fd266af91b8aed52accc382b4e165586e29) — `addMinter(address minter_address)` changed 10 times. Current value: ``. Assess change pattern.
- 🔄 [**Observed: volatile parameter `mintCap` on FrxUSDCustodianUsdc**](#c-0x4f95c5ba0c7c69fb2f9340e190ccee890b3bd87c) — `setMintCap(uint256 _mintCap)` changed 9 times. Current value: `400000000000000000000000000 (400,000,000.000000e18)`. Assess change pattern.
- 🔄 [**Observed: volatile parameter `mint` on FrxUSDCustodianUsdc**](#c-0x4f95c5ba0c7c69fb2f9340e190ccee890b3bd87c) — `mint(uint256 _sharesOut, address _receiver)` changed 6 times. Current value: ``. Assess change pattern.

</details>


### 🟢 LOW (2)

- 🟢 [**Observed: upgrade large non-privileged surface change on FrxUSD**](#c-0xcacd6fd266af91b8aed52accc382b4e165586e29) — Upgrade on 2026-01-26 (+8/-1 fn). Review the Upgrade History table to verify intent.
- 🟢 [**Observed: upgrade large non-privileged surface change on FraxOFTMintableAdapterUpgradeable**](#c-0x566a6442a5a6e9895b9dca97cc7879d632c6e4b0) — Upgrade on 2025-10-16 (+6/-1 fn). Review the Upgrade History table to verify intent.

> **Standard review checklist:** Verify role-holder identities, timelock delays, multisig quorum and signers, upgrade-path custody, and parameter bounds against current protocol spec — regardless of findings above.

## Proxy Admin

| Field | Value |
|---|---|
| ProxyAdmin contract | `0x0b2C3dF006b2bd43cBCC60075e7a0bf314474eD6` |
| ProxyAdmin owner | `0xb898Ad2976b4d8f2E21521C9db16b7497825E503` |

## Attention Legend

> Attention levels indicate how prominently a signal should feature in the analyst's review — not the realized risk to FiRM.

| Icon | Attention | Meaning |
|---|---|---|
| 🔴 | CRITICAL | EOA private key, unknown upgrader, or unprotected upgrade path — verify immediately |
| 🟠 | HIGH | Unrecognised contract or elevated privilege pattern — requires investigation |
| 🟢 | LOW | Standard custodial pattern — Gnosis Safe, TimelockController, ERC-4626 vault, OZ Governor, Aragon Agent |
| 🔵 | DISCREPANCY | Storage and event history disagree — investigate for data integrity |

---
<a id="c-0xcacd6fd266af91b8aed52accc382b4e165586e29"></a>
## FrxUSD `0xCAcd6fd266aF91b8AeD52aCCc382b4e165586E29`

> ⚠️ **Upgradeable** (TransparentUpgradeable) — impl: `0x0000000048D2c8baf31742f6765383278BAda4d5`

**Proxy History (5 events):**

| # | Date | Event | Address | Key Changes | Tx |
|---|---|---|---|---|---|
| 1 | 2025-01-03 | Upgrade | `0xA8F9...d1f1` | Initial deployment | [0x434a6145fb12b16d1e2c3d09211f0221046af620ee724ff06d9c66e6a3423e87](https://etherscan.io/tx/0x434a6145fb12b16d1e2c3d09211f0221046af620ee724ff06d9c66e6a3423e87) |
| 2 | 2025-01-03 | Admin Changed | `0x0b2C...4eD6` | Previous: `0x0000...0000` | [0x434a6145fb12b16d1e2c3d09211f0221046af620ee724ff06d9c66e6a3423e87](https://etherscan.io/tx/0x434a6145fb12b16d1e2c3d09211f0221046af620ee724ff06d9c66e6a3423e87) |
| 3 | 2025-08-05 | Upgrade | `0x0000...5812` | +9 fn; added `burn(address,uint256)`; added `burnMany(address[],uint256[])`; added `freeze(address)`; added `freezeMany(address[])`; added `isPaused()`; added `pause()`; added `thaw(address)`; added `thawMany(address[])`; added `unpause()`; 📝 src +242/-128 | [0x28fb3ef4ff328c82a51cc5bf14a0eae65291e9bc44905b651333bf6ab91a6e13](https://etherscan.io/tx/0x28fb3ef4ff328c82a51cc5bf14a0eae65291e9bc44905b651333bf6ab91a6e13) |
| 4 | 2026-01-26 | Upgrade | `0xBFA1...fB40` | +8 fn; added `authorizationState(address,bytes32)`; added `cancelAuthorization(address,bytes32,bytes)`; added `cancelAuthorization(address,bytes32,uint8,bytes32,bytes32)`; added `permit(address,address,uint256,uint256,bytes)`; added `receiveWithAuthorization(address,address,uint256,uint256,uint256,bytes32,bytes)`; added `receiveWithAuthorization(address,address,uint256,uint256,uint256,bytes32,uint8,bytes32,bytes32)`; added `transferWithAuthorization(address,address,uint256,uint256,uint256,bytes32,bytes)`; added `transferWithAuthorization(address,address,uint256,uint256,uint256,bytes32,uint8,bytes32,bytes32)`; -1 fn; removed `initialize(address,string,string)`; 📝 src +2765/-1782 | [0xb0e4af1862737afc53bb4dd4d3ac1e1cbc1f64b48135f48fe581080adf9d76b2](https://etherscan.io/tx/0xb0e4af1862737afc53bb4dd4d3ac1e1cbc1f64b48135f48fe581080adf9d76b2) |
| 5 | 2026-04-02 | Upgrade | `0x0000...a4d5` | +3 fn; added `addFreezer(address)`; added `isFreezer(address)`; added `removeFreezer(address)`; 📝 src +30/-3 | [0xad37322803909020615d8789f0c1a50ea358a3f71222b7b9a0f303053d318c56](https://etherscan.io/tx/0xad37322803909020615d8789f0c1a50ea358a3f71222b7b9a0f303053d318c56) |

<details>
<summary>📝 Source diff — upgrade #3 (<code>0xA8F9...d1f1</code> → <code>0x0000...5812</code>): +242/-128 lines</summary>

```diff
--- old_impl
+++ new_impl
@@ -7,140 +7,254 @@
 import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
 import { StorageSlot } from "@openzeppelin/contracts/utils/StorageSlot.sol";
 
-/// @title FrxUSD 
+/// @title FrxUSD
 /**
  * @notice Combines Openzeppelin's ERC20Permit, ERC20Burnable and Ownable2Step.
  *     Also includes a list of authorized minters
  */
 /// @dev FrxUSD adheres to EIP-712/EIP-2612 and can use permits
-contract FrxUSD is
-    ERC20Permit,
-    ERC20Burnable,
-    Ownable2Step
-{
-    /// @notice Array of the non-bridge minters
-    address[] public minters_array;
-
-    /// @notice Mapping of the minters
-    /// @dev Mapping is used for faster verification
-    mapping(address => bool) public minters;
-
-    /* ========== CONSTRUCTOR ========== */
-    /// @param _ownerAddress The initial owner
-    /// @param _name ERC20 name
-    /// @param _symbol ERC20 symbol
-    constructor(
-        address _ownerAddress,
-        string memory _name,
-        string memory _symbol
-    ) ERC20(_name, _symbol) ERC20Permit(_name) Ownable(_ownerAddress) {
-    }
-
-    /* ========== INITIALIZER ========== */
-    /// @dev Used to initialize the contract when it is behind a proxy
-    function initialize(
-        address _owner,
-        string memory _name,
-        string memory _symbol
-    ) public {
-        require(owner() == address(0), "Already initialized");
-        _transferOwnership(_owner);
-        StorageSlot.getBytesSlot(bytes32(uint256(3))).value = bytes(_name);
-        StorageSlot.getBytesSlot(bytes32(uint256(4))).value = bytes(_symbol);
-    }
-
-    /* ========== MODIFIERS ========== */
-
-    /// @notice A modifier that only allows a minters to call
-    modifier onlyMinters() {
-        require(minters[msg.sender] == true, "Only minters");
-        _;
-    }
-
-    /* ========== RESTRICTED FUNCTIONS [MINTERS] ========== */
-
-    /// @notice Used by minters to burn tokens
-    /// @param b_address Address of the account to burn from
-    /// @param b_amount Amount of tokens to burn
-    function minter_burn_from(address b_address, uint256 b_amount) public onlyMinters {
-        super.burnFrom(b_address, b_amount);
-        emit TokenMinterBurned(b_address, msg.sender, b_amount);
-    }
-
-    /// @notice Used by minters to mint new tokens
-    /// @param m_address Address of the account to mint to
-    /// @param m_amount Amount of tokens to mint
-    function minter_mint(address m_address, uint256 m_amount) public onlyMinters {
-        super._mint(m_address, m_amount);
-        emit TokenMinterMinted(msg.sender, m_address, m_amount);
-    }
-
-
-    /* ========== RESTRICTED FUNCTIONS [OWNER] ========== */
-    /// @notice Adds a minter
-    /// @param minter_address Address of minter to add
-    function addMinter(address minter_address) public onlyOwner {
-        require(minter_address != address(0), "Zero address detected");
-
-        require(minters[minter_address] == false, "Address already exists");
-        minters[minter_address] = true;
-        minters_array.push(minter_address);
-
-        emit MinterAdded(minter_address);
-    }
-
-    /// @notice Removes a non-bridge minter
-    /// @param minter_address Address of minter to remove
-    function removeMinter(address minter_address) public onlyOwner {
-        require(minter_address != address(0), "Zero address detected");
-        require(minters[minter_address] == true, "Address nonexistant");
-
-        // Delete from the mapping
-        delete minters[minter_address];
-
-        // 'Delete' from the array by setting the address to 0x0
-        for (uint256 i = 0; i < minters_array.length; i++) {
-            if (minters_array[i] == minter_address) {
-                minters_array[i] = address(0); // This will leave a null in the array and keep the indices the same
-                break;
-            }
-        }
-
-        emit MinterRemoved(minter_address);
-    }
-
-    /* ========== EVENTS ========== */
-
-    /// @notice Emitted whenever the bridge burns tokens from an account
-    /// @param account Address of the account tokens are being burned from
-    /// @param amount  Amount of tokens burned
-    event Burn(address indexed account, uint256 amount);
-
-    /// @notice Emitted whenever the bridge mints tokens to an account
-    /// @param account Address of the account tokens are being minted for
-    /// @param amount  Amount of tokens minted.
-    event Mint(address indexed account, uint256 amount);
-
-    /// @notice Emitted when a non-bridge minter is added
-    /// @param minter_address Address of the new minter
-    event MinterAdded(address minter_address);
-
-    /// @notice Emitted when a non-bridge minter is removed
-    /// @param minter_address Address of the removed minter
-    event MinterRemoved(address minter_address);
-
-    /// @notice Emitted when a non-bridge minter burns tokens
-    /// @param from The account whose tokens are burned
-    /// @param to The minter doing the burning
-    /// @param amount Amount of tokens burned
-    event TokenMinterBurned(address indexed from, address indexed to, uint256 amount);
-
-    /// @notice Emitted when a non-bridge minter mints tokens
-    /// @param from The minter doing the minting
-    /// @param to The account that gets the newly minted tokens
-    /// @param amount Amount of tokens minted
-    event TokenMinterMinted(address indexed from, address indexed to, uint256 amount);
+contract FrxUSD is ERC20Permit, ERC20Burnable, Ownable2Step {
+  /// @notice Array of the non-bridge minters
+  address[] public minters_array;
+
+  /// @notice Mapping of the minters
+  /// @dev Mapping is used for faster verification
+  mapping(address => bool) public minters;
+
+  /// @notice Mapping indicating which addresses are frozen
+  mapping(address => bool) public isFrozen;
+
+  /// @notice Whether or not the contract is paused
+  bool public isPaused;
+
+  /* ========== CONSTRUCTOR ========== */
+  /// @param _ownerAddress The initial owner
+  /// @param _name ERC20 name
+  /// @param _symbol ERC20 symbol
+  constructor(
+    address _ownerAddress,
+    string memory _name,
+    string memory _symbol
+  ) ERC20(_name, _symbol) ERC20Permit(_name) Ownable(_ownerAddress) {}
+
+  /* ========== INITIALIZER ========== */
+  /// @dev Used to initialize the contract when it is behind a proxy
+  function initialize(address _owner, string memory _name, string memory _symbol) public {
+    require(owner() == address(0), "Already initialized");
+    if (_owner == address(0)) revert OwnerCannotInitToZeroAddress();
+    _transferOwnership(_owner);
+    StorageSlot.getBytesSlot(bytes32(uint256(3))).value = bytes(_name);
+    StorageSlot.getBytesSlot(bytes32(uint256(4))).value = bytes(_symbol);
+  }
+
+  /* ========== MODIFIERS ========== */
+
+  /// @notice A modifier that only allows a minters to call
+  modifier onlyMinters() {
+    require(minters[msg.sender] == true, "Only minters");
+    _;
+  }
+
+  /* ========== RESTRICTED FUNCTIONS [MINTERS] ========== */
+
+  /// @notice Used by minters to burn tokens
+  /// @param b_address Address of the account to burn from
+  /// @param b_amount Amount of tokens to burn
+  function minter_burn_from(address b_address, uint256 b_amount) public onlyMinters {
+    super.burnFrom(b_address, b_amount);
+    emit TokenMinterBurned(b_address, msg.sender, b_amount);
+  }
+
+  /// @notice Used by minters to mint new tokens
+  /// @param m_address Address of the account to mint to
+  /// @param m_amount Amount of tokens to mint
+  function minter_mint(address m_address, uint256 m_amount) public onlyMinters {
+    super._mint(m_address, m_amount);
+    emit TokenMinterMinted(msg.sender, m_address, m_amount);
+  }
+
+  /* ========== RESTRICTED FUNCTIONS [OWNER] ========== */
+  /// @notice Adds a minter
+  /// @param minter_address Address of minter to add
+  function addMinter(address minter_address) public onlyOwner {
+    require(minter_address != address(0), "Zero address detected");
+
+    require(minters[minter_address] == false, "Address already exists");
+    minters[minter_address] = true;
+    minters_array.push(minter_address);
+
+    emit MinterAdded(minter_address);
+  }
+
+  /// @notice Removes a non-bridge minter
+  /// @param minter_address Address of minter to remove
+  function removeMinter(address minter_address) public onlyOwner {
+    require(minter_address != address(0), "Zero address detected");
+    require(minters[minter_address] == true, "Address nonexistant");
+
+    // Delete from the mapping
+    delete minters[minter_address];
+
+    // 'Delete' from the array by setting the address to 0x0
+    for (uint256 i = 0; i < minters_array.length; i++) {
+      if (minters_array[i] == minter_address) {
+        minters_array[i] = address(0); // This will leave a null in the array and keep the indices the same
+        break;
+      }
+    }
+
+    emit MinterRemoved(minter_address);
+  }
+
+  /// @notice External admin gated function to unfreeze a set of accounts
+  /// @param _owners Array of accounts to be unfrozen
+  function thawMany(address[] memory _owners) external onlyOwner {
+    uint256 len = _owners.length;
+    for (uint256 i; i < len; ++i) {
+      _thaw(_owners[i]);
+    }
+  }
+
+  /// @notice External admin gated function to unfreeze an account
+  /// @param _owner The account to be unfrozen
+  function thaw(address _owner) external onlyOwner {
+    _thaw(_owner);
+  }
+
+  /// @notice External admin gated function to batch freeze a set of accounts
+  /// @param _owners Array of accounts to be frozen
+  function freezeMany(address[] memory _owners) external onlyOwner {
+    uint256 len = _owners.length;
+    for (uint256 i; i < len; ++i) {
+      _freeze(_owners[i]);
+    }
+  }
+
+  /// @notice External admin gated function to freeze a given account
+  /// @param _owner The account to be
+  function freeze(address _owner) external onlyOwner {
+    _freeze(_owner);
+  }
+
+  /// @notice External admin gated function to batch burn balance from a set of accounts
+  /// @param _owners Array of accounts whose balances will be burned
+  /// @param _amounts Array of amounts corresponding to the balances to be burned
+  /// @dev if `_amount` == 0, entire balance will be burned
+  function burnMany(address[] memory _owners, uint256[] memory _amounts) external onlyOwner {
+    uint lenOwner = _owners.length;
+    if (_owners.length != _amounts.length) revert ArrayMisMatch();
+    for (uint i; i < lenOwner; ++i) {
+      if (_amounts[i] == 0) _amounts[i] = balanceOf(_owners[i]);
+      _burn(_owners[i], _amounts[i]);
+    }
+  }
+
+  /// @notice External admin gated function to burn balance from a given account
+  /// @param _owner  The account whose balance will be burned
+  /// @param _amount The amount of balance to burn
+  /// @dev if `_amount` == 0, entire balance will be burned
+  function burn(address _owner, uint256 _amount) external onlyOwner {
+    if (_amount == 0) _amount = balanceOf(_owner);
+    _burn(_owner, _amount);
+  }
+
+  /// @notice External admin gated pause function
+  function pause() external onlyOwner {
+    isPaused = true;
+    emit Paused();
+  }
+
+  /// @notice External admin gated unpause function
+  function unpause() external onlyOwner {
+    isPaused = false;
+    emit Unpaused();
+  }
+
+  /* ========== Internals For Admin Gated ========== */
+
+  /// @notice Internal helper function to freeze an account
+  /// @param _owner The account to 'frozen'
+  function _freeze(address _owner) internal {
+    isFrozen[_owner] = true;
+    emit AccountFrozen(_owner);
+  }
+
+  /// @notice Internal helper function to unfreeze an account
+  /// @param _owner The account to unfreeze
+  function _thaw(address _owner) internal {
+    isFrozen[_owner] = false;
+    emit AccountThawed(_owner);
+  }
+
+  /* ========== Overrides ========== */
+
+  /// @notice override for base internal `_update(address,address,uint256)`
+  ///         implements `paused` and `frozen` transfer logic
+  /// @param from  The address from which balance is originating
+  /// @param to    The address whose balance will be incremented
+  /// @param value The amount to increment/decrement the balances of
+  /// @dev Owner can bypass pause and freeze checks
+  function _update(address from, address to, uint256 value) internal override {
+    if (msg.sender != owner()) {
+      if (isPaused) revert IsPaused();
+      if (isFrozen[to] || isFrozen[from] || isFrozen[msg.sender]) revert IsFrozen();
+    }
+    super._update(from, to, value);
+  }
+
+  /* ========== EVENTS ========== */
+
+  /// @notice Emitted whenever the bridge burns tokens from an account
+  /// @param account Address of the account tokens are being burned from
+  /// @param amount  Amount of tokens burned
+  event Burn(address indexed account, uint256 amount);
+
+  /// @notice Emitted whenever the bridge mints tokens to an account
+  /// @param account Address of the account tokens are being minted for
+  /// @param amount  Amount of tokens minted.
+  event Mint(address indexed account, uint256 amount);
+
+  /// @notice Emitted when a non-bridge minter is added
+  /// @param minter_address Address of the new minter
+  event MinterAdded(address minter_address);
+
+  /// @notice Emitted when a non-bridge minter is removed
+  /// @param minter_address Address of the removed minter
+  event MinterRemoved(address minter_address);
+
+  /// @notice Emitted when a non-bridge minter burns tokens
+  /// @param from The account whose tokens are burned
+  /// @param to The minter doing the burning
+  /// @param amount Amount of tokens burned
+  event TokenMinterBurned(address indexed from, address indexed to, uint256 amount);
+
+  /// @notice Emitted when a non-bridge minter mints tokens
+  /// @param from The minter doing the minting
+  /// @param to The account that gets the newly minted tokens
+  /// @param amount Amount of tokens minted
+  event TokenMinterMinted(address indexed from, address indexed to, uint256 amount);
+
+  /// @notice Event Emitted when the contract is paused
+  event Paused();
+
+  /// @notice Event Emitted when the contract is unpaused
+  event Unpaused();
+
+  /// @notice Event Emitted when an address is frozen
+  /// @param account The account being frozen
+  event AccountFrozen(address account);
+
+  /// @notice Event Emitted when an address is unfrozen
+  /// @param account The account being thawed
+  event AccountThawed(address account);
+
+  /* ========== ERRORS ========== */
+  error ArrayMisMatch();
+  error IsPaused();
+  error IsFrozen();
+  error OwnerCannotInitToZeroAddress();
 }
+
 
 // SPDX-License-Identifier: MIT
 // OpenZeppelin Contracts (last updated v5.1.0) (token/ERC20/extensions/ERC20Permit.sol)
```

</details>

<details>
<summary>📝 Source diff — upgrade #4 (<code>0x0000...5812</code> → <code>0xBFA1...fB40</code>): +2765/-1782 lines (truncated)</summary>

```diff
--- old_impl
+++ new_impl
@@ -1,258 +1,327 @@
+// SPDX-License-Identifier: AGPL-3.0-only
+pragma solidity ^0.8.0;
+
+// ====================================================================
+// |     ______                   _______                             |
+// |    / _____________ __  __   / ____(_____  ____ _____  ________   |
+// |   / /_  / ___/ __ `| |/_/  / /_  / / __ \/ __ `/ __ \/ ___/ _ \  |
+// |  / __/ / /  / /_/ _>  <   / __/ / / / / / /_/ / / / / /__/  __/  |
+// | /_/   /_/   \__,_/_/|_|  /_/   /_/_/ /_/\__,_/_/ /_/\___/\___/   |
+// |                                                                  |
+// ====================================================================
+// ============================= FrxUSD ===============================
+// ====================================================================
+// Frax Finance: https://github.com/FraxFinance
+// Tested for 18-decimal underlying assets only
+
+import { FrxUSD3 } from "src/contracts/ethereum/frxUSD/versioning/FrxUSD3.sol";
+
+contract FrxUSD is FrxUSD3 {
+    constructor() FrxUSD3() {}
+}
+
+
 //SPDX-License-Identifier: Unlicense
 pragma solidity ^0.8.0;
 
-import { ERC20Permit, ERC20 } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
-import { ERC20Burnable } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
-import { Ownable2Step } from "@openzeppelin/contracts/access/Ownable2Step.sol";
-import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
-import { StorageSlot } from "@openzeppelin/contracts/utils/StorageSlot.sol";
-
-/// @title FrxUSD
+import { FrxUSD2, ERC20, ERC20Permit } from "src/contracts/ethereum/frxUSD/versioning/FrxUSD2.sol";
+import { EIP712, Nonces } from "@openzeppelin/contracts-5.3.0/token/ERC20/extensions/ERC20Permit.sol";
+import { PermitModule } from "src/contracts/shared/core/modules/PermitModule.sol";
+import { EIP3009Module, SignatureModule } from "src/contracts/shared/core/modules/EIP3009Module.sol";
+
+/// @title FrxUSD v3.0.0
+/// @notice Frax USD Stablecoin by Frax Finance
+/// @dev v3.0.0 adds ERC-1271 and EIP-3009 support
+contract FrxUSD3 is FrxUSD2, EIP3009Module, PermitModule {
+    constructor() FrxUSD2(address(1), "Frax USD", "frxUSD") {}
+
+    /*//////////////////////////////////////////////////////////////
+                        Module Overrides
+    //////////////////////////////////////////////////////////////*/
+
+    function __transfer(address from, address to, uint256 amount) internal override returns (bool) {
+        ERC20._transfer(from, to, amount);
+        return true;
+    }
+
+    function __hashTypedDataV4(bytes32 structHash) internal view override(SignatureModule) returns (bytes32) {
+        return EIP712._hashTypedDataV4(structHash);
+    }
+
+    function __approve(address owner, address spender, uint256 amount) internal override(PermitModule) {
+        ERC20._approve(owner, spender, amount);
+    }
+
+    function __useNonce(address owner) internal override(PermitModule) returns (uint256) {
+        return Nonces._useNonce(owner);
+    }
+
+    function __domainSeparatorV4() internal view override(PermitModule) returns (bytes32) {
+        return EIP712._domainSeparatorV4();
+    }
+
+    function permit(
+        address owner,
+        address spender,
+        uint256 value,
+        uint256 deadline,
+        uint8 v,
+        bytes32 r,
+        bytes32 s
+    ) public override(ERC20Permit, PermitModule) {
+        return
+            PermitModule.permit({ owner: owner, spender: spender, value: value, deadline: deadline, v: v, r: r, s: s });
+    }
+}
+
+
+//SPDX-License-Identifier: Unlicense
+pragma solidity ^0.8.0;
+
+import { ERC20Permit, ERC20 } from "@openzeppelin/contracts-5.3.0/token/ERC20/extensions/ERC20Permit.sol";
+import { ERC20Burnable } from "@openzeppelin/contracts-5.3.0/token/ERC20/extensions/ERC20Burnable.sol";
+import { Ownable2Step, Ownable } from "@openzeppelin/contracts-5.3.0/access/Ownable2Step.sol";
+
+/// @title FrxUSD2
 /**
  * @notice Combines Openzeppelin's ERC20Permit, ERC20Burnable and Ownable2Step.
  *     Also includes a list of authorized minters
  */
-/// @dev FrxUSD adheres to EIP-712/EIP-2612 and can use permits
-contract FrxUSD is ERC20Permit, ERC20Burnable, Ownable2Step {
-  /// @notice Array of the non-bridge minters
-  address[] public minters_array;
-
-  /// @notice Mapping of the minters
-  /// @dev Mapping is used for faster verification
-  mapping(address => bool) public minters;
-
-  /// @notice Mapping indicating which addresses are frozen
-  mapping(address => bool) public isFrozen;
-
-  /// @notice Whether or not the contract is paused
-  bool public isPaused;
-
-  /* ========== CONSTRUCTOR ========== */
-  /// @param _ownerAddress The initial owner
-  /// @param _name ERC20 name
-  /// @param _symbol ERC20 symbol
-  constructor(
-    address _ownerAddress,
-    string memory _name,
-    string memory _symbol
-  ) ERC20(_name, _symbol) ERC20Permit(_name) Ownable(_ownerAddress) {}
-
-  /* ========== INITIALIZER ========== */
-  /// @dev Used to initialize the contract when it is behind a proxy
-  function initialize(address _owner, string memory _name, string memory _symbol) public {
-    require(owner() == address(0), "Already initialized");
-    if (_owner == address(0)) revert OwnerCannotInitToZeroAddress();
-    _transferOwnership(_owner);
-    StorageSlot.getBytesSlot(bytes32(uint256(3))).value = bytes(_name);
-    StorageSlot.getBytesSlot(bytes32(uint256(4))).value = bytes(_symbol);
-  }
-
-  /* ========== MODIFIERS ========== */
-
-  /// @notice A modifier that only allows a minters to call
-  modifier onlyMinters() {
-    require(minters[msg.sender] == true, "Only minters");
-    _;
-  }
-
-  /* ========== RESTRICTED FUNCTIONS [MINTERS] ========== */
-
-  /// @notice Used by minters to burn tokens
-  /// @param b_address Address of the account to burn from
-  /// @param b_amount Amount of tokens to burn
-  function minter_burn_from(address b_address, uint256 b_amount) public onlyMinters {
-    super.burnFrom(b_address, b_amount);
-    emit TokenMinterBurned(b_address, msg.sender, b_amount);
-  }
-
-  /// @notice Used by minters to mint new tokens
-  /// @param m_address Address of the account to mint to
-  /// @param m_amount Amount of tokens to mint
-  function minter_mint(address m_address, uint256 m_amount) public onlyMinters {
-    super._mint(m_address, m_amount);
-    emit TokenMinterMinted(msg.sender, m_address, m_amount);
-  }
-
-  /* ========== RESTRICTED FUNCTIONS [OWNER] ========== */
-  /// @notice Adds a minter
-  /// @param minter_address Address of minter to add
-  function addMinter(address minter_address) public onlyOwner {
-    require(minter_address != address(0), "Zero address detected");
-
-    require(minters[minter_address] == false, "Address already exists");
-    minters[minter_address] = true;
-    minters_array.push(minter_address);
-
-    emit MinterAdded(minter_address);
-  }
-
-  /// @notice Removes a non-bridge minter
-  /// @param minter_address Address of minter to remove
-  function removeMinter(address minter_address) public onlyOwner {
-    require(minter_address != address(0), "Zero address detected");
-    require(minters[minter_address] == true, "Address nonexistant");
-
-    // Delete from the mapping
-    delete minters[minter_address];
-
-    // 'Delete' from the array by setting the address to 0x0
-    for (uint256 i = 0; i < minters_array.length; i++) {
-      if (minters_array[i] == minter_address) {
-        minters_array[i] = address(0); // This will leave a null in the array and keep the indices the same
-        break;
-      }
-    }
-
-    emit MinterRemoved(minter_address);
-  }
-
-  /// @notice External admin gated function to unfreeze a set of accounts
-  /// @param _owners Array of accounts to be unfrozen
-  function thawMany(address[] memory _owners) external onlyOwner {
-    uint256 len = _owners.length;
-    for (uint256 i; i < len; ++i) {
-      _thaw(_owners[i]);
-    }
-  }
-
-  /// @notice External admin gated function to unfreeze an account
-  /// @param _owner The account to be unfrozen
-  function thaw(address _owner) external onlyOwner {
-    _thaw(_owner);
-  }
-
-  /// @notice External admin gated function to batch freeze a set of accounts
-  /// @param _owners Array of accounts to be frozen
-  function freezeMany(address[] memory _owners) external onlyOwner {
-    uint256 len = _owners.length;
-    for (uint256 i; i < len; ++i) {
-      _freeze(_owners[i]);
-    }
-  }
-
-  /// @notice External admin gated function to freeze a given account
-  /// @param _owner The account to be
-  function freeze(address _owner) external onlyOwner {
-    _freeze(_owner);
-  }
-
-  /// @notice External admin gated function to batch burn balance from a set of accounts
-  /// @param _owners Array of accounts whose balances will be burned
-  /// @param _amounts Array of amounts corresponding to the balances to be burned
-  /// @dev if `_amount` == 0, entire balance will be burned
-  function burnMany(address[] memory _owners, uint256[] memory _amounts) external onlyOwner {
-    uint lenOwner = _owners.length;
-    if (_owners.length != _amounts.length) revert ArrayMisMatch();
-    for (uint i; i < lenOwner; ++i) {
-      if (_amounts[i] == 0) _amounts[i] = balanceOf(_owners[i]);
-      _burn(_owners[i], _amounts[i]);
-    }
-  }
-
-  /// @notice External admin gated function to burn balance from a given account
-  /// @param _owner  The account whose balance will be burned
-  /// @param _amount The amount of balance to burn
-  /// @dev if `_amount` == 0, entire balance will be burned
-  function burn(address _owner, uint256 _amount) external onlyOwner {
-    if (_amount == 0) _amount = balanceOf(_owner);
-    _burn(_owner, _amount);
-  }
-
-  /// @notice External admin gated pause function
-  function pause() external onlyOwner {
-    isPaused = true;
-    emit Paused();
-  }
-
-  /// @notice External admin gated unpause function
-  function unpause() external onlyOwner {
-    isPaused = false;
-    emit Unpaused();
-  }
-
-  /* ========== Internals For Admin Gated ========== */
-
-  /// @notice Internal helper function to freeze an account
-  /// @param _owner The account to 'frozen'
-  function _freeze(address _owner) internal {
-    isFrozen[_owner] = true;
-    emit AccountFrozen(_owner);
-  }
-
-  /// @notice Internal helper function to unfreeze an account
-  /// @param _owner The account to unfreeze
-  function _thaw(address _owner) internal {
-    isFrozen[_owner] = false;
-    emit AccountThawed(_owner);
-  }
-
-  /* ========== Overrides ========== */
-
-  /// @notice override for base internal `_update(address,address,uint256)`
-  ///         implements `paused` and `frozen` transfer logic
-  /// @param from  The address from which balance is originating
-  /// @param to    The address whose balance will be incremented
-  /// @param value The amount to increment/decrement the balances of
-  /// @dev Owner can bypass pause and freeze checks
-  function _update(address from, address to, uint256 value) internal override {
-    if (msg.sender != owner()) {
-      if (isPaused) revert IsPaused();
-      if (isFrozen[to] || isFrozen[from] || isFrozen[msg.sender]) revert IsFrozen();
-    }
-    super._update(from, to, value);
-  }
-
-  /* ========== EVENTS ========== */
-
-  /// @notice Emitted whenever the bridge burns tokens from an account
-  /// @param account Address of the account tokens are being burned from
-  /// @param amount  Amount of tokens burned
-  event Burn(address indexed account, uint256 amount);
-
-  /// @notice Emitted whenever the bridge mints tokens to an account
-  /// @param account Address of the account tokens are being minted for
-  /// @param amount  Amount of tokens minted.
-  event Mint(address indexed account, uint256 amount);
-
-  /// @notice Emitted when a non-bridge minter is added
-  /// @param minter_address Address of the new minter
-  event MinterAdded(address minter_address);
-
-  /// @notice Emitted when a non-bridge minter is removed
-  /// @param minter_address Address of the removed minter
-  event MinterRemoved(address minter_address);
-
-  /// @notice Emitted when a non-bridge minter burns tokens
-  /// @param from The account whose tokens are burned
-  /// @param to The minter doing the burning
-  /// @param amount Amount of tokens burned
-  event TokenMinterBurned(address indexed from, address indexed to, uint256 amount);
-
-  /// @notice Emitted when a non-bridge minter mints tokens
-  /// @param from The minter doing the minting
-  /// @param to The account that gets the newly minted tokens
-  /// @param amount Amount of tokens minted
-  event TokenMinterMinted(address indexed from, address indexed to, uint256 amount);
-
-  /// @notice Event Emitted when the contract is paused
-  event Paused();
-
-  /// @notice Event Emitted when the contract is unpaused
-  event Unpaused();
-
-  /// @notice Event Emitted when an address is frozen
-  /// @param account The account being frozen
-  event AccountFrozen(address account);
-
-  /// @notice Event Emitted when an address is unfrozen
-  /// @param account The account being thawed
-  event AccountThawed(address account);
-
-  /* ========== ERRORS ========== */
-  error ArrayMisMatch();
-  error IsPaused();
-  error IsFrozen();
-  error OwnerCannotInitToZeroAddress();
+/// @dev FrxUSD2 adheres to EIP-712/EIP-2612 and can use permits
+contract FrxUSD2 is ERC20Permit, ERC20Burnable, Ownable2Step {
+    /// @notice Array of the non-bridge minters
+    address[] public minters_array;
+
+    /// @notice Mapping of the minters
+    /// @dev Mapping is used for faster verification
+    mapping(address => bool) public minters;
+
+    /// @notice Mapping indicating which addresses are frozen
+    mapping(address => bool) public isFrozen;
+
+    /// @notice Whether or not the contract is paused
+    bool public isPaused;
+
+    function version() public pure virtual returns (string memory) {
+        return "2.0.1";
+    }
+
+    /* ========== CONSTRUCTOR ========== */
+    /// @param _ownerAddress The initial owner
+    /// @param _name ERC20 name
+    /// @param _symbol ERC20 symbol
+    constructor(
+        address _ownerAddress,
+        string memory _name,
+        string memory _symbol
+    ) ERC20(_name, _symbol) ERC20Permit(_name) Ownable(_ownerAddress) {}
+
+    /* ========== MODIFIERS ========== */
+
+    /// @notice A modifier that only allows a minters to call
+    modifier onlyMinters() {
+        require(minters[msg.sender] == true, "Only minters");
+        _;
+    }
+
+    /* ========== RESTRICTED FUNCTIONS [MINTERS] ========== */
+
+    /// @notice Used by minters to burn tokens
+    /// @param b_address Address of the account to burn from
+    /// @param b_amount Amount of tokens to burn
+    function minter_burn_from(address b_address, uint256 b_amount) public onlyMinters {
+        super.burnFrom(b_address, b_amount);
+        emit TokenMinterBurned(b_address, msg.sender, b_amount);
+    }
+
+    /// @notice Used by minters to mint new tokens
+    /// @param m_address Address of the account to mint to
+    /// @param m_amount Amount of tokens to mint
+    function minter_mint(address m_address, uint256 m_amount) public onlyMinters {
+        super._mint(m_address, m_amount);
+        emit TokenMinterMinted(msg.sender, m_address, m_amount);
+    }
+
+    /* ========== RESTRICTED FUNCTIONS [OWNER] ========== */
+    /// @notice Adds a minter
+    /// @param minter_address Address of minter to add
+    function addMinter(address minter_address) public onlyOwner {
+        require(minter_address != address(0), "Zero address detected");
+
+        require(minters[minter_address] == false, "Address already exists");
+        minters[minter_address] = true;
+        minters_array.push(minter_address);
+
+        emit MinterAdded(minter_address);
+    }
+
+    /// @notice Removes a non-bridge minter
+    /// @param minter_address Address of minter to remove
+    function removeMinter(address minter_address) public onlyOwner {
+        require(minter_address != address(0), "Zero address detected");
+        require(minters[minter_address] == true, "Address nonexistant");
+
+        // Delete from the mapping
+        delete minters[minter_address];
+
+        // 'Delete' from the array by setting the address to 0x0
+        for (uint256 i = 0; i < minters_array.length; i++) {
+            if (minters_array[i] == minter_address) {
+                minters_array[i] = address(0); // This will leave a null in the array and keep the indices the same
+                break;
+            }
+        }
+
+        emit MinterRemoved(minter_address);
+    }
+
+    /// @notice External admin gated function to unfreeze a set of accounts
+    /// @param _owners Array of accounts to be unfrozen
+    function thawMany(address[] memory _owners) external onlyOwner {
+        uint256 len = _owners.length;
+        for (uint256 i; i < len; ++i) {
+            _thaw(_owners[i]);
+        }
+    }
+
+    /// @notice External admin gated function to unfreeze an account
+    /// @param _owner The account to be unfrozen
+    function thaw(address _owner) external onlyOwner {
+        _thaw(_owner);
+    }
+
+    /// @notice External admin gated function to batch freeze a set of accounts
+    /// @param _owners Array of accounts to be frozen
+    function freezeMany(address[] memory _owners) external onlyOwner {
+        uint256 len = _owners.length;
+        for (uint256 i; i < len; ++i) {
+            _freeze(_owners[i]);
+        }
+    }
+
+    /// @notice External admin gated function to freeze a given account
+    /// @param _owner The account to be frozen
+    function freeze(address _owner) external onlyOwner {
+        _freeze(_owner);
+    }
+
+    /// @notice External admin gated function to batch burn balance from a set of accounts
+    /// @param _owners Array of accounts whose balances will be burned
+    /// @param _amounts Array of amounts corresponding to the balances to be burned
+    /// @dev if `_amount` == 0, entire balance will be burned
+    function burnMany(address[] memory _owners, uint256[] memory _amounts) external onlyOwner {
+        uint256 lenOwner = _owners.length;
+        if (_owners.length != _amounts.length) revert ArrayMisMatch();
+        for (uint256 i; i < lenOwner; ++i) {
+            if (_amounts[i] == 0) _amounts[i] = balanceOf(_owners[i]);
+            _burn(_owners[i], _amounts[i]);
+        }
+    }
+
+    /// @notice External admin gated function to burn balance from a given account
+    /// @param _owner  The account whose balance will be burned
+    /// @param _amount The amount of balance to burn
+    /// @dev if `_amount` == 0, entire balance will be burned
+    function burn(address _owner, uint256 _amount) external onlyOwner {
+        if (_amount == 0) _amount = balanceOf(_owner);
+        _burn(_owner, _amount);
+    }
+
+    /// @notice External admin gated pause function
+    function pause() external onlyOwner {
+        isPaused = true;
+        emit Paused();
+    }
+
+    /// @notice External admin gated unpause function
+    function unpause() external onlyOwner {
+        isPaused = false;
+        emit Unpaused();
+    }
+
+    /* ========== Internals For Admin Gated ========== */
+
+    /// @notice Internal helper function to freeze an account
+    /// @param _owner The account to 'frozen'
+    function _freeze(address _owner) internal {
+        isFrozen[_owner] = true;
+        emit AccountFrozen(_owner);
+    }
+
+    /// @notice Internal helper function to unfreeze an account
+    /// @param _owner The account to unfreeze
+    function _thaw(address _owner) internal {
+        isFrozen[_owner] = false;
+        emit AccountThawed(_owner);
+    }
+
+    /* ========== Overrides ========== */
+
+    /// @notice override for base internal `_update(address,address,uint256)`
+    ///         implements `paused` and `frozen` transfer logic
+    /// @param from  The address from which balance is originating
+    /// @param to    The address whose balance will be incremented
+    /// @param value The amount to increment/decrement the balances of
+    /// @dev Owner can bypass pause and freeze checks
+    function _update(address from, address to, uint256 value) internal override {
+        if (msg.sender != owner()) {
+            if (isPaused) revert IsPaused();
+            if (isFrozen[to] || isFrozen[from] || isFrozen[msg.sender]) revert IsFrozen();
+        }
+        super._update(from, to, value);
+    }
+
+    /* ========== EVENTS ========== */
+
+    /// @notice Emitted whenever the bridge burns tokens from an account
+    /// @param account Address of the account tokens are being burned from
+    /// @param amount  Amount of tokens burned
+    event Burn(address indexed account, uint256 amount);
+
+    /// @notice Emitted whenever the bridge mints tokens to an account
+    /// @param account Address of the account tokens are being minted for
+    /// @param amount  Amount of tokens minted.
+    event Mint(address indexed account, uint256 amount);
+
+    /// @notice Emitted when a non-bridge minter is added
+    /// @param minter_address Address of the new minter
+    event MinterAdded(address minter_address);
+
+    /// @notice Emitted when a non-bridge minter is removed
+    /// @param minter_address Address of the removed minter
+    event MinterRemoved(address minter_address);
+
+    /// @notice Emitted when a non-bridge minter burns tokens
+    /// @param from The account whose tokens are burned
+    /// @param to The minter doing the burning
+    /// @param amount Amount of tokens burned
+    event TokenMinterBurned(address indexed from, address indexed to, uint256 amount);
+
+    /// @notice Emitted when a non-bridge minter mints tokens
+    /// @param from The minter doing the minting
+    /// @param to The account that gets the newly minted tokens
+    /// @param amount Amount of tokens minted
+    event TokenMinterMinted(address indexed from, address indexed to, uint256 amount);
+
+    /// @notice Event Emitted when the contract is paused
+    event Paused();
+
+    /// @notice Event Emitted when the contract is unpaused
+    event Unpaused();
+
+    /// @notice Event Emitted when an address is frozen
+    /// @param account The account being frozen
+    event AccountFrozen(address account);
+
+    /// @notice Event Emitted when an address is unfrozen
+    /// @param account The account being thawed
+    event AccountThawed(address account);
+
+    /* ========== ERRORS ========== */
+    error ArrayMisMatch();
+    error IsPaused();
+    error IsFrozen();
+    error OwnerCannotInitToZeroAddress();
 }
 
 
@@ -338,6 +407,368 @@
     function DOMAIN_SEPARATOR() external view virtual returns (bytes32) {
         return _domainSeparatorV4();
     }
+}
+
+
+pragma solidity ^0.8.0;
+
+import { SignatureModule } from "./SignatureModule.sol";
+
+/// @dev Ripped from OZ 4.9.4 ERC20Permit.sol with namespaced storage and support of ERC1271 signatures
+abstract contract PermitModule is SignatureModule {
+    //==============================================================================
+    // Storage
+    //==============================================================================
+
+    bytes32 private constant PERMIT_TYPEHASH =
+        keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)");
+
+    //==============================================================================
+    // Functions
+    //==============================================================================
+
+    function permit(
+        address owner,
+        address spender,
+        uint256 value,
+        uint256 deadline,
+        uint8 v,
+        bytes32 r,
+        bytes32 s
+    ) public virtual {
+        permit({
+            owner: owner,
+            spender: spender,
+            value: value,
+            deadline: deadline,
+            signature: abi.encodePacked(r, s, v)
+        });
+    }
+
+    function permit(
+        address owner,
+        address spender,
+        uint256 value,
+        uint256 deadline,
+        bytes memory signature
+    ) public virtual {
+        require(block.timestamp <= deadline, "Permit: expired deadline");
+
+        _requireIsValidSignatureNow({
+            signer: owner,
+            structHash: keccak256(abi.encode(PERMIT_TYPEHASH, owner, spender, value, __useNonce(owner), deadline)),
+            signature: signature
+        });
+
+        __approve(owner, spender, value);
+    }
+
+    //==============================================================================
+    // Virtual methods to override in child class
+    //==============================================================================
+
+    function __approve(address owner, address spender, uint256 amount) internal virtual;
+
+    function __domainSeparatorV4() internal view virtual returns (bytes32);
+
+    function __useNonce(address owner) internal virtual returns (uint256);
+}
+
+
+pragma solidity ^0.8.0;
+
+import { SignatureModule } from "./SignatureModule.sol";
+
+/// @title Eip3009
+/// @notice Eip3009 provides internal implementations for gas-abstracted transfers under Eip3009 guidelines
+/// @author Frax Finance, inspired by Agora (thanks Drake)
+abstract contract EIP3009Module is SignatureModule {
+    /// @notice keccak256("TransferWithAuthorization(address from,address to,uint256 value,uint256 validAfter,uint256 validBefore,bytes32 nonce)")
+    bytes32 internal constant TRANSFER_WITH_AUTHORIZATION_TYPEHASH =
+        0x7c7c6cdb67a18743f49ec6fa9b35f50d52ed05cbed4cc592e13b44501c1a2267;
+
+    /// @notice keccak256("ReceiveWithAuthorization(address from,address to,uint256 value,uint256 validAfter,uint256 validBefore,bytes32 nonce)")
+    bytes32 internal constant RECEIVE_WITH_AUTHORIZATION_TYPEHASH =
+        0xd099cc98ef71107a616c4f0f941f04c322d8e254fe26b3c6668db87aae413de8;
+
+    /// @notice keccak256("CancelAuthorization(address authorizer,bytes32 nonce)")
+    bytes32 internal constant CANCEL_AUTHORIZATION_TYPEHASH =
+        0x158b0a9edf7a828aad02f63cd515c68ef2f50ba807396f6d12842833a1597429;
+
+    //==============================================================================
+    // Storage
+    //==============================================================================
+
+    struct EIP3009ModuleStorage {
+        mapping(address authorizer => mapping(bytes32 nonce => bool used)) isAuthorizationUsed;
+    }
+
+    // keccak256(abi.encode(uint256(keccak256("frax.storage.EIP3009Module")) - 1)) & ~bytes32(uint256(0xff))
+    bytes32 private constant EIP3009ModuleStorageLocation =
+        0x6607eb842e76408d8b3956685dc6b9da5897a1d9b47edcc993ce266e603fa500;
+
+    function _getEIP3009ModuleStorage() private pure returns (EIP3009ModuleStorage storage $) {
+        assembly {
+            $.slot := EIP3009ModuleStorageLocation
+        }
+    }
+
+    //==============================================================================
+    // Functions
+    //==============================================================================
+
+    /// @notice The ```transferWithAuthorization``` function executes a transfer with a signed authorization according to Eip3009
+    /// @dev EOA wallet signatures should be packed in the order of r, s, v
+    /// @dev added in v1.1.0
+    /// @param from Payer's address (Authorizer)
+    /// @param to Payee's address
+    /// @param value Amount to be transferred
+    /// @param validAfter The block.timestamp after which the authorization is valid
+    /// @param validBefore The block.timestamp before which the authorization is valid
+    /// @param nonce Unique nonce
+    /// @param v ECDSA signature parameter v
+    /// @param r ECDSA signature parameters r
+    /// @param s ECDSA signature parameters s
+    function transferWithAuthorization(
+        address from,
+        address to,
+        uint256 value,
+        uint256 validAfter,
+        uint256 validBefore,
+        bytes32 nonce,
+        uint8 v,
+        bytes32 r,
+        bytes32 s
+    ) external {
+        // Packs signature pieces into bytes
+        transferWithAuthorization({
+            from: from,
+            to: to,
+            value: value,
+            validAfter: validAfter,
+            validBefore: validBefore,
+            nonce: nonce,
+            signature: abi.encodePacked(r, s, v)
+        });
+    }
+
+    /// @notice The ```transferWithAuthorization``` function executes a transfer with a signed authorization
+    /// @dev EOA wallet signatures should be packed in the order of r, s, v
+    /// @param from Payer's address (Authorizer)
+    /// @param to Payee's address
+    /// @param value Amount to be transferred
+    /// @param validAfter The time after which this is valid (unix time)
+    /// @param validBefore The time before which this is valid (unix time)
+    /// @param nonce Unique nonce
+    /// @param signature Signature byte array produced by an EOA wallet or a contract wallet
+    function transferWithAuthorization(
+        address from,
+        address to,
+        uint256 value,
+        uint256 validAfter,
+        uint256 validBefore,
+        bytes32 nonce,
+        bytes memory signature
+    ) public {
+        // Checks: authorization validity
+        if (block.timestamp <= validAfter) revert InvalidAuthorization();
+        if (block.timestamp >= validBefore) revert ExpiredAuthorization();
+        _requireUnusedAuthorization({ authorizer: from, nonce: nonce });
+
+        // Checks: valid signature
+        _requireIsValidSignatureNow({
+            signer: from,
+            structHash: keccak256(
+                abi.encode(TRANSFER_WITH_AUTHORIZATION_TYPEHASH, from, to, value, validAfter, validBefore, nonce)
+            ),
+            signature: signature
+        });
+
+        // Effects: mark authorization as used and transfer
+        _markAuthorizationAsUsed({ authorizer: from, nonce: nonce });
+        __transfer({ from: from, to: to, amount: value });
+    }
+
+    /// @notice The ```receiveWithAuthorization``` function receives a transfer with a signed authorization from the payer
+    /// @dev This has an additional check to ensure that the payee's address matches the caller of this function to prevent front-running attacks
+    /// @dev EOA wallet signatures should be packed in the order of r, s, v
+    /// @param from Payer's address (Authorizer)
+    /// @param to Payee's address
+    /// @param value Amount to be transferred
+    /// @param validAfter The block.timestamp after which the authorization is valid
+    /// @param validBefore The block.timestamp before which the authorization is valid
+    /// @param nonce Unique nonce
+    /// @param v ECDSA signature parameter v
+    /// @param r ECDSA signature parameters r
+    /// @param s ECDSA signature parameters s
+    function receiveWithAuthorization(
+        address from,
+        address to,
+        uint256 value,
+        uint256 validAfter,
+        uint256 validBefore,
+        bytes32 nonce,
+        uint8 v,
+        bytes32 r,
+        bytes32 s
+    ) external {
+        // Packs signature pieces into bytes
+        receiveWithAuthorization({
+            from: from,
+            to: to,
+            value: value,
+            validAfter: validAfter,
+            validBefore: validBefore,
+            nonce: nonce,
+            signature: abi.encodePacked(r, s, v)
+        });
+    }
+
+    /// @notice The ```receiveWithAuthorization``` function receives a transfer with a signed authorization from the payer
+    /// @dev This has an additional check to ensure that the payee's address matches the caller of this function to prevent front-running attacks
+    /// @dev EOA wallet signatures should be packed in the order of r, s, v
+    /// @param from Payer's address (Authorizer)
+    /// @param to Payee's address
+    /// @param value Amount to be transferred
+    /// @param validAfter The block.timestamp after which the authorization is valid
+    /// @param validBefore The block.timestamp before which the authorization is valid
+    /// @param nonce Unique nonce
+    /// @param signature Signature byte array produced by an EOA wallet or a contract wallet
+    function receiveWithAuthorization(
+        address from,
+        address to,
+        uint256 value,
+        uint256 validAfter,
+        uint256 validBefore,
+        bytes32 nonce,
+        bytes memory signature
+    ) public {
+        // Checks: authorization validity
+        if (to != msg.sender) revert InvalidPayee({ caller: msg.sender, payee: to });
+        if (block.timestamp <= validAfter) revert InvalidAuthorization();
+        if (block.timestamp >= validBefore) revert ExpiredAuthorization();
+        _requireUnusedAuthorization({ authorizer: from, nonce: nonce });
+
+        // Checks: valid signature
+        _requireIsValidSignatureNow({
+            signer: from,
+            structHash: keccak256(
+                abi.encode(RECEIVE_WITH_AUTHORIZATION_TYPEHASH, from, to, value, validAfter, validBefore, nonce)
+            ),
+            signature: signature
+        });
+
+        // Effects: mark authorization as used and transfer
+        _markAuthorizationAsUsed({ authorizer: from, nonce: nonce });
+        __transfer({ from: from, to: to, amount: value });
+    }
+
+    /// @notice The ```cancelAuthorization``` function cancels an authorization nonce
+    /// @dev EOA wallet signatures should be packed in the order of r, s, v
+    /// @param authorizer   Authorizer's address
+    /// @param nonce        Nonce of the authorization
+    /// @param v            ECDSA signature v value
+    /// @param r            ECDSA signature r value
+    /// @param s            ECDSA signature s value
+    function cancelAuthorization(address authorizer, bytes32 nonce, uint8 v, bytes32 r, bytes32 s) external {
+        cancelAuthorization({ authorizer: authorizer, nonce: nonce, signature: abi.encodePacked(r, s, v) });
+    }
+
+    /// @notice The ```cancelAuthorization``` function cancels an authorization nonce
+    /// @dev EOA wallet signatures should be packed in the order of r, s, v
+    /// @param authorizer    Authorizer's address
+    /// @param nonce         Nonce of the authorization
+    /// @param signature     Signature byte array produced by an EOA wallet or a contract wallet
+    function cancelAuthorization(address authorizer, bytes32 nonce, bytes memory signature) public {
+        _requireUnusedAuthorization({ authorizer: authorizer, nonce: nonce });
+        _requireIsValidSignatureNow({
+            signer: authorizer,
+            structHash: keccak256(abi.encode(CANCEL_AUTHORIZATION_TYPEHASH, authorizer, nonce)),
+            signature: signature
+        });
+
+        _getEIP3009ModuleStorage().isAuthorizationUsed[authorizer][nonce] = true;
+        emit AuthorizationCanceled({ authorizer: authorizer, nonce: nonce });
+    }
+
+    //==============================================================================
+    // Internal Checks Functions
+    //==============================================================================
+
+    /// @notice The ```_requireUnusedAuthorization``` checks that an authorization nonce is unused
+    /// @param authorizer    Authorizer's address
+    /// @param nonce         Nonce of the authorization
+    function _requireUnusedAuthorization(address authorizer, bytes32 nonce) private view {
+        if (_getEIP3009ModuleStorage().isAuthorizationUsed[authorizer][nonce]) {
+            revert UsedOrCanceledAuthorization();
+        }
+    }
+
+    //==============================================================================
+    // Internal Effects Functions
+    //==============================================================================
+
+    /// @notice The ```_markAuthorizationAsUsed``` function marks an authorization nonce as used
+    /// @param authorizer    Authorizer's address
+    /// @param nonce         Nonce of the authorization
+    function _markAuthorizationAsUsed(address authorizer, bytes32 nonce) private {
+        _getEIP3009ModuleStorage().isAuthorizationUsed[authorizer][nonce] = true;
+        emit AuthorizationUsed({ authorizer: authorizer, nonce: nonce });
+    }
+
+    //==============================================================================
+    // Views
+    //==============================================================================
+
+    /**
+     * @notice Returns the state of an authorization
+     * @dev Nonces are randomly generated 32-byte data unique to the authorizer's
+     * address
+     * @param authorizer    Authorizer's address
+     * @param nonce         Nonce of the authorization
+     * @return True if the nonce is used
+     */
+    function authorizationState(address authorizer, bytes32 nonce) external view returns (bool) {
+        return _getEIP3009ModuleStorage().isAuthorizationUsed[authorizer][nonce];
+    }
+
+    //==============================================================================
+    // Overridden methods
+    //==============================================================================
+
+    function __transfer(address from, address to, uint256 amount) internal virtual returns (bool);
+
+    //==============================================================================
+    // Events
+    //==============================================================================
+
+    /// @notice ```AuthorizationUsed``` event is emitted when an authorization is used
+    /// @param authorizer Authorizer's address
+    /// @param nonce Nonce of the authorization
+    event AuthorizationUsed(address indexed authorizer, bytes32 indexed nonce);
+
+    /// @notice ```AuthorizationCanceled``` event is emitted when an authorization is canceled
+    /// @param authorizer Authorizer's address
+    /// @param nonce Nonce of the authorization
+    event AuthorizationCanceled(address indexed authorizer, bytes32 indexed nonce);
+
+    //==============================================================================
+    // Errors
+    //==============================================================================
+
+    /// @notice The ```InvalidPayee``` error is emitted when the payee does not match sender in receiveWithAuthorization
+    /// @param caller The caller of the function
+    /// @param payee The expected payee in the function
+    error InvalidPayee(address caller, address payee);
+
+    /// @notice The ```InvalidAuthorization``` error is emitted when the authorization is invalid because its too early
+    error InvalidAuthorization();
+
+    /// @notice The ```ExpiredAuthorization``` error is emitted when the authorization is expired
+    error ExpiredAuthorization();
+
+    /// @notice The ```UsedOrCanceledAuthorization``` error is emitted when the authorization nonce is already used or canceled
+    error UsedOrCanceledAuthorization();
 }
 
 
@@ -447,253 +878,6 @@
             revert OwnableUnauthorizedAccount(sender);
         }
         _transferOwnership(sender);
-    }
-}
-
-
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v5.0.0) (access/Ownable.sol)
-
-pragma solidity ^0.8.20;
-
-import {Context} from "../utils/Context.sol";
-
-/**
- * @dev Contract module which provides a basic access control mechanism, where
- * there is an account (an owner) that can be granted exclusive access to
- * specific functions.
- *
- * The initial owner is set to the address provided by the deployer. This can
- * later be changed with {transferOwnership}.
- *
- * This module is used through inheritance. It will make available the modifier
- * `onlyOwner`, which can be applied to your functions to restrict their use to
- * the owner.
- */
-abstract contract Ownable is Context {
-    address private _owner;
-
-    /**
-     * @dev The caller account is not authorized to perform an operation.
-     */
-    error OwnableUnauthorizedAccount(address account);
-
-    /**
-     * @dev The owner is not a valid owner account. (eg. `address(0)`)
-     */
-    error OwnableInvalidOwner(address owner);
-
-    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
-
-    /**
-     * @dev Initializes the contract setting the address provided by the deployer as the initial owner.
-     */
-    constructor(address initialOwner) {
-        if (initialOwner == address(0)) {
-            revert OwnableInvalidOwner(address(0));
-        }
-        _transferOwnership(initialOwner);
-    }
-
-    /**
-     * @dev Throws if called by any account other than the owner.
-     */
-    modifier onlyOwner() {
-        _checkOwner();
-        _;
-    }
-
-    /**
-     * @dev Returns the address of the current owner.
-     */
-    function owner() public view virtual returns (address) {
-        return _owner;
-    }
-
-    /**
-     * @dev Throws if the sender is not the owner.
-     */
-    function _checkOwner() internal view virtual {
-        if (owner() != _msgSender()) {
-            revert OwnableUnauthorizedAccount(_msgSender());
-        }
-    }
-
-    /**
-     * @dev Leaves the contract without owner. It will not be possible to call
-     * `onlyOwner` functions. Can only be called by the current owner.
-     *
-     * NOTE: Renouncing ownership will leave the contract without an owner,
-     * thereby disabling any functionality that is only available to the owner.
-     */
-    function renounceOwnership() public virtual onlyOwner {
-        _transferOwnership(address(0));
-    }
-
-    /**
-     * @dev Transfers ownership of the contract to a new account (`newOwner`).
-     * Can only be called by the current owner.
-     */
-    function transferOwnership(address newOwner) public virtual onlyOwner {
-        if (newOwner == address(0)) {
-            revert OwnableInvalidOwner(address(0));
-        }
-        _transferOwnership(newOwner);
-    }
-
-    /**
-     * @dev Transfers ownership of the contract to a new account (`newOwner`).
-     * Internal function without access restriction.
-     */
-    function _transferOwnership(address newOwner) internal virtual {
-        address oldOwner = _owner;
-        _owner = newOwner;
-        emit OwnershipTransferred(oldOwner, newOwner);
-    }
-}
-
-
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v5.1.0) (utils/StorageSlot.sol)
-// This file was procedurally generated from scripts/generate/templates/StorageSlot.js.
-
-pragma solidity ^0.8.20;
-
-/**
- * @dev Library for reading and writing primitive types to specific storage slots.
- *
- * Storage slots are often used to avoid storage conflict when dealing with upgradeable contracts.
- * This library helps with reading and writing to such slots without the need for inline assembly.
- *
- * The functions in this library return Slot structs that contain a `value` member that can be used to read or write.
- *
- * Example usage to set ERC-1967 implementation slot:
- * ```solidity
- * contract ERC1967 {
- *     // Define the slot. Alternatively, use the SlotDerivation library to derive the slot.
- *     bytes32 internal constant _IMPLEMENTATION_SLOT = 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;
- *
- *     function _getImplementation() internal view returns (address) {
- *         return StorageSlot.getAddressSlot(_IMPLEMENTATION_SLOT).value;
- *     }
- *
- *     function _setImplementation(address newImplementation) internal {
- *         require(newImplementation.code.length > 0);
- *         StorageSlot.getAddressSlot(_IMPLEMENTATION_SLOT).value = newImplementation;
- *     }
- * }
- * ```
- *
- * TIP: Consider using this library along with {SlotDerivation}.
- */
-library StorageSlot {
-    struct AddressSlot {
-        address value;
-    }
-
-    struct BooleanSlot {
-        bool value;
-    }
-
-    struct Bytes32Slot {
-        bytes32 value;
-    }
-
-    struct Uint256Slot {
-        uint256 value;
-    }
-
-    struct Int256Slot {
-        int256 value;
-    }
-
-    struct StringSlot {
-        string value;
-    }
-
-    struct BytesSlot {
-        bytes value;
-    }
-
-    /**
-     * @dev Returns an `AddressSlot` with member `value` located at `slot`.
-     */
-    function getAddressSlot(bytes32 slot) internal pure returns (AddressSlot storage r) {
-        assembly ("memory-safe") {
-            r.slot := slot
-        }
-    }
-
-    /**
-     * @dev Returns a `BooleanSlot` with member `value` located at `slot`.
-     */
-    function getBooleanSlot(bytes32 slot) internal pure returns (BooleanSlot storage r) {
-        assembly ("memory-safe") {
-            r.slot := slot
-        }
-    }
-
-    /**
-     * @dev Returns a `Bytes32Slot` with member `value` located at `slot`.
-     */
-    function getBytes32Slot(bytes32 slot) internal pure returns (Bytes32Slot storage r) {
-        assembly ("memory-safe") {
-            r.slot := slot
-        }
-    }
-
-    /**
-     * @dev Returns a `Uint256Slot` with member `value` located at `slot`.
-     */
-    function getUint256Slot(bytes32 slot) internal pure returns (Uint256Slot storage r) {
-        assembly ("memory-safe") {
-            r.slot := slot
-        }
-    }
-
-    /**
-     * @dev Returns a `Int256Slot` with member `value` located at `slot`.
-     */
-    function getInt256Slot(bytes32 slot) internal pure returns (Int256Slot storage r) {
-        assembly ("memory-safe") {
-            r.slot := slot
-        }
-    }
-
-    /**
-     * @dev Returns a `StringSlot` with member `value` located at `slot`.
-     */
-    function getStringSlot(bytes32 slot) internal pure returns (StringSlot storage r) {
-        assembly ("memory-safe") {
-            r.slot := slot
-        }
-    }
-
-    /**
-     * @dev Returns an `StringSlot` representation of the string storage pointer `store`.
-     */
-    function getStringSlot(string storage store) internal pure returns (StringSlot storage r) {
-        assembly ("memory-safe") {
-            r.slot := store.slot
-        }
-    }
-
-    /**
-     * @dev Returns a `BytesSlot` with member `value` located at `slot`.
-     */
-    function getBytesSlot(bytes32 slot) internal pure returns (BytesSlot storage r) {
-        assembly ("memory-safe") {
-            r.slot := slot
-        }
-    }
-
-    /**
-     * @dev Returns an `BytesSlot` representation of the bytes storage pointer `store`.
-     */
-    function getBytesSlot(bytes storage store) internal pure returns (BytesSlot storage r) {
-        assembly ("memory-safe") {
-            r.slot := store.slot
-        }
     }
 }
 
@@ -791,7 +975,7 @@
 
 
 // SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v5.1.0) (token/ERC20/ERC20.sol)
+// OpenZeppelin Contracts (last updated v5.3.0) (token/ERC20/ERC20.sol)
 
 pragma solidity ^0.8.20;
 
@@ -831,8 +1015,7 @@
     /**
      * @dev Sets the values for {name} and {symbol}.
      *
-     * All two of these values are immutable: they can only be set once during
-     * construction.
+     * Both values are immutable: they can only be set once during construction.
      */
     constructor(string memory name_, string memory symbol_) {
         _name = name_;
@@ -1033,7 +1216,7 @@
     }
 
     /**
-     * @dev Sets `value` as the allowance of `spender` over the `owner` s tokens.
+     * @dev Sets `value` as the allowance of `spender` over the `owner`'s tokens.
      *
      * This internal function is equivalent to `approve`, and can be used to
      * e.g. set automatic allowances for certain subsystems, etc.
@@ -1083,7 +1266,7 @@
     }
 
     /**
-     * @dev Updates `owner` s allowance for `spender` based on spent `value`.
+     * @dev Updates `owner`'s allowance for `spender` based on spent `value`.
      *
      * Does not update the allowance value in case of infinite allowance.
      * Revert if not enough allowance is available.
@@ -1092,7 +1275,7 @@
      */
     function _spendAllowance(address owner, address spender, uint256 value) internal virtual {
         uint256 currentAllowance = allowance(owner, spender);
-        if (currentAllowance != type(uint256).max) {
+        if (currentAllowance < type(uint256).max) {
             if (currentAllowance < value) {
                 revert ERC20InsufficientAllowance(spender, currentAllowance, value);
             }
@@ -1287,7 +1470,7 @@
 
 
 // SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v5.1.0) (utils/cryptography/EIP712.sol)
+// OpenZeppelin Contracts (last updated v5.3.0) (utils/cryptography/EIP712.sol)
 
 pragma solidity ^0.8.20;
 
@@ -1336,7 +1519,9 @@
 
     ShortString private immutable _name;
     ShortString private immutable _version;
+    // slither-disable-next-line constable-states
     string private _nameFallback;
+    // slither-disable-next-line constable-states
     string private _versionFallback;
 
     /**
@@ -1397,7 +1582,7 @@
     }
 
     /**
-     * @dev See {IERC-5267}.
+     * @inheritdoc IERC5267
      */
     function eip712Domain()
         public
@@ -1496,6 +1681,33 @@
 }
 
 
+pragma solidity ^0.8.0;
+
+import { SignatureChecker } from "@openzeppelin/contracts-5.3.0/utils/cryptography/SignatureChecker.sol";
+
+/**
+ * @dev This is a base contract to aid in writing upgradeable contracts that use EIP-712 signatures.
+ * It provides functionality to initialize the EIP-712 domain separator and verify signatures.
+ */
+abstract contract SignatureModule {
+    /// @notice Error thrown when a signature is invalid
+    error InvalidSignature();
+
+    /// @dev Added supportive function to check if the signature is valid
+    function _requireIsValidSignatureNow(address signer, bytes32 structHash, bytes memory signature) internal view {
+        if (
+            !S
[truncated — full diff is 169,694 bytes]
```

</details>

<details>
<summary>📝 Source diff — upgrade #5 (<code>0xBFA1...fB40</code> → <code>0x0000...a4d5</code>): +30/-3 lines</summary>

```diff
--- old_impl
+++ new_impl
@@ -102,8 +102,10 @@
     /// @notice Whether or not the contract is paused
     bool public isPaused;
 
+    mapping(address => bool) public isFreezer;
+
     function version() public pure virtual returns (string memory) {
-        return "2.0.1";
+        return "3.0.0";
     }
 
     /* ========== CONSTRUCTOR ========== */
@@ -175,6 +177,18 @@
         emit MinterRemoved(minter_address);
     }
 
+    function addFreezer(address _freezer) external onlyOwner {
+        if (isFreezer[_freezer]) revert AlreadyFreezer();
+        isFreezer[_freezer] = true;
+        emit AddFreezer(_freezer);
+    }
+
+    function removeFreezer(address _freezer) external onlyOwner {
+        if (!isFreezer[_freezer]) revert NotFreezer();
+        isFreezer[_freezer] = false;
+        emit RemoveFreezer(_freezer);
+    }
+
     /// @notice External admin gated function to unfreeze a set of accounts
     /// @param _owners Array of accounts to be unfrozen
     function thawMany(address[] memory _owners) external onlyOwner {
@@ -192,7 +206,8 @@
 
     /// @notice External admin gated function to batch freeze a set of accounts
     /// @param _owners Array of accounts to be frozen
-    function freezeMany(address[] memory _owners) external onlyOwner {
+    function freezeMany(address[] memory _owners) external {
+        if (!isFreezer[msg.sender] && msg.sender != owner()) revert NotFreezer();
         uint256 len = _owners.length;
         for (uint256 i; i < len; ++i) {
             _freeze(_owners[i]);
@@ -201,7 +216,9 @@
 
     /// @notice External admin gated function to freeze a given account
     /// @param _owner The account to be frozen
-    function freeze(address _owner) external onlyOwner {
+    function freeze(address _owner) external {
+        if (!isFreezer[msg.sender] && msg.sender != owner()) revert NotFreezer();
+
         _freeze(_owner);
     }
 
@@ -317,10 +334,20 @@
     /// @param account The account being thawed
     event AccountThawed(address account);
 
+    /// @notice Event Emitted when an address is added as a freezer
+    /// @param account The account being added as a freezer
+    event AddFreezer(address account);
+
+    /// @notice Event Emitted when an address is removed as a freezer
+    /// @param account The account being removed as a freezer
+    event RemoveFreezer(address account);
+
     /* ========== ERRORS ========== */
     error ArrayMisMatch();
     error IsPaused();
     error IsFrozen();
+    error NotFreezer();
+    error AlreadyFreezer();
     error OwnerCannotInitToZeroAddress();
 }
 
```

</details>

✅ **Two-step admin transfer:** `OZ Ownable2Step` — prevents accidental hand-off (request → accept flow).

### 🔴 `upgradeability (TransparentUpgradeable)`

> ⚠️ **CRITICAL** — Upgradeability allows arbitrary code replacement. Must be behind both a Multisig AND a Timelock.

**Privileged write functions:**  
**Capabilities:** ⬆️ **UPGRADE**
- `upgradeTo(address)` — Upgrade proxy implementation to a new address `[UPGRADE]`
- `upgradeToAndCall(address,bytes)` — Upgrade proxy implementation and call an initializer `[UPGRADE]`

**Members (1):**

| Address | Name / Type | Risk | Granted | Source | Details |
|---|---|---|---|---|---|
| `0xb898Ad2976b4d8f2E21521C9db16b7497825E503` | Compound Timelock (1d) | 🟢 LOW | — | Storage only | 1d delay (⚠ changed 1x) |


**Delay history for `Compound Timelock (1d)` (0xb898...E503):** 1d → 1d

### 🟢 `owner()`

**Privileged write functions:**  
**Capabilities:** 🚫 **BLACKLIST** ⚙️ **CONFIG** ⏸️ **PAUSE** 💰 **SUPPLY**
- `minter_mint(address m_address, uint256 m_amount)` — Used by minters to mint new tokens `[SUPPLY]`
- `addMinter(address minter_address)` — Adds a minter `[SUPPLY]`
- `removeMinter(address minter_address)` — Removes a non-bridge minter `[SUPPLY]`
- `addFreezer(address _freezer)` `[CONFIG]`
- `removeFreezer(address _freezer)` `[CONFIG]`
- `thawMany(address[] memory _owners)` — External admin gated function to unfreeze a set of accounts `[BLACKLIST]`
- `thaw(address _owner)` — External admin gated function to unfreeze an account `[BLACKLIST]`
- `freezeMany(address[] memory _owners)` — External admin gated function to batch freeze a set of accounts `[BLACKLIST]`
- `freeze(address _owner)` — External admin gated function to freeze a given account `[BLACKLIST]`
- `burnMany(address[] memory _owners, uint256[] memory _amounts)` — External admin gated function to batch burn balance from a set of accounts if `_amount` == 0, entire balance will be burned `[SUPPLY]`
- `burn(address _owner, uint256 _amount)` — External admin gated function to burn balance from a given account if `_amount` == 0, entire balance will be burned `[SUPPLY]`
- `pause()` — External admin gated pause function `[PAUSE]`
- `unpause()` — External admin gated unpause function `[PAUSE]`
- `transferWithAuthorization(address from, address to, uint256 value, uint256 validAfter, uint256 validBefore, bytes32 nonce, bytes memory signature)` — The ```transferWithAuthorization``` function executes a transfer with a signed authorization according to Eip3009 EOA wallet signatures should be packed in the order of r, s, v added in v1.1.0
- `receiveWithAuthorization(address from, address to, uint256 value, uint256 validAfter, uint256 validBefore, bytes32 nonce, bytes memory signature)` — The ```receiveWithAuthorization``` function receives a transfer with a signed authorization from the payer This has an additional check to ensure that the payee's address matches the caller of this function to prevent front-running attacks EOA wallet signatures should be packed in the order of r, s, v
- `burn(uint256 value)` — External admin gated function to burn balance from a given account if `_amount` == 0, entire balance will be burned `[SUPPLY]`
- `burnFrom(address account, uint256 value)` — Destroys a `value` amount of tokens from `account`, deducting from the caller's allowance. `[SUPPLY]`
- `transferOwnership(address newOwner)` — Starts the ownership transfer of the contract to a new account. Replaces the pending transfer if there is one. Can only be called by the current owner.
- `transfer(address to, uint256 value)` — See {IERC20-transfer}. Requirements:
- `transferFrom(address from, address to, uint256 value)` — See {IERC20-transferFrom}. Skips emitting an {Approval} event indicating an allowance update. This is not
- `renounceOwnership()` — Leaves the contract without owner. It will not be possible to call `onlyOwner` functions. Can only be called by the current owner.
- `acceptOwnership()` — Second step of `OZ Ownable2Step` — callable by the pending holder set via `transferOwnership`, not by the current role. Included here to surface the full transfer handoff. `[CONFIG]`

**Members (1):**

| Address | Name / Type | Risk | Granted | Source | Details |
|---|---|---|---|---|---|
| `0xfFFffF4F3baC444b2C0ecf2A1840d018bE783937` | Gnosis Safe 4/7 | 🟢 LOW | — | Storage+Events | 4/7 signers |

**Signers of `Gnosis Safe 4/7` (0xfFFf...3937):**

| Signer | Type | Owner Since | Notes |
|---|---|---|---|
| `0x6933BCC3e96f1C4d2cb73Cb391d854b18Ab7A4F2` | EOA ⚠️ Hot wallet (1,993 txs) | — | EOA |
| `0xcbc616D595D38483e6AdC45C7E426f44bF230928` | EOA ⚠️ Hot wallet (1,092 txs) | — | EOA |
| `0x17e06ce6914E3969f7BD37D8b2a563890cA1c96e` | EOA ⚠️ Hot wallet (2,122 txs) | — | EOA |
| `0xc8dE9f45601DA8C76158b8CAF3E56E8A037F2228` | EOA | — | EOA |
| `0x6e74053a3798e0fC9a9775F7995316b27f21c4D2` | EOA ⚠️ Hot wallet (4,940 txs) | — | EOA |
| `0xDf41722D7b1355dB08D4e7D0528fE9c82377Bb37` | EOA | — | EOA |
| `0xC6EF452b0de9E95Ccb153c2A5A7a90154aab3419` | EOA | — | EOA |

### 🟢 `pendingOwner()`


**Members (1):**

| Address | Name / Type | Risk | Granted | Source | Details |
|---|---|---|---|---|---|
| `0xfFFffF4F3baC444b2C0ecf2A1840d018bE783937` | Gnosis Safe 4/7 | 🟢 LOW | — | Events only | 4/7 signers |

**Signers of `Gnosis Safe 4/7` (0xfFFf...3937):**

| Signer | Type | Owner Since | Notes |
|---|---|---|---|
| `0x6933BCC3e96f1C4d2cb73Cb391d854b18Ab7A4F2` | EOA ⚠️ Hot wallet (1,993 txs) | — | EOA |
| `0xcbc616D595D38483e6AdC45C7E426f44bF230928` | EOA ⚠️ Hot wallet (1,092 txs) | — | EOA |
| `0x17e06ce6914E3969f7BD37D8b2a563890cA1c96e` | EOA ⚠️ Hot wallet (2,122 txs) | — | EOA |
| `0xc8dE9f45601DA8C76158b8CAF3E56E8A037F2228` | EOA | — | EOA |
| `0x6e74053a3798e0fC9a9775F7995316b27f21c4D2` | EOA ⚠️ Hot wallet (4,940 txs) | — | EOA |
| `0xDf41722D7b1355dB08D4e7D0528fE9c82377Bb37` | EOA | — | EOA |
| `0xC6EF452b0de9E95Ccb153c2A5A7a90154aab3419` | EOA | — | EOA |

#### 🔧 Permissioned Parameters

**`freeze`** *(per-asset)* ❄️ **DORMANT**

> This parameter has never been changed since deployment.

| Field | Value |
|---|---|
| Setter | `freeze(address _owner)` |
| Gated by | `owner()` |
| Tags | `BLACKLIST` |
| Last called | — |
| Called by | — |
| Total calls | 0 ❄️ |

**`freezeMany`** *(per-asset)* ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> This parameter has never been changed since deployment.

| Field | Value |
|---|---|
| Setter | `freezeMany(address[] memory _owners)` |
| Gated by | `owner()` |
| Tags | `BLACKLIST` |
| Last called | — |
| Called by | — |
| Total calls | 0 ❄️ |

**`owner`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)*

> This parameter has never been changed since deployment.

| Field | Value |
|---|---|
| Current Value | `0xfFFffF4F3baC444b2C0ecf2A1840d018bE783937` |
| Setter | `thaw(address _owner)` |
| Gated by | `owner()` |
| Tags | `BLACKLIST` |
| Last changed | — |
| Changed by | — |
| Total changes | 0 ❄️ |

**`pause`** ❄️ **DORMANT**

> This parameter has never been changed since deployment.

| Field | Value |
|---|---|
| Setter | `pause()` |
| Gated by | `owner()` |
| Tags | `PAUSE` |
| Last called | — |
| Called by | — |
| Total calls | 0 ❄️ |

**`thawMany`** *(per-asset)* ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> This parameter has never been changed since deployment.

| Field | Value |
|---|---|
| Setter | `thawMany(address[] memory _owners)` |
| Gated by | `owner()` |
| Tags | `BLACKLIST` |
| Last called | — |
| Called by | — |
| Total calls | 0 ❄️ |

**`unpause`** ❄️ **DORMANT**

> This parameter has never been changed since deployment.

| Field | Value |
|---|---|
| Setter | `unpause()` |
| Gated by | `owner()` |
| Tags | `PAUSE` |
| Last called | — |
| Called by | — |
| Total calls | 0 ❄️ |

#### 💰 Supply Actions

_Mint / redeem / burn call tracking — last 5 calls per function, total counts preserved._

**`addMinter`** *(per-asset)* 🔄 **ACTIVE** (10 changes)

> ⚠️ This parameter has been changed **10 times** — monitor for unexpected modifications.

| Field | Value |
|---|---|
| Setter | `addMinter(address minter_address)` |
| Gated by | `owner()` |
| Tags | `SUPPLY` |
| Last called | 2026-06-03 |
| Called by | `0xcbc6...0928` (EOA) |
| Total calls | 10 🔄 |

**Recent changes (showing last 5 of 10):**

| # | Asset | Value | Set By | Date |
|---|---|---|---|---|
| 1 | Compound Timelock (1d) | `—` | `0xcbc6...0928` (EOA) | 2026-06-03 |
| 2 | TransparentUpgradeableProxy | `(Safe-mediated)` | `0xB174...3f27` (Gnosis Safe 3/5) | 2025-10-16 |
| 3 | TransparentUpgradeableProxy | `(Safe-mediated)` | `0xB174...3f27` (Gnosis Safe 3/5) | 2025-10-16 |
| 4 | TransparentUpgradeableProxy | `(Safe-mediated)` | `0xB174...3f27` (Gnosis Safe 3/5) | 2025-10-16 |
| 5 | TransparentUpgradeableProxy | `—` | `0x6e74...c4D2` (EOA) | 2025-10-16 |

**`burn`** *(per-asset)* ❄️ **DORMANT**

> This parameter has never been changed since deployment.

| Field | Value |
|---|---|
| Setter | `burn(address _owner, uint256 _amount)` |
| Gated by | `owner()` |
| Tags | `SUPPLY` |
| Last called | — |
| Called by | — |
| Total calls | 0 ❄️ |

**`burnFrom`** *(per-asset)* ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> This parameter has never been changed since deployment.

| Field | Value |
|---|---|
| Setter | `burnFrom(address account, uint256 value)` |
| Gated by | `owner()` |
| Tags | `SUPPLY` |
| Last called | — |
| Called by | — |
| Total calls | 0 ❄️ |

**`burnMany`** *(per-asset)* ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> This parameter has never been changed since deployment.

| Field | Value |
|---|---|
| Setter | `burnMany(address[] memory _owners, uint256[] memory _amounts)` |
| Gated by | `owner()` |
| Tags | `SUPPLY` |
| Last called | — |
| Called by | — |
| Total calls | 0 ❄️ |

**`minter_burn_from`** *(per-asset)* ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> This parameter has never been changed since deployment.

| Field | Value |
|---|---|
| Setter | `minter_burn_from(address b_address, uint256 b_amount)` |
| Gated by | `minter()` |
| Tags | `SUPPLY` |
| Last called | — |
| Called by | — |
| Total calls | 0 ❄️ |

**`minter_mint`** *(per-asset)* ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> This parameter has never been changed since deployment.

| Field | Value |
|---|---|
| Setter | `minter_mint(address m_address, uint256 m_amount)` |
| Gated by | `minter(), owner()` |
| Tags | `SUPPLY` |
| Last called | 2026-05-27 |
| Called by | `0xB174...3f27` (Gnosis Safe 3/5) |
| Total calls | 0 ❄️ |

**`removeMinter`** *(per-asset)*

| Field | Value |
|---|---|
| Setter | `removeMinter(address minter_address)` |
| Gated by | `owner()` |
| Tags | `SUPPLY` |
| Last called | 2026-06-03 |
| Called by | `0xcbc6...0928` (EOA) |
| Total calls | 2 |

**Recent changes:**

| # | Asset | Value | Set By | Date |
|---|---|---|---|---|
| 1 | Gnosis Safe 3/5 | `—` | `0xcbc6...0928` (EOA) | 2026-06-03 |
| 2 | TransparentUpgradeableProxy | `—` | `0xcbc6...0928` (EOA) | 2025-05-07 |

---
<a id="c-0x4f95c5ba0c7c69fb2f9340e190ccee890b3bd87c"></a>
## > FrxUSDCustodianUsdc `0x4F95C5bA0C7c69FB2f9340E190cCeE890B3bd87c`

> > ⚠️ **Upgradeable** (TransparentUpgradeable) — impl: `0x0A2D27A86a2eA07bcc34e457c65AECA7631c0f10`

> **Proxy History (5 events):**

> | # | Date | Event | Address | Key Changes | Tx |
> |---|---|---|---|---|---|
> | 1 | 2025-04-04 | Upgrade | `0xA0D0...41d3` | Initial deployment | [0xe3a2c6330576de6ab35a283d2561fbe610233a1a2e21515de349e697f1b915b4](https://etherscan.io/tx/0xe3a2c6330576de6ab35a283d2561fbe610233a1a2e21515de349e697f1b915b4) |
> | 2 | 2025-04-04 | Admin Changed | `0x1a45...eD7e` | Previous: `0x0000...0000` | [0xe3a2c6330576de6ab35a283d2561fbe610233a1a2e21515de349e697f1b915b4](https://etherscan.io/tx/0xe3a2c6330576de6ab35a283d2561fbe610233a1a2e21515de349e697f1b915b4) |
> | 3 | 2025-07-22 | Upgrade | `0xD24A...CCeF` | +2 fn; added `isApprovedOperator(address)`; added `setApprovedOperator(address,bool)`; 📝 src +863/-682 | [0xd3c60f9c6c6bc409c4ca8e5b2525fae018d8f4f441a0a43d5e241cdf5ca20f24](https://etherscan.io/tx/0xd3c60f9c6c6bc409c4ca8e5b2525fae018d8f4f441a0a43d5e241cdf5ca20f24) |
> | 4 | 2025-10-17 | Upgrade | `0x5643...C693` | 📝 src +127/-1447 | [0x5f85c189b624699301f4349eb4535e3e15c66276f372a4aaaeaccaf61a87b060](https://etherscan.io/tx/0x5f85c189b624699301f4349eb4535e3e15c66276f372a4aaaeaccaf61a87b060) |
> | 5 | 2025-11-21 | Upgrade | `0x0A2D...0f10` | +1 fn; added `redeemWtgxx(uint256)`; 📝 src +58/-2 | [0x8ea461f2b9d28b0589ed31925825c61e8f6d82506a830a3d56185d7cb1fdbdac](https://etherscan.io/tx/0x8ea461f2b9d28b0589ed31925825c61e8f6d82506a830a3d56185d7cb1fdbdac) |

> <details>
> <summary>📝 Source diff — upgrade #3 (<code>0xA0D0...41d3</code> → <code>0xD24A...CCeF</code>): +863/-682 lines (truncated)</summary>

> ```diff
--- old_impl
+++ new_impl
@@ -24,564 +24,622 @@
 import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
 import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
 import { FrxUSD } from "./FrxUSD.sol";
+import { IRWAIssuer } from "src/interfaces/IRWAIssuer.sol";
 
 contract FrxUSDCustodian is Ownable2Step, ReentrancyGuard {
-    using Math for uint256;
-
-    // STATE VARIABLES
-    // ===================================================
-
-    /// @notice frxUSD token = share
-    FrxUSD immutable public frxUSD;
-
-    /// @notice Custodian token = asset
-    IERC20 immutable public custodianTkn;
-
-    /// @notice Decimals for the frxUSD
-    uint8 immutable public frxUSDDecimals;
-
-    /// @notice Decimals for the custodian token
-    uint8 immutable public custodianTknDecimals;
-
-    /// @notice If the contract was initialized
-    bool public wasInitialized;
-
-    /// @notice Fee for minting. 18 decimals
-    uint256 public mintFee;
-
-    /// @notice Fee for redeeming. 18 decimals
-    uint256 public redeemFee;
-
-    /// @notice Mint cap for frxUSD minting
-    uint256 public mintCap;
-
-    /// @notice frxUSD minted accounting
-    uint256 public frxUSDMinted;
-
-    // CONSTRUCTOR & INITIALIZER
-    // ===================================================
-
-    /// @notice Contract constructor
-    constructor(
-        address _frxUSD,
-        address _custodianTkn
-    ) Ownable(msg.sender) {
-        // Set the contract as initialized
-        wasInitialized = true;
-
-        // Set token addresses
-        frxUSD = FrxUSD(_frxUSD);
-        custodianTkn = IERC20(_custodianTkn);
-
-        // Set decimals
-        frxUSDDecimals = frxUSD.decimals();
-        custodianTknDecimals = ERC20(_custodianTkn).decimals();
-    }
-
-    /**
-     * @notice Initialize contract
-     * @param _owner The owner of this contract
-     * @param _mintCap The mint cap for frxUSD minting
-     * @param _mintFee The mint fee
-     * @param _redeemFee The redeem fee
-     */
-    function initialize(
-        address _owner,
-        uint256 _mintCap,
-        uint256 _mintFee,
-        uint256 _redeemFee
-    ) public {
-        // Make sure the contract wasn't already initialized    
-        if (wasInitialized) revert InitializeFailed();
-
-        // Set owner for Ownable
-        _transferOwnership(_owner);
-
-        // Set the mint cap
-        mintCap = _mintCap;
-
-        // Set the mint/redeem fee
-        mintFee = _mintFee;
-        redeemFee = _redeemFee;
-
-        // Set the contract as initialized
-        wasInitialized = true;
-    }
-
-    // ERC4626 PUBLIC/EXTERNAL VIEWS
-    // ===================================================
-
-    /// @notice Return the underlying asset
-    /// @return _custodianTkn The custodianTkn asset
-    function asset() public view returns (address _custodianTkn) {
-        _custodianTkn = address(custodianTkn);
-    }
-
-    /// @notice Share balance of the supplied address
-    /// @param _addr The address to test
-    /// @return _balance Total amount of shares
-    function balanceOf(address _addr) public view returns (uint256 _balance) {
-        return frxUSD.balanceOf(_addr);
-    }
-
-    /// @notice Total amount of underlying asset available
-    /// @param _assets Amount of underlying tokens
-    /// @dev See {IERC4626-totalAssets}
-    function totalAssets() public view returns (uint256 _assets) {
-        return custodianTkn.balanceOf(address(this));
-    }
-
-    /// @notice Total amount of shares
-    /// @return _supply Total amount of shares
-    function totalSupply() public view returns (uint256 _supply) {
-        return frxUSD.totalSupply();
-    }
-
-    /// @notice Returns the amount of shares that the contract would exchange for the amount of assets provided
-    /// @param _assets Amount of underlying tokens
-    /// @return _shares Amount of shares that the underlying _assets represents
-    /// @dev See {IERC4626-convertToShares}
-    function convertToShares(uint256 _assets) public view returns (uint256 _shares) {
-        _shares = _convertToShares(_assets, Math.Rounding.Floor);
-    }
-
-    /// @notice Returns the amount of assets that the contract would exchange for the amount of shares provided
-    /// @param _shares Amount of shares
-    /// @return _assets Amount of underlying asset that _shares represents
-    /// @dev See {IERC4626-convertToAssets}
-    function convertToAssets(uint256 _shares) public view returns (uint256 _assets) {
-        _assets = _convertToAssets(_shares, Math.Rounding.Floor);
-    }
-
-    /// @notice Returns the maximum amount of the underlying asset that can be deposited into the contract for the receiver, through a deposit call. Includes fee.
-    /// @param _addr The address to test
-    /// @return _maxAssetsIn The max amount that can be deposited
-    /**
-     * @dev See {IERC4626-maxDeposit}
-     * Contract frxUSD -> custodianTkn needed
-     */
-    function maxDeposit(address _addr) public view returns (uint256 _maxAssetsIn) {
-        // See how much custodianTkn you would need to exchange for 100% of the frxUSD available under the cap
-        if (frxUSDMinted >= mintCap) _maxAssetsIn = 0;
-        else _maxAssetsIn = previewMint(mintCap-frxUSDMinted);
-    }
-
-    /// @notice Returns the maximum amount of shares that can be minted for the receiver, through a mint call. Includes fee.
-    /// @param _addr The address to test
-    /// @return _maxSharesOut The max amount that can be minted
-    /**
-     * @dev See {IERC4626-maxMint}
-     * Contract frxUSD balance
-     */
-    function maxMint(address _addr) public view returns (uint256 _maxSharesOut) {
-        // See how much frxUSD is actually available in the contract
-        if (frxUSDMinted >= mintCap) _maxSharesOut = 0;
-        else _maxSharesOut = mintCap-frxUSDMinted;
-    }
-
-    /// @notice Returns the maximum amount of the underlying asset that can be withdrawn from the owner balance in the contract, through a withdraw call. Includes fee.
-    /// @param _owner The address to check
-    /// @return _maxAssetsOut The maximum amount of underlying asset that can be withdrawn
-    /**
-     * @dev See {IERC4626-maxWithdraw}
-     * Lesser of
-     *     a) User frxUSD -> custodianTkn amount
-     *     b) Contract custodianTkn balance
-     */
-    function maxWithdraw(address _owner) public view returns (uint256 _maxAssetsOut) {
-        // See how much custodianTkn the user could possibly withdraw with 100% of his frxUSD
-        uint256 _maxAssetsUser = previewRedeem(frxUSD.balanceOf(address(_owner)));
-
-        // See how much custodianTkn is actually available in the contract
-        uint256 _assetBalanceContract = custodianTkn.balanceOf(address(this));
-
-        // Return the lesser of the two
-        _maxAssetsOut = ((_assetBalanceContract > _maxAssetsUser) ? _maxAssetsUser : _assetBalanceContract);
-    }
-
-    /// @notice Returns the maximum amount of shares that can be redeemed from the owner balance in the contract, through a redeem call. Includes fee.
-    /// @param _owner The address to check
-    /// @return _maxSharesIn The maximum amount of shares that can be redeemed
-    /**
-     * @dev See {IERC4626-maxRedeem}
-     * Lesser of
-     *     a) User frxUSD
-     *     b) Contract custodianTkn -> frxUSD amount
-     */
-    function maxRedeem(address _owner) public view returns (uint256 _maxSharesIn) {
-        // See how much frxUSD the contract could honor if 100% of its custodianTkn was redeemed
-        uint256 _maxSharesContract = previewWithdraw(custodianTkn.balanceOf(address(this)));
-
-        // See how much frxUSD the user has
-        uint256 _sharesBalanceUser = frxUSD.balanceOf(address(_owner));
-
-        // Return the lesser of the two
-        _maxSharesIn = ((_maxSharesContract > _sharesBalanceUser) ? _sharesBalanceUser : _maxSharesContract);
-    }
-
-    /// @notice Allows an on-chain or off-chain user to simulate the effects of their deposit at the current block, given current on-chain conditions.
-    /// @param _assetsIn Amount of underlying you want to deposit
-    /// @return _sharesOut The amount of output shares expected
-    /// @dev See {IERC4626-previewDeposit}
-    function previewDeposit(uint256 _assetsIn) public view returns (uint256 _sharesOut) {
-        uint256 fee = mintFee;
-        if (fee > 0) _assetsIn = Math.mulDiv(_assetsIn, (1e18 - fee), 1e18, Math.Rounding.Floor);
-        _sharesOut = _convertToShares(_assetsIn, Math.Rounding.Floor);
-    }
-
-    /// @notice Allows an on-chain or off-chain user to simulate the effects of their mint at the current block, given current on-chain conditions.
-    /// @param _sharesOut Amount of shares you want to mint
-    /// @return _assetsIn The amount of input assets needed
-    /// @dev See {IERC4626-previewMint}
-    function previewMint(uint256 _sharesOut) public view returns (uint256 _assetsIn) {
-        uint256 fee = mintFee;
-        _assetsIn = _convertToAssets(_sharesOut, Math.Rounding.Ceil);
-        if (fee > 0) _assetsIn = Math.mulDiv(_assetsIn, 1e18, (1e18 - fee), Math.Rounding.Ceil);
-    }
-
-    /// @notice Allows an on-chain or off-chain user to simulate the effects of their withdrawal at the current block, given current on-chain conditions.
-    /// @param _assetsOut Amount of underlying tokens you want to get back
-    /// @return _sharesIn Amount of shares needed
-    /// @dev See {IERC4626-previewWithdraw}
-    function previewWithdraw(uint256 _assetsOut) public view returns (uint256 _sharesIn) {
-        uint256 fee = redeemFee;
-        if (fee > 0) _assetsOut = Math.mulDiv(_assetsOut, 1e18, (1e18 - fee), Math.Rounding.Ceil);
-        _sharesIn = _convertToShares(_assetsOut, Math.Rounding.Ceil);
-    }
-
-    /// @notice Allows an on-chain or off-chain user to simulate the effects of their redeemption at the current block, given current on-chain conditions.
-    /// @param _sharesIn Amount of shares you want to redeem
-    /// @return _assetsOut Amount of output asset expected
-    /// @dev See {IERC4626-previewRedeem}
-    function previewRedeem(uint256 _sharesIn) public view returns (uint256 _assetsOut) {
-        uint256 fee = redeemFee;
-        _assetsOut = _convertToAssets(_sharesIn, Math.Rounding.Floor);
-        if (fee > 0) _assetsOut = Math.mulDiv((1e18 - fee), _assetsOut, 1e18, Math.Rounding.Floor);
-    }
-
-    // ERC4626 INTERNAL VIEWS
-    // ===================================================
-
-    /// @dev Internal conversion function (from assets to shares) with support for rounding direction.
-    /// @param _assets Amount of underlying tokens to convert to shares
-    /// @param _rounding Math.Rounding rounding direction
-    /// @return _shares Amount of shares represented by the given underlying tokens
-    function _convertToShares(uint256 _assets, Math.Rounding _rounding) internal virtual view returns (uint256 _shares) {
-        _shares = Math.mulDiv(
-            _assets,
-            uint256(10**frxUSDDecimals),
-            uint256(10**custodianTknDecimals),
-            _rounding
-        );
-    }
-
-    /// @dev Internal conversion function (from shares to assets) with support for rounding direction
-    /// @param _shares Amount of shares to convert to underlying tokens
-    /// @param _rounding Math.Rounding rounding direction
-    /// @return _assets Amount of underlying tokens represented by the given number of shares
-    function _convertToAssets(uint256 _shares, Math.Rounding _rounding) internal virtual view returns (uint256 _assets) {
-        _assets = Math.mulDiv(
-            _shares,
-            uint256(10**custodianTknDecimals),
-            uint256(10**frxUSDDecimals),
-            _rounding
-        );
-    }
-
-    /// @notice Price of 1E18 shares, in asset tokens
-    /// @return _pricePerShare How many underlying asset tokens per 1E18 shares
-    function pricePerShare() external view returns (uint256 _pricePerShare) {
-        _pricePerShare = _convertToAssets(1e18, Math.Rounding.Floor);
-    }
-
-    // ADDITIONAL PUBLIC VIEWS
-    // ===================================================
-
-    /// @notice Helper view for max deposit, mint, withdraw, and redeem inputs
-    /// @return _maxAssetsDepositable Max amount of underlying asset you can deposit
-    /// @return _maxSharesMintable Max number of shares that can be minted
-    /// @return _maxAssetsWithdrawable Max amount of underlying asset withdrawable
-    /// @return _maxSharesRedeemable Max number of shares redeemable
-    function mdwrComboView()
-        public
-        view
-        returns (
-            uint256 _maxAssetsDepositable,
-            uint256 _maxSharesMintable,
-            uint256 _maxAssetsWithdrawable,
-            uint256 _maxSharesRedeemable
-        )
-    {
-        return (
-            previewMint(frxUSD.balanceOf(address(this))),
-            frxUSD.balanceOf(address(this)),
-            custodianTkn.balanceOf(address(this)),
-            previewWithdraw(custodianTkn.balanceOf(address(this)))
-        );
-    }
-
-    // ERC4626 INTERNAL MUTATORS
-    // ===================================================
-
-    /// @notice Deposit/mint common workflow.
-    /// @param _caller The caller
-    /// @param _receiver Reciever of the shares
-    /// @param _assets Amount of assets taken in
-    /// @param _shares Amount of shares given out
-    function _deposit(address _caller, address _receiver, uint256 _assets, uint256 _shares) internal nonReentrant {
-        // If _asset is ERC-777, `transferFrom` can trigger a reentrancy BEFORE the transfer happens through the
-        // `tokensToSend` hook. On the other hand, the `tokenReceived` hook, that is triggered after the transfer,
-        // calls the vault, which is assumed not malicious.
-        //
-        // Conclusion: we need to do the transfer beforehand so that any reentrancy would happen before the
-        // _assets are transferred and before the _shares are minted, which is a valid state.
-        // slither-disable-next-line reentrancy-no-eth
-
-        // Take in the assets
-        // User will need to approve _caller -> address(this) first
-        SafeERC20.safeTransferFrom(IERC20(address(custodianTkn)), _caller, address(this), _assets);
-
-        // Transfer out the shares / mint frxUSD
-        frxUSD.minter_mint(_receiver, _shares);
-
-        // frxUSD minted accounting
-        frxUSDMinted+=_shares;
-        if (frxUSDMinted > mintCap) revert MintCapExceeded(_receiver, _shares, mintCap);
-
-
-        emit Deposit(_caller, _receiver, _assets, _shares);
-    }
-
-    /// @notice Withdraw/redeem common workflow.
-    /// @param _caller The caller
-    /// @param _receiver Reciever of the assets
-    /// @param _owner The owner of the shares
-    /// @param _assets Amount of assets given out
-    /// @param _shares Amount of shares taken in
-    function _withdraw(
-        address _caller,
-        address _receiver,
-        address _owner,
-        uint256 _assets,
-        uint256 _shares
-    ) internal nonReentrant {
-        // If _asset is ERC-777, `transfer` can trigger a reentrancy AFTER the transfer happens through the
-        // `tokensReceived` hook. On the other hand, the `tokensToSend` hook, that is triggered before the transfer,
-        // calls the vault, which is assumed not malicious.
-        //
-        // Conclusion: we need to do the transfer afterwards so that any reentrancy would happen after the
-        // _shares are burned and after the _assets are transferred, which is a valid state.
-
-        // Take in the shares / burn frxUSD
-        // User will need to approve owner -> address(this) first
-        frxUSD.minter_burn_from(_caller, _shares);
-
-        // frxUSD minted accounting
-        if (frxUSDMinted < _shares) frxUSDMinted=0;
-        else frxUSDMinted-=_shares;
-
-
-        // Transfer out the assets
-        SafeERC20.safeTransfer(IERC20(address(custodianTkn)), _receiver, _assets);
-
-        emit Withdraw(_caller, _receiver, _owner, _assets, _shares);
-    }
-
-    // ERC4626 PUBLIC/EXTERNAL MUTATIVE
-    // ===================================================
-
-    /// @notice Deposit a specified amount of underlying tokens and generate shares. Make sure to approve msg.sender's assets to this contract first.
-    /// @param _assetsIn Amount of underlying tokens you are depositing
-    /// @param _receiver Recipient of the generated shares
-    /// @return _sharesOut Amount of shares generated by the deposit
-    /// @dev See {IERC4626-deposit}
-    function deposit(uint256 _assetsIn, address _receiver) public returns (uint256 _sharesOut) {
-        // See how many asset tokens the user can deposit
-        uint256 _maxAssets = maxDeposit(_receiver);
-
-        // Revert if the user is trying to deposit too many asset tokens
-        if (_assetsIn > _maxAssets) {
-            revert ERC4626ExceededMaxDeposit(_receiver, _assetsIn, _maxAssets);
-        }
-
-        // See how many shares would be generated with the specified number of asset tokens
-        _sharesOut = previewDeposit(_assetsIn);
-
-        // Do the deposit
-        _deposit(msg.sender, _receiver, _assetsIn, _sharesOut);
-    }
-
-    /// @notice Mint a specified amount of shares using underlying asset tokens. Make sure to approve msg.sender's assets to this contract first.
-    /// @param _sharesOut Amount of shares you want to mint
-    /// @param _receiver Recipient of the minted shares
-    /// @return _assetsIn Amount of assets used to generate the shares
-    /// @dev See {IERC4626-mint}
-    function mint(uint256 _sharesOut, address _receiver) public returns (uint256 _assetsIn) {
-        // See how many shares the user's can mint
-        uint256 _maxShares = maxMint(_receiver);
-
-        // Revert if you are trying to mint too many shares
-        if (_sharesOut > _maxShares) {
-            revert ERC4626ExceededMaxMint(_receiver, _sharesOut, _maxShares);
-        }
-
-        // See how many asset tokens are needed to generate the specified amount of shares
-        _assetsIn = previewMint(_sharesOut);
-
-        // Do the minting
-        _deposit(msg.sender, _receiver, _assetsIn, _sharesOut);
-    }
-
-    /// @notice Withdraw a specified amount of underlying tokens. Make sure to approve _owner's shares to this contract first
-    /// @param _assetsOut Amount of asset tokens you want to withdraw
-    /// @param _receiver Recipient of the asset tokens
-    /// @param _owner Owner of the shares. Must be msg.sender
-    /// @return _sharesIn Amount of shares used for the withdrawal
-    /// @dev See {IERC4626-withdraw}. Leaving _owner param for ABI compatibility
-    function withdraw(uint256 _assetsOut, address _receiver, address _owner) public returns (uint256 _sharesIn) {
-        // Make sure _owner is msg.sender
-        if (_owner != msg.sender) revert TokenOwnerShouldBeSender();
-
-        // See how much assets the owner can withdraw
-        uint256 _maxAssets = maxWithdraw(_owner);
-
-        // Revert if you are trying to withdraw too many asset tokens
-        if (_assetsOut > _maxAssets) {
-            revert ERC4626ExceededMaxWithdraw(_owner, _assetsOut, _maxAssets);
-        }
-
-        // See how many shares are needed
-        _sharesIn = previewWithdraw(_assetsOut);
-
-        // Do the withdrawal
-        _withdraw(msg.sender, _receiver, _owner, _assetsOut, _sharesIn);
-    }
-
-    /// @notice Redeem a specified amount of shares for the underlying tokens. Make sure to approve _owner's shares to this contract first.
-    /// @param _sharesIn Number of shares to redeem
-    /// @param _receiver Recipient of the underlying asset tokens
-    /// @param _owner Owner of the shares being redeemed. Must be msg.sender.
-    /// @return _assetsOut Amount of underlying tokens out
-    /// @dev See {IERC4626-redeem}. Leaving _owner param for ABI compatibility
-    function redeem(uint256 _sharesIn, address _receiver, address _owner) public returns (uint256 _assetsOut) {
-        // Make sure _owner is msg.sender
-        if (_owner != msg.sender) revert TokenOwnerShouldBeSender();
-
-        // See how many shares the owner can redeem
-        uint256 _maxShares = maxRedeem(_owner);
-
-        // Revert if you are trying to redeem too many shares
-        if (_sharesIn > _maxShares) {
-            revert ERC4626ExceededMaxRedeem(_owner, _sharesIn, _maxShares);
-        }
-
-        // See how many asset tokens are expected
-        _assetsOut = previewRedeem(_sharesIn);
-
-        // Do the redemption
-        _withdraw(msg.sender, _receiver, _owner, _assetsOut, _sharesIn);
-    }
-
-    // RESTRICTED FUNCTIONS
-    // ===================================================
-
-    /// @notice Set the fee for the contract on mint|deposit/redeem|withdraw flow
-    /// @param _mintFee The mint fee
-    /// @param _redeemFee The redeem fee
-    function setMintRedeemFee(uint256 _mintFee, uint _redeemFee) public onlyOwner {
-        require(_mintFee < 1e18 || _redeemFee<1e18, "Fee must be a fraction of underlying");
-        mintFee = _mintFee;
-        redeemFee = _redeemFee;
-    }
-
-    /// @notice Added to support tokens
-    /// @param _tokenAddress The token to recover
-    /// @param _tokenAmount The amount to recover
-    function recoverERC20(address _tokenAddress, uint256 _tokenAmount) external onlyOwner {
-        // Only the owner address can ever receive the recovery withdrawal
-        SafeERC20.safeTransfer(IERC20(_tokenAddress), owner(), _tokenAmount);
-        emit RecoveredERC20(_tokenAddress, _tokenAmount);
-    }
-
-    /// @notice Set the mint cap for frxUSD minting
-    /// @param _mintCap The new mint cap
-    function setMintCap(uint256 _mintCap) public onlyOwner {
-        mintCap = _mintCap;
-        emit MintCapSet(_mintCap);
-    }
-
-    // EVENTS
-    // ===================================================
-
-    /// @notice When a deposit/mint has occured
-    /// @param sender The transaction sender
-    /// @param owner The owner of the assets
-    /// @param assets Amount of assets taken in
-    /// @param shares Amount of shares given out
-    event Deposit(address indexed sender, address indexed owner, uint256 assets, uint256 shares);
-
-    /// @notice When ERC20 tokens were recovered
-    /// @param token Token address
-    /// @param amount Amount of tokens collected
-    event RecoveredERC20(address token, uint256 amount);
-
-    /// @notice When a withdrawal/redemption has occured
-    /// @param sender The transaction sender
-    /// @param receiver Reciever of the assets
-    /// @param owner The owner of the shares
-    /// @param assets Amount of assets given out
-    /// @param shares Amount of shares taken in
-    event Withdraw(
-        address indexed sender,
-        address indexed receiver,
-        address indexed owner,
-        uint256 assets,
-        uint256 shares
+  using Math for uint256;
+
+  // STATE VARIABLES
+  // ===================================================
+
+  /// @notice frxUSD token = share
+  FrxUSD public immutable frxUSD;
+
+  /// @notice Custodian token = asset
+  IERC20 public immutable custodianTkn;
+
+  /// @notice Decimals for the frxUSD
+  uint8 public immutable frxUSDDecimals;
+
+  /// @notice Decimals for the custodian token
+  uint8 public immutable custodianTknDecimals;
+
+  /// @notice If the contract was initialized
+  bool public wasInitialized;
+
+  /// @notice Fee for minting. 18 decimals
+  uint256 public mintFee;
+
+  /// @notice Fee for redeeming. 18 decimals
+  uint256 public redeemFee;
+
+  /// @notice Mint cap for frxUSD minting
+  uint256 public mintCap;
+
+  /// @notice frxUSD minted accounting
+  uint256 public frxUSDMinted;
+
+  /// @notice Mapping to indicated which bots are allowed to shuffle assets
+  mapping(address => bool) public isApprovedOperator;
+
+  /// @notice The minimum amount of `custodianTkn` that must remain in the contract on `shuffleToRwa`
+  uint256 public minAfterShuffle;
+
+  // CONSTRUCTOR & INITIALIZER
+  // ===================================================
+
+  /// @notice Contract constructor
+  constructor(address _frxUSD, address _custodianTkn) Ownable(msg.sender) {
+    // Set the contract as initialized
+    wasInitialized = true;
+
+    // Set token addresses
+    frxUSD = FrxUSD(_frxUSD);
+    custodianTkn = IERC20(_custodianTkn);
+
+    // Set decimals
+    frxUSDDecimals = frxUSD.decimals();
+    custodianTknDecimals = ERC20(_custodianTkn).decimals();
+  }
+
+  /**
+   * @notice Initialize contract
+   * @param _owner The owner of this contract
+   * @param _mintCap The mint cap for frxUSD minting
+   * @param _mintFee The mint fee
+   * @param _redeemFee The redeem fee
+   */
+  function initialize(address _owner, uint256 _mintCap, uint256 _mintFee, uint256 _redeemFee) public {
+    // Make sure the contract wasn't already initialized
+    if (wasInitialized) revert InitializeFailed();
+    if (_owner == address(0)) revert OwnerCannotInitToZeroAddress();
+
+    // Set owner for Ownable
+    _transferOwnership(_owner);
+
+    // Set the mint cap
+    mintCap = _mintCap;
+
+    // Set the mint/redeem fee
+    mintFee = _mintFee;
+    redeemFee = _redeemFee;
+
+    // Set the contract as initialized
+    wasInitialized = true;
+  }
+
+  // ERC4626 PUBLIC/EXTERNAL VIEWS
+  // ===================================================
+
+  /// @notice Return the underlying asset
+  /// @return _custodianTkn The custodianTkn asset
+  function asset() public view returns (address _custodianTkn) {
+    _custodianTkn = address(custodianTkn);
+  }
+
+  /// @notice Share balance of the supplied address
+  /// @param _addr The address to test
+  /// @return _balance Total amount of shares
+  function balanceOf(address _addr) public view returns (uint256 _balance) {
+    return frxUSD.balanceOf(_addr);
+  }
+
+  /// @notice Total amount of underlying asset available
+  /// @param _assets Amount of underlying tokens
+  /// @dev See {IERC4626-totalAssets}
+  function totalAssets() public view returns (uint256 _assets) {
+    return custodianTkn.balanceOf(address(this));
+  }
+
+  /// @notice Total amount of shares
+  /// @return _supply Total amount of shares
+  function totalSupply() public view returns (uint256 _supply) {
+    return frxUSD.totalSupply();
+  }
+
+  /// @notice Returns the amount of shares that the contract would exchange for the amount of assets provided
+  /// @param _assets Amount of underlying tokens
+  /// @return _shares Amount of shares that the underlying _assets represents
+  /// @dev See {IERC4626-convertToShares}
+  function convertToShares(uint256 _assets) public view returns (uint256 _shares) {
+    _shares = _convertToShares(_assets, Math.Rounding.Floor);
+  }
+
+  /// @notice Returns the amount of assets that the contract would exchange for the amount of shares provided
+  /// @param _shares Amount of shares
+  /// @return _assets Amount of underlying asset that _shares represents
+  /// @dev See {IERC4626-convertToAssets}
+  function convertToAssets(uint256 _shares) public view returns (uint256 _assets) {
+    _assets = _convertToAssets(_shares, Math.Rounding.Floor);
+  }
+
+  /// @notice Returns the maximum amount of the underlying asset that can be deposited into the contract for the receiver, through a deposit call. Includes fee.
+  /// @param _addr The address to test
+  /// @return _maxAssetsIn The max amount that can be deposited
+  /**
+   * @dev See {IERC4626-maxDeposit}
+   * Contract frxUSD -> custodianTkn needed
+   */
+  function maxDeposit(address _addr) public view returns (uint256 _maxAssetsIn) {
+    // See how much custodianTkn you would need to exchange for 100% of the frxUSD available under the cap
+    if (frxUSDMinted >= mintCap) _maxAssetsIn = 0;
+    else _maxAssetsIn = previewMint(mintCap - frxUSDMinted);
+  }
+
+  /// @notice Returns the maximum amount of shares that can be minted for the receiver, through a mint call. Includes fee.
+  /// @param _addr The address to test
+  /// @return _maxSharesOut The max amount that can be minted
+  /**
+   * @dev See {IERC4626-maxMint}
+   * Contract frxUSD balance
+   */
+  function maxMint(address _addr) public view returns (uint256 _maxSharesOut) {
+    // See how much frxUSD is actually available in the contract
+    if (frxUSDMinted >= mintCap) _maxSharesOut = 0;
+    else _maxSharesOut = mintCap - frxUSDMinted;
+  }
+
+  /// @notice Returns the maximum amount of the underlying asset that can be withdrawn from the owner balance in the contract, through a withdraw call. Includes fee.
+  /// @param _owner The address to check
+  /// @return _maxAssetsOut The maximum amount of underlying asset that can be withdrawn
+  /**
+   * @dev See {IERC4626-maxWithdraw}
+   * Lesser of
+   *     a) User frxUSD -> custodianTkn amount
+   *     b) Contract custodianTkn balance
+   */
+  function maxWithdraw(address _owner) public view returns (uint256 _maxAssetsOut) {
+    // See how much custodianTkn the user could possibly withdraw with 100% of his frxUSD
+    uint256 _maxAssetsUser = previewRedeem(frxUSD.balanceOf(address(_owner)));
+
+    // See how much custodianTkn is actually available in the contract
+    uint256 _assetBalanceContract = custodianTkn.balanceOf(address(this));
+
+    // Return the lesser of the two
+    _maxAssetsOut = ((_assetBalanceContract > _maxAssetsUser) ? _maxAssetsUser : _assetBalanceContract);
+  }
+
+  /// @notice Returns the maximum amount of shares that can be redeemed from the owner balance in the contract, through a redeem call. Includes fee.
+  /// @param _owner The address to check
+  /// @return _maxSharesIn The maximum amount of shares that can be redeemed
+  /**
+   * @dev See {IERC4626-maxRedeem}
+   * Lesser of
+   *     a) User frxUSD
+   *     b) Contract custodianTkn -> frxUSD amount
+   */
+  function maxRedeem(address _owner) public view returns (uint256 _maxSharesIn) {
+    // See how much frxUSD the contract could honor if 100% of its custodianTkn was redeemed
+    uint256 _maxSharesContract = previewWithdraw(custodianTkn.balanceOf(address(this)));
+
+    // See how much frxUSD the user has
+    uint256 _sharesBalanceUser = frxUSD.balanceOf(address(_owner));
+
+    // Return the lesser of the two
+    _maxSharesIn = ((_maxSharesContract > _sharesBalanceUser) ? _sharesBalanceUser : _maxSharesContract);
+  }
+
+  /// @notice Allows an on-chain or off-chain user to simulate the effects of their deposit at the current block, given current on-chain conditions.
+  /// @param _assetsIn Amount of underlying you want to deposit
+  /// @return _sharesOut The amount of output shares expected
+  /// @dev See {IERC4626-previewDeposit}
+  function previewDeposit(uint256 _assetsIn) public view returns (uint256 _sharesOut) {
+    uint256 fee = mintFee;
+    if (fee > 0) _assetsIn = Math.mulDiv(_assetsIn, (1e18 - fee), 1e18, Math.Rounding.Floor);
+    _sharesOut = _convertToShares(_assetsIn, Math.Rounding.Floor);
+  }
+
+  /// @notice Allows an on-chain or off-chain user to simulate the effects of their mint at the current block, given current on-chain conditions.
+  /// @param _sharesOut Amount of shares you want to mint
+  /// @return _assetsIn The amount of input assets needed
+  /// @dev See {IERC4626-previewMint}
+  function previewMint(uint256 _sharesOut) public view returns (uint256 _assetsIn) {
+    uint256 fee = mintFee;
+    _assetsIn = _convertToAssets(_sharesOut, Math.Rounding.Ceil);
+    if (fee > 0) _assetsIn = Math.mulDiv(_assetsIn, 1e18, (1e18 - fee), Math.Rounding.Ceil);
+  }
+
+  /// @notice Allows an on-chain or off-chain user to simulate the effects of their withdrawal at the current block, given current on-chain conditions.
+  /// @param _assetsOut Amount of underlying tokens you want to get back
+  /// @return _sharesIn Amount of shares needed
+  /// @dev See {IERC4626-previewWithdraw}
+  function previewWithdraw(uint256 _assetsOut) public view returns (uint256 _sharesIn) {
+    uint256 fee = redeemFee;
+    if (fee > 0) _assetsOut = Math.mulDiv(_assetsOut, 1e18, (1e18 - fee), Math.Rounding.Ceil);
+    _sharesIn = _convertToShares(_assetsOut, Math.Rounding.Ceil);
+  }
+
+  /// @notice Allows an on-chain or off-chain user to simulate the effects of their redeemption at the current block, given current on-chain conditions.
+  /// @param _sharesIn Amount of shares you want to redeem
+  /// @return _assetsOut Amount of output asset expected
+  /// @dev See {IERC4626-previewRedeem}
+  function previewRedeem(uint256 _sharesIn) public view returns (uint256 _assetsOut) {
+    uint256 fee = redeemFee;
+    _assetsOut = _convertToAssets(_sharesIn, Math.Rounding.Floor);
+    if (fee > 0) _assetsOut = Math.mulDiv((1e18 - fee), _assetsOut, 1e18, Math.Rounding.Floor);
+  }
+
+  // ERC4626 INTERNAL VIEWS
+  // ===================================================
+
+  /// @dev Internal conversion function (from assets to shares) with support for rounding direction.
+  /// @param _assets Amount of underlying tokens to convert to shares
+  /// @param _rounding Math.Rounding rounding direction
+  /// @return _shares Amount of shares represented by the given underlying tokens
+  function _convertToShares(uint256 _assets, Math.Rounding _rounding) internal view virtual returns (uint256 _shares) {
+    _shares = Math.mulDiv(_assets, uint256(10 ** frxUSDDecimals), uint256(10 ** custodianTknDecimals), _rounding);
+  }
+
+  /// @dev Internal conversion function (from shares to assets) with support for rounding direction
+  /// @param _shares Amount of shares to convert to underlying tokens
+  /// @param _rounding Math.Rounding rounding direction
+  /// @return _assets Amount of underlying tokens represented by the given number of shares
+  function _convertToAssets(uint256 _shares, Math.Rounding _rounding) internal view virtual returns (uint256 _assets) {
+    _assets = Math.mulDiv(_shares, uint256(10 ** custodianTknDecimals), uint256(10 ** frxUSDDecimals), _rounding);
+  }
+
+  /// @notice Price of 1E18 shares, in asset tokens
+  /// @return _pricePerShare How many underlying asset tokens per 1E18 shares
+  function pricePerShare() external view returns (uint256 _pricePerShare) {
+    _pricePerShare = _convertToAssets(1e18, Math.Rounding.Floor);
+  }
+
+  // ADDITIONAL PUBLIC VIEWS
+  // ===================================================
+
+  /// @notice Helper view for max deposit, mint, withdraw, and redeem inputs
+  /// @return _maxAssetsDepositable Max amount of underlying asset you can deposit
+  /// @return _maxSharesMintable Max number of shares that can be minted
+  /// @return _maxAssetsWithdrawable Max amount of underlying asset withdrawable
+  /// @return _maxSharesRedeemable Max number of shares redeemable
+  function mdwrComboView()
+    public
+    view
+    returns (
+      uint256 _maxAssetsDepositable,
+      uint256 _maxSharesMintable,
+      uint256 _maxAssetsWithdrawable,
+      uint256 _maxSharesRedeemable
+    )
+  {
+    uint256 _maxMint = maxMint(address(this));
+    return (
+      previewMint(_maxMint),
+      _maxMint,
+      custodianTkn.balanceOf(address(this)),
+      previewWithdraw(custodianTkn.balanceOf(address(this)))
     );
-
-    /// @notice When the mint cap is set
-    /// @param mintCap The new mint cap
-    event MintCapSet(uint256 mintCap);
-
-    // ERRORS
-    // ===================================================
-
-    /// @notice Attempted to deposit more assets than the max amount for `receiver`
-    /// @param receiver The intended recipient of the shares
-    /// @param assets The amount of underlying that was attempted to be deposited
-    /// @param max Max amount of underlying depositable
-    error ERC4626ExceededMaxDeposit(address receiver, uint256 assets, uint256 max);
-
-    /// @notice Attempted to mint more shares than the mint cap
-    /// @param receiver The intended recipient of the shares
-    /// @param shares The number of shares that was attempted to be minted
-    /// @param mintCap The mint cap
-    error MintCapExceeded(address receiver, uint256 shares, uint256 mintCap);
-
-    /// @notice Attempted to mint more shares than the max amount for `receiver`
-    /// @param receiver The intended recipient of the shares
-    /// @param shares The number of shares that was attempted to be minted
-    /// @param max Max number of shares mintable
-    error ERC4626ExceededMaxMint(address receiver, uint256 shares, uint256 max);
-
-    /// @notice Attempted to withdraw more assets than the max amount for `receiver`
-    /// @param owner The owner of the shares
-    /// @param assets The amount of underlying that was attempted to be withdrawn
-    /// @param max Max amount of underlying withdrawable
-    error ERC4626ExceededMaxWithdraw(address owner, uint256 assets, uint256 max);
-
-    /// @notice Attempted to redeem more shares than the max amount for `receiver`
-    /// @param owner The owner of the shares
-    /// @param shares The number of shares that was attempted to be redeemed
-    /// @param max Max number of shares redeemable
-    error ERC4626ExceededMaxRedeem(address owner, uint256 shares, uint256 max);
-
-    /// @notice Cannot initialize twice
-    error InitializeFailed();
-
-    /// @notice When you are attempting to pull tokens from an owner address that is not msg.sender
-    error TokenOwnerShouldBeSender();
+  }
+
+  // ERC4626 INTERNAL MUTATORS
+  // ===================================================
+
+  /// @notice Deposit/mint common workflow.
+  /// @param _caller The caller
+  /// @param _receiver Reciever of the shares
+  /// @param _assets Amount of assets taken in
+  /// @param _shares Amount of shares given out
+  function _deposit(address _caller, address _receiver, uint256 _assets, uint256 _shares) internal nonReentrant {
+    // If _asset is ERC-777, `transferFrom` can trigger a reentrancy BEFORE the transfer happens through the
+    // `tokensToSend` hook. On the other hand, the `tokenReceived` hook, that is triggered after the transfer,
+    // calls the vault, which is assumed not malicious.
+    //
+    // Conclusion: we need to do the transfer beforehand so that any reentrancy would happen before the
+    // _assets are transferred and before the _shares are minted, which is a valid state.
+    // slither-disable-next-line reentrancy-no-eth
+
+    // Take in the assets
+    // User will need to approve _caller -> address(this) first
+    SafeERC20.safeTransferFrom(IERC20(address(custodianTkn)), _caller, address(this), _assets);
+
+    // Transfer out the shares / mint frxUSD
+    frxUSD.minter_mint(_receiver, _shares);
+
+    // frxUSD minted accounting
+    frxUSDMinted += _shares;
+    if (frxUSDMinted >= mintCap) revert MintCapExceeded(_receiver, _shares, mintCap);
+
+    emit Deposit(_caller, _receiver, _assets, _shares);
+  }
+
+  /// @notice Withdraw/redeem common workflow.
+  /// @param _caller The caller
+  /// @param _receiver Reciever of the assets
+  /// @param _owner The owner of the shares
+  /// @param _assets Amount of assets given out
+  /// @param _shares Amount of shares taken in
+  function _withdraw(
+    address _caller,
+    address _receiver,
+    address _owner,
+    uint256 _assets,
+    uint256 _shares
+  ) internal nonReentrant {
+    // If _asset is ERC-777, `transfer` can trigger a reentrancy AFTER the transfer happens through the
+    // `tokensReceived` hook. On the other hand, the `tokensToSend` hook, that is triggered before the transfer,
+    // calls the vault, which is assumed not malicious.
+    //
+    // Conclusion: we need to do the transfer afterwards so that any reentrancy would happen after the
+    // _shares are burned and after the _assets are transferred, which is a valid state.
+
+    // Take in the shares / burn frxUSD
+    // User will need to approve owner -> address(this) first
+    frxUSD.minter_burn_from(_caller, _shares);
+
+    // frxUSD minted accounting
+    if (frxUSDMinted < _shares) frxUSDMinted = 0;
+    else frxUSDMinted -= _shares;
+
+    // Transfer out the assets
+    SafeERC20.safeTransfer(IERC20(address(custodianTkn)), _receiver, _assets);
+
+    emit Withdraw(_caller, _receiver, _owner, _assets, _shares);
+  }
+
+  // ERC4626 PUBLIC/EXTERNAL MUTATIVE
+  // ===================================================
+
+  /// @notice Deposit a specified amount of underlying tokens and generate shares. Make sure to approve msg.sender's assets to this contract first.
+  /// @param _assetsIn Amount of underlying tokens you are depositing
+  /// @param _receiver Recipient of the generated shares
+  /// @return _sharesOut Amount of shares generated by the deposit
+  /// @dev See {IERC4626-deposit}
+  function deposit(uint256 _assetsIn, address _receiver) public virtual returns (uint256 _sharesOut) {
+    // See how many asset tokens the user can deposit
+    uint256 _maxAssets = maxDeposit(_receiver);
+
+    // Revert if the user is trying to deposit too many asset tokens
+    if (_assetsIn > _maxAssets) {
+      revert ERC4626ExceededMaxDeposit(_receiver, _assetsIn, _maxAssets);
+    }
+
+    // See how many shares would be generated with the specified number of asset tokens
+    _sharesOut = previewDeposit(_assetsIn);
+
+    // Do the deposit
+    _deposit(msg.sender, _receiver, _assetsIn, _sharesOut);
+  }
+
+  /// @notice Mint a specified amount of shares using underlying asset tokens. Make sure to approve msg.sender's assets to this contract first.
+  /// @param _sharesOut Amount of shares you want to mint
+  /// @param _receiver Recipient of the minted shares
+  /// @return _assetsIn Amount of assets used to generate the shares
+  /// @dev See {IERC4626-mint}
+  function mint(uint256 _sharesOut, address _receiver) public virtual returns (uint256 _assetsIn) {
+    // See how many shares the user's can mint
+    uint256 _maxShares = maxMint(_receiver);
+
+    // Revert if you are trying to mint too many shares
+    if (_sharesOut > _maxShares) {
+      revert ERC4626ExceededMaxMint(_receiver, _sharesOut, _maxShares);
+    }
+
+    // See how many asset tokens are needed to generate the specified amount of shares
+    _assetsIn = previewMint(_sharesOut);
+
+    // Do the minting
+    _deposit(msg.sender, _receiver, _assetsIn, _sharesOut);
+  }
+
+  /// @notice Withdraw a specified amount of underlying tokens. Make sure to approve _owner's shares to this contract first
+  /// @param _assetsOut Amount of asset tokens you want to withdraw
+  /// @param _receiver Recipient of the asset tokens
+  /// @param _owner Owner of the shares. Must be msg.sender
+  /// @return _sharesIn Amount of shares used for the withdrawal
+  /// @dev See {IERC4626-withdraw}. Leaving _owner param for ABI compatibility
+  function withdraw(uint256 _assetsOut, address _receiver, address _owner) public virtual returns (uint256 _sharesIn) {
+    // Make sure _owner is msg.sender
+    if (_owner != msg.sender) revert TokenOwnerShouldBeSender();
+
+    // See how much assets the owner can withdraw
+    uint256 _maxAssets = maxWithdraw(_owner);
+
+    // Revert if you are trying to withdraw too many asset tokens
+    if (_assetsOut > _maxAssets) {
+      revert ERC4626ExceededMaxWithdraw(_owner, _assetsOut, _maxAssets);
+    }
+
+    // See how many shares are needed
+    _sharesIn = previewWithdraw(_assetsOut);
+
+    // Do the withdrawal
+    _withdraw(msg.sender, _receiver, _owner, _assetsOut, _sharesIn);
+  }
+
+  /// @notice Redeem a specified amount of shares for the underlying tokens. Make sure to approve _owner's shares to this contract first.
+  /// @param _sharesIn Number of shares to redeem
+  /// @param _receiver Recipient of the underlying asset tokens
+  /// @param _owner Owner of the shares being redeemed. Must be msg.sender.
+  /// @return _assetsOut Amount of underlying tokens out
+  /// @dev See {IERC4626-redeem}. Leaving _owner param for ABI compatibility
+  function redeem(uint256 _sharesIn, address _receiver, address _owner) public virtual returns (uint256 _assetsOut) {
+    // Make sure _owner is msg.sender
+    if (_owner != msg.sender) revert TokenOwnerShouldBeSender();
+
+    // See how many shares the owner can redeem
+    uint256 _maxShares = maxRedeem(_owner);
+
+    // Revert if you are trying to redeem too many shares
+    if (_sharesIn > _maxShares) {
+      revert ERC4626ExceededMaxRedeem(_owner, _sharesIn, _maxShares);
+    }
+
+    // See how many asset tokens are expected
+    _assetsOut = previewRedeem(_sharesIn);
+
+    // Do the redemption
+    _withdraw(msg.sender, _receiver, _owner, _assetsOut, _sharesIn);
+  }
+
+  // RESTRICTED FUNCTIONS
+  // ===================================================
+
+  /// @notice Set the fee for the contract on mint|deposit/redeem|withdraw flow
+  /// @param _mintFee The mint fee
+  /// @param _redeemFee The redeem fee
+  function setMintRedeemFee(uint256 _mintFee, uint _redeemFee) public onlyOwner {
+    require(_mintFee < 1e18 && _redeemFee < 1e18, "Fee must be a fraction of underlying");
+    mintFee = _mintFee;
+    redeemFee = _redeemFee;
+  }
+
+  /// @notice Added to support tokens
+  /// @param _tokenAddress The token to recover
+  /// @param _tokenAmount The amount to recover
+  function recoverERC20(address _tokenAddress, uint256 _tokenAmount) external onlyOwner {
+    // Only the owner address can ever receive the recovery withdrawal
+    SafeERC20.safeTransfer(IERC20(_tokenAddress), owner(), _tokenAmount);
+    emit RecoveredERC20(_tokenAddress, _tokenAmount);
+  }
+
+  /// @notice Set the mint cap for frxUSD minting
+  /// @param _mintCap The new mint cap
+  function setMintCap(uint256 _mintCap) public onlyOwner {
+    mintCap = _mintCap;
+    emit MintCapSet(_mintCap);
+  }
+
+  /// @notice Set the status for a custodian operator
+  /// @param _operator  The address of the operator whose status is updated
+  /// @param _status    The status for the operator
+  /// @dev only callable via `owner`
+  function setApprovedOperator(address _operator, bool _status) public onlyOwner {
+    isApprovedOperator[_operator] = _status;
+    emit OperatorStatusSet(_operator, _status);
+  }
+
+  /// @notice Set the `minAfterShuffle` variable
+  /// @param _minAfterShuffle The minimum amt of `custodianTkn` that must remain in the contract
+  ///                         after the call to `shuffleToRwa`
+  /// @dev only callable via `owner`
+  function setMinAfterShuffle(uint256 _minAfterShuffle) public onlyOwner {
+    emit MinAmountAfterShuffleSet(minAfterShuffle, _minAfterShuffle);
+    minAfterShuffle = _minAfterShuffle;
+  }
+
+  /// @notice Function that will take excess usdc and shuffle it into RWA's earning RFR
+  /// @param amount          The amount of `custodianTkn`
+  /// @param minAmountRwaOut The minumOut
+  function shuffleToRwa(uint256 amount, uint256 minAmountRwaOut) public {
+    IRWAIssuer rwaIssuer = IRWAIssuer(0x43415eB6ff9DB7E26A15b704e7A3eDCe97d31C4e);
+    address rwaCustodian = 0x5fbAa3A3B489199338fbD85F7E3D444dc0504F33;
+
+    if (!isApprovedOperator[msg.sender]) revert NotOperator();
+    if (custodianTkn.balanceOf(address(this)) - amount < minAfterShuffle) revert AmountTooHigh();
+
+    uint256 totalAssetsStart;
+    if (minAmountRwaOut > 0) {
+      totalAssetsStart = FrxUSDCustodian(rwaCustodian).totalAssets();
+    }
+    custodianTkn.approve(address(rwaIssuer), amount);
+    rwaIssuer.subscribe(rwaCustodian, amount, address(custodianTkn));
+    if (minAmountRwaOut > 0) {
+      if (FrxUSDCustodian(rwaCustodian).totalAssets() - totalAssetsStart < minAmountRwaOut) {
+        revert SlippageTooHigh();
+      }
+    }
+  }
+
+  // EVENTS
+  // ===================================================
+
+  /// @notice When a deposit/mint has occured
+  /// @param sender The transaction sender
+  /// @param owner The owner of the assets
+  /// @param assets Amount of assets taken in
+  /// @param shares Amount of shares given out
+  event Deposit(address indexed sender, address indexed owner, uint256 assets, uint256 shares);
+
+  /// @notice When ERC20 tokens were recovered
+  /// @param token Token address
+  /// @param amount Amount of tokens collected
+  event RecoveredERC20(address token, uint256 amount);
+
+  /// @notice When a withdrawal/redemption has occured
+  /// @param sender The transaction sender
+  /// @param receiver Reciever of the assets
+  /// @param owner The owner of the shares
+  /// @param assets Amount of assets given out
+  /// @param shares Amount of shares taken in
+  event Withdraw(
+    address indexed sender,
+    address indexed receiver,
+    address indexed owner,
+    uint256 assets,
+    uint256 shares
+  );
+
+  /// @notice When the mint cap is set
+  /// @param mintCap The new mint cap
+  event MintCapSet(uint256 mintCap);
+
+  /// @notice Event emitted when an operator is set
+  /// @param operator The address of the operator whose status is updated
+  /// @param status   The status of the operator: true -> allowed | false -> disallowed
+  event OperatorStatusSet(address operator, bool status);
+
+  /// @notice Event emitted when the `minAfterShuffle` variable is set
+  /// @param oldValue The old `minAfterShuffle` value
+  /// @param newValue The new `minAfterShuffle` value
+  event MinAmountAfterShuffleSet(uint256 oldValue, uint256 newValue);
+
+  /// @notice Event emitted when `custodianTkn` is shuffled to RWA
+  /// @param custodianTknAmount The amount of `custodianTkn` shuffled
+  /// @param targetRwa          The RWA Address we are shuffling to
+  event custodianTknShuffledToRwa(uint256 custodianTknAmount, address targetRwa);
+
+  // ERRORS
+  // ===================================================
+
+  /// @notice Attempted to deposit more assets than the max amount for `receiver`
+  /// @param receiver The intended recipient of the shares
+  /// @param asset
[truncated — full diff is 67,258 bytes]
> ```

> </details>

> <details>
> <summary>📝 Source diff — upgrade #4 (<code>0xD24A...CCeF</code> → <code>0x5643...C693</code>): +127/-1447 lines (truncated)</summary>

> ```diff
--- old_impl
+++ new_impl
@@ -23,8 +23,9 @@
 import { Math } from "@openzeppelin/contracts/utils/math/Math.sol";
 import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
 import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
-import { FrxUSD } from "./FrxUSD.sol";
+import { IFrxUSD } from "src/interfaces/IFrxUSD.sol";
 import { IRWAIssuer } from "src/interfaces/IRWAIssuer.sol";
+import { IWtgxxCustodian } from "src/interfaces/IWtgxxCustodian.sol";
 
 contract FrxUSDCustodian is Ownable2Step, ReentrancyGuard {
   using Math for uint256;
@@ -33,7 +34,7 @@
   // ===================================================
 
   /// @notice frxUSD token = share
-  FrxUSD public immutable frxUSD;
+  IFrxUSD public immutable frxUSD;
 
   /// @notice Custodian token = asset
   IERC20 public immutable custodianTkn;
@@ -74,7 +75,7 @@
     wasInitialized = true;
 
     // Set token addresses
-    frxUSD = FrxUSD(_frxUSD);
+    frxUSD = IFrxUSD(_frxUSD);
     custodianTkn = IERC20(_custodianTkn);
 
     // Set decimals
@@ -337,7 +338,7 @@
 
     // frxUSD minted accounting
     frxUSDMinted += _shares;
-    if (frxUSDMinted >= mintCap) revert MintCapExceeded(_receiver, _shares, mintCap);
+    if (frxUSDMinted > mintCap) revert MintCapExceeded(_receiver, _shares, mintCap);
 
     emit Deposit(_caller, _receiver, _assets, _shares);
   }
@@ -518,26 +519,38 @@
   }
 
   /// @notice Function that will take excess usdc and shuffle it into RWA's earning RFR
-  /// @param amount          The amount of `custodianTkn`
-  /// @param minAmountRwaOut The minumOut
-  function shuffleToRwa(uint256 amount, uint256 minAmountRwaOut) public {
+  /// @param amount           The amount of `custodianTkn`
+  /// @param minAmountRwaOut  The minimum amount of rwa out
+  /// @param assetToShuffleTo Enum representing the asset we want to shuffle to
+  function shuffleToRwa(uint256 amount, uint256 minAmountRwaOut, uint8 assetToShuffleTo) public {
     IRWAIssuer rwaIssuer = IRWAIssuer(0x43415eB6ff9DB7E26A15b704e7A3eDCe97d31C4e);
     address rwaCustodian = 0x5fbAa3A3B489199338fbD85F7E3D444dc0504F33;
+    address wtgxxCustodian = 0x860Cc723935FC9A15fF8b1A94237a711DFeF7857;
 
     if (!isApprovedOperator[msg.sender]) revert NotOperator();
     if (custodianTkn.balanceOf(address(this)) - amount < minAfterShuffle) revert AmountTooHigh();
 
-    uint256 totalAssetsStart;
-    if (minAmountRwaOut > 0) {
-      totalAssetsStart = FrxUSDCustodian(rwaCustodian).totalAssets();
-    }
-    custodianTkn.approve(address(rwaIssuer), amount);
-    rwaIssuer.subscribe(rwaCustodian, amount, address(custodianTkn));
-    if (minAmountRwaOut > 0) {
-      if (FrxUSDCustodian(rwaCustodian).totalAssets() - totalAssetsStart < minAmountRwaOut) {
-        revert SlippageTooHigh();
+    if (assetToShuffleTo == 0) {
+      uint256 totalAssetsStart;
+      if (minAmountRwaOut > 0) {
+        totalAssetsStart = FrxUSDCustodian(rwaCustodian).totalAssets();
       }
-    }
+      custodianTkn.approve(address(rwaIssuer), amount);
+      rwaIssuer.subscribe(rwaCustodian, amount, address(custodianTkn));
+      if (minAmountRwaOut > 0) {
+        if (FrxUSDCustodian(rwaCustodian).totalAssets() - totalAssetsStart < minAmountRwaOut) {
+          revert SlippageTooHigh();
+        }
+      }
+    } else {
+      custodianTkn.transfer(wtgxxCustodian, amount);
+      IWtgxxCustodian(wtgxxCustodian).shuffleToWtgxx(amount);
+    }
+  }
+
+  /// @notice Extend the legacy abi of the contract
+  function shuffleToRwa(uint256 amount, uint256 minAmountRwaOut) external {
+    shuffleToRwa(amount, minAmountRwaOut, 0);
   }
 
   // EVENTS
@@ -2184,261 +2197,103 @@
 }
 
 
-//SPDX-License-Identifier: Unlicense
-pragma solidity ^0.8.0;
-
-import { ERC20Permit, ERC20 } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
-import { ERC20Burnable } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
-import { Ownable2Step } from "@openzeppelin/contracts/access/Ownable2Step.sol";
-import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
-import { StorageSlot } from "@openzeppelin/contracts/utils/StorageSlot.sol";
-
-/// @title FrxUSD
-/**
- * @notice Combines Openzeppelin's ERC20Permit, ERC20Burnable and Ownable2Step.
- *     Also includes a list of authorized minters
- */
-/// @dev FrxUSD adheres to EIP-712/EIP-2612 and can use permits
-contract FrxUSD is ERC20Permit, ERC20Burnable, Ownable2Step {
-  /// @notice Array of the non-bridge minters
-  address[] public minters_array;
-
-  /// @notice Mapping of the minters
-  /// @dev Mapping is used for faster verification
-  mapping(address => bool) public minters;
-
-  /// @notice Mapping indicating which addresses are frozen
-  mapping(address => bool) public isFrozen;
-
-  /// @notice Whether or not the contract is paused
-  bool public isPaused;
-
-  /* ========== CONSTRUCTOR ========== */
-  /// @param _ownerAddress The initial owner
-  /// @param _name ERC20 name
-  /// @param _symbol ERC20 symbol
-  constructor(
-    address _ownerAddress,
-    string memory _name,
-    string memory _symbol
-  ) ERC20(_name, _symbol) ERC20Permit(_name) Ownable(_ownerAddress) {}
-
-  /* ========== INITIALIZER ========== */
-  /// @dev Used to initialize the contract when it is behind a proxy
-  function initialize(address _owner, string memory _name, string memory _symbol) public {
-    require(owner() == address(0), "Already initialized");
-    if (_owner == address(0)) revert OwnerCannotInitToZeroAddress();
-    _transferOwnership(_owner);
-    StorageSlot.getBytesSlot(bytes32(uint256(3))).value = bytes(_name);
-    StorageSlot.getBytesSlot(bytes32(uint256(4))).value = bytes(_symbol);
-  }
-
-  /* ========== MODIFIERS ========== */
-
-  /// @notice A modifier that only allows a minters to call
-  modifier onlyMinters() {
-    require(minters[msg.sender] == true, "Only minters");
-    _;
-  }
-
-  /* ========== RESTRICTED FUNCTIONS [MINTERS] ========== */
-
-  /// @notice Used by minters to burn tokens
-  /// @param b_address Address of the account to burn from
-  /// @param b_amount Amount of tokens to burn
-  function minter_burn_from(address b_address, uint256 b_amount) public onlyMinters {
-    super.burnFrom(b_address, b_amount);
-    emit TokenMinterBurned(b_address, msg.sender, b_amount);
-  }
-
-  /// @notice Used by minters to mint new tokens
-  /// @param m_address Address of the account to mint to
-  /// @param m_amount Amount of tokens to mint
-  function minter_mint(address m_address, uint256 m_amount) public onlyMinters {
-    super._mint(m_address, m_amount);
-    emit TokenMinterMinted(msg.sender, m_address, m_amount);
-  }
-
-  /* ========== RESTRICTED FUNCTIONS [OWNER] ========== */
-  /// @notice Adds a minter
-  /// @param minter_address Address of minter to add
-  function addMinter(address minter_address) public onlyOwner {
-    require(minter_address != address(0), "Zero address detected");
-
-    require(minters[minter_address] == false, "Address already exists");
-    minters[minter_address] = true;
-    minters_array.push(minter_address);
-
-    emit MinterAdded(minter_address);
-  }
-
-  /// @notice Removes a non-bridge minter
-  /// @param minter_address Address of minter to remove
-  function removeMinter(address minter_address) public onlyOwner {
-    require(minter_address != address(0), "Zero address detected");
-    require(minters[minter_address] == true, "Address nonexistant");
-
-    // Delete from the mapping
-    delete minters[minter_address];
-
-    // 'Delete' from the array by setting the address to 0x0
-    for (uint256 i = 0; i < minters_array.length; i++) {
-      if (minters_array[i] == minter_address) {
-        minters_array[i] = address(0); // This will leave a null in the array and keep the indices the same
-        break;
-      }
-    }
-
-    emit MinterRemoved(minter_address);
-  }
-
-  /// @notice External admin gated function to unfreeze a set of accounts
-  /// @param _owners Array of accounts to be unfrozen
-  function thawMany(address[] memory _owners) external onlyOwner {
-    uint256 len = _owners.length;
-    for (uint256 i; i < len; ++i) {
-      _thaw(_owners[i]);
-    }
-  }
-
-  /// @notice External admin gated function to unfreeze an account
-  /// @param _owner The account to be unfrozen
-  function thaw(address _owner) external onlyOwner {
-    _thaw(_owner);
-  }
-
-  /// @notice External admin gated function to batch freeze a set of accounts
-  /// @param _owners Array of accounts to be frozen
-  function freezeMany(address[] memory _owners) external onlyOwner {
-    uint256 len = _owners.length;
-    for (uint256 i; i < len; ++i) {
-      _freeze(_owners[i]);
-    }
-  }
-
-  /// @notice External admin gated function to freeze a given account
-  /// @param _owner The account to be
-  function freeze(address _owner) external onlyOwner {
-    _freeze(_owner);
-  }
-
-  /// @notice External admin gated function to batch burn balance from a set of accounts
-  /// @param _owners Array of accounts whose balances will be burned
-  /// @param _amounts Array of amounts corresponding to the balances to be burned
-  /// @dev if `_amount` == 0, entire balance will be burned
-  function burnMany(address[] memory _owners, uint256[] memory _amounts) external onlyOwner {
-    uint lenOwner = _owners.length;
-    if (_owners.length != _amounts.length) revert ArrayMisMatch();
-    for (uint i; i < lenOwner; ++i) {
-      if (_amounts[i] == 0) _amounts[i] = balanceOf(_owners[i]);
-      _burn(_owners[i], _amounts[i]);
-    }
-  }
-
-  /// @notice External admin gated function to burn balance from a given account
-  /// @param _owner  The account whose balance will be burned
-  /// @param _amount The amount of balance to burn
-  /// @dev if `_amount` == 0, entire balance will be burned
-  function burn(address _owner, uint256 _amount) external onlyOwner {
-    if (_amount == 0) _amount = balanceOf(_owner);
-    _burn(_owner, _amount);
-  }
-
-  /// @notice External admin gated pause function
-  function pause() external onlyOwner {
-    isPaused = true;
-    emit Paused();
-  }
-
-  /// @notice External admin gated unpause function
-  function unpause() external onlyOwner {
-    isPaused = false;
-    emit Unpaused();
-  }
-
-  /* ========== Internals For Admin Gated ========== */
-
-  /// @notice Internal helper function to freeze an account
-  /// @param _owner The account to 'frozen'
-  function _freeze(address _owner) internal {
-    isFrozen[_owner] = true;
-    emit AccountFrozen(_owner);
-  }
-
-  /// @notice Internal helper function to unfreeze an account
-  /// @param _owner The account to unfreeze
-  function _thaw(address _owner) internal {
-    isFrozen[_owner] = false;
-    emit AccountThawed(_owner);
-  }
-
-  /* ========== Overrides ========== */
-
-  /// @notice override for base internal `_update(address,address,uint256)`
-  ///         implements `paused` and `frozen` transfer logic
-  /// @param from  The address from which balance is originating
-  /// @param to    The address whose balance will be incremented
-  /// @param value The amount to increment/decrement the balances of
-  /// @dev Owner can bypass pause and freeze checks
-  function _update(address from, address to, uint256 value) internal override {
-    if (msg.sender != owner()) {
-      if (isPaused) revert IsPaused();
-      if (isFrozen[to] || isFrozen[from] || isFrozen[msg.sender]) revert IsFrozen();
-    }
-    super._update(from, to, value);
-  }
-
-  /* ========== EVENTS ========== */
-
-  /// @notice Emitted whenever the bridge burns tokens from an account
-  /// @param account Address of the account tokens are being burned from
-  /// @param amount  Amount of tokens burned
+// SPDX-License-Identifier: UNLICENSED
+pragma solidity ^0.8.4;
+
+import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
+
+interface IFrxUSD is IERC20 {
+  error ArrayMisMatch();
+  error ECDSAInvalidSignature();
+  error ECDSAInvalidSignatureLength(uint256 length);
+  error ECDSAInvalidSignatureS(bytes32 s);
+  error ERC20InsufficientAllowance(address spender, uint256 allowance, uint256 needed);
+  error ERC20InsufficientBalance(address sender, uint256 balance, uint256 needed);
+  error ERC20InvalidApprover(address approver);
+  error ERC20InvalidReceiver(address receiver);
+  error ERC20InvalidSender(address sender);
+  error ERC20InvalidSpender(address spender);
+  error ERC2612ExpiredSignature(uint256 deadline);
+  error ERC2612InvalidSigner(address signer, address owner);
+  error InvalidAccountNonce(address account, uint256 currentNonce);
+  error InvalidShortString();
+  error IsFrozen();
+  error IsPaused();
+  error OwnableInvalidOwner(address owner);
+  error OwnableUnauthorizedAccount(address account);
+  error OwnerCannotInitToZeroAddress();
+  error StringTooLong(string str);
+
+  event AccountFrozen(address account);
+  event AccountThawed(address account);
   event Burn(address indexed account, uint256 amount);
-
-  /// @notice Emitted whenever the bridge mints tokens to an account
-  /// @param account Address of the account tokens are being minted for
-  /// @param amount  Amount of tokens minted.
+  event EIP712DomainChanged();
   event Mint(address indexed account, uint256 amount);
-
-  /// @notice Emitted when a non-bridge minter is added
-  /// @param minter_address Address of the new minter
   event MinterAdded(address minter_address);
-
-  /// @notice Emitted when a non-bridge minter is removed
-  /// @param minter_address Address of the removed minter
   event MinterRemoved(address minter_address);
-
-  /// @notice Emitted when a non-bridge minter burns tokens
-  /// @param from The account whose tokens are burned
-  /// @param to The minter doing the burning
-  /// @param amount Amount of tokens burned
+  event OwnershipTransferStarted(address indexed previousOwner, address indexed newOwner);
+  event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
+  event Paused();
   event TokenMinterBurned(address indexed from, address indexed to, uint256 amount);
-
-  /// @notice Emitted when a non-bridge minter mints tokens
-  /// @param from The minter doing the minting
-  /// @param to The account that gets the newly minted tokens
-  /// @param amount Amount of tokens minted
   event TokenMinterMinted(address indexed from, address indexed to, uint256 amount);
-
-  /// @notice Event Emitted when the contract is paused
-  event Paused();
-
-  /// @notice Event Emitted when the contract is unpaused
   event Unpaused();
 
-  /// @notice Event Emitted when an address is frozen
-  /// @param account The account being frozen
-  event AccountFrozen(address account);
-
-  /// @notice Event Emitted when an address is unfrozen
-  /// @param account The account being thawed
-  event AccountThawed(address account);
-
-  /* ========== ERRORS ========== */
-  error ArrayMisMatch();
-  error IsPaused();
-  error IsFrozen();
-  error OwnerCannotInitToZeroAddress();
+  function DOMAIN_SEPARATOR() external view returns (bytes32);
+  function acceptOwnership() external;
+  function addMinter(address minter_address) external;
+  function allowance(address owner, address spender) external view returns (uint256);
+  function approve(address spender, uint256 value) external returns (bool);
+  function balanceOf(address account) external view returns (uint256);
+  function burn(uint256 value) external;
+  function burn(address _owner, uint256 _amount) external;
+  function burnFrom(address account, uint256 value) external;
+  function burnMany(address[] memory _owners, uint256[] memory _amounts) external;
+  function decimals() external view returns (uint8);
+  function eip712Domain()
+    external
+    view
+    returns (
+      bytes1 fields,
+      string memory name,
+      string memory version,
+      uint256 chainId,
+      address verifyingContract,
+      bytes32 salt,
+      uint256[] memory extensions
+    );
+  function freeze(address _owner) external;
+  function freezeMany(address[] memory _owners) external;
+  function initialize(address _owner, string memory _name, string memory _symbol) external;
+  function isFrozen(address) external view returns (bool);
+  function isPaused() external view returns (bool);
+  function minter_burn_from(address b_address, uint256 b_amount) external;
+  function minter_mint(address m_address, uint256 m_amount) external;
+  function minters(address) external view returns (bool);
+  function minters_array(uint256) external view returns (address);
+  function name() external view returns (string memory);
+  function nonces(address owner) external view returns (uint256);
+  function owner() external view returns (address);
+  function pause() external;
+  function pendingOwner() external view returns (address);
+  function permit(
+    address owner,
+    address spender,
+    uint256 value,
+    uint256 deadline,
+    uint8 v,
+    bytes32 r,
+    bytes32 s
+  ) external;
+  function removeMinter(address minter_address) external;
+  function renounceOwnership() external;
+  function symbol() external view returns (string memory);
+  function thaw(address _owner) external;
+  function thawMany(address[] memory _owners) external;
+  function totalSupply() external view returns (uint256);
+  function transfer(address to, uint256 value) external returns (bool);
+  function transferFrom(address from, address to, uint256 value) external returns (bool);
+  function transferOwnership(address newOwner) external;
+  function unpause() external;
 }
 
 
@@ -2448,6 +2303,14 @@
 interface IRWAIssuer {
   function subscribe(uint256 inAmount, address stablecoin) external;
   function subscribe(address to, uint256 inAmount, address stablecoin) external;
+}
+
+
+// SPDX-License-Identifier: MIT
+pragma solidity >=0.8.0;
+
+interface IWtgxxCustodian {
+  function shuffleToWtgxx(uint256 amountUsdc) external;
 }
 
 
@@ -4136,277 +3999,6 @@
 
 
 // SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v5.1.0) (token/ERC20/extensions/ERC20Permit.sol)
-
-pragma solidity ^0.8.20;
-
-import {IERC20Permit} from "./IERC20Permit.sol";
-import {ERC20} from "../ERC20.sol";
-import {ECDSA} from "../../../utils/cryptography/ECDSA.sol";
-import {EIP712} from "../../../utils/cryptography/EIP712.sol";
-import {Nonces} from "../../../utils/Nonces.sol";
-
-/**
- * @dev Implementation of the ERC-20 Permit extension allowing approvals to be made via signatures, as defined in
- * https://eips.ethereum.org/EIPS/eip-2612[ERC-2612].
- *
- * Adds the {permit} method, which can be used to change an account's ERC-20 allowance (see {IERC20-allowance}) by
- * presenting a message signed by the account. By not relying on `{IERC20-approve}`, the token holder account doesn't
- * need to send a transaction, and thus is not required to hold Ether at all.
- */
-abstract contract ERC20Permit is ERC20, IERC20Permit, EIP712, Nonces {
-    bytes32 private constant PERMIT_TYPEHASH =
-        keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)");
-
-    /**
-     * @dev Permit deadline has expired.
-     */
-    error ERC2612ExpiredSignature(uint256 deadline);
-
-    /**
-     * @dev Mismatched signature.
-     */
-    error ERC2612InvalidSigner(address signer, address owner);
-
-    /**
-     * @dev Initializes the {EIP712} domain separator using the `name` parameter, and setting `version` to `"1"`.
-     *
-     * It's a good idea to use the same `name` that is defined as the ERC-20 token name.
-     */
-    constructor(string memory name) EIP712(name, "1") {}
-
-    /**
-     * @inheritdoc IERC20Permit
-     */
-    function permit(
-        address owner,
-        address spender,
-        uint256 value,
-        uint256 deadline,
-        uint8 v,
-        bytes32 r,
-        bytes32 s
-    ) public virtual {
-        if (block.timestamp > deadline) {
-            revert ERC2612ExpiredSignature(deadline);
-        }
-
-        bytes32 structHash = keccak256(abi.encode(PERMIT_TYPEHASH, owner, spender, value, _useNonce(owner), deadline));
-
-        bytes32 hash = _hashTypedDataV4(structHash);
-
-        address signer = ECDSA.recover(hash, v, r, s);
-        if (signer != owner) {
-            revert ERC2612InvalidSigner(signer, owner);
-        }
-
-        _approve(owner, spender, value);
-    }
-
-    /**
-     * @inheritdoc IERC20Permit
-     */
-    function nonces(address owner) public view virtual override(IERC20Permit, Nonces) returns (uint256) {
-        return super.nonces(owner);
-    }
-
-    /**
-     * @inheritdoc IERC20Permit
-     */
-    // solhint-disable-next-line func-name-mixedcase
-    function DOMAIN_SEPARATOR() external view virtual returns (bytes32) {
-        return _domainSeparatorV4();
-    }
-}
-
-
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v5.0.0) (token/ERC20/extensions/ERC20Burnable.sol)
-
-pragma solidity ^0.8.20;
-
-import {ERC20} from "../ERC20.sol";
-import {Context} from "../../../utils/Context.sol";
-
-/**
- * @dev Extension of {ERC20} that allows token holders to destroy both their own
- * tokens and those that they have an allowance for, in a way that can be
- * recognized off-chain (via event analysis).
- */
-abstract contract ERC20Burnable is Context, ERC20 {
-    /**
-     * @dev Destroys a `value` amount of tokens from the caller.
-     *
-     * See {ERC20-_burn}.
-     */
-    function burn(uint256 value) public virtual {
-        _burn(_msgSender(), value);
-    }
-
-    /**
-     * @dev Destroys a `value` amount of tokens from `account`, deducting from
-     * the caller's allowance.
-     *
-     * See {ERC20-_burn} and {ERC20-allowance}.
-     *
-     * Requirements:
-     *
-     * - the caller must have allowance for ``accounts``'s tokens of at least
-     * `value`.
-     */
-    function burnFrom(address account, uint256 value) public virtual {
-        _spendAllowance(account, _msgSender(), value);
-        _burn(account, value);
-    }
-}
-
-
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v5.1.0) (utils/StorageSlot.sol)
-// This file was procedurally generated from scripts/generate/templates/StorageSlot.js.
-
-pragma solidity ^0.8.20;
-
-/**
- * @dev Library for reading and writing primitive types to specific storage slots.
- *
- * Storage slots are often used to avoid storage conflict when dealing with upgradeable contracts.
- * This library helps with reading and writing to such slots without the need for inline assembly.
- *
- * The functions in this library return Slot structs that contain a `value` member that can be used to read or write.
- *
- * Example usage to set ERC-1967 implementation slot:
- * ```solidity
- * contract ERC1967 {
- *     // Define the slot. Alternatively, use the SlotDerivation library to derive the slot.
- *     bytes32 internal constant _IMPLEMENTATION_SLOT = 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;
- *
- *     function _getImplementation() internal view returns (address) {
- *         return StorageSlot.getAddressSlot(_IMPLEMENTATION_SLOT).value;
- *     }
- *
- *     function _setImplementation(address newImplementation) internal {
- *         require(newImplementation.code.length > 0);
- *         StorageSlot.getAddressSlot(_IMPLEMENTATION_SLOT).value = newImplementation;
- *     }
- * }
- * ```
- *
- * TIP: Consider using this library along with {SlotDerivation}.
- */
-library StorageSlot {
-    struct AddressSlot {
-        address value;
-    }
-
-    struct BooleanSlot {
-        bool value;
-    }
-
-    struct Bytes32Slot {
-        bytes32 value;
-    }
-
-    struct Uint256Slot {
-        uint256 value;
-    }
-
-    struct Int256Slot {
-        int256 value;
-    }
-
-    struct StringSlot {
-        string value;
-    }
-
-    struct BytesSlot {
-        bytes value;
-    }
-
-    /**
-     * @dev Returns an `AddressSlot` with member `value` located at `slot`.
-     */
-    function getAddressSlot(bytes32 slot) internal pure returns (AddressSlot storage r) {
-        assembly ("memory-safe") {
-            r.slot := slot
-        }
-    }
-
-    /**
-     * @dev Returns a `BooleanSlot` with member `value` located at `slot`.
-     */
-    function getBooleanSlot(bytes32 slot) internal pure returns (BooleanSlot storage r) {
-        assembly ("memory-safe") {
-            r.slot := slot
-        }
-    }
-
-    /**
-     * @dev Returns a `Bytes32Slot` with member `value` located at `slot`.
-     */
-    function getBytes32Slot(bytes32 slot) internal pure returns (Bytes32Slot storage r) {
-        assembly ("memory-safe") {
-            r.slot := slot
-        }
-    }
-
-    /**
-     * @dev Returns a `Uint256Slot` with member `value` located at `slot`.
-     */
-    function getUint256Slot(bytes32 slot) internal pure returns (Uint256Slot storage r) {
-        assembly ("memory-safe") {
-            r.slot := slot
-        }
-    }
-
-    /**
-     * @dev Returns a `Int256Slot` with member `value` located at `slot`.
-     */
-    function getInt256Slot(bytes32 slot) internal pure returns (Int256Slot storage r) {
-        assembly ("memory-safe") {
-            r.slot := slot
-        }
-    }
-
-    /**
-     * @dev Returns a `StringSlot` with member `value` located at `slot`.
-     */
-    function getStringSlot(bytes32 slot) internal pure returns (StringSlot storage r) {
-        assembly ("memory-safe") {
-            r.slot := slot
-        }
-    }
-
-    /**
-     * @dev Returns an `StringSlot` representation of the string storage pointer `store`.
-     */
-    function getStringSlot(string storage store) internal pure returns (StringSlot storage r) {
-        assembly ("memory-safe") {
-            r.slot := store.slot
-        }
-    }
-
-    /**
-     * @dev Returns a `BytesSlot` with member `value` located at `slot`.
-     */
-    function getBytesSlot(bytes32 slot) internal pure returns (BytesSlot storage r) {
-        assembly ("memory-safe") {
-            r.slot := slot
-        }
-    }
-
-    /**
-     * @dev Returns an `BytesSlot` representation of the bytes storage pointer `store`.
-     */
-    function getBytesSlot(bytes storage store) internal pure returns (BytesSlot storage r) {
-        assembly ("memory-safe") {
-            r.slot := store.slot
-        }
-    }
-}
-
-
-// SPDX-License-Identifier: MIT
 // OpenZeppelin Contracts (last updated v5.0.0) (interfaces/IERC20.sol)
 
 pragma solidity ^0.8.20;
@@ -4455,490 +4047,6 @@
      * @dev A necessary precompile is missing.
      */
     error MissingPrecompile(address);
-}
-
-
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v5.1.0) (token/ERC20/extensions/IERC20Permit.sol)
-
-pragma solidity ^0.8.20;
-
-/**
- * @dev Interface of the ERC-20 Permit extension allowing approvals to be made via signatures, as defined in
- * https://eips.ethereum.org/EIPS/eip-2612[ERC-2612].
- *
- * Adds the {permit} method, which can be used to change an account's ERC-20 allowance (see {IERC20-allowance}) by
- * presenting a message signed by the account. By not relying on {IERC20-approve}, the token holder account doesn't
- * need to send a transaction, and thus is not required to hold Ether at all.
- *
- * ==== Security Considerations
- *
- * There are two important considerations concerning the use of `permit`. The first is that a valid permit signature
- * expresses an allowance, and it should not be assumed to convey additional meaning. In particular, it should not be
- * considered as an intention to spend the allowance in any specific way. The second is that because permits have
- * built-in replay protection and can be submitted by anyone, they can be frontrun. A protocol that uses permits should
- * take this into consideration and allow a `permit` call to fail. Combining these two aspects, a pattern that may be
- * generally recommended is:
- *
- * ```solidity
- * function doThingWithPermit(..., uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s) public {
- *     try token.permit(msg.sender, address(this), value, deadline, v, r, s) {} catch {}
- *     doThing(..., value);
- * }
- *
- * function doThing(..., uint256 value) public {
- *     token.safeTransferFrom(msg.sender, address(this), value);
- *     ...
- * }
- * ```
- *
- * Observe that: 1) `msg.sender` is used as the owner, leaving no ambiguity as to the signer intent, and 2) the use of
- * `try/catch` allows the permit to fail and makes the code tolerant to frontrunning. (See also
- * {SafeERC20-safeTransferFrom}).
- *
- * Additionally, note that smart contract wallets (such as Argent or Safe) are not able to produce permit signatures, so
- * contracts should have entry points that don't rely on permit.
- */
-interface IERC20Permit {
-    /**
-     * @dev Sets `value` as the allowance of `spender` over ``owner``'s tokens,
-     * given ``owner``'s signed approval.
-     *
-     * IMPORTANT: The same issues {IERC20-approve} has related to transaction
-     * ordering also apply here.
-     *
-     * Emits an {Approval} event.
-     *
-     * Requirements:
-     *
-     * - `spender` cannot be the zero address.
-     * - `deadline` must be a timestamp in the future.
-     * - `v`, `r` and `s` must be a valid `secp256k1` signature from `owner`
-     * over the EIP712-formatted function arguments.
-     * - the signature must use ``owner``'s current nonce (see {nonces}).
-     *
-     * For more information on the signature format, see the
-     * https://eips.ethereum.org/EIPS/eip-2612#specification[relevant EIP
-     * section].
-     *
-     * CAUTION: See Security Considerations above.
-     */
-    function permit(
-        address owner,
-        address spender,
-        uint256 value,
-        uint256 deadline,
-        uint8 v,
-        bytes32 r,
-        bytes32 s
-    ) external;
-
-    /**
-     * @dev Returns the current nonce for `owner`. This value must be
-     * included whenever a signature is generated for {permit}.
-     *
-     * Every successful call to {permit} increases ``owner``'s nonce by one. This
-     * prevents a signature from being used multiple times.
-     */
-    function nonces(address owner) external view returns (uint256);
-
-    /**
-     * @dev Returns the domain separator used in the encoding of the signature for {permit}, as defined by {EIP712}.
-     */
-    // solhint-disable-next-line func-name-mixedcase
-    function DOMAIN_SEPARATOR() external view returns (bytes32);
-}
-
-
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v5.1.0) (utils/cryptography/ECDSA.sol)
-
-pragma solidity ^0.8.20;
-
-/**
- * @dev Elliptic Curve Digital Signature Algorithm (ECDSA) operations.
- *
- * These functions can be used to verify that a message was signed by the holder
- * of the private keys of a given address.
- */
-library ECDSA {
-    enum RecoverError {
-        NoError,
-        InvalidSignature,
-        InvalidSignatureLength,
-        InvalidSignatureS
-    }
-
-    /**
-     * @dev The signature derives the `address(0)`.
-     */
-    error ECDSAInvalidSignature();
-
-    /**
-     * @dev The signature has an invalid length.
-     */
-    error ECDSAInvalidSignatureLength(uint256 length);
-
-    /**
-     * @dev The signature has an S value that is in the upper half order.
-     */
-    error ECDSAInvalidSignatureS(bytes32 s);
-
-    /**
-     * @dev Returns the address that signed a hashed message (`hash`) with `signature` or an error. This will not
-     * return address(0) without also returning an error description. Errors are documented using an enum (error type)
-     * and a bytes32 providing additional information about the error.
-     *
-     * If no error is returned, then the address can be used for verification purposes.
-     *
-     * The `ecrecover` EVM precompile allows for malleable (non-unique) signatures:
-     * this function rejects them by requiring the `s` value to be in the lower
-     * half order, and the `v` value to be either 27 or 28.
-     *
-     * IMPORTANT: `hash` _must_ be the result of a hash operation for the
-     * verification to be secure: it is possible to craft signatures that
-     * recover to arbitrary addresses for non-hashed data. A safe way to ensure
-     * this is by receiving a hash of the original message (which may otherwise
-     * be too long), and then calling {MessageHashUtils-toEthSignedMessageHash} on it.
-     *
-     * Documentation for signature generation:
-     * - with https://web3js.readthedocs.io/en/v1.3.4/web3-eth-accounts.html#sign[Web3.js]
-     * - with https://docs.ethers.io/v5/api/signer/#Signer-signMessage[ethers]
-     */
-    function tryRecover(
-        bytes32 hash,
-        bytes memory signature
-    ) internal pure returns (address recovered, RecoverError err, bytes32 errArg) {
-        if (signature.length == 65) {
-            bytes32 r;
-            bytes32 s;
-            uint8 v;
-            // ecrecover takes the signature parameters, and the only way to get them
-            // currently is to use assembly.
-            assembly ("memory-safe") {
-                r := mload(add(signature, 0x20))
-                s := mload(add(signature, 0x40))
-                v := byte(0, mload(add(signature, 0x60)))
-            }
-            return tryRecover(hash, v, r, s);
-        } else {
-            return (address(0), RecoverError.InvalidSignatureLength, bytes32(signature.length));
-        }
-    }
-
-    /**
-     * @dev Returns the address that signed a hashed message (`hash`) with
-     * `signature`. This address can then be used for verification purposes.
-     *
-     * The `ecrecover` EVM precompile allows for malleable (non-unique) signatures:
-     * this function rejects them by requiring the `s` value to be in the lower
-     * half order, and the `v` value to be either 27 or 28.
-     *
-     * IMPORTANT: `hash` _must_ be the result of a hash operation for the
-     * verification to be secure: it is possible to craft signatures that
-     * recover to arbitrary addresses for non-hashed data. A safe way to ensure
-     * this is by receiving a hash of the original message (which may otherwise
-     * be too long), and then calling {MessageHashUtils-toEthSignedMessageHash} on it.
-     */
-    function recover(bytes32 hash, bytes memory signature) internal pure returns (address) {
-        (address recovered, RecoverError error, bytes32 errorArg) = tryRecover(hash, signature);
-        _throwError(error, errorArg);
-        return recovered;
-    }
-
-    /**
-     * @dev Overload of {ECDSA-tryRecover} that receives the `r` and `vs` short-signature fields separately.
-     *
-     * See https://eips.ethereum.org/EIPS/eip-2098[ERC-2098 short signatures]
-     */
-    function tryRecover(
-        bytes32 hash,
-        bytes32 r,
-        bytes32 vs
-    ) internal pure returns (address recovered, RecoverError err, bytes32 errArg) {
-        unchecked {
-            bytes32 s = vs & bytes32(0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);
-            // We do not check for an overflow here since the shift operation results in 0 or 1.
-            uint8 v = uint8((uint256(vs) >> 255) + 27);
-            return tryRecover(hash, v, r, s);
-        }
-    }
-
-    /**
-     * @dev Overload of {ECDSA-recover} that receives the `r and `vs` short-signature fields separately.
-     */
-    function recover(bytes32 hash, bytes32 r, bytes32 vs) internal pure returns (address) {
-        (address recovered, RecoverError error, bytes32 errorArg) = tryRecover(hash, r, vs);
-        _throwError(error, errorArg);
-        return recovered;
-    }
-
-    /**
-     * @dev Overload of {ECDSA-tryRecover} that receives the `v`,
-     * `r` and `s` signature fields separately.
-     */
-    function tryRecover(
-        bytes32 hash,
-        uint8 v,
-        bytes32 r,
-        bytes32 s
-    ) internal pure returns (address recovered, RecoverError err, bytes32 errArg) {
-        // EIP-2 still allows signature malleability for ecrecover(). Remove this possibility and make the signature
-        // unique. Appendix F in the Ethereum Yellow paper (https://ethereum.github.io/yellowpaper/paper.pdf), defines
-        // the valid range for s in (301): 0 < s < secp256k1n ÷ 2 + 1, and for v in (302): v ∈ {27, 28}. Most
-        // signatures from current libraries generate a unique signature with an s-value in the lower half order.
-        //
-        // If your library generates malleable signatures, such as s-values in the upper range, calculate a new s-value
-        // with 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141 - s1 and flip v from 27 to 28 or
-        // vice versa. If your library also generates signatures with 0/1 for v instead 27/28, add 27 to v to accept
-        // these malleable signatures as well.
-        if (uint256(s) > 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5D576E7357A4501DDFE92F46681B20A0) {
-            return (address(0), RecoverError.InvalidSignatureS, s);
-        }
-
-        // If the signature is valid (and not malleable), return the signer address
-        address signer = ecrecover(hash, v, r, s);
-        if (signer == address(0)) {
-            return (address(0), RecoverError.InvalidSignature, bytes32(0));
-        }
-
-        return (signer, RecoverError.NoError, bytes32(0));
-    }
-
-    /**
-     * @dev Overload of {ECDSA-recover} that receives the `v`,
-     * `r` and `s` signature fields separately.
-     */
-    function recover(bytes32 hash, uint8 v, bytes32 r, bytes32 s) internal pure returns (address) {
-        (address recovered, RecoverError error, bytes32 errorArg) = tryRecover(hash, v, r, s);
-        _throwError(error, errorArg);
-        return recovered;
-    }
-
-    /**
-     * @dev Optionally reverts with the corresponding custom error according to the `error` argument provided.
-     */
-    function _throwError(RecoverError error, bytes32 errorArg) private pure {
-        if (error == RecoverError.NoError) {
-            return; // no error: do nothing
-        } else if (error == RecoverError.InvalidSignature) {
-            revert ECDSAInvalidSignature();
-        } else if (error == RecoverError.InvalidSignatureLength) {
-            revert ECDSAInvalidSignatureLength(uint256(errorArg));
-        } else if (error == RecoverError.InvalidSignatureS) {
-            revert ECDSAInvalidSignatureS(errorArg);
-        }
-    }
-}
-
-
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v5.1.0) (utils/cryptography/EIP712.sol)
-
-pragma solidity ^0.8.20;
-
-import {MessageHashUtils} from "./MessageHashUtils.sol";
-import {ShortStrings, ShortString} from "../ShortStrings.sol";
-import {IERC5267} from "../../interfaces/IERC5267.sol";
-
-/**
- * @dev https://eips.ethereum.org/EIPS/eip-712[EIP-712] is a standard for hashing and signing of typed structured data.
- *
- * The encoding scheme specified in the EIP requires a domain separator and a hash of the typed structured data, whose
- * encoding is very generic and therefore its implementation in Solidity is not feasible, thus this contract
- * does not implement the encoding itself. Protocols need to implement the type-specific encoding they need in order to
- * produce the hash of their typed data using a combination of `abi.encode` and `keccak256`.
- *
- * This contract implements the EIP-712 domain separator ({_domainSeparatorV4}) that is used as part of the encoding
- * scheme, and the final step of the encoding to obtain the message digest that is then signed via ECDSA
- * ({_hashTypedDataV4}).
- *
- * The implementation of the domain separator was designed to be as efficient as possible while still properly updating
- * the chain id to protect against replay attacks on an eventual fork of the chain.
- *
- * NOTE: This contract implements the version of the encoding known as "v4", as implemented by the JSON RPC method
- * https://docs.metamask.io/guide/signing-data.html[`eth_signTypedDataV4` in MetaMask].
- *
- * NOTE: In the upgradeable version of this contract, the cached values will correspond to the address, and the domain
- * separator of the implementation contract. This will cause the {_domainSeparatorV4} function to always rebuild the
- * separator from the immutable values, which is cheaper than accessing a cached version in cold storage.
- *
- * @custom:oz-upgrades-unsafe-allow state-variable-immutable
- */
-abstract contract EIP712 is IERC5267 {
-    using ShortStrings for *;
-
-    bytes32 private constant TYPE_HASH =
-        keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)");
-
-    // Cache the domain separator as an immutable value, but also store the chain id that it corresponds to, in order to
-    // invalidate the cached domain separator if the chain id changes.
-    bytes32 private immutable _cachedDomainSeparator;
-    uint256 private immutable _cachedChainId;
-    address private immutable _cachedThis;
-
-    bytes32 private immutable _hashedName;
-    bytes32 private immutable _hashedVersion;
-
-    ShortString private immutable _name;
-    ShortString private immutable _version;
-    string private _nameFallback;
-    string private _versionFallback;
-
-    /**
-     * @dev Initializes the domain separator and parameter caches.
-     *
-     * The meaning of `name` and `version` is specified in
-     * https://eips.ethereum.org/EIPS/eip-712#definition-of-domainseparator[EIP-712]:
-     *
-     * - `name`: the user readable name of the signing domain, i.e. the name of the DApp or the protocol.
-     * - `version`: the current major version of the signing domain.
-     *
-     * NOTE: These parameters cannot be changed except through a xref:learn::upgrading-smart-contracts.adoc[smart
-     * contract upgrade].
-     */
-    constructor(string memory name, string memory version) {
-        _name = name.toShortStringWithFallback(_nameFallback);
-        _version = version.toShortStringWithFallback(_versionFallback);
-        _hashedName = keccak256(bytes(name));
-        _hashedVersion = keccak256(bytes(version));
-
-        _cachedChainId = block.chainid;
-        _cachedDomainSeparator = _buildDomainSeparator();
-        _cachedThis = address(this);
-    }
-
-    /**
-     * @dev Returns the domain separator for the current chain.
-     */
-    function _domainSeparatorV4() internal view returns (bytes32) {
-        if (address(this) == _cachedThis && block.chainid == _cachedChainId) {
-            return _cachedDomainSeparator;
-        } else {
-            return _buildDomainSeparator();
-        }
-    }
-
-    function _buildDomainSeparator() private view returns (bytes32) {
-        return keccak256(abi.encode(TYPE_HASH, _hashedName, _hashedVersion, block.chainid, address(this)));
-    }
-
-    /**
-     * @dev Given an already https://eips.ethereum.org/EIPS/eip-712#definition-of-hashstruct[hashed struct], this
-     * function returns the hash of the fully encoded EIP712 message for this domain.
-     *
-     * This hash can be used together with {ECDSA-recover} to obtain the signer of a message. For example:
-     *
-     * ```solidity
-     * bytes32 digest = _hashTypedDataV4(keccak256(abi.encode(
-     *     keccak256("Mail(address to,string contents)"),
-     *     mailTo,
-     *     keccak256(bytes(mailContents))
-     * )));
-     * address signer = ECDSA.recover(digest, signature);
-     * ```
-     */
-    function _hashTypedDataV4(bytes32 structHash) internal view virtual returns (bytes32) {
-        return MessageHashUtils.toTypedDataHash(_domainSeparatorV4(), structHash);
-    }
-
-    /**
-     * @dev See {IERC-5267}.
-     */
-    function eip712Domain()
-        public
-        view
-        virtual
-        returns (
-            bytes1 fields,
-            string memory name,
-            string memory version,
-            uint256 chainId,
-            address verifyingContract,
-            bytes32 salt,
-            uint256[] memory extensions
-        )
-    {
-        return (
-            hex"0f", // 01111
-            _EIP712Name(),
-            _EIP712Version(),
-            block.chainid,
-            address(this),
-            bytes32(0),
-            new uint256[](0)
-        );
-    }
-
-    /**
-     * @dev The name parameter for the EIP712 domain.
-     *
-     * NOTE: By default this function reads _name which is an immutable value.
-     * It only reads from storage if necessary (in case the value is too large to fit in a ShortString).
-     */
-    // solhint-disable-next-line func-name-mixedcase
-    function _EIP712Name() internal view returns (string memory) {
-        return _name.toStringWithFallback(_nameFallback);
-    }
-
-    /**
-     * @dev The version parameter for the EIP712 domain.
-     *
-     * NOTE: By default this function reads _version which is an immutable value.
-     * It only reads from storage if necessary (in case the value is too large to fit in a ShortString).
-     */
-    // solhint-disable-next-line func-name-mixedcase
-    function _EIP712Version() internal view returns (string memory) {
-        return _version.toStringWithFallback(_versionFallback);
-    }
-}
-
-
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v5.0.0) (utils/Nonces.sol)
-pragma solidity ^0.8.20;
-
-/**
- * @dev Provides tracking nonces for addresses. Nonces will only increment.
- */
-abstract contract Nonces {
-    /**
-     * @dev The nonce used for an `account` is not the expected current nonce.
-     */
-    error InvalidAccountNonce(address account, uint256 currentNonce);
-
-    mapping(address account => uint256) private _nonces;
-
-    /**
-     * @dev Returns the next unused nonce for an address.
-     */
-    function nonces(address owner) public view virtual returns (uint256) {
-        return _nonces[owner];
-    }
-
-    /**
-     * @dev Consumes a nonce.
-     *
-     * Returns the current value and increments nonce.
-     */
-    function _useNonce(address owner) internal virtual returns (uint256) {
-        // For each account, the nonce has an initial value of 0, can only be incremented by one, and cannot be
-        // decremented or reset. This guarantees that the nonce never overflows.
-        unchecked {
-            // It is important to do x++ and not ++x here.
-            return _nonces[owner]++;
-        }
-    }
-
-    /**
-     * @dev Same as {_useNonce} but checking that `nonce` is the next valid for `owner`.
-     */
-    function _useCheckedNonce(address owner, uint256 nonce) internal virtual {
-        uint256 current = _useNonce(owner);
-        if (nonce != current) {
-            revert InvalidAccountNonce(owner, current);
-        }
-    }
 }
 
 
@@ -4967,431 +4075,3 @@
      */
     function supportsInterface(bytes4 interfaceId) external view returns (bool);
 }
-
-
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v5.1.0) (utils/cryptography/MessageHashUtils.sol)
-
-pragma solidity ^0.8.20;
-
-import {Strings} from "../Strings.sol";
-
-/**
- * @dev Signature message hash utilities for producing digests to be consumed by {ECDSA} recovery or signing.
- *
- * The library provides methods for generating a hash of a message that conforms to the
- * https://eips.ethereum.org/EIPS/eip-191[ERC-191] and https://eips.ethereum.org/EIPS/eip-712[EIP 712]
- * specifications.
- */
-library MessageHashUtils {
-    /**
-     * @dev Returns the keccak256 digest of an ERC-191 signed data with version
-     * `0x45` (`personal_sign` messages).
-     *
-     * The digest is calculated by prefixing a bytes32 `messageHash` with
-     * `"\x19Ethereum Signed Message:\n32"` and hashing the result. It corresponds with the
-     * hash signed when using the https://eth.wiki/json-rpc/API#eth_sign[`eth_sign`] JSON-RPC method.
-     *
-     * NOTE: The `messageHash` parameter is intended to be the result of hashing a raw message with
-     * keccak256, although any bytes32 value can be safely used because the final digest will
-     * be re-hashed.
-     *
-     * See {ECDSA-recover}.
-     */
-    function toEthSignedMessageHash(bytes32 messageHash) internal pure returns (bytes32 digest) {
-        assembly ("memory-safe") {
-            mstore(0x00, "\x19Ethereum Signed Message:\n32") // 32 is the bytes-length of messageHash
-            mstore(0x1c, messageHash) // 0x1c (28) is the length of the prefix
-            digest := keccak256(0x00, 0x3c) // 0x3c is the length of the prefix (0x1c) + messageHash (0x20)
-        }
-    }
-
-    /**
-     * @dev Returns the keccak256 digest of an ERC-191 signed data with version
-     * `0x45` (`personal_sign` messages).
-     *
-     * The digest is calculated by prefixing an arbitrary `message` with
-     * `"\x19Ethereum Signed Message:\n" + len(message)` and hashing the result. It corresponds with the
-     * hash signed when using the https://eth.wiki/json-rpc/API#eth_sign[`eth_sign`] JSON-RPC method.
-     *
-     * See {ECDSA-recover}.
-     */
-    function toEthSignedMessageHash(bytes memory message) internal pure returns (bytes32) {
-        return
-            keccak256(bytes.concat("\x19Ethereum Signed Message:\n", bytes(Strings.toString(message.length)), message));
-    }
-
-    /**
-     * @dev Returns the keccak256 digest of an ERC-191 signed data with version
-     * `0x00` (data with intended validator).
-     *
-     * The digest is calculated by prefixing an arbitrary `data` with `"\x19\x00"` and the intended
-     * `validator` address. Then hashing the result.
-     *
-     * See {ECDSA-recover}.
-     */
-    function toDataWithIntendedValidatorHash(address validator, bytes memory data) internal pure returns (bytes32) {
-        return keccak256(abi.encodePacked(hex"19_00", validator, data));
-    }
-
-    /**
-     * @dev Return
[truncated — full diff is 62,724 bytes]
> ```

> </details>

> <details>
> <summary>📝 Source diff — upgrade #5 (<code>0x5643...C693</code> → <code>0x0A2D...0f10</code>): +58/-2 lines</summary>

> ```diff
--- old_impl
+++ new_impl
@@ -1,3 +1,59 @@
+// SPDX-License-Identifier: MIT
+// @version 0.2.8
+pragma solidity >=0.8.0;
+/**
+ * ====================================================================
+ * |     ______                   _______                             |
+ * |    / _____________ __  __   / ____(_____  ____ _____  ________   |
+ * |   / /_  / ___/ __ `| |/_/  / /_  / / __ \/ __ `/ __ \/ ___/ _ \  |
+ * |  / __/ / /  / /_/ _>  <   / __/ / / / / / /_/ / / / / /__/  __/  |
+ * | /_/   /_/   \__,_/_/|_|  /_/   /_/_/ /_/\__,_/_/ /_/\___/\___/   |
+ * |                                                                  |
+ * ====================================================================
+ * ========================= FrxUSDCustodian ==========================
+ * ====================================================================
+ * FrxUSD Custodian contract for the Frax protocol to custody tokens at a 1-1 ratio
+ * Frax Finance: https://github.com/FraxFinance
+ */
+import { FrxUSDCustodian, IERC20 } from "src/deps/FrxUSDCustodian.sol";
+
+contract FrxUSDCustodianUsdc is FrxUSDCustodian {
+  address public constant WTGXX_CUSTODIAN_MAINNET = 0x860Cc723935FC9A15fF8b1A94237a711DFeF7857;
+  address public constant WTGXX_MAINNET = 0x1feCF3d9d4Fee7f2c02917A66028a48C6706c179;
+  address public constant ON_RECEIPT_PRIMARY_ORDER_ADDRESS = 0x63a8bb98D70d0aC73460d22b6756528a087ecBf8;
+
+  constructor(address _frxUSD, address _custodianTkn) FrxUSDCustodian(_frxUSD, _custodianTkn) {}
+
+  /// @notice Hook needed to receive WTGXX
+  function onERC721Received(
+    address operator,
+    address from,
+    uint256 tokenId,
+    bytes calldata data
+  ) external pure returns (bytes4) {
+    return FrxUSDCustodianUsdc.onERC721Received.selector;
+  }
+
+  /// @notice Function to faciliate the redemption of WTGXX to USDC
+  /// @param amountWtgxx The amount of wtgxx RWA to redeem for USDC
+  /// @dev Assumes required WTGXX is already present in this contract
+  /// @dev Wisdom tree enforces that sender of asset is recipient of USDC hence this call
+  /// @dev only callable by WTGXX custodian contract in `redeemForUsdcAsync`
+  function redeemWtgxx(uint256 amountWtgxx) public {
+    if (msg.sender != WTGXX_CUSTODIAN_MAINNET) revert OnlyWTGXXCustodian();
+    IERC20 wtgxx = IERC20(WTGXX_MAINNET);
+    wtgxx.transfer(ON_RECEIPT_PRIMARY_ORDER_ADDRESS, amountWtgxx);
+    emit WtgxxRedemptionAsync(amountWtgxx);
+  }
+
+  /// @notice When msg.sender is not WTGXX custodian address
+  error OnlyWTGXXCustodian();
+
+  /// @notice Event Emitted on redemption
+  event WtgxxRedemptionAsync(uint256 wtgxxAmountSent);
+}
+
+
 // SPDX-License-Identifier: MIT
 // @version 0.2.8
 pragma solidity >=0.8.0;
@@ -522,7 +578,7 @@
   /// @param amount           The amount of `custodianTkn`
   /// @param minAmountRwaOut  The minimum amount of rwa out
   /// @param assetToShuffleTo Enum representing the asset we want to shuffle to
-  function shuffleToRwa(uint256 amount, uint256 minAmountRwaOut, uint8 assetToShuffleTo) public {
+  function shuffleToRwa(uint256 amount, uint256 minAmountRwaOut, uint8 assetToShuffleTo) public virtual {
     IRWAIssuer rwaIssuer = IRWAIssuer(0x43415eB6ff9DB7E26A15b704e7A3eDCe97d31C4e);
     address rwaCustodian = 0x5fbAa3A3B489199338fbD85F7E3D444dc0504F33;
     address wtgxxCustodian = 0x860Cc723935FC9A15fF8b1A94237a711DFeF7857;
@@ -549,7 +605,7 @@
   }
 
   /// @notice Extend the legacy abi of the contract
-  function shuffleToRwa(uint256 amount, uint256 minAmountRwaOut) external {
+  function shuffleToRwa(uint256 amount, uint256 minAmountRwaOut) external virtual {
     shuffleToRwa(amount, minAmountRwaOut, 0);
   }
 
> ```

> </details>

> > 💰 **Inherited supply authority** — holds `minter()` on **FrxUSD**. Access controls on this contract gate root token supply.

> 🔒 **Immutable References:** `WTGXX_MAINNET()` → WTGXX, `ON_RECEIPT_PRIMARY_ORDER_ADDRESS()` → EOA, `custodianTkn()` → USDC (FiatTokenProxy)

> ✅ **Two-step admin transfer:** `OZ Ownable2Step` — prevents accidental hand-off (request → accept flow).

### > 🔴 `upgradeability (TransparentUpgradeable)`

> > ⚠️ **CRITICAL** — Upgradeability allows arbitrary code replacement. Must be behind both a Multisig AND a Timelock.

> **Privileged write functions:**  
> **Capabilities:** ⬆️ **UPGRADE**
> - `upgradeTo(address)` — Upgrade proxy implementation to a new address `[UPGRADE]`
> - `upgradeToAndCall(address,bytes)` — Upgrade proxy implementation and call an initializer `[UPGRADE]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xb898Ad2976b4d8f2E21521C9db16b7497825E503` | Compound Timelock (1d) | 🟢 LOW | — | Storage only | 1d delay (⚠ changed 1x) |


> **Delay history for `Compound Timelock (1d)` (0xb898...E503):** 1d → 1d

### > 🟠 `WTGXX_CUSTODIAN_MAINNET()`

> **Privileged write functions:**  
> **Capabilities:** 💰 **SUPPLY**
> - `redeemWtgxx(uint256 amountWtgxx)` — Function to faciliate the redemption of WTGXX to USDC Assumes required WTGXX is already present in this contract Wisdom tree enforces that sender of asset is recipient of USDC hence this call only callable by WTGXX custodian contract in `redeemForUsdcAsync` `[SUPPLY]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x860Cc723935FC9A15fF8b1A94237a711DFeF7857` | TransparentUpgradeableProxy | 🟠 HIGH | — | Storage only |  |

### > 🟠 `frxUSD()`

> **Privileged write functions:**  
> **Capabilities:** 💰 **SUPPLY**
> - `deposit(uint256 _assetsIn, address _receiver)` — Deposit a specified amount of underlying tokens and generate shares. Make sure to approve msg.sender's assets to this contract first. See {IERC4626-deposit} `[SUPPLY]`
> - `mint(uint256 _sharesOut, address _receiver)` — Mint a specified amount of shares using underlying asset tokens. Make sure to approve msg.sender's assets to this contract first. See {IERC4626-mint} `[SUPPLY]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xCAcd6fd266aF91b8AeD52aCCc382b4e165586E29` | frxUSD (TransparentUpgradeableProxy) | 🟠 HIGH | — | Storage only |  |

### > 🟢 `owner()`

> **Privileged write functions:**  
> **Capabilities:** ⚙️ **CONFIG** 💰 **SUPPLY**
> - `setMintRedeemFee(uint256 _mintFee, uint _redeemFee)` — Set the fee for the contract on mint|deposit/redeem|withdraw flow
> - `recoverERC20(address _tokenAddress, uint256 _tokenAmount)` — Added to support tokens
> - `setMintCap(uint256 _mintCap)` — Set the mint cap for frxUSD minting `[SUPPLY]`
> - `setApprovedOperator(address _operator, bool _status)` — Set the status for a custodian operator only callable via `owner`
> - `setMinAfterShuffle(uint256 _minAfterShuffle)` — Set the `minAfterShuffle` variable after the call to `shuffleToRwa` only callable via `owner`
> - `transferOwnership(address newOwner)` — Starts the ownership transfer of the contract to a new account. Replaces the pending transfer if there is one. Can only be called by the current owner.
> - `renounceOwnership()` — Leaves the contract without owner. It will not be possible to call `onlyOwner` functions. Can only be called by the current owner.
> - `acceptOwnership()` — Second step of `OZ Ownable2Step` — callable by the pending holder set via `transferOwnership`, not by the current role. Included here to surface the full transfer handoff. `[CONFIG]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xfFFffF4F3baC444b2C0ecf2A1840d018bE783937` | Gnosis Safe 4/7 | 🟢 LOW | — | Storage+Events | 4/7 signers |

> **Signers of `Gnosis Safe 4/7` (0xfFFf...3937):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x6933BCC3e96f1C4d2cb73Cb391d854b18Ab7A4F2` | EOA ⚠️ Hot wallet (1,993 txs) | — | EOA |
> | `0xcbc616D595D38483e6AdC45C7E426f44bF230928` | EOA ⚠️ Hot wallet (1,092 txs) | — | EOA |
> | `0x17e06ce6914E3969f7BD37D8b2a563890cA1c96e` | EOA ⚠️ Hot wallet (2,122 txs) | — | EOA |
> | `0xc8dE9f45601DA8C76158b8CAF3E56E8A037F2228` | EOA | — | EOA |
> | `0x6e74053a3798e0fC9a9775F7995316b27f21c4D2` | EOA ⚠️ Hot wallet (4,940 txs) | — | EOA |
> | `0xDf41722D7b1355dB08D4e7D0528fE9c82377Bb37` | EOA | — | EOA |
> | `0xC6EF452b0de9E95Ccb153c2A5A7a90154aab3419` | EOA | — | EOA |

### > 🟢 `pendingOwner()`


> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xfFFffF4F3baC444b2C0ecf2A1840d018bE783937` | Gnosis Safe 4/7 | 🟢 LOW | — | Events only | 4/7 signers |

> **Signers of `Gnosis Safe 4/7` (0xfFFf...3937):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x6933BCC3e96f1C4d2cb73Cb391d854b18Ab7A4F2` | EOA ⚠️ Hot wallet (1,993 txs) | — | EOA |
> | `0xcbc616D595D38483e6AdC45C7E426f44bF230928` | EOA ⚠️ Hot wallet (1,092 txs) | — | EOA |
> | `0x17e06ce6914E3969f7BD37D8b2a563890cA1c96e` | EOA ⚠️ Hot wallet (2,122 txs) | — | EOA |
> | `0xc8dE9f45601DA8C76158b8CAF3E56E8A037F2228` | EOA | — | EOA |
> | `0x6e74053a3798e0fC9a9775F7995316b27f21c4D2` | EOA ⚠️ Hot wallet (4,940 txs) | — | EOA |
> | `0xDf41722D7b1355dB08D4e7D0528fE9c82377Bb37` | EOA | — | EOA |
> | `0xC6EF452b0de9E95Ccb153c2A5A7a90154aab3419` | EOA | — | EOA |

> #### 🔧 Permissioned Parameters

> **`isApprovedOperator`** *(per-asset)*

> | Asset | Current Value |
> |---|---|
> | EOA `0x9032...bc6F` | `False` |
> | EOA `0xb84c...7D94` | `True` |

> | Field | Value |
> |---|---|
> | Setter | `setApprovedOperator(address _operator, bool _status)` |
> | Gated by | `owner()` |
> | Tags | — |
> | Last changed | 2026-06-15 |
> | Changed by | `0xfFFf...3937` (Gnosis Safe 4/7) |
> | Total changes | 1 |

> **Recent changes:**

> | # | Asset | Value | Set By | Date |
> |---|---|---|---|---|
> | 1 | EOA | `_status=False` | `0xfFFf...3937` (Gnosis Safe 4/7) | 2026-06-15 |

> **`minAfterShuffle`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)* 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `500000000000` |
> | Setter | `setMinAfterShuffle(uint256 _minAfterShuffle)` |
> | Gated by | `owner()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`mintCap`** 🔄 **ACTIVE** (9 changes)

> > ⚠️ This parameter has been changed **9 times** — monitor for unexpected modifications.

> | Field | Value |
> |---|---|
> | Current Value | `400000000000000000000000000 (400,000,000.000000e18)` |
> | Setter | `setMintCap(uint256 _mintCap)` |
> | Gated by | `owner()` |
> | Tags | `SUPPLY` |
> | Last changed | 2026-03-19 |
> | Changed by | `0x6933...A4F2` (EOA) |
> | Total changes | 9 🔄 |

> **Recent changes (showing last 5 of 9):**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `400000000000000000000000000 (400,000,000.000000e18)` | `0x6933...A4F2` (EOA) | 2026-03-19 |
> | 2 | `_mintCap=200000000000000000000000000 (200,000,000.000000e18)` | `0xB174...3f27` (Gnosis Safe 3/5) | 2025-10-23 |
> | 3 | `_mintCap=200000000000000000000000000 (200,000,000.000000e18)` | `0xB174...3f27` (Gnosis Safe 3/5) | 2025-10-23 |
> | 4 | `_mintCap=200000000000000000000000000 (200,000,000.000000e18)` | `0xB174...3f27` (Gnosis Safe 3/5) | 2025-10-23 |
> | 5 | `200000000000000000000000000 (200,000,000.000000e18)` | `0x17e0...c96e` (EOA) | 2025-10-23 |

> **`mintFee`** ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `0` |
> | Setter | `setMintRedeemFee(uint256 _mintFee, uint _redeemFee)` |
> | Gated by | `owner()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> #### 💰 Supply Actions

> _Mint / redeem / burn call tracking — last 5 calls per function, total counts preserved._

> **`deposit`** *(per-asset)* 🔄 **ACTIVE** (1807 changes)

> > ⚠️ This parameter has been changed **1807 times** — monitor for unexpected modifications.

> | Field | Value |
> |---|---|
> | Setter | `deposit(uint256 _assetsIn, address _receiver)` |
> | Gated by | `frxUSD()` |
> | Tags | `SUPPLY` |
> | Last called | 2026-06-25 |
> | Called by | `0x1D48...11f6` |
> | Total calls | ≥1807 🔄 |

> **Recent changes (showing last 5 of 1807):**

> | # | Asset | Value | Set By | Date |
> |---|---|---|---|---|
> | 1 | 0x9640...c426 | `510865859000000000000 (510.865859e18)` | `0x1D48...11f6` | 2026-06-25 |
> | 2 | 0x8F10...f996 | `481547673000000000000 (481.547673e18)` | `0xBf16...5D94` | 2026-06-25 |
> | 3 | 0x950f...A86F | `215075276000000000000 (215.075276e18)` | `0xA66F...43bF` | 2026-06-25 |
> | 4 | 0x8F10...f996 | `66000000000000000000000 (66,000.000000e18)` | `0xA784...d46C` | 2026-06-25 |
> | 5 | 0x3650...B5b8 | `891929415000000000000 (891.929415e18)` | `0xAa20...5F2d` | 2026-06-25 |

> **`mint`** *(per-asset)* 🔄 **ACTIVE** (6 changes) 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > ⚠️ This parameter has been changed **6 times** — monitor for unexpected modifications.

> | Field | Value |
> |---|---|
> | Setter | `mint(uint256 _sharesOut, address _receiver)` |
> | Gated by | `frxUSD()` |
> | Tags | `SUPPLY` |
> | Last called | 2026-03-27 |
> | Called by | `0x52B4...12A6` |
> | Total calls | 6 🔄 |

> **Recent changes (showing last 5 of 6):**

> | # | Asset | Value | Set By | Date |
> |---|---|---|---|---|
> | 1 | EOA | `23889020000000000000 (23.889020e18)` | `0x52B4...12A6` | 2026-03-27 |
> | 2 | EOA | `500000000000000000000000 (500,000.000000e18)` | `0x72f9...F9EF` | 2026-03-13 |
> | 3 | EOA | `1000000000000000000000000 (1,000,000.000000e18)` | `0x4393...DE05` | 2026-02-13 |
> | 4 | EOA | `10000000000000000000000000 (10,000,000.000000e18)` | `0xeF64...9a57` | 2025-10-24 |
> | 5 | EOA | `1000000000000000000 (1.000000e18)` | `0x4274...9C68` | 2025-10-22 |

> **`redeemWtgxx`** ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Setter | `redeemWtgxx(uint256 amountWtgxx)` |
> | Gated by | `WTGXX_CUSTODIAN_MAINNET()` |
> | Tags | `SUPPLY` |
> | Last called | — |
> | Called by | — |
> | Total calls | 0 ❄️ |

---
<a id="c-0x566a6442a5a6e9895b9dca97cc7879d632c6e4b0"></a>
## > FraxOFTMintableAdapterUpgradeable `0x566a6442A5A6e9895B9dCA97cC7879D632c6e4B0`

> > ⚠️ **Upgradeable** (TransparentUpgradeable) — impl: `0x175e4B98075c81511E476c0c5446ddA95d9106c8`

> **Proxy History (5 events):**

> | # | Date | Event | Address | Key Changes | Tx |
> |---|---|---|---|---|---|
> | 1 | 2025-02-04 | Upgrade | `0x8f1B...6250` | Initial deployment | [0xbc59cd85c6cbaa9dfdeb2f9f69c6aaeb3ee9ec5f8b994ac2a1595fc27f3ecfd9](https://etherscan.io/tx/0xbc59cd85c6cbaa9dfdeb2f9f69c6aaeb3ee9ec5f8b994ac2a1595fc27f3ecfd9) |
> | 2 | 2025-02-04 | Upgrade | `0xb414...C225` | +6 fn; added `allowInitializePath((uint32,bytes32,uint64))`; added `initialize(address)`; added `owner()`; added `renounceOwnership()`; added `setDelegate(address)`; added `transferOwnership(address)` | [0x6c3767774813dcb6ce1e40f14c14d20cbec3278114af957260d3d3349dad1679](https://etherscan.io/tx/0x6c3767774813dcb6ce1e40f14c14d20cbec3278114af957260d3d3349dad1679) |
> | 3 | 2025-02-04 | Admin Changed | `0x0990...814b` | Previous: `0x0000...0000` | [0xbc59cd85c6cbaa9dfdeb2f9f69c6aaeb3ee9ec5f8b994ac2a1595fc27f3ecfd9](https://etherscan.io/tx/0xbc59cd85c6cbaa9dfdeb2f9f69c6aaeb3ee9ec5f8b994ac2a1595fc27f3ecfd9) |
> | 4 | 2025-02-04 | Admin Changed | `0x223a...405c` | Previous: `0x0990...814b` | [0xcfb532834143a3880af7620456a582bf3b563ad4c449bc8d7e2e67fd0c59ead6](https://etherscan.io/tx/0xcfb532834143a3880af7620456a582bf3b563ad4c449bc8d7e2e67fd0c59ead6) |
> | 5 | 2025-10-16 | Upgrade | `0x175e...06c8` | +6 fn; added `totalTransferFrom(uint32)`; added `totalTransferFromSum()`; added `totalTransferTo(uint32)`; added `totalTransferToSum()`; added `totalTransfers(uint32)`; added `totalTransfersAndInitialTotalSupply(uint32)`; -1 fn; removed `initialize(address)`; 📝 src +214/-18 | [0xe795bc10ed1655920cbbeb147c4f4599519d0cdae4e0279e9ae80e1b03b04bc7](https://etherscan.io/tx/0xe795bc10ed1655920cbbeb147c4f4599519d0cdae4e0279e9ae80e1b03b04bc7) |

> <details>
> <summary>📝 Source diff — upgrade #5 (<code>0xb414...C225</code> → <code>0x175e...06c8</code>): +214/-18 lines</summary>

> ```diff
--- old_impl
+++ new_impl
@@ -2,27 +2,69 @@
 pragma solidity ^0.8.22;
 
 import { OFTAdapterUpgradeable } from "@fraxfinance/layerzero-v2-upgradeable/oapp/contracts/oft/OFTAdapterUpgradeable.sol";
-
-contract FraxOFTAdapterUpgradeable is OFTAdapterUpgradeable {
+import { SupplyTrackingModule } from "./modules/SupplyTrackingModule.sol";
+
+interface IERC20PermitPermissionedOptiMintable {
+    function minter_burn_from(address, uint256) external;
+    function minter_mint(address, uint256) external;
+}
+
+contract FraxOFTMintableAdapterUpgradeable is OFTAdapterUpgradeable, SupplyTrackingModule {
     constructor(
         address _token,
         address _lzEndpoint
-    ) OFTAdapterUpgradeable(_token, _lzEndpoint) {}
-
-    function version() external pure returns (uint256 major, uint256 minor, uint256 patch) {
-        major = 1;
-        minor = 0;
-        patch = 0;
-    }
-
-    // Admin
-
-    function initialize(address _delegate) external initializer {
-        __OFTCore_init(_delegate);
-        __Ownable_init();
-        _transferOwnership(_delegate);
-    }
-}
+    ) OFTAdapterUpgradeable(_token, _lzEndpoint) {
+        _disableInitializers();
+    }
+
+    function version() public pure returns (string memory) {
+        return "1.1.0";
+    }
+
+    /// @notice Recover all tokens to owner
+    /// @dev added in v1.1.0
+    function recover() external {
+        uint256 balance = innerToken.balanceOf(address(this));
+        if (balance == 0) return;
+
+        innerToken.transfer(owner(), balance);
+    }
+
+    /// @notice Set the initial total supply for a given chain ID
+    /// @dev added in v1.1.0
+    function setInitialTotalSupply(uint32 _eid, uint256 _amount) external onlyOwner {
+        _setInitialTotalSupply(_eid, _amount);
+    }
+
+    /// @dev overrides OFTAdapterUpgradeable.sol to burn the tokens from the sender/track supply
+    /// @dev added in v1.1.0
+    function _debit(
+        uint256 _amountLD,
+        uint256 _minAmountLD,
+        uint32 _dstEid
+    ) internal override returns (uint256 amountSentLD, uint256 amountReceivedLD) {
+        (amountSentLD, amountReceivedLD) = _debitView(_amountLD, _minAmountLD, _dstEid);
+
+        _addToTotalTransferTo(_dstEid, amountSentLD);
+
+        IERC20PermitPermissionedOptiMintable(address(innerToken)).minter_burn_from(msg.sender, amountSentLD);
+    }
+
+    /// @dev overrides OFTAdapterUpgradeable to mint the tokens to the sender/track supply
+    /// @dev added in v1.1.0
+    function _credit(
+        address _to,
+        uint256 _amountLD,
+        uint32 _srcEid
+    ) internal override returns (uint256 amountReceivedLD) {
+
+        _addToTotalTransferFrom(_srcEid, _amountLD);
+
+        IERC20PermitPermissionedOptiMintable(address(innerToken)).minter_mint(_to, _amountLD);
+        return _amountLD;
+    }
+}
+
 
 // SPDX-License-Identifier: MIT
 
@@ -155,6 +197,160 @@
     }
 }
 
+
+pragma solidity ^0.8.0;
+
+/**
+ * @title SupplyTrackingModule
+ * @notice Contract module to track circulating supply of an OFT across all destination chains
+*/
+abstract contract SupplyTrackingModule {
+
+    struct SupplyTrackingStorage {
+        uint256 totalTransferFromSum;
+        uint256 totalTransferToSum;
+        mapping(uint32 eid => uint256 amount) totalTransferFrom;
+        mapping(uint32 eid => uint256 amount) totalTransferTo;
+        mapping(uint32 eid => uint256 totalSupply) initialTotalSupply;
+    }
+
+    /// @dev keccak256(abi.encode(uint256(keccak256("frax.storage.SupplyTrackingModule")) - 1)) & ~bytes32(uint256(0xff))
+    bytes32 private constant SupplyTrackingStorageLocation = 0x419276e85a544278a01dfd89b03028910afb9d04e0edf9a7b0d319d61e5bb200;
+
+    function _getSupplyTrackingStorage() private pure returns (SupplyTrackingStorage storage $) {
+        assembly {
+            $.slot := SupplyTrackingStorageLocation
+        }
+    }
+
+    // Setters
+
+    function _addToTotalTransferFrom(uint32 _eid, uint256 _amount) internal {
+        SupplyTrackingStorage storage $ = _getSupplyTrackingStorage();
+
+        uint256 previousTotalTransferFromEid = $.totalTransferFrom[_eid];
+        uint256 previousTotalTransferFromSum = $.totalTransferFromSum;
+
+        $.totalTransferFrom[_eid] += _amount;
+        $.totalTransferFromSum += _amount;
+
+        emit AddToTotalTransferFromEid(_eid, previousTotalTransferFromEid, _amount);
+        emit AddToTotalTransferFromSum(previousTotalTransferFromSum, _amount);
+    }
+
+    function _addToTotalTransferTo(uint32 _eid, uint256 _amount) internal {
+        SupplyTrackingStorage storage $ = _getSupplyTrackingStorage();
+
+        uint256 previousTotalTransferToEid = $.totalTransferTo[_eid];
+        uint256 previousTotalTransferToSum = $.totalTransferToSum;
+
+        $.totalTransferTo[_eid] += _amount;
+        $.totalTransferToSum += _amount;
+
+        emit AddToTotalTransferToEid(_eid, previousTotalTransferToEid, _amount);
+        emit AddToTotalTransferToSum(previousTotalTransferToSum, _amount);
+    }
+
+    function _setInitialTotalSupply(uint32 _eid, uint256 _amount) internal {
+        SupplyTrackingStorage storage $ = _getSupplyTrackingStorage();
+        $.initialTotalSupply[_eid] = _amount;
+        // reset the transfer amounts for the EID as well as initialTotalSupply == current supply,
+        // which means there should be no pre-existing transferFrom/transferTo
+        $.totalTransferFrom[_eid] = 0;
+        $.totalTransferTo[_eid] = 0;
+
+        emit SetInitialTotalSupply(_eid, _amount);
+    }
+
+    // Views
+
+    /// @notice Get the total amount transferred to all target chains
+    /// @return The total amount transferred to all target chains
+    function totalTransferToSum() external view returns (uint256) {
+        SupplyTrackingStorage storage $ = _getSupplyTrackingStorage();
+        return $.totalTransferToSum;
+    }
+
+    /// @notice Get the total amount transferred from all target chains
+    /// @return The total amount transferred from all target chains
+    function totalTransferFromSum() external view returns (uint256) {
+        SupplyTrackingStorage storage $ = _getSupplyTrackingStorage();
+        return $.totalTransferFromSum;
+    }
+
+    /// @notice Get the total amount transferred to a given target chain
+    /// @param _eid The target chain EID
+    /// @return The total amount transferred to the target chain
+    function totalTransferFrom(uint32 _eid) external view returns (uint256) {
+        SupplyTrackingStorage storage $ = _getSupplyTrackingStorage();
+        return $.totalTransferFrom[_eid];
+    }
+
+    /// @notice Get the total amount transferred from a given target chain to this chain
+    /// @param _eid The target chain EID
+    /// @return The total amount transferred from the target chain to this chain
+    function totalTransferTo(uint32 _eid) external view returns (uint256) {
+        SupplyTrackingStorage storage $ = _getSupplyTrackingStorage();
+        return $.totalTransferTo[_eid];
+    }
+
+    /// @notice Get the total transfers to and from a given chain ID
+    /// @param _eid The chain ID
+    /// @return from The total amount transferred from the chain ID
+    /// @return to The total amount transferred to the chain ID
+    function totalTransfers(uint32 _eid) external view returns (uint256 from, uint256 to) {
+        SupplyTrackingStorage storage $ = _getSupplyTrackingStorage();
+        to = $.totalTransferTo[_eid];
+        from = $.totalTransferFrom[_eid];
+    }
+
+    /// @notice Get the total transfers to and from a given chain ID and the initial total supply
+    /// @param _eid The chain ID
+    /// @return from The total amount transferred from the chain ID
+    /// @return to The total amount transferred to the chain ID
+    /// @return initialTotalSupply_ The initial total supply for the chain ID
+    function totalTransfersAndInitialTotalSupply(uint32 _eid) external view returns (
+        uint256 from,
+        uint256 to,
+        uint256 initialTotalSupply_
+    ) {
+        SupplyTrackingStorage storage $ = _getSupplyTrackingStorage();
+        to = $.totalTransferTo[_eid];
+        from = $.totalTransferFrom[_eid];
+        initialTotalSupply_ = $.initialTotalSupply[_eid];
+    }
+
+    /// @notice Get the initial total supply for a given chain ID
+    /// @param _eid The chain ID
+    /// @return The initial total supply for the chain ID
+    function initialTotalSupply(uint32 _eid) external view returns (uint256) {
+        SupplyTrackingStorage storage $ = _getSupplyTrackingStorage();
+        return $.initialTotalSupply[_eid];
+    }
+
+    /// @notice Get the expected total supply given the initial supply and inflows/outflows
+    /// @dev This may underflow for chains that are not hub-connected to Fraxtal as inflows/outflows will disconnect
+    ///       if there are additional flows with non-Fraxtal chains. Therefore, only trust this for hub-chains
+    function totalSupply(uint32 _eid) external view returns (uint256) {
+        SupplyTrackingStorage storage $ = _getSupplyTrackingStorage();
+        return $.initialTotalSupply[_eid] + $.totalTransferTo[_eid] - $.totalTransferFrom[_eid];
+    }
+
+    /// @notice Event emitted when adding to totalTransferFrom[eid]
+    event AddToTotalTransferFromEid(uint32 indexed eid, uint256 previousTotalAmount, uint256 amount);
+
+    /// @notice Event emitted when adding to totalTransferFromSum
+    event AddToTotalTransferFromSum(uint256 previousTotalAmount, uint256 amount);
+
+    /// @notice Event emitted when adding to totalTransferTo[eid]
+    event AddToTotalTransferToEid(uint32 indexed eid, uint256 previousTotalAmount, uint256 amount);
+
+    /// @notice Event emitted when adding to totalTransferToSum
+    event AddToTotalTransferToSum(uint256 previousTotalAmount, uint256 amount);
+
+    /// @notice Event emitted when calling `_setInitialTotalSupply()`
+    event SetInitialTotalSupply(uint32 indexed eid, uint256 amount);
+}
 
 // SPDX-License-Identifier: MIT
 // OpenZeppelin Contracts v4.4.1 (token/ERC20/extensions/IERC20Metadata.sol)
> ```

> </details>

> > 💰 **Inherited supply authority** — holds `minter()` on **FrxUSD**. Access controls on this contract gate root token supply.

> 🔒 **Immutable References:** `composeMsgSender()` → TransparentUpgradeableProxy, `oApp()` → TransparentUpgradeableProxy

> #### 🌉 LayerZero v2 — Cross-chain Verifier (DVN) Config

> > Endpoint `0x1a44...728c` · 0 peer(s)

> > _No peers configured — OFT surface exists but is dormant._

### > 🔴 `upgradeability (TransparentUpgradeable)`

> > ⚠️ **CRITICAL** — Upgradeability allows arbitrary code replacement. Must be behind both a Multisig AND a Timelock.

> **Privileged write functions:**  
> **Capabilities:** ⬆️ **UPGRADE**
> - `upgradeTo(address)` — Upgrade proxy implementation to a new address `[UPGRADE]`
> - `upgradeToAndCall(address,bytes)` — Upgrade proxy implementation and call an initializer `[UPGRADE]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xb898Ad2976b4d8f2E21521C9db16b7497825E503` | Compound Timelock (1d) | 🟢 LOW | — | Storage only | 1d delay (⚠ changed 1x) |


> **Delay history for `Compound Timelock (1d)` (0xb898...E503):** 1d → 1d

### > 🟢 `owner()`

> **Privileged write functions:**
> - `setInitialTotalSupply(uint32 _eid, uint256 _amount)` — Set the initial total supply for a given chain ID added in v1.1.0
> - `setMsgInspector(address _msgInspector)` — Sets the message inspector address for the OFT. This is an optional contract that can be used to inspect both 'message' and 'options'.
> - `setEnforcedOptions(EnforcedOptionParam[] calldata _enforcedOptions)` — Sets the enforced options for specific endpoint and message type combinations. Only the owner/admin of the OApp can call this function.
> - `setPreCrime(address _preCrime)` — Sets the preCrime contract address. /
> - `setPeer(uint32 _eid, bytes32 _peer)` — Sets the peer address (OApp instance) for a corresponding endpoint. Only the owner/admin of the OApp can call this function.
> - `setDelegate(address _delegate)` — Sets the delegate address for the OApp. Only the owner/admin of the OApp can call this function.
> - `renounceOwnership()` — Leaves the contract without owner. It will not be possible to call `onlyOwner` functions. Can only be called by the current owner.
> - `transferOwnership(address newOwner)` — Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner.

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xfFFffF4F3baC444b2C0ecf2A1840d018bE783937` | Gnosis Safe 4/7 | 🟢 LOW | — | Storage+Events | 4/7 signers |

> **Signers of `Gnosis Safe 4/7` (0xfFFf...3937):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x6933BCC3e96f1C4d2cb73Cb391d854b18Ab7A4F2` | EOA ⚠️ Hot wallet (1,993 txs) | — | EOA |
> | `0xcbc616D595D38483e6AdC45C7E426f44bF230928` | EOA ⚠️ Hot wallet (1,092 txs) | — | EOA |
> | `0x17e06ce6914E3969f7BD37D8b2a563890cA1c96e` | EOA ⚠️ Hot wallet (2,122 txs) | — | EOA |
> | `0xc8dE9f45601DA8C76158b8CAF3E56E8A037F2228` | EOA | — | EOA |
> | `0x6e74053a3798e0fC9a9775F7995316b27f21c4D2` | EOA ⚠️ Hot wallet (4,940 txs) | — | EOA |
> | `0xDf41722D7b1355dB08D4e7D0528fE9c82377Bb37` | EOA | — | EOA |
> | `0xC6EF452b0de9E95Ccb153c2A5A7a90154aab3419` | EOA | — | EOA |

### > 🟠 `endpoint()`

> **Privileged write functions:**
> - `send(SendParam calldata _sendParam, MessagingFee calldata _fee, address _refundAddress)` — Executes the send operation. - nativeFee: The native fee.

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x1a44076050125825900e736c501f859c50fE728c` | EndpointV2 | 🟠 HIGH | — | Storage only |  |

> #### 🔧 Permissioned Parameters

> **`msgInspector`** ❄️ **DORMANT**

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `0x0000000000000000000000000000000000000000` |
> | Setter | `setMsgInspector(address _msgInspector)` |
> | Gated by | `owner()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`preCrime`** ❄️ **DORMANT**

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `0x0000000000000000000000000000000000000000` |
> | Setter | `setPreCrime(address _preCrime)` |
> | Gated by | `owner()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

---
<a id="c-0x5fbaa3a3b489199338fbd85f7e3d444dc0504f33"></a>
## > FrxUSDCustodianWithOracle `0x5fbAa3A3B489199338fbD85F7E3D444dc0504F33`

> > ⚠️ **Upgradeable** (TransparentUpgradeable) — impl: `0x7617E69d47C1c18E2E3bB0b470aa0fbBD45b57DA`

> **Proxy History (2 events):**

> | # | Date | Event | Address | Key Changes | Tx |
> |---|---|---|---|---|---|
> | 1 | 2025-01-29 | Upgrade | `0x7617...57DA` | Initial deployment | [0x22e44ab0b8eec70d8996a22fe5cff41f542966a51620e6678740c5128301ac8d](https://etherscan.io/tx/0x22e44ab0b8eec70d8996a22fe5cff41f542966a51620e6678740c5128301ac8d) |
> | 2 | 2025-01-29 | Admin Changed | `0x3046...4aEB` | Previous: `0x0000...0000` | [0x22e44ab0b8eec70d8996a22fe5cff41f542966a51620e6678740c5128301ac8d](https://etherscan.io/tx/0x22e44ab0b8eec70d8996a22fe5cff41f542966a51620e6678740c5128301ac8d) |

> > 💰 **Inherited supply authority** — holds `minter()` on **FrxUSD**. Access controls on this contract gate root token supply.

> 🔒 **Immutable References:** `custodianTkn()` → USTB (TransparentUpgradeableProxy)

> ✅ **Two-step admin transfer:** `OZ Ownable2Step` — prevents accidental hand-off (request → accept flow).

### > 🔴 `upgradeability (TransparentUpgradeable)`

> > ⚠️ **CRITICAL** — Upgradeability allows arbitrary code replacement. Must be behind both a Multisig AND a Timelock.

> **Privileged write functions:**  
> **Capabilities:** ⬆️ **UPGRADE**
> - `upgradeTo(address)` — Upgrade proxy implementation to a new address `[UPGRADE]`
> - `upgradeToAndCall(address,bytes)` — Upgrade proxy implementation and call an initializer `[UPGRADE]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xb898Ad2976b4d8f2E21521C9db16b7497825E503` | Compound Timelock (1d) | 🟢 LOW | — | Storage only | 1d delay (⚠ changed 1x) |


> **Delay history for `Compound Timelock (1d)` (0xb898...E503):** 1d → 1d

### > 🟠 `frxUSD()`

> **Privileged write functions:**  
> **Capabilities:** 💰 **SUPPLY**
> - `deposit(uint256 _assetsIn, address _receiver)` — Deposit a specified amount of underlying tokens and generate shares. Make sure to approve msg.sender's assets to this contract first. See {IERC4626-deposit} Override with updateOracle modifier `[SUPPLY]`
> - `mint(uint256 _sharesOut, address _receiver)` — Mint a specified amount of shares using underlying asset tokens. Make sure to approve msg.sender's assets to this contract first. See {IERC4626-mint} Override with updateOracle modifier `[SUPPLY]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xCAcd6fd266aF91b8AeD52aCCc382b4e165586E29` | frxUSD (TransparentUpgradeableProxy) | 🟠 HIGH | — | Storage only |  |

### > 🟢 `owner()`

> **Privileged write functions:**  
> **Capabilities:** ⚙️ **CONFIG** 💰 **SUPPLY**
> - `setCustodianOracle(address _custodianOracle, uint256 _maximumOracleDelay)` — Sets the custodian oracle
> - `setMintRedeemFee(uint256 _mintFee, uint _redeemFee)` — Set the fee for the contract on mint|deposit/redeem|withdraw flow
> - `recoverERC20(address _tokenAddress, uint256 _tokenAmount)` — Added to support tokens
> - `setMintCap(uint256 _mintCap)` — Set the mint cap for frxUSD minting `[SUPPLY]`
> - `transferOwnership(address newOwner)` — Starts the ownership transfer of the contract to a new account. Replaces the pending transfer if there is one. Can only be called by the current owner.
> - `renounceOwnership()` — Leaves the contract without owner. It will not be possible to call `onlyOwner` functions. Can only be called by the current owner.
> - `acceptOwnership()` — Second step of `OZ Ownable2Step` — callable by the pending holder set via `transferOwnership`, not by the current role. Included here to surface the full transfer handoff. `[CONFIG]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xfFFffF4F3baC444b2C0ecf2A1840d018bE783937` | Gnosis Safe 4/7 | 🟢 LOW | — | Storage+Events | 4/7 signers |

> **Signers of `Gnosis Safe 4/7` (0xfFFf...3937):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x6933BCC3e96f1C4d2cb73Cb391d854b18Ab7A4F2` | EOA ⚠️ Hot wallet (1,993 txs) | — | EOA |
> | `0xcbc616D595D38483e6AdC45C7E426f44bF230928` | EOA ⚠️ Hot wallet (1,092 txs) | — | EOA |
> | `0x17e06ce6914E3969f7BD37D8b2a563890cA1c96e` | EOA ⚠️ Hot wallet (2,122 txs) | — | EOA |
> | `0xc8dE9f45601DA8C76158b8CAF3E56E8A037F2228` | EOA | — | EOA |
> | `0x6e74053a3798e0fC9a9775F7995316b27f21c4D2` | EOA ⚠️ Hot wallet (4,940 txs) | — | EOA |
> | `0xDf41722D7b1355dB08D4e7D0528fE9c82377Bb37` | EOA | — | EOA |
> | `0xC6EF452b0de9E95Ccb153c2A5A7a90154aab3419` | EOA | — | EOA |

### > 🟠 `custodianOracle()` · 📋 operational


> **Members (1):**

> | Address | Name / Type | Granted | Source | Details |
> |---|---|---|---|---|
> | `0xE4fA682f94610cCd170680cc3B045d77D9E528a8` | SuperstateOracle | — | Storage only |  |

### > 🟢 `pendingOwner()`


> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xfFFffF4F3baC444b2C0ecf2A1840d018bE783937` | Gnosis Safe 4/7 | 🟢 LOW | — | Events only | 4/7 signers |

> **Signers of `Gnosis Safe 4/7` (0xfFFf...3937):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x6933BCC3e96f1C4d2cb73Cb391d854b18Ab7A4F2` | EOA ⚠️ Hot wallet (1,993 txs) | — | EOA |
> | `0xcbc616D595D38483e6AdC45C7E426f44bF230928` | EOA ⚠️ Hot wallet (1,092 txs) | — | EOA |
> | `0x17e06ce6914E3969f7BD37D8b2a563890cA1c96e` | EOA ⚠️ Hot wallet (2,122 txs) | — | EOA |
> | `0xc8dE9f45601DA8C76158b8CAF3E56E8A037F2228` | EOA | — | EOA |
> | `0x6e74053a3798e0fC9a9775F7995316b27f21c4D2` | EOA ⚠️ Hot wallet (4,940 txs) | — | EOA |
> | `0xDf41722D7b1355dB08D4e7D0528fE9c82377Bb37` | EOA | — | EOA |
> | `0xC6EF452b0de9E95Ccb153c2A5A7a90154aab3419` | EOA | — | EOA |

> #### 🔧 Permissioned Parameters

> **`custodianOracle`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)* 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `0xE4fA682f94610cCd170680cc3B045d77D9E528a8` |
> | Setter | `setCustodianOracle(address _custodianOracle, uint256 _maximumOracleDelay)` |
> | Gated by | `owner()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`mintCap`**

> | Field | Value |
> |---|---|
> | Current Value | `5000000000000000000000000 (5,000,000.000000e18)` |
> | Setter | `setMintCap(uint256 _mintCap)` |
> | Gated by | `owner()` |
> | Tags | `SUPPLY` |
> | Last changed | 2025-04-16 |
> | Changed by | `0xB174...3f27` (Gnosis Safe 3/5) |
> | Total changes | 4 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `_mintCap=5000000000000000000000000 (5,000,000.000000e18)` | `0xB174...3f27` (Gnosis Safe 3/5) | 2025-04-16 |
> | 2 | `_mintCap=5000000000000000000000000 (5,000,000.000000e18)` | `0xB174...3f27` (Gnosis Safe 3/5) | 2025-04-16 |
> | 3 | `_mintCap=5000000000000000000000000 (5,000,000.000000e18)` | `0xB174...3f27` (Gnosis Safe 3/5) | 2025-04-16 |
> | 4 | `5000000000000000000000000 (5,000,000.000000e18)` | `0x6933...A4F2` (EOA) | 2025-04-16 |

> **`mintFee`** ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `0` |
> | Setter | `setMintRedeemFee(uint256 _mintFee, uint _redeemFee)` |
> | Gated by | `owner()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> #### 💰 Supply Actions

> _Mint / redeem / burn call tracking — last 5 calls per function, total counts preserved._

> **`deposit`** *(per-asset)*

> | Field | Value |
> |---|---|
> | Setter | `deposit(uint256 _assetsIn, address _receiver)` |
> | Gated by | `frxUSD()` |
> | Tags | `SUPPLY` |
> | Last called | 2026-03-27 |
> | Called by | `0x17e0...c96e` (EOA) |
> | Total calls | 4 |

> **Recent changes:**

> | # | Asset | Value | Set By | Date |
> |---|---|---|---|---|
> | 1 | Gnosis Safe 3/5 | `490000000000000000000000 (490,000.000000e18)` | `0x17e0...c96e` (EOA) | 2026-03-27 |
> | 2 | EOA | `31572768770000000000 (31.572769e18)` | `0x4051...CA25` | 2025-08-06 |
> | 3 | EOA | `107733720000000000 (0.107734e18)` | `0x68a1...CEe4` | 2025-08-04 |
> | 4 | EOA | `101020000000000000000 (101.020000e18)` | `0xBe40...A49c` | 2025-04-18 |

> **`mint`** *(per-asset)* 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> | Field | Value |
> |---|---|
> | Setter | `mint(uint256 _sharesOut, address _receiver)` |
> | Gated by | `frxUSD()` |
> | Tags | `SUPPLY` |
> | Last called | 2025-04-18 |
> | Called by | `0xBe40...A49c` |
> | Total calls | 1 |

> **Recent changes:**

> | # | Asset | Value | Set By | Date |
> |---|---|---|---|---|
> | 1 | EOA | `101020000000000000000 (101.020000e18)` | `0xBe40...A49c` | 2025-04-18 |

---
<a id="c-0x860cc723935fc9a15ff8b1a94237a711dfef7857"></a>
## > FrxUSDCustodianWithReceiver `0x860Cc723935FC9A15fF8b1A94237a711DFeF7857`

> > ⚠️ **Upgradeable** (TransparentUpgradeable) — impl: `0x4DB9c0e8893B565f7419cf3886062845a8CBc529`

> **Proxy History (5 events):**

> | # | Date | Event | Address | Key Changes | Tx |
> |---|---|---|---|---|---|
> | 1 | 2025-07-25 | Upgrade | `0x288D...9Db2` | Initial deployment | [0xf444ba181414a0db933416e161e693e419fb2dd67d97cbf7f1d97527023412d6](https://etherscan.io/tx/0xf444ba181414a0db933416e161e693e419fb2dd67d97cbf7f1d97527023412d6) |
> | 2 | 2025-07-25 | Admin Changed | `0x5304...0e9D` | Previous: `0x0000...0000` | [0xf444ba181414a0db933416e161e693e419fb2dd67d97cbf7f1d97527023412d6](https://etherscan.io/tx/0xf444ba181414a0db933416e161e693e419fb2dd67d97cbf7f1d97527023412d6) |
> | 3 | 2025-07-28 | Upgrade | `0x1ecc...093B` | +2 fn; added `isApprovedOperator(address)`; added `setApprovedOperator(address,bool)`; 📝 src +898/-682 | [0x96f94da9391b70be55744252c937868775700503737182e67544841401c26fd2](https://etherscan.io/tx/0x96f94da9391b70be55744252c937868775700503737182e67544841401c26fd2) |
> | 4 | 2025-10-17 | Upgrade | `0xd84d...D0D3` | 📝 src +167/-1447 | [0x5f85c189b624699301f4349eb4535e3e15c66276f372a4aaaeaccaf61a87b060](https://etherscan.io/tx/0x5f85c189b624699301f4349eb4535e3e15c66276f372a4aaaeaccaf61a87b060) |
> | 5 | 2025-11-21 | Upgrade | `0x4DB9...c529` | +1 fn; added `redeemForUsdcAsync(uint256)`; 📝 src +76/-13 | [0x8ea461f2b9d28b0589ed31925825c61e8f6d82506a830a3d56185d7cb1fdbdac](https://etherscan.io/tx/0x8ea461f2b9d28b0589ed31925825c61e8f6d82506a830a3d56185d7cb1fdbdac) |

> <details>
> <summary>📝 Source diff — upgrade #3 (<code>0x288D...9Db2</code> → <code>0x1ecc...093B</code>): +898/-682 lines (truncated)</summary>

> ```diff
--- old_impl
+++ new_impl
@@ -1,3 +1,38 @@
+// SPDX-License-Identifier: MIT
+// @version 0.2.8
+pragma solidity >=0.8.0;
+
+/**
+ * ====================================================================
+ * |     ______                   _______                             |
+ * |    / _____________ __  __   / ____(_____  ____ _____  ________   |
+ * |   / /_  / ___/ __ `| |/_/  / /_  / / __ \/ __ `/ __ \/ ___/ _ \  |
+ * |  / __/ / /  / /_/ _>  <   / __/ / / / / / /_/ / / / / /__/  __/  |
+ * | /_/   /_/   \__,_/_/|_|  /_/   /_/_/ /_/\__,_/_/ /_/\___/\___/   |
+ * |                                                                  |
+ * ====================================================================
+ * =================== FrxUSDCustodianWithReceiver ====================
+ * ====================================================================
+ * FrxUSD Custodian contract for the Frax protocol to custody tokens at a 1-1 ratio
+ * Frax Finance: https://github.com/FraxFinance
+ */
+
+import { FrxUSDCustodian } from "src/deps/FrxUSDCustodian.sol";
+
+contract FrxUSDCustodianWithReceiver is FrxUSDCustodian {
+  constructor(address _frxUSD, address _custodianTkn) FrxUSDCustodian(_frxUSD, _custodianTkn) {}
+
+  function onERC721Received(
+    address operator,
+    address from,
+    uint256 tokenId,
+    bytes calldata data
+  ) external pure returns (bytes4) {
+    return FrxUSDCustodianWithReceiver.onERC721Received.selector;
+  }
+}
+
+
 // SPDX-License-Identifier: MIT
 // @version 0.2.8
 pragma solidity >=0.8.0;
@@ -24,564 +59,622 @@
 import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
 import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
 import { FrxUSD } from "./FrxUSD.sol";
+import { IRWAIssuer } from "src/interfaces/IRWAIssuer.sol";
 
 contract FrxUSDCustodian is Ownable2Step, ReentrancyGuard {
-    using Math for uint256;
-
-    // STATE VARIABLES
-    // ===================================================
-
-    /// @notice frxUSD token = share
-    FrxUSD immutable public frxUSD;
-
-    /// @notice Custodian token = asset
-    IERC20 immutable public custodianTkn;
-
-    /// @notice Decimals for the frxUSD
-    uint8 immutable public frxUSDDecimals;
-
-    /// @notice Decimals for the custodian token
-    uint8 immutable public custodianTknDecimals;
-
-    /// @notice If the contract was initialized
-    bool public wasInitialized;
-
-    /// @notice Fee for minting. 18 decimals
-    uint256 public mintFee;
-
-    /// @notice Fee for redeeming. 18 decimals
-    uint256 public redeemFee;
-
-    /// @notice Mint cap for frxUSD minting
-    uint256 public mintCap;
-
-    /// @notice frxUSD minted accounting
-    uint256 public frxUSDMinted;
-
-    // CONSTRUCTOR & INITIALIZER
-    // ===================================================
-
-    /// @notice Contract constructor
-    constructor(
-        address _frxUSD,
-        address _custodianTkn
-    ) Ownable(msg.sender) {
-        // Set the contract as initialized
-        wasInitialized = true;
-
-        // Set token addresses
-        frxUSD = FrxUSD(_frxUSD);
-        custodianTkn = IERC20(_custodianTkn);
-
-        // Set decimals
-        frxUSDDecimals = frxUSD.decimals();
-        custodianTknDecimals = ERC20(_custodianTkn).decimals();
-    }
-
-    /**
-     * @notice Initialize contract
-     * @param _owner The owner of this contract
-     * @param _mintCap The mint cap for frxUSD minting
-     * @param _mintFee The mint fee
-     * @param _redeemFee The redeem fee
-     */
-    function initialize(
-        address _owner,
-        uint256 _mintCap,
-        uint256 _mintFee,
-        uint256 _redeemFee
-    ) public {
-        // Make sure the contract wasn't already initialized    
-        if (wasInitialized) revert InitializeFailed();
-
-        // Set owner for Ownable
-        _transferOwnership(_owner);
-
-        // Set the mint cap
-        mintCap = _mintCap;
-
-        // Set the mint/redeem fee
-        mintFee = _mintFee;
-        redeemFee = _redeemFee;
-
-        // Set the contract as initialized
-        wasInitialized = true;
-    }
-
-    // ERC4626 PUBLIC/EXTERNAL VIEWS
-    // ===================================================
-
-    /// @notice Return the underlying asset
-    /// @return _custodianTkn The custodianTkn asset
-    function asset() public view returns (address _custodianTkn) {
-        _custodianTkn = address(custodianTkn);
-    }
-
-    /// @notice Share balance of the supplied address
-    /// @param _addr The address to test
-    /// @return _balance Total amount of shares
-    function balanceOf(address _addr) public view returns (uint256 _balance) {
-        return frxUSD.balanceOf(_addr);
-    }
-
-    /// @notice Total amount of underlying asset available
-    /// @param _assets Amount of underlying tokens
-    /// @dev See {IERC4626-totalAssets}
-    function totalAssets() public view returns (uint256 _assets) {
-        return custodianTkn.balanceOf(address(this));
-    }
-
-    /// @notice Total amount of shares
-    /// @return _supply Total amount of shares
-    function totalSupply() public view returns (uint256 _supply) {
-        return frxUSD.totalSupply();
-    }
-
-    /// @notice Returns the amount of shares that the contract would exchange for the amount of assets provided
-    /// @param _assets Amount of underlying tokens
-    /// @return _shares Amount of shares that the underlying _assets represents
-    /// @dev See {IERC4626-convertToShares}
-    function convertToShares(uint256 _assets) public view returns (uint256 _shares) {
-        _shares = _convertToShares(_assets, Math.Rounding.Floor);
-    }
-
-    /// @notice Returns the amount of assets that the contract would exchange for the amount of shares provided
-    /// @param _shares Amount of shares
-    /// @return _assets Amount of underlying asset that _shares represents
-    /// @dev See {IERC4626-convertToAssets}
-    function convertToAssets(uint256 _shares) public view returns (uint256 _assets) {
-        _assets = _convertToAssets(_shares, Math.Rounding.Floor);
-    }
-
-    /// @notice Returns the maximum amount of the underlying asset that can be deposited into the contract for the receiver, through a deposit call. Includes fee.
-    /// @param _addr The address to test
-    /// @return _maxAssetsIn The max amount that can be deposited
-    /**
-     * @dev See {IERC4626-maxDeposit}
-     * Contract frxUSD -> custodianTkn needed
-     */
-    function maxDeposit(address _addr) public view returns (uint256 _maxAssetsIn) {
-        // See how much custodianTkn you would need to exchange for 100% of the frxUSD available under the cap
-        if (frxUSDMinted >= mintCap) _maxAssetsIn = 0;
-        else _maxAssetsIn = previewMint(mintCap-frxUSDMinted);
-    }
-
-    /// @notice Returns the maximum amount of shares that can be minted for the receiver, through a mint call. Includes fee.
-    /// @param _addr The address to test
-    /// @return _maxSharesOut The max amount that can be minted
-    /**
-     * @dev See {IERC4626-maxMint}
-     * Contract frxUSD balance
-     */
-    function maxMint(address _addr) public view returns (uint256 _maxSharesOut) {
-        // See how much frxUSD is actually available in the contract
-        if (frxUSDMinted >= mintCap) _maxSharesOut = 0;
-        else _maxSharesOut = mintCap-frxUSDMinted;
-    }
-
-    /// @notice Returns the maximum amount of the underlying asset that can be withdrawn from the owner balance in the contract, through a withdraw call. Includes fee.
-    /// @param _owner The address to check
-    /// @return _maxAssetsOut The maximum amount of underlying asset that can be withdrawn
-    /**
-     * @dev See {IERC4626-maxWithdraw}
-     * Lesser of
-     *     a) User frxUSD -> custodianTkn amount
-     *     b) Contract custodianTkn balance
-     */
-    function maxWithdraw(address _owner) public view returns (uint256 _maxAssetsOut) {
-        // See how much custodianTkn the user could possibly withdraw with 100% of his frxUSD
-        uint256 _maxAssetsUser = previewRedeem(frxUSD.balanceOf(address(_owner)));
-
-        // See how much custodianTkn is actually available in the contract
-        uint256 _assetBalanceContract = custodianTkn.balanceOf(address(this));
-
-        // Return the lesser of the two
-        _maxAssetsOut = ((_assetBalanceContract > _maxAssetsUser) ? _maxAssetsUser : _assetBalanceContract);
-    }
-
-    /// @notice Returns the maximum amount of shares that can be redeemed from the owner balance in the contract, through a redeem call. Includes fee.
-    /// @param _owner The address to check
-    /// @return _maxSharesIn The maximum amount of shares that can be redeemed
-    /**
-     * @dev See {IERC4626-maxRedeem}
-     * Lesser of
-     *     a) User frxUSD
-     *     b) Contract custodianTkn -> frxUSD amount
-     */
-    function maxRedeem(address _owner) public view returns (uint256 _maxSharesIn) {
-        // See how much frxUSD the contract could honor if 100% of its custodianTkn was redeemed
-        uint256 _maxSharesContract = previewWithdraw(custodianTkn.balanceOf(address(this)));
-
-        // See how much frxUSD the user has
-        uint256 _sharesBalanceUser = frxUSD.balanceOf(address(_owner));
-
-        // Return the lesser of the two
-        _maxSharesIn = ((_maxSharesContract > _sharesBalanceUser) ? _sharesBalanceUser : _maxSharesContract);
-    }
-
-    /// @notice Allows an on-chain or off-chain user to simulate the effects of their deposit at the current block, given current on-chain conditions.
-    /// @param _assetsIn Amount of underlying you want to deposit
-    /// @return _sharesOut The amount of output shares expected
-    /// @dev See {IERC4626-previewDeposit}
-    function previewDeposit(uint256 _assetsIn) public view returns (uint256 _sharesOut) {
-        uint256 fee = mintFee;
-        if (fee > 0) _assetsIn = Math.mulDiv(_assetsIn, (1e18 - fee), 1e18, Math.Rounding.Floor);
-        _sharesOut = _convertToShares(_assetsIn, Math.Rounding.Floor);
-    }
-
-    /// @notice Allows an on-chain or off-chain user to simulate the effects of their mint at the current block, given current on-chain conditions.
-    /// @param _sharesOut Amount of shares you want to mint
-    /// @return _assetsIn The amount of input assets needed
-    /// @dev See {IERC4626-previewMint}
-    function previewMint(uint256 _sharesOut) public view returns (uint256 _assetsIn) {
-        uint256 fee = mintFee;
-        _assetsIn = _convertToAssets(_sharesOut, Math.Rounding.Ceil);
-        if (fee > 0) _assetsIn = Math.mulDiv(_assetsIn, 1e18, (1e18 - fee), Math.Rounding.Ceil);
-    }
-
-    /// @notice Allows an on-chain or off-chain user to simulate the effects of their withdrawal at the current block, given current on-chain conditions.
-    /// @param _assetsOut Amount of underlying tokens you want to get back
-    /// @return _sharesIn Amount of shares needed
-    /// @dev See {IERC4626-previewWithdraw}
-    function previewWithdraw(uint256 _assetsOut) public view returns (uint256 _sharesIn) {
-        uint256 fee = redeemFee;
-        if (fee > 0) _assetsOut = Math.mulDiv(_assetsOut, 1e18, (1e18 - fee), Math.Rounding.Ceil);
-        _sharesIn = _convertToShares(_assetsOut, Math.Rounding.Ceil);
-    }
-
-    /// @notice Allows an on-chain or off-chain user to simulate the effects of their redeemption at the current block, given current on-chain conditions.
-    /// @param _sharesIn Amount of shares you want to redeem
-    /// @return _assetsOut Amount of output asset expected
-    /// @dev See {IERC4626-previewRedeem}
-    function previewRedeem(uint256 _sharesIn) public view returns (uint256 _assetsOut) {
-        uint256 fee = redeemFee;
-        _assetsOut = _convertToAssets(_sharesIn, Math.Rounding.Floor);
-        if (fee > 0) _assetsOut = Math.mulDiv((1e18 - fee), _assetsOut, 1e18, Math.Rounding.Floor);
-    }
-
-    // ERC4626 INTERNAL VIEWS
-    // ===================================================
-
-    /// @dev Internal conversion function (from assets to shares) with support for rounding direction.
-    /// @param _assets Amount of underlying tokens to convert to shares
-    /// @param _rounding Math.Rounding rounding direction
-    /// @return _shares Amount of shares represented by the given underlying tokens
-    function _convertToShares(uint256 _assets, Math.Rounding _rounding) internal virtual view returns (uint256 _shares) {
-        _shares = Math.mulDiv(
-            _assets,
-            uint256(10**frxUSDDecimals),
-            uint256(10**custodianTknDecimals),
-            _rounding
-        );
-    }
-
-    /// @dev Internal conversion function (from shares to assets) with support for rounding direction
-    /// @param _shares Amount of shares to convert to underlying tokens
-    /// @param _rounding Math.Rounding rounding direction
-    /// @return _assets Amount of underlying tokens represented by the given number of shares
-    function _convertToAssets(uint256 _shares, Math.Rounding _rounding) internal virtual view returns (uint256 _assets) {
-        _assets = Math.mulDiv(
-            _shares,
-            uint256(10**custodianTknDecimals),
-            uint256(10**frxUSDDecimals),
-            _rounding
-        );
-    }
-
-    /// @notice Price of 1E18 shares, in asset tokens
-    /// @return _pricePerShare How many underlying asset tokens per 1E18 shares
-    function pricePerShare() external view returns (uint256 _pricePerShare) {
-        _pricePerShare = _convertToAssets(1e18, Math.Rounding.Floor);
-    }
-
-    // ADDITIONAL PUBLIC VIEWS
-    // ===================================================
-
-    /// @notice Helper view for max deposit, mint, withdraw, and redeem inputs
-    /// @return _maxAssetsDepositable Max amount of underlying asset you can deposit
-    /// @return _maxSharesMintable Max number of shares that can be minted
-    /// @return _maxAssetsWithdrawable Max amount of underlying asset withdrawable
-    /// @return _maxSharesRedeemable Max number of shares redeemable
-    function mdwrComboView()
-        public
-        view
-        returns (
-            uint256 _maxAssetsDepositable,
-            uint256 _maxSharesMintable,
-            uint256 _maxAssetsWithdrawable,
-            uint256 _maxSharesRedeemable
-        )
-    {
-        return (
-            previewMint(frxUSD.balanceOf(address(this))),
-            frxUSD.balanceOf(address(this)),
-            custodianTkn.balanceOf(address(this)),
-            previewWithdraw(custodianTkn.balanceOf(address(this)))
-        );
-    }
-
-    // ERC4626 INTERNAL MUTATORS
-    // ===================================================
-
-    /// @notice Deposit/mint common workflow.
-    /// @param _caller The caller
-    /// @param _receiver Reciever of the shares
-    /// @param _assets Amount of assets taken in
-    /// @param _shares Amount of shares given out
-    function _deposit(address _caller, address _receiver, uint256 _assets, uint256 _shares) internal nonReentrant {
-        // If _asset is ERC-777, `transferFrom` can trigger a reentrancy BEFORE the transfer happens through the
-        // `tokensToSend` hook. On the other hand, the `tokenReceived` hook, that is triggered after the transfer,
-        // calls the vault, which is assumed not malicious.
-        //
-        // Conclusion: we need to do the transfer beforehand so that any reentrancy would happen before the
-        // _assets are transferred and before the _shares are minted, which is a valid state.
-        // slither-disable-next-line reentrancy-no-eth
-
-        // Take in the assets
-        // User will need to approve _caller -> address(this) first
-        SafeERC20.safeTransferFrom(IERC20(address(custodianTkn)), _caller, address(this), _assets);
-
-        // Transfer out the shares / mint frxUSD
-        frxUSD.minter_mint(_receiver, _shares);
-
-        // frxUSD minted accounting
-        frxUSDMinted+=_shares;
-        if (frxUSDMinted > mintCap) revert MintCapExceeded(_receiver, _shares, mintCap);
-
-
-        emit Deposit(_caller, _receiver, _assets, _shares);
-    }
-
-    /// @notice Withdraw/redeem common workflow.
-    /// @param _caller The caller
-    /// @param _receiver Reciever of the assets
-    /// @param _owner The owner of the shares
-    /// @param _assets Amount of assets given out
-    /// @param _shares Amount of shares taken in
-    function _withdraw(
-        address _caller,
-        address _receiver,
-        address _owner,
-        uint256 _assets,
-        uint256 _shares
-    ) internal nonReentrant {
-        // If _asset is ERC-777, `transfer` can trigger a reentrancy AFTER the transfer happens through the
-        // `tokensReceived` hook. On the other hand, the `tokensToSend` hook, that is triggered before the transfer,
-        // calls the vault, which is assumed not malicious.
-        //
-        // Conclusion: we need to do the transfer afterwards so that any reentrancy would happen after the
-        // _shares are burned and after the _assets are transferred, which is a valid state.
-
-        // Take in the shares / burn frxUSD
-        // User will need to approve owner -> address(this) first
-        frxUSD.minter_burn_from(_caller, _shares);
-
-        // frxUSD minted accounting
-        if (frxUSDMinted < _shares) frxUSDMinted=0;
-        else frxUSDMinted-=_shares;
-
-
-        // Transfer out the assets
-        SafeERC20.safeTransfer(IERC20(address(custodianTkn)), _receiver, _assets);
-
-        emit Withdraw(_caller, _receiver, _owner, _assets, _shares);
-    }
-
-    // ERC4626 PUBLIC/EXTERNAL MUTATIVE
-    // ===================================================
-
-    /// @notice Deposit a specified amount of underlying tokens and generate shares. Make sure to approve msg.sender's assets to this contract first.
-    /// @param _assetsIn Amount of underlying tokens you are depositing
-    /// @param _receiver Recipient of the generated shares
-    /// @return _sharesOut Amount of shares generated by the deposit
-    /// @dev See {IERC4626-deposit}
-    function deposit(uint256 _assetsIn, address _receiver) public returns (uint256 _sharesOut) {
-        // See how many asset tokens the user can deposit
-        uint256 _maxAssets = maxDeposit(_receiver);
-
-        // Revert if the user is trying to deposit too many asset tokens
-        if (_assetsIn > _maxAssets) {
-            revert ERC4626ExceededMaxDeposit(_receiver, _assetsIn, _maxAssets);
-        }
-
-        // See how many shares would be generated with the specified number of asset tokens
-        _sharesOut = previewDeposit(_assetsIn);
-
-        // Do the deposit
-        _deposit(msg.sender, _receiver, _assetsIn, _sharesOut);
-    }
-
-    /// @notice Mint a specified amount of shares using underlying asset tokens. Make sure to approve msg.sender's assets to this contract first.
-    /// @param _sharesOut Amount of shares you want to mint
-    /// @param _receiver Recipient of the minted shares
-    /// @return _assetsIn Amount of assets used to generate the shares
-    /// @dev See {IERC4626-mint}
-    function mint(uint256 _sharesOut, address _receiver) public returns (uint256 _assetsIn) {
-        // See how many shares the user's can mint
-        uint256 _maxShares = maxMint(_receiver);
-
-        // Revert if you are trying to mint too many shares
-        if (_sharesOut > _maxShares) {
-            revert ERC4626ExceededMaxMint(_receiver, _sharesOut, _maxShares);
-        }
-
-        // See how many asset tokens are needed to generate the specified amount of shares
-        _assetsIn = previewMint(_sharesOut);
-
-        // Do the minting
-        _deposit(msg.sender, _receiver, _assetsIn, _sharesOut);
-    }
-
-    /// @notice Withdraw a specified amount of underlying tokens. Make sure to approve _owner's shares to this contract first
-    /// @param _assetsOut Amount of asset tokens you want to withdraw
-    /// @param _receiver Recipient of the asset tokens
-    /// @param _owner Owner of the shares. Must be msg.sender
-    /// @return _sharesIn Amount of shares used for the withdrawal
-    /// @dev See {IERC4626-withdraw}. Leaving _owner param for ABI compatibility
-    function withdraw(uint256 _assetsOut, address _receiver, address _owner) public returns (uint256 _sharesIn) {
-        // Make sure _owner is msg.sender
-        if (_owner != msg.sender) revert TokenOwnerShouldBeSender();
-
-        // See how much assets the owner can withdraw
-        uint256 _maxAssets = maxWithdraw(_owner);
-
-        // Revert if you are trying to withdraw too many asset tokens
-        if (_assetsOut > _maxAssets) {
-            revert ERC4626ExceededMaxWithdraw(_owner, _assetsOut, _maxAssets);
-        }
-
-        // See how many shares are needed
-        _sharesIn = previewWithdraw(_assetsOut);
-
-        // Do the withdrawal
-        _withdraw(msg.sender, _receiver, _owner, _assetsOut, _sharesIn);
-    }
-
-    /// @notice Redeem a specified amount of shares for the underlying tokens. Make sure to approve _owner's shares to this contract first.
-    /// @param _sharesIn Number of shares to redeem
-    /// @param _receiver Recipient of the underlying asset tokens
-    /// @param _owner Owner of the shares being redeemed. Must be msg.sender.
-    /// @return _assetsOut Amount of underlying tokens out
-    /// @dev See {IERC4626-redeem}. Leaving _owner param for ABI compatibility
-    function redeem(uint256 _sharesIn, address _receiver, address _owner) public returns (uint256 _assetsOut) {
-        // Make sure _owner is msg.sender
-        if (_owner != msg.sender) revert TokenOwnerShouldBeSender();
-
-        // See how many shares the owner can redeem
-        uint256 _maxShares = maxRedeem(_owner);
-
-        // Revert if you are trying to redeem too many shares
-        if (_sharesIn > _maxShares) {
-            revert ERC4626ExceededMaxRedeem(_owner, _sharesIn, _maxShares);
-        }
-
-        // See how many asset tokens are expected
-        _assetsOut = previewRedeem(_sharesIn);
-
-        // Do the redemption
-        _withdraw(msg.sender, _receiver, _owner, _assetsOut, _sharesIn);
-    }
-
-    // RESTRICTED FUNCTIONS
-    // ===================================================
-
-    /// @notice Set the fee for the contract on mint|deposit/redeem|withdraw flow
-    /// @param _mintFee The mint fee
-    /// @param _redeemFee The redeem fee
-    function setMintRedeemFee(uint256 _mintFee, uint _redeemFee) public onlyOwner {
-        require(_mintFee < 1e18 || _redeemFee<1e18, "Fee must be a fraction of underlying");
-        mintFee = _mintFee;
-        redeemFee = _redeemFee;
-    }
-
-    /// @notice Added to support tokens
-    /// @param _tokenAddress The token to recover
-    /// @param _tokenAmount The amount to recover
-    function recoverERC20(address _tokenAddress, uint256 _tokenAmount) external onlyOwner {
-        // Only the owner address can ever receive the recovery withdrawal
-        SafeERC20.safeTransfer(IERC20(_tokenAddress), owner(), _tokenAmount);
-        emit RecoveredERC20(_tokenAddress, _tokenAmount);
-    }
-
-    /// @notice Set the mint cap for frxUSD minting
-    /// @param _mintCap The new mint cap
-    function setMintCap(uint256 _mintCap) public onlyOwner {
-        mintCap = _mintCap;
-        emit MintCapSet(_mintCap);
-    }
-
-    // EVENTS
-    // ===================================================
-
-    /// @notice When a deposit/mint has occured
-    /// @param sender The transaction sender
-    /// @param owner The owner of the assets
-    /// @param assets Amount of assets taken in
-    /// @param shares Amount of shares given out
-    event Deposit(address indexed sender, address indexed owner, uint256 assets, uint256 shares);
-
-    /// @notice When ERC20 tokens were recovered
-    /// @param token Token address
-    /// @param amount Amount of tokens collected
-    event RecoveredERC20(address token, uint256 amount);
-
-    /// @notice When a withdrawal/redemption has occured
-    /// @param sender The transaction sender
-    /// @param receiver Reciever of the assets
-    /// @param owner The owner of the shares
-    /// @param assets Amount of assets given out
-    /// @param shares Amount of shares taken in
-    event Withdraw(
-        address indexed sender,
-        address indexed receiver,
-        address indexed owner,
-        uint256 assets,
-        uint256 shares
+  using Math for uint256;
+
+  // STATE VARIABLES
+  // ===================================================
+
+  /// @notice frxUSD token = share
+  FrxUSD public immutable frxUSD;
+
+  /// @notice Custodian token = asset
+  IERC20 public immutable custodianTkn;
+
+  /// @notice Decimals for the frxUSD
+  uint8 public immutable frxUSDDecimals;
+
+  /// @notice Decimals for the custodian token
+  uint8 public immutable custodianTknDecimals;
+
+  /// @notice If the contract was initialized
+  bool public wasInitialized;
+
+  /// @notice Fee for minting. 18 decimals
+  uint256 public mintFee;
+
+  /// @notice Fee for redeeming. 18 decimals
+  uint256 public redeemFee;
+
+  /// @notice Mint cap for frxUSD minting
+  uint256 public mintCap;
+
+  /// @notice frxUSD minted accounting
+  uint256 public frxUSDMinted;
+
+  /// @notice Mapping to indicated which bots are allowed to shuffle assets
+  mapping(address => bool) public isApprovedOperator;
+
+  /// @notice The minimum amount of `custodianTkn` that must remain in the contract on `shuffleToRwa`
+  uint256 public minAfterShuffle;
+
+  // CONSTRUCTOR & INITIALIZER
+  // ===================================================
+
+  /// @notice Contract constructor
+  constructor(address _frxUSD, address _custodianTkn) Ownable(msg.sender) {
+    // Set the contract as initialized
+    wasInitialized = true;
+
+    // Set token addresses
+    frxUSD = FrxUSD(_frxUSD);
+    custodianTkn = IERC20(_custodianTkn);
+
+    // Set decimals
+    frxUSDDecimals = frxUSD.decimals();
+    custodianTknDecimals = ERC20(_custodianTkn).decimals();
+  }
+
+  /**
+   * @notice Initialize contract
+   * @param _owner The owner of this contract
+   * @param _mintCap The mint cap for frxUSD minting
+   * @param _mintFee The mint fee
+   * @param _redeemFee The redeem fee
+   */
+  function initialize(address _owner, uint256 _mintCap, uint256 _mintFee, uint256 _redeemFee) public {
+    // Make sure the contract wasn't already initialized
+    if (wasInitialized) revert InitializeFailed();
+    if (_owner == address(0)) revert OwnerCannotInitToZeroAddress();
+
+    // Set owner for Ownable
+    _transferOwnership(_owner);
+
+    // Set the mint cap
+    mintCap = _mintCap;
+
+    // Set the mint/redeem fee
+    mintFee = _mintFee;
+    redeemFee = _redeemFee;
+
+    // Set the contract as initialized
+    wasInitialized = true;
+  }
+
+  // ERC4626 PUBLIC/EXTERNAL VIEWS
+  // ===================================================
+
+  /// @notice Return the underlying asset
+  /// @return _custodianTkn The custodianTkn asset
+  function asset() public view returns (address _custodianTkn) {
+    _custodianTkn = address(custodianTkn);
+  }
+
+  /// @notice Share balance of the supplied address
+  /// @param _addr The address to test
+  /// @return _balance Total amount of shares
+  function balanceOf(address _addr) public view returns (uint256 _balance) {
+    return frxUSD.balanceOf(_addr);
+  }
+
+  /// @notice Total amount of underlying asset available
+  /// @param _assets Amount of underlying tokens
+  /// @dev See {IERC4626-totalAssets}
+  function totalAssets() public view returns (uint256 _assets) {
+    return custodianTkn.balanceOf(address(this));
+  }
+
+  /// @notice Total amount of shares
+  /// @return _supply Total amount of shares
+  function totalSupply() public view returns (uint256 _supply) {
+    return frxUSD.totalSupply();
+  }
+
+  /// @notice Returns the amount of shares that the contract would exchange for the amount of assets provided
+  /// @param _assets Amount of underlying tokens
+  /// @return _shares Amount of shares that the underlying _assets represents
+  /// @dev See {IERC4626-convertToShares}
+  function convertToShares(uint256 _assets) public view returns (uint256 _shares) {
+    _shares = _convertToShares(_assets, Math.Rounding.Floor);
+  }
+
+  /// @notice Returns the amount of assets that the contract would exchange for the amount of shares provided
+  /// @param _shares Amount of shares
+  /// @return _assets Amount of underlying asset that _shares represents
+  /// @dev See {IERC4626-convertToAssets}
+  function convertToAssets(uint256 _shares) public view returns (uint256 _assets) {
+    _assets = _convertToAssets(_shares, Math.Rounding.Floor);
+  }
+
+  /// @notice Returns the maximum amount of the underlying asset that can be deposited into the contract for the receiver, through a deposit call. Includes fee.
+  /// @param _addr The address to test
+  /// @return _maxAssetsIn The max amount that can be deposited
+  /**
+   * @dev See {IERC4626-maxDeposit}
+   * Contract frxUSD -> custodianTkn needed
+   */
+  function maxDeposit(address _addr) public view returns (uint256 _maxAssetsIn) {
+    // See how much custodianTkn you would need to exchange for 100% of the frxUSD available under the cap
+    if (frxUSDMinted >= mintCap) _maxAssetsIn = 0;
+    else _maxAssetsIn = previewMint(mintCap - frxUSDMinted);
+  }
+
+  /// @notice Returns the maximum amount of shares that can be minted for the receiver, through a mint call. Includes fee.
+  /// @param _addr The address to test
+  /// @return _maxSharesOut The max amount that can be minted
+  /**
+   * @dev See {IERC4626-maxMint}
+   * Contract frxUSD balance
+   */
+  function maxMint(address _addr) public view returns (uint256 _maxSharesOut) {
+    // See how much frxUSD is actually available in the contract
+    if (frxUSDMinted >= mintCap) _maxSharesOut = 0;
+    else _maxSharesOut = mintCap - frxUSDMinted;
+  }
+
+  /// @notice Returns the maximum amount of the underlying asset that can be withdrawn from the owner balance in the contract, through a withdraw call. Includes fee.
+  /// @param _owner The address to check
+  /// @return _maxAssetsOut The maximum amount of underlying asset that can be withdrawn
+  /**
+   * @dev See {IERC4626-maxWithdraw}
+   * Lesser of
+   *     a) User frxUSD -> custodianTkn amount
+   *     b) Contract custodianTkn balance
+   */
+  function maxWithdraw(address _owner) public view returns (uint256 _maxAssetsOut) {
+    // See how much custodianTkn the user could possibly withdraw with 100% of his frxUSD
+    uint256 _maxAssetsUser = previewRedeem(frxUSD.balanceOf(address(_owner)));
+
+    // See how much custodianTkn is actually available in the contract
+    uint256 _assetBalanceContract = custodianTkn.balanceOf(address(this));
+
+    // Return the lesser of the two
+    _maxAssetsOut = ((_assetBalanceContract > _maxAssetsUser) ? _maxAssetsUser : _assetBalanceContract);
+  }
+
+  /// @notice Returns the maximum amount of shares that can be redeemed from the owner balance in the contract, through a redeem call. Includes fee.
+  /// @param _owner The address to check
+  /// @return _maxSharesIn The maximum amount of shares that can be redeemed
+  /**
+   * @dev See {IERC4626-maxRedeem}
+   * Lesser of
+   *     a) User frxUSD
+   *     b) Contract custodianTkn -> frxUSD amount
+   */
+  function maxRedeem(address _owner) public view returns (uint256 _maxSharesIn) {
+    // See how much frxUSD the contract could honor if 100% of its custodianTkn was redeemed
+    uint256 _maxSharesContract = previewWithdraw(custodianTkn.balanceOf(address(this)));
+
+    // See how much frxUSD the user has
+    uint256 _sharesBalanceUser = frxUSD.balanceOf(address(_owner));
+
+    // Return the lesser of the two
+    _maxSharesIn = ((_maxSharesContract > _sharesBalanceUser) ? _sharesBalanceUser : _maxSharesContract);
+  }
+
+  /// @notice Allows an on-chain or off-chain user to simulate the effects of their deposit at the current block, given current on-chain conditions.
+  /// @param _assetsIn Amount of underlying you want to deposit
+  /// @return _sharesOut The amount of output shares expected
+  /// @dev See {IERC4626-previewDeposit}
+  function previewDeposit(uint256 _assetsIn) public view returns (uint256 _sharesOut) {
+    uint256 fee = mintFee;
+    if (fee > 0) _assetsIn = Math.mulDiv(_assetsIn, (1e18 - fee), 1e18, Math.Rounding.Floor);
+    _sharesOut = _convertToShares(_assetsIn, Math.Rounding.Floor);
+  }
+
+  /// @notice Allows an on-chain or off-chain user to simulate the effects of their mint at the current block, given current on-chain conditions.
+  /// @param _sharesOut Amount of shares you want to mint
+  /// @return _assetsIn The amount of input assets needed
+  /// @dev See {IERC4626-previewMint}
+  function previewMint(uint256 _sharesOut) public view returns (uint256 _assetsIn) {
+    uint256 fee = mintFee;
+    _assetsIn = _convertToAssets(_sharesOut, Math.Rounding.Ceil);
+    if (fee > 0) _assetsIn = Math.mulDiv(_assetsIn, 1e18, (1e18 - fee), Math.Rounding.Ceil);
+  }
+
+  /// @notice Allows an on-chain or off-chain user to simulate the effects of their withdrawal at the current block, given current on-chain conditions.
+  /// @param _assetsOut Amount of underlying tokens you want to get back
+  /// @return _sharesIn Amount of shares needed
+  /// @dev See {IERC4626-previewWithdraw}
+  function previewWithdraw(uint256 _assetsOut) public view returns (uint256 _sharesIn) {
+    uint256 fee = redeemFee;
+    if (fee > 0) _assetsOut = Math.mulDiv(_assetsOut, 1e18, (1e18 - fee), Math.Rounding.Ceil);
+    _sharesIn = _convertToShares(_assetsOut, Math.Rounding.Ceil);
+  }
+
+  /// @notice Allows an on-chain or off-chain user to simulate the effects of their redeemption at the current block, given current on-chain conditions.
+  /// @param _sharesIn Amount of shares you want to redeem
+  /// @return _assetsOut Amount of output asset expected
+  /// @dev See {IERC4626-previewRedeem}
+  function previewRedeem(uint256 _sharesIn) public view returns (uint256 _assetsOut) {
+    uint256 fee = redeemFee;
+    _assetsOut = _convertToAssets(_sharesIn, Math.Rounding.Floor);
+    if (fee > 0) _assetsOut = Math.mulDiv((1e18 - fee), _assetsOut, 1e18, Math.Rounding.Floor);
+  }
+
+  // ERC4626 INTERNAL VIEWS
+  // ===================================================
+
+  /// @dev Internal conversion function (from assets to shares) with support for rounding direction.
+  /// @param _assets Amount of underlying tokens to convert to shares
+  /// @param _rounding Math.Rounding rounding direction
+  /// @return _shares Amount of shares represented by the given underlying tokens
+  function _convertToShares(uint256 _assets, Math.Rounding _rounding) internal view virtual returns (uint256 _shares) {
+    _shares = Math.mulDiv(_assets, uint256(10 ** frxUSDDecimals), uint256(10 ** custodianTknDecimals), _rounding);
+  }
+
+  /// @dev Internal conversion function (from shares to assets) with support for rounding direction
+  /// @param _shares Amount of shares to convert to underlying tokens
+  /// @param _rounding Math.Rounding rounding direction
+  /// @return _assets Amount of underlying tokens represented by the given number of shares
+  function _convertToAssets(uint256 _shares, Math.Rounding _rounding) internal view virtual returns (uint256 _assets) {
+    _assets = Math.mulDiv(_shares, uint256(10 ** custodianTknDecimals), uint256(10 ** frxUSDDecimals), _rounding);
+  }
+
+  /// @notice Price of 1E18 shares, in asset tokens
+  /// @return _pricePerShare How many underlying asset tokens per 1E18 shares
+  function pricePerShare() external view returns (uint256 _pricePerShare) {
+    _pricePerShare = _convertToAssets(1e18, Math.Rounding.Floor);
+  }
+
+  // ADDITIONAL PUBLIC VIEWS
+  // ===================================================
+
+  /// @notice Helper view for max deposit, mint, withdraw, and redeem inputs
+  /// @return _maxAssetsDepositable Max amount of underlying asset you can deposit
+  /// @return _maxSharesMintable Max number of shares that can be minted
+  /// @return _maxAssetsWithdrawable Max amount of underlying asset withdrawable
+  /// @return _maxSharesRedeemable Max number of shares redeemable
+  function mdwrComboView()
+    public
+    view
+    returns (
+      uint256 _maxAssetsDepositable,
+      uint256 _maxSharesMintable,
+      uint256 _maxAssetsWithdrawable,
+      uint256 _maxSharesRedeemable
+    )
+  {
+    uint256 _maxMint = maxMint(address(this));
+    return (
+      previewMint(_maxMint),
+      _maxMint,
+      custodianTkn.balanceOf(address(this)),
+      previewWithdraw(custodianTkn.balanceOf(address(this)))
     );
-
-    /// @notice When the mint cap is set
-    /// @param mintCap The new mint cap
-    event MintCapSet(uint256 mintCap);
-
-    // ERRORS
-    // ===================================================
-
-    /// @notice Attempted to deposit more assets than the max amount for `receiver`
-    /// @param receiver The intended recipient of the shares
-    /// @param assets The amount of underlying that was attempted to be deposited
-    /// @param max Max amount of underlying depositable
-    error ERC4626ExceededMaxDeposit(address receiver, uint256 assets, uint256 max);
-
-    /// @notice Attempted to mint more shares than the mint cap
-    /// @param receiver The intended recipient of the shares
-    /// @param shares The number of shares that was attempted to be minted
-    /// @param mintCap The mint cap
-    error MintCapExceeded(address receiver, uint256 shares, uint256 mintCap);
-
-    /// @notice Attempted to mint more shares than the max amount for `receiver`
-    /// @param receiver The intended recipient of the shares
-    /// @param shares The number of shares that was attempted to be minted
-    /// @param max Max number of shares mintable
-    error ERC4626ExceededMaxMint(address receiver, uint256 shares, uint256 max);
-
-    /// @notice Attempted to withdraw more assets than the max amount for `receiver`
-    /// @param owner The owner of the shares
-    /// @param assets The amount of underlying that was attempted to be withdrawn
-    /// @param max Max amount of underlying withdrawable
-    error ERC4626ExceededMaxWithdraw(address owner, uint256 assets, uint256 max);
-
-    /// @notice Attempted to redeem more shares than the max amount for `receiver`
-    /// @param owner The owner of the shares
-    /// @param shares The number of shares that was attempted to be redeemed
-    /// @param max Max number of shares redeemable
-    error ERC4626ExceededMaxRedeem(address owner, uint256 shares, uint256 max);
-
-    /// @notice Cannot initialize twice
-    error InitializeFailed();
-
-    /// @notice When you are attempting to pull tokens from an owner address that is not msg.sender
-    error TokenOwnerShouldBeSender();
+  }
+
+  // ERC4626 INTERNAL MUTATORS
+  // ===================================================
+
+  /// @notice Deposit/mint common workflow.
+  /// @param _caller The caller
+  /// @param _receiver Reciever of the shares
+  /// @param _assets Amount of assets taken in
+  /// @param _shares Amount of shares given out
+  function _deposit(address _caller, address _receiver, uint256 _assets, uint256 _shares) internal nonReentrant {
+    // If _asset is ERC-777, `transferFrom` can trigger a reentrancy BEFORE the transfer happens through the
+    // `tokensToSend` hook. On the other hand, the `tokenReceived` hook, that is triggered after the transfer,
+    // calls the vault, which is assumed not malicious.
+    //
+    // Conclusion: we need to do the transfer beforehand so that any reentrancy would happen before the
+    // _assets are transferred and before the _shares are minted, which is a valid state.
+    // slither-disable-next-line reentrancy-no-eth
+
+    // Take in the assets
+    // User will need to approve _caller -> address(this) first
+    SafeERC20.safeTransferFrom(IERC20(address(custodianTkn)), _caller, address(this), _assets);
+
+    // Transfer out the shares / mint frxUSD
+    frxUSD.minter_mint(_receiver, _shares);
+
+    // frxUSD minted accounting
+    frxUSDMinted += _shares;
+    if (frxUSDMinted > mintCap) revert MintCapExceeded(_receiver, _shares, mintCap);
+
+    emit Deposit(_caller, _receiver, _assets, _shares);
+  }
+
+  /// @notice Withdraw/redeem common workflow.
+  /// @param _caller The caller
+  /// @param _receiver Reciever of the assets
+  /// @param _owner The owner of the shares
+  /// @param _assets Amount of assets given out
+  /// @param _shares Amount of shares taken in
+  function _withdraw(
+    address _caller,
+    address _receiver,
+    address _owner,
+    uint256 _assets,
+    uint256 _shares
+  ) internal nonReentrant {
+    // If _asset is ERC-777, `transfer` can trigger a reentrancy AFTER the transfer happens through the
+    // `tokensReceived` hook. On the other hand, the `tokensToSend` hook, that is triggered before the transfer,
+    // calls the vault, which is assumed not malicious.
+    //
+    // Conclusion: we need to do the transfer afterwards so that any reentrancy would happen after the
+    // _shares are burned and after the _assets are transferred, which is a valid state.
+
+    // Take in the shares / burn frxUSD
+    // User will need to approve owner -> address(this) first
+    frxUSD.minter_burn_from(_caller, _shares);
+
+    // frxUSD minted accounting
+    if (frxUSDMinted < _shares) frxUSDMinted = 0;
+    else frxUSDMinted -= _shares;
+
+    // Transfer out the assets
+    SafeERC20.safeTransfer(IERC20(address(custodianTkn)), _receiver, _assets);
+
+    emit Withdraw(_caller, _receiver, _owner, _assets, _shares);
+  }
+
+  // ERC4626 PUBLIC/EXTERNAL MUTATIVE
+  // ===================================================
+
+  /// @notice Deposit a specified amount of underlying tokens and generate shares. Make sure to approve msg.sender's assets to this contract first.
+  /// @param _assetsIn Amount of underlying tokens you are depositing
+  /// @param _receiver Recipient of the generated shares
+  /// @return _sharesOut Amount of shares generated by the deposit
+  /// @dev See {IERC4626-deposit}
+  function deposit(uint256 _assetsIn, address _receiver) public virtual returns (uint256 _sharesOut) {
+    // See how many asset tokens the user can deposit
+    uint256 _maxAssets = maxDeposit(_receiver);
+
+    // Revert if the user is trying to deposit too many asset tokens
+    if (_assetsIn > _maxAssets) {
+      revert ERC4626ExceededMaxDeposit(_receiver, _assetsIn, _maxAssets);
+    }
+
+    // See how many shares would be generated with the specified number of asset tokens
+    _sharesOut = previewDeposit(_assetsIn);
+
+    // Do the deposit
+    _deposit(msg.sender, _receiver, _assetsIn, _sharesOut);
+  }
+
+  /// @notice Mint a specified amount of shares using underlying asset tokens. Make sure to approve msg.sender's assets to this contract first.
+  /// @param _sharesOut Amount of shares you want to mint
+  /// @param _receiver Recipient of the minted shares
+  /// @return _assetsIn Amount of assets used to generate the shares
+  /// @dev See {IERC4626-mint}
+  function mint(uint256 _sharesOut, address _receiver) public virtual returns (uint256 _assetsIn) {
+    // See how many shares the user's can mint
+    uint256 _maxShares = maxMint(_receiver);
+
+    // Revert if you are trying to mint too many shares
+    if (_sharesOut > _maxShares) {
+      revert ERC4626ExceededMaxMint(_receiver, _sharesOut, _maxShares);
+    }
+
+    // See how many asset tokens are needed to generate the specified amount of shares
+    _assetsIn = previewMint(_sharesOut);
+
+    // Do the minting
+    _deposit(msg.sender, _receiver, _assetsIn, _sharesOut);
+  }
+
+  /// @notice Withdraw a specified amount of underlying tokens. Make sure to approve _owner's shares to this contract first
+  /// @param _assetsOut Amount of asset tokens you want to withdraw
+  /// @param _receiver Recipient of the asset tokens
+  /// @param _owner Owner of the shares. Must be msg.sender
+  /// @return _sharesIn Amount of shares used for the withdrawal
+  /// @dev See {IERC4626-withdraw}. Leaving _owner param for ABI compatibility
+  function withdraw(uint256 _assetsOut, address _receiver, address _owner) public virtual returns (uint256 _sharesIn) {
+    // Make sure _owner is msg.sender
+    if (_owner != msg.sender) revert TokenOwnerShouldBeSender();
+
+    // See how much assets the owner can withdraw
+    uint256 _maxAssets = maxWithdraw(_owner);
+
+    // Revert if you are trying to withdraw too many asset tokens
+    if (_assetsOut > _maxAssets) {
+      revert ERC4626ExceededMaxWithdraw(_owner, _assetsOut, _maxAssets);
+    }
+
+    // See how many shares are needed
+    _sharesIn = previewWithdraw(_assetsOut);
+
+    // Do the withdrawal
+    _withdraw(msg.sender, _receiver, _owner, _assetsOut, _sharesIn);
+  }
+
+  /// @notice Redeem a specified amount of shares for the underlying tokens. Make sure to approve _owner's shares to this contract first.
+  /// @param _sharesIn Number of shares to redeem
+  /// @param _receiver Recipient of the underlying asset tokens
+  /// @param _owner Owner of the shares being redeemed. Must be msg.sender.
+  /// @return _assetsOut Amount of underlying tokens out
+  /// @dev See {IERC4626-redeem}. Leaving _owner param for ABI compatibility
+  function redeem(uint256 _sharesIn, address _receiver, address _owner) public virtual returns (uint256 _assetsOut) {
+    // Make sure _owner is msg.sender
+    if (_owner != msg.sender) revert TokenOwnerShouldBeSender();
+
+    // See how many shares the owner can redeem
+    uint256 _maxShares = maxRedeem(_owner);
+
+    // Revert if you are trying to redeem too many shares
+    if (_sharesIn > _maxShares) {
+      revert ERC4626ExceededMaxRedeem(_owner, _sharesIn, _maxShares);
+    }
+
+    // See how many asset tokens are expected
+    _assetsOut = previewRedeem(_sharesIn);
+
+    // Do the redemption
+    _withdraw(msg.sender, _receiver, _owner, _assetsOut, _sharesIn);
+  }
+
+  // RESTRICTED FUNCTIONS
+  // ===================================================
+
+  /// @notice Set the fee for the contract on mint|deposit/redeem|withdraw flow
+  /// @param _mintFee The mint fee
+  /// @param _redeemFee The redeem fee
+  function setMintRedeemFee(uint256 _mintFee, uint _redeemFee) public onlyOwner {
+    require(_mintFee < 1e18 && _redeemFee < 1e18, "Fee must be a fraction of underlying");
+    mintFee = _mintFee;
+    redeemFee = _redeemFee;
+  }
+
+  /// @notice Added to support tokens
+  /// @param _tokenAddress The token to recover
+  /// @param _tokenAmount The amount to recover
+  function recoverERC20(address _tokenAddress, uint256 _tokenAmount) external onlyOwner {
+    // Only the owner address can ever receive the recovery withdrawal
+    SafeERC20.safeTransfer(IERC20(_tokenAddress), owner(), _tokenAmount);
+    emit RecoveredERC20(_tokenAddress, _tokenAmount);
+  }
+
+  /// @notice Set the mint cap for frxUSD minting
+  /// @param _mintCap The new mint cap
+  function setMintCap(uint256 _mintCap) public onlyOwner {
+    mintCap = _mintCap;
+    emit MintCapSet(_mintCap);
+  }
+
+  /// @notice Set the status for a custodian operator
+  /// @param _operator  The address of the operator whose status is updated
+  /// @param _status    The status for the operator
+  /// @dev only callable via `owner`
+  function setApprovedOperator(address _operator, bool _status) public onlyOwner {
+    isApprovedOperator[_operator] = _status;
+    emit OperatorStatusSet(_operator, _status);
+  }
+
+  /// @notice Set the `minAfterShuffle` variable
+  /// @param _minAfterShuffle The minimum amt of `custodianTkn` that must remain in the contract
+  ///                         after the call to `shuffleToRwa`
+  /// @dev only callable via `owner`
+  function setMinAfterShuffle(uint256 _minAfterShuffle) public onlyOwner {
+    emit MinAmountAfterShuffleSet(minAfterShuffle, _minAfterShuffle);
+    minAfterShuffle = _minAfterShuffle;
+  }
+
+  /// @notice Function that will take excess usdc and shuffle it into RWA's earning RFR
+  /// @param amount          The amount of `custodianTkn`
+  /// @param minAmountRwaOut The minumOut
+  function shuffleToRwa(uint256 amount, uint256 minAmountRwaOut) public {
+    IRWAIssuer rwaIssuer = IRWAIssuer(0x43415eB6ff9DB7E26A15b704e7A3eDCe97d31C4e);
+    address rwaCustodian = 0x5fbAa3A3B489199338fbD85F7E3D444dc0504F33;
+
+    if (!isApprovedOperator[msg.sender]) revert NotOperator();
+    if (custodianTkn.balanceOf(address(this)) - amount < minAfterShuffle) revert AmountTooHigh();
+
+    uint256 totalAssetsStart;
+    if (minAmountRwaOut > 0) {
+      totalAssetsStart = FrxUSDCustodian(rwaCustodian).totalAssets();
+    }
+    custodianTkn.approve(address(rwaIssuer), amount);
+    rwaIssuer.subscribe(rwaCustodian, amount, address(custodianTkn));
+    if (minAmountRwaOut > 0) {
+      if (FrxUSDCustodian(rwaCustodian).totalAssets() - totalAssetsStart < minAmountRwaOut) {
+        revert SlippageTooHigh();
+      }
+    }
+  }
+
+  // EVENTS
+  // ===================================================
+
+  /// @notice When a deposit/mint has occured
+  /// @param sender The transaction sender
+  /// @param owner The owner of the assets
+  /// @param assets Amount of assets taken in
+  /// @param shares Amount of shares given out
+  event Deposit(address indexed sender, address indexed owner, uint256 assets, uint256 shares);
+
+  /// @notice When ERC20 tokens were recovered
+  /// @param token Token address
+  /// @param amount Amount of tokens collected
+  event RecoveredERC20(address token, uint256 amount);
+
+  /// @notice When a withdrawal/redemption has occured
+  /// @param sender The transaction sender
+  /// @p
[truncated — full diff is 68,770 bytes]
> ```

> </details>

> <details>
> <summary>📝 Source diff — upgrade #4 (<code>0x1ecc...093B</code> → <code>0xd84d...D0D3</code>): +167/-1447 lines (truncated)</summary>

> ```diff
--- old_impl
+++ new_impl
@@ -17,7 +17,7 @@
  * Frax Finance: https://github.com/FraxFinance
  */
 
-import { FrxUSDCustodian } from "src/deps/FrxUSDCustodian.sol";
+import { FrxUSDCustodian, IERC20 } from "src/deps/FrxUSDCustodian.sol";
 
 contract FrxUSDCustodianWithReceiver is FrxUSDCustodian {
   constructor(address _frxUSD, address _custodianTkn) FrxUSDCustodian(_frxUSD, _custodianTkn) {}
@@ -30,6 +30,46 @@
   ) external pure returns (bytes4) {
     return FrxUSDCustodianWithReceiver.onERC721Received.selector;
   }
+
+  /// @notice Function to send usdc in this contract to the Wisdom tree on `On Receipt` address
+  /// @param amountUsdc The amount of USDC to subscribe
+  /// @dev Assumes required USDC is already present in this contract
+  /// @dev Assumes WTGXX will be minted to the whitelisted address who sends usdc to the
+  ///      `onReceiptPrimaryOrderAddress`
+  function shuffleToWtgxx(uint256 amountUsdc) external {
+    if (msg.sender != 0x4F95C5bA0C7c69FB2f9340E190cCeE890B3bd87c) revert OnlyUsdcCustodian();
+    IERC20 USDC = IERC20(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48);
+    address onReceiptPrimaryOrderAddress = 0x63a8bb98D70d0aC73460d22b6756528a087ecBf8;
+    USDC.transfer(onReceiptPrimaryOrderAddress, amountUsdc);
+    emit UsdcShuffledToWtgxxAsync(amountUsdc);
+  }
+
+  /// @notice Overriden function not to be used in child
+  function shuffleToRwa(
+    uint256, 
+    uint256, 
+    uint8
+  ) public override {
+    revert NotImplemented();
+  }
+
+  /// @notice Overriden function not to be used in child
+  function shuffleToRwa(
+    uint256,
+    uint256
+  ) external override {
+    revert NotImplemented();
+  }
+
+  /// @notice Event emitted when usdc is sucessfully used to subscribe to wtgxx
+  event UsdcShuffledToWtgxxAsync(uint256 amountUsdcSent);
+
+  /// @notice Error Emitted when the `shuffleToWtgxx` caller is not approved
+  error OnlyUsdcCustodian();
+
+  /// @notice Error Emitted when calling function not intended for this instance
+  error NotImplemented();
+
 }
 
 
@@ -58,8 +98,9 @@
 import { Math } from "@openzeppelin/contracts/utils/math/Math.sol";
 import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
 import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
-import { FrxUSD } from "./FrxUSD.sol";
+import { IFrxUSD } from "src/interfaces/IFrxUSD.sol";
 import { IRWAIssuer } from "src/interfaces/IRWAIssuer.sol";
+import { IWtgxxCustodian } from "src/interfaces/IWtgxxCustodian.sol";
 
 contract FrxUSDCustodian is Ownable2Step, ReentrancyGuard {
   using Math for uint256;
@@ -68,7 +109,7 @@
   // ===================================================
 
   /// @notice frxUSD token = share
-  FrxUSD public immutable frxUSD;
+  IFrxUSD public immutable frxUSD;
 
   /// @notice Custodian token = asset
   IERC20 public immutable custodianTkn;
@@ -109,7 +150,7 @@
     wasInitialized = true;
 
     // Set token addresses
-    frxUSD = FrxUSD(_frxUSD);
+    frxUSD = IFrxUSD(_frxUSD);
     custodianTkn = IERC20(_custodianTkn);
 
     // Set decimals
@@ -553,26 +594,38 @@
   }
 
   /// @notice Function that will take excess usdc and shuffle it into RWA's earning RFR
-  /// @param amount          The amount of `custodianTkn`
-  /// @param minAmountRwaOut The minumOut
-  function shuffleToRwa(uint256 amount, uint256 minAmountRwaOut) public {
+  /// @param amount           The amount of `custodianTkn`
+  /// @param minAmountRwaOut  The minimum amount of rwa out
+  /// @param assetToShuffleTo Enum representing the asset we want to shuffle to
+  function shuffleToRwa(uint256 amount, uint256 minAmountRwaOut, uint8 assetToShuffleTo) public virtual {
     IRWAIssuer rwaIssuer = IRWAIssuer(0x43415eB6ff9DB7E26A15b704e7A3eDCe97d31C4e);
     address rwaCustodian = 0x5fbAa3A3B489199338fbD85F7E3D444dc0504F33;
+    address wtgxxCustodian = 0x860Cc723935FC9A15fF8b1A94237a711DFeF7857;
 
     if (!isApprovedOperator[msg.sender]) revert NotOperator();
     if (custodianTkn.balanceOf(address(this)) - amount < minAfterShuffle) revert AmountTooHigh();
 
-    uint256 totalAssetsStart;
-    if (minAmountRwaOut > 0) {
-      totalAssetsStart = FrxUSDCustodian(rwaCustodian).totalAssets();
-    }
-    custodianTkn.approve(address(rwaIssuer), amount);
-    rwaIssuer.subscribe(rwaCustodian, amount, address(custodianTkn));
-    if (minAmountRwaOut > 0) {
-      if (FrxUSDCustodian(rwaCustodian).totalAssets() - totalAssetsStart < minAmountRwaOut) {
-        revert SlippageTooHigh();
+    if (assetToShuffleTo == 0) {
+      uint256 totalAssetsStart;
+      if (minAmountRwaOut > 0) {
+        totalAssetsStart = FrxUSDCustodian(rwaCustodian).totalAssets();
       }
-    }
+      custodianTkn.approve(address(rwaIssuer), amount);
+      rwaIssuer.subscribe(rwaCustodian, amount, address(custodianTkn));
+      if (minAmountRwaOut > 0) {
+        if (FrxUSDCustodian(rwaCustodian).totalAssets() - totalAssetsStart < minAmountRwaOut) {
+          revert SlippageTooHigh();
+        }
+      }
+    } else {
+      custodianTkn.transfer(wtgxxCustodian, amount);
+      IWtgxxCustodian(wtgxxCustodian).shuffleToWtgxx(amount);
+    }
+  }
+
+  /// @notice Extend the legacy abi of the contract
+  function shuffleToRwa(uint256 amount, uint256 minAmountRwaOut) external virtual {
+    shuffleToRwa(amount, minAmountRwaOut, 0);
   }
 
   // EVENTS
@@ -2219,261 +2272,103 @@
 }
 
 
-//SPDX-License-Identifier: Unlicense
-pragma solidity ^0.8.0;
-
-import { ERC20Permit, ERC20 } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
-import { ERC20Burnable } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
-import { Ownable2Step } from "@openzeppelin/contracts/access/Ownable2Step.sol";
-import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
-import { StorageSlot } from "@openzeppelin/contracts/utils/StorageSlot.sol";
-
-/// @title FrxUSD
-/**
- * @notice Combines Openzeppelin's ERC20Permit, ERC20Burnable and Ownable2Step.
- *     Also includes a list of authorized minters
- */
-/// @dev FrxUSD adheres to EIP-712/EIP-2612 and can use permits
-contract FrxUSD is ERC20Permit, ERC20Burnable, Ownable2Step {
-  /// @notice Array of the non-bridge minters
-  address[] public minters_array;
-
-  /// @notice Mapping of the minters
-  /// @dev Mapping is used for faster verification
-  mapping(address => bool) public minters;
-
-  /// @notice Mapping indicating which addresses are frozen
-  mapping(address => bool) public isFrozen;
-
-  /// @notice Whether or not the contract is paused
-  bool public isPaused;
-
-  /* ========== CONSTRUCTOR ========== */
-  /// @param _ownerAddress The initial owner
-  /// @param _name ERC20 name
-  /// @param _symbol ERC20 symbol
-  constructor(
-    address _ownerAddress,
-    string memory _name,
-    string memory _symbol
-  ) ERC20(_name, _symbol) ERC20Permit(_name) Ownable(_ownerAddress) {}
-
-  /* ========== INITIALIZER ========== */
-  /// @dev Used to initialize the contract when it is behind a proxy
-  function initialize(address _owner, string memory _name, string memory _symbol) public {
-    require(owner() == address(0), "Already initialized");
-    if (_owner == address(0)) revert OwnerCannotInitToZeroAddress();
-    _transferOwnership(_owner);
-    StorageSlot.getBytesSlot(bytes32(uint256(3))).value = bytes(_name);
-    StorageSlot.getBytesSlot(bytes32(uint256(4))).value = bytes(_symbol);
-  }
-
-  /* ========== MODIFIERS ========== */
-
-  /// @notice A modifier that only allows a minters to call
-  modifier onlyMinters() {
-    require(minters[msg.sender] == true, "Only minters");
-    _;
-  }
-
-  /* ========== RESTRICTED FUNCTIONS [MINTERS] ========== */
-
-  /// @notice Used by minters to burn tokens
-  /// @param b_address Address of the account to burn from
-  /// @param b_amount Amount of tokens to burn
-  function minter_burn_from(address b_address, uint256 b_amount) public onlyMinters {
-    super.burnFrom(b_address, b_amount);
-    emit TokenMinterBurned(b_address, msg.sender, b_amount);
-  }
-
-  /// @notice Used by minters to mint new tokens
-  /// @param m_address Address of the account to mint to
-  /// @param m_amount Amount of tokens to mint
-  function minter_mint(address m_address, uint256 m_amount) public onlyMinters {
-    super._mint(m_address, m_amount);
-    emit TokenMinterMinted(msg.sender, m_address, m_amount);
-  }
-
-  /* ========== RESTRICTED FUNCTIONS [OWNER] ========== */
-  /// @notice Adds a minter
-  /// @param minter_address Address of minter to add
-  function addMinter(address minter_address) public onlyOwner {
-    require(minter_address != address(0), "Zero address detected");
-
-    require(minters[minter_address] == false, "Address already exists");
-    minters[minter_address] = true;
-    minters_array.push(minter_address);
-
-    emit MinterAdded(minter_address);
-  }
-
-  /// @notice Removes a non-bridge minter
-  /// @param minter_address Address of minter to remove
-  function removeMinter(address minter_address) public onlyOwner {
-    require(minter_address != address(0), "Zero address detected");
-    require(minters[minter_address] == true, "Address nonexistant");
-
-    // Delete from the mapping
-    delete minters[minter_address];
-
-    // 'Delete' from the array by setting the address to 0x0
-    for (uint256 i = 0; i < minters_array.length; i++) {
-      if (minters_array[i] == minter_address) {
-        minters_array[i] = address(0); // This will leave a null in the array and keep the indices the same
-        break;
-      }
-    }
-
-    emit MinterRemoved(minter_address);
-  }
-
-  /// @notice External admin gated function to unfreeze a set of accounts
-  /// @param _owners Array of accounts to be unfrozen
-  function thawMany(address[] memory _owners) external onlyOwner {
-    uint256 len = _owners.length;
-    for (uint256 i; i < len; ++i) {
-      _thaw(_owners[i]);
-    }
-  }
-
-  /// @notice External admin gated function to unfreeze an account
-  /// @param _owner The account to be unfrozen
-  function thaw(address _owner) external onlyOwner {
-    _thaw(_owner);
-  }
-
-  /// @notice External admin gated function to batch freeze a set of accounts
-  /// @param _owners Array of accounts to be frozen
-  function freezeMany(address[] memory _owners) external onlyOwner {
-    uint256 len = _owners.length;
-    for (uint256 i; i < len; ++i) {
-      _freeze(_owners[i]);
-    }
-  }
-
-  /// @notice External admin gated function to freeze a given account
-  /// @param _owner The account to be
-  function freeze(address _owner) external onlyOwner {
-    _freeze(_owner);
-  }
-
-  /// @notice External admin gated function to batch burn balance from a set of accounts
-  /// @param _owners Array of accounts whose balances will be burned
-  /// @param _amounts Array of amounts corresponding to the balances to be burned
-  /// @dev if `_amount` == 0, entire balance will be burned
-  function burnMany(address[] memory _owners, uint256[] memory _amounts) external onlyOwner {
-    uint lenOwner = _owners.length;
-    if (_owners.length != _amounts.length) revert ArrayMisMatch();
-    for (uint i; i < lenOwner; ++i) {
-      if (_amounts[i] == 0) _amounts[i] = balanceOf(_owners[i]);
-      _burn(_owners[i], _amounts[i]);
-    }
-  }
-
-  /// @notice External admin gated function to burn balance from a given account
-  /// @param _owner  The account whose balance will be burned
-  /// @param _amount The amount of balance to burn
-  /// @dev if `_amount` == 0, entire balance will be burned
-  function burn(address _owner, uint256 _amount) external onlyOwner {
-    if (_amount == 0) _amount = balanceOf(_owner);
-    _burn(_owner, _amount);
-  }
-
-  /// @notice External admin gated pause function
-  function pause() external onlyOwner {
-    isPaused = true;
-    emit Paused();
-  }
-
-  /// @notice External admin gated unpause function
-  function unpause() external onlyOwner {
-    isPaused = false;
-    emit Unpaused();
-  }
-
-  /* ========== Internals For Admin Gated ========== */
-
-  /// @notice Internal helper function to freeze an account
-  /// @param _owner The account to 'frozen'
-  function _freeze(address _owner) internal {
-    isFrozen[_owner] = true;
-    emit AccountFrozen(_owner);
-  }
-
-  /// @notice Internal helper function to unfreeze an account
-  /// @param _owner The account to unfreeze
-  function _thaw(address _owner) internal {
-    isFrozen[_owner] = false;
-    emit AccountThawed(_owner);
-  }
-
-  /* ========== Overrides ========== */
-
-  /// @notice override for base internal `_update(address,address,uint256)`
-  ///         implements `paused` and `frozen` transfer logic
-  /// @param from  The address from which balance is originating
-  /// @param to    The address whose balance will be incremented
-  /// @param value The amount to increment/decrement the balances of
-  /// @dev Owner can bypass pause and freeze checks
-  function _update(address from, address to, uint256 value) internal override {
-    if (msg.sender != owner()) {
-      if (isPaused) revert IsPaused();
-      if (isFrozen[to] || isFrozen[from] || isFrozen[msg.sender]) revert IsFrozen();
-    }
-    super._update(from, to, value);
-  }
-
-  /* ========== EVENTS ========== */
-
-  /// @notice Emitted whenever the bridge burns tokens from an account
-  /// @param account Address of the account tokens are being burned from
-  /// @param amount  Amount of tokens burned
+// SPDX-License-Identifier: UNLICENSED
+pragma solidity ^0.8.4;
+
+import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
+
+interface IFrxUSD is IERC20 {
+  error ArrayMisMatch();
+  error ECDSAInvalidSignature();
+  error ECDSAInvalidSignatureLength(uint256 length);
+  error ECDSAInvalidSignatureS(bytes32 s);
+  error ERC20InsufficientAllowance(address spender, uint256 allowance, uint256 needed);
+  error ERC20InsufficientBalance(address sender, uint256 balance, uint256 needed);
+  error ERC20InvalidApprover(address approver);
+  error ERC20InvalidReceiver(address receiver);
+  error ERC20InvalidSender(address sender);
+  error ERC20InvalidSpender(address spender);
+  error ERC2612ExpiredSignature(uint256 deadline);
+  error ERC2612InvalidSigner(address signer, address owner);
+  error InvalidAccountNonce(address account, uint256 currentNonce);
+  error InvalidShortString();
+  error IsFrozen();
+  error IsPaused();
+  error OwnableInvalidOwner(address owner);
+  error OwnableUnauthorizedAccount(address account);
+  error OwnerCannotInitToZeroAddress();
+  error StringTooLong(string str);
+
+  event AccountFrozen(address account);
+  event AccountThawed(address account);
   event Burn(address indexed account, uint256 amount);
-
-  /// @notice Emitted whenever the bridge mints tokens to an account
-  /// @param account Address of the account tokens are being minted for
-  /// @param amount  Amount of tokens minted.
+  event EIP712DomainChanged();
   event Mint(address indexed account, uint256 amount);
-
-  /// @notice Emitted when a non-bridge minter is added
-  /// @param minter_address Address of the new minter
   event MinterAdded(address minter_address);
-
-  /// @notice Emitted when a non-bridge minter is removed
-  /// @param minter_address Address of the removed minter
   event MinterRemoved(address minter_address);
-
-  /// @notice Emitted when a non-bridge minter burns tokens
-  /// @param from The account whose tokens are burned
-  /// @param to The minter doing the burning
-  /// @param amount Amount of tokens burned
+  event OwnershipTransferStarted(address indexed previousOwner, address indexed newOwner);
+  event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
+  event Paused();
   event TokenMinterBurned(address indexed from, address indexed to, uint256 amount);
-
-  /// @notice Emitted when a non-bridge minter mints tokens
-  /// @param from The minter doing the minting
-  /// @param to The account that gets the newly minted tokens
-  /// @param amount Amount of tokens minted
   event TokenMinterMinted(address indexed from, address indexed to, uint256 amount);
-
-  /// @notice Event Emitted when the contract is paused
-  event Paused();
-
-  /// @notice Event Emitted when the contract is unpaused
   event Unpaused();
 
-  /// @notice Event Emitted when an address is frozen
-  /// @param account The account being frozen
-  event AccountFrozen(address account);
-
-  /// @notice Event Emitted when an address is unfrozen
-  /// @param account The account being thawed
-  event AccountThawed(address account);
-
-  /* ========== ERRORS ========== */
-  error ArrayMisMatch();
-  error IsPaused();
-  error IsFrozen();
-  error OwnerCannotInitToZeroAddress();
+  function DOMAIN_SEPARATOR() external view returns (bytes32);
+  function acceptOwnership() external;
+  function addMinter(address minter_address) external;
+  function allowance(address owner, address spender) external view returns (uint256);
+  function approve(address spender, uint256 value) external returns (bool);
+  function balanceOf(address account) external view returns (uint256);
+  function burn(uint256 value) external;
+  function burn(address _owner, uint256 _amount) external;
+  function burnFrom(address account, uint256 value) external;
+  function burnMany(address[] memory _owners, uint256[] memory _amounts) external;
+  function decimals() external view returns (uint8);
+  function eip712Domain()
+    external
+    view
+    returns (
+      bytes1 fields,
+      string memory name,
+      string memory version,
+      uint256 chainId,
+      address verifyingContract,
+      bytes32 salt,
+      uint256[] memory extensions
+    );
+  function freeze(address _owner) external;
+  function freezeMany(address[] memory _owners) external;
+  function initialize(address _owner, string memory _name, string memory _symbol) external;
+  function isFrozen(address) external view returns (bool);
+  function isPaused() external view returns (bool);
+  function minter_burn_from(address b_address, uint256 b_amount) external;
+  function minter_mint(address m_address, uint256 m_amount) external;
+  function minters(address) external view returns (bool);
+  function minters_array(uint256) external view returns (address);
+  function name() external view returns (string memory);
+  function nonces(address owner) external view returns (uint256);
+  function owner() external view returns (address);
+  function pause() external;
+  function pendingOwner() external view returns (address);
+  function permit(
+    address owner,
+    address spender,
+    uint256 value,
+    uint256 deadline,
+    uint8 v,
+    bytes32 r,
+    bytes32 s
+  ) external;
+  function removeMinter(address minter_address) external;
+  function renounceOwnership() external;
+  function symbol() external view returns (string memory);
+  function thaw(address _owner) external;
+  function thawMany(address[] memory _owners) external;
+  function totalSupply() external view returns (uint256);
+  function transfer(address to, uint256 value) external returns (bool);
+  function transferFrom(address from, address to, uint256 value) external returns (bool);
+  function transferOwnership(address newOwner) external;
+  function unpause() external;
 }
 
 
@@ -2483,6 +2378,14 @@
 interface IRWAIssuer {
   function subscribe(uint256 inAmount, address stablecoin) external;
   function subscribe(address to, uint256 inAmount, address stablecoin) external;
+}
+
+
+// SPDX-License-Identifier: MIT
+pragma solidity >=0.8.0;
+
+interface IWtgxxCustodian {
+  function shuffleToWtgxx(uint256 amountUsdc) external;
 }
 
 
@@ -4171,277 +4074,6 @@
 
 
 // SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v5.1.0) (token/ERC20/extensions/ERC20Permit.sol)
-
-pragma solidity ^0.8.20;
-
-import {IERC20Permit} from "./IERC20Permit.sol";
-import {ERC20} from "../ERC20.sol";
-import {ECDSA} from "../../../utils/cryptography/ECDSA.sol";
-import {EIP712} from "../../../utils/cryptography/EIP712.sol";
-import {Nonces} from "../../../utils/Nonces.sol";
-
-/**
- * @dev Implementation of the ERC-20 Permit extension allowing approvals to be made via signatures, as defined in
- * https://eips.ethereum.org/EIPS/eip-2612[ERC-2612].
- *
- * Adds the {permit} method, which can be used to change an account's ERC-20 allowance (see {IERC20-allowance}) by
- * presenting a message signed by the account. By not relying on `{IERC20-approve}`, the token holder account doesn't
- * need to send a transaction, and thus is not required to hold Ether at all.
- */
-abstract contract ERC20Permit is ERC20, IERC20Permit, EIP712, Nonces {
-    bytes32 private constant PERMIT_TYPEHASH =
-        keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)");
-
-    /**
-     * @dev Permit deadline has expired.
-     */
-    error ERC2612ExpiredSignature(uint256 deadline);
-
-    /**
-     * @dev Mismatched signature.
-     */
-    error ERC2612InvalidSigner(address signer, address owner);
-
-    /**
-     * @dev Initializes the {EIP712} domain separator using the `name` parameter, and setting `version` to `"1"`.
-     *
-     * It's a good idea to use the same `name` that is defined as the ERC-20 token name.
-     */
-    constructor(string memory name) EIP712(name, "1") {}
-
-    /**
-     * @inheritdoc IERC20Permit
-     */
-    function permit(
-        address owner,
-        address spender,
-        uint256 value,
-        uint256 deadline,
-        uint8 v,
-        bytes32 r,
-        bytes32 s
-    ) public virtual {
-        if (block.timestamp > deadline) {
-            revert ERC2612ExpiredSignature(deadline);
-        }
-
-        bytes32 structHash = keccak256(abi.encode(PERMIT_TYPEHASH, owner, spender, value, _useNonce(owner), deadline));
-
-        bytes32 hash = _hashTypedDataV4(structHash);
-
-        address signer = ECDSA.recover(hash, v, r, s);
-        if (signer != owner) {
-            revert ERC2612InvalidSigner(signer, owner);
-        }
-
-        _approve(owner, spender, value);
-    }
-
-    /**
-     * @inheritdoc IERC20Permit
-     */
-    function nonces(address owner) public view virtual override(IERC20Permit, Nonces) returns (uint256) {
-        return super.nonces(owner);
-    }
-
-    /**
-     * @inheritdoc IERC20Permit
-     */
-    // solhint-disable-next-line func-name-mixedcase
-    function DOMAIN_SEPARATOR() external view virtual returns (bytes32) {
-        return _domainSeparatorV4();
-    }
-}
-
-
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v5.0.0) (token/ERC20/extensions/ERC20Burnable.sol)
-
-pragma solidity ^0.8.20;
-
-import {ERC20} from "../ERC20.sol";
-import {Context} from "../../../utils/Context.sol";
-
-/**
- * @dev Extension of {ERC20} that allows token holders to destroy both their own
- * tokens and those that they have an allowance for, in a way that can be
- * recognized off-chain (via event analysis).
- */
-abstract contract ERC20Burnable is Context, ERC20 {
-    /**
-     * @dev Destroys a `value` amount of tokens from the caller.
-     *
-     * See {ERC20-_burn}.
-     */
-    function burn(uint256 value) public virtual {
-        _burn(_msgSender(), value);
-    }
-
-    /**
-     * @dev Destroys a `value` amount of tokens from `account`, deducting from
-     * the caller's allowance.
-     *
-     * See {ERC20-_burn} and {ERC20-allowance}.
-     *
-     * Requirements:
-     *
-     * - the caller must have allowance for ``accounts``'s tokens of at least
-     * `value`.
-     */
-    function burnFrom(address account, uint256 value) public virtual {
-        _spendAllowance(account, _msgSender(), value);
-        _burn(account, value);
-    }
-}
-
-
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v5.1.0) (utils/StorageSlot.sol)
-// This file was procedurally generated from scripts/generate/templates/StorageSlot.js.
-
-pragma solidity ^0.8.20;
-
-/**
- * @dev Library for reading and writing primitive types to specific storage slots.
- *
- * Storage slots are often used to avoid storage conflict when dealing with upgradeable contracts.
- * This library helps with reading and writing to such slots without the need for inline assembly.
- *
- * The functions in this library return Slot structs that contain a `value` member that can be used to read or write.
- *
- * Example usage to set ERC-1967 implementation slot:
- * ```solidity
- * contract ERC1967 {
- *     // Define the slot. Alternatively, use the SlotDerivation library to derive the slot.
- *     bytes32 internal constant _IMPLEMENTATION_SLOT = 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;
- *
- *     function _getImplementation() internal view returns (address) {
- *         return StorageSlot.getAddressSlot(_IMPLEMENTATION_SLOT).value;
- *     }
- *
- *     function _setImplementation(address newImplementation) internal {
- *         require(newImplementation.code.length > 0);
- *         StorageSlot.getAddressSlot(_IMPLEMENTATION_SLOT).value = newImplementation;
- *     }
- * }
- * ```
- *
- * TIP: Consider using this library along with {SlotDerivation}.
- */
-library StorageSlot {
-    struct AddressSlot {
-        address value;
-    }
-
-    struct BooleanSlot {
-        bool value;
-    }
-
-    struct Bytes32Slot {
-        bytes32 value;
-    }
-
-    struct Uint256Slot {
-        uint256 value;
-    }
-
-    struct Int256Slot {
-        int256 value;
-    }
-
-    struct StringSlot {
-        string value;
-    }
-
-    struct BytesSlot {
-        bytes value;
-    }
-
-    /**
-     * @dev Returns an `AddressSlot` with member `value` located at `slot`.
-     */
-    function getAddressSlot(bytes32 slot) internal pure returns (AddressSlot storage r) {
-        assembly ("memory-safe") {
-            r.slot := slot
-        }
-    }
-
-    /**
-     * @dev Returns a `BooleanSlot` with member `value` located at `slot`.
-     */
-    function getBooleanSlot(bytes32 slot) internal pure returns (BooleanSlot storage r) {
-        assembly ("memory-safe") {
-            r.slot := slot
-        }
-    }
-
-    /**
-     * @dev Returns a `Bytes32Slot` with member `value` located at `slot`.
-     */
-    function getBytes32Slot(bytes32 slot) internal pure returns (Bytes32Slot storage r) {
-        assembly ("memory-safe") {
-            r.slot := slot
-        }
-    }
-
-    /**
-     * @dev Returns a `Uint256Slot` with member `value` located at `slot`.
-     */
-    function getUint256Slot(bytes32 slot) internal pure returns (Uint256Slot storage r) {
-        assembly ("memory-safe") {
-            r.slot := slot
-        }
-    }
-
-    /**
-     * @dev Returns a `Int256Slot` with member `value` located at `slot`.
-     */
-    function getInt256Slot(bytes32 slot) internal pure returns (Int256Slot storage r) {
-        assembly ("memory-safe") {
-            r.slot := slot
-        }
-    }
-
-    /**
-     * @dev Returns a `StringSlot` with member `value` located at `slot`.
-     */
-    function getStringSlot(bytes32 slot) internal pure returns (StringSlot storage r) {
-        assembly ("memory-safe") {
-            r.slot := slot
-        }
-    }
-
-    /**
-     * @dev Returns an `StringSlot` representation of the string storage pointer `store`.
-     */
-    function getStringSlot(string storage store) internal pure returns (StringSlot storage r) {
-        assembly ("memory-safe") {
-            r.slot := store.slot
-        }
-    }
-
-    /**
-     * @dev Returns a `BytesSlot` with member `value` located at `slot`.
-     */
-    function getBytesSlot(bytes32 slot) internal pure returns (BytesSlot storage r) {
-        assembly ("memory-safe") {
-            r.slot := slot
-        }
-    }
-
-    /**
-     * @dev Returns an `BytesSlot` representation of the bytes storage pointer `store`.
-     */
-    function getBytesSlot(bytes storage store) internal pure returns (BytesSlot storage r) {
-        assembly ("memory-safe") {
-            r.slot := store.slot
-        }
-    }
-}
-
-
-// SPDX-License-Identifier: MIT
 // OpenZeppelin Contracts (last updated v5.0.0) (interfaces/IERC20.sol)
 
 pragma solidity ^0.8.20;
@@ -4490,490 +4122,6 @@
      * @dev A necessary precompile is missing.
      */
     error MissingPrecompile(address);
-}
-
-
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v5.1.0) (token/ERC20/extensions/IERC20Permit.sol)
-
-pragma solidity ^0.8.20;
-
-/**
- * @dev Interface of the ERC-20 Permit extension allowing approvals to be made via signatures, as defined in
- * https://eips.ethereum.org/EIPS/eip-2612[ERC-2612].
- *
- * Adds the {permit} method, which can be used to change an account's ERC-20 allowance (see {IERC20-allowance}) by
- * presenting a message signed by the account. By not relying on {IERC20-approve}, the token holder account doesn't
- * need to send a transaction, and thus is not required to hold Ether at all.
- *
- * ==== Security Considerations
- *
- * There are two important considerations concerning the use of `permit`. The first is that a valid permit signature
- * expresses an allowance, and it should not be assumed to convey additional meaning. In particular, it should not be
- * considered as an intention to spend the allowance in any specific way. The second is that because permits have
- * built-in replay protection and can be submitted by anyone, they can be frontrun. A protocol that uses permits should
- * take this into consideration and allow a `permit` call to fail. Combining these two aspects, a pattern that may be
- * generally recommended is:
- *
- * ```solidity
- * function doThingWithPermit(..., uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s) public {
- *     try token.permit(msg.sender, address(this), value, deadline, v, r, s) {} catch {}
- *     doThing(..., value);
- * }
- *
- * function doThing(..., uint256 value) public {
- *     token.safeTransferFrom(msg.sender, address(this), value);
- *     ...
- * }
- * ```
- *
- * Observe that: 1) `msg.sender` is used as the owner, leaving no ambiguity as to the signer intent, and 2) the use of
- * `try/catch` allows the permit to fail and makes the code tolerant to frontrunning. (See also
- * {SafeERC20-safeTransferFrom}).
- *
- * Additionally, note that smart contract wallets (such as Argent or Safe) are not able to produce permit signatures, so
- * contracts should have entry points that don't rely on permit.
- */
-interface IERC20Permit {
-    /**
-     * @dev Sets `value` as the allowance of `spender` over ``owner``'s tokens,
-     * given ``owner``'s signed approval.
-     *
-     * IMPORTANT: The same issues {IERC20-approve} has related to transaction
-     * ordering also apply here.
-     *
-     * Emits an {Approval} event.
-     *
-     * Requirements:
-     *
-     * - `spender` cannot be the zero address.
-     * - `deadline` must be a timestamp in the future.
-     * - `v`, `r` and `s` must be a valid `secp256k1` signature from `owner`
-     * over the EIP712-formatted function arguments.
-     * - the signature must use ``owner``'s current nonce (see {nonces}).
-     *
-     * For more information on the signature format, see the
-     * https://eips.ethereum.org/EIPS/eip-2612#specification[relevant EIP
-     * section].
-     *
-     * CAUTION: See Security Considerations above.
-     */
-    function permit(
-        address owner,
-        address spender,
-        uint256 value,
-        uint256 deadline,
-        uint8 v,
-        bytes32 r,
-        bytes32 s
-    ) external;
-
-    /**
-     * @dev Returns the current nonce for `owner`. This value must be
-     * included whenever a signature is generated for {permit}.
-     *
-     * Every successful call to {permit} increases ``owner``'s nonce by one. This
-     * prevents a signature from being used multiple times.
-     */
-    function nonces(address owner) external view returns (uint256);
-
-    /**
-     * @dev Returns the domain separator used in the encoding of the signature for {permit}, as defined by {EIP712}.
-     */
-    // solhint-disable-next-line func-name-mixedcase
-    function DOMAIN_SEPARATOR() external view returns (bytes32);
-}
-
-
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v5.1.0) (utils/cryptography/ECDSA.sol)
-
-pragma solidity ^0.8.20;
-
-/**
- * @dev Elliptic Curve Digital Signature Algorithm (ECDSA) operations.
- *
- * These functions can be used to verify that a message was signed by the holder
- * of the private keys of a given address.
- */
-library ECDSA {
-    enum RecoverError {
-        NoError,
-        InvalidSignature,
-        InvalidSignatureLength,
-        InvalidSignatureS
-    }
-
-    /**
-     * @dev The signature derives the `address(0)`.
-     */
-    error ECDSAInvalidSignature();
-
-    /**
-     * @dev The signature has an invalid length.
-     */
-    error ECDSAInvalidSignatureLength(uint256 length);
-
-    /**
-     * @dev The signature has an S value that is in the upper half order.
-     */
-    error ECDSAInvalidSignatureS(bytes32 s);
-
-    /**
-     * @dev Returns the address that signed a hashed message (`hash`) with `signature` or an error. This will not
-     * return address(0) without also returning an error description. Errors are documented using an enum (error type)
-     * and a bytes32 providing additional information about the error.
-     *
-     * If no error is returned, then the address can be used for verification purposes.
-     *
-     * The `ecrecover` EVM precompile allows for malleable (non-unique) signatures:
-     * this function rejects them by requiring the `s` value to be in the lower
-     * half order, and the `v` value to be either 27 or 28.
-     *
-     * IMPORTANT: `hash` _must_ be the result of a hash operation for the
-     * verification to be secure: it is possible to craft signatures that
-     * recover to arbitrary addresses for non-hashed data. A safe way to ensure
-     * this is by receiving a hash of the original message (which may otherwise
-     * be too long), and then calling {MessageHashUtils-toEthSignedMessageHash} on it.
-     *
-     * Documentation for signature generation:
-     * - with https://web3js.readthedocs.io/en/v1.3.4/web3-eth-accounts.html#sign[Web3.js]
-     * - with https://docs.ethers.io/v5/api/signer/#Signer-signMessage[ethers]
-     */
-    function tryRecover(
-        bytes32 hash,
-        bytes memory signature
-    ) internal pure returns (address recovered, RecoverError err, bytes32 errArg) {
-        if (signature.length == 65) {
-            bytes32 r;
-            bytes32 s;
-            uint8 v;
-            // ecrecover takes the signature parameters, and the only way to get them
-            // currently is to use assembly.
-            assembly ("memory-safe") {
-                r := mload(add(signature, 0x20))
-                s := mload(add(signature, 0x40))
-                v := byte(0, mload(add(signature, 0x60)))
-            }
-            return tryRecover(hash, v, r, s);
-        } else {
-            return (address(0), RecoverError.InvalidSignatureLength, bytes32(signature.length));
-        }
-    }
-
-    /**
-     * @dev Returns the address that signed a hashed message (`hash`) with
-     * `signature`. This address can then be used for verification purposes.
-     *
-     * The `ecrecover` EVM precompile allows for malleable (non-unique) signatures:
-     * this function rejects them by requiring the `s` value to be in the lower
-     * half order, and the `v` value to be either 27 or 28.
-     *
-     * IMPORTANT: `hash` _must_ be the result of a hash operation for the
-     * verification to be secure: it is possible to craft signatures that
-     * recover to arbitrary addresses for non-hashed data. A safe way to ensure
-     * this is by receiving a hash of the original message (which may otherwise
-     * be too long), and then calling {MessageHashUtils-toEthSignedMessageHash} on it.
-     */
-    function recover(bytes32 hash, bytes memory signature) internal pure returns (address) {
-        (address recovered, RecoverError error, bytes32 errorArg) = tryRecover(hash, signature);
-        _throwError(error, errorArg);
-        return recovered;
-    }
-
-    /**
-     * @dev Overload of {ECDSA-tryRecover} that receives the `r` and `vs` short-signature fields separately.
-     *
-     * See https://eips.ethereum.org/EIPS/eip-2098[ERC-2098 short signatures]
-     */
-    function tryRecover(
-        bytes32 hash,
-        bytes32 r,
-        bytes32 vs
-    ) internal pure returns (address recovered, RecoverError err, bytes32 errArg) {
-        unchecked {
-            bytes32 s = vs & bytes32(0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);
-            // We do not check for an overflow here since the shift operation results in 0 or 1.
-            uint8 v = uint8((uint256(vs) >> 255) + 27);
-            return tryRecover(hash, v, r, s);
-        }
-    }
-
-    /**
-     * @dev Overload of {ECDSA-recover} that receives the `r and `vs` short-signature fields separately.
-     */
-    function recover(bytes32 hash, bytes32 r, bytes32 vs) internal pure returns (address) {
-        (address recovered, RecoverError error, bytes32 errorArg) = tryRecover(hash, r, vs);
-        _throwError(error, errorArg);
-        return recovered;
-    }
-
-    /**
-     * @dev Overload of {ECDSA-tryRecover} that receives the `v`,
-     * `r` and `s` signature fields separately.
-     */
-    function tryRecover(
-        bytes32 hash,
-        uint8 v,
-        bytes32 r,
-        bytes32 s
-    ) internal pure returns (address recovered, RecoverError err, bytes32 errArg) {
-        // EIP-2 still allows signature malleability for ecrecover(). Remove this possibility and make the signature
-        // unique. Appendix F in the Ethereum Yellow paper (https://ethereum.github.io/yellowpaper/paper.pdf), defines
-        // the valid range for s in (301): 0 < s < secp256k1n ÷ 2 + 1, and for v in (302): v ∈ {27, 28}. Most
-        // signatures from current libraries generate a unique signature with an s-value in the lower half order.
-        //
-        // If your library generates malleable signatures, such as s-values in the upper range, calculate a new s-value
-        // with 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141 - s1 and flip v from 27 to 28 or
-        // vice versa. If your library also generates signatures with 0/1 for v instead 27/28, add 27 to v to accept
-        // these malleable signatures as well.
-        if (uint256(s) > 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5D576E7357A4501DDFE92F46681B20A0) {
-            return (address(0), RecoverError.InvalidSignatureS, s);
-        }
-
-        // If the signature is valid (and not malleable), return the signer address
-        address signer = ecrecover(hash, v, r, s);
-        if (signer == address(0)) {
-            return (address(0), RecoverError.InvalidSignature, bytes32(0));
-        }
-
-        return (signer, RecoverError.NoError, bytes32(0));
-    }
-
-    /**
-     * @dev Overload of {ECDSA-recover} that receives the `v`,
-     * `r` and `s` signature fields separately.
-     */
-    function recover(bytes32 hash, uint8 v, bytes32 r, bytes32 s) internal pure returns (address) {
-        (address recovered, RecoverError error, bytes32 errorArg) = tryRecover(hash, v, r, s);
-        _throwError(error, errorArg);
-        return recovered;
-    }
-
-    /**
-     * @dev Optionally reverts with the corresponding custom error according to the `error` argument provided.
-     */
-    function _throwError(RecoverError error, bytes32 errorArg) private pure {
-        if (error == RecoverError.NoError) {
-            return; // no error: do nothing
-        } else if (error == RecoverError.InvalidSignature) {
-            revert ECDSAInvalidSignature();
-        } else if (error == RecoverError.InvalidSignatureLength) {
-            revert ECDSAInvalidSignatureLength(uint256(errorArg));
-        } else if (error == RecoverError.InvalidSignatureS) {
-            revert ECDSAInvalidSignatureS(errorArg);
-        }
-    }
-}
-
-
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v5.1.0) (utils/cryptography/EIP712.sol)
-
-pragma solidity ^0.8.20;
-
-import {MessageHashUtils} from "./MessageHashUtils.sol";
-import {ShortStrings, ShortString} from "../ShortStrings.sol";
-import {IERC5267} from "../../interfaces/IERC5267.sol";
-
-/**
- * @dev https://eips.ethereum.org/EIPS/eip-712[EIP-712] is a standard for hashing and signing of typed structured data.
- *
- * The encoding scheme specified in the EIP requires a domain separator and a hash of the typed structured data, whose
- * encoding is very generic and therefore its implementation in Solidity is not feasible, thus this contract
- * does not implement the encoding itself. Protocols need to implement the type-specific encoding they need in order to
- * produce the hash of their typed data using a combination of `abi.encode` and `keccak256`.
- *
- * This contract implements the EIP-712 domain separator ({_domainSeparatorV4}) that is used as part of the encoding
- * scheme, and the final step of the encoding to obtain the message digest that is then signed via ECDSA
- * ({_hashTypedDataV4}).
- *
- * The implementation of the domain separator was designed to be as efficient as possible while still properly updating
- * the chain id to protect against replay attacks on an eventual fork of the chain.
- *
- * NOTE: This contract implements the version of the encoding known as "v4", as implemented by the JSON RPC method
- * https://docs.metamask.io/guide/signing-data.html[`eth_signTypedDataV4` in MetaMask].
- *
- * NOTE: In the upgradeable version of this contract, the cached values will correspond to the address, and the domain
- * separator of the implementation contract. This will cause the {_domainSeparatorV4} function to always rebuild the
- * separator from the immutable values, which is cheaper than accessing a cached version in cold storage.
- *
- * @custom:oz-upgrades-unsafe-allow state-variable-immutable
- */
-abstract contract EIP712 is IERC5267 {
-    using ShortStrings for *;
-
-    bytes32 private constant TYPE_HASH =
-        keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)");
-
-    // Cache the domain separator as an immutable value, but also store the chain id that it corresponds to, in order to
-    // invalidate the cached domain separator if the chain id changes.
-    bytes32 private immutable _cachedDomainSeparator;
-    uint256 private immutable _cachedChainId;
-    address private immutable _cachedThis;
-
-    bytes32 private immutable _hashedName;
-    bytes32 private immutable _hashedVersion;
-
-    ShortString private immutable _name;
-    ShortString private immutable _version;
-    string private _nameFallback;
-    string private _versionFallback;
-
-    /**
-     * @dev Initializes the domain separator and parameter caches.
-     *
-     * The meaning of `name` and `version` is specified in
-     * https://eips.ethereum.org/EIPS/eip-712#definition-of-domainseparator[EIP-712]:
-     *
-     * - `name`: the user readable name of the signing domain, i.e. the name of the DApp or the protocol.
-     * - `version`: the current major version of the signing domain.
-     *
-     * NOTE: These parameters cannot be changed except through a xref:learn::upgrading-smart-contracts.adoc[smart
-     * contract upgrade].
-     */
-    constructor(string memory name, string memory version) {
-        _name = name.toShortStringWithFallback(_nameFallback);
-        _version = version.toShortStringWithFallback(_versionFallback);
-        _hashedName = keccak256(bytes(name));
-        _hashedVersion = keccak256(bytes(version));
-
-        _cachedChainId = block.chainid;
-        _cachedDomainSeparator = _buildDomainSeparator();
-        _cachedThis = address(this);
-    }
-
-    /**
-     * @dev Returns the domain separator for the current chain.
-     */
-    function _domainSeparatorV4() internal view returns (bytes32) {
-        if (address(this) == _cachedThis && block.chainid == _cachedChainId) {
-            return _cachedDomainSeparator;
-        } else {
-            return _buildDomainSeparator();
-        }
-    }
-
-    function _buildDomainSeparator() private view returns (bytes32) {
-        return keccak256(abi.encode(TYPE_HASH, _hashedName, _hashedVersion, block.chainid, address(this)));
-    }
-
-    /**
-     * @dev Given an already https://eips.ethereum.org/EIPS/eip-712#definition-of-hashstruct[hashed struct], this
-     * function returns the hash of the fully encoded EIP712 message for this domain.
-     *
-     * This hash can be used together with {ECDSA-recover} to obtain the signer of a message. For example:
-     *
-     * ```solidity
-     * bytes32 digest = _hashTypedDataV4(keccak256(abi.encode(
-     *     keccak256("Mail(address to,string contents)"),
-     *     mailTo,
-     *     keccak256(bytes(mailContents))
-     * )));
-     * address signer = ECDSA.recover(digest, signature);
-     * ```
-     */
-    function _hashTypedDataV4(bytes32 structHash) internal view virtual returns (bytes32) {
-        return MessageHashUtils.toTypedDataHash(_domainSeparatorV4(), structHash);
-    }
-
-    /**
-     * @dev See {IERC-5267}.
-     */
-    function eip712Domain()
-        public
-        view
-        virtual
-        returns (
-            bytes1 fields,
-            string memory name,
-            string memory version,
-            uint256 chainId,
-            address verifyingContract,
-            bytes32 salt,
-            uint256[] memory extensions
-        )
-    {
-        return (
-            hex"0f", // 01111
-            _EIP712Name(),
-            _EIP712Version(),
-            block.chainid,
-            address(this),
-            bytes32(0),
-            new uint256[](0)
-        );
-    }
-
-    /**
-     * @dev The name parameter for the EIP712 domain.
-     *
-     * NOTE: By default this function reads _name which is an immutable value.
-     * It only reads from storage if necessary (in case the value is too large to fit in a ShortString).
-     */
-    // solhint-disable-next-line func-name-mixedcase
-    function _EIP712Name() internal view returns (string memory) {
-        return _name.toStringWithFallback(_nameFallback);
-    }
-
-    /**
-     * @dev The version parameter for the EIP712 domain.
-     *
-     * NOTE: By default this function reads _version which is an immutable value.
-     * It only reads from storage if necessary (in case the value is too large to fit in a ShortString).
-     */
-    // solhint-disable-next-line func-name-mixedcase
-    function _EIP712Version() internal view returns (string memory) {
-        return _version.toStringWithFallback(_versionFallback);
-    }
-}
-
-
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v5.0.0) (utils/Nonces.sol)
-pragma solidity ^0.8.20;
-
-/**
- * @dev Provides tracking nonces for addresses. Nonces will only increment.
- */
-abstract contract Nonces {
-    /**
-     * @dev The nonce used for an `account` is not the expected current nonce.
-     */
-    error InvalidAccountNonce(address account, uint256 currentNonce);
-
-    mapping(address account => uint256) private _nonces;
-
-    /**
-     * @dev Returns the next unused nonce for an address.
-     */
-    function nonces(address owner) public view virtual returns (uint256) {
-        return _nonces[owner];
-    }
-
-    /**
-     * @dev Consumes a nonce.
-     *
-     * Returns the current value and increments nonce.
-     */
-    function _useNonce(address owner) internal virtual returns (uint256) {
-        // For each account, the nonce has an initial value of 0, can only be incremented by one, and cannot be
-        // decremented or reset. This guarantees that the nonce never overflows.
-        unchecked {
-            // It is important to do x++ and not ++x here.
-            return _nonces[owner]++;
-        }
-    }
-
-    /**
-     * @dev Same as {_useNonce} but checking that `nonce` is the next valid for `owner`.
-     */
-    function _useCheckedNonce(address owner, uint256 nonce) internal virtual {
-        uint256 current = _useNonce(owner);
-        if (nonce != current) {
-            revert InvalidAccountNonce(owner, current);
-        }
-    }
 }
 
 
@@ -5002,431 +4150,3 @@
      */
     function supportsInterface(bytes4 interfaceId) external view returns (bool);
 }
-
-
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v5.1.0) (utils/cryptography/MessageHashUtils.sol)
-
-pragma solidity ^0.8.20;
-
-import {Strings} from "../Strings.sol";
-
-/**
- * @dev Signature message hash utilities for producing digests to be consumed by {ECDSA} recovery or signing.
- *
- * The library provides methods for generating a hash of a message that conforms to the
- * https://eips.ethereum.org/EIPS/eip-191[ERC-191] and https://eips.ethereum.org/EIPS/eip-712[EIP 712]
- * specifications.
- */
-library MessageHashUtils {
-    /**
-     * @dev Returns the keccak256 digest of an ERC-191 signed data with version
-     * `0x45` (`personal_sign` messages).
-     *
-     * The digest is calculated by prefixing a bytes32 `messageHash` with
-     * `"\x19Ethereum Signed Message:\n32"` and hashing the result. It corresponds with the
-     * hash signed when using the https://eth.wiki/json-rpc/API#eth_sign[`eth_sign`] JSON-RPC method.
-     *
-     * NOTE: The `messageHash` parameter is intended to be the result of hashing a raw message with
-     * keccak256, although any bytes32 value can be safely used because the final digest will
-     * be re-hashed.
-     *
-     * See {ECDSA-recover}.
-     */
-    function toEth
[truncated — full diff is 64,437 bytes]
> ```

> </details>

> <details>
> <summary>📝 Source diff — upgrade #5 (<code>0xd84d...D0D3</code> → <code>0x4DB9...c529</code>): +76/-13 lines</summary>

> ```diff
--- old_impl
+++ new_impl
@@ -18,8 +18,13 @@
  */
 
 import { FrxUSDCustodian, IERC20 } from "src/deps/FrxUSDCustodian.sol";
+import { FrxUSDCustodianUsdc } from "src/deps/FrxUSDCustodianUsdc.sol";
 
 contract FrxUSDCustodianWithReceiver is FrxUSDCustodian {
+  address constant USDC_CUSTODIAN_MAINNET = 0x4F95C5bA0C7c69FB2f9340E190cCeE890B3bd87c;
+  address constant USDC_MAINNET = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
+  address constant ON_RECEIPT_PRIMARY_ORDER_ADDRESS = 0x63a8bb98D70d0aC73460d22b6756528a087ecBf8;
+
   constructor(address _frxUSD, address _custodianTkn) FrxUSDCustodian(_frxUSD, _custodianTkn) {}
 
   function onERC721Received(
@@ -37,27 +42,28 @@
   /// @dev Assumes WTGXX will be minted to the whitelisted address who sends usdc to the
   ///      `onReceiptPrimaryOrderAddress`
   function shuffleToWtgxx(uint256 amountUsdc) external {
-    if (msg.sender != 0x4F95C5bA0C7c69FB2f9340E190cCeE890B3bd87c) revert OnlyUsdcCustodian();
-    IERC20 USDC = IERC20(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48);
-    address onReceiptPrimaryOrderAddress = 0x63a8bb98D70d0aC73460d22b6756528a087ecBf8;
-    USDC.transfer(onReceiptPrimaryOrderAddress, amountUsdc);
+    if (msg.sender != USDC_CUSTODIAN_MAINNET) revert OnlyUsdcCustodian();
+    IERC20 USDC = IERC20(USDC_MAINNET);
+    USDC.transfer(ON_RECEIPT_PRIMARY_ORDER_ADDRESS, amountUsdc);
     emit UsdcShuffledToWtgxxAsync(amountUsdc);
   }
 
+  /// @notice Function to async redeem WTGXX for USDC and have the USDC sent to the USDC Custodian
+  /// @param wtgxxToRedeem The amount of WTGXX we want to redeem for USDC
+  function redeemForUsdcAsync(uint256 wtgxxToRedeem) public {
+    if (!isApprovedOperator[msg.sender]) revert NotOperator();
+    custodianTkn.transfer(USDC_CUSTODIAN_MAINNET, wtgxxToRedeem);
+    FrxUSDCustodianUsdc(USDC_CUSTODIAN_MAINNET).redeemWtgxx(wtgxxToRedeem);
+    emit WTGXXRedeemedForUsdc(wtgxxToRedeem);
+  }
+
   /// @notice Overriden function not to be used in child
-  function shuffleToRwa(
-    uint256, 
-    uint256, 
-    uint8
-  ) public override {
+  function shuffleToRwa(uint256, uint256, uint8) public override {
     revert NotImplemented();
   }
 
   /// @notice Overriden function not to be used in child
-  function shuffleToRwa(
-    uint256,
-    uint256
-  ) external override {
+  function shuffleToRwa(uint256, uint256) external override {
     revert NotImplemented();
   }
 
@@ -70,6 +76,7 @@
   /// @notice Error Emitted when calling function not intended for this instance
   error NotImplemented();
 
+  event WTGXXRedeemedForUsdc(uint256 wtgxxAmount);
 }
 
 
@@ -726,6 +733,62 @@
 
   /// @notice When owner is set to address(0) in initialize
   error OwnerCannotInitToZeroAddress();
+}
+
+
+// SPDX-License-Identifier: MIT
+// @version 0.2.8
+pragma solidity >=0.8.0;
+/**
+ * ====================================================================
+ * |     ______                   _______                             |
+ * |    / _____________ __  __   / ____(_____  ____ _____  ________   |
+ * |   / /_  / ___/ __ `| |/_/  / /_  / / __ \/ __ `/ __ \/ ___/ _ \  |
+ * |  / __/ / /  / /_/ _>  <   / __/ / / / / / /_/ / / / / /__/  __/  |
+ * | /_/   /_/   \__,_/_/|_|  /_/   /_/_/ /_/\__,_/_/ /_/\___/\___/   |
+ * |                                                                  |
+ * ====================================================================
+ * ========================= FrxUSDCustodian ==========================
+ * ====================================================================
+ * FrxUSD Custodian contract for the Frax protocol to custody tokens at a 1-1 ratio
+ * Frax Finance: https://github.com/FraxFinance
+ */
+import { FrxUSDCustodian, IERC20 } from "src/deps/FrxUSDCustodian.sol";
+
+contract FrxUSDCustodianUsdc is FrxUSDCustodian {
+  address public constant WTGXX_CUSTODIAN_MAINNET = 0x860Cc723935FC9A15fF8b1A94237a711DFeF7857;
+  address public constant WTGXX_MAINNET = 0x1feCF3d9d4Fee7f2c02917A66028a48C6706c179;
+  address public constant ON_RECEIPT_PRIMARY_ORDER_ADDRESS = 0x63a8bb98D70d0aC73460d22b6756528a087ecBf8;
+
+  constructor(address _frxUSD, address _custodianTkn) FrxUSDCustodian(_frxUSD, _custodianTkn) {}
+
+  /// @notice Hook needed to receive WTGXX
+  function onERC721Received(
+    address operator,
+    address from,
+    uint256 tokenId,
+    bytes calldata data
+  ) external pure returns (bytes4) {
+    return FrxUSDCustodianUsdc.onERC721Received.selector;
+  }
+
+  /// @notice Function to faciliate the redemption of WTGXX to USDC
+  /// @param amountWtgxx The amount of wtgxx RWA to redeem for USDC
+  /// @dev Assumes required WTGXX is already present in this contract
+  /// @dev Wisdom tree enforces that sender of asset is recipient of USDC hence this call
+  /// @dev only callable by WTGXX custodian contract in `redeemForUsdcAsync`
+  function redeemWtgxx(uint256 amountWtgxx) public {
+    if (msg.sender != WTGXX_CUSTODIAN_MAINNET) revert OnlyWTGXXCustodian();
+    IERC20 wtgxx = IERC20(WTGXX_MAINNET);
+    wtgxx.transfer(ON_RECEIPT_PRIMARY_ORDER_ADDRESS, amountWtgxx);
+    emit WtgxxRedemptionAsync(amountWtgxx);
+  }
+
+  /// @notice When msg.sender is not WTGXX custodian address
+  error OnlyWTGXXCustodian();
+
+  /// @notice Event Emitted on redemption
+  event WtgxxRedemptionAsync(uint256 wtgxxAmountSent);
 }
 
 
> ```

> </details>

> > 💰 **Inherited supply authority** — holds `minter()` on **FrxUSD**. Access controls on this contract gate root token supply.

> 🔒 **Immutable References:** `custodianTkn()` → WTGXX

> ✅ **Two-step admin transfer:** `OZ Ownable2Step` — prevents accidental hand-off (request → accept flow).

### > 🔴 `upgradeability (TransparentUpgradeable)`

> > ⚠️ **CRITICAL** — Upgradeability allows arbitrary code replacement. Must be behind both a Multisig AND a Timelock.

> **Privileged write functions:**  
> **Capabilities:** ⬆️ **UPGRADE**
> - `upgradeTo(address)` — Upgrade proxy implementation to a new address `[UPGRADE]`
> - `upgradeToAndCall(address,bytes)` — Upgrade proxy implementation and call an initializer `[UPGRADE]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xb898Ad2976b4d8f2E21521C9db16b7497825E503` | Compound Timelock (1d) | 🟢 LOW | — | Storage only | 1d delay (⚠ changed 1x) |


> **Delay history for `Compound Timelock (1d)` (0xb898...E503):** 1d → 1d

### > 🟠 `frxUSD()`

> **Privileged write functions:**  
> **Capabilities:** 💰 **SUPPLY**
> - `deposit(uint256 _assetsIn, address _receiver)` — Deposit a specified amount of underlying tokens and generate shares. Make sure to approve msg.sender's assets to this contract first. See {IERC4626-deposit} `[SUPPLY]`
> - `mint(uint256 _sharesOut, address _receiver)` — Mint a specified amount of shares using underlying asset tokens. Make sure to approve msg.sender's assets to this contract first. See {IERC4626-mint} `[SUPPLY]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xCAcd6fd266aF91b8AeD52aCCc382b4e165586E29` | frxUSD (TransparentUpgradeableProxy) | 🟠 HIGH | — | Storage only |  |

### > 🟢 `owner()`

> **Privileged write functions:**  
> **Capabilities:** ⚙️ **CONFIG** 💰 **SUPPLY**
> - `setMintRedeemFee(uint256 _mintFee, uint _redeemFee)` — Set the fee for the contract on mint|deposit/redeem|withdraw flow
> - `recoverERC20(address _tokenAddress, uint256 _tokenAmount)` — Added to support tokens
> - `setMintCap(uint256 _mintCap)` — Set the mint cap for frxUSD minting `[SUPPLY]`
> - `setApprovedOperator(address _operator, bool _status)` — Set the status for a custodian operator only callable via `owner`
> - `setMinAfterShuffle(uint256 _minAfterShuffle)` — Set the `minAfterShuffle` variable after the call to `shuffleToRwa` only callable via `owner`
> - `transferOwnership(address newOwner)` — Starts the ownership transfer of the contract to a new account. Replaces the pending transfer if there is one. Can only be called by the current owner.
> - `renounceOwnership()` — Leaves the contract without owner. It will not be possible to call `onlyOwner` functions. Can only be called by the current owner.
> - `acceptOwnership()` — Second step of `OZ Ownable2Step` — callable by the pending holder set via `transferOwnership`, not by the current role. Included here to surface the full transfer handoff. `[CONFIG]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xfFFffF4F3baC444b2C0ecf2A1840d018bE783937` | Gnosis Safe 4/7 | 🟢 LOW | — | Storage+Events | 4/7 signers |

> **Signers of `Gnosis Safe 4/7` (0xfFFf...3937):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x6933BCC3e96f1C4d2cb73Cb391d854b18Ab7A4F2` | EOA ⚠️ Hot wallet (1,993 txs) | — | EOA |
> | `0xcbc616D595D38483e6AdC45C7E426f44bF230928` | EOA ⚠️ Hot wallet (1,092 txs) | — | EOA |
> | `0x17e06ce6914E3969f7BD37D8b2a563890cA1c96e` | EOA ⚠️ Hot wallet (2,122 txs) | — | EOA |
> | `0xc8dE9f45601DA8C76158b8CAF3E56E8A037F2228` | EOA | — | EOA |
> | `0x6e74053a3798e0fC9a9775F7995316b27f21c4D2` | EOA ⚠️ Hot wallet (4,940 txs) | — | EOA |
> | `0xDf41722D7b1355dB08D4e7D0528fE9c82377Bb37` | EOA | — | EOA |
> | `0xC6EF452b0de9E95Ccb153c2A5A7a90154aab3419` | EOA | — | EOA |

### > 🟢 `pendingOwner()`


> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xfFFffF4F3baC444b2C0ecf2A1840d018bE783937` | Gnosis Safe 4/7 | 🟢 LOW | — | Events only | 4/7 signers |

> **Signers of `Gnosis Safe 4/7` (0xfFFf...3937):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x6933BCC3e96f1C4d2cb73Cb391d854b18Ab7A4F2` | EOA ⚠️ Hot wallet (1,993 txs) | — | EOA |
> | `0xcbc616D595D38483e6AdC45C7E426f44bF230928` | EOA ⚠️ Hot wallet (1,092 txs) | — | EOA |
> | `0x17e06ce6914E3969f7BD37D8b2a563890cA1c96e` | EOA ⚠️ Hot wallet (2,122 txs) | — | EOA |
> | `0xc8dE9f45601DA8C76158b8CAF3E56E8A037F2228` | EOA | — | EOA |
> | `0x6e74053a3798e0fC9a9775F7995316b27f21c4D2` | EOA ⚠️ Hot wallet (4,940 txs) | — | EOA |
> | `0xDf41722D7b1355dB08D4e7D0528fE9c82377Bb37` | EOA | — | EOA |
> | `0xC6EF452b0de9E95Ccb153c2A5A7a90154aab3419` | EOA | — | EOA |

> #### 🔧 Permissioned Parameters

> **`isApprovedOperator`** *(per-asset)*

> | Asset | Current Value |
> |---|---|
> | EOA `0x9032...bc6F` | `False` |
> | EOA `0xb84c...7D94` | `True` |

> | Field | Value |
> |---|---|
> | Setter | `setApprovedOperator(address _operator, bool _status)` |
> | Gated by | `owner()` |
> | Tags | — |
> | Last changed | 2026-06-15 |
> | Changed by | `0xfFFf...3937` (Gnosis Safe 4/7) |
> | Total changes | 1 |

> **Recent changes:**

> | # | Asset | Value | Set By | Date |
> |---|---|---|---|---|
> | 1 | EOA | `_status=False` | `0xfFFf...3937` (Gnosis Safe 4/7) | 2026-06-15 |

> **`minAfterShuffle`** ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `0` |
> | Setter | `setMinAfterShuffle(uint256 _minAfterShuffle)` |
> | Gated by | `owner()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`mintCap`**

> | Field | Value |
> |---|---|
> | Current Value | `25000000000000000000000000 (25,000,000.000000e18)` |
> | Setter | `setMintCap(uint256 _mintCap)` |
> | Gated by | `owner()` |
> | Tags | `SUPPLY` |
> | Last changed | 2026-06-10 |
> | Changed by | `0xfFFf...3937` (Gnosis Safe 4/7) |
> | Total changes | 2 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `_mintCap=25000000000000000000000000 (25,000,000.000000e18)` | `0xfFFf...3937` (Gnosis Safe 4/7) | 2026-06-10 |
> | 2 | `25000000000000000000000000 (25,000,000.000000e18)` | `0xc8dE...2228` (EOA) | 2026-06-10 |

> **`mintFee`** ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `0` |
> | Setter | `setMintRedeemFee(uint256 _mintFee, uint _redeemFee)` |
> | Gated by | `owner()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> #### 💰 Supply Actions

> _Mint / redeem / burn call tracking — last 5 calls per function, total counts preserved._

> **`deposit`** *(per-asset)*

> | Field | Value |
> |---|---|
> | Setter | `deposit(uint256 _assetsIn, address _receiver)` |
> | Gated by | `frxUSD()` |
> | Tags | `SUPPLY` |
> | Last called | 2026-04-15 |
> | Called by | `0x5D99...d71a` |
> | Total calls | 1 |

> **Recent changes:**

> | # | Asset | Value | Set By | Date |
> |---|---|---|---|---|
> | 1 | EOA | `5000000000000000000 (5.000000e18)` | `0x5D99...d71a` | 2026-04-15 |

> **`mint`** *(per-asset)* ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Setter | `mint(uint256 _sharesOut, address _receiver)` |
> | Gated by | `frxUSD()` |
> | Tags | `SUPPLY` |
> | Last called | — |
> | Called by | — |
> | Total calls | 0 ❄️ |

---
<a id="c-0xe827abf9f462ac4f147753d86bc5f91e186e4e9c"></a>
## > FrxUSDCustodian `0xE827ABf9F462Ac4f147753D86bc5f91E186E4E9c`

> > ⚠️ **Upgradeable** (TransparentUpgradeable) — impl: `0xBcCD08e2996a5c748E01FDE3FecA959dEe24276b`

> **Proxy History (2 events):**

> | # | Date | Event | Address | Key Changes | Tx |
> |---|---|---|---|---|---|
> | 1 | 2025-01-29 | Upgrade | `0xBcCD...276b` | Initial deployment | [0x22e44ab0b8eec70d8996a22fe5cff41f542966a51620e6678740c5128301ac8d](https://etherscan.io/tx/0x22e44ab0b8eec70d8996a22fe5cff41f542966a51620e6678740c5128301ac8d) |
> | 2 | 2025-01-29 | Admin Changed | `0x69DC...071f` | Previous: `0x0000...0000` | [0x22e44ab0b8eec70d8996a22fe5cff41f542966a51620e6678740c5128301ac8d](https://etherscan.io/tx/0x22e44ab0b8eec70d8996a22fe5cff41f542966a51620e6678740c5128301ac8d) |

> > 💰 **Inherited supply authority** — holds `minter()` on **FrxUSD**. Access controls on this contract gate root token supply.

> 🔒 **Immutable References:** `custodianTkn()` → BUIDL

> ✅ **Two-step admin transfer:** `OZ Ownable2Step` — prevents accidental hand-off (request → accept flow).

### > 🔴 `upgradeability (TransparentUpgradeable)`

> > ⚠️ **CRITICAL** — Upgradeability allows arbitrary code replacement. Must be behind both a Multisig AND a Timelock.

> **Privileged write functions:**  
> **Capabilities:** ⬆️ **UPGRADE**
> - `upgradeTo(address)` — Upgrade proxy implementation to a new address `[UPGRADE]`
> - `upgradeToAndCall(address,bytes)` — Upgrade proxy implementation and call an initializer `[UPGRADE]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xb898Ad2976b4d8f2E21521C9db16b7497825E503` | Compound Timelock (1d) | 🟢 LOW | — | Storage only | 1d delay (⚠ changed 1x) |


> **Delay history for `Compound Timelock (1d)` (0xb898...E503):** 1d → 1d

### > 🟠 `frxUSD()`

> **Privileged write functions:**  
> **Capabilities:** 💰 **SUPPLY**
> - `deposit(uint256 _assetsIn, address _receiver)` — Deposit a specified amount of underlying tokens and generate shares. Make sure to approve msg.sender's assets to this contract first. See {IERC4626-deposit} `[SUPPLY]`
> - `mint(uint256 _sharesOut, address _receiver)` — Mint a specified amount of shares using underlying asset tokens. Make sure to approve msg.sender's assets to this contract first. See {IERC4626-mint} `[SUPPLY]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xCAcd6fd266aF91b8AeD52aCCc382b4e165586E29` | frxUSD (TransparentUpgradeableProxy) | 🟠 HIGH | — | Storage only |  |

### > 🟢 `owner()`

> **Privileged write functions:**  
> **Capabilities:** ⚙️ **CONFIG** 💰 **SUPPLY**
> - `setMintRedeemFee(uint256 _mintFee, uint _redeemFee)` — Set the fee for the contract on mint|deposit/redeem|withdraw flow
> - `recoverERC20(address _tokenAddress, uint256 _tokenAmount)` — Added to support tokens
> - `setMintCap(uint256 _mintCap)` — Set the mint cap for frxUSD minting `[SUPPLY]`
> - `transferOwnership(address newOwner)` — Starts the ownership transfer of the contract to a new account. Replaces the pending transfer if there is one. Can only be called by the current owner.
> - `renounceOwnership()` — Leaves the contract without owner. It will not be possible to call `onlyOwner` functions. Can only be called by the current owner.
> - `acceptOwnership()` — Second step of `OZ Ownable2Step` — callable by the pending holder set via `transferOwnership`, not by the current role. Included here to surface the full transfer handoff. `[CONFIG]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xfFFffF4F3baC444b2C0ecf2A1840d018bE783937` | Gnosis Safe 4/7 | 🟢 LOW | — | Storage+Events | 4/7 signers |

> **Signers of `Gnosis Safe 4/7` (0xfFFf...3937):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x6933BCC3e96f1C4d2cb73Cb391d854b18Ab7A4F2` | EOA ⚠️ Hot wallet (1,993 txs) | — | EOA |
> | `0xcbc616D595D38483e6AdC45C7E426f44bF230928` | EOA ⚠️ Hot wallet (1,092 txs) | — | EOA |
> | `0x17e06ce6914E3969f7BD37D8b2a563890cA1c96e` | EOA ⚠️ Hot wallet (2,122 txs) | — | EOA |
> | `0xc8dE9f45601DA8C76158b8CAF3E56E8A037F2228` | EOA | — | EOA |
> | `0x6e74053a3798e0fC9a9775F7995316b27f21c4D2` | EOA ⚠️ Hot wallet (4,940 txs) | — | EOA |
> | `0xDf41722D7b1355dB08D4e7D0528fE9c82377Bb37` | EOA | — | EOA |
> | `0xC6EF452b0de9E95Ccb153c2A5A7a90154aab3419` | EOA | — | EOA |

### > 🟢 `pendingOwner()`


> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xfFFffF4F3baC444b2C0ecf2A1840d018bE783937` | Gnosis Safe 4/7 | 🟢 LOW | — | Events only | 4/7 signers |

> **Signers of `Gnosis Safe 4/7` (0xfFFf...3937):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x6933BCC3e96f1C4d2cb73Cb391d854b18Ab7A4F2` | EOA ⚠️ Hot wallet (1,993 txs) | — | EOA |
> | `0xcbc616D595D38483e6AdC45C7E426f44bF230928` | EOA ⚠️ Hot wallet (1,092 txs) | — | EOA |
> | `0x17e06ce6914E3969f7BD37D8b2a563890cA1c96e` | EOA ⚠️ Hot wallet (2,122 txs) | — | EOA |
> | `0xc8dE9f45601DA8C76158b8CAF3E56E8A037F2228` | EOA | — | EOA |
> | `0x6e74053a3798e0fC9a9775F7995316b27f21c4D2` | EOA ⚠️ Hot wallet (4,940 txs) | — | EOA |
> | `0xDf41722D7b1355dB08D4e7D0528fE9c82377Bb37` | EOA | — | EOA |
> | `0xC6EF452b0de9E95Ccb153c2A5A7a90154aab3419` | EOA | — | EOA |

> #### 🔧 Permissioned Parameters

> **`mintCap`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)*

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `100000000000000000000000 (100,000.000000e18)` |
> | Setter | `setMintCap(uint256 _mintCap)` |
> | Gated by | `owner()` |
> | Tags | `SUPPLY` |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`mintFee`** ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `0` |
> | Setter | `setMintRedeemFee(uint256 _mintFee, uint _redeemFee)` |
> | Gated by | `owner()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> #### 💰 Supply Actions

> _Mint / redeem / burn call tracking — last 5 calls per function, total counts preserved._

> **`deposit`** *(per-asset)* ❄️ **DORMANT**

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Setter | `deposit(uint256 _assetsIn, address _receiver)` |
> | Gated by | `frxUSD()` |
> | Tags | `SUPPLY` |
> | Last called | — |
> | Called by | — |
> | Total calls | 0 ❄️ |

> **`mint`** *(per-asset)* ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Setter | `mint(uint256 _sharesOut, address _receiver)` |
> | Gated by | `frxUSD()` |
> | Tags | `SUPPLY` |
> | Last called | — |
> | Called by | — |
> | Total calls | 0 ❄️ |

---
<a id="c-0xfe2ea8de262d956e852f12de108fda57171a0a29"></a>
## > FrxUSDCustodian `0xFE2Ea8dE262d956e852F12DE108fda57171a0a29`

> > ⚠️ **Upgradeable** (TransparentUpgradeable) — impl: `0x1F6D8f7fBe237AeE37FcF9DF958BB8BB5948320e`

> **Proxy History (2 events):**

> | # | Date | Event | Address | Key Changes | Tx |
> |---|---|---|---|---|---|
> | 1 | 2025-07-11 | Upgrade | `0x1F6D...320e` | Initial deployment | [0x3451e81519ad9703f6444c6234de9ce11ef81dd3a8cc678ce9bc243c2894a7d8](https://etherscan.io/tx/0x3451e81519ad9703f6444c6234de9ce11ef81dd3a8cc678ce9bc243c2894a7d8) |
> | 2 | 2025-07-11 | Admin Changed | `0x3cdf...3c1D` | Previous: `0x0000...0000` | [0x3451e81519ad9703f6444c6234de9ce11ef81dd3a8cc678ce9bc243c2894a7d8](https://etherscan.io/tx/0x3451e81519ad9703f6444c6234de9ce11ef81dd3a8cc678ce9bc243c2894a7d8) |

> > 💰 **Inherited supply authority** — holds `minter()` on **FrxUSD**. Access controls on this contract gate root token supply.

> 🔒 **Immutable References:** `custodianTkn()` → USDB (ERC1967Proxy)

> ✅ **Two-step admin transfer:** `OZ Ownable2Step` — prevents accidental hand-off (request → accept flow).

### > 🔴 `upgradeability (TransparentUpgradeable)`

> > ⚠️ **CRITICAL** — Upgradeability allows arbitrary code replacement. Must be behind both a Multisig AND a Timelock.

> **Privileged write functions:**  
> **Capabilities:** ⬆️ **UPGRADE**
> - `upgradeTo(address)` — Upgrade proxy implementation to a new address `[UPGRADE]`
> - `upgradeToAndCall(address,bytes)` — Upgrade proxy implementation and call an initializer `[UPGRADE]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xb898Ad2976b4d8f2E21521C9db16b7497825E503` | Compound Timelock (1d) | 🟢 LOW | — | Storage only | 1d delay (⚠ changed 1x) |


> **Delay history for `Compound Timelock (1d)` (0xb898...E503):** 1d → 1d

### > 🟠 `frxUSD()`

> **Privileged write functions:**  
> **Capabilities:** 💰 **SUPPLY**
> - `deposit(uint256 _assetsIn, address _receiver)` — Deposit a specified amount of underlying tokens and generate shares. Make sure to approve msg.sender's assets to this contract first. See {IERC4626-deposit} `[SUPPLY]`
> - `mint(uint256 _sharesOut, address _receiver)` — Mint a specified amount of shares using underlying asset tokens. Make sure to approve msg.sender's assets to this contract first. See {IERC4626-mint} `[SUPPLY]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xCAcd6fd266aF91b8AeD52aCCc382b4e165586E29` | frxUSD (TransparentUpgradeableProxy) | 🟠 HIGH | — | Storage only |  |

### > 🟢 `owner()`

> **Privileged write functions:**  
> **Capabilities:** ⚙️ **CONFIG** 💰 **SUPPLY**
> - `setMintRedeemFee(uint256 _mintFee, uint _redeemFee)` — Set the fee for the contract on mint|deposit/redeem|withdraw flow
> - `recoverERC20(address _tokenAddress, uint256 _tokenAmount)` — Added to support tokens
> - `setMintCap(uint256 _mintCap)` — Set the mint cap for frxUSD minting `[SUPPLY]`
> - `transferOwnership(address newOwner)` — Starts the ownership transfer of the contract to a new account. Replaces the pending transfer if there is one. Can only be called by the current owner.
> - `renounceOwnership()` — Leaves the contract without owner. It will not be possible to call `onlyOwner` functions. Can only be called by the current owner.
> - `acceptOwnership()` — Second step of `OZ Ownable2Step` — callable by the pending holder set via `transferOwnership`, not by the current role. Included here to surface the full transfer handoff. `[CONFIG]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xfFFffF4F3baC444b2C0ecf2A1840d018bE783937` | Gnosis Safe 4/7 | 🟢 LOW | — | Storage+Events | 4/7 signers |

> **Signers of `Gnosis Safe 4/7` (0xfFFf...3937):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x6933BCC3e96f1C4d2cb73Cb391d854b18Ab7A4F2` | EOA ⚠️ Hot wallet (1,993 txs) | — | EOA |
> | `0xcbc616D595D38483e6AdC45C7E426f44bF230928` | EOA ⚠️ Hot wallet (1,092 txs) | — | EOA |
> | `0x17e06ce6914E3969f7BD37D8b2a563890cA1c96e` | EOA ⚠️ Hot wallet (2,122 txs) | — | EOA |
> | `0xc8dE9f45601DA8C76158b8CAF3E56E8A037F2228` | EOA | — | EOA |
> | `0x6e74053a3798e0fC9a9775F7995316b27f21c4D2` | EOA ⚠️ Hot wallet (4,940 txs) | — | EOA |
> | `0xDf41722D7b1355dB08D4e7D0528fE9c82377Bb37` | EOA | — | EOA |
> | `0xC6EF452b0de9E95Ccb153c2A5A7a90154aab3419` | EOA | — | EOA |

### > 🟢 `pendingOwner()`


> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xfFFffF4F3baC444b2C0ecf2A1840d018bE783937` | Gnosis Safe 4/7 | 🟢 LOW | — | Events only | 4/7 signers |

> **Signers of `Gnosis Safe 4/7` (0xfFFf...3937):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x6933BCC3e96f1C4d2cb73Cb391d854b18Ab7A4F2` | EOA ⚠️ Hot wallet (1,993 txs) | — | EOA |
> | `0xcbc616D595D38483e6AdC45C7E426f44bF230928` | EOA ⚠️ Hot wallet (1,092 txs) | — | EOA |
> | `0x17e06ce6914E3969f7BD37D8b2a563890cA1c96e` | EOA ⚠️ Hot wallet (2,122 txs) | — | EOA |
> | `0xc8dE9f45601DA8C76158b8CAF3E56E8A037F2228` | EOA | — | EOA |
> | `0x6e74053a3798e0fC9a9775F7995316b27f21c4D2` | EOA ⚠️ Hot wallet (4,940 txs) | — | EOA |
> | `0xDf41722D7b1355dB08D4e7D0528fE9c82377Bb37` | EOA | — | EOA |
> | `0xC6EF452b0de9E95Ccb153c2A5A7a90154aab3419` | EOA | — | EOA |

> #### 🔧 Permissioned Parameters

> **`mintCap`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)*

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `100000000000000000000000 (100,000.000000e18)` |
> | Setter | `setMintCap(uint256 _mintCap)` |
> | Gated by | `owner()` |
> | Tags | `SUPPLY` |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`mintFee`** ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `0` |
> | Setter | `setMintRedeemFee(uint256 _mintFee, uint _redeemFee)` |
> | Gated by | `owner()` |
> | Tags | — |
> | Last changed | 2025-12-29 |
> | Changed by | `0xB174...3f27` (Gnosis Safe 3/5) |
> | Total changes | 0 ❄️ |

> #### 💰 Supply Actions

> _Mint / redeem / burn call tracking — last 5 calls per function, total counts preserved._

> **`deposit`** *(per-asset)* 🔄 **ACTIVE** (15 changes)

> > ⚠️ This parameter has been changed **15 times** — monitor for unexpected modifications.

> | Field | Value |
> |---|---|
> | Setter | `deposit(uint256 _assetsIn, address _receiver)` |
> | Gated by | `frxUSD()` |
> | Tags | `SUPPLY` |
> | Last called | 2026-02-23 |
> | Called by | `0xC6EF...3419` (EOA) |
> | Total calls | 15 🔄 |

> **Recent changes (showing last 5 of 15):**

> | # | Asset | Value | Set By | Date |
> |---|---|---|---|---|
> | 1 | RWARouter | `11000725000000000000 (11.000725e18)` | `0xC6EF...3419` (EOA) | 2026-02-23 |
> | 2 | RWARouter | `10000000000000000000 (10.000000e18)` | `0xC6EF...3419` (EOA) | 2026-02-21 |
> | 3 | EOA | `20000000000000000000 (20.000000e18)` | `0x9BD5...063b` | 2026-01-30 |
> | 4 | EOA | `20000000000000000000 (20.000000e18)` | `0x0071...7585` | 2026-01-30 |
> | 5 | EOA | `5000000000000000000 (5.000000e18)` | `0x0071...7585` | 2026-01-30 |

> **`mint`** *(per-asset)* ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Setter | `mint(uint256 _sharesOut, address _receiver)` |
> | Gated by | `frxUSD()` |
> | Tags | `SUPPLY` |
> | Last called | — |
> | Called by | — |
> | Total calls | 0 ❄️ |

---
<a id="c-0xb898ad2976b4d8f2e21521c9db16b7497825e503"></a>
## > Timelock `0xb898Ad2976b4d8f2E21521C9db16b7497825E503`

> > 💰 **Inherited supply authority** — holds `minter()` on **FrxUSD**. Access controls on this contract gate root token supply.

### > 🟢 `admin()`

> **Privileged write functions:**
> - `queueTransaction(address target, uint256 value, string memory signature, bytes memory data, uint256 eta)` — // SPDX-License-Identifier: BSD-3-Clause pragma solidity ^0.8.0;
> - `cancelTransaction(address target, uint256 value, string memory signature, bytes memory data, uint256 eta)`
> - `executeTransaction(address target, uint256 value, string memory signature, bytes memory data, uint256 eta)`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xfFFffF4F3baC444b2C0ecf2A1840d018bE783937` | Gnosis Safe 4/7 | 🟢 LOW | — | Storage only | 4/7 signers |

> **Signers of `Gnosis Safe 4/7` (0xfFFf...3937):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x6933BCC3e96f1C4d2cb73Cb391d854b18Ab7A4F2` | EOA ⚠️ Hot wallet (1,993 txs) | — | EOA |
> | `0xcbc616D595D38483e6AdC45C7E426f44bF230928` | EOA ⚠️ Hot wallet (1,092 txs) | — | EOA |
> | `0x17e06ce6914E3969f7BD37D8b2a563890cA1c96e` | EOA ⚠️ Hot wallet (2,122 txs) | — | EOA |
> | `0xc8dE9f45601DA8C76158b8CAF3E56E8A037F2228` | EOA | — | EOA |
> | `0x6e74053a3798e0fC9a9775F7995316b27f21c4D2` | EOA ⚠️ Hot wallet (4,940 txs) | — | EOA |
> | `0xDf41722D7b1355dB08D4e7D0528fE9c82377Bb37` | EOA | — | EOA |
> | `0xC6EF452b0de9E95Ccb153c2A5A7a90154aab3419` | EOA | — | EOA |

> #### 🔧 Permissioned Parameters

> **`MAXIMUM_DELAY`** 🔒 **IMMUTABLE**

> > 🔒 **Immutable** — declared as a constant in the contract source; cannot be changed without a contract upgrade. Bounds the reachable extreme of any setter that writes a related storage variable.

> | Field | Value |
> |---|---|
> | Current Value | `2592000` |
> | Mutability | 🔒 immutable (constant) |
> | Tags | `IMMUTABLE` |

> **`MINIMUM_DELAY`** 🔒 **IMMUTABLE**

> > 🔒 **Immutable** — declared as a constant in the contract source; cannot be changed without a contract upgrade. Bounds the reachable extreme of any setter that writes a related storage variable.

> | Field | Value |
> |---|---|
> | Current Value | `7200` |
> | Mutability | 🔒 immutable (constant) |
> | Tags | `IMMUTABLE` |

---
<a id="c-0x1a44076050125825900e736c501f859c50fe728c"></a>
## > EndpointV2 `0x1a44076050125825900e736c501f859c50fE728c`

> > 🍃 **Shared infrastructure** (LayerZero EndpointV2) — reachable from the root contract but not specific to this protocol. BFS expansion stopped here; this contract's `owner()` / `delegate()` / role members are NOT followed into the dependency graph because they reflect the infrastructure's own governance, not the protocol's authority surface.

> > 💰 **Inherited supply authority** — holds `minter()` on **FrxUSD**. Access controls on this contract gate root token supply.

> _No roles detected._

---
## ⚡ Authority Concentration

The following addresses hold permissions across multiple contracts or roles in this dependency stack. Concentration of authority increases systemic risk — a single compromised key or colluding multisig can affect multiple systems.

### 🟢 `0xb898Ad2976b4d8f2E21521C9db16b7497825E503` — Compound Timelock (1d)
Controls **9 role(s)** across **8 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| FrxUSD `0xCAcd...6E29` | `minter()` | `minter_burn_from(address b_address, uint256 b_amount)`, `minter_mint(address m_address, uint256 m_amount)` | — |
| FrxUSD `0xCAcd...6E29` | `upgradeability (TransparentUpgradeable)` | `upgradeTo(address)`, `upgradeToAndCall(address,bytes)` | — |
| FrxUSDCustodianUsdc `0x4F95...d87c` | `upgradeability (TransparentUpgradeable)` | `upgradeTo(address)`, `upgradeToAndCall(address,bytes)` | — |
| FraxOFTMintableAdapterUpgradeable `0x566a...e4B0` | `upgradeability (TransparentUpgradeable)` | `upgradeTo(address)`, `upgradeToAndCall(address,bytes)` | — |
| FrxUSDCustodianWithOracle `0x5fbA...4F33` | `upgradeability (TransparentUpgradeable)` | `upgradeTo(address)`, `upgradeToAndCall(address,bytes)` | — |
| FrxUSDCustodianWithReceiver `0x860C...7857` | `upgradeability (TransparentUpgradeable)` | `upgradeTo(address)`, `upgradeToAndCall(address,bytes)` | — |
| FrxUSDCustodian `0xE827...4E9c` | `upgradeability (TransparentUpgradeable)` | `upgradeTo(address)`, `upgradeToAndCall(address,bytes)` | — |
| FrxUSDCustodian `0xFE2E...0a29` | `upgradeability (TransparentUpgradeable)` | `upgradeTo(address)`, `upgradeToAndCall(address,bytes)` | — |
| ProxyAdmin `0x0b2C...4eD6` | `owner()` | `upgradeAndCall(ITransparentUpgradeableProxy proxy, address implementation, bytes memory data)`, `renounceOwnership()`, `transferOwnership(address newOwner)` | — |

### 🟢 `0xfFFffF4F3baC444b2C0ecf2A1840d018bE783937` — Gnosis Safe 4/7
Controls **8 role(s)** across **8 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| FrxUSD `0xCAcd...6E29` | `owner()` | `minter_mint(address m_address, uint256 m_amount)`, `addMinter(address minter_address)`, `removeMinter(address minter_address)`, `addFreezer(address _freezer)` +18 more | — |
| FrxUSDCustodianUsdc `0x4F95...d87c` | `owner()` | `setMintRedeemFee(uint256 _mintFee, uint _redeemFee)`, `recoverERC20(address _tokenAddress, uint256 _tokenAmount)`, `setMintCap(uint256 _mintCap)`, `setApprovedOperator(address _operator, bool _status)` +4 more | — |
| FraxOFTMintableAdapterUpgradeable `0x566a...e4B0` | `owner()` | `setInitialTotalSupply(uint32 _eid, uint256 _amount)`, `setMsgInspector(address _msgInspector)`, `setEnforcedOptions(EnforcedOptionParam[] calldata _enforcedOptions)`, `setPreCrime(address _preCrime)` +4 more | — |
| FrxUSDCustodianWithOracle `0x5fbA...4F33` | `owner()` | `setCustodianOracle(address _custodianOracle, uint256 _maximumOracleDelay)`, `setMintRedeemFee(uint256 _mintFee, uint _redeemFee)`, `recoverERC20(address _tokenAddress, uint256 _tokenAmount)`, `setMintCap(uint256 _mintCap)` +3 more | — |
| FrxUSDCustodianWithReceiver `0x860C...7857` | `owner()` | `setMintRedeemFee(uint256 _mintFee, uint _redeemFee)`, `recoverERC20(address _tokenAddress, uint256 _tokenAmount)`, `setMintCap(uint256 _mintCap)`, `setApprovedOperator(address _operator, bool _status)` +4 more | — |
| FrxUSDCustodian `0xE827...4E9c` | `owner()` | `setMintRedeemFee(uint256 _mintFee, uint _redeemFee)`, `recoverERC20(address _tokenAddress, uint256 _tokenAmount)`, `setMintCap(uint256 _mintCap)`, `transferOwnership(address newOwner)` +2 more | — |
| FrxUSDCustodian `0xFE2E...0a29` | `owner()` | `setMintRedeemFee(uint256 _mintFee, uint _redeemFee)`, `recoverERC20(address _tokenAddress, uint256 _tokenAmount)`, `setMintCap(uint256 _mintCap)`, `transferOwnership(address newOwner)` +2 more | — |
| Timelock `0xb898...E503` | `admin()` | `queueTransaction(address target, uint256 value, string memory signature, bytes memory data, uint256 eta)`, `cancelTransaction(address target, uint256 value, string memory signature, bytes memory data, uint256 eta)`, `executeTransaction(address target, uint256 value, string memory signature, bytes memory data, uint256 eta)` | — |

### 🟠 `0xCAcd6fd266aF91b8AeD52aCCc382b4e165586E29` — frxUSD (TransparentUpgradeableProxy)
Controls **5 role(s)** across **5 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| FrxUSDCustodianUsdc `0x4F95...d87c` | `frxUSD()` | `deposit(uint256 _assetsIn, address _receiver)`, `mint(uint256 _sharesOut, address _receiver)` | — |
| FrxUSDCustodianWithOracle `0x5fbA...4F33` | `frxUSD()` | `deposit(uint256 _assetsIn, address _receiver)`, `mint(uint256 _sharesOut, address _receiver)` | — |
| FrxUSDCustodianWithReceiver `0x860C...7857` | `frxUSD()` | `deposit(uint256 _assetsIn, address _receiver)`, `mint(uint256 _sharesOut, address _receiver)` | — |
| FrxUSDCustodian `0xE827...4E9c` | `frxUSD()` | `deposit(uint256 _assetsIn, address _receiver)`, `mint(uint256 _sharesOut, address _receiver)` | — |
| FrxUSDCustodian `0xFE2E...0a29` | `frxUSD()` | `deposit(uint256 _assetsIn, address _receiver)`, `mint(uint256 _sharesOut, address _receiver)` | — |

### 🟠 `0x860Cc723935FC9A15fF8b1A94237a711DFeF7857` — TransparentUpgradeableProxy
Controls **2 role(s)** across **2 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| FrxUSD `0xCAcd...6E29` | `minter()` | `minter_burn_from(address b_address, uint256 b_amount)`, `minter_mint(address m_address, uint256 m_amount)` | — |
| FrxUSDCustodianUsdc `0x4F95...d87c` | `WTGXX_CUSTODIAN_MAINNET()` | `redeemWtgxx(uint256 amountWtgxx)` | — |


---
## ⛔ Sanctions Screening

| Source | Status |
|---|---|
| OFAC SDN | ✅ OFAC SDN screened (97 ETH addresses, cache: 2026-06-25) |
| Chainalysis | ✅ Chainalysis screened |
| **Result** | 31 addresses screened · ✅ 0 flagged |

---
## EOA Exposure Summary

✅ No direct EOA role holders detected.

---
## ✅ Scan Integrity

No issues detected. All block ranges covered, source and ABI resolved for all contracts.
