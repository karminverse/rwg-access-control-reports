# Trustfall — Access Control Report — Resupply USD (reUSD)

| Field | Value |
|---|---|
| Contract | `0x57aB1E0003F623289CD798B1824Be09a793e4Bec` |
| Token | Resupply USD (reUSD) |
| Name | Stablecoin |
| Chain | Ethereum |
| Proxy Status | ✅ No |
| OZ AccessControl | ❌ No |
| Ownable | ✅ Yes |
| Pausable | — |
| ERC-4626 Vault | — |
| Control Surface | ⚠️ Hybrid — 1 off-chain dependency (governance) |
| Scan Integrity | ✅ No issues detected |
| Report Date | 2026-07-29 00:08 UTC |

### Surface Summary

| Field | Value |
|---|---:|
| Contracts | 26 |
| Role slots | 138 |
| Privileged Fns | 161 |
| EOA Holders | 0 |
| Critical Roles | 3 ⚠️ |

## Changes Since Last Scan

> Comparing **2026-07-28T23:54:17Z** (block 25634718) → **2026-07-29T00:06:05Z** (block 25634777).

> ✅ No changes to roles, parameters, contracts, or findings.


## 📋 Protocol Context

> *From protocol profile: Resupply Finance / Resupply_reUSD (Stablecoin)*

<details>
<summary><strong>Architecture</strong></summary>

- **Architectural shape:** reUSD is a CDP stablecoin — users post yield-bearing lending-market shares (Curve Lend crvUSD, Fraxlend frxUSD) into one of 19 `ResupplyPair` markets and borrow reUSD against them, up to a per-market debt ceiling. Governance is the Prisma Core/Voter pattern: one Core ownership hub, reached either through a slow ~8-day RSUP vote or through instant operator grants. Supply is bounded market-by-market (aggregate ceiling ~634.9M reUSD, ~32.1M live). The load-bearing fact for a lender: this entire slow-governance model is subordinate to a single 3-of-5 ops Safe that holds instant, un-timelocked Core authority. Otherwise fully on-chain — the one off-chain unknown is whether that Safe's 5 signers are genuinely independent (4 of the 5 are unidentified), which cannot be observed on-chain and, unlike a timelocked multisig, has no on-chain buffer or recovery behind it.
- **What reUSD is:** a non-proxy ERC-20 (`Stablecoin.sol`, inheriting LayerZero's `OFT`) minted by borrowing against collateral (and, secondarily, by fee accrual — see below). `mint()` is gated `operators[msg.sender] || msg.sender==owner()`; the SOLE operator ever set is `ResupplyRegistry` and `owner()` is the `Core` hub. No CDP pair holds direct mint rights — every mint routes through the Registry, so the Registry (and Core above it) is the one supply chokepoint to watch.
- **Mint mechanism:** reUSD is minted through the Registry, which itself enforces ONE gate — the caller must be a REGISTERED pair (`Registry.addPair`, onlyOwner=Core). The second gate is enforced pair-side on the borrow path: the mint must keep the market within its `borrowLimit` debt ceiling (plus maxLTV and collateral-oracle solvency). Each pair mints via two permissionless paths — user `borrow()`/`leveragedPosition()` (borrowLimit-bounded), and `withdrawFees()`, which mints accrued interest and fees as NEW reUSD to the FeeDeposit. Note the fee path is NOT borrowLimit-bounded, so it mints on top of the debt-ceiling total.
- **Supply cap:** reUSD supply is capped market-by-market. 19 registered markets (10 active) carry an aggregate `borrowLimit` of ~634.9M reUSD — the true maximum mint capacity — against ~32.1M borrowed (~5% utilized). A market's ceiling is Core-settable directly (8-day Voter path) or ramped UP-ONLY over >=7 days via `BorrowLimitController`; a new mint-capable market requires `Registry.addPair` (8-day). The highest-leverage lever in the deployer trio is `ResupplyPairDeployer.setCreationCode`, which sets the bytecode template for ALL future markets. Treat the sum of per-market borrowLimits as the ceiling on borrow-driven supply (fee accrual via `withdrawFees` mints a smaller amount on top, outside that cap).
- **Governance:** the Prisma Core/Voter model. `Core.execute` is the universal privileged-action dispatcher and carries ZERO delay of its own; the only slow path is the RSUP-vote `Voter` — create (>=1% weight) -> 7-day vote (30% quorum) -> 1-day executionDelay -> permissionless execute inside an 8-to-21-day window (24 proposals, 23 executed, 0 ever cancelled). The real timelock is therefore NOT the Voter's 8-day machinery but whatever operator grants exist — and since NO AuthHook is set on this deployment, all 24 live operator grants execute instantly. Governance is fully on-chain (no Snapshot; Discourse forum only).
- **Governance veto:** a fast-veto DOES exist — the Guardian holds live wildcard Core operator grants for `cancelProposal`, `updateProposalDescription` and `setMinTimeBetweenProposals`, so a passed proposal can be cancelled in one tx. The gap is not a missing canceller but LACK OF INDEPENDENCE: the Guardian resolves to the SAME 3-of-5 ops Safe that holds setVoter, so veto power and capture power share one custody. The delay levers (executionDelay / votingPeriod / quorum) carry no operator grant and stay voter-only; all three veto grants are historically UNUSED.
- **The instant fast-path:** the 3-of-5 ops Safe (0xfe11a5009f…) holds a live, hookless Core operator grant for `setVoter(address)` — it can reassign the DAO governor to an address it controls in ONE multisig tx, then arbitrary-execute Core (including `reUSD.setOperator` to add itself as a minter, or a direct `reUSD.mint` since Core owns the token) with no vote and no timelock. This Safe has historically BEEN the voter. It is the single most dangerous authority-topology finding in the profile (critical_parameters #1); the only mitigants are the 3-of-5 quorum and the fact that there is no on-chain recovery once it fires.
- **Upgrade path:** `UpgradeOperator` lets its manager (the SAME 3-of-5 ops Safe) instantly `upgradeToAndCall` exactly two UUPS proxies — `GuardianUpgradeable` and `RedemptionOperator`, both sitting on reUSD's pause and redemption surfaces — with zero on-chain delay or review window. A third UUPS proxy, `TreasuryManager`, has NO such grant and can only be upgraded via the slow 8-day Voter path.
- **Emergency controls:** the Guardian (`onlyGuardian` == the 3-of-5 ops Safe) can `pauseAllPairs`/`pausePair` — which zeroes borrowLimit to freeze NEW mint across all markets but never blocks repay, redeem, or liquidate, so collateral is NEVER trapped — plus gate redemption, freeze InsurancePool exits, veto proposals, and repoint UNGUARDED registry keys. The two most dangerous keys, `REUSD_ORACLE` and `VOTER`, sit on the `guardedRegistryKeys` allowlist and only Core can un-guard them.
- **Oracle layer:** reUSD's canonical peg price is the FULLY IMMUTABLE `ReusdOracle` (zero setters) — a Curve reUSD/scrvUSD pool EMA floored at 1 − the redemption fee (~0.99 at the current 1%, so the floor moves with `baseRedemptionFee`) — selected by the guarded `REUSD_ORACLE` registry key (Core-only, 8-day, no fast grant). Per-PAIR collateral oracles are separate and Core-settable (8-day); the live default `BasicVaultOracle` is a bare `IERC4626.convertToAssets` read with only an UPPER bound, no lower bound or TWAP — the exact ERC-4626 exchange-rate class exploited in June 2025. Note two instant single-actor bypasses of the oracle guard, both the 3-of-5 Safe: setVoter, and a hostile GuardianUpgradeable upgrade that drops the guard check then repoints the key.
- **Peg defense:** `RedemptionHandler` is reUSD's only PROTOCOL-DRIVEN burn path outside liquidation — it has no mint, and the token's own `Stablecoin.burn()` is a separate permissionless holder self-burn. `redeemFromPair` is permissionless only when reUSD trades below ~0.985 (peg guard active by default); above that it is restricted to the `RedemptionOperator` arb proxy. Core can disable the permissionless guard entirely — INSTANT via a live Guardian wildcard grant — or raise the base redemption fee up to 100% (8-day), which would make redemption worthless.
- **Bad-debt backstop:** the `InsurancePool` holds reUSD deposits as first-loss capital; on CDP bad debt the `LiquidationHandler` burns pool reUSD (`burnAssets`) down to a `minimumHeldAssets` floor (live 10,000 reUSD). If bad debt exceeds the pool it is socialized to reUSD holders — which is exactly what the June-2025 exploit forced.
- **June-2025 exploit:** a freshly deployed, near-empty market was drained for ~$9.5M via an ERC-4626 donation attack — the attacker inflated the empty collateral vault's share price so `1e36/price` FLOORED TO ZERO, making every position look infinitely solvent, then borrowed ~$10M reUSD against ~1 wei of collateral. The loss was socialized: $6.0M from the Insurance Pool, ~$2.86M in donations, and a $1.13M Yearn loan, fully repaid by Aug 2025. Prior audits had the vulnerable code in scope and none flagged it — which is why per-pair collateral-oracle sanity bounds are the first thing to verify on any newly added market.
- **The sreUSD vault:** an ERC-4626 auto-compounding wrapper over reUSD (also a LayerZero OFT) with NO supply capability anywhere — no privileged share-mint, no reUSD mint/burn access. Its reward rate is Core-capped (`setMaxDistributionPerSecondPerAsset`, live ~20% APR) and its linear 7-day reward stream is specifically designed to resist the ERC-4626 donation-manipulation class.
- **Cross-chain surface:** reUSD (and sreUSD) inherit LayerZero's `OFT` and are wired to the live LZ v2 mainnet endpoint, but have ZERO peers configured on every tested chain — the bridge is scaffolded and NOT exercisable today. Core (the token owner) can activate a peer plus DVN config unilaterally in one tx with no additional governance step, so treat a first `setPeer` event as a supply-surface change to review.
- **RSUP stack:** the GovToken (RSUP), `EmissionsController`, `GovStaker` and GovStakerEscrow contracts mint and stake RSUP, NOT reUSD. The scanner's 'supply authority chain' and 'no-timelock' findings on GovToken, EmissionsController and GovStaker that appear to link them to reUSD are transitive getter-pointer over-scan edges that terminate at reUSD's `operators` mapping WITHOUT conferring mint rights (GovStakerEscrow carries no such finding). Keep this stack out of the reUSD supply story except to note it is not a reUSD mint lever.
- **Audit history:** pre-launch audits by yAudit/Electisec (Jan 2025) and ChainSecurity (Mar 2025); post-exploit re-audits (ChainSecurity v2, Electisec Inflation-Fixes) committed 2025-08-20; sreUSD-specific audits from both firms committed 2025-10-16. No audit found from Trail of Bits, Code4rena, Sherlock, or Cantina — and no pre-launch audit flagged the June-2025 donation vector.

</details>

<details>
<summary><strong>📖 Terms</strong> <em>— recurring protocol jargon</em></summary>

- **Core / CoreOwnable** — The Prisma-style authority hub (0xc07e…). Every Resupply contract resolves owner() / onlyOwner to it, and Core.execute(target, data) is the universal privileged-action dispatcher with zero delay of its own.
- **Voter** — The DAO governance contract (0x11111111…) that holds unrestricted Core.execute — the supreme authority, reached only through the 8-day vote + executionDelay proposal path.
- **operatorPermissions** — Core's per-(caller, target, selector) grant map. A set grant lets a non-Voter caller invoke one specific function via Core.execute instantly, bypassing the Voter's 8-day path.
- **wildcard grant (target = 0x0)** — An operatorPermissions grant whose target is the zero address — valid against ANY contract for that selector, broader than a single-target grant.
- **AuthHook** — An optional Core hook that can attach a delay or conditions to an operator grant. None is set on this deployment, so the operator grants are instant.
- **UUPS** — An upgrade pattern where the upgrade entrypoint (upgradeToAndCall) lives in the implementation contract itself, so replacing the impl can also remove its own guards.
- **OFT (Omnichain Fungible Token)** — LayerZero's cross-chain token standard. reUSD is an OFT, so a configured peer on another chain is a cross-chain mint source. It currently has 0 peers (dormant).
- **guardedRegistryKeys** — A set of Registry keys the Guardian's normal setRegistryAddress route refuses to repoint. The check lives inside the Guardian implementation, so a Guardian upgrade can drop it.
- **regPair gate / registeredPairs** — The Registry check that only registered CDP pairs may mint reUSD — distinct from the generic setAddress key map.

</details>

<a id="sec-off-chain-deps"></a>
<details>
<summary><strong>🌐 Off-Chain Dependencies</strong> — risk that extends beyond the chain</summary>

> *1 control surface extends beyond on-chain observability. Each entry shows what the analyst CAN observe (on-chain signal) alongside the off-chain dependency it relies on.*

- **1. governance** 🟠 — reUSD is otherwise a fully on-chain-collateralized CDP: custody, oracle, backing, redemption, and compliance are all on-chain (verified cycle-3). Its ONE off-chain dependency is the key custody and independence of the 5 signers behind the 3-of-5 ops Safe. That custody is load-bearing because the same Safe holds instant, un-timelocked on-chain authority — Core.setVoter, the UpgradeOperator manager role (2 of 3 UUPS proxies), and the sole approved-deployer slot — with no on-chain recovery; those levers are themselves graded on-chain in critical_parameters #1/#2. The off-chain unknown — and the reason this belongs here rather than only in the on-chain lever list — is whether the 5 keys are independently and competently held, which cannot be observed on-chain (team_questions Q-01).
    - *On-chain signal:* Core.setVoter grant: operatorPermissions[0xfe11a5009f...][Core][0x4bc2a657]==true, no AuthHook, set block 23225032. UpgradeOperator.manager()==0xfe11a5009f... ResupplyPairDeployer.approvedDeployers[0xfe11a5009f...]==true. Monitor Core OperatorSet events targeting selector 0x4bc2a657, and VoterSet events on Core.
    - *Off-chain dependency:* The 5 signers behind Safe 0xfe11a5009f2121622271e7dd0fd470264e076af6 (3-of-5 threshold). One resolves to ENS c2tp.eth (0xAAc0aa431c237C2C0B5f041c8e59B3f1a43aC78F, plausibly Convex-affiliated — same identity credited in the June-2025 exploit recovery). The other 4 (0x4D1b5627..., 0xBd0a74e5..., 0x1101c94c..., 0x1B1D2806...) carry no public label found this cycle — independence/custody practices not confirmed (team_questions Q-01).
    - *Recovery path:* No on-chain recovery once the Safe exercises setVoter — it is instant and un-timelocked by design. The only mitigants are the 3-of-5 quorum requirement and (for reUSD mint specifically) the fact that reUSD.setOperator is itself also Core-gated, so the Safe would need a second Core.execute call after seizing voter. No emergency pause exists on this specific vector.

</details>

<a id="sec-market-ceilings"></a>
<details>
<summary><strong>📊 Registered CDP Markets</strong> <span class="section-sub">per-market supply caps</span></summary>

> *19 registered market(s), 10 active. Aggregate borrowlimit (reusd) = **634.9M** (max mint capacity); aggregate borrowed = **32.1M** (**5%** utilized) — live total reUSD exposure. Enumerated live each scan; newly-registered markets and ceiling changes appear automatically and are flagged in Changes-Since.*

| # | Market | Name | Age | borrowLimit (reUSD) | Borrowed | Utilization |
|---:|---|---|---:|---:|---:|---:|
| 0 | [`0xC5184cccf85b81EDdc661330acB3E41bd89F34A1`](https://etherscan.io/address/0xC5184cccf85b81EDdc661330acB3E41bd89F34A1) | Resupply Pair (CurveLend: crvUSD/sfrxUSD) - 1 | 1.4y | 50.0M | 15.3M | 30.6% |
| 1 | [`0x08064A8eEecf71203449228f3eaC65E462009fdF`](https://etherscan.io/address/0x08064A8eEecf71203449228f3eaC65E462009fdF) | Resupply Pair (CurveLend: crvUSD/sDOLA) - 1 *(inactive)* | 1.4y | 0 | 145 | — |
| 2 | [`0x39Ea8e7f44E9303A7441b1E1a4F5731F1028505C`](https://etherscan.io/address/0x39Ea8e7f44E9303A7441b1E1a4F5731F1028505C) | Resupply Pair (CurveLend: crvUSD/sUSDe) - 1 | 1.4y | 45.0M | 1.8M | 4.1% |
| 3 | [`0x3b037329Ff77B5863e6a3c844AD2a7506ABe5706`](https://etherscan.io/address/0x3b037329Ff77B5863e6a3c844AD2a7506ABe5706) | Resupply Pair (CurveLend: crvUSD/USDe) - 1 *(inactive)* | 1.4y | 0 | 429 | — |
| 4 | [`0x22B12110f1479d5D6Fd53D0dA35482371fEB3c7e`](https://etherscan.io/address/0x22B12110f1479d5D6Fd53D0dA35482371fEB3c7e) | Resupply Pair (CurveLend: crvUSD/tBTC) - 1 *(inactive)* | 1.4y | 0 | 0 | — |
| 5 | [`0x2d8ecd48b58e53972dBC54d8d0414002B41Abc9D`](https://etherscan.io/address/0x2d8ecd48b58e53972dBC54d8d0414002B41Abc9D) | Resupply Pair (CurveLend: crvUSD/WBTC) - 1 | 1.4y | 100.0M | 3.8M | 3.8% |
| 6 | [`0xCF1deb0570c2f7dEe8C07A7e5FA2bd4b2B96520D`](https://etherscan.io/address/0xCF1deb0570c2f7dEe8C07A7e5FA2bd4b2B96520D) | Resupply Pair (CurveLend: crvUSD/WETH) - 1 | 1.4y | 100.0M | 422,720 | 0.4% |
| 7 | [`0x4A7c64932d1ef0b4a2d430ea10184e3B87095E33`](https://etherscan.io/address/0x4A7c64932d1ef0b4a2d430ea10184e3B87095E33) | Resupply Pair (CurveLend: crvUSD/wstETH) - 1 | 1.4y | 100.0M | 1.1M | 1.1% |
| 8 | [`0x3F2b20b8E8Ce30bb52239d3dFADf826eCFE6A5f7`](https://etherscan.io/address/0x3F2b20b8E8Ce30bb52239d3dFADf826eCFE6A5f7) | Resupply Pair (Fraxlend: frxUSD/sfrxETH) - 1 | 1.4y | 50.0M | 1.2M | 2.4% |
| 9 | [`0x212589B06EBBA4d89d9deFcc8DDc58D80E141EA0`](https://etherscan.io/address/0x212589B06EBBA4d89d9deFcc8DDc58D80E141EA0) | Resupply Pair (Fraxlend: frxUSD/sUSDe) - 1 | 1.4y | 15.0M | 175,636 | 1.2% |
| 10 | [`0x55c49c707aA0Ad254F34a389a8dFd0d103894aDb`](https://etherscan.io/address/0x55c49c707aA0Ad254F34a389a8dFd0d103894aDb) | Resupply Pair (Fraxlend: frxUSD/WBTC) - 1 *(inactive)* | 1.4y | 0 | 0 | — |
| 11 | [`0x24CCBd9130ec24945916095eC54e9acC7382c864`](https://etherscan.io/address/0x24CCBd9130ec24945916095eC54e9acC7382c864) | Resupply Pair (Fraxlend: frxUSD/scrvUSD) - 1 | 1.4y | 50.0M | 101,080 | 0.2% |
| 12 | [`0xb5575Fe3d3b7877415A166001F67C2Df94D4e6c1`](https://etherscan.io/address/0xb5575Fe3d3b7877415A166001F67C2Df94D4e6c1) | Resupply Pair (Fraxlend: frxUSD/WBTC) - 2 | 1.4y | 100.0M | 147,609 | 0.1% |
| 13 | [`0x27AB448a75d548ECfF73f8b4F36fCc9496768797`](https://etherscan.io/address/0x27AB448a75d548ECfF73f8b4F36fCc9496768797) | Resupply Pair (CurveLend: crvUSD/sDOLA) - 2 *(inactive)* | 1.3y | 0 | 268,088 | — |
| 14 | [`0x57E69699381a651Fb0BBDBB31888F5D655Bf3f06`](https://etherscan.io/address/0x57E69699381a651Fb0BBDBB31888F5D655Bf3f06) | Resupply Pair (CurveLend: crvUSD/sUSDS) - 1 *(inactive)* | 1.2y | 0 | 0 | — |
| 15 | [`0xF4A6113FbD71Ac1825751A6fe844A156f60C83EF`](https://etherscan.io/address/0xF4A6113FbD71Ac1825751A6fe844A156f60C83EF) | Resupply Pair (CurveLend: crvUSD/tBTC) - 2 *(inactive)* | 1.2y | 0 | 5 | — |
| 16 | [`0x6e90c85a495d54c6d7E1f3400FEF1f6e59f86bd6`](https://etherscan.io/address/0x6e90c85a495d54c6d7E1f3400FEF1f6e59f86bd6) | Resupply Pair (CurveLend: crvUSD/wstUSR) - 1 *(inactive)* | 1.1y | 0 | 0 | — |
| 17 | [`0xD42535Cda82a4569BA7209857446222ABd14A82c`](https://etherscan.io/address/0xD42535Cda82a4569BA7209857446222ABd14A82c) | Resupply Pair (CurveLend: crvUSD/fxSAVE) - 1 *(inactive)* | 10mo | 0 | 96,310 | — |
| 18 | [`0x2fdD3c0a682e5774205F0F6D3eD3c9D1b9Cb9413`](https://etherscan.io/address/0x2fdD3c0a682e5774205F0F6D3eD3c9D1b9Cb9413) | Resupply Pair (CurveLend: crvUSD/sreUSD) - 1 | 6mo | 24.9M | 7.6M | 30.6% |

</details>

<a id="sec-oracle-surface"></a>
<details>
<summary><strong>🔮 reUSD Oracle Surface</strong> <span class="section-sub">price-source wiring + who can change it</span></summary>

> *Live-read each scan; a repointed feed or retuned delay is flagged in Changes-Since. All repoint levers are Core-only (8-day Voter path); decoder-verified NONE has a fast Core operator grant across all 24 grants (2026-07-22). ⚡ The ops Safe's setVoter grant collapses that 8-day buffer to instant (critical_parameters #1). The functions that change these pointers (setRegistryAddress / setGuardedRegistryKey / setMaxOracleDelay) are listed as levers under Critical Parameters — this section is the live current state, that section is the mutation surface.
*

| Piece | Resolves to | Age | Authority | Delay | Note |
|---|---|---|---|---|---|
| reUSD peg oracle (REUSD_ORACLE) | [`0x3A1E...28e4`](https://etherscan.io/address/0x3A1E320f289eeF2636B6D7Aa5C0f9202ee9928e4) | 5mo | Core setRegistryAddress (8-day Voter); guardedRegistryKey | 8-day (guarded) | Live feed selecting reUSD's price — currently the immutable ReusdOracle 0x3a1e320f (Curve reUSD/scrvUSD EMA). Repointing = changing reUSD's price source. |
| PriceWatcher (PRICE_WATCHER) | [`0xAaaa...9251`](https://etherscan.io/address/0xAaaa0013e2ec451F76816d1e0a02ABA596dd9251) | 11mo | Core setRegistryAddress (8-day Voter) | 8-day | Interest-rate discount watcher (NOT the peg price). Its own oracle() pointer is stale vs REUSD_ORACLE (Q-07). |

</details>

<a id="sec-critical-params"></a>
<details>
<summary><strong>🎚️ Critical Parameter Levers</strong> — the one-tx risk levers to watch</summary>

> *11 on-chain parameter levers that are curated as high-impact for lender-side risk (direct dilution / safety-mechanism closure / authority transfer / oracle repointing). Each entry shows current value, the threshold that triggers the impact, and the role-holder controlling the lever.*

- **1. `setVoter(address newVoter)`** 🔴 on [**Core (0xc07e000044F95655c11fda4cD37F70A94d7e0a7d)**](#c-0xc07e000044f95655c11fda4cd37f70a94d7e0a7d)
    - *Role gate:* onlyCore, reachable via Core.execute by the current voter OR by the ops Safe 0xfe11a5009f... which holds a LIVE, delay-less, hookless operator grant (set block 23225032).
    - *Live current value (as of block 22,807,328):* `0x11111111063874cE8dC6232cb5C1C849359476E6`
    - *Recorded changes:* 7 historical event(s); last setter `0x11111111063874cE8dC6232cb5C1C849359476E6`
    - *Threshold:* One multisig tx (3-of-5 signatures), zero delay, zero governance vote.
    - *Impact:* Reassigns the supreme arbitrary-execute authority. Once voter is seized, the new voter can call Core.execute against ANY target — including reUSD.setOperator (add a new minter) or direct reUSD.mint (Core is reUSD's owner). This bypasses the Voter contract's 8-day proposal/quorum/timelock machinery entirely — the "real" governance timelock is not the actual bottleneck; this operator grant is. Single most dangerous finding in this profile. Multisig-quorum-tempered (3-of-5), not a single-key path, but genuinely instant and un-timelocked.
- **2. `upgradeToAndCall(address target, address newImplementation, bytes data)`** 🔴 on [**UpgradeOperator (0x82ba27ee62fc490f81fefce5ac9c2f238f8b5543)**](#c-0x82ba27ee62fc490f81fefce5ac9c2f238f8b5543)
    - *Role gate:* onlyOwnerOrManager — manager == ops Safe 0xfe11a5009f... (or Core/voter, slow path).
    - *Threshold:* Scoped to exactly two UUPS proxies: GuardianUpgradeable (0xa4745e0b) and RedemptionOperator (0x3f7c15d0). No AuthHook; Core.execute carries no delay.
    - *Impact:* Instant (zero-delay, zero-review-window) logic replacement on two proxies that together control the global pause switch, the redemption guard, registry-pointer repoints, and the exclusive above-peg redemption caller. A malicious/buggy upgrade weaponizes whatever those proxies already hold. ⚠️ CYCLE-3 CATCH: a hostile GuardianUpgradeable impl DROPS the guardedRegistryKeys check (that check lives INSIDE the Guardian impl, so the upgrade removes it) and then uses the Guardian's live setAddress grant on the Registry to repoint REUSD_ORACLE and VOTER — neither is in the Registry's own getProtectedKeys(), so setAddress does NOT revert. THIS is an instant, single-actor (3/5 ops Safe), un-timelocked path to hijack reUSD's price oracle — the June-2025 exploit class — verified on-chain @ block 25626347. The 9 Registry handler keys stay protected even against a malicious upgrade. Bounded to exactly these two targets (no global grant, TreasuryManager excluded); 3-of-5 quorum-tempered. Finding split (decisions[]): GuardianUpgradeable upgrade = CRITICAL (broad + instant oracle reach); RedemptionOperator upgrade = HIGH (bounded, anti-dilutive, on-chain recovery).
- **3. `setOracle(address _newOracle)`** 🟠 on [**ResupplyPair (per-market; e.g. 0xc5184cccf85b81eddc661330acb3e41bd89f34a1)**](#c-0xc5184cccf85b81eddc661330acb3e41bd89f34a1)
    - *Role gate:* onlyOwner (Core). No fast-operator grant found for this selector — Voter's 8-day path is the only route identified.
    - *Threshold:* Live default oracle (BasicVaultOracle) has only an UPPER bound check (<1e22) — no lower bound, no TWAP, no external sanity.
    - *Impact:* Repoints the collateral price source that drives solvency (_isSolvent), liquidation payout, and redemption collateral release. This is the EXACT mechanism class exploited in June 2025 (an ERC-4626 share-price / exchange-rate manipulation). A hostile or buggy oracle can mask insolvent positions (blocking liquidation -> bad debt) or over-release collateral. 8-day DAO-timelock-bound (no instant path found), which is the material difference from the June-2025 incident (that exploited a pre-existing bad oracle DESIGN, not a governance repoint).
- **4. `addPair(address _pairAddress)`** 🟠 on [**ResupplyRegistry (0x10101010e0c3171d894b71b3400668af311e7d94)**](#c-0x10101010e0c3171d894b71b3400668af311e7d94)
    - *Role gate:* onlyOwner (Core). Voter's 8-day path only — PairAdder's intended fast-operator helper is on-chain non-functional (0 executions).
    - *Threshold:* N/A — binary registration; each newly registered pair inherits full mint rights bounded only by its own borrowLimit.
    - *Impact:* The confer-mint lever: registering a pair grants it the ability to pass Registry.mint()'s regPair gate and inflate reUSD supply. The ultimate dilution-ENABLING lever in the protocol, but 8-day DAO-timelock-bound.
- **5. `setPairBorrowLimitRamp(address _pair, uint256 _newBorrowLimit, uint256 _endTime) / updatePairBorrowLimit(address _pair)`** 🟠 on [**BorrowLimitController (0x0950000465476f4470e74aed93e7dd414012bb7d)**](#c-0x0950000465476f4470e74aed93e7dd414012bb7d)
    - *Role gate:* Ramp target: onlyOwner (Core, 8-day path). Ramp advance: PERMISSIONLESS, but arithmetically bounded within [prevLimit, Core-approved target].
    - *Threshold:* Up-only, >=7-day linear ramp; target capped at uint128.max (not a real ceiling).
    - *Impact:* The per-market reUSD debt-ceiling lever — directly caps how much a market can mint. Cannot be lowered via this path (only via pair.setBorrowLimit directly, also Core-gated) and cannot ramp faster than 7 days once armed. Governance-set target with a permissionless, safely-bounded advance mechanism.
- **6. `setCreationCode(bytes _creationCode)`** 🟠 on [**ResupplyPairDeployer (0x5555555558b7309ecb0fbb23e609ec3c6f74c2ea)**](#c-0x5555555558b7309ecb0fbb23e609ec3c6f74c2ea)
    - *Role gate:* onlyOwner (Core, 8-day path).
    - *Threshold:* No validation beyond deployment success — arbitrary bytecode.
    - *Impact:* Sets the create2 template used for EVERY FUTURE ResupplyPair. Does not affect the 19 already-deployed markets. A malicious/buggy template becomes a market that, once separately registered, could mint reUSD outside normal borrow-limit/oracle invariants. Highest-leverage single function in the deployer trio; 8-day-bound.
- **7. `setRegistryAddress(string _key, address _address)`** 🟠 on [**GuardianUpgradeable (proxy 0xa4745e0b1f40ab3dcfd98f381835de591a8974e3)**](#c-0xa4745e0b1f40ab3dcfd98f381835de591a8974e3)
    - *Role gate:* onlyGuardian == ops Safe 0xfe11a5009f... (instant, zero delay).
    - *Threshold:* DOUBLE-guarded: the Registry's own getProtectedKeys() hard-reverts setAddress on the 9 handler keys (LIQUIDATION/REDEMPTION/INSURANCE/TREASURY/FEE_DEPOSIT/REWARD/STAKER/L2/VEST); the Guardian additionally guardedRegistryKeys-blocks REUSD_ORACLE + VOTER on this normal path.
    - *Impact:* Instant repoint of AUXILIARY registry keys only. The 9 handler pointers (redemption/liquidation/insurance/treasury/fee/reward/staker/l2/vest) are Registry-protected — setAddress hard-reverts on them (getProtectedKeys) — so this lever cannot repoint them. REUSD_ORACLE + VOTER are Guardian-guardedRegistryKeys- blocked on THIS normal path. Cannot register a rogue minting pair (generic setAddress map, distinct from registeredPairs/addPair). A bounded config lever if the 3/5 Safe is compromised. The guardedRegistryKeys block on REUSD_ORACLE/VOTER is bypassable via the Guardian UPGRADE path (critical_parameters #2) — see decisions[] "Guardian-upgrade instant oracle repoint".
- **8. `updateGuardSettings(bool _guardEnabled, uint256 _permissionlessPriceThreshold) / setBaseRedemptionFee(uint256 _fee)`** 🟠 on [**RedemptionHandler (0x5eeb063d0abefbbc78f576e28d762a16b637a025)**](#c-0x5eeb063d0abefbbc78f576e28d762a16b637a025)
    - *Role gate:* setBaseRedemptionFee: onlyOwner (Core), 8-day Voter path. ⚠️ updateGuardSettings: ALSO reachable INSTANTLY — the Guardian holds a live wildcard operatorPermissions grant for updateGuardSettings (0xaec35fdb), invoked via Guardian.updateRedemptionGuardSettings (onlyGuardian == ops Safe) → core.execute. The 3/5 ops Safe can instantly disable below-peg permissionless redemption (3/5-mediated + reversible → HIGH).
    - *Live current value (as of block 24,506,520):* `True`
    - *Recorded changes:* 1 historical event(s); last setter `0xfC4B2a62A06cb2E1C6A743E9aE327Bb16977E4c1`
    - *Threshold:* setBaseRedemptionFee capped at 100% (require _fee<=1e18); updateGuardSettings has no bound (guardEnabled + threshold=0 blocks ALL permissionless redemption).
    - *Impact:* reUSD's peg-arbitrage floor is governance-adjustable: Core can switch off the below-peg permissionless redemption backstop entirely, or raise the redemption fee toward 100% (making it economically worthless). Neither is a supply-dilution lever, but both weaken the mechanism that disciplines reUSD's secondary-market price under stress — material for a FiRM lender pricing reUSD collateral. setBaseRedemptionFee is 8-day-bound; the guard-disable (updateGuardSettings) is INSTANT via the ops-Safe Guardian grant.
- **9. `setRegistryAddress("REUSD_ORACLE", newOracle) — reUSD price-source repoint`** 🟠 on **ResupplyRegistry (0x10101010...) via Core**
    - *Role gate:* onlyOwner (Core) → 8-day Voter path for the NORMAL Guardian setRegistryAddress route (guardedRegistryKeys blocks it). ⚠️ The ops Safe ALSO has an INSTANT path via the Guardian UPGRADE (critical_parameters #2): a malicious Guardian impl drops the guardedRegistryKeys check and repoints REUSD_ORACLE via the Guardian's live setAddress grant (REUSD_ORACLE is NOT in the Registry's protectedKeys). REUSD_ORACLE is Voter-buffered ONLY against the slow path. See decisions[] 'Guardian-upgrade instant oracle repoint'.
    - *Threshold:* Changes which oracle sets reUSD's price. Today the immutable ReusdOracle (Curve EMA); a repoint to a hostile/thin feed mis-prices reUSD everywhere it is used as collateral.
    - *Impact:* THE reUSD price-source lever. 8-day-Voter-bound + guarded → HIGH against the SLOW path only. ⚡ TWO instant collapse paths (both the 3/5 ops Safe): (1) setVoter grant (CRITICAL #1) — seize voter → un-guard → repoint; (2) Guardian upgrade (CRITICAL #2) — strip the guard, repoint via the Guardian's setAddress grant (REUSD_ORACLE not Registry-protected). Live value tracked in the Oracle Surface section.
- **10. `setGuardedRegistryKey(key, bool) — un-guard the REUSD_ORACLE / VOTER protection`** 🟠 on **GuardianUpgradeable (0xa4745e0b) — the guardedRegistryKeys mapping + setGuardedRegistryKey live here (onlyOwner==Core), NOT on the Registry (cycle-3 attribution fix)**
    - *Role gate:* onlyOwner (Core) → 8-day Voter path. No fast-operator grant (decoder-verified across 24 grants).
    - *Threshold:* The meta-lever behind the oracle guard. Un-guarding REUSD_ORACLE removes the block that stops the Guardian ops-Safe from repointing reUSD's price source instantly.
    - *Impact:* Governs whether the REUSD_ORACLE guard even holds — the durability dependency the setRegistryAddress entry above flags. Un-guard → the Guardian (ops Safe) regains an INSTANT setRegistryAddress path to reUSD's oracle. 8-day-bound to invoke → HIGH; ⚡ setVoter collapses it. The REUSD_ORACLE pointer this guards is live-tracked in the Oracle Surface section.
- **11. `setMaxOracleDelay(uint256) — oracle staleness threshold`** 🟠 on **ResupplyPair (per-market) via Core — setMaxOracleDelay is a per-pair ResupplyPair fn, NOT a Registry fn (cycle-3 attribution fix)**
    - *Role gate:* onlyOwner (Core, per-pair ResupplyPair) → 8-day Voter path. (Not a Registry function — the Registry only carries the IResupplyPair interface for typed calls; tracked as a lever, not a live Oracle-Surface read.)
    - *Threshold:* How stale an oracle reading may be before rejection. Too high = accepts stale/manipulable prices; too low = liveness/DoS on valid readings.
    - *Impact:* The freshness guard on reUSD's price feeds — the freshness half of the June-2025-class defense. Mis-set toward stale-tolerant weakens manipulation resistance. 8-day-bound → HIGH; ⚡ setVoter collapses. The feeds this threshold guards are the ones listed live in the Oracle Surface section.

</details>

## 📑 Table of Contents

1. [Analyst Focus Areas](#analyst-focus-areas)
2. Contracts
   - [reUSD ★](#c-0x57ab1e0003f623289cd798b1824be09a793e4bec)
   - [EndpointV2](#c-0x1a44076050125825900e736c501f859c50fe728c)
   - [Core](#c-0xc07e000044f95655c11fda4cd37f70a94d7e0a7d)
   - [ResupplyRegistry](#c-0x10101010e0c3171d894b71b3400668af311e7d94)
   - [Voter](#c-0x11111111063874ce8dc6232cb5c1c849359476e6)
   - [VeCrvOperator](#c-0x03e1538d33778c3711a075af99fc75fcb31ed341)
   - [PairAdder](#c-0x09500002956877b910acec25c4b4dd57950e1d27)
   - [BorrowLimitController](#c-0x0950000465476f4470e74aed93e7dd414012bb7d)
   - [TreasuryManagerUpgradeable](#c-0x4cf97a55d58aad14c493a46c8151a0bfffb10403)
   - [UpgradeOperator](#c-0x82ba27ee62fc490f81fefce5ac9c2f238f8b5543)
   - [GuardianUpgradeable](#c-0xa4745e0b1f40ab3dcfd98f381835de591a8974e3)
   - [ResupplyPairDeployer](#c-0x5555555558b7309ecb0fbb23e609ec3c6f74c2ea)
   - [RedemptionOperator](#c-0x3f7c15d053ab332d194d0040815e466d34387e40)
   - [RedemptionHandler](#c-0x5eeb063d0abefbbc78f576e28d762a16b637a025)
   - [LiquidationHandler](#c-0x88888888c227c36401493ed9f3e3dcc3800b2634)
   - [InsurancePool](#c-0x00000000efe883b3304aff71eacf72dbc3e1b577)
   - [ReusdOracle](#c-0x3a1e320f289eef2636b6d7aa5c0f9202ee9928e4)
   - [PriceWatcher](#c-0xaaaa0013e2ec451f76816d1e0a02aba596dd9251)
   - [GovStaker](#c-0x22222222e9fe38f6f1fc8c61b25228adb4d8b953)
   - [CurveStableSwapNG (0xc522...4F50)](#c-0xc522a6606bba746d7960404f22a3db936b6f4f50)
   - [CurveStableSwapNG (0xed78...A441)](#c-0xed785af60bed688baa8990cd5c4166221599a441)
   - [crvUSD FlashLender](#c-0x26de7861e213a5351f6ed767d00e0839930e9ee1)
   - [GovToken](#c-0x419905009e4656fdc02418c7df35b1e61ed5f726)
   - [GovStakerEscrow](#c-0x9b44e63fc1a252861bf6d4150b58f2de84b5c135)
   - [EmissionsController](#c-0x33333333df05b0d52edd13d230461e5a0f5a4706)
3. [⚡ Authority Concentration](#-authority-concentration)
4. [⛔ Sanctions Screening](#-sanctions-screening)
5. [EOA Exposure Summary](#eoa-exposure-summary)
6. [✅ Scan Integrity](#scan-integrity)

## Analyst Focus Areas &nbsp;&nbsp;☑ Profile reviewed

> **Observational findings — not risk determinations.** Each item below is a focus point for the Risk Analyst to interpret against collateralization context and the protocol's stated intent. Attention levels (CRITICAL / HIGH / LOW) reflect the scanner's heuristic weight — not a realized risk to FiRM. These observations support future risk assessments; they do not constitute one.

> **3 critical-attention** and **50 high-attention** observation(s) across 26 contract(s).

<details>
<summary><strong>View findings (collapsed — profile reviewed)</strong></summary>


### 🔴 CRITICAL (3)

- 🔴 [**Observed: upgrade path has no timelock on GuardianUpgradeable**](#c-0xa4745e0b1f40ab3dcfd98f381835de591a8974e3) — Proxy can be upgraded without a timelock delay — no observation window for users. Verify governance design.
- 🔴 [**Observed: upgrade path has no timelock on RedemptionOperator**](#c-0x3f7c15d053ab332d194d0040815e466d34387e40) — Proxy can be upgraded without a timelock delay — no observation window for users. Verify governance design.
- 🎚️ [**Observed: 11 critical parameter levers (CRITICAL: 2, HIGH: 9)**](#sec-critical-params) — Asset has 11 on-chain parameter levers curated as high-impact for lender-side risk. See the 🎚️ Critical Parameter Levers section for the role gate, current value, threshold, and impact of each. These are singular setters / function calls that flip risk surface in one tx — direct dilution, safety-mechanism closure, authority transfer, or oracle repointing. Verify role-gate identities and threshold distance-to-trigger against current operating posture.

### 🟠 HIGH (50)

- 🟠 [**Observed: Core controls both admin and upgrades**](#c-0xc07e000044f95655c11fda4cd37f70a94d7e0a7d) — `0xc07e000044F95655c11fda4cD37F70A94d7e0a7d` holds admin + upgrade authority across BorrowLimitController, EmissionsController, GovStaker, GovToken, GuardianUpgradeable, InsurancePool, LiquidationHandler, PairAdder, PriceWatcher, RedemptionHandler, RedemptionOperator, ResupplyPairDeployer, ResupplyRegistry, Stablecoin, TreasuryManagerUpgradeable, UpgradeOperator, VeCrvOperator, Voter — single entity controls full stack. Verify governance design.

<details>
<summary>💰 **Observed: 19 role(s) with supply-altering capability** — Supply-altering surface — assess each holder's custody and governance. Expand for all roles (each links to its contract card).</summary>

- 💰 [**`borrowLimitController (Core operator grant)` on Core**](#c-0xc07e000044f95655c11fda4cd37f70a94d7e0a7d) — 1 holder(s) — open the role card for holder identities & admin chain.
- 💰 [**`pairDeployer (Core operator grant)` on Core**](#c-0xc07e000044f95655c11fda4cd37f70a94d7e0a7d) — 1 holder(s) — open the role card for holder identities & admin chain.
- 💰 [**`owner()` on EmissionsController**](#c-0x33333333df05b0d52edd13d230461e5a0f5a4706) — 1 holder(s) — open the role card for holder identities & admin chain.
- 💰 [**`escrow()` on GovStaker**](#c-0x22222222e9fe38f6f1fc8c61b25228adb4d8b953) — 1 holder(s) — open the role card for holder identities & admin chain.
- 💰 [**`endpoint()` on GovToken**](#c-0x419905009e4656fdc02418c7df35b1e61ed5f726) — 1 holder(s) — open the role card for holder identities & admin chain.
- 💰 [**`minter()` on GovToken**](#c-0x419905009e4656fdc02418c7df35b1e61ed5f726) — 1 holder(s) — open the role card for holder identities & admin chain.
- 💰 [**`owner()` on GovToken**](#c-0x419905009e4656fdc02418c7df35b1e61ed5f726) — 1 holder(s) — open the role card for holder identities & admin chain.
- 💰 [**`owner()` on LiquidationHandler**](#c-0x88888888c227c36401493ed9f3e3dcc3800b2634) — 1 holder(s) — open the role card for holder identities & admin chain.
- 💰 [**`owner()` on PairAdder**](#c-0x09500002956877b910acec25c4b4dd57950e1d27) — 1 holder(s) — open the role card for holder identities & admin chain.
- 💰 [**`owner()` on PriceWatcher**](#c-0xaaaa0013e2ec451f76816d1e0a02aba596dd9251) — 1 holder(s) — open the role card for holder identities & admin chain.
- 💰 [**`redemptionOperator()` on RedemptionHandler**](#c-0x5eeb063d0abefbbc78f576e28d762a16b637a025) — 1 holder(s) — open the role card for holder identities & admin chain.
- 💰 [**`registry()` on RedemptionHandler**](#c-0x5eeb063d0abefbbc78f576e28d762a16b637a025) — 1 holder(s) — open the role card for holder identities & admin chain.
- 💰 [**`owner()` on ResupplyPairDeployer**](#c-0x5555555558b7309ecb0fbb23e609ec3c6f74c2ea) — 1 holder(s) — open the role card for holder identities & admin chain.
- 💰 [**`insurancePool` on ResupplyRegistry**](#c-0x10101010e0c3171d894b71b3400668af311e7d94) — 1 holder(s) — open the role card for holder identities & admin chain.
- 💰 [**`liquidationHandler` on ResupplyRegistry**](#c-0x10101010e0c3171d894b71b3400668af311e7d94) — 1 holder(s) — open the role card for holder identities & admin chain.
- 💰 [**`owner()` on ResupplyRegistry**](#c-0x10101010e0c3171d894b71b3400668af311e7d94) — 1 holder(s) — open the role card for holder identities & admin chain.
- 💰 [**`endpoint()` on Stablecoin**](#c-0x57ab1e0003f623289cd798b1824be09a793e4bec) — 1 holder(s) — open the role card for holder identities & admin chain.
- 💰 [**`operators` on Stablecoin**](#c-0x57ab1e0003f623289cd798b1824be09a793e4bec) — 1 holder(s) — open the role card for holder identities & admin chain.
- 💰 [**`owner()` on Stablecoin**](#c-0x57ab1e0003f623289cd798b1824be09a793e4bec) — 1 holder(s) — open the role card for holder identities & admin chain.

</details>


<details>
<summary>⏸️ **Observed: 4 role(s) with pause capability** — Pause surface — assess pause-authority governance. Expand for all roles (each links to its contract card).</summary>

- ⏸️ [**`guardian (Core operator grant)` on Core**](#c-0xc07e000044f95655c11fda4cd37f70a94d7e0a7d) — 1 holder(s) — open the role card for holder identities & admin chain.
- ⏸️ [**`guardian()` on GuardianUpgradeable**](#c-0xa4745e0b1f40ab3dcfd98f381835de591a8974e3) — 1 holder(s) — open the role card for holder identities & admin chain.
- ⏸️ [**`owner()` on RedemptionHandler**](#c-0x5eeb063d0abefbbc78f576e28d762a16b637a025) — 1 holder(s) — open the role card for holder identities & admin chain.
- ⏸️ [**`redemptionHandler` on ResupplyRegistry**](#c-0x10101010e0c3171d894b71b3400668af311e7d94) — 1 holder(s) — open the role card for holder identities & admin chain.

</details>

- 🔗 [**Observed: supply authority chain on ResupplyPairDeployer**](#c-0x5555555558b7309ecb0fbb23e609ec3c6f74c2ea) — Chain: Core → `pairDeployer (Core operator grant)` → ResupplyPairDeployer. Controlled by: `owner()`. Assess custody — compromise of this chain could affect root token supply.
- 🔗 [**Observed: supply authority chain on EmissionsController**](#c-0x33333333df05b0d52edd13d230461e5a0f5a4706) — Chain: GovToken → `minter()` → ResupplyRegistry → `insurancePool` → Stablecoin → `operators` → EmissionsController. Controlled by: `owner()`. Assess custody — compromise of this chain could affect root token supply.
- 🔗 [**Observed: supply authority chain on GovToken**](#c-0x419905009e4656fdc02418c7df35b1e61ed5f726) — Chain: ResupplyRegistry → `insurancePool` → Stablecoin → `operators` → GovToken. Controlled by: `endpoint()`, `minter()`, `owner()`. Assess custody — compromise of this chain could affect root token supply.

<details>
<summary>🔓 **11 No-Timelock-in-admin-chain supply finding(s) across 6 contract(s)** — Supply-capable roles with no Timelock in the direct admin chain — a supply-altering call can land in one block once the holder's governance threshold is met. Expand to review each role + holder and verify whether it is a real supply path or a transitive getter-pointer edge. FiRM-lens: no analyst-observable buffer between decision and action.</summary>

- ⚠️ [**No Timelock in admin chain: `endpoint()` on Stablecoin**](#c-0x57ab1e0003f623289cd798b1824be09a793e4bec) — `endpoint()` has SUPPLY capability and is held by: `0x1a44...728c` (Contract). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `operators` on Stablecoin**](#c-0x57ab1e0003f623289cd798b1824be09a793e4bec) — `operators` has SUPPLY capability and is held by: `0x1010...7D94` (Contract). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `borrowLimitController (Core operator grant)` on Core**](#c-0xc07e000044f95655c11fda4cd37f70a94d7e0a7d) — `borrowLimitController (Core operator grant)` has SUPPLY capability and is held by: `0x0950...BB7D` (Contract). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `pairDeployer (Core operator grant)` on Core**](#c-0xc07e000044f95655c11fda4cd37f70a94d7e0a7d) — `pairDeployer (Core operator grant)` has SUPPLY capability and is held by: `0x5555...C2Ea` (Contract). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `liquidationHandler` on ResupplyRegistry**](#c-0x10101010e0c3171d894b71b3400668af311e7d94) — `liquidationHandler` has SUPPLY capability and is held by: `0x8888...2634` (Contract). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `insurancePool` on ResupplyRegistry**](#c-0x10101010e0c3171d894b71b3400668af311e7d94) — `insurancePool` has SUPPLY capability and is held by: `0x0000...b577` (Contract). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `redemptionOperator()` on RedemptionHandler**](#c-0x5eeb063d0abefbbc78f576e28d762a16b637a025) — `redemptionOperator()` has SUPPLY capability and is held by: `0x3F7C...7E40` (Contract). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `registry()` on RedemptionHandler**](#c-0x5eeb063d0abefbbc78f576e28d762a16b637a025) — `registry()` has SUPPLY capability and is held by: `0x1010...7D94` (Contract). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `escrow()` on GovStaker**](#c-0x22222222e9fe38f6f1fc8c61b25228adb4d8b953) — `escrow()` has SUPPLY capability and is held by: `0x9B44...c135` (Contract). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `endpoint()` on GovToken**](#c-0x419905009e4656fdc02418c7df35b1e61ed5f726) — `endpoint()` has SUPPLY capability and is held by: `0x1a44...728c` (Contract). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `minter()` on GovToken**](#c-0x419905009e4656fdc02418c7df35b1e61ed5f726) — `minter()` has SUPPLY capability and is held by: `0x3333...4706` (Contract). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.

</details>

- 🟠 [**Observed: upgrade altered privileged surface on GuardianUpgradeable**](#c-0xa4745e0b1f40ab3dcfd98f381835de591a8974e3) — Upgrade on 2026-03-16 (+1/-0 fn) [+PAUSE]. Review the Upgrade History table to verify intent.

<details>
<summary>🔄 **4 volatile parameter(s) observed across 3 contract(s) (≥5 historical changes each)** — Operational tempo signal — high-velocity setters indicate active governance maintenance, oracle keepers, or routinely-tuned risk parameters. Expand to review each parameter's change count and current value; assess against the protocol's stated intent.</summary>

- 🔄 [**Observed: volatile parameter `voter` on Core**](#c-0xc07e000044f95655c11fda4cd37f70a94d7e0a7d) — `setVoter(address)` changed 7 times. Current value: `0x11111111063874cE8dC6232cb5C1C849359476E6`. Assess change pattern.
- 🔄 [**Observed: volatile parameter `redemptionHandler` on ResupplyRegistry**](#c-0x10101010e0c3171d894b71b3400668af311e7d94) — `setRedemptionHandler(address _newAddress)` changed 5 times. Current value: `0x5eeB063d0abefBBc78F576E28d762a16b637A025`. Assess change pattern.
- 🔄 [**Observed: volatile parameter `addPair` on ResupplyRegistry**](#c-0x10101010e0c3171d894b71b3400668af311e7d94) — `addPair(address _pairAddress)` changed 19 times. Current value: ``. Assess change pattern.
- 🔄 [**Observed: volatile parameter `pausePair` on GuardianUpgradeable**](#c-0xa4745e0b1f40ab3dcfd98f381835de591a8974e3) — `pausePair(address pair)` changed 8 times. Current value: ``. Assess change pattern.

</details>

- 🌐 [**Observed: 1 off-chain control dependency (governance)**](#sec-off-chain-deps) — Asset has 1 control surface(s) that extend beyond on-chain observability. See the 🌐 Off-Chain Dependencies section for each kind, the on-chain signal the analyst can monitor, the off-chain dependency it relies on, and the recovery path if the off-chain piece fails. Cross-reference against the protocol's stated trust model.
- 🟠 [**Observed: instant Core operator grant `upgradeToAndCall` to 0x82ba...5543 on Core**](#c-0xc07e000044f95655c11fda4cd37f70a94d7e0a7d) — `0x82ba27ee62Fc490f81feFCE5AC9C2f238F8b5543` (UpgradeOperator) holds a live `operatorPermissions` grant to call `upgradeToAndCall(address,bytes)` on 0x3F7C...7E40 via `Core.execute` — an authority-critical selector, no authHook, and no timelock on the Core execute path, so it lands in a single tx. FiRM-lens: no analyst-observable buffer between decision and action; grade custody of this holder. Final severity is set analyst-side in critical_parameters.
- 🟠 [**Observed: instant Core operator grant `setVoter` to 0xFE11...6af6 on Core**](#c-0x11111111063874ce8dc6232cb5c1c849359476e6) — `0xFE11a5009f2121622271e7dd0FD470264e076af6` (Gnosis Safe 3/5) holds a live `operatorPermissions` grant to call `setVoter(address)` on 0xc07e...0a7d via `Core.execute` — an authority-critical selector, no authHook, and no timelock on the Core execute path, so it lands in a single tx. FiRM-lens: no analyst-observable buffer between decision and action; grade custody of this holder. Final severity is set analyst-side in critical_parameters.

### 🟢 LOW (9)

- 🟢 [**Observed: 8-day Voter-buffered upgrade path on TreasuryManagerUpgradeable**](#c-0x4cf97a55d58aad14c493a46c8151a0bfffb10403) — Upgrades are owned by the Prisma Core, whose `execute` path carries no delay — but no `operatorPermissions` grant exists for this proxy's upgrade selector, so the only route is a Voter proposal (>=8-day vote + executionDelay). That voting window is the analyst-observable buffer; no separate TimelockController is present. Note: the ops-Safe `setVoter` grant can collapse this buffer to a single tx — surfaced separately as the Core `setVoter` grant / critical_parameters #1.
- 🟢 [**Supply authority gated by Voter buffer: `owner()` on Stablecoin**](#c-0x57ab1e0003f623289cd798b1824be09a793e4bec) — `owner()` has SUPPLY capability owned by the Prisma Core, but no `operatorPermissions` grant exists for its selector(s) — the only route is a Voter proposal (>=8-day vote + executionDelay), a real analyst-observable buffer even though `Core.execute` itself is instant. No separate TimelockController is present — the voting period IS the buffer. Note: the ops-Safe `setVoter` grant can collapse it to a single tx (surfaced separately as the Core `setVoter` grant / critical_parameters #1).
- 🟢 [**Supply authority gated by Voter buffer: `owner()` on ResupplyRegistry**](#c-0x10101010e0c3171d894b71b3400668af311e7d94) — `owner()` has SUPPLY capability owned by the Prisma Core, but no `operatorPermissions` grant exists for its selector(s) — the only route is a Voter proposal (>=8-day vote + executionDelay), a real analyst-observable buffer even though `Core.execute` itself is instant. No separate TimelockController is present — the voting period IS the buffer. Note: the ops-Safe `setVoter` grant can collapse it to a single tx (surfaced separately as the Core `setVoter` grant / critical_parameters #1).
- 🟢 [**Supply authority gated by Voter buffer: `owner()` on PairAdder**](#c-0x09500002956877b910acec25c4b4dd57950e1d27) — `owner()` has SUPPLY capability owned by the Prisma Core, but no `operatorPermissions` grant exists for its selector(s) — the only route is a Voter proposal (>=8-day vote + executionDelay), a real analyst-observable buffer even though `Core.execute` itself is instant. No separate TimelockController is present — the voting period IS the buffer. Note: the ops-Safe `setVoter` grant can collapse it to a single tx (surfaced separately as the Core `setVoter` grant / critical_parameters #1).
- 🟢 [**Supply authority gated by Voter buffer: `owner()` on ResupplyPairDeployer**](#c-0x5555555558b7309ecb0fbb23e609ec3c6f74c2ea) — `owner()` has SUPPLY capability owned by the Prisma Core, but no `operatorPermissions` grant exists for its selector(s) — the only route is a Voter proposal (>=8-day vote + executionDelay), a real analyst-observable buffer even though `Core.execute` itself is instant. No separate TimelockController is present — the voting period IS the buffer. Note: the ops-Safe `setVoter` grant can collapse it to a single tx (surfaced separately as the Core `setVoter` grant / critical_parameters #1).
- 🟢 [**Supply authority gated by Voter buffer: `owner()` on LiquidationHandler**](#c-0x88888888c227c36401493ed9f3e3dcc3800b2634) — `owner()` has SUPPLY capability owned by the Prisma Core, but no `operatorPermissions` grant exists for its selector(s) — the only route is a Voter proposal (>=8-day vote + executionDelay), a real analyst-observable buffer even though `Core.execute` itself is instant. No separate TimelockController is present — the voting period IS the buffer. Note: the ops-Safe `setVoter` grant can collapse it to a single tx (surfaced separately as the Core `setVoter` grant / critical_parameters #1).
- 🟢 [**Supply authority gated by Voter buffer: `owner()` on PriceWatcher**](#c-0xaaaa0013e2ec451f76816d1e0a02aba596dd9251) — `owner()` has SUPPLY capability owned by the Prisma Core, but no `operatorPermissions` grant exists for its selector(s) — the only route is a Voter proposal (>=8-day vote + executionDelay), a real analyst-observable buffer even though `Core.execute` itself is instant. No separate TimelockController is present — the voting period IS the buffer. Note: the ops-Safe `setVoter` grant can collapse it to a single tx (surfaced separately as the Core `setVoter` grant / critical_parameters #1).
- 🟢 [**Supply authority gated by Voter buffer: `owner()` on GovToken**](#c-0x419905009e4656fdc02418c7df35b1e61ed5f726) — `owner()` has SUPPLY capability owned by the Prisma Core, but no `operatorPermissions` grant exists for its selector(s) — the only route is a Voter proposal (>=8-day vote + executionDelay), a real analyst-observable buffer even though `Core.execute` itself is instant. No separate TimelockController is present — the voting period IS the buffer. Note: the ops-Safe `setVoter` grant can collapse it to a single tx (surfaced separately as the Core `setVoter` grant / critical_parameters #1).
- 🟢 [**Supply authority gated by Voter buffer: `owner()` on EmissionsController**](#c-0x33333333df05b0d52edd13d230461e5a0f5a4706) — `owner()` has SUPPLY capability owned by the Prisma Core, but no `operatorPermissions` grant exists for its selector(s) — the only route is a Voter proposal (>=8-day vote + executionDelay), a real analyst-observable buffer even though `Core.execute` itself is instant. No separate TimelockController is present — the voting period IS the buffer. Note: the ops-Safe `setVoter` grant can collapse it to a single tx (surfaced separately as the Core `setVoter` grant / critical_parameters #1).

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
<a id="c-0x57ab1e0003f623289cd798b1824be09a793e4bec"></a>
## Stablecoin `0x57aB1E0003F623289CD798B1824Be09a793e4Bec`

*6 roles · 4 members · 11 functions*

🔒 **Immutable References:** `oApp()` → reUSD (Stablecoin), `core()` → Core

#### 🌉 LayerZero v2 — Cross-chain Verifier (DVN) Config

> Endpoint `0x1a44...728c` · 0 peer(s)

> _No peers configured — OFT surface exists but is dormant._

### 🟠 `endpoint()`

**Privileged write functions:**  
**Capabilities:** 💰 **SUPPLY**
- `send(SendParam calldata _sendParam, MessagingFee calldata _fee, address _refundAddress)` — Executes the send operation. - nativeFee: The native fee. `[SUPPLY]`

**Members (1):**

| Address | Name / Type | Risk | Granted | Source | Details |
|---|---|---|---|---|---|
| `0x1a44076050125825900e736c501f859c50fE728c` | [↳ EndpointV2](#c-0x1a44076050125825900e736c501f859c50fe728c) | 🟠 HIGH | — | Storage only |  |

### 🟠 `operators`

**Hash:** `bfs_seed:operators`  
**Privileged write functions:**  
**Capabilities:** 💰 **SUPPLY**
- `operators` — ResupplyRegistry — the SOLE reUSD mint operator (reUSD.operators[Registry]==true, SetOperator event block 22034895, never changed). All 19 ResupplyPair CDP markets mint reUSD by routing through this contract's `mint()` (regPair gate); Registry itself is the BFS root that unlocks InsurancePool, RedemptionHandler, LiquidationHandler, GuardianUpgradeable, UpgradeOperator, both oracles, BorrowLimitController, PairAdder, ResupplyPairDeployer, and all 19 pairs.
 `[SUPPLY]`

**Members (1):**

| Address | Name / Type | Risk | Granted | Source | Details |
|---|---|---|---|---|---|
| `0x10101010E0C3171D894B71B3400668aF311e7D94` | [↳ ResupplyRegistry](#c-0x10101010e0c3171d894b71b3400668af311e7d94) | 🟠 HIGH | — | Storage only |  |

### 🟠 `owner()`

**Privileged write functions:**  
**Capabilities:** 💰 **SUPPLY**
- `setOperator(address _operator, bool _valid)`
- `mint(address _to, uint256 _amount)` — (auto) Create new tokens, increasing total supply `[SUPPLY]`
- `renounceOwnership()` — Leaves the contract without owner. It will not be possible to call `onlyOwner` functions. Can only be called by the current owner.
- `transferOwnership(address newOwner)` — Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner.
- `setMsgInspector(address _msgInspector)` — Sets the message inspector address for the OFT. This is an optional contract that can be used to inspect both 'message' and 'options'.
- `setEnforcedOptions(EnforcedOptionParam[] calldata _enforcedOptions)` — Sets the enforced options for specific endpoint and message type combinations. Only the owner/admin of the OApp can call this function.
- `setPreCrime(address _preCrime)` — Sets the preCrime contract address. /
- `setPeer(uint32 _eid, bytes32 _peer)` — Sets the peer address (OApp instance) for a corresponding endpoint. Only the owner/admin of the OApp can call this function.
- `setDelegate(address _delegate)` — Sets the delegate address for the OApp. Only the owner/admin of the OApp can call this function.

**Members (1):**

| Address | Name / Type | Risk | Granted | Source | Details |
|---|---|---|---|---|---|
| `0xc07e000044F95655c11fda4cD37F70A94d7e0a7d` | [↳ Core](#c-0xc07e000044f95655c11fda4cd37f70a94d7e0a7d) | 🟠 HIGH | — | Storage+Events |  |

#### 🔧 Permissioned Parameters

**`msgInspector`** ❄️ **DORMANT**

> This parameter has never been changed since deployment.

| Field | Value |
|---|---|
| Current Value | `0x0000000000000000000000000000000000000000` |
| Setter | `setMsgInspector(address _msgInspector)` |
| Gated by | `owner()` |
| Tags | — |
| Last changed | — |
| Changed by | — |
| Total changes | 0 ❄️ |

**`operators`** *(per-asset)*

| Asset | Current Value |
|---|---|
| ResupplyRegistry `0x1010...7D94` | `True` |

| Field | Value |
|---|---|
| Setter | `setOperator(address _operator, bool _valid)` |
| Gated by | `owner()` |
| Tags | — |
| Last changed | 2025-03-13 |
| Changed by | `0x1101...A9D4` (EOA) |
| Total changes | 1 |

**Recent changes:**

| # | Asset | Value | Set By | Date |
|---|---|---|---|---|
| 1 | ResupplyRegistry | `—` | `0x1101...A9D4` (EOA) | 2025-03-13 |

**`preCrime`** ❄️ **DORMANT**

> This parameter has never been changed since deployment.

| Field | Value |
|---|---|
| Current Value | `0x0000000000000000000000000000000000000000` |
| Setter | `setPreCrime(address _preCrime)` |
| Gated by | `owner()` |
| Tags | — |
| Last changed | — |
| Changed by | — |
| Total changes | 0 ❄️ |

#### 💰 Supply Actions

_Mint / redeem / burn call tracking — last 5 calls per function, total counts preserved._

**`mint`** *(per-asset)* ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> This parameter has never been changed since deployment.

| Field | Value |
|---|---|
| Setter | `mint(address _to, uint256 _amount)` |
| Gated by | `owner()` |
| Tags | `SUPPLY` |
| Last called | — |
| Called by | — |
| Total calls | 0 ❄️ |

**`send`** *(per-asset)* ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> This parameter has never been changed since deployment.

| Field | Value |
|---|---|
| Setter | `send(SendParam calldata _sendParam, MessagingFee calldata _fee, address _refundAddress)` |
| Gated by | `endpoint()` |
| Tags | `SUPPLY` |
| Last called | — |
| Called by | — |
| Total calls | 0 ❄️ |

---
<a id="c-0x1a44076050125825900e736c501f859c50fe728c"></a>
## > EndpointV2 `0x1a44076050125825900e736c501f859c50fE728c`

> *0 roles · 0 members · 0 functions*

> > 🍃 **Shared infrastructure** (LayerZero EndpointV2) — reachable from the root contract but not specific to this protocol. BFS expansion stopped here; this contract's `owner()` / `delegate()` / role members are NOT followed into the dependency graph because they reflect the infrastructure's own governance, not the protocol's authority surface.

> > 💰 **Inherited supply authority** — holds `endpoint()` on **Stablecoin**. Access controls on this contract gate root token supply.

> _No roles detected._

---
<a id="c-0xc07e000044f95655c11fda4cd37f70a94d7e0a7d"></a>
## > Core `0xc07e000044F95655c11fda4cD37F70A94d7e0a7d`

> *14 roles · 10 members · 27 functions*

> > 🗳️ **Prisma-style Core authority hub** — the supreme authority is `voter` = [Voter](#c-0x11111111063874ce8dc6232cb5c1c849359476e6) `0x1111...76E6` (unrestricted `execute`: can make ANY call as Core). Beyond the voter, 24 scoped operator grant(s) let non-voter callers invoke specific selectors via `Core.execute`; **3** target an authority-critical selector (setVoter / upgrade / setOperatorPermissions) — surfaced individually in Analyst Focus Areas.
> >
> > `voter` has been reassigned 6 time(s) since deploy (latest at block 22807328).
> >
> > **📋 Operator grants:**
> >
> > | Holder | May call | On target | AuthHook | Used |
> > |---|---|---|---|---|
> > | [VeCrvOperator](#c-0x03e1538d33778c3711a075af99fc75fcb31ed341) | `0x1cff79cd` | `0x490b...2F7e` | none | 11× |
> > | [PairAdder](#c-0x09500002956877b910acec25c4b4dd57950e1d27) | `0xc2b7bbb6` | [ResupplyRegistry](#c-0x10101010e0c3171d894b71b3400668af311e7d94) | none | never |
> > | [BorrowLimitController](#c-0x0950000465476f4470e74aed93e7dd414012bb7d) | `0xe7a33174` | *any* | none | never |
> > | [TreasuryManagerUpgradeable](#c-0x4cf97a55d58aad14c493a46c8151a0bfffb10403) | `0x10a76fb1` | `0x4444...8324` | none | 30× |
> > | [TreasuryManagerUpgradeable](#c-0x4cf97a55d58aad14c493a46c8151a0bfffb10403) | `0x175fadbe` | `0x4444...8324` | none | 30× |
> > | [TreasuryManagerUpgradeable](#c-0x4cf97a55d58aad14c493a46c8151a0bfffb10403) | `0x1cff79cd` | `0x4444...8324` | none | 6× |
> > | [TreasuryManagerUpgradeable](#c-0x4cf97a55d58aad14c493a46c8151a0bfffb10403) | `0x2961320c` | `0x4444...8324` | none | 30× |
> > | [TreasuryManagerUpgradeable](#c-0x4cf97a55d58aad14c493a46c8151a0bfffb10403) | `0x803f22de` | `0x4444...8324` | none | 24× |
> > | [TreasuryManagerUpgradeable](#c-0x4cf97a55d58aad14c493a46c8151a0bfffb10403) | `0x8afbcf96` | `0x4444...8324` | none | 30× |
> > | [TreasuryManagerUpgradeable](#c-0x4cf97a55d58aad14c493a46c8151a0bfffb10403) | `0xab23c345` | `0x4444...8324` | none | 30× |
> > | [TreasuryManagerUpgradeable](#c-0x4cf97a55d58aad14c493a46c8151a0bfffb10403) | `0x175fadbe` | `0xfdCE...CBF8` | none | never |
> > | [TreasuryManagerUpgradeable](#c-0x4cf97a55d58aad14c493a46c8151a0bfffb10403) | `0xf5537ede` | `0xfdCE...CBF8` | none | never |
> > | [UpgradeOperator](#c-0x82ba27ee62fc490f81fefce5ac9c2f238f8b5543) | `upgradeToAndCall(address,bytes)` ⚠️ | [RedemptionOperator](#c-0x3f7c15d053ab332d194d0040815e466d34387e40) | none | never |
> > | [UpgradeOperator](#c-0x82ba27ee62fc490f81fefce5ac9c2f238f8b5543) | `upgradeToAndCall(address,bytes)` ⚠️ | [GuardianUpgradeable](#c-0xa4745e0b1f40ab3dcfd98f381835de591a8974e3) | none | 1× |
> > | [GuardianUpgradeable](#c-0xa4745e0b1f40ab3dcfd98f381835de591a8974e3) | `0x193e3f0a` | *any* | none | never |
> > | [GuardianUpgradeable](#c-0xa4745e0b1f40ab3dcfd98f381835de591a8974e3) | `0x398d2ce9` | *any* | none | never |
> > | [GuardianUpgradeable](#c-0xa4745e0b1f40ab3dcfd98f381835de591a8974e3) | `0x8456cb59` | *any* | none | never |
> > | [GuardianUpgradeable](#c-0xa4745e0b1f40ab3dcfd98f381835de591a8974e3) | `0x9265a7d5` | *any* | none | never |
> > | [GuardianUpgradeable](#c-0xa4745e0b1f40ab3dcfd98f381835de591a8974e3) | `0xaec35fdb` | *any* | none | never |
> > | [GuardianUpgradeable](#c-0xa4745e0b1f40ab3dcfd98f381835de591a8974e3) | `0xc91b040f` | *any* | none | never |
> > | [GuardianUpgradeable](#c-0xa4745e0b1f40ab3dcfd98f381835de591a8974e3) | `0xe0a8f6f5` | *any* | none | never |
> > | [GuardianUpgradeable](#c-0xa4745e0b1f40ab3dcfd98f381835de591a8974e3) | `0x4ea63d4b` | [InsurancePool](#c-0x00000000efe883b3304aff71eacf72dbc3e1b577) | none | never |
> > | [GuardianUpgradeable](#c-0xa4745e0b1f40ab3dcfd98f381835de591a8974e3) | `0x9b2ea4bd` | [ResupplyRegistry](#c-0x10101010e0c3171d894b71b3400668af311e7d94) | none | 2× |
> > | [Safe](#c-0xfe11a5009f2121622271e7dd0fd470264e076af6) | `setVoter(address)` ⚠️ | [Core](#c-0xc07e000044f95655c11fda4cd37f70a94d7e0a7d) | none | never |

> 🔒 **Immutable References:** `voter — Core supreme authority (unrestricted execute)` → Voter

### > 🟠 `borrowLimitController (Core operator grant)`

> **Hash:** `bfs_seed:borrowLimitController (Core operator grant)`  
> **Privileged write functions:**  
> **Capabilities:** ⚙️ **CONFIG** 💰 **SUPPLY**
> - `operatorPermissions[BorrowLimitController][*][setBorrowLimit]` — BorrowLimitController — per-market debt-ceiling ramp control = reUSD mint capacity per market. Maps directly to the README's "mint inflation" harm vector. Already critical_parameters lever #5.
 `[SUPPLY, CONFIG]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x0950000465476F4470e74AeD93E7dd414012BB7D` | [↳ BorrowLimitController](#c-0x0950000465476f4470e74aed93e7dd414012bb7d) | 🟠 HIGH | — | Storage only |  |

### > 🟠 `pairDeployer (Core operator grant)`

> **Hash:** `bfs_seed:pairDeployer (Core operator grant)`  
> **Privileged write functions:**  
> **Capabilities:** 💰 **SUPPLY** ⬆️ **UPGRADE**
> - `operatorPermissions[...][ResupplyPairDeployer][setCreationCode]` — ResupplyPairDeployer — setCreationCode sets the bytecode template for EVERY FUTURE CDP market; deploy()/deployWithDefaultConfig create new markets. Maps to "mint inflation" for future markets. Already critical_parameters lever #6.
 `[SUPPLY, UPGRADE]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x5555555558B7309ecB0FbB23e609ec3c6f74C2Ea` | [↳ ResupplyPairDeployer](#c-0x5555555558b7309ecb0fbb23e609ec3c6f74c2ea) | 🟠 HIGH | — | Storage only |  |

### > 🟠 `upgradeOperator (Core operator grant)`

> **Hash:** `bfs_seed:upgradeOperator (Core operator grant)`  
> **Privileged write functions:**  
> **Capabilities:** ⬆️ **UPGRADE**
> - `operatorPermissions[UpgradeOperator][*][upgradeToAndCall]` — UpgradeOperator — the instant, no-timelock upgrade grant on GuardianUpgradeable + RedemptionOperator (manager = the 3-of-5 ops Safe). Maps directly to the README's "proxy upgrade" harm vector; this is the single most dangerous lever after setVoter. Already critical_parameters lever #2 (CRITICAL).
 `[UPGRADE]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x82ba27ee62Fc490f81feFCE5AC9C2f238F8b5543` | [↳ UpgradeOperator](#c-0x82ba27ee62fc490f81fefce5ac9c2f238f8b5543) | 🟠 HIGH | — | Storage only |  |

### > 🟠 `guardian (Core operator grant)`

> **Hash:** `bfs_seed:guardian (Core operator grant)`  
> **Privileged write functions:**  
> **Capabilities:** ⚙️ **CONFIG** ⏸️ **PAUSE**
> - `operatorPermissions[UpgradeOperator][GuardianUpgradeable][pauseAllPairs...]` — GuardianUpgradeable proxy — global pauseAllPairs/pausePair, updateRedemptionGuardSettings, setRegistryAddress (repoints unguarded registry handler pointers instantly). Maps to forced-pause + fee-manipulation-adjacent vectors. Already critical_parameters lever #7. Reached via Core's operatorPermissions grant graph (Gap B in the cycle-1 debrief — not source-modeled by the scanner at all; documented here as the pragmatic fix).
 `[PAUSE, CONFIG]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xA4745e0B1F40ab3DCFD98F381835De591a8974E3` | [↳ ERC1967Proxy](#c-0xa4745e0b1f40ab3dcfd98f381835de591a8974e3) | 🟠 HIGH | — | Storage only |  |

### > 🟠 `redemptionOperator (Core-owned)`

> **Hash:** `bfs_seed:redemptionOperator (Core-owned)`  
> **Privileged write functions:**  
> **Capabilities:** ⚙️ **CONFIG**
> - `owner() [RedemptionOperator.setManager/setApprovedCaller/sweep]` — RedemptionOperator — automated flash-loan arb/redemption-execution bot. Its own privileged surface is Core-gated setManager/setApprovedCaller/sweep (manager == the same 3-of-5 ops Safe, live-verified 2026-07-21); executeRedemption itself TRIGGERS A BURN via RedemptionHandler.redeemFromPair (anti-dilutive, not a mint path). Catalogued fresh this cycle (source query via the proxy address returned an unrelated "FreeTunnelHub" bundle — an Etherscan auto-match artifact; querying the impl address 0x67ba21ea... directly returned the correct verified RedemptionOperator source, cross-confirmed via live owner()==Core and registry()==ResupplyRegistry). Lower severity than the other 7 entries here (no direct SUPPLY/PAUSE/BLACKLIST of its own) but directly touches the redemption flow, so included for completeness.
 `[CONFIG]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x3F7C15d053Ab332D194D0040815E466d34387E40` | [↳ ERC1967Proxy](#c-0x3f7c15d053ab332d194d0040815e466d34387e40) | 🟠 HIGH | — | Storage only |  |

### > 🟠 `Core operator grant (1 grant(s): 0x1cff79cd)`

> **Hash:** `core_operator_0x03e1538d33778c3711a075af99fc75fcb31ed341`  
> **Privileged write functions:**
> - `0x1cff79cd` — Core operator grant: may call `0x1cff79cd` on 0x490b...2F7e via Core.execute, used 11×.

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x03E1538D33778C3711A075AF99FC75FCb31Ed341` | [↳ VeCrvOperator](#c-0x03e1538d33778c3711a075af99fc75fcb31ed341) | 🟠 HIGH | — | Storage only |  |

### > 🟠 `Core operator grant (1 grant(s): 0xc2b7bbb6)`

> **Hash:** `core_operator_0x09500002956877b910acec25c4b4dd57950e1d27`  
> **Privileged write functions:**
> - `0xc2b7bbb6` — Core operator grant: may call `0xc2b7bbb6` on 0x1010...7D94 via Core.execute, never used.

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x09500002956877b910ACEc25C4b4dd57950e1D27` | [↳ PairAdder](#c-0x09500002956877b910acec25c4b4dd57950e1d27) | 🟠 HIGH | — | Storage only |  |

### > 🟠 `Core operator grant (1 grant(s): 0xe7a33174)`

> **Hash:** `core_operator_0x0950000465476f4470e74aed93e7dd414012bb7d`  
> **Privileged write functions:**
> - `0xe7a33174` — Core operator grant: may call `0xe7a33174` on any target via Core.execute, never used.

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x0950000465476F4470e74AeD93E7dd414012BB7D` | [↳ BorrowLimitController](#c-0x0950000465476f4470e74aed93e7dd414012bb7d) | 🟠 HIGH | — | Storage only |  |

### > 🟢 `Core operator grant (1 grant(s): setVoter)`

> **Hash:** `core_operator_0xfe11a5009f2121622271e7dd0fd470264e076af6`  
> **Privileged write functions:**
> - `setVoter(address)` — Core operator grant: may call `setVoter(address)` on 0xc07e...0a7d via Core.execute, never used.

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xFE11a5009f2121622271e7dd0FD470264e076af6` | [↳ Gnosis Safe 3/5](#c-0xfe11a5009f2121622271e7dd0fd470264e076af6) | 🟢 LOW | — | Storage only | 3/5 signers |

> **Signers of `Gnosis Safe 3/5` (0xFE11...6af6):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x4D1b56274C01481C0312fCa332016d83512BEEe3` | EOA | 2026-01-04 | EOA |
> | `0xBd0a74e51729a4D0B92742e67183C4cBc97bCA92` | EOA | 2026-04-20 | EOA |
> | `0x1101c94c6001e4074Ad4dBAd5Ad08117979cA9D4` | EOA | — | EOA |
> | `0x1B1D2806dE441eaaAc7f6677bd15DFa937A5b97c` | EOA | 2026-05-24 | EOA |
> | `0xAAc0aa431c237C2C0B5f041c8e59B3f1a43aC78F` | EOA ⚠️ Hot wallet (2,933 txs) | — | EOA |

> **Quorum history:**
>   - 2025-03-17: ⚪ unchanged 3 → 3

### > 🟠 `Core operator grant (2 grant(s): upgradeToAndCall)`

> **Hash:** `core_operator_0x82ba27ee62fc490f81fefce5ac9c2f238f8b5543`  
> **Privileged write functions:**
> - `upgradeToAndCall(address,bytes)` — Core operator grant: may call `upgradeToAndCall(address,bytes)` on 0x3F7C...7E40 via Core.execute, never used.
> - `upgradeToAndCall(address,bytes)` — Core operator grant: may call `upgradeToAndCall(address,bytes)` on 0xA474...74E3 via Core.execute, used 1×.

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x82ba27ee62Fc490f81feFCE5AC9C2f238F8b5543` | [↳ UpgradeOperator](#c-0x82ba27ee62fc490f81fefce5ac9c2f238f8b5543) | 🟠 HIGH | — | Storage only |  |

### > 🟠 `Core operator grant (9 grant(s): 0x10a76fb1, 0x175fadbe, 0x1cff79cd, 0x2961320c …)`

> **Hash:** `core_operator_0x4cf97a55d58aad14c493a46c8151a0bfffb10403`  
> **Privileged write functions:**
> - `0x10a76fb1` — Core operator grant: may call `0x10a76fb1` on 0x4444...8324 via Core.execute, used 30×.
> - `0x175fadbe` — Core operator grant: may call `0x175fadbe` on 0x4444...8324 via Core.execute, used 30×.
> - `0x1cff79cd` — Core operator grant: may call `0x1cff79cd` on 0x4444...8324 via Core.execute, used 6×.
> - `0x2961320c` — Core operator grant: may call `0x2961320c` on 0x4444...8324 via Core.execute, used 30×.
> - `0x803f22de` — Core operator grant: may call `0x803f22de` on 0x4444...8324 via Core.execute, used 24×.
> - `0x8afbcf96` — Core operator grant: may call `0x8afbcf96` on 0x4444...8324 via Core.execute, used 30×.
> - `0xab23c345` — Core operator grant: may call `0xab23c345` on 0x4444...8324 via Core.execute, used 30×.
> - `0x175fadbe` — Core operator grant: may call `0x175fadbe` on 0xfdCE...CBF8 via Core.execute, never used.
> - `0xf5537ede` — Core operator grant: may call `0xf5537ede` on 0xfdCE...CBF8 via Core.execute, never used.

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x4CF97a55d58Aad14C493A46C8151a0BFffb10403` | [↳ ERC1967Proxy](#c-0x4cf97a55d58aad14c493a46c8151a0bfffb10403) | 🟠 HIGH | — | Storage only |  |

### > 🟠 `Core operator grant (9 grant(s): 0x193e3f0a, 0x398d2ce9, 0x8456cb59, 0x9265a7d5 …)`

> **Hash:** `core_operator_0xa4745e0b1f40ab3dcfd98f381835de591a8974e3`  
> **Privileged write functions:**
> - `0x193e3f0a` — Core operator grant: may call `0x193e3f0a` on any target via Core.execute, never used.
> - `0x398d2ce9` — Core operator grant: may call `0x398d2ce9` on any target via Core.execute, never used.
> - `0x8456cb59` — Core operator grant: may call `0x8456cb59` on any target via Core.execute, never used.
> - `0x9265a7d5` — Core operator grant: may call `0x9265a7d5` on any target via Core.execute, never used.
> - `0xaec35fdb` — Core operator grant: may call `0xaec35fdb` on any target via Core.execute, never used.
> - `0xc91b040f` — Core operator grant: may call `0xc91b040f` on any target via Core.execute, never used.
> - `0xe0a8f6f5` — Core operator grant: may call `0xe0a8f6f5` on any target via Core.execute, never used.
> - `0x4ea63d4b` — Core operator grant: may call `0x4ea63d4b` on 0x0000...b577 via Core.execute, never used.
> - `0x9b2ea4bd` — Core operator grant: may call `0x9b2ea4bd` on 0x1010...7D94 via Core.execute, used 2×.

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xA4745e0B1F40ab3DCFD98F381835De591a8974E3` | [↳ ERC1967Proxy](#c-0xa4745e0b1f40ab3dcfd98f381835de591a8974e3) | 🟠 HIGH | — | Storage only |  |

### > 🟠 `voter()`

> **Privileged write functions:**
> - `execute(address target, bytes calldata data)` — Execute an arbitrary function call using this contract Callable via the voter, or any operator with explicit permission.

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x11111111063874cE8dC6232cb5C1C849359476E6` | [↳ Voter](#c-0x11111111063874ce8dc6232cb5c1c849359476e6) | 🟠 HIGH | — | Storage+Events |  |

> #### 🔧 Permissioned Parameters

> **`voter`** 🔄 **ACTIVE** (7 changes)

> > ⚠️ This parameter has been changed **7 times** — monitor for unexpected modifications.

> | Field | Value |
> |---|---|
> | Current Value | `0x11111111063874cE8dC6232cb5C1C849359476E6` |
> | Setter | `setVoter(address)` |
> | Gated by | `Core operator grant (1 grant(s): setVoter)` |
> | Tags | — |
> | Last changed | 2025-06-29 |
> | Changed by | `0x1111...76E6` (Voter) |
> | Total changes | 7 🔄 |

> **Recent changes (showing last 5 of 7):**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `0x11111111063874cE8dC6232cb5C1C849359476E6` | `0x1111...76E6` (Voter) | 2025-06-29 |
> | 2 | `0xFE11a5009f2121622271e7dd0FD470264e076af6` | `0xFE11...6af6` (Gnosis Safe 3/5) | 2025-06-29 |
> | 3 | `0x11111111408bd67B92C4f74B9D3cF96f1fa412BC` | `0x1111...12BC` | 2025-06-27 |
> | 4 | `0xFE11a5009f2121622271e7dd0FD470264e076af6` | `0xFE11...6af6` (Gnosis Safe 3/5) | 2025-06-27 |
> | 5 | `0x11111111408bd67B92C4f74B9D3cF96f1fa412BC` | `0x1111...12BC` | 2025-05-31 |

---
<a id="c-0x10101010e0c3171d894b71b3400668af311e7d94"></a>
## > ResupplyRegistry `0x10101010E0C3171D894B71B3400668aF311e7D94`

> *17 roles · 13 members · 18 functions*

> > 💰 **Inherited supply authority** — holds `operators` on **Stablecoin**. Access controls on this contract gate root token supply.

> 🔒 **Immutable References:** `core()` → Core, `govToken()` → RSUP (GovToken)

### > 🟢 `insurancePool`

> **Hash:** `bfs_seed:insurancePool`  
> **Privileged write functions:**  
> **Capabilities:** ⚙️ **CONFIG** 💰 **SUPPLY**
> - `insurancePool` — InsurancePool — the CDP bad-debt backstop (burnAssets is anti-dilutive SUPPLY-burn; setWithdrawTimers/setMinimumHeldAssets are CONFIG governing how much of the buffer is usable when a liquidation actually fires). Directly determines post-liquidation solvency — the same mechanism that absorbed the June-2025 exploit's bad debt.
 `[SUPPLY, CONFIG]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x00000000efe883b3304aFf71eaCf72Dbc3e1b577` | [↳ reIP (InsurancePool)](#c-0x00000000efe883b3304aff71eacf72dbc3e1b577) | 🟢 LOW | — | Storage only |  |

### > 🟠 `liquidationHandler`

> **Hash:** `bfs_seed:liquidationHandler`  
> **Privileged write functions:**  
> **Capabilities:** ⚙️ **CONFIG** 💰 **SUPPLY**
> - `liquidationHandler` — LiquidationHandler — the liquidation engine; unbounded setLiquidationIncentive (economic CONFIG) and distributeCollateralAndClearDebt (Core-gated force-burn of bad debt). Directly maps to CDP solvency / collateral-integrity — the mechanism that determines whether reUSD stays fully backed after a liquidation event.
 `[SUPPLY, CONFIG]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x88888888c227c36401493Ed9F3e3Dcc3800B2634` | [↳ LiquidationHandler](#c-0x88888888c227c36401493ed9f3e3dcc3800b2634) | 🟠 HIGH | — | Storage only |  |

### > 🟠 `owner()`

> **Privileged write functions:**  
> **Capabilities:** ⚙️ **CONFIG** 💰 **SUPPLY**
> - `setL2Manager(address _newAddress)`
> - `setLiquidationHandler(address _newAddress)`
> - `setFeeDeposit(address _newAddress)` `[CONFIG]`
> - `setRedemptionHandler(address _newAddress)`
> - `setInsurancePool(address _newAddress)`
> - `setRewardHandler(address _newAddress)`
> - `setStaker(address _newAddress)`
> - `setTreasury(address _newAddress)` `[CONFIG]`
> - `setVestManager(address _newAddress)`
> - `addPair(address _pairAddress)` — The ```addPair``` function adds a pair to the registry and ensures a unique name `[SUPPLY]`
> - `setDefaultSwappers(address[] memory _swappers)` — The ```setDefaultSwappers``` function is used to set default list of approved swappers
> - `setAddress(string memory key, address addr)` — Generic address setter for the registry Cannot use for protected keys, since they are already assigned to specific variables
> - `withdrawTo(address _asset, uint256 _amount, address _to)`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xc07e000044F95655c11fda4cD37F70A94d7e0a7d` | [↳ Core](#c-0xc07e000044f95655c11fda4cd37f70a94d7e0a7d) | 🟠 HIGH | — | Storage only |  |

### > 🟠 `priceWatcher (PRICE_WATCHER registry key)`

> **Hash:** `bfs_seed:priceWatcher (PRICE_WATCHER registry key)`  
> **Privileged write functions:**  
> **Capabilities:** ⚙️ **CONFIG**
> - `getAddress("PRICE_WATCHER")` — Time-weighted discount used for pair interest-rate sizing (NOT reUSD's peg price). Its own oracle() pointer is STALE vs the live REUSD_ORACLE (Q-07); followed so the scanner tracks it on-chain each scan and surfaces any change.
 `[CONFIG]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xAaaa0013e2ec451F76816d1e0a02ABA596dd9251` | [↳ PriceWatcher](#c-0xaaaa0013e2ec451f76816d1e0a02aba596dd9251) | 🟠 HIGH | — | Storage only |  |

### > 🟠 `redemptionHandler`

> **Hash:** `bfs_seed:redemptionHandler`  
> **Privileged write functions:**  
> **Capabilities:** ⚙️ **CONFIG** ⏸️ **PAUSE**
> - `redemptionHandler` — RedemptionHandler — reUSD's ENTIRE peg-defense mechanism. updateGuardSettings can disable permissionless below-peg redemption outright (forced-pause-equivalent on the exit path); setBaseRedemptionFee can raise the redemption haircut to 100% (fee-manipulation vector). Maps directly to two of the README's five harm vectors. Already critical_parameters lever #8.
 `[PAUSE, CONFIG]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x5eeB063d0abefBBc78F576E28d762a16b637A025` | [↳ RedemptionHandler](#c-0x5eeb063d0abefbbc78f576e28d762a16b637a025) | 🟠 HIGH | — | Storage only |  |

### > 🟠 `reusdOracle (REUSD_ORACLE registry key)`

> **Hash:** `bfs_seed:reusdOracle (REUSD_ORACLE registry key)`  
> **Privileged write functions:**  
> **Capabilities:** ⚙️ **CONFIG**
> - `getAddress("REUSD_ORACLE")` — reUSD's canonical price feed (Curve reUSD/scrvUSD pool EMA, floored ~0.99 by the redemption fee). Claimed FULLY IMMUTABLE (zero setters, compile-time constant deps) at recon; followed here so the scanner re-verifies that on-chain each scan (no proxy / no setters / no roles) rather than trusting a one-time source read — reUSD's own price source is high-interest. The REUSD_ORACLE registry pointer that selects it is a guardedRegistryKey, repointable ONLY by Core (8-day Voter / setVoter, no instant operator grant).
 `[CONFIG]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x3A1E320f289eeF2636B6D7Aa5C0f9202ee9928e4` | [↳ ReusdOracle](#c-0x3a1e320f289eef2636b6d7aa5c0f9202ee9928e4) | 🟠 HIGH | — | Storage only |  |

### > 🟠 `feeDeposit()` · 📋 operational


> **Members (1):**

> | Address | Name / Type | Granted | Source | Details |
> |---|---|---|---|---|
> | `0x07Ad4630985ADe5B5307806C43E57e0A9A932C52` | FeeDeposit | — | Storage only |  |

### > 🟢 `insurancePool()` · 📋 operational


> **Members (1):**

> | Address | Name / Type | Granted | Source | Details |
> |---|---|---|---|---|
> | `0x00000000efe883b3304aFf71eaCf72Dbc3e1b577` | [↳ reIP (InsurancePool)](#c-0x00000000efe883b3304aff71eacf72dbc3e1b577) | — | Storage only |  |

### > 🟠 `liquidationHandler()` · 📋 operational


> **Members (1):**

> | Address | Name / Type | Granted | Source | Details |
> |---|---|---|---|---|
> | `0x88888888c227c36401493Ed9F3e3Dcc3800B2634` | [↳ LiquidationHandler](#c-0x88888888c227c36401493ed9f3e3dcc3800b2634) | — | Storage only |  |

### > 🟠 `redemptionHandler()` · 📋 operational


> **Members (1):**

> | Address | Name / Type | Granted | Source | Details |
> |---|---|---|---|---|
> | `0x5eeB063d0abefBBc78F576E28d762a16b637A025` | [↳ RedemptionHandler](#c-0x5eeb063d0abefbbc78f576e28d762a16b637a025) | — | Storage only |  |

### > 🟠 `rewardHandler()` · 📋 operational


> **Members (1):**

> | Address | Name / Type | Granted | Source | Details |
> |---|---|---|---|---|
> | `0x74747408065d6A85DFf07D23F22C921Ce7D0b4B1` | RewardHandler | — | Storage only |  |

### > 🟠 `staker()` · 📋 operational


> **Members (1):**

> | Address | Name / Type | Granted | Source | Details |
> |---|---|---|---|---|
> | `0x22222222E9fE38F6f1FC8C61b25228adB4D8B953` | [↳ GovStaker](#c-0x22222222e9fe38f6f1fc8c61b25228adb4d8b953) | — | Storage only |  |

### > 🟠 `treasury()` · 📋 operational


> **Members (1):**

> | Address | Name / Type | Granted | Source | Details |
> |---|---|---|---|---|
> | `0x4444444455bF42de586A88426E5412971eA48324` | Treasury | — | Storage only |  |

### > 🟠 `vestManager()` · 📋 operational


> **Members (1):**

> | Address | Name / Type | Granted | Source | Details |
> |---|---|---|---|---|
> | `0x6666666677B06CB55EbF802BB12f8876360f919c` | VestManager | — | Storage only |  |

> #### 🔧 Permissioned Parameters

> **`feeDeposit`**

> | Field | Value |
> |---|---|
> | Current Value | `0x07Ad4630985ADe5B5307806C43E57e0A9A932C52` |
> | Setter | `setFeeDeposit(address _newAddress)` |
> | Gated by | `owner()` |
> | Tags | `CONFIG` |
> | Last changed | 2025-03-13 |
> | Changed by | — |
> | Total changes | 1 |

> **`insurancePool`**

> | Field | Value |
> |---|---|
> | Current Value | `0x00000000efe883b3304aFf71eaCf72Dbc3e1b577` |
> | Setter | `setInsurancePool(address _newAddress)` |
> | Gated by | `owner()` |
> | Tags | — |
> | Last changed | 2025-03-13 |
> | Changed by | — |
> | Total changes | 1 |

> **`liquidationHandler`**

> | Field | Value |
> |---|---|
> | Current Value | `0x88888888c227c36401493Ed9F3e3Dcc3800B2634` |
> | Setter | `setLiquidationHandler(address _newAddress)` |
> | Gated by | `owner()` |
> | Tags | — |
> | Last changed | 2025-07-02 |
> | Changed by | — |
> | Total changes | 3 |

> **`redemptionHandler`** 🔄 **ACTIVE** (5 changes)

> > ⚠️ This parameter has been changed **5 times** — monitor for unexpected modifications.

> | Field | Value |
> |---|---|
> | Current Value | `0x5eeB063d0abefBBc78F576E28d762a16b637A025` |
> | Setter | `setRedemptionHandler(address _newAddress)` |
> | Gated by | `owner()` |
> | Tags | — |
> | Last changed | 2026-02-21 |
> | Changed by | — |
> | Total changes | 5 🔄 |

> **`rewardHandler`**

> | Field | Value |
> |---|---|
> | Current Value | `0x74747408065d6A85DFf07D23F22C921Ce7D0b4B1` |
> | Setter | `setRewardHandler(address _newAddress)` |
> | Gated by | `owner()` |
> | Tags | — |
> | Last changed | 2025-08-30 |
> | Changed by | — |
> | Total changes | 2 |

> **`staker`**

> | Field | Value |
> |---|---|
> | Current Value | `0x22222222E9fE38F6f1FC8C61b25228adB4D8B953` |
> | Setter | `setStaker(address _newAddress)` |
> | Gated by | `owner()` |
> | Tags | — |
> | Last changed | 2025-03-13 |
> | Changed by | — |
> | Total changes | 1 |

> **`treasury`**

> | Field | Value |
> |---|---|
> | Current Value | `0x4444444455bF42de586A88426E5412971eA48324` |
> | Setter | `setTreasury(address _newAddress)` |
> | Gated by | `owner()` |
> | Tags | `CONFIG` |
> | Last changed | 2025-03-18 |
> | Changed by | — |
> | Total changes | 2 |

> **`vestManager`**

> | Field | Value |
> |---|---|
> | Current Value | `0x6666666677B06CB55EbF802BB12f8876360f919c` |
> | Setter | `setVestManager(address _newAddress)` |
> | Gated by | `owner()` |
> | Tags | — |
> | Last changed | 2025-03-13 |
> | Changed by | — |
> | Total changes | 1 |

> #### 💰 Supply Actions

> _Mint / redeem / burn call tracking — last 5 calls per function, total counts preserved._

> **`addPair`** *(per-asset)* 🔄 **ACTIVE** (19 changes)

> > ⚠️ This parameter has been changed **19 times** — monitor for unexpected modifications.

> | Field | Value |
> |---|---|
> | Setter | `addPair(address _pairAddress)` |
> | Gated by | `owner()` |
> | Tags | `SUPPLY` |
> | Last called | 2026-01-08 |
> | Called by | `0x005e...3235` |
> | Total calls | 19 🔄 |

> **Recent changes (showing last 5 of 19):**

> | # | Asset | Value | Set By | Date |
> |---|---|---|---|---|
> | 1 | Resupply Pair (CurveLend: crvUSD/sreUSD) - 1 | `—` | `0x005e...3235` | 2026-01-08 |
> | 2 | Resupply Pair (CurveLend: crvUSD/fxSAVE) - 1 | `—` | `0x5C46...aF80` | 2025-09-09 |
> | 3 | Resupply Pair (CurveLend: crvUSD/wstUSR) - 1 | `—` | `0xe5Bc...419f` | 2025-06-26 |
> | 4 | Resupply Pair (CurveLend: crvUSD/tBTC) - 2 | `—` | `0xe5Bc...419f` | 2025-05-27 |
> | 5 | Resupply Pair (CurveLend: crvUSD/sUSDS) - 1 | `—` | `0xe5Bc...419f` | 2025-05-27 |

---
<a id="c-0x11111111063874ce8dc6232cb5c1c849359476e6"></a>
## > Voter `0x11111111063874cE8dC6232cb5C1C849359476E6`

> *3 roles · 2 members · 9 functions*

> 🔒 **Immutable References:** `core()` → Core

### > 🟠 `owner()`

> **Privileged write functions:**
> - `cancelProposal(uint256 id)` — Cancels a pending proposal Can cancel any time prior to execution
> - `setMinCreateProposalPct(uint256 pct)` — Set the minimum % of the total weight required to create a new proposal /
> - `setQuorumPct(uint256 pct)` — Set the required % of the total weight that must vote for a proposal in order to become executable
> - `setMinTimeBetweenProposals(uint256 _cooldown)` — Set the cooldown period between proposals for a given account /
> - `setExecutionDelay(uint256 _delay)` — Set the delay between proposal passage and its eligibility for execution /
> - `setVotingPeriod(uint256 _period)` — Set the voting period for a proposal /
> - `updateProposalDescription(uint256 id, string calldata description)` — Overwrite the description text for an existing proposal /

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xc07e000044F95655c11fda4cD37F70A94d7e0a7d` | [↳ Core](#c-0xc07e000044f95655c11fda4cd37f70a94d7e0a7d) | 🟠 HIGH | — | Storage only |  |

### > 🟠 `staker()`

> **Privileged write functions:**
> - `voteForProposal(address account, uint256 id)` — Vote fully in favor of a proposal Each account can vote once per proposal. Uses full weight.
> - `voteForProposal(address account, uint256 id, uint256 pctYes, uint256 pctNo)` — Vote fully in favor of a proposal Each account can vote once per proposal. Uses full weight.

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x22222222E9fE38F6f1FC8C61b25228adB4D8B953` | [↳ GovStaker](#c-0x22222222e9fe38f6f1fc8c61b25228adb4d8b953) | 🟠 HIGH | — | Storage only |  |

> #### 🔧 Permissioned Parameters

> **`executionDelay`**

> | Field | Value |
> |---|---|
> | Current Value | `86400` |
> | Setter | `setExecutionDelay(uint256 _delay)` |
> | Gated by | `owner()` |
> | Tags | — |
> | Last changed | 2025-07-02 |
> | Changed by | `0x051C...b795` |
> | Total changes | 1 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `86400` | `0x051C...b795` | 2025-07-02 |

> **`MAX_DESCRIPTION_BYTES`** 🔒 **IMMUTABLE**

> > 🔒 **Immutable** — declared as a constant in the contract source; cannot be changed without a contract upgrade. Bounds the reachable extreme of any setter that writes a related storage variable.

> | Field | Value |
> |---|---|
> | Current Value | `384` |
> | Mutability | 🔒 immutable (constant) |
> | Tags | `IMMUTABLE` |

> **`MAX_PCT`** 🔒 **IMMUTABLE**

> > 🔒 **Immutable** — declared as a constant in the contract source; cannot be changed without a contract upgrade. Bounds the reachable extreme of any setter that writes a related storage variable.

> | Field | Value |
> |---|---|
> | Current Value | `10000` |
> | Mutability | 🔒 immutable (constant) |
> | Tags | `IMMUTABLE` |

> **`minCreateProposalPct`** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> | Field | Value |
> |---|---|
> | Current Value | `100` |
> | Setter | `setMinCreateProposalPct(uint256 pct)` |
> | Gated by | `owner()` |
> | Tags | — |
> | Last changed | 2025-06-28 |
> | Changed by | `constructor` |
> | Total changes | 1 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `61896236779126284965750866438594089518658255770694867421365981290634619751247` | `constructor` | 2025-06-28 |

> **`minTimeBetweenProposals`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)*

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `86400` |
> | Setter | `setMinTimeBetweenProposals(uint256 _cooldown)` |
> | Gated by | `owner()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`quorumPct`**

> | Field | Value |
> |---|---|
> | Current Value | `3000` |
> | Setter | `setQuorumPct(uint256 pct)` |
> | Gated by | `owner()` |
> | Tags | — |
> | Last changed | 2025-06-28 |
> | Changed by | `constructor` |
> | Total changes | 1 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `96961266192945565010698373900932964423976538600725759584451118525232960465846` | `constructor` | 2025-06-28 |

> **`votingPeriod`**

> | Field | Value |
> |---|---|
> | Current Value | `604800` |
> | Setter | `setVotingPeriod(uint256 _period)` |
> | Gated by | `owner()` |
> | Tags | — |
> | Last changed | 2025-07-02 |
> | Changed by | `0x051C...b795` |
> | Total changes | 1 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `604800` | `0x051C...b795` | 2025-07-02 |

---
<a id="c-0x03e1538d33778c3711a075af99fc75fcb31ed341"></a>
## > VeCrvOperator `0x03E1538D33778C3711A075AF99FC75FCb31Ed341`

> *12 roles · 11 members · 9 functions*

> 🔒 **Immutable References:** `BOOST_DELEGATION()` → veBoost (Boost Delegation V3), `PRISMA_VOTER()` → CurveProxy, `CRVUSD()` → crvUSD (crvUSD Stablecoin), `CONVEX_VOTER()` → CurveVoterProxy, `SCRVUSD()` → scrvUSD (Yearn V3 Vault), `core()` → Core, `VE()` → veCRV, `FEE_DISTRIBUTOR()` → Curve Fee Distribution, `YEARN_VOTER()` → CurveYCRVVoter

### > 🟠 `owner()`

> **Privileged write functions:**
> - `setManager(address _manager)` — Set the manager address allowed to perform actions.
> - `claimFees()` — Claim Prisma fees and forward to the receiver without wrapping.
> - `claimFees(bool wrap, address recipient)` — Claim Prisma fees and forward to the receiver without wrapping.
> - `delegateBoost()` — Delegate available Prisma boost between Convex and Yearn.
> - `extendLock()` — Max lock the Prisma voter
> - `setBoostShare(uint256 _newConvexShare)` — Set the share of boost delegated to Convex (1e18 = 100%).
> - `setReceiver(address _receiver)` — Set the receiver for wrapped fee distributions.
> - `voteInCurveDao(address aragon, uint256 id, bool support)` — Vote in the Curve DAO on a proposal.
> - `voteForGaugeWeights(IPrismaVoterProxy.GaugeWeightVote[] calldata votes)` — Vote for gauge weights.

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xc07e000044F95655c11fda4cD37F70A94d7e0a7d` | [↳ Core](#c-0xc07e000044f95655c11fda4cd37f70a94d7e0a7d) | 🟠 HIGH | — | Storage only |  |

### > 🟢 `manager()`

> **Privileged write functions:**
> - `claimFees()` — Claim Prisma fees and forward to the receiver without wrapping.
> - `claimFees(bool wrap, address recipient)` — Claim Prisma fees and forward to the receiver without wrapping.
> - `delegateBoost()` — Delegate available Prisma boost between Convex and Yearn.
> - `extendLock()` — Max lock the Prisma voter
> - `setBoostShare(uint256 _newConvexShare)` — Set the share of boost delegated to Convex (1e18 = 100%).
> - `setReceiver(address _receiver)` — Set the receiver for wrapped fee distributions.
> - `voteInCurveDao(address aragon, uint256 id, bool support)` — Vote in the Curve DAO on a proposal.
> - `voteForGaugeWeights(IPrismaVoterProxy.GaugeWeightVote[] calldata votes)` — Vote for gauge weights.

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xFE11a5009f2121622271e7dd0FD470264e076af6` | [↳ Gnosis Safe 3/5](#c-0xfe11a5009f2121622271e7dd0fd470264e076af6) | 🟢 LOW | — | Storage+Events | 3/5 signers |

> **Signers of `Gnosis Safe 3/5` (0xFE11...6af6):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x4D1b56274C01481C0312fCa332016d83512BEEe3` | EOA | 2026-01-04 | EOA |
> | `0xBd0a74e51729a4D0B92742e67183C4cBc97bCA92` | EOA | 2026-04-20 | EOA |
> | `0x1101c94c6001e4074Ad4dBAd5Ad08117979cA9D4` | EOA | — | EOA |
> | `0x1B1D2806dE441eaaAc7f6677bd15DFa937A5b97c` | EOA | 2026-05-24 | EOA |
> | `0xAAc0aa431c237C2C0B5f041c8e59B3f1a43aC78F` | EOA ⚠️ Hot wallet (2,933 txs) | — | EOA |

> **Quorum history:**
>   - 2025-03-17: ⚪ unchanged 3 → 3

### > 🟠 `receiver()` · 📋 operational


> **Members (1):**

> | Address | Name / Type | Granted | Source | Details |
> |---|---|---|---|---|
> | `0x4444444455bF42de586A88426E5412971eA48324` | Treasury | — | Storage only |  |

> #### 🔧 Permissioned Parameters

> **`manager`**

> | Field | Value |
> |---|---|
> | Current Value | `0xFE11a5009f2121622271e7dd0FD470264e076af6` |
> | Setter | `setManager(address _manager)` |
> | Gated by | `owner()` |
> | Tags | — |
> | Last changed | 2026-02-13 |
> | Changed by | `0xFE11...6af6` (Gnosis Safe 3/5) |
> | Total changes | 1 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `0xFE11a5009f2121622271e7dd0FD470264e076af6` | `0xFE11...6af6` (Gnosis Safe 3/5) | 2026-02-13 |

> **`receiver`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)*

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `0x4444444455bF42de586A88426E5412971eA48324` |
> | Setter | `setReceiver(address _receiver)` |
> | Gated by | `manager(), owner()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

---
<a id="c-0x09500002956877b910acec25c4b4dd57950e1d27"></a>
## > PairAdder `0x09500002956877b910ACEc25C4b4dd57950e1D27`

> *3 roles · 2 members · 1 function*

> 🔒 **Immutable References:** `core()` → Core, `registry()` → ResupplyRegistry

### > 🟠 `owner()`

> **Privileged write functions:**  
> **Capabilities:** 💰 **SUPPLY**
> - `addPair(address _pair)` `[SUPPLY]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xc07e000044F95655c11fda4cD37F70A94d7e0a7d` | [↳ Core](#c-0xc07e000044f95655c11fda4cd37f70a94d7e0a7d) | 🟠 HIGH | — | Storage only |  |

> #### 💰 Supply Actions

> _Mint / redeem / burn call tracking — last 5 calls per function, total counts preserved._

> **`addPair`** *(per-asset)* ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Setter | `addPair(address _pair)` |
> | Gated by | `owner()` |
> | Tags | `SUPPLY` |
> | Last called | — |
> | Called by | — |
> | Total calls | 0 ❄️ |

---
<a id="c-0x0950000465476f4470e74aed93e7dd414012bb7d"></a>
## > BorrowLimitController `0x0950000465476F4470e74AeD93E7dd414012BB7D`

> *2 roles · 1 member · 2 functions*

> 🔒 **Immutable References:** `core()` → Core

### > 🟠 `owner()`

> **Privileged write functions:**
> - `cancelRamp(address _pair)`
> - `setPairBorrowLimitRamp(address _pair, uint256 _newBorrowLimit, uint256 _endTime)`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xc07e000044F95655c11fda4cD37F70A94d7e0a7d` | [↳ Core](#c-0xc07e000044f95655c11fda4cd37f70a94d7e0a7d) | 🟠 HIGH | — | Storage only |  |

> #### 🔧 Permissioned Parameters

> **`previewNewBorrowLimit`** *(per-asset)* ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Setter | `setPairBorrowLimitRamp(address _pair, uint256 _newBorrowLimit, uint256 _endTime)` |
> | Gated by | `owner()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

---
<a id="c-0x4cf97a55d58aad14c493a46c8151a0bfffb10403"></a>
## > TreasuryManagerUpgradeable `0x4CF97a55d58Aad14C493A46C8151a0BFffb10403`

> *7 roles · 4 members · 16 functions*

> > ⚠️ **Upgradeable** (UUPS) — impl: `0x249f28538e01AF803f3803B837344A4F411f6Db1`

> **Proxy History (1 event):**

> | # | Date | Event | Address | Key Changes | Tx |
> |---|---|---|---|---|---|
> | 1 | 2025-08-08 | Upgrade | `0x249f...6Db1` | Initial deployment | [0x237328831813a728efa77e5b633e93eef71c1e291926f80f74d4c6c0bb334f24](https://etherscan.io/tx/0x237328831813a728efa77e5b633e93eef71c1e291926f80f74d4c6c0bb334f24) |

> 🔒 **Immutable References:** `prismaFeeReceiver()` → FeeReceiver, `core()` → Core, `treasury()` → Treasury

### > 🔴 `upgradeability (UUPS)`

> > ⚠️ **CRITICAL** — Upgradeability allows arbitrary code replacement. Must be behind both a Multisig AND a Timelock.

> **Privileged write functions:**  
> **Capabilities:** ⬆️ **UPGRADE**
> - `upgradeTo(address)` — Upgrade proxy implementation to a new address `[UPGRADE]`
> - `upgradeToAndCall(address,bytes)` — Upgrade proxy implementation and call an initializer `[UPGRADE]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xc07e000044F95655c11fda4cD37F70A94d7e0a7d` | [↳ Core](#c-0xc07e000044f95655c11fda4cd37f70a94d7e0a7d) | 🟠 HIGH | — | Storage only |  |

### > 🟠 `owner()`

> **Privileged write functions:**
> - `setManager(address _manager)` — Sets the manager address that can execute treasury operations /

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xc07e000044F95655c11fda4cD37F70A94d7e0a7d` | [↳ Core](#c-0xc07e000044f95655c11fda4cd37f70a94d7e0a7d) | 🟠 HIGH | — | Storage only |  |

### > 🟠 `CORE()`

> **Privileged write functions:**
> - `setManager(address _manager)` — Sets the manager address that can execute treasury operations /

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xc07e000044F95655c11fda4cD37F70A94d7e0a7d` | [↳ Core](#c-0xc07e000044f95655c11fda4cd37f70a94d7e0a7d) | 🟠 HIGH | — | Storage only |  |

### > 🟢 `manager()`

> **Privileged write functions:**
> - `retrieveToken(address _token, address _to)`
> - `retrieveTokenExact(address _token, address _to, uint256 _amount)`
> - `retrieveETH(address _to)`
> - `retrieveETHExact(address _to, uint256 _amount)`
> - `setTokenApproval(address _token, address _spender, uint256 _amount)`
> - `execute(address _target, bytes calldata _data)` — Execute an arbitrary call to the treasury Use `safeExecute` instead of this function if you need to ensure the call succeeds
> - `safeExecute(address _target, bytes calldata _data)` — Safe execute an arbitrary call to the treasury `safeExecute` enforces that the call must result in a success
> - `transferTokenFromPrismaFeeReceiver(address token, address to, uint256 amount)`
> - `approveTokenFromPrismaFeeReceiver(address token, address spender, uint256 amount)`
> - `claimLpIncentives()`
> - `claimLpIncentivesTo(address _to)`
> - `recoverERC20(IERC20 token)`
> - `setLpIncentivesReceiver(address _lpIncentivesReceiver)`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xFE11a5009f2121622271e7dd0FD470264e076af6` | [↳ Gnosis Safe 3/5](#c-0xfe11a5009f2121622271e7dd0fd470264e076af6) | 🟢 LOW | — | Storage+Events | 3/5 signers |

> **Signers of `Gnosis Safe 3/5` (0xFE11...6af6):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x4D1b56274C01481C0312fCa332016d83512BEEe3` | EOA | 2026-01-04 | EOA |
> | `0xBd0a74e51729a4D0B92742e67183C4cBc97bCA92` | EOA | 2026-04-20 | EOA |
> | `0x1101c94c6001e4074Ad4dBAd5Ad08117979cA9D4` | EOA | — | EOA |
> | `0x1B1D2806dE441eaaAc7f6677bd15DFa937A5b97c` | EOA | 2026-05-24 | EOA |
> | `0xAAc0aa431c237C2C0B5f041c8e59B3f1a43aC78F` | EOA ⚠️ Hot wallet (2,933 txs) | — | EOA |

> **Quorum history:**
>   - 2025-03-17: ⚪ unchanged 3 → 3

> #### 🔧 Permissioned Parameters

> **`lpIncentivesReceiver`** ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `0x0000000000000000000000000000000000000000` |
> | Setter | `setLpIncentivesReceiver(address _lpIncentivesReceiver)` |
> | Gated by | `manager()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`manager`**

> | Field | Value |
> |---|---|
> | Current Value | `0xFE11a5009f2121622271e7dd0FD470264e076af6` |
> | Setter | `setManager(address _manager)` |
> | Gated by | `CORE(), owner()` |
> | Tags | — |
> | Last changed | 2025-08-08 |
> | Changed by | `0xFE11...6af6` (Gnosis Safe 3/5) |
> | Total changes | 1 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `0xFE11a5009f2121622271e7dd0FD470264e076af6` | `0xFE11...6af6` (Gnosis Safe 3/5) | 2025-08-08 |

---
<a id="c-0x82ba27ee62fc490f81fefce5ac9c2f238f8b5543"></a>
## > UpgradeOperator `0x82ba27ee62Fc490f81feFCE5AC9C2f238F8b5543`

> *3 roles · 2 members · 2 functions*

> 🔒 **Immutable References:** `core()` → Core

### > 🟢 `manager()`

> **Privileged write functions:**  
> **Capabilities:** ⬆️ **UPGRADE**
> - `upgradeToAndCall(address target, address newImplementation, bytes calldata data)` `[UPGRADE]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xFE11a5009f2121622271e7dd0FD470264e076af6` | [↳ Gnosis Safe 3/5](#c-0xfe11a5009f2121622271e7dd0fd470264e076af6) | 🟢 LOW | — | Storage+Events | 3/5 signers |

> **Signers of `Gnosis Safe 3/5` (0xFE11...6af6):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x4D1b56274C01481C0312fCa332016d83512BEEe3` | EOA | 2026-01-04 | EOA |
> | `0xBd0a74e51729a4D0B92742e67183C4cBc97bCA92` | EOA | 2026-04-20 | EOA |
> | `0x1101c94c6001e4074Ad4dBAd5Ad08117979cA9D4` | EOA | — | EOA |
> | `0x1B1D2806dE441eaaAc7f6677bd15DFa937A5b97c` | EOA | 2026-05-24 | EOA |
> | `0xAAc0aa431c237C2C0B5f041c8e59B3f1a43aC78F` | EOA ⚠️ Hot wallet (2,933 txs) | — | EOA |

> **Quorum history:**
>   - 2025-03-17: ⚪ unchanged 3 → 3

### > 🟠 `owner()`

> **Privileged write functions:**  
> **Capabilities:** ⬆️ **UPGRADE**
> - `setManager(address _manager)`
> - `upgradeToAndCall(address target, address newImplementation, bytes calldata data)` `[UPGRADE]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xc07e000044F95655c11fda4cD37F70A94d7e0a7d` | [↳ Core](#c-0xc07e000044f95655c11fda4cd37f70a94d7e0a7d) | 🟠 HIGH | — | Storage only |  |

> #### 🔧 Permissioned Parameters

> **`manager`**

> | Field | Value |
> |---|---|
> | Current Value | `0xFE11a5009f2121622271e7dd0FD470264e076af6` |
> | Setter | `setManager(address _manager)` |
> | Gated by | `owner()` |
> | Tags | — |
> | Last changed | 2026-02-10 |
> | Changed by | `0xFE11...6af6` (Gnosis Safe 3/5) |
> | Total changes | 1 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `0xFE11a5009f2121622271e7dd0FD470264e076af6` | `0xFE11...6af6` (Gnosis Safe 3/5) | 2026-02-10 |

---
<a id="c-0xa4745e0b1f40ab3dcfd98f381835de591a8974e3"></a>
## > GuardianUpgradeable `0xA4745e0B1F40ab3DCFD98F381835De591a8974E3`

> *6 roles · 3 members · 14 functions*

> > ⚠️ **Upgradeable** (UUPS) — impl: `0x74C85620F1459862834A947dB9441911BCEBF066`

> **Proxy History (2 events):**

> | # | Date | Event | Address | Key Changes | Tx |
> |---|---|---|---|---|---|
> | 1 | 2025-08-13 | Upgrade | `0xBd93...3704` | Initial deployment | [0xf0b64dfcad0c4672d76455efffc7fdf3070baab6a31013f2886f6c84b8147bac](https://etherscan.io/tx/0xf0b64dfcad0c4672d76455efffc7fdf3070baab6a31013f2886f6c84b8147bac) |
> | 2 | 2026-03-16 | Upgrade | `0x74C8...F066` | +1 fn; added `updateRedemptionGuardSettings(bool,uint256)`; 📝 src +55/-31 | [0xa08df52eb83929dcd072e4bd69aa38c0618afb8ee1225413540bffffb9908dfe](https://etherscan.io/tx/0xa08df52eb83929dcd072e4bd69aa38c0618afb8ee1225413540bffffb9908dfe) |

> <details>
> <summary>📝 Source diff — upgrade #2 (<code>0xBd93...3704</code> → <code>0x74C8...F066</code>): +55/-31 lines</summary>

> ```diff
--- old_impl
+++ new_impl
@@ -5,13 +5,13 @@
 import { IResupplyPair } from "src/interfaces/IResupplyPair.sol";
 import { IResupplyRegistry } from "src/interfaces/IResupplyRegistry.sol";
 import { IVoter } from "src/interfaces/IVoter.sol";
-import { CoreOwnable } from "src/dependencies/CoreOwnable.sol";
 import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
 import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
 import { BaseUpgradeableOperator } from "src/dao/operators/BaseUpgradeableOperator.sol";
 import { ISwapperOdos } from "src/interfaces/ISwapperOdos.sol";
 import { IInsurancePool } from "src/interfaces/IInsurancePool.sol";
 import { IBorrowLimitController } from "src/interfaces/IBorrowLimitController.sol";
+import { IRedemptionHandler } from "src/interfaces/IRedemptionHandler.sol";
 
 contract GuardianUpgradeable is BaseUpgradeableOperator {
     using SafeERC20 for IERC20;
@@ -29,6 +29,7 @@
         bool revokeSwapperApprovals;
         bool pauseIPWithdrawals;
         bool cancelRamp;
+        bool updateRedemptionGuardSettings;
     }
 
     event GuardianSet(address indexed newGuardian);
@@ -127,6 +128,14 @@
         );
     }
 
+    function updateRedemptionGuardSettings(bool guardEnabled, uint256 priceThreshold) external onlyGuardian {
+        address handler = _getRedemptionHandler();
+        core.execute(
+            handler,
+            abi.encodeWithSelector(IRedemptionHandler.updateGuardSettings.selector, guardEnabled, priceThreshold)
+        );
+    }
+
     function recoverERC20(IERC20 token) external onlyGuardian {
         token.safeTransfer(guardian, token.balanceOf(address(this)));
     }
@@ -147,6 +156,7 @@
         address swapper = registry.getAddress("SWAPPER_ODOS");
         address insurancePool = registry.getAddress("INSURANCE_POOL");
         address voter = _getVoter();
+        address redemptionHandler = _getRedemptionHandler();
         permissions.pauseAllPairs = hasPermission(address(0), IResupplyPair.pause.selector);
         permissions.cancelProposal = hasPermission(voter, IVoter.cancelProposal.selector);
         permissions.updateProposalDescription = hasPermission(voter, IVoter.updateProposalDescription.selector);
@@ -154,6 +164,8 @@
         permissions.revokeSwapperApprovals = hasPermission(swapper, ISwapperOdos.revokeApprovals.selector);
         permissions.pauseIPWithdrawals = hasPermission(insurancePool, IInsurancePool.setWithdrawTimers.selector);
         permissions.cancelRamp = hasPermission(address(0), IBorrowLimitController.cancelRamp.selector);
+        permissions.updateRedemptionGuardSettings =
+            hasPermission(redemptionHandler, IRedemptionHandler.updateGuardSettings.selector);
         return permissions;
     }
 
@@ -167,7 +179,13 @@
     function _getVoter() internal view returns (address) {
         return registry.getAddress("VOTER");
     }
-}
+
+    function _getRedemptionHandler() internal view returns (address) {
+        return registry.getAddress("REDEMPTION_HANDLER");
+    }
+
+}
+
 
 // SPDX-License-Identifier: MIT
 pragma solidity 0.8.28;
@@ -519,34 +537,6 @@
 }
 
 // SPDX-License-Identifier: MIT
-pragma solidity 0.8.28;
-
-import {ICore} from "../interfaces/ICore.sol";
-
-/**
-    @title Core Ownable
-    @author Prisma Finance (with edits by Resupply Finance)
-    @notice Contracts inheriting `CoreOwnable` have the same owner as `Core`.
-            The ownership cannot be independently modified or renounced.
- */
-contract CoreOwnable {
-    ICore public immutable core;
-
-    constructor(address _core) {
-        core = ICore(_core);
-    }
-
-    modifier onlyOwner() {
-        require(msg.sender == address(core), "!core");
-        _;
-    }
-
-    function owner() public view returns (address) {
-        return address(core);
-    }
-}
-
-// SPDX-License-Identifier: MIT
 // OpenZeppelin Contracts (last updated v5.4.0) (token/ERC20/IERC20.sol)
 
 pragma solidity >=0.4.16;
@@ -928,12 +918,13 @@
         _;
     }
 
-    function owner() external view returns (address) {
+    function owner() public view returns (address) {
         return CORE;
     }
 
     function _authorizeUpgrade(address newImplementation) internal virtual override onlyOwner {}
 }
+
 
 // SPDX-License-Identifier: MIT
 pragma solidity 0.8.28;
@@ -1064,6 +1055,39 @@
 
     // View function for public state variable
     function pairLimits(address _pair) external view returns (PairBorrowLimit memory);
+}
+
+
+// SPDX-License-Identifier: MIT
+pragma solidity 0.8.28;
+
+interface IRedemptionHandler {
+    function baseRedemptionFee() external view returns(uint256);
+    function ratingData(address _pair) external view returns(uint64 _timestamp, uint192 _usage);
+    function totalWeight() external view returns(uint256);
+    function getRedemptionFeePct(address _pair, uint256 _amount) external view returns(uint256);
+    function redeemFromPair (
+        address _pair,
+        uint256 _amount,
+        uint256 _maxFeePct,
+        address _receiver,
+        bool _redeemToUnderlying
+    ) external returns(uint256);
+    function underlyingOracle() external view returns(address);
+
+    function previewRedeem(address _pair, uint256 _amount) external view returns(uint256 _returnedUnderlying, uint256 _returnedCollateral, uint256 _fee);
+    function getMaxRedeemableDebt(address _pair) external view returns (uint256);
+
+    function setWeightLimit(uint256 _weightLimit) external;
+    function setUnderlyingOracle(address _oracle) external;
+    function setOverusageInfo(uint256 _rate, uint256 _start, uint256 _end) external;
+    function setDiscountInfo(uint256 _rate, uint256 _maxUsage, uint256 _maxDiscount) external;
+    function setBaseRedemptionFee(uint256 _fee) external;
+    function updateGuardSettings(bool _guardEnabled, uint256 _permissionlessPriceThreshold) external;
+    function overWeight() external view returns(uint256);
+    function overusageStart() external view returns(uint256);
+    function overusageMax() external view returns(uint256);
+    function overusageRate() external view returns(uint256);
 }
 
 
> ```

> </details>

> 🔒 **Immutable References:** `core()` → Core, `registry()` → ResupplyRegistry

### > 🔴 `upgradeability (UUPS)`

> > ⚠️ **CRITICAL** — Upgradeability allows arbitrary code replacement. Must be behind both a Multisig AND a Timelock.

> **Privileged write functions:**  
> **Capabilities:** ⬆️ **UPGRADE**
> - `upgradeTo(address)` — Upgrade proxy implementation to a new address `[UPGRADE]`
> - `upgradeToAndCall(address,bytes)` — Upgrade proxy implementation and call an initializer `[UPGRADE]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xc07e000044F95655c11fda4cD37F70A94d7e0a7d` | [↳ Core](#c-0xc07e000044f95655c11fda4cd37f70a94d7e0a7d) | 🟠 HIGH | — | Storage only |  |

### > 🟠 `owner()`

> **Privileged write functions:**
> - `setGuardian(address _guardian)`
> - `setGuardedRegistryKey(string memory _key, bool _guarded)`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xc07e000044F95655c11fda4cD37F70A94d7e0a7d` | [↳ Core](#c-0xc07e000044f95655c11fda4cd37f70a94d7e0a7d) | 🟠 HIGH | — | Storage only |  |

### > 🟢 `guardian()` · 🏛️ governance

> **Privileged write functions:**  
> **Capabilities:** ⚙️ **CONFIG** ⏸️ **PAUSE**
> - `pauseAllPairs()` `[PAUSE]`
> - `pausePair(address pair)` `[PAUSE]`
> - `cancelProposal(uint256 proposalId)`
> - `updateProposalDescription(uint256 proposalId, string calldata newDescription)`
> - `setRegistryAddress(string memory _key, address _address)` `[CONFIG]`
> - `revokeSwapperApprovals()`
> - `pauseIPWithdrawals()` — Pause IP Withdrawals by setting the withdraw window to 0 / `[PAUSE]`
> - `cancelRamp(address _pair)` — Cancel borrow limit ramp for a pair on BorrowLimitController /
> - `updateRedemptionGuardSettings(bool guardEnabled, uint256 priceThreshold)` `[PAUSE]`
> - `recoverERC20(IERC20 token)`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xFE11a5009f2121622271e7dd0FD470264e076af6` | [↳ Gnosis Safe 3/5](#c-0xfe11a5009f2121622271e7dd0fd470264e076af6) | 🟢 LOW | — | Storage+Events | 3/5 signers |

> **Signers of `Gnosis Safe 3/5` (0xFE11...6af6):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x4D1b56274C01481C0312fCa332016d83512BEEe3` | EOA | 2026-01-04 | EOA |
> | `0xBd0a74e51729a4D0B92742e67183C4cBc97bCA92` | EOA | 2026-04-20 | EOA |
> | `0x1101c94c6001e4074Ad4dBAd5Ad08117979cA9D4` | EOA | — | EOA |
> | `0x1B1D2806dE441eaaAc7f6677bd15DFa937A5b97c` | EOA | 2026-05-24 | EOA |
> | `0xAAc0aa431c237C2C0B5f041c8e59B3f1a43aC78F` | EOA ⚠️ Hot wallet (2,933 txs) | — | EOA |

> **Quorum history:**
>   - 2025-03-17: ⚪ unchanged 3 → 3

### > 🟠 `CORE()`

> **Privileged write functions:**
> - `setGuardian(address _guardian)`
> - `setGuardedRegistryKey(string memory _key, bool _guarded)`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xc07e000044F95655c11fda4cD37F70A94d7e0a7d` | [↳ Core](#c-0xc07e000044f95655c11fda4cd37f70a94d7e0a7d) | 🟠 HIGH | — | Storage only |  |

> #### 🔧 Permissioned Parameters

> **`guardian`**

> | Field | Value |
> |---|---|
> | Current Value | `0xFE11a5009f2121622271e7dd0FD470264e076af6` |
> | Setter | `setGuardian(address _guardian)` |
> | Gated by | `CORE(), owner()` |
> | Tags | — |
> | Last changed | 2025-08-13 |
> | Changed by | `0xFE11...6af6` (Gnosis Safe 3/5) |
> | Total changes | 1 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `0xFE11a5009f2121622271e7dd0FD470264e076af6` | `0xFE11...6af6` (Gnosis Safe 3/5) | 2025-08-13 |

> **`pauseAllPairs`** ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Setter | `pauseAllPairs()` |
> | Gated by | `guardian()` |
> | Tags | `PAUSE` |
> | Last called | — |
> | Called by | — |
> | Total calls | 0 ❄️ |

> **`pauseIPWithdrawals`** ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Setter | `pauseIPWithdrawals()` |
> | Gated by | `guardian()` |
> | Tags | `PAUSE` |
> | Last called | — |
> | Called by | — |
> | Total calls | 0 ❄️ |

> **`pausePair`** *(per-asset)* 🔄 **ACTIVE** (8 changes)

> > ⚠️ This parameter has been changed **8 times** — monitor for unexpected modifications.

> | Field | Value |
> |---|---|
> | Setter | `pausePair(address pair)` |
> | Gated by | `guardian()` |
> | Tags | `PAUSE` |
> | Last called | 2026-03-16 |
> | Called by | `0xFE11...6af6` (Gnosis Safe 3/5) |
> | Total calls | 8 🔄 |

> **Recent changes (showing last 5 of 8):**

> | # | Asset | Value | Set By | Date |
> |---|---|---|---|---|
> | 1 | Resupply Pair (CurveLend: crvUSD/sDOLA) - 2 | `(Safe-mediated)` | `0xFE11...6af6` (Gnosis Safe 3/5) | 2026-03-16 |
> | 2 | Resupply Pair (CurveLend: crvUSD/sDOLA) - 2 | `(Safe-mediated)` | `0xFE11...6af6` (Gnosis Safe 3/5) | 2026-03-16 |
> | 3 | Resupply Pair (CurveLend: crvUSD/sDOLA) - 2 | `(Safe-mediated)` | `0xFE11...6af6` (Gnosis Safe 3/5) | 2026-03-16 |
> | 4 | Resupply Pair (CurveLend: crvUSD/sDOLA) - 2 | `(Safe-mediated)` | `0xFE11...6af6` (Gnosis Safe 3/5) | 2026-03-16 |
> | 5 | Resupply Pair (CurveLend: crvUSD/sDOLA) - 2 | `(Safe-mediated)` | `0xFE11...6af6` (Gnosis Safe 3/5) | 2026-03-16 |

> **`updateRedemptionGuardSettings`** ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Setter | `updateRedemptionGuardSettings(bool guardEnabled, uint256 priceThreshold)` |
> | Gated by | `guardian()` |
> | Tags | `PAUSE` |
> | Last called | — |
> | Called by | — |
> | Total calls | 0 ❄️ |

---
<a id="c-0x5555555558b7309ecb0fbb23e609ec3c6f74c2ea"></a>
## > ResupplyPairDeployer `0x5555555558B7309ecB0FbB23e609ec3c6f74C2Ea`

> *6 roles · 5 members · 7 functions*

> > 💰 **Inherited supply authority** — holds `pairDeployer (Core operator grant)` on **Core**. Access controls on this contract gate root token supply.

> 🔒 **Immutable References:** `contractAddress1()` → Contract, `core()` → Core, `registry()` → ResupplyRegistry, `govToken()` → RSUP (GovToken), `contractAddress2()` → Contract

### > 🟠 `owner()`

> **Privileged write functions:**  
> **Capabilities:** 💰 **SUPPLY** ⬆️ **UPGRADE**
> - `setCreationCode(bytes calldata _creationCode)` — The ```setCreationCode``` function sets the bytecode for the ResupplyPair splits the data if necessary to accommodate creation code that is slightly larger than 13kb `[UPGRADE]`
> - `setDefaultConfigData(address _oracle, address _rateCalculator, uint256 _maxLTV, uint256 _initialBorrowLimit, uint256 _liquidationFee, uint256 _mintFee, uint256 _protocolRedemptionFee)` — The `setDefaultConfigData` function sets the default configuration data for deployments `[SUPPLY]`
> - `addSupportedProtocol(string memory _protocolName, uint256 _amountToBurn, uint256 _minShareBurnAmount, bytes4 _borrowTokenSig, bytes4 _collateralTokenSig)` — The `addSupportedProtocol` function adds a new protocol configuration to the registry
> - `setApprovedDeployer(address _deployer, bool _approved)`
> - `updateSupportedProtocol(uint256 _protocolId, string memory _protocolName, uint256 _amountToBurn, uint256 _minShareBurnAmount, bytes4 _borrowTokenSig, bytes4 _collateralTokenSig)` — The `updateSupportedProtocol` function updates the supported protocol configuration
> - `deploy(uint256 _protocolId, bytes memory _configData, address _underlyingStaking, uint256 _underlyingStakingId)` — The ```deploy``` function allows the deployment of a ResupplyPair with custom config data Custom config deployments are available to owner only. Approved deployers must use default config. Each deployment also registers the pair in the registry, activating the specified borrow limit.
> - `deployWithDefaultConfig(uint256 _protocolId, address _collateral, address _underlyingStaking, uint256 _underlyingStakingId)` — This ```deploy``` function allows the deployment of a ResupplyPair using default config data All deployments by approved deployers use default config. Each deployment also registers the pair in the registry, activating the specified borrow limit.

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xc07e000044F95655c11fda4cD37F70A94d7e0a7d` | [↳ Core](#c-0xc07e000044f95655c11fda4cd37f70a94d7e0a7d) | 🟠 HIGH | — | Storage only |  |

> #### 🔧 Permissioned Parameters

> **`approvedDeployers`** *(per-asset)*

> | Asset | Current Value |
> |---|---|
> | Gnosis Safe 3/5 `0xFE11...6af6` | `True` |

> | Field | Value |
> |---|---|
> | Setter | `setApprovedDeployer(address _deployer, bool _approved)` |
> | Gated by | `owner()` |
> | Tags | — |
> | Last changed | 2025-08-13 |
> | Changed by | `0xe5Bc...419f` |
> | Total changes | 1 |

> **Recent changes:**

> | # | Asset | Value | Set By | Date |
> |---|---|---|---|---|
> | 1 | Gnosis Safe 3/5 | `—` | `0xe5Bc...419f` | 2025-08-13 |

> #### 💰 Supply Actions

> _Mint / redeem / burn call tracking — last 5 calls per function, total counts preserved._

> **`setDefaultConfigData`** *(per-asset)*

> | Field | Value |
> |---|---|
> | Setter | `setDefaultConfigData(address _oracle, address _rateCalculator, uint256 _maxLTV, uint256 _initialBorrowLimit, uint256 _liquidationFee, uint256 _mintFee, uint256 _protocolRedemptionFee)` |
> | Gated by | `owner()` |
> | Tags | `SUPPLY` |
> | Last called | 2026-06-16 |
> | Called by | `0xe5Bc...419f` |
> | Total calls | 4 |

> **Recent changes:**

> | # | Asset | Value | Set By | Date |
> |---|---|---|---|---|
> | 1 | BasicVaultOracle | `50000000000000000 (0.050000e18)` | `0xe5Bc...419f` | 2026-06-16 |
> | 2 | BasicVaultOracle | `50000000000000000 (0.050000e18)` | `0xfC4B...E4c1` | 2026-02-21 |
> | 3 | BasicVaultOracle | `200000000000000000 (0.200000e18)` | `0xfC4B...E4c1` | 2026-02-05 |
> | 4 | BasicVaultOracle | `200000000000000000 (0.200000e18)` | `0xe5Bc...419f` | 2025-08-13 |

---
<a id="c-0x3f7c15d053ab332d194d0040815e466d34387e40"></a>
## > RedemptionOperator `0x3F7C15d053Ab332D194D0040815E466d34387E40`

> *17 roles · 15 members · 7 functions*

> > ⚠️ **Upgradeable** (UUPS) — impl: `0x67BA21eA5F989A45311FE21E6Ebc75F3f39c6F69`

> **Proxy History (1 event):**

> | # | Date | Event | Address | Key Changes | Tx |
> |---|---|---|---|---|---|
> | 1 | 2026-02-10 | Upgrade | `0x67BA...6F69` | Initial deployment | [0xa551bfec54994df0252f953223908307fc177ba8ea7871dd92a73c0392442f01](https://etherscan.io/tx/0xa551bfec54994df0252f953223908307fc177ba8ea7871dd92a73c0392442f01) |

> > ⚡ **Inherited authority** [CONFIG] — via `redemptionOperator (Core-owned)` on **Core**

> 🔒 **Immutable References:** `reusd()` → reUSD (Stablecoin), `frxusdSfrxusdPool()` → sfrxUSD2 (CurveStableSwapNG), `crvUsdFrxUsdPool()` → crvfrxUSD (CurveStableSwapNG), `treasury()` → Treasury, `registry()` → ResupplyRegistry

### > 🔴 `upgradeability (UUPS)`

> > ⚠️ **CRITICAL** — Upgradeability allows arbitrary code replacement. Must be behind both a Multisig AND a Timelock.

> **Privileged write functions:**  
> **Capabilities:** ⬆️ **UPGRADE**
> - `upgradeTo(address)` — Upgrade proxy implementation to a new address `[UPGRADE]`
> - `upgradeToAndCall(address,bytes)` — Upgrade proxy implementation and call an initializer `[UPGRADE]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xc07e000044F95655c11fda4cD37F70A94d7e0a7d` | [↳ Core](#c-0xc07e000044f95655c11fda4cd37f70a94d7e0a7d) | 🟠 HIGH | — | Storage only |  |

### > 🟠 `owner()`

> **Privileged write functions:**
> - `setManager(address _manager)`
> - `setApprovedCaller(address _caller, bool _status)`
> - `sweep(address token, address to, uint256 amount)`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xc07e000044F95655c11fda4cD37F70A94d7e0a7d` | [↳ Core](#c-0xc07e000044f95655c11fda4cd37f70a94d7e0a7d) | 🟠 HIGH | — | Storage only |  |

### > 🟠 `CORE()`

> **Privileged write functions:**
> - `setManager(address _manager)`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xc07e000044F95655c11fda4cD37F70A94d7e0a7d` | [↳ Core](#c-0xc07e000044f95655c11fda4cd37f70a94d7e0a7d) | 🟠 HIGH | — | Storage only |  |

### > 🟠 `crvUsd()`

> **Privileged write functions:**
> - `onFlashLoan(address initiator, address token, uint256 amount, uint256 fee, bytes calldata data)` — Receive a flash loan. /
> - `onFraxLoan(address asset, uint256 amount, bytes calldata data)`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xf939E0A03FB07F59A73314E73794Be0E57ac1b4E` | crvUSD (crvUSD Stablecoin) | 🟠 HIGH | — | Storage only |  |

### > 🟠 `crvUsdFlashLender()`

> **Privileged write functions:**
> - `onFlashLoan(address initiator, address token, uint256 amount, uint256 fee, bytes calldata data)` — Receive a flash loan. /

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x26dE7861e213A5351F6ED767d00e0839930e9eE1` | [↳ crvUSD FlashLender](#c-0x26de7861e213a5351f6ed767d00e0839930e9ee1) | 🟠 HIGH | — | Storage only |  |

### > 🟠 `frxUsd()`

> **Privileged write functions:**
> - `onFlashLoan(address initiator, address token, uint256 amount, uint256 fee, bytes calldata data)` — Receive a flash loan. /
> - `onFraxLoan(address asset, uint256 amount, bytes calldata data)`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xCAcd6fd266aF91b8AeD52aCCc382b4e165586E29` | frxUSD (TransparentUpgradeableProxy) | 🟠 HIGH | — | Storage only |  |

### > 🟠 `frxUsdFlashLender()`

> **Privileged write functions:**
> - `onFraxLoan(address asset, uint256 amount, bytes calldata data)`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xeeb6b2Feef7BeDb28b9Fa70E1724ea5FC37d42AB` | FraxLoan | 🟠 HIGH | — | Storage only |  |

### > 🟢 `manager()`

> **Privileged write functions:**
> - `setApprovedCaller(address _caller, bool _status)`
> - `sweep(address token, address to, uint256 amount)`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xFE11a5009f2121622271e7dd0FD470264e076af6` | [↳ Gnosis Safe 3/5](#c-0xfe11a5009f2121622271e7dd0fd470264e076af6) | 🟢 LOW | — | Storage+Events | 3/5 signers |

> **Signers of `Gnosis Safe 3/5` (0xFE11...6af6):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x4D1b56274C01481C0312fCa332016d83512BEEe3` | EOA | 2026-01-04 | EOA |
> | `0xBd0a74e51729a4D0B92742e67183C4cBc97bCA92` | EOA | 2026-04-20 | EOA |
> | `0x1101c94c6001e4074Ad4dBAd5Ad08117979cA9D4` | EOA | — | EOA |
> | `0x1B1D2806dE441eaaAc7f6677bd15DFa937A5b97c` | EOA | 2026-05-24 | EOA |
> | `0xAAc0aa431c237C2C0B5f041c8e59B3f1a43aC78F` | EOA ⚠️ Hot wallet (2,933 txs) | — | EOA |

> **Quorum history:**
>   - 2025-03-17: ⚪ unchanged 3 → 3

### > 🟠 `reusdScrvPool()`

> **Privileged write functions:**
> - `onFlashLoan(address initiator, address token, uint256 amount, uint256 fee, bytes calldata data)` — Receive a flash loan. /
> - `onFraxLoan(address asset, uint256 amount, bytes calldata data)`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xc522A6606BBA746d7960404F22a3DB936B6F4F50` | [↳ reusdscrv (CurveStableSwapNG)](#c-0xc522a6606bba746d7960404f22a3db936b6f4f50) | 🟠 HIGH | — | Storage only |  |

### > 🟠 `reusdSfrxPool()`

> **Privileged write functions:**
> - `onFlashLoan(address initiator, address token, uint256 amount, uint256 fee, bytes calldata data)` — Receive a flash loan. /
> - `onFraxLoan(address asset, uint256 amount, bytes calldata data)`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xed785Af60bEd688baa8990cD5c4166221599A441` | [↳ reusdsfrx (CurveStableSwapNG)](#c-0xed785af60bed688baa8990cd5c4166221599a441) | 🟠 HIGH | — | Storage only |  |

### > 🟠 `sCrvUsd()`

> **Privileged write functions:**
> - `onFlashLoan(address initiator, address token, uint256 amount, uint256 fee, bytes calldata data)` — Receive a flash loan. /
> - `onFraxLoan(address asset, uint256 amount, bytes calldata data)`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x0655977FEb2f289A4aB78af67BAB0d17aAb84367` | scrvUSD (Yearn V3 Vault) | 🟠 HIGH | — | Storage only |  |

### > 🟠 `sFrxUsd()`

> **Privileged write functions:**
> - `onFlashLoan(address initiator, address token, uint256 amount, uint256 fee, bytes calldata data)` — Receive a flash loan. /
> - `onFraxLoan(address asset, uint256 amount, bytes calldata data)`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xcf62F905562626CfcDD2261162a51fd02Fc9c5b6` | sfrxUSD (TransparentUpgradeableProxy) | 🟠 HIGH | — | Storage only |  |

> #### 🔧 Permissioned Parameters

> **`approvedCallers`** *(per-asset)* ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Setter | `setApprovedCaller(address _caller, bool _status)` |
> | Gated by | `manager(), owner()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`manager`**

> | Field | Value |
> |---|---|
> | Current Value | `0xFE11a5009f2121622271e7dd0FD470264e076af6` |
> | Setter | `setManager(address _manager)` |
> | Gated by | `CORE(), owner()` |
> | Tags | — |
> | Last changed | 2026-02-10 |
> | Changed by | `0xFE11...6af6` (Gnosis Safe 3/5) |
> | Total changes | 1 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `0xFE11a5009f2121622271e7dd0FD470264e076af6` | `0xFE11...6af6` (Gnosis Safe 3/5) | 2026-02-10 |

> **`MIN_FLASH`** 🔒 **IMMUTABLE**

> > 🔒 **Immutable** — declared as a constant in the contract source; cannot be changed without a contract upgrade. Bounds the reachable extreme of any setter that writes a related storage variable.

> | Field | Value |
> |---|---|
> | Current Value | `5000000000000000000000 (5,000.000000e18)` |
> | Mutability | 🔒 immutable (constant) |
> | Tags | `IMMUTABLE` |

> **`MIN_PROFIT`** 🔒 **IMMUTABLE**

> > 🔒 **Immutable** — declared as a constant in the contract source; cannot be changed without a contract upgrade. Bounds the reachable extreme of any setter that writes a related storage variable.

> | Field | Value |
> |---|---|
> | Current Value | `5000000000000000000 (5.000000e18)` |
> | Mutability | 🔒 immutable (constant) |
> | Tags | `IMMUTABLE` |

---
<a id="c-0x5eeb063d0abefbbc78f576e28d762a16b637a025"></a>
## > RedemptionHandler `0x5eeB063d0abefBBc78F576E28d762a16b637A025`

> *6 roles · 5 members · 7 functions*

> > 💰 **Inherited supply authority** — holds `operators` on **Stablecoin**. Access controls on this contract gate root token supply.

> 🔒 **Immutable References:** `core()` → Core

### > 🟠 `owner()`

> **Privileged write functions:**  
> **Capabilities:** ⚙️ **CONFIG** ⏸️ **PAUSE**
> - `setBaseRedemptionFee(uint256 _fee)` — Sets the base redemption fee. This fee is not the effective fee. The effective fee is calculated at time of redemption via ``getRedemptionFeePct``. `[CONFIG]`
> - `setDiscountInfo(uint256 _rate, uint256 _maxUsage, uint256 _maxDiscount)`
> - `setOverusageInfo(uint256 _rate, uint256 _start, uint256 _end)`
> - `setWeightLimit(uint256 _weightLimit)`
> - `setUnderlyingOracle(address _oracle)`
> - `updateGuardSettings(bool _guardEnabled, uint256 _permissionlessPriceThreshold)` `[PAUSE]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xc07e000044F95655c11fda4cD37F70A94d7e0a7d` | [↳ Core](#c-0xc07e000044f95655c11fda4cd37f70a94d7e0a7d) | 🟠 HIGH | — | Storage only |  |

### > 🟠 `redemptionOperator()`

> **Privileged write functions:**  
> **Capabilities:** 💰 **SUPPLY**
> - `redeemFromPair(address _pair, uint256 _amount, uint256 _maxFeePct, address _receiver, bool _redeemToUnderlying)` — Redeem stablecoins for collateral from a pair `[SUPPLY]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x3F7C15d053Ab332D194D0040815E466d34387E40` | [↳ ERC1967Proxy](#c-0x3f7c15d053ab332d194d0040815e466d34387e40) | 🟠 HIGH | — | Storage only |  |

### > 🟠 `registry()`

> **Privileged write functions:**  
> **Capabilities:** 💰 **SUPPLY**
> - `redeemFromPair(address _pair, uint256 _amount, uint256 _maxFeePct, address _receiver, bool _redeemToUnderlying)` — Redeem stablecoins for collateral from a pair `[SUPPLY]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x10101010E0C3171D894B71B3400668aF311e7D94` | [↳ ResupplyRegistry](#c-0x10101010e0c3171d894b71b3400668af311e7d94) | 🟠 HIGH | — | Storage only |  |

### > 🟠 `underlyingOracle()`


> **Members (1):**

> | Address | Name / Type | Granted | Source | Details |
> |---|---|---|---|---|
> | `0x152Ce2e248A86bd11Ca01502fb8feFBec0fbd5EC` | UnderlyingOracle | — | Storage+Events |  |

> #### 🔧 Permissioned Parameters

> **`baseRedemptionFee`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)*

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `10000000000000000 (0.010000e18)` |
> | Setter | `setBaseRedemptionFee(uint256 _fee)` |
> | Gated by | `owner()` |
> | Tags | `CONFIG` |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`guardEnabled`**

> | Field | Value |
> |---|---|
> | Current Value | `True` |
> | Setter | `updateGuardSettings(bool _guardEnabled, uint256 _permissionlessPriceThreshold)` |
> | Gated by | `owner()` |
> | Tags | `PAUSE` |
> | Last changed | 2026-02-21 |
> | Changed by | `0xfC4B...E4c1` |
> | Total changes | 1 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `True` | `0xfC4B...E4c1` | 2026-02-21 |

> **`maxUsage`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)*

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `400000000000000000 (0.400000e18)` |
> | Setter | `setDiscountInfo(uint256 _rate, uint256 _maxUsage, uint256 _maxDiscount)` |
> | Gated by | `owner()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`underlyingOracle`**

> | Field | Value |
> |---|---|
> | Current Value | `0x152Ce2e248A86bd11Ca01502fb8feFBec0fbd5EC` |
> | Setter | `setUnderlyingOracle(address _oracle)` |
> | Gated by | `owner()` |
> | Tags | — |
> | Last changed | 2026-02-11 |
> | Changed by | `0x152C...d5EC` (UnderlyingOracle) |
> | Total changes | 1 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `0x152Ce2e248A86bd11Ca01502fb8feFBec0fbd5EC` | `0x152C...d5EC` (UnderlyingOracle) | 2026-02-11 |

> #### 💰 Supply Actions

> _Mint / redeem / burn call tracking — last 5 calls per function, total counts preserved._

> **`redeemFromPair`** *(per-asset)* ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Setter | `redeemFromPair(address _pair, uint256 _amount, uint256 _maxFeePct, address _receiver, bool _redeemToUnderlying)` |
> | Gated by | `redemptionOperator(), registry()` |
> | Tags | `SUPPLY` |
> | Last called | — |
> | Called by | — |
> | Total calls | 0 ❄️ |

---
<a id="c-0x88888888c227c36401493ed9f3e3dcc3800b2634"></a>
## > LiquidationHandler `0x88888888c227c36401493Ed9F3e3Dcc3800B2634`

> *4 roles · 3 members · 2 functions*

> > 💰 **Inherited supply authority** — holds `operators` on **Stablecoin**, `liquidationHandler` on **ResupplyRegistry**. Access controls on this contract gate root token supply.

> 🔒 **Immutable References:** `insurancePool()` → reIP (InsurancePool), `core()` → Core, `registry()` → ResupplyRegistry

### > 🟠 `owner()`

> **Privileged write functions:**  
> **Capabilities:** 💰 **SUPPLY**
> - `setLiquidationIncentive(uint256 _incentive)` — Sets Liquidation incentive
> - `distributeCollateralAndClearDebt(address _collateral)` `[SUPPLY]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xc07e000044F95655c11fda4cD37F70A94d7e0a7d` | [↳ Core](#c-0xc07e000044f95655c11fda4cd37f70a94d7e0a7d) | 🟠 HIGH | — | Storage only |  |

> #### 💰 Supply Actions

> _Mint / redeem / burn call tracking — last 5 calls per function, total counts preserved._

> **`distributeCollateralAndClearDebt`** *(per-asset)* ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Setter | `distributeCollateralAndClearDebt(address _collateral)` |
> | Gated by | `owner()` |
> | Tags | `SUPPLY` |
> | Last called | — |
> | Called by | — |
> | Total calls | 0 ❄️ |

---
<a id="c-0x00000000efe883b3304aff71eacf72dbc3e1b577"></a>
## > InsurancePool `0x00000000efe883b3304aFf71eaCf72Dbc3e1b577`

> *5 roles · 6 members · 4 functions*

> > 💰 **Inherited supply authority** — holds `operators` on **Stablecoin**, `insurancePool` on **ResupplyRegistry**. Access controls on this contract gate root token supply.

> 🔒 **Immutable References:** `core()` → Core, `emissionsReceiver()` → SimpleReceiver, `registry()` → ResupplyRegistry

### > 🟠 `owner()`

> **Privileged write functions:**
> - `setWithdrawTimers(uint256 _withdrawLength, uint256 _withdrawWindow)` — set unlock length and withdraw window
> - `setMinimumHeldAssets(uint256 _minimum)` — set a minimum amount of assets that must be kept from being burned

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xc07e000044F95655c11fda4cD37F70A94d7e0a7d` | [↳ Core](#c-0xc07e000044f95655c11fda4cd37f70a94d7e0a7d) | 🟠 HIGH | — | Storage only |  |

### > 🟠 `reward()`

> **Privileged write functions:**
> - `addExtraReward(address _token)`
> - `invalidateReward(address _token)`

> **Members (3):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x419905009e4656fdC02418C7Df35B1E61Ed5F726` | [↳ RSUP (GovToken)](#c-0x419905009e4656fdc02418c7df35b1e61ed5f726) | 🟠 HIGH | — | Events only |  |
> | `0xCAcd6fd266aF91b8AeD52aCCc382b4e165586E29` | frxUSD (TransparentUpgradeableProxy) | 🟠 HIGH | — | Events only |  |
> | `0xf939E0A03FB07F59A73314E73794Be0E57ac1b4E` | crvUSD (crvUSD Stablecoin) | 🟠 HIGH | — | Events only |  |

> #### 🔧 Permissioned Parameters

> **`MAX_WITHDRAW_DELAY`** 🔒 **IMMUTABLE**

> > 🔒 **Immutable** — declared as a constant in the contract source; cannot be changed without a contract upgrade. Bounds the reachable extreme of any setter that writes a related storage variable.

> | Field | Value |
> |---|---|
> | Current Value | `1209600` |
> | Mutability | 🔒 immutable (constant) |
> | Tags | `IMMUTABLE` |

> **`minimumHeldAssets`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)*

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `10000000000000000000000 (10,000.000000e18)` |
> | Setter | `setMinimumHeldAssets(uint256 _minimum)` |
> | Gated by | `owner()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

---
<a id="c-0x3a1e320f289eef2636b6d7aa5c0f9202ee9928e4"></a>
## > ReusdOracle `0x3A1E320f289eeF2636B6D7Aa5C0f9202ee9928e4`

> *7 roles · 7 members · 0 functions*

> > 💰 **Inherited supply authority** — holds `operators` on **Stablecoin**. Access controls on this contract gate root token supply.

> 🔒 **Immutable References:** `sfrxusd()` → sfrxUSD (TransparentUpgradeableProxy), `crvusd()` → crvUSD (crvUSD Stablecoin), `scrvusd()` → scrvUSD (Yearn V3 Vault), `crvusd_oracle()` → AggregatorStablePrice - aggregator of stablecoin prices for crvUSD, `reusd_sfrxusd_pool()` → reusdsfrx (CurveStableSwapNG), `reusd_scrvusd_pool()` → reusdscrv (CurveStableSwapNG), `registry()` → ResupplyRegistry

---
<a id="c-0xaaaa0013e2ec451f76816d1e0a02aba596dd9251"></a>
## > PriceWatcher `0xAaaa0013e2ec451F76816d1e0a02ABA596dd9251`

> *4 roles · 3 members · 1 function*

> > 💰 **Inherited supply authority** — holds `operators` on **Stablecoin**. Access controls on this contract gate root token supply.

> 🔒 **Immutable References:** `core()` → Core, `registry()` → ResupplyRegistry

### > 🟠 `owner()`

> **Privileged write functions:**  
> **Capabilities:** 💰 **SUPPLY**
> - `setOracle()` — The ```setOracle``` function pulls oracle address from registry and sets `[SUPPLY]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xc07e000044F95655c11fda4cD37F70A94d7e0a7d` | [↳ Core](#c-0xc07e000044f95655c11fda4cd37f70a94d7e0a7d) | 🟠 HIGH | — | Storage only |  |

### > 🟠 `oracle()` · 📋 operational


> **Members (1):**

> | Address | Name / Type | Granted | Source | Details |
> |---|---|---|---|---|
> | `0x07Ac1E016D4335FB833666ed5C43846162d2B7e8` | ReusdOracle | — | Storage+Events |  |

> #### 🔧 Permissioned Parameters

> **`UPDATE_INTERVAL`** 🔒 **IMMUTABLE**

> > 🔒 **Immutable** — declared as a constant in the contract source; cannot be changed without a contract upgrade. Bounds the reachable extreme of any setter that writes a related storage variable.

> | Field | Value |
> |---|---|
> | Current Value | `21600` |
> | Mutability | 🔒 immutable (constant) |
> | Tags | `IMMUTABLE` |

> #### 💰 Supply Actions

> _Mint / redeem / burn call tracking — last 5 calls per function, total counts preserved._

> **`setOracle`**

> | Field | Value |
> |---|---|
> | Setter | `setOracle()` |
> | Gated by | `owner()` |
> | Tags | `SUPPLY` |
> | Last called | 2025-08-20 |
> | Called by | `0x07Ac...B7e8` (ReusdOracle) |
> | Total calls | 1 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `0x07Ac1E016D4335FB833666ed5C43846162d2B7e8` | `0x07Ac...B7e8` (ReusdOracle) | 2025-08-20 |

---
<a id="c-0x22222222e9fe38f6f1fc8c61b25228adb4d8b953"></a>
## > GovStaker `0x22222222E9fE38F6f1FC8C61b25228adB4D8B953`

> *7 roles · 6 members · 7 functions*

> 🔒 **Immutable References:** `permaStaker()` → PermaStaker, `core()` → Core, `stakeToken()` → RSUP (GovToken), `registry()` → ResupplyRegistry

### > 🟠 `escrow()`

> **Privileged write functions:**  
> **Capabilities:** 💰 **SUPPLY**
> - `unstake(address _account, address _receiver)`
> - `migrateStake()` — Migrates a perma staker's stake to a new staking contract Only callable when cooldown epochs are set to 0 `[SUPPLY]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x9B44e63FC1a252861BF6D4150B58f2De84B5c135` | [↳ GovStakerEscrow](#c-0x9b44e63fc1a252861bf6d4150b58f2de84b5c135) | 🟠 HIGH | — | Storage only |  |

### > 🟠 `owner()`

> **Privileged write functions:**  
> **Capabilities:** ⚙️ **CONFIG**
> - `setCooldownEpochs(uint24 _epochs)` — Get the current total system weight Also updates local storage values for total weights. Using
> - `addReward(address _rewardsToken, address _rewardsDistributor, uint256 _rewardsDuration)` — Add a new reward token to the staking contract. May only be called by owner, and can't be set to zero address. Add reward tokens sparingly, as each new one
> - `setRewardsDistributor(address _rewardsToken, address _rewardsDistributor)` — Set rewards distributor address for a given reward token. May only be called by owner, and can't be set to zero address.
> - `setRewardsDuration(address _rewardsToken, uint256 _rewardsDuration)` — Set the duration of our rewards period. May only be called by rewards distributor, and must be done after most recent period ends. `[CONFIG]`
> - `recoverERC20(address _tokenAddress, uint256 _tokenAmount)` — Sweep out tokens accidentally sent here. May only be called by owner. If a pool has multiple tokens to sweep out, call this once for each.

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xc07e000044F95655c11fda4cD37F70A94d7e0a7d` | [↳ Core](#c-0xc07e000044f95655c11fda4cd37f70a94d7e0a7d) | 🟠 HIGH | — | Storage only |  |

### > 🟠 `rewardsDistributor()` · 📋 operational


> **Members (1):**

> | Address | Name / Type | Granted | Source | Details |
> |---|---|---|---|---|
> | `0x57aB1E0003F623289CD798B1824Be09a793e4Bec` | [↳ reUSD (Stablecoin)](#c-0x57ab1e0003f623289cd798b1824be09a793e4bec) | — | Events only |  |

> #### 🔧 Permissioned Parameters

> **`cooldownEpochs`**

> | Field | Value |
> |---|---|
> | Current Value | `2` |
> | Setter | `setCooldownEpochs(uint24 _epochs)` |
> | Gated by | `owner()` |
> | Tags | — |
> | Last changed | 2025-03-13 |
> | Changed by | `0x1101...A9D4` (EOA) |
> | Total changes | 1 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `2` | `0x1101...A9D4` (EOA) | 2025-03-13 |
> | 2 | `0` | `constructor` | 2025-03-13 |

> **`getRewardForDuration`** *(per-asset)* ❄️ **DORMANT**

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Setter | `setRewardsDuration(address _rewardsToken, uint256 _rewardsDuration)` |
> | Gated by | `owner()` |
> | Tags | `CONFIG` |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`MAX_COOLDOWN_DURATION`** 🔒 **IMMUTABLE**

> > 🔒 **Immutable** — declared as a constant in the contract source; cannot be changed without a contract upgrade. Bounds the reachable extreme of any setter that writes a related storage variable.

> | Field | Value |
> |---|---|
> | Current Value | `7776000` |
> | Mutability | 🔒 immutable (constant) |
> | Tags | `IMMUTABLE` |

> #### 💰 Supply Actions

> _Mint / redeem / burn call tracking — last 5 calls per function, total counts preserved._

> **`migrateStake`** ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Setter | `migrateStake()` |
> | Gated by | `escrow()` |
> | Tags | `SUPPLY` |
> | Last called | — |
> | Called by | — |
> | Total calls | 0 ❄️ |

---
<a id="c-0xc522a6606bba746d7960404f22a3db936b6f4f50"></a>
## > CurveStableSwapNG `0xc522A6606BBA746d7960404F22a3DB936B6F4F50`

> *0 roles · 0 members · 0 functions*

> > ⚡ **Inherited authority** [CONFIG] — via `reusdScrvPool()` on **RedemptionOperator**

> _No roles detected._

---
<a id="c-0xed785af60bed688baa8990cd5c4166221599a441"></a>
## > CurveStableSwapNG `0xed785Af60bEd688baa8990cD5c4166221599A441`

> *0 roles · 0 members · 0 functions*

> > ⚡ **Inherited authority** [CONFIG] — via `reusdSfrxPool()` on **RedemptionOperator**

> _No roles detected._

---
<a id="c-0x26de7861e213a5351f6ed767d00e0839930e9ee1"></a>
## > crvUSD FlashLender `0x26dE7861e213A5351F6ED767d00e0839930e9eE1`

> *0 roles · 0 members · 0 functions*

> > ⚡ **Inherited authority** [CONFIG] — via `crvUsdFlashLender()` on **RedemptionOperator**

> _No roles detected._

---
<a id="c-0x419905009e4656fdc02418c7df35b1e61ed5f726"></a>
## > GovToken `0x419905009e4656fdC02418C7Df35B1E61Ed5F726`

> *6 roles · 4 members · 11 functions*

> > 💰 **Inherited supply authority** — holds `operators` on **Stablecoin**, `insurancePool` on **ResupplyRegistry**. Access controls on this contract gate root token supply.

> 🔒 **Immutable References:** `oApp()` → RSUP (GovToken), `token()` → RSUP (GovToken), `core()` → Core

> #### 🌉 LayerZero v2 — Cross-chain Verifier (DVN) Config

> > Endpoint `0x1a44...728c` · 0 peer(s)

> > _No peers configured — OFT surface exists but is dormant._

### > 🟠 `endpoint()`

> **Privileged write functions:**  
> **Capabilities:** 💰 **SUPPLY**
> - `send(SendParam calldata _sendParam, MessagingFee calldata _fee, address _refundAddress)` — Executes the send operation. - nativeFee: The native fee. `[SUPPLY]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x1a44076050125825900e736c501f859c50fE728c` | [↳ EndpointV2](#c-0x1a44076050125825900e736c501f859c50fe728c) | 🟠 HIGH | — | Storage only |  |

### > 🟠 `minter()`

> **Privileged write functions:**  
> **Capabilities:** 💰 **SUPPLY**
> - `mint(address _to, uint256 _amount)` — (auto) Create new tokens, increasing total supply `[SUPPLY]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x33333333df05b0D52edD13D230461E5A0f5a4706` | [↳ EmissionsController](#c-0x33333333df05b0d52edd13d230461e5a0f5a4706) | 🟠 HIGH | — | Storage+Events |  |

### > 🟠 `owner()`

> **Privileged write functions:**  
> **Capabilities:** 💰 **SUPPLY**
> - `setMinter(address _minter)` — (auto) Set the address authorized to mint tokens `[SUPPLY]`
> - `finalizeMinter()`
> - `renounceOwnership()` — Leaves the contract without owner. It will not be possible to call `onlyOwner` functions. Can only be called by the current owner.
> - `transferOwnership(address newOwner)` — Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner.
> - `setMsgInspector(address _msgInspector)` — Sets the message inspector address for the OFT. This is an optional contract that can be used to inspect both 'message' and 'options'.
> - `setEnforcedOptions(EnforcedOptionParam[] calldata _enforcedOptions)` — Sets the enforced options for specific endpoint and message type combinations. Only the owner/admin of the OApp can call this function.
> - `setPreCrime(address _preCrime)` — Sets the preCrime contract address. /
> - `setPeer(uint32 _eid, bytes32 _peer)` — Sets the peer address (OApp instance) for a corresponding endpoint. Only the owner/admin of the OApp can call this function.
> - `setDelegate(address _delegate)` — Sets the delegate address for the OApp. Only the owner/admin of the OApp can call this function.

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xc07e000044F95655c11fda4cD37F70A94d7e0a7d` | [↳ Core](#c-0xc07e000044f95655c11fda4cd37f70a94d7e0a7d) | 🟠 HIGH | — | Storage+Events |  |

> #### 🔧 Permissioned Parameters

> **`minter`**

> | Field | Value |
> |---|---|
> | Current Value | `0x33333333df05b0D52edD13D230461E5A0f5a4706` |
> | Setter | `setMinter(address _minter)` |
> | Gated by | `owner()` |
> | Tags | `SUPPLY` |
> | Last changed | 2025-03-13 |
> | Changed by | `0x3333...4706` (EmissionsController) |
> | Total changes | 1 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `0x33333333df05b0D52edD13D230461E5A0f5a4706` | `0x3333...4706` (EmissionsController) | 2025-03-13 |

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

> #### 💰 Supply Actions

> _Mint / redeem / burn call tracking — last 5 calls per function, total counts preserved._

> **`mint`** *(per-asset)* ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Setter | `mint(address _to, uint256 _amount)` |
> | Gated by | `minter()` |
> | Tags | `SUPPLY` |
> | Last called | — |
> | Called by | — |
> | Total calls | 0 ❄️ |

> **`send`** *(per-asset)* ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Setter | `send(SendParam calldata _sendParam, MessagingFee calldata _fee, address _refundAddress)` |
> | Gated by | `endpoint()` |
> | Tags | `SUPPLY` |
> | Last called | — |
> | Called by | — |
> | Total calls | 0 ❄️ |

---
<a id="c-0x9b44e63fc1a252861bf6d4150b58f2de84b5c135"></a>
## > GovStakerEscrow `0x9B44e63FC1a252861BF6D4150B58f2De84B5c135`

> *0 roles · 0 members · 0 functions*

> > 💰 **Inherited supply authority** — holds `escrow()` on **GovStaker**. Access controls on this contract gate root token supply.

> _No roles detected._

---
<a id="c-0x33333333df05b0d52edd13d230461e5a0f5a4706"></a>
## > EmissionsController `0x33333333df05b0D52edD13D230461E5A0f5a4706`

> *3 roles · 2 members · 6 functions*

> > 💰 **Inherited supply authority** — holds `operators` on **Stablecoin**, `insurancePool` on **ResupplyRegistry**, `minter()` on **GovToken**. Access controls on this contract gate root token supply.

> 🔒 **Immutable References:** `core()` → Core, `govToken()` → RSUP (GovToken)

### > 🟠 `owner()`

> **Privileged write functions:**  
> **Capabilities:** 💰 **SUPPLY**
> - `setReceiverWeights(uint256[] memory _receiverIds, uint256[] memory _newWeights)` — Sets the weights for receivers / `[SUPPLY]`
> - `registerReceiver(address _receiver)` — Registers a new receiver /
> - `deactivateReceiver(uint256 _id)` — Deactivates a receiver, preventing them from receiving future emissions. All deactivations should be accompanied by a reallocation of its existing weight via setReceiverWeights(). `[SUPPLY]`
> - `activateReceiver(uint256 _id)` — Activates a receiver, allowing them to receive emissions. Receivers are activated when registered, so this is only needed for previously deactivated receivers. `[SUPPLY]`
> - `setEmissionsSchedule(uint256[] memory _rates, uint256 _epochsPer, uint256 _tailRate)` — Sets the emissions schedule and epochs per schedule item Rates must be in reverse order. Last item will be used first. No rate can be greater than the previous rate. `[SUPPLY]`
> - `recoverUnallocated(address _recipient)` — Recovers any unallocated emissions and sends them to the specified recipient Can only be called by the owner (Core contract)

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xc07e000044F95655c11fda4cD37F70A94d7e0a7d` | [↳ Core](#c-0xc07e000044f95655c11fda4cd37f70a94d7e0a7d) | 🟠 HIGH | — | Storage only |  |

> #### 🔧 Permissioned Parameters

> **`epochsPer`**

> | Field | Value |
> |---|---|
> | Current Value | `52` |
> | Setter | `setEmissionsSchedule(uint256[] memory _rates, uint256 _epochsPer, uint256 _tailRate)` |
> | Gated by | `owner()` |
> | Tags | `SUPPLY` |
> | Last changed | 2025-03-13 |
> | Changed by | `constructor` |
> | Total changes | 1 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `52` | `constructor` | 2025-03-13 |

> #### 💰 Supply Actions

> _Mint / redeem / burn call tracking — last 5 calls per function, total counts preserved._

> **`activateReceiver`** ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Setter | `activateReceiver(uint256 _id)` |
> | Gated by | `owner()` |
> | Tags | `SUPPLY` |
> | Last called | — |
> | Called by | — |
> | Total calls | 0 ❄️ |

> **`deactivateReceiver`** ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Setter | `deactivateReceiver(uint256 _id)` |
> | Gated by | `owner()` |
> | Tags | `SUPPLY` |
> | Last called | — |
> | Called by | — |
> | Total calls | 0 ❄️ |

> **`setReceiverWeights`**

> | Field | Value |
> |---|---|
> | Setter | `setReceiverWeights(uint256[] memory _receiverIds, uint256[] memory _newWeights)` |
> | Gated by | `owner()` |
> | Tags | `SUPPLY` |
> | Last called | 2025-07-18 |
> | Called by | `0x947B...0277` |
> | Total calls | 2 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `64` | `0x947B...0277` | 2025-07-18 |
> | 2 | `64` | `0x1101...A9D4` (EOA) | 2025-03-13 |

---
## ⚡ Authority Concentration

The following addresses hold permissions across multiple contracts or roles in this dependency stack. Concentration of authority increases systemic risk — a single compromised key or colluding multisig can affect multiple systems.

### 🟠 `0xc07e000044F95655c11fda4cD37F70A94d7e0a7d` — Core
Controls **24 role(s)** across **18 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| Stablecoin `0x57aB...4Bec` | `owner()` | `setOperator(address _operator, bool _valid)`, `mint(address _to, uint256 _amount)`, `renounceOwnership()`, `transferOwnership(address newOwner)` +5 more | — |
| ResupplyRegistry `0x1010...7D94` | `owner()` | `setL2Manager(address _newAddress)`, `setLiquidationHandler(address _newAddress)`, `setFeeDeposit(address _newAddress)`, `setRedemptionHandler(address _newAddress)` +9 more | — |
| Voter `0x1111...76E6` | `owner()` | `cancelProposal(uint256 id)`, `setMinCreateProposalPct(uint256 pct)`, `setQuorumPct(uint256 pct)`, `setMinTimeBetweenProposals(uint256 _cooldown)` +3 more | — |
| VeCrvOperator `0x03E1...d341` | `owner()` | `setManager(address _manager)`, `claimFees()`, `claimFees(bool wrap, address recipient)`, `delegateBoost()` +5 more | — |
| PairAdder `0x0950...1D27` | `owner()` | `addPair(address _pair)` | — |
| BorrowLimitController `0x0950...BB7D` | `owner()` | `cancelRamp(address _pair)`, `setPairBorrowLimitRamp(address _pair, uint256 _newBorrowLimit, uint256 _endTime)` | — |
| TreasuryManagerUpgradeable `0x4CF9...0403` | `CORE()` | `setManager(address _manager)` | — |
| TreasuryManagerUpgradeable `0x4CF9...0403` | `owner()` | `setManager(address _manager)` | — |
| TreasuryManagerUpgradeable `0x4CF9...0403` | `upgradeability (UUPS)` | `upgradeTo(address)`, `upgradeToAndCall(address,bytes)` | — |
| UpgradeOperator `0x82ba...5543` | `owner()` | `setManager(address _manager)`, `upgradeToAndCall(address target, address newImplementation, bytes calldata data)` | — |
| GuardianUpgradeable `0xA474...74E3` | `CORE()` | `setGuardian(address _guardian)`, `setGuardedRegistryKey(string memory _key, bool _guarded)` | — |
| GuardianUpgradeable `0xA474...74E3` | `owner()` | `setGuardian(address _guardian)`, `setGuardedRegistryKey(string memory _key, bool _guarded)` | — |
| GuardianUpgradeable `0xA474...74E3` | `upgradeability (UUPS)` | `upgradeTo(address)`, `upgradeToAndCall(address,bytes)` | — |
| ResupplyPairDeployer `0x5555...C2Ea` | `owner()` | `setCreationCode(bytes calldata _creationCode)`, `setDefaultConfigData(address _oracle, address _rateCalculator, uint256 _maxLTV, uint256 _initialBorrowLimit, uint256 _liquidationFee, uint256 _mintFee, uint256 _protocolRedemptionFee)`, `addSupportedProtocol(string memory _protocolName, uint256 _amountToBurn, uint256 _minShareBurnAmount, bytes4 _borrowTokenSig, bytes4 _collateralTokenSig)`, `setApprovedDeployer(address _deployer, bool _approved)` +3 more | — |
| RedemptionOperator `0x3F7C...7E40` | `CORE()` | `setManager(address _manager)` | — |
| RedemptionOperator `0x3F7C...7E40` | `owner()` | `setManager(address _manager)`, `setApprovedCaller(address _caller, bool _status)`, `sweep(address token, address to, uint256 amount)` | — |
| RedemptionOperator `0x3F7C...7E40` | `upgradeability (UUPS)` | `upgradeTo(address)`, `upgradeToAndCall(address,bytes)` | — |
| RedemptionHandler `0x5eeB...A025` | `owner()` | `setBaseRedemptionFee(uint256 _fee)`, `setDiscountInfo(uint256 _rate, uint256 _maxUsage, uint256 _maxDiscount)`, `setOverusageInfo(uint256 _rate, uint256 _start, uint256 _end)`, `setWeightLimit(uint256 _weightLimit)` +2 more | — |
| LiquidationHandler `0x8888...2634` | `owner()` | `setLiquidationIncentive(uint256 _incentive)`, `distributeCollateralAndClearDebt(address _collateral)` | — |
| InsurancePool `0x0000...b577` | `owner()` | `setWithdrawTimers(uint256 _withdrawLength, uint256 _withdrawWindow)`, `setMinimumHeldAssets(uint256 _minimum)` | — |
| PriceWatcher `0xAaaa...9251` | `owner()` | `setOracle()` | — |
| GovStaker `0x2222...B953` | `owner()` | `setCooldownEpochs(uint24 _epochs)`, `addReward(address _rewardsToken, address _rewardsDistributor, uint256 _rewardsDuration)`, `setRewardsDistributor(address _rewardsToken, address _rewardsDistributor)`, `setRewardsDuration(address _rewardsToken, uint256 _rewardsDuration)` +1 more | — |
| GovToken `0x4199...F726` | `owner()` | `setMinter(address _minter)`, `finalizeMinter()`, `renounceOwnership()`, `transferOwnership(address newOwner)` +5 more | — |
| EmissionsController `0x3333...4706` | `owner()` | `setReceiverWeights(uint256[] memory _receiverIds, uint256[] memory _newWeights)`, `registerReceiver(address _receiver)`, `deactivateReceiver(uint256 _id)`, `activateReceiver(uint256 _id)` +2 more | — |

### 🟢 `0xFE11a5009f2121622271e7dd0FD470264e076af6` — Gnosis Safe 3/5
Controls **6 role(s)** across **6 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| Core `0xc07e...0a7d` | `Core operator grant (1 grant(s): setVoter)` | `setVoter(address)` | — |
| VeCrvOperator `0x03E1...d341` | `manager()` | `claimFees()`, `claimFees(bool wrap, address recipient)`, `delegateBoost()`, `extendLock()` +4 more | — |
| TreasuryManagerUpgradeable `0x4CF9...0403` | `manager()` | `retrieveToken(address _token, address _to)`, `retrieveTokenExact(address _token, address _to, uint256 _amount)`, `retrieveETH(address _to)`, `retrieveETHExact(address _to, uint256 _amount)` +9 more | — |
| UpgradeOperator `0x82ba...5543` | `manager()` | `upgradeToAndCall(address target, address newImplementation, bytes calldata data)` | — |
| GuardianUpgradeable `0xA474...74E3` | `guardian()` | `pauseAllPairs()`, `pausePair(address pair)`, `cancelProposal(uint256 proposalId)`, `updateProposalDescription(uint256 proposalId, string calldata newDescription)` +6 more | — |
| RedemptionOperator `0x3F7C...7E40` | `manager()` | `setApprovedCaller(address _caller, bool _status)`, `sweep(address token, address to, uint256 amount)` | — |

### 🟠 `0x1a44076050125825900e736c501f859c50fE728c` — EndpointV2
Controls **2 role(s)** across **2 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| Stablecoin `0x57aB...4Bec` | `endpoint()` | `send(SendParam calldata _sendParam, MessagingFee calldata _fee, address _refundAddress)` | — |
| GovToken `0x4199...F726` | `endpoint()` | `send(SendParam calldata _sendParam, MessagingFee calldata _fee, address _refundAddress)` | — |

### 🟠 `0x10101010E0C3171D894B71B3400668aF311e7D94` — ResupplyRegistry
Controls **2 role(s)** across **2 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| Stablecoin `0x57aB...4Bec` | `operators` | `operators` | — |
| RedemptionHandler `0x5eeB...A025` | `registry()` | `redeemFromPair(address _pair, uint256 _amount, uint256 _maxFeePct, address _receiver, bool _redeemToUnderlying)` | — |

### 🟠 `0x0950000465476F4470e74AeD93E7dd414012BB7D` — BorrowLimitController
Controls **2 role(s)** across **1 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| Core `0xc07e...0a7d` | `Core operator grant (1 grant(s): 0xe7a33174)` | `0xe7a33174` | — |
| Core `0xc07e...0a7d` | `borrowLimitController (Core operator grant)` | `operatorPermissions[BorrowLimitController][*][setBorrowLimit]` | — |

### 🟠 `0x82ba27ee62Fc490f81feFCE5AC9C2f238F8b5543` — UpgradeOperator
Controls **2 role(s)** across **1 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| Core `0xc07e...0a7d` | `Core operator grant (2 grant(s): upgradeToAndCall)` | `upgradeToAndCall(address,bytes)`, `upgradeToAndCall(address,bytes)` | — |
| Core `0xc07e...0a7d` | `upgradeOperator (Core operator grant)` | `operatorPermissions[UpgradeOperator][*][upgradeToAndCall]` | — |

### 🟠 `0xA4745e0B1F40ab3DCFD98F381835De591a8974E3` — ERC1967Proxy
Controls **2 role(s)** across **1 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| Core `0xc07e...0a7d` | `Core operator grant (9 grant(s): 0x193e3f0a, 0x398d2ce9, 0x8456cb59, 0x9265a7d5 …)` | `0x193e3f0a`, `0x398d2ce9`, `0x8456cb59`, `0x9265a7d5` +5 more | — |
| Core `0xc07e...0a7d` | `guardian (Core operator grant)` | `operatorPermissions[UpgradeOperator][GuardianUpgradeable][pauseAllPairs...]` | — |

### 🟠 `0x3F7C15d053Ab332D194D0040815E466d34387E40` — ERC1967Proxy
Controls **2 role(s)** across **2 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| Core `0xc07e...0a7d` | `redemptionOperator (Core-owned)` | `owner() [RedemptionOperator.setManager/setApprovedCaller/sweep]` | — |
| RedemptionHandler `0x5eeB...A025` | `redemptionOperator()` | `redeemFromPair(address _pair, uint256 _amount, uint256 _maxFeePct, address _receiver, bool _redeemToUnderlying)` | — |

### 🟠 `0xCAcd6fd266aF91b8AeD52aCCc382b4e165586E29` — frxUSD (TransparentUpgradeableProxy)
Controls **2 role(s)** across **2 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| RedemptionOperator `0x3F7C...7E40` | `frxUsd()` | `onFlashLoan(address initiator, address token, uint256 amount, uint256 fee, bytes calldata data)`, `onFraxLoan(address asset, uint256 amount, bytes calldata data)` | — |
| InsurancePool `0x0000...b577` | `reward()` | `addExtraReward(address _token)`, `invalidateReward(address _token)` | — |

### 🟠 `0xf939E0A03FB07F59A73314E73794Be0E57ac1b4E` — crvUSD (crvUSD Stablecoin)
Controls **2 role(s)** across **2 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| RedemptionOperator `0x3F7C...7E40` | `crvUsd()` | `onFlashLoan(address initiator, address token, uint256 amount, uint256 fee, bytes calldata data)`, `onFraxLoan(address asset, uint256 amount, bytes calldata data)` | — |
| InsurancePool `0x0000...b577` | `reward()` | `addExtraReward(address _token)`, `invalidateReward(address _token)` | — |


---
## ⛔ Sanctions Screening

| Source | Status |
|---|---|
| OFAC SDN | ✅ OFAC SDN screened (100 ETH addresses, cache: 2026-07-28) |
| Chainalysis | ✅ Chainalysis screened |
| **Result** | 56 addresses screened · ✅ 0 flagged |

---
## EOA Exposure Summary

✅ No direct EOA role holders detected.

---
## ✅ Scan Integrity

No issues detected. All block ranges covered, source and ABI resolved for all contracts.
