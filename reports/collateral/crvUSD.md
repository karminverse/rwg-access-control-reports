# Trustfall — Access Control Report — Curve.Fi USD Stablecoin (crvUSD)

| Field | Value |
|---|---|
| Contract | `0xf939E0A03FB07F59A73314E73794Be0E57ac1b4E` |
| Token | Curve.Fi USD Stablecoin (crvUSD) |
| Name | crvUSD Stablecoin |
| Chain | Ethereum |
| Proxy Status | ✅ No |
| OZ AccessControl | ❌ No |
| Ownable | ❌ No |
| Pausable | — |
| ERC-4626 Vault | — |
| Control Surface | ✅ Fully on-chain |
| Scan Integrity | ✅ No issues detected |
| Report Date | 2026-06-25 23:05 UTC |

### Surface Summary

| Field | Value |
|---|---:|
| Contracts | 5 |
| Role slots | 14 |
| Privileged Fns | 19 |
| EOA Holders | 0 |
| Critical Roles | 0 |

## Changes Since Last Scan

> Comparing **2026-06-03T00:03:52Z** (block 25233152) → **2026-06-25T23:04:54Z** (block 25397794).

> ✅ No changes to roles, parameters, contracts, or findings.


## 📋 Protocol Context

> *From protocol profile: Curve Finance / crvUSD (Stablecoin)*

<details>
<summary><strong>Architecture</strong></summary>

- **Architectural shape:** Immutable Vyper 0.3.7 ERC-20 stablecoin + single-minter pattern. Supply control concentrated in ControllerFactory.admin → OwnershipProxy (Curve DAO dao() + 5/9 emergency multisig). Primary supply lever is set_debt_ceiling on the ControllerFactory. NO TIMELOCK layer between the OwnershipProxy and the ControllerFactory — once an Aragon vote passes, the execute lands in the same block. No pause/blacklist on the token; supply emergencies handled by the asymmetric reduce_debt_ceiling brake (deflationary only).
- Mint distribution (verified 2026-05-28 J1+1 via on-chain eth_call): crvUSD totalSupply ≈ 2.09B. Of that, 720M is allocated to 7 active LLAMMA controllers (wstETH/WBTC/WETH/sfrxETH/tBTC/weETH/cbBTC, each registered in ControllerFactory.controllers[]). The single largest off-registry recipient is Yield Basis Factory at 0x370a449F…100c0 — a 1B crvUSD ceiling, most of it pre-minted and sitting idle awaiting BTC market deployment. YB Factory is NOT a controller in the registry; Curve DAO grants the ceiling via direct set_debt_ceiling() calls (full grant history + live balance + governance links in ceiling_targets[]). Remaining ≈370M sits in PegKeepers + flash-lender + miscellaneous. ControllerFactory.admin() role gates all four mint paths: set_debt_ceiling, add_market, collect_fees_above_ceiling, and rug_debt_ceiling (deflationary burn brake — permissionless).
- Vyper 0.3.7 ERC-20 stablecoin: Curve's native USD stablecoin, pegged to $1
- Not upgradeable — direct deployment, no proxy pattern, immutable bytecode
- **Single minter pattern:** one address stored in self.minter controls mint() and set_minter()
- Minter is ControllerFactory — minting happens indirectly via set_debt_ceiling() on the factory
- No pause mechanism — crvUSD has no pausable functionality
- No blacklist mechanism — crvUSD does not restrict transfers by address
- No commit/apply pattern on the token itself — the token is minimal by design
- burn() and burnFrom() are permissionless (own tokens / approved tokens) — not admin-gated
- EIP-2612 permit() support for gasless approvals
- **Governance chain:** veCRV voting -> Aragon Voting (Ownership) -> Aragon Agent -> OwnershipProxy (dao) -> ControllerFactory (admin) -> crvUSD (minter). On-chain governance only — no Snapshot binding; informational signaling occurs on curve.eth Snapshot space + gov.curve.fi forum.
- LLAMMA (Lending-Liquidating AMM Algorithm): each lending market has its own AMM + Controller pair, deployed via factory blueprints
- **Debt ceiling = supply cap per market:** ControllerFactory.set_debt_ceiling() mints crvUSD to the controller, which lends it out against collateral
- **Asymmetric emergency design:** the 5/9 emergency multisig holds reduce-only authority — it can shrink debt ceilings, change monetary policy, and pause new borrowing, but it cannot mint new crvUSD or transfer ownership. Inflationary actions require a full Curve DAO vote (veCRV).
- FiRM-lens observation context (2026-06-02): crvUSD lending markets were OFFBOARDED from Inverse FiRM on 2026-02-18 (GovernorMills proposal #350) amid crvUSD peg instability under broad market stress, compounded by the Yield Basis 1B crvUSD credit line and its effect on peg dynamics. The RWG is now in an OBSERVATION PHASE ahead of any reintroduction — this scan/debrief is an architecture-observation checkpoint, NOT a re-onboarding. The largest single counterparty, Yield Basis (0x370a449F…100c0, 1B ceiling — see ceiling_targets[]), is mid-migration as of 2026-06 (hybrid vaults → v3 pools). Reintroduction watch-items, the migration proposals (#35/#46), and gating criteria are captured in decisions[] 'FiRM offboarding + RWG observation phase'.

</details>

<details>
<summary><strong>Function Interaction Paths</strong></summary>

- **`set_minter(address _minter)`** (`minter()`)
  - Reassigns the sole minter address — new address gains mint() and set_minter() authority
  - Previous minter immediately loses all privileged access
  - No event emitted — change is invisible to event-based monitoring (SILENT SETTER)
  - No two-step transfer, no timelock — takes effect in a single transaction
  - ⚠️ *Single most dangerous function on the token. A compromised minter can transfer the role to any address and begin unlimited minting. The silent setter means event monitors will not detect the change.*
- **`ControllerFactory.set_debt_ceiling(controller, amount)`** (`ControllerFactory.admin() (via OwnershipProxy)`)
  - If amount > current ceiling: ControllerFactory calls crvUSD.mint() to fund the controller with the difference
  - If amount < current ceiling: ControllerFactory calls crvUSD.burnFrom() to reduce the controller's allocation
  - This is the PRIMARY supply expansion/contraction mechanism for crvUSD
  - ⚠️ *Debt ceiling increases directly mint new crvUSD. The ControllerFactory is the only path to inflationary supply changes. Ceiling changes are gated by DAO governance vote.*
- **`ControllerFactory.set_implementations(controller, amm)`** (`ControllerFactory.admin() (via OwnershipProxy)`)
  - Changes the blueprint contracts used for deploying NEW lending markets
  - Does NOT affect existing markets — only future deployments
  - Malicious blueprints could create controllers that drain minted crvUSD
  - ⚠️ *Blueprint replacement is a soft upgrade vector. While existing markets are safe, a malicious implementation could steal funds from new markets.*
- **`ControllerFactory.set_fee_receiver(fee_receiver)`** (`ControllerFactory.admin() (via OwnershipProxy)`)
  - Redirects all protocol fee revenue to a new address
  - Fees include borrowing interest and AMM trading fees
  - ⚠️ *Fee diversion — can redirect protocol revenue. Not supply-altering but significant for protocol economics.*
- **`OwnershipProxy.execute(target, calldata)`** (`OwnershipProxy.dao() (Aragon Agent / Curve DAO)`)
  - Arbitrary external call from the OwnershipProxy address — can call any function on any contract
  - This is how DAO governance votes execute changes on the ControllerFactory and other Curve contracts
  - ⚠️ *Unrestricted execute — dao() can perform any action the OwnershipProxy is authorized for. This is the DAO's execution primitive.*
- **`OwnershipProxy.reduce_debt_ceiling(factory, controller, amount)`** (`OwnershipProxy.emergency() OR OwnershipProxy.dao()`)
  - Reduces a lending market's debt ceiling — calls factory to burn excess crvUSD
  - Emergency role can reduce ceilings (deflationary) but NOT increase them
  - ⚠️ *Emergency brake for the 5/9 multisig. Can reduce exposure quickly without waiting for a DAO vote. Cannot be used to mint — asymmetric by design.*
- **`OwnershipProxy.set_monetary_policy(controller, policy)`** (`OwnershipProxy.emergency() OR OwnershipProxy.dao()`)
  - Changes the interest rate model for a lending market
  - Monetary policy contract determines borrow rates based on utilization
  - ⚠️ *Rate manipulation — a malicious monetary policy could set extreme rates. Emergency multisig can change this without DAO vote.*

</details>

<a id="sec-ceiling-targets"></a>
<details>
<summary><strong>🎯 Off-Registry Mint Recipients</strong></summary>

> *2 off-registry mint recipients declared. These addresses hold non-zero ceilings on a factory-style mint contract WITHOUT appearing in its own registry array — exactly the gap class that hid Yield Basis Factory's 1B crvUSD ceiling from the J1 scan. Each entry was added by the analyst per /debrief §11d after event-derived recipient enumeration; cross-check the declared_ceiling against current on-chain state if any figure looks stale.*

- **`0x370a449FeBb9411c95bf897021377fe0B7D100c0`** — *Yield Basis Factory*
    - *Declared ceiling:* `1,000,000,000`
    - *Current balance:* `≈771M idle (2026-06-02 snapshot; drifts as YB draws the line — read live via balanceOf(YB))`
    - *Declared at block:* `25196360`
    - *Governance:* [https://gov.curve.finance/t/increase-credit-line-to-yield-basis-to-1b-crvusd/10930](https://gov.curve.finance/t/increase-credit-line-to-yield-basis-to-1b-crvusd/10930)
    - *Notes:* Yield Basis is a Michael Egorov / Curve-affiliated protocol that uses
      crvUSD-as-collateral for BTC strategies. It is NOT a controller in
      ControllerFactory.controllers[] — Curve DAO grants the ceiling via
      direct set_debt_ceiling(YB_Factory, X) calls. Grant history:
        - Sept 2025 proposal #1206: 60M initial credit line
        - Oct 2025: raised to 300M
        - Dec 13 2025: raised to 1B (99.89% in favor)
      Most of the 1B ceiling is pre-minted into the YB Factory and sits idle
      awaiting deployment against BTC strategies (≈771M at the 2026-06-02
      snapshot, rising as YB draws on the line). This is the largest single
      counterparty in crvUSD's trust topology — the 1B ceiling is ~48% of
      totalSupply (~2.09B).
      Cross-reference: ASSET-7 in TODOS for "audit YB Factory's own controls"
      as separate scope (out of crvUSD BFS but in lender-lens scope).
      RWG observation-window lever (2026-06-02): this YB Factory ceiling is the
      RWG's PRIMARY on-chain watch-item during the post-offboarding observation
      phase (see decisions[] 'FiRM offboarding + RWG observation phase'). Two
      distinct things move, with different monitoring:
        - The ceiling VALUE (the debt_ceiling[YB] param) IS scanner-tracked — a
          change past reviewed_at_block fires PROFILE_LEVER_STALE automatically.
        - The pre-minted token BALANCE is NOT a tracked param (it is balanceOf,
          not a setter-written value); it drifts continuously and is NOT covered
          by that gate — read it live via balanceOf(YB) each observation scan.
      YB is mid-migration (hybrid vaults → v3 pools) — see decisions[] +
      references[] proposals #35/#46; watch legacy-market ceiling wind-downs vs
      new-architecture allocations as the migration completes.
- **`PEG_KEEPERS`** — *PegKeepers (1.0/1.1/V2) collective*
    - *Declared ceiling:* `≈ 320M crvUSD (sum across PK1.0/1.1/V2)`
    - *Current balance:* `TBD — populate next cycle`
    - *Declared at block:* `25196360`
    - *Governance:* [https://docs.curve.fi/crvUSD/pegkeepers/overview/](https://docs.curve.fi/crvUSD/pegkeepers/overview/)
    - *Notes:* crvUSD PegKeepers are stabilisation contracts that mint crvUSD to deposit
      into Curve stablecoin pools when crvUSD trades above $1, and withdraw to
      contract balance when below. Multiple deployed: PK1.0 (USDC, USDT, USDP,
      TUSD pairs) + PK1.1 + PKV2. Each has its own debt_ceiling on the factory.
      Not yet individually enumerated in this cycle — populate next pass.

</details>

<a id="sec-critical-params"></a>
<details>
<summary><strong>🎚️ Critical Parameter Levers</strong></summary>

> *9 on-chain parameter levers that are curated as high-impact for lender-side risk (direct dilution / safety-mechanism closure / authority transfer / oracle repointing). Each entry shows current value, the threshold that triggers the impact, and the role-holder controlling the lever.*

- **`set_minter(address _minter)`** 🔴 on [**crvUSD (0xf939E0A03FB07F59A73314E73794Be0E57ac1b4E)**](#c-0xf939e0a03fb07f59a73314e73794be0e57ac1b4e)
    - *Role gate:* minter() = ControllerFactory 0xC9332fdCB1C491Dcc683bAe86Fe3cb70360738BC
    - *Live current value (as of block 17,257,968):* `0xC9332fdCB1C491Dcc683bAe86Fe3cb70360738BC`
    - *Recorded changes:* 1 historical event(s); last setter `0xbabe61887f1de2713c6f97e567623453d3C79f67`
    - *Profile-declared value (verified at block 25,231,628):* `minter = ControllerFactory 0xC9332fdCB1C491Dcc683bAe86Fe3cb70360738BC (changed once since deploy, 2023-05-14)`
    - *Threshold:* Any change rotates the SOLE supply authority on the token. There is no whitelist — single-slot address.
    - *Impact:* SUBSTITUTION / SUPPLY (lender-critical). Silent setter — no event emitted. Whoever holds minter() can call set_minter() to hand the role to any address, then begin unlimited minting in the next block. No two-step transfer, no timelock buffer. The minter combines supply authority AND admin transfer in one slot. A compromised minter is the single most dangerous outcome on the token. Currently held by ControllerFactory, which is gated by OwnershipProxy.admin() → Curve DAO governance — so practical compromise requires DAO capture OR a flaw in the ControllerFactory.
- **`execute(address _target, bytes _data)`** 🔴 on [**OwnershipProxy (0xb7400D2EA0f6DC1d7b153aA430B9E572F28afB79)**](#c-0xb7400d2ea0f6dc1d7b153aa430b9e572f28afb79)
    - *Role gate:* dao() = Aragon Agent 0x40907540d8a6C65c637785e8f8B742ae6b0b9968 (Curve DAO veCRV votes)
    - *Profile-declared value (verified at block 25,231,628):* `Generic execute primitive — any calldata to any target, executed in the OwnershipProxy's authority context`
    - *Threshold:* Any call from this primitive that targets the ControllerFactory can mint crvUSD, change blueprints, or transfer factory ownership
    - *Impact:* META_ADMIN (lender-critical CAPABILITY; governance-gated LIKELIHOOD). The OwnershipProxy is the admin of the ControllerFactory; .execute() lets the DAO route any call — the ultimate authority over crvUSD supply, blueprints, and configuration. Governance flow: Curve Ownership Voting → Aragon Agent dao() → OwnershipProxy.execute(); a passed vote landing this is the canonical supply-expansion path. The buffer is the Ownership vote itself — a hard ~7-day veCRV voting period, verified non-collapsible (see the 'Aragon upgrade-control + vote-timing VERIFIED' decision). There is no separate TimelockController, but the vote period IS the analyst-observable buffer between decision and execution — the scanner surfaces this as a LOW 'Supply authority gated by governance vote', not a no-timelock HIGH.
- **`set_debt_ceiling(address _controller, uint256 _debt_ceiling)`** 🔴 on [**ControllerFactory (0xC9332fdCB1C491Dcc683bAe86Fe3cb70360738BC)**](#c-0xc9332fdcb1c491dcc683bae86fe3cb70360738bc)
    - *Role gate:* ControllerFactory.admin() = OwnershipProxy 0xb7400D2EA0f6DC1d7b153aA430B9E572F28afB79 (Curve DAO)
    - *Live current value (as of block 24,923,298):* `31 markets · highest 1B (Factory) · 200M ×2 · 150M ×1 · 135M ×2 · 50M ×3 · 45M ×1 · 30M ×1 · 20M ×1 · 15M ×1 · +1 more tier · <1M ×3 · 0 ×14 (retired/unfunded)`
      *Full per-market breakdown in the Permissioned Parameters table.*
    - *Recorded changes:* 66 historical event(s); last setter `0xc6f3aAc21d8282f166938a8B30a9Ec62De30aCcC`
    - *Profile-declared value (verified at block 25,231,628):* `crvUSD totalSupply ≈ 2.09B (verified 2026-05-28). The scanner auto-binds and renders all 31 keyed debt_ceiling recipients with live values + names from SetDebtCeiling discovery — LLAMMA market controllers (~720M), 4× PegKeeper V2 (~324M), FlashLender (30M), CurveLendMinterFactory (15M), 3× FastBridge. Dominant off-registry lever: Yield Basis Factory = 1B ceiling (see ceiling_targets[]). Full per-key table + change history render live in the report's mapping block — omitted here per K1 (live values bind automatically; an EOA-held ceiling would auto-flag CRITICAL).`
    - *Threshold:* Increase = direct crvUSD mint to the recipient (controller OR any off-registry target like YB Factory). Decrease = burnFrom() the recipient. PRIMARY supply expansion/contraction mechanism. Function description says it literally: 'mint the token amount given for it'.
    - *Impact:* SUPPLY (lender-CRITICAL). Calls STABLECOIN.mint(addr, to_mint) directly via _set_debt_ceiling. Recipient can be ANY address — registry membership is not required. Ceiling increases are inflationary and gated by full Curve DAO vote (veCRV, ~7-day Aragon vote period). The DAO-gate softens LIKELIHOOD but not CAPABILITY — a single DAO-approved tx can mint billions to any address. Ceiling decreases (deflationary) can also be triggered by the 5/9 emergency multisig via OwnershipProxy.reduce_debt_ceiling — asymmetric brake. Severity bumped HIGH→CRITICAL on 2026-05-28 J1+1 after source-grep revealed direct mint capability + Yield Basis 1B off-registry allocation.
- **`add_market(address token, uint256 A, uint256 fee, uint256 admin_fee, address _price_oracle_contract, address monetary_policy, uint256 loan_discount, uint256 liquidation_discount, uint256 debt_ceiling)`** 🔴 on [**ControllerFactory (0xC9332fdCB1C491Dcc683bAe86Fe3cb70360738BC)**](#c-0xc9332fdcb1c491dcc683bae86fe3cb70360738bc)
    - *Role gate:* ControllerFactory.admin() = OwnershipProxy 0xb7400D2EA0f6DC1d7b153aA430B9E572F28afB79 (Curve DAO)
    - *Profile-declared value (verified at block 25,231,628):* `9 markets deployed historically (n_collaterals=9; 7 active, 2 retired with ceiling=0). Last add_market call: 2024 era (per ControllerCreated event history).`
    - *Threshold:* Each call deploys a new (controller, AMM) pair via blueprint + initial debt_ceiling allocation. Mints `debt_ceiling` crvUSD to the new controller in the same tx.
    - *Impact:* SUPPLY (lender-CRITICAL). Calls _set_debt_ceiling(new_controller, debt_ceiling, True) which calls STABLECOIN.mint(new_controller, to_mint). This is the primary entry point for net-new crvUSD market expansion. A malicious add_market call could deploy a controller with arbitrary collateral + monetary_policy + receive an unlimited ceiling allocation, then liquidate-to-self for free crvUSD. Gated by Curve DAO vote → softens LIKELIHOOD, not CAPABILITY. Severity surfaced 2026-05-28 J1+1 (gap in J1 cycle).
- **`collect_fees_above_ceiling(address _to)`** 🟠 on [**ControllerFactory (0xC9332fdCB1C491Dcc683bAe86Fe3cb70360738BC)**](#c-0xc9332fdcb1c491dcc683bae86fe3cb70360738bc)
    - *Role gate:* ControllerFactory.admin() = OwnershipProxy 0xb7400D2EA0f6DC1d7b153aA430B9E572F28afB79 (Curve DAO)
    - *Profile-declared value (verified at block 25,231,628):* `Operational fee-collection function; called per-market when admin fees exceed controller balance.`
    - *Threshold:* If admin_fees > balanceOf(controller), calls STABLECOIN.mint(controller, diff) to fund the fee withdrawal. Mint amount = admin_fees - balanceOf.
    - *Impact:* SUPPLY (lender-HIGH). Direct mint of admin fees without explicit DAO vote per call — the DAO has already authorized the fee-stream via add_market + the controller config. Limited per-call magnitude (bounded by accrued fees), but unbounded in cumulative effect. Surfaced 2026-05-28 J1+1.
- **`rug_debt_ceiling(address _to)`** 🟢 on [**ControllerFactory (0xC9332fdCB1C491Dcc683bAe86Fe3cb70360738BC)**](#c-0xc9332fdcb1c491dcc683bae86fe3cb70360738bc)
    - *Role gate:* PERMISSIONLESS (any caller; no msg.sender check)
    - *Profile-declared value (verified at block 25,231,628):* `Brake function — burns excess crvUSD if controller balance > current debt_ceiling.`
    - *Threshold:* Calls _set_debt_ceiling(_to, debt_ceiling[_to], False) which calls STABLECOIN.burnFrom(addr, diff). Only burns, never mints.
    - *Impact:* DEFLATIONARY BRAKE (low FiRM concern, but worth surfacing). Permissionless — any actor can call. Cannot expand supply. Designed for auto-cleanup of retired markets. Surfaced 2026-05-28 J1+1 for completeness; the permissionless property is itself a feature (anyone can enforce the deflationary brake without DAO action).
- **`set_implementations(address _controller, address _amm)`** 🟠 on [**ControllerFactory (0xC9332fdCB1C491Dcc683bAe86Fe3cb70360738BC)**](#c-0xc9332fdcb1c491dcc683bae86fe3cb70360738bc)
    - *Role gate:* ControllerFactory.admin() = OwnershipProxy 0xb7400D2EA0f6DC1d7b153aA430B9E572F28afB79 (Curve DAO)
    - *Live current value (as of block 17,257,965):* `0xe3e3Fb7E9f48d26817b7210C9bD6B22744790415`
    - *Recorded changes:* 1 historical event(s); last setter `0xbabe61887f1de2713c6f97e567623453d3C79f67`
    - *Profile-declared value (verified at block 25,231,628):* `Current controller + AMM blueprint addresses on the factory (resolve via scan)`
    - *Threshold:* Any change affects ONLY new markets, not existing ones — soft upgrade vector
    - *Impact:* UPGRADE (lender-high for new markets, neutral for existing collateral). Malicious blueprints in future markets could create controllers that divert minted crvUSD on deployment. FiRM lens: relevant only if FiRM ever opens markets backed by crvUSD minted into a future-blueprint controller. Existing collateral is structurally safe — old markets keep their old implementations.
- **`reduce_debt_ceiling(address _factory, address _controller, uint256 _amount)`** 🟢 on [**OwnershipProxy (0xb7400D2EA0f6DC1d7b153aA430B9E572F28afB79)**](#c-0xb7400d2ea0f6dc1d7b153aa430b9e572f28afb79)
    - *Role gate:* OwnershipProxy.emergency() = Gnosis Safe 5/9 0x467947EE34aF926cF1DCac093870f613C96B1E0c OR dao()
    - *Profile-declared value (verified at block 25,231,628):* `Reducer-only action — no current 'value' to surface`
    - *Threshold:* Any call shrinks a controller's debt ceiling and burns excess crvUSD. Cannot expand.
    - *Impact:* DEFLATIONARY BRAKE (low FiRM concern). Asymmetric by design — the 5/9 emergency multisig can act faster than a DAO vote to reduce exposure, but cannot mint. From a lender perspective, this is structurally safe (the multisig's worst case is shrinking the market, not expanding it).
- **`set_monetary_policy(address _controller, address _policy)`** 🟡 on [**OwnershipProxy (0xb7400D2EA0f6DC1d7b153aA430B9E572F28afB79)**](#c-0xb7400d2ea0f6dc1d7b153aa430b9e572f28afb79)
    - *Role gate:* OwnershipProxy.emergency() OR dao() (5/9 multisig OR Curve DAO)
    - *Profile-declared value (verified at block 25,231,628):* `Per-market — each lending market has its own monetary policy contract`
    - *Threshold:* Replacing the policy changes the interest-rate model. Extreme rate settings could starve borrowers or accelerate liquidations.
    - *Impact:* CONFIG (medium). The 5/9 emergency multisig can change rates without a DAO vote. From FiRM's lens this is yield-side noise unless rates are pushed to extremes that meaningfully change utilization dynamics on a FiRM-relevant market.

</details>

## 📑 Table of Contents

1. [Analyst Focus Areas](#analyst-focus-areas)
2. Contracts
   - [crvUSD ★](#c-0xf939e0a03fb07f59a73314e73794be0e57ac1b4e)
   - [crvUSD ControllerFactory](#c-0xc9332fdcb1c491dcc683bae86fe3cb70360738bc)
   - [Vyper_contract](#c-0xb7400d2ea0f6dc1d7b153aa430b9e572f28afb79)
   - [Agent](#c-0x40907540d8a6c65c637785e8f8b742ae6b0b9968)
3. [⚡ Authority Concentration](#-authority-concentration)
4. [⛔ Sanctions Screening](#-sanctions-screening)
5. [EOA Exposure Summary](#eoa-exposure-summary)
6. [✅ Scan Integrity](#scan-integrity)

## Analyst Focus Areas

> **Observational findings — not risk determinations.** Each item below is a focus point for the Risk Analyst to interpret against collateralization context and the protocol's stated intent. Attention levels (CRITICAL / HIGH / LOW) reflect the scanner's heuristic weight — not a realized risk to FiRM. These observations support future risk assessments; they do not constitute one.

> **1 critical-attention** and **7 high-attention** observation(s) across 5 contract(s).


### 🔴 CRITICAL (1)

- 🎚️ [**Observed: 9 critical parameter levers (CRITICAL: 4, HIGH: 2, MEDIUM: 1, LOW: 2)**](#sec-critical-params) — Asset has 9 on-chain parameter levers curated as high-impact for lender-side risk. See the 🎚️ Critical Parameter Levers section for the role gate, current value, threshold, and impact of each. These are singular setters / function calls that flip risk surface in one tx — direct dilution, safety-mechanism closure, authority transfer, or oracle repointing. Verify role-gate identities and threshold distance-to-trigger against current operating posture.

### 🟠 HIGH (7)

- 💰 **Observed: 2 role(s) with supply-altering capability** — Supply-altering surface detected: `admin()` on crvUSD ControllerFactory, `minter()` on crvUSD Stablecoin. Assess each holder's custody and governance.
- 🔗 [**Observed: supply authority chain on Agent**](#c-0x40907540d8a6c65c637785e8f8b742ae6b0b9968) — Chain: crvUSD ControllerFactory → `admin()` → crvUSD Stablecoin → `minter()` → Agent. Controlled by: `upgradeability (Proxy (ERC-1967))`. Assess custody — compromise of this chain could affect root token supply.
- 🔗 [**Observed: supply authority chain on GnosisSafe**](#c-0xb7400d2ea0f6dc1d7b153aa430b9e572f28afb79) — Chain: crvUSD ControllerFactory → `admin()` → crvUSD Stablecoin → `minter()` → GnosisSafe. Controlled by: `Safe Owners (5/9 required)`. Assess custody — compromise of this chain could affect root token supply.
- 🔗 [**Observed: supply authority chain on Vyper_contract**](#c-0xb7400d2ea0f6dc1d7b153aa430b9e572f28afb79) — Chain: crvUSD ControllerFactory → `admin()` → crvUSD Stablecoin → `minter()` → Vyper_contract. Controlled by: `dao()`, `emergency()`. Assess custody — compromise of this chain could affect root token supply.

<details>
<summary>🔄 **1 volatile parameter(s) observed across 1 contract(s) (≥5 historical changes each)** — Operational tempo signal — high-velocity setters indicate active governance maintenance, oracle keepers, or routinely-tuned risk parameters. Expand to review each parameter's change count and current value; assess against the protocol's stated intent.</summary>

- 🔄 [**Observed: volatile parameter `debt_ceiling` on crvUSD ControllerFactory**](#c-0xc9332fdcb1c491dcc683bae86fe3cb70360738bc) — `set_debt_ceiling(address _to, uint256 debt_ceiling)` changed 66 times. Current value: 31 markets · highest 1B (Factory) · 200M ×2 · 150M ×1 · 135M ×2 · 50M ×3 · 45M ×1 · 30M ×1 · 20M ×1 · 15M ×1 · +1 more tier · <1M ×3 · 0 ×14 (retired/unfunded) — full per-key breakdown in the Permissioned Parameters table on crvUSD ControllerFactory. Assess change pattern.

</details>

- 🎯 [**Observed: 2 off-registry mint recipients declared — declared total 1,000,000,000**](#sec-ceiling-targets) — Asset has 2 off-registry mint recipients declared in profile.ceiling_targets[] — these are addresses that hold a non-zero ceiling on a factory-style mint contract WITHOUT appearing in any registry array the scanner enumerates. See the 🎯 Off-Registry Mint Recipients section for the target identity, declared ceiling, governance link, and recovery path of each. Verify against on-chain event-derived recipients via `eth_getLogs` on the relevant setter event; any unexplained recipient with non-zero allocation is a /debrief §11d finding.

### 🟢 LOW (3)

- 🟢 [**Observed: Aragon-gated upgrade path on Agent**](#c-0x40907540d8a6c65c637785e8f8b742ae6b0b9968) — Upgrades go through the aragonOS Kernel ACL (`APP_MANAGER_ROLE`) held by Curve: Ownership Agent (`0x40907540d8a6C65c637785e8f8B742ae6b0b9968`) — enacted only via a DAO governance vote. The vote period is the on-chain observation window; there is no separate TimelockController contract.
- 🟢 [**Supply authority gated by governance vote: `minter()` on crvUSD Stablecoin**](#c-0xf939e0a03fb07f59a73314e73794be0e57ac1b4e) — `minter()` has SUPPLY capability, but its authority chain resolves to a governance-controlled aragonOS Agent (`0x4090...9968` — Curve: Ownership Agent). Supply-altering calls require an on-chain governance vote (a multi-day voting period), not a single-block transaction. No separate TimelockController is present — the voting period IS the analyst-observable buffer.
- 🟢 [**Supply authority gated by governance vote: `admin()` on crvUSD ControllerFactory**](#c-0xc9332fdcb1c491dcc683bae86fe3cb70360738bc) — `admin()` has SUPPLY capability, but its authority chain resolves to a governance-controlled aragonOS Agent (`0x4090...9968` — Curve: Ownership Agent). Supply-altering calls require an on-chain governance vote (a multi-day voting period), not a single-block transaction. No separate TimelockController is present — the voting period IS the analyst-observable buffer.

### 🟡 MEDIUM (1)

- 🚦 **Observed: no pause() primitive — supply contractable via reduce/shutdown lever** — Supply-altering surface on `crvUSD ControllerFactory`, `crvUSD Stablecoin` has no pause()/unpause() primitive or PAUSE-tagged role, but new issuance can be halted at the source by contracting supply via `reduce_debt_ceiling` on Vyper_contract — a per-market/asset brake rather than a global freeze. Verify the contraction lever's authority is an acceptable incident response.

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
<a id="c-0xf939e0a03fb07f59a73314e73794be0e57ac1b4e"></a>
## crvUSD Stablecoin `0xf939E0A03FB07F59A73314E73794Be0E57ac1b4E`

### 🟠 `minter()`

**Privileged write functions:**  
**Capabilities:** 💰 **SUPPLY**
- `mint(address _to, uint256 _value)` — @notice Mint `_value` amount of tokens to `_to`. `[SUPPLY]`
- `set_minter(address _minter)` `[SUPPLY]`

**Members (1):**

| Address | Name / Type | Risk | Granted | Source | Details |
|---|---|---|---|---|---|
| `0xC9332fdCB1C491Dcc683bAe86Fe3cb70360738BC` | crvUSD ControllerFactory | 🟠 HIGH | — | Storage+Events |  |

#### 🔧 Permissioned Parameters

**`minter`** 🔴 **SILENT** *(no event)*

> 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

| Field | Value |
|---|---|
| Current Value | `0xC9332fdCB1C491Dcc683bAe86Fe3cb70360738BC` |
| Setter | `set_minter(address _minter)` |
| Gated by | `minter()` |
| Tags | `SUPPLY` |
| Last changed | 2023-05-14 |
| Changed by | `0xbabe...9f67` |
| Total changes | 1 |

**Recent changes:**

| # | Value | Set By | Date |
|---|---|---|---|
| 1 | `0xC9332fdCB1C491Dcc683bAe86Fe3cb70360738BC` | `0xbabe...9f67` | 2023-05-14 |

#### 💰 Supply Actions

_Mint / redeem / burn call tracking — last 5 calls per function, total counts preserved._

**`mint`** *(per-asset)* ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> This parameter has never been changed since deployment.

| Field | Value |
|---|---|
| Setter | `mint(address _to, uint256 _value)` |
| Gated by | `minter()` |
| Tags | `SUPPLY` |
| Last called | — |
| Called by | — |
| Total calls | 0 ❄️ |

---
<a id="c-0xc9332fdcb1c491dcc683bae86fe3cb70360738bc"></a>
## > crvUSD ControllerFactory `0xC9332fdCB1C491Dcc683bAe86Fe3cb70360738BC`

> > 💰 **Inherited supply authority** — holds `minter()` on **crvUSD Stablecoin**. Access controls on this contract gate root token supply.

> 🔒 **Immutable References:** `feeReceiver()` → FeeSplitter, `fee_receiver()` → FeeSplitter, `implementations()` → LLAMMA - crvUSD AMM, `amm_implementation()` → LLAMMA - crvUSD AMM, `controller_implementation()` → crvUSD Controller

### > 🟠 `admin()`

> **Privileged write functions:**  
> **Capabilities:** ⚙️ **CONFIG** 💰 **SUPPLY**
> - `set_implementations(address controller, address amm)` — @notice Set new implementations (blueprints) for controller and amm. Doesn't change existing ones
> - `set_admin(address admin)` — @notice Set admin of the factory (should end up with DAO) `[CONFIG]`
> - `set_fee_receiver(address fee_receiver)` — @notice Set fee receiver who earns interest (DAO)
> - `set_debt_ceiling(address _to, uint256 debt_ceiling)` — @notice Set debt ceiling of the address - mint the token amount given for it `[SUPPLY]`
> - `collect_fees_above_ceiling(address _to)` — @notice If the receiver is the controller - increase the debt ceiling if it's not enough to claim admin fees `[SUPPLY]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0xb7400D2EA0f6DC1d7b153aA430B9E572F28afB79` | Contract | 🟠 HIGH | — | Storage+Events |  |

### > 🟠 `market()` · 📋 operational


> **Members (8):**

> | Address | Name / Type | Granted | Source | Details |
> |---|---|---|---|---|
> | `0x18084fbA666a33d37592fA2633fD49a74DD93a88` | tBTC (TBTC) | — | Events only |  |
> | `0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599` | WBTC (WBTC) | — | Events only |  |
> | `0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0` | wstETH (WstETH) | — | Events only |  |
> | `0x8236a87084f8B84306f72007F36F2618A5634494` | LBTC (TransparentUpgradeableProxy) | — | Events only |  |
> | `0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2` | WETH (WETH9) | — | Events only |  |
> | `0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee` | weETH (UUPSProxy) | — | Events only |  |
> | `0xac3E018457B222d93114458476f3E3416Abbe38F` | sfrxETH (sfrxETH) | — | Events only |  |
> | `0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf` | cbBTC (FiatTokenProxy) | — | Events only |  |

> #### 🔧 Permissioned Parameters

> **`admin`** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> | Field | Value |
> |---|---|
> | Current Value | `0xb7400D2EA0f6DC1d7b153aA430B9E572F28afB79` |
> | Setter | `set_admin(address admin)` |
> | Gated by | `admin()` |
> | Tags | `CONFIG` |
> | Last changed | 2023-05-14 |
> | Changed by | `0xbabe...9f67` |
> | Total changes | 1 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `0x40907540d8a6C65c637785e8f8B742ae6b0b9968` | `0xbabe...9f67` | 2023-05-14 |

> **`amm_implementation`** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> | Field | Value |
> |---|---|
> | Current Value | `0x2B7e624bdb839975d56D8428d9f6A4cf1160D3e9` |
> | Setter | `set_implementations(address controller, address amm)` |
> | Gated by | `admin()` |
> | Tags | — |
> | Last changed | 2023-05-14 |
> | Changed by | `0xbabe...9f67` |
> | Total changes | 1 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `controller=0x856fF1aaff4782eEe27D2C6bbAd48781F57f88CC · amm=0x7Ec8e02b74CDD1C1c222DbF3Bf47F3256B734099` | `0xbabe...9f67` | 2023-05-14 |

> **`controller_implementation`** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> | Field | Value |
> |---|---|
> | Current Value | `0xe3e3Fb7E9f48d26817b7210C9bD6B22744790415` |
> | Setter | `set_implementations(address controller, address amm)` |
> | Gated by | `admin()` |
> | Tags | — |
> | Last changed | 2023-05-14 |
> | Changed by | `0xbabe...9f67` |
> | Total changes | 1 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `controller=0x856fF1aaff4782eEe27D2C6bbAd48781F57f88CC · amm=0x7Ec8e02b74CDD1C1c222DbF3Bf47F3256B734099` | `0xbabe...9f67` | 2023-05-14 |

> **`debt_ceiling`** *(per-asset)* 🔄 **ACTIVE** (66 changes)

> > ⚠️ This parameter has been changed **66 times** — monitor for unexpected modifications.

> | Asset | Current Value |
> |---|---|
> | Peg Keeper V2 `0x0B50...C820` | `0` |
> | Peg Keeper V2 `0x0a05...97D3` | `0` |
> | wstETH market `0x100d...C6CE` | `150000000000000000000000000 (150,000,000.000000e18)` |
> | tBTC market `0x1C91...E704` | `50000000000000000000000000 (50,000,000.000000e18)` |
> | Peg Keeper `0x1ef8...cCae` | `0` |
> | crvUSD FlashLender `0x26dE...9eE1` | `30000000000000000000000000 (30,000,000.000000e18)` |
> | Peg Keeper V2 `0x338C...1f9D` | `9000000000000000000000000 (9,000,000.000000e18)` |
> | Factory `0x370a...00c0` | `1000000000000000000000000000 (1,000,000,000.000000e18)` |
> | Peg Keeper V2 `0x3fA2...e09C` | `45000000000000000000000000 (45,000,000.000000e18)` |
> | WBTC market `0x4e59...5c67` | `200000000000000000000000000 (200,000,000.000000e18)` |
> | Peg Keeper V2 `0x503E...91F8` | `0` |
> | Peg Keeper V2 `0x5387...C50b` | `0` |
> | Peg Keeper V2 `0x5B49...A4C6` | `0` |
> | FastBridgeVault `0x5EF6...B9eC` | `150000000000000000000000 (150,000.000000e18)` |
> | weETH market `0x652a...6B11` | `20000000000000000000000000 (20,000,000.000000e18)` |
> | Peg Keeper V2 `0x68e3...21ca` | `0` |
> | Peg Keeper `0x6B76...c345` | `0` |
> | sfrxETH market `0x8472...8e76` | `0` |
> | LBTC market `0x8aca...58Ef` | `0` |
> | Peg Keeper V2 `0x9201...E340` | `135000000000000000000000000 (135,000,000.000000e18)` |
> | FastBridgeVault `0x97d0...E937` | `200000000000000000000000 (200,000.000000e18)` |
> | crvUSD FlashLender `0xA7a4...299B` | `0` |
> | WETH market `0xA920...9635` | `200000000000000000000000000 (200,000,000.000000e18)` |
> | Peg Keeper `0xE7cd...C5C8` | `0` |
> | sfrxETH market `0xEC08...15cf` | `50000000000000000000000000 (50,000,000.000000e18)` |
> | Peg Keeper V2 `0xFF78...92Bf` | `0` |
> | Peg Keeper V2 `0xFb72...F9F3` | `135000000000000000000000000 (135,000,000.000000e18)` |
> | Peg Keeper `0xaA34...ae22` | `0` |
> | FastBridgeVault `0xadB1...843D` | `300000000000000000000000 (300,000.000000e18)` |
> | CurveLendMinterFactory `0xd993...aFFF` | `15000000000000000000000000 (15,000,000.000000e18)` |
> | cbBTC market `0xf8C7...cBe3` | `50000000000000000000000000 (50,000,000.000000e18)` |

> | Field | Value |
> |---|---|
> | Setter | `set_debt_ceiling(address _to, uint256 debt_ceiling)` |
> | Gated by | `admin()` |
> | Tags | `SUPPLY` |
> | Last changed | 2026-04-20 |
> | Changed by | `0xc6f3...aCcC` (EOA (EIP-7702 → 0x63c0c19a…)) |
> | Total changes | 66 🔄 |

> **Recent changes (showing last 5 of 66):**

> | # | Asset | Value | Set By | Date |
> |---|---|---|---|---|
> | 1 | Peg Keeper V2 | `0` | `0xc6f3...aCcC` (EOA (EIP-7702 → 0x63c0c19a…)) | 2026-04-20 |
> | 2 | Peg Keeper V2 | `3000000000000000000000000 (3,000,000.000000e18)` | `0xD4f9...73eD` | 2026-03-13 |
> | 3 | crvUSD FlashLender | `30000000000000000000000000 (30,000,000.000000e18)` | `0xB325...97B3` | 2026-03-05 |
> | 4 | crvUSD FlashLender | `3000000000000000000000000 (3,000,000.000000e18)` | `0x71F7...1683` | 2026-01-29 |
> | 5 | LBTC market | `0` | `0x2b47...e278` (EOA) | 2026-01-24 |

> **`fee_receiver`**

> | Field | Value |
> |---|---|
> | Current Value | `0x2dFd89449faff8a532790667baB21cF733C064f2` |
> | Setter | `set_fee_receiver(address fee_receiver)` |
> | Gated by | `admin()` |
> | Tags | — |
> | Last changed | 2024-10-15 |
> | Changed by | `0x163E...5393` |
> | Total changes | 3 |

> **Recent changes:**

> | # | Value | Set By | Date |
> |---|---|---|---|
> | 1 | `0x2dFd89449faff8a532790667baB21cF733C064f2` | `0x163E...5393` | 2024-10-15 |
> | 2 | `0x22556558419EeD2d0A1Af2e7Fd60E63f3199aca3` | `0x163E...5393` | 2024-10-07 |
> | 3 | `0xa2Bcd1a4Efbd04B63cd03f5aFf2561106ebCCE00` | `0xbabe...9f67` | 2024-06-19 |

> #### 💰 Supply Actions

> _Mint / redeem / burn call tracking — last 5 calls per function, total counts preserved._

> **`collect_fees_above_ceiling`** *(per-asset)* ❄️ **DORMANT** 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Setter | `collect_fees_above_ceiling(address _to)` |
> | Gated by | `admin()` |
> | Tags | `SUPPLY` |
> | Last called | — |
> | Called by | — |
> | Total calls | 0 ❄️ |

---
<a id="c-0xb7400d2ea0f6dc1d7b153aa430b9e572f28afb79"></a>
## > Vyper_contract `0xb7400D2EA0f6DC1d7b153aA430B9E572F28afB79`

> > 💰 **Inherited supply authority** — holds `minter()` on **crvUSD Stablecoin**, `admin()` on **crvUSD ControllerFactory**. Access controls on this contract gate root token supply.

### > 🟢 `dao()`

> **Privileged write functions:**  
> **Capabilities:** ⚙️ **CONFIG**
> - `set_callback(address _controller, address _cb)`
> - `set_amm_fee(address _controller, uint256 _fee)`
> - `set_monetary_policy(address _controller, address _monetary_policy)`
> - `set_borrowing_discounts(address _controller, uint256 _loan_discount, uint256 _liquidation_discount)`
> - `set_admin_fee(address _controller, uint256 _fee)` `[CONFIG]`
> - `reduce_debt_ceiling(address _factory, address _to, uint256 _amount)`
> - `execute(address _target, bytes _calldata)`
> - `transfer_ownership(address _factory, address _owner)`
> - `set_emergency(address _emergency)`
> - `remove_emergency()` — Useful in case of compromise of the emergency address

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x40907540d8a6C65c637785e8f8B742ae6b0b9968` | Curve: Ownership Agent | 🟢 LOW | — | Storage only |  |

### > 🟢 `emergency()`

> **Privileged write functions:**  
> **Capabilities:** ⚙️ **CONFIG**
> - `set_callback(address _controller, address _cb)`
> - `set_amm_fee(address _controller, uint256 _fee)`
> - `set_monetary_policy(address _controller, address _monetary_policy)`
> - `set_borrowing_discounts(address _controller, uint256 _loan_discount, uint256 _liquidation_discount)`
> - `set_admin_fee(address _controller, uint256 _fee)` `[CONFIG]`
> - `reduce_debt_ceiling(address _factory, address _to, uint256 _amount)`
> - `remove_emergency()` — Useful in case of compromise of the emergency address

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x467947EE34aF926cF1DCac093870f613C96B1E0c` | Gnosis Safe 5/9 | 🟢 LOW | — | Storage only | 5/9 signers |

> **Signers of `Gnosis Safe 5/9` (0x4679...1E0c):**

> | Signer | Type | Owner Since | Notes |
> |---|---|---|---|
> | `0xe9A65fe8190fA5A4b5E277b84f0aAce686FDc174` | EOA | 2023-08-15 | EOA |
> | `0x7A1057E6e9093DA9C1D4C1D049609B6889fC4c67` | EOA | — | EOA |
> | `0x2b47C57A4c9Fc1649B43500f4c0cDa6cF29be278` | EOA | — | EOA |
> | `0xDAa094A0Ed166FeDF8a0a4310f3F74a1e96F9195` | EOA | — | EOA |
> | `0x99BC02c239025E431D5741cC1DbA8CE77fc51CE3` | EOA | — | EOA |
> | `0xAF17517aCD484429fC0da2312fd1f42039592cd0` | EOA | — | EOA |
> | `0xc6f3aAc21d8282f166938a8B30a9Ec62De30aCcC` | EOA (EIP-7702 → `0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B`) | — | EOA |
> | `0xAAc0aa431c237C2C0B5f041c8e59B3f1a43aC78F` | EOA ⚠️ Hot wallet (2,921 txs) | — | EOA |
> | `0x8a7dbC2824AcaC4d272289a33b255C3F1f3cdf32` | EOA | — | EOA |

> **Quorum history:**
>   - 2021-07-26: ⚪ unchanged 5 → 5

> #### 🔧 Permissioned Parameters

> **`emergency`** 🔧 **INIT-ONLY** *(set in code/init; setter unused)* 🔴 **SILENT** *(no event)*

> > 🔴 **Silent setter** — no change event emitted. History reconstructed from calldata (txlist, Safe, Timelock, Governor); pre-governance eras may be missing.

> > This parameter has never been changed since deployment.

> | Field | Value |
> |---|---|
> | Current Value | `0x467947EE34aF926cF1DCac093870f613C96B1E0c` |
> | Setter | `set_emergency(address _emergency)` |
> | Gated by | `dao()` |
> | Tags | — |
> | Last changed | — |
> | Changed by | — |
> | Total changes | 0 ❄️ |

---
<a id="c-0x40907540d8a6c65c637785e8f8b742ae6b0b9968"></a>
## > Agent `0x40907540d8a6C65c637785e8f8B742ae6b0b9968`

> > ✅ **Proxy — immutable** (Proxy (ERC-1967), impl exposes no upgrade function) — impl: `0x3A93C17FC82CC33420d1809dDA9Fb715cc89dd37`

> > 💰 **Inherited supply authority** — holds `minter()` on **crvUSD Stablecoin**, `admin()` on **crvUSD ControllerFactory**. Access controls on this contract gate root token supply.

> 🔒 **Immutable References:** `getEVMScriptRegistry()` → AppProxyPinned, `kernel()` → KernelProxy

### > 🟢 `upgradeability (Proxy (ERC-1967))`

> > ⚠️ **CRITICAL** — Upgradeability allows arbitrary code replacement. Must be behind both a Multisig AND a Timelock.

> **Privileged write functions:**  
> **Capabilities:** ⬆️ **UPGRADE**
> - `upgradeTo(address)` — Upgrade proxy implementation to a new address `[UPGRADE]`
> - `upgradeToAndCall(address,bytes)` — Upgrade proxy implementation and call an initializer `[UPGRADE]`

> **Members (1):**

> | Address | Name / Type | Risk | Granted | Source | Details |
> |---|---|---|---|---|---|
> | `0x40907540d8a6C65c637785e8f8B742ae6b0b9968` | Curve: Ownership Agent | 🟢 LOW | — | Storage only |  |

> #### 🔧 Permissioned Parameters

> **`PROTECTED_TOKENS_CAP`** 🔒 **IMMUTABLE**

> > 🔒 **Immutable** — declared as a constant in the contract source; cannot be changed without a contract upgrade. Bounds the reachable extreme of any setter that writes a related storage variable.

> | Field | Value |
> |---|---|
> | Current Value | `10` |
> | Mutability | 🔒 immutable (constant) |
> | Tags | `IMMUTABLE` |

---
## ⚡ Authority Concentration

The following addresses hold permissions across multiple contracts or roles in this dependency stack. Concentration of authority increases systemic risk — a single compromised key or colluding multisig can affect multiple systems.

### 🟢 `0x40907540d8a6C65c637785e8f8B742ae6b0b9968` — Curve: Ownership Agent
Controls **2 role(s)** across **2 contract(s)**

| Contract | Role | Privileged Functions | Granted |
|---|---|---|---|
| Vyper_contract `0xb740...fB79` | `dao()` | `set_callback(address _controller, address _cb)`, `set_amm_fee(address _controller, uint256 _fee)`, `set_monetary_policy(address _controller, address _monetary_policy)`, `set_borrowing_discounts(address _controller, uint256 _loan_discount, uint256 _liquidation_discount)` +6 more | — |
| Agent `0x4090...9968` | `upgradeability (Proxy (ERC-1967))` | `upgradeTo(address)`, `upgradeToAndCall(address,bytes)` | — |


---
## ⛔ Sanctions Screening

| Source | Status |
|---|---|
| OFAC SDN | ✅ OFAC SDN screened (97 ETH addresses, cache: 2026-06-25) |
| Chainalysis | ✅ Chainalysis screened |
| **Result** | 27 addresses screened · ✅ 0 flagged |

---
## EOA Exposure Summary

✅ No direct EOA role holders detected.

---
## ✅ Scan Integrity

No issues detected. All block ranges covered, source and ABI resolved for all contracts.
