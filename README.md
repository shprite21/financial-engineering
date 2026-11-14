# Quant Research Portfolio

A collection of quantitative finance research projects covering systematic trading, statistical arbitrage, derivatives pricing, market making, portfolio modeling, and machine-learning driven market regime analysis.

The repository is organized as a portfolio of independent projects. Each folder has its own README, dependencies, notebooks, scripts, and outputs where applicable.

## Projects

| # | Project | Focus | Main entry points |
|---|---|---|---|
| 1 | [Regime-Aware Systematic Equities Trading Platform](./01-Regime-Aware-Systematic-Equities-Trading-Platform/) | Adaptive equity portfolios, walk-forward evaluation, and an HMM experiment combining momentum, mean reversion, and pairs trading. | `python scripts/run_research.py`, `python experiments/run_experiment.py` |
| 2 | [Bayesian Statistical Arbitrage](./02-bayesian-stat-arbitrage/) | Cointegration-based spread trading with Optuna Bayesian optimization for weights and signal parameters. | `python main.py` |
| 3 | [Options Market Making System](./03-market-making-system/) | Black-Scholes pricing, Greeks, stochastic order flow, inventory-aware quoting, delta hedging, and Python/C++ benchmarks. | `python python/market_maker.py`, `python python/benchmark.py --n 200000` |
| 4 | [Quantitative Finance Modeling](./04-quant-finance-modeling/) | Monte Carlo risk simulation, mean-variance portfolio optimization, and ARIMA forecasting notebooks. | Project notebooks |
| 5 | [ML Regime Trend Prediction](./05-ml-regime-trend-prediction/) | NIFTY 50 data pipeline, technical indicators, market regimes, model comparison, and Streamlit dashboard. | `python market_regime_detection.py`, `python launch_dashboard.py` |
| 6 | [Systematic Futures and Options Venture](./student%20systematic%20futures%20and%20options%20venture/) | End-to-end Indian index derivatives research workflow with data loading, features, regime detection, signals, strategy selection, risk management, and walk-forward testing. | `pytest -q`, notebooks |
| 7 | [Multi-Asset Risk Simulation & Stress Testing Engine](./multi_asset_risk_simulation/) | Monte Carlo simulation and stress testing for multi-asset portfolios. | `python -m risk_engine.main --config config/default_config.json` |
| 8 | [Shprite Equity Lab](./shprite-equity-lab/) | Regime-aware portfolio research with a local API and interactive portfolio dashboard. | `python scripts/run_research.py`, `.\scripts\run_dashboard.ps1` |
| 9 | [Systematic Equities Research Lab](./systematic-equities-research-lab/) | Equity factor replication, portfolio construction, and walk-forward evaluation. | `python main.py --periods 756`, `streamlit run dashboards/streamlit_app.py` |
| 10 | [Q Quantitative Research Terminal](./terminal/) | A local terminal for equity research, portfolio backtesting, and strategy validation. | `.\setup-flagship.ps1`, `.\start-q21.ps1` |
| 11 | [Competitive Market Intelligence Dashboard](./competitive-market-intelligence-dashboard/) | Competitor research, company filings, market prices, and news in a Streamlit dashboard. | `python run.py` |
| 12 | [Evidence Backtester site](./shprite21.github.io/) | Static page for the Evidence Backtester project. | [index.html](./shprite21.github.io/index.html) |

## Core Topics

- Statistical arbitrage and cointegration
- Hidden Markov Models and regime detection
- Systematic strategy research and backtesting
- Options pricing, Greeks, hedging, and market making
- Portfolio optimization and risk analytics
- Time-series forecasting and machine learning
- Research workflow design, validation, and performance reporting

## Tech Stack

- Python
- C++
- NumPy, pandas, SciPy, statsmodels
- scikit-learn, hmmlearn, XGBoost, Optuna
- matplotlib, seaborn, plotly, Streamlit
- pytest, Jupyter notebooks

## Repository Structure

```text
quant-research/
|-- 01-Regime-Aware-Systematic-Equities-Trading-Platform/
|-- 02-bayesian-stat-arbitrage/
|-- 03-market-making-system/
|-- 04-quant-finance-modeling/
|-- 05-ml-regime-trend-prediction/
|-- student systematic futures and options venture/
|-- multi_asset_risk_simulation/
|-- shprite-equity-lab/
|-- systematic-equities-research-lab/
|-- terminal/
|-- competitive-market-intelligence-dashboard/
|-- shprite21.github.io/
`-- README.md
```

## Notes

- Outputs, plots, and sample results are included in several project folders for portfolio review.
- Some projects download market data from public sources such as Yahoo Finance; results can vary with data availability and date range.
- This repository is for educational and research purposes only. It is not investment advice and is not a production trading system.
