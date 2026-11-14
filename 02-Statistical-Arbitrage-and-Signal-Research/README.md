# Statistical Arbitrage and Signal Research

This project studies two ways to build an equity signal. The basket study asks whether deviations in the relative prices of energy ETFs can be traded after costs. The NIFTY 50 study asks whether price and volatility features can classify the direction of the next close. Both workflows use the same Python environment.

| Research question | Run from this directory | Inspect |
| --- | --- | --- |
| How do basket weights and entry thresholds affect held-out returns? | `python main.py` | [Basket configuration](configs/strategy_config.yaml), [published charts](results/figures/), [analysis notebooks](notebooks/), [methodology](docs/basket-trading.md) |
| How accurately do market regimes and technical indicators classify the next NIFTY close? | `python market_regime_detection.py`, then `python launch_dashboard.py` | [Training and dashboard guide](docs/trend-prediction.md), `comparison_results.csv`, `test_predictions.csv` |

## Setup

From the repository root, create a virtual environment and install the shared dependencies.

```shell
cd 02-Statistical-Arbitrage-and-Signal-Research
python -m venv .venv
```

Activate it with `.venv\Scripts\Activate.ps1` in PowerShell or `source .venv/bin/activate` in a POSIX shell, then run `python -m pip install -r requirements.txt`.

## Reading the results

The default basket is XLE, VDE, and IYE. Engle–Granger and Johansen tests describe their price relationship. Optuna chooses spread weights, thresholds, lookback, and position size using a validation slice inside the training period. The remaining dates provide the out-of-sample portfolio report. Enable rolling re-optimization with `walk_forward.enabled` in the configuration. A previous basket run can reuse its saved price panel with `python main.py --use-cached-data`.

The NIFTY workflow downloads daily OHLCV data and compares logistic regression, random forest, and XGBoost on a chronological split. The dashboard reads the resulting prediction probabilities, feature importances, and regime labels. The historical study defines its volatility threshold using the full sample and ranks the models on the test set. Interpret the rankings as retrospective comparisons. The classification metrics measure direction, while the basket returns include exposure and trading costs.
