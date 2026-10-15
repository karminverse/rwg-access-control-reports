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
| Report Date | 2026-10-15 02:03 UTC |

### Surface Summary

| Field | Value |
|---|---:|
| Contracts | 10 |
| Role slots | 24 |
| Privileged Fns | 42 |
| EOA Holders | 1 ⚠️ |
| Critical Roles | 1 ⚠️ |

## Changes Since Last Scan

> Comparing **2026-10-15T01:32:56Z** (block 26194509) → **2026-10-15T02:02:11Z** (block 26194668).

> ✅ No changes to roles, parameters, contracts, or findings.


## 📋 Protocol Context

> *From protocol profile: Inverse Finance / DOLA (Stablecoin, minted by Fed contracts into lending markets and a PSM)*

<details>
<summary><strong>Architecture</strong></summary>

- **What DOLA is:** Inverse Finance's dollar stablecoin, an ERC-20 at 0x865377367054516e17014CcdED1e7d814EDC9ce4 deployed on 2021-02-23 (Solidity 0.5.16, no proxy, so its code cannot change). Almost all DOLA is minted by Inverse's Fed contracts into lending markets and the PSM, and it returns to the Feds to be burned. Total supply was 113.06M at block 26,193,469.
- **The token's control surface:** the contract carries two privileged roles and nothing else. The operator, one address, can mint, add or remove minters, and hand the operator role to a new address in two steps (setPendingOperator, then claimOperator by that address). Minters, a mapping, can only mint. There is no pause, blacklist, freeze, transfer fee, rebase, oracle or upgrade path, so no key can stop, seize, reprice or rewrite a holder's balance; transfer, transferFrom, approve, permit and burning one's own balance are open to every holder. The token keeps no supply cap of its own: any bound on new supply sits in the code of the minter contracts. The FiRM Fed source describes Feds as 'a class of contracts in the Inverse Finance ecosystem responsible for minting and burning DOLA'.
- **Where new DOLA comes from:** the Compound Timelock 0x926dF14a23BE491164dCF93f4c468A50ef659D5B became operator on 2021-03-26 and has since executed 27 addMinter and 25 removeMinter calls and no mint call on DOLA, so every DOLA minted since then came through a minter. Before that, the deployer EOA 0x3FcB35a1CbFB6007f9BC638D388958Bc4550cB28, operator at launch, minted 27,875.97 DOLA once and added the first two minters. At block 26,193,469, 29 addresses had been minters and 25 were retired; by their own accounting three retired ones still showed DOLA minted and not burned: a ConvexFed (647.37), an AuraFed (101.60) and the 2021 Stabilizer (4.49). The four active minters, the FiRM Fed, the Frontier Fed, the PSM Fed and the flash minter, are listed live in the DOLA Feds and minters table below.
- **FiRM Fed:** the FiRM Fed 0x2b34548b865ad66A2B046cb82e59eE43F75B90fd lends DOLA into FiRM markets. It mints DOLA straight into a market when its chair calls expansion, and only if DOLA Borrowing Rights (DBR, 0xAD038Eb671c44b853887A7E32528FaB35dC5D710) lists the market, the market's borrowing is open, the Fed's supply to that market stays within the market's ceiling and its total stays within the global supplyCeiling. The DOLA then sits in the market until a borrower draws it against collateral. contraction recalls up to what the Fed supplied and burns it, and anyone can call takeProfit, which sends a market's surplus DOLA to the Fed's gov. A ceiling caps further expansion only; lowering it recalls nothing. At block 26,193,469 DBR listed 49 markets and the Fed had supplied 109.75M, held in 28 of them (three more hold dust): 70.64M borrowed and 39.11M idle in market contracts. The FiRM Markets table below lists live every market with a ceiling or Fed supply and counts the rest.
- **Frontier Fed and anDOLA:** the Frontier Fed 0x5E075E40D01c82B6Bf0B0ecdb4Eb1D6984357EF7 mints DOLA and supplies it to anDOLA, the DOLA market of Inverse's earlier Frontier money market. Its expansion has no ceiling in code. At block 26,193,469 borrowing from anDOLA was paused at Frontier's Comptroller, whose admin is the Timelock, and the Fed held 99.97% of anDOLA, so new DOLA there would stay in the cToken until contracted. Minting into anDOLA was open; a mint pause, which the pause Safe can set, makes expansion revert. The Fed's supply had been wound down to 3.10M, of which 2.76M was out in borrows made before the pause.
- **PSM Fed and the PSM:** the PSM Fed 0x67FC21332D24FC5250a3B7fc988191ad7F38f9cC mints into the PSM 0x1d02f2841afA3Cc20435a8c804C24dEaC5F30DFa, up to its supplyCap of 10M. The PSM sells DOLA for USDS one-to-one less a buy fee and buys DOLA back for USDS less a sell fee, keeping the USDS in sUSDS. Its gov, the Timelock, sets both fees up to 100%, can migrate the vault, sweep any token and replace the controller, which the PSM consults on every trade (the current one approves all). At block 26,193,469 the buy fee was 0 and the sell fee 0.2%, and the PSM held 200,000 DOLA and no USDS or sUSDS: no DOLA had been sold through it.
- **Flash minter:** MainnetDolaFlashMinter 0x6C5Fdc0c53b122Ae0f15a863C349f3A481DE8f1F lets anyone flash mint DOLA under ERC-3156 at a constant fee of zero, with at most maxFlashLimit (5M at block 26,193,469) outstanding at any moment, nested loans included. The DOLA must come back and is burned before the call returns, so nothing stays outstanding between transactions. Its owner and fee treasury are the Timelock.
- **Governance:** GovernorMills 0xBeCCB6bb0aa4ab551966A7E4B97cec74bb359Bf6 counts INV and xINV votes (xINV at its exchange rate). At block 26,193,469, proposing needed more than 7,270 INV of voting power or one of six whitelisted proposers; a vote runs 17,280 blocks and passes with at least 24,000 INV in favour and more votes for than against (INV supply 727,000). A passed proposal then waits 2 days in the Compound Timelock 0x926dF14a23BE491164dCF93f4c468A50ef659D5B; the delay cannot be set below 2 days, and a queued action not executed within 14 days after its eta lapses. The Timelock is DOLA's operator, the gov of all three Feds, of the PSM and of every FiRM market, DBR's operator, the flash minter's owner and the admin of Frontier's Comptroller. Its admin has been GovernorMills since 2021-11-27; from 2021-10-22 until then the deployer EOA held it, during the move from an earlier GovernorMills deployment.
- **The Guardian's cancel path:** GovernorMills' guardian is the Guardian contract 0x941c2699eC7E55a50Bde030d8E1e70649839259D, whose only outward call cancels a proposal not yet executed. The deployer EOA marks a proposal cancellable and the Policy Committee's 4-of-7 Safe 0x4b6c63E6a94ef26E2dF60b89372db2d8e211F1B7, which holds the Guardian's rwg role, executes the cancel; each of the two roles can hand itself over in two steps. The guardian's other GovernorMills powers, such as changing quorum or handing over the Timelock's admin, have no caller in the Guardian and are out of use. Anyone can also cancel a proposal whose proposer has fallen below the threshold, unless the proposer is whitelisted.
- **The Fed Chair Safe:** at block 26,193,469 the chair of all three Feds was the Fed Chair multisig, the 2-of-6 Safe 0x8F97cCA30Dbe80e7a8B462F1dD1a51C32accDfC8 (Safe 1.3.0, no modules, no guard), which governance proposal 31 created as a 2-of-5. It runs expansion and contraction with no delay and can resign; it cannot change a bound or send DOLA anywhere a Fed's code does not allow. Its unused headroom at that block was 198.6M under FiRM market ceilings and 9.8M under the PSM cap, and the Frontier Fed has no cap.
- **The pause Safe and the signers:** the pause guardian of every FiRM market and of Frontier is the Risk Working Group's 1-of-4 Safe 0xE3eD95e130ad9E15643f5A5f232a3daE980784cd, the RWG multisig named in governance proposals 66 and 259. Its power runs one way: it can pause but never unpause. On a FiRM market it can pause borrowing only, which also stops FiRM Fed expansion into that market; on Frontier it can pause minting, borrowing and collateral use per market and transfers and seizures across the money market. Only the Timelock, as market gov and Comptroller admin, can unpause. The six Fed Chair signers also sign the Policy Committee Safe, which adds a seventh, and four of them make up the RWG Safe. The deployer EOA 0x3FcB35a1CbFB6007f9BC638D388958Bc4550cB28 signs all three Safes, and four Fed Chair signers are whitelisted GovernorMills proposers.
- **Scope of this report:** ten contracts, namely DOLA, the three Feds, the flash minter, the Timelock, GovernorMills, the Guardian and the two Safes that hold Fed and cancel duties. Read live but not scanned: DBR and the FiRM markets (FiRM's own contracts, listed in the FiRM Markets table), the PSM, Frontier's anDOLA and Comptroller, and the RWG's 1-of-4 pause Safe. Retired minters stay in the DOLA Feds and minters snapshot and are listed only while the minters mapping lists them or their own accounting shows DOLA outstanding. DOLA bridged to other chains is out of scope.

**Referenced material**

- **[DOCS]** [DOLA Feds](https://docs.inverse.finance/inverse-finance/inverse-finance/products/dola-feds)
- **[DOCS]** [Governance overview and working group multisigs](https://docs.inverse.finance/inverse-finance/inverse-finance/governance/governance-overview)
- **[DOCS]** [Inverse Finance contract addresses](https://docs.inverse.finance/inverse-finance/technical/smart-contracts)
- **[GOVERNANCE]** [GovernorMills proposals](https://www.inverse.finance/governance)
- **[AUDIT]** [Code4rena audit of Inverse Finance, March 2022](https://code4rena.com/reports/2022-03-inverse-finance)

</details>

<details>
<summary><strong>📖 Terms</strong> <em>— recurring protocol jargon</em></summary>

- **Fed** — A contract that mints DOLA into, and burns it from, destinations fixed in its code: anDOLA (Frontier Fed), the PSM (PSM Fed) or any DBR-listed FiRM market (FiRM Fed). Its gov sets any bounds and can replace the chair.
- **expansion / contraction** — A Fed's two supply calls. expansion mints new DOLA into the Fed's destination; contraction withdraws DOLA the Fed supplied and burns it.
- **chair** — The address allowed to call a Fed's expansion and contraction, and to resign. On all three active Feds it is the Fed Chair multisig.
- **gov (of a Fed or market)** — The address that sets a Fed's or a FiRM market's parameters and can replace its chair or guardian. Everywhere around DOLA it is the Timelock.
- **operator** — DOLA's root role: mint, addMinter, removeMinter and the two-step operator handover. Held by the Timelock since 2021-03-26.
- **FiRM** — Inverse's fixed-rate lending protocol. Each FiRM market takes one collateral token and lends DOLA that the FiRM Fed has supplied to it.
- **DBR (DOLA Borrowing Rights)** — FiRM's rate token, spent over time by borrowers, and the registry of FiRM markets. The FiRM Fed lends only into markets DBR lists; only DBR's operator, the Timelock, can add one, and none can be removed.
- **Fed ceiling** — ceilings(market) on the FiRM Fed: the most the Fed's supply to one market may reach through expansion. Lowering it does not recall DOLA already supplied.
- **PSM** — Peg stability module: swaps DOLA and USDS one-to-one, less its fees. The PSM Fed supplies its DOLA.
- **anDOLA** — The DOLA market (a Compound-style cToken) of Frontier, Inverse's earlier money market. The Frontier Fed supplies it; borrowing from it is paused.
- **Guardian / rwg** — The Guardian contract is GovernorMills' guardian and can only cancel proposals. Its deployer EOA marks a proposal cancellable; its rwg role, held by the Policy Committee's 4-of-7 Safe, executes the cancel.
- **grace period** — 14 days after a Timelock action's eta. An action not executed within it can never execute, although the Timelock still lists it as queued.

</details>

<a id="sec-market-ceilings"></a>
<details>
<summary><strong>📊 DOLA Feds and minters</strong> <span class="section-sub">every address the operator has made a DOLA minter: what each has outstanding and what bounds it</span></summary>

> *29 minter(s). The token sets no supply cap. Any bound sits in the minter's own code and is shown in the Cap column; the Frontier Fed has none.. Enumerated live each scan, so a newly-registered market appears automatically. Tracked in Changes-Since: **Active**, **Cap**, **Chair**, **Gov**. Live snapshot only, deliberately NOT diffed because it moves every block: Outstanding. 22 row(s) not listed because Active, Outstanding are all zero.*

| # | Minter | Name | Age | Active | Outstanding | Cap | Chair | Gov |
|---:|---|---|---:|---:|---:|---:|---|---|
| 0 | [`0x5E07...7EF7`](https://etherscan.io/address/0x5E075E40D01c82B6Bf0B0ecdb4Eb1D6984357EF7) | Frontier Fed (anDOLA) | 5.6y | active | 3.1M | — | [`0x8F97...DfC8`](https://etherscan.io/address/0x8F97cCA30Dbe80e7a8B462F1dD1a51C32accDfC8) | [`0x926d...9D5B`](https://etherscan.io/address/0x926dF14a23BE491164dCF93f4c468A50ef659D5B) |
| 1 | [`0x7eC0...5CDd`](https://etherscan.io/address/0x7eC0D931AFFBa01b77711C2cD07c76B970795CDd) | Stabilizer (2021) | 5.6y | retired | 4 | 0 | — | [`0x926d...9D5B`](https://etherscan.io/address/0x926dF14a23BE491164dCF93f4c468A50ef659D5B) |
| 2 | [`0x57D5...59E2`](https://etherscan.io/address/0x57D59a73CDC15fe717D2f1D433290197732659E2) | ConvexFed | 4.1y | retired | 647 | — | [`0x8F97...DfC8`](https://etherscan.io/address/0x8F97cCA30Dbe80e7a8B462F1dD1a51C32accDfC8) | [`0x926d...9D5B`](https://etherscan.io/address/0x926dF14a23BE491164dCF93f4c468A50ef659D5B) |
| 3 | [`0x5D53...e364`](https://etherscan.io/address/0x5D5392505ee69f9FE7a6a1c1AF14f17Db3B3e364) | AuraFed | 3.9y | retired | 102 | — | [`0x8F97...DfC8`](https://etherscan.io/address/0x8F97cCA30Dbe80e7a8B462F1dD1a51C32accDfC8) | [`0x926d...9D5B`](https://etherscan.io/address/0x926dF14a23BE491164dCF93f4c468A50ef659D5B) |
| 4 | [`0x2b34...90fd`](https://etherscan.io/address/0x2b34548b865ad66A2B046cb82e59eE43F75B90fd) | FiRM Fed | 3.8y | active | 109.8M | 100.00B | [`0x8F97...DfC8`](https://etherscan.io/address/0x8F97cCA30Dbe80e7a8B462F1dD1a51C32accDfC8) | [`0x926d...9D5B`](https://etherscan.io/address/0x926dF14a23BE491164dCF93f4c468A50ef659D5B) |
| 5 | [`0x6C5F...8f1F`](https://etherscan.io/address/0x6C5Fdc0c53b122Ae0f15a863C349f3A481DE8f1F) | Flash minter | 2.1y | active | 0 | 5.0M | — | [`0x926d...9D5B`](https://etherscan.io/address/0x926dF14a23BE491164dCF93f4c468A50ef659D5B) |
| 6 | [`0x67FC...f9cC`](https://etherscan.io/address/0x67FC21332D24FC5250a3B7fc988191ad7F38f9cC) | PSM Fed | 9mo | active | 200,000 | 10.0M | [`0x8F97...DfC8`](https://etherscan.io/address/0x8F97cCA30Dbe80e7a8B462F1dD1a51C32accDfC8) | [`0x926d...9D5B`](https://etherscan.io/address/0x926dF14a23BE491164dCF93f4c468A50ef659D5B) |

<strong>Reading this table</strong>

- **Active**: Whether DOLA's minters mapping still lists this address. Only the operator, the Timelock, changes it, through addMinter and removeMinter.
- **Outstanding**: DOLA this minter has minted and not burned, by its own accounting: globalSupply() on the FiRM Fed; supply() on the Frontier Fed, the PSM Feds, the Stabilizer and the older lending Feds; flashMinted() on the flash minters, zero between transactions; dolaSupply() on the AMO and bridge Feds; dstSupply() on the xChainFed; underlyingSupply() on the ArbiFed.
- **Cap**: The minter's own bound, set by its gov: supplyCeiling() on the FiRM Fed (each market has a tighter ceiling, see FiRM Markets), supplyCap() on the PSM Fed, and maxFlashLimit() on the flash minter, the most that may be flash minted and outstanding at one time. A blank cell means the contract has no such bound: the Frontier Fed's expansion has none.
- **Chair**: Who calls expansion and contraction. The three active Feds share the Fed Chair multisig 0x8F97cCA30Dbe80e7a8B462F1dD1a51C32accDfC8.
- **Gov**: Who sets the bounds and can replace the chair: the Timelock on every minter shown (owner() on the flash minter, governance() on the Stabilizer).

</details>

<a id="sec-market-ceilings-2"></a>
<details>
<summary><strong>📊 FiRM Markets</strong> <span class="section-sub">every market DBR lists: the FiRM Fed's ceiling, the DOLA it supplied and what borrowers owe</span></summary>

> *49 registered market(s), 19 active. Aggregate fed ceiling = **306.6M** (max mint capacity); aggregate borrowed = **70.8M** (**23%** utilized) — live total DOLA exposure. Enumerated live each scan, so a newly-registered market appears automatically. Tracked in Changes-Since: **Borrowing**, **CF (bps)**. Live snapshot only, deliberately NOT diffed because it moves every block: Fed supplied, Idle DOLA. 18 row(s) not listed because ceiling, Fed supplied are all zero.*

| # | Market | Name | Age | Fed ceiling | Borrowed | Utilization | Fed supplied | Idle DOLA | Borrowing | CF (bps) |
|---:|---|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 0 | [`0x63Df...7035`](https://etherscan.io/address/0x63Df5e23Db45a2066508318f172bA45B9CD37035) | WETH | 3.8y | 10.0M | 53,845 | 0.5% | 2.0M | 1.9M | open | 8,500 |
| 1 | [`0x743A...1dCf`](https://etherscan.io/address/0x743A502cf0e213F6FEE56cD9C6B03dE7Fa951dCf) | stETH *(inactive)* | 3.7y | 0 | 2,400 | — | 216,974 | 214,574 | paused | 8,000 |
| 2 | [`0x7Cd3...6b37`](https://etherscan.io/address/0x7Cd3ab8354289BEF52c84c2BF0A54E3608e66b37) | gOHM *(inactive)* | 3.6y | 0 | 0 | — | 11,062 | 11,066 | paused | 7,500 |
| 3 | [`0x63fA...1Ee8`](https://etherscan.io/address/0x63fAd99705a255fE2D500e498dbb3A9aE5AA1Ee8) | CRV | 3.6y | 3.0M | 0 | 0.0% | 500,000 | 500,000 | open | 6,300 |
| 4 | [`0x3474...397a`](https://etherscan.io/address/0x3474ad0e3a9775c9F68B415A7a9880B0CAB9397a) | cvxCRV | 3.4y | 3.0M | 94,130 | 3.1% | 529,939 | 435,820 | open | 4,800 |
| 5 | [`0xb516...330B`](https://etherscan.io/address/0xb516247596Ca36bf32876199FBdCaD6B3322330B) | INV *(inactive)* | 3.4y | 0 | 131,813 | — | 284,500 | 152,707 | paused | 3,000 |
| 6 | [`0x27b6...F9c4`](https://etherscan.io/address/0x27b6c301Fd441f3345d61B7a4245E1F823c3F9c4) | yvyCRV | 3.2y | 400,000 | 112,305 | 28.1% | 171,643 | 59,370 | open | 4,800 |
| 7 | [`0x0971...9b26`](https://etherscan.io/address/0x0971B1690d101169BFca4715897aD3a9b3C39b26) | DAI | 3.1y | 500 | 26 | 5.2% | 57 | 31 | paused | 9,000 |
| 8 | [`0xdc22...dF6b`](https://etherscan.io/address/0xdc2265cBD15beD67b5F2c0B82e23FcE4a07ddF6b) | CVX | 3.1y | 3.0M | 176,778 | 5.9% | 551,604 | 374,826 | open | 6,500 |
| 9 | [`0x3FD3...50BC`](https://etherscan.io/address/0x3FD3daBB9F9480621C8A111603D3Ba70F17550BC) | wstETH | 2.8y | 50.0M | 631,794 | 1.3% | 2.0M | 1.4M | open | 8,500 |
| 10 | [`0x48BA...4E7C`](https://etherscan.io/address/0x48BA574Edf0bc4E2E40B529863aaA6a67c264E7C) | WBTC | 2.6y | 10.0M | 138,847 | 1.4% | 2.0M | 1.9M | open | 8,500 |
| 11 | [`0x0c0b...D168`](https://etherscan.io/address/0x0c0bb843FAbda441edeFB93331cFff8EC92bD168) | st-yETH *(inactive)* | 2.4y | 0 | 0 | — | 460,000 | 460,000 | paused | 5,000 |
| 12 | [`0x79eF...AEc4`](https://etherscan.io/address/0x79eF6d28C41e47A588E2F2ffB4140Eb6d952AEc4) | sUSDe | 2.2y | 5.0M | 437,722 | 8.8% | 601,000 | 163,278 | open | 9,000 |
| 13 | [`0x6A52...631E`](https://etherscan.io/address/0x6A522f3BD3fDA15e74180953f203cf55aA6C631E) | crvUSDDOLA-f *(inactive)* | 2.1y | 0 | 0 | — | 54,989 | 54,989 | paused | 9,000 |
| 14 | [`0x2A25...77FF`](https://etherscan.io/address/0x2A256306D8ba899E33B01e495982656884Ac77FF) | cbBTC | 2.1y | 10.0M | 108,335 | 1.1% | 1.1M | 1.0M | open | 8,500 |
| 15 | [`0xf013...c4f5`](https://etherscan.io/address/0xf013D998D4cf7f45547958094F1EEE75Ca43c4f5) | yvCurve-DOLA-FRAXPYUSD-f *(inactive)* | 2.0y | 0 | 0 | — | 0 | 0 | paused | 9,000 |
| 16 | [`0x87df...72Ea`](https://etherscan.io/address/0x87df9A00f0e4908e61756d2Fcb348ADF95Ce72Ea) | DOLAFRAXBP3CRV-f *(inactive)* | 2.0y | 0 | 0 | — | 0 | 0 | paused | 9,000 |
| 17 | [`0x4E26...db1a`](https://etherscan.io/address/0x4E264618dC015219CD83dbc53B31251D73c2db1a) | yvCurve-DOLA-sUSDe-f | 1.9y | 20.0M | 11.3M | 56.6% | 13.2M | 1.9M | open | 9,200 |
| 18 | [`0xb427...4A99`](https://etherscan.io/address/0xb427fC22561f3963B04202F9bb5BCEbd76c14A99) | DOLA-sUSDe | 1.9y | 80.0M | 41.9M | 52.4% | 58.3M | 16.4M | open | 9,200 |
| 19 | [`0x4A33...808b`](https://etherscan.io/address/0x4A33baFA8a31E4ec9649f65646022cAD1957808b) | yvCurve-DOLA-sUSDS-f | 1.9y | 50.0M | 1.0M | 2.0% | 4.1M | 3.1M | open | 9,000 |
| 20 | [`0xD68d...4b29`](https://etherscan.io/address/0xD68d3a44d46dd50BFeBa8Cca544717B76e7C4b29) | DOLA-sUSDS | 1.9y | 50.0M | 4.9M | 9.8% | 10.8M | 5.9M | open | 9,000 |
| 21 | [`0xb8bc...D565`](https://etherscan.io/address/0xb8bc1E9c0a2d445bc39d2A745F47619E954dD565) | yvCurve-sDOLA-scrvUSD-f *(inactive)* | 1.8y | 0 | 0 | — | 30,000 | 30,001 | paused | 8,750 |
| 22 | [`0xB907...8f9a`](https://etherscan.io/address/0xB907Dcc926b5991A149d04Cb7C0a4a25dC2D8f9a) | deUSD/DOLA *(inactive)* | 1.6y | 0 | 0 | — | 0 | 0 | paused | 9,000 |
| 23 | [`0xC008...8cCF`](https://etherscan.io/address/0xC0086Ff652c67f43F00F0F9C69Ef6c33640C8cCF) | yvCurve-DOLA-USR-f *(inactive)* | 1.6y | 0 | 88 | — | 1,000 | 919 | paused | 9,000 |
| 24 | [`0xf85e...2db2`](https://etherscan.io/address/0xf85ed61dFd00bCD89ae0a6085b062a261E222db2) | PT-sUSDE-31JUL2025 *(inactive)* | 1.4y | 0 | 0 | — | 28,537 | 28,537 | paused | 9,150 |
| 25 | [`0xe4D4...12E4`](https://etherscan.io/address/0xe4D47Ef77AC2C3FA4019Cd169Ac1Dd9E27cb12E4) | DOLAwstUSR *(inactive)* | 1.0y | 0 | 0 | — | 680,000 | 680,000 | paused | 9,000 |
| 26 | [`0xC45E...6C4d`](https://etherscan.io/address/0xC45E9c231ab5D9Bd3F1131E7901B100D8D236C4d) | savedola | 3mo | 5.0M | 4.1M | 82.7% | 4.9M | 766,683 | open | 8,700 |
| 27 | [`0xf928...9D9A`](https://etherscan.io/address/0xf9287c29Cb888F4834B7D2757a833D509e7f9D9A) | reusdsdola | 57d | 2.5M | 2.4M | 95.2% | 2.5M | 111,250 | open | 8,500 |
| 28 | [`0x1fD4...6916`](https://etherscan.io/address/0x1fD4985cdd57bDb1eD646B10B7952fCD58946916) | yvCurve-reUSD-sDOLA-f | 57d | 2.5M | 2.4M | 95.1% | 2.5M | 111,632 | open | 8,500 |
| 29 | [`0x3542...9EaA`](https://etherscan.io/address/0x3542b39DCedC01f82c6e7af0EEC424726d019EaA) | sinvUSD | 5d | 200,000 | 30,538 | 15.3% | 200,000 | 169,462 | open | 7,500 |
| 30 | [`0xa956...f02d`](https://etherscan.io/address/0xa95605313EB4544f784e699dE93e9232DbFcf02d) | ysyBOLD | 2d | 2.0M | 837,681 | 41.9% | 2.0M | 1.2M | open | 8,500 |

<strong>Reading this table</strong>

- **Fed supplied**: DOLA the FiRM Fed has minted into this market and not contracted. The Fed ceiling caps expansion only, so supply can sit above it, as in markets whose ceiling is now 0. Borrowed is the market's totalDebt(); Utilization is Borrowed divided by the Fed ceiling and shows 0% when the ceiling is 0.
- **Idle DOLA**: DOLA in the market contract. Borrowers can draw it while borrowing is open, the chair can contract it up to Fed supplied, and any excess is profit that takeProfit sends to the Fed's gov.
- **Borrowing**: Whether the market's borrowing is paused. The RWG pause Safe can pause it and only gov, the Timelock, can reopen it; while it is paused the FiRM Fed cannot expand into the market.
- **CF (bps)**: The market's collateral factor in basis points, set by the market's gov, the Timelock: how much DOLA a borrower may draw per unit of collateral value.

</details>

<a id="sec-critical-params"></a>
<details>
<summary><strong>🎚️ Critical Parameter Levers</strong> — the one-tx risk levers to watch</summary>

> *6 on-chain parameter levers that are curated as high-impact for lender-side risk (direct dilution / safety-mechanism closure / authority transfer / oracle repointing). Each entry shows current value, the threshold that triggers the impact, and the role-holder controlling the lever.*

- **1. `setPendingOperator(address)`** 🟠 on [**DOLA (0x865377367054516e17014CcdED1e7d814EDC9ce4)**](#c-0x865377367054516e17014ccded1e7d814edc9ce4)
    - *Role gate:* operator(): the Compound Timelock 0x926dF14a23BE491164dCF93f4c468A50ef659D5B, 2-day delay, administered by GovernorMills (INV vote). Two steps: setPendingOperator, then claimOperator by the new address.
    - *Live current value (as of block 12,112,343):* `0x0000000000000000000000000000000000000000`
    - *Recorded changes:* 1 historical event(s); last setter `0x3FcB35a1CbFB6007f9BC638D388958Bc4550cB28`
    - *Profile-declared value (verified at block 26,193,469):* `At block 26,193,469 no handover was pending; the operator is the Timelock.`
    - *Threshold:* Any address. That address becomes the sole operator once it calls claimOperator.
    - *Impact:* The operator is DOLA's root. It alone adds and removes minters and can mint without limit itself, so handing the role over hands over all of that. setPendingOperator emits no event. The advance signals are the GovernorMills ProposalCreated event, at least 17,282 blocks before the action can be queued, and then the queued Timelock transaction; claimOperator emits ChangeOperator when the handover completes. During the vote and the 2-day delay the Guardian can cancel the proposal.
- **2. `addMinter(address)`** 🟠 on [**DOLA (0x865377367054516e17014CcdED1e7d814EDC9ce4)**](#c-0x865377367054516e17014ccded1e7d814edc9ce4)
    - *Role gate:* operator(): the Timelock, 2-day delay, after an INV vote.
    - *Profile-declared value (verified at block 26,193,469):* `At block 26,193,469 four minters were active: FiRM Fed, Frontier Fed, PSM Fed, flash minter.`
    - *Threshold:* Any address. The token sets no limit on what a minter mints.
    - *Impact:* A minter mints DOLA with no limit set by the token; any bound lives in the minter's own code. Three of the four active minters bound themselves (FiRM market ceilings, the PSM Fed's supplyCap, same-transaction repayment); the Frontier Fed has no bound in code and is contained by anDOLA's borrow pause. A newly added address is bounded only by whatever its own code does. The operator can also mint directly through the same vote and delay, and has not done so since March 2021. removeMinter reverses an addition for future mints only.
- **3. `setPendingAdmin(address)`** 🟠 on [**Timelock (0x926dF14a23BE491164dCF93f4c468A50ef659D5B)**](#c-0x926df14a23be491164dcf93f4c468a50ef659d5b)
    - *Role gate:* Callable only by the Timelock itself, so only through an executed Timelock action. GovernorMills' guardian could queue it too, but the Guardian contract has no function that calls it.
    - *Profile-declared value (verified at block 26,193,469):* `At block 26,193,469 the admin was GovernorMills and no handover was pending.`
    - *Threshold:* Any address. Once it calls acceptAdmin it alone queues, cancels and executes Timelock actions, under whatever process it applies and with no GovernorMills vote; the 2-day delay stays.
    - *Impact:* The Timelock's admin decides what the Timelock executes, and the Timelock holds every root role around DOLA: the operator, the gov of each Fed, DBR's operator and the gov of every FiRM market. Replacing GovernorMills replaces the INV vote in front of all of it. The admin changed three times, all in 2021: through a GovernorAlpha proposal to an earlier GovernorMills deployment (2021-10-15), through that deployment's guardian path to the deployer EOA (2021-10-22), and by the EOA, as admin, to GovernorMills (2021-11-27).
- **4. `changeMarketCeiling(IMarket,uint)`** 🟡 on [**FiRM Fed (0x2b34548b865ad66A2B046cb82e59eE43F75B90fd)**](#c-0x2b34548b865ad66a2b046cb82e59ee43f75b90fd)
    - *Role gate:* gov() on the FiRM Fed: the Timelock, 2-day delay, after an INV vote. Any address can be given a ceiling; it takes effect only through expansion, which also needs DBR 0xAD038Eb671c44b853887A7E32528FaB35dC5D710 to list the market (addMarket belongs to the Timelock) and the market's borrowing to be open (the RWG's 1-of-4 pause Safe can pause it; only gov reopens it).
    - *Live current value (as of block 26,179,133):* `49 markets · highest 80M (DOLA-sUSDe market) · 50M ×3 · 20M ×1 · 10M ×3 · 5M ×2 · 3M ×3 · 2.5M ×2 · 2M ×1 · <1M ×3 · 0 ×30 (retired/unfunded)`
      *Full per-market breakdown in the Permissioned Parameters table.*
    - *Recorded changes:* 129 historical event(s); last setter `0xBeCCB6bb0aa4ab551966A7E4B97cec74bb359Bf6`
    - *Profile-declared value (verified at block 26,193,469):* `At block 26,193,469 ceilings summed to about 306.6M over 19 markets; DOLA-sUSDe carried the largest, 80M.`
    - *Threshold:* Any amount per market. Once raised, the chair Safe can mint up to the ceiling minus what the Fed already supplied into that market, in one transaction and with no delay.
    - *Impact:* Caps further FiRM Fed expansion into one market. Minted DOLA waits in the market until borrowers draw it against collateral at that market's collateral factor and oracle, so raising a ceiling enlarges DOLA's exposure to that market's collateral. Lowering it recalls nothing: at block 26,193,469 markets with a ceiling of 0 still held 1.77M of Fed supply. The Fed emits no event for it; the queued Timelock transaction and the Fed ceiling column in the FiRM Markets table are the signals.
- **5. `changeSupplyCeiling(uint)`** 🟡 on [**FiRM Fed (0x2b34548b865ad66A2B046cb82e59eE43F75B90fd)**](#c-0x2b34548b865ad66a2b046cb82e59ee43f75b90fd)
    - *Role gate:* gov() on the FiRM Fed: the Timelock, 2-day delay, after an INV vote.
    - *Live current value (as of block 23,849,639):* `100000000000000000000000000000 (100,000,000,000.000000e18)`
    - *Recorded changes:* 18 historical event(s); last setter `0xBeCCB6bb0aa4ab551966A7E4B97cec74bb359Bf6`
    - *Profile-declared value (verified at block 26,193,469):* `100B DOLA since 2025-11-21. At block 26,193,469 the market ceilings, about 306.6M in sum, bound first.`
    - *Threshold:* Any amount. It caps the FiRM Fed's globalSupply across all markets.
    - *Impact:* The FiRM Fed's overall cap. At 100B it sits far above the sum of market ceilings, so the per-market ceilings are the binding limit today, and lowering it below globalSupply blocks further expansion. Like the market ceilings it emits no event and moves only through a proposal.
- **6. `expansion(uint amount)`** 🟡 on [**Frontier Fed (0x5E075E40D01c82B6Bf0B0ecdb4Eb1D6984357EF7)**](#c-0x5e075e40d01c82b6bf0b0ecdb4eb1d6984357ef7)
    - *Role gate:* chair() on the Frontier Fed: the 2-of-6 Fed Chair Safe 0x8F97cCA30Dbe80e7a8B462F1dD1a51C32accDfC8, no delay. This Fed has no ceiling.
    - *Profile-declared value (verified at block 26,193,469):* `At block 26,193,469: supply 3.10M; anDOLA borrowing paused, minting open.`
    - *Threshold:* Any amount. The Fed mints the DOLA and supplies it to anDOLA in the same call.
    - *Impact:* The one mint path the chair holds with no cap. New DOLA lands as cash in Frontier's anDOLA market, where borrowing is paused and the Fed owns 99.97% of the supply, so it stays in the cToken until the chair contracts it. Unpausing anDOLA borrowing belongs to the Timelock alone as Comptroller admin, and that pause is what keeps this path contained. The RWG's 1-of-4 pause Safe can also pause anDOLA minting, which makes expansion revert.

</details>

## 📑 Table of Contents

1. [Analyst Focus Areas](#analyst-focus-areas)
2. Contracts
   - [DOLA ★](#c-0x865377367054516e17014ccded1e7d814edc9ce4)
   - [Timelock](#c-0x926df14a23be491164dcf93f4c468a50ef659d5b)
   - [Frontier Fed](#c-0x5e075e40d01c82b6bf0b0ecdb4eb1d6984357ef7)
   - [FiRM Fed](#c-0x2b34548b865ad66a2b046cb82e59ee43f75b90fd)
   - [PSM Fed](#c-0x67fc21332d24fc5250a3b7fc988191ad7f38f9cc)
   - [Flash minter](#c-0x6c5fdc0c53b122ae0f15a863c349f3a481de8f1f)
   - [GovernorMills](#c-0xbeccb6bb0aa4ab551966a7e4b97cec74bb359bf6)
   - [Guardian](#c-0x941c2699ec7e55a50bde030d8e1e70649839259d)
3. [⚡ Authority Concentration](#-authority-concentration)
4. [⛔ Sanctions Screening](#-sanctions-screening)
5. [EOA Exposure Summary](#eoa-exposure-summary)
6. [✅ Scan Integrity](#scan-integrity)

## Analyst Focus Areas &nbsp;&nbsp;☑ Profile reviewed

> **Observational findings — not risk determinations.** Each item below is a focus point for the Risk Analyst to interpret against collateralization context and the protocol's stated intent. Attention levels (CRITICAL / HIGH / LOW) reflect the scanner's heuristic weight — not a realized risk to FiRM. These observations support future risk assessments; they do not constitute one.

> **1 critical-attention** and **24 high-attention** observation(s) across 10 contract(s).

<details>
<summary><strong>View findings (collapsed — profile reviewed)</strong></summary>


### 🔴 CRITICAL (1)

- 🔴 [**Observed: EOA holds `deployer()` on Guardian**](#c-0x941c2699ec7e55a50bde030d8e1e70649839259d) — `0x3FcB35a1CbFB6007f9BC638D388958Bc4550cB28` (EOA) — single key controls a role whose functions (`allowCancel`, `setPendingDeployer`) may reach inherited [SUPPLY] authority via DOLA [ERC20]. Inheritance is a dependency-graph edge — verify these functions actually exercise it before treating it as a confirmed path. Assess custody and intent.

### 🟠 HIGH (24)


<details>
<summary>💰 **Observed: 7 role(s) with supply-altering capability** — Supply-altering surface — assess each holder's custody and governance. Expand for all roles (each links to its contract card).</summary>

- 💰 [**`minter()` on DOLA [ERC20]**](#c-0x865377367054516e17014ccded1e7d814edc9ce4) — 0x8653...9ce4 — 4 holders — open the role card for holder identities & admin chain.
- 💰 [**`operator()` on DOLA [ERC20]**](#c-0x865377367054516e17014ccded1e7d814edc9ce4) — 0x8653...9ce4 — held by 0x926d...9D5B — open the role card for holder identities & admin chain.
- 💰 [**`chair()` on Fed**](#c-0x2b34548b865ad66a2b046cb82e59ee43f75b90fd) — 0x2b34...90fd — held by 0x8F97...DfC8 — open the role card for holder identities & admin chain.
- 💰 [**`chair()` on Fed**](#c-0x5e075e40d01c82b6bf0b0ecdb4eb1d6984357ef7) — 0x5E07...7EF7 — held by 0x8F97...DfC8 — open the role card for holder identities & admin chain.
- 💰 [**`gov()` on Fed**](#c-0x2b34548b865ad66a2b046cb82e59ee43f75b90fd) — 0x2b34...90fd — held by 0x926d...9D5B — open the role card for holder identities & admin chain.
- 💰 [**`chair()` on PSMFed**](#c-0x67fc21332d24fc5250a3b7fc988191ad7f38f9cc) — 0x67FC...f9cC — held by 0x8F97...DfC8 — open the role card for holder identities & admin chain.
- 💰 [**`gov()` on PSMFed**](#c-0x67fc21332d24fc5250a3b7fc988191ad7f38f9cc) — 0x67FC...f9cC — held by 0x926d...9D5B — open the role card for holder identities & admin chain.

</details>

- 🔗 [**Observed: supply authority chain on Fed**](#c-0x2b34548b865ad66a2b046cb82e59ee43f75b90fd) — Chain: DOLA [ERC20] → `minter()` → Fed. Controlled by: `chair()`, `gov()`. Assess custody — compromise of this chain could affect root token supply.
- 🔗 [**Observed: supply authority chain on GnosisSafe**](#c-0x5e075e40d01c82b6bf0b0ecdb4eb1d6984357ef7) — Chain: DOLA [ERC20] → `minter()` → Fed → `chair()` → GnosisSafe. Controlled by: `Safe Owners (2/6 required)`. Assess custody — compromise of this chain could affect root token supply.

<details>
<summary>🔓 **3 No-Timelock-in-admin-chain supply finding(s) across 3 contract(s)** — Supply-capable roles with no Timelock in the direct admin chain — a supply-altering call can land in one block once the holder's governance threshold is met. Expand to review each role + holder and verify whether it is a real supply path or a transitive getter-pointer edge. FiRM-lens: no analyst-observable buffer between decision and action.</summary>

- ⚠️ [**No Timelock in admin chain: `minter()` on DOLA [ERC20]**](#c-0x865377367054516e17014ccded1e7d814edc9ce4) — `minter()` has SUPPLY capability and is held by: `0x5E07...7EF7` (Contract), `0x2b34...90fd` (Contract), `0x67FC...f9cC` (Contract) +1 more. No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `chair()` on Fed**](#c-0x5e075e40d01c82b6bf0b0ecdb4eb1d6984357ef7) — `chair()` has SUPPLY capability and is held by: `0x8F97...DfC8` (Safe). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.
- ⚠️ [**No Timelock in admin chain: `chair()` on PSMFed**](#c-0x67fc21332d24fc5250a3b7fc988191ad7f38f9cc) — `chair()` has SUPPLY capability and is held by: `0x8F97...DfC8` (Safe). No Timelock contract appears in the direct admin chain — supply-altering calls can land in a single block once the role-holder's governance threshold is met. FiRM-lens: no analyst-observable buffer between decision and action.

</details>


<details>
<summary>🔄 **8 volatile parameter(s) observed across 2 contract(s) (≥5 historical changes each)** — Operational tempo signal — high-velocity setters indicate active governance maintenance, oracle keepers, or routinely-tuned risk parameters. Expand to review each parameter's change count and current value; assess against the protocol's stated intent.</summary>

- 🔄 [**Observed: volatile parameter `addMinter` on DOLA [ERC20]**](#c-0x865377367054516e17014ccded1e7d814edc9ce4) — `addMinter(address minter_)` changed 29 times. Current value: ``. Assess change pattern.
- 🔄 [**Observed: volatile parameter `removeMinter` on DOLA [ERC20]**](#c-0x865377367054516e17014ccded1e7d814edc9ce4) — `removeMinter(address minter_)` changed 25 times. Current value: ``. Assess change pattern.
- 🔄 [**Observed: volatile parameter `expansion` on Fed**](#c-0x5e075e40d01c82b6bf0b0ecdb4eb1d6984357ef7) — `expansion(uint amount)` changed 58 times. Current value: ``. Assess change pattern.
- 🔄 [**Observed: volatile parameter `contraction` on Fed**](#c-0x5e075e40d01c82b6bf0b0ecdb4eb1d6984357ef7) — `contraction(uint amount)` changed 77 times. Current value: ``. Assess change pattern.
- 🔄 [**Observed: volatile parameter `supplyCeiling` on Fed**](#c-0x2b34548b865ad66a2b046cb82e59ee43f75b90fd) — `changeSupplyCeiling(uint _supplyCeiling)` changed 18 times. Current value: `100000000000000000000000000000 (100,000,000,000.000000e18)`. Assess change pattern.
- 🔄 [**Observed: volatile parameter `ceilings` on Fed**](#c-0x2b34548b865ad66a2b046cb82e59ee43f75b90fd) — `changeMarketCeiling(IMarket _market, uint _ceiling)` changed 129 times. Current value: 49 markets · highest 80M (DOLA-sUSDe market) · 50M ×3 · 20M ×1 · 10M ×3 · 5M ×2 · 3M ×3 · 2.5M ×2 · 2M ×1 · <1M ×3 · 0 ×30 (retired/unfunded) — full per-key breakdown in the Permissioned Parameters table on Fed. Assess change pattern.
- 🔄 [**Observed: volatile parameter `expansion` on Fed**](#c-0x2b34548b865ad66a2b046cb82e59ee43f75b90fd) — `expansion(IMarket market, uint amount)` changed 307 times. Current value: ``. Assess change pattern.
- 🔄 [**Observed: volatile parameter `contraction` on Fed**](#c-0x2b34548b865ad66a2b046cb82e59ee43f75b90fd) — `contraction(IMarket market, uint amount)` changed 177 times. Current value: ``. Assess change pattern.

</details>

- 🎚️ [**Observed: 6 critical parameter levers (HIGH: 3, MEDIUM: 3)**](#sec-critical-params) — Asset has 6 on-chain parameter levers curated as high-impact for lender-side risk. See the 🎚️ Critical Parameter Levers section for the role gate, current value, threshold, and impact of each. These are singular setters / function calls that flip risk surface in one tx — direct dilution, safety-mechanism closure, authority transfer, or oracle repointing. Verify role-gate identities and threshold distance-to-trigger against current operating posture.

### 🟡 MEDIUM (1)

- 🚦 **Observed: no pause() primitive — supply contractable via reduce/shutdown lever** — Supply-altering surface on `DOLA [ERC20]`, `Fed`, `PSMFed` has no pause()/unpause() primitive or PAUSE-tagged role, but new issuance can be halted at the source by contracting supply via `contraction` on Fed, `contraction` on PSMFed — a per-market/asset brake rather than a global freeze. Verify the contraction lever's authority is an acceptable incident response.

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
<a id="c-0x865377367054516e17014ccded1e7d814edc9ce4"></a>
## DOLA [ERC20] `0x865377367054516e17014CcdED1e7d814EDC9ce4`

✅ **Two-step admin transfer:** `setPendingOperator + claimOperator` — prevents accidental hand-off (request → accept flow).

### 🟠 `minter()`

**Privileged write functions:**  
**Capabilities:** 💰 **SUPPLY**
- `mint(address to, uint amount)` — (auto) Create new tokens, increasing total supply `[SUPPLY]`

**Members (4):**

| Address | Name / Type | Risk | Granted | Source | Details |
|---|---|---|---|---|---|
| `0x5E075E40D01c82B6Bf0B0ecdb4Eb1D6984357EF7` | Fed | 🟠 HIGH | 2021-02-23 | Storage+Events · hasRole ✓ |  |
| `0x2b34548b865ad66A2B046cb82e59eE43F75B90fd` | Fed | 🟠 HIGH | — | Storage+Events · hasRole ✓ |  |
| `0x67FC21332D24FC5250a3B7fc988191ad7F38f9cC` | PSMFed | 🟠 HIGH | — | Storage+Events · hasRole ✓ |  |
| `0x6C5Fdc0c53b122Ae0f15a863C349f3A481DE8f1F` | MainnetDolaFlashMinter | 🟠 HIGH | — | Storage+Events · hasRole ✓ |  |

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
| 2 | PSMFed | `(Safe-mediated)` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2025-09-01 |
| 3 | VaultFed | `(Safe-mediated)` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2025-03-04 |
| 4 | MainnetDolaFlashMinter | `(Safe-mediated)` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2024-09-11 |
| 5 | OptiFedCCTP | `(Safe-mediated)` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2024-04-28 |

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

**`removeMinter`** *(per-asset)* 🔄 **ACTIVE** (25 changes)

> ⚠️ **Over-counted history** — the 5 retained history rows resolve to only 3 distinct transaction(s), so some rows are duplicate records of the same call. Treat the change count as an upper bound.

> ⚠️ This parameter has been changed **25 times** — monitor for unexpected modifications.

| Field | Value |
|---|---|
| Setter | `removeMinter(address minter_)` |
| Gated by | `operator()` |
| Tags | `SUPPLY` |
| Last called | 2026-08-03 |
| Called by | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) |
| Total calls | 25 🔄 |

**Recent changes (showing last 5 of 25):**

| # | Asset | Value | Set By | Date |
|---|---|---|---|---|
| 1 | VaultFed | `(Safe-mediated)` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2026-08-03 |
| 2 | PSMFed | `(Safe-mediated)` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2025-12-20 |
| 3 | BaseNetworkFed | `(Safe-mediated)` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2025-07-15 |
| 4 | ArbiFed | `(Safe-mediated)` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2025-07-15 |
| 5 | AuraStablepoolFed | `(Safe-mediated)` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2025-07-15 |

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
> | `0x2723723FDd3Db8ba2D6f0e1B333e90A7E60A0411` | EOA ⚠️ Hot wallet (1,642 txs) | 2023-03-17 | EOA |
> | `0x9F3614afb3Df9f899caDBFfaA05c6C908059F726` | EOA | 2022-10-08 | EOA |
> | `0x962228a90eaC69238c7D1F216d80037e61eA9255` | EOA ⚠️ Hot wallet (1,800 txs) | — | EOA |
> | `0x3FcB35a1CbFB6007f9BC638D388958Bc4550cB28` | EOA ⚠️ Hot wallet (1,460 txs) | — | EOA |
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
> - `changeGov(address newGov_)` `[CONFIG]`
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
> | Tags | `CONFIG` |
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
> | 2 | `3000000000000000000000000 (3,000,000.000000e18)` | `0xEC09...471a` | 2025-08-25 |
> | 3 | `5000000000000000000000000 (5,000,000.000000e18)` | `0xEC09...471a` | 2025-08-04 |
> | 4 | `6000000000000000000000000 (6,000,000.000000e18)` | `0xEC09...471a` | 2025-07-28 |
> | 5 | `amount=375000000000000000000000 (375,000.000000e18)` | `0x8F97...DfC8` (Gnosis Safe 2/6) | 2022-06-24 |

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
> | 2 | `amount=10000000000000000000000000 (10,000,000.000000e18)` | `0x8F97...DfC8` (Gnosis Safe 2/6) | 2022-06-16 |
> | 3 | `amount=5500000000000000000000000 (5,500,000.000000e18)` | `0x8F97...DfC8` (Gnosis Safe 2/6) | 2022-05-28 |
> | 4 | `amount=3500000000000000000000000 (3,500,000.000000e18)` | `0x8F97...DfC8` (Gnosis Safe 2/6) | 2022-05-19 |
> | 5 | `5000000000000000000000000 (5,000,000.000000e18)` | `0x3FcB...cB28` (EOA) | 2022-02-14 |

---
<a id="c-0x2b34548b865ad66a2b046cb82e59ee43f75b90fd"></a>
## > Fed `0x2b34548b865ad66A2B046cb82e59eE43F75B90fd`

> > 💰 **Inherited supply authority** — holds `minter()` on **DOLA [ERC20]**. Access controls on this contract gate root token supply.

> 🔒 **Immutable References:** `dola()` → DOLA, `dbr()` → DBR (DolaBorrowingRights)

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
> | `0x2723723FDd3Db8ba2D6f0e1B333e90A7E60A0411` | EOA ⚠️ Hot wallet (1,642 txs) | 2023-03-17 | EOA |
> | `0x9F3614afb3Df9f899caDBFfaA05c6C908059F726` | EOA | 2022-10-08 | EOA |
> | `0x962228a90eaC69238c7D1F216d80037e61eA9255` | EOA ⚠️ Hot wallet (1,800 txs) | — | EOA |
> | `0x3FcB35a1CbFB6007f9BC638D388958Bc4550cB28` | EOA ⚠️ Hot wallet (1,460 txs) | — | EOA |
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
> - `changeGov(address _gov)` — Change the governance of the Fed contact. Only callable by governance. / `[CONFIG]`
> - `changeSupplyCeiling(uint _supplyCeiling)` — Set the supply ceiling of the Fed. Only callable by governance. / `[SUPPLY]`
> - `changeMarketCeiling(IMarket _market, uint _ceiling)` — Set a market's isolated ceiling of the Fed. Only callable by governance. / `[SUPPLY]`
> - `changeChair(address _chair)` — Set the chair of the fed. Only callable by governance. / `[CONFIG]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x926dF14a23BE491164dCF93f4c468A50ef659D5B` | Compound Timelock (2d) | 🟢 LOW | — | Storage only | 2d delay |

> #### 🔧 Permissioned Parameters

> **`ceilings`** *(per-asset)* 🔄 **ACTIVE** (129 changes)

> > ⚠️ **Over-counted history** — the 5 retained history rows resolve to only 4 distinct transaction(s), so some rows are duplicate records of the same call. Treat the change count as an upper bound.

> > ⚠️ This parameter has been changed **129 times** — monitor for unexpected modifications.

> | Asset | Current Value |
> |---|---|
> | DAI market `0x0971...9b26` | `500000000000000000000 (500.000000e18)` |
> | PT-sUSDE-27MAR2025 market `0x0DFE...4112` | `0` |
> | st-yETH market `0x0c0b...D168` | `0` |
> | yvCurve-reUSD-sDOLA-f market `0x1fD4...6916` | `2500000000000000000000000 (2,500,000.000000e18)` |
> | PT-sUSDE-27NOV2025 market `0x223f...Be68` | `0` |
> | yvyCRV market `0x27b6...F9c4` | `400000000000000000000000 (400,000.000000e18)` |
> | yvCurve-DOLA-wstUSR-f market `0x2868...3537` | `0` |
> | COMP market `0x29fe...93b8` | `0` |
> | cbBTC market `0x2A25...77FF` | `10000000000000000000000000 (10,000,000.000000e18)` |
> | PT-sUSDE-29MAY2025 market `0x2D47...FBD9` | `0` |
> | dola-save market `0x2fed...2FC9` | `0` |
> | cvxCRV market `0x3474...397a` | `3000000000000000000000000 (3,000,000.000000e18)` |
> | sinvUSD market `0x3542...9EaA` | `200000000000000000000000 (200,000.000000e18)` |
> | DOLA/USR market `0x3Ac5...Fd5e` | `0` |
> | wstETH market `0x3FD3...50BC` | `50000000000000000000000000 (50,000,000.000000e18)` |
> | crvDOLA market `0x4797...5B26` | `0` |
> | WBTC market `0x48BA...4E7C` | `10000000000000000000000000 (10,000,000.000000e18)` |
> | yvCurve-DOLA-sUSDS-f market `0x4A33...808b` | `50000000000000000000000000 (50,000,000.000000e18)` |
> | yvCurve-DOLA-sUSDe-f market `0x4E26...db1a` | `20000000000000000000000000 (20,000,000.000000e18)` |
> | yvCurve-DOLA-deUSD-f market `0x4f5e...C08e` | `0` |
> | yvCurve-DOLA-scrvUSD-f market `0x5bb8...1CF2` | `0` |
> | PT-sUSDE-25SEP2025 market `0x6073...dcc5` | `0` |
> | savedola market `0x63D2...37E8` | `0` |
> | WETH market `0x63Df...7035` | `10000000000000000000000000 (10,000,000.000000e18)` |
> | CRV market `0x63fA...1Ee8` | `3000000000000000000000000 (3,000,000.000000e18)` |
> | crvUSDDOLA-f market `0x6A52...631E` | `0` |
> | stETH market `0x743A...1dCf` | `0` |
> | sUSDe market `0x79eF...AEc4` | `5000000000000000000000000 (5,000,000.000000e18)` |
> | gOHM market `0x7Cd3...6b37` | `0` |
> | yvCurve-DOLA-FRXBP-f market `0x8205...C0e3` | `0` |
> | DOLAFRAXBP3CRV-f market `0x87df...72Ea` | `0` |
> | cvxFXS market `0x9368...B31b` | `0` |
> | deUSD/DOLA market `0xB907...8f9a` | `0` |
> | yvCurve-DOLA-USR-f market `0xC008...8cCF` | `0` |
> | savedola market `0xC45E...6C4d` | `5000000000000000000000000 (5,000,000.000000e18)` |
> | DOLA-sUSDS market `0xD68d...4b29` | `50000000000000000000000000 (50,000,000.000000e18)` |
> | PT-USDe-27NOV2025 market `0xF706...b11f` | `0` |
> | sFRAX market `0xFEA3...54f1` | `0` |
> | ysyBOLD market `0xa956...f02d` | `2000000000000000000000000 (2,000,000.000000e18)` |
> | DOLA-sUSDe market `0xb427...4A99` | `80000000000000000000000000 (80,000,000.000000e18)` |
> | INV market `0xb516...330B` | `0` |
> | PT-USDe-25SEP2025 market `0xb686...C867` | `0` |
> | yvCurve-sDOLA-scrvUSD-f market `0xb8bc...D565` | `0` |
> | CVX market `0xdc22...dF6b` | `3000000000000000000000000 (3,000,000.000000e18)` |
> | DOLAwstUSR market `0xe4D4...12E4` | `0` |
> | yvCurve-DOLA-crvUSD-f market `0xe859...C99C` | `0` |
> | yvCurve-DOLA-FRAXPYUSD-f market `0xf013...c4f5` | `0` |
> | PT-sUSDE-31JUL2025 market `0xf85e...2db2` | `0` |
> | reusdsdola market `0xf928...9D9A` | `2500000000000000000000000 (2,500,000.000000e18)` |

> | Field | Value |
> |---|---|
> | Setter | `changeMarketCeiling(IMarket _market, uint _ceiling)` |
> | Gated by | `gov()` |
> | Tags | `SUPPLY` |
> | Last changed | 2026-10-12 |
> | Changed by | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) |
> | Total changes | 129 🔄 |

> **Recent changes (showing last 5 of 129):**

> | # | Asset | Value | Set By | Date |
> |---|---|---|---|---|
> | 1 | ysyBOLD market | `_ceiling=2000000000000000000000000 (2,000,000.000000e18)` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2026-10-12 |
> | 2 | yvCurve-reUSD-sDOLA-f market | `_ceiling=2500000000000000000000000 (2,500,000.000000e18)` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2026-10-11 |
> | 3 | reusdsdola market | `_ceiling=2500000000000000000000000 (2,500,000.000000e18)` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2026-10-11 |
> | 4 | sinvUSD market | `_ceiling=200000000000000000000000 (200,000.000000e18)` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2026-10-09 |
> | 5 | yvCurve-reUSD-sDOLA-f market | `_ceiling=1500000000000000000000000 (1,500,000.000000e18)` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2026-09-05 |

> **`chair`**

> > ⚠️ **Over-counted history** — the 2 retained history rows resolve to only 1 distinct transaction(s), so some rows are duplicate records of the same call. Treat the change count as an upper bound.

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
> | Tags | `CONFIG` |
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

> > ⚠️ **Over-counted history** — the 5 retained history rows resolve to only 3 distinct transaction(s), so some rows are duplicate records of the same call. Treat the change count as an upper bound.

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
> | 2 | `market=0xb516247596Ca36bf32876199FBdCaD6B3322330B · amount=90000000000000000000000 (90,000.000000e18)` | `0x8F97...DfC8` (Gnosis Safe 2/6) | 2026-04-22 |
> | 3 | `market=0x4E264618dC015219CD83dbc53B31251D73c2db1a · amount=13240000000000000000000000 (13,240,000.000000e18)` | `0x8F97...DfC8` (Gnosis Safe 2/6) | 2026-04-20 |
> | 4 | `market=0xb427fC22561f3963B04202F9bb5BCEbd76c14A99 · amount=29670000000000000000000000 (29,670,000.000000e18)` | `0x8F97...DfC8` (Gnosis Safe 2/6) | 2026-04-20 |
> | 5 | `market=0x79eF6d28C41e47A588E2F2ffB4140Eb6d952AEc4 · amount=4990000000000000000000000 (4,990,000.000000e18)` | `0x8F97...DfC8` (Gnosis Safe 2/6) | 2026-04-20 |

> **`expansion`** 🔄 **ACTIVE** (307 changes)

> > ⚠️ **Over-counted history** — the 5 retained history rows resolve to only 4 distinct transaction(s), so some rows are duplicate records of the same call. Treat the change count as an upper bound.

> > ⚠️ This parameter has been changed **307 times** — monitor for unexpected modifications.

> | Field | Value |
> |---|---|
> | Setter | `expansion(IMarket market, uint amount)` |
> | Gated by | `chair()` |
> | Tags | `SUPPLY` |
> | Last called | 2026-10-13 |
> | Called by | `0x8F97...DfC8` (Gnosis Safe 2/6) |
> | Total calls | 307 🔄 |

> **Recent changes (showing last 5 of 307):**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `market=0xa95605313EB4544f784e699dE93e9232DbFcf02d · amount=1990000000000000000000000 (1,990,000.000000e18)` | `0x8F97...DfC8` (Gnosis Safe 2/6) | 2026-10-13 |
> | 2 | `market=0x1fD4985cdd57bDb1eD646B10B7952fCD58946916 · amount=1000000000000000000000000 (1,000,000.000000e18)` | `0x8F97...DfC8` (Gnosis Safe 2/6) | 2026-10-12 |
> | 3 | `market=0xf9287c29Cb888F4834B7D2757a833D509e7f9D9A · amount=1000000000000000000000000 (1,000,000.000000e18)` | `0x8F97...DfC8` (Gnosis Safe 2/6) | 2026-10-12 |
> | 4 | `market=0x3542b39DCedC01f82c6e7af0EEC424726d019EaA · amount=200000000000000000000000 (200,000.000000e18)` | `0x8F97...DfC8` (Gnosis Safe 2/6) | 2026-10-09 |
> | 5 | `market=0xD68d3a44d46dd50BFeBa8Cca544717B76e7C4b29 · amount=3000000000000000000000000 (3,000,000.000000e18)` | `0x8F97...DfC8` (Gnosis Safe 2/6) | 2026-09-28 |

---
<a id="c-0x67fc21332d24fc5250a3b7fc988191ad7f38f9cc"></a>
## > PSMFed `0x67FC21332D24FC5250a3B7fc988191ad7F38f9cC`

> > 💰 **Inherited supply authority** — holds `minter()` on **DOLA [ERC20]**. Access controls on this contract gate root token supply.

> 🔒 **Immutable References:** `psm()` → PSM, `DOLA()` → DOLA

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
> | `0x2723723FDd3Db8ba2D6f0e1B333e90A7E60A0411` | EOA ⚠️ Hot wallet (1,642 txs) | 2023-03-17 | EOA |
> | `0x9F3614afb3Df9f899caDBFfaA05c6C908059F726` | EOA | 2022-10-08 | EOA |
> | `0x962228a90eaC69238c7D1F216d80037e61eA9255` | EOA ⚠️ Hot wallet (1,800 txs) | — | EOA |
> | `0x3FcB35a1CbFB6007f9BC638D388958Bc4550cB28` | EOA ⚠️ Hot wallet (1,460 txs) | — | EOA |
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

> **`supplyCap`**

> | Field | Value |
> |---|---|
> | Current Value | `10000000000000000000000000 (10,000,000.000000e18)` |
> | Setter | `setSupplyCap(uint256 newSupplyCap)` |
> | Gated by | `gov()` |
> | Tags | `SUPPLY` |
> | Last changed | 2025-12-20 |
> | Changed by | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) |
> | Total changes | 1 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `newSupplyCap=10000000000000000000000000 (10,000,000.000000e18)` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2025-12-20 |

> #### 💰 Supply Actions

> _Mint / redeem / burn call tracking — last 5 calls per function, total counts preserved._

> **`contraction`**

> | Field | Value |
> |---|---|
> | Setter | `contraction(uint256 amount)` |
> | Gated by | `chair()` |
> | Tags | `SUPPLY` |
> | Last called | 2026-03-24 |
> | Called by | `0x8F97...DfC8` (Gnosis Safe 2/6) |
> | Total calls | 1 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `amount=200000000000000000000000 (200,000.000000e18)` | `0x8F97...DfC8` (Gnosis Safe 2/6) | 2026-03-24 |

> **`expansion`**

> | Field | Value |
> |---|---|
> | Setter | `expansion(uint256 amount)` |
> | Gated by | `chair()` |
> | Tags | `SUPPLY` |
> | Last called | 2026-04-13 |
> | Called by | `0x8F97...DfC8` (Gnosis Safe 2/6) |
> | Total calls | 2 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `amount=200000000000000000000000 (200,000.000000e18)` | `0x8F97...DfC8` (Gnosis Safe 2/6) | 2026-04-13 |
> | 2 | `amount=200000000000000000000000 (200,000.000000e18)` | `0x8F97...DfC8` (Gnosis Safe 2/6) | 2026-01-04 |

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

> **`maxFlashLimit`**

> | Field | Value |
> |---|---|
> | Current Value | `5000000000000000000000000 (5,000,000.000000e18)` |
> | Setter | `setMaxFlashLimit(uint256 _newLimit)` |
> | Gated by | `owner()` |
> | Tags | — |
> | Last changed | 2024-09-11 |
> | Changed by | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) |
> | Total changes | 1 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `_newLimit=5000000000000000000000000 (5,000,000.000000e18)` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2024-09-11 |

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
<a id="c-0xbeccb6bb0aa4ab551966a7e4b97cec74bb359bf6"></a>
## > GovernorMills `0xBeCCB6bb0aa4ab551966A7E4B97cec74bb359Bf6`

> > 💰 **Inherited supply authority** — holds `admin()` on **Timelock**, upstream of `operator()` on **DOLA [ERC20]**. Access controls on this contract gate root token supply.

> 🔒 **Immutable References:** `inv()` → INV (INV), `xinv()` → XINV (XINV)

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

> | Field | Value |
> |---|---|
> | Current Value | `7270000000000000000000 (7,270.000000e18)` |
> | Setter | `updateProposalThreshold(uint256 newThreshold)` |
> | Gated by | `guardian()` |
> | Tags | — |
> | Last changed | 2026-09-14 |
> | Changed by | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) |
> | Total changes | 3 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `newThreshold=7270000000000000000000 (7,270.000000e18)` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2026-09-14 |
> | 2 | `newThreshold=1900000000000000000000 (1,900.000000e18)` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2022-10-03 |
> | 3 | `newThreshold=1400000000000000000000 (1,400.000000e18)` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2022-05-24 |

> **`quorumVotes`**

> | Field | Value |
> |---|---|
> | Current Value | `24000000000000000000000 (24,000.000000e18)` |
> | Setter | `updateProposalQuorum(uint256 newQuorum)` |
> | Gated by | `guardian()` |
> | Tags | — |
> | Last changed | 2026-09-14 |
> | Changed by | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) |
> | Total changes | 4 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `newQuorum=24000000000000000000000 (24,000.000000e18)` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2026-09-14 |
> | 2 | `newQuorum=15500000000000000000000 (15,500.000000e18)` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2024-01-23 |
> | 3 | `newQuorum=9500000000000000000000 (9,500.000000e18)` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2022-10-03 |
> | 4 | `newQuorum=7000000000000000000000 (7,000.000000e18)` | `0xBeCC...9Bf6` (GovernorMills + Timelock (2d)) | 2022-05-24 |

---
<a id="c-0x941c2699ec7e55a50bde030d8e1e70649839259d"></a>
## > Guardian `0x941c2699eC7E55a50Bde030d8E1e70649839259D`

> > 💰 **Inherited supply authority** — holds `guardian()` on **GovernorMills**, upstream of `operator()` on **DOLA [ERC20]**. Access controls on this contract gate root token supply.

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
> | `0x3FcB35a1CbFB6007f9BC638D388958Bc4550cB28` | EOA ⚠️ Hot wallet (1,460 txs) | — | EOA |
> | `0x962228a90eaC69238c7D1F216d80037e61eA9255` | EOA ⚠️ Hot wallet (1,800 txs) | — | EOA |
> | `0x9F3614afb3Df9f899caDBFfaA05c6C908059F726` | EOA | 2022-06-08 | EOA |
> | `0x6535020cCeB810Bdb3F3cA5e93dE2460FF7989BB` | EOA | — | EOA |
> | `0x2723723FDd3Db8ba2D6f0e1B333e90A7E60A0411` | EOA ⚠️ Hot wallet (1,642 txs) | 2022-07-02 | EOA |

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
| DOLA [ERC20] `0x8653...9ce4` | `operator()` | `setPendingOperator(address newOperator_)`, `addMinter(address minter_)`, `removeMinter(address minter_)`, `mint(address to, uint amount)` +1 more | — |
| Fed `0x5E07...7EF7` | `gov()` | `changeGov(address newGov_)`, `changeChair(address newChair_)` | — |
| Fed `0x2b34...90fd` | `gov()` | `changeGov(address _gov)`, `changeSupplyCeiling(uint _supplyCeiling)`, `changeMarketCeiling(IMarket _market, uint _ceiling)`, `changeChair(address _chair)` | — |
| PSMFed `0x67FC...f9cC` | `gov()` | `setSupplyCap(uint256 newSupplyCap)`, `setChair(address newChair)`, `setPendingGov(address _pendingGov)` | — |
| MainnetDolaFlashMinter `0x6C5F...8f1F` | `owner()` | `setTreasury(address _newTreasury)`, `setMaxFlashLimit(uint256 _newLimit)`, `renounceOwnership()`, `transferOwnership(address newOwner)` | — |
| GovernorMills `0xBeCC...9Bf6` | `timelock()` | `queue(uint proposalId)` | — |

### 🟢 `0x8F97cCA30Dbe80e7a8B462F1dD1a51C32accDfC8` — Gnosis Safe 2/6
Controls **3 role(s)** across **3 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| Fed `0x5E07...7EF7` | `chair()` | `resign()`, `expansion(uint amount)`, `contraction(uint amount)` | — |
| Fed `0x2b34...90fd` | `chair()` | `resign()`, `expansion(IMarket market, uint amount)`, `contraction(IMarket market, uint amount)` | — |
| PSMFed `0x67FC...f9cC` | `chair()` | `expansion(uint256 amount)`, `contraction(uint256 amount)`, `resign()` | — |


---
## ⛔ Sanctions Screening

| Source | Status |
|---|---|
| OFAC SDN | ✅ OFAC SDN screened (124 ETH addresses, cache: 2026-10-14) |
| Chainalysis | ✅ Chainalysis screened |
| **Result** | 23 addresses screened · ✅ 0 flagged |

---
## EOA Exposure Summary

The following roles are held by EOAs:

- **Guardian** → `deployer()` held by EOA `0x3FcB35a1CbFB6007f9BC638D388958Bc4550cB28`
  Functions: `allowCancel(uint proposalId, bool decision)`, `setPendingDeployer(address _deployer)`

---
## ✅ Scan Integrity

No issues detected. All block ranges covered, source and ABI resolved for all contracts.
