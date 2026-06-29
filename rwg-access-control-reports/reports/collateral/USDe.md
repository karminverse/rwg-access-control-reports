# Trustfall — Access Control Report — USDe (USDe)

| Field | Value |
|---|---|
| Contract | `0x4c9EDD5852cd905f086C759E8383e09bff1E68B3` |
| Token | USDe (USDe) |
| Name | USDe |
| Chain | Ethereum |
| Proxy Status | ✅ No |
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
| Contracts | 3 |
| Role slots | 15 |
| Privileged Fns | 28 |
| EOA Holders | 24 ⚠️ |
| Critical Roles | 3 ⚠️ |

## Changes Since Last Scan

> Comparing **2026-06-02T22:22:11Z** (block 25232638) → **2026-06-25T23:06:28Z** (block 25397798).

### Roles
- 🔄 `benefactor()` on **EthenaMinting** (`0xe34902…62d3`)
    - member ➕ `0x2e3dc2…90e5`
    - member ➕ `0x3b6aee…5644`
    - member ➕ `0x70ac34…4033`
    - member ➕ `0x8d1b96…d95c`
    - member ➕ `0x999935…8ae2`
    - member ➕ `0x9d2e39…59b6`
    - member ➕ `0xab79ad…e45e`
    - member ➕ `0xae5156…7200`
    - member ➕ `0xc31bbd…2a83`
    - member ➕ `0xcb9240…f941`
    - member ➕ `0xddcd0d…cdd1`
    - member ➕ `0xe0a672…da9c`
    - member ➕ `0xe9a8e0…3e33`
    - member ➖ `0x673ba7…c11d`
    - member ➖ `0x995e5c…6cbf`
    - member ➖ `0xc23d30…4aaa`

### Parameters
- 🔄 `redeem` on **EthenaMinting** (`0xe34902…62d3`)
    - set_at_block: `25231402` → `25396143`
- 🔄 `mint` on **EthenaMinting** (`0xe34902…62d3`)
    - set_at_block: `25231906` → `25397796`


## 📋 Protocol Context

> *From protocol profile: Ethena / USDe (Stablecoin)*

<details>
<summary><strong>Architecture</strong></summary>

- **Architectural shape:** Safe 5/10 + OZ AccessControl role topology on EthenaMinting V2 — single multisig owns USDe, multiple EOAs hold individual SUPPLY/PAUSE roles on the minter. NO on-chain Timelock; off-chain Copper/Ceffu custody is the actual trust surface (see off_chain_dependencies).
- **Minimal ERC20 stablecoin:** ERC20 + ERC20Burnable + ERC20Permit + Ownable2Step
- NOT a proxy — direct deployment, non-upgradeable bytecode
- NOT pausable — no pause/unpause mechanism on USDe itself
- NO blacklist — USDe has no address restriction or freeze capability (unlike sUSDe/StakedUSDeV2)
- **Single minter pattern:** only one address (stored in `minter` slot) can call mint()
- Owner can reassign minter via setMinter() — this is the critical supply-control function
- renounceOwnership() overridden to always revert — ownership is permanent
- burn/burnFrom are public (ERC20Burnable) — any holder can burn their own tokens
- **Two-step ownership:** transferOwnership() + acceptOwnership() via Ownable2Step
- **Minting flow:** user submits order to EthenaMinting -> MINTER_ROLE holder calls mint() on EthenaMinting -> EthenaMinting calls USDe.mint(to, amount)
- **Related contracts:** EthenaMinting V2 (0xe349...62D3) is the minter; StakedUSDeV2 (0x9D39...3497) is the staking vault

</details>

<details>
<summary><strong>Function Interaction Paths</strong></summary>

- **`setMinter(newMinter)`** (`owner()`)
  - Replaces the sole address authorized to call mint() — immediately effective
  - Previous minter loses all minting capability with no delay or timelock
  - If set to an EOA, that EOA gains uncapped USDe minting power
  - ⚠️ *This is the highest-impact function on USDe. Owner can redirect minting authority to any address. No timelock. If the 5/11 multisig is compromised, attacker can set minter to their own address and mint unlimited USDe.
*
- **`mint(to, amount) via EthenaMinting`** (`minter() — currently EthenaMinting V2`)
  - Creates new USDe tokens, increasing totalSupply
  - EthenaMinting enforces per-block and global mint caps (maxMintPerBlock, globalMaxMintPerBlock)
  - EthenaMinting requires a valid signed order from a MINTER_ROLE holder
  - ⚠️ *USDe.mint() itself has no caps — all rate-limiting is enforced by EthenaMinting. If minter is changed to a contract/EOA without caps, unlimited minting is possible.
*
- **`transferOwnership(newOwner) + acceptOwnership()`** (`owner()`)
  - Two-step transfer: current owner proposes, new owner must accept
  - New owner gains setMinter() and transferOwnership() authority
  - ⚠️ *Two-step pattern mitigates accidental transfer but not compromised multisig scenarios*
- **`GATEKEEPER_ROLE calls disableMintRedeem() on EthenaMinting`** (`GATEKEEPER_ROLE (on EthenaMinting, not on USDe)`)
  - Sets maxMintPerBlock and maxRedeemPerBlock to 0 for all assets on EthenaMinting
  - Effectively pauses USDe minting and redemption through the normal flow
  - USDe contract itself remains fully functional for transfers
  - ⚠️ *Emergency brake lives on EthenaMinting, not USDe. GATEKEEPER can halt minting but cannot freeze transfers or balances. This is the closest thing to a pause for USDe supply operations.
*

</details>

<details>
<summary><strong>Cross-Contract Dependencies</strong></summary>

- **`EthenaMinting_V2`** — `0xe3490297a08d6fC8Da46Edb7B6142E4F461b62D3`
  - *Relation:* Current minter — all USDe supply operations flow through this contract
  - *Roles:*
    - MINTER_ROLE: 20 EOAs authorized to submit mint orders (all EOA, CRITICAL)
    - REDEEMER_ROLE: 20 EOAs authorized to submit redeem orders (all EOA, CRITICAL)
    - GATEKEEPER_ROLE: 4 EOAs — can disable mint/redeem (emergency pause)
    - COLLATERAL_MANAGER_ROLE: Gnosis Safe 5/11 — transfers collateral to custody
    - DEFAULT_ADMIN_ROLE: Gnosis Safe 5/11 — manages all roles, sets mint/redeem caps
  - *Note:* EthenaMinting uses a custom AccessControl (not OZ), with single-admin pattern and two-step admin transfer. The 20 MINTER/REDEEMER EOAs are operational bots, not human signers. Per-block caps limit blast radius of individual key compromise.
- **`StakedUSDeV2`** — `0x9D39A5DE30e57443BfF2A8307A4256c8797A3497`
  - *Relation:* Staking vault — users deposit USDe to receive sUSDe
  - *Note:* StakedUSDeV2 has the two-tier blacklist (FULL_RESTRICTED / SOFT_RESTRICTED) that USDe itself lacks. Blacklist risk is on the vault, not the stablecoin. See profiles/StakedUSDeV2.yaml for details.

</details>

## 📑 Table of Contents

1. [Analyst Focus Areas](#analyst-focus-areas)
2. Contracts
   - [USDe ★](#c-0x4c9edd5852cd905f086c759e8383e09bff1e68b3)
   - [EthenaMinting](#c-0xe3490297a08d6fc8da46edb7b6142e4f461b62d3)
3. [⚡ Authority Concentration](#-authority-concentration)
4. [⛔ Sanctions Screening](#-sanctions-screening)
5. [EOA Exposure Summary](#eoa-exposure-summary)
6. [✅ Scan Integrity](#scan-integrity)

## Analyst Focus Areas

> **Observational findings — not risk determinations.** Each item below is a focus point for the Risk Analyst to interpret against collateralization context and the protocol's stated intent. Attention levels (CRITICAL / HIGH / LOW) reflect the scanner's heuristic weight — not a realized risk to FiRM. These observations support future risk assessments; they do not constitute one.

> **3 critical-attention** and **18 high-attention** observation(s) across 3 contract(s).


### 🔴 CRITICAL (3)

- 🔴 [**Observed: EOA holds `GATEKEEPER_ROLE` on EthenaMinting**](#c-0xe3490297a08d6fc8da46edb7b6142e4f461b62d3) — `0x0F566cC38677239Bed459047065925654b6d5BD9` (EOA) — single key controls [PAUSE, SUPPLY] capability. Assess custody and intent.
- 🔴 [**Observed: EOA holds `MINTER_ROLE` on EthenaMinting**](#c-0xe3490297a08d6fc8da46edb7b6142e4f461b62d3) — `0x03984DDEF40850bB9862Ec09037853630d7b6Ae4` (EOA) — single key controls [SUPPLY] capability. Assess custody and intent.
- 🔴 [**Observed: EOA holds `REDEEMER_ROLE` on EthenaMinting**](#c-0xe3490297a08d6fc8da46edb7b6142e4f461b62d3) — `0x03984DDEF40850bB9862Ec09037853630d7b6Ae4` (EOA) — single key controls [SUPPLY] capability. Assess custody and intent.

### 🟠 HIGH (18)

- 💰 **Observed: 7 role(s) with supply-altering capability** — Supply-altering surface detected: `COLLATERAL_MANAGER_ROLE` on EthenaMinting, `DEFAULT_ADMIN_ROLE` on EthenaMinting, `GATEKEEPER_ROLE` on EthenaMinting +4 more. Assess each holder's custody and governance.
- ⏸️ **Observed: 1 role(s) with pause capability** — Pause surface detected: `GATEKEEPER_ROLE` on EthenaMinting. Assess pause authority governance.
- 🔗 [**Observed: supply authority chain on EthenaMinting**](#c-0xe3490297a08d6fc8da46edb7b6142e4f461b62d3) — Chain: USDe → `minter()` → EthenaMinting. Controlled by: `COLLATERAL_MANAGER_ROLE`, `DEFAULT_ADMIN_ROLE`, `GATEKEEPER_ROLE`. Assess custody — compromise of this chain could affect root token supply.
- 🔗 [**Observed: supply authority chain on GnosisSafe**](#c-0x4c9edd5852cd905f086c759e8383e09bff1e68b3) — Chain: USDe → `owner()` → GnosisSafe. Controlled by: `Safe Owners (5/10 required)`. Assess custody — compromise of this chain could affect root token supply.
- ⚠️ [**No Timelock in admin chain: `minter()` on USDe**](#c-0x4c9edd5852cd905f086c759e8383e09bff1e68b3) — `minter()` has SUPPLY capability and is held by: `0xe349...62D3` (Contract). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `owner()` on USDe**](#c-0x4c9edd5852cd905f086c759e8383e09bff1e68b3) — `owner()` has SUPPLY capability and is held by: `0x3B0A...1862` (Safe). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `GATEKEEPER_ROLE` on EthenaMinting**](#c-0xe3490297a08d6fc8da46edb7b6142e4f461b62d3) — `GATEKEEPER_ROLE` has SUPPLY capability and is held by: `0x0F56...5BD9` (EOA), `0x4960...8996` (EOA), `0xAB91...A7dC` (EOA) +1 more. No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `COLLATERAL_MANAGER_ROLE` on EthenaMinting**](#c-0xe3490297a08d6fc8da46edb7b6142e4f461b62d3) — `COLLATERAL_MANAGER_ROLE` has SUPPLY capability and is held by: `0x3B0A...1862` (Safe). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `MINTER_ROLE` on EthenaMinting**](#c-0xe3490297a08d6fc8da46edb7b6142e4f461b62d3) — `MINTER_ROLE` has SUPPLY capability and is held by: `0x0398...6Ae4` (EOA), `0x0B23...5c7d` (EOA), `0x24bE...b962` (EOA) +17 more. No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `DEFAULT_ADMIN_ROLE` on EthenaMinting**](#c-0xe3490297a08d6fc8da46edb7b6142e4f461b62d3) — `DEFAULT_ADMIN_ROLE` has SUPPLY capability and is held by: `0x3B0A...1862` (Safe). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `REDEEMER_ROLE` on EthenaMinting**](#c-0xe3490297a08d6fc8da46edb7b6142e4f461b62d3) — `REDEEMER_ROLE` has SUPPLY capability and is held by: `0x0398...6Ae4` (EOA), `0x0B23...5c7d` (EOA), `0x24bE...b962` (EOA) +17 more. No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.

<details>
<summary>🔄 **6 volatile parameter(s) observed across 2 contract(s) (≥5 historical changes each)** — Operational tempo signal — high-velocity setters indicate active governance maintenance, oracle keepers, or routinely-tuned risk parameters. Expand to review each parameter's change count and current value; assess against the protocol's stated intent.</summary>

- 🔄 [**Observed: volatile parameter `minter` on USDe**](#c-0x4c9edd5852cd905f086c759e8383e09bff1e68b3) — `setMinter(address newMinter)` changed 6 times. Current value: `0xe3490297a08d6fC8Da46Edb7B6142E4F461b62D3`. Assess change pattern.
- 🔄 [**Observed: volatile parameter `globalConfig.globalMaxRedeemPerBlock` on EthenaMinting**](#c-0xe3490297a08d6fc8da46edb7b6142e4f461b62d3) — `setGlobalMaxRedeemPerBlock(uint128 _globalMaxRedeemPerBlock)` changed 5 times. Current value: `10000000000000000000000000 (10,000,000.000000e18)`. Assess change pattern.
- 🔄 [**Observed: volatile parameter `tokenConfig.maxMintPerBlock` on EthenaMinting**](#c-0xe3490297a08d6fc8da46edb7b6142e4f461b62d3) — `setMaxMintPerBlock(uint128 _maxMintPerBlock, address asset)` changed 12 times. Current value: 7 markets · highest 200M ×6 · 2M ×1 — full per-key breakdown in the Permissioned Parameters table on EthenaMinting. Assess change pattern.
- 🔄 [**Observed: volatile parameter `tokenConfig.maxRedeemPerBlock` on EthenaMinting**](#c-0xe3490297a08d6fc8da46edb7b6142e4f461b62d3) — `setMaxRedeemPerBlock(uint128 _maxRedeemPerBlock, address asset)` changed 14 times. Current value: 7 markets · highest 10M ×6 · 2M ×1 — full per-key breakdown in the Permissioned Parameters table on EthenaMinting. Assess change pattern.
- 🔄 [**Observed: volatile parameter `removeSupportedAsset` on EthenaMinting**](#c-0xe3490297a08d6fc8da46edb7b6142e4f461b62d3) — `removeSupportedAsset(address asset)` changed 10 times. Current value: ``. Assess change pattern.
- 🔄 [**Observed: volatile parameter `addSupportedAsset` on EthenaMinting**](#c-0xe3490297a08d6fc8da46edb7b6142e4f461b62d3) — `addSupportedAsset(address asset, TokenConfig memory _tokenConfig)` changed 9 times. Current value: ``. Assess change pattern.

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
<a id="c-0x4c9edd5852cd905f086c759e8383e09bff1e68b3"></a>
## USDe `0x4c9EDD5852cd905f086C759E8383e09bff1E68B3`

✅ **Two-step admin transfer:** `OZ Ownable2Step` — prevents accidental hand-off (request → accept flow).

### 🟠 `minter()`

**Privileged write functions:**  
**Capabilities:** 💰 **SUPPLY**
- `mint(address to, uint256 amount)` — (auto) Create new tokens, increasing total supply `[SUPPLY]`

**Members (1):**

| Address | Name / Type | Risk | Granted | Source | Details |
|---|---|---|---|---|---|
| `0xe3490297a08d6fC8Da46Edb7B6142E4F461b62D3` | EthenaMinting | 🟠 HIGH | — | Storage+Events |  |

### 🟢 `owner()`

**Privileged write functions:**  
**Capabilities:** ⚙️ **CONFIG** 💰 **SUPPLY**
- `setMinter(address newMinter)` — (auto) Set the address authorized to mint tokens `[SUPPLY]`
- `transferOwnership(address newOwner)` — Starts the ownership transfer of the contract to a new account. Replaces the pending transfer if there is one. Can only be called by the current owner.
- `acceptOwnership()` — Second step of `OZ Ownable2Step` — callable by the pending holder set via `transferOwnership`, not by the current role. Included here to surface the full transfer handoff. `[CONFIG]`

**Members (1):**

| Address | Name / Type | Risk | Granted | Source | Details |
|---|---|---|---|---|---|
| `0x3B0AAf6e6fCd4a7cEEf8c92C32DFeA9E64dC1862` | GnosisSafeProxy | 🟢 LOW | — | Storage+Events | 5/10 signers |

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

#### 🔧 Permissioned Parameters

**`minter`** 🔄 **ACTIVE** (6 changes)

> ⚠️ This parameter has been changed **6 times** — monitor for unexpected modifications.

| Field | Value |
|---|---|
| Current Value | `0xe3490297a08d6fC8Da46Edb7B6142E4F461b62D3` |
| Setter | `setMinter(address newMinter)` |
| Gated by | `owner()` |
| Tags | `SUPPLY` |
| Last changed | 2024-07-08 |
| Changed by | `0x3B0A...1862` (GnosisSafeProxy) |
| Total changes | 6 🔄 |

**Recent changes (showing last 5 of 6):**

| # | Value | Set By | Date |
|---|---|---|---|
| 1 | `newMinter=0xe3490297a08d6fC8Da46Edb7B6142E4F461b62D3` | `0x3B0A...1862` (GnosisSafeProxy) | 2024-07-08 |
| 2 | `newMinter=0xe3490297a08d6fC8Da46Edb7B6142E4F461b62D3` | `0x3B0A...1862` (GnosisSafeProxy) | 2024-07-08 |
| 3 | `newMinter=0xe3490297a08d6fC8Da46Edb7B6142E4F461b62D3` | `0x3B0A...1862` (GnosisSafeProxy) | 2024-07-08 |
| 4 | `newMinter=0xe3490297a08d6fC8Da46Edb7B6142E4F461b62D3` | `0x3B0A...1862` (GnosisSafeProxy) | 2024-07-08 |
| 5 | `newMinter=0xe3490297a08d6fC8Da46Edb7B6142E4F461b62D3` | `0x3B0A...1862` (GnosisSafeProxy) | 2024-07-08 |

#### 💰 Supply Actions

_Mint / redeem / burn call tracking — last 5 calls per function, total counts preserved._

**`mint`** *(per-asset)* ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> This parameter has never been changed since deployment.

| Field | Value |
|---|---|
| Setter | `mint(address to, uint256 amount)` |
| Gated by | `minter()` |
| Tags | `SUPPLY` |
| Last called | — |
| Called by | — |
| Total calls | 0 ❄️ |

---
<a id="c-0xe3490297a08d6fc8da46edb7b6142e4f461b62d3"></a>
## > EthenaMinting `0xe3490297a08d6fC8Da46Edb7B6142E4F461b62D3`

> > 💰 **Inherited supply authority** — holds `minter()` on **USDe**. Access controls on this contract gate root token supply.

> 🔒 **Immutable References:** `uSDe()` → USDe (USDe), `usde()` → USDe (USDe)

> ✅ **Two-step admin transfer:** `transferAdmin + acceptAdmin` — prevents accidental hand-off (request → accept flow).

### > 🟢 `COLLATERAL_MANAGER_ROLE`

> **Hash:** `0x85e8f2d6819d6b24108062d87ea08f54651bcb8960d98062d3faf96e7873b8b9`  
> **Managed by:** `DEFAULT_ADMIN_ROLE`  
> **Privileged write functions:**  
> **Capabilities:** 💰 **SUPPLY**
> - `transferToCustody(address wallet, address asset, uint128 amount)` — transfers an asset to a custody wallet `[SUPPLY]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x3B0AAf6e6fCd4a7cEEf8c92C32DFeA9E64dC1862` | GnosisSafeProxy | 🟢 LOW | 2025-02-04 | Events only · hasRole ✓ | 5/10 signers |

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

### > 🟢 `DEFAULT_ADMIN_ROLE`

> **Hash:** `0x0000000000000000000000000000000000000000000000000000000000000000`  
> **Managed by:** `DEFAULT_ADMIN_ROLE`  
> **Privileged write functions:**  
> **Capabilities:** ⚙️ **CONFIG** 💰 **SUPPLY**
> - `setGlobalMaxMintPerBlock(uint128 _globalMaxMintPerBlock)` — Sets the overall, global maximum USDe mint size per block `[SUPPLY]`
> - `setGlobalMaxRedeemPerBlock(uint128 _globalMaxRedeemPerBlock)` — Sets the overall, global maximum USDe redeem size per block `[SUPPLY]`
> - `removeSupportedAsset(address asset)` — Removes an asset from the supported assets list `[SUPPLY]`
> - `removeCustodianAddress(address custodian)` — Removes an custodian from the custodian address list `[CONFIG]`
> - `removeWhitelistedBenefactor(address benefactor)` — Removes the benefactor address from the benefactor whitelist
> - `addCustodianAddress(address custodian)` — Adds an custodian to the supported custodians list. `[CONFIG]`
> - `addWhitelistedBenefactor(address benefactor)` — Adds a benefactor address to the benefactor whitelist
> - `addSupportedAsset(address asset, TokenConfig memory _tokenConfig)` — (auto) Whitelist a collateral asset that can be used for minting `[SUPPLY]`
> - `setMaxMintPerBlock(uint128 _maxMintPerBlock, address asset)` — (auto) Set the maximum tokens that can be minted per block `[SUPPLY]`
> - `setMaxRedeemPerBlock(uint128 _maxRedeemPerBlock, address asset)` — (auto) Set the maximum tokens that can be redeemed per block `[SUPPLY]`
> - `setTokenType(address asset, TokenType tokenType)`
> - `setStablesDeltaLimit(uint128 _stablesDeltaLimit)` — set the allowed price delta in bps for stablecoin minting `[CONFIG]`
> - `transferAdmin(address newAdmin)` — Transfer the admin role to a new address This can ONLY be executed by the current admin
> - `grantRole(bytes32 role, address account)` — grant a role can only be executed by the current single admin admin role cannot be granted externally
> - `revokeRole(bytes32 role, address account)` — revoke a role can only be executed by the current admin admin role cannot be revoked
> - `acceptAdmin()` — Second step of `transferAdmin + acceptAdmin` — callable by the pending holder set via `transferAdmin`, not by the current role. Included here to surface the full transfer handoff. `[CONFIG]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x3B0AAf6e6fCd4a7cEEf8c92C32DFeA9E64dC1862` | GnosisSafeProxy | 🟢 LOW | 2024-06-21 | Events only · hasRole ✓ | 5/10 signers |

> **🕘 Previous Holders (1)** _(verified inactive — `hasRole`/`is` returned false)_:

> | Address | Name / Type | Granted | Status |
> |---|---|---|---|
> | `0x8dE54b1cefEdeAB1766b947c7D9A9963436E8FaE` | EOA | 2024-06-21 | 🕘 HISTORICAL |

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

### > 🔴 `GATEKEEPER_ROLE` 🔄 6 changes

> **Hash:** `0x3c63e605be3290ab6b04cfc46c6e1516e626d43236b034f09d7ede1d017beb0c`  
> **Managed by:** `DEFAULT_ADMIN_ROLE`  
> **Privileged write functions:**  
> **Capabilities:** ⚙️ **CONFIG** ⏸️ **PAUSE** 💰 **SUPPLY**
> - `disableMintRedeem()` — Disables the mint and redeem `[PAUSE]`
> - `removeMinterRole(address minter)` — Removes the minter role from an account, this can ONLY be executed by the gatekeeper role `[SUPPLY, CONFIG]`
> - `removeRedeemerRole(address redeemer)` — Removes the redeemer role from an account, this can ONLY be executed by the gatekeeper role `[CONFIG]`
> - `removeCollateralManagerRole(address collateralManager)` — Removes the collateral manager role from an account, this can ONLY be executed by the gatekeeper role `[SUPPLY, CONFIG]`

> **Members (4):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x0F566cC38677239Bed459047065925654b6d5BD9` | EOA | 🔴 CRITICAL | 2024-06-24 | Events only · hasRole ✓ | ⚠️ Single private key |
> | `0x496011675b197CC136B48BC19D848FE26D3a8996` | EOA | 🔴 CRITICAL | 2024-06-24 | Events only · hasRole ✓ | ⚠️ Single private key |
> | `0xAB9110d36B030bAe812CD3BB7B9dE805A64AA7dC` | EOA | 🔴 CRITICAL | 2024-06-24 | Events only · hasRole ✓ | ⚠️ Single private key |
> | `0xb6ECaE7413A3E78a3e10f15aFE3066e79566CCA3` | EOA | 🔴 CRITICAL | 2024-06-24 | Events only · hasRole ✓ | ⚠️ Single private key |

> **🕘 Previous Holders (1)** _(verified inactive — `hasRole`/`is` returned false)_:

> | Address | Name / Type | Granted | Status |
> |---|---|---|---|
> | `0xd2845325d7348c5DaE630BA236bcB53163b07057` | EOA | 2024-06-24 | 🕘 HISTORICAL |

### > 🔴 `MINTER_ROLE` 🔄 60 changes

> **Hash:** `0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6`  
> **Managed by:** `DEFAULT_ADMIN_ROLE`  
> **Privileged write functions:**  
> **Capabilities:** 💰 **SUPPLY**
> - `mint(Order calldata order, Route calldata route, Signature calldata signature)` — Mint stablecoins from assets / `[SUPPLY]`
> - `mintWETH(Order calldata order, Route calldata route, Signature calldata signature)` — Mint stablecoins from assets / `[SUPPLY]`

> **Members (20):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x03984DDEF40850bB9862Ec09037853630d7b6Ae4` | EOA | 🔴 CRITICAL | 2024-07-04 | Events only · hasRole ✓ | ⚠️ Single private key |
> | `0x0B23d23939A1731289EAA04f62BA1dd4Ecdd5c7d` | EOA | 🔴 CRITICAL | 2024-07-04 | Events only · hasRole ✓ | ⚠️ Single private key |
> | `0x24bE9948466FEcEB22A9B77b19e404F2119fb962` | EOA | 🔴 CRITICAL | 2024-07-04 | Events only · hasRole ✓ | ⚠️ Single private key |
> | `0x4d394F45dFaDef5522759c511702Db97690A5C12` | EOA | 🔴 CRITICAL | 2024-07-04 | Events only · hasRole ✓ | ⚠️ Single private key |
> | `0x57093ffEdC2F49Eb3a5A11b63C0f4Ca1B75C5CB7` | EOA | 🔴 CRITICAL | 2024-07-04 | Events only · hasRole ✓ | ⚠️ Single private key |
> | `0x57FefB75863cc64fECF11ac99d7A5b60EBE0080f` | EOA | 🔴 CRITICAL | 2024-07-04 | Events only · hasRole ✓ | ⚠️ Single private key |
> | `0x64004ae464f49C30a188C34E01B0dC66c8bEb21E` | EOA | 🔴 CRITICAL | 2024-07-04 | Events only · hasRole ✓ | ⚠️ Single private key |
> | `0x655a1B0124b39B2d7C7F62a99627a891faD93B7B` | EOA | 🔴 CRITICAL | 2024-07-04 | Events only · hasRole ✓ | ⚠️ Single private key |
> | `0x661Ca83074b8Ec630825D4604455325499F951a1` | EOA | 🔴 CRITICAL | 2024-07-04 | Events only · hasRole ✓ | ⚠️ Single private key |
> | `0x6F1d2df2ACc5f2dA3167Ad1967b648207cfC63DB` | EOA | 🔴 CRITICAL | 2024-07-04 | Events only · hasRole ✓ | ⚠️ Single private key |
> | `0x6FD5ffEe1220b0458c2114d6ce7fB4dE2BC8fEE6` | EOA | 🔴 CRITICAL | 2024-07-04 | Events only · hasRole ✓ | ⚠️ Single private key |
> | `0x71C95AAA22696d745E378486b769eE47cA23797c` | EOA | 🔴 CRITICAL | 2024-07-04 | Events only · hasRole ✓ | ⚠️ Single private key |
> | `0x7d69817Ea29244504c1A97B66E2C990F25DF7599` | EOA | 🔴 CRITICAL | 2024-07-04 | Events only · hasRole ✓ | ⚠️ Single private key |
> | `0x950c886CC6B9d420455985c3D31090AA060e96C8` | EOA | 🔴 CRITICAL | 2024-07-04 | Events only · hasRole ✓ | ⚠️ Single private key |
> | `0x9b6889199627f78470EA230cC7Df974239e0a5e5` | EOA | 🔴 CRITICAL | 2024-07-04 | Events only · hasRole ✓ | ⚠️ Single private key |
> | `0xA22C29b20f9Be2C809979Ed606b24Fe5286AC8F2` | EOA | 🔴 CRITICAL | 2024-07-04 | Events only · hasRole ✓ | ⚠️ Single private key |
> | `0xD0899998CCEB5B3df5cdcFaAdd43e53B8e1d553e` | EOA | 🔴 CRITICAL | 2024-07-04 | Events only · hasRole ✓ | ⚠️ Single private key |
> | `0xb229D6dB056750E22499191156Bf4c3654DF3826` | EOA | 🔴 CRITICAL | 2024-07-04 | Events only · hasRole ✓ | ⚠️ Single private key |
> | `0xc3309fDDFC8297c39A38d5D872a37222f98DAd37` | EOA | 🔴 CRITICAL | 2024-07-04 | Events only · hasRole ✓ | ⚠️ Single private key |
> | `0xcD992cFB025014C01EBc2f2311c3F87aA8411d9c` | EOA | 🔴 CRITICAL | 2024-07-04 | Events only · hasRole ✓ | ⚠️ Single private key |

> **🕘 Previous Holders (20)** _(verified inactive — `hasRole`/`is` returned false)_:

> | Address | Name / Type | Granted | Status |
> |---|---|---|---|
> | `0x06f7EC521a79e1DC9A1263f412752A016eC39A92` | EOA | 2024-06-26 | 🕘 HISTORICAL |
> | `0x19c9e1e75A648D95e447b1529Ba173D18586aF4B` | EOA | 2024-06-26 | 🕘 HISTORICAL |
> | `0x2064990663719eeE3C4cDa48Fb1B687bda1cCe01` | EOA | 2024-06-26 | 🕘 HISTORICAL |
> | `0x3B5553E7a6b307af0F7980cc27B16f4ACaD9e64c` | EOA | 2024-06-26 | 🕘 HISTORICAL |
> | `0x508557fe932990DA2FE7259B76361B8cA0d01ae1` | EOA | 2024-06-26 | 🕘 HISTORICAL |
> | | | | _+15 more_ |

### > 🔴 `REDEEMER_ROLE` 🔄 60 changes

> **Hash:** `0x44ac9762eec3a11893fefb11d028bb3102560094137c3ed4518712475b2577cc`  
> **Managed by:** `DEFAULT_ADMIN_ROLE`  
> **Privileged write functions:**  
> **Capabilities:** 💰 **SUPPLY**
> - `redeem(Order calldata order, Signature calldata signature)` — Redeem stablecoins for assets / `[SUPPLY]`

> **Members (20):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x03984DDEF40850bB9862Ec09037853630d7b6Ae4` | EOA | 🔴 CRITICAL | 2024-07-08 | Events only · hasRole ✓ | ⚠️ Single private key |
> | `0x0B23d23939A1731289EAA04f62BA1dd4Ecdd5c7d` | EOA | 🔴 CRITICAL | 2024-07-08 | Events only · hasRole ✓ | ⚠️ Single private key |
> | `0x24bE9948466FEcEB22A9B77b19e404F2119fb962` | EOA | 🔴 CRITICAL | 2024-07-08 | Events only · hasRole ✓ | ⚠️ Single private key |
> | `0x4d394F45dFaDef5522759c511702Db97690A5C12` | EOA | 🔴 CRITICAL | 2024-07-08 | Events only · hasRole ✓ | ⚠️ Single private key |
> | `0x57093ffEdC2F49Eb3a5A11b63C0f4Ca1B75C5CB7` | EOA | 🔴 CRITICAL | 2024-07-08 | Events only · hasRole ✓ | ⚠️ Single private key |
> | `0x57FefB75863cc64fECF11ac99d7A5b60EBE0080f` | EOA | 🔴 CRITICAL | 2024-07-08 | Events only · hasRole ✓ | ⚠️ Single private key |
> | `0x64004ae464f49C30a188C34E01B0dC66c8bEb21E` | EOA | 🔴 CRITICAL | 2024-07-08 | Events only · hasRole ✓ | ⚠️ Single private key |
> | `0x655a1B0124b39B2d7C7F62a99627a891faD93B7B` | EOA | 🔴 CRITICAL | 2024-07-08 | Events only · hasRole ✓ | ⚠️ Single private key |
> | `0x661Ca83074b8Ec630825D4604455325499F951a1` | EOA | 🔴 CRITICAL | 2024-07-08 | Events only · hasRole ✓ | ⚠️ Single private key |
> | `0x6F1d2df2ACc5f2dA3167Ad1967b648207cfC63DB` | EOA | 🔴 CRITICAL | 2024-07-08 | Events only · hasRole ✓ | ⚠️ Single private key |
> | `0x6FD5ffEe1220b0458c2114d6ce7fB4dE2BC8fEE6` | EOA | 🔴 CRITICAL | 2024-07-08 | Events only · hasRole ✓ | ⚠️ Single private key |
> | `0x71C95AAA22696d745E378486b769eE47cA23797c` | EOA | 🔴 CRITICAL | 2024-07-08 | Events only · hasRole ✓ | ⚠️ Single private key |
> | `0x7d69817Ea29244504c1A97B66E2C990F25DF7599` | EOA | 🔴 CRITICAL | 2024-07-08 | Events only · hasRole ✓ | ⚠️ Single private key |
> | `0x950c886CC6B9d420455985c3D31090AA060e96C8` | EOA | 🔴 CRITICAL | 2024-07-08 | Events only · hasRole ✓ | ⚠️ Single private key |
> | `0x9b6889199627f78470EA230cC7Df974239e0a5e5` | EOA | 🔴 CRITICAL | 2024-07-08 | Events only · hasRole ✓ | ⚠️ Single private key |
> | `0xA22C29b20f9Be2C809979Ed606b24Fe5286AC8F2` | EOA | 🔴 CRITICAL | 2024-07-08 | Events only · hasRole ✓ | ⚠️ Single private key |
> | `0xD0899998CCEB5B3df5cdcFaAdd43e53B8e1d553e` | EOA | 🔴 CRITICAL | 2024-07-08 | Events only · hasRole ✓ | ⚠️ Single private key |
> | `0xb229D6dB056750E22499191156Bf4c3654DF3826` | EOA | 🔴 CRITICAL | 2024-07-08 | Events only · hasRole ✓ | ⚠️ Single private key |
> | `0xc3309fDDFC8297c39A38d5D872a37222f98DAd37` | EOA | 🔴 CRITICAL | 2024-07-08 | Events only · hasRole ✓ | ⚠️ Single private key |
> | `0xcD992cFB025014C01EBc2f2311c3F87aA8411d9c` | EOA | 🔴 CRITICAL | 2024-07-08 | Events only · hasRole ✓ | ⚠️ Single private key |

> **🕘 Previous Holders (20)** _(verified inactive — `hasRole`/`is` returned false)_:

> | Address | Name / Type | Granted | Status |
> |---|---|---|---|
> | `0x06f7EC521a79e1DC9A1263f412752A016eC39A92` | EOA | 2024-06-26 | 🕘 HISTORICAL |
> | `0x19c9e1e75A648D95e447b1529Ba173D18586aF4B` | EOA | 2024-06-26 | 🕘 HISTORICAL |
> | `0x2064990663719eeE3C4cDa48Fb1B687bda1cCe01` | EOA | 2024-06-26 | 🕘 HISTORICAL |
> | `0x3B5553E7a6b307af0F7980cc27B16f4ACaD9e64c` | EOA | 2024-06-26 | 🕘 HISTORICAL |
> | `0x508557fe932990DA2FE7259B76361B8cA0d01ae1` | EOA | 2024-06-26 | 🕘 HISTORICAL |
> | | | | _+15 more_ |

### > 🟢 `admin()`


> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x3B0AAf6e6fCd4a7cEEf8c92C32DFeA9E64dC1862` | GnosisSafeProxy | 🟢 LOW | — | Events only | 5/10 signers |

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

### > 🟢 `owner()`


> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x3B0AAf6e6fCd4a7cEEf8c92C32DFeA9E64dC1862` | GnosisSafeProxy | 🟢 LOW | — | Storage only | 5/10 signers |

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

### > 🔴 `benefactor()` · 👤 user


> **Members: 526** _(KYC-whitelisted participants — individual addresses omitted)_


### > 🔴 `beneficiary()` · 👤 user


> **Members: 16** _(KYC-whitelisted participants — individual addresses omitted)_


### > 🔴 `delegatedSigner()` · 👤 user


> **Members: 15** _(KYC-whitelisted participants — individual addresses omitted)_


### > 🔴 `custodianAddress()` · 📋 operational


> **Members (5):**

> | Address | Name / Type | Granted | Source | Details |
> |---|---|---|---|---|
> | `0x12FDB344e4D195fF6613D0f742a6E38344c8b455` | EOA | — | Events only | ⚠️ Single private key |
> | `0x2d4d2A025b10C09BDbd794B4FCe4F7ea8C7d7bB4` | EOA | — | Events only | ⚠️ Single private key |
> | `0x32b24247cbcE7c17b0017A2159a9FA481f401b16` | EOA | — | Events only | ⚠️ Single private key |
> | `0x8f0eE0393Eae7fc1638BD7860a3FEc6a663786AE` | EOA | — | Events only | ⚠️ Single private key |
> | `0xAFBb1a7E9ddEf38D9bC4A220E702B18DAcaa2a62` | EOA | — | Events only | ⚠️ Single private key |

> #### 🔧 Permissioned Parameters

> **`disableMintRedeem`** ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Setter | `disableMintRedeem()` |
> | Gated by | `GATEKEEPER_ROLE` |
> | Tags | `PAUSE` |
> | Last called | — |
> | Called by | — |
> | Total calls | 0 ❄️ |

> **`globalConfig.globalMaxMintPerBlock`**

> | Field | Value |
> |---|---|
> | Current Value | `200000000000000000000000000 (200,000,000.000000e18)` |
> | Setter | `setGlobalMaxMintPerBlock(uint128 _globalMaxMintPerBlock)` |
> | Gated by | `DEFAULT_ADMIN_ROLE` |
> | Tags | `SUPPLY` |
> | Last changed | 2025-07-25 |
> | Changed by | `0x3B0A...1862` (GnosisSafeProxy) |
> | Total changes | 3 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `_globalMaxMintPerBlock=200000000000000000000000000 (200,000,000.000000e18)` | `0x3B0A...1862` (GnosisSafeProxy) | 2025-07-25 |
> | 2 | `_globalMaxMintPerBlock=20000000000000000000000000 (20,000,000.000000e18)` | `0x3B0A...1862` (GnosisSafeProxy) | 2025-05-16 |
> | 3 | `_globalMaxMintPerBlock=10200000000000000000000000 (10,200,000.000000e18)` | `0x3B0A...1862` (GnosisSafeProxy) | 2024-11-28 |

> **`globalConfig.globalMaxRedeemPerBlock`** 🔄 **ACTIVE** (5 changes)

> > ⚠️ This parameter has been changed **5 times** — monitor for unexpected modifications.

> | Field | Value |
> |---|---|
> | Current Value | `10000000000000000000000000 (10,000,000.000000e18)` |
> | Setter | `setGlobalMaxRedeemPerBlock(uint128 _globalMaxRedeemPerBlock)` |
> | Gated by | `DEFAULT_ADMIN_ROLE` |
> | Tags | `SUPPLY` |
> | Last changed | 2025-08-05 |
> | Changed by | `0x3B0A...1862` (GnosisSafeProxy) |
> | Total changes | 5 🔄 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `_globalMaxRedeemPerBlock=10000000000000000000000000 (10,000,000.000000e18)` | `0x3B0A...1862` (GnosisSafeProxy) | 2025-08-05 |
> | 2 | `_globalMaxRedeemPerBlock=2000000000000000000000000 (2,000,000.000000e18)` | `0x3B0A...1862` (GnosisSafeProxy) | 2025-03-04 |
> | 3 | `_globalMaxRedeemPerBlock=10000000000000000000000000 (10,000,000.000000e18)` | `0x3B0A...1862` (GnosisSafeProxy) | 2025-02-25 |
> | 4 | `_globalMaxRedeemPerBlock=2000000000000000000000000 (2,000,000.000000e18)` | `0x3B0A...1862` (GnosisSafeProxy) | 2025-02-13 |
> | 5 | `_globalMaxRedeemPerBlock=10200000000000000000000000 (10,200,000.000000e18)` | `0x3B0A...1862` (GnosisSafeProxy) | 2025-02-11 |

> **`stablesDeltaLimit`** ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `0` |
> | Setter | `setStablesDeltaLimit(uint128 _stablesDeltaLimit)` |
> | Gated by | `DEFAULT_ADMIN_ROLE` |
> | Tags | `CONFIG` |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`tokenConfig.maxMintPerBlock`** *(per-asset)* 🔄 **ACTIVE** (12 changes)

> > ⚠️ This parameter has been changed **12 times** — monitor for unexpected modifications.

> | Asset | Current Value |
> |---|---|
> | DAI (Dai) `0x6B17...1d0F` | `2000000000000000000000000 (2,000,000.000000e18)` |
> | PYUSD (AdminUpgradeabilityProxy) `0x6c3e...A0e8` | `200000000000000000000000000 (200,000,000.000000e18)` |
> | USDC (FiatTokenProxy) `0xA0b8...eB48` | `200000000000000000000000000 (200,000,000.000000e18)` |
> | USDtb (TransparentUpgradeableProxy) `0xC139...aC1C` | `200000000000000000000000000 (200,000,000.000000e18)` |
> | USDm (ERC1967Proxy) `0xEc2A...3926` | `200000000000000000000000000 (200,000,000.000000e18)` |
> | USDT (TetherToken) `0xdAC1...1ec7` | `200000000000000000000000000 (200,000,000.000000e18)` |
> | USDG (ERC1967Proxy) `0xe343...491D` | `200000000000000000000000000 (200,000,000.000000e18)` |

> | Field | Value |
> |---|---|
> | Setter | `setMaxMintPerBlock(uint128 _maxMintPerBlock, address asset)` |
> | Gated by | `DEFAULT_ADMIN_ROLE` |
> | Tags | `SUPPLY` |
> | Last changed | 2025-08-05 |
> | Changed by | `0x3B0A...1862` (GnosisSafeProxy) |
> | Total changes | 12 🔄 |

> **Recent changes (showing last 5 of 12):**

> | # | Asset | Value | Set By | Date |
> |---|---|---|---|---|
> | 1 | USDtb (TransparentUpgradeableProxy) | `_maxMintPerBlock=200000000000000000000000000 (200,000,000.000000e18)` | `0x3B0A...1862` (GnosisSafeProxy) | 2025-08-05 |
> | 2 | USDtb (TransparentUpgradeableProxy) | `_maxMintPerBlock=200000000000000000000000000 (200,000,000.000000e18)` | `0x3B0A...1862` (GnosisSafeProxy) | 2025-08-05 |
> | 3 | USDtb (TransparentUpgradeableProxy) | `_maxMintPerBlock=200000000000000000000000000 (200,000,000.000000e18)` | `0x3B0A...1862` (GnosisSafeProxy) | 2025-08-05 |
> | 4 | USDtb (TransparentUpgradeableProxy) | `_maxMintPerBlock=200000000000000000000000000 (200,000,000.000000e18)` | `0x3B0A...1862` (GnosisSafeProxy) | 2025-08-05 |
> | 5 | USDtb (TransparentUpgradeableProxy) | `_maxMintPerBlock=200000000000000000000000000 (200,000,000.000000e18)` | `0x3B0A...1862` (GnosisSafeProxy) | 2025-08-05 |

> **`tokenConfig.maxRedeemPerBlock`** *(per-asset)* 🔄 **ACTIVE** (14 changes)

> > ⚠️ This parameter has been changed **14 times** — monitor for unexpected modifications.

> | Asset | Current Value |
> |---|---|
> | DAI (Dai) `0x6B17...1d0F` | `2000000000000000000000000 (2,000,000.000000e18)` |
> | PYUSD (AdminUpgradeabilityProxy) `0x6c3e...A0e8` | `10000000000000000000000000 (10,000,000.000000e18)` |
> | USDC (FiatTokenProxy) `0xA0b8...eB48` | `10000000000000000000000000 (10,000,000.000000e18)` |
> | USDtb (TransparentUpgradeableProxy) `0xC139...aC1C` | `10000000000000000000000000 (10,000,000.000000e18)` |
> | USDm (ERC1967Proxy) `0xEc2A...3926` | `10000000000000000000000000 (10,000,000.000000e18)` |
> | USDT (TetherToken) `0xdAC1...1ec7` | `10000000000000000000000000 (10,000,000.000000e18)` |
> | USDG (ERC1967Proxy) `0xe343...491D` | `10000000000000000000000000 (10,000,000.000000e18)` |

> | Field | Value |
> |---|---|
> | Setter | `setMaxRedeemPerBlock(uint128 _maxRedeemPerBlock, address asset)` |
> | Gated by | `DEFAULT_ADMIN_ROLE` |
> | Tags | `SUPPLY` |
> | Last changed | 2025-08-05 |
> | Changed by | `0x3B0A...1862` (GnosisSafeProxy) |
> | Total changes | 14 🔄 |

> **Recent changes (showing last 5 of 14):**

> | # | Asset | Value | Set By | Date |
> |---|---|---|---|---|
> | 1 | USDtb (TransparentUpgradeableProxy) | `_maxRedeemPerBlock=10000000000000000000000000 (10,000,000.000000e18)` | `0x3B0A...1862` (GnosisSafeProxy) | 2025-08-05 |
> | 2 | USDC (FiatTokenProxy) | `_maxRedeemPerBlock=10000000000000000000000000 (10,000,000.000000e18)` | `0x3B0A...1862` (GnosisSafeProxy) | 2025-08-05 |
> | 3 | USDT (TetherToken) | `_maxRedeemPerBlock=10000000000000000000000000 (10,000,000.000000e18)` | `0x3B0A...1862` (GnosisSafeProxy) | 2025-08-05 |
> | 4 | USDtb (TransparentUpgradeableProxy) | `_maxRedeemPerBlock=10000000000000000000000000 (10,000,000.000000e18)` | `0x3B0A...1862` (GnosisSafeProxy) | 2025-08-05 |
> | 5 | USDC (FiatTokenProxy) | `_maxRedeemPerBlock=10000000000000000000000000 (10,000,000.000000e18)` | `0x3B0A...1862` (GnosisSafeProxy) | 2025-08-05 |

> **`tokenConfig.tokenType`** *(per-asset)* ❄️ **DORMANT**

> > This parameter has never been changed since deployment.

> | Asset | Current Value |
> |---|---|
> | DAI (Dai) `0x6B17...1d0F` | `0` |
> | PYUSD (AdminUpgradeabilityProxy) `0x6c3e...A0e8` | `0` |
> | USDC (FiatTokenProxy) `0xA0b8...eB48` | `0` |
> | USDtb (TransparentUpgradeableProxy) `0xC139...aC1C` | `0` |
> | USDm (ERC1967Proxy) `0xEc2A...3926` | `0` |
> | USDT (TetherToken) `0xdAC1...1ec7` | `0` |
> | USDG (ERC1967Proxy) `0xe343...491D` | `0` |

> | Field | Value |
> |---|---|
> | Setter | `setTokenType(address asset, TokenType tokenType)` |
> | Gated by | `DEFAULT_ADMIN_ROLE` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> #### 💰 Supply Actions

> _Mint / redeem / burn call tracking — last 5 calls per function, total counts preserved._

> **`addSupportedAsset`** *(per-asset)* 🔄 **ACTIVE** (9 changes)

> > ⚠️ This parameter has been changed **9 times** — monitor for unexpected modifications.

> | Field | Value |
> |---|---|
> | Setter | `addSupportedAsset(address asset, TokenConfig memory _tokenConfig)` |
> | Gated by | `DEFAULT_ADMIN_ROLE` |
> | Tags | `SUPPLY` |
> | Last called | 2026-05-10 |
> | Called by | `0x3B0A...1862` (GnosisSafeProxy) |
> | Total calls | 9 🔄 |

> **Recent changes (showing last 5 of 9):**

> | # | Asset | Value | Set By | Date |
> |---|---|---|---|---|
> | 1 | USDG (ERC1967Proxy) | `_tokenConfig={tokenType: 0, isActive: True, maxMintPerBlock: 200000000000000000000000000 (200,000,000.000000e18), maxRedeemPerBlock: 10000000000000000000000000 (10,000,000.000000e18)}` | `0x3B0A...1862` (GnosisSafeProxy) | 2026-05-10 |
> | 2 | USDG (ERC1967Proxy) | `_tokenConfig={tokenType: 0, isActive: True, maxMintPerBlock: 200000000000000000000000000 (200,000,000.000000e18), maxRedeemPerBlock: 10000000000000000000000000 (10,000,000.000000e18)}` | `0x3B0A...1862` (GnosisSafeProxy) | 2026-05-10 |
> | 3 | USDG (ERC1967Proxy) | `_tokenConfig={tokenType: 0, isActive: True, maxMintPerBlock: 200000000000000000000000000 (200,000,000.000000e18), maxRedeemPerBlock: 10000000000000000000000000 (10,000,000.000000e18)}` | `0x3B0A...1862` (GnosisSafeProxy) | 2026-05-10 |
> | 4 | USDG (ERC1967Proxy) | `_tokenConfig={tokenType: 0, isActive: True, maxMintPerBlock: 200000000000000000000000000 (200,000,000.000000e18), maxRedeemPerBlock: 10000000000000000000000000 (10,000,000.000000e18)}` | `0x3B0A...1862` (GnosisSafeProxy) | 2026-05-10 |
> | 5 | USDG (ERC1967Proxy) | `_tokenConfig={tokenType: 0, isActive: True, maxMintPerBlock: 200000000000000000000000000 (200,000,000.000000e18), maxRedeemPerBlock: 10000000000000000000000000 (10,000,000.000000e18)}` | `0x3B0A...1862` (GnosisSafeProxy) | 2026-05-10 |

> **`mint`** 🔄 **ACTIVE** (16763 changes)

> > ⚠️ This parameter has been changed **16763 times** — monitor for unexpected modifications.

> | Field | Value |
> |---|---|
> | Setter | `mint(Order calldata order, Route calldata route, Signature calldata signature)` |
> | Gated by | `MINTER_ROLE` |
> | Tags | `SUPPLY` |
> | Last called | 2026-06-25 |
> | Called by | `0xf2fa...b439` (StakingRewardsDistributor) |
> | Total calls | ≥16763 🔄 |

> **Recent changes (showing last 5 of 16763):**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `0x950c886CC6B9d420455985c3D31090AA060e96C8` | `0xf2fa...b439` (StakingRewardsDistributor) | 2026-06-25 |
> | 2 | `0x57FefB75863cc64fECF11ac99d7A5b60EBE0080f` | `0x8D3e...A8Bc` (EOA) | 2026-06-25 |
> | 3 | `0x03984DDEF40850bB9862Ec09037853630d7b6Ae4` | `0x8D3e...A8Bc` (EOA) | 2026-06-25 |
> | 4 | `0xc3309fDDFC8297c39A38d5D872a37222f98DAd37` | `0x8D3e...A8Bc` (EOA) | 2026-06-25 |
> | 5 | `0x6FD5ffEe1220b0458c2114d6ce7fB4dE2BC8fEE6` | `0x8D3e...A8Bc` (EOA) | 2026-06-25 |

> **`mintWETH`** ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Setter | `mintWETH(Order calldata order, Route calldata route, Signature calldata signature)` |
> | Gated by | `MINTER_ROLE` |
> | Tags | `SUPPLY` |
> | Last called | — |
> | Called by | — |
> | Total calls | 0 ❄️ |

> **`redeem`** 🔄 **ACTIVE** (13974 changes)

> > ⚠️ This parameter has been changed **13974 times** — monitor for unexpected modifications.

> | Field | Value |
> |---|---|
> | Setter | `redeem(Order calldata order, Signature calldata signature)` |
> | Gated by | `REDEEMER_ROLE` |
> | Tags | `SUPPLY` |
> | Last called | 2026-06-25 |
> | Called by | `0xcb92...f941` (EOA) |
> | Total calls | ≥13974 🔄 |

> **Recent changes (showing last 5 of 13974):**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `0xD0899998CCEB5B3df5cdcFaAdd43e53B8e1d553e` | `0xcb92...f941` (EOA) | 2026-06-25 |
> | 2 | `0x661Ca83074b8Ec630825D4604455325499F951a1` | `0xcb92...f941` (EOA) | 2026-06-25 |
> | 3 | `0xA22C29b20f9Be2C809979Ed606b24Fe5286AC8F2` | `0x8D3e...A8Bc` (EOA) | 2026-06-25 |
> | 4 | `0x4d394F45dFaDef5522759c511702Db97690A5C12` | `0x8D3e...A8Bc` (EOA) | 2026-06-25 |
> | 5 | `0xc3309fDDFC8297c39A38d5D872a37222f98DAd37` | `0x3B6A...5644` (EOA) | 2026-06-25 |

> **`removeCollateralManagerRole`** *(per-asset)* ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Setter | `removeCollateralManagerRole(address collateralManager)` |
> | Gated by | `GATEKEEPER_ROLE` |
> | Tags | `SUPPLY` `CONFIG` |
> | Last called | — |
> | Called by | — |
> | Total calls | 0 ❄️ |

> **`removeMinterRole`** *(per-asset)* ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Setter | `removeMinterRole(address minter)` |
> | Gated by | `GATEKEEPER_ROLE` |
> | Tags | `SUPPLY` `CONFIG` |
> | Last called | — |
> | Called by | — |
> | Total calls | 0 ❄️ |

> **`removeSupportedAsset`** *(per-asset)* 🔄 **ACTIVE** (10 changes)

> > ⚠️ This parameter has been changed **10 times** — monitor for unexpected modifications.

> | Field | Value |
> |---|---|
> | Setter | `removeSupportedAsset(address asset)` |
> | Gated by | `DEFAULT_ADMIN_ROLE` |
> | Tags | `SUPPLY` |
> | Last called | 2024-06-25 |
> | Called by | `0x3B0A...1862` (GnosisSafeProxy) |
> | Total calls | 10 🔄 |

> **Recent changes (showing last 5 of 10):**

> | # | Asset | Value | Set By | Date |
> |---|---|---|---|---|
> | 1 | EOA | `(Safe-mediated)` | `0x3B0A...1862` (GnosisSafeProxy) | 2024-06-25 |
> | 2 | wBETH (FiatTokenProxy) | `(Safe-mediated)` | `0x3B0A...1862` (GnosisSafeProxy) | 2024-06-25 |
> | 3 | mETH | `(Safe-mediated)` | `0x3B0A...1862` (GnosisSafeProxy) | 2024-06-25 |
> | 4 | stETH (AppProxyUpgradeable) | `(Safe-mediated)` | `0x3B0A...1862` (GnosisSafeProxy) | 2024-06-25 |
> | 5 | Wrapped Ether | `(Safe-mediated)` | `0x3B0A...1862` (GnosisSafeProxy) | 2024-06-25 |

> **`transferToCustody`** *(per-asset)*

> | Field | Value |
> |---|---|
> | Setter | `transferToCustody(address wallet, address asset, uint128 amount)` |
> | Gated by | `COLLATERAL_MANAGER_ROLE` |
> | Tags | `SUPPLY` |
> | Last called | 2026-05-08 |
> | Called by | `0x3B0A...1862` (GnosisSafeProxy) |
> | Total calls | 2 |

> **Recent changes:**

> | # | Asset | Value | Set By | Date |
> |---|---|---|---|---|
> | 1 | EOA | `asset=0xEc2AF1C8B110a61fD9C3Fa6a554a031Ca9943926 · amount=17916606000000000000000000 (17,916,606.000000e18)` | `0x3B0A...1862` (GnosisSafeProxy) | 2026-05-08 |
> | 2 | EOA | `asset=0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 · amount=17997119000000` | `0x3B0A...1862` (GnosisSafeProxy) | 2025-02-04 |

> #### 📋 Tracked Whitelists

> **Supported Assets** `SUPPLY`
> Managed by: `DEFAULT_ADMIN_ROLE` · via `addSupportedAsset` / `removeSupportedAsset`

> **Current members (7):**

> | # | Address |
> |---|---|
> | 1 | `0xC139190F447e929f090Edeb554D95AbB8b18aC1C` (USDtb (TransparentUpgradeableProxy)) |
> | 2 | `0x6c3ea9036406852006290770BEdFcAbA0e23A0e8` (PYUSD (AdminUpgradeabilityProxy)) |
> | 3 | `0xEc2AF1C8B110a61fD9C3Fa6a554a031Ca9943926` (USDm (ERC1967Proxy)) |
> | 4 | `0xe343167631d89B6Ffc58B88d6b7fB0228795491D` (USDG (ERC1967Proxy)) |
> | 5 | `0x6B175474E89094C44Da98b954EedeAC495271d0F` (DAI (Dai)) |
> | 6 | `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48` (USDC (FiatTokenProxy)) |
> | 7 | `0xdAC17F958D2ee523a2206206994597C13D831ec7` (USDT (TetherToken)) |

> **⚠️ Storage vs Event Discrepancies:**

> - ⚠️ `0x6B175474E89094C44Da98b954EedeAC495271d0F` active in storage but has no `addSupportedAsset` event — set via constructor
> - ⚠️ `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48` active in storage but has no `addSupportedAsset` event — set via constructor
> - ⚠️ `0xdAC17F958D2ee523a2206206994597C13D831ec7` active in storage but has no `addSupportedAsset` event — set via constructor

> **Change history:**

> | Action | Address | Set By | Date |
> |---|---|---|---|
> | ➕ Added | `0xe343...491D` (USDG (ERC1967Proxy)) | `0x3520...0E8f` | 2026-05-10 |
> | ➕ Added | `0xEc2A...3926` (USDm (ERC1967Proxy)) | `0x3520...0E8f` | 2026-04-29 |
> | ➕ Added | `0x6c3e...A0e8` (PYUSD (AdminUpgradeabilityProxy)) | `0x3520...0E8f` | 2025-09-19 |
> | ➕ Added | `0xC139...aC1C` (USDtb (TransparentUpgradeableProxy)) | `0x54D0...a471` | 2024-12-16 |
> | ➖ Removed | `0xEeee...EEeE` | `0x643D...7Ae4` | 2024-06-25 |
> | ➖ Removed | `0xa2E3...E2e1` | `0x643D...7Ae4` | 2024-06-25 |
> | ➖ Removed | `0xd5F7...ADfa` | `0x643D...7Ae4` | 2024-06-25 |
> | ➖ Removed | `0xae7a...fE84` | `0x643D...7Ae4` | 2024-06-25 |
> | ➖ Removed | `0xC02a...6Cc2` | `0x643D...7Ae4` | 2024-06-25 |

> **Custodian Addresses** `CONFIG`
> Managed by: `DEFAULT_ADMIN_ROLE` · via `addCustodianAddress` / `removeCustodianAddress`

> **Current members (5):**

> | # | Address |
> |---|---|
> | 1 | `0x8f0eE0393Eae7fc1638BD7860a3FEc6a663786AE` (EOA) |
> | 2 | `0x12FDB344e4D195fF6613D0f742a6E38344c8b455` (EOA) |
> | 3 | `0x32b24247cbcE7c17b0017A2159a9FA481f401b16` (EOA) |
> | 4 | `0x2d4d2A025b10C09BDbd794B4FCe4F7ea8C7d7bB4` (EOA) |
> | 5 | `0xAFBb1a7E9ddEf38D9bC4A220E702B18DAcaa2a62` (EOA) |

> **Change history:**

> | Action | Address | Set By | Date |
> |---|---|---|---|
> | ➕ Added | `0xAFBb...2a62` (EOA) | `0x3520...0E8f` | 2026-04-28 |
> | ➕ Added | `0x2d4d...7bB4` (EOA) | `0x6689...550F` | 2024-09-05 |
> | ➕ Added | `0x32b2...1b16` (EOA) | `0x8dE5...8FaE` | 2024-06-21 |
> | ➕ Added | `0x12FD...b455` (EOA) | `0x8dE5...8FaE` | 2024-06-21 |
> | ➕ Added | `0x8f0e...86AE` (EOA) | `0x8dE5...8FaE` | 2024-06-21 |

> **Whitelisted Benefactors** 
> Managed by: `DEFAULT_ADMIN_ROLE` · via `addWhitelistedBenefactor` / `removeWhitelistedBenefactor`

> **Active count: 526** _(individual addresses omitted — user role)_

> **Change history (showing last 15 of 534):**

> | Action | Address | Set By | Date |
> |---|---|---|---|
> | ➕ Added | `0xE9A8...3e33` (EOA) | `0x3520...0E8f` | 2026-06-24 |
> | ➕ Added | `0xc31B...2A83` (EOA) | `0x3520...0E8f` | 2026-06-22 |
> | ➕ Added | `0x2E3d...90e5` (EOA) | `0x3520...0E8f` | 2026-06-12 |
> | ➕ Added | `0xddcd...cDd1` (EOA) | `0x3520...0E8f` | 2026-06-12 |
> | ➕ Added | `0xAE51...7200` (EOA) | `0x3520...0E8f` | 2026-06-12 |
> | ➕ Added | `0x3B6A...5644` (EOA) | `0x3520...0E8f` | 2026-06-08 |
> | ➕ Added | `0xe0a6...DA9C` (EOA) | `0x3520...0E8f` | 2026-06-08 |
> | ➖ Removed | `0x673B...C11D` (EOA (EIP-7702 → 0x63c0c19a…)) | `0x3520...0E8f` | 2026-06-03 |
> | ➕ Added | `0x9d2e...59b6` (EOA) | `0x3520...0E8f` | 2026-06-03 |
> | ➕ Added | `0xab79...e45E` (EOA) | `0x3520...0E8f` | 2026-06-03 |
> | ➕ Added | `0xcb92...f941` (EOA) | `0x3520...0E8f` | 2026-06-03 |
> | ➖ Removed | `0xC23D...4AAa` (EOA) | `0x3520...0E8f` | 2026-06-03 |
> | ➖ Removed | `0x995e...6Cbf` (EOA) | `0x3520...0E8f` | 2026-06-03 |
> | ➕ Added | `0x9999...8Ae2` (EOA) | `0x3520...0E8f` | 2026-06-03 |
> | ➕ Added | `0x8d1B...d95C` (EOA) | `0x3520...0E8f` | 2026-06-03 |

---
## ⚡ Authority Concentration

The following addresses hold permissions across multiple contracts or roles in this dependency stack. Concentration of authority increases systemic risk — a single compromised key or colluding multisig can affect multiple systems.

### 🟢 `0x3B0AAf6e6fCd4a7cEEf8c92C32DFeA9E64dC1862` — GnosisSafeProxy
Controls **3 role(s)** across **2 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| USDe `0x4c9E...68B3` | `owner()` | `setMinter(address newMinter)`, `transferOwnership(address newOwner)`, `acceptOwnership()` | — |
| EthenaMinting `0xe349...62D3` | `COLLATERAL_MANAGER_ROLE` | `transferToCustody(address wallet, address asset, uint128 amount)` | 2025-02-04 |
| EthenaMinting `0xe349...62D3` | `DEFAULT_ADMIN_ROLE` | `setGlobalMaxMintPerBlock(uint128 _globalMaxMintPerBlock)`, `setGlobalMaxRedeemPerBlock(uint128 _globalMaxRedeemPerBlock)`, `removeSupportedAsset(address asset)`, `removeCustodianAddress(address custodian)` +12 more | 2024-06-21 |

### 🔴 `0x03984DDEF40850bB9862Ec09037853630d7b6Ae4` — EOA
Controls **2 role(s)** across **1 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| EthenaMinting `0xe349...62D3` | `MINTER_ROLE` | `mint(Order calldata order, Route calldata route, Signature calldata signature)`, `mintWETH(Order calldata order, Route calldata route, Signature calldata signature)` | 2024-07-04 |
| EthenaMinting `0xe349...62D3` | `REDEEMER_ROLE` | `redeem(Order calldata order, Signature calldata signature)` | 2024-07-08 |

### 🔴 `0x0B23d23939A1731289EAA04f62BA1dd4Ecdd5c7d` — EOA
Controls **2 role(s)** across **1 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| EthenaMinting `0xe349...62D3` | `MINTER_ROLE` | `mint(Order calldata order, Route calldata route, Signature calldata signature)`, `mintWETH(Order calldata order, Route calldata route, Signature calldata signature)` | 2024-07-04 |
| EthenaMinting `0xe349...62D3` | `REDEEMER_ROLE` | `redeem(Order calldata order, Signature calldata signature)` | 2024-07-08 |

### 🔴 `0x24bE9948466FEcEB22A9B77b19e404F2119fb962` — EOA
Controls **2 role(s)** across **1 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| EthenaMinting `0xe349...62D3` | `MINTER_ROLE` | `mint(Order calldata order, Route calldata route, Signature calldata signature)`, `mintWETH(Order calldata order, Route calldata route, Signature calldata signature)` | 2024-07-04 |
| EthenaMinting `0xe349...62D3` | `REDEEMER_ROLE` | `redeem(Order calldata order, Signature calldata signature)` | 2024-07-08 |

### 🔴 `0x4d394F45dFaDef5522759c511702Db97690A5C12` — EOA
Controls **2 role(s)** across **1 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| EthenaMinting `0xe349...62D3` | `MINTER_ROLE` | `mint(Order calldata order, Route calldata route, Signature calldata signature)`, `mintWETH(Order calldata order, Route calldata route, Signature calldata signature)` | 2024-07-04 |
| EthenaMinting `0xe349...62D3` | `REDEEMER_ROLE` | `redeem(Order calldata order, Signature calldata signature)` | 2024-07-08 |

### 🔴 `0x57093ffEdC2F49Eb3a5A11b63C0f4Ca1B75C5CB7` — EOA
Controls **2 role(s)** across **1 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| EthenaMinting `0xe349...62D3` | `MINTER_ROLE` | `mint(Order calldata order, Route calldata route, Signature calldata signature)`, `mintWETH(Order calldata order, Route calldata route, Signature calldata signature)` | 2024-07-04 |
| EthenaMinting `0xe349...62D3` | `REDEEMER_ROLE` | `redeem(Order calldata order, Signature calldata signature)` | 2024-07-08 |

### 🔴 `0x57FefB75863cc64fECF11ac99d7A5b60EBE0080f` — EOA
Controls **2 role(s)** across **1 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| EthenaMinting `0xe349...62D3` | `MINTER_ROLE` | `mint(Order calldata order, Route calldata route, Signature calldata signature)`, `mintWETH(Order calldata order, Route calldata route, Signature calldata signature)` | 2024-07-04 |
| EthenaMinting `0xe349...62D3` | `REDEEMER_ROLE` | `redeem(Order calldata order, Signature calldata signature)` | 2024-07-08 |

### 🔴 `0x64004ae464f49C30a188C34E01B0dC66c8bEb21E` — EOA
Controls **2 role(s)** across **1 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| EthenaMinting `0xe349...62D3` | `MINTER_ROLE` | `mint(Order calldata order, Route calldata route, Signature calldata signature)`, `mintWETH(Order calldata order, Route calldata route, Signature calldata signature)` | 2024-07-04 |
| EthenaMinting `0xe349...62D3` | `REDEEMER_ROLE` | `redeem(Order calldata order, Signature calldata signature)` | 2024-07-08 |

### 🔴 `0x655a1B0124b39B2d7C7F62a99627a891faD93B7B` — EOA
Controls **2 role(s)** across **1 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| EthenaMinting `0xe349...62D3` | `MINTER_ROLE` | `mint(Order calldata order, Route calldata route, Signature calldata signature)`, `mintWETH(Order calldata order, Route calldata route, Signature calldata signature)` | 2024-07-04 |
| EthenaMinting `0xe349...62D3` | `REDEEMER_ROLE` | `redeem(Order calldata order, Signature calldata signature)` | 2024-07-08 |

### 🔴 `0x661Ca83074b8Ec630825D4604455325499F951a1` — EOA
Controls **2 role(s)** across **1 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| EthenaMinting `0xe349...62D3` | `MINTER_ROLE` | `mint(Order calldata order, Route calldata route, Signature calldata signature)`, `mintWETH(Order calldata order, Route calldata route, Signature calldata signature)` | 2024-07-04 |
| EthenaMinting `0xe349...62D3` | `REDEEMER_ROLE` | `redeem(Order calldata order, Signature calldata signature)` | 2024-07-08 |

### 🔴 `0x6F1d2df2ACc5f2dA3167Ad1967b648207cfC63DB` — EOA
Controls **2 role(s)** across **1 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| EthenaMinting `0xe349...62D3` | `MINTER_ROLE` | `mint(Order calldata order, Route calldata route, Signature calldata signature)`, `mintWETH(Order calldata order, Route calldata route, Signature calldata signature)` | 2024-07-04 |
| EthenaMinting `0xe349...62D3` | `REDEEMER_ROLE` | `redeem(Order calldata order, Signature calldata signature)` | 2024-07-08 |

### 🔴 `0x6FD5ffEe1220b0458c2114d6ce7fB4dE2BC8fEE6` — EOA
Controls **2 role(s)** across **1 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| EthenaMinting `0xe349...62D3` | `MINTER_ROLE` | `mint(Order calldata order, Route calldata route, Signature calldata signature)`, `mintWETH(Order calldata order, Route calldata route, Signature calldata signature)` | 2024-07-04 |
| EthenaMinting `0xe349...62D3` | `REDEEMER_ROLE` | `redeem(Order calldata order, Signature calldata signature)` | 2024-07-08 |

### 🔴 `0x71C95AAA22696d745E378486b769eE47cA23797c` — EOA
Controls **2 role(s)** across **1 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| EthenaMinting `0xe349...62D3` | `MINTER_ROLE` | `mint(Order calldata order, Route calldata route, Signature calldata signature)`, `mintWETH(Order calldata order, Route calldata route, Signature calldata signature)` | 2024-07-04 |
| EthenaMinting `0xe349...62D3` | `REDEEMER_ROLE` | `redeem(Order calldata order, Signature calldata signature)` | 2024-07-08 |

### 🔴 `0x7d69817Ea29244504c1A97B66E2C990F25DF7599` — EOA
Controls **2 role(s)** across **1 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| EthenaMinting `0xe349...62D3` | `MINTER_ROLE` | `mint(Order calldata order, Route calldata route, Signature calldata signature)`, `mintWETH(Order calldata order, Route calldata route, Signature calldata signature)` | 2024-07-04 |
| EthenaMinting `0xe349...62D3` | `REDEEMER_ROLE` | `redeem(Order calldata order, Signature calldata signature)` | 2024-07-08 |

### 🔴 `0x950c886CC6B9d420455985c3D31090AA060e96C8` — EOA
Controls **2 role(s)** across **1 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| EthenaMinting `0xe349...62D3` | `MINTER_ROLE` | `mint(Order calldata order, Route calldata route, Signature calldata signature)`, `mintWETH(Order calldata order, Route calldata route, Signature calldata signature)` | 2024-07-04 |
| EthenaMinting `0xe349...62D3` | `REDEEMER_ROLE` | `redeem(Order calldata order, Signature calldata signature)` | 2024-07-08 |

### 🔴 `0x9b6889199627f78470EA230cC7Df974239e0a5e5` — EOA
Controls **2 role(s)** across **1 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| EthenaMinting `0xe349...62D3` | `MINTER_ROLE` | `mint(Order calldata order, Route calldata route, Signature calldata signature)`, `mintWETH(Order calldata order, Route calldata route, Signature calldata signature)` | 2024-07-04 |
| EthenaMinting `0xe349...62D3` | `REDEEMER_ROLE` | `redeem(Order calldata order, Signature calldata signature)` | 2024-07-08 |

### 🔴 `0xA22C29b20f9Be2C809979Ed606b24Fe5286AC8F2` — EOA
Controls **2 role(s)** across **1 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| EthenaMinting `0xe349...62D3` | `MINTER_ROLE` | `mint(Order calldata order, Route calldata route, Signature calldata signature)`, `mintWETH(Order calldata order, Route calldata route, Signature calldata signature)` | 2024-07-04 |
| EthenaMinting `0xe349...62D3` | `REDEEMER_ROLE` | `redeem(Order calldata order, Signature calldata signature)` | 2024-07-08 |

### 🔴 `0xD0899998CCEB5B3df5cdcFaAdd43e53B8e1d553e` — EOA
Controls **2 role(s)** across **1 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| EthenaMinting `0xe349...62D3` | `MINTER_ROLE` | `mint(Order calldata order, Route calldata route, Signature calldata signature)`, `mintWETH(Order calldata order, Route calldata route, Signature calldata signature)` | 2024-07-04 |
| EthenaMinting `0xe349...62D3` | `REDEEMER_ROLE` | `redeem(Order calldata order, Signature calldata signature)` | 2024-07-08 |

### 🔴 `0xb229D6dB056750E22499191156Bf4c3654DF3826` — EOA
Controls **2 role(s)** across **1 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| EthenaMinting `0xe349...62D3` | `MINTER_ROLE` | `mint(Order calldata order, Route calldata route, Signature calldata signature)`, `mintWETH(Order calldata order, Route calldata route, Signature calldata signature)` | 2024-07-04 |
| EthenaMinting `0xe349...62D3` | `REDEEMER_ROLE` | `redeem(Order calldata order, Signature calldata signature)` | 2024-07-08 |

### 🔴 `0xc3309fDDFC8297c39A38d5D872a37222f98DAd37` — EOA
Controls **2 role(s)** across **1 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| EthenaMinting `0xe349...62D3` | `MINTER_ROLE` | `mint(Order calldata order, Route calldata route, Signature calldata signature)`, `mintWETH(Order calldata order, Route calldata route, Signature calldata signature)` | 2024-07-04 |
| EthenaMinting `0xe349...62D3` | `REDEEMER_ROLE` | `redeem(Order calldata order, Signature calldata signature)` | 2024-07-08 |

### 🔴 `0xcD992cFB025014C01EBc2f2311c3F87aA8411d9c` — EOA
Controls **2 role(s)** across **1 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| EthenaMinting `0xe349...62D3` | `MINTER_ROLE` | `mint(Order calldata order, Route calldata route, Signature calldata signature)`, `mintWETH(Order calldata order, Route calldata route, Signature calldata signature)` | 2024-07-04 |
| EthenaMinting `0xe349...62D3` | `REDEEMER_ROLE` | `redeem(Order calldata order, Signature calldata signature)` | 2024-07-08 |


---
## ⛔ Sanctions Screening

| Source | Status |
|---|---|
| OFAC SDN | ✅ OFAC SDN screened (97 ETH addresses, cache: 2026-06-25) |
| Chainalysis | ✅ Chainalysis screened |
| **Result** | 604 addresses screened · ✅ 0 flagged |

---
## EOA Exposure Summary

The following roles are held by EOAs:

- **EthenaMinting** → `GATEKEEPER_ROLE` held by EOA `0x0F566cC38677239Bed459047065925654b6d5BD9`
  Functions: `disableMintRedeem()`, `removeMinterRole(address minter)`, `removeRedeemerRole(address redeemer)`
- **EthenaMinting** → `GATEKEEPER_ROLE` held by EOA `0x496011675b197CC136B48BC19D848FE26D3a8996`
  Functions: `disableMintRedeem()`, `removeMinterRole(address minter)`, `removeRedeemerRole(address redeemer)`
- **EthenaMinting** → `GATEKEEPER_ROLE` held by EOA `0xAB9110d36B030bAe812CD3BB7B9dE805A64AA7dC`
  Functions: `disableMintRedeem()`, `removeMinterRole(address minter)`, `removeRedeemerRole(address redeemer)`
- **EthenaMinting** → `GATEKEEPER_ROLE` held by EOA `0xb6ECaE7413A3E78a3e10f15aFE3066e79566CCA3`
  Functions: `disableMintRedeem()`, `removeMinterRole(address minter)`, `removeRedeemerRole(address redeemer)`
- **EthenaMinting** → `MINTER_ROLE` held by EOA `0x03984DDEF40850bB9862Ec09037853630d7b6Ae4`
  Functions: `mint(Order calldata order, Route calldata route, Signature calldata signature)`, `mintWETH(Order calldata order, Route calldata route, Signature calldata signature)`
- **EthenaMinting** → `MINTER_ROLE` held by EOA `0x0B23d23939A1731289EAA04f62BA1dd4Ecdd5c7d`
  Functions: `mint(Order calldata order, Route calldata route, Signature calldata signature)`, `mintWETH(Order calldata order, Route calldata route, Signature calldata signature)`
- **EthenaMinting** → `MINTER_ROLE` held by EOA `0x24bE9948466FEcEB22A9B77b19e404F2119fb962`
  Functions: `mint(Order calldata order, Route calldata route, Signature calldata signature)`, `mintWETH(Order calldata order, Route calldata route, Signature calldata signature)`
- **EthenaMinting** → `MINTER_ROLE` held by EOA `0x4d394F45dFaDef5522759c511702Db97690A5C12`
  Functions: `mint(Order calldata order, Route calldata route, Signature calldata signature)`, `mintWETH(Order calldata order, Route calldata route, Signature calldata signature)`
- **EthenaMinting** → `MINTER_ROLE` held by EOA `0x57093ffEdC2F49Eb3a5A11b63C0f4Ca1B75C5CB7`
  Functions: `mint(Order calldata order, Route calldata route, Signature calldata signature)`, `mintWETH(Order calldata order, Route calldata route, Signature calldata signature)`
- **EthenaMinting** → `MINTER_ROLE` held by EOA `0x57FefB75863cc64fECF11ac99d7A5b60EBE0080f`
  Functions: `mint(Order calldata order, Route calldata route, Signature calldata signature)`, `mintWETH(Order calldata order, Route calldata route, Signature calldata signature)`
- **EthenaMinting** → `MINTER_ROLE` held by EOA `0x64004ae464f49C30a188C34E01B0dC66c8bEb21E`
  Functions: `mint(Order calldata order, Route calldata route, Signature calldata signature)`, `mintWETH(Order calldata order, Route calldata route, Signature calldata signature)`
- **EthenaMinting** → `MINTER_ROLE` held by EOA `0x655a1B0124b39B2d7C7F62a99627a891faD93B7B`
  Functions: `mint(Order calldata order, Route calldata route, Signature calldata signature)`, `mintWETH(Order calldata order, Route calldata route, Signature calldata signature)`
- **EthenaMinting** → `MINTER_ROLE` held by EOA `0x661Ca83074b8Ec630825D4604455325499F951a1`
  Functions: `mint(Order calldata order, Route calldata route, Signature calldata signature)`, `mintWETH(Order calldata order, Route calldata route, Signature calldata signature)`
- **EthenaMinting** → `MINTER_ROLE` held by EOA `0x6F1d2df2ACc5f2dA3167Ad1967b648207cfC63DB`
  Functions: `mint(Order calldata order, Route calldata route, Signature calldata signature)`, `mintWETH(Order calldata order, Route calldata route, Signature calldata signature)`
- **EthenaMinting** → `MINTER_ROLE` held by EOA `0x6FD5ffEe1220b0458c2114d6ce7fB4dE2BC8fEE6`
  Functions: `mint(Order calldata order, Route calldata route, Signature calldata signature)`, `mintWETH(Order calldata order, Route calldata route, Signature calldata signature)`
- **EthenaMinting** → `MINTER_ROLE` held by EOA `0x71C95AAA22696d745E378486b769eE47cA23797c`
  Functions: `mint(Order calldata order, Route calldata route, Signature calldata signature)`, `mintWETH(Order calldata order, Route calldata route, Signature calldata signature)`
- **EthenaMinting** → `MINTER_ROLE` held by EOA `0x7d69817Ea29244504c1A97B66E2C990F25DF7599`
  Functions: `mint(Order calldata order, Route calldata route, Signature calldata signature)`, `mintWETH(Order calldata order, Route calldata route, Signature calldata signature)`
- **EthenaMinting** → `MINTER_ROLE` held by EOA `0x950c886CC6B9d420455985c3D31090AA060e96C8`
  Functions: `mint(Order calldata order, Route calldata route, Signature calldata signature)`, `mintWETH(Order calldata order, Route calldata route, Signature calldata signature)`
- **EthenaMinting** → `MINTER_ROLE` held by EOA `0x9b6889199627f78470EA230cC7Df974239e0a5e5`
  Functions: `mint(Order calldata order, Route calldata route, Signature calldata signature)`, `mintWETH(Order calldata order, Route calldata route, Signature calldata signature)`
- **EthenaMinting** → `MINTER_ROLE` held by EOA `0xA22C29b20f9Be2C809979Ed606b24Fe5286AC8F2`
  Functions: `mint(Order calldata order, Route calldata route, Signature calldata signature)`, `mintWETH(Order calldata order, Route calldata route, Signature calldata signature)`
- **EthenaMinting** → `MINTER_ROLE` held by EOA `0xD0899998CCEB5B3df5cdcFaAdd43e53B8e1d553e`
  Functions: `mint(Order calldata order, Route calldata route, Signature calldata signature)`, `mintWETH(Order calldata order, Route calldata route, Signature calldata signature)`
- **EthenaMinting** → `MINTER_ROLE` held by EOA `0xb229D6dB056750E22499191156Bf4c3654DF3826`
  Functions: `mint(Order calldata order, Route calldata route, Signature calldata signature)`, `mintWETH(Order calldata order, Route calldata route, Signature calldata signature)`
- **EthenaMinting** → `MINTER_ROLE` held by EOA `0xc3309fDDFC8297c39A38d5D872a37222f98DAd37`
  Functions: `mint(Order calldata order, Route calldata route, Signature calldata signature)`, `mintWETH(Order calldata order, Route calldata route, Signature calldata signature)`
- **EthenaMinting** → `MINTER_ROLE` held by EOA `0xcD992cFB025014C01EBc2f2311c3F87aA8411d9c`
  Functions: `mint(Order calldata order, Route calldata route, Signature calldata signature)`, `mintWETH(Order calldata order, Route calldata route, Signature calldata signature)`
- **EthenaMinting** → `REDEEMER_ROLE` held by EOA `0x03984DDEF40850bB9862Ec09037853630d7b6Ae4`
  Functions: `redeem(Order calldata order, Signature calldata signature)`
- **EthenaMinting** → `REDEEMER_ROLE` held by EOA `0x0B23d23939A1731289EAA04f62BA1dd4Ecdd5c7d`
  Functions: `redeem(Order calldata order, Signature calldata signature)`
- **EthenaMinting** → `REDEEMER_ROLE` held by EOA `0x24bE9948466FEcEB22A9B77b19e404F2119fb962`
  Functions: `redeem(Order calldata order, Signature calldata signature)`
- **EthenaMinting** → `REDEEMER_ROLE` held by EOA `0x4d394F45dFaDef5522759c511702Db97690A5C12`
  Functions: `redeem(Order calldata order, Signature calldata signature)`
- **EthenaMinting** → `REDEEMER_ROLE` held by EOA `0x57093ffEdC2F49Eb3a5A11b63C0f4Ca1B75C5CB7`
  Functions: `redeem(Order calldata order, Signature calldata signature)`
- **EthenaMinting** → `REDEEMER_ROLE` held by EOA `0x57FefB75863cc64fECF11ac99d7A5b60EBE0080f`
  Functions: `redeem(Order calldata order, Signature calldata signature)`
- **EthenaMinting** → `REDEEMER_ROLE` held by EOA `0x64004ae464f49C30a188C34E01B0dC66c8bEb21E`
  Functions: `redeem(Order calldata order, Signature calldata signature)`
- **EthenaMinting** → `REDEEMER_ROLE` held by EOA `0x655a1B0124b39B2d7C7F62a99627a891faD93B7B`
  Functions: `redeem(Order calldata order, Signature calldata signature)`
- **EthenaMinting** → `REDEEMER_ROLE` held by EOA `0x661Ca83074b8Ec630825D4604455325499F951a1`
  Functions: `redeem(Order calldata order, Signature calldata signature)`
- **EthenaMinting** → `REDEEMER_ROLE` held by EOA `0x6F1d2df2ACc5f2dA3167Ad1967b648207cfC63DB`
  Functions: `redeem(Order calldata order, Signature calldata signature)`
- **EthenaMinting** → `REDEEMER_ROLE` held by EOA `0x6FD5ffEe1220b0458c2114d6ce7fB4dE2BC8fEE6`
  Functions: `redeem(Order calldata order, Signature calldata signature)`
- **EthenaMinting** → `REDEEMER_ROLE` held by EOA `0x71C95AAA22696d745E378486b769eE47cA23797c`
  Functions: `redeem(Order calldata order, Signature calldata signature)`
- **EthenaMinting** → `REDEEMER_ROLE` held by EOA `0x7d69817Ea29244504c1A97B66E2C990F25DF7599`
  Functions: `redeem(Order calldata order, Signature calldata signature)`
- **EthenaMinting** → `REDEEMER_ROLE` held by EOA `0x950c886CC6B9d420455985c3D31090AA060e96C8`
  Functions: `redeem(Order calldata order, Signature calldata signature)`
- **EthenaMinting** → `REDEEMER_ROLE` held by EOA `0x9b6889199627f78470EA230cC7Df974239e0a5e5`
  Functions: `redeem(Order calldata order, Signature calldata signature)`
- **EthenaMinting** → `REDEEMER_ROLE` held by EOA `0xA22C29b20f9Be2C809979Ed606b24Fe5286AC8F2`
  Functions: `redeem(Order calldata order, Signature calldata signature)`
- **EthenaMinting** → `REDEEMER_ROLE` held by EOA `0xD0899998CCEB5B3df5cdcFaAdd43e53B8e1d553e`
  Functions: `redeem(Order calldata order, Signature calldata signature)`
- **EthenaMinting** → `REDEEMER_ROLE` held by EOA `0xb229D6dB056750E22499191156Bf4c3654DF3826`
  Functions: `redeem(Order calldata order, Signature calldata signature)`
- **EthenaMinting** → `REDEEMER_ROLE` held by EOA `0xc3309fDDFC8297c39A38d5D872a37222f98DAd37`
  Functions: `redeem(Order calldata order, Signature calldata signature)`
- **EthenaMinting** → `REDEEMER_ROLE` held by EOA `0xcD992cFB025014C01EBc2f2311c3F87aA8411d9c`
  Functions: `redeem(Order calldata order, Signature calldata signature)`

---
## ✅ Scan Integrity

No issues detected. All block ranges covered, source and ABI resolved for all contracts.
