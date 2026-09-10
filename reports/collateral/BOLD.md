# Trustfall — Access Control Report — BOLD Stablecoin (BOLD)

| Field | Value |
|---|---|
| Contract | `0x6440f144b7e50D6a8439336510312d2F54beB01D` |
| Token | BOLD Stablecoin (BOLD) |
| Name | BoldToken |
| Chain | Ethereum |
| Proxy Status | ✅ No |
| OZ AccessControl | ❌ No |
| Ownable | ✅ Yes |
| Pausable | — |
| ERC-4626 Vault | — |
| Control Surface | ⚠️ Hybrid — 3 off-chain dependencies (oracle) |
| Scan Integrity | ✅ No issues detected |
| Report Date | 2026-09-10 16:28 UTC |

### Surface Summary

| Field | Value |
|---|---:|
| Contracts | 20 |
| Role slots | 168 |
| Privileged Fns | 92 |
| EOA Holders | 0 |
| Critical Roles | 0 |

## Changes Since Last Scan

> Comparing **2026-09-10T16:19:52Z** (block 25948129) → **2026-09-10T16:26:52Z** (block 25948165).

> ✅ No changes to roles, parameters, contracts, or findings.


## 📋 Protocol Context

> *From protocol profile: Liquity V2 / BOLD (CDP Stablecoin (immutable, multi-branch, permissionless))*

<details>
<summary><strong>Architecture</strong></summary>

- **What BOLD is:** the stablecoin of Liquity V2, a permissionless overcollateralized CDP system. A user locks collateral in a vault called a Trove and draws BOLD against it. BOLD is not backed by a reserve account or a redemption desk; every unit in existence is the debt of some Trove, and the collateral standing behind it sits in that Trove's branch. The whole system is deployed once and never changes: there is no governance contract, no owner, no upgrade path, no pause and no settable parameter anywhere in scope. Every number below is a compile-time constant or a constructor immutable, so what an analyst reads today is what the system will do for the rest of its life.

- **The token:** BoldToken 0x6440f144b7e50D6a8439336510312d2F54beB01D is a plain ERC-20 with mint and burn, and nothing else. It has no proxy, no pause and no blacklist. Its owner was set at deployment purely so a one-shot setup call could name the branch contracts, and that call renounces ownership on its way out, so ownership is now the zero address and the setup function can never run again. Mint and burn are gated by two fixed address sets written during that same setup, so the roster of contracts that may create or destroy BOLD was frozen at deployment.

- **How BOLD is created:** a borrower opens a Trove on one branch, deposits that branch's collateral token, and draws BOLD in the same transaction. There is no queue, no allowlist and no counterparty. Two constants bound the act: a Trove must carry at least 2,000 BOLD of debt, and it must stay above its branch's Minimum Collateral Ratio. Everything else is the borrower's choice. Closing a Trove is the reverse: repay the debt, the BOLD is burned, the collateral is released.

- **The three branches:** WETH, wstETH and rETH, each a self-contained stack of its own TroveManager, BorrowerOperations, ActivePool, DefaultPool, StabilityPool, SortedTroves and PriceFeed. CollateralRegistry 0xf949982B91C8c61e952B3bA942cbbfaef5386684 holds the roster and is the single entry point for redemption. Branches share the BOLD token, that registry, the InterestRouter that receives the non Stability Pool share of interest, and the Chainlink ETH/USD feed that all three PriceFeeds read on every price fetch. What is not shared is the balance sheet: a Trove on one branch has no claim on another branch's collateral and no liability for its bad debt. The collateral-ratio constants differ by collateral type: the WETH branch runs a 110 percent Minimum Collateral Ratio while both liquid-staking branches run 120 percent, and the Critical Collateral Ratios are 150 and 160 percent respectively.

- **Borrowers set their own interest rate:** this is the design choice that most distinguishes Liquity V2 from a typical CDP. There is no utilisation curve and no rate committee. Each borrower picks an annual rate between 0.5 and 250 percent when opening a Trove and may change it at any time. That rate does two jobs at once. It is the cost of the loan, paid continuously as debt that accrues onto the Trove, and it is the borrower's position in the redemption queue, because redemptions always hit the lowest-rate Troves first. A borrower who wants to be left alone bids their rate up; one who wants cheap debt accepts being redeemed against first.

- **Redemption is what holds the peg:** anyone may hand BOLD to the CollateralRegistry and receive an equal dollar value of collateral, taken from the lowest-interest-rate Troves across branches in proportion to each branch's unbacked debt. This is the arbitrage that pulls BOLD back to a dollar from below, and it costs a fee that floors at 0.5 percent and rises with redemption volume before decaying again. The redeemed borrower is not liquidated or penalised: their debt falls by exactly the BOLD redeemed and their collateral falls by the same dollar value, so redemption is a forced partial repayment rather than a loss event.

- **Liquidation and the Stability Pool:** a Trove that falls below its branch Minimum Collateral Ratio can be liquidated by anyone. The first stop is that branch's Stability Pool, where BOLD holders have deposited in advance. The pool burns BOLD equal to the bad debt and hands the seized collateral to depositors at a discount, which is how depositors are paid for standing first in line. Only if the pool is exhausted does the remaining debt and collateral redistribute onto the branch's other Troves. A detail worth knowing if you integrate: the pools move a depositor's BOLD without an ERC-20 allowance, because each pool is named directly in the token's frozen transfer set. As of block 25943559 the pools held roughly 6.9M, 7.0M and 4.7M BOLD against branch debts of about 11.3M, 18.9M and 4.1M.

- **How each branch is priced:** every branch reads a Chainlink push feed for the dollar price of its collateral, and the two liquid-staking branches additionally read a canonical exchange rate straight from the staking protocol itself, wstETH for the one and rETH for the other. The wstETH branch multiplies a stETH-USD price by that rate; the rETH branch takes the lower of its market price and its canonical price. Every oracle pointer is written once in a constructor with no setter anywhere in the inheritance chain, so the feeds a branch reads on its first day are the feeds it will read forever.

- **Branch shutdown and the exit that follows:** a branch shuts if its price feed stops returning a fresh, positive answer, or if its total collateral ratio falls below the branch Shutdown Collateral Ratio, 110 percent on WETH and 120 percent on the two liquid-staking branches. Shutdown is one-way and applies to that branch alone. New borrowing stops and ordinary redemption no longer routes there, but existing BOLD still has a claim on the collateral: a shut branch exposes urgentRedemption, which anyone may call to swap BOLD for that branch's collateral at a 2 percent bonus, with no interest rate ordering and no queue.

- **Where the interest goes:** interest accrued by borrowers is minted as new BOLD and split at a fixed 75 percent to that branch's Stability Pool depositors, with the remainder sent to an InterestRouter at 0x807DEf5E7d057DF05C796F4bc75C3Fe82Bd6EeE1. That router is Liquity V2's Governance contract, which directs the protocol's own revenue to incentives; its ownership was renounced at block 22516144. Nothing in that path can reach a Trove, a price, or the mint and burn sets.

- **Scope and provenance:** this report covers BOLD and the Liquity contracts that issue and back it. The asset actually proposed for FiRM is ysyBOLD, a Yearn vault that deposits into these Stability Pools; the Yearn stack has its own access control surface and is a separate study, not covered here. Twenty contracts across the three branches plus the shared token and registry, all verified on Etherscan and all compiled from the public liquity/bold repository at the single tagged deployment commit. Sixteen of the seventeen core contracts reproduce byte-for-byte from that commit, and the three branches are one codebase parameterised rather than three separate deployments, with the wstETH and rETH TroveManagers sharing identical runtime bytecode. As of block 25943559 the system carried roughly 34.4M BOLD of debt across 216 Troves.


</details>

<details>
<summary><strong>📖 Terms</strong> <em>— recurring protocol jargon</em></summary>

- **Trove** — A single borrower's collateralised debt position: one collateral deposit, one BOLD debt, one borrower-chosen interest rate. Represented as an ERC-721 (TroveNFT), so a Trove is transferable. The Liquity V2 equivalent of a CDP or a vault.
- **Branch** — One collateral market, complete with its own BorrowerOperations, TroveManager, StabilityPool, ActivePool and PriceFeed. BOLD has exactly three: WETH, wstETH and rETH. Branches share the BOLD token and the CollateralRegistry, and each has its own shutdown path, but they are NOT independent in practice: all three PriceFeeds read the SAME Chainlink ETH/USD aggregator, so one ETH/USD staleness event shuts all three at once. See critical_parameters lever 2.
- **Stability Pool (SP)** — A per-branch pool of deposited BOLD that absorbs liquidations: it burns BOLD and receives the liquidated collateral at a discount. Depositors earn 75 percent of the branch's interest revenue (SP_YIELD_SPLIT). These three pools are exactly what the Yearn yBOLD strategies deposit into, and therefore the yield source behind the ysyBOLD asset FiRM would hold.
- **Redemption** — Anyone may exchange BOLD for collateral at face value, permissionlessly, which is the mechanism that defends the peg from below 1 dollar: swapping BOLD for a dollar of collateral only pays while BOLD trades under par, so it acts as a floor rather than a ceiling. Redemptions hit the LOWEST-INTEREST-RATE Troves first, across branches in proportion to each branch's unbacked portion. This makes a low rate a redemption risk rather than a free lunch, and it is the core economic difference from a liquidation-only CDP design.
- **Urgent Redemption** — The redemption mode available only against a SHUT-DOWN branch. It pays a 2 percent collateral bonus (URGENT_REDEMPTION_BONUS) and ignores the interest-rate ordering, so BOLD holders retain an exit even from a branch that has permanently halted.
- **Branch Shutdown** — Permanent and irreversible closure of one collateral market. Reached two ways: permissionlessly via shutdown() once the branch falls below its SCR, or automatically via shutdownFromOracleFailure() when the PriceFeed detects Chainlink failure. There is no un-shutdown function and no admin who could add one.
- **CCR / MCR / SCR / BCR** — The four collateral-ratio thresholds. MCR, CCR and SCR are per-branch `immutable`s assigned in the constructor from the branch AddressesRegistry, and the values they are given are the Constants.sol constants, so they are fixed after deployment but are not themselves compile-time constants. MCR is the liquidation threshold (110 percent WETH, 120 percent LST). CCR is the critical ratio below which risk-increasing operations are restricted (150/160). SCR is the shutdown ratio (110/120). BCR is a 10 percent buffer required only to JOIN a batch or to adjust a Trove inside one; liquidation tests ICR against MCR alone, so BCR is not a liquidation threshold and does not raise the effective one.
- **Batch Manager** — A delegate that sets the interest rate for many Troves at once, charging an annual management fee capped at 10 percent (MAX_ANNUAL_BATCH_MANAGEMENT_FEE). Borrowers opt in. A batch manager can change a delegating Trove's rate but cannot touch its collateral or debt principal.
- **Zombie Trove** — A Trove left below MIN_DEBT (2000 BOLD) after a partial redemption. It is removed from the redemption ordering and cannot be adjusted normally, only via adjustZombieTrove, which prevents redemptions from creating unusable dust positions.
- **Aggregate Interest** — Liquity V2 accrues interest at the branch level rather than per Trove. ActivePool periodically mints the accrued amount as new BOLD (mintAggInterest) and splits it 75/25 between the StabilityPool and the InterestRouter. This is why the ActivePools hold mint authority over BOLD alongside the BorrowerOperations contracts.
- **InterestRouter / Governance** — The shared contract at 0x807def5e that receives the 25 percent of interest revenue not paid to Stability Pools and routes it to LQTY-staker-voted initiatives. It is Liquity V2's only governance surface, it is permissionless, and it holds no authority whatsoever over BOLD minting, burning, pausing or upgrading.

</details>

<a id="sec-off-chain-deps"></a>
<details>
<summary><strong>🌐 Off-Chain Dependencies</strong> — risk that extends beyond the chain</summary>

> *3 control surfaces extend beyond on-chain observability. Each entry shows what the analyst CAN observe (on-chain signal) alongside the off-chain dependency it relies on.*

- **1. oracle** 🟠 — Collateral prices for all three branches come from Chainlink push feeds. Liquity cannot set, override or pause them, but it also cannot function without them.
    - *On-chain signal:* PriceFeed.priceSource() per branch. 0 = primary. READ THIS CAREFULLY: any non-zero value means the branch has ALREADY been permanently shut, because both writers of the variable call shutdownFromOracleFailure() first. The WETH feed can only ever read 0 or 2; the two LST feeds can also read 1. So priceSource is a POST-MORTEM flag, not an early warning. Reading a non-zero value as merely "fallback engaged" understates it. The leading indicator is latestRoundData().updatedAt on 0x5f4ec3df / 0xcfe54b5c / 0x536218f9 measured against the branch threshold. Branch halt is separately observable via TroveManager.shutdownTime() and BorrowerOperations.hasBeenShutDown().
    - *Off-chain dependency:* Chainlink ETH/USD 0x5f4ec3df (shared by all three branches), STETH/USD 0xcfe54b5c, RETH/ETH 0x536218f9. Each proxy is owned by 0x21f73d42, which can swap the underlying aggregator with no delay.
    - *Recovery path:* Degradation is automatic and one-way. On staleness or a failed round the PriceFeed calls BorrowerOperations.shutdownFromOracleFailure(), which permanently shuts that branch. There is no admin able to restore it, no un-shutdown function, and no governance vote that can intervene. Existing BOLD stays redeemable through urgentRedemption against the shut branch. Note the tolerance window, which is the part that bites before the shutdown does. A frozen but non-reverting feed is accepted as VALID for up to 86400s (172800s on RETH/ETH), and every liquidation and redemption inside that window executes on the stale price. Against measured heartbeats that is 24 missed beats of tolerance on ETH/USD and STETH/USD but only one on RETH/ETH. Note also that the shutdown is NOT per-branch in practice: all three feeds read the same ETH/USD aggregator, so one ETH/USD failure shuts all three. See critical_parameters lever 2.
- **2. oracle** 🟠 — SECOND, NON-CHAINLINK ORACLE INPUT (wstETH branch). The wstETH PriceFeed reads a canonical exchange rate straight out of Lido's own accounting: wstETH.stEthPerToken(), which is stETH.getPooledEthByShares(1 ether), which is internalEther / internalShares. That is not a price bought from a vendor, it is a live read into Lido's share ledger, so BOLD's wstETH branch inherits Lido's oracle and governance risk directly. This is NOT a cross-check. The wstETH feed computes stEthUsdPrice * stEthPerToken / 1e18 and compares the canonical rate to nothing at all; the canonical rate here IS the unit conversion. A wrong but non-zero Lido rate therefore propagates unchecked. At block 25942842 this branch carried 54.98 percent of BOLD's 34,390,040 total debt, the largest of the three.
    - *On-chain signal:* PriceFeed.rateProviderAddress() (constructor-set storage with NO setter anywhere in the PriceFeed inheritance chain; wstETH -> 0x7f39c581, live-verified block 25935176), and the rate itself as wstETH.stEthPerToken(). WHERE THE MUTABLE HOP ACTUALLY IS, verified block 25942986: wstETH is NOT a proxy (EIP-1967 implementation and admin slots both read 0x0) and its stETH pointer is constructor-only, so a monitor pointed at wstETH watches an IMMUTABLE contract and would never fire. The mutable hop is stETH, one contract further out: stETH.proxyType() = 2 (AppProxyUpgradeable), and its base is Kernel 0xb8FFC3Cd.getApp(APP_BASES_NAMESPACE, 0x3ca7c3e3...), confirmed equal to the live implementation 0x028271E3 at that block. LIMIT OF THESE SIGNALS: they detect a rate that REVERTS or returns 0. _getCanonicalRate validates non-zero ONLY, with no bound, no rate-of-change limit and no timestamp check, so a corrupt or FROZEN non-zero rate leaves priceSource 0 and shutdownTime 0 and emits nothing. BOLD applies a staleness threshold to all three Chainlink inputs and NONE to either canonical rate. Monitor instead: Kernel 0xb8FFC3Cd SetApp for appId 0x3ca7c3e3, ACL 0x9895F0F1 SetPermission for role 0xb6d92708 on app 0xb8FFC3Cd (the just-in-time grant that must precede any stETH base swap), and the frame-over-frame delta in wstETH.stEthPerToken().
    - *Off-chain dependency:* Lido. Cycle 3 enumerated the authority end to end rather than naming it, which is the Q-11 answer for this branch. There are TWO movers, not one. (1) GOVERNANCE MOVER, changes the SEMANTICS. Kernel.setApp is gated on ACL 0x9895F0F1 APP_MANAGER_ROLE. VERIFIED block 25942986: ACL.getPermissionManager(Kernel, APP_MANAGER_ROLE) = 0x3e40D73E, the Lido DAO Agent. READ THE MANAGER, NOT THE GRANTEES: the live GRANTEE set is EMPTY (hasPermission = 0 for the Agent, Voting, the admin Executor and the Kernel itself, verified block 25942986), so a grantee census reports that nobody can upgrade stETH. The authority is the permission MANAGER, which can grant to itself just in time inside the same execution. Full chain: Aragon Voting 0x2e59A20f (the only DualGovernance proposer) -> DualGovernance 0xC1db28B3 -> EmergencyProtectedTimelock 0xCE042530 -> admin Executor 0x23E0B465 -> Agent 0x3e40D73E -> ACL.grantPermission -> Kernel.setApp. Exercised six times; the current base was installed at block 25603297 and the last two swaps executed as execute(uint256) on 0xCE042530, confirming the route by observation. LEAD TIME, stated precisely because the single-number version was wrong: 9 days OBSERVED (voteTime 432000 + afterSubmitDelay 259200 + afterScheduleDelay 86400), 8 days EMERGENCY FLOOR at current config (emergencyExecute runs with afterScheduleDelay and minExecutionDelay both 0; the two emergency committees 0x8b785448 4-of-7 and 0xc7792b3f 5-of-7 are the SAME seven addresses, all plain EOAs, seated until 2027-06-20), and a 5 day STRUCTURAL floor, because setAfterSubmitDelay and setAfterScheduleDelay are settable by 0x23E0B465 bounded only by afterSubmit + afterSchedule >= MIN_EXECUTION_DELAY 259200. The delays are a configuration, not an invariant, though reconfiguring them itself costs one full cycle. The 5 day vote component IS hard: _canExecute requires VotePhase.Closed, there is no early-execution branch, and UNSAFELY_MODIFY_VOTE_TIME_ROLE has no live holder. (2) ROUTINE MOVER, changes the VALUE, and involves no governance at all. The share rate is rewritten once per 86400s frame by AccountingOracle 0x852deD01 on HashConsensus 0xD624B08C. VERIFIED block 25942994: quorum 5 of 9, and ALL NINE members are plain EOAs (eth_getCode = 0 on each); getFrameConfig gives 225 epochs, which is 86400s. Lead time ZERO. This is the real no-notice authority over 55 percent of BOLD's debt and it was absent from this profile entirely before cycle 3. BOUND ON THE ROUTINE MOVER, and it is asymmetric in the direction that hurts BOLD. VERIFIED block 25942994 on OracleReportSanityChecker 0x147f8d3c: maxPositiveTokenRebase 750000 (+0.075 percent per report) against maxCLBalanceDecreaseBP 360 (3.6 percent over the consensus-layer window), roughly 48x looser DOWNWARD, and secondOpinionOracle() = 0x0 so the bound is a hard revert rather than a second-opinion softening. Down is the direction BOLD cares about and it is the loose one. Widening the cap runs the same multi-day Agent path. OUT OF SCOPE OF THIS RATE: Lido V3 external vault shares are live (getExternalShares nonzero, cap 3000 BP, VaultHub 0x1d201be0) and do NOT enter BOLD's rate, because getPooledEthByShares is internalEther / internalShares and external ether derives from that same internal rate.
    - *Recovery path:* There is no recovery. RANKING: this is NOT harder than ETH-USD, and that is the comparison that matters. An ETH-USD failure calls the same _shutDownAndSwitchToLastGoodPrice, lands in the same terminal priceSource 2, and does so on ALL THREE branches at once because all three PriceFeeds read the same aggregator 0x5f4ec3df. Measured at block 25942842 the branch split of 34,390,040 BOLD was WETH 32.96, wstETH 54.98, rETH 12.07 percent, so the worst single canonical failure freezes 54.98 percent of system debt while an ETH-USD failure freezes 100 percent. RANK ETH-USD FIRST. WHAT SURVIVES: the canonical rate IS a harder dependency than the LST MARKET feed. Canonical reverts or returns 0 -> _shutDownAndSwitchToLastGoodPrice, frozen. Market feed fails -> _shutDownAndSwitchToETHUSDxCanonical, which ALSO calls borrowerOperations.shutdownFromOracleFailure(), so BOTH shut the branch permanently. They differ only in the price a shut branch then uses. THE MARKET-FEED FALLBACK IS NOT A LIVE PRICE. It is min(ETH-USD x canonical, lastGoodPrice) written back into lastGoodPrice on every call, a permanent DOWNWARD RATCHET. It is also adversary-driven, because fetchPrice() and fetchRedemptionPrice() are public and ungated on all three feeds, so any address can call at a block of its choosing and lower the ceiling at gas cost only. SIZE OF THE STEP IS NOT STRUCTURAL. The wstETH PRIMARY price is stEthUsdPrice * stEthPerWstEth / 1e18 (deployed WSTETHPriceFeed line 64), so it tracks the stETH MARKET, whereas canonical mode uses ethUsdPrice * stEthPerWstEth. The gap between the two is therefore the STETH/USD versus ETH/USD SPREAD at that instant, which sits either side of 1 and is not a fixed drop. Measured 1.0039 at block 25943300, i.e. canonical ABOVE market. DIRECTION. When stETH trades BELOW ETH, canonical mode prices the collateral ABOVE its true market value, so the redeemer receives LESS collateral per BOLD. That is the direction which applies in the scenario that triggers the mode, an STETH/USD feed failure. TWO STRUCTURAL POINTS, which matter more than any single-block reading. (a) Canonical mode is bounded ABOVE by lastGoodPrice through the min(), so for a BOLD holder it can never be BETTER than the frozen case, only equal or worse. (b) It is NOT terminal. A branch in canonical mode DEGRADES INTO the frozen mode if ETH-USD later fails (RETHPriceFeed line 167) or if the canonical rate provider fails (line 188). So canonical mode is a waypoint, not a floor, and the frozen-price analysis applies to it as well. urgentRedemption pays collLot = boldLot * 1.02e18 / price (URGENT_REDEMPTION_BONUS = 2e16, deployed TroveManager line 3486, math at line 858). CAUTION for any reader checking this: the in-source comment at line 859 says "1% bonus" against its own 2e16 constant, and the Cantina README repeats $1.01. The CONSTANT is authoritative.
- **3. oracle** 🟠 — SECOND, NON-CHAINLINK ORACLE INPUT (rETH branch), kept separate from the wstETH entry because the two are structurally different. The rETH PriceFeed calls rETH.getExchangeRate(), which resolves the registry key contract.address.rocketNetworkBalances out of RocketStorage 0x1d8f8f00 ON EVERY CALL and divides getTotalETHBalance() by getTotalRETHSupply(). UNLIKE the wstETH branch this one IS a genuine cross-check: the normal path takes min(market, canonical), so a wrong canonical rate is capped upward and passes downward. At block 25942842 the rETH canonical rate sat 0.2051 percent ABOVE market, inside the deviation window, so canonical was the binding rETH redemption price at that moment. This branch carried 12.07 percent of system debt.
    - *On-chain signal:* PriceFeed.rateProviderAddress() (constructor-set, no setter; rETH -> 0xae78736c, live-verified block 25935176) and the rate as rETH.getExchangeRate(). rETH itself cannot be upgraded: _upgradeContract hard-rejects keccak("rocketTokenRETH"). The mutable surface is the REGISTRY, not the token. Monitor RocketStorage.getAddress(0x7630e125...) for a re-point, RocketNetworkBalances.getBalancesTimestamp() as the liveness signal, and RocketDAOProtocolSettingsNetwork.getSubmitBalancesEnabled() for the council freeze, which has NO advance event of any kind. SAME LIMIT AS THE wstETH ENTRY: _getCanonicalRate validates non-zero only, so a FROZEN rate is invisible. BOLD applies no staleness check to the canonical rate, which is what makes the freeze lever below silent.
    - *Off-chain dependency:* Rocket Pool. FOUR distinct authorities, in order of speed. The oracle DAO, the one usually named, is the third of them. (1) SECURITY COUNCIL, ONE BLOCK, no timelock and no veto. VERIFIED block 25942991: the RocketStorage bool dao.security.allowed.setting / network / network.submit.balances.enabled = 1, so the council may set that flag false and FREEZE the rate, and getSubmitBalancesEnabled() = 1 today. rocketDAOSecurity 0x84aE6D61 has getMemberCount() = 1 and that single member is 0x6C565aF3, itself a Gnosis Safe, threshold 2 of 3 owners, ALL THREE OWNERS PLAIN EOAs, ZERO modules. Its lone 1e18 vote clears the 0.51e18 quorum and RocketDAOProposal.getState returns Succeeded the instant votesFor >= votesRequired, so propose, vote and execute complete in about one block. Because BOLD applies no staleness check to the canonical rate the freeze is SILENT: no shutdown, no event, and under min(market, canonical) the stale rate becomes the binding under-valuation, drifting roughly 0.006 percent per day below true. (2) ANY REGISTERED CONTRACT, unbounded storage write. The balances do not live in RocketNetworkBalances; they are RocketStorage keys keccak("network.balance.total") and keccak("network.balance.reth.supply"), and setUint is gated only by booleanStorage[keccak256("contract.exists", msg.sender)] with NO per-key scoping. Two spent one-off helpers, 0x5b3B5C76 and 0x91003ad0, hold that write access today. The full set is NOT enumerable from chain state and remains an open cycle-4 item. (3) oDAO SUBMISSION, capped and slow. 10 members, all plain EOAs, 6-of-10. RPIP-61 caps each update at getMaxRethDelta() = 2e16 (2 percent relative) with a minimum interval of 82080s; measured cadence 23.96h to 24.05h over 8 consecutive updates against real moves of about 0.006 percent, so the cap sits roughly 340x above normal. Neither the cap nor the frequency is council-settable. (4) REGISTRY RE-POINT, 604800s measured delay. The key contract.address.rocketNetworkBalances has been re-pointed twice: 0x07FCaBCb -> 0x6Cc65bF6 at block 20107789, and 0x6Cc65bF6 -> 0x1D9F14C6 at block 24479994 (2026-02-17). BOLD's RETHPriceFeed held 2916 bytes of code at block 24479993, so the rate source was replaced UNDERNEATH A LIVE BOLD BRANCH. The 7 day delay is measured, not read: live proposal 2 emitted UpgradePending at block 25895979 (ts 1788428867) with getEnd(2) = 1789033667, a delta of exactly 604800. GUARDIAN, verified descoped rather than assumed. VERIFIED block 25942986: getGuardian() = 0x0cCF1498 is a LIVE EOA (zero code, nonce 407, 8.90 ETH), so it has not been burned, but getDeployedStatus() = 1 and that flag is one-way. Simulated calls from the guardian revert "Bootstrap mode not engaged" on both bootstrap paths and "Already executed" on both one-shot upgrade contracts, while a negative control from 0x...dEaD reverts "Account is not a temporary guardian", which proves the guardian gate was PASSED and the bootstrap flag was the blocker.
    - *Recovery path:* There is no recovery from a canonical failure on this branch either, and the same ranking correction applies: an ETH-USD failure is worse, because it freezes all three branches at once. See the wstETH entry for the measured branch split and for the downward-ratchet correction, both of which apply identically here. What is SPECIFIC to this branch: the ordinary path is min(market, canonical), so a corrupted-HIGH canonical rate is capped there. It is NOT harmless overall. On a redemption, where the two sit within 2 percent of each other, the branch takes the max instead, so an inflated canonical rate binds on precisely the transactions that defend the peg. A corrupted-LOW or FROZEN rate binds on both paths and under-values the collateral. ON THE ZERO-SUPPLY CASE: a zero rETH supply would snap the rate to 1e18, but it is NOT reachable through oracle submission (_updateBalances divides by _rethSupply, so a zero-supply submission is a Solidity 0.8 panic and never writes, and RPIP-61 caps that path anyway). It is reachable only through authority (2) above, a direct setUint that bypasses _updateBalances. It is a governance and registration path, not an oracle path, and must NOT be published as a live oracle failure mode.

</details>

<a id="sec-market-ceilings"></a>
<details>
<summary><strong>📊 Collateral Branches</strong> <span class="section-sub">per-branch collateralization and buffer health, live each scan</span></summary>

> *3 market(s). No per-market ceiling exists: this asset is UNCAPPED by design, so there is no mint cap to report and none to monitor. Enumerated live each scan, so a newly-registered market appears automatically. Tracked in Changes-Since: **SCR**, **shutdownTime**. Live snapshot only, deliberately NOT diffed because it moves every block: Collateral, Debt (BOLD), Protocol price, Stability Pool, CR, % of debt, Pool cover, Troves.*

| # | Market | Name | Collateral | Debt (BOLD) | Protocol price | Stability Pool | CR | SCR | % of debt | Pool cover | Troves | shutdownTime |
|---:|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 0 | [`0x7bcb...Cf5A`](https://etherscan.io/address/0x7bcb64B2c9206a5B699eD43363f6F98D4776Cf5A) | WETH | 10,440 | 11.3M | 2,430 | 6.9M | 224.1% | 110% | 32.9% | 61.2% ⚠️ | 111 | live |
| 1 | [`0xA289...8B22`](https://etherscan.io/address/0xA2895d6A3bf110561Dfe4b71cA539d84e1928B22) | wstETH | 16,827 | 18.9M | 3,022 | 7.0M | 268.5% | 120% | 55.0% | 37.0% 🔴 | 85 | live |
| 2 | [`0xb2B2...e19e`](https://etherscan.io/address/0xb2B2ABEb5C357a234363FF5D180912D319e3e19e) | rETH S shielded | 5,789 | 4.2M | 2,840 | 4.7M | 396.2% | 120% | 12.1% | 112.3% | 20 | live |

<strong>Reading this table</strong>

- **Collateral**: Units of the branch's own collateral token, not dollars. WETH, wstETH and rETH are three different assets, so these three numbers are not comparable with each other. Multiply by Protocol price to get a dollar value.
- **Debt (BOLD)**: BOLD borrowed against that collateral, which is this branch's size. The three sum to essentially the whole BOLD supply.
- **Protocol price**: USD per unit of collateral, as the protocol itself prices Troves. Deliberately NOT the live market price: it is only written on a successful oracle fetch, so it lags in normal operation, and it freezes permanently if the branch shuts.
- **Stability Pool**: BOLD deposited in this branch's Stability Pool. This is the first loss buffer: liquidations are absorbed here first, and only once it is exhausted does a liquidation redistribute onto the branch's remaining borrowers.
- **CR**: Collateralization at the protocol's own price: collateral value divided by debt. 200% means two dollars of collateral behind every dollar of debt. Read it against SCR, which is the floor.
- **SCR**: Shutdown Collateral Ratio, the floor. If CR falls below it, anyone can shut the branch permanently and irreversibly. It is a deployed immutable, so it must never move, which is why it is tracked in Changes-Since.
- **% of debt**: This branch's share of total BOLD debt. The weighting that decides which single branch failing matters most to a holder.
- **Pool cover**: Stability Pool as a percentage of this branch's debt. This one number carries two opposite facing consequences. Below 100 it measures loss absorption: how much of the branch's debt the pool can eat before liquidations start redistributing losses onto the remaining borrowers. At or above 100 the branch also reports zero unbacked debt, which removes it from the redemption route entirely, so redemption pressure concentrates on the other branches and total system redemption capacity per call shrinks.
- **Troves**: Open borrower positions on this branch.
- **shutdownTime**: The tripwire. "live" means the branch is operating. Any other value is the timestamp at which it was permanently and irreversibly shut. Tracked in Changes-Since, and it must read live forever.
- S **shielded**: The Stability Pool covers this whole branch, so it reports zero unbacked debt and CollateralRegistry routes no redemptions to it. Conditional rather than structural: if every branch reaches zero unbacked, redemption falls back to routing by branch size and the shield disappears without anything changing on this branch.

</details>

<a id="sec-oracle-surface"></a>
<details>
<summary><strong>🔮 BOLD Oracle Wiring + Immutability Tripwires</strong> <span class="section-sub">live price-source wiring, branch health, and the frozen-authority tripwires</span></summary>

> *Live-read each scan; a repointed feed or retuned delay is flagged in Changes-Since. This section is the LIVE STATE. Liquity itself has no function that can move any of it, which is exactly why it is worth diffing: every row below should be constant forever, so ANY change is a signal rather than routine operation. The first two groups are the tripwires (a non-zero BoldToken.owner would mean this is not the contract we profiled, and a changed CollateralRegistry would mean the same). The priceSource and shutdownTime rows are the branch health indicators: priceSource 0 means the branch is on its primary Chainlink feed, and shutdownTime 0 means the branch is live. The Chainlink rows are the one genuinely mutable hop in the whole chain, and they are mutable by Chainlink, not by Liquity or by any Liquity holder.
*

| Piece | Resolves to | Authority | Delay | Note |
|---|---|---|---|---|
| 1. BoldToken owner (MUST stay 0x0 forever) | [`0x0000...0000`](https://etherscan.io/address/0x0000000000000000000000000000000000000000) | none - renounced at block 22516130 by setCollateralRegistry, no re-grant path exists | frozen |  |
| 2. BoldToken CollateralRegistry pointer (frozen) | [`0xf949...6684`](https://etherscan.io/address/0xf949982B91C8c61e952B3bA942cbbfaef5386684) | none - its only setter self-renounces ownership | frozen |  |
| 3. Shared InterestRouter / Governance pointer (frozen) | [`0x807D...EeE1`](https://etherscan.io/address/0x807DEf5E7d057DF05C796F4bc75C3Fe82Bd6EeE1) | none - constructor immutable on ActivePool. Same value on all 3 branches. | frozen |  |
| 4. WETH branch price source (0 = primary Chainlink) | `0` | not settable - moves only when the PriceFeed detects Chainlink failure | immediate |  |
| 5. wstETH branch price source (0 = primary Chainlink) | `0` | not settable - moves only on Chainlink failure | immediate |  |
| 6. rETH branch price source (0 = primary Chainlink) | `0` | not settable - moves only on Chainlink failure | immediate |  |
| 7. WETH branch shutdown time (0 = live) | `0` | permissionless shutdown() on SCR breach, or PriceFeed on oracle failure. IRREVERSIBLE. | immediate |  |
| 8. wstETH branch shutdown time (0 = live) | `0` | permissionless shutdown() or PriceFeed. IRREVERSIBLE. | immediate |  |
| 9. rETH branch shutdown time (0 = live) | `0` | permissionless shutdown() or PriceFeed. IRREVERSIBLE. | immediate |  |
| 10. Chainlink ETH/USD live aggregator (shared by ALL 3 branches) | [`0x7d4E...6Fb5`](https://etherscan.io/address/0x7d4E742018fb52E48b08BE73d041C18B21de6Fb5) | Chainlink proxy owner 0x21f73d42 via proposeAggregator/confirmAggregator, NO delay. THE highest-leverage mutable hop in the whole chain. | none | Chainlink tier: Low Market Risk. Heartbeat 3600s, deviation 0.5 percent. Read from the feed page 2026-09-10. Off chain attribute: it can change with no on chain event, so treat this as dated rather than live. |
| 11. Chainlink ETH/USD proxy owner | [`0x21f7...73CA`](https://etherscan.io/address/0x21f73D42Eb58Ba49dDB685dc29D3bF5c0f0373CA) | Chainlink. Outside Liquity's control entirely. | none |  |
| 12. Chainlink STETH/USD live aggregator (wstETH branch) | [`0x26f1...240f`](https://etherscan.io/address/0x26f196806f43E88FD27798C9e3fb8fdF4618240f) | Chainlink proxy owner 0x21f73d42, no delay. | none | Chainlink tier: Medium Market Risk, tagged Pegged Asset. Heartbeat 3600s, deviation 1 percent. Read from the feed page 2026-09-10. |
| 13. Chainlink RETH/ETH live aggregator (rETH branch) | [`0xc779...093d`](https://etherscan.io/address/0xc77904CD2CA0806CC3DB0819E9630FF3e2f6093d) | Chainlink proxy owner 0x21f73d42, no delay. 172800s staleness, the loosest in the system. | none | Chainlink tier: VERY HIGH Market Risk, tagged Pegged Asset. Heartbeat 86400s, deviation 2 percent. Read from the feed page 2026-09-10. Chainlink's own machine readable directory still reports this feed as medium, so the escalation is visible only on the feed page and is not detectable programmatically. |

</details>

<a id="sec-critical-params"></a>
<details>
<summary><strong>🎚️ Critical Parameter Levers</strong> — the one-tx risk levers to watch</summary>

> *3 on-chain parameter levers that are curated as high-impact for lender-side risk (direct dilution / safety-mechanism closure / authority transfer / oracle repointing). Each entry shows current value, the threshold that triggers the impact, and the role-holder controlling the lever.*

- **1. `AggregatorProxy.confirmAggregator(address) / proposeAggregator(address)`** 🟠 on **Chainlink ETH/USD proxy (0x5f4ec3df)**
    - *Role gate:* Chainlink, not Liquity. One 4-of-9 Gnosis Safe owns all three price proxies AND all three underlying aggregators, so the repoint and the aggregator internals share a single quorum, and there is no timelock on either step. All nine owners are plain EOAs, so the authorising quorum is four private keys. The Safe also carries one enabled module that splits authorisation from execution: the 4-of-9 confirms a transaction, but any one of eight executors fires it, and six of those eight hold no vote. Five transactions are confirmed and not yet executed, and their contents are not recoverable off chain because only a hash is committed. Read it as: authorise with 4 of 9 keys, execute with any 1 of 8, no delay.
    - *Threshold:* A repoint changes the price input for all three branches at once. It has never happened on these feeds during BOLD's lifetime, and no repoint is currently pending.
    - *Impact:* ETH/USD is the single input every branch depends on, so a bad or manipulated aggregator misprices every Trove in the system at the same moment. Liquity has no override, no circuit breaker and nobody who can intervene. This entry is NOT graded for Chainlink's own operational risk. BOLD's three feeds are ordinary Chainlink feeds with no customisation, and FiRM already accepts normal Chainlink feed risk on DOLA, crvUSD, frxUSD, USDe and Monolith invUSD. Grading it again here would double-count a baseline we have already accepted. It keeps a HIGH grade for three reasons that are Liquity's design, not Chainlink's. There is no escape hatch: the feed pointer is fixed at deployment, so where most protocols would migrate oracles by vote, BOLD's only available outcome is permanent branch shutdown. One feed serves all three branches, so an event that would normally be contained becomes system-wide. And shutdown is irreversible, so a temporary outage produces a permanent loss of that branch. One practical consequence for FiRM: three of the four ways this surface can move take effect immediately, and one of them emits no event at all. Monitoring here gives awareness after the fact, not protection, so this belongs in the collateral factor and in position sizing rather than in an alert. A repoint also carries a quieter hazard on the decimals path. It cannot break anything, because each feed caches its decimals at construction, but a repoint to a feed with different decimals would silently mis-scale the price, and nothing would trip. The three feeds read 8, 8 and 18 decimals today, and decimals have never changed across nine aggregator generations.
- **2. `shutdownFromOracleFailure()`** 🟠 on **BorrowerOperations, all three branches**
    - *Role gate:* Nobody. It is called by the branch's own PriceFeed when a price read fails. There is no key, no role and no way to prevent it or reverse it.
    - *Threshold:* A branch shuts if its feed stops returning a fresh positive answer within that branch's staleness window, or if the branch's collateral ratio falls below its Shutdown Collateral Ratio. Shutdown is one-way and shuts one branch at a time, but the triggers are not independent: all three PriceFeeds read the same Chainlink ETH/USD feed on every price fetch, so a failure there trips the condition on all three branches at once.
    - *Impact:* Shutdown ends borrowing on that branch permanently, and ordinary redemption stops routing to it. Existing BOLD still has a claim on the collateral through urgentRedemption, which anyone may call for a 2 percent collateral bonus. That bonus is the part that is easy to over-read as comfort, because it is paid against the price frozen at the moment of shutdown rather than the market price. A holder recovers roughly 2 percent above a stale valuation, so the entire bonus is consumed by a 1.96 percent adverse move in the collateral. Measured across BOLD's own history, a 24 hour freeze is already past that point about a fifth of the time, and because the freeze never lifts the gap keeps widening: the median drift reaches roughly 11 percent after a month. On the two liquid-staking branches the margin is thinner still. If the frozen price happened to be written by a redemption, it can sit above true collateral value, and break-even falls to about 1 percent on wstETH and slightly BELOW par on rETH. Those two branches carry about two thirds of system debt. This is a worst case rather than today's state; the live gap was near zero when last measured. The practical reading: urgentRedemption reliably enforces a floor under BOLD, but it does not defend par, and how far below par that floor sits depends on how far the collateral has moved since the freeze.
- **3. `wstETH.stEthPerToken() / rETH.getExchangeRate() (canonical LST rate)`** 🟠 on **wstETH 0x7f39c581 (reads Lido stETH 0xae7ab965) and rETH 0xae78736c**
    - *Role gate:* Neither Liquity nor Chainlink. Each liquid-staking branch reads an exchange rate straight out of the issuing protocol's own accounting. On the Lido side the rate is moved by two different actors. A daily oracle committee of nine, five of whom must agree and all of whom are plain EOAs, rewrites the value once every 24 hours with no notice and no governance step. Separately, Lido governance can replace the contract that computes it, which takes several days and runs through a vote, a timelock and an executor. On the Rocket Pool side the fastest actor is not the oracle DAO. A security council of a single 2-of-3 multisig can freeze rate updates in about one block, with no timelock, no veto and no advance event. Behind it sit an unrestricted storage-write set, then the ten-member oracle DAO under a 2 percent per-update cap, then a registry re-point on a seven day delay.
    - *Threshold:* Any change to the returned rate reprices every Trove on that branch immediately. A revert or a return of exactly zero shuts the branch permanently.
    - *Impact:* Each liquid-staking branch inherits its issuer's oracle and governance directly, with nothing in between. Liquity cannot re-point these, and neither can anyone else, because the pointers are fixed at deployment. The two branches are NOT protected equally, which is the part worth carrying forward. The rETH branch compares its market price against its canonical rate and takes the LOWER on the ordinary path, so an overstated Rocket Pool rate is capped there. That cap is directional and it is not the whole story: on a redemption, when the two sit within 2 percent of each other, the branch takes the HIGHER instead, which Liquity added to blunt redemption oracle arbitrage. So an overstated canonical rate does bind, on exactly the transactions that defend the peg, and an understated or frozen one binds on both paths. The wstETH branch multiplies the two together and compares the canonical rate to nothing at all, so a wrong but non-zero Lido rate passes through unchecked, on the branch that carries the largest share of system debt. What the signals will and will not tell you: BOLD checks these rates only for a non-zero value. It applies a staleness threshold to every Chainlink input and none to either canonical rate, so a rate that is simply frozen, or simply wrong, produces no event, no shutdown and no visible change in the report. The daily Lido move is bounded, but asymmetrically and in the direction that matters to a lender: roughly 0.075 percent per report upward against 3.6 percent downward.

</details>

## 📑 Table of Contents

1. [Analyst Focus Areas](#analyst-focus-areas)
2. Contracts
   - [BOLD ★](#c-0x6440f144b7e50d6a8439336510312d2f54beb01d)
   - [StabilityPool (0x5721...f9BF)](#c-0x5721cbbd64fc7ae3ef44a0a3f9a790a9264cf9bf)
   - [StabilityPool (0x9502...e56B)](#c-0x9502b7c397e9aa22fe9db7ef7daf21cd2aebe56b)
   - [StabilityPool (0xd442...8695)](#c-0xd442e41019b7f5c4dd78f50dc03726c446148695)
   - [ActivePool (0x531a...19a0)](#c-0x531a8f99c70d6a56a7cee02d6b4281650d7919a0)
   - [ActivePool (0x9074...532F)](#c-0x9074d72cc82dad1e13e454755aa8f144c479532f)
   - [ActivePool (0xeB5A...6AfE)](#c-0xeb5a8c825582965f1d84606e078620a84ab16afe)
   - [BorrowerOperations (0x372A...BC65)](#c-0x372abd1810eaf23cb9d941bbe7596dfb2c46bc65)
   - [BorrowerOperations (0xa741...5DA3)](#c-0xa741a32f9dcfe6adba088fd0f97e90742d7d5da3)
   - [BorrowerOperations (0xe811...7329)](#c-0xe8119fc02953b27a1b48d2573855738485a17329)
   - [TroveManager (0x7bcb...Cf5A)](#c-0x7bcb64b2c9206a5b699ed43363f6f98d4776cf5a)
   - [TroveManager (0xA289...8B22)](#c-0xa2895d6a3bf110561dfe4b71ca539d84e1928b22)
   - [TroveManager (0xb2B2...e19e)](#c-0xb2b2abeb5c357a234363ff5d180912d319e3e19e)
   - [CollateralRegistry](#c-0xf949982b91c8c61e952b3ba942cbbfaef5386684)
   - [WETHPriceFeed](#c-0xcc5f8102eb670c89a4a3c567c13851260303c24f)
   - [WSTETHPriceFeed](#c-0xe7aa2ba9e086a379d3beb224098bc634a46e314e)
   - [RETHPriceFeed](#c-0x34f1e9c7dcc279ec70d3c4488eb2d80fba8b7b2b)
   - [DefaultPool (0xD796...22A1)](#c-0xd796e1648526400386cc4d12fa05e5f11e6a22a1)
   - [DefaultPool (0x5cc5...CD6b)](#c-0x5cc5cefd034fdc4728d487a72ca58a410cddcd6b)
   - [DefaultPool (0xD455...B1A0)](#c-0xd4558240d50c2e219a21c9d25afd513bb6e5b1a0)
3. [⚡ Authority Concentration](#-authority-concentration)
4. [⛔ Sanctions Screening](#-sanctions-screening)
5. [EOA Exposure Summary](#eoa-exposure-summary)
6. [✅ Scan Integrity](#scan-integrity)

## Analyst Focus Areas &nbsp;&nbsp;☑ Profile reviewed

> **Observational findings — not risk determinations.** Each item below is a focus point for the Risk Analyst to interpret against collateralization context and the protocol's stated intent. Attention levels (CRITICAL / HIGH / LOW) reflect the scanner's heuristic weight — not a realized risk to FiRM. These observations support future risk assessments; they do not constitute one.

> **0 critical-attention** and **71 high-attention** observation(s) across 20 contract(s).

<details>
<summary><strong>View findings (collapsed — profile reviewed)</strong></summary>


### 🟠 HIGH (83)


<details>
<summary>💰 **Observed: 28 role(s) with supply-altering capability** — Supply-altering surface — assess each holder's custody and governance. Expand for all roles (each links to its contract card).</summary>

- 💰 [**`borrowerOperationsAddress()` on ActivePool**](#c-0x531a8f99c70d6a56a7cee02d6b4281650d7919a0) — 0x531a...19a0 — held by 0xa741...5DA3 — open the role card for holder identities & admin chain.
- 💰 [**`borrowerOperationsAddress()` on ActivePool**](#c-0x9074d72cc82dad1e13e454755aa8f144c479532f) — 0x9074...532F — held by 0xe811...7329 — open the role card for holder identities & admin chain.
- 💰 [**`borrowerOperationsAddress()` on ActivePool**](#c-0xeb5a8c825582965f1d84606e078620a84ab16afe) — 0xeB5A...6AfE — held by 0x372A...BC65 — open the role card for holder identities & admin chain.
- 💰 [**`stabilityPool()` on ActivePool**](#c-0x531a8f99c70d6a56a7cee02d6b4281650d7919a0) — 0x531a...19a0 — held by 0x9502...e56B — open the role card for holder identities & admin chain.
- 💰 [**`stabilityPool()` on ActivePool**](#c-0x9074d72cc82dad1e13e454755aa8f144c479532f) — 0x9074...532F — held by 0xd442...8695 — open the role card for holder identities & admin chain.
- 💰 [**`stabilityPool()` on ActivePool**](#c-0xeb5a8c825582965f1d84606e078620a84ab16afe) — 0xeB5A...6AfE — held by 0x5721...f9BF — open the role card for holder identities & admin chain.
- 💰 [**`troveManagerAddress()` on ActivePool**](#c-0x531a8f99c70d6a56a7cee02d6b4281650d7919a0) — 0x531a...19a0 — held by 0xA289...8B22 — open the role card for holder identities & admin chain.
- 💰 [**`troveManagerAddress()` on ActivePool**](#c-0x9074d72cc82dad1e13e454755aa8f144c479532f) — 0x9074...532F — held by 0xb2B2...e19e — open the role card for holder identities & admin chain.
- 💰 [**`troveManagerAddress()` on ActivePool**](#c-0xeb5a8c825582965f1d84606e078620a84ab16afe) — 0xeB5A...6AfE — held by 0x7bcb...Cf5A — open the role card for holder identities & admin chain.
- 💰 [**`activePool-WETH` on BoldToken**](#c-0x6440f144b7e50d6a8439336510312d2f54beb01d) — 0x6440...B01D — held by 0xeB5A...6AfE — open the role card for holder identities & admin chain.
- 💰 [**`activePool-rETH` on BoldToken**](#c-0x6440f144b7e50d6a8439336510312d2f54beb01d) — 0x6440...B01D — held by 0x9074...532F — open the role card for holder identities & admin chain.
- 💰 [**`activePool-wstETH` on BoldToken**](#c-0x6440f144b7e50d6a8439336510312d2f54beb01d) — 0x6440...B01D — held by 0x531a...19a0 — open the role card for holder identities & admin chain.
- 💰 [**`borrowerOperations-WETH` on BoldToken**](#c-0x6440f144b7e50d6a8439336510312d2f54beb01d) — 0x6440...B01D — held by 0x372A...BC65 — open the role card for holder identities & admin chain.
- 💰 [**`borrowerOperations-rETH` on BoldToken**](#c-0x6440f144b7e50d6a8439336510312d2f54beb01d) — 0x6440...B01D — held by 0xe811...7329 — open the role card for holder identities & admin chain.
- 💰 [**`borrowerOperations-wstETH` on BoldToken**](#c-0x6440f144b7e50d6a8439336510312d2f54beb01d) — 0x6440...B01D — held by 0xa741...5DA3 — open the role card for holder identities & admin chain.
- 💰 [**`collateralRegistryAddress()` on BoldToken**](#c-0x6440f144b7e50d6a8439336510312d2f54beb01d) — 0x6440...B01D — held by 0xf949...6684 — open the role card for holder identities & admin chain.
- 💰 [**`stabilityPool-WETH` on BoldToken**](#c-0x6440f144b7e50d6a8439336510312d2f54beb01d) — 0x6440...B01D — held by 0x5721...f9BF — open the role card for holder identities & admin chain.
- 💰 [**`stabilityPool-rETH` on BoldToken**](#c-0x6440f144b7e50d6a8439336510312d2f54beb01d) — 0x6440...B01D — held by 0xd442...8695 — open the role card for holder identities & admin chain.
- 💰 [**`stabilityPool-wstETH` on BoldToken**](#c-0x6440f144b7e50d6a8439336510312d2f54beb01d) — 0x6440...B01D — held by 0x9502...e56B — open the role card for holder identities & admin chain.
- 💰 [**`troveManager-WETH` on BoldToken**](#c-0x6440f144b7e50d6a8439336510312d2f54beb01d) — 0x6440...B01D — held by 0x7bcb...Cf5A — open the role card for holder identities & admin chain.
- 💰 [**`troveManager-rETH` on BoldToken**](#c-0x6440f144b7e50d6a8439336510312d2f54beb01d) — 0x6440...B01D — held by 0xb2B2...e19e — open the role card for holder identities & admin chain.
- 💰 [**`troveManager-wstETH` on BoldToken**](#c-0x6440f144b7e50d6a8439336510312d2f54beb01d) — 0x6440...B01D — held by 0xA289...8B22 — open the role card for holder identities & admin chain.
- 💰 [**`troveManager()` on StabilityPool**](#c-0x5721cbbd64fc7ae3ef44a0a3f9a790a9264cf9bf) — 0x5721...f9BF — held by 0x7bcb...Cf5A — open the role card for holder identities & admin chain.
- 💰 [**`troveManager()` on StabilityPool**](#c-0x9502b7c397e9aa22fe9db7ef7daf21cd2aebe56b) — 0x9502...e56B — held by 0xA289...8B22 — open the role card for holder identities & admin chain.
- 💰 [**`troveManager()` on StabilityPool**](#c-0xd442e41019b7f5c4dd78f50dc03726c446148695) — 0xd442...8695 — held by 0xb2B2...e19e — open the role card for holder identities & admin chain.
- 💰 [**`borrowerOperations()` on TroveManager**](#c-0x7bcb64b2c9206a5b699ed43363f6f98d4776cf5a) — 0x7bcb...Cf5A — held by 0x372A...BC65 — open the role card for holder identities & admin chain.
- 💰 [**`borrowerOperations()` on TroveManager**](#c-0xa2895d6a3bf110561dfe4b71ca539d84e1928b22) — 0xA289...8B22 — held by 0xa741...5DA3 — open the role card for holder identities & admin chain.
- 💰 [**`borrowerOperations()` on TroveManager**](#c-0xb2b2abeb5c357a234363ff5d180912d319e3e19e) — 0xb2B2...e19e — held by 0xe811...7329 — open the role card for holder identities & admin chain.

</details>


<details>
<summary>⏸️ **Observed: 9 role(s) with pause capability** — Pause surface — assess pause-authority governance. Expand for all roles (each links to its contract card).</summary>

- ⏸️ [**`troveManagerAddress()` on ActivePool**](#c-0x531a8f99c70d6a56a7cee02d6b4281650d7919a0) — 0x531a...19a0 — held by 0xA289...8B22 — open the role card for holder identities & admin chain.
- ⏸️ [**`troveManagerAddress()` on ActivePool**](#c-0x9074d72cc82dad1e13e454755aa8f144c479532f) — 0x9074...532F — held by 0xb2B2...e19e — open the role card for holder identities & admin chain.
- ⏸️ [**`troveManagerAddress()` on ActivePool**](#c-0xeb5a8c825582965f1d84606e078620a84ab16afe) — 0xeB5A...6AfE — held by 0x7bcb...Cf5A — open the role card for holder identities & admin chain.
- ⏸️ [**`priceFeed-WETH` on BoldToken**](#c-0x6440f144b7e50d6a8439336510312d2f54beb01d) — 0x6440...B01D — held by 0xCC5F...c24F — open the role card for holder identities & admin chain.
- ⏸️ [**`priceFeed-rETH` on BoldToken**](#c-0x6440f144b7e50d6a8439336510312d2f54beb01d) — 0x6440...B01D — held by 0x34F1...7b2B — open the role card for holder identities & admin chain.
- ⏸️ [**`priceFeed-wstETH` on BoldToken**](#c-0x6440f144b7e50d6a8439336510312d2f54beb01d) — 0x6440...B01D — held by 0xe7Aa...314E — open the role card for holder identities & admin chain.
- ⏸️ [**`borrowerOperations()` on TroveManager**](#c-0x7bcb64b2c9206a5b699ed43363f6f98d4776cf5a) — 0x7bcb...Cf5A — held by 0x372A...BC65 — open the role card for holder identities & admin chain.
- ⏸️ [**`borrowerOperations()` on TroveManager**](#c-0xa2895d6a3bf110561dfe4b71ca539d84e1928b22) — 0xA289...8B22 — held by 0xa741...5DA3 — open the role card for holder identities & admin chain.
- ⏸️ [**`borrowerOperations()` on TroveManager**](#c-0xb2b2abeb5c357a234363ff5d180912d319e3e19e) — 0xb2B2...e19e — held by 0xe811...7329 — open the role card for holder identities & admin chain.

</details>

- 🔗 [**Observed: supply authority chain on CollateralRegistry**](#c-0xf949982b91c8c61e952b3ba942cbbfaef5386684) — Chain: BoldToken → `collateralRegistryAddress()` → CollateralRegistry. Controlled by: `boldToken()`. Assess custody — compromise of this chain could affect root token supply.

<details>
<summary>🔓 **28 No-Timelock-in-admin-chain supply finding(s) across 4 contract(s)** — Supply-capable roles with no Timelock in the direct admin chain — a supply-altering call can land in one block once the holder's governance threshold is met. Expand to review each role + holder and verify whether it is a real supply path or a transitive getter-pointer edge. FiRM-lens: no analyst-observable buffer between decision and action.</summary>

- ⚠️ [**No Timelock in admin chain: `collateralRegistryAddress()` on BoldToken**](#c-0x6440f144b7e50d6a8439336510312d2f54beb01d) — `collateralRegistryAddress()` has SUPPLY capability and is held by: `0xf949...6684` (Contract). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `borrowerOperations-WETH` on BoldToken**](#c-0x6440f144b7e50d6a8439336510312d2f54beb01d) — `borrowerOperations-WETH` has SUPPLY capability and is held by: `0x372A...BC65` (Contract). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `borrowerOperations-wstETH` on BoldToken**](#c-0x6440f144b7e50d6a8439336510312d2f54beb01d) — `borrowerOperations-wstETH` has SUPPLY capability and is held by: `0xa741...5DA3` (Contract). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `borrowerOperations-rETH` on BoldToken**](#c-0x6440f144b7e50d6a8439336510312d2f54beb01d) — `borrowerOperations-rETH` has SUPPLY capability and is held by: `0xe811...7329` (Contract). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `activePool-WETH` on BoldToken**](#c-0x6440f144b7e50d6a8439336510312d2f54beb01d) — `activePool-WETH` has SUPPLY capability and is held by: `0xeB5A...6AfE` (Contract). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `activePool-wstETH` on BoldToken**](#c-0x6440f144b7e50d6a8439336510312d2f54beb01d) — `activePool-wstETH` has SUPPLY capability and is held by: `0x531a...19a0` (Contract). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `activePool-rETH` on BoldToken**](#c-0x6440f144b7e50d6a8439336510312d2f54beb01d) — `activePool-rETH` has SUPPLY capability and is held by: `0x9074...532F` (Contract). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `troveManager-WETH` on BoldToken**](#c-0x6440f144b7e50d6a8439336510312d2f54beb01d) — `troveManager-WETH` has SUPPLY capability and is held by: `0x7bcb...Cf5A` (Contract). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `troveManager-wstETH` on BoldToken**](#c-0x6440f144b7e50d6a8439336510312d2f54beb01d) — `troveManager-wstETH` has SUPPLY capability and is held by: `0xA289...8B22` (Contract). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `troveManager-rETH` on BoldToken**](#c-0x6440f144b7e50d6a8439336510312d2f54beb01d) — `troveManager-rETH` has SUPPLY capability and is held by: `0xb2B2...e19e` (Contract). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `stabilityPool-WETH` on BoldToken**](#c-0x6440f144b7e50d6a8439336510312d2f54beb01d) — `stabilityPool-WETH` has SUPPLY capability and is held by: `0x5721...f9BF` (Contract). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `stabilityPool-wstETH` on BoldToken**](#c-0x6440f144b7e50d6a8439336510312d2f54beb01d) — `stabilityPool-wstETH` has SUPPLY capability and is held by: `0x9502...e56B` (Contract). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `stabilityPool-rETH` on BoldToken**](#c-0x6440f144b7e50d6a8439336510312d2f54beb01d) — `stabilityPool-rETH` has SUPPLY capability and is held by: `0xd442...8695` (Contract). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `borrowerOperations()` on TroveManager**](#c-0x7bcb64b2c9206a5b699ed43363f6f98d4776cf5a) — `borrowerOperations()` has SUPPLY capability and is held by: `0x372A...BC65` (Contract). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `borrowerOperations()` on TroveManager**](#c-0xa2895d6a3bf110561dfe4b71ca539d84e1928b22) — `borrowerOperations()` has SUPPLY capability and is held by: `0xa741...5DA3` (Contract). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `borrowerOperations()` on TroveManager**](#c-0xb2b2abeb5c357a234363ff5d180912d319e3e19e) — `borrowerOperations()` has SUPPLY capability and is held by: `0xe811...7329` (Contract). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- 🔒 [**No Timelock in admin chain: `troveManager()` on StabilityPool**](#c-0x5721cbbd64fc7ae3ef44a0a3f9a790a9264cf9bf) — `troveManager()` has SUPPLY capability and is held by: `0x7bcb...Cf5A` (Contract). No Timelock appears in the admin chain and none is needed: the backing pointer is declared `immutable` in the contract source, so it is fixed at construction and cannot be re-pointed by any key, role or governance action. FiRM-lens: there is no decision to buffer on this edge. The authority of the contract it points AT is assessed on that contract's own card.
- 🔒 [**No Timelock in admin chain: `troveManager()` on StabilityPool**](#c-0x9502b7c397e9aa22fe9db7ef7daf21cd2aebe56b) — `troveManager()` has SUPPLY capability and is held by: `0xA289...8B22` (Contract). No Timelock appears in the admin chain and none is needed: the backing pointer is declared `immutable` in the contract source, so it is fixed at construction and cannot be re-pointed by any key, role or governance action. FiRM-lens: there is no decision to buffer on this edge. The authority of the contract it points AT is assessed on that contract's own card.
- 🔒 [**No Timelock in admin chain: `troveManager()` on StabilityPool**](#c-0xd442e41019b7f5c4dd78f50dc03726c446148695) — `troveManager()` has SUPPLY capability and is held by: `0xb2B2...e19e` (Contract). No Timelock appears in the admin chain and none is needed: the backing pointer is declared `immutable` in the contract source, so it is fixed at construction and cannot be re-pointed by any key, role or governance action. FiRM-lens: there is no decision to buffer on this edge. The authority of the contract it points AT is assessed on that contract's own card.
- 🔒 [**No Timelock in admin chain: `borrowerOperationsAddress()` on ActivePool**](#c-0x531a8f99c70d6a56a7cee02d6b4281650d7919a0) — `borrowerOperationsAddress()` has SUPPLY capability and is held by: `0xa741...5DA3` (Contract). No Timelock appears in the admin chain and none is needed: the backing pointer is declared `immutable` in the contract source, so it is fixed at construction and cannot be re-pointed by any key, role or governance action. FiRM-lens: there is no decision to buffer on this edge. The authority of the contract it points AT is assessed on that contract's own card.
- 🔒 [**No Timelock in admin chain: `troveManagerAddress()` on ActivePool**](#c-0x531a8f99c70d6a56a7cee02d6b4281650d7919a0) — `troveManagerAddress()` has SUPPLY capability and is held by: `0xA289...8B22` (Contract). No Timelock appears in the admin chain and none is needed: the backing pointer is declared `immutable` in the contract source, so it is fixed at construction and cannot be re-pointed by any key, role or governance action. FiRM-lens: there is no decision to buffer on this edge. The authority of the contract it points AT is assessed on that contract's own card.
- 🔒 [**No Timelock in admin chain: `stabilityPool()` on ActivePool**](#c-0x531a8f99c70d6a56a7cee02d6b4281650d7919a0) — `stabilityPool()` has SUPPLY capability and is held by: `0x9502...e56B` (Contract). No Timelock appears in the admin chain and none is needed: the backing pointer is declared `immutable` in the contract source, so it is fixed at construction and cannot be re-pointed by any key, role or governance action. FiRM-lens: there is no decision to buffer on this edge. The authority of the contract it points AT is assessed on that contract's own card.
- 🔒 [**No Timelock in admin chain: `borrowerOperationsAddress()` on ActivePool**](#c-0x9074d72cc82dad1e13e454755aa8f144c479532f) — `borrowerOperationsAddress()` has SUPPLY capability and is held by: `0xe811...7329` (Contract). No Timelock appears in the admin chain and none is needed: the backing pointer is declared `immutable` in the contract source, so it is fixed at construction and cannot be re-pointed by any key, role or governance action. FiRM-lens: there is no decision to buffer on this edge. The authority of the contract it points AT is assessed on that contract's own card.
- 🔒 [**No Timelock in admin chain: `troveManagerAddress()` on ActivePool**](#c-0x9074d72cc82dad1e13e454755aa8f144c479532f) — `troveManagerAddress()` has SUPPLY capability and is held by: `0xb2B2...e19e` (Contract). No Timelock appears in the admin chain and none is needed: the backing pointer is declared `immutable` in the contract source, so it is fixed at construction and cannot be re-pointed by any key, role or governance action. FiRM-lens: there is no decision to buffer on this edge. The authority of the contract it points AT is assessed on that contract's own card.
- 🔒 [**No Timelock in admin chain: `stabilityPool()` on ActivePool**](#c-0x9074d72cc82dad1e13e454755aa8f144c479532f) — `stabilityPool()` has SUPPLY capability and is held by: `0xd442...8695` (Contract). No Timelock appears in the admin chain and none is needed: the backing pointer is declared `immutable` in the contract source, so it is fixed at construction and cannot be re-pointed by any key, role or governance action. FiRM-lens: there is no decision to buffer on this edge. The authority of the contract it points AT is assessed on that contract's own card.
- 🔒 [**No Timelock in admin chain: `borrowerOperationsAddress()` on ActivePool**](#c-0xeb5a8c825582965f1d84606e078620a84ab16afe) — `borrowerOperationsAddress()` has SUPPLY capability and is held by: `0x372A...BC65` (Contract). No Timelock appears in the admin chain and none is needed: the backing pointer is declared `immutable` in the contract source, so it is fixed at construction and cannot be re-pointed by any key, role or governance action. FiRM-lens: there is no decision to buffer on this edge. The authority of the contract it points AT is assessed on that contract's own card.
- 🔒 [**No Timelock in admin chain: `troveManagerAddress()` on ActivePool**](#c-0xeb5a8c825582965f1d84606e078620a84ab16afe) — `troveManagerAddress()` has SUPPLY capability and is held by: `0x7bcb...Cf5A` (Contract). No Timelock appears in the admin chain and none is needed: the backing pointer is declared `immutable` in the contract source, so it is fixed at construction and cannot be re-pointed by any key, role or governance action. FiRM-lens: there is no decision to buffer on this edge. The authority of the contract it points AT is assessed on that contract's own card.
- 🔒 [**No Timelock in admin chain: `stabilityPool()` on ActivePool**](#c-0xeb5a8c825582965f1d84606e078620a84ab16afe) — `stabilityPool()` has SUPPLY capability and is held by: `0x5721...f9BF` (Contract). No Timelock appears in the admin chain and none is needed: the backing pointer is declared `immutable` in the contract source, so it is fixed at construction and cannot be re-pointed by any key, role or governance action. FiRM-lens: there is no decision to buffer on this edge. The authority of the contract it points AT is assessed on that contract's own card.

</details>


<details>
<summary>🔄 **11 volatile parameter(s) observed across 2 contract(s) (≥5 historical changes each)** — Operational tempo signal — high-velocity setters indicate active governance maintenance, oracle keepers, or routinely-tuned risk parameters. Expand to review each parameter's change count and current value; assess against the protocol's stated intent.</summary>

- 🔄 [**Observed: volatile parameter `offset` on StabilityPool**](#c-0x5721cbbd64fc7ae3ef44a0a3f9a790a9264cf9bf) — `offset(uint256 _debtToOffset, uint256 _collToAdd)` changed 47 times. Current value: ``. Assess change pattern.
- 🔄 [**Observed: volatile parameter `offset` on StabilityPool**](#c-0x9502b7c397e9aa22fe9db7ef7daf21cd2aebe56b) — `offset(uint256 _debtToOffset, uint256 _collToAdd)` changed 12 times. Current value: ``. Assess change pattern.
- 🔄 [**Observed: volatile parameter `onOpenTrove` on TroveManager**](#c-0x7bcb64b2c9206a5b699ed43363f6f98d4776cf5a) — `onOpenTrove(address _owner, uint256 _troveId, TroveChange memory _troveChange, uint256 _annualInterestRate)` changed 360 times. Current value: ``. Assess change pattern.
- 🔄 [**Observed: volatile parameter `onOpenTroveAndJoinBatch` on TroveManager**](#c-0x7bcb64b2c9206a5b699ed43363f6f98d4776cf5a) — `onOpenTroveAndJoinBatch(address _owner, uint256 _troveId, TroveChange memory _troveChange, address _batchAddress, uint256 _batchColl, uint256 _batchDebt)` changed 155 times. Current value: ``. Assess change pattern.
- 🔄 [**Observed: volatile parameter `onCloseTrove` on TroveManager**](#c-0x7bcb64b2c9206a5b699ed43363f6f98d4776cf5a) — `onCloseTrove(uint256 _troveId, TroveChange memory _troveChange, address _batchAddress, uint256 _newBatchColl, uint256 _newBatchDebt)` changed 350 times. Current value: ``. Assess change pattern.
- 🔄 [**Observed: volatile parameter `onOpenTrove` on TroveManager**](#c-0xa2895d6a3bf110561dfe4b71ca539d84e1928b22) — `onOpenTrove(address _owner, uint256 _troveId, TroveChange memory _troveChange, uint256 _annualInterestRate)` changed 218 times. Current value: ``. Assess change pattern.
- 🔄 [**Observed: volatile parameter `onOpenTroveAndJoinBatch` on TroveManager**](#c-0xa2895d6a3bf110561dfe4b71ca539d84e1928b22) — `onOpenTroveAndJoinBatch(address _owner, uint256 _troveId, TroveChange memory _troveChange, address _batchAddress, uint256 _batchColl, uint256 _batchDebt)` changed 115 times. Current value: ``. Assess change pattern.
- 🔄 [**Observed: volatile parameter `onCloseTrove` on TroveManager**](#c-0xa2895d6a3bf110561dfe4b71ca539d84e1928b22) — `onCloseTrove(uint256 _troveId, TroveChange memory _troveChange, address _batchAddress, uint256 _newBatchColl, uint256 _newBatchDebt)` changed 233 times. Current value: ``. Assess change pattern.
- 🔄 [**Observed: volatile parameter `onOpenTrove` on TroveManager**](#c-0xb2b2abeb5c357a234363ff5d180912d319e3e19e) — `onOpenTrove(address _owner, uint256 _troveId, TroveChange memory _troveChange, uint256 _annualInterestRate)` changed 74 times. Current value: ``. Assess change pattern.
- 🔄 [**Observed: volatile parameter `onOpenTroveAndJoinBatch` on TroveManager**](#c-0xb2b2abeb5c357a234363ff5d180912d319e3e19e) — `onOpenTroveAndJoinBatch(address _owner, uint256 _troveId, TroveChange memory _troveChange, address _batchAddress, uint256 _batchColl, uint256 _batchDebt)` changed 29 times. Current value: ``. Assess change pattern.
- 🔄 [**Observed: volatile parameter `onCloseTrove` on TroveManager**](#c-0xb2b2abeb5c357a234363ff5d180912d319e3e19e) — `onCloseTrove(uint256 _troveId, TroveChange memory _troveChange, address _batchAddress, uint256 _newBatchColl, uint256 _newBatchDebt)` changed 79 times. Current value: ``. Assess change pattern.

</details>

- 🌐 [**Observed: 3 off-chain control dependencies (oracle)**](#sec-off-chain-deps) — Asset has 3 control surface(s) that extend beyond on-chain observability. See the 🌐 Off-Chain Dependencies section for each kind, the on-chain signal the analyst can monitor, the off-chain dependency it relies on, and the recovery path if the off-chain piece fails. Cross-reference against the protocol's stated trust model.
- 🎚️ [**Observed: 3 critical parameter levers (HIGH: 3)**](#sec-critical-params) — Asset has 3 on-chain parameter levers curated as high-impact for lender-side risk. See the 🎚️ Critical Parameter Levers section for the role gate, current value, threshold, and impact of each. These are singular setters / function calls that flip risk surface in one tx — direct dilution, safety-mechanism closure, authority transfer, or oracle repointing. Verify role-gate identities and threshold distance-to-trigger against current operating posture.

### 🟢 LOW (1)

- 🟢 [**Observed: `owner()` renounced on BoldToken**](#c-0x6440f144b7e50d6a8439336510312d2f54beb01d) — Held only by the burn address `0x0000000000000000000000000000000000000000` — no private key controls it, so the functions this role gates are permanently unreachable through it.

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
<a id="c-0x6440f144b7e50d6a8439336510312d2f54beb01d"></a>
## BoldToken `0x6440f144b7e50D6a8439336510312d2F54beB01D`

*21 roles · 17 members · 8 functions*

### 🟠 `activePool-WETH`

**Hash:** `bfs_seed:activePool-WETH`  
**Privileged write functions:**  
**Capabilities:** 💰 **SUPPLY**
- `activePoolAddresses (internal mapping, no getter)` — Mint authority. ActivePool mints aggregate interest (mintAggInterest) directly against BOLD. ActivePoolAddressAdded at block 22516087.
 `[SUPPLY]`

**Members (1):**

| Address | Name / Type | Risk | Granted | Source | Details |
|---|---|---|---|---|---|
| `0xeB5A8C825582965f1d84606E078620a84ab16AfE` | [↳ ActivePool](#c-0xeb5a8c825582965f1d84606e078620a84ab16afe) | 🟠 HIGH | — | Storage only |  |

### 🟠 `activePool-rETH`

**Hash:** `bfs_seed:activePool-rETH`  
**Privileged write functions:**  
**Capabilities:** 💰 **SUPPLY**
- `activePoolAddresses (internal mapping, no getter)` — Mint authority (aggregate interest). ActivePoolAddressAdded at block 22516125. `[SUPPLY]`

**Members (1):**

| Address | Name / Type | Risk | Granted | Source | Details |
|---|---|---|---|---|---|
| `0x9074D72cc82DaD1e13E454755Aa8f144c479532F` | [↳ ActivePool](#c-0x9074d72cc82dad1e13e454755aa8f144c479532f) | 🟠 HIGH | — | Storage only |  |

### 🟠 `activePool-wstETH`

**Hash:** `bfs_seed:activePool-wstETH`  
**Privileged write functions:**  
**Capabilities:** 💰 **SUPPLY**
- `activePoolAddresses (internal mapping, no getter)` — Mint authority (aggregate interest). ActivePoolAddressAdded at block 22516106. `[SUPPLY]`

**Members (1):**

| Address | Name / Type | Risk | Granted | Source | Details |
|---|---|---|---|---|---|
| `0x531a8f99c70D6A56A7CEe02d6B4281650d7919a0` | [↳ ActivePool](#c-0x531a8f99c70d6a56a7cee02d6b4281650d7919a0) | 🟠 HIGH | — | Storage only |  |

### 🟠 `borrowerOperations-WETH`

**Hash:** `bfs_seed:borrowerOperations-WETH`  
**Privileged write functions:**  
**Capabilities:** 💰 **SUPPLY**
- `borrowerOperationsAddresses (internal mapping, no getter)` — Mint and burn authority over BOLD. Added by BorrowerOperationsAddressAdded at block 22516087. Frozen: setBranchAddresses is unreachable (owner renounced 22516130).
 `[SUPPLY]`

**Members (1):**

| Address | Name / Type | Risk | Granted | Source | Details |
|---|---|---|---|---|---|
| `0x372ABD1810eAF23Cb9D941BbE7596DFb2c46BC65` | [↳ BorrowerOperations](#c-0x372abd1810eaf23cb9d941bbe7596dfb2c46bc65) | 🟠 HIGH | — | Storage only |  |

### 🟠 `borrowerOperations-rETH`

**Hash:** `bfs_seed:borrowerOperations-rETH`  
**Privileged write functions:**  
**Capabilities:** 💰 **SUPPLY**
- `borrowerOperationsAddresses (internal mapping, no getter)` — Mint and burn authority. BorrowerOperationsAddressAdded at block 22516125. `[SUPPLY]`

**Members (1):**

| Address | Name / Type | Risk | Granted | Source | Details |
|---|---|---|---|---|---|
| `0xe8119fC02953B27a1b48D2573855738485A17329` | [↳ BorrowerOperations](#c-0xe8119fc02953b27a1b48d2573855738485a17329) | 🟠 HIGH | — | Storage only |  |

### 🟠 `borrowerOperations-wstETH`

**Hash:** `bfs_seed:borrowerOperations-wstETH`  
**Privileged write functions:**  
**Capabilities:** 💰 **SUPPLY**
- `borrowerOperationsAddresses (internal mapping, no getter)` — Mint and burn authority. BorrowerOperationsAddressAdded at block 22516106. `[SUPPLY]`

**Members (1):**

| Address | Name / Type | Risk | Granted | Source | Details |
|---|---|---|---|---|---|
| `0xa741A32f9dcFe6aDBa088fD0f97e90742d7d5DA3` | [↳ BorrowerOperations](#c-0xa741a32f9dcfe6adba088fd0f97e90742d7d5da3) | 🟠 HIGH | — | Storage only |  |

### 🟠 `collateralRegistryAddress()`

**Privileged write functions:**  
**Capabilities:** 💰 **SUPPLY**
- `burn(address _account, uint256 _amount)` — (auto) Destroy tokens, reducing total supply `[SUPPLY]`

**Members (1):**

| Address | Name / Type | Risk | Granted | Source | Details |
|---|---|---|---|---|---|
| `0xf949982B91C8c61e952B3bA942cbbfaef5386684` | [↳ CollateralRegistry](#c-0xf949982b91c8c61e952b3ba942cbbfaef5386684) | 🟠 HIGH | — | Storage+Events |  |

### 🟢 `owner()`

**Privileged write functions:**  
**Capabilities:** ⚙️ **CONFIG**
- `setBranchAddresses(address _troveManagerAddress, address _stabilityPoolAddress, address _borrowerOperationsAddress, address _activePoolAddress)` `[CONFIG]`
- `setCollateralRegistry(address _collateralRegistryAddress)` `[CONFIG]`

**Members (1):**

| Address | Name / Type | Risk | Granted | Source | Details |
|---|---|---|---|---|---|
| `0x0000000000000000000000000000000000000000` | Burn address (renounced) | 🟢 LOW | — | Events only | 🔒 Renounced — no private key |

### 🟠 `stabilityPool-WETH`

**Hash:** `bfs_seed:stabilityPool-WETH`  
**Privileged write functions:**  
**Capabilities:** 💰 **SUPPLY**
- `stabilityPoolAddresses (internal mapping, no getter)` — Burn authority plus sendToPool/returnFromPool, which move BOLD balances between arbitrary holders and the pool without an allowance. StabilityPoolAddressAdded at block 22516087. The WETH branch's liquidation-absorption buffer. Coverage figures deliberately omitted here to match the two sibling StabilityPool notes: the ranking between branches reorders on a two-week timescale, so a superlative recorded in a structural note goes stale silently. Re-measure at the time of use.
 `[SUPPLY]`

**Members (1):**

| Address | Name / Type | Risk | Granted | Source | Details |
|---|---|---|---|---|---|
| `0x5721cbbd64fc7Ae3Ef44A0A3F9a790A9264Cf9BF` | [↳ StabilityPool](#c-0x5721cbbd64fc7ae3ef44a0a3f9a790a9264cf9bf) | 🟠 HIGH | — | Storage only |  |

### 🟠 `stabilityPool-rETH`

**Hash:** `bfs_seed:stabilityPool-rETH`  
**Privileged write functions:**  
**Capabilities:** 💰 **SUPPLY**
- `stabilityPoolAddresses (internal mapping, no getter)` — Burn plus sendToPool/returnFromPool. StabilityPoolAddressAdded at block 22516125. `[SUPPLY]`

**Members (1):**

| Address | Name / Type | Risk | Granted | Source | Details |
|---|---|---|---|---|---|
| `0xd442E41019B7F5C4dD78F50dc03726C446148695` | [↳ StabilityPool](#c-0xd442e41019b7f5c4dd78f50dc03726c446148695) | 🟠 HIGH | — | Storage only |  |

### 🟠 `stabilityPool-wstETH`

**Hash:** `bfs_seed:stabilityPool-wstETH`  
**Privileged write functions:**  
**Capabilities:** 💰 **SUPPLY**
- `stabilityPoolAddresses (internal mapping, no getter)` — Burn plus sendToPool/returnFromPool. StabilityPoolAddressAdded at block 22516106. `[SUPPLY]`

**Members (1):**

| Address | Name / Type | Risk | Granted | Source | Details |
|---|---|---|---|---|---|
| `0x9502b7c397E9aa22FE9dB7EF7DAF21cD2AEBe56B` | [↳ StabilityPool](#c-0x9502b7c397e9aa22fe9db7ef7daf21cd2aebe56b) | 🟠 HIGH | — | Storage only |  |

### 🟠 `troveManager-WETH`

**Hash:** `bfs_seed:troveManager-WETH`  
**Privileged write functions:**  
**Capabilities:** 💰 **SUPPLY**
- `troveManagerAddresses (internal mapping, no getter)` — Burn authority (redemption + liquidation). TroveManagerAddressAdded at block 22516087. `[SUPPLY]`

**Members (1):**

| Address | Name / Type | Risk | Granted | Source | Details |
|---|---|---|---|---|---|
| `0x7bcb64B2c9206a5B699eD43363f6F98D4776Cf5A` | [↳ TroveManager](#c-0x7bcb64b2c9206a5b699ed43363f6f98d4776cf5a) | 🟠 HIGH | — | Storage only |  |

### 🟠 `troveManager-rETH`

**Hash:** `bfs_seed:troveManager-rETH`  
**Privileged write functions:**  
**Capabilities:** 💰 **SUPPLY**
- `troveManagerAddresses (internal mapping, no getter)` — Burn authority. TroveManagerAddressAdded at block 22516125. `[SUPPLY]`

**Members (1):**

| Address | Name / Type | Risk | Granted | Source | Details |
|---|---|---|---|---|---|
| `0xb2B2ABEb5C357a234363FF5D180912D319e3e19e` | [↳ TroveManager](#c-0xb2b2abeb5c357a234363ff5d180912d319e3e19e) | 🟠 HIGH | — | Storage only |  |

### 🟠 `troveManager-wstETH`

**Hash:** `bfs_seed:troveManager-wstETH`  
**Privileged write functions:**  
**Capabilities:** 💰 **SUPPLY**
- `troveManagerAddresses (internal mapping, no getter)` — Burn authority. TroveManagerAddressAdded at block 22516106. `[SUPPLY]`

**Members (1):**

| Address | Name / Type | Risk | Granted | Source | Details |
|---|---|---|---|---|---|
| `0xA2895d6A3bf110561Dfe4b71cA539d84e1928B22` | [↳ TroveManager](#c-0xa2895d6a3bf110561dfe4b71ca539d84e1928b22) | 🟠 HIGH | — | Storage only |  |

### 🟠 `priceFeed-WETH`

**Hash:** `bfs_seed:priceFeed-WETH`  
**Privileged write functions:**  
**Capabilities:** ⚙️ **CONFIG** ⏸️ **PAUSE**
- `LiquityBase.priceFeed (internal, no getter)` — The WETH branch PriceFeed. It is the ONLY contract permitted to call BorrowerOperations.shutdownFromOracleFailure(), which permanently halts the branch. Unreachable by BFS: priceFeed is `IPriceFeed internal` on LiquityBase with no getter. Address recovered from the PriceFeedAddressChanged event at block 22516077. Reads Chainlink ETH/USD 0x5f4ec3df, staleness 86400s.
 `[PAUSE, CONFIG]`

**Members (1):**

| Address | Name / Type | Risk | Granted | Source | Details |
|---|---|---|---|---|---|
| `0xCC5F8102eb670c89a4a3c567C13851260303c24F` | [↳ WETHPriceFeed](#c-0xcc5f8102eb670c89a4a3c567c13851260303c24f) | 🟠 HIGH | — | Storage only |  |

### 🟠 `priceFeed-rETH`

**Hash:** `bfs_seed:priceFeed-rETH`  
**Privileged write functions:**  
**Capabilities:** ⚙️ **CONFIG** ⏸️ **PAUSE**
- `LiquityBase.priceFeed (internal, no getter)` — rETH branch PriceFeed, recovered from PriceFeedAddressChanged at block 22516116. Reads Chainlink ETH/USD 0x5f4ec3df AND RETH/ETH 0x536218f9 (172800s staleness, the loosest in the system).
 `[PAUSE, CONFIG]`

**Members (1):**

| Address | Name / Type | Risk | Granted | Source | Details |
|---|---|---|---|---|---|
| `0x34F1E9c7dcc279ec70d3c4488EB2D80FBa8B7b2B` | [↳ RETHPriceFeed](#c-0x34f1e9c7dcc279ec70d3c4488eb2d80fba8b7b2b) | 🟠 HIGH | — | Storage only |  |

### 🟠 `priceFeed-wstETH`

**Hash:** `bfs_seed:priceFeed-wstETH`  
**Privileged write functions:**  
**Capabilities:** ⚙️ **CONFIG** ⏸️ **PAUSE**
- `LiquityBase.priceFeed (internal, no getter)` — wstETH branch PriceFeed, recovered from PriceFeedAddressChanged at block 22516097. Reads Chainlink ETH/USD 0x5f4ec3df AND STETH/USD 0xcfe54b5c, both 86400s staleness.
 `[PAUSE, CONFIG]`

**Members (1):**

| Address | Name / Type | Risk | Granted | Source | Details |
|---|---|---|---|---|---|
| `0xe7Aa2Ba9E086A379d3beb224098bC634a46e314E` | [↳ WSTETHPriceFeed](#c-0xe7aa2ba9e086a379d3beb224098bc634a46e314e) | 🟠 HIGH | — | Storage only |  |

### 🟠 `activePoolAddress()` · 📋 operational


**Members (3):**

| Address | Name / Type | Granted | Source | Details |
|---|---|---|---|---|
| `0x531a8f99c70D6A56A7CEe02d6B4281650d7919a0` | [↳ ActivePool](#c-0x531a8f99c70d6a56a7cee02d6b4281650d7919a0) | — | Events only |  |
| `0x9074D72cc82DaD1e13E454755Aa8f144c479532F` | [↳ ActivePool](#c-0x9074d72cc82dad1e13e454755aa8f144c479532f) | — | Events only |  |
| `0xeB5A8C825582965f1d84606E078620a84ab16AfE` | [↳ ActivePool](#c-0xeb5a8c825582965f1d84606e078620a84ab16afe) | — | Events only |  |

### 🟠 `borrowerOperationsAddress()` · 📋 operational


**Members (3):**

| Address | Name / Type | Granted | Source | Details |
|---|---|---|---|---|
| `0x372ABD1810eAF23Cb9D941BbE7596DFb2c46BC65` | [↳ BorrowerOperations](#c-0x372abd1810eaf23cb9d941bbe7596dfb2c46bc65) | — | Events only |  |
| `0xa741A32f9dcFe6aDBa088fD0f97e90742d7d5DA3` | [↳ BorrowerOperations](#c-0xa741a32f9dcfe6adba088fd0f97e90742d7d5da3) | — | Events only |  |
| `0xe8119fC02953B27a1b48D2573855738485A17329` | [↳ BorrowerOperations](#c-0xe8119fc02953b27a1b48d2573855738485a17329) | — | Events only |  |

### 🟠 `stabilityPoolAddress()` · 📋 operational


**Members (3):**

| Address | Name / Type | Granted | Source | Details |
|---|---|---|---|---|
| `0x5721cbbd64fc7Ae3Ef44A0A3F9a790A9264Cf9BF` | [↳ StabilityPool](#c-0x5721cbbd64fc7ae3ef44a0a3f9a790a9264cf9bf) | — | Events only |  |
| `0x9502b7c397E9aa22FE9dB7EF7DAF21cD2AEBe56B` | [↳ StabilityPool](#c-0x9502b7c397e9aa22fe9db7ef7daf21cd2aebe56b) | — | Events only |  |
| `0xd442E41019B7F5C4dD78F50dc03726C446148695` | [↳ StabilityPool](#c-0xd442e41019b7f5c4dd78f50dc03726c446148695) | — | Events only |  |

### 🟠 `troveManagerAddress()` · 📋 operational


**Members (3):**

| Address | Name / Type | Granted | Source | Details |
|---|---|---|---|---|
| `0x7bcb64B2c9206a5B699eD43363f6F98D4776Cf5A` | [↳ TroveManager](#c-0x7bcb64b2c9206a5b699ed43363f6f98d4776cf5a) | — | Events only |  |
| `0xA2895d6A3bf110561Dfe4b71cA539d84e1928B22` | [↳ TroveManager](#c-0xa2895d6a3bf110561dfe4b71ca539d84e1928b22) | — | Events only |  |
| `0xb2B2ABEb5C357a234363FF5D180912D319e3e19e` | [↳ TroveManager](#c-0xb2b2abeb5c357a234363ff5d180912d319e3e19e) | — | Events only |  |

#### 🔧 Permissioned Parameters

**`collateralRegistryAddress`**

| Field | Value |
|---|---|
| Current Value | `0xf949982B91C8c61e952B3bA942cbbfaef5386684` |
| Setter | `setCollateralRegistry(address _collateralRegistryAddress)` |
| Gated by | `owner()` |
| Tags | `CONFIG` |
| Last changed | 2025-05-19 |
| Changed by | `0x83Cf...5ED0` |
| Total changes | 1 |

**Recent changes:**

| # | Value | Set By | Date |
|---|---|---|---|
| 1 | `0xf949982B91C8c61e952B3bA942cbbfaef5386684` | `0x83Cf...5ED0` | 2025-05-19 |

#### 💰 Supply Actions

_Mint / redeem / burn call tracking — last 5 calls per function, total counts preserved._

**`burn`** *(per-asset)* 🔄 **ACTIVE** (3727 changes)

> ⚠️ This parameter has been changed **3727 times** — monitor for unexpected modifications.

| Field | Value |
|---|---|
| Setter | `burn(address _account, uint256 _amount)` |
| Gated by | `collateralRegistryAddress()` |
| Tags | `SUPPLY` |
| Last called | — |
| Called by | — |
| Total calls | 3727 🔄 |

---
<a id="c-0x5721cbbd64fc7ae3ef44a0a3f9a790a9264cf9bf"></a>
## > StabilityPool `0x5721cbbd64fc7Ae3Ef44A0A3F9a790A9264Cf9BF`

> *9 roles · 6 members · 2 functions*

> 🔒 **Immutable References:** `activePoolAddress()` → ActivePool, `collToken()` → WETH (WETH9), `defaultPoolAddress()` → DefaultPool, `troveManagerAddress()` → TroveManager, `priceFeedAddress()` → WETHPriceFeed

### > 🟠 `troveManager()`

> **Privileged write functions:**  
> **Capabilities:** 💰 **SUPPLY**
> - `offset(uint256 _debtToOffset, uint256 _collToAdd)` — // SPDX-License-Identifier: BUSL-1.1 pragma solidity 0.8.24; `[SUPPLY]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x7bcb64B2c9206a5B699eD43363f6F98D4776Cf5A` | [↳ TroveManager](#c-0x7bcb64b2c9206a5b699ed43363f6f98d4776cf5a) | 🟠 HIGH | — | Storage only |  |

### > 🟠 `activePool()`

> **Privileged write functions:**
> - `triggerBoldRewards(uint256 _boldYield)`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xeB5A8C825582965f1d84606E078620a84ab16AfE` | [↳ ActivePool](#c-0xeb5a8c825582965f1d84606e078620a84ab16afe) | 🟠 HIGH | — | Storage only |  |

> #### 🔧 Permissioned Parameters

> **`MAX_SCALE_FACTOR_EXPONENT`** 🔒 **IMMUTABLE**

> > 🔒 **Immutable** — declared as a constant in the contract source; cannot be changed without a contract upgrade. Bounds the reachable extreme of any setter that writes a related storage variable.

> | Field | Value |
> |---|---|
> | Current Value | `8` |
> | Mutability | 🔒 immutable (constant) |
> | Tags | `IMMUTABLE` |

> #### 💰 Supply Actions

> _Mint / redeem / burn call tracking — last 5 calls per function, total counts preserved._

> **`offset`** 🔄 **ACTIVE** (47 changes)

> > ⚠️ This parameter has been changed **47 times** — monitor for unexpected modifications.

> | Field | Value |
> |---|---|
> | Setter | `offset(uint256 _debtToOffset, uint256 _collToAdd)` |
> | Gated by | `troveManager()` |
> | Tags | `SUPPLY` |
> | Last called | — |
> | Called by | — |
> | Total calls | 47 🔄 |

---
<a id="c-0x9502b7c397e9aa22fe9db7ef7daf21cd2aebe56b"></a>
## > StabilityPool `0x9502b7c397E9aa22FE9dB7EF7DAF21cD2AEBe56B`

> *9 roles · 6 members · 2 functions*

> 🔒 **Immutable References:** `activePoolAddress()` → ActivePool, `collToken()` → wstETH (WstETH), `defaultPoolAddress()` → DefaultPool, `troveManagerAddress()` → TroveManager, `priceFeedAddress()` → WSTETHPriceFeed

### > 🟠 `troveManager()`

> **Privileged write functions:**  
> **Capabilities:** 💰 **SUPPLY**
> - `offset(uint256 _debtToOffset, uint256 _collToAdd)` — // SPDX-License-Identifier: BUSL-1.1 pragma solidity 0.8.24; `[SUPPLY]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xA2895d6A3bf110561Dfe4b71cA539d84e1928B22` | [↳ TroveManager](#c-0xa2895d6a3bf110561dfe4b71ca539d84e1928b22) | 🟠 HIGH | — | Storage only |  |

### > 🟠 `activePool()`

> **Privileged write functions:**
> - `triggerBoldRewards(uint256 _boldYield)`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x531a8f99c70D6A56A7CEe02d6B4281650d7919a0` | [↳ ActivePool](#c-0x531a8f99c70d6a56a7cee02d6b4281650d7919a0) | 🟠 HIGH | — | Storage only |  |

> #### 🔧 Permissioned Parameters

> **`MAX_SCALE_FACTOR_EXPONENT`** 🔒 **IMMUTABLE**

> > 🔒 **Immutable** — declared as a constant in the contract source; cannot be changed without a contract upgrade. Bounds the reachable extreme of any setter that writes a related storage variable.

> | Field | Value |
> |---|---|
> | Current Value | `8` |
> | Mutability | 🔒 immutable (constant) |
> | Tags | `IMMUTABLE` |

> #### 💰 Supply Actions

> _Mint / redeem / burn call tracking — last 5 calls per function, total counts preserved._

> **`offset`** 🔄 **ACTIVE** (12 changes)

> > ⚠️ This parameter has been changed **12 times** — monitor for unexpected modifications.

> | Field | Value |
> |---|---|
> | Setter | `offset(uint256 _debtToOffset, uint256 _collToAdd)` |
> | Gated by | `troveManager()` |
> | Tags | `SUPPLY` |
> | Last called | — |
> | Called by | — |
> | Total calls | 12 🔄 |

---
<a id="c-0xd442e41019b7f5c4dd78f50dc03726c446148695"></a>
## > StabilityPool `0xd442E41019B7F5C4dD78F50dc03726C446148695`

> *9 roles · 6 members · 2 functions*

> 🔒 **Immutable References:** `activePoolAddress()` → ActivePool, `collToken()` → rETH (RocketTokenRETH), `defaultPoolAddress()` → DefaultPool, `troveManagerAddress()` → TroveManager, `priceFeedAddress()` → RETHPriceFeed

### > 🟠 `troveManager()`

> **Privileged write functions:**  
> **Capabilities:** 💰 **SUPPLY**
> - `offset(uint256 _debtToOffset, uint256 _collToAdd)` — // SPDX-License-Identifier: BUSL-1.1 pragma solidity 0.8.24; `[SUPPLY]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xb2B2ABEb5C357a234363FF5D180912D319e3e19e` | [↳ TroveManager](#c-0xb2b2abeb5c357a234363ff5d180912d319e3e19e) | 🟠 HIGH | — | Storage only |  |

### > 🟠 `activePool()`

> **Privileged write functions:**
> - `triggerBoldRewards(uint256 _boldYield)`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x9074D72cc82DaD1e13E454755Aa8f144c479532F` | [↳ ActivePool](#c-0x9074d72cc82dad1e13e454755aa8f144c479532f) | 🟠 HIGH | — | Storage only |  |

> #### 🔧 Permissioned Parameters

> **`MAX_SCALE_FACTOR_EXPONENT`** 🔒 **IMMUTABLE**

> > 🔒 **Immutable** — declared as a constant in the contract source; cannot be changed without a contract upgrade. Bounds the reachable extreme of any setter that writes a related storage variable.

> | Field | Value |
> |---|---|
> | Current Value | `8` |
> | Mutability | 🔒 immutable (constant) |
> | Tags | `IMMUTABLE` |

> #### 💰 Supply Actions

> _Mint / redeem / burn call tracking — last 5 calls per function, total counts preserved._

> **`offset`**

> | Field | Value |
> |---|---|
> | Setter | `offset(uint256 _debtToOffset, uint256 _collToAdd)` |
> | Gated by | `troveManager()` |
> | Tags | `SUPPLY` |
> | Last called | — |
> | Called by | — |
> | Total calls | 4 |

---
<a id="c-0x531a8f99c70d6a56a7cee02d6b4281650d7919a0"></a>
## > ActivePool `0x531a8f99c70D6A56A7CEe02d6B4281650d7919a0`

> *9 roles · 7 members · 8 functions*

> 🔒 **Immutable References:** `stabilityPoolAddress()` → StabilityPool, `collToken()` → wstETH (WstETH), `interestRouter()` → Governance, `collTokenAddress()` → wstETH (WstETH)

### > 🟠 `borrowerOperationsAddress()`

> **Privileged write functions:**  
> **Capabilities:** 💰 **SUPPLY**
> - `sendColl(address _account, uint256 _amount)`
> - `receiveColl(uint256 _amount)`
> - `accountForReceivedColl(uint256 _amount)`
> - `mintAggInterestAndAccountForTroveChange(TroveChange calldata _troveChange, address _batchAddress)` `[SUPPLY]`
> - `mintAggInterest()` `[SUPPLY]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xa741A32f9dcFe6aDBa088fD0f97e90742d7d5DA3` | [↳ BorrowerOperations](#c-0xa741a32f9dcfe6adba088fd0f97e90742d7d5da3) | 🟠 HIGH | — | Storage+Events |  |

### > 🟠 `stabilityPool()`

> **Privileged write functions:**  
> **Capabilities:** 💰 **SUPPLY**
> - `sendColl(address _account, uint256 _amount)`
> - `mintAggInterest()` `[SUPPLY]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x9502b7c397E9aa22FE9dB7EF7DAF21cD2AEBe56B` | [↳ StabilityPool](#c-0x9502b7c397e9aa22fe9db7ef7daf21cd2aebe56b) | 🟠 HIGH | — | Storage only |  |

### > 🟠 `troveManagerAddress()`

> **Privileged write functions:**  
> **Capabilities:** ⏸️ **PAUSE** 💰 **SUPPLY**
> - `sendColl(address _account, uint256 _amount)`
> - `sendCollToDefaultPool(uint256 _amount)`
> - `mintAggInterestAndAccountForTroveChange(TroveChange calldata _troveChange, address _batchAddress)` `[SUPPLY]`
> - `mintBatchManagementFeeAndAccountForChange(TroveChange calldata _troveChange, address _batchAddress)` `[SUPPLY]`
> - `setShutdownFlag()` `[PAUSE]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xA2895d6A3bf110561Dfe4b71cA539d84e1928B22` | [↳ TroveManager](#c-0xa2895d6a3bf110561dfe4b71ca539d84e1928b22) | 🟠 HIGH | — | Storage+Events |  |

### > 🟠 `defaultPoolAddress()`

> **Privileged write functions:**
> - `receiveColl(uint256 _amount)`
> - `accountForReceivedColl(uint256 _amount)`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xD796e1648526400386CC4d12FA05E5F11e6a22A1` | [↳ DefaultPool](#c-0xd796e1648526400386cc4d12fa05e5f11e6a22a1) | 🟠 HIGH | — | Storage+Events |  |

> #### 🔧 Permissioned Parameters

> **`setShutdownFlag`** ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Setter | `setShutdownFlag()` |
> | Gated by | `troveManagerAddress()` |
> | Tags | `PAUSE` |
> | Last called | — |
> | Called by | — |
> | Total calls | 0 ❄️ |

> #### 💰 Supply Actions

> _Mint / redeem / burn call tracking — last 5 calls per function, total counts preserved._

> **`mintAggInterest`** 🔄 **ACTIVE** (10000 changes)

> > ⚠️ This parameter has been changed **10000 times** — monitor for unexpected modifications.

> | Field | Value |
> |---|---|
> | Setter | `mintAggInterest()` |
> | Gated by | `borrowerOperationsAddress(), stabilityPool()` |
> | Tags | `SUPPLY` |
> | Last called | — |
> | Called by | — |
> | Total calls | 10000 🔄 |

> **`mintAggInterestAndAccountForTroveChange`** *(per-asset)* 🔄 **ACTIVE** (10000 changes)

> > ⚠️ This parameter has been changed **10000 times** — monitor for unexpected modifications.

> | Field | Value |
> |---|---|
> | Setter | `mintAggInterestAndAccountForTroveChange(TroveChange calldata _troveChange, address _batchAddress)` |
> | Gated by | `borrowerOperationsAddress(), troveManagerAddress()` |
> | Tags | `SUPPLY` |
> | Last called | — |
> | Called by | — |
> | Total calls | 10000 🔄 |

> **`mintBatchManagementFeeAndAccountForChange`** *(per-asset)* 🔄 **ACTIVE** (10000 changes)

> > ⚠️ This parameter has been changed **10000 times** — monitor for unexpected modifications.

> | Field | Value |
> |---|---|
> | Setter | `mintBatchManagementFeeAndAccountForChange(TroveChange calldata _troveChange, address _batchAddress)` |
> | Gated by | `troveManagerAddress()` |
> | Tags | `SUPPLY` |
> | Last called | — |
> | Called by | — |
> | Total calls | 10000 🔄 |

---
<a id="c-0x9074d72cc82dad1e13e454755aa8f144c479532f"></a>
## > ActivePool `0x9074D72cc82DaD1e13E454755Aa8f144c479532F`

> *9 roles · 7 members · 8 functions*

> 🔒 **Immutable References:** `stabilityPoolAddress()` → StabilityPool, `collToken()` → rETH (RocketTokenRETH), `interestRouter()` → Governance, `collTokenAddress()` → rETH (RocketTokenRETH)

### > 🟠 `borrowerOperationsAddress()`

> **Privileged write functions:**  
> **Capabilities:** 💰 **SUPPLY**
> - `sendColl(address _account, uint256 _amount)`
> - `receiveColl(uint256 _amount)`
> - `accountForReceivedColl(uint256 _amount)`
> - `mintAggInterestAndAccountForTroveChange(TroveChange calldata _troveChange, address _batchAddress)` `[SUPPLY]`
> - `mintAggInterest()` `[SUPPLY]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xe8119fC02953B27a1b48D2573855738485A17329` | [↳ BorrowerOperations](#c-0xe8119fc02953b27a1b48d2573855738485a17329) | 🟠 HIGH | — | Storage+Events |  |

### > 🟠 `stabilityPool()`

> **Privileged write functions:**  
> **Capabilities:** 💰 **SUPPLY**
> - `sendColl(address _account, uint256 _amount)`
> - `mintAggInterest()` `[SUPPLY]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xd442E41019B7F5C4dD78F50dc03726C446148695` | [↳ StabilityPool](#c-0xd442e41019b7f5c4dd78f50dc03726c446148695) | 🟠 HIGH | — | Storage only |  |

### > 🟠 `troveManagerAddress()`

> **Privileged write functions:**  
> **Capabilities:** ⏸️ **PAUSE** 💰 **SUPPLY**
> - `sendColl(address _account, uint256 _amount)`
> - `sendCollToDefaultPool(uint256 _amount)`
> - `mintAggInterestAndAccountForTroveChange(TroveChange calldata _troveChange, address _batchAddress)` `[SUPPLY]`
> - `mintBatchManagementFeeAndAccountForChange(TroveChange calldata _troveChange, address _batchAddress)` `[SUPPLY]`
> - `setShutdownFlag()` `[PAUSE]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xb2B2ABEb5C357a234363FF5D180912D319e3e19e` | [↳ TroveManager](#c-0xb2b2abeb5c357a234363ff5d180912d319e3e19e) | 🟠 HIGH | — | Storage+Events |  |

### > 🟠 `defaultPoolAddress()`

> **Privileged write functions:**
> - `receiveColl(uint256 _amount)`
> - `accountForReceivedColl(uint256 _amount)`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x5cc5ceFD034Fdc4728D487a72Ca58A410CDdCD6b` | [↳ DefaultPool](#c-0x5cc5cefd034fdc4728d487a72ca58a410cddcd6b) | 🟠 HIGH | — | Storage+Events |  |

> #### 🔧 Permissioned Parameters

> **`setShutdownFlag`** ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Setter | `setShutdownFlag()` |
> | Gated by | `troveManagerAddress()` |
> | Tags | `PAUSE` |
> | Last called | — |
> | Called by | — |
> | Total calls | 0 ❄️ |

> #### 💰 Supply Actions

> _Mint / redeem / burn call tracking — last 5 calls per function, total counts preserved._

> **`mintAggInterest`** 🔄 **ACTIVE** (6906 changes)

> > ⚠️ This parameter has been changed **6906 times** — monitor for unexpected modifications.

> | Field | Value |
> |---|---|
> | Setter | `mintAggInterest()` |
> | Gated by | `borrowerOperationsAddress(), stabilityPool()` |
> | Tags | `SUPPLY` |
> | Last called | — |
> | Called by | — |
> | Total calls | 6906 🔄 |

> **`mintAggInterestAndAccountForTroveChange`** *(per-asset)* 🔄 **ACTIVE** (6906 changes)

> > ⚠️ This parameter has been changed **6906 times** — monitor for unexpected modifications.

> | Field | Value |
> |---|---|
> | Setter | `mintAggInterestAndAccountForTroveChange(TroveChange calldata _troveChange, address _batchAddress)` |
> | Gated by | `borrowerOperationsAddress(), troveManagerAddress()` |
> | Tags | `SUPPLY` |
> | Last called | — |
> | Called by | — |
> | Total calls | 6906 🔄 |

> **`mintBatchManagementFeeAndAccountForChange`** *(per-asset)* 🔄 **ACTIVE** (6906 changes)

> > ⚠️ This parameter has been changed **6906 times** — monitor for unexpected modifications.

> | Field | Value |
> |---|---|
> | Setter | `mintBatchManagementFeeAndAccountForChange(TroveChange calldata _troveChange, address _batchAddress)` |
> | Gated by | `troveManagerAddress()` |
> | Tags | `SUPPLY` |
> | Last called | — |
> | Called by | — |
> | Total calls | 6906 🔄 |

---
<a id="c-0xeb5a8c825582965f1d84606e078620a84ab16afe"></a>
## > ActivePool `0xeB5A8C825582965f1d84606E078620a84ab16AfE`

> *9 roles · 7 members · 8 functions*

> 🔒 **Immutable References:** `stabilityPoolAddress()` → StabilityPool, `collToken()` → WETH (WETH9), `interestRouter()` → Governance, `collTokenAddress()` → WETH (WETH9)

### > 🟠 `borrowerOperationsAddress()`

> **Privileged write functions:**  
> **Capabilities:** 💰 **SUPPLY**
> - `sendColl(address _account, uint256 _amount)`
> - `receiveColl(uint256 _amount)`
> - `accountForReceivedColl(uint256 _amount)`
> - `mintAggInterestAndAccountForTroveChange(TroveChange calldata _troveChange, address _batchAddress)` `[SUPPLY]`
> - `mintAggInterest()` `[SUPPLY]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x372ABD1810eAF23Cb9D941BbE7596DFb2c46BC65` | [↳ BorrowerOperations](#c-0x372abd1810eaf23cb9d941bbe7596dfb2c46bc65) | 🟠 HIGH | — | Storage+Events |  |

### > 🟠 `stabilityPool()`

> **Privileged write functions:**  
> **Capabilities:** 💰 **SUPPLY**
> - `sendColl(address _account, uint256 _amount)`
> - `mintAggInterest()` `[SUPPLY]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x5721cbbd64fc7Ae3Ef44A0A3F9a790A9264Cf9BF` | [↳ StabilityPool](#c-0x5721cbbd64fc7ae3ef44a0a3f9a790a9264cf9bf) | 🟠 HIGH | — | Storage only |  |

### > 🟠 `troveManagerAddress()`

> **Privileged write functions:**  
> **Capabilities:** ⏸️ **PAUSE** 💰 **SUPPLY**
> - `sendColl(address _account, uint256 _amount)`
> - `sendCollToDefaultPool(uint256 _amount)`
> - `mintAggInterestAndAccountForTroveChange(TroveChange calldata _troveChange, address _batchAddress)` `[SUPPLY]`
> - `mintBatchManagementFeeAndAccountForChange(TroveChange calldata _troveChange, address _batchAddress)` `[SUPPLY]`
> - `setShutdownFlag()` `[PAUSE]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x7bcb64B2c9206a5B699eD43363f6F98D4776Cf5A` | [↳ TroveManager](#c-0x7bcb64b2c9206a5b699ed43363f6f98d4776cf5a) | 🟠 HIGH | — | Storage+Events |  |

### > 🟠 `defaultPoolAddress()`

> **Privileged write functions:**
> - `receiveColl(uint256 _amount)`
> - `accountForReceivedColl(uint256 _amount)`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xD4558240d50C2E219a21c9d25afD513Bb6e5B1A0` | [↳ DefaultPool](#c-0xd4558240d50c2e219a21c9d25afd513bb6e5b1a0) | 🟠 HIGH | — | Storage+Events |  |

> #### 🔧 Permissioned Parameters

> **`setShutdownFlag`** ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Setter | `setShutdownFlag()` |
> | Gated by | `troveManagerAddress()` |
> | Tags | `PAUSE` |
> | Last called | — |
> | Called by | — |
> | Total calls | 0 ❄️ |

> #### 💰 Supply Actions

> _Mint / redeem / burn call tracking — last 5 calls per function, total counts preserved._

> **`mintAggInterest`** 🔄 **ACTIVE** (10000 changes)

> > ⚠️ This parameter has been changed **10000 times** — monitor for unexpected modifications.

> | Field | Value |
> |---|---|
> | Setter | `mintAggInterest()` |
> | Gated by | `borrowerOperationsAddress(), stabilityPool()` |
> | Tags | `SUPPLY` |
> | Last called | — |
> | Called by | — |
> | Total calls | 10000 🔄 |

> **`mintAggInterestAndAccountForTroveChange`** *(per-asset)* 🔄 **ACTIVE** (10000 changes)

> > ⚠️ This parameter has been changed **10000 times** — monitor for unexpected modifications.

> | Field | Value |
> |---|---|
> | Setter | `mintAggInterestAndAccountForTroveChange(TroveChange calldata _troveChange, address _batchAddress)` |
> | Gated by | `borrowerOperationsAddress(), troveManagerAddress()` |
> | Tags | `SUPPLY` |
> | Last called | — |
> | Called by | — |
> | Total calls | 10000 🔄 |

> **`mintBatchManagementFeeAndAccountForChange`** *(per-asset)* 🔄 **ACTIVE** (10000 changes)

> > ⚠️ This parameter has been changed **10000 times** — monitor for unexpected modifications.

> | Field | Value |
> |---|---|
> | Setter | `mintBatchManagementFeeAndAccountForChange(TroveChange calldata _troveChange, address _batchAddress)` |
> | Gated by | `troveManagerAddress()` |
> | Tags | `SUPPLY` |
> | Last called | — |
> | Called by | — |
> | Total calls | 10000 🔄 |

---
<a id="c-0x372abd1810eaf23cb9d941bbe7596dfb2c46bc65"></a>
## > BorrowerOperations `0x372ABD1810eAF23Cb9D941BbE7596DFb2c46BC65`

> *10 roles · 9 members · 0 functions*

> 🔒 **Immutable References:** `activePoolAddress()` → ActivePool, `defaultPoolAddress()` → DefaultPool, `troveNFTAddress()` → LV2_WETH (TroveNFT), `troveManagerAddress()` → TroveManager, `collSurplusPoolAddress()` → CollSurplusPool, `sortedTrovesAddress()` → SortedTroves, `gasPoolAddress()` → GasPool, `priceFeedAddress()` → WETHPriceFeed, `activePool()` → ActivePool

---
<a id="c-0xa741a32f9dcfe6adba088fd0f97e90742d7d5da3"></a>
## > BorrowerOperations `0xa741A32f9dcFe6aDBa088fD0f97e90742d7d5DA3`

> *10 roles · 9 members · 0 functions*

> 🔒 **Immutable References:** `activePoolAddress()` → ActivePool, `defaultPoolAddress()` → DefaultPool, `troveNFTAddress()` → LV2_wstETH (TroveNFT), `troveManagerAddress()` → TroveManager, `collSurplusPoolAddress()` → CollSurplusPool, `sortedTrovesAddress()` → SortedTroves, `gasPoolAddress()` → GasPool, `priceFeedAddress()` → WSTETHPriceFeed, `activePool()` → ActivePool

---
<a id="c-0xe8119fc02953b27a1b48d2573855738485a17329"></a>
## > BorrowerOperations `0xe8119fC02953B27a1b48D2573855738485A17329`

> *10 roles · 9 members · 0 functions*

> 🔒 **Immutable References:** `activePoolAddress()` → ActivePool, `defaultPoolAddress()` → DefaultPool, `troveNFTAddress()` → LV2_rETH (TroveNFT), `troveManagerAddress()` → TroveManager, `collSurplusPoolAddress()` → CollSurplusPool, `sortedTrovesAddress()` → SortedTroves, `gasPoolAddress()` → GasPool, `priceFeedAddress()` → RETHPriceFeed, `activePool()` → ActivePool

---
<a id="c-0x7bcb64b2c9206a5b699ed43363f6f98d4776cf5a"></a>
## > TroveManager `0x7bcb64B2c9206a5B699eD43363f6F98D4776Cf5A`

> *16 roles · 11 members · 14 functions*

> 🔒 **Immutable References:** `stabilityPoolAddress()` → StabilityPool, `troveNFT()` → LV2_WETH (TroveNFT), `activePoolAddress()` → ActivePool, `sortedTroves()` → SortedTroves, `borrowerOperationsAddress()` → BorrowerOperations, `defaultPoolAddress()` → DefaultPool, `troveNFTAddress()` → LV2_WETH (TroveNFT), `collateralRegistryAddress()` → CollateralRegistry, `stabilityPool()` → StabilityPool, `collSurplusPoolAddress()` → CollSurplusPool, `sortedTrovesAddress()` → SortedTroves, `gasPoolAddress()` → GasPool, `priceFeedAddress()` → WETHPriceFeed, `activePool()` → ActivePool

### > 🟠 `borrowerOperations()`

> **Privileged write functions:**  
> **Capabilities:** ⏸️ **PAUSE** 💰 **SUPPLY**
> - `shutdown()` `[PAUSE]`
> - `onOpenTrove(address _owner, uint256 _troveId, TroveChange memory _troveChange, uint256 _annualInterestRate)` `[SUPPLY]`
> - `onOpenTroveAndJoinBatch(address _owner, uint256 _troveId, TroveChange memory _troveChange, address _batchAddress, uint256 _batchColl, uint256 _batchDebt)` `[SUPPLY]`
> - `setTroveStatusToActive(uint256 _troveId)`
> - `onAdjustTroveInterestRate(uint256 _troveId, uint256 _newColl, uint256 _newDebt, uint256 _newAnnualInterestRate, TroveChange calldata _troveChange)`
> - `onAdjustTrove(uint256 _troveId, uint256 _newColl, uint256 _newDebt, TroveChange calldata _troveChange)`
> - `onCloseTrove(uint256 _troveId, TroveChange memory _troveChange, address _batchAddress, uint256 _newBatchColl, uint256 _newBatchDebt)` `[SUPPLY]`
> - `onAdjustTroveInsideBatch(uint256 _troveId, uint256 _newTroveColl, uint256 _newTroveDebt, TroveChange memory _troveChange, address _batchAddress, uint256 _newBatchColl, uint256 _newBatchDebt)`
> - `onApplyTroveInterest(uint256 _troveId, uint256 _newTroveColl, uint256 _newTroveDebt, address _batchAddress, uint256 _newBatchColl, uint256 _newBatchDebt, TroveChange calldata _troveChange)`
> - `onRegisterBatchManager(address _account, uint256 _annualInterestRate, uint256 _annualManagementFee)`
> - `onLowerBatchManagerAnnualFee(address _batchAddress, uint256 _newColl, uint256 _newDebt, uint256 _newAnnualManagementFee)`
> - `onSetBatchManagerAnnualInterestRate(address _batchAddress, uint256 _newColl, uint256 _newDebt, uint256 _newAnnualInterestRate, uint256 _upfrontFee)`
> - `onSetInterestBatchManager(OnSetInterestBatchManagerParams calldata _params)`
> - `onRemoveFromBatch(uint256 _troveId, uint256 _newTroveColl, uint256 _newTroveDebt, TroveChange memory _troveChange, address _batchAddress, uint256 _newBatchColl, uint256 _newBatchDebt, uint256 _newAnnualInterestRate)`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x372ABD1810eAF23Cb9D941BbE7596DFb2c46BC65` | [↳ BorrowerOperations](#c-0x372abd1810eaf23cb9d941bbe7596dfb2c46bc65) | 🟠 HIGH | — | Storage only |  |

> #### 🔧 Permissioned Parameters

> **`shutdown`** ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Setter | `shutdown()` |
> | Gated by | `borrowerOperations()` |
> | Tags | `PAUSE` |
> | Last called | — |
> | Called by | — |
> | Total calls | 0 ❄️ |

> #### 💰 Supply Actions

> _Mint / redeem / burn call tracking — last 5 calls per function, total counts preserved._

> **`onCloseTrove`** *(per-asset)* 🔄 **ACTIVE** (350 changes)

> > ⚠️ This parameter has been changed **350 times** — monitor for unexpected modifications.

> | Field | Value |
> |---|---|
> | Setter | `onCloseTrove(uint256 _troveId, TroveChange memory _troveChange, address _batchAddress, uint256 _newBatchColl, uint256 _newBatchDebt)` |
> | Gated by | `borrowerOperations()` |
> | Tags | `SUPPLY` |
> | Last called | — |
> | Called by | — |
> | Total calls | 350 🔄 |

> **`onOpenTrove`** *(per-asset)* 🔄 **ACTIVE** (360 changes)

> > ⚠️ This parameter has been changed **360 times** — monitor for unexpected modifications.

> | Field | Value |
> |---|---|
> | Setter | `onOpenTrove(address _owner, uint256 _troveId, TroveChange memory _troveChange, uint256 _annualInterestRate)` |
> | Gated by | `borrowerOperations()` |
> | Tags | `SUPPLY` |
> | Last called | — |
> | Called by | — |
> | Total calls | 360 🔄 |

> **`onOpenTroveAndJoinBatch`** *(per-asset)* 🔄 **ACTIVE** (155 changes)

> > ⚠️ This parameter has been changed **155 times** — monitor for unexpected modifications.

> | Field | Value |
> |---|---|
> | Setter | `onOpenTroveAndJoinBatch(address _owner, uint256 _troveId, TroveChange memory _troveChange, address _batchAddress, uint256 _batchColl, uint256 _batchDebt)` |
> | Gated by | `borrowerOperations()` |
> | Tags | `SUPPLY` |
> | Last called | — |
> | Called by | — |
> | Total calls | 155 🔄 |

---
<a id="c-0xa2895d6a3bf110561dfe4b71ca539d84e1928b22"></a>
## > TroveManager `0xA2895d6A3bf110561Dfe4b71cA539d84e1928B22`

> *16 roles · 11 members · 14 functions*

> 🔒 **Immutable References:** `stabilityPoolAddress()` → StabilityPool, `troveNFT()` → LV2_wstETH (TroveNFT), `activePoolAddress()` → ActivePool, `sortedTroves()` → SortedTroves, `borrowerOperationsAddress()` → BorrowerOperations, `defaultPoolAddress()` → DefaultPool, `troveNFTAddress()` → LV2_wstETH (TroveNFT), `collateralRegistryAddress()` → CollateralRegistry, `stabilityPool()` → StabilityPool, `collSurplusPoolAddress()` → CollSurplusPool, `sortedTrovesAddress()` → SortedTroves, `gasPoolAddress()` → GasPool, `priceFeedAddress()` → WSTETHPriceFeed, `activePool()` → ActivePool

### > 🟠 `borrowerOperations()`

> **Privileged write functions:**  
> **Capabilities:** ⏸️ **PAUSE** 💰 **SUPPLY**
> - `shutdown()` `[PAUSE]`
> - `onOpenTrove(address _owner, uint256 _troveId, TroveChange memory _troveChange, uint256 _annualInterestRate)` `[SUPPLY]`
> - `onOpenTroveAndJoinBatch(address _owner, uint256 _troveId, TroveChange memory _troveChange, address _batchAddress, uint256 _batchColl, uint256 _batchDebt)` `[SUPPLY]`
> - `setTroveStatusToActive(uint256 _troveId)`
> - `onAdjustTroveInterestRate(uint256 _troveId, uint256 _newColl, uint256 _newDebt, uint256 _newAnnualInterestRate, TroveChange calldata _troveChange)`
> - `onAdjustTrove(uint256 _troveId, uint256 _newColl, uint256 _newDebt, TroveChange calldata _troveChange)`
> - `onCloseTrove(uint256 _troveId, TroveChange memory _troveChange, address _batchAddress, uint256 _newBatchColl, uint256 _newBatchDebt)` `[SUPPLY]`
> - `onAdjustTroveInsideBatch(uint256 _troveId, uint256 _newTroveColl, uint256 _newTroveDebt, TroveChange memory _troveChange, address _batchAddress, uint256 _newBatchColl, uint256 _newBatchDebt)`
> - `onApplyTroveInterest(uint256 _troveId, uint256 _newTroveColl, uint256 _newTroveDebt, address _batchAddress, uint256 _newBatchColl, uint256 _newBatchDebt, TroveChange calldata _troveChange)`
> - `onRegisterBatchManager(address _account, uint256 _annualInterestRate, uint256 _annualManagementFee)`
> - `onLowerBatchManagerAnnualFee(address _batchAddress, uint256 _newColl, uint256 _newDebt, uint256 _newAnnualManagementFee)`
> - `onSetBatchManagerAnnualInterestRate(address _batchAddress, uint256 _newColl, uint256 _newDebt, uint256 _newAnnualInterestRate, uint256 _upfrontFee)`
> - `onSetInterestBatchManager(OnSetInterestBatchManagerParams calldata _params)`
> - `onRemoveFromBatch(uint256 _troveId, uint256 _newTroveColl, uint256 _newTroveDebt, TroveChange memory _troveChange, address _batchAddress, uint256 _newBatchColl, uint256 _newBatchDebt, uint256 _newAnnualInterestRate)`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xa741A32f9dcFe6aDBa088fD0f97e90742d7d5DA3` | [↳ BorrowerOperations](#c-0xa741a32f9dcfe6adba088fd0f97e90742d7d5da3) | 🟠 HIGH | — | Storage only |  |

> #### 🔧 Permissioned Parameters

> **`shutdown`** ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Setter | `shutdown()` |
> | Gated by | `borrowerOperations()` |
> | Tags | `PAUSE` |
> | Last called | — |
> | Called by | — |
> | Total calls | 0 ❄️ |

> #### 💰 Supply Actions

> _Mint / redeem / burn call tracking — last 5 calls per function, total counts preserved._

> **`onCloseTrove`** *(per-asset)* 🔄 **ACTIVE** (233 changes)

> > ⚠️ This parameter has been changed **233 times** — monitor for unexpected modifications.

> | Field | Value |
> |---|---|
> | Setter | `onCloseTrove(uint256 _troveId, TroveChange memory _troveChange, address _batchAddress, uint256 _newBatchColl, uint256 _newBatchDebt)` |
> | Gated by | `borrowerOperations()` |
> | Tags | `SUPPLY` |
> | Last called | — |
> | Called by | — |
> | Total calls | 233 🔄 |

> **`onOpenTrove`** *(per-asset)* 🔄 **ACTIVE** (218 changes)

> > ⚠️ This parameter has been changed **218 times** — monitor for unexpected modifications.

> | Field | Value |
> |---|---|
> | Setter | `onOpenTrove(address _owner, uint256 _troveId, TroveChange memory _troveChange, uint256 _annualInterestRate)` |
> | Gated by | `borrowerOperations()` |
> | Tags | `SUPPLY` |
> | Last called | — |
> | Called by | — |
> | Total calls | 218 🔄 |

> **`onOpenTroveAndJoinBatch`** *(per-asset)* 🔄 **ACTIVE** (115 changes)

> > ⚠️ This parameter has been changed **115 times** — monitor for unexpected modifications.

> | Field | Value |
> |---|---|
> | Setter | `onOpenTroveAndJoinBatch(address _owner, uint256 _troveId, TroveChange memory _troveChange, address _batchAddress, uint256 _batchColl, uint256 _batchDebt)` |
> | Gated by | `borrowerOperations()` |
> | Tags | `SUPPLY` |
> | Last called | — |
> | Called by | — |
> | Total calls | 115 🔄 |

---
<a id="c-0xb2b2abeb5c357a234363ff5d180912d319e3e19e"></a>
## > TroveManager `0xb2B2ABEb5C357a234363FF5D180912D319e3e19e`

> *16 roles · 11 members · 14 functions*

> 🔒 **Immutable References:** `stabilityPoolAddress()` → StabilityPool, `troveNFT()` → LV2_rETH (TroveNFT), `activePoolAddress()` → ActivePool, `sortedTroves()` → SortedTroves, `borrowerOperationsAddress()` → BorrowerOperations, `defaultPoolAddress()` → DefaultPool, `troveNFTAddress()` → LV2_rETH (TroveNFT), `collateralRegistryAddress()` → CollateralRegistry, `stabilityPool()` → StabilityPool, `collSurplusPoolAddress()` → CollSurplusPool, `sortedTrovesAddress()` → SortedTroves, `gasPoolAddress()` → GasPool, `priceFeedAddress()` → RETHPriceFeed, `activePool()` → ActivePool

### > 🟠 `borrowerOperations()`

> **Privileged write functions:**  
> **Capabilities:** ⏸️ **PAUSE** 💰 **SUPPLY**
> - `shutdown()` `[PAUSE]`
> - `onOpenTrove(address _owner, uint256 _troveId, TroveChange memory _troveChange, uint256 _annualInterestRate)` `[SUPPLY]`
> - `onOpenTroveAndJoinBatch(address _owner, uint256 _troveId, TroveChange memory _troveChange, address _batchAddress, uint256 _batchColl, uint256 _batchDebt)` `[SUPPLY]`
> - `setTroveStatusToActive(uint256 _troveId)`
> - `onAdjustTroveInterestRate(uint256 _troveId, uint256 _newColl, uint256 _newDebt, uint256 _newAnnualInterestRate, TroveChange calldata _troveChange)`
> - `onAdjustTrove(uint256 _troveId, uint256 _newColl, uint256 _newDebt, TroveChange calldata _troveChange)`
> - `onCloseTrove(uint256 _troveId, TroveChange memory _troveChange, address _batchAddress, uint256 _newBatchColl, uint256 _newBatchDebt)` `[SUPPLY]`
> - `onAdjustTroveInsideBatch(uint256 _troveId, uint256 _newTroveColl, uint256 _newTroveDebt, TroveChange memory _troveChange, address _batchAddress, uint256 _newBatchColl, uint256 _newBatchDebt)`
> - `onApplyTroveInterest(uint256 _troveId, uint256 _newTroveColl, uint256 _newTroveDebt, address _batchAddress, uint256 _newBatchColl, uint256 _newBatchDebt, TroveChange calldata _troveChange)`
> - `onRegisterBatchManager(address _account, uint256 _annualInterestRate, uint256 _annualManagementFee)`
> - `onLowerBatchManagerAnnualFee(address _batchAddress, uint256 _newColl, uint256 _newDebt, uint256 _newAnnualManagementFee)`
> - `onSetBatchManagerAnnualInterestRate(address _batchAddress, uint256 _newColl, uint256 _newDebt, uint256 _newAnnualInterestRate, uint256 _upfrontFee)`
> - `onSetInterestBatchManager(OnSetInterestBatchManagerParams calldata _params)`
> - `onRemoveFromBatch(uint256 _troveId, uint256 _newTroveColl, uint256 _newTroveDebt, TroveChange memory _troveChange, address _batchAddress, uint256 _newBatchColl, uint256 _newBatchDebt, uint256 _newAnnualInterestRate)`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xe8119fC02953B27a1b48D2573855738485A17329` | [↳ BorrowerOperations](#c-0xe8119fc02953b27a1b48d2573855738485a17329) | 🟠 HIGH | — | Storage only |  |

> #### 🔧 Permissioned Parameters

> **`shutdown`** ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Setter | `shutdown()` |
> | Gated by | `borrowerOperations()` |
> | Tags | `PAUSE` |
> | Last called | — |
> | Called by | — |
> | Total calls | 0 ❄️ |

> #### 💰 Supply Actions

> _Mint / redeem / burn call tracking — last 5 calls per function, total counts preserved._

> **`onCloseTrove`** *(per-asset)* 🔄 **ACTIVE** (79 changes)

> > ⚠️ This parameter has been changed **79 times** — monitor for unexpected modifications.

> | Field | Value |
> |---|---|
> | Setter | `onCloseTrove(uint256 _troveId, TroveChange memory _troveChange, address _batchAddress, uint256 _newBatchColl, uint256 _newBatchDebt)` |
> | Gated by | `borrowerOperations()` |
> | Tags | `SUPPLY` |
> | Last called | — |
> | Called by | — |
> | Total calls | 79 🔄 |

> **`onOpenTrove`** *(per-asset)* 🔄 **ACTIVE** (74 changes)

> > ⚠️ This parameter has been changed **74 times** — monitor for unexpected modifications.

> | Field | Value |
> |---|---|
> | Setter | `onOpenTrove(address _owner, uint256 _troveId, TroveChange memory _troveChange, uint256 _annualInterestRate)` |
> | Gated by | `borrowerOperations()` |
> | Tags | `SUPPLY` |
> | Last called | — |
> | Called by | — |
> | Total calls | 74 🔄 |

> **`onOpenTroveAndJoinBatch`** *(per-asset)* 🔄 **ACTIVE** (29 changes)

> > ⚠️ This parameter has been changed **29 times** — monitor for unexpected modifications.

> | Field | Value |
> |---|---|
> | Setter | `onOpenTroveAndJoinBatch(address _owner, uint256 _troveId, TroveChange memory _troveChange, address _batchAddress, uint256 _batchColl, uint256 _batchDebt)` |
> | Gated by | `borrowerOperations()` |
> | Tags | `SUPPLY` |
> | Last called | — |
> | Called by | — |
> | Total calls | 29 🔄 |

---
<a id="c-0xf949982b91c8c61e952b3ba942cbbfaef5386684"></a>
## > CollateralRegistry `0xf949982B91C8c61e952B3bA942cbbfaef5386684`

> *1 role · 1 member · 0 functions*

> > 💰 **Inherited supply authority** — holds `collateralRegistryAddress()` on **BoldToken**. Access controls on this contract gate root token supply.

---
<a id="c-0xcc5f8102eb670c89a4a3c567c13851260303c24f"></a>
## > WETHPriceFeed `0xCC5F8102eb670c89a4a3c567C13851260303c24F`

> *0 roles · 0 members · 0 functions*

> > ⚡ **Inherited authority** [CONFIG, PAUSE] — via `priceFeed-WETH` on **BoldToken**

> _No roles detected._

---
<a id="c-0xe7aa2ba9e086a379d3beb224098bc634a46e314e"></a>
## > WSTETHPriceFeed `0xe7Aa2Ba9E086A379d3beb224098bC634a46e314E`

> *1 role · 1 member · 0 functions*

> > ⚡ **Inherited authority** [CONFIG, PAUSE] — via `priceFeed-wstETH` on **BoldToken**

> 🔒 **Immutable References:** `rateProviderAddress()` → wstETH (WstETH)

> #### 🔧 Permissioned Parameters

> **`STETH_USD_DEVIATION_THRESHOLD`** 🔒 **IMMUTABLE**

> > 🔒 **Immutable** — declared as a constant in the contract source; cannot be changed without a contract upgrade. Bounds the reachable extreme of any setter that writes a related storage variable.

> | Field | Value |
> |---|---|
> | Current Value | `10000000000000000 (0.010000e18)` |
> | Mutability | 🔒 immutable (constant) |
> | Tags | `IMMUTABLE` |

---
<a id="c-0x34f1e9c7dcc279ec70d3c4488eb2d80fba8b7b2b"></a>
## > RETHPriceFeed `0x34F1E9c7dcc279ec70d3c4488EB2D80FBa8B7b2B`

> *1 role · 1 member · 0 functions*

> > ⚡ **Inherited authority** [CONFIG, PAUSE] — via `priceFeed-rETH` on **BoldToken**

> 🔒 **Immutable References:** `rateProviderAddress()` → rETH (RocketTokenRETH)

> #### 🔧 Permissioned Parameters

> **`RETH_ETH_DEVIATION_THRESHOLD`** 🔒 **IMMUTABLE**

> > 🔒 **Immutable** — declared as a constant in the contract source; cannot be changed without a contract upgrade. Bounds the reachable extreme of any setter that writes a related storage variable.

> | Field | Value |
> |---|---|
> | Current Value | `20000000000000000 (0.020000e18)` |
> | Mutability | 🔒 immutable (constant) |
> | Tags | `IMMUTABLE` |

---
<a id="c-0xd796e1648526400386cc4d12fa05e5f11e6a22a1"></a>
## > DefaultPool `0xD796e1648526400386CC4d12FA05E5F11e6a22A1`

> *4 roles · 3 members · 4 functions*

> 🔒 **Immutable References:** `collToken()` → wstETH (WstETH), `collTokenAddress()` → wstETH (WstETH)

### > 🟠 `activePoolAddress()`

> **Privileged write functions:**
> - `receiveColl(uint256 _amount)`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x531a8f99c70D6A56A7CEe02d6B4281650d7919a0` | [↳ ActivePool](#c-0x531a8f99c70d6a56a7cee02d6b4281650d7919a0) | 🟠 HIGH | — | Storage+Events |  |

### > 🟠 `troveManagerAddress()`

> **Privileged write functions:**
> - `sendCollToActivePool(uint256 _amount)`
> - `increaseBoldDebt(uint256 _amount)`
> - `decreaseBoldDebt(uint256 _amount)`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xA2895d6A3bf110561Dfe4b71cA539d84e1928B22` | [↳ TroveManager](#c-0xa2895d6a3bf110561dfe4b71ca539d84e1928b22) | 🟠 HIGH | — | Storage+Events |  |

---
<a id="c-0x5cc5cefd034fdc4728d487a72ca58a410cddcd6b"></a>
## > DefaultPool `0x5cc5ceFD034Fdc4728D487a72Ca58A410CDdCD6b`

> *4 roles · 3 members · 4 functions*

> 🔒 **Immutable References:** `collToken()` → rETH (RocketTokenRETH), `collTokenAddress()` → rETH (RocketTokenRETH)

### > 🟠 `activePoolAddress()`

> **Privileged write functions:**
> - `receiveColl(uint256 _amount)`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x9074D72cc82DaD1e13E454755Aa8f144c479532F` | [↳ ActivePool](#c-0x9074d72cc82dad1e13e454755aa8f144c479532f) | 🟠 HIGH | — | Storage+Events |  |

### > 🟠 `troveManagerAddress()`

> **Privileged write functions:**
> - `sendCollToActivePool(uint256 _amount)`
> - `increaseBoldDebt(uint256 _amount)`
> - `decreaseBoldDebt(uint256 _amount)`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xb2B2ABEb5C357a234363FF5D180912D319e3e19e` | [↳ TroveManager](#c-0xb2b2abeb5c357a234363ff5d180912d319e3e19e) | 🟠 HIGH | — | Storage+Events |  |

---
<a id="c-0xd4558240d50c2e219a21c9d25afd513bb6e5b1a0"></a>
## > DefaultPool `0xD4558240d50C2E219a21c9d25afD513Bb6e5B1A0`

> *4 roles · 3 members · 4 functions*

> 🔒 **Immutable References:** `collToken()` → WETH (WETH9), `collTokenAddress()` → WETH (WETH9)

### > 🟠 `activePoolAddress()`

> **Privileged write functions:**
> - `receiveColl(uint256 _amount)`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xeB5A8C825582965f1d84606E078620a84ab16AfE` | [↳ ActivePool](#c-0xeb5a8c825582965f1d84606e078620a84ab16afe) | 🟠 HIGH | — | Storage+Events |  |

### > 🟠 `troveManagerAddress()`

> **Privileged write functions:**
> - `sendCollToActivePool(uint256 _amount)`
> - `increaseBoldDebt(uint256 _amount)`
> - `decreaseBoldDebt(uint256 _amount)`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x7bcb64B2c9206a5B699eD43363f6F98D4776Cf5A` | [↳ TroveManager](#c-0x7bcb64b2c9206a5b699ed43363f6f98d4776cf5a) | 🟠 HIGH | — | Storage+Events |  |

---
## ⚡ Authority Concentration

The following addresses hold permissions across multiple contracts or roles in this dependency stack. Concentration of authority increases systemic risk — a single compromised key or colluding multisig can affect multiple systems.

### 🟠 `0x7bcb64B2c9206a5B699eD43363f6F98D4776Cf5A` — TroveManager
Controls **4 role(s)** across **4 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| BoldToken `0x6440...B01D` | `troveManager-WETH` | `troveManagerAddresses (internal mapping, no getter)` | — |
| StabilityPool `0x5721...f9BF` | `troveManager()` | `offset(uint256 _debtToOffset, uint256 _collToAdd)` | — |
| ActivePool `0xeB5A...6AfE` | `troveManagerAddress()` | `sendColl(address _account, uint256 _amount)`, `sendCollToDefaultPool(uint256 _amount)`, `mintAggInterestAndAccountForTroveChange(TroveChange calldata _troveChange, address _batchAddress)`, `mintBatchManagementFeeAndAccountForChange(TroveChange calldata _troveChange, address _batchAddress)` +1 more | — |
| DefaultPool `0xD455...B1A0` | `troveManagerAddress()` | `sendCollToActivePool(uint256 _amount)`, `increaseBoldDebt(uint256 _amount)`, `decreaseBoldDebt(uint256 _amount)` | — |

### 🟠 `0xA2895d6A3bf110561Dfe4b71cA539d84e1928B22` — TroveManager
Controls **4 role(s)** across **4 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| BoldToken `0x6440...B01D` | `troveManager-wstETH` | `troveManagerAddresses (internal mapping, no getter)` | — |
| StabilityPool `0x9502...e56B` | `troveManager()` | `offset(uint256 _debtToOffset, uint256 _collToAdd)` | — |
| ActivePool `0x531a...19a0` | `troveManagerAddress()` | `sendColl(address _account, uint256 _amount)`, `sendCollToDefaultPool(uint256 _amount)`, `mintAggInterestAndAccountForTroveChange(TroveChange calldata _troveChange, address _batchAddress)`, `mintBatchManagementFeeAndAccountForChange(TroveChange calldata _troveChange, address _batchAddress)` +1 more | — |
| DefaultPool `0xD796...22A1` | `troveManagerAddress()` | `sendCollToActivePool(uint256 _amount)`, `increaseBoldDebt(uint256 _amount)`, `decreaseBoldDebt(uint256 _amount)` | — |

### 🟠 `0xb2B2ABEb5C357a234363FF5D180912D319e3e19e` — TroveManager
Controls **4 role(s)** across **4 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| BoldToken `0x6440...B01D` | `troveManager-rETH` | `troveManagerAddresses (internal mapping, no getter)` | — |
| StabilityPool `0xd442...8695` | `troveManager()` | `offset(uint256 _debtToOffset, uint256 _collToAdd)` | — |
| ActivePool `0x9074...532F` | `troveManagerAddress()` | `sendColl(address _account, uint256 _amount)`, `sendCollToDefaultPool(uint256 _amount)`, `mintAggInterestAndAccountForTroveChange(TroveChange calldata _troveChange, address _batchAddress)`, `mintBatchManagementFeeAndAccountForChange(TroveChange calldata _troveChange, address _batchAddress)` +1 more | — |
| DefaultPool `0x5cc5...CD6b` | `troveManagerAddress()` | `sendCollToActivePool(uint256 _amount)`, `increaseBoldDebt(uint256 _amount)`, `decreaseBoldDebt(uint256 _amount)` | — |

### 🟠 `0x372ABD1810eAF23Cb9D941BbE7596DFb2c46BC65` — BorrowerOperations
Controls **3 role(s)** across **3 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| BoldToken `0x6440...B01D` | `borrowerOperations-WETH` | `borrowerOperationsAddresses (internal mapping, no getter)` | — |
| ActivePool `0xeB5A...6AfE` | `borrowerOperationsAddress()` | `sendColl(address _account, uint256 _amount)`, `receiveColl(uint256 _amount)`, `accountForReceivedColl(uint256 _amount)`, `mintAggInterestAndAccountForTroveChange(TroveChange calldata _troveChange, address _batchAddress)` +1 more | — |
| TroveManager `0x7bcb...Cf5A` | `borrowerOperations()` | `shutdown()`, `onOpenTrove(address _owner, uint256 _troveId, TroveChange memory _troveChange, uint256 _annualInterestRate)`, `onOpenTroveAndJoinBatch(address _owner, uint256 _troveId, TroveChange memory _troveChange, address _batchAddress, uint256 _batchColl, uint256 _batchDebt)`, `setTroveStatusToActive(uint256 _troveId)` +10 more | — |

### 🟠 `0xa741A32f9dcFe6aDBa088fD0f97e90742d7d5DA3` — BorrowerOperations
Controls **3 role(s)** across **3 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| BoldToken `0x6440...B01D` | `borrowerOperations-wstETH` | `borrowerOperationsAddresses (internal mapping, no getter)` | — |
| ActivePool `0x531a...19a0` | `borrowerOperationsAddress()` | `sendColl(address _account, uint256 _amount)`, `receiveColl(uint256 _amount)`, `accountForReceivedColl(uint256 _amount)`, `mintAggInterestAndAccountForTroveChange(TroveChange calldata _troveChange, address _batchAddress)` +1 more | — |
| TroveManager `0xA289...8B22` | `borrowerOperations()` | `shutdown()`, `onOpenTrove(address _owner, uint256 _troveId, TroveChange memory _troveChange, uint256 _annualInterestRate)`, `onOpenTroveAndJoinBatch(address _owner, uint256 _troveId, TroveChange memory _troveChange, address _batchAddress, uint256 _batchColl, uint256 _batchDebt)`, `setTroveStatusToActive(uint256 _troveId)` +10 more | — |

### 🟠 `0xe8119fC02953B27a1b48D2573855738485A17329` — BorrowerOperations
Controls **3 role(s)** across **3 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| BoldToken `0x6440...B01D` | `borrowerOperations-rETH` | `borrowerOperationsAddresses (internal mapping, no getter)` | — |
| ActivePool `0x9074...532F` | `borrowerOperationsAddress()` | `sendColl(address _account, uint256 _amount)`, `receiveColl(uint256 _amount)`, `accountForReceivedColl(uint256 _amount)`, `mintAggInterestAndAccountForTroveChange(TroveChange calldata _troveChange, address _batchAddress)` +1 more | — |
| TroveManager `0xb2B2...e19e` | `borrowerOperations()` | `shutdown()`, `onOpenTrove(address _owner, uint256 _troveId, TroveChange memory _troveChange, uint256 _annualInterestRate)`, `onOpenTroveAndJoinBatch(address _owner, uint256 _troveId, TroveChange memory _troveChange, address _batchAddress, uint256 _batchColl, uint256 _batchDebt)`, `setTroveStatusToActive(uint256 _troveId)` +10 more | — |

### 🟠 `0xeB5A8C825582965f1d84606E078620a84ab16AfE` — ActivePool
Controls **3 role(s)** across **3 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| BoldToken `0x6440...B01D` | `activePool-WETH` | `activePoolAddresses (internal mapping, no getter)` | — |
| StabilityPool `0x5721...f9BF` | `activePool()` | `triggerBoldRewards(uint256 _boldYield)` | — |
| DefaultPool `0xD455...B1A0` | `activePoolAddress()` | `receiveColl(uint256 _amount)` | — |

### 🟠 `0x531a8f99c70D6A56A7CEe02d6B4281650d7919a0` — ActivePool
Controls **3 role(s)** across **3 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| BoldToken `0x6440...B01D` | `activePool-wstETH` | `activePoolAddresses (internal mapping, no getter)` | — |
| StabilityPool `0x9502...e56B` | `activePool()` | `triggerBoldRewards(uint256 _boldYield)` | — |
| DefaultPool `0xD796...22A1` | `activePoolAddress()` | `receiveColl(uint256 _amount)` | — |

### 🟠 `0x9074D72cc82DaD1e13E454755Aa8f144c479532F` — ActivePool
Controls **3 role(s)** across **3 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| BoldToken `0x6440...B01D` | `activePool-rETH` | `activePoolAddresses (internal mapping, no getter)` | — |
| StabilityPool `0xd442...8695` | `activePool()` | `triggerBoldRewards(uint256 _boldYield)` | — |
| DefaultPool `0x5cc5...CD6b` | `activePoolAddress()` | `receiveColl(uint256 _amount)` | — |

### 🟠 `0x5721cbbd64fc7Ae3Ef44A0A3F9a790A9264Cf9BF` — StabilityPool
Controls **2 role(s)** across **2 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| BoldToken `0x6440...B01D` | `stabilityPool-WETH` | `stabilityPoolAddresses (internal mapping, no getter)` | — |
| ActivePool `0xeB5A...6AfE` | `stabilityPool()` | `sendColl(address _account, uint256 _amount)`, `mintAggInterest()` | — |

### 🟠 `0x9502b7c397E9aa22FE9dB7EF7DAF21cD2AEBe56B` — StabilityPool
Controls **2 role(s)** across **2 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| BoldToken `0x6440...B01D` | `stabilityPool-wstETH` | `stabilityPoolAddresses (internal mapping, no getter)` | — |
| ActivePool `0x531a...19a0` | `stabilityPool()` | `sendColl(address _account, uint256 _amount)`, `mintAggInterest()` | — |

### 🟠 `0xd442E41019B7F5C4dD78F50dc03726C446148695` — StabilityPool
Controls **2 role(s)** across **2 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| BoldToken `0x6440...B01D` | `stabilityPool-rETH` | `stabilityPoolAddresses (internal mapping, no getter)` | — |
| ActivePool `0x9074...532F` | `stabilityPool()` | `sendColl(address _account, uint256 _amount)`, `mintAggInterest()` | — |


---
## ⛔ Sanctions Screening

| Source | Status |
|---|---|
| OFAC SDN | ✅ OFAC SDN screened (124 ETH addresses, cache: 2026-09-09) |
| Chainalysis | ✅ Chainalysis screened |
| **Result** | 37 addresses screened · ✅ 0 flagged |

---
## EOA Exposure Summary

✅ No direct EOA role holders detected.

---
## ✅ Scan Integrity

No issues detected. All block ranges covered, source and ABI resolved for all contracts.
