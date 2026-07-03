# Trustfall — Access Control Report — Re Protocol Deposit Token (reUSD)

| Field | Value |
|---|---|
| Contract | `0x5086bf358635B81D8C47C66d1C8b9E567Db70c72` |
| Token | Re Protocol Deposit Token (reUSD) |
| Name | reUSD (ERC1967Proxy) [ShareToken] |
| Chain | Ethereum |
| Proxy Status | ⚠️ **YES** — UUPS (upgradable) → `0xb5276c436F65913Cd5332DE745d04feDEb4a21D4` |
| OZ AccessControl | ✅ Yes |
| Ownable | ❌ No |
| Pausable | — |
| ERC-4626 Vault | — |
| Control Surface | ⚠️ Hybrid — 7 off-chain dependencies (custody, oracle, attestation, compliance, backing, redemption, governance) |
| Scan Integrity | ✅ No issues detected |
| Report Date | 2026-07-03 02:46 UTC |

### Surface Summary

| Field | Value |
|---|---:|
| Contracts | 16 |
| Role slots | 113 |
| Privileged Fns | 113 |
| EOA Holders | 10 ⚠️ |
| Critical Roles | 16 ⚠️ |

## Changes Since Last Scan

> Comparing **2026-07-03T01:37:54Z** (block 25448683) → **2026-07-03T02:45:57Z** (block 25449030).

> ✅ No changes to roles, parameters, contracts, or findings.


## 📋 Protocol Context

> *From protocol profile: Re Protocol / reUSD (Wrapper)*

<details>
<summary><strong>Architecture</strong></summary>

- **What reUSD is:** reUSD (0x5086bf358635B81D8C47C66d1C8b9E567Db70c72) is the senior-tranche deposit token of Re Protocol's reinsurance capital stack. It is a plain ERC-20 (OpenZeppelin AccessControl + UUPS proxy, with no transfer hooks and no blacklist or pause on the token itself). Holders do not rebase; instead the token carries its value through a single appreciating share price (NAV per share), which rises as off-chain reinsurance treaties and an Ethena basis trade produce yield. In credit terms reUSD sits at the top of a three-part loss waterfall: the reinsurer's own equity absorbs first loss, then the junior reUSDe tranche, and reUSD absorbs last.
- **Minting and accepted collateral:** minting is permissionless (subject to KYC) — a user calls deposit(token, amount, minShares) on the InsuranceCapitalLayer, or ICL (0x4691C475bE804Fa85f91c2D6D0aDf03114de3093), which pulls the collateral, values it, and mints reUSD to the depositor at the current share ratio. The accepted-collateral roster — which stablecoins are admitted, each one's price oracle, and its minimum deposit size — lives in the DepositTokenRegistry (0x73d37A98C0fCBd049BfFFfe67Bf9af36d603c0F6). The collateral currently backing reUSD on-chain is held in USDC, USDT, USDe and sUSDe, each valued through its own live status-guarded price oracle (the mint reverts on a STALE / INVALID / VOLATILE status, and the sUSDe feed is price-capped) that converts the deposit to a dollar value before the share math runs.
- **How the share price works (the NAV feed):** the mint/redeem ratio is one number — the live sharePrice stored on the SharePriceCalculator (0xd1D104a7515989ac82F1AFDa15a23650411b05B8), currently about 1.0869 (1e18 scale). The ICL sizes every deposit and redemption from it: convertToShares divides the collateral's dollar value by sharePrice (a higher price mints fewer reUSD per dollar and returns more collateral per reUSD), and convertFromShares is the inverse. The price is computed off-chain daily by a JavaScript job on the Chainlink Functions DON, returned as an 18-decimal number to the NAVConsumer (0x84d4eaeb10f9E57b67622f667C6c13E22fA4b2B6), which validates it and calls setSharePrice on the calculator. The NAVConsumer contract is the only holder of PRICE_SETTER_ROLE, so no EOA writes the price directly. A second, structurally identical NAVConsumer serves the junior reUSDe stack's own separate NAV feed.
- **NAV cadence and the deviation guard:** the feed refreshes once per day — Chainlink Automation opens a 15-minute window near 23:45 UTC and fires only after more than 20 hours since the last update, at which point keeper EOA 0x3B018eA1105C5b2E14Df25e029a1C090cE54FC5b calls performUpkeep to trigger the Functions request. When the DON returns the value, the NAVConsumer runs a deviation guard: if the new NAV is more than maxDeviationBps (1000 = 10%) away from the last, it rejects the update and pauses the feed rather than writing the jump. A separate path, forceNAVUpdate(navValue, reason), writes a chosen NAV directly and bypasses both the Functions feed and the deviation guard; it is held by EMERGENCY_UPDATER_ROLE (the 3-of-5 Safe 0x8eec10616802Ef639CA55c98ac856553fAdEfBaD) and is throttled only by a hard 4-hour floor between calls. It has been used once, on 2026-06-25, to refresh the NAV while the Functions router was paused.
- **How reUSD is redeemed:** redemption runs in tiers. Only the instant tier is fully on-chain — InstantRedemption (0xa31deEbb3680A3007120e74bCbDf4df36F042A40) burns reUSD and pays out an on-chain payout token (currently sUSDe), KYC-gated and metered by a daily cap (dailyLimitBps 2000 = 20% of the instant-tier reserve capacity) and a per-user cap (userLimitBps 1000 = 10% of that capacity), with a redemption fee currently at 6 bps. Its on-chain liquidity lives in the RedemptionVault (0x5C454f5526e41fBE917b63475CD8CA7E4631B147) and is refilled from custody via depositFromCustodian. Redemptions past the instant caps fall to the scheduled / window tiers (WindowRedemption, RedemptionGateway, PriceRouter, PayoutTokenRegistry), which are operated off-chain; in practice the on-chain instant path currently sees little activity, so most exits run through the off-chain window tiers.
- **Cross-chain via Chainlink CCIP:** reUSD moves between Ethereum and other chains on Chainlink CCIP under a burn-and-mint model, so total supply across all chains is conserved as tokens move. A single CCIP token pool, the BurnWithFromMintTokenPool (0xF00B3b06690bC7E2bC6A9ccae55d17b7CD818465), holds MINTER_ROLE on reUSD (granted 2026-06-10) and is the only cross-chain actor that changes Ethereum-side supply: an outbound transfer runs lockOrBurn to burn the local reUSD, and an inbound transfer runs releaseOrMint to mint it. Those functions are called only by the CCIP onRamp/offRamp, never by users directly. The pool's owner and its CCIP TokenAdminRegistry (0xb22764f98dD05c789929716D677382Df22C05Cb6) administrator is the 3-of-5 Safe 0x8eec10616802Ef639CA55c98ac856553fAdEfBaD; eleven lanes are live (docs list Avalanche, Arbitrum, Base, BNB Chain, Katana, Ink), each metering inbound mint flow at roughly 1M reUSD. This CCIP setup replaced Re's earlier LayerZero bridge, whose ShareTokenMinterBurner lost MINTER_ROLE on 2026-05-16 and whose ReMintBurnAdapter is now inert.
- **Backing and tranche structure:** total backing equals reUSD supply times NAV (a recent scan: ~140.3M reUSD x 1.0869 = about $152.5M). Only a minority of that (~26% in that scan) sits on-chain as deposited collateral, spread across the ICL, the RedemptionVault, a Reserves account (0x7E499842E7634cce793FFD5D44383BB4a2F086e0), the FeeVault (0x2DF87810fCF9b8e6a42adC5923Bc2EE0ca0467CA) and the custodian address. The majority is off-chain, deployed into a fully-collateralized quota-share reinsurance treaty (sole reinsurer Cover Re SPC Ltd, Cayman-licensed), short-dated US T-bills, an NY Regulation-114 trust, and an Ethena sUSDe/USDe basis trade on undeployed capital. The loss waterfall (senior absorbs last) runs reinsurer equity (~$77M as of 2026-06) then the reUSDe junior tranche then reUSD.
- **Custody sweep and daily attestation:** deposited collateral does not idle on-chain. withdrawToCustodian(custodian, token, amount) on the ICL moves the free (unlocked) balance out to a whitelisted custodian, today the Fireblocks-managed address 0x295F67Fdb21255A3Db82964445628a706FBe689E (docs cite 3-of-5 / 5-of-8 MPC); depositFromCustodian is the return leg. The custodian whitelist itself is edited by addCustodian under CUSTODIAN_MANAGER_ROLE, held by the 2-day TimelockController. Because most backing is off-chain, its total is evidenced by a daily attestation from The Network Firm, published as a Chainlink Proof-of-Reserve feed on Avalanche ('Re Offchain Reserves', 0xc79a363a3f849d8b3F6A1932f748eA9d4fB2f607, covering reUSD + reUSDe). There is no Ethereum-side PoR feed and the reUSD NAVConsumer does not read the Avalanche feed; on Ethereum the attestation surfaces only indirectly, through the NAV value and its refresh cadence.
- **Governance topology:** after a June-2026 re-architecture the redemption, payout, pricing and staking layer moved behind a single OpenZeppelin AccessManager (0x3f0DA1C363e34802C6f12F9C27276dC0e6696FD8), while the core token, oracle and registry contracts (ShareToken MINTER, SharePriceCalculator PRICE_SETTER, DepositTokenRegistry, NAVConsumer) remain direct OZ AccessControl administered by the Safe 3/5 — both replacing the earlier per-contract EOA-held roles. A Gnosis Safe 3-of-5 (0x8eec10616802Ef639CA55c98ac856553fAdEfBaD) is the AccessManager root admin and also owns the CCIP pool. A 2-day TimelockController (0x69dDEa332723cF5407151aAF68B9b076557FCA93) guards UUPS proxy upgrades and the custodian whitelist (CUSTODIAN_MANAGER_ROLE / addCustodian on the ICL); separately, the 2-day delay on the custody-sweep (AM role 17330) and oracle-repoint (AM role 13724) roles is the AccessManager's own per-role grant/exec delay, administered by the Safe as roleAdmin, not the Timelock. Privileged actions are invoked through AccessManager.execute by the members of each function's AM role; the custody-sweep role is held by two operator EOAs (0x6C15B25E9750Dccb698C1a4023f34015bFe57649 and 0x99177B4E1Ec3076BE0a91511aabB9cC9aFA61989) plus the Safe, at zero execution delay.
- **Daily operations:** the dominant on-chain signal is one heartbeat — the once-per-day setSharePrice write on the SharePriceCalculator, a small monotonic upward step of roughly +1.8 bps/day (421 recorded changes, latest ~1.086893e18), landed by the Chainlink Functions callback after keeper 0x3B018eA1105C5b2E14Df25e029a1C090cE54FC5b opens the ~23:45 UTC window. Around it, users deposit stablecoins into the ICL to mint (permissionless, KYC-gated), and operator EOA 0x6C15B25E9750Dccb698C1a4023f34015bFe57649 periodically sweeps deposited backing to the Fireblocks custodian via withdrawToCustodian. Less frequent, non-daily touches include the redemption-config operator 0xEE16bE0374f2eFb34218affC1a8EbEe9310c47f8 tuning InstantRedemption economics (fee, caps, range) and the Safe 3/5 (0x8eec10616802Ef639CA55c98ac856553fAdEfBaD) maintaining the DepositTokenRegistry via ADMIN_ROLE (per-collateral minimums and which stablecoins are admitted). The guard and cadence parameters (deviationCheckEnabled true, maxDeviationBps 1000, the 4-hour force-update floor, and the daily schedule) have not moved since deployment.
- **Scope and audit:** this profile's deep scope is reUSD core. The junior tranche reUSDe (token 0xdDC0f880…, served by a second ICL and the second NAVConsumer) and the RE/sRE staking tokens share the same AccessManager, Safe and Fireblocks custody provider (though the whitelisted custodian addresses differ per token) but are out of deep scope. The current audit of record is Certora's 'Re Core Security Assessment Report' (2025-09-26, 13 findings fixed), superseding an August-2024 Hacken review; its scope is Re Core (ICL, token, oracle-core, redemption). The Chainlink CCIP bridge layer added in June 2026 falls outside that audit's scope.

</details>

<a id="sec-off-chain-deps"></a>
<details>
<summary><strong>🌐 Off-Chain Dependencies</strong> — risk that extends beyond the chain</summary>

> *7 control surfaces extend beyond on-chain observability. Each entry shows what the analyst CAN observe (on-chain signal) alongside the off-chain dependency it relies on.*

- **1. custody** 🟠 — Deposit assets are swept off-chain to Fireblocks-managed custody; backing is then off-chain.
    - *On-chain signal:* withdrawToCustodian [0x84b594dc] on both ICLs; AM role 17330 held by two single-key EOAs (0x6C15, 0x99177B4E) + Safe, all execDelay=0. Destination bounded by the validCustodian whitelist; addCustodian = CUSTODIAN_MANAGER_ROLE held ONLY by the 2-day Timelock 0x69dDEa. On-chain drainable is small (most backing off-chain at Fireblocks).
    - *Off-chain dependency:* Fireblocks-managed custody (docs: 3-of-5 / 5-of-8 MPC); Re Protocol treasury ops; daily attestation by The Network Firm via Chainlink.
    - *Recovery path:* No on-chain recovery once assets leave to a whitelisted custodian; mediated by the 2-day-timelock whitelist (destinations are pre-approved custodians) + daily Network Firm attestation + Fireblocks controls. RESIDUAL: deployer EOA 0x6C15 + 0x99177B4E retain a single-key, execDelay-0 hand on the sweep (bounded to whitelisted destinations).
- **2. oracle** 🔴 — reUSD mint ratio is set from an off-chain NAV computed daily and pushed on-chain via Chainlink Functions → NAVConsumer → SharePriceCalculator.
    - *On-chain signal:* setSharePrice (PRICE_SETTER_ROLE = NAVConsumer CONTRACT only; 1.086529e18); NAVConsumer forceNAVUpdate (EMERGENCY_UPDATER = Safe) + performUpkeep/requestNAV (keeper 0x3B018eA1 + residual 0x6C15). Guard getters: deviationCheckEnabled + maxDeviationBps.
    - *Off-chain dependency:* Chainlink Functions DON + Re's NAV computation; The Network Firm attestation inputs.
    - *Recovery path:* A stale/manipulated NAV mis-prices mint/redeem. Bounded today: deviation guard ENABLED at 10% + MIN_FORCE_UPDATE_INTERVAL 4h floor cap per-step moves. BUT the guard is Safe+1d-toggleable AND setMaxDeviation is UNCAPPED — widening or disabling it un-bounds the feed. Monitor deviationCheckEnabled + maxDeviationBps.
- **3. attestation** 🟠 — Off-chain reserve balances are attested daily by The Network Firm (proof-of-reserve style). The attestation informs the off-chain NAV computation; it is NOT posted to an on-chain PoR feed.
    - *On-chain signal:* The attestation IS published on-chain — as a Chainlink Proof-of-Reserve feed on Avalanche (0xc79a363a3f849d8b3F6A1932f748eA9d4fB2f607, 'Re Offchain Reserves'), updated daily by The Network Firm — but there is NO Ethereum-side PoR feed and the reUSD NAVConsumer does not consume it. On Ethereum the attestation is observable only indirectly, via the NAV value + refresh cadence (getSharePrice; forceNAVUpdate / performUpkeep timing). Monitor the Avalanche PoR value + freshness, plus NAV staleness/deviation as the Ethereum proxy.
    - *Off-chain dependency:* The Network Firm (audit/attestation provider); the attestation-to-NAV computation is off-chain.
    - *Recovery path:* Attestation failure or manipulation flows into a wrong NAV; no on-chain PoR to cross-check against, so detection is indirect (NAV divergence from independent modeling). No direct on-chain recovery.
- **4. compliance** 🟡 — reUSD is not available to U.S. persons; access gated by KYC + geographic restriction enforced off-chain and at the KYCRegistry.
    - *On-chain signal:* KYCRegistry approveKYC/revokeKYC; KYC_PROVIDER_ROLE holders (EOAs).
    - *Off-chain dependency:* Re Protocol KYC/compliance operations; provider key custody.
    - *Recovery path:* A compromised provider key can approve sanctioned addresses; compliance-layer risk, not direct fund loss.
- **5. backing** 🟠 — Ultimate backing is off-chain: fully-collateralized quota-share reinsurance (sole reinsurer Cover Re SPC Ltd, Cayman-licensed), short-dated US T-bills, and NY Regulation-114 trust accounts, plus an Ethena basis trade (sUSDe/USDe) on undeployed capital.
    - *On-chain signal:* Indirect only — reflected in the NAV/share price (and the aggregate off-chain reserve total on the Avalanche Chainlink PoR feed).
    - *Off-chain dependency:* Reinsurance treaty + reinsurer (Cover Re SPC) solvency; US T-bill + Reg-114 trust custody; Ethena (sUSDe/USDe) exposure on both deposit and redemption sides.
    - *Recovery path:* Treaty or basis-trade loss flows through to NAV. Loss waterfall: the reinsurer's own equity (~$77M, 2026-06) is first-loss, then the reUSDe junior/mezzanine tranche, then the reUSD senior tranche — so reUSD absorbs last.
- **6. redemption** 🟠 — 3-tier redemption: only the INSTANT tier (InstantRedemption) is fully on-chain. The scheduled / window tiers (WindowRedemption + RedemptionVault refill) are off-chain-operated — a redeemer past the instant daily/per-user caps waits on off-chain processing.
    - *On-chain signal:* InstantRedemption caps (dailyLimitBps=2000 / userLimitBps=1000) + RefillNeeded event (the on-chain instant tier is drained and needs an off-chain->on-chain refill via depositFromCustodian); RedemptionGateway windowRedemption / windowId mechanics. Monitor RefillNeeded + window open/close + updateLimitPercentages (the instant-tier cap).
    - *Off-chain dependency:* Re Protocol redemption operations — off-chain processing of scheduled/window redemptions + the custody->on-chain refill of the instant tier.
    - *Recovery path:* If the instant tier is capped/closed or drained (RefillNeeded unserviced), the exit falls to the off-chain window/scheduled tiers at operations' pace — slowest exactly under stress. No on-chain forcing of an off-chain redemption. This is the STRAND surface; the on-chain lever is updateLimitPercentages.
- **7. governance** 🟠 — The whole on-chain authority stack resolves to a Gnosis Safe 3-of-5 (0x8eec) whose signer key custody + signing coordination are off-chain; one signer (0x0AE4eeAF) is EIP-7702-delegated to MetaMask's standard EIP7702StatelessDeleGator (0x63c0c19a — a 4337/passkey smart account, not a bespoke governance contract).
    - *On-chain signal:* Safe 0x8eec getOwners() + owner-set changes (AddedOwner / RemovedOwner / ChangedThreshold); the EIP-7702 delegate pointer on signer 0x0AE4eeAF. Monitor owner-set, threshold, and delegate changes.
    - *Off-chain dependency:* Safe signer key custody + off-chain signing coordination; signer identities / jurisdiction / accountability; any session-key / delegation configured on the 0x0AE4eeAF MetaMask 7702 smart account.
    - *Recovery path:* Owner-set changes are on-chain visible, but signing-key compromise or signer collusion is off-chain and only observable post-hoc via the on-chain action it takes. This is the off-chain twin of the Safe's on-chain reach: the 3/5 Safe reaches all four CRITICAL axes with no timelock, so its off-chain key custody is the residual trust anchor.

</details>

<a id="sec-critical-params"></a>
<details>
<summary><strong>🎚️ Critical Parameter Levers</strong> — the one-tx risk levers to watch</summary>

> *13 on-chain parameter levers that are curated as high-impact for lender-side risk (direct dilution / safety-mechanism closure / authority transfer / oracle repointing). Each entry shows current value, the threshold that triggers the impact, and the role-holder controlling the lever.*

- **1. `withdrawToCustodian(address custodian, address token, uint256 amount)`** 🟠 on [**InsuranceCapitalLayer (0x4691C475bE804Fa85f91c2D6D0aDf03114de3093); same role on reUSDe ICL 0xE1886BE2**](#c-0x4691c475be804fa85f91c2d6d0adf03114de3093)
    - *Role gate:* Gated by OZ OPERATOR_ROLE on the ICL — the ICL is NOT AccessManaged (authority() reverts). The SOLE holder of OPERATOR_ROLE is the AccessManager 0x3f0D itself, so the sweep is triggered via AM.execute(ICL, ...): members of AM role 17330594617245322166 (EOA 0x6C15B25E, EOA 0x99177B4E, Safe 0x8eec — all execDelay=0 = single-key/instant; role grantDelay=2d) call through the AM, which forwards as msg.sender and passes onlyRole. MONITOR BOTH AM RoleGranted(17330) AND ICL RoleGranted(OPERATOR_ROLE) — a second DIRECT OPERATOR_ROLE grant would bypass the AM path entirely.
    - *Impact:* A single delay-0 operator key can sweep unlocked backing out on-chain, but only to an already-whitelisted custodian (today 0x295F67Fd for reUSD, 0xd4374008 for reUSDe; DAI has none). It cannot touch the redemption reserve or locked collateral, only the free balance. The custodian whitelist is managed by CUSTODIAN_MANAGER (held by the 2-day Timelock) — but the Safe DEFAULT_ADMIN can self-grant CUSTODIAN_MANAGER instantly (plain-OZ, no delay), so a new sweep destination CAN be added without the timelock; MONITOR addCustodian events. Realistic bad case is not theft but one key forcing backing into off-chain custody early or at a bad moment, after which recovery depends on the off-chain custody relationship (Fireblocks / Network Firm), not anything on-chain. HIGH operational-integrity (single-key, no multisig), not direct-loss CRITICAL; the arbitrary instant drain (Safe self-grants OPERATOR / CUSTODIAN_MANAGER) is captured in the DEFAULT_ADMIN self-grant CRITICAL, and the compromised-custodian loss path lives in the off-chain custody dependency.

**📊 reUSD backing composition (live)** — *live @ block 25,449,091; refreshes each scan*

| Location | USDC | USDT | USDe | sUSDe | USD value | % backing |
|---|---:|---:|---:|---:|---:|---:|
| [**InsuranceCapitalLayer (ICL)**](https://etherscan.io/address/0x4691C475bE804Fa85f91c2D6D0aDf03114de3093) | — | 6,181.72 | 898.63 | — | $7.1k | 0.0% |
| [**Vault**](https://etherscan.io/address/0x5C454f5526e41fBE917b63475CD8CA7E4631B147) | — | — | — | 7,172,031.72 | $8.86M | 5.8% |
| [**Reserves**](https://etherscan.io/address/0x7E499842E7634cce793FFD5D44383BB4a2F086e0) | — | — | — | — | $0 | 0.0% |
| [**FeeVault**](https://etherscan.io/address/0x2DF87810fCF9b8e6a42adC5923Bc2EE0ca0467CA) | — | — | — | 111,327.99 | $137.5k | 0.1% |
| [**Custodian (Fireblocks sweep)**](https://etherscan.io/address/0x295F67Fdb21255A3Db82964445628a706FBe689E) | 907,643.51 | 0.01 | — | 24,073,272.29 | $30.65M | 20.1% |
| **On-chain visible** | 907,643.51 | 6,181.73 | 898.63 | 31,356,632.00 | **$39.65M** | **26.0%** |
| **Off-chain (implied)** | — | — | — | — | **$112.86M** | **74.0%** |

> *Total backing = supply 140,317,042 reUSD × NAV 1.0869 = $152.51M. On-chain USD via each collateral's live oracle; off-chain is the implied remainder.*
> *Off-chain reserves — Chainlink PoR "Re Offchain Reserves" ([0xc79a...f607](https://snowtrace.io/address/0xc79a363a3f849d8b3F6A1932f748eA9d4fB2f607) on avalanche): **$177.66M**, attested 2026-07-02 18:08 UTC. Section 114 trust + off-chain reserves; protocol-wide (reUSD + reUSDe).*
> *Coverage: the attested off-chain reserves ($177.66M) cover this asset's implied off-chain backing ($112.86M) with ~$64.81M headroom.*
> *reUSD is backed at NAV; as the senior tranche it is loss-protected by the reUSDe junior tranche and the reinsurer's ~$77M first-loss equity beneath it — over-collateralized in the credit sense.*

- **2. `setSharePrice(uint256)`** 🔴 on [**SharePriceCalculator (0xd1D104a7515989ac82F1AFDa15a23650411b05B8)**](#c-0xd1d104a7515989ac82f1afda15a23650411b05b8)
    - *Role gate:* PRICE_SETTER_ROLE — contract-held (NAVConsumer); no EOA leg.
    - *Live current value (as of block 25,448,209):* `1086893160111686144 (1.086893e18)`
    - *Recorded changes:* 421 historical event(s); last setter `0xeA47A1374f4892cdFc2307016a463AbCc0C66852`
    - *Impact:* Direct write of the reUSD mint ratio. Off-1:1 setting dilutes every holder / mis-prices deposits.
- **3. `forceNAVUpdate(uint256,string)`** 🔴 on [**NAVConsumer (0x84d4eaeb10f9E57b67622f667C6c13E22fA4b2B6) + reUSDe NAVConsumer 0x105f7f11**](#c-0x84d4eaeb10f9e57b67622f667c6c13e22fa4b2b6)
    - *Role gate:* EMERGENCY_UPDATER_ROLE — net LIVE holder = ONLY Safe 3/5 0x8eec (deployer-EOA leg removed). OZ role, no delay (instant).
    - *Threshold:* Pushes a chosen NAV bypassing the Chainlink feed. Bounded per-step to 10% every 4h WHILE the guard holds — but the guard is Safe+1d-toggleable AND setMaxDeviation is UNCAPPED, so the same governance can un-bound it. No external (non-Safe) buffer on the collateral's value.
    - *Impact:* The direct feed-bypass write on the oracle that values reUSD AS collateral. The only on-chain bound (the deviation guard) is self-referential Safe governance (toggleable + uncapped per §11c), so a 3/5 Safe can un-bound then re-value reUSD within ~1 day, with no external oracle recourse. Mis-valuation -> FiRM over-lends (bad debt) or force-liquidates — CRITICAL on the FiRM lens (oracle integrity is the core of a share-price collateral). NAV plumbing: the 10% deviation guard (setDeviationCheckEnabled / setMaxDeviation, Safe+1d) bounds ONLY the automated Chainlink feed — this forceNAVUpdate and a direct setSharePrice bypass it (unbounded). Disabling or widening the guard removes the automated feed's mint-safety check (unfair-mint exposure if the off-chain NAV is faulty or compromised); setNAVReceiver repoints the NAV sink but cannot inject a price. MONITOR setDeviationCheckEnabled->false / setMaxDeviation->large.
- **4. `updateLimitPercentages(uint256,uint256)`** 🟠 on [**InstantRedemption (0xa31deEbb3680A3007120e74bCbDf4df36F042A40)**](#c-0xa31deebb3680a3007120e74bcbdf4df36f042a40)
    - *Role gate:* AM role 11723228863651074278 — SOLE holder EOA 0xEE16bE03, execDelay=0 (single-key, live). Same role gates the full redemption-config surface: updateRedemptionRange, updateFee (capped 10% MAX_FEE_BPS), updateHighWatermark, setFeeVault (Instant + Window), PayoutTokenRegistry setTokenConfig + emergencySwitch, WindowRedemption updateMinimumRequest.
    - *Threshold:* (0,0) reverts, so updateLimitPercentages(1,1) = 0.01%/day is the effective close of the on-chain instant redemption tier — single key, one tx, no delay.
    - *Impact:* On-chain redemption is reUSD's depeg defense — it lets reUSD flow off DEX pools back to backing. A single delay-0 key (0xEE16) can close the instant tier (caps->~0) in one tx at the moment of stress, when the off-chain window tiers are slowest, leaving the peg to thin DEX liquidity -> depeg -> impairment as FiRM collateral (mark-down / liquidation cascade). Mitigant: off-chain scheduled/window tiers remain, so not a total exit loss — this is a STRAND (reversible liquidity impairment, backing intact, market-mediated), HIGH not CRITICAL on the premise that FiRM market-prices reUSD (if it were ever priced at NAV/par this snaps back to CRITICAL). Related: setFeeVault repoints the redemption-fee recipient — recordFee has no try/catch, so a reverting feeVault DoS's redemption while fee>0 (bounded, fees <=10% of volume).
- **5. `updateFee(uint16)`** 🟠 on **InstantRedemption (0xa31deEbb…2A40) [redemption cluster, role 11723]**
    - *Role gate:* AM role 11723228863651074278 — SOLE holder EOA 0xEE16bE03, execDelay=0 (single-key). HARD-CAPPED by immutable MAX_FEE_BPS=1000 (10%, §11c) — cannot exceed 10% without a contract upgrade.
    - *Threshold:* A single-key hike to the 10% cap = a 10% haircut on every on-chain redemption → redemption floor = NAV − 10%.
    - *Impact:* Sets reUSD's on-chain REDEMPTION HAIRCUT (0–10%, hard-capped). At the cap a redeemer receives 90% of gross, so the redemption floor that anchors the peg = NAV − fee. FiRM SIZING INPUT: value reUSD collateral against NAV − (up to 10%) — the exit value is the fee-reduced payout, and a single delay-0 key (0xEE16) can move the fee to the cap in one tx. Bounded (10% ceiling) + reversible → HIGH, the bounded-haircut twin inside the CRITICAL 0xEE16 redemption cluster (updateLimitPercentages caps→0 is the unbounded CLOSE twin).
- **6. `owner-bundle: transferOwnership / applyChainUpdates / addRemotePool / setDynamicConfig`** 🔴 on [**CCIP BurnWithFromMintTokenPool (0xF00B3b06690bC7E2bC6A9ccae55d17b7CD818465) — holds MINTER on reUSD**](#c-0xf00b3b06690bc7e2bc6a9ccae55d17b7cd818465)
    - *Role gate:* owner() = Safe 3/5 (0x8eec…fBaD), delay 0 (NOT AccessManaged — no AM buffer; transferOwnership is 2-step but no timelock).
    - *Threshold:* The Safe owner can, delay-0, self-authorize the pool to mint UNBACKED reUSD in one tx (repoint s_router + a remote pool, then releaseOrMint) — no ownership transfer or real CCIP infra required. DILUTE axis, cross-chain.
    - *Impact:* Cross-chain unbacked-mint surface: the pool holds reUSD MINTER and its owner (Safe 3/5, delay 0) controls every releaseOrMint gate, so it can self-authorize an unbacked mint in one tx (setDynamicConfig repoints the router past the offRamp check; addRemotePool/applyChainUpdates defeat the remote-pool check). Strictly worse than the ShareToken DEFAULT_ADMIN->MINTER path, which has a 2-day Timelock co-holder — this owner leg has delay 0. CRITICAL (dilute), Safe-quorum-tempered; only backstop is the immutable RMN curse. Absent an owner reconfiguration, inbound cross-chain mint is itself rate-limited: 11 live lanes each carry a standard-finality inbound cap of ~1M reUSD (refill ~300/s), an aggregate ~12M reUSD burst ceiling (~8% of supply) before the brake engages; the fast-finality limiters are unset but fast finality is not an allowed path (allowedFinalityConfig=0x0), so there is no un-braked inbound leg today. MONITOR CCIP OwnershipTransferRequested / setDynamicConfig / RemotePoolAdded / ChainAdded / setRateLimitConfig / setAllowedFinalityConfig (enabling fast finality while its per-lane limiters stay disabled would open an un-braked inbound-mint path).
- **7. `DEFAULT_ADMIN_ROLE grant path -> grantRole(bytes32 MINTER_ROLE, address)`** 🔴 on **reUSD ShareToken (proxy 0x5086bf35…0c72, impl 0xb5276c) — PLAIN OZ AccessControl, NOT AM-governed**
    - *Role gate:* getRoleAdmin(MINTER)=DEFAULT_ADMIN_ROLE. DEFAULT_ADMIN held by Safe 3/5 0x8eec + 2-day Timelock 0x69dDEa ONLY (both CONTRACTS; deployer EOA 0x6C15 REVOKED, historical grantees 0xf044/0xf682 = contracts, both revoked). NO EOA holds DEFAULT_ADMIN or MINTER.
    - *Profile-declared value (verified at block 25,448,252):* `MINTER currently held ONLY by contracts — ICL 0x4691, InstantRedemption 0xa31d, CCIP pool 0xF00B (legacy LZ 0x0dfb42 revoked); no EOA.`
    - *Threshold:* A DEFAULT_ADMIN holder can grantRole(MINTER, attacker) in ONE tx → attacker mints reUSD directly (unbounded dilution). This is the DILUTE-axis meta-lever for the ShareToken supply role.
    - *Impact:* THE mint-authority meta-lever (dilute axis): getRoleAdmin(MINTER)=DEFAULT_ADMIN, so a DEFAULT_ADMIN holder can confer direct reUSD mint. DEFAULT_ADMIN = Safe 3/5 + 2-day Timelock only, no EOA, so no single key can grant MINTER. CRITICAL because the Safe leg is INSTANT — unlike the AM custody/oracle grants (2-day delay), this plain-OZ grant lets a 3/5 quorum confer mint + mint in one atomic tx with zero buffer (the Timelock co-holder leg IS 2-day-buffered). Tempered by the 3/5 quorum, not total. MONITOR ShareToken RoleGranted(MINTER) + RoleGranted(DEFAULT_ADMIN).
- **8. `DEFAULT_ADMIN self-grant on the PLAIN-OZ (non-AM) contracts -> grantRole(<terminal CRITICAL role>, x)`** 🔴 on **SharePriceCalculator 0xd1D104 / DepositTokenRegistry 0x73d37A / NAVConsumer 0x84d4ea / InsuranceCapitalLayer 0x4691 (+ ShareToken 0x5086 = the MINTER entry above)**
    - *Role gate:* DEFAULT_ADMIN = Safe 3/5 0x8eec on all four (ICL DEFAULT_ADMIN co-held by 2d-Timelock 0x69dDEa; BOTH are DIRECT members). PLAIN OZ AccessControl => grantRole is INSTANT (no grant delay — unlike the AM's 2-day buffer).
    - *Profile-declared value (verified at block 25,448,252):* `Safe does NOT hold the ICL terminal roles directly today (2d-Timelock holds UPGRADER/CUSTODIAN_MANAGER) but as DEFAULT_ADMIN can self-grant them instantly; roleAdmin of each terminal role = DEFAULT_ADMIN.`
    - *Threshold:* Safe DEFAULT_ADMIN -> grant terminal role -> act, INSTANTLY: SharePriceCalculator PRICE_SETTER -> setSharePrice arbitrary (DILUTE/MIS-VALUE); DTR ORACLE_MANAGER/ADMIN -> updateTokenOracle/addToken (MIS-VALUE collateral side); NAVConsumer EMERGENCY_UPDATER -> forceNAVUpdate arbitrary (MIS-VALUE); ICL OPERATOR -> withdrawToCustodian (DRAIN, bounded to whitelisted custodian) OR ICL/ShareToken UPGRADER -> upgradeToAndCall (UNBOUNDED drain / all four axes).
    - *Impact:* The AM 2-day grant delay credited on several HIGH levers does NOT protect the plain-OZ half of the stack: the Safe holds DEFAULT_ADMIN directly and grantRole has no delay, so it can confer + exercise a terminal CRITICAL role (mint-ratio / collateral-oracle / NAV / custody-operator + UPGRADER) in one atomic tx with zero timelock. Each terminal lever is already CRITICAL, so the instant self-grant inherits CRITICAL (confer-worst-role). Safe-quorum-tempered. The ICL/ShareToken UPGRADER->upgrade paths are the unbounded all-axes ones. MONITOR RoleGranted(<terminal role>) on each contract.
- **9. `AM meta-admin: grantRole(uint64,address,uint32) / setTargetFunctionRole(address,bytes4[],uint64) / updateAuthority / setTargetClosed`** 🟠 on [**AccessManager (0x3f0DA1C363e34802C6f12F9C27276dC0e6696FD8)**](#c-0x3f0da1c363e34802c6f12f9c27276dc0e6696fd8)
    - *Role gate:* ADMIN_ROLE id=0 = Safe 3/5 (0x8eec…fBaD), execDelay=0 (no EOA).
    - *Profile-declared value (verified at block 25,448,252):* `Grant delays are asymmetric: custody-sweep role 17330 and oracle role 13724 = 2-day; redemption role 11723 and ADMIN id=0 = 0 (instant). Every role's roleAdmin is the Safe. targetAdminDelay = 0 (instant) for the redemption/payout/pricing targets (InstantRedemption, RedemptionGateway, PayoutTokenRegistry, PriceRouter), 2-day for ICL + NAVConsumer, 7-day for KYCRegistry/staking.`
    - *Threshold:* grantRole confers the custody-sweep (17330, usable +2d) / oracle-repoint (13724, +2d) / redemption-close (11723, instant) role; setTargetFunctionRole / updateAuthority / setTargetClosed re-point a selector to a Safe-held role, re-point a target's authority(), or close a target instantly on the delay-0 targets.
    - *Impact:* The AccessManager root meta-admin. A single Safe 3/5 tx can grant three of the four CRITICAL-axis roles, or instantly re-point / close the delay-0 redemption / payout / pricing targets. HIGH not CRITICAL: the custody and oracle grants carry a 2-day buffer, and the instant reach is STRAND plus a bounded redemption-reserve drain (the redemption vault is ~6% of supply). The truly instant unbacked-mint and total-drain paths live on the plain-OZ DEFAULT_ADMIN levers, not here, and the AM cannot grant reUSD MINTER (that is the ShareToken's separate plain-OZ AccessControl). Safe-quorum-tempered (no single key). MONITOR AM RoleGranted / TargetFunctionRoleUpdated / AuthorityUpdated / TargetClosed.
- **10. `setSharePriceCalculator(address)`** 🟠 on **InsuranceCapitalLayer (0x4691C475…3093) + reUSDe ICL 0xE1886BE2 [selector 0x635b6a3a]**
    - *Role gate:* AM role 13724107344495470129 — sole holder Safe 3/5 0x8eec, execDelay 172800s (2d).
    - *Threshold:* Repoint to a calculator that returns an off-1:1 / manipulable ratio. Bounded by the 2-day AM delay + Safe 3/5 quorum.
    - *Impact:* Repoints the mint-ratio oracle the ICL reads = SUPPLY-equivalent (mis-price every deposit/redeem). Safe + 2-day delay = analyst-observable buffer; not single-key.
- **11. `setPriceFeed(address,address) / removePriceFeed(address)`** 🟠 on **PriceRouter 0xFe76cF5e…Fab66 [selectors 0x76e11286 / 0xfceb0024]**
    - *Role gate:* AM role 16768900588957885613 — SOLE holder EOA 0x49BC5A88…A0ee, execDelay=0 (single-key).
    - *Profile-declared value (verified at block 25,448,252):* `Live redemption feeds: shareToken 0x0764BFa8 (1.086529 WAD), sUSDe 0xb6aD3633 (1.234679 WAD; same feed as the sUSDe collateral oracle).`
    - *Threshold:* Point a redemption-priced token at a manipulated feed → mis-priced redemption payout. Single-key, delay 0.
    - *Impact:* Single-key control of the redemption-pricing feeds. Not a reUSD mint lever, but mis-pricing redemptions is a value-leak / peg-discipline surface. Single delay-0 EOA — flag for key-custody hardening.
- **12. `updateTokenOracle(address,address)`** 🔴 on **DepositTokenRegistry (0x73d37A98…c0F6) — PER-COLLATERAL ORACLE**
    - *Role gate:* OZ ORACLE_MANAGER_ROLE = Safe 3/5 0x8eec (instant, NO delay; prior EOA 0x6C15 REVOKED). DTR is NOT AM-managed (direct OZ AccessControl).
    - *Threshold:* Repoints the priceOracle valuing a DEPOSIT collateral → a manipulated/permissive oracle mints reUSD at a wrong (inflated) rate = direct dilution (the Resolv-USR permissive-oracle class).
    - *Impact:* updateTokenOracle sets the feed that values a collateral at mint — the mint path converts the deposit to reUSD at that price. A Safe repoint to an over-valuing or manipulable feed mints far more reUSD than backing: the Resolv USR class (~millions minted against ~100k USDC via a permissive oracle, then dumped -> depeg). For FiRM that is direct loss: unbacked reUSD -> bad debt on reUSD-collateralized loans. Today the four live oracles are robust status-guarded wrappers (mint reverts on STALE/INVALID/VOLATILE, sUSDe capped), so the residual is the GOVERNANCE repoint: a no-timelock 3/5 Safe can swap in a VALID-but-inflated feed (the status check misses that) in one tx. Collateral-side twin of setSharePrice. MONITOR TokenOracleUpdated.

**📊 Collateral oracle registry** — *live @ block 25,449,091; refreshes each scan*

| Collateral | Live oracle | Status | Price (USD) | Paused |
|---|---|---|---:|:---:|
| [USDC](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48) | [`0xB6c3...d2FD`](https://etherscan.io/address/0xB6c31dc5722212F5353F3AfE9C602d861332d2FD) | VALID | $0.9996 | no |
| [USDT](https://etherscan.io/address/0xdAC17F958D2ee523a2206206994597C13D831ec7) | [`0x4e12...399f`](https://etherscan.io/address/0x4e12E4A94257F7278DF73c453547DAF93257399f) | VALID | $0.9990 | no |
| [USDe](https://etherscan.io/address/0x4c9EDD5852cd905f086C759E8383e09bff1E68B3) | [`0x0649...084b`](https://etherscan.io/address/0x0649a6AD66f145E1907401ae3db6418fe42E084b) | VALID | $0.9982 | no |
| [sUSDe](https://etherscan.io/address/0x9D39A5DE30e57443BfF2A8307A4256c8797A3497) | [`0xb6aD...fB4D`](https://etherscan.io/address/0xb6aD3633cB3FAfed3D375d8c64240f122E19fB4D) | VALID | $1.2355 | no |

- **13. `addToken(address,uint256,uint256,address,bool,uint256,uint256)`** 🔴 on **DepositTokenRegistry (0x73d37A98…c0F6) — MINT-asset whitelist**
    - *Role gate:* OZ ADMIN_ROLE = Safe 3/5 0x8eec (instant, no delay). NOT AM-managed.
    - *Threshold:* Adds a new DEPOSITABLE collateral WITH its priceOracle + eligibility + fees. A malicious token + oracle → deposit inflated collateral → mint excess reUSD = dilution.
    - *Impact:* The whitelist-add for the assets that MINT reUSD. Curates which collateral is accepted and at what oracle — the mint-value basis. A bad add dilutes every holder. Safe 3/5 (multisig buffer, no timelock). CRITICAL on the FiRM-collateral lens. Pairs with updateTokenOracle (the oracle leg).

</details>

## 📑 Table of Contents

1. [Analyst Focus Areas](#analyst-focus-areas)
2. Contracts
   - [reUSD ★](#c-0x5086bf358635b81d8c47c66d1c8b9e567db70c72)
   - [TimelockController](#c-0x69ddea332723cf5407151aaf68b9b076557fca93)
   - [InsuranceCapitalLayer](#c-0x4691c475be804fa85f91c2d6d0adf03114de3093)
   - [BurnWithFromMintTokenPool](#c-0xf00b3b06690bc7e2bc6a9ccae55d17b7cd818465)
   - [InstantRedemption](#c-0xa31deebb3680a3007120e74bcbdf4df36f042a40)
   - [AccessManager](#c-0x3f0da1c363e34802c6f12f9c27276dc0e6696fd8)
   - [DepositTokenRegistry](#c-0x73d37a98c0fcbd049bffffe67bf9af36d603c0f6)
   - [SharePriceCalculator](#c-0xd1d104a7515989ac82f1afda15a23650411b05b8)
   - [KYCRegistry](#c-0x82f1806aeab5ecb9a485eb041d5ed4940b123995)
   - [PayoutTokenRegistry](#c-0xf788624278dc0d5b4e494f834932e6938aa2bdc3)
   - [RedemptionGateway](#c-0x8aeb9453ef22cb38abc7a3af9c208f65c1bfe31e)
   - [ReProtocolStaking](#c-0x2eafa5bd2c477e21c8edd4c9781a2fa54c623900)
   - [NAVConsumer](#c-0x84d4eaeb10f9e57b67622f667c6c13e22fa4b2b6)
   - [StakedRe](#c-0xad6d3923a78393d1e47321e276da3627a51f8431)
   - [ReProtocolToken](#c-0x526526528f35ac738177003b8773b402b8df8143)
3. [⚡ Authority Concentration](#-authority-concentration)
4. [⛔ Sanctions Screening](#-sanctions-screening)
5. [EOA Exposure Summary](#eoa-exposure-summary)
6. [✅ Scan Integrity](#scan-integrity)

## Analyst Focus Areas &nbsp;&nbsp;☑ Profile reviewed

> **Observational findings — not risk determinations.** Each item below is a focus point for the Risk Analyst to interpret against collateralization context and the protocol's stated intent. Attention levels (CRITICAL / HIGH / LOW) reflect the scanner's heuristic weight — not a realized risk to FiRM. These observations support future risk assessments; they do not constitute one.

> **17 critical-attention** and **50 high-attention** observation(s) across 16 contract(s).

<details>
<summary><strong>View findings (collapsed — profile reviewed)</strong></summary>


### 🔴 CRITICAL (17)

- 🔴 **EOA `0x07e5…5F4F` controls 4 role(s) across 4 contract(s)** — Single key concentrates authority across the asset. Sub-items below link to each role/contract pair.
    - ↳ 🔴 [**Observed: EOA holds `PAUSER_ROLE` on InsuranceCapitalLayer**](#c-0x4691c475be804fa85f91c2d6d0adf03114de3093) — `0x07e5faC51aD770e23F5399d51070647E16e75F4F` (EOA) — single key controls [PAUSE] capability. Assess custody and intent.
    - ↳ 🔴 [**Observed: EOA holds `PAUSER_ROLE` on DepositTokenRegistry**](#c-0x73d37a98c0fcbd049bffffe67bf9af36d603c0f6) — `0x07e5faC51aD770e23F5399d51070647E16e75F4F` (EOA) — single key controls [PAUSE] capability. Assess custody and intent.
    - ↳ 🔴 [**Observed: EOA holds `AM Operator (role 13697439394725303084; gates 1 fn(s) across 1 target(s)) [via AM 0x3f0D...6FD8]` on ReProtocolStaking**](#c-0x2eafa5bd2c477e21c8edd4c9781a2fa54c623900) — `0x07e5faC51aD770e23F5399d51070647E16e75F4F` (EOA) — single key controls [PAUSE] capability. Assess custody and intent.
    - ↳ 🟠 [**Observed: EOA holds `CANCELLER_ROLE` on TimelockController**](#c-0x69ddea332723cf5407151aaf68b9b076557fca93) — `0x07e5faC51aD770e23F5399d51070647E16e75F4F` (EOA) — single key controls privileged functions. Assess custody and intent.
- 🔴 [**Observed: EOA holds `AM Operator (role 11723228863651074278; gates 9 fn(s) across 3 target(s)) [via AM 0x3f0D...6FD8]` on InstantRedemption**](#c-0xa31deebb3680a3007120e74bcbdf4df36f042a40) — `0xEE16bE0374f2eFb34218affC1a8EbEe9310c47f8` (EOA) — single key controls a role whose functions (`setFeeVault`, `updateFee`, `updateHighWatermark` +2 more) may reach inherited [SUPPLY] authority via reUSD (ERC1967Proxy) [ShareToken]. Inheritance is a dependency-graph edge — verify these functions actually exercise it before treating it as a confirmed path. Assess custody and intent.
- 🔴 [**Observed: EOA holds `KYC_PROVIDER_ROLE` on KYCRegistry**](#c-0x82f1806aeab5ecb9a485eb041d5ed4940b123995) — `0x67dD3914A3c8FD627824153773117276a5E4f3A5` (EOA) — single key controls a role whose functions (`approveKYC`, `revokeKYC`) may reach inherited [SUPPLY] authority via InstantRedemption, reUSD (ERC1967Proxy) [ShareToken]. Inheritance is a dependency-graph edge — verify these functions actually exercise it before treating it as a confirmed path. Assess custody and intent.
- 🔴 [**Observed: EOA holds `AM Operator (role 11723228863651074278; gates 9 fn(s) across 3 target(s)) [via AM 0x3f0D...6FD8]` on PayoutTokenRegistry**](#c-0xf788624278dc0d5b4e494f834932e6938aa2bdc3) — `0xEE16bE0374f2eFb34218affC1a8EbEe9310c47f8` (EOA) — single key controls a role whose functions (`emergencySwitch`, `setTokenConfig`) may reach inherited [SUPPLY] authority via InstantRedemption, reUSD (ERC1967Proxy) [ShareToken]. Inheritance is a dependency-graph edge — verify these functions actually exercise it before treating it as a confirmed path. Assess custody and intent.
- 🔴 [**Observed: unknown upgrade controller on ReProtocolStaking**](#c-0x2eafa5bd2c477e21c8edd4c9781a2fa54c623900) — `upgradeability (UUPS)` has no resolved controller — verify upgradeability origin.
- 🔴 [**Observed: EOA holds `AM Operator (role 13027108596976310255; gates 1 fn(s) across 1 target(s)) [via AM 0x3f0D...6FD8]` on ReProtocolStaking**](#c-0x2eafa5bd2c477e21c8edd4c9781a2fa54c623900) — `0xf31d8E94928147cCb30C698ddD81C6791861C4a9` (EOA) — single key controls a role whose functions (`syncBatch`) may reach inherited [SUPPLY] authority via InsuranceCapitalLayer, reUSD (ERC1967Proxy) [ShareToken]. Inheritance is a dependency-graph edge — verify these functions actually exercise it before treating it as a confirmed path. Assess custody and intent.
- 🔴 [**Observed: upgrade path has no timelock on ReProtocolStaking**](#c-0x2eafa5bd2c477e21c8edd4c9781a2fa54c623900) — Proxy can be upgraded without a timelock delay — no observation window for users. Verify governance design.
- 🔴 [**Observed: EOA holds `KEEPER_ROLE` on NAVConsumer**](#c-0x84d4eaeb10f9e57b67622f667c6c13e22fa4b2b6) — `0x3B018eA1105C5b2E14Df25e029a1C090cE54FC5b` (EOA) — single key controls a role whose functions (`performUpkeep`) may reach inherited [SUPPLY] authority via InsuranceCapitalLayer, SharePriceCalculator, reUSD (ERC1967Proxy) [ShareToken]. Inheritance is a dependency-graph edge — verify these functions actually exercise it before treating it as a confirmed path. Assess custody and intent.
- 🔴 [**Observed: EOA holds `UPDATER_ROLE` on NAVConsumer**](#c-0x84d4eaeb10f9e57b67622f667c6c13e22fa4b2b6) — `0x3B018eA1105C5b2E14Df25e029a1C090cE54FC5b` (EOA) — single key controls a role whose functions (`requestNAV`) may reach inherited [SUPPLY] authority via InsuranceCapitalLayer, SharePriceCalculator, reUSD (ERC1967Proxy) [ShareToken]. Inheritance is a dependency-graph edge — verify these functions actually exercise it before treating it as a confirmed path. Assess custody and intent.
- 🔴 [**Observed: unknown upgrade controller on StakedRe**](#c-0xad6d3923a78393d1e47321e276da3627a51f8431) — `upgradeability (UUPS)` has no resolved controller — verify upgradeability origin.
- 🔴 [**Observed: upgrade path has no timelock on StakedRe**](#c-0xad6d3923a78393d1e47321e276da3627a51f8431) — Proxy can be upgraded without a timelock delay — no observation window for users. Verify governance design.
- 🔴 **Observed: EOA spans 2 contracts** — `0xEE16bE0374f2eFb34218affC1a8EbEe9310c47f8` holds roles in InstantRedemption, PayoutTokenRegistry — single key controls cross-contract authority. Roles reach inherited [SUPPLY] authority via a dependency path. Assess custody and segmentation.
- 🌐 [**Observed: 7 off-chain control dependencies (custody, oracle, attestation, compliance, backing, redemption, governance)**](#sec-off-chain-deps) — Asset has 7 control surface(s) that extend beyond on-chain observability. See the 🌐 Off-Chain Dependencies section for each kind, the on-chain signal the analyst can monitor, the off-chain dependency it relies on, and the recovery path if the off-chain piece fails. Cross-reference against the protocol's stated trust model.
- 🎚️ [**Observed: 13 critical parameter levers (CRITICAL: 7, HIGH: 6)**](#sec-critical-params) — Asset has 13 on-chain parameter levers curated as high-impact for lender-side risk. See the 🎚️ Critical Parameter Levers section for the role gate, current value, threshold, and impact of each. These are singular setters / function calls that flip risk surface in one tx — direct dilution, safety-mechanism closure, authority transfer, or oracle repointing. Verify role-gate identities and threshold distance-to-trigger against current operating posture.

### 🟠 HIGH (50)

- 🟠 [**Observed: EOA holds `EXECUTOR_ROLE` on TimelockController**](#c-0x69ddea332723cf5407151aaf68b9b076557fca93) — `0x4bFeA59B948A1A0fAC3C8C40BFd86E0E740738f3` (EOA) — single key controls privileged functions. Assess custody and intent.
- 🟠 [**Observed: Gnosis Safe 3/5 controls both admin and upgrades**](#c-0x5086bf358635b81d8c47c66d1c8b9e567db70c72) — `0x8eec10616802Ef639CA55c98ac856553fAdEfBaD` holds admin + upgrade authority across AccessManager, BurnWithFromMintTokenPool, DepositTokenRegistry, InsuranceCapitalLayer, NAVConsumer, ReProtocolStaking, StakedRe, TimelockController, reUSD (ERC1967Proxy) [ShareToken] — single entity controls full stack. Verify governance design.

<details>
<summary>💰 **Observed: 16 role(s) with supply-altering capability** — Supply-altering surface — assess each holder's custody and governance. Expand for all roles (each links to its contract card).</summary>

- 💰 [**`ORACLE_MANAGER_ROLE` on DepositTokenRegistry**](#c-0x73d37a98c0fcbd049bffffe67bf9af36d603c0f6) — 1 holder(s) — open the role card for holder identities & admin chain.
- 💰 [**`AM Operator (role 3678572998923334730; gates 1 fn(s) across 1 target(s)) [via AM 0x3f0D...6FD8]` on InstantRedemption**](#c-0xa31deebb3680a3007120e74bcbdf4df36f042a40) — 1 holder(s) — open the role card for holder identities & admin chain.
- 💰 [**`kyc()` on InstantRedemption**](#c-0xa31deebb3680a3007120e74bcbdf4df36f042a40) — 1 holder(s) — open the role card for holder identities & admin chain.
- 💰 [**`payoutTokenRegistry()` on InstantRedemption**](#c-0xa31deebb3680a3007120e74bcbdf4df36f042a40) — 1 holder(s) — open the role card for holder identities & admin chain.
- 💰 [**`shareToken()` on InstantRedemption**](#c-0xa31deebb3680a3007120e74bcbdf4df36f042a40) — 1 holder(s) — open the role card for holder identities & admin chain.
- 💰 [**`OPERATOR_ROLE` on InsuranceCapitalLayer**](#c-0x4691c475be804fa85f91c2d6d0adf03114de3093) — 1 holder(s) — open the role card for holder identities & admin chain.
- 💰 [**`depositTokenRegistry()` on InsuranceCapitalLayer**](#c-0x4691c475be804fa85f91c2d6d0adf03114de3093) — 1 holder(s) — open the role card for holder identities & admin chain.
- 💰 [**`sharePriceCalculator()` on InsuranceCapitalLayer**](#c-0x4691c475be804fa85f91c2d6d0adf03114de3093) — 1 holder(s) — open the role card for holder identities & admin chain.
- 💰 [**`shareToken()` on InsuranceCapitalLayer**](#c-0x4691c475be804fa85f91c2d6d0adf03114de3093) — 1 holder(s) — open the role card for holder identities & admin chain.
- 💰 [**`EMERGENCY_UPDATER_ROLE` on NAVConsumer**](#c-0x84d4eaeb10f9e57b67622f667c6c13e22fa4b2b6) — 1 holder(s) — open the role card for holder identities & admin chain.
- 💰 [**`kycRegistry()` on ReProtocolStaking**](#c-0x2eafa5bd2c477e21c8edd4c9781a2fa54c623900) — 1 holder(s) — open the role card for holder identities & admin chain.
- 💰 [**`stakeToken()` on ReProtocolStaking**](#c-0x2eafa5bd2c477e21c8edd4c9781a2fa54c623900) — 1 holder(s) — open the role card for holder identities & admin chain.
- 💰 [**`PRICE_SETTER_ROLE` on SharePriceCalculator**](#c-0xd1d104a7515989ac82f1afda15a23650411b05b8) — 1 holder(s) — open the role card for holder identities & admin chain.
- 💰 [**`AM Operator (role 2296013215840966718; gates 2 fn(s) across 1 target(s)) [via AM 0x3f0D...6FD8]` on StakedRe**](#c-0xad6d3923a78393d1e47321e276da3627a51f8431) — 1 holder(s) — open the role card for holder identities & admin chain.
- 💰 [**`stakingModule()` on StakedRe**](#c-0xad6d3923a78393d1e47321e276da3627a51f8431) — 1 holder(s) — open the role card for holder identities & admin chain.
- 💰 [**`MINTER_ROLE` on reUSD (ERC1967Proxy) [ShareToken]**](#c-0x5086bf358635b81d8c47c66d1c8b9e567db70c72) — 3 holder(s) — open the role card for holder identities & admin chain.

</details>


<details>
<summary>⏸️ **Observed: 5 role(s) with pause capability** — Pause surface — assess pause-authority governance. Expand for all roles (each links to its contract card).</summary>

- ⏸️ [**`PAUSER_ROLE` on DepositTokenRegistry**](#c-0x73d37a98c0fcbd049bffffe67bf9af36d603c0f6) — 2 holder(s) — open the role card for holder identities & admin chain.
- ⏸️ [**`PAUSER_ROLE` on InsuranceCapitalLayer**](#c-0x4691c475be804fa85f91c2d6d0adf03114de3093) — 2 holder(s) — open the role card for holder identities & admin chain.
- ⏸️ [**`ADMIN_ROLE` on NAVConsumer**](#c-0x84d4eaeb10f9e57b67622f667c6c13e22fa4b2b6) — 1 holder(s) — open the role card for holder identities & admin chain.
- ⏸️ [**`AM Operator (role 13697439394725303084; gates 1 fn(s) across 1 target(s)) [via AM 0x3f0D...6FD8]` on ReProtocolStaking**](#c-0x2eafa5bd2c477e21c8edd4c9781a2fa54c623900) — 1 holder(s) — open the role card for holder identities & admin chain.
- ⏸️ [**`AM Operator (role 211310302505071350; gates 1 fn(s) across 1 target(s)) [via AM 0x3f0D...6FD8]` on ReProtocolStaking**](#c-0x2eafa5bd2c477e21c8edd4c9781a2fa54c623900) — 1 holder(s) — open the role card for holder identities & admin chain.

</details>

- 🔗 [**Observed: supply authority chain on RedemptionGateway**](#c-0x8aeb9453ef22cb38abc7a3af9c208f65c1bfe31e) — Chain: InstantRedemption → `AM Operator (role 3678572998923334730; gates 1 fn(s) across 1 target(s)) [via AM 0x3f0D...6FD8]` → reUSD (ERC1967Proxy) [ShareToken] → `MINTER_ROLE` → RedemptionGateway. Controlled by: `authority()`, `instantRedemption()`, `kyc()`. Assess custody — compromise of this chain could affect root token supply.
- 🔗 [**Observed: supply authority chain on KYCRegistry**](#c-0x82f1806aeab5ecb9a485eb041d5ed4940b123995) — Chain: InstantRedemption → `kyc()` → reUSD (ERC1967Proxy) [ShareToken] → `MINTER_ROLE` → KYCRegistry. Controlled by: `KYC_ADMIN_ROLE`, `KYC_PROVIDER_ROLE`. Assess custody — compromise of this chain could affect root token supply.
- 🔗 [**Observed: supply authority chain on PayoutTokenRegistry**](#c-0xf788624278dc0d5b4e494f834932e6938aa2bdc3) — Chain: InstantRedemption → `payoutTokenRegistry()` → reUSD (ERC1967Proxy) [ShareToken] → `MINTER_ROLE` → PayoutTokenRegistry. Controlled by: `AM Operator (role 11723228863651074278; gates 9 fn(s) across 3 target(s)) [via AM 0x3f0D...6FD8]`. Assess custody — compromise of this chain could affect root token supply.

<details>
<summary>🔓 **14 No-Timelock-in-admin-chain supply finding(s) across 8 contract(s)** — Supply-capable roles with no Timelock in the direct admin chain — a supply-altering call can land in one block once the holder's governance threshold is met. Expand to review each role + holder and verify whether it is a real supply path or a transitive getter-pointer edge. FiRM-lens: no analyst-observable buffer between decision and action.</summary>

- ⚠️ [**No Timelock in admin chain: `MINTER_ROLE` on reUSD (ERC1967Proxy) [ShareToken]**](#c-0x5086bf358635b81d8c47c66d1c8b9e567db70c72) — `MINTER_ROLE` has SUPPLY capability and is held by: `0x4691...3093` (Contract), `0xF00B...8465` (Contract), `0xa31d...2A40` (Contract). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `OPERATOR_ROLE` on InsuranceCapitalLayer**](#c-0x4691c475be804fa85f91c2d6d0adf03114de3093) — `OPERATOR_ROLE` has SUPPLY capability and is held by: `0x3f0D...6FD8` (Contract). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `depositTokenRegistry()` on InsuranceCapitalLayer**](#c-0x4691c475be804fa85f91c2d6d0adf03114de3093) — `depositTokenRegistry()` has SUPPLY capability and is held by: `0x73d3...c0F6` (Contract). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `sharePriceCalculator()` on InsuranceCapitalLayer**](#c-0x4691c475be804fa85f91c2d6d0adf03114de3093) — `sharePriceCalculator()` has SUPPLY capability and is held by: `0xd1D1...05B8` (Contract). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `kyc()` on InstantRedemption**](#c-0xa31deebb3680a3007120e74bcbdf4df36f042a40) — `kyc()` has SUPPLY capability and is held by: `0x82F1...3995` (Contract). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `payoutTokenRegistry()` on InstantRedemption**](#c-0xa31deebb3680a3007120e74bcbdf4df36f042a40) — `payoutTokenRegistry()` has SUPPLY capability and is held by: `0xf788...Bdc3` (Contract). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `AM Operator (role 3678572998923334730; gates 1 fn(s) across 1 target(s)) [via AM 0x3f0D...6FD8]` on InstantRedemption**](#c-0xa31deebb3680a3007120e74bcbdf4df36f042a40) — `AM Operator (role 3678572998923334730; gates 1 fn(s) across 1 target(s)) [via AM 0x3f0D...6FD8]` has SUPPLY capability and is held by: `0x8aEb...E31e` (Contract). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `ORACLE_MANAGER_ROLE` on DepositTokenRegistry**](#c-0x73d37a98c0fcbd049bffffe67bf9af36d603c0f6) — `ORACLE_MANAGER_ROLE` has SUPPLY capability and is held by: `0x8eec...fBaD` (Safe). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `PRICE_SETTER_ROLE` on SharePriceCalculator**](#c-0xd1d104a7515989ac82f1afda15a23650411b05b8) — `PRICE_SETTER_ROLE` has SUPPLY capability and is held by: `0x84d4...b2B6` (Contract). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `kycRegistry()` on ReProtocolStaking**](#c-0x2eafa5bd2c477e21c8edd4c9781a2fa54c623900) — `kycRegistry()` has SUPPLY capability and is held by: `0x82F1...3995` (Contract). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `stakeToken()` on ReProtocolStaking**](#c-0x2eafa5bd2c477e21c8edd4c9781a2fa54c623900) — `stakeToken()` has SUPPLY capability and is held by: `0x5265...8143` (Contract). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `EMERGENCY_UPDATER_ROLE` on NAVConsumer**](#c-0x84d4eaeb10f9e57b67622f667c6c13e22fa4b2b6) — `EMERGENCY_UPDATER_ROLE` has SUPPLY capability and is held by: `0x8eec...fBaD` (Safe). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `stakingModule()` on StakedRe**](#c-0xad6d3923a78393d1e47321e276da3627a51f8431) — `stakingModule()` has SUPPLY capability and is held by: `0x2EAF...3900` (Contract). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `AM Operator (role 2296013215840966718; gates 2 fn(s) across 1 target(s)) [via AM 0x3f0D...6FD8]` on StakedRe**](#c-0xad6d3923a78393d1e47321e276da3627a51f8431) — `AM Operator (role 2296013215840966718; gates 2 fn(s) across 1 target(s)) [via AM 0x3f0D...6FD8]` has SUPPLY capability and is held by: `0x2EAF...3900` (Contract). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.

</details>


<details>
<summary>🔄 **5 volatile parameter(s) observed across 4 contract(s) (≥5 historical changes each)** — Operational tempo signal — high-velocity setters indicate active governance maintenance, oracle keepers, or routinely-tuned risk parameters. Expand to review each parameter's change count and current value; assess against the protocol's stated intent.</summary>

- 🔄 [**Observed: volatile parameter `withdrawToCustodian` on InsuranceCapitalLayer**](#c-0x4691c475be804fa85f91c2d6d0adf03114de3093) — `withdrawToCustodian(address custodian, address token, uint256 amount)` changed 1166 times. Current value: ``. Assess change pattern.
- 🔄 [**Observed: volatile parameter `getTargetAdminDelay` on AccessManager**](#c-0x3f0da1c363e34802c6f12f9c27276dc0e6696fd8) — `setTargetAdminDelay(address,uint32)` changed 12 times. Current value: 7 markets · highest 6.048e-13 ×2 · <1M ×5 — full per-key breakdown in the Permissioned Parameters table on AccessManager. Assess change pattern.
- 🔄 [**Observed: volatile parameter `getTokenInfo.minDeposit` on DepositTokenRegistry**](#c-0x73d37a98c0fcbd049bffffe67bf9af36d603c0f6) — `updateMinDeposit(address token, uint256 newMinDeposit)` changed 24 times. Current value: 8 markets · highest 250 ×3 · <1M ×4 · 0 ×1 (retired/unfunded) — full per-key breakdown in the Permissioned Parameters table on DepositTokenRegistry. Assess change pattern.
- 🔄 [**Observed: volatile parameter `isEligibleAsCollateral` on DepositTokenRegistry**](#c-0x73d37a98c0fcbd049bffffe67bf9af36d603c0f6) — `updateCollateralEligibility(address token, bool newEligibility)` changed 8 times. Current value: 7 keys · all 0 — full per-key breakdown in the Permissioned Parameters table on DepositTokenRegistry. Assess change pattern.
- 🔄 [**Observed: volatile parameter `getSharePrice` on SharePriceCalculator**](#c-0xd1d104a7515989ac82f1afda15a23650411b05b8) — `setSharePrice(uint256 newPrice)` changed 421 times. Current value: `1086893160111686144 (1.086893e18)`. Assess change pattern.

</details>


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
<a id="c-0x5086bf358635b81d8c47c66d1c8b9e567db70c72"></a>
## reUSD (ERC1967Proxy) [ShareToken] `0x5086bf358635B81D8C47C66d1C8b9E567Db70c72`

> ⚠️ **Upgradeable** (UUPS) — impl: `0xb5276c436F65913Cd5332DE745d04feDEb4a21D4`

**Proxy History (1 event):**

| # | Date | Event | Address | Key Changes | Tx |
|---|---|---|---|---|---|
| 1 | 2025-01-21 | Upgrade | `0xb527...21D4` | Initial deployment | [0x3094948b3dbe89f4824217e37b8667fbb4d89e18b0b426a453fe7377095c26ea](https://etherscan.io/tx/0x3094948b3dbe89f4824217e37b8667fbb4d89e18b0b426a453fe7377095c26ea) |

### 🔴 `upgradeability (UUPS)`

> ⚠️ **CRITICAL** — Upgradeability allows arbitrary code replacement. Must be behind both a Multisig AND a Timelock.

**Privileged write functions:**  
**Capabilities:** ⬆️ **UPGRADE**
- `upgradeTo(address)` — Upgrade proxy implementation to a new address `[UPGRADE]`
- `upgradeToAndCall(address,bytes)` — Upgrade proxy implementation and call an initializer `[UPGRADE]`

**Members (2):**

| Address | Name / Type | Risk | Granted | Source | Details |
|---|---|---|---|---|---|
| `0x69dDEa332723cF5407151aAF68B9b076557FCA93` | TimelockController (2d) | 🟢 LOW | — | Storage only | 2d delay (⚠ changed 1x) |
| `0x8eec10616802Ef639CA55c98ac856553fAdEfBaD` | Gnosis Safe 3/5 | 🟢 LOW | — | Storage only | 3/5 signers |


**Delay history for `TimelockController (2d)` (0x69dD...CA93):** 2d → 2d

**Signers of `Gnosis Safe 3/5` (0x8eec...fBaD):**

| Signer | Type | Owner Since | Notes |
|---|---|---|---|
| `0x2a3Ef2FEd07D025b8B1f07d99C77471D11529db9` | EOA | — | EOA |
| `0x28d8af3CF7286Bdc34ae80cb90093dFA4dbb0020` | EOA | — | EOA |
| `0x7dd97C12abd41c53B4f2B3df6b872753F9DABCaa` | EOA | — | EOA |
| `0x1F76cC0eF4605f57478f3044e703AF6B0C57A297` | EOA | — | EOA |
| `0x0AE4eeAFfDA174F84c84c22f03a28F3AAB02FbDC` | EOA (EIP-7702 → `0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B`) | — | EOA |

### 🟢 `DEFAULT_ADMIN_ROLE` 🔄 8 changes

**Hash:** `0x0000000000000000000000000000000000000000000000000000000000000000`  
**Managed by:** `DEFAULT_ADMIN_ROLE`  

**Members (2):**

| Address | Name / Type | Risk | Granted | Source | Details |
|---|---|---|---|---|---|
| `0x69dDEa332723cF5407151aAF68B9b076557FCA93` | TimelockController (2d) | 🟢 LOW | 2026-02-23 | Events only · hasRole ✓ | 2d delay (⚠ changed 1x) |
| `0x8eec10616802Ef639CA55c98ac856553fAdEfBaD` | Gnosis Safe 3/5 | 🟢 LOW | 2026-02-25 | Events only · hasRole ✓ | 3/5 signers |

**🕘 Previous Holders (3)** _(verified inactive — `hasRole`/`is` returned false)_:

| Address | Name / Type | Granted | Status |
|---|---|---|---|
| `0x6C15B25E9750Dccb698C1a4023f34015bFe57649` | EOA | 2025-01-21 | 🕘 HISTORICAL |
| `0xF04422E68f55E7C25724128692C3063A775472f2` | ERC1967Proxy | 2025-01-21 | 🕘 HISTORICAL |
| `0xF682E0E4288E9DB3229D6F8D9adF0bb1289E99eb` | InsuranceCapitalLayerFactory | 2025-01-21 | 🕘 HISTORICAL |


**Delay history for `TimelockController (2d)` (0x69dD...CA93):** 2d → 2d

**Signers of `Gnosis Safe 3/5` (0x8eec...fBaD):**

| Signer | Type | Owner Since | Notes |
|---|---|---|---|
| `0x2a3Ef2FEd07D025b8B1f07d99C77471D11529db9` | EOA | — | EOA |
| `0x28d8af3CF7286Bdc34ae80cb90093dFA4dbb0020` | EOA | — | EOA |
| `0x7dd97C12abd41c53B4f2B3df6b872753F9DABCaa` | EOA | — | EOA |
| `0x1F76cC0eF4605f57478f3044e703AF6B0C57A297` | EOA | — | EOA |
| `0x0AE4eeAFfDA174F84c84c22f03a28F3AAB02FbDC` | EOA (EIP-7702 → `0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B`) | — | EOA |

### 🟠 `MINTER_ROLE` 🔄 5 changes

**Hash:** `0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6`  
**Managed by:** `DEFAULT_ADMIN_ROLE`  
**Privileged write functions:**  
**Capabilities:** 💰 **SUPPLY**
- `mint(address to, uint amount)` — Mints new tokens Only callable by addresses with MINTER_ROLE `[SUPPLY]`
- `burn(address user, uint amount)` — Burns tokens from a user's balance Only callable by addresses with MINTER_ROLE `[SUPPLY]`

**Members (3):**

| Address | Name / Type | Risk | Granted | Source | Details |
|---|---|---|---|---|---|
| `0x4691C475bE804Fa85f91c2D6D0aDf03114de3093` | ERC1967Proxy | 🟠 HIGH | 2025-01-21 | Events only · hasRole ✓ |  |
| `0xF00B3b06690bC7E2bC6A9ccae55d17b7CD818465` | BurnWithFromMintTokenPool | 🟠 HIGH | 2026-06-10 🆕 | Events only · hasRole ✓ |  |
| `0xa31deEbb3680A3007120e74bCbDf4df36F042A40` | InstantRedemption | 🟠 HIGH | 2025-10-01 | Events only · hasRole ✓ |  |

**🕘 Previous Holders (1)** _(verified inactive — `hasRole`/`is` returned false)_:

| Address | Name / Type | Granted | Status |
|---|---|---|---|
| `0x0DfB42aA18CEed719617CD554304f6CA412a6B18` | ShareTokenMinterBurner | 2026-01-09 | 🕘 HISTORICAL |

### 🟢 `UPGRADER_ROLE`

**Hash:** `0x189ab7a9244df0848122154315af71fe140f3db0fe014031783b0946b8c9d2e3`  
**Managed by:** `DEFAULT_ADMIN_ROLE`  
**Privileged write functions:**  
**Capabilities:** ⬆️ **UPGRADE**
- `upgradeToAndCall(address newImplementation, bytes memory data)` — Upgrade the implementation of the proxy to `newImplementation`, and subsequently execute the function call encoded in `data`. `[UPGRADE]`

**Members (1):**

| Address | Name / Type | Risk | Granted | Source | Details |
|---|---|---|---|---|---|
| `0x69dDEa332723cF5407151aAF68B9b076557FCA93` | TimelockController (2d) | 🟢 LOW | 2026-02-23 | Events only · hasRole ✓ | 2d delay (⚠ changed 1x) |

**🕘 Previous Holders (1)** _(verified inactive — `hasRole`/`is` returned false)_:

| Address | Name / Type | Granted | Status |
|---|---|---|---|
| `0xF04422E68f55E7C25724128692C3063A775472f2` | ERC1967Proxy | 2025-01-21 | 🕘 HISTORICAL |


**Delay history for `TimelockController (2d)` (0x69dD...CA93):** 2d → 2d

#### 💰 Supply Actions

_Mint / redeem / burn call tracking — last 5 calls per function, total counts preserved._

**`burn`** *(per-asset)* ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> This parameter has never been changed since deployment.

| Field | Value |
|---|---|
| Setter | `burn(address user, uint amount)` |
| Gated by | `MINTER_ROLE` |
| Tags | `SUPPLY` |
| Last called | — |
| Called by | — |
| Total calls | 0 ❄️ |

**`mint`** *(per-asset)* ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> This parameter has never been changed since deployment.

| Field | Value |
|---|---|
| Setter | `mint(address to, uint amount)` |
| Gated by | `MINTER_ROLE` |
| Tags | `SUPPLY` |
| Last called | — |
| Called by | — |
| Total calls | 0 ❄️ |

---
<a id="c-0x69ddea332723cf5407151aaf68b9b076557fca93"></a>
## > TimelockController `0x69dDEa332723cF5407151aAF68B9b076557FCA93`

### > 🟢 `DEFAULT_ADMIN_ROLE`

> **Hash:** `0x0000000000000000000000000000000000000000000000000000000000000000`  
> **Managed by:** `DEFAULT_ADMIN_ROLE`  

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x69dDEa332723cF5407151aAF68B9b076557FCA93` | TimelockController (2d) | 🟢 LOW | 2026-02-23 | Events only · hasRole ✓ | 2d delay (⚠ changed 1x) |

> **🕘 Previous Holders (1)** _(verified inactive — `hasRole`/`is` returned false)_:

> | Address | Name / Type | Granted | Status |
> |---|---|---|---|
> | `0x8eec10616802Ef639CA55c98ac856553fAdEfBaD` | Gnosis Safe 3/5 | 2026-02-23 | 🕘 HISTORICAL |


> **Delay history for `TimelockController (2d)` (0x69dD...CA93):** 2d → 2d

### > 🔴 `CANCELLER_ROLE`

> **Hash:** `0xfd643c72710c63c0180259aba6b2d05451e3591a24e58b62239378085726f783`  
> **Managed by:** `DEFAULT_ADMIN_ROLE`  
> **Privileged write functions:**
> - `cancel(bytes32 id)` — Cancel an operation. Requirements:

> **Members (2):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x07e5faC51aD770e23F5399d51070647E16e75F4F` | EOA | 🔴 CRITICAL | 2026-02-23 | Events only · hasRole ✓ | ⚠️ Single private key |
> | `0x8eec10616802Ef639CA55c98ac856553fAdEfBaD` | Gnosis Safe 3/5 | 🟢 LOW | 2026-02-23 | Events only · hasRole ✓ | 3/5 signers |

> **Signers of `Gnosis Safe 3/5` (0x8eec...fBaD):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x2a3Ef2FEd07D025b8B1f07d99C77471D11529db9` | EOA | — | EOA |
> | `0x28d8af3CF7286Bdc34ae80cb90093dFA4dbb0020` | EOA | — | EOA |
> | `0x7dd97C12abd41c53B4f2B3df6b872753F9DABCaa` | EOA | — | EOA |
> | `0x1F76cC0eF4605f57478f3044e703AF6B0C57A297` | EOA | — | EOA |
> | `0x0AE4eeAFfDA174F84c84c22f03a28F3AAB02FbDC` | EOA (EIP-7702 → `0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B`) | — | EOA |

### > 🔴 `EXECUTOR_ROLE`

> **Hash:** `0xd8aa0f3194971a2a116679f7c2090f6939c8d4e01a2a8d7e41d55e5351469e63`  
> **Managed by:** `DEFAULT_ADMIN_ROLE`  
> **Privileged write functions:**
> - `execute(address target, uint256 value, bytes calldata payload, bytes32 predecessor, bytes32 salt)`
> - `executeBatch(address[] calldata targets, uint256[] calldata values, bytes[] calldata payloads, bytes32 predecessor, bytes32 salt)`

> **Members (3):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x4bFeA59B948A1A0fAC3C8C40BFd86E0E740738f3` | EOA | 🔴 CRITICAL | 2026-02-23 | Events only · hasRole ✓ | ⚠️ Single private key |
> | `0x629674e24ac87E3CD36C60FD4C2C026f146188a8` | EOA | 🔴 CRITICAL | 2026-06-15 🆕 | Events only · hasRole ✓ | ⚠️ Single private key |
> | `0x8eec10616802Ef639CA55c98ac856553fAdEfBaD` | Gnosis Safe 3/5 | 🟢 LOW | 2026-02-23 | Events only · hasRole ✓ | 3/5 signers |

> **Signers of `Gnosis Safe 3/5` (0x8eec...fBaD):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x2a3Ef2FEd07D025b8B1f07d99C77471D11529db9` | EOA | — | EOA |
> | `0x28d8af3CF7286Bdc34ae80cb90093dFA4dbb0020` | EOA | — | EOA |
> | `0x7dd97C12abd41c53B4f2B3df6b872753F9DABCaa` | EOA | — | EOA |
> | `0x1F76cC0eF4605f57478f3044e703AF6B0C57A297` | EOA | — | EOA |
> | `0x0AE4eeAFfDA174F84c84c22f03a28F3AAB02FbDC` | EOA (EIP-7702 → `0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B`) | — | EOA |

### > 🟢 `PROPOSER_ROLE`

> **Hash:** `0xb09aa5aeb3702cfd50b6b62bc4532604938f21248a27a1d5ca736082b6819cc1`  
> **Managed by:** `DEFAULT_ADMIN_ROLE`  
> **Privileged write functions:**
> - `schedule(address target, uint256 value, bytes calldata data, bytes32 predecessor, bytes32 salt, uint256 delay)` — Schedule an operation containing a single transaction. Emits {CallSalt} if salt is nonzero, and {CallScheduled}.
> - `scheduleBatch(address[] calldata targets, uint256[] calldata values, bytes[] calldata payloads, bytes32 predecessor, bytes32 salt, uint256 delay)` — Schedule an operation containing a batch of transactions. Emits {CallSalt} if salt is nonzero, and one {CallScheduled} event per transaction in the batch.

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x8eec10616802Ef639CA55c98ac856553fAdEfBaD` | Gnosis Safe 3/5 | 🟢 LOW | 2026-02-23 | Events only · hasRole ✓ | 3/5 signers |

> **Signers of `Gnosis Safe 3/5` (0x8eec...fBaD):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x2a3Ef2FEd07D025b8B1f07d99C77471D11529db9` | EOA | — | EOA |
> | `0x28d8af3CF7286Bdc34ae80cb90093dFA4dbb0020` | EOA | — | EOA |
> | `0x7dd97C12abd41c53B4f2B3df6b872753F9DABCaa` | EOA | — | EOA |
> | `0x1F76cC0eF4605f57478f3044e703AF6B0C57A297` | EOA | — | EOA |
> | `0x0AE4eeAFfDA174F84c84c22f03a28F3AAB02FbDC` | EOA (EIP-7702 → `0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B`) | — | EOA |

---
<a id="c-0x4691c475be804fa85f91c2d6d0adf03114de3093"></a>
## > InsuranceCapitalLayer `0x4691C475bE804Fa85f91c2D6D0aDf03114de3093`

> > ⚠️ **Upgradeable** (UUPS) — impl: `0x06d4ACC104b974cD99bF22e4572f48A051E59670`

> **Proxy History (1 event):**

> | # | Date | Event | Address | Key Changes | Tx |
> |---|---|---|---|---|---|
> | 1 | 2025-01-21 | Upgrade | `0x06d4...9670` | Initial deployment | [0x3094948b3dbe89f4824217e37b8667fbb4d89e18b0b426a453fe7377095c26ea](https://etherscan.io/tx/0x3094948b3dbe89f4824217e37b8667fbb4d89e18b0b426a453fe7377095c26ea) |

> > 💰 **Inherited supply authority** — holds `MINTER_ROLE` on **reUSD (ERC1967Proxy) [ShareToken]**. Access controls on this contract gate root token supply.

### > 🔴 `upgradeability (UUPS)`

> > ⚠️ **CRITICAL** — Upgradeability allows arbitrary code replacement. Must be behind both a Multisig AND a Timelock.

> **Privileged write functions:**  
> **Capabilities:** ⬆️ **UPGRADE**
> - `upgradeTo(address)` — Upgrade proxy implementation to a new address `[UPGRADE]`
> - `upgradeToAndCall(address,bytes)` — Upgrade proxy implementation and call an initializer `[UPGRADE]`

> **Members (2):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x69dDEa332723cF5407151aAF68B9b076557FCA93` | TimelockController (2d) | 🟢 LOW | — | Storage only | 2d delay (⚠ changed 1x) |
> | `0x8eec10616802Ef639CA55c98ac856553fAdEfBaD` | Gnosis Safe 3/5 | 🟢 LOW | — | Storage only | 3/5 signers |


> **Delay history for `TimelockController (2d)` (0x69dD...CA93):** 2d → 2d

> **Signers of `Gnosis Safe 3/5` (0x8eec...fBaD):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x2a3Ef2FEd07D025b8B1f07d99C77471D11529db9` | EOA | — | EOA |
> | `0x28d8af3CF7286Bdc34ae80cb90093dFA4dbb0020` | EOA | — | EOA |
> | `0x7dd97C12abd41c53B4f2B3df6b872753F9DABCaa` | EOA | — | EOA |
> | `0x1F76cC0eF4605f57478f3044e703AF6B0C57A297` | EOA | — | EOA |
> | `0x0AE4eeAFfDA174F84c84c22f03a28F3AAB02FbDC` | EOA (EIP-7702 → `0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B`) | — | EOA |

### > 🟢 `DEFAULT_ADMIN_ROLE` 🔄 8 changes

> **Hash:** `0x0000000000000000000000000000000000000000000000000000000000000000`  
> **Managed by:** `DEFAULT_ADMIN_ROLE`  

> **Members (2):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x69dDEa332723cF5407151aAF68B9b076557FCA93` | TimelockController (2d) | 🟢 LOW | 2026-02-23 | Events only · hasRole ✓ | 2d delay (⚠ changed 1x) |
> | `0x8eec10616802Ef639CA55c98ac856553fAdEfBaD` | Gnosis Safe 3/5 | 🟢 LOW | 2026-02-25 | Events only · hasRole ✓ | 3/5 signers |

> **🕘 Previous Holders (3)** _(verified inactive — `hasRole`/`is` returned false)_:

> | Address | Name / Type | Granted | Status |
> |---|---|---|---|
> | `0x6C15B25E9750Dccb698C1a4023f34015bFe57649` | EOA | 2025-01-21 | 🕘 HISTORICAL |
> | `0xF04422E68f55E7C25724128692C3063A775472f2` | ERC1967Proxy | 2025-01-21 | 🕘 HISTORICAL |
> | `0xF682E0E4288E9DB3229D6F8D9adF0bb1289E99eb` | InsuranceCapitalLayerFactory | 2025-01-21 | 🕘 HISTORICAL |


> **Delay history for `TimelockController (2d)` (0x69dD...CA93):** 2d → 2d

> **Signers of `Gnosis Safe 3/5` (0x8eec...fBaD):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x2a3Ef2FEd07D025b8B1f07d99C77471D11529db9` | EOA | — | EOA |
> | `0x28d8af3CF7286Bdc34ae80cb90093dFA4dbb0020` | EOA | — | EOA |
> | `0x7dd97C12abd41c53B4f2B3df6b872753F9DABCaa` | EOA | — | EOA |
> | `0x1F76cC0eF4605f57478f3044e703AF6B0C57A297` | EOA | — | EOA |
> | `0x0AE4eeAFfDA174F84c84c22f03a28F3AAB02FbDC` | EOA (EIP-7702 → `0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B`) | — | EOA |

### > 🟠 `OPERATOR_ROLE` 🔄 7 changes

> **Hash:** `0x97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b929`  
> **Managed by:** `DEFAULT_ADMIN_ROLE`  
> **Privileged write functions:**  
> **Capabilities:** 💰 **SUPPLY**
> - `setDepositEnabled(bool depositEnabled_)` — Set Deposit enabled or not /
> - `setKycRegistry(address kycRegistry_)`
> - `setDepositTokenRegistry(address depositTokenRegistry_)`
> - `setSharePriceCalculator(address sharePriceCalculator_)` `[SUPPLY]`
> - `setCollateralManager(address _collateralManager)` — Sets the collateral manager address /
> - `setRedemptionManager(address _redemptionManager)` — Sets the redemption manager address /
> - `withdrawToCustodian(address custodian, address token, uint256 amount)` — Transfer a specified token and amount to the designated custodian / `[SUPPLY]`
> - `setShareToken(ShareToken token)`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x3f0DA1C363e34802C6f12F9C27276dC0e6696FD8` | AccessManager | 🟠 HIGH | 2026-05-13 | Events only · hasRole ✓ |  |

> **🕘 Previous Holders (3)** _(verified inactive — `hasRole`/`is` returned false)_:

> | Address | Name / Type | Granted | Status |
> |---|---|---|---|
> | `0x8eec10616802Ef639CA55c98ac856553fAdEfBaD` | Gnosis Safe 3/5 | 2026-02-27 | 🕘 HISTORICAL |
> | `0x6C15B25E9750Dccb698C1a4023f34015bFe57649` | EOA | 2025-01-21 | 🕘 HISTORICAL |
> | `0xF682E0E4288E9DB3229D6F8D9adF0bb1289E99eb` | InsuranceCapitalLayerFactory | 2025-01-21 | 🕘 HISTORICAL |

### > 🟢 `UPGRADER_ROLE`

> **Hash:** `0x189ab7a9244df0848122154315af71fe140f3db0fe014031783b0946b8c9d2e3`  
> **Managed by:** `DEFAULT_ADMIN_ROLE`  
> **Privileged write functions:**  
> **Capabilities:** ⬆️ **UPGRADE**
> - `upgradeToAndCall(address newImplementation, bytes memory data)` — Upgrade the implementation of the proxy to `newImplementation`, and subsequently execute the function call encoded in `data`. `[UPGRADE]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x69dDEa332723cF5407151aAF68B9b076557FCA93` | TimelockController (2d) | 🟢 LOW | 2026-02-23 | Events only · hasRole ✓ | 2d delay (⚠ changed 1x) |

> **🕘 Previous Holders (1)** _(verified inactive — `hasRole`/`is` returned false)_:

> | Address | Name / Type | Granted | Status |
> |---|---|---|---|
> | `0xF04422E68f55E7C25724128692C3063A775472f2` | ERC1967Proxy | 2025-01-21 | 🕘 HISTORICAL |


> **Delay history for `TimelockController (2d)` (0x69dD...CA93):** 2d → 2d

### > 🟠 `depositTokenRegistry()`

> **Privileged write functions:**  
> **Capabilities:** 💰 **SUPPLY**
> - `deposit(address token, uint amount, uint minShares)` — Deposit tokens to insurance capital layer / `[SUPPLY]`
> - `processPrestakedDeposit(address token, uint amount, uint minShares, address receiver)` — Deposit tokens to insurance capital layer / `[SUPPLY]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x73d37A98C0fCBd049BfFFfe67Bf9af36d603c0F6` | DepositTokenRegistry | 🟠 HIGH | — | Storage only |  |

### > 🟠 `sharePriceCalculator()`

> **Privileged write functions:**  
> **Capabilities:** 💰 **SUPPLY**
> - `deposit(address token, uint amount, uint minShares)` — Deposit tokens to insurance capital layer / `[SUPPLY]`
> - `processPrestakedDeposit(address token, uint amount, uint minShares, address receiver)` — Deposit tokens to insurance capital layer / `[SUPPLY]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xd1D104a7515989ac82F1AFDa15a23650411b05B8` | SharePriceCalculator | 🟠 HIGH | — | Storage only |  |

### > 🟠 `shareToken()`

> **Privileged write functions:**  
> **Capabilities:** 💰 **SUPPLY**
> - `deposit(address token, uint amount, uint minShares)` — Deposit tokens to insurance capital layer / `[SUPPLY]`
> - `processPrestakedDeposit(address token, uint amount, uint minShares, address receiver)` — Deposit tokens to insurance capital layer / `[SUPPLY]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x5086bf358635B81D8C47C66d1C8b9E567Db70c72` | reUSD (ERC1967Proxy) | 🟠 HIGH | — | Storage+Events |  |

### > 🔴 `PAUSER_ROLE`

> **Hash:** `0x65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a`  
> **Managed by:** `DEFAULT_ADMIN_ROLE`  
> **Privileged write functions:**  
> **Capabilities:** ⏸️ **PAUSE**
> - `pause()` — (auto) Pause contract operations — may disable transfers, minting, or other functions `[PAUSE]`
> - `unpause()` — (auto) Resume contract operations after a pause `[PAUSE]`

> **Members (2):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x07e5faC51aD770e23F5399d51070647E16e75F4F` | EOA | 🔴 CRITICAL | 2026-02-24 | Events only · hasRole ✓ | ⚠️ Single private key |
> | `0x8eec10616802Ef639CA55c98ac856553fAdEfBaD` | Gnosis Safe 3/5 | 🟢 LOW | 2026-02-24 | Events only · hasRole ✓ | 3/5 signers |

> **Signers of `Gnosis Safe 3/5` (0x8eec...fBaD):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x2a3Ef2FEd07D025b8B1f07d99C77471D11529db9` | EOA | — | EOA |
> | `0x28d8af3CF7286Bdc34ae80cb90093dFA4dbb0020` | EOA | — | EOA |
> | `0x7dd97C12abd41c53B4f2B3df6b872753F9DABCaa` | EOA | — | EOA |
> | `0x1F76cC0eF4605f57478f3044e703AF6B0C57A297` | EOA | — | EOA |
> | `0x0AE4eeAFfDA174F84c84c22f03a28F3AAB02FbDC` | EOA (EIP-7702 → `0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B`) | — | EOA |

### > 🟢 `CUSTODIAN_MANAGER_ROLE` 🔄 5 changes

> **Hash:** `0x0792b37891b8244bb8149106fc05e84f10f266ef581c099bf3d880350e979b2f`  
> **Managed by:** `DEFAULT_ADMIN_ROLE`  
> **Privileged write functions:**
> - `addCustodian(address token, address custodian)` — Add a custodian for a specific token /
> - `removeCustodian(address token, address custodian)` — Remove a custodian for a specific token /

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x69dDEa332723cF5407151aAF68B9b076557FCA93` | TimelockController (2d) | 🟢 LOW | 2026-03-19 | Events only · hasRole ✓ | 2d delay (⚠ changed 1x) |

> **🕘 Previous Holders (2)** _(verified inactive — `hasRole`/`is` returned false)_:

> | Address | Name / Type | Granted | Status |
> |---|---|---|---|
> | `0x6C15B25E9750Dccb698C1a4023f34015bFe57649` | EOA | 2025-06-20 | 🕘 HISTORICAL |
> | `0x9b6d7f2de2E4569297C7e88531E47679cEbE6eC9` | EOA | 2025-01-24 | 🕘 HISTORICAL |


> **Delay history for `TimelockController (2d)` (0x69dD...CA93):** 2d → 2d

### > ⚪ `FEE_MANAGER_ROLE`

> **Hash:** `0x6c0757dc3e6b28b2580c03fd9e96c274acf4f99d91fbec9b418fa1d70604ff1c`  
> **Managed by:** `DEFAULT_ADMIN_ROLE`  
> **Privileged write functions:**
> - `claimDepositFees(address token, address recipient)` — Claims accumulated deposit fees for a specific token /

> **Members (0):** ⚠️ _**Declared but unheld** — role exists in source and gates the function(s) listed above, but has never been granted to any address. The moment any admin grants this role, the gated function becomes callable; treat this as a one-tx-away live capability._


### > 🟠 `kycRegistry()` · 📋 operational


> **Members (1):**

> | Address | Name / Type | Granted | Source | Details |
> |---|---|---|---|---|
> | `0x82F1806AEab5Ecb9a485eb041d5Ed4940b123995` | KYCRegistry | — | Storage only |  |

> #### 🔧 Permissioned Parameters

> **`collateralManager`** ❄️ **DORMANT**

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `0x0000000000000000000000000000000000000000` |
> | Setter | `setCollateralManager(address _collateralManager)` |
> | Gated by | `OPERATOR_ROLE` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`depositEnabled`** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> | Field | Value |
> |---|---|
> | Current Value | `True` |
> | Setter | `setDepositEnabled(bool depositEnabled_)` |
> | Gated by | `OPERATOR_ROLE` |
> | Tags | — |
> | Last changed | 2025-01-24 |
> | Changed by | `0x6C15...7649` (EOA) |
> | Total changes | 1 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `True` | `0x6C15...7649` (EOA) | 2025-01-24 |

> **`depositTokenRegistry`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)* 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `0x73d37A98C0fCBd049BfFFfe67Bf9af36d603c0F6` |
> | Setter | `setDepositTokenRegistry(address depositTokenRegistry_)` |
> | Gated by | `OPERATOR_ROLE` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`kycRegistry`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)* 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `0x82F1806AEab5Ecb9a485eb041d5Ed4940b123995` |
> | Setter | `setKycRegistry(address kycRegistry_)` |
> | Gated by | `OPERATOR_ROLE` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`pause`** ❄️ **DORMANT**

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Setter | `pause()` |
> | Gated by | `PAUSER_ROLE` |
> | Tags | `PAUSE` |
> | Last called | — |
> | Called by | — |
> | Total calls | 0 ❄️ |

> **`redemptionManager`** ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `0x0000000000000000000000000000000000000000` |
> | Setter | `setRedemptionManager(address _redemptionManager)` |
> | Gated by | `OPERATOR_ROLE` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`sharePriceCalculator`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)* 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `0xd1D104a7515989ac82F1AFDa15a23650411b05B8` |
> | Setter | `setSharePriceCalculator(address sharePriceCalculator_)` |
> | Gated by | `OPERATOR_ROLE` |
> | Tags | `SUPPLY` |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`shareToken`**

> | Field | Value |
> |---|---|
> | Current Value | `0x5086bf358635B81D8C47C66d1C8b9E567Db70c72` |
> | Setter | `setShareToken(ShareToken token)` |
> | Gated by | `OPERATOR_ROLE` |
> | Tags | — |
> | Last changed | 2025-01-21 |
> | Changed by | `0x5086...0c72` (reUSD (ERC1967Proxy)) |
> | Total changes | 1 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `0x5086bf358635B81D8C47C66d1C8b9E567Db70c72` | `0x5086...0c72` (reUSD (ERC1967Proxy)) | 2025-01-21 |

> **`unpause`** ❄️ **DORMANT**

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Setter | `unpause()` |
> | Gated by | `PAUSER_ROLE` |
> | Tags | `PAUSE` |
> | Last called | — |
> | Called by | — |
> | Total calls | 0 ❄️ |

> #### 💰 Supply Actions

> _Mint / redeem / burn call tracking — last 5 calls per function, total counts preserved._

> **`deposit`** *(per-asset)* 🔄 **ACTIVE** (132 changes)

> > ⚠️ This parameter has been changed **132 times** — monitor for unexpected modifications.

> | Field | Value |
> |---|---|
> | Setter | `deposit(address token, uint amount, uint minShares)` |
> | Gated by | `depositTokenRegistry(), shareToken(), sharePriceCalculator()` |
> | Tags | `SUPPLY` |
> | Last called | 2026-07-02 |
> | Called by | `0xAa34...5Dd5` |
> | Total calls | 132 🔄 |

> **Recent changes (showing last 5 of 132):**

> | # | Asset | Value | Set By | Date |
> |---|---|---|---|---|
> | 1 | EOA | `382000000000` | `0xAa34...5Dd5` | 2026-07-02 |
> | 2 | EOA | `442892994630` | `0xAa34...5Dd5` | 2026-07-02 |
> | 3 | EOA | `250910935` | `0xcE67...B1d2` | 2026-07-02 |
> | 4 | 0xae5d...0E5D | `5500000000` | `0xae5d...0E5D` | 2026-07-02 |
> | 5 | EOA | `5302413476` | `0xfb04...a862` | 2026-07-02 |

> **`processPrestakedDeposit`** *(per-asset)* ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Setter | `processPrestakedDeposit(address token, uint amount, uint minShares, address receiver)` |
> | Gated by | `depositTokenRegistry(), shareToken(), sharePriceCalculator()` |
> | Tags | `SUPPLY` |
> | Last called | — |
> | Called by | — |
> | Total calls | 0 ❄️ |

> **`withdrawToCustodian`** *(per-asset)* 🔄 **ACTIVE** (1166 changes) 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > ⚠️ This parameter has been changed **1166 times** — monitor for unexpected modifications.

> | Field | Value |
> |---|---|
> | Setter | `withdrawToCustodian(address custodian, address token, uint256 amount)` |
> | Gated by | `OPERATOR_ROLE` |
> | Tags | `SUPPLY` |
> | Last called | 2026-05-15 |
> | Called by | `0x6C15...7649` (EOA) |
> | Total calls | 1166 🔄 |

> **Recent changes (showing last 5 of 1166):**

> | # | Asset | Value | Set By | Date |
> |---|---|---|---|---|
> | 1 | EOA | `token=0xdAC17F958D2ee523a2206206994597C13D831ec7 · amount=366335900095` | `0x6C15...7649` (EOA) | 2026-05-15 |
> | 2 | EOA | `token=0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 · amount=2006145333908` | `0x6C15...7649` (EOA) | 2026-05-15 |
> | 3 | EOA | `token=0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 · amount=30000000000` | `0x6C15...7649` (EOA) | 2026-05-12 |
> | 4 | EOA | `token=0x9D39A5DE30e57443BfF2A8307A4256c8797A3497 · amount=176000000000000000000000 (176,000.000000e18)` | `0x6C15...7649` (EOA) | 2026-05-11 |
> | 5 | EOA | `token=0x9D39A5DE30e57443BfF2A8307A4256c8797A3497 · amount=48000000000000000000000 (48,000.000000e18)` | `0x6C15...7649` (EOA) | 2026-05-11 |

---
<a id="c-0xf00b3b06690bc7e2bc6a9ccae55d17b7cd818465"></a>
## > BurnWithFromMintTokenPool `0xF00B3b06690bC7E2bC6A9ccae55d17b7CD818465`

> > 💰 **Inherited supply authority** — holds `MINTER_ROLE` on **reUSD (ERC1967Proxy) [ShareToken]**. Access controls on this contract gate root token supply.

> 🔒 **Immutable References:** `getRmnProxy()` → ARMProxy

> ✅ **Two-step admin transfer:** `OZ Ownable2Step` — prevents accidental hand-off (request → accept flow).

### > 🟢 `owner()`

> **Privileged write functions:**  
> **Capabilities:** ⚙️ **CONFIG**
> - `setDynamicConfig(address router, address rateLimitAdmin, address feeAdmin)` — Sets the dynamic configuration for the pool. FeeTokenHandler will revert if feeAdmin is zero when withdrawing fees. If only the owner can withdraw fees, set feeAdmin to address(0).
> - `setAllowedFinalityConfig(bytes4 allowedFinality)` — Sets the finality config according to the FinalityCodec library encoding.
> - `updateAdvancedPoolHooks(IAdvancedPoolHooks newHook)` — Updates the advanced pool hook.
> - `addRemotePool(uint64 remoteChainSelector, bytes calldata remotePoolAddress)` — Adds a remote pool for a given chain selector. This could be due to a pool being upgraded on the remote chain. We don't simply want to replace the old pool as there could still be valid inflight messages from the old pool. This function allows for multiple pools to be added for a single chain selector.
> - `removeRemotePool(uint64 remoteChainSelector, bytes calldata remotePoolAddress)` — Removes the remote pool address for a given chain selector. All inflight txs from the remote pool will be rejected after it is removed. To ensure no loss of funds, there should be no inflight txs from the given pool.
> - `applyChainUpdates(uint64[] calldata remoteChainSelectorsToRemove, ChainUpdate[] calldata chainsToAdd)` — Sets the permissions for a list of chains selectors. Actual senders for these chains need to be allowed on the Router to interact with this pool. are only used when the chain is being added through `allowed` being true. Only callable by the owner
> - `setRateLimitConfig(RateLimitConfigArgs[] calldata rateLimitConfigArgs)` — Sets the rate limit configurations for specified remote chains.
> - `applyTokenTransferFeeConfigUpdates(TokenTransferFeeConfigArgs[] calldata tokenTransferFeeConfigArgs, uint64[] calldata disableTokenTransferFeeConfigs)` — Updates the token transfer fee configurations for specified destination chains.
> - `withdrawFeeTokens(address[] calldata feeTokens, address recipient)` — Withdraws accrued fee token balances to the provided `recipient`. Only callable by the owner or the fee admin. FeeTokenHandler will revert if `recipient` is zero address. Pools accrue fees directly on this contract. Lock/release pools send bridge liquidity to their ERC20 lockbox during the lock flow, which means any balance left on this contract represents fees that have accrued to the pool. Because user liquidity never resides on `address(this)` for lock/release pools, transferring the full contract balance is safe and clears only accrued fees.
> - `transferOwnership(address to)` — Allows an owner to begin transferring ownership to a new address. The new owner needs to call `acceptOwnership` to accept the transfer before any permissions are changed.
> - `acceptOwnership()` — Second step of `OZ Ownable2Step` — callable by the pending holder set via `transferOwnership`, not by the current role. Included here to surface the full transfer handoff. `[CONFIG]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x8eec10616802Ef639CA55c98ac856553fAdEfBaD` | Gnosis Safe 3/5 | 🟢 LOW | — | Storage+Events | 3/5 signers |

> **Signers of `Gnosis Safe 3/5` (0x8eec...fBaD):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x2a3Ef2FEd07D025b8B1f07d99C77471D11529db9` | EOA | — | EOA |
> | `0x28d8af3CF7286Bdc34ae80cb90093dFA4dbb0020` | EOA | — | EOA |
> | `0x7dd97C12abd41c53B4f2B3df6b872753F9DABCaa` | EOA | — | EOA |
> | `0x1F76cC0eF4605f57478f3044e703AF6B0C57A297` | EOA | — | EOA |
> | `0x0AE4eeAFfDA174F84c84c22f03a28F3AAB02FbDC` | EOA (EIP-7702 → `0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B`) | — | EOA |

> #### 🔧 Permissioned Parameters

> **`getAdvancedPoolHooks`** ❄️ **DORMANT**

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `0x0000000000000000000000000000000000000000` |
> | Setter | `updateAdvancedPoolHooks(IAdvancedPoolHooks newHook)` |
> | Gated by | `owner()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`getDynamicConfig`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)*

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `router: 0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D · rateLimitAdmin: 0x0000000000000000000000000000000000000000 · feeAdmin: 0x0000000000000000000000000000000000000000` |
> | Setter | `setDynamicConfig(address router, address rateLimitAdmin, address feeAdmin)` |
> | Gated by | `owner()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

---
<a id="c-0xa31deebb3680a3007120e74bcbdf4df36f042a40"></a>
## > InstantRedemption `0xa31deEbb3680A3007120e74bCbDf4df36F042A40`

> > 🛡️ **Managed by AccessManager** — restricted functions are gated by [AccessManager](#c-0x3f0da1c363e34802c6f12f9c27276dc0e6696fd8) `0x3f0DA1C363e34802C6f12F9C27276dC0e6696FD8`. Each `restricted()` function is attributed to its AM role below; the role's members (verified via `hasRole`) are the actual authorities. Note: ADMIN_ROLE on the AccessManager can re-grant any role, so the meta-admin chain is the upper bound on single-key reachability.

> > 💰 **Inherited supply authority** — holds `MINTER_ROLE` on **reUSD (ERC1967Proxy) [ShareToken]**. Access controls on this contract gate root token supply.

> 🔒 **Immutable References:** `vault()` → RedemptionVault, `custodialWallet()` → EOA, `redemptionReserves()` → RedemptionReserveCalculator, `dayPayoutToken()` → sUSDe (StakedUSDeV2), `redemptionPriceRouter()` → PriceRouter

### > 🟠 `AM Operator (role 3678572998923334730; gates 1 fn(s) across 1 target(s)) [via AM 0x3f0D...6FD8]`

> **Hash:** `am_role_3678572998923334730@0x3f0da1c363e34802c6f12f9c27276dc0e6696fd8`  
> **Privileged write functions:**  
> **Capabilities:** 💰 **SUPPLY**
> - `redeemFor(address,uint256,uint256)` `[SUPPLY]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x8aEb9453EF22Cb38abC7a3Af9c208F65C1BfE31e` | RedemptionGateway | 🟠 HIGH | — | Storage only |  |

### > 🟠 `kyc()`

> **Privileged write functions:**  
> **Capabilities:** 💰 **SUPPLY**
> - `redeemFor(address user, uint256 shares, uint256 minPayout)` — Process instant redemption for a user (gateway call) / `[SUPPLY]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x82F1806AEab5Ecb9a485eb041d5Ed4940b123995` | KYCRegistry | 🟠 HIGH | — | Storage only |  |

### > 🟠 `payoutTokenRegistry()`

> **Privileged write functions:**  
> **Capabilities:** 💰 **SUPPLY**
> - `redeemFor(address user, uint256 shares, uint256 minPayout)` — Process instant redemption for a user (gateway call) / `[SUPPLY]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xf788624278Dc0D5b4e494F834932e6938AA2Bdc3` | PayoutTokenRegistry | 🟠 HIGH | — | Storage only |  |

### > 🟠 `shareToken()`

> **Privileged write functions:**  
> **Capabilities:** 💰 **SUPPLY**
> - `redeemFor(address user, uint256 shares, uint256 minPayout)` — Process instant redemption for a user (gateway call) / `[SUPPLY]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x5086bf358635B81D8C47C66d1C8b9E567Db70c72` | reUSD (ERC1967Proxy) | 🟠 HIGH | — | Storage only |  |

### > 🔴 `AM Operator (role 11723228863651074278; gates 9 fn(s) across 3 target(s)) [via AM 0x3f0D...6FD8]`

> **Hash:** `am_role_11723228863651074278@0x3f0da1c363e34802c6f12f9c27276dc0e6696fd8`  
> **Privileged write functions:**  
> **Capabilities:** ⚙️ **CONFIG**
> - `setFeeVault(address)` `[CONFIG]`
> - `updateFee(uint16)` — Update the protocol fee parameter `[CONFIG]`
> - `updateLimitPercentages(uint256,uint256)`
> - `updateRedemptionRange(uint256,uint256)`
> - `updateHighWatermark()`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xEE16bE0374f2eFb34218affC1a8EbEe9310c47f8` | EOA | 🔴 CRITICAL | — | Storage only | ⚠️ Single private key |

### > 🟠 `authority()`


> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x3f0DA1C363e34802C6f12F9C27276dC0e6696FD8` | AccessManager | 🟠 HIGH | — | Storage+Events |  |

### > 🟠 `feeVault()` · 📋 operational


> **Members (1):**

> | Address | Name / Type | Granted | Source | Details |
> |---|---|---|---|---|
> | `0x2DF87810fCF9b8e6a42adC5923Bc2EE0ca0467CA` | FeeVault | — | Storage+Events |  |

> #### 🔧 Permissioned Parameters

> **`feeBps`**

> | Field | Value |
> |---|---|
> | Current Value | `6` |
> | Setter | `updateFee(uint16)` |
> | Gated by | `AM Operator (role 11723228863651074278; gates 9 fn(s) across 3 target(s)) [via AM 0x3f0D...6FD8]` |
> | Tags | `CONFIG` |
> | Last changed | 2026-03-15 |
> | Changed by | `0xEE16...47f8` (EOA) |
> | Total changes | 3 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `6` | `0xEE16...47f8` (EOA) | 2026-03-15 |
> | 2 | `16` | `0xEE16...47f8` (EOA) | 2025-10-08 |
> | 3 | `18` | `0xEE16...47f8` (EOA) | 2025-09-30 |

> **`feeVault`**

> | Field | Value |
> |---|---|
> | Current Value | `0x2DF87810fCF9b8e6a42adC5923Bc2EE0ca0467CA` |
> | Setter | `setFeeVault(address)` |
> | Gated by | `AM Operator (role 11723228863651074278; gates 9 fn(s) across 3 target(s)) [via AM 0x3f0D...6FD8]` |
> | Tags | `CONFIG` |
> | Last changed | 2025-09-30 |
> | Changed by | `0x2DF8...67CA` (FeeVault) |
> | Total changes | 1 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `0x2DF87810fCF9b8e6a42adC5923Bc2EE0ca0467CA` | `0x2DF8...67CA` (FeeVault) | 2025-09-30 |

> #### 💰 Supply Actions

> _Mint / redeem / burn call tracking — last 5 calls per function, total counts preserved._

> **`redeemFor`** *(per-asset)* ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Setter | `redeemFor(address user, uint256 shares, uint256 minPayout)` |
> | Gated by | `kyc(), shareToken(), payoutTokenRegistry(), AM Operator (role 3678572998923334730; gates 1 fn(s) across 1 target(s)) [via AM 0x3f0D...6FD8]` |
> | Tags | `SUPPLY` |
> | Last called | — |
> | Called by | — |
> | Total calls | 0 ❄️ |

---
<a id="c-0x3f0da1c363e34802c6f12f9c27276dc0e6696fd8"></a>
## > AccessManager `0x3f0DA1C363e34802C6f12F9C27276dC0e6696FD8`

> > 🛡️ **OpenZeppelin AccessManager** — manages 12 target(s). Role topology resolved below; role 0 (ADMIN_ROLE) holds meta-admin authority over every role grant on this AM.
> >
> > **📋 Manages:**
> >   - [ReProtocolStaking](#c-0x2eafa5bd2c477e21c8edd4c9781a2fa54c623900) `0x2EAF...3900` — 10 restricted fn(s)
> >   - [NAVConsumer](#c-0x84d4eaeb10f9e57b67622f667c6c13e22fa4b2b6) `0x84d4...b2B6` — 9 restricted fn(s)
> >   - [InsuranceCapitalLayer](#c-0x4691c475be804fa85f91c2d6d0adf03114de3093) `0x4691...3093` — 8 restricted fn(s)
> >   - [InstantRedemption](#c-0xa31deebb3680a3007120e74bcbdf4df36f042a40) `0xa31d...2A40` — 6 restricted fn(s)
> >   - [StakedRe](#c-0xad6d3923a78393d1e47321e276da3627a51f8431) `0xaD6d...8431` — 5 restricted fn(s)
> >   - [KYCRegistry](#c-0x82f1806aeab5ecb9a485eb041d5ed4940b123995) `0x82F1...3995` — 2 restricted fn(s)
> >   - [PayoutTokenRegistry](#c-0xf788624278dc0d5b4e494f834932e6938aa2bdc3) `0xf788...Bdc3` — 2 restricted fn(s)
> >   - 0x105f...D717 `0x105f...D717` — 9 restricted fn(s) *(out of BFS scope)*
> >   - 0xE188...3082 `0xE188...3082` — 8 restricted fn(s) *(out of BFS scope)*
> >   - 0x5C45...B147 `0x5C45...B147` — 5 restricted fn(s) *(out of BFS scope)*
> >   - 0xFe76...ab66 `0xFe76...ab66` — 2 restricted fn(s) *(out of BFS scope)*
> >   - 0xb593...5b75 `0xb593...5b75` — 2 restricted fn(s) *(out of BFS scope)*

> > 💰 **Inherited supply authority** — holds `MINTER_ROLE` on **reUSD (ERC1967Proxy) [ShareToken]**, `OPERATOR_ROLE` on **InsuranceCapitalLayer**. Access controls on this contract gate root token supply.

### > ⚪ `ADMIN_ROLE`

> **Hash:** `0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775`  
> **Privileged write functions:**
> - `cancel(address caller, address target, bytes calldata data)` — Cancel a scheduled (delayed) operation. Returns the nonce that identifies the previously scheduled operation that is cancelled.

> **Members (0):** ⚠️ _**Declared but unheld** — role exists in source and gates the function(s) listed above, but has never been granted to any address. The moment any admin grants this role, the gated function becomes callable; treat this as a one-tx-away live capability._


### > 🟢 `ADMIN_ROLE (AM root admin)`

> **Hash:** `am_role_0`  
> **Privileged write functions:**  
> **Capabilities:** 🏷️ **META_ADMIN**
> - `grantRole(uint64,address,uint32)` — Grant a role to an account; can hand any role on any managed target to any address with optional execution delay. `[META_ADMIN]`
> - `revokeRole(uint64,address)` — Revoke a role from an account. `[META_ADMIN]`
> - `setTargetFunctionRole(address,bytes4[],uint64)` — Map a (target,selector) tuple to a role ID — controls which role is required to call the function. `[META_ADMIN]`
> - `setRoleAdmin(uint64,uint64)` — Change which role admins another role. `[META_ADMIN]`
> - `setRoleGuardian(uint64,uint64)` — Change which role can cancel scheduled operations of another role. `[META_ADMIN]`
> - `setGrantDelay(uint64,uint32)` — Set the delay between when a role is granted and when it becomes usable. `[META_ADMIN]`
> - `setTargetAdminDelay(address,uint32)` — Set the per-target admin delay applied on top of role execution delay. `[META_ADMIN]`
> - `setTargetClosed(address,bool)` — Open or close a target — closed targets reject every restricted call regardless of role. `[META_ADMIN]`
> - `updateAuthority(address,address)` — Migrate a managed contract's authority to a different AccessManager. `[META_ADMIN]`
> - `labelRole(uint64,string)` — Attach a human-readable label to a role ID. `[META_ADMIN]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x8eec10616802Ef639CA55c98ac856553fAdEfBaD` | Gnosis Safe 3/5 | 🟢 LOW | — | Storage only | 3/5 signers |

> **Signers of `Gnosis Safe 3/5` (0x8eec...fBaD):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x2a3Ef2FEd07D025b8B1f07d99C77471D11529db9` | EOA | — | EOA |
> | `0x28d8af3CF7286Bdc34ae80cb90093dFA4dbb0020` | EOA | — | EOA |
> | `0x7dd97C12abd41c53B4f2B3df6b872753F9DABCaa` | EOA | — | EOA |
> | `0x1F76cC0eF4605f57478f3044e703AF6B0C57A297` | EOA | — | EOA |
> | `0x0AE4eeAFfDA174F84c84c22f03a28F3AAB02FbDC` | EOA (EIP-7702 → `0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B`) | — | EOA |

### > 🔴 `AM Operator (role 11723228863651074278; gates 9 fn(s) across 3 target(s))`

> **Hash:** `am_role_11723228863651074278`  

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xEE16bE0374f2eFb34218affC1a8EbEe9310c47f8` | EOA | 🔴 CRITICAL | — | Storage only | ⚠️ Single private key |

### > 🔴 `AM Operator (role 13027108596976310255; gates 1 fn(s) across 1 target(s))`

> **Hash:** `am_role_13027108596976310255`  

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xf31d8E94928147cCb30C698ddD81C6791861C4a9` | EOA | 🔴 CRITICAL | — | Storage only | ⚠️ Single private key |

### > 🟢 `AM Operator (role 13637004113993765744; gates 6 fn(s) across 2 target(s))`

> **Hash:** `am_role_13637004113993765744`  

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x8eec10616802Ef639CA55c98ac856553fAdEfBaD` | Gnosis Safe 3/5 | 🟢 LOW | — | Storage only | 3/5 signers |

> **Signers of `Gnosis Safe 3/5` (0x8eec...fBaD):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x2a3Ef2FEd07D025b8B1f07d99C77471D11529db9` | EOA | — | EOA |
> | `0x28d8af3CF7286Bdc34ae80cb90093dFA4dbb0020` | EOA | — | EOA |
> | `0x7dd97C12abd41c53B4f2B3df6b872753F9DABCaa` | EOA | — | EOA |
> | `0x1F76cC0eF4605f57478f3044e703AF6B0C57A297` | EOA | — | EOA |
> | `0x0AE4eeAFfDA174F84c84c22f03a28F3AAB02FbDC` | EOA (EIP-7702 → `0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B`) | — | EOA |

### > 🔴 `AM Operator (role 13697439394725303084; gates 1 fn(s) across 1 target(s))`

> **Hash:** `am_role_13697439394725303084`  

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x07e5faC51aD770e23F5399d51070647E16e75F4F` | EOA | 🔴 CRITICAL | — | Storage only | ⚠️ Single private key |

### > 🟢 `AM Operator (role 13724107344495470129; gates 6 fn(s) across 2 target(s))`

> **Hash:** `am_role_13724107344495470129`  

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x8eec10616802Ef639CA55c98ac856553fAdEfBaD` | Gnosis Safe 3/5 | 🟢 LOW | — | Storage only | 3/5 signers |

> **Signers of `Gnosis Safe 3/5` (0x8eec...fBaD):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x2a3Ef2FEd07D025b8B1f07d99C77471D11529db9` | EOA | — | EOA |
> | `0x28d8af3CF7286Bdc34ae80cb90093dFA4dbb0020` | EOA | — | EOA |
> | `0x7dd97C12abd41c53B4f2B3df6b872753F9DABCaa` | EOA | — | EOA |
> | `0x1F76cC0eF4605f57478f3044e703AF6B0C57A297` | EOA | — | EOA |
> | `0x0AE4eeAFfDA174F84c84c22f03a28F3AAB02FbDC` | EOA (EIP-7702 → `0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B`) | — | EOA |

### > 🟢 `AM Operator (role 15105228643940298600; gates 2 fn(s) across 2 target(s))`

> **Hash:** `am_role_15105228643940298600`  

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x8eec10616802Ef639CA55c98ac856553fAdEfBaD` | Gnosis Safe 3/5 | 🟢 LOW | — | Storage only | 3/5 signers |

> **Signers of `Gnosis Safe 3/5` (0x8eec...fBaD):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x2a3Ef2FEd07D025b8B1f07d99C77471D11529db9` | EOA | — | EOA |
> | `0x28d8af3CF7286Bdc34ae80cb90093dFA4dbb0020` | EOA | — | EOA |
> | `0x7dd97C12abd41c53B4f2B3df6b872753F9DABCaa` | EOA | — | EOA |
> | `0x1F76cC0eF4605f57478f3044e703AF6B0C57A297` | EOA | — | EOA |
> | `0x0AE4eeAFfDA174F84c84c22f03a28F3AAB02FbDC` | EOA (EIP-7702 → `0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B`) | — | EOA |

### > 🔴 `AM Operator (role 16768900588957885613; gates 2 fn(s) across 1 target(s))`

> **Hash:** `am_role_16768900588957885613`  

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x49BC5A880f77247A348764DdB95951cd9212A0ee` | EOA | 🔴 CRITICAL | — | Storage only | ⚠️ Single private key |

### > 🟢 `AM Operator (role 1696015379001973530; gates 1 fn(s) across 1 target(s))`

> **Hash:** `am_role_1696015379001973530`  

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x8eec10616802Ef639CA55c98ac856553fAdEfBaD` | Gnosis Safe 3/5 | 🟢 LOW | — | Storage only | 3/5 signers |

> **Signers of `Gnosis Safe 3/5` (0x8eec...fBaD):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x2a3Ef2FEd07D025b8B1f07d99C77471D11529db9` | EOA | — | EOA |
> | `0x28d8af3CF7286Bdc34ae80cb90093dFA4dbb0020` | EOA | — | EOA |
> | `0x7dd97C12abd41c53B4f2B3df6b872753F9DABCaa` | EOA | — | EOA |
> | `0x1F76cC0eF4605f57478f3044e703AF6B0C57A297` | EOA | — | EOA |
> | `0x0AE4eeAFfDA174F84c84c22f03a28F3AAB02FbDC` | EOA (EIP-7702 → `0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B`) | — | EOA |

### > 🔴 `AM Operator (role 17330594617245322166; gates 2 fn(s) across 2 target(s))`

> **Hash:** `am_role_17330594617245322166`  

> **Members (3):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x6C15B25E9750Dccb698C1a4023f34015bFe57649` | EOA | 🔴 CRITICAL | — | Storage only | ⚠️ Single private key |
> | `0x8eec10616802Ef639CA55c98ac856553fAdEfBaD` | Gnosis Safe 3/5 | 🟢 LOW | — | Storage only | 3/5 signers |
> | `0x99177B4E1Ec3076BE0a91511aabB9cC9aFA61989` | EOA | 🔴 CRITICAL | — | Storage only | ⚠️ Single private key |

> **Signers of `Gnosis Safe 3/5` (0x8eec...fBaD):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x2a3Ef2FEd07D025b8B1f07d99C77471D11529db9` | EOA | — | EOA |
> | `0x28d8af3CF7286Bdc34ae80cb90093dFA4dbb0020` | EOA | — | EOA |
> | `0x7dd97C12abd41c53B4f2B3df6b872753F9DABCaa` | EOA | — | EOA |
> | `0x1F76cC0eF4605f57478f3044e703AF6B0C57A297` | EOA | — | EOA |
> | `0x0AE4eeAFfDA174F84c84c22f03a28F3AAB02FbDC` | EOA (EIP-7702 → `0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B`) | — | EOA |

### > 🟢 `AM Operator (role 211310302505071350; gates 1 fn(s) across 1 target(s))`

> **Hash:** `am_role_211310302505071350`  

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x8eec10616802Ef639CA55c98ac856553fAdEfBaD` | Gnosis Safe 3/5 | 🟢 LOW | — | Storage only | 3/5 signers |

> **Signers of `Gnosis Safe 3/5` (0x8eec...fBaD):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x2a3Ef2FEd07D025b8B1f07d99C77471D11529db9` | EOA | — | EOA |
> | `0x28d8af3CF7286Bdc34ae80cb90093dFA4dbb0020` | EOA | — | EOA |
> | `0x7dd97C12abd41c53B4f2B3df6b872753F9DABCaa` | EOA | — | EOA |
> | `0x1F76cC0eF4605f57478f3044e703AF6B0C57A297` | EOA | — | EOA |
> | `0x0AE4eeAFfDA174F84c84c22f03a28F3AAB02FbDC` | EOA (EIP-7702 → `0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B`) | — | EOA |

### > 🟠 `AM Operator (role 2296013215840966718; gates 2 fn(s) across 1 target(s))`

> **Hash:** `am_role_2296013215840966718`  

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x2EAFA5bD2c477e21C8Edd4C9781A2FA54C623900` | ERC1967Proxy | 🟠 HIGH | — | Storage only |  |

### > 🟢 `AM Operator (role 2386126226847563591; gates 1 fn(s) across 1 target(s))`

> **Hash:** `am_role_2386126226847563591`  

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x8eec10616802Ef639CA55c98ac856553fAdEfBaD` | Gnosis Safe 3/5 | 🟢 LOW | — | Storage only | 3/5 signers |

> **Signers of `Gnosis Safe 3/5` (0x8eec...fBaD):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x2a3Ef2FEd07D025b8B1f07d99C77471D11529db9` | EOA | — | EOA |
> | `0x28d8af3CF7286Bdc34ae80cb90093dFA4dbb0020` | EOA | — | EOA |
> | `0x7dd97C12abd41c53B4f2B3df6b872753F9DABCaa` | EOA | — | EOA |
> | `0x1F76cC0eF4605f57478f3044e703AF6B0C57A297` | EOA | — | EOA |
> | `0x0AE4eeAFfDA174F84c84c22f03a28F3AAB02FbDC` | EOA (EIP-7702 → `0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B`) | — | EOA |

### > 🟠 `AM Operator (role 3640204883196431319; gates 4 fn(s) across 1 target(s))`

> **Hash:** `am_role_3640204883196431319`  

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xa31deEbb3680A3007120e74bCbDf4df36F042A40` | InstantRedemption | 🟠 HIGH | — | Storage only |  |

### > 🟠 `AM Operator (role 3678572998923334730; gates 1 fn(s) across 1 target(s))`

> **Hash:** `am_role_3678572998923334730`  

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x8aEb9453EF22Cb38abC7a3Af9c208F65C1BfE31e` | RedemptionGateway | 🟠 HIGH | — | Storage only |  |

### > 🔴 `AM Operator (role 4167819788622234682; gates 1 fn(s) across 1 target(s))`

> **Hash:** `am_role_4167819788622234682`  

> **Members (2):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x07e5faC51aD770e23F5399d51070647E16e75F4F` | EOA | 🔴 CRITICAL | — | Storage only | ⚠️ Single private key |
> | `0x8eec10616802Ef639CA55c98ac856553fAdEfBaD` | Gnosis Safe 3/5 | 🟢 LOW | — | Storage only | 3/5 signers |

> **Signers of `Gnosis Safe 3/5` (0x8eec...fBaD):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x2a3Ef2FEd07D025b8B1f07d99C77471D11529db9` | EOA | — | EOA |
> | `0x28d8af3CF7286Bdc34ae80cb90093dFA4dbb0020` | EOA | — | EOA |
> | `0x7dd97C12abd41c53B4f2B3df6b872753F9DABCaa` | EOA | — | EOA |
> | `0x1F76cC0eF4605f57478f3044e703AF6B0C57A297` | EOA | — | EOA |
> | `0x0AE4eeAFfDA174F84c84c22f03a28F3AAB02FbDC` | EOA (EIP-7702 → `0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B`) | — | EOA |

### > 🟢 `AM Operator (role 595895589036249767; gates 2 fn(s) across 2 target(s))`

> **Hash:** `am_role_595895589036249767`  

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x8eec10616802Ef639CA55c98ac856553fAdEfBaD` | Gnosis Safe 3/5 | 🟢 LOW | — | Storage only | 3/5 signers |

> **Signers of `Gnosis Safe 3/5` (0x8eec...fBaD):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x2a3Ef2FEd07D025b8B1f07d99C77471D11529db9` | EOA | — | EOA |
> | `0x28d8af3CF7286Bdc34ae80cb90093dFA4dbb0020` | EOA | — | EOA |
> | `0x7dd97C12abd41c53B4f2B3df6b872753F9DABCaa` | EOA | — | EOA |
> | `0x1F76cC0eF4605f57478f3044e703AF6B0C57A297` | EOA | — | EOA |
> | `0x0AE4eeAFfDA174F84c84c22f03a28F3AAB02FbDC` | EOA (EIP-7702 → `0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B`) | — | EOA |

### > 🔴 `AM Operator (role 6008468140057015847; gates 4 fn(s) across 2 target(s))`

> **Hash:** `am_role_6008468140057015847`  

> **Members (2):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x07e5faC51aD770e23F5399d51070647E16e75F4F` | EOA | 🔴 CRITICAL | — | Storage only | ⚠️ Single private key |
> | `0x8eec10616802Ef639CA55c98ac856553fAdEfBaD` | Gnosis Safe 3/5 | 🟢 LOW | — | Storage only | 3/5 signers |

> **Signers of `Gnosis Safe 3/5` (0x8eec...fBaD):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x2a3Ef2FEd07D025b8B1f07d99C77471D11529db9` | EOA | — | EOA |
> | `0x28d8af3CF7286Bdc34ae80cb90093dFA4dbb0020` | EOA | — | EOA |
> | `0x7dd97C12abd41c53B4f2B3df6b872753F9DABCaa` | EOA | — | EOA |
> | `0x1F76cC0eF4605f57478f3044e703AF6B0C57A297` | EOA | — | EOA |
> | `0x0AE4eeAFfDA174F84c84c22f03a28F3AAB02FbDC` | EOA (EIP-7702 → `0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B`) | — | EOA |

### > 🟢 `AM Operator (role 6185113085675920688; gates 1 fn(s) across 1 target(s))`

> **Hash:** `am_role_6185113085675920688`  

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x8eec10616802Ef639CA55c98ac856553fAdEfBaD` | Gnosis Safe 3/5 | 🟢 LOW | — | Storage only | 3/5 signers |

> **Signers of `Gnosis Safe 3/5` (0x8eec...fBaD):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x2a3Ef2FEd07D025b8B1f07d99C77471D11529db9` | EOA | — | EOA |
> | `0x28d8af3CF7286Bdc34ae80cb90093dFA4dbb0020` | EOA | — | EOA |
> | `0x7dd97C12abd41c53B4f2B3df6b872753F9DABCaa` | EOA | — | EOA |
> | `0x1F76cC0eF4605f57478f3044e703AF6B0C57A297` | EOA | — | EOA |
> | `0x0AE4eeAFfDA174F84c84c22f03a28F3AAB02FbDC` | EOA (EIP-7702 → `0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B`) | — | EOA |

### > 🟢 `AM Operator (role 6221502878770160436; gates 4 fn(s) across 2 target(s))`

> **Hash:** `am_role_6221502878770160436`  

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x8eec10616802Ef639CA55c98ac856553fAdEfBaD` | Gnosis Safe 3/5 | 🟢 LOW | — | Storage only | 3/5 signers |

> **Signers of `Gnosis Safe 3/5` (0x8eec...fBaD):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x2a3Ef2FEd07D025b8B1f07d99C77471D11529db9` | EOA | — | EOA |
> | `0x28d8af3CF7286Bdc34ae80cb90093dFA4dbb0020` | EOA | — | EOA |
> | `0x7dd97C12abd41c53B4f2B3df6b872753F9DABCaa` | EOA | — | EOA |
> | `0x1F76cC0eF4605f57478f3044e703AF6B0C57A297` | EOA | — | EOA |
> | `0x0AE4eeAFfDA174F84c84c22f03a28F3AAB02FbDC` | EOA (EIP-7702 → `0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B`) | — | EOA |

### > 🟢 `AM Operator (role 6390375181308542730; gates 4 fn(s) across 2 target(s))`

> **Hash:** `am_role_6390375181308542730`  

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x8eec10616802Ef639CA55c98ac856553fAdEfBaD` | Gnosis Safe 3/5 | 🟢 LOW | — | Storage only | 3/5 signers |

> **Signers of `Gnosis Safe 3/5` (0x8eec...fBaD):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x2a3Ef2FEd07D025b8B1f07d99C77471D11529db9` | EOA | — | EOA |
> | `0x28d8af3CF7286Bdc34ae80cb90093dFA4dbb0020` | EOA | — | EOA |
> | `0x7dd97C12abd41c53B4f2B3df6b872753F9DABCaa` | EOA | — | EOA |
> | `0x1F76cC0eF4605f57478f3044e703AF6B0C57A297` | EOA | — | EOA |
> | `0x0AE4eeAFfDA174F84c84c22f03a28F3AAB02FbDC` | EOA (EIP-7702 → `0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B`) | — | EOA |

### > 🔴 `AM Operator (role 7597158639823371722; gates 1 fn(s) across 1 target(s))`

> **Hash:** `am_role_7597158639823371722`  

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x9eA38e09F41A9DE53972a68268BA0Dcc6d2fAdf8` | EOA | 🔴 CRITICAL | — | Storage only | ⚠️ Single private key |

### > 🔴 `AM Operator (role 7731554317730017784; gates 2 fn(s) across 2 target(s))`

> **Hash:** `am_role_7731554317730017784`  

> **Members (2):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x07e5faC51aD770e23F5399d51070647E16e75F4F` | EOA | 🔴 CRITICAL | — | Storage only | ⚠️ Single private key |
> | `0x8eec10616802Ef639CA55c98ac856553fAdEfBaD` | Gnosis Safe 3/5 | 🟢 LOW | — | Storage only | 3/5 signers |

> **Signers of `Gnosis Safe 3/5` (0x8eec...fBaD):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x2a3Ef2FEd07D025b8B1f07d99C77471D11529db9` | EOA | — | EOA |
> | `0x28d8af3CF7286Bdc34ae80cb90093dFA4dbb0020` | EOA | — | EOA |
> | `0x7dd97C12abd41c53B4f2B3df6b872753F9DABCaa` | EOA | — | EOA |
> | `0x1F76cC0eF4605f57478f3044e703AF6B0C57A297` | EOA | — | EOA |
> | `0x0AE4eeAFfDA174F84c84c22f03a28F3AAB02FbDC` | EOA (EIP-7702 → `0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B`) | — | EOA |

### > 🟢 `AM Operator (role 8001233221072730583; gates 3 fn(s) across 1 target(s))`

> **Hash:** `am_role_8001233221072730583`  

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x8eec10616802Ef639CA55c98ac856553fAdEfBaD` | Gnosis Safe 3/5 | 🟢 LOW | — | Storage only | 3/5 signers |

> **Signers of `Gnosis Safe 3/5` (0x8eec...fBaD):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x2a3Ef2FEd07D025b8B1f07d99C77471D11529db9` | EOA | — | EOA |
> | `0x28d8af3CF7286Bdc34ae80cb90093dFA4dbb0020` | EOA | — | EOA |
> | `0x7dd97C12abd41c53B4f2B3df6b872753F9DABCaa` | EOA | — | EOA |
> | `0x1F76cC0eF4605f57478f3044e703AF6B0C57A297` | EOA | — | EOA |
> | `0x0AE4eeAFfDA174F84c84c22f03a28F3AAB02FbDC` | EOA (EIP-7702 → `0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B`) | — | EOA |

> #### 🔧 Permissioned Parameters

> **`getTargetAdminDelay`** *(per-asset)* 🔄 **ACTIVE** (12 changes)

> > ⚠️ This parameter has been changed **12 times** — monitor for unexpected modifications.

> | Asset | Current Value |
> |---|---|
> | NAVConsumer `0x105f...D717` | `172800` |
> | ERC1967Proxy `0x2EAF...3900` | `604800` |
> | ERC1967Proxy `0x4691...3093` | `172800` |
> | KYCRegistry `0x82F1...3995` | `172800` |
> | NAVConsumer `0x84d4...b2B6` | `172800` |
> | ERC1967Proxy `0xE188...3082` | `172800` |
> | sRE (ERC1967Proxy) `0xaD6d...8431` | `604800` |

> | Field | Value |
> |---|---|
> | Setter | `setTargetAdminDelay(address,uint32)` |
> | Gated by | `ADMIN_ROLE (AM root admin)` |
> | Tags | `META_ADMIN` |
> | Last changed | 2026-06-12 |
> | Changed by | `0x8eec...fBaD` (Gnosis Safe 3/5) |
> | Total changes | 12 🔄 |

> **Recent changes (showing last 5 of 12):**

> | # | Asset | Value | Set By | Date |
> |---|---|---|---|---|
> | 1 | sRE (ERC1967Proxy) | `newDelay=604800` | `0x8eec...fBaD` (Gnosis Safe 3/5) | 2026-06-12 |
> | 2 | ERC1967Proxy | `newDelay=604800` | `0x8eec...fBaD` (Gnosis Safe 3/5) | 2026-06-12 |
> | 3 | sRE (ERC1967Proxy) | `newDelay=604800` | `0x8eec...fBaD` (Gnosis Safe 3/5) | 2026-06-12 |
> | 4 | ERC1967Proxy | `newDelay=604800` | `0x8eec...fBaD` (Gnosis Safe 3/5) | 2026-06-12 |
> | 5 | sRE (ERC1967Proxy) | `newDelay=604800` | `0x8eec...fBaD` (Gnosis Safe 3/5) | 2026-06-12 |

> **`isTargetClosed`** *(per-asset)* ❄️ **DORMANT**

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Setter | `setTargetClosed(address,bool)` |
> | Gated by | `ADMIN_ROLE (AM root admin)` |
> | Tags | `META_ADMIN` |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

---
<a id="c-0x73d37a98c0fcbd049bffffe67bf9af36d603c0f6"></a>
## > DepositTokenRegistry `0x73d37A98C0fCBd049BfFFfe67Bf9af36d603c0F6`

> > 💰 **Inherited supply authority** — holds `MINTER_ROLE` on **reUSD (ERC1967Proxy) [ShareToken]**, `depositTokenRegistry()` on **InsuranceCapitalLayer**. Access controls on this contract gate root token supply.

> 🔒 **Immutable References:** `tokenOracle()` → sUSDe (StakedUSDeV2), `NATIVE_TOKEN()` → EOA

### > 🟢 `DEFAULT_ADMIN_ROLE`

> **Hash:** `0x0000000000000000000000000000000000000000000000000000000000000000`  
> **Managed by:** `DEFAULT_ADMIN_ROLE`  

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x8eec10616802Ef639CA55c98ac856553fAdEfBaD` | Gnosis Safe 3/5 | 🟢 LOW | 2026-05-08 | Events only · hasRole ✓ | 3/5 signers |

> **🕘 Previous Holders (1)** _(verified inactive — `hasRole`/`is` returned false)_:

> | Address | Name / Type | Granted | Status |
> |---|---|---|---|
> | `0x6C15B25E9750Dccb698C1a4023f34015bFe57649` | EOA | 2025-01-21 | 🕘 HISTORICAL |

> **Signers of `Gnosis Safe 3/5` (0x8eec...fBaD):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x2a3Ef2FEd07D025b8B1f07d99C77471D11529db9` | EOA | — | EOA |
> | `0x28d8af3CF7286Bdc34ae80cb90093dFA4dbb0020` | EOA | — | EOA |
> | `0x7dd97C12abd41c53B4f2B3df6b872753F9DABCaa` | EOA | — | EOA |
> | `0x1F76cC0eF4605f57478f3044e703AF6B0C57A297` | EOA | — | EOA |
> | `0x0AE4eeAFfDA174F84c84c22f03a28F3AAB02FbDC` | EOA (EIP-7702 → `0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B`) | — | EOA |

### > 🟢 `ORACLE_MANAGER_ROLE`

> **Hash:** `0xced6982f480260bdd8ad5cb18ff2854f0306d78d904ad6cc107e8f3a0f526c18`  
> **Managed by:** `DEFAULT_ADMIN_ROLE`  
> **Privileged write functions:**  
> **Capabilities:** 💰 **SUPPLY**
> - `updateTokenOracle(address token, address priceOracle_)` — Updates the price oracle for a specific token Only callable by accounts with ORACLE_MANAGER_ROLE Emits TokenOracleUpdated event `[SUPPLY]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x8eec10616802Ef639CA55c98ac856553fAdEfBaD` | Gnosis Safe 3/5 | 🟢 LOW | 2026-05-13 | Events only · hasRole ✓ | 3/5 signers |

> **🕘 Previous Holders (1)** _(verified inactive — `hasRole`/`is` returned false)_:

> | Address | Name / Type | Granted | Status |
> |---|---|---|---|
> | `0x6C15B25E9750Dccb698C1a4023f34015bFe57649` | EOA | 2025-01-21 | 🕘 HISTORICAL |

> **Signers of `Gnosis Safe 3/5` (0x8eec...fBaD):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x2a3Ef2FEd07D025b8B1f07d99C77471D11529db9` | EOA | — | EOA |
> | `0x28d8af3CF7286Bdc34ae80cb90093dFA4dbb0020` | EOA | — | EOA |
> | `0x7dd97C12abd41c53B4f2B3df6b872753F9DABCaa` | EOA | — | EOA |
> | `0x1F76cC0eF4605f57478f3044e703AF6B0C57A297` | EOA | — | EOA |
> | `0x0AE4eeAFfDA174F84c84c22f03a28F3AAB02FbDC` | EOA (EIP-7702 → `0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B`) | — | EOA |

### > 🔴 `PAUSER_ROLE`

> **Hash:** `0x65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a`  
> **Managed by:** `DEFAULT_ADMIN_ROLE`  
> **Privileged write functions:**  
> **Capabilities:** ⏸️ **PAUSE**
> - `pauseToken(address token)` — Pauses deposits for a specific token Only callable by accounts with PAUSER_ROLE Emits TokenPaused event `[PAUSE]`
> - `unpauseToken(address token)` — Unpauses deposits for a specific token Only callable by accounts with PAUSER_ROLE Emits TokenUnpaused event `[PAUSE]`

> **Members (2):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x07e5faC51aD770e23F5399d51070647E16e75F4F` | EOA | 🔴 CRITICAL | 2026-05-13 | Events only · hasRole ✓ | ⚠️ Single private key |
> | `0x8eec10616802Ef639CA55c98ac856553fAdEfBaD` | Gnosis Safe 3/5 | 🟢 LOW | 2026-05-13 | Events only · hasRole ✓ | 3/5 signers |

> **🕘 Previous Holders (1)** _(verified inactive — `hasRole`/`is` returned false)_:

> | Address | Name / Type | Granted | Status |
> |---|---|---|---|
> | `0x6C15B25E9750Dccb698C1a4023f34015bFe57649` | EOA | 2025-01-21 | 🕘 HISTORICAL |

> **Signers of `Gnosis Safe 3/5` (0x8eec...fBaD):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x2a3Ef2FEd07D025b8B1f07d99C77471D11529db9` | EOA | — | EOA |
> | `0x28d8af3CF7286Bdc34ae80cb90093dFA4dbb0020` | EOA | — | EOA |
> | `0x7dd97C12abd41c53B4f2B3df6b872753F9DABCaa` | EOA | — | EOA |
> | `0x1F76cC0eF4605f57478f3044e703AF6B0C57A297` | EOA | — | EOA |
> | `0x0AE4eeAFfDA174F84c84c22f03a28F3AAB02FbDC` | EOA (EIP-7702 → `0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B`) | — | EOA |

### > 🟢 `ADMIN_ROLE`

> **Hash:** `0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775`  
> **Managed by:** `DEFAULT_ADMIN_ROLE`  
> **Privileged write functions:**
> - `addToken(address token, uint256 fixedDepositFee_, uint256 percentageDepositFee_, address priceOracle_, bool eligibleAsCollateral_, uint256 defaultSlippageTolerance_, uint256 minDeposit_)` — Adds a new token to the registry Only callable by accounts with ADMIN_ROLE Emits TokenAdded, MinDepositUpdated, and CollateralEligibilityUpdated events
> - `removeToken(address token)` — Removes a token from the registry Only callable by accounts with ADMIN_ROLE Emits TokenRemoved event
> - `updateSlippage(address token, uint256 newSlippage)`
> - `addNativeToken(uint256 fixedDepositFee_, uint256 percentageDepositFee_, address priceOracle_, bool eligibleAsCollateral_, address wrappedNativeToken_, uint256 slippage_, uint256 minDeposit_)` — Adds the native token (e.g., ETH) to the registry with specified parameters Only callable by accounts with ADMIN_ROLE. This function can only be called once
> - `updateMinDeposit(address token, uint256 newMinDeposit)` — Updates the minimum deposit requirement for a token Only callable by accounts with ADMIN_ROLE Emits MinDepositUpdated event
> - `updateCollateralEligibility(address token, bool newEligibility)` — Updates whether a token can be used as collateral Only callable by accounts with ADMIN_ROLE Emits CollateralEligibilityUpdated event

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x8eec10616802Ef639CA55c98ac856553fAdEfBaD` | Gnosis Safe 3/5 | 🟢 LOW | 2026-05-13 | Events only · hasRole ✓ | 3/5 signers |

> **🕘 Previous Holders (1)** _(verified inactive — `hasRole`/`is` returned false)_:

> | Address | Name / Type | Granted | Status |
> |---|---|---|---|
> | `0x6C15B25E9750Dccb698C1a4023f34015bFe57649` | EOA | 2025-01-21 | 🕘 HISTORICAL |

> **Signers of `Gnosis Safe 3/5` (0x8eec...fBaD):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x2a3Ef2FEd07D025b8B1f07d99C77471D11529db9` | EOA | — | EOA |
> | `0x28d8af3CF7286Bdc34ae80cb90093dFA4dbb0020` | EOA | — | EOA |
> | `0x7dd97C12abd41c53B4f2B3df6b872753F9DABCaa` | EOA | — | EOA |
> | `0x1F76cC0eF4605f57478f3044e703AF6B0C57A297` | EOA | — | EOA |
> | `0x0AE4eeAFfDA174F84c84c22f03a28F3AAB02FbDC` | EOA (EIP-7702 → `0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B`) | — | EOA |

### > 🟢 `FEE_MANAGER_ROLE`

> **Hash:** `0x6c0757dc3e6b28b2580c03fd9e96c274acf4f99d91fbec9b418fa1d70604ff1c`  
> **Managed by:** `DEFAULT_ADMIN_ROLE`  
> **Privileged write functions:**
> - `updateTokenFees(address token, uint256 fixedDepositFee_, uint256 percentageDepositFee_)` — Updates deposit fees for a specific token Fee Structure: 1. Fixed Fee: Flat amount charged per transaction 2. Percentage Fee: Variable amount based on deposit size - Maximum percentage fee is 2500 BPS (25%) - Example: 300 BPS = 3% Emits TokenFeeUpdated event

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x8eec10616802Ef639CA55c98ac856553fAdEfBaD` | Gnosis Safe 3/5 | 🟢 LOW | 2026-05-13 | Events only · hasRole ✓ | 3/5 signers |

> **🕘 Previous Holders (1)** _(verified inactive — `hasRole`/`is` returned false)_:

> | Address | Name / Type | Granted | Status |
> |---|---|---|---|
> | `0x6C15B25E9750Dccb698C1a4023f34015bFe57649` | EOA | 2025-01-21 | 🕘 HISTORICAL |

> **Signers of `Gnosis Safe 3/5` (0x8eec...fBaD):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x2a3Ef2FEd07D025b8B1f07d99C77471D11529db9` | EOA | — | EOA |
> | `0x28d8af3CF7286Bdc34ae80cb90093dFA4dbb0020` | EOA | — | EOA |
> | `0x7dd97C12abd41c53B4f2B3df6b872753F9DABCaa` | EOA | — | EOA |
> | `0x1F76cC0eF4605f57478f3044e703AF6B0C57A297` | EOA | — | EOA |
> | `0x0AE4eeAFfDA174F84c84c22f03a28F3AAB02FbDC` | EOA (EIP-7702 → `0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B`) | — | EOA |

### > 🟠 `token()`


> **Members (7):**

> | Address | Name / Type | Granted | Source | Details |
> |---|---|---|---|---|
> | `0x4c9EDD5852cd905f086C759E8383e09bff1E68B3` | USDe (USDe) | — | Events only |  |
> | `0x57F5E098CaD7A3D1Eed53991D4d66C45C9AF7812` | wUSDM (ERC1967Proxy) | — | Events only |  |
> | `0x6B175474E89094C44Da98b954EedeAC495271d0F` | DAI (Dai) | — | Events only |  |
> | `0x9D39A5DE30e57443BfF2A8307A4256c8797A3497` | sUSDe (StakedUSDeV2) | — | Events only |  |
> | `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48` | USDC (FiatTokenProxy) | — | Events only |  |
> | `0xdAC17F958D2ee523a2206206994597C13D831ec7` | USDT (TetherToken) | — | Events only |  |
> | `0xdC035D45d973E3EC169d2276DDab16f1e407384F` | USDS (ERC1967Proxy) | — | Events only |  |

> #### 🔧 Permissioned Parameters

> **`getTokenInfo.minDeposit`** *(per-asset)* 🔄 **ACTIVE** (24 changes)

> > ⚠️ This parameter has been changed **24 times** — monitor for unexpected modifications.

> | Asset | Current Value |
> |---|---|
> | USDe (USDe) `0x4c9E...68B3` | `250000000000000000000 (250.000000e18)` |
> | wUSDM (ERC1967Proxy) `0x57F5...7812` | `10000000000000000000 (10.000000e18)` |
> | DAI (Dai) `0x6B17...1d0F` | `250000000000000000000 (250.000000e18)` |
> | Frax `0x853d...b99e` | `0` |
> | sUSDe (StakedUSDeV2) `0x9D39...3497` | `210000000000000000000 (210.000000e18)` |
> | USDC (FiatTokenProxy) `0xA0b8...eB48` | `250000000` |
> | USDT (TetherToken) `0xdAC1...1ec7` | `250000000` |
> | USDS (ERC1967Proxy) `0xdC03...384F` | `250000000000000000000 (250.000000e18)` |

> | Field | Value |
> |---|---|
> | Setter | `updateMinDeposit(address token, uint256 newMinDeposit)` |
> | Gated by | `ADMIN_ROLE` |
> | Tags | — |
> | Last changed | 2026-03-03 |
> | Changed by | `0x6C15...7649` (EOA) |
> | Total changes | 24 🔄 |

> **Recent changes (showing last 5 of 24):**

> | # | Asset | Value | Set By | Date |
> |---|---|---|---|---|
> | 1 | USDS (ERC1967Proxy) | `250000000000000000000 (250.000000e18)` | `0x6C15...7649` (EOA) | 2026-03-03 |
> | 2 | USDe (USDe) | `250000000000000000000 (250.000000e18)` | `0x6C15...7649` (EOA) | 2025-10-08 |
> | 3 | sUSDe (StakedUSDeV2) | `210000000000000000000 (210.000000e18)` | `0x6C15...7649` (EOA) | 2025-10-08 |
> | 4 | Frax | `250000000000000000000 (250.000000e18)` | `0x6C15...7649` (EOA) | 2025-10-08 |
> | 5 | USDC (FiatTokenProxy) | `250000000` | `0x6C15...7649` (EOA) | 2025-10-08 |

> **`getTokenInfo.slippage`** *(per-asset)* 🔧 **INIT-ONLY** *(set in code/init; setter unused)* 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Asset | Current Value |
> |---|---|
> | USDe (USDe) `0x4c9E...68B3` | `200` |
> | wUSDM (ERC1967Proxy) `0x57F5...7812` | `300` |
> | DAI (Dai) `0x6B17...1d0F` | `200` |
> | sUSDe (StakedUSDeV2) `0x9D39...3497` | `200` |
> | USDC (FiatTokenProxy) `0xA0b8...eB48` | `200` |
> | USDT (TetherToken) `0xdAC1...1ec7` | `200` |
> | USDS (ERC1967Proxy) `0xdC03...384F` | `200` |

> | Field | Value |
> |---|---|
> | Setter | `updateSlippage(address token, uint256 newSlippage)` |
> | Gated by | `ADMIN_ROLE` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`isEligibleAsCollateral`** *(per-asset)* 🔄 **ACTIVE** (8 changes)

> > ⚠️ This parameter has been changed **8 times** — monitor for unexpected modifications.

> | Asset | Current Value |
> |---|---|
> | USDe (USDe) `0x4c9E...68B3` | `True` |
> | wUSDM (ERC1967Proxy) `0x57F5...7812` | `False` |
> | DAI (Dai) `0x6B17...1d0F` | `True` |
> | sUSDe (StakedUSDeV2) `0x9D39...3497` | `True` |
> | USDC (FiatTokenProxy) `0xA0b8...eB48` | `False` |
> | USDT (TetherToken) `0xdAC1...1ec7` | `True` |
> | USDS (ERC1967Proxy) `0xdC03...384F` | `False` |

> | Field | Value |
> |---|---|
> | Setter | `updateCollateralEligibility(address token, bool newEligibility)` |
> | Gated by | `ADMIN_ROLE` |
> | Tags | — |
> | Last changed | 2026-03-03 |
> | Changed by | `0x6C15...7649` (EOA) |
> | Total changes | 8 🔄 |

> **Recent changes (showing last 5 of 8):**

> | # | Asset | Value | Set By | Date |
> |---|---|---|---|---|
> | 1 | USDS (ERC1967Proxy) | `—` | `0x6C15...7649` (EOA) | 2026-03-03 |
> | 2 | sUSDe (StakedUSDeV2) | `—` | `0x6C15...7649` (EOA) | 2025-07-28 |
> | 3 | USDe (USDe) | `—` | `0x6C15...7649` (EOA) | 2025-07-28 |
> | 4 | wUSDM (ERC1967Proxy) | `—` | `0x6C15...7649` (EOA) | 2025-01-31 |
> | 5 | Frax | `—` | `0x6C15...7649` (EOA) | 2025-01-22 |

> **`MAX_PERCENTAGE_FEE`** 🔒 **IMMUTABLE**

> > 🔒 **Immutable** — declared as a constant in the contract source; cannot be changed without a contract upgrade. Bounds the reachable extreme of any setter that writes a related storage variable.

> | Field | Value |
> |---|---|
> | Current Value | `2500` |
> | Mutability | 🔒 immutable (constant) |
> | Tags | `IMMUTABLE` |

> **`MAX_SLIPPAGE_TOLERANCE`** 🔒 **IMMUTABLE**

> > 🔒 **Immutable** — declared as a constant in the contract source; cannot be changed without a contract upgrade. Bounds the reachable extreme of any setter that writes a related storage variable.

> | Field | Value |
> |---|---|
> | Current Value | `3500` |
> | Mutability | 🔒 immutable (constant) |
> | Tags | `IMMUTABLE` |

> **`pauseToken`** *(per-asset)*

> | Field | Value |
> |---|---|
> | Setter | `pauseToken(address token)` |
> | Gated by | `PAUSER_ROLE` |
> | Tags | `PAUSE` |
> | Last called | 2026-03-25 |
> | Called by | `0x6C15...7649` (EOA) |
> | Total calls | 3 |

> **Recent changes:**

> | # | Asset | Value | Set By | Date |
> |---|---|---|---|---|
> | 1 | DAI (Dai) | `—` | `0x6C15...7649` (EOA) | 2026-03-25 |
> | 2 | USDS (ERC1967Proxy) | `—` | `0x6C15...7649` (EOA) | 2026-03-25 |
> | 3 | wUSDM (ERC1967Proxy) | `—` | `0x6C15...7649` (EOA) | 2025-06-18 |

> **`unpauseToken`** *(per-asset)* ❄️ **DORMANT**

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Setter | `unpauseToken(address token)` |
> | Gated by | `PAUSER_ROLE` |
> | Tags | `PAUSE` |
> | Last called | — |
> | Called by | — |
> | Total calls | 0 ❄️ |

> #### 💰 Supply Actions

> _Mint / redeem / burn call tracking — last 5 calls per function, total counts preserved._

> **`updateTokenOracle`** *(per-asset)*

> | Field | Value |
> |---|---|
> | Setter | `updateTokenOracle(address token, address priceOracle_)` |
> | Gated by | `ORACLE_MANAGER_ROLE` |
> | Tags | `SUPPLY` |
> | Last called | 2025-11-10 |
> | Called by | `0x6C15...7649` (EOA) |
> | Total calls | 1 |

> **Recent changes:**

> | # | Asset | Value | Set By | Date |
> |---|---|---|---|---|
> | 1 | sUSDe (StakedUSDeV2) | `—` | `0x6C15...7649` (EOA) | 2025-11-10 |

> #### 📋 Tracked Whitelists

> **Accepted Tokens** 
> Managed by: `ADMIN_ROLE` · via `addToken` / `removeToken`

> **Current members (7):**

> | # | Address |
> |---|---|
> | 1 | `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48` (USDC (FiatTokenProxy)) |
> | 2 | `0xdAC17F958D2ee523a2206206994597C13D831ec7` (USDT (TetherToken)) |
> | 3 | `0x6B175474E89094C44Da98b954EedeAC495271d0F` (DAI (Dai)) |
> | 4 | `0x57F5E098CaD7A3D1Eed53991D4d66C45C9AF7812` (wUSDM (ERC1967Proxy)) |
> | 5 | `0x4c9EDD5852cd905f086C759E8383e09bff1E68B3` (USDe (USDe)) |
> | 6 | `0x9D39A5DE30e57443BfF2A8307A4256c8797A3497` (sUSDe (StakedUSDeV2)) |
> | 7 | `0xdC035D45d973E3EC169d2276DDab16f1e407384F` (USDS (ERC1967Proxy)) |

> **Change history:**

> | Action | Address | Set By | Date |
> |---|---|---|---|
> | ➖ Removed | `0x853d...b99e` | `0x6C15...7649` | 2026-03-03 |
> | ➕ Added | `0xdC03...384F` (USDS (ERC1967Proxy)) | `0x6C15...7649` | 2026-03-03 |
> | ➕ Added | `0x9D39...3497` (sUSDe (StakedUSDeV2)) | `0x6C15...7649` | 2025-07-28 |
> | ➕ Added | `0x4c9E...68B3` (USDe (USDe)) | `0x6C15...7649` | 2025-07-28 |
> | ➕ Added | `0x57F5...7812` (wUSDM (ERC1967Proxy)) | `0x6C15...7649` | 2025-01-31 |
> | ➕ Added | `0x853d...b99e` | `0x6C15...7649` | 2025-01-22 |
> | ➕ Added | `0x6B17...1d0F` (DAI (Dai)) | `0x6C15...7649` | 2025-01-22 |
> | ➕ Added | `0xdAC1...1ec7` (USDT (TetherToken)) | `0x6C15...7649` | 2025-01-22 |
> | ➕ Added | `0xA0b8...eB48` (USDC (FiatTokenProxy)) | `0x6C15...7649` | 2025-01-21 |

---
<a id="c-0xd1d104a7515989ac82f1afda15a23650411b05b8"></a>
## > SharePriceCalculator `0xd1D104a7515989ac82F1AFDa15a23650411b05B8`

> > 💰 **Inherited supply authority** — holds `MINTER_ROLE` on **reUSD (ERC1967Proxy) [ShareToken]**, `sharePriceCalculator()` on **InsuranceCapitalLayer**. Access controls on this contract gate root token supply.

> 🔒 **Immutable References:** `depositTokenRegistry()` → DepositTokenRegistry

### > 🟢 `DEFAULT_ADMIN_ROLE`

> **Hash:** `0x0000000000000000000000000000000000000000000000000000000000000000`  
> **Managed by:** `DEFAULT_ADMIN_ROLE`  

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x8eec10616802Ef639CA55c98ac856553fAdEfBaD` | Gnosis Safe 3/5 | 🟢 LOW | 2026-05-08 | Events only · hasRole ✓ | 3/5 signers |

> **🕘 Previous Holders (1)** _(verified inactive — `hasRole`/`is` returned false)_:

> | Address | Name / Type | Granted | Status |
> |---|---|---|---|
> | `0x6C15B25E9750Dccb698C1a4023f34015bFe57649` | EOA | 2025-01-21 | 🕘 HISTORICAL |

> **Signers of `Gnosis Safe 3/5` (0x8eec...fBaD):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x2a3Ef2FEd07D025b8B1f07d99C77471D11529db9` | EOA | — | EOA |
> | `0x28d8af3CF7286Bdc34ae80cb90093dFA4dbb0020` | EOA | — | EOA |
> | `0x7dd97C12abd41c53B4f2B3df6b872753F9DABCaa` | EOA | — | EOA |
> | `0x1F76cC0eF4605f57478f3044e703AF6B0C57A297` | EOA | — | EOA |
> | `0x0AE4eeAFfDA174F84c84c22f03a28F3AAB02FbDC` | EOA (EIP-7702 → `0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B`) | — | EOA |

### > 🟠 `PRICE_SETTER_ROLE`

> **Hash:** `0x04824fcb60e7cc526d70b264caa65b62ed44d9c8e5d230e8ff6b0c7373843b8a`  
> **Managed by:** `DEFAULT_ADMIN_ROLE`  
> **Privileged write functions:**  
> **Capabilities:** 💰 **SUPPLY**
> - `setSharePrice(uint256 newPrice)` — Updates the global share price Only callable by addresses with PRICE_SETTER_ROLE Emits SharePriceSet event `[SUPPLY]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x84d4eaeb10f9E57b67622f667C6c13E22fA4b2B6` | NAVConsumer | 🟠 HIGH | 2025-05-26 | Events only · hasRole ✓ |  |

> **🕘 Previous Holders (1)** _(verified inactive — `hasRole`/`is` returned false)_:

> | Address | Name / Type | Granted | Status |
> |---|---|---|---|
> | `0x6C15B25E9750Dccb698C1a4023f34015bFe57649` | EOA | 2025-01-21 | 🕘 HISTORICAL |

> #### 🔧 Permissioned Parameters

> **`getSharePrice`** 🔄 **ACTIVE** (421 changes)

> > ⚠️ This parameter has been changed **421 times** — monitor for unexpected modifications.

> | Field | Value |
> |---|---|
> | Current Value | `1086893160111686144 (1.086893e18)` |
> | Setter | `setSharePrice(uint256 newPrice)` |
> | Gated by | `PRICE_SETTER_ROLE` |
> | Tags | `SUPPLY` |
> | Last changed | 2026-07-02 |
> | Changed by | `0xeA47...6852` |
> | Total changes | 421 🔄 |

> **Recent changes (showing last 5 of 421):**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `1086711082737661952 (1.086711e18)` | `0xeA47...6852` | 2026-07-02 |
> | 2 | `1086529035865412480 (1.086529e18)` | `0xeA47...6852` | 2026-07-01 |
> | 3 | `1086347019489827840 (1.086347e18)` | `0x9427...865D` | 2026-06-30 |
> | 4 | `1086168300279594112 (1.086168e18)` | `0xeA47...6852` | 2026-06-29 |
> | 5 | `1085989610471158912 (1.085990e18)` | `0x723d...8a69` | 2026-06-28 |

---
<a id="c-0x82f1806aeab5ecb9a485eb041d5ed4940b123995"></a>
## > KYCRegistry `0x82F1806AEab5Ecb9a485eb041d5Ed4940b123995`

> > 💰 **Inherited supply authority** — holds `MINTER_ROLE` on **reUSD (ERC1967Proxy) [ShareToken]**, `kyc()` on **InstantRedemption**. Access controls on this contract gate root token supply.

### > 🟢 `DEFAULT_ADMIN_ROLE`

> **Hash:** `0x0000000000000000000000000000000000000000000000000000000000000000`  
> **Managed by:** `DEFAULT_ADMIN_ROLE`  

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x8eec10616802Ef639CA55c98ac856553fAdEfBaD` | Gnosis Safe 3/5 | 🟢 LOW | 2026-03-18 | Events only · hasRole ✓ | 3/5 signers |

> **🕘 Previous Holders (1)** _(verified inactive — `hasRole`/`is` returned false)_:

> | Address | Name / Type | Granted | Status |
> |---|---|---|---|
> | `0x6C15B25E9750Dccb698C1a4023f34015bFe57649` | EOA | 2025-01-21 | 🕘 HISTORICAL |

> **Signers of `Gnosis Safe 3/5` (0x8eec...fBaD):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x2a3Ef2FEd07D025b8B1f07d99C77471D11529db9` | EOA | — | EOA |
> | `0x28d8af3CF7286Bdc34ae80cb90093dFA4dbb0020` | EOA | — | EOA |
> | `0x7dd97C12abd41c53B4f2B3df6b872753F9DABCaa` | EOA | — | EOA |
> | `0x1F76cC0eF4605f57478f3044e703AF6B0C57A297` | EOA | — | EOA |
> | `0x0AE4eeAFfDA174F84c84c22f03a28F3AAB02FbDC` | EOA (EIP-7702 → `0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B`) | — | EOA |

### > 🟠 `KYC_ADMIN_ROLE` 🔄 5 changes

> **Hash:** `0x811427a0fa4932aef534bba16bc34e9b7b2d7d2a79c475fca1765f6cc1faebea`  
> **Managed by:** `DEFAULT_ADMIN_ROLE`  
> **Privileged write functions:**
> - `addKYCProvider(address provider)` — Adds a new KYC provider Only callable by addresses with KYC_ADMIN_ROLE
> - `removeKYCProvider(address provider)` — Removes a KYC provider Only callable by addresses with KYC_ADMIN_ROLE

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x3f0DA1C363e34802C6f12F9C27276dC0e6696FD8` | AccessManager | 🟠 HIGH | 2026-05-13 | Events only · hasRole ✓ |  |

> **🕘 Previous Holders (2)** _(verified inactive — `hasRole`/`is` returned false)_:

> | Address | Name / Type | Granted | Status |
> |---|---|---|---|
> | `0x8eec10616802Ef639CA55c98ac856553fAdEfBaD` | Gnosis Safe 3/5 | 2026-03-18 | 🕘 HISTORICAL |
> | `0x6C15B25E9750Dccb698C1a4023f34015bFe57649` | EOA | 2025-01-21 | 🕘 HISTORICAL |

### > 🔴 `KYC_PROVIDER_ROLE`

> **Hash:** `0x6c4079fcac94e7142d8c209744c998efe53a188aadb7e55958f7ad3ea8a1d652`  
> **Managed by:** `KYC_ADMIN_ROLE`  
> **Privileged write functions:**
> - `approveKYC(address user)` — Approves KYC status for a user Only callable by addresses with KYC_PROVIDER_ROLE
> - `revokeKYC(address user)` — Revokes KYC status for a user Only callable by addresses with KYC_PROVIDER_ROLE

> **Members (3):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x67dD3914A3c8FD627824153773117276a5E4f3A5` | EOA | 🔴 CRITICAL | 2026-03-18 | Events only · hasRole ✓ | ⚠️ Single private key |
> | `0x97DD4581799796991E7479E178405506652f8Db6` | EOA | 🔴 CRITICAL | 2025-01-22 | Events only · hasRole ✓ | ⚠️ Single private key |
> | `0xDD18De3820187F728598C5786574865aF260d4C3` | EOA | 🔴 CRITICAL | 2026-06-19 🆕 | Events only · hasRole ✓ | ⚠️ Single private key |

---
<a id="c-0xf788624278dc0d5b4e494f834932e6938aa2bdc3"></a>
## > PayoutTokenRegistry `0xf788624278Dc0D5b4e494F834932e6938AA2Bdc3`

> > 🛡️ **Managed by AccessManager** — restricted functions are gated by [AccessManager](#c-0x3f0da1c363e34802c6f12f9c27276dc0e6696fd8) `0x3f0DA1C363e34802C6f12F9C27276dC0e6696FD8`. Each `restricted()` function is attributed to its AM role below; the role's members (verified via `hasRole`) are the actual authorities. Note: ADMIN_ROLE on the AccessManager can re-grant any role, so the meta-admin chain is the upper bound on single-key reachability.

> > 💰 **Inherited supply authority** — holds `MINTER_ROLE` on **reUSD (ERC1967Proxy) [ShareToken]**, `payoutTokenRegistry()` on **InstantRedemption**. Access controls on this contract gate root token supply.

> 🔒 **Immutable References:** `activePayoutToken()` → sUSDe (StakedUSDeV2)

### > 🔴 `AM Operator (role 11723228863651074278; gates 9 fn(s) across 3 target(s)) [via AM 0x3f0D...6FD8]`

> **Hash:** `am_role_11723228863651074278@0x3f0da1c363e34802c6f12f9c27276dc0e6696fd8`  
> **Privileged write functions:**
> - `setTokenConfig(address,bool,bool)`
> - `emergencySwitch(address)`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xEE16bE0374f2eFb34218affC1a8EbEe9310c47f8` | EOA | 🔴 CRITICAL | — | Storage only | ⚠️ Single private key |

### > 🟠 `authority()`


> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x3f0DA1C363e34802C6f12F9C27276dC0e6696FD8` | AccessManager | 🟠 HIGH | — | Storage+Events |  |

### > 🟠 `token()`


> **Members (2):**

> | Address | Name / Type | Granted | Source | Details |
> |---|---|---|---|---|
> | `0x12b004719fb632f1E7c010c6F5D6009Fb4258442` | liUSD-1w (LockedPositionToken) | — | Events only |  |
> | `0x9D39A5DE30e57443BfF2A8307A4256c8797A3497` | sUSDe (StakedUSDeV2) | — | Events only |  |

> #### 🔧 Permissioned Parameters

> **`MAX_VALUE_TOKENS`** 🔒 **IMMUTABLE**

> > 🔒 **Immutable** — declared as a constant in the contract source; cannot be changed without a contract upgrade. Bounds the reachable extreme of any setter that writes a related storage variable.

> | Field | Value |
> |---|---|
> | Current Value | `20` |
> | Mutability | 🔒 immutable (constant) |
> | Tags | `IMMUTABLE` |

> **`tokenConfigs`** *(per-asset)* 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> | Asset | Current Value |
> |---|---|
> | liUSD-1w (LockedPositionToken) `0x12b0...8442` | `inValueSet=True · payoutEligible=False` |
> | sUSDe (StakedUSDeV2) `0x9D39...3497` | `inValueSet=True · payoutEligible=True` |

> | Field | Value |
> |---|---|
> | Setter | `setTokenConfig(address,bool,bool)` |
> | Gated by | `AM Operator (role 11723228863651074278; gates 9 fn(s) across 3 target(s)) [via AM 0x3f0D...6FD8]` |
> | Tags | — |
> | Last changed | 2025-09-30 |
> | Changed by | `0xEE16...47f8` (EOA) |
> | Total changes | 2 |

> **Recent changes:**

> | # | Asset | Value | Set By | Date |
> |---|---|---|---|---|
> | 1 | liUSD-1w (LockedPositionToken) | `inValueSet=True · payoutEligible=False` | `0xEE16...47f8` (EOA) | 2025-09-30 |
> | 2 | sUSDe (StakedUSDeV2) | `inValueSet=True · payoutEligible=True` | `0xEE16...47f8` (EOA) | 2025-09-30 |

---
<a id="c-0x8aeb9453ef22cb38abc7a3af9c208f65c1bfe31e"></a>
## > RedemptionGateway `0x8aEb9453EF22Cb38abC7a3Af9c208F65C1BfE31e`

> > 🛡️ **Managed by AccessManager** — restricted functions are gated by [AccessManager](#c-0x3f0da1c363e34802c6f12f9c27276dc0e6696fd8) `0x3f0DA1C363e34802C6f12F9C27276dC0e6696FD8`. Each `restricted()` function is attributed to its AM role below; the role's members (verified via `hasRole`) are the actual authorities. Note: ADMIN_ROLE on the AccessManager can re-grant any role, so the meta-admin chain is the upper bound on single-key reachability.

> > 💰 **Inherited supply authority** — holds `MINTER_ROLE` on **reUSD (ERC1967Proxy) [ShareToken]**, `AM Operator (role 3678572998923334730; gates 1 fn(s) across 1 target(s)) [via AM 0x3f0D...6FD8]` on **InstantRedemption**. Access controls on this contract gate root token supply.

> 🔒 **Immutable References:** `windowRedemption()` → WindowRedemption, `kyc()` → KYCRegistry, `instantRedemption()` → InstantRedemption

### > 🟠 `authority()`


> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x3f0DA1C363e34802C6f12F9C27276dC0e6696FD8` | AccessManager | 🟠 HIGH | — | Storage+Events |  |

---
<a id="c-0x2eafa5bd2c477e21c8edd4c9781a2fa54c623900"></a>
## > ReProtocolStaking `0x2EAFA5bD2c477e21C8Edd4C9781A2FA54C623900`

> > 🛡️ **Managed by AccessManager** — restricted functions are gated by [AccessManager](#c-0x3f0da1c363e34802c6f12f9c27276dc0e6696fd8) `0x3f0DA1C363e34802C6f12F9C27276dC0e6696FD8`. Each `restricted()` function is attributed to its AM role below; the role's members (verified via `hasRole`) are the actual authorities. Note: ADMIN_ROLE on the AccessManager can re-grant any role, so the meta-admin chain is the upper bound on single-key reachability.

> > ⚠️ **Upgradeable** (UUPS) — impl: `0xB87097eaDbFaE94D7a3002AF7999a8FFdF13C3ac`

> **Proxy History (1 event):**

> | # | Date | Event | Address | Key Changes | Tx |
> |---|---|---|---|---|---|
> | 1 | 2026-06-12 | Upgrade | `0xB870...C3ac` | Initial deployment | [0x72c311a78ae2c2a723196904e91f522ea12d42a8e436149f8102d1232a4e9017](https://etherscan.io/tx/0x72c311a78ae2c2a723196904e91f522ea12d42a8e436149f8102d1232a4e9017) |

> > 💰 **Inherited supply authority** — holds `MINTER_ROLE` on **reUSD (ERC1967Proxy) [ShareToken]**, `OPERATOR_ROLE` on **InsuranceCapitalLayer**. Access controls on this contract gate root token supply.

### > 🔴 `upgradeability (UUPS)`

> > ⚠️ **CRITICAL** — Upgradeability allows arbitrary code replacement. Must be behind both a Multisig AND a Timelock.

> **Privileged write functions:**  
> **Capabilities:** ⬆️ **UPGRADE**
> - `upgradeTo(address)` — Upgrade proxy implementation to a new address `[UPGRADE]`
> - `upgradeToAndCall(address,bytes)` — Upgrade proxy implementation and call an initializer `[UPGRADE]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | ⚠️ UNKNOWN | — | 🔴 CRITICAL | — | — | Upgrade controller unresolved |

### > 🟢 `AM Operator (role 595895589036249767; gates 2 fn(s) across 2 target(s)) [via AM 0x3f0D...6FD8]`

> **Hash:** `am_role_595895589036249767@0x3f0da1c363e34802c6f12f9c27276dc0e6696fd8`  
> **Privileged write functions:**  
> **Capabilities:** ⬆️ **UPGRADE**
> - `upgradeToAndCall(address,bytes)` `[UPGRADE]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x8eec10616802Ef639CA55c98ac856553fAdEfBaD` | Gnosis Safe 3/5 | 🟢 LOW | — | Storage only | 3/5 signers |

> **Signers of `Gnosis Safe 3/5` (0x8eec...fBaD):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x2a3Ef2FEd07D025b8B1f07d99C77471D11529db9` | EOA | — | EOA |
> | `0x28d8af3CF7286Bdc34ae80cb90093dFA4dbb0020` | EOA | — | EOA |
> | `0x7dd97C12abd41c53B4f2B3df6b872753F9DABCaa` | EOA | — | EOA |
> | `0x1F76cC0eF4605f57478f3044e703AF6B0C57A297` | EOA | — | EOA |
> | `0x0AE4eeAFfDA174F84c84c22f03a28F3AAB02FbDC` | EOA (EIP-7702 → `0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B`) | — | EOA |

### > 🟠 `kycRegistry()`

> **Privileged write functions:**  
> **Capabilities:** 💰 **SUPPLY**
> - `initialize(InitParams memory params)` — Initializes the staking module.
> - `stake(uint256 stakeAmount)` — Stakes RE into a pending tranche. `[SUPPLY]`
> - `stakeWithPermit(uint256 stakeAmount, uint256 deadline, uint8 v, bytes32 r, bytes32 s)` — Stakes RE using an ERC-2612 permit approval when allowance is insufficient. `[SUPPLY]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x82F1806AEab5Ecb9a485eb041d5Ed4940b123995` | KYCRegistry | 🟠 HIGH | — | Storage only |  |

### > 🟠 `stakeToken()`

> **Privileged write functions:**  
> **Capabilities:** 💰 **SUPPLY**
> - `initialize(InitParams memory params)` — Initializes the staking module.
> - `stake(uint256 stakeAmount)` — Stakes RE into a pending tranche. `[SUPPLY]`
> - `stakeWithPermit(uint256 stakeAmount, uint256 deadline, uint8 v, bytes32 r, bytes32 s)` — Stakes RE using an ERC-2612 permit approval when allowance is insufficient. `[SUPPLY]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x526526528F35AC738177003b8773B402B8Df8143` | RE (ERC1967Proxy) | 🟠 HIGH | — | Storage only |  |

### > 🔴 `AM Operator (role 13697439394725303084; gates 1 fn(s) across 1 target(s)) [via AM 0x3f0D...6FD8]`

> **Hash:** `am_role_13697439394725303084@0x3f0da1c363e34802c6f12f9c27276dc0e6696fd8`  
> **Privileged write functions:**  
> **Capabilities:** ⏸️ **PAUSE**
> - `pause()` — Pause contract operations — may disable transfers, minting, or other functions `[PAUSE]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x07e5faC51aD770e23F5399d51070647E16e75F4F` | EOA | 🔴 CRITICAL | — | Storage only | ⚠️ Single private key |

### > 🟢 `AM Operator (role 211310302505071350; gates 1 fn(s) across 1 target(s)) [via AM 0x3f0D...6FD8]`

> **Hash:** `am_role_211310302505071350@0x3f0da1c363e34802c6f12f9c27276dc0e6696fd8`  
> **Privileged write functions:**  
> **Capabilities:** ⏸️ **PAUSE**
> - `unpause()` — Resume contract operations after a pause `[PAUSE]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x8eec10616802Ef639CA55c98ac856553fAdEfBaD` | Gnosis Safe 3/5 | 🟢 LOW | — | Storage only | 3/5 signers |

> **Signers of `Gnosis Safe 3/5` (0x8eec...fBaD):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x2a3Ef2FEd07D025b8B1f07d99C77471D11529db9` | EOA | — | EOA |
> | `0x28d8af3CF7286Bdc34ae80cb90093dFA4dbb0020` | EOA | — | EOA |
> | `0x7dd97C12abd41c53B4f2B3df6b872753F9DABCaa` | EOA | — | EOA |
> | `0x1F76cC0eF4605f57478f3044e703AF6B0C57A297` | EOA | — | EOA |
> | `0x0AE4eeAFfDA174F84c84c22f03a28F3AAB02FbDC` | EOA (EIP-7702 → `0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B`) | — | EOA |

### > 🔴 `AM Operator (role 13027108596976310255; gates 1 fn(s) across 1 target(s)) [via AM 0x3f0D...6FD8]`

> **Hash:** `am_role_13027108596976310255@0x3f0da1c363e34802c6f12f9c27276dc0e6696fd8`  
> **Privileged write functions:**
> - `syncBatch(address[])`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xf31d8E94928147cCb30C698ddD81C6791861C4a9` | EOA | 🔴 CRITICAL | — | Storage only | ⚠️ Single private key |

### > 🟢 `AM Operator (role 15105228643940298600; gates 2 fn(s) across 2 target(s)) [via AM 0x3f0D...6FD8]`

> **Hash:** `am_role_15105228643940298600@0x3f0da1c363e34802c6f12f9c27276dc0e6696fd8`  
> **Privileged write functions:**
> - `setAuthority(address)`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x8eec10616802Ef639CA55c98ac856553fAdEfBaD` | Gnosis Safe 3/5 | 🟢 LOW | — | Storage only | 3/5 signers |

> **Signers of `Gnosis Safe 3/5` (0x8eec...fBaD):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x2a3Ef2FEd07D025b8B1f07d99C77471D11529db9` | EOA | — | EOA |
> | `0x28d8af3CF7286Bdc34ae80cb90093dFA4dbb0020` | EOA | — | EOA |
> | `0x7dd97C12abd41c53B4f2B3df6b872753F9DABCaa` | EOA | — | EOA |
> | `0x1F76cC0eF4605f57478f3044e703AF6B0C57A297` | EOA | — | EOA |
> | `0x0AE4eeAFfDA174F84c84c22f03a28F3AAB02FbDC` | EOA (EIP-7702 → `0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B`) | — | EOA |

### > 🟢 `AM Operator (role 1696015379001973530; gates 1 fn(s) across 1 target(s)) [via AM 0x3f0D...6FD8]`

> **Hash:** `am_role_1696015379001973530@0x3f0da1c363e34802c6f12f9c27276dc0e6696fd8`  
> **Privileged write functions:**
> - `setKYCRegistry(address)`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x8eec10616802Ef639CA55c98ac856553fAdEfBaD` | Gnosis Safe 3/5 | 🟢 LOW | — | Storage only | 3/5 signers |

> **Signers of `Gnosis Safe 3/5` (0x8eec...fBaD):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x2a3Ef2FEd07D025b8B1f07d99C77471D11529db9` | EOA | — | EOA |
> | `0x28d8af3CF7286Bdc34ae80cb90093dFA4dbb0020` | EOA | — | EOA |
> | `0x7dd97C12abd41c53B4f2B3df6b872753F9DABCaa` | EOA | — | EOA |
> | `0x1F76cC0eF4605f57478f3044e703AF6B0C57A297` | EOA | — | EOA |
> | `0x0AE4eeAFfDA174F84c84c22f03a28F3AAB02FbDC` | EOA (EIP-7702 → `0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B`) | — | EOA |

### > 🟢 `AM Operator (role 2386126226847563591; gates 1 fn(s) across 1 target(s)) [via AM 0x3f0D...6FD8]`

> **Hash:** `am_role_2386126226847563591@0x3f0da1c363e34802c6f12f9c27276dc0e6696fd8`  
> **Privileged write functions:**
> - `rescueToken(address,uint256,address)`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x8eec10616802Ef639CA55c98ac856553fAdEfBaD` | Gnosis Safe 3/5 | 🟢 LOW | — | Storage only | 3/5 signers |

> **Signers of `Gnosis Safe 3/5` (0x8eec...fBaD):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x2a3Ef2FEd07D025b8B1f07d99C77471D11529db9` | EOA | — | EOA |
> | `0x28d8af3CF7286Bdc34ae80cb90093dFA4dbb0020` | EOA | — | EOA |
> | `0x7dd97C12abd41c53B4f2B3df6b872753F9DABCaa` | EOA | — | EOA |
> | `0x1F76cC0eF4605f57478f3044e703AF6B0C57A297` | EOA | — | EOA |
> | `0x0AE4eeAFfDA174F84c84c22f03a28F3AAB02FbDC` | EOA (EIP-7702 → `0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B`) | — | EOA |

### > 🟢 `AM Operator (role 8001233221072730583; gates 3 fn(s) across 1 target(s)) [via AM 0x3f0D...6FD8]`

> **Hash:** `am_role_8001233221072730583@0x3f0da1c363e34802c6f12f9c27276dc0e6696fd8`  
> **Privileged write functions:**
> - `setMinimumStake(uint256)`
> - `setMaxActiveTranchesPerUser(uint16)`
> - `setMaxSyncBatchSize(uint16)`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x8eec10616802Ef639CA55c98ac856553fAdEfBaD` | Gnosis Safe 3/5 | 🟢 LOW | — | Storage only | 3/5 signers |

> **Signers of `Gnosis Safe 3/5` (0x8eec...fBaD):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x2a3Ef2FEd07D025b8B1f07d99C77471D11529db9` | EOA | — | EOA |
> | `0x28d8af3CF7286Bdc34ae80cb90093dFA4dbb0020` | EOA | — | EOA |
> | `0x7dd97C12abd41c53B4f2B3df6b872753F9DABCaa` | EOA | — | EOA |
> | `0x1F76cC0eF4605f57478f3044e703AF6B0C57A297` | EOA | — | EOA |
> | `0x0AE4eeAFfDA174F84c84c22f03a28F3AAB02FbDC` | EOA (EIP-7702 → `0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B`) | — | EOA |

### > 🟠 `stakedRe()`

> **Privileged write functions:**
> - `initialize(InitParams memory params)` — Initializes the staking module.

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xaD6d3923a78393d1E47321e276Da3627a51F8431` | sRE (ERC1967Proxy) | 🟠 HIGH | — | Storage only |  |

### > 🟠 `authority()`


> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x3f0DA1C363e34802C6f12F9C27276dC0e6696FD8` | AccessManager | 🟠 HIGH | — | Storage+Events |  |

> #### 🔧 Permissioned Parameters

> **`authority`**

> | Field | Value |
> |---|---|
> | Current Value | `0x3f0DA1C363e34802C6f12F9C27276dC0e6696FD8` |
> | Setter | `setAuthority(address)` |
> | Gated by | `AM Operator (role 15105228643940298600; gates 2 fn(s) across 2 target(s)) [via AM 0x3f0D...6FD8]` |
> | Tags | — |
> | Last changed | 2026-06-12 |
> | Changed by | `0x0AE4...FbDC` (EOA (EIP-7702 → 0x63c0c19a…)) |
> | Total changes | 1 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `0x3f0DA1C363e34802C6f12F9C27276dC0e6696FD8` | `0x0AE4...FbDC` (EOA (EIP-7702 → 0x63c0c19a…)) | 2026-06-12 |

> **`HARD_MAX_ACTIVE_TRANCHES`** 🔒 **IMMUTABLE**

> > 🔒 **Immutable** — declared as a constant in the contract source; cannot be changed without a contract upgrade. Bounds the reachable extreme of any setter that writes a related storage variable.

> | Field | Value |
> |---|---|
> | Current Value | `256` |
> | Mutability | 🔒 immutable (constant) |
> | Tags | `IMMUTABLE` |

> **`HARD_MAX_SYNC_BATCH_SIZE`** 🔒 **IMMUTABLE**

> > 🔒 **Immutable** — declared as a constant in the contract source; cannot be changed without a contract upgrade. Bounds the reachable extreme of any setter that writes a related storage variable.

> | Field | Value |
> |---|---|
> | Current Value | `50` |
> | Mutability | 🔒 immutable (constant) |
> | Tags | `IMMUTABLE` |

> **`maxActiveTranchesPerUser`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)*

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `128` |
> | Setter | `setMaxActiveTranchesPerUser(uint16)` |
> | Gated by | `AM Operator (role 8001233221072730583; gates 3 fn(s) across 1 target(s)) [via AM 0x3f0D...6FD8]` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`maxSyncBatchSize`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)*

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `25` |
> | Setter | `setMaxSyncBatchSize(uint16)` |
> | Gated by | `AM Operator (role 8001233221072730583; gates 3 fn(s) across 1 target(s)) [via AM 0x3f0D...6FD8]` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`minimumStake`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)*

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `1000000000000000000 (1.000000e18)` |
> | Setter | `setMinimumStake(uint256)` |
> | Gated by | `AM Operator (role 8001233221072730583; gates 3 fn(s) across 1 target(s)) [via AM 0x3f0D...6FD8]` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`pause`** ❄️ **DORMANT**

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Setter | `pause()` |
> | Gated by | `AM Operator (role 13697439394725303084; gates 1 fn(s) across 1 target(s)) [via AM 0x3f0D...6FD8]` |
> | Tags | `PAUSE` |
> | Last called | — |
> | Called by | — |
> | Total calls | 0 ❄️ |

> **`unpause`** ❄️ **DORMANT**

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Setter | `unpause()` |
> | Gated by | `AM Operator (role 211310302505071350; gates 1 fn(s) across 1 target(s)) [via AM 0x3f0D...6FD8]` |
> | Tags | `PAUSE` |
> | Last called | — |
> | Called by | — |
> | Total calls | 0 ❄️ |

> #### 💰 Supply Actions

> _Mint / redeem / burn call tracking — last 5 calls per function, total counts preserved._

> **`stake`** 🔄 **ACTIVE** (34 changes)

> > ⚠️ This parameter has been changed **34 times** — monitor for unexpected modifications.

> | Field | Value |
> |---|---|
> | Setter | `stake(uint256 stakeAmount)` |
> | Gated by | `kycRegistry(), stakeToken()` |
> | Tags | `SUPPLY` |
> | Last called | 2026-07-01 |
> | Called by | `0x9Fc7...3485` |
> | Total calls | 34 🔄 |

> **Recent changes (showing last 5 of 34):**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `1000000000000000000000 (1,000.000000e18)` | `0x9Fc7...3485` | 2026-07-01 |
> | 2 | `2905246178000000000 (2.905246e18)` | `0xD3a5...BA3E` | 2026-06-25 |
> | 3 | `36294244600000000000 (36.294245e18)` | `0x040C...bb2d` | 2026-06-24 |
> | 4 | `7575412091000000000 (7.575412e18)` | `0x8E61...4F2c` | 2026-06-22 |
> | 5 | `3431229746000000000 (3.431230e18)` | `0xA31E...FE2f` | 2026-06-22 |

> **`stakeWithPermit`** ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Setter | `stakeWithPermit(uint256 stakeAmount, uint256 deadline, uint8 v, bytes32 r, bytes32 s)` |
> | Gated by | `kycRegistry(), stakeToken()` |
> | Tags | `SUPPLY` |
> | Last called | — |
> | Called by | — |
> | Total calls | 0 ❄️ |

---
<a id="c-0x84d4eaeb10f9e57b67622f667c6c13e22fa4b2b6"></a>
## > NAVConsumer `0x84d4eaeb10f9E57b67622f667C6c13E22fA4b2B6`

> > 💰 **Inherited supply authority** — holds `MINTER_ROLE` on **reUSD (ERC1967Proxy) [ShareToken]**, `sharePriceCalculator()` on **InsuranceCapitalLayer**, `PRICE_SETTER_ROLE` on **SharePriceCalculator**. Access controls on this contract gate root token supply.

> 🔒 **Immutable References:** `navReceiver()` → SharePriceCalculator

### > 🟢 `DEFAULT_ADMIN_ROLE`

> **Hash:** `0x0000000000000000000000000000000000000000000000000000000000000000`  
> **Managed by:** `DEFAULT_ADMIN_ROLE`  

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x8eec10616802Ef639CA55c98ac856553fAdEfBaD` | Gnosis Safe 3/5 | 🟢 LOW | 2026-05-08 | Events only · hasRole ✓ | 3/5 signers |

> **🕘 Previous Holders (1)** _(verified inactive — `hasRole`/`is` returned false)_:

> | Address | Name / Type | Granted | Status |
> |---|---|---|---|
> | `0x6C15B25E9750Dccb698C1a4023f34015bFe57649` | EOA | 2025-05-26 | 🕘 HISTORICAL |

> **Signers of `Gnosis Safe 3/5` (0x8eec...fBaD):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x2a3Ef2FEd07D025b8B1f07d99C77471D11529db9` | EOA | — | EOA |
> | `0x28d8af3CF7286Bdc34ae80cb90093dFA4dbb0020` | EOA | — | EOA |
> | `0x7dd97C12abd41c53B4f2B3df6b872753F9DABCaa` | EOA | — | EOA |
> | `0x1F76cC0eF4605f57478f3044e703AF6B0C57A297` | EOA | — | EOA |
> | `0x0AE4eeAFfDA174F84c84c22f03a28F3AAB02FbDC` | EOA (EIP-7702 → `0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B`) | — | EOA |

### > 🟢 `EMERGENCY_UPDATER_ROLE`

> **Hash:** `0x9d1945eeb09f3a9323e5f22a567caed248092672554a0b04901240709fb13476`  
> **Managed by:** `DEFAULT_ADMIN_ROLE`  
> **Privileged write functions:**  
> **Capabilities:** 💰 **SUPPLY**
> - `forceNAVUpdate(uint256 _navValue, string calldata _reason)` — Force update the NAV value, bypassing the Chainlink Functions request Only callable by emergency updater role, subject to time restrictions `[SUPPLY]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x8eec10616802Ef639CA55c98ac856553fAdEfBaD` | Gnosis Safe 3/5 | 🟢 LOW | 2026-05-13 | Events only · hasRole ✓ | 3/5 signers |

> **🕘 Previous Holders (1)** _(verified inactive — `hasRole`/`is` returned false)_:

> | Address | Name / Type | Granted | Status |
> |---|---|---|---|
> | `0x6C15B25E9750Dccb698C1a4023f34015bFe57649` | EOA | 2025-05-26 | 🕘 HISTORICAL |

> **Signers of `Gnosis Safe 3/5` (0x8eec...fBaD):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x2a3Ef2FEd07D025b8B1f07d99C77471D11529db9` | EOA | — | EOA |
> | `0x28d8af3CF7286Bdc34ae80cb90093dFA4dbb0020` | EOA | — | EOA |
> | `0x7dd97C12abd41c53B4f2B3df6b872753F9DABCaa` | EOA | — | EOA |
> | `0x1F76cC0eF4605f57478f3044e703AF6B0C57A297` | EOA | — | EOA |
> | `0x0AE4eeAFfDA174F84c84c22f03a28F3AAB02FbDC` | EOA (EIP-7702 → `0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B`) | — | EOA |

### > 🟠 `ADMIN_ROLE` 🔄 5 changes

> **Hash:** `0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775`  
> **Managed by:** `DEFAULT_ADMIN_ROLE`  
> **Privileged write functions:**  
> **Capabilities:** ⏸️ **PAUSE**
> - `setAutomationEnabled(bool enabled)` — Enable or disable the automation feature Only callable by admin role
> - `configure(uint64 _subscriptionId, bytes32 _donId, string calldata _source, bytes calldata _encryptedSecretsReference)` — Configure the Chainlink Functions parameters Only callable by admin role
> - `setCallbackGasLimit(uint32 _callbackGasLimit)` — Set the gas limit for the Chainlink Functions callback Only callable by admin role
> - `requestNAV()` — Request a NAV update from Chainlink Functions Only callable by admin or updater roles
> - `setNAVReceiver(address _navReceiver)` — Set the address of the NAV receiver contract Only callable by admin role, cannot be zero address
> - `setMaxDeviation(uint256 _maxDeviationBps)` — Set the maximum allowed deviation for NAV updates in basis points Only callable by admin role, cannot be set to zero
> - `setDeviationCheckEnabled(bool _enabled)` — Enable or disable the deviation check feature Only callable by admin role
> - `setAutomationTimeParameters(uint256 _targetHour, uint256 _targetMinute, uint256 _timeWindow)` — Update automation scheduling parameters Only callable by admin role, includes validation of parameters
> - `pause()` — Puts the system into an emergency stopped state. Only callable by owner `[PAUSE]`
> - `unpause()` — Takes the system out of an emergency stopped state. Only callable by owner `[PAUSE]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x3f0DA1C363e34802C6f12F9C27276dC0e6696FD8` | AccessManager | 🟠 HIGH | 2026-05-13 | Events only · hasRole ✓ |  |

> **🕘 Previous Holders (2)** _(verified inactive — `hasRole`/`is` returned false)_:

> | Address | Name / Type | Granted | Status |
> |---|---|---|---|
> | `0x8eec10616802Ef639CA55c98ac856553fAdEfBaD` | Gnosis Safe 3/5 | 2026-05-13 | 🕘 HISTORICAL |
> | `0x6C15B25E9750Dccb698C1a4023f34015bFe57649` | EOA | 2025-05-26 | 🕘 HISTORICAL |

### > 🔴 `KEEPER_ROLE`

> **Hash:** `0xfc8737ab85eb45125971625a9ebdb75cc78e01d5c1fa80c4c6e5203f47bc4fab`  
> **Managed by:** `DEFAULT_ADMIN_ROLE`  
> **Privileged write functions:**
> - `performUpkeep(bytes calldata)` — method that is actually executed by the keepers, via the registry. The data returned by the checkUpkeep simulation will be passed into

> **Members (2):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x3B018eA1105C5b2E14Df25e029a1C090cE54FC5b` | EOA | 🔴 CRITICAL | 2026-05-16 | Events only · hasRole ✓ | ⚠️ Single private key |
> | `0x6C15B25E9750Dccb698C1a4023f34015bFe57649` | EOA | 🔴 CRITICAL | 2025-05-26 | Events only · hasRole ✓ | ⚠️ Single private key |

### > 🔴 `UPDATER_ROLE`

> **Hash:** `0x73e573f9566d61418a34d5de3ff49360f9c51fec37f7486551670290f6285dab`  
> **Managed by:** `DEFAULT_ADMIN_ROLE`  
> **Privileged write functions:**
> - `requestNAV()` — Request a NAV update from Chainlink Functions Only callable by admin or updater roles

> **Members (2):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x3B018eA1105C5b2E14Df25e029a1C090cE54FC5b` | EOA | 🔴 CRITICAL | 2026-05-16 | Events only · hasRole ✓ | ⚠️ Single private key |
> | `0x6C15B25E9750Dccb698C1a4023f34015bFe57649` | EOA | 🔴 CRITICAL | 2025-05-26 | Events only · hasRole ✓ | ⚠️ Single private key |

### > 🟠 `nAVReceiver()` · 📋 operational


> **Members (1):**

> | Address | Name / Type | Granted | Source | Details |
> |---|---|---|---|---|
> | `0xd1D104a7515989ac82F1AFDa15a23650411b05B8` | SharePriceCalculator | — | Events only |  |

> #### 🔧 Permissioned Parameters

> **`automationEnabled`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)*

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `True` |
> | Setter | `setAutomationEnabled(bool enabled)` |
> | Gated by | `ADMIN_ROLE` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`deviationCheckEnabled`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)*

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `True` |
> | Setter | `setDeviationCheckEnabled(bool _enabled)` |
> | Gated by | `ADMIN_ROLE` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`maxDeviationBps`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)*

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `1000` |
> | Setter | `setMaxDeviation(uint256 _maxDeviationBps)` |
> | Gated by | `ADMIN_ROLE` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`MIN_CALLBACK_GAS_LIMIT`** 🔒 **IMMUTABLE**

> > 🔒 **Immutable** — declared as a constant in the contract source; cannot be changed without a contract upgrade. Bounds the reachable extreme of any setter that writes a related storage variable.

> | Field | Value |
> |---|---|
> | Current Value | `100000` |
> | Mutability | 🔒 immutable (constant) |
> | Tags | `IMMUTABLE` |

> **`MIN_FORCE_UPDATE_INTERVAL`** 🔒 **IMMUTABLE**

> > 🔒 **Immutable** — declared as a constant in the contract source; cannot be changed without a contract upgrade. Bounds the reachable extreme of any setter that writes a related storage variable.

> | Field | Value |
> |---|---|
> | Current Value | `14400` |
> | Mutability | 🔒 immutable (constant) |
> | Tags | `IMMUTABLE` |

> **`navReceiver`**

> | Field | Value |
> |---|---|
> | Current Value | `0xd1D104a7515989ac82F1AFDa15a23650411b05B8` |
> | Setter | `setNAVReceiver(address _navReceiver)` |
> | Gated by | `ADMIN_ROLE` |
> | Tags | — |
> | Last changed | 2025-05-26 |
> | Changed by | `0xd1D1...05B8` (SharePriceCalculator) |
> | Total changes | 1 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `0xd1D104a7515989ac82F1AFDa15a23650411b05B8` | `0xd1D1...05B8` (SharePriceCalculator) | 2025-05-26 |

> **`pause`** ❄️ **DORMANT**

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Setter | `pause()` |
> | Gated by | `ADMIN_ROLE` |
> | Tags | `PAUSE` |
> | Last called | — |
> | Called by | — |
> | Total calls | 0 ❄️ |

> **`targetHour`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)* 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `23` |
> | Setter | `setAutomationTimeParameters(uint256 _targetHour, uint256 _targetMinute, uint256 _timeWindow)` |
> | Gated by | `ADMIN_ROLE` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`unpause`** ❄️ **DORMANT**

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Setter | `unpause()` |
> | Gated by | `ADMIN_ROLE` |
> | Tags | `PAUSE` |
> | Last called | — |
> | Called by | — |
> | Total calls | 0 ❄️ |

> #### 💰 Supply Actions

> _Mint / redeem / burn call tracking — last 5 calls per function, total counts preserved._

> **`forceNAVUpdate`**

> | Field | Value |
> |---|---|
> | Setter | `forceNAVUpdate(uint256 _navValue, string calldata _reason)` |
> | Gated by | `EMERGENCY_UPDATER_ROLE` |
> | Tags | `SUPPLY` |
> | Last called | 2026-06-25 |
> | Called by | `0x8eec...fBaD` (Gnosis Safe 3/5) |
> | Total calls | 1 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `_navValue=1085453717408277800 (1.085454e18) · _reason=Functions Router paused; emergency NAV refresh pending CRE migration` | `0x8eec...fBaD` (Gnosis Safe 3/5) | 2026-06-25 |

---
<a id="c-0xad6d3923a78393d1e47321e276da3627a51f8431"></a>
## > StakedRe `0xaD6d3923a78393d1E47321e276Da3627a51F8431`

> > 🛡️ **Managed by AccessManager** — restricted functions are gated by [AccessManager](#c-0x3f0da1c363e34802c6f12f9c27276dc0e6696fd8) `0x3f0DA1C363e34802C6f12F9C27276dC0e6696FD8`. Each `restricted()` function is attributed to its AM role below; the role's members (verified via `hasRole`) are the actual authorities. Note: ADMIN_ROLE on the AccessManager can re-grant any role, so the meta-admin chain is the upper bound on single-key reachability.

> > ⚠️ **Upgradeable** (UUPS) — impl: `0x2C6165737c483D81F27F891C5344A5ad56777Bc5`

> **Proxy History (1 event):**

> | # | Date | Event | Address | Key Changes | Tx |
> |---|---|---|---|---|---|
> | 1 | 2026-06-12 | Upgrade | `0x2C61...7Bc5` | Initial deployment | [0x4bead9e95925b1eae3d0f3fd4f792acd277b52c038182a8bdd13726b6bc9df3b](https://etherscan.io/tx/0x4bead9e95925b1eae3d0f3fd4f792acd277b52c038182a8bdd13726b6bc9df3b) |

> > 💰 **Inherited supply authority** — holds `MINTER_ROLE` on **reUSD (ERC1967Proxy) [ShareToken]**, `OPERATOR_ROLE` on **InsuranceCapitalLayer**. Access controls on this contract gate root token supply.

### > 🔴 `upgradeability (UUPS)`

> > ⚠️ **CRITICAL** — Upgradeability allows arbitrary code replacement. Must be behind both a Multisig AND a Timelock.

> **Privileged write functions:**  
> **Capabilities:** ⬆️ **UPGRADE**
> - `upgradeTo(address)` — Upgrade proxy implementation to a new address `[UPGRADE]`
> - `upgradeToAndCall(address,bytes)` — Upgrade proxy implementation and call an initializer `[UPGRADE]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | ⚠️ UNKNOWN | — | 🔴 CRITICAL | — | — | Upgrade controller unresolved |

### > 🟠 `AM Operator (role 2296013215840966718; gates 2 fn(s) across 1 target(s)) [via AM 0x3f0D...6FD8]`

> **Hash:** `am_role_2296013215840966718@0x3f0da1c363e34802c6f12f9c27276dc0e6696fd8`  
> **Privileged write functions:**  
> **Capabilities:** 💰 **SUPPLY**
> - `mint(address,uint256)` — Create new tokens, increasing total supply `[SUPPLY]`
> - `burn(address,uint256)` — Destroy tokens, reducing total supply `[SUPPLY]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x2EAFA5bD2c477e21C8Edd4C9781A2FA54C623900` | ERC1967Proxy | 🟠 HIGH | — | Storage only |  |

### > 🟢 `AM Operator (role 595895589036249767; gates 2 fn(s) across 2 target(s)) [via AM 0x3f0D...6FD8]`

> **Hash:** `am_role_595895589036249767@0x3f0da1c363e34802c6f12f9c27276dc0e6696fd8`  
> **Privileged write functions:**  
> **Capabilities:** ⬆️ **UPGRADE**
> - `upgradeToAndCall(address,bytes)` `[UPGRADE]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x8eec10616802Ef639CA55c98ac856553fAdEfBaD` | Gnosis Safe 3/5 | 🟢 LOW | — | Storage only | 3/5 signers |

> **Signers of `Gnosis Safe 3/5` (0x8eec...fBaD):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x2a3Ef2FEd07D025b8B1f07d99C77471D11529db9` | EOA | — | EOA |
> | `0x28d8af3CF7286Bdc34ae80cb90093dFA4dbb0020` | EOA | — | EOA |
> | `0x7dd97C12abd41c53B4f2B3df6b872753F9DABCaa` | EOA | — | EOA |
> | `0x1F76cC0eF4605f57478f3044e703AF6B0C57A297` | EOA | — | EOA |
> | `0x0AE4eeAFfDA174F84c84c22f03a28F3AAB02FbDC` | EOA (EIP-7702 → `0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B`) | — | EOA |

### > 🟠 `stakingModule()`

> **Privileged write functions:**  
> **Capabilities:** 💰 **SUPPLY**
> - `mint(address to, uint256 amount)` — Mints voting tokens to an account. `[SUPPLY]`
> - `burn(address from, uint256 amount)` — Burns voting tokens from an account. `[SUPPLY]`
> - `delegate(address delegatee)` — Delegates votes from the sender to `delegatee`. /
> - `delegateBySig(address delegatee, uint256 nonce, uint256 expiry, uint8 v, bytes32 r, bytes32 s)` — Delegates votes from signer to `delegatee`. /

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x2EAFA5bD2c477e21C8Edd4C9781A2FA54C623900` | ERC1967Proxy | 🟠 HIGH | — | Storage only |  |

### > 🟢 `AM Operator (role 15105228643940298600; gates 2 fn(s) across 2 target(s)) [via AM 0x3f0D...6FD8]`

> **Hash:** `am_role_15105228643940298600@0x3f0da1c363e34802c6f12f9c27276dc0e6696fd8`  
> **Privileged write functions:**
> - `setAuthority(address)`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x8eec10616802Ef639CA55c98ac856553fAdEfBaD` | Gnosis Safe 3/5 | 🟢 LOW | — | Storage only | 3/5 signers |

> **Signers of `Gnosis Safe 3/5` (0x8eec...fBaD):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x2a3Ef2FEd07D025b8B1f07d99C77471D11529db9` | EOA | — | EOA |
> | `0x28d8af3CF7286Bdc34ae80cb90093dFA4dbb0020` | EOA | — | EOA |
> | `0x7dd97C12abd41c53B4f2B3df6b872753F9DABCaa` | EOA | — | EOA |
> | `0x1F76cC0eF4605f57478f3044e703AF6B0C57A297` | EOA | — | EOA |
> | `0x0AE4eeAFfDA174F84c84c22f03a28F3AAB02FbDC` | EOA (EIP-7702 → `0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B`) | — | EOA |

### > ⚪ `AM Operator (role 6188966020025569725; gates 1 fn(s) across 1 target(s)) [via AM 0x3f0D...6FD8]`

> **Hash:** `am_role_6188966020025569725@0x3f0da1c363e34802c6f12f9c27276dc0e6696fd8`  
> **Privileged write functions:**
> - `bindStakingModule(address)`

> **Members (0):** _No active members — all holders verified inactive._


### > 🟠 `authority()`


> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x3f0DA1C363e34802C6f12F9C27276dC0e6696FD8` | AccessManager | 🟠 HIGH | — | Storage+Events |  |

> #### 🔧 Permissioned Parameters

> **`authority`**

> | Field | Value |
> |---|---|
> | Current Value | `0x3f0DA1C363e34802C6f12F9C27276dC0e6696FD8` |
> | Setter | `setAuthority(address)` |
> | Gated by | `AM Operator (role 15105228643940298600; gates 2 fn(s) across 2 target(s)) [via AM 0x3f0D...6FD8]` |
> | Tags | — |
> | Last changed | 2026-06-12 |
> | Changed by | `0x0AE4...FbDC` (EOA (EIP-7702 → 0x63c0c19a…)) |
> | Total changes | 1 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `0x3f0DA1C363e34802C6f12F9C27276dC0e6696FD8` | `0x0AE4...FbDC` (EOA (EIP-7702 → 0x63c0c19a…)) | 2026-06-12 |

> #### 💰 Supply Actions

> _Mint / redeem / burn call tracking — last 5 calls per function, total counts preserved._

> **`burn`** *(per-asset)* ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Setter | `burn(address from, uint256 amount)` |
> | Gated by | `stakingModule(), AM Operator (role 2296013215840966718; gates 2 fn(s) across 1 target(s)) [via AM 0x3f0D...6FD8]` |
> | Tags | `SUPPLY` |
> | Last called | — |
> | Called by | — |
> | Total calls | 0 ❄️ |

> **`mint`** *(per-asset)* ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Setter | `mint(address to, uint256 amount)` |
> | Gated by | `stakingModule(), AM Operator (role 2296013215840966718; gates 2 fn(s) across 1 target(s)) [via AM 0x3f0D...6FD8]` |
> | Tags | `SUPPLY` |
> | Last called | — |
> | Called by | — |
> | Total calls | 0 ❄️ |

---
<a id="c-0x526526528f35ac738177003b8773b402b8df8143"></a>
## > ReProtocolToken `0x526526528F35AC738177003b8773B402B8Df8143`

> > ⚠️ **Upgradeable** (UUPS) — impl: `0x4D24b40E5B1103b3CE071192Fce91Ef39ABC0273`

> **Proxy History (1 event):**

> | # | Date | Event | Address | Key Changes | Tx |
> |---|---|---|---|---|---|
> | 1 | 2026-05-14 | Upgrade | `0x4D24...0273` | Initial deployment | [0x3e73f8098ea6e1162e09b789c53adf7f56722b154eaa5e6317710e916c7efa87](https://etherscan.io/tx/0x3e73f8098ea6e1162e09b789c53adf7f56722b154eaa5e6317710e916c7efa87) |

> > 💰 **Inherited supply authority** — holds `MINTER_ROLE` on **reUSD (ERC1967Proxy) [ShareToken]**, `OPERATOR_ROLE` on **InsuranceCapitalLayer**, `stakeToken()` on **ReProtocolStaking**. Access controls on this contract gate root token supply.

### > 🔴 `upgradeability (UUPS)`

> > ⚠️ **CRITICAL** — Upgradeability allows arbitrary code replacement. Must be behind both a Multisig AND a Timelock.

> **Privileged write functions:**  
> **Capabilities:** ⬆️ **UPGRADE**
> - `upgradeTo(address)` — Upgrade proxy implementation to a new address `[UPGRADE]`
> - `upgradeToAndCall(address,bytes)` — Upgrade proxy implementation and call an initializer `[UPGRADE]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x69dDEa332723cF5407151aAF68B9b076557FCA93` | TimelockController (2d) | 🟢 LOW | — | Storage only | 2d delay (⚠ changed 1x) |


> **Delay history for `TimelockController (2d)` (0x69dD...CA93):** 2d → 2d

### > 🟢 `DEFAULT_ADMIN_ROLE`

> **Hash:** `0x0000000000000000000000000000000000000000000000000000000000000000`  
> **Managed by:** `DEFAULT_ADMIN_ROLE`  

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x69dDEa332723cF5407151aAF68B9b076557FCA93` | TimelockController (2d) | 🟢 LOW | 2026-05-14 | Events only · hasRole ✓ | 2d delay (⚠ changed 1x) |


> **Delay history for `TimelockController (2d)` (0x69dD...CA93):** 2d → 2d

### > 🟢 `UPGRADER_ROLE`

> **Hash:** `0x189ab7a9244df0848122154315af71fe140f3db0fe014031783b0946b8c9d2e3`  
> **Managed by:** `DEFAULT_ADMIN_ROLE`  
> **Privileged write functions:**  
> **Capabilities:** ⬆️ **UPGRADE**
> - `upgradeToAndCall(address newImplementation, bytes memory data)` — Performs implementation upgrade with additional setup call if data is nonempty. This function is payable only if the setup call is performed, otherwise `msg.value` is rejected `[UPGRADE]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x69dDEa332723cF5407151aAF68B9b076557FCA93` | TimelockController (2d) | 🟢 LOW | 2026-05-14 | Events only · hasRole ✓ | 2d delay (⚠ changed 1x) |


> **Delay history for `TimelockController (2d)` (0x69dD...CA93):** 2d → 2d

---
## ⚡ Authority Concentration

The following addresses hold permissions across multiple contracts or roles in this dependency stack. Concentration of authority increases systemic risk — a single compromised key or colluding multisig can affect multiple systems.

### 🟢 `0x8eec10616802Ef639CA55c98ac856553fAdEfBaD` — Gnosis Safe 3/5
Controls **21 role(s)** across **9 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| reUSD (ERC1967Proxy) [ShareToken] `0x5086...0c72` | `upgradeability (UUPS)` | `upgradeTo(address)`, `upgradeToAndCall(address,bytes)` | — |
| TimelockController `0x69dD...CA93` | `EXECUTOR_ROLE` | `execute(address target, uint256 value, bytes calldata payload, bytes32 predecessor, bytes32 salt)`, `executeBatch(address[] calldata targets, uint256[] calldata values, bytes[] calldata payloads, bytes32 predecessor, bytes32 salt)` | 2026-02-23 |
| TimelockController `0x69dD...CA93` | `CANCELLER_ROLE` | `cancel(bytes32 id)` | 2026-02-23 |
| TimelockController `0x69dD...CA93` | `PROPOSER_ROLE` | `schedule(address target, uint256 value, bytes calldata data, bytes32 predecessor, bytes32 salt, uint256 delay)`, `scheduleBatch(address[] calldata targets, uint256[] calldata values, bytes[] calldata payloads, bytes32 predecessor, bytes32 salt, uint256 delay)` | 2026-02-23 |
| InsuranceCapitalLayer `0x4691...3093` | `PAUSER_ROLE` | `pause()`, `unpause()` | 2026-02-24 |
| InsuranceCapitalLayer `0x4691...3093` | `upgradeability (UUPS)` | `upgradeTo(address)`, `upgradeToAndCall(address,bytes)` | — |
| BurnWithFromMintTokenPool `0xF00B...8465` | `owner()` | `setDynamicConfig(address router, address rateLimitAdmin, address feeAdmin)`, `setAllowedFinalityConfig(bytes4 allowedFinality)`, `updateAdvancedPoolHooks(IAdvancedPoolHooks newHook)`, `addRemotePool(uint64 remoteChainSelector, bytes calldata remotePoolAddress)` +7 more | — |
| AccessManager `0x3f0D...6FD8` | `ADMIN_ROLE (AM root admin)` | `grantRole(uint64,address,uint32)`, `revokeRole(uint64,address)`, `setTargetFunctionRole(address,bytes4[],uint64)`, `setRoleAdmin(uint64,uint64)` +6 more | — |
| DepositTokenRegistry `0x73d3...c0F6` | `PAUSER_ROLE` | `pauseToken(address token)`, `unpauseToken(address token)` | 2026-05-13 |
| DepositTokenRegistry `0x73d3...c0F6` | `ADMIN_ROLE` | `addToken(address token, uint256 fixedDepositFee_, uint256 percentageDepositFee_, address priceOracle_, bool eligibleAsCollateral_, uint256 defaultSlippageTolerance_, uint256 minDeposit_)`, `removeToken(address token)`, `updateSlippage(address token, uint256 newSlippage)`, `addNativeToken(uint256 fixedDepositFee_, uint256 percentageDepositFee_, address priceOracle_, bool eligibleAsCollateral_, address wrappedNativeToken_, uint256 slippage_, uint256 minDeposit_)` +2 more | 2026-05-13 |
| DepositTokenRegistry `0x73d3...c0F6` | `FEE_MANAGER_ROLE` | `updateTokenFees(address token, uint256 fixedDepositFee_, uint256 percentageDepositFee_)` | 2026-05-13 |
| DepositTokenRegistry `0x73d3...c0F6` | `ORACLE_MANAGER_ROLE` | `updateTokenOracle(address token, address priceOracle_)` | 2026-05-13 |
| ReProtocolStaking `0x2EAF...3900` | `AM Operator (role 211310302505071350; gates 1 fn(s) across 1 target(s)) [via AM 0x3f0D...6FD8]` | `unpause()` | — |
| ReProtocolStaking `0x2EAF...3900` | `AM Operator (role 8001233221072730583; gates 3 fn(s) across 1 target(s)) [via AM 0x3f0D...6FD8]` | `setMinimumStake(uint256)`, `setMaxActiveTranchesPerUser(uint16)`, `setMaxSyncBatchSize(uint16)` | — |
| ReProtocolStaking `0x2EAF...3900` | `AM Operator (role 1696015379001973530; gates 1 fn(s) across 1 target(s)) [via AM 0x3f0D...6FD8]` | `setKYCRegistry(address)` | — |
| ReProtocolStaking `0x2EAF...3900` | `AM Operator (role 2386126226847563591; gates 1 fn(s) across 1 target(s)) [via AM 0x3f0D...6FD8]` | `rescueToken(address,uint256,address)` | — |
| ReProtocolStaking `0x2EAF...3900` | `AM Operator (role 595895589036249767; gates 2 fn(s) across 2 target(s)) [via AM 0x3f0D...6FD8]` | `upgradeToAndCall(address,bytes)` | — |
| ReProtocolStaking `0x2EAF...3900` | `AM Operator (role 15105228643940298600; gates 2 fn(s) across 2 target(s)) [via AM 0x3f0D...6FD8]` | `setAuthority(address)` | — |
| NAVConsumer `0x84d4...b2B6` | `EMERGENCY_UPDATER_ROLE` | `forceNAVUpdate(uint256 _navValue, string calldata _reason)` | 2026-05-13 |
| StakedRe `0xaD6d...8431` | `AM Operator (role 595895589036249767; gates 2 fn(s) across 2 target(s)) [via AM 0x3f0D...6FD8]` | `upgradeToAndCall(address,bytes)` | — |
| StakedRe `0xaD6d...8431` | `AM Operator (role 15105228643940298600; gates 2 fn(s) across 2 target(s)) [via AM 0x3f0D...6FD8]` | `setAuthority(address)` | — |

### 🟢 `0x69dDEa332723cF5407151aAF68B9b076557FCA93` — TimelockController (2d)
Controls **7 role(s)** across **3 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| reUSD (ERC1967Proxy) [ShareToken] `0x5086...0c72` | `UPGRADER_ROLE` | `upgradeToAndCall(address newImplementation, bytes memory data)` | 2026-02-23 |
| reUSD (ERC1967Proxy) [ShareToken] `0x5086...0c72` | `upgradeability (UUPS)` | `upgradeTo(address)`, `upgradeToAndCall(address,bytes)` | — |
| InsuranceCapitalLayer `0x4691...3093` | `UPGRADER_ROLE` | `upgradeToAndCall(address newImplementation, bytes memory data)` | 2026-02-23 |
| InsuranceCapitalLayer `0x4691...3093` | `CUSTODIAN_MANAGER_ROLE` | `addCustodian(address token, address custodian)`, `removeCustodian(address token, address custodian)` | 2026-03-19 |
| InsuranceCapitalLayer `0x4691...3093` | `upgradeability (UUPS)` | `upgradeTo(address)`, `upgradeToAndCall(address,bytes)` | — |
| ReProtocolToken `0x5265...8143` | `UPGRADER_ROLE` | `upgradeToAndCall(address newImplementation, bytes memory data)` | 2026-05-14 |
| ReProtocolToken `0x5265...8143` | `upgradeability (UUPS)` | `upgradeTo(address)`, `upgradeToAndCall(address,bytes)` | — |

### 🔴 `0x07e5faC51aD770e23F5399d51070647E16e75F4F` — EOA
Controls **4 role(s)** across **4 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| TimelockController `0x69dD...CA93` | `CANCELLER_ROLE` | `cancel(bytes32 id)` | 2026-02-23 |
| InsuranceCapitalLayer `0x4691...3093` | `PAUSER_ROLE` | `pause()`, `unpause()` | 2026-02-24 |
| DepositTokenRegistry `0x73d3...c0F6` | `PAUSER_ROLE` | `pauseToken(address token)`, `unpauseToken(address token)` | 2026-05-13 |
| ReProtocolStaking `0x2EAF...3900` | `AM Operator (role 13697439394725303084; gates 1 fn(s) across 1 target(s)) [via AM 0x3f0D...6FD8]` | `pause()` | — |

### 🟠 `0x3f0DA1C363e34802C6f12F9C27276dC0e6696FD8` — AccessManager
Controls **3 role(s)** across **3 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| InsuranceCapitalLayer `0x4691...3093` | `OPERATOR_ROLE` | `setDepositEnabled(bool depositEnabled_)`, `setKycRegistry(address kycRegistry_)`, `setDepositTokenRegistry(address depositTokenRegistry_)`, `setSharePriceCalculator(address sharePriceCalculator_)` +4 more | 2026-05-13 |
| KYCRegistry `0x82F1...3995` | `KYC_ADMIN_ROLE` | `addKYCProvider(address provider)`, `removeKYCProvider(address provider)` | 2026-05-13 |
| NAVConsumer `0x84d4...b2B6` | `ADMIN_ROLE` | `setAutomationEnabled(bool enabled)`, `configure(uint64 _subscriptionId, bytes32 _donId, string calldata _source, bytes calldata _encryptedSecretsReference)`, `setCallbackGasLimit(uint32 _callbackGasLimit)`, `requestNAV()` +6 more | 2026-05-13 |

### 🟠 `0x5086bf358635B81D8C47C66d1C8b9E567Db70c72` — reUSD (ERC1967Proxy)
Controls **2 role(s)** across **2 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| InsuranceCapitalLayer `0x4691...3093` | `shareToken()` | `deposit(address token, uint amount, uint minShares)`, `processPrestakedDeposit(address token, uint amount, uint minShares, address receiver)` | — |
| InstantRedemption `0xa31d...2A40` | `shareToken()` | `redeemFor(address user, uint256 shares, uint256 minPayout)` | — |

### 🟠 `0x82F1806AEab5Ecb9a485eb041d5Ed4940b123995` — KYCRegistry
Controls **2 role(s)** across **2 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| InstantRedemption `0xa31d...2A40` | `kyc()` | `redeemFor(address user, uint256 shares, uint256 minPayout)` | — |
| ReProtocolStaking `0x2EAF...3900` | `kycRegistry()` | `initialize(InitParams memory params)`, `stake(uint256 stakeAmount)`, `stakeWithPermit(uint256 stakeAmount, uint256 deadline, uint8 v, bytes32 r, bytes32 s)` | — |

### 🔴 `0xEE16bE0374f2eFb34218affC1a8EbEe9310c47f8` — EOA
Controls **2 role(s)** across **2 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| InstantRedemption `0xa31d...2A40` | `AM Operator (role 11723228863651074278; gates 9 fn(s) across 3 target(s)) [via AM 0x3f0D...6FD8]` | `setFeeVault(address)`, `updateFee(uint16)`, `updateLimitPercentages(uint256,uint256)`, `updateRedemptionRange(uint256,uint256)` +1 more | — |
| PayoutTokenRegistry `0xf788...Bdc3` | `AM Operator (role 11723228863651074278; gates 9 fn(s) across 3 target(s)) [via AM 0x3f0D...6FD8]` | `setTokenConfig(address,bool,bool)`, `emergencySwitch(address)` | — |

### 🔴 `0x3B018eA1105C5b2E14Df25e029a1C090cE54FC5b` — EOA
Controls **2 role(s)** across **1 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| NAVConsumer `0x84d4...b2B6` | `KEEPER_ROLE` | `performUpkeep(bytes calldata)` | 2026-05-16 |
| NAVConsumer `0x84d4...b2B6` | `UPDATER_ROLE` | `requestNAV()` | 2026-05-16 |

### 🔴 `0x6C15B25E9750Dccb698C1a4023f34015bFe57649` — EOA
Controls **2 role(s)** across **1 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| NAVConsumer `0x84d4...b2B6` | `KEEPER_ROLE` | `performUpkeep(bytes calldata)` | 2025-05-26 |
| NAVConsumer `0x84d4...b2B6` | `UPDATER_ROLE` | `requestNAV()` | 2025-05-26 |

### 🟠 `0x2EAFA5bD2c477e21C8Edd4C9781A2FA54C623900` — ERC1967Proxy
Controls **2 role(s)** across **1 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| StakedRe `0xaD6d...8431` | `stakingModule()` | `mint(address to, uint256 amount)`, `burn(address from, uint256 amount)`, `delegate(address delegatee)`, `delegateBySig(address delegatee, uint256 nonce, uint256 expiry, uint8 v, bytes32 r, bytes32 s)` | — |
| StakedRe `0xaD6d...8431` | `AM Operator (role 2296013215840966718; gates 2 fn(s) across 1 target(s)) [via AM 0x3f0D...6FD8]` | `mint(address,uint256)`, `burn(address,uint256)` | — |


---
## ⛔ Sanctions Screening

| Source | Status |
|---|---|
| OFAC SDN | ✅ OFAC SDN screened (97 ETH addresses, cache: 2026-07-02) |
| Chainalysis | ✅ Chainalysis screened |
| **Result** | 53 addresses screened · ✅ 0 flagged |

---
## EOA Exposure Summary

The following roles are held by EOAs:

- **TimelockController** → `EXECUTOR_ROLE` held by EOA `0x4bFeA59B948A1A0fAC3C8C40BFd86E0E740738f3`
  Functions: `execute(address target, uint256 value, bytes calldata payload, bytes32 predecessor, bytes32 salt)`, `executeBatch(address[] calldata targets, uint256[] calldata values, bytes[] calldata payloads, bytes32 predecessor, bytes32 salt)`
- **TimelockController** → `EXECUTOR_ROLE` held by EOA `0x629674e24ac87E3CD36C60FD4C2C026f146188a8`
  Functions: `execute(address target, uint256 value, bytes calldata payload, bytes32 predecessor, bytes32 salt)`, `executeBatch(address[] calldata targets, uint256[] calldata values, bytes[] calldata payloads, bytes32 predecessor, bytes32 salt)`
- **TimelockController** → `CANCELLER_ROLE` held by EOA `0x07e5faC51aD770e23F5399d51070647E16e75F4F`
  Functions: `cancel(bytes32 id)`
- **InsuranceCapitalLayer** → `PAUSER_ROLE` held by EOA `0x07e5faC51aD770e23F5399d51070647E16e75F4F`
  Functions: `pause()`, `unpause()`
- **InstantRedemption** → `AM Operator (role 11723228863651074278; gates 9 fn(s) across 3 target(s)) [via AM 0x3f0D...6FD8]` held by EOA `0xEE16bE0374f2eFb34218affC1a8EbEe9310c47f8`
  Functions: `setFeeVault(address)`, `updateFee(uint16)`, `updateLimitPercentages(uint256,uint256)`
- **DepositTokenRegistry** → `PAUSER_ROLE` held by EOA `0x07e5faC51aD770e23F5399d51070647E16e75F4F`
  Functions: `pauseToken(address token)`, `unpauseToken(address token)`
- **KYCRegistry** → `KYC_PROVIDER_ROLE` held by EOA `0x67dD3914A3c8FD627824153773117276a5E4f3A5`
  Functions: `approveKYC(address user)`, `revokeKYC(address user)`
- **KYCRegistry** → `KYC_PROVIDER_ROLE` held by EOA `0x97DD4581799796991E7479E178405506652f8Db6`
  Functions: `approveKYC(address user)`, `revokeKYC(address user)`
- **KYCRegistry** → `KYC_PROVIDER_ROLE` held by EOA `0xDD18De3820187F728598C5786574865aF260d4C3`
  Functions: `approveKYC(address user)`, `revokeKYC(address user)`
- **PayoutTokenRegistry** → `AM Operator (role 11723228863651074278; gates 9 fn(s) across 3 target(s)) [via AM 0x3f0D...6FD8]` held by EOA `0xEE16bE0374f2eFb34218affC1a8EbEe9310c47f8`
  Functions: `setTokenConfig(address,bool,bool)`, `emergencySwitch(address)`
- **ReProtocolStaking** → `AM Operator (role 13697439394725303084; gates 1 fn(s) across 1 target(s)) [via AM 0x3f0D...6FD8]` held by EOA `0x07e5faC51aD770e23F5399d51070647E16e75F4F`
  Functions: `pause()`
- **ReProtocolStaking** → `AM Operator (role 13027108596976310255; gates 1 fn(s) across 1 target(s)) [via AM 0x3f0D...6FD8]` held by EOA `0xf31d8E94928147cCb30C698ddD81C6791861C4a9`
  Functions: `syncBatch(address[])`
- **NAVConsumer** → `KEEPER_ROLE` held by EOA `0x3B018eA1105C5b2E14Df25e029a1C090cE54FC5b`
  Functions: `performUpkeep(bytes calldata)`
- **NAVConsumer** → `KEEPER_ROLE` held by EOA `0x6C15B25E9750Dccb698C1a4023f34015bFe57649`
  Functions: `performUpkeep(bytes calldata)`
- **NAVConsumer** → `UPDATER_ROLE` held by EOA `0x3B018eA1105C5b2E14Df25e029a1C090cE54FC5b`
  Functions: `requestNAV()`
- **NAVConsumer** → `UPDATER_ROLE` held by EOA `0x6C15B25E9750Dccb698C1a4023f34015bFe57649`
  Functions: `requestNAV()`

---
## ✅ Scan Integrity

No issues detected. All block ranges covered, source and ABI resolved for all contracts.
