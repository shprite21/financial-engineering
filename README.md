# Financial Engineering

A research portfolio for studying how a trading signal becomes a position, what it costs to execute, and how much capital it can put at risk. The flagship is **Q**, a systematic equities terminal that connects strategy research, portfolio construction, backtesting, and experiment records. Four companion projects cover statistical signals, derivatives, portfolio risk, and company research.

## Projects

| Project | Research question | Start here |
| --- | --- | --- |
| [01 · Regime-Aware Systematic Equities Trading Platform](01-Regime-Aware-Systematic-Equities-Trading-Platform/) | How do market regimes, factor exposures, execution assumptions, and costs affect a portfolio? | [Run Q](01-Regime-Aware-Systematic-Equities-Trading-Platform/README.md), [equities research engine](01-Regime-Aware-Systematic-Equities-Trading-Platform/apps/engine/), [factor replication lab](01-Regime-Aware-Systematic-Equities-Trading-Platform/factor-lab/) |
| [02 · Statistical Arbitrage and Signal Research](02-Statistical-Arbitrage-and-Signal-Research/) | Does a cointegrated ETF basket earn a spread after costs? How well do price features classify the next NIFTY 50 close? | [Basket methodology](02-Statistical-Arbitrage-and-Signal-Research/docs/basket-trading.md), [NIFTY training and dashboard](02-Statistical-Arbitrage-and-Signal-Research/docs/trend-prediction.md) |
| [03 · Derivatives Pricing and Market Microstructure](03-Derivatives-Pricing-and-Market-Microstructure/) | How do index signals translate into derivatives exposures, and how does an options dealer manage inventory and delta? | [Index notebooks](03-Derivatives-Pricing-and-Market-Microstructure/notebooks/), [Python and C++ dealer simulation](03-Derivatives-Pricing-and-Market-Microstructure/market_making/) |
| [04 · Portfolio Risk and Quantitative Modeling](04-Portfolio-Risk-and-Quantitative-Modeling/) | What happens to portfolio losses when volatility rises or diversification weakens? | [Stress engine and quick start](04-Portfolio-Risk-and-Quantitative-Modeling/README.md), [Monte Carlo, optimization, and forecasting notebooks](04-Portfolio-Risk-and-Quantitative-Modeling/notebooks/) |
| [05 · Competitive Market Intelligence Dashboard](05-Competitive-Market-Intelligence-Dashboard/) | What do company filings, competitor comparisons, market data, and news reveal about a business? | [Dashboard setup](05-Competitive-Market-Intelligence-Dashboard/docs/TEAM_SETUP.md), [bundled example analyses](05-Competitive-Market-Intelligence-Dashboard/examples/analyses/) |

## Run an offline study

The portfolio risk demonstration fits a covariance model to seeded synthetic returns. It runs 10,000 paths over 21 trading days, compares baseline and stress scenarios using the same random draws, and writes loss estimates and equity curves. Use Python 3.10 or newer in a virtual environment.

```sh
git clone https://github.com/shprite21/financial-engineering.git
cd financial-engineering/04-Portfolio-Risk-and-Quantitative-Modeling
python -m pip install -r requirements.txt
python data/generate_sample_data.py
python -m risk_engine.main --config config/default_config.json
```

The CLI prints the run directory. Open `tables/tail_risk.csv` for 95% and 99% value at risk and expected shortfall, and `run_metadata.json` for the input fingerprint, portfolio weights, and covariance assumptions.

## Stress-test a strategy from another project

Project 02 exports the held-out ETF basket’s daily returns after transaction costs and slippage. Project 04 can fit its risk model to those returns and compare a baseline with a 50% volatility increase. After running the basket study in 02, run this command from the 04 directory in the environment used above.

```sh
python examples/stress_basket.py ../02-Statistical-Arbitrage-and-Signal-Research/results/performance_reports/equity_curve.csv outputs/basket-study-01
```

The [example](04-Portfolio-Risk-and-Quantitative-Modeling/examples/stress_basket.py) saves its dated return input and configuration alongside the results. It treats the basket as one sleeve and estimates future losses under the model’s assumptions. For constituent-level correlation stresses, use the multi-asset input described in the [risk guide](04-Portfolio-Risk-and-Quantitative-Modeling/README.md).

## Research conventions

Each numbered project has its own setup and data requirements. Q records the data source and execution convention with an experiment. The derivatives dealer simulates orders and fills. The NIFTY classifier reports directional accuracy, while the basket backtest reports portfolio returns after modeled costs. The [terminal methodology](01-Regime-Aware-Systematic-Equities-Trading-Platform/docs/strategy-survival.md) and individual project guides document which assumptions apply to each result.
