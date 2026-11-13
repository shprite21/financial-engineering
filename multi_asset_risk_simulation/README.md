# Multi-Asset Risk Simulation & Stress Testing Engine

Estimate portfolio tail losses over a configurable trading horizon and measure how they change when volatility rises or diversification weakens. The engine fits daily log-return moments to a panel of asset prices or strategy returns, generates correlated Gaussian paths, and rebalances the portfolio on each simulated day.

The included demonstration uses **synthetic data**. It compares a baseline and three covariance stresses on the same 10,000 random paths over 21 trading days. Each run produces auditable 95% and 99% VaR and Expected Shortfall estimates, peak-to-trough drawdowns, the full portfolio equity curves, and five figures.

## Reproduce the demonstration

Start in `multi_asset_risk_simulation/` with Python 3.10 or newer. Create and activate a virtual environment using the commands for your shell.

**Windows PowerShell**

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

**Linux or macOS**

```bash
python3 -m venv .venv
source .venv/bin/activate
```

Install the editable project and test dependencies, generate the data, then run the model.

```bash
python -m pip install -r requirements.txt
python data/generate_sample_data.py
python -m risk_engine.main --config config/default_config.json
```

The installed `risk-sim --config config/default_config.json` command runs the same workflow. The CLI prints the completed output directory. Open `tables/tail_risk.csv` for the loss estimates and `figures/tail_risk.png` for the scenario comparison. Data generation and simulation run offline. NumPy supplies random draws and array operations, pandas handles dated panels and CSV reports, SciPy factors covariance matrices, Matplotlib renders headless PNGs, and pytest exercises the estimators and CLI.

## Input data and configuration

The CSV schema is one ISO calendar date (`YYYY-MM-DD`) per row and one uniquely named numeric column per constituent. All constituents must share the same trading frequency, valuation currency and close convention. A strategy column represents its daily return on allocated capital. The loader sorts dates and estimates every covariance entry on the same complete observations.

| Setting in `config/default_config.json` | Meaning |
| --- | --- |
| `data.path`, `data.label` | Input CSV and dataset label printed on charts. Paths in the JSON resolve relative to the configuration file. Change the label when supplying different data. |
| `data.kind`, `data.date_column` | Use `prices` for positive adjusted prices or `simple_returns` for daily decimal simple returns. The date column defaults to `date`. |
| `data.missing` | `error` by default. With `drop`, remove incomplete return vectors. Empty fields, `NA`, `NaN` and `null` denote missing data. |
| `data.duplicates` | `error` by default. With `last`, keep the last row in input-file order for each date. Malformed numeric values and domain violations raise an error even on superseded rows. |
| `simulation` | Positive integer `paths` and `horizon_days`, and a nonnegative integer `seed`. The default simulation seed is 1729. |
| `portfolio` | Positive `initial_capital`, display `currency` and a `weights` object keyed by every input constituent. Omitting `weights` or setting it to `null` selects equal allocations. |
| `confidence_levels` | Distinct probabilities strictly between 0 and 1. Defaults are 0.95 and 0.99. |
| `scenarios` | List of named stresses. The engine always includes `Baseline`. An empty list runs the baseline alone. |
| `output_dir` | Parent directory for completed runs. The default is `../outputs` relative to the config. |

**Return units matter.** Encode a 1% gain as `0.01` and a 2% loss as `-0.02`. Numeric `1` denotes a 100% gain. Percentage strings are rejected. Each simple return must exceed $-1$ because a total loss has no finite log return. At least two complete return vectors are required.

For prices, supply one row per trading session and adjust for distributions and splits as appropriate. A missing price invalidates both returns that need that quote. Differencing on the original sorted grid prevents a missing quote from turning a multi-session move into a daily observation. A session absent from the CSV altogether cannot be identified without a trading calendar.

### Synthetic calibration sample

`data/generate_sample_data.py` generates 1,260 weekday observations beginning on 2018-01-02 using seed 771. The sleeves are fictional. The generator draws correlated Gaussian log returns with the following population parameters and then writes decimal simple returns. The simulation estimates its parameters afresh from the resulting CSV.

| Sleeve | Daily log mean | Daily volatility | Correlation with Equity | Rates | Commodities | Trend |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Equity | 0.00025 | 0.012 | 1.00 | −0.25 | 0.35 | −0.10 |
| Rates | 0.00008 | 0.004 | −0.25 | 1.00 | −0.10 | 0.15 |
| Commodities | 0.00012 | 0.014 | 0.35 | −0.10 | 1.00 | 0.05 |
| Trend | 0.00015 | 0.007 | −0.10 | 0.15 | 0.05 | 1.00 |

To change the sample, run `python data/generate_sample_data.py --observations 2000 --seed 42 --output data/alternative.csv` and update `data.path` in a copy of the config. Weekday dates in the generator do not encode exchange holidays.

## Mathematical methodology

### Historical calibration and Cholesky decomposition

For positive prices $P_{t,i}$ or supplied daily simple returns $r_{t,i}$, the daily log return is

$$
x_{t,i} = \log P_{t,i} - \log P_{t-1,i}
\qquad\text{or}\qquad
x_{t,i} = \log(1+r_{t,i}).
$$

From $n$ aligned return vectors, estimate the daily mean and sample covariance using

$$
\hat{\mu} = \frac{1}{n}\sum_{t=1}^{n} x_t,\qquad
\hat{\Sigma} = \frac{1}{n-1}\sum_{t=1}^{n}(x_t-\hat{\mu})(x_t-\hat{\mu})^\top .
$$

For positive daily volatilities $\sigma_i=\sqrt{\hat{\Sigma}_{ii}}$, the sample correlation is $R_{ij}=\hat{\Sigma}_{ij}/(\sigma_i\sigma_j)$. A constant sleeve has undefined empirical correlation. The reported matrix assigns it unit diagonal and zero cross-correlations by convention, and simulations keep its shocks exactly zero.

The factorizer checks symmetry, variance signs and the minimum eigenvalue. Its roundoff tolerance is $\tau=16\,d\,\epsilon\,\max_{ij}|\Sigma_{ij}|$ for $d$ constituents and machine epsilon $\epsilon$. Material asymmetry or indefiniteness raises an error. Roundoff-scale asymmetry is averaged. Cholesky is attempted on the positive-variance block, preserving constant constituents. If factorization fails within the tolerance, the engine adds $\tau+\max(0,-\lambda_{\min})$ to that block's diagonal. The output records the target matrix, maximum asymmetry, minimum eigenvalue, diagonal shift and effective matrix for each scenario.

### Monte Carlo and portfolio construction

For each path and trading day, sample a row of independent standard normals $Z$ and apply the lower Cholesky factor $L$ of the effective covariance. With the mean broadcast across rows,

$$
X=\hat{\mu}+ZL^\top,\qquad LL^\top=\Sigma_{\mathrm{effective}} .
$$

The normal draws are independent across days and paths. Each scenario restarts the same PCG64 stream, so matching path IDs use the same underlying shocks across scenarios. The horizon is simulated day by day. Drawdowns and daily rebalancing both depend on that sequence.

Convert log returns to simple returns before aggregating weights. At the start of each trading day, rebalance to the same long-only, fully invested weights $w_i\geq0$, with $\sum_i w_i=1$. For simulated path $p$,

$$
r_{p,t,i}=\exp(X_{p,t,i})-1,\qquad
r_{p,t}^{\mathrm{portfolio}}=\sum_i w_i r_{p,t,i},\qquad
V_{p,t}=V_{p,t-1}(1+r_{p,t}^{\mathrm{portfolio}}).
$$

Every path starts at the configured $V_0$. The default invests USD 1,000,000 with 40% in Equity, 30% in Rates, and 15% each in Commodities and Trend.

### Terminal loss, VaR, Expected Shortfall and drawdown

Define currency loss at horizon $H$ as $\ell_p=V_0-V_{p,H}$. Gains have negative loss. Using the linearly interpolated empirical quantile $Q_c$ at confidence $c$,

$$
\mathrm{VaR}_c=Q_c(\ell),\qquad
T_c=\{p:\ell_p\geq \mathrm{VaR}_c\},\qquad
\mathrm{ES}_c=\frac{1}{|T_c|}\sum_{p\in T_c}\ell_p .
$$

All ties at the threshold enter ES. The tail sample count can therefore exceed the nominal tail size. Positive VaR represents a loss threshold. Both estimates can be negative if gains persist into the selected tail. Percentage estimates equal $100$ times their currency amounts divided by $V_0$. The probability of a terminal loss is the fraction with $\ell_p>0$. Terminal P&L is $-\ell_p$. [NumPy quantile convention](https://numpy.org/doc/stable/reference/generated/numpy.quantile.html)

Include day zero when finding each path's running peak. Report maximum drawdown as a positive decline magnitude

$$
D_p=\max_{0\le t\le H}\left(1-\frac{V_{p,t}}{\max_{0\le s\le t}V_{p,s}}\right).
$$

The mean and median of $D_p$ describe a typical path. The worst simulated drawdown is $\max_p D_p$. This extreme is sensitive to the number of paths.

### Stress assumptions

Every scenario retains the estimated daily **log** mean. Let $m_i>0$ be volatility multipliers, $D_m=\operatorname{diag}(m_i\sigma_i)$, and $a\in[0,1]$ the correlation blend. The stress target is

$$
R_a=(1-a)R+a\mathbf{1}\mathbf{1}^{\top},\qquad
\Sigma_{\mathrm{stress}}=D_m R_a D_m .
$$

Both correlation endpoints are positive semidefinite with unit diagonal. Their convex combination preserves these properties and moves each off-diagonal entry toward +1. Diagonal scaling preserves positive semidefiniteness. At $a=1$ the target may be singular, so the same audited factorization rule applies.

| Default scenario | Volatility multipliers | Correlation blend |
| --- | --- | ---: |
| Baseline | 1 for all | 0 |
| Volatility shock | 1.5 for all | 0 |
| Correlation breakdown | 1 for all | 0.65 |
| Combined stress | Equity 1.5, Rates 1.25, Commodities 1.6, Trend 1.4 | 0.65 |

A scenario needs a unique `name`. Set `volatility_multiplier` to a positive scalar or an object keyed by constituent. Omitted constituents use 1. The optional `correlation_blend` defaults to 0. These are hypothetical shocks. Raising log variance with the log mean fixed can raise the mean simple return through $\mathbb{E}[r_i]=\exp(\mu_i+\sigma_i^2/2)-1$, even as tail losses widen.

## Reports and figures

Each completed run appears under `outputs/run-<UTC timestamp>-<unique suffix>/`. A rerun creates its own directory. The numerical values reproduce with identical inputs, settings and software. Generated data and results are excluded by `.gitignore`.

| Artifact within a run | Contents |
| --- | --- |
| `run_metadata.json` | Configuration, input SHA-256, cleaning counts, return date range, constituent order, weights, daily estimates, scenario covariance diagnostics, RNG and library versions. |
| `tables/scenario_summary.csv` | Mean and median terminal value and P&L, mean signed terminal loss, loss probability, and mean, median and worst path drawdown. Includes changes from baseline in mean loss and worst drawdown. |
| `tables/tail_risk.csv` | One row per scenario and confidence, with VaR and ES in currency and percent, tail counts, and currency changes from baseline. |
| `tables/path_outcomes.csv` | Terminal value, signed loss and maximum drawdown for each scenario and zero-based path ID. |
| `tables/equity_paths.csv.gz` | All equity curves in compressed CSV. Each row has the scenario, path ID and currency wealth from `day_0` through the forecast horizon. Read directly with `pandas.read_csv`. |
| `figures/equity_paths.png` | Up to 35 individual baseline paths, the cross-sectional median and a pointwise 5th–95th percentile band. |
| `figures/terminal_value.png` | Baseline terminal wealth distribution with initial capital marked. |
| `figures/terminal_losses.png` | Signed terminal loss distributions on common bin edges, in percent of initial capital. |
| `figures/tail_risk.png` | Scenario VaR and ES comparisons at every configured confidence level. |
| `figures/maximum_drawdowns.png` | Across-path distributions of maximum drawdowns with common bin edges. |

Fields ending in `_pct` use percentage units, so a value of 5 means 5%. The drawdown difference is measured in percentage points. Confidence and `probability_of_loss` are fractions on a 0–1 scale. All currency amounts use the portfolio's valuation currency.

## Architecture

```text
multi_asset_risk_simulation/
├── config/default_config.json
├── data/generate_sample_data.py
├── src/risk_engine/
│   ├── data_loader.py       CSV validation, date alignment and daily log returns
│   ├── covariance.py        Sample moments, correlation and audited factorization
│   ├── simulator.py         Seeded multivariate Gaussian daily draws
│   ├── portfolio.py         Weight alignment, daily rebalancing and compounding
│   ├── risk_metrics.py      Terminal loss statistics and path drawdowns
│   ├── stress_testing.py    Configurable volatility and correlation transforms
│   ├── visualization.py    Headless research figures
│   └── main.py             Configuration, CLI and report publication
├── tests/                  Numerical, data-quality and end-to-end checks
├── outputs/                Local run directories
├── pyproject.toml          Package, console entry point and dependencies
└── requirements.txt        Editable installation with test dependencies
```

## Validation

```bash
python -m pytest -q
```

The tests check known terminal losses and tied thresholds, hand-calculated rebalancing and drawdowns, sample covariance recovery, constant and collinear constituents, reproducible seeds, and statistical agreement with an analytical single-asset lognormal VaR and ES. The workflow test regenerates the sample, invokes the CLI, reads back every artifact, and reconciles the archived curves with reported risk. On systems with a restricted shared temporary directory, use `python -m pytest -q --basetemp=.pytest-run`.

## Interpretation and limitations

- **Gaussian tails and time dependence.** IID daily log returns omit fat tails, jumps, serial dependence, volatility clustering and regime persistence. A stress changes the covariance for the whole forecast horizon.
- **Parameter uncertainty.** Sample means and covariances depend on the window, especially with many constituents. A numerical diagonal shift makes factorization feasible and does not measure estimation error.
- **Trading assumptions.** Frictionless daily rebalancing omits transaction costs, liquidity limits, financing, leverage and taxes. Strategy returns must already reflect the intended treatment of fees and costs.
- **Tail sampling.** With 10,000 continuous outcomes, the 99% ES generally averages only 100 paths. Use alternative seeds or more paths to study Monte Carlo variability. The sampled worst drawdown has no interpretation as an absolute loss bound.
- **Scale.** Simulation processes one scenario at a time. Working memory grows with paths × trading days × constituents, and the full-curve archive grows with the number of scenarios.
