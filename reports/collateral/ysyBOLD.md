# Trustfall — Access Control Report — Staked yBOLD (ysyBOLD)

| Field | Value |
|---|---|
| Contract | `0x23346B04a7f55b8760E5860AA5A77383D63491cD` |
| Token | Staked yBOLD (ysyBOLD) |
| Name | LV2SPStakerStrategy |
| Chain | Ethereum |
| Proxy Status | ⚠️ **YES** — Proxy (ERC-1967) (**immutable** — logic address is a bytecode constant; the EIP-1967 slot is informational) → `0xD377919FA87120584B21279a491F82D5265A139c` |
| OZ AccessControl | ❌ No |
| Ownable | ❌ No |
| Pausable | — |
| ERC-4626 Vault | ✅ Underlying: `0x9F4330700a36B29952869fac9b33f45EEdd8A3d8` |
| Control Surface | ⚠️ Hybrid — 1 off-chain dependency (redemption) |
| Scan Integrity | ✅ No issues detected |
| Report Date | 2026-09-14 05:01 UTC |

### Surface Summary

| Field | Value |
|---|---:|
| Contracts | 15 |
| Role slots | 79 |
| Privileged Fns | 140 |
| EOA Holders | 1 ⚠️ |
| Critical Roles | 1 ⚠️ |

## Changes Since Last Scan

> Comparing **2026-09-14T00:34:40Z** (block 25972084) → **2026-09-14T05:00:19Z** (block 25973411).

> ✅ No changes to roles, parameters, contracts, or findings.


## 📋 Protocol Context

> *From protocol profile: Yearn V3 / ysyBOLD (ERC-4626 staking wrapper over an ERC-4626 vault (Yearn TokenizedStrategy))*

<details>
<summary><strong>Architecture</strong></summary>

- **Stack shape:** a Yearn V3 staking wrapper (ysyBOLD) over an unmodified Yearn V3 vault (yBOLD), whose three custom strategies deposit BOLD into Liquity V2's three Stability Pools. Yearn's standard multisigs, a 7 day timelock and Yearn's keeper bots run the stack.

- **What ysyBOLD is:** the staked tier of the stack. A holder deposits yBOLD and receives ysyBOLD; its own asset() is yBOLD, not BOLD, so the asset proposed for FiRM sits two wrappers above the stablecoin that backs it. The contract is LV2SPStakerStrategy 0x23346B04a7f55b8760E5860AA5A77383D63491cD, built on Yearn's TokenizedStrategy. That logic, at 0xD377919FA87120584B21279a491F82D5265A139c, is compiled into ysyBOLD and each strategy, so none of them can be pointed at different logic.

- **The three layers, and where value accrues:** BOLD is the Liquity V2 stablecoin. yBOLD 0x9F4330700a36B29952869fac9b33f45EEdd8A3d8, a minimal-proxy clone of Yearn's Vault 3.0.4, holds BOLD, and ysyBOLD holds yBOLD. yBOLD's price per share stays at exactly 1.0 while ysyBOLD's rises (about 1.094 as of block 25,970,490), so the yield accrues to the staked tier. A holder of yBOLD who does not stake earns nothing.

- **Where the yield comes from:** yBOLD lends its BOLD to three LiquityV2SPStrategy contracts, one per Liquity V2 branch (WETH, wstETH, rETH), and each deposits it into that branch's Stability Pool. A Stability Pool depositor earns a share of borrower interest in BOLD. When a liquidation happens, part of its BOLD repays the liquidated debt and it receives the liquidated collateral in exchange. As of block 25,970,490 the split was about 59, 6 and 35 percent, and yBOLD made up about 48, 6 and 47 percent of those three pools.

- **Allocation across the branches:** Yearn's shared DebtAllocator 0x1e9eB053228B1156831759401dE0E115356b8671 holds a target share for each of yBOLD's strategies, and Yearn's DebtOptimizerApplicator, run by a keeper bot, resets the targets every few days (a median gap of 5 days since February 2026, with pauses of up to 29 days). New deposits into yBOLD go to the WETH strategy first. Keepers pull BOLD from a strategy only once it holds more than 1.2 times its target, by over 10,000 BOLD with the base fee at most 2.5 gwei, and place the freed BOLD in the strategies below target.

- **How yield reaches ysyBOLD:** each strategy reports its gains to yBOLD, and yBOLD's Accountant 0x53acEBB9470Cfc9D231075154f5dcF1586A4c6fa takes 100 percent of every reported gain as a fee, minted as new yBOLD shares that it holds until ysyBOLD's own report claims them. ysyBOLD keeps 10 percent of each report's profit as a fee to Yearn's Accountant 0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69 and unlocks the rest to its holders over 3 days. The yBOLD Accountant only takes a fee once yBOLD is back at a price of 1.0, so after a loss, gains first restore yBOLD's price.

- **Collateral auctions:** each strategy sells its liquidation collateral back into BOLD through its own Dutch auction contract. An auction starts only during a keeper or management tend. Its floor is set at each start to 95 percent of Liquity's collateral price (minAuctionPriceBps 9500), and the opening price is the lot's value times 115 percent, multiplied by 200 when Liquity's oracle is down or off its primary source. Prices step down 0.5 percent a minute, and below the floor nothing sells, which is about 38 minutes after the start when the oracle is up. Claiming collateral from the pool and buying from a running auction are open to anyone.

- **Strategy accounting:** a strategy's assets, and the amount it can pay out, are the BOLD it holds plus its Stability Pool deposit. Collateral waiting to be sold is not counted until it has been auctioned back into BOLD. A health check on every strategy report rejects any loss (loss limit 0) until management allows one, so reports usually wait after a liquidation until its collateral has sold.

- **Deposits and exits:** anyone can deposit yBOLD into ysyBOLD, and each strategy accepts deposits only from allowlisted addresses, which in practice means yBOLD. yBOLD's deposit limit module 0x746C238E34a6dBFE1d35d50471467Bd7Bf898f62 has no admin and closes new yBOLD deposits whenever yBOLD's price per share is below 1.0. ysyBOLD redeems into yBOLD from the yBOLD it holds. yBOLD redeems into BOLD by withdrawing from the strategies' pool deposits, in an order the redeemer may choose or else its default queue (WETH, wstETH, rETH). A redemption larger than the amount the strategies can pay out reverts rather than paying part, so a large exit is sized to maxRedeem.

- **Governance topology:** Yearn's standard set-up. A 3/8 Safe is management of ysyBOLD and the three strategies, fee manager of yBOLD's Accountant and governance of the DebtAllocator. A 4/7 Safe is the strategies' emergency admin. A 6/9 Safe holds most yBOLD roles directly and is the only proposer on the 7 day TimelockController 0x88Ba032be87d5EF1fbE87336B7090767F367BF73, the only key that can add strategies to yBOLD or set its accountant; the timelock also governs the RoleManager 0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41. Keeper bots run reports, tends and the allocation targets. The diagram groups every key by its delay.

- **Scope boundary:** this study covers the Yearn layers and the custom strategies. The Liquity V2 contracts beneath the Stability Pools are the subject of a separate completed report (profiles/BOLD.yaml) and are not re-scanned here.


**Referenced material**

- **[DOCUMENTATION]** [Yearn's own product page for the yBOLD / ysyBOLD stack](https://docs.yearn.fi/getting-started/products/yvaults/yBold)
- **[DOCUMENTATION]** [yBOLD vault page (the tier below the asset under review)](https://yearn.fi/vaults/1/0x9F4330700a36B29952869fac9b33f45EEdd8A3d8)

</details>

<a id="sec-off-chain-deps"></a>
<details>
<summary><strong>🌐 Off-Chain Dependencies</strong> — risk that extends beyond the chain</summary>

> *1 control surface extends beyond on-chain observability. Each entry shows what the analyst CAN observe (on-chain signal) alongside the off-chain dependency it relies on.*

- **1. redemption** 🟡 — After liquidations, turning the strategies' collateral back into BOLD that holders can withdraw depends on Yearn's keeper bots, because only a keeper or management can start a collateral auction.
    - *On-chain signal:* Each strategy's tendTrigger() and isCollateralGainToClaim(); collateral held by the strategy and by its auction (AUCTION.available and AUCTION.isActive); the Stability Pool's getDepositorCollGain(strategy).
    - *Off-chain dependency:* Yearn's yHaaS keeper bots, acting through the yHaaSRelayer 0x604e586F17cE106B64185A7a0d2c1Da5bAce711E. The 3/8 management Safe can also run a tend.
    - *Recovery path:* If keepers stop, collateral stays unsold and outside the amount the strategies can pay out, while BOLD still in the pools stays withdrawable. Anyone can claim collateral into a strategy and anyone can buy from a running auction, but only a keeper or management can start one.

</details>

<a id="sec-market-ceilings"></a>
<details>
<summary><strong>📊 yBOLD Strategies</strong> <span class="section-sub">where yBOLD's BOLD sits, how much of each Stability Pool it is, and what is waiting to be sold after liquidations</span></summary>

> *3 market(s). No per-market ceiling exists: this asset is UNCAPPED by design, so there is no mint cap to report and none to monitor. Enumerated live each scan, so a newly-registered market appears automatically. Tracked in Changes-Since: **Max debt**, **Auction floor (bps)**, **Loss limit (bps)**, **Keeper gas cap (gwei)**, **Branch shutdown**. Live snapshot only, deliberately NOT diffed because it moves every block: Withdrawable BOLD, Share of yBOLD, Stability Pool, % of Stability Pool, Branch debt, Share of Liquity debt, Collateral to claim, Collateral in auction.*

| # | Market | Name | Withdrawable BOLD | Share of yBOLD | Stability Pool | % of Stability Pool | Branch debt | Share of Liquity debt | Collateral to claim | Collateral in auction | Max debt | Auction floor (bps) | Loss limit (bps) | Keeper gas cap (gwei) | Branch shutdown |
|---:|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 0 | [`0xc5e7...5b75`](https://etherscan.io/address/0xc5e7D3F76a03006540f17668A0267C668FFb5b75) | Liquity V2 WETH Stability Pool | 3.7M | 58.8% | 7.7M | 47.4% | 11.3M | 32.9% | none | none | 10.00B | 9,500 | 0 | 200 | live |
| 1 | [`0x3589...49a5`](https://etherscan.io/address/0x3589b93CaDb464b6E1974Cc9fc0c9be698Ee49a5) | Liquity V2 wstETH Stability Pool | 394,429 | 6.3% | 6.1M | 6.5% | 19.0M | 55.0% | none | none | 10.00B | 9,500 | 0 | 200 | live |
| 2 | [`0x6ED5...9005`](https://etherscan.io/address/0x6ED566B76838A08d04cBd6323231B08a2eC69005) | Liquity V2 rETH Stability Pool | 2.2M | 34.9% | 4.7M | 46.6% | 4.2M | 12.1% | none | none | 10.00B | 9,500 | 0 | 200 | live |

<strong>Reading this table</strong>

- **Withdrawable BOLD**: BOLD this strategy can pay out now: its idle BOLD plus its Stability Pool deposit after liquidation losses. Collateral from liquidations counts only once it has been auctioned back into BOLD, and pool yield only once it is claimed. yBOLD can draw up to the debt it has on record, which trails this figure by gains not yet reported.
- **Share of yBOLD**: This strategy's part of the three. Read it beside Share of Liquity debt.
- **Stability Pool**: All BOLD deposited in this branch's Stability Pool, the branch's first loss buffer.
- **% of Stability Pool**: How much of the pool is yBOLD. A large yBOLD exit withdraws this much of the branch's loss buffer.
- **Branch debt**: BOLD borrowed on this Liquity branch.
- **Share of Liquity debt**: This branch's part of all Liquity debt. Compare it with Share of yBOLD; the two need not move together.
- **Collateral to claim**: Liquidation collateral this strategy has earned in the Stability Pool and not yet claimed, in units of the branch's collateral token.
- **Collateral in auction**: Collateral sitting in the strategy's auction, waiting to be bought back into BOLD, in units of the branch's collateral token.
- **Max debt**: The most BOLD yBOLD may place in this strategy, set by its max debt manager. 10 billion is no practical cap. Tracked scan to scan.
- **Auction floor (bps)**: The lowest auction price as a share of Liquity's collateral price; 9500 is 95 percent. Tracked scan to scan.
- **Loss limit (bps)**: The largest loss a strategy report may show without management's approval; 0 means every loss waits. Tracked scan to scan.
- **Keeper gas cap (gwei)**: Above this base fee, keepers do not start auctions automatically. Tracked scan to scan.
- **Branch shutdown**: 0 while the Liquity branch is live. A shut branch stops earning, but its Stability Pool deposits stay withdrawable. Tracked scan to scan.

</details>

<a id="sec-oracle-surface"></a>
<details>
<summary><strong>🔮 Exit and Pricing Tripwires</strong> <span class="section-sub">live settings that decide whether a liquidator can turn ysyBOLD into BOLD, and the inputs to FiRM's BOLD price</span></summary>

> *Live-read each scan; a repointed feed or retuned delay is flagged in Changes-Since. Every row except the Curve price is tracked, so any change shows in Changes Since Last Scan. Rows 1 to 6 are yBOLD settings that can block or reroute the exit or its yield, and each should stay as shown. Row 7, yBOLD's share price, is the check on FiRM's 1:1 assumption: it falls below 1.0 only when a loss is booked. Rows 8 and 10 are the inputs to FiRM's BOLD price: row 8 is the time constant of the pool's price average (a 10 minute half-life) and row 10 is that average. Row 9 is the time constant of the pool's slower liquidity average (a 12 hour half-life), which values the pool's LP token rather than BOLD; it is set in the same call as row 8. Row 11 would show a proposal to change the 6/9 Safe's signers or modules during its 3 day wait. Rows 12 to 14 are the split Yearn's keeper bot sets across the three Liquity branches; it changes every few days (a median of 5), and each change shows once in Changes Since Last Scan.*

| Piece | Resolves to | Authority | Delay |
|---|---|---|---|
| 1. yBOLD withdraw limit module (0x0 = none) | [`0x0000...0000`](https://etherscan.io/address/0x0000000000000000000000000000000000000000) | WITHDRAW_LIMIT_MANAGER: Yearn 6/9 Safe | immediate |
| 2. yBOLD forces its default queue on redeemers (0 = no) | `0` | QUEUE_MANAGER: Yearn 3/8 Safe or 6/9 Safe | immediate |
| 3. yBOLD role-manager handover pending (0x0 = none) | [`0x0000...0000`](https://etherscan.io/address/0x0000000000000000000000000000000000000000) | RoleManager Brain (Yearn 3/8 Safe) starts it; chad (Yearn 6/9 Safe) accepts | immediate |
| 4. yBOLD role manager | [`0xb3bd...9a41`](https://etherscan.io/address/0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41) | changes only through the two-step handover in row 3 | immediate |
| 5. yBOLD accountant | [`0x53ac...c6fa`](https://etherscan.io/address/0x53acEBB9470Cfc9D231075154f5dcF1586A4c6fa) | ACCOUNTANT_MANAGER: 7 day TimelockController, or the role-manager handover | 7 days |
| 6. yBOLD accountant fee recipient (ysyBOLD) | [`0x2334...91cD`](https://etherscan.io/address/0x23346B04a7f55b8760E5860AA5A77383D63491cD) | feeManager: Yearn 3/8 Safe | immediate |
| 7. yBOLD share price (below 1.0 means a booked loss) | `1.000000` | no setter; moves only when a report books a loss or refills one | on report |
| 8. Curve BOLD/USDC EMA time (a 10 minute half-life) | `14m 26s` | Curve factory admin, the Curve DAO Ownership Agent, through set_ma_exp_time | Curve DAO vote |
| 9. Curve BOLD/USDC D oracle time | `17h 18m 44s` | Curve DAO Ownership Agent, set together with row 8 | Curve DAO vote |
| 10. Curve EMA price of USDC in BOLD (BOLD in USD is the inverse; live, not tracked) | `1.001703` | market; rows 8 and 9 set how fast it follows the pool | live |
| 11. Yearn 6/9 Safe SnapShotExecutor pending proposals (0 = none) | `0` | its oracle proposes; the 6/9 Safe executes 3 days later | 3 days |
| 12. yBOLD allocation target, WETH strategy | `56.46%` | DebtAllocator manager: the DebtOptimizerApplicator, run by Yearn's keeper bot EOA; the 3/8 Safe can remove it | immediate |
| 13. yBOLD allocation target, wstETH strategy | `6.68%` | DebtAllocator manager: the DebtOptimizerApplicator, run by Yearn's keeper bot EOA; the 3/8 Safe can remove it | immediate |
| 14. yBOLD allocation target, rETH strategy | `36.86%` | DebtAllocator manager: the DebtOptimizerApplicator, run by Yearn's keeper bot EOA; the 3/8 Safe can remove it | immediate |

</details>

<a id="sec-critical-params"></a>
<details>
<summary><strong>🎚️ Critical Parameter Levers</strong> — the one-tx risk levers to watch</summary>

> *11 on-chain parameter levers that are curated as high-impact for lender-side risk (direct dilution / safety-mechanism closure / authority transfer / oracle repointing). Each entry shows current value, the threshold that triggers the impact, and the role-holder controlling the lever.*

- **1. `setMinAuctionPriceBps(uint256)`** 🟠 on **LiquityV2SPStrategy (WETH, wstETH and rETH strategies)**
    - *Role gate:* management() on each strategy: Yearn 3/8 Safe, no delay
    - *Profile-declared value (verified at block 25,970,490):* `9500 on all three: the auction floor is 95 percent of Liquity's collateral price`
    - *Threshold:* Any value from 0 to 9999. Near 9999 nothing sells below the oracle price; 0 removes the floor.
    - *Impact:* This sets the lowest price at which liquidation collateral can be sold back into BOLD. Set too high, collateral stays unsold after a liquidation, and that part of the pool deposit cannot be withdrawn as BOLD until the price recovers or the setting is lowered. Set too low, collateral can be sold cheaply and the shortfall lands on every holder. One multisig can move it in a single transaction.
- **2. `setMaxAuctionAmount(uint256) / setDustThreshold(uint256) / setBufferPercentage(uint256) / setMaxGasPriceToTend(uint256)`** 🟡 on **LiquityV2SPStrategy (WETH, wstETH and rETH strategies)**
    - *Role gate:* management() on each strategy: Yearn 3/8 Safe, no delay
    - *Profile-declared value (verified at block 25,970,490):* `auction size unlimited, dust threshold 1e15, buffer 115 percent, keeper gas cap 200 gwei`
    - *Threshold:* Auction size must be above 0 with no ceiling. Dust threshold and buffer have floors but no ceilings. The keeper gas cap must be at least 50 gwei.
    - *Impact:* These set how quickly collateral is turned back into BOLD. A tiny auction size or a huge dust threshold slows or skips sales. An extreme buffer makes the opening price calculation overflow, so no auction can start. A low gas cap stops automated keepers from starting auctions whenever gas is expensive. None of them touches BOLD already in the pools, only the collateral left behind by liquidations.
- **3. `setLossLimitRatio(uint256) / setDoHealthCheck(bool) / setProfitLimitRatio(uint256)`** 🟡 on **LiquityV2SPStrategy (all three) and LV2SPStakerStrategy (ysyBOLD)**
    - *Role gate:* management(): Yearn 3/8 Safe, no delay
    - *Profile-declared value (verified at block 25,970,490):* `loss limit 0, health check on, profit limit 10000`
    - *Threshold:* With the loss limit at 0, any report showing a loss reverts until management raises the limit or skips one check.
    - *Impact:* A Stability Pool loss only reaches the share price once management lets a loss report through. Until then the price stays at its last value, so holders who exit first receive full value and the shortfall falls on those who remain. The check also holds reports for a short while after every ordinary liquidation, until the auction sells the collateral, so lifting it to book a real loss would book those temporary dips too.
- **4. `setFeeRecipient(address) / removeVault(address)`** 🟡 on [**yBOLD Accountant (0x53acEBB9470Cfc9D231075154f5dcF1586A4c6fa)**](#c-0x53acebb9470cfc9d231075154f5dcf1586a4c6fa)
    - *Role gate:* feeManager(): Yearn 3/8 Safe, one transaction, no delay. The role itself moves in two steps, also with no delay.
    - *Live current value (as of block 22,569,925):* `0x23346B04a7f55b8760E5860AA5A77383D63491cD`
    - *Recorded changes:* 1 historical event(s); last setter `0x285E3b1E82f74A99D07D2aD25e159E75382bB43B`
    - *Profile-declared value (verified at block 25,970,490):* `the fee recipient is ysyBOLD`
    - *Threshold:* Any non-zero recipient; removal of yBOLD, or a vault config that rejects yBOLD's reports, at any time.
    - *Impact:* All of yBOLD's gains are paid as fees to this contract's recipient, which today is ysyBOLD, and that is the only source of ysyBOLD's yield. Changing the recipient redirects future yield and the fees not yet collected, and makes ysyBOLD's own report fail until it is set back. Removing yBOLD, or a config that rejects its reports, stops yield and loss accounting. None of these touches the yBOLD that ysyBOLD already holds, and exits keep working.
- **5. `set_accountant(address)`** 🔴 on [**yBOLD (0x9F4330700a36B29952869fac9b33f45EEdd8A3d8)**](#c-0x9f4330700a36b29952869fac9b33f45eedd8a3d8)
    - *Role gate:* ACCOUNTANT_MANAGER, held only by the 7 day TimelockController. The two Yearn Safes can skip that delay through the role-manager handover below.
    - *Live current value (as of block 22,569,855):* `0x53acEBB9470Cfc9D231075154f5dcF1586A4c6fa`
    - *Recorded changes:* 1 historical event(s); last setter `0x285E3b1E82f74A99D07D2aD25e159E75382bB43B`
    - *Profile-declared value (verified at block 25,970,490):* `0x53acEBB9470Cfc9D231075154f5dcF1586A4c6fa, the bespoke Accountant, set once at deployment`
    - *Threshold:* Any address.
    - *Impact:* The vault does not cap the fees an accountant charges, so a replaced accountant can charge more than the gain and dilute every yBOLD holder, ysyBOLD included. Even a harmless replacement stops ysyBOLD's yield, because ysyBOLD claims from the accountant fixed when it was deployed. Standard on every Yearn V3 vault.
- **6. `set_withdraw_limit_module(address)`** 🔴 on [**yBOLD (0x9F4330700a36B29952869fac9b33f45EEdd8A3d8)**](#c-0x9f4330700a36b29952869fac9b33f45eedd8a3d8)
    - *Role gate:* WITHDRAW_LIMIT_MANAGER: Yearn 6/9 Safe, no delay. Standard on every Yearn V3 vault.
    - *Live current value:* `0x0000000000000000000000000000000000000000`
    - *Profile-declared value (verified at block 25,970,490):* `no module set`
    - *Threshold:* Any module. It is told who owns the shares, so it can cap or refuse exits for particular holders.
    - *Impact:* A module that refuses or caps exits stops yBOLD being redeemed for BOLD, the second step of a FiRM liquidator's exit, and it can single out particular holders. It does not affect redeeming ysyBOLD into yBOLD, because ysyBOLD pays out yBOLD it already holds. yBOLD's queue manager can also stop redemptions, by forcing an empty withdrawal queue. Standard on every Yearn V3 vault; FiRM's current Yearn collateral is all V2, which has no such module.
- **7. `set_default_queue(address[]) / set_use_default_queue(bool)`** 🔴 on [**yBOLD (0x9F4330700a36B29952869fac9b33f45EEdd8A3d8)**](#c-0x9f4330700a36b29952869fac9b33f45eedd8a3d8)
    - *Role gate:* QUEUE_MANAGER: Yearn 3/8 Safe and Yearn 6/9 Safe, each alone, no delay. Standard on every Yearn V3 vault.
    - *Live current value:* `False`
    - *Profile-declared value (verified at block 25,970,490):* `the default queue holds the three strategies, and redeemers may name their own order`
    - *Threshold:* Any list of active strategies, including an empty one; the default queue can be forced on every redeemer.
    - *Impact:* With an empty default queue forced on every redeemer, yBOLD can only pay out the BOLD it holds idle, which is none today, so every yBOLD redemption fails and a FiRM liquidator cannot turn yBOLD into BOLD. It does not touch redeeming ysyBOLD into yBOLD. Either Safe can reverse it in one transaction.
- **8. `force_revoke_strategy(address)`** 🔴 on [**yBOLD (0x9F4330700a36B29952869fac9b33f45EEdd8A3d8)**](#c-0x9f4330700a36b29952869fac9b33f45eedd8a3d8)
    - *Role gate:* FORCE_REVOKE_MANAGER: Yearn 6/9 Safe with no delay, and the 7 day TimelockController. Standard on every Yearn V3 vault.
    - *Profile-declared value (verified at block 25,970,490):* `no strategy revoked; all three active`
    - *Threshold:* Any active strategy.
    - *Impact:* Writes the whole of that strategy's debt off as a loss at once, so yBOLD's share price falls by that strategy's share of assets, about 59 percent for the WETH strategy today. The BOLD stays in the strategy, but getting it back means re-adding the strategy, which only the 7 day timelock can do, or the role-manager handover below.
- **9. `removeVault(address) then accept_role_manager()`** 🔴 on [**Yearn RoleManager (0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41), acting on yBOLD**](#c-0xb3bd6b2e61753c311efbcf0111f75d29706d9a41)
    - *Role gate:* The RoleManager's Brain position (Yearn 3/8 Safe) starts it; its chad address (Yearn 6/9 Safe) accepts. No delay at either step. Standard in Yearn's RoleManager.
    - *Profile-declared value (verified at block 25,970,490):* `yBOLD's role manager is the RoleManager; no handover pending`
    - *Threshold:* Two transactions, one from each Safe.
    - *Impact:* Whoever holds yBOLD's role-manager seat can grant every yBOLD role at once, including the accountant and strategy roles that the 7 day timelock otherwise guards. This handover lets the two Yearn Safes skip that delay, which reaches every other lever on yBOLD listed here.
- **10. `setPerformanceFee(uint16)`** 🟢 on [**ysyBOLD, the LV2SPStakerStrategy (0x23346B04a7f55b8760E5860AA5A77383D63491cD)**](#c-0x23346b04a7f55b8760e5860aa5a77383d63491cd)
    - *Role gate:* management(): Yearn 3/8 Safe, no delay
    - *Live current value:* `1000`
    - *Profile-declared value (verified at block 25,970,490):* `1000: 10 percent of each report's profit`
    - *Threshold:* Capped at 5000, or 50 percent of profit, by MAX_FEE.
    - *Impact:* Takes a share of each report's profit as new ysyBOLD shares for the fee recipient. It never lowers the share price below its previous level, only how much it grows. There is no high water mark, so profit that only recovers an earlier loss is also charged.
- **11. `setStrategyDebtRatio(address,address,uint256)`** 🟡 on [**DebtAllocator (0x1e9eB053228B1156831759401dE0E115356b8671)**](#c-0x1e9eb053228b1156831759401de0e115356b8671)
    - *Role gate:* A DebtAllocator manager, no delay: Yearn's DebtOptimizerApplicator 0x6b1fc0c4370ee907220c3af561940d3e21081f9b, whose only manager is Yearn's keeper bot EOA 0x283132390ea87d6ecc20255b59ba94329ee17961. The 3/8 Safe, the DebtAllocator's governance, can remove either at once.
    - *Profile-declared value (verified at block 25,970,490):* `reset by the keeper bot at a median gap of 5 days, with pauses of up to 29; the live targets are rows 12 to 14 of Exit and Pricing Tripwires`
    - *Threshold:* Any split of yBOLD across its three strategies, up to 100 percent in one. No rule reads branch debt or health.
    - *Impact:* This decides which Liquity branch's losses and shutdown risk ysyBOLD carries. The targets follow Stability Pool yield and have ranged from 0 to 87 percent in wstETH, the branch carrying most of Liquity's debt. The key cannot move BOLD outside the three pools or take it, and each debt move through the allocator may lose at most 0.01 percent.

</details>

## 📑 Table of Contents

1. [Analyst Focus Areas](#analyst-focus-areas)
2. Contracts
   - [ysyBOLD ★](#c-0x23346b04a7f55b8760e5860aa5a77383d63491cd)
   - [Accountant (0x53ac...c6fa)](#c-0x53acebb9470cfc9d231075154f5dcf1586a4c6fa)
   - [yHaaSRelayer](#c-0x604e586f17ce106b64185a7a0d2c1da5bace711e)
   - [Accountant (0x5A74...DE69)](#c-0x5a74cb32d36f2f517db6f7b0a0591e09b22cde69)
   - [Yearn V3 Vault](#c-0x9f4330700a36b29952869fac9b33f45eedd8a3d8)
   - [RoleManager](#c-0xb3bd6b2e61753c311efbcf0111f75d29706d9a41)
   - [TimelockController](#c-0x88ba032be87d5ef1fbe87336b7090767f367bf73)
   - [DebtAllocator](#c-0x1e9eb053228b1156831759401de0e115356b8671)
   - [LiquityV2SPStrategy (0xc5e7...5b75)](#c-0xc5e7d3f76a03006540f17668a0267c668ffb5b75)
   - [LiquityV2SPStrategy (0x3589...49a5)](#c-0x3589b93cadb464b6e1974cc9fc0c9be698ee49a5)
   - [LiquityV2SPStrategy (0x6ED5...9005)](#c-0x6ed566b76838a08d04cbd6323231b08a2ec69005)
   - [TimelockExecutor](#c-0xf8f60bf9456a6e0141149db2dd6f02c60da5779b)
3. [⚡ Authority Concentration](#-authority-concentration)
4. [⛔ Sanctions Screening](#-sanctions-screening)
5. [EOA Exposure Summary](#eoa-exposure-summary)
6. [✅ Scan Integrity](#scan-integrity)

## Analyst Focus Areas &nbsp;&nbsp;☑ Profile reviewed

> **Observational findings — not risk determinations.** Each item below is a focus point for the Risk Analyst to interpret against collateralization context and the protocol's stated intent. Attention levels (CRITICAL / HIGH / LOW) reflect the scanner's heuristic weight — not a realized risk to FiRM. These observations support future risk assessments; they do not constitute one.

> **1 critical-attention** and **27 high-attention** observation(s) across 15 contract(s).

<details>
<summary><strong>View findings (collapsed — profile reviewed)</strong></summary>


### 🔴 CRITICAL (1)

- 🎚️ [**Observed: 11 critical parameter levers (CRITICAL: 5, HIGH: 1, MEDIUM: 4, LOW: 1)**](#sec-critical-params) — Asset has 11 on-chain parameter levers curated as high-impact for lender-side risk. See the 🎚️ Critical Parameter Levers section for the role gate, current value, threshold, and impact of each. These are singular setters / function calls that flip risk surface in one tx — direct dilution, safety-mechanism closure, authority transfer, or oracle repointing. Verify role-gate identities and threshold distance-to-trigger against current operating posture.

### 🟠 HIGH (27)

- 🟠 [**Observed: EOA holds `executor()` on TimelockExecutor**](#c-0xf8f60bf9456a6e0141149db2dd6f02c60da5779b) — `0x1b5f15DCb82d25f91c65b53CEe151E8b9fBdD271` (EOA) — single key controls privileged functions. Assess custody and intent.

<details>
<summary>💰 **Observed: 7 role(s) with supply-altering capability** — Supply-altering surface — assess each holder's custody and governance. Expand for all roles (each links to its contract card).</summary>

- 💰 [**`feeManager()` on Accountant**](#c-0x5a74cb32d36f2f517db6f7b0a0591e09b22cde69) — 0x5A74...DE69 — held by 0x1638...0ff7 — open the role card for holder identities & admin chain.
- 💰 [**`management()` on LV2SPStakerStrategy**](#c-0x23346b04a7f55b8760e5860aa5a77383d63491cd) — 0x2334...91cD — held by 0x1638...0ff7 — open the role card for holder identities & admin chain.
- 💰 [**`management()` on LiquityV2SPStrategy**](#c-0x3589b93cadb464b6e1974cc9fc0c9be698ee49a5) — 0x3589...49a5 — held by 0x1638...0ff7 — open the role card for holder identities & admin chain.
- 💰 [**`management()` on LiquityV2SPStrategy**](#c-0x6ed566b76838a08d04cbd6323231b08a2ec69005) — 0x6ED5...9005 — held by 0x1638...0ff7 — open the role card for holder identities & admin chain.
- 💰 [**`management()` on LiquityV2SPStrategy**](#c-0xc5e7d3f76a03006540f17668a0267c668ffb5b75) — 0xc5e7...5b75 — held by 0x1638...0ff7 — open the role card for holder identities & admin chain.
- 💰 [**`PROFIT_UNLOCK_MANAGER` on Yearn V3 Vault**](#c-0x9f4330700a36b29952869fac9b33f45eedd8a3d8) — 0x9F43...A3d8 — 2 holders — open the role card for holder identities & admin chain.
- 💰 [**`REPORTING_MANAGER` on Yearn V3 Vault**](#c-0x9f4330700a36b29952869fac9b33f45eedd8a3d8) — 0x9F43...A3d8 — 4 holders — open the role card for holder identities & admin chain.

</details>


<details>
<summary>⏸️ **Observed: 2 role(s) with pause capability** — Pause surface — assess pause-authority governance. Expand for all roles (each links to its contract card).</summary>

- ⏸️ [**`governance()` on DebtAllocator**](#c-0x1e9eb053228b1156831759401de0e115356b8671) — 0x1e9e...8671 — held by 0x1638...0ff7 — open the role card for holder identities & admin chain.
- ⏸️ [**`EMERGENCY_MANAGER` on Yearn V3 Vault**](#c-0x9f4330700a36b29952869fac9b33f45eedd8a3d8) — 0x9F43...A3d8 — 3 holders — open the role card for holder identities & admin chain.

</details>

- 🔗 [**Observed: supply authority chain on GnosisSafe**](#c-0x23346b04a7f55b8760e5860aa5a77383d63491cd) — Chain: LV2SPStakerStrategy → `management()` → GnosisSafe. Controlled by: `Safe Owners (3/8 required)`. Assess custody — compromise of this chain could affect root token supply.
- 🔗 [**Observed: supply authority chain on DebtAllocator**](#c-0x1e9eb053228b1156831759401de0e115356b8671) — Chain: Yearn V3 Vault → `REPORTING_MANAGER` → DebtAllocator. Controlled by: `governance()`. Assess custody — compromise of this chain could affect root token supply.

<details>
<summary>🔓 **5 No-Timelock-in-admin-chain supply finding(s) across 4 contract(s)** — Supply-capable roles with no Timelock in the direct admin chain — a supply-altering call can land in one block once the holder's governance threshold is met. Expand to review each role + holder and verify whether it is a real supply path or a transitive getter-pointer edge. FiRM-lens: no analyst-observable buffer between decision and action.</summary>

- ⚠️ [**No Timelock in admin chain: `management()` on LV2SPStakerStrategy**](#c-0x23346b04a7f55b8760e5860aa5a77383d63491cd) — `management()` has SUPPLY capability and is held by: `0x1638...0ff7` (Safe). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `feeManager()` on Accountant**](#c-0x5a74cb32d36f2f517db6f7b0a0591e09b22cde69) — `feeManager()` has SUPPLY capability and is held by: `0x1638...0ff7` (Safe). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `REPORTING_MANAGER` on Yearn V3 Vault**](#c-0x9f4330700a36b29952869fac9b33f45eedd8a3d8) — `REPORTING_MANAGER` has SUPPLY capability and is held by: `0x1638...0ff7` (Safe), `0x1e9e...8671` (Contract), `0x604e...711E` (Contract) +1 more. No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `PROFIT_UNLOCK_MANAGER` on Yearn V3 Vault**](#c-0x9f4330700a36b29952869fac9b33f45eedd8a3d8) — `PROFIT_UNLOCK_MANAGER` has SUPPLY capability and is held by: `0x1638...0ff7` (Safe), `0xFEB4...ff52` (Safe). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `management()` on LiquityV2SPStrategy**](#c-0xc5e7d3f76a03006540f17668a0267c668ffb5b75) — `management()` has SUPPLY capability and is held by: `0x1638...0ff7` (Safe). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.

</details>


<details>
<summary>🔄 **5 volatile parameter(s) observed across 2 contract(s) (≥5 historical changes each)** — Operational tempo signal — high-velocity setters indicate active governance maintenance, oracle keepers, or routinely-tuned risk parameters. Expand to review each parameter's change count and current value; assess against the protocol's stated intent.</summary>

- 🔄 [**Observed: volatile parameter `process_report` on Yearn V3 Vault**](#c-0x9f4330700a36b29952869fac9b33f45eedd8a3d8) — `process_report(address strategy)` changed 1189 times. Current value: ``. Assess change pattern.
- 🔄 [**Observed: volatile parameter `minimumChange` on DebtAllocator**](#c-0x1e9eb053228b1156831759401de0e115356b8671) — `setMinimumChange(address _vault, uint256 _minimumChange)` changed 33 times. Current value: 33 markets · highest 50k (yvDAI-1 (Yearn V3 Vault)) · <1M ×32 — full per-key breakdown in the Permissioned Parameters table on DebtAllocator. Assess change pattern.
- 🔄 [**Observed: volatile parameter `managers` on DebtAllocator**](#c-0x1e9eb053228b1156831759401de0e115356b8671) — `setManager(address _address, bool _allowed)` changed 5 times. Current value: 5 keys · 2 true (DebtAllocatorKeeper, DebtOptimizerApplicator) — full per-key breakdown in the Permissioned Parameters table on DebtAllocator. Assess change pattern.
- 🔄 [**Observed: volatile parameter `maxAcceptableBaseFee` on DebtAllocator**](#c-0x1e9eb053228b1156831759401de0e115356b8671) — `setMaxAcceptableBaseFee(uint256 _maxAcceptableBaseFee)` changed 5 times. Current value: `2500000000`. Assess change pattern.
- 🔄 [**Observed: volatile parameter `keepers` on DebtAllocator**](#c-0x1e9eb053228b1156831759401de0e115356b8671) — `setKeeper(address _address, bool _allowed)` changed 5 times. Current value: 6 keys · 4 true — full per-key breakdown in the Permissioned Parameters table on DebtAllocator. Assess change pattern.

</details>

- 🌐 [**Observed: 1 off-chain control dependency (redemption)**](#sec-off-chain-deps) — Asset has 1 control surface(s) that extend beyond on-chain observability. See the 🌐 Off-Chain Dependencies section for each kind, the on-chain signal the analyst can monitor, the off-chain dependency it relies on, and the recovery path if the off-chain piece fails. Cross-reference against the protocol's stated trust model.

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
<a id="c-0x23346b04a7f55b8760e5860aa5a77383d63491cd"></a>
## LV2SPStakerStrategy `0x23346B04a7f55b8760E5860AA5A77383D63491cD`

*6 roles · 5 members · 11 functions*

> ✅ **Proxy — immutable** (Proxy (ERC-1967), logic address is a bytecode constant; the EIP-1967 slot is informational) — impl: `0xD377919FA87120584B21279a491F82D5265A139c`

🔒 **Immutable References:** `ACCOUNTANT()` → Accountant

### 🟢 `management()`

**Privileged write functions:**  
**Capabilities:** ⚙️ **CONFIG** 💰 **SUPPLY**
- `setPendingManagement(address _management)` — Step one of two to set a new address to be in charge of the strategy. Can only be called by the current `management`. The address is
- `setKeeper(address _keeper)` — Sets a new address to be in charge of tend and reports. Can only be called by the current `management`.
- `setEmergencyAdmin(address _emergencyAdmin)` — Sets a new address to be able to shutdown the strategy. Can only be called by the current `management`.
- `setPerformanceFee(uint16 _performanceFee)` — Sets the performance fee to be charged on reported gains. Can only be called by the current `management`. `[CONFIG]`
- `setPerformanceFeeRecipient(address _performanceFeeRecipient)` — Sets a new address to receive performance fees. Can only be called by the current `management`. `[CONFIG]`
- `setProfitMaxUnlockTime(uint256 _profitMaxUnlockTime)` — Sets the time for profits to be unlocked over. Can only be called by the current `management`. `[SUPPLY]`
- `setName(string calldata _name)` — Updates the name for the strategy. /
- `setProfitLimitRatio(uint256 _newProfitLimitRatio)` — Set the `profitLimitRatio`. Denominated in basis points. I.E. 1_000 == 10%.
- `setLossLimitRatio(uint256 _newLossLimitRatio)` — Set the `lossLimitRatio`. Denominated in basis points. I.E. 1_000 == 10%.
- `setDoHealthCheck(bool _doHealthCheck)` — Turns the healthcheck on and off. If turned off the next report will auto turn it back on.

**Members (1):**

| Address | Name / Type | Risk | Granted | Source | Details |
|---|---|---|---|---|---|
| `0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7` | [↳ Gnosis Safe 3/8](#c-0x16388463d60ffe0661cf7f1f31a7d658ac790ff7) | 🟢 LOW | — | Storage only | 3/8 signers |

**Signers of `Gnosis Safe 3/8` (0x1638...0ff7):**

| Signer | Type | Owner Since | Notes |
|---|---|---|---|
| `0x5E5D6f849Fa86c058f148E9D3f643C8F4c43f20b` | EOA | 2026-05-21 | EOA |
| `0x5250077c42627cBd112988f32D482acC9ff40bDB` | EOA | 2026-05-21 | EOA |
| `0xC357eE8a8DdE88Dd5a3Ea54847Adef6846A28c51` | EOA | 2026-05-21 | EOA |
| `0xFcc3796370e1538F8cC60bec19A8be5457f2C74F` | EOA | 2026-05-21 | EOA |
| `0xFafFb75e14faFf9f11315E44a2E54A22872c7a34` | EOA | 2026-05-21 | EOA |
| `0x80a3887BA60F76acAb48EE4aEAd0a71A0774A8B2` | EOA | 2025-11-25 | EOA |
| `0xB13C8f58a233607569D2F8411B912148aeC4aEe2` | EOA | 2025-01-20 | EOA |
| `0x0Dca0FDC170baA4CA9c1dCd37Ffe01f97bCfD504` | EOA | 2025-11-25 | EOA |

**Quorum history:**
  - 2021-04-14: 🔴 decreased 3 → 1
  - 2021-04-15: 🟢 increased 1 → 2
  - 2021-07-14: 🟢 increased 2 → 3
  - 2021-09-17: 🔴 decreased 3 → 2
  - 2021-09-17: 🟢 increased 2 → 3

### 🟠 `yBOLD (Yearn V3 Vault) - the vault ysyBOLD wraps`

**Hash:** `bfs_seed:yBOLD (Yearn V3 Vault) - the vault ysyBOLD wraps`  
**Privileged write functions:**  
**Capabilities:** ⚙️ **CONFIG**
- `asset()` — ysyBOLD's underlying asset: the Yearn V3 vault that holds every BOLD in the stack. Listed here so the scan covers it, since ysyBOLD reaches it only through asset().
 `[CONFIG]`

**Members (1):**

| Address | Name / Type | Risk | Granted | Source | Details |
|---|---|---|---|---|---|
| `0x9F4330700a36B29952869fac9b33f45EEdd8A3d8` | [↳ yBOLD (Yearn V3 Vault)](#c-0x9f4330700a36b29952869fac9b33f45eedd8a3d8) | 🟠 HIGH | — | Storage only |  |

### 🟢 `emergencyAdmin()` · 📋 operational


**Members (1):**

| Address | Name / Type | Granted | Source | Details |
|---|---|---|---|---|
| `0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7` | [↳ Gnosis Safe 3/8](#c-0x16388463d60ffe0661cf7f1f31a7d658ac790ff7) | — | Storage only | 3/8 signers |

**Signers of `Gnosis Safe 3/8` (0x1638...0ff7):**

| Signer | Type | Owner Since | Notes |
|---|---|---|---|
| `0x5E5D6f849Fa86c058f148E9D3f643C8F4c43f20b` | EOA | 2026-05-21 | EOA |
| `0x5250077c42627cBd112988f32D482acC9ff40bDB` | EOA | 2026-05-21 | EOA |
| `0xC357eE8a8DdE88Dd5a3Ea54847Adef6846A28c51` | EOA | 2026-05-21 | EOA |
| `0xFcc3796370e1538F8cC60bec19A8be5457f2C74F` | EOA | 2026-05-21 | EOA |
| `0xFafFb75e14faFf9f11315E44a2E54A22872c7a34` | EOA | 2026-05-21 | EOA |
| `0x80a3887BA60F76acAb48EE4aEAd0a71A0774A8B2` | EOA | 2025-11-25 | EOA |
| `0xB13C8f58a233607569D2F8411B912148aeC4aEe2` | EOA | 2025-01-20 | EOA |
| `0x0Dca0FDC170baA4CA9c1dCd37Ffe01f97bCfD504` | EOA | 2025-11-25 | EOA |

**Quorum history:**
  - 2021-04-14: 🔴 decreased 3 → 1
  - 2021-04-15: 🟢 increased 1 → 2
  - 2021-07-14: 🟢 increased 2 → 3
  - 2021-09-17: 🔴 decreased 3 → 2
  - 2021-09-17: 🟢 increased 2 → 3

### 🟠 `keeper()` · 📋 operational


**Members (1):**

| Address | Name / Type | Granted | Source | Details |
|---|---|---|---|---|
| `0x604e586F17cE106B64185A7a0d2c1Da5bAce711E` | [↳ yHaaSRelayer](#c-0x604e586f17ce106b64185a7a0d2c1da5bace711e) | — | Storage only |  |

### 🟠 `performanceFeeRecipient()` · 📋 operational


**Members (1):**

| Address | Name / Type | Granted | Source | Details |
|---|---|---|---|---|
| `0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69` | [↳ Accountant](#c-0x5a74cb32d36f2f517db6f7b0a0591e09b22cde69) | — | Storage only |  |

#### 🔧 Permissioned Parameters

**`doHealthCheck`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)* 🔴 **SILENT** *(no event)*

> 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> This parameter has never been changed since deployment.

| Field | Value |
|---|---|
| Current Value | `True` |
| Setter | `setDoHealthCheck(bool _doHealthCheck)` |
| Gated by | `management()` |
| Tags | — |
| Last changed | — |
| Changed by | — |
| Total changes | 0 ❄️ |

**`emergencyAdmin`**

| Field | Value |
|---|---|
| Current Value | `0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7` |
| Setter | `setEmergencyAdmin(address _emergencyAdmin)` |
| Gated by | `management()` |
| Tags | — |
| Last changed | 2025-05-26 |
| Changed by | `0x1638...0ff7` (Gnosis Safe 3/8) |
| Total changes | 1 |

**Recent changes:**

| # | Value | Set By | Date |
|---|---|---|---|
| 1 | `0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7` | `0x1638...0ff7` (Gnosis Safe 3/8) | 2025-05-26 |

**`keeper`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)* 🔴 **SILENT** *(no event)*

> 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> This parameter has never been changed since deployment.

| Field | Value |
|---|---|
| Current Value | `0x604e586F17cE106B64185A7a0d2c1Da5bAce711E` |
| Setter | `setKeeper(address _keeper)` |
| Gated by | `management()` |
| Tags | — |
| Last changed | — |
| Changed by | — |
| Total changes | 0 ❄️ |

**`lossLimitRatio`** ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> This parameter has never been changed since deployment.

| Field | Value |
|---|---|
| Current Value | `0` |
| Setter | `setLossLimitRatio(uint256 _newLossLimitRatio)` |
| Gated by | `management()` |
| Tags | — |
| Last changed | — |
| Changed by | — |
| Total changes | 0 ❄️ |

**`MAX_FEE`** 🔒 **IMMUTABLE**

> 🔒 **Immutable** — declared as a constant in the contract source; cannot be changed without a contract upgrade. Bounds the reachable extreme of any setter that writes a related storage variable.

| Field | Value |
|---|---|
| Current Value | `5000` |
| Mutability | 🔒 immutable (constant) |
| Tags | `IMMUTABLE` |

**`pendingManagement`**

| Field | Value |
|---|---|
| Current Value | `0x0000000000000000000000000000000000000000` |
| Setter | `setPendingManagement(address _management)` |
| Gated by | `management()` |
| Tags | — |
| Last changed | 2025-05-27 |
| Changed by | `0x1638...0ff7` (Gnosis Safe 3/8) |
| Total changes | 2 |

**Recent changes:**

| # | Value | Set By | Date |
|---|---|---|---|
| 1 | `0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7` | `0x1638...0ff7` (Gnosis Safe 3/8) | 2025-05-27 |
| 2 | `0x285E3b1E82f74A99D07D2aD25e159E75382bB43B` | `0x285E...B43B` | 2025-05-26 |

**`performanceFee`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)*

> This parameter has never been changed since deployment.

| Field | Value |
|---|---|
| Current Value | `1000` |
| Setter | `setPerformanceFee(uint16 _performanceFee)` |
| Gated by | `management()` |
| Tags | `CONFIG` |
| Last changed | — |
| Changed by | — |
| Total changes | 0 ❄️ |

**`performanceFeeRecipient`**

| Field | Value |
|---|---|
| Current Value | `0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69` |
| Setter | `setPerformanceFeeRecipient(address _performanceFeeRecipient)` |
| Gated by | `management()` |
| Tags | `CONFIG` |
| Last changed | 2025-06-23 |
| Changed by | `0x5A74...DE69` (Accountant) |
| Total changes | 2 |

**Recent changes:**

| # | Value | Set By | Date |
|---|---|---|---|
| 1 | `0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69` | `0x5A74...DE69` (Accountant) | 2025-06-23 |
| 2 | `0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7` | `0x1638...0ff7` (Gnosis Safe 3/8) | 2025-05-26 |

**`profitLimitRatio`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)* 🔴 **SILENT** *(no event)*

> 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> This parameter has never been changed since deployment.

| Field | Value |
|---|---|
| Current Value | `10000` |
| Setter | `setProfitLimitRatio(uint256 _newProfitLimitRatio)` |
| Gated by | `management()` |
| Tags | — |
| Last changed | — |
| Changed by | — |
| Total changes | 0 ❄️ |

**`profitMaxUnlockTime`**

| Field | Value |
|---|---|
| Current Value | `259200` |
| Setter | `setProfitMaxUnlockTime(uint256 _profitMaxUnlockTime)` |
| Gated by | `management()` |
| Tags | `SUPPLY` |
| Last changed | 2026-02-23 |
| Changed by | `0x1b5f...D271` (EOA) |
| Total changes | 3 |

**Recent changes:**

| # | Value | Set By | Date |
|---|---|---|---|
| 1 | `259200` | `0x1b5f...D271` (EOA) | 2026-02-23 |
| 2 | `86400` | `0x1b5f...D271` (EOA) | 2025-06-05 |
| 3 | `_profitMaxUnlockTime=259200` | `0x1638...0ff7` (Gnosis Safe 3/8) | 2025-06-02 |

---
<a id="c-0x53acebb9470cfc9d231075154f5dcf1586a4c6fa"></a>
## > Accountant `0x53acEBB9470Cfc9D231075154f5dcF1586A4c6fa`

> *4 roles · 3 members · 9 functions*

> 🔒 **Immutable References:** `vault()` → yBOLD (Yearn V3 Vault)

### > 🟢 `feeManager()`

> **Privileged write functions:**  
> **Capabilities:** ⚙️ **CONFIG**
> - `updateDefaultConfig(uint16 defaultMaxGain, uint16 defaultMaxLoss)` — Function to update the default fee configuration used for all strategies that don't have a custom config set.
> - `setCustomConfig(address vault, uint16 customMaxGain, uint16 customMaxLoss)` — Function to set a custom fee configuration for a specific vault. /
> - `removeCustomConfig(address vault)` — Function to remove a previously set custom fee configuration for a vault. /
> - `turnOffHealthCheck(address vault, address strategy)` — Turn off the health check for a specific `vault` `strategy` combo. This will only last for one report and get automatically turned back on.
> - `setMaxLoss(uint256 _maxLoss)` — Sets the `maxLoss` parameter to be used on redeems. /
> - `setFutureFeeManager(address _futureFeeManager)` — Function to set a future fee manager address. /
> - `setVaultManager(address newVaultManager)` — Function to set a new vault manager. /
> - `setFeeRecipient(address newFeeRecipient)` — Function to set a new address to receive distributed rewards. / `[CONFIG]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7` | [↳ Gnosis Safe 3/8](#c-0x16388463d60ffe0661cf7f1f31a7d658ac790ff7) | 🟢 LOW | — | Storage only | 3/8 signers |

> **Signers of `Gnosis Safe 3/8` (0x1638...0ff7):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x5E5D6f849Fa86c058f148E9D3f643C8F4c43f20b` | EOA | 2026-05-21 | EOA |
> | `0x5250077c42627cBd112988f32D482acC9ff40bDB` | EOA | 2026-05-21 | EOA |
> | `0xC357eE8a8DdE88Dd5a3Ea54847Adef6846A28c51` | EOA | 2026-05-21 | EOA |
> | `0xFcc3796370e1538F8cC60bec19A8be5457f2C74F` | EOA | 2026-05-21 | EOA |
> | `0xFafFb75e14faFf9f11315E44a2E54A22872c7a34` | EOA | 2026-05-21 | EOA |
> | `0x80a3887BA60F76acAb48EE4aEAd0a71A0774A8B2` | EOA | 2025-11-25 | EOA |
> | `0xB13C8f58a233607569D2F8411B912148aeC4aEe2` | EOA | 2025-01-20 | EOA |
> | `0x0Dca0FDC170baA4CA9c1dCd37Ffe01f97bCfD504` | EOA | 2025-11-25 | EOA |

> **Quorum history:**
>   - 2021-04-14: 🔴 decreased 3 → 1
>   - 2021-04-15: 🟢 increased 1 → 2
>   - 2021-07-14: 🟢 increased 2 → 3
>   - 2021-09-17: 🔴 decreased 3 → 2
>   - 2021-09-17: 🟢 increased 2 → 3

### > 🟢 `futureFeeManager()`

> **Privileged write functions:**
> - `acceptFeeManager()` — Function to accept the role change and become the new fee manager. This function allows the future fee manager to accept the role change and become the new fee manager.

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7` | [↳ Gnosis Safe 3/8](#c-0x16388463d60ffe0661cf7f1f31a7d658ac790ff7) | 🟢 LOW | — | Events only | 3/8 signers |

> **Signers of `Gnosis Safe 3/8` (0x1638...0ff7):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x5E5D6f849Fa86c058f148E9D3f643C8F4c43f20b` | EOA | 2026-05-21 | EOA |
> | `0x5250077c42627cBd112988f32D482acC9ff40bDB` | EOA | 2026-05-21 | EOA |
> | `0xC357eE8a8DdE88Dd5a3Ea54847Adef6846A28c51` | EOA | 2026-05-21 | EOA |
> | `0xFcc3796370e1538F8cC60bec19A8be5457f2C74F` | EOA | 2026-05-21 | EOA |
> | `0xFafFb75e14faFf9f11315E44a2E54A22872c7a34` | EOA | 2026-05-21 | EOA |
> | `0x80a3887BA60F76acAb48EE4aEAd0a71A0774A8B2` | EOA | 2025-11-25 | EOA |
> | `0xB13C8f58a233607569D2F8411B912148aeC4aEe2` | EOA | 2025-01-20 | EOA |
> | `0x0Dca0FDC170baA4CA9c1dCd37Ffe01f97bCfD504` | EOA | 2025-11-25 | EOA |

> **Quorum history:**
>   - 2021-04-14: 🔴 decreased 3 → 1
>   - 2021-04-15: 🟢 increased 1 → 2
>   - 2021-07-14: 🟢 increased 2 → 3
>   - 2021-09-17: 🔴 decreased 3 → 2
>   - 2021-09-17: 🟢 increased 2 → 3

### > 🟠 `feeRecipient()` · 📋 operational


> **Members (1):**

> | Address | Name / Type | Granted | Source | Details |
> |---|---|---|---|---|
> | `0x23346B04a7f55b8760E5860AA5A77383D63491cD` | [↳ ysyBOLD (LV2SPStakerStrategy)](#c-0x23346b04a7f55b8760e5860aa5a77383d63491cd) | — | Storage only |  |

> #### 🔧 Permissioned Parameters

> **`customConfig`** *(per-asset)* ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Setter | `setCustomConfig(address vault, uint16 customMaxGain, uint16 customMaxLoss)` |
> | Gated by | `feeManager()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`defaultConfig`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)* 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `maxGain: 0 · maxLoss: 10000 · custom: False` |
> | Setter | `updateDefaultConfig(uint16 defaultMaxGain, uint16 defaultMaxLoss)` |
> | Gated by | `feeManager()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`feeRecipient`**

> | Field | Value |
> |---|---|
> | Current Value | `0x23346B04a7f55b8760E5860AA5A77383D63491cD` |
> | Setter | `setFeeRecipient(address newFeeRecipient)` |
> | Gated by | `feeManager()` |
> | Tags | `CONFIG` |
> | Last changed | 2025-05-26 |
> | Changed by | `0x285E...B43B` |
> | Total changes | 1 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `0x285E3b1E82f74A99D07D2aD25e159E75382bB43B` | `0x285E...B43B` | 2025-05-26 |

> **`futureFeeManager`**

> | Field | Value |
> |---|---|
> | Current Value | `0x0000000000000000000000000000000000000000` |
> | Setter | `setFutureFeeManager(address _futureFeeManager)` |
> | Gated by | `feeManager()` |
> | Tags | — |
> | Last changed | 2025-06-02 |
> | Changed by | `0x1638...0ff7` (Gnosis Safe 3/8) |
> | Total changes | 1 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7` | `0x1638...0ff7` (Gnosis Safe 3/8) | 2025-06-02 |

> **`maxLoss`** ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `0` |
> | Setter | `setMaxLoss(uint256 _maxLoss)` |
> | Gated by | `feeManager()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`vaultManager`** ❄️ **DORMANT**

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `0x0000000000000000000000000000000000000000` |
> | Setter | `setVaultManager(address newVaultManager)` |
> | Gated by | `feeManager()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

---
<a id="c-0x604e586f17ce106b64185a7a0d2c1da5bace711e"></a>
## > yHaaSRelayer `0x604e586F17cE106B64185A7a0d2c1Da5bAce711E`

> *2 roles · 1 member · 7 functions*

### > 🟢 `owner()`

> **Privileged write functions:**
> - `harvestStrategy(address _strategyAddress)`
>   - ⚠️ *Also callable by members of `keepers` mapping (dual-gate modifier)*
> - `tendStrategy(address _strategyAddress)`
>   - ⚠️ *Also callable by members of `keepers` mapping (dual-gate modifier)*
> - `processReport(address _vaultAddress, address _strategyAddress)`
>   - ⚠️ *Also callable by members of `keepers` mapping (dual-gate modifier)*
> - `forwardCall(address debtAllocatorAddress, bytes memory data)`
>   - ⚠️ *Also callable by members of `keepers` mapping (dual-gate modifier)*
> - `setKeeper(address _address, bool _allowed)`
> - `setOwner(address _owner)` — Changes the `owner` address. /

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7` | [↳ Gnosis Safe 3/8](#c-0x16388463d60ffe0661cf7f1f31a7d658ac790ff7) | 🟢 LOW | — | Storage only | 3/8 signers |

> **Signers of `Gnosis Safe 3/8` (0x1638...0ff7):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x5E5D6f849Fa86c058f148E9D3f643C8F4c43f20b` | EOA | 2026-05-21 | EOA |
> | `0x5250077c42627cBd112988f32D482acC9ff40bDB` | EOA | 2026-05-21 | EOA |
> | `0xC357eE8a8DdE88Dd5a3Ea54847Adef6846A28c51` | EOA | 2026-05-21 | EOA |
> | `0xFcc3796370e1538F8cC60bec19A8be5457f2C74F` | EOA | 2026-05-21 | EOA |
> | `0xFafFb75e14faFf9f11315E44a2E54A22872c7a34` | EOA | 2026-05-21 | EOA |
> | `0x80a3887BA60F76acAb48EE4aEAd0a71A0774A8B2` | EOA | 2025-11-25 | EOA |
> | `0xB13C8f58a233607569D2F8411B912148aeC4aEe2` | EOA | 2025-01-20 | EOA |
> | `0x0Dca0FDC170baA4CA9c1dCd37Ffe01f97bCfD504` | EOA | 2025-11-25 | EOA |

> **Quorum history:**
>   - 2021-04-14: 🔴 decreased 3 → 1
>   - 2021-04-15: 🟢 increased 1 → 2
>   - 2021-07-14: 🟢 increased 2 → 3
>   - 2021-09-17: 🔴 decreased 3 → 2
>   - 2021-09-17: 🟢 increased 2 → 3

### > 🟢 `governance()`

> **Privileged write functions:**
> - `harvestStrategy(address _strategyAddress)`
>   - ⚠️ *Also callable by members of `keepers` mapping (dual-gate modifier)*
> - `tendStrategy(address _strategyAddress)`
>   - ⚠️ *Also callable by members of `keepers` mapping (dual-gate modifier)*
> - `processReport(address _vaultAddress, address _strategyAddress)`
>   - ⚠️ *Also callable by members of `keepers` mapping (dual-gate modifier)*
> - `forwardCall(address debtAllocatorAddress, bytes memory data)`
>   - ⚠️ *Also callable by members of `keepers` mapping (dual-gate modifier)*
> - `setKeeper(address _address, bool _allowed)`
> - `setOwner(address _owner)` — Changes the `owner` address. /
> - `setGovernance(address _governance)` — Changes the `governance` address. /

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7` | [↳ Gnosis Safe 3/8](#c-0x16388463d60ffe0661cf7f1f31a7d658ac790ff7) | 🟢 LOW | — | Storage only | 3/8 signers |

> **Signers of `Gnosis Safe 3/8` (0x1638...0ff7):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x5E5D6f849Fa86c058f148E9D3f643C8F4c43f20b` | EOA | 2026-05-21 | EOA |
> | `0x5250077c42627cBd112988f32D482acC9ff40bDB` | EOA | 2026-05-21 | EOA |
> | `0xC357eE8a8DdE88Dd5a3Ea54847Adef6846A28c51` | EOA | 2026-05-21 | EOA |
> | `0xFcc3796370e1538F8cC60bec19A8be5457f2C74F` | EOA | 2026-05-21 | EOA |
> | `0xFafFb75e14faFf9f11315E44a2E54A22872c7a34` | EOA | 2026-05-21 | EOA |
> | `0x80a3887BA60F76acAb48EE4aEAd0a71A0774A8B2` | EOA | 2025-11-25 | EOA |
> | `0xB13C8f58a233607569D2F8411B912148aeC4aEe2` | EOA | 2025-01-20 | EOA |
> | `0x0Dca0FDC170baA4CA9c1dCd37Ffe01f97bCfD504` | EOA | 2025-11-25 | EOA |

> **Quorum history:**
>   - 2021-04-14: 🔴 decreased 3 → 1
>   - 2021-04-15: 🟢 increased 1 → 2
>   - 2021-07-14: 🟢 increased 2 → 3
>   - 2021-09-17: 🔴 decreased 3 → 2
>   - 2021-09-17: 🟢 increased 2 → 3

> #### 🔧 Permissioned Parameters

> **`governance`** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> | Field | Value |
> |---|---|
> | Current Value | `0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7` |
> | Setter | `setGovernance(address _governance)` |
> | Gated by | `governance()` |
> | Tags | — |
> | Last changed | 2024-10-19 |
> | Changed by | `0x6Ba1...4D56` |
> | Total changes | 1 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7` | `0x6Ba1...4D56` | 2024-10-19 |

> **`keepers`** *(per-asset)*

> | Asset | Current Value |
> |---|---|
> | EOA `0x0A4d...eD1B` | `False` |
> | Gnosis Safe 3/8 `0x1638...0ff7` | `True` |
> | EOA `0x2831...7961` | `True` |
> | EOA `0x420A...e0Fa` | `True` |

> | Field | Value |
> |---|---|
> | Setter | `setKeeper(address _address, bool _allowed)` |
> | Gated by | `owner(), governance()` |
> | Tags | — |
> | Last changed | 2026-01-31 |
> | Changed by | `0x1638...0ff7` (Gnosis Safe 3/8) |
> | Total changes | 4 |

> **Recent changes:**

> | # | Asset | Value | Set By | Date |
> |---|---|---|---|---|
> | 1 | EOA | `_allowed=True` | `0x1638...0ff7` (Gnosis Safe 3/8) | 2026-01-31 |
> | 2 | EOA | `_allowed=True` | `0x1638...0ff7` (Gnosis Safe 3/8) | 2025-05-08 |
> | 3 | Gnosis Safe 3/8 | `True` | `0x6Ba1...4D56` | 2024-03-21 |
> | 4 | EOA | `True` | `0x6Ba1...4D56` | 2024-03-21 |

> **`owner`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)* 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7` |
> | Setter | `setOwner(address _owner)` |
> | Gated by | `owner(), governance()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

---
<a id="c-0x5a74cb32d36f2f517db6f7b0a0591e09b22cde69"></a>
## > Accountant `0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69`

> *4 roles · 3 members · 10 functions*

### > 🟢 `feeManager()`

> **Privileged write functions:**  
> **Capabilities:** ⚙️ **CONFIG** 💰 **SUPPLY**
> - `updateDefaultConfig(uint16 defaultManagement, uint16 defaultPerformance, uint16 defaultRefund, uint16 defaultMaxFee, uint16 defaultMaxGain, uint16 defaultMaxLoss)` — Function to update the default fee configuration used for all strategies that don't have a custom config set.
> - `setCustomConfig(address vault, uint16 customManagement, uint16 customPerformance, uint16 customRefund, uint16 customMaxFee, uint16 customMaxGain, uint16 customMaxLoss)` — Function to set a custom fee configuration for a specific vault. /
> - `removeCustomConfig(address vault)` — Function to remove a previously set custom fee configuration for a vault. /
> - `turnOffHealthCheck(address vault, address strategy)` — Turn off the health check for a specific `vault` `strategy` combo. This will only last for one report and get automatically turned back on.
> - `redeemUnderlying(address vault, uint256 amount)` — Function to redeem the underlying asset from a vault. Will default to using the full balance of the vault. `[SUPPLY]`
> - `setMaxLoss(uint256 _maxLoss)` — Sets the `maxLoss` parameter to be used on redeems. /
> - `setFutureFeeManager(address _futureFeeManager)` — Function to set a future fee manager address. /
> - `setVaultManager(address newVaultManager)` — Function to set a new vault manager. /
> - `setFeeRecipient(address newFeeRecipient)` — Function to set a new address to receive distributed rewards. / `[CONFIG]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7` | [↳ Gnosis Safe 3/8](#c-0x16388463d60ffe0661cf7f1f31a7d658ac790ff7) | 🟢 LOW | — | Storage only | 3/8 signers |

> **Signers of `Gnosis Safe 3/8` (0x1638...0ff7):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x5E5D6f849Fa86c058f148E9D3f643C8F4c43f20b` | EOA | 2026-05-21 | EOA |
> | `0x5250077c42627cBd112988f32D482acC9ff40bDB` | EOA | 2026-05-21 | EOA |
> | `0xC357eE8a8DdE88Dd5a3Ea54847Adef6846A28c51` | EOA | 2026-05-21 | EOA |
> | `0xFcc3796370e1538F8cC60bec19A8be5457f2C74F` | EOA | 2026-05-21 | EOA |
> | `0xFafFb75e14faFf9f11315E44a2E54A22872c7a34` | EOA | 2026-05-21 | EOA |
> | `0x80a3887BA60F76acAb48EE4aEAd0a71A0774A8B2` | EOA | 2025-11-25 | EOA |
> | `0xB13C8f58a233607569D2F8411B912148aeC4aEe2` | EOA | 2025-01-20 | EOA |
> | `0x0Dca0FDC170baA4CA9c1dCd37Ffe01f97bCfD504` | EOA | 2025-11-25 | EOA |

> **Quorum history:**
>   - 2021-04-14: 🔴 decreased 3 → 1
>   - 2021-04-15: 🟢 increased 1 → 2
>   - 2021-07-14: 🟢 increased 2 → 3
>   - 2021-09-17: 🔴 decreased 3 → 2
>   - 2021-09-17: 🟢 increased 2 → 3

### > 🟢 `futureFeeManager()`

> **Privileged write functions:**
> - `acceptFeeManager()` — Function to accept the role change and become the new fee manager. This function allows the future fee manager to accept the role change and become the new fee manager.

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7` | [↳ Gnosis Safe 3/8](#c-0x16388463d60ffe0661cf7f1f31a7d658ac790ff7) | 🟢 LOW | — | Events only | 3/8 signers |

> **Signers of `Gnosis Safe 3/8` (0x1638...0ff7):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x5E5D6f849Fa86c058f148E9D3f643C8F4c43f20b` | EOA | 2026-05-21 | EOA |
> | `0x5250077c42627cBd112988f32D482acC9ff40bDB` | EOA | 2026-05-21 | EOA |
> | `0xC357eE8a8DdE88Dd5a3Ea54847Adef6846A28c51` | EOA | 2026-05-21 | EOA |
> | `0xFcc3796370e1538F8cC60bec19A8be5457f2C74F` | EOA | 2026-05-21 | EOA |
> | `0xFafFb75e14faFf9f11315E44a2E54A22872c7a34` | EOA | 2026-05-21 | EOA |
> | `0x80a3887BA60F76acAb48EE4aEAd0a71A0774A8B2` | EOA | 2025-11-25 | EOA |
> | `0xB13C8f58a233607569D2F8411B912148aeC4aEe2` | EOA | 2025-01-20 | EOA |
> | `0x0Dca0FDC170baA4CA9c1dCd37Ffe01f97bCfD504` | EOA | 2025-11-25 | EOA |

> **Quorum history:**
>   - 2021-04-14: 🔴 decreased 3 → 1
>   - 2021-04-15: 🟢 increased 1 → 2
>   - 2021-07-14: 🟢 increased 2 → 3
>   - 2021-09-17: 🔴 decreased 3 → 2
>   - 2021-09-17: 🟢 increased 2 → 3

### > 🟠 `feeRecipient()` · 📋 operational


> **Members (1):**

> | Address | Name / Type | Granted | Source | Details |
> |---|---|---|---|---|
> | `0x590Dd9399bB53f1085097399C3265C7137c1C4Cf` | Dumper | — | Storage only |  |

### > 🟠 `vaultManager()` · 📋 operational


> **Members (1):**

> | Address | Name / Type | Granted | Source | Details |
> |---|---|---|---|---|
> | `0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41` | [↳ RoleManager](#c-0xb3bd6b2e61753c311efbcf0111f75d29706d9a41) | — | Storage only |  |

> #### 🔧 Permissioned Parameters

> **`feeRecipient`**

> | Field | Value |
> |---|---|
> | Current Value | `0x590Dd9399bB53f1085097399C3265C7137c1C4Cf` |
> | Setter | `setFeeRecipient(address newFeeRecipient)` |
> | Gated by | `feeManager()` |
> | Tags | `CONFIG` |
> | Last changed | 2024-11-14 |
> | Changed by | `0x6BD3...B99c` |
> | Total changes | 3 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `0x6BD32A677Bf7D4D0470739271CaF4D461A43B99c` | `0x6BD3...B99c` | 2024-11-14 |
> | 2 | `0xB86DAe1E4fe42e3696173380DB77926baCCF598C` | `0xB86D...598C` | 2024-06-14 |
> | 3 | `0x78d4BDEBc0B4140f01BAB63085F94A5a7A1294f2` | `0x78d4...94f2` | 2024-03-08 |

> **`futureFeeManager`**

> | Field | Value |
> |---|---|
> | Current Value | `0x0000000000000000000000000000000000000000` |
> | Setter | `setFutureFeeManager(address _futureFeeManager)` |
> | Gated by | `feeManager()` |
> | Tags | — |
> | Last changed | 2024-10-29 |
> | Changed by | `0x1638...0ff7` (Gnosis Safe 3/8) |
> | Total changes | 2 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7` | `0x1638...0ff7` (Gnosis Safe 3/8) | 2024-10-29 |
> | 2 | `0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52` | `0xFEB4...ff52` (Gnosis Safe 6/9) | 2024-03-08 |

> **`MANAGEMENT_FEE_THRESHOLD`** 🔒 **IMMUTABLE**

> > 🔒 **Immutable** — declared as a constant in the contract source; cannot be changed without a contract upgrade. Bounds the reachable extreme of any setter that writes a related storage variable.

> | Field | Value |
> |---|---|
> | Current Value | `200` |
> | Mutability | 🔒 immutable (constant) |
> | Tags | `IMMUTABLE` |

> **`maxLoss`** ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `0` |
> | Setter | `setMaxLoss(uint256 _maxLoss)` |
> | Gated by | `feeManager()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`PERFORMANCE_FEE_THRESHOLD`** 🔒 **IMMUTABLE**

> > 🔒 **Immutable** — declared as a constant in the contract source; cannot be changed without a contract upgrade. Bounds the reachable extreme of any setter that writes a related storage variable.

> | Field | Value |
> |---|---|
> | Current Value | `5000` |
> | Mutability | 🔒 immutable (constant) |
> | Tags | `IMMUTABLE` |

> **`vaultManager`**

> | Field | Value |
> |---|---|
> | Current Value | `0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41` |
> | Setter | `setVaultManager(address newVaultManager)` |
> | Gated by | `feeManager()` |
> | Tags | — |
> | Last changed | 2024-03-12 |
> | Changed by | `0xb3bd...9a41` (RoleManager) |
> | Total changes | 1 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41` | `0xb3bd...9a41` (RoleManager) | 2024-03-12 |

> #### 💰 Supply Actions

> _Mint / redeem / burn call tracking — last 5 calls per function, total counts preserved._

> **`redeemUnderlying`** *(per-asset)*

> | Field | Value |
> |---|---|
> | Setter | `redeemUnderlying(address vault, uint256 amount)` |
> | Gated by | `feeManager()` |
> | Tags | `SUPPLY` |
> | Last called | 2025-10-30 |
> | Called by | `0x1638...0ff7` (Gnosis Safe 3/8) |
> | Total calls | 2 |

> **Recent changes:**

> | # | Asset | Value | Set By | Date |
> |---|---|---|---|---|
> | 1 | ysyBOLD (LV2SPStakerStrategy) | `amount=13583824071157089229578 (13,583.824071e18)` | `0x1638...0ff7` (Gnosis Safe 3/8) | 2025-10-30 |
> | 2 | yvUSDS-1 (Yearn V3 Vault) | `amount=7681235092811358424066 (7,681.235093e18)` | `0x1638...0ff7` (Gnosis Safe 3/8) | 2025-08-14 |

---
<a id="c-0x9f4330700a36b29952869fac9b33f45eedd8a3d8"></a>
## > Yearn V3 Vault `0x9F4330700a36B29952869fac9b33f45EEdd8A3d8`

> *20 roles · 12 members · 25 functions*

> > ⚡ **Inherited authority** [CONFIG] — via `yBOLD (Yearn V3 Vault) - the vault ysyBOLD wraps` on **LV2SPStakerStrategy**

> 🔒 **Immutable References:** `deposit_limit_module()` → OnLossDepositLimit, `accountant()` → Accountant

### > 🟢 `PROFIT_UNLOCK_MANAGER`

> **Hash:** `yearn_role_11`  
> **Privileged write functions:**  
> **Capabilities:** 💰 **SUPPLY**
> - `setProfitMaxUnlockTime(uint256 new_profit_max_unlock_time)` — @notice Set the new profit max unlock time. `[SUPPLY]`

> **Members (2):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7` | [↳ Gnosis Safe 3/8](#c-0x16388463d60ffe0661cf7f1f31a7d658ac790ff7) | 🟢 LOW | — | Storage only | 3/8 signers |
> | `0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52` | [↳ Gnosis Safe 6/9](#c-0xfeb4acf3df3cdea7399794d0869ef76a6efaff52) | 🟢 LOW | — | Storage only | 6/9 signers |

> **Signers of `Gnosis Safe 3/8` (0x1638...0ff7):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x5E5D6f849Fa86c058f148E9D3f643C8F4c43f20b` | EOA | 2026-05-21 | EOA |
> | `0x5250077c42627cBd112988f32D482acC9ff40bDB` | EOA | 2026-05-21 | EOA |
> | `0xC357eE8a8DdE88Dd5a3Ea54847Adef6846A28c51` | EOA | 2026-05-21 | EOA |
> | `0xFcc3796370e1538F8cC60bec19A8be5457f2C74F` | EOA | 2026-05-21 | EOA |
> | `0xFafFb75e14faFf9f11315E44a2E54A22872c7a34` | EOA | 2026-05-21 | EOA |
> | `0x80a3887BA60F76acAb48EE4aEAd0a71A0774A8B2` | EOA | 2025-11-25 | EOA |
> | `0xB13C8f58a233607569D2F8411B912148aeC4aEe2` | EOA | 2025-01-20 | EOA |
> | `0x0Dca0FDC170baA4CA9c1dCd37Ffe01f97bCfD504` | EOA | 2025-11-25 | EOA |

> **Quorum history:**
>   - 2021-04-14: 🔴 decreased 3 → 1
>   - 2021-04-15: 🟢 increased 1 → 2
>   - 2021-07-14: 🟢 increased 2 → 3
>   - 2021-09-17: 🔴 decreased 3 → 2
>   - 2021-09-17: 🟢 increased 2 → 3

> **Signers of `Gnosis Safe 6/9` (0xFEB4...ff52):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0xf5D3dbda5F41A0E26D71B948e29522398e71cFaE` | EOA | 2022-06-21 | EOA |
> | `0xeA6c0837fef621E77329f85820F503cA09f2B3a9` | EOA | 2025-05-03 | EOA |
> | `0x6F2A8Ee9452ba7d336b3fba03caC27f7818AeAD6` | EOA | 2020-08-27 | EOA |
> | `0x2B888954421b424C5D3D9Ce9bB67c9bD47537d12` | EOA | 2022-06-24 | EOA |
> | `0xFe45baf0F18c207152A807c1b05926583CFE2e4b` | EOA | 2024-10-21 | EOA |
> | `0x962228a90eaC69238c7D1F216d80037e61eA9255` | EOA ⚠️ Hot wallet (1,796 txs) | 2024-10-20 | EOA |
> | `0x70aF5a3368606c6557D2B3ce2EEC8796B914EAa3` | EOA | 2026-01-20 | EOA |
> | `0x5Db9926c93085a92F14A85daBF6FF27b07362Cae` | EOA | 2025-05-03 | EOA |
> | `0x700F1a984C962b447CcDb95c4c2D8074C65098a3` | EOA | 2024-12-17 | EOA |

> **Module history:**
>   - 2020-12-03: ➕ enabled module `0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134`
>   - 2026-03-24: ➕ enabled module `0x991c8581Df1Bb51672e958a7fDCbE74288A1acAC`
>   - 2026-03-24: ➕ enabled module `0xbe01DAdf8C85277ab8db9Ceaa1cB5A5f24426Cc7`

> **Enabled modules:**
>   - `0xbe01DAdf8C85277ab8db9Ceaa1cB5A5f24426Cc7` — sudoImplant
>   - `0x991c8581Df1Bb51672e958a7fDCbE74288A1acAC` — ejectImplant
>   - `0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134` — AllowanceModule

### > 🟠 `REPORTING_MANAGER`

> **Hash:** `yearn_role_5`  
> **Privileged write functions:**  
> **Capabilities:** 💰 **SUPPLY**
> - `process_report(address strategy)` — @notice Process the report of a strategy. `[SUPPLY]`

> **Members (4):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7` | [↳ Gnosis Safe 3/8](#c-0x16388463d60ffe0661cf7f1f31a7d658ac790ff7) | 🟢 LOW | — | Storage only | 3/8 signers |
> | `0x1e9eB053228B1156831759401dE0E115356b8671` | [↳ DebtAllocator](#c-0x1e9eb053228b1156831759401de0e115356b8671) | 🟠 HIGH | — | Storage only |  |
> | `0x604e586F17cE106B64185A7a0d2c1Da5bAce711E` | [↳ yHaaSRelayer](#c-0x604e586f17ce106b64185a7a0d2c1da5bace711e) | 🟠 HIGH | — | Storage only |  |
> | `0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52` | [↳ Gnosis Safe 6/9](#c-0xfeb4acf3df3cdea7399794d0869ef76a6efaff52) | 🟢 LOW | — | Storage only | 6/9 signers |

> **Signers of `Gnosis Safe 3/8` (0x1638...0ff7):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x5E5D6f849Fa86c058f148E9D3f643C8F4c43f20b` | EOA | 2026-05-21 | EOA |
> | `0x5250077c42627cBd112988f32D482acC9ff40bDB` | EOA | 2026-05-21 | EOA |
> | `0xC357eE8a8DdE88Dd5a3Ea54847Adef6846A28c51` | EOA | 2026-05-21 | EOA |
> | `0xFcc3796370e1538F8cC60bec19A8be5457f2C74F` | EOA | 2026-05-21 | EOA |
> | `0xFafFb75e14faFf9f11315E44a2E54A22872c7a34` | EOA | 2026-05-21 | EOA |
> | `0x80a3887BA60F76acAb48EE4aEAd0a71A0774A8B2` | EOA | 2025-11-25 | EOA |
> | `0xB13C8f58a233607569D2F8411B912148aeC4aEe2` | EOA | 2025-01-20 | EOA |
> | `0x0Dca0FDC170baA4CA9c1dCd37Ffe01f97bCfD504` | EOA | 2025-11-25 | EOA |

> **Quorum history:**
>   - 2021-04-14: 🔴 decreased 3 → 1
>   - 2021-04-15: 🟢 increased 1 → 2
>   - 2021-07-14: 🟢 increased 2 → 3
>   - 2021-09-17: 🔴 decreased 3 → 2
>   - 2021-09-17: 🟢 increased 2 → 3

> **Signers of `Gnosis Safe 6/9` (0xFEB4...ff52):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0xf5D3dbda5F41A0E26D71B948e29522398e71cFaE` | EOA | 2022-06-21 | EOA |
> | `0xeA6c0837fef621E77329f85820F503cA09f2B3a9` | EOA | 2025-05-03 | EOA |
> | `0x6F2A8Ee9452ba7d336b3fba03caC27f7818AeAD6` | EOA | 2020-08-27 | EOA |
> | `0x2B888954421b424C5D3D9Ce9bB67c9bD47537d12` | EOA | 2022-06-24 | EOA |
> | `0xFe45baf0F18c207152A807c1b05926583CFE2e4b` | EOA | 2024-10-21 | EOA |
> | `0x962228a90eaC69238c7D1F216d80037e61eA9255` | EOA ⚠️ Hot wallet (1,796 txs) | 2024-10-20 | EOA |
> | `0x70aF5a3368606c6557D2B3ce2EEC8796B914EAa3` | EOA | 2026-01-20 | EOA |
> | `0x5Db9926c93085a92F14A85daBF6FF27b07362Cae` | EOA | 2025-05-03 | EOA |
> | `0x700F1a984C962b447CcDb95c4c2D8074C65098a3` | EOA | 2024-12-17 | EOA |

> **Module history:**
>   - 2020-12-03: ➕ enabled module `0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134`
>   - 2026-03-24: ➕ enabled module `0x991c8581Df1Bb51672e958a7fDCbE74288A1acAC`
>   - 2026-03-24: ➕ enabled module `0xbe01DAdf8C85277ab8db9Ceaa1cB5A5f24426Cc7`

> **Enabled modules:**
>   - `0xbe01DAdf8C85277ab8db9Ceaa1cB5A5f24426Cc7` — sudoImplant
>   - `0x991c8581Df1Bb51672e958a7fDCbE74288A1acAC` — ejectImplant
>   - `0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134` — AllowanceModule

### > 🟠 `Strategy: Liquity V2 WETH Stability Pool`

> **Hash:** `bfs_seed:Strategy: Liquity V2 WETH Stability Pool`  
> **Privileged write functions:**  
> **Capabilities:** ⚙️ **CONFIG**
> - `get_default_queue()[0]` — First strategy in yBOLD's default queue, depositing BOLD into the Liquity V2 WETH Stability Pool. Listed here so the scan covers it.
 `[CONFIG]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xc5e7D3F76a03006540f17668A0267C668FFb5b75` | [↳ ysBOLD (LiquityV2SPStrategy)](#c-0xc5e7d3f76a03006540f17668a0267c668ffb5b75) | 🟠 HIGH | — | Storage only |  |

### > 🟠 `Strategy: Liquity V2 rETH Stability Pool`

> **Hash:** `bfs_seed:Strategy: Liquity V2 rETH Stability Pool`  
> **Privileged write functions:**  
> **Capabilities:** ⚙️ **CONFIG**
> - `get_default_queue()[2]` — Third strategy in yBOLD's default queue, depositing BOLD into the Liquity V2 rETH Stability Pool. Listed here so the scan covers it.
 `[CONFIG]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x6ED566B76838A08d04cBd6323231B08a2eC69005` | [↳ ysBOLD (LiquityV2SPStrategy)](#c-0x6ed566b76838a08d04cbd6323231b08a2ec69005) | 🟠 HIGH | — | Storage only |  |

### > 🟠 `Strategy: Liquity V2 wstETH Stability Pool`

> **Hash:** `bfs_seed:Strategy: Liquity V2 wstETH Stability Pool`  
> **Privileged write functions:**  
> **Capabilities:** ⚙️ **CONFIG**
> - `get_default_queue()[1]` — Second strategy in yBOLD's default queue, depositing BOLD into the Liquity V2 wstETH Stability Pool. Listed here so the scan covers it.
 `[CONFIG]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x3589b93CaDb464b6E1974Cc9fc0c9be698Ee49a5` | [↳ ysBOLD (LiquityV2SPStrategy)](#c-0x3589b93cadb464b6e1974cc9fc0c9be698ee49a5) | 🟠 HIGH | — | Storage only |  |

### > 🟢 `EMERGENCY_MANAGER`

> **Hash:** `yearn_role_13`  
> **Privileged write functions:**  
> **Capabilities:** ⏸️ **PAUSE**
> - `shutdown_vault()` — @notice Shutdown the vault. `[PAUSE]`

> **Members (3):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7` | [↳ Gnosis Safe 3/8](#c-0x16388463d60ffe0661cf7f1f31a7d658ac790ff7) | 🟢 LOW | — | Storage only | 3/8 signers |
> | `0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52` | [↳ Gnosis Safe 6/9](#c-0xfeb4acf3df3cdea7399794d0869ef76a6efaff52) | 🟢 LOW | — | Storage only | 6/9 signers |
> | `0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0` | [↳ Gnosis Safe 4/7](#c-0xe5e2baf96198c56380ddd5e992d7d1ada0e989c0) | 🟢 LOW | — | Storage only | 4/7 signers |

> **Signers of `Gnosis Safe 3/8` (0x1638...0ff7):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x5E5D6f849Fa86c058f148E9D3f643C8F4c43f20b` | EOA | 2026-05-21 | EOA |
> | `0x5250077c42627cBd112988f32D482acC9ff40bDB` | EOA | 2026-05-21 | EOA |
> | `0xC357eE8a8DdE88Dd5a3Ea54847Adef6846A28c51` | EOA | 2026-05-21 | EOA |
> | `0xFcc3796370e1538F8cC60bec19A8be5457f2C74F` | EOA | 2026-05-21 | EOA |
> | `0xFafFb75e14faFf9f11315E44a2E54A22872c7a34` | EOA | 2026-05-21 | EOA |
> | `0x80a3887BA60F76acAb48EE4aEAd0a71A0774A8B2` | EOA | 2025-11-25 | EOA |
> | `0xB13C8f58a233607569D2F8411B912148aeC4aEe2` | EOA | 2025-01-20 | EOA |
> | `0x0Dca0FDC170baA4CA9c1dCd37Ffe01f97bCfD504` | EOA | 2025-11-25 | EOA |

> **Quorum history:**
>   - 2021-04-14: 🔴 decreased 3 → 1
>   - 2021-04-15: 🟢 increased 1 → 2
>   - 2021-07-14: 🟢 increased 2 → 3
>   - 2021-09-17: 🔴 decreased 3 → 2
>   - 2021-09-17: 🟢 increased 2 → 3

> **Signers of `Gnosis Safe 6/9` (0xFEB4...ff52):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0xf5D3dbda5F41A0E26D71B948e29522398e71cFaE` | EOA | 2022-06-21 | EOA |
> | `0xeA6c0837fef621E77329f85820F503cA09f2B3a9` | EOA | 2025-05-03 | EOA |
> | `0x6F2A8Ee9452ba7d336b3fba03caC27f7818AeAD6` | EOA | 2020-08-27 | EOA |
> | `0x2B888954421b424C5D3D9Ce9bB67c9bD47537d12` | EOA | 2022-06-24 | EOA |
> | `0xFe45baf0F18c207152A807c1b05926583CFE2e4b` | EOA | 2024-10-21 | EOA |
> | `0x962228a90eaC69238c7D1F216d80037e61eA9255` | EOA ⚠️ Hot wallet (1,796 txs) | 2024-10-20 | EOA |
> | `0x70aF5a3368606c6557D2B3ce2EEC8796B914EAa3` | EOA | 2026-01-20 | EOA |
> | `0x5Db9926c93085a92F14A85daBF6FF27b07362Cae` | EOA | 2025-05-03 | EOA |
> | `0x700F1a984C962b447CcDb95c4c2D8074C65098a3` | EOA | 2024-12-17 | EOA |

> **Module history:**
>   - 2020-12-03: ➕ enabled module `0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134`
>   - 2026-03-24: ➕ enabled module `0x991c8581Df1Bb51672e958a7fDCbE74288A1acAC`
>   - 2026-03-24: ➕ enabled module `0xbe01DAdf8C85277ab8db9Ceaa1cB5A5f24426Cc7`

> **Enabled modules:**
>   - `0xbe01DAdf8C85277ab8db9Ceaa1cB5A5f24426Cc7` — sudoImplant
>   - `0x991c8581Df1Bb51672e958a7fDCbE74288A1acAC` — ejectImplant
>   - `0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134` — AllowanceModule

> **Signers of `Gnosis Safe 4/7` (0xe5e2...89c0):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x895690eC66b20c03ACC49b43d381A2D1dD423d52` | EOA | 2025-05-09 | EOA |
> | `0xd0002c648CCa8DeE2f2b8D70D542Ccde8ad6EC03` | EOA ⚠️ Hot wallet (4,075 txs) | 2025-05-09 | EOA |
> | `0x80a3887BA60F76acAb48EE4aEAd0a71A0774A8B2` | EOA | 2024-11-04 | EOA |
> | `0x2C2dc95F8C8060a7e3B354c1B9540881AEa1613C` | EOA | 2024-11-04 | EOA |
> | `0xF53D1fB2EeD22Cf1E8f7E90Da7f1CAe88344065F` | EOA | 2024-11-04 | EOA |
> | `0xB865AAf1f9f60630934739595f183C4900f65ed9` | EOA | 2024-11-04 | EOA |
> | `0x80c9aC867b2D36B7e8D74646E074c460a008C0cb` | EOA (EIP-7702 → `0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B`) | — | EOA |

> **Quorum history:**
>   - 2024-11-04: 🔴 decreased 4 → 3
>   - 2025-05-09: 🟢 increased 3 → 4

### > 🟢 `ACCOUNTANT_MANAGER`

> **Hash:** `yearn_role_3`  
> **Privileged write functions:**
> - `set_accountant(address new_accountant)` — @notice Set the new accountant address.

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x88Ba032be87d5EF1fbE87336B7090767F367BF73` | [↳ TimelockController (7d)](#c-0x88ba032be87d5ef1fbe87336b7090767f367bf73) | 🟢 LOW | — | Storage only | 7d delay (⚠ changed 2x) |


> **Delay history for `TimelockController (7d)` (0x88Ba...BF73):** 1d → 7d → 7d

### > 🟢 `ADD_STRATEGY_MANAGER`

> **Hash:** `yearn_role_0`  
> **Privileged write functions:**
> - `add_strategy(address new_strategy)` — @notice Add a new strategy.

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x88Ba032be87d5EF1fbE87336B7090767F367BF73` | [↳ TimelockController (7d)](#c-0x88ba032be87d5ef1fbe87336b7090767f367bf73) | 🟢 LOW | — | Storage only | 7d delay (⚠ changed 2x) |


> **Delay history for `TimelockController (7d)` (0x88Ba...BF73):** 1d → 7d → 7d

### > 🟠 `DEBT_MANAGER`

> **Hash:** `yearn_role_6`  
> **Privileged write functions:**
> - `set_auto_allocate(bool auto_allocate)` — @notice Set new value for `auto_allocate`

> **Members (4):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7` | [↳ Gnosis Safe 3/8](#c-0x16388463d60ffe0661cf7f1f31a7d658ac790ff7) | 🟢 LOW | — | Storage only | 3/8 signers |
> | `0x1e9eB053228B1156831759401dE0E115356b8671` | [↳ DebtAllocator](#c-0x1e9eb053228b1156831759401de0e115356b8671) | 🟠 HIGH | — | Storage only |  |
> | `0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52` | [↳ Gnosis Safe 6/9](#c-0xfeb4acf3df3cdea7399794d0869ef76a6efaff52) | 🟢 LOW | — | Storage only | 6/9 signers |
> | `0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0` | [↳ Gnosis Safe 4/7](#c-0xe5e2baf96198c56380ddd5e992d7d1ada0e989c0) | 🟢 LOW | — | Storage only | 4/7 signers |

> **Signers of `Gnosis Safe 3/8` (0x1638...0ff7):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x5E5D6f849Fa86c058f148E9D3f643C8F4c43f20b` | EOA | 2026-05-21 | EOA |
> | `0x5250077c42627cBd112988f32D482acC9ff40bDB` | EOA | 2026-05-21 | EOA |
> | `0xC357eE8a8DdE88Dd5a3Ea54847Adef6846A28c51` | EOA | 2026-05-21 | EOA |
> | `0xFcc3796370e1538F8cC60bec19A8be5457f2C74F` | EOA | 2026-05-21 | EOA |
> | `0xFafFb75e14faFf9f11315E44a2E54A22872c7a34` | EOA | 2026-05-21 | EOA |
> | `0x80a3887BA60F76acAb48EE4aEAd0a71A0774A8B2` | EOA | 2025-11-25 | EOA |
> | `0xB13C8f58a233607569D2F8411B912148aeC4aEe2` | EOA | 2025-01-20 | EOA |
> | `0x0Dca0FDC170baA4CA9c1dCd37Ffe01f97bCfD504` | EOA | 2025-11-25 | EOA |

> **Quorum history:**
>   - 2021-04-14: 🔴 decreased 3 → 1
>   - 2021-04-15: 🟢 increased 1 → 2
>   - 2021-07-14: 🟢 increased 2 → 3
>   - 2021-09-17: 🔴 decreased 3 → 2
>   - 2021-09-17: 🟢 increased 2 → 3

> **Signers of `Gnosis Safe 6/9` (0xFEB4...ff52):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0xf5D3dbda5F41A0E26D71B948e29522398e71cFaE` | EOA | 2022-06-21 | EOA |
> | `0xeA6c0837fef621E77329f85820F503cA09f2B3a9` | EOA | 2025-05-03 | EOA |
> | `0x6F2A8Ee9452ba7d336b3fba03caC27f7818AeAD6` | EOA | 2020-08-27 | EOA |
> | `0x2B888954421b424C5D3D9Ce9bB67c9bD47537d12` | EOA | 2022-06-24 | EOA |
> | `0xFe45baf0F18c207152A807c1b05926583CFE2e4b` | EOA | 2024-10-21 | EOA |
> | `0x962228a90eaC69238c7D1F216d80037e61eA9255` | EOA ⚠️ Hot wallet (1,796 txs) | 2024-10-20 | EOA |
> | `0x70aF5a3368606c6557D2B3ce2EEC8796B914EAa3` | EOA | 2026-01-20 | EOA |
> | `0x5Db9926c93085a92F14A85daBF6FF27b07362Cae` | EOA | 2025-05-03 | EOA |
> | `0x700F1a984C962b447CcDb95c4c2D8074C65098a3` | EOA | 2024-12-17 | EOA |

> **Module history:**
>   - 2020-12-03: ➕ enabled module `0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134`
>   - 2026-03-24: ➕ enabled module `0x991c8581Df1Bb51672e958a7fDCbE74288A1acAC`
>   - 2026-03-24: ➕ enabled module `0xbe01DAdf8C85277ab8db9Ceaa1cB5A5f24426Cc7`

> **Enabled modules:**
>   - `0xbe01DAdf8C85277ab8db9Ceaa1cB5A5f24426Cc7` — sudoImplant
>   - `0x991c8581Df1Bb51672e958a7fDCbE74288A1acAC` — ejectImplant
>   - `0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134` — AllowanceModule

> **Signers of `Gnosis Safe 4/7` (0xe5e2...89c0):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x895690eC66b20c03ACC49b43d381A2D1dD423d52` | EOA | 2025-05-09 | EOA |
> | `0xd0002c648CCa8DeE2f2b8D70D542Ccde8ad6EC03` | EOA ⚠️ Hot wallet (4,075 txs) | 2025-05-09 | EOA |
> | `0x80a3887BA60F76acAb48EE4aEAd0a71A0774A8B2` | EOA | 2024-11-04 | EOA |
> | `0x2C2dc95F8C8060a7e3B354c1B9540881AEa1613C` | EOA | 2024-11-04 | EOA |
> | `0xF53D1fB2EeD22Cf1E8f7E90Da7f1CAe88344065F` | EOA | 2024-11-04 | EOA |
> | `0xB865AAf1f9f60630934739595f183C4900f65ed9` | EOA | 2024-11-04 | EOA |
> | `0x80c9aC867b2D36B7e8D74646E074c460a008C0cb` | EOA (EIP-7702 → `0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B`) | — | EOA |

> **Quorum history:**
>   - 2024-11-04: 🔴 decreased 4 → 3
>   - 2025-05-09: 🟢 increased 3 → 4

### > 🟢 `DEBT_PURCHASER`

> **Hash:** `yearn_role_12`  
> **Privileged write functions:**
> - `buy_debt(address strategy, uint256 amount)` — @notice Used for governance to buy bad debt from the vault.

> **Members (2):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7` | [↳ Gnosis Safe 3/8](#c-0x16388463d60ffe0661cf7f1f31a7d658ac790ff7) | 🟢 LOW | — | Storage only | 3/8 signers |
> | `0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52` | [↳ Gnosis Safe 6/9](#c-0xfeb4acf3df3cdea7399794d0869ef76a6efaff52) | 🟢 LOW | — | Storage only | 6/9 signers |

> **Signers of `Gnosis Safe 3/8` (0x1638...0ff7):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x5E5D6f849Fa86c058f148E9D3f643C8F4c43f20b` | EOA | 2026-05-21 | EOA |
> | `0x5250077c42627cBd112988f32D482acC9ff40bDB` | EOA | 2026-05-21 | EOA |
> | `0xC357eE8a8DdE88Dd5a3Ea54847Adef6846A28c51` | EOA | 2026-05-21 | EOA |
> | `0xFcc3796370e1538F8cC60bec19A8be5457f2C74F` | EOA | 2026-05-21 | EOA |
> | `0xFafFb75e14faFf9f11315E44a2E54A22872c7a34` | EOA | 2026-05-21 | EOA |
> | `0x80a3887BA60F76acAb48EE4aEAd0a71A0774A8B2` | EOA | 2025-11-25 | EOA |
> | `0xB13C8f58a233607569D2F8411B912148aeC4aEe2` | EOA | 2025-01-20 | EOA |
> | `0x0Dca0FDC170baA4CA9c1dCd37Ffe01f97bCfD504` | EOA | 2025-11-25 | EOA |

> **Quorum history:**
>   - 2021-04-14: 🔴 decreased 3 → 1
>   - 2021-04-15: 🟢 increased 1 → 2
>   - 2021-07-14: 🟢 increased 2 → 3
>   - 2021-09-17: 🔴 decreased 3 → 2
>   - 2021-09-17: 🟢 increased 2 → 3

> **Signers of `Gnosis Safe 6/9` (0xFEB4...ff52):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0xf5D3dbda5F41A0E26D71B948e29522398e71cFaE` | EOA | 2022-06-21 | EOA |
> | `0xeA6c0837fef621E77329f85820F503cA09f2B3a9` | EOA | 2025-05-03 | EOA |
> | `0x6F2A8Ee9452ba7d336b3fba03caC27f7818AeAD6` | EOA | 2020-08-27 | EOA |
> | `0x2B888954421b424C5D3D9Ce9bB67c9bD47537d12` | EOA | 2022-06-24 | EOA |
> | `0xFe45baf0F18c207152A807c1b05926583CFE2e4b` | EOA | 2024-10-21 | EOA |
> | `0x962228a90eaC69238c7D1F216d80037e61eA9255` | EOA ⚠️ Hot wallet (1,796 txs) | 2024-10-20 | EOA |
> | `0x70aF5a3368606c6557D2B3ce2EEC8796B914EAa3` | EOA | 2026-01-20 | EOA |
> | `0x5Db9926c93085a92F14A85daBF6FF27b07362Cae` | EOA | 2025-05-03 | EOA |
> | `0x700F1a984C962b447CcDb95c4c2D8074C65098a3` | EOA | 2024-12-17 | EOA |

> **Module history:**
>   - 2020-12-03: ➕ enabled module `0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134`
>   - 2026-03-24: ➕ enabled module `0x991c8581Df1Bb51672e958a7fDCbE74288A1acAC`
>   - 2026-03-24: ➕ enabled module `0xbe01DAdf8C85277ab8db9Ceaa1cB5A5f24426Cc7`

> **Enabled modules:**
>   - `0xbe01DAdf8C85277ab8db9Ceaa1cB5A5f24426Cc7` — sudoImplant
>   - `0x991c8581Df1Bb51672e958a7fDCbE74288A1acAC` — ejectImplant
>   - `0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134` — AllowanceModule

### > 🟢 `DEPOSIT_LIMIT_MANAGER`

> **Hash:** `yearn_role_8`  
> **Privileged write functions:**
> - `set_deposit_limit(uint256 deposit_limit)` — @notice Set the new deposit limit.
> - `set_deposit_limit_module(address deposit_limit_module)` — @notice Set a contract to handle the deposit limit.

> **Members (2):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7` | [↳ Gnosis Safe 3/8](#c-0x16388463d60ffe0661cf7f1f31a7d658ac790ff7) | 🟢 LOW | — | Storage only | 3/8 signers |
> | `0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52` | [↳ Gnosis Safe 6/9](#c-0xfeb4acf3df3cdea7399794d0869ef76a6efaff52) | 🟢 LOW | — | Storage only | 6/9 signers |

> **Signers of `Gnosis Safe 3/8` (0x1638...0ff7):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x5E5D6f849Fa86c058f148E9D3f643C8F4c43f20b` | EOA | 2026-05-21 | EOA |
> | `0x5250077c42627cBd112988f32D482acC9ff40bDB` | EOA | 2026-05-21 | EOA |
> | `0xC357eE8a8DdE88Dd5a3Ea54847Adef6846A28c51` | EOA | 2026-05-21 | EOA |
> | `0xFcc3796370e1538F8cC60bec19A8be5457f2C74F` | EOA | 2026-05-21 | EOA |
> | `0xFafFb75e14faFf9f11315E44a2E54A22872c7a34` | EOA | 2026-05-21 | EOA |
> | `0x80a3887BA60F76acAb48EE4aEAd0a71A0774A8B2` | EOA | 2025-11-25 | EOA |
> | `0xB13C8f58a233607569D2F8411B912148aeC4aEe2` | EOA | 2025-01-20 | EOA |
> | `0x0Dca0FDC170baA4CA9c1dCd37Ffe01f97bCfD504` | EOA | 2025-11-25 | EOA |

> **Quorum history:**
>   - 2021-04-14: 🔴 decreased 3 → 1
>   - 2021-04-15: 🟢 increased 1 → 2
>   - 2021-07-14: 🟢 increased 2 → 3
>   - 2021-09-17: 🔴 decreased 3 → 2
>   - 2021-09-17: 🟢 increased 2 → 3

> **Signers of `Gnosis Safe 6/9` (0xFEB4...ff52):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0xf5D3dbda5F41A0E26D71B948e29522398e71cFaE` | EOA | 2022-06-21 | EOA |
> | `0xeA6c0837fef621E77329f85820F503cA09f2B3a9` | EOA | 2025-05-03 | EOA |
> | `0x6F2A8Ee9452ba7d336b3fba03caC27f7818AeAD6` | EOA | 2020-08-27 | EOA |
> | `0x2B888954421b424C5D3D9Ce9bB67c9bD47537d12` | EOA | 2022-06-24 | EOA |
> | `0xFe45baf0F18c207152A807c1b05926583CFE2e4b` | EOA | 2024-10-21 | EOA |
> | `0x962228a90eaC69238c7D1F216d80037e61eA9255` | EOA ⚠️ Hot wallet (1,796 txs) | 2024-10-20 | EOA |
> | `0x70aF5a3368606c6557D2B3ce2EEC8796B914EAa3` | EOA | 2026-01-20 | EOA |
> | `0x5Db9926c93085a92F14A85daBF6FF27b07362Cae` | EOA | 2025-05-03 | EOA |
> | `0x700F1a984C962b447CcDb95c4c2D8074C65098a3` | EOA | 2024-12-17 | EOA |

> **Module history:**
>   - 2020-12-03: ➕ enabled module `0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134`
>   - 2026-03-24: ➕ enabled module `0x991c8581Df1Bb51672e958a7fDCbE74288A1acAC`
>   - 2026-03-24: ➕ enabled module `0xbe01DAdf8C85277ab8db9Ceaa1cB5A5f24426Cc7`

> **Enabled modules:**
>   - `0xbe01DAdf8C85277ab8db9Ceaa1cB5A5f24426Cc7` — sudoImplant
>   - `0x991c8581Df1Bb51672e958a7fDCbE74288A1acAC` — ejectImplant
>   - `0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134` — AllowanceModule

### > 🟢 `FORCE_REVOKE_MANAGER`

> **Hash:** `yearn_role_2`  
> **Privileged write functions:**
> - `force_revoke_strategy(address strategy)` — @notice Force revoke a strategy.

> **Members (2):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x88Ba032be87d5EF1fbE87336B7090767F367BF73` | [↳ TimelockController (7d)](#c-0x88ba032be87d5ef1fbe87336b7090767f367bf73) | 🟢 LOW | — | Storage only | 7d delay (⚠ changed 2x) |
> | `0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52` | [↳ Gnosis Safe 6/9](#c-0xfeb4acf3df3cdea7399794d0869ef76a6efaff52) | 🟢 LOW | — | Storage only | 6/9 signers |


> **Delay history for `TimelockController (7d)` (0x88Ba...BF73):** 1d → 7d → 7d

> **Signers of `Gnosis Safe 6/9` (0xFEB4...ff52):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0xf5D3dbda5F41A0E26D71B948e29522398e71cFaE` | EOA | 2022-06-21 | EOA |
> | `0xeA6c0837fef621E77329f85820F503cA09f2B3a9` | EOA | 2025-05-03 | EOA |
> | `0x6F2A8Ee9452ba7d336b3fba03caC27f7818AeAD6` | EOA | 2020-08-27 | EOA |
> | `0x2B888954421b424C5D3D9Ce9bB67c9bD47537d12` | EOA | 2022-06-24 | EOA |
> | `0xFe45baf0F18c207152A807c1b05926583CFE2e4b` | EOA | 2024-10-21 | EOA |
> | `0x962228a90eaC69238c7D1F216d80037e61eA9255` | EOA ⚠️ Hot wallet (1,796 txs) | 2024-10-20 | EOA |
> | `0x70aF5a3368606c6557D2B3ce2EEC8796B914EAa3` | EOA | 2026-01-20 | EOA |
> | `0x5Db9926c93085a92F14A85daBF6FF27b07362Cae` | EOA | 2025-05-03 | EOA |
> | `0x700F1a984C962b447CcDb95c4c2D8074C65098a3` | EOA | 2024-12-17 | EOA |

> **Module history:**
>   - 2020-12-03: ➕ enabled module `0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134`
>   - 2026-03-24: ➕ enabled module `0x991c8581Df1Bb51672e958a7fDCbE74288A1acAC`
>   - 2026-03-24: ➕ enabled module `0xbe01DAdf8C85277ab8db9Ceaa1cB5A5f24426Cc7`

> **Enabled modules:**
>   - `0xbe01DAdf8C85277ab8db9Ceaa1cB5A5f24426Cc7` — sudoImplant
>   - `0x991c8581Df1Bb51672e958a7fDCbE74288A1acAC` — ejectImplant
>   - `0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134` — AllowanceModule

### > 🟢 `MAX_DEBT_MANAGER`

> **Hash:** `yearn_role_7`  
> **Privileged write functions:**
> - `update_max_debt_for_strategy(address strategy, uint256 new_max_debt)` — @notice Update the max debt for a strategy.

> **Members (3):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x88Ba032be87d5EF1fbE87336B7090767F367BF73` | [↳ TimelockController (7d)](#c-0x88ba032be87d5ef1fbe87336b7090767f367bf73) | 🟢 LOW | — | Storage only | 7d delay (⚠ changed 2x) |
> | `0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52` | [↳ Gnosis Safe 6/9](#c-0xfeb4acf3df3cdea7399794d0869ef76a6efaff52) | 🟢 LOW | — | Storage only | 6/9 signers |
> | `0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0` | [↳ Gnosis Safe 4/7](#c-0xe5e2baf96198c56380ddd5e992d7d1ada0e989c0) | 🟢 LOW | — | Storage only | 4/7 signers |


> **Delay history for `TimelockController (7d)` (0x88Ba...BF73):** 1d → 7d → 7d

> **Signers of `Gnosis Safe 6/9` (0xFEB4...ff52):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0xf5D3dbda5F41A0E26D71B948e29522398e71cFaE` | EOA | 2022-06-21 | EOA |
> | `0xeA6c0837fef621E77329f85820F503cA09f2B3a9` | EOA | 2025-05-03 | EOA |
> | `0x6F2A8Ee9452ba7d336b3fba03caC27f7818AeAD6` | EOA | 2020-08-27 | EOA |
> | `0x2B888954421b424C5D3D9Ce9bB67c9bD47537d12` | EOA | 2022-06-24 | EOA |
> | `0xFe45baf0F18c207152A807c1b05926583CFE2e4b` | EOA | 2024-10-21 | EOA |
> | `0x962228a90eaC69238c7D1F216d80037e61eA9255` | EOA ⚠️ Hot wallet (1,796 txs) | 2024-10-20 | EOA |
> | `0x70aF5a3368606c6557D2B3ce2EEC8796B914EAa3` | EOA | 2026-01-20 | EOA |
> | `0x5Db9926c93085a92F14A85daBF6FF27b07362Cae` | EOA | 2025-05-03 | EOA |
> | `0x700F1a984C962b447CcDb95c4c2D8074C65098a3` | EOA | 2024-12-17 | EOA |

> **Module history:**
>   - 2020-12-03: ➕ enabled module `0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134`
>   - 2026-03-24: ➕ enabled module `0x991c8581Df1Bb51672e958a7fDCbE74288A1acAC`
>   - 2026-03-24: ➕ enabled module `0xbe01DAdf8C85277ab8db9Ceaa1cB5A5f24426Cc7`

> **Enabled modules:**
>   - `0xbe01DAdf8C85277ab8db9Ceaa1cB5A5f24426Cc7` — sudoImplant
>   - `0x991c8581Df1Bb51672e958a7fDCbE74288A1acAC` — ejectImplant
>   - `0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134` — AllowanceModule

> **Signers of `Gnosis Safe 4/7` (0xe5e2...89c0):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x895690eC66b20c03ACC49b43d381A2D1dD423d52` | EOA | 2025-05-09 | EOA |
> | `0xd0002c648CCa8DeE2f2b8D70D542Ccde8ad6EC03` | EOA ⚠️ Hot wallet (4,075 txs) | 2025-05-09 | EOA |
> | `0x80a3887BA60F76acAb48EE4aEAd0a71A0774A8B2` | EOA | 2024-11-04 | EOA |
> | `0x2C2dc95F8C8060a7e3B354c1B9540881AEa1613C` | EOA | 2024-11-04 | EOA |
> | `0xF53D1fB2EeD22Cf1E8f7E90Da7f1CAe88344065F` | EOA | 2024-11-04 | EOA |
> | `0xB865AAf1f9f60630934739595f183C4900f65ed9` | EOA | 2024-11-04 | EOA |
> | `0x80c9aC867b2D36B7e8D74646E074c460a008C0cb` | EOA (EIP-7702 → `0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B`) | — | EOA |

> **Quorum history:**
>   - 2024-11-04: 🔴 decreased 4 → 3
>   - 2025-05-09: 🟢 increased 3 → 4

### > 🟢 `MINIMUM_IDLE_MANAGER`

> **Hash:** `yearn_role_10`  
> **Privileged write functions:**
> - `set_minimum_total_idle(uint256 minimum_total_idle)` — @notice Set the new minimum total idle.

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52` | [↳ Gnosis Safe 6/9](#c-0xfeb4acf3df3cdea7399794d0869ef76a6efaff52) | 🟢 LOW | — | Storage only | 6/9 signers |

> **Signers of `Gnosis Safe 6/9` (0xFEB4...ff52):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0xf5D3dbda5F41A0E26D71B948e29522398e71cFaE` | EOA | 2022-06-21 | EOA |
> | `0xeA6c0837fef621E77329f85820F503cA09f2B3a9` | EOA | 2025-05-03 | EOA |
> | `0x6F2A8Ee9452ba7d336b3fba03caC27f7818AeAD6` | EOA | 2020-08-27 | EOA |
> | `0x2B888954421b424C5D3D9Ce9bB67c9bD47537d12` | EOA | 2022-06-24 | EOA |
> | `0xFe45baf0F18c207152A807c1b05926583CFE2e4b` | EOA | 2024-10-21 | EOA |
> | `0x962228a90eaC69238c7D1F216d80037e61eA9255` | EOA ⚠️ Hot wallet (1,796 txs) | 2024-10-20 | EOA |
> | `0x70aF5a3368606c6557D2B3ce2EEC8796B914EAa3` | EOA | 2026-01-20 | EOA |
> | `0x5Db9926c93085a92F14A85daBF6FF27b07362Cae` | EOA | 2025-05-03 | EOA |
> | `0x700F1a984C962b447CcDb95c4c2D8074C65098a3` | EOA | 2024-12-17 | EOA |

> **Module history:**
>   - 2020-12-03: ➕ enabled module `0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134`
>   - 2026-03-24: ➕ enabled module `0x991c8581Df1Bb51672e958a7fDCbE74288A1acAC`
>   - 2026-03-24: ➕ enabled module `0xbe01DAdf8C85277ab8db9Ceaa1cB5A5f24426Cc7`

> **Enabled modules:**
>   - `0xbe01DAdf8C85277ab8db9Ceaa1cB5A5f24426Cc7` — sudoImplant
>   - `0x991c8581Df1Bb51672e958a7fDCbE74288A1acAC` — ejectImplant
>   - `0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134` — AllowanceModule

### > 🟢 `QUEUE_MANAGER`

> **Hash:** `yearn_role_4`  
> **Privileged write functions:**
> - `set_default_queue(address[] new_default_queue)` — @notice Set the new default queue array.
> - `set_use_default_queue(bool use_default_queue)` — @notice Set a new value for `use_default_queue`.

> **Members (2):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7` | [↳ Gnosis Safe 3/8](#c-0x16388463d60ffe0661cf7f1f31a7d658ac790ff7) | 🟢 LOW | — | Storage only | 3/8 signers |
> | `0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52` | [↳ Gnosis Safe 6/9](#c-0xfeb4acf3df3cdea7399794d0869ef76a6efaff52) | 🟢 LOW | — | Storage only | 6/9 signers |

> **Signers of `Gnosis Safe 3/8` (0x1638...0ff7):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x5E5D6f849Fa86c058f148E9D3f643C8F4c43f20b` | EOA | 2026-05-21 | EOA |
> | `0x5250077c42627cBd112988f32D482acC9ff40bDB` | EOA | 2026-05-21 | EOA |
> | `0xC357eE8a8DdE88Dd5a3Ea54847Adef6846A28c51` | EOA | 2026-05-21 | EOA |
> | `0xFcc3796370e1538F8cC60bec19A8be5457f2C74F` | EOA | 2026-05-21 | EOA |
> | `0xFafFb75e14faFf9f11315E44a2E54A22872c7a34` | EOA | 2026-05-21 | EOA |
> | `0x80a3887BA60F76acAb48EE4aEAd0a71A0774A8B2` | EOA | 2025-11-25 | EOA |
> | `0xB13C8f58a233607569D2F8411B912148aeC4aEe2` | EOA | 2025-01-20 | EOA |
> | `0x0Dca0FDC170baA4CA9c1dCd37Ffe01f97bCfD504` | EOA | 2025-11-25 | EOA |

> **Quorum history:**
>   - 2021-04-14: 🔴 decreased 3 → 1
>   - 2021-04-15: 🟢 increased 1 → 2
>   - 2021-07-14: 🟢 increased 2 → 3
>   - 2021-09-17: 🔴 decreased 3 → 2
>   - 2021-09-17: 🟢 increased 2 → 3

> **Signers of `Gnosis Safe 6/9` (0xFEB4...ff52):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0xf5D3dbda5F41A0E26D71B948e29522398e71cFaE` | EOA | 2022-06-21 | EOA |
> | `0xeA6c0837fef621E77329f85820F503cA09f2B3a9` | EOA | 2025-05-03 | EOA |
> | `0x6F2A8Ee9452ba7d336b3fba03caC27f7818AeAD6` | EOA | 2020-08-27 | EOA |
> | `0x2B888954421b424C5D3D9Ce9bB67c9bD47537d12` | EOA | 2022-06-24 | EOA |
> | `0xFe45baf0F18c207152A807c1b05926583CFE2e4b` | EOA | 2024-10-21 | EOA |
> | `0x962228a90eaC69238c7D1F216d80037e61eA9255` | EOA ⚠️ Hot wallet (1,796 txs) | 2024-10-20 | EOA |
> | `0x70aF5a3368606c6557D2B3ce2EEC8796B914EAa3` | EOA | 2026-01-20 | EOA |
> | `0x5Db9926c93085a92F14A85daBF6FF27b07362Cae` | EOA | 2025-05-03 | EOA |
> | `0x700F1a984C962b447CcDb95c4c2D8074C65098a3` | EOA | 2024-12-17 | EOA |

> **Module history:**
>   - 2020-12-03: ➕ enabled module `0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134`
>   - 2026-03-24: ➕ enabled module `0x991c8581Df1Bb51672e958a7fDCbE74288A1acAC`
>   - 2026-03-24: ➕ enabled module `0xbe01DAdf8C85277ab8db9Ceaa1cB5A5f24426Cc7`

> **Enabled modules:**
>   - `0xbe01DAdf8C85277ab8db9Ceaa1cB5A5f24426Cc7` — sudoImplant
>   - `0x991c8581Df1Bb51672e958a7fDCbE74288A1acAC` — ejectImplant
>   - `0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134` — AllowanceModule

### > 🟢 `REVOKE_STRATEGY_MANAGER`

> **Hash:** `yearn_role_1`  
> **Privileged write functions:**
> - `revoke_strategy(address strategy)` — @notice Revoke a strategy.

> **Members (3):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7` | [↳ Gnosis Safe 3/8](#c-0x16388463d60ffe0661cf7f1f31a7d658ac790ff7) | 🟢 LOW | — | Storage only | 3/8 signers |
> | `0x88Ba032be87d5EF1fbE87336B7090767F367BF73` | [↳ TimelockController (7d)](#c-0x88ba032be87d5ef1fbe87336b7090767f367bf73) | 🟢 LOW | — | Storage only | 7d delay (⚠ changed 2x) |
> | `0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52` | [↳ Gnosis Safe 6/9](#c-0xfeb4acf3df3cdea7399794d0869ef76a6efaff52) | 🟢 LOW | — | Storage only | 6/9 signers |

> **Signers of `Gnosis Safe 3/8` (0x1638...0ff7):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x5E5D6f849Fa86c058f148E9D3f643C8F4c43f20b` | EOA | 2026-05-21 | EOA |
> | `0x5250077c42627cBd112988f32D482acC9ff40bDB` | EOA | 2026-05-21 | EOA |
> | `0xC357eE8a8DdE88Dd5a3Ea54847Adef6846A28c51` | EOA | 2026-05-21 | EOA |
> | `0xFcc3796370e1538F8cC60bec19A8be5457f2C74F` | EOA | 2026-05-21 | EOA |
> | `0xFafFb75e14faFf9f11315E44a2E54A22872c7a34` | EOA | 2026-05-21 | EOA |
> | `0x80a3887BA60F76acAb48EE4aEAd0a71A0774A8B2` | EOA | 2025-11-25 | EOA |
> | `0xB13C8f58a233607569D2F8411B912148aeC4aEe2` | EOA | 2025-01-20 | EOA |
> | `0x0Dca0FDC170baA4CA9c1dCd37Ffe01f97bCfD504` | EOA | 2025-11-25 | EOA |

> **Quorum history:**
>   - 2021-04-14: 🔴 decreased 3 → 1
>   - 2021-04-15: 🟢 increased 1 → 2
>   - 2021-07-14: 🟢 increased 2 → 3
>   - 2021-09-17: 🔴 decreased 3 → 2
>   - 2021-09-17: 🟢 increased 2 → 3


> **Delay history for `TimelockController (7d)` (0x88Ba...BF73):** 1d → 7d → 7d

> **Signers of `Gnosis Safe 6/9` (0xFEB4...ff52):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0xf5D3dbda5F41A0E26D71B948e29522398e71cFaE` | EOA | 2022-06-21 | EOA |
> | `0xeA6c0837fef621E77329f85820F503cA09f2B3a9` | EOA | 2025-05-03 | EOA |
> | `0x6F2A8Ee9452ba7d336b3fba03caC27f7818AeAD6` | EOA | 2020-08-27 | EOA |
> | `0x2B888954421b424C5D3D9Ce9bB67c9bD47537d12` | EOA | 2022-06-24 | EOA |
> | `0xFe45baf0F18c207152A807c1b05926583CFE2e4b` | EOA | 2024-10-21 | EOA |
> | `0x962228a90eaC69238c7D1F216d80037e61eA9255` | EOA ⚠️ Hot wallet (1,796 txs) | 2024-10-20 | EOA |
> | `0x70aF5a3368606c6557D2B3ce2EEC8796B914EAa3` | EOA | 2026-01-20 | EOA |
> | `0x5Db9926c93085a92F14A85daBF6FF27b07362Cae` | EOA | 2025-05-03 | EOA |
> | `0x700F1a984C962b447CcDb95c4c2D8074C65098a3` | EOA | 2024-12-17 | EOA |

> **Module history:**
>   - 2020-12-03: ➕ enabled module `0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134`
>   - 2026-03-24: ➕ enabled module `0x991c8581Df1Bb51672e958a7fDCbE74288A1acAC`
>   - 2026-03-24: ➕ enabled module `0xbe01DAdf8C85277ab8db9Ceaa1cB5A5f24426Cc7`

> **Enabled modules:**
>   - `0xbe01DAdf8C85277ab8db9Ceaa1cB5A5f24426Cc7` — sudoImplant
>   - `0x991c8581Df1Bb51672e958a7fDCbE74288A1acAC` — ejectImplant
>   - `0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134` — AllowanceModule

### > 🟢 `WITHDRAW_LIMIT_MANAGER`

> **Hash:** `yearn_role_9`  
> **Privileged write functions:**
> - `set_withdraw_limit_module(address withdraw_limit_module)` — @notice Set a contract to handle the withdraw limit.

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52` | [↳ Gnosis Safe 6/9](#c-0xfeb4acf3df3cdea7399794d0869ef76a6efaff52) | 🟢 LOW | — | Storage only | 6/9 signers |

> **Signers of `Gnosis Safe 6/9` (0xFEB4...ff52):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0xf5D3dbda5F41A0E26D71B948e29522398e71cFaE` | EOA | 2022-06-21 | EOA |
> | `0xeA6c0837fef621E77329f85820F503cA09f2B3a9` | EOA | 2025-05-03 | EOA |
> | `0x6F2A8Ee9452ba7d336b3fba03caC27f7818AeAD6` | EOA | 2020-08-27 | EOA |
> | `0x2B888954421b424C5D3D9Ce9bB67c9bD47537d12` | EOA | 2022-06-24 | EOA |
> | `0xFe45baf0F18c207152A807c1b05926583CFE2e4b` | EOA | 2024-10-21 | EOA |
> | `0x962228a90eaC69238c7D1F216d80037e61eA9255` | EOA ⚠️ Hot wallet (1,796 txs) | 2024-10-20 | EOA |
> | `0x70aF5a3368606c6557D2B3ce2EEC8796B914EAa3` | EOA | 2026-01-20 | EOA |
> | `0x5Db9926c93085a92F14A85daBF6FF27b07362Cae` | EOA | 2025-05-03 | EOA |
> | `0x700F1a984C962b447CcDb95c4c2D8074C65098a3` | EOA | 2024-12-17 | EOA |

> **Module history:**
>   - 2020-12-03: ➕ enabled module `0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134`
>   - 2026-03-24: ➕ enabled module `0x991c8581Df1Bb51672e958a7fDCbE74288A1acAC`
>   - 2026-03-24: ➕ enabled module `0xbe01DAdf8C85277ab8db9Ceaa1cB5A5f24426Cc7`

> **Enabled modules:**
>   - `0xbe01DAdf8C85277ab8db9Ceaa1cB5A5f24426Cc7` — sudoImplant
>   - `0x991c8581Df1Bb51672e958a7fDCbE74288A1acAC` — ejectImplant
>   - `0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134` — AllowanceModule

### > 🟠 `role_manager()`

> **Privileged write functions:**
> - `setName(string name)` — @notice Change the vault name.
> - `setSymbol(string symbol)` — @notice Change the vault symbol.
> - `set_role(address account, uint256 role)` — @notice Set the roles for an account.
> - `add_role(address account, uint256 role)` — @notice Add a new role/s to an address.
> - `remove_role(address account, uint256 role)` — @notice Remove a role/s from an account.
> - `transfer_role_manager(address role_manager)` — @notice Step 1 of 2 in order to transfer the

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41` | [↳ RoleManager](#c-0xb3bd6b2e61753c311efbcf0111f75d29706d9a41) | 🟠 HIGH | — | Storage only |  |

> #### 🔧 Permissioned Parameters

> **`accountant`** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> | Field | Value |
> |---|---|
> | Current Value | `0x53acEBB9470Cfc9D231075154f5dcF1586A4c6fa` |
> | Setter | `set_accountant(address new_accountant)` |
> | Gated by | `ACCOUNTANT_MANAGER` |
> | Tags | — |
> | Last changed | 2025-05-26 |
> | Changed by | `0x285E...B43B` |
> | Total changes | 1 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `0x53acEBB9470Cfc9D231075154f5dcF1586A4c6fa` | `0x285E...B43B` | 2025-05-26 |

> **`auto_allocate`**

> | Field | Value |
> |---|---|
> | Current Value | `True` |
> | Setter | `set_auto_allocate(bool auto_allocate)` |
> | Gated by | `DEBT_MANAGER` |
> | Tags | — |
> | Last changed | 2025-05-30 |
> | Changed by | `0xd000...EC03` (EOA) |
> | Total changes | 1 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `True` | `0xd000...EC03` (EOA) | 2025-05-30 |

> **`deposit_limit`**

> | Field | Value |
> |---|---|
> | Current Value | `115792089237316195423570985008687907853269984665640564039457584007913129639935 (115,792,089,237,316,203,707,617,735,395,386,539,918,674,240,093,853,421,928,448.000000e18)` |
> | Setter | `set_deposit_limit(uint256 deposit_limit)` |
> | Gated by | `DEPOSIT_LIMIT_MANAGER` |
> | Tags | — |
> | Last changed | 2025-08-24 |
> | Changed by | `0x285E...B43B` |
> | Total changes | 2 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `115792089237316195423570985008687907853269984665640564039457584007913129639935 (115,792,089,237,316,203,707,617,735,395,386,539,918,674,240,093,853,421,928,448.000000e18)` | `0x285E...B43B` | 2025-08-24 |
> | 2 | `100000000000000000000000000000 (100,000,000,000.000000e18)` | `0x285E...B43B` | 2025-05-26 |

> **`deposit_limit_module`**

> | Field | Value |
> |---|---|
> | Current Value | `0x746C238E34a6dBFE1d35d50471467Bd7Bf898f62` |
> | Setter | `set_deposit_limit_module(address deposit_limit_module)` |
> | Gated by | `DEPOSIT_LIMIT_MANAGER` |
> | Tags | — |
> | Last changed | 2025-08-24 |
> | Changed by | `0x1638...0ff7` (Gnosis Safe 3/8) |
> | Total changes | 1 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `deposit_limit_module=0x746C238E34a6dBFE1d35d50471467Bd7Bf898f62 · override=True` | `0x1638...0ff7` (Gnosis Safe 3/8) | 2025-08-24 |

> **`minimum_total_idle`** ❄️ **DORMANT**

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `0` |
> | Setter | `set_minimum_total_idle(uint256 minimum_total_idle)` |
> | Gated by | `MINIMUM_IDLE_MANAGER` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`profitMaxUnlockTime`**

> | Field | Value |
> |---|---|
> | Current Value | `0` |
> | Setter | `setProfitMaxUnlockTime(uint256 new_profit_max_unlock_time)` |
> | Gated by | `PROFIT_UNLOCK_MANAGER` |
> | Tags | `SUPPLY` |
> | Last changed | 2025-05-30 |
> | Changed by | `0xd000...EC03` (EOA) |
> | Total changes | 3 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `0` | `0xd000...EC03` (EOA) | 2025-05-30 |
> | 2 | `new_profit_max_unlock_time=86400` | `0xFEB4...ff52` (Gnosis Safe 6/9) | 2025-05-30 |
> | 3 | `0` | `0x285E...B43B` | 2025-05-29 |

> **`role_manager`**

> | Field | Value |
> |---|---|
> | Current Value | `0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41` |
> | Setter | `transfer_role_manager(address role_manager)` |
> | Gated by | `role_manager()` |
> | Tags | — |
> | Last changed | 2026-04-01 |
> | Changed by | `0xFEB4...ff52` (Gnosis Safe 6/9) |
> | Total changes | 3 |

> **Recent changes (showing last 2 of 3):**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `role_manager=0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41` | `0xFEB4...ff52` (Gnosis Safe 6/9) | 2026-04-01 |
> | 2 | `0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41` | `0xb3bd...9a41` (RoleManager) | 2025-05-30 |

> **`shutdown_vault`** ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Setter | `shutdown_vault()` |
> | Gated by | `EMERGENCY_MANAGER` |
> | Tags | `PAUSE` |
> | Last called | — |
> | Called by | — |
> | Total calls | 0 ❄️ |

> **`use_default_queue`** ❄️ **DORMANT**

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `False` |
> | Setter | `set_use_default_queue(bool use_default_queue)` |
> | Gated by | `QUEUE_MANAGER` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`withdraw_limit_module`** ❄️ **DORMANT**

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `0x0000000000000000000000000000000000000000` |
> | Setter | `set_withdraw_limit_module(address withdraw_limit_module)` |
> | Gated by | `WITHDRAW_LIMIT_MANAGER` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> #### 💰 Supply Actions

> _Mint / redeem / burn call tracking — last 5 calls per function, total counts preserved._

> **`process_report`** *(per-asset)* 🔄 **ACTIVE** (1189 changes)

> > ⚠️ This parameter has been changed **1189 times** — monitor for unexpected modifications.

> | Field | Value |
> |---|---|
> | Setter | `process_report(address strategy)` |
> | Gated by | `REPORTING_MANAGER` |
> | Tags | `SUPPLY` |
> | Last called | 2025-10-11 |
> | Called by | `0x1638...0ff7` (Gnosis Safe 3/8) |
> | Total calls | 1189 🔄 |

> **Recent changes (showing last 1 of 1189):**

> | # | Asset | Value | Set By | Date |
> |---|---|---|---|---|
> | 1 | Liquity V2 wstETH Stability Pool | `(Safe-mediated)` | `0x1638...0ff7` (Gnosis Safe 3/8) | 2025-10-11 |

---
<a id="c-0xb3bd6b2e61753c311efbcf0111f75d29706d9a41"></a>
## > RoleManager `0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41`

> *10 roles · 8 members · 5 functions*

> > ⚡ **Inherited authority** [CONFIG] — via `role_manager()` on **Yearn V3 Vault**

> 🔒 **Immutable References:** `chad()` → Gnosis Safe 6/9, `getSecurity()` → Gnosis Safe 4/7, `getAccountant()` → Accountant, `getDaddy()` → Gnosis Safe 6/9, `getDebtAllocator()` → DebtAllocator, `getKeeper()` → yHaaSRelayer, `getStrategyManager()` → TimelockController (7d), `getRegistry()` → Registry, `getBrain()` → Gnosis Safe 3/8

### > 🟢 `governance()`

> **Privileged write functions:**
> - `transferGovernance(address _newGovernance)` — Sets a new address as the governance of the contract. Throws if the caller is not current governance.
> - `removeRoles(address[] calldata _vaults, address _holder, uint256 _role)` — Removes a specific role(s) for a `_holder` from the `_vaults`. Can be used to remove one specific role or multiple.
> - `setPositionRoles(bytes32 _position, uint256 _newRoles)` — Setter function for updating a positions roles. /
> - `setPositionHolder(bytes32 _position, address _newHolder)` — Setter function for updating a positions holder. /
> - `setDefaultProfitMaxUnlock(uint256 _newDefaultProfitMaxUnlock)` — Sets the default time until profits are fully unlocked for new vaults. /

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x88Ba032be87d5EF1fbE87336B7090767F367BF73` | [↳ TimelockController (7d)](#c-0x88ba032be87d5ef1fbe87336b7090767f367bf73) | 🟢 LOW | — | Storage only | 7d delay (⚠ changed 2x) |


> **Delay history for `TimelockController (7d)` (0x88Ba...BF73):** 1d → 7d → 7d

> #### 🔧 Permissioned Parameters

> **`defaultProfitMaxUnlock`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)*

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `864000` |
> | Setter | `setDefaultProfitMaxUnlock(uint256 _newDefaultProfitMaxUnlock)` |
> | Gated by | `governance()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

---
<a id="c-0x88ba032be87d5ef1fbe87336b7090767f367bf73"></a>
## > TimelockController `0x88Ba032be87d5EF1fbE87336B7090767F367BF73`

> *4 roles · 4 members · 5 functions*

> > ⚡ **Inherited authority** [CONFIG] — via `ADD_STRATEGY_MANAGER` on **Yearn V3 Vault**

### > 🟢 `CANCELLER_ROLE`

> **Hash:** `0xfd643c72710c63c0180259aba6b2d05451e3591a24e58b62239378085726f783`  
> **Managed by:** `TIMELOCK_ADMIN_ROLE`  
> **Privileged write functions:**
> - `cancel(bytes32 id)` — Cancel an operation. Requirements:

> **Members (2):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7` | [↳ Gnosis Safe 3/8](#c-0x16388463d60ffe0661cf7f1f31a7d658ac790ff7) | 🟢 LOW | 2026-03-12 | Events only · hasRole ✓ | 3/8 signers |
> | `0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52` | [↳ Gnosis Safe 6/9](#c-0xfeb4acf3df3cdea7399794d0869ef76a6efaff52) | 🟢 LOW | 2026-01-15 | Events only · hasRole ✓ | 6/9 signers |

> **Signers of `Gnosis Safe 3/8` (0x1638...0ff7):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x5E5D6f849Fa86c058f148E9D3f643C8F4c43f20b` | EOA | 2026-05-21 | EOA |
> | `0x5250077c42627cBd112988f32D482acC9ff40bDB` | EOA | 2026-05-21 | EOA |
> | `0xC357eE8a8DdE88Dd5a3Ea54847Adef6846A28c51` | EOA | 2026-05-21 | EOA |
> | `0xFcc3796370e1538F8cC60bec19A8be5457f2C74F` | EOA | 2026-05-21 | EOA |
> | `0xFafFb75e14faFf9f11315E44a2E54A22872c7a34` | EOA | 2026-05-21 | EOA |
> | `0x80a3887BA60F76acAb48EE4aEAd0a71A0774A8B2` | EOA | 2025-11-25 | EOA |
> | `0xB13C8f58a233607569D2F8411B912148aeC4aEe2` | EOA | 2025-01-20 | EOA |
> | `0x0Dca0FDC170baA4CA9c1dCd37Ffe01f97bCfD504` | EOA | 2025-11-25 | EOA |

> **Quorum history:**
>   - 2021-04-14: 🔴 decreased 3 → 1
>   - 2021-04-15: 🟢 increased 1 → 2
>   - 2021-07-14: 🟢 increased 2 → 3
>   - 2021-09-17: 🔴 decreased 3 → 2
>   - 2021-09-17: 🟢 increased 2 → 3

> **Signers of `Gnosis Safe 6/9` (0xFEB4...ff52):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0xf5D3dbda5F41A0E26D71B948e29522398e71cFaE` | EOA | 2022-06-21 | EOA |
> | `0xeA6c0837fef621E77329f85820F503cA09f2B3a9` | EOA | 2025-05-03 | EOA |
> | `0x6F2A8Ee9452ba7d336b3fba03caC27f7818AeAD6` | EOA | 2020-08-27 | EOA |
> | `0x2B888954421b424C5D3D9Ce9bB67c9bD47537d12` | EOA | 2022-06-24 | EOA |
> | `0xFe45baf0F18c207152A807c1b05926583CFE2e4b` | EOA | 2024-10-21 | EOA |
> | `0x962228a90eaC69238c7D1F216d80037e61eA9255` | EOA ⚠️ Hot wallet (1,796 txs) | 2024-10-20 | EOA |
> | `0x70aF5a3368606c6557D2B3ce2EEC8796B914EAa3` | EOA | 2026-01-20 | EOA |
> | `0x5Db9926c93085a92F14A85daBF6FF27b07362Cae` | EOA | 2025-05-03 | EOA |
> | `0x700F1a984C962b447CcDb95c4c2D8074C65098a3` | EOA | 2024-12-17 | EOA |

> **Module history:**
>   - 2020-12-03: ➕ enabled module `0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134`
>   - 2026-03-24: ➕ enabled module `0x991c8581Df1Bb51672e958a7fDCbE74288A1acAC`
>   - 2026-03-24: ➕ enabled module `0xbe01DAdf8C85277ab8db9Ceaa1cB5A5f24426Cc7`

> **Enabled modules:**
>   - `0xbe01DAdf8C85277ab8db9Ceaa1cB5A5f24426Cc7` — sudoImplant
>   - `0x991c8581Df1Bb51672e958a7fDCbE74288A1acAC` — ejectImplant
>   - `0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134` — AllowanceModule

### > 🟠 `EXECUTOR_ROLE`

> **Hash:** `0xd8aa0f3194971a2a116679f7c2090f6939c8d4e01a2a8d7e41d55e5351469e63`  
> **Managed by:** `TIMELOCK_ADMIN_ROLE`  
> **Privileged write functions:**
> - `execute(address target, uint256 value, bytes calldata payload, bytes32 predecessor, bytes32 salt)`
> - `executeBatch(address[] calldata targets, uint256[] calldata values, bytes[] calldata payloads, bytes32 predecessor, bytes32 salt)`

> **Members (2):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xF8f60BF9456A6e0141149Db2DD6f02C60da5779B` | [↳ TimelockExecutor](#c-0xf8f60bf9456a6e0141149db2dd6f02c60da5779b) | 🟠 HIGH | 2026-01-15 | Events only · hasRole ✓ |  |
> | `0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52` | [↳ Gnosis Safe 6/9](#c-0xfeb4acf3df3cdea7399794d0869ef76a6efaff52) | 🟢 LOW | 2026-01-15 | Events only · hasRole ✓ | 6/9 signers |

> **Signers of `Gnosis Safe 6/9` (0xFEB4...ff52):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0xf5D3dbda5F41A0E26D71B948e29522398e71cFaE` | EOA | 2022-06-21 | EOA |
> | `0xeA6c0837fef621E77329f85820F503cA09f2B3a9` | EOA | 2025-05-03 | EOA |
> | `0x6F2A8Ee9452ba7d336b3fba03caC27f7818AeAD6` | EOA | 2020-08-27 | EOA |
> | `0x2B888954421b424C5D3D9Ce9bB67c9bD47537d12` | EOA | 2022-06-24 | EOA |
> | `0xFe45baf0F18c207152A807c1b05926583CFE2e4b` | EOA | 2024-10-21 | EOA |
> | `0x962228a90eaC69238c7D1F216d80037e61eA9255` | EOA ⚠️ Hot wallet (1,796 txs) | 2024-10-20 | EOA |
> | `0x70aF5a3368606c6557D2B3ce2EEC8796B914EAa3` | EOA | 2026-01-20 | EOA |
> | `0x5Db9926c93085a92F14A85daBF6FF27b07362Cae` | EOA | 2025-05-03 | EOA |
> | `0x700F1a984C962b447CcDb95c4c2D8074C65098a3` | EOA | 2024-12-17 | EOA |

> **Module history:**
>   - 2020-12-03: ➕ enabled module `0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134`
>   - 2026-03-24: ➕ enabled module `0x991c8581Df1Bb51672e958a7fDCbE74288A1acAC`
>   - 2026-03-24: ➕ enabled module `0xbe01DAdf8C85277ab8db9Ceaa1cB5A5f24426Cc7`

> **Enabled modules:**
>   - `0xbe01DAdf8C85277ab8db9Ceaa1cB5A5f24426Cc7` — sudoImplant
>   - `0x991c8581Df1Bb51672e958a7fDCbE74288A1acAC` — ejectImplant
>   - `0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134` — AllowanceModule

### > 🟢 `PROPOSER_ROLE`

> **Hash:** `0xb09aa5aeb3702cfd50b6b62bc4532604938f21248a27a1d5ca736082b6819cc1`  
> **Managed by:** `TIMELOCK_ADMIN_ROLE`  
> **Privileged write functions:**
> - `schedule(address target, uint256 value, bytes calldata data, bytes32 predecessor, bytes32 salt, uint256 delay)` — Schedule an operation containing a single transaction. Emits {CallSalt} if salt is nonzero, and {CallScheduled}.
> - `scheduleBatch(address[] calldata targets, uint256[] calldata values, bytes[] calldata payloads, bytes32 predecessor, bytes32 salt, uint256 delay)` — Schedule an operation containing a batch of transactions. Emits {CallSalt} if salt is nonzero, and one {CallScheduled} event per transaction in the batch.

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52` | [↳ Gnosis Safe 6/9](#c-0xfeb4acf3df3cdea7399794d0869ef76a6efaff52) | 🟢 LOW | 2026-01-15 | Events only · hasRole ✓ | 6/9 signers |

> **Signers of `Gnosis Safe 6/9` (0xFEB4...ff52):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0xf5D3dbda5F41A0E26D71B948e29522398e71cFaE` | EOA | 2022-06-21 | EOA |
> | `0xeA6c0837fef621E77329f85820F503cA09f2B3a9` | EOA | 2025-05-03 | EOA |
> | `0x6F2A8Ee9452ba7d336b3fba03caC27f7818AeAD6` | EOA | 2020-08-27 | EOA |
> | `0x2B888954421b424C5D3D9Ce9bB67c9bD47537d12` | EOA | 2022-06-24 | EOA |
> | `0xFe45baf0F18c207152A807c1b05926583CFE2e4b` | EOA | 2024-10-21 | EOA |
> | `0x962228a90eaC69238c7D1F216d80037e61eA9255` | EOA ⚠️ Hot wallet (1,796 txs) | 2024-10-20 | EOA |
> | `0x70aF5a3368606c6557D2B3ce2EEC8796B914EAa3` | EOA | 2026-01-20 | EOA |
> | `0x5Db9926c93085a92F14A85daBF6FF27b07362Cae` | EOA | 2025-05-03 | EOA |
> | `0x700F1a984C962b447CcDb95c4c2D8074C65098a3` | EOA | 2024-12-17 | EOA |

> **Module history:**
>   - 2020-12-03: ➕ enabled module `0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134`
>   - 2026-03-24: ➕ enabled module `0x991c8581Df1Bb51672e958a7fDCbE74288A1acAC`
>   - 2026-03-24: ➕ enabled module `0xbe01DAdf8C85277ab8db9Ceaa1cB5A5f24426Cc7`

> **Enabled modules:**
>   - `0xbe01DAdf8C85277ab8db9Ceaa1cB5A5f24426Cc7` — sudoImplant
>   - `0x991c8581Df1Bb51672e958a7fDCbE74288A1acAC` — ejectImplant
>   - `0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134` — AllowanceModule

### > 🟢 `TIMELOCK_ADMIN_ROLE` · 📋 operational

> **Hash:** `0x5f58e3a2316349923ce3780f8d587db2d72378aed66a8261c916544fa6846ca5`  
> **Managed by:** `TIMELOCK_ADMIN_ROLE`  

> **Members (1):**

> | Address | Name / Type | Granted | Source | Details |
> |---|---|---|---|---|
> | `0x88Ba032be87d5EF1fbE87336B7090767F367BF73` | [↳ TimelockController (7d)](#c-0x88ba032be87d5ef1fbe87336b7090767f367bf73) | 2026-01-15 | Events only · hasRole ✓ | 7d delay (⚠ changed 2x) |


> **Delay history for `TimelockController (7d)` (0x88Ba...BF73):** 1d → 7d → 7d

---
<a id="c-0x1e9eb053228b1156831759401de0e115356b8671"></a>
## > DebtAllocator `0x1e9eB053228B1156831759401dE0E115356b8671`

> *2 roles · 2 members · 9 functions*

> > 💰 **Inherited supply authority** — holds `REPORTING_MANAGER` on **Yearn V3 Vault**. Access controls on this contract gate root token supply.

### > 🟢 `governance()`

> **Privileged write functions:**  
> **Capabilities:** ⏸️ **PAUSE**
> - `transferGovernance(address _newGovernance)` — Sets a new address as the governance of the contract. Throws if the caller is not current governance.
> - `setMinimumChange(address _vault, uint256 _minimumChange)` — Set the minimum change variable for a strategy. This is the minimum amount of debt to be
> - `setPaused(address _vault, bool _status)` — Allows governance to pause the triggers. / `[PAUSE]`
> - `setMinimumWait(uint256 _minimumWait)` — Set the minimum time to wait before re-updating a strategies debt. This is only enforced per strategy.
> - `setManager(address _address, bool _allowed)` — Set if a manager can update ratios. /
> - `setMaxDebtUpdateLoss(uint256 _maxDebtUpdateLoss)` — Set the max loss in Basis points to allow on debt updates. Withdrawing during debt updates use {redeem} which allows for 100% loss.
> - `setBaseFeeProvider(address _baseFeeProvider)` — Used to set our baseFeeProvider, which checks the network's current base fee price to determine whether it is an optimal time to harvest or tend.
> - `setMaxAcceptableBaseFee(uint256 _maxAcceptableBaseFee)` — Set the max acceptable base fee. This defaults to max uint256 and will need to
> - `setKeeper(address _address, bool _allowed)` — Set if a keeper can update debt. /

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7` | [↳ Gnosis Safe 3/8](#c-0x16388463d60ffe0661cf7f1f31a7d658ac790ff7) | 🟢 LOW | — | Storage only | 3/8 signers |

> **Signers of `Gnosis Safe 3/8` (0x1638...0ff7):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x5E5D6f849Fa86c058f148E9D3f643C8F4c43f20b` | EOA | 2026-05-21 | EOA |
> | `0x5250077c42627cBd112988f32D482acC9ff40bDB` | EOA | 2026-05-21 | EOA |
> | `0xC357eE8a8DdE88Dd5a3Ea54847Adef6846A28c51` | EOA | 2026-05-21 | EOA |
> | `0xFcc3796370e1538F8cC60bec19A8be5457f2C74F` | EOA | 2026-05-21 | EOA |
> | `0xFafFb75e14faFf9f11315E44a2E54A22872c7a34` | EOA | 2026-05-21 | EOA |
> | `0x80a3887BA60F76acAb48EE4aEAd0a71A0774A8B2` | EOA | 2025-11-25 | EOA |
> | `0xB13C8f58a233607569D2F8411B912148aeC4aEe2` | EOA | 2025-01-20 | EOA |
> | `0x0Dca0FDC170baA4CA9c1dCd37Ffe01f97bCfD504` | EOA | 2025-11-25 | EOA |

> **Quorum history:**
>   - 2021-04-14: 🔴 decreased 3 → 1
>   - 2021-04-15: 🟢 increased 1 → 2
>   - 2021-07-14: 🟢 increased 2 → 3
>   - 2021-09-17: 🔴 decreased 3 → 2
>   - 2021-09-17: 🟢 increased 2 → 3

### > 🟠 `baseFeeProvider()` · 📋 operational


> **Members (1):**

> | Address | Name / Type | Granted | Source | Details |
> |---|---|---|---|---|
> | `0xe0514dD71cfdC30147e76f65C30bdF60bfD437C3` | Basefee | — | Storage only |  |

> #### 🔧 Permissioned Parameters

> **`baseFeeProvider`**

> | Field | Value |
> |---|---|
> | Current Value | `0xe0514dD71cfdC30147e76f65C30bdF60bfD437C3` |
> | Setter | `setBaseFeeProvider(address _baseFeeProvider)` |
> | Gated by | `governance()` |
> | Tags | — |
> | Last changed | 2024-10-17 |
> | Changed by | `0x1638...0ff7` (Gnosis Safe 3/8) |
> | Total changes | 1 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `_baseFeeProvider=0xe0514dD71cfdC30147e76f65C30bdF60bfD437C3` | `0x1638...0ff7` (Gnosis Safe 3/8) | 2024-10-17 |

> **`isPaused`** *(per-asset)*

> | Asset | Current Value |
> |---|---|
> | sUSDaf (Yearn V3 Vault) `0x89E9...5317` | `True` |

> | Field | Value |
> |---|---|
> | Setter | `setPaused(address _vault, bool _status)` |
> | Gated by | `governance()` |
> | Tags | `PAUSE` |
> | Last changed | 2026-05-01 |
> | Changed by | `0x1638...0ff7` (Gnosis Safe 3/8) |
> | Total changes | 1 |

> **Recent changes:**

> | # | Asset | Value | Set By | Date |
> |---|---|---|---|---|
> | 1 | sUSDaf (Yearn V3 Vault) | `_status=True` | `0x1638...0ff7` (Gnosis Safe 3/8) | 2026-05-01 |

> **`keepers`** *(per-asset)* 🔄 **ACTIVE** (5 changes)

> > ⚠️ **Over-counted history** — the 5 retained history rows resolve to only 3 distinct transaction(s), so some rows are duplicate records of the same call. Treat the change count as an upper bound.

> > ⚠️ This parameter has been changed **5 times** — monitor for unexpected modifications.

> | Asset | Current Value |
> |---|---|
> | Gnosis Safe 3/8 `0x1638...0ff7` | `True` |
> | DebtAllocatorKeeper `0x4D87...1236` | `True` |
> | yHaaSRelayer `0x604e...711E` | `True` |
> | DebtOptimizerApplicator `0x6b1F...1f9B` | `True` |
> | DebtOptimizerApplicator `0x9ef1...7dd1` | `False` |
> | DebtOptimizerApplicator `0xabcd...A34E` | `False` |

> | Field | Value |
> |---|---|
> | Setter | `setKeeper(address _address, bool _allowed)` |
> | Gated by | `governance()` |
> | Tags | — |
> | Last changed | 2024-10-21 |
> | Changed by | `0x1638...0ff7` (Gnosis Safe 3/8) |
> | Total changes | 5 🔄 |

> **Recent changes:**

> | # | Asset | Value | Set By | Date |
> |---|---|---|---|---|
> | 1 | DebtOptimizerApplicator | `_allowed=True` | `0x1638...0ff7` (Gnosis Safe 3/8) | 2024-10-21 |
> | 2 | DebtOptimizerApplicator | `_allowed=False` | `0x1638...0ff7` (Gnosis Safe 3/8) | 2024-10-21 |
> | 3 | DebtOptimizerApplicator | `_allowed=True` | `0x1638...0ff7` (Gnosis Safe 3/8) | 2024-10-18 |
> | 4 | Gnosis Safe 3/8 | `_allowed=True` | `0x1638...0ff7` (Gnosis Safe 3/8) | 2024-10-17 |
> | 5 | yHaaSRelayer | `_allowed=True` | `0x1638...0ff7` (Gnosis Safe 3/8) | 2024-10-17 |

> **`managers`** *(per-asset)* 🔄 **ACTIVE** (5 changes)

> > ⚠️ **Over-counted history** — the 5 retained history rows resolve to only 3 distinct transaction(s), so some rows are duplicate records of the same call. Treat the change count as an upper bound.

> > ⚠️ This parameter has been changed **5 times** — monitor for unexpected modifications.

> | Asset | Current Value |
> |---|---|
> | Gnosis Safe 3/8 `0x1638...0ff7` | `False` |
> | DebtAllocatorKeeper `0x4D87...1236` | `True` |
> | DebtOptimizerApplicator `0x6b1F...1f9B` | `True` |
> | DebtOptimizerApplicator `0x9ef1...7dd1` | `False` |
> | DebtOptimizerApplicator `0xabcd...A34E` | `False` |

> | Field | Value |
> |---|---|
> | Setter | `setManager(address _address, bool _allowed)` |
> | Gated by | `governance()` |
> | Tags | — |
> | Last changed | 2024-10-21 |
> | Changed by | `0x1638...0ff7` (Gnosis Safe 3/8) |
> | Total changes | 5 🔄 |

> **Recent changes:**

> | # | Asset | Value | Set By | Date |
> |---|---|---|---|---|
> | 1 | DebtOptimizerApplicator | `_allowed=True` | `0x1638...0ff7` (Gnosis Safe 3/8) | 2024-10-21 |
> | 2 | DebtOptimizerApplicator | `_allowed=False` | `0x1638...0ff7` (Gnosis Safe 3/8) | 2024-10-21 |
> | 3 | DebtOptimizerApplicator | `_allowed=True` | `0x1638...0ff7` (Gnosis Safe 3/8) | 2024-10-18 |
> | 4 | Gnosis Safe 3/8 | `_allowed=False` | `0x1638...0ff7` (Gnosis Safe 3/8) | 2024-10-18 |
> | 5 | Gnosis Safe 3/8 | `_allowed=True` | `0x1638...0ff7` (Gnosis Safe 3/8) | 2024-10-17 |

> **`maxAcceptableBaseFee`** 🔄 **ACTIVE** (5 changes)

> > ⚠️ This parameter has been changed **5 times** — monitor for unexpected modifications.

> | Field | Value |
> |---|---|
> | Current Value | `2500000000` |
> | Setter | `setMaxAcceptableBaseFee(uint256 _maxAcceptableBaseFee)` |
> | Gated by | `governance()` |
> | Tags | — |
> | Last changed | 2025-06-12 |
> | Changed by | `0xd000...EC03` (EOA) |
> | Total changes | 5 🔄 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `2500000000` | `0xd000...EC03` (EOA) | 2025-06-12 |
> | 2 | `_maxAcceptableBaseFee=3000000000` | `0x1638...0ff7` (Gnosis Safe 3/8) | 2025-05-15 |
> | 3 | `20000000000` | `0x1b5f...D271` (EOA) | 2024-11-14 |
> | 4 | `_maxAcceptableBaseFee=10000000000` | `0x1638...0ff7` (Gnosis Safe 3/8) | 2024-11-04 |
> | 5 | `_maxAcceptableBaseFee=15000000000` | `0x1638...0ff7` (Gnosis Safe 3/8) | 2024-10-17 |

> **`maxDebtUpdateLoss`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)*

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `1` |
> | Setter | `setMaxDebtUpdateLoss(uint256 _maxDebtUpdateLoss)` |
> | Gated by | `governance()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`minimumChange`** *(per-asset)* 🔄 **ACTIVE** (33 changes)

> > ⚠️ This parameter has been changed **33 times** — monitor for unexpected modifications.

> | Asset | Current Value |
> |---|---|
> | yvDAI-1 (Yearn V3 Vault) `0x028e...336c` | `50000000000000000000000 (50,000.000000e18)` |
> | sUSDaf (Yearn V3 Vault) `0x0aBd...9e94` | `10000000000000000000000 (10,000.000000e18)` |
> | yv^2USDS-1 (Yearn V3 Vault) `0x1017...5625` | `1000000000000000000000 (1,000.000000e18)` |
> | yvyPRISMA-1 (Yearn V3 Vault) `0x11Aa...e06F` | `5000000000000000000000 (5,000.000000e18)` |
> | yvUSDS-1 (Yearn V3 Vault) `0x1828...47E8` | `10000000000000000000000 (10,000.000000e18)` |
> | yv^2USDC-1 (Yearn V3 Vault) `0x2202...AA93` | `1000000000` |
> | yvUSDT-1 (Yearn V3 Vault) `0x310B...AFaa` | `10000000000` |
> | kpdUSDT (Yearn V3 Vault) `0x48c0...dfcb` | `5000000000` |
> | yvSilo-LRT-USDC (Yearn V3 Vault) `0x4Dd0...2838` | `10000000000` |
> | yv^2DAI-2 (Yearn V3 Vault) `0x560C...2929` | `1000000000000000000000 (1,000.000000e18)` |
> | yvUSD (Yearn V3 Vault) `0x696d...6987` | `10000000000` |
> | yvWBTC-1 (Yearn V3 Vault) `0x751F...b708` | `5000000` |
> | kpdWETH (Yearn V3 Vault) `0x7757...eA2F` | `2000000000000000000 (2.000000e18)` |
> | kpdUSDC (Yearn V3 Vault) `0x7B5A...9822` | `5000000000` |
> | sUSDaf (Yearn V3 Vault) `0x89E9...5317` | `10000000000000000000000 (10,000.000000e18)` |
> | yvDAI-2 (Yearn V3 Vault) `0x9254...C22e` | `10000000000000000000000 (10,000.000000e18)` |
> | kpdWBTC (Yearn V3 Vault) `0x92C8...F728` | `5000000` |
> | yBOLD (Yearn V3 Vault) `0x9F43...A3d8` | `10000000000000000000000 (10,000.000000e18)` |
> | kpdUSDT (Yearn V3 Vault) `0xA5Da...3896` | `5000000000` |
> | yv^2WETH-2 (Yearn V3 Vault) `0xA89E...db6d` | `1000000000000000000 (1.000000e18)` |
> | yvWETH-2 (Yearn V3 Vault) `0xAc37...7571` | `12500000000000000000 (12.500000e18)` |
> | yvUSDC-2 (Yearn V3 Vault) `0xAe7d...7308` | `10000000000` |
> | yv^2WETH-1 (Yearn V3 Vault) `0xB35b...64a0` | `1000000000000000000 (1.000000e18)` |
> | yvcrvUSD-2 (Yearn V3 Vault) `0xBF31...805F` | `10000000000000000000000 (10,000.000000e18)` |
> | yvUSDC-1 (Yearn V3 Vault) `0xBe53...6204` | `50000000000` |
> | yv^2DAI-1 (Yearn V3 Vault) `0xC5Ab...50Cc` | `1000000000000000000000 (1,000.000000e18)` |
> | kpdUSDC (Yearn V3 Vault) `0xF470...014d` | `5000000000` |
> | yvSKY-1 (Yearn V3 Vault) `0xaF71...54D4` | `10000000000000000000000 (10,000.000000e18)` |
> | yvWETH-1 (Yearn V3 Vault) `0xc564...dDB0` | `10000000000000000000 (10.000000e18)` |
> | kpdWETH (Yearn V3 Vault) `0xcc6a...fBeF` | `2000000000000000000 (2.000000e18)` |
> | yETH-Recovery (Yearn V3 Vault) `0xd7a5...95B6` | `1000000000000000000 (1.000000e18)` |
> | kpdWBTC (Yearn V3 Vault) `0xe1Ac...544a` | `5000000` |
> | yv^2crvUSD (Yearn V3 Vault) `0xf9A7...8dcF` | `1000000000000000000000 (1,000.000000e18)` |

> | Field | Value |
> |---|---|
> | Setter | `setMinimumChange(address _vault, uint256 _minimumChange)` |
> | Gated by | `governance()` |
> | Tags | — |
> | Last changed | 2026-03-30 |
> | Changed by | `0x1638...0ff7` (Gnosis Safe 3/8) |
> | Total changes | 33 🔄 |

> **Recent changes (showing last 5 of 33):**

> | # | Asset | Value | Set By | Date |
> |---|---|---|---|---|
> | 1 | yETH-Recovery (Yearn V3 Vault) | `_minimumChange=1000000000000000000 (1.000000e18)` | `0x1638...0ff7` (Gnosis Safe 3/8) | 2026-03-30 |
> | 2 | yvUSD (Yearn V3 Vault) | `_minimumChange=10000000000` | `0x1638...0ff7` (Gnosis Safe 3/8) | 2026-01-27 |
> | 3 | yvSKY-1 (Yearn V3 Vault) | `_minimumChange=10000000000000000000000 (10,000.000000e18)` | `0x1638...0ff7` (Gnosis Safe 3/8) | 2025-10-24 |
> | 4 | sUSDaf (Yearn V3 Vault) | `10000000000000000000000 (10,000.000000e18)` | `0xd000...EC03` (EOA) | 2025-07-23 |
> | 5 | kpdWETH (Yearn V3 Vault) | `2000000000000000000 (2.000000e18)` | `0x1b5f...D271` (EOA) | 2025-07-01 |

> **`minimumWait`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)* 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `900` |
> | Setter | `setMinimumWait(uint256 _minimumWait)` |
> | Gated by | `governance()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

---
<a id="c-0xc5e7d3f76a03006540f17668a0267c668ffb5b75"></a>
## > LiquityV2SPStrategy `0xc5e7D3F76a03006540f17668A0267C668FFb5b75`

> *8 roles · 8 members · 18 functions*

> > ✅ **Proxy — immutable** (Proxy (ERC-1967), logic address is a bytecode constant; the EIP-1967 slot is informational) — impl: `0xD377919FA87120584B21279a491F82D5265A139c`

> > ⚡ **Inherited authority** [CONFIG] — via `Strategy: Liquity V2 WETH Stability Pool` on **Yearn V3 Vault**

> 🔒 **Immutable References:** `COLL_PRICE_ORACLE()` → WETHPriceFeed, `COLL()` → WETH (WETH9), `AUCTION()` → Auction, `SP()` → StabilityPool

### > 🟢 `management()`

> **Privileged write functions:**  
> **Capabilities:** ⚙️ **CONFIG** 💰 **SUPPLY**
> - `setPendingManagement(address _management)` — Step one of two to set a new address to be in charge of the strategy. Can only be called by the current `management`. The address is
> - `setKeeper(address _keeper)` — Sets a new address to be in charge of tend and reports. Can only be called by the current `management`.
> - `setEmergencyAdmin(address _emergencyAdmin)` — Sets a new address to be able to shutdown the strategy. Can only be called by the current `management`.
> - `setPerformanceFee(uint16 _performanceFee)` — Sets the performance fee to be charged on reported gains. Can only be called by the current `management`. `[CONFIG]`
> - `setPerformanceFeeRecipient(address _performanceFeeRecipient)` — Sets a new address to receive performance fees. Can only be called by the current `management`. `[CONFIG]`
> - `setProfitMaxUnlockTime(uint256 _profitMaxUnlockTime)` — Sets the time for profits to be unlocked over. Can only be called by the current `management`. `[SUPPLY]`
> - `setName(string calldata _name)` — Updates the name for the strategy. /
> - `allowDeposits()` — Allow anyone to deposit This is irreversible
> - `setMinAuctionPriceBps(uint256 _minAuctionPriceBps)` — Set the minimum acceptable auction price Setting to 0 disables the check
> - `setMaxAuctionAmount(uint256 _maxAuctionAmount)` — Set the maximum amount of collateral that can be auctioned at once
> - `setMaxGasPriceToTend(uint256 _maxGasPriceToTend)` — Set the maximum gas price for tending
> - `setBufferPercentage(uint256 _bufferPercentage)` — Set the buffer percentage for the auction starting price
> - `setDustThreshold(uint256 _dustThreshold)` — Set the dust threshold for the collateral token
> - `setAllowed(address _address)` — Allow a specific address to deposit This is irreversible
> - `sweep(ERC20 _token)` — Sweep stuck tokens Cannot sweep strategy asset or collateral token
> - `setProfitLimitRatio(uint256 _newProfitLimitRatio)` — Set the `profitLimitRatio`. Denominated in basis points. I.E. 1_000 == 10%.
> - `setLossLimitRatio(uint256 _newLossLimitRatio)` — Set the `lossLimitRatio`. Denominated in basis points. I.E. 1_000 == 10%.
> - `setDoHealthCheck(bool _doHealthCheck)` — Turns the healthcheck on and off. If turned off the next report will auto turn it back on.

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7` | [↳ Gnosis Safe 3/8](#c-0x16388463d60ffe0661cf7f1f31a7d658ac790ff7) | 🟢 LOW | — | Storage only | 3/8 signers |

> **Signers of `Gnosis Safe 3/8` (0x1638...0ff7):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x5E5D6f849Fa86c058f148E9D3f643C8F4c43f20b` | EOA | 2026-05-21 | EOA |
> | `0x5250077c42627cBd112988f32D482acC9ff40bDB` | EOA | 2026-05-21 | EOA |
> | `0xC357eE8a8DdE88Dd5a3Ea54847Adef6846A28c51` | EOA | 2026-05-21 | EOA |
> | `0xFcc3796370e1538F8cC60bec19A8be5457f2C74F` | EOA | 2026-05-21 | EOA |
> | `0xFafFb75e14faFf9f11315E44a2E54A22872c7a34` | EOA | 2026-05-21 | EOA |
> | `0x80a3887BA60F76acAb48EE4aEAd0a71A0774A8B2` | EOA | 2025-11-25 | EOA |
> | `0xB13C8f58a233607569D2F8411B912148aeC4aEe2` | EOA | 2025-01-20 | EOA |
> | `0x0Dca0FDC170baA4CA9c1dCd37Ffe01f97bCfD504` | EOA | 2025-11-25 | EOA |

> **Quorum history:**
>   - 2021-04-14: 🔴 decreased 3 → 1
>   - 2021-04-15: 🟢 increased 1 → 2
>   - 2021-07-14: 🟢 increased 2 → 3
>   - 2021-09-17: 🔴 decreased 3 → 2
>   - 2021-09-17: 🟢 increased 2 → 3

### > 🟢 `emergencyAdmin()` · 📋 operational


> **Members (1):**

> | Address | Name / Type | Granted | Source | Details |
> |---|---|---|---|---|
> | `0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0` | [↳ Gnosis Safe 4/7](#c-0xe5e2baf96198c56380ddd5e992d7d1ada0e989c0) | — | Storage only | 4/7 signers |

> **Signers of `Gnosis Safe 4/7` (0xe5e2...89c0):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x895690eC66b20c03ACC49b43d381A2D1dD423d52` | EOA | 2025-05-09 | EOA |
> | `0xd0002c648CCa8DeE2f2b8D70D542Ccde8ad6EC03` | EOA ⚠️ Hot wallet (4,075 txs) | 2025-05-09 | EOA |
> | `0x80a3887BA60F76acAb48EE4aEAd0a71A0774A8B2` | EOA | 2024-11-04 | EOA |
> | `0x2C2dc95F8C8060a7e3B354c1B9540881AEa1613C` | EOA | 2024-11-04 | EOA |
> | `0xF53D1fB2EeD22Cf1E8f7E90Da7f1CAe88344065F` | EOA | 2024-11-04 | EOA |
> | `0xB865AAf1f9f60630934739595f183C4900f65ed9` | EOA | 2024-11-04 | EOA |
> | `0x80c9aC867b2D36B7e8D74646E074c460a008C0cb` | EOA (EIP-7702 → `0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B`) | — | EOA |

> **Quorum history:**
>   - 2024-11-04: 🔴 decreased 4 → 3
>   - 2025-05-09: 🟢 increased 3 → 4

### > 🟠 `keeper()` · 📋 operational


> **Members (1):**

> | Address | Name / Type | Granted | Source | Details |
> |---|---|---|---|---|
> | `0x604e586F17cE106B64185A7a0d2c1Da5bAce711E` | [↳ yHaaSRelayer](#c-0x604e586f17ce106b64185a7a0d2c1da5bace711e) | — | Storage only |  |

### > 🟠 `performanceFeeRecipient()` · 📋 operational


> **Members (1):**

> | Address | Name / Type | Granted | Source | Details |
> |---|---|---|---|---|
> | `0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69` | [↳ Accountant](#c-0x5a74cb32d36f2f517db6f7b0a0591e09b22cde69) | — | Storage only |  |

> #### 🔧 Permissioned Parameters

> **`allowed`** *(per-asset)* 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> | Asset | Current Value |
> |---|---|
> | yBOLD (Yearn V3 Vault) `0x9F43...A3d8` | `True` |

> | Field | Value |
> |---|---|
> | Setter | `setAllowed(address _address)` |
> | Gated by | `management()` |
> | Tags | — |
> | Last changed | 2026-02-19 |
> | Changed by | `0x285E...B43B` |
> | Total changes | 1 |

> **Recent changes:**

> | # | Asset | Value | Set By | Date |
> |---|---|---|---|---|
> | 1 | yBOLD (Yearn V3 Vault) | `—` | `0x285E...B43B` | 2026-02-19 |

> **`ASSET_DUST_THRESHOLD`** 🔒 **IMMUTABLE**

> > 🔒 **Immutable** — declared as a constant in the contract source; cannot be changed without a contract upgrade. Bounds the reachable extreme of any setter that writes a related storage variable.

> | Field | Value |
> |---|---|
> | Current Value | `1000000000000000` |
> | Mutability | 🔒 immutable (constant) |
> | Tags | `IMMUTABLE` |

> **`bufferPercentage`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)* 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `1150000000000000000 (1.150000e18)` |
> | Hard cap | 🔒 `1150000000000000000 (1.150000e18)` (MIN_BUFFER_PERCENTAGE) |
> | Setter | `setBufferPercentage(uint256 _bufferPercentage)` |
> | Gated by | `management()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`doHealthCheck`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)* 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `True` |
> | Setter | `setDoHealthCheck(bool _doHealthCheck)` |
> | Gated by | `management()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`dustThreshold`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)* 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `1000000000000000` |
> | Setter | `setDustThreshold(uint256 _dustThreshold)` |
> | Gated by | `management()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`emergencyAdmin`**

> | Field | Value |
> |---|---|
> | Current Value | `0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0` |
> | Setter | `setEmergencyAdmin(address _emergencyAdmin)` |
> | Gated by | `management()` |
> | Tags | — |
> | Last changed | 2026-09-03 |
> | Changed by | `0xe5e2...89c0` (Gnosis Safe 4/7) |
> | Total changes | 2 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0` | `0xe5e2...89c0` (Gnosis Safe 4/7) | 2026-09-03 |
> | 2 | `0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7` | `0x1638...0ff7` (Gnosis Safe 3/8) | 2026-02-19 |

> **`keeper`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)* 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `0x604e586F17cE106B64185A7a0d2c1Da5bAce711E` |
> | Setter | `setKeeper(address _keeper)` |
> | Gated by | `management()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`lossLimitRatio`** ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `0` |
> | Setter | `setLossLimitRatio(uint256 _newLossLimitRatio)` |
> | Gated by | `management()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`MAX_FEE`** 🔒 **IMMUTABLE**

> > 🔒 **Immutable** — declared as a constant in the contract source; cannot be changed without a contract upgrade. Bounds the reachable extreme of any setter that writes a related storage variable.

> | Field | Value |
> |---|---|
> | Current Value | `5000` |
> | Mutability | 🔒 immutable (constant) |
> | Tags | `IMMUTABLE` |

> **`maxAuctionAmount`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)* 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `115792089237316195423570985008687907853269984665640564039457584007913129639935 (115,792,089,237,316,203,707,617,735,395,386,539,918,674,240,093,853,421,928,448.000000e18)` |
> | Setter | `setMaxAuctionAmount(uint256 _maxAuctionAmount)` |
> | Gated by | `management()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`maxGasPriceToTend`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)* 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `200000000000` |
> | Hard cap | 🔒 `50000000000` (MIN_MAX_GAS_PRICE_TO_TEND) |
> | Setter | `setMaxGasPriceToTend(uint256 _maxGasPriceToTend)` |
> | Gated by | `management()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`MIN_DUST_THRESHOLD`** 🔒 **IMMUTABLE**

> > 🔒 **Immutable** — declared as a constant in the contract source; cannot be changed without a contract upgrade. Bounds the reachable extreme of any setter that writes a related storage variable.

> | Field | Value |
> |---|---|
> | Current Value | `1000000000000000` |
> | Mutability | 🔒 immutable (constant) |
> | Tags | `IMMUTABLE` |

> **`minAuctionPriceBps`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)* 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `9500` |
> | Setter | `setMinAuctionPriceBps(uint256 _minAuctionPriceBps)` |
> | Gated by | `management()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`pendingManagement`**

> | Field | Value |
> |---|---|
> | Current Value | `0x0000000000000000000000000000000000000000` |
> | Setter | `setPendingManagement(address _management)` |
> | Gated by | `management()` |
> | Tags | — |
> | Last changed | 2026-02-19 |
> | Changed by | `0x1638...0ff7` (Gnosis Safe 3/8) |
> | Total changes | 2 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7` | `0x1638...0ff7` (Gnosis Safe 3/8) | 2026-02-19 |
> | 2 | `0x285E3b1E82f74A99D07D2aD25e159E75382bB43B` | `0x285E...B43B` | 2026-02-19 |

> **`performanceFee`**

> | Field | Value |
> |---|---|
> | Current Value | `0` |
> | Setter | `setPerformanceFee(uint16 _performanceFee)` |
> | Gated by | `management()` |
> | Tags | `CONFIG` |
> | Last changed | 2026-02-19 |
> | Changed by | `0x285E...B43B` |
> | Total changes | 1 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `0` | `0x285E...B43B` | 2026-02-19 |

> **`performanceFeeRecipient`**

> | Field | Value |
> |---|---|
> | Current Value | `0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69` |
> | Setter | `setPerformanceFeeRecipient(address _performanceFeeRecipient)` |
> | Gated by | `management()` |
> | Tags | `CONFIG` |
> | Last changed | 2026-02-19 |
> | Changed by | `0x5A74...DE69` (Accountant) |
> | Total changes | 1 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69` | `0x5A74...DE69` (Accountant) | 2026-02-19 |

> **`profitLimitRatio`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)* 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `10000` |
> | Setter | `setProfitLimitRatio(uint256 _newProfitLimitRatio)` |
> | Gated by | `management()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`profitMaxUnlockTime`**

> | Field | Value |
> |---|---|
> | Current Value | `0` |
> | Setter | `setProfitMaxUnlockTime(uint256 _profitMaxUnlockTime)` |
> | Gated by | `management()` |
> | Tags | `SUPPLY` |
> | Last changed | 2026-02-19 |
> | Changed by | `0x285E...B43B` |
> | Total changes | 1 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `0` | `0x285E...B43B` | 2026-02-19 |

---
<a id="c-0x3589b93cadb464b6e1974cc9fc0c9be698ee49a5"></a>
## > LiquityV2SPStrategy `0x3589b93CaDb464b6E1974Cc9fc0c9be698Ee49a5`

> *8 roles · 8 members · 18 functions*

> > ✅ **Proxy — immutable** (Proxy (ERC-1967), logic address is a bytecode constant; the EIP-1967 slot is informational) — impl: `0xD377919FA87120584B21279a491F82D5265A139c`

> > ⚡ **Inherited authority** [CONFIG] — via `Strategy: Liquity V2 wstETH Stability Pool` on **Yearn V3 Vault**

> 🔒 **Immutable References:** `COLL_PRICE_ORACLE()` → WSTETHPriceFeed, `COLL()` → wstETH (WstETH), `AUCTION()` → Auction, `SP()` → StabilityPool

### > 🟢 `management()`

> **Privileged write functions:**  
> **Capabilities:** ⚙️ **CONFIG** 💰 **SUPPLY**
> - `setPendingManagement(address _management)` — Step one of two to set a new address to be in charge of the strategy. Can only be called by the current `management`. The address is
> - `setKeeper(address _keeper)` — Sets a new address to be in charge of tend and reports. Can only be called by the current `management`.
> - `setEmergencyAdmin(address _emergencyAdmin)` — Sets a new address to be able to shutdown the strategy. Can only be called by the current `management`.
> - `setPerformanceFee(uint16 _performanceFee)` — Sets the performance fee to be charged on reported gains. Can only be called by the current `management`. `[CONFIG]`
> - `setPerformanceFeeRecipient(address _performanceFeeRecipient)` — Sets a new address to receive performance fees. Can only be called by the current `management`. `[CONFIG]`
> - `setProfitMaxUnlockTime(uint256 _profitMaxUnlockTime)` — Sets the time for profits to be unlocked over. Can only be called by the current `management`. `[SUPPLY]`
> - `setName(string calldata _name)` — Updates the name for the strategy. /
> - `allowDeposits()` — Allow anyone to deposit This is irreversible
> - `setMinAuctionPriceBps(uint256 _minAuctionPriceBps)` — Set the minimum acceptable auction price Setting to 0 disables the check
> - `setMaxAuctionAmount(uint256 _maxAuctionAmount)` — Set the maximum amount of collateral that can be auctioned at once
> - `setMaxGasPriceToTend(uint256 _maxGasPriceToTend)` — Set the maximum gas price for tending
> - `setBufferPercentage(uint256 _bufferPercentage)` — Set the buffer percentage for the auction starting price
> - `setDustThreshold(uint256 _dustThreshold)` — Set the dust threshold for the collateral token
> - `setAllowed(address _address)` — Allow a specific address to deposit This is irreversible
> - `sweep(ERC20 _token)` — Sweep stuck tokens Cannot sweep strategy asset or collateral token
> - `setProfitLimitRatio(uint256 _newProfitLimitRatio)` — Set the `profitLimitRatio`. Denominated in basis points. I.E. 1_000 == 10%.
> - `setLossLimitRatio(uint256 _newLossLimitRatio)` — Set the `lossLimitRatio`. Denominated in basis points. I.E. 1_000 == 10%.
> - `setDoHealthCheck(bool _doHealthCheck)` — Turns the healthcheck on and off. If turned off the next report will auto turn it back on.

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7` | [↳ Gnosis Safe 3/8](#c-0x16388463d60ffe0661cf7f1f31a7d658ac790ff7) | 🟢 LOW | — | Storage only | 3/8 signers |

> **Signers of `Gnosis Safe 3/8` (0x1638...0ff7):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x5E5D6f849Fa86c058f148E9D3f643C8F4c43f20b` | EOA | 2026-05-21 | EOA |
> | `0x5250077c42627cBd112988f32D482acC9ff40bDB` | EOA | 2026-05-21 | EOA |
> | `0xC357eE8a8DdE88Dd5a3Ea54847Adef6846A28c51` | EOA | 2026-05-21 | EOA |
> | `0xFcc3796370e1538F8cC60bec19A8be5457f2C74F` | EOA | 2026-05-21 | EOA |
> | `0xFafFb75e14faFf9f11315E44a2E54A22872c7a34` | EOA | 2026-05-21 | EOA |
> | `0x80a3887BA60F76acAb48EE4aEAd0a71A0774A8B2` | EOA | 2025-11-25 | EOA |
> | `0xB13C8f58a233607569D2F8411B912148aeC4aEe2` | EOA | 2025-01-20 | EOA |
> | `0x0Dca0FDC170baA4CA9c1dCd37Ffe01f97bCfD504` | EOA | 2025-11-25 | EOA |

> **Quorum history:**
>   - 2021-04-14: 🔴 decreased 3 → 1
>   - 2021-04-15: 🟢 increased 1 → 2
>   - 2021-07-14: 🟢 increased 2 → 3
>   - 2021-09-17: 🔴 decreased 3 → 2
>   - 2021-09-17: 🟢 increased 2 → 3

### > 🟢 `emergencyAdmin()` · 📋 operational


> **Members (1):**

> | Address | Name / Type | Granted | Source | Details |
> |---|---|---|---|---|
> | `0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0` | [↳ Gnosis Safe 4/7](#c-0xe5e2baf96198c56380ddd5e992d7d1ada0e989c0) | — | Storage only | 4/7 signers |

> **Signers of `Gnosis Safe 4/7` (0xe5e2...89c0):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x895690eC66b20c03ACC49b43d381A2D1dD423d52` | EOA | 2025-05-09 | EOA |
> | `0xd0002c648CCa8DeE2f2b8D70D542Ccde8ad6EC03` | EOA ⚠️ Hot wallet (4,075 txs) | 2025-05-09 | EOA |
> | `0x80a3887BA60F76acAb48EE4aEAd0a71A0774A8B2` | EOA | 2024-11-04 | EOA |
> | `0x2C2dc95F8C8060a7e3B354c1B9540881AEa1613C` | EOA | 2024-11-04 | EOA |
> | `0xF53D1fB2EeD22Cf1E8f7E90Da7f1CAe88344065F` | EOA | 2024-11-04 | EOA |
> | `0xB865AAf1f9f60630934739595f183C4900f65ed9` | EOA | 2024-11-04 | EOA |
> | `0x80c9aC867b2D36B7e8D74646E074c460a008C0cb` | EOA (EIP-7702 → `0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B`) | — | EOA |

> **Quorum history:**
>   - 2024-11-04: 🔴 decreased 4 → 3
>   - 2025-05-09: 🟢 increased 3 → 4

### > 🟠 `keeper()` · 📋 operational


> **Members (1):**

> | Address | Name / Type | Granted | Source | Details |
> |---|---|---|---|---|
> | `0x604e586F17cE106B64185A7a0d2c1Da5bAce711E` | [↳ yHaaSRelayer](#c-0x604e586f17ce106b64185a7a0d2c1da5bace711e) | — | Storage only |  |

### > 🟠 `performanceFeeRecipient()` · 📋 operational


> **Members (1):**

> | Address | Name / Type | Granted | Source | Details |
> |---|---|---|---|---|
> | `0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69` | [↳ Accountant](#c-0x5a74cb32d36f2f517db6f7b0a0591e09b22cde69) | — | Storage only |  |

> #### 🔧 Permissioned Parameters

> **`allowed`** *(per-asset)* 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> | Asset | Current Value |
> |---|---|
> | yBOLD (Yearn V3 Vault) `0x9F43...A3d8` | `True` |

> | Field | Value |
> |---|---|
> | Setter | `setAllowed(address _address)` |
> | Gated by | `management()` |
> | Tags | — |
> | Last changed | 2026-02-19 |
> | Changed by | `0x285E...B43B` |
> | Total changes | 1 |

> **Recent changes:**

> | # | Asset | Value | Set By | Date |
> |---|---|---|---|---|
> | 1 | yBOLD (Yearn V3 Vault) | `—` | `0x285E...B43B` | 2026-02-19 |

> **`ASSET_DUST_THRESHOLD`** 🔒 **IMMUTABLE**

> > 🔒 **Immutable** — declared as a constant in the contract source; cannot be changed without a contract upgrade. Bounds the reachable extreme of any setter that writes a related storage variable.

> | Field | Value |
> |---|---|
> | Current Value | `1000000000000000` |
> | Mutability | 🔒 immutable (constant) |
> | Tags | `IMMUTABLE` |

> **`bufferPercentage`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)* 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `1150000000000000000 (1.150000e18)` |
> | Hard cap | 🔒 `1150000000000000000 (1.150000e18)` (MIN_BUFFER_PERCENTAGE) |
> | Setter | `setBufferPercentage(uint256 _bufferPercentage)` |
> | Gated by | `management()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`doHealthCheck`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)* 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `True` |
> | Setter | `setDoHealthCheck(bool _doHealthCheck)` |
> | Gated by | `management()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`dustThreshold`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)* 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `1000000000000000` |
> | Setter | `setDustThreshold(uint256 _dustThreshold)` |
> | Gated by | `management()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`emergencyAdmin`**

> | Field | Value |
> |---|---|
> | Current Value | `0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0` |
> | Setter | `setEmergencyAdmin(address _emergencyAdmin)` |
> | Gated by | `management()` |
> | Tags | — |
> | Last changed | 2026-09-03 |
> | Changed by | `0xe5e2...89c0` (Gnosis Safe 4/7) |
> | Total changes | 2 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0` | `0xe5e2...89c0` (Gnosis Safe 4/7) | 2026-09-03 |
> | 2 | `0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7` | `0x1638...0ff7` (Gnosis Safe 3/8) | 2026-02-19 |

> **`keeper`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)* 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `0x604e586F17cE106B64185A7a0d2c1Da5bAce711E` |
> | Setter | `setKeeper(address _keeper)` |
> | Gated by | `management()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`lossLimitRatio`** ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `0` |
> | Setter | `setLossLimitRatio(uint256 _newLossLimitRatio)` |
> | Gated by | `management()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`MAX_FEE`** 🔒 **IMMUTABLE**

> > 🔒 **Immutable** — declared as a constant in the contract source; cannot be changed without a contract upgrade. Bounds the reachable extreme of any setter that writes a related storage variable.

> | Field | Value |
> |---|---|
> | Current Value | `5000` |
> | Mutability | 🔒 immutable (constant) |
> | Tags | `IMMUTABLE` |

> **`maxAuctionAmount`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)* 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `115792089237316195423570985008687907853269984665640564039457584007913129639935 (115,792,089,237,316,203,707,617,735,395,386,539,918,674,240,093,853,421,928,448.000000e18)` |
> | Setter | `setMaxAuctionAmount(uint256 _maxAuctionAmount)` |
> | Gated by | `management()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`maxGasPriceToTend`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)* 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `200000000000` |
> | Hard cap | 🔒 `50000000000` (MIN_MAX_GAS_PRICE_TO_TEND) |
> | Setter | `setMaxGasPriceToTend(uint256 _maxGasPriceToTend)` |
> | Gated by | `management()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`MIN_DUST_THRESHOLD`** 🔒 **IMMUTABLE**

> > 🔒 **Immutable** — declared as a constant in the contract source; cannot be changed without a contract upgrade. Bounds the reachable extreme of any setter that writes a related storage variable.

> | Field | Value |
> |---|---|
> | Current Value | `1000000000000000` |
> | Mutability | 🔒 immutable (constant) |
> | Tags | `IMMUTABLE` |

> **`minAuctionPriceBps`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)* 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `9500` |
> | Setter | `setMinAuctionPriceBps(uint256 _minAuctionPriceBps)` |
> | Gated by | `management()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`pendingManagement`**

> | Field | Value |
> |---|---|
> | Current Value | `0x0000000000000000000000000000000000000000` |
> | Setter | `setPendingManagement(address _management)` |
> | Gated by | `management()` |
> | Tags | — |
> | Last changed | 2026-02-19 |
> | Changed by | `0x1638...0ff7` (Gnosis Safe 3/8) |
> | Total changes | 2 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7` | `0x1638...0ff7` (Gnosis Safe 3/8) | 2026-02-19 |
> | 2 | `0x285E3b1E82f74A99D07D2aD25e159E75382bB43B` | `0x285E...B43B` | 2026-02-19 |

> **`performanceFee`**

> | Field | Value |
> |---|---|
> | Current Value | `0` |
> | Setter | `setPerformanceFee(uint16 _performanceFee)` |
> | Gated by | `management()` |
> | Tags | `CONFIG` |
> | Last changed | 2026-02-19 |
> | Changed by | `0x285E...B43B` |
> | Total changes | 1 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `0` | `0x285E...B43B` | 2026-02-19 |

> **`performanceFeeRecipient`**

> | Field | Value |
> |---|---|
> | Current Value | `0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69` |
> | Setter | `setPerformanceFeeRecipient(address _performanceFeeRecipient)` |
> | Gated by | `management()` |
> | Tags | `CONFIG` |
> | Last changed | 2026-02-19 |
> | Changed by | `0x5A74...DE69` (Accountant) |
> | Total changes | 1 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69` | `0x5A74...DE69` (Accountant) | 2026-02-19 |

> **`profitLimitRatio`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)* 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `10000` |
> | Setter | `setProfitLimitRatio(uint256 _newProfitLimitRatio)` |
> | Gated by | `management()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`profitMaxUnlockTime`**

> | Field | Value |
> |---|---|
> | Current Value | `0` |
> | Setter | `setProfitMaxUnlockTime(uint256 _profitMaxUnlockTime)` |
> | Gated by | `management()` |
> | Tags | `SUPPLY` |
> | Last changed | 2026-02-19 |
> | Changed by | `0x285E...B43B` |
> | Total changes | 1 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `0` | `0x285E...B43B` | 2026-02-19 |

---
<a id="c-0x6ed566b76838a08d04cbd6323231b08a2ec69005"></a>
## > LiquityV2SPStrategy `0x6ED566B76838A08d04cBd6323231B08a2eC69005`

> *8 roles · 8 members · 18 functions*

> > ✅ **Proxy — immutable** (Proxy (ERC-1967), logic address is a bytecode constant; the EIP-1967 slot is informational) — impl: `0xD377919FA87120584B21279a491F82D5265A139c`

> > ⚡ **Inherited authority** [CONFIG] — via `Strategy: Liquity V2 rETH Stability Pool` on **Yearn V3 Vault**

> 🔒 **Immutable References:** `COLL_PRICE_ORACLE()` → RETHPriceFeed, `COLL()` → rETH (RocketTokenRETH), `AUCTION()` → Auction, `SP()` → StabilityPool

### > 🟢 `management()`

> **Privileged write functions:**  
> **Capabilities:** ⚙️ **CONFIG** 💰 **SUPPLY**
> - `setPendingManagement(address _management)` — Step one of two to set a new address to be in charge of the strategy. Can only be called by the current `management`. The address is
> - `setKeeper(address _keeper)` — Sets a new address to be in charge of tend and reports. Can only be called by the current `management`.
> - `setEmergencyAdmin(address _emergencyAdmin)` — Sets a new address to be able to shutdown the strategy. Can only be called by the current `management`.
> - `setPerformanceFee(uint16 _performanceFee)` — Sets the performance fee to be charged on reported gains. Can only be called by the current `management`. `[CONFIG]`
> - `setPerformanceFeeRecipient(address _performanceFeeRecipient)` — Sets a new address to receive performance fees. Can only be called by the current `management`. `[CONFIG]`
> - `setProfitMaxUnlockTime(uint256 _profitMaxUnlockTime)` — Sets the time for profits to be unlocked over. Can only be called by the current `management`. `[SUPPLY]`
> - `setName(string calldata _name)` — Updates the name for the strategy. /
> - `allowDeposits()` — Allow anyone to deposit This is irreversible
> - `setMinAuctionPriceBps(uint256 _minAuctionPriceBps)` — Set the minimum acceptable auction price Setting to 0 disables the check
> - `setMaxAuctionAmount(uint256 _maxAuctionAmount)` — Set the maximum amount of collateral that can be auctioned at once
> - `setMaxGasPriceToTend(uint256 _maxGasPriceToTend)` — Set the maximum gas price for tending
> - `setBufferPercentage(uint256 _bufferPercentage)` — Set the buffer percentage for the auction starting price
> - `setDustThreshold(uint256 _dustThreshold)` — Set the dust threshold for the collateral token
> - `setAllowed(address _address)` — Allow a specific address to deposit This is irreversible
> - `sweep(ERC20 _token)` — Sweep stuck tokens Cannot sweep strategy asset or collateral token
> - `setProfitLimitRatio(uint256 _newProfitLimitRatio)` — Set the `profitLimitRatio`. Denominated in basis points. I.E. 1_000 == 10%.
> - `setLossLimitRatio(uint256 _newLossLimitRatio)` — Set the `lossLimitRatio`. Denominated in basis points. I.E. 1_000 == 10%.
> - `setDoHealthCheck(bool _doHealthCheck)` — Turns the healthcheck on and off. If turned off the next report will auto turn it back on.

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7` | [↳ Gnosis Safe 3/8](#c-0x16388463d60ffe0661cf7f1f31a7d658ac790ff7) | 🟢 LOW | — | Storage only | 3/8 signers |

> **Signers of `Gnosis Safe 3/8` (0x1638...0ff7):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x5E5D6f849Fa86c058f148E9D3f643C8F4c43f20b` | EOA | 2026-05-21 | EOA |
> | `0x5250077c42627cBd112988f32D482acC9ff40bDB` | EOA | 2026-05-21 | EOA |
> | `0xC357eE8a8DdE88Dd5a3Ea54847Adef6846A28c51` | EOA | 2026-05-21 | EOA |
> | `0xFcc3796370e1538F8cC60bec19A8be5457f2C74F` | EOA | 2026-05-21 | EOA |
> | `0xFafFb75e14faFf9f11315E44a2E54A22872c7a34` | EOA | 2026-05-21 | EOA |
> | `0x80a3887BA60F76acAb48EE4aEAd0a71A0774A8B2` | EOA | 2025-11-25 | EOA |
> | `0xB13C8f58a233607569D2F8411B912148aeC4aEe2` | EOA | 2025-01-20 | EOA |
> | `0x0Dca0FDC170baA4CA9c1dCd37Ffe01f97bCfD504` | EOA | 2025-11-25 | EOA |

> **Quorum history:**
>   - 2021-04-14: 🔴 decreased 3 → 1
>   - 2021-04-15: 🟢 increased 1 → 2
>   - 2021-07-14: 🟢 increased 2 → 3
>   - 2021-09-17: 🔴 decreased 3 → 2
>   - 2021-09-17: 🟢 increased 2 → 3

### > 🟢 `emergencyAdmin()` · 📋 operational


> **Members (1):**

> | Address | Name / Type | Granted | Source | Details |
> |---|---|---|---|---|
> | `0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0` | [↳ Gnosis Safe 4/7](#c-0xe5e2baf96198c56380ddd5e992d7d1ada0e989c0) | — | Storage only | 4/7 signers |

> **Signers of `Gnosis Safe 4/7` (0xe5e2...89c0):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x895690eC66b20c03ACC49b43d381A2D1dD423d52` | EOA | 2025-05-09 | EOA |
> | `0xd0002c648CCa8DeE2f2b8D70D542Ccde8ad6EC03` | EOA ⚠️ Hot wallet (4,075 txs) | 2025-05-09 | EOA |
> | `0x80a3887BA60F76acAb48EE4aEAd0a71A0774A8B2` | EOA | 2024-11-04 | EOA |
> | `0x2C2dc95F8C8060a7e3B354c1B9540881AEa1613C` | EOA | 2024-11-04 | EOA |
> | `0xF53D1fB2EeD22Cf1E8f7E90Da7f1CAe88344065F` | EOA | 2024-11-04 | EOA |
> | `0xB865AAf1f9f60630934739595f183C4900f65ed9` | EOA | 2024-11-04 | EOA |
> | `0x80c9aC867b2D36B7e8D74646E074c460a008C0cb` | EOA (EIP-7702 → `0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B`) | — | EOA |

> **Quorum history:**
>   - 2024-11-04: 🔴 decreased 4 → 3
>   - 2025-05-09: 🟢 increased 3 → 4

### > 🟠 `keeper()` · 📋 operational


> **Members (1):**

> | Address | Name / Type | Granted | Source | Details |
> |---|---|---|---|---|
> | `0x604e586F17cE106B64185A7a0d2c1Da5bAce711E` | [↳ yHaaSRelayer](#c-0x604e586f17ce106b64185a7a0d2c1da5bace711e) | — | Storage only |  |

### > 🟠 `performanceFeeRecipient()` · 📋 operational


> **Members (1):**

> | Address | Name / Type | Granted | Source | Details |
> |---|---|---|---|---|
> | `0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69` | [↳ Accountant](#c-0x5a74cb32d36f2f517db6f7b0a0591e09b22cde69) | — | Storage only |  |

> #### 🔧 Permissioned Parameters

> **`allowed`** *(per-asset)* 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> | Asset | Current Value |
> |---|---|
> | yBOLD (Yearn V3 Vault) `0x9F43...A3d8` | `True` |

> | Field | Value |
> |---|---|
> | Setter | `setAllowed(address _address)` |
> | Gated by | `management()` |
> | Tags | — |
> | Last changed | 2026-02-19 |
> | Changed by | `0x285E...B43B` |
> | Total changes | 1 |

> **Recent changes:**

> | # | Asset | Value | Set By | Date |
> |---|---|---|---|---|
> | 1 | yBOLD (Yearn V3 Vault) | `—` | `0x285E...B43B` | 2026-02-19 |

> **`ASSET_DUST_THRESHOLD`** 🔒 **IMMUTABLE**

> > 🔒 **Immutable** — declared as a constant in the contract source; cannot be changed without a contract upgrade. Bounds the reachable extreme of any setter that writes a related storage variable.

> | Field | Value |
> |---|---|
> | Current Value | `1000000000000000` |
> | Mutability | 🔒 immutable (constant) |
> | Tags | `IMMUTABLE` |

> **`bufferPercentage`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)* 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `1150000000000000000 (1.150000e18)` |
> | Hard cap | 🔒 `1150000000000000000 (1.150000e18)` (MIN_BUFFER_PERCENTAGE) |
> | Setter | `setBufferPercentage(uint256 _bufferPercentage)` |
> | Gated by | `management()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`doHealthCheck`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)* 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `True` |
> | Setter | `setDoHealthCheck(bool _doHealthCheck)` |
> | Gated by | `management()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`dustThreshold`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)* 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `1000000000000000` |
> | Setter | `setDustThreshold(uint256 _dustThreshold)` |
> | Gated by | `management()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`emergencyAdmin`**

> | Field | Value |
> |---|---|
> | Current Value | `0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0` |
> | Setter | `setEmergencyAdmin(address _emergencyAdmin)` |
> | Gated by | `management()` |
> | Tags | — |
> | Last changed | 2026-09-03 |
> | Changed by | `0xe5e2...89c0` (Gnosis Safe 4/7) |
> | Total changes | 2 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0` | `0xe5e2...89c0` (Gnosis Safe 4/7) | 2026-09-03 |
> | 2 | `0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7` | `0x1638...0ff7` (Gnosis Safe 3/8) | 2026-02-19 |

> **`keeper`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)* 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `0x604e586F17cE106B64185A7a0d2c1Da5bAce711E` |
> | Setter | `setKeeper(address _keeper)` |
> | Gated by | `management()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`lossLimitRatio`** ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `0` |
> | Setter | `setLossLimitRatio(uint256 _newLossLimitRatio)` |
> | Gated by | `management()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`MAX_FEE`** 🔒 **IMMUTABLE**

> > 🔒 **Immutable** — declared as a constant in the contract source; cannot be changed without a contract upgrade. Bounds the reachable extreme of any setter that writes a related storage variable.

> | Field | Value |
> |---|---|
> | Current Value | `5000` |
> | Mutability | 🔒 immutable (constant) |
> | Tags | `IMMUTABLE` |

> **`maxAuctionAmount`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)* 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `115792089237316195423570985008687907853269984665640564039457584007913129639935 (115,792,089,237,316,203,707,617,735,395,386,539,918,674,240,093,853,421,928,448.000000e18)` |
> | Setter | `setMaxAuctionAmount(uint256 _maxAuctionAmount)` |
> | Gated by | `management()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`maxGasPriceToTend`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)* 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `200000000000` |
> | Hard cap | 🔒 `50000000000` (MIN_MAX_GAS_PRICE_TO_TEND) |
> | Setter | `setMaxGasPriceToTend(uint256 _maxGasPriceToTend)` |
> | Gated by | `management()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`MIN_DUST_THRESHOLD`** 🔒 **IMMUTABLE**

> > 🔒 **Immutable** — declared as a constant in the contract source; cannot be changed without a contract upgrade. Bounds the reachable extreme of any setter that writes a related storage variable.

> | Field | Value |
> |---|---|
> | Current Value | `1000000000000000` |
> | Mutability | 🔒 immutable (constant) |
> | Tags | `IMMUTABLE` |

> **`minAuctionPriceBps`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)* 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `9500` |
> | Setter | `setMinAuctionPriceBps(uint256 _minAuctionPriceBps)` |
> | Gated by | `management()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`pendingManagement`**

> | Field | Value |
> |---|---|
> | Current Value | `0x0000000000000000000000000000000000000000` |
> | Setter | `setPendingManagement(address _management)` |
> | Gated by | `management()` |
> | Tags | — |
> | Last changed | 2026-02-19 |
> | Changed by | `0x1638...0ff7` (Gnosis Safe 3/8) |
> | Total changes | 2 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7` | `0x1638...0ff7` (Gnosis Safe 3/8) | 2026-02-19 |
> | 2 | `0x285E3b1E82f74A99D07D2aD25e159E75382bB43B` | `0x285E...B43B` | 2026-02-19 |

> **`performanceFee`**

> | Field | Value |
> |---|---|
> | Current Value | `0` |
> | Setter | `setPerformanceFee(uint16 _performanceFee)` |
> | Gated by | `management()` |
> | Tags | `CONFIG` |
> | Last changed | 2026-02-19 |
> | Changed by | `0x285E...B43B` |
> | Total changes | 1 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `0` | `0x285E...B43B` | 2026-02-19 |

> **`performanceFeeRecipient`**

> | Field | Value |
> |---|---|
> | Current Value | `0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69` |
> | Setter | `setPerformanceFeeRecipient(address _performanceFeeRecipient)` |
> | Gated by | `management()` |
> | Tags | `CONFIG` |
> | Last changed | 2026-02-19 |
> | Changed by | `0x5A74...DE69` (Accountant) |
> | Total changes | 1 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69` | `0x5A74...DE69` (Accountant) | 2026-02-19 |

> **`profitLimitRatio`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)* 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `10000` |
> | Setter | `setProfitLimitRatio(uint256 _newProfitLimitRatio)` |
> | Gated by | `management()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`profitMaxUnlockTime`**

> | Field | Value |
> |---|---|
> | Current Value | `0` |
> | Setter | `setProfitMaxUnlockTime(uint256 _profitMaxUnlockTime)` |
> | Gated by | `management()` |
> | Tags | `SUPPLY` |
> | Last changed | 2026-02-19 |
> | Changed by | `0x285E...B43B` |
> | Total changes | 1 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `0` | `0x285E...B43B` | 2026-02-19 |

---
<a id="c-0xf8f60bf9456a6e0141149db2dd6f02c60da5779b"></a>
## > TimelockExecutor `0xF8f60BF9456A6e0141149Db2DD6f02C60da5779B`

> *3 roles · 3 members · 5 functions*

> > ⚡ **Inherited authority** [CONFIG] — via `EXECUTOR_ROLE` on **TimelockController**

### > 🟢 `TIMELOCK()` · 🏛️ governance


> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x88Ba032be87d5EF1fbE87336B7090767F367BF73` | [↳ TimelockController (7d)](#c-0x88ba032be87d5ef1fbe87336b7090767f367bf73) | 🟢 LOW | — | Storage only | 7d delay (⚠ changed 2x) |


> **Delay history for `TimelockController (7d)` (0x88Ba...BF73):** 1d → 7d → 7d

### > 🔴 `executor()` · 🏛️ governance

> **Privileged write functions:**
> - `execute(address target, uint256 value, bytes calldata payload, bytes32 predecessor, bytes32 salt)`
> - `executeBatch(address[] calldata targets, uint256[] calldata values, bytes[] calldata payloads, bytes32 predecessor, bytes32 salt)`

> **Members (2):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7` | [↳ Gnosis Safe 3/8](#c-0x16388463d60ffe0661cf7f1f31a7d658ac790ff7) | 🟢 LOW | — | Storage+Events | 3/8 signers |
> | `0x1b5f15DCb82d25f91c65b53CEe151E8b9fBdD271` | EOA | 🔴 CRITICAL | — | Storage+Events | ⚠️ Single private key |

> **Signers of `Gnosis Safe 3/8` (0x1638...0ff7):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x5E5D6f849Fa86c058f148E9D3f643C8F4c43f20b` | EOA | 2026-05-21 | EOA |
> | `0x5250077c42627cBd112988f32D482acC9ff40bDB` | EOA | 2026-05-21 | EOA |
> | `0xC357eE8a8DdE88Dd5a3Ea54847Adef6846A28c51` | EOA | 2026-05-21 | EOA |
> | `0xFcc3796370e1538F8cC60bec19A8be5457f2C74F` | EOA | 2026-05-21 | EOA |
> | `0xFafFb75e14faFf9f11315E44a2E54A22872c7a34` | EOA | 2026-05-21 | EOA |
> | `0x80a3887BA60F76acAb48EE4aEAd0a71A0774A8B2` | EOA | 2025-11-25 | EOA |
> | `0xB13C8f58a233607569D2F8411B912148aeC4aEe2` | EOA | 2025-01-20 | EOA |
> | `0x0Dca0FDC170baA4CA9c1dCd37Ffe01f97bCfD504` | EOA | 2025-11-25 | EOA |

> **Quorum history:**
>   - 2021-04-14: 🔴 decreased 3 → 1
>   - 2021-04-15: 🟢 increased 1 → 2
>   - 2021-07-14: 🟢 increased 2 → 3
>   - 2021-09-17: 🔴 decreased 3 → 2
>   - 2021-09-17: 🟢 increased 2 → 3

### > 🟢 `governance()`

> **Privileged write functions:**
> - `addExecutor(address executor)`
> - `removeExecutor(address executor)`
> - `transferGovernance(address _newGovernance)` — Sets a new address as the governance of the contract. Throws if the caller is not current governance.

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7` | [↳ Gnosis Safe 3/8](#c-0x16388463d60ffe0661cf7f1f31a7d658ac790ff7) | 🟢 LOW | — | Storage only | 3/8 signers |

> **Signers of `Gnosis Safe 3/8` (0x1638...0ff7):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x5E5D6f849Fa86c058f148E9D3f643C8F4c43f20b` | EOA | 2026-05-21 | EOA |
> | `0x5250077c42627cBd112988f32D482acC9ff40bDB` | EOA | 2026-05-21 | EOA |
> | `0xC357eE8a8DdE88Dd5a3Ea54847Adef6846A28c51` | EOA | 2026-05-21 | EOA |
> | `0xFcc3796370e1538F8cC60bec19A8be5457f2C74F` | EOA | 2026-05-21 | EOA |
> | `0xFafFb75e14faFf9f11315E44a2E54A22872c7a34` | EOA | 2026-05-21 | EOA |
> | `0x80a3887BA60F76acAb48EE4aEAd0a71A0774A8B2` | EOA | 2025-11-25 | EOA |
> | `0xB13C8f58a233607569D2F8411B912148aeC4aEe2` | EOA | 2025-01-20 | EOA |
> | `0x0Dca0FDC170baA4CA9c1dCd37Ffe01f97bCfD504` | EOA | 2025-11-25 | EOA |

> **Quorum history:**
>   - 2021-04-14: 🔴 decreased 3 → 1
>   - 2021-04-15: 🟢 increased 1 → 2
>   - 2021-07-14: 🟢 increased 2 → 3
>   - 2021-09-17: 🔴 decreased 3 → 2
>   - 2021-09-17: 🟢 increased 2 → 3

---
## ⚡ Authority Concentration

The following addresses hold permissions across multiple contracts or roles in this dependency stack. Concentration of authority increases systemic risk — a single compromised key or colluding multisig can affect multiple systems.

### 🟢 `0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7` — Gnosis Safe 3/8
Controls **22 role(s)** across **11 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| LV2SPStakerStrategy `0x2334...91cD` | `management()` | `setPendingManagement(address _management)`, `setKeeper(address _keeper)`, `setEmergencyAdmin(address _emergencyAdmin)`, `setPerformanceFee(uint16 _performanceFee)` +6 more | — |
| Accountant `0x53ac...c6fa` | `futureFeeManager()` | `acceptFeeManager()` | — |
| Accountant `0x53ac...c6fa` | `feeManager()` | `updateDefaultConfig(uint16 defaultMaxGain, uint16 defaultMaxLoss)`, `setCustomConfig(address vault, uint16 customMaxGain, uint16 customMaxLoss)`, `removeCustomConfig(address vault)`, `turnOffHealthCheck(address vault, address strategy)` +4 more | — |
| yHaaSRelayer `0x604e...711E` | `owner()` | `harvestStrategy(address _strategyAddress)`, `tendStrategy(address _strategyAddress)`, `processReport(address _vaultAddress, address _strategyAddress)`, `forwardCall(address debtAllocatorAddress, bytes memory data)` +2 more | — |
| yHaaSRelayer `0x604e...711E` | `governance()` | `harvestStrategy(address _strategyAddress)`, `tendStrategy(address _strategyAddress)`, `processReport(address _vaultAddress, address _strategyAddress)`, `forwardCall(address debtAllocatorAddress, bytes memory data)` +3 more | — |
| Accountant `0x5A74...DE69` | `futureFeeManager()` | `acceptFeeManager()` | — |
| Accountant `0x5A74...DE69` | `feeManager()` | `updateDefaultConfig(uint16 defaultManagement, uint16 defaultPerformance, uint16 defaultRefund, uint16 defaultMaxFee, uint16 defaultMaxGain, uint16 defaultMaxLoss)`, `setCustomConfig(address vault, uint16 customManagement, uint16 customPerformance, uint16 customRefund, uint16 customMaxFee, uint16 customMaxGain, uint16 customMaxLoss)`, `removeCustomConfig(address vault)`, `turnOffHealthCheck(address vault, address strategy)` +5 more | — |
| Yearn V3 Vault `0x9F43...A3d8` | `REVOKE_STRATEGY_MANAGER` | `revoke_strategy(address strategy)` | — |
| Yearn V3 Vault `0x9F43...A3d8` | `QUEUE_MANAGER` | `set_default_queue(address[] new_default_queue)`, `set_use_default_queue(bool use_default_queue)` | — |
| Yearn V3 Vault `0x9F43...A3d8` | `REPORTING_MANAGER` | `process_report(address strategy)` | — |
| Yearn V3 Vault `0x9F43...A3d8` | `DEBT_MANAGER` | `set_auto_allocate(bool auto_allocate)` | — |
| Yearn V3 Vault `0x9F43...A3d8` | `DEPOSIT_LIMIT_MANAGER` | `set_deposit_limit(uint256 deposit_limit)`, `set_deposit_limit_module(address deposit_limit_module)` | — |
| Yearn V3 Vault `0x9F43...A3d8` | `PROFIT_UNLOCK_MANAGER` | `setProfitMaxUnlockTime(uint256 new_profit_max_unlock_time)` | — |
| Yearn V3 Vault `0x9F43...A3d8` | `DEBT_PURCHASER` | `buy_debt(address strategy, uint256 amount)` | — |
| Yearn V3 Vault `0x9F43...A3d8` | `EMERGENCY_MANAGER` | `shutdown_vault()` | — |
| TimelockController `0x88Ba...BF73` | `CANCELLER_ROLE` | `cancel(bytes32 id)` | 2026-03-12 |
| DebtAllocator `0x1e9e...8671` | `governance()` | `transferGovernance(address _newGovernance)`, `setMinimumChange(address _vault, uint256 _minimumChange)`, `setPaused(address _vault, bool _status)`, `setMinimumWait(uint256 _minimumWait)` +5 more | — |
| LiquityV2SPStrategy `0xc5e7...5b75` | `management()` | `setPendingManagement(address _management)`, `setKeeper(address _keeper)`, `setEmergencyAdmin(address _emergencyAdmin)`, `setPerformanceFee(uint16 _performanceFee)` +14 more | — |
| LiquityV2SPStrategy `0x3589...49a5` | `management()` | `setPendingManagement(address _management)`, `setKeeper(address _keeper)`, `setEmergencyAdmin(address _emergencyAdmin)`, `setPerformanceFee(uint16 _performanceFee)` +14 more | — |
| LiquityV2SPStrategy `0x6ED5...9005` | `management()` | `setPendingManagement(address _management)`, `setKeeper(address _keeper)`, `setEmergencyAdmin(address _emergencyAdmin)`, `setPerformanceFee(uint16 _performanceFee)` +14 more | — |
| TimelockExecutor `0xF8f6...779B` | `governance()` | `addExecutor(address executor)`, `removeExecutor(address executor)`, `transferGovernance(address _newGovernance)` | — |
| TimelockExecutor `0xF8f6...779B` | `executor()` | `execute(address target, uint256 value, bytes calldata payload, bytes32 predecessor, bytes32 salt)`, `executeBatch(address[] calldata targets, uint256[] calldata values, bytes[] calldata payloads, bytes32 predecessor, bytes32 salt)` | — |

### 🟢 `0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52` — Gnosis Safe 6/9
Controls **15 role(s)** across **2 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| Yearn V3 Vault `0x9F43...A3d8` | `REVOKE_STRATEGY_MANAGER` | `revoke_strategy(address strategy)` | — |
| Yearn V3 Vault `0x9F43...A3d8` | `FORCE_REVOKE_MANAGER` | `force_revoke_strategy(address strategy)` | — |
| Yearn V3 Vault `0x9F43...A3d8` | `QUEUE_MANAGER` | `set_default_queue(address[] new_default_queue)`, `set_use_default_queue(bool use_default_queue)` | — |
| Yearn V3 Vault `0x9F43...A3d8` | `REPORTING_MANAGER` | `process_report(address strategy)` | — |
| Yearn V3 Vault `0x9F43...A3d8` | `DEBT_MANAGER` | `set_auto_allocate(bool auto_allocate)` | — |
| Yearn V3 Vault `0x9F43...A3d8` | `MAX_DEBT_MANAGER` | `update_max_debt_for_strategy(address strategy, uint256 new_max_debt)` | — |
| Yearn V3 Vault `0x9F43...A3d8` | `DEPOSIT_LIMIT_MANAGER` | `set_deposit_limit(uint256 deposit_limit)`, `set_deposit_limit_module(address deposit_limit_module)` | — |
| Yearn V3 Vault `0x9F43...A3d8` | `WITHDRAW_LIMIT_MANAGER` | `set_withdraw_limit_module(address withdraw_limit_module)` | — |
| Yearn V3 Vault `0x9F43...A3d8` | `MINIMUM_IDLE_MANAGER` | `set_minimum_total_idle(uint256 minimum_total_idle)` | — |
| Yearn V3 Vault `0x9F43...A3d8` | `PROFIT_UNLOCK_MANAGER` | `setProfitMaxUnlockTime(uint256 new_profit_max_unlock_time)` | — |
| Yearn V3 Vault `0x9F43...A3d8` | `DEBT_PURCHASER` | `buy_debt(address strategy, uint256 amount)` | — |
| Yearn V3 Vault `0x9F43...A3d8` | `EMERGENCY_MANAGER` | `shutdown_vault()` | — |
| TimelockController `0x88Ba...BF73` | `EXECUTOR_ROLE` | `execute(address target, uint256 value, bytes calldata payload, bytes32 predecessor, bytes32 salt)`, `executeBatch(address[] calldata targets, uint256[] calldata values, bytes[] calldata payloads, bytes32 predecessor, bytes32 salt)` | 2026-01-15 |
| TimelockController `0x88Ba...BF73` | `PROPOSER_ROLE` | `schedule(address target, uint256 value, bytes calldata data, bytes32 predecessor, bytes32 salt, uint256 delay)`, `scheduleBatch(address[] calldata targets, uint256[] calldata values, bytes[] calldata payloads, bytes32 predecessor, bytes32 salt, uint256 delay)` | 2026-01-15 |
| TimelockController `0x88Ba...BF73` | `CANCELLER_ROLE` | `cancel(bytes32 id)` | 2026-01-15 |

### 🟢 `0x88Ba032be87d5EF1fbE87336B7090767F367BF73` — TimelockController (7d)
Controls **6 role(s)** across **2 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| Yearn V3 Vault `0x9F43...A3d8` | `ADD_STRATEGY_MANAGER` | `add_strategy(address new_strategy)` | — |
| Yearn V3 Vault `0x9F43...A3d8` | `REVOKE_STRATEGY_MANAGER` | `revoke_strategy(address strategy)` | — |
| Yearn V3 Vault `0x9F43...A3d8` | `FORCE_REVOKE_MANAGER` | `force_revoke_strategy(address strategy)` | — |
| Yearn V3 Vault `0x9F43...A3d8` | `ACCOUNTANT_MANAGER` | `set_accountant(address new_accountant)` | — |
| Yearn V3 Vault `0x9F43...A3d8` | `MAX_DEBT_MANAGER` | `update_max_debt_for_strategy(address strategy, uint256 new_max_debt)` | — |
| RoleManager `0xb3bd...9a41` | `governance()` | `transferGovernance(address _newGovernance)`, `removeRoles(address[] calldata _vaults, address _holder, uint256 _role)`, `setPositionRoles(bytes32 _position, uint256 _newRoles)`, `setPositionHolder(bytes32 _position, address _newHolder)` +1 more | — |

### 🟢 `0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0` — Gnosis Safe 4/7
Controls **3 role(s)** across **1 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| Yearn V3 Vault `0x9F43...A3d8` | `DEBT_MANAGER` | `set_auto_allocate(bool auto_allocate)` | — |
| Yearn V3 Vault `0x9F43...A3d8` | `MAX_DEBT_MANAGER` | `update_max_debt_for_strategy(address strategy, uint256 new_max_debt)` | — |
| Yearn V3 Vault `0x9F43...A3d8` | `EMERGENCY_MANAGER` | `shutdown_vault()` | — |

### 🟠 `0x1e9eB053228B1156831759401dE0E115356b8671` — DebtAllocator
Controls **2 role(s)** across **1 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| Yearn V3 Vault `0x9F43...A3d8` | `REPORTING_MANAGER` | `process_report(address strategy)` | — |
| Yearn V3 Vault `0x9F43...A3d8` | `DEBT_MANAGER` | `set_auto_allocate(bool auto_allocate)` | — |


---
## ⛔ Sanctions Screening

| Source | Status |
|---|---|
| OFAC SDN | ✅ OFAC SDN screened (124 ETH addresses, cache: 2026-09-13) |
| Chainalysis | ✅ Chainalysis screened |
| **Result** | 55 addresses screened · ✅ 0 flagged |

---
## EOA Exposure Summary

The following roles are held by EOAs:

- **TimelockExecutor** → `executor()` held by EOA `0x1b5f15DCb82d25f91c65b53CEe151E8b9fBdD271`
  Functions: `execute(address target, uint256 value, bytes calldata payload, bytes32 predecessor, bytes32 salt)`, `executeBatch(address[] calldata targets, uint256[] calldata values, bytes[] calldata payloads, bytes32 predecessor, bytes32 salt)`

---
## ✅ Scan Integrity

No issues detected. All block ranges covered, source and ABI resolved for all contracts.
