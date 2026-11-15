# Resume and interview material

## Project title

**Q — Reproducible Strategy Research | Python, NumPy, pandas, statsmodels, SQLite**

GitHub description: An equity-research platform combining cost-aware portfolio backtests, statistical robustness diagnostics and reproducible experiment records, with prospective paper evidence kept separate from historical simulations.

## Quant trader / quant research resume bullets

- Implemented HAC inference, block-bootstrap intervals, multiple-testing correction and CSCV/PBO diagnostics to assess return uncertainty and selection risk across recorded strategy trials.
- Built a reproducible equity-research workflow covering 8 strategies, constrained allocation and cost-aware walk-forward evaluation, with frozen data, configuration and source snapshots.
- Modeled whole-share cash and volume constraints with delayed execution and 1×–3× cost stress; preserved rejected experiments and kept forward paper evidence separate from backtests.

## MFE application bullets

- Developed a Python research framework linking time-series signals, constrained portfolio allocation and chronological validation across 8 equity strategies, with explicit data and execution assumptions.
- Implemented HAC, block-bootstrap confidence intervals, multiple-testing correction and conditional DSR/CSCV diagnostics, supported by independent numerical tests for statistical and accounting invariants.
- Designed reproducible experiments using data/source fingerprints and immutable evidence; verified an end-to-end synthetic workflow while distinguishing research methodology from empirical market performance.

These bullets describe verified implementations. They do not claim alpha, profitable live trading, untouched OOS performance, a complete point-in-time universe or 18 independent validation tests. Be prepared to explain reused libraries as well as the integration and independent checks you wrote.

## What I must be able to explain in an interview

| Question | What a defensible answer must cover | Code to understand |
| --- | --- | --- |
| 1. What makes this a research project rather than a terminal UI? | Hypothesis, frozen mandate, causal signal, net account path, diagnostic evidence, recorded rejection and separate future validation. | [research/workspace.py](../apps/engine/research/workspace.py): `run_research`; [apps/research_api.py](../apps/engine/apps/research_api.py): `submit`, `_execute`, `decide`. |
| 2. When is information available and when can it affect P&L? | Signal-time information, execution lag, close-to-close fractional proxy versus whole-share next-close stress; why neither is an observed fill. | [backtesting/engine.py](../apps/engine/backtesting/engine.py): `run`, `_run_drifting`; [research/survival/execution.py](../apps/engine/research/survival/execution.py): `execution_stress`. |
| 3. What does walk-forward validate when rules are not fitted? | Disjoint complete test windows, prior signal/account context, fixed rules, retained partial-window exclusions; retrospective exposure remains. | [backtesting/walk_forward.py](../apps/engine/backtesting/walk_forward.py): `WalkForwardValidator.evaluate`; [survival/pipeline.py](../apps/engine/research/survival/pipeline.py): `walkforward`, `segments`. |
| 4. Why HAC instead of an ordinary t-test? | Serial correlation/heteroskedasticity, Bartlett lag covariance, bandwidth, normal approximation, one-sided null and stationarity/finite-moment assumptions. | [survival/statistics.py](../apps/engine/research/survival/statistics.py): `hac_mean`; [statistical tests](../apps/engine/tests/test_survival_statistics_audit.py): explicit covariance reference. |
| 5. Why resample blocks and what does the interval mean? | Dependence within blocks, block length, circular wrapping, seed, truncation, percentile intervals; conditional historical uncertainty, not predictive guarantee. | [survival/statistics.py](../apps/engine/research/survival/statistics.py): `block_bootstrap`; [statistical tests](../apps/engine/tests/test_survival_statistics_audit.py). |
| 6. What is the tested hypothesis family? | Recorded comparable trials, candidate/date deduplication, failed/unusable attempts, BY's harmonic correction, unknown adaptive/external search. | [survival/pipeline.py](../apps/engine/research/survival/pipeline.py): `variants`, `trial_family`, `multiple_testing`; [survival/service.py](../apps/engine/research/survival/service.py): `submit`. |
| 7. How is DSR different from Sharpe and why is it unavailable in the demo? | Expected maximum across effective independent trials; daily SR units, skew/Pearson kurtosis, PSR denominator; IID and trial-count assumptions are not inferred from five correlated neighbors. | [survival/statistics.py](../apps/engine/research/survival/statistics.py): `deflated_sharpe`; [survival/models.py](../apps/engine/research/survival/models.py): `SurvivalConfig`. |
| 8. How does CSCV estimate PBO, including ties? | Complementary block combinations, winning IS Sharpe, OOS rank/(N+1), logit sign, equal tie weights, dependent partitions and discarded tail rows. | [survival/statistics.py](../apps/engine/research/survival/statistics.py): `pbo`; [statistical tests](../apps/engine/tests/test_survival_statistics_audit.py): candidate permutation invariant. |
| 9. What changed in Sharpe, Sortino and drawdown? | Undefined denominators; sample SD; lower partial RMS over all returns; zero hurdle and annualization; initial NAV makes the first loss visible. | [analytics/metrics.py](../apps/engine/analytics/metrics.py); [tests/test_accounting_integrity.py](../apps/engine/tests/test_accounting_integrity.py). |
| 10. How do costs, turnover and cash reconcile? | Traded notional versus passive drift; constant weights require daily restoration trades even between target updates; commissions/slippage/borrow, integer sizing, prior volume caps, sells-before-buys and rejected remainders; omitted financing/impact. | [backtesting/engine.py](../apps/engine/backtesting/engine.py): `VectorizedBacktester.run`; [tests/test_accounting_integrity.py](../apps/engine/tests/test_accounting_integrity.py): independent cash/share ledger; [analytics/tearsheet.py](../apps/engine/analytics/tearsheet.py); [risk/costs.py](../apps/engine/risk/costs.py); [survival/execution.py](../apps/engine/research/survival/execution.py). |
| 11. Why can renormalization violate a portfolio cap? | A clipped vector can exceed bounds when scaled back to full investment; keep residual cash, enforce final constraints, check solver fallbacks and infeasibility. | [portfolio/allocation.py](../apps/engine/portfolio/allocation.py): bounded allocators and optimizer; [risk/management.py](../apps/engine/risk/management.py): exposure constraints. |
| 12. Where can HMM leakage enter despite forward filtering? | Full-sample scaling/fitting/state ordering, smoothing versus filtering, training overlap, prior reset, causal trade lag; rule regimes are the main workflow. | [regime_detection/hmm.py](../apps/engine/regime_detection/hmm.py): `fit`, `predict`, `_filtered_probabilities`; [qresearch/regimes.py](../apps/engine/qresearch/regimes.py): separate train-only integration. |
| 13. What data biases remain? | Selected universe, missing/delisted instruments, provider adjustment bases, calendars and corporate actions; no synthetic fallback after provider failure. | [data/research_source.py](../apps/engine/data/research_source.py); [data/models.py](../apps/engine/data/models.py); [gateway/market-data.mjs](../apps/gateway/market-data.mjs); [evidence/actions.py](../apps/engine/evidence/actions.py). |
| 14. What exactly can be reproduced and what must match? | CSV/source hashes, dependencies, config, prior trial family, deterministic RNG, replay without executing archive code; immutable Survival store versus ordinary experiment files. | [survival/replay.py](../apps/engine/research/survival/replay.py); [evidence/storage.py](../apps/engine/evidence/storage.py); [research/workspace.py](../apps/engine/research/workspace.py): `code_provenance`. |
| 15. Why are paper/live results and architecture claims limited? | Timestamp-gated forward events, frozen versions, separate simulated accounts, no broker verification; bounded local jobs versus durable distributed execution. | [survival/forward.py](../apps/engine/research/survival/forward.py); [paper/storage.py](../apps/engine/paper/storage.py); [gateway/quant-pool.mjs](../apps/gateway/quant-pool.mjs); [apps/research_api.py](../apps/engine/apps/research_api.py). |

Before applying, rehearse the [representative experiment](representative-experiment.md), including its weak statistical evidence and unavailable diagnostics. A negative or inconclusive outcome is useful evidence of an honest process.

## Finalization examples to discuss

- **A holdout can leak without a bad signal formula.** Recapturing identical bytes with a smaller reserved fraction previously moved sealed observations into development without a reveal. The project service now rejects incompatible partitions and preserves failed tasks. Changing the fraction in the other direction cannot turn already examined data into untouched evidence either.
- **A comparison chart is a methodological decision.** The project comparison requires matching data, exact dates, source and account conventions; it withholds incompatible overlays while retaining descriptive evidence. Normalizing by recorded capital preserves the initial NAV and first loss. It does not pick a winner or certify the search family.
- **Operational language must match the controlled account.** Local legacy account controls are labeled separately from systematic paper deployments; the footer does not claim an engine connection merely because the UI loaded.

The [five-minute walkthrough](v2-demo-guide.md) connects these decisions to visible behavior. The [completion record](v2-finalization.md) separates passing local verification from remaining lint, data and operational limits.

