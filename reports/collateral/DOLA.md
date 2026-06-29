# Trustfall — Access Control Report — Dola USD Stablecoin (DOLA)

| Field | Value |
|---|---|
| Contract | `0x865377367054516e17014CcdED1e7d814EDC9ce4` |
| Token | Dola USD Stablecoin (DOLA) |
| Name | DOLA [ERC20] |
| Chain | Ethereum |
| Proxy Status | ✅ No |
| OZ AccessControl | ❌ No |
| Ownable | ❌ No |
| Pausable | — |
| ERC-4626 Vault | — |
| Control Surface | ✅ Fully on-chain |
| Scan Integrity | ✅ No issues detected |
| Report Date | 2026-06-25 23:08 UTC |

### Surface Summary

| Field | Value |
|---|---:|
| Contracts | 11 |
| Role slots | 28 |
| Privileged Fns | 49 |
| EOA Holders | 1 ⚠️ |
| Critical Roles | 1 ⚠️ |

## Changes Since Last Scan

> Comparing **2026-06-02T22:14:37Z** (block 25232601) → **2026-06-25T23:07:45Z** (block 25397795).

### Parameters
- 🔄 `ceilings` on **Fed** (`0x2b3454…90fd`)
    - current_value: `DAI market: 500000000000000000000 (500.000000e18) · PT-sUSDE-27MAR2025 market: 0 · st-yETH market: 0 · PT-sUSDE-27NOV2025 market: 50000000000000000000000000 (50,000,000.000000e18) · yvyCRV market: 400000000000000000000000 (400,000.000000e18) · yvCurve-DOLA-wstUSR-f market: 5000000000000000000000000 (5,000,000.000000e18) · COMP market: 0 · cbBTC market: 10000000000000000000000000 (10,000,000.000000e18) · PT-sUSDE-29MAY2025 market: 0 · dola-save market: 50000000000000000000000000 (50,000,000.000000e18) · cvxCRV market: 3000000000000000000000000 (3,000,000.000000e18) · DOLA/USR market: 0 · wstETH market: 50000000000000000000000000 (50,000,000.000000e18) · crvDOLA market: 0 · WBTC market: 10000000000000000000000000 (10,000,000.000000e18) · yvCurve-DOLA-sUSDS-f market: 50000000000000000000000000 (50,000,000.000000e18) · yvCurve-DOLA-sUSDe-f market: 20000000000000000000000000 (20,000,000.000000e18) · yvCurve-DOLA-deUSD-f market: 0 · yvCurve-DOLA-scrvUSD-f market: 50000000000000000000000000 (50,000,000.000000e18) · PT-sUSDE-25SEP2025 market: 0 · savedola market: 0 · WETH market: 10000000000000000000000000 (10,000,000.000000e18) · CRV market: 3000000000000000000000000 (3,000,000.000000e18) · crvUSDDOLA-f market: 60000000000000000000000 (60,000.000000e18) · stETH market: 0 · sUSDe market: 5000000000000000000000000 (5,000,000.000000e18) · gOHM market: 0 · yvCurve-DOLA-FRXBP-f market: 0 · DOLAFRAXBP3CRV-f market: 0 · cvxFXS market: 0 · deUSD/DOLA market: 0 · yvCurve-DOLA-USR-f market: 0 · DOLA-sUSDS market: 50000000000000000000000000 (50,000,000.000000e18) · PT-USDe-27NOV2025 market: 50000000000000000000000000 (50,000,000.000000e18) · sFRAX market: 0 · DOLA-sUSDe market: 80000000000000000000000000 (80,000,000.000000e18) · INV market: 500000000000000000000000 (500,000.000000e18) · PT-USDe-25SEP2025 market: 0 · yvCurve-sDOLA-scrvUSD-f market: 0 · CVX market: 3000000000000000000000000 (3,000,000.000000e18) · DOLAwstUSR market: 25000000000000000000000000 (25,000,000.000000e18) · yvCurve-DOLA-crvUSD-f market: 0 · yvCurve-DOLA-FRAXPYUSD-f market: 0 · PT-sUSDE-31JUL2025 market: 0` → `DAI market: 500000000000000000000 (500.000000e18) · PT-sUSDE-27MAR2025 market: 0 · st-yETH market: 0 · PT-sUSDE-27NOV2025 market: 50000000000000000000000000 (50,000,000.000000e18) · yvyCRV market: 400000000000000000000000 (400,000.000000e18) · yvCurve-DOLA-wstUSR-f market: 5000000000000000000000000 (5,000,000.000000e18) · COMP market: 0 · cbBTC market: 10000000000000000000000000 (10,000,000.000000e18) · PT-sUSDE-29MAY2025 market: 0 · dola-save market: 50000000000000000000000000 (50,000,000.000000e18) · cvxCRV market: 3000000000000000000000000 (3,000,000.000000e18) · DOLA/USR market: 0 · wstETH market: 50000000000000000000000000 (50,000,000.000000e18) · crvDOLA market: 0 · WBTC market: 10000000000000000000000000 (10,000,000.000000e18) · yvCurve-DOLA-sUSDS-f market: 50000000000000000000000000 (50,000,000.000000e18) · yvCurve-DOLA-sUSDe-f market: 20000000000000000000000000 (20,000,000.000000e18) · yvCurve-DOLA-deUSD-f market: 0 · yvCurve-DOLA-scrvUSD-f market: 50000000000000000000000000 (50,000,000.000000e18) · PT-sUSDE-25SEP2025 market: 0 · savedola market: 0 · WETH market: 10000000000000000000000000 (10,000,000.000000e18) · CRV market: 3000000000000000000000000 (3,000,000.000000e18) · crvUSDDOLA-f market: 60000000000000000000000 (60,000.000000e18) · stETH market: 0 · sUSDe market: 5000000000000000000000000 (5,000,000.000000e18) · gOHM market: 0 · yvCurve-DOLA-FRXBP-f market: 0 · DOLAFRAXBP3CRV-f market: 0 · cvxFXS market: 0 · deUSD/DOLA market: 0 · yvCurve-DOLA-USR-f market: 0 · DOLA-sUSDS market: 50000000000000000000000000 (50,000,000.000000e18) · PT-USDe-27NOV2025 market: 50000000000000000000000000 (50,000,000.000000e18) · sFRAX market: 0 · DOLA-sUSDe market: 80000000000000000000000000 (80,000,000.000000e18) · INV market: 0 · PT-USDe-25SEP2025 market: 0 · yvCurve-sDOLA-scrvUSD-f market: 0 · CVX market: 3000000000000000000000000 (3,000,000.000000e18) · DOLAwstUSR market: 25000000000000000000000000 (25,000,000.000000e18) · yvCurve-DOLA-crvUSD-f market: 0 · yvCurve-DOLA-FRAXPYUSD-f market: 0 · PT-sUSDE-31JUL2025 market: 0`
    - set_at_block: `24731863` → `25386485`
- 🔄 `contraction` on **Fed** (`0x2b3454…90fd`)
    - set_at_block: `24937210` → `25295073`


## 📋 Protocol Context

> *From protocol profile: Inverse Finance / DOLA (Stablecoin)*

<details>
<summary><strong>Architecture</strong></summary>

- **Architectural shape:** Compound Gov + Timelock 2d mediates SUPPLY across 5 Feds; chair Safe (2/6) gates day-to-day expansion/contraction directly without Timelock buffer
- **ERC-20 stablecoin:** Inverse Finance's DOLA, pegged to $1 USD
- **Upgradability:** Not upgradable — direct deployment, no proxy pattern
- **Operator pattern:** single operator address holds supreme admin over supply functions
- **Minter whitelist:** operator calls addMinter(addr) to authorize addresses for mint(). Tracked via minters mapping, not a single slot
- **Fed system:** minters are typically Fed contracts that expand/contract DOLA supply into lending markets (FiRM, Frontier, PSM, Gearbox vault)
- **Fed hierarchy:** each Fed has gov() (Timelock) and chair() (multisig) — chair does day-to-day expansion/contraction, gov sets ceilings and can replace chair
- **Two-step operator transfer:** setPendingOperator() + claimOperator() — prevents accidental handoff
- **Governance chain:** GovernorMills (INV token voting) -> Compound Timelock (2d) -> DOLA operator
- **Pause mechanism:** None — DOLA has no pausable functionality
- **Blacklist mechanism:** None — DOLA does not restrict transfers by address
- **Burn surface:** burn() is permissionless for own tokens; burnFrom() uses standard ERC-20 allowance

</details>

<details>
<summary><strong>Function Interaction Paths</strong></summary>

- **`addMinter(address)`** (`operator()`)
  - Grants the address permission to call mint() — unlimited minting with no supply cap at the DOLA level
  - New minter can immediately begin inflating DOLA supply
  - Fed contracts self-enforce supply ceilings, but a raw minter has no ceiling
  - ⚠️ *Adding a minter is equivalent to granting unlimited supply authority. The DOLA contract itself has NO supply cap — caps are enforced only at the Fed contract level.*
- **`setPendingOperator(address) + claimOperator()`** (`operator()`)
  - Transfers supreme admin control over DOLA to a new address
  - New operator inherits ability to mint, addMinter, removeMinter
  - setPendingOperator emits NO event — change is invisible to event-based monitoring
  - ⚠️ *Silent two-step transfer. If the Timelock queues setPendingOperator, the only way to detect it is tx-level monitoring of the Timelock queue, not DOLA contract events.*
- **`expansion(market, amount)`** (`chair() on Fed`)
  - Fed calls DOLA.mint() to create new DOLA and deposit into a lending market
  - Increases DOLA total supply and the market's DOLA liquidity
  - Subject to Fed-level supplyCeiling and per-market ceiling (if set)
  - ⚠️ *Primary supply expansion mechanism. Chair is a 2/6 multisig — lower quorum than typical for supply-altering operations.*
- **`contraction(market, amount)`** (`chair() on Fed`)
  - Fed withdraws DOLA from a lending market and calls DOLA.burn()
  - Decreases DOLA total supply
  - Cannot contract more than the Fed has supplied to that market
  - ⚠️ *Supply reduction mechanism. Reverts if amount exceeds Fed's supplied balance — prevents over-contraction.*
- **`removeMinter(address)`** (`operator()`)
  - Revokes an address's ability to call mint()
  - Does NOT affect DOLA already minted — only prevents future minting
  - Fed contracts that lose minter status can no longer expand
  - ⚠️ *Emergency brake for compromised minters. Operator (Timelock) can remove a minter, but the 2-day delay means a compromised minter has a window to mint.*
- **`changeMarketCeiling(IMarket, uint)`** (`gov() on Fed (0x2b34...90fd)`)
  - Sets the per-market DOLA ceiling inside the Fed
  - Caps how much DOLA the chair can expand into a specific FiRM market
  - Raising the ceiling unlocks additional supply headroom for that market
  - ⚠️ *Per-market cap is the finest-grained FiRM exposure control. Timelock-gated (2d delay), so change is observable. FiRM collateral risk scales directly with this value on DOLA-backed markets.*
- **`sweep(address token)`** (`gov() on VaultFed (0xe082...34fc)`)
  - Extracts arbitrary ERC-20 tokens from the VaultFed contract
  - Not a DOLA supply operation — but can move any other token the Fed holds
  - ⚠️ *Timelock-gated, but unusual on a Fed contract. Worth noting for any ERC-20 that transiently sits in the VaultFed (rewards, leftover claimables).*
- **`allowCancel(uint proposalId, bool decision)`** (`deployer() on Guardian`)
  - Whitelists a GovernorMills proposal for cancellation
  - Does not execute the cancellation — executeCancel() is rwg() multisig gated
  - A compromised deployer key can arbitrarily block legitimate governance actions from progressing if it chains with a compromise/collusion in rwg()
  - ⚠️ *EOA-held role in the governance cancellation path. Cannot mint or change supply directly, but can stall emergency governance response if the rwg() multisig is also compromised. Two-key dependency, not single-key; still worth monitoring.*

</details>

<a id="sec-critical-params"></a>
<details>
<summary><strong>🎚️ Critical Parameter Levers</strong></summary>

> *4 on-chain parameter levers that are curated as high-impact for lender-side risk (direct dilution / safety-mechanism closure / authority transfer / oracle repointing). Each entry shows current value, the threshold that triggers the impact, and the role-holder controlling the lever.*

- **`setPendingOperator(address) + claimOperator()`** 🔴 on [**DOLA (0x865377367054516e17014CcdED1e7d814EDC9ce4)**](#c-0x865377367054516e17014ccded1e7d814edc9ce4)
    - *Role gate:* operator() — currently held by Compound Timelock (2d) at 0x926df14a23be491164dcf93f4c468a50ef659d5b. Two-step transfer (silent — no on-chain event for setPendingOperator); claimOperator() finalizes the handoff.
    - *Live current value (as of block 12,112,343):* `0x0000000000000000000000000000000000000000`
    - *Recorded changes:* 1 historical event(s); last setter `0x3FcB35a1CbFB6007f9BC638D388958Bc4550cB28`
    - *Profile-declared value:* `0x926dF14a23BE491164dCF93f4c468A50ef659D5B (Compound Timelock 2d)`
    - *Threshold:* Any address — replaces the supreme admin who controls addMinter, removeMinter, mint, and the operator slot itself
    - *Impact:* Single-tx + 2-day-delay transfer of the supreme DOLA admin role. New operator inherits unrestricted addMinter/removeMinter authority and direct mint(). The 2d Timelock delay means the change is observable; the only detection signal is tx-level monitoring of the Timelock queue (setPendingOperator emits no DOLA event). For FiRM: a successful queue-of-malicious-operator that goes unobserved for 2d would replace the entire mint-authority root.
- **`addMinter(address) + removeMinter(address)`** 🟡 on [**DOLA (0x865377367054516e17014CcdED1e7d814EDC9ce4)**](#c-0x865377367054516e17014ccded1e7d814edc9ce4)
    - *Role gate:* operator() (Compound Timelock 2d) — every minter add/remove sits behind a 2-day governance delay
    - *Profile-declared value:* `29 addMinter calls and 29 removeMinter calls historically. Active minter set comprises FiRM Fed (0x2b34...90fd), VaultFed, PSMFed, FrontierFed, FlashMinter, and a small number of historical minters since removed.`
    - *Threshold:* Any address — added minter gains uncapped mint() authority on DOLA
    - *Impact:* Adds an unbounded mint authority. New minter can immediately inflate DOLA supply with no contract-level cap (caps live on Fed contracts, not on DOLA). 2d Timelock delay means observable, but compromise of a freshly-added minter has a window to mint before removeMinter (also 2d-gated) lands. FiRM exposure scales with total DOLA debt minted into FiRM markets — adding a minter doesn't directly affect FiRM but expands the supply-side blast radius.
- **`changeMarketCeiling(IMarket,uint)`** 🟠 on [**Fed contracts (FiRM Fed: 0x2b34548b865ad66A2B046cb82e59eE43F75B90fd; per-market on each Fed)**](#c-0x2b34548b865ad66a2b046cb82e59ee43f75b90fd)
    - *Role gate:* gov() on Fed — Compound Timelock (2d). Per-market FiRM exposure cap; Timelock-gated so observable on-chain via queue.
    - *Live current value (as of block 25,386,485):* `44 markets · highest 80M (DOLA-sUSDe market) · 50M ×7 · 25M ×1 · 20M ×1 · 10M ×3 · 5M ×2 · 3M ×3 · <1M ×3 · 0 ×23 (retired/unfunded)`
      *Full per-market breakdown in the Permissioned Parameters table.*
    - *Recorded changes:* 112 historical event(s); last setter `0xBeCCB6bb0aa4ab551966A7E4B97cec74bb359Bf6`
    - *Profile-declared value:* `116 ceilings-mapping changes on FiRM Fed 0x2b34...90fd across 44+ markets. Distribution at scan tip 2026-05-16:
  - 9 markets at the 50M DOLA cap (top-tier exposure markets)
  - 4 markets at 10M-25M
  - 4 markets at 3M-5M
  - ~10 markets at 400k-3M
  - 1 market at 60k (smallest active)
  - ~20 markets at 0 (retired or unfunded)
All entries attributed to GovernorMills 0xBeCC...9Bf6.`
    - *Threshold:* Any uint — sets the maximum DOLA supply expansion the chair can push into a single FiRM market. Highest currently set cap is 50M DOLA; raising any market above that bracket signals expanded exposure on that specific market.
    - *Impact:* Per-market cap is the finest-grained FiRM exposure control. FiRM collateral risk on DOLA-backed markets scales linearly with this value. 2d Timelock means observable; an unexpectedly large ceiling raise is a yellow flag for FiRM analysts watching DOLA exposure on a market they're listed on. Direct effect on FiRM: bounds the maximum DOLA debt that can be minted against the affected market's collateral.
- **`changeSupplyCeiling(uint)`** 🟠 on [**Fed contracts (per-Fed, e.g. FiRM Fed: 0x2b34548b865ad66A2B046cb82e59eE43F75B90fd; second Fed 0x5e07...7ef7 mirrors history)**](#c-0x2b34548b865ad66a2b046cb82e59ee43f75b90fd)
    - *Role gate:* gov() on Fed — Compound Timelock (2d). Global cap on the Fed's mint authority across all its markets.
    - *Live current value (as of block 23,849,639):* `100000000000000000000000000000 (100,000,000,000.000000e18)`
    - *Recorded changes:* 18 historical event(s); last setter `0xBeCCB6bb0aa4ab551966A7E4B97cec74bb359Bf6`
    - *Profile-declared value:* `100B DOLA (1e29 wei) on FiRM Fed 0x2b34...90fd, set 2025-11-21 via GovernorMills proposal. 23 historical changes; most recent 5:
  - 2025-11-21: 100B DOLA (current; 500× scale-up from prior)
  - 2025-01-02: 200M DOLA
  - 2024-11-05: 120M DOLA
  - 2024-07-29: 100M DOLA
  - 2024-07-20: 50M DOLA
  - Constructor (2022-12-11): 500k DOLA
The 2025-11-21 raise (200M → 100B) is the largest single-tx supply ceiling adjustment in the Fed's history. Second Fed 0x5e07...7ef7 mirrors the 100B current value with its own 23-entry history.`
    - *Threshold:* Any uint — sets the maximum cumulative DOLA the Fed contract can hold/mint across all its markets. The current 100B Fed-level cap massively exceeds the sum of per-market ceilings (~300M-500M total in active markets at scan time), so the per-market caps are the binding constraint on actual deployable DOLA — not the Fed-level cap.
    - *Impact:* Global Fed cap. Bounds total DOLA inflation through this single Fed across all of its markets. 2d Timelock means observable. For FiRM: a Fed-level supply ceiling raise on a Fed that mints into FiRM markets is the upper bound on aggregate DOLA debt that could be minted against FiRM collateral via that Fed. The 2025-11-21 raise to 100B is a soft signal — the binding constraint remains per-market ceilings, not the Fed-level cap. Same severity tier as changeMarketCeiling — HIGH — because both are timelock-gated and the analyst can monitor the queue.

</details>

## 📑 Table of Contents

1. [Analyst Focus Areas](#analyst-focus-areas)
2. Contracts
   - [DOLA ★](#c-0x865377367054516e17014ccded1e7d814edc9ce4)
   - [Fed (0x5E07...7EF7)](#c-0x5e075e40d01c82b6bf0b0ecdb4eb1d6984357ef7)
   - [Fed (0x2b34...90fd)](#c-0x2b34548b865ad66a2b046cb82e59ee43f75b90fd)
   - [PSMFed](#c-0x67fc21332d24fc5250a3b7fc988191ad7f38f9cc)
   - [MainnetDolaFlashMinter](#c-0x6c5fdc0c53b122ae0f15a863c349f3a481de8f1f)
   - [VaultFed](#c-0xe082eb109fad53ea8db9827ce6b8ef74882734fc)
   - [Timelock](#c-0x926df14a23be491164dcf93f4c468a50ef659d5b)
   - [GovernorMills](#c-0xbeccb6bb0aa4ab551966a7e4b97cec74bb359bf6)
   - [Guardian](#c-0x941c2699ec7e55a50bde030d8e1e70649839259d)
3. [⚡ Authority Concentration](#-authority-concentration)
4. [⛔ Sanctions Screening](#-sanctions-screening)
5. [EOA Exposure Summary](#eoa-exposure-summary)
6. [✅ Scan Integrity](#scan-integrity)

## Analyst Focus Areas

> **Observational findings — not risk determinations.** Each item below is a focus point for the Risk Analyst to interpret against collateralization context and the protocol's stated intent. Attention levels (CRITICAL / HIGH / LOW) reflect the scanner's heuristic weight — not a realized risk to FiRM. These observations support future risk assessments; they do not constitute one.

> **2 critical-attention** and **23 high-attention** observation(s) across 11 contract(s).


### 🔴 CRITICAL (2)

- 🔴 [**Observed: EOA holds `deployer()` on Guardian**](#c-0x941c2699ec7e55a50bde030d8e1e70649839259d) — `0x3FcB35a1CbFB6007f9BC638D388958Bc4550cB28` (EOA) — single key controls a role whose functions (`allowCancel`, `setPendingDeployer`) may reach inherited [SUPPLY] authority via DOLA [ERC20]. Inheritance is a dependency-graph edge — verify these functions actually exercise it before treating it as a confirmed path. Assess custody and intent.
- 🎚️ [**Observed: 4 critical parameter levers (CRITICAL: 1, HIGH: 2, MEDIUM: 1)**](#sec-critical-params) — Asset has 4 on-chain parameter levers curated as high-impact for lender-side risk. See the 🎚️ Critical Parameter Levers section for the role gate, current value, threshold, and impact of each. These are singular setters / function calls that flip risk surface in one tx — direct dilution, safety-mechanism closure, authority transfer, or oracle repointing. Verify role-gate identities and threshold distance-to-trigger against current operating posture.

### 🟠 HIGH (23)

- 💰 **Observed: 9 role(s) with supply-altering capability** — Supply-altering surface detected: `minter()` on DOLA [ERC20], `operator()` on DOLA [ERC20], `chair()` on Fed +6 more. Assess each holder's custody and governance.
- 🔗 [**Observed: supply authority chain on Fed**](#c-0x5e075e40d01c82b6bf0b0ecdb4eb1d6984357ef7) — Chain: DOLA [ERC20] → `minter()` → Fed. Controlled by: `chair()`, `gov()`. Assess custody — compromise of this chain could affect root token supply.
- 🔗 [**Observed: supply authority chain on GnosisSafe**](#c-0x5e075e40d01c82b6bf0b0ecdb4eb1d6984357ef7) — Chain: DOLA [ERC20] → `minter()` → Fed → `chair()` → GnosisSafe. Controlled by: `Safe Owners (2/6 required)`. Assess custody — compromise of this chain could affect root token supply.
- ⚠️ [**No Timelock in admin chain: `minter()` on DOLA [ERC20]**](#c-0x865377367054516e17014ccded1e7d814edc9ce4) — `minter()` has SUPPLY capability and is held by: `0x5E07...7EF7` (Contract), `0x2b34...90fd` (Contract), `0x67FC...f9cC` (Contract) +2 more. No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `chair()` on Fed**](#c-0x926df14a23be491164dcf93f4c468a50ef659d5b) — `chair()` has SUPPLY capability and is held by: `0x8F97...DfC8` (Safe). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `chair()` on PSMFed**](#c-0x926df14a23be491164dcf93f4c468a50ef659d5b) — `chair()` has SUPPLY capability and is held by: `0x8F97...DfC8` (Safe). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `chair()` on VaultFed**](#c-0xe082eb109fad53ea8db9827ce6b8ef74882734fc) — `chair()` has SUPPLY capability and is held by: `0x8F97...DfC8` (Safe). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.

<details>
<summary>🔄 **14 volatile parameter(s) observed across 6 contract(s) (≥5 historical changes each)** — Operational tempo signal — high-velocity setters indicate active governance maintenance, oracle keepers, or routinely-tuned risk parameters. Expand to review each parameter's change count and current value; assess against the protocol's stated intent.</summary>

- 🔄 [**Observed: volatile parameter `addMinter` on DOLA [ERC20]**](#c-0x865377367054516e17014ccded1e7d814edc9ce4) — `addMinter(address minter_)` changed 29 times. Current value: ``. Assess change pattern.
- 🔄 [**Observed: volatile parameter `removeMinter` on DOLA [ERC20]**](#c-0x865377367054516e17014ccded1e7d814edc9ce4) — `removeMinter(address minter_)` changed 29 times. Current value: ``. Assess change pattern.
- 🔄 [**Observed: volatile parameter `expansion` on Fed**](#c-0x5e075e40d01c82b6bf0b0ecdb4eb1d6984357ef7) — `expansion(uint amount)` changed 58 times. Current value: ``. Assess change pattern.
- 🔄 [**Observed: volatile parameter `contraction` on Fed**](#c-0x5e075e40d01c82b6bf0b0ecdb4eb1d6984357ef7) — `contraction(uint amount)` changed 77 times. Current value: ``. Assess change pattern.
- 🔄 [**Observed: volatile parameter `supplyCeiling` on Fed**](#c-0x5e075e40d01c82b6bf0b0ecdb4eb1d6984357ef7) — `changeSupplyCeiling(uint _supplyCeiling)` changed 18 times. Current value: `100000000000000000000000000000 (100,000,000,000.000000e18)`. Assess change pattern.
- 🔄 [**Observed: volatile parameter `ceilings` on Fed**](#c-0x5e075e40d01c82b6bf0b0ecdb4eb1d6984357ef7) — `changeMarketCeiling(IMarket _market, uint _ceiling)` changed 112 times. Current value: 44 markets · highest 80M (DOLA-sUSDe market) · 50M ×7 · 25M ×1 · 20M ×1 · 10M ×3 · 5M ×2 · 3M ×3 · <1M ×3 · 0 ×23 (retired/unfunded) — full per-key breakdown in the Permissioned Parameters table on Fed. Assess change pattern.
- 🔄 [**Observed: volatile parameter `supplyCap` on PSMFed**](#c-0x67fc21332d24fc5250a3b7fc988191ad7f38f9cc) — `setSupplyCap(uint256 newSupplyCap)` changed 6 times. Current value: `10000000000000000000000000 (10,000,000.000000e18)`. Assess change pattern.
- 🔄 [**Observed: volatile parameter `expansion` on PSMFed**](#c-0x67fc21332d24fc5250a3b7fc988191ad7f38f9cc) — `expansion(uint256 amount)` changed 7 times. Current value: ``. Assess change pattern.
- 🔄 [**Observed: volatile parameter `contraction` on PSMFed**](#c-0x67fc21332d24fc5250a3b7fc988191ad7f38f9cc) — `contraction(uint256 amount)` changed 6 times. Current value: ``. Assess change pattern.
- 🔄 [**Observed: volatile parameter `maxFlashLimit` on MainnetDolaFlashMinter**](#c-0x6c5fdc0c53b122ae0f15a863c349f3a481de8f1f) — `setMaxFlashLimit(uint256 _newLimit)` changed 6 times. Current value: `5000000000000000000000000 (5,000,000.000000e18)`. Assess change pattern.
- 🔄 [**Observed: volatile parameter `supplyCap` on VaultFed**](#c-0xe082eb109fad53ea8db9827ce6b8ef74882734fc) — `setSupplyCap(uint newSupplyCap)` changed 6 times. Current value: `3000000000000000000000000 (3,000,000.000000e18)`. Assess change pattern.
- 🔄 [**Observed: volatile parameter `expansion` on VaultFed**](#c-0xe082eb109fad53ea8db9827ce6b8ef74882734fc) — `expansion(uint amount)` changed 8 times. Current value: ``. Assess change pattern.
- 🔄 [**Observed: volatile parameter `contraction` on VaultFed**](#c-0xe082eb109fad53ea8db9827ce6b8ef74882734fc) — `contraction(uint amount)` changed 22 times. Current value: ``. Assess change pattern.
- 🔄 [**Observed: volatile parameter `proposalThreshold` on GovernorMills**](#c-0xbeccb6bb0aa4ab551966a7e4b97cec74bb359bf6) — `updateProposalThreshold(uint256 newThreshold)` changed 7 times. Current value: `1900000000000000000000 (1,900.000000e18)`. Assess change pattern.

</details>

- 🟠 [**Observed: pending critical-lever call `changeMarketCeiling(address,uint256)` on Fed contracts**](#c-0x5e075e40d01c82b6bf0b0ecdb4eb1d6984357ef7) — Queued 2024-12-16, callable from 2024-12-18. Declared lever: **changeMarketCeiling(IMarket,uint)** (declared severity: HIGH). Current value: 44 markets · highest 80M (DOLA-sUSDe market) · 50M ×7 · 25M ×1 · 20M ×1 · 10M ×3 · 5M ×2 · 3M ×3 · <1M ×3 · 0 ×23 (retired/unfunded). Threshold: Any uint — sets the maximum DOLA supply expansion the chair can push into a single FiRM market. Highest currently set cap is 50M DOLA; raising any market above that bracket signals expanded exposure on that specific market.. Timelock: `0x926dF14a23BE491164dCF93f4c468A50ef659D5B` (compound). Review the queued args before the timelock fires.

### 🟡 MEDIUM (1)

- 🚦 **Observed: no pause() primitive — supply contractable via reduce/shutdown lever** — Supply-altering surface on `DOLA [ERC20]`, `Fed`, `PSMFed` +1 more has no pause()/unpause() primitive or PAUSE-tagged role, but new issuance can be halted at the source by contracting supply via `contraction` on Fed, `contraction` on PSMFed (+1 more) — a per-market/asset brake rather than a global freeze. Verify the contraction lever's authority is an acceptable incident response.

> **Standard review checklist:** Verify role-holder identities, timelock delays, multisig quorum and signers, upgrade-path custody, and parameter bounds against current protocol spec — regardless of findings above.

<a id="sec-pending-lever-calls"></a>
## ⏳ Pending Critical-Lever Calls

> **1 pending call(s) to declared critical levers** detected in in-scope timelocks. Each is a queued call that has not yet executed — the timelock delay is the review window. Severity inherits from the lever's declared severity in the profile (analyst curation). Review the args + execution context BEFORE the timelock fires.

### 🟠 Pending lever-call #1 — `changeMarketCeiling(address,uint256)` on Fed contracts (HIGH)

- **Timelock:** `0x926dF14a23BE491164dCF93f4c468A50ef659D5B` (Compound Timelock)
- **Queued:** 2024-12-16 (block 21,412,284)
- **Callable from:** 2024-12-18 03:06 UTC
- **Declared name:** changeMarketCeiling(IMarket,uint)
- **Target contract:** `0x2b34548b865ad66A2B046cb82e59eE43F75B90fd`
- **Live current value:** 44 markets · highest 80M (DOLA-sUSDe market) · 50M ×7 · 25M ×1 · 20M ×1 · 10M ×3 · 5M ×2 · 3M ×3 · <1M ×3 · 0 ×23 (retired/unfunded)
- **Threshold:** Any uint — sets the maximum DOLA supply expansion the chair can push into a single FiRM market. Highest currently set cap is 50M DOLA; raising any market above that bracket signals expanded exposure on that specific market.
- **Declared impact:** Per-market cap is the finest-grained FiRM exposure control. FiRM collateral risk on DOLA-backed markets scales linearly with this value. 2d Timelock means observable; an unexpectedly large ceiling raise is a yellow flag for FiRM analysts watching DOLA exposure on a market they're listed on. Direct effect on FiRM: bounds the maximum DOLA debt that can be minted against the affected market's collateral.
- **Role gate:** gov() on Fed — Compound Timelock (2d). Per-market FiRM exposure cap; Timelock-gated so observable on-chain via queue.
- **Queued calldata:** `0x0000000000000000000000000c0bb843fabda441edefb93331cfff8ec92bd16800000000…`

> See [🎚️ Critical Parameter Levers](#sec-critical-params) for the full lever context (impact / threshold / role gate).

## Attention Legend

> Attention levels indicate how prominently a signal should feature in the analyst's review — not the realized risk to FiRM.

| Icon | Attention | Meaning |
|---|---|---|
| 🔴 | CRITICAL | EOA private key, unknown upgrader, or unprotected upgrade path — verify immediately |
| 🟠 | HIGH | Unrecognised contract or elevated privilege pattern — requires investigation |
| 🟢 | LOW | Standard custodial pattern — Gnosis Safe, TimelockController, ERC-4626 vault, OZ Governor, Aragon Agent |
| 🔵 | DISCREPANCY | Storage and event history disagree — investigate for data integrity |

---
<a id="c-0x865377367054516e17014ccded1e7d814edc9ce4"></a>
## DOLA [ERC20] `0x865377367054516e17014CcdED1e7d814EDC9ce4`

✅ **Two-step admin transfer:** `setPendingOperator + claimOperator` — prevents accidental hand-off (request → accept flow).

### 🟠 `minter()`

**Privileged write functions:**  
**Capabilities:** 💰 **SUPPLY**
- `mint(address to, uint amount)` — (auto) Create new tokens, increasing total supply `[SUPPLY]`

**Members (5):**

| Address | Name / Type | Risk | Granted | Source | Details |
|---|---|---|---|---|---|
| `0x5E075E40D01c82B6Bf0B0ecdb4Eb1D6984357EF7` | Fed | 🟠 HIGH | 2021-02-23 | Storage+Events · hasRole ✓ |  |
| `0x2b34548b865ad66A2B046cb82e59eE43F75B90fd` | Fed | 🟠 HIGH | — | Storage+Events · hasRole ✓ |  |
| `0x67FC21332D24FC5250a3B7fc988191ad7F38f9cC` | PSMFed | 🟠 HIGH | — | Storage+Events · hasRole ✓ |  |
| `0x6C5Fdc0c53b122Ae0f15a863C349f3A481DE8f1F` | MainnetDolaFlashMinter | 🟠 HIGH | — | Storage+Events · hasRole ✓ |  |
| `0xe082EB109fAd53eA8DB9827ce6b8ef74882734fc` | VaultFed | 🟠 HIGH | — | Storage+Events · hasRole ✓ |  |

**🕘 Previous Holders (1)** _(verified inactive — `hasRole`/`is` returned false)_:

| Address | Name / Type | Granted | Status |
|---|---|---|---|
| `0x7eC0D931AFFBa01b77711C2cD07c76B970795CDd` | Stabilizer | 2021-02-23 | 🕘 HISTORICAL |

### 🟢 `operator()`

**Privileged write functions:**  
**Capabilities:** ⚙️ **CONFIG** 💰 **SUPPLY**
- `setPendingOperator(address newOperator_)` `[CONFIG]`
- `addMinter(address minter_)` — (auto) Authorize a new address to mint tokens `[SUPPLY]`
- `removeMinter(address minter_)` — (auto) Revoke an address's ability to mint tokens `[SUPPLY]`
- `mint(address to, uint amount)` — (auto) Create new tokens, increasing total supply `[SUPPLY]`
- `claimOperator()` — Second step of `setPendingOperator + claimOperator` — callable by the pending holder set via `setPendingOperator`, not by the current role. Included here to surface the full transfer handoff. `[CONFIG]`

**Members (1):**

| Address | Name / Type | Risk | Granted | Source | Details |
|---|---|---|---|---|---|
| `0x926dF14a23BE491164dCF93f4c468A50ef659D5B` | Compound Timelock (2d) | 🟢 LOW | — | Storage only | 2d delay |

#### 🔧 Permissioned Parameters

**`pendingOperator`** 🔴 **SILENT** *(no event)*

> 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

| Field | Value |
|---|---|
| Current Value | `0x0000000000000000000000000000000000000000` |
| Setter | `setPendingOperator(address newOperator_)` |
| Gated by | `operator()` |
| Tags | `CONFIG` |
| Last changed | 2021-03-26 |
| Changed by | `0x3FcB...cB28` (EOA) |
| Total changes | 1 |

**Recent changes:**

| # | Value | Set By | Date |
|---|---|---|---|
| 1 | `0x926dF14a23BE491164dCF93f4c468A50ef659D5B` | `0x3FcB...cB28` (EOA) | 2021-03-26 |

#### 💰 Supply Actions

_Mint / redeem / burn call tracking — last 5 calls per function, total counts preserved._

**`addMinter`** *(per-asset)* 🔄 **ACTIVE** (29 changes)

> ⚠️ This parameter has been changed **29 times** — monitor for unexpected modifications.

| Field | Value |
|---|---|
| Setter | `addMinter(address minter_)` |
| Gated by | `operator()` |
| Tags | `SUPPLY` |
| Last called | 2025-12-20 |
| Called by | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) |
| Total calls | 29 🔄 |

**Recent changes (showing last 5 of 29):**

| # | Asset | Value | Set By | Date |
|---|---|---|---|---|
| 1 | PSMFed | `(Safe-mediated)` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2025-12-20 |
| 2 | PSMFed | `(Safe-mediated)` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2025-12-20 |
| 3 | PSMFed | `(Safe-mediated)` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2025-12-20 |
| 4 | PSMFed | `(Safe-mediated)` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2025-12-20 |
| 5 | PSMFed | `(Safe-mediated)` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2025-12-20 |

**`mint`** *(per-asset)* 🔴 **SILENT** *(no event)*

> 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

| Field | Value |
|---|---|
| Setter | `mint(address to, uint amount)` |
| Gated by | `minter(), operator()` |
| Tags | `SUPPLY` |
| Last called | 2021-03-21 |
| Called by | `0x3FcB...cB28` (EOA) |
| Total calls | 1 |

**Recent changes:**

| # | Asset | Value | Set By | Date |
|---|---|---|---|---|
| 1 | EOA | `27875965322642982386599 (27,875.965323e18)` | `0x3FcB...cB28` (EOA) | 2021-03-21 |

**`removeMinter`** *(per-asset)* 🔄 **ACTIVE** (29 changes)

> ⚠️ This parameter has been changed **29 times** — monitor for unexpected modifications.

| Field | Value |
|---|---|
| Setter | `removeMinter(address minter_)` |
| Gated by | `operator()` |
| Tags | `SUPPLY` |
| Last called | 2025-12-20 |
| Called by | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) |
| Total calls | 29 🔄 |

**Recent changes (showing last 5 of 29):**

| # | Asset | Value | Set By | Date |
|---|---|---|---|---|
| 1 | PSMFed | `(Safe-mediated)` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2025-12-20 |
| 2 | PSMFed | `(Safe-mediated)` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2025-12-20 |
| 3 | PSMFed | `(Safe-mediated)` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2025-12-20 |
| 4 | PSMFed | `(Safe-mediated)` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2025-12-20 |
| 5 | PSMFed | `(Safe-mediated)` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2025-12-20 |

---
<a id="c-0x5e075e40d01c82b6bf0b0ecdb4eb1d6984357ef7"></a>
## > Fed `0x5E075E40D01c82B6Bf0B0ecdb4Eb1D6984357EF7`

> > 💰 **Inherited supply authority** — holds `minter()` on **DOLA [ERC20]**. Access controls on this contract gate root token supply.

> 🔒 **Immutable References:** `ctoken()` → anDola (CErc20Immutable)

### > 🟢 `chair()` · 🏛️ governance

> **Privileged write functions:**  
> **Capabilities:** 💰 **SUPPLY**
> - `resign()`
> - `expansion(uint amount)` — (auto) Mint tokens into a lending market (Fed operation) `[SUPPLY]`
> - `contraction(uint amount)` — (auto) Withdraw and burn tokens from a lending market (Fed operation) `[SUPPLY]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x8F97cCA30Dbe80e7a8B462F1dD1a51C32accDfC8` | Gnosis Safe 2/6 | 🟢 LOW | — | Storage only | 2/6 signers |

> **Signers of `Gnosis Safe 2/6` (0x8F97...DfC8):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x2723723FDd3Db8ba2D6f0e1B333e90A7E60A0411` | EOA ⚠️ Hot wallet (1,619 txs) | 2023-03-17 | EOA |
> | `0x9F3614afb3Df9f899caDBFfaA05c6C908059F726` | EOA | 2022-10-08 | EOA |
> | `0x962228a90eaC69238c7D1F216d80037e61eA9255` | EOA ⚠️ Hot wallet (1,771 txs) | — | EOA |
> | `0x3FcB35a1CbFB6007f9BC638D388958Bc4550cB28` | EOA ⚠️ Hot wallet (1,451 txs) | — | EOA |
> | `0x6535020cCeB810Bdb3F3cA5e93dE2460FF7989BB` | EOA | 2025-12-11 | EOA |
> | `0x52f63971afD2a32524c859C29943f9BEa38CA907` | EOA | 2022-09-06 | EOA |

> **Quorum history:**
>   - 2024-10-28: 🟢 increased 2 → 4
>   - 2025-07-22: 🔴 decreased 4 → 2
>   - 2025-12-01: 🟢 increased 2 → 3
>   - 2025-12-10: 🔴 decreased 3 → 2

### > 🟢 `gov()` · 🏛️ governance

> **Privileged write functions:**  
> **Capabilities:** ⚙️ **CONFIG**
> - `changeGov(address newGov_)`
> - `changeChair(address newChair_)` — (auto) Change the Fed chair address that controls expansion/contraction `[CONFIG]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x926dF14a23BE491164dCF93f4c468A50ef659D5B` | Compound Timelock (2d) | 🟢 LOW | — | Storage only | 2d delay |

> #### 🔧 Permissioned Parameters

> **`chair`**

> | Field | Value |
> |---|---|
> | Current Value | `0x8F97cCA30Dbe80e7a8B462F1dD1a51C32accDfC8` |
> | Setter | `changeChair(address newChair_)` |
> | Gated by | `gov()` |
> | Tags | `CONFIG` |
> | Last changed | 2022-05-15 |
> | Changed by | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) |
> | Total changes | 1 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `newChair_=0x8F97cCA30Dbe80e7a8B462F1dD1a51C32accDfC8` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2022-05-15 |

> **`gov`** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> | Field | Value |
> |---|---|
> | Current Value | `0x926dF14a23BE491164dCF93f4c468A50ef659D5B` |
> | Setter | `changeGov(address newGov_)` |
> | Gated by | `gov()` |
> | Tags | — |
> | Last changed | 2021-02-23 |
> | Changed by | `0x3FcB...cB28` (EOA) |
> | Total changes | 1 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `0x926dF14a23BE491164dCF93f4c468A50ef659D5B` | `0x3FcB...cB28` (EOA) | 2021-02-23 |

> #### 💰 Supply Actions

> _Mint / redeem / burn call tracking — last 5 calls per function, total counts preserved._

> **`contraction`** 🔄 **ACTIVE** (77 changes)

> > ⚠️ This parameter has been changed **77 times** — monitor for unexpected modifications.

> | Field | Value |
> |---|---|
> | Setter | `contraction(uint amount)` |
> | Gated by | `chair()` |
> | Tags | `SUPPLY` |
> | Last called | 2025-10-26 |
> | Called by | `0x8F97...DfC8` (Gnosis Safe 2/6) |
> | Total calls | 77 🔄 |

> **Recent changes (showing last 5 of 77):**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `amount=2350000000000000000000000 (2,350,000.000000e18)` | `0x8F97...DfC8` (Gnosis Safe 2/6) | 2025-10-26 |
> | 2 | `amount=2350000000000000000000000 (2,350,000.000000e18)` | `0x8F97...DfC8` (Gnosis Safe 2/6) | 2025-10-26 |
> | 3 | `amount=2350000000000000000000000 (2,350,000.000000e18)` | `0x8F97...DfC8` (Gnosis Safe 2/6) | 2025-10-26 |
> | 4 | `amount=2350000000000000000000000 (2,350,000.000000e18)` | `0x8F97...DfC8` (Gnosis Safe 2/6) | 2025-10-26 |
> | 5 | `amount=2350000000000000000000000 (2,350,000.000000e18)` | `0x8F97...DfC8` (Gnosis Safe 2/6) | 2025-10-26 |

> **`expansion`** 🔄 **ACTIVE** (58 changes)

> > ⚠️ This parameter has been changed **58 times** — monitor for unexpected modifications.

> | Field | Value |
> |---|---|
> | Setter | `expansion(uint amount)` |
> | Gated by | `chair()` |
> | Tags | `SUPPLY` |
> | Last called | 2022-07-02 |
> | Called by | `0x8F97...DfC8` (Gnosis Safe 2/6) |
> | Total calls | 58 🔄 |

> **Recent changes (showing last 5 of 58):**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `amount=5200000000000000000000000 (5,200,000.000000e18)` | `0x8F97...DfC8` (Gnosis Safe 2/6) | 2022-07-02 |
> | 2 | `amount=5200000000000000000000000 (5,200,000.000000e18)` | `0x8F97...DfC8` (Gnosis Safe 2/6) | 2022-07-02 |
> | 3 | `amount=5200000000000000000000000 (5,200,000.000000e18)` | `0x8F97...DfC8` (Gnosis Safe 2/6) | 2022-07-02 |
> | 4 | `amount=5200000000000000000000000 (5,200,000.000000e18)` | `0x8F97...DfC8` (Gnosis Safe 2/6) | 2022-07-02 |
> | 5 | `amount=5200000000000000000000000 (5,200,000.000000e18)` | `0x8F97...DfC8` (Gnosis Safe 2/6) | 2022-07-02 |

---
<a id="c-0x2b34548b865ad66a2b046cb82e59ee43f75b90fd"></a>
## > Fed `0x2b34548b865ad66A2B046cb82e59eE43F75B90fd`

> > 💰 **Inherited supply authority** — holds `minter()` on **DOLA [ERC20]**. Access controls on this contract gate root token supply.

> 🔒 **Immutable References:** `dbr()` → DBR (DolaBorrowingRights), `dola()` → DOLA

### > 🟢 `chair()` · 🏛️ governance

> **Privileged write functions:**  
> **Capabilities:** 💰 **SUPPLY**
> - `resign()` — Set the address of the chair to the 0 address. Only callable by the chair. Useful for immediately removing chair powers in case of a wallet compromise.
> - `expansion(IMarket market, uint amount)` — Expand the amount of DOLA by depositing the amount into a specific market. While not immediately dangerous to the DOLA peg, make sure the market can absorb the new potential supply. Market must have a positive ceiling before expansion. `[SUPPLY]`
> - `contraction(IMarket market, uint amount)` — Contract the amount of DOLA by withdrawing some amount of DOLA from a market, before burning it. Markets can have more DOLA in them than they've been supplied, due to force replenishes. This call will revert if trying to contract more than have been supplied. `[SUPPLY]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x8F97cCA30Dbe80e7a8B462F1dD1a51C32accDfC8` | Gnosis Safe 2/6 | 🟢 LOW | — | Storage only | 2/6 signers |

> **Signers of `Gnosis Safe 2/6` (0x8F97...DfC8):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x2723723FDd3Db8ba2D6f0e1B333e90A7E60A0411` | EOA ⚠️ Hot wallet (1,619 txs) | 2023-03-17 | EOA |
> | `0x9F3614afb3Df9f899caDBFfaA05c6C908059F726` | EOA | 2022-10-08 | EOA |
> | `0x962228a90eaC69238c7D1F216d80037e61eA9255` | EOA ⚠️ Hot wallet (1,771 txs) | — | EOA |
> | `0x3FcB35a1CbFB6007f9BC638D388958Bc4550cB28` | EOA ⚠️ Hot wallet (1,451 txs) | — | EOA |
> | `0x6535020cCeB810Bdb3F3cA5e93dE2460FF7989BB` | EOA | 2025-12-11 | EOA |
> | `0x52f63971afD2a32524c859C29943f9BEa38CA907` | EOA | 2022-09-06 | EOA |

> **Quorum history:**
>   - 2024-10-28: 🟢 increased 2 → 4
>   - 2025-07-22: 🔴 decreased 4 → 2
>   - 2025-12-01: 🟢 increased 2 → 3
>   - 2025-12-10: 🔴 decreased 3 → 2

### > 🟢 `gov()` · 🏛️ governance

> **Privileged write functions:**  
> **Capabilities:** ⚙️ **CONFIG** 💰 **SUPPLY**
> - `changeGov(address _gov)` — Change the governance of the Fed contact. Only callable by governance. /
> - `changeSupplyCeiling(uint _supplyCeiling)` — Set the supply ceiling of the Fed. Only callable by governance. / `[SUPPLY]`
> - `changeMarketCeiling(IMarket _market, uint _ceiling)` — Set a market's isolated ceiling of the Fed. Only callable by governance. / `[SUPPLY]`
> - `changeChair(address _chair)` — Set the chair of the fed. Only callable by governance. / `[CONFIG]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x926dF14a23BE491164dCF93f4c468A50ef659D5B` | Compound Timelock (2d) | 🟢 LOW | — | Storage only | 2d delay |

> #### 🔧 Permissioned Parameters

> **`ceilings`** *(per-asset)* 🔄 **ACTIVE** (112 changes)

> > ⚠️ This parameter has been changed **112 times** — monitor for unexpected modifications.

> | Asset | Current Value |
> |---|---|
> | DAI market `0x0971...9b26` | `500000000000000000000 (500.000000e18)` |
> | PT-sUSDE-27MAR2025 market `0x0DFE...4112` | `0` |
> | st-yETH market `0x0c0b...D168` | `0` |
> | PT-sUSDE-27NOV2025 market `0x223f...Be68` | `50000000000000000000000000 (50,000,000.000000e18)` |
> | yvyCRV market `0x27b6...F9c4` | `400000000000000000000000 (400,000.000000e18)` |
> | yvCurve-DOLA-wstUSR-f market `0x2868...3537` | `5000000000000000000000000 (5,000,000.000000e18)` |
> | COMP market `0x29fe...93b8` | `0` |
> | cbBTC market `0x2A25...77FF` | `10000000000000000000000000 (10,000,000.000000e18)` |
> | PT-sUSDE-29MAY2025 market `0x2D47...FBD9` | `0` |
> | dola-save market `0x2fed...2FC9` | `50000000000000000000000000 (50,000,000.000000e18)` |
> | cvxCRV market `0x3474...397a` | `3000000000000000000000000 (3,000,000.000000e18)` |
> | DOLA/USR market `0x3Ac5...Fd5e` | `0` |
> | wstETH market `0x3FD3...50BC` | `50000000000000000000000000 (50,000,000.000000e18)` |
> | crvDOLA market `0x4797...5B26` | `0` |
> | WBTC market `0x48BA...4E7C` | `10000000000000000000000000 (10,000,000.000000e18)` |
> | yvCurve-DOLA-sUSDS-f market `0x4A33...808b` | `50000000000000000000000000 (50,000,000.000000e18)` |
> | yvCurve-DOLA-sUSDe-f market `0x4E26...db1a` | `20000000000000000000000000 (20,000,000.000000e18)` |
> | yvCurve-DOLA-deUSD-f market `0x4f5e...C08e` | `0` |
> | yvCurve-DOLA-scrvUSD-f market `0x5bb8...1CF2` | `50000000000000000000000000 (50,000,000.000000e18)` |
> | PT-sUSDE-25SEP2025 market `0x6073...dcc5` | `0` |
> | savedola market `0x63D2...37E8` | `0` |
> | WETH market `0x63Df...7035` | `10000000000000000000000000 (10,000,000.000000e18)` |
> | CRV market `0x63fA...1Ee8` | `3000000000000000000000000 (3,000,000.000000e18)` |
> | crvUSDDOLA-f market `0x6A52...631E` | `60000000000000000000000 (60,000.000000e18)` |
> | stETH market `0x743A...1dCf` | `0` |
> | sUSDe market `0x79eF...AEc4` | `5000000000000000000000000 (5,000,000.000000e18)` |
> | gOHM market `0x7Cd3...6b37` | `0` |
> | yvCurve-DOLA-FRXBP-f market `0x8205...C0e3` | `0` |
> | DOLAFRAXBP3CRV-f market `0x87df...72Ea` | `0` |
> | cvxFXS market `0x9368...B31b` | `0` |
> | deUSD/DOLA market `0xB907...8f9a` | `0` |
> | yvCurve-DOLA-USR-f market `0xC008...8cCF` | `0` |
> | DOLA-sUSDS market `0xD68d...4b29` | `50000000000000000000000000 (50,000,000.000000e18)` |
> | PT-USDe-27NOV2025 market `0xF706...b11f` | `50000000000000000000000000 (50,000,000.000000e18)` |
> | sFRAX market `0xFEA3...54f1` | `0` |
> | DOLA-sUSDe market `0xb427...4A99` | `80000000000000000000000000 (80,000,000.000000e18)` |
> | INV market `0xb516...330B` | `0` |
> | PT-USDe-25SEP2025 market `0xb686...C867` | `0` |
> | yvCurve-sDOLA-scrvUSD-f market `0xb8bc...D565` | `0` |
> | CVX market `0xdc22...dF6b` | `3000000000000000000000000 (3,000,000.000000e18)` |
> | DOLAwstUSR market `0xe4D4...12E4` | `25000000000000000000000000 (25,000,000.000000e18)` |
> | yvCurve-DOLA-crvUSD-f market `0xe859...C99C` | `0` |
> | yvCurve-DOLA-FRAXPYUSD-f market `0xf013...c4f5` | `0` |
> | PT-sUSDE-31JUL2025 market `0xf85e...2db2` | `0` |

> | Field | Value |
> |---|---|
> | Setter | `changeMarketCeiling(IMarket _market, uint _ceiling)` |
> | Gated by | `gov()` |
> | Tags | `SUPPLY` |
> | Last changed | 2026-06-24 |
> | Changed by | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) |
> | Total changes | 112 🔄 |

> **Recent changes (showing last 5 of 112):**

> | # | Asset | Value | Set By | Date |
> |---|---|---|---|---|
> | 1 | INV market | `_ceiling=0` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2026-06-24 |
> | 2 | yvCurve-DOLA-wstUSR-f market | `_ceiling=5000000000000000000000000 (5,000,000.000000e18)` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2026-03-25 |
> | 3 | DOLAwstUSR market | `_ceiling=25000000000000000000000000 (25,000,000.000000e18)` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2026-03-25 |
> | 4 | yvCurve-sDOLA-scrvUSD-f market | `_ceiling=0` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2026-02-18 |
> | 5 | savedola market | `_ceiling=0` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2026-02-18 |

> **`chair`**

> | Field | Value |
> |---|---|
> | Current Value | `0x8F97cCA30Dbe80e7a8B462F1dD1a51C32accDfC8` |
> | Setter | `changeChair(address _chair)` |
> | Gated by | `gov()` |
> | Tags | `CONFIG` |
> | Last changed | 2024-02-14 |
> | Changed by | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) |
> | Total changes | 2 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `_chair=0x8F97cCA30Dbe80e7a8B462F1dD1a51C32accDfC8` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2024-02-14 |
> | 2 | `_chair=0x926dF14a23BE491164dCF93f4c468A50ef659D5B` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2024-02-14 |

> **`gov`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)* 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `0x926dF14a23BE491164dCF93f4c468A50ef659D5B` |
> | Setter | `changeGov(address _gov)` |
> | Gated by | `gov()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`supplyCeiling`** 🔄 **ACTIVE** (18 changes)

> > ⚠️ This parameter has been changed **18 times** — monitor for unexpected modifications.

> | Field | Value |
> |---|---|
> | Current Value | `100000000000000000000000000000 (100,000,000,000.000000e18)` |
> | Setter | `changeSupplyCeiling(uint _supplyCeiling)` |
> | Gated by | `gov()` |
> | Tags | `SUPPLY` |
> | Last changed | 2025-11-21 |
> | Changed by | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) |
> | Total changes | 18 🔄 |

> **Recent changes (showing last 6 of 18):**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `_supplyCeiling=100000000000000000000000000000 (100,000,000,000.000000e18)` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2025-11-21 |
> | 2 | `_supplyCeiling=200000000000000000000000000 (200,000,000.000000e18)` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2025-01-02 |
> | 3 | `_supplyCeiling=120000000000000000000000000 (120,000,000.000000e18)` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2024-11-05 |
> | 4 | `_supplyCeiling=100000000000000000000000000 (100,000,000.000000e18)` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2024-07-29 |
> | 5 | `_supplyCeiling=50000000000000000000000000 (50,000,000.000000e18)` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2024-07-20 |
> | 6 | `500000000000000000000000` | `constructor` | 2022-12-11 |

> #### 💰 Supply Actions

> _Mint / redeem / burn call tracking — last 5 calls per function, total counts preserved._

> **`contraction`** 🔄 **ACTIVE** (177 changes)

> > ⚠️ This parameter has been changed **177 times** — monitor for unexpected modifications.

> | Field | Value |
> |---|---|
> | Setter | `contraction(IMarket market, uint amount)` |
> | Gated by | `chair()` |
> | Tags | `SUPPLY` |
> | Last called | 2026-06-11 |
> | Called by | `0x8F97...DfC8` (Gnosis Safe 2/6) |
> | Total calls | 177 🔄 |

> **Recent changes (showing last 5 of 177):**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `market=0xb516247596Ca36bf32876199FBdCaD6B3322330B · amount=120000000000000000000000 (120,000.000000e18)` | `0x8F97...DfC8` (Gnosis Safe 2/6) | 2026-06-11 |
> | 2 | `120000000000000000000000 (120,000.000000e18)` | `0xb516...330B` | 2026-06-11 |
> | 3 | `market=0xb516247596Ca36bf32876199FBdCaD6B3322330B · amount=90000000000000000000000 (90,000.000000e18)` | `0x8F97...DfC8` (Gnosis Safe 2/6) | 2026-04-22 |
> | 4 | `market=0xb516247596Ca36bf32876199FBdCaD6B3322330B · amount=90000000000000000000000 (90,000.000000e18)` | `0x8F97...DfC8` (Gnosis Safe 2/6) | 2026-04-22 |
> | 5 | `market=0xb516247596Ca36bf32876199FBdCaD6B3322330B · amount=90000000000000000000000 (90,000.000000e18)` | `0x8F97...DfC8` (Gnosis Safe 2/6) | 2026-04-22 |

> **`expansion`** 🔄 **ACTIVE** (292 changes)

> > ⚠️ This parameter has been changed **292 times** — monitor for unexpected modifications.

> | Field | Value |
> |---|---|
> | Setter | `expansion(IMarket market, uint amount)` |
> | Gated by | `chair()` |
> | Tags | `SUPPLY` |
> | Last called | 2026-05-20 |
> | Called by | `0x8F97...DfC8` (Gnosis Safe 2/6) |
> | Total calls | 292 🔄 |

> **Recent changes (showing last 5 of 292):**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `market=0x4E264618dC015219CD83dbc53B31251D73c2db1a · amount=1500000000000000000000000 (1,500,000.000000e18)` | `0x8F97...DfC8` (Gnosis Safe 2/6) | 2026-05-20 |
> | 2 | `market=0xb427fC22561f3963B04202F9bb5BCEbd76c14A99 · amount=8000000000000000000000000 (8,000,000.000000e18)` | `0x8F97...DfC8` (Gnosis Safe 2/6) | 2026-05-20 |
> | 3 | `market=0x4E264618dC015219CD83dbc53B31251D73c2db1a · amount=1500000000000000000000000 (1,500,000.000000e18)` | `0x8F97...DfC8` (Gnosis Safe 2/6) | 2026-05-20 |
> | 4 | `market=0xb427fC22561f3963B04202F9bb5BCEbd76c14A99 · amount=8000000000000000000000000 (8,000,000.000000e18)` | `0x8F97...DfC8` (Gnosis Safe 2/6) | 2026-05-20 |
> | 5 | `market=0x4E264618dC015219CD83dbc53B31251D73c2db1a · amount=1500000000000000000000000 (1,500,000.000000e18)` | `0x8F97...DfC8` (Gnosis Safe 2/6) | 2026-05-20 |

---
<a id="c-0x67fc21332d24fc5250a3b7fc988191ad7f38f9cc"></a>
## > PSMFed `0x67FC21332D24FC5250a3B7fc988191ad7F38f9cC`

> > 💰 **Inherited supply authority** — holds `minter()` on **DOLA [ERC20]**. Access controls on this contract gate root token supply.

> 🔒 **Immutable References:** `DOLA()` → DOLA, `psm()` → PSM

### > 🟢 `chair()` · 🏛️ governance

> **Privileged write functions:**  
> **Capabilities:** 💰 **SUPPLY**
> - `expansion(uint256 amount)` — Allows the chair to expand the supply of DOLA in the PSM. This function increases the supply of DOLA in the PSM and mints `[SUPPLY]`
> - `contraction(uint256 amount)` — Allows the chair to contract the supply of DOLA in the PSM. This function reduces the supply of DOLA in the PSM and burns the `[SUPPLY]`
> - `resign()` — Allows the current chair to resign. The chair can resign, leaving the chair address as zero.

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x8F97cCA30Dbe80e7a8B462F1dD1a51C32accDfC8` | Gnosis Safe 2/6 | 🟢 LOW | — | Storage only | 2/6 signers |

> **Signers of `Gnosis Safe 2/6` (0x8F97...DfC8):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x2723723FDd3Db8ba2D6f0e1B333e90A7E60A0411` | EOA ⚠️ Hot wallet (1,619 txs) | 2023-03-17 | EOA |
> | `0x9F3614afb3Df9f899caDBFfaA05c6C908059F726` | EOA | 2022-10-08 | EOA |
> | `0x962228a90eaC69238c7D1F216d80037e61eA9255` | EOA ⚠️ Hot wallet (1,771 txs) | — | EOA |
> | `0x3FcB35a1CbFB6007f9BC638D388958Bc4550cB28` | EOA ⚠️ Hot wallet (1,451 txs) | — | EOA |
> | `0x6535020cCeB810Bdb3F3cA5e93dE2460FF7989BB` | EOA | 2025-12-11 | EOA |
> | `0x52f63971afD2a32524c859C29943f9BEa38CA907` | EOA | 2022-09-06 | EOA |

> **Quorum history:**
>   - 2024-10-28: 🟢 increased 2 → 4
>   - 2025-07-22: 🔴 decreased 4 → 2
>   - 2025-12-01: 🟢 increased 2 → 3
>   - 2025-12-10: 🔴 decreased 3 → 2

### > 🟢 `gov()` · 🏛️ governance

> **Privileged write functions:**  
> **Capabilities:** 💰 **SUPPLY**
> - `setSupplyCap(uint256 newSupplyCap)` — Allows governance to set a new supply cap. / `[SUPPLY]`
> - `setChair(address newChair)` — Allows governance to set a new chair. The new chair must not be the zero address.
> - `setPendingGov(address _pendingGov)` — Allows governance to set a new pending governance. The pending governance must accept the role.

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x926dF14a23BE491164dCF93f4c468A50ef659D5B` | Compound Timelock (2d) | 🟢 LOW | — | Storage only | 2d delay |

> #### 🔧 Permissioned Parameters

> **`chair`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)*

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `0x8F97cCA30Dbe80e7a8B462F1dD1a51C32accDfC8` |
> | Setter | `setChair(address newChair)` |
> | Gated by | `gov()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`pendingGov`** ❄️ **DORMANT**

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `0x0000000000000000000000000000000000000000` |
> | Setter | `setPendingGov(address _pendingGov)` |
> | Gated by | `gov()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`supplyCap`** 🔄 **ACTIVE** (6 changes)

> > ⚠️ This parameter has been changed **6 times** — monitor for unexpected modifications.

> | Field | Value |
> |---|---|
> | Current Value | `10000000000000000000000000 (10,000,000.000000e18)` |
> | Setter | `setSupplyCap(uint256 newSupplyCap)` |
> | Gated by | `gov()` |
> | Tags | `SUPPLY` |
> | Last changed | 2025-12-20 |
> | Changed by | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) |
> | Total changes | 6 🔄 |

> **Recent changes (showing last 5 of 6):**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `newSupplyCap=10000000000000000000000000 (10,000,000.000000e18)` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2025-12-20 |
> | 2 | `newSupplyCap=10000000000000000000000000 (10,000,000.000000e18)` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2025-12-20 |
> | 3 | `newSupplyCap=10000000000000000000000000 (10,000,000.000000e18)` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2025-12-20 |
> | 4 | `newSupplyCap=10000000000000000000000000 (10,000,000.000000e18)` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2025-12-20 |
> | 5 | `newSupplyCap=10000000000000000000000000 (10,000,000.000000e18)` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2025-12-20 |

> #### 💰 Supply Actions

> _Mint / redeem / burn call tracking — last 5 calls per function, total counts preserved._

> **`contraction`** 🔄 **ACTIVE** (6 changes)

> > ⚠️ This parameter has been changed **6 times** — monitor for unexpected modifications.

> | Field | Value |
> |---|---|
> | Setter | `contraction(uint256 amount)` |
> | Gated by | `chair()` |
> | Tags | `SUPPLY` |
> | Last called | 2026-03-24 |
> | Called by | `0x8F97...DfC8` (Gnosis Safe 2/6) |
> | Total calls | 6 🔄 |

> **Recent changes (showing last 5 of 6):**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `amount=200000000000000000000000 (200,000.000000e18)` | `0x8F97...DfC8` (Gnosis Safe 2/6) | 2026-03-24 |
> | 2 | `amount=200000000000000000000000 (200,000.000000e18)` | `0x8F97...DfC8` (Gnosis Safe 2/6) | 2026-03-24 |
> | 3 | `amount=200000000000000000000000 (200,000.000000e18)` | `0x8F97...DfC8` (Gnosis Safe 2/6) | 2026-03-24 |
> | 4 | `amount=200000000000000000000000 (200,000.000000e18)` | `0x8F97...DfC8` (Gnosis Safe 2/6) | 2026-03-24 |
> | 5 | `amount=200000000000000000000000 (200,000.000000e18)` | `0x8F97...DfC8` (Gnosis Safe 2/6) | 2026-03-24 |

> **`expansion`** 🔄 **ACTIVE** (7 changes)

> > ⚠️ This parameter has been changed **7 times** — monitor for unexpected modifications.

> | Field | Value |
> |---|---|
> | Setter | `expansion(uint256 amount)` |
> | Gated by | `chair()` |
> | Tags | `SUPPLY` |
> | Last called | 2026-04-13 |
> | Called by | `0x8F97...DfC8` (Gnosis Safe 2/6) |
> | Total calls | 7 🔄 |

> **Recent changes (showing last 5 of 7):**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `amount=200000000000000000000000 (200,000.000000e18)` | `0x8F97...DfC8` (Gnosis Safe 2/6) | 2026-04-13 |
> | 2 | `amount=200000000000000000000000 (200,000.000000e18)` | `0x8F97...DfC8` (Gnosis Safe 2/6) | 2026-04-13 |
> | 3 | `amount=200000000000000000000000 (200,000.000000e18)` | `0x8F97...DfC8` (Gnosis Safe 2/6) | 2026-04-13 |
> | 4 | `amount=200000000000000000000000 (200,000.000000e18)` | `0x8F97...DfC8` (Gnosis Safe 2/6) | 2026-04-13 |
> | 5 | `amount=200000000000000000000000 (200,000.000000e18)` | `0x8F97...DfC8` (Gnosis Safe 2/6) | 2026-04-13 |

---
<a id="c-0x6c5fdc0c53b122ae0f15a863c349f3a481de8f1f"></a>
## > MainnetDolaFlashMinter `0x6C5Fdc0c53b122Ae0f15a863C349f3A481DE8f1F`

> > 💰 **Inherited supply authority** — holds `minter()` on **DOLA [ERC20]**. Access controls on this contract gate root token supply.

> 🔒 **Immutable References:** `dola()` → DOLA

### > 🟢 `owner()`

> **Privileged write functions:**  
> **Capabilities:** ⚙️ **CONFIG**
> - `setTreasury(address _newTreasury)` `[CONFIG]`
> - `setMaxFlashLimit(uint256 _newLimit)`
> - `renounceOwnership()` — Leaves the contract without owner. It will not be possible to call `onlyOwner` functions anymore. Can only be called by the current owner.
> - `transferOwnership(address newOwner)` — Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner.

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x926dF14a23BE491164dCF93f4c468A50ef659D5B` | Compound Timelock (2d) | 🟢 LOW | — | Storage+Events | 2d delay |

### > 🟢 `treasury()` · 📋 operational


> **Members (1):**

> | Address | Name / Type | Granted | Source | Details |
> |---|---|---|---|---|
> | `0x926dF14a23BE491164dCF93f4c468A50ef659D5B` | Compound Timelock (2d) | — | Storage only | 2d delay |

> #### 🔧 Permissioned Parameters

> **`maxFlashLimit`** 🔄 **ACTIVE** (6 changes)

> > ⚠️ This parameter has been changed **6 times** — monitor for unexpected modifications.

> | Field | Value |
> |---|---|
> | Current Value | `5000000000000000000000000 (5,000,000.000000e18)` |
> | Setter | `setMaxFlashLimit(uint256 _newLimit)` |
> | Gated by | `owner()` |
> | Tags | — |
> | Last changed | 2024-09-11 |
> | Changed by | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) |
> | Total changes | 6 🔄 |

> **Recent changes (showing last 5 of 6):**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `_newLimit=5000000000000000000000000 (5,000,000.000000e18)` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2024-09-11 |
> | 2 | `_newLimit=5000000000000000000000000 (5,000,000.000000e18)` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2024-09-11 |
> | 3 | `_newLimit=5000000000000000000000000 (5,000,000.000000e18)` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2024-09-11 |
> | 4 | `_newLimit=5000000000000000000000000 (5,000,000.000000e18)` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2024-09-11 |
> | 5 | `_newLimit=5000000000000000000000000 (5,000,000.000000e18)` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2024-09-11 |

> **`treasury`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)*

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `0x926dF14a23BE491164dCF93f4c468A50ef659D5B` |
> | Setter | `setTreasury(address _newTreasury)` |
> | Gated by | `owner()` |
> | Tags | `CONFIG` |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

---
<a id="c-0xe082eb109fad53ea8db9827ce6b8ef74882734fc"></a>
## > VaultFed `0xe082EB109fAd53eA8DB9827ce6b8ef74882734fc`

> > 💰 **Inherited supply authority** — holds `minter()` on **DOLA [ERC20]**. Access controls on this contract gate root token supply.

> 🔒 **Immutable References:** `vault()` → dDOLAV3 (PoolV3), `dola()` → DOLA

### > 🟢 `chair()` · 🏛️ governance

> **Privileged write functions:**  
> **Capabilities:** 💰 **SUPPLY**
> - `resign()`
> - `expansion(uint amount)` — (auto) Mint tokens into a lending market (Fed operation) `[SUPPLY]`
> - `contraction(uint amount)` — (auto) Withdraw and burn tokens from a lending market (Fed operation) `[SUPPLY]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x8F97cCA30Dbe80e7a8B462F1dD1a51C32accDfC8` | Gnosis Safe 2/6 | 🟢 LOW | — | Storage only | 2/6 signers |

> **Signers of `Gnosis Safe 2/6` (0x8F97...DfC8):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x2723723FDd3Db8ba2D6f0e1B333e90A7E60A0411` | EOA ⚠️ Hot wallet (1,619 txs) | 2023-03-17 | EOA |
> | `0x9F3614afb3Df9f899caDBFfaA05c6C908059F726` | EOA | 2022-10-08 | EOA |
> | `0x962228a90eaC69238c7D1F216d80037e61eA9255` | EOA ⚠️ Hot wallet (1,771 txs) | — | EOA |
> | `0x3FcB35a1CbFB6007f9BC638D388958Bc4550cB28` | EOA ⚠️ Hot wallet (1,451 txs) | — | EOA |
> | `0x6535020cCeB810Bdb3F3cA5e93dE2460FF7989BB` | EOA | 2025-12-11 | EOA |
> | `0x52f63971afD2a32524c859C29943f9BEa38CA907` | EOA | 2022-09-06 | EOA |

> **Quorum history:**
>   - 2024-10-28: 🟢 increased 2 → 4
>   - 2025-07-22: 🔴 decreased 4 → 2
>   - 2025-12-01: 🟢 increased 2 → 3
>   - 2025-12-10: 🔴 decreased 3 → 2

### > 🟢 `gov()` · 🏛️ governance

> **Privileged write functions:**  
> **Capabilities:** 💰 **SUPPLY**
> - `setPendingGov(address _pendingGov)`
> - `setChair(address newChair)`
> - `setSupplyCap(uint newSupplyCap)` — (auto) Set the maximum total supply cap `[SUPPLY]`
> - `resign()`
> - `expansion(uint amount)` — (auto) Mint tokens into a lending market (Fed operation) `[SUPPLY]`
> - `contraction(uint amount)` — (auto) Withdraw and burn tokens from a lending market (Fed operation) `[SUPPLY]`
> - `sweep(address token)`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x926dF14a23BE491164dCF93f4c468A50ef659D5B` | Compound Timelock (2d) | 🟢 LOW | — | Storage only | 2d delay |

> #### 🔧 Permissioned Parameters

> **`chair`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)*

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `0x8F97cCA30Dbe80e7a8B462F1dD1a51C32accDfC8` |
> | Setter | `setChair(address newChair)` |
> | Gated by | `gov()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`pendingGov`** ❄️ **DORMANT**

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `0x0000000000000000000000000000000000000000` |
> | Setter | `setPendingGov(address _pendingGov)` |
> | Gated by | `gov()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`supplyCap`** 🔄 **ACTIVE** (6 changes)

> > ⚠️ This parameter has been changed **6 times** — monitor for unexpected modifications.

> | Field | Value |
> |---|---|
> | Current Value | `3000000000000000000000000 (3,000,000.000000e18)` |
> | Setter | `setSupplyCap(uint newSupplyCap)` |
> | Gated by | `gov()` |
> | Tags | `SUPPLY` |
> | Last changed | 2025-03-04 |
> | Changed by | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) |
> | Total changes | 6 🔄 |

> **Recent changes (showing last 5 of 6):**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `newSupplyCap=3000000000000000000000000 (3,000,000.000000e18)` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2025-03-04 |
> | 2 | `newSupplyCap=3000000000000000000000000 (3,000,000.000000e18)` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2025-03-04 |
> | 3 | `newSupplyCap=3000000000000000000000000 (3,000,000.000000e18)` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2025-03-04 |
> | 4 | `newSupplyCap=3000000000000000000000000 (3,000,000.000000e18)` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2025-03-04 |
> | 5 | `newSupplyCap=3000000000000000000000000 (3,000,000.000000e18)` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2025-03-04 |

> #### 💰 Supply Actions

> _Mint / redeem / burn call tracking — last 5 calls per function, total counts preserved._

> **`contraction`** 🔄 **ACTIVE** (22 changes)

> > ⚠️ This parameter has been changed **22 times** — monitor for unexpected modifications.

> | Field | Value |
> |---|---|
> | Setter | `contraction(uint amount)` |
> | Gated by | `gov(), chair()` |
> | Tags | `SUPPLY` |
> | Last called | 2025-10-31 |
> | Called by | `0x8F97...DfC8` (Gnosis Safe 2/6) |
> | Total calls | 22 🔄 |

> **Recent changes (showing last 5 of 22):**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `amount=55000000000000000000000 (55,000.000000e18)` | `0x8F97...DfC8` (Gnosis Safe 2/6) | 2025-10-31 |
> | 2 | `amount=55000000000000000000000 (55,000.000000e18)` | `0x8F97...DfC8` (Gnosis Safe 2/6) | 2025-10-31 |
> | 3 | `amount=55000000000000000000000 (55,000.000000e18)` | `0x8F97...DfC8` (Gnosis Safe 2/6) | 2025-10-31 |
> | 4 | `amount=55000000000000000000000 (55,000.000000e18)` | `0x8F97...DfC8` (Gnosis Safe 2/6) | 2025-10-31 |
> | 5 | `amount=55000000000000000000000 (55,000.000000e18)` | `0x8F97...DfC8` (Gnosis Safe 2/6) | 2025-10-31 |

> **`expansion`** 🔄 **ACTIVE** (8 changes)

> > ⚠️ This parameter has been changed **8 times** — monitor for unexpected modifications.

> | Field | Value |
> |---|---|
> | Setter | `expansion(uint amount)` |
> | Gated by | `gov(), chair()` |
> | Tags | `SUPPLY` |
> | Last called | 2025-03-19 |
> | Called by | `0x8F97...DfC8` (Gnosis Safe 2/6) |
> | Total calls | 8 🔄 |

> **Recent changes (showing last 5 of 8):**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `amount=1000000000000000000000000 (1,000,000.000000e18)` | `0x8F97...DfC8` (Gnosis Safe 2/6) | 2025-03-19 |
> | 2 | `amount=1000000000000000000000000 (1,000,000.000000e18)` | `0x8F97...DfC8` (Gnosis Safe 2/6) | 2025-03-19 |
> | 3 | `amount=1000000000000000000000000 (1,000,000.000000e18)` | `0x8F97...DfC8` (Gnosis Safe 2/6) | 2025-03-19 |
> | 4 | `amount=1000000000000000000000000 (1,000,000.000000e18)` | `0x8F97...DfC8` (Gnosis Safe 2/6) | 2025-03-19 |
> | 5 | `amount=1000000000000000000000000 (1,000,000.000000e18)` | `0x8F97...DfC8` (Gnosis Safe 2/6) | 2025-03-19 |

---
<a id="c-0x926df14a23be491164dcf93f4c468a50ef659d5b"></a>
## > Timelock `0x926dF14a23BE491164dCF93f4c468A50ef659D5B`

> > 💰 **Inherited supply authority** — holds `operator()` on **DOLA [ERC20]**. Access controls on this contract gate root token supply.

### > 🟢 `admin()`

> **Privileged write functions:**
> - `queueTransaction(address target, uint value, string memory signature, bytes memory data, uint eta)`
> - `cancelTransaction(address target, uint value, string memory signature, bytes memory data, uint eta)`
> - `executeTransaction(address target, uint value, string memory signature, bytes memory data, uint eta)`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xBeCCB6bb0aa4ab551966A7E4B97cec74bb359Bf6` | GovernorMills + Timelock (2d) | 🟢 LOW | — | Storage+Events | 2d delay |

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
> | Current Value | `172800` |
> | Mutability | 🔒 immutable (constant) |
> | Tags | `IMMUTABLE` |

---
<a id="c-0xbeccb6bb0aa4ab551966a7e4b97cec74bb359bf6"></a>
## > GovernorMills `0xBeCCB6bb0aa4ab551966A7E4B97cec74bb359Bf6`

> > 💰 **Inherited supply authority** — holds `operator()` on **DOLA [ERC20]**. Access controls on this contract gate root token supply.

> 🔒 **Immutable References:** `xinv()` → XINV (XINV), `inv()` → INV (INV)

### > 🟠 `guardian()` · 🏛️ governance

> **Privileged write functions:**
> - `setGuardian(address _newGuardian)`
> - `__queueSetTimelockPendingAdmin(address newPendingAdmin, uint256 eta)` — Add new pending admin to queue /
> - `__executeSetTimelockPendingAdmin(address newPendingAdmin, uint256 eta)`
> - `cancel(uint proposalId)`
> - `updateProposalThreshold(uint256 newThreshold)` — Update the threshold value required to create a new proposal. /
> - `updateProposalQuorum(uint256 newQuorum)` — Update the quorum value required to pass a proposal. /
> - `acceptAdmin()`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x941c2699eC7E55a50Bde030d8E1e70649839259D` | Guardian | 🟠 HIGH | — | Storage only |  |

### > 🟢 `timelock()` · 🏛️ governance

> **Privileged write functions:**
> - `queue(uint proposalId)`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x926dF14a23BE491164dCF93f4c468A50ef659D5B` | Compound Timelock (2d) | 🟢 LOW | — | Storage only | 2d delay |

> #### 🔧 Permissioned Parameters

> **`guardian`**

> | Field | Value |
> |---|---|
> | Current Value | `0x941c2699eC7E55a50Bde030d8E1e70649839259D` |
> | Setter | `setGuardian(address _newGuardian)` |
> | Gated by | `guardian()` |
> | Tags | — |
> | Last changed | 2023-11-10 |
> | Changed by | `0x3FcB...cB28` (EOA) |
> | Total changes | 1 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `0x941c2699eC7E55a50Bde030d8E1e70649839259D` | `0x3FcB...cB28` (EOA) | 2023-11-10 |

> **`proposalThreshold`** 🔄 **ACTIVE** (7 changes)

> > ⚠️ This parameter has been changed **7 times** — monitor for unexpected modifications.

> | Field | Value |
> |---|---|
> | Current Value | `1900000000000000000000 (1,900.000000e18)` |
> | Setter | `updateProposalThreshold(uint256 newThreshold)` |
> | Gated by | `guardian()` |
> | Tags | — |
> | Last changed | 2022-10-03 |
> | Changed by | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) |
> | Total changes | 7 🔄 |

> **Recent changes (showing last 5 of 7):**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `newThreshold=1900000000000000000000 (1,900.000000e18)` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2022-10-03 |
> | 2 | `newThreshold=1900000000000000000000 (1,900.000000e18)` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2022-10-03 |
> | 3 | `newThreshold=1900000000000000000000 (1,900.000000e18)` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2022-10-03 |
> | 4 | `newThreshold=1900000000000000000000 (1,900.000000e18)` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2022-10-03 |
> | 5 | `newThreshold=1900000000000000000000 (1,900.000000e18)` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2022-10-03 |

---
<a id="c-0x941c2699ec7e55a50bde030d8e1e70649839259d"></a>
## > Guardian `0x941c2699eC7E55a50Bde030d8E1e70649839259D`

> > 💰 **Inherited supply authority** — holds `operator()` on **DOLA [ERC20]**. Access controls on this contract gate root token supply.

> 🔒 **Immutable References:** `governorMills()` → GovernorMills + Timelock (2d)

### > 🔴 `deployer()`

> **Privileged write functions:**
> - `allowCancel(uint proposalId, bool decision)`
> - `setPendingDeployer(address _deployer)`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x3FcB35a1CbFB6007f9BC638D388958Bc4550cB28` | EOA | 🔴 CRITICAL | — | Storage only | ⚠️ Single private key |

### > 🟢 `rwg()`

> **Privileged write functions:**
> - `executeCancel(uint proposalId)`
> - `setPendingRwg(address _rwg)`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x4b6c63E6a94ef26E2dF60b89372db2d8e211F1B7` | Gnosis Safe 4/7 | 🟢 LOW | — | Storage only | 4/7 signers |

> **Signers of `Gnosis Safe 4/7` (0x4b6c...F1B7):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x52f63971afD2a32524c859C29943f9BEa38CA907` | EOA | 2022-09-12 | EOA |
> | `0x7efe8e14eCfcB3FF349253A9925A8818A8Ce5480` | EOA | 2026-02-12 | EOA |
> | `0x3FcB35a1CbFB6007f9BC638D388958Bc4550cB28` | EOA ⚠️ Hot wallet (1,451 txs) | — | EOA |
> | `0x962228a90eaC69238c7D1F216d80037e61eA9255` | EOA ⚠️ Hot wallet (1,771 txs) | — | EOA |
> | `0x9F3614afb3Df9f899caDBFfaA05c6C908059F726` | EOA | 2022-06-08 | EOA |
> | `0x6535020cCeB810Bdb3F3cA5e93dE2460FF7989BB` | EOA | — | EOA |
> | `0x2723723FDd3Db8ba2D6f0e1B333e90A7E60A0411` | EOA ⚠️ Hot wallet (1,619 txs) | 2022-07-02 | EOA |

> **Quorum history:**
>   - 2023-11-29: ⚪ unchanged 4 → 4

> #### 🔧 Permissioned Parameters

> **`pendingDeployer`** ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `0x0000000000000000000000000000000000000000` |
> | Setter | `setPendingDeployer(address _deployer)` |
> | Gated by | `deployer()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`pendingRwg`** ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `0x0000000000000000000000000000000000000000` |
> | Setter | `setPendingRwg(address _rwg)` |
> | Gated by | `rwg()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

---
## ⚡ Authority Concentration

The following addresses hold permissions across multiple contracts or roles in this dependency stack. Concentration of authority increases systemic risk — a single compromised key or colluding multisig can affect multiple systems.

### 🟢 `0x926dF14a23BE491164dCF93f4c468A50ef659D5B` — Compound Timelock (2d)
Controls **7 role(s)** across **7 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| DOLA [ERC20] `0x8653...9ce4` | `operator()` | `setPendingOperator(address newOperator_)`, `addMinter(address minter_)`, `removeMinter(address minter_)`, `mint(address to, uint amount)` +1 more | — |
| Fed `0x5E07...7EF7` | `gov()` | `changeGov(address newGov_)`, `changeChair(address newChair_)` | — |
| Fed `0x2b34...90fd` | `gov()` | `changeGov(address _gov)`, `changeSupplyCeiling(uint _supplyCeiling)`, `changeMarketCeiling(IMarket _market, uint _ceiling)`, `changeChair(address _chair)` | — |
| PSMFed `0x67FC...f9cC` | `gov()` | `setSupplyCap(uint256 newSupplyCap)`, `setChair(address newChair)`, `setPendingGov(address _pendingGov)` | — |
| MainnetDolaFlashMinter `0x6C5F...8f1F` | `owner()` | `setTreasury(address _newTreasury)`, `setMaxFlashLimit(uint256 _newLimit)`, `renounceOwnership()`, `transferOwnership(address newOwner)` | — |
| VaultFed `0xe082...34fc` | `gov()` | `setPendingGov(address _pendingGov)`, `setChair(address newChair)`, `setSupplyCap(uint newSupplyCap)`, `resign()` +3 more | — |
| GovernorMills `0xBeCC...9Bf6` | `timelock()` | `queue(uint proposalId)` | — |

### 🟢 `0x8F97cCA30Dbe80e7a8B462F1dD1a51C32accDfC8` — Gnosis Safe 2/6
Controls **4 role(s)** across **4 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| Fed `0x5E07...7EF7` | `chair()` | `resign()`, `expansion(uint amount)`, `contraction(uint amount)` | — |
| Fed `0x2b34...90fd` | `chair()` | `resign()`, `expansion(IMarket market, uint amount)`, `contraction(IMarket market, uint amount)` | — |
| PSMFed `0x67FC...f9cC` | `chair()` | `expansion(uint256 amount)`, `contraction(uint256 amount)`, `resign()` | — |
| VaultFed `0xe082...34fc` | `chair()` | `resign()`, `expansion(uint amount)`, `contraction(uint amount)` | — |


---
## ⛔ Sanctions Screening

| Source | Status |
|---|---|
| OFAC SDN | ✅ OFAC SDN screened (97 ETH addresses, cache: 2026-06-25) |
| Chainalysis | ✅ Chainalysis screened |
| **Result** | 25 addresses screened · ✅ 0 flagged |

---
## EOA Exposure Summary

The following roles are held by EOAs:

- **Guardian** → `deployer()` held by EOA `0x3FcB35a1CbFB6007f9BC638D388958Bc4550cB28`
  Functions: `allowCancel(uint proposalId, bool decision)`, `setPendingDeployer(address _deployer)`

---
## ✅ Scan Integrity

No issues detected. All block ranges covered, source and ABI resolved for all contracts.
