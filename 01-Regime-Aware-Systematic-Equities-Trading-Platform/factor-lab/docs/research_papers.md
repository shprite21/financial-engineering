# Research Paper Implementation Map

| Paper | Modules |
| --- | --- |
| Jegadeesh & Titman (1993) | `factors/momentum/signals.py` |
| Fama-French 3-Factor Model | `factors/fama_french.py`, `factors/size/signals.py`, `factors/value/signals.py` |
| Fama-French 5-Factor Model | `factors/fama_french.py`, `factors/profitability/signals.py`, `factors/quality/signals.py` |
| Value and Momentum Everywhere | `factors/multifactor.py`, `factors/dynamic_weighting.py` |
| Momentum Crashes | `regime/engine.py`, `portfolio/overlays/regime.py` |
| PEAD | `factors/pead/event_study.py`, `data/events.py` |
| Cross-Section of Expected Stock Returns | `analytics/factor_analysis/cross_sectional.py` |
| Statistical Arbitrage in U.S. Equities | `factors/stat_arb/` |
| Quality Minus Junk | `factors/quality/signals.py` |
| Fundamental Law of Active Management | `analytics/factor_analysis/fundamental_law.py` |

