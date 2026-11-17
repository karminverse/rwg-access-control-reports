# Trustfall — Access Control Report — f(x) USD Saving (fxSAVE)

| Field | Value |
|---|---|
| Contract | `0x7743e50F534a7f9F1791DdE7dCD89F7783Eefc39` |
| Token | f(x) USD Saving (fxSAVE) |
| Name | SavingFxUSD |
| Chain | Ethereum |
| Proxy Status | ⚠️ **YES** — TransparentUpgradeable (upgradable) → `0xE4031e271809d20074E4bef1caeEfEc5f710e8A6` |
| OZ AccessControl | ✅ Yes |
| Ownable | ❌ No |
| Pausable | — |
| ERC-4626 Vault | ✅ Underlying: `0x65C9A641afCEB9C0E6034e558A319488FA0FA3be` |
| Control Surface | ⚠️ Hybrid — 5 off-chain dependencies (backing, governance, compliance, oracle) |
| Scan Integrity | ✅ No issues detected |
| Report Date | 2026-11-15 20:57 UTC |

### Surface Summary

| Field | Value |
|---|---:|
| Contracts | 20 |
| Role slots | 82 |
| Privileged Fns | 87 |
| EOA Holders | 5 ⚠️ |
| Critical Roles | 13 ⚠️ |

## Changes Since Last Scan

> Comparing **2026-11-15T20:30:46Z** (block 26422743) → **2026-11-15T20:55:28Z** (block 26422861).

### Oracle surface
- 🔮 **11. fxSP's USDC in the Aave strategy** changed: `31,003,809 USDC` → `31,003,868 USDC`


## 📋 Protocol Context

> *From protocol profile: f(x) Protocol v2 (AladdinDAO) / fxSAVE (ERC-4626 savings vault over the f(x) Stability Pool (fxSP), staked in a gauge through a Convex vault)*

<details>
<summary><strong>Architecture</strong></summary>

- **What fxSAVE is:** fxSAVE 0x7743e50F534a7f9F1791DdE7dCD89F7783Eefc39 (SavingFxUSD) is an ERC-4626 savings vault of f(x) Protocol v2. Its asset is fxSP 0x65C9A641afCEB9C0E6034e558A319488FA0FA3be, the share token of the f(x) Stability Pool, which holds fxUSD and USDC. A holder deposits fxSP and receives fxSAVE shares; fxSAVE stakes the fxSP and adds the rewards it earns, so one share is worth a growing amount of fxSP: 1.11 to 1.12 fxSP from 1 October to 15 November 2026. Morpho Blue 0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb, a lending market outside f(x), held about 47 percent of the fxSAVE supply as collateral on 15 November 2026 (30 to 48 percent in daily readings since 1 October).

- **The Stability Pool:** fxUSD is f(x)'s stablecoin, minted as debt in its lending pools. fxSP (FxUSDBasePool) takes deposits of fxUSD, counted at 1.00, and of USDC, counted at the Chainlink USDC/USD price, and mints pool shares pro rata; deposits stop while USDC reads below 0.995. The pool is the liquidator of f(x)'s lending pools: a rebalance or liquidate call spends the pool's fxUSD, and its USDC when the fxUSD runs short, to repay a borrower's debt, and the caller pays the pool back at par and takes the collateral. fxSP keeps its USDC on hand or in an Aave V3 strategy 0xd023Aac0e2D46c93d4c6e8e2A449bF2d4687804f, from which a redeem pulls it back while Aave has unborrowed USDC. The strategy held less than 20 USDC from 1 October to 14 November 2026; on 14 and 15 November Safe 0x26B2 moved 31 million USDC into it, about 55 percent of the pool's assets. USDC, the strategy included, was 0 to 20 percent of the pool's assets in October 2026 and 2 to 80 percent from 1 to 15 November 2026; the rest was fxUSD.

- **Where the fxSP sits:** fxSAVE's fxSP is staked in the fxSP gauge 0xEd92dDe3214c24Ae04F5f96927E3bE8f8DbC3289, f(x)'s staking contract for fxSP, except idle deposits below a threshold of 100 fxSP. fxSAVE deposits into the gauge directly and the stake is credited to a vault 0x4bFc5292DA18e32ED2354350e07e417cE4796f9C that Convex, an outside protocol that pools veFXN (locked FXN, f(x)'s governance token), created for fxSAVE and that fxSAVE owns: a minimal proxy clone, pool 36 in Convex's registry. Withdrawals go through that vault. fxSAVE held 90 to 98 percent of all fxSP from 1 October to 15 November 2026, 97 percent at the median, while its share supply fell from about 76 million in mid October to about 49 million on 15 November 2026.

- **Getting in:** deposit and mint take fxSP; depositGauge takes fxSP that is already staked in the gauge. The f(x) router 0x33636D49FbefBE798e15e7F356E8DBef543CC708 offers routes that start from fxUSD or USDC in one transaction.

- **Leaving at once:** redeem and withdraw burn the shares, withdraw the fxSP from the gauge through the Convex vault and pay fxSP to the receiver in the same transaction. From there fxSP pays out fxUSD and USDC pro rata: instantRedeem pays at once less a 1 percent fee that stays in the pool, and requestRedeem followed by redeem pays in full after a 1 hour cooldown. Holders of fxSP's fee waiver role (NO_INSTANT_REDEEM_FEE_ROLE) redeem at once with no fee.

- **Leaving through a request:** requestRedeem on fxSAVE burns the shares, moves the fxSP into a holding contract of the owner's own (a LockedFxSaveProxy, created on first use) and files the fxSP redeem request from it. After the cooldown, claim pays the fxUSD and USDC to a receiver the owner names. claimFor does the same for a named owner; the router, which holds CLAIM_FOR_ROLE, calls it for users who exit through it.

- **Share price and nav:** convertToAssets divides the fxSP that fxSAVE holds, idle and staked, by the share supply. fxSP counts its own assets with fxUSD at 1.00 and USDC at the Chainlink price. nav(), the USD value per share, instead prices the fxUSD with FxUSDPriceOracle 0x3eC677Ba393f2257ED0E1d37aA8442EB7F0953Fa: the exponential moving average (EMA) price of the Curve fxUSD/USDC pool 0x5018BE882DccE5E3F2f3B0913AE2096B9b3fB61f times Chainlink USDC/USD. fxSAVE.nav() multiplies fxSP's nav() by the fxSP per share.

- **Rewards:** harvest() is open to anyone. It claims the gauge's reward tokens, wstETH and FXN, which the gauge pays straight to fxSAVE, pays the caller a 0.01 percent bounty and sends the rest to RewardHarvester 0x0559a1b22409Eef7559a5c88cbaA4e285e7b9C30. A keeper swaps it into fxUSD or USDC and hands it back to fxSAVE, which deposits it into fxSP and stakes it. Convex's 17 percent share applies only to FXN minted as gauge emissions; the fxSP gauge has had no emission weight since November 2025, so none is taken. The treasury's share of rewards is set to 0.

- **Peg keeping:** PegKeeper 0x50562fe7e870420F5AAe480B7F94EB4ace2fcd70 exchanges fxSP's USDC for fxUSD, or the reverse, through a swap route, and must return at least par, with fxUSD counted at 1.00 and USDC at the Chainlink price. Any surplus goes to whoever called PegKeeper: the keeper's own account on a direct call, ProtocolTreasury 0x87d5e4cAaF4358A4337C10859c7107c7AEF4f8Ce on a relayed one. From January 2025 to 13 November 2026 it ran 830 times: 618.1 million USDC into fxUSD and 295.5 million fxUSD into USDC.

- **The gauge checkpoint:** Every deposit into, withdrawal from and transfer of gauge shares runs a checkpoint. It first updates the accounting of each reward token, active and retired, then reads the gauge's weight from the GaugeController 0xe60eB8098B34eD775ac44B1ddE864e098C6d7f37 (admin: GaugeControllerOwner 0x1Ca7b82c4265835C7841cf29407217D820a7DADb). After the balance changes, the gauge reads veFXN's total supply and, through the boost proxy 0x1145f304d74f3295Fa38b82e7BB8704B0E187FA1, the veFXN boost of the account whose veFXN counts for the staker (its vote owner), which for fxSAVE's vault is Convex's voter proxy 0xd11a4Ee017cA0BECA8FA45fF2abFe9C6267b7881. The Convex vault reads the state of Convex MultiRewards 0x4187DC4998bB9f47389cD885A80a52A74EC8803c on every withdrawal and calls into it once Convex switches that contract's rewards on; they are off.

- **Governance:** fxSAVE, fxSP, the gauge, PegKeeper and ProtocolTreasury are Transparent proxies under ProxyAdmin 0x9B54B7703551D9d0ced177A78367560a8B2eDDA4, owned by TimelockController 0x68863fb8855b04509a835082478D6E3D0bE4E61a with a 3 day delay; Safe 0x26B2ec4E02ebe2F54583af25b647b1D619e67BbF (6 of 9) is its only proposer and canceller, and anyone can execute. The Timelock holds the admin role of fxSP, the gauge and PegKeeper and one of fxSAVE's two admin seats; Safe 0xA0FB1b11ccA5871fb0225B64308e249B97804E99 (6 of 9, the same nine owners) holds the other. Safe 0x26B2 directly owns the router, the boost proxy and the GaugeControllerOwner and manages the gauge's reward list. Safe 0x26B2 and Safe 0x28c921adAC4c1072658eB01a28DA06b5F651eF62 (3 of 4, four of the nine) hold ProtocolTreasury's admin role and can move fxSP's USDC into its strategy. Convex MultiRewards answers to Convex's reward manager, not to f(x). Keeper roles are held by externally owned accounts, one key each.

- **Scope:** This report scans 20 contracts: fxSAVE, fxSP, the gauge, the Convex vault and reward contract, the keepers' contracts, the router, the governance contracts and the Curve pool. fxUSD, PoolManager and the lending pools are covered by the fxUSD report. OpenZeppelin audited SavingFxUSD, FxUSDBasePool and PegKeeper at commit 56a47ea (27 March to 5 May 2025); fxSP's implementation has been replaced since. SECBIT audited fxSAVE and the Stability Pool's USDC strategy (report of 17 March 2025).


**Referenced material**

- **[DOCUMENTATION]** [f(x) integration guide for fxSAVE: exit routes, cooldown, rou…](https://fxprotocol.gitbook.io/fx-docs/developers/integrating-fxsave.md)
- **[DOCUMENTATION]** [f(x) risk parameters: redemption period, USDC depeg floor, Aa…](https://fxprotocol.gitbook.io/fx-docs/risk-management/risk-parameters.md)
- **[AUDIT]** [OpenZeppelin f(x) v2 audit, commit 56a47ea; SavingFxUSD, FxUS…](https://www.openzeppelin.com/news/fx-v2-audit)
- **[AUDIT]** [f(x) audit list, including the SECBIT fxSAVE and Stability Po…](https://fxprotocol.gitbook.io/fx-docs/risk-management/audit-reports.md)
- **[GOVERNANCE]** [f(x) Protocol Improvement Proposals forum](https://forum.aladdin.club/c/f-x-protocol-improvement-proposals/18)
- **[DOCUMENTATION]** [Lagoon fxLOOP vault page (held fxSP's fee waiver from 15 to 1…](https://app.lagoon.finance/vault/1/0x4ef75e307f7edbf0462c679192c1ff7e911c389a)

</details>

<details>
<summary><strong>📖 Terms</strong> <em>— recurring protocol jargon</em></summary>

- **fxSP** — The share token of the f(x) Stability Pool (FxUSDBasePool). The pool holds fxUSD and USDC, and fxSP is what an fxSAVE share is a claim on.
- **Gauge** — The f(x) staking contract for fxSP. Staked fxSP earns the gauge's reward tokens, wstETH and FXN, as they are funded. fxSAVE keeps its fxSP there, in the name of its Convex vault.
- **Checkpoint** — The gauge's reward accounting step. It runs on every deposit, withdrawal and transfer of gauge shares, so every fxSAVE withdrawal passes through it.
- **Boost and veFXN** — FXN is f(x)'s governance token and veFXN is locked FXN. The gauge weights a staker's share of FXN emissions by the veFXN balance behind it (its boost), read through the boost proxy on every checkpoint. The fxSP gauge has no emission weight today, so the boost earns nothing, but the read still runs. fxSAVE's vault uses Convex's veFXN.
- **Convex vault** — A small contract Convex created for fxSAVE and that fxSAVE owns. fxSAVE's gauge stake is held in its name, so that the stake counts Convex's veFXN as its boost.
- **Par swap** — An exchange of fxUSD for USDC, or the reverse, inside fxSP at par value (fxUSD at 1.00 and USDC at the Chainlink price, so close to one for one), whatever fxUSD trades at in the market.
- **Surplus over par** — What a peg keeper's market route returns above the par value fxSP requires. fxSP pays it to PegKeeper's caller: the keeper on a direct call, ProtocolTreasury on a relayed one.
- **Cooldown** — The wait fxSP imposes between a redeem request and the fee free redeem: 1 hour, capped at 7 days in code.
- **Redeem request** — The exit route that starts with requestRedeem. On fxSAVE it moves the holder's fxSP into a holding contract, where it stays until it is claimed; once the cooldown has ended, claim pays fxUSD and USDC.
- **Fee waiver** — A role on fxSP (NO_INSTANT_REDEEM_FEE_ROLE) whose holder can redeem at once without the 1 percent instant fee.
- **Lever** — A privileged setting or function that this report tracks and grades by what it can do to the asset and how fast its holder can act.

</details>

<a id="sec-off-chain-deps"></a>
<details>
<summary><strong>🌐 Off-Chain Dependencies</strong> — risk that extends beyond the chain</summary>

> *5 control surfaces extend beyond on-chain observability. Each entry shows what the analyst CAN observe (on-chain signal) alongside the off-chain dependency it relies on.*

- **1. backing** 🟠 — fxSP holds fxUSD, counted at 1.00, next to USDC, and it is the only live liquidator of fxUSD's lending pools: a liquidation burns fxSP's fxUSD and the caller pays the pool back at par. fxSP has approved PoolManager for all of its USDC and fxUSD and books the amounts PoolManager reports. fxUSD's backing, its mint authority, PoolManager's own roles and the pools' oracles are outside this scan and are covered by the fxUSD report.
    - *On-chain signal:* fxSP totalYieldToken() and its USDC balance; PegKeeper getFxUSDPrice() (the Curve fxUSD/USDC EMA); fxUSD totalSupply().
    - *Off-chain dependency:* The f(x) v2 core: fxUSD 0x085780639CC2cACd35E474e71f4d000e2405d8f6, PoolManager 0x250893CA4Ba5d05626C785e8da758026928FCD24 and its pools.
    - *Recovery path:* None at this layer. A loss in fxUSD's backing reaches fxSAVE through the fxUSD that fxSP holds: 20 to 100 percent of fxSP's assets from 1 October to 15 November 2026. fxUSD's own supply fell from about 86 million on 4 November to about 20 million on 15 November 2026 while its price held at 1.00; almost all of the fall was debt repaid in the WBTC long pool (80.8 million on 16 October, 15.1 million on 15 November), which carries about three quarters of fxUSD's debt.
- **2. governance** 🔴 — fxSAVE's stake sits in its Convex vault, and every vault withdrawal calls Convex MultiRewards 0x4187DC4998bB9f47389cD885A80a52A74EC8803c once its rewards are switched on. Convex's reward manager can switch them on at any time, with no way back, and add reward tokens without a cap; each fxSAVE exit then loops over every one.
    - *On-chain signal:* MultiRewards rewardState() (1 = NoRewards, 2 = Active) and rewardTokenLength(), its Activate and RewardAdded events; Booster.rewardManager(); ConvexCore operators; the boost contract's delegated point for Convex's FxnVoterProxy (zero). Rewards were off and the reward list empty at block 26,408,442.
    - *Off-chain dependency:* Convex Finance: reward manager EOA 0xe7Ac460137CCD6173DB6992529013D672d4F0087 (set by the Booster's owner ConvexCore 0xCC07e8BA6bc8aeb18C4AE110C3Da9c7Dce4A3e74, whose operators are Safe 0xa3C5A1e09150B75ff251c1a7815A07182c3de2FB (3 of 5), which can make any call, and FxGaugeExecutor 0xD2c4c902D3F6882Dd9E8C18218CBD788c7CD4835, which can only cast Convex's gauge votes). fxSAVE's vault also shares the veFXN boost of Convex's FxnVoterProxy 0xd11a4Ee017cA0BECA8FA45fF2abFe9C6267b7881, so the gauge reads that proxy's boost balance in every checkpoint; only Convex can delegate that boost away.
    - *Recovery path:* Nothing on Convex's side undoes activation or removes a reward token. f(x) can upgrade the gauge through the 3 day Timelock to release the vault's stake to fxSAVE; that Timelock's only proposer is Safe 0x26B2.
- **3. governance** 🟠 — fxSP keeps its USDC on hand or in an Aave V3 strategy (AaveV3CompoundStrategy 0xd023Aac0e2D46c93d4c6e8e2A449bF2d4687804f). Every fxSP deposit, redeem and nav() reads the strategy's balance, so an Aave aToken that reverts stops fxSP's flows until an fxSP upgrade; USDC pushed into the strategy comes back only out of the unborrowed USDC in Aave's reserve. Since 15 November 2026 about 55 percent of fxSP's assets sit in the strategy.
    - *On-chain signal:* fxSP allocations(USDC), the strategy's totalSupply() and USDC transfers from fxSP to the strategy. alloc, kill and manage emit no event. The strategy held 31.00M USDC at block 26,422,000 (under 20 USDC from 1 October to 14 November 2026). Aave's USDC reserve (aEthUSDC 0x98C23E9d8f34FEFb1B7BD6a91B7FF122F4e16F5c) held 161.0M unborrowed USDC against 2,790.7M supplied on 15 November 2026, about 94 percent borrowed: USDC balanceOf(aEthUSDC) and aEthUSDC totalSupply(). In hourly readings from 16 October to 15 November 2026 the unborrowed USDC ranged from 0.2M (30 October) to 776M, median 147M, and was below fxSP's present 31M position in 15 of 720 readings, on six days between 16 and 30 October.
    - *Off-chain dependency:* Aave governance, which controls the Aave V3 Pool and aToken implementations.
    - *Recovery path:* An fxSP upgrade or an alloc change through the 3 day Timelock. With USDC in the strategy, a redeem that needs more USDC than fxSP has on hand also needs that much unborrowed USDC in Aave's reserve.
- **4. compliance** 🟠 — fxSP's redeem and instantRedeem pay the fxUSD and the USDC leg in one call. If Circle blacklists fxSP or pauses USDC, every fxSP redeem reverts, both legs, and fxSP's USDC is frozen; fxSAVE's own redeem still pays fxSP shares.
    - *On-chain signal:* USDC isBlacklisted(fxSP) and paused() (both false at block 26,402,662); fxSP's USDC, on hand and in the Aave strategy: 0 to 20 percent of its assets in October 2026, 2 to 80 percent from 1 to 15 November 2026.
    - *Off-chain dependency:* Circle (USDC issuer).
    - *Recovery path:* An fxSP upgrade through the 3 day Timelock to settle without the USDC leg; otherwise none.
- **5. oracle** 🟢 — fxSP reads the USDC price (Chainlink USDC/USD) and, for nav(), the fxUSD price (the Curve fxUSD/USDC EMA) from FxUSDPriceOracle 0x3eC677Ba393f2257ED0E1d37aA8442EB7F0953Fa. fxSP's pointer to it is immutable, but the oracle is itself an upgradeable proxy under the same ProxyAdmin, and its admin (the Timelock) can re-point the Curve pool behind the fxUSD price. A USDC reading below 0.995 stops fxSP deposits; a reverting read stops deposits, liquidations and stabilize calls. Redeems do not read a price.
    - *On-chain signal:* fxSP getStableTokenPrice() against stableDepegPrice(); fxSP nav().
    - *Off-chain dependency:* Chainlink (USDC/USD feed) and the Curve fxUSD/USDC pool 0x5018BE882DccE5E3F2f3B0913AE2096B9b3fB61f.
    - *Recovery path:* An upgrade of the oracle or of fxSP through the 3 day Timelock. fxSAVE's exits do not depend on it. The oracle's own upgrade path is graded in the upgrades lever.

</details>

<a id="sec-balance-history"></a>
<details>
<summary><strong>📈 Supply and Backing Over 30 Days</strong> <span class="section-sub">supply, what the Stability Pool holds and where its USDC sits, Aave's unborrowed USDC, fxUSD debt by pool and the fxSAVE held by Morpho, read from chain history on every scan</span></summary>

> *Redrawn on every scan from 120 on-chain readings over the last 30 days, up to block 26,422,925 (15 November 2026 20:53 UTC). These values move with the market and are not part of Changes Since. USDC in the Aave V3 strategy can be withdrawn only while Aave's USDC reserve has unborrowed cash; every fxSP redeem pays a USDC leg, so the share of the pool held there bears on how fast fxSAVE can be redeemed. The charts are in the HTML report.*

| Chart | Series | Now | 7 days ago | 30 days ago | 7 day change | 30 day change | Share of total | Low | High |
|---|---|---|---|---|---|---|---|---|---|
| Supply | fxUSD total supply | 20.1M | 61.9M | 89.8M | -67.6% | -77.7% |  | 17.6M (14 Nov) | 90.7M (26 Oct) |
| Supply | fxSAVE supply (shares) | 49.0M | 54.9M | 75.8M | -10.7% | -35.4% |  | 49.0M (15 Nov) | 75.8M (16 Oct) |
| What the Stability Pool (fxSP) holds | fxUSD | 13.4M | 55.3M | 83.5M | -75.8% | -84.0% | 23.7% | 11.5M (15 Nov) | 85.6M (26 Oct) |
| What the Stability Pool (fxSP) holds | USDC on hand | 12.0M | 8.7M | 3.8M | +38.7% | +219.6% | 21.3% | 0 (26 Oct) | 39.6M (14 Nov) |
| What the Stability Pool (fxSP) holds | USDC in the Aave V3 strategy | 31.0M | 0 | 0 | n/a | n/a | 55.0% | 0 (26 Oct) | 31.0M (15 Nov) |
| What the Stability Pool (fxSP) holds | Total | 56.4M | 63.9M | 87.3M | -11.8% | -35.4% |  | 56.4M (15 Nov) | 87.4M (26 Oct) |
| Aave V3 USDC reserve: unborrowed USDC, against fxSP's position | USDC Aave can pay out | 166.7M | 214.4M | 159.0M | -22.2% | +4.8% |  | 73.2K (30 Oct) | 641.6M (6 Nov) |
| Aave V3 USDC reserve: unborrowed USDC, against fxSP's position | fxSP's USDC in Aave | 31.0M | 0 | 0 | n/a | n/a |  | 0 (26 Oct) | 31.0M (15 Nov) |
| fxUSD debt by lending pool | WBTC long pool | 15.1M | 54.2M | 80.8M | -72.2% | -81.4% | 75.0% | 12.8M (14 Nov) | 81.0M (26 Oct) |
| fxUSD debt by lending pool | wstETH long pool | 5.0M | 7.7M | 9.0M | -35.0% | -44.6% | 25.0% | 4.8M (14 Nov) | 9.9M (27 Oct) |
| fxUSD debt by lending pool | Total | 20.1M | 61.9M | 89.8M | -67.6% | -77.7% |  | 17.6M (14 Nov) | 90.7M (26 Oct) |
| Other readings | fxSAVE held by Morpho Blue (shares) | 23.0M | 25.0M | 30.8M | -8.1% | -25.3% |  | 19.1M (30 Oct) | 31.3M (26 Oct) |
| Other readings | fxUSD price in USDC (Curve EMA) | 1.0005 | 1.0000 | 1.0002 | +0.0% | +0.0% |  | 0.9974 (26 Oct) | 1.0010 (13 Nov) |

</details>

<a id="sec-oracle-surface"></a>
<details>
<summary><strong>🔮 Exit, Backing and Pricing Tripwires</strong> <span class="section-sub">live settings and balances that decide whether fxSAVE's exit works, what backs a share, and how it is priced</span></summary>

> *Live-read each scan; a repointed feed or retuned delay is flagged in Changes-Since. Any change to a row shows in Changes Since Last Scan, except rows 9, 10, 14 to 16, 23 and 24, which move with the market and are shown for reference. Rows 1 to 4 are what the gauge reads on every fxSAVE withdrawal: the boost source, the gauge's weight in the GaugeController and the lengths of the two reward lists; Safe 0x26B2 sets all of them with no delay, and row 2 failing to read is itself the signal. Row 5 is the gauge's liquidity manager, which would take custody of all staked fxSP once set. Rows 6 to 8 are Convex's side of the exit path. Rows 9 to 13 are what backs fxSP and where its USDC sits; rows 9 and 10 give the mix that the par swap levers can reach. Row 11 is the USDC a Safe has pushed into Aave: it stays in Changes Since so that a push shows there, and it also creeps up with Aave interest on every scan while the strategy is funded. Rows 14 to 16 are the prices and the share value. Rows 17 and 18 are fxSP's exit terms; row 19 is the USDC price below which fxSP stops deposits. Rows 20 and 21 are Circle's switches over the USDC leg. Row 22 is the delay in front of every upgrade through the ProxyAdmin; changes to the router Diamond's code have none. Rows 23 and 24 are Aave's USDC reserve: fxSP can withdraw row 11 only out of row 23, the USDC nobody has borrowed. Row 25 is the strategy slot for fxSP's fxUSD, empty at every reading since March 2025: Aave V3's USDC reserve is the only lending venue the pool has used, through this strategy and the one before it.*

| Piece | Resolves to | Authority | Delay |
|---|---|---|---|
| 1. Boost source the gauge reads on every checkpoint | [`0x8Cc0...7A81`](https://etherscan.io/address/0x8Cc02c0D9592976635E98e6446ef4976567E7A81) | owner: Safe 0x26B2 (6 of 9) | immediate |
| 2. fxSP gauge's relative weight in the GaugeController | `0.0000` | GaugeControllerOwner admin: Safe 0x26B2 (6 of 9); veFXN votes | immediate, from the next week |
| 3. Number of active reward tokens on the gauge | `2` | REWARD_MANAGER_ROLE: Safe 0x26B2 (6 of 9) | immediate |
| 4. Number of retired reward tokens on the gauge | `0` | REWARD_MANAGER_ROLE: Safe 0x26B2 (6 of 9) | immediate |
| 5. Gauge liquidity manager | `none set` | DEFAULT_ADMIN_ROLE: the Timelock | 3 days |
| 6. Convex rewards for pool 36, fxSAVE's vault included (1 = off, 2 = on) | `1` | Convex reward manager, EOA 0xe7Ac4601 | immediate, one way |
| 7. Convex reward tokens | `0` | Convex reward manager, EOA 0xe7Ac4601 | immediate |
| 8. veFXN boost delegated away by Convex's voter proxy | `0.00 veFXN` | Convex (FxnVoterProxy and its operator) | immediate |
| 9. fxSP's fxUSD | `13,355,818 fxUSD` | depositors, redeemers, peg keepers, liquidations | live |
| 10. fxSP's USDC on hand | `12,024,911 USDC` | depositors, redeemers, peg keepers, liquidations; manage moves it to the strategy | live |
| 11. fxSP's USDC in the Aave strategy | `31,003,868 USDC` | ASSET_MANAGER_ROLE: Safe 0x26B2 (6 of 9), Safe 0x28c9 (3 of 4), the Timelock | immediate |
| 12. fxSP's USDC strategy | [`0xd023...804f`](https://etherscan.io/address/0xd023Aac0e2D46c93d4c6e8e2A449bF2d4687804f) | DEFAULT_ADMIN_ROLE: the Timelock (alloc, kill) | 3 days |
| 13. fxSP's USDC strategy capacity | `100,000,000 USDC` | DEFAULT_ADMIN_ROLE: the Timelock (alloc) | 3 days |
| 14. fxUSD price in USDC, Curve EMA (PegKeeper's read) | `1.0005` | market; the Curve pool is set by the Timelock | live |
| 15. USDC price fxSP uses (Chainlink) | `0.9998` | Chainlink USDC/USD | live |
| 16. fxSP per fxSAVE share | `1.119065 fxSP` | none: rises with harvested rewards | live |
| 17. fxSP instant redeem fee | `1.00%` | DEFAULT_ADMIN_ROLE: the Timelock (cap 5%) | 3 days |
| 18. fxSP redeem cooldown | `1h` | DEFAULT_ADMIN_ROLE: the Timelock (cap 7 days) | 3 days |
| 19. fxSP USDC depeg price | `0.995` | DEFAULT_ADMIN_ROLE: the Timelock (no bound) | 3 days |
| 20. USDC blacklist on fxSP | `no` | Circle | immediate |
| 21. USDC paused | `no` | Circle | immediate |
| 22. Timelock minimum delay | `3d` | the Timelock itself (no floor in code) | 3 days |
| 23. USDC that Aave can pay out now (unborrowed USDC in its reserve) | `166,679,615 USDC` | Aave's suppliers and borrowers | live |
| 24. USDC supplied to Aave in total (aEthUSDC supply) | `2,791,928,479 USDC` | Aave's suppliers and borrowers | live |
| 25. fxSP's fxUSD strategy | `none set` | DEFAULT_ADMIN_ROLE: the Timelock (alloc) | 3 days |

</details>

<a id="sec-critical-params"></a>
<details>
<summary><strong>🎚️ Critical Parameter Levers</strong> — the one-tx risk levers to watch</summary>

> *14 on-chain parameter levers that are curated as high-impact for lender-side risk (direct dilution / safety-mechanism closure / authority transfer / oracle repointing). Each entry shows current value, the threshold that triggers the impact, and the role-holder controlling the lever.*

- **1. `Boost source of the gauge checkpoint: updateVeBoost(address), and the transfer of the proxy's ownership`** 🔴 on [**VotingEscrowProxy (0x1145f304d74f3295Fa38b82e7BB8704B0E187FA1)**](#c-0x1145f304d74f3295fa38b82e7bb8704b0e187fa1)
    - *Role gate:* owner(): Safe 0x26B2ec4E02ebe2F54583af25b647b1D619e67BbF (6 of 9), no delay. Ownable2Step; both steps are instant.
    - *Live current value (as of block 19,287,263):* `0x8Cc02c0D9592976635E98e6446ef4976567E7A81`
    - *Recorded changes:* 1 historical event(s); last setter `0x0000000000000000000000000000000000000000`
    - *Threshold:* veBoost() != 0x8Cc02c0D9592976635E98e6446ef4976567E7A81 (any UpdateVeBoost event); owner() != Safe 0x26B2 or pendingOwner() != 0x0 (OwnershipTransferStarted, OwnershipTransferred). Triage: simulate an fxSAVE redeem.
    - *Impact:* The gauge asks this proxy for an account's boosted veFXN balance on every deposit, withdrawal and transfer. The owner can point it at any contract that answers one balance call. If that contract then reverts, every fxSAVE redeem, withdraw and requestRedeem reverts. No principal moves, and requests already filed can still be claimed, but new exits stay closed until the gauge is upgraded, which takes 3 days and must be proposed by the same Safe.
- **2. `Gauge weights with no upper bound: changeGaugeWeight(address,uint256), changeTypeWeight(int128,uint256), and the hand over of the GaugeController's admin`** 🔴 on [**GaugeControllerOwner (0x1Ca7b82c4265835C7841cf29407217D820a7DADb)**](#c-0x1ca7b82c4265835c7841cf29407217d820a7dadb)
    - *Role gate:* DEFAULT_ADMIN_ROLE: Safe 0x26B2ec4E02ebe2F54583af25b647b1D619e67BbF (6 of 9), no delay. This contract is the admin of GaugeController 0xe60eB8098B34eD775ac44B1ddE864e098C6d7f37 and can hand that seat to any address in two calls.
    - *Threshold:* Any NewGaugeWeight or NewTypeWeight event on the GaugeController for the fxSP gauge 0xEd92dDe3214c24Ae04F5f96927E3bE8f8DbC3289 or its type that a normalizeGaugeWeight call did not produce; gauge_relative_weight(fxSP gauge) reverting; GaugeController admin() != GaugeControllerOwner (CommitOwnership, ApplyOwnership); RoleGranted on GaugeControllerOwner.
    - *Impact:* The gauge reads its relative weight from the GaugeController for every week since its last checkpoint. These setters accept any number, and a weight large enough to overflow that calculation makes the read revert from the next weekly boundary. From then on every fxSAVE exit reverts, and a later weight change does not repair the week already started. The repair is a gauge upgrade: 3 days, proposed by the same Safe.
- **3. `Gauge reward list with no cap: registerRewardToken(address,address)`** 🔴 on [**fxSP gauge, SharedLiquidityGauge (0xEd92dDe3214c24Ae04F5f96927E3bE8f8DbC3289)**](#c-0xed92dde3214c24ae04f5f96927e3be8f8dbc3289)
    - *Role gate:* REWARD_MANAGER_ROLE: Safe 0x26B2ec4E02ebe2F54583af25b647b1D619e67BbF (6 of 9), no delay. The role admin is DEFAULT_ADMIN_ROLE, held by the Timelock only, so a new holder needs a 3 day operation and then acts at once.
    - *Threshold:* getActiveRewardTokens() != [FXN 0x365AccFCa291e7D3914637ABf1F7635dB165Bb09, wstETH 0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0] or getHistoricalRewardTokens() not empty; any RegisterRewardToken event; REWARD_MANAGER_ROLE holder set != {Safe 0x26B2}.
    - *Impact:* Every checkpoint, so every fxSAVE exit, loops over the gauge's active reward tokens and then over its retired ones. The manager can add tokens without limit, and removing one only moves it to the retired list, so the loop can only grow. Long enough, it needs more gas than a transaction may use and every exit reverts. The manager's own role cannot shorten the list; the repair is a gauge upgrade through the Timelock.
- **4. `Par swap of fxSP's USDC and fxUSD by the keeper: stabilize(address,uint256,bytes)`** 🟠 on [**PegKeeper (0x50562fe7e870420F5AAe480B7F94EB4ace2fcd70)**](#c-0x50562fe7e870420f5aae480b7f94eb4ace2fcd70)
    - *Role gate:* STABILIZE_ROLE: EOA 0x4215F2014239Cf0E1A8617b31Fcaf88AaC6e4779 and ProtocolTreasury 0x87d5e4cAaF4358A4337C10859c7107c7AEF4f8Ce (a relay, see its own entry), no delay. The role admin is DEFAULT_ADMIN_ROLE, held by the Timelock only.
    - *Profile-declared value (verified at block 26,408,435):* `fxSP held 13.36M fxUSD and 43.04M USDC, 31.00M of it in the Aave strategy, at block 26,422,000. USDC was 0 to 20 percent of fxSP's assets in October 2026 and 2 to 80 percent from 1 to 15 November 2026.`
    - *Threshold:* Arbitrage events on fxSP 0x65C9A641afCEB9C0E6034e558A319488FA0FA3be: USDC leaving while PegKeeper getFxUSDPrice() is below 1e18, the size against fxSP's USDC balance, and bonusOut with its receiver; STABILIZE_ROLE holder set != {EOA 0x4215, ProtocolTreasury}.
    - *Impact:* The keeper swaps fxSP's USDC for fxUSD, or the reverse, through a route it chooses. fxSP checks only that it gets back at least par, with fxUSD counted at 1.00; it checks neither fxUSD's market price nor the size. While fxUSD trades below 1.00 the keeper can turn all of fxSP's USDC into fxUSD in one call, with no capital, and keep the surplus over par. fxSP's share count never falls, but its holders, of which fxSAVE is 90 to 98 percent, are left with discounted fxUSD in place of USDC: a loss of up to the discount times the USDC swapped.
- **5. `The treasury relay of the par swap: stabilize(address,address,uint256,bytes), and the instant grants that open it`** 🟠 on [**ProtocolTreasury (0x87d5e4cAaF4358A4337C10859c7107c7AEF4f8Ce)**](#c-0x87d5e4caaf4358a4337c10859c7107c7aef4f8ce)
    - *Role gate:* STABILIZE_ROLE: EOA 0xcDcB516937F95c18a98Dd70458afB64E3C43dC13, no delay. DEFAULT_ADMIN_ROLE: Safe 0x26B2ec4E02ebe2F54583af25b647b1D619e67BbF (6 of 9) and Safe 0x28c921adAC4c1072658eB01a28DA06b5F651eF62 (3 of 4), no delay; either can grant STABILIZE_ROLE or MULTICALL_ROLE (no holder) to any address.
    - *Threshold:* STABILIZE_ROLE holder set != {EOA 0xcDcB}; any holder of MULTICALL_ROLE; RoleGranted on the treasury; Arbitrage events on fxSP whose caller is the treasury (as in the PegKeeper entry).
    - *Impact:* The same swap as the PegKeeper entry, called through the treasury. The keeper still picks the route and the minimum; the surplus over par lands in the treasury, which its two admin Safes can withdraw. Either admin Safe, the smaller one 3 of 4, can hand this relay to any address at once. That bypasses the 3 day wait a STABILIZE grant takes on the PegKeeper itself.
- **6. `Fee free instant redeem of fxSP: instantRedeemNoFee(address,uint256)`** 🟠 on [**fxSP, FxUSDBasePool (0x65C9A641afCEB9C0E6034e558A319488FA0FA3be)**](#c-0x65c9a641afceb9c0e6034e558a319488fa0fa3be)
    - *Role gate:* NO_INSTANT_REDEEM_FEE_ROLE: Safes 0x26B2ec4E02ebe2F54583af25b647b1D619e67BbF, 0xA0FB1b11ccA5871fb0225B64308e249B97804E99, 0xc40549aa1D05C30af23a1C4a5af6bA11FCAFe23F and 0xFC08757c505eA28709dF66E54870fB6dE09f0C5E (each 6 of 9), the router Diamond 0x33636D49FbefBE798e15e7F356E8DBef543CC708, and EOAs 0x547090EB068220b3Da1F7b611ef21723Caa4121e and 0x61b09116D341C6cc45513F29FE3B6C13fE3699A3; no delay for any holder. The role admin is DEFAULT_ADMIN_ROLE, held by the Timelock only, so a new holder needs a 3 day operation.
    - *Threshold:* NO_INSTANT_REDEEM_FEE_ROLE holder set != the seven above (RoleGranted, RoleRevoked on fxSP); InstantRedeem events by a holder in the same transaction as a Deposit of fxUSD while PegKeeper getFxUSDPrice() is below 1e18.
    - *Impact:* fxSP takes fxUSD deposits at a count of 1.00 with no check of fxUSD's price, and a redeem pays fxUSD and USDC pro rata. A holder of this role can deposit fxUSD and redeem at once with no fee, and repeat, which swaps fxUSD into fxSP's USDC at par in one transaction. While fxUSD trades below 1.00 that takes the discount on the USDC out of fxSP, as the keeper's swap does. Anyone can do the same, but only after the 1 hour cooldown or at the 1 percent instant fee, so in a shallow discount the role holders and the keepers are the only immediate takers.
- **7. `Push of fxSP's USDC into its strategy: manage(address,uint256)`** 🟠 on [**fxSP, FxUSDBasePool (0x65C9A641afCEB9C0E6034e558A319488FA0FA3be)**](#c-0x65c9a641afceb9c0e6034e558a319488fa0fa3be)
    - *Role gate:* ASSET_MANAGER_ROLE: Safe 0x26B2ec4E02ebe2F54583af25b647b1D619e67BbF (6 of 9) and Safe 0x28c921adAC4c1072658eB01a28DA06b5F651eF62 (3 of 4), no delay, and the Timelock. The role admin is DEFAULT_ADMIN_ROLE, held by the Timelock only.
    - *Profile-declared value (verified at block 26,408,435):* `allocations(USDC) = strategy 0xd023Aac0e2D46c93d4c6e8e2A449bF2d4687804f (Aave V3), capacity 1e14 (100 million USDC). fxSP has sent USDC to this strategy ten times since June 2025, 1 million to 21 million USDC a time; the latest two, by Safe 0x26B2, were 21,000,000 USDC on 14 November 2026 (block 26,413,858) and 10,000,000 USDC on 15 November 2026 (block 26,418,846). The strategy held 31.00M USDC at block 26,422,000, about 55 percent of fxSP's assets; it held under 20 USDC from 1 October to 14 November 2026.`
    - *Threshold:* Strategy totalSupply() rising, or USDC transfers from fxSP to the strategy (manage emits no event); the share of fxSP's USDC held in the strategy; ASSET_MANAGER_ROLE holder set != {Safe 0x26B2, Safe 0x28c921ad, Timelock}.
    - *Impact:* Either Safe can move fxSP's USDC into the Aave strategy in one call, up to a capacity far above what fxSP holds. The destination is fixed and only fxSP can withdraw from it, so nothing leaves the system. But every fxSP redeem pays a USDC leg, and once the USDC sits in Aave that leg needs Aave to have the liquidity: if it does not, every fxSP redeem reverts. The Safes cannot pull the USDC back; only redeems, or a recall through the Timelock, do.
- **8. `Strategy allocation of fxSP's assets: alloc(address,address,uint96)`** 🟠 on [**fxSP, FxUSDBasePool (0x65C9A641afCEB9C0E6034e558A319488FA0FA3be)**](#c-0x65c9a641afceb9c0e6034e558a319488fa0fa3be)
    - *Role gate:* DEFAULT_ADMIN_ROLE: Timelock 0x68863fb8855b04509a835082478D6E3D0bE4E61a (3 days; only proposer and canceller Safe 0x26B2, open executor). No Safe holds it.
    - *Threshold:* allocations(USDC) != (0xd023Aac0e2D46c93d4c6e8e2A449bF2d4687804f, 1e14) or allocations(fxUSD) != (0x0, 0), read from storage (alloc and kill emit no event); any CallScheduled on the Timelock targeting fxSP with alloc, kill or grantRole; RoleGranted on fxSP.
    - *Impact:* Sets the contract that may hold fxSP's USDC or fxUSD, with no check on that contract. Together with a push it can move either asset out of fxSP, and the balance fxSP counts for its USDC is whatever the strategy reports. A strategy that reverts stops every fxSP deposit and redeem. It has been set twice, both times before the Timelock took the seat. Behind the Timelock, so a change is public for 3 days first.
- **9. `Custody of all staked fxSP: updateLiquidityManager(address)`** 🟠 on [**fxSP gauge, SharedLiquidityGauge (0xEd92dDe3214c24Ae04F5f96927E3bE8f8DbC3289)**](#c-0xed92dde3214c24ae04f5f96927e3be8f8dbc3289)
    - *Role gate:* DEFAULT_ADMIN_ROLE: Timelock 0x68863fb8855b04509a835082478D6E3D0bE4E61a (3 days; only proposer and canceller Safe 0x26B2, open executor). No Safe holds it.
    - *Live current value:* `0x0000000000000000000000000000000000000000`
    - *Threshold:* manager() != 0x0 (any UpdateLiquidityManager event); any CallScheduled on the Timelock targeting the gauge with updateLiquidityManager or grantRole; RoleGranted on the gauge.
    - *Impact:* Setting a liquidity manager transfers the gauge's whole fxSP balance to it in the same call; the new contract only has to report that it is active. The gauge holds nearly all fxSP, and fxSAVE's entire principal sits there, so this is custody of everything behind fxSAVE. None is set. Behind the Timelock, so a change is public for 3 days first.
- **10. `Upgrades: upgrade(address,address), upgradeAndCall(address,address,bytes), changeProxyAdmin(address,address), transferOwnership(address)`** 🟠 on [**ProxyAdmin (0x9B54B7703551D9d0ced177A78367560a8B2eDDA4)**](#c-0x9b54b7703551d9d0ced177a78367560a8b2edda4)
    - *Role gate:* owner(): Timelock 0x68863fb8855b04509a835082478D6E3D0bE4E61a (3 days; only proposer and canceller Safe 0x26B2, open executor). The owner transfer is a single step.
    - *Threshold:* Any Upgraded or AdminChanged event on fxSAVE, fxSP, the gauge, PegKeeper, ProtocolTreasury, FxUSDPriceOracle 0x3eC677Ba393f2257ED0E1d37aA8442EB7F0953Fa, PoolManager 0x250893CA4Ba5d05626C785e8da758026928FCD24 or fxUSD 0x085780639CC2cACd35E474e71f4d000e2405d8f6; ProxyAdmin owner() != Timelock; any CallScheduled on the Timelock targeting the ProxyAdmin.
    - *Impact:* Replaces the code of any proxy under this admin. For fxSAVE, fxSP and the gauge that is full control of shares, backing and exits. Three proxies outside this scan matter as much: the oracle fxSP reads for the USDC price (a wrong price mints fxSP against too little USDC), and PoolManager and fxUSD (fxSP has approved PoolManager for all of its USDC and fxUSD). Behind the Timelock, so an upgrade is public for 3 days first; the proposer is Safe 0x26B2.
- **11. `The Timelock's own delay and roles: updateDelay(uint256), grantRole(bytes32,address)`** 🟠 on [**TimelockController (0x68863fb8855b04509a835082478D6E3D0bE4E61a)**](#c-0x68863fb8855b04509a835082478d6e3d0be4e61a)
    - *Role gate:* The Timelock itself (TIMELOCK_ADMIN_ROLE and the caller check of updateDelay), so each change is a queued operation that waits the current delay. PROPOSER_ROLE and CANCELLER_ROLE: Safe 0x26B2ec4E02ebe2F54583af25b647b1D619e67BbF (6 of 9) only.
    - *Threshold:* getMinDelay() != 259200 (MinDelayChange); PROPOSER_ROLE or CANCELLER_ROLE holder set != {Safe 0x26B2}; TIMELOCK_ADMIN_ROLE holder set != {Timelock}; any CallScheduled whose target is the Timelock.
    - *Impact:* The 3 day delay is the only notice in front of upgrades, strategy allocation and the gauge's custody setter. The delay has no minimum in code, and one Safe proposes and cancels everything, so there is no independent veto. A queued call that shortens the delay or adds a proposer is the earliest sign that this notice is about to weaken.
- **12. `Payout of another owner's matured redeem request: claimFor(address,address), and the grant of CLAIM_FOR_ROLE`** 🟠 on [**fxSAVE, SavingFxUSD (0x7743e50F534a7f9F1791DdE7dCD89F7783Eefc39)**](#c-0x7743e50f534a7f9f1791dde7dcd89f7783eefc39)
    - *Role gate:* CLAIM_FOR_ROLE: router Diamond 0x33636D49FbefBE798e15e7F356E8DBef543CC708 (see its own entry). The role admin is DEFAULT_ADMIN_ROLE, held by the Timelock (3 days) and by Safe 0xA0FB1b11ccA5871fb0225B64308e249B97804E99 (6 of 9) with no delay, which can also remove the Timelock's seat.
    - *Threshold:* CLAIM_FOR_ROLE holder set != {router Diamond}; DEFAULT_ADMIN_ROLE holder set != {Timelock, Safe 0xA0FB} (RoleGranted, RoleRevoked on fxSAVE); a Claim event whose fxSP payout goes to an address other than the owner or the router.
    - *Impact:* A redeem request moves the owner's fxSP into a holding contract until fxSP's cooldown ends. A holder of this role can then pay that fxSP to any address, and Safe 0xA0FB can give the role to any address at once. It reaches only requests already filed and matured; fxSAVE shares with no open request are out of reach, and the share price is untouched. For a FiRM market this is a design rule: exit with redeem, which pays fxSP at once, or claim a request as soon as its cooldown ends.
- **13. `Router facet changes: diamondCut((address,uint8,bytes4[])[],address,bytes), approveTarget(address,address), transferOwnership(address)`** 🟠 on [**router Diamond (0x33636D49FbefBE798e15e7F356E8DBef543CC708)**](#c-0x33636d49fbefbe798e15e7f356e8dbef543cc708)
    - *Role gate:* owner(): Safe 0x26B2ec4E02ebe2F54583af25b647b1D619e67BbF (6 of 9), no delay. The owner transfer is a single step.
    - *Threshold:* Any DiamondCut event; facetAddresses() changing; a new approved call target; owner() != Safe 0x26B2 (OwnershipTransferred).
    - *Impact:* The router holds CLAIM_FOR_ROLE on fxSAVE and a fee waiver on fxSP, and users who exit through it have approved it to spend their fxSAVE. Its owner can replace its code at once, so new code could use both roles and those approvals for anyone it chooses. It cannot reach fxSAVE held with no approval to the router and no open redeem request.
- **14. `fxSP exit terms: updateRedeemCoolDownPeriod(uint256), updateInstantRedeemFeeRatio(uint256)`** 🟡 on [**fxSP, FxUSDBasePool (0x65C9A641afCEB9C0E6034e558A319488FA0FA3be)**](#c-0x65c9a641afceb9c0e6034e558a319488fa0fa3be)
    - *Role gate:* DEFAULT_ADMIN_ROLE: Timelock 0x68863fb8855b04509a835082478D6E3D0bE4E61a (3 days; only proposer and canceller Safe 0x26B2, open executor).
    - *Live current value (as of block 24,374,323):* `10000000000000000 (0.010000e18)`
    - *Recorded changes:* 5 historical event(s); last setter `0x26B2ec4E02ebe2F54583af25b647b1D619e67BbF`
    - *Threshold:* redeemCoolDownPeriod() != 3600 (UpdateRedeemCoolDownPeriod); instantRedeemFeeRatio() != 1e16 (UpdateInstantRedeemFeeRatio); any CallScheduled on the Timelock targeting fxSP with either setter.
    - *Impact:* The wait between a redeem request and the fee free redeem can be raised to 7 days, and the fee on an instant redeem to 5 percent; both limits are in code. Either makes leaving fxSP slower or dearer, which is the last step of an fxSAVE exit. Lowering either to zero would open the par swap of the fee waiver entry to everyone. Behind the Timelock, so a change is public for 3 days first.

</details>

## 📑 Table of Contents

1. [Analyst Focus Areas](#analyst-focus-areas)
2. Contracts
   - [fxSAVE ★](#c-0x7743e50f534a7f9f1791dde7dcd89f7783eefc39)
   - [Router Diamond](#c-0x33636d49fbefbe798e15e7f356e8dbef543cc708)
   - [TimelockController](#c-0x68863fb8855b04509a835082478d6e3d0be4e61a)
   - [fxSP (Stability Pool)](#c-0x65c9a641afceb9c0e6034e558a319488fa0fa3be)
   - [fxSP gauge](#c-0xed92dde3214c24ae04f5f96927e3be8f8dbc3289)
   - [RewardHarvester](#c-0x0559a1b22409eef7559a5c88cbaa4e285e7b9c30)
   - [Convex vault (fxSAVE's)](#c-0x4bfc5292da18e32ed2354350e07e417ce4796f9c)
   - [PegKeeper](#c-0x50562fe7e870420f5aae480b7f94eb4ace2fcd70)
   - [Gauge Controller](#c-0xe60eb8098b34ed775ac44b1dde864e098c6d7f37)
   - [veFXN boost proxy](#c-0x1145f304d74f3295fa38b82e7bb8704b0e187fa1)
   - [Convex MultiRewards](#c-0x4187dc4998bb9f47389cd885a80a52a74ec8803c)
   - [ProtocolTreasury](#c-0x87d5e4caaf4358a4337c10859c7107c7aef4f8ce)
   - [Curve fxUSD/USDC pool](#c-0x5018be882dcce5e3f2f3b0913ae2096b9b3fb61f)
   - [GaugeControllerOwner](#c-0x1ca7b82c4265835c7841cf29407217d820a7dadb)
3. [⚡ Authority Concentration](#-authority-concentration)
4. [⛔ Sanctions Screening](#-sanctions-screening)
5. [EOA Exposure Summary](#eoa-exposure-summary)
6. [✅ Scan Integrity](#scan-integrity)

## Analyst Focus Areas &nbsp;&nbsp;☑ Profile reviewed

> **Observational findings — not risk determinations.** Each item below is a focus point for the Risk Analyst to interpret against collateralization context and the protocol's stated intent. Attention levels (CRITICAL / HIGH / LOW) reflect the scanner's heuristic weight — not a realized risk to FiRM. These observations support future risk assessments; they do not constitute one.

> **13 critical-attention** and **32 high-attention** observation(s) across 20 contract(s).
>
> 2 observation(s) below carry a level set by RWG review; each also shows the scanner's own level.

<details>
<summary><strong>View findings (collapsed — profile reviewed)</strong></summary>


### 🔴 CRITICAL (15)

- 🔴 [**Observed: upgrade path has no timelock on FxUSDBasePoolFacet**](#c-0x33636d49fbefbe798e15e7f356e8dbef543cc708) — Proxy can be upgraded without a timelock delay — no observation window for users. Verify governance design.
- 🔴 **EOA `0x4215…4779` controls 3 role(s) across 2 contract(s)** — Single key concentrates authority across the asset. Sub-items below link to each role/contract pair.
    - ↳ 🔴 [**Observed: EOA holds `BUYBACK_ROLE` on PegKeeper**](#c-0x50562fe7e870420f5aae480b7f94eb4ace2fcd70) — `0x4215F2014239Cf0E1A8617b31Fcaf88AaC6e4779` (EOA) — single key controls [SUPPLY] capability. Assess custody and intent.
    - ↳ 🟠 [**Observed: EOA holds `PERMISSIONED_TRADER_ROLE` on RewardHarvester**](#c-0x0559a1b22409eef7559a5c88cbaa4e285e7b9c30) — `0x4215F2014239Cf0E1A8617b31Fcaf88AaC6e4779` (EOA) — single key controls privileged functions. Assess custody and intent.
    - ↳ 🟠 [**Observed: EOA holds `STABILIZE_ROLE` on PegKeeper**](#c-0x50562fe7e870420f5aae480b7f94eb4ace2fcd70) — `0x4215F2014239Cf0E1A8617b31Fcaf88AaC6e4779` (EOA) — single key controls privileged functions. Assess custody and intent.
- 🔴 [**Observed: EOA holds `BUYBACK_ROLE` on ProtocolTreasury**](#c-0x87d5e4caaf4358a4337c10859c7107c7aef4f8ce) — `0xcDcB516937F95c18a98Dd70458afB64E3C43dC13` (EOA) — single key controls a role whose functions (`buyback`) may reach inherited [SUPPLY] authority via PegKeeper. Inheritance is a dependency-graph edge — verify these functions actually exercise it before treating it as a confirmed path. Assess custody and intent.
- 🔴 [**Observed: EOA holds `STABILIZE_ROLE` on ProtocolTreasury**](#c-0x87d5e4caaf4358a4337c10859c7107c7aef4f8ce) — `0xcDcB516937F95c18a98Dd70458afB64E3C43dC13` (EOA) — single key controls a role whose functions (`stabilize`) may reach inherited [SUPPLY] authority via PegKeeper. Inheritance is a dependency-graph edge — verify these functions actually exercise it before treating it as a confirmed path. Assess custody and intent.
- 🔴 [**Observed: upgrade surfaced new inflationary/upgrade authority on SavingFxUSD**](#c-0x7743e50f534a7f9f1791dde7dcd89f7783eefc39) — Upgrade on 2025-03-17 (+18/-0 fn) [+SUPPLY | +ACCESS_CONTROL]. Access-control primitives: added `grantRole`, `renounceRole`, `revokeRole`. Review the Upgrade History table to verify intent.
- 🔴 [**Observed: upgrade surfaced new inflationary/upgrade authority on FxUSDBasePool**](#c-0x65c9a641afceb9c0e6034e558a319488fa0fa3be) — Upgrade on 2025-01-01 (+14/-0 fn) [+SUPPLY | +ACCESS_CONTROL]. Access-control primitives: added `grantRole`, `renounceRole`, `revokeRole`. Review the Upgrade History table to verify intent.
- 🔴 [**Observed: upgrade surfaced new inflationary/upgrade authority on FxUSDBasePool**](#c-0x65c9a641afceb9c0e6034e558a319488fa0fa3be) — Upgrade on 2025-01-02 (+14/-0 fn) [+SUPPLY | +ACCESS_CONTROL]. Access-control primitives: added `grantRole`, `renounceRole`, `revokeRole`. Review the Upgrade History table to verify intent.
- 🔴 [**Observed: upgrade surfaced new inflationary/upgrade authority on SharedLiquidityGauge**](#c-0xed92dde3214c24ae04f5f96927e3be8f8dbc3289) — Upgrade on 2025-01-02 (+19/-0 fn) [+PAUSE, SUPPLY | +ACCESS_CONTROL]. Access-control primitives: added `grantRole`, `renounceRole`, `revokeRole`. Review the Upgrade History table to verify intent.
- 🔴 [**Observed: upgrade surfaced new inflationary/upgrade authority on SharedLiquidityGauge**](#c-0xed92dde3214c24ae04f5f96927e3be8f8dbc3289) — Upgrade on 2025-03-19 (+19/-0 fn) [+PAUSE, SUPPLY | +ACCESS_CONTROL]. Access-control primitives: added `grantRole`, `renounceRole`, `revokeRole`. Review the Upgrade History table to verify intent.
- 🔴 [**Observed: upgrade surfaced new access-control authority on PegKeeper**](#c-0x50562fe7e870420f5aae480b7f94eb4ace2fcd70) — Upgrade on 2025-01-01 (+9/-0 fn) [+ACCESS_CONTROL]. Access-control primitives: added `grantRole`, `renounceRole`, `revokeRole`. Review the Upgrade History table to verify intent.
- 🌐 [**Observed: 5 off-chain control dependencies (backing, governance, compliance, oracle)**](#sec-off-chain-deps) — Asset has 5 control surface(s) that extend beyond on-chain observability. See the 🌐 Off-Chain Dependencies section for each kind, the on-chain signal the analyst can monitor, the off-chain dependency it relies on, and the recovery path if the off-chain piece fails. Cross-reference against the protocol's stated trust model.
- 🎚️ [**Observed: 14 critical parameter levers (CRITICAL: 3, HIGH: 10, MEDIUM: 1)**](#sec-critical-params) — Asset has 14 on-chain parameter levers curated as high-impact for lender-side risk. See the 🎚️ Critical Parameter Levers section for the role gate, current value, threshold, and impact of each. These are singular setters / function calls that flip risk surface in one tx — direct dilution, safety-mechanism closure, authority transfer, or oracle repointing. Verify role-gate identities and threshold distance-to-trigger against current operating posture.

### 🟠 HIGH (31)

- 🟠 [**Observed: EOA holds `WEIGHT_NORMALIZER_ROLE` on GaugeControllerOwner**](#c-0x1ca7b82c4265835c7841cf29407217d820a7dadb) — `0x11E91BB6d1334585AA37D8F4fde3932C7960B938` (EOA) — single key controls privileged functions. Assess custody and intent.
- 🟠 **Observed: TimelockController (3d) controls both admin and upgrades** — `0x68863fb8855b04509a835082478D6E3D0bE4E61a` holds admin + upgrade authority across FxUSDBasePool, PegKeeper, ProtocolTreasury, ProxyAdmin, SavingFxUSD, SharedLiquidityGauge — single entity controls full stack. Verify governance design.
- 🟠 **Observed: Gnosis Safe 6/9 controls both admin and upgrades** — `0x26B2ec4E02ebe2F54583af25b647b1D619e67BbF` holds admin + upgrade authority across FxUSDBasePool, FxUSDBasePoolFacet, GaugeControllerOwner, ProtocolTreasury, RewardHarvester, SharedLiquidityGauge, TimelockController, VotingEscrowProxy — single entity controls full stack. Verify governance design.

<details>
<summary>💰 **Observed: 4 role(s) with supply-altering capability** — Supply-altering surface — assess each holder's custody and governance. Expand for all roles (each links to its contract card).</summary>

- 💰 [**`NO_INSTANT_REDEEM_FEE_ROLE` on FxUSDBasePool**](#c-0x65c9a641afceb9c0e6034e558a319488fa0fa3be) — 0x65C9...A3be — 7 holders — open the role card for holder identities & admin chain.
- 💰 [**`stableToken()` on FxUSDBasePool**](#c-0x65c9a641afceb9c0e6034e558a319488fa0fa3be) — 0x65C9...A3be — held by 0xA0b8...eB48 — open the role card for holder identities & admin chain.
- 💰 [**`BUYBACK_ROLE` on PegKeeper**](#c-0x50562fe7e870420f5aae480b7f94eb4ace2fcd70) — 0x5056...cd70 — 2 holders — open the role card for holder identities & admin chain.
- 💰 [**`DEFAULT_ADMIN_ROLE` on RewardHarvester**](#c-0x0559a1b22409eef7559a5c88cbaa4e285e7b9c30) — 0x0559...9C30 — held by 0x26B2...7BbF — open the role card for holder identities & admin chain.

</details>


<details>
<summary>⏸️ **Observed: 4 role(s) with pause capability** — Pause surface — assess pause-authority governance. Expand for all roles (each links to its contract card).</summary>

- ⏸️ [**`DEFAULT_ADMIN_ROLE` on FxUSDBasePool**](#c-0x65c9a641afceb9c0e6034e558a319488fa0fa3be) — 0x65C9...A3be — held by 0x6886...E61a — open the role card for holder identities & admin chain.
- ⏸️ [**`DEFAULT_ADMIN_ROLE` on GaugeControllerOwner**](#c-0x1ca7b82c4265835c7841cf29407217d820a7dadb) — 0x1Ca7...DADb — held by 0x26B2...7BbF — open the role card for holder identities & admin chain.
- ⏸️ [**`REWARD_MANAGER_ROLE` on SharedLiquidityGauge**](#c-0xed92dde3214c24ae04f5f96927e3be8f8dbc3289) — 0xEd92...3289 — held by 0x26B2...7BbF — open the role card for holder identities & admin chain.
- ⏸️ [**`owner()` on VotingEscrowProxy**](#c-0x1145f304d74f3295fa38b82e7bb8704b0e187fa1) — 0x1145...7FA1 — held by 0x26B2...7BbF — open the role card for holder identities & admin chain.

</details>

- 🔗 [**Observed: supply authority chain on GnosisSafe**](#c-0x65c9a641afceb9c0e6034e558a319488fa0fa3be) — Chain: FxUSDBasePool → `NO_INSTANT_REDEEM_FEE_ROLE` → GnosisSafe. Controlled by: `Safe Owners (6/9 required)`. Assess custody — compromise of this chain could affect root token supply.
- 🔗 [**Observed: supply authority chain on ProtocolTreasury**](#c-0x87d5e4caaf4358a4337c10859c7107c7aef4f8ce) — Chain: PegKeeper → `BUYBACK_ROLE` → ProtocolTreasury. Controlled by: `BATCH_TRANSFER_ROLE`, `BUYBACK_ROLE`, `DEFAULT_ADMIN_ROLE`. Assess custody — compromise of this chain could affect root token supply.

<details>
<summary>🔓 **5 No-Timelock-in-admin-chain supply finding(s) across 4 contract(s)** — Supply-capable roles with no Timelock in the direct admin chain — a supply-altering call can land in one block once the holder's governance threshold is met. Expand to review each role + holder and verify whether it is a real supply path or a transitive getter-pointer edge. FiRM-lens: no analyst-observable buffer between decision and action.</summary>

- ⚠️ [**No Timelock in admin chain: `NO_INSTANT_REDEEM_FEE_ROLE` on FxUSDBasePool**](#c-0x65c9a641afceb9c0e6034e558a319488fa0fa3be) — `NO_INSTANT_REDEEM_FEE_ROLE` has SUPPLY capability and is held by: `0x26B2...7BbF` (Safe), `0x3363...C708` (Contract), `0x5470...121e` (EOA) +4 more. No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `minter()` on SharedLiquidityGauge**](#c-0xed92dde3214c24ae04f5f96927e3be8f8dbc3289) — `minter()` has SUPPLY capability and is held by: `0xC8b1...1DeF` (Contract). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `DEFAULT_ADMIN_ROLE` on RewardHarvester**](#c-0x0559a1b22409eef7559a5c88cbaa4e285e7b9c30) — `DEFAULT_ADMIN_ROLE` has SUPPLY capability and is held by: `0x26B2...7BbF` (Safe). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `BUYBACK_ROLE` on PegKeeper**](#c-0x50562fe7e870420f5aae480b7f94eb4ace2fcd70) — `BUYBACK_ROLE` has SUPPLY capability and is held by: `0x4215...4779` (EOA), `0x87d5...f8Ce` (Contract). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- 🔒 [**No Timelock in admin chain: `stableToken()` on FxUSDBasePool**](#c-0x65c9a641afceb9c0e6034e558a319488fa0fa3be) — `stableToken()` has SUPPLY capability and is held by: `0xA0b8...eB48` (Contract). No Timelock appears in the admin chain and none is needed: the backing pointer is declared `immutable` in the contract source, so it is fixed at construction and cannot be re-pointed by any key, role or governance action. FiRM-lens: there is no decision to buffer on this edge. The authority of the contract it points AT is assessed on that contract's own card.

</details>

- 🟠 [**Observed: upgrade altered privileged surface on FxUSDBasePool**](#c-0x65c9a641afceb9c0e6034e558a319488fa0fa3be) — Upgrade on 2025-01-02 (+0/-14 fn) [-SUPPLY | -ACCESS_CONTROL]. Access-control primitives: removed `grantRole`, `renounceRole`, `revokeRole`. Review the Upgrade History table to verify intent.
- 🟠 [**Observed: upgrade altered privileged surface on FxUSDBasePool**](#c-0x65c9a641afceb9c0e6034e558a319488fa0fa3be) — Upgrade on 2025-03-19 (+2/-0 fn) [+PAUSE]. Review the Upgrade History table to verify intent.
- 🟠 [**Observed: upgrade altered privileged surface on SharedLiquidityGauge**](#c-0xed92dde3214c24ae04f5f96927e3be8f8dbc3289) — Upgrade on 2025-01-02 (+0/-19 fn) [-PAUSE, SUPPLY | -ACCESS_CONTROL]. Access-control primitives: removed `grantRole`, `renounceRole`, `revokeRole`. Review the Upgrade History table to verify intent.
- 🟠 [**Observed: upgrade altered privileged surface on SharedLiquidityGauge**](#c-0xed92dde3214c24ae04f5f96927e3be8f8dbc3289) — Upgrade on 2025-03-19 (+0/-19 fn) [-PAUSE, SUPPLY | -ACCESS_CONTROL]. Access-control primitives: removed `grantRole`, `renounceRole`, `revokeRole`. Review the Upgrade History table to verify intent.

<details>
<summary>🔄 **3 volatile parameter(s) observed across 2 contract(s) (≥5 historical changes each)** — Operational tempo signal — high-velocity setters indicate active governance maintenance, oracle keepers, or routinely-tuned risk parameters. Expand to review each parameter's change count and current value; assess against the protocol's stated intent.</summary>

- 🔄 [**Observed: volatile parameter `instantRedeemNoFee` on FxUSDBasePool**](#c-0x65c9a641afceb9c0e6034e558a319488fa0fa3be) — `instantRedeemNoFee(address receiver, uint256 amountSharesToRedeem)` changed 443 times. Current value: ``. Assess change pattern.
- 🔄 [**Observed: volatile parameter `weights` on GaugeControllerOwner**](#c-0x1ca7b82c4265835c7841cf29407217d820a7dadb) — `updateRelativeWeight(address _gauge, uint256 _newWeight)` changed 8 times. Current value: 3 markets · highest 0.5 (USDC/fxUSD Gauge) · <1M ×1 · 0 ×1 (retired/unfunded) — full per-key breakdown in the Permissioned Parameters table on GaugeControllerOwner. Assess change pattern.
- 🔄 [**Observed: volatile parameter `changeGaugeWeight` on GaugeControllerOwner**](#c-0x1ca7b82c4265835c7841cf29407217d820a7dadb) — `changeGaugeWeight(address addr, uint256 weight)` changed 9 times. Current value: ``. Assess change pattern.

</details>

- 🟠 [**Observed: EOA holds `NO_INSTANT_REDEEM_FEE_ROLE` on FxUSDBasePool**](#c-0x65c9a641afceb9c0e6034e558a319488fa0fa3be) — The role redeems the holder's own fxSP shares at once with no fee; it mints and burns nothing unbacked. With a deposit at par it swaps fxUSD into fxSP's USDC, which costs fxSAVE the fxUSD discount on that USDC while fxUSD trades below 1.00. That is the reach of the STABILIZE keepers, so the level is HIGH. Level set by RWG review (2026-11-13); the scanner's own level is CRITICAL: `0x547090EB068220b3Da1F7b611ef21723Caa4121e` (EOA) — single key controls [SUPPLY] capability. Assess custody and intent.
- 🟠 [**Observed: EOA holds `NO_INSTANT_REDEEM_FEE_ROLE` on FxUSDBasePool**](#c-0x65c9a641afceb9c0e6034e558a319488fa0fa3be) — The role redeems the holder's own fxSP shares at once with no fee; it mints and burns nothing unbacked. With a deposit at par it swaps fxUSD into fxSP's USDC, which costs fxSAVE the fxUSD discount on that USDC while fxUSD trades below 1.00. That is the reach of the STABILIZE keepers, so the level is HIGH. Level set by RWG review (2026-11-13); the scanner's own level is CRITICAL: `0x61b09116D341C6cc45513F29FE3B6C13fE3699A3` (EOA) — single key controls [SUPPLY] capability. Assess custody and intent.

</details>


> **Standard review checklist:** Verify role-holder identities, timelock delays, multisig quorum and signers, upgrade-path custody, and parameter bounds against current protocol spec — regardless of findings above.

## Proxy Admin

| Field | Value |
|---|---|
| ProxyAdmin contract | `0x9B54B7703551D9d0ced177A78367560a8B2eDDA4` |
| ProxyAdmin owner | `0x68863fb8855b04509a835082478D6E3D0bE4E61a` |

## Attention Legend

> Attention levels indicate how prominently a signal should feature in the analyst's review — not the realized risk to FiRM.

| Icon | Attention | Meaning |
|---|---|---|
| 🔴 | CRITICAL | EOA private key, unknown upgrader, or unprotected upgrade path — verify immediately |
| 🟠 | HIGH | Unrecognised contract or elevated privilege pattern — requires investigation |
| 🟢 | LOW | Standard custodial pattern — Gnosis Safe, TimelockController, ERC-4626 vault, OZ Governor, Aragon Agent |
| 🔵 | DISCREPANCY | Storage and event history disagree — investigate for data integrity |

---
<a id="c-0x7743e50f534a7f9f1791dde7dcd89f7783eefc39"></a>
## SavingFxUSD `0x7743e50F534a7f9F1791DdE7dCD89F7783Eefc39`

*10 roles · 9 members · 11 functions*

> ⚠️ **Upgradeable** (TransparentUpgradeable) — impl: `0xE4031e271809d20074E4bef1caeEfEc5f710e8A6`

**Proxy History (4 events):**

| # | Date | Event | Address | Key Changes | Tx |
|---|---|---|---|---|---|
| 1 | 2025-03-17 | Upgrade | `0x3875...E206` | Initial deployment | [0xf00d9a9dd03f50bd7b2ce18c082842a0e5f172462a8d8ed1323611d465f3930b](https://etherscan.io/tx/0xf00d9a9dd03f50bd7b2ce18c082842a0e5f172462a8d8ed1323611d465f3930b) |
| 2 | 2025-03-17 | Admin Changed | `0xd41d...324B` | Previous: `0x0000...0000` | [0xf00d9a9dd03f50bd7b2ce18c082842a0e5f172462a8d8ed1323611d465f3930b](https://etherscan.io/tx/0xf00d9a9dd03f50bd7b2ce18c082842a0e5f172462a8d8ed1323611d465f3930b) |
| 3 | 2025-03-17 | Upgrade | `0xE403...e8A6` | +18 fn; added `CLAIM_FOR_ROLE()`; added `DEFAULT_ADMIN_ROLE()`; added `approve(address,uint256)`; added `getRoleAdmin(bytes32)`; added `grantRole(bytes32,address)`; added `hasRole(bytes32,address)`; added `initialize(address,(string,string,uint256,uint256,address,address))`; added `lockedProxy(address)`; added `maxWithdraw(address)`; added `mint(uint256,address)`; added `permit(address,address,uint256,uint256,uint8,bytes32,bytes32)`; added `previewWithdraw(uint256)`; added `redeem(uint256,address,address)`; added `renounceRole(bytes32,address)`; added `revokeRole(bytes32,address)`; added `transfer(address,uint256)`; added `transferFrom(address,address,uint256)`; added `withdraw(uint256,address,address)`; 📝 src +16716/-4 | [0x0bd67ee80df04279705f09d43cf0348911532fdecdfb4c455303fb11db5825a7](https://etherscan.io/tx/0x0bd67ee80df04279705f09d43cf0348911532fdecdfb4c455303fb11db5825a7) |
| 4 | 2025-03-17 | Admin Changed | `0x9B54...DDA4` | Previous: `0xd41d...324B` | [0xe034850c9959870f40a03abcf2ac4e27183ee257807b89b272dfea20c61dfa18](https://etherscan.io/tx/0xe034850c9959870f40a03abcf2ac4e27183ee257807b89b272dfea20c61dfa18) |

<details>
<summary>📝 Source diff — upgrade #3 (<code>0x3875...E206</code> → <code>0xE403...e8A6</code>): +16716/-4 lines (truncated)</summary>

```diff
--- old_impl
+++ new_impl
@@ -1,5 +1,16717 @@
 // SPDX-License-Identifier: MIT
-
-pragma solidity =0.8.20;
-
-contract EmptyContract {}
+// OpenZeppelin Contracts (last updated v5.0.0) (access/AccessControl.sol)
+
+pragma solidity ^0.8.20;
+
+import {IAccessControl} from "@openzeppelin/contracts/access/IAccessControl.sol";
+import {ContextUpgradeable} from "../utils/ContextUpgradeable.sol";
+import {ERC165Upgradeable} from "../utils/introspection/ERC165Upgradeable.sol";
+import {Initializable} from "../proxy/utils/Initializable.sol";
+
+/**
+ * @dev Contract module that allows children to implement role-based access
+ * control mechanisms. This is a lightweight version that doesn't allow enumerating role
+ * members except through off-chain means by accessing the contract event logs. Some
+ * applications may benefit from on-chain enumerability, for those cases see
+ * {AccessControlEnumerable}.
+ *
+ * Roles are referred to by their `bytes32` identifier. These should be exposed
+ * in the external API and be unique. The best way to achieve this is by
+ * using `public constant` hash digests:
+ *
+ * ```solidity
+ * bytes32 public constant MY_ROLE = keccak256("MY_ROLE");
+ * ```
+ *
+ * Roles can be used to represent a set of permissions. To restrict access to a
+ * function call, use {hasRole}:
+ *
+ * ```solidity
+ * function foo() public {
+ *     require(hasRole(MY_ROLE, msg.sender));
+ *     ...
+ * }
+ * ```
+ *
+ * Roles can be granted and revoked dynamically via the {grantRole} and
+ * {revokeRole} functions. Each role has an associated admin role, and only
+ * accounts that have a role's admin role can call {grantRole} and {revokeRole}.
+ *
+ * By default, the admin role for all roles is `DEFAULT_ADMIN_ROLE`, which means
+ * that only accounts with this role will be able to grant or revoke other
+ * roles. More complex role relationships can be created by using
+ * {_setRoleAdmin}.
+ *
+ * WARNING: The `DEFAULT_ADMIN_ROLE` is also its own admin: it has permission to
+ * grant and revoke this role. Extra precautions should be taken to secure
+ * accounts that have been granted it. We recommend using {AccessControlDefaultAdminRules}
+ * to enforce additional security measures for this role.
+ */
+abstract contract AccessControlUpgradeable is Initializable, ContextUpgradeable, IAccessControl, ERC165Upgradeable {
+    struct RoleData {
+        mapping(address account => bool) hasRole;
+        bytes32 adminRole;
+    }
+
+    bytes32 public constant DEFAULT_ADMIN_ROLE = 0x00;
+
+
+    /// @custom:storage-location erc7201:openzeppelin.storage.AccessControl
+    struct AccessControlStorage {
+        mapping(bytes32 role => RoleData) _roles;
+    }
+
+    // keccak256(abi.encode(uint256(keccak256("openzeppelin.storage.AccessControl")) - 1)) & ~bytes32(uint256(0xff))
+    bytes32 private constant AccessControlStorageLocation = 0x02dd7bc7dec4dceedda775e58dd541e08a116c6c53815c0bd028192f7b626800;
+
+    function _getAccessControlStorage() private pure returns (AccessControlStorage storage $) {
+        assembly {
+            $.slot := AccessControlStorageLocation
+        }
+    }
+
+    /**
+     * @dev Modifier that checks that an account has a specific role. Reverts
+     * with an {AccessControlUnauthorizedAccount} error including the required role.
+     */
+    modifier onlyRole(bytes32 role) {
+        _checkRole(role);
+        _;
+    }
+
+    function __AccessControl_init() internal onlyInitializing {
+    }
+
+    function __AccessControl_init_unchained() internal onlyInitializing {
+    }
+    /**
+     * @dev See {IERC165-supportsInterface}.
+     */
+    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
+        return interfaceId == type(IAccessControl).interfaceId || super.supportsInterface(interfaceId);
+    }
+
+    /**
+     * @dev Returns `true` if `account` has been granted `role`.
+     */
+    function hasRole(bytes32 role, address account) public view virtual returns (bool) {
+        AccessControlStorage storage $ = _getAccessControlStorage();
+        return $._roles[role].hasRole[account];
+    }
+
+    /**
+     * @dev Reverts with an {AccessControlUnauthorizedAccount} error if `_msgSender()`
+     * is missing `role`. Overriding this function changes the behavior of the {onlyRole} modifier.
+     */
+    function _checkRole(bytes32 role) internal view virtual {
+        _checkRole(role, _msgSender());
+    }
+
+    /**
+     * @dev Reverts with an {AccessControlUnauthorizedAccount} error if `account`
+     * is missing `role`.
+     */
+    function _checkRole(bytes32 role, address account) internal view virtual {
+        if (!hasRole(role, account)) {
+            revert AccessControlUnauthorizedAccount(account, role);
+        }
+    }
+
+    /**
+     * @dev Returns the admin role that controls `role`. See {grantRole} and
+     * {revokeRole}.
+     *
+     * To change a role's admin, use {_setRoleAdmin}.
+     */
+    function getRoleAdmin(bytes32 role) public view virtual returns (bytes32) {
+        AccessControlStorage storage $ = _getAccessControlStorage();
+        return $._roles[role].adminRole;
+    }
+
+    /**
+     * @dev Grants `role` to `account`.
+     *
+     * If `account` had not been already granted `role`, emits a {RoleGranted}
+     * event.
+     *
+     * Requirements:
+     *
+     * - the caller must have ``role``'s admin role.
+     *
+     * May emit a {RoleGranted} event.
+     */
+    function grantRole(bytes32 role, address account) public virtual onlyRole(getRoleAdmin(role)) {
+        _grantRole(role, account);
+    }
+
+    /**
+     * @dev Revokes `role` from `account`.
+     *
+     * If `account` had been granted `role`, emits a {RoleRevoked} event.
+     *
+     * Requirements:
+     *
+     * - the caller must have ``role``'s admin role.
+     *
+     * May emit a {RoleRevoked} event.
+     */
+    function revokeRole(bytes32 role, address account) public virtual onlyRole(getRoleAdmin(role)) {
+        _revokeRole(role, account);
+    }
+
+    /**
+     * @dev Revokes `role` from the calling account.
+     *
+     * Roles are often managed via {grantRole} and {revokeRole}: this function's
+     * purpose is to provide a mechanism for accounts to lose their privileges
+     * if they are compromised (such as when a trusted device is misplaced).
+     *
+     * If the calling account had been revoked `role`, emits a {RoleRevoked}
+     * event.
+     *
+     * Requirements:
+     *
+     * - the caller must be `callerConfirmation`.
+     *
+     * May emit a {RoleRevoked} event.
+     */
+    function renounceRole(bytes32 role, address callerConfirmation) public virtual {
+        if (callerConfirmation != _msgSender()) {
+            revert AccessControlBadConfirmation();
+        }
+
+        _revokeRole(role, callerConfirmation);
+    }
+
+    /**
+     * @dev Sets `adminRole` as ``role``'s admin role.
+     *
+     * Emits a {RoleAdminChanged} event.
+     */
+    function _setRoleAdmin(bytes32 role, bytes32 adminRole) internal virtual {
+        AccessControlStorage storage $ = _getAccessControlStorage();
+        bytes32 previousAdminRole = getRoleAdmin(role);
+        $._roles[role].adminRole = adminRole;
+        emit RoleAdminChanged(role, previousAdminRole, adminRole);
+    }
+
+    /**
+     * @dev Attempts to grant `role` to `account` and returns a boolean indicating if `role` was granted.
+     *
+     * Internal function without access restriction.
+     *
+     * May emit a {RoleGranted} event.
+     */
+    function _grantRole(bytes32 role, address account) internal virtual returns (bool) {
+        AccessControlStorage storage $ = _getAccessControlStorage();
+        if (!hasRole(role, account)) {
+            $._roles[role].hasRole[account] = true;
+            emit RoleGranted(role, account, _msgSender());
+            return true;
+        } else {
+            return false;
+        }
+    }
+
+    /**
+     * @dev Attempts to revoke `role` to `account` and returns a boolean indicating if `role` was revoked.
+     *
+     * Internal function without access restriction.
+     *
+     * May emit a {RoleRevoked} event.
+     */
+    function _revokeRole(bytes32 role, address account) internal virtual returns (bool) {
+        AccessControlStorage storage $ = _getAccessControlStorage();
+        if (hasRole(role, account)) {
+            $._roles[role].hasRole[account] = false;
+            emit RoleRevoked(role, account, _msgSender());
+            return true;
+        } else {
+            return false;
+        }
+    }
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts (last updated v5.0.0) (proxy/utils/Initializable.sol)
+
+pragma solidity ^0.8.20;
+
+/**
+ * @dev This is a base contract to aid in writing upgradeable contracts, or any kind of contract that will be deployed
+ * behind a proxy. Since proxied contracts do not make use of a constructor, it's common to move constructor logic to an
+ * external initializer function, usually called `initialize`. It then becomes necessary to protect this initializer
+ * function so it can only be called once. The {initializer} modifier provided by this contract will have this effect.
+ *
+ * The initialization functions use a version number. Once a version number is used, it is consumed and cannot be
+ * reused. This mechanism prevents re-execution of each "step" but allows the creation of new initialization steps in
+ * case an upgrade adds a module that needs to be initialized.
+ *
+ * For example:
+ *
+ * [.hljs-theme-light.nopadding]
+ * ```solidity
+ * contract MyToken is ERC20Upgradeable {
+ *     function initialize() initializer public {
+ *         __ERC20_init("MyToken", "MTK");
+ *     }
+ * }
+ *
+ * contract MyTokenV2 is MyToken, ERC20PermitUpgradeable {
+ *     function initializeV2() reinitializer(2) public {
+ *         __ERC20Permit_init("MyToken");
+ *     }
+ * }
+ * ```
+ *
+ * TIP: To avoid leaving the proxy in an uninitialized state, the initializer function should be called as early as
+ * possible by providing the encoded function call as the `_data` argument to {ERC1967Proxy-constructor}.
+ *
+ * CAUTION: When used with inheritance, manual care must be taken to not invoke a parent initializer twice, or to ensure
+ * that all initializers are idempotent. This is not verified automatically as constructors are by Solidity.
+ *
+ * [CAUTION]
+ * ====
+ * Avoid leaving a contract uninitialized.
+ *
+ * An uninitialized contract can be taken over by an attacker. This applies to both a proxy and its implementation
+ * contract, which may impact the proxy. To prevent the implementation contract from being used, you should invoke
+ * the {_disableInitializers} function in the constructor to automatically lock it when it is deployed:
+ *
+ * [.hljs-theme-light.nopadding]
+ * ```
+ * /// @custom:oz-upgrades-unsafe-allow constructor
+ * constructor() {
+ *     _disableInitializers();
+ * }
+ * ```
+ * ====
+ */
+abstract contract Initializable {
+    /**
+     * @dev Storage of the initializable contract.
+     *
+     * It's implemented on a custom ERC-7201 namespace to reduce the risk of storage collisions
+     * when using with upgradeable contracts.
+     *
+     * @custom:storage-location erc7201:openzeppelin.storage.Initializable
+     */
+    struct InitializableStorage {
+        /**
+         * @dev Indicates that the contract has been initialized.
+         */
+        uint64 _initialized;
+        /**
+         * @dev Indicates that the contract is in the process of being initialized.
+         */
+        bool _initializing;
+    }
+
+    // keccak256(abi.encode(uint256(keccak256("openzeppelin.storage.Initializable")) - 1)) & ~bytes32(uint256(0xff))
+    bytes32 private constant INITIALIZABLE_STORAGE = 0xf0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a00;
+
+    /**
+     * @dev The contract is already initialized.
+     */
+    error InvalidInitialization();
+
+    /**
+     * @dev The contract is not initializing.
+     */
+    error NotInitializing();
+
+    /**
+     * @dev Triggered when the contract has been initialized or reinitialized.
+     */
+    event Initialized(uint64 version);
+
+    /**
+     * @dev A modifier that defines a protected initializer function that can be invoked at most once. In its scope,
+     * `onlyInitializing` functions can be used to initialize parent contracts.
+     *
+     * Similar to `reinitializer(1)`, except that in the context of a constructor an `initializer` may be invoked any
+     * number of times. This behavior in the constructor can be useful during testing and is not expected to be used in
+     * production.
+     *
+     * Emits an {Initialized} event.
+     */
+    modifier initializer() {
+        // solhint-disable-next-line var-name-mixedcase
+        InitializableStorage storage $ = _getInitializableStorage();
+
+        // Cache values to avoid duplicated sloads
+        bool isTopLevelCall = !$._initializing;
+        uint64 initialized = $._initialized;
+
+        // Allowed calls:
+        // - initialSetup: the contract is not in the initializing state and no previous version was
+        //                 initialized
+        // - construction: the contract is initialized at version 1 (no reininitialization) and the
+        //                 current contract is just being deployed
+        bool initialSetup = initialized == 0 && isTopLevelCall;
+        bool construction = initialized == 1 && address(this).code.length == 0;
+
+        if (!initialSetup && !construction) {
+            revert InvalidInitialization();
+        }
+        $._initialized = 1;
+        if (isTopLevelCall) {
+            $._initializing = true;
+        }
+        _;
+        if (isTopLevelCall) {
+            $._initializing = false;
+            emit Initialized(1);
+        }
+    }
+
+    /**
+     * @dev A modifier that defines a protected reinitializer function that can be invoked at most once, and only if the
+     * contract hasn't been initialized to a greater version before. In its scope, `onlyInitializing` functions can be
+     * used to initialize parent contracts.
+     *
+     * A reinitializer may be used after the original initialization step. This is essential to configure modules that
+     * are added through upgrades and that require initialization.
+     *
+     * When `version` is 1, this modifier is similar to `initializer`, except that functions marked with `reinitializer`
+     * cannot be nested. If one is invoked in the context of another, execution will revert.
+     *
+     * Note that versions can jump in increments greater than 1; this implies that if multiple reinitializers coexist in
+     * a contract, executing them in the right order is up to the developer or operator.
+     *
+     * WARNING: Setting the version to 2**64 - 1 will prevent any future reinitialization.
+     *
+     * Emits an {Initialized} event.
+     */
+    modifier reinitializer(uint64 version) {
+        // solhint-disable-next-line var-name-mixedcase
+        InitializableStorage storage $ = _getInitializableStorage();
+
+        if ($._initializing || $._initialized >= version) {
+            revert InvalidInitialization();
+        }
+        $._initialized = version;
+        $._initializing = true;
+        _;
+        $._initializing = false;
+        emit Initialized(version);
+    }
+
+    /**
+     * @dev Modifier to protect an initialization function so that it can only be invoked by functions with the
+     * {initializer} and {reinitializer} modifiers, directly or indirectly.
+     */
+    modifier onlyInitializing() {
+        _checkInitializing();
+        _;
+    }
+
+    /**
+     * @dev Reverts if the contract is not in an initializing state. See {onlyInitializing}.
+     */
+    function _checkInitializing() internal view virtual {
+        if (!_isInitializing()) {
+            revert NotInitializing();
+        }
+    }
+
+    /**
+     * @dev Locks the contract, preventing any future reinitialization. This cannot be part of an initializer call.
+     * Calling this in the constructor of a contract will prevent that contract from being initialized or reinitialized
+     * to any version. It is recommended to use this to lock implementation contracts that are designed to be called
+     * through proxies.
+     *
+     * Emits an {Initialized} event the first time it is successfully executed.
+     */
+    function _disableInitializers() internal virtual {
+        // solhint-disable-next-line var-name-mixedcase
+        InitializableStorage storage $ = _getInitializableStorage();
+
+        if ($._initializing) {
+            revert InvalidInitialization();
+        }
+        if ($._initialized != type(uint64).max) {
+            $._initialized = type(uint64).max;
+            emit Initialized(type(uint64).max);
+        }
+    }
+
+    /**
+     * @dev Returns the highest version that has been initialized. See {reinitializer}.
+     */
+    function _getInitializedVersion() internal view returns (uint64) {
+        return _getInitializableStorage()._initialized;
+    }
+
+    /**
+     * @dev Returns `true` if the contract is currently initializing. See {onlyInitializing}.
+     */
+    function _isInitializing() internal view returns (bool) {
+        return _getInitializableStorage()._initializing;
+    }
+
+    /**
+     * @dev Returns a pointer to the storage namespace.
+     */
+    // solhint-disable-next-line var-name-mixedcase
+    function _getInitializableStorage() private pure returns (InitializableStorage storage $) {
+        assembly {
+            $.slot := INITIALIZABLE_STORAGE
+        }
+    }
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts (last updated v5.0.0) (token/ERC20/ERC20.sol)
+
+pragma solidity ^0.8.20;
+
+import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
+import {IERC20Metadata} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
+import {ContextUpgradeable} from "../../utils/ContextUpgradeable.sol";
+import {IERC20Errors} from "@openzeppelin/contracts/interfaces/draft-IERC6093.sol";
+import {Initializable} from "../../proxy/utils/Initializable.sol";
+
+/**
+ * @dev Implementation of the {IERC20} interface.
+ *
+ * This implementation is agnostic to the way tokens are created. This means
+ * that a supply mechanism has to be added in a derived contract using {_mint}.
+ *
+ * TIP: For a detailed writeup see our guide
+ * https://forum.openzeppelin.com/t/how-to-implement-erc20-supply-mechanisms/226[How
+ * to implement supply mechanisms].
+ *
+ * The default value of {decimals} is 18. To change this, you should override
+ * this function so it returns a different value.
+ *
+ * We have followed general OpenZeppelin Contracts guidelines: functions revert
+ * instead returning `false` on failure. This behavior is nonetheless
+ * conventional and does not conflict with the expectations of ERC20
+ * applications.
+ *
+ * Additionally, an {Approval} event is emitted on calls to {transferFrom}.
+ * This allows applications to reconstruct the allowance for all accounts just
+ * by listening to said events. Other implementations of the EIP may not emit
+ * these events, as it isn't required by the specification.
+ */
+abstract contract ERC20Upgradeable is Initializable, ContextUpgradeable, IERC20, IERC20Metadata, IERC20Errors {
+    /// @custom:storage-location erc7201:openzeppelin.storage.ERC20
+    struct ERC20Storage {
+        mapping(address account => uint256) _balances;
+
+        mapping(address account => mapping(address spender => uint256)) _allowances;
+
+        uint256 _totalSupply;
+
+        string _name;
+        string _symbol;
+    }
+
+    // keccak256(abi.encode(uint256(keccak256("openzeppelin.storage.ERC20")) - 1)) & ~bytes32(uint256(0xff))
+    bytes32 private constant ERC20StorageLocation = 0x52c63247e1f47db19d5ce0460030c497f067ca4cebf71ba98eeadabe20bace00;
+
+    function _getERC20Storage() private pure returns (ERC20Storage storage $) {
+        assembly {
+            $.slot := ERC20StorageLocation
+        }
+    }
+
+    /**
+     * @dev Sets the values for {name} and {symbol}.
+     *
+     * All two of these values are immutable: they can only be set once during
+     * construction.
+     */
+    function __ERC20_init(string memory name_, string memory symbol_) internal onlyInitializing {
+        __ERC20_init_unchained(name_, symbol_);
+    }
+
+    function __ERC20_init_unchained(string memory name_, string memory symbol_) internal onlyInitializing {
+        ERC20Storage storage $ = _getERC20Storage();
+        $._name = name_;
+        $._symbol = symbol_;
+    }
+
+    /**
+     * @dev Returns the name of the token.
+     */
+    function name() public view virtual returns (string memory) {
+        ERC20Storage storage $ = _getERC20Storage();
+        return $._name;
+    }
+
+    /**
+     * @dev Returns the symbol of the token, usually a shorter version of the
+     * name.
+     */
+    function symbol() public view virtual returns (string memory) {
+        ERC20Storage storage $ = _getERC20Storage();
+        return $._symbol;
+    }
+
+    /**
+     * @dev Returns the number of decimals used to get its user representation.
+     * For example, if `decimals` equals `2`, a balance of `505` tokens should
+     * be displayed to a user as `5.05` (`505 / 10 ** 2`).
+     *
+     * Tokens usually opt for a value of 18, imitating the relationship between
+     * Ether and Wei. This is the default value returned by this function, unless
+     * it's overridden.
+     *
+     * NOTE: This information is only used for _display_ purposes: it in
+     * no way affects any of the arithmetic of the contract, including
+     * {IERC20-balanceOf} and {IERC20-transfer}.
+     */
+    function decimals() public view virtual returns (uint8) {
+        return 18;
+    }
+
+    /**
+     * @dev See {IERC20-totalSupply}.
+     */
+    function totalSupply() public view virtual returns (uint256) {
+        ERC20Storage storage $ = _getERC20Storage();
+        return $._totalSupply;
+    }
+
+    /**
+     * @dev See {IERC20-balanceOf}.
+     */
+    function balanceOf(address account) public view virtual returns (uint256) {
+        ERC20Storage storage $ = _getERC20Storage();
+        return $._balances[account];
+    }
+
+    /**
+     * @dev See {IERC20-transfer}.
+     *
+     * Requirements:
+     *
+     * - `to` cannot be the zero address.
+     * - the caller must have a balance of at least `value`.
+     */
+    function transfer(address to, uint256 value) public virtual returns (bool) {
+        address owner = _msgSender();
+        _transfer(owner, to, value);
+        return true;
+    }
+
+    /**
+     * @dev See {IERC20-allowance}.
+     */
+    function allowance(address owner, address spender) public view virtual returns (uint256) {
+        ERC20Storage storage $ = _getERC20Storage();
+        return $._allowances[owner][spender];
+    }
+
+    /**
+     * @dev See {IERC20-approve}.
+     *
+     * NOTE: If `value` is the maximum `uint256`, the allowance is not updated on
+     * `transferFrom`. This is semantically equivalent to an infinite approval.
+     *
+     * Requirements:
+     *
+     * - `spender` cannot be the zero address.
+     */
+    function approve(address spender, uint256 value) public virtual returns (bool) {
+        address owner = _msgSender();
+        _approve(owner, spender, value);
+        return true;
+    }
+
+    /**
+     * @dev See {IERC20-transferFrom}.
+     *
+     * Emits an {Approval} event indicating the updated allowance. This is not
+     * required by the EIP. See the note at the beginning of {ERC20}.
+     *
+     * NOTE: Does not update the allowance if the current allowance
+     * is the maximum `uint256`.
+     *
+     * Requirements:
+     *
+     * - `from` and `to` cannot be the zero address.
+     * - `from` must have a balance of at least `value`.
+     * - the caller must have allowance for ``from``'s tokens of at least
+     * `value`.
+     */
+    function transferFrom(address from, address to, uint256 value) public virtual returns (bool) {
+        address spender = _msgSender();
+        _spendAllowance(from, spender, value);
+        _transfer(from, to, value);
+        return true;
+    }
+
+    /**
+     * @dev Moves a `value` amount of tokens from `from` to `to`.
+     *
+     * This internal function is equivalent to {transfer}, and can be used to
+     * e.g. implement automatic token fees, slashing mechanisms, etc.
+     *
+     * Emits a {Transfer} event.
+     *
+     * NOTE: This function is not virtual, {_update} should be overridden instead.
+     */
+    function _transfer(address from, address to, uint256 value) internal {
+        if (from == address(0)) {
+            revert ERC20InvalidSender(address(0));
+        }
+        if (to == address(0)) {
+            revert ERC20InvalidReceiver(address(0));
+        }
+        _update(from, to, value);
+    }
+
+    /**
+     * @dev Transfers a `value` amount of tokens from `from` to `to`, or alternatively mints (or burns) if `from`
+     * (or `to`) is the zero address. All customizations to transfers, mints, and burns should be done by overriding
+     * this function.
+     *
+     * Emits a {Transfer} event.
+     */
+    function _update(address from, address to, uint256 value) internal virtual {
+        ERC20Storage storage $ = _getERC20Storage();
+        if (from == address(0)) {
+            // Overflow check required: The rest of the code assumes that totalSupply never overflows
+            $._totalSupply += value;
+        } else {
+            uint256 fromBalance = $._balances[from];
+            if (fromBalance < value) {
+                revert ERC20InsufficientBalance(from, fromBalance, value);
+            }
+            unchecked {
+                // Overflow not possible: value <= fromBalance <= totalSupply.
+                $._balances[from] = fromBalance - value;
+            }
+        }
+
+        if (to == address(0)) {
+            unchecked {
+                // Overflow not possible: value <= totalSupply or value <= fromBalance <= totalSupply.
+                $._totalSupply -= value;
+            }
+        } else {
+            unchecked {
+                // Overflow not possible: balance + value is at most totalSupply, which we know fits into a uint256.
+                $._balances[to] += value;
+            }
+        }
+
+        emit Transfer(from, to, value);
+    }
+
+    /**
+     * @dev Creates a `value` amount of tokens and assigns them to `account`, by transferring it from address(0).
+     * Relies on the `_update` mechanism
+     *
+     * Emits a {Transfer} event with `from` set to the zero address.
+     *
+     * NOTE: This function is not virtual, {_update} should be overridden instead.
+     */
+    function _mint(address account, uint256 value) internal {
+        if (account == address(0)) {
+            revert ERC20InvalidReceiver(address(0));
+        }
+        _update(address(0), account, value);
+    }
+
+    /**
+     * @dev Destroys a `value` amount of tokens from `account`, lowering the total supply.
+     * Relies on the `_update` mechanism.
+     *
+     * Emits a {Transfer} event with `to` set to the zero address.
+     *
+     * NOTE: This function is not virtual, {_update} should be overridden instead
+     */
+    function _burn(address account, uint256 value) internal {
+        if (account == address(0)) {
+            revert ERC20InvalidSender(address(0));
+        }
+        _update(account, address(0), value);
+    }
+
+    /**
+     * @dev Sets `value` as the allowance of `spender` over the `owner` s tokens.
+     *
+     * This internal function is equivalent to `approve`, and can be used to
+     * e.g. set automatic allowances for certain subsystems, etc.
+     *
+     * Emits an {Approval} event.
+     *
+     * Requirements:
+     *
+     * - `owner` cannot be the zero address.
+     * - `spender` cannot be the zero address.
+     *
+     * Overrides to this logic should be done to the variant with an additional `bool emitEvent` argument.
+     */
+    function _approve(address owner, address spender, uint256 value) internal {
+        _approve(owner, spender, value, true);
+    }
+
+    /**
+     * @dev Variant of {_approve} with an optional flag to enable or disable the {Approval} event.
+     *
+     * By default (when calling {_approve}) the flag is set to true. On the other hand, approval changes made by
+     * `_spendAllowance` during the `transferFrom` operation set the flag to false. This saves gas by not emitting any
+     * `Approval` event during `transferFrom` operations.
+     *
+     * Anyone who wishes to continue emitting `Approval` events on the`transferFrom` operation can force the flag to
+     * true using the following override:
+     * ```
+     * function _approve(address owner, address spender, uint256 value, bool) internal virtual override {
+     *     super._approve(owner, spender, value, true);
+     * }
+     * ```
+     *
+     * Requirements are the same as {_approve}.
+     */
+    function _approve(address owner, address spender, uint256 value, bool emitEvent) internal virtual {
+        ERC20Storage storage $ = _getERC20Storage();
+        if (owner == address(0)) {
+            revert ERC20InvalidApprover(address(0));
+        }
+        if (spender == address(0)) {
+            revert ERC20InvalidSpender(address(0));
+        }
+        $._allowances[owner][spender] = value;
+        if (emitEvent) {
+            emit Approval(owner, spender, value);
+        }
+    }
+
+    /**
+     * @dev Updates `owner` s allowance for `spender` based on spent `value`.
+     *
+     * Does not update the allowance value in case of infinite allowance.
+     * Revert if not enough allowance is available.
+     *
+     * Does not emit an {Approval} event.
+     */
+    function _spendAllowance(address owner, address spender, uint256 value) internal virtual {
+        uint256 currentAllowance = allowance(owner, spender);
+        if (currentAllowance != type(uint256).max) {
+            if (currentAllowance < value) {
+                revert ERC20InsufficientAllowance(spender, currentAllowance, value);
+            }
+            unchecked {
+                _approve(owner, spender, currentAllowance - value, false);
+            }
+        }
+    }
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts (last updated v5.0.0) (token/ERC20/extensions/ERC20Permit.sol)
+
+pragma solidity ^0.8.20;
+
+import {IERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Permit.sol";
+import {ERC20Upgradeable} from "../ERC20Upgradeable.sol";
+import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
+import {EIP712Upgradeable} from "../../../utils/cryptography/EIP712Upgradeable.sol";
+import {NoncesUpgradeable} from "../../../utils/NoncesUpgradeable.sol";
+import {Initializable} from "../../../proxy/utils/Initializable.sol";
+
+/**
+ * @dev Implementation of the ERC20 Permit extension allowing approvals to be made via signatures, as defined in
+ * https://eips.ethereum.org/EIPS/eip-2612[EIP-2612].
+ *
+ * Adds the {permit} method, which can be used to change an account's ERC20 allowance (see {IERC20-allowance}) by
+ * presenting a message signed by the account. By not relying on `{IERC20-approve}`, the token holder account doesn't
+ * need to send a transaction, and thus is not required to hold Ether at all.
+ */
+abstract contract ERC20PermitUpgradeable is Initializable, ERC20Upgradeable, IERC20Permit, EIP712Upgradeable, NoncesUpgradeable {
+    bytes32 private constant PERMIT_TYPEHASH =
+        keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)");
+
+    /**
+     * @dev Permit deadline has expired.
+     */
+    error ERC2612ExpiredSignature(uint256 deadline);
+
+    /**
+     * @dev Mismatched signature.
+     */
+    error ERC2612InvalidSigner(address signer, address owner);
+
+    /**
+     * @dev Initializes the {EIP712} domain separator using the `name` parameter, and setting `version` to `"1"`.
+     *
+     * It's a good idea to use the same `name` that is defined as the ERC20 token name.
+     */
+    function __ERC20Permit_init(string memory name) internal onlyInitializing {
+        __EIP712_init_unchained(name, "1");
+    }
+
+    function __ERC20Permit_init_unchained(string memory) internal onlyInitializing {}
+
+    /**
+     * @inheritdoc IERC20Permit
+     */
+    function permit(
+        address owner,
+        address spender,
+        uint256 value,
+        uint256 deadline,
+        uint8 v,
+        bytes32 r,
+        bytes32 s
+    ) public virtual {
+        if (block.timestamp > deadline) {
+            revert ERC2612ExpiredSignature(deadline);
+        }
+
+        bytes32 structHash = keccak256(abi.encode(PERMIT_TYPEHASH, owner, spender, value, _useNonce(owner), deadline));
+
+        bytes32 hash = _hashTypedDataV4(structHash);
+
+        address signer = ECDSA.recover(hash, v, r, s);
+        if (signer != owner) {
+            revert ERC2612InvalidSigner(signer, owner);
+        }
+
+        _approve(owner, spender, value);
+    }
+
+    /**
+     * @inheritdoc IERC20Permit
+     */
+    function nonces(address owner) public view virtual override(IERC20Permit, NoncesUpgradeable) returns (uint256) {
+        return super.nonces(owner);
+    }
+
+    /**
+     * @inheritdoc IERC20Permit
+     */
+    // solhint-disable-next-line func-name-mixedcase
+    function DOMAIN_SEPARATOR() external view virtual returns (bytes32) {
+        return _domainSeparatorV4();
+    }
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts (last updated v5.0.0) (token/ERC20/extensions/ERC4626.sol)
+
+pragma solidity ^0.8.20;
+
+import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
+import {IERC20Metadata} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
+import {ERC20Upgradeable} from "../ERC20Upgradeable.sol";
+import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
+import {IERC4626} from "@openzeppelin/contracts/interfaces/IERC4626.sol";
+import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";
+import {Initializable} from "../../../proxy/utils/Initializable.sol";
+
+/**
+ * @dev Implementation of the ERC4626 "Tokenized Vault Standard" as defined in
+ * https://eips.ethereum.org/EIPS/eip-4626[EIP-4626].
+ *
+ * This extension allows the minting and burning of "shares" (represented using the ERC20 inheritance) in exchange for
+ * underlying "assets" through standardized {deposit}, {mint}, {redeem} and {burn} workflows. This contract extends
+ * the ERC20 standard. Any additional extensions included along it would affect the "shares" token represented by this
+ * contract and not the "assets" token which is an independent contract.
+ *
+ * [CAUTION]
+ * ====
+ * In empty (or nearly empty) ERC-4626 vaults, deposits are at high risk of being stolen through frontrunning
+ * with a "donation" to the vault that inflates the price of a share. This is variously known as a donation or inflation
+ * attack and is essentially a problem of slippage. Vault deployers can protect against this attack by making an initial
+ * deposit of a non-trivial amount of the asset, such that price manipulation becomes infeasible. Withdrawals may
+ * similarly be affected by slippage. Users can protect against this attack as well as unexpected slippage in general by
+ * verifying the amount received is as expected, using a wrapper that performs these checks such as
+ * https://github.com/fei-protocol/ERC4626#erc4626router-and-base[ERC4626Router].
+ *
+ * Since v4.9, this implementation uses virtual assets and shares to mitigate that risk. The `_decimalsOffset()`
+ * corresponds to an offset in the decimal representation between the underlying asset's decimals and the vault
+ * decimals. This offset also determines the rate of virtual shares to virtual assets in the vault, which itself
+ * determines the initial exchange rate. While not fully preventing the attack, analysis shows that the default offset
+ * (0) makes it non-profitable, as a result of the value being captured by the virtual shares (out of the attacker's
+ * donation) matching the attacker's expected gains. With a larger offset, the attack becomes orders of magnitude more
+ * expensive than it is profitable. More details about the underlying math can be found
+ * xref:erc4626.adoc#inflation-attack[here].
+ *
+ * The drawback of this approach is that the virtual shares do capture (a very small) part of the value being accrued
+ * to the vault. Also, if the vault experiences losses, the users try to exit the vault, the virtual shares and assets
+ * will cause the first user to exit to experience reduced losses in detriment to the last users that will experience
+ * bigger losses. Developers willing to revert back to the pre-v4.9 behavior just need to override the
+ * `_convertToShares` and `_convertToAssets` functions.
+ *
+ * To learn more, check out our xref:ROOT:erc4626.adoc[ERC-4626 guide].
+ * ====
+ */
+abstract contract ERC4626Upgradeable is Initializable, ERC20Upgradeable, IERC4626 {
+    using Math for uint256;
+
+    /// @custom:storage-location erc7201:openzeppelin.storage.ERC4626
+    struct ERC4626Storage {
+        IERC20 _asset;
+        uint8 _underlyingDecimals;
+    }
+
+    // keccak256(abi.encode(uint256(keccak256("openzeppelin.storage.ERC4626")) - 1)) & ~bytes32(uint256(0xff))
+    bytes32 private constant ERC4626StorageLocation = 0x0773e532dfede91f04b12a73d3d2acd361424f41f76b4fb79f090161e36b4e00;
+
+    function _getERC4626Storage() private pure returns (ERC4626Storage storage $) {
+        assembly {
+            $.slot := ERC4626StorageLocation
+        }
+    }
+
+    /**
+     * @dev Attempted to deposit more assets than the max amount for `receiver`.
+     */
+    error ERC4626ExceededMaxDeposit(address receiver, uint256 assets, uint256 max);
+
+    /**
+     * @dev Attempted to mint more shares than the max amount for `receiver`.
+     */
+    error ERC4626ExceededMaxMint(address receiver, uint256 shares, uint256 max);
+
+    /**
+     * @dev Attempted to withdraw more assets than the max amount for `receiver`.
+     */
+    error ERC4626ExceededMaxWithdraw(address owner, uint256 assets, uint256 max);
+
+    /**
+     * @dev Attempted to redeem more shares than the max amount for `receiver`.
+     */
+    error ERC4626ExceededMaxRedeem(address owner, uint256 shares, uint256 max);
+
+    /**
+     * @dev Set the underlying asset contract. This must be an ERC20-compatible contract (ERC20 or ERC777).
+     */
+    function __ERC4626_init(IERC20 asset_) internal onlyInitializing {
+        __ERC4626_init_unchained(asset_);
+    }
+
+    function __ERC4626_init_unchained(IERC20 asset_) internal onlyInitializing {
+        ERC4626Storage storage $ = _getERC4626Storage();
+        (bool success, uint8 assetDecimals) = _tryGetAssetDecimals(asset_);
+        $._underlyingDecimals = success ? assetDecimals : 18;
+        $._asset = asset_;
+    }
+
+    /**
+     * @dev Attempts to fetch the asset decimals. A return value of false indicates that the attempt failed in some way.
+     */
+    function _tryGetAssetDecimals(IERC20 asset_) private view returns (bool, uint8) {
+        (bool success, bytes memory encodedDecimals) = address(asset_).staticcall(
+            abi.encodeCall(IERC20Metadata.decimals, ())
+        );
+        if (success && encodedDecimals.length >= 32) {
+            uint256 returnedDecimals = abi.decode(encodedDecimals, (uint256));
+            if (returnedDecimals <= type(uint8).max) {
+                return (true, uint8(returnedDecimals));
+            }
+        }
+        return (false, 0);
+    }
+
+    /**
+     * @dev Decimals are computed by adding the decimal offset on top of the underlying asset's decimals. This
+     * "original" value is cached during construction of the vault contract. If this read operation fails (e.g., the
+     * asset has not been created yet), a default of 18 is used to represent the underlying asset's decimals.
+     *
+     * See {IERC20Metadata-decimals}.
+     */
+    function decimals() public view virtual override(IERC20Metadata, ERC20Upgradeable) returns (uint8) {
+        ERC4626Storage storage $ = _getERC4626Storage();
+        return $._underlyingDecimals + _decimalsOffset();
+    }
+
+    /** @dev See {IERC4626-asset}. */
+    function asset() public view virtual returns (address) {
+        ERC4626Storage storage $ = _getERC4626Storage();
+        return address($._asset);
+    }
+
+    /** @dev See {IERC4626-totalAssets}. */
+    function totalAssets() public view virtual returns (uint256) {
+        ERC4626Storage storage $ = _getERC4626Storage();
+        return $._asset.balanceOf(address(this));
+    }
+
+    /** @dev See {IERC4626-convertToShares}. */
+    function convertToShares(uint256 assets) public view virtual returns (uint256) {
+        return _convertToShares(assets, Math.Rounding.Floor);
+    }
+
+    /** @dev See {IERC4626-convertToAssets}. */
+    function convertToAssets(uint256 shares) public view virtual returns (uint256) {
+        return _convertToAssets(shares, Math.Rounding.Floor);
+    }
+
+    /** @dev See {IERC4626-maxDeposit}. */
+    function maxDeposit(address) public view virtual returns (uint256) {
+        return type(uint256).max;
+    }
+
+    /** @dev See {IERC4626-maxMint}. */
+    function maxMint(address) public view virtual returns (uint256) {
+        return type(uint256).max;
+    }
+
+    /** @dev See {IERC4626-maxWithdraw}. */
+    function maxWithdraw(address owner) public view virtual returns (uint256) {
+        return _convertToAssets(balanceOf(owner), Math.Rounding.Floor);
+    }
+
+    /** @dev See {IERC4626-maxRedeem}. */
+    function maxRedeem(address owner) public view virtual returns (uint256) {
+        return balanceOf(owner);
+    }
+
+    /** @dev See {IERC4626-previewDeposit}. */
+    function previewDeposit(uint256 assets) public view virtual returns (uint256) {
+        return _convertToShares(assets, Math.Rounding.Floor);
+    }
+
+    /** @dev See {IERC4626-previewMint}. */
+    function previewMint(uint256 shares) public view virtual returns (uint256) {
+        return _convertToAssets(shares, Math.Rounding.Ceil);
+    }
+
+    /** @dev See {IERC4626-previewWithdraw}. */
+    function previewWithdraw(uint256 assets) public view virtual returns (uint256) {
+        return _convertToShares(assets, Math.Rounding.Ceil);
+    }
+
+    /** @dev See {IERC4626-previewRedeem}. */
+    function previewRedeem(uint256 shares) public view virtual returns (uint256) {
+        return _convertToAssets(shares, Math.Rounding.Floor);
+    }
+
+    /** @dev See {IERC4626-deposit}. */
+    function deposit(uint256 assets, address receiver) public virtual returns (uint256) {
+        uint256 maxAssets = maxDeposit(receiver);
+        if (assets > maxAssets) {
+            revert ERC4626ExceededMaxDeposit(receiver, assets, maxAssets);
+        }
+
+        uint256 shares = previewDeposit(assets);
+        _deposit(_msgSender(), receiver, assets, shares);
+
+        return shares;
+    }
+
+    /** @dev See {IERC4626-mint}.
+     *
+     * As opposed to {deposit}, minting is allowed even if the vault is in a state where the price of a share is zero.
+     * In this case, the shares will be minted without requiring any assets to be deposited.
+     */
+    function mint(uint256 shares, address receiver) public virtual returns (uint256) {
+        uint256 maxShares = maxMint(receiver);
+        if (shares > maxShares) {
+            revert ERC4626ExceededMaxMint(receiver, shares, maxShares);
+        }
+
+        uint256 assets = previewMint(shares);
+        _deposit(_msgSender(), receiver, assets, shares);
+
+        return assets;
+    }
+
+    /** @dev See {IERC4626-withdraw}. */
+    function withdraw(uint256 assets, address receiver, address owner) public virtual returns (uint256) {
+        uint256 maxAssets = maxWithdraw(owner);
+        if (assets > maxAssets) {
+            revert ERC4626ExceededMaxWithdraw(owner, assets, maxAssets);
+        }
+
+        uint256 shares = previewWithdraw(assets);
+        _withdraw(_msgSender(), receiver, owner, assets, shares);
+
+        return shares;
+    }
+
+    /** @dev See {IERC4626-redeem}. */
+    function redeem(uint256 shares, address receiver, address owner) public virtual returns (uint256) {
+        uint256 maxShares = maxRedeem(owner);
+        if (shares > maxShares) {
+            revert ERC4626ExceededMaxRedeem(owner, shares, maxShares);
+        }
+
+        uint256 assets = previewRedeem(shares);
+        _withdraw(_msgSender(), receiver, owner, assets, shares);
+
+        return assets;
+    }
+
+    /**
+     * @dev Internal conversion function (from assets to shares) with support for rounding direction.
+     */
+    function _convertToShares(uint256 assets, Math.Rounding rounding) internal view virtual returns (uint256) {
+        return assets.mulDiv(totalSupply() + 10 ** _decimalsOffset(), totalAssets() + 1, rounding);
+    }
+
+    /**
+     * @dev Internal conversion function (from shares to assets) with support for rounding direction.
+     */
+    function _convertToAssets(uint256 shares, Math.Rounding rounding) internal view virtual returns (uint256) {
+        return shares.mulDiv(totalAssets() + 1, totalSupply() + 10 ** _decimalsOffset(), rounding);
+    }
+
+    /**
+     * @dev Deposit/mint common workflow.
+     */
+    function _deposit(address caller, address receiver, uint256 assets, uint256 shares) internal virtual {
+        ERC4626Storage storage $ = _getERC4626Storage();
+        // If _asset is ERC777, `transferFrom` can trigger a reentrancy BEFORE the transfer happens through the
+        // `tokensToSend` hook. On the other hand, the `tokenReceived` hook, that is triggered after the transfer,
+        // calls the vault, which is assumed not malicious.
+        //
+        // Conclusion: we need to do the transfer before we mint so that any reentrancy would happen before the
+        // assets are transferred and before the shares are minted, which is a valid state.
+        // slither-disable-next-line reentrancy-no-eth
+        SafeERC20.safeTransferFrom($._asset, caller, address(this), assets);
+        _mint(receiver, shares);
+
+        emit Deposit(caller, receiver, assets, shares);
+    }
+
+    /**
+     * @dev Withdraw/redeem common workflow.
+     */
+    function _withdraw(
+        address caller,
+        address receiver,
+        address owner,
+        uint256 assets,
+        uint256 shares
+    ) internal virtual {
+        ERC4626Storage storage $ = _getERC4626Storage();
+        if (caller != owner) {
+            _spendAllowance(owner, caller, shares);
+        }
+
+        // If _asset is ERC777, `transfer` can trigger a reentrancy AFTER the transfer happens through the
+        // `tokensReceived` hook. On the other hand, the `tokensToSend` hook, that is triggered before the transfer,
+        // calls the vault, which is assumed not malicious.
+        //
+        // Conclusion: we need to do the transfer after the burn so that any reentrancy would happen after the
+        // shares are burned and after the assets are transferred, which is a valid state.
+        _burn(owner, shares);
+        SafeERC20.safeTransfer($._asset, receiver, assets);
+
+        emit Withdraw(caller, receiver, owner, assets, shares);
+    }
+
+    function _decimalsOffset() internal view virtual returns (uint8) {
+        return 0;
+    }
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts (last updated v5.0.0) (token/ERC721/ERC721.sol)
+
+pragma solidity ^0.8.20;
+
+import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
+import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
+import {IERC721Metadata} from "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
+import {ContextUpgradeable} from "../../utils/ContextUpgradeable.sol";
+import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
+import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
+import {ERC165Upgradeable} from "../../utils/introspection/ERC165Upgradeable.sol";
+import {IERC721Errors} from "@openzeppelin/contracts/interfaces/draft-IERC6093.sol";
+import {Initializable} from "../../proxy/utils/Initializable.sol";
+
+/**
+ * @dev Implementation of https://eips.ethereum.org/EIPS/eip-721[ERC721] Non-Fungible Token Standard, including
+ * the Metadata extension, but not including the Enumerable extension, which is available separately as
+ * {ERC721Enumerable}.
+ */
+abstract contract ERC721Upgradeable is Initializable, ContextUpgradeable, ERC165Upgradeable, IERC721, IERC721Metadata, IERC721Errors {
+    using Strings for uint256;
+
+    /// @custom:storage-location erc7201:openzeppelin.storage.ERC721
+    struct ERC721Storage {
+        // Token name
+        string _name;
+
+        // Token symbol
+        string _symbol;
+
+        mapping(uint256 tokenId => address) _owners;
+
+        mapping(address owner => uint256) _balances;
+
+        mapping(uint256 tokenId => address) _tokenApprovals;
+
+        mapping(address owner => mapping(address operator => bool)) _operatorApprovals;
+    }
+
+    // keccak256(abi.encode(uint256(keccak256("openzeppelin.storage.ERC721")) - 1)) & ~bytes32(uint256(0xff))
+    bytes32 private constant ERC721StorageLocation = 0x80bb2b638cc20bc4d0a60d66940f3ab4a00c1d7b313497ca82fb0b4ab0079300;
+
+    function _getERC721Storage() private pure returns (ERC721S
[truncated — full diff is 639,324 bytes]
```

</details>

🔒 **Immutable References:** `harvester()` → RewardHarvester, `base()` → fxSP (TransparentUpgradeableProxy), `gauge()` → fxSP-Gauge (TransparentUpgradeableProxy), `vault()` → StakingProxyERC20

### 🔴 `upgradeability (TransparentUpgradeable)`

> ⚠️ **CRITICAL** — Upgradeability allows arbitrary code replacement. Must be behind both a Multisig AND a Timelock.

**Privileged write functions:**  
**Capabilities:** ⬆️ **UPGRADE**
- `upgradeTo(address)` — Upgrade proxy implementation to a new address `[UPGRADE]`
- `upgradeToAndCall(address,bytes)` — Upgrade proxy implementation and call an initializer `[UPGRADE]`

**Members (1):**

| Address | Name / Type | Risk | Granted | Source | Details |
|---|---|---|---|---|---|
| `0x68863fb8855b04509a835082478D6E3D0bE4E61a` | [↳ TimelockController (3d)](#c-0x68863fb8855b04509a835082478d6e3d0be4e61a) | 🟢 LOW | — | Storage only | 3d delay (⚠ changed 1x) |


**Delay history for `TimelockController (3d)` (0x6886...E61a):** 3d → 3d

### 🟢 `DEFAULT_ADMIN_ROLE` 🔄 6 changes

**Hash:** `0x0000000000000000000000000000000000000000000000000000000000000000`  
**Managed by:** `DEFAULT_ADMIN_ROLE`  
**Privileged write functions:**
- `updateTreasury(address _newTreasury)` — Update the address of treasury contract.
- `updateHarvester(address _newHarvester)` — Update the address of harvester contract.
- `updateExpenseRatio(uint32 _newRatio)` — Update the fee ratio distributed to treasury.
- `updateHarvesterRatio(uint32 _newRatio)` — Update the fee ratio distributed to harvester.
- `updateThreshold(uint256 newThreshold)` — Update threshold for permissionless liquidation.
- `updateHarvesterRatio(uint32 newRatio)` — Update the fee ratio distributed to harvester.

**Members (2):**

| Address | Name / Type | Risk | Granted | Source | Details |
|---|---|---|---|---|---|
| `0x68863fb8855b04509a835082478D6E3D0bE4E61a` | [↳ TimelockController (3d)](#c-0x68863fb8855b04509a835082478d6e3d0be4e61a) | 🟢 LOW | 2026-04-20 | Events only · hasRole ✓ | 3d delay (⚠ changed 1x) |
| `0xA0FB1b11ccA5871fb0225B64308e249B97804E99` | [↳ Gnosis Safe 6/9](#c-0xa0fb1b11cca5871fb0225b64308e249b97804e99) | 🟢 LOW | 2025-04-02 | Events only · hasRole ✓ | 6/9 signers |

**🕘 Previous Holders (2)** _(verified inactive — `hasRole`/`is` returned false)_:

| Address | Name / Type | Granted | Status |
|---|---|---|---|
| `0x26B2ec4E02ebe2F54583af25b647b1D619e67BbF` | Gnosis Safe 6/9 | 2025-03-18 | 🕘 HISTORICAL |
| `0xa1d0027Ca4C0CB79f9403d06A29470abC7b0a468` | EOA | 2025-03-17 | 🕘 HISTORICAL |


**Delay history for `TimelockController (3d)` (0x6886...E61a):** 3d → 3d

**Signers of `Gnosis Safe 6/9` (0xA0FB...4E99):**

| Signer | Type | Owner Since | Notes |
|---|---|---|---|
| `0x38a93e70b0D8343657f802C1c3Fdb06aC8F8fe99` | EOA ⚠️ Hot wallet (4,446 txs) | — | EOA |
| `0x8EcAB7B8ed8215cA52500cbf1548B9239173ef82` | EOA | — | EOA |
| `0xeF0Ca09fbf9a5f61E657Fb208b46b8685c1d4766` | EOA | — | EOA |
| `0xe3522d85d37F55735e9327CD7a5cDe3abaf28E03` | EOA | — | EOA |
| `0x85DB62FdFA9Ee6050f8b422F74D75D2069dA102B` | EOA | 2025-04-16 | EOA |
| `0xcdF067F306E7a511Ef701588AFCdcff292B19282` | EOA | 2023-12-26 | EOA |
| `0xC8Be49a9b1ca1A1cc654491a7cBbD27aBfA06A81` | EOA | 2026-03-14 | EOA |
| `0x18411aB626c9b3B3Dd5b7356574D8ff396436744` | EOA | 2026-08-01 | EOA |
| `0x74390470F4001Ca85D93bD546A4Ab1724359654B` | EOA | — | EOA |

### 🟠 `CLAIM_FOR_ROLE`

**Hash:** `0x24927c918ee933e498c4f4704c8c8c5997712350624a2ab5df3edca55f9ac033`  
**Managed by:** `DEFAULT_ADMIN_ROLE`  
**Privileged write functions:**
- `claimFor(address owner, address receiver)` — Claim unlocked tokens for someone.

**Members (1):**

| Address | Name / Type | Risk | Granted | Source | Details |
|---|---|---|---|---|---|
| `0x33636D49FbefBE798e15e7F356E8DBef543CC708` | [↳ Diamond](#c-0x33636d49fbefbe798e15e7f356e8dbef543cc708) | 🟠 HIGH | 2025-04-02 | Events only · hasRole ✓ |  |

### ⚪ `PERMISSIONED_TRADER_ROLE`

**Hash:** `0x84060c990e14b08d7c5d95f3c4be08c8b28742dee5236bc38e7559b465ca531f`  
**Managed by:** `DEFAULT_ADMIN_ROLE`  
**Privileged write functions:**
- `harvest()` — Harvest pending rewards from strategy.

**Members (0):** ⚠️ _**Declared but unheld** — role exists in source and gates the function(s) listed above, but has never been granted to any address. The moment any admin grants this role, the gated function becomes callable; treat this as a one-tx-away live capability._


### 🟠 `treasury()`

**Privileged write functions:**
- `updateTreasury(address _newTreasury)` — Update the address of treasury contract.
- `initialize(address admin, InitializationParameters memory params)` — Initialize the state of LiquidityGauge.

**Members (1):**

| Address | Name / Type | Risk | Granted | Source | Details |
|---|---|---|---|---|---|
| `0x0084C2e1B1823564e597Ff4848a88D61ac63D703` | PlatformFeeSpliter | 🟠 HIGH | — | Storage only |  |

#### 🔧 Permissioned Parameters

**`getExpenseRatio`** ❄️ **DORMANT**

> This parameter has never been changed since deployment.

| Field | Value |
|---|---|
| Current Value | `0` |
| Setter | `updateExpenseRatio(uint32 _newRatio)` |
| Gated by | `DEFAULT_ADMIN_ROLE` |
| Tags | — |
| Last changed | — |
| Changed by | — |
| Total changes | 0 ❄️ |

**`getHarvesterRatio`**

| Field | Value |
|---|---|
| Current Value | `100000` |
| Setter | `updateHarvesterRatio(uint32 _newRatio)` |
| Gated by | `DEFAULT_ADMIN_ROLE` |
| Tags | — |
| Last changed | 2025-04-22 |
| Changed by | `0x26B2...7BbF` (Gnosis Safe 6/9) |
| Total changes | 2 |

**Recent changes:**

| # | Value | Set By | Date |
|---|---|---|---|
| 1 | `_newRatio=100000` | `0x26B2...7BbF` (Gnosis Safe 6/9) | 2025-04-22 |
| 2 | `_newRatio=10000000` | `0x26B2...7BbF` (Gnosis Safe 6/9) | 2025-04-02 |

**`getThreshold`**

| Field | Value |
|---|---|
| Current Value | `100000000000000000000 (100.000000e18)` |
| Setter | `updateThreshold(uint256 newThreshold)` |
| Gated by | `DEFAULT_ADMIN_ROLE` |
| Tags | — |
| Last changed | 2025-03-17 |
| Changed by | `0xa1d0...a468` (EOA) |
| Total changes | 1 |

**Recent changes:**

| # | Value | Set By | Date |
|---|---|---|---|
| 1 | `100000000000000000000 (100.000000e18)` | `0xa1d0...a468` (EOA) | 2025-03-17 |

**`harvester`**

| Field | Value |
|---|---|
| Current Value | `0x0559a1b22409Eef7559a5c88cbaA4e285e7b9C30` |
| Setter | `updateHarvester(address _newHarvester)` |
| Gated by | `DEFAULT_ADMIN_ROLE` |
| Tags | — |
| Last changed | 2025-03-17 |
| Changed by | `0x0000...0000` (Burn address (renounced)) |
| Total changes | 1 |

**Recent changes:**

| # | Value | Set By | Date |
|---|---|---|---|
| 1 | `0x0000000000000000000000000000000000000000` | `0x0000...0000` (Burn address (renounced)) | 2025-03-17 |

**`treasury`**

| Field | Value |
|---|---|
| Current Value | `0x0084C2e1B1823564e597Ff4848a88D61ac63D703` |
| Setter | `updateTreasury(address _newTreasury)` |
| Gated by | `DEFAULT_ADMIN_ROLE, treasury()` |
| Tags | — |
| Last changed | 2025-03-17 |
| Changed by | `0x0000...0000` (Burn address (renounced)) |
| Total changes | 1 |

**Recent changes:**

| # | Value | Set By | Date |
|---|---|---|---|
| 1 | `0x0000000000000000000000000000000000000000` | `0x0000...0000` (Burn address (renounced)) | 2025-03-17 |

---
<a id="c-0x33636d49fbefbe798e15e7f356e8dbef543cc708"></a>
## > FxUSDBasePoolFacet `0x33636D49FbefBE798e15e7F356E8DBef543CC708`

> *2 roles · 1 member · 1 function*

> > ⚠️ **Upgradeable** (Diamond (EIP-2535)) — listed facet: `0x9F224Aa807C6FC3086eD3c552ba54bD3a8AAcE33`

### > 🔴 `upgradeability (Diamond (EIP-2535))`

> > ⚠️ **CRITICAL** — Upgradeability allows arbitrary code replacement. Must be behind both a Multisig AND a Timelock.

> **Privileged write functions:**  
> **Capabilities:** ⬆️ **UPGRADE**
> - `diamondCut((address,uint8,bytes4[])[],address,bytes)` — Add, replace or remove facets, the cut facet included, then run an init call `[UPGRADE]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x26B2ec4E02ebe2F54583af25b647b1D619e67BbF` | [↳ Gnosis Safe 6/9](#c-0x26b2ec4e02ebe2f54583af25b647b1d619e67bbf) | 🟢 LOW | — | Storage only | 6/9 signers |

> **Signers of `Gnosis Safe 6/9` (0x26B2...7BbF):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x38a93e70b0D8343657f802C1c3Fdb06aC8F8fe99` | EOA ⚠️ Hot wallet (4,446 txs) | — | EOA |
> | `0x85DB62FdFA9Ee6050f8b422F74D75D2069dA102B` | EOA | 2025-04-16 | EOA |
> | `0xe3522d85d37F55735e9327CD7a5cDe3abaf28E03` | EOA | — | EOA |
> | `0x74390470F4001Ca85D93bD546A4Ab1724359654B` | EOA | — | EOA |
> | `0xeF0Ca09fbf9a5f61E657Fb208b46b8685c1d4766` | EOA | — | EOA |
> | `0x8EcAB7B8ed8215cA52500cbf1548B9239173ef82` | EOA | — | EOA |
> | `0x18411aB626c9b3B3Dd5b7356574D8ff396436744` | EOA | 2026-08-01 | EOA |
> | `0xcdF067F306E7a511Ef701588AFCdcff292B19282` | EOA | 2023-12-26 | EOA |
> | `0xC8Be49a9b1ca1A1cc654491a7cBbD27aBfA06A81` | EOA | 2026-03-13 | EOA |

### > 🟢 `owner()`


> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x26B2ec4E02ebe2F54583af25b647b1D619e67BbF` | [↳ Gnosis Safe 6/9](#c-0x26b2ec4e02ebe2f54583af25b647b1d619e67bbf) | 🟢 LOW | — | Events only | 6/9 signers |

> **Signers of `Gnosis Safe 6/9` (0x26B2...7BbF):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x38a93e70b0D8343657f802C1c3Fdb06aC8F8fe99` | EOA ⚠️ Hot wallet (4,446 txs) | — | EOA |
> | `0x85DB62FdFA9Ee6050f8b422F74D75D2069dA102B` | EOA | 2025-04-16 | EOA |
> | `0xe3522d85d37F55735e9327CD7a5cDe3abaf28E03` | EOA | — | EOA |
> | `0x74390470F4001Ca85D93bD546A4Ab1724359654B` | EOA | — | EOA |
> | `0xeF0Ca09fbf9a5f61E657Fb208b46b8685c1d4766` | EOA | — | EOA |
> | `0x8EcAB7B8ed8215cA52500cbf1548B9239173ef82` | EOA | — | EOA |
> | `0x18411aB626c9b3B3Dd5b7356574D8ff396436744` | EOA | 2026-08-01 | EOA |
> | `0xcdF067F306E7a511Ef701588AFCdcff292B19282` | EOA | 2023-12-26 | EOA |
> | `0xC8Be49a9b1ca1A1cc654491a7cBbD27aBfA06A81` | EOA | 2026-03-13 | EOA |

---
<a id="c-0x68863fb8855b04509a835082478d6e3d0be4e61a"></a>
## > TimelockController `0x68863fb8855b04509a835082478D6E3D0bE4E61a`

> *4 roles · 3 members · 5 functions*

### > 🟢 `CANCELLER_ROLE`

> **Hash:** `0xfd643c72710c63c0180259aba6b2d05451e3591a24e58b62239378085726f783`  
> **Managed by:** `TIMELOCK_ADMIN_ROLE`  
> **Privileged write functions:**
> - `cancel(bytes32 id)` — Cancel an operation. Requirements:

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x26B2ec4E02ebe2F54583af25b647b1D619e67BbF` | [↳ Gnosis Safe 6/9](#c-0x26b2ec4e02ebe2f54583af25b647b1d619e67bbf) | 🟢 LOW | 2026-04-06 | Events only · hasRole ✓ | 6/9 signers |

> **Signers of `Gnosis Safe 6/9` (0x26B2...7BbF):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x38a93e70b0D8343657f802C1c3Fdb06aC8F8fe99` | EOA ⚠️ Hot wallet (4,446 txs) | — | EOA |
> | `0x85DB62FdFA9Ee6050f8b422F74D75D2069dA102B` | EOA | 2025-04-16 | EOA |
> | `0xe3522d85d37F55735e9327CD7a5cDe3abaf28E03` | EOA | — | EOA |
> | `0x74390470F4001Ca85D93bD546A4Ab1724359654B` | EOA | — | EOA |
> | `0xeF0Ca09fbf9a5f61E657Fb208b46b8685c1d4766` | EOA | — | EOA |
> | `0x8EcAB7B8ed8215cA52500cbf1548B9239173ef82` | EOA | — | EOA |
> | `0x18411aB626c9b3B3Dd5b7356574D8ff396436744` | EOA | 2026-08-01 | EOA |
> | `0xcdF067F306E7a511Ef701588AFCdcff292B19282` | EOA | 2023-12-26 | EOA |
> | `0xC8Be49a9b1ca1A1cc654491a7cBbD27aBfA06A81` | EOA | 2026-03-13 | EOA |

### > 🟢 `EXECUTOR_ROLE`

> **Hash:** `0xd8aa0f3194971a2a116679f7c2090f6939c8d4e01a2a8d7e41d55e5351469e63`  
> **Managed by:** `TIMELOCK_ADMIN_ROLE`  
> **Privileged write functions:**
> - `execute(address target, uint256 value, bytes calldata payload, bytes32 predecessor, bytes32 salt)`
> - `executeBatch(address[] calldata targets, uint256[] calldata values, bytes[] calldata payloads, bytes32 predecessor, bytes32 salt)`

> **Members (2):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x0000000000000000000000000000000000000000` | Burn address (renounced) | 🟢 LOW | 2026-04-20 | Events only · hasRole ✓ | 🔒 Renounced — no private key |
> | `0x26B2ec4E02ebe2F54583af25b647b1D619e67BbF` | [↳ Gnosis Safe 6/9](#c-0x26b2ec4e02ebe2f54583af25b647b1d619e67bbf) | 🟢 LOW | 2026-04-06 | Events only · hasRole ✓ | 6/9 signers |

> **Signers of `Gnosis Safe 6/9` (0x26B2...7BbF):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x38a93e70b0D8343657f802C1c3Fdb06aC8F8fe99` | EOA ⚠️ Hot wallet (4,446 txs) | — | EOA |
> | `0x85DB62FdFA9Ee6050f8b422F74D75D2069dA102B` | EOA | 2025-04-16 | EOA |
> | `0xe3522d85d37F55735e9327CD7a5cDe3abaf28E03` | EOA | — | EOA |
> | `0x74390470F4001Ca85D93bD546A4Ab1724359654B` | EOA | — | EOA |
> | `0xeF0Ca09fbf9a5f61E657Fb208b46b8685c1d4766` | EOA | — | EOA |
> | `0x8EcAB7B8ed8215cA52500cbf1548B9239173ef82` | EOA | — | EOA |
> | `0x18411aB626c9b3B3Dd5b7356574D8ff396436744` | EOA | 2026-08-01 | EOA |
> | `0xcdF067F306E7a511Ef701588AFCdcff292B19282` | EOA | 2023-12-26 | EOA |
> | `0xC8Be49a9b1ca1A1cc654491a7cBbD27aBfA06A81` | EOA | 2026-03-13 | EOA |

### > 🟢 `PROPOSER_ROLE`

> **Hash:** `0xb09aa5aeb3702cfd50b6b62bc4532604938f21248a27a1d5ca736082b6819cc1`  
> **Managed by:** `TIMELOCK_ADMIN_ROLE`  
> **Privileged write functions:**
> - `schedule(address target, uint256 value, bytes calldata data, bytes32 predecessor, bytes32 salt, uint256 delay)` — Schedule an operation containing a single transaction. Emits {CallSalt} if salt is nonzero, and {CallScheduled}.
> - `scheduleBatch(address[] calldata targets, uint256[] calldata values, bytes[] calldata payloads, bytes32 predecessor, bytes32 salt, uint256 delay)` — Schedule an operation containing a batch of transactions. Emits {CallSalt} if salt is nonzero, and one {CallScheduled} event per transaction in the batch.

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x26B2ec4E02ebe2F54583af25b647b1D619e67BbF` | [↳ Gnosis Safe 6/9](#c-0x26b2ec4e02ebe2f54583af25b647b1d619e67bbf) | 🟢 LOW | 2026-04-06 | Events only · hasRole ✓ | 6/9 signers |

> **Signers of `Gnosis Safe 6/9` (0x26B2...7BbF):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x38a93e70b0D8343657f802C1c3Fdb06aC8F8fe99` | EOA ⚠️ Hot wallet (4,446 txs) | — | EOA |
> | `0x85DB62FdFA9Ee6050f8b422F74D75D2069dA102B` | EOA | 2025-04-16 | EOA |
> | `0xe3522d85d37F55735e9327CD7a5cDe3abaf28E03` | EOA | — | EOA |
> | `0x74390470F4001Ca85D93bD546A4Ab1724359654B` | EOA | — | EOA |
> | `0xeF0Ca09fbf9a5f61E657Fb208b46b8685c1d4766` | EOA | — | EOA |
> | `0x8EcAB7B8ed8215cA52500cbf1548B9239173ef82` | EOA | — | EOA |
> | `0x18411aB626c9b3B3Dd5b7356574D8ff396436744` | EOA | 2026-08-01 | EOA |
> | `0xcdF067F306E7a511Ef701588AFCdcff292B19282` | EOA | 2023-12-26 | EOA |
> | `0xC8Be49a9b1ca1A1cc654491a7cBbD27aBfA06A81` | EOA | 2026-03-13 | EOA |

### > 🟢 `TIMELOCK_ADMIN_ROLE` 🔄 5 changes · 📋 operational

> **Hash:** `0x5f58e3a2316349923ce3780f8d587db2d72378aed66a8261c916544fa6846ca5`  
> **Managed by:** `TIMELOCK_ADMIN_ROLE`  

> **Members (1):**

> | Address | Name / Type | Granted | Source | Details |
> |---|---|---|---|---|
> | `0x68863fb8855b04509a835082478D6E3D0bE4E61a` | [↳ TimelockController (3d)](#c-0x68863fb8855b04509a835082478d6e3d0be4e61a) | 2026-04-06 | Events only · hasRole ✓ | 3d delay (⚠ changed 1x) |

> **🕘 Previous Holders (2)** _(verified inactive — `hasRole`/`is` returned false)_:

> | Address | Name / Type | Granted | Status |
> |---|---|---|---|
> | `0x26B2ec4E02ebe2F54583af25b647b1D619e67BbF` | Gnosis Safe 6/9 | 2026-04-06 | 🕘 HISTORICAL |
> | `0xa1d0027Ca4C0CB79f9403d06A29470abC7b0a468` | EOA | 2026-04-06 | 🕘 HISTORICAL |


> **Delay history for `TimelockController (3d)` (0x6886...E61a):** 3d → 3d

---
<a id="c-0x65c9a641afceb9c0e6034e558a319488fa0fa3be"></a>
## > FxUSDBasePool `0x65C9A641afCEB9C0E6034e558A319488FA0FA3be`

> *10 roles · 15 members · 11 functions*

> > ⚠️ **Upgradeable** (TransparentUpgradeable) — impl: `0x9CFeFD90d4C8428D4CBaC9bAAA6D52C6BA7897f9`

> **Proxy History (10 events):**

> | # | Date | Event | Address | Key Changes | Tx |
> |---|---|---|---|---|---|
> | 1 | 2025-01-01 | Upgrade | `0x3875...E206` | Initial deployment | [0x9e2cd48ec0aa3fdc448c7d8ec0ea058dace66889e2d034a8fcb45fd038a28f16](https://etherscan.io/tx/0x9e2cd48ec0aa3fdc448c7d8ec0ea058dace66889e2d034a8fcb45fd038a28f16) |
> | 2 | 2025-01-01 | Admin Changed | `0xd41d...324B` | Previous: `0x0000...0000` | [0x9e2cd48ec0aa3fdc448c7d8ec0ea058dace66889e2d034a8fcb45fd038a28f16](https://etherscan.io/tx/0x9e2cd48ec0aa3fdc448c7d8ec0ea058dace66889e2d034a8fcb45fd038a28f16) |
> | 3 | 2025-01-01 | Upgrade | `0x1D10...3A00` | +14 fn; added `DEFAULT_ADMIN_ROLE()`; added `approve(address,uint256)`; added `getRoleAdmin(bytes32)`; added `grantRole(bytes32,address)`; added `hasRole(bytes32,address)`; added `initialize(address,string,string,uint256,uint256)`; added `permit(address,address,uint256,uint256,uint8,bytes32,bytes32)`; added `redeem(address,uint256)`; added `redeemCoolDownPeriod()`; added `redeemRequests(address)`; added `renounceRole(bytes32,address)`; added `revokeRole(bytes32,address)`; added `transfer(address,uint256)`; added `transferFrom(address,address,uint256)`; 📝 src +22886/-2 | [0x83bebf10f80333e17db50ba238d8276df8836b4623c005fcfc8a8dba56208581](https://etherscan.io/tx/0x83bebf10f80333e17db50ba238d8276df8836b4623c005fcfc8a8dba56208581) |
> | 4 | 2025-01-01 | Admin Changed | `0x9B54...DDA4` | Previous: `0xd41d...324B` | [0xa20569f7a851c9763f4bc8b9659524cd2f2427ea808dd9ff004c41c13f679fbc](https://etherscan.io/tx/0xa20569f7a851c9763f4bc8b9659524cd2f2427ea808dd9ff004c41c13f679fbc) |
> | 5 | 2025-01-02 | Upgrade | `0xBcf5...e001` | -14 fn; removed `DEFAULT_ADMIN_ROLE()`; removed `approve(address,uint256)`; removed `getRoleAdmin(bytes32)`; removed `grantRole(bytes32,address)`; removed `hasRole(bytes32,address)`; removed `initialize(address,string,string,uint256,uint256)`; removed `permit(address,address,uint256,uint256,uint8,bytes32,bytes32)`; removed `redeem(address,uint256)`; removed `redeemCoolDownPeriod()`; removed `redeemRequests(address)`; removed `renounceRole(bytes32,address)`; removed `revokeRole(bytes32,address)`; removed `transfer(address,uint256)`; removed `transferFrom(address,address,uint256)`; 📝 src +17/-22877 | [0x3c970fa009a04b2f984e5ea47a45cc185013c9ed3044ea29675a2955a3b0a1d1](https://etherscan.io/tx/0x3c970fa009a04b2f984e5ea47a45cc185013c9ed3044ea29675a2955a3b0a1d1) |
> | 6 | 2025-01-02 | Upgrade | `0x1D10...3A00` | +14 fn; added `DEFAULT_ADMIN_ROLE()`; added `approve(address,uint256)`; added `getRoleAdmin(bytes32)`; added `grantRole(bytes32,address)`; added `hasRole(bytes32,address)`; added `initialize(address,string,string,uint256,uint256)`; added `permit(address,address,uint256,uint256,uint8,bytes32,bytes32)`; added `redeem(address,uint256)`; added `redeemCoolDownPeriod()`; added `redeemRequests(address)`; added `renounceRole(bytes32,address)`; added `revokeRole(bytes32,address)`; added `transfer(address,uint256)`; added `transferFrom(address,address,uint256)`; 📝 src +22882/-22 | [0x3c970fa009a04b2f984e5ea47a45cc185013c9ed3044ea29675a2955a3b0a1d1](https://etherscan.io/tx/0x3c970fa009a04b2f984e5ea47a45cc185013c9ed3044ea29675a2955a3b0a1d1) |
> | 7 | 2025-03-19 | Upgrade | `0x0fD2...2D5f` | +2 fn; added `ASSET_MANAGER_ROLE()`; added `kill(address)`; 📝 src +4764/-10936 | [0x5b4c4027b6329f5f41c6d9e867b0960c2876f20308d615ea442480ecdd017319](https://etherscan.io/tx/0x5b4c4027b6329f5f41c6d9e867b0960c2876f20308d615ea442480ecdd017319) |
> | 8 | 2025-06-18 | Upgrade | `0x9579...33c4` | 📝 src +4790/-2189 | [0x4535ea1f9b74e65c55336cd3ac3d2c7d7b4f76373a4a5c9fd287e99b48137250](https://etherscan.io/tx/0x4535ea1f9b74e65c55336cd3ac3d2c7d7b4f76373a4a5c9fd287e99b48137250) |
> | 9 | 2025-11-04 | Upgrade | `0x3374...cE01` | +1 fn; added `NO_INSTANT_REDEEM_FEE_ROLE()`; 📝 src +3292/-15791 | [0x9939b8eb2f1f893b6ad710520c325400a5d0259ab123e25f26edf97f7ac838d8](https://etherscan.io/tx/0x9939b8eb2f1f893b6ad710520c325400a5d0259ab123e25f26edf97f7ac838d8) |
> | 10 | 2025-12-04 | Upgrade | `0x9CFe...97f9` | 📝 src +7/-1 | [0xafc5df3c1e62d2ddd289dcb8891e34179c969e6efbc6c6b07f9bee6664c24ed4](https://etherscan.io/tx/0xafc5df3c1e62d2ddd289dcb8891e34179c969e6efbc6c6b07f9bee6664c24ed4) |

> <details>
> <summary>📝 Source diff — upgrade #3 (<code>0x3875...E206</code> → <code>0x1D10...3A00</code>): +22886/-2 lines (truncated)</summary>

> ```diff
--- old_impl
+++ new_impl
@@ -1,5 +1,22889 @@
 // SPDX-License-Identifier: MIT
-
-pragma solidity =0.8.20;
+// OpenZeppelin Contracts (last updated v4.9.0) (access/AccessControl.sol)
+
+pragma solidity ^0.8.0;
+
+import "./IAccessControlUpgradeable.sol";
+import "../utils/ContextUpgradeable.sol";
+import "../utils/StringsUpgradeable.sol";
+import "../utils/introspection/ERC165Upgradeable.sol";
+import {Initializable} from "../proxy/utils/Initializable.sol";
+
+/**
+ * @dev Contract module that allows children to implement role-based access
+ * control mechanisms. This is a lightweight version that doesn't allow enumerating role
+ * members except through off-chain means by accessing the contract event logs. Some
+ * applications may benefit from on-chain enumerability, for those cases see
+ * {AccessControlEnumerable}.
+ *
+ * Roles are referred to by their `bytes32` identifier. These should be exposed
+ * in the external API and be unique. The best way to achieve this is by
+ * using `public constant` hash digests:
+ *
+ * ```solidity
+ * bytes32 public constant MY_ROLE = keccak256("MY_ROLE");
+ * ```
+ *
+ * Roles can be used to represent a set of permissions. To restrict access to a
+ * function call, use {hasRole}:
+ *
+ * ```solidity
+ * function foo() public {
+ *     require(hasRole(MY_ROLE, msg.sender));
+ *     ...
+ * }
+ * ```
+ *
+ * Roles can be granted and revoked dynamically via the {grantRole} and
+ * {revokeRole} functions. Each role has an associated admin role, and only
+ * accounts that have a role's admin role can call {grantRole} and {revokeRole}.
+ *
+ * By default, the admin role for all roles is `DEFAULT_ADMIN_ROLE`, which means
+ * that only accounts with this role will be able to grant or revoke other
+ * roles. More complex role relationships can be created by using
+ * {_setRoleAdmin}.
+ *
+ * WARNING: The `DEFAULT_ADMIN_ROLE` is also its own admin: it has permission to
+ * grant and revoke this role. Extra precautions should be taken to secure
+ * accounts that have been granted it. We recommend using {AccessControlDefaultAdminRules}
+ * to enforce additional security measures for this role.
+ */
+abstract contract AccessControlUpgradeable is Initializable, ContextUpgradeable, IAccessControlUpgradeable, ERC165Upgradeable {
+    struct RoleData {
+        mapping(address => bool) members;
+        bytes32 adminRole;
+    }
+
+    mapping(bytes32 => RoleData) private _roles;
+
+    bytes32 public constant DEFAULT_ADMIN_ROLE = 0x00;
+
+    /**
+     * @dev Modifier that checks that an account has a specific role. Reverts
+     * with a standardized message including the required role.
+     *
+     * The format of the revert reason is given by the following regular expression:
+     *
+     *  /^AccessControl: account (0x[0-9a-f]{40}) is missing role (0x[0-9a-f]{64})$/
+     *
+     * _Available since v4.1._
+     */
+    modifier onlyRole(bytes32 role) {
+        _checkRole(role);
+        _;
+    }
+
+    function __AccessControl_init() internal onlyInitializing {
+    }
+
+    function __AccessControl_init_unchained() internal onlyInitializing {
+    }
+    /**
+     * @dev See {IERC165-supportsInterface}.
+     */
+    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
+        return interfaceId == type(IAccessControlUpgradeable).interfaceId || super.supportsInterface(interfaceId);
+    }
+
+    /**
+     * @dev Returns `true` if `account` has been granted `role`.
+     */
+    function hasRole(bytes32 role, address account) public view virtual override returns (bool) {
+        return _roles[role].members[account];
+    }
+
+    /**
+     * @dev Revert with a standard message if `_msgSender()` is missing `role`.
+     * Overriding this function changes the behavior of the {onlyRole} modifier.
+     *
+     * Format of the revert message is described in {_checkRole}.
+     *
+     * _Available since v4.6._
+     */
+    function _checkRole(bytes32 role) internal view virtual {
+        _checkRole(role, _msgSender());
+    }
+
+    /**
+     * @dev Revert with a standard message if `account` is missing `role`.
+     *
+     * The format of the revert reason is given by the following regular expression:
+     *
+     *  /^AccessControl: account (0x[0-9a-f]{40}) is missing role (0x[0-9a-f]{64})$/
+     */
+    function _checkRole(bytes32 role, address account) internal view virtual {
+        if (!hasRole(role, account)) {
+            revert(
+                string(
+                    abi.encodePacked(
+                        "AccessControl: account ",
+                        StringsUpgradeable.toHexString(account),
+                        " is missing role ",
+                        StringsUpgradeable.toHexString(uint256(role), 32)
+                    )
+                )
+            );
+        }
+    }
+
+    /**
+     * @dev Returns the admin role that controls `role`. See {grantRole} and
+     * {revokeRole}.
+     *
+     * To change a role's admin, use {_setRoleAdmin}.
+     */
+    function getRoleAdmin(bytes32 role) public view virtual override returns (bytes32) {
+        return _roles[role].adminRole;
+    }
+
+    /**
+     * @dev Grants `role` to `account`.
+     *
+     * If `account` had not been already granted `role`, emits a {RoleGranted}
+     * event.
+     *
+     * Requirements:
+     *
+     * - the caller must have ``role``'s admin role.
+     *
+     * May emit a {RoleGranted} event.
+     */
+    function grantRole(bytes32 role, address account) public virtual override onlyRole(getRoleAdmin(role)) {
+        _grantRole(role, account);
+    }
+
+    /**
+     * @dev Revokes `role` from `account`.
+     *
+     * If `account` had been granted `role`, emits a {RoleRevoked} event.
+     *
+     * Requirements:
+     *
+     * - the caller must have ``role``'s admin role.
+     *
+     * May emit a {RoleRevoked} event.
+     */
+    function revokeRole(bytes32 role, address account) public virtual override onlyRole(getRoleAdmin(role)) {
+        _revokeRole(role, account);
+    }
+
+    /**
+     * @dev Revokes `role` from the calling account.
+     *
+     * Roles are often managed via {grantRole} and {revokeRole}: this function's
+     * purpose is to provide a mechanism for accounts to lose their privileges
+     * if they are compromised (such as when a trusted device is misplaced).
+     *
+     * If the calling account had been revoked `role`, emits a {RoleRevoked}
+     * event.
+     *
+     * Requirements:
+     *
+     * - the caller must be `account`.
+     *
+     * May emit a {RoleRevoked} event.
+     */
+    function renounceRole(bytes32 role, address account) public virtual override {
+        require(account == _msgSender(), "AccessControl: can only renounce roles for self");
+
+        _revokeRole(role, account);
+    }
+
+    /**
+     * @dev Grants `role` to `account`.
+     *
+     * If `account` had not been already granted `role`, emits a {RoleGranted}
+     * event. Note that unlike {grantRole}, this function doesn't perform any
+     * checks on the calling account.
+     *
+     * May emit a {RoleGranted} event.
+     *
+     * [WARNING]
+     * ====
+     * This function should only be called from the constructor when setting
+     * up the initial roles for the system.
+     *
+     * Using this function in any other way is effectively circumventing the admin
+     * system imposed by {AccessControl}.
+     * ====
+     *
+     * NOTE: This function is deprecated in favor of {_grantRole}.
+     */
+    function _setupRole(bytes32 role, address account) internal virtual {
+        _grantRole(role, account);
+    }
+
+    /**
+     * @dev Sets `adminRole` as ``role``'s admin role.
+     *
+     * Emits a {RoleAdminChanged} event.
+     */
+    function _setRoleAdmin(bytes32 role, bytes32 adminRole) internal virtual {
+        bytes32 previousAdminRole = getRoleAdmin(role);
+        _roles[role].adminRole = adminRole;
+        emit RoleAdminChanged(role, previousAdminRole, adminRole);
+    }
+
+    /**
+     * @dev Grants `role` to `account`.
+     *
+     * Internal function without access restriction.
+     *
+     * May emit a {RoleGranted} event.
+     */
+    function _grantRole(bytes32 role, address account) internal virtual {
+        if (!hasRole(role, account)) {
+            _roles[role].members[account] = true;
+            emit RoleGranted(role, account, _msgSender());
+        }
+    }
+
+    /**
+     * @dev Revokes `role` from `account`.
+     *
+     * Internal function without access restriction.
+     *
+     * May emit a {RoleRevoked} event.
+     */
+    function _revokeRole(bytes32 role, address account) internal virtual {
+        if (hasRole(role, account)) {
+            _roles[role].members[account] = false;
+            emit RoleRevoked(role, account, _msgSender());
+        }
+    }
+
+    /**
+     * @dev This empty reserved space is put in place to allow future versions to add new
+     * variables without shifting down storage in the inheritance chain.
+     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
+     */
+    uint256[49] private __gap;
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts v4.4.1 (access/IAccessControl.sol)
+
+pragma solidity ^0.8.0;
+
+/**
+ * @dev External interface of AccessControl declared to support ERC165 detection.
+ */
+interface IAccessControlUpgradeable {
+    /**
+     * @dev Emitted when `newAdminRole` is set as ``role``'s admin role, replacing `previousAdminRole`
+     *
+     * `DEFAULT_ADMIN_ROLE` is the starting admin for all roles, despite
+     * {RoleAdminChanged} not being emitted signaling this.
+     *
+     * _Available since v3.1._
+     */
+    event RoleAdminChanged(bytes32 indexed role, bytes32 indexed previousAdminRole, bytes32 indexed newAdminRole);
+
+    /**
+     * @dev Emitted when `account` is granted `role`.
+     *
+     * `sender` is the account that originated the contract call, an admin role
+     * bearer except when using {AccessControl-_setupRole}.
+     */
+    event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender);
+
+    /**
+     * @dev Emitted when `account` is revoked `role`.
+     *
+     * `sender` is the account that originated the contract call:
+     *   - if using `revokeRole`, it is the admin role bearer
+     *   - if using `renounceRole`, it is the role bearer (i.e. `account`)
+     */
+    event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender);
+
+    /**
+     * @dev Returns `true` if `account` has been granted `role`.
+     */
+    function hasRole(bytes32 role, address account) external view returns (bool);
+
+    /**
+     * @dev Returns the admin role that controls `role`. See {grantRole} and
+     * {revokeRole}.
+     *
+     * To change a role's admin, use {AccessControl-_setRoleAdmin}.
+     */
+    function getRoleAdmin(bytes32 role) external view returns (bytes32);
+
+    /**
+     * @dev Grants `role` to `account`.
+     *
+     * If `account` had not been already granted `role`, emits a {RoleGranted}
+     * event.
+     *
+     * Requirements:
+     *
+     * - the caller must have ``role``'s admin role.
+     */
+    function grantRole(bytes32 role, address account) external;
+
+    /**
+     * @dev Revokes `role` from `account`.
+     *
+     * If `account` had been granted `role`, emits a {RoleRevoked} event.
+     *
+     * Requirements:
+     *
+     * - the caller must have ``role``'s admin role.
+     */
+    function revokeRole(bytes32 role, address account) external;
+
+    /**
+     * @dev Revokes `role` from the calling account.
+     *
+     * Roles are often managed via {grantRole} and {revokeRole}: this function's
+     * purpose is to provide a mechanism for accounts to lose their privileges
+     * if they are compromised (such as when a trusted device is misplaced).
+     *
+     * If the calling account had been granted `role`, emits a {RoleRevoked}
+     * event.
+     *
+     * Requirements:
+     *
+     * - the caller must be `account`.
+     */
+    function renounceRole(bytes32 role, address account) external;
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts (last updated v4.9.0) (interfaces/IERC5267.sol)
+
+pragma solidity ^0.8.0;
+
+interface IERC5267Upgradeable {
+    /**
+     * @dev MAY be emitted to signal that the domain could have changed.
+     */
+    event EIP712DomainChanged();
+
+    /**
+     * @dev returns the fields and values that describe the domain separator used by this contract for EIP-712
+     * signature.
+     */
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
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts (last updated v4.9.0) (proxy/utils/Initializable.sol)
+
+pragma solidity ^0.8.2;
+
+import "../../utils/AddressUpgradeable.sol";
+
+/**
+ * @dev This is a base contract to aid in writing upgradeable contracts, or any kind of contract that will be deployed
+ * behind a proxy. Since proxied contracts do not make use of a constructor, it's common to move constructor logic to an
+ * external initializer function, usually called `initialize`. It then becomes necessary to protect this initializer
+ * function so it can only be called once. The {initializer} modifier provided by this contract will have this effect.
+ *
+ * The initialization functions use a version number. Once a version number is used, it is consumed and cannot be
+ * reused. This mechanism prevents re-execution of each "step" but allows the creation of new initialization steps in
+ * case an upgrade adds a module that needs to be initialized.
+ *
+ * For example:
+ *
+ * [.hljs-theme-light.nopadding]
+ * ```solidity
+ * contract MyToken is ERC20Upgradeable {
+ *     function initialize() initializer public {
+ *         __ERC20_init("MyToken", "MTK");
+ *     }
+ * }
+ *
+ * contract MyTokenV2 is MyToken, ERC20PermitUpgradeable {
+ *     function initializeV2() reinitializer(2) public {
+ *         __ERC20Permit_init("MyToken");
+ *     }
+ * }
+ * ```
+ *
+ * TIP: To avoid leaving the proxy in an uninitialized state, the initializer function should be called as early as
+ * possible by providing the encoded function call as the `_data` argument to {ERC1967Proxy-constructor}.
+ *
+ * CAUTION: When used with inheritance, manual care must be taken to not invoke a parent initializer twice, or to ensure
+ * that all initializers are idempotent. This is not verified automatically as constructors are by Solidity.
+ *
+ * [CAUTION]
+ * ====
+ * Avoid leaving a contract uninitialized.
+ *
+ * An uninitialized contract can be taken over by an attacker. This applies to both a proxy and its implementation
+ * contract, which may impact the proxy. To prevent the implementation contract from being used, you should invoke
+ * the {_disableInitializers} function in the constructor to automatically lock it when it is deployed:
+ *
+ * [.hljs-theme-light.nopadding]
+ * ```
+ * /// @custom:oz-upgrades-unsafe-allow constructor
+ * constructor() {
+ *     _disableInitializers();
+ * }
+ * ```
+ * ====
+ */
+abstract contract Initializable {
+    /**
+     * @dev Indicates that the contract has been initialized.
+     * @custom:oz-retyped-from bool
+     */
+    uint8 private _initialized;
+
+    /**
+     * @dev Indicates that the contract is in the process of being initialized.
+     */
+    bool private _initializing;
+
+    /**
+     * @dev Triggered when the contract has been initialized or reinitialized.
+     */
+    event Initialized(uint8 version);
+
+    /**
+     * @dev A modifier that defines a protected initializer function that can be invoked at most once. In its scope,
+     * `onlyInitializing` functions can be used to initialize parent contracts.
+     *
+     * Similar to `reinitializer(1)`, except that functions marked with `initializer` can be nested in the context of a
+     * constructor.
+     *
+     * Emits an {Initialized} event.
+     */
+    modifier initializer() {
+        bool isTopLevelCall = !_initializing;
+        require(
+            (isTopLevelCall && _initialized < 1) || (!AddressUpgradeable.isContract(address(this)) && _initialized == 1),
+            "Initializable: contract is already initialized"
+        );
+        _initialized = 1;
+        if (isTopLevelCall) {
+            _initializing = true;
+        }
+        _;
+        if (isTopLevelCall) {
+            _initializing = false;
+            emit Initialized(1);
+        }
+    }
+
+    /**
+     * @dev A modifier that defines a protected reinitializer function that can be invoked at most once, and only if the
+     * contract hasn't been initialized to a greater version before. In its scope, `onlyInitializing` functions can be
+     * used to initialize parent contracts.
+     *
+     * A reinitializer may be used after the original initialization step. This is essential to configure modules that
+     * are added through upgrades and that require initialization.
+     *
+     * When `version` is 1, this modifier is similar to `initializer`, except that functions marked with `reinitializer`
+     * cannot be nested. If one is invoked in the context of another, execution will revert.
+     *
+     * Note that versions can jump in increments greater than 1; this implies that if multiple reinitializers coexist in
+     * a contract, executing them in the right order is up to the developer or operator.
+     *
+     * WARNING: setting the version to 255 will prevent any future reinitialization.
+     *
+     * Emits an {Initialized} event.
+     */
+    modifier reinitializer(uint8 version) {
+        require(!_initializing && _initialized < version, "Initializable: contract is already initialized");
+        _initialized = version;
+        _initializing = true;
+        _;
+        _initializing = false;
+        emit Initialized(version);
+    }
+
+    /**
+     * @dev Modifier to protect an initialization function so that it can only be invoked by functions with the
+     * {initializer} and {reinitializer} modifiers, directly or indirectly.
+     */
+    modifier onlyInitializing() {
+        require(_initializing, "Initializable: contract is not initializing");
+        _;
+    }
+
+    /**
+     * @dev Locks the contract, preventing any future reinitialization. This cannot be part of an initializer call.
+     * Calling this in the constructor of a contract will prevent that contract from being initialized or reinitialized
+     * to any version. It is recommended to use this to lock implementation contracts that are designed to be called
+     * through proxies.
+     *
+     * Emits an {Initialized} event the first time it is successfully executed.
+     */
+    function _disableInitializers() internal virtual {
+        require(!_initializing, "Initializable: contract is initializing");
+        if (_initialized != type(uint8).max) {
+            _initialized = type(uint8).max;
+            emit Initialized(type(uint8).max);
+        }
+    }
+
+    /**
+     * @dev Returns the highest version that has been initialized. See {reinitializer}.
+     */
+    function _getInitializedVersion() internal view returns (uint8) {
+        return _initialized;
+    }
+
+    /**
+     * @dev Returns `true` if the contract is currently initializing. See {onlyInitializing}.
+     */
+    function _isInitializing() internal view returns (bool) {
+        return _initializing;
+    }
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts (last updated v4.9.0) (security/ReentrancyGuard.sol)
+
+pragma solidity ^0.8.0;
+import {Initializable} from "../proxy/utils/Initializable.sol";
+
+/**
+ * @dev Contract module that helps prevent reentrant calls to a function.
+ *
+ * Inheriting from `ReentrancyGuard` will make the {nonReentrant} modifier
+ * available, which can be applied to functions to make sure there are no nested
+ * (reentrant) calls to them.
+ *
+ * Note that because there is a single `nonReentrant` guard, functions marked as
+ * `nonReentrant` may not call one another. This can be worked around by making
+ * those functions `private`, and then adding `external` `nonReentrant` entry
+ * points to them.
+ *
+ * TIP: If you would like to learn more about reentrancy and alternative ways
+ * to protect against it, check out our blog post
+ * https://blog.openzeppelin.com/reentrancy-after-istanbul/[Reentrancy After Istanbul].
+ */
+abstract contract ReentrancyGuardUpgradeable is Initializable {
+    // Booleans are more expensive than uint256 or any type that takes up a full
+    // word because each write operation emits an extra SLOAD to first read the
+    // slot's contents, replace the bits taken up by the boolean, and then write
+    // back. This is the compiler's defense against contract upgrades and
+    // pointer aliasing, and it cannot be disabled.
+
+    // The values being non-zero value makes deployment a bit more expensive,
+    // but in exchange the refund on every call to nonReentrant will be lower in
+    // amount. Since refunds are capped to a percentage of the total
+    // transaction's gas, it is best to keep them low in cases like this one, to
+    // increase the likelihood of the full refund coming into effect.
+    uint256 private constant _NOT_ENTERED = 1;
+    uint256 private constant _ENTERED = 2;
+
+    uint256 private _status;
+
+    function __ReentrancyGuard_init() internal onlyInitializing {
+        __ReentrancyGuard_init_unchained();
+    }
+
+    function __ReentrancyGuard_init_unchained() internal onlyInitializing {
+        _status = _NOT_ENTERED;
+    }
+
+    /**
+     * @dev Prevents a contract from calling itself, directly or indirectly.
+     * Calling a `nonReentrant` function from another `nonReentrant`
+     * function is not supported. It is possible to prevent this from happening
+     * by making the `nonReentrant` function external, and making it call a
+     * `private` function that does the actual work.
+     */
+    modifier nonReentrant() {
+        _nonReentrantBefore();
+        _;
+        _nonReentrantAfter();
+    }
+
+    function _nonReentrantBefore() private {
+        // On the first call to nonReentrant, _status will be _NOT_ENTERED
+        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");
+
+        // Any calls to nonReentrant after this point will fail
+        _status = _ENTERED;
+    }
+
+    function _nonReentrantAfter() private {
+        // By storing the original value once again, a refund is triggered (see
+        // https://eips.ethereum.org/EIPS/eip-2200)
+        _status = _NOT_ENTERED;
+    }
+
+    /**
+     * @dev Returns true if the reentrancy guard is currently set to "entered", which indicates there is a
+     * `nonReentrant` function in the call stack.
+     */
+    function _reentrancyGuardEntered() internal view returns (bool) {
+        return _status == _ENTERED;
+    }
+
+    /**
+     * @dev This empty reserved space is put in place to allow future versions to add new
+     * variables without shifting down storage in the inheritance chain.
+     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
+     */
+    uint256[49] private __gap;
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts (last updated v4.9.0) (token/ERC20/ERC20.sol)
+
+pragma solidity ^0.8.0;
+
+import "./IERC20Upgradeable.sol";
+import "./extensions/IERC20MetadataUpgradeable.sol";
+import "../../utils/ContextUpgradeable.sol";
+import {Initializable} from "../../proxy/utils/Initializable.sol";
+
+/**
+ * @dev Implementation of the {IERC20} interface.
+ *
+ * This implementation is agnostic to the way tokens are created. This means
+ * that a supply mechanism has to be added in a derived contract using {_mint}.
+ * For a generic mechanism see {ERC20PresetMinterPauser}.
+ *
+ * TIP: For a detailed writeup see our guide
+ * https://forum.openzeppelin.com/t/how-to-implement-erc20-supply-mechanisms/226[How
+ * to implement supply mechanisms].
+ *
+ * The default value of {decimals} is 18. To change this, you should override
+ * this function so it returns a different value.
+ *
+ * We have followed general OpenZeppelin Contracts guidelines: functions revert
+ * instead returning `false` on failure. This behavior is nonetheless
+ * conventional and does not conflict with the expectations of ERC20
+ * applications.
+ *
+ * Additionally, an {Approval} event is emitted on calls to {transferFrom}.
+ * This allows applications to reconstruct the allowance for all accounts just
+ * by listening to said events. Other implementations of the EIP may not emit
+ * these events, as it isn't required by the specification.
+ *
+ * Finally, the non-standard {decreaseAllowance} and {increaseAllowance}
+ * functions have been added to mitigate the well-known issues around setting
+ * allowances. See {IERC20-approve}.
+ */
+contract ERC20Upgradeable is Initializable, ContextUpgradeable, IERC20Upgradeable, IERC20MetadataUpgradeable {
+    mapping(address => uint256) private _balances;
+
+    mapping(address => mapping(address => uint256)) private _allowances;
+
+    uint256 private _totalSupply;
+
+    string private _name;
+    string private _symbol;
+
+    /**
+     * @dev Sets the values for {name} and {symbol}.
+     *
+     * All two of these values are immutable: they can only be set once during
+     * construction.
+     */
+    function __ERC20_init(string memory name_, string memory symbol_) internal onlyInitializing {
+        __ERC20_init_unchained(name_, symbol_);
+    }
+
+    function __ERC20_init_unchained(string memory name_, string memory symbol_) internal onlyInitializing {
+        _name = name_;
+        _symbol = symbol_;
+    }
+
+    /**
+     * @dev Returns the name of the token.
+     */
+    function name() public view virtual override returns (string memory) {
+        return _name;
+    }
+
+    /**
+     * @dev Returns the symbol of the token, usually a shorter version of the
+     * name.
+     */
+    function symbol() public view virtual override returns (string memory) {
+        return _symbol;
+    }
+
+    /**
+     * @dev Returns the number of decimals used to get its user representation.
+     * For example, if `decimals` equals `2`, a balance of `505` tokens should
+     * be displayed to a user as `5.05` (`505 / 10 ** 2`).
+     *
+     * Tokens usually opt for a value of 18, imitating the relationship between
+     * Ether and Wei. This is the default value returned by this function, unless
+     * it's overridden.
+     *
+     * NOTE: This information is only used for _display_ purposes: it in
+     * no way affects any of the arithmetic of the contract, including
+     * {IERC20-balanceOf} and {IERC20-transfer}.
+     */
+    function decimals() public view virtual override returns (uint8) {
+        return 18;
+    }
+
+    /**
+     * @dev See {IERC20-totalSupply}.
+     */
+    function totalSupply() public view virtual override returns (uint256) {
+        return _totalSupply;
+    }
+
+    /**
+     * @dev See {IERC20-balanceOf}.
+     */
+    function balanceOf(address account) public view virtual override returns (uint256) {
+        return _balances[account];
+    }
+
+    /**
+     * @dev See {IERC20-transfer}.
+     *
+     * Requirements:
+     *
+     * - `to` cannot be the zero address.
+     * - the caller must have a balance of at least `amount`.
+     */
+    function transfer(address to, uint256 amount) public virtual override returns (bool) {
+        address owner = _msgSender();
+        _transfer(owner, to, amount);
+        return true;
+    }
+
+    /**
+     * @dev See {IERC20-allowance}.
+     */
+    function allowance(address owner, address spender) public view virtual override returns (uint256) {
+        return _allowances[owner][spender];
+    }
+
+    /**
+     * @dev See {IERC20-approve}.
+     *
+     * NOTE: If `amount` is the maximum `uint256`, the allowance is not updated on
+     * `transferFrom`. This is semantically equivalent to an infinite approval.
+     *
+     * Requirements:
+     *
+     * - `spender` cannot be the zero address.
+     */
+    function approve(address spender, uint256 amount) public virtual override returns (bool) {
+        address owner = _msgSender();
+        _approve(owner, spender, amount);
+        return true;
+    }
+
+    /**
+     * @dev See {IERC20-transferFrom}.
+     *
+     * Emits an {Approval} event indicating the updated allowance. This is not
+     * required by the EIP. See the note at the beginning of {ERC20}.
+     *
+     * NOTE: Does not update the allowance if the current allowance
+     * is the maximum `uint256`.
+     *
+     * Requirements:
+     *
+     * - `from` and `to` cannot be the zero address.
+     * - `from` must have a balance of at least `amount`.
+     * - the caller must have allowance for ``from``'s tokens of at least
+     * `amount`.
+     */
+    function transferFrom(address from, address to, uint256 amount) public virtual override returns (bool) {
+        address spender = _msgSender();
+        _spendAllowance(from, spender, amount);
+        _transfer(from, to, amount);
+        return true;
+    }
+
+    /**
+     * @dev Atomically increases the allowance granted to `spender` by the caller.
+     *
+     * This is an alternative to {approve} that can be used as a mitigation for
+     * problems described in {IERC20-approve}.
+     *
+     * Emits an {Approval} event indicating the updated allowance.
+     *
+     * Requirements:
+     *
+     * - `spender` cannot be the zero address.
+     */
+    function increaseAllowance(address spender, uint256 addedValue) public virtual returns (bool) {
+        address owner = _msgSender();
+        _approve(owner, spender, allowance(owner, spender) + addedValue);
+        return true;
+    }
+
+    /**
+     * @dev Atomically decreases the allowance granted to `spender` by the caller.
+     *
+     * This is an alternative to {approve} that can be used as a mitigation for
+     * problems described in {IERC20-approve}.
+     *
+     * Emits an {Approval} event indicating the updated allowance.
+     *
+     * Requirements:
+     *
+     * - `spender` cannot be the zero address.
+     * - `spender` must have allowance for the caller of at least
+     * `subtractedValue`.
+     */
+    function decreaseAllowance(address spender, uint256 subtractedValue) public virtual returns (bool) {
+        address owner = _msgSender();
+        uint256 currentAllowance = allowance(owner, spender);
+        require(currentAllowance >= subtractedValue, "ERC20: decreased allowance below zero");
+        unchecked {
+            _approve(owner, spender, currentAllowance - subtractedValue);
+        }
+
+        return true;
+    }
+
+    /**
+     * @dev Moves `amount` of tokens from `from` to `to`.
+     *
+     * This internal function is equivalent to {transfer}, and can be used to
+     * e.g. implement automatic token fees, slashing mechanisms, etc.
+     *
+     * Emits a {Transfer} event.
+     *
+     * Requirements:
+     *
+     * - `from` cannot be the zero address.
+     * - `to` cannot be the zero address.
+     * - `from` must have a balance of at least `amount`.
+     */
+    function _transfer(address from, address to, uint256 amount) internal virtual {
+        require(from != address(0), "ERC20: transfer from the zero address");
+        require(to != address(0), "ERC20: transfer to the zero address");
+
+        _beforeTokenTransfer(from, to, amount);
+
+        uint256 fromBalance = _balances[from];
+        require(fromBalance >= amount, "ERC20: transfer amount exceeds balance");
+        unchecked {
+            _balances[from] = fromBalance - amount;
+            // Overflow not possible: the sum of all balances is capped by totalSupply, and the sum is preserved by
+            // decrementing then incrementing.
+            _balances[to] += amount;
+        }
+
+        emit Transfer(from, to, amount);
+
+        _afterTokenTransfer(from, to, amount);
+    }
+
+    /** @dev Creates `amount` tokens and assigns them to `account`, increasing
+     * the total supply.
+     *
+     * Emits a {Transfer} event with `from` set to the zero address.
+     *
+     * Requirements:
+     *
+     * - `account` cannot be the zero address.
+     */
+    function _mint(address account, uint256 amount) internal virtual {
+        require(account != address(0), "ERC20: mint to the zero address");
+
+        _beforeTokenTransfer(address(0), account, amount);
+
+        _totalSupply += amount;
+        unchecked {
+            // Overflow not possible: balance + amount is at most totalSupply + amount, which is checked above.
+            _balances[account] += amount;
+        }
+        emit Transfer(address(0), account, amount);
+
+        _afterTokenTransfer(address(0), account, amount);
+    }
+
+    /**
+     * @dev Destroys `amount` tokens from `account`, reducing the
+     * total supply.
+     *
+     * Emits a {Transfer} event with `to` set to the zero address.
+     *
+     * Requirements:
+     *
+     * - `account` cannot be the zero address.
+     * - `account` must have at least `amount` tokens.
+     */
+    function _burn(address account, uint256 amount) internal virtual {
+        require(account != address(0), "ERC20: burn from the zero address");
+
+        _beforeTokenTransfer(account, address(0), amount);
+
+        uint256 accountBalance = _balances[account];
+        require(accountBalance >= amount, "ERC20: burn amount exceeds balance");
+        unchecked {
+            _balances[account] = accountBalance - amount;
+            // Overflow not possible: amount <= accountBalance <= totalSupply.
+            _totalSupply -= amount;
+        }
+
+        emit Transfer(account, address(0), amount);
+
+        _afterTokenTransfer(account, address(0), amount);
+    }
+
+    /**
+     * @dev Sets `amount` as the allowance of `spender` over the `owner` s tokens.
+     *
+     * This internal function is equivalent to `approve`, and can be used to
+     * e.g. set automatic allowances for certain subsystems, etc.
+     *
+     * Emits an {Approval} event.
+     *
+     * Requirements:
+     *
+     * - `owner` cannot be the zero address.
+     * - `spender` cannot be the zero address.
+     */
+    function _approve(address owner, address spender, uint256 amount) internal virtual {
+        require(owner != address(0), "ERC20: approve from the zero address");
+        require(spender != address(0), "ERC20: approve to the zero address");
+
+        _allowances[owner][spender] = amount;
+        emit Approval(owner, spender, amount);
+    }
+
+    /**
+     * @dev Updates `owner` s allowance for `spender` based on spent `amount`.
+     *
+     * Does not update the allowance amount in case of infinite allowance.
+     * Revert if not enough allowance is available.
+     *
+     * Might emit an {Approval} event.
+     */
+    function _spendAllowance(address owner, address spender, uint256 amount) internal virtual {
+        uint256 currentAllowance = allowance(owner, spender);
+        if (currentAllowance != type(uint256).max) {
+            require(currentAllowance >= amount, "ERC20: insufficient allowance");
+            unchecked {
+                _approve(owner, spender, currentAllowance - amount);
+            }
+        }
+    }
+
+    /**
+     * @dev Hook that is called before any transfer of tokens. This includes
+     * minting and burning.
+     *
+     * Calling conditions:
+     *
+     * - when `from` and `to` are both non-zero, `amount` of ``from``'s tokens
+     * will be transferred to `to`.
+     * - when `from` is zero, `amount` tokens will be minted for `to`.
+     * - when `to` is zero, `amount` of ``from``'s tokens will be burned.
+     * - `from` and `to` are never both zero.
+     *
+     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
+     */
+    function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual {}
+
+    /**
+     * @dev Hook that is called after any transfer of tokens. This includes
+     * minting and burning.
+     *
+     * Calling conditions:
+     *
+     * - when `from` and `to` are both non-zero, `amount` of ``from``'s tokens
+     * has been transferred to `to`.
+     * - when `from` is zero, `amount` tokens have been minted for `to`.
+     * - when `to` is zero, `amount` of ``from``'s tokens have been burned.
+     * - `from` and `to` are never both zero.
+     *
+     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
+     */
+    function _afterTokenTransfer(address from, address to, uint256 amount) internal virtual {}
+
+    /**
+     * @dev This empty reserved space is put in place to allow future versions to add new
+     * variables without shifting down storage in the inheritance chain.
+     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
+     */
+    uint256[45] private __gap;
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts (last updated v4.9.4) (token/ERC20/extensions/ERC20Permit.sol)
+
+pragma solidity ^0.8.0;
+
+import "./IERC20PermitUpgradeable.sol";
+import "../ERC20Upgradeable.sol";
+import "../../../utils/cryptography/ECDSAUpgradeable.sol";
+import "../../../utils/cryptography/EIP712Upgradeable.sol";
+import "../../../utils/CountersUpgradeable.sol";
+import {Initializable} from "../../../proxy/utils/Initializable.sol";
+
+/**
+ * @dev Implementation of the ERC20 Permit extension allowing approvals to be made via signatures, as defined in
+ * https://eips.ethereum.org/EIPS/eip-2612[EIP-2612].
+ *
+ * Adds the {permit} method, which can be used to change an account's ERC20 allowance (see {IERC20-allowance}) by
+ * presenting a message signed by the account. By not relying on `{IERC20-approve}`, the token holder account doesn't
+ * need to send a transaction, and thus is not required to hold Ether at all.
+ *
+ * _Available since v3.4._
+ *
+ * @custom:storage-size 51
+ */
+abstract contract ERC20PermitUpgradeable is Initializable, ERC20Upgradeable, IERC20PermitUpgradeable, EIP712Upgradeable {
+    using CountersUpgradeable for CountersUpgradeable.Counter;
+
+    mapping(address => CountersUpgradeable.Counter) private _nonces;
+
+    // solhint-disable-next-line var-name-mixedcase
+    bytes32 private constant _PERMIT_TYPEHASH =
+        keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)");
+    /**
+     * @dev In previous versions `_PERMIT_TYPEHASH` was declared as `immutable`.
+     * However, to ensure consistency with the upgradeable transpiler, we will continue
+     * to reserve a slot.
+     * @custom:oz-renamed-from _PERMIT_TYPEHASH
+     */
+    // solhint-disable-next-line var-name-mixedcase
+    bytes32 private _PERMIT_TYPEHASH_DEPRECATED_SLOT;
+
+    /**
+     * @dev Initializes the {EIP712} domain separator using the `name` parameter, and setting `version` to `"1"`.
+     *
+     * It's a good idea to use the same `name` that is defined as the ERC20 token name.
+     */
+    function __ERC20Permit_init(string memory name) internal onlyInitializing {
+        __EIP712_init_unchained(name, "1");
+    }
+
+    function __ERC20Permit_init_unchained(string memory) internal onlyInitializing {}
+
+    /**
+     * @inheritdoc IERC20PermitUpgradeable
+     */
+    function permit(
+        address owner,
+        address spender,
+        uint256 value,
+        uint256 deadline,
+        uint8 v,
+        bytes32 r,
+        bytes32 s
+    ) public virtual override {
+        require(block.timestamp <= deadline, "ERC20Permit: expired deadline");
+
+        bytes32 structHash = keccak256(abi.encode(_PERMIT_TYPEHASH, owner, spender, value, _useNonce(owner), deadline));
+
+        bytes32 hash = _hashTypedDataV4(structHash);
+
+        address signer = ECDSAUpgradeable.recover(hash, v, r, s);
+        require(signer == owner, "ERC20Permit: invalid signature");
+
+        _approve(owner, spender, value);
+    }
+
+    /**
+     * @inheritdoc IERC20PermitUpgradeable
+     */
+    function nonces(address owner) public view virtual override returns (uint256) {
+        return _nonces[owner].current();
+    }
+
+    /**
+     * @inheritdoc IERC20PermitUpgradeable
+     */
+    // solhint-disable-next-line func-name-mixedcase
+    function DOMAIN_SEPARATOR() external view override returns (bytes32) {
+        return _domainSeparatorV4();
+    }
+
+    /**
+     * @dev "Consume a nonce": return the current value and increment.
+     *
+     * _Available since v4.1._
+     */
+    function _useNonce(address owner) internal virtual returns (uint256 current) {
+        CountersUpgradeable.Counter storage nonce = _nonces[owner];
+        current = nonce.current();
+        nonce.increment();
+    }
+
+    /**
+     * @dev This empty reserved space is put in place to allow future versions to add new
+     * variables without shifting down storage in the inheritance chain.
+     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
+     */
+    uint256[49] private __gap;
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts v4.4.1 (token/ERC20/extensions/IERC20Metadata.sol)
+
+pragma solidity ^0.8.0;
+
+import "../IERC20Upgradeable.sol";
+
+/**
+ * @dev Interface for the optional metadata functions from the ERC20 standard.
+ *
+ * _Available since v4.1._
+ */
+interface IERC20MetadataUpgradeable is IERC20Upgradeable {
+    /**
+     * @dev Returns the name of the token.
+     */
+    function name() external view returns (string memory);
+
+    /**
+     * @dev Returns the symbol of the token.
+     */
+    function symbol() external view returns (string memory);
+
+    /**
+     * @dev Returns the decimals places of the token.
+     */
+    function decimals() external view returns (uint8);
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts (last updated v4.9.4) (token/ERC20/extensions/IERC20Permit.sol)
+
+pragma solidity ^0.8.0;
+
+/**
+ * @dev Interface of the ERC20 Permit extension allowing approvals to be made via signatures, as defined in
+ * https://eips.ethereum.org/EIPS/eip-2612[EIP-2612].
+ *
+ * Adds the {permit} method, which can be used to change an account's ERC20 allowance (see {IERC20-allowance}) by
+ * presenting a message signed by the account. By not relying on {IERC20-approve}, the token holder account doesn't
+ * need to send a transaction, and thus is not required to hold Ether at all.
+ *
+ * ==== Security Considerations
+ *
+ * There are two important considerations concerning the use of `permit`. The first is that a valid permit signature
+ * expresses an allowance, and it should not be assumed to convey additional meaning. In particular, it should not be
+ * considered as an intention to spend the allowance in any specific way. The second is that because permits have
+ * built-in replay protection and can be submitted by anyone, they can be frontrun. A protocol that uses permits should
+ * take this into consideration and allow a `permit` call to fail. Combining these two aspects, a pattern that may be
+ * generally recommended is:
+ *
+ * ```solidity
+ * function doThingWithPermit(..., uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s) public {
+ *     try token.permit(msg.sender, address(this), value, deadline, v, r, s) {} catch {}
+ *     doThing(..., value);
+ * }
+ *
+ * function doThing(..., uint256 value) public {
+ *     token.safeTransferFrom(msg.sender, address(this), value);
+ *     ...
+ * }
+ * ```
+ *
+ * Observe that: 1) `msg.sender` is used as the owner, leaving no ambiguity as to the signer intent, and 2) the use of
+ * `try/catch` allows the permit to fail and makes the code tolerant to frontrunning. (See also
+ * {SafeERC20-safeTransferFrom}).
+ *
+ * Additionally, note that smart contract wallets (such as Argent or Safe) are not able to produce permit signatures, so
+ * contracts should have entry points that don't rely on permit.
+ */
+interface IERC20PermitUpgradeable {
+    /**
+     * @dev Sets `value` as the allowance of `spender` over ``owner``'s tokens,
+     * given ``owner``'s signed approval.
+     *
+     * IMPORTANT: The same issues {IERC20-approve} has related to transaction
+     * ordering also apply here.
+     *
+     * Emits an {Approval} event.
+     *
+     * Requirements:
+     *
+     * - `spender` cannot be the zero address.
+     * - `deadline` must be a timestamp in the future.
+     * - `v`, `r` and `s` must be a valid `secp256k1` signature from `owner`
+     * over the EIP712-formatted function arguments.
+     * - the signature must use ``owner``'s current nonce (see {nonces}).
+     *
+     * For more information on the signature format, see the
+     * https://eips.ethereum.org/EIPS/eip-2612#specification[relevant EIP
+     * section].
+     *
+     * CAUTION: See Security Considerations above.
+     */
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
+    /**
+     * @dev Returns the current nonce for `owner`. This value must be
+     * included whenever a signature is generated for {permit}.
+     *
+     * Every successful call to {permit} increases ``owner``'s nonce by one. This
+     * prevents a signature from being used multiple times.
+     */
+    function nonces(address owner) external view returns (uint256);
+
+    /**
+     * @dev Returns the domain separator used in the encoding of the signature for {permit}, as defined by {EIP712}.
+     */
+    // solhint-disable-next-line func-name-mixedcase
+    function DOMAIN_SEPARATOR() external view returns (bytes32);
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts (last updated v4.9.0) (token/ERC20/IERC20.sol)
+
+pragma solidity ^0.8.0;
+
+/**
+ * @dev Interface of the ERC20 standard as defined in the EIP.
+ */
+interface IERC20Upgradeable {
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
+     * @dev Returns the amount of tokens in existence.
+     */
+    function totalSupply() external view returns (uint256);
+
+    /**
+     * @dev Returns the amount of tokens owned by `account`.
+     */
+    function balanceOf(address account) external view returns (uint256);
+
+    /**
+     * @dev Moves `amount` tokens from the caller's account to `to`.
+     *
+     * Returns a boolean value indicating whether the operation succeeded.
+     *
+     * Emits a {Transfer} event.
+     */
+    function transfer(address to, uint256 amount) external returns (bool);
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
+     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
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
+    function approve(address spender, uint256 amount) external returns (bool);
+
+    /**
+     * @dev Moves `amount` tokens from `from` to `to` using the
+     * allowance mechanism. `amount` is then deducted from the caller's
+     * allowance.
+     *
+     * Returns a boolean value indicating whether the operation succeeded.
+     *
+     * Emits a {Transfer} event.
+     */
+    function transferFrom(address from, address to, uint256 amount) external returns (bool);
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts (last updated v4.9.3) (token/ERC20/utils/SafeERC20.sol)
+
+pragma solidity ^0.8.0;
+
+import "../IERC20Upgradeable.sol";
+import "../extensions/IERC20PermitUpgradeable.sol";
+import "../../../utils/AddressUpgradeable.sol";
+
+/**
+ * @title SafeERC20
+ * @dev Wrappers around ERC20 operations that throw on failure (when the token
+ * contract returns false). Tokens that return no value (and instead revert or
+ * throw on failure) are also supported, non-reverting calls are assumed to be
+ * successful.
+ * To use this library you can add a `using SafeERC20 for IERC20;` statement to your contract,
+ * which allows you to call the safe operations as `token.safeTransfer(...)`, etc.
+ */
+library SafeERC20Upgradeable {
+    using AddressUpgradeable for address;
+
+    /**
+     * @dev Transfer `value` amount of `token` fr
[truncated — full diff is 859,494 bytes]
> ```

> </details>

> <details>
> <summary>📝 Source diff — upgrade #5 (<code>0x1D10...3A00</code> → <code>0xBcf5...e001</code>): +17/-22877 lines (truncated)</summary>

> ```diff
--- old_impl
+++ new_impl
@@ -1,22889 +1,29 @@
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v4.9.0) (access/AccessControl.sol)
-
-pragma solidity ^0.8.0;
-
-import "./IAccessControlUpgradeable.sol";
-import "../utils/ContextUpgradeable.sol";
-import "../utils/StringsUpgradeable.sol";
-import "../utils/introspection/ERC165Upgradeable.sol";
-import {Initializable} from "../proxy/utils/Initializable.sol";
-
-/**
- * @dev Contract module that allows children to implement role-based access
- * control mechanisms. This is a lightweight version that doesn't allow enumerating role
- * members except through off-chain means by accessing the contract event logs. Some
- * applications may benefit from on-chain enumerability, for those cases see
- * {AccessControlEnumerable}.
- *
- * Roles are referred to by their `bytes32` identifier. These should be exposed
- * in the external API and be unique. The best way to achieve this is by
- * using `public constant` hash digests:
- *
- * ```solidity
- * bytes32 public constant MY_ROLE = keccak256("MY_ROLE");
- * ```
- *
- * Roles can be used to represent a set of permissions. To restrict access to a
- * function call, use {hasRole}:
- *
- * ```solidity
- * function foo() public {
- *     require(hasRole(MY_ROLE, msg.sender));
- *     ...
- * }
- * ```
- *
- * Roles can be granted and revoked dynamically via the {grantRole} and
- * {revokeRole} functions. Each role has an associated admin role, and only
- * accounts that have a role's admin role can call {grantRole} and {revokeRole}.
- *
- * By default, the admin role for all roles is `DEFAULT_ADMIN_ROLE`, which means
- * that only accounts with this role will be able to grant or revoke other
- * roles. More complex role relationships can be created by using
- * {_setRoleAdmin}.
- *
- * WARNING: The `DEFAULT_ADMIN_ROLE` is also its own admin: it has permission to
- * grant and revoke this role. Extra precautions should be taken to secure
- * accounts that have been granted it. We recommend using {AccessControlDefaultAdminRules}
- * to enforce additional security measures for this role.
- */
-abstract contract AccessControlUpgradeable is Initializable, ContextUpgradeable, IAccessControlUpgradeable, ERC165Upgradeable {
-    struct RoleData {
-        mapping(address => bool) members;
-        bytes32 adminRole;
-    }
-
-    mapping(bytes32 => RoleData) private _roles;
-
-    bytes32 public constant DEFAULT_ADMIN_ROLE = 0x00;
-
-    /**
-     * @dev Modifier that checks that an account has a specific role. Reverts
-     * with a standardized message including the required role.
-     *
-     * The format of the revert reason is given by the following regular expression:
-     *
-     *  /^AccessControl: account (0x[0-9a-f]{40}) is missing role (0x[0-9a-f]{64})$/
-     *
-     * _Available since v4.1._
-     */
-    modifier onlyRole(bytes32 role) {
-        _checkRole(role);
-        _;
-    }
-
-    function __AccessControl_init() internal onlyInitializing {
-    }
-
-    function __AccessControl_init_unchained() internal onlyInitializing {
-    }
-    /**
-     * @dev See {IERC165-supportsInterface}.
-     */
-    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
-        return interfaceId == type(IAccessControlUpgradeable).interfaceId || super.supportsInterface(interfaceId);
-    }
-
-    /**
-     * @dev Returns `true` if `account` has been granted `role`.
-     */
-    function hasRole(bytes32 role, address account) public view virtual override returns (bool) {
-        return _roles[role].members[account];
-    }
-
-    /**
-     * @dev Revert with a standard message if `_msgSender()` is missing `role`.
-     * Overriding this function changes the behavior of the {onlyRole} modifier.
-     *
-     * Format of the revert message is described in {_checkRole}.
-     *
-     * _Available since v4.6._
-     */
-    function _checkRole(bytes32 role) internal view virtual {
-        _checkRole(role, _msgSender());
-    }
-
-    /**
-     * @dev Revert with a standard message if `account` is missing `role`.
-     *
-     * The format of the revert reason is given by the following regular expression:
-     *
-     *  /^AccessControl: account (0x[0-9a-f]{40}) is missing role (0x[0-9a-f]{64})$/
-     */
-    function _checkRole(bytes32 role, address account) internal view virtual {
-        if (!hasRole(role, account)) {
-            revert(
-                string(
-                    abi.encodePacked(
-                        "AccessControl: account ",
-                        StringsUpgradeable.toHexString(account),
-                        " is missing role ",
-                        StringsUpgradeable.toHexString(uint256(role), 32)
-                    )
-                )
-            );
-        }
-    }
-
-    /**
-     * @dev Returns the admin role that controls `role`. See {grantRole} and
-     * {revokeRole}.
-     *
-     * To change a role's admin, use {_setRoleAdmin}.
-     */
-    function getRoleAdmin(bytes32 role) public view virtual override returns (bytes32) {
-        return _roles[role].adminRole;
-    }
-
-    /**
-     * @dev Grants `role` to `account`.
-     *
-     * If `account` had not been already granted `role`, emits a {RoleGranted}
-     * event.
-     *
-     * Requirements:
-     *
-     * - the caller must have ``role``'s admin role.
-     *
-     * May emit a {RoleGranted} event.
-     */
-    function grantRole(bytes32 role, address account) public virtual override onlyRole(getRoleAdmin(role)) {
-        _grantRole(role, account);
-    }
-
-    /**
-     * @dev Revokes `role` from `account`.
-     *
-     * If `account` had been granted `role`, emits a {RoleRevoked} event.
-     *
-     * Requirements:
-     *
-     * - the caller must have ``role``'s admin role.
-     *
-     * May emit a {RoleRevoked} event.
-     */
-    function revokeRole(bytes32 role, address account) public virtual override onlyRole(getRoleAdmin(role)) {
-        _revokeRole(role, account);
-    }
-
-    /**
-     * @dev Revokes `role` from the calling account.
-     *
-     * Roles are often managed via {grantRole} and {revokeRole}: this function's
-     * purpose is to provide a mechanism for accounts to lose their privileges
-     * if they are compromised (such as when a trusted device is misplaced).
-     *
-     * If the calling account had been revoked `role`, emits a {RoleRevoked}
-     * event.
-     *
-     * Requirements:
-     *
-     * - the caller must be `account`.
-     *
-     * May emit a {RoleRevoked} event.
-     */
-    function renounceRole(bytes32 role, address account) public virtual override {
-        require(account == _msgSender(), "AccessControl: can only renounce roles for self");
-
-        _revokeRole(role, account);
-    }
-
-    /**
-     * @dev Grants `role` to `account`.
-     *
-     * If `account` had not been already granted `role`, emits a {RoleGranted}
-     * event. Note that unlike {grantRole}, this function doesn't perform any
-     * checks on the calling account.
-     *
-     * May emit a {RoleGranted} event.
-     *
-     * [WARNING]
-     * ====
-     * This function should only be called from the constructor when setting
-     * up the initial roles for the system.
-     *
-     * Using this function in any other way is effectively circumventing the admin
-     * system imposed by {AccessControl}.
-     * ====
-     *
-     * NOTE: This function is deprecated in favor of {_grantRole}.
-     */
-    function _setupRole(bytes32 role, address account) internal virtual {
-        _grantRole(role, account);
-    }
-
-    /**
-     * @dev Sets `adminRole` as ``role``'s admin role.
-     *
-     * Emits a {RoleAdminChanged} event.
-     */
-    function _setRoleAdmin(bytes32 role, bytes32 adminRole) internal virtual {
-        bytes32 previousAdminRole = getRoleAdmin(role);
-        _roles[role].adminRole = adminRole;
-        emit RoleAdminChanged(role, previousAdminRole, adminRole);
-    }
-
-    /**
-     * @dev Grants `role` to `account`.
-     *
-     * Internal function without access restriction.
-     *
-     * May emit a {RoleGranted} event.
-     */
-    function _grantRole(bytes32 role, address account) internal virtual {
-        if (!hasRole(role, account)) {
-            _roles[role].members[account] = true;
-            emit RoleGranted(role, account, _msgSender());
-        }
-    }
-
-    /**
-     * @dev Revokes `role` from `account`.
-     *
-     * Internal function without access restriction.
-     *
-     * May emit a {RoleRevoked} event.
-     */
-    function _revokeRole(bytes32 role, address account) internal virtual {
-        if (hasRole(role, account)) {
-            _roles[role].members[account] = false;
-            emit RoleRevoked(role, account, _msgSender());
-        }
-    }
-
-    /**
-     * @dev This empty reserved space is put in place to allow future versions to add new
-     * variables without shifting down storage in the inheritance chain.
-     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
-     */
-    uint256[49] private __gap;
-}
-
-
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts v4.4.1 (access/IAccessControl.sol)
-
-pragma solidity ^0.8.0;
-
-/**
- * @dev External interface of AccessControl declared to support ERC165 detection.
- */
-interface IAccessControlUpgradeable {
-    /**
-     * @dev Emitted when `newAdminRole` is set as ``role``'s admin role, replacing `previousAdminRole`
-     *
-     * `DEFAULT_ADMIN_ROLE` is the starting admin for all roles, despite
-     * {RoleAdminChanged} not being emitted signaling this.
-     *
-     * _Available since v3.1._
-     */
-    event RoleAdminChanged(bytes32 indexed role, bytes32 indexed previousAdminRole, bytes32 indexed newAdminRole);
-
-    /**
-     * @dev Emitted when `account` is granted `role`.
-     *
-     * `sender` is the account that originated the contract call, an admin role
-     * bearer except when using {AccessControl-_setupRole}.
-     */
-    event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender);
-
-    /**
-     * @dev Emitted when `account` is revoked `role`.
-     *
-     * `sender` is the account that originated the contract call:
-     *   - if using `revokeRole`, it is the admin role bearer
-     *   - if using `renounceRole`, it is the role bearer (i.e. `account`)
-     */
-    event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender);
-
-    /**
-     * @dev Returns `true` if `account` has been granted `role`.
-     */
-    function hasRole(bytes32 role, address account) external view returns (bool);
-
-    /**
-     * @dev Returns the admin role that controls `role`. See {grantRole} and
-     * {revokeRole}.
-     *
-     * To change a role's admin, use {AccessControl-_setRoleAdmin}.
-     */
-    function getRoleAdmin(bytes32 role) external view returns (bytes32);
-
-    /**
-     * @dev Grants `role` to `account`.
-     *
-     * If `account` had not been already granted `role`, emits a {RoleGranted}
-     * event.
-     *
-     * Requirements:
-     *
-     * - the caller must have ``role``'s admin role.
-     */
-    function grantRole(bytes32 role, address account) external;
-
-    /**
-     * @dev Revokes `role` from `account`.
-     *
-     * If `account` had been granted `role`, emits a {RoleRevoked} event.
-     *
-     * Requirements:
-     *
-     * - the caller must have ``role``'s admin role.
-     */
-    function revokeRole(bytes32 role, address account) external;
-
-    /**
-     * @dev Revokes `role` from the calling account.
-     *
-     * Roles are often managed via {grantRole} and {revokeRole}: this function's
-     * purpose is to provide a mechanism for accounts to lose their privileges
-     * if they are compromised (such as when a trusted device is misplaced).
-     *
-     * If the calling account had been granted `role`, emits a {RoleRevoked}
-     * event.
-     *
-     * Requirements:
-     *
-     * - the caller must be `account`.
-     */
-    function renounceRole(bytes32 role, address account) external;
-}
-
-
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v4.9.0) (interfaces/IERC5267.sol)
-
-pragma solidity ^0.8.0;
-
-interface IERC5267Upgradeable {
-    /**
-     * @dev MAY be emitted to signal that the domain could have changed.
-     */
-    event EIP712DomainChanged();
-
-    /**
-     * @dev returns the fields and values that describe the domain separator used by this contract for EIP-712
-     * signature.
-     */
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
-}
-
-
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v4.9.0) (proxy/utils/Initializable.sol)
-
-pragma solidity ^0.8.2;
-
-import "../../utils/AddressUpgradeable.sol";
-
-/**
- * @dev This is a base contract to aid in writing upgradeable contracts, or any kind of contract that will be deployed
- * behind a proxy. Since proxied contracts do not make use of a constructor, it's common to move constructor logic to an
- * external initializer function, usually called `initialize`. It then becomes necessary to protect this initializer
- * function so it can only be called once. The {initializer} modifier provided by this contract will have this effect.
- *
- * The initialization functions use a version number. Once a version number is used, it is consumed and cannot be
- * reused. This mechanism prevents re-execution of each "step" but allows the creation of new initialization steps in
- * case an upgrade adds a module that needs to be initialized.
- *
- * For example:
- *
- * [.hljs-theme-light.nopadding]
- * ```solidity
- * contract MyToken is ERC20Upgradeable {
- *     function initialize() initializer public {
- *         __ERC20_init("MyToken", "MTK");
- *     }
- * }
- *
- * contract MyTokenV2 is MyToken, ERC20PermitUpgradeable {
- *     function initializeV2() reinitializer(2) public {
- *         __ERC20Permit_init("MyToken");
- *     }
- * }
- * ```
- *
- * TIP: To avoid leaving the proxy in an uninitialized state, the initializer function should be called as early as
- * possible by providing the encoded function call as the `_data` argument to {ERC1967Proxy-constructor}.
- *
- * CAUTION: When used with inheritance, manual care must be taken to not invoke a parent initializer twice, or to ensure
- * that all initializers are idempotent. This is not verified automatically as constructors are by Solidity.
- *
- * [CAUTION]
- * ====
- * Avoid leaving a contract uninitialized.
- *
- * An uninitialized contract can be taken over by an attacker. This applies to both a proxy and its implementation
- * contract, which may impact the proxy. To prevent the implementation contract from being used, you should invoke
- * the {_disableInitializers} function in the constructor to automatically lock it when it is deployed:
- *
- * [.hljs-theme-light.nopadding]
- * ```
- * /// @custom:oz-upgrades-unsafe-allow constructor
- * constructor() {
- *     _disableInitializers();
- * }
- * ```
- * ====
- */
-abstract contract Initializable {
-    /**
-     * @dev Indicates that the contract has been initialized.
-     * @custom:oz-retyped-from bool
-     */
-    uint8 private _initialized;
-
-    /**
-     * @dev Indicates that the contract is in the process of being initialized.
-     */
-    bool private _initializing;
-
-    /**
-     * @dev Triggered when the contract has been initialized or reinitialized.
-     */
-    event Initialized(uint8 version);
-
-    /**
-     * @dev A modifier that defines a protected initializer function that can be invoked at most once. In its scope,
-     * `onlyInitializing` functions can be used to initialize parent contracts.
-     *
-     * Similar to `reinitializer(1)`, except that functions marked with `initializer` can be nested in the context of a
-     * constructor.
-     *
-     * Emits an {Initialized} event.
-     */
-    modifier initializer() {
-        bool isTopLevelCall = !_initializing;
-        require(
-            (isTopLevelCall && _initialized < 1) || (!AddressUpgradeable.isContract(address(this)) && _initialized == 1),
-            "Initializable: contract is already initialized"
-        );
-        _initialized = 1;
-        if (isTopLevelCall) {
-            _initializing = true;
-        }
-        _;
-        if (isTopLevelCall) {
-            _initializing = false;
-            emit Initialized(1);
-        }
-    }
-
-    /**
-     * @dev A modifier that defines a protected reinitializer function that can be invoked at most once, and only if the
-     * contract hasn't been initialized to a greater version before. In its scope, `onlyInitializing` functions can be
-     * used to initialize parent contracts.
-     *
-     * A reinitializer may be used after the original initialization step. This is essential to configure modules that
-     * are added through upgrades and that require initialization.
-     *
-     * When `version` is 1, this modifier is similar to `initializer`, except that functions marked with `reinitializer`
-     * cannot be nested. If one is invoked in the context of another, execution will revert.
-     *
-     * Note that versions can jump in increments greater than 1; this implies that if multiple reinitializers coexist in
-     * a contract, executing them in the right order is up to the developer or operator.
-     *
-     * WARNING: setting the version to 255 will prevent any future reinitialization.
-     *
-     * Emits an {Initialized} event.
-     */
-    modifier reinitializer(uint8 version) {
-        require(!_initializing && _initialized < version, "Initializable: contract is already initialized");
-        _initialized = version;
-        _initializing = true;
-        _;
-        _initializing = false;
-        emit Initialized(version);
-    }
-
-    /**
-     * @dev Modifier to protect an initialization function so that it can only be invoked by functions with the
-     * {initializer} and {reinitializer} modifiers, directly or indirectly.
-     */
-    modifier onlyInitializing() {
-        require(_initializing, "Initializable: contract is not initializing");
-        _;
-    }
-
-    /**
-     * @dev Locks the contract, preventing any future reinitialization. This cannot be part of an initializer call.
-     * Calling this in the constructor of a contract will prevent that contract from being initialized or reinitialized
-     * to any version. It is recommended to use this to lock implementation contracts that are designed to be called
-     * through proxies.
-     *
-     * Emits an {Initialized} event the first time it is successfully executed.
-     */
-    function _disableInitializers() internal virtual {
-        require(!_initializing, "Initializable: contract is initializing");
-        if (_initialized != type(uint8).max) {
-            _initialized = type(uint8).max;
-            emit Initialized(type(uint8).max);
-        }
-    }
-
-    /**
-     * @dev Returns the highest version that has been initialized. See {reinitializer}.
-     */
-    function _getInitializedVersion() internal view returns (uint8) {
-        return _initialized;
-    }
-
-    /**
-     * @dev Returns `true` if the contract is currently initializing. See {onlyInitializing}.
-     */
-    function _isInitializing() internal view returns (bool) {
-        return _initializing;
-    }
-}
-
-
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v4.9.0) (security/ReentrancyGuard.sol)
-
-pragma solidity ^0.8.0;
-import {Initializable} from "../proxy/utils/Initializable.sol";
-
-/**
- * @dev Contract module that helps prevent reentrant calls to a function.
- *
- * Inheriting from `ReentrancyGuard` will make the {nonReentrant} modifier
- * available, which can be applied to functions to make sure there are no nested
- * (reentrant) calls to them.
- *
- * Note that because there is a single `nonReentrant` guard, functions marked as
- * `nonReentrant` may not call one another. This can be worked around by making
- * those functions `private`, and then adding `external` `nonReentrant` entry
- * points to them.
- *
- * TIP: If you would like to learn more about reentrancy and alternative ways
- * to protect against it, check out our blog post
- * https://blog.openzeppelin.com/reentrancy-after-istanbul/[Reentrancy After Istanbul].
- */
-abstract contract ReentrancyGuardUpgradeable is Initializable {
-    // Booleans are more expensive than uint256 or any type that takes up a full
-    // word because each write operation emits an extra SLOAD to first read the
-    // slot's contents, replace the bits taken up by the boolean, and then write
-    // back. This is the compiler's defense against contract upgrades and
-    // pointer aliasing, and it cannot be disabled.
-
-    // The values being non-zero value makes deployment a bit more expensive,
-    // but in exchange the refund on every call to nonReentrant will be lower in
-    // amount. Since refunds are capped to a percentage of the total
-    // transaction's gas, it is best to keep them low in cases like this one, to
-    // increase the likelihood of the full refund coming into effect.
-    uint256 private constant _NOT_ENTERED = 1;
-    uint256 private constant _ENTERED = 2;
-
-    uint256 private _status;
-
-    function __ReentrancyGuard_init() internal onlyInitializing {
-        __ReentrancyGuard_init_unchained();
-    }
-
-    function __ReentrancyGuard_init_unchained() internal onlyInitializing {
-        _status = _NOT_ENTERED;
-    }
-
-    /**
-     * @dev Prevents a contract from calling itself, directly or indirectly.
-     * Calling a `nonReentrant` function from another `nonReentrant`
-     * function is not supported. It is possible to prevent this from happening
-     * by making the `nonReentrant` function external, and making it call a
-     * `private` function that does the actual work.
-     */
-    modifier nonReentrant() {
-        _nonReentrantBefore();
-        _;
-        _nonReentrantAfter();
-    }
-
-    function _nonReentrantBefore() private {
-        // On the first call to nonReentrant, _status will be _NOT_ENTERED
-        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");
-
-        // Any calls to nonReentrant after this point will fail
-        _status = _ENTERED;
-    }
-
-    function _nonReentrantAfter() private {
-        // By storing the original value once again, a refund is triggered (see
-        // https://eips.ethereum.org/EIPS/eip-2200)
-        _status = _NOT_ENTERED;
-    }
-
-    /**
-     * @dev Returns true if the reentrancy guard is currently set to "entered", which indicates there is a
-     * `nonReentrant` function in the call stack.
-     */
-    function _reentrancyGuardEntered() internal view returns (bool) {
-        return _status == _ENTERED;
-    }
-
-    /**
-     * @dev This empty reserved space is put in place to allow future versions to add new
-     * variables without shifting down storage in the inheritance chain.
-     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
-     */
-    uint256[49] private __gap;
-}
-
-
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v4.9.0) (token/ERC20/ERC20.sol)
-
-pragma solidity ^0.8.0;
-
-import "./IERC20Upgradeable.sol";
-import "./extensions/IERC20MetadataUpgradeable.sol";
-import "../../utils/ContextUpgradeable.sol";
-import {Initializable} from "../../proxy/utils/Initializable.sol";
-
-/**
- * @dev Implementation of the {IERC20} interface.
- *
- * This implementation is agnostic to the way tokens are created. This means
- * that a supply mechanism has to be added in a derived contract using {_mint}.
- * For a generic mechanism see {ERC20PresetMinterPauser}.
- *
- * TIP: For a detailed writeup see our guide
- * https://forum.openzeppelin.com/t/how-to-implement-erc20-supply-mechanisms/226[How
- * to implement supply mechanisms].
- *
- * The default value of {decimals} is 18. To change this, you should override
- * this function so it returns a different value.
- *
- * We have followed general OpenZeppelin Contracts guidelines: functions revert
- * instead returning `false` on failure. This behavior is nonetheless
- * conventional and does not conflict with the expectations of ERC20
- * applications.
- *
- * Additionally, an {Approval} event is emitted on calls to {transferFrom}.
- * This allows applications to reconstruct the allowance for all accounts just
- * by listening to said events. Other implementations of the EIP may not emit
- * these events, as it isn't required by the specification.
- *
- * Finally, the non-standard {decreaseAllowance} and {increaseAllowance}
- * functions have been added to mitigate the well-known issues around setting
- * allowances. See {IERC20-approve}.
- */
-contract ERC20Upgradeable is Initializable, ContextUpgradeable, IERC20Upgradeable, IERC20MetadataUpgradeable {
-    mapping(address => uint256) private _balances;
-
-    mapping(address => mapping(address => uint256)) private _allowances;
-
-    uint256 private _totalSupply;
-
-    string private _name;
-    string private _symbol;
-
-    /**
-     * @dev Sets the values for {name} and {symbol}.
-     *
-     * All two of these values are immutable: they can only be set once during
-     * construction.
-     */
-    function __ERC20_init(string memory name_, string memory symbol_) internal onlyInitializing {
-        __ERC20_init_unchained(name_, symbol_);
-    }
-
-    function __ERC20_init_unchained(string memory name_, string memory symbol_) internal onlyInitializing {
-        _name = name_;
-        _symbol = symbol_;
-    }
-
-    /**
-     * @dev Returns the name of the token.
-     */
-    function name() public view virtual override returns (string memory) {
-        return _name;
-    }
-
-    /**
-     * @dev Returns the symbol of the token, usually a shorter version of the
-     * name.
-     */
-    function symbol() public view virtual override returns (string memory) {
-        return _symbol;
-    }
-
-    /**
-     * @dev Returns the number of decimals used to get its user representation.
-     * For example, if `decimals` equals `2`, a balance of `505` tokens should
-     * be displayed to a user as `5.05` (`505 / 10 ** 2`).
-     *
-     * Tokens usually opt for a value of 18, imitating the relationship between
-     * Ether and Wei. This is the default value returned by this function, unless
-     * it's overridden.
-     *
-     * NOTE: This information is only used for _display_ purposes: it in
-     * no way affects any of the arithmetic of the contract, including
-     * {IERC20-balanceOf} and {IERC20-transfer}.
-     */
-    function decimals() public view virtual override returns (uint8) {
-        return 18;
-    }
-
-    /**
-     * @dev See {IERC20-totalSupply}.
-     */
-    function totalSupply() public view virtual override returns (uint256) {
-        return _totalSupply;
-    }
-
-    /**
-     * @dev See {IERC20-balanceOf}.
-     */
-    function balanceOf(address account) public view virtual override returns (uint256) {
-        return _balances[account];
-    }
-
-    /**
-     * @dev See {IERC20-transfer}.
-     *
-     * Requirements:
-     *
-     * - `to` cannot be the zero address.
-     * - the caller must have a balance of at least `amount`.
-     */
-    function transfer(address to, uint256 amount) public virtual override returns (bool) {
-        address owner = _msgSender();
-        _transfer(owner, to, amount);
-        return true;
-    }
-
-    /**
-     * @dev See {IERC20-allowance}.
-     */
-    function allowance(address owner, address spender) public view virtual override returns (uint256) {
-        return _allowances[owner][spender];
-    }
-
-    /**
-     * @dev See {IERC20-approve}.
-     *
-     * NOTE: If `amount` is the maximum `uint256`, the allowance is not updated on
-     * `transferFrom`. This is semantically equivalent to an infinite approval.
-     *
-     * Requirements:
-     *
-     * - `spender` cannot be the zero address.
-     */
-    function approve(address spender, uint256 amount) public virtual override returns (bool) {
-        address owner = _msgSender();
-        _approve(owner, spender, amount);
-        return true;
-    }
-
-    /**
-     * @dev See {IERC20-transferFrom}.
-     *
-     * Emits an {Approval} event indicating the updated allowance. This is not
-     * required by the EIP. See the note at the beginning of {ERC20}.
-     *
-     * NOTE: Does not update the allowance if the current allowance
-     * is the maximum `uint256`.
-     *
-     * Requirements:
-     *
-     * - `from` and `to` cannot be the zero address.
-     * - `from` must have a balance of at least `amount`.
-     * - the caller must have allowance for ``from``'s tokens of at least
-     * `amount`.
-     */
-    function transferFrom(address from, address to, uint256 amount) public virtual override returns (bool) {
-        address spender = _msgSender();
-        _spendAllowance(from, spender, amount);
-        _transfer(from, to, amount);
-        return true;
-    }
-
-    /**
-     * @dev Atomically increases the allowance granted to `spender` by the caller.
-     *
-     * This is an alternative to {approve} that can be used as a mitigation for
-     * problems described in {IERC20-approve}.
-     *
-     * Emits an {Approval} event indicating the updated allowance.
-     *
-     * Requirements:
-     *
-     * - `spender` cannot be the zero address.
-     */
-    function increaseAllowance(address spender, uint256 addedValue) public virtual returns (bool) {
-        address owner = _msgSender();
-        _approve(owner, spender, allowance(owner, spender) + addedValue);
-        return true;
-    }
-
-    /**
-     * @dev Atomically decreases the allowance granted to `spender` by the caller.
-     *
-     * This is an alternative to {approve} that can be used as a mitigation for
-     * problems described in {IERC20-approve}.
-     *
-     * Emits an {Approval} event indicating the updated allowance.
-     *
-     * Requirements:
-     *
-     * - `spender` cannot be the zero address.
-     * - `spender` must have allowance for the caller of at least
-     * `subtractedValue`.
-     */
-    function decreaseAllowance(address spender, uint256 subtractedValue) public virtual returns (bool) {
-        address owner = _msgSender();
-        uint256 currentAllowance = allowance(owner, spender);
-        require(currentAllowance >= subtractedValue, "ERC20: decreased allowance below zero");
-        unchecked {
-            _approve(owner, spender, currentAllowance - subtractedValue);
-        }
-
-        return true;
-    }
-
-    /**
-     * @dev Moves `amount` of tokens from `from` to `to`.
-     *
-     * This internal function is equivalent to {transfer}, and can be used to
-     * e.g. implement automatic token fees, slashing mechanisms, etc.
-     *
-     * Emits a {Transfer} event.
-     *
-     * Requirements:
-     *
-     * - `from` cannot be the zero address.
-     * - `to` cannot be the zero address.
-     * - `from` must have a balance of at least `amount`.
-     */
-    function _transfer(address from, address to, uint256 amount) internal virtual {
-        require(from != address(0), "ERC20: transfer from the zero address");
-        require(to != address(0), "ERC20: transfer to the zero address");
-
-        _beforeTokenTransfer(from, to, amount);
-
-        uint256 fromBalance = _balances[from];
-        require(fromBalance >= amount, "ERC20: transfer amount exceeds balance");
-        unchecked {
-            _balances[from] = fromBalance - amount;
-            // Overflow not possible: the sum of all balances is capped by totalSupply, and the sum is preserved by
-            // decrementing then incrementing.
-            _balances[to] += amount;
-        }
-
-        emit Transfer(from, to, amount);
-
-        _afterTokenTransfer(from, to, amount);
-    }
-
-    /** @dev Creates `amount` tokens and assigns them to `account`, increasing
-     * the total supply.
-     *
-     * Emits a {Transfer} event with `from` set to the zero address.
-     *
-     * Requirements:
-     *
-     * - `account` cannot be the zero address.
-     */
-    function _mint(address account, uint256 amount) internal virtual {
-        require(account != address(0), "ERC20: mint to the zero address");
-
-        _beforeTokenTransfer(address(0), account, amount);
-
-        _totalSupply += amount;
-        unchecked {
-            // Overflow not possible: balance + amount is at most totalSupply + amount, which is checked above.
-            _balances[account] += amount;
-        }
-        emit Transfer(address(0), account, amount);
-
-        _afterTokenTransfer(address(0), account, amount);
-    }
-
-    /**
-     * @dev Destroys `amount` tokens from `account`, reducing the
-     * total supply.
-     *
-     * Emits a {Transfer} event with `to` set to the zero address.
-     *
-     * Requirements:
-     *
-     * - `account` cannot be the zero address.
-     * - `account` must have at least `amount` tokens.
-     */
-    function _burn(address account, uint256 amount) internal virtual {
-        require(account != address(0), "ERC20: burn from the zero address");
-
-        _beforeTokenTransfer(account, address(0), amount);
-
-        uint256 accountBalance = _balances[account];
-        require(accountBalance >= amount, "ERC20: burn amount exceeds balance");
-        unchecked {
-            _balances[account] = accountBalance - amount;
-            // Overflow not possible: amount <= accountBalance <= totalSupply.
-            _totalSupply -= amount;
-        }
-
-        emit Transfer(account, address(0), amount);
-
-        _afterTokenTransfer(account, address(0), amount);
-    }
-
-    /**
-     * @dev Sets `amount` as the allowance of `spender` over the `owner` s tokens.
-     *
-     * This internal function is equivalent to `approve`, and can be used to
-     * e.g. set automatic allowances for certain subsystems, etc.
-     *
-     * Emits an {Approval} event.
-     *
-     * Requirements:
-     *
-     * - `owner` cannot be the zero address.
-     * - `spender` cannot be the zero address.
-     */
-    function _approve(address owner, address spender, uint256 amount) internal virtual {
-        require(owner != address(0), "ERC20: approve from the zero address");
-        require(spender != address(0), "ERC20: approve to the zero address");
-
-        _allowances[owner][spender] = amount;
-        emit Approval(owner, spender, amount);
-    }
-
-    /**
-     * @dev Updates `owner` s allowance for `spender` based on spent `amount`.
-     *
-     * Does not update the allowance amount in case of infinite allowance.
-     * Revert if not enough allowance is available.
-     *
-     * Might emit an {Approval} event.
-     */
-    function _spendAllowance(address owner, address spender, uint256 amount) internal virtual {
-        uint256 currentAllowance = allowance(owner, spender);
-        if (currentAllowance != type(uint256).max) {
-            require(currentAllowance >= amount, "ERC20: insufficient allowance");
-            unchecked {
-                _approve(owner, spender, currentAllowance - amount);
-            }
-        }
-    }
-
-    /**
-     * @dev Hook that is called before any transfer of tokens. This includes
-     * minting and burning.
-     *
-     * Calling conditions:
-     *
-     * - when `from` and `to` are both non-zero, `amount` of ``from``'s tokens
-     * will be transferred to `to`.
-     * - when `from` is zero, `amount` tokens will be minted for `to`.
-     * - when `to` is zero, `amount` of ``from``'s tokens will be burned.
-     * - `from` and `to` are never both zero.
-     *
-     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
-     */
-    function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual {}
-
-    /**
-     * @dev Hook that is called after any transfer of tokens. This includes
-     * minting and burning.
-     *
-     * Calling conditions:
-     *
-     * - when `from` and `to` are both non-zero, `amount` of ``from``'s tokens
-     * has been transferred to `to`.
-     * - when `from` is zero, `amount` tokens have been minted for `to`.
-     * - when `to` is zero, `amount` of ``from``'s tokens have been burned.
-     * - `from` and `to` are never both zero.
-     *
-     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
-     */
-    function _afterTokenTransfer(address from, address to, uint256 amount) internal virtual {}
-
-    /**
-     * @dev This empty reserved space is put in place to allow future versions to add new
-     * variables without shifting down storage in the inheritance chain.
-     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
-     */
-    uint256[45] private __gap;
-}
-
-
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v4.9.4) (token/ERC20/extensions/ERC20Permit.sol)
-
-pragma solidity ^0.8.0;
-
-import "./IERC20PermitUpgradeable.sol";
-import "../ERC20Upgradeable.sol";
-import "../../../utils/cryptography/ECDSAUpgradeable.sol";
-import "../../../utils/cryptography/EIP712Upgradeable.sol";
-import "../../../utils/CountersUpgradeable.sol";
-import {Initializable} from "../../../proxy/utils/Initializable.sol";
-
-/**
- * @dev Implementation of the ERC20 Permit extension allowing approvals to be made via signatures, as defined in
- * https://eips.ethereum.org/EIPS/eip-2612[EIP-2612].
- *
- * Adds the {permit} method, which can be used to change an account's ERC20 allowance (see {IERC20-allowance}) by
- * presenting a message signed by the account. By not relying on `{IERC20-approve}`, the token holder account doesn't
- * need to send a transaction, and thus is not required to hold Ether at all.
- *
- * _Available since v3.4._
- *
- * @custom:storage-size 51
- */
-abstract contract ERC20PermitUpgradeable is Initializable, ERC20Upgradeable, IERC20PermitUpgradeable, EIP712Upgradeable {
-    using CountersUpgradeable for CountersUpgradeable.Counter;
-
-    mapping(address => CountersUpgradeable.Counter) private _nonces;
-
-    // solhint-disable-next-line var-name-mixedcase
-    bytes32 private constant _PERMIT_TYPEHASH =
-        keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)");
-    /**
-     * @dev In previous versions `_PERMIT_TYPEHASH` was declared as `immutable`.
-     * However, to ensure consistency with the upgradeable transpiler, we will continue
-     * to reserve a slot.
-     * @custom:oz-renamed-from _PERMIT_TYPEHASH
-     */
-    // solhint-disable-next-line var-name-mixedcase
-    bytes32 private _PERMIT_TYPEHASH_DEPRECATED_SLOT;
-
-    /**
-     * @dev Initializes the {EIP712} domain separator using the `name` parameter, and setting `version` to `"1"`.
-     *
-     * It's a good idea to use the same `name` that is defined as the ERC20 token name.
-     */
-    function __ERC20Permit_init(string memory name) internal onlyInitializing {
-        __EIP712_init_unchained(name, "1");
-    }
-
-    function __ERC20Permit_init_unchained(string memory) internal onlyInitializing {}
-
-    /**
-     * @inheritdoc IERC20PermitUpgradeable
-     */
-    function permit(
-        address owner,
-        address spender,
-        uint256 value,
-        uint256 deadline,
-        uint8 v,
-        bytes32 r,
-        bytes32 s
-    ) public virtual override {
-        require(block.timestamp <= deadline, "ERC20Permit: expired deadline");
-
-        bytes32 structHash = keccak256(abi.encode(_PERMIT_TYPEHASH, owner, spender, value, _useNonce(owner), deadline));
-
-        bytes32 hash = _hashTypedDataV4(structHash);
-
-        address signer = ECDSAUpgradeable.recover(hash, v, r, s);
-        require(signer == owner, "ERC20Permit: invalid signature");
-
-        _approve(owner, spender, value);
-    }
-
-    /**
-     * @inheritdoc IERC20PermitUpgradeable
-     */
-    function nonces(address owner) public view virtual override returns (uint256) {
-        return _nonces[owner].current();
-    }
-
-    /**
-     * @inheritdoc IERC20PermitUpgradeable
-     */
-    // solhint-disable-next-line func-name-mixedcase
-    function DOMAIN_SEPARATOR() external view override returns (bytes32) {
-        return _domainSeparatorV4();
-    }
-
-    /**
-     * @dev "Consume a nonce": return the current value and increment.
-     *
-     * _Available since v4.1._
-     */
-    function _useNonce(address owner) internal virtual returns (uint256 current) {
-        CountersUpgradeable.Counter storage nonce = _nonces[owner];
-        current = nonce.current();
-        nonce.increment();
-    }
-
-    /**
-     * @dev This empty reserved space is put in place to allow future versions to add new
-     * variables without shifting down storage in the inheritance chain.
-     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
-     */
-    uint256[49] private __gap;
-}
-
-
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts v4.4.1 (token/ERC20/extensions/IERC20Metadata.sol)
-
-pragma solidity ^0.8.0;
-
-import "../IERC20Upgradeable.sol";
-
-/**
- * @dev Interface for the optional metadata functions from the ERC20 standard.
- *
- * _Available since v4.1._
- */
-interface IERC20MetadataUpgradeable is IERC20Upgradeable {
-    /**
-     * @dev Returns the name of the token.
-     */
-    function name() external view returns (string memory);
-
-    /**
-     * @dev Returns the symbol of the token.
-     */
-    function symbol() external view returns (string memory);
-
-    /**
-     * @dev Returns the decimals places of the token.
-     */
-    function decimals() external view returns (uint8);
-}
-
-
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v4.9.4) (token/ERC20/extensions/IERC20Permit.sol)
-
-pragma solidity ^0.8.0;
-
-/**
- * @dev Interface of the ERC20 Permit extension allowing approvals to be made via signatures, as defined in
- * https://eips.ethereum.org/EIPS/eip-2612[EIP-2612].
- *
- * Adds the {permit} method, which can be used to change an account's ERC20 allowance (see {IERC20-allowance}) by
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
-interface IERC20PermitUpgradeable {
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
-// OpenZeppelin Contracts (last updated v4.9.0) (token/ERC20/IERC20.sol)
-
-pragma solidity ^0.8.0;
-
-/**
- * @dev Interface of the ERC20 standard as defined in the EIP.
- */
-interface IERC20Upgradeable {
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
-     * @dev Returns the amount of tokens in existence.
-     */
-    function totalSupply() external view returns (uint256);
-
-    /**
-     * @dev Returns the amount of tokens owned by `account`.
-     */
-    function balanceOf(address account) external view returns (uint256);
-
-    /**
-     * @dev Moves `amount` tokens from the caller's account to `to`.
-     *
-     * Returns a boolean value indicating whether the operation succeeded.
-     *
-     * Emits a {Transfer} event.
-     */
-    function transfer(address to, uint256 amount) external returns (bool);
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
-     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
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
-    function approve(address spender, uint256 amount) external returns (bool);
-
-    /**
-     * @dev Moves `amount` tokens from `from` to `to` using the
-     * allowance mechanism. `amount` is then deducted from the caller's
-     * allowance.
-     *
-     * Returns a boolean value indicating whether the operation succeeded.
-     *
-     * Emits a {Transfer} event.
-     */
-    function transferFrom(address from, address to, uint256 amount) external returns (bool);
-}
-
-
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v4.9.3) (token/ERC20/utils/SafeERC20.sol)
-
-pragma solidity ^0.8.0;
-
-import "../IERC20Upgradeable.sol";
-import "../extensions/IERC20PermitUpgradeable.sol";
-import "../../../utils/AddressUpgradeable.sol";
-
-/**
- * @title SafeERC20
- * @dev Wrappers around ERC20 operations that throw on failure (when the token
- * contract returns false). Tokens that return no value (and instead revert or
- * throw on failure) are also supported, non-reverting calls are assumed to be
- * successful.
- * To use this library you can add a `using SafeERC20 for IERC20;` statement to your contract,
- * which allows you to call the safe operations as `token.safeTransfer(...)`, etc.
- */
-library SafeERC20Upgradeable {
-    using AddressUpgradeable for address;
-
-    /**
-     * @dev Transfer `value` amount of `token` from the calling contract to 
[truncated — full diff is 860,320 bytes]
> ```

> </details>

> <details>
> <summary>📝 Source diff — upgrade #6 (<code>0xBcf5...e001</code> → <code>0x1D10...3A00</code>): +22882/-22 lines (truncated)</summary>

> ```diff
--- old_impl
+++ new_impl
@@ -1,29 +1,22889 @@
 // SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts (last updated v4.9.0) (access/AccessControl.sol)
+
+pragma solidity ^0.8.0;
+
+import "./IAccessControlUpgradeable.sol";
+import "../utils/ContextUpgradeable.sol";
+import "../utils/StringsUpgradeable.sol";
+import "../utils/introspection/ERC165Upgradeable.sol";
+import {Initializable} from "../proxy/utils/Initializable.sol";
+
+/**
+ * @dev Contract module that allows children to implement role-based access
+ * control mechanisms. This is a lightweight version that doesn't allow enumerating role
+ * members except through off-chain means by accessing the contract event logs. Some
+ * applications may benefit from on-chain enumerability, for those cases see
+ * {AccessControlEnumerable}.
+ *
+ * Roles are referred to by their `bytes32` identifier. These should be exposed
+ * in the external API and be unique. The best way to achieve this is by
+ * using `public constant` hash digests:
+ *
+ * ```solidity
+ * bytes32 public constant MY_ROLE = keccak256("MY_ROLE");
+ * ```
+ *
+ * Roles can be used to represent a set of permissions. To restrict access to a
+ * function call, use {hasRole}:
+ *
+ * ```solidity
+ * function foo() public {
+ *     require(hasRole(MY_ROLE, msg.sender));
+ *     ...
+ * }
+ * ```
+ *
+ * Roles can be granted and revoked dynamically via the {grantRole} and
+ * {revokeRole} functions. Each role has an associated admin role, and only
+ * accounts that have a role's admin role can call {grantRole} and {revokeRole}.
+ *
+ * By default, the admin role for all roles is `DEFAULT_ADMIN_ROLE`, which means
+ * that only accounts with this role will be able to grant or revoke other
+ * roles. More complex role relationships can be created by using
+ * {_setRoleAdmin}.
+ *
+ * WARNING: The `DEFAULT_ADMIN_ROLE` is also its own admin: it has permission to
+ * grant and revoke this role. Extra precautions should be taken to secure
+ * accounts that have been granted it. We recommend using {AccessControlDefaultAdminRules}
+ * to enforce additional security measures for this role.
+ */
+abstract contract AccessControlUpgradeable is Initializable, ContextUpgradeable, IAccessControlUpgradeable, ERC165Upgradeable {
+    struct RoleData {
+        mapping(address => bool) members;
+        bytes32 adminRole;
+    }
+
+    mapping(bytes32 => RoleData) private _roles;
+
+    bytes32 public constant DEFAULT_ADMIN_ROLE = 0x00;
+
+    /**
+     * @dev Modifier that checks that an account has a specific role. Reverts
+     * with a standardized message including the required role.
+     *
+     * The format of the revert reason is given by the following regular expression:
+     *
+     *  /^AccessControl: account (0x[0-9a-f]{40}) is missing role (0x[0-9a-f]{64})$/
+     *
+     * _Available since v4.1._
+     */
+    modifier onlyRole(bytes32 role) {
+        _checkRole(role);
+        _;
+    }
+
+    function __AccessControl_init() internal onlyInitializing {
+    }
+
+    function __AccessControl_init_unchained() internal onlyInitializing {
+    }
+    /**
+     * @dev See {IERC165-supportsInterface}.
+     */
+    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
+        return interfaceId == type(IAccessControlUpgradeable).interfaceId || super.supportsInterface(interfaceId);
+    }
+
+    /**
+     * @dev Returns `true` if `account` has been granted `role`.
+     */
+    function hasRole(bytes32 role, address account) public view virtual override returns (bool) {
+        return _roles[role].members[account];
+    }
+
+    /**
+     * @dev Revert with a standard message if `_msgSender()` is missing `role`.
+     * Overriding this function changes the behavior of the {onlyRole} modifier.
+     *
+     * Format of the revert message is described in {_checkRole}.
+     *
+     * _Available since v4.6._
+     */
+    function _checkRole(bytes32 role) internal view virtual {
+        _checkRole(role, _msgSender());
+    }
+
+    /**
+     * @dev Revert with a standard message if `account` is missing `role`.
+     *
+     * The format of the revert reason is given by the following regular expression:
+     *
+     *  /^AccessControl: account (0x[0-9a-f]{40}) is missing role (0x[0-9a-f]{64})$/
+     */
+    function _checkRole(bytes32 role, address account) internal view virtual {
+        if (!hasRole(role, account)) {
+            revert(
+                string(
+                    abi.encodePacked(
+                        "AccessControl: account ",
+                        StringsUpgradeable.toHexString(account),
+                        " is missing role ",
+                        StringsUpgradeable.toHexString(uint256(role), 32)
+                    )
+                )
+            );
+        }
+    }
+
+    /**
+     * @dev Returns the admin role that controls `role`. See {grantRole} and
+     * {revokeRole}.
+     *
+     * To change a role's admin, use {_setRoleAdmin}.
+     */
+    function getRoleAdmin(bytes32 role) public view virtual override returns (bytes32) {
+        return _roles[role].adminRole;
+    }
+
+    /**
+     * @dev Grants `role` to `account`.
+     *
+     * If `account` had not been already granted `role`, emits a {RoleGranted}
+     * event.
+     *
+     * Requirements:
+     *
+     * - the caller must have ``role``'s admin role.
+     *
+     * May emit a {RoleGranted} event.
+     */
+    function grantRole(bytes32 role, address account) public virtual override onlyRole(getRoleAdmin(role)) {
+        _grantRole(role, account);
+    }
+
+    /**
+     * @dev Revokes `role` from `account`.
+     *
+     * If `account` had been granted `role`, emits a {RoleRevoked} event.
+     *
+     * Requirements:
+     *
+     * - the caller must have ``role``'s admin role.
+     *
+     * May emit a {RoleRevoked} event.
+     */
+    function revokeRole(bytes32 role, address account) public virtual override onlyRole(getRoleAdmin(role)) {
+        _revokeRole(role, account);
+    }
+
+    /**
+     * @dev Revokes `role` from the calling account.
+     *
+     * Roles are often managed via {grantRole} and {revokeRole}: this function's
+     * purpose is to provide a mechanism for accounts to lose their privileges
+     * if they are compromised (such as when a trusted device is misplaced).
+     *
+     * If the calling account had been revoked `role`, emits a {RoleRevoked}
+     * event.
+     *
+     * Requirements:
+     *
+     * - the caller must be `account`.
+     *
+     * May emit a {RoleRevoked} event.
+     */
+    function renounceRole(bytes32 role, address account) public virtual override {
+        require(account == _msgSender(), "AccessControl: can only renounce roles for self");
+
+        _revokeRole(role, account);
+    }
+
+    /**
+     * @dev Grants `role` to `account`.
+     *
+     * If `account` had not been already granted `role`, emits a {RoleGranted}
+     * event. Note that unlike {grantRole}, this function doesn't perform any
+     * checks on the calling account.
+     *
+     * May emit a {RoleGranted} event.
+     *
+     * [WARNING]
+     * ====
+     * This function should only be called from the constructor when setting
+     * up the initial roles for the system.
+     *
+     * Using this function in any other way is effectively circumventing the admin
+     * system imposed by {AccessControl}.
+     * ====
+     *
+     * NOTE: This function is deprecated in favor of {_grantRole}.
+     */
+    function _setupRole(bytes32 role, address account) internal virtual {
+        _grantRole(role, account);
+    }
+
+    /**
+     * @dev Sets `adminRole` as ``role``'s admin role.
+     *
+     * Emits a {RoleAdminChanged} event.
+     */
+    function _setRoleAdmin(bytes32 role, bytes32 adminRole) internal virtual {
+        bytes32 previousAdminRole = getRoleAdmin(role);
+        _roles[role].adminRole = adminRole;
+        emit RoleAdminChanged(role, previousAdminRole, adminRole);
+    }
+
+    /**
+     * @dev Grants `role` to `account`.
+     *
+     * Internal function without access restriction.
+     *
+     * May emit a {RoleGranted} event.
+     */
+    function _grantRole(bytes32 role, address account) internal virtual {
+        if (!hasRole(role, account)) {
+            _roles[role].members[account] = true;
+            emit RoleGranted(role, account, _msgSender());
+        }
+    }
+
+    /**
+     * @dev Revokes `role` from `account`.
+     *
+     * Internal function without access restriction.
+     *
+     * May emit a {RoleRevoked} event.
+     */
+    function _revokeRole(bytes32 role, address account) internal virtual {
+        if (hasRole(role, account)) {
+            _roles[role].members[account] = false;
+            emit RoleRevoked(role, account, _msgSender());
+        }
+    }
+
+    /**
+     * @dev This empty reserved space is put in place to allow future versions to add new
+     * variables without shifting down storage in the inheritance chain.
+     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
+     */
+    uint256[49] private __gap;
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts v4.4.1 (access/IAccessControl.sol)
+
+pragma solidity ^0.8.0;
+
+/**
+ * @dev External interface of AccessControl declared to support ERC165 detection.
+ */
+interface IAccessControlUpgradeable {
+    /**
+     * @dev Emitted when `newAdminRole` is set as ``role``'s admin role, replacing `previousAdminRole`
+     *
+     * `DEFAULT_ADMIN_ROLE` is the starting admin for all roles, despite
+     * {RoleAdminChanged} not being emitted signaling this.
+     *
+     * _Available since v3.1._
+     */
+    event RoleAdminChanged(bytes32 indexed role, bytes32 indexed previousAdminRole, bytes32 indexed newAdminRole);
+
+    /**
+     * @dev Emitted when `account` is granted `role`.
+     *
+     * `sender` is the account that originated the contract call, an admin role
+     * bearer except when using {AccessControl-_setupRole}.
+     */
+    event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender);
+
+    /**
+     * @dev Emitted when `account` is revoked `role`.
+     *
+     * `sender` is the account that originated the contract call:
+     *   - if using `revokeRole`, it is the admin role bearer
+     *   - if using `renounceRole`, it is the role bearer (i.e. `account`)
+     */
+    event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender);
+
+    /**
+     * @dev Returns `true` if `account` has been granted `role`.
+     */
+    function hasRole(bytes32 role, address account) external view returns (bool);
+
+    /**
+     * @dev Returns the admin role that controls `role`. See {grantRole} and
+     * {revokeRole}.
+     *
+     * To change a role's admin, use {AccessControl-_setRoleAdmin}.
+     */
+    function getRoleAdmin(bytes32 role) external view returns (bytes32);
+
+    /**
+     * @dev Grants `role` to `account`.
+     *
+     * If `account` had not been already granted `role`, emits a {RoleGranted}
+     * event.
+     *
+     * Requirements:
+     *
+     * - the caller must have ``role``'s admin role.
+     */
+    function grantRole(bytes32 role, address account) external;
+
+    /**
+     * @dev Revokes `role` from `account`.
+     *
+     * If `account` had been granted `role`, emits a {RoleRevoked} event.
+     *
+     * Requirements:
+     *
+     * - the caller must have ``role``'s admin role.
+     */
+    function revokeRole(bytes32 role, address account) external;
+
+    /**
+     * @dev Revokes `role` from the calling account.
+     *
+     * Roles are often managed via {grantRole} and {revokeRole}: this function's
+     * purpose is to provide a mechanism for accounts to lose their privileges
+     * if they are compromised (such as when a trusted device is misplaced).
+     *
+     * If the calling account had been granted `role`, emits a {RoleRevoked}
+     * event.
+     *
+     * Requirements:
+     *
+     * - the caller must be `account`.
+     */
+    function renounceRole(bytes32 role, address account) external;
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts (last updated v4.9.0) (interfaces/IERC5267.sol)
+
+pragma solidity ^0.8.0;
+
+interface IERC5267Upgradeable {
+    /**
+     * @dev MAY be emitted to signal that the domain could have changed.
+     */
+    event EIP712DomainChanged();
+
+    /**
+     * @dev returns the fields and values that describe the domain separator used by this contract for EIP-712
+     * signature.
+     */
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
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts (last updated v4.9.0) (proxy/utils/Initializable.sol)
+
+pragma solidity ^0.8.2;
+
+import "../../utils/AddressUpgradeable.sol";
+
+/**
+ * @dev This is a base contract to aid in writing upgradeable contracts, or any kind of contract that will be deployed
+ * behind a proxy. Since proxied contracts do not make use of a constructor, it's common to move constructor logic to an
+ * external initializer function, usually called `initialize`. It then becomes necessary to protect this initializer
+ * function so it can only be called once. The {initializer} modifier provided by this contract will have this effect.
+ *
+ * The initialization functions use a version number. Once a version number is used, it is consumed and cannot be
+ * reused. This mechanism prevents re-execution of each "step" but allows the creation of new initialization steps in
+ * case an upgrade adds a module that needs to be initialized.
+ *
+ * For example:
+ *
+ * [.hljs-theme-light.nopadding]
+ * ```solidity
+ * contract MyToken is ERC20Upgradeable {
+ *     function initialize() initializer public {
+ *         __ERC20_init("MyToken", "MTK");
+ *     }
+ * }
+ *
+ * contract MyTokenV2 is MyToken, ERC20PermitUpgradeable {
+ *     function initializeV2() reinitializer(2) public {
+ *         __ERC20Permit_init("MyToken");
+ *     }
+ * }
+ * ```
+ *
+ * TIP: To avoid leaving the proxy in an uninitialized state, the initializer function should be called as early as
+ * possible by providing the encoded function call as the `_data` argument to {ERC1967Proxy-constructor}.
+ *
+ * CAUTION: When used with inheritance, manual care must be taken to not invoke a parent initializer twice, or to ensure
+ * that all initializers are idempotent. This is not verified automatically as constructors are by Solidity.
+ *
+ * [CAUTION]
+ * ====
+ * Avoid leaving a contract uninitialized.
+ *
+ * An uninitialized contract can be taken over by an attacker. This applies to both a proxy and its implementation
+ * contract, which may impact the proxy. To prevent the implementation contract from being used, you should invoke
+ * the {_disableInitializers} function in the constructor to automatically lock it when it is deployed:
+ *
+ * [.hljs-theme-light.nopadding]
+ * ```
+ * /// @custom:oz-upgrades-unsafe-allow constructor
+ * constructor() {
+ *     _disableInitializers();
+ * }
+ * ```
+ * ====
+ */
+abstract contract Initializable {
+    /**
+     * @dev Indicates that the contract has been initialized.
+     * @custom:oz-retyped-from bool
+     */
+    uint8 private _initialized;
+
+    /**
+     * @dev Indicates that the contract is in the process of being initialized.
+     */
+    bool private _initializing;
+
+    /**
+     * @dev Triggered when the contract has been initialized or reinitialized.
+     */
+    event Initialized(uint8 version);
+
+    /**
+     * @dev A modifier that defines a protected initializer function that can be invoked at most once. In its scope,
+     * `onlyInitializing` functions can be used to initialize parent contracts.
+     *
+     * Similar to `reinitializer(1)`, except that functions marked with `initializer` can be nested in the context of a
+     * constructor.
+     *
+     * Emits an {Initialized} event.
+     */
+    modifier initializer() {
+        bool isTopLevelCall = !_initializing;
+        require(
+            (isTopLevelCall && _initialized < 1) || (!AddressUpgradeable.isContract(address(this)) && _initialized == 1),
+            "Initializable: contract is already initialized"
+        );
+        _initialized = 1;
+        if (isTopLevelCall) {
+            _initializing = true;
+        }
+        _;
+        if (isTopLevelCall) {
+            _initializing = false;
+            emit Initialized(1);
+        }
+    }
+
+    /**
+     * @dev A modifier that defines a protected reinitializer function that can be invoked at most once, and only if the
+     * contract hasn't been initialized to a greater version before. In its scope, `onlyInitializing` functions can be
+     * used to initialize parent contracts.
+     *
+     * A reinitializer may be used after the original initialization step. This is essential to configure modules that
+     * are added through upgrades and that require initialization.
+     *
+     * When `version` is 1, this modifier is similar to `initializer`, except that functions marked with `reinitializer`
+     * cannot be nested. If one is invoked in the context of another, execution will revert.
+     *
+     * Note that versions can jump in increments greater than 1; this implies that if multiple reinitializers coexist in
+     * a contract, executing them in the right order is up to the developer or operator.
+     *
+     * WARNING: setting the version to 255 will prevent any future reinitialization.
+     *
+     * Emits an {Initialized} event.
+     */
+    modifier reinitializer(uint8 version) {
+        require(!_initializing && _initialized < version, "Initializable: contract is already initialized");
+        _initialized = version;
+        _initializing = true;
+        _;
+        _initializing = false;
+        emit Initialized(version);
+    }
+
+    /**
+     * @dev Modifier to protect an initialization function so that it can only be invoked by functions with the
+     * {initializer} and {reinitializer} modifiers, directly or indirectly.
+     */
+    modifier onlyInitializing() {
+        require(_initializing, "Initializable: contract is not initializing");
+        _;
+    }
+
+    /**
+     * @dev Locks the contract, preventing any future reinitialization. This cannot be part of an initializer call.
+     * Calling this in the constructor of a contract will prevent that contract from being initialized or reinitialized
+     * to any version. It is recommended to use this to lock implementation contracts that are designed to be called
+     * through proxies.
+     *
+     * Emits an {Initialized} event the first time it is successfully executed.
+     */
+    function _disableInitializers() internal virtual {
+        require(!_initializing, "Initializable: contract is initializing");
+        if (_initialized != type(uint8).max) {
+            _initialized = type(uint8).max;
+            emit Initialized(type(uint8).max);
+        }
+    }
+
+    /**
+     * @dev Returns the highest version that has been initialized. See {reinitializer}.
+     */
+    function _getInitializedVersion() internal view returns (uint8) {
+        return _initialized;
+    }
+
+    /**
+     * @dev Returns `true` if the contract is currently initializing. See {onlyInitializing}.
+     */
+    function _isInitializing() internal view returns (bool) {
+        return _initializing;
+    }
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts (last updated v4.9.0) (security/ReentrancyGuard.sol)
+
+pragma solidity ^0.8.0;
+import {Initializable} from "../proxy/utils/Initializable.sol";
+
+/**
+ * @dev Contract module that helps prevent reentrant calls to a function.
+ *
+ * Inheriting from `ReentrancyGuard` will make the {nonReentrant} modifier
+ * available, which can be applied to functions to make sure there are no nested
+ * (reentrant) calls to them.
+ *
+ * Note that because there is a single `nonReentrant` guard, functions marked as
+ * `nonReentrant` may not call one another. This can be worked around by making
+ * those functions `private`, and then adding `external` `nonReentrant` entry
+ * points to them.
+ *
+ * TIP: If you would like to learn more about reentrancy and alternative ways
+ * to protect against it, check out our blog post
+ * https://blog.openzeppelin.com/reentrancy-after-istanbul/[Reentrancy After Istanbul].
+ */
+abstract contract ReentrancyGuardUpgradeable is Initializable {
+    // Booleans are more expensive than uint256 or any type that takes up a full
+    // word because each write operation emits an extra SLOAD to first read the
+    // slot's contents, replace the bits taken up by the boolean, and then write
+    // back. This is the compiler's defense against contract upgrades and
+    // pointer aliasing, and it cannot be disabled.
+
+    // The values being non-zero value makes deployment a bit more expensive,
+    // but in exchange the refund on every call to nonReentrant will be lower in
+    // amount. Since refunds are capped to a percentage of the total
+    // transaction's gas, it is best to keep them low in cases like this one, to
+    // increase the likelihood of the full refund coming into effect.
+    uint256 private constant _NOT_ENTERED = 1;
+    uint256 private constant _ENTERED = 2;
+
+    uint256 private _status;
+
+    function __ReentrancyGuard_init() internal onlyInitializing {
+        __ReentrancyGuard_init_unchained();
+    }
+
+    function __ReentrancyGuard_init_unchained() internal onlyInitializing {
+        _status = _NOT_ENTERED;
+    }
+
+    /**
+     * @dev Prevents a contract from calling itself, directly or indirectly.
+     * Calling a `nonReentrant` function from another `nonReentrant`
+     * function is not supported. It is possible to prevent this from happening
+     * by making the `nonReentrant` function external, and making it call a
+     * `private` function that does the actual work.
+     */
+    modifier nonReentrant() {
+        _nonReentrantBefore();
+        _;
+        _nonReentrantAfter();
+    }
+
+    function _nonReentrantBefore() private {
+        // On the first call to nonReentrant, _status will be _NOT_ENTERED
+        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");
+
+        // Any calls to nonReentrant after this point will fail
+        _status = _ENTERED;
+    }
+
+    function _nonReentrantAfter() private {
+        // By storing the original value once again, a refund is triggered (see
+        // https://eips.ethereum.org/EIPS/eip-2200)
+        _status = _NOT_ENTERED;
+    }
+
+    /**
+     * @dev Returns true if the reentrancy guard is currently set to "entered", which indicates there is a
+     * `nonReentrant` function in the call stack.
+     */
+    function _reentrancyGuardEntered() internal view returns (bool) {
+        return _status == _ENTERED;
+    }
+
+    /**
+     * @dev This empty reserved space is put in place to allow future versions to add new
+     * variables without shifting down storage in the inheritance chain.
+     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
+     */
+    uint256[49] private __gap;
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts (last updated v4.9.0) (token/ERC20/ERC20.sol)
+
+pragma solidity ^0.8.0;
+
+import "./IERC20Upgradeable.sol";
+import "./extensions/IERC20MetadataUpgradeable.sol";
+import "../../utils/ContextUpgradeable.sol";
+import {Initializable} from "../../proxy/utils/Initializable.sol";
+
+/**
+ * @dev Implementation of the {IERC20} interface.
+ *
+ * This implementation is agnostic to the way tokens are created. This means
+ * that a supply mechanism has to be added in a derived contract using {_mint}.
+ * For a generic mechanism see {ERC20PresetMinterPauser}.
+ *
+ * TIP: For a detailed writeup see our guide
+ * https://forum.openzeppelin.com/t/how-to-implement-erc20-supply-mechanisms/226[How
+ * to implement supply mechanisms].
+ *
+ * The default value of {decimals} is 18. To change this, you should override
+ * this function so it returns a different value.
+ *
+ * We have followed general OpenZeppelin Contracts guidelines: functions revert
+ * instead returning `false` on failure. This behavior is nonetheless
+ * conventional and does not conflict with the expectations of ERC20
+ * applications.
+ *
+ * Additionally, an {Approval} event is emitted on calls to {transferFrom}.
+ * This allows applications to reconstruct the allowance for all accounts just
+ * by listening to said events. Other implementations of the EIP may not emit
+ * these events, as it isn't required by the specification.
+ *
+ * Finally, the non-standard {decreaseAllowance} and {increaseAllowance}
+ * functions have been added to mitigate the well-known issues around setting
+ * allowances. See {IERC20-approve}.
+ */
+contract ERC20Upgradeable is Initializable, ContextUpgradeable, IERC20Upgradeable, IERC20MetadataUpgradeable {
+    mapping(address => uint256) private _balances;
+
+    mapping(address => mapping(address => uint256)) private _allowances;
+
+    uint256 private _totalSupply;
+
+    string private _name;
+    string private _symbol;
+
+    /**
+     * @dev Sets the values for {name} and {symbol}.
+     *
+     * All two of these values are immutable: they can only be set once during
+     * construction.
+     */
+    function __ERC20_init(string memory name_, string memory symbol_) internal onlyInitializing {
+        __ERC20_init_unchained(name_, symbol_);
+    }
+
+    function __ERC20_init_unchained(string memory name_, string memory symbol_) internal onlyInitializing {
+        _name = name_;
+        _symbol = symbol_;
+    }
+
+    /**
+     * @dev Returns the name of the token.
+     */
+    function name() public view virtual override returns (string memory) {
+        return _name;
+    }
+
+    /**
+     * @dev Returns the symbol of the token, usually a shorter version of the
+     * name.
+     */
+    function symbol() public view virtual override returns (string memory) {
+        return _symbol;
+    }
+
+    /**
+     * @dev Returns the number of decimals used to get its user representation.
+     * For example, if `decimals` equals `2`, a balance of `505` tokens should
+     * be displayed to a user as `5.05` (`505 / 10 ** 2`).
+     *
+     * Tokens usually opt for a value of 18, imitating the relationship between
+     * Ether and Wei. This is the default value returned by this function, unless
+     * it's overridden.
+     *
+     * NOTE: This information is only used for _display_ purposes: it in
+     * no way affects any of the arithmetic of the contract, including
+     * {IERC20-balanceOf} and {IERC20-transfer}.
+     */
+    function decimals() public view virtual override returns (uint8) {
+        return 18;
+    }
+
+    /**
+     * @dev See {IERC20-totalSupply}.
+     */
+    function totalSupply() public view virtual override returns (uint256) {
+        return _totalSupply;
+    }
+
+    /**
+     * @dev See {IERC20-balanceOf}.
+     */
+    function balanceOf(address account) public view virtual override returns (uint256) {
+        return _balances[account];
+    }
+
+    /**
+     * @dev See {IERC20-transfer}.
+     *
+     * Requirements:
+     *
+     * - `to` cannot be the zero address.
+     * - the caller must have a balance of at least `amount`.
+     */
+    function transfer(address to, uint256 amount) public virtual override returns (bool) {
+        address owner = _msgSender();
+        _transfer(owner, to, amount);
+        return true;
+    }
+
+    /**
+     * @dev See {IERC20-allowance}.
+     */
+    function allowance(address owner, address spender) public view virtual override returns (uint256) {
+        return _allowances[owner][spender];
+    }
+
+    /**
+     * @dev See {IERC20-approve}.
+     *
+     * NOTE: If `amount` is the maximum `uint256`, the allowance is not updated on
+     * `transferFrom`. This is semantically equivalent to an infinite approval.
+     *
+     * Requirements:
+     *
+     * - `spender` cannot be the zero address.
+     */
+    function approve(address spender, uint256 amount) public virtual override returns (bool) {
+        address owner = _msgSender();
+        _approve(owner, spender, amount);
+        return true;
+    }
+
+    /**
+     * @dev See {IERC20-transferFrom}.
+     *
+     * Emits an {Approval} event indicating the updated allowance. This is not
+     * required by the EIP. See the note at the beginning of {ERC20}.
+     *
+     * NOTE: Does not update the allowance if the current allowance
+     * is the maximum `uint256`.
+     *
+     * Requirements:
+     *
+     * - `from` and `to` cannot be the zero address.
+     * - `from` must have a balance of at least `amount`.
+     * - the caller must have allowance for ``from``'s tokens of at least
+     * `amount`.
+     */
+    function transferFrom(address from, address to, uint256 amount) public virtual override returns (bool) {
+        address spender = _msgSender();
+        _spendAllowance(from, spender, amount);
+        _transfer(from, to, amount);
+        return true;
+    }
+
+    /**
+     * @dev Atomically increases the allowance granted to `spender` by the caller.
+     *
+     * This is an alternative to {approve} that can be used as a mitigation for
+     * problems described in {IERC20-approve}.
+     *
+     * Emits an {Approval} event indicating the updated allowance.
+     *
+     * Requirements:
+     *
+     * - `spender` cannot be the zero address.
+     */
+    function increaseAllowance(address spender, uint256 addedValue) public virtual returns (bool) {
+        address owner = _msgSender();
+        _approve(owner, spender, allowance(owner, spender) + addedValue);
+        return true;
+    }
+
+    /**
+     * @dev Atomically decreases the allowance granted to `spender` by the caller.
+     *
+     * This is an alternative to {approve} that can be used as a mitigation for
+     * problems described in {IERC20-approve}.
+     *
+     * Emits an {Approval} event indicating the updated allowance.
+     *
+     * Requirements:
+     *
+     * - `spender` cannot be the zero address.
+     * - `spender` must have allowance for the caller of at least
+     * `subtractedValue`.
+     */
+    function decreaseAllowance(address spender, uint256 subtractedValue) public virtual returns (bool) {
+        address owner = _msgSender();
+        uint256 currentAllowance = allowance(owner, spender);
+        require(currentAllowance >= subtractedValue, "ERC20: decreased allowance below zero");
+        unchecked {
+            _approve(owner, spender, currentAllowance - subtractedValue);
+        }
+
+        return true;
+    }
+
+    /**
+     * @dev Moves `amount` of tokens from `from` to `to`.
+     *
+     * This internal function is equivalent to {transfer}, and can be used to
+     * e.g. implement automatic token fees, slashing mechanisms, etc.
+     *
+     * Emits a {Transfer} event.
+     *
+     * Requirements:
+     *
+     * - `from` cannot be the zero address.
+     * - `to` cannot be the zero address.
+     * - `from` must have a balance of at least `amount`.
+     */
+    function _transfer(address from, address to, uint256 amount) internal virtual {
+        require(from != address(0), "ERC20: transfer from the zero address");
+        require(to != address(0), "ERC20: transfer to the zero address");
+
+        _beforeTokenTransfer(from, to, amount);
+
+        uint256 fromBalance = _balances[from];
+        require(fromBalance >= amount, "ERC20: transfer amount exceeds balance");
+        unchecked {
+            _balances[from] = fromBalance - amount;
+            // Overflow not possible: the sum of all balances is capped by totalSupply, and the sum is preserved by
+            // decrementing then incrementing.
+            _balances[to] += amount;
+        }
+
+        emit Transfer(from, to, amount);
+
+        _afterTokenTransfer(from, to, amount);
+    }
+
+    /** @dev Creates `amount` tokens and assigns them to `account`, increasing
+     * the total supply.
+     *
+     * Emits a {Transfer} event with `from` set to the zero address.
+     *
+     * Requirements:
+     *
+     * - `account` cannot be the zero address.
+     */
+    function _mint(address account, uint256 amount) internal virtual {
+        require(account != address(0), "ERC20: mint to the zero address");
+
+        _beforeTokenTransfer(address(0), account, amount);
+
+        _totalSupply += amount;
+        unchecked {
+            // Overflow not possible: balance + amount is at most totalSupply + amount, which is checked above.
+            _balances[account] += amount;
+        }
+        emit Transfer(address(0), account, amount);
+
+        _afterTokenTransfer(address(0), account, amount);
+    }
+
+    /**
+     * @dev Destroys `amount` tokens from `account`, reducing the
+     * total supply.
+     *
+     * Emits a {Transfer} event with `to` set to the zero address.
+     *
+     * Requirements:
+     *
+     * - `account` cannot be the zero address.
+     * - `account` must have at least `amount` tokens.
+     */
+    function _burn(address account, uint256 amount) internal virtual {
+        require(account != address(0), "ERC20: burn from the zero address");
+
+        _beforeTokenTransfer(account, address(0), amount);
+
+        uint256 accountBalance = _balances[account];
+        require(accountBalance >= amount, "ERC20: burn amount exceeds balance");
+        unchecked {
+            _balances[account] = accountBalance - amount;
+            // Overflow not possible: amount <= accountBalance <= totalSupply.
+            _totalSupply -= amount;
+        }
+
+        emit Transfer(account, address(0), amount);
+
+        _afterTokenTransfer(account, address(0), amount);
+    }
+
+    /**
+     * @dev Sets `amount` as the allowance of `spender` over the `owner` s tokens.
+     *
+     * This internal function is equivalent to `approve`, and can be used to
+     * e.g. set automatic allowances for certain subsystems, etc.
+     *
+     * Emits an {Approval} event.
+     *
+     * Requirements:
+     *
+     * - `owner` cannot be the zero address.
+     * - `spender` cannot be the zero address.
+     */
+    function _approve(address owner, address spender, uint256 amount) internal virtual {
+        require(owner != address(0), "ERC20: approve from the zero address");
+        require(spender != address(0), "ERC20: approve to the zero address");
+
+        _allowances[owner][spender] = amount;
+        emit Approval(owner, spender, amount);
+    }
+
+    /**
+     * @dev Updates `owner` s allowance for `spender` based on spent `amount`.
+     *
+     * Does not update the allowance amount in case of infinite allowance.
+     * Revert if not enough allowance is available.
+     *
+     * Might emit an {Approval} event.
+     */
+    function _spendAllowance(address owner, address spender, uint256 amount) internal virtual {
+        uint256 currentAllowance = allowance(owner, spender);
+        if (currentAllowance != type(uint256).max) {
+            require(currentAllowance >= amount, "ERC20: insufficient allowance");
+            unchecked {
+                _approve(owner, spender, currentAllowance - amount);
+            }
+        }
+    }
+
+    /**
+     * @dev Hook that is called before any transfer of tokens. This includes
+     * minting and burning.
+     *
+     * Calling conditions:
+     *
+     * - when `from` and `to` are both non-zero, `amount` of ``from``'s tokens
+     * will be transferred to `to`.
+     * - when `from` is zero, `amount` tokens will be minted for `to`.
+     * - when `to` is zero, `amount` of ``from``'s tokens will be burned.
+     * - `from` and `to` are never both zero.
+     *
+     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
+     */
+    function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual {}
+
+    /**
+     * @dev Hook that is called after any transfer of tokens. This includes
+     * minting and burning.
+     *
+     * Calling conditions:
+     *
+     * - when `from` and `to` are both non-zero, `amount` of ``from``'s tokens
+     * has been transferred to `to`.
+     * - when `from` is zero, `amount` tokens have been minted for `to`.
+     * - when `to` is zero, `amount` of ``from``'s tokens have been burned.
+     * - `from` and `to` are never both zero.
+     *
+     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
+     */
+    function _afterTokenTransfer(address from, address to, uint256 amount) internal virtual {}
+
+    /**
+     * @dev This empty reserved space is put in place to allow future versions to add new
+     * variables without shifting down storage in the inheritance chain.
+     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
+     */
+    uint256[45] private __gap;
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts (last updated v4.9.4) (token/ERC20/extensions/ERC20Permit.sol)
+
+pragma solidity ^0.8.0;
+
+import "./IERC20PermitUpgradeable.sol";
+import "../ERC20Upgradeable.sol";
+import "../../../utils/cryptography/ECDSAUpgradeable.sol";
+import "../../../utils/cryptography/EIP712Upgradeable.sol";
+import "../../../utils/CountersUpgradeable.sol";
+import {Initializable} from "../../../proxy/utils/Initializable.sol";
+
+/**
+ * @dev Implementation of the ERC20 Permit extension allowing approvals to be made via signatures, as defined in
+ * https://eips.ethereum.org/EIPS/eip-2612[EIP-2612].
+ *
+ * Adds the {permit} method, which can be used to change an account's ERC20 allowance (see {IERC20-allowance}) by
+ * presenting a message signed by the account. By not relying on `{IERC20-approve}`, the token holder account doesn't
+ * need to send a transaction, and thus is not required to hold Ether at all.
+ *
+ * _Available since v3.4._
+ *
+ * @custom:storage-size 51
+ */
+abstract contract ERC20PermitUpgradeable is Initializable, ERC20Upgradeable, IERC20PermitUpgradeable, EIP712Upgradeable {
+    using CountersUpgradeable for CountersUpgradeable.Counter;
+
+    mapping(address => CountersUpgradeable.Counter) private _nonces;
+
+    // solhint-disable-next-line var-name-mixedcase
+    bytes32 private constant _PERMIT_TYPEHASH =
+        keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)");
+    /**
+     * @dev In previous versions `_PERMIT_TYPEHASH` was declared as `immutable`.
+     * However, to ensure consistency with the upgradeable transpiler, we will continue
+     * to reserve a slot.
+     * @custom:oz-renamed-from _PERMIT_TYPEHASH
+     */
+    // solhint-disable-next-line var-name-mixedcase
+    bytes32 private _PERMIT_TYPEHASH_DEPRECATED_SLOT;
+
+    /**
+     * @dev Initializes the {EIP712} domain separator using the `name` parameter, and setting `version` to `"1"`.
+     *
+     * It's a good idea to use the same `name` that is defined as the ERC20 token name.
+     */
+    function __ERC20Permit_init(string memory name) internal onlyInitializing {
+        __EIP712_init_unchained(name, "1");
+    }
+
+    function __ERC20Permit_init_unchained(string memory) internal onlyInitializing {}
+
+    /**
+     * @inheritdoc IERC20PermitUpgradeable
+     */
+    function permit(
+        address owner,
+        address spender,
+        uint256 value,
+        uint256 deadline,
+        uint8 v,
+        bytes32 r,
+        bytes32 s
+    ) public virtual override {
+        require(block.timestamp <= deadline, "ERC20Permit: expired deadline");
+
+        bytes32 structHash = keccak256(abi.encode(_PERMIT_TYPEHASH, owner, spender, value, _useNonce(owner), deadline));
+
+        bytes32 hash = _hashTypedDataV4(structHash);
+
+        address signer = ECDSAUpgradeable.recover(hash, v, r, s);
+        require(signer == owner, "ERC20Permit: invalid signature");
+
+        _approve(owner, spender, value);
+    }
+
+    /**
+     * @inheritdoc IERC20PermitUpgradeable
+     */
+    function nonces(address owner) public view virtual override returns (uint256) {
+        return _nonces[owner].current();
+    }
+
+    /**
+     * @inheritdoc IERC20PermitUpgradeable
+     */
+    // solhint-disable-next-line func-name-mixedcase
+    function DOMAIN_SEPARATOR() external view override returns (bytes32) {
+        return _domainSeparatorV4();
+    }
+
+    /**
+     * @dev "Consume a nonce": return the current value and increment.
+     *
+     * _Available since v4.1._
+     */
+    function _useNonce(address owner) internal virtual returns (uint256 current) {
+        CountersUpgradeable.Counter storage nonce = _nonces[owner];
+        current = nonce.current();
+        nonce.increment();
+    }
+
+    /**
+     * @dev This empty reserved space is put in place to allow future versions to add new
+     * variables without shifting down storage in the inheritance chain.
+     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
+     */
+    uint256[49] private __gap;
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts v4.4.1 (token/ERC20/extensions/IERC20Metadata.sol)
+
+pragma solidity ^0.8.0;
+
+import "../IERC20Upgradeable.sol";
+
+/**
+ * @dev Interface for the optional metadata functions from the ERC20 standard.
+ *
+ * _Available since v4.1._
+ */
+interface IERC20MetadataUpgradeable is IERC20Upgradeable {
+    /**
+     * @dev Returns the name of the token.
+     */
+    function name() external view returns (string memory);
+
+    /**
+     * @dev Returns the symbol of the token.
+     */
+    function symbol() external view returns (string memory);
+
+    /**
+     * @dev Returns the decimals places of the token.
+     */
+    function decimals() external view returns (uint8);
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts (last updated v4.9.4) (token/ERC20/extensions/IERC20Permit.sol)
+
+pragma solidity ^0.8.0;
+
+/**
+ * @dev Interface of the ERC20 Permit extension allowing approvals to be made via signatures, as defined in
+ * https://eips.ethereum.org/EIPS/eip-2612[EIP-2612].
+ *
+ * Adds the {permit} method, which can be used to change an account's ERC20 allowance (see {IERC20-allowance}) by
+ * presenting a message signed by the account. By not relying on {IERC20-approve}, the token holder account doesn't
+ * need to send a transaction, and thus is not required to hold Ether at all.
+ *
+ * ==== Security Considerations
+ *
+ * There are two important considerations concerning the use of `permit`. The first is that a valid permit signature
+ * expresses an allowance, and it should not be assumed to convey additional meaning. In particular, it should not be
+ * considered as an intention to spend the allowance in any specific way. The second is that because permits have
+ * built-in replay protection and can be submitted by anyone, they can be frontrun. A protocol that uses permits should
+ * take this into consideration and allow a `permit` call to fail. Combining these two aspects, a pattern that may be
+ * generally recommended is:
+ *
+ * ```solidity
+ * function doThingWithPermit(..., uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s) public {
+ *     try token.permit(msg.sender, address(this), value, deadline, v, r, s) {} catch {}
+ *     doThing(..., value);
+ * }
+ *
+ * function doThing(..., uint256 value) public {
+ *     token.safeTransferFrom(msg.sender, address(this), value);
+ *     ...
+ * }
+ * ```
+ *
+ * Observe that: 1) `msg.sender` is used as the owner, leaving no ambiguity as to the signer intent, and 2) the use of
+ * `try/catch` allows the permit to fail and makes the code tolerant to frontrunning. (See also
+ * {SafeERC20-safeTransferFrom}).
+ *
+ * Additionally, note that smart contract wallets (such as Argent or Safe) are not able to produce permit signatures, so
+ * contracts should have entry points that don't rely on permit.
+ */
+interface IERC20PermitUpgradeable {
+    /**
+     * @dev Sets `value` as the allowance of `spender` over ``owner``'s tokens,
+     * given ``owner``'s signed approval.
+     *
+     * IMPORTANT: The same issues {IERC20-approve} has related to transaction
+     * ordering also apply here.
+     *
+     * Emits an {Approval} event.
+     *
+     * Requirements:
+     *
+     * - `spender` cannot be the zero address.
+     * - `deadline` must be a timestamp in the future.
+     * - `v`, `r` and `s` must be a valid `secp256k1` signature from `owner`
+     * over the EIP712-formatted function arguments.
+     * - the signature must use ``owner``'s current nonce (see {nonces}).
+     *
+     * For more information on the signature format, see the
+     * https://eips.ethereum.org/EIPS/eip-2612#specification[relevant EIP
+     * section].
+     *
+     * CAUTION: See Security Considerations above.
+     */
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
+    /**
+     * @dev Returns the current nonce for `owner`. This value must be
+     * included whenever a signature is generated for {permit}.
+     *
+     * Every successful call to {permit} increases ``owner``'s nonce by one. This
+     * prevents a signature from being used multiple times.
+     */
+    function nonces(address owner) external view returns (uint256);
+
+    /**
+     * @dev Returns the domain separator used in the encoding of the signature for {permit}, as defined by {EIP712}.
+     */
+    // solhint-disable-next-line func-name-mixedcase
+    function DOMAIN_SEPARATOR() external view returns (bytes32);
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts (last updated v4.9.0) (token/ERC20/IERC20.sol)
+
+pragma solidity ^0.8.0;
+
+/**
+ * @dev Interface of the ERC20 standard as defined in the EIP.
+ */
+interface IERC20Upgradeable {
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
+     * @dev Returns the amount of tokens in existence.
+     */
+    function totalSupply() external view returns (uint256);
+
+    /**
+     * @dev Returns the amount of tokens owned by `account`.
+     */
+    function balanceOf(address account) external view returns (uint256);
+
+    /**
+     * @dev Moves `amount` tokens from the caller's account to `to`.
+     *
+     * Returns a boolean value indicating whether the operation succeeded.
+     *
+     * Emits a {Transfer} event.
+     */
+    function transfer(address to, uint256 amount) external returns (bool);
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
+     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
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
+    function approve(address spender, uint256 amount) external returns (bool);
+
+    /**
+     * @dev Moves `amount` tokens from `from` to `to` using the
+     * allowance mechanism. `amount` is then deducted from the caller's
+     * allowance.
+     *
+     * Returns a boolean value indicating whether the operation succeeded.
+     *
+     * Emits a {Transfer} event.
+     */
+    function transferFrom(address from, address to, uint256 amount) external returns (bool);
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts (last updated v4.9.3) (token/ERC20/utils/SafeERC20.sol)
+
+pragma solidity ^0.8.0;
+
+import "../IERC20Upgradeable.sol";
+import "../extensions/IERC20PermitUpgradeable.sol";
+import "../../../utils/AddressUpgradeable.sol";
+
+/**
+ * @title SafeERC20
+ * @dev Wrappers around ERC20 operations that throw on failure (when the token
+ * contract returns false). Tokens that return no value (and instead revert or
+ * throw on failure) are also supported, non-reverting calls are assumed to be
+ * successful.
+ * To use this library you can add a `using SafeERC20 for IERC20;` statement to your contract,
+ * which allows you to call the safe operations as `token.safeTransfer(...)`, etc.
+ */
+library SafeERC20Upgradeable {
+    using AddressUpgradeable for address;
+
+    /**
+     * @dev Transfer `value` amount of `token` from the calling contract to 
[truncated — full diff is 860,327 bytes]
> ```

> </details>

> <details>
> <summary>📝 Source diff — upgrade #7 (<code>0x1D10...3A00</code> → <code>0x0fD2...2D5f</code>): +4764/-10936 lines (truncated)</summary>

> ```diff
--- old_impl
+++ new_impl
@@ -1,12 +1,11 @@
 // SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v4.9.0) (access/AccessControl.sol)
-
-pragma solidity ^0.8.0;
-
-import "./IAccessControlUpgradeable.sol";
-import "../utils/ContextUpgradeable.sol";
-import "../utils/StringsUpgradeable.sol";
-import "../utils/introspection/ERC165Upgradeable.sol";
+// OpenZeppelin Contracts (last updated v5.0.0) (access/AccessControl.sol)
+
+pragma solidity ^0.8.20;
+
+import {IAccessControl} from "@openzeppelin/contracts/access/IAccessControl.sol";
+import {ContextUpgradeable} from "../utils/ContextUpgradeable.sol";
+import {ERC165Upgradeable} from "../utils/introspection/ERC165Upgradeable.sol";
 import {Initializable} from "../proxy/utils/Initializable.sol";
 
 /**
@@ -48,25 +47,32 @@
  * accounts that have been granted it. We recommend using {AccessControlDefaultAdminRules}
  * to enforce additional security measures for this role.
  */
-abstract contract AccessControlUpgradeable is Initializable, ContextUpgradeable, IAccessControlUpgradeable, ERC165Upgradeable {
+abstract contract AccessControlUpgradeable is Initializable, ContextUpgradeable, IAccessControl, ERC165Upgradeable {
     struct RoleData {
-        mapping(address => bool) members;
+        mapping(address account => bool) hasRole;
         bytes32 adminRole;
     }
 
-    mapping(bytes32 => RoleData) private _roles;
-
     bytes32 public constant DEFAULT_ADMIN_ROLE = 0x00;
 
+
+    /// @custom:storage-location erc7201:openzeppelin.storage.AccessControl
+    struct AccessControlStorage {
+        mapping(bytes32 role => RoleData) _roles;
+    }
+
+    // keccak256(abi.encode(uint256(keccak256("openzeppelin.storage.AccessControl")) - 1)) & ~bytes32(uint256(0xff))
+    bytes32 private constant AccessControlStorageLocation = 0x02dd7bc7dec4dceedda775e58dd541e08a116c6c53815c0bd028192f7b626800;
+
+    function _getAccessControlStorage() private pure returns (AccessControlStorage storage $) {
+        assembly {
+            $.slot := AccessControlStorageLocation
+        }
+    }
+
     /**
      * @dev Modifier that checks that an account has a specific role. Reverts
-     * with a standardized message including the required role.
-     *
-     * The format of the revert reason is given by the following regular expression:
-     *
-     *  /^AccessControl: account (0x[0-9a-f]{40}) is missing role (0x[0-9a-f]{64})$/
-     *
-     * _Available since v4.1._
+     * with an {AccessControlUnauthorizedAccount} error including the required role.
      */
     modifier onlyRole(bytes32 role) {
         _checkRole(role);
@@ -82,47 +88,32 @@
      * @dev See {IERC165-supportsInterface}.
      */
     function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
-        return interfaceId == type(IAccessControlUpgradeable).interfaceId || super.supportsInterface(interfaceId);
+        return interfaceId == type(IAccessControl).interfaceId || super.supportsInterface(interfaceId);
     }
 
     /**
      * @dev Returns `true` if `account` has been granted `role`.
      */
-    function hasRole(bytes32 role, address account) public view virtual override returns (bool) {
-        return _roles[role].members[account];
-    }
-
-    /**
-     * @dev Revert with a standard message if `_msgSender()` is missing `role`.
-     * Overriding this function changes the behavior of the {onlyRole} modifier.
-     *
-     * Format of the revert message is described in {_checkRole}.
-     *
-     * _Available since v4.6._
+    function hasRole(bytes32 role, address account) public view virtual returns (bool) {
+        AccessControlStorage storage $ = _getAccessControlStorage();
+        return $._roles[role].hasRole[account];
+    }
+
+    /**
+     * @dev Reverts with an {AccessControlUnauthorizedAccount} error if `_msgSender()`
+     * is missing `role`. Overriding this function changes the behavior of the {onlyRole} modifier.
      */
     function _checkRole(bytes32 role) internal view virtual {
         _checkRole(role, _msgSender());
     }
 
     /**
-     * @dev Revert with a standard message if `account` is missing `role`.
-     *
-     * The format of the revert reason is given by the following regular expression:
-     *
-     *  /^AccessControl: account (0x[0-9a-f]{40}) is missing role (0x[0-9a-f]{64})$/
+     * @dev Reverts with an {AccessControlUnauthorizedAccount} error if `account`
+     * is missing `role`.
      */
     function _checkRole(bytes32 role, address account) internal view virtual {
         if (!hasRole(role, account)) {
-            revert(
-                string(
-                    abi.encodePacked(
-                        "AccessControl: account ",
-                        StringsUpgradeable.toHexString(account),
-                        " is missing role ",
-                        StringsUpgradeable.toHexString(uint256(role), 32)
-                    )
-                )
-            );
+            revert AccessControlUnauthorizedAccount(account, role);
         }
     }
 
@@ -132,8 +123,9 @@
      *
      * To change a role's admin, use {_setRoleAdmin}.
      */
-    function getRoleAdmin(bytes32 role) public view virtual override returns (bytes32) {
-        return _roles[role].adminRole;
+    function getRoleAdmin(bytes32 role) public view virtual returns (bytes32) {
+        AccessControlStorage storage $ = _getAccessControlStorage();
+        return $._roles[role].adminRole;
     }
 
     /**
@@ -148,7 +140,7 @@
      *
      * May emit a {RoleGranted} event.
      */
-    function grantRole(bytes32 role, address account) public virtual override onlyRole(getRoleAdmin(role)) {
+    function grantRole(bytes32 role, address account) public virtual onlyRole(getRoleAdmin(role)) {
         _grantRole(role, account);
     }
 
@@ -163,7 +155,7 @@
      *
      * May emit a {RoleRevoked} event.
      */
-    function revokeRole(bytes32 role, address account) public virtual override onlyRole(getRoleAdmin(role)) {
+    function revokeRole(bytes32 role, address account) public virtual onlyRole(getRoleAdmin(role)) {
         _revokeRole(role, account);
     }
 
@@ -179,214 +171,72 @@
      *
      * Requirements:
      *
-     * - the caller must be `account`.
+     * - the caller must be `callerConfirmation`.
      *
      * May emit a {RoleRevoked} event.
      */
-    function renounceRole(bytes32 role, address account) public virtual override {
-        require(account == _msgSender(), "AccessControl: can only renounce roles for self");
-
-        _revokeRole(role, account);
-    }
-
-    /**
-     * @dev Grants `role` to `account`.
-     *
-     * If `account` had not been already granted `role`, emits a {RoleGranted}
-     * event. Note that unlike {grantRole}, this function doesn't perform any
-     * checks on the calling account.
+    function renounceRole(bytes32 role, address callerConfirmation) public virtual {
+        if (callerConfirmation != _msgSender()) {
+            revert AccessControlBadConfirmation();
+        }
+
+        _revokeRole(role, callerConfirmation);
+    }
+
+    /**
+     * @dev Sets `adminRole` as ``role``'s admin role.
+     *
+     * Emits a {RoleAdminChanged} event.
+     */
+    function _setRoleAdmin(bytes32 role, bytes32 adminRole) internal virtual {
+        AccessControlStorage storage $ = _getAccessControlStorage();
+        bytes32 previousAdminRole = getRoleAdmin(role);
+        $._roles[role].adminRole = adminRole;
+        emit RoleAdminChanged(role, previousAdminRole, adminRole);
+    }
+
+    /**
+     * @dev Attempts to grant `role` to `account` and returns a boolean indicating if `role` was granted.
+     *
+     * Internal function without access restriction.
      *
      * May emit a {RoleGranted} event.
-     *
-     * [WARNING]
-     * ====
-     * This function should only be called from the constructor when setting
-     * up the initial roles for the system.
-     *
-     * Using this function in any other way is effectively circumventing the admin
-     * system imposed by {AccessControl}.
-     * ====
-     *
-     * NOTE: This function is deprecated in favor of {_grantRole}.
-     */
-    function _setupRole(bytes32 role, address account) internal virtual {
-        _grantRole(role, account);
-    }
-
-    /**
-     * @dev Sets `adminRole` as ``role``'s admin role.
-     *
-     * Emits a {RoleAdminChanged} event.
-     */
-    function _setRoleAdmin(bytes32 role, bytes32 adminRole) internal virtual {
-        bytes32 previousAdminRole = getRoleAdmin(role);
-        _roles[role].adminRole = adminRole;
-        emit RoleAdminChanged(role, previousAdminRole, adminRole);
-    }
-
-    /**
-     * @dev Grants `role` to `account`.
+     */
+    function _grantRole(bytes32 role, address account) internal virtual returns (bool) {
+        AccessControlStorage storage $ = _getAccessControlStorage();
+        if (!hasRole(role, account)) {
+            $._roles[role].hasRole[account] = true;
+            emit RoleGranted(role, account, _msgSender());
+            return true;
+        } else {
+            return false;
+        }
+    }
+
+    /**
+     * @dev Attempts to revoke `role` to `account` and returns a boolean indicating if `role` was revoked.
      *
      * Internal function without access restriction.
      *
-     * May emit a {RoleGranted} event.
-     */
-    function _grantRole(bytes32 role, address account) internal virtual {
-        if (!hasRole(role, account)) {
-            _roles[role].members[account] = true;
-            emit RoleGranted(role, account, _msgSender());
+     * May emit a {RoleRevoked} event.
+     */
+    function _revokeRole(bytes32 role, address account) internal virtual returns (bool) {
+        AccessControlStorage storage $ = _getAccessControlStorage();
+        if (hasRole(role, account)) {
+            $._roles[role].hasRole[account] = false;
+            emit RoleRevoked(role, account, _msgSender());
+            return true;
+        } else {
+            return false;
         }
     }
-
-    /**
-     * @dev Revokes `role` from `account`.
-     *
-     * Internal function without access restriction.
-     *
-     * May emit a {RoleRevoked} event.
-     */
-    function _revokeRole(bytes32 role, address account) internal virtual {
-        if (hasRole(role, account)) {
-            _roles[role].members[account] = false;
-            emit RoleRevoked(role, account, _msgSender());
-        }
-    }
-
-    /**
-     * @dev This empty reserved space is put in place to allow future versions to add new
-     * variables without shifting down storage in the inheritance chain.
-     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
-     */
-    uint256[49] private __gap;
 }
 
 
 // SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts v4.4.1 (access/IAccessControl.sol)
-
-pragma solidity ^0.8.0;
-
-/**
- * @dev External interface of AccessControl declared to support ERC165 detection.
- */
-interface IAccessControlUpgradeable {
-    /**
-     * @dev Emitted when `newAdminRole` is set as ``role``'s admin role, replacing `previousAdminRole`
-     *
-     * `DEFAULT_ADMIN_ROLE` is the starting admin for all roles, despite
-     * {RoleAdminChanged} not being emitted signaling this.
-     *
-     * _Available since v3.1._
-     */
-    event RoleAdminChanged(bytes32 indexed role, bytes32 indexed previousAdminRole, bytes32 indexed newAdminRole);
-
-    /**
-     * @dev Emitted when `account` is granted `role`.
-     *
-     * `sender` is the account that originated the contract call, an admin role
-     * bearer except when using {AccessControl-_setupRole}.
-     */
-    event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender);
-
-    /**
-     * @dev Emitted when `account` is revoked `role`.
-     *
-     * `sender` is the account that originated the contract call:
-     *   - if using `revokeRole`, it is the admin role bearer
-     *   - if using `renounceRole`, it is the role bearer (i.e. `account`)
-     */
-    event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender);
-
-    /**
-     * @dev Returns `true` if `account` has been granted `role`.
-     */
-    function hasRole(bytes32 role, address account) external view returns (bool);
-
-    /**
-     * @dev Returns the admin role that controls `role`. See {grantRole} and
-     * {revokeRole}.
-     *
-     * To change a role's admin, use {AccessControl-_setRoleAdmin}.
-     */
-    function getRoleAdmin(bytes32 role) external view returns (bytes32);
-
-    /**
-     * @dev Grants `role` to `account`.
-     *
-     * If `account` had not been already granted `role`, emits a {RoleGranted}
-     * event.
-     *
-     * Requirements:
-     *
-     * - the caller must have ``role``'s admin role.
-     */
-    function grantRole(bytes32 role, address account) external;
-
-    /**
-     * @dev Revokes `role` from `account`.
-     *
-     * If `account` had been granted `role`, emits a {RoleRevoked} event.
-     *
-     * Requirements:
-     *
-     * - the caller must have ``role``'s admin role.
-     */
-    function revokeRole(bytes32 role, address account) external;
-
-    /**
-     * @dev Revokes `role` from the calling account.
-     *
-     * Roles are often managed via {grantRole} and {revokeRole}: this function's
-     * purpose is to provide a mechanism for accounts to lose their privileges
-     * if they are compromised (such as when a trusted device is misplaced).
-     *
-     * If the calling account had been granted `role`, emits a {RoleRevoked}
-     * event.
-     *
-     * Requirements:
-     *
-     * - the caller must be `account`.
-     */
-    function renounceRole(bytes32 role, address account) external;
-}
-
-
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v4.9.0) (interfaces/IERC5267.sol)
-
-pragma solidity ^0.8.0;
-
-interface IERC5267Upgradeable {
-    /**
-     * @dev MAY be emitted to signal that the domain could have changed.
-     */
-    event EIP712DomainChanged();
-
-    /**
-     * @dev returns the fields and values that describe the domain separator used by this contract for EIP-712
-     * signature.
-     */
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
-}
-
-
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v4.9.0) (proxy/utils/Initializable.sol)
-
-pragma solidity ^0.8.2;
-
-import "../../utils/AddressUpgradeable.sol";
+// OpenZeppelin Contracts (last updated v5.0.0) (proxy/utils/Initializable.sol)
+
+pragma solidity ^0.8.20;
 
 /**
  * @dev This is a base contract to aid in writing upgradeable contracts, or any kind of contract that will be deployed
@@ -440,43 +290,78 @@
  */
 abstract contract Initializable {
     /**
-     * @dev Indicates that the contract has been initialized.
-     * @custom:oz-retyped-from bool
-     */
-    uint8 private _initialized;
-
-    /**
-     * @dev Indicates that the contract is in the process of being initialized.
-     */
-    bool private _initializing;
+     * @dev Storage of the initializable contract.
+     *
+     * It's implemented on a custom ERC-7201 namespace to reduce the risk of storage collisions
+     * when using with upgradeable contracts.
+     *
+     * @custom:storage-location erc7201:openzeppelin.storage.Initializable
+     */
+    struct InitializableStorage {
+        /**
+         * @dev Indicates that the contract has been initialized.
+         */
+        uint64 _initialized;
+        /**
+         * @dev Indicates that the contract is in the process of being initialized.
+         */
+        bool _initializing;
+    }
+
+    // keccak256(abi.encode(uint256(keccak256("openzeppelin.storage.Initializable")) - 1)) & ~bytes32(uint256(0xff))
+    bytes32 private constant INITIALIZABLE_STORAGE = 0xf0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a00;
+
+    /**
+     * @dev The contract is already initialized.
+     */
+    error InvalidInitialization();
+
+    /**
+     * @dev The contract is not initializing.
+     */
+    error NotInitializing();
 
     /**
      * @dev Triggered when the contract has been initialized or reinitialized.
      */
-    event Initialized(uint8 version);
+    event Initialized(uint64 version);
 
     /**
      * @dev A modifier that defines a protected initializer function that can be invoked at most once. In its scope,
      * `onlyInitializing` functions can be used to initialize parent contracts.
      *
-     * Similar to `reinitializer(1)`, except that functions marked with `initializer` can be nested in the context of a
-     * constructor.
+     * Similar to `reinitializer(1)`, except that in the context of a constructor an `initializer` may be invoked any
+     * number of times. This behavior in the constructor can be useful during testing and is not expected to be used in
+     * production.
      *
      * Emits an {Initialized} event.
      */
     modifier initializer() {
-        bool isTopLevelCall = !_initializing;
-        require(
-            (isTopLevelCall && _initialized < 1) || (!AddressUpgradeable.isContract(address(this)) && _initialized == 1),
-            "Initializable: contract is already initialized"
-        );
-        _initialized = 1;
+        // solhint-disable-next-line var-name-mixedcase
+        InitializableStorage storage $ = _getInitializableStorage();
+
+        // Cache values to avoid duplicated sloads
+        bool isTopLevelCall = !$._initializing;
+        uint64 initialized = $._initialized;
+
+        // Allowed calls:
+        // - initialSetup: the contract is not in the initializing state and no previous version was
+        //                 initialized
+        // - construction: the contract is initialized at version 1 (no reininitialization) and the
+        //                 current contract is just being deployed
+        bool initialSetup = initialized == 0 && isTopLevelCall;
+        bool construction = initialized == 1 && address(this).code.length == 0;
+
+        if (!initialSetup && !construction) {
+            revert InvalidInitialization();
+        }
+        $._initialized = 1;
         if (isTopLevelCall) {
-            _initializing = true;
+            $._initializing = true;
         }
         _;
         if (isTopLevelCall) {
-            _initializing = false;
+            $._initializing = false;
             emit Initialized(1);
         }
     }
@@ -495,16 +380,21 @@
      * Note that versions can jump in increments greater than 1; this implies that if multiple reinitializers coexist in
      * a contract, executing them in the right order is up to the developer or operator.
      *
-     * WARNING: setting the version to 255 will prevent any future reinitialization.
+     * WARNING: Setting the version to 2**64 - 1 will prevent any future reinitialization.
      *
      * Emits an {Initialized} event.
      */
-    modifier reinitializer(uint8 version) {
-        require(!_initializing && _initialized < version, "Initializable: contract is already initialized");
-        _initialized = version;
-        _initializing = true;
+    modifier reinitializer(uint64 version) {
+        // solhint-disable-next-line var-name-mixedcase
+        InitializableStorage storage $ = _getInitializableStorage();
+
+        if ($._initializing || $._initialized >= version) {
+            revert InvalidInitialization();
+        }
+        $._initialized = version;
+        $._initializing = true;
         _;
-        _initializing = false;
+        $._initializing = false;
         emit Initialized(version);
     }
 
@@ -513,8 +403,17 @@
      * {initializer} and {reinitializer} modifiers, directly or indirectly.
      */
     modifier onlyInitializing() {
-        require(_initializing, "Initializable: contract is not initializing");
+        _checkInitializing();
         _;
+    }
+
+    /**
+     * @dev Reverts if the contract is not in an initializing state. See {onlyInitializing}.
+     */
+    function _checkInitializing() internal view virtual {
+        if (!_isInitializing()) {
+            revert NotInitializing();
+        }
     }
 
     /**
@@ -526,33 +425,1801 @@
      * Emits an {Initialized} event the first time it is successfully executed.
      */
     function _disableInitializers() internal virtual {
-        require(!_initializing, "Initializable: contract is initializing");
-        if (_initialized != type(uint8).max) {
-            _initialized = type(uint8).max;
-            emit Initialized(type(uint8).max);
+        // solhint-disable-next-line var-name-mixedcase
+        InitializableStorage storage $ = _getInitializableStorage();
+
+        if ($._initializing) {
+            revert InvalidInitialization();
         }
+        if ($._initialized != type(uint64).max) {
+            $._initialized = type(uint64).max;
+            emit Initialized(type(uint64).max);
+        }
     }
 
     /**
      * @dev Returns the highest version that has been initialized. See {reinitializer}.
      */
-    function _getInitializedVersion() internal view returns (uint8) {
-        return _initialized;
+    function _getInitializedVersion() internal view returns (uint64) {
+        return _getInitializableStorage()._initialized;
     }
 
     /**
      * @dev Returns `true` if the contract is currently initializing. See {onlyInitializing}.
      */
     function _isInitializing() internal view returns (bool) {
-        return _initializing;
+        return _getInitializableStorage()._initializing;
+    }
+
+    /**
+     * @dev Returns a pointer to the storage namespace.
+     */
+    // solhint-disable-next-line var-name-mixedcase
+    function _getInitializableStorage() private pure returns (InitializableStorage storage $) {
+        assembly {
+            $.slot := INITIALIZABLE_STORAGE
+        }
     }
 }
 
 
 // SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v4.9.0) (security/ReentrancyGuard.sol)
-
-pragma solidity ^0.8.0;
+// OpenZeppelin Contracts (last updated v5.0.0) (token/ERC20/ERC20.sol)
+
+pragma solidity ^0.8.20;
+
+import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
+import {IERC20Metadata} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
+import {ContextUpgradeable} from "../../utils/ContextUpgradeable.sol";
+import {IERC20Errors} from "@openzeppelin/contracts/interfaces/draft-IERC6093.sol";
+import {Initializable} from "../../proxy/utils/Initializable.sol";
+
+/**
+ * @dev Implementation of the {IERC20} interface.
+ *
+ * This implementation is agnostic to the way tokens are created. This means
+ * that a supply mechanism has to be added in a derived contract using {_mint}.
+ *
+ * TIP: For a detailed writeup see our guide
+ * https://forum.openzeppelin.com/t/how-to-implement-erc20-supply-mechanisms/226[How
+ * to implement supply mechanisms].
+ *
+ * The default value of {decimals} is 18. To change this, you should override
+ * this function so it returns a different value.
+ *
+ * We have followed general OpenZeppelin Contracts guidelines: functions revert
+ * instead returning `false` on failure. This behavior is nonetheless
+ * conventional and does not conflict with the expectations of ERC20
+ * applications.
+ *
+ * Additionally, an {Approval} event is emitted on calls to {transferFrom}.
+ * This allows applications to reconstruct the allowance for all accounts just
+ * by listening to said events. Other implementations of the EIP may not emit
+ * these events, as it isn't required by the specification.
+ */
+abstract contract ERC20Upgradeable is Initializable, ContextUpgradeable, IERC20, IERC20Metadata, IERC20Errors {
+    /// @custom:storage-location erc7201:openzeppelin.storage.ERC20
+    struct ERC20Storage {
+        mapping(address account => uint256) _balances;
+
+        mapping(address account => mapping(address spender => uint256)) _allowances;
+
+        uint256 _totalSupply;
+
+        string _name;
+        string _symbol;
+    }
+
+    // keccak256(abi.encode(uint256(keccak256("openzeppelin.storage.ERC20")) - 1)) & ~bytes32(uint256(0xff))
+    bytes32 private constant ERC20StorageLocation = 0x52c63247e1f47db19d5ce0460030c497f067ca4cebf71ba98eeadabe20bace00;
+
+    function _getERC20Storage() private pure returns (ERC20Storage storage $) {
+        assembly {
+            $.slot := ERC20StorageLocation
+        }
+    }
+
+    /**
+     * @dev Sets the values for {name} and {symbol}.
+     *
+     * All two of these values are immutable: they can only be set once during
+     * construction.
+     */
+    function __ERC20_init(string memory name_, string memory symbol_) internal onlyInitializing {
+        __ERC20_init_unchained(name_, symbol_);
+    }
+
+    function __ERC20_init_unchained(string memory name_, string memory symbol_) internal onlyInitializing {
+        ERC20Storage storage $ = _getERC20Storage();
+        $._name = name_;
+        $._symbol = symbol_;
+    }
+
+    /**
+     * @dev Returns the name of the token.
+     */
+    function name() public view virtual returns (string memory) {
+        ERC20Storage storage $ = _getERC20Storage();
+        return $._name;
+    }
+
+    /**
+     * @dev Returns the symbol of the token, usually a shorter version of the
+     * name.
+     */
+    function symbol() public view virtual returns (string memory) {
+        ERC20Storage storage $ = _getERC20Storage();
+        return $._symbol;
+    }
+
+    /**
+     * @dev Returns the number of decimals used to get its user representation.
+     * For example, if `decimals` equals `2`, a balance of `505` tokens should
+     * be displayed to a user as `5.05` (`505 / 10 ** 2`).
+     *
+     * Tokens usually opt for a value of 18, imitating the relationship between
+     * Ether and Wei. This is the default value returned by this function, unless
+     * it's overridden.
+     *
+     * NOTE: This information is only used for _display_ purposes: it in
+     * no way affects any of the arithmetic of the contract, including
+     * {IERC20-balanceOf} and {IERC20-transfer}.
+     */
+    function decimals() public view virtual returns (uint8) {
+        return 18;
+    }
+
+    /**
+     * @dev See {IERC20-totalSupply}.
+     */
+    function totalSupply() public view virtual returns (uint256) {
+        ERC20Storage storage $ = _getERC20Storage();
+        return $._totalSupply;
+    }
+
+    /**
+     * @dev See {IERC20-balanceOf}.
+     */
+    function balanceOf(address account) public view virtual returns (uint256) {
+        ERC20Storage storage $ = _getERC20Storage();
+        return $._balances[account];
+    }
+
+    /**
+     * @dev See {IERC20-transfer}.
+     *
+     * Requirements:
+     *
+     * - `to` cannot be the zero address.
+     * - the caller must have a balance of at least `value`.
+     */
+    function transfer(address to, uint256 value) public virtual returns (bool) {
+        address owner = _msgSender();
+        _transfer(owner, to, value);
+        return true;
+    }
+
+    /**
+     * @dev See {IERC20-allowance}.
+     */
+    function allowance(address owner, address spender) public view virtual returns (uint256) {
+        ERC20Storage storage $ = _getERC20Storage();
+        return $._allowances[owner][spender];
+    }
+
+    /**
+     * @dev See {IERC20-approve}.
+     *
+     * NOTE: If `value` is the maximum `uint256`, the allowance is not updated on
+     * `transferFrom`. This is semantically equivalent to an infinite approval.
+     *
+     * Requirements:
+     *
+     * - `spender` cannot be the zero address.
+     */
+    function approve(address spender, uint256 value) public virtual returns (bool) {
+        address owner = _msgSender();
+        _approve(owner, spender, value);
+        return true;
+    }
+
+    /**
+     * @dev See {IERC20-transferFrom}.
+     *
+     * Emits an {Approval} event indicating the updated allowance. This is not
+     * required by the EIP. See the note at the beginning of {ERC20}.
+     *
+     * NOTE: Does not update the allowance if the current allowance
+     * is the maximum `uint256`.
+     *
+     * Requirements:
+     *
+     * - `from` and `to` cannot be the zero address.
+     * - `from` must have a balance of at least `value`.
+     * - the caller must have allowance for ``from``'s tokens of at least
+     * `value`.
+     */
+    function transferFrom(address from, address to, uint256 value) public virtual returns (bool) {
+        address spender = _msgSender();
+        _spendAllowance(from, spender, value);
+        _transfer(from, to, value);
+        return true;
+    }
+
+    /**
+     * @dev Moves a `value` amount of tokens from `from` to `to`.
+     *
+     * This internal function is equivalent to {transfer}, and can be used to
+     * e.g. implement automatic token fees, slashing mechanisms, etc.
+     *
+     * Emits a {Transfer} event.
+     *
+     * NOTE: This function is not virtual, {_update} should be overridden instead.
+     */
+    function _transfer(address from, address to, uint256 value) internal {
+        if (from == address(0)) {
+            revert ERC20InvalidSender(address(0));
+        }
+        if (to == address(0)) {
+            revert ERC20InvalidReceiver(address(0));
+        }
+        _update(from, to, value);
+    }
+
+    /**
+     * @dev Transfers a `value` amount of tokens from `from` to `to`, or alternatively mints (or burns) if `from`
+     * (or `to`) is the zero address. All customizations to transfers, mints, and burns should be done by overriding
+     * this function.
+     *
+     * Emits a {Transfer} event.
+     */
+    function _update(address from, address to, uint256 value) internal virtual {
+        ERC20Storage storage $ = _getERC20Storage();
+        if (from == address(0)) {
+            // Overflow check required: The rest of the code assumes that totalSupply never overflows
+            $._totalSupply += value;
+        } else {
+            uint256 fromBalance = $._balances[from];
+            if (fromBalance < value) {
+                revert ERC20InsufficientBalance(from, fromBalance, value);
+            }
+            unchecked {
+                // Overflow not possible: value <= fromBalance <= totalSupply.
+                $._balances[from] = fromBalance - value;
+            }
+        }
+
+        if (to == address(0)) {
+            unchecked {
+                // Overflow not possible: value <= totalSupply or value <= fromBalance <= totalSupply.
+                $._totalSupply -= value;
+            }
+        } else {
+            unchecked {
+                // Overflow not possible: balance + value is at most totalSupply, which we know fits into a uint256.
+                $._balances[to] += value;
+            }
+        }
+
+        emit Transfer(from, to, value);
+    }
+
+    /**
+     * @dev Creates a `value` amount of tokens and assigns them to `account`, by transferring it from address(0).
+     * Relies on the `_update` mechanism
+     *
+     * Emits a {Transfer} event with `from` set to the zero address.
+     *
+     * NOTE: This function is not virtual, {_update} should be overridden instead.
+     */
+    function _mint(address account, uint256 value) internal {
+        if (account == address(0)) {
+            revert ERC20InvalidReceiver(address(0));
+        }
+        _update(address(0), account, value);
+    }
+
+    /**
+     * @dev Destroys a `value` amount of tokens from `account`, lowering the total supply.
+     * Relies on the `_update` mechanism.
+     *
+     * Emits a {Transfer} event with `to` set to the zero address.
+     *
+     * NOTE: This function is not virtual, {_update} should be overridden instead
+     */
+    function _burn(address account, uint256 value) internal {
+        if (account == address(0)) {
+            revert ERC20InvalidSender(address(0));
+        }
+        _update(account, address(0), value);
+    }
+
+    /**
+     * @dev Sets `value` as the allowance of `spender` over the `owner` s tokens.
+     *
+     * This internal function is equivalent to `approve`, and can be used to
+     * e.g. set automatic allowances for certain subsystems, etc.
+     *
+     * Emits an {Approval} event.
+     *
+     * Requirements:
+     *
+     * - `owner` cannot be the zero address.
+     * - `spender` cannot be the zero address.
+     *
+     * Overrides to this logic should be done to the variant with an additional `bool emitEvent` argument.
+     */
+    function _approve(address owner, address spender, uint256 value) internal {
+        _approve(owner, spender, value, true);
+    }
+
+    /**
+     * @dev Variant of {_approve} with an optional flag to enable or disable the {Approval} event.
+     *
+     * By default (when calling {_approve}) the flag is set to true. On the other hand, approval changes made by
+     * `_spendAllowance` during the `transferFrom` operation set the flag to false. This saves gas by not emitting any
+     * `Approval` event during `transferFrom` operations.
+     *
+     * Anyone who wishes to continue emitting `Approval` events on the`transferFrom` operation can force the flag to
+     * true using the following override:
+     * ```
+     * function _approve(address owner, address spender, uint256 value, bool) internal virtual override {
+     *     super._approve(owner, spender, value, true);
+     * }
+     * ```
+     *
+     * Requirements are the same as {_approve}.
+     */
+    function _approve(address owner, address spender, uint256 value, bool emitEvent) internal virtual {
+        ERC20Storage storage $ = _getERC20Storage();
+        if (owner == address(0)) {
+            revert ERC20InvalidApprover(address(0));
+        }
+        if (spender == address(0)) {
+            revert ERC20InvalidSpender(address(0));
+        }
+        $._allowances[owner][spender] = value;
+        if (emitEvent) {
+            emit Approval(owner, spender, value);
+        }
+    }
+
+    /**
+     * @dev Updates `owner` s allowance for `spender` based on spent `value`.
+     *
+     * Does not update the allowance value in case of infinite allowance.
+     * Revert if not enough allowance is available.
+     *
+     * Does not emit an {Approval} event.
+     */
+    function _spendAllowance(address owner, address spender, uint256 value) internal virtual {
+        uint256 currentAllowance = allowance(owner, spender);
+        if (currentAllowance != type(uint256).max) {
+            if (currentAllowance < value) {
+                revert ERC20InsufficientAllowance(spender, currentAllowance, value);
+            }
+            unchecked {
+                _approve(owner, spender, currentAllowance - value, false);
+            }
+        }
+    }
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts (last updated v5.0.0) (token/ERC20/extensions/ERC20Permit.sol)
+
+pragma solidity ^0.8.20;
+
+import {IERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Permit.sol";
+import {ERC20Upgradeable} from "../ERC20Upgradeable.sol";
+import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
+import {EIP712Upgradeable} from "../../../utils/cryptography/EIP712Upgradeable.sol";
+import {NoncesUpgradeable} from "../../../utils/NoncesUpgradeable.sol";
+import {Initializable} from "../../../proxy/utils/Initializable.sol";
+
+/**
+ * @dev Implementation of the ERC20 Permit extension allowing approvals to be made via signatures, as defined in
+ * https://eips.ethereum.org/EIPS/eip-2612[EIP-2612].
+ *
+ * Adds the {permit} method, which can be used to change an account's ERC20 allowance (see {IERC20-allowance}) by
+ * presenting a message signed by the account. By not relying on `{IERC20-approve}`, the token holder account doesn't
+ * need to send a transaction, and thus is not required to hold Ether at all.
+ */
+abstract contract ERC20PermitUpgradeable is Initializable, ERC20Upgradeable, IERC20Permit, EIP712Upgradeable, NoncesUpgradeable {
+    bytes32 private constant PERMIT_TYPEHASH =
+        keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)");
+
+    /**
+     * @dev Permit deadline has expired.
+     */
+    error ERC2612ExpiredSignature(uint256 deadline);
+
+    /**
+     * @dev Mismatched signature.
+     */
+    error ERC2612InvalidSigner(address signer, address owner);
+
+    /**
+     * @dev Initializes the {EIP712} domain separator using the `name` parameter, and setting `version` to `"1"`.
+     *
+     * It's a good idea to use the same `name` that is defined as the ERC20 token name.
+     */
+    function __ERC20Permit_init(string memory name) internal onlyInitializing {
+        __EIP712_init_unchained(name, "1");
+    }
+
+    function __ERC20Permit_init_unchained(string memory) internal onlyInitializing {}
+
+    /**
+     * @inheritdoc IERC20Permit
+     */
+    function permit(
+        address owner,
+        address spender,
+        uint256 value,
+        uint256 deadline,
+        uint8 v,
+        bytes32 r,
+        bytes32 s
+    ) public virtual {
+        if (block.timestamp > deadline) {
+            revert ERC2612ExpiredSignature(deadline);
+        }
+
+        bytes32 structHash = keccak256(abi.encode(PERMIT_TYPEHASH, owner, spender, value, _useNonce(owner), deadline));
+
+        bytes32 hash = _hashTypedDataV4(structHash);
+
+        address signer = ECDSA.recover(hash, v, r, s);
+        if (signer != owner) {
+            revert ERC2612InvalidSigner(signer, owner);
+        }
+
+        _approve(owner, spender, value);
+    }
+
+    /**
+     * @inheritdoc IERC20Permit
+     */
+    function nonces(address owner) public view virtual override(IERC20Permit, NoncesUpgradeable) returns (uint256) {
+        return super.nonces(owner);
+    }
+
+    /**
+     * @inheritdoc IERC20Permit
+     */
+    // solhint-disable-next-line func-name-mixedcase
+    function DOMAIN_SEPARATOR() external view virtual returns (bytes32) {
+        return _domainSeparatorV4();
+    }
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts (last updated v5.0.0) (token/ERC20/extensions/ERC4626.sol)
+
+pragma solidity ^0.8.20;
+
+import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
+import {IERC20Metadata} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
+import {ERC20Upgradeable} from "../ERC20Upgradeable.sol";
+import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
+import {IERC4626} from "@openzeppelin/contracts/interfaces/IERC4626.sol";
+import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";
+import {Initializable} from "../../../proxy/utils/Initializable.sol";
+
+/**
+ * @dev Implementation of the ERC4626 "Tokenized Vault Standard" as defined in
+ * https://eips.ethereum.org/EIPS/eip-4626[EIP-4626].
+ *
+ * This extension allows the minting and burning of "shares" (represented using the ERC20 inheritance) in exchange for
+ * underlying "assets" through standardized {deposit}, {mint}, {redeem} and {burn} workflows. This contract extends
+ * the ERC20 standard. Any additional extensions included along it would affect the "shares" token represented by this
+ * contract and not the "assets" token which is an independent contract.
+ *
+ * [CAUTION]
+ * ====
+ * In empty (or nearly empty) ERC-4626 vaults, deposits are at high risk of being stolen through frontrunning
+ * with a "donation" to the vault that inflates the price of a share. This is variously known as a donation or inflation
+ * attack and is essentially a problem of slippage. Vault deployers can protect against this attack by making an initial
+ * deposit of a non-trivial amount of the asset, such that price manipulation becomes infeasible. Withdrawals may
+ * similarly be affected by slippage. Users can protect against this attack as well as unexpected slippage in general by
+ * verifying the amount received is as expected, using a wrapper that performs these checks such as
+ * https://github.com/fei-protocol/ERC4626#erc4626router-and-base[ERC4626Router].
+ *
+ * Since v4.9, this implementation uses virtual assets and shares to mitigate that risk. The `_decimalsOffset()`
+ * corresponds to an offset in the decimal representation between the underlying asset's decimals and the vault
+ * decimals. This offset also determines the rate of virtual shares to virtual assets in the vault, which itself
+ * determines the initial exchange rate. While not fully preventing the attack, analysis shows that the default offset
+ * (0) makes it non-profitable, as a result of the value being captured by the virtual shares (out of the attacker's
+ * donation) matching the attacker's expected gains. With a larger offset, the attack becomes orders of magnitude more
+ * expensive than it is profitable. More details about the underlying math can be found
+ * xref:erc4626.adoc#inflation-attack[here].
+ *
+ * The drawback of this approach is that the virtual shares do capture (a very small) part of the value being accrued
+ * to the vault. Also, if the vault experiences losses, the users try to exit the vault, the virtual shares and assets
+ * will cause the first user to exit to experience reduced losses in detriment to the last users that will experience
+ * bigger losses. Developers willing to revert back to the pre-v4.9 behavior just need to override the
+ * `_convertToShares` and `_convertToAssets` functions.
+ *
+ * To learn more, check out our xref:ROOT:erc4626.adoc[ERC-4626 guide].
+ * ====
+ */
+abstract contract ERC4626Upgradeable is Initializable, ERC20Upgradeable, IERC4626 {
+    using Math for uint256;
+
+    /// @custom:storage-location erc7201:openzeppelin.storage.ERC4626
+    struct ERC4626Storage {
+        IERC20 _asset;
+        uint8 _underlyingDecimals;
+    }
+
+    // keccak256(abi.encode(uint256(keccak256("openzeppelin.storage.ERC4626")) - 1)) & ~bytes32(uint256(0xff))
+    bytes32 private constant ERC4626StorageLocation = 0x0773e532dfede91f04b12a73d3d2acd361424f41f76b4fb79f090161e36b4e00;
+
+    function _getERC4626Storage() private pure returns (ERC4626Storage storage $) {
+        assembly {
+            $.slot := ERC4626StorageLocation
+        }
+    }
+
+    /**
+     * @dev Attempted to deposit more assets than the max amount for `receiver`.
+     */
+    error ERC4626ExceededMaxDeposit(address receiver, uint256 assets, uint256 max);
+
+    /**
+     * @dev Attempted to mint more shares than the max amount for `receiver`.
+     */
+    error ERC4626ExceededMaxMint(address receiver, uint256 shares, uint256 max);
+
+    /**
+     * @dev Attempted to withdraw more assets than the max amount for `receiver`.
+     */
+    error ERC4626ExceededMaxWithdraw(address owner, uint256 assets, uint256 max);
+
+    /**
+     * @dev Attempted to redeem more shares than the max amount for `receiver`.
+     */
+    error ERC4626ExceededMaxRedeem(address owner, uint256 shares, uint256 max);
+
+    /**
+     * @dev Set the underlying asset contract. This must be an ERC20-compatible contract (ERC20 or ERC777).
+     */
+    function __ERC4626_init(IERC20 asset_) internal onlyInitializing {
+        __ERC4626_init_unchained(asset_);
+    }
+
+    function __ERC4626_init_unchained(IERC20 asset_) internal onlyInitializing {
+        ERC4626Storage storage $ = _getERC4626Storage();
+        (bool success, uint8 assetDecimals) = _tryGetAssetDecimals(asset_);
+        $._underlyingDecimals = success ? assetDecimals : 18;
+        $._asset = asset_;
+    }
+
+    /**
+     * @dev Attempts to fetch the asset decimals. A return value of false indicates that the attempt failed in some way.
+     */
+    function _tryGetAssetDecimals(IERC20 asset_) private view returns (bool, uint8) {
+        (bool success, bytes memory encodedDecimals) = address(asset_).staticcall(
+            abi.encodeCall(IERC20Metadata.decimals, ())
+        );
+        if (success && encodedDecimals.length >= 32) {
+            uint256 returnedDecimals = abi.decode(encodedDecimals, (uint256));
+            if (returnedDecimals <= type(uint8).max) {
+                return (true, uint8(returnedDecimals));
+            }
+        }
+        return (false, 0);
+    }
+
+    /**
+     * @dev Decimals are computed by adding the decimal offset on top of the underlying asset's decimals. This
+     * "original" value is cached during construction of the vault contract. If this read operation fails (e.g., the
+     * asset has not been created yet), a default of 18 is used to represent the underlying asset's decimals.
+     *
+     * See {IERC20Metadata-decimals}.
+     */
+    function decimals() public view virtual override(IERC20Metadata, ERC20Upgradeable) returns (uint8) {
+        ERC4626Storage storage $ = _getERC4626Storage();
+        return $._underlyingDecimals + _decimalsOffset();
+    }
+
+    /** @dev See {IERC4626-asset}. */
+    function asset() public view virtual returns (address) {
+        ERC4626Storage storage $ = _getERC4626Storage();
+        return address($._asset);
+    }
+
+    /** @dev See {IERC4626-totalAssets}. */
+    function totalAssets() public view virtual returns (uint256) {
+        ERC4626Storage storage $ = _getERC4626Storage();
+        return $._asset.balanceOf(address(this));
+    }
+
+    /** @dev See {IERC4626-convertToShares}. */
+    function convertToShares(uint256 assets) public view virtual returns (uint256) {
+        return _convertToShares(assets, Math.Rounding.Floor);
+    }
+
+    /** @dev See {IERC4626-convertToAssets}. */
+    function convertToAssets(uint256 shares) public view virtual returns (uint256) {
+        return _convertToAssets(shares, Math.Rounding.Floor);
+    }
+
+    /** @dev See {IERC4626-maxDeposit}. */
+    function maxDeposit(address) public view virtual returns (uint256) {
+        return type(uint256).max;
+    }
+
+    /** @dev See {IERC4626-maxMint}. */
+    function maxMint(address) public view virtual returns (uint256) {
+        return type(uint256).max;
+    }
+
+    /** @dev See {IERC4626-maxWithdraw}. */
+    function maxWithdraw(address owner) public view virtual returns (uint256) {
+        return _convertToAssets(balanceOf(owner), Math.Rounding.Floor);
+    }
+
+    /** @dev See {IERC4626-maxRedeem}. */
+    function maxRedeem(address owner) public view virtual returns (uint256) {
+        return balanceOf(owner);
+    }
+
+    /** @dev See {IERC4626-previewDeposit}. */
+    function previewDeposit(uint256 assets) public view virtual returns (uint256) {
+        return _convertToShares(assets, Math.Rounding.Floor);
+    }
+
+    /** @dev See {IERC4626-previewMint}. */
+    function previewMint(uint256 shares) public view virtual returns (uint256) {
+        return _convertToAssets(shares, Math.Rounding.Ceil);
+    }
+
+    /** @dev See {IERC4626-previewWithdraw}. */
+    function previewWithdraw(uint256 assets) public view virtual returns (uint256) {
+        return _convertToShares(assets, Math.Rounding.Ceil);
+    }
+
+    /** @dev See {IERC4626-previewRedeem}. */
+    function previewRedeem(uint256 shares) public view virtual returns (uint256) {
+        return _convertToAssets(shares, Math.Rounding.Floor);
+    }
+
+    /** @dev See {IERC4626-deposit}. */
+    function deposit(uint256 assets, address receiver) public virtual returns (uint256) {
+        uint256 maxAssets = maxDeposit(receiver);
+        if (assets > maxAssets) {
+            revert ERC4626ExceededMaxDeposit(receiver, assets, maxAssets);
+        }
+
+        uint256 shares = previewDeposit(assets);
+        _deposit(_msgSender(), receiver, assets, shares);
+
+        return shares;
+    }
+
+    /** @dev See {IERC4626-mint}.
+     *
+     * As opposed to {deposit}, minting is allowed even if the vault is in a state where the price of a share is zero.
+     * In this case, the shares will be minted without requiring any assets to be deposited.
+     */
+    function mint(uint256 shares, address receiver) public virtual returns (uint256) {
+        uint256 maxShares = maxMint(receiver);
+        if (shares > maxShares) {
+            revert ERC4626ExceededMaxMint(receiver, shares, maxShares);
+        }
+
+        uint256 assets = previewMint(shares);
+        _deposit(_msgSender(), receiver, assets, shares);
+
+        return assets;
+    }
+
+    /** @dev See {IERC4626-withdraw}. */
+    function withdraw(uint256 assets, address receiver, address owner) public virtual returns (uint256) {
+        uint256 maxAssets = maxWithdraw(owner);
+        if (assets > maxAssets) {
+            revert ERC4626ExceededMaxWithdraw(owner, assets, maxAssets);
+        }
+
+        uint256 shares = previewWithdraw(assets);
+        _withdraw(_msgSender(), receiver, owner, assets, shares);
+
+        return shares;
+    }
+
+    /** @dev See {IERC4626-redeem}. */
+    function redeem(uint256 shares, address receiver, address owner) public virtual returns (uint256) {
+        uint256 maxShares = maxRedeem(owner);
+        if (shares > maxShares) {
+            revert ERC4626ExceededMaxRedeem(owner, shares, maxShares);
+        }
+
+        uint256 assets = previewRedeem(shares);
+        _withdraw(_msgSender(), receiver, owner, assets, shares);
+
+        return assets;
+    }
+
+    /**
+     * @dev Internal conversion function (from assets to shares) with support for rounding direction.
+     */
+    function _convertToShares(uint256 assets, Math.Rounding rounding) internal view virtual returns (uint256) {
+        return assets.mulDiv(totalSupply() + 10 ** _decimalsOffset(), totalAssets() + 1, rounding);
+    
[truncated — full diff is 635,508 bytes]
> ```

> </details>

> <details>
> <summary>📝 Source diff — upgrade #8 (<code>0x0fD2...2D5f</code> → <code>0x9579...33c4</code>): +4790/-2189 lines (truncated)</summary>

> ```diff
--- old_impl
+++ new_impl
@@ -1,11 +1,12 @@
 // SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v5.0.0) (access/AccessControl.sol)
-
-pragma solidity ^0.8.20;
-
-import {IAccessControl} from "@openzeppelin/contracts/access/IAccessControl.sol";
-import {ContextUpgradeable} from "../utils/ContextUpgradeable.sol";
-import {ERC165Upgradeable} from "../utils/introspection/ERC165Upgradeable.sol";
+// OpenZeppelin Contracts (last updated v4.9.0) (access/AccessControl.sol)
+
+pragma solidity ^0.8.0;
+
+import "./IAccessControlUpgradeable.sol";
+import "../utils/ContextUpgradeable.sol";
+import "../utils/StringsUpgradeable.sol";
+import "../utils/introspection/ERC165Upgradeable.sol";
 import {Initializable} from "../proxy/utils/Initializable.sol";
 
 /**
@@ -47,32 +48,25 @@
  * accounts that have been granted it. We recommend using {AccessControlDefaultAdminRules}
  * to enforce additional security measures for this role.
  */
-abstract contract AccessControlUpgradeable is Initializable, ContextUpgradeable, IAccessControl, ERC165Upgradeable {
+abstract contract AccessControlUpgradeable is Initializable, ContextUpgradeable, IAccessControlUpgradeable, ERC165Upgradeable {
     struct RoleData {
-        mapping(address account => bool) hasRole;
+        mapping(address => bool) members;
         bytes32 adminRole;
     }
 
+    mapping(bytes32 => RoleData) private _roles;
+
     bytes32 public constant DEFAULT_ADMIN_ROLE = 0x00;
 
-
-    /// @custom:storage-location erc7201:openzeppelin.storage.AccessControl
-    struct AccessControlStorage {
-        mapping(bytes32 role => RoleData) _roles;
-    }
-
-    // keccak256(abi.encode(uint256(keccak256("openzeppelin.storage.AccessControl")) - 1)) & ~bytes32(uint256(0xff))
-    bytes32 private constant AccessControlStorageLocation = 0x02dd7bc7dec4dceedda775e58dd541e08a116c6c53815c0bd028192f7b626800;
-
-    function _getAccessControlStorage() private pure returns (AccessControlStorage storage $) {
-        assembly {
-            $.slot := AccessControlStorageLocation
-        }
-    }
-
     /**
      * @dev Modifier that checks that an account has a specific role. Reverts
-     * with an {AccessControlUnauthorizedAccount} error including the required role.
+     * with a standardized message including the required role.
+     *
+     * The format of the revert reason is given by the following regular expression:
+     *
+     *  /^AccessControl: account (0x[0-9a-f]{40}) is missing role (0x[0-9a-f]{64})$/
+     *
+     * _Available since v4.1._
      */
     modifier onlyRole(bytes32 role) {
         _checkRole(role);
@@ -88,32 +82,47 @@
      * @dev See {IERC165-supportsInterface}.
      */
     function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
-        return interfaceId == type(IAccessControl).interfaceId || super.supportsInterface(interfaceId);
+        return interfaceId == type(IAccessControlUpgradeable).interfaceId || super.supportsInterface(interfaceId);
     }
 
     /**
      * @dev Returns `true` if `account` has been granted `role`.
      */
-    function hasRole(bytes32 role, address account) public view virtual returns (bool) {
-        AccessControlStorage storage $ = _getAccessControlStorage();
-        return $._roles[role].hasRole[account];
-    }
-
-    /**
-     * @dev Reverts with an {AccessControlUnauthorizedAccount} error if `_msgSender()`
-     * is missing `role`. Overriding this function changes the behavior of the {onlyRole} modifier.
+    function hasRole(bytes32 role, address account) public view virtual override returns (bool) {
+        return _roles[role].members[account];
+    }
+
+    /**
+     * @dev Revert with a standard message if `_msgSender()` is missing `role`.
+     * Overriding this function changes the behavior of the {onlyRole} modifier.
+     *
+     * Format of the revert message is described in {_checkRole}.
+     *
+     * _Available since v4.6._
      */
     function _checkRole(bytes32 role) internal view virtual {
         _checkRole(role, _msgSender());
     }
 
     /**
-     * @dev Reverts with an {AccessControlUnauthorizedAccount} error if `account`
-     * is missing `role`.
+     * @dev Revert with a standard message if `account` is missing `role`.
+     *
+     * The format of the revert reason is given by the following regular expression:
+     *
+     *  /^AccessControl: account (0x[0-9a-f]{40}) is missing role (0x[0-9a-f]{64})$/
      */
     function _checkRole(bytes32 role, address account) internal view virtual {
         if (!hasRole(role, account)) {
-            revert AccessControlUnauthorizedAccount(account, role);
+            revert(
+                string(
+                    abi.encodePacked(
+                        "AccessControl: account ",
+                        StringsUpgradeable.toHexString(account),
+                        " is missing role ",
+                        StringsUpgradeable.toHexString(uint256(role), 32)
+                    )
+                )
+            );
         }
     }
 
@@ -123,9 +132,8 @@
      *
      * To change a role's admin, use {_setRoleAdmin}.
      */
-    function getRoleAdmin(bytes32 role) public view virtual returns (bytes32) {
-        AccessControlStorage storage $ = _getAccessControlStorage();
-        return $._roles[role].adminRole;
+    function getRoleAdmin(bytes32 role) public view virtual override returns (bytes32) {
+        return _roles[role].adminRole;
     }
 
     /**
@@ -140,7 +148,7 @@
      *
      * May emit a {RoleGranted} event.
      */
-    function grantRole(bytes32 role, address account) public virtual onlyRole(getRoleAdmin(role)) {
+    function grantRole(bytes32 role, address account) public virtual override onlyRole(getRoleAdmin(role)) {
         _grantRole(role, account);
     }
 
@@ -155,7 +163,7 @@
      *
      * May emit a {RoleRevoked} event.
      */
-    function revokeRole(bytes32 role, address account) public virtual onlyRole(getRoleAdmin(role)) {
+    function revokeRole(bytes32 role, address account) public virtual override onlyRole(getRoleAdmin(role)) {
         _revokeRole(role, account);
     }
 
@@ -171,16 +179,38 @@
      *
      * Requirements:
      *
-     * - the caller must be `callerConfirmation`.
+     * - the caller must be `account`.
      *
      * May emit a {RoleRevoked} event.
      */
-    function renounceRole(bytes32 role, address callerConfirmation) public virtual {
-        if (callerConfirmation != _msgSender()) {
-            revert AccessControlBadConfirmation();
-        }
-
-        _revokeRole(role, callerConfirmation);
+    function renounceRole(bytes32 role, address account) public virtual override {
+        require(account == _msgSender(), "AccessControl: can only renounce roles for self");
+
+        _revokeRole(role, account);
+    }
+
+    /**
+     * @dev Grants `role` to `account`.
+     *
+     * If `account` had not been already granted `role`, emits a {RoleGranted}
+     * event. Note that unlike {grantRole}, this function doesn't perform any
+     * checks on the calling account.
+     *
+     * May emit a {RoleGranted} event.
+     *
+     * [WARNING]
+     * ====
+     * This function should only be called from the constructor when setting
+     * up the initial roles for the system.
+     *
+     * Using this function in any other way is effectively circumventing the admin
+     * system imposed by {AccessControl}.
+     * ====
+     *
+     * NOTE: This function is deprecated in favor of {_grantRole}.
+     */
+    function _setupRole(bytes32 role, address account) internal virtual {
+        _grantRole(role, account);
     }
 
     /**
@@ -189,54 +219,174 @@
      * Emits a {RoleAdminChanged} event.
      */
     function _setRoleAdmin(bytes32 role, bytes32 adminRole) internal virtual {
-        AccessControlStorage storage $ = _getAccessControlStorage();
         bytes32 previousAdminRole = getRoleAdmin(role);
-        $._roles[role].adminRole = adminRole;
+        _roles[role].adminRole = adminRole;
         emit RoleAdminChanged(role, previousAdminRole, adminRole);
     }
 
     /**
-     * @dev Attempts to grant `role` to `account` and returns a boolean indicating if `role` was granted.
+     * @dev Grants `role` to `account`.
      *
      * Internal function without access restriction.
      *
      * May emit a {RoleGranted} event.
      */
-    function _grantRole(bytes32 role, address account) internal virtual returns (bool) {
-        AccessControlStorage storage $ = _getAccessControlStorage();
+    function _grantRole(bytes32 role, address account) internal virtual {
         if (!hasRole(role, account)) {
-            $._roles[role].hasRole[account] = true;
+            _roles[role].members[account] = true;
             emit RoleGranted(role, account, _msgSender());
-            return true;
-        } else {
-            return false;
-        }
-    }
-
-    /**
-     * @dev Attempts to revoke `role` to `account` and returns a boolean indicating if `role` was revoked.
+        }
+    }
+
+    /**
+     * @dev Revokes `role` from `account`.
      *
      * Internal function without access restriction.
      *
      * May emit a {RoleRevoked} event.
      */
-    function _revokeRole(bytes32 role, address account) internal virtual returns (bool) {
-        AccessControlStorage storage $ = _getAccessControlStorage();
+    function _revokeRole(bytes32 role, address account) internal virtual {
         if (hasRole(role, account)) {
-            $._roles[role].hasRole[account] = false;
+            _roles[role].members[account] = false;
             emit RoleRevoked(role, account, _msgSender());
-            return true;
-        } else {
-            return false;
-        }
-    }
+        }
+    }
+
+    /**
+     * @dev This empty reserved space is put in place to allow future versions to add new
+     * variables without shifting down storage in the inheritance chain.
+     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
+     */
+    uint256[49] private __gap;
 }
 
 
 // SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v5.0.0) (proxy/utils/Initializable.sol)
-
-pragma solidity ^0.8.20;
+// OpenZeppelin Contracts v4.4.1 (access/IAccessControl.sol)
+
+pragma solidity ^0.8.0;
+
+/**
+ * @dev External interface of AccessControl declared to support ERC165 detection.
+ */
+interface IAccessControlUpgradeable {
+    /**
+     * @dev Emitted when `newAdminRole` is set as ``role``'s admin role, replacing `previousAdminRole`
+     *
+     * `DEFAULT_ADMIN_ROLE` is the starting admin for all roles, despite
+     * {RoleAdminChanged} not being emitted signaling this.
+     *
+     * _Available since v3.1._
+     */
+    event RoleAdminChanged(bytes32 indexed role, bytes32 indexed previousAdminRole, bytes32 indexed newAdminRole);
+
+    /**
+     * @dev Emitted when `account` is granted `role`.
+     *
+     * `sender` is the account that originated the contract call, an admin role
+     * bearer except when using {AccessControl-_setupRole}.
+     */
+    event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender);
+
+    /**
+     * @dev Emitted when `account` is revoked `role`.
+     *
+     * `sender` is the account that originated the contract call:
+     *   - if using `revokeRole`, it is the admin role bearer
+     *   - if using `renounceRole`, it is the role bearer (i.e. `account`)
+     */
+    event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender);
+
+    /**
+     * @dev Returns `true` if `account` has been granted `role`.
+     */
+    function hasRole(bytes32 role, address account) external view returns (bool);
+
+    /**
+     * @dev Returns the admin role that controls `role`. See {grantRole} and
+     * {revokeRole}.
+     *
+     * To change a role's admin, use {AccessControl-_setRoleAdmin}.
+     */
+    function getRoleAdmin(bytes32 role) external view returns (bytes32);
+
+    /**
+     * @dev Grants `role` to `account`.
+     *
+     * If `account` had not been already granted `role`, emits a {RoleGranted}
+     * event.
+     *
+     * Requirements:
+     *
+     * - the caller must have ``role``'s admin role.
+     */
+    function grantRole(bytes32 role, address account) external;
+
+    /**
+     * @dev Revokes `role` from `account`.
+     *
+     * If `account` had been granted `role`, emits a {RoleRevoked} event.
+     *
+     * Requirements:
+     *
+     * - the caller must have ``role``'s admin role.
+     */
+    function revokeRole(bytes32 role, address account) external;
+
+    /**
+     * @dev Revokes `role` from the calling account.
+     *
+     * Roles are often managed via {grantRole} and {revokeRole}: this function's
+     * purpose is to provide a mechanism for accounts to lose their privileges
+     * if they are compromised (such as when a trusted device is misplaced).
+     *
+     * If the calling account had been granted `role`, emits a {RoleRevoked}
+     * event.
+     *
+     * Requirements:
+     *
+     * - the caller must be `account`.
+     */
+    function renounceRole(bytes32 role, address account) external;
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts (last updated v4.9.0) (interfaces/IERC5267.sol)
+
+pragma solidity ^0.8.0;
+
+interface IERC5267Upgradeable {
+    /**
+     * @dev MAY be emitted to signal that the domain could have changed.
+     */
+    event EIP712DomainChanged();
+
+    /**
+     * @dev returns the fields and values that describe the domain separator used by this contract for EIP-712
+     * signature.
+     */
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
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts (last updated v4.9.0) (proxy/utils/Initializable.sol)
+
+pragma solidity ^0.8.2;
+
+import "../../utils/AddressUpgradeable.sol";
 
 /**
  * @dev This is a base contract to aid in writing upgradeable contracts, or any kind of contract that will be deployed
@@ -290,6 +440,2928 @@
  */
 abstract contract Initializable {
     /**
+     * @dev Indicates that the contract has been initialized.
+     * @custom:oz-retyped-from bool
+     */
+    uint8 private _initialized;
+
+    /**
+     * @dev Indicates that the contract is in the process of being initialized.
+     */
+    bool private _initializing;
+
+    /**
+     * @dev Triggered when the contract has been initialized or reinitialized.
+     */
+    event Initialized(uint8 version);
+
+    /**
+     * @dev A modifier that defines a protected initializer function that can be invoked at most once. In its scope,
+     * `onlyInitializing` functions can be used to initialize parent contracts.
+     *
+     * Similar to `reinitializer(1)`, except that functions marked with `initializer` can be nested in the context of a
+     * constructor.
+     *
+     * Emits an {Initialized} event.
+     */
+    modifier initializer() {
+        bool isTopLevelCall = !_initializing;
+        require(
+            (isTopLevelCall && _initialized < 1) || (!AddressUpgradeable.isContract(address(this)) && _initialized == 1),
+            "Initializable: contract is already initialized"
+        );
+        _initialized = 1;
+        if (isTopLevelCall) {
+            _initializing = true;
+        }
+        _;
+        if (isTopLevelCall) {
+            _initializing = false;
+            emit Initialized(1);
+        }
+    }
+
+    /**
+     * @dev A modifier that defines a protected reinitializer function that can be invoked at most once, and only if the
+     * contract hasn't been initialized to a greater version before. In its scope, `onlyInitializing` functions can be
+     * used to initialize parent contracts.
+     *
+     * A reinitializer may be used after the original initialization step. This is essential to configure modules that
+     * are added through upgrades and that require initialization.
+     *
+     * When `version` is 1, this modifier is similar to `initializer`, except that functions marked with `reinitializer`
+     * cannot be nested. If one is invoked in the context of another, execution will revert.
+     *
+     * Note that versions can jump in increments greater than 1; this implies that if multiple reinitializers coexist in
+     * a contract, executing them in the right order is up to the developer or operator.
+     *
+     * WARNING: setting the version to 255 will prevent any future reinitialization.
+     *
+     * Emits an {Initialized} event.
+     */
+    modifier reinitializer(uint8 version) {
+        require(!_initializing && _initialized < version, "Initializable: contract is already initialized");
+        _initialized = version;
+        _initializing = true;
+        _;
+        _initializing = false;
+        emit Initialized(version);
+    }
+
+    /**
+     * @dev Modifier to protect an initialization function so that it can only be invoked by functions with the
+     * {initializer} and {reinitializer} modifiers, directly or indirectly.
+     */
+    modifier onlyInitializing() {
+        require(_initializing, "Initializable: contract is not initializing");
+        _;
+    }
+
+    /**
+     * @dev Locks the contract, preventing any future reinitialization. This cannot be part of an initializer call.
+     * Calling this in the constructor of a contract will prevent that contract from being initialized or reinitialized
+     * to any version. It is recommended to use this to lock implementation contracts that are designed to be called
+     * through proxies.
+     *
+     * Emits an {Initialized} event the first time it is successfully executed.
+     */
+    function _disableInitializers() internal virtual {
+        require(!_initializing, "Initializable: contract is initializing");
+        if (_initialized != type(uint8).max) {
+            _initialized = type(uint8).max;
+            emit Initialized(type(uint8).max);
+        }
+    }
+
+    /**
+     * @dev Returns the highest version that has been initialized. See {reinitializer}.
+     */
+    function _getInitializedVersion() internal view returns (uint8) {
+        return _initialized;
+    }
+
+    /**
+     * @dev Returns `true` if the contract is currently initializing. See {onlyInitializing}.
+     */
+    function _isInitializing() internal view returns (bool) {
+        return _initializing;
+    }
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts (last updated v4.9.0) (token/ERC20/ERC20.sol)
+
+pragma solidity ^0.8.0;
+
+import "./IERC20Upgradeable.sol";
+import "./extensions/IERC20MetadataUpgradeable.sol";
+import "../../utils/ContextUpgradeable.sol";
+import {Initializable} from "../../proxy/utils/Initializable.sol";
+
+/**
+ * @dev Implementation of the {IERC20} interface.
+ *
+ * This implementation is agnostic to the way tokens are created. This means
+ * that a supply mechanism has to be added in a derived contract using {_mint}.
+ * For a generic mechanism see {ERC20PresetMinterPauser}.
+ *
+ * TIP: For a detailed writeup see our guide
+ * https://forum.openzeppelin.com/t/how-to-implement-erc20-supply-mechanisms/226[How
+ * to implement supply mechanisms].
+ *
+ * The default value of {decimals} is 18. To change this, you should override
+ * this function so it returns a different value.
+ *
+ * We have followed general OpenZeppelin Contracts guidelines: functions revert
+ * instead returning `false` on failure. This behavior is nonetheless
+ * conventional and does not conflict with the expectations of ERC20
+ * applications.
+ *
+ * Additionally, an {Approval} event is emitted on calls to {transferFrom}.
+ * This allows applications to reconstruct the allowance for all accounts just
+ * by listening to said events. Other implementations of the EIP may not emit
+ * these events, as it isn't required by the specification.
+ *
+ * Finally, the non-standard {decreaseAllowance} and {increaseAllowance}
+ * functions have been added to mitigate the well-known issues around setting
+ * allowances. See {IERC20-approve}.
+ */
+contract ERC20Upgradeable is Initializable, ContextUpgradeable, IERC20Upgradeable, IERC20MetadataUpgradeable {
+    mapping(address => uint256) private _balances;
+
+    mapping(address => mapping(address => uint256)) private _allowances;
+
+    uint256 private _totalSupply;
+
+    string private _name;
+    string private _symbol;
+
+    /**
+     * @dev Sets the values for {name} and {symbol}.
+     *
+     * All two of these values are immutable: they can only be set once during
+     * construction.
+     */
+    function __ERC20_init(string memory name_, string memory symbol_) internal onlyInitializing {
+        __ERC20_init_unchained(name_, symbol_);
+    }
+
+    function __ERC20_init_unchained(string memory name_, string memory symbol_) internal onlyInitializing {
+        _name = name_;
+        _symbol = symbol_;
+    }
+
+    /**
+     * @dev Returns the name of the token.
+     */
+    function name() public view virtual override returns (string memory) {
+        return _name;
+    }
+
+    /**
+     * @dev Returns the symbol of the token, usually a shorter version of the
+     * name.
+     */
+    function symbol() public view virtual override returns (string memory) {
+        return _symbol;
+    }
+
+    /**
+     * @dev Returns the number of decimals used to get its user representation.
+     * For example, if `decimals` equals `2`, a balance of `505` tokens should
+     * be displayed to a user as `5.05` (`505 / 10 ** 2`).
+     *
+     * Tokens usually opt for a value of 18, imitating the relationship between
+     * Ether and Wei. This is the default value returned by this function, unless
+     * it's overridden.
+     *
+     * NOTE: This information is only used for _display_ purposes: it in
+     * no way affects any of the arithmetic of the contract, including
+     * {IERC20-balanceOf} and {IERC20-transfer}.
+     */
+    function decimals() public view virtual override returns (uint8) {
+        return 18;
+    }
+
+    /**
+     * @dev See {IERC20-totalSupply}.
+     */
+    function totalSupply() public view virtual override returns (uint256) {
+        return _totalSupply;
+    }
+
+    /**
+     * @dev See {IERC20-balanceOf}.
+     */
+    function balanceOf(address account) public view virtual override returns (uint256) {
+        return _balances[account];
+    }
+
+    /**
+     * @dev See {IERC20-transfer}.
+     *
+     * Requirements:
+     *
+     * - `to` cannot be the zero address.
+     * - the caller must have a balance of at least `amount`.
+     */
+    function transfer(address to, uint256 amount) public virtual override returns (bool) {
+        address owner = _msgSender();
+        _transfer(owner, to, amount);
+        return true;
+    }
+
+    /**
+     * @dev See {IERC20-allowance}.
+     */
+    function allowance(address owner, address spender) public view virtual override returns (uint256) {
+        return _allowances[owner][spender];
+    }
+
+    /**
+     * @dev See {IERC20-approve}.
+     *
+     * NOTE: If `amount` is the maximum `uint256`, the allowance is not updated on
+     * `transferFrom`. This is semantically equivalent to an infinite approval.
+     *
+     * Requirements:
+     *
+     * - `spender` cannot be the zero address.
+     */
+    function approve(address spender, uint256 amount) public virtual override returns (bool) {
+        address owner = _msgSender();
+        _approve(owner, spender, amount);
+        return true;
+    }
+
+    /**
+     * @dev See {IERC20-transferFrom}.
+     *
+     * Emits an {Approval} event indicating the updated allowance. This is not
+     * required by the EIP. See the note at the beginning of {ERC20}.
+     *
+     * NOTE: Does not update the allowance if the current allowance
+     * is the maximum `uint256`.
+     *
+     * Requirements:
+     *
+     * - `from` and `to` cannot be the zero address.
+     * - `from` must have a balance of at least `amount`.
+     * - the caller must have allowance for ``from``'s tokens of at least
+     * `amount`.
+     */
+    function transferFrom(address from, address to, uint256 amount) public virtual override returns (bool) {
+        address spender = _msgSender();
+        _spendAllowance(from, spender, amount);
+        _transfer(from, to, amount);
+        return true;
+    }
+
+    /**
+     * @dev Atomically increases the allowance granted to `spender` by the caller.
+     *
+     * This is an alternative to {approve} that can be used as a mitigation for
+     * problems described in {IERC20-approve}.
+     *
+     * Emits an {Approval} event indicating the updated allowance.
+     *
+     * Requirements:
+     *
+     * - `spender` cannot be the zero address.
+     */
+    function increaseAllowance(address spender, uint256 addedValue) public virtual returns (bool) {
+        address owner = _msgSender();
+        _approve(owner, spender, allowance(owner, spender) + addedValue);
+        return true;
+    }
+
+    /**
+     * @dev Atomically decreases the allowance granted to `spender` by the caller.
+     *
+     * This is an alternative to {approve} that can be used as a mitigation for
+     * problems described in {IERC20-approve}.
+     *
+     * Emits an {Approval} event indicating the updated allowance.
+     *
+     * Requirements:
+     *
+     * - `spender` cannot be the zero address.
+     * - `spender` must have allowance for the caller of at least
+     * `subtractedValue`.
+     */
+    function decreaseAllowance(address spender, uint256 subtractedValue) public virtual returns (bool) {
+        address owner = _msgSender();
+        uint256 currentAllowance = allowance(owner, spender);
+        require(currentAllowance >= subtractedValue, "ERC20: decreased allowance below zero");
+        unchecked {
+            _approve(owner, spender, currentAllowance - subtractedValue);
+        }
+
+        return true;
+    }
+
+    /**
+     * @dev Moves `amount` of tokens from `from` to `to`.
+     *
+     * This internal function is equivalent to {transfer}, and can be used to
+     * e.g. implement automatic token fees, slashing mechanisms, etc.
+     *
+     * Emits a {Transfer} event.
+     *
+     * Requirements:
+     *
+     * - `from` cannot be the zero address.
+     * - `to` cannot be the zero address.
+     * - `from` must have a balance of at least `amount`.
+     */
+    function _transfer(address from, address to, uint256 amount) internal virtual {
+        require(from != address(0), "ERC20: transfer from the zero address");
+        require(to != address(0), "ERC20: transfer to the zero address");
+
+        _beforeTokenTransfer(from, to, amount);
+
+        uint256 fromBalance = _balances[from];
+        require(fromBalance >= amount, "ERC20: transfer amount exceeds balance");
+        unchecked {
+            _balances[from] = fromBalance - amount;
+            // Overflow not possible: the sum of all balances is capped by totalSupply, and the sum is preserved by
+            // decrementing then incrementing.
+            _balances[to] += amount;
+        }
+
+        emit Transfer(from, to, amount);
+
+        _afterTokenTransfer(from, to, amount);
+    }
+
+    /** @dev Creates `amount` tokens and assigns them to `account`, increasing
+     * the total supply.
+     *
+     * Emits a {Transfer} event with `from` set to the zero address.
+     *
+     * Requirements:
+     *
+     * - `account` cannot be the zero address.
+     */
+    function _mint(address account, uint256 amount) internal virtual {
+        require(account != address(0), "ERC20: mint to the zero address");
+
+        _beforeTokenTransfer(address(0), account, amount);
+
+        _totalSupply += amount;
+        unchecked {
+            // Overflow not possible: balance + amount is at most totalSupply + amount, which is checked above.
+            _balances[account] += amount;
+        }
+        emit Transfer(address(0), account, amount);
+
+        _afterTokenTransfer(address(0), account, amount);
+    }
+
+    /**
+     * @dev Destroys `amount` tokens from `account`, reducing the
+     * total supply.
+     *
+     * Emits a {Transfer} event with `to` set to the zero address.
+     *
+     * Requirements:
+     *
+     * - `account` cannot be the zero address.
+     * - `account` must have at least `amount` tokens.
+     */
+    function _burn(address account, uint256 amount) internal virtual {
+        require(account != address(0), "ERC20: burn from the zero address");
+
+        _beforeTokenTransfer(account, address(0), amount);
+
+        uint256 accountBalance = _balances[account];
+        require(accountBalance >= amount, "ERC20: burn amount exceeds balance");
+        unchecked {
+            _balances[account] = accountBalance - amount;
+            // Overflow not possible: amount <= accountBalance <= totalSupply.
+            _totalSupply -= amount;
+        }
+
+        emit Transfer(account, address(0), amount);
+
+        _afterTokenTransfer(account, address(0), amount);
+    }
+
+    /**
+     * @dev Sets `amount` as the allowance of `spender` over the `owner` s tokens.
+     *
+     * This internal function is equivalent to `approve`, and can be used to
+     * e.g. set automatic allowances for certain subsystems, etc.
+     *
+     * Emits an {Approval} event.
+     *
+     * Requirements:
+     *
+     * - `owner` cannot be the zero address.
+     * - `spender` cannot be the zero address.
+     */
+    function _approve(address owner, address spender, uint256 amount) internal virtual {
+        require(owner != address(0), "ERC20: approve from the zero address");
+        require(spender != address(0), "ERC20: approve to the zero address");
+
+        _allowances[owner][spender] = amount;
+        emit Approval(owner, spender, amount);
+    }
+
+    /**
+     * @dev Updates `owner` s allowance for `spender` based on spent `amount`.
+     *
+     * Does not update the allowance amount in case of infinite allowance.
+     * Revert if not enough allowance is available.
+     *
+     * Might emit an {Approval} event.
+     */
+    function _spendAllowance(address owner, address spender, uint256 amount) internal virtual {
+        uint256 currentAllowance = allowance(owner, spender);
+        if (currentAllowance != type(uint256).max) {
+            require(currentAllowance >= amount, "ERC20: insufficient allowance");
+            unchecked {
+                _approve(owner, spender, currentAllowance - amount);
+            }
+        }
+    }
+
+    /**
+     * @dev Hook that is called before any transfer of tokens. This includes
+     * minting and burning.
+     *
+     * Calling conditions:
+     *
+     * - when `from` and `to` are both non-zero, `amount` of ``from``'s tokens
+     * will be transferred to `to`.
+     * - when `from` is zero, `amount` tokens will be minted for `to`.
+     * - when `to` is zero, `amount` of ``from``'s tokens will be burned.
+     * - `from` and `to` are never both zero.
+     *
+     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
+     */
+    function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual {}
+
+    /**
+     * @dev Hook that is called after any transfer of tokens. This includes
+     * minting and burning.
+     *
+     * Calling conditions:
+     *
+     * - when `from` and `to` are both non-zero, `amount` of ``from``'s tokens
+     * has been transferred to `to`.
+     * - when `from` is zero, `amount` tokens have been minted for `to`.
+     * - when `to` is zero, `amount` of ``from``'s tokens have been burned.
+     * - `from` and `to` are never both zero.
+     *
+     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
+     */
+    function _afterTokenTransfer(address from, address to, uint256 amount) internal virtual {}
+
+    /**
+     * @dev This empty reserved space is put in place to allow future versions to add new
+     * variables without shifting down storage in the inheritance chain.
+     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
+     */
+    uint256[45] private __gap;
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts (last updated v4.9.4) (token/ERC20/extensions/ERC20Permit.sol)
+
+pragma solidity ^0.8.0;
+
+import "./IERC20PermitUpgradeable.sol";
+import "../ERC20Upgradeable.sol";
+import "../../../utils/cryptography/ECDSAUpgradeable.sol";
+import "../../../utils/cryptography/EIP712Upgradeable.sol";
+import "../../../utils/CountersUpgradeable.sol";
+import {Initializable} from "../../../proxy/utils/Initializable.sol";
+
+/**
+ * @dev Implementation of the ERC20 Permit extension allowing approvals to be made via signatures, as defined in
+ * https://eips.ethereum.org/EIPS/eip-2612[EIP-2612].
+ *
+ * Adds the {permit} method, which can be used to change an account's ERC20 allowance (see {IERC20-allowance}) by
+ * presenting a message signed by the account. By not relying on `{IERC20-approve}`, the token holder account doesn't
+ * need to send a transaction, and thus is not required to hold Ether at all.
+ *
+ * _Available since v3.4._
+ *
+ * @custom:storage-size 51
+ */
+abstract contract ERC20PermitUpgradeable is Initializable, ERC20Upgradeable, IERC20PermitUpgradeable, EIP712Upgradeable {
+    using CountersUpgradeable for CountersUpgradeable.Counter;
+
+    mapping(address => CountersUpgradeable.Counter) private _nonces;
+
+    // solhint-disable-next-line var-name-mixedcase
+    bytes32 private constant _PERMIT_TYPEHASH =
+        keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)");
+    /**
+     * @dev In previous versions `_PERMIT_TYPEHASH` was declared as `immutable`.
+     * However, to ensure consistency with the upgradeable transpiler, we will continue
+     * to reserve a slot.
+     * @custom:oz-renamed-from _PERMIT_TYPEHASH
+     */
+    // solhint-disable-next-line var-name-mixedcase
+    bytes32 private _PERMIT_TYPEHASH_DEPRECATED_SLOT;
+
+    /**
+     * @dev Initializes the {EIP712} domain separator using the `name` parameter, and setting `version` to `"1"`.
+     *
+     * It's a good idea to use the same `name` that is defined as the ERC20 token name.
+     */
+    function __ERC20Permit_init(string memory name) internal onlyInitializing {
+        __EIP712_init_unchained(name, "1");
+    }
+
+    function __ERC20Permit_init_unchained(string memory) internal onlyInitializing {}
+
+    /**
+     * @inheritdoc IERC20PermitUpgradeable
+     */
+    function permit(
+        address owner,
+        address spender,
+        uint256 value,
+        uint256 deadline,
+        uint8 v,
+        bytes32 r,
+        bytes32 s
+    ) public virtual override {
+        require(block.timestamp <= deadline, "ERC20Permit: expired deadline");
+
+        bytes32 structHash = keccak256(abi.encode(_PERMIT_TYPEHASH, owner, spender, value, _useNonce(owner), deadline));
+
+        bytes32 hash = _hashTypedDataV4(structHash);
+
+        address signer = ECDSAUpgradeable.recover(hash, v, r, s);
+        require(signer == owner, "ERC20Permit: invalid signature");
+
+        _approve(owner, spender, value);
+    }
+
+    /**
+     * @inheritdoc IERC20PermitUpgradeable
+     */
+    function nonces(address owner) public view virtual override returns (uint256) {
+        return _nonces[owner].current();
+    }
+
+    /**
+     * @inheritdoc IERC20PermitUpgradeable
+     */
+    // solhint-disable-next-line func-name-mixedcase
+    function DOMAIN_SEPARATOR() external view override returns (bytes32) {
+        return _domainSeparatorV4();
+    }
+
+    /**
+     * @dev "Consume a nonce": return the current value and increment.
+     *
+     * _Available since v4.1._
+     */
+    function _useNonce(address owner) internal virtual returns (uint256 current) {
+        CountersUpgradeable.Counter storage nonce = _nonces[owner];
+        current = nonce.current();
+        nonce.increment();
+    }
+
+    /**
+     * @dev This empty reserved space is put in place to allow future versions to add new
+     * variables without shifting down storage in the inheritance chain.
+     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
+     */
+    uint256[49] private __gap;
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts v4.4.1 (token/ERC20/extensions/IERC20Metadata.sol)
+
+pragma solidity ^0.8.0;
+
+import "../IERC20Upgradeable.sol";
+
+/**
+ * @dev Interface for the optional metadata functions from the ERC20 standard.
+ *
+ * _Available since v4.1._
+ */
+interface IERC20MetadataUpgradeable is IERC20Upgradeable {
+    /**
+     * @dev Returns the name of the token.
+     */
+    function name() external view returns (string memory);
+
+    /**
+     * @dev Returns the symbol of the token.
+     */
+    function symbol() external view returns (string memory);
+
+    /**
+     * @dev Returns the decimals places of the token.
+     */
+    function decimals() external view returns (uint8);
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts (last updated v4.9.4) (token/ERC20/extensions/IERC20Permit.sol)
+
+pragma solidity ^0.8.0;
+
+/**
+ * @dev Interface of the ERC20 Permit extension allowing approvals to be made via signatures, as defined in
+ * https://eips.ethereum.org/EIPS/eip-2612[EIP-2612].
+ *
+ * Adds the {permit} method, which can be used to change an account's ERC20 allowance (see {IERC20-allowance}) by
+ * presenting a message signed by the account. By not relying on {IERC20-approve}, the token holder account doesn't
+ * need to send a transaction, and thus is not required to hold Ether at all.
+ *
+ * ==== Security Considerations
+ *
+ * There are two important considerations concerning the use of `permit`. The first is that a valid permit signature
+ * expresses an allowance, and it should not be assumed to convey additional meaning. In particular, it should not be
+ * considered as an intention to spend the allowance in any specific way. The second is that because permits have
+ * built-in replay protection and can be submitted by anyone, they can be frontrun. A protocol that uses permits should
+ * take this into consideration and allow a `permit` call to fail. Combining these two aspects, a pattern that may be
+ * generally recommended is:
+ *
+ * ```solidity
+ * function doThingWithPermit(..., uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s) public {
+ *     try token.permit(msg.sender, address(this), value, deadline, v, r, s) {} catch {}
+ *     doThing(..., value);
+ * }
+ *
+ * function doThing(..., uint256 value) public {
+ *     token.safeTransferFrom(msg.sender, address(this), value);
+ *     ...
+ * }
+ * ```
+ *
+ * Observe that: 1) `msg.sender` is used as the owner, leaving no ambiguity as to the signer intent, and 2) the use of
+ * `try/catch` allows the permit to fail and makes the code tolerant to frontrunning. (See also
+ * {SafeERC20-safeTransferFrom}).
+ *
+ * Additionally, note that smart contract wallets (such as Argent or Safe) are not able to produce permit signatures, so
+ * contracts should have entry points that don't rely on permit.
+ */
+interface IERC20PermitUpgradeable {
+    /**
+     * @dev Sets `value` as the allowance of `spender` over ``owner``'s tokens,
+     * given ``owner``'s signed approval.
+     *
+     * IMPORTANT: The same issues {IERC20-approve} has related to transaction
+     * ordering also apply here.
+     *
+     * Emits an {Approval} event.
+     *
+     * Requirements:
+     *
+     * - `spender` cannot be the zero address.
+     * - `deadline` must be a timestamp in the future.
+     * - `v`, `r` and `s` must be a valid `secp256k1` signature from `owner`
+     * over the EIP712-formatted function arguments.
+     * - the signature must use ``owner``'s current nonce (see {nonces}).
+     *
+     * For more information on the signature format, see the
+     * https://eips.ethereum.org/EIPS/eip-2612#specification[relevant EIP
+     * section].
+     *
+     * CAUTION: See Security Considerations above.
+     */
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
+    /**
+     * @dev Returns the current nonce for `owner`. This value must be
+     * included whenever a signature is generated for {permit}.
+     *
+     * Every successful call to {permit} increases ``owner``'s nonce by one. This
+     * prevents a signature from being used multiple times.
+     */
+    function nonces(address owner) external view returns (uint256);
+
+    /**
+     * @dev Returns the domain separator used in the encoding of the signature for {permit}, as defined by {EIP712}.
+     */
+    // solhint-disable-next-line func-name-mixedcase
+    function DOMAIN_SEPARATOR() external view returns (bytes32);
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts (last updated v4.9.0) (token/ERC20/IERC20.sol)
+
+pragma solidity ^0.8.0;
+
+/**
+ * @dev Interface of the ERC20 standard as defined in the EIP.
+ */
+interface IERC20Upgradeable {
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
+     * @dev Returns the amount of tokens in existence.
+     */
+    function totalSupply() external view returns (uint256);
+
+    /**
+     * @dev Returns the amount of tokens owned by `account`.
+     */
+    function balanceOf(address account) external view returns (uint256);
+
+    /**
+     * @dev Moves `amount` tokens from the caller's account to `to`.
+     *
+     * Returns a boolean value indicating whether the operation succeeded.
+     *
+     * Emits a {Transfer} event.
+     */
+    function transfer(address to, uint256 amount) external returns (bool);
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
+     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
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
+    function approve(address spender, uint256 amount) external returns (bool);
+
+    /**
+     * @dev Moves `amount` tokens from `from` to `to` using the
+     * allowance mechanism. `amount` is then deducted from the caller's
+     * allowance.
+     *
+     * Returns a boolean value indicating whether the operation succeeded.
+     *
+     * Emits a {Transfer} event.
+     */
+    function transferFrom(address from, address to, uint256 amount) external returns (bool);
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts (last updated v4.9.3) (token/ERC20/utils/SafeERC20.sol)
+
+pragma solidity ^0.8.0;
+
+import "../IERC20Upgradeable.sol";
+import "../extensions/IERC20PermitUpgradeable.sol";
+import "../../../utils/AddressUpgradeable.sol";
+
+/**
+ * @title SafeERC20
+ * @dev Wrappers around ERC20 operations that throw on failure (when the token
+ * contract returns false). Tokens that return no value (and instead revert or
+ * throw on failure) are also supported, non-reverting calls are assumed to be
+ * successful.
+ * To use this library you can add a `using SafeERC20 for IERC20;` statement to your contract,
+ * which allows you to call the safe operations as `token.safeTransfer(...)`, etc.
+ */
+library SafeERC20Upgradeable {
+    using AddressUpgradeable for address;
+
+    /**
+     * @dev Transfer `value` amount of `token` from the calling contract to `to`. If `token` returns no value,
+     * non-reverting calls are assumed to be successful.
+     */
+    function safeTransfer(IERC20Upgradeable token, address to, uint256 value) internal {
+        _callOptionalReturn(token, abi.encodeWithSelector(token.transfer.selector, to, value));
+    }
+
+    /**
+     * @dev Transfer `value` amount of `token` from `from` to `to`, spending the approval given by `from` to the
+     * calling contract. If `token` returns no value, non-reverting calls are assumed to be successful.
+     */
+    function safeTransferFrom(IERC20Upgradeable token, address from, address to, uint256 value) internal {
+        _callOptionalReturn(token, abi.encodeWithSelector(token.transferFrom.selector, from, to, value));
+    }
+
+    /**
+     * @dev Deprecated. This function has issues similar to the ones found in
+     * {IERC20-approve}, and its usage is discouraged.
+     *
+     * Whenever possible, use {safeIncreaseAllowance} and
+     * {safeDecreaseAllowance} instead.
+     */
+    function safeApprove(IERC20Upgradeable token, address spender, uint256 value) internal {
+        // safeApprove should only be called when setting an initial allowance,
+        // or when resetting it to zero. To increase and decrease it, use
+        // 'safeIncreaseAllowance' and 'safeDecreaseAllowance'
+        require(
+            (value == 0) || (token.allowance(address(this), spender) == 0),
+            "SafeERC20: approve from non-zero to non-zero allowance"
+        );
+        _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, value));
+    }
+
+    /**
+     * @dev Increase the calling contract's allowance toward `spender` by `value`. If `token` returns no value,
+     * non-reverting calls are assumed to be successful.
+     */
+    function safeIncreaseAllowance(IERC20Upgradeable token, address spender, uint256 value) internal {
+        uint256 oldAllowance = token.allowance(address(this), spender);
+        _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, oldAllowance + value));
+    }
+
+    /**
+     * @dev Decrease the calling contract's allowance toward `spender` by `value`. If `token` returns no value,
+     * non-reverting calls are assumed to be successful.
+     */
+    function safeDecreaseAllowance(IERC20Upgradeable token, address spender, uint256 value) internal {
+        unchecked {
+            uint256 oldAllowance = token.allowance(address(this), spender);
+            require(oldAllowance >= value, "SafeERC20: decreased allowance below zero");
+            _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, oldAllowance - value));
+        }
+    }
+
+    /**
+     * @dev Set the calling contract's allowance toward `spender` to `value`. If `token` returns no value,
+     * non-reverting calls are assumed to be successful. Meant to be used with tokens that require the approval
+     * to be set to zero before setting it to a non-zero value, such as USDT.
+     */
+    function forceApprove(IERC20Upgradeable token, address spender, uint256 value) internal {
+        bytes memory approvalCall = abi.encodeWithSelector(token.approve.selector, spender, value);
+
+        if (!_callOptionalReturnBool(token, approvalCall)) {
+            _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, 0));
+            _callOptionalReturn(token, approvalCall);
+        }
+    }
+
+    /**
+     * @dev Use a ERC-2612 signature to set the `owner` approval toward `spender` on `token`.
+     * Revert on invalid signature.
+     */
+    function safePermit(
+        IERC20PermitUpgradeable token,
+        address owner,
+        address spender,
+        uint256 value,
+        uint256 deadline,
+        uint8 v,
+        bytes32 r,
+        bytes32 s
+    ) internal {
+        uint256 nonceBefore = token.nonces(owner);
+        token.permit(owner, spender, value, deadline, v, r, s);
+        uint256 nonceAfter = token.nonces(owner);
+        require(nonceAfter == nonceBefore + 1, "SafeERC20: permit did not succeed");
+    }
+
+    /**
+     * @dev Imitates a Solidity high-level call (i.e. a regular function call to a contract), relaxing the requirement
+     * on the return value: the return value is optional (but if data is returned, it must not be false).
+     * @param token The token targeted by the call.
+     * @param data The call data (encoded using abi.encode or one of its variants).
+     */
+    function _callOptionalReturn(IERC20Upgradeable token, bytes memory data) private {
+        // We need to perform a low level call here, to bypass Solidity's return data size checking mechanism, since
+        // we're implementing it ourselves. We use {Address-functionCall} to perform this call, which verifies that
+     
[truncated — full diff is 285,513 bytes]
> ```

> </details>

> <details>
> <summary>📝 Source diff — upgrade #9 (<code>0x9579...33c4</code> → <code>0x3374...cE01</code>): +3292/-15791 lines (truncated)</summary>

> ```diff
--- old_impl
+++ new_impl
@@ -1,12 +1,12 @@
 // SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v4.9.0) (access/AccessControl.sol)
-
-pragma solidity ^0.8.0;
-
-import "./IAccessControlUpgradeable.sol";
-import "../utils/ContextUpgradeable.sol";
-import "../utils/StringsUpgradeable.sol";
-import "../utils/introspection/ERC165Upgradeable.sol";
+// OpenZeppelin Contracts (last updated v5.4.0) (access/AccessControl.sol)
+
+pragma solidity ^0.8.20;
+
+import {IAccessControl} from "@openzeppelin/contracts/access/IAccessControl.sol";
+import {ContextUpgradeable} from "../utils/ContextUpgradeable.sol";
+import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
+import {ERC165Upgradeable} from "../utils/introspection/ERC165Upgradeable.sol";
 import {Initializable} from "../proxy/utils/Initializable.sol";
 
 /**
@@ -48,25 +48,32 @@
  * accounts that have been granted it. We recommend using {AccessControlDefaultAdminRules}
  * to enforce additional security measures for this role.
  */
-abstract contract AccessControlUpgradeable is Initializable, ContextUpgradeable, IAccessControlUpgradeable, ERC165Upgradeable {
+abstract contract AccessControlUpgradeable is Initializable, ContextUpgradeable, IAccessControl, ERC165Upgradeable {
     struct RoleData {
-        mapping(address => bool) members;
+        mapping(address account => bool) hasRole;
         bytes32 adminRole;
     }
 
-    mapping(bytes32 => RoleData) private _roles;
-
     bytes32 public constant DEFAULT_ADMIN_ROLE = 0x00;
 
+
+    /// @custom:storage-location erc7201:openzeppelin.storage.AccessControl
+    struct AccessControlStorage {
+        mapping(bytes32 role => RoleData) _roles;
+    }
+
+    // keccak256(abi.encode(uint256(keccak256("openzeppelin.storage.AccessControl")) - 1)) & ~bytes32(uint256(0xff))
+    bytes32 private constant AccessControlStorageLocation = 0x02dd7bc7dec4dceedda775e58dd541e08a116c6c53815c0bd028192f7b626800;
+
+    function _getAccessControlStorage() private pure returns (AccessControlStorage storage $) {
+        assembly {
+            $.slot := AccessControlStorageLocation
+        }
+    }
+
     /**
      * @dev Modifier that checks that an account has a specific role. Reverts
-     * with a standardized message including the required role.
-     *
-     * The format of the revert reason is given by the following regular expression:
-     *
-     *  /^AccessControl: account (0x[0-9a-f]{40}) is missing role (0x[0-9a-f]{64})$/
-     *
-     * _Available since v4.1._
+     * with an {AccessControlUnauthorizedAccount} error including the required role.
      */
     modifier onlyRole(bytes32 role) {
         _checkRole(role);
@@ -78,51 +85,34 @@
 
     function __AccessControl_init_unchained() internal onlyInitializing {
     }
-    /**
-     * @dev See {IERC165-supportsInterface}.
-     */
+    /// @inheritdoc IERC165
     function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
-        return interfaceId == type(IAccessControlUpgradeable).interfaceId || super.supportsInterface(interfaceId);
+        return interfaceId == type(IAccessControl).interfaceId || super.supportsInterface(interfaceId);
     }
 
     /**
      * @dev Returns `true` if `account` has been granted `role`.
      */
-    function hasRole(bytes32 role, address account) public view virtual override returns (bool) {
-        return _roles[role].members[account];
-    }
-
-    /**
-     * @dev Revert with a standard message if `_msgSender()` is missing `role`.
-     * Overriding this function changes the behavior of the {onlyRole} modifier.
-     *
-     * Format of the revert message is described in {_checkRole}.
-     *
-     * _Available since v4.6._
+    function hasRole(bytes32 role, address account) public view virtual returns (bool) {
+        AccessControlStorage storage $ = _getAccessControlStorage();
+        return $._roles[role].hasRole[account];
+    }
+
+    /**
+     * @dev Reverts with an {AccessControlUnauthorizedAccount} error if `_msgSender()`
+     * is missing `role`. Overriding this function changes the behavior of the {onlyRole} modifier.
      */
     function _checkRole(bytes32 role) internal view virtual {
         _checkRole(role, _msgSender());
     }
 
     /**
-     * @dev Revert with a standard message if `account` is missing `role`.
-     *
-     * The format of the revert reason is given by the following regular expression:
-     *
-     *  /^AccessControl: account (0x[0-9a-f]{40}) is missing role (0x[0-9a-f]{64})$/
+     * @dev Reverts with an {AccessControlUnauthorizedAccount} error if `account`
+     * is missing `role`.
      */
     function _checkRole(bytes32 role, address account) internal view virtual {
         if (!hasRole(role, account)) {
-            revert(
-                string(
-                    abi.encodePacked(
-                        "AccessControl: account ",
-                        StringsUpgradeable.toHexString(account),
-                        " is missing role ",
-                        StringsUpgradeable.toHexString(uint256(role), 32)
-                    )
-                )
-            );
+            revert AccessControlUnauthorizedAccount(account, role);
         }
     }
 
@@ -132,8 +122,9 @@
      *
      * To change a role's admin, use {_setRoleAdmin}.
      */
-    function getRoleAdmin(bytes32 role) public view virtual override returns (bytes32) {
-        return _roles[role].adminRole;
+    function getRoleAdmin(bytes32 role) public view virtual returns (bytes32) {
+        AccessControlStorage storage $ = _getAccessControlStorage();
+        return $._roles[role].adminRole;
     }
 
     /**
@@ -148,7 +139,7 @@
      *
      * May emit a {RoleGranted} event.
      */
-    function grantRole(bytes32 role, address account) public virtual override onlyRole(getRoleAdmin(role)) {
+    function grantRole(bytes32 role, address account) public virtual onlyRole(getRoleAdmin(role)) {
         _grantRole(role, account);
     }
 
@@ -163,7 +154,7 @@
      *
      * May emit a {RoleRevoked} event.
      */
-    function revokeRole(bytes32 role, address account) public virtual override onlyRole(getRoleAdmin(role)) {
+    function revokeRole(bytes32 role, address account) public virtual onlyRole(getRoleAdmin(role)) {
         _revokeRole(role, account);
     }
 
@@ -179,214 +170,72 @@
      *
      * Requirements:
      *
-     * - the caller must be `account`.
+     * - the caller must be `callerConfirmation`.
      *
      * May emit a {RoleRevoked} event.
      */
-    function renounceRole(bytes32 role, address account) public virtual override {
-        require(account == _msgSender(), "AccessControl: can only renounce roles for self");
-
-        _revokeRole(role, account);
-    }
-
-    /**
-     * @dev Grants `role` to `account`.
-     *
-     * If `account` had not been already granted `role`, emits a {RoleGranted}
-     * event. Note that unlike {grantRole}, this function doesn't perform any
-     * checks on the calling account.
+    function renounceRole(bytes32 role, address callerConfirmation) public virtual {
+        if (callerConfirmation != _msgSender()) {
+            revert AccessControlBadConfirmation();
+        }
+
+        _revokeRole(role, callerConfirmation);
+    }
+
+    /**
+     * @dev Sets `adminRole` as ``role``'s admin role.
+     *
+     * Emits a {RoleAdminChanged} event.
+     */
+    function _setRoleAdmin(bytes32 role, bytes32 adminRole) internal virtual {
+        AccessControlStorage storage $ = _getAccessControlStorage();
+        bytes32 previousAdminRole = getRoleAdmin(role);
+        $._roles[role].adminRole = adminRole;
+        emit RoleAdminChanged(role, previousAdminRole, adminRole);
+    }
+
+    /**
+     * @dev Attempts to grant `role` to `account` and returns a boolean indicating if `role` was granted.
+     *
+     * Internal function without access restriction.
      *
      * May emit a {RoleGranted} event.
-     *
-     * [WARNING]
-     * ====
-     * This function should only be called from the constructor when setting
-     * up the initial roles for the system.
-     *
-     * Using this function in any other way is effectively circumventing the admin
-     * system imposed by {AccessControl}.
-     * ====
-     *
-     * NOTE: This function is deprecated in favor of {_grantRole}.
-     */
-    function _setupRole(bytes32 role, address account) internal virtual {
-        _grantRole(role, account);
-    }
-
-    /**
-     * @dev Sets `adminRole` as ``role``'s admin role.
-     *
-     * Emits a {RoleAdminChanged} event.
-     */
-    function _setRoleAdmin(bytes32 role, bytes32 adminRole) internal virtual {
-        bytes32 previousAdminRole = getRoleAdmin(role);
-        _roles[role].adminRole = adminRole;
-        emit RoleAdminChanged(role, previousAdminRole, adminRole);
-    }
-
-    /**
-     * @dev Grants `role` to `account`.
+     */
+    function _grantRole(bytes32 role, address account) internal virtual returns (bool) {
+        AccessControlStorage storage $ = _getAccessControlStorage();
+        if (!hasRole(role, account)) {
+            $._roles[role].hasRole[account] = true;
+            emit RoleGranted(role, account, _msgSender());
+            return true;
+        } else {
+            return false;
+        }
+    }
+
+    /**
+     * @dev Attempts to revoke `role` from `account` and returns a boolean indicating if `role` was revoked.
      *
      * Internal function without access restriction.
      *
-     * May emit a {RoleGranted} event.
-     */
-    function _grantRole(bytes32 role, address account) internal virtual {
-        if (!hasRole(role, account)) {
-            _roles[role].members[account] = true;
-            emit RoleGranted(role, account, _msgSender());
-        }
-    }
-
-    /**
-     * @dev Revokes `role` from `account`.
-     *
-     * Internal function without access restriction.
-     *
      * May emit a {RoleRevoked} event.
      */
-    function _revokeRole(bytes32 role, address account) internal virtual {
+    function _revokeRole(bytes32 role, address account) internal virtual returns (bool) {
+        AccessControlStorage storage $ = _getAccessControlStorage();
         if (hasRole(role, account)) {
-            _roles[role].members[account] = false;
+            $._roles[role].hasRole[account] = false;
             emit RoleRevoked(role, account, _msgSender());
-        }
-    }
-
-    /**
-     * @dev This empty reserved space is put in place to allow future versions to add new
-     * variables without shifting down storage in the inheritance chain.
-     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
-     */
-    uint256[49] private __gap;
+            return true;
+        } else {
+            return false;
+        }
+    }
 }
 
 
 // SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts v4.4.1 (access/IAccessControl.sol)
-
-pragma solidity ^0.8.0;
-
-/**
- * @dev External interface of AccessControl declared to support ERC165 detection.
- */
-interface IAccessControlUpgradeable {
-    /**
-     * @dev Emitted when `newAdminRole` is set as ``role``'s admin role, replacing `previousAdminRole`
-     *
-     * `DEFAULT_ADMIN_ROLE` is the starting admin for all roles, despite
-     * {RoleAdminChanged} not being emitted signaling this.
-     *
-     * _Available since v3.1._
-     */
-    event RoleAdminChanged(bytes32 indexed role, bytes32 indexed previousAdminRole, bytes32 indexed newAdminRole);
-
-    /**
-     * @dev Emitted when `account` is granted `role`.
-     *
-     * `sender` is the account that originated the contract call, an admin role
-     * bearer except when using {AccessControl-_setupRole}.
-     */
-    event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender);
-
-    /**
-     * @dev Emitted when `account` is revoked `role`.
-     *
-     * `sender` is the account that originated the contract call:
-     *   - if using `revokeRole`, it is the admin role bearer
-     *   - if using `renounceRole`, it is the role bearer (i.e. `account`)
-     */
-    event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender);
-
-    /**
-     * @dev Returns `true` if `account` has been granted `role`.
-     */
-    function hasRole(bytes32 role, address account) external view returns (bool);
-
-    /**
-     * @dev Returns the admin role that controls `role`. See {grantRole} and
-     * {revokeRole}.
-     *
-     * To change a role's admin, use {AccessControl-_setRoleAdmin}.
-     */
-    function getRoleAdmin(bytes32 role) external view returns (bytes32);
-
-    /**
-     * @dev Grants `role` to `account`.
-     *
-     * If `account` had not been already granted `role`, emits a {RoleGranted}
-     * event.
-     *
-     * Requirements:
-     *
-     * - the caller must have ``role``'s admin role.
-     */
-    function grantRole(bytes32 role, address account) external;
-
-    /**
-     * @dev Revokes `role` from `account`.
-     *
-     * If `account` had been granted `role`, emits a {RoleRevoked} event.
-     *
-     * Requirements:
-     *
-     * - the caller must have ``role``'s admin role.
-     */
-    function revokeRole(bytes32 role, address account) external;
-
-    /**
-     * @dev Revokes `role` from the calling account.
-     *
-     * Roles are often managed via {grantRole} and {revokeRole}: this function's
-     * purpose is to provide a mechanism for accounts to lose their privileges
-     * if they are compromised (such as when a trusted device is misplaced).
-     *
-     * If the calling account had been granted `role`, emits a {RoleRevoked}
-     * event.
-     *
-     * Requirements:
-     *
-     * - the caller must be `account`.
-     */
-    function renounceRole(bytes32 role, address account) external;
-}
-
-
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v4.9.0) (interfaces/IERC5267.sol)
-
-pragma solidity ^0.8.0;
-
-interface IERC5267Upgradeable {
-    /**
-     * @dev MAY be emitted to signal that the domain could have changed.
-     */
-    event EIP712DomainChanged();
-
-    /**
-     * @dev returns the fields and values that describe the domain separator used by this contract for EIP-712
-     * signature.
-     */
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
-}
-
-
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v4.9.0) (proxy/utils/Initializable.sol)
-
-pragma solidity ^0.8.2;
-
-import "../../utils/AddressUpgradeable.sol";
+// OpenZeppelin Contracts (last updated v5.3.0) (proxy/utils/Initializable.sol)
+
+pragma solidity ^0.8.20;
 
 /**
  * @dev This is a base contract to aid in writing upgradeable contracts, or any kind of contract that will be deployed
@@ -440,2928 +289,6 @@
  */
 abstract contract Initializable {
     /**
-     * @dev Indicates that the contract has been initialized.
-     * @custom:oz-retyped-from bool
-     */
-    uint8 private _initialized;
-
-    /**
-     * @dev Indicates that the contract is in the process of being initialized.
-     */
-    bool private _initializing;
-
-    /**
-     * @dev Triggered when the contract has been initialized or reinitialized.
-     */
-    event Initialized(uint8 version);
-
-    /**
-     * @dev A modifier that defines a protected initializer function that can be invoked at most once. In its scope,
-     * `onlyInitializing` functions can be used to initialize parent contracts.
-     *
-     * Similar to `reinitializer(1)`, except that functions marked with `initializer` can be nested in the context of a
-     * constructor.
-     *
-     * Emits an {Initialized} event.
-     */
-    modifier initializer() {
-        bool isTopLevelCall = !_initializing;
-        require(
-            (isTopLevelCall && _initialized < 1) || (!AddressUpgradeable.isContract(address(this)) && _initialized == 1),
-            "Initializable: contract is already initialized"
-        );
-        _initialized = 1;
-        if (isTopLevelCall) {
-            _initializing = true;
-        }
-        _;
-        if (isTopLevelCall) {
-            _initializing = false;
-            emit Initialized(1);
-        }
-    }
-
-    /**
-     * @dev A modifier that defines a protected reinitializer function that can be invoked at most once, and only if the
-     * contract hasn't been initialized to a greater version before. In its scope, `onlyInitializing` functions can be
-     * used to initialize parent contracts.
-     *
-     * A reinitializer may be used after the original initialization step. This is essential to configure modules that
-     * are added through upgrades and that require initialization.
-     *
-     * When `version` is 1, this modifier is similar to `initializer`, except that functions marked with `reinitializer`
-     * cannot be nested. If one is invoked in the context of another, execution will revert.
-     *
-     * Note that versions can jump in increments greater than 1; this implies that if multiple reinitializers coexist in
-     * a contract, executing them in the right order is up to the developer or operator.
-     *
-     * WARNING: setting the version to 255 will prevent any future reinitialization.
-     *
-     * Emits an {Initialized} event.
-     */
-    modifier reinitializer(uint8 version) {
-        require(!_initializing && _initialized < version, "Initializable: contract is already initialized");
-        _initialized = version;
-        _initializing = true;
-        _;
-        _initializing = false;
-        emit Initialized(version);
-    }
-
-    /**
-     * @dev Modifier to protect an initialization function so that it can only be invoked by functions with the
-     * {initializer} and {reinitializer} modifiers, directly or indirectly.
-     */
-    modifier onlyInitializing() {
-        require(_initializing, "Initializable: contract is not initializing");
-        _;
-    }
-
-    /**
-     * @dev Locks the contract, preventing any future reinitialization. This cannot be part of an initializer call.
-     * Calling this in the constructor of a contract will prevent that contract from being initialized or reinitialized
-     * to any version. It is recommended to use this to lock implementation contracts that are designed to be called
-     * through proxies.
-     *
-     * Emits an {Initialized} event the first time it is successfully executed.
-     */
-    function _disableInitializers() internal virtual {
-        require(!_initializing, "Initializable: contract is initializing");
-        if (_initialized != type(uint8).max) {
-            _initialized = type(uint8).max;
-            emit Initialized(type(uint8).max);
-        }
-    }
-
-    /**
-     * @dev Returns the highest version that has been initialized. See {reinitializer}.
-     */
-    function _getInitializedVersion() internal view returns (uint8) {
-        return _initialized;
-    }
-
-    /**
-     * @dev Returns `true` if the contract is currently initializing. See {onlyInitializing}.
-     */
-    function _isInitializing() internal view returns (bool) {
-        return _initializing;
-    }
-}
-
-
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v4.9.0) (token/ERC20/ERC20.sol)
-
-pragma solidity ^0.8.0;
-
-import "./IERC20Upgradeable.sol";
-import "./extensions/IERC20MetadataUpgradeable.sol";
-import "../../utils/ContextUpgradeable.sol";
-import {Initializable} from "../../proxy/utils/Initializable.sol";
-
-/**
- * @dev Implementation of the {IERC20} interface.
- *
- * This implementation is agnostic to the way tokens are created. This means
- * that a supply mechanism has to be added in a derived contract using {_mint}.
- * For a generic mechanism see {ERC20PresetMinterPauser}.
- *
- * TIP: For a detailed writeup see our guide
- * https://forum.openzeppelin.com/t/how-to-implement-erc20-supply-mechanisms/226[How
- * to implement supply mechanisms].
- *
- * The default value of {decimals} is 18. To change this, you should override
- * this function so it returns a different value.
- *
- * We have followed general OpenZeppelin Contracts guidelines: functions revert
- * instead returning `false` on failure. This behavior is nonetheless
- * conventional and does not conflict with the expectations of ERC20
- * applications.
- *
- * Additionally, an {Approval} event is emitted on calls to {transferFrom}.
- * This allows applications to reconstruct the allowance for all accounts just
- * by listening to said events. Other implementations of the EIP may not emit
- * these events, as it isn't required by the specification.
- *
- * Finally, the non-standard {decreaseAllowance} and {increaseAllowance}
- * functions have been added to mitigate the well-known issues around setting
- * allowances. See {IERC20-approve}.
- */
-contract ERC20Upgradeable is Initializable, ContextUpgradeable, IERC20Upgradeable, IERC20MetadataUpgradeable {
-    mapping(address => uint256) private _balances;
-
-    mapping(address => mapping(address => uint256)) private _allowances;
-
-    uint256 private _totalSupply;
-
-    string private _name;
-    string private _symbol;
-
-    /**
-     * @dev Sets the values for {name} and {symbol}.
-     *
-     * All two of these values are immutable: they can only be set once during
-     * construction.
-     */
-    function __ERC20_init(string memory name_, string memory symbol_) internal onlyInitializing {
-        __ERC20_init_unchained(name_, symbol_);
-    }
-
-    function __ERC20_init_unchained(string memory name_, string memory symbol_) internal onlyInitializing {
-        _name = name_;
-        _symbol = symbol_;
-    }
-
-    /**
-     * @dev Returns the name of the token.
-     */
-    function name() public view virtual override returns (string memory) {
-        return _name;
-    }
-
-    /**
-     * @dev Returns the symbol of the token, usually a shorter version of the
-     * name.
-     */
-    function symbol() public view virtual override returns (string memory) {
-        return _symbol;
-    }
-
-    /**
-     * @dev Returns the number of decimals used to get its user representation.
-     * For example, if `decimals` equals `2`, a balance of `505` tokens should
-     * be displayed to a user as `5.05` (`505 / 10 ** 2`).
-     *
-     * Tokens usually opt for a value of 18, imitating the relationship between
-     * Ether and Wei. This is the default value returned by this function, unless
-     * it's overridden.
-     *
-     * NOTE: This information is only used for _display_ purposes: it in
-     * no way affects any of the arithmetic of the contract, including
-     * {IERC20-balanceOf} and {IERC20-transfer}.
-     */
-    function decimals() public view virtual override returns (uint8) {
-        return 18;
-    }
-
-    /**
-     * @dev See {IERC20-totalSupply}.
-     */
-    function totalSupply() public view virtual override returns (uint256) {
-        return _totalSupply;
-    }
-
-    /**
-     * @dev See {IERC20-balanceOf}.
-     */
-    function balanceOf(address account) public view virtual override returns (uint256) {
-        return _balances[account];
-    }
-
-    /**
-     * @dev See {IERC20-transfer}.
-     *
-     * Requirements:
-     *
-     * - `to` cannot be the zero address.
-     * - the caller must have a balance of at least `amount`.
-     */
-    function transfer(address to, uint256 amount) public virtual override returns (bool) {
-        address owner = _msgSender();
-        _transfer(owner, to, amount);
-        return true;
-    }
-
-    /**
-     * @dev See {IERC20-allowance}.
-     */
-    function allowance(address owner, address spender) public view virtual override returns (uint256) {
-        return _allowances[owner][spender];
-    }
-
-    /**
-     * @dev See {IERC20-approve}.
-     *
-     * NOTE: If `amount` is the maximum `uint256`, the allowance is not updated on
-     * `transferFrom`. This is semantically equivalent to an infinite approval.
-     *
-     * Requirements:
-     *
-     * - `spender` cannot be the zero address.
-     */
-    function approve(address spender, uint256 amount) public virtual override returns (bool) {
-        address owner = _msgSender();
-        _approve(owner, spender, amount);
-        return true;
-    }
-
-    /**
-     * @dev See {IERC20-transferFrom}.
-     *
-     * Emits an {Approval} event indicating the updated allowance. This is not
-     * required by the EIP. See the note at the beginning of {ERC20}.
-     *
-     * NOTE: Does not update the allowance if the current allowance
-     * is the maximum `uint256`.
-     *
-     * Requirements:
-     *
-     * - `from` and `to` cannot be the zero address.
-     * - `from` must have a balance of at least `amount`.
-     * - the caller must have allowance for ``from``'s tokens of at least
-     * `amount`.
-     */
-    function transferFrom(address from, address to, uint256 amount) public virtual override returns (bool) {
-        address spender = _msgSender();
-        _spendAllowance(from, spender, amount);
-        _transfer(from, to, amount);
-        return true;
-    }
-
-    /**
-     * @dev Atomically increases the allowance granted to `spender` by the caller.
-     *
-     * This is an alternative to {approve} that can be used as a mitigation for
-     * problems described in {IERC20-approve}.
-     *
-     * Emits an {Approval} event indicating the updated allowance.
-     *
-     * Requirements:
-     *
-     * - `spender` cannot be the zero address.
-     */
-    function increaseAllowance(address spender, uint256 addedValue) public virtual returns (bool) {
-        address owner = _msgSender();
-        _approve(owner, spender, allowance(owner, spender) + addedValue);
-        return true;
-    }
-
-    /**
-     * @dev Atomically decreases the allowance granted to `spender` by the caller.
-     *
-     * This is an alternative to {approve} that can be used as a mitigation for
-     * problems described in {IERC20-approve}.
-     *
-     * Emits an {Approval} event indicating the updated allowance.
-     *
-     * Requirements:
-     *
-     * - `spender` cannot be the zero address.
-     * - `spender` must have allowance for the caller of at least
-     * `subtractedValue`.
-     */
-    function decreaseAllowance(address spender, uint256 subtractedValue) public virtual returns (bool) {
-        address owner = _msgSender();
-        uint256 currentAllowance = allowance(owner, spender);
-        require(currentAllowance >= subtractedValue, "ERC20: decreased allowance below zero");
-        unchecked {
-            _approve(owner, spender, currentAllowance - subtractedValue);
-        }
-
-        return true;
-    }
-
-    /**
-     * @dev Moves `amount` of tokens from `from` to `to`.
-     *
-     * This internal function is equivalent to {transfer}, and can be used to
-     * e.g. implement automatic token fees, slashing mechanisms, etc.
-     *
-     * Emits a {Transfer} event.
-     *
-     * Requirements:
-     *
-     * - `from` cannot be the zero address.
-     * - `to` cannot be the zero address.
-     * - `from` must have a balance of at least `amount`.
-     */
-    function _transfer(address from, address to, uint256 amount) internal virtual {
-        require(from != address(0), "ERC20: transfer from the zero address");
-        require(to != address(0), "ERC20: transfer to the zero address");
-
-        _beforeTokenTransfer(from, to, amount);
-
-        uint256 fromBalance = _balances[from];
-        require(fromBalance >= amount, "ERC20: transfer amount exceeds balance");
-        unchecked {
-            _balances[from] = fromBalance - amount;
-            // Overflow not possible: the sum of all balances is capped by totalSupply, and the sum is preserved by
-            // decrementing then incrementing.
-            _balances[to] += amount;
-        }
-
-        emit Transfer(from, to, amount);
-
-        _afterTokenTransfer(from, to, amount);
-    }
-
-    /** @dev Creates `amount` tokens and assigns them to `account`, increasing
-     * the total supply.
-     *
-     * Emits a {Transfer} event with `from` set to the zero address.
-     *
-     * Requirements:
-     *
-     * - `account` cannot be the zero address.
-     */
-    function _mint(address account, uint256 amount) internal virtual {
-        require(account != address(0), "ERC20: mint to the zero address");
-
-        _beforeTokenTransfer(address(0), account, amount);
-
-        _totalSupply += amount;
-        unchecked {
-            // Overflow not possible: balance + amount is at most totalSupply + amount, which is checked above.
-            _balances[account] += amount;
-        }
-        emit Transfer(address(0), account, amount);
-
-        _afterTokenTransfer(address(0), account, amount);
-    }
-
-    /**
-     * @dev Destroys `amount` tokens from `account`, reducing the
-     * total supply.
-     *
-     * Emits a {Transfer} event with `to` set to the zero address.
-     *
-     * Requirements:
-     *
-     * - `account` cannot be the zero address.
-     * - `account` must have at least `amount` tokens.
-     */
-    function _burn(address account, uint256 amount) internal virtual {
-        require(account != address(0), "ERC20: burn from the zero address");
-
-        _beforeTokenTransfer(account, address(0), amount);
-
-        uint256 accountBalance = _balances[account];
-        require(accountBalance >= amount, "ERC20: burn amount exceeds balance");
-        unchecked {
-            _balances[account] = accountBalance - amount;
-            // Overflow not possible: amount <= accountBalance <= totalSupply.
-            _totalSupply -= amount;
-        }
-
-        emit Transfer(account, address(0), amount);
-
-        _afterTokenTransfer(account, address(0), amount);
-    }
-
-    /**
-     * @dev Sets `amount` as the allowance of `spender` over the `owner` s tokens.
-     *
-     * This internal function is equivalent to `approve`, and can be used to
-     * e.g. set automatic allowances for certain subsystems, etc.
-     *
-     * Emits an {Approval} event.
-     *
-     * Requirements:
-     *
-     * - `owner` cannot be the zero address.
-     * - `spender` cannot be the zero address.
-     */
-    function _approve(address owner, address spender, uint256 amount) internal virtual {
-        require(owner != address(0), "ERC20: approve from the zero address");
-        require(spender != address(0), "ERC20: approve to the zero address");
-
-        _allowances[owner][spender] = amount;
-        emit Approval(owner, spender, amount);
-    }
-
-    /**
-     * @dev Updates `owner` s allowance for `spender` based on spent `amount`.
-     *
-     * Does not update the allowance amount in case of infinite allowance.
-     * Revert if not enough allowance is available.
-     *
-     * Might emit an {Approval} event.
-     */
-    function _spendAllowance(address owner, address spender, uint256 amount) internal virtual {
-        uint256 currentAllowance = allowance(owner, spender);
-        if (currentAllowance != type(uint256).max) {
-            require(currentAllowance >= amount, "ERC20: insufficient allowance");
-            unchecked {
-                _approve(owner, spender, currentAllowance - amount);
-            }
-        }
-    }
-
-    /**
-     * @dev Hook that is called before any transfer of tokens. This includes
-     * minting and burning.
-     *
-     * Calling conditions:
-     *
-     * - when `from` and `to` are both non-zero, `amount` of ``from``'s tokens
-     * will be transferred to `to`.
-     * - when `from` is zero, `amount` tokens will be minted for `to`.
-     * - when `to` is zero, `amount` of ``from``'s tokens will be burned.
-     * - `from` and `to` are never both zero.
-     *
-     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
-     */
-    function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual {}
-
-    /**
-     * @dev Hook that is called after any transfer of tokens. This includes
-     * minting and burning.
-     *
-     * Calling conditions:
-     *
-     * - when `from` and `to` are both non-zero, `amount` of ``from``'s tokens
-     * has been transferred to `to`.
-     * - when `from` is zero, `amount` tokens have been minted for `to`.
-     * - when `to` is zero, `amount` of ``from``'s tokens have been burned.
-     * - `from` and `to` are never both zero.
-     *
-     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
-     */
-    function _afterTokenTransfer(address from, address to, uint256 amount) internal virtual {}
-
-    /**
-     * @dev This empty reserved space is put in place to allow future versions to add new
-     * variables without shifting down storage in the inheritance chain.
-     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
-     */
-    uint256[45] private __gap;
-}
-
-
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v4.9.4) (token/ERC20/extensions/ERC20Permit.sol)
-
-pragma solidity ^0.8.0;
-
-import "./IERC20PermitUpgradeable.sol";
-import "../ERC20Upgradeable.sol";
-import "../../../utils/cryptography/ECDSAUpgradeable.sol";
-import "../../../utils/cryptography/EIP712Upgradeable.sol";
-import "../../../utils/CountersUpgradeable.sol";
-import {Initializable} from "../../../proxy/utils/Initializable.sol";
-
-/**
- * @dev Implementation of the ERC20 Permit extension allowing approvals to be made via signatures, as defined in
- * https://eips.ethereum.org/EIPS/eip-2612[EIP-2612].
- *
- * Adds the {permit} method, which can be used to change an account's ERC20 allowance (see {IERC20-allowance}) by
- * presenting a message signed by the account. By not relying on `{IERC20-approve}`, the token holder account doesn't
- * need to send a transaction, and thus is not required to hold Ether at all.
- *
- * _Available since v3.4._
- *
- * @custom:storage-size 51
- */
-abstract contract ERC20PermitUpgradeable is Initializable, ERC20Upgradeable, IERC20PermitUpgradeable, EIP712Upgradeable {
-    using CountersUpgradeable for CountersUpgradeable.Counter;
-
-    mapping(address => CountersUpgradeable.Counter) private _nonces;
-
-    // solhint-disable-next-line var-name-mixedcase
-    bytes32 private constant _PERMIT_TYPEHASH =
-        keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)");
-    /**
-     * @dev In previous versions `_PERMIT_TYPEHASH` was declared as `immutable`.
-     * However, to ensure consistency with the upgradeable transpiler, we will continue
-     * to reserve a slot.
-     * @custom:oz-renamed-from _PERMIT_TYPEHASH
-     */
-    // solhint-disable-next-line var-name-mixedcase
-    bytes32 private _PERMIT_TYPEHASH_DEPRECATED_SLOT;
-
-    /**
-     * @dev Initializes the {EIP712} domain separator using the `name` parameter, and setting `version` to `"1"`.
-     *
-     * It's a good idea to use the same `name` that is defined as the ERC20 token name.
-     */
-    function __ERC20Permit_init(string memory name) internal onlyInitializing {
-        __EIP712_init_unchained(name, "1");
-    }
-
-    function __ERC20Permit_init_unchained(string memory) internal onlyInitializing {}
-
-    /**
-     * @inheritdoc IERC20PermitUpgradeable
-     */
-    function permit(
-        address owner,
-        address spender,
-        uint256 value,
-        uint256 deadline,
-        uint8 v,
-        bytes32 r,
-        bytes32 s
-    ) public virtual override {
-        require(block.timestamp <= deadline, "ERC20Permit: expired deadline");
-
-        bytes32 structHash = keccak256(abi.encode(_PERMIT_TYPEHASH, owner, spender, value, _useNonce(owner), deadline));
-
-        bytes32 hash = _hashTypedDataV4(structHash);
-
-        address signer = ECDSAUpgradeable.recover(hash, v, r, s);
-        require(signer == owner, "ERC20Permit: invalid signature");
-
-        _approve(owner, spender, value);
-    }
-
-    /**
-     * @inheritdoc IERC20PermitUpgradeable
-     */
-    function nonces(address owner) public view virtual override returns (uint256) {
-        return _nonces[owner].current();
-    }
-
-    /**
-     * @inheritdoc IERC20PermitUpgradeable
-     */
-    // solhint-disable-next-line func-name-mixedcase
-    function DOMAIN_SEPARATOR() external view override returns (bytes32) {
-        return _domainSeparatorV4();
-    }
-
-    /**
-     * @dev "Consume a nonce": return the current value and increment.
-     *
-     * _Available since v4.1._
-     */
-    function _useNonce(address owner) internal virtual returns (uint256 current) {
-        CountersUpgradeable.Counter storage nonce = _nonces[owner];
-        current = nonce.current();
-        nonce.increment();
-    }
-
-    /**
-     * @dev This empty reserved space is put in place to allow future versions to add new
-     * variables without shifting down storage in the inheritance chain.
-     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
-     */
-    uint256[49] private __gap;
-}
-
-
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts v4.4.1 (token/ERC20/extensions/IERC20Metadata.sol)
-
-pragma solidity ^0.8.0;
-
-import "../IERC20Upgradeable.sol";
-
-/**
- * @dev Interface for the optional metadata functions from the ERC20 standard.
- *
- * _Available since v4.1._
- */
-interface IERC20MetadataUpgradeable is IERC20Upgradeable {
-    /**
-     * @dev Returns the name of the token.
-     */
-    function name() external view returns (string memory);
-
-    /**
-     * @dev Returns the symbol of the token.
-     */
-    function symbol() external view returns (string memory);
-
-    /**
-     * @dev Returns the decimals places of the token.
-     */
-    function decimals() external view returns (uint8);
-}
-
-
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v4.9.4) (token/ERC20/extensions/IERC20Permit.sol)
-
-pragma solidity ^0.8.0;
-
-/**
- * @dev Interface of the ERC20 Permit extension allowing approvals to be made via signatures, as defined in
- * https://eips.ethereum.org/EIPS/eip-2612[EIP-2612].
- *
- * Adds the {permit} method, which can be used to change an account's ERC20 allowance (see {IERC20-allowance}) by
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
-interface IERC20PermitUpgradeable {
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
-// OpenZeppelin Contracts (last updated v4.9.0) (token/ERC20/IERC20.sol)
-
-pragma solidity ^0.8.0;
-
-/**
- * @dev Interface of the ERC20 standard as defined in the EIP.
- */
-interface IERC20Upgradeable {
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
-     * @dev Returns the amount of tokens in existence.
-     */
-    function totalSupply() external view returns (uint256);
-
-    /**
-     * @dev Returns the amount of tokens owned by `account`.
-     */
-    function balanceOf(address account) external view returns (uint256);
-
-    /**
-     * @dev Moves `amount` tokens from the caller's account to `to`.
-     *
-     * Returns a boolean value indicating whether the operation succeeded.
-     *
-     * Emits a {Transfer} event.
-     */
-    function transfer(address to, uint256 amount) external returns (bool);
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
-     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
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
-    function approve(address spender, uint256 amount) external returns (bool);
-
-    /**
-     * @dev Moves `amount` tokens from `from` to `to` using the
-     * allowance mechanism. `amount` is then deducted from the caller's
-     * allowance.
-     *
-     * Returns a boolean value indicating whether the operation succeeded.
-     *
-     * Emits a {Transfer} event.
-     */
-    function transferFrom(address from, address to, uint256 amount) external returns (bool);
-}
-
-
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v4.9.3) (token/ERC20/utils/SafeERC20.sol)
-
-pragma solidity ^0.8.0;
-
-import "../IERC20Upgradeable.sol";
-import "../extensions/IERC20PermitUpgradeable.sol";
-import "../../../utils/AddressUpgradeable.sol";
-
-/**
- * @title SafeERC20
- * @dev Wrappers around ERC20 operations that throw on failure (when the token
- * contract returns false). Tokens that return no value (and instead revert or
- * throw on failure) are also supported, non-reverting calls are assumed to be
- * successful.
- * To use this library you can add a `using SafeERC20 for IERC20;` statement to your contract,
- * which allows you to call the safe operations as `token.safeTransfer(...)`, etc.
- */
-library SafeERC20Upgradeable {
-    using AddressUpgradeable for address;
-
-    /**
-     * @dev Transfer `value` amount of `token` from the calling contract to `to`. If `token` returns no value,
-     * non-reverting calls are assumed to be successful.
-     */
-    function safeTransfer(IERC20Upgradeable token, address to, uint256 value) internal {
-        _callOptionalReturn(token, abi.encodeWithSelector(token.transfer.selector, to, value));
-    }
-
-    /**
-     * @dev Transfer `value` amount of `token` from `from` to `to`, spending the approval given by `from` to the
-     * calling contract. If `token` returns no value, non-reverting calls are assumed to be successful.
-     */
-    function safeTransferFrom(IERC20Upgradeable token, address from, address to, uint256 value) internal {
-        _callOptionalReturn(token, abi.encodeWithSelector(token.transferFrom.selector, from, to, value));
-    }
-
-    /**
-     * @dev Deprecated. This function has issues similar to the ones found in
-     * {IERC20-approve}, and its usage is discouraged.
-     *
-     * Whenever possible, use {safeIncreaseAllowance} and
-     * {safeDecreaseAllowance} instead.
-     */
-    function safeApprove(IERC20Upgradeable token, address spender, uint256 value) internal {
-        // safeApprove should only be called when setting an initial allowance,
-        // or when resetting it to zero. To increase and decrease it, use
-        // 'safeIncreaseAllowance' and 'safeDecreaseAllowance'
-        require(
-            (value == 0) || (token.allowance(address(this), spender) == 0),
-            "SafeERC20: approve from non-zero to non-zero allowance"
-        );
-        _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, value));
-    }
-
-    /**
-     * @dev Increase the calling contract's allowance toward `spender` by `value`. If `token` returns no value,
-     * non-reverting calls are assumed to be successful.
-     */
-    function safeIncreaseAllowance(IERC20Upgradeable token, address spender, uint256 value) internal {
-        uint256 oldAllowance = token.allowance(address(this), spender);
-        _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, oldAllowance + value));
-    }
-
-    /**
-     * @dev Decrease the calling contract's allowance toward `spender` by `value`. If `token` returns no value,
-     * non-reverting calls are assumed to be successful.
-     */
-    function safeDecreaseAllowance(IERC20Upgradeable token, address spender, uint256 value) internal {
-        unchecked {
-            uint256 oldAllowance = token.allowance(address(this), spender);
-            require(oldAllowance >= value, "SafeERC20: decreased allowance below zero");
-            _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, oldAllowance - value));
-        }
-    }
-
-    /**
-     * @dev Set the calling contract's allowance toward `spender` to `value`. If `token` returns no value,
-     * non-reverting calls are assumed to be successful. Meant to be used with tokens that require the approval
-     * to be set to zero before setting it to a non-zero value, such as USDT.
-     */
-    function forceApprove(IERC20Upgradeable token, address spender, uint256 value) internal {
-        bytes memory approvalCall = abi.encodeWithSelector(token.approve.selector, spender, value);
-
-        if (!_callOptionalReturnBool(token, approvalCall)) {
-            _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, 0));
-            _callOptionalReturn(token, approvalCall);
-        }
-    }
-
-    /**
-     * @dev Use a ERC-2612 signature to set the `owner` approval toward `spender` on `token`.
-     * Revert on invalid signature.
-     */
-    function safePermit(
-        IERC20PermitUpgradeable token,
-        address owner,
-        address spender,
-        uint256 value,
-        uint256 deadline,
-        uint8 v,
-        bytes32 r,
-        bytes32 s
-    ) internal {
-        uint256 nonceBefore = token.nonces(owner);
-        token.permit(owner, spender, value, deadline, v, r, s);
-        uint256 nonceAfter = token.nonces(owner);
-        require(nonceAfter == n
[truncated — full diff is 771,316 bytes]
> ```

> </details>

> <details>
> <summary>📝 Source diff — upgrade #10 (<code>0x3374...cE01</code> → <code>0x9CFe...97f9</code>): +7/-1 lines</summary>

> ```diff
--- old_impl
+++ new_impl
@@ -5396,7 +5396,10 @@
   }
 
   /// @inheritdoc IFxUSDBasePool
-  function instantRedeemNoFee(address receiver, uint256 amountSharesToRedeem) external onlyRole(NO_INSTANT_REDEEM_FEE_ROLE) returns (uint256 amountYieldOut, uint256 amountStableOut) {
+  function instantRedeemNoFee(
+    address receiver,
+    uint256 amountSharesToRedeem
+  ) external onlyRole(NO_INSTANT_REDEEM_FEE_ROLE) returns (uint256 amountYieldOut, uint256 amountStableOut) {
     // clear the fee ratio for this function call
     uint256 originalFeeRatio = instantRedeemFeeRatio;
     instantRedeemFeeRatio = 0;
@@ -5633,6 +5636,9 @@
         amountStableToken = ((maxAmount - amountYieldToken) * PRECISION) / op.stablePrice;
       }
     } else {
+      // check if usdc depeg
+      if (op.stablePrice < stableDepegPrice * stableTokenScale) revert ErrorStableTokenDepeg();
+
       // user pays USDC
       uint256 maxAmountInUSD = (maxAmount * op.stablePrice) / PRECISION;
       if (maxAmountInUSD < amountYieldToken) amountYieldToken = maxAmountInUSD;
> ```

> </details>

> 🔒 **Immutable References:** `fxUSDPriceOracle()` → TransparentUpgradeableProxy, `poolManager()` → TransparentUpgradeableProxy, `yieldToken()` → fxUSD (TransparentUpgradeableProxy)

### > 🔴 `upgradeability (TransparentUpgradeable)`

> > ⚠️ **CRITICAL** — Upgradeability allows arbitrary code replacement. Must be behind both a Multisig AND a Timelock.

> **Privileged write functions:**  
> **Capabilities:** ⬆️ **UPGRADE**
> - `upgradeTo(address)` — Upgrade proxy implementation to a new address `[UPGRADE]`
> - `upgradeToAndCall(address,bytes)` — Upgrade proxy implementation and call an initializer `[UPGRADE]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x68863fb8855b04509a835082478D6E3D0bE4E61a` | [↳ TimelockController (3d)](#c-0x68863fb8855b04509a835082478d6e3d0be4e61a) | 🟢 LOW | — | Storage only | 3d delay (⚠ changed 1x) |


> **Delay history for `TimelockController (3d)` (0x6886...E61a):** 3d → 3d

### > 🟢 `DEFAULT_ADMIN_ROLE` 🔄 5 changes

> **Hash:** `0x0000000000000000000000000000000000000000000000000000000000000000`  
> **Managed by:** `DEFAULT_ADMIN_ROLE`  
> **Privileged write functions:**  
> **Capabilities:** ⏸️ **PAUSE**
> - `updateStableDepegPrice(uint256 newPrice)` — Update depeg price for stable token.
> - `updateRedeemCoolDownPeriod(uint256 newPeriod)` — Update redeem cool down period.
> - `updateInstantRedeemFeeRatio(uint256 newRatio)`
> - `kill(address asset)` `[PAUSE]`
> - `alloc(address asset, address strategy, uint96 capacity)`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x68863fb8855b04509a835082478D6E3D0bE4E61a` | [↳ TimelockController (3d)](#c-0x68863fb8855b04509a835082478d6e3d0be4e61a) | 🟢 LOW | 2026-04-20 | Events only · hasRole ✓ | 3d delay (⚠ changed 1x) |

> **🕘 Previous Holders (2)** _(verified inactive — `hasRole`/`is` returned false)_:

> | Address | Name / Type | Granted | Status |
> |---|---|---|---|
> | `0x26B2ec4E02ebe2F54583af25b647b1D619e67BbF` | Gnosis Safe 6/9 | 2025-01-02 | 🕘 HISTORICAL |
> | `0xa1d0027Ca4C0CB79f9403d06A29470abC7b0a468` | EOA | 2025-01-01 | 🕘 HISTORICAL |


> **Delay history for `TimelockController (3d)` (0x6886...E61a):** 3d → 3d

### > 🔴 `NO_INSTANT_REDEEM_FEE_ROLE` 🔄 9 changes

> **Hash:** `0x522a3e82a506d706a025772fecc3caa3af4986c00ba0d31cb2fa5d31b66b296d`  
> **Managed by:** `DEFAULT_ADMIN_ROLE`  
> **Privileged write functions:**  
> **Capabilities:** 💰 **SUPPLY**
> - `instantRedeemNoFee(address receiver, uint256 amountSharesToRedeem)` — Redeem pool shares instantly without withdraw fee. `[SUPPLY]`

> **Members (7):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x26B2ec4E02ebe2F54583af25b647b1D619e67BbF` | [↳ Gnosis Safe 6/9](#c-0x26b2ec4e02ebe2f54583af25b647b1d619e67bbf) | 🟢 LOW | 2025-11-04 | Events only · hasRole ✓ | 6/9 signers |
> | `0x33636D49FbefBE798e15e7F356E8DBef543CC708` | [↳ Diamond](#c-0x33636d49fbefbe798e15e7f356e8dbef543cc708) | 🟠 HIGH | 2025-11-04 | Events only · hasRole ✓ |  |
> | `0x547090EB068220b3Da1F7b611ef21723Caa4121e` | EOA | 🔴 CRITICAL | 2026-10-15 | Events only · hasRole ✓ | ⚠️ Single private key |
> | `0x61b09116D341C6cc45513F29FE3B6C13fE3699A3` | EOA | 🔴 CRITICAL | 2026-10-19 🆕 | Events only · hasRole ✓ | ⚠️ Single private key |
> | `0xA0FB1b11ccA5871fb0225B64308e249B97804E99` | [↳ Gnosis Safe 6/9](#c-0xa0fb1b11cca5871fb0225b64308e249b97804e99) | 🟢 LOW | 2025-11-04 | Events only · hasRole ✓ | 6/9 signers |
> | `0xFC08757c505eA28709dF66E54870fB6dE09f0C5E` | [↳ Gnosis Safe 6/9](#c-0xfc08757c505ea28709df66e54870fb6de09f0c5e) | 🟢 LOW | 2025-11-04 | Events only · hasRole ✓ | 6/9 signers |
> | `0xc40549aa1D05C30af23a1C4a5af6bA11FCAFe23F` | [↳ Gnosis Safe 6/9](#c-0xc40549aa1d05c30af23a1c4a5af6ba11fcafe23f) | 🟢 LOW | 2025-11-04 | Events only · hasRole ✓ | 6/9 signers |

> **🕘 Previous Holders (1)** _(verified inactive — `hasRole`/`is` returned false)_:

> | Address | Name / Type | Granted | Status |
> |---|---|---|---|
> | `0x4Ef75e307f7EDbf0462C679192C1FF7E911c389a` | fxLOOP (LagoonVaultProxy) | 2026-10-15 | 🕘 HISTORICAL |

> **Signers of `Gnosis Safe 6/9` (0x26B2...7BbF):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x38a93e70b0D8343657f802C1c3Fdb06aC8F8fe99` | EOA ⚠️ Hot wallet (4,446 txs) | — | EOA |
> | `0x85DB62FdFA9Ee6050f8b422F74D75D2069dA102B` | EOA | 2025-04-16 | EOA |
> | `0xe3522d85d37F55735e9327CD7a5cDe3abaf28E03` | EOA | — | EOA |
> | `0x74390470F4001Ca85D93bD546A4Ab1724359654B` | EOA | — | EOA |
> | `0xeF0Ca09fbf9a5f61E657Fb208b46b8685c1d4766` | EOA | — | EOA |
> | `0x8EcAB7B8ed8215cA52500cbf1548B9239173ef82` | EOA | — | EOA |
> | `0x18411aB626c9b3B3Dd5b7356574D8ff396436744` | EOA | 2026-08-01 | EOA |
> | `0xcdF067F306E7a511Ef701588AFCdcff292B19282` | EOA | 2023-12-26 | EOA |
> | `0xC8Be49a9b1ca1A1cc654491a7cBbD27aBfA06A81` | EOA | 2026-03-13 | EOA |

> **Signers of `Gnosis Safe 6/9` (0xA0FB...4E99):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x38a93e70b0D8343657f802C1c3Fdb06aC8F8fe99` | EOA ⚠️ Hot wallet (4,446 txs) | — | EOA |
> | `0x8EcAB7B8ed8215cA52500cbf1548B9239173ef82` | EOA | — | EOA |
> | `0xeF0Ca09fbf9a5f61E657Fb208b46b8685c1d4766` | EOA | — | EOA |
> | `0xe3522d85d37F55735e9327CD7a5cDe3abaf28E03` | EOA | — | EOA |
> | `0x85DB62FdFA9Ee6050f8b422F74D75D2069dA102B` | EOA | 2025-04-16 | EOA |
> | `0xcdF067F306E7a511Ef701588AFCdcff292B19282` | EOA | 2023-12-26 | EOA |
> | `0xC8Be49a9b1ca1A1cc654491a7cBbD27aBfA06A81` | EOA | 2026-03-14 | EOA |
> | `0x18411aB626c9b3B3Dd5b7356574D8ff396436744` | EOA | 2026-08-01 | EOA |
> | `0x74390470F4001Ca85D93bD546A4Ab1724359654B` | EOA | — | EOA |

> **Signers of `Gnosis Safe 6/9` (0xFC08...0C5E):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x38a93e70b0D8343657f802C1c3Fdb06aC8F8fe99` | EOA ⚠️ Hot wallet (4,446 txs) | — | EOA |
> | `0x8EcAB7B8ed8215cA52500cbf1548B9239173ef82` | EOA | — | EOA |
> | `0xeF0Ca09fbf9a5f61E657Fb208b46b8685c1d4766` | EOA | — | EOA |
> | `0xe3522d85d37F55735e9327CD7a5cDe3abaf28E03` | EOA | — | EOA |
> | `0x85DB62FdFA9Ee6050f8b422F74D75D2069dA102B` | EOA | 2025-04-16 | EOA |
> | `0xcdF067F306E7a511Ef701588AFCdcff292B19282` | EOA | 2023-12-26 | EOA |
> | `0xC8Be49a9b1ca1A1cc654491a7cBbD27aBfA06A81` | EOA | 2026-03-13 | EOA |
> | `0x18411aB626c9b3B3Dd5b7356574D8ff396436744` | EOA | 2026-07-31 | EOA |
> | `0x74390470F4001Ca85D93bD546A4Ab1724359654B` | EOA | — | EOA |

> **Signers of `Gnosis Safe 6/9` (0xc405...e23F):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x8EcAB7B8ed8215cA52500cbf1548B9239173ef82` | EOA | 2021-09-01 | EOA |
> | `0xeF0Ca09fbf9a5f61E657Fb208b46b8685c1d4766` | EOA | 2021-09-01 | EOA |
> | `0x38a93e70b0D8343657f802C1c3Fdb06aC8F8fe99` | EOA ⚠️ Hot wallet (4,446 txs) | 2021-09-01 | EOA |
> | `0xe3522d85d37F55735e9327CD7a5cDe3abaf28E03` | EOA | 2021-09-01 | EOA |
> | `0x85DB62FdFA9Ee6050f8b422F74D75D2069dA102B` | EOA | 2025-04-16 | EOA |
> | `0xcdF067F306E7a511Ef701588AFCdcff292B19282` | EOA | 2023-12-26 | EOA |
> | `0xC8Be49a9b1ca1A1cc654491a7cBbD27aBfA06A81` | EOA | 2026-03-13 | EOA |
> | `0x18411aB626c9b3B3Dd5b7356574D8ff396436744` | EOA | 2026-08-01 | EOA |
> | `0x74390470F4001Ca85D93bD546A4Ab1724359654B` | EOA | — | EOA |

> **Quorum history:**
>   - 2021-09-01: ⚪ unchanged 6 → 6

### > 🟠 `stableToken()`

> **Privileged write functions:**  
> **Capabilities:** 💰 **SUPPLY**
> - `deposit(address receiver, address tokenIn, uint256 amountTokenToDeposit, uint256 minSharesOut)` — Deposit token. `[SUPPLY]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48` | USDC (FiatTokenProxy) | 🟠 HIGH | — | Storage only |  |

### > 🟢 `ASSET_MANAGER_ROLE`

> **Hash:** `0xb1fadd3142ab2ad7f1337ea4d97112bcc8337fc11ce5b20cb04ad038adf99819`  
> **Managed by:** `DEFAULT_ADMIN_ROLE`  
> **Privileged write functions:**
> - `manage(address asset, uint256 amount)`

> **Members (3):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x26B2ec4E02ebe2F54583af25b647b1D619e67BbF` | [↳ Gnosis Safe 6/9](#c-0x26b2ec4e02ebe2f54583af25b647b1d619e67bbf) | 🟢 LOW | 2025-03-19 | Events only · hasRole ✓ | 6/9 signers |
> | `0x28c921adAC4c1072658eB01a28DA06b5F651eF62` | [↳ Gnosis Safe 3/4](#c-0x28c921adac4c1072658eb01a28da06b5f651ef62) | 🟢 LOW | 2026-04-20 | Events only · hasRole ✓ | 3/4 signers |
> | `0x68863fb8855b04509a835082478D6E3D0bE4E61a` | [↳ TimelockController (3d)](#c-0x68863fb8855b04509a835082478d6e3d0be4e61a) | 🟢 LOW | 2026-04-20 | Events only · hasRole ✓ | 3d delay (⚠ changed 1x) |

> **Signers of `Gnosis Safe 6/9` (0x26B2...7BbF):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x38a93e70b0D8343657f802C1c3Fdb06aC8F8fe99` | EOA ⚠️ Hot wallet (4,446 txs) | — | EOA |
> | `0x85DB62FdFA9Ee6050f8b422F74D75D2069dA102B` | EOA | 2025-04-16 | EOA |
> | `0xe3522d85d37F55735e9327CD7a5cDe3abaf28E03` | EOA | — | EOA |
> | `0x74390470F4001Ca85D93bD546A4Ab1724359654B` | EOA | — | EOA |
> | `0xeF0Ca09fbf9a5f61E657Fb208b46b8685c1d4766` | EOA | — | EOA |
> | `0x8EcAB7B8ed8215cA52500cbf1548B9239173ef82` | EOA | — | EOA |
> | `0x18411aB626c9b3B3Dd5b7356574D8ff396436744` | EOA | 2026-08-01 | EOA |
> | `0xcdF067F306E7a511Ef701588AFCdcff292B19282` | EOA | 2023-12-26 | EOA |
> | `0xC8Be49a9b1ca1A1cc654491a7cBbD27aBfA06A81` | EOA | 2026-03-13 | EOA |

> **Signers of `Gnosis Safe 3/4` (0x28c9...eF62):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x38a93e70b0D8343657f802C1c3Fdb06aC8F8fe99` | EOA ⚠️ Hot wallet (4,446 txs) | — | EOA |
> | `0x85DB62FdFA9Ee6050f8b422F74D75D2069dA102B` | EOA | 2025-05-13 | EOA |
> | `0xe3522d85d37F55735e9327CD7a5cDe3abaf28E03` | EOA | — | EOA |
> | `0x74390470F4001Ca85D93bD546A4Ab1724359654B` | EOA | — | EOA |


> **Delay history for `TimelockController (3d)` (0x6886...E61a):** 3d → 3d

### > 🟠 `pegKeeper()`

> **Privileged write functions:**
> - `arbitrage(address srcToken, uint256 amountIn, address receiver, bytes calldata data)` — Arbitrage between yield token and stable token.

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x50562fe7e870420F5AAe480B7F94EB4ace2fcd70` | [↳ TransparentUpgradeableProxy](#c-0x50562fe7e870420f5aae480b7f94eb4ace2fcd70) | 🟠 HIGH | — | Storage only |  |

> #### 🔧 Permissioned Parameters

> **`instantRedeemFeeRatio`**

> | Field | Value |
> |---|---|
> | Current Value | `10000000000000000 (0.010000e18)` |
> | Setter | `updateInstantRedeemFeeRatio(uint256 newRatio)` |
> | Gated by | `DEFAULT_ADMIN_ROLE` |
> | Tags | — |
> | Last changed | 2026-02-03 |
> | Changed by | `0x26B2...7BbF` (Gnosis Safe 6/9) |
> | Total changes | 3 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `newRatio=10000000000000000 (0.010000e18)` | `0x26B2...7BbF` (Gnosis Safe 6/9) | 2026-02-03 |
> | 2 | `newRatio=500000000000000` | `0x26B2...7BbF` (Gnosis Safe 6/9) | 2026-02-02 |
> | 3 | `newRatio=10000000000000000 (0.010000e18)` | `0x26B2...7BbF` (Gnosis Safe 6/9) | 2025-03-19 |

> **`kill`** *(per-asset)* ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Setter | `kill(address asset)` |
> | Gated by | `DEFAULT_ADMIN_ROLE` |
> | Tags | `PAUSE` |
> | Last called | — |
> | Called by | — |
> | Total calls | 0 ❄️ |

> **`redeemCoolDownPeriod`**

> | Field | Value |
> |---|---|
> | Current Value | `3600` |
> | Setter | `updateRedeemCoolDownPeriod(uint256 newPeriod)` |
> | Gated by | `DEFAULT_ADMIN_ROLE` |
> | Tags | — |
> | Last changed | 2025-06-18 |
> | Changed by | `0x26B2...7BbF` (Gnosis Safe 6/9) |
> | Total changes | 2 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `newPeriod=3600` | `0x26B2...7BbF` (Gnosis Safe 6/9) | 2025-06-18 |
> | 2 | `1800` | `0xa1d0...a468` (EOA) | 2025-01-01 |

> **`stableDepegPrice`**

> | Field | Value |
> |---|---|
> | Current Value | `995000000000000000 (0.995000e18)` |
> | Setter | `updateStableDepegPrice(uint256 newPrice)` |
> | Gated by | `DEFAULT_ADMIN_ROLE` |
> | Tags | — |
> | Last changed | 2025-01-01 |
> | Changed by | `0xa1d0...a468` (EOA) |
> | Total changes | 1 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `995000000000000000 (0.995000e18)` | `0xa1d0...a468` (EOA) | 2025-01-01 |

> #### 💰 Supply Actions

> _Mint / redeem / burn call tracking — last 5 calls per function, total counts preserved._

> **`deposit`** *(per-asset)* 🔄 **ACTIVE** (634 changes)

> > ⚠️ This parameter has been changed **634 times** — monitor for unexpected modifications.

> | Field | Value |
> |---|---|
> | Setter | `deposit(address receiver, address tokenIn, uint256 amountTokenToDeposit, uint256 minSharesOut)` |
> | Gated by | `stableToken()` |
> | Tags | `SUPPLY` |
> | Last called | 2026-11-15 |
> | Called by | `0x18f8...7889` |
> | Total calls | 634 🔄 |

> **Recent changes (showing last 5 of 634):**

> | # | Asset | Value | Set By | Date |
> |---|---|---|---|---|
> | 1 | Diamond | `1979021964345548412829 (1,979.021964e18)` | `0x18f8...7889` | 2026-11-15 |
> | 2 | SY f(x) USD Saving | `3324179495567747547071 (3,324.179496e18)` | `0xB1e6...28dC` | 2026-11-15 |
> | 3 | fxSAVE (TransparentUpgradeableProxy) | `3093422777077804422378 (3,093.422777e18)` | `0x4215...4779` (EOA) | 2026-11-15 |
> | 4 | SY f(x) USD Saving | `830435671681735388210 (830.435672e18)` | `0xF23D...7400` | 2026-11-15 |
> | 5 | fxSAVE (TransparentUpgradeableProxy) | `5258645538586684099308 (5,258.645539e18)` | `0x4215...4779` (EOA) | 2026-11-15 |

> **`instantRedeemNoFee`** *(per-asset)* 🔄 **ACTIVE** (443 changes)

> > ⚠️ This parameter has been changed **443 times** — monitor for unexpected modifications.

> | Field | Value |
> |---|---|
> | Setter | `instantRedeemNoFee(address receiver, uint256 amountSharesToRedeem)` |
> | Gated by | `NO_INSTANT_REDEEM_FEE_ROLE` |
> | Tags | `SUPPLY` |
> | Last called | 2026-11-15 |
> | Called by | `0x6506...Dd50` |
> | Total calls | 443 🔄 |

> **Recent changes (showing last 5 of 443):**

> | # | Asset | Value | Set By | Date |
> |---|---|---|---|---|
> | 1 | GnosisSafeProxy | `14496700684` | `0x6506...Dd50` | 2026-11-15 |
> | 2 | Diamond | `30960629` | `0xA844...fc25` | 2026-11-14 |
> | 3 | EOA | `15079064` | `0xbEa8...3895` | 2026-11-10 |
> | 4 | EOA | `1795242` | `0x0494...a00f` | 2026-11-10 |
> | 5 | Gnosis Safe 6/9 | `amountSharesToRedeem=72655191728407816940124 (72,655.191728e18)` | `0xc405...e23F` (Gnosis Safe 6/9) | 2026-11-09 |

---
<a id="c-0xed92dde3214c24ae04f5f96927e3be8f8dbc3289"></a>
## > SharedLiquidityGauge `0xEd92dDe3214c24Ae04F5f96927E3bE8f8DbC3289`

> *10 roles · 8 members · 8 functions*

> > ⚠️ **Upgradeable** (TransparentUpgradeable) — impl: `0xF62F458D2F6dd2AD074E715655064d7632e136D6`

> **Proxy History (6 events):**

> | # | Date | Event | Address | Key Changes | Tx |
> |---|---|---|---|---|---|
> | 1 | 2025-01-01 | Upgrade | `0xF62F...36D6` | Initial deployment | [0x794ab27b5ab8f2410aa90b956f8833403423934024cc12cb8389757d38fdbeff](https://etherscan.io/tx/0x794ab27b5ab8f2410aa90b956f8833403423934024cc12cb8389757d38fdbeff) |
> | 2 | 2025-01-01 | Admin Changed | `0x9B54...DDA4` | Previous: `0x0000...0000` | [0x794ab27b5ab8f2410aa90b956f8833403423934024cc12cb8389757d38fdbeff](https://etherscan.io/tx/0x794ab27b5ab8f2410aa90b956f8833403423934024cc12cb8389757d38fdbeff) |
> | 3 | 2025-01-02 | Upgrade | `0x9f92...9fD9` | -19 fn; removed `DEFAULT_ADMIN_ROLE()`; removed `REWARD_MANAGER_ROLE()`; removed `approve(address,uint256)`; removed `getRoleAdmin(bytes32)`; removed `getStakerVoteOwner(address)`; removed `grantRole(bytes32,address)`; removed `hasRole(bytes32,address)`; removed `initialize(address)`; removed `minter()`; removed `permit(address,address,uint256,uint256,uint8,bytes32,bytes32)`; removed `registerRewardToken(address,address)`; removed `renounceRole(bytes32,address)`; removed `revokeRole(bytes32,address)`; removed `transfer(address,uint256)`; removed `transferFrom(address,address,uint256)`; removed `unregisterRewardToken(address)`; removed `veProxy()`; removed `withdraw(uint256)`; removed `withdraw(uint256,address)`; 📝 src +15/-6346 | [0x3c970fa009a04b2f984e5ea47a45cc185013c9ed3044ea29675a2955a3b0a1d1](https://etherscan.io/tx/0x3c970fa009a04b2f984e5ea47a45cc185013c9ed3044ea29675a2955a3b0a1d1) |
> | 4 | 2025-01-02 | Upgrade | `0xF62F...36D6` | +19 fn; added `DEFAULT_ADMIN_ROLE()`; added `REWARD_MANAGER_ROLE()`; added `approve(address,uint256)`; added `getRoleAdmin(bytes32)`; added `getStakerVoteOwner(address)`; added `grantRole(bytes32,address)`; added `hasRole(bytes32,address)`; added `initialize(address)`; added `minter()`; added `permit(address,address,uint256,uint256,uint8,bytes32,bytes32)`; added `registerRewardToken(address,address)`; added `renounceRole(bytes32,address)`; added `revokeRole(bytes32,address)`; added `transfer(address,uint256)`; added `transferFrom(address,address,uint256)`; added `unregisterRewardToken(address)`; added `veProxy()`; added `withdraw(uint256)`; added `withdraw(uint256,address)`; 📝 src +6350/-19 | [0x3c970fa009a04b2f984e5ea47a45cc185013c9ed3044ea29675a2955a3b0a1d1](https://etherscan.io/tx/0x3c970fa009a04b2f984e5ea47a45cc185013c9ed3044ea29675a2955a3b0a1d1) |
> | 5 | 2025-03-19 | Upgrade | `0x9f92...9fD9` | -19 fn; removed `DEFAULT_ADMIN_ROLE()`; removed `REWARD_MANAGER_ROLE()`; removed `approve(address,uint256)`; removed `getRoleAdmin(bytes32)`; removed `getStakerVoteOwner(address)`; removed `grantRole(bytes32,address)`; removed `hasRole(bytes32,address)`; removed `initialize(address)`; removed `minter()`; removed `permit(address,address,uint256,uint256,uint8,bytes32,bytes32)`; removed `registerRewardToken(address,address)`; removed `renounceRole(bytes32,address)`; removed `revokeRole(bytes32,address)`; removed `transfer(address,uint256)`; removed `transferFrom(address,address,uint256)`; removed `unregisterRewardToken(address)`; removed `veProxy()`; removed `withdraw(uint256)`; removed `withdraw(uint256,address)`; 📝 src +15/-6346 | [0x5b4c4027b6329f5f41c6d9e867b0960c2876f20308d615ea442480ecdd017319](https://etherscan.io/tx/0x5b4c4027b6329f5f41c6d9e867b0960c2876f20308d615ea442480ecdd017319) |
> | 6 | 2025-03-19 | Upgrade | `0xF62F...36D6` | +19 fn; added `DEFAULT_ADMIN_ROLE()`; added `REWARD_MANAGER_ROLE()`; added `approve(address,uint256)`; added `getRoleAdmin(bytes32)`; added `getStakerVoteOwner(address)`; added `grantRole(bytes32,address)`; added `hasRole(bytes32,address)`; added `initialize(address)`; added `minter()`; added `permit(address,address,uint256,uint256,uint8,bytes32,bytes32)`; added `registerRewardToken(address,address)`; added `renounceRole(bytes32,address)`; added `revokeRole(bytes32,address)`; added `transfer(address,uint256)`; added `transferFrom(address,address,uint256)`; added `unregisterRewardToken(address)`; added `veProxy()`; added `withdraw(uint256)`; added `withdraw(uint256,address)`; 📝 src +6350/-19 | [0x5b4c4027b6329f5f41c6d9e867b0960c2876f20308d615ea442480ecdd017319](https://etherscan.io/tx/0x5b4c4027b6329f5f41c6d9e867b0960c2876f20308d615ea442480ecdd017319) |

> <details>
> <summary>📝 Source diff — upgrade #3 (<code>0xF62F...36D6</code> → <code>0x9f92...9fD9</code>): +15/-6346 lines (truncated)</summary>

> ```diff
--- old_impl
+++ new_impl
@@ -1,6352 +1,21 @@
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v4.9.0) (access/AccessControl.sol)
-
-pragma solidity ^0.8.0;
-
-import "./IAccessControlUpgradeable.sol";
-import "../utils/ContextUpgradeable.sol";
-import "../utils/StringsUpgradeable.sol";
-import "../utils/introspection/ERC165Upgradeable.sol";
-import "../proxy/utils/Initializable.sol";
-
-/**
- * @dev Contract module that allows children to implement role-based access
- * control mechanisms. This is a lightweight version that doesn't allow enumerating role
- * members except through off-chain means by accessing the contract event logs. Some
- * applications may benefit from on-chain enumerability, for those cases see
- * {AccessControlEnumerable}.
- *
- * Roles are referred to by their `bytes32` identifier. These should be exposed
- * in the external API and be unique. The best way to achieve this is by
- * using `public constant` hash digests:
- *
- * ```solidity
- * bytes32 public constant MY_ROLE = keccak256("MY_ROLE");
- * ```
- *
- * Roles can be used to represent a set of permissions. To restrict access to a
- * function call, use {hasRole}:
- *
- * ```solidity
- * function foo() public {
- *     require(hasRole(MY_ROLE, msg.sender));
- *     ...
- * }
- * ```
- *
- * Roles can be granted and revoked dynamically via the {grantRole} and
- * {revokeRole} functions. Each role has an associated admin role, and only
- * accounts that have a role's admin role can call {grantRole} and {revokeRole}.
- *
- * By default, the admin role for all roles is `DEFAULT_ADMIN_ROLE`, which means
- * that only accounts with this role will be able to grant or revoke other
- * roles. More complex role relationships can be created by using
- * {_setRoleAdmin}.
- *
- * WARNING: The `DEFAULT_ADMIN_ROLE` is also its own admin: it has permission to
- * grant and revoke this role. Extra precautions should be taken to secure
- * accounts that have been granted it. We recommend using {AccessControlDefaultAdminRules}
- * to enforce additional security measures for this role.
- */
-abstract contract AccessControlUpgradeable is Initializable, ContextUpgradeable, IAccessControlUpgradeable, ERC165Upgradeable {
-    function __AccessControl_init() internal onlyInitializing {
-    }
-
-    function __AccessControl_init_unchained() internal onlyInitializing {
-    }
-    struct RoleData {
-        mapping(address => bool) members;
-        bytes32 adminRole;
-    }
-
-    mapping(bytes32 => RoleData) private _roles;
-
-    bytes32 public constant DEFAULT_ADMIN_ROLE = 0x00;
-
-    /**
-     * @dev Modifier that checks that an account has a specific role. Reverts
-     * with a standardized message including the required role.
-     *
-     * The format of the revert reason is given by the following regular expression:
-     *
-     *  /^AccessControl: account (0x[0-9a-f]{40}) is missing role (0x[0-9a-f]{64})$/
-     *
-     * _Available since v4.1._
-     */
-    modifier onlyRole(bytes32 role) {
-        _checkRole(role);
-        _;
-    }
-
-    /**
-     * @dev See {IERC165-supportsInterface}.
-     */
-    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
-        return interfaceId == type(IAccessControlUpgradeable).interfaceId || super.supportsInterface(interfaceId);
-    }
-
-    /**
-     * @dev Returns `true` if `account` has been granted `role`.
-     */
-    function hasRole(bytes32 role, address account) public view virtual override returns (bool) {
-        return _roles[role].members[account];
-    }
-
-    /**
-     * @dev Revert with a standard message if `_msgSender()` is missing `role`.
-     * Overriding this function changes the behavior of the {onlyRole} modifier.
-     *
-     * Format of the revert message is described in {_checkRole}.
-     *
-     * _Available since v4.6._
-     */
-    function _checkRole(bytes32 role) internal view virtual {
-        _checkRole(role, _msgSender());
-    }
-
-    /**
-     * @dev Revert with a standard message if `account` is missing `role`.
-     *
-     * The format of the revert reason is given by the following regular expression:
-     *
-     *  /^AccessControl: account (0x[0-9a-f]{40}) is missing role (0x[0-9a-f]{64})$/
-     */
-    function _checkRole(bytes32 role, address account) internal view virtual {
-        if (!hasRole(role, account)) {
-            revert(
-                string(
-                    abi.encodePacked(
-                        "AccessControl: account ",
-                        StringsUpgradeable.toHexString(account),
-                        " is missing role ",
-                        StringsUpgradeable.toHexString(uint256(role), 32)
-                    )
-                )
-            );
-        }
-    }
-
-    /**
-     * @dev Returns the admin role that controls `role`. See {grantRole} and
-     * {revokeRole}.
-     *
-     * To change a role's admin, use {_setRoleAdmin}.
-     */
-    function getRoleAdmin(bytes32 role) public view virtual override returns (bytes32) {
-        return _roles[role].adminRole;
-    }
-
-    /**
-     * @dev Grants `role` to `account`.
-     *
-     * If `account` had not been already granted `role`, emits a {RoleGranted}
-     * event.
-     *
-     * Requirements:
-     *
-     * - the caller must have ``role``'s admin role.
-     *
-     * May emit a {RoleGranted} event.
-     */
-    function grantRole(bytes32 role, address account) public virtual override onlyRole(getRoleAdmin(role)) {
-        _grantRole(role, account);
-    }
-
-    /**
-     * @dev Revokes `role` from `account`.
-     *
-     * If `account` had been granted `role`, emits a {RoleRevoked} event.
-     *
-     * Requirements:
-     *
-     * - the caller must have ``role``'s admin role.
-     *
-     * May emit a {RoleRevoked} event.
-     */
-    function revokeRole(bytes32 role, address account) public virtual override onlyRole(getRoleAdmin(role)) {
-        _revokeRole(role, account);
-    }
-
-    /**
-     * @dev Revokes `role` from the calling account.
-     *
-     * Roles are often managed via {grantRole} and {revokeRole}: this function's
-     * purpose is to provide a mechanism for accounts to lose their privileges
-     * if they are compromised (such as when a trusted device is misplaced).
-     *
-     * If the calling account had been revoked `role`, emits a {RoleRevoked}
-     * event.
-     *
-     * Requirements:
-     *
-     * - the caller must be `account`.
-     *
-     * May emit a {RoleRevoked} event.
-     */
-    function renounceRole(bytes32 role, address account) public virtual override {
-        require(account == _msgSender(), "AccessControl: can only renounce roles for self");
-
-        _revokeRole(role, account);
-    }
-
-    /**
-     * @dev Grants `role` to `account`.
-     *
-     * If `account` had not been already granted `role`, emits a {RoleGranted}
-     * event. Note that unlike {grantRole}, this function doesn't perform any
-     * checks on the calling account.
-     *
-     * May emit a {RoleGranted} event.
-     *
-     * [WARNING]
-     * ====
-     * This function should only be called from the constructor when setting
-     * up the initial roles for the system.
-     *
-     * Using this function in any other way is effectively circumventing the admin
-     * system imposed by {AccessControl}.
-     * ====
-     *
-     * NOTE: This function is deprecated in favor of {_grantRole}.
-     */
-    function _setupRole(bytes32 role, address account) internal virtual {
-        _grantRole(role, account);
-    }
-
-    /**
-     * @dev Sets `adminRole` as ``role``'s admin role.
-     *
-     * Emits a {RoleAdminChanged} event.
-     */
-    function _setRoleAdmin(bytes32 role, bytes32 adminRole) internal virtual {
-        bytes32 previousAdminRole = getRoleAdmin(role);
-        _roles[role].adminRole = adminRole;
-        emit RoleAdminChanged(role, previousAdminRole, adminRole);
-    }
-
-    /**
-     * @dev Grants `role` to `account`.
-     *
-     * Internal function without access restriction.
-     *
-     * May emit a {RoleGranted} event.
-     */
-    function _grantRole(bytes32 role, address account) internal virtual {
-        if (!hasRole(role, account)) {
-            _roles[role].members[account] = true;
-            emit RoleGranted(role, account, _msgSender());
-        }
-    }
-
-    /**
-     * @dev Revokes `role` from `account`.
-     *
-     * Internal function without access restriction.
-     *
-     * May emit a {RoleRevoked} event.
-     */
-    function _revokeRole(bytes32 role, address account) internal virtual {
-        if (hasRole(role, account)) {
-            _roles[role].members[account] = false;
-            emit RoleRevoked(role, account, _msgSender());
-        }
-    }
-
-    /**
-     * @dev This empty reserved space is put in place to allow future versions to add new
-     * variables without shifting down storage in the inheritance chain.
-     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
-     */
-    uint256[49] private __gap;
-}
-
-
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts v4.4.1 (access/IAccessControl.sol)
-
-pragma solidity ^0.8.0;
-
-/**
- * @dev External interface of AccessControl declared to support ERC165 detection.
- */
-interface IAccessControlUpgradeable {
-    /**
-     * @dev Emitted when `newAdminRole` is set as ``role``'s admin role, replacing `previousAdminRole`
-     *
-     * `DEFAULT_ADMIN_ROLE` is the starting admin for all roles, despite
-     * {RoleAdminChanged} not being emitted signaling this.
-     *
-     * _Available since v3.1._
-     */
-    event RoleAdminChanged(bytes32 indexed role, bytes32 indexed previousAdminRole, bytes32 indexed newAdminRole);
-
-    /**
-     * @dev Emitted when `account` is granted `role`.
-     *
-     * `sender` is the account that originated the contract call, an admin role
-     * bearer except when using {AccessControl-_setupRole}.
-     */
-    event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender);
-
-    /**
-     * @dev Emitted when `account` is revoked `role`.
-     *
-     * `sender` is the account that originated the contract call:
-     *   - if using `revokeRole`, it is the admin role bearer
-     *   - if using `renounceRole`, it is the role bearer (i.e. `account`)
-     */
-    event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender);
-
-    /**
-     * @dev Returns `true` if `account` has been granted `role`.
-     */
-    function hasRole(bytes32 role, address account) external view returns (bool);
-
-    /**
-     * @dev Returns the admin role that controls `role`. See {grantRole} and
-     * {revokeRole}.
-     *
-     * To change a role's admin, use {AccessControl-_setRoleAdmin}.
-     */
-    function getRoleAdmin(bytes32 role) external view returns (bytes32);
-
-    /**
-     * @dev Grants `role` to `account`.
-     *
-     * If `account` had not been already granted `role`, emits a {RoleGranted}
-     * event.
-     *
-     * Requirements:
-     *
-     * - the caller must have ``role``'s admin role.
-     */
-    function grantRole(bytes32 role, address account) external;
-
-    /**
-     * @dev Revokes `role` from `account`.
-     *
-     * If `account` had been granted `role`, emits a {RoleRevoked} event.
-     *
-     * Requirements:
-     *
-     * - the caller must have ``role``'s admin role.
-     */
-    function revokeRole(bytes32 role, address account) external;
-
-    /**
-     * @dev Revokes `role` from the calling account.
-     *
-     * Roles are often managed via {grantRole} and {revokeRole}: this function's
-     * purpose is to provide a mechanism for accounts to lose their privileges
-     * if they are compromised (such as when a trusted device is misplaced).
-     *
-     * If the calling account had been granted `role`, emits a {RoleRevoked}
-     * event.
-     *
-     * Requirements:
-     *
-     * - the caller must be `account`.
-     */
-    function renounceRole(bytes32 role, address account) external;
-}
-
-
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v4.9.0) (interfaces/IERC5267.sol)
-
-pragma solidity ^0.8.0;
-
-interface IERC5267Upgradeable {
-    /**
-     * @dev MAY be emitted to signal that the domain could have changed.
-     */
-    event EIP712DomainChanged();
-
-    /**
-     * @dev returns the fields and values that describe the domain separator used by this contract for EIP-712
-     * signature.
-     */
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
-}
-
-
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v4.9.0) (proxy/utils/Initializable.sol)
-
-pragma solidity ^0.8.2;
-
-import "../../utils/AddressUpgradeable.sol";
-
-/**
- * @dev This is a base contract to aid in writing upgradeable contracts, or any kind of contract that will be deployed
- * behind a proxy. Since proxied contracts do not make use of a constructor, it's common to move constructor logic to an
- * external initializer function, usually called `initialize`. It then becomes necessary to protect this initializer
- * function so it can only be called once. The {initializer} modifier provided by this contract will have this effect.
- *
- * The initialization functions use a version number. Once a version number is used, it is consumed and cannot be
- * reused. This mechanism prevents re-execution of each "step" but allows the creation of new initialization steps in
- * case an upgrade adds a module that needs to be initialized.
- *
- * For example:
- *
- * [.hljs-theme-light.nopadding]
- * ```solidity
- * contract MyToken is ERC20Upgradeable {
- *     function initialize() initializer public {
- *         __ERC20_init("MyToken", "MTK");
- *     }
- * }
- *
- * contract MyTokenV2 is MyToken, ERC20PermitUpgradeable {
- *     function initializeV2() reinitializer(2) public {
- *         __ERC20Permit_init("MyToken");
- *     }
- * }
- * ```
- *
- * TIP: To avoid leaving the proxy in an uninitialized state, the initializer function should be called as early as
- * possible by providing the encoded function call as the `_data` argument to {ERC1967Proxy-constructor}.
- *
- * CAUTION: When used with inheritance, manual care must be taken to not invoke a parent initializer twice, or to ensure
- * that all initializers are idempotent. This is not verified automatically as constructors are by Solidity.
- *
- * [CAUTION]
- * ====
- * Avoid leaving a contract uninitialized.
- *
- * An uninitialized contract can be taken over by an attacker. This applies to both a proxy and its implementation
- * contract, which may impact the proxy. To prevent the implementation contract from being used, you should invoke
- * the {_disableInitializers} function in the constructor to automatically lock it when it is deployed:
- *
- * [.hljs-theme-light.nopadding]
- * ```
- * /// @custom:oz-upgrades-unsafe-allow constructor
- * constructor() {
- *     _disableInitializers();
- * }
- * ```
- * ====
- */
-abstract contract Initializable {
-    /**
-     * @dev Indicates that the contract has been initialized.
-     * @custom:oz-retyped-from bool
-     */
-    uint8 private _initialized;
-
-    /**
-     * @dev Indicates that the contract is in the process of being initialized.
-     */
-    bool private _initializing;
-
-    /**
-     * @dev Triggered when the contract has been initialized or reinitialized.
-     */
-    event Initialized(uint8 version);
-
-    /**
-     * @dev A modifier that defines a protected initializer function that can be invoked at most once. In its scope,
-     * `onlyInitializing` functions can be used to initialize parent contracts.
-     *
-     * Similar to `reinitializer(1)`, except that functions marked with `initializer` can be nested in the context of a
-     * constructor.
-     *
-     * Emits an {Initialized} event.
-     */
-    modifier initializer() {
-        bool isTopLevelCall = !_initializing;
-        require(
-            (isTopLevelCall && _initialized < 1) || (!AddressUpgradeable.isContract(address(this)) && _initialized == 1),
-            "Initializable: contract is already initialized"
-        );
-        _initialized = 1;
-        if (isTopLevelCall) {
-            _initializing = true;
-        }
-        _;
-        if (isTopLevelCall) {
-            _initializing = false;
-            emit Initialized(1);
-        }
-    }
-
-    /**
-     * @dev A modifier that defines a protected reinitializer function that can be invoked at most once, and only if the
-     * contract hasn't been initialized to a greater version before. In its scope, `onlyInitializing` functions can be
-     * used to initialize parent contracts.
-     *
-     * A reinitializer may be used after the original initialization step. This is essential to configure modules that
-     * are added through upgrades and that require initialization.
-     *
-     * When `version` is 1, this modifier is similar to `initializer`, except that functions marked with `reinitializer`
-     * cannot be nested. If one is invoked in the context of another, execution will revert.
-     *
-     * Note that versions can jump in increments greater than 1; this implies that if multiple reinitializers coexist in
-     * a contract, executing them in the right order is up to the developer or operator.
-     *
-     * WARNING: setting the version to 255 will prevent any future reinitialization.
-     *
-     * Emits an {Initialized} event.
-     */
-    modifier reinitializer(uint8 version) {
-        require(!_initializing && _initialized < version, "Initializable: contract is already initialized");
-        _initialized = version;
-        _initializing = true;
-        _;
-        _initializing = false;
-        emit Initialized(version);
-    }
-
-    /**
-     * @dev Modifier to protect an initialization function so that it can only be invoked by functions with the
-     * {initializer} and {reinitializer} modifiers, directly or indirectly.
-     */
-    modifier onlyInitializing() {
-        require(_initializing, "Initializable: contract is not initializing");
-        _;
-    }
-
-    /**
-     * @dev Locks the contract, preventing any future reinitialization. This cannot be part of an initializer call.
-     * Calling this in the constructor of a contract will prevent that contract from being initialized or reinitialized
-     * to any version. It is recommended to use this to lock implementation contracts that are designed to be called
-     * through proxies.
-     *
-     * Emits an {Initialized} event the first time it is successfully executed.
-     */
-    function _disableInitializers() internal virtual {
-        require(!_initializing, "Initializable: contract is initializing");
-        if (_initialized != type(uint8).max) {
-            _initialized = type(uint8).max;
-            emit Initialized(type(uint8).max);
-        }
-    }
-
-    /**
-     * @dev Returns the highest version that has been initialized. See {reinitializer}.
-     */
-    function _getInitializedVersion() internal view returns (uint8) {
-        return _initialized;
-    }
-
-    /**
-     * @dev Returns `true` if the contract is currently initializing. See {onlyInitializing}.
-     */
-    function _isInitializing() internal view returns (bool) {
-        return _initializing;
-    }
-}
-
-
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v4.9.0) (security/ReentrancyGuard.sol)
-
-pragma solidity ^0.8.0;
-import "../proxy/utils/Initializable.sol";
-
-/**
- * @dev Contract module that helps prevent reentrant calls to a function.
- *
- * Inheriting from `ReentrancyGuard` will make the {nonReentrant} modifier
- * available, which can be applied to functions to make sure there are no nested
- * (reentrant) calls to them.
- *
- * Note that because there is a single `nonReentrant` guard, functions marked as
- * `nonReentrant` may not call one another. This can be worked around by making
- * those functions `private`, and then adding `external` `nonReentrant` entry
- * points to them.
- *
- * TIP: If you would like to learn more about reentrancy and alternative ways
- * to protect against it, check out our blog post
- * https://blog.openzeppelin.com/reentrancy-after-istanbul/[Reentrancy After Istanbul].
- */
-abstract contract ReentrancyGuardUpgradeable is Initializable {
-    // Booleans are more expensive than uint256 or any type that takes up a full
-    // word because each write operation emits an extra SLOAD to first read the
-    // slot's contents, replace the bits taken up by the boolean, and then write
-    // back. This is the compiler's defense against contract upgrades and
-    // pointer aliasing, and it cannot be disabled.
-
-    // The values being non-zero value makes deployment a bit more expensive,
-    // but in exchange the refund on every call to nonReentrant will be lower in
-    // amount. Since refunds are capped to a percentage of the total
-    // transaction's gas, it is best to keep them low in cases like this one, to
-    // increase the likelihood of the full refund coming into effect.
-    uint256 private constant _NOT_ENTERED = 1;
-    uint256 private constant _ENTERED = 2;
-
-    uint256 private _status;
-
-    function __ReentrancyGuard_init() internal onlyInitializing {
-        __ReentrancyGuard_init_unchained();
-    }
-
-    function __ReentrancyGuard_init_unchained() internal onlyInitializing {
-        _status = _NOT_ENTERED;
-    }
-
-    /**
-     * @dev Prevents a contract from calling itself, directly or indirectly.
-     * Calling a `nonReentrant` function from another `nonReentrant`
-     * function is not supported. It is possible to prevent this from happening
-     * by making the `nonReentrant` function external, and making it call a
-     * `private` function that does the actual work.
-     */
-    modifier nonReentrant() {
-        _nonReentrantBefore();
-        _;
-        _nonReentrantAfter();
-    }
-
-    function _nonReentrantBefore() private {
-        // On the first call to nonReentrant, _status will be _NOT_ENTERED
-        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");
-
-        // Any calls to nonReentrant after this point will fail
-        _status = _ENTERED;
-    }
-
-    function _nonReentrantAfter() private {
-        // By storing the original value once again, a refund is triggered (see
-        // https://eips.ethereum.org/EIPS/eip-2200)
-        _status = _NOT_ENTERED;
-    }
-
-    /**
-     * @dev Returns true if the reentrancy guard is currently set to "entered", which indicates there is a
-     * `nonReentrant` function in the call stack.
-     */
-    function _reentrancyGuardEntered() internal view returns (bool) {
-        return _status == _ENTERED;
-    }
-
-    /**
-     * @dev This empty reserved space is put in place to allow future versions to add new
-     * variables without shifting down storage in the inheritance chain.
-     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
-     */
-    uint256[49] private __gap;
-}
-
-
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v4.9.0) (token/ERC20/ERC20.sol)
-
-pragma solidity ^0.8.0;
-
-import "./IERC20Upgradeable.sol";
-import "./extensions/IERC20MetadataUpgradeable.sol";
-import "../../utils/ContextUpgradeable.sol";
-import "../../proxy/utils/Initializable.sol";
-
-/**
- * @dev Implementation of the {IERC20} interface.
- *
- * This implementation is agnostic to the way tokens are created. This means
- * that a supply mechanism has to be added in a derived contract using {_mint}.
- * For a generic mechanism see {ERC20PresetMinterPauser}.
- *
- * TIP: For a detailed writeup see our guide
- * https://forum.openzeppelin.com/t/how-to-implement-erc20-supply-mechanisms/226[How
- * to implement supply mechanisms].
- *
- * The default value of {decimals} is 18. To change this, you should override
- * this function so it returns a different value.
- *
- * We have followed general OpenZeppelin Contracts guidelines: functions revert
- * instead returning `false` on failure. This behavior is nonetheless
- * conventional and does not conflict with the expectations of ERC20
- * applications.
- *
- * Additionally, an {Approval} event is emitted on calls to {transferFrom}.
- * This allows applications to reconstruct the allowance for all accounts just
- * by listening to said events. Other implementations of the EIP may not emit
- * these events, as it isn't required by the specification.
- *
- * Finally, the non-standard {decreaseAllowance} and {increaseAllowance}
- * functions have been added to mitigate the well-known issues around setting
- * allowances. See {IERC20-approve}.
- */
-contract ERC20Upgradeable is Initializable, ContextUpgradeable, IERC20Upgradeable, IERC20MetadataUpgradeable {
-    mapping(address => uint256) private _balances;
-
-    mapping(address => mapping(address => uint256)) private _allowances;
-
-    uint256 private _totalSupply;
-
-    string private _name;
-    string private _symbol;
-
-    /**
-     * @dev Sets the values for {name} and {symbol}.
-     *
-     * All two of these values are immutable: they can only be set once during
-     * construction.
-     */
-    function __ERC20_init(string memory name_, string memory symbol_) internal onlyInitializing {
-        __ERC20_init_unchained(name_, symbol_);
-    }
-
-    function __ERC20_init_unchained(string memory name_, string memory symbol_) internal onlyInitializing {
-        _name = name_;
-        _symbol = symbol_;
-    }
-
-    /**
-     * @dev Returns the name of the token.
-     */
-    function name() public view virtual override returns (string memory) {
-        return _name;
-    }
-
-    /**
-     * @dev Returns the symbol of the token, usually a shorter version of the
-     * name.
-     */
-    function symbol() public view virtual override returns (string memory) {
-        return _symbol;
-    }
-
-    /**
-     * @dev Returns the number of decimals used to get its user representation.
-     * For example, if `decimals` equals `2`, a balance of `505` tokens should
-     * be displayed to a user as `5.05` (`505 / 10 ** 2`).
-     *
-     * Tokens usually opt for a value of 18, imitating the relationship between
-     * Ether and Wei. This is the default value returned by this function, unless
-     * it's overridden.
-     *
-     * NOTE: This information is only used for _display_ purposes: it in
-     * no way affects any of the arithmetic of the contract, including
-     * {IERC20-balanceOf} and {IERC20-transfer}.
-     */
-    function decimals() public view virtual override returns (uint8) {
-        return 18;
-    }
-
-    /**
-     * @dev See {IERC20-totalSupply}.
-     */
-    function totalSupply() public view virtual override returns (uint256) {
-        return _totalSupply;
-    }
-
-    /**
-     * @dev See {IERC20-balanceOf}.
-     */
-    function balanceOf(address account) public view virtual override returns (uint256) {
-        return _balances[account];
-    }
-
-    /**
-     * @dev See {IERC20-transfer}.
-     *
-     * Requirements:
-     *
-     * - `to` cannot be the zero address.
-     * - the caller must have a balance of at least `amount`.
-     */
-    function transfer(address to, uint256 amount) public virtual override returns (bool) {
-        address owner = _msgSender();
-        _transfer(owner, to, amount);
-        return true;
-    }
-
-    /**
-     * @dev See {IERC20-allowance}.
-     */
-    function allowance(address owner, address spender) public view virtual override returns (uint256) {
-        return _allowances[owner][spender];
-    }
-
-    /**
-     * @dev See {IERC20-approve}.
-     *
-     * NOTE: If `amount` is the maximum `uint256`, the allowance is not updated on
-     * `transferFrom`. This is semantically equivalent to an infinite approval.
-     *
-     * Requirements:
-     *
-     * - `spender` cannot be the zero address.
-     */
-    function approve(address spender, uint256 amount) public virtual override returns (bool) {
-        address owner = _msgSender();
-        _approve(owner, spender, amount);
-        return true;
-    }
-
-    /**
-     * @dev See {IERC20-transferFrom}.
-     *
-     * Emits an {Approval} event indicating the updated allowance. This is not
-     * required by the EIP. See the note at the beginning of {ERC20}.
-     *
-     * NOTE: Does not update the allowance if the current allowance
-     * is the maximum `uint256`.
-     *
-     * Requirements:
-     *
-     * - `from` and `to` cannot be the zero address.
-     * - `from` must have a balance of at least `amount`.
-     * - the caller must have allowance for ``from``'s tokens of at least
-     * `amount`.
-     */
-    function transferFrom(address from, address to, uint256 amount) public virtual override returns (bool) {
-        address spender = _msgSender();
-        _spendAllowance(from, spender, amount);
-        _transfer(from, to, amount);
-        return true;
-    }
-
-    /**
-     * @dev Atomically increases the allowance granted to `spender` by the caller.
-     *
-     * This is an alternative to {approve} that can be used as a mitigation for
-     * problems described in {IERC20-approve}.
-     *
-     * Emits an {Approval} event indicating the updated allowance.
-     *
-     * Requirements:
-     *
-     * - `spender` cannot be the zero address.
-     */
-    function increaseAllowance(address spender, uint256 addedValue) public virtual returns (bool) {
-        address owner = _msgSender();
-        _approve(owner, spender, allowance(owner, spender) + addedValue);
-        return true;
-    }
-
-    /**
-     * @dev Atomically decreases the allowance granted to `spender` by the caller.
-     *
-     * This is an alternative to {approve} that can be used as a mitigation for
-     * problems described in {IERC20-approve}.
-     *
-     * Emits an {Approval} event indicating the updated allowance.
-     *
-     * Requirements:
-     *
-     * - `spender` cannot be the zero address.
-     * - `spender` must have allowance for the caller of at least
-     * `subtractedValue`.
-     */
-    function decreaseAllowance(address spender, uint256 subtractedValue) public virtual returns (bool) {
-        address owner = _msgSender();
-        uint256 currentAllowance = allowance(owner, spender);
-        require(currentAllowance >= subtractedValue, "ERC20: decreased allowance below zero");
-        unchecked {
-            _approve(owner, spender, currentAllowance - subtractedValue);
-        }
-
-        return true;
-    }
-
-    /**
-     * @dev Moves `amount` of tokens from `from` to `to`.
-     *
-     * This internal function is equivalent to {transfer}, and can be used to
-     * e.g. implement automatic token fees, slashing mechanisms, etc.
-     *
-     * Emits a {Transfer} event.
-     *
-     * Requirements:
-     *
-     * - `from` cannot be the zero address.
-     * - `to` cannot be the zero address.
-     * - `from` must have a balance of at least `amount`.
-     */
-    function _transfer(address from, address to, uint256 amount) internal virtual {
-        require(from != address(0), "ERC20: transfer from the zero address");
-        require(to != address(0), "ERC20: transfer to the zero address");
-
-        _beforeTokenTransfer(from, to, amount);
-
-        uint256 fromBalance = _balances[from];
-        require(fromBalance >= amount, "ERC20: transfer amount exceeds balance");
-        unchecked {
-            _balances[from] = fromBalance - amount;
-            // Overflow not possible: the sum of all balances is capped by totalSupply, and the sum is preserved by
-            // decrementing then incrementing.
-            _balances[to] += amount;
-        }
-
-        emit Transfer(from, to, amount);
-
-        _afterTokenTransfer(from, to, amount);
-    }
-
-    /** @dev Creates `amount` tokens and assigns them to `account`, increasing
-     * the total supply.
-     *
-     * Emits a {Transfer} event with `from` set to the zero address.
-     *
-     * Requirements:
-     *
-     * - `account` cannot be the zero address.
-     */
-    function _mint(address account, uint256 amount) internal virtual {
-        require(account != address(0), "ERC20: mint to the zero address");
-
-        _beforeTokenTransfer(address(0), account, amount);
-
-        _totalSupply += amount;
-        unchecked {
-            // Overflow not possible: balance + amount is at most totalSupply + amount, which is checked above.
-            _balances[account] += amount;
-        }
-        emit Transfer(address(0), account, amount);
-
-        _afterTokenTransfer(address(0), account, amount);
-    }
-
-    /**
-     * @dev Destroys `amount` tokens from `account`, reducing the
-     * total supply.
-     *
-     * Emits a {Transfer} event with `to` set to the zero address.
-     *
-     * Requirements:
-     *
-     * - `account` cannot be the zero address.
-     * - `account` must have at least `amount` tokens.
-     */
-    function _burn(address account, uint256 amount) internal virtual {
-        require(account != address(0), "ERC20: burn from the zero address");
-
-        _beforeTokenTransfer(account, address(0), amount);
-
-        uint256 accountBalance = _balances[account];
-        require(accountBalance >= amount, "ERC20: burn amount exceeds balance");
-        unchecked {
-            _balances[account] = accountBalance - amount;
-            // Overflow not possible: amount <= accountBalance <= totalSupply.
-            _totalSupply -= amount;
-        }
-
-        emit Transfer(account, address(0), amount);
-
-        _afterTokenTransfer(account, address(0), amount);
-    }
-
-    /**
-     * @dev Sets `amount` as the allowance of `spender` over the `owner` s tokens.
-     *
-     * This internal function is equivalent to `approve`, and can be used to
-     * e.g. set automatic allowances for certain subsystems, etc.
-     *
-     * Emits an {Approval} event.
-     *
-     * Requirements:
-     *
-     * - `owner` cannot be the zero address.
-     * - `spender` cannot be the zero address.
-     */
-    function _approve(address owner, address spender, uint256 amount) internal virtual {
-        require(owner != address(0), "ERC20: approve from the zero address");
-        require(spender != address(0), "ERC20: approve to the zero address");
-
-        _allowances[owner][spender] = amount;
-        emit Approval(owner, spender, amount);
-    }
-
-    /**
-     * @dev Updates `owner` s allowance for `spender` based on spent `amount`.
-     *
-     * Does not update the allowance amount in case of infinite allowance.
-     * Revert if not enough allowance is available.
-     *
-     * Might emit an {Approval} event.
-     */
-    function _spendAllowance(address owner, address spender, uint256 amount) internal virtual {
-        uint256 currentAllowance = allowance(owner, spender);
-        if (currentAllowance != type(uint256).max) {
-            require(currentAllowance >= amount, "ERC20: insufficient allowance");
-            unchecked {
-                _approve(owner, spender, currentAllowance - amount);
-            }
-        }
-    }
-
-    /**
-     * @dev Hook that is called before any transfer of tokens. This includes
-     * minting and burning.
-     *
-     * Calling conditions:
-     *
-     * - when `from` and `to` are both non-zero, `amount` of ``from``'s tokens
-     * will be transferred to `to`.
-     * - when `from` is zero, `amount` tokens will be minted for `to`.
-     * - when `to` is zero, `amount` of ``from``'s tokens will be burned.
-     * - `from` and `to` are never both zero.
-     *
-     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
-     */
-    function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual {}
-
-    /**
-     * @dev Hook that is called after any transfer of tokens. This includes
-     * minting and burning.
-     *
-     * Calling conditions:
-     *
-     * - when `from` and `to` are both non-zero, `amount` of ``from``'s tokens
-     * has been transferred to `to`.
-     * - when `from` is zero, `amount` tokens have been minted for `to`.
-     * - when `to` is zero, `amount` of ``from``'s tokens have been burned.
-     * - `from` and `to` are never both zero.
-     *
-     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
-     */
-    function _afterTokenTransfer(address from, address to, uint256 amount) internal virtual {}
-
-    /**
-     * @dev This empty reserved space is put in place to allow future versions to add new
-     * variables without shifting down storage in the inheritance chain.
-     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
-     */
-    uint256[45] private __gap;
-}
-
-
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v4.9.0) (token/ERC20/extensions/ERC20Permit.sol)
-
-pragma solidity ^0.8.0;
-
-import "./IERC20PermitUpgradeable.sol";
-import "../ERC20Upgradeable.sol";
-import "../../../utils/cryptography/ECDSAUpgradeable.sol";
-import "../../../utils/cryptography/EIP712Upgradeable.sol";
-import "../../../utils/CountersUpgradeable.sol";
-import "../../../proxy/utils/Initializable.sol";
-
-/**
- * @dev Implementation of the ERC20 Permit extension allowing approvals to be made via signatures, as defined in
- * https://eips.ethereum.org/EIPS/eip-2612[EIP-2612].
- *
- * Adds the {permit} method, which can be used to change an account's ERC20 allowance (see {IERC20-allowance}) by
- * presenting a message signed by the account. By not relying on `{IERC20-approve}`, the token holder account doesn't
- * need to send a transaction, and thus is not required to hold Ether at all.
- *
- * _Available since v3.4._
- *
- * @custom:storage-size 51
- */
-abstract contract ERC20PermitUpgradeable is Initializable, ERC20Upgradeable, IERC20PermitUpgradeable, EIP712Upgradeable {
-    using CountersUpgradeable for CountersUpgradeable.Counter;
-
-    mapping(address => CountersUpgradeable.Counter) private _nonces;
-
-    // solhint-disable-next-line var-name-mixedcase
-    bytes32 private constant _PERMIT_TYPEHASH =
-        keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)");
-    /**
-     * @dev In previous versions `_PERMIT_TYPEHASH` was declared as `immutable`.
-     * However, to ensure consistency with the upgradeable transpiler, we will continue
-     * to reserve a slot.
-     * @custom:oz-renamed-from _PERMIT_TYPEHASH
-     */
-    // solhint-disable-next-line var-name-mixedcase
-    bytes32 private _PERMIT_TYPEHASH_DEPRECATED_SLOT;
-
-    /**
-     * @dev Initializes the {EIP712} domain separator using the `name` parameter, and setting `version` to `"1"`.
-     *
-     * It's a good idea to use the same `name` that is defined as the ERC20 token name.
-     */
-    function __ERC20Permit_init(string memory name) internal onlyInitializing {
-        __EIP712_init_unchained(name, "1");
-    }
-
-    function __ERC20Permit_init_unchained(string memory) internal onlyInitializing {}
-
-    /**
-     * @dev See {IERC20Permit-permit}.
-     */
-    function permit(
-        address owner,
-        address spender,
-        uint256 value,
-        uint256 deadline,
-        uint8 v,
-        bytes32 r,
-        bytes32 s
-    ) public virtual override {
-        require(block.timestamp <= deadline, "ERC20Permit: expired deadline");
-
-        bytes32 structHash = keccak256(abi.encode(_PERMIT_TYPEHASH, owner, spender, value, _useNonce(owner), deadline));
-
-        bytes32 hash = _hashTypedDataV4(structHash);
-
-        address signer = ECDSAUpgradeable.recover(hash, v, r, s);
-        require(signer == owner, "ERC20Permit: invalid signature");
-
-        _approve(owner, spender, value);
-    }
-
-    /**
-     * @dev See {IERC20Permit-nonces}.
-     */
-    function nonces(address owner) public view virtual override returns (uint256) {
-        return _nonces[owner].current();
-    }
-
-    /**
-     * @dev See {IERC20Permit-DOMAIN_SEPARATOR}.
-     */
-    // solhint-disable-next-line func-name-mixedcase
-    function DOMAIN_SEPARATOR() external view override returns (bytes32) {
-        return _domainSeparatorV4();
-    }
-
-    /**
-     * @dev "Consume a nonce": return the current value and increment.
-     *
-     * _Available since v4.1._
-     */
-    function _useNonce(address owner) internal virtual returns (uint256 current) {
-        CountersUpgradeable.Counter storage nonce = _nonces[owner];
-        current = nonce.current();
-        nonce.increment();
-    }
-
-    /**
-     * @dev This empty reserved space is put in place to allow future versions to add new
-     * variables without shifting down storage in the inheritance chain.
-     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
-     */
-    uint256[49] private __gap;
-}
-
-
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts v4.4.1 (token/ERC20/extensions/IERC20Metadata.sol)
-
-pragma solidity ^0.8.0;
-
-import "../IERC20Upgradeable.sol";
-
-/**
- * @dev Interface for the optional metadata functions from the ERC20 standard.
- *
- * _Available since v4.1._
- */
-interface IERC20MetadataUpgradeable is IERC20Upgradeable {
-    /**
-     * @dev Returns the name of the token.
-     */
-    function name() external view returns (string memory);
-
-    /**
-     * @dev Returns the symbol of the token.
-     */
-    function symbol() external view returns (string memory);
-
-    /**
-     * @dev Returns the decimals places of the token.
-     */
-    function decimals() external view returns (uint8);
-}
-
-
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v4.9.0) (token/ERC20/extensions/IERC20Permit.sol)
-
-pragma solidity ^0.8.0;
-
-/**
- * @dev Interface of the ERC20 Permit extension allowing approvals to be made via signatures, as defined in
- * https://eips.ethereum.org/EIPS/eip-2612[EIP-2612].
- *
- * Adds the {permit} method, which can be used to change an account's ERC20 allowance (see {IERC20-allowance}) by
- * presenting a message signed by the account. By not relying on {IERC20-approve}, the token holder account doesn't
- * need to send a transaction, and thus is not required to hold Ether at all.
- */
-interface IERC20PermitUpgradeable {
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
-// OpenZeppelin Contracts (last updated v4.9.0) (token/ERC20/IERC20.sol)
-
-pragma solidity ^0.8.0;
-
-/**
- * @dev Interface of the ERC20 standard as defined in the EIP.
- */
-interface IERC20Upgradeable {
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
-     * @dev Returns the amount of tokens in existence.
-     */
-    function totalSupply() external view returns (uint256);
-
-    /**
-     * @dev Returns the amount of tokens owned by `account`.
-     */
-    function balanceOf(address account) external view returns (uint256);
-
-    /**
-     * @dev Moves `amount` tokens from the caller's account to `to`.
-     *
-     * Returns a boolean value indicating whether the operation succeeded.
-     *
-     * Emits a {Transfer} event.
-     */
-    function transfer(address to, uint256 amount) external returns (bool);
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
-     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
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
-    function approve(address spender, uint256 amount) external returns (bool);
-
-    /**
-     * @dev Moves `amount` tokens from `from` to `to` using the
-     * allowance mechanism. `amount` is then deducted from the caller's
-     * allowance.
-     *
-     * Returns a boolean value indicating whether the operation succeeded.
-     *
-     * Emits a {Transfer} event.
-     */
-    function transferFrom(address from, address to, uint256 amount) external returns (bool);
-}
-
-
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v4.9.3) (token/ERC20/utils/SafeERC20.sol)
-
-pragma solidity ^0.8.0;
-
-import "../IERC20Upgradeable.sol";
-import "../extensions/IERC20PermitUpgradeable.sol";
-import "../../../utils/AddressUpgradeable.sol";
-
-/**
- * @title SafeERC20
- * @dev Wrappers around ERC20 operations that throw on failure (when the token
- * contract returns false). Tokens that return no value (and instead revert or
- * throw on failure) are also supported, non-reverting calls are assumed to be
- * successful.
- * To use this library you can add a `using SafeERC20 for IERC20;` statement to your contract,
- * which allows you to call the safe operations as `token.safeTransfer(...)`, etc.
- */
-library SafeERC20Upgradeable {
-    using AddressUpgradeable for address;
-
-    /**
-     * @dev Transfer `value` amount of `token` from the calling contract to `to`. If `token` returns no value,
-     * non-reverting calls are assumed to be successful.
-     */
-    function safeTransfer(IERC20Upgradeable token, address to, uint256 value) internal {
-        _callOptionalReturn(token, abi.encodeWithSelector(token.transfer.selector, to, value));
-    }
-
-    /**
-     * @dev Transfer `value` amount of `token` from `from` to `to`, spending the approval given by `from` to the
-     * calling contract. If `token` returns no value, non-reverting calls are assumed to be successful.
-     */
-    function safeTransferFrom(IERC20Upgradeable token, address from, address to, uint256 value) internal {
-        _callOptionalReturn(token, abi.encodeWithSelector(token.transferFrom.selector, from, to, value));
-    }
-
-    /**
-     * @dev Deprecated. This function has issues similar to the ones found in
-     * {IERC20-approve}, and its usage is discouraged.
-     *
-     * Whenever possible, use {safeIncreaseAllowance} and
-     * {safeDecreaseAllowance} instead.
-     */
-    function safeApprove(IERC20Upgradeable token, address spender, uint256 value) internal {
-        // safeApprove should only be called when setting an initial allowance,
-        // or when resetting it to zero. To increase and decrease it, use
-        // 'safeIncreaseAllowance' and 'safeDecreaseAllowance'
-        require(
-            (value == 0) || (token.allowance(address(this), spender) == 0),
-            "SafeERC20: approve from non-zero to non-zero allowance"
-        );
-        _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, value));
-    }
-
-    /**
-     * @dev Increase the ca
[truncated — full diff is 231,292 bytes]
> ```

> </details>

> <details>
> <summary>📝 Source diff — upgrade #4 (<code>0x9f92...9fD9</code> → <code>0xF62F...36D6</code>): +6350/-19 lines (truncated)</summary>

> ```diff
--- old_impl
+++ new_impl
@@ -1,21 +1,6352 @@
 // SPDX-License-Identifier: MIT
-
-pragma solidity ^0.8.26;
-
-contract SharedLiquidityGaugeRename {
-  uint8 private _initialized;
-  bool private _initializing;
-  uint256 private _status;
-  uint256[49] private __gap_1;
-  uint256[50] private __gap_2;
-  mapping(address => uint256) private _balances;
-  mapping(address => mapping(address => uint256)) private _allowances;
-  uint256 private _totalSupply;
-  string private _name;
-  string private _symbol;
-
-  function rename(string memory name_, string memory symbol_) external {
-    _name = name_;
-    _symbol = symbol_;
-  }
+// OpenZeppelin Contracts (last updated v4.9.0) (access/AccessControl.sol)
+
+pragma solidity ^0.8.0;
+
+import "./IAccessControlUpgradeable.sol";
+import "../utils/ContextUpgradeable.sol";
+import "../utils/StringsUpgradeable.sol";
+import "../utils/introspection/ERC165Upgradeable.sol";
+import "../proxy/utils/Initializable.sol";
+
+/**
+ * @dev Contract module that allows children to implement role-based access
+ * control mechanisms. This is a lightweight version that doesn't allow enumerating role
+ * members except through off-chain means by accessing the contract event logs. Some
+ * applications may benefit from on-chain enumerability, for those cases see
+ * {AccessControlEnumerable}.
+ *
+ * Roles are referred to by their `bytes32` identifier. These should be exposed
+ * in the external API and be unique. The best way to achieve this is by
+ * using `public constant` hash digests:
+ *
+ * ```solidity
+ * bytes32 public constant MY_ROLE = keccak256("MY_ROLE");
+ * ```
+ *
+ * Roles can be used to represent a set of permissions. To restrict access to a
+ * function call, use {hasRole}:
+ *
+ * ```solidity
+ * function foo() public {
+ *     require(hasRole(MY_ROLE, msg.sender));
+ *     ...
+ * }
+ * ```
+ *
+ * Roles can be granted and revoked dynamically via the {grantRole} and
+ * {revokeRole} functions. Each role has an associated admin role, and only
+ * accounts that have a role's admin role can call {grantRole} and {revokeRole}.
+ *
+ * By default, the admin role for all roles is `DEFAULT_ADMIN_ROLE`, which means
+ * that only accounts with this role will be able to grant or revoke other
+ * roles. More complex role relationships can be created by using
+ * {_setRoleAdmin}.
+ *
+ * WARNING: The `DEFAULT_ADMIN_ROLE` is also its own admin: it has permission to
+ * grant and revoke this role. Extra precautions should be taken to secure
+ * accounts that have been granted it. We recommend using {AccessControlDefaultAdminRules}
+ * to enforce additional security measures for this role.
+ */
+abstract contract AccessControlUpgradeable is Initializable, ContextUpgradeable, IAccessControlUpgradeable, ERC165Upgradeable {
+    function __AccessControl_init() internal onlyInitializing {
+    }
+
+    function __AccessControl_init_unchained() internal onlyInitializing {
+    }
+    struct RoleData {
+        mapping(address => bool) members;
+        bytes32 adminRole;
+    }
+
+    mapping(bytes32 => RoleData) private _roles;
+
+    bytes32 public constant DEFAULT_ADMIN_ROLE = 0x00;
+
+    /**
+     * @dev Modifier that checks that an account has a specific role. Reverts
+     * with a standardized message including the required role.
+     *
+     * The format of the revert reason is given by the following regular expression:
+     *
+     *  /^AccessControl: account (0x[0-9a-f]{40}) is missing role (0x[0-9a-f]{64})$/
+     *
+     * _Available since v4.1._
+     */
+    modifier onlyRole(bytes32 role) {
+        _checkRole(role);
+        _;
+    }
+
+    /**
+     * @dev See {IERC165-supportsInterface}.
+     */
+    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
+        return interfaceId == type(IAccessControlUpgradeable).interfaceId || super.supportsInterface(interfaceId);
+    }
+
+    /**
+     * @dev Returns `true` if `account` has been granted `role`.
+     */
+    function hasRole(bytes32 role, address account) public view virtual override returns (bool) {
+        return _roles[role].members[account];
+    }
+
+    /**
+     * @dev Revert with a standard message if `_msgSender()` is missing `role`.
+     * Overriding this function changes the behavior of the {onlyRole} modifier.
+     *
+     * Format of the revert message is described in {_checkRole}.
+     *
+     * _Available since v4.6._
+     */
+    function _checkRole(bytes32 role) internal view virtual {
+        _checkRole(role, _msgSender());
+    }
+
+    /**
+     * @dev Revert with a standard message if `account` is missing `role`.
+     *
+     * The format of the revert reason is given by the following regular expression:
+     *
+     *  /^AccessControl: account (0x[0-9a-f]{40}) is missing role (0x[0-9a-f]{64})$/
+     */
+    function _checkRole(bytes32 role, address account) internal view virtual {
+        if (!hasRole(role, account)) {
+            revert(
+                string(
+                    abi.encodePacked(
+                        "AccessControl: account ",
+                        StringsUpgradeable.toHexString(account),
+                        " is missing role ",
+                        StringsUpgradeable.toHexString(uint256(role), 32)
+                    )
+                )
+            );
+        }
+    }
+
+    /**
+     * @dev Returns the admin role that controls `role`. See {grantRole} and
+     * {revokeRole}.
+     *
+     * To change a role's admin, use {_setRoleAdmin}.
+     */
+    function getRoleAdmin(bytes32 role) public view virtual override returns (bytes32) {
+        return _roles[role].adminRole;
+    }
+
+    /**
+     * @dev Grants `role` to `account`.
+     *
+     * If `account` had not been already granted `role`, emits a {RoleGranted}
+     * event.
+     *
+     * Requirements:
+     *
+     * - the caller must have ``role``'s admin role.
+     *
+     * May emit a {RoleGranted} event.
+     */
+    function grantRole(bytes32 role, address account) public virtual override onlyRole(getRoleAdmin(role)) {
+        _grantRole(role, account);
+    }
+
+    /**
+     * @dev Revokes `role` from `account`.
+     *
+     * If `account` had been granted `role`, emits a {RoleRevoked} event.
+     *
+     * Requirements:
+     *
+     * - the caller must have ``role``'s admin role.
+     *
+     * May emit a {RoleRevoked} event.
+     */
+    function revokeRole(bytes32 role, address account) public virtual override onlyRole(getRoleAdmin(role)) {
+        _revokeRole(role, account);
+    }
+
+    /**
+     * @dev Revokes `role` from the calling account.
+     *
+     * Roles are often managed via {grantRole} and {revokeRole}: this function's
+     * purpose is to provide a mechanism for accounts to lose their privileges
+     * if they are compromised (such as when a trusted device is misplaced).
+     *
+     * If the calling account had been revoked `role`, emits a {RoleRevoked}
+     * event.
+     *
+     * Requirements:
+     *
+     * - the caller must be `account`.
+     *
+     * May emit a {RoleRevoked} event.
+     */
+    function renounceRole(bytes32 role, address account) public virtual override {
+        require(account == _msgSender(), "AccessControl: can only renounce roles for self");
+
+        _revokeRole(role, account);
+    }
+
+    /**
+     * @dev Grants `role` to `account`.
+     *
+     * If `account` had not been already granted `role`, emits a {RoleGranted}
+     * event. Note that unlike {grantRole}, this function doesn't perform any
+     * checks on the calling account.
+     *
+     * May emit a {RoleGranted} event.
+     *
+     * [WARNING]
+     * ====
+     * This function should only be called from the constructor when setting
+     * up the initial roles for the system.
+     *
+     * Using this function in any other way is effectively circumventing the admin
+     * system imposed by {AccessControl}.
+     * ====
+     *
+     * NOTE: This function is deprecated in favor of {_grantRole}.
+     */
+    function _setupRole(bytes32 role, address account) internal virtual {
+        _grantRole(role, account);
+    }
+
+    /**
+     * @dev Sets `adminRole` as ``role``'s admin role.
+     *
+     * Emits a {RoleAdminChanged} event.
+     */
+    function _setRoleAdmin(bytes32 role, bytes32 adminRole) internal virtual {
+        bytes32 previousAdminRole = getRoleAdmin(role);
+        _roles[role].adminRole = adminRole;
+        emit RoleAdminChanged(role, previousAdminRole, adminRole);
+    }
+
+    /**
+     * @dev Grants `role` to `account`.
+     *
+     * Internal function without access restriction.
+     *
+     * May emit a {RoleGranted} event.
+     */
+    function _grantRole(bytes32 role, address account) internal virtual {
+        if (!hasRole(role, account)) {
+            _roles[role].members[account] = true;
+            emit RoleGranted(role, account, _msgSender());
+        }
+    }
+
+    /**
+     * @dev Revokes `role` from `account`.
+     *
+     * Internal function without access restriction.
+     *
+     * May emit a {RoleRevoked} event.
+     */
+    function _revokeRole(bytes32 role, address account) internal virtual {
+        if (hasRole(role, account)) {
+            _roles[role].members[account] = false;
+            emit RoleRevoked(role, account, _msgSender());
+        }
+    }
+
+    /**
+     * @dev This empty reserved space is put in place to allow future versions to add new
+     * variables without shifting down storage in the inheritance chain.
+     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
+     */
+    uint256[49] private __gap;
 }
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts v4.4.1 (access/IAccessControl.sol)
+
+pragma solidity ^0.8.0;
+
+/**
+ * @dev External interface of AccessControl declared to support ERC165 detection.
+ */
+interface IAccessControlUpgradeable {
+    /**
+     * @dev Emitted when `newAdminRole` is set as ``role``'s admin role, replacing `previousAdminRole`
+     *
+     * `DEFAULT_ADMIN_ROLE` is the starting admin for all roles, despite
+     * {RoleAdminChanged} not being emitted signaling this.
+     *
+     * _Available since v3.1._
+     */
+    event RoleAdminChanged(bytes32 indexed role, bytes32 indexed previousAdminRole, bytes32 indexed newAdminRole);
+
+    /**
+     * @dev Emitted when `account` is granted `role`.
+     *
+     * `sender` is the account that originated the contract call, an admin role
+     * bearer except when using {AccessControl-_setupRole}.
+     */
+    event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender);
+
+    /**
+     * @dev Emitted when `account` is revoked `role`.
+     *
+     * `sender` is the account that originated the contract call:
+     *   - if using `revokeRole`, it is the admin role bearer
+     *   - if using `renounceRole`, it is the role bearer (i.e. `account`)
+     */
+    event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender);
+
+    /**
+     * @dev Returns `true` if `account` has been granted `role`.
+     */
+    function hasRole(bytes32 role, address account) external view returns (bool);
+
+    /**
+     * @dev Returns the admin role that controls `role`. See {grantRole} and
+     * {revokeRole}.
+     *
+     * To change a role's admin, use {AccessControl-_setRoleAdmin}.
+     */
+    function getRoleAdmin(bytes32 role) external view returns (bytes32);
+
+    /**
+     * @dev Grants `role` to `account`.
+     *
+     * If `account` had not been already granted `role`, emits a {RoleGranted}
+     * event.
+     *
+     * Requirements:
+     *
+     * - the caller must have ``role``'s admin role.
+     */
+    function grantRole(bytes32 role, address account) external;
+
+    /**
+     * @dev Revokes `role` from `account`.
+     *
+     * If `account` had been granted `role`, emits a {RoleRevoked} event.
+     *
+     * Requirements:
+     *
+     * - the caller must have ``role``'s admin role.
+     */
+    function revokeRole(bytes32 role, address account) external;
+
+    /**
+     * @dev Revokes `role` from the calling account.
+     *
+     * Roles are often managed via {grantRole} and {revokeRole}: this function's
+     * purpose is to provide a mechanism for accounts to lose their privileges
+     * if they are compromised (such as when a trusted device is misplaced).
+     *
+     * If the calling account had been granted `role`, emits a {RoleRevoked}
+     * event.
+     *
+     * Requirements:
+     *
+     * - the caller must be `account`.
+     */
+    function renounceRole(bytes32 role, address account) external;
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts (last updated v4.9.0) (interfaces/IERC5267.sol)
+
+pragma solidity ^0.8.0;
+
+interface IERC5267Upgradeable {
+    /**
+     * @dev MAY be emitted to signal that the domain could have changed.
+     */
+    event EIP712DomainChanged();
+
+    /**
+     * @dev returns the fields and values that describe the domain separator used by this contract for EIP-712
+     * signature.
+     */
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
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts (last updated v4.9.0) (proxy/utils/Initializable.sol)
+
+pragma solidity ^0.8.2;
+
+import "../../utils/AddressUpgradeable.sol";
+
+/**
+ * @dev This is a base contract to aid in writing upgradeable contracts, or any kind of contract that will be deployed
+ * behind a proxy. Since proxied contracts do not make use of a constructor, it's common to move constructor logic to an
+ * external initializer function, usually called `initialize`. It then becomes necessary to protect this initializer
+ * function so it can only be called once. The {initializer} modifier provided by this contract will have this effect.
+ *
+ * The initialization functions use a version number. Once a version number is used, it is consumed and cannot be
+ * reused. This mechanism prevents re-execution of each "step" but allows the creation of new initialization steps in
+ * case an upgrade adds a module that needs to be initialized.
+ *
+ * For example:
+ *
+ * [.hljs-theme-light.nopadding]
+ * ```solidity
+ * contract MyToken is ERC20Upgradeable {
+ *     function initialize() initializer public {
+ *         __ERC20_init("MyToken", "MTK");
+ *     }
+ * }
+ *
+ * contract MyTokenV2 is MyToken, ERC20PermitUpgradeable {
+ *     function initializeV2() reinitializer(2) public {
+ *         __ERC20Permit_init("MyToken");
+ *     }
+ * }
+ * ```
+ *
+ * TIP: To avoid leaving the proxy in an uninitialized state, the initializer function should be called as early as
+ * possible by providing the encoded function call as the `_data` argument to {ERC1967Proxy-constructor}.
+ *
+ * CAUTION: When used with inheritance, manual care must be taken to not invoke a parent initializer twice, or to ensure
+ * that all initializers are idempotent. This is not verified automatically as constructors are by Solidity.
+ *
+ * [CAUTION]
+ * ====
+ * Avoid leaving a contract uninitialized.
+ *
+ * An uninitialized contract can be taken over by an attacker. This applies to both a proxy and its implementation
+ * contract, which may impact the proxy. To prevent the implementation contract from being used, you should invoke
+ * the {_disableInitializers} function in the constructor to automatically lock it when it is deployed:
+ *
+ * [.hljs-theme-light.nopadding]
+ * ```
+ * /// @custom:oz-upgrades-unsafe-allow constructor
+ * constructor() {
+ *     _disableInitializers();
+ * }
+ * ```
+ * ====
+ */
+abstract contract Initializable {
+    /**
+     * @dev Indicates that the contract has been initialized.
+     * @custom:oz-retyped-from bool
+     */
+    uint8 private _initialized;
+
+    /**
+     * @dev Indicates that the contract is in the process of being initialized.
+     */
+    bool private _initializing;
+
+    /**
+     * @dev Triggered when the contract has been initialized or reinitialized.
+     */
+    event Initialized(uint8 version);
+
+    /**
+     * @dev A modifier that defines a protected initializer function that can be invoked at most once. In its scope,
+     * `onlyInitializing` functions can be used to initialize parent contracts.
+     *
+     * Similar to `reinitializer(1)`, except that functions marked with `initializer` can be nested in the context of a
+     * constructor.
+     *
+     * Emits an {Initialized} event.
+     */
+    modifier initializer() {
+        bool isTopLevelCall = !_initializing;
+        require(
+            (isTopLevelCall && _initialized < 1) || (!AddressUpgradeable.isContract(address(this)) && _initialized == 1),
+            "Initializable: contract is already initialized"
+        );
+        _initialized = 1;
+        if (isTopLevelCall) {
+            _initializing = true;
+        }
+        _;
+        if (isTopLevelCall) {
+            _initializing = false;
+            emit Initialized(1);
+        }
+    }
+
+    /**
+     * @dev A modifier that defines a protected reinitializer function that can be invoked at most once, and only if the
+     * contract hasn't been initialized to a greater version before. In its scope, `onlyInitializing` functions can be
+     * used to initialize parent contracts.
+     *
+     * A reinitializer may be used after the original initialization step. This is essential to configure modules that
+     * are added through upgrades and that require initialization.
+     *
+     * When `version` is 1, this modifier is similar to `initializer`, except that functions marked with `reinitializer`
+     * cannot be nested. If one is invoked in the context of another, execution will revert.
+     *
+     * Note that versions can jump in increments greater than 1; this implies that if multiple reinitializers coexist in
+     * a contract, executing them in the right order is up to the developer or operator.
+     *
+     * WARNING: setting the version to 255 will prevent any future reinitialization.
+     *
+     * Emits an {Initialized} event.
+     */
+    modifier reinitializer(uint8 version) {
+        require(!_initializing && _initialized < version, "Initializable: contract is already initialized");
+        _initialized = version;
+        _initializing = true;
+        _;
+        _initializing = false;
+        emit Initialized(version);
+    }
+
+    /**
+     * @dev Modifier to protect an initialization function so that it can only be invoked by functions with the
+     * {initializer} and {reinitializer} modifiers, directly or indirectly.
+     */
+    modifier onlyInitializing() {
+        require(_initializing, "Initializable: contract is not initializing");
+        _;
+    }
+
+    /**
+     * @dev Locks the contract, preventing any future reinitialization. This cannot be part of an initializer call.
+     * Calling this in the constructor of a contract will prevent that contract from being initialized or reinitialized
+     * to any version. It is recommended to use this to lock implementation contracts that are designed to be called
+     * through proxies.
+     *
+     * Emits an {Initialized} event the first time it is successfully executed.
+     */
+    function _disableInitializers() internal virtual {
+        require(!_initializing, "Initializable: contract is initializing");
+        if (_initialized != type(uint8).max) {
+            _initialized = type(uint8).max;
+            emit Initialized(type(uint8).max);
+        }
+    }
+
+    /**
+     * @dev Returns the highest version that has been initialized. See {reinitializer}.
+     */
+    function _getInitializedVersion() internal view returns (uint8) {
+        return _initialized;
+    }
+
+    /**
+     * @dev Returns `true` if the contract is currently initializing. See {onlyInitializing}.
+     */
+    function _isInitializing() internal view returns (bool) {
+        return _initializing;
+    }
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts (last updated v4.9.0) (security/ReentrancyGuard.sol)
+
+pragma solidity ^0.8.0;
+import "../proxy/utils/Initializable.sol";
+
+/**
+ * @dev Contract module that helps prevent reentrant calls to a function.
+ *
+ * Inheriting from `ReentrancyGuard` will make the {nonReentrant} modifier
+ * available, which can be applied to functions to make sure there are no nested
+ * (reentrant) calls to them.
+ *
+ * Note that because there is a single `nonReentrant` guard, functions marked as
+ * `nonReentrant` may not call one another. This can be worked around by making
+ * those functions `private`, and then adding `external` `nonReentrant` entry
+ * points to them.
+ *
+ * TIP: If you would like to learn more about reentrancy and alternative ways
+ * to protect against it, check out our blog post
+ * https://blog.openzeppelin.com/reentrancy-after-istanbul/[Reentrancy After Istanbul].
+ */
+abstract contract ReentrancyGuardUpgradeable is Initializable {
+    // Booleans are more expensive than uint256 or any type that takes up a full
+    // word because each write operation emits an extra SLOAD to first read the
+    // slot's contents, replace the bits taken up by the boolean, and then write
+    // back. This is the compiler's defense against contract upgrades and
+    // pointer aliasing, and it cannot be disabled.
+
+    // The values being non-zero value makes deployment a bit more expensive,
+    // but in exchange the refund on every call to nonReentrant will be lower in
+    // amount. Since refunds are capped to a percentage of the total
+    // transaction's gas, it is best to keep them low in cases like this one, to
+    // increase the likelihood of the full refund coming into effect.
+    uint256 private constant _NOT_ENTERED = 1;
+    uint256 private constant _ENTERED = 2;
+
+    uint256 private _status;
+
+    function __ReentrancyGuard_init() internal onlyInitializing {
+        __ReentrancyGuard_init_unchained();
+    }
+
+    function __ReentrancyGuard_init_unchained() internal onlyInitializing {
+        _status = _NOT_ENTERED;
+    }
+
+    /**
+     * @dev Prevents a contract from calling itself, directly or indirectly.
+     * Calling a `nonReentrant` function from another `nonReentrant`
+     * function is not supported. It is possible to prevent this from happening
+     * by making the `nonReentrant` function external, and making it call a
+     * `private` function that does the actual work.
+     */
+    modifier nonReentrant() {
+        _nonReentrantBefore();
+        _;
+        _nonReentrantAfter();
+    }
+
+    function _nonReentrantBefore() private {
+        // On the first call to nonReentrant, _status will be _NOT_ENTERED
+        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");
+
+        // Any calls to nonReentrant after this point will fail
+        _status = _ENTERED;
+    }
+
+    function _nonReentrantAfter() private {
+        // By storing the original value once again, a refund is triggered (see
+        // https://eips.ethereum.org/EIPS/eip-2200)
+        _status = _NOT_ENTERED;
+    }
+
+    /**
+     * @dev Returns true if the reentrancy guard is currently set to "entered", which indicates there is a
+     * `nonReentrant` function in the call stack.
+     */
+    function _reentrancyGuardEntered() internal view returns (bool) {
+        return _status == _ENTERED;
+    }
+
+    /**
+     * @dev This empty reserved space is put in place to allow future versions to add new
+     * variables without shifting down storage in the inheritance chain.
+     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
+     */
+    uint256[49] private __gap;
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts (last updated v4.9.0) (token/ERC20/ERC20.sol)
+
+pragma solidity ^0.8.0;
+
+import "./IERC20Upgradeable.sol";
+import "./extensions/IERC20MetadataUpgradeable.sol";
+import "../../utils/ContextUpgradeable.sol";
+import "../../proxy/utils/Initializable.sol";
+
+/**
+ * @dev Implementation of the {IERC20} interface.
+ *
+ * This implementation is agnostic to the way tokens are created. This means
+ * that a supply mechanism has to be added in a derived contract using {_mint}.
+ * For a generic mechanism see {ERC20PresetMinterPauser}.
+ *
+ * TIP: For a detailed writeup see our guide
+ * https://forum.openzeppelin.com/t/how-to-implement-erc20-supply-mechanisms/226[How
+ * to implement supply mechanisms].
+ *
+ * The default value of {decimals} is 18. To change this, you should override
+ * this function so it returns a different value.
+ *
+ * We have followed general OpenZeppelin Contracts guidelines: functions revert
+ * instead returning `false` on failure. This behavior is nonetheless
+ * conventional and does not conflict with the expectations of ERC20
+ * applications.
+ *
+ * Additionally, an {Approval} event is emitted on calls to {transferFrom}.
+ * This allows applications to reconstruct the allowance for all accounts just
+ * by listening to said events. Other implementations of the EIP may not emit
+ * these events, as it isn't required by the specification.
+ *
+ * Finally, the non-standard {decreaseAllowance} and {increaseAllowance}
+ * functions have been added to mitigate the well-known issues around setting
+ * allowances. See {IERC20-approve}.
+ */
+contract ERC20Upgradeable is Initializable, ContextUpgradeable, IERC20Upgradeable, IERC20MetadataUpgradeable {
+    mapping(address => uint256) private _balances;
+
+    mapping(address => mapping(address => uint256)) private _allowances;
+
+    uint256 private _totalSupply;
+
+    string private _name;
+    string private _symbol;
+
+    /**
+     * @dev Sets the values for {name} and {symbol}.
+     *
+     * All two of these values are immutable: they can only be set once during
+     * construction.
+     */
+    function __ERC20_init(string memory name_, string memory symbol_) internal onlyInitializing {
+        __ERC20_init_unchained(name_, symbol_);
+    }
+
+    function __ERC20_init_unchained(string memory name_, string memory symbol_) internal onlyInitializing {
+        _name = name_;
+        _symbol = symbol_;
+    }
+
+    /**
+     * @dev Returns the name of the token.
+     */
+    function name() public view virtual override returns (string memory) {
+        return _name;
+    }
+
+    /**
+     * @dev Returns the symbol of the token, usually a shorter version of the
+     * name.
+     */
+    function symbol() public view virtual override returns (string memory) {
+        return _symbol;
+    }
+
+    /**
+     * @dev Returns the number of decimals used to get its user representation.
+     * For example, if `decimals` equals `2`, a balance of `505` tokens should
+     * be displayed to a user as `5.05` (`505 / 10 ** 2`).
+     *
+     * Tokens usually opt for a value of 18, imitating the relationship between
+     * Ether and Wei. This is the default value returned by this function, unless
+     * it's overridden.
+     *
+     * NOTE: This information is only used for _display_ purposes: it in
+     * no way affects any of the arithmetic of the contract, including
+     * {IERC20-balanceOf} and {IERC20-transfer}.
+     */
+    function decimals() public view virtual override returns (uint8) {
+        return 18;
+    }
+
+    /**
+     * @dev See {IERC20-totalSupply}.
+     */
+    function totalSupply() public view virtual override returns (uint256) {
+        return _totalSupply;
+    }
+
+    /**
+     * @dev See {IERC20-balanceOf}.
+     */
+    function balanceOf(address account) public view virtual override returns (uint256) {
+        return _balances[account];
+    }
+
+    /**
+     * @dev See {IERC20-transfer}.
+     *
+     * Requirements:
+     *
+     * - `to` cannot be the zero address.
+     * - the caller must have a balance of at least `amount`.
+     */
+    function transfer(address to, uint256 amount) public virtual override returns (bool) {
+        address owner = _msgSender();
+        _transfer(owner, to, amount);
+        return true;
+    }
+
+    /**
+     * @dev See {IERC20-allowance}.
+     */
+    function allowance(address owner, address spender) public view virtual override returns (uint256) {
+        return _allowances[owner][spender];
+    }
+
+    /**
+     * @dev See {IERC20-approve}.
+     *
+     * NOTE: If `amount` is the maximum `uint256`, the allowance is not updated on
+     * `transferFrom`. This is semantically equivalent to an infinite approval.
+     *
+     * Requirements:
+     *
+     * - `spender` cannot be the zero address.
+     */
+    function approve(address spender, uint256 amount) public virtual override returns (bool) {
+        address owner = _msgSender();
+        _approve(owner, spender, amount);
+        return true;
+    }
+
+    /**
+     * @dev See {IERC20-transferFrom}.
+     *
+     * Emits an {Approval} event indicating the updated allowance. This is not
+     * required by the EIP. See the note at the beginning of {ERC20}.
+     *
+     * NOTE: Does not update the allowance if the current allowance
+     * is the maximum `uint256`.
+     *
+     * Requirements:
+     *
+     * - `from` and `to` cannot be the zero address.
+     * - `from` must have a balance of at least `amount`.
+     * - the caller must have allowance for ``from``'s tokens of at least
+     * `amount`.
+     */
+    function transferFrom(address from, address to, uint256 amount) public virtual override returns (bool) {
+        address spender = _msgSender();
+        _spendAllowance(from, spender, amount);
+        _transfer(from, to, amount);
+        return true;
+    }
+
+    /**
+     * @dev Atomically increases the allowance granted to `spender` by the caller.
+     *
+     * This is an alternative to {approve} that can be used as a mitigation for
+     * problems described in {IERC20-approve}.
+     *
+     * Emits an {Approval} event indicating the updated allowance.
+     *
+     * Requirements:
+     *
+     * - `spender` cannot be the zero address.
+     */
+    function increaseAllowance(address spender, uint256 addedValue) public virtual returns (bool) {
+        address owner = _msgSender();
+        _approve(owner, spender, allowance(owner, spender) + addedValue);
+        return true;
+    }
+
+    /**
+     * @dev Atomically decreases the allowance granted to `spender` by the caller.
+     *
+     * This is an alternative to {approve} that can be used as a mitigation for
+     * problems described in {IERC20-approve}.
+     *
+     * Emits an {Approval} event indicating the updated allowance.
+     *
+     * Requirements:
+     *
+     * - `spender` cannot be the zero address.
+     * - `spender` must have allowance for the caller of at least
+     * `subtractedValue`.
+     */
+    function decreaseAllowance(address spender, uint256 subtractedValue) public virtual returns (bool) {
+        address owner = _msgSender();
+        uint256 currentAllowance = allowance(owner, spender);
+        require(currentAllowance >= subtractedValue, "ERC20: decreased allowance below zero");
+        unchecked {
+            _approve(owner, spender, currentAllowance - subtractedValue);
+        }
+
+        return true;
+    }
+
+    /**
+     * @dev Moves `amount` of tokens from `from` to `to`.
+     *
+     * This internal function is equivalent to {transfer}, and can be used to
+     * e.g. implement automatic token fees, slashing mechanisms, etc.
+     *
+     * Emits a {Transfer} event.
+     *
+     * Requirements:
+     *
+     * - `from` cannot be the zero address.
+     * - `to` cannot be the zero address.
+     * - `from` must have a balance of at least `amount`.
+     */
+    function _transfer(address from, address to, uint256 amount) internal virtual {
+        require(from != address(0), "ERC20: transfer from the zero address");
+        require(to != address(0), "ERC20: transfer to the zero address");
+
+        _beforeTokenTransfer(from, to, amount);
+
+        uint256 fromBalance = _balances[from];
+        require(fromBalance >= amount, "ERC20: transfer amount exceeds balance");
+        unchecked {
+            _balances[from] = fromBalance - amount;
+            // Overflow not possible: the sum of all balances is capped by totalSupply, and the sum is preserved by
+            // decrementing then incrementing.
+            _balances[to] += amount;
+        }
+
+        emit Transfer(from, to, amount);
+
+        _afterTokenTransfer(from, to, amount);
+    }
+
+    /** @dev Creates `amount` tokens and assigns them to `account`, increasing
+     * the total supply.
+     *
+     * Emits a {Transfer} event with `from` set to the zero address.
+     *
+     * Requirements:
+     *
+     * - `account` cannot be the zero address.
+     */
+    function _mint(address account, uint256 amount) internal virtual {
+        require(account != address(0), "ERC20: mint to the zero address");
+
+        _beforeTokenTransfer(address(0), account, amount);
+
+        _totalSupply += amount;
+        unchecked {
+            // Overflow not possible: balance + amount is at most totalSupply + amount, which is checked above.
+            _balances[account] += amount;
+        }
+        emit Transfer(address(0), account, amount);
+
+        _afterTokenTransfer(address(0), account, amount);
+    }
+
+    /**
+     * @dev Destroys `amount` tokens from `account`, reducing the
+     * total supply.
+     *
+     * Emits a {Transfer} event with `to` set to the zero address.
+     *
+     * Requirements:
+     *
+     * - `account` cannot be the zero address.
+     * - `account` must have at least `amount` tokens.
+     */
+    function _burn(address account, uint256 amount) internal virtual {
+        require(account != address(0), "ERC20: burn from the zero address");
+
+        _beforeTokenTransfer(account, address(0), amount);
+
+        uint256 accountBalance = _balances[account];
+        require(accountBalance >= amount, "ERC20: burn amount exceeds balance");
+        unchecked {
+            _balances[account] = accountBalance - amount;
+            // Overflow not possible: amount <= accountBalance <= totalSupply.
+            _totalSupply -= amount;
+        }
+
+        emit Transfer(account, address(0), amount);
+
+        _afterTokenTransfer(account, address(0), amount);
+    }
+
+    /**
+     * @dev Sets `amount` as the allowance of `spender` over the `owner` s tokens.
+     *
+     * This internal function is equivalent to `approve`, and can be used to
+     * e.g. set automatic allowances for certain subsystems, etc.
+     *
+     * Emits an {Approval} event.
+     *
+     * Requirements:
+     *
+     * - `owner` cannot be the zero address.
+     * - `spender` cannot be the zero address.
+     */
+    function _approve(address owner, address spender, uint256 amount) internal virtual {
+        require(owner != address(0), "ERC20: approve from the zero address");
+        require(spender != address(0), "ERC20: approve to the zero address");
+
+        _allowances[owner][spender] = amount;
+        emit Approval(owner, spender, amount);
+    }
+
+    /**
+     * @dev Updates `owner` s allowance for `spender` based on spent `amount`.
+     *
+     * Does not update the allowance amount in case of infinite allowance.
+     * Revert if not enough allowance is available.
+     *
+     * Might emit an {Approval} event.
+     */
+    function _spendAllowance(address owner, address spender, uint256 amount) internal virtual {
+        uint256 currentAllowance = allowance(owner, spender);
+        if (currentAllowance != type(uint256).max) {
+            require(currentAllowance >= amount, "ERC20: insufficient allowance");
+            unchecked {
+                _approve(owner, spender, currentAllowance - amount);
+            }
+        }
+    }
+
+    /**
+     * @dev Hook that is called before any transfer of tokens. This includes
+     * minting and burning.
+     *
+     * Calling conditions:
+     *
+     * - when `from` and `to` are both non-zero, `amount` of ``from``'s tokens
+     * will be transferred to `to`.
+     * - when `from` is zero, `amount` tokens will be minted for `to`.
+     * - when `to` is zero, `amount` of ``from``'s tokens will be burned.
+     * - `from` and `to` are never both zero.
+     *
+     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
+     */
+    function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual {}
+
+    /**
+     * @dev Hook that is called after any transfer of tokens. This includes
+     * minting and burning.
+     *
+     * Calling conditions:
+     *
+     * - when `from` and `to` are both non-zero, `amount` of ``from``'s tokens
+     * has been transferred to `to`.
+     * - when `from` is zero, `amount` tokens have been minted for `to`.
+     * - when `to` is zero, `amount` of ``from``'s tokens have been burned.
+     * - `from` and `to` are never both zero.
+     *
+     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
+     */
+    function _afterTokenTransfer(address from, address to, uint256 amount) internal virtual {}
+
+    /**
+     * @dev This empty reserved space is put in place to allow future versions to add new
+     * variables without shifting down storage in the inheritance chain.
+     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
+     */
+    uint256[45] private __gap;
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts (last updated v4.9.0) (token/ERC20/extensions/ERC20Permit.sol)
+
+pragma solidity ^0.8.0;
+
+import "./IERC20PermitUpgradeable.sol";
+import "../ERC20Upgradeable.sol";
+import "../../../utils/cryptography/ECDSAUpgradeable.sol";
+import "../../../utils/cryptography/EIP712Upgradeable.sol";
+import "../../../utils/CountersUpgradeable.sol";
+import "../../../proxy/utils/Initializable.sol";
+
+/**
+ * @dev Implementation of the ERC20 Permit extension allowing approvals to be made via signatures, as defined in
+ * https://eips.ethereum.org/EIPS/eip-2612[EIP-2612].
+ *
+ * Adds the {permit} method, which can be used to change an account's ERC20 allowance (see {IERC20-allowance}) by
+ * presenting a message signed by the account. By not relying on `{IERC20-approve}`, the token holder account doesn't
+ * need to send a transaction, and thus is not required to hold Ether at all.
+ *
+ * _Available since v3.4._
+ *
+ * @custom:storage-size 51
+ */
+abstract contract ERC20PermitUpgradeable is Initializable, ERC20Upgradeable, IERC20PermitUpgradeable, EIP712Upgradeable {
+    using CountersUpgradeable for CountersUpgradeable.Counter;
+
+    mapping(address => CountersUpgradeable.Counter) private _nonces;
+
+    // solhint-disable-next-line var-name-mixedcase
+    bytes32 private constant _PERMIT_TYPEHASH =
+        keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)");
+    /**
+     * @dev In previous versions `_PERMIT_TYPEHASH` was declared as `immutable`.
+     * However, to ensure consistency with the upgradeable transpiler, we will continue
+     * to reserve a slot.
+     * @custom:oz-renamed-from _PERMIT_TYPEHASH
+     */
+    // solhint-disable-next-line var-name-mixedcase
+    bytes32 private _PERMIT_TYPEHASH_DEPRECATED_SLOT;
+
+    /**
+     * @dev Initializes the {EIP712} domain separator using the `name` parameter, and setting `version` to `"1"`.
+     *
+     * It's a good idea to use the same `name` that is defined as the ERC20 token name.
+     */
+    function __ERC20Permit_init(string memory name) internal onlyInitializing {
+        __EIP712_init_unchained(name, "1");
+    }
+
+    function __ERC20Permit_init_unchained(string memory) internal onlyInitializing {}
+
+    /**
+     * @dev See {IERC20Permit-permit}.
+     */
+    function permit(
+        address owner,
+        address spender,
+        uint256 value,
+        uint256 deadline,
+        uint8 v,
+        bytes32 r,
+        bytes32 s
+    ) public virtual override {
+        require(block.timestamp <= deadline, "ERC20Permit: expired deadline");
+
+        bytes32 structHash = keccak256(abi.encode(_PERMIT_TYPEHASH, owner, spender, value, _useNonce(owner), deadline));
+
+        bytes32 hash = _hashTypedDataV4(structHash);
+
+        address signer = ECDSAUpgradeable.recover(hash, v, r, s);
+        require(signer == owner, "ERC20Permit: invalid signature");
+
+        _approve(owner, spender, value);
+    }
+
+    /**
+     * @dev See {IERC20Permit-nonces}.
+     */
+    function nonces(address owner) public view virtual override returns (uint256) {
+        return _nonces[owner].current();
+    }
+
+    /**
+     * @dev See {IERC20Permit-DOMAIN_SEPARATOR}.
+     */
+    // solhint-disable-next-line func-name-mixedcase
+    function DOMAIN_SEPARATOR() external view override returns (bytes32) {
+        return _domainSeparatorV4();
+    }
+
+    /**
+     * @dev "Consume a nonce": return the current value and increment.
+     *
+     * _Available since v4.1._
+     */
+    function _useNonce(address owner) internal virtual returns (uint256 current) {
+        CountersUpgradeable.Counter storage nonce = _nonces[owner];
+        current = nonce.current();
+        nonce.increment();
+    }
+
+    /**
+     * @dev This empty reserved space is put in place to allow future versions to add new
+     * variables without shifting down storage in the inheritance chain.
+     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
+     */
+    uint256[49] private __gap;
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts v4.4.1 (token/ERC20/extensions/IERC20Metadata.sol)
+
+pragma solidity ^0.8.0;
+
+import "../IERC20Upgradeable.sol";
+
+/**
+ * @dev Interface for the optional metadata functions from the ERC20 standard.
+ *
+ * _Available since v4.1._
+ */
+interface IERC20MetadataUpgradeable is IERC20Upgradeable {
+    /**
+     * @dev Returns the name of the token.
+     */
+    function name() external view returns (string memory);
+
+    /**
+     * @dev Returns the symbol of the token.
+     */
+    function symbol() external view returns (string memory);
+
+    /**
+     * @dev Returns the decimals places of the token.
+     */
+    function decimals() external view returns (uint8);
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts (last updated v4.9.0) (token/ERC20/extensions/IERC20Permit.sol)
+
+pragma solidity ^0.8.0;
+
+/**
+ * @dev Interface of the ERC20 Permit extension allowing approvals to be made via signatures, as defined in
+ * https://eips.ethereum.org/EIPS/eip-2612[EIP-2612].
+ *
+ * Adds the {permit} method, which can be used to change an account's ERC20 allowance (see {IERC20-allowance}) by
+ * presenting a message signed by the account. By not relying on {IERC20-approve}, the token holder account doesn't
+ * need to send a transaction, and thus is not required to hold Ether at all.
+ */
+interface IERC20PermitUpgradeable {
+    /**
+     * @dev Sets `value` as the allowance of `spender` over ``owner``'s tokens,
+     * given ``owner``'s signed approval.
+     *
+     * IMPORTANT: The same issues {IERC20-approve} has related to transaction
+     * ordering also apply here.
+     *
+     * Emits an {Approval} event.
+     *
+     * Requirements:
+     *
+     * - `spender` cannot be the zero address.
+     * - `deadline` must be a timestamp in the future.
+     * - `v`, `r` and `s` must be a valid `secp256k1` signature from `owner`
+     * over the EIP712-formatted function arguments.
+     * - the signature must use ``owner``'s current nonce (see {nonces}).
+     *
+     * For more information on the signature format, see the
+     * https://eips.ethereum.org/EIPS/eip-2612#specification[relevant EIP
+     * section].
+     */
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
+    /**
+     * @dev Returns the current nonce for `owner`. This value must be
+     * included whenever a signature is generated for {permit}.
+     *
+     * Every successful call to {permit} increases ``owner``'s nonce by one. This
+     * prevents a signature from being used multiple times.
+     */
+    function nonces(address owner) external view returns (uint256);
+
+    /**
+     * @dev Returns the domain separator used in the encoding of the signature for {permit}, as defined by {EIP712}.
+     */
+    // solhint-disable-next-line func-name-mixedcase
+    function DOMAIN_SEPARATOR() external view returns (bytes32);
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts (last updated v4.9.0) (token/ERC20/IERC20.sol)
+
+pragma solidity ^0.8.0;
+
+/**
+ * @dev Interface of the ERC20 standard as defined in the EIP.
+ */
+interface IERC20Upgradeable {
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
+     * @dev Returns the amount of tokens in existence.
+     */
+    function totalSupply() external view returns (uint256);
+
+    /**
+     * @dev Returns the amount of tokens owned by `account`.
+     */
+    function balanceOf(address account) external view returns (uint256);
+
+    /**
+     * @dev Moves `amount` tokens from the caller's account to `to`.
+     *
+     * Returns a boolean value indicating whether the operation succeeded.
+     *
+     * Emits a {Transfer} event.
+     */
+    function transfer(address to, uint256 amount) external returns (bool);
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
+     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
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
+    function approve(address spender, uint256 amount) external returns (bool);
+
+    /**
+     * @dev Moves `amount` tokens from `from` to `to` using the
+     * allowance mechanism. `amount` is then deducted from the caller's
+     * allowance.
+     *
+     * Returns a boolean value indicating whether the operation succeeded.
+     *
+     * Emits a {Transfer} event.
+     */
+    function transferFrom(address from, address to, uint256 amount) external returns (bool);
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts (last updated v4.9.3) (token/ERC20/utils/SafeERC20.sol)
+
+pragma solidity ^0.8.0;
+
+import "../IERC20Upgradeable.sol";
+import "../extensions/IERC20PermitUpgradeable.sol";
+import "../../../utils/AddressUpgradeable.sol";
+
+/**
+ * @title SafeERC20
+ * @dev Wrappers around ERC20 operations that throw on failure (when the token
+ * contract returns false). Tokens that return no value (and instead revert or
+ * throw on failure) are also supported, non-reverting calls are assumed to be
+ * successful.
+ * To use this library you can add a `using SafeERC20 for IERC20;` statement to your contract,
+ * which allows you to call the safe operations as `token.safeTransfer(...)`, etc.
+ */
+library SafeERC20Upgradeable {
+    using AddressUpgradeable for address;
+
+    /**
+     * @dev Transfer `value` amount of `token` from the calling contract to `to`. If `token` returns no value,
+     * non-reverting calls are assumed to be successful.
+     */
+    function safeTransfer(IERC20Upgradeable token, address to, uint256 value) internal {
+        _callOptionalReturn(token, abi.encodeWithSelector(token.transfer.selector, to, value));
+    }
+
+    /**
+     * @dev Transfer `value` amount of `token` from `from` to `to`, spending the approval given by `from` to the
+     * calling contract. If `token` returns no value, non-reverting calls are assumed to be successful.
+     */
+    function safeTransferFrom(IERC20Upgradeable token, address from, address to, uint256 value) internal {
+        _callOptionalReturn(token, abi.encodeWithSelector(token.transferFrom.selector, from, to, value));
+    }
+
+    /**
+     * @dev Deprecated. This function has issues similar to the ones found in
+     * {IERC20-approve}, and its usage is discouraged.
+     *
+     * Whenever possible, use {safeIncreaseAllowance} and
+     * {safeDecreaseAllowance} instead.
+     */
+    function safeApprove(IERC20Upgradeable token, address spender, uint256 value) 
[truncated — full diff is 231,303 bytes]
> ```

> </details>

> <details>
> <summary>📝 Source diff — upgrade #5 (<code>0xF62F...36D6</code> → <code>0x9f92...9fD9</code>): +15/-6346 lines (truncated)</summary>

> ```diff
--- old_impl
+++ new_impl
@@ -1,6352 +1,21 @@
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v4.9.0) (access/AccessControl.sol)
-
-pragma solidity ^0.8.0;
-
-import "./IAccessControlUpgradeable.sol";
-import "../utils/ContextUpgradeable.sol";
-import "../utils/StringsUpgradeable.sol";
-import "../utils/introspection/ERC165Upgradeable.sol";
-import "../proxy/utils/Initializable.sol";
-
-/**
- * @dev Contract module that allows children to implement role-based access
- * control mechanisms. This is a lightweight version that doesn't allow enumerating role
- * members except through off-chain means by accessing the contract event logs. Some
- * applications may benefit from on-chain enumerability, for those cases see
- * {AccessControlEnumerable}.
- *
- * Roles are referred to by their `bytes32` identifier. These should be exposed
- * in the external API and be unique. The best way to achieve this is by
- * using `public constant` hash digests:
- *
- * ```solidity
- * bytes32 public constant MY_ROLE = keccak256("MY_ROLE");
- * ```
- *
- * Roles can be used to represent a set of permissions. To restrict access to a
- * function call, use {hasRole}:
- *
- * ```solidity
- * function foo() public {
- *     require(hasRole(MY_ROLE, msg.sender));
- *     ...
- * }
- * ```
- *
- * Roles can be granted and revoked dynamically via the {grantRole} and
- * {revokeRole} functions. Each role has an associated admin role, and only
- * accounts that have a role's admin role can call {grantRole} and {revokeRole}.
- *
- * By default, the admin role for all roles is `DEFAULT_ADMIN_ROLE`, which means
- * that only accounts with this role will be able to grant or revoke other
- * roles. More complex role relationships can be created by using
- * {_setRoleAdmin}.
- *
- * WARNING: The `DEFAULT_ADMIN_ROLE` is also its own admin: it has permission to
- * grant and revoke this role. Extra precautions should be taken to secure
- * accounts that have been granted it. We recommend using {AccessControlDefaultAdminRules}
- * to enforce additional security measures for this role.
- */
-abstract contract AccessControlUpgradeable is Initializable, ContextUpgradeable, IAccessControlUpgradeable, ERC165Upgradeable {
-    function __AccessControl_init() internal onlyInitializing {
-    }
-
-    function __AccessControl_init_unchained() internal onlyInitializing {
-    }
-    struct RoleData {
-        mapping(address => bool) members;
-        bytes32 adminRole;
-    }
-
-    mapping(bytes32 => RoleData) private _roles;
-
-    bytes32 public constant DEFAULT_ADMIN_ROLE = 0x00;
-
-    /**
-     * @dev Modifier that checks that an account has a specific role. Reverts
-     * with a standardized message including the required role.
-     *
-     * The format of the revert reason is given by the following regular expression:
-     *
-     *  /^AccessControl: account (0x[0-9a-f]{40}) is missing role (0x[0-9a-f]{64})$/
-     *
-     * _Available since v4.1._
-     */
-    modifier onlyRole(bytes32 role) {
-        _checkRole(role);
-        _;
-    }
-
-    /**
-     * @dev See {IERC165-supportsInterface}.
-     */
-    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
-        return interfaceId == type(IAccessControlUpgradeable).interfaceId || super.supportsInterface(interfaceId);
-    }
-
-    /**
-     * @dev Returns `true` if `account` has been granted `role`.
-     */
-    function hasRole(bytes32 role, address account) public view virtual override returns (bool) {
-        return _roles[role].members[account];
-    }
-
-    /**
-     * @dev Revert with a standard message if `_msgSender()` is missing `role`.
-     * Overriding this function changes the behavior of the {onlyRole} modifier.
-     *
-     * Format of the revert message is described in {_checkRole}.
-     *
-     * _Available since v4.6._
-     */
-    function _checkRole(bytes32 role) internal view virtual {
-        _checkRole(role, _msgSender());
-    }
-
-    /**
-     * @dev Revert with a standard message if `account` is missing `role`.
-     *
-     * The format of the revert reason is given by the following regular expression:
-     *
-     *  /^AccessControl: account (0x[0-9a-f]{40}) is missing role (0x[0-9a-f]{64})$/
-     */
-    function _checkRole(bytes32 role, address account) internal view virtual {
-        if (!hasRole(role, account)) {
-            revert(
-                string(
-                    abi.encodePacked(
-                        "AccessControl: account ",
-                        StringsUpgradeable.toHexString(account),
-                        " is missing role ",
-                        StringsUpgradeable.toHexString(uint256(role), 32)
-                    )
-                )
-            );
-        }
-    }
-
-    /**
-     * @dev Returns the admin role that controls `role`. See {grantRole} and
-     * {revokeRole}.
-     *
-     * To change a role's admin, use {_setRoleAdmin}.
-     */
-    function getRoleAdmin(bytes32 role) public view virtual override returns (bytes32) {
-        return _roles[role].adminRole;
-    }
-
-    /**
-     * @dev Grants `role` to `account`.
-     *
-     * If `account` had not been already granted `role`, emits a {RoleGranted}
-     * event.
-     *
-     * Requirements:
-     *
-     * - the caller must have ``role``'s admin role.
-     *
-     * May emit a {RoleGranted} event.
-     */
-    function grantRole(bytes32 role, address account) public virtual override onlyRole(getRoleAdmin(role)) {
-        _grantRole(role, account);
-    }
-
-    /**
-     * @dev Revokes `role` from `account`.
-     *
-     * If `account` had been granted `role`, emits a {RoleRevoked} event.
-     *
-     * Requirements:
-     *
-     * - the caller must have ``role``'s admin role.
-     *
-     * May emit a {RoleRevoked} event.
-     */
-    function revokeRole(bytes32 role, address account) public virtual override onlyRole(getRoleAdmin(role)) {
-        _revokeRole(role, account);
-    }
-
-    /**
-     * @dev Revokes `role` from the calling account.
-     *
-     * Roles are often managed via {grantRole} and {revokeRole}: this function's
-     * purpose is to provide a mechanism for accounts to lose their privileges
-     * if they are compromised (such as when a trusted device is misplaced).
-     *
-     * If the calling account had been revoked `role`, emits a {RoleRevoked}
-     * event.
-     *
-     * Requirements:
-     *
-     * - the caller must be `account`.
-     *
-     * May emit a {RoleRevoked} event.
-     */
-    function renounceRole(bytes32 role, address account) public virtual override {
-        require(account == _msgSender(), "AccessControl: can only renounce roles for self");
-
-        _revokeRole(role, account);
-    }
-
-    /**
-     * @dev Grants `role` to `account`.
-     *
-     * If `account` had not been already granted `role`, emits a {RoleGranted}
-     * event. Note that unlike {grantRole}, this function doesn't perform any
-     * checks on the calling account.
-     *
-     * May emit a {RoleGranted} event.
-     *
-     * [WARNING]
-     * ====
-     * This function should only be called from the constructor when setting
-     * up the initial roles for the system.
-     *
-     * Using this function in any other way is effectively circumventing the admin
-     * system imposed by {AccessControl}.
-     * ====
-     *
-     * NOTE: This function is deprecated in favor of {_grantRole}.
-     */
-    function _setupRole(bytes32 role, address account) internal virtual {
-        _grantRole(role, account);
-    }
-
-    /**
-     * @dev Sets `adminRole` as ``role``'s admin role.
-     *
-     * Emits a {RoleAdminChanged} event.
-     */
-    function _setRoleAdmin(bytes32 role, bytes32 adminRole) internal virtual {
-        bytes32 previousAdminRole = getRoleAdmin(role);
-        _roles[role].adminRole = adminRole;
-        emit RoleAdminChanged(role, previousAdminRole, adminRole);
-    }
-
-    /**
-     * @dev Grants `role` to `account`.
-     *
-     * Internal function without access restriction.
-     *
-     * May emit a {RoleGranted} event.
-     */
-    function _grantRole(bytes32 role, address account) internal virtual {
-        if (!hasRole(role, account)) {
-            _roles[role].members[account] = true;
-            emit RoleGranted(role, account, _msgSender());
-        }
-    }
-
-    /**
-     * @dev Revokes `role` from `account`.
-     *
-     * Internal function without access restriction.
-     *
-     * May emit a {RoleRevoked} event.
-     */
-    function _revokeRole(bytes32 role, address account) internal virtual {
-        if (hasRole(role, account)) {
-            _roles[role].members[account] = false;
-            emit RoleRevoked(role, account, _msgSender());
-        }
-    }
-
-    /**
-     * @dev This empty reserved space is put in place to allow future versions to add new
-     * variables without shifting down storage in the inheritance chain.
-     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
-     */
-    uint256[49] private __gap;
-}
-
-
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts v4.4.1 (access/IAccessControl.sol)
-
-pragma solidity ^0.8.0;
-
-/**
- * @dev External interface of AccessControl declared to support ERC165 detection.
- */
-interface IAccessControlUpgradeable {
-    /**
-     * @dev Emitted when `newAdminRole` is set as ``role``'s admin role, replacing `previousAdminRole`
-     *
-     * `DEFAULT_ADMIN_ROLE` is the starting admin for all roles, despite
-     * {RoleAdminChanged} not being emitted signaling this.
-     *
-     * _Available since v3.1._
-     */
-    event RoleAdminChanged(bytes32 indexed role, bytes32 indexed previousAdminRole, bytes32 indexed newAdminRole);
-
-    /**
-     * @dev Emitted when `account` is granted `role`.
-     *
-     * `sender` is the account that originated the contract call, an admin role
-     * bearer except when using {AccessControl-_setupRole}.
-     */
-    event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender);
-
-    /**
-     * @dev Emitted when `account` is revoked `role`.
-     *
-     * `sender` is the account that originated the contract call:
-     *   - if using `revokeRole`, it is the admin role bearer
-     *   - if using `renounceRole`, it is the role bearer (i.e. `account`)
-     */
-    event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender);
-
-    /**
-     * @dev Returns `true` if `account` has been granted `role`.
-     */
-    function hasRole(bytes32 role, address account) external view returns (bool);
-
-    /**
-     * @dev Returns the admin role that controls `role`. See {grantRole} and
-     * {revokeRole}.
-     *
-     * To change a role's admin, use {AccessControl-_setRoleAdmin}.
-     */
-    function getRoleAdmin(bytes32 role) external view returns (bytes32);
-
-    /**
-     * @dev Grants `role` to `account`.
-     *
-     * If `account` had not been already granted `role`, emits a {RoleGranted}
-     * event.
-     *
-     * Requirements:
-     *
-     * - the caller must have ``role``'s admin role.
-     */
-    function grantRole(bytes32 role, address account) external;
-
-    /**
-     * @dev Revokes `role` from `account`.
-     *
-     * If `account` had been granted `role`, emits a {RoleRevoked} event.
-     *
-     * Requirements:
-     *
-     * - the caller must have ``role``'s admin role.
-     */
-    function revokeRole(bytes32 role, address account) external;
-
-    /**
-     * @dev Revokes `role` from the calling account.
-     *
-     * Roles are often managed via {grantRole} and {revokeRole}: this function's
-     * purpose is to provide a mechanism for accounts to lose their privileges
-     * if they are compromised (such as when a trusted device is misplaced).
-     *
-     * If the calling account had been granted `role`, emits a {RoleRevoked}
-     * event.
-     *
-     * Requirements:
-     *
-     * - the caller must be `account`.
-     */
-    function renounceRole(bytes32 role, address account) external;
-}
-
-
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v4.9.0) (interfaces/IERC5267.sol)
-
-pragma solidity ^0.8.0;
-
-interface IERC5267Upgradeable {
-    /**
-     * @dev MAY be emitted to signal that the domain could have changed.
-     */
-    event EIP712DomainChanged();
-
-    /**
-     * @dev returns the fields and values that describe the domain separator used by this contract for EIP-712
-     * signature.
-     */
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
-}
-
-
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v4.9.0) (proxy/utils/Initializable.sol)
-
-pragma solidity ^0.8.2;
-
-import "../../utils/AddressUpgradeable.sol";
-
-/**
- * @dev This is a base contract to aid in writing upgradeable contracts, or any kind of contract that will be deployed
- * behind a proxy. Since proxied contracts do not make use of a constructor, it's common to move constructor logic to an
- * external initializer function, usually called `initialize`. It then becomes necessary to protect this initializer
- * function so it can only be called once. The {initializer} modifier provided by this contract will have this effect.
- *
- * The initialization functions use a version number. Once a version number is used, it is consumed and cannot be
- * reused. This mechanism prevents re-execution of each "step" but allows the creation of new initialization steps in
- * case an upgrade adds a module that needs to be initialized.
- *
- * For example:
- *
- * [.hljs-theme-light.nopadding]
- * ```solidity
- * contract MyToken is ERC20Upgradeable {
- *     function initialize() initializer public {
- *         __ERC20_init("MyToken", "MTK");
- *     }
- * }
- *
- * contract MyTokenV2 is MyToken, ERC20PermitUpgradeable {
- *     function initializeV2() reinitializer(2) public {
- *         __ERC20Permit_init("MyToken");
- *     }
- * }
- * ```
- *
- * TIP: To avoid leaving the proxy in an uninitialized state, the initializer function should be called as early as
- * possible by providing the encoded function call as the `_data` argument to {ERC1967Proxy-constructor}.
- *
- * CAUTION: When used with inheritance, manual care must be taken to not invoke a parent initializer twice, or to ensure
- * that all initializers are idempotent. This is not verified automatically as constructors are by Solidity.
- *
- * [CAUTION]
- * ====
- * Avoid leaving a contract uninitialized.
- *
- * An uninitialized contract can be taken over by an attacker. This applies to both a proxy and its implementation
- * contract, which may impact the proxy. To prevent the implementation contract from being used, you should invoke
- * the {_disableInitializers} function in the constructor to automatically lock it when it is deployed:
- *
- * [.hljs-theme-light.nopadding]
- * ```
- * /// @custom:oz-upgrades-unsafe-allow constructor
- * constructor() {
- *     _disableInitializers();
- * }
- * ```
- * ====
- */
-abstract contract Initializable {
-    /**
-     * @dev Indicates that the contract has been initialized.
-     * @custom:oz-retyped-from bool
-     */
-    uint8 private _initialized;
-
-    /**
-     * @dev Indicates that the contract is in the process of being initialized.
-     */
-    bool private _initializing;
-
-    /**
-     * @dev Triggered when the contract has been initialized or reinitialized.
-     */
-    event Initialized(uint8 version);
-
-    /**
-     * @dev A modifier that defines a protected initializer function that can be invoked at most once. In its scope,
-     * `onlyInitializing` functions can be used to initialize parent contracts.
-     *
-     * Similar to `reinitializer(1)`, except that functions marked with `initializer` can be nested in the context of a
-     * constructor.
-     *
-     * Emits an {Initialized} event.
-     */
-    modifier initializer() {
-        bool isTopLevelCall = !_initializing;
-        require(
-            (isTopLevelCall && _initialized < 1) || (!AddressUpgradeable.isContract(address(this)) && _initialized == 1),
-            "Initializable: contract is already initialized"
-        );
-        _initialized = 1;
-        if (isTopLevelCall) {
-            _initializing = true;
-        }
-        _;
-        if (isTopLevelCall) {
-            _initializing = false;
-            emit Initialized(1);
-        }
-    }
-
-    /**
-     * @dev A modifier that defines a protected reinitializer function that can be invoked at most once, and only if the
-     * contract hasn't been initialized to a greater version before. In its scope, `onlyInitializing` functions can be
-     * used to initialize parent contracts.
-     *
-     * A reinitializer may be used after the original initialization step. This is essential to configure modules that
-     * are added through upgrades and that require initialization.
-     *
-     * When `version` is 1, this modifier is similar to `initializer`, except that functions marked with `reinitializer`
-     * cannot be nested. If one is invoked in the context of another, execution will revert.
-     *
-     * Note that versions can jump in increments greater than 1; this implies that if multiple reinitializers coexist in
-     * a contract, executing them in the right order is up to the developer or operator.
-     *
-     * WARNING: setting the version to 255 will prevent any future reinitialization.
-     *
-     * Emits an {Initialized} event.
-     */
-    modifier reinitializer(uint8 version) {
-        require(!_initializing && _initialized < version, "Initializable: contract is already initialized");
-        _initialized = version;
-        _initializing = true;
-        _;
-        _initializing = false;
-        emit Initialized(version);
-    }
-
-    /**
-     * @dev Modifier to protect an initialization function so that it can only be invoked by functions with the
-     * {initializer} and {reinitializer} modifiers, directly or indirectly.
-     */
-    modifier onlyInitializing() {
-        require(_initializing, "Initializable: contract is not initializing");
-        _;
-    }
-
-    /**
-     * @dev Locks the contract, preventing any future reinitialization. This cannot be part of an initializer call.
-     * Calling this in the constructor of a contract will prevent that contract from being initialized or reinitialized
-     * to any version. It is recommended to use this to lock implementation contracts that are designed to be called
-     * through proxies.
-     *
-     * Emits an {Initialized} event the first time it is successfully executed.
-     */
-    function _disableInitializers() internal virtual {
-        require(!_initializing, "Initializable: contract is initializing");
-        if (_initialized != type(uint8).max) {
-            _initialized = type(uint8).max;
-            emit Initialized(type(uint8).max);
-        }
-    }
-
-    /**
-     * @dev Returns the highest version that has been initialized. See {reinitializer}.
-     */
-    function _getInitializedVersion() internal view returns (uint8) {
-        return _initialized;
-    }
-
-    /**
-     * @dev Returns `true` if the contract is currently initializing. See {onlyInitializing}.
-     */
-    function _isInitializing() internal view returns (bool) {
-        return _initializing;
-    }
-}
-
-
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v4.9.0) (security/ReentrancyGuard.sol)
-
-pragma solidity ^0.8.0;
-import "../proxy/utils/Initializable.sol";
-
-/**
- * @dev Contract module that helps prevent reentrant calls to a function.
- *
- * Inheriting from `ReentrancyGuard` will make the {nonReentrant} modifier
- * available, which can be applied to functions to make sure there are no nested
- * (reentrant) calls to them.
- *
- * Note that because there is a single `nonReentrant` guard, functions marked as
- * `nonReentrant` may not call one another. This can be worked around by making
- * those functions `private`, and then adding `external` `nonReentrant` entry
- * points to them.
- *
- * TIP: If you would like to learn more about reentrancy and alternative ways
- * to protect against it, check out our blog post
- * https://blog.openzeppelin.com/reentrancy-after-istanbul/[Reentrancy After Istanbul].
- */
-abstract contract ReentrancyGuardUpgradeable is Initializable {
-    // Booleans are more expensive than uint256 or any type that takes up a full
-    // word because each write operation emits an extra SLOAD to first read the
-    // slot's contents, replace the bits taken up by the boolean, and then write
-    // back. This is the compiler's defense against contract upgrades and
-    // pointer aliasing, and it cannot be disabled.
-
-    // The values being non-zero value makes deployment a bit more expensive,
-    // but in exchange the refund on every call to nonReentrant will be lower in
-    // amount. Since refunds are capped to a percentage of the total
-    // transaction's gas, it is best to keep them low in cases like this one, to
-    // increase the likelihood of the full refund coming into effect.
-    uint256 private constant _NOT_ENTERED = 1;
-    uint256 private constant _ENTERED = 2;
-
-    uint256 private _status;
-
-    function __ReentrancyGuard_init() internal onlyInitializing {
-        __ReentrancyGuard_init_unchained();
-    }
-
-    function __ReentrancyGuard_init_unchained() internal onlyInitializing {
-        _status = _NOT_ENTERED;
-    }
-
-    /**
-     * @dev Prevents a contract from calling itself, directly or indirectly.
-     * Calling a `nonReentrant` function from another `nonReentrant`
-     * function is not supported. It is possible to prevent this from happening
-     * by making the `nonReentrant` function external, and making it call a
-     * `private` function that does the actual work.
-     */
-    modifier nonReentrant() {
-        _nonReentrantBefore();
-        _;
-        _nonReentrantAfter();
-    }
-
-    function _nonReentrantBefore() private {
-        // On the first call to nonReentrant, _status will be _NOT_ENTERED
-        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");
-
-        // Any calls to nonReentrant after this point will fail
-        _status = _ENTERED;
-    }
-
-    function _nonReentrantAfter() private {
-        // By storing the original value once again, a refund is triggered (see
-        // https://eips.ethereum.org/EIPS/eip-2200)
-        _status = _NOT_ENTERED;
-    }
-
-    /**
-     * @dev Returns true if the reentrancy guard is currently set to "entered", which indicates there is a
-     * `nonReentrant` function in the call stack.
-     */
-    function _reentrancyGuardEntered() internal view returns (bool) {
-        return _status == _ENTERED;
-    }
-
-    /**
-     * @dev This empty reserved space is put in place to allow future versions to add new
-     * variables without shifting down storage in the inheritance chain.
-     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
-     */
-    uint256[49] private __gap;
-}
-
-
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v4.9.0) (token/ERC20/ERC20.sol)
-
-pragma solidity ^0.8.0;
-
-import "./IERC20Upgradeable.sol";
-import "./extensions/IERC20MetadataUpgradeable.sol";
-import "../../utils/ContextUpgradeable.sol";
-import "../../proxy/utils/Initializable.sol";
-
-/**
- * @dev Implementation of the {IERC20} interface.
- *
- * This implementation is agnostic to the way tokens are created. This means
- * that a supply mechanism has to be added in a derived contract using {_mint}.
- * For a generic mechanism see {ERC20PresetMinterPauser}.
- *
- * TIP: For a detailed writeup see our guide
- * https://forum.openzeppelin.com/t/how-to-implement-erc20-supply-mechanisms/226[How
- * to implement supply mechanisms].
- *
- * The default value of {decimals} is 18. To change this, you should override
- * this function so it returns a different value.
- *
- * We have followed general OpenZeppelin Contracts guidelines: functions revert
- * instead returning `false` on failure. This behavior is nonetheless
- * conventional and does not conflict with the expectations of ERC20
- * applications.
- *
- * Additionally, an {Approval} event is emitted on calls to {transferFrom}.
- * This allows applications to reconstruct the allowance for all accounts just
- * by listening to said events. Other implementations of the EIP may not emit
- * these events, as it isn't required by the specification.
- *
- * Finally, the non-standard {decreaseAllowance} and {increaseAllowance}
- * functions have been added to mitigate the well-known issues around setting
- * allowances. See {IERC20-approve}.
- */
-contract ERC20Upgradeable is Initializable, ContextUpgradeable, IERC20Upgradeable, IERC20MetadataUpgradeable {
-    mapping(address => uint256) private _balances;
-
-    mapping(address => mapping(address => uint256)) private _allowances;
-
-    uint256 private _totalSupply;
-
-    string private _name;
-    string private _symbol;
-
-    /**
-     * @dev Sets the values for {name} and {symbol}.
-     *
-     * All two of these values are immutable: they can only be set once during
-     * construction.
-     */
-    function __ERC20_init(string memory name_, string memory symbol_) internal onlyInitializing {
-        __ERC20_init_unchained(name_, symbol_);
-    }
-
-    function __ERC20_init_unchained(string memory name_, string memory symbol_) internal onlyInitializing {
-        _name = name_;
-        _symbol = symbol_;
-    }
-
-    /**
-     * @dev Returns the name of the token.
-     */
-    function name() public view virtual override returns (string memory) {
-        return _name;
-    }
-
-    /**
-     * @dev Returns the symbol of the token, usually a shorter version of the
-     * name.
-     */
-    function symbol() public view virtual override returns (string memory) {
-        return _symbol;
-    }
-
-    /**
-     * @dev Returns the number of decimals used to get its user representation.
-     * For example, if `decimals` equals `2`, a balance of `505` tokens should
-     * be displayed to a user as `5.05` (`505 / 10 ** 2`).
-     *
-     * Tokens usually opt for a value of 18, imitating the relationship between
-     * Ether and Wei. This is the default value returned by this function, unless
-     * it's overridden.
-     *
-     * NOTE: This information is only used for _display_ purposes: it in
-     * no way affects any of the arithmetic of the contract, including
-     * {IERC20-balanceOf} and {IERC20-transfer}.
-     */
-    function decimals() public view virtual override returns (uint8) {
-        return 18;
-    }
-
-    /**
-     * @dev See {IERC20-totalSupply}.
-     */
-    function totalSupply() public view virtual override returns (uint256) {
-        return _totalSupply;
-    }
-
-    /**
-     * @dev See {IERC20-balanceOf}.
-     */
-    function balanceOf(address account) public view virtual override returns (uint256) {
-        return _balances[account];
-    }
-
-    /**
-     * @dev See {IERC20-transfer}.
-     *
-     * Requirements:
-     *
-     * - `to` cannot be the zero address.
-     * - the caller must have a balance of at least `amount`.
-     */
-    function transfer(address to, uint256 amount) public virtual override returns (bool) {
-        address owner = _msgSender();
-        _transfer(owner, to, amount);
-        return true;
-    }
-
-    /**
-     * @dev See {IERC20-allowance}.
-     */
-    function allowance(address owner, address spender) public view virtual override returns (uint256) {
-        return _allowances[owner][spender];
-    }
-
-    /**
-     * @dev See {IERC20-approve}.
-     *
-     * NOTE: If `amount` is the maximum `uint256`, the allowance is not updated on
-     * `transferFrom`. This is semantically equivalent to an infinite approval.
-     *
-     * Requirements:
-     *
-     * - `spender` cannot be the zero address.
-     */
-    function approve(address spender, uint256 amount) public virtual override returns (bool) {
-        address owner = _msgSender();
-        _approve(owner, spender, amount);
-        return true;
-    }
-
-    /**
-     * @dev See {IERC20-transferFrom}.
-     *
-     * Emits an {Approval} event indicating the updated allowance. This is not
-     * required by the EIP. See the note at the beginning of {ERC20}.
-     *
-     * NOTE: Does not update the allowance if the current allowance
-     * is the maximum `uint256`.
-     *
-     * Requirements:
-     *
-     * - `from` and `to` cannot be the zero address.
-     * - `from` must have a balance of at least `amount`.
-     * - the caller must have allowance for ``from``'s tokens of at least
-     * `amount`.
-     */
-    function transferFrom(address from, address to, uint256 amount) public virtual override returns (bool) {
-        address spender = _msgSender();
-        _spendAllowance(from, spender, amount);
-        _transfer(from, to, amount);
-        return true;
-    }
-
-    /**
-     * @dev Atomically increases the allowance granted to `spender` by the caller.
-     *
-     * This is an alternative to {approve} that can be used as a mitigation for
-     * problems described in {IERC20-approve}.
-     *
-     * Emits an {Approval} event indicating the updated allowance.
-     *
-     * Requirements:
-     *
-     * - `spender` cannot be the zero address.
-     */
-    function increaseAllowance(address spender, uint256 addedValue) public virtual returns (bool) {
-        address owner = _msgSender();
-        _approve(owner, spender, allowance(owner, spender) + addedValue);
-        return true;
-    }
-
-    /**
-     * @dev Atomically decreases the allowance granted to `spender` by the caller.
-     *
-     * This is an alternative to {approve} that can be used as a mitigation for
-     * problems described in {IERC20-approve}.
-     *
-     * Emits an {Approval} event indicating the updated allowance.
-     *
-     * Requirements:
-     *
-     * - `spender` cannot be the zero address.
-     * - `spender` must have allowance for the caller of at least
-     * `subtractedValue`.
-     */
-    function decreaseAllowance(address spender, uint256 subtractedValue) public virtual returns (bool) {
-        address owner = _msgSender();
-        uint256 currentAllowance = allowance(owner, spender);
-        require(currentAllowance >= subtractedValue, "ERC20: decreased allowance below zero");
-        unchecked {
-            _approve(owner, spender, currentAllowance - subtractedValue);
-        }
-
-        return true;
-    }
-
-    /**
-     * @dev Moves `amount` of tokens from `from` to `to`.
-     *
-     * This internal function is equivalent to {transfer}, and can be used to
-     * e.g. implement automatic token fees, slashing mechanisms, etc.
-     *
-     * Emits a {Transfer} event.
-     *
-     * Requirements:
-     *
-     * - `from` cannot be the zero address.
-     * - `to` cannot be the zero address.
-     * - `from` must have a balance of at least `amount`.
-     */
-    function _transfer(address from, address to, uint256 amount) internal virtual {
-        require(from != address(0), "ERC20: transfer from the zero address");
-        require(to != address(0), "ERC20: transfer to the zero address");
-
-        _beforeTokenTransfer(from, to, amount);
-
-        uint256 fromBalance = _balances[from];
-        require(fromBalance >= amount, "ERC20: transfer amount exceeds balance");
-        unchecked {
-            _balances[from] = fromBalance - amount;
-            // Overflow not possible: the sum of all balances is capped by totalSupply, and the sum is preserved by
-            // decrementing then incrementing.
-            _balances[to] += amount;
-        }
-
-        emit Transfer(from, to, amount);
-
-        _afterTokenTransfer(from, to, amount);
-    }
-
-    /** @dev Creates `amount` tokens and assigns them to `account`, increasing
-     * the total supply.
-     *
-     * Emits a {Transfer} event with `from` set to the zero address.
-     *
-     * Requirements:
-     *
-     * - `account` cannot be the zero address.
-     */
-    function _mint(address account, uint256 amount) internal virtual {
-        require(account != address(0), "ERC20: mint to the zero address");
-
-        _beforeTokenTransfer(address(0), account, amount);
-
-        _totalSupply += amount;
-        unchecked {
-            // Overflow not possible: balance + amount is at most totalSupply + amount, which is checked above.
-            _balances[account] += amount;
-        }
-        emit Transfer(address(0), account, amount);
-
-        _afterTokenTransfer(address(0), account, amount);
-    }
-
-    /**
-     * @dev Destroys `amount` tokens from `account`, reducing the
-     * total supply.
-     *
-     * Emits a {Transfer} event with `to` set to the zero address.
-     *
-     * Requirements:
-     *
-     * - `account` cannot be the zero address.
-     * - `account` must have at least `amount` tokens.
-     */
-    function _burn(address account, uint256 amount) internal virtual {
-        require(account != address(0), "ERC20: burn from the zero address");
-
-        _beforeTokenTransfer(account, address(0), amount);
-
-        uint256 accountBalance = _balances[account];
-        require(accountBalance >= amount, "ERC20: burn amount exceeds balance");
-        unchecked {
-            _balances[account] = accountBalance - amount;
-            // Overflow not possible: amount <= accountBalance <= totalSupply.
-            _totalSupply -= amount;
-        }
-
-        emit Transfer(account, address(0), amount);
-
-        _afterTokenTransfer(account, address(0), amount);
-    }
-
-    /**
-     * @dev Sets `amount` as the allowance of `spender` over the `owner` s tokens.
-     *
-     * This internal function is equivalent to `approve`, and can be used to
-     * e.g. set automatic allowances for certain subsystems, etc.
-     *
-     * Emits an {Approval} event.
-     *
-     * Requirements:
-     *
-     * - `owner` cannot be the zero address.
-     * - `spender` cannot be the zero address.
-     */
-    function _approve(address owner, address spender, uint256 amount) internal virtual {
-        require(owner != address(0), "ERC20: approve from the zero address");
-        require(spender != address(0), "ERC20: approve to the zero address");
-
-        _allowances[owner][spender] = amount;
-        emit Approval(owner, spender, amount);
-    }
-
-    /**
-     * @dev Updates `owner` s allowance for `spender` based on spent `amount`.
-     *
-     * Does not update the allowance amount in case of infinite allowance.
-     * Revert if not enough allowance is available.
-     *
-     * Might emit an {Approval} event.
-     */
-    function _spendAllowance(address owner, address spender, uint256 amount) internal virtual {
-        uint256 currentAllowance = allowance(owner, spender);
-        if (currentAllowance != type(uint256).max) {
-            require(currentAllowance >= amount, "ERC20: insufficient allowance");
-            unchecked {
-                _approve(owner, spender, currentAllowance - amount);
-            }
-        }
-    }
-
-    /**
-     * @dev Hook that is called before any transfer of tokens. This includes
-     * minting and burning.
-     *
-     * Calling conditions:
-     *
-     * - when `from` and `to` are both non-zero, `amount` of ``from``'s tokens
-     * will be transferred to `to`.
-     * - when `from` is zero, `amount` tokens will be minted for `to`.
-     * - when `to` is zero, `amount` of ``from``'s tokens will be burned.
-     * - `from` and `to` are never both zero.
-     *
-     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
-     */
-    function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual {}
-
-    /**
-     * @dev Hook that is called after any transfer of tokens. This includes
-     * minting and burning.
-     *
-     * Calling conditions:
-     *
-     * - when `from` and `to` are both non-zero, `amount` of ``from``'s tokens
-     * has been transferred to `to`.
-     * - when `from` is zero, `amount` tokens have been minted for `to`.
-     * - when `to` is zero, `amount` of ``from``'s tokens have been burned.
-     * - `from` and `to` are never both zero.
-     *
-     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
-     */
-    function _afterTokenTransfer(address from, address to, uint256 amount) internal virtual {}
-
-    /**
-     * @dev This empty reserved space is put in place to allow future versions to add new
-     * variables without shifting down storage in the inheritance chain.
-     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
-     */
-    uint256[45] private __gap;
-}
-
-
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v4.9.0) (token/ERC20/extensions/ERC20Permit.sol)
-
-pragma solidity ^0.8.0;
-
-import "./IERC20PermitUpgradeable.sol";
-import "../ERC20Upgradeable.sol";
-import "../../../utils/cryptography/ECDSAUpgradeable.sol";
-import "../../../utils/cryptography/EIP712Upgradeable.sol";
-import "../../../utils/CountersUpgradeable.sol";
-import "../../../proxy/utils/Initializable.sol";
-
-/**
- * @dev Implementation of the ERC20 Permit extension allowing approvals to be made via signatures, as defined in
- * https://eips.ethereum.org/EIPS/eip-2612[EIP-2612].
- *
- * Adds the {permit} method, which can be used to change an account's ERC20 allowance (see {IERC20-allowance}) by
- * presenting a message signed by the account. By not relying on `{IERC20-approve}`, the token holder account doesn't
- * need to send a transaction, and thus is not required to hold Ether at all.
- *
- * _Available since v3.4._
- *
- * @custom:storage-size 51
- */
-abstract contract ERC20PermitUpgradeable is Initializable, ERC20Upgradeable, IERC20PermitUpgradeable, EIP712Upgradeable {
-    using CountersUpgradeable for CountersUpgradeable.Counter;
-
-    mapping(address => CountersUpgradeable.Counter) private _nonces;
-
-    // solhint-disable-next-line var-name-mixedcase
-    bytes32 private constant _PERMIT_TYPEHASH =
-        keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)");
-    /**
-     * @dev In previous versions `_PERMIT_TYPEHASH` was declared as `immutable`.
-     * However, to ensure consistency with the upgradeable transpiler, we will continue
-     * to reserve a slot.
-     * @custom:oz-renamed-from _PERMIT_TYPEHASH
-     */
-    // solhint-disable-next-line var-name-mixedcase
-    bytes32 private _PERMIT_TYPEHASH_DEPRECATED_SLOT;
-
-    /**
-     * @dev Initializes the {EIP712} domain separator using the `name` parameter, and setting `version` to `"1"`.
-     *
-     * It's a good idea to use the same `name` that is defined as the ERC20 token name.
-     */
-    function __ERC20Permit_init(string memory name) internal onlyInitializing {
-        __EIP712_init_unchained(name, "1");
-    }
-
-    function __ERC20Permit_init_unchained(string memory) internal onlyInitializing {}
-
-    /**
-     * @dev See {IERC20Permit-permit}.
-     */
-    function permit(
-        address owner,
-        address spender,
-        uint256 value,
-        uint256 deadline,
-        uint8 v,
-        bytes32 r,
-        bytes32 s
-    ) public virtual override {
-        require(block.timestamp <= deadline, "ERC20Permit: expired deadline");
-
-        bytes32 structHash = keccak256(abi.encode(_PERMIT_TYPEHASH, owner, spender, value, _useNonce(owner), deadline));
-
-        bytes32 hash = _hashTypedDataV4(structHash);
-
-        address signer = ECDSAUpgradeable.recover(hash, v, r, s);
-        require(signer == owner, "ERC20Permit: invalid signature");
-
-        _approve(owner, spender, value);
-    }
-
-    /**
-     * @dev See {IERC20Permit-nonces}.
-     */
-    function nonces(address owner) public view virtual override returns (uint256) {
-        return _nonces[owner].current();
-    }
-
-    /**
-     * @dev See {IERC20Permit-DOMAIN_SEPARATOR}.
-     */
-    // solhint-disable-next-line func-name-mixedcase
-    function DOMAIN_SEPARATOR() external view override returns (bytes32) {
-        return _domainSeparatorV4();
-    }
-
-    /**
-     * @dev "Consume a nonce": return the current value and increment.
-     *
-     * _Available since v4.1._
-     */
-    function _useNonce(address owner) internal virtual returns (uint256 current) {
-        CountersUpgradeable.Counter storage nonce = _nonces[owner];
-        current = nonce.current();
-        nonce.increment();
-    }
-
-    /**
-     * @dev This empty reserved space is put in place to allow future versions to add new
-     * variables without shifting down storage in the inheritance chain.
-     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
-     */
-    uint256[49] private __gap;
-}
-
-
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts v4.4.1 (token/ERC20/extensions/IERC20Metadata.sol)
-
-pragma solidity ^0.8.0;
-
-import "../IERC20Upgradeable.sol";
-
-/**
- * @dev Interface for the optional metadata functions from the ERC20 standard.
- *
- * _Available since v4.1._
- */
-interface IERC20MetadataUpgradeable is IERC20Upgradeable {
-    /**
-     * @dev Returns the name of the token.
-     */
-    function name() external view returns (string memory);
-
-    /**
-     * @dev Returns the symbol of the token.
-     */
-    function symbol() external view returns (string memory);
-
-    /**
-     * @dev Returns the decimals places of the token.
-     */
-    function decimals() external view returns (uint8);
-}
-
-
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v4.9.0) (token/ERC20/extensions/IERC20Permit.sol)
-
-pragma solidity ^0.8.0;
-
-/**
- * @dev Interface of the ERC20 Permit extension allowing approvals to be made via signatures, as defined in
- * https://eips.ethereum.org/EIPS/eip-2612[EIP-2612].
- *
- * Adds the {permit} method, which can be used to change an account's ERC20 allowance (see {IERC20-allowance}) by
- * presenting a message signed by the account. By not relying on {IERC20-approve}, the token holder account doesn't
- * need to send a transaction, and thus is not required to hold Ether at all.
- */
-interface IERC20PermitUpgradeable {
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
-// OpenZeppelin Contracts (last updated v4.9.0) (token/ERC20/IERC20.sol)
-
-pragma solidity ^0.8.0;
-
-/**
- * @dev Interface of the ERC20 standard as defined in the EIP.
- */
-interface IERC20Upgradeable {
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
-     * @dev Returns the amount of tokens in existence.
-     */
-    function totalSupply() external view returns (uint256);
-
-    /**
-     * @dev Returns the amount of tokens owned by `account`.
-     */
-    function balanceOf(address account) external view returns (uint256);
-
-    /**
-     * @dev Moves `amount` tokens from the caller's account to `to`.
-     *
-     * Returns a boolean value indicating whether the operation succeeded.
-     *
-     * Emits a {Transfer} event.
-     */
-    function transfer(address to, uint256 amount) external returns (bool);
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
-     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
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
-    function approve(address spender, uint256 amount) external returns (bool);
-
-    /**
-     * @dev Moves `amount` tokens from `from` to `to` using the
-     * allowance mechanism. `amount` is then deducted from the caller's
-     * allowance.
-     *
-     * Returns a boolean value indicating whether the operation succeeded.
-     *
-     * Emits a {Transfer} event.
-     */
-    function transferFrom(address from, address to, uint256 amount) external returns (bool);
-}
-
-
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v4.9.3) (token/ERC20/utils/SafeERC20.sol)
-
-pragma solidity ^0.8.0;
-
-import "../IERC20Upgradeable.sol";
-import "../extensions/IERC20PermitUpgradeable.sol";
-import "../../../utils/AddressUpgradeable.sol";
-
-/**
- * @title SafeERC20
- * @dev Wrappers around ERC20 operations that throw on failure (when the token
- * contract returns false). Tokens that return no value (and instead revert or
- * throw on failure) are also supported, non-reverting calls are assumed to be
- * successful.
- * To use this library you can add a `using SafeERC20 for IERC20;` statement to your contract,
- * which allows you to call the safe operations as `token.safeTransfer(...)`, etc.
- */
-library SafeERC20Upgradeable {
-    using AddressUpgradeable for address;
-
-    /**
-     * @dev Transfer `value` amount of `token` from the calling contract to `to`. If `token` returns no value,
-     * non-reverting calls are assumed to be successful.
-     */
-    function safeTransfer(IERC20Upgradeable token, address to, uint256 value) internal {
-        _callOptionalReturn(token, abi.encodeWithSelector(token.transfer.selector, to, value));
-    }
-
-    /**
-     * @dev Transfer `value` amount of `token` from `from` to `to`, spending the approval given by `from` to the
-     * calling contract. If `token` returns no value, non-reverting calls are assumed to be successful.
-     */
-    function safeTransferFrom(IERC20Upgradeable token, address from, address to, uint256 value) internal {
-        _callOptionalReturn(token, abi.encodeWithSelector(token.transferFrom.selector, from, to, value));
-    }
-
-    /**
-     * @dev Deprecated. This function has issues similar to the ones found in
-     * {IERC20-approve}, and its usage is discouraged.
-     *
-     * Whenever possible, use {safeIncreaseAllowance} and
-     * {safeDecreaseAllowance} instead.
-     */
-    function safeApprove(IERC20Upgradeable token, address spender, uint256 value) internal {
-        // safeApprove should only be called when setting an initial allowance,
-        // or when resetting it to zero. To increase and decrease it, use
-        // 'safeIncreaseAllowance' and 'safeDecreaseAllowance'
-        require(
-            (value == 0) || (token.allowance(address(this), spender) == 0),
-            "SafeERC20: approve from non-zero to non-zero allowance"
-        );
-        _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, value));
-    }
-
-    /**
-     * @dev Increase the ca
[truncated — full diff is 231,292 bytes]
> ```

> </details>

> <details>
> <summary>📝 Source diff — upgrade #6 (<code>0x9f92...9fD9</code> → <code>0xF62F...36D6</code>): +6350/-19 lines (truncated)</summary>

> ```diff
--- old_impl
+++ new_impl
@@ -1,21 +1,6352 @@
 // SPDX-License-Identifier: MIT
-
-pragma solidity ^0.8.26;
-
-contract SharedLiquidityGaugeRename {
-  uint8 private _initialized;
-  bool private _initializing;
-  uint256 private _status;
-  uint256[49] private __gap_1;
-  uint256[50] private __gap_2;
-  mapping(address => uint256) private _balances;
-  mapping(address => mapping(address => uint256)) private _allowances;
-  uint256 private _totalSupply;
-  string private _name;
-  string private _symbol;
-
-  function rename(string memory name_, string memory symbol_) external {
-    _name = name_;
-    _symbol = symbol_;
-  }
+// OpenZeppelin Contracts (last updated v4.9.0) (access/AccessControl.sol)
+
+pragma solidity ^0.8.0;
+
+import "./IAccessControlUpgradeable.sol";
+import "../utils/ContextUpgradeable.sol";
+import "../utils/StringsUpgradeable.sol";
+import "../utils/introspection/ERC165Upgradeable.sol";
+import "../proxy/utils/Initializable.sol";
+
+/**
+ * @dev Contract module that allows children to implement role-based access
+ * control mechanisms. This is a lightweight version that doesn't allow enumerating role
+ * members except through off-chain means by accessing the contract event logs. Some
+ * applications may benefit from on-chain enumerability, for those cases see
+ * {AccessControlEnumerable}.
+ *
+ * Roles are referred to by their `bytes32` identifier. These should be exposed
+ * in the external API and be unique. The best way to achieve this is by
+ * using `public constant` hash digests:
+ *
+ * ```solidity
+ * bytes32 public constant MY_ROLE = keccak256("MY_ROLE");
+ * ```
+ *
+ * Roles can be used to represent a set of permissions. To restrict access to a
+ * function call, use {hasRole}:
+ *
+ * ```solidity
+ * function foo() public {
+ *     require(hasRole(MY_ROLE, msg.sender));
+ *     ...
+ * }
+ * ```
+ *
+ * Roles can be granted and revoked dynamically via the {grantRole} and
+ * {revokeRole} functions. Each role has an associated admin role, and only
+ * accounts that have a role's admin role can call {grantRole} and {revokeRole}.
+ *
+ * By default, the admin role for all roles is `DEFAULT_ADMIN_ROLE`, which means
+ * that only accounts with this role will be able to grant or revoke other
+ * roles. More complex role relationships can be created by using
+ * {_setRoleAdmin}.
+ *
+ * WARNING: The `DEFAULT_ADMIN_ROLE` is also its own admin: it has permission to
+ * grant and revoke this role. Extra precautions should be taken to secure
+ * accounts that have been granted it. We recommend using {AccessControlDefaultAdminRules}
+ * to enforce additional security measures for this role.
+ */
+abstract contract AccessControlUpgradeable is Initializable, ContextUpgradeable, IAccessControlUpgradeable, ERC165Upgradeable {
+    function __AccessControl_init() internal onlyInitializing {
+    }
+
+    function __AccessControl_init_unchained() internal onlyInitializing {
+    }
+    struct RoleData {
+        mapping(address => bool) members;
+        bytes32 adminRole;
+    }
+
+    mapping(bytes32 => RoleData) private _roles;
+
+    bytes32 public constant DEFAULT_ADMIN_ROLE = 0x00;
+
+    /**
+     * @dev Modifier that checks that an account has a specific role. Reverts
+     * with a standardized message including the required role.
+     *
+     * The format of the revert reason is given by the following regular expression:
+     *
+     *  /^AccessControl: account (0x[0-9a-f]{40}) is missing role (0x[0-9a-f]{64})$/
+     *
+     * _Available since v4.1._
+     */
+    modifier onlyRole(bytes32 role) {
+        _checkRole(role);
+        _;
+    }
+
+    /**
+     * @dev See {IERC165-supportsInterface}.
+     */
+    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
+        return interfaceId == type(IAccessControlUpgradeable).interfaceId || super.supportsInterface(interfaceId);
+    }
+
+    /**
+     * @dev Returns `true` if `account` has been granted `role`.
+     */
+    function hasRole(bytes32 role, address account) public view virtual override returns (bool) {
+        return _roles[role].members[account];
+    }
+
+    /**
+     * @dev Revert with a standard message if `_msgSender()` is missing `role`.
+     * Overriding this function changes the behavior of the {onlyRole} modifier.
+     *
+     * Format of the revert message is described in {_checkRole}.
+     *
+     * _Available since v4.6._
+     */
+    function _checkRole(bytes32 role) internal view virtual {
+        _checkRole(role, _msgSender());
+    }
+
+    /**
+     * @dev Revert with a standard message if `account` is missing `role`.
+     *
+     * The format of the revert reason is given by the following regular expression:
+     *
+     *  /^AccessControl: account (0x[0-9a-f]{40}) is missing role (0x[0-9a-f]{64})$/
+     */
+    function _checkRole(bytes32 role, address account) internal view virtual {
+        if (!hasRole(role, account)) {
+            revert(
+                string(
+                    abi.encodePacked(
+                        "AccessControl: account ",
+                        StringsUpgradeable.toHexString(account),
+                        " is missing role ",
+                        StringsUpgradeable.toHexString(uint256(role), 32)
+                    )
+                )
+            );
+        }
+    }
+
+    /**
+     * @dev Returns the admin role that controls `role`. See {grantRole} and
+     * {revokeRole}.
+     *
+     * To change a role's admin, use {_setRoleAdmin}.
+     */
+    function getRoleAdmin(bytes32 role) public view virtual override returns (bytes32) {
+        return _roles[role].adminRole;
+    }
+
+    /**
+     * @dev Grants `role` to `account`.
+     *
+     * If `account` had not been already granted `role`, emits a {RoleGranted}
+     * event.
+     *
+     * Requirements:
+     *
+     * - the caller must have ``role``'s admin role.
+     *
+     * May emit a {RoleGranted} event.
+     */
+    function grantRole(bytes32 role, address account) public virtual override onlyRole(getRoleAdmin(role)) {
+        _grantRole(role, account);
+    }
+
+    /**
+     * @dev Revokes `role` from `account`.
+     *
+     * If `account` had been granted `role`, emits a {RoleRevoked} event.
+     *
+     * Requirements:
+     *
+     * - the caller must have ``role``'s admin role.
+     *
+     * May emit a {RoleRevoked} event.
+     */
+    function revokeRole(bytes32 role, address account) public virtual override onlyRole(getRoleAdmin(role)) {
+        _revokeRole(role, account);
+    }
+
+    /**
+     * @dev Revokes `role` from the calling account.
+     *
+     * Roles are often managed via {grantRole} and {revokeRole}: this function's
+     * purpose is to provide a mechanism for accounts to lose their privileges
+     * if they are compromised (such as when a trusted device is misplaced).
+     *
+     * If the calling account had been revoked `role`, emits a {RoleRevoked}
+     * event.
+     *
+     * Requirements:
+     *
+     * - the caller must be `account`.
+     *
+     * May emit a {RoleRevoked} event.
+     */
+    function renounceRole(bytes32 role, address account) public virtual override {
+        require(account == _msgSender(), "AccessControl: can only renounce roles for self");
+
+        _revokeRole(role, account);
+    }
+
+    /**
+     * @dev Grants `role` to `account`.
+     *
+     * If `account` had not been already granted `role`, emits a {RoleGranted}
+     * event. Note that unlike {grantRole}, this function doesn't perform any
+     * checks on the calling account.
+     *
+     * May emit a {RoleGranted} event.
+     *
+     * [WARNING]
+     * ====
+     * This function should only be called from the constructor when setting
+     * up the initial roles for the system.
+     *
+     * Using this function in any other way is effectively circumventing the admin
+     * system imposed by {AccessControl}.
+     * ====
+     *
+     * NOTE: This function is deprecated in favor of {_grantRole}.
+     */
+    function _setupRole(bytes32 role, address account) internal virtual {
+        _grantRole(role, account);
+    }
+
+    /**
+     * @dev Sets `adminRole` as ``role``'s admin role.
+     *
+     * Emits a {RoleAdminChanged} event.
+     */
+    function _setRoleAdmin(bytes32 role, bytes32 adminRole) internal virtual {
+        bytes32 previousAdminRole = getRoleAdmin(role);
+        _roles[role].adminRole = adminRole;
+        emit RoleAdminChanged(role, previousAdminRole, adminRole);
+    }
+
+    /**
+     * @dev Grants `role` to `account`.
+     *
+     * Internal function without access restriction.
+     *
+     * May emit a {RoleGranted} event.
+     */
+    function _grantRole(bytes32 role, address account) internal virtual {
+        if (!hasRole(role, account)) {
+            _roles[role].members[account] = true;
+            emit RoleGranted(role, account, _msgSender());
+        }
+    }
+
+    /**
+     * @dev Revokes `role` from `account`.
+     *
+     * Internal function without access restriction.
+     *
+     * May emit a {RoleRevoked} event.
+     */
+    function _revokeRole(bytes32 role, address account) internal virtual {
+        if (hasRole(role, account)) {
+            _roles[role].members[account] = false;
+            emit RoleRevoked(role, account, _msgSender());
+        }
+    }
+
+    /**
+     * @dev This empty reserved space is put in place to allow future versions to add new
+     * variables without shifting down storage in the inheritance chain.
+     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
+     */
+    uint256[49] private __gap;
 }
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts v4.4.1 (access/IAccessControl.sol)
+
+pragma solidity ^0.8.0;
+
+/**
+ * @dev External interface of AccessControl declared to support ERC165 detection.
+ */
+interface IAccessControlUpgradeable {
+    /**
+     * @dev Emitted when `newAdminRole` is set as ``role``'s admin role, replacing `previousAdminRole`
+     *
+     * `DEFAULT_ADMIN_ROLE` is the starting admin for all roles, despite
+     * {RoleAdminChanged} not being emitted signaling this.
+     *
+     * _Available since v3.1._
+     */
+    event RoleAdminChanged(bytes32 indexed role, bytes32 indexed previousAdminRole, bytes32 indexed newAdminRole);
+
+    /**
+     * @dev Emitted when `account` is granted `role`.
+     *
+     * `sender` is the account that originated the contract call, an admin role
+     * bearer except when using {AccessControl-_setupRole}.
+     */
+    event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender);
+
+    /**
+     * @dev Emitted when `account` is revoked `role`.
+     *
+     * `sender` is the account that originated the contract call:
+     *   - if using `revokeRole`, it is the admin role bearer
+     *   - if using `renounceRole`, it is the role bearer (i.e. `account`)
+     */
+    event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender);
+
+    /**
+     * @dev Returns `true` if `account` has been granted `role`.
+     */
+    function hasRole(bytes32 role, address account) external view returns (bool);
+
+    /**
+     * @dev Returns the admin role that controls `role`. See {grantRole} and
+     * {revokeRole}.
+     *
+     * To change a role's admin, use {AccessControl-_setRoleAdmin}.
+     */
+    function getRoleAdmin(bytes32 role) external view returns (bytes32);
+
+    /**
+     * @dev Grants `role` to `account`.
+     *
+     * If `account` had not been already granted `role`, emits a {RoleGranted}
+     * event.
+     *
+     * Requirements:
+     *
+     * - the caller must have ``role``'s admin role.
+     */
+    function grantRole(bytes32 role, address account) external;
+
+    /**
+     * @dev Revokes `role` from `account`.
+     *
+     * If `account` had been granted `role`, emits a {RoleRevoked} event.
+     *
+     * Requirements:
+     *
+     * - the caller must have ``role``'s admin role.
+     */
+    function revokeRole(bytes32 role, address account) external;
+
+    /**
+     * @dev Revokes `role` from the calling account.
+     *
+     * Roles are often managed via {grantRole} and {revokeRole}: this function's
+     * purpose is to provide a mechanism for accounts to lose their privileges
+     * if they are compromised (such as when a trusted device is misplaced).
+     *
+     * If the calling account had been granted `role`, emits a {RoleRevoked}
+     * event.
+     *
+     * Requirements:
+     *
+     * - the caller must be `account`.
+     */
+    function renounceRole(bytes32 role, address account) external;
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts (last updated v4.9.0) (interfaces/IERC5267.sol)
+
+pragma solidity ^0.8.0;
+
+interface IERC5267Upgradeable {
+    /**
+     * @dev MAY be emitted to signal that the domain could have changed.
+     */
+    event EIP712DomainChanged();
+
+    /**
+     * @dev returns the fields and values that describe the domain separator used by this contract for EIP-712
+     * signature.
+     */
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
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts (last updated v4.9.0) (proxy/utils/Initializable.sol)
+
+pragma solidity ^0.8.2;
+
+import "../../utils/AddressUpgradeable.sol";
+
+/**
+ * @dev This is a base contract to aid in writing upgradeable contracts, or any kind of contract that will be deployed
+ * behind a proxy. Since proxied contracts do not make use of a constructor, it's common to move constructor logic to an
+ * external initializer function, usually called `initialize`. It then becomes necessary to protect this initializer
+ * function so it can only be called once. The {initializer} modifier provided by this contract will have this effect.
+ *
+ * The initialization functions use a version number. Once a version number is used, it is consumed and cannot be
+ * reused. This mechanism prevents re-execution of each "step" but allows the creation of new initialization steps in
+ * case an upgrade adds a module that needs to be initialized.
+ *
+ * For example:
+ *
+ * [.hljs-theme-light.nopadding]
+ * ```solidity
+ * contract MyToken is ERC20Upgradeable {
+ *     function initialize() initializer public {
+ *         __ERC20_init("MyToken", "MTK");
+ *     }
+ * }
+ *
+ * contract MyTokenV2 is MyToken, ERC20PermitUpgradeable {
+ *     function initializeV2() reinitializer(2) public {
+ *         __ERC20Permit_init("MyToken");
+ *     }
+ * }
+ * ```
+ *
+ * TIP: To avoid leaving the proxy in an uninitialized state, the initializer function should be called as early as
+ * possible by providing the encoded function call as the `_data` argument to {ERC1967Proxy-constructor}.
+ *
+ * CAUTION: When used with inheritance, manual care must be taken to not invoke a parent initializer twice, or to ensure
+ * that all initializers are idempotent. This is not verified automatically as constructors are by Solidity.
+ *
+ * [CAUTION]
+ * ====
+ * Avoid leaving a contract uninitialized.
+ *
+ * An uninitialized contract can be taken over by an attacker. This applies to both a proxy and its implementation
+ * contract, which may impact the proxy. To prevent the implementation contract from being used, you should invoke
+ * the {_disableInitializers} function in the constructor to automatically lock it when it is deployed:
+ *
+ * [.hljs-theme-light.nopadding]
+ * ```
+ * /// @custom:oz-upgrades-unsafe-allow constructor
+ * constructor() {
+ *     _disableInitializers();
+ * }
+ * ```
+ * ====
+ */
+abstract contract Initializable {
+    /**
+     * @dev Indicates that the contract has been initialized.
+     * @custom:oz-retyped-from bool
+     */
+    uint8 private _initialized;
+
+    /**
+     * @dev Indicates that the contract is in the process of being initialized.
+     */
+    bool private _initializing;
+
+    /**
+     * @dev Triggered when the contract has been initialized or reinitialized.
+     */
+    event Initialized(uint8 version);
+
+    /**
+     * @dev A modifier that defines a protected initializer function that can be invoked at most once. In its scope,
+     * `onlyInitializing` functions can be used to initialize parent contracts.
+     *
+     * Similar to `reinitializer(1)`, except that functions marked with `initializer` can be nested in the context of a
+     * constructor.
+     *
+     * Emits an {Initialized} event.
+     */
+    modifier initializer() {
+        bool isTopLevelCall = !_initializing;
+        require(
+            (isTopLevelCall && _initialized < 1) || (!AddressUpgradeable.isContract(address(this)) && _initialized == 1),
+            "Initializable: contract is already initialized"
+        );
+        _initialized = 1;
+        if (isTopLevelCall) {
+            _initializing = true;
+        }
+        _;
+        if (isTopLevelCall) {
+            _initializing = false;
+            emit Initialized(1);
+        }
+    }
+
+    /**
+     * @dev A modifier that defines a protected reinitializer function that can be invoked at most once, and only if the
+     * contract hasn't been initialized to a greater version before. In its scope, `onlyInitializing` functions can be
+     * used to initialize parent contracts.
+     *
+     * A reinitializer may be used after the original initialization step. This is essential to configure modules that
+     * are added through upgrades and that require initialization.
+     *
+     * When `version` is 1, this modifier is similar to `initializer`, except that functions marked with `reinitializer`
+     * cannot be nested. If one is invoked in the context of another, execution will revert.
+     *
+     * Note that versions can jump in increments greater than 1; this implies that if multiple reinitializers coexist in
+     * a contract, executing them in the right order is up to the developer or operator.
+     *
+     * WARNING: setting the version to 255 will prevent any future reinitialization.
+     *
+     * Emits an {Initialized} event.
+     */
+    modifier reinitializer(uint8 version) {
+        require(!_initializing && _initialized < version, "Initializable: contract is already initialized");
+        _initialized = version;
+        _initializing = true;
+        _;
+        _initializing = false;
+        emit Initialized(version);
+    }
+
+    /**
+     * @dev Modifier to protect an initialization function so that it can only be invoked by functions with the
+     * {initializer} and {reinitializer} modifiers, directly or indirectly.
+     */
+    modifier onlyInitializing() {
+        require(_initializing, "Initializable: contract is not initializing");
+        _;
+    }
+
+    /**
+     * @dev Locks the contract, preventing any future reinitialization. This cannot be part of an initializer call.
+     * Calling this in the constructor of a contract will prevent that contract from being initialized or reinitialized
+     * to any version. It is recommended to use this to lock implementation contracts that are designed to be called
+     * through proxies.
+     *
+     * Emits an {Initialized} event the first time it is successfully executed.
+     */
+    function _disableInitializers() internal virtual {
+        require(!_initializing, "Initializable: contract is initializing");
+        if (_initialized != type(uint8).max) {
+            _initialized = type(uint8).max;
+            emit Initialized(type(uint8).max);
+        }
+    }
+
+    /**
+     * @dev Returns the highest version that has been initialized. See {reinitializer}.
+     */
+    function _getInitializedVersion() internal view returns (uint8) {
+        return _initialized;
+    }
+
+    /**
+     * @dev Returns `true` if the contract is currently initializing. See {onlyInitializing}.
+     */
+    function _isInitializing() internal view returns (bool) {
+        return _initializing;
+    }
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts (last updated v4.9.0) (security/ReentrancyGuard.sol)
+
+pragma solidity ^0.8.0;
+import "../proxy/utils/Initializable.sol";
+
+/**
+ * @dev Contract module that helps prevent reentrant calls to a function.
+ *
+ * Inheriting from `ReentrancyGuard` will make the {nonReentrant} modifier
+ * available, which can be applied to functions to make sure there are no nested
+ * (reentrant) calls to them.
+ *
+ * Note that because there is a single `nonReentrant` guard, functions marked as
+ * `nonReentrant` may not call one another. This can be worked around by making
+ * those functions `private`, and then adding `external` `nonReentrant` entry
+ * points to them.
+ *
+ * TIP: If you would like to learn more about reentrancy and alternative ways
+ * to protect against it, check out our blog post
+ * https://blog.openzeppelin.com/reentrancy-after-istanbul/[Reentrancy After Istanbul].
+ */
+abstract contract ReentrancyGuardUpgradeable is Initializable {
+    // Booleans are more expensive than uint256 or any type that takes up a full
+    // word because each write operation emits an extra SLOAD to first read the
+    // slot's contents, replace the bits taken up by the boolean, and then write
+    // back. This is the compiler's defense against contract upgrades and
+    // pointer aliasing, and it cannot be disabled.
+
+    // The values being non-zero value makes deployment a bit more expensive,
+    // but in exchange the refund on every call to nonReentrant will be lower in
+    // amount. Since refunds are capped to a percentage of the total
+    // transaction's gas, it is best to keep them low in cases like this one, to
+    // increase the likelihood of the full refund coming into effect.
+    uint256 private constant _NOT_ENTERED = 1;
+    uint256 private constant _ENTERED = 2;
+
+    uint256 private _status;
+
+    function __ReentrancyGuard_init() internal onlyInitializing {
+        __ReentrancyGuard_init_unchained();
+    }
+
+    function __ReentrancyGuard_init_unchained() internal onlyInitializing {
+        _status = _NOT_ENTERED;
+    }
+
+    /**
+     * @dev Prevents a contract from calling itself, directly or indirectly.
+     * Calling a `nonReentrant` function from another `nonReentrant`
+     * function is not supported. It is possible to prevent this from happening
+     * by making the `nonReentrant` function external, and making it call a
+     * `private` function that does the actual work.
+     */
+    modifier nonReentrant() {
+        _nonReentrantBefore();
+        _;
+        _nonReentrantAfter();
+    }
+
+    function _nonReentrantBefore() private {
+        // On the first call to nonReentrant, _status will be _NOT_ENTERED
+        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");
+
+        // Any calls to nonReentrant after this point will fail
+        _status = _ENTERED;
+    }
+
+    function _nonReentrantAfter() private {
+        // By storing the original value once again, a refund is triggered (see
+        // https://eips.ethereum.org/EIPS/eip-2200)
+        _status = _NOT_ENTERED;
+    }
+
+    /**
+     * @dev Returns true if the reentrancy guard is currently set to "entered", which indicates there is a
+     * `nonReentrant` function in the call stack.
+     */
+    function _reentrancyGuardEntered() internal view returns (bool) {
+        return _status == _ENTERED;
+    }
+
+    /**
+     * @dev This empty reserved space is put in place to allow future versions to add new
+     * variables without shifting down storage in the inheritance chain.
+     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
+     */
+    uint256[49] private __gap;
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts (last updated v4.9.0) (token/ERC20/ERC20.sol)
+
+pragma solidity ^0.8.0;
+
+import "./IERC20Upgradeable.sol";
+import "./extensions/IERC20MetadataUpgradeable.sol";
+import "../../utils/ContextUpgradeable.sol";
+import "../../proxy/utils/Initializable.sol";
+
+/**
+ * @dev Implementation of the {IERC20} interface.
+ *
+ * This implementation is agnostic to the way tokens are created. This means
+ * that a supply mechanism has to be added in a derived contract using {_mint}.
+ * For a generic mechanism see {ERC20PresetMinterPauser}.
+ *
+ * TIP: For a detailed writeup see our guide
+ * https://forum.openzeppelin.com/t/how-to-implement-erc20-supply-mechanisms/226[How
+ * to implement supply mechanisms].
+ *
+ * The default value of {decimals} is 18. To change this, you should override
+ * this function so it returns a different value.
+ *
+ * We have followed general OpenZeppelin Contracts guidelines: functions revert
+ * instead returning `false` on failure. This behavior is nonetheless
+ * conventional and does not conflict with the expectations of ERC20
+ * applications.
+ *
+ * Additionally, an {Approval} event is emitted on calls to {transferFrom}.
+ * This allows applications to reconstruct the allowance for all accounts just
+ * by listening to said events. Other implementations of the EIP may not emit
+ * these events, as it isn't required by the specification.
+ *
+ * Finally, the non-standard {decreaseAllowance} and {increaseAllowance}
+ * functions have been added to mitigate the well-known issues around setting
+ * allowances. See {IERC20-approve}.
+ */
+contract ERC20Upgradeable is Initializable, ContextUpgradeable, IERC20Upgradeable, IERC20MetadataUpgradeable {
+    mapping(address => uint256) private _balances;
+
+    mapping(address => mapping(address => uint256)) private _allowances;
+
+    uint256 private _totalSupply;
+
+    string private _name;
+    string private _symbol;
+
+    /**
+     * @dev Sets the values for {name} and {symbol}.
+     *
+     * All two of these values are immutable: they can only be set once during
+     * construction.
+     */
+    function __ERC20_init(string memory name_, string memory symbol_) internal onlyInitializing {
+        __ERC20_init_unchained(name_, symbol_);
+    }
+
+    function __ERC20_init_unchained(string memory name_, string memory symbol_) internal onlyInitializing {
+        _name = name_;
+        _symbol = symbol_;
+    }
+
+    /**
+     * @dev Returns the name of the token.
+     */
+    function name() public view virtual override returns (string memory) {
+        return _name;
+    }
+
+    /**
+     * @dev Returns the symbol of the token, usually a shorter version of the
+     * name.
+     */
+    function symbol() public view virtual override returns (string memory) {
+        return _symbol;
+    }
+
+    /**
+     * @dev Returns the number of decimals used to get its user representation.
+     * For example, if `decimals` equals `2`, a balance of `505` tokens should
+     * be displayed to a user as `5.05` (`505 / 10 ** 2`).
+     *
+     * Tokens usually opt for a value of 18, imitating the relationship between
+     * Ether and Wei. This is the default value returned by this function, unless
+     * it's overridden.
+     *
+     * NOTE: This information is only used for _display_ purposes: it in
+     * no way affects any of the arithmetic of the contract, including
+     * {IERC20-balanceOf} and {IERC20-transfer}.
+     */
+    function decimals() public view virtual override returns (uint8) {
+        return 18;
+    }
+
+    /**
+     * @dev See {IERC20-totalSupply}.
+     */
+    function totalSupply() public view virtual override returns (uint256) {
+        return _totalSupply;
+    }
+
+    /**
+     * @dev See {IERC20-balanceOf}.
+     */
+    function balanceOf(address account) public view virtual override returns (uint256) {
+        return _balances[account];
+    }
+
+    /**
+     * @dev See {IERC20-transfer}.
+     *
+     * Requirements:
+     *
+     * - `to` cannot be the zero address.
+     * - the caller must have a balance of at least `amount`.
+     */
+    function transfer(address to, uint256 amount) public virtual override returns (bool) {
+        address owner = _msgSender();
+        _transfer(owner, to, amount);
+        return true;
+    }
+
+    /**
+     * @dev See {IERC20-allowance}.
+     */
+    function allowance(address owner, address spender) public view virtual override returns (uint256) {
+        return _allowances[owner][spender];
+    }
+
+    /**
+     * @dev See {IERC20-approve}.
+     *
+     * NOTE: If `amount` is the maximum `uint256`, the allowance is not updated on
+     * `transferFrom`. This is semantically equivalent to an infinite approval.
+     *
+     * Requirements:
+     *
+     * - `spender` cannot be the zero address.
+     */
+    function approve(address spender, uint256 amount) public virtual override returns (bool) {
+        address owner = _msgSender();
+        _approve(owner, spender, amount);
+        return true;
+    }
+
+    /**
+     * @dev See {IERC20-transferFrom}.
+     *
+     * Emits an {Approval} event indicating the updated allowance. This is not
+     * required by the EIP. See the note at the beginning of {ERC20}.
+     *
+     * NOTE: Does not update the allowance if the current allowance
+     * is the maximum `uint256`.
+     *
+     * Requirements:
+     *
+     * - `from` and `to` cannot be the zero address.
+     * - `from` must have a balance of at least `amount`.
+     * - the caller must have allowance for ``from``'s tokens of at least
+     * `amount`.
+     */
+    function transferFrom(address from, address to, uint256 amount) public virtual override returns (bool) {
+        address spender = _msgSender();
+        _spendAllowance(from, spender, amount);
+        _transfer(from, to, amount);
+        return true;
+    }
+
+    /**
+     * @dev Atomically increases the allowance granted to `spender` by the caller.
+     *
+     * This is an alternative to {approve} that can be used as a mitigation for
+     * problems described in {IERC20-approve}.
+     *
+     * Emits an {Approval} event indicating the updated allowance.
+     *
+     * Requirements:
+     *
+     * - `spender` cannot be the zero address.
+     */
+    function increaseAllowance(address spender, uint256 addedValue) public virtual returns (bool) {
+        address owner = _msgSender();
+        _approve(owner, spender, allowance(owner, spender) + addedValue);
+        return true;
+    }
+
+    /**
+     * @dev Atomically decreases the allowance granted to `spender` by the caller.
+     *
+     * This is an alternative to {approve} that can be used as a mitigation for
+     * problems described in {IERC20-approve}.
+     *
+     * Emits an {Approval} event indicating the updated allowance.
+     *
+     * Requirements:
+     *
+     * - `spender` cannot be the zero address.
+     * - `spender` must have allowance for the caller of at least
+     * `subtractedValue`.
+     */
+    function decreaseAllowance(address spender, uint256 subtractedValue) public virtual returns (bool) {
+        address owner = _msgSender();
+        uint256 currentAllowance = allowance(owner, spender);
+        require(currentAllowance >= subtractedValue, "ERC20: decreased allowance below zero");
+        unchecked {
+            _approve(owner, spender, currentAllowance - subtractedValue);
+        }
+
+        return true;
+    }
+
+    /**
+     * @dev Moves `amount` of tokens from `from` to `to`.
+     *
+     * This internal function is equivalent to {transfer}, and can be used to
+     * e.g. implement automatic token fees, slashing mechanisms, etc.
+     *
+     * Emits a {Transfer} event.
+     *
+     * Requirements:
+     *
+     * - `from` cannot be the zero address.
+     * - `to` cannot be the zero address.
+     * - `from` must have a balance of at least `amount`.
+     */
+    function _transfer(address from, address to, uint256 amount) internal virtual {
+        require(from != address(0), "ERC20: transfer from the zero address");
+        require(to != address(0), "ERC20: transfer to the zero address");
+
+        _beforeTokenTransfer(from, to, amount);
+
+        uint256 fromBalance = _balances[from];
+        require(fromBalance >= amount, "ERC20: transfer amount exceeds balance");
+        unchecked {
+            _balances[from] = fromBalance - amount;
+            // Overflow not possible: the sum of all balances is capped by totalSupply, and the sum is preserved by
+            // decrementing then incrementing.
+            _balances[to] += amount;
+        }
+
+        emit Transfer(from, to, amount);
+
+        _afterTokenTransfer(from, to, amount);
+    }
+
+    /** @dev Creates `amount` tokens and assigns them to `account`, increasing
+     * the total supply.
+     *
+     * Emits a {Transfer} event with `from` set to the zero address.
+     *
+     * Requirements:
+     *
+     * - `account` cannot be the zero address.
+     */
+    function _mint(address account, uint256 amount) internal virtual {
+        require(account != address(0), "ERC20: mint to the zero address");
+
+        _beforeTokenTransfer(address(0), account, amount);
+
+        _totalSupply += amount;
+        unchecked {
+            // Overflow not possible: balance + amount is at most totalSupply + amount, which is checked above.
+            _balances[account] += amount;
+        }
+        emit Transfer(address(0), account, amount);
+
+        _afterTokenTransfer(address(0), account, amount);
+    }
+
+    /**
+     * @dev Destroys `amount` tokens from `account`, reducing the
+     * total supply.
+     *
+     * Emits a {Transfer} event with `to` set to the zero address.
+     *
+     * Requirements:
+     *
+     * - `account` cannot be the zero address.
+     * - `account` must have at least `amount` tokens.
+     */
+    function _burn(address account, uint256 amount) internal virtual {
+        require(account != address(0), "ERC20: burn from the zero address");
+
+        _beforeTokenTransfer(account, address(0), amount);
+
+        uint256 accountBalance = _balances[account];
+        require(accountBalance >= amount, "ERC20: burn amount exceeds balance");
+        unchecked {
+            _balances[account] = accountBalance - amount;
+            // Overflow not possible: amount <= accountBalance <= totalSupply.
+            _totalSupply -= amount;
+        }
+
+        emit Transfer(account, address(0), amount);
+
+        _afterTokenTransfer(account, address(0), amount);
+    }
+
+    /**
+     * @dev Sets `amount` as the allowance of `spender` over the `owner` s tokens.
+     *
+     * This internal function is equivalent to `approve`, and can be used to
+     * e.g. set automatic allowances for certain subsystems, etc.
+     *
+     * Emits an {Approval} event.
+     *
+     * Requirements:
+     *
+     * - `owner` cannot be the zero address.
+     * - `spender` cannot be the zero address.
+     */
+    function _approve(address owner, address spender, uint256 amount) internal virtual {
+        require(owner != address(0), "ERC20: approve from the zero address");
+        require(spender != address(0), "ERC20: approve to the zero address");
+
+        _allowances[owner][spender] = amount;
+        emit Approval(owner, spender, amount);
+    }
+
+    /**
+     * @dev Updates `owner` s allowance for `spender` based on spent `amount`.
+     *
+     * Does not update the allowance amount in case of infinite allowance.
+     * Revert if not enough allowance is available.
+     *
+     * Might emit an {Approval} event.
+     */
+    function _spendAllowance(address owner, address spender, uint256 amount) internal virtual {
+        uint256 currentAllowance = allowance(owner, spender);
+        if (currentAllowance != type(uint256).max) {
+            require(currentAllowance >= amount, "ERC20: insufficient allowance");
+            unchecked {
+                _approve(owner, spender, currentAllowance - amount);
+            }
+        }
+    }
+
+    /**
+     * @dev Hook that is called before any transfer of tokens. This includes
+     * minting and burning.
+     *
+     * Calling conditions:
+     *
+     * - when `from` and `to` are both non-zero, `amount` of ``from``'s tokens
+     * will be transferred to `to`.
+     * - when `from` is zero, `amount` tokens will be minted for `to`.
+     * - when `to` is zero, `amount` of ``from``'s tokens will be burned.
+     * - `from` and `to` are never both zero.
+     *
+     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
+     */
+    function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual {}
+
+    /**
+     * @dev Hook that is called after any transfer of tokens. This includes
+     * minting and burning.
+     *
+     * Calling conditions:
+     *
+     * - when `from` and `to` are both non-zero, `amount` of ``from``'s tokens
+     * has been transferred to `to`.
+     * - when `from` is zero, `amount` tokens have been minted for `to`.
+     * - when `to` is zero, `amount` of ``from``'s tokens have been burned.
+     * - `from` and `to` are never both zero.
+     *
+     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
+     */
+    function _afterTokenTransfer(address from, address to, uint256 amount) internal virtual {}
+
+    /**
+     * @dev This empty reserved space is put in place to allow future versions to add new
+     * variables without shifting down storage in the inheritance chain.
+     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
+     */
+    uint256[45] private __gap;
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts (last updated v4.9.0) (token/ERC20/extensions/ERC20Permit.sol)
+
+pragma solidity ^0.8.0;
+
+import "./IERC20PermitUpgradeable.sol";
+import "../ERC20Upgradeable.sol";
+import "../../../utils/cryptography/ECDSAUpgradeable.sol";
+import "../../../utils/cryptography/EIP712Upgradeable.sol";
+import "../../../utils/CountersUpgradeable.sol";
+import "../../../proxy/utils/Initializable.sol";
+
+/**
+ * @dev Implementation of the ERC20 Permit extension allowing approvals to be made via signatures, as defined in
+ * https://eips.ethereum.org/EIPS/eip-2612[EIP-2612].
+ *
+ * Adds the {permit} method, which can be used to change an account's ERC20 allowance (see {IERC20-allowance}) by
+ * presenting a message signed by the account. By not relying on `{IERC20-approve}`, the token holder account doesn't
+ * need to send a transaction, and thus is not required to hold Ether at all.
+ *
+ * _Available since v3.4._
+ *
+ * @custom:storage-size 51
+ */
+abstract contract ERC20PermitUpgradeable is Initializable, ERC20Upgradeable, IERC20PermitUpgradeable, EIP712Upgradeable {
+    using CountersUpgradeable for CountersUpgradeable.Counter;
+
+    mapping(address => CountersUpgradeable.Counter) private _nonces;
+
+    // solhint-disable-next-line var-name-mixedcase
+    bytes32 private constant _PERMIT_TYPEHASH =
+        keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)");
+    /**
+     * @dev In previous versions `_PERMIT_TYPEHASH` was declared as `immutable`.
+     * However, to ensure consistency with the upgradeable transpiler, we will continue
+     * to reserve a slot.
+     * @custom:oz-renamed-from _PERMIT_TYPEHASH
+     */
+    // solhint-disable-next-line var-name-mixedcase
+    bytes32 private _PERMIT_TYPEHASH_DEPRECATED_SLOT;
+
+    /**
+     * @dev Initializes the {EIP712} domain separator using the `name` parameter, and setting `version` to `"1"`.
+     *
+     * It's a good idea to use the same `name` that is defined as the ERC20 token name.
+     */
+    function __ERC20Permit_init(string memory name) internal onlyInitializing {
+        __EIP712_init_unchained(name, "1");
+    }
+
+    function __ERC20Permit_init_unchained(string memory) internal onlyInitializing {}
+
+    /**
+     * @dev See {IERC20Permit-permit}.
+     */
+    function permit(
+        address owner,
+        address spender,
+        uint256 value,
+        uint256 deadline,
+        uint8 v,
+        bytes32 r,
+        bytes32 s
+    ) public virtual override {
+        require(block.timestamp <= deadline, "ERC20Permit: expired deadline");
+
+        bytes32 structHash = keccak256(abi.encode(_PERMIT_TYPEHASH, owner, spender, value, _useNonce(owner), deadline));
+
+        bytes32 hash = _hashTypedDataV4(structHash);
+
+        address signer = ECDSAUpgradeable.recover(hash, v, r, s);
+        require(signer == owner, "ERC20Permit: invalid signature");
+
+        _approve(owner, spender, value);
+    }
+
+    /**
+     * @dev See {IERC20Permit-nonces}.
+     */
+    function nonces(address owner) public view virtual override returns (uint256) {
+        return _nonces[owner].current();
+    }
+
+    /**
+     * @dev See {IERC20Permit-DOMAIN_SEPARATOR}.
+     */
+    // solhint-disable-next-line func-name-mixedcase
+    function DOMAIN_SEPARATOR() external view override returns (bytes32) {
+        return _domainSeparatorV4();
+    }
+
+    /**
+     * @dev "Consume a nonce": return the current value and increment.
+     *
+     * _Available since v4.1._
+     */
+    function _useNonce(address owner) internal virtual returns (uint256 current) {
+        CountersUpgradeable.Counter storage nonce = _nonces[owner];
+        current = nonce.current();
+        nonce.increment();
+    }
+
+    /**
+     * @dev This empty reserved space is put in place to allow future versions to add new
+     * variables without shifting down storage in the inheritance chain.
+     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
+     */
+    uint256[49] private __gap;
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts v4.4.1 (token/ERC20/extensions/IERC20Metadata.sol)
+
+pragma solidity ^0.8.0;
+
+import "../IERC20Upgradeable.sol";
+
+/**
+ * @dev Interface for the optional metadata functions from the ERC20 standard.
+ *
+ * _Available since v4.1._
+ */
+interface IERC20MetadataUpgradeable is IERC20Upgradeable {
+    /**
+     * @dev Returns the name of the token.
+     */
+    function name() external view returns (string memory);
+
+    /**
+     * @dev Returns the symbol of the token.
+     */
+    function symbol() external view returns (string memory);
+
+    /**
+     * @dev Returns the decimals places of the token.
+     */
+    function decimals() external view returns (uint8);
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts (last updated v4.9.0) (token/ERC20/extensions/IERC20Permit.sol)
+
+pragma solidity ^0.8.0;
+
+/**
+ * @dev Interface of the ERC20 Permit extension allowing approvals to be made via signatures, as defined in
+ * https://eips.ethereum.org/EIPS/eip-2612[EIP-2612].
+ *
+ * Adds the {permit} method, which can be used to change an account's ERC20 allowance (see {IERC20-allowance}) by
+ * presenting a message signed by the account. By not relying on {IERC20-approve}, the token holder account doesn't
+ * need to send a transaction, and thus is not required to hold Ether at all.
+ */
+interface IERC20PermitUpgradeable {
+    /**
+     * @dev Sets `value` as the allowance of `spender` over ``owner``'s tokens,
+     * given ``owner``'s signed approval.
+     *
+     * IMPORTANT: The same issues {IERC20-approve} has related to transaction
+     * ordering also apply here.
+     *
+     * Emits an {Approval} event.
+     *
+     * Requirements:
+     *
+     * - `spender` cannot be the zero address.
+     * - `deadline` must be a timestamp in the future.
+     * - `v`, `r` and `s` must be a valid `secp256k1` signature from `owner`
+     * over the EIP712-formatted function arguments.
+     * - the signature must use ``owner``'s current nonce (see {nonces}).
+     *
+     * For more information on the signature format, see the
+     * https://eips.ethereum.org/EIPS/eip-2612#specification[relevant EIP
+     * section].
+     */
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
+    /**
+     * @dev Returns the current nonce for `owner`. This value must be
+     * included whenever a signature is generated for {permit}.
+     *
+     * Every successful call to {permit} increases ``owner``'s nonce by one. This
+     * prevents a signature from being used multiple times.
+     */
+    function nonces(address owner) external view returns (uint256);
+
+    /**
+     * @dev Returns the domain separator used in the encoding of the signature for {permit}, as defined by {EIP712}.
+     */
+    // solhint-disable-next-line func-name-mixedcase
+    function DOMAIN_SEPARATOR() external view returns (bytes32);
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts (last updated v4.9.0) (token/ERC20/IERC20.sol)
+
+pragma solidity ^0.8.0;
+
+/**
+ * @dev Interface of the ERC20 standard as defined in the EIP.
+ */
+interface IERC20Upgradeable {
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
+     * @dev Returns the amount of tokens in existence.
+     */
+    function totalSupply() external view returns (uint256);
+
+    /**
+     * @dev Returns the amount of tokens owned by `account`.
+     */
+    function balanceOf(address account) external view returns (uint256);
+
+    /**
+     * @dev Moves `amount` tokens from the caller's account to `to`.
+     *
+     * Returns a boolean value indicating whether the operation succeeded.
+     *
+     * Emits a {Transfer} event.
+     */
+    function transfer(address to, uint256 amount) external returns (bool);
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
+     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
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
+    function approve(address spender, uint256 amount) external returns (bool);
+
+    /**
+     * @dev Moves `amount` tokens from `from` to `to` using the
+     * allowance mechanism. `amount` is then deducted from the caller's
+     * allowance.
+     *
+     * Returns a boolean value indicating whether the operation succeeded.
+     *
+     * Emits a {Transfer} event.
+     */
+    function transferFrom(address from, address to, uint256 amount) external returns (bool);
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts (last updated v4.9.3) (token/ERC20/utils/SafeERC20.sol)
+
+pragma solidity ^0.8.0;
+
+import "../IERC20Upgradeable.sol";
+import "../extensions/IERC20PermitUpgradeable.sol";
+import "../../../utils/AddressUpgradeable.sol";
+
+/**
+ * @title SafeERC20
+ * @dev Wrappers around ERC20 operations that throw on failure (when the token
+ * contract returns false). Tokens that return no value (and instead revert or
+ * throw on failure) are also supported, non-reverting calls are assumed to be
+ * successful.
+ * To use this library you can add a `using SafeERC20 for IERC20;` statement to your contract,
+ * which allows you to call the safe operations as `token.safeTransfer(...)`, etc.
+ */
+library SafeERC20Upgradeable {
+    using AddressUpgradeable for address;
+
+    /**
+     * @dev Transfer `value` amount of `token` from the calling contract to `to`. If `token` returns no value,
+     * non-reverting calls are assumed to be successful.
+     */
+    function safeTransfer(IERC20Upgradeable token, address to, uint256 value) internal {
+        _callOptionalReturn(token, abi.encodeWithSelector(token.transfer.selector, to, value));
+    }
+
+    /**
+     * @dev Transfer `value` amount of `token` from `from` to `to`, spending the approval given by `from` to the
+     * calling contract. If `token` returns no value, non-reverting calls are assumed to be successful.
+     */
+    function safeTransferFrom(IERC20Upgradeable token, address from, address to, uint256 value) internal {
+        _callOptionalReturn(token, abi.encodeWithSelector(token.transferFrom.selector, from, to, value));
+    }
+
+    /**
+     * @dev Deprecated. This function has issues similar to the ones found in
+     * {IERC20-approve}, and its usage is discouraged.
+     *
+     * Whenever possible, use {safeIncreaseAllowance} and
+     * {safeDecreaseAllowance} instead.
+     */
+    function safeApprove(IERC20Upgradeable token, address spender, uint256 value) 
[truncated — full diff is 231,303 bytes]
> ```

> </details>

> 🔒 **Immutable References:** `veProxy()` → VotingEscrowProxy, `governanceToken()` → FXN (Curve DAO Token), `ve()` → veFXN (Voting Escrow)

### > 🔴 `upgradeability (TransparentUpgradeable)`

> > ⚠️ **CRITICAL** — Upgradeability allows arbitrary code replacement. Must be behind both a Multisig AND a Timelock.

> **Privileged write functions:**  
> **Capabilities:** ⬆️ **UPGRADE**
> - `upgradeTo(address)` — Upgrade proxy implementation to a new address `[UPGRADE]`
> - `upgradeToAndCall(address,bytes)` — Upgrade proxy implementation and call an initializer `[UPGRADE]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x68863fb8855b04509a835082478D6E3D0bE4E61a` | [↳ TimelockController (3d)](#c-0x68863fb8855b04509a835082478d6e3d0be4e61a) | 🟢 LOW | — | Storage only | 3d delay (⚠ changed 1x) |


> **Delay history for `TimelockController (3d)` (0x6886...E61a):** 3d → 3d

### > 🟢 `DEFAULT_ADMIN_ROLE` 🔄 5 changes

> **Hash:** `0x0000000000000000000000000000000000000000000000000000000000000000`  
> **Managed by:** `DEFAULT_ADMIN_ROLE`  
> **Privileged write functions:**
> - `updateLiquidityManager(address _newManager)` — Update the address of liquidity manager contract. Make sure the new manager is active and the old manager is inactive.
> - `disableGauge()` — Disable the gauge. When disabled, the gauge always yields a rate of 0 and so cannot mint governance token.

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x68863fb8855b04509a835082478D6E3D0bE4E61a` | [↳ TimelockController (3d)](#c-0x68863fb8855b04509a835082478d6e3d0be4e61a) | 🟢 LOW | 2026-04-20 | Events only · hasRole ✓ | 3d delay (⚠ changed 1x) |

> **🕘 Previous Holders (2)** _(verified inactive — `hasRole`/`is` returned false)_:

> | Address | Name / Type | Granted | Status |
> |---|---|---|---|
> | `0x26B2ec4E02ebe2F54583af25b647b1D619e67BbF` | Gnosis Safe 6/9 | 2025-01-02 | 🕘 HISTORICAL |
> | `0xa1d0027Ca4C0CB79f9403d06A29470abC7b0a468` | EOA | 2025-01-01 | 🕘 HISTORICAL |


> **Delay history for `TimelockController (3d)` (0x6886...E61a):** 3d → 3d

### > 🟠 `veProxy (VotingEscrowProxy): read on every gauge deposit and withdrawal`

> **Hash:** `bfs_seed:veProxy (VotingEscrowProxy): read on every gauge deposit and withdrawal`  
> **Privileged write functions:**  
> **Capabilities:** ⚙️ **CONFIG**
> - `veProxy() (immutable; screened by the scan because it gates no gauge function)` — The gauge reads adjustedVeBalance from this contract on every deposit, withdrawal and transfer (SharedLiquidityGauge _computeWorkingBalance). Its owner, Safe 0x26B2ec4E02ebe2F54583af25b647b1D619e67BbF (Ownable2Step, no pending owner), can repoint its veBoost source with updateVeBoost, which only probes balanceOf(msg.sender). Listed here so the scan covers it.
 `[CONFIG]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x1145f304d74f3295Fa38b82e7BB8704B0E187FA1` | [↳ VotingEscrowProxy](#c-0x1145f304d74f3295fa38b82e7bb8704b0e187fa1) | 🟠 HIGH | — | Storage only |  |

### > 🟢 `REWARD_MANAGER_ROLE`

> **Hash:** `0x0f51adb3f49e4a9bbb17b3783f025995eaf8c24be2c8eefff214bdfda05ef94d`  
> **Managed by:** `DEFAULT_ADMIN_ROLE`  
> **Privileged write functions:**  
> **Capabilities:** ⏸️ **PAUSE**
> - `registerRewardToken(address _token, address _distributor)` — Register a new reward token. Make sure no fee on transfer token is added as reward token. `[PAUSE]`
> - `updateRewardDistributor(address _token, address _newDistributor)` — Update the distributor for reward token.
> - `unregisterRewardToken(address _token)` — Unregister an existing reward token. `[PAUSE]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x26B2ec4E02ebe2F54583af25b647b1D619e67BbF` | [↳ Gnosis Safe 6/9](#c-0x26b2ec4e02ebe2f54583af25b647b1d619e67bbf) | 🟢 LOW | 2026-04-19 | Events only · hasRole ✓ | 6/9 signers |

> **🕘 Previous Holders (1)** _(verified inactive — `hasRole`/`is` returned false)_:

> | Address | Name / Type | Granted | Status |
> |---|---|---|---|
> | `0xa1d0027Ca4C0CB79f9403d06A29470abC7b0a468` | EOA | 2025-01-01 | 🕘 HISTORICAL |

> **Signers of `Gnosis Safe 6/9` (0x26B2...7BbF):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x38a93e70b0D8343657f802C1c3Fdb06aC8F8fe99` | EOA ⚠️ Hot wallet (4,446 txs) | — | EOA |
> | `0x85DB62FdFA9Ee6050f8b422F74D75D2069dA102B` | EOA | 2025-04-16 | EOA |
> | `0xe3522d85d37F55735e9327CD7a5cDe3abaf28E03` | EOA | — | EOA |
> | `0x74390470F4001Ca85D93bD546A4Ab1724359654B` | EOA | — | EOA |
> | `0xeF0Ca09fbf9a5f61E657Fb208b46b8685c1d4766` | EOA | — | EOA |
> | `0x8EcAB7B8ed8215cA52500cbf1548B9239173ef82` | EOA | — | EOA |
> | `0x18411aB626c9b3B3Dd5b7356574D8ff396436744` | EOA | 2026-08-01 | EOA |
> | `0xcdF067F306E7a511Ef701588AFCdcff292B19282` | EOA | 2023-12-26 | EOA |
> | `0xC8Be49a9b1ca1A1cc654491a7cBbD27aBfA06A81` | EOA | 2026-03-13 | EOA |

### > 🟠 `controller()`


> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xe60eB8098B34eD775ac44B1ddE864e098C6d7f37` | [↳ Gauge Controller](#c-0xe60eb8098b34ed775ac44b1dde864e098c6d7f37) | 🟠 HIGH | — | Storage only |  |

### > 🟠 `minter()`


> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xC8b194925D55d5dE9555AD1db74c149329F71DeF` | Token Minter | 🟠 HIGH | — | Storage only |  |

> #### 🔧 Permissioned Parameters

> **`manager`** ❄️ **DORMANT**

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `0x0000000000000000000000000000000000000000` |
> | Setter | `updateLiquidityManager(address _newManager)` |
> | Gated by | `DEFAULT_ADMIN_ROLE` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`registerRewardToken`** *(per-asset)*

> | Field | Value |
> |---|---|
> | Setter | `registerRewardToken(address _token, address _distributor)` |
> | Gated by | `REWARD_MANAGER_ROLE` |
> | Tags | `PAUSE` |
> | Last called | 2025-01-01 |
> | Called by | `0xa1d0...a468` (EOA) |
> | Total calls | 2 |

> **Recent changes:**

> | # | Asset | Value | Set By | Date |
> |---|---|---|---|---|
> | 1 | wstETH (WstETH) | `—` | `0xa1d0...a468` (EOA) | 2025-01-01 |
> | 2 | FXN (Curve DAO Token) | `—` | `0xa1d0...a468` (EOA) | 2025-01-01 |

> **`unregisterRewardToken`** *(per-asset)* ❄️ **DORMANT**

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Setter | `unregisterRewardToken(address _token)` |
> | Gated by | `REWARD_MANAGER_ROLE` |
> | Tags | `PAUSE` |
> | Last called | — |
> | Called by | — |
> | Total calls | 0 ❄️ |

---
<a id="c-0x0559a1b22409eef7559a5c88cbaa4e285e7b9c30"></a>
## > RewardHarvester `0x0559a1b22409Eef7559a5c88cbaA4e285e7b9C30`

> *4 roles · 4 members · 2 functions*

> 🔒 **Immutable References:** `receiver()` → fxSAVE (TransparentUpgradeableProxy)

### > 🟢 `DEFAULT_ADMIN_ROLE`

> **Hash:** `0x0000000000000000000000000000000000000000000000000000000000000000`  
> **Managed by:** `DEFAULT_ADMIN_ROLE`  
> **Privileged write functions:**  
> **Capabilities:** 💰 **SUPPLY**
> - `withdraw(address baseToken, address recipient)` — Burns shares from owner and sends exactly assets of underlying tokens to receiver. - MUST emit the Withdraw event. `[SUPPLY]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x26B2ec4E02ebe2F54583af25b647b1D619e67BbF` | [↳ Gnosis Safe 6/9](#c-0x26b2ec4e02ebe2f54583af25b647b1d619e67bbf) | 🟢 LOW | 2025-03-18 | Events only · hasRole ✓ | 6/9 signers |

> **🕘 Previous Holders (1)** _(verified inactive — `hasRole`/`is` returned false)_:

> | Address | Name / Type | Granted | Status |
> |---|---|---|---|
> | `0xa1d0027Ca4C0CB79f9403d06A29470abC7b0a468` | EOA | 2025-03-17 | 🕘 HISTORICAL |

> **Signers of `Gnosis Safe 6/9` (0x26B2...7BbF):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x38a93e70b0D8343657f802C1c3Fdb06aC8F8fe99` | EOA ⚠️ Hot wallet (4,446 txs) | — | EOA |
> | `0x85DB62FdFA9Ee6050f8b422F74D75D2069dA102B` | EOA | 2025-04-16 | EOA |
> | `0xe3522d85d37F55735e9327CD7a5cDe3abaf28E03` | EOA | — | EOA |
> | `0x74390470F4001Ca85D93bD546A4Ab1724359654B` | EOA | — | EOA |
> | `0xeF0Ca09fbf9a5f61E657Fb208b46b8685c1d4766` | EOA | — | EOA |
> | `0x8EcAB7B8ed8215cA52500cbf1548B9239173ef82` | EOA | — | EOA |
> | `0x18411aB626c9b3B3Dd5b7356574D8ff396436744` | EOA | 2026-08-01 | EOA |
> | `0xcdF067F306E7a511Ef701588AFCdcff292B19282` | EOA | 2023-12-26 | EOA |
> | `0xC8Be49a9b1ca1A1cc654491a7cBbD27aBfA06A81` | EOA | 2026-03-13 | EOA |

### > 🟠 `PERMISSIONED_ROUTER_ROLE`

> **Hash:** `0x795faeccae94bd9eed40852cb158e30f590ffa7acbfa89a0204147c5bcf072cd`  
> **Managed by:** `DEFAULT_ADMIN_ROLE`  
> **Privileged write functions:**
> - `swapAndDistribute(uint256 amountIn, address baseToken, address targetToken, TradingParameter memory params)` — Harvest base token to target token by amm trading and distribute to fxSAVE.

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x12AF4529129303D7FbD2563E242C4a2890525912` | MultiPathConverter | 🟠 HIGH | 2025-03-19 | Events only · hasRole ✓ |  |

### > 🔴 `PERMISSIONED_TRADER_ROLE`

> **Hash:** `0x84060c990e14b08d7c5d95f3c4be08c8b28742dee5236bc38e7559b465ca531f`  
> **Managed by:** `DEFAULT_ADMIN_ROLE`  
> **Privileged write functions:**
> - `swapAndDistribute(uint256 amountIn, address baseToken, address targetToken, TradingParameter memory params)` — Harvest base token to target token by amm trading and distribute to fxSAVE.

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x4215F2014239Cf0E1A8617b31Fcaf88AaC6e4779` | EOA | 🔴 CRITICAL | 2025-03-19 | Events only · hasRole ✓ | ⚠️ Single private key |

> #### 💰 Supply Actions

> _Mint / redeem / burn call tracking — last 5 calls per function, total counts preserved._

> **`withdraw`** *(per-asset)* ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Setter | `withdraw(address baseToken, address recipient)` |
> | Gated by | `DEFAULT_ADMIN_ROLE` |
> | Tags | `SUPPLY` |
> | Last called | — |
> | Called by | — |
> | Total calls | 0 ❄️ |

---
<a id="c-0x4bfc5292da18e32ed2354350e07e417ce4796f9c"></a>
## > StakingProxyERC20 `0x4bFc5292DA18e32ED2354350e07e417cE4796f9C`

> *8 roles · 8 members · 6 functions*

> 🔒 **Immutable References:** `feeRegistry()` → FeeRegistry, `poolRegistry()` → PoolRegistry, `fxnMinter()` → Token Minter, `gaugeAddress()` → fxSP-Gauge (TransparentUpgradeableProxy)

### > 🟠 `owner()`

> **Privileged write functions:**
> - `deposit(uint256 _amount)`
> - `deposit(uint256 _amount, bool _manage)`
> - `withdraw(uint256 _amount)`
> - `transferTokens(address[] calldata _tokenList)`
> - `execute(address _to, uint256 _value, bytes calldata _data)`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x7743e50F534a7f9F1791DdE7dCD89F7783Eefc39` | [↳ fxSAVE (TransparentUpgradeableProxy)](#c-0x7743e50f534a7f9f1791dde7dcd89f7783eefc39) | 🟠 HIGH | — | Storage only |  |

### > 🟠 `fxn()`

> **Privileged write functions:**
> - `execute(address _to, uint256 _value, bytes calldata _data)`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x365AccFCa291e7D3914637ABf1F7635dB165Bb09` | FXN (Curve DAO Token) | 🟠 HIGH | — | Storage only |  |

### > 🟠 `rewards()`

> **Privileged write functions:**
> - `execute(address _to, uint256 _value, bytes calldata _data)`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x4187DC4998bB9f47389cD885A80a52A74EC8803c` | [↳ MultiRewards](#c-0x4187dc4998bb9f47389cd885a80a52a74ec8803c) | 🟠 HIGH | — | Storage only |  |

### > 🟠 `vefxnProxy()`

> **Privileged write functions:**
> - `setVeFXNProxy(address _proxy)`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xd11a4Ee017cA0BECA8FA45fF2abFe9C6267b7881` | FxnVoterProxy | 🟠 HIGH | — | Storage only |  |

---
<a id="c-0x50562fe7e870420f5aae480b7f94eb4ace2fcd70"></a>
## > PegKeeper `0x50562fe7e870420F5AAe480B7F94EB4ace2fcd70`

> *10 roles · 9 members · 9 functions*

> > ⚠️ **Upgradeable** (TransparentUpgradeable) — impl: `0x17e2e8ca0B35aA750771e000D1E926417b97f29d`

> **Proxy History (5 events):**

> | # | Date | Event | Address | Key Changes | Tx |
> |---|---|---|---|---|---|
> | 1 | 2025-01-01 | Upgrade | `0x3875...E206` | Initial deployment | [0xf23e795bfa816a614d184b2d30afae53be2c6df155c2c0183674d9368d1f10e3](https://etherscan.io/tx/0xf23e795bfa816a614d184b2d30afae53be2c6df155c2c0183674d9368d1f10e3) |
> | 2 | 2025-01-01 | Admin Changed | `0xd41d...324B` | Previous: `0x0000...0000` | [0xf23e795bfa816a614d184b2d30afae53be2c6df155c2c0183674d9368d1f10e3](https://etherscan.io/tx/0xf23e795bfa816a614d184b2d30afae53be2c6df155c2c0183674d9368d1f10e3) |
> | 3 | 2025-01-01 | Upgrade | `0x2BA1...c1AA` | +9 fn; added `BUYBACK_ROLE()`; added `DEFAULT_ADMIN_ROLE()`; added `STABILIZE_ROLE()`; added `getRoleAdmin(bytes32)`; added `grantRole(bytes32,address)`; added `hasRole(bytes32,address)`; added `initialize(address,address,address)`; added `renounceRole(bytes32,address)`; added `revokeRole(bytes32,address)`; 📝 src +22886/-2 | [0x9a3cfade83421b7d7efabc8e00c49164a45d6dbb7f193bd379cde4b70238e848](https://etherscan.io/tx/0x9a3cfade83421b7d7efabc8e00c49164a45d6dbb7f193bd379cde4b70238e848) |
> | 4 | 2025-01-01 | Admin Changed | `0x9B54...DDA4` | Previous: `0xd41d...324B` | [0xa6eeb0b72a78baa51c3a67febb698af05229720a95840175588421ccf09d1782](https://etherscan.io/tx/0xa6eeb0b72a78baa51c3a67febb698af05229720a95840175588421ccf09d1782) |
> | 5 | 2025-06-18 | Upgrade | `0x17e2...f29d` | 📝 src +2572/-6143 | [0x4535ea1f9b74e65c55336cd3ac3d2c7d7b4f76373a4a5c9fd287e99b48137250](https://etherscan.io/tx/0x4535ea1f9b74e65c55336cd3ac3d2c7d7b4f76373a4a5c9fd287e99b48137250) |

> <details>
> <summary>📝 Source diff — upgrade #3 (<code>0x3875...E206</code> → <code>0x2BA1...c1AA</code>): +22886/-2 lines (truncated)</summary>

> ```diff
--- old_impl
+++ new_impl
@@ -1,5 +1,22889 @@
 // SPDX-License-Identifier: MIT
-
-pragma solidity =0.8.20;
+// OpenZeppelin Contracts (last updated v4.9.0) (access/AccessControl.sol)
+
+pragma solidity ^0.8.0;
+
+import "./IAccessControlUpgradeable.sol";
+import "../utils/ContextUpgradeable.sol";
+import "../utils/StringsUpgradeable.sol";
+import "../utils/introspection/ERC165Upgradeable.sol";
+import {Initializable} from "../proxy/utils/Initializable.sol";
+
+/**
+ * @dev Contract module that allows children to implement role-based access
+ * control mechanisms. This is a lightweight version that doesn't allow enumerating role
+ * members except through off-chain means by accessing the contract event logs. Some
+ * applications may benefit from on-chain enumerability, for those cases see
+ * {AccessControlEnumerable}.
+ *
+ * Roles are referred to by their `bytes32` identifier. These should be exposed
+ * in the external API and be unique. The best way to achieve this is by
+ * using `public constant` hash digests:
+ *
+ * ```solidity
+ * bytes32 public constant MY_ROLE = keccak256("MY_ROLE");
+ * ```
+ *
+ * Roles can be used to represent a set of permissions. To restrict access to a
+ * function call, use {hasRole}:
+ *
+ * ```solidity
+ * function foo() public {
+ *     require(hasRole(MY_ROLE, msg.sender));
+ *     ...
+ * }
+ * ```
+ *
+ * Roles can be granted and revoked dynamically via the {grantRole} and
+ * {revokeRole} functions. Each role has an associated admin role, and only
+ * accounts that have a role's admin role can call {grantRole} and {revokeRole}.
+ *
+ * By default, the admin role for all roles is `DEFAULT_ADMIN_ROLE`, which means
+ * that only accounts with this role will be able to grant or revoke other
+ * roles. More complex role relationships can be created by using
+ * {_setRoleAdmin}.
+ *
+ * WARNING: The `DEFAULT_ADMIN_ROLE` is also its own admin: it has permission to
+ * grant and revoke this role. Extra precautions should be taken to secure
+ * accounts that have been granted it. We recommend using {AccessControlDefaultAdminRules}
+ * to enforce additional security measures for this role.
+ */
+abstract contract AccessControlUpgradeable is Initializable, ContextUpgradeable, IAccessControlUpgradeable, ERC165Upgradeable {
+    struct RoleData {
+        mapping(address => bool) members;
+        bytes32 adminRole;
+    }
+
+    mapping(bytes32 => RoleData) private _roles;
+
+    bytes32 public constant DEFAULT_ADMIN_ROLE = 0x00;
+
+    /**
+     * @dev Modifier that checks that an account has a specific role. Reverts
+     * with a standardized message including the required role.
+     *
+     * The format of the revert reason is given by the following regular expression:
+     *
+     *  /^AccessControl: account (0x[0-9a-f]{40}) is missing role (0x[0-9a-f]{64})$/
+     *
+     * _Available since v4.1._
+     */
+    modifier onlyRole(bytes32 role) {
+        _checkRole(role);
+        _;
+    }
+
+    function __AccessControl_init() internal onlyInitializing {
+    }
+
+    function __AccessControl_init_unchained() internal onlyInitializing {
+    }
+    /**
+     * @dev See {IERC165-supportsInterface}.
+     */
+    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
+        return interfaceId == type(IAccessControlUpgradeable).interfaceId || super.supportsInterface(interfaceId);
+    }
+
+    /**
+     * @dev Returns `true` if `account` has been granted `role`.
+     */
+    function hasRole(bytes32 role, address account) public view virtual override returns (bool) {
+        return _roles[role].members[account];
+    }
+
+    /**
+     * @dev Revert with a standard message if `_msgSender()` is missing `role`.
+     * Overriding this function changes the behavior of the {onlyRole} modifier.
+     *
+     * Format of the revert message is described in {_checkRole}.
+     *
+     * _Available since v4.6._
+     */
+    function _checkRole(bytes32 role) internal view virtual {
+        _checkRole(role, _msgSender());
+    }
+
+    /**
+     * @dev Revert with a standard message if `account` is missing `role`.
+     *
+     * The format of the revert reason is given by the following regular expression:
+     *
+     *  /^AccessControl: account (0x[0-9a-f]{40}) is missing role (0x[0-9a-f]{64})$/
+     */
+    function _checkRole(bytes32 role, address account) internal view virtual {
+        if (!hasRole(role, account)) {
+            revert(
+                string(
+                    abi.encodePacked(
+                        "AccessControl: account ",
+                        StringsUpgradeable.toHexString(account),
+                        " is missing role ",
+                        StringsUpgradeable.toHexString(uint256(role), 32)
+                    )
+                )
+            );
+        }
+    }
+
+    /**
+     * @dev Returns the admin role that controls `role`. See {grantRole} and
+     * {revokeRole}.
+     *
+     * To change a role's admin, use {_setRoleAdmin}.
+     */
+    function getRoleAdmin(bytes32 role) public view virtual override returns (bytes32) {
+        return _roles[role].adminRole;
+    }
+
+    /**
+     * @dev Grants `role` to `account`.
+     *
+     * If `account` had not been already granted `role`, emits a {RoleGranted}
+     * event.
+     *
+     * Requirements:
+     *
+     * - the caller must have ``role``'s admin role.
+     *
+     * May emit a {RoleGranted} event.
+     */
+    function grantRole(bytes32 role, address account) public virtual override onlyRole(getRoleAdmin(role)) {
+        _grantRole(role, account);
+    }
+
+    /**
+     * @dev Revokes `role` from `account`.
+     *
+     * If `account` had been granted `role`, emits a {RoleRevoked} event.
+     *
+     * Requirements:
+     *
+     * - the caller must have ``role``'s admin role.
+     *
+     * May emit a {RoleRevoked} event.
+     */
+    function revokeRole(bytes32 role, address account) public virtual override onlyRole(getRoleAdmin(role)) {
+        _revokeRole(role, account);
+    }
+
+    /**
+     * @dev Revokes `role` from the calling account.
+     *
+     * Roles are often managed via {grantRole} and {revokeRole}: this function's
+     * purpose is to provide a mechanism for accounts to lose their privileges
+     * if they are compromised (such as when a trusted device is misplaced).
+     *
+     * If the calling account had been revoked `role`, emits a {RoleRevoked}
+     * event.
+     *
+     * Requirements:
+     *
+     * - the caller must be `account`.
+     *
+     * May emit a {RoleRevoked} event.
+     */
+    function renounceRole(bytes32 role, address account) public virtual override {
+        require(account == _msgSender(), "AccessControl: can only renounce roles for self");
+
+        _revokeRole(role, account);
+    }
+
+    /**
+     * @dev Grants `role` to `account`.
+     *
+     * If `account` had not been already granted `role`, emits a {RoleGranted}
+     * event. Note that unlike {grantRole}, this function doesn't perform any
+     * checks on the calling account.
+     *
+     * May emit a {RoleGranted} event.
+     *
+     * [WARNING]
+     * ====
+     * This function should only be called from the constructor when setting
+     * up the initial roles for the system.
+     *
+     * Using this function in any other way is effectively circumventing the admin
+     * system imposed by {AccessControl}.
+     * ====
+     *
+     * NOTE: This function is deprecated in favor of {_grantRole}.
+     */
+    function _setupRole(bytes32 role, address account) internal virtual {
+        _grantRole(role, account);
+    }
+
+    /**
+     * @dev Sets `adminRole` as ``role``'s admin role.
+     *
+     * Emits a {RoleAdminChanged} event.
+     */
+    function _setRoleAdmin(bytes32 role, bytes32 adminRole) internal virtual {
+        bytes32 previousAdminRole = getRoleAdmin(role);
+        _roles[role].adminRole = adminRole;
+        emit RoleAdminChanged(role, previousAdminRole, adminRole);
+    }
+
+    /**
+     * @dev Grants `role` to `account`.
+     *
+     * Internal function without access restriction.
+     *
+     * May emit a {RoleGranted} event.
+     */
+    function _grantRole(bytes32 role, address account) internal virtual {
+        if (!hasRole(role, account)) {
+            _roles[role].members[account] = true;
+            emit RoleGranted(role, account, _msgSender());
+        }
+    }
+
+    /**
+     * @dev Revokes `role` from `account`.
+     *
+     * Internal function without access restriction.
+     *
+     * May emit a {RoleRevoked} event.
+     */
+    function _revokeRole(bytes32 role, address account) internal virtual {
+        if (hasRole(role, account)) {
+            _roles[role].members[account] = false;
+            emit RoleRevoked(role, account, _msgSender());
+        }
+    }
+
+    /**
+     * @dev This empty reserved space is put in place to allow future versions to add new
+     * variables without shifting down storage in the inheritance chain.
+     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
+     */
+    uint256[49] private __gap;
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts v4.4.1 (access/IAccessControl.sol)
+
+pragma solidity ^0.8.0;
+
+/**
+ * @dev External interface of AccessControl declared to support ERC165 detection.
+ */
+interface IAccessControlUpgradeable {
+    /**
+     * @dev Emitted when `newAdminRole` is set as ``role``'s admin role, replacing `previousAdminRole`
+     *
+     * `DEFAULT_ADMIN_ROLE` is the starting admin for all roles, despite
+     * {RoleAdminChanged} not being emitted signaling this.
+     *
+     * _Available since v3.1._
+     */
+    event RoleAdminChanged(bytes32 indexed role, bytes32 indexed previousAdminRole, bytes32 indexed newAdminRole);
+
+    /**
+     * @dev Emitted when `account` is granted `role`.
+     *
+     * `sender` is the account that originated the contract call, an admin role
+     * bearer except when using {AccessControl-_setupRole}.
+     */
+    event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender);
+
+    /**
+     * @dev Emitted when `account` is revoked `role`.
+     *
+     * `sender` is the account that originated the contract call:
+     *   - if using `revokeRole`, it is the admin role bearer
+     *   - if using `renounceRole`, it is the role bearer (i.e. `account`)
+     */
+    event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender);
+
+    /**
+     * @dev Returns `true` if `account` has been granted `role`.
+     */
+    function hasRole(bytes32 role, address account) external view returns (bool);
+
+    /**
+     * @dev Returns the admin role that controls `role`. See {grantRole} and
+     * {revokeRole}.
+     *
+     * To change a role's admin, use {AccessControl-_setRoleAdmin}.
+     */
+    function getRoleAdmin(bytes32 role) external view returns (bytes32);
+
+    /**
+     * @dev Grants `role` to `account`.
+     *
+     * If `account` had not been already granted `role`, emits a {RoleGranted}
+     * event.
+     *
+     * Requirements:
+     *
+     * - the caller must have ``role``'s admin role.
+     */
+    function grantRole(bytes32 role, address account) external;
+
+    /**
+     * @dev Revokes `role` from `account`.
+     *
+     * If `account` had been granted `role`, emits a {RoleRevoked} event.
+     *
+     * Requirements:
+     *
+     * - the caller must have ``role``'s admin role.
+     */
+    function revokeRole(bytes32 role, address account) external;
+
+    /**
+     * @dev Revokes `role` from the calling account.
+     *
+     * Roles are often managed via {grantRole} and {revokeRole}: this function's
+     * purpose is to provide a mechanism for accounts to lose their privileges
+     * if they are compromised (such as when a trusted device is misplaced).
+     *
+     * If the calling account had been granted `role`, emits a {RoleRevoked}
+     * event.
+     *
+     * Requirements:
+     *
+     * - the caller must be `account`.
+     */
+    function renounceRole(bytes32 role, address account) external;
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts (last updated v4.9.0) (interfaces/IERC5267.sol)
+
+pragma solidity ^0.8.0;
+
+interface IERC5267Upgradeable {
+    /**
+     * @dev MAY be emitted to signal that the domain could have changed.
+     */
+    event EIP712DomainChanged();
+
+    /**
+     * @dev returns the fields and values that describe the domain separator used by this contract for EIP-712
+     * signature.
+     */
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
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts (last updated v4.9.0) (proxy/utils/Initializable.sol)
+
+pragma solidity ^0.8.2;
+
+import "../../utils/AddressUpgradeable.sol";
+
+/**
+ * @dev This is a base contract to aid in writing upgradeable contracts, or any kind of contract that will be deployed
+ * behind a proxy. Since proxied contracts do not make use of a constructor, it's common to move constructor logic to an
+ * external initializer function, usually called `initialize`. It then becomes necessary to protect this initializer
+ * function so it can only be called once. The {initializer} modifier provided by this contract will have this effect.
+ *
+ * The initialization functions use a version number. Once a version number is used, it is consumed and cannot be
+ * reused. This mechanism prevents re-execution of each "step" but allows the creation of new initialization steps in
+ * case an upgrade adds a module that needs to be initialized.
+ *
+ * For example:
+ *
+ * [.hljs-theme-light.nopadding]
+ * ```solidity
+ * contract MyToken is ERC20Upgradeable {
+ *     function initialize() initializer public {
+ *         __ERC20_init("MyToken", "MTK");
+ *     }
+ * }
+ *
+ * contract MyTokenV2 is MyToken, ERC20PermitUpgradeable {
+ *     function initializeV2() reinitializer(2) public {
+ *         __ERC20Permit_init("MyToken");
+ *     }
+ * }
+ * ```
+ *
+ * TIP: To avoid leaving the proxy in an uninitialized state, the initializer function should be called as early as
+ * possible by providing the encoded function call as the `_data` argument to {ERC1967Proxy-constructor}.
+ *
+ * CAUTION: When used with inheritance, manual care must be taken to not invoke a parent initializer twice, or to ensure
+ * that all initializers are idempotent. This is not verified automatically as constructors are by Solidity.
+ *
+ * [CAUTION]
+ * ====
+ * Avoid leaving a contract uninitialized.
+ *
+ * An uninitialized contract can be taken over by an attacker. This applies to both a proxy and its implementation
+ * contract, which may impact the proxy. To prevent the implementation contract from being used, you should invoke
+ * the {_disableInitializers} function in the constructor to automatically lock it when it is deployed:
+ *
+ * [.hljs-theme-light.nopadding]
+ * ```
+ * /// @custom:oz-upgrades-unsafe-allow constructor
+ * constructor() {
+ *     _disableInitializers();
+ * }
+ * ```
+ * ====
+ */
+abstract contract Initializable {
+    /**
+     * @dev Indicates that the contract has been initialized.
+     * @custom:oz-retyped-from bool
+     */
+    uint8 private _initialized;
+
+    /**
+     * @dev Indicates that the contract is in the process of being initialized.
+     */
+    bool private _initializing;
+
+    /**
+     * @dev Triggered when the contract has been initialized or reinitialized.
+     */
+    event Initialized(uint8 version);
+
+    /**
+     * @dev A modifier that defines a protected initializer function that can be invoked at most once. In its scope,
+     * `onlyInitializing` functions can be used to initialize parent contracts.
+     *
+     * Similar to `reinitializer(1)`, except that functions marked with `initializer` can be nested in the context of a
+     * constructor.
+     *
+     * Emits an {Initialized} event.
+     */
+    modifier initializer() {
+        bool isTopLevelCall = !_initializing;
+        require(
+            (isTopLevelCall && _initialized < 1) || (!AddressUpgradeable.isContract(address(this)) && _initialized == 1),
+            "Initializable: contract is already initialized"
+        );
+        _initialized = 1;
+        if (isTopLevelCall) {
+            _initializing = true;
+        }
+        _;
+        if (isTopLevelCall) {
+            _initializing = false;
+            emit Initialized(1);
+        }
+    }
+
+    /**
+     * @dev A modifier that defines a protected reinitializer function that can be invoked at most once, and only if the
+     * contract hasn't been initialized to a greater version before. In its scope, `onlyInitializing` functions can be
+     * used to initialize parent contracts.
+     *
+     * A reinitializer may be used after the original initialization step. This is essential to configure modules that
+     * are added through upgrades and that require initialization.
+     *
+     * When `version` is 1, this modifier is similar to `initializer`, except that functions marked with `reinitializer`
+     * cannot be nested. If one is invoked in the context of another, execution will revert.
+     *
+     * Note that versions can jump in increments greater than 1; this implies that if multiple reinitializers coexist in
+     * a contract, executing them in the right order is up to the developer or operator.
+     *
+     * WARNING: setting the version to 255 will prevent any future reinitialization.
+     *
+     * Emits an {Initialized} event.
+     */
+    modifier reinitializer(uint8 version) {
+        require(!_initializing && _initialized < version, "Initializable: contract is already initialized");
+        _initialized = version;
+        _initializing = true;
+        _;
+        _initializing = false;
+        emit Initialized(version);
+    }
+
+    /**
+     * @dev Modifier to protect an initialization function so that it can only be invoked by functions with the
+     * {initializer} and {reinitializer} modifiers, directly or indirectly.
+     */
+    modifier onlyInitializing() {
+        require(_initializing, "Initializable: contract is not initializing");
+        _;
+    }
+
+    /**
+     * @dev Locks the contract, preventing any future reinitialization. This cannot be part of an initializer call.
+     * Calling this in the constructor of a contract will prevent that contract from being initialized or reinitialized
+     * to any version. It is recommended to use this to lock implementation contracts that are designed to be called
+     * through proxies.
+     *
+     * Emits an {Initialized} event the first time it is successfully executed.
+     */
+    function _disableInitializers() internal virtual {
+        require(!_initializing, "Initializable: contract is initializing");
+        if (_initialized != type(uint8).max) {
+            _initialized = type(uint8).max;
+            emit Initialized(type(uint8).max);
+        }
+    }
+
+    /**
+     * @dev Returns the highest version that has been initialized. See {reinitializer}.
+     */
+    function _getInitializedVersion() internal view returns (uint8) {
+        return _initialized;
+    }
+
+    /**
+     * @dev Returns `true` if the contract is currently initializing. See {onlyInitializing}.
+     */
+    function _isInitializing() internal view returns (bool) {
+        return _initializing;
+    }
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts (last updated v4.9.0) (security/ReentrancyGuard.sol)
+
+pragma solidity ^0.8.0;
+import {Initializable} from "../proxy/utils/Initializable.sol";
+
+/**
+ * @dev Contract module that helps prevent reentrant calls to a function.
+ *
+ * Inheriting from `ReentrancyGuard` will make the {nonReentrant} modifier
+ * available, which can be applied to functions to make sure there are no nested
+ * (reentrant) calls to them.
+ *
+ * Note that because there is a single `nonReentrant` guard, functions marked as
+ * `nonReentrant` may not call one another. This can be worked around by making
+ * those functions `private`, and then adding `external` `nonReentrant` entry
+ * points to them.
+ *
+ * TIP: If you would like to learn more about reentrancy and alternative ways
+ * to protect against it, check out our blog post
+ * https://blog.openzeppelin.com/reentrancy-after-istanbul/[Reentrancy After Istanbul].
+ */
+abstract contract ReentrancyGuardUpgradeable is Initializable {
+    // Booleans are more expensive than uint256 or any type that takes up a full
+    // word because each write operation emits an extra SLOAD to first read the
+    // slot's contents, replace the bits taken up by the boolean, and then write
+    // back. This is the compiler's defense against contract upgrades and
+    // pointer aliasing, and it cannot be disabled.
+
+    // The values being non-zero value makes deployment a bit more expensive,
+    // but in exchange the refund on every call to nonReentrant will be lower in
+    // amount. Since refunds are capped to a percentage of the total
+    // transaction's gas, it is best to keep them low in cases like this one, to
+    // increase the likelihood of the full refund coming into effect.
+    uint256 private constant _NOT_ENTERED = 1;
+    uint256 private constant _ENTERED = 2;
+
+    uint256 private _status;
+
+    function __ReentrancyGuard_init() internal onlyInitializing {
+        __ReentrancyGuard_init_unchained();
+    }
+
+    function __ReentrancyGuard_init_unchained() internal onlyInitializing {
+        _status = _NOT_ENTERED;
+    }
+
+    /**
+     * @dev Prevents a contract from calling itself, directly or indirectly.
+     * Calling a `nonReentrant` function from another `nonReentrant`
+     * function is not supported. It is possible to prevent this from happening
+     * by making the `nonReentrant` function external, and making it call a
+     * `private` function that does the actual work.
+     */
+    modifier nonReentrant() {
+        _nonReentrantBefore();
+        _;
+        _nonReentrantAfter();
+    }
+
+    function _nonReentrantBefore() private {
+        // On the first call to nonReentrant, _status will be _NOT_ENTERED
+        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");
+
+        // Any calls to nonReentrant after this point will fail
+        _status = _ENTERED;
+    }
+
+    function _nonReentrantAfter() private {
+        // By storing the original value once again, a refund is triggered (see
+        // https://eips.ethereum.org/EIPS/eip-2200)
+        _status = _NOT_ENTERED;
+    }
+
+    /**
+     * @dev Returns true if the reentrancy guard is currently set to "entered", which indicates there is a
+     * `nonReentrant` function in the call stack.
+     */
+    function _reentrancyGuardEntered() internal view returns (bool) {
+        return _status == _ENTERED;
+    }
+
+    /**
+     * @dev This empty reserved space is put in place to allow future versions to add new
+     * variables without shifting down storage in the inheritance chain.
+     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
+     */
+    uint256[49] private __gap;
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts (last updated v4.9.0) (token/ERC20/ERC20.sol)
+
+pragma solidity ^0.8.0;
+
+import "./IERC20Upgradeable.sol";
+import "./extensions/IERC20MetadataUpgradeable.sol";
+import "../../utils/ContextUpgradeable.sol";
+import {Initializable} from "../../proxy/utils/Initializable.sol";
+
+/**
+ * @dev Implementation of the {IERC20} interface.
+ *
+ * This implementation is agnostic to the way tokens are created. This means
+ * that a supply mechanism has to be added in a derived contract using {_mint}.
+ * For a generic mechanism see {ERC20PresetMinterPauser}.
+ *
+ * TIP: For a detailed writeup see our guide
+ * https://forum.openzeppelin.com/t/how-to-implement-erc20-supply-mechanisms/226[How
+ * to implement supply mechanisms].
+ *
+ * The default value of {decimals} is 18. To change this, you should override
+ * this function so it returns a different value.
+ *
+ * We have followed general OpenZeppelin Contracts guidelines: functions revert
+ * instead returning `false` on failure. This behavior is nonetheless
+ * conventional and does not conflict with the expectations of ERC20
+ * applications.
+ *
+ * Additionally, an {Approval} event is emitted on calls to {transferFrom}.
+ * This allows applications to reconstruct the allowance for all accounts just
+ * by listening to said events. Other implementations of the EIP may not emit
+ * these events, as it isn't required by the specification.
+ *
+ * Finally, the non-standard {decreaseAllowance} and {increaseAllowance}
+ * functions have been added to mitigate the well-known issues around setting
+ * allowances. See {IERC20-approve}.
+ */
+contract ERC20Upgradeable is Initializable, ContextUpgradeable, IERC20Upgradeable, IERC20MetadataUpgradeable {
+    mapping(address => uint256) private _balances;
+
+    mapping(address => mapping(address => uint256)) private _allowances;
+
+    uint256 private _totalSupply;
+
+    string private _name;
+    string private _symbol;
+
+    /**
+     * @dev Sets the values for {name} and {symbol}.
+     *
+     * All two of these values are immutable: they can only be set once during
+     * construction.
+     */
+    function __ERC20_init(string memory name_, string memory symbol_) internal onlyInitializing {
+        __ERC20_init_unchained(name_, symbol_);
+    }
+
+    function __ERC20_init_unchained(string memory name_, string memory symbol_) internal onlyInitializing {
+        _name = name_;
+        _symbol = symbol_;
+    }
+
+    /**
+     * @dev Returns the name of the token.
+     */
+    function name() public view virtual override returns (string memory) {
+        return _name;
+    }
+
+    /**
+     * @dev Returns the symbol of the token, usually a shorter version of the
+     * name.
+     */
+    function symbol() public view virtual override returns (string memory) {
+        return _symbol;
+    }
+
+    /**
+     * @dev Returns the number of decimals used to get its user representation.
+     * For example, if `decimals` equals `2`, a balance of `505` tokens should
+     * be displayed to a user as `5.05` (`505 / 10 ** 2`).
+     *
+     * Tokens usually opt for a value of 18, imitating the relationship between
+     * Ether and Wei. This is the default value returned by this function, unless
+     * it's overridden.
+     *
+     * NOTE: This information is only used for _display_ purposes: it in
+     * no way affects any of the arithmetic of the contract, including
+     * {IERC20-balanceOf} and {IERC20-transfer}.
+     */
+    function decimals() public view virtual override returns (uint8) {
+        return 18;
+    }
+
+    /**
+     * @dev See {IERC20-totalSupply}.
+     */
+    function totalSupply() public view virtual override returns (uint256) {
+        return _totalSupply;
+    }
+
+    /**
+     * @dev See {IERC20-balanceOf}.
+     */
+    function balanceOf(address account) public view virtual override returns (uint256) {
+        return _balances[account];
+    }
+
+    /**
+     * @dev See {IERC20-transfer}.
+     *
+     * Requirements:
+     *
+     * - `to` cannot be the zero address.
+     * - the caller must have a balance of at least `amount`.
+     */
+    function transfer(address to, uint256 amount) public virtual override returns (bool) {
+        address owner = _msgSender();
+        _transfer(owner, to, amount);
+        return true;
+    }
+
+    /**
+     * @dev See {IERC20-allowance}.
+     */
+    function allowance(address owner, address spender) public view virtual override returns (uint256) {
+        return _allowances[owner][spender];
+    }
+
+    /**
+     * @dev See {IERC20-approve}.
+     *
+     * NOTE: If `amount` is the maximum `uint256`, the allowance is not updated on
+     * `transferFrom`. This is semantically equivalent to an infinite approval.
+     *
+     * Requirements:
+     *
+     * - `spender` cannot be the zero address.
+     */
+    function approve(address spender, uint256 amount) public virtual override returns (bool) {
+        address owner = _msgSender();
+        _approve(owner, spender, amount);
+        return true;
+    }
+
+    /**
+     * @dev See {IERC20-transferFrom}.
+     *
+     * Emits an {Approval} event indicating the updated allowance. This is not
+     * required by the EIP. See the note at the beginning of {ERC20}.
+     *
+     * NOTE: Does not update the allowance if the current allowance
+     * is the maximum `uint256`.
+     *
+     * Requirements:
+     *
+     * - `from` and `to` cannot be the zero address.
+     * - `from` must have a balance of at least `amount`.
+     * - the caller must have allowance for ``from``'s tokens of at least
+     * `amount`.
+     */
+    function transferFrom(address from, address to, uint256 amount) public virtual override returns (bool) {
+        address spender = _msgSender();
+        _spendAllowance(from, spender, amount);
+        _transfer(from, to, amount);
+        return true;
+    }
+
+    /**
+     * @dev Atomically increases the allowance granted to `spender` by the caller.
+     *
+     * This is an alternative to {approve} that can be used as a mitigation for
+     * problems described in {IERC20-approve}.
+     *
+     * Emits an {Approval} event indicating the updated allowance.
+     *
+     * Requirements:
+     *
+     * - `spender` cannot be the zero address.
+     */
+    function increaseAllowance(address spender, uint256 addedValue) public virtual returns (bool) {
+        address owner = _msgSender();
+        _approve(owner, spender, allowance(owner, spender) + addedValue);
+        return true;
+    }
+
+    /**
+     * @dev Atomically decreases the allowance granted to `spender` by the caller.
+     *
+     * This is an alternative to {approve} that can be used as a mitigation for
+     * problems described in {IERC20-approve}.
+     *
+     * Emits an {Approval} event indicating the updated allowance.
+     *
+     * Requirements:
+     *
+     * - `spender` cannot be the zero address.
+     * - `spender` must have allowance for the caller of at least
+     * `subtractedValue`.
+     */
+    function decreaseAllowance(address spender, uint256 subtractedValue) public virtual returns (bool) {
+        address owner = _msgSender();
+        uint256 currentAllowance = allowance(owner, spender);
+        require(currentAllowance >= subtractedValue, "ERC20: decreased allowance below zero");
+        unchecked {
+            _approve(owner, spender, currentAllowance - subtractedValue);
+        }
+
+        return true;
+    }
+
+    /**
+     * @dev Moves `amount` of tokens from `from` to `to`.
+     *
+     * This internal function is equivalent to {transfer}, and can be used to
+     * e.g. implement automatic token fees, slashing mechanisms, etc.
+     *
+     * Emits a {Transfer} event.
+     *
+     * Requirements:
+     *
+     * - `from` cannot be the zero address.
+     * - `to` cannot be the zero address.
+     * - `from` must have a balance of at least `amount`.
+     */
+    function _transfer(address from, address to, uint256 amount) internal virtual {
+        require(from != address(0), "ERC20: transfer from the zero address");
+        require(to != address(0), "ERC20: transfer to the zero address");
+
+        _beforeTokenTransfer(from, to, amount);
+
+        uint256 fromBalance = _balances[from];
+        require(fromBalance >= amount, "ERC20: transfer amount exceeds balance");
+        unchecked {
+            _balances[from] = fromBalance - amount;
+            // Overflow not possible: the sum of all balances is capped by totalSupply, and the sum is preserved by
+            // decrementing then incrementing.
+            _balances[to] += amount;
+        }
+
+        emit Transfer(from, to, amount);
+
+        _afterTokenTransfer(from, to, amount);
+    }
+
+    /** @dev Creates `amount` tokens and assigns them to `account`, increasing
+     * the total supply.
+     *
+     * Emits a {Transfer} event with `from` set to the zero address.
+     *
+     * Requirements:
+     *
+     * - `account` cannot be the zero address.
+     */
+    function _mint(address account, uint256 amount) internal virtual {
+        require(account != address(0), "ERC20: mint to the zero address");
+
+        _beforeTokenTransfer(address(0), account, amount);
+
+        _totalSupply += amount;
+        unchecked {
+            // Overflow not possible: balance + amount is at most totalSupply + amount, which is checked above.
+            _balances[account] += amount;
+        }
+        emit Transfer(address(0), account, amount);
+
+        _afterTokenTransfer(address(0), account, amount);
+    }
+
+    /**
+     * @dev Destroys `amount` tokens from `account`, reducing the
+     * total supply.
+     *
+     * Emits a {Transfer} event with `to` set to the zero address.
+     *
+     * Requirements:
+     *
+     * - `account` cannot be the zero address.
+     * - `account` must have at least `amount` tokens.
+     */
+    function _burn(address account, uint256 amount) internal virtual {
+        require(account != address(0), "ERC20: burn from the zero address");
+
+        _beforeTokenTransfer(account, address(0), amount);
+
+        uint256 accountBalance = _balances[account];
+        require(accountBalance >= amount, "ERC20: burn amount exceeds balance");
+        unchecked {
+            _balances[account] = accountBalance - amount;
+            // Overflow not possible: amount <= accountBalance <= totalSupply.
+            _totalSupply -= amount;
+        }
+
+        emit Transfer(account, address(0), amount);
+
+        _afterTokenTransfer(account, address(0), amount);
+    }
+
+    /**
+     * @dev Sets `amount` as the allowance of `spender` over the `owner` s tokens.
+     *
+     * This internal function is equivalent to `approve`, and can be used to
+     * e.g. set automatic allowances for certain subsystems, etc.
+     *
+     * Emits an {Approval} event.
+     *
+     * Requirements:
+     *
+     * - `owner` cannot be the zero address.
+     * - `spender` cannot be the zero address.
+     */
+    function _approve(address owner, address spender, uint256 amount) internal virtual {
+        require(owner != address(0), "ERC20: approve from the zero address");
+        require(spender != address(0), "ERC20: approve to the zero address");
+
+        _allowances[owner][spender] = amount;
+        emit Approval(owner, spender, amount);
+    }
+
+    /**
+     * @dev Updates `owner` s allowance for `spender` based on spent `amount`.
+     *
+     * Does not update the allowance amount in case of infinite allowance.
+     * Revert if not enough allowance is available.
+     *
+     * Might emit an {Approval} event.
+     */
+    function _spendAllowance(address owner, address spender, uint256 amount) internal virtual {
+        uint256 currentAllowance = allowance(owner, spender);
+        if (currentAllowance != type(uint256).max) {
+            require(currentAllowance >= amount, "ERC20: insufficient allowance");
+            unchecked {
+                _approve(owner, spender, currentAllowance - amount);
+            }
+        }
+    }
+
+    /**
+     * @dev Hook that is called before any transfer of tokens. This includes
+     * minting and burning.
+     *
+     * Calling conditions:
+     *
+     * - when `from` and `to` are both non-zero, `amount` of ``from``'s tokens
+     * will be transferred to `to`.
+     * - when `from` is zero, `amount` tokens will be minted for `to`.
+     * - when `to` is zero, `amount` of ``from``'s tokens will be burned.
+     * - `from` and `to` are never both zero.
+     *
+     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
+     */
+    function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual {}
+
+    /**
+     * @dev Hook that is called after any transfer of tokens. This includes
+     * minting and burning.
+     *
+     * Calling conditions:
+     *
+     * - when `from` and `to` are both non-zero, `amount` of ``from``'s tokens
+     * has been transferred to `to`.
+     * - when `from` is zero, `amount` tokens have been minted for `to`.
+     * - when `to` is zero, `amount` of ``from``'s tokens have been burned.
+     * - `from` and `to` are never both zero.
+     *
+     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
+     */
+    function _afterTokenTransfer(address from, address to, uint256 amount) internal virtual {}
+
+    /**
+     * @dev This empty reserved space is put in place to allow future versions to add new
+     * variables without shifting down storage in the inheritance chain.
+     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
+     */
+    uint256[45] private __gap;
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts (last updated v4.9.4) (token/ERC20/extensions/ERC20Permit.sol)
+
+pragma solidity ^0.8.0;
+
+import "./IERC20PermitUpgradeable.sol";
+import "../ERC20Upgradeable.sol";
+import "../../../utils/cryptography/ECDSAUpgradeable.sol";
+import "../../../utils/cryptography/EIP712Upgradeable.sol";
+import "../../../utils/CountersUpgradeable.sol";
+import {Initializable} from "../../../proxy/utils/Initializable.sol";
+
+/**
+ * @dev Implementation of the ERC20 Permit extension allowing approvals to be made via signatures, as defined in
+ * https://eips.ethereum.org/EIPS/eip-2612[EIP-2612].
+ *
+ * Adds the {permit} method, which can be used to change an account's ERC20 allowance (see {IERC20-allowance}) by
+ * presenting a message signed by the account. By not relying on `{IERC20-approve}`, the token holder account doesn't
+ * need to send a transaction, and thus is not required to hold Ether at all.
+ *
+ * _Available since v3.4._
+ *
+ * @custom:storage-size 51
+ */
+abstract contract ERC20PermitUpgradeable is Initializable, ERC20Upgradeable, IERC20PermitUpgradeable, EIP712Upgradeable {
+    using CountersUpgradeable for CountersUpgradeable.Counter;
+
+    mapping(address => CountersUpgradeable.Counter) private _nonces;
+
+    // solhint-disable-next-line var-name-mixedcase
+    bytes32 private constant _PERMIT_TYPEHASH =
+        keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)");
+    /**
+     * @dev In previous versions `_PERMIT_TYPEHASH` was declared as `immutable`.
+     * However, to ensure consistency with the upgradeable transpiler, we will continue
+     * to reserve a slot.
+     * @custom:oz-renamed-from _PERMIT_TYPEHASH
+     */
+    // solhint-disable-next-line var-name-mixedcase
+    bytes32 private _PERMIT_TYPEHASH_DEPRECATED_SLOT;
+
+    /**
+     * @dev Initializes the {EIP712} domain separator using the `name` parameter, and setting `version` to `"1"`.
+     *
+     * It's a good idea to use the same `name` that is defined as the ERC20 token name.
+     */
+    function __ERC20Permit_init(string memory name) internal onlyInitializing {
+        __EIP712_init_unchained(name, "1");
+    }
+
+    function __ERC20Permit_init_unchained(string memory) internal onlyInitializing {}
+
+    /**
+     * @inheritdoc IERC20PermitUpgradeable
+     */
+    function permit(
+        address owner,
+        address spender,
+        uint256 value,
+        uint256 deadline,
+        uint8 v,
+        bytes32 r,
+        bytes32 s
+    ) public virtual override {
+        require(block.timestamp <= deadline, "ERC20Permit: expired deadline");
+
+        bytes32 structHash = keccak256(abi.encode(_PERMIT_TYPEHASH, owner, spender, value, _useNonce(owner), deadline));
+
+        bytes32 hash = _hashTypedDataV4(structHash);
+
+        address signer = ECDSAUpgradeable.recover(hash, v, r, s);
+        require(signer == owner, "ERC20Permit: invalid signature");
+
+        _approve(owner, spender, value);
+    }
+
+    /**
+     * @inheritdoc IERC20PermitUpgradeable
+     */
+    function nonces(address owner) public view virtual override returns (uint256) {
+        return _nonces[owner].current();
+    }
+
+    /**
+     * @inheritdoc IERC20PermitUpgradeable
+     */
+    // solhint-disable-next-line func-name-mixedcase
+    function DOMAIN_SEPARATOR() external view override returns (bytes32) {
+        return _domainSeparatorV4();
+    }
+
+    /**
+     * @dev "Consume a nonce": return the current value and increment.
+     *
+     * _Available since v4.1._
+     */
+    function _useNonce(address owner) internal virtual returns (uint256 current) {
+        CountersUpgradeable.Counter storage nonce = _nonces[owner];
+        current = nonce.current();
+        nonce.increment();
+    }
+
+    /**
+     * @dev This empty reserved space is put in place to allow future versions to add new
+     * variables without shifting down storage in the inheritance chain.
+     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
+     */
+    uint256[49] private __gap;
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts v4.4.1 (token/ERC20/extensions/IERC20Metadata.sol)
+
+pragma solidity ^0.8.0;
+
+import "../IERC20Upgradeable.sol";
+
+/**
+ * @dev Interface for the optional metadata functions from the ERC20 standard.
+ *
+ * _Available since v4.1._
+ */
+interface IERC20MetadataUpgradeable is IERC20Upgradeable {
+    /**
+     * @dev Returns the name of the token.
+     */
+    function name() external view returns (string memory);
+
+    /**
+     * @dev Returns the symbol of the token.
+     */
+    function symbol() external view returns (string memory);
+
+    /**
+     * @dev Returns the decimals places of the token.
+     */
+    function decimals() external view returns (uint8);
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts (last updated v4.9.4) (token/ERC20/extensions/IERC20Permit.sol)
+
+pragma solidity ^0.8.0;
+
+/**
+ * @dev Interface of the ERC20 Permit extension allowing approvals to be made via signatures, as defined in
+ * https://eips.ethereum.org/EIPS/eip-2612[EIP-2612].
+ *
+ * Adds the {permit} method, which can be used to change an account's ERC20 allowance (see {IERC20-allowance}) by
+ * presenting a message signed by the account. By not relying on {IERC20-approve}, the token holder account doesn't
+ * need to send a transaction, and thus is not required to hold Ether at all.
+ *
+ * ==== Security Considerations
+ *
+ * There are two important considerations concerning the use of `permit`. The first is that a valid permit signature
+ * expresses an allowance, and it should not be assumed to convey additional meaning. In particular, it should not be
+ * considered as an intention to spend the allowance in any specific way. The second is that because permits have
+ * built-in replay protection and can be submitted by anyone, they can be frontrun. A protocol that uses permits should
+ * take this into consideration and allow a `permit` call to fail. Combining these two aspects, a pattern that may be
+ * generally recommended is:
+ *
+ * ```solidity
+ * function doThingWithPermit(..., uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s) public {
+ *     try token.permit(msg.sender, address(this), value, deadline, v, r, s) {} catch {}
+ *     doThing(..., value);
+ * }
+ *
+ * function doThing(..., uint256 value) public {
+ *     token.safeTransferFrom(msg.sender, address(this), value);
+ *     ...
+ * }
+ * ```
+ *
+ * Observe that: 1) `msg.sender` is used as the owner, leaving no ambiguity as to the signer intent, and 2) the use of
+ * `try/catch` allows the permit to fail and makes the code tolerant to frontrunning. (See also
+ * {SafeERC20-safeTransferFrom}).
+ *
+ * Additionally, note that smart contract wallets (such as Argent or Safe) are not able to produce permit signatures, so
+ * contracts should have entry points that don't rely on permit.
+ */
+interface IERC20PermitUpgradeable {
+    /**
+     * @dev Sets `value` as the allowance of `spender` over ``owner``'s tokens,
+     * given ``owner``'s signed approval.
+     *
+     * IMPORTANT: The same issues {IERC20-approve} has related to transaction
+     * ordering also apply here.
+     *
+     * Emits an {Approval} event.
+     *
+     * Requirements:
+     *
+     * - `spender` cannot be the zero address.
+     * - `deadline` must be a timestamp in the future.
+     * - `v`, `r` and `s` must be a valid `secp256k1` signature from `owner`
+     * over the EIP712-formatted function arguments.
+     * - the signature must use ``owner``'s current nonce (see {nonces}).
+     *
+     * For more information on the signature format, see the
+     * https://eips.ethereum.org/EIPS/eip-2612#specification[relevant EIP
+     * section].
+     *
+     * CAUTION: See Security Considerations above.
+     */
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
+    /**
+     * @dev Returns the current nonce for `owner`. This value must be
+     * included whenever a signature is generated for {permit}.
+     *
+     * Every successful call to {permit} increases ``owner``'s nonce by one. This
+     * prevents a signature from being used multiple times.
+     */
+    function nonces(address owner) external view returns (uint256);
+
+    /**
+     * @dev Returns the domain separator used in the encoding of the signature for {permit}, as defined by {EIP712}.
+     */
+    // solhint-disable-next-line func-name-mixedcase
+    function DOMAIN_SEPARATOR() external view returns (bytes32);
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts (last updated v4.9.0) (token/ERC20/IERC20.sol)
+
+pragma solidity ^0.8.0;
+
+/**
+ * @dev Interface of the ERC20 standard as defined in the EIP.
+ */
+interface IERC20Upgradeable {
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
+     * @dev Returns the amount of tokens in existence.
+     */
+    function totalSupply() external view returns (uint256);
+
+    /**
+     * @dev Returns the amount of tokens owned by `account`.
+     */
+    function balanceOf(address account) external view returns (uint256);
+
+    /**
+     * @dev Moves `amount` tokens from the caller's account to `to`.
+     *
+     * Returns a boolean value indicating whether the operation succeeded.
+     *
+     * Emits a {Transfer} event.
+     */
+    function transfer(address to, uint256 amount) external returns (bool);
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
+     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
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
+    function approve(address spender, uint256 amount) external returns (bool);
+
+    /**
+     * @dev Moves `amount` tokens from `from` to `to` using the
+     * allowance mechanism. `amount` is then deducted from the caller's
+     * allowance.
+     *
+     * Returns a boolean value indicating whether the operation succeeded.
+     *
+     * Emits a {Transfer} event.
+     */
+    function transferFrom(address from, address to, uint256 amount) external returns (bool);
+}
+
+
+// SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts (last updated v4.9.3) (token/ERC20/utils/SafeERC20.sol)
+
+pragma solidity ^0.8.0;
+
+import "../IERC20Upgradeable.sol";
+import "../extensions/IERC20PermitUpgradeable.sol";
+import "../../../utils/AddressUpgradeable.sol";
+
+/**
+ * @title SafeERC20
+ * @dev Wrappers around ERC20 operations that throw on failure (when the token
+ * contract returns false). Tokens that return no value (and instead revert or
+ * throw on failure) are also supported, non-reverting calls are assumed to be
+ * successful.
+ * To use this library you can add a `using SafeERC20 for IERC20;` statement to your contract,
+ * which allows you to call the safe operations as `token.safeTransfer(...)`, etc.
+ */
+library SafeERC20Upgradeable {
+    using AddressUpgradeable for address;
+
+    /**
+     * @dev Transfer `value` amount of `token` fr
[truncated — full diff is 859,494 bytes]
> ```

> </details>

> <details>
> <summary>📝 Source diff — upgrade #5 (<code>0x2BA1...c1AA</code> → <code>0x17e2...f29d</code>): +2572/-6143 lines (truncated)</summary>

> ```diff
--- old_impl
+++ new_impl
@@ -550,97 +550,6 @@
 
 
 // SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v4.9.0) (security/ReentrancyGuard.sol)
-
-pragma solidity ^0.8.0;
-import {Initializable} from "../proxy/utils/Initializable.sol";
-
-/**
- * @dev Contract module that helps prevent reentrant calls to a function.
- *
- * Inheriting from `ReentrancyGuard` will make the {nonReentrant} modifier
- * available, which can be applied to functions to make sure there are no nested
- * (reentrant) calls to them.
- *
- * Note that because there is a single `nonReentrant` guard, functions marked as
- * `nonReentrant` may not call one another. This can be worked around by making
- * those functions `private`, and then adding `external` `nonReentrant` entry
- * points to them.
- *
- * TIP: If you would like to learn more about reentrancy and alternative ways
- * to protect against it, check out our blog post
- * https://blog.openzeppelin.com/reentrancy-after-istanbul/[Reentrancy After Istanbul].
- */
-abstract contract ReentrancyGuardUpgradeable is Initializable {
-    // Booleans are more expensive than uint256 or any type that takes up a full
-    // word because each write operation emits an extra SLOAD to first read the
-    // slot's contents, replace the bits taken up by the boolean, and then write
-    // back. This is the compiler's defense against contract upgrades and
-    // pointer aliasing, and it cannot be disabled.
-
-    // The values being non-zero value makes deployment a bit more expensive,
-    // but in exchange the refund on every call to nonReentrant will be lower in
-    // amount. Since refunds are capped to a percentage of the total
-    // transaction's gas, it is best to keep them low in cases like this one, to
-    // increase the likelihood of the full refund coming into effect.
-    uint256 private constant _NOT_ENTERED = 1;
-    uint256 private constant _ENTERED = 2;
-
-    uint256 private _status;
-
-    function __ReentrancyGuard_init() internal onlyInitializing {
-        __ReentrancyGuard_init_unchained();
-    }
-
-    function __ReentrancyGuard_init_unchained() internal onlyInitializing {
-        _status = _NOT_ENTERED;
-    }
-
-    /**
-     * @dev Prevents a contract from calling itself, directly or indirectly.
-     * Calling a `nonReentrant` function from another `nonReentrant`
-     * function is not supported. It is possible to prevent this from happening
-     * by making the `nonReentrant` function external, and making it call a
-     * `private` function that does the actual work.
-     */
-    modifier nonReentrant() {
-        _nonReentrantBefore();
-        _;
-        _nonReentrantAfter();
-    }
-
-    function _nonReentrantBefore() private {
-        // On the first call to nonReentrant, _status will be _NOT_ENTERED
-        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");
-
-        // Any calls to nonReentrant after this point will fail
-        _status = _ENTERED;
-    }
-
-    function _nonReentrantAfter() private {
-        // By storing the original value once again, a refund is triggered (see
-        // https://eips.ethereum.org/EIPS/eip-2200)
-        _status = _NOT_ENTERED;
-    }
-
-    /**
-     * @dev Returns true if the reentrancy guard is currently set to "entered", which indicates there is a
-     * `nonReentrant` function in the call stack.
-     */
-    function _reentrancyGuardEntered() internal view returns (bool) {
-        return _status == _ENTERED;
-    }
-
-    /**
-     * @dev This empty reserved space is put in place to allow future versions to add new
-     * variables without shifting down storage in the inheritance chain.
-     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
-     */
-    uint256[49] private __gap;
-}
-
-
-// SPDX-License-Identifier: MIT
 // OpenZeppelin Contracts (last updated v4.9.0) (token/ERC20/ERC20.sol)
 
 pragma solidity ^0.8.0;
@@ -4925,6 +4834,148 @@
 
 
 // SPDX-License-Identifier: MIT
+// OpenZeppelin Contracts (last updated v5.0.0) (utils/Pausable.sol)
+
+pragma solidity ^0.8.20;
+
+import {ContextUpgradeable} from "../utils/ContextUpgradeable.sol";
+import {Initializable} from "../proxy/utils/Initializable.sol";
+
+/**
+ * @dev Contract module which allows children to implement an emergency stop
+ * mechanism that can be triggered by an authorized account.
+ *
+ * This module is used through inheritance. It will make available the
+ * modifiers `whenNotPaused` and `whenPaused`, which can be applied to
+ * the functions of your contract. Note that they will not be pausable by
+ * simply including this module, only once the modifiers are put in place.
+ */
+abstract contract PausableUpgradeable is Initializable, ContextUpgradeable {
+    /// @custom:storage-location erc7201:openzeppelin.storage.Pausable
+    struct PausableStorage {
+        bool _paused;
+    }
+
+    // keccak256(abi.encode(uint256(keccak256("openzeppelin.storage.Pausable")) - 1)) & ~bytes32(uint256(0xff))
+    bytes32 private constant PausableStorageLocation = 0xcd5ed15c6e187e77e9aee88184c21f4f2182ab5827cb3b7e07fbedcd63f03300;
+
+    function _getPausableStorage() private pure returns (PausableStorage storage $) {
+        assembly {
+            $.slot := PausableStorageLocation
+        }
+    }
+
+    /**
+     * @dev Emitted when the pause is triggered by `account`.
+     */
+    event Paused(address account);
+
+    /**
+     * @dev Emitted when the pause is lifted by `account`.
+     */
+    event Unpaused(address account);
+
+    /**
+     * @dev The operation failed because the contract is paused.
+     */
+    error EnforcedPause();
+
+    /**
+     * @dev The operation failed because the contract is not paused.
+     */
+    error ExpectedPause();
+
+    /**
+     * @dev Initializes the contract in unpaused state.
+     */
+    function __Pausable_init() internal onlyInitializing {
+        __Pausable_init_unchained();
+    }
+
+    function __Pausable_init_unchained() internal onlyInitializing {
+        PausableStorage storage $ = _getPausableStorage();
+        $._paused = false;
+    }
+
+    /**
+     * @dev Modifier to make a function callable only when the contract is not paused.
+     *
+     * Requirements:
+     *
+     * - The contract must not be paused.
+     */
+    modifier whenNotPaused() {
+        _requireNotPaused();
+        _;
+    }
+
+    /**
+     * @dev Modifier to make a function callable only when the contract is paused.
+     *
+     * Requirements:
+     *
+     * - The contract must be paused.
+     */
+    modifier whenPaused() {
+        _requirePaused();
+        _;
+    }
+
+    /**
+     * @dev Returns true if the contract is paused, and false otherwise.
+     */
+    function paused() public view virtual returns (bool) {
+        PausableStorage storage $ = _getPausableStorage();
+        return $._paused;
+    }
+
+    /**
+     * @dev Throws if the contract is paused.
+     */
+    function _requireNotPaused() internal view virtual {
+        if (paused()) {
+            revert EnforcedPause();
+        }
+    }
+
+    /**
+     * @dev Throws if the contract is not paused.
+     */
+    function _requirePaused() internal view virtual {
+        if (!paused()) {
+            revert ExpectedPause();
+        }
+    }
+
+    /**
+     * @dev Triggers stopped state.
+     *
+     * Requirements:
+     *
+     * - The contract must not be paused.
+     */
+    function _pause() internal virtual whenNotPaused {
+        PausableStorage storage $ = _getPausableStorage();
+        $._paused = true;
+        emit Paused(_msgSender());
+    }
+
+    /**
+     * @dev Returns to normal state.
+     *
+     * Requirements:
+     *
+     * - The contract must be paused.
+     */
+    function _unpause() internal virtual whenPaused {
+        PausableStorage storage $ = _getPausableStorage();
+        $._paused = false;
+        emit Unpaused(_msgSender());
+    }
+}
+
+
+// SPDX-License-Identifier: MIT
 // OpenZeppelin Contracts (last updated v5.0.0) (utils/ReentrancyGuard.sol)
 
 pragma solidity ^0.8.20;
@@ -5032,1126 +5083,341 @@
 
 
 // SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v4.9.0) (access/Ownable.sol)
+// OpenZeppelin Contracts (last updated v4.9.0) (utils/math/Math.sol)
 
 pragma solidity ^0.8.0;
 
-import "../utils/Context.sol";
-
 /**
- * @dev Contract module which provides a basic access control mechanism, where
- * there is an account (an owner) that can be granted exclusive access to
- * specific functions.
- *
- * By default, the owner account will be the one that deploys the contract. This
- * can later be changed with {transferOwnership}.
- *
- * This module is used through inheritance. It will make available the modifier
- * `onlyOwner`, which can be applied to your functions to restrict their use to
- * the owner.
+ * @dev Standard math utilities missing in the Solidity language.
  */
-abstract contract Ownable is Context {
-    address private _owner;
-
-    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
-
-    /**
-     * @dev Initializes the contract setting the deployer as the initial owner.
-     */
-    constructor() {
-        _transferOwnership(_msgSender());
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
-        require(owner() == _msgSender(), "Ownable: caller is not the owner");
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
-        require(newOwner != address(0), "Ownable: new owner is the zero address");
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
-// OpenZeppelin Contracts (last updated v4.5.0) (interfaces/draft-IERC1822.sol)
-
-pragma solidity ^0.8.0;
-
-/**
- * @dev ERC1822: Universal Upgradeable Proxy Standard (UUPS) documents a method for upgradeability through a simplified
- * proxy whose upgrades are fully controlled by the current implementation.
- */
-interface IERC1822Proxiable {
-    /**
-     * @dev Returns the storage slot that the proxiable contract assumes is being used to store the implementation
-     * address.
-     *
-     * IMPORTANT: A proxy pointing at a proxiable contract should not be considered proxiable itself, because this risks
-     * bricking a proxy that upgrades to it, by delegating to itself until out of gas. Thus it is critical that this
-     * function revert if invoked through a proxy.
-     */
-    function proxiableUUID() external view returns (bytes32);
-}
-
-
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v4.9.0) (interfaces/IERC1967.sol)
-
-pragma solidity ^0.8.0;
-
-/**
- * @dev ERC-1967: Proxy Storage Slots. This interface contains the events defined in the ERC.
- *
- * _Available since v4.8.3._
- */
-interface IERC1967 {
-    /**
-     * @dev Emitted when the implementation is upgraded.
-     */
-    event Upgraded(address indexed implementation);
-
-    /**
-     * @dev Emitted when the admin account has changed.
-     */
-    event AdminChanged(address previousAdmin, address newAdmin);
-
-    /**
-     * @dev Emitted when the beacon is changed.
-     */
-    event BeaconUpgraded(address indexed beacon);
-}
-
-
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts v4.4.1 (proxy/beacon/IBeacon.sol)
-
-pragma solidity ^0.8.0;
-
-/**
- * @dev This is the interface that {BeaconProxy} expects of its beacon.
- */
-interface IBeacon {
-    /**
-     * @dev Must return an address that can be used as a delegate call target.
-     *
-     * {BeaconProxy} will check that this address is a contract.
-     */
-    function implementation() external view returns (address);
-}
-
-
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v4.7.0) (proxy/ERC1967/ERC1967Proxy.sol)
-
-pragma solidity ^0.8.0;
-
-import "../Proxy.sol";
-import "./ERC1967Upgrade.sol";
-
-/**
- * @dev This contract implements an upgradeable proxy. It is upgradeable because calls are delegated to an
- * implementation address that can be changed. This address is stored in storage in the location specified by
- * https://eips.ethereum.org/EIPS/eip-1967[EIP1967], so that it doesn't conflict with the storage layout of the
- * implementation behind the proxy.
- */
-contract ERC1967Proxy is Proxy, ERC1967Upgrade {
-    /**
-     * @dev Initializes the upgradeable proxy with an initial implementation specified by `_logic`.
-     *
-     * If `_data` is nonempty, it's used as data in a delegate call to `_logic`. This will typically be an encoded
-     * function call, and allows initializing the storage of the proxy like a Solidity constructor.
-     */
-    constructor(address _logic, bytes memory _data) payable {
-        _upgradeToAndCall(_logic, _data, false);
-    }
-
-    /**
-     * @dev Returns the current implementation address.
-     */
-    function _implementation() internal view virtual override returns (address impl) {
-        return ERC1967Upgrade._getImplementation();
-    }
-}
-
-
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v4.9.0) (proxy/ERC1967/ERC1967Upgrade.sol)
-
-pragma solidity ^0.8.2;
-
-import "../beacon/IBeacon.sol";
-import "../../interfaces/IERC1967.sol";
-import "../../interfaces/draft-IERC1822.sol";
-import "../../utils/Address.sol";
-import "../../utils/StorageSlot.sol";
-
-/**
- * @dev This abstract contract provides getters and event emitting update functions for
- * https://eips.ethereum.org/EIPS/eip-1967[EIP1967] slots.
- *
- * _Available since v4.1._
- */
-abstract contract ERC1967Upgrade is IERC1967 {
-    // This is the keccak-256 hash of "eip1967.proxy.rollback" subtracted by 1
-    bytes32 private constant _ROLLBACK_SLOT = 0x4910fdfa16fed3260ed0e7147f7cc6da11a60208b5b9406d12a635614ffd9143;
-
-    /**
-     * @dev Storage slot with the address of the current implementation.
-     * This is the keccak-256 hash of "eip1967.proxy.implementation" subtracted by 1, and is
-     * validated in the constructor.
-     */
-    bytes32 internal constant _IMPLEMENTATION_SLOT = 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;
-
-    /**
-     * @dev Returns the current implementation address.
-     */
-    function _getImplementation() internal view returns (address) {
-        return StorageSlot.getAddressSlot(_IMPLEMENTATION_SLOT).value;
-    }
-
-    /**
-     * @dev Stores a new address in the EIP1967 implementation slot.
-     */
-    function _setImplementation(address newImplementation) private {
-        require(Address.isContract(newImplementation), "ERC1967: new implementation is not a contract");
-        StorageSlot.getAddressSlot(_IMPLEMENTATION_SLOT).value = newImplementation;
-    }
-
-    /**
-     * @dev Perform implementation upgrade
-     *
-     * Emits an {Upgraded} event.
-     */
-    function _upgradeTo(address newImplementation) internal {
-        _setImplementation(newImplementation);
-        emit Upgraded(newImplementation);
-    }
-
-    /**
-     * @dev Perform implementation upgrade with additional setup call.
-     *
-     * Emits an {Upgraded} event.
-     */
-    function _upgradeToAndCall(address newImplementation, bytes memory data, bool forceCall) internal {
-        _upgradeTo(newImplementation);
-        if (data.length > 0 || forceCall) {
-            Address.functionDelegateCall(newImplementation, data);
-        }
-    }
-
-    /**
-     * @dev Perform implementation upgrade with security checks for UUPS proxies, and additional setup call.
-     *
-     * Emits an {Upgraded} event.
-     */
-    function _upgradeToAndCallUUPS(address newImplementation, bytes memory data, bool forceCall) internal {
-        // Upgrades from old implementations will perform a rollback test. This test requires the new
-        // implementation to upgrade back to the old, non-ERC1822 compliant, implementation. Removing
-        // this special case will break upgrade paths from old UUPS implementation to new ones.
-        if (StorageSlot.getBooleanSlot(_ROLLBACK_SLOT).value) {
-            _setImplementation(newImplementation);
-        } else {
-            try IERC1822Proxiable(newImplementation).proxiableUUID() returns (bytes32 slot) {
-                require(slot == _IMPLEMENTATION_SLOT, "ERC1967Upgrade: unsupported proxiableUUID");
-            } catch {
-                revert("ERC1967Upgrade: new implementation is not UUPS");
+library Math {
+    enum Rounding {
+        Down, // Toward negative infinity
+        Up, // Toward infinity
+        Zero // Toward zero
+    }
+
+    /**
+     * @dev Returns the largest of two numbers.
+     */
+    function max(uint256 a, uint256 b) internal pure returns (uint256) {
+        return a > b ? a : b;
+    }
+
+    /**
+     * @dev Returns the smallest of two numbers.
+     */
+    function min(uint256 a, uint256 b) internal pure returns (uint256) {
+        return a < b ? a : b;
+    }
+
+    /**
+     * @dev Returns the average of two numbers. The result is rounded towards
+     * zero.
+     */
+    function average(uint256 a, uint256 b) internal pure returns (uint256) {
+        // (a + b) / 2 can overflow.
+        return (a & b) + (a ^ b) / 2;
+    }
+
+    /**
+     * @dev Returns the ceiling of the division of two numbers.
+     *
+     * This differs from standard division with `/` in that it rounds up instead
+     * of rounding down.
+     */
+    function ceilDiv(uint256 a, uint256 b) internal pure returns (uint256) {
+        // (a + b - 1) / b can overflow on addition, so we distribute.
+        return a == 0 ? 0 : (a - 1) / b + 1;
+    }
+
+    /**
+     * @notice Calculates floor(x * y / denominator) with full precision. Throws if result overflows a uint256 or denominator == 0
+     * @dev Original credit to Remco Bloemen under MIT license (https://xn--2-umb.com/21/muldiv)
+     * with further edits by Uniswap Labs also under MIT license.
+     */
+    function mulDiv(uint256 x, uint256 y, uint256 denominator) internal pure returns (uint256 result) {
+        unchecked {
+            // 512-bit multiply [prod1 prod0] = x * y. Compute the product mod 2^256 and mod 2^256 - 1, then use
+            // use the Chinese Remainder Theorem to reconstruct the 512 bit result. The result is stored in two 256
+            // variables such that product = prod1 * 2^256 + prod0.
+            uint256 prod0; // Least significant 256 bits of the product
+            uint256 prod1; // Most significant 256 bits of the product
+            assembly {
+                let mm := mulmod(x, y, not(0))
+                prod0 := mul(x, y)
+                prod1 := sub(sub(mm, prod0), lt(mm, prod0))
             }
-            _upgradeToAndCall(newImplementation, data, forceCall);
-        }
-    }
-
-    /**
-     * @dev Storage slot with the admin of the contract.
-     * This is the keccak-256 hash of "eip1967.proxy.admin" subtracted by 1, and is
-     * validated in the constructor.
-     */
-    bytes32 internal constant _ADMIN_SLOT = 0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103;
-
-    /**
-     * @dev Returns the current admin.
-     */
-    function _getAdmin() internal view returns (address) {
-        return StorageSlot.getAddressSlot(_ADMIN_SLOT).value;
-    }
-
-    /**
-     * @dev Stores a new address in the EIP1967 admin slot.
-     */
-    function _setAdmin(address newAdmin) private {
-        require(newAdmin != address(0), "ERC1967: new admin is the zero address");
-        StorageSlot.getAddressSlot(_ADMIN_SLOT).value = newAdmin;
-    }
-
-    /**
-     * @dev Changes the admin of the proxy.
-     *
-     * Emits an {AdminChanged} event.
-     */
-    function _changeAdmin(address newAdmin) internal {
-        emit AdminChanged(_getAdmin(), newAdmin);
-        _setAdmin(newAdmin);
-    }
-
-    /**
-     * @dev The storage slot of the UpgradeableBeacon contract which defines the implementation for this proxy.
-     * This is bytes32(uint256(keccak256('eip1967.proxy.beacon')) - 1)) and is validated in the constructor.
-     */
-    bytes32 internal constant _BEACON_SLOT = 0xa3f0ad74e5423aebfd80d3ef4346578335a9a72aeaee59ff6cb3582b35133d50;
-
-    /**
-     * @dev Returns the current beacon.
-     */
-    function _getBeacon() internal view returns (address) {
-        return StorageSlot.getAddressSlot(_BEACON_SLOT).value;
-    }
-
-    /**
-     * @dev Stores a new beacon in the EIP1967 beacon slot.
-     */
-    function _setBeacon(address newBeacon) private {
-        require(Address.isContract(newBeacon), "ERC1967: new beacon is not a contract");
-        require(
-            Address.isContract(IBeacon(newBeacon).implementation()),
-            "ERC1967: beacon implementation is not a contract"
-        );
-        StorageSlot.getAddressSlot(_BEACON_SLOT).value = newBeacon;
-    }
-
-    /**
-     * @dev Perform beacon upgrade with additional setup call. Note: This upgrades the address of the beacon, it does
-     * not upgrade the implementation contained in the beacon (see {UpgradeableBeacon-_setImplementation} for that).
-     *
-     * Emits a {BeaconUpgraded} event.
-     */
-    function _upgradeBeaconToAndCall(address newBeacon, bytes memory data, bool forceCall) internal {
-        _setBeacon(newBeacon);
-        emit BeaconUpgraded(newBeacon);
-        if (data.length > 0 || forceCall) {
-            Address.functionDelegateCall(IBeacon(newBeacon).implementation(), data);
-        }
-    }
-}
-
-
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v4.6.0) (proxy/Proxy.sol)
-
-pragma solidity ^0.8.0;
-
-/**
- * @dev This abstract contract provides a fallback function that delegates all calls to another contract using the EVM
- * instruction `delegatecall`. We refer to the second contract as the _implementation_ behind the proxy, and it has to
- * be specified by overriding the virtual {_implementation} function.
- *
- * Additionally, delegation to the implementation can be triggered manually through the {_fallback} function, or to a
- * different contract through the {_delegate} function.
- *
- * The success and return data of the delegated call will be returned back to the caller of the proxy.
- */
-abstract contract Proxy {
-    /**
-     * @dev Delegates the current call to `implementation`.
-     *
-     * This function does not return to its internal call site, it will return directly to the external caller.
-     */
-    function _delegate(address implementation) internal virtual {
-        assembly {
-            // Copy msg.data. We take full control of memory in this inline assembly
-            // block because it will not return to Solidity code. We overwrite the
-            // Solidity scratch pad at memory position 0.
-            calldatacopy(0, 0, calldatasize())
-
-            // Call the implementation.
-            // out and outsize are 0 because we don't know the size yet.
-            let result := delegatecall(gas(), implementation, 0, calldatasize(), 0, 0)
-
-            // Copy the returned data.
-            returndatacopy(0, 0, returndatasize())
-
-            switch result
-            // delegatecall returns 0 on error.
-            case 0 {
-                revert(0, returndatasize())
+
+            // Handle non-overflow cases, 256 by 256 division.
+            if (prod1 == 0) {
+                // Solidity will revert if denominator == 0, unlike the div opcode on its own.
+                // The surrounding unchecked block does not change this fact.
+                // See https://docs.soliditylang.org/en/latest/control-structures.html#checked-or-unchecked-arithmetic.
+                return prod0 / denominator;
             }
-            default {
-                return(0, returndatasize())
+
+            // Make sure the result is less than 2^256. Also prevents denominator == 0.
+            require(denominator > prod1, "Math: mulDiv overflow");
+
+            ///////////////////////////////////////////////
+            // 512 by 256 division.
+            ///////////////////////////////////////////////
+
+            // Make division exact by subtracting the remainder from [prod1 prod0].
+            uint256 remainder;
+            assembly {
+                // Compute remainder using mulmod.
+                remainder := mulmod(x, y, denominator)
+
+                // Subtract 256 bit number from 512 bit number.
+                prod1 := sub(prod1, gt(remainder, prod0))
+                prod0 := sub(prod0, remainder)
             }
-        }
-    }
-
-    /**
-     * @dev This is a virtual function that should be overridden so it returns the address to which the fallback function
-     * and {_fallback} should delegate.
-     */
-    function _implementation() internal view virtual returns (address);
-
-    /**
-     * @dev Delegates the current call to the address returned by `_implementation()`.
-     *
-     * This function does not return to its internal call site, it will return directly to the external caller.
-     */
-    function _fallback() internal virtual {
-        _beforeFallback();
-        _delegate(_implementation());
-    }
-
-    /**
-     * @dev Fallback function that delegates calls to the address returned by `_implementation()`. Will run if no other
-     * function in the contract matches the call data.
-     */
-    fallback() external payable virtual {
-        _fallback();
-    }
-
-    /**
-     * @dev Fallback function that delegates calls to the address returned by `_implementation()`. Will run if call data
-     * is empty.
-     */
-    receive() external payable virtual {
-        _fallback();
-    }
-
-    /**
-     * @dev Hook that is called before falling back to the implementation. Can happen as part of a manual `_fallback`
-     * call, or as part of the Solidity `fallback` or `receive` functions.
-     *
-     * If overridden should call `super._beforeFallback()`.
-     */
-    function _beforeFallback() internal virtual {}
-}
-
-
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v4.8.3) (proxy/transparent/ProxyAdmin.sol)
-
-pragma solidity ^0.8.0;
-
-import "./TransparentUpgradeableProxy.sol";
-import "../../access/Ownable.sol";
-
-/**
- * @dev This is an auxiliary contract meant to be assigned as the admin of a {TransparentUpgradeableProxy}. For an
- * explanation of why you would want to use this see the documentation for {TransparentUpgradeableProxy}.
- */
-contract ProxyAdmin is Ownable {
-    /**
-     * @dev Returns the current implementation of `proxy`.
-     *
-     * Requirements:
-     *
-     * - This contract must be the admin of `proxy`.
-     */
-    function getProxyImplementation(ITransparentUpgradeableProxy proxy) public view virtual returns (address) {
-        // We need to manually run the static call since the getter cannot be flagged as view
-        // bytes4(keccak256("implementation()")) == 0x5c60da1b
-        (bool success, bytes memory returndata) = address(proxy).staticcall(hex"5c60da1b");
-        require(success);
-        return abi.decode(returndata, (address));
-    }
-
-    /**
-     * @dev Returns the current admin of `proxy`.
-     *
-     * Requirements:
-     *
-     * - This contract must be the admin of `proxy`.
-     */
-    function getProxyAdmin(ITransparentUpgradeableProxy proxy) public view virtual returns (address) {
-        // We need to manually run the static call since the getter cannot be flagged as view
-        // bytes4(keccak256("admin()")) == 0xf851a440
-        (bool success, bytes memory returndata) = address(proxy).staticcall(hex"f851a440");
-        require(success);
-        return abi.decode(returndata, (address));
-    }
-
-    /**
-     * @dev Changes the admin of `proxy` to `newAdmin`.
-     *
-     * Requirements:
-     *
-     * - This contract must be the current admin of `proxy`.
-     */
-    function changeProxyAdmin(ITransparentUpgradeableProxy proxy, address newAdmin) public virtual onlyOwner {
-        proxy.changeAdmin(newAdmin);
-    }
-
-    /**
-     * @dev Upgrades `proxy` to `implementation`. See {TransparentUpgradeableProxy-upgradeTo}.
-     *
-     * Requirements:
-     *
-     * - This contract must be the admin of `proxy`.
-     */
-    function upgrade(ITransparentUpgradeableProxy proxy, address implementation) public virtual onlyOwner {
-        proxy.upgradeTo(implementation);
-    }
-
-    /**
-     * @dev Upgrades `proxy` to `implementation` and calls a function on the new implementation. See
-     * {TransparentUpgradeableProxy-upgradeToAndCall}.
-     *
-     * Requirements:
-     *
-     * - This contract must be the admin of `proxy`.
-     */
-    function upgradeAndCall(
-        ITransparentUpgradeableProxy proxy,
-        address implementation,
-        bytes memory data
-    ) public payable virtual onlyOwner {
-        proxy.upgradeToAndCall{value: msg.value}(implementation, data);
-    }
-}
-
-
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v4.9.0) (proxy/transparent/TransparentUpgradeableProxy.sol)
-
-pragma solidity ^0.8.0;
-
-import "../ERC1967/ERC1967Proxy.sol";
-
-/**
- * @dev Interface for {TransparentUpgradeableProxy}. In order to implement transparency, {TransparentUpgradeableProxy}
- * does not implement this interface directly, and some of its functions are implemented by an internal dispatch
- * mechanism. The compiler is unaware that these functions are implemented by {TransparentUpgradeableProxy} and will not
- * include them in the ABI so this interface must be used to interact with it.
- */
-interface ITransparentUpgradeableProxy is IERC1967 {
-    function admin() external view returns (address);
-
-    function implementation() external view returns (address);
-
-    function changeAdmin(address) external;
-
-    function upgradeTo(address) external;
-
-    function upgradeToAndCall(address, bytes memory) external payable;
-}
-
-/**
- * @dev This contract implements a proxy that is upgradeable by an admin.
- *
- * To avoid https://medium.com/nomic-labs-blog/malicious-backdoors-in-ethereum-proxies-62629adf3357[proxy selector
- * clashing], which can potentially be used in an attack, this contract uses the
- * https://blog.openzeppelin.com/the-transparent-proxy-pattern/[transparent proxy pattern]. This pattern implies two
- * things that go hand in hand:
- *
- * 1. If any account other than the admin calls the proxy, the call will be forwarded to the implementation, even if
- * that call matches one of the admin functions exposed by the proxy itself.
- * 2. If the admin calls the proxy, it can access the admin functions, but its calls will never be forwarded to the
- * implementation. If the admin tries to call a function on the implementation it will fail with an error that says
- * "admin cannot fallback to proxy target".
- *
- * These properties mean that the admin account can only be used for admin actions like upgrading the proxy or changing
- * the admin, so it's best if it's a dedicated account that is not used for anything else. This will avoid headaches due
- * to sudden errors when trying to call a function from the proxy implementation.
- *
- * Our recommendation is for the dedicated account to be an instance of the {ProxyAdmin} contract. If set up this way,
- * you should think of the `ProxyAdmin` instance as the real administrative interface of your proxy.
- *
- * NOTE: The real interface of this proxy is that defined in `ITransparentUpgradeableProxy`. This contract does not
- * inherit from that interface, and instead the admin functions are implicitly implemented using a custom dispatch
- * mechanism in `_fallback`. Consequently, the compiler will not produce an ABI for this contract. This is necessary to
- * fully implement transparency without decoding reverts caused by selector clashes between the proxy and the
- * implementation.
- *
- * WARNING: It is not recommended to extend this contract to add additional external functions. If you do so, the compiler
- * will not check that there are no selector conflicts, due to the note above. A selector clash between any new function
- * and the functions declared in {ITransparentUpgradeableProxy} will be resolved in favor of the new one. This could
- * render the admin operations inaccessible, which could prevent upgradeability. Transparency may also be compromised.
- */
-contract TransparentUpgradeableProxy is ERC1967Proxy {
-    /**
-     * @dev Initializes an upgradeable proxy managed by `_admin`, backed by the implementation at `_logic`, and
-     * optionally initialized with `_data` as explained in {ERC1967Proxy-constructor}.
-     */
-    constructor(address _logic, address admin_, bytes memory _data) payable ERC1967Proxy(_logic, _data) {
-        _changeAdmin(admin_);
-    }
-
-    /**
-     * @dev Modifier used internally that will delegate the call to the implementation unless the sender is the admin.
-     *
-     * CAUTION: This modifier is deprecated, as it could cause issues if the modified function has arguments, and the
-     * implementation provides a function with the same selector.
-     */
-    modifier ifAdmin() {
-        if (msg.sender == _getAdmin()) {
-            _;
-        } else {
-            _fallback();
-        }
-    }
-
-    /**
-     * @dev If caller is the admin process the call internally, otherwise transparently fallback to the proxy behavior
-     */
-    function _fallback() internal virtual override {
-        if (msg.sender == _getAdmin()) {
-            bytes memory ret;
-            bytes4 selector = msg.sig;
-            if (selector == ITransparentUpgradeableProxy.upgradeTo.selector) {
-                ret = _dispatchUpgradeTo();
-            } else if (selector == ITransparentUpgradeableProxy.upgradeToAndCall.selector) {
-                ret = _dispatchUpgradeToAndCall();
-            } else if (selector == ITransparentUpgradeableProxy.changeAdmin.selector) {
-                ret = _dispatchChangeAdmin();
-            } else if (selector == ITransparentUpgradeableProxy.admin.selector) {
-                ret = _dispatchAdmin();
-            } else if (selector == ITransparentUpgradeableProxy.implementation.selector) {
-                ret = _dispatchImplementation();
-            } else {
-                revert("TransparentUpgradeableProxy: admin cannot fallback to proxy target");
+
+            // Factor powers of two out of denominator and compute largest power of two divisor of denominator. Always >= 1.
+            // See https://cs.stackexchange.com/q/138556/92363.
+
+            // Does not overflow because the denominator cannot be zero at this stage in the function.
+            uint256 twos = denominator & (~denominator + 1);
+            assembly {
+                // Divide denominator by twos.
+                denominator := div(denominator, twos)
+
+                // Divide [prod1 prod0] by twos.
+                prod0 := div(prod0, twos)
+
+                // Flip twos such that it is 2^256 / twos. If twos is zero, then it becomes one.
+                twos := add(div(sub(0, twos), twos), 1)
             }
-            assembly {
-                return(add(ret, 0x20), mload(ret))
+
+            // Shift in bits from prod1 into prod0.
+            prod0 |= prod1 * twos;
+
+            // Invert denominator mod 2^256. Now that denominator is an odd number, it has an inverse modulo 2^256 such
+            // that denominator * inv = 1 mod 2^256. Compute the inverse by starting with a seed that is correct for
+            // four bits. That is, denominator * inv = 1 mod 2^4.
+            uint256 inverse = (3 * denominator) ^ 2;
+
+            // Use the Newton-Raphson iteration to improve the precision. Thanks to Hensel's lifting lemma, this also works
+            // in modular arithmetic, doubling the correct bits in each step.
+            inverse *= 2 - denominator * inverse; // inverse mod 2^8
+            inverse *= 2 - denominator * inverse; // inverse mod 2^16
+            inverse *= 2 - denominator * inverse; // inverse mod 2^32
+            inverse *= 2 - denominator * inverse; // inverse mod 2^64
+            inverse *= 2 - denominator * inverse; // inverse mod 2^128
+            inverse *= 2 - denominator * inverse; // inverse mod 2^256
+
+            // Because the division is now exact we can divide by multiplying with the modular inverse of denominator.
+            // This will give us the correct result modulo 2^256. Since the preconditions guarantee that the outcome is
+            // less than 2^256, this is the final result. We don't need to compute the high bits of the result and prod1
+            // is no longer required.
+            result = prod0 * inverse;
+            return result;
+        }
+    }
+
+    /**
+     * @notice Calculates x * y / denominator with full precision, following the selected rounding direction.
+     */
+    function mulDiv(uint256 x, uint256 y, uint256 denominator, Rounding rounding) internal pure returns (uint256) {
+        uint256 result = mulDiv(x, y, denominator);
+        if (rounding == Rounding.Up && mulmod(x, y, denominator) > 0) {
+            result += 1;
+        }
+        return result;
+    }
+
+    /**
+     * @dev Returns the square root of a number. If the number is not a perfect square, the value is rounded down.
+     *
+     * Inspired by Henry S. Warren, Jr.'s "Hacker's Delight" (Chapter 11).
+     */
+    function sqrt(uint256 a) internal pure returns (uint256) {
+        if (a == 0) {
+            return 0;
+        }
+
+        // For our first guess, we get the biggest power of 2 which is smaller than the square root of the target.
+        //
+        // We know that the "msb" (most significant bit) of our target number `a` is a power of 2 such that we have
+        // `msb(a) <= a < 2*msb(a)`. This value can be written `msb(a)=2**k` with `k=log2(a)`.
+        //
+        // This can be rewritten `2**log2(a) <= a < 2**(log2(a) + 1)`
+        // → `sqrt(2**k) <= sqrt(a) < sqrt(2**(k+1))`
+        // → `2**(k/2) <= sqrt(a) < 2**((k+1)/2) <= 2**(k/2 + 1)`
+        //
+        // Consequently, `2**(log2(a) / 2)` is a good first approximation of `sqrt(a)` with at least 1 correct bit.
+        uint256 result = 1 << (log2(a) >> 1);
+
+        // At this point `result` is an estimation with one bit of precision. We know the true value is a uint128,
+        // since it is the square root of a uint256. Newton's method converges quadratically (precision doubles at
+        // every iteration). We thus need at most 7 iteration to turn our partial result with one bit of precision
+        // into the expected uint128 result.
+        unchecked {
+            result = (result + a / result) >> 1;
+            result = (result + a / result) >> 1;
+            result = (result + a / result) >> 1;
+            result = (result + a / result) >> 1;
+            result = (result + a / result) >> 1;
+            result = (result + a / result) >> 1;
+            result = (result + a / result) >> 1;
+            return min(result, a / result);
+        }
+    }
+
+    /**
+     * @notice Calculates sqrt(a), following the selected rounding direction.
+     */
+    function sqrt(uint256 a, Rounding rounding) internal pure returns (uint256) {
+        unchecked {
+            uint256 result = sqrt(a);
+            return result + (rounding == Rounding.Up && result * result < a ? 1 : 0);
+        }
+    }
+
+    /**
+     * @dev Return the log in base 2, rounded down, of a positive value.
+     * Returns 0 if given 0.
+     */
+    function log2(uint256 value) internal pure returns (uint256) {
+        uint256 result = 0;
+        unchecked {
+            if (value >> 128 > 0) {
+                value >>= 128;
+                result += 128;
             }
-        } else {
-            super._fallback();
-        }
-    }
-
-    /**
-     * @dev Returns the current admin.
-     *
-     * TIP: To get this value clients can read directly from the storage slot shown below (specified by EIP1967) using the
-     * https://eth.wiki/json-rpc/API#eth_getstorageat[`eth_getStorageAt`] RPC call.
-     * `0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103`
-     */
-    function _dispatchAdmin() private returns (bytes memory) {
-        _requireZeroValue();
-
-        address admin = _getAdmin();
-        return abi.encode(admin);
-    }
-
-    /**
-     * @dev Returns the current implementation.
-     *
-     * TIP: To get this value clients can read directly from the storage slot shown below (specified by EIP1967) using the
-     * https://eth.wiki/json-rpc/API#eth_getstorageat[`eth_getStorageAt`] RPC call.
-     * `0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc`
-     */
-    function _dispatchImplementation() private returns (bytes memory) {
-        _requireZeroValue();
-
-        address implementation = _implementation();
-        return abi.encode(implementation);
-    }
-
-    /**
-     * @dev Changes the admin of the proxy.
-     *
-     * Emits an {AdminChanged} event.
-     */
-    function _dispatchChangeAdmin() private returns (bytes memory) {
-        _requireZeroValue();
-
-        address newAdmin = abi.decode(msg.data[4:], (address));
-        _changeAdmin(newAdmin);
-
-        return "";
-    }
-
-    /**
-     * @dev Upgrade the implementation of the proxy.
-     */
-    function _dispatchUpgradeTo() private returns (bytes memory) {
-        _requireZeroValue();
-
-        address newImplementation = abi.decode(msg.data[4:], (address));
-        _upgradeToAndCall(newImplementation, bytes(""), false);
-
-        return "";
-    }
-
-    /**
-     * @dev Upgrade the implementation of the proxy, and then call a function from the new implementation as specified
-     * by `data`, which should be an encoded function call. This is useful to initialize new storage variables in the
-     * proxied contract.
-     */
-    function _dispatchUpgradeToAndCall() private returns (bytes memory) {
-        (address newImplementation, bytes memory data) = abi.decode(msg.data[4:], (address, bytes));
-        _upgradeToAndCall(newImplementation, data, true);
-
-        return "";
-    }
-
-    /**
-     * @dev Returns the current admin.
-     *
-     * CAUTION: This function is deprecated. Use {ERC1967Upgrade-_getAdmin} instead.
-     */
-    function _admin() internal view virtual returns (address) {
-        return _getAdmin();
-    }
-
-    /**
-     * @dev To keep this contract fully transparent, all `ifAdmin` functions must be payable. This helper is here to
-     * emulate some proxy functions being non-payable while still allowing value to pass through.
-     */
-    function _requireZeroValue() private {
-        require(msg.value == 0);
-    }
-}
-
-
-// SPDX-License-Identifier: MIT
-// OpenZeppelin Contracts (last updated v4.9.0) (utils/Address.sol)
-
-pragma solidity ^0.8.1;
-
-/**
- * @dev Collection of functions related to the address type
- */
-library Address {
-    /**
-     * @dev Returns true if `account` is a contract.
-     *
-     * [IMPORTANT]
-     * ====
-     * It is unsafe to assume that an address for which this function returns
-     * false is an externally-owned account (EOA) and not a contract.
-     *
-     * Among others, `isContract` will return false for the following
-     * types of addresses:
-     *
-     *  - an externally-owned account
-     *  - a contract in construction
-     *  - an address where a contract will be created
-     *  - an address where a contract lived, but was destroyed
-     *
-     * Furthermore, `isContract` will also return true if the target contract within
-     * the same transaction is already scheduled for destruction by `SELFDESTRUCT`,
-     * which only has an effect at the end of a transaction.
-     * ====
-     *
-     * [IMPORTANT]
-     * ====
-     * You shouldn't rely on `isContract` to protect against flash loan attacks!
-     *
-     * Preventing calls from contracts is highly discouraged. It breaks composability, breaks support for smart wallets
-     * like Gnosis Safe, and does not provide security since it can be circumvented by calling from a contract
-     * constructor.
-     * ====
-     */
-    function isContract(address account) internal view returns (bool) {
-        // This method relies on extcodesize/address.code.length, which returns 0
-        // for contracts in construction, since the code is only stored at the end
-        // of the constructor execution.
-
-        return account.code.length > 0;
-    }
-
-    /**
-     * @dev Replacement for Solidity's `transfer`: sends `amount` wei to
-     * `recipient`, forwarding all available gas and reverting on errors.
-     *
-     * https://eips.ethereum.org/EIPS/eip-1884[EIP1884] increases the gas cost
-     * of certain opcodes, possibly making contracts go over the 2300 gas limit
-     * imposed by `transfer`, making them unable to receive funds via
-     * `transfer`. {sendValue} removes this limitation.
-     *
-     * https://consensys.net/diligence/blog/2019/09/stop-using-soliditys-transfer-now/[Learn more].
-     *
-     * IMPORTANT: because control is transferred to `recipient`, care must be
-     * taken to not create reentrancy vulnerabilities. Consider using
-     * {ReentrancyGuard} or the
-     * https://solidity.readthedocs.io/en/v0.8.0/security-considerations.html#use-the-checks-effects-interactions-pattern[checks-effects-interactions pattern].
-     */
-    function sendValue(address payable recipient, uint256 amount) internal {
-        require(address(this).balance >= amount, "Address: insufficient balance");
-
-        (bool success, ) = recipient.call{value: amount}("");
-        require(success, "Address: unable to send value, recipient may have reverted");
-    }
-
-    /**
-     * @dev Performs a Solidity function call using a low level `call`. A
-     * plain `call` is an unsafe replacement for a function call: use this
-     * function instead.
-     *
-     * If `target` reverts with a revert reason, it is bubbled up by this
-     * function (like regular Solidity function calls).
-     *
-     * Returns the raw returned data. To convert to the expected return value,
-     * use https://solidity.readthedocs.io/en/latest/units-and-global-variables.html?highlight=abi.decode#abi-encoding-and-decoding-functions[`abi.decode`].
-     *
-     * Requirements:
-     *
-     * - `target` must be a contract.
-     * - calling `target` with `data` must not revert.
-     *
-     * _Available since v3.1._
-     */
-    function functionCall(address target, bytes memory data) internal returns (bytes memory) {
-        return functionCallWithValue(target, data, 0, "Address: low-level call failed");
-    }
-
-    /**
-     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`], but with
-     * `errorMessage` as a fallback revert reason when `target` reverts.
-     *
-     * _Available since v3.1._
-     */
-    function functionCall(
-        address target,
-        bytes memory data,
-        string memory errorMessage
-    ) internal returns (bytes memory) {
-        return functionCallWithValue(target, data, 0, errorMessage);
-    }
-
-    /**
-     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
-     * but also transferring `value` wei to `target`.
-     *
-     * Requirements:
-     *
-     * - the calling contract must have an ETH balance of at least `value`.
-     * - the called Solidity function must be `payable`.
-     *
-     * _Available since v3.1._
-     */
-    function functionCallWithValue(address target, bytes memory data, uint256 value) internal returns (bytes memory) {
-        return functionCallWithValue(target, data, value, "Address: low-level call with value failed");
-    }
-
-    /**
-     * @dev Same as {xref-Address-functionCallWithValue-address-bytes-uint256-}[`functionCallWithValue`], but
-     * with `errorMessage` as a fallback revert reason when `target` reverts.
-     *
-     * _Available since v3.1._
-     */
-    function functionCallWithValue(
-        address target,
-        bytes memory data,
-        uint256 value,
-        string memory errorMessage
-    ) internal returns (bytes memory) {
-        require(address(this).balance >= value, "Address: insufficient balance for call");
-        (bool success, bytes memory returndata) = target.call{value: value}(data);
-        return verifyCallResultFromTarget(target, success, returndata, errorMessage);
-    }
-
-    /**
-     * @dev Same as {xref-Address-functionCall-add
[truncated — full diff is 363,029 bytes]
> ```

> </details>

> 🔒 **Immutable References:** `fxBASE()` → fxSP (TransparentUpgradeableProxy), `stable()` → USDC (FiatTokenProxy), `fxUSD()` → fxUSD (TransparentUpgradeableProxy)

### > 🔴 `upgradeability (TransparentUpgradeable)`

> > ⚠️ **CRITICAL** — Upgradeability allows arbitrary code replacement. Must be behind both a Multisig AND a Timelock.

> **Privileged write functions:**  
> **Capabilities:** ⬆️ **UPGRADE**
> - `upgradeTo(address)` — Upgrade proxy implementation to a new address `[UPGRADE]`
> - `upgradeToAndCall(address,bytes)` — Upgrade proxy implementation and call an initializer `[UPGRADE]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x68863fb8855b04509a835082478D6E3D0bE4E61a` | [↳ TimelockController (3d)](#c-0x68863fb8855b04509a835082478d6e3d0be4e61a) | 🟢 LOW | — | Storage only | 3d delay (⚠ changed 1x) |


> **Delay history for `TimelockController (3d)` (0x6886...E61a):** 3d → 3d

### > 🔴 `BUYBACK_ROLE`

> **Hash:** `0xa7c777b85fc58675e1f97f547c6d0658b5454f6e82d1930f8a36716c5ac0de05`  
> **Managed by:** `DEFAULT_ADMIN_ROLE`  
> **Privileged write functions:**  
> **Capabilities:** 💰 **SUPPLY**
> - `buyback(uint256 amountIn, bytes calldata data)` — Buyback fxUSD with stable token. `[SUPPLY]`

> **Members (2):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x4215F2014239Cf0E1A8617b31Fcaf88AaC6e4779` | EOA | 🔴 CRITICAL | 2025-01-02 | Events only · hasRole ✓ | ⚠️ Single private key |
> | `0x87d5e4cAaF4358A4337C10859c7107c7AEF4f8Ce` | [↳ TransparentUpgradeableProxy](#c-0x87d5e4caaf4358a4337c10859c7107c7aef4f8ce) | 🟠 HIGH | 2025-11-04 | Events only · hasRole ✓ |  |

### > 🟢 `DEFAULT_ADMIN_ROLE` 🔄 5 changes

> **Hash:** `0x0000000000000000000000000000000000000000000000000000000000000000`  
> **Managed by:** `DEFAULT_ADMIN_ROLE`  
> **Privileged write functions:**
> - `updateConverter(address newConverter)` — Update the address of converter.
> - `updateCurvePool(address newPool)` — Update the address of curve pool.
> - `updatePriceThreshold(uint256 newThreshold)` — Update the value of depeg price threshold.

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x68863fb8855b04509a835082478D6E3D0bE4E61a` | [↳ TimelockController (3d)](#c-0x68863fb8855b04509a835082478d6e3d0be4e61a) | 🟢 LOW | 2026-04-20 | Events only · hasRole ✓ | 3d delay (⚠ changed 1x) |

> **🕘 Previous Holders (2)** _(verified inactive — `hasRole`/`is` returned false)_:

> | Address | Name / Type | Granted | Status |
> |---|---|---|---|
> | `0x26B2ec4E02ebe2F54583af25b647b1D619e67BbF` | Gnosis Safe 6/9 | 2025-01-02 | 🕘 HISTORICAL |
> | `0xa1d0027Ca4C0CB79f9403d06A29470abC7b0a468` | EOA | 2025-01-01 | 🕘 HISTORICAL |


> **Delay history for `TimelockController (3d)` (0x6886...E61a):** 3d → 3d

### > 🔴 `STABILIZE_ROLE`

> **Hash:** `0x90ba4e11ad240e3543d2e8a32e330be1330b184ccfcddfdcf9cefb7f695dc7ca`  
> **Managed by:** `DEFAULT_ADMIN_ROLE`  
> **Privileged write functions:**
> - `stabilize(address srcToken, uint256 amountIn, bytes calldata data)` — Stabilize the fxUSD price in curve pool.

> **Members (2):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x4215F2014239Cf0E1A8617b31Fcaf88AaC6e4779` | EOA | 🔴 CRITICAL | 2025-01-02 | Events only · hasRole ✓ | ⚠️ Single private key |
> | `0x87d5e4cAaF4358A4337C10859c7107c7AEF4f8Ce` | [↳ TransparentUpgradeableProxy](#c-0x87d5e4caaf4358a4337c10859c7107c7aef4f8ce) | 🟠 HIGH | 2025-11-04 | Events only · hasRole ✓ |  |

### > 🟠 `converter()`

> **Privileged write functions:**
> - `initialize(address admin, address _converter, address _curvePool)`
> - `onSwap(address srcToken, address targetToken, uint256 amountIn, bytes calldata data)` — This function will be called in `buyback`, `stabilize`.
> - `updateConverter(address newConverter)` — Update the address of converter.

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x12AF4529129303D7FbD2563E242C4a2890525912` | MultiPathConverter | 🟠 HIGH | — | Storage only |  |

### > 🟠 `curvePool()`

> **Privileged write functions:**
> - `initialize(address admin, address _converter, address _curvePool)`
> - `updateCurvePool(address newPool)` — Update the address of curve pool.

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x5018BE882DccE5E3F2f3B0913AE2096B9b3fB61f` | [↳ USDCfxUSD (CurveStableSwapNG)](#c-0x5018be882dcce5e3f2f3b0913ae2096b9b3fb61f) | 🟠 HIGH | — | Storage only |  |

> #### 🔧 Permissioned Parameters

> **`converter`**

> | Field | Value |
> |---|---|
> | Current Value | `0x12AF4529129303D7FbD2563E242C4a2890525912` |
> | Setter | `updateConverter(address newConverter)` |
> | Gated by | `DEFAULT_ADMIN_ROLE, converter()` |
> | Tags | — |
> | Last changed | 2025-01-01 |
> | Changed by | `0x0000...0000` (Burn address (renounced)) |
> | Total changes | 1 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `0x0000000000000000000000000000000000000000` | `0x0000...0000` (Burn address (renounced)) | 2025-01-01 |

> **`curvePool`**

> | Field | Value |
> |---|---|
> | Current Value | `0x5018BE882DccE5E3F2f3B0913AE2096B9b3fB61f` |
> | Setter | `updateCurvePool(address newPool)` |
> | Gated by | `DEFAULT_ADMIN_ROLE, curvePool()` |
> | Tags | — |
> | Last changed | 2025-01-01 |
> | Changed by | `0x0000...0000` (Burn address (renounced)) |
> | Total changes | 1 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `0x0000000000000000000000000000000000000000` | `0x0000...0000` (Burn address (renounced)) | 2025-01-01 |

> **`priceThreshold`**

> | Field | Value |
> |---|---|
> | Current Value | `998000000000000000 (0.998000e18)` |
> | Setter | `updatePriceThreshold(uint256 newThreshold)` |
> | Gated by | `DEFAULT_ADMIN_ROLE` |
> | Tags | — |
> | Last changed | 2025-01-30 |
> | Changed by | `0x26B2...7BbF` (Gnosis Safe 6/9) |
> | Total changes | 2 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `newThreshold=998000000000000000 (0.998000e18)` | `0x26B2...7BbF` (Gnosis Safe 6/9) | 2025-01-30 |
> | 2 | `995000000000000000 (0.995000e18)` | `0xa1d0...a468` (EOA) | 2025-01-01 |

> #### 💰 Supply Actions

> _Mint / redeem / burn call tracking — last 5 calls per function, total counts preserved._

> **`buyback`** ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Setter | `buyback(uint256 amountIn, bytes calldata data)` |
> | Gated by | `BUYBACK_ROLE` |
> | Tags | `SUPPLY` |
> | Last called | — |
> | Called by | — |
> | Total calls | 0 ❄️ |

---
<a id="c-0xe60eb8098b34ed775ac44b1dde864e098c6d7f37"></a>
## > Gauge Controller `0xe60eB8098B34eD775ac44B1ddE864e098C6d7f37`

> *4 roles · 3 members · 6 functions*

> 🔒 **Immutable References:** `token()` → FXN (Curve DAO Token), `voting_escrow()` → veFXN (Voting Escrow), `future_admin()` → GaugeControllerOwner

### > 🟠 `admin()`

> **Privileged write functions:**
> - `commit_transfer_ownership(address addr)` — @notice Transfer ownership of GaugeController to `addr`
> - `apply_transfer_ownership()` — @notice Apply pending ownership transfer
> - `add_gauge(address addr, int128 gauge_type)` — @notice Add gauge `addr` of type `gauge_type` with weight `weight`
> - `add_type(string _name)` — @notice Add gauge type with name `_name` and weight `weight`
> - `change_type_weight(int128 type_id, uint256 weight)` — @notice Change gauge type `type_id` weight to `weight`
> - `change_gauge_weight(address addr, uint256 weight)` — @notice Change weight of gauge `addr` to `weight`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x1Ca7b82c4265835C7841cf29407217D820a7DADb` | [↳ GaugeControllerOwner](#c-0x1ca7b82c4265835c7841cf29407217d820a7dadb) | 🟠 HIGH | — | Storage only |  |

---
<a id="c-0x1145f304d74f3295fa38b82e7bb8704b0e187fa1"></a>
## > VotingEscrowProxy `0x1145f304d74f3295Fa38b82e7BB8704B0E187FA1`

> *4 roles · 3 members · 5 functions*

> > ⚡ **Inherited authority** [CONFIG] — via `veProxy (VotingEscrowProxy): read on every gauge deposit and withdrawal` on **SharedLiquidityGauge**

> 🔒 **Immutable References:** `veBoost()` → veFXNBoost (VotingEscrowBoost), `ve()` → veFXN (Voting Escrow)

> ✅ **Two-step admin transfer:** `OZ Ownable2Step` — prevents accidental hand-off (request → accept flow).

### > 🟢 `owner()`

> **Privileged write functions:**  
> **Capabilities:** ⚙️ **CONFIG** ⏸️ **PAUSE**
> - `renounceOwnership()` — Leaves the contract without owner. It will not be possible to call `onlyOwner` functions. Can only be called by the current owner.
> - `transferOwnership(address newOwner)` — Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner.
> - `updateVeBoost(address _newVeBoost)` — Update the address of VotingEscrowBoost contract. `[PAUSE]`
> - `resetVeBoost()` — Reset the address VotingEscrowBoost contract.
> - `acceptOwnership()` — Second step of `OZ Ownable2Step` — callable by the pending holder set via `transferOwnership`, not by the current role. Included here to surface the full transfer handoff. `[CONFIG]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x26B2ec4E02ebe2F54583af25b647b1D619e67BbF` | [↳ Gnosis Safe 6/9](#c-0x26b2ec4e02ebe2f54583af25b647b1d619e67bbf) | 🟢 LOW | — | Storage+Events | 6/9 signers |

> **Signers of `Gnosis Safe 6/9` (0x26B2...7BbF):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x38a93e70b0D8343657f802C1c3Fdb06aC8F8fe99` | EOA ⚠️ Hot wallet (4,446 txs) | — | EOA |
> | `0x85DB62FdFA9Ee6050f8b422F74D75D2069dA102B` | EOA | 2025-04-16 | EOA |
> | `0xe3522d85d37F55735e9327CD7a5cDe3abaf28E03` | EOA | — | EOA |
> | `0x74390470F4001Ca85D93bD546A4Ab1724359654B` | EOA | — | EOA |
> | `0xeF0Ca09fbf9a5f61E657Fb208b46b8685c1d4766` | EOA | — | EOA |
> | `0x8EcAB7B8ed8215cA52500cbf1548B9239173ef82` | EOA | — | EOA |
> | `0x18411aB626c9b3B3Dd5b7356574D8ff396436744` | EOA | 2026-08-01 | EOA |
> | `0xcdF067F306E7a511Ef701588AFCdcff292B19282` | EOA | 2023-12-26 | EOA |
> | `0xC8Be49a9b1ca1A1cc654491a7cBbD27aBfA06A81` | EOA | 2026-03-13 | EOA |

### > 🟢 `pendingOwner()`


> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x26B2ec4E02ebe2F54583af25b647b1D619e67BbF` | [↳ Gnosis Safe 6/9](#c-0x26b2ec4e02ebe2f54583af25b647b1d619e67bbf) | 🟢 LOW | — | Events only | 6/9 signers |

> **Signers of `Gnosis Safe 6/9` (0x26B2...7BbF):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x38a93e70b0D8343657f802C1c3Fdb06aC8F8fe99` | EOA ⚠️ Hot wallet (4,446 txs) | — | EOA |
> | `0x85DB62FdFA9Ee6050f8b422F74D75D2069dA102B` | EOA | 2025-04-16 | EOA |
> | `0xe3522d85d37F55735e9327CD7a5cDe3abaf28E03` | EOA | — | EOA |
> | `0x74390470F4001Ca85D93bD546A4Ab1724359654B` | EOA | — | EOA |
> | `0xeF0Ca09fbf9a5f61E657Fb208b46b8685c1d4766` | EOA | — | EOA |
> | `0x8EcAB7B8ed8215cA52500cbf1548B9239173ef82` | EOA | — | EOA |
> | `0x18411aB626c9b3B3Dd5b7356574D8ff396436744` | EOA | 2026-08-01 | EOA |
> | `0xcdF067F306E7a511Ef701588AFCdcff292B19282` | EOA | 2023-12-26 | EOA |
> | `0xC8Be49a9b1ca1A1cc654491a7cBbD27aBfA06A81` | EOA | 2026-03-13 | EOA |

> #### 🔧 Permissioned Parameters

> **`veBoost`**

> | Field | Value |
> |---|---|
> | Current Value | `0x8Cc02c0D9592976635E98e6446ef4976567E7A81` |
> | Setter | `updateVeBoost(address _newVeBoost)` |
> | Gated by | `owner()` |
> | Tags | `PAUSE` |
> | Last changed | 2024-02-23 |
> | Changed by | `0x0000...0000` (Burn address (renounced)) |
> | Total changes | 1 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `0x0000000000000000000000000000000000000000` | `0x0000...0000` (Burn address (renounced)) | 2024-02-23 |

---
<a id="c-0x4187dc4998bb9f47389cd885a80a52a74ec8803c"></a>
## > MultiRewards `0x4187DC4998bB9f47389cD885A80a52A74EC8803c`

> *2 roles · 2 members · 0 functions*

> 🔒 **Immutable References:** `vefxnProxy()` → FxnVoterProxy, `poolRegistry()` → PoolRegistry

---
<a id="c-0x87d5e4caaf4358a4337c10859c7107c7aef4f8ce"></a>
## > ProtocolTreasury `0x87d5e4cAaF4358A4337C10859c7107c7AEF4f8Ce`

> *10 roles · 8 members · 8 functions*

> > ⚠️ **Upgradeable** (TransparentUpgradeable) — impl: `0x253d0C045eE4fB6F2707Fe7d1Fcd0ef036E032A9`

> **Proxy History (2 events):**

> | # | Date | Event | Address | Key Changes | Tx |
> |---|---|---|---|---|---|
> | 1 | 2025-10-31 | Upgrade | `0x253d...32A9` | Initial deployment | [0x25cba1775c135933077b3ad070bcbdfbc07631bb30ccfdb311debce62fbd87a0](https://etherscan.io/tx/0x25cba1775c135933077b3ad070bcbdfbc07631bb30ccfdb311debce62fbd87a0) |
> | 2 | 2025-10-31 | Admin Changed | `0x9B54...DDA4` | Previous: `0x0000...0000` | [0x25cba1775c135933077b3ad070bcbdfbc07631bb30ccfdb311debce62fbd87a0](https://etherscan.io/tx/0x25cba1775c135933077b3ad070bcbdfbc07631bb30ccfdb311debce62fbd87a0) |

> > 💰 **Inherited supply authority** — holds `BUYBACK_ROLE` on **PegKeeper**. Access controls on this contract gate root token supply.

### > 🔴 `upgradeability (TransparentUpgradeable)`

> > ⚠️ **CRITICAL** — Upgradeability allows arbitrary code replacement. Must be behind both a Multisig AND a Timelock.

> **Privileged write functions:**  
> **Capabilities:** ⬆️ **UPGRADE**
> - `upgradeTo(address)` — Upgrade proxy implementation to a new address `[UPGRADE]`
> - `upgradeToAndCall(address,bytes)` — Upgrade proxy implementation and call an initializer `[UPGRADE]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x68863fb8855b04509a835082478D6E3D0bE4E61a` | [↳ TimelockController (3d)](#c-0x68863fb8855b04509a835082478d6e3d0be4e61a) | 🟢 LOW | — | Storage only | 3d delay (⚠ changed 1x) |


> **Delay history for `TimelockController (3d)` (0x6886...E61a):** 3d → 3d

### > 🟢 `DEFAULT_ADMIN_ROLE`

> **Hash:** `0x0000000000000000000000000000000000000000000000000000000000000000`  
> **Managed by:** `DEFAULT_ADMIN_ROLE`  
> **Privileged write functions:**
> - `withdraw(address baseToken, address recipient)` — Withdraw base token to someone else. This should be only used when we are retiring this contract.

> **Members (2):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x26B2ec4E02ebe2F54583af25b647b1D619e67BbF` | [↳ Gnosis Safe 6/9](#c-0x26b2ec4e02ebe2f54583af25b647b1d619e67bbf) | 🟢 LOW | 2025-10-31 | Events only · hasRole ✓ | 6/9 signers |
> | `0x28c921adAC4c1072658eB01a28DA06b5F651eF62` | [↳ Gnosis Safe 3/4](#c-0x28c921adac4c1072658eb01a28da06b5f651ef62) | 🟢 LOW | 2025-11-04 | Events only · hasRole ✓ | 3/4 signers |

> **🕘 Previous Holders (1)** _(verified inactive — `hasRole`/`is` returned false)_:

> | Address | Name / Type | Granted | Status |
> |---|---|---|---|
> | `0xa1d0027Ca4C0CB79f9403d06A29470abC7b0a468` | EOA | 2025-10-31 | 🕘 HISTORICAL |

> **Signers of `Gnosis Safe 6/9` (0x26B2...7BbF):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x38a93e70b0D8343657f802C1c3Fdb06aC8F8fe99` | EOA ⚠️ Hot wallet (4,446 txs) | — | EOA |
> | `0x85DB62FdFA9Ee6050f8b422F74D75D2069dA102B` | EOA | 2025-04-16 | EOA |
> | `0xe3522d85d37F55735e9327CD7a5cDe3abaf28E03` | EOA | — | EOA |
> | `0x74390470F4001Ca85D93bD546A4Ab1724359654B` | EOA | — | EOA |
> | `0xeF0Ca09fbf9a5f61E657Fb208b46b8685c1d4766` | EOA | — | EOA |
> | `0x8EcAB7B8ed8215cA52500cbf1548B9239173ef82` | EOA | — | EOA |
> | `0x18411aB626c9b3B3Dd5b7356574D8ff396436744` | EOA | 2026-08-01 | EOA |
> | `0xcdF067F306E7a511Ef701588AFCdcff292B19282` | EOA | 2023-12-26 | EOA |
> | `0xC8Be49a9b1ca1A1cc654491a7cBbD27aBfA06A81` | EOA | 2026-03-13 | EOA |

> **Signers of `Gnosis Safe 3/4` (0x28c9...eF62):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x38a93e70b0D8343657f802C1c3Fdb06aC8F8fe99` | EOA ⚠️ Hot wallet (4,446 txs) | — | EOA |
> | `0x85DB62FdFA9Ee6050f8b422F74D75D2069dA102B` | EOA | 2025-05-13 | EOA |
> | `0xe3522d85d37F55735e9327CD7a5cDe3abaf28E03` | EOA | — | EOA |
> | `0x74390470F4001Ca85D93bD546A4Ab1724359654B` | EOA | — | EOA |

### > 🟢 `BATCH_TRANSFER_ROLE`

> **Hash:** `0x8ba312960b5597dbb6106c0155aa0551317467e13792b46ce452b4e143b06e13`  
> **Managed by:** `DEFAULT_ADMIN_ROLE`  
> **Privileged write functions:**
> - `batchTransfer(address token, address[] calldata receivers, uint256[] calldata amounts)` — Batch transfer tokens to the receiver.

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x28c921adAC4c1072658eB01a28DA06b5F651eF62` | [↳ Gnosis Safe 3/4](#c-0x28c921adac4c1072658eb01a28da06b5f651ef62) | 🟢 LOW | 2025-11-04 | Events only · hasRole ✓ | 3/4 signers |

> **Signers of `Gnosis Safe 3/4` (0x28c9...eF62):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x38a93e70b0D8343657f802C1c3Fdb06aC8F8fe99` | EOA ⚠️ Hot wallet (4,446 txs) | — | EOA |
> | `0x85DB62FdFA9Ee6050f8b422F74D75D2069dA102B` | EOA | 2025-05-13 | EOA |
> | `0xe3522d85d37F55735e9327CD7a5cDe3abaf28E03` | EOA | — | EOA |
> | `0x74390470F4001Ca85D93bD546A4Ab1724359654B` | EOA | — | EOA |

### > 🔴 `BUYBACK_ROLE`

> **Hash:** `0xa7c777b85fc58675e1f97f547c6d0658b5454f6e82d1930f8a36716c5ac0de05`  
> **Managed by:** `DEFAULT_ADMIN_ROLE`  
> **Privileged write functions:**
> - `buyback(address pegKeeper, uint256 amountIn, bytes calldata data)` — Buyback fxUSD with stable reserve in FxUSDSave.

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xcDcB516937F95c18a98Dd70458afB64E3C43dC13` | EOA | 🔴 CRITICAL | 2026-04-30 | Events only · hasRole ✓ | ⚠️ Single private key |

> **🕘 Previous Holders (1)** _(verified inactive — `hasRole`/`is` returned false)_:

> | Address | Name / Type | Granted | Status |
> |---|---|---|---|
> | `0x4215F2014239Cf0E1A8617b31Fcaf88AaC6e4779` | EOA | 2025-11-04 | 🕘 HISTORICAL |

### > ⚪ `MULTICALL_ROLE`

> **Hash:** `0x759995689d0b5a8d082ba285697cd721c40ae33fadfeb8da798e7c4b54e8827d`  
> **Managed by:** `DEFAULT_ADMIN_ROLE`  
> **Privileged write functions:**
> - `multicall(address[] calldata targets, bytes[] calldata data)` — Multicall function to call multiple functions in a single transaction.

> **Members (0):** ⚠️ _**Declared but unheld** — role exists in source and gates the function(s) listed above, but has never been granted to any address. The moment any admin grants this role, the gated function becomes callable; treat this as a one-tx-away live capability._


### > ⚪ `PERMISSIONED_ROUTER_ROLE`

> **Hash:** `0x795faeccae94bd9eed40852cb158e30f590ffa7acbfa89a0204147c5bcf072cd`  
> **Managed by:** `DEFAULT_ADMIN_ROLE`  
> **Privileged write functions:**
> - `swap(address srcToken, address dstToken, uint256 amountIn, TradingParameter memory params)` — Swap token with permissioned router.

> **Members (0):** ⚠️ _**Declared but unheld** — role exists in source and gates the function(s) listed above, but has never been granted to any address. The moment any admin grants this role, the gated function becomes callable; treat this as a one-tx-away live capability._


### > ⚪ `PERMISSIONED_TRADER_ROLE`

> **Hash:** `0x84060c990e14b08d7c5d95f3c4be08c8b28742dee5236bc38e7559b465ca531f`  
> **Managed by:** `DEFAULT_ADMIN_ROLE`  
> **Privileged write functions:**
> - `swap(address srcToken, address dstToken, uint256 amountIn, TradingParameter memory params)` — Swap token with permissioned router.

> **Members (0):** ⚠️ _**Declared but unheld** — role exists in source and gates the function(s) listed above, but has never been granted to any address. The moment any admin grants this role, the gated function becomes callable; treat this as a one-tx-away live capability._


### > 🔴 `STABILIZE_ROLE`

> **Hash:** `0x90ba4e11ad240e3543d2e8a32e330be1330b184ccfcddfdcf9cefb7f695dc7ca`  
> **Managed by:** `DEFAULT_ADMIN_ROLE`  
> **Privileged write functions:**
> - `stabilize(address pegKeeper, address srcToken, uint256 amountIn, bytes calldata data)` — Stabilize the fxUSD price in curve pool.

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xcDcB516937F95c18a98Dd70458afB64E3C43dC13` | EOA | 🔴 CRITICAL | 2026-04-30 | Events only · hasRole ✓ | ⚠️ Single private key |

> **🕘 Previous Holders (1)** _(verified inactive — `hasRole`/`is` returned false)_:

> | Address | Name / Type | Granted | Status |
> |---|---|---|---|
> | `0x4215F2014239Cf0E1A8617b31Fcaf88AaC6e4779` | EOA | 2025-11-04 | 🕘 HISTORICAL |

### > 🟠 `TOKEN_RECEIVER_ROLE`

> **Hash:** `0x607b5964b99ba60004997a77c26b85dfbfe3dd5c8325bfb94d82d08cf63c6932`  
> **Managed by:** `DEFAULT_ADMIN_ROLE`  
> **Privileged write functions:**
> - `batchTransfer(address token, address[] calldata receivers, uint256[] calldata amounts)` — Batch transfer tokens to the receiver.

> **Members (4):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x0E67460226A71dF07115C1f169418dD159e5521B` | RevenuePool | 🟠 HIGH | 2025-11-04 | Events only · hasRole ✓ |  |
> | `0x28c921adAC4c1072658eB01a28DA06b5F651eF62` | [↳ Gnosis Safe 3/4](#c-0x28c921adac4c1072658eb01a28da06b5f651ef62) | 🟢 LOW | 2025-11-04 | Events only · hasRole ✓ | 3/4 signers |
> | `0x5Ac1A882E6CeDc58511b7e42b02BAB42E2c02956` | GaugeRewarder | 🟠 HIGH | 2025-11-04 | Events only · hasRole ✓ |  |
> | `0x6440e21A3634C319c69CEf8d17601DBC4E97C3dB` | PlatformFeeBurner | 🟠 HIGH | 2026-06-24 | Events only · hasRole ✓ |  |

> **Signers of `Gnosis Safe 3/4` (0x28c9...eF62):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x38a93e70b0D8343657f802C1c3Fdb06aC8F8fe99` | EOA ⚠️ Hot wallet (4,446 txs) | — | EOA |
> | `0x85DB62FdFA9Ee6050f8b422F74D75D2069dA102B` | EOA | 2025-05-13 | EOA |
> | `0xe3522d85d37F55735e9327CD7a5cDe3abaf28E03` | EOA | — | EOA |
> | `0x74390470F4001Ca85D93bD546A4Ab1724359654B` | EOA | — | EOA |

---
<a id="c-0x5018be882dcce5e3f2f3b0913ae2096b9b3fb61f"></a>
## > CurveStableSwapNG `0x5018BE882DccE5E3F2f3B0913AE2096B9b3fB61f`

> *0 roles · 0 members · 0 functions*

> _No roles detected._

---
<a id="c-0x1ca7b82c4265835c7841cf29407217d820a7dadb"></a>
## > GaugeControllerOwner `0x1Ca7b82c4265835C7841cf29407217D820a7DADb`

> *3 roles · 3 members · 10 functions*

### > 🟢 `DEFAULT_ADMIN_ROLE`

> **Hash:** `0x0000000000000000000000000000000000000000000000000000000000000000`  
> **Managed by:** `DEFAULT_ADMIN_ROLE`  
> **Privileged write functions:**  
> **Capabilities:** ⏸️ **PAUSE**
> - `updateRelativeWeight(address _gauge, uint256 _newWeight)` — Whitelist a gauge with fixed relative gauge weight.
> - `commitTransferOwnership(address addr)` — Transfer ownership of GaugeController to `addr`
> - `applyTransferOwnership()` — Apply pending ownership transfer
> - `addGauge(address addr, int128 gaugeType)` — Add gauge `addr` of type `gaugeType` with zero weight
> - `addGauge(address addr, int128 gaugeType, uint256 weight)` — Add gauge `addr` of type `gaugeType` with zero weight
> - `addType(string memory name)` — Add gauge type with name `name` and zero weight.
> - `addType(string memory name, uint256 weight)` — Add gauge type with name `name` and zero weight.
> - `changeTypeWeight(int128 typeId, uint256 weight)` — Change gauge type `typeId` weight to `weight` `[PAUSE]`
> - `changeGaugeWeight(address addr, uint256 weight)` — Change weight of gauge `addr` to `weight` `[PAUSE]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x26B2ec4E02ebe2F54583af25b647b1D619e67BbF` | [↳ Gnosis Safe 6/9](#c-0x26b2ec4e02ebe2f54583af25b647b1d619e67bbf) | 🟢 LOW | 2024-02-26 | Events only · hasRole ✓ | 6/9 signers |

> **🕘 Previous Holders (1)** _(verified inactive — `hasRole`/`is` returned false)_:

> | Address | Name / Type | Granted | Status |
> |---|---|---|---|
> | `0xa1d0027Ca4C0CB79f9403d06A29470abC7b0a468` | EOA | 2024-02-23 | 🕘 HISTORICAL |

> **Signers of `Gnosis Safe 6/9` (0x26B2...7BbF):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x38a93e70b0D8343657f802C1c3Fdb06aC8F8fe99` | EOA ⚠️ Hot wallet (4,446 txs) | — | EOA |
> | `0x85DB62FdFA9Ee6050f8b422F74D75D2069dA102B` | EOA | 2025-04-16 | EOA |
> | `0xe3522d85d37F55735e9327CD7a5cDe3abaf28E03` | EOA | — | EOA |
> | `0x74390470F4001Ca85D93bD546A4Ab1724359654B` | EOA | — | EOA |
> | `0xeF0Ca09fbf9a5f61E657Fb208b46b8685c1d4766` | EOA | — | EOA |
> | `0x8EcAB7B8ed8215cA52500cbf1548B9239173ef82` | EOA | — | EOA |
> | `0x18411aB626c9b3B3Dd5b7356574D8ff396436744` | EOA | 2026-08-01 | EOA |
> | `0xcdF067F306E7a511Ef701588AFCdcff292B19282` | EOA | 2023-12-26 | EOA |
> | `0xC8Be49a9b1ca1A1cc654491a7cBbD27aBfA06A81` | EOA | 2026-03-13 | EOA |

### > 🔴 `WEIGHT_NORMALIZER_ROLE`

> **Hash:** `0xce9378ae9382e3502ae0775931106bb9f145185018bb190414ae0db7cd8e3431`  
> **Managed by:** `DEFAULT_ADMIN_ROLE`  
> **Privileged write functions:**
> - `normalizeGaugeWeight()` — Normalize the whitelisted gauge to correct weight.

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x11E91BB6d1334585AA37D8F4fde3932C7960B938` | EOA | 🔴 CRITICAL | 2024-02-27 | Events only · hasRole ✓ | ⚠️ Single private key |

### > 🟠 `controller()`


> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xe60eB8098B34eD775ac44B1ddE864e098C6d7f37` | [↳ Gauge Controller](#c-0xe60eb8098b34ed775ac44b1dde864e098c6d7f37) | 🟠 HIGH | — | Storage only |  |

> #### 🔧 Permissioned Parameters

> **`changeGaugeWeight`** *(per-asset)* 🔄 **ACTIVE** (9 changes)

> > ⚠️ **Over-counted history** — the 5 retained history rows resolve to only 2 distinct transaction(s), so some rows are duplicate records of the same call. Treat the change count as an upper bound.

> > ⚠️ This parameter has been changed **9 times** — monitor for unexpected modifications.

> | Field | Value |
> |---|---|
> | Setter | `changeGaugeWeight(address addr, uint256 weight)` |
> | Gated by | `DEFAULT_ADMIN_ROLE` |
> | Tags | `PAUSE` |
> | Last called | 2025-01-02 |
> | Called by | `0x26B2...7BbF` (Gnosis Safe 6/9) |
> | Total calls | 9 🔄 |

> **Recent changes (showing last 5 of 9):**

> | # | Asset | Value | Set By | Date |
> |---|---|---|---|---|
> | 1 | Fundraising Gauge Fx | `weight=0` | `0x26B2...7BbF` (Gnosis Safe 6/9) | 2025-01-02 |
> | 2 | Fundraising Gauge Fx | `weight=0` | `0x26B2...7BbF` (Gnosis Safe 6/9) | 2025-01-02 |
> | 3 | Fundraising Gauge Fx | `weight=0` | `0x26B2...7BbF` (Gnosis Safe 6/9) | 2024-03-14 |
> | 4 | Fundraising Gauge Fx | `weight=0` | `0x26B2...7BbF` (Gnosis Safe 6/9) | 2024-03-14 |
> | 5 | Fundraising Gauge Fx | `weight=0` | `0x26B2...7BbF` (Gnosis Safe 6/9) | 2024-03-14 |

> **`changeTypeWeight`** ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Setter | `changeTypeWeight(int128 typeId, uint256 weight)` |
> | Gated by | `DEFAULT_ADMIN_ROLE` |
> | Tags | `PAUSE` |
> | Last called | — |
> | Called by | — |
> | Total calls | 0 ❄️ |

> **`weights`** *(per-asset)* 🔄 **ACTIVE** (8 changes)

> > ⚠️ **Over-counted history** — the 5 retained history rows resolve to only 2 distinct transaction(s), so some rows are duplicate records of the same call. Treat the change count as an upper bound.

> > ⚠️ This parameter has been changed **8 times** — monitor for unexpected modifications.

> | Asset | Current Value |
> |---|---|
> | Fundraising Gauge Fx `0x4E6A...9908` | `0` |
> | Fundraising Gauge Fx `0x9710...2e28` | `50000000000000000 (0.050000e18)` |
> | USDC/fxUSD Gauge `0xf1E1...df60` | `500000000000000000 (0.500000e18)` |

> | Field | Value |
> |---|---|
> | Setter | `updateRelativeWeight(address _gauge, uint256 _newWeight)` |
> | Gated by | `DEFAULT_ADMIN_ROLE` |
> | Tags | — |
> | Last changed | 2025-02-19 |
> | Changed by | `0x26B2...7BbF` (Gnosis Safe 6/9) |
> | Total changes | 8 🔄 |

> **Recent changes (showing last 5 of 8):**

> | # | Asset | Value | Set By | Date |
> |---|---|---|---|---|
> | 1 | Fundraising Gauge Fx | `_newWeight=0` | `0x26B2...7BbF` (Gnosis Safe 6/9) | 2025-02-19 |
> | 2 | USDC/fxUSD Gauge | `_newWeight=500000000000000000 (0.500000e18)` | `0x26B2...7BbF` (Gnosis Safe 6/9) | 2025-02-19 |
> | 3 | Fundraising Gauge Fx | `_newWeight=50000000000000000 (0.050000e18)` | `0x26B2...7BbF` (Gnosis Safe 6/9) | 2024-12-04 |
> | 4 | Fundraising Gauge Fx | `_newWeight=50000000000000000 (0.050000e18)` | `0x26B2...7BbF` (Gnosis Safe 6/9) | 2024-12-04 |
> | 5 | USDC/fxUSD Gauge | `_newWeight=300000000000000000 (0.300000e18)` | `0x26B2...7BbF` (Gnosis Safe 6/9) | 2024-12-04 |

---
## ⚡ Authority Concentration

The following addresses hold permissions across multiple contracts or roles in this dependency stack. Concentration of authority increases systemic risk — a single compromised key or colluding multisig can affect multiple systems.

### 🟢 `0x68863fb8855b04509a835082478D6E3D0bE4E61a` — TimelockController (3d)
Controls **11 role(s)** across **6 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| SavingFxUSD `0x7743...fc39` | `DEFAULT_ADMIN_ROLE` | `updateTreasury(address _newTreasury)`, `updateHarvester(address _newHarvester)`, `updateExpenseRatio(uint32 _newRatio)`, `updateHarvesterRatio(uint32 _newRatio)` +2 more | 2026-04-20 |
| SavingFxUSD `0x7743...fc39` | `upgradeability (TransparentUpgradeable)` | `upgradeTo(address)`, `upgradeToAndCall(address,bytes)` | — |
| FxUSDBasePool `0x65C9...A3be` | `DEFAULT_ADMIN_ROLE` | `updateStableDepegPrice(uint256 newPrice)`, `updateRedeemCoolDownPeriod(uint256 newPeriod)`, `updateInstantRedeemFeeRatio(uint256 newRatio)`, `kill(address asset)` +1 more | 2026-04-20 |
| FxUSDBasePool `0x65C9...A3be` | `ASSET_MANAGER_ROLE` | `manage(address asset, uint256 amount)` | 2026-04-20 |
| FxUSDBasePool `0x65C9...A3be` | `upgradeability (TransparentUpgradeable)` | `upgradeTo(address)`, `upgradeToAndCall(address,bytes)` | — |
| SharedLiquidityGauge `0xEd92...3289` | `DEFAULT_ADMIN_ROLE` | `updateLiquidityManager(address _newManager)`, `disableGauge()` | 2026-04-20 |
| SharedLiquidityGauge `0xEd92...3289` | `upgradeability (TransparentUpgradeable)` | `upgradeTo(address)`, `upgradeToAndCall(address,bytes)` | — |
| ProxyAdmin `0x9B54...DDA4` | `owner()` | `changeProxyAdmin(TransparentUpgradeableProxy proxy, address newAdmin)`, `upgrade(TransparentUpgradeableProxy proxy, address implementation)`, `upgradeAndCall(TransparentUpgradeableProxy proxy, address implementation, bytes memory data)`, `renounceOwnership()` +1 more | — |
| PegKeeper `0x5056...cd70` | `DEFAULT_ADMIN_ROLE` | `updateConverter(address newConverter)`, `updateCurvePool(address newPool)`, `updatePriceThreshold(uint256 newThreshold)` | 2026-04-20 |
| PegKeeper `0x5056...cd70` | `upgradeability (TransparentUpgradeable)` | `upgradeTo(address)`, `upgradeToAndCall(address,bytes)` | — |
| ProtocolTreasury `0x87d5...f8Ce` | `upgradeability (TransparentUpgradeable)` | `upgradeTo(address)`, `upgradeToAndCall(address,bytes)` | — |

### 🟢 `0x26B2ec4E02ebe2F54583af25b647b1D619e67BbF` — Gnosis Safe 6/9
Controls **11 role(s)** across **8 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| FxUSDBasePoolFacet `0x3363...C708` | `upgradeability (Diamond (EIP-2535))` | `diamondCut((address,uint8,bytes4[])[],address,bytes)` | — |
| TimelockController `0x6886...E61a` | `EXECUTOR_ROLE` | `execute(address target, uint256 value, bytes calldata payload, bytes32 predecessor, bytes32 salt)`, `executeBatch(address[] calldata targets, uint256[] calldata values, bytes[] calldata payloads, bytes32 predecessor, bytes32 salt)` | 2026-04-06 |
| TimelockController `0x6886...E61a` | `PROPOSER_ROLE` | `schedule(address target, uint256 value, bytes calldata data, bytes32 predecessor, bytes32 salt, uint256 delay)`, `scheduleBatch(address[] calldata targets, uint256[] calldata values, bytes[] calldata payloads, bytes32 predecessor, bytes32 salt, uint256 delay)` | 2026-04-06 |
| TimelockController `0x6886...E61a` | `CANCELLER_ROLE` | `cancel(bytes32 id)` | 2026-04-06 |
| FxUSDBasePool `0x65C9...A3be` | `NO_INSTANT_REDEEM_FEE_ROLE` | `instantRedeemNoFee(address receiver, uint256 amountSharesToRedeem)` | 2025-11-04 |
| FxUSDBasePool `0x65C9...A3be` | `ASSET_MANAGER_ROLE` | `manage(address asset, uint256 amount)` | 2025-03-19 |
| SharedLiquidityGauge `0xEd92...3289` | `REWARD_MANAGER_ROLE` | `registerRewardToken(address _token, address _distributor)`, `updateRewardDistributor(address _token, address _newDistributor)`, `unregisterRewardToken(address _token)` | 2026-04-19 |
| RewardHarvester `0x0559...9C30` | `DEFAULT_ADMIN_ROLE` | `withdraw(address baseToken, address recipient)` | 2025-03-18 |
| VotingEscrowProxy `0x1145...7FA1` | `owner()` | `renounceOwnership()`, `transferOwnership(address newOwner)`, `updateVeBoost(address _newVeBoost)`, `resetVeBoost()` +1 more | — |
| ProtocolTreasury `0x87d5...f8Ce` | `DEFAULT_ADMIN_ROLE` | `withdraw(address baseToken, address recipient)` | 2025-10-31 |
| GaugeControllerOwner `0x1Ca7...DADb` | `DEFAULT_ADMIN_ROLE` | `updateRelativeWeight(address _gauge, uint256 _newWeight)`, `commitTransferOwnership(address addr)`, `applyTransferOwnership()`, `addGauge(address addr, int128 gaugeType)` +5 more | 2024-02-26 |

### 🟢 `0x28c921adAC4c1072658eB01a28DA06b5F651eF62` — Gnosis Safe 3/4
Controls **4 role(s)** across **2 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| FxUSDBasePool `0x65C9...A3be` | `ASSET_MANAGER_ROLE` | `manage(address asset, uint256 amount)` | 2026-04-20 |
| ProtocolTreasury `0x87d5...f8Ce` | `TOKEN_RECEIVER_ROLE` | `batchTransfer(address token, address[] calldata receivers, uint256[] calldata amounts)` | 2025-11-04 |
| ProtocolTreasury `0x87d5...f8Ce` | `DEFAULT_ADMIN_ROLE` | `withdraw(address baseToken, address recipient)` | 2025-11-04 |
| ProtocolTreasury `0x87d5...f8Ce` | `BATCH_TRANSFER_ROLE` | `batchTransfer(address token, address[] calldata receivers, uint256[] calldata amounts)` | 2025-11-04 |

### 🔴 `0x4215F2014239Cf0E1A8617b31Fcaf88AaC6e4779` — EOA
Controls **3 role(s)** across **2 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| RewardHarvester `0x0559...9C30` | `PERMISSIONED_TRADER_ROLE` | `swapAndDistribute(uint256 amountIn, address baseToken, address targetToken, TradingParameter memory params)` | 2025-03-19 |
| PegKeeper `0x5056...cd70` | `BUYBACK_ROLE` | `buyback(uint256 amountIn, bytes calldata data)` | 2025-01-02 |
| PegKeeper `0x5056...cd70` | `STABILIZE_ROLE` | `stabilize(address srcToken, uint256 amountIn, bytes calldata data)` | 2025-01-02 |

### 🟢 `0xA0FB1b11ccA5871fb0225B64308e249B97804E99` — Gnosis Safe 6/9
Controls **2 role(s)** across **2 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| SavingFxUSD `0x7743...fc39` | `DEFAULT_ADMIN_ROLE` | `updateTreasury(address _newTreasury)`, `updateHarvester(address _newHarvester)`, `updateExpenseRatio(uint32 _newRatio)`, `updateHarvesterRatio(uint32 _newRatio)` +2 more | 2025-04-02 |
| FxUSDBasePool `0x65C9...A3be` | `NO_INSTANT_REDEEM_FEE_ROLE` | `instantRedeemNoFee(address receiver, uint256 amountSharesToRedeem)` | 2025-11-04 |

### 🟠 `0x33636D49FbefBE798e15e7F356E8DBef543CC708` — Diamond
Controls **2 role(s)** across **2 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| SavingFxUSD `0x7743...fc39` | `CLAIM_FOR_ROLE` | `claimFor(address owner, address receiver)` | 2025-04-02 |
| FxUSDBasePool `0x65C9...A3be` | `NO_INSTANT_REDEEM_FEE_ROLE` | `instantRedeemNoFee(address receiver, uint256 amountSharesToRedeem)` | 2025-11-04 |

### 🟠 `0x12AF4529129303D7FbD2563E242C4a2890525912` — MultiPathConverter
Controls **2 role(s)** across **2 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| RewardHarvester `0x0559...9C30` | `PERMISSIONED_ROUTER_ROLE` | `swapAndDistribute(uint256 amountIn, address baseToken, address targetToken, TradingParameter memory params)` | 2025-03-19 |
| PegKeeper `0x5056...cd70` | `converter()` | `initialize(address admin, address _converter, address _curvePool)`, `onSwap(address srcToken, address targetToken, uint256 amountIn, bytes calldata data)`, `updateConverter(address newConverter)` | — |

### 🟠 `0x87d5e4cAaF4358A4337C10859c7107c7AEF4f8Ce` — TransparentUpgradeableProxy
Controls **2 role(s)** across **1 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| PegKeeper `0x5056...cd70` | `BUYBACK_ROLE` | `buyback(uint256 amountIn, bytes calldata data)` | 2025-11-04 |
| PegKeeper `0x5056...cd70` | `STABILIZE_ROLE` | `stabilize(address srcToken, uint256 amountIn, bytes calldata data)` | 2025-11-04 |

### 🔴 `0xcDcB516937F95c18a98Dd70458afB64E3C43dC13` — EOA
Controls **2 role(s)** across **1 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| ProtocolTreasury `0x87d5...f8Ce` | `BUYBACK_ROLE` | `buyback(address pegKeeper, uint256 amountIn, bytes calldata data)` | 2026-04-30 |
| ProtocolTreasury `0x87d5...f8Ce` | `STABILIZE_ROLE` | `stabilize(address pegKeeper, address srcToken, uint256 amountIn, bytes calldata data)` | 2026-04-30 |


---
## ⛔ Sanctions Screening

| Source | Status |
|---|---|
| OFAC SDN | ✅ OFAC SDN screened (127 ETH addresses, cache: 2026-11-15) |
| Chainalysis | ✅ Chainalysis screened |
| **Result** | 53 addresses screened · ✅ 0 flagged |

---
## EOA Exposure Summary

The following roles are held by EOAs:

- **FxUSDBasePool** → `NO_INSTANT_REDEEM_FEE_ROLE` held by EOA `0x547090EB068220b3Da1F7b611ef21723Caa4121e`
  Functions: `instantRedeemNoFee(address receiver, uint256 amountSharesToRedeem)`
- **FxUSDBasePool** → `NO_INSTANT_REDEEM_FEE_ROLE` held by EOA `0x61b09116D341C6cc45513F29FE3B6C13fE3699A3`
  Functions: `instantRedeemNoFee(address receiver, uint256 amountSharesToRedeem)`
- **RewardHarvester** → `PERMISSIONED_TRADER_ROLE` held by EOA `0x4215F2014239Cf0E1A8617b31Fcaf88AaC6e4779`
  Functions: `swapAndDistribute(uint256 amountIn, address baseToken, address targetToken, TradingParameter memory params)`
- **PegKeeper** → `BUYBACK_ROLE` held by EOA `0x4215F2014239Cf0E1A8617b31Fcaf88AaC6e4779`
  Functions: `buyback(uint256 amountIn, bytes calldata data)`
- **PegKeeper** → `STABILIZE_ROLE` held by EOA `0x4215F2014239Cf0E1A8617b31Fcaf88AaC6e4779`
  Functions: `stabilize(address srcToken, uint256 amountIn, bytes calldata data)`
- **ProtocolTreasury** → `BUYBACK_ROLE` held by EOA `0xcDcB516937F95c18a98Dd70458afB64E3C43dC13`
  Functions: `buyback(address pegKeeper, uint256 amountIn, bytes calldata data)`
- **ProtocolTreasury** → `STABILIZE_ROLE` held by EOA `0xcDcB516937F95c18a98Dd70458afB64E3C43dC13`
  Functions: `stabilize(address pegKeeper, address srcToken, uint256 amountIn, bytes calldata data)`
- **GaugeControllerOwner** → `WEIGHT_NORMALIZER_ROLE` held by EOA `0x11E91BB6d1334585AA37D8F4fde3932C7960B938`
  Functions: `normalizeGaugeWeight()`

---
## ✅ Scan Integrity

No issues detected. All block ranges covered, source and ABI resolved for all contracts.
