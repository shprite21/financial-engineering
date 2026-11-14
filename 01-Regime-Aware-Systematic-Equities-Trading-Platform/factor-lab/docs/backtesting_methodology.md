# Backtesting Methodology

The engine is designed to make common research mistakes visible:

- target weights are shifted by one bar by default
- turnover is computed from target portfolio changes
- transaction costs and slippage are deducted from gross returns
- benchmark-relative alpha, beta, and information ratio are reported when a benchmark is supplied
- walk-forward windows support train/test research workflows

The default implementation is intentionally transparent and vectorized. More detailed event-driven execution can be added through `backtesting/engine/execution.py`.

