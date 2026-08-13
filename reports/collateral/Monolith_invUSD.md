# Trustfall — Access Control Report — invUSD Stablecoin (invUSD)

| Field | Value |
|---|---|
| Contract | `0x5377680B5986296AA4F9e684e5315a4F24832e56` |
| Token | invUSD Stablecoin (invUSD) |
| Name | Coin |
| Chain | Ethereum |
| Proxy Status | ✅ No |
| OZ AccessControl | ❌ No |
| Ownable | ❌ No |
| Pausable | — |
| ERC-4626 Vault | — |
| Control Surface | ⚠️ Hybrid — 1 off-chain dependency (governance) |
| Scan Integrity | ✅ No issues detected |
| Report Date | 2026-08-13 03:24 UTC |

### Surface Summary

| Field | Value |
|---|---:|
| Contracts | 12 |
| Role slots | 35 |
| Privileged Fns | 39 |
| EOA Holders | 1 ⚠️ |
| Critical Roles | 1 ⚠️ |

## Changes Since Last Scan

> Comparing **2026-08-13T03:10:26Z** (block 25743307) → **2026-08-13T03:23:43Z** (block 25743374).

> ✅ No changes to roles, parameters, contracts, or findings.


## 📋 Protocol Context

> *From protocol profile: Monolith (Inverse Finance sister protocol) / Monolith_invUSD (Stablecoin)*

<details>
<summary><strong>Architecture</strong></summary>

- **What invUSD is:** a CDP stablecoin issued by Monolith, a permissionless stablecoin-as-a-service factory spun out of Inverse Finance. Users deposit sINV (staked INV) into a single Lender contract at 0xf8B349dA9244253288f6853835e6582955FD49c9 and borrow invUSD against it at a 65% collateral factor. Monolith's Factory at 0x6D961c9DCF1AD73566822BA4B087892e3839B849 is callable by anyone and deploys an independent (Lender, Coin, Vault) triplet via CREATE3. invUSD is deployment #0. Deployment #1 is GUSD over XAUt at an 85% collateral factor, zero supply as of block 25,743,068 though its feed is live and borrowing is open, operated by 0x570f6Be69ea854f7C2FB93609A2bb4090b96719C, an address that appears nowhere in Inverse's authority set. The two deployments choose their own operator, manager, collateral, feed and parameters, but they are NOT fully independent: they share the Factory's singleton InterestModel 0x5B679dDD (whose source states one instance serves all Lenders), the Factory operator seat, the global feeBps and the per-lender customFeeBps override, the single feeRecipient that may pull reserves from any deployment, and the immutable minDebtFloor.
- **The token:** Coin.sol is the whole token, a single small contract. It is non-proxy, has no owner, no roles, no pause, no blacklist and no upgrade path. Its entire authority surface is one field, `address public immutable minter`, set once in the constructor with no setter anywhere. That minter is the Lender. Because the value is a Solidity immutable it is baked into bytecode rather than storage: the Lender address appears twice in Coin's runtime code and in none of storage slots 0 to 6. Privileged levers therefore sit on the Lender, the Factory, the three price-chain contracts (SwitchFeed, DynamicFeeCurveFeed, ChainlinkBasePriceFeed) and sINV itself, but never on the token.
- **How invUSD is created:** five paths, all through the Lender as sole minter, and the count is exact - `coin.mint` appears in exactly five Lender functions. `adjust` is the CDP borrow, callable by anyone, capped at the price the feed reports times the 65% collateral factor. `buy` is the peg stability module and any address may call it, but it carries `beforeDeadline`, so it stops permanently at the 2030-04-23 deadline and the operator may close it earlier via enableImmutabilityNow. `accrueInterest` is callable by anyone and mints interest to the sinvUSD vault only up to the borrow-rate cap, the stakers' share being staked balance over total paid debt, booking the remainder plus any reserve fee to accruedLocalReserves for the operator; that branch is live, taking 36.2% of the pending accrual at block 25,743,174. `pullLocalReserves` is callable by anyone and mints those accrued reserves to the operator. `pullGlobalReserves` is callable only by the Factory, and only through Factory.pullReserves, which is gated to the feeRecipient and always mints to that same feeRecipient; at block 25,743,068 feeRecipient is 0x0 and accruedGlobalReserves is 0, so the path is unreachable and would mint nothing. There is no admin-settable supply ceiling anywhere in the system.
- **Free debt versus paid debt:** this is Monolith's central borrower choice and it drives most of the mechanism. FREE debt carries 0% interest but is REDEEMABLE, meaning any invUSD holder may redeem against that borrower's collateral. PAID debt carries a variable interest rate but is protected from redemption. Borrowers switch between the two at will through `setRedemptionStatus`, which is gated only to the account itself or a delegate and carries no deadline gate. As of block 25,743,068 the split is 74,917 free against 26,144 paid, a free-debt ratio of 7,413 bps.
- **The rate controller:** an autonomous mechanism that steers the free-to-paid mix rather than a governance-set rate. The operator or the manager Safe sets a target BAND for the free-debt ratio (live 3,000 to 7,000 bps) and a responsiveness half-life (live exactly 7 days); both setters are onlyOperatorOrManager and neither has ever fired, so both values are still their deploy-time constructor values. The InterestModel then moves the borrow rate exponentially: when the ratio sits above the band the rate decays, drawing borrowers back toward paid debt; when it sits below, the rate grows, pushing borrowers toward free debt. The model has a floor of 0.5% and no explicit ceiling. As of block 25,743,068, across 104 accrual events the realised rate has moved between 1.104% and 19.748% APR. The ratio is sampled once per accrual and applied across the whole elapsed gap.
- **Redemption:** any invUSD holder may redeem against free debt, which is what ties the token to its collateral. Redemption burns invUSD and seizes the sINV worth the redeemed amount at the oracle price, less the redeem fee; the fee is retained by the borrower as collateral, so a redemption reduces the borrower's debt by more than it reduces their collateral value. The fee is live at 200 bps and capped in source at 500. This path is what makes free debt cheap for the borrower and is the mechanism by which invUSD's price is arbitraged back toward its collateral value.
- **The peg stability module:** a secondary rail alongside the CDP. `buy` mints at most 1:1 against USDS actually deposited (psmAsset USDS 0xdC035D45, routed through sUSDS 0xa3931d71); `sell` burns invUSD and returns USDS. The two directions are structurally asymmetric. `buy` is gated by the immutability deadline and its fee ramps from 0 to 100 bps across the second half of the deadline period; that ramp has NOT begun, since getBuyFeeBps() returns 0 at block 25,743,068 and stays 0 until the 2028-04-23 midpoint, after which inflows are progressively discouraged and stop permanently at the 2030-04-23 deadline. `sell` carries no deadline gate, so the exit direction is never closed by time; its capacity is bounded instead by the PSM's remaining assets, 1.38 USDS as of block 25,743,068.
- **Pricing the collateral:** a four-hop chain whose pointers are all immutable except one. Lender.feed is immutable and points at ERC4626Feed 0x5221571fb2C1EB20E905110fbAd3A274529f58af, which multiplies an INV/USD price by the live sINV vault redemption rate and which has no owner and no setters at all. That INV/USD price comes from SwitchFeed 0xeca2f329A011a4d464F8ef97e493974964911ed0, whose own `feed` pointer is the only repointable link; changing it requires a GovernorMills proposal, the Timelock's 2-day queue, and three in-contract checks on the incoming feed - a positive price, a price within plus or minus 10% of the outgoing feed at the moment of the switch, and matching decimals. Below that sits DynamicFeeCurveFeed 0x4C871E951228c2f7224416C921e742a86Ef8EECB, an EMA of the Curve INV/WETH pool discounted by the live pool fee and capped by a gov-settable maxFee (live 2e8, equal to the pool's own out_fee, so currently non-binding upward; setting it to zero would remove the discount and lift the reported INV price by the live fee, 0.5655% at block 25,743,068). Finally ChainlinkBasePriceFeed 0x22390B88C53D1631f673b8Dcd91860267137b2c8 supplies ETH/USD with a RedStone fallback, selected by a Timelock-settable staleness heartbeat. So one pointer moves, and two further Timelock-held parameters inside the same chain also move the price. As of block 25,743,068 every pointer still holds its constructor value and SwitchFeed has never been switched, with zero SwitchedFeed events since its deployment at block 24,926,087. The Lender constructor performs twelve require checks and none validates the feed, so the chain was chosen by whoever called deploy.
- **Safety states:** derived automatically from live state, with no key involved. `getCollateralPrice` wraps the feed read in try/catch. A reverting or zero price sets reduceOnly = true and simultaneously allowLiquidations = false, so that branch cannot be used to liquidate. The staleness branch behaves differently: past the 86,400 second threshold it sets only reduceOnly and decays the price linearly to zero over 24 hours, so a stale but positive price leaves liquidations enabled. If total debt ever exceeds total collateral value the whole market enters reduce-only. In that state positions may only reduce leverage; repayment and collateral top-ups stay open and never read the feed, while collateral withdrawal is blocked for any account still holding debt and unlocks only once debt reaches zero, which a single adjust call can achieve by repaying in full. There is no pause function anywhere in the codebase.
- **Liquidation and bad debt:** both enforcement paths are permissionless, and both are disabled when the oracle is unhealthy. `liquidate` repays part of an underwater borrower's debt in exchange for their collateral plus an incentive, bounded by getLiquidatableDebt and getMaxRepayByCollateral so a liquidator can never take more collateral than the position supports. `writeOff` handles the residual case and is the socialisation mechanism. It fires only once a borrower's debt exceeds ONE HUNDRED TIMES their collateral value, so it is reserved for positions whose collateral has become effectively worthless. It then deletes that borrower's debt and collateral outright, transfers the leftover collateral to an address the CALLER names (the cleanup incentive), and adds the erased debt back into totalFreeDebt and totalPaidDebt split by their existing proportions. Debt is share-based - getDebtOf returns the account's shares times total debt over total shares - so adding debt to the totals without adding shares raises every remaining borrower's debt pro rata. Both functions require allowLiquidations, which getCollateralPrice sets false on a reverting or zero price, so a broken oracle freezes liquidation and write-off together.
- **What is frozen and what is not:** fifteen of the Lender's parameters are constructor-fixed immutables with no setter in source, namely collateralFactor (6500), stalenessThreshold (86400), minDebt (500e18), psmVaultMinTotalSupply (1,000,000e18), deployTimestamp, collateralDecimals, psmAssetDecimals, feed, coin, collateral, vault, psmAsset, psmVault, interestModel and factory. Ten are setter-backed: expRate via setHalfLife, the two target free-debt ratio bounds, redeemFeeBps, maxBorrowDeltaBps, the local reserve feeBps, manager, operator, pendingOperator and immutabilityDeadline. One belongs to neither side: cachedGlobalFeeBps has no Lender setter but is refreshed from Factory.getFeeOf on every accrual, so the Factory operator moves it via setFeeBps or setCustomFeeBps up to a 1000 bps cap, outside the deadline; it reads 0 at block 25,743,068. What remains adjustable is rate behaviour, three bounded fee and tolerance parameters (redeemFeeBps capped at 500 bps, the local reserve feeBps at 1000 bps, maxBorrowDeltaBps bounded 50 to 200 bps), the immutability deadline, and the two authority slots.
- **Upgradeability:** no contract Monolith deploys or Inverse governs is upgradeable. Coin, Lender, Factory, the sinvUSD Vault, InterestModel, ERC4626Feed, SwitchFeed, DynamicFeeCurveFeed, ChainlinkBasePriceFeed and sINV all read zero at every EIP-1967 slot at block 25,743,068. Four third-party contracts the stack points at ARE upgradeable and sit outside that guarantee: USDS 0xdC035D45 and sUSDS 0xa3931d71, both Sky ERC1967 proxies reached through the PSM; the RedStone ETH/USD fallback 0x67F6838e, itself an EIP-1967 proxy; and Chainlink's EACAggregatorProxy 0x5f4eC3Df, which is not a 1967 proxy but exposes a swappable aggregator() that Chainlink controls. Note also that a zero EIP-1967 slot is not the right test everywhere: the manager Safe is a GnosisSafeProxy whose singleton sits at storage slot 0 and is migratable by delegatecall.
- **The immutability deadline:** a timestamp after which the gated setters stop working permanently. At block 25,743,068 it reads 1903172567, that is 2030-04-23 11:02:47 UTC, which is deploy plus 1,460 days, the contract's own maximum. It has exactly one post-deployment mutation: `enableImmutabilityNow`, callable only by the operator, which collapses it to the current block timestamp irreversibly; there is no path to raise it and no path to move it to any intermediate date. Its coverage is partial by construction. It gates setHalfLife, setTargetFreeDebtRatio, setRedeemFeeBps, setMaxBorrowDeltaBps, enableImmutabilityNow itself, the PSM buy path and reapprovePsmVault. It does not gate setLocalReserveFeeBps, setPendingOperator, acceptOperator, setManager, pullLocalReserves or pullGlobalReserves, so those six remain available after the deadline passes.
- **Authority topology:** two tiers. `onlyOperator` resolves to the Inverse DAO Compound Timelock 0x926dF14a23BE491164dCF93f4c468A50ef659D5B, which carries a 2-day delay and is administered by GovernorMills; the same address is also the Factory operator, the SwitchFeed operator, DynamicFeeCurveFeed gov, ChainlinkBasePriceFeed owner and sINV gov, and it holds Inverse DAO assets directly (8,054.86 INV and 58,353.19 DOLA at block 25,743,068). `onlyOperatorOrManager` additionally admits a 3-of-6 Gnosis Safe at 0x9D5Df30F475CEA915b1ed4C0CCa59255C897b61B running v1.3.0 with no modules and no guard. Operator rotation is a two-step handshake, setPendingOperator then acceptOperator. Manager rotation is single-step and the manager can perform it on itself, since setManager is onlyOperatorOrManager, so the Safe may hand the manager slot to any address with no Timelock involvement and no delay. Neither rotation is deadline-gated. ERC4626Feed, the sinvUSD Vault and Coin carry no role at all.
- **Realised operating history:** as of block 25,743,068 one configuration change exists in the asset's entire life, setRedeemFeeBps from 300 to 200 bps at block 25,581,233, executed through the manager Safe. Zero of GovernorMills' 368 proposals have targeted any contract in this stack, and zero of the 119 transactions the Timelock has queued since the Lender was deployed, out of 2,145 lifetime queues, have done so either. Rotation events for operator, manager, feed and gov are all at zero. Interest has accrued 976.58 invUSD in total, of which 260.03 reached the sinvUSD vault and 716.55 sits in local reserves, a split produced by the borrow-rate cap rather than by the reserve fee, which is set to zero.
- **Current shape at block 25,743,068:** supply is 100,345.83 invUSD. Nine accounts have ever opened a position and eight have ever borrowed; five carry live debt, the largest at 58.1% of the 101,061.00 total and the top two at 83.4%, with aggregate LTV 44.34% against the 65% collateral factor. Supply sits 57.14% in a Curve invUSD/sDOLA stableswap at 0xe430e64081a3e7a39d24c5f507d9d4b492b2ed52, 25.03% in Uniswap V4 and 16.61% in the sinvUSD vault, together 98.78%. That Curve pool has moved from 33.4% invUSD on 2026-05-01 to 80.76% today; its LP supply rose once to 75,539.6586 on 2026-05-04 and has been frozen there since. The PSM has been dormant since 2026-06-10 with 1.38 USDS remaining, and 96.5% of all invUSD ever minted through it, 20,678.44 of 21,438.09, was bought by the manager Safe. The collateral side is bounded by sINV's own deposit limit of 214,000 INV against 149,096 held, about 69.7% used.
- **Scope recorded by the DAO:** GovernorMills proposal 357 adopted the SEAL Safe Harbor Agreement for Monolith with in-scope accounts limited to the Factory and the InterestModel and child scope None, stating that Factory child markets are excluded so coverage cannot extend to wrongly configured Monolith markets. The invUSD Lender is a Factory child. Separately, Inverse forum proposal #665 (2026-06-16) proposed pausing new borrows on the FiRM INV market and redirecting INV-collateralised borrowing demand to Monolith, on the stated rationale that DOLA backed by INV is partially backed by an equity claim on the entity issuing it; GovernorMills proposal 360 executed that pause, and borrowPaused() reads true at block 25,743,068.

</details>

<details>
<summary><strong>📖 Terms</strong> <em>— recurring protocol jargon</em></summary>

- **Monolith** — The stablecoin-as-a-service protocol that issues invUSD. A permissionless Factory that deploys independent (Lender, Coin, Vault) triplets via CREATE3. Spun out of Inverse Finance as a sister protocol. invUSD is deployment #0.
- **free debt vs paid debt** — Monolith's core borrower choice. FREE debt carries 0% interest but is REDEEMABLE (any invUSD holder may redeem against that borrower's collateral). PAID debt carries a variable rate but is redemption-protected. An autonomous controller moves the rate to steer the free/paid ratio toward a target band (live target 3000-7000 bps; live ratio 7413 bps, i.e. above the band).
- **immutabilityDeadline** — A timestamp after which the deadline-gated setters permanently stop working. May only be REDUCED, never extended. PARTIAL: it does not cover the reserve fee, either authority rotation, or the two reserve-mint paths.
- **reduceOnly** — A Lender-wide state derived live from oracle health and global solvency. When true, positions may only reduce leverage; new borrows and collateral withdrawals that increase risk revert. Set automatically on a reverting or zero oracle price, on staleness, and when totalDebt exceeds collateral value.
- **sinvUSD** — The ERC-4626 staking vault over invUSD. Receives interest paid by variable-rate borrowers, minted as new invUSD. Has NO privileged functions and no owner.

</details>

<a id="sec-off-chain-deps"></a>
<details>
<summary><strong>🌐 Off-Chain Dependencies</strong> — risk that extends beyond the chain</summary>

> *1 control surface extends beyond on-chain observability. Each entry shows what the analyst CAN observe (on-chain signal) alongside the off-chain dependency it relies on.*

- **1. governance** 🟡 — invUSD is otherwise fully on-chain: collateral, oracle, redemption, PSM and supply accounting are all observable from a block explorer, and there is no custodian, no attestation and no compliance gate. The single off-chain dependency is key custody and signer independence behind the 3-of-6 manager Safe, which holds the ONLY authority path ever exercised on this asset. The dependency is sharpened by a verified structural fact: the manager Safe's six owners are a strict SUBSET of the seven owners of the sINV guardian Safe, so the same people control both the Lender fast path and the collateral token's deposit gate. There is no signer diversity between the two roles.
    - *On-chain signal:* Lender.manager() == 0x9D5Df30F475CEA915b1ed4C0CCa59255C897b61B (3-of-6, v1.3.0, getModulesPaginated == [], guard slot == 0x0). Monitor Safe ExecutionSuccess events plus Lender ManagerUpdated / RedeemFeeBpsUpdated / HalfLifeUpdated / TargetFreeDebtRatioUpdated / MaxBorrowDeltaBpsUpdated. Note setManager has NO two-step handshake and NO beforeDeadline gate, so a manager rotation is a single instant transaction from the fast path.
    - *Off-chain dependency:* The six EOA signers of Safe 0x9D5Df30F are 0x2723723F (rwg.eth), 0x962228a9 (bankerharry.eth), 0x6535020c (aliendev.eth), 0x52f63971, 0x9F3614af, 0x3FcB35a1. All six are plain EOAs with no EIP-7702 delegation. All six are also owners of the 4-of-7 sINV guardian Safe 0x4b6c63E6…, and the identical six-owner set additionally operates a 2-of-6 sibling Safe 0x8F97cCA3… (no invUSD authority found, but relevant to blast radius).
    - *Recovery path:* The manager cannot mint DIRECTLY and cannot touch the oracle, but see the critical_parameters entry "setTargetFreeDebtRatio + setHalfLife": through the rate controller it holds an indirect, multi-day supply lever that the phrase "cannot mint" understated in cycle 1. The fast path covers economic tuning (halfLife, target free-debt ratio, redeem fee, max borrow delta) plus manager rotation. Recovery from a hostile manager runs through the operator (Timelock, 2-day delay plus a GovernorMills vote), which can call setManager to displace it. No emergency pause exists anywhere in the Lender; there is no pause() function in the codebase at all.

</details>

<a id="sec-oracle-surface"></a>
<details>
<summary><strong>🔮 invUSD Collateral Price Surface (sINV -> USD)</strong> <span class="section-sub">live price-source wiring + who can change each hop</span></summary>

> *Live-read each scan; a repointed feed or retuned delay is flagged in Changes-Since. This section is the LIVE STATE of the price chain. The functions that MUTATE it (SwitchFeed.switchFeed, DynamicFeeCurveFeed.setMaxFee, and the two silent setters on ChainlinkBasePriceFeed) are graded as levers under Critical Parameters. Read the two together: this table answers "what is it pointing at right now", that section answers "who can move it and how fast". The one lever that matters is SwitchFeed.feed: it is the ONLY mutable pointer in the chain, it is gated on the Inverse Timelock (2-day public queue), and it has never been exercised. Note that the last two rows are SILENT setters that emit no events at all, so this live read is the ONLY way a change to them becomes visible.
*

| Piece | Resolves to | Authority | Delay | Note |
|---|---|---|---|---|
| 1. Lender price feed (immutable) | [`0x5221...58af`](https://etherscan.io/address/0x5221571fb2C1EB20E905110fbAd3A274529f58af) | none - `IChainlinkFeed public immutable feed` | immutable | Entry point. Expect ERC4626Feed 0x5221571f. Cannot be repointed at the Lender. |
| 2. sINV vault rate source (immutable) | [`0x08d2...e994`](https://etherscan.io/address/0x08d23468A467d2bb86FaE0e32F247A26C7E2e994) | none - immutable in ERC4626Feed | immutable | The ERC-4626 whose previewRedeem supplies the sINV/INV rate. Expect sINV 0x08d23468. |
| 3. INV/USD source pointer (immutable at this hop) | [`0xeca2...1ed0`](https://etherscan.io/address/0xeca2f329A011a4d464F8ef97e493974964911ed0) | none - immutable in ERC4626Feed | immutable | Expect SwitchFeed 0xeca2f329. ERC4626Feed has no owner and zero setters. |
| 4. ** INV/USD ACTIVE FEED (the one mutable pointer) ** | [`0x4C87...EECB`](https://etherscan.io/address/0x4C871E951228c2f7224416C921e742a86Ef8EECB) | SwitchFeed.switchFeed(address), operator = Inverse DAO Timelock | 2-day Timelock + GovernorMills vote (public queue) | THE lever. Expect DynamicFeeCurveFeed 0x4C871E95, the constructor value, never switched (zero logs since deployment). The in-contract +/-10% divergence guard is point-in-time only and does not bound the resulting price. |
| 5. SwitchFeed operator | [`0x926d...9D5B`](https://etherscan.io/address/0x926dF14a23BE491164dCF93f4c468A50ef659D5B) | two-step setPendingOperator + acceptOperator | none in-contract; inherits whatever holds the slot | Expect the Inverse Timelock 0x926dF14a. If this ever became a Safe or EOA, the repoint above becomes INSTANT. |
| 6. Curve-feed maxFee (bps of 1e10) | `200000000` | DynamicFeeCurveFeed gov = Inverse Timelock | 2-day Timelock | Live 200000000 (2%). Caps the pool-fee discount applied to the INV price. Currently inert because the live Curve pool fee (~0.5%) binds below it. |
| 7. Curve-feed gov | [`0x926d...9D5B`](https://etherscan.io/address/0x926dF14a23BE491164dCF93f4c468A50ef659D5B) | two-step setPendingGov + acceptGov | none in-contract | Expect the Inverse Timelock. Zero logs on this contract since deployment. |
| 8. ETH/USD staleness heartbeat (SILENT setter) | `3660` | ChainlinkBasePriceFeed owner = Inverse Timelock | 2-day Timelock | Live 3660s. Emits NO EVENT when changed, so this live read is the only way a change surfaces. Above this age the feed falls through to the RedStone fallback. |
| 9. ETH/USD feed owner (SILENT setter) | [`0x926d...9D5B`](https://etherscan.io/address/0x926dF14a23BE491164dCF93f4c468A50ef659D5B) | two-step owner rotation | none in-contract | Expect the Inverse Timelock. Also emits NO EVENT, established as unchanged by historical eth_call rather than by logs. |
| 10. ETH/USD fallback (immutable pointer, upgradeable target) | [`0x67F6...6Dc4`](https://etherscan.io/address/0x67F6838e58859d612E4ddF04dA396d6DABB66Dc4) | pointer immutable; the TARGET is a third-party TransparentUpgradeableProxy | n/a | Expect RedStone ETH feed 0x67F6838e. The pointer cannot move, but RedStone can upgrade what sits behind it. Reached only when Chainlink is stale or out of bounds. |
| 11. sINV deposit limit (SILENT setter, collateral gate) | `214000000000000000000000` | sINV setDepositLimit, onlyGuardian = Safe 0x4b6c63E6 (4-of-7) | NONE - instant | Live 214000e18 against ~149,096 INV of assets. Not a price input, but it gates whether borrowers can acquire fresh collateral at all. Silent, instant, and the natspec's must-always-increase rule is NOT enforced in code. |

</details>

<a id="sec-critical-params"></a>
<details>
<summary><strong>🎚️ Critical Parameter Levers</strong> — the one-tx risk levers to watch</summary>

> *8 on-chain parameter levers that are curated as high-impact for lender-side risk (direct dilution / safety-mechanism closure / authority transfer / oracle repointing). Each entry shows current value, the threshold that triggers the impact, and the role-holder controlling the lever.*

- **1. `switchFeed(address newFeed)`** 🟠 on [**SwitchFeed (0xeca2f329A011a4d464F8ef97e493974964911ed0)**](#c-0xeca2f329a011a4d464f8ef97e493974964911ed0)
    - *Role gate:* operator == Inverse DAO Timelock 0x926dF14a… (2-day delay + GovernorMills vote; publicly visible in the Timelock queue for 2 days)
    - *Threshold:* Any repoint. The ±10% MAX_PRICE_DIVERGENCE_BPS guard constrains only the moment of the switch, not the feed afterwards.
    - *Impact:* The only mutable pointer in invUSD's collateral price chain. Repointing upward inflates sINV collateral value at a 65% CF and mints invUSD against nothing; repointing downward mass-liquidates borrowers. The divergence guard is weaker than it appears for two source-verified reasons: switchFeed re-reads the current price on every call so N sequential calls in ONE transaction compound to 1.10^N, and once the pointer has moved the new feed is entirely unconstrained on the next block. The contract's own comment concedes "Important that operator is fully trusted, as a malicious operator can sidestep the price divergence guardrails." Partial mitigation: the Lender's try/catch plus 24h staleness unwind degrades a DEAD repoint to reduce-only; a LIVE but wrong repoint is not caught.
- **2. `setTargetFreeDebtRatio(uint16 startBps, uint16 endBps) + setHalfLife(uint64 halfLife)`** 🟡 on [**Lender (0xf8B349dA9244253288f6853835e6582955FD49c9)**](#c-0xf8b349da9244253288f6853835e6582955fd49c9)
    - *Role gate:* onlyOperatorOrManager. The 3-of-6 manager Safe reaches BOTH instantly, with no vote and no queue; the operator reaches them only via a GovernorMills vote plus a 2-day queue. beforeDeadline-gated, so both die at 2030-04-23.
    - *Profile-declared value (verified at block 25,742,473):* `Band 3000/7000 bps, live getFreeDebtRatio 7413 bps (ABOVE the band, so the controller sits in its DECAY branch). expRate 1146076687433 = halfLife exactly 7 days. Neither setter has EVER fired: HalfLifeUpdated and TargetFreeDebtRatioUpdated are both 0 events.`
    - *Threshold:* startBps set ABOVE the live free-debt ratio (today 7413) flips the InterestModel from decay into its exponential GROWTH branch. halfLife at its 12-hour floor maxes the compounding speed.
    - *Impact:* The correction to cycle 1, which asserted flatly that the manager cannot mint. Directly that is true, and it stays true. Indirectly the manager pair is the largest supply lever in the asset. Setting startBps to 9500 (above the live 7413) puts InterestModel into `currBorrowRate = lastRate * 1e18 / exp(-expRate * t)` and setHalfLife(12 hours) maximises expRate, so the borrow rate doubles every 12 hours and the accrued interest is minted as NEW invUSD to the sinvUSD vault. Simulated by eth_call against the live InterestModel at the current state: 1 day 68% APR / 26.4 invUSD, 3 days 1,089% APR / 554 invUSD, 7 days 278,899% APR / 144,092 invUSD. That last figure is minted against only 26,143.78 invUSD of paid debt, so it is unbacked supply exceeding the entire 100,345.83 float. Graded MEDIUM rather than HIGH, and every one of these bounds was verified, not assumed. It is multi-day, not single-block. It is LOUD: both setters emit events and both have fired zero times in the asset's life. It is self-limiting, because borrowers respond by flipping paid debt to free debt via setRedemptionStatus, which collapses totalPaidDebt, the very base the interest is charged on, and pushes the ratio past the 9500 cap where the controller reverses. Note the ASYMMETRY, which runs the safe way and is worth stating explicitly: setRedemptionStatus is a USER feature, `public` and gated only on `msg.sender == account || delegations[account][msg.sender]`, with NO beforeDeadline modifier, so the borrower's escape hatch survives 2030 PERMANENTLY. The lever itself is beforeDeadline-gated and therefore expires. The attack tool sunsets; the defence against it does not. The lever's own arguments are additionally hard-capped in source (startBps >= 500, endBps <= 9500, halfLife 12h to 30d). InterestModel's uint88 overflow guard returns zero interest by the 30-day mark. And the 2-day Timelock outruns it: queue setManager on day 0, execute on day 2, by which point cumulative damage is roughly 0.3% of supply. Monitoring signal: TargetFreeDebtRatioUpdated and HalfLifeUpdated, both at zero today, plus getFreeDebtRatio crossing below the band's startBps.
- **3. `setRedeemFeeBps(uint16 _redeemFeeBps)`** 🟢 on [**Lender (0xf8B349dA9244253288f6853835e6582955FD49c9)**](#c-0xf8b349da9244253288f6853835e6582955fd49c9)
    - *Role gate:* onlyOperatorOrManager, so the 3-of-6 manager Safe reaches it instantly with no vote and no queue. beforeDeadline-gated, so it stops at 2030-04-23.
    - *Live current value (as of block 25,581,233):* `200`
    - *Recorded changes:* 2 historical event(s); last setter `0x9D5Df30F475CEA915b1ed4C0CCa59255C897b61B`
    - *Profile-declared value (verified at block 25,742,473):* `200 bps. This is the asset's ONLY realised configuration change: 300 -> 200 bps at block 25,581,233 on 2026-07-21, via the manager Safe, confirmed three independent ways (one RedeemFeeBpsUpdated event on chain, a single shared tx_hash across every rendered history row, and the protocol team's own account of the change). ⚠️ THE REPORT OVER-COUNTS THIS PARAMETER. Its param card renders 2 changes on a cold scan and one more per warm rescan, because the Safe-correlation recovery path is not incremental and re-appends the same sub-call each run (TODOS SCAN-7a). The card now carries an "Over-counted history" disclosure. The true figure is ONE change.`
    - *Threshold:* Capped at 500 bps in source by require(_redeemFeeBps <= 500). Any value up to that cap is reachable in one transaction from the fast path.
    - *Impact:* The redemption fee is the EXIT HAIRCUT on invUSD, so it is a direct input to what a lender should value the collateral at, not merely an economic parameter: value the asset at redemption value less the maximum reachable fee, which is 500 bps here rather than the live 200. Redemption against free debt is the mechanism that ties invUSD's price back to its collateral, so the fee sets how far the peg can drift before arbitrage becomes worthwhile. Raising it widens that band and makes exit more expensive for holders; the borrower keeps the fee as collateral, so a higher fee also shifts value from the redeemer to the borrower being redeemed against. Graded LOW, not higher, on three verified grounds: the 500 bps source cap bounds the worst case tightly, the setter emits RedeemFeeBpsUpdated so any change is visible in an event feed, and the single realised change moved the fee DOWN. The lever is listed because it is the exit-haircut input and because it is reachable instantly from the 3-of-6 Safe with no Timelock involvement.
- **4. `setHeartbeat(uint256 newHeartbeat)`** 🟡 on [**ChainlinkBasePriceFeed (0x22390B88C53D1631f673b8Dcd91860267137b2c8)**](#c-0x22390b88c53d1631f673b8dcd91860267137b2c8)
    - *Role gate:* onlyOwner == Inverse DAO Timelock (2-day delay + GovernorMills vote). UNCAPPED: no require of any kind. SILENT SETTER: emits no event.
    - *Profile-declared value (verified at block 25,742,473):* `3660 seconds. Chainlink's own ETH/USD heartbeat is 3600s, so this allows a 60s margin.`
    - *Threshold:* Zero (or any value below the feed's real update interval) permanently forces the RedStone fallback. Any very large value disables the TIME branch of the staleness check.
    - *Impact:* This is not a tuning knob, it is the SWITCH that decides which ETH/USD source is authoritative for invUSD's collateral price. Source-verified: isPriceStale returns `updatedAt + assetToUsdHeartbeat < block.timestamp`, and when it is true latestRoundData silently substitutes assetToUsdFallback. hasFallback() is permanently true here because the RedStone pointer is immutable and non-zero. So setting the heartbeat to 0 makes EVERY Chainlink round read as stale and hands the ETH/USD leg to RedStone forever, in one transaction that emits no event. That matters because the RedStone target is a third-party TransparentUpgradeableProxy: the pointer cannot move, but RedStone can upgrade what sits behind it. Two honest bounds on the severity. Raising the heartbeat does NOT let the Lender accept an indefinitely frozen price, because the Lender applies its own stalenessThreshold (86400s) and decays the price linearly to zero over 24h regardless of what this feed says; and the isPriceOutOfBounds branch still routes to the fallback on an aggregator min/max hit even with an enormous heartbeat. ETH/USD is also only one leg of a two-leg price (INV/WETH Curve EMA times ETH/USD). Graded MEDIUM rather than HIGH on those grounds plus the 2-day public queue, but it is uncapped and silent, so the oracle_surface live read (row 8) is the ONLY detection channel.
- **5. `setFeeRecipient(address _feeRecipient)`** 🟡 on [**Factory (0x6d961c9dcf1ad73566822ba4b087892e3839b849)**](#c-0x6d961c9dcf1ad73566822ba4b087892e3839b849)
    - *Role gate:* onlyOperator == Inverse DAO Timelock (2-day delay). No immutability deadline on the Factory at all.
    - *Live current value:* `0x0000000000000000000000000000000000000000`
    - *Profile-declared value (verified at block 25,742,473):* `0x0. VERIFIED never non-zero since deployment (zero FeeRecipientUpdated events; historical eth_call at 4 sample blocks)`
    - *Threshold:* Any non-zero value arms the path.
    - *Impact:* Second step of the only governance-reachable invUSD mint. With feeRecipient at zero, Factory.pullReserves is unreachable by anyone and the Lender's pullGlobalReserves mint path is dormant. Arming it requires two Timelock actions: setFeeBps or setCustomFeeBps to start accruing (max 1000 bps of interest), then setFeeRecipient. The recipient is unconstrained. Note cachedGlobalFeeBps refreshes from the Factory on EVERY accrueInterest, so a fee change propagates to invUSD without any further action.
- **6. `setLocalReserveFeeBps(uint _feeBps)`** 🟢 on [**Lender (0xf8B349dA9244253288f6853835e6582955FD49c9)**](#c-0xf8b349da9244253288f6853835e6582955fd49c9)
    - *Role gate:* onlyOperator == Inverse DAO Timelock. NOT beforeDeadline-gated, so it survives the 2030 immutability deadline permanently.
    - *Live current value:* `0`
    - *Profile-declared value (verified at block 25,742,473):* `0 bps, and yet accruedLocalReserves stands at 716.55 invUSD, which is 73.4% of ALL interest the protocol has ever accrued (cumulative 976.58 invUSD across 104 InterestAccrued events; only 260.03 reached the sinvUSD vault). CORRECTED in cycle 2: an earlier note credited this to PSM profit plus the supply-rate cap branch, but PSM profit is only 1.38 USDS in total. The real driver is the supply-rate cap at Lender.sol:214-221, which fires because totalStaked (16,671.17) is BELOW totalPaidDebt (26,143.78) and diverts roughly 36% of each accrual to reserves regardless of feeBps.`
    - *Threshold:* Capped at 1000 bps (10% of interest) by require in-source.
    - *Impact:* Diverts up to 10% of borrower interest into accruedLocalReserves, which pullLocalReserves then MINTS to the operator. The operator IS the Inverse DAO treasury, so this is the DAO setting its own revenue take on invUSD interest, and pullLocalReserves being permissionless means anyone may push accrued revenue into the treasury. That is protocol revenue, not a capture path. Two residual notes for a lender: (a) the destination follows the operator slot, and operator rotation is NOT deadline-gated, so a rotation redirects future reserve mints; (b) it is one of the six privileged paths the immutability deadline does NOT close, so the DAO retains this revenue lever permanently.
- **7. `setManager(address _manager)`** 🟢 on [**Lender (0xf8B349dA9244253288f6853835e6582955FD49c9)**](#c-0xf8b349da9244253288f6853835e6582955fd49c9)
    - *Role gate:* onlyOperatorOrManager. The 3-of-6 Safe can rotate ITSELF. No two-step handshake (unlike operator) and NOT beforeDeadline-gated.
    - *Live current value:* `0x9D5Df30F475CEA915b1ed4C0CCa59255C897b61B`
    - *Threshold:* Any rotation.
    - *Impact:* The manager can hand its own role to an arbitrary address in one instant transaction, with no delay, no handshake and no sunset. Bounded because the manager cannot mint directly and cannot touch the oracle, and the Timelock operator can always displace it. Note the manager's INDIRECT supply lever is graded separately under "setTargetFreeDebtRatio + setHalfLife". Listed because it is the fast path's self-perpetuation lever and because it is one of the setters that outlives immutability.
- **8. `setDepositLimit(uint256 _depositLimit)`** 🟡 on [**sINV (0x08d23468A467d2bb86FaE0e32F247A26C7E2e994), the collateral**](#c-0x08d23468a467d2bb86fae0e32f247a26c7e2e994)
    - *Role gate:* onlyGuardian == Safe 0x4b6c63E6… (4-of-7). Instant, no delay. SILENT SETTER: emits no event.
    - *Profile-declared value (verified at block 25,742,473):* `214,000e18 against totalAssets 149,095.82 INV (~70% utilised). Changed once from 10,000e18, silently, between blocks 20,771,286 and 22,000,000.`
    - *Threshold:* Any value below current totalAssets binds immediately at the margin; zero blocks all new deposits.
    - *Impact:* The sINV natspec states the deposit limit must always increase, but the code does NOT enforce it. A 4-of-7 guardian can set it to zero instantly and silently, making afterDeposit revert on every new deposit. This is a deposit-side denial of service on the collateral token, not a fund-loss path: existing holders can still withdraw and beforeWithdraw has no limit check. It matters to a lender because it freezes the ability of borrowers to acquire fresh collateral, and because it is silent so it will not appear in any event feed.

</details>

## 📑 Table of Contents

1. [Analyst Focus Areas](#analyst-focus-areas)
2. Contracts
   - [invUSD ★](#c-0x5377680b5986296aa4f9e684e5315a4f24832e56)
   - [Lender](#c-0xf8b349da9244253288f6853835e6582955fd49c9)
   - [Timelock](#c-0x926df14a23be491164dcf93f4c468a50ef659d5b)
   - [Factory](#c-0x6d961c9dcf1ad73566822ba4b087892e3839b849)
   - [ERC4626Feed](#c-0x5221571fb2c1eb20e905110fbad3a274529f58af)
   - [SwitchFeed](#c-0xeca2f329a011a4d464f8ef97e493974964911ed0)
   - [DynamicFeeCurveFeed](#c-0x4c871e951228c2f7224416c921e742a86ef8eecb)
   - [ChainlinkBasePriceFeed](#c-0x22390b88c53d1631f673b8dcd91860267137b2c8)
   - [GovernorMills](#c-0xbeccb6bb0aa4ab551966a7e4b97cec74bb359bf6)
   - [Guardian](#c-0x941c2699ec7e55a50bde030d8e1e70649839259d)
3. [⚡ Authority Concentration](#-authority-concentration)
4. [⛔ Sanctions Screening](#-sanctions-screening)
5. [EOA Exposure Summary](#eoa-exposure-summary)
6. [✅ Scan Integrity](#scan-integrity)

## Analyst Focus Areas &nbsp;&nbsp;☑ Profile reviewed

> **Observational findings — not risk determinations.** Each item below is a focus point for the Risk Analyst to interpret against collateralization context and the protocol's stated intent. Attention levels (CRITICAL / HIGH / LOW) reflect the scanner's heuristic weight — not a realized risk to FiRM. These observations support future risk assessments; they do not constitute one.

> **1 critical-attention** and **16 high-attention** observation(s) across 12 contract(s).

<details>
<summary><strong>View findings (collapsed — profile reviewed)</strong></summary>


### 🔴 CRITICAL (1)

- 🔴 [**Observed: EOA holds `deployer()` on Guardian**](#c-0x941c2699ec7e55a50bde030d8e1e70649839259d) — `0x3FcB35a1CbFB6007f9BC638D388958Bc4550cB28` (EOA) — single key controls a role whose functions (`allowCancel`, `setPendingDeployer`) may reach inherited [SUPPLY] authority via Coin, Lender. Inheritance is a dependency-graph edge — verify these functions actually exercise it before treating it as a confirmed path. Assess custody and intent.

### 🟠 HIGH (16)


<details>
<summary>💰 **Observed: 5 role(s) with supply-altering capability** — Supply-altering surface — assess each holder's custody and governance. Expand for all roles (each links to its contract card).</summary>

- 💰 [**`minter()` on Coin**](#c-0x5377680b5986296aa4f9e684e5315a4f24832e56) — 1 holder(s) — open the role card for holder identities & admin chain.
- 💰 [**`operator()` on Factory**](#c-0x6d961c9dcf1ad73566822ba4b087892e3839b849) — 1 holder(s) — open the role card for holder identities & admin chain.
- 💰 [**`factory` on Lender**](#c-0xf8b349da9244253288f6853835e6582955fd49c9) — 1 holder(s) — open the role card for holder identities & admin chain.
- 💰 [**`manager()` on Lender**](#c-0xf8b349da9244253288f6853835e6582955fd49c9) — 1 holder(s) — open the role card for holder identities & admin chain.
- 💰 [**`operator()` on Lender**](#c-0xf8b349da9244253288f6853835e6582955fd49c9) — 1 holder(s) — open the role card for holder identities & admin chain.

</details>

- 🚦 **Observed: no observable pause mechanism for supply** — Supply-altering surface detected on `Coin`, `Factory`, `Lender` but no PAUSE-capable role or pause()/unpause() ABI declaration was found across any in-scope contract. In an incident, there is no on-chain path to halt new issuance. Verify whether this is intentional (e.g. supply gated at a higher-level Fed or Custodian contract) or an oversight.
- 🔗 [**Observed: supply authority chain on ChainlinkBasePriceFeed**](#c-0x22390b88c53d1631f673b8dcd91860267137b2c8) — Chain: Coin → `minter()` → ChainlinkBasePriceFeed. Controlled by: `owner()`. Assess custody — compromise of this chain could affect root token supply.
- 🔗 [**Observed: supply authority chain on DynamicFeeCurveFeed**](#c-0x4c871e951228c2f7224416c921e742a86ef8eecb) — Chain: Coin → `minter()` → DynamicFeeCurveFeed. Controlled by: `gov()`. Assess custody — compromise of this chain could affect root token supply.
- 🔗 [**Observed: supply authority chain on ERC4626Feed**](#c-0x5221571fb2c1eb20e905110fbad3a274529f58af) — Chain: Coin → `minter()` → ERC4626Feed. Controlled by: `feed()`, `vault()`. Assess custody — compromise of this chain could affect root token supply.

<details>
<summary>🔓 **3 No-Timelock-in-admin-chain supply finding(s) across 2 contract(s)** — Supply-capable roles with no Timelock in the direct admin chain — a supply-altering call can land in one block once the holder's governance threshold is met. Expand to review each role + holder and verify whether it is a real supply path or a transitive getter-pointer edge. FiRM-lens: no analyst-observable buffer between decision and action.</summary>

- ⚠️ [**No Timelock in admin chain: `minter()` on Coin**](#c-0x926df14a23be491164dcf93f4c468a50ef659d5b) — `minter()` has SUPPLY capability and is held by: `0xf8B3...49c9` (Contract). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `manager()` on Lender**](#c-0x926df14a23be491164dcf93f4c468a50ef659d5b) — `manager()` has SUPPLY capability and is held by: `0x9D5D...b61B` (Safe). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `factory` on Lender**](#c-0x926df14a23be491164dcf93f4c468a50ef659d5b) — `factory` has SUPPLY capability and is held by: `0x6D96...B849` (Contract). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.

</details>

- 🌐 [**Observed: 1 off-chain control dependency (governance)**](#sec-off-chain-deps) — Asset has 1 control surface(s) that extend beyond on-chain observability. See the 🌐 Off-Chain Dependencies section for each kind, the on-chain signal the analyst can monitor, the off-chain dependency it relies on, and the recovery path if the off-chain piece fails. Cross-reference against the protocol's stated trust model.
- 🎚️ [**Observed: 8 critical parameter levers (HIGH: 1, MEDIUM: 4, LOW: 3)**](#sec-critical-params) — Asset has 8 on-chain parameter levers curated as high-impact for lender-side risk. See the 🎚️ Critical Parameter Levers section for the role gate, current value, threshold, and impact of each. These are singular setters / function calls that flip risk surface in one tx — direct dilution, safety-mechanism closure, authority transfer, or oracle repointing. Verify role-gate identities and threshold distance-to-trigger against current operating posture.

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
<a id="c-0x5377680b5986296aa4f9e684e5315a4f24832e56"></a>
## Coin `0x5377680B5986296AA4F9e684e5315a4F24832e56`

### 🟠 `minter()`

**Privileged write functions:**  
**Capabilities:** 💰 **SUPPLY**
- `mint(address to, uint256 amount)` — (auto) Create new tokens, increasing total supply `[SUPPLY]`

**Members (1):**

| Address | Name / Type | Risk | Granted | Source | Details |
|---|---|---|---|---|---|
| `0xf8B349dA9244253288f6853835e6582955FD49c9` | Lender | 🟠 HIGH | — | Storage only |  |

#### 💰 Supply Actions

_Mint / redeem / burn call tracking — last 5 calls per function, total counts preserved._

**`mint`** *(per-asset)* 🔄 **ACTIVE** (140 changes)

> ⚠️ This parameter has been changed **140 times** — monitor for unexpected modifications.

| Field | Value |
|---|---|
| Setter | `mint(address to, uint256 amount)` |
| Gated by | `minter()` |
| Tags | `SUPPLY` |
| Last called | — |
| Called by | — |
| Total calls | 140 🔄 |

---
<a id="c-0xf8b349da9244253288f6853835e6582955fd49c9"></a>
## > Lender `0xf8B349dA9244253288f6853835e6582955FD49c9`

> > 💰 **Inherited supply authority** — holds `minter()` on **Coin**. Access controls on this contract gate root token supply.

> 🔒 **Immutable References:** `feed()` → ERC4626Feed, `vault()` → sinvUSD (Vault), `coin()` → invUSD (Coin), `interestModel()` → InterestModel, `psmAsset()` → USDS (ERC1967Proxy), `psmVault()` → sUSDS (ERC1967Proxy), `collateral()` → sINV (sINV)

### > 🟠 `factory`

> **Hash:** `bfs_seed:factory`  
> **Privileged write functions:**  
> **Capabilities:** ⚙️ **CONFIG** 💰 **SUPPLY**
> - `factory` — The Factory is a MINT AUTHORITY: Lender.pullGlobalReserves is gated `require(msg.sender == address(factory))` and calls coin.mint(_to, amount). The scanner will not reach it on its own because "factory" is on the IGNORABLE_VIEWS blacklist (scan_roles.py ~2497, added for DEX pair views). It also holds the global fee levers for every Monolith deployment and has NO immutability deadline. Verified 2026-08-12: Factory.operator = the Inverse Timelock, feeRecipient = 0x0 (never non-zero), feeBps = 0.
 `[SUPPLY, CONFIG]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x6D961c9DCF1AD73566822BA4B087892e3839B849` | Factory | 🟠 HIGH | — | Storage only |  |

### > 🟢 `manager()`

> **Privileged write functions:**  
> **Capabilities:** ⚙️ **CONFIG** 💰 **SUPPLY**
> - `setHalfLife(uint64 halfLife)` `[CONFIG, SUPPLY]`
> - `setTargetFreeDebtRatio(uint16 startBps, uint16 endBps)` `[CONFIG, SUPPLY]`
> - `setRedeemFeeBps(uint16 _redeemFeeBps)` — (auto) Set the redemption fee in basis points `[SUPPLY, CONFIG]`
> - `setMaxBorrowDeltaBps(uint16 _maxBorrowDeltaBps)` `[CONFIG]`
> - `setManager(address _manager)`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x9D5Df30F475CEA915b1ed4C0CCa59255C897b61B` | Gnosis Safe 3/6 | 🟢 LOW | — | Storage only | 3/6 signers |

> **Signers of `Gnosis Safe 3/6` (0x9D5D...b61B):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x2723723FDd3Db8ba2D6f0e1B333e90A7E60A0411` | EOA ⚠️ Hot wallet (1,627 txs) | 2026-03-06 | EOA |
> | `0x52f63971afD2a32524c859C29943f9BEa38CA907` | EOA | 2025-02-03 | EOA |
> | `0x9F3614afb3Df9f899caDBFfaA05c6C908059F726` | EOA | 2025-11-24 | EOA |
> | `0x962228a90eaC69238c7D1F216d80037e61eA9255` | EOA ⚠️ Hot wallet (1,788 txs) | — | EOA |
> | `0x6535020cCeB810Bdb3F3cA5e93dE2460FF7989BB` | EOA | 2023-11-17 | EOA |
> | `0x3FcB35a1CbFB6007f9BC638D388958Bc4550cB28` | EOA ⚠️ Hot wallet (1,458 txs) | — | EOA |

### > 🟢 `operator()`

> **Privileged write functions:**  
> **Capabilities:** ⚙️ **CONFIG** 💰 **SUPPLY**
> - `setHalfLife(uint64 halfLife)` `[CONFIG, SUPPLY]`
> - `setTargetFreeDebtRatio(uint16 startBps, uint16 endBps)` `[CONFIG, SUPPLY]`
> - `setRedeemFeeBps(uint16 _redeemFeeBps)` — (auto) Set the redemption fee in basis points `[SUPPLY, CONFIG]`
> - `setMaxBorrowDeltaBps(uint16 _maxBorrowDeltaBps)` `[CONFIG]`
> - `setLocalReserveFeeBps(uint _feeBps)` `[CONFIG, SUPPLY]`
> - `setPendingOperator(address _pendingOperator)`
> - `setManager(address _manager)`
> - `enableImmutabilityNow()` `[CONFIG]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x926dF14a23BE491164dCF93f4c468A50ef659D5B` | Compound Timelock (2d) | 🟢 LOW | — | Storage only | 2d delay |

### > 🟠 `ETH/USD source (ChainlinkBasePriceFeed)`

> **Hash:** `bfs_seed:ETH/USD source (ChainlinkBasePriceFeed)`  
> **Privileged write functions:**  
> **Capabilities:** ⚙️ **CONFIG**
> - `feed -> ... -> DynamicFeeCurveFeed.pairedTokenToUsd` — True edge: DynamicFeeCurveFeed.pairedTokenToUsd(). Fourth hop, Chainlink ETH/USD with a RedStone fallback. Carries TWO SILENT SETTERS (assetToUsdHeartbeat, live 3660s, and owner) that emit NO events at all, so its event log is worthless as evidence and only the scanner's silent-setter classification will flag them. owner = the Inverse Timelock, unchanged since deployment (established by historical eth_call, not by events).
 `[CONFIG]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x22390B88C53D1631f673b8Dcd91860267137b2c8` | ChainlinkBasePriceFeed | 🟠 HIGH | — | Storage only |  |

### > 🟠 `INV price source (DynamicFeeCurveFeed)`

> **Hash:** `bfs_seed:INV price source (DynamicFeeCurveFeed)`  
> **Privileged write functions:**  
> **Capabilities:** ⚙️ **CONFIG**
> - `feed -> ... -> SwitchFeed.feed` — True edge: SwitchFeed.feed(). Third hop. Holds a mutable `maxFee` (live 2e8 = 2%) and a `gov` role, both on the Inverse Timelock. Prices INV from a Curve WETH/INV pool EMA (ma_time 601s) times ETH/USD. ZERO logs since deployment.
 `[CONFIG]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x4C871E951228c2f7224416C921e742a86Ef8EECB` | DynamicFeeCurveFeed | 🟠 HIGH | — | Storage only |  |

### > 🟠 `INV/USD source (SwitchFeed)`

> **Hash:** `bfs_seed:INV/USD source (SwitchFeed)`  
> **Privileged write functions:**  
> **Capabilities:** ⚙️ **CONFIG**
> - `feed -> ERC4626Feed.feed` — True edge: ERC4626Feed.feed(). SwitchFeed holds switchFeed(address), the ONLY mutable pointer in the collateral price chain and the highest-value lever in this asset. Gated on the Inverse Timelock (2-day queue). Its in-contract ±10% divergence guard is point-in-time only: it re-reads the current price per call so N calls in one tx compound to 1.10^N, and the new feed is unconstrained afterwards. Verified 2026-08-12: operator = Timelock, feed = DynamicFeeCurveFeed 0x4C871E95 (constructor value, never switched, ZERO logs since deployment).
 `[CONFIG]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xeca2f329A011a4d464F8ef97e493974964911ed0` | SwitchFeed | 🟠 HIGH | — | Storage only |  |

### > 🟠 `price feed (ERC4626Feed)`

> **Hash:** `bfs_seed:price feed (ERC4626Feed)`  
> **Privileged write functions:**  
> **Capabilities:** ⚙️ **CONFIG**
> - `feed` — True edge: Lender.feed(), immutable. ERC4626Feed is itself ownerless with zero setters and all pointers immutable, so it holds no lever of its own, but it is the ENTRY POINT to the price chain and the report should show where the collateral price comes from. Classified "operational, not followed" on cycle 1.
 `[CONFIG]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x5221571fb2C1EB20E905110fbAd3A274529f58af` | ERC4626Feed | 🟠 HIGH | — | Storage only |  |

> #### 🔧 Permissioned Parameters

> **`expRate`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)*

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `1146076687433` |
> | Setter | `setHalfLife(uint64 halfLife)` |
> | Gated by | `manager(), operator()` |
> | Tags | `CONFIG` `SUPPLY` |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`feeBps`** ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `0` |
> | Setter | `setLocalReserveFeeBps(uint _feeBps)` |
> | Gated by | `operator()` |
> | Tags | `CONFIG` `SUPPLY` |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`immutabilityDeadline`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)* 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `1903172567` |
> | Setter | `enableImmutabilityNow()` |
> | Gated by | `operator()` |
> | Tags | `CONFIG` |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`manager`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)*

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `0x9D5Df30F475CEA915b1ed4C0CCa59255C897b61B` |
> | Setter | `setManager(address _manager)` |
> | Gated by | `manager(), operator()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`MAX_DECIMALS`** 🔒 **IMMUTABLE**

> > 🔒 **Immutable** — declared as a constant in the contract source; cannot be changed without a contract upgrade. Bounds the reachable extreme of any setter that writes a related storage variable.

> | Field | Value |
> |---|---|
> | Current Value | `30` |
> | Mutability | 🔒 immutable (constant) |
> | Tags | `IMMUTABLE` |

> **`maxBorrowDeltaBps`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)*

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `100` |
> | Setter | `setMaxBorrowDeltaBps(uint16 _maxBorrowDeltaBps)` |
> | Gated by | `manager(), operator()` |
> | Tags | `CONFIG` |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`MIN_LIQUIDATION_DEBT`** 🔒 **IMMUTABLE**

> > 🔒 **Immutable** — declared as a constant in the contract source; cannot be changed without a contract upgrade. Bounds the reachable extreme of any setter that writes a related storage variable.

> | Field | Value |
> |---|---|
> | Current Value | `10000000000000000000000 (10,000.000000e18)` |
> | Mutability | 🔒 immutable (constant) |
> | Tags | `IMMUTABLE` |

> **`pendingOperator`** ❄️ **DORMANT**

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `0x0000000000000000000000000000000000000000` |
> | Setter | `setPendingOperator(address _pendingOperator)` |
> | Gated by | `operator()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`redeemFeeBps`**

> > ⚠️ **Over-counted history** — the 2 retained history rows resolve to only 1 distinct transaction(s), so some rows are duplicate records of the same call. Treat the change count as an upper bound.

> | Field | Value |
> |---|---|
> | Current Value | `200` |
> | Setter | `setRedeemFeeBps(uint16 _redeemFeeBps)` |
> | Gated by | `manager(), operator()` |
> | Tags | `SUPPLY` `CONFIG` |
> | Last changed | 2026-07-21 |
> | Changed by | `0x9D5D...b61B` (Gnosis Safe 3/6) |
> | Total changes | 2 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `_redeemFeeBps=200` | `0x9D5D...b61B` (Gnosis Safe 3/6) | 2026-07-21 |
> | 2 | `200` | `0xEC09...471a` | 2026-07-21 |

> **`targetFreeDebtRatioEndBps`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)*

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `7000` |
> | Setter | `setTargetFreeDebtRatio(uint16 startBps, uint16 endBps)` |
> | Gated by | `manager(), operator()` |
> | Tags | `CONFIG` `SUPPLY` |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`targetFreeDebtRatioStartBps`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)*

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `3000` |
> | Setter | `setTargetFreeDebtRatio(uint16 startBps, uint16 endBps)` |
> | Gated by | `manager(), operator()` |
> | Tags | `CONFIG` `SUPPLY` |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> #### 💰 Supply Actions

> _Mint / redeem / burn call tracking — last 5 calls per function, total counts preserved._

> **`setHalfLife`** ❄️ **DORMANT**

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Setter | `setHalfLife(uint64 halfLife)` |
> | Gated by | `manager(), operator()` |
> | Tags | `CONFIG` `SUPPLY` |
> | Last called | — |
> | Called by | — |
> | Total calls | 0 ❄️ |

> **`setTargetFreeDebtRatio`** ❄️ **DORMANT**

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Setter | `setTargetFreeDebtRatio(uint16 startBps, uint16 endBps)` |
> | Gated by | `manager(), operator()` |
> | Tags | `CONFIG` `SUPPLY` |
> | Last called | — |
> | Called by | — |
> | Total calls | 0 ❄️ |

---
<a id="c-0x926df14a23be491164dcf93f4c468a50ef659d5b"></a>
## > Timelock `0x926dF14a23BE491164dCF93f4c468A50ef659D5B`

> > 💰 **Inherited supply authority** — holds `minter()` on **Coin**, `operator()` on **Lender**. Access controls on this contract gate root token supply.

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
<a id="c-0x6d961c9dcf1ad73566822ba4b087892e3839b849"></a>
## > Factory `0x6D961c9DCF1AD73566822BA4B087892e3839B849`

> > 💰 **Inherited supply authority** — holds `minter()` on **Coin**, `factory` on **Lender**. Access controls on this contract gate root token supply.

> 🔒 **Immutable References:** `interestModel()` → InterestModel

### > 🟢 `operator()`

> **Privileged write functions:**  
> **Capabilities:** ⚙️ **CONFIG** 💰 **SUPPLY**
> - `setPendingOperator(address _pendingOperator)`
> - `setFeeRecipient(address _feeRecipient)` — (auto) Set the address that receives collected fees `[SUPPLY, CONFIG]`
> - `setFeeBps(uint256 _feeBps)` `[CONFIG]`
> - `setCustomFeeBps(address _address, uint256 _feeBps)` `[CONFIG]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x926dF14a23BE491164dCF93f4c468A50ef659D5B` | Compound Timelock (2d) | 🟢 LOW | — | Storage only | 2d delay |

> #### 🔧 Permissioned Parameters

> **`customFeeBps`** *(per-asset)* ❄️ **DORMANT**

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Setter | `setCustomFeeBps(address _address, uint256 _feeBps)` |
> | Gated by | `operator()` |
> | Tags | `CONFIG` |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`feeBps`** ❄️ **DORMANT**

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `0` |
> | Hard cap | 🔒 `1000` (MAX_FEE_BPS) |
> | Setter | `setFeeBps(uint256 _feeBps)` |
> | Gated by | `operator()` |
> | Tags | `CONFIG` |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`feeRecipient`** ❄️ **DORMANT**

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `0x0000000000000000000000000000000000000000` |
> | Setter | `setFeeRecipient(address _feeRecipient)` |
> | Gated by | `operator()` |
> | Tags | `SUPPLY` `CONFIG` |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`pendingOperator`** ❄️ **DORMANT**

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `0x0000000000000000000000000000000000000000` |
> | Setter | `setPendingOperator(address _pendingOperator)` |
> | Gated by | `operator()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

---
<a id="c-0x5221571fb2c1eb20e905110fbad3a274529f58af"></a>
## > ERC4626Feed `0x5221571fb2C1EB20E905110fbAd3A274529f58af`

> > 💰 **Inherited supply authority** — holds `minter()` on **Coin**. Access controls on this contract gate root token supply.

> 🔒 **Immutable References:** `vault()` → sINV (sINV), `feed()` → SwitchFeed

---
<a id="c-0xeca2f329a011a4d464f8ef97e493974964911ed0"></a>
## > SwitchFeed `0xeca2f329A011a4d464F8ef97e493974964911ed0`

> > 💰 **Inherited supply authority** — holds `minter()` on **Coin**. Access controls on this contract gate root token supply.

> 🔒 **Immutable References:** `feed()` → DynamicFeeCurveFeed

### > 🟢 `operator()`

> **Privileged write functions:**  
> **Capabilities:** ⚙️ **CONFIG**
> - `switchFeed(address newFeed)` `[CONFIG]`
> - `setPendingOperator(address newOperator)`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x926dF14a23BE491164dCF93f4c468A50ef659D5B` | Compound Timelock (2d) | 🟢 LOW | — | Storage only | 2d delay |

> #### 🔧 Permissioned Parameters

> **`MAX_PRICE_DIVERGENCE_BPS`** 🔒 **IMMUTABLE**

> > 🔒 **Immutable** — declared as a constant in the contract source; cannot be changed without a contract upgrade. Bounds the reachable extreme of any setter that writes a related storage variable.

> | Field | Value |
> |---|---|
> | Current Value | `1000` |
> | Mutability | 🔒 immutable (constant) |
> | Tags | `IMMUTABLE` |

> **`pendingOperator`** ❄️ **DORMANT**

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `0x0000000000000000000000000000000000000000` |
> | Setter | `setPendingOperator(address newOperator)` |
> | Gated by | `operator()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

---
<a id="c-0x4c871e951228c2f7224416c921e742a86ef8eecb"></a>
## > DynamicFeeCurveFeed `0x4C871E951228c2f7224416C921e742a86Ef8EECB`

> > 💰 **Inherited supply authority** — holds `minter()` on **Coin**. Access controls on this contract gate root token supply.

> 🔒 **Immutable References:** `curvePool()` → INV/WETH (CurveTwocryptoOptimized), `pairedTokenToUsd()` → ChainlinkBasePriceFeed

### > 🟢 `gov()` · 🏛️ governance

> **Privileged write functions:**  
> **Capabilities:** ⚙️ **CONFIG**
> - `setMaxFee(int _maxFee)` `[CONFIG]`
> - `setPendingGov(address _gov)`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x926dF14a23BE491164dCF93f4c468A50ef659D5B` | Compound Timelock (2d) | 🟢 LOW | — | Storage only | 2d delay |

> #### 🔧 Permissioned Parameters

> **`maxFee`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)*

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `200000000` |
> | Setter | `setMaxFee(int _maxFee)` |
> | Gated by | `gov()` |
> | Tags | `CONFIG` |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`pendingGov`** ❄️ **DORMANT**

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `0x0000000000000000000000000000000000000000` |
> | Setter | `setPendingGov(address _gov)` |
> | Gated by | `gov()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

---
<a id="c-0x22390b88c53d1631f673b8dcd91860267137b2c8"></a>
## > ChainlinkBasePriceFeed `0x22390B88C53D1631f673b8Dcd91860267137b2c8`

> > 💰 **Inherited supply authority** — holds `minter()` on **Coin**. Access controls on this contract gate root token supply.

> 🔒 **Immutable References:** `assetToUsd()` → EACAggregatorProxy, `assetToUsdFallback()` → TransparentUpgradeableProxy

### > 🟢 `owner()`

> **Privileged write functions:**
> - `setHeartbeat(uint256 newHeartbeat)`
> - `setPendingOwner(address newPendingOwner)`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x926dF14a23BE491164dCF93f4c468A50ef659D5B` | Compound Timelock (2d) | 🟢 LOW | — | Storage only | 2d delay |

> #### 🔧 Permissioned Parameters

> **`pendingOwner`** ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `0x0000000000000000000000000000000000000000` |
> | Setter | `setPendingOwner(address newPendingOwner)` |
> | Gated by | `owner()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

---
<a id="c-0xbeccb6bb0aa4ab551966a7e4b97cec74bb359bf6"></a>
## > GovernorMills `0xBeCCB6bb0aa4ab551966A7E4B97cec74bb359Bf6`

> > 💰 **Inherited supply authority** — holds `minter()` on **Coin**, `operator()` on **Lender**. Access controls on this contract gate root token supply.

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

> **`proposalThreshold`**

> > ⚠️ **Over-counted history** — the 4 retained history rows resolve to only 2 distinct transaction(s), so some rows are duplicate records of the same call. Treat the change count as an upper bound.

> | Field | Value |
> |---|---|
> | Current Value | `1900000000000000000000 (1,900.000000e18)` |
> | Setter | `updateProposalThreshold(uint256 newThreshold)` |
> | Gated by | `guardian()` |
> | Tags | — |
> | Last changed | 2022-10-03 |
> | Changed by | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) |
> | Total changes | 4 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `newThreshold=1900000000000000000000 (1,900.000000e18)` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2022-10-03 |
> | 2 | `1400000000000000000000 (1,400.000000e18)` | `0x1748...2e56` | 2022-10-03 |
> | 3 | `newThreshold=1400000000000000000000 (1,400.000000e18)` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2022-05-24 |
> | 4 | `1000000000000000000000 (1,000.000000e18)` | `0x6535...89BB` (EOA) | 2022-05-24 |

---
<a id="c-0x941c2699ec7e55a50bde030d8e1e70649839259d"></a>
## > Guardian `0x941c2699eC7E55a50Bde030d8E1e70649839259D`

> > 💰 **Inherited supply authority** — holds `minter()` on **Coin**, `operator()` on **Lender**. Access controls on this contract gate root token supply.

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
> | `0x3FcB35a1CbFB6007f9BC638D388958Bc4550cB28` | EOA ⚠️ Hot wallet (1,458 txs) | — | EOA |
> | `0x962228a90eaC69238c7D1F216d80037e61eA9255` | EOA ⚠️ Hot wallet (1,788 txs) | — | EOA |
> | `0x9F3614afb3Df9f899caDBFfaA05c6C908059F726` | EOA | 2022-06-08 | EOA |
> | `0x6535020cCeB810Bdb3F3cA5e93dE2460FF7989BB` | EOA | — | EOA |
> | `0x2723723FDd3Db8ba2D6f0e1B333e90A7E60A0411` | EOA ⚠️ Hot wallet (1,627 txs) | 2022-07-02 | EOA |

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
Controls **6 role(s)** across **6 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| Lender `0xf8B3...49c9` | `operator()` | `setHalfLife(uint64 halfLife)`, `setTargetFreeDebtRatio(uint16 startBps, uint16 endBps)`, `setRedeemFeeBps(uint16 _redeemFeeBps)`, `setMaxBorrowDeltaBps(uint16 _maxBorrowDeltaBps)` +4 more | — |
| Factory `0x6D96...B849` | `operator()` | `setPendingOperator(address _pendingOperator)`, `setFeeRecipient(address _feeRecipient)`, `setFeeBps(uint256 _feeBps)`, `setCustomFeeBps(address _address, uint256 _feeBps)` | — |
| SwitchFeed `0xeca2...1ed0` | `operator()` | `switchFeed(address newFeed)`, `setPendingOperator(address newOperator)` | — |
| DynamicFeeCurveFeed `0x4C87...EECB` | `gov()` | `setMaxFee(int _maxFee)`, `setPendingGov(address _gov)` | — |
| ChainlinkBasePriceFeed `0x2239...b2c8` | `owner()` | `setHeartbeat(uint256 newHeartbeat)`, `setPendingOwner(address newPendingOwner)` | — |
| GovernorMills `0xBeCC...9Bf6` | `timelock()` | `queue(uint proposalId)` | — |


---
## ⛔ Sanctions Screening

| Source | Status |
|---|---|
| OFAC SDN | ✅ OFAC SDN screened (104 ETH addresses, cache: 2026-08-12) |
| Chainalysis | ✅ Chainalysis screened |
| **Result** | 29 addresses screened · ✅ 0 flagged |

---
## EOA Exposure Summary

The following roles are held by EOAs:

- **Guardian** → `deployer()` held by EOA `0x3FcB35a1CbFB6007f9BC638D388958Bc4550cB28`
  Functions: `allowCancel(uint proposalId, bool decision)`, `setPendingDeployer(address _deployer)`

---
## ✅ Scan Integrity

No issues detected. All block ranges covered, source and ABI resolved for all contracts.
