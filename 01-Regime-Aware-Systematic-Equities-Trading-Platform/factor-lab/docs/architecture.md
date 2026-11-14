# Architecture

The platform is organized around stable research contracts:

1. **Data contracts:** normalized date/ticker panels, local parquet cache, provider adapters.
2. **Signal contracts:** every factor returns a `FactorResult` with wide date-by-ticker scores.
3. **Portfolio contracts:** signal scores become target weights through deterministic weighting or optimization.
4. **Backtest contracts:** target weights are shifted, costed, and evaluated with institutional metrics.
5. **Analytics contracts:** IC, deciles, drawdowns, risk exposures, and regime diagnostics are reusable across studies.

This structure lets a researcher add a new alpha without rewriting ingestion, execution, reporting, or risk tooling.

