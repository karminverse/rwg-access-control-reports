# Trustfall — Access Control Report — Staked Frax USD (sfrxUSD)

| Field | Value |
|---|---|
| Contract | `0xcf62F905562626CfcDD2261162a51fd02Fc9c5b6` |
| Token | Staked Frax USD (sfrxUSD) |
| Name | SfrxUSD |
| Chain | Ethereum |
| Proxy Status | ⚠️ **YES** — TransparentUpgradeable (upgradable) → `0xAad4A1D92053a62cE7a787641d8b4E5883e96700` |
| OZ AccessControl | ❌ No |
| Ownable | ❌ No |
| Pausable | — |
| ERC-4626 Vault | ✅ Underlying: `0xCAcd6fd266aF91b8AeD52aCCc382b4e165586E29` |
| Control Surface | — |
| Scan Integrity | ✅ No issues detected |
| Report Date | 2026-06-25 23:04 UTC |

### Surface Summary

| Field | Value |
|---|---:|
| Contracts | 8 |
| Role slots | 14 |
| Privileged Fns | 28 |
| EOA Holders | 0 |
| Critical Roles | 2 ⚠️ |

## Changes Since Last Scan

> Comparing **2026-06-02T22:27:33Z** (block 25232671) → **2026-06-25T23:04:31Z** (block 25397796).

### Contracts in scan
- ➕ `0xb898ad…e503` entered the scan
- ➕ `0xffffff…3937` entered the scan

### Roles
- ➕ New role `admin()` (`0xb898ad…e503`)
- ➕ New role `Safe Owners (4/7 required)` (`0xffffff…3937`)
- 🔄 `upgradeability (TransparentUpgradeable)` on **FraxOFTMintableAdapterUpgradeable** (`0x7311ce…e126`)
    - member ➕ `0xb898ad…e503`
    - member ➖ `0xb1748c…3f27`

### Parameters
- ➕ New tracked parameter `MAXIMUM_DELAY` (`0xb898ad…e503`)
- ➕ New tracked parameter `MINIMUM_DELAY` (`0xb898ad…e503`)
- ➕ New tracked parameter `changeThreshold(uint256)` (`0xffffff…3937`)

### Analyst Focus Areas
- ➕ New: HIGH::Observed: supply authority chain on GnosisSafeL2
- ➖ Resolved (no longer surfaced): CRITICAL::Observed: upgrade path has no timelock on FraxOFTMintableAdapterUpgradeable


## 📋 Protocol Context

> *From protocol profile: Frax Finance / sfrxUSD (ERC-4626 Vault)*

<details>
<summary><strong>Architecture</strong></summary>

- **Architectural shape:** Same Safe-only Frax-family pattern as frxUSD — 3/5 Gnosis Safe owns the upgrade path (ProxyAdmin) and minter() on the FraxOFTAdapter; vault-side timelock 3/6 Safe controls yield-rate setters. NO on-chain Timelock contract anywhere.
- **ERC-4626 vault:** deposit frxUSD, receive sfrxUSD shares that appreciate over time
- **Yield accrual:** linear model — pricePerShareIncPerSecond continuously inflates share price between sync() calls
- sync() is public — anyone can trigger reward materialization, no keeper dependency
- **No cooldown / no withdrawal gate:** withdraw and redeem are instant standard ERC-4626
- **No pause mechanism:** contract has no emergency pause or circuit breaker
- **No blacklist:** unlike Ethena sUSDe, no address-level transfer restrictions
- **Minter system:** timelock can add/remove minters who can mint sfrxUSD without depositing frxUSD (and burn from any address)
- TransparentUpgradeableProxy (EIP-1967) with ProxyAdmin at 0xeA0a6EC8114a0Af6Cf74Ca0036Ab31d892Df13cB
- **Two-step timelock transfer:** transferTimelock() + acceptTransferTimelock() prevents accidental admin loss
- EIP-3009 + EIP-2612 permit support for gasless transfers and approvals
- DEPRECATED__timelockAddress (immutable) points to 3/5 Safe; timelockAddress (immutable) points to 3/6 Safe
- **Signer note (informational):** Safe 3/5 and Safe 3/6 use overlapping EOA signers, many with high on-chain activity (hot wallets). This is shared Frax operational governance — documented for context, not flagged as a finding.

</details>

<details>
<summary><strong>Function Interaction Paths</strong></summary>

- **`setPricePerShareIncPerSecond(newRate)`** (`timelockAddress`)
  - Changes the per-second rate at which pricePerShare grows
  - All existing sfrxUSD holders see share price appreciation speed change
  - Setting to 0 freezes yield accrual — vault stops generating returns
  - Setting abnormally high inflates share price rapidly — mispriced collateral risk
  - ⚠️ *Direct control over yield rate. Malicious rate could distort sfrxUSD/frxUSD exchange rate, affecting all DeFi integrations using sfrxUSD as collateral.*
- **`setAllPricingParams(newPricePerShare, newRate, newLastSync)`** (`timelockAddress`)
  - Overwrites pricePerShareStored, pricePerShareIncPerSecond, and lastSync atomically
  - Can retroactively change the exchange rate — shares immediately worth more or less
  - Bypasses gradual accrual — instantaneous jump in vault share price
  - ⚠️ *Most powerful yield function — can instantly reprice all sfrxUSD. A malicious call could drain or inflate collateral value in a single transaction.*
- **`addMinter(minterAddress)`** (`timelockAddress`)
  - Grants address ability to call minter_mint (create sfrxUSD from nothing) and minter_burn_from (destroy any holder's sfrxUSD)
  - No per-address mint cap — minter has unlimited supply authority
  - Minter array is publicly enumerable via minters_array()
  - ⚠️ *Adding a malicious minter grants uncapped mint+burn. This is SUPPLY-tier authority — must verify every minter address is a trusted protocol contract.*
- **`minter_mint(to, amount)`** (`minters (any address in minter array)`)
  - Creates sfrxUSD tokens without frxUSD deposit — dilutes existing holders
  - Does NOT go through ERC-4626 deposit flow — no totalAssets increase
  - Breaks share-price invariant: totalSupply increases but totalAssets unchanged
  - ⚠️ *Uncollateralized minting directly dilutes vault. If minted sfrxUSD is used as collateral, it represents unbacked value.*
- **`minter_burn_from(from, amount)`** (`minters (any address in minter array)`)
  - Destroys sfrxUSD from any address without approval requirement
  - Reduces totalSupply — remaining holders' share price increases
  - ⚠️ *Confiscation capability equivalent — minter can burn anyone's sfrxUSD. No blacklist needed when minters have this power.*
- **`upgradeToAndCall(newImpl, data) via ProxyAdmin`** (`ProxyAdmin owner (Gnosis Safe 3/5)`)
  - Replaces entire contract logic — all functions, storage layout, access control
  - No timelock delay between proposal and execution
  - Can add new privileged functions, remove safety checks, or drain funds
  - ⚠️ *Instant upgrade with no timelock is CRITICAL — users have zero window to react. 3/5 multisig is the only barrier.*

</details>

## 📑 Table of Contents

1. [Analyst Focus Areas](#analyst-focus-areas)
2. Contracts
   - [sfrxUSD ★](#c-0xcf62f905562626cfcdd2261162a51fd02fc9c5b6)
   - [FraxOFTMintableAdapterUpgradeable](#c-0x7311cea93ccf5f4f7b789ee31eba5d9b9290e126)
   - [EndpointV2](#c-0x1a44076050125825900e736c501f859c50fe728c)
   - [Timelock](#c-0xb898ad2976b4d8f2e21521c9db16b7497825e503)
3. [⚡ Authority Concentration](#-authority-concentration)
4. [⛔ Sanctions Screening](#-sanctions-screening)
5. [EOA Exposure Summary](#eoa-exposure-summary)
6. [✅ Scan Integrity](#scan-integrity)

## Analyst Focus Areas

> **Observational findings — not risk determinations.** Each item below is a focus point for the Risk Analyst to interpret against collateralization context and the protocol's stated intent. Attention levels (CRITICAL / HIGH / LOW) reflect the scanner's heuristic weight — not a realized risk to FiRM. These observations support future risk assessments; they do not constitute one.

> **3 critical-attention** and **10 high-attention** observation(s) across 8 contract(s).


### 🔴 CRITICAL (3)

- 🔴 [**Observed: upgrade path has no timelock on SfrxUSD**](#c-0xcf62f905562626cfcdd2261162a51fd02fc9c5b6) — Proxy can be upgraded without a timelock delay — no observation window for users. Verify governance design.
- 🔴 [**Observed: upgrade surfaced new inflationary/upgrade authority on SfrxUSD**](#c-0xcf62f905562626cfcdd2261162a51fd02fc9c5b6) — Upgrade on 2025-09-02 (+13/-4 fn) [+SUPPLY | +ACCESS_CONTROL | -SUPPLY]. Access-control primitives: added `addMinter`, `removeMinter`. Review the Upgrade History table to verify intent.
- 🔴 [**Observed: upgrade surfaced new access-control authority on FraxOFTMintableAdapterUpgradeable**](#c-0x7311cea93ccf5f4f7b789ee31eba5d9b9290e126) — Upgrade on 2025-02-04 (+6/-0 fn) [+ACCESS_CONTROL]. Access-control primitives: added `renounceOwnership`, `transferOwnership`. Review the Upgrade History table to verify intent.

### 🟠 HIGH (10)

- 🟠 [**Observed: Gnosis Safe 3/5 controls both admin and upgrades**](#c-0xcf62f905562626cfcdd2261162a51fd02fc9c5b6) — `0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27` holds admin + upgrade authority across FraxOFTMintableAdapterUpgradeable, ProxyAdmin, SfrxUSD — single entity controls full stack. Verify governance design.
- 💰 **Observed: 2 role(s) with supply-altering capability** — Supply-altering surface detected: `minter()` on SfrxUSD, `timelockAddress()` on SfrxUSD. Assess each holder's custody and governance.
- 🚦 **Observed: no observable pause mechanism for supply** — Supply-altering surface detected on `SfrxUSD` but no PAUSE-capable role or pause()/unpause() ABI declaration was found across any in-scope contract. In an incident, there is no on-chain path to halt new issuance. Verify whether this is intentional (e.g. supply gated at a higher-level Fed or Custodian contract) or an oversight.
- 🔗 [**Observed: supply authority chain on FraxOFTMintableAdapterUpgradeable**](#c-0x7311cea93ccf5f4f7b789ee31eba5d9b9290e126) — Chain: SfrxUSD → `minter()` → FraxOFTMintableAdapterUpgradeable. Controlled by: `endpoint()`, `owner()`, `upgradeability (TransparentUpgradeable)`. Assess custody — compromise of this chain could affect root token supply.
- 🔗 [**Observed: supply authority chain on GnosisSafeL2**](#c-0xb898ad2976b4d8f2e21521c9db16b7497825e503) — Chain: SfrxUSD → `minter()` → GnosisSafeL2. Controlled by: `Safe Owners (4/7 required)`. Assess custody — compromise of this chain could affect root token supply.
- 🔗 [**Observed: supply authority chain on Safe**](#c-0xcf62f905562626cfcdd2261162a51fd02fc9c5b6) — Chain: SfrxUSD → `minter()` → Safe. Controlled by: `Safe Owners (3/6 required)`. Assess custody — compromise of this chain could affect root token supply.
- ⚠️ [**No Timelock in admin chain: `timelockAddress()` on SfrxUSD**](#c-0xb898ad2976b4d8f2e21521c9db16b7497825e503) — `timelockAddress()` has SUPPLY capability and is held by: `0x4b45...1Bc1` (Safe). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.

<details>
<summary>🔄 **2 volatile parameter(s) observed across 1 contract(s) (≥5 historical changes each)** — Operational tempo signal — high-velocity setters indicate active governance maintenance, oracle keepers, or routinely-tuned risk parameters. Expand to review each parameter's change count and current value; assess against the protocol's stated intent.</summary>

- 🔄 [**Observed: volatile parameter `pricePerShareIncPerSecond` on SfrxUSD**](#c-0xcf62f905562626cfcdd2261162a51fd02fc9c5b6) — `setPricePerShareIncPerSecond(uint256 _newPricePerShareIncPerSecond)` changed 22 times. Current value: `1197911451`. Assess change pattern.
- 🔄 [**Observed: volatile parameter `addMinter` on SfrxUSD**](#c-0xcf62f905562626cfcdd2261162a51fd02fc9c5b6) — `addMinter(address minter_address)` changed 7 times. Current value: ``. Assess change pattern.

</details>


### 🟢 LOW (2)

- 🟢 [**Observed: upgrade large non-privileged surface change on SfrxUSD**](#c-0xcf62f905562626cfcdd2261162a51fd02fc9c5b6) — Upgrade on 2026-01-26 (+9/-1 fn). Review the Upgrade History table to verify intent.
- 🟢 [**Observed: upgrade large non-privileged surface change on FraxOFTMintableAdapterUpgradeable**](#c-0x7311cea93ccf5f4f7b789ee31eba5d9b9290e126) — Upgrade on 2025-10-16 (+6/-1 fn). Review the Upgrade History table to verify intent.

> **Standard review checklist:** Verify role-holder identities, timelock delays, multisig quorum and signers, upgrade-path custody, and parameter bounds against current protocol spec — regardless of findings above.

## Proxy Admin

| Field | Value |
|---|---|
| ProxyAdmin contract | `0xeA0a6EC8114a0Af6Cf74Ca0036Ab31d892Df13cB` |
| ProxyAdmin owner | `0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27` |

## Attention Legend

> Attention levels indicate how prominently a signal should feature in the analyst's review — not the realized risk to FiRM.

| Icon | Attention | Meaning |
|---|---|---|
| 🔴 | CRITICAL | EOA private key, unknown upgrader, or unprotected upgrade path — verify immediately |
| 🟠 | HIGH | Unrecognised contract or elevated privilege pattern — requires investigation |
| 🟢 | LOW | Standard custodial pattern — Gnosis Safe, TimelockController, ERC-4626 vault, OZ Governor, Aragon Agent |
| 🔵 | DISCREPANCY | Storage and event history disagree — investigate for data integrity |

---
<a id="c-0xcf62f905562626cfcdd2261162a51fd02fc9c5b6"></a>
## SfrxUSD `0xcf62F905562626CfcDD2261162a51fd02Fc9c5b6`

> ⚠️ **Upgradeable** (TransparentUpgradeable) — impl: `0xAad4A1D92053a62cE7a787641d8b4E5883e96700`

**Proxy History (4 events):**

| # | Date | Event | Address | Key Changes | Tx |
|---|---|---|---|---|---|
| 1 | 2025-01-08 | Upgrade | `0x4486...3baF` | Initial deployment | [0x32039fd522bc0cf180f89322febd0cf01e8c43fa8076d582aab097337de1d1a9](https://etherscan.io/tx/0x32039fd522bc0cf180f89322febd0cf01e8c43fa8076d582aab097337de1d1a9) |
| 2 | 2025-01-08 | Admin Changed | `0xeA0a...13cB` | Previous: `0x0000...0000` | [0x32039fd522bc0cf180f89322febd0cf01e8c43fa8076d582aab097337de1d1a9](https://etherscan.io/tx/0x32039fd522bc0cf180f89322febd0cf01e8c43fa8076d582aab097337de1d1a9) |
| 3 | 2025-09-02 | Upgrade | `0x5019...6452` | +13 fn; added `addMinter(address)`; added `burn(uint256)`; added `initialize(string,string,address,uint256[2])`; added `lastSync()`; added `minter_burn_from(address,uint256)`; added `minter_mint(address,uint256)`; added `minters(address)`; added `minters_array(uint256)`; added `removeMinter(address)`; added `setAllPricingParams(uint256,uint256,uint256)`; added `setPricePerShareIncPerSecond(uint256)`; added `setPricePerShareStored(uint256)`; added `sync()`; -4 fn; removed `initialize(string,string,uint256,address)`; removed `initializeRewardsCycleData(uint256,uint256,uint40,uint40,uint216)`; removed `previewSyncRewards()`; removed `syncRewardsAndDistribution()`; 📝 src +5681/-288 | [0xe219db63bdfb61ef970201d2fbaeda5b526bdb6bc9356f4b3255918b3c3a899a](https://etherscan.io/tx/0xe219db63bdfb61ef970201d2fbaeda5b526bdb6bc9356f4b3255918b3c3a899a) |
| 4 | 2026-01-26 | Upgrade | `0xAad4...6700` | +9 fn; added `_initialized()`; added `authorizationState(address,bytes32)`; added `cancelAuthorization(address,bytes32,bytes)`; added `cancelAuthorization(address,bytes32,uint8,bytes32,bytes32)`; added `permit(address,address,uint256,uint256,bytes)`; added `receiveWithAuthorization(address,address,uint256,uint256,uint256,bytes32,bytes)`; added `receiveWithAuthorization(address,address,uint256,uint256,uint256,bytes32,uint8,bytes32,bytes32)`; added `transferWithAuthorization(address,address,uint256,uint256,uint256,bytes32,bytes)`; added `transferWithAuthorization(address,address,uint256,uint256,uint256,bytes32,uint8,bytes32,bytes32)`; -1 fn; removed `initialize(string,string,address,uint256[2])`; 📝 src +1049/-2185 | [0xb0e4af1862737afc53bb4dd4d3ac1e1cbc1f64b48135f48fe581080adf9d76b2](https://etherscan.io/tx/0xb0e4af1862737afc53bb4dd4d3ac1e1cbc1f64b48135f48fe581080adf9d76b2) |

<details>
<summary>📝 Source diff — upgrade #3 (<code>0x4486...3baF</code> → <code>0x5019...6452</code>): +5681/-288 lines (truncated)</summary>

```diff
--- old_impl
+++ new_impl
@@ -9,134 +9,254 @@
 // | /_/   /_/   \__,_/_/|_|  /_/   /_/_/ /_/\__,_/_/ /_/\___/\___/   |
 // |                                                                  |
 // ====================================================================
-// =========================== StakedFrxUSD ===========================
+// ========================== StakedFrxUSD2 ===========================
 // ====================================================================
 // Frax Finance: https://github.com/FraxFinance
+// Tested for 18-decimal underlying assets only
 
 import { Timelock2Step } from "frax-std/access-control/v2/Timelock2Step.sol";
 import { IERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
+import { IfrxUSD } from "src/contracts/interfaces/IfrxUSD.sol";
 import { SafeCastLib } from "solmate/utils/SafeCastLib.sol";
-import { LinearRewardsErc4626, ERC20 } from "./LinearRewardsErc4626.sol";
+import { LinearRewardsQuasiErc4626, ERC20 } from "./LinearRewardsQuasiErc4626.sol";
 
 /// @title Staked frxUSD
-/// @notice A ERC4626 Vault implementation with linear rewards, rewards can be capped
-contract StakedFrxUSD is LinearRewardsErc4626, Timelock2Step {
+/// @notice A ERC4626-like Vault implementation with linear rewards, rewards can be capped
+contract StakedFrxUSD2 is LinearRewardsQuasiErc4626, Timelock2Step {
     using SafeCastLib for *;
 
-    /// @notice The maximum amount of rewards that can be distributed per second per 1e18 asset
-    uint256 public maxDistributionPerSecondPerAsset;
-
-    uint256 private initializeStage=2;
+    /// @notice Used for initialization
+    bool private _initialized;
+
+    /// @notice Array of minters
+    address[] public minters_array;
+
+    /// @notice Mapping of the minters
+    /// @dev Mapping is used for faster verification
+    mapping(address => bool) public minters;
 
     /// @param _underlying The erc20 asset deposited
     /// @param _name The name of the vault
     /// @param _symbol The symbol of the vault
-    /// @param _rewardsCycleLength The length of the rewards cycle in seconds
-    /// @param _maxDistributionPerSecondPerAsset The maximum amount of rewards that can be distributed per second per 1e18 asset
     /// @param _timelockAddress The address of the timelock/owner contract
     constructor(
         IERC20 _underlying,
         string memory _name,
         string memory _symbol,
-        uint32 _rewardsCycleLength,
-        uint256 _maxDistributionPerSecondPerAsset,
         address _timelockAddress
-    )
-        LinearRewardsErc4626(ERC20(address(_underlying)), _name, _symbol, _rewardsCycleLength)
-        Timelock2Step(_timelockAddress)
-    {
-        maxDistributionPerSecondPerAsset = _maxDistributionPerSecondPerAsset;
-    }
-
-    /// @notice The ```SetMaxDistributionPerSecondPerAsset``` event is emitted when the maxDistributionPerSecondPerAsset is set
-    /// @param oldMax The old maxDistributionPerSecondPerAsset value
-    /// @param newMax The new maxDistributionPerSecondPerAsset value
-    event SetMaxDistributionPerSecondPerAsset(uint256 oldMax, uint256 newMax);
+    ) LinearRewardsQuasiErc4626(ERC20(address(_underlying)), _name, _symbol) Timelock2Step(_timelockAddress) {
+        _initialized = true;
+    }
 
     error AlreadyInitialized();
 
-    function initialize(string memory _name,
+    /// @param _name The name of the vault
+    /// @param _symbol The symbol of the vault
+    /// @param _timelockAddress The address of the timelock/owner contract
+    /// @param _ppsInfo [0] Initial PricePerShare [1] PricePerShare increase per sec
+    function initialize(
+        string memory _name,
         string memory _symbol,
-        uint256 _maxDistributionPerSecondPerAsset,
-        address _timelockAddress) external {
-        if (initializeStage!=0) revert AlreadyInitialized();
-        initializeStage++;
+        address _timelockAddress,
+        uint256[2] memory _ppsInfo
+    ) external {
+        if (_initialized) revert AlreadyInitialized();
+        _initialized = true;
         name = _name;
         symbol = _symbol;
-        maxDistributionPerSecondPerAsset = _maxDistributionPerSecondPerAsset;
         timelockAddress = _timelockAddress;
 
-        // initialize rewardsCycleEnd value
-        // NOTE: normally distribution of rewards should be done prior to _syncRewards but in this case we know there are no users or rewards yet.
-        _syncRewards();
-
-        // initialize lastRewardsDistribution value
-        _distributeRewards();
-    }
-    
-    /// @notice The ```initializeRewardsCycleData``` function initializes the rewards cycle data
-    /// @dev This function can only be called once
-    /// @param _pricePerShare The price per share
-    /// @param _maxDistributionPerSecondPerAsset The maximum amount of rewards that can be distributed per second per 1e18 asset
-    /// @param _cycleEnd The end of the rewards cycle
-    /// @param _lastSync The last sync time
-    /// @param _rewardCycleAmount The reward cycle amount
-    function initializeRewardsCycleData(
-        uint256 _pricePerShare,
-        uint256 _maxDistributionPerSecondPerAsset,
-        uint40 _cycleEnd,
-        uint40 _lastSync,
-        uint216 _rewardCycleAmount
+        // Burn all the frxUSD currently in this contract
+        IfrxUSD(address(asset)).burn(asset.balanceOf(address(this)));
+
+        // Set PricePerShare info initially
+        pricePerShareStored = _ppsInfo[0];
+        pricePerShareIncPerSecond = _ppsInfo[1];
+
+        // Set lastSync to now
+        lastSync = block.timestamp;
+    }
+
+    /* ========== MODIFIERS ========== */
+
+    /// @notice A modifier that only allows a minters to call
+    modifier onlyMinters() {
+        if (!minters[msg.sender]) revert OnlyMinters();
+        _;
+    }
+
+    /* ========== UNRESTRICTED FUNCTIONS========== */
+
+    /// @notice Burn tokens. You do NOT receive any underlying assets when doing so
+    /// @param _amount Amount of tokens to burn
+    function burn(uint256 _amount) public {
+        // Do the burn
+        super._burn(msg.sender, _amount);
+
+        emit Burn(msg.sender, _amount);
+    }
+
+    /* ========== RESTRICTED FUNCTIONS [MINTERS] ========== */
+
+    /// @notice Used by minters to burn tokens
+    /// @param b_address Address of the account to burn from
+    /// @param b_amount Amount of tokens to burn
+    function minter_burn_from(address b_address, uint256 b_amount) public onlyMinters {
+        super._burn(b_address, b_amount);
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
+    function addMinter(address minter_address) public {
+        _requireSenderIsTimelock();
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
+    function removeMinter(address minter_address) public {
+        _requireSenderIsTimelock();
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
+    /// @notice Set pricePerShareStored, pricePerShareIncPerSecond, and lastSync in one call
+    /// @param _newPricePerShareStored New stored price per share, in E18 asset tokens
+    /// @param _newPricePerShareIncPerSecond New stored price per share increase per second, in E18 asset tokens
+    /// @param _newLastSync New lastSync
+    /// @dev p(t) = p0*e^(r(t-t0))
+    function setAllPricingParams(
+        uint256 _newPricePerShareStored,
+        uint256 _newPricePerShareIncPerSecond,
+        uint256 _newLastSync
     ) external {
-        if (initializeStage!=1) revert AlreadyInitialized();
-        initializeStage++;
-        storedTotalAssets = _pricePerShare*totalSupply/PRECISION;
-        maxDistributionPerSecondPerAsset = _maxDistributionPerSecondPerAsset;
-        rewardsCycleData.cycleEnd = _cycleEnd;
-        rewardsCycleData.lastSync = _lastSync;  
-        rewardsCycleData.rewardCycleAmount = _rewardCycleAmount;
-    }
-
-
-    /// @notice The ```setMaxDistributionPerSecondPerAsset``` function sets the maxDistributionPerSecondPerAsset
-    /// @dev This function can only be called by the timelock, caps the value to type(uint64).max
-    /// @param _maxDistributionPerSecondPerAsset The maximum amount of rewards that can be distributed per second per 1e18 asset
-    function setMaxDistributionPerSecondPerAsset(uint256 _maxDistributionPerSecondPerAsset) external {
         _requireSenderIsTimelock();
-        syncRewardsAndDistribution();
-
-        // NOTE: prevents bricking the contract via overflow
-        if (_maxDistributionPerSecondPerAsset > type(uint64).max) {
-            _maxDistributionPerSecondPerAsset = type(uint64).max;
-        }
-
-        emit SetMaxDistributionPerSecondPerAsset({
-            oldMax: maxDistributionPerSecondPerAsset,
-            newMax: _maxDistributionPerSecondPerAsset
-        });
-
-        maxDistributionPerSecondPerAsset = _maxDistributionPerSecondPerAsset;
-    }
-
-    /// @notice The ```calculateRewardsToDistribute``` function calculates the amount of rewards to distribute based on the rewards cycle data and the time passed
-    /// @param _rewardsCycleData The rewards cycle data
-    /// @param _deltaTime The time passed since the last rewards distribution
-    /// @return _rewardToDistribute The amount of rewards to distribute
-    function calculateRewardsToDistribute(
-        RewardsCycleData memory _rewardsCycleData,
-        uint256 _deltaTime
-    ) public view override returns (uint256 _rewardToDistribute) {
-        _rewardToDistribute = super.calculateRewardsToDistribute({
-            _rewardsCycleData: _rewardsCycleData,
-            _deltaTime: _deltaTime
-        });
-
-        // Cap rewards
-        uint256 _maxDistribution = (maxDistributionPerSecondPerAsset * _deltaTime * storedTotalAssets) / PRECISION;
-        if (_rewardToDistribute > _maxDistribution) {
-            _rewardToDistribute = _maxDistribution;
-        }
-    }
+
+        // Make sure lastSync is not in the future
+        if (_newLastSync > block.timestamp) revert MustNotBeInTheFuture();
+
+        // Set the 3 parameters
+        pricePerShareStored = _newPricePerShareStored;
+        pricePerShareIncPerSecond = _newPricePerShareIncPerSecond;
+        lastSync = _newLastSync;
+
+        emit SetPricePerShareStored(_newPricePerShareStored);
+        emit SetPricePerShareIncPerSecond(_newPricePerShareIncPerSecond);
+        emit SetLastSync(_newLastSync);
+    }
+
+    /// @notice Set pricePerShare increase rate, per second (pricePerShareIncPerSecond). Also sets lastSync to now and pricePerShareStored to the current pricePerShare
+    /// @param _newPricePerShareIncPerSecond New stored price per share increase per second, in E18 asset tokens
+    function setPricePerShareIncPerSecond(uint256 _newPricePerShareIncPerSecond) external {
+        _requireSenderIsTimelock();
+
+        // Sync first
+        sync();
+
+        // Set pricePerShareIncPerSecond
+        pricePerShareIncPerSecond = _newPricePerShareIncPerSecond;
+
+        emit SetPricePerShareIncPerSecond(_newPricePerShareIncPerSecond);
+    }
+
+    /// @notice Set pricePerShareStored
+    /// @param _newPricePerShareStored New stored price per share, in E18 asset tokens
+    function setPricePerShareStored(uint256 _newPricePerShareStored) external {
+        _requireSenderIsTimelock();
+
+        // Set lastSync to now
+        lastSync = block.timestamp;
+
+        // Set pricePerShareStored
+        pricePerShareStored = _newPricePerShareStored;
+
+        emit SetPricePerShareStored(_newPricePerShareStored);
+    }
+
+    //==============================================================================
+    // Errors
+    //==============================================================================
+
+    /// @notice When lastSync is trying to be set to a future date
+    error MustNotBeInTheFuture();
+
+    /// @notice When a non-minter tries to call a restricted function
+    error OnlyMinters();
+
+    //==============================================================================
+    // Events
+    //==============================================================================
+
+    /// @notice Emitted when a burn happens
+    /// @param from The address whose tokens were burned
+    /// @param amount Amount of tokens burned
+    event Burn(address indexed from, uint256 amount);
+
+    /// @notice Emitted when a mint happens
+    /// @param to Recipient of the newly-minted tokens
+    /// @param amount Amount of tokens minted
+    event Mint(address indexed to, uint256 amount);
+
+    /// @notice Emitted when a non-bridge minter is added
+    /// @param minter_address Address of the new minter
+    event MinterAdded(address minter_address);
+
+    /// @notice Emitted when a non-bridge minter is removed
+    /// @param minter_address Address of the removed minter
+    event MinterRemoved(address minter_address);
+
+    /// @notice When setLastSync is called
+    /// @param newLastSync New lastSync
+    event SetLastSync(uint256 newLastSync);
+
+    /// @notice When setPricePerShareIncPerSecond is called
+    /// @param newPricePerShareIncPerSecond New stored price per share increase per second, in E18 asset tokens
+    event SetPricePerShareIncPerSecond(uint256 newPricePerShareIncPerSecond);
+
+    /// @notice When setPricePerShareStored is called
+    /// @param newPricePerShareStored New stored price per share, in E18 asset tokens
+    event SetPricePerShareStored(uint256 newPricePerShareStored);
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
 }
 
 
@@ -617,6 +737,85 @@
 }
 
 
+// SPDX-License-Identifier: MIT
+pragma solidity >=0.8.0;
+
+interface IfrxUSD {
+    function DOMAIN_SEPARATOR() external view returns (bytes32);
+
+    function acceptOwnership() external;
+
+    function addMinter(address minter_address) external;
+
+    function allowance(address owner, address spender) external view returns (uint256);
+
+    function approve(address spender, uint256 value) external returns (bool);
+
+    function balanceOf(address account) external view returns (uint256);
+
+    function burn(uint256 value) external;
+
+    function burnFrom(address account, uint256 value) external;
+
+    function decimals() external view returns (uint8);
+
+    function eip712Domain()
+        external
+        view
+        returns (
+            bytes1 fields,
+            string memory name,
+            string memory version,
+            uint256 chainId,
+            address verifyingContract,
+            bytes32 salt,
+            uint256[] memory extensions
+        );
+
+    function initialize(address _owner, string memory _name, string memory _symbol) external;
+
+    function minter_burn_from(address b_address, uint256 b_amount) external;
+
+    function minter_mint(address m_address, uint256 m_amount) external;
+
+    function minters(address) external view returns (bool);
+
+    function minters_array(uint256) external view returns (address);
+
+    function name() external view returns (string memory);
+
+    function nonces(address owner) external view returns (uint256);
+
+    function owner() external view returns (address);
+
+    function pendingOwner() external view returns (address);
+
+    function permit(
+        address owner,
+        address spender,
+        uint256 value,
+        uint256 deadline,
+        uint8 v,
+        bytes32 r,
+        bytes32 s
+    ) external;
+
+    function removeMinter(address minter_address) external;
+
+    function renounceOwnership() external;
+
+    function symbol() external view returns (string memory);
+
+    function totalSupply() external view returns (uint256);
+
+    function transfer(address to, uint256 value) external returns (bool);
+
+    function transferFrom(address from, address to, uint256 value) external returns (bool);
+
+    function transferOwnership(address newOwner) external;
+}
+
+
 // SPDX-License-Identifier: AGPL-3.0-only
 pragma solidity >=0.8.0;
 
@@ -823,23 +1022,33 @@
 // | /_/   /_/   \__,_/_/|_|  /_/   /_/_/ /_/\__,_/_/ /_/\___/\___/   |
 // |                                                                  |
 // ====================================================================
-// ======================== LinearRewardsErc4626 ======================
+// ===================== LinearRewardsQuasiErc4626 ====================
 // ====================================================================
 // Frax Finance: https://github.com/FraxFinance
 
 import { ERC20, ERC4626 } from "solmate/mixins/ERC4626.sol";
 import { SafeCastLib } from "solmate/utils/SafeCastLib.sol";
+import { ln, mul, div, pow, exp, wrap } from "@prb/math/src/ud60x18/Math.sol";
+import { convert } from "@prb/math/src/ud60x18/Conversions.sol";
+import { UD60x18 } from "@prb/math/src/ud60x18/ValueType.sol";
+import "forge-std/console2.sol";
 
 /// @title LinearRewardsErc4626
 /// @notice An ERC4626 Vault implementation with linear rewards
-abstract contract LinearRewardsErc4626 is ERC4626 {
+abstract contract LinearRewardsQuasiErc4626 is ERC4626 {
     using SafeCastLib for *;
 
     /// @notice The precision of all integer calculations
     uint256 public constant PRECISION = 1e18;
 
+    /// @notice One year, in seconds
+    uint256 public constant ONE_YEAR = 31_536_000;
+
     /// @notice The rewards cycle length in seconds
-    uint256 public immutable REWARDS_CYCLE_LENGTH;
+    uint256 public immutable REWARDS_CYCLE_LENGTH = 604_800; // 7 days
+
+    /// @notice Precomputed year
+    UD60x18 public immutable ONE_YEAR_UD60X18;
 
     /// @notice Information about the current rewards cycle
     struct RewardsCycleData {
@@ -849,205 +1058,266 @@
     }
 
     /// @notice The rewards cycle data, stored in a single word to save gas
-    RewardsCycleData public rewardsCycleData;
+    RewardsCycleData public DEPRECATED__rewardsCycleData;
 
     /// @notice The timestamp of the last time rewards were distributed
-    uint256 public lastRewardsDistribution;
+    uint256 public DEPRECATED__lastRewardsDistribution;
 
     /// @notice The total amount of assets that have been distributed and deposited
-    uint256 public storedTotalAssets;
+    uint256 public DEPRECATED__storedTotalAssets;
 
     /// @notice The precision of the underlying asset
     uint256 public immutable UNDERLYING_PRECISION;
+
+    // ---------------------------------------------
+    // DEPRECATED STORAGE SLOTS (for storage order preservation)
+    // ---------------------------------------------
+    /// @notice The pending timelock address
+    address public DEPRECATED__pendingTimelockAddress;
+
+    /// @notice The current timelock address
+    address public DEPRECATED__timelockAddress;
+
+    /// @notice The maximum amount of rewards that can be distributed per second per 1e18 asset
+    uint256 public DEPRECATED__maxDistributionPerSecondPerAsset;
+
+    uint256 private DEPRECATED__initializeStage;
+
+    // ---------------------------------------------
+    // NEW STATE VARIABLES
+    // ---------------------------------------------
+
+    /// @notice Last stored pricePerShare. Current rate is stored + (rate * pricePerShareIncPerSecond)
+    uint256 public pricePerShareStored;
+
+    /// @notice Manually set increase in pricePerShare, per second
+    uint256 public pricePerShareIncPerSecond;
+
+    /// @notice The last time the contract was synced
+    uint256 public lastSync;
+
+    // ---------------------------------------------
+    // CONSTRUCTOR
+    // ---------------------------------------------
 
     /// @param _underlying The erc20 asset deposited
     /// @param _name The name of the vault
     /// @param _symbol The symbol of the vault
-    /// @param _rewardsCycleLength The length of the rewards cycle in seconds
-    constructor(
-        ERC20 _underlying,
-        string memory _name,
-        string memory _symbol,
-        uint256 _rewardsCycleLength
-    ) ERC4626(_underlying, _name, _symbol) {
-        REWARDS_CYCLE_LENGTH = _rewardsCycleLength;
+    constructor(ERC20 _underlying, string memory _name, string memory _symbol) ERC4626(_underlying, _name, _symbol) {
+        if (_underlying.decimals() != 18) revert UnderlyingAssetMustBe18Decimals();
         UNDERLYING_PRECISION = 10 ** _underlying.decimals();
-
-        // initialize rewardsCycleEnd value
-        // NOTE: normally distribution of rewards should be done prior to _syncRewards but in this case we know there are no users or rewards yet.
-        _syncRewards();
-
-        // initialize lastRewardsDistribution value
-        _distributeRewards();
-    }
-
+        ONE_YEAR_UD60X18 = convert(ONE_YEAR);
+    }
+
+    // ---------------------------------------------
+    // VIEW FUNCTIONS
+    // ---------------------------------------------
+
+    /// @notice Calculate pricePerShare increase per second needed for a given APY.
+    /// @param _apyE18 APY in 1.%%E18 (e.g. 5% APY = input 1.05e18). Must be >= 1e18
+    /// @return _newPPSIPS The needed pricePerShare increase, per second, in UNDERLYING_PRECISION
+    function calcPPSIPSForGivenAPY(uint256 _apyE18) public view returns (uint256 _newPPSIPS) {
+        if (_apyE18 < 1e18) revert InvalidAPY();
+        // Old
+        // UD60x18 _numerator = mul(ln(convert(_apyE18)), convert(1e18)) - mul(ln(convert(1e18)), convert(1e18));
+        // UD60x18 _denominator = convert(ONE_YEAR);
+        // _newPPSIPS = convert(div(_numerator, _denominator));
+        // New
+        UD60x18 _numerator = ln(wrap(_apyE18));
+        UD60x18 _denominator = ONE_YEAR_UD60X18;
+        _newPPSIPS = (div(_numerator, _denominator)).unwrap();
+    }
+
+    /// @notice Calculate the total assets as of a given time.
+    /// @param _asOfTime The time at which to calculate. Must be now or in the future.
+    /// @return _newTotalAssets Expected total assets at _asOfTime, in UNDERLYING_PRECISION
+    function _previewTotalAssets(uint256 _asOfTime) internal view returns (uint256 _newTotalAssets) {
+        _newTotalAssets = (_previewPricePerShare(_asOfTime) * totalSupply) / 1e18;
+    }
+
+    /// @notice Calculate current totalAssets as of now, accounting for elapsed time
+    /// @return _newTotalAssets Total assets as of right now, in UNDERLYING_PRECISION
+    function previewTotalAssets() public view returns (uint256 _newTotalAssets) {
+        // Do the calculation
+        return _previewTotalAssets(block.timestamp);
+    }
+
+    /// @notice Calculate current totalAssets as of now, accounting for elapsed time
+    /// @return _newTotalAssets Total assets as of right now, in UNDERLYING_PRECISION
+    function storedTotalAssets() public view returns (uint256 _newTotalAssets) {
+        return previewTotalAssets();
+    }
+
+    /// @notice Calculate totalAssets at a future time
+    /// @param _futureTime The future time at which to calculate
+    /// @return _newTotalAssets Expected total assets at _futureTime, in UNDERLYING_PRECISION
+    function previewTotalAssetsFuture(uint256 _futureTime) public view returns (uint256 _newTotalAssets) {
+        // Do the calculation
+        return _previewTotalAssets(_futureTime);
+    }
+
+    /// @notice Calculate current pricePerShare as of the given time, accounting for any elapsed time since the last sync.
+    /// @param _asOfTime The time at which to calculate. Must be now or in the future
+    /// @return _newPricePerShare Expected pricePerShare at _asOfTime, in UNDERLYING_PRECISION
+    function _previewPricePerShare(uint256 _asOfTime) internal view returns (uint256 _newPricePerShare) {
+        // CHECK THIS MATH!!!
+        // CHECK THIS MATH!!!
+        // CHECK THIS MATH!!!
+        // CHECK THIS MATH!!!
+        // CHECK THIS MATH!!!
+        // CHECK THIS MATH!!!
+
+        // Calculate the elapsed time
+        uint256 _elapsedTime = _asOfTime - lastSync;
+
+        // Continuously compounding interest. Done here instead of in _previewTotalAssets
+        // p(t) = p₀ * e^((dr)*t)
+        // Also might be able to use e^(xy) = (e^x)^y (to avoid overflows)
+        // ---------------------------------------
+        // Calculate e^x and convert back to uint256
+
+        // Get the UD60x18 exponent first and scale down by UNDERLYING_PRECISION
+        // OLD: UD60x18 _exponentUD60_18 = div(
+        //     convert(pricePerShareIncPerSecond * _elapsedTime),
+        //     convert(UNDERLYING_PRECISION)
+        // );
+        // Get the UD60x18 exponent first and scale down by UNDERLYING_PRECISION
+        UD60x18 _exponentUD60_18 = wrap(pricePerShareIncPerSecond * _elapsedTime);
+        // UD60x18 _exponentUD60_18 = div(
+        //     convert(pricePerShareIncPerSecond * _elapsedTime),
+        //     convert(UNDERLYING_PRECISION)
+        // );
+
+        // console2.log("=============");
+        // console2.log("pricePerShareIncPerSecond: ", pricePerShareIncPerSecond);
+        // console2.log("_elapsedTime: ", _elapsedTime);
+        // console2.log("convert(_exponentUD60_18): ", convert(_exponentUD60_18));
+        // console2.log(
+        //     "convert(_exponentUD60_18 * UNDERLYING_PRECISION): ",
+        //     convert(mul(_exponentUD60_18, convert(UNDERLYING_PRECISION)))
+        // );
+
+        // Get the raw e^exponent in UD60x18
+        UD60x18 _ePowUD60_18 = exp(_exponentUD60_18);
+
+        // Old
+        // {
+        //     // Scale the UD60x18 up by UNDERLYING_PRECISION and convert to uint256
+        //     uint256 _ePowU256 = convert(mul(_ePowUD60_18, convert(UNDERLYING_PRECISION)));
+
+        //     // console2.log(
+        //     //     "convert(_ePowUD60_18 * UNDERLYING_PRECISION): ",
+        //     //     convert(mul(_ePowUD60_18, convert(UNDERLYING_PRECISION)))
+        //     // );
+        //     // console2.log("_ePowU256: ", _ePowU256);
+
+        //     // Calculate _newPricePerShare
+        //     _newPricePerShare = (pricePerShareStored * _ePowU256) / UNDERLYING_PRECISION;
+        //     // console2.log("_newPricePerShare: ", _newPricePerShare);
+        // }
+
+        // New
+        {
+            _newPricePerShare = mul(wrap(pricePerShareStored), _ePowUD60_18).unwrap();
+        }
+    }
+
+    /// @notice Calculate current pricePerShare as of now, accounting for any elapsed time since the last sync. Same as pricePerShare().
+    /// @return _newPricePerShare Current pricePerShare, in UNDERLYING_PRECISION
+    function previewPricePerShare() public view returns (uint256 _newPricePerShare) {
+        // Do the calculation
+        return _previewPricePerShare(block.timestamp);
+    }
+
+    /// @notice Calculate pricePerShare at a future time
+    /// @param _futureTime The future time at which to calculate
+    /// @return _newPricePerShare Expected pricePerShare at _asOfTime, in UNDERLYING_PRECISION
+    function previewPricePerShareFuture(uint256 _futureTime) public view returns (uint256 _newPricePerShare) {
+        // Do the calculation
+        return _previewPricePerShare(_futureTime);
+    }
+
+    /// @notice Calculate pricePerShare and totalAssets at a given time
+    /// @param _asOfTime The time at which to calculate. Must be now or in the future.
+    /// @return _pricePerShare Expected pricePerShare at _asOfTime, in UNDERLYING_PRECISION
+    /// @return _totalAssets Expected totalAssets at _asOfTime, in UNDERLYING_PRECISION
+    function _previewPPSAndTotalAssets(
+        uint256 _asOfTime
+    ) internal view returns (uint256 _pricePerShare, uint256 _totalAssets) {
+        _pricePerShare = _previewPricePerShare(_asOfTime);
+        _totalAssets = _previewTotalAssets(_asOfTime);
+    }
+
+    /// @notice Calculate pricePerShare and totalAssets as of right now
+    /// @return _pricePerShare Current pricePerShare, in UNDERLYING_PRECISION
+    /// @return _totalAssets Current totalAssets, in UNDERLYING_PRECISION
+    function previewPPSAndTotalAssets() public view returns (uint256 _pricePerShare, uint256 _totalAssets) {
+        return _previewPPSAndTotalAssets(block.timestamp);
+    }
+
+    /// @notice The current price per share token, in asset tokens. Same as previewPricePerShare().
+    /// @return _pricePerShare Current pricePerShare, in UNDERLYING_PRECISION
     function pricePerShare() external view returns (uint256 _pricePerShare) {
-        _pricePerShare = convertToAssets(UNDERLYING_PRECISION);
-    }
-
-    /// @notice The ```calculateRewardsToDistribute``` function calculates the amount of rewards to distribute based on the rewards cycle data and the time elapsed
-    /// @param _rewardsCycleData The rewards cycle data
-    /// @param _deltaTime The time elapsed since the last rewards distribution
-    /// @return _rewardToDistribute The amount of rewards to distribute
-    function calculateRewardsToDistribute(
-        RewardsCycleData memory _rewardsCycleData,
-        uint256 _deltaTime
-    ) public view virtual returns (uint256 _rewardToDistribute) {
-        _rewardToDistribute =
-            (_rewardsCycleData.rewardCycleAmount * _deltaTime) /
-            (_rewardsCycleData.cycleEnd - _rewardsCycleData.lastSync);
-    }
-
-    /// @notice The ```previewDistributeRewards``` function is used to preview the rewards distributed at the top of the block
-    /// @return _rewardToDistribute The amount of underlying to distribute
-    function previewDistributeRewards() public view virtual returns (uint256 _rewardToDistribute) {
-        // Cache state for gas savings
-        RewardsCycleData memory _rewardsCycleData = rewardsCycleData;
-        uint256 _lastRewardsDistribution = lastRewardsDistribution;
-        uint40 _timestamp = block.timestamp.safeCastTo40();
-
-        // Calculate the delta time, but only include up to the cycle end in case we are passed it
-        uint256 _deltaTime = _timestamp > _rewardsCycleData.cycleEnd
-            ? _rewardsCycleData.cycleEnd - _lastRewardsDistribution
-            : _timestamp - _lastRewardsDistribution;
-
-        // Calculate the rewards to distribute
-        _rewardToDistribute = calculateRewardsToDistribute({
-            _rewardsCycleData: _rewardsCycleData,
-            _deltaTime: _deltaTime
-        });
-    }
-
-    /// @notice The ```distributeRewards``` function distributes the rewards once per block
-    /// @return _rewardToDistribute The amount of underlying to distribute
-    function _distributeRewards() internal virtual returns (uint256 _rewardToDistribute) {
-        _rewardToDistribute = previewDistributeRewards();
-
-        // Only write to state/emit if we actually distribute rewards
-        if (_rewardToDistribute != 0) {
-            storedTotalAssets += _rewardToDistribute;
-            emit DistributeRewards({ rewardsToDistribute: _rewardToDistribute });
-        }
-
-        lastRewardsDistribution = block.timestamp;
-    }
-
-    /// @notice The ```previewSyncRewards``` function returns the updated rewards cycle data without updating the state
-    /// @return _newRewardsCycleData The updated rewards cycle data
-    function previewSyncRewards() public view virtual returns (RewardsCycleData memory _newRewardsCycleData) {
-        RewardsCycleData memory _rewardsCycleData = rewardsCycleData;
-
-        uint256 _timestamp = block.timestamp;
-
-        // Only sync if the previous cycle has ended
-        if (_timestamp <= _rewardsCycleData.cycleEnd) return _rewardsCycleData;
-
-        // Calculate rewards for next cycle
-        uint256 _newRewards = asset.balanceOf(address(this)) - storedTotalAssets;
-
-        // Calculate the next cycle end, this keeps cycles at the same time regardless of when sync is called
-        uint40 _cycleEnd = (((_timestamp + REWARDS_CYCLE_LENGTH) / REWARDS_CYCLE_LENGTH) * REWARDS_CYCLE_LENGTH)
-            .safeCastTo40();
-
-        // This block prevents big jumps in rewards rate in case the sync happens near the end of the cycle
-        if (_cycleEnd - _timestamp < REWARDS_CYCLE_LENGTH / 40) {
-            _cycleEnd += REWARDS_CYCLE_LENGTH.safeCastTo40();
-        }
-
-        // Write return values
-        _rewardsCycleData.rewardCycleAmount = _newRewards.safeCastTo216();
-        _rewardsCycleData.lastSync = _timestamp.safeCastTo40();
-        _rewardsCycleData.cycleEnd = _cycleEnd;
-
-        return _rewardsCycleData;
-    }
-
-    /// @notice The ```_syncRewards``` function is used to update the rewards cycle data
-    function _syncRewards() internal virtual {
-        RewardsCycleData memory _rewardsCycleData = previewSyncRewards();
-
-        if (
-            block
-                .timestamp
-                // If true, then preview shows a rewards should be processed
-                .safeCastTo40() ==
-            _rewardsCycleData.lastSync &&
-            // Ensures that we don't write to state twice in the same block
-            rewardsCycleData.lastSync != _rewardsCycleData.lastSync
-        ) {
-            rewardsCycleData = _rewardsCycleData;
-            emit SyncRewards({
-                cycleEnd: _rewardsCycleData.cycleEnd,
-                lastSync: _rewardsCycleData.lastSync,
-                rewardCycleAmount: _rewardsCycleData.rewardCycleAmount
-            });
-        }
-    }
-
-    /// @notice The ```syncRewardsAndDistribution``` function is used to update the rewards cycle data and distribute rewards
-    /// @dev rewards must be distributed before the cycle is synced
-    function syncRewardsAndDistribution() public virtual {
-        _distributeRewards();
-        _syncRewards();
-    }
-
-    /// @notice The ```totalAssets``` function returns the total assets available in the vault
+        return previewPricePerShare();
+    }
+
+    /// @notice The current totalAssets, accounting for any elapsed time since the last sync
     /// @dev This function simulates the rewards that will be distributed at the top of the block
     /// @return _totalAssets The total assets available in the vault
     function totalAssets() public view virtual override returns (uint256 _totalAssets) {
-        uint256 _rewardToDistribute = previewDistributeRewards();
-        _totalAssets = storedTotalAssets + _rewardToDistribute;
-    }
-
-    function afterDeposit(uint256 amount, uint256 shares) internal virtual override {
-        storedTotalAssets += amount;
-    }
-
-    /// @notice The ```deposit``` function allows a user to mint shares by depositing underlying
+        _totalAssets = _previewTotalAssets(block.timestamp);
+    }
+
+    // ---------------------------------------------
+    // WRITE FUNCTIONS
+    // ---------------------------------------------
+
+    /// @notice Update pricePerShareStored and storedTotalAssets
+    /// @return _pricePerShare Current pricePerShare, in UNDERLYING_PRECISION
+    function sync() public returns (uint256 _pricePerShare) {
+        // Calculate the current values
+        _pricePerShare = _previewPricePerShare(block.timestamp);
+
+        // Update the state variables
+        pricePerShareStored = _pricePerShare;
+        lastSync = block.timestamp;
+    }
+
+    /// @notice DEPRECATED: The ```deposit``` function allows a user to mint shares by depositing underlying
     /// @param _assets The amount of underlying to deposit
     /// @param _receiver The address to send the shares to
     /// @return _shares The amount of shares minted
     function deposit(uint256 _assets, address _receiver) public override returns (uint256 _shares) {
-        syncRewardsAndDistribution();
-        _shares = super.deposit({ assets: _assets, receiver: _receiver });
-    }
-
-    /// @notice The ```mint``` function allows a user to mint a given number of shares
+        revert MintRedeemsDisabled();
+    }
+
+    /// @notice DEPRECATED: The ```mint``` function allows a user to mint a given number of shares
     /// @param _shares The amount of shares to mint
     /// @param _receiver The address to send the shares to
     /// @return _assets The amount of underlying deposited
     function mint(uint256 _shares, address _receiver) public override returns (uint256 _assets) {
-        syncRewardsAndDistribution();
-        _assets = super.mint({ shares: _shares, receiver: _receiver });
-    }
-
-    function beforeWithdraw(uint256 amount, uint256 shares) internal virtual override {
-        storedTotalAssets -= amount;
-    }
-
-    /// @notice The ```withdraw``` function allows a user to withdraw a given amount of underlying
+        revert MintRedeemsDisabled();
+    }
+
+    /// @notice DEPRECATED: The ```withdraw``` function allows a user to withdraw a given amount of underlying
     /// @param _assets The amount of underlying to withdraw
     /// @param _receiver The address to send the underlying to
     /// @param _owner The address of the owner of the shares
     /// @return _shares The amount of shares burned
     function withdraw(uint256 _assets, address _receiver, address _owner) public override returns (uint256 _shares) {
-        syncRewardsAndDistribution();
-
-        _shares = super.withdraw({ assets: _assets, receiver: _receiver, owner: _owner });
-    }
-
-    /// @notice The ```redeem``` function allows a user to redeem their shares for underlying
+        revert MintRedeemsDisabled();
+    }
+
+    /// @notice DEPRECATED: The ```redeem``` function allows a user to redeem their shares for underlying
     /// @param _shares The amount of shares to redeem
     /// @param _receiver The address to send the underlying to
     /// @param _owner The address of the owner of the shares
     /// @return _assets The amount of underlying redeemed
     function redeem(uint256 _shares, address _receiver, address _owner) public override returns (uint256 _assets) {
-        syncRewardsAndDistribution();
-
-        _assets = super.redeem({ shares: _shares, receiver: _receiver, owner: _owner });
-    }
-
-    /// @notice The ```depositWithSignature``` function allows a user to use signed approvals to deposit
+        revert MintRedeemsDisabled();
+    }
+
+    /// @notice DEPRECATED: The ```depositWithSignature``` function allows a user to use signed approvals to deposit
     /// @param _assets The amount of underlying to deposit
     /// @param _receiver The address to send the shares to
     /// @param _deadline The deadline for the signature
@@ -1065,32 +1335,98 @@
         bytes32 _r,
         bytes32 _s
     ) external returns (uint256 _shares) {
-        uint256 _amount = _approveMax ? type(uint256).max : _assets;
-        asset.permit({
-            owner: msg.sender,
-            spender: address(this),
-            value: _amount,
-            deadline: _deadline,
-            v: _v,
-            r: _r,
-            s: _s
-        });
-        _shares = (deposit({ _assets: _assets, _receiver: _receiver }));
-    }
+        revert MintRedeemsDisabled();
+    }
+
+    /*//////////////////////////////////////////////////////////////
+    //////          ERC4626 ACCOUNTING LOGIC OVERRIDES
+    //////////////////////////////////////////////////////////////*/
+
+    /// @notice DEPRECATED: Will always return 0.
+    function previewDeposit(uint256 assets) public view override returns (uint256) {
+        return 0;
+    }
+
+    /// @notice DEPRECATED: Will always return 0.
+    function previewMint(uint256 shares) public view override returns (uint256) {
+        return 0;
+    }
+
+    /// @notice DEPRECATED: Will always return 0.
+    function previewWithdraw(uint256 assets) public view override returns (uint256) {
+        return 0;
+    }
+
+    /// @notice DEPRECATED: Will always return 0.
+    function previewRedeem(uint256 shares) public view override returns (uint256) {
+        return 0;
+    }
+
+    /*//////////////////////////////////////////////////////////////
+    //////    ERC4626 DEPOSIT/WITHDRAWAL LIMIT LOGIC OVERRIDES
+    //////////////////////////////////////////////////////////////*/
+
+    /// @notice DEPRECATED: Will always return 0.
+    function maxDeposit(address) public view override returns (uint256) {
+        return 0;
+    }
+
+    /// @notice DEPRECATED: Will always return 0.
+    function maxMint(address) public view override returns (uint256) {
+        return 0;
+    }
+
+    /// @notice DEPRECATED: Will always return 0.
+    function maxWithdraw(address owner) public view override returns (uint256) {
+        return 0;
+    }
+
+    /// @notice DEPRECATED: Will always return 0.
+    function maxRedeem(address owner) public view override returns (uint256) {
+        return 0;
+    }
+
+    /*//////////////////////////////////////////////////////////////
+    //////    Backward compatible yield view functions to match old interface
+    //////////////////////////////////////////////////////////////*/
+
+    /// @notice DEPRECATED: use pricePerShareIncPerSecond instead
+    function maxDistributionPerSecondPerAsset() external view returns (uint256) {
+        // Return the maximum distribution per second per asset
+        return pricePerShareIncPerSecond;
+    }
+
+    /// @notice DEPRECATED: use pricePerShareIncPerSecond instead
+    function rewardsCycleData() external view returns (RewardsCycleData memory) {
+        // Return the rewards cycle data as the max possible rate, rate is curbed by maxDistributionPerSecondPerAsset
+        return
+            RewardsCycleData({
+                cycleEnd: uint40(block.timestamp + REWARDS_CYCLE_LENGTH),
+                lastSync: uint40(block.timestamp),
+                rewardCycleAmount: uint216(type(uint216).max / 1e18) // max value
+            });
+    }
+
+    function lastRewardsDistribution() external view returns (uint256) {
+        return block.timestamp;
+    }
+
+    //==============================================================================
+    // Errors
+    //==============================================================================
+
+    /// @notice If the asset is not 18 decimals
+    error UnderlyingAssetMustBe18Decimals();
+
+    /// @notice When the provided APY is invalid
+    error InvalidAPY();
+
+    /// @notice When a user attempts to Mint/Redeem
+    error MintRedeemsDisabled();
 
     //==============================================================================
     // Events
     //==============================================================================
-
-    /// @notice The ```SyncRewards``` event is emitted when the rewards cycle is synced
-    /// @param cycleEnd The timestamp of the end of the current rewards cycle
-    /// @param lastSync The timestamp of the last time the rewards cycle was synced
-    /// @param rewardCycleAmount The amount of rewards to be distributed in the current cycle
-    event SyncRewards(uint40 cycleEnd, uint40 lastSync, uint216 rewardCycleAmount);
-
-    /// @notice The ```DistributeRewards``` event is emitted when rewards are distributed to storedTotalAssets
-    /// @param rewardsToDistribute The amount of rewards that were distributed
-    event DistributeRewards(uint256 rewardsToDistribute);
 }
 
 
@@ -1580,6 +1916,2273 @@
     function afterDeposit(uint256 assets, uint256 shares) internal virtual {}
 }
 
+
+// SPDX-License-Identifier: MIT
+pragma solidity >=0.8.19;
+
+import "../Common.sol" as Common;
+import "./Errors.sol" as Errors;
+import { wrap } from "./Casting.sol";
+import {
+    uEXP_MAX_INPUT,
+    uEXP2_MAX_INPUT,
+    uHALF_UNIT,
+    uLOG2_10,
+    uLOG2_E,
+    uMAX_UD60x18,
+    uMAX_WHOLE_UD60x18,
+    UNIT,
+    uUNIT,
+    uUNIT_SQUARED,
+    ZERO
+} from "./Constants.sol";
+import { UD60x18 } from "./ValueType.sol";
+
+/*//////////////////////////////////////////////////////////////////////////
+                            MATHEMATICAL FUNCTIONS
+//////////////////////////////////////////////////////////////////////////*/
+
+/// @notice Calculates the arithmetic average of x and y using the following formula:
+///
+/// $$
+/// avg(x, y) = (x & y) + ((xUint ^ yUint) / 2)
+/// $$
+///
+/// In English, this is what this formula does:
+///
+/// 1. AND x and y.
+/// 2. Calculate half of XOR x and y.
+/// 3. Add the two results together.
+///
+/// This technique is known as SWAR, which stands for "SIMD within a register". You can read more about it here:
+/// https://devblogs.microsoft.com/oldnewthing/20220207-00/?p=106223
+///
+/// @dev Notes:
+/// - The result is rounded toward zero.
+///
+/// @param x The first operand as a UD60x18 number.
+/// @param y The second operand as a UD60x18 number.
+/// @return result The arithmetic average as a UD60x18 number.
+/// @custom:smtchecker abstract-function-nondet
+function avg(UD60x18 x, UD60x18 y) pure returns (UD60x18 result) {
+    uint256 xUint = x.unwrap();
+    uint256 yUint = y.unwrap();
+    unchecked {
+        result = wrap((xUint & yUint) + ((xUint ^ yUint) >> 1));
+    }
+}
+
+/// @notice Yields the smallest whole number greater than or equal to x.
+///
+/// @dev This is optimized for fractional value inputs, because for every whole value there are (1e18 - 1) fractional
+/// counterparts. See https://en.wikipedia.org/wiki/Floor_and_ceiling_functions.
+///
+/// Requirements:
+/// - x ≤ MAX_WHOLE_UD60x18
+///
+/// @param x The UD60x18 number to ceil.
+/// @return result The smallest whole number greater than or equal to x, as a UD60x18 number.
+/// @custom:smtchecker abstract-function-nondet
+function ceil(UD60x18 x) pure returns (UD60x18 result) {
+    uint256 xUint = x.unwrap();
+    if (xUint > uMAX_WHOLE_UD60x18) {
+        revert Errors.PRBMath_UD60x18_Ceil_Overflow(x);
+    }
+
+    assembly ("memory-safe") {
+        // Equivalent to `x % UNIT`.
+        let remainder := mod(x, uUNIT)
+
+        // Equivalent to `UNIT - remainder`.
+        let delta := sub(uUNIT, remainder)
+
+        // Equivalent to `x + remainder > 0 ? delta : 0`.
+        result := add(x, mul(delta, gt(remainder, 0)))
+    }
+}
+
+/// @notice Divides two UD60x18 numbers, returning a new UD60x18 number.
+///
+/// @dev Uses {Common.mulDiv} to enable overflow-safe multiplication and division.
+///
+/// Notes:
+/// - Refer to the notes in {Common.mulDiv}.
+///
+/// Requirements:
+/// - Refer to the requirements in {Common.mulDiv}.
+///
+/// @param x The numerator as a UD60x18 number.
+/// @param y The denominator as a UD60x18 number.
+/// @return result The quotient as a UD60x18 number.
+/// @custom:smtchecker abstract-function-nondet
+function div(UD60x18 x, UD60x18 y) pure returns (UD60x18 result) {
+    result = wrap(Common.mulDiv(x.unwrap(), uUNIT, y.unwrap()));
+}
+
+/// @notice Calculates the natural exponent of x using the following formula:
+///
+/// $$
+/// e^x = 2^{x * log_2{e}}
+/// $$
+///
+/// @dev Requirements:
+/// - x ≤ 133_084258667509499440
+///
+/// @param x The exponent as a UD60x18 number.
+/// @return result The result as a UD60x18 number.
+/// @custom:smtchecker abstract-function-nondet
+function exp(UD60x18 x) pure returns (UD60x18 result) {
+    uint256 xUint = x.unwrap();
+
+    // This check prevents values greater than 192e18 from being passed to {exp2}.
+    if (xUint > uEXP_MAX_INPUT) {
+        revert Errors.PRBMath_UD60x18_Exp_InputTooBig(x);
+    }
+
+    unchecked {
+        // Inline the fixed-point multiplication to save gas.
+        uint256 doubleUnitProduct = xUint * uLOG2_E;
+        result = exp2(wrap(doubleUnitProduct / uUNIT));
+    }
+}
+
+/// @notice Calculates the binary exponent of x using the binary fraction method.
+///
+/// @dev See https://ethereum.stackexchange.com/q/79903/24693
+///
+/// Requirements:
+/// - x < 192e18
+/// - The result must fit in UD60x18.
+///
+/// @param x The exponent as a UD60x18 number.
+/// @return result The result as a UD60x18 number.
+/// @custom:smtchecker abstract-function-nondet
+function exp2(UD60x18 x) pure returns (UD60x18 result) {
+    uint256 xUint = x.unwrap();
+
+    // Numbers greater than or equal to 192e18 don't fit in the 192.64-bit format.
+    if (xUint > uEXP2_MAX_INPUT) {
+        revert Errors.PRBMath_UD60x18_Exp2_InputTooBig(x);
+    }
+
+    // Convert x to the 192.64-bit fixed-point format.
+    uint256 x_192x64 = (xUint << 64) / uUNIT;
+
+
[truncated — full diff is 246,998 bytes]
```

</details>

<details>
<summary>📝 Source diff — upgrade #4 (<code>0x5019...6452</code> → <code>0xAad4...6700</code>): +1049/-2185 lines (truncated)</summary>

```diff
--- old_impl
+++ new_impl
@@ -1,3 +1,404 @@
+// SPDX-License-Identifier: AGPL-3.0-only
+pragma solidity ^0.8.21;
+
+// ====================================================================
+// |     ______                   _______                             |
+// |    / _____________ __  __   / ____(_____  ____ _____  ________   |
+// |   / /_  / ___/ __ `| |/_/  / /_  / / __ \/ __ `/ __ \/ ___/ _ \  |
+// |  / __/ / /  / /_/ _>  <   / __/ / / / / / /_/ / / / / /__/  __/  |
+// | /_/   /_/   \__,_/_/|_|  /_/   /_/_/ /_/\__,_/_/ /_/\___/\___/   |
+// |                                                                  |
+// ====================================================================
+// ========================== StakedFrxUSD ============================
+// ====================================================================
+// Frax Finance: https://github.com/FraxFinance
+// Tested for 18-decimal underlying assets only
+
+import { SfrxUSD3 } from "src/contracts/ethereum/sfrxUSD/versioning/SfrxUSD3.sol";
+
+contract SfrxUSD is SfrxUSD3 {
+    constructor(address _underlying) SfrxUSD3(_underlying) {}
+}
+
+
+pragma solidity ^0.8.21;
+
+// ====================================================================
+// |     ______                   _______                             |
+// |    / _____________ __  __   / ____(_____  ____ _____  ________   |
+// |   / /_  / ___/ __ `| |/_/  / /_  / / __ \/ __ `/ __ \/ ___/ _ \  |
+// |  / __/ / /  / /_/ _>  <   / __/ / / / / / /_/ / / / / /__/  __/  |
+// | /_/   /_/   \__,_/_/|_|  /_/   /_/_/ /_/\__,_/_/ /_/\___/\___/   |
+// |                                                                  |
+// ====================================================================
+//=========================== StakedFrxUSD3 ===========================
+// ====================================================================
+
+import { IERC20 } from "@openzeppelin/contracts-5.3.0/token/ERC20/IERC20.sol";
+import { ERC20 } from "solmate/tokens/ERC20.sol";
+
+import { SfrxUSD2 } from "src/contracts/ethereum/sfrxUSD/versioning/SfrxUSD2.sol";
+import { EIP3009Module, SignatureModule } from "src/contracts/shared/core/modules/EIP3009Module.sol";
+import { PermitModule } from "src/contracts/shared/core/modules/PermitModule.sol";
+
+/**
+ * @title StakedFrxUSD3
+ * @notice This contract is an upgrade of SfrxUSD2 with EIP-3009, ERC-1271.
+ */
+contract SfrxUSD3 is SfrxUSD2, EIP3009Module, PermitModule {
+    function version() public pure override returns (string memory) {
+        return "3.0.0";
+    }
+
+    constructor(address _underlying) SfrxUSD2(IERC20(_underlying), "Staked Frax USD", "sfrxUSD", address(0)) {}
+
+    /*//////////////////////////////////////////////////////////////
+                        Module Overrides
+    //////////////////////////////////////////////////////////////*/
+
+    /// @dev PermitModule override
+    /// @dev solmate ERC20 does not have _approve like OZ: so we create it here
+    function __approve(address owner, address spender, uint256 amount) internal override {
+        allowance[owner][spender] = amount;
+
+        emit Approval(owner, spender, amount);
+    }
+
+    function __transfer(address from, address to, uint256 amount) internal override returns (bool) {
+        balanceOf[from] -= amount;
+
+        // Cannot overflow because the sum of all user
+        // balances can't exceed the max uint256 value.
+        unchecked {
+            balanceOf[to] += amount;
+        }
+
+        emit Transfer(from, to, amount);
+        return true;
+    }
+
+    function __domainSeparatorV4() internal view override(PermitModule) returns (bytes32) {
+        return DOMAIN_SEPARATOR();
+    }
+
+    function __hashTypedDataV4(bytes32 structHash) internal view override(SignatureModule) returns (bytes32) {
+        return keccak256(abi.encodePacked("\x19\x01", DOMAIN_SEPARATOR(), structHash));
+    }
+
+    function __useNonce(address owner) internal override(PermitModule) returns (uint256) {
+        return nonces[owner]++;
+    }
+
+    /// @dev Use PermitModule permit() with ERC-1271 support
+    function permit(
+        address owner,
+        address spender,
+        uint256 value,
+        uint256 deadline,
+        uint8 v,
+        bytes32 r,
+        bytes32 s
+    ) public override(ERC20, PermitModule) {
+        return
+            PermitModule.permit({ owner: owner, spender: spender, value: value, deadline: deadline, v: v, r: r, s: s });
+    }
+
+    /// @dev override DOMAIN_SEPARATOR() to utilize the proxy address over the cached implementation address
+    function DOMAIN_SEPARATOR() public view override returns (bytes32) {
+        return computeDomainSeparator();
+    }
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts (last updated v5.1.0) (token/ERC20/IERC20.sol)
+
+pragma solidity ^0.8.20;
+
+/**
+ * @dev Interface of the ERC-20 standard as defined in the ERC.
+ */
+interface IERC20 {
+    /**
+     * @dev Emitted when `value` tokens are moved from one account (`from`) to
+     * another (`to`).
+     *
+     * Note that `value` may be zero.
+     */
+    event Transfer(address indexed from, address indexed to, uint256 value);
+
+    /**
+     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
+     * a call to {approve}. `value` is the new allowance.
+     */
+    event Approval(address indexed owner, address indexed spender, uint256 value);
+
+    /**
+     * @dev Returns the value of tokens in existence.
+     */
+    function totalSupply() external view returns (uint256);
+
+    /**
+     * @dev Returns the value of tokens owned by `account`.
+     */
+    function balanceOf(address account) external view returns (uint256);
+
+    /**
+     * @dev Moves a `value` amount of tokens from the caller's account to `to`.
+     *
+     * Returns a boolean value indicating whether the operation succeeded.
+     *
+     * Emits a {Transfer} event.
+     */
+    function transfer(address to, uint256 value) external returns (bool);
+
+    /**
+     * @dev Returns the remaining number of tokens that `spender` will be
+     * allowed to spend on behalf of `owner` through {transferFrom}. This is
+     * zero by default.
+     *
+     * This value changes when {approve} or {transferFrom} are called.
+     */
+    function allowance(address owner, address spender) external view returns (uint256);
+
+    /**
+     * @dev Sets a `value` amount of tokens as the allowance of `spender` over the
+     * caller's tokens.
+     *
+     * Returns a boolean value indicating whether the operation succeeded.
+     *
+     * IMPORTANT: Beware that changing an allowance with this method brings the risk
+     * that someone may use both the old and the new allowance by unfortunate
+     * transaction ordering. One possible solution to mitigate this race
+     * condition is to first reduce the spender's allowance to 0 and set the
+     * desired value afterwards:
+     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
+     *
+     * Emits an {Approval} event.
+     */
+    function approve(address spender, uint256 value) external returns (bool);
+
+    /**
+     * @dev Moves a `value` amount of tokens from `from` to `to` using the
+     * allowance mechanism. `value` is then deducted from the caller's
+     * allowance.
+     *
+     * Returns a boolean value indicating whether the operation succeeded.
+     *
+     * Emits a {Transfer} event.
+     */
+    function transferFrom(address from, address to, uint256 value) external returns (bool);
+}
+
+
+// SPDX-License-Identifier: AGPL-3.0-only
+pragma solidity >=0.8.0;
+
+/// @notice Modern and gas efficient ERC20 + EIP-2612 implementation.
+/// @author Solmate (https://github.com/transmissions11/solmate/blob/main/src/tokens/ERC20.sol)
+/// @author Modified from Uniswap (https://github.com/Uniswap/uniswap-v2-core/blob/master/contracts/UniswapV2ERC20.sol)
+/// @dev Do not manually set balances without updating totalSupply, as the sum of all user balances must not exceed it.
+abstract contract ERC20 {
+    /*//////////////////////////////////////////////////////////////
+                                 EVENTS
+    //////////////////////////////////////////////////////////////*/
+
+    event Transfer(address indexed from, address indexed to, uint256 amount);
+
+    event Approval(address indexed owner, address indexed spender, uint256 amount);
+
+    /*//////////////////////////////////////////////////////////////
+                            METADATA STORAGE
+    //////////////////////////////////////////////////////////////*/
+
+    string public name;
+
+    string public symbol;
+
+    uint8 public immutable decimals;
+
+    /*//////////////////////////////////////////////////////////////
+                              ERC20 STORAGE
+    //////////////////////////////////////////////////////////////*/
+
+    uint256 public totalSupply;
+
+    mapping(address => uint256) public balanceOf;
+
+    mapping(address => mapping(address => uint256)) public allowance;
+
+    /*//////////////////////////////////////////////////////////////
+                            EIP-2612 STORAGE
+    //////////////////////////////////////////////////////////////*/
+
+    uint256 internal immutable INITIAL_CHAIN_ID;
+
+    bytes32 internal immutable INITIAL_DOMAIN_SEPARATOR;
+
+    mapping(address => uint256) public nonces;
+
+    /*//////////////////////////////////////////////////////////////
+                               CONSTRUCTOR
+    //////////////////////////////////////////////////////////////*/
+
+    constructor(
+        string memory _name,
+        string memory _symbol,
+        uint8 _decimals
+    ) {
+        name = _name;
+        symbol = _symbol;
+        decimals = _decimals;
+
+        INITIAL_CHAIN_ID = block.chainid;
+        INITIAL_DOMAIN_SEPARATOR = computeDomainSeparator();
+    }
+
+    /*//////////////////////////////////////////////////////////////
+                               ERC20 LOGIC
+    //////////////////////////////////////////////////////////////*/
+
+    function approve(address spender, uint256 amount) public virtual returns (bool) {
+        allowance[msg.sender][spender] = amount;
+
+        emit Approval(msg.sender, spender, amount);
+
+        return true;
+    }
+
+    function transfer(address to, uint256 amount) public virtual returns (bool) {
+        balanceOf[msg.sender] -= amount;
+
+        // Cannot overflow because the sum of all user
+        // balances can't exceed the max uint256 value.
+        unchecked {
+            balanceOf[to] += amount;
+        }
+
+        emit Transfer(msg.sender, to, amount);
+
+        return true;
+    }
+
+    function transferFrom(
+        address from,
+        address to,
+        uint256 amount
+    ) public virtual returns (bool) {
+        uint256 allowed = allowance[from][msg.sender]; // Saves gas for limited approvals.
+
+        if (allowed != type(uint256).max) allowance[from][msg.sender] = allowed - amount;
+
+        balanceOf[from] -= amount;
+
+        // Cannot overflow because the sum of all user
+        // balances can't exceed the max uint256 value.
+        unchecked {
+            balanceOf[to] += amount;
+        }
+
+        emit Transfer(from, to, amount);
+
+        return true;
+    }
+
+    /*//////////////////////////////////////////////////////////////
+                             EIP-2612 LOGIC
+    //////////////////////////////////////////////////////////////*/
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
+        require(deadline >= block.timestamp, "PERMIT_DEADLINE_EXPIRED");
+
+        // Unchecked because the only math done is incrementing
+        // the owner's nonce which cannot realistically overflow.
+        unchecked {
+            address recoveredAddress = ecrecover(
+                keccak256(
+                    abi.encodePacked(
+                        "\x19\x01",
+                        DOMAIN_SEPARATOR(),
+                        keccak256(
+                            abi.encode(
+                                keccak256(
+                                    "Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"
+                                ),
+                                owner,
+                                spender,
+                                value,
+                                nonces[owner]++,
+                                deadline
+                            )
+                        )
+                    )
+                ),
+                v,
+                r,
+                s
+            );
+
+            require(recoveredAddress != address(0) && recoveredAddress == owner, "INVALID_SIGNER");
+
+            allowance[recoveredAddress][spender] = value;
+        }
+
+        emit Approval(owner, spender, value);
+    }
+
+    function DOMAIN_SEPARATOR() public view virtual returns (bytes32) {
+        return block.chainid == INITIAL_CHAIN_ID ? INITIAL_DOMAIN_SEPARATOR : computeDomainSeparator();
+    }
+
+    function computeDomainSeparator() internal view virtual returns (bytes32) {
+        return
+            keccak256(
+                abi.encode(
+                    keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
+                    keccak256(bytes(name)),
+                    keccak256("1"),
+                    block.chainid,
+                    address(this)
+                )
+            );
+    }
+
+    /*//////////////////////////////////////////////////////////////
+                        INTERNAL MINT/BURN LOGIC
+    //////////////////////////////////////////////////////////////*/
+
+    function _mint(address to, uint256 amount) internal virtual {
+        totalSupply += amount;
+
+        // Cannot overflow because the sum of all user
+        // balances can't exceed the max uint256 value.
+        unchecked {
+            balanceOf[to] += amount;
+        }
+
+        emit Transfer(address(0), to, amount);
+    }
+
+    function _burn(address from, uint256 amount) internal virtual {
+        balanceOf[from] -= amount;
+
+        // Cannot underflow because a user's balance
+        // will never be larger than the total supply.
+        unchecked {
+            totalSupply -= amount;
+        }
+
+        emit Transfer(from, address(0), amount);
+    }
+}
+
+
 // SPDX-License-Identifier: AGPL-3.0-only
 pragma solidity ^0.8.21;
 
@@ -15,18 +416,14 @@
 // Tested for 18-decimal underlying assets only
 
 import { Timelock2Step } from "frax-std/access-control/v2/Timelock2Step.sol";
-import { IERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
-import { IfrxUSD } from "src/contracts/interfaces/IfrxUSD.sol";
-import { SafeCastLib } from "solmate/utils/SafeCastLib.sol";
-import { LinearRewardsQuasiErc4626, ERC20 } from "./LinearRewardsQuasiErc4626.sol";
+import { IERC20 } from "@openzeppelin/contracts-5.3.0/token/ERC20/ERC20.sol";
+import { LinearRewardsErc4626_2, ERC20 } from "src/contracts/ethereum/sfrxUSD/inherited/LinearRewardsErc4626_2.sol";
 
 /// @title Staked frxUSD
 /// @notice A ERC4626-like Vault implementation with linear rewards, rewards can be capped
-contract StakedFrxUSD2 is LinearRewardsQuasiErc4626, Timelock2Step {
-    using SafeCastLib for *;
-
+contract SfrxUSD2 is LinearRewardsErc4626_2, Timelock2Step {
     /// @notice Used for initialization
-    bool private _initialized;
+    bool public _initialized;
 
     /// @notice Array of minters
     address[] public minters_array;
@@ -34,6 +431,10 @@
     /// @notice Mapping of the minters
     /// @dev Mapping is used for faster verification
     mapping(address => bool) public minters;
+
+    function version() public pure virtual returns (string memory) {
+        return "2.0.1";
+    }
 
     /// @param _underlying The erc20 asset deposited
     /// @param _name The name of the vault
@@ -44,37 +445,8 @@
         string memory _name,
         string memory _symbol,
         address _timelockAddress
-    ) LinearRewardsQuasiErc4626(ERC20(address(_underlying)), _name, _symbol) Timelock2Step(_timelockAddress) {
+    ) LinearRewardsErc4626_2(ERC20(address(_underlying)), _name, _symbol) Timelock2Step(_timelockAddress) {
         _initialized = true;
-    }
-
-    error AlreadyInitialized();
-
-    /// @param _name The name of the vault
-    /// @param _symbol The symbol of the vault
-    /// @param _timelockAddress The address of the timelock/owner contract
-    /// @param _ppsInfo [0] Initial PricePerShare [1] PricePerShare increase per sec
-    function initialize(
-        string memory _name,
-        string memory _symbol,
-        address _timelockAddress,
-        uint256[2] memory _ppsInfo
-    ) external {
-        if (_initialized) revert AlreadyInitialized();
-        _initialized = true;
-        name = _name;
-        symbol = _symbol;
-        timelockAddress = _timelockAddress;
-
-        // Burn all the frxUSD currently in this contract
-        IfrxUSD(address(asset)).burn(asset.balanceOf(address(this)));
-
-        // Set PricePerShare info initially
-        pricePerShareStored = _ppsInfo[0];
-        pricePerShareIncPerSecond = _ppsInfo[1];
-
-        // Set lastSync to now
-        lastSync = block.timestamp;
     }
 
     /* ========== MODIFIERS ========== */
@@ -260,6 +632,368 @@
 }
 
 
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
 // SPDX-License-Identifier: ISC
 pragma solidity >=0.8.0;
 
@@ -424,7 +1158,7 @@
 
 
 // SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v5.1.0) (token/ERC20/ERC20.sol)
+// OpenZeppelin Contracts (last updated v5.3.0) (token/ERC20/ERC20.sol)
 
 pragma solidity ^0.8.20;
 
@@ -464,8 +1198,7 @@
     /**
      * @dev Sets the values for {name} and {symbol}.
      *
-     * All two of these values are immutable: they can only be set once during
-     * construction.
+     * Both values are immutable: they can only be set once during construction.
      */
     constructor(string memory name_, string memory symbol_) {
         _name = name_;
@@ -666,7 +1399,7 @@
     }
 
     /**
-     * @dev Sets `value` as the allowance of `spender` over the `owner` s tokens.
+     * @dev Sets `value` as the allowance of `spender` over the `owner`'s tokens.
      *
      * This internal function is equivalent to `approve`, and can be used to
      * e.g. set automatic allowances for certain subsystems, etc.
@@ -716,7 +1449,7 @@
     }
 
     /**
-     * @dev Updates `owner` s allowance for `spender` based on spent `value`.
+     * @dev Updates `owner`'s allowance for `spender` based on spent `value`.
      *
      * Does not update the allowance value in case of infinite allowance.
      * Revert if not enough allowance is available.
@@ -725,7 +1458,7 @@
      */
     function _spendAllowance(address owner, address spender, uint256 value) internal virtual {
         uint256 currentAllowance = allowance(owner, spender);
-        if (currentAllowance != type(uint256).max) {
+        if (currentAllowance < type(uint256).max) {
             if (currentAllowance < value) {
                 revert ERC20InsufficientAllowance(spender, currentAllowance, value);
             }
@@ -733,280 +1466,6 @@
                 _approve(owner, spender, currentAllowance - value, false);
             }
         }
-    }
-}
-
-
-// SPDX-License-Identifier: MIT
-pragma solidity >=0.8.0;
-
-interface IfrxUSD {
-    function DOMAIN_SEPARATOR() external view returns (bytes32);
-
-    function acceptOwnership() external;
-
-    function addMinter(address minter_address) external;
-
-    function allowance(address owner, address spender) external view returns (uint256);
-
-    function approve(address spender, uint256 value) external returns (bool);
-
-    function balanceOf(address account) external view returns (uint256);
-
-    function burn(uint256 value) external;
-
-    function burnFrom(address account, uint256 value) external;
-
-    function decimals() external view returns (uint8);
-
-    function eip712Domain()
-        external
-        view
-        returns (
-            bytes1 fields,
-            string memory name,
-            string memory version,
-            uint256 chainId,
-            address verifyingContract,
-            bytes32 salt,
-            uint256[] memory extensions
-        );
-
-    function initialize(address _owner, string memory _name, string memory _symbol) external;
-
-    function minter_burn_from(address b_address, uint256 b_amount) external;
-
-    function minter_mint(address m_address, uint256 m_amount) external;
-
-    function minters(address) external view returns (bool);
-
-    function minters_array(uint256) external view returns (address);
-
-    function name() external view returns (string memory);
-
-    function nonces(address owner) external view returns (uint256);
-
-    function owner() external view returns (address);
-
-    function pendingOwner() external view returns (address);
-
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
-    function removeMinter(address minter_address) external;
-
-    function renounceOwnership() external;
-
-    function symbol() external view returns (string memory);
-
-    function totalSupply() external view returns (uint256);
-
-    function transfer(address to, uint256 value) external returns (bool);
-
-    function transferFrom(address from, address to, uint256 value) external returns (bool);
-
-    function transferOwnership(address newOwner) external;
-}
-
-
-// SPDX-License-Identifier: AGPL-3.0-only
-pragma solidity >=0.8.0;
-
-/// @notice Safe unsigned integer casting library that reverts on overflow.
-/// @author Solmate (https://github.com/transmissions11/solmate/blob/main/src/utils/SafeCastLib.sol)
-/// @author Modified from OpenZeppelin (https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/math/SafeCast.sol)
-library SafeCastLib {
-    function safeCastTo248(uint256 x) internal pure returns (uint248 y) {
-        require(x < 1 << 248);
-
-        y = uint248(x);
-    }
-
-    function safeCastTo240(uint256 x) internal pure returns (uint240 y) {
-        require(x < 1 << 240);
-
-        y = uint240(x);
-    }
-
-    function safeCastTo232(uint256 x) internal pure returns (uint232 y) {
-        require(x < 1 << 232);
-
-        y = uint232(x);
-    }
-
-    function safeCastTo224(uint256 x) internal pure returns (uint224 y) {
-        require(x < 1 << 224);
-
-        y = uint224(x);
-    }
-
-    function safeCastTo216(uint256 x) internal pure returns (uint216 y) {
-        require(x < 1 << 216);
-
-        y = uint216(x);
-    }
-
-    function safeCastTo208(uint256 x) internal pure returns (uint208 y) {
-        require(x < 1 << 208);
-
-        y = uint208(x);
-    }
-
-    function safeCastTo200(uint256 x) internal pure returns (uint200 y) {
-        require(x < 1 << 200);
-
-        y = uint200(x);
-    }
-
-    function safeCastTo192(uint256 x) internal pure returns (uint192 y) {
-        require(x < 1 << 192);
-
-        y = uint192(x);
-    }
-
-    function safeCastTo184(uint256 x) internal pure returns (uint184 y) {
-        require(x < 1 << 184);
-
-        y = uint184(x);
-    }
-
-    function safeCastTo176(uint256 x) internal pure returns (uint176 y) {
-        require(x < 1 << 176);
-
-        y = uint176(x);
-    }
-
-    function safeCastTo168(uint256 x) internal pure returns (uint168 y) {
-        require(x < 1 << 168);
-
-        y = uint168(x);
-    }
-
-    function safeCastTo160(uint256 x) internal pure returns (uint160 y) {
-        require(x < 1 << 160);
-
-        y = uint160(x);
-    }
-
-    function safeCastTo152(uint256 x) internal pure returns (uint152 y) {
-        require(x < 1 << 152);
-
-        y = uint152(x);
-    }
-
-    function safeCastTo144(uint256 x) internal pure returns (uint144 y) {
-        require(x < 1 << 144);
-
-        y = uint144(x);
-    }
-
-    function safeCastTo136(uint256 x) internal pure returns (uint136 y) {
-        require(x < 1 << 136);
-
-        y = uint136(x);
-    }
-
-    function safeCastTo128(uint256 x) internal pure returns (uint128 y) {
-        require(x < 1 << 128);
-
-        y = uint128(x);
-    }
-
-    function safeCastTo120(uint256 x) internal pure returns (uint120 y) {
-        require(x < 1 << 120);
-
-        y = uint120(x);
-    }
-
-    function safeCastTo112(uint256 x) internal pure returns (uint112 y) {
-        require(x < 1 << 112);
-
-        y = uint112(x);
-    }
-
-    function safeCastTo104(uint256 x) internal pure returns (uint104 y) {
-        require(x < 1 << 104);
-
-        y = uint104(x);
-    }
-
-    function safeCastTo96(uint256 x) internal pure returns (uint96 y) {
-        require(x < 1 << 96);
-
-        y = uint96(x);
-    }
-
-    function safeCastTo88(uint256 x) internal pure returns (uint88 y) {
-        require(x < 1 << 88);
-
-        y = uint88(x);
-    }
-
-    function safeCastTo80(uint256 x) internal pure returns (uint80 y) {
-        require(x < 1 << 80);
-
-        y = uint80(x);
-    }
-
-    function safeCastTo72(uint256 x) internal pure returns (uint72 y) {
-        require(x < 1 << 72);
-
-        y = uint72(x);
-    }
-
-    function safeCastTo64(uint256 x) internal pure returns (uint64 y) {
-        require(x < 1 << 64);
-
-        y = uint64(x);
-    }
-
-    function safeCastTo56(uint256 x) internal pure returns (uint56 y) {
-        require(x < 1 << 56);
-
-        y = uint56(x);
-    }
-
-    function safeCastTo48(uint256 x) internal pure returns (uint48 y) {
-        require(x < 1 << 48);
-
-        y = uint48(x);
-    }
-
-    function safeCastTo40(uint256 x) internal pure returns (uint40 y) {
-        require(x < 1 << 40);
-
-        y = uint40(x);
-    }
-
-    function safeCastTo32(uint256 x) internal pure returns (uint32 y) {
-        require(x < 1 << 32);
-
-        y = uint32(x);
-    }
-
-    function safeCastTo24(uint256 x) internal pure returns (uint24 y) {
-        require(x < 1 << 24);
-
-        y = uint24(x);
-    }
-
-    function safeCastTo16(uint256 x) internal pure returns (uint16 y) {
-        require(x < 1 << 16);
-
-        y = uint16(x);
-    }
-
-    function safeCastTo8(uint256 x) internal pure returns (uint8 y) {
-        require(x < 1 << 8);
-
-        y = uint8(x);
     }
 }
 
@@ -1022,22 +1481,18 @@
 // | /_/   /_/   \__,_/_/|_|  /_/   /_/_/ /_/\__,_/_/ /_/\___/\___/   |
 // |                                                                  |
 // ====================================================================
-// ===================== LinearRewardsQuasiErc4626 ====================
+// ===================== LinearRewardsErc4626_2 ====================
 // ====================================================================
 // Frax Finance: https://github.com/FraxFinance
 
 import { ERC20, ERC4626 } from "solmate/mixins/ERC4626.sol";
-import { SafeCastLib } from "solmate/utils/SafeCastLib.sol";
-import { ln, mul, div, pow, exp, wrap } from "@prb/math/src/ud60x18/Math.sol";
+import { ln, mul, div, exp, wrap } from "@prb/math/src/ud60x18/Math.sol";
 import { convert } from "@prb/math/src/ud60x18/Conversions.sol";
 import { UD60x18 } from "@prb/math/src/ud60x18/ValueType.sol";
-import "forge-std/console2.sol";
 
 /// @title LinearRewardsErc4626
 /// @notice An ERC4626 Vault implementation with linear rewards
-abstract contract LinearRewardsQuasiErc4626 is ERC4626 {
-    using SafeCastLib for *;
-
+abstract contract LinearRewardsErc4626_2 is ERC4626 {
     /// @notice The precision of all integer calculations
     uint256 public constant PRECISION = 1e18;
 
@@ -1160,13 +1615,6 @@
     /// @param _asOfTime The time at which to calculate. Must be now or in the future
     /// @return _newPricePerShare Expected pricePerShare at _asOfTime, in UNDERLYING_PRECISION
     function _previewPricePerShare(uint256 _asOfTime) internal view returns (uint256 _newPricePerShare) {
-        // CHECK THIS MATH!!!
-        // CHECK THIS MATH!!!
-        // CHECK THIS MATH!!!
-        // CHECK THIS MATH!!!
-        // CHECK THIS MATH!!!
-        // CHECK THIS MATH!!!
-
         // Calculate the elapsed time
         uint256 _elapsedTime = _asOfTime - lastSync;
 
@@ -1188,15 +1636,6 @@
         //     convert(UNDERLYING_PRECISION)
         // );
 
-        // console2.log("=============");
-        // console2.log("pricePerShareIncPerSecond: ", pricePerShareIncPerSecond);
-        // console2.log("_elapsedTime: ", _elapsedTime);
-        // console2.log("convert(_exponentUD60_18): ", convert(_exponentUD60_18));
-        // console2.log(
-        //     "convert(_exponentUD60_18 * UNDERLYING_PRECISION): ",
-        //     convert(mul(_exponentUD60_18, convert(UNDERLYING_PRECISION)))
-        // );
-
         // Get the raw e^exponent in UD60x18
         UD60x18 _ePowUD60_18 = exp(_exponentUD60_18);
 
@@ -1205,15 +1644,8 @@
         //     // Scale the UD60x18 up by UNDERLYING_PRECISION and convert to uint256
         //     uint256 _ePowU256 = convert(mul(_ePowUD60_18, convert(UNDERLYING_PRECISION)));
 
-        //     // console2.log(
-        //     //     "convert(_ePowUD60_18 * UNDERLYING_PRECISION): ",
-        //     //     convert(mul(_ePowUD60_18, convert(UNDERLYING_PRECISION)))
-        //     // );
-        //     // console2.log("_ePowU256: ", _ePowU256);
-
         //     // Calculate _newPricePerShare
         //     _newPricePerShare = (pricePerShareStored * _ePowU256) / UNDERLYING_PRECISION;
-        //     // console2.log("_newPricePerShare: ", _newPricePerShare);
         // }
 
         // New
@@ -1430,84 +1862,30 @@
 }
 
 
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v5.1.0) (token/ERC20/IERC20.sol)
-
-pragma solidity ^0.8.20;
+pragma solidity ^0.8.0;
+
+import { SignatureChecker } from "@openzeppelin/contracts-5.3.0/utils/cryptography/SignatureChecker.sol";
 
 /**
- * @dev Interface of the ERC-20 standard as defined in the ERC.
+ * @dev This is a base contract to aid in writing upgradeable contracts that use EIP-712 signatures.
+ * It provides functionality to initialize the EIP-712 domain separator and verify signatures.
  */
-interface IERC20 {
-    /**
-     * @dev Emitted when `value` tokens are moved from one account (`from`) to
-     * another (`to`).
-     *
-     * Note that `value` may be zero.
-     */
-    event Transfer(address indexed from, address indexed to, uint256 value);
-
-    /**
-     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
-     * a call to {approve}. `value` is the new allowance.
-     */
-    event Approval(address indexed owner, address indexed spender, uint256 value);
-
-    /**
-     * @dev Returns the value of tokens in existence.
-     */
-    function totalSupply() external view returns (uint256);
-
-    /**
-     * @dev Returns the value of tokens owned by `account`.
-     */
-    function balanceOf(address account) external view returns (uint256);
-
-    /**
-     * @dev Moves a `value` amount of tokens from the caller's account to `to`.
-     *
-     * Returns a boolean value indicating whether the operation succeeded.
-     *
-     * Emits a {Transfer} event.
-     */
-    function transfer(address to, uint256 value) external returns (bool);
-
-    /**
-     * @dev Returns the remaining number of tokens that `spender` will be
-     * allowed to spend on behalf of `owner` through {transferFrom}. This is
-     * zero by default.
-     *
-     * This value changes when {approve} or {transferFrom} are called.
-     */
-    function allowance(address owner, address spender) external view returns (uint256);
-
-    /**
-     * @dev Sets a `value` amount of tokens as the allowance of `spender` over the
-     * caller's tokens.
-     *
-     * Returns a boolean value indicating whether the operation succeeded.
-     *
-     * IMPORTANT: Beware that changing an allowance with this method brings the risk
-     * that someone may use both the old and the new allowance by unfortunate
-     * transaction ordering. One possible solution to mitigate this race
-     * condition is to first reduce the spender's allowance to 0 and set the
-     * desired value afterwards:
-     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
-     *
-     * Emits an {Approval} event.
-     */
-    function approve(address spender, uint256 value) external returns (bool);
-
-    /**
-     * @dev Moves a `value` amount of tokens from `from` to `to` using the
-     * allowance mechanism. `value` is then deducted from the caller's
-     * allowance.
-     *
-     * Returns a boolean value indicating whether the operation succeeded.
-     *
-     * Emits a {Transfer} event.
-     */
-    function transferFrom(address from, address to, uint256 value) external returns (bool);
+abstract contract SignatureModule {
+    /// @notice Error thrown when a signature is invalid
+    error InvalidSignature();
+
+    /// @dev Added supportive function to check if the signature is valid
+    function _requireIsValidSignatureNow(address signer, bytes32 structHash, bytes memory signature) internal view {
+        if (
+            !SignatureChecker.isValidSignatureNow({
+                signer: signer,
+                hash: __hashTypedDataV4({ structHash: structHash }),
+                signature: signature
+            })
+        ) revert InvalidSignature();
+    }
+
+    function __hashTypedDataV4(bytes32 struc
[truncated — full diff is 139,578 bytes]
```

</details>

🔒 **Immutable References:** `DEPRECATED__timelockAddress()` → Gnosis Safe 3/5

### 🔴 `upgradeability (TransparentUpgradeable)`

> ⚠️ **CRITICAL** — Upgradeability allows arbitrary code replacement. Must be behind both a Multisig AND a Timelock.

**Privileged write functions:**  
**Capabilities:** ⬆️ **UPGRADE**
- `upgradeTo(address)` — Upgrade proxy implementation to a new address `[UPGRADE]`
- `upgradeToAndCall(address,bytes)` — Upgrade proxy implementation and call an initializer `[UPGRADE]`

**Members (1):**

| Address | Name / Type | Risk | Granted | Source | Details |
|---|---|---|---|---|---|
| `0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27` | Gnosis Safe 3/5 | 🟢 LOW | — | Storage only | 3/5 signers |

**Signers of `Gnosis Safe 3/5` (0xB174...3f27):**

| Signer | Type | Owner Since | Notes |
|---|---|---|---|
| `0x6933BCC3e96f1C4d2cb73Cb391d854b18Ab7A4F2` | EOA ⚠️ Hot wallet (1,993 txs) | 2022-08-21 | EOA |
| `0xcbc616D595D38483e6AdC45C7E426f44bF230928` | EOA ⚠️ Hot wallet (1,092 txs) | 2024-03-06 | EOA |
| `0x17e06ce6914E3969f7BD37D8b2a563890cA1c96e` | EOA ⚠️ Hot wallet (2,122 txs) | — | EOA |
| `0xc8dE9f45601DA8C76158b8CAF3E56E8A037F2228` | EOA | 2024-03-05 | EOA |
| `0x6e74053a3798e0fC9a9775F7995316b27f21c4D2` | EOA ⚠️ Hot wallet (4,940 txs) | 2025-02-08 | EOA |

**Quorum history:**
  - 2022-08-21: ⚪ unchanged 3 → 3

### 🟢 `timelockAddress()`

**Privileged write functions:**  
**Capabilities:** 💰 **SUPPLY**
- `addMinter(address minter_address)` — Adds a minter `[SUPPLY]`
- `removeMinter(address minter_address)` — Removes a non-bridge minter `[SUPPLY]`
- `setAllPricingParams(uint256 _newPricePerShareStored, uint256 _newPricePerShareIncPerSecond, uint256 _newLastSync)` — Set pricePerShareStored, pricePerShareIncPerSecond, and lastSync in one call p(t) = p0*e^(r(t-t0)) `[SUPPLY]`
- `setPricePerShareIncPerSecond(uint256 _newPricePerShareIncPerSecond)` — Set pricePerShare increase rate, per second (pricePerShareIncPerSecond). Also sets lastSync to now and pricePerShareStored to the current pricePerShare `[SUPPLY]`
- `setPricePerShareStored(uint256 _newPricePerShareStored)` — Set pricePerShareStored `[SUPPLY]`
- `transferTimelock(address _newTimelock)` — The ```transferTimelock``` function initiates the timelock transfer Must be called by the current timelock
- `renounceTimelock()` — The ```renounceTimelock``` function renounces the timelock after setting pending timelock to current timelock Pending timelock must be set to current timelock before renouncing, creating a 2-step renounce process

**Members (1):**

| Address | Name / Type | Risk | Granted | Source | Details |
|---|---|---|---|---|---|
| `0x4b45D73b83686e69d08E61105FdB7F7b51f41Bc1` | Gnosis Safe 3/6 | 🟢 LOW | — | Storage only | 3/6 signers |

**Signers of `Gnosis Safe 3/6` (0x4b45...1Bc1):**

| Signer | Type | Owner Since | Notes |
|---|---|---|---|
| `0x381e2495e683868F693AA5B1414F712f21d34b40` | EOA | 2026-02-12 | EOA |
| `0xcbc616D595D38483e6AdC45C7E426f44bF230928` | EOA ⚠️ Hot wallet (1,092 txs) | — | EOA |
| `0x6e74053a3798e0fC9a9775F7995316b27f21c4D2` | EOA ⚠️ Hot wallet (4,940 txs) | — | EOA |
| `0x17e06ce6914E3969f7BD37D8b2a563890cA1c96e` | EOA ⚠️ Hot wallet (2,122 txs) | — | EOA |
| `0x6933BCC3e96f1C4d2cb73Cb391d854b18Ab7A4F2` | EOA ⚠️ Hot wallet (1,993 txs) | — | EOA |
| `0xc8dE9f45601DA8C76158b8CAF3E56E8A037F2228` | EOA | — | EOA |

#### 🔧 Permissioned Parameters

**`pricePerShareIncPerSecond`** 🔄 **ACTIVE** (22 changes)

> ⚠️ This parameter has been changed **22 times** — monitor for unexpected modifications.

| Field | Value |
|---|---|
| Current Value | `1197911451` |
| Setter | `setPricePerShareIncPerSecond(uint256 _newPricePerShareIncPerSecond)` |
| Gated by | `timelockAddress()` |
| Tags | `SUPPLY` |
| Last changed | 2026-05-28 |
| Changed by | `0x4b45...1Bc1` (Gnosis Safe 3/6) |
| Total changes | 22 🔄 |

**Recent changes (showing last 5 of 22):**

| # | Value | Set By | Date |
|---|---|---|---|
| 1 | `_newPricePerShareIncPerSecond=1197911451` | `0x4b45...1Bc1` (Gnosis Safe 3/6) | 2026-05-28 |
| 2 | `_newPricePerShareIncPerSecond=1197911451` | `0x4b45...1Bc1` (Gnosis Safe 3/6) | 2026-05-28 |
| 3 | `_newPricePerShareIncPerSecond=1197911451` | `0x4b45...1Bc1` (Gnosis Safe 3/6) | 2026-05-28 |
| 4 | `_newPricePerShareIncPerSecond=1197911451` | `0x4b45...1Bc1` (Gnosis Safe 3/6) | 2026-05-28 |
| 5 | `1197911451` | `0x6933...A4F2` (EOA) | 2026-05-28 |

**`pricePerShareStored`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)*

> This parameter has never been changed since deployment.

| Field | Value |
|---|---|
| Current Value | `1196116812288257575 (1.196117e18)` |
| Setter | `setPricePerShareStored(uint256 _newPricePerShareStored)` |
| Gated by | `timelockAddress()` |
| Tags | `SUPPLY` |
| Last changed | — |
| Changed by | — |
| Total changes | 0 ❄️ |

#### 💰 Supply Actions

_Mint / redeem / burn call tracking — last 5 calls per function, total counts preserved._

**`addMinter`** *(per-asset)* 🔄 **ACTIVE** (7 changes)

> ⚠️ This parameter has been changed **7 times** — monitor for unexpected modifications.

| Field | Value |
|---|---|
| Setter | `addMinter(address minter_address)` |
| Gated by | `timelockAddress()` |
| Tags | `SUPPLY` |
| Last called | 2025-10-16 |
| Called by | `0x4b45...1Bc1` (Gnosis Safe 3/6) |
| Total calls | 7 🔄 |

**Recent changes (showing last 5 of 7):**

| # | Asset | Value | Set By | Date |
|---|---|---|---|---|
| 1 | TransparentUpgradeableProxy | `(Safe-mediated)` | `0x4b45...1Bc1` (Gnosis Safe 3/6) | 2025-10-16 |
| 2 | TransparentUpgradeableProxy | `(Safe-mediated)` | `0x4b45...1Bc1` (Gnosis Safe 3/6) | 2025-10-16 |
| 3 | TransparentUpgradeableProxy | `(Safe-mediated)` | `0x4b45...1Bc1` (Gnosis Safe 3/6) | 2025-10-16 |
| 4 | TransparentUpgradeableProxy | `(Safe-mediated)` | `0x4b45...1Bc1` (Gnosis Safe 3/6) | 2025-10-16 |
| 5 | TransparentUpgradeableProxy | `—` | `0x17e0...c96e` (EOA) | 2025-10-16 |

**`minter_burn_from`** *(per-asset)*

| Field | Value |
|---|---|
| Setter | `minter_burn_from(address b_address, uint256 b_amount)` |
| Gated by | `minter()` |
| Tags | `SUPPLY` |
| Last called | 2025-10-16 |
| Called by | `0x4b45...1Bc1` (Gnosis Safe 3/6) |
| Total calls | 1 |

**Recent changes:**

| # | Asset | Value | Set By | Date |
|---|---|---|---|---|
| 1 | Gnosis Safe 3/6 | `b_amount=7002000000000000000000000 (7,002,000.000000e18)` | `0x4b45...1Bc1` (Gnosis Safe 3/6) | 2025-10-16 |

**`minter_mint`** *(per-asset)*

| Field | Value |
|---|---|
| Setter | `minter_mint(address m_address, uint256 m_amount)` |
| Gated by | `minter()` |
| Tags | `SUPPLY` |
| Last called | 2025-10-30 |
| Called by | `0x4b45...1Bc1` (Gnosis Safe 3/6) |
| Total calls | 3 |

**Recent changes:**

| # | Asset | Value | Set By | Date |
|---|---|---|---|---|
| 1 | Gnosis Safe 3/6 | `m_amount=250000000000000000000000 (250,000.000000e18)` | `0x4b45...1Bc1` (Gnosis Safe 3/6) | 2025-10-30 |
| 2 | Gnosis Safe 3/6 | `m_amount=50000000000000000000000 (50,000.000000e18)` | `0x4b45...1Bc1` (Gnosis Safe 3/6) | 2025-10-27 |
| 3 | Gnosis Safe 3/6 | `m_amount=5000000000000000000000000 (5,000,000.000000e18)` | `0x4b45...1Bc1` (Gnosis Safe 3/6) | 2025-09-02 |

**`removeMinter`** *(per-asset)* ❄️ **DORMANT**

> This parameter has never been changed since deployment.

| Field | Value |
|---|---|
| Setter | `removeMinter(address minter_address)` |
| Gated by | `timelockAddress()` |
| Tags | `SUPPLY` |
| Last called | — |
| Called by | — |
| Total calls | 0 ❄️ |

**`setAllPricingParams`** ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> This parameter has never been changed since deployment.

| Field | Value |
|---|---|
| Setter | `setAllPricingParams(uint256 _newPricePerShareStored, uint256 _newPricePerShareIncPerSecond, uint256 _newLastSync)` |
| Gated by | `timelockAddress()` |
| Tags | `SUPPLY` |
| Last called | — |
| Called by | — |
| Total calls | 0 ❄️ |

---
<a id="c-0x7311cea93ccf5f4f7b789ee31eba5d9b9290e126"></a>
## > FraxOFTMintableAdapterUpgradeable `0x7311CEA93ccf5f4F7b789eE31eBA5D9B9290E126`

> > ⚠️ **Upgradeable** (TransparentUpgradeable) — impl: `0xF07571beDB8cbd98e6cA43B5Ee0fB178477d2219`

> **Proxy History (5 events):**

> | # | Date | Event | Address | Key Changes | Tx |
> |---|---|---|---|---|---|
> | 1 | 2025-02-04 | Upgrade | `0x8f1B...6250` | Initial deployment | [0x365cc9b758003f63517e06d2559c7b6d57a1bf3a0595b4931ee7677914a77623](https://etherscan.io/tx/0x365cc9b758003f63517e06d2559c7b6d57a1bf3a0595b4931ee7677914a77623) |
> | 2 | 2025-02-04 | Upgrade | `0x98c4...a9F5` | +6 fn; added `allowInitializePath((uint32,bytes32,uint64))`; added `initialize(address)`; added `owner()`; added `renounceOwnership()`; added `setDelegate(address)`; added `transferOwnership(address)` | [0xa8ab12bd80da972df404c173e74b4bf8f1be0210b03b8053ec7e379cca2eb75b](https://etherscan.io/tx/0xa8ab12bd80da972df404c173e74b4bf8f1be0210b03b8053ec7e379cca2eb75b) |
> | 3 | 2025-02-04 | Admin Changed | `0x0990...814b` | Previous: `0x0000...0000` | [0x365cc9b758003f63517e06d2559c7b6d57a1bf3a0595b4931ee7677914a77623](https://etherscan.io/tx/0x365cc9b758003f63517e06d2559c7b6d57a1bf3a0595b4931ee7677914a77623) |
> | 4 | 2025-02-04 | Admin Changed | `0x223a...405c` | Previous: `0x0990...814b` | [0x80bc49873fe59275b48fa8bc3d851c199943433d46a79a3722e3072924ccf6cc](https://etherscan.io/tx/0x80bc49873fe59275b48fa8bc3d851c199943433d46a79a3722e3072924ccf6cc) |
> | 5 | 2025-10-16 | Upgrade | `0xF075...2219` | +6 fn; added `totalTransferFrom(uint32)`; added `totalTransferFromSum()`; added `totalTransferTo(uint32)`; added `totalTransferToSum()`; added `totalTransfers(uint32)`; added `totalTransfersAndInitialTotalSupply(uint32)`; -1 fn; removed `initialize(address)`; 📝 src +214/-18 | [0xe795bc10ed1655920cbbeb147c4f4599519d0cdae4e0279e9ae80e1b03b04bc7](https://etherscan.io/tx/0xe795bc10ed1655920cbbeb147c4f4599519d0cdae4e0279e9ae80e1b03b04bc7) |

> <details>
> <summary>📝 Source diff — upgrade #5 (<code>0x98c4...a9F5</code> → <code>0xF075...2219</code>): +214/-18 lines</summary>

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

> > 💰 **Inherited supply authority** — holds `minter()` on **SfrxUSD**. Access controls on this contract gate root token supply.

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
> | `0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27` | Gnosis Safe 3/5 | 🟢 LOW | — | Storage+Events | 3/5 signers |

> **Signers of `Gnosis Safe 3/5` (0xB174...3f27):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x6933BCC3e96f1C4d2cb73Cb391d854b18Ab7A4F2` | EOA ⚠️ Hot wallet (1,993 txs) | 2022-08-21 | EOA |
> | `0xcbc616D595D38483e6AdC45C7E426f44bF230928` | EOA ⚠️ Hot wallet (1,092 txs) | 2024-03-06 | EOA |
> | `0x17e06ce6914E3969f7BD37D8b2a563890cA1c96e` | EOA ⚠️ Hot wallet (2,122 txs) | — | EOA |
> | `0xc8dE9f45601DA8C76158b8CAF3E56E8A037F2228` | EOA | 2024-03-05 | EOA |
> | `0x6e74053a3798e0fC9a9775F7995316b27f21c4D2` | EOA ⚠️ Hot wallet (4,940 txs) | 2025-02-08 | EOA |

> **Quorum history:**
>   - 2022-08-21: ⚪ unchanged 3 → 3

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
<a id="c-0x1a44076050125825900e736c501f859c50fe728c"></a>
## > EndpointV2 `0x1a44076050125825900e736c501f859c50fE728c`

> > 🍃 **Shared infrastructure** (LayerZero EndpointV2) — reachable from the root contract but not specific to this protocol. BFS expansion stopped here; this contract's `owner()` / `delegate()` / role members are NOT followed into the dependency graph because they reflect the infrastructure's own governance, not the protocol's authority surface.

> > 💰 **Inherited supply authority** — holds `minter()` on **SfrxUSD**. Access controls on this contract gate root token supply.

> _No roles detected._

---
<a id="c-0xb898ad2976b4d8f2e21521c9db16b7497825e503"></a>
## > Timelock `0xb898Ad2976b4d8f2E21521C9db16b7497825E503`

> > 💰 **Inherited supply authority** — holds `minter()` on **SfrxUSD**. Access controls on this contract gate root token supply.

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
## ⚡ Authority Concentration

The following addresses hold permissions across multiple contracts or roles in this dependency stack. Concentration of authority increases systemic risk — a single compromised key or colluding multisig can affect multiple systems.

### 🟢 `0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27` — Gnosis Safe 3/5
Controls **3 role(s)** across **3 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| SfrxUSD `0xcf62...c5b6` | `upgradeability (TransparentUpgradeable)` | `upgradeTo(address)`, `upgradeToAndCall(address,bytes)` | — |
| ProxyAdmin `0xeA0a...13cB` | `owner()` | `upgradeAndCall(ITransparentUpgradeableProxy proxy, address implementation, bytes memory data)`, `renounceOwnership()`, `transferOwnership(address newOwner)` | — |
| FraxOFTMintableAdapterUpgradeable `0x7311...E126` | `owner()` | `setInitialTotalSupply(uint32 _eid, uint256 _amount)`, `setMsgInspector(address _msgInspector)`, `setEnforcedOptions(EnforcedOptionParam[] calldata _enforcedOptions)`, `setPreCrime(address _preCrime)` +4 more | — |

### 🟢 `0x4b45D73b83686e69d08E61105FdB7F7b51f41Bc1` — Gnosis Safe 3/6
Controls **2 role(s)** across **1 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| SfrxUSD `0xcf62...c5b6` | `minter()` | `minter_burn_from(address b_address, uint256 b_amount)`, `minter_mint(address m_address, uint256 m_amount)` | — |
| SfrxUSD `0xcf62...c5b6` | `timelockAddress()` | `addMinter(address minter_address)`, `removeMinter(address minter_address)`, `setAllPricingParams(uint256 _newPricePerShareStored, uint256 _newPricePerShareIncPerSecond, uint256 _newLastSync)`, `setPricePerShareIncPerSecond(uint256 _newPricePerShareIncPerSecond)` +3 more | — |


---
## ⛔ Sanctions Screening

| Source | Status |
|---|---|
| OFAC SDN | ✅ OFAC SDN screened (97 ETH addresses, cache: 2026-06-25) |
| Chainalysis | ✅ Chainalysis screened |
| **Result** | 17 addresses screened · ✅ 0 flagged |

---
## EOA Exposure Summary

✅ No direct EOA role holders detected.

---
## ✅ Scan Integrity

No issues detected. All block ranges covered, source and ABI resolved for all contracts.
