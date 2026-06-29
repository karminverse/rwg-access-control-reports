# Trustfall — Access Control Report — Stake DAO DOLA/sUSDe Vault (sd-DOLA-sUSDe-vault)

| Field | Value |
|---|---|
| Contract | `0x0c36ad1a68cdbBBFafaD7d03bb97cbaB24174e55` |
| Token | Stake DAO DOLA/sUSDe Vault (sd-DOLA-sUSDe-vault) |
| Name | RewardVault |
| Chain | Ethereum |
| Proxy Status | ✅ No |
| OZ AccessControl | ❌ No |
| Ownable | ❌ No |
| Pausable | — |
| ERC-4626 Vault | ✅ Underlying: `0x744793B5110f6ca9cC7CDfe1CE16677c3Eb192ef` |
| Control Surface | ✅ Fully on-chain |
| Scan Integrity | ✅ No issues detected |
| Report Date | 2026-06-29 21:57 UTC |

### Surface Summary

| Field | Value |
|---|---:|
| Contracts | 12 |
| Role slots | 46 |
| Privileged Fns | 66 |
| EOA Holders | 2 ⚠️ |
| Critical Roles | 2 ⚠️ |

## Changes Since Last Scan

> Comparing **2026-06-22T15:51:27Z** (block 25374134) → **2026-06-29T21:56:34Z** (block 25426137).

### Roles
- 🔄 `CANCELLER_ROLE` on **ProtocolTimelock** (`0xb27afc…8e6a`)
    - member ➕ `0xce71c0…26f1`
- 🔄 `DEFAULT_ADMIN_ROLE` on **ProtocolTimelock** (`0xb27afc…8e6a`)
    - member ➖ `0xb0552b…c765`


## 📋 Protocol Context

> *From protocol profile: Stake DAO / rewardVault (ERC-4626 Vault (clone))*

<details>
<summary><strong>Architecture</strong></summary>

- **Architectural shape:** OZ AccessControl + OZ TimelockController (2d) + Safe 3/5 proposer/executor. Stake DAO OnlyBoost v2 four-contract architecture (RewardVault clone / ProtocolController / Accountant / CurveStrategy). FiRM-relevant SUPPLY surface routes through ProtocolController.setStrategy + setAllocator (CRITICAL, 2d-buffered via Timelock); chair Safe proposes, anyone executes after delay.
- OnlyBoost v2 is Stake DAO's yield aggregator that splits boosted LP deposits between Convex (sidecar) and Stake DAO's own veCRV locker to maximize CRV emissions. The Allocator contract (per-protocol, looked up via PROTOCOL_ID) decides the routing for each deposit/withdraw based on on-chain math (boost levels, current allocations).
- Architecture is FOUR-CONTRACT-per-protocol: (1) ProtocolController — central authority / permission grid / shutdown switch; (2) Accountant — balance ledger (totalSupply, balanceOf, harvested-fee ledger, CRV reward distribution); (3) Strategy — interacts with the underlying gauge / Convex sidecar; (4) Allocator — routing decision. All four are looked up on the ProtocolController via PROTOCOL_ID. Each RewardVault clone is a thin wrapper around these four.
- RewardVault is CLONED per-gauge via EIP-1167 minimal proxy. Immutable args (gauge, asset) are appended to the clone bytecode and read via ImmutableArgsParser. The clone bytecode is 85 bytes (50 standard EIP-1167 + 40 for two immutable addresses).
- **Implementation contract:** 0x74d8dd40118b13b210d0a1639141ce4458cae0c0 (verified on Etherscan as `RewardVault`). All clones share the same logic but have distinct gauge/asset/PROTOCOL_ID. Etherscan resolves verified source via implementation lookup.
- Implementation 0x74d8dd40…ce0c0 is a PLAIN NON-UPGRADEABLE CONTRACT — both EIP-1967 standard slots (impl + admin) read as 0x00…00 via eth_getStorageAt, and bytecode size is 13,348 bytes. There is no UUPS / Transparent / Beacon proxy upgrade path. Withdraw logic across every sd-*-vault clone is permanently frozen at deploy time. This eliminates the SUBSTITUTION-via-impl-upgrade lever from FiRM's risk surface for OnlyBoost v2 (Q-09 resolved).
- **This specific deploy (0x0c36…4e55):** sd-DOLA-sUSDe-vault, totalSupply ~132,566 LP, POLICY=CHECKPOINT (accumulate rewards until manual harvest, NOT auto-harvest on every action). PROTOCOL_ID=0xc715e373 (likely bytes4(keccak256('CURVE'))). One extra-reward token registered: CVX (0x4e3fbd56…9d2b).
- Asset = Curve DOLA/sUSDe LP token (0x744793b5…92ef). The vault wraps the LP — depositors get sd-DOLA-sUSDe-vault tokens 1:1 against their LP. DOLA is Inverse Finance's stablecoin; sUSDe is Ethena's staked USDe.
- **FiRM-ESCROW USE:** This vault is a candidate to hold FiRM market collateral on behalf of borrowers, added ON TOP of FiRM's existing direct-Convex/direct-Curve escrow stack. The investigation lens is LIQUIDATION-PATH INTEGRITY of the NEW trust layer only — see top-of-file lens block. The withdraw path for liquidate() is: FiRM market → vault.withdraw()/redeem() → CurveStrategy.withdraw() → gauge/sidecar unstake → LP returned to liquidator. The NEW access-control surface added by OnlyBoost v2 is the four Stake-DAO contracts in this chain (RewardVault, ProtocolController, CurveStrategy, Accountant) plus their owners. The gauge/sidecar unstake step traverses Curve and Convex, but pause/fee risk on those layers is in the ACCEPTED BASELINE (FiRM already accepts direct-deposit escrows there). Second-order, this vault holds DOLA exposure via the LP basis; that's a separate risk surface from access-control.
- Authority is INDIRECT throughout. RewardVault has zero local role storage. Every privileged action checks against PROTOCOL_CONTROLLER state via three modifiers (onlyProtocolController, onlyAllowed, onlyRegistrar). To assess this vault's true authority surface, the scanner must BFS into PROTOCOL_CONTROLLER (0x2d8bCE1F…d4fb) and decode the role topology there.
- Accountant (0x93b4b9bd…1ce0) is the actual balance ledger. RewardVault.totalSupply() and balanceOf() are pass-throughs to Accountant. Accountant also handles the main protocol reward (CRV), harvest fee accounting, and the protocol-fee claim path. Authority topology on Accountant is independent of RewardVault's.
- **Emergency model:** PROTOCOL_CONTROLLER.shutdown(gauge) flips a per-gauge kill switch. Once set, _withdraw() routes shares directly from the vault to the receiver (bypassing the Strategy). resumeVault() restores normal operation by re-depositing all idle assets into the Strategy. Both functions are gated by PROTOCOL_CONTROLLER auth — not by RewardVault role storage.
- **Reward distribution:** extra-reward tokens (CVX, LDO, BAL, etc.) use a Synthetix-style staking-rewards math (rewardRate × timeDelta / totalSupply). Default rewards duration is 7 days; rollover of undistributed rewards is automatic. The per-token rewardsDistributor sets new periods by calling depositRewards(); they cannot pull existing tokens out — only fund forward.
- **License:** BUSL-1.1 (Business Source License). Not commercial-usable until license-defined change date (typically 2-4 years post-deploy). Source is verified and readable, but reuse is restricted.

</details>

<details>
<summary><strong>Function Interaction Paths</strong></summary>

- **`ProtocolController.setStrategy(PROTOCOL_ID=0xc715e373, newStrategy) — or whatever its actual setter is named`** (`Strategy-management role on ProtocolController (TBD — investigate at scan)`)
  - Strategy is resolved per-call via PROTOCOL_CONTROLLER.strategy(PROTOCOL_ID)
  - If this mapping can be re-pointed, the next withdraw() routes through a substituted Strategy that may refuse to return funds, return stale balances, or hold them indefinitely
  - Liquidator gets vault shares burned but no LP returned — or LP at a manipulated price/quantity
  - Strategy is the actual custodian of the gauge position; substitution = custody change
  - ⚠️ *LIQUIDATION-CRITICAL. The vault's withdraw path is entirely mediated by whatever address Strategy resolves to at call-time. This is the cleanest path from a single key to 'liquidator receives nothing'.*
- **`Whoever controls the EIP-1167 implementation at 0x74d8dd40…ce0c0 changes its bytecode/logic`** (`Owner / upgrade authority of the implementation (TBD — verify if implementation is a plain contract OR itself a proxy)`)
  - All sd-*-vault clones DELEGATECALL into this single implementation
  - If it's a non-upgradeable contract, this risk is FOREVER FIXED at deploy time (good)
  - If it's a transparent/UUPS proxy, a single upgrade transaction can replace _withdraw() with arbitrary logic across every clone simultaneously — including this one
  - Withdraw paths could be locked, fee-taxed, or redirected globally
  - ⚠️ *LIQUIDATION-CRITICAL if upgradeable; NEUTRAL if immutable. First task at scan time: is 0x74d8dd40…ce0c0 a proxy? If yes, who controls upgrade?*
- **`Any pause() / setPaused(true) / freeze() function on RewardVault, Strategy, Accountant, or any contract reached during withdraw()`** (`Pause-role / guardian (TBD across all reachable contracts)`)
  - If pause gates _withdraw() (or any function it calls) on any reachable contract, liquidate() reverts until pause is lifted
  - FiRM's liquidation is permissionless on the FiRM side — but the vault withdraw it depends on isn't
  - A pause held by a fast-rotating key (guardian / multisig with low threshold) is effectively a soft censorship layer
  - ⚠️ *LIQUIDATION-CRITICAL if any pause gates the withdraw path. Investigate (NEW-trust-surface only): (a) does RewardVault have a whenNotPaused-style modifier? (b) does CurveStrategy / Accountant? (c) does ProtocolController have a global-pause? — Curve gauge / Convex booster pauses are PRE-ACCEPTED baseline and out of scope per ACCEPTED-BASELINE lens block.*
- **`Accountant fee-setters: harvestFee / performanceFee / withdrawFee / protocolFee (whichever exist)`** (`Accountant owner / fee-manager (TBD — Accountant has its own authority topology)`)
  - Accountant is the balance ledger and fee accountant
  - If a withdraw-time fee or accumulated-harvest-fee can be skimmed at redemption, the liquidator receives less than the on-paper shares × pricePerShare
  - Even a 1% fee = 1% dilution of liquidation proceeds, directly subtracting from FiRM's bad-debt recovery
  - ⚠️ *LIQUIDATION-HIGH. Read Accountant's fee state at scan time. Any non-zero withdraw fee should be sized against the LTV headroom FiRM is willing to grant this collateral.*
- **`ProtocolController.setValidAllocationTarget(gauge, target)`** (`target-management role on ProtocolController (TBD)`)
  - Original framing was deposit-time-drain (next deposit's LP routes to attacker)
  - RE-FRAMED for liquidation lens: if Allocator targets also drive WITHDRAW routing (i.e. the vault pulls funds back from targets[] proportionally during withdraw), an attacker target that ACCEPTS deposits but DOESN'T release on withdraw will leave the liquidator with shares but no LP
  - Need to verify withdraw routing logic — does _withdraw() proportionally pull from all targets[], or only from one?
  - Either way, a stuck/malicious target reduces the redeemable pool
  - ⚠️ *LIQUIDATION-CRITICAL if withdraw routes through targets[]. Even if withdraw is shutdown-style (1:1 from vault), the IDLE balance must equal totalSupply to allow full exit — which requires targets to have already returned funds. Investigate withdraw routing semantics at scan time.*
- **`OnlyBoostAllocator.setGaugeWeights(address gauge, uint256 lockerWeight)`** (`SIDECAR_FACTORY() view-fn role on OnlyBoostAllocator — held by ConvexSidecarFactory 0x6DFA…F9E7 [verified isRegistrar=True via eth_call 2026-05-14]`)
  - Sets MANUAL allocation weights for a gauge, overriding the Allocator's automated boost logic
  - The Allocator decides routing between Stake DAO's veCRV locker and Convex sidecar; this function lets ConvexSidecarFactory bypass that math
  - ConvexSidecarFactory is held as an immutable reference on OnlyBoostAllocator (cannot be re-pointed without an Allocator upgrade), but the Factory itself can be re-deployed by Stake DAO governance via ProtocolController.setFactory()
  - Effective authority chain: setFactory(CURVE, newFactory) is owner-gated on ProtocolController → 2-day Timelock 0xb27a…8E6a → Safe 3/5 proposer
  - Discovered via scan 2026-05-14; not in original recon
  - ⚠️ *LIQUIDATION-MEDIUM-pending. Worst case for liquidator: a misweighting via setGaugeWeights routes new deposits to a non-yielding/non-existent target, but withdraw math depends on `targets[]` set membership (Q-14 — still pending source read). Combined with Q-13/Q-14 resolution, this may upgrade or downgrade. Factory re-deploy path is 2-day timelock-buffered.*
- **`POLICY=CHECKPOINT semantics + harvest-cadence governance`** (`Harvest-caller role on Accountant (TBD)`)
  - CHECKPOINT mode accumulates rewards until manual harvest
  - Verify: does withdraw() require an up-to-date checkpoint?
  - If yes, a stale or delayed checkpoint can cause withdraw math to under-pay the liquidator (they only get the last-checkpoint share-of-rewards, not real-time)
  - If withdraw is independent of harvest, this is not a liquidation-path issue (just a yield-accrual one)
  - ⚠️ *LIQUIDATION-MEDIUM pending verification. Worst case: a stale harvest under-pays by the accumulated-but-unharvested reward portion.*
- **`ProtocolController.shutdown(gauge)`** (`shutdown-authority on ProtocolController (TBD)`)
  - DUAL-USE. Under normal operation: shutdown ROUTES withdrawals 1:1 directly from vault to receiver (bypassing Strategy) — so for the liquidation lens this is mostly a SAFETY feature (it forces the simplest exit path)
  - BUT: the 1:1 exit only works if the vault already holds enough LP to back outstanding shares
  - If Strategy still holds the gauge position at shutdown-time and won't release, the 1:1 is theoretical — the actual claim is 1:0 until someone moves funds back to the vault
  - Also: shutdown PREVENTS new deposits, which is fine for liquidations but blocks normal vault operation
  - ⚠️ *LIQUIDATION-MEDIUM. Verify (a) does shutdown auto-call Strategy.withdraw to repatriate funds, or does it just flip the flag? (b) what is the vault's idle balance at shutdown time in practice? (c) who holds shutdown-authority and can they hold the system in shutdown indefinitely?*
- **`setPermission(vault, EOA, deposit-on-behalf selector, true) on ProtocolController`** (`permissionSetters() on ProtocolController`)
  - Grants the EOA the right to deposit on someone else's behalf
  - Requires user approve() so not a unilateral drain
  - Phishing-velocity amplifier on deposit side; does NOT affect liquidation outcomes
  - ⚠️ *DEPOSIT-SIDE. De-prioritized for FiRM-escrow lens.*
- **`addRewardToken(rewardToken, distributor) on RewardVault`** (`Registrar (isRegistrar on ProtocolController)`)
  - Registers a new extra-reward stream
  - The distributor can only FUND the stream, not pull from it
  - Edge case: a malicious reward token with reentrant transfer hooks could corrupt rewardPerToken math — but rewards math is independent of share/asset math, so liquidation withdrawal is unaffected
  - ⚠️ *DEPOSIT-SIDE / yield-side. De-prioritized for FiRM-escrow lens.*
- **`depositRewards(rewardToken, amount) on RewardVault`** (`Per-token rewardsDistributor (storage on RewardVault)`)
  - Inflows only; no drain primitive
  - ⚠️ *DEPOSIT-SIDE. Not in liquidation-lens scope.*

</details>

<a id="sec-critical-params"></a>
<details>
<summary><strong>🎚️ Critical Parameter Levers</strong></summary>

> *9 on-chain parameter levers that are curated as high-impact for lender-side risk (direct dilution / safety-mechanism closure / authority transfer / oracle repointing). Each entry shows current value, the threshold that triggers the impact, and the role-holder controlling the lever.*

- **`setStrategy(bytes4 protocolId, address strategy)`** 🔴 on [**ProtocolController (0x2d8bCE1FaE00A959354aCD9eBF9174337A64d4fb)**](#c-0x2d8bce1fae00a959354acd9ebf9174337a64d4fb)
    - *Role gate:* owner() = TimelockController (2d) 0xb27a…8E6a [verified eth_call 2026-05-14] — admin chain: Timelock proposer/admin/canceller/executor = Gnosis Safe 3/5 0xB055…C765
    - *Profile-declared value:* `strategy(0xc715e373) = 0xb010…2bb5 (CurveStrategy) [verified eth_call 2026-05-14]`
    - *Threshold:* Any change to this address is a custody change for every gauge under PROTOCOL_ID=CURVE
    - *Impact:* SUBSTITUTION (liquidation-critical). Strategy is the custodian of the gauge position the vault holds. RewardVault calls Strategy.deposit / Strategy.withdraw via the per-protocol lookup — so re-pointing strategy(PROTOCOL_ID) silently replaces the custodian for every clone using that PROTOCOL_ID. A malicious Strategy can refuse to release funds on withdraw, leaving liquidators with burned shares and no LP. Mitigation: 2-day timelock buffer on the owner path means analyst-observable warning window before any change applies; GUARDIAN_ROLE bypass on ProtocolTimelock does NOT include setStrategy (only pause/shutdown).
- **`Implementation bytecode at 0x74d8dd40118b13b210d0a1639141ce4458cae0c0`** on **Implementation template (delegated-into by every sd-*-vault clone)**
    - *Role gate:* NONE — plain non-upgradeable contract [verified eth_call 2026-05-14: EIP-1967 impl slot = 0x00…00, admin slot = 0x00…00]
    - *Profile-declared value:* `13,348 bytes of bytecode at 0x74d8dd40…ce0c0. NOT a proxy. Logic frozen at deploy time across every sd-*-vault clone.`
    - *Threshold:* N/A — no upgrade path exists. Cannot be changed without redeploying every clone against a new implementation address.
    - *Impact:* SUBSTITUTION risk PERMANENTLY MITIGATED. All sd-*-vault clones DELEGATECALL into this address; verification 2026-05-14 confirms both EIP-1967 slots are zero, so neither UUPS nor Transparent-proxy upgrade is possible. Withdraw logic cannot be re-routed, fee-taxed, or DoS'd via implementation upgrade. (Originally graded CRITICAL pending verification; downgraded to INFO after on-chain confirmation.)
- **`setHarvestFeePercent(uint128) + setProtocolFeePercent(uint128) on Accountant`** 🟢 on [**Accountant (0x93b4b9bd266ffA8af68E39EdFa8cFE2a62011cE0)**](#c-0x93b4b9bd266ffa8af68e39edfa8cfe2a62011ce0)
    - *Role gate:* Accountant.owner() = Gnosis Safe 1/1 0xe5d6…8b91 whose SOLE signer is Timelock (2d) 0xb27a…8E6a [verified eth_call + getOwners() 2026-05-14] — effective 2-day delay on any fee change
    - *Live current value (as of block 24,250,519):* `1000000000000000`
    - *Recorded changes:* 12 historical event(s); last setter `0x20aCB38B9268F694657EbefcD2aC9bCb8A103D2e`
    - *Profile-declared value:* `harvestFee = 1e15 (0.1%); protocolFee = 1.65e17 (16.5%); MAX_FEE_PERCENT = 4e17 (40%) immutable cap [verified eth_call 2026-05-14]`
    - *Threshold:* Fees apply to harvested REWARDS only — never to withdraw principal (Q-17 source-resolved Cycle 3 2026-05-15). The 40% cap bounds reward-yield dilution; liquidation principal is structurally insulated.
    - *Impact:* DILUTION (YIELD-SIDE ONLY). Source read of Accountant.checkpoint (src_Accountant.sol:310-376) + harvest paths (src_Accountant.sol:559-601) confirms both fee percentages multiply against `newRewards` / `newFeeSubjectAmount` — NEVER against withdrawal amounts or share-burn quantities. Principal LP flows through CurveStrategy.withdraw → vault → receiver entirely untouched by Accountant fee math. The 40% MAX_FEE_PERCENT cap bounds REWARD-yield dilution, not bad-debt recovery.
- **`ProtocolController.pause(bytes4 protocolId) / unpause / shutdown / unshutdown`** 🟠 on [**ProtocolController (0x2d8bCE1FaE00A959354aCD9eBF9174337A64d4fb) + ProtocolTimelock (0xb27a…8E6a) GUARDIAN bypass**](#c-0x2d8bce1fae00a959354acd9ebf9174337a64d4fb)
    - *Role gate:* owner() = Timelock (2d, 0xb27a…8E6a) — standard path | GUARDIAN_ROLE on ProtocolTimelock — BYPASS path (no delay): Gnosis Safe 3/5 0xB055…C765 + EOA 0xf3a5AC78…947aF [verified hasRole 2026-05-14]
    - *Profile-declared value:* `Currently NOT paused. Last pause: 2025-08-26 (deploy-time setup); unpaused 2025-08-27. shutdown(0x8f5e52be…058f) = never called (0 calls, dormant).`
    - *Threshold:* Any pause/shutdown call by either path. NatSpec confirms `pause()` blocks DEPOSITS only — withdrawals remain functional. `shutdown(gauge)` routes withdrawals 1:1 from vault idle (bypassing Strategy).
    - *Impact:* PREVENTION (deposit-side only — does NOT block FiRM liquidator withdrawals). Source code comment on `pause()`: 'Pauses deposits for a specific protocol. Withdrawals remain functional during pause.' GUARDIAN single-key EOA (0xf3a5…947aF) can pause deposits / toggle shutdown without timelock delay, but cannot prevent liquidator withdrawals. The EOA is a real concern for griefing (forced unshutdown delay) but not for FiRM bad-debt recovery.
- **`setAllocator(bytes4 protocolId, address allocator)`** 🔴 on [**ProtocolController (0x2d8bCE1FaE00A959354aCD9eBF9174337A64d4fb)**](#c-0x2d8bce1fae00a959354acd9ebf9174337a64d4fb)
    - *Role gate:* owner() = TimelockController (2d) 0xb27a…8E6a [verified eth_call 2026-05-14] — 2-day buffer; Timelock admin/proposer/executor/canceller = Gnosis Safe 3/5 0xB055…C765
    - *Profile-declared value:* `allocator(0xc715e373) = 0xC0238579E281DaE9403B7A3c1D22a14D61D7De69 (OnlyBoostAllocator) [verified via report and eth_call]`
    - *Threshold:* Any change rotates the routing-decision contract. New Allocator's SIDECAR_FACTORY immutable determines which factory the per-gauge sidecar resolution points to — replacing this is the only on-chain path to substitute the sidecar set for an existing gauge.
    - *Impact:* SUBSTITUTION (liquidation-critical, Cycle 3 surfaced 2026-05-15 via Q-20 resolution). OnlyBoostAllocator.SIDECAR_FACTORY is IMMUTABLE (set in constructor) — the per-gauge sidecar address routes through this immutable factory reference. So substituting WHICH sidecar a gauge uses requires deploying and installing a new Allocator with a different SIDECAR_FACTORY immutable. A malicious Allocator could (a) return a sidecar that reverts on withdraw → bricks withdraws; (b) return amounts that under-route the actual balance → liquidator receives partial LP; (c) carry over or zero out per-gauge config (lockerOnly[gauge], customWeights[gauge]) — see Q-22. Mitigation: 2-day Timelock buffer + analyst-observable. Shutdown escape hatch still works because Strategy.shutdown iterates `Allocator.getAllocationTargets(gauge)` at the moment of shutdown — if Allocator returns a malicious sidecar that reverts on withdraw, shutdown ALSO reverts, perpetuating the lock. Same 2-day Timelock window applies.
- **`setValidAllocationTarget(address gauge, address target)`** 🟢 on [**ProtocolController (0x2d8bCE1FaE00A959354aCD9eBF9174337A64d4fb)**](#c-0x2d8bce1fae00a959354acd9ebf9174337a64d4fb)
    - *Role gate:* onlyRegistrar OR owner() (Q-20 source-resolved Cycle 3 2026-05-15 — modifier accepts BOTH; scanner now surfaces the dual-gate via metadata annotation post 2026-05-15 dual-gate-detection fix). Registrar set: 5 active [verified eth_call 2026-05-15] — ConvexSidecarFactory, AuraSidecarFactory, BalancerFactory, CurveFactory, RewardReceiverMigrationModule.
    - *Profile-declared value:* `Per-gauge allowlist — writes to PC._isValidAllocationTargets[gauge][target] storage map; not currently surfaced as a permissioned-param table by the scanner.`
    - *Threshold:* N/A — storage map is read ONLY by the `isValidAllocationTarget(gauge, target)` view-fn (src_ProtocolController.sol:486-490). No contract in scope (CurveStrategy, RewardVault, Allocator, Accountant, ProtocolController itself) consumes this mapping for routing or access enforcement. Q-20 Cycle 3 source-corpus grep returned zero `.isValidAllocationTarget` call-sites.
    - *Impact:* INFORMATIONAL ONLY (Q-20 resolved 2026-05-15 — severity downgraded CRITICAL → LOW). The setter writes to a storage map that gates NO downstream behavior. Actual liquidation-path routing comes from `Allocator.getAllocationTargets` → `SIDECAR_FACTORY.getSidecar(gauge)` (immutable reference on OnlyBoostAllocator) → LOCKER (hardcoded-immutable on CurveStrategy). The mapping appears to be a decorative whitelist for off-chain monitoring / future integrations. **Cycle-2's CRITICAL grade was incorrect** — withdraw routing IS through targets[] (Q-14 confirmed), but the `targets[]` array comes from the Allocator's immutable sidecar-factory reference, NOT from this PC storage. To actually substitute a sidecar requires either (a) Allocator upgrade via PC.setAllocator (Timelock 2d) or (b) Allocator's SIDECAR_FACTORY would need to be mutable (it is NOT — immutable in OnlyBoostAllocator constructor). The 2-day Timelock buffer still applies to the genuine custody-substitution levers.
- **`setPermissionSetter(address setter, bool allowed)`** 🔴 on [**ProtocolController (0x2d8bCE1FaE00A959354aCD9eBF9174337A64d4fb)**](#c-0x2d8bce1fae00a959354acd9ebf9174337a64d4fb)
    - *Role gate:* owner() = TimelockController (2d) 0xb27a…8E6a; Timelock admin/proposer/executor/canceller = Gnosis Safe 3/5 0xB055…C765 [verified eth_call 2026-05-14]
    - *Live current value (as of block 23,669,616):* `Gnosis Safe 3/5: True`
    - *Recorded changes:* 6 historical event(s); last setter `0xB0552b6860CE5C0202976Db056b5e3Cc4f9CC765`
    - *Profile-declared value:* `permissionSetters mapping — sole entry: Gnosis Safe 3/5 0xB055…C765 (set 2025-10-27 via Timelock execute)`
    - *Threshold:* Meta-privilege: one-step from full permission-grid control. Adding a new permissionSetter via Timelock owner path requires 2-day delay.
    - *Impact:* META_ADMIN. The PROTOCOL_CONTROLLER owner is upstream of every other ProtocolController lever (strategy/allocator/target/shutdown). Confirmed Safe + Timelock structure: Safe 3/5 acts as proposer, 2-day Timelock buffers all changes. Authority chain is structurally sound — no single-EOA owner. (Originally graded CRITICAL pending verification of holder; remains CRITICAL because META_ADMIN status is inherent regardless of holder structure.)
- **`shutdown(address gauge) / unshutdown(address gauge)`** 🟡 on [**ProtocolController (0x2d8bCE1FaE00A959354aCD9eBF9174337A64d4fb)**](#c-0x2d8bce1fae00a959354acd9ebf9174337a64d4fb)
    - *Role gate:* owner() = Timelock (2d) 0xb27a…8E6a — standard path | GUARDIAN_ROLE on ProtocolTimelock (BYPASS path, no delay) — Gnosis Safe 3/5 0xB055…C765 + EOA 0xf3a5AC78…947aF [verified hasRole 2026-05-14]
    - *Profile-declared value:* `isShutdown(0x8f5e52be…058f) — never called (0 invocations, dormant per scan)`
    - *Threshold:* Once set: new deposits revert, withdrawals bypass Strategy.withdraw (early-return at src_Strategy.sol:167) and route 1:1 from vault idle (RewardVault.sol:388-393).
    - *Impact:* PREVENTION/SAFETY (Q-13 CONFIRMED, Cycle 2 source read). shutdown DOES auto-repatriate. ProtocolController.shutdown(gauge_) (src_ProtocolController.sol:343-353) sets isShutdown=true and then calls Strategy.shutdown(gauge_), which in turn calls _withdrawFromAllTargets to pull LP back from every target (LOCKER + sidecars) to the vault. After shutdown completes, vault idle == totalSupply and the 1:1 exit is REAL. CAVEAT: shutdown is atomic — if any target's withdraw() reverts during repatriation, the entire shutdown reverts, leaving the gauge in normal-withdraw mode where targets are still iterated (the double-bind documented in decisions[]). GUARDIAN single-key EOA (0xf3a5…947aF) bypass is operational (no timelock) — concern is griefing, not liquidator obstruction since shutdown only ENABLES withdraws.
- **`setPermission(address target, address caller, bytes4 selector, bool allowed)`** 🟡 on [**ProtocolController (0x2d8bCE1FaE00A959354aCD9eBF9174337A64d4fb)**](#c-0x2d8bce1fae00a959354acd9ebf9174337a64d4fb)
    - *Role gate:* permissionSetters mapping — sole entry: Gnosis Safe 3/5 0xB055…C765 [verified eth_call 2026-05-15]. Source modifier is `onlyPermissionSetter` which accepts the mapping OR owner() — dual-gate.
    - *Live current value:* `target=0x3680cce0… · caller=CurveYCRVVoter 0x52f5…66B6 · selector=0xcec15175: True (set 2025-11-07) · target=0x3680cce0… · caller=Gnosis Safe 3/5 0xB055…C765 · selector=0x1fc822b1: True (set 2025-11-07) · target=0x3680cce0… · caller=Gnosis Safe 3/5 0xB055…C765 · selector=0xe1189db8: True (set 2025-11-10) · target=0x9a207a85… · caller=0xdbd24b09… · selector=0x44471415: True (set 2025-10-27) · target=0x9a207a85… · caller=0xdbd24b09… · selector=0xa601f747: True (set 2025-10-28) · target=Accountant 0x93b4…1ce0 · caller=0xc3a6cfc4… · selector=0xe84f9836: True (set 2025-08-28)`
    - *Recorded changes:* 6 historical event(s)
    - *Profile-declared value:* `Per-(contract, caller, selector) grid — **6 active grants surfaced via PermissionSet event log 2026-05-15** (scanner under-tracks this 3D mapping; logs decoded directly). Targets are 3 contracts: Accountant (1 grant to 0xc3a6cfc4…), 0x9a207a85… (2 grants to 0xdbd24b09…), 0x3680cce0… (3 grants — 1 to CurveYCRVVoter/LOCKER, 2 to Safe 3/5 itself). Latest activity 2025-11-10. All grants enable deposit-on-behalf / claim-on-behalf flows per source semantics — none introduce custody-substitution paths.`
    - *Threshold:* Any new entry on deposit-on-behalf / claim-on-behalf selectors expands phishing surface (deposit-side only)
    - *Impact:* DEPOSIT-SIDE. Selector-level access grid for deposit-on-behalf / claim-on-behalf. Bounded by user-side approve() — not a liquidation-lens issue. Retained for completeness.

</details>

## 📑 Table of Contents

1. [Analyst Focus Areas](#analyst-focus-areas)
2. Contracts
   - [sd-DOLA-sUSDe-vault ★](#c-0x0c36ad1a68cdbbbfafad7d03bb97cbab24174e55)
   - [CurveStrategy](#c-0xb010c392f9572aeb5ea3817e94dc6745421b2bb5)
   - [ProtocolController](#c-0x2d8bce1fae00a959354acd9ebf9174337a64d4fb)
   - [OnlyBoostAllocator](#c-0xc0238579e281dae9403b7a3c1d22a14d61d7de69)
   - [LiquidityGaugeV6](#c-0x8f5e52be9b7bde850ba13e40284f63f14677058f)
   - [Accountant](#c-0x93b4b9bd266ffa8af68e39edfa8cfe2a62011ce0)
   - [Vyper_contract](#c-0xd061d61a4d941c39e5453435b6345dc261c2fce0)
   - [CRV [Vyper_contract]](#c-0xd533a949740bb3306d119cc777fa900ba034cd52)
   - [CurveYCRVVoter](#c-0x52f541764e6e90eebc5c21ff570de0e2d63766b6)
   - [ProtocolTimelock](#c-0xb27afc7844988948fbd6210aef4e1362bc2d8e6a)
   - [ConvexSidecarFactory](#c-0x6dfa6232ec23e029d4322115f491a912de9cf9e7)
3. [⚡ Authority Concentration](#-authority-concentration)
4. [⛔ Sanctions Screening](#-sanctions-screening)
5. [EOA Exposure Summary](#eoa-exposure-summary)
6. [✅ Scan Integrity](#scan-integrity)

## Analyst Focus Areas

> **Observational findings — not risk determinations.** Each item below is a focus point for the Risk Analyst to interpret against collateralization context and the protocol's stated intent. Attention levels (CRITICAL / HIGH / LOW) reflect the scanner's heuristic weight — not a realized risk to FiRM. These observations support future risk assessments; they do not constitute one.

> **3 critical-attention** and **13 high-attention** observation(s) across 12 contract(s).


### 🔴 CRITICAL (3)

- 🔴 [**Observed: EOA holds `manager()` on LiquidityGaugeV6**](#c-0x8f5e52be9b7bde850ba13e40284f63f14677058f) — `0xEC092c15e8D5A48a77Cde36827F8e228CE39471a` (EOA) — single key controls a role whose config functions (e.g. peer/delegate/bridge setters) reach inherited [PAUSE] authority via RewardVault. Assess custody and intent.
- 🔴 [**Observed: EOA holds `GUARDIAN_ROLE` on ProtocolTimelock**](#c-0xb27afc7844988948fbd6210aef4e1362bc2d8e6a) — `0xf3a5AC78f47638C60117D9fA3dc7Be96625947aF` (EOA) — single key controls [PAUSE] capability. Assess custody and intent.
- 🎚️ [**Observed: 9 critical parameter levers (CRITICAL: 3, HIGH: 1, MEDIUM: 2, LOW: 2)**](#sec-critical-params) — Asset has 9 on-chain parameter levers curated as high-impact for lender-side risk. See the 🎚️ Critical Parameter Levers section for the role gate, current value, threshold, and impact of each. These are singular setters / function calls that flip risk surface in one tx — direct dilution, safety-mechanism closure, authority transfer, or oracle repointing. Verify role-gate identities and threshold distance-to-trigger against current operating posture.

### 🟠 HIGH (13)

- 💰 **Observed: 2 role(s) with supply-altering capability** — Supply-altering surface detected: `admin()` on CRV [Vyper_contract], `minter()` on CRV [Vyper_contract]. Assess each holder's custody and governance.
- ⏸️ **Observed: 4 role(s) with pause capability** — Pause surface detected: `owner()` on ProtocolController, `GUARDIAN_ROLE` on ProtocolTimelock, `PROTOCOL_CONTROLLER()` on RewardVault. Assess pause authority governance.
- 🔗 [**Observed: supply authority chain on Vyper_contract**](#c-0xd061d61a4d941c39e5453435b6345dc261c2fce0) — Chain: CurveStrategy → `MINTER()` → Vyper_contract. Controlled by: `controller()`, `token()`. Assess custody — compromise of this chain could affect root token supply.
- ⚠️ [**No Timelock in admin chain: `MINTER()` on CurveStrategy**](#c-0xb010c392f9572aeb5ea3817e94dc6745421b2bb5) — `MINTER()` has SUPPLY capability and is held by: `0xd061...fcE0` (Contract). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `minter()` on CRV [Vyper_contract]**](#c-0xd533a949740bb3306d119cc777fa900ba034cd52) — `minter()` has SUPPLY capability and is held by: `0xd061...fcE0` (Contract). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.

<details>
<summary>🔄 **7 volatile parameter(s) observed across 3 contract(s) (≥5 historical changes each)** — Operational tempo signal — high-velocity setters indicate active governance maintenance, oracle keepers, or routinely-tuned risk parameters. Expand to review each parameter's change count and current value; assess against the protocol's stated intent.</summary>

- 🔄 [**Observed: volatile parameter `registrar` on ProtocolController**](#c-0x2d8bce1fae00a959354acd9ebf9174337a64d4fb) — `setRegistrar(address registrar_, bool allowed)` changed 11 times. Current value: 9 keys · all 0 — full per-key breakdown in the Permissioned Parameters table on ProtocolController. Assess change pattern.
- 🔄 [**Observed: volatile parameter `permissionSetters` on ProtocolController**](#c-0x2d8bce1fae00a959354acd9ebf9174337a64d4fb) — `setPermissionSetter(address setter, bool allowed)` changed 6 times. Current value: 1 keys · all 0 — full per-key breakdown in the Permissioned Parameters table on ProtocolController. Assess change pattern.
- 🔄 [**Observed: volatile parameter `unpause` on ProtocolController**](#c-0x2d8bce1fae00a959354acd9ebf9174337a64d4fb) — `unpause(bytes4 protocolId)` changed 6 times. Current value: ``. Assess change pattern.
- 🔄 [**Observed: volatile parameter `setPermission` on ProtocolController**](#c-0x2d8bce1fae00a959354acd9ebf9174337a64d4fb) — `setPermission(address,address,bytes4,bool)` changed 6 times. Current value: 6 keys · all 0 — full per-key breakdown in the Permissioned Parameters table on ProtocolController. Assess change pattern.
- 🔄 [**Observed: volatile parameter `getHarvestFeePercent` on Accountant**](#c-0x93b4b9bd266ffa8af68e39edfa8cfe2a62011ce0) — `setHarvestFeePercent(uint128 newHarvestFeePercent)` changed 6 times. Current value: `1000000000000000`. Assess change pattern.
- 🔄 [**Observed: volatile parameter `getProtocolFeePercent` on Accountant**](#c-0x93b4b9bd266ffa8af68e39edfa8cfe2a62011ce0) — `setProtocolFeePercent(uint128 newProtocolFeePercent)` changed 6 times. Current value: `165000000000000000 (0.165000e18)`. Assess change pattern.
- 🔄 [**Observed: volatile parameter `strategy` on CurveYCRVVoter**](#c-0x52f541764e6e90eebc5c21ff570de0e2d63766b6) — `setStrategy(address _strategy)` changed 10 times. Current value: `0xe5d6D047DF95c6627326465cB27B64A8b77A8b91`. Assess change pattern.

</details>


### 🟢 LOW (1)

- 🟢 [**Supply authority gated by governance vote: `admin()` on CRV [Vyper_contract]**](#c-0xd533a949740bb3306d119cc777fa900ba034cd52) — `admin()` has SUPPLY capability, but its authority chain resolves to a governance-controlled aragonOS Agent (`0x4090...9968` — Curve: Ownership Agent). Supply-altering calls require an on-chain governance vote (a multi-day voting period), not a single-block transaction. No separate TimelockController is present — the voting period IS the analyst-observable buffer.

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
<a id="c-0x0c36ad1a68cdbbbfafad7d03bb97cbab24174e55"></a>
## RewardVault `0x0c36ad1a68cdbBBFafaD7d03bb97cbaB24174e55`

🔒 **Immutable References:** `strategy()` → CurveStrategy, `allocator()` → OnlyBoostAllocator, `ACCOUNTANT()` → Accountant

### 🟠 `PROTOCOL_CONTROLLER()`

**Privileged write functions:**  
**Capabilities:** ⏸️ **PAUSE**
- `deposit(uint256 assets, address receiver, address referrer)` — ////////////////////////////////////////////////////////////
- `deposit(address account, address receiver, uint256 assets, address referrer)` — ////////////////////////////////////////////////////////////
- `resumeVault()` — Resumes the vault operations Only callable by the protocol controller `[PAUSE]`

**Members (1):**

| Address | Name / Type | Risk | Granted | Source | Details |
|---|---|---|---|---|---|
| `0x2d8BcE1FaE00a959354aCD9eBf9174337A64d4fb` | ProtocolController | 🟠 HIGH | — | Storage only |  |

### 🟠 `gauge()`

**Privileged write functions:**  
**Capabilities:** ⏸️ **PAUSE**
- `deposit(uint256 assets, address receiver, address referrer)` — ////////////////////////////////////////////////////////////
- `deposit(address account, address receiver, uint256 assets, address referrer)` — ////////////////////////////////////////////////////////////
- `resumeVault()` — Resumes the vault operations Only callable by the protocol controller `[PAUSE]`

**Members (1):**

| Address | Name / Type | Risk | Granted | Source | Details |
|---|---|---|---|---|---|
| `0x8f5e52BE9B7BDe850BA13e40284F63f14677058f` | DOLA-sUSDe-gauge (LiquidityGaugeV6) | 🟠 HIGH | — | Storage only |  |

#### 🔧 Permissioned Parameters

**`resumeVault`** ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> This parameter has never been changed since deployment.

| Field | Value |
|---|---|
| Setter | `resumeVault()` |
| Gated by | `PROTOCOL_CONTROLLER(), gauge()` |
| Tags | `PAUSE` |
| Last called | — |
| Called by | — |
| Total calls | 0 ❄️ |

---
<a id="c-0xb010c392f9572aeb5ea3817e94dc6745421b2bb5"></a>
## > CurveStrategy `0xb010C392F9572aEb5Ea3817e94DC6745421b2bb5`

> 🔒 **Immutable References:** `GATEWAY()` → Gnosis Safe 1/1

### > 🟠 `ACCOUNTANT()`

> **Privileged write functions:**
> - `deposit(IAllocator.Allocation calldata allocation, HarvestPolicy policy)` — Deposits LP tokens into gauge/sidecars according to allocator's distribution Called by vault after transferring LP tokens to targets
> - `withdraw(IAllocator.Allocation calldata allocation, IStrategy.HarvestPolicy policy, address receiver)` — Withdraws LP tokens from gauge/sidecars and sends to receiver Skips withdrawal if gauge is shutdown (requires shutdown() instead)
> - `harvest(address gauge, bytes memory extraData)` — Claims rewards from gauge and sidecars (accountant batch harvest) Uses transient storage to defer reward transfers for gas efficiency
> - `flush()` — Transfers accumulated rewards to accountant after batch harvest Called once after harvesting multiple gauges to save gas

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x93b4B9bd266fFA8AF68e39EDFa8cFe2A62011Ce0` | Accountant | 🟠 HIGH | — | Storage only |  |

### > 🟠 `LOCKER()`

> **Privileged write functions:**
> - `claimExtraRewards(address gauge)` — Claims extra rewards from a Curve gauge
> - `deposit(IAllocator.Allocation calldata allocation, HarvestPolicy policy)` — Deposits LP tokens into gauge/sidecars according to allocator's distribution Called by vault after transferring LP tokens to targets
> - `withdraw(IAllocator.Allocation calldata allocation, IStrategy.HarvestPolicy policy, address receiver)` — Withdraws LP tokens from gauge/sidecars and sends to receiver Skips withdrawal if gauge is shutdown (requires shutdown() instead)
> - `harvest(address gauge, bytes memory extraData)` — Claims rewards from gauge and sidecars (accountant batch harvest) Uses transient storage to defer reward transfers for gas efficiency

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x52f541764E6e90eeBc5c21Ff570De0e2D63766B6` | CurveYCRVVoter | 🟠 HIGH | — | Storage only |  |

### > 🟠 `MINTER()`

> **Privileged write functions:**
> - `deposit(IAllocator.Allocation calldata allocation, HarvestPolicy policy)` — Deposits LP tokens into gauge/sidecars according to allocator's distribution Called by vault after transferring LP tokens to targets
> - `withdraw(IAllocator.Allocation calldata allocation, IStrategy.HarvestPolicy policy, address receiver)` — Withdraws LP tokens from gauge/sidecars and sends to receiver Skips withdrawal if gauge is shutdown (requires shutdown() instead)
> - `harvest(address gauge, bytes memory extraData)` — Claims rewards from gauge and sidecars (accountant batch harvest) Uses transient storage to defer reward transfers for gas efficiency

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xd061D61a4d941c39E5453435B6345Dc261C2fcE0` | Contract | 🟠 HIGH | — | Storage only |  |

### > 🟠 `PROTOCOL_CONTROLLER()`

> **Privileged write functions:**
> - `claimExtraRewards(address gauge)` — Claims extra rewards from a Curve gauge
> - `deposit(IAllocator.Allocation calldata allocation, HarvestPolicy policy)` — Deposits LP tokens into gauge/sidecars according to allocator's distribution Called by vault after transferring LP tokens to targets
> - `withdraw(IAllocator.Allocation calldata allocation, IStrategy.HarvestPolicy policy, address receiver)` — Withdraws LP tokens from gauge/sidecars and sends to receiver Skips withdrawal if gauge is shutdown (requires shutdown() instead)
> - `harvest(address gauge, bytes memory extraData)` — Claims rewards from gauge and sidecars (accountant batch harvest) Uses transient storage to defer reward transfers for gas efficiency

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x2d8BcE1FaE00a959354aCD9eBf9174337A64d4fb` | ProtocolController | 🟠 HIGH | — | Storage only |  |

### > 🟠 `REWARD_TOKEN()`

> **Privileged write functions:**
> - `deposit(IAllocator.Allocation calldata allocation, HarvestPolicy policy)` — Deposits LP tokens into gauge/sidecars according to allocator's distribution Called by vault after transferring LP tokens to targets
> - `withdraw(IAllocator.Allocation calldata allocation, IStrategy.HarvestPolicy policy, address receiver)` — Withdraws LP tokens from gauge/sidecars and sends to receiver Skips withdrawal if gauge is shutdown (requires shutdown() instead)
> - `harvest(address gauge, bytes memory extraData)` — Claims rewards from gauge and sidecars (accountant batch harvest) Uses transient storage to defer reward transfers for gas efficiency
> - `flush()` — Transfers accumulated rewards to accountant after batch harvest Called once after harvesting multiple gauges to save gas

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xD533a949740bb3306d119CC777fa900bA034cd52` | CRV | 🟠 HIGH | — | Storage only |  |

---
<a id="c-0x2d8bce1fae00a959354acd9ebf9174337a64d4fb"></a>
## > ProtocolController `0x2d8BcE1FaE00a959354aCD9eBf9174337A64d4fb`

> > ⚡ **Inherited authority** [PAUSE] — via `PROTOCOL_CONTROLLER()` on **RewardVault**

> ✅ **Two-step admin transfer:** `OZ Ownable2Step` — prevents accidental hand-off (request → accept flow).

### > 🟢 `owner()`

> **Privileged write functions:**  
> **Capabilities:** ⚙️ **CONFIG** ⏸️ **PAUSE**
> - `setRegistrar(address registrar_, bool allowed)` — Sets or revokes registrar permission for an address.
> - `setPermissionSetter(address setter, bool allowed)` — Sets or revokes permission setter status for an address.
> - `setPermission(address target, address caller, bytes4 selector, bool allowed)` — Sets a permission for a contract, caller, and function selector.
>   - ⚠️ *Also callable by members of `permissionSetters` mapping (dual-gate modifier)*
> - `setStrategy(bytes4 protocolId, address strategy)` — Sets a protocol strategy.
> - `setAllocator(bytes4 protocolId, address allocator)` — Sets a protocol allocator.
> - `setAccountant(bytes4 protocolId, address accountant)` — Sets a protocol accountant. Accountant is immutable once set to prevent reward accounting disruption.
> - `setFeeReceiver(bytes4 protocolId, address feeReceiver)` — Sets a protocol fee receiver. `[CONFIG]`
> - `setFactory(bytes4 protocolId, address factory)` — Sets a protocol factory.
> - `setLocker(bytes4 protocolId, address locker)` — Sets a protocol locker.
> - `setGateway(bytes4 protocolId, address gateway)` — Sets a protocol gateway
> - `registerVault(address gauge_, address vault, address asset, address rewardReceiver, bytes4 protocolId)` — Registers a vault for a gauge. Creates the association between an external gauge and our vault system.
>   - ⚠️ *Also callable by members of `registrar` mapping (dual-gate modifier)*
> - `setValidAllocationTarget(address gauge, address target)` — Whitelists an allocation target for a gauge. Strategies can only send funds to whitelisted targets for security.
>   - ⚠️ *Also callable by members of `registrar` mapping (dual-gate modifier)*
> - `removeValidAllocationTarget(address gauge, address target)` — Removes an allocation target from the whitelist. Used when a target is no longer needed or trusted.
>   - ⚠️ *Also callable by members of `registrar` mapping (dual-gate modifier)*
> - `shutdown(address gauge_)` — Emergency shutdown for a specific gauge. Prevents new deposits while allowing withdrawals for user fund recovery. `[PAUSE]`
> - `unshutdown(address gauge_)` — Unshuts down a gauge. Allows a previously shutdown gauge to resume operations.
> - `pause(bytes4 protocolId)` — Pauses deposits for a specific protocol. Withdrawals remain functional during pause. `[PAUSE]`
> - `unpause(bytes4 protocolId)` — Unpauses deposits for a specific protocol. `[PAUSE]`
> - `transferOwnership(address newOwner)` — Starts the ownership transfer of the contract to a new account. Replaces the pending transfer if there is one. Can only be called by the current owner.
> - `renounceOwnership()` — Leaves the contract without owner. It will not be possible to call `onlyOwner` functions. Can only be called by the current owner.
> - `acceptOwnership()` — Second step of `OZ Ownable2Step` — callable by the pending holder set via `transferOwnership`, not by the current role. Included here to surface the full transfer handoff. `[CONFIG]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xb27afc7844988948FBd6210AeF4E1362bC2d8E6a` | TimelockController (2d) | 🟢 LOW | — | Storage+Events | 2d delay (⚠ changed 1x) |


> **Delay history for `TimelockController (2d)` (0xb27a...8E6a):** 2d → 2d

### > 🟢 `pendingOwner()`


> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xb27afc7844988948FBd6210AeF4E1362bC2d8E6a` | TimelockController (2d) | 🟢 LOW | — | Events only | 2d delay (⚠ changed 1x) |


> **Delay history for `TimelockController (2d)` (0xb27a...8E6a):** 2d → 2d

> #### 🔧 Permissioned Parameters

> **`isValidAllocationTarget`** *(per-asset)* ❄️ **DORMANT** 🔴 **SILENT** *(no event)* 🪞 **DECORATIVE**

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > 🪞 **Decorative state** — writes to mapping `_isValidAllocationTargets` which is read only by an external view-fn getter; no in-scope `require` / `if` / function-body reads gate logic on this value. Severity grade reflects function signature, not consumption pattern.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Setter | `setValidAllocationTarget(address gauge, address target)` |
> | Gated by | `owner()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

> **`pause`**

> | Field | Value |
> |---|---|
> | Setter | `pause(bytes4 protocolId)` |
> | Gated by | `owner()` |
> | Tags | `PAUSE` |
> | Last called | 2025-08-26 |
> | Called by | `0x0007...ff62` |
> | Total calls | 1 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `90048930453244945537516081201650314051182950674274211470581517268792347983872` | `0x0007...ff62` | 2025-08-26 |

> **`permissionSetters`** *(per-asset)* 🔄 **ACTIVE** (6 changes)

> > ⚠️ This parameter has been changed **6 times** — monitor for unexpected modifications.

> | Asset | Current Value |
> |---|---|
> | Gnosis Safe 3/5 `0xB055...C765` | `True` |

> | Field | Value |
> |---|---|
> | Setter | `setPermissionSetter(address setter, bool allowed)` |
> | Gated by | `owner()` |
> | Tags | — |
> | Last changed | 2025-10-27 |
> | Changed by | `0xB055...C765` (Gnosis Safe 3/5) |
> | Total changes | 6 🔄 |

> **Recent changes (showing last 5 of 6):**

> | # | Asset | Value | Set By | Date |
> |---|---|---|---|---|
> | 1 | Gnosis Safe 3/5 | `allowed=True` | `0xB055...C765` (Gnosis Safe 3/5) | 2025-10-27 |
> | 2 | Gnosis Safe 3/5 | `allowed=True` | `0xB055...C765` (Gnosis Safe 3/5) | 2025-10-27 |
> | 3 | Gnosis Safe 3/5 | `allowed=True` | `0xB055...C765` (Gnosis Safe 3/5) | 2025-10-27 |
> | 4 | Gnosis Safe 3/5 | `allowed=True` | `0xB055...C765` (Gnosis Safe 3/5) | 2025-10-27 |
> | 5 | Gnosis Safe 3/5 | `allowed=True` | `0xB055...C765` (Gnosis Safe 3/5) | 2025-10-27 |

> **`registrar`** *(per-asset)* 🔄 **ACTIVE** (11 changes)

> > ⚠️ This parameter has been changed **11 times** — monitor for unexpected modifications.

> | Asset | Current Value |
> |---|---|
> | BalancerFactory `0x1A77...D81D` | `False` |
> | BalancerFactory `0x2Aa1...A99b` | `True` |
> | RewardReceiverMigrationModule `0x2C04...fd46` | `True` |
> | CurveFactory `0x37B0...6003` | `False` |
> | BalancerFactory `0x44a7...4AD8` | `False` |
> | AuraSidecarFactory `0x5db4...2505` | `True` |
> | ConvexSidecarFactory `0x6DFA...F9E7` | `True` |
> | ConvexSidecarFactory `0x7Fa7...C592` | `False` |
> | CurveFactory `0xEf9b...7FE1` | `True` |

> | Field | Value |
> |---|---|
> | Setter | `setRegistrar(address registrar_, bool allowed)` |
> | Gated by | `owner()` |
> | Tags | — |
> | Last changed | 2026-02-23 |
> | Changed by | `0xB055...C765` (Gnosis Safe 3/5) |
> | Total changes | 11 🔄 |

> **Recent changes (showing last 5 of 11):**

> | # | Asset | Value | Set By | Date |
> |---|---|---|---|---|
> | 1 | BalancerFactory | `allowed=False` | `0xB055...C765` (Gnosis Safe 3/5) | 2026-02-23 |
> | 2 | BalancerFactory | `allowed=True` | `0xB055...C765` (Gnosis Safe 3/5) | 2026-02-23 |
> | 3 | AuraSidecarFactory | `allowed=True` | `0xB055...C765` (Gnosis Safe 3/5) | 2026-01-06 |
> | 4 | BalancerFactory | `allowed=True` | `0xB055...C765` (Gnosis Safe 3/5) | 2026-01-06 |
> | 5 | ConvexSidecarFactory | `allowed=True` | `0xB055...C765` (Gnosis Safe 3/5) | 2025-10-27 |

> **`rewardReceiver`**

> | Field | Value |
> |---|---|
> | Setter | `setFeeReceiver(bytes4 protocolId, address feeReceiver)` |
> | Gated by | `owner()` |
> | Tags | `CONFIG` |
> | Last changed | 2026-01-06 |
> | Changed by | `0xB055...C765` (Gnosis Safe 3/5) |
> | Total changes | 2 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `protocolId=0xb774acb8 · feeReceiver=0x9EBBb3d59d53D6aD3FA5464f36c2E84aBb7cf5c1` | `0xB055...C765` (Gnosis Safe 3/5) | 2026-01-06 |
> | 2 | `protocolId=0xc715e373 · feeReceiver=0x60136fefE23D269aF41aB72DE483D186dC4318D6` | `0x0007...ff62` | 2025-08-26 |

> **`setPermission`** *(per-asset)* 🔄 **ACTIVE** (6 changes)

> > ⚠️ This parameter has been changed **6 times** — monitor for unexpected modifications.

> | Asset | Current Value |
> |---|---|
> | target=0x3680cce0… · caller=CurveYCRVVoter 0x52f5…66B6 · selector=0xcec15175 | `True (set 2025-11-07)` |
> | target=0x3680cce0… · caller=Gnosis Safe 3/5 0xB055…C765 · selector=0x1fc822b1 | `True (set 2025-11-07)` |
> | target=0x3680cce0… · caller=Gnosis Safe 3/5 0xB055…C765 · selector=0xe1189db8 | `True (set 2025-11-10)` |
> | target=0x9a207a85… · caller=0xdbd24b09… · selector=0x44471415 | `True (set 2025-10-27)` |
> | target=0x9a207a85… · caller=0xdbd24b09… · selector=0xa601f747 | `True (set 2025-10-28)` |
> | target=Accountant 0x93b4…1ce0 · caller=0xc3a6cfc4… · selector=0xe84f9836 | `True (set 2025-08-28)` |

> | Field | Value |
> |---|---|
> | Setter | `setPermission(address,address,bytes4,bool)` |
> | Gated by | `owner()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 6 🔄 |

> **`shutdown`** *(per-asset)* ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Setter | `shutdown(address gauge_)` |
> | Gated by | `owner()` |
> | Tags | `PAUSE` |
> | Last called | — |
> | Called by | — |
> | Total calls | 0 ❄️ |

> **`unpause`** 🔄 **ACTIVE** (6 changes)

> > ⚠️ This parameter has been changed **6 times** — monitor for unexpected modifications.

> | Field | Value |
> |---|---|
> | Setter | `unpause(bytes4 protocolId)` |
> | Gated by | `owner()` |
> | Tags | `PAUSE` |
> | Last called | 2025-08-27 |
> | Called by | `0xB055...C765` (Gnosis Safe 3/5) |
> | Total calls | 6 🔄 |

> **Recent changes (showing last 5 of 6):**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `protocolId=0xc715e373` | `0xB055...C765` (Gnosis Safe 3/5) | 2025-08-27 |
> | 2 | `protocolId=0xc715e373` | `0xB055...C765` (Gnosis Safe 3/5) | 2025-08-27 |
> | 3 | `protocolId=0xc715e373` | `0xB055...C765` (Gnosis Safe 3/5) | 2025-08-27 |
> | 4 | `protocolId=0xc715e373` | `0xB055...C765` (Gnosis Safe 3/5) | 2025-08-27 |
> | 5 | `protocolId=0xc715e373` | `0xB055...C765` (Gnosis Safe 3/5) | 2025-08-27 |

---
<a id="c-0xc0238579e281dae9403b7a3c1d22a14d61d7de69"></a>
## > OnlyBoostAllocator `0xC0238579E281DaE9403B7A3c1D22a14D61D7De69`

> 🔒 **Immutable References:** `SIDECAR_BOOST_HOLDER()` → CurveVoterProxy, `PROTOCOL_CONTROLLER()` → ProtocolController, `GATEWAY()` → Gnosis Safe 1/1, `BOOST_PROVIDER()` → veBoost (Boost Delegation V3), `GAUGE_CONTROLLER()` → Contract, `LOCKER()` → CurveYCRVVoter

### > 🟠 `SIDECAR_FACTORY()`

> **Privileged write functions:**
> - `setGaugeWeights(address gauge, uint256 lockerWeight)` — Sets manual allocation weights for a gauge, overriding automated boost logic.

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x6DFA6232eC23E029d4322115f491a912De9cF9E7` | ConvexSidecarFactory | 🟠 HIGH | — | Storage only |  |

---
<a id="c-0x8f5e52be9b7bde850ba13e40284f63f14677058f"></a>
## > LiquidityGaugeV6 `0x8f5e52BE9B7BDe850BA13e40284F63f14677058f`

> > ⚡ **Inherited authority** [PAUSE] — via `gauge()` on **RewardVault**

> 🔒 **Immutable References:** `lp_token()` → DOLA-sUSDe (CurveStableSwapNG)

### > 🔴 `manager()`

> **Privileged write functions:**
> - `set_gauge_manager(address _gauge_manager)` — @notice Change the gauge manager for a gauge
> - `add_reward(address _reward_token, address _distributor)` — @notice Add additional rewards to be distributed to stakers
> - `set_reward_distributor(address _reward_token, address _distributor)` — @notice Reassign the reward distributor for a reward token

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xEC092c15e8D5A48a77Cde36827F8e228CE39471a` | EOA | 🔴 CRITICAL | — | Storage only | ⚠️ Single private key |

---
<a id="c-0x93b4b9bd266ffa8af68e39edfa8cfe2a62011ce0"></a>
## > Accountant `0x93b4B9bd266fFA8AF68e39EDFa8cFe2A62011Ce0`

> ✅ **Two-step admin transfer:** `OZ Ownable2Step` — prevents accidental hand-off (request → accept flow).

### > 🟢 `owner()`

> **Privileged write functions:**  
> **Capabilities:** ⚙️ **CONFIG**
> - `setHarvestFeePercent(uint128 newHarvestFeePercent)` — Updates the harvest fee percentage.
> - `setProtocolFeePercent(uint128 newProtocolFeePercent)` — Updates the protocol fee percentage. `[CONFIG]`
> - `transferOwnership(address newOwner)` — Starts the ownership transfer of the contract to a new account. Replaces the pending transfer if there is one. Can only be called by the current owner.
> - `renounceOwnership()` — Leaves the contract without owner. It will not be possible to call `onlyOwner` functions. Can only be called by the current owner.
> - `acceptOwnership()` — Second step of `OZ Ownable2Step` — callable by the pending holder set via `transferOwnership`, not by the current role. Included here to surface the full transfer handoff. `[CONFIG]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xe5d6D047DF95c6627326465cB27B64A8b77A8b91` | Gnosis Safe 1/1 | 🟢 LOW | — | Storage+Events | 1/1 signers |

> **Signers of `Gnosis Safe 1/1` (0xe5d6...8b91):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0xb27afc7844988948FBd6210AeF4E1362bC2d8E6a` | TimelockController (2d) | 2025-10-10 | 🟢 LOW |

> **Module history:**
>   - 2025-08-26: ➕ enabled module `0x37B015FA4Ba976c57E8e3A0084288d9DcEA06003`
>   - 2025-08-26: ➕ enabled module `0x7D0775442d5961AE7090e4EC6C76180e8EEeEf54`
>   - 2025-09-10: ➕ enabled module `0xb118fbE8B01dB24EdE7E87DFD19693cfca13e992`
>   - 2025-09-26: ➕ enabled module `0x11F78501e6b0cbc5DE4c7e6BBabaACdb973eb4Cd`
>   - 2025-10-10: ➕ enabled module `0xa50CB9dFFcc740EE6b6f2D4B3CBc3a876b28c335`
>   - 2025-10-27: ➖ disabled module `0x7D0775442d5961AE7090e4EC6C76180e8EEeEf54`
>   - 2025-10-27: ➕ enabled module `0x9306EB2C5210085dba34d61F0A911Fa9876962e7`
>   - 2025-10-27: ➖ disabled module `0x37B015FA4Ba976c57E8e3A0084288d9DcEA06003`
>   - 2025-10-27: ➕ enabled module `0xEf9bef9AB7b578eb0654F0cD2C75519c9A3f7FE1`
>   - 2025-10-27: ➕ enabled module `0x2C043dD5aDEE81c93A5B5C2CCda00DE9c4Cbfd46`
>   - 2026-01-14: ➖ disabled module `0x9306EB2C5210085dba34d61F0A911Fa9876962e7`
>   - 2026-01-14: ➕ enabled module `0xb010C392F9572aEb5Ea3817e94DC6745421b2bb5`

> **Enabled modules:**
>   - `0xb010C392F9572aEb5Ea3817e94DC6745421b2bb5` — CurveStrategy
>   - `0x2C043dD5aDEE81c93A5B5C2CCda00DE9c4Cbfd46` — RewardReceiverMigrationModule
>   - `0xEf9bef9AB7b578eb0654F0cD2C75519c9A3f7FE1` — CurveFactory
>   - `0xa50CB9dFFcc740EE6b6f2D4B3CBc3a876b28c335` — CurveDepositor
>   - `0x11F78501e6b0cbc5DE4c7e6BBabaACdb973eb4Cd` — CurveAccumulator
>   - `0xb118fbE8B01dB24EdE7E87DFD19693cfca13e992` — CurveVoter

### > 🟠 `PROTOCOL_CONTROLLER()`

> **Privileged write functions:**
> - `harvest(address[] calldata _gauges, bytes[] calldata _harvestData, address _receiver)` — Harvests rewards from multiple gauges and distributes them to vaults. Called by harvesters to claim rewards from external protocols and update integrals.
> - `claim(address[] calldata _gauges, bytes[] calldata harvestData, address receiver)` — Claims rewards from multiple vaults for the caller. In CHECKPOINT mode, can claim if rewards are available in the contract.
> - `claim(address[] calldata _gauges, address account, bytes[] calldata harvestData, address receiver)` — Claims rewards from multiple vaults for the caller. In CHECKPOINT mode, can claim if rewards are available in the contract.

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x2d8BcE1FaE00a959354aCD9eBf9174337A64d4fb` | ProtocolController | 🟠 HIGH | — | Storage only |  |

### > 🟠 `REWARD_TOKEN()`

> **Privileged write functions:**
> - `harvest(address[] calldata _gauges, bytes[] calldata _harvestData, address _receiver)` — Harvests rewards from multiple gauges and distributes them to vaults. Called by harvesters to claim rewards from external protocols and update integrals.
> - `claim(address[] calldata _gauges, bytes[] calldata harvestData, address receiver)` — Claims rewards from multiple vaults for the caller. In CHECKPOINT mode, can claim if rewards are available in the contract.
> - `claim(address[] calldata _gauges, address account, bytes[] calldata harvestData, address receiver)` — Claims rewards from multiple vaults for the caller. In CHECKPOINT mode, can claim if rewards are available in the contract.

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xD533a949740bb3306d119CC777fa900bA034cd52` | CRV | 🟠 HIGH | — | Storage only |  |

### > 🟢 `pendingOwner()`


> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xe5d6D047DF95c6627326465cB27B64A8b77A8b91` | Gnosis Safe 1/1 | 🟢 LOW | — | Events only | 1/1 signers |

> **Signers of `Gnosis Safe 1/1` (0xe5d6...8b91):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0xb27afc7844988948FBd6210AeF4E1362bC2d8E6a` | TimelockController (2d) | 2025-10-10 | 🟢 LOW |

> **Module history:**
>   - 2025-08-26: ➕ enabled module `0x37B015FA4Ba976c57E8e3A0084288d9DcEA06003`
>   - 2025-08-26: ➕ enabled module `0x7D0775442d5961AE7090e4EC6C76180e8EEeEf54`
>   - 2025-09-10: ➕ enabled module `0xb118fbE8B01dB24EdE7E87DFD19693cfca13e992`
>   - 2025-09-26: ➕ enabled module `0x11F78501e6b0cbc5DE4c7e6BBabaACdb973eb4Cd`
>   - 2025-10-10: ➕ enabled module `0xa50CB9dFFcc740EE6b6f2D4B3CBc3a876b28c335`
>   - 2025-10-27: ➖ disabled module `0x7D0775442d5961AE7090e4EC6C76180e8EEeEf54`
>   - 2025-10-27: ➕ enabled module `0x9306EB2C5210085dba34d61F0A911Fa9876962e7`
>   - 2025-10-27: ➖ disabled module `0x37B015FA4Ba976c57E8e3A0084288d9DcEA06003`
>   - 2025-10-27: ➕ enabled module `0xEf9bef9AB7b578eb0654F0cD2C75519c9A3f7FE1`
>   - 2025-10-27: ➕ enabled module `0x2C043dD5aDEE81c93A5B5C2CCda00DE9c4Cbfd46`
>   - 2026-01-14: ➖ disabled module `0x9306EB2C5210085dba34d61F0A911Fa9876962e7`
>   - 2026-01-14: ➕ enabled module `0xb010C392F9572aEb5Ea3817e94DC6745421b2bb5`

> **Enabled modules:**
>   - `0xb010C392F9572aEb5Ea3817e94DC6745421b2bb5` — CurveStrategy
>   - `0x2C043dD5aDEE81c93A5B5C2CCda00DE9c4Cbfd46` — RewardReceiverMigrationModule
>   - `0xEf9bef9AB7b578eb0654F0cD2C75519c9A3f7FE1` — CurveFactory
>   - `0xa50CB9dFFcc740EE6b6f2D4B3CBc3a876b28c335` — CurveDepositor
>   - `0x11F78501e6b0cbc5DE4c7e6BBabaACdb973eb4Cd` — CurveAccumulator
>   - `0xb118fbE8B01dB24EdE7E87DFD19693cfca13e992` — CurveVoter

> #### 🔧 Permissioned Parameters

> **`getHarvestFeePercent`** 🔄 **ACTIVE** (6 changes)

> > ⚠️ This parameter has been changed **6 times** — monitor for unexpected modifications.

> | Field | Value |
> |---|---|
> | Current Value | `1000000000000000` |
> | Setter | `setHarvestFeePercent(uint128 newHarvestFeePercent)` |
> | Gated by | `owner()` |
> | Tags | — |
> | Last changed | 2026-01-16 |
> | Changed by | `0x20aC...3D2e` (EOA) |
> | Total changes | 6 🔄 |

> **Recent changes (showing last 5 of 6):**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `5000000000000000 (0.005000e18)` | `0x20aC...3D2e` (EOA) | 2026-01-16 |
> | 2 | `newHarvestFeePercent=5000000000000000 (0.005000e18)` | `0xe5d6...8b91` (Gnosis Safe 1/1) | 2025-09-02 |
> | 3 | `newHarvestFeePercent=5000000000000000 (0.005000e18)` | `0xe5d6...8b91` (Gnosis Safe 1/1) | 2025-09-02 |
> | 4 | `newHarvestFeePercent=5000000000000000 (0.005000e18)` | `0xe5d6...8b91` (Gnosis Safe 1/1) | 2025-09-02 |
> | 5 | `newHarvestFeePercent=5000000000000000 (0.005000e18)` | `0xe5d6...8b91` (Gnosis Safe 1/1) | 2025-09-02 |

> **`getProtocolFeePercent`** 🔄 **ACTIVE** (6 changes)

> > ⚠️ This parameter has been changed **6 times** — monitor for unexpected modifications.

> | Field | Value |
> |---|---|
> | Current Value | `165000000000000000 (0.165000e18)` |
> | Setter | `setProtocolFeePercent(uint128 newProtocolFeePercent)` |
> | Gated by | `owner()` |
> | Tags | `CONFIG` |
> | Last changed | 2025-09-05 |
> | Changed by | `0xe5d6...8b91` (Gnosis Safe 1/1) |
> | Total changes | 6 🔄 |

> **Recent changes (showing last 5 of 6):**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `newProtocolFeePercent=165000000000000000 (0.165000e18)` | `0xe5d6...8b91` (Gnosis Safe 1/1) | 2025-09-05 |
> | 2 | `newProtocolFeePercent=165000000000000000 (0.165000e18)` | `0xe5d6...8b91` (Gnosis Safe 1/1) | 2025-09-05 |
> | 3 | `newProtocolFeePercent=165000000000000000 (0.165000e18)` | `0xe5d6...8b91` (Gnosis Safe 1/1) | 2025-09-05 |
> | 4 | `newProtocolFeePercent=165000000000000000 (0.165000e18)` | `0xe5d6...8b91` (Gnosis Safe 1/1) | 2025-09-05 |
> | 5 | `newProtocolFeePercent=165000000000000000 (0.165000e18)` | `0xe5d6...8b91` (Gnosis Safe 1/1) | 2025-09-05 |

> **`MAX_FEE_PERCENT`** 🔒 **IMMUTABLE**

> > 🔒 **Immutable** — declared as a constant in the contract source; cannot be changed without a contract upgrade. Bounds the reachable extreme of any setter that writes a related storage variable.

> | Field | Value |
> |---|---|
> | Current Value | `400000000000000000 (0.400000e18)` |
> | Mutability | 🔒 immutable (constant) |
> | Tags | `IMMUTABLE` |

> **`MIN_MEANINGFUL_REWARDS`** 🔒 **IMMUTABLE**

> > 🔒 **Immutable** — declared as a constant in the contract source; cannot be changed without a contract upgrade. Bounds the reachable extreme of any setter that writes a related storage variable.

> | Field | Value |
> |---|---|
> | Current Value | `1000000000000000000 (1.000000e18)` |
> | Mutability | 🔒 immutable (constant) |
> | Tags | `IMMUTABLE` |

---
<a id="c-0xd061d61a4d941c39e5453435b6345dc261c2fce0"></a>
## > Vyper_contract `0xd061D61a4d941c39E5453435B6345Dc261C2fcE0`

> > 💰 **Inherited supply authority** — holds `MINTER()` on **CurveStrategy**. Access controls on this contract gate root token supply.

> 🔒 **Immutable References:** `token()` → CRV

### > 🟠 `controller()`


> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x2F50D538606Fa9EDD2B11E2446BEb18C9D5846bB` | Contract | 🟠 HIGH | — | Storage only |  |

---
<a id="c-0xd533a949740bb3306d119cc777fa900ba034cd52"></a>
## > CRV [Vyper_contract] `0xD533a949740bb3306d119CC777fa900bA034cd52`

### > 🟢 `admin()`

> **Privileged write functions:**  
> **Capabilities:** ⚙️ **CONFIG** 💰 **SUPPLY**
> - `set_minter(address _minter)` — @notice Set the minter address `[SUPPLY]`
> - `set_admin(address _admin)` — @notice Set the new admin. `[CONFIG]`
> - `set_name(string _name, string _symbol)` — @notice Change the token name and symbol to `_name` and `_symbol`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x40907540d8a6C65c637785e8f8B742ae6b0b9968` | Curve: Ownership Agent | 🟢 LOW | — | Storage+Events |  |

### > 🟠 `minter()`

> **Privileged write functions:**  
> **Capabilities:** 💰 **SUPPLY**
> - `mint(address _to, uint256 _value)` — @notice Mint `_value` tokens and assign them to `_to` `[SUPPLY]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xd061D61a4d941c39E5453435B6345Dc261C2fcE0` | Contract | 🟠 HIGH | — | Storage+Events |  |

> #### 🔧 Permissioned Parameters

> **`admin`** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> | Field | Value |
> |---|---|
> | Current Value | `0x40907540d8a6C65c637785e8f8B742ae6b0b9968` |
> | Setter | `set_admin(address _admin)` |
> | Gated by | `admin()` |
> | Tags | `CONFIG` |
> | Last changed | 2020-08-13 |
> | Changed by | `0xc4AD...7Be4` |
> | Total changes | 1 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `0x40907540d8a6C65c637785e8f8B742ae6b0b9968` | `0xc4AD...7Be4` | 2020-08-13 |

> **`minter`** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> | Field | Value |
> |---|---|
> | Current Value | `0xd061D61a4d941c39E5453435B6345Dc261C2fcE0` |
> | Setter | `set_minter(address _minter)` |
> | Gated by | `admin()` |
> | Tags | `SUPPLY` |
> | Last changed | 2020-08-12 |
> | Changed by | `0xc4AD...7Be4` |
> | Total changes | 1 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `0xd061D61a4d941c39E5453435B6345Dc261C2fcE0` | `0xc4AD...7Be4` | 2020-08-12 |

> #### 💰 Supply Actions

> _Mint / redeem / burn call tracking — last 5 calls per function, total counts preserved._

> **`mint`** *(per-asset)* ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Setter | `mint(address _to, uint256 _value)` |
> | Gated by | `minter()` |
> | Tags | `SUPPLY` |
> | Last called | — |
> | Called by | — |
> | Total calls | 0 ❄️ |

---
<a id="c-0x52f541764e6e90eebc5c21ff570de0e2d63766b6"></a>
## > CurveYCRVVoter `0x52f541764E6e90eeBc5c21Ff570De0e2D63766B6`

> 🔒 **Immutable References:** `escrow()` → veCRV, `pool()` → Contract, `want()` → yDAI+yUSDC+yUSDT+yTUSD, `mintr()` → Contract, `crv()` → CRV

### > 🟢 `governance()`

> **Privileged write functions:**
> - `setStrategy(address _strategy)`
> - `createLock(uint256 _value, uint256 _unlockTime)`
> - `increaseAmount(uint256 _value)`
> - `release()`
> - `setGovernance(address _governance)`
> - `execute(address to, uint256 value, bytes calldata data)`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xe5d6D047DF95c6627326465cB27B64A8b77A8b91` | Gnosis Safe 1/1 | 🟢 LOW | — | Storage only | 1/1 signers |

> **Signers of `Gnosis Safe 1/1` (0xe5d6...8b91):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0xb27afc7844988948FBd6210AeF4E1362bC2d8E6a` | TimelockController (2d) | 2025-10-10 | 🟢 LOW |

> **Module history:**
>   - 2025-08-26: ➕ enabled module `0x37B015FA4Ba976c57E8e3A0084288d9DcEA06003`
>   - 2025-08-26: ➕ enabled module `0x7D0775442d5961AE7090e4EC6C76180e8EEeEf54`
>   - 2025-09-10: ➕ enabled module `0xb118fbE8B01dB24EdE7E87DFD19693cfca13e992`
>   - 2025-09-26: ➕ enabled module `0x11F78501e6b0cbc5DE4c7e6BBabaACdb973eb4Cd`
>   - 2025-10-10: ➕ enabled module `0xa50CB9dFFcc740EE6b6f2D4B3CBc3a876b28c335`
>   - 2025-10-27: ➖ disabled module `0x7D0775442d5961AE7090e4EC6C76180e8EEeEf54`
>   - 2025-10-27: ➕ enabled module `0x9306EB2C5210085dba34d61F0A911Fa9876962e7`
>   - 2025-10-27: ➖ disabled module `0x37B015FA4Ba976c57E8e3A0084288d9DcEA06003`
>   - 2025-10-27: ➕ enabled module `0xEf9bef9AB7b578eb0654F0cD2C75519c9A3f7FE1`
>   - 2025-10-27: ➕ enabled module `0x2C043dD5aDEE81c93A5B5C2CCda00DE9c4Cbfd46`
>   - 2026-01-14: ➖ disabled module `0x9306EB2C5210085dba34d61F0A911Fa9876962e7`
>   - 2026-01-14: ➕ enabled module `0xb010C392F9572aEb5Ea3817e94DC6745421b2bb5`

> **Enabled modules:**
>   - `0xb010C392F9572aEb5Ea3817e94DC6745421b2bb5` — CurveStrategy
>   - `0x2C043dD5aDEE81c93A5B5C2CCda00DE9c4Cbfd46` — RewardReceiverMigrationModule
>   - `0xEf9bef9AB7b578eb0654F0cD2C75519c9A3f7FE1` — CurveFactory
>   - `0xa50CB9dFFcc740EE6b6f2D4B3CBc3a876b28c335` — CurveDepositor
>   - `0x11F78501e6b0cbc5DE4c7e6BBabaACdb973eb4Cd` — CurveAccumulator
>   - `0xb118fbE8B01dB24EdE7E87DFD19693cfca13e992` — CurveVoter

### > 🟢 `strategy()`

> **Privileged write functions:**
> - `withdraw(IERC20 _asset)`
> - `withdraw(uint256 _amount)`
> - `withdrawAll()`
> - `createLock(uint256 _value, uint256 _unlockTime)`
> - `increaseAmount(uint256 _value)`
> - `release()`
> - `execute(address to, uint256 value, bytes calldata data)`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xe5d6D047DF95c6627326465cB27B64A8b77A8b91` | Gnosis Safe 1/1 | 🟢 LOW | — | Storage only | 1/1 signers |

> **Signers of `Gnosis Safe 1/1` (0xe5d6...8b91):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0xb27afc7844988948FBd6210AeF4E1362bC2d8E6a` | TimelockController (2d) | 2025-10-10 | 🟢 LOW |

> **Module history:**
>   - 2025-08-26: ➕ enabled module `0x37B015FA4Ba976c57E8e3A0084288d9DcEA06003`
>   - 2025-08-26: ➕ enabled module `0x7D0775442d5961AE7090e4EC6C76180e8EEeEf54`
>   - 2025-09-10: ➕ enabled module `0xb118fbE8B01dB24EdE7E87DFD19693cfca13e992`
>   - 2025-09-26: ➕ enabled module `0x11F78501e6b0cbc5DE4c7e6BBabaACdb973eb4Cd`
>   - 2025-10-10: ➕ enabled module `0xa50CB9dFFcc740EE6b6f2D4B3CBc3a876b28c335`
>   - 2025-10-27: ➖ disabled module `0x7D0775442d5961AE7090e4EC6C76180e8EEeEf54`
>   - 2025-10-27: ➕ enabled module `0x9306EB2C5210085dba34d61F0A911Fa9876962e7`
>   - 2025-10-27: ➖ disabled module `0x37B015FA4Ba976c57E8e3A0084288d9DcEA06003`
>   - 2025-10-27: ➕ enabled module `0xEf9bef9AB7b578eb0654F0cD2C75519c9A3f7FE1`
>   - 2025-10-27: ➕ enabled module `0x2C043dD5aDEE81c93A5B5C2CCda00DE9c4Cbfd46`
>   - 2026-01-14: ➖ disabled module `0x9306EB2C5210085dba34d61F0A911Fa9876962e7`
>   - 2026-01-14: ➕ enabled module `0xb010C392F9572aEb5Ea3817e94DC6745421b2bb5`

> **Enabled modules:**
>   - `0xb010C392F9572aEb5Ea3817e94DC6745421b2bb5` — CurveStrategy
>   - `0x2C043dD5aDEE81c93A5B5C2CCda00DE9c4Cbfd46` — RewardReceiverMigrationModule
>   - `0xEf9bef9AB7b578eb0654F0cD2C75519c9A3f7FE1` — CurveFactory
>   - `0xa50CB9dFFcc740EE6b6f2D4B3CBc3a876b28c335` — CurveDepositor
>   - `0x11F78501e6b0cbc5DE4c7e6BBabaACdb973eb4Cd` — CurveAccumulator
>   - `0xb118fbE8B01dB24EdE7E87DFD19693cfca13e992` — CurveVoter

> #### 🔧 Permissioned Parameters

> **`governance`** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> | Field | Value |
> |---|---|
> | Current Value | `0xe5d6D047DF95c6627326465cB27B64A8b77A8b91` |
> | Setter | `setGovernance(address _governance)` |
> | Gated by | `governance()` |
> | Tags | — |
> | Last changed | 2021-01-20 |
> | Changed by | `0xb36a...875f` |
> | Total changes | 1 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `0xF930EBBd05eF8b25B1797b9b2109DDC9B0d43063` | `0xb36a...875f` | 2021-01-20 |

> **`strategy`** 🔄 **ACTIVE** (10 changes)

> > ⚠️ This parameter has been changed **10 times** — monitor for unexpected modifications.

> | Field | Value |
> |---|---|
> | Current Value | `0xe5d6D047DF95c6627326465cB27B64A8b77A8b91` |
> | Setter | `setStrategy(address _strategy)` |
> | Gated by | `governance()` |
> | Tags | — |
> | Last changed | 2025-09-19 |
> | Changed by | `0xe5d6...8b91` (Gnosis Safe 1/1) |
> | Total changes | 10 🔄 |

> **Recent changes (showing last 5 of 10):**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `_strategy=0xe5d6D047DF95c6627326465cB27B64A8b77A8b91` | `0xe5d6...8b91` (Gnosis Safe 1/1) | 2025-09-19 |
> | 2 | `_strategy=0x69D61428d089C2F35Bf6a472F540D0F82D1EA2cd` | `0xe5d6...8b91` (Gnosis Safe 1/1) | 2025-09-19 |
> | 3 | `_strategy=0xe5d6D047DF95c6627326465cB27B64A8b77A8b91` | `0xe5d6...8b91` (Gnosis Safe 1/1) | 2025-09-13 |
> | 4 | `_strategy=0x69D61428d089C2F35Bf6a472F540D0F82D1EA2cd` | `0xe5d6...8b91` (Gnosis Safe 1/1) | 2025-09-13 |
> | 5 | `_strategy=0xe5d6D047DF95c6627326465cB27B64A8b77A8b91` | `0xe5d6...8b91` (Gnosis Safe 1/1) | 2025-09-08 |

---
<a id="c-0xb27afc7844988948fbd6210aef4e1362bc2d8e6a"></a>
## > ProtocolTimelock `0xb27afc7844988948FBd6210AeF4E1362bC2d8E6a`

> > ⚡ **Inherited authority** [CONFIG, PAUSE] — via `owner()` on **ProtocolController**

> 🔒 **Immutable References:** `protocolController()` → ProtocolController

### > 🟢 `DEFAULT_ADMIN_ROLE`

> **Hash:** `0x0000000000000000000000000000000000000000000000000000000000000000`  
> **Managed by:** `DEFAULT_ADMIN_ROLE`  
> **Privileged write functions:**
> - `initialize()` — Initializes the timelock by accepting ownership of the protocol controller. Only callable by addresses with DEFAULT_ADMIN_ROLE. Requires the protocol controller to be owned by the timelock.
> - `addGuardian(address guardian)` — Adds a new guardian address. Only callable by addresses with DEFAULT_ADMIN_ROLE. Guardians can execute emergency security functions immediately without timelock delay.
> - `removeGuardian(address guardian)` — Removes a guardian address. Only callable by addresses with DEFAULT_ADMIN_ROLE.

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xb27afc7844988948FBd6210AeF4E1362bC2d8E6a` | TimelockController (2d) | 🟢 LOW | 2025-10-09 | Events only · hasRole ✓ | 2d delay (⚠ changed 1x) |

> **🕘 Previous Holders (1)** _(verified inactive — `hasRole`/`is` returned false)_:

> | Address | Name / Type | Granted | Status |
> |---|---|---|---|
> | `0xB0552b6860CE5C0202976Db056b5e3Cc4f9CC765` | Gnosis Safe 3/5 | 2025-10-09 | 🕘 HISTORICAL |


> **Delay history for `TimelockController (2d)` (0xb27a...8E6a):** 2d → 2d

### > 🔴 `GUARDIAN_ROLE`

> **Hash:** `0x55435dd261a4b9b3364963f7738a7a662ad9c84396d64be3365284bb7f0a5041`  
> **Managed by:** `DEFAULT_ADMIN_ROLE`  
> **Privileged write functions:**  
> **Capabilities:** ⏸️ **PAUSE**
> - `pause(bytes4 protocolId)` — Immediately pauses deposits for a specific protocol. Only callable by addresses with GUARDIAN_ROLE. This function bypasses the timelock delay for emergency response. Withdrawals remain functional during pause to protect user funds. Directly calls ProtocolController.pause(protocolId). `[PAUSE]`
> - `unpause(bytes4 protocolId)` — Immediately unpauses deposits for a specific protocol. Only callable by addresses with GUARDIAN_ROLE. This function bypasses the timelock delay for emergency response. Directly calls ProtocolController.unpause(protocolId). `[PAUSE]`
> - `shutdown(address gauge)` — Immediately shuts down a specific gauge, preventing new deposits and withdrawing all funds. Only callable by addresses with GUARDIAN_ROLE. This function bypasses the timelock delay for emergency response. Shutdown prevents new deposits while allowing users to withdraw their funds. Directly calls ProtocolController.shutdown(gauge). `[PAUSE]`
> - `unshutdown(address gauge)` — Immediately resumes a previously shutdown gauge. Only callable by addresses with GUARDIAN_ROLE. This function bypasses the timelock delay for emergency response. Allows a previously shutdown gauge to resume normal operations. Directly calls ProtocolController.unshutdown(gauge).

> **Members (2):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xB0552b6860CE5C0202976Db056b5e3Cc4f9CC765` | Gnosis Safe 3/5 | 🟢 LOW | 2026-01-12 | Events only · hasRole ✓ | 3/5 signers |
> | `0xf3a5AC78f47638C60117D9fA3dc7Be96625947aF` | EOA | 🔴 CRITICAL | 2025-10-13 | Events only · hasRole ✓ | ⚠️ Single private key |

> **Signers of `Gnosis Safe 3/5` (0xB055...C765):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x88883560AD02A31D299865B1fCE0aaF350AaA553` | EOA | — | EOA |
> | `0x02e4De712d99f4B1b1e12aa3675D8b0A582caA5D` | EOA ⚠️ Hot wallet (1,477 txs) | — | EOA |
> | `0x1fF4CE381E38cD6469b0f67703E667C861e1Eb43` | EOA | — | EOA |
> | `0x20aCB38B9268F694657EbefcD2aC9bCb8A103D2e` | EOA ⚠️ Hot wallet (1,873 txs) | — | EOA |
> | `0x07c2D0E24530199e2c9A15bfeD4496d8E3798003` | EOA | — | EOA |

> **Enabled modules:**
>   - `0x43F8F8472FEbd6e7481e0AB43F49A683F9Fbedb7` — GaugeVoter
>   - `0x665d334388012d17F1d197dE72b7b708ffCCB67d` — GovCurveVoter

### > 🟢 `CANCELLER_ROLE`

> **Hash:** `0xfd643c72710c63c0180259aba6b2d05451e3591a24e58b62239378085726f783`  
> **Managed by:** `DEFAULT_ADMIN_ROLE`  
> **Privileged write functions:**
> - `cancel(bytes32 id)` — Cancel an operation. Requirements:

> **Members (2):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xB0552b6860CE5C0202976Db056b5e3Cc4f9CC765` | Gnosis Safe 3/5 | 🟢 LOW | 2025-10-09 | Events only · hasRole ✓ | 3/5 signers |
> | `0xce71C076da091a4Fd0CE5d6dC4A8b292032926F1` | Gnosis Safe 2/5 | 🟢 LOW | 2026-06-25 🆕 | Events only · hasRole ✓ | 2/5 signers |

> **Signers of `Gnosis Safe 3/5` (0xB055...C765):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x88883560AD02A31D299865B1fCE0aaF350AaA553` | EOA | — | EOA |
> | `0x02e4De712d99f4B1b1e12aa3675D8b0A582caA5D` | EOA ⚠️ Hot wallet (1,477 txs) | — | EOA |
> | `0x1fF4CE381E38cD6469b0f67703E667C861e1Eb43` | EOA | — | EOA |
> | `0x20aCB38B9268F694657EbefcD2aC9bCb8A103D2e` | EOA ⚠️ Hot wallet (1,873 txs) | — | EOA |
> | `0x07c2D0E24530199e2c9A15bfeD4496d8E3798003` | EOA | — | EOA |

> **Enabled modules:**
>   - `0x43F8F8472FEbd6e7481e0AB43F49A683F9Fbedb7` — GaugeVoter
>   - `0x665d334388012d17F1d197dE72b7b708ffCCB67d` — GovCurveVoter

> **Signers of `Gnosis Safe 2/5` (0xce71...26F1):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0xF2875cB91c35e0DDc9b76B15E2Aae236d393efFf` | EOA | — | EOA |
> | `0xE3268ADB23043b3Acc7083E96912aeeb4feB4DF2` | EOA | — | EOA |
> | `0x1fF4CE381E38cD6469b0f67703E667C861e1Eb43` | EOA | — | EOA |
> | `0x4046B37Ffc36B0C723d7Fc64e0C763B698D81934` | EOA | — | EOA |
> | `0x07c2D0E24530199e2c9A15bfeD4496d8E3798003` | EOA | — | EOA |

### > 🟢 `EXECUTOR_ROLE`

> **Hash:** `0xd8aa0f3194971a2a116679f7c2090f6939c8d4e01a2a8d7e41d55e5351469e63`  
> **Managed by:** `DEFAULT_ADMIN_ROLE`  
> **Privileged write functions:**
> - `execute(address target, uint256 value, bytes calldata payload, bytes32 predecessor, bytes32 salt)`
> - `executeBatch(address[] calldata targets, uint256[] calldata values, bytes[] calldata payloads, bytes32 predecessor, bytes32 salt)`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xB0552b6860CE5C0202976Db056b5e3Cc4f9CC765` | Gnosis Safe 3/5 | 🟢 LOW | 2025-10-09 | Events only · hasRole ✓ | 3/5 signers |

> **Signers of `Gnosis Safe 3/5` (0xB055...C765):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x88883560AD02A31D299865B1fCE0aaF350AaA553` | EOA | — | EOA |
> | `0x02e4De712d99f4B1b1e12aa3675D8b0A582caA5D` | EOA ⚠️ Hot wallet (1,477 txs) | — | EOA |
> | `0x1fF4CE381E38cD6469b0f67703E667C861e1Eb43` | EOA | — | EOA |
> | `0x20aCB38B9268F694657EbefcD2aC9bCb8A103D2e` | EOA ⚠️ Hot wallet (1,873 txs) | — | EOA |
> | `0x07c2D0E24530199e2c9A15bfeD4496d8E3798003` | EOA | — | EOA |

> **Enabled modules:**
>   - `0x43F8F8472FEbd6e7481e0AB43F49A683F9Fbedb7` — GaugeVoter
>   - `0x665d334388012d17F1d197dE72b7b708ffCCB67d` — GovCurveVoter

### > 🟢 `PROPOSER_ROLE`

> **Hash:** `0xb09aa5aeb3702cfd50b6b62bc4532604938f21248a27a1d5ca736082b6819cc1`  
> **Managed by:** `DEFAULT_ADMIN_ROLE`  
> **Privileged write functions:**
> - `schedule(address target, uint256 value, bytes calldata data, bytes32 predecessor, bytes32 salt, uint256 delay)` — Schedule an operation containing a single transaction. Emits {CallSalt} if salt is nonzero, and {CallScheduled}.
> - `scheduleBatch(address[] calldata targets, uint256[] calldata values, bytes[] calldata payloads, bytes32 predecessor, bytes32 salt, uint256 delay)` — Schedule an operation containing a batch of transactions. Emits {CallSalt} if salt is nonzero, and one {CallScheduled} event per transaction in the batch.

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xB0552b6860CE5C0202976Db056b5e3Cc4f9CC765` | Gnosis Safe 3/5 | 🟢 LOW | 2025-10-09 | Events only · hasRole ✓ | 3/5 signers |

> **Signers of `Gnosis Safe 3/5` (0xB055...C765):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0x88883560AD02A31D299865B1fCE0aaF350AaA553` | EOA | — | EOA |
> | `0x02e4De712d99f4B1b1e12aa3675D8b0A582caA5D` | EOA ⚠️ Hot wallet (1,477 txs) | — | EOA |
> | `0x1fF4CE381E38cD6469b0f67703E667C861e1Eb43` | EOA | — | EOA |
> | `0x20aCB38B9268F694657EbefcD2aC9bCb8A103D2e` | EOA ⚠️ Hot wallet (1,873 txs) | — | EOA |
> | `0x07c2D0E24530199e2c9A15bfeD4496d8E3798003` | EOA | — | EOA |

> **Enabled modules:**
>   - `0x43F8F8472FEbd6e7481e0AB43F49A683F9Fbedb7` — GaugeVoter
>   - `0x665d334388012d17F1d197dE72b7b708ffCCB67d` — GovCurveVoter

> #### 🔧 Permissioned Parameters

> **`pause`** ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Setter | `pause(bytes4 protocolId)` |
> | Gated by | `GUARDIAN_ROLE` |
> | Tags | `PAUSE` |
> | Last called | — |
> | Called by | — |
> | Total calls | 0 ❄️ |

> **`shutdown`** *(per-asset)* ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Setter | `shutdown(address gauge)` |
> | Gated by | `GUARDIAN_ROLE` |
> | Tags | `PAUSE` |
> | Last called | — |
> | Called by | — |
> | Total calls | 0 ❄️ |

> **`unpause`** ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Setter | `unpause(bytes4 protocolId)` |
> | Gated by | `GUARDIAN_ROLE` |
> | Tags | `PAUSE` |
> | Last called | — |
> | Called by | — |
> | Total calls | 0 ❄️ |

---
<a id="c-0x6dfa6232ec23e029d4322115f491a912de9cf9e7"></a>
## > ConvexSidecarFactory `0x6DFA6232eC23E029d4322115f491a912De9cF9E7`

> 🔒 **Immutable References:** `OLD_SIDECAR_FACTORY()` → ConvexSidecarFactory

### > 🟠 `BOOSTER()`

> **Privileged write functions:**
> - `create(address gauge, bytes memory args)` — Convenience function to create a sidecar with a uint256 pid parameter

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xF403C135812408BFbE8713b5A23a04b3D48AAE31` | Booster | 🟠 HIGH | — | Storage only |  |

### > 🟠 `PROTOCOL_CONTROLLER()`

> **Privileged write functions:**
> - `create(address gauge, bytes memory args)` — Convenience function to create a sidecar with a uint256 pid parameter

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x2d8BcE1FaE00a959354aCD9eBf9174337A64d4fb` | ProtocolController | 🟠 HIGH | — | Storage only |  |

---
## ⚡ Authority Concentration

The following addresses hold permissions across multiple contracts or roles in this dependency stack. Concentration of authority increases systemic risk — a single compromised key or colluding multisig can affect multiple systems.

### 🟠 `0x2d8BcE1FaE00a959354aCD9eBf9174337A64d4fb` — ProtocolController
Controls **4 role(s)** across **4 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| RewardVault `0x0c36...4e55` | `PROTOCOL_CONTROLLER()` | `deposit(uint256 assets, address receiver, address referrer)`, `deposit(address account, address receiver, uint256 assets, address referrer)`, `resumeVault()` | — |
| CurveStrategy `0xb010...2bb5` | `PROTOCOL_CONTROLLER()` | `claimExtraRewards(address gauge)`, `deposit(IAllocator.Allocation calldata allocation, HarvestPolicy policy)`, `withdraw(IAllocator.Allocation calldata allocation, IStrategy.HarvestPolicy policy, address receiver)`, `harvest(address gauge, bytes memory extraData)` | — |
| Accountant `0x93b4...1Ce0` | `PROTOCOL_CONTROLLER()` | `harvest(address[] calldata _gauges, bytes[] calldata _harvestData, address _receiver)`, `claim(address[] calldata _gauges, bytes[] calldata harvestData, address receiver)`, `claim(address[] calldata _gauges, address account, bytes[] calldata harvestData, address receiver)` | — |
| ConvexSidecarFactory `0x6DFA...F9E7` | `PROTOCOL_CONTROLLER()` | `create(address gauge, bytes memory args)` | — |

### 🟢 `0xB0552b6860CE5C0202976Db056b5e3Cc4f9CC765` — Gnosis Safe 3/5
Controls **4 role(s)** across **1 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| ProtocolTimelock `0xb27a...8E6a` | `EXECUTOR_ROLE` | `execute(address target, uint256 value, bytes calldata payload, bytes32 predecessor, bytes32 salt)`, `executeBatch(address[] calldata targets, uint256[] calldata values, bytes[] calldata payloads, bytes32 predecessor, bytes32 salt)` | 2025-10-09 |
| ProtocolTimelock `0xb27a...8E6a` | `GUARDIAN_ROLE` | `pause(bytes4 protocolId)`, `unpause(bytes4 protocolId)`, `shutdown(address gauge)`, `unshutdown(address gauge)` | 2026-01-12 |
| ProtocolTimelock `0xb27a...8E6a` | `CANCELLER_ROLE` | `cancel(bytes32 id)` | 2025-10-09 |
| ProtocolTimelock `0xb27a...8E6a` | `PROPOSER_ROLE` | `schedule(address target, uint256 value, bytes calldata data, bytes32 predecessor, bytes32 salt, uint256 delay)`, `scheduleBatch(address[] calldata targets, uint256[] calldata values, bytes[] calldata payloads, bytes32 predecessor, bytes32 salt, uint256 delay)` | 2025-10-09 |

### 🟢 `0xe5d6D047DF95c6627326465cB27B64A8b77A8b91` — Gnosis Safe 1/1
Controls **3 role(s)** across **2 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| Accountant `0x93b4...1Ce0` | `owner()` | `setHarvestFeePercent(uint128 newHarvestFeePercent)`, `setProtocolFeePercent(uint128 newProtocolFeePercent)`, `transferOwnership(address newOwner)`, `renounceOwnership()` +1 more | — |
| CurveYCRVVoter `0x52f5...66B6` | `strategy()` | `withdraw(IERC20 _asset)`, `withdraw(uint256 _amount)`, `withdrawAll()`, `createLock(uint256 _value, uint256 _unlockTime)` +3 more | — |
| CurveYCRVVoter `0x52f5...66B6` | `governance()` | `setStrategy(address _strategy)`, `createLock(uint256 _value, uint256 _unlockTime)`, `increaseAmount(uint256 _value)`, `release()` +2 more | — |

### 🟠 `0xd061D61a4d941c39E5453435B6345Dc261C2fcE0` — Contract
Controls **2 role(s)** across **2 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| CurveStrategy `0xb010...2bb5` | `MINTER()` | `deposit(IAllocator.Allocation calldata allocation, HarvestPolicy policy)`, `withdraw(IAllocator.Allocation calldata allocation, IStrategy.HarvestPolicy policy, address receiver)`, `harvest(address gauge, bytes memory extraData)` | — |
| CRV [Vyper_contract] `0xD533...cd52` | `minter()` | `mint(address _to, uint256 _value)` | — |

### 🟠 `0xD533a949740bb3306d119CC777fa900bA034cd52` — CRV
Controls **2 role(s)** across **2 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| CurveStrategy `0xb010...2bb5` | `REWARD_TOKEN()` | `deposit(IAllocator.Allocation calldata allocation, HarvestPolicy policy)`, `withdraw(IAllocator.Allocation calldata allocation, IStrategy.HarvestPolicy policy, address receiver)`, `harvest(address gauge, bytes memory extraData)`, `flush()` | — |
| Accountant `0x93b4...1Ce0` | `REWARD_TOKEN()` | `harvest(address[] calldata _gauges, bytes[] calldata _harvestData, address _receiver)`, `claim(address[] calldata _gauges, bytes[] calldata harvestData, address receiver)`, `claim(address[] calldata _gauges, address account, bytes[] calldata harvestData, address receiver)` | — |

### 🟢 `0xb27afc7844988948FBd6210AeF4E1362bC2d8E6a` — TimelockController (2d)
Controls **2 role(s)** across **2 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| ProtocolController `0x2d8B...d4fb` | `owner()` | `setRegistrar(address registrar_, bool allowed)`, `setPermissionSetter(address setter, bool allowed)`, `setPermission(address target, address caller, bytes4 selector, bool allowed)`, `setStrategy(bytes4 protocolId, address strategy)` +16 more | — |
| ProtocolTimelock `0xb27a...8E6a` | `DEFAULT_ADMIN_ROLE` | `initialize()`, `addGuardian(address guardian)`, `removeGuardian(address guardian)` | 2025-10-09 |


---
## ⛔ Sanctions Screening

| Source | Status |
|---|---|
| OFAC SDN | ✅ OFAC SDN screened (97 ETH addresses, cache: 2026-06-29) |
| Chainalysis | ✅ Chainalysis screened |
| **Result** | 34 addresses screened · ✅ 0 flagged |

---
## EOA Exposure Summary

The following roles are held by EOAs:

- **LiquidityGaugeV6** → `manager()` held by EOA `0xEC092c15e8D5A48a77Cde36827F8e228CE39471a`
  Functions: `set_gauge_manager(address _gauge_manager)`, `add_reward(address _reward_token, address _distributor)`, `set_reward_distributor(address _reward_token, address _distributor)`
- **ProtocolTimelock** → `GUARDIAN_ROLE` held by EOA `0xf3a5AC78f47638C60117D9fA3dc7Be96625947aF`
  Functions: `pause(bytes4 protocolId)`, `unpause(bytes4 protocolId)`, `shutdown(address gauge)`

---
## ✅ Scan Integrity

No issues detected. All block ranges covered, source and ABI resolved for all contracts.
