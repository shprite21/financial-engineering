# Reproducibility

Research runs should be reproducible across machines and future data refreshes:

- use configuration files under `configs/`
- cache external datasets under `data/cached/`
- preserve universe membership snapshots for historical studies
- lag fundamentals and alternative data before joining to returns
- shift portfolio weights before applying returns
- store random seeds for synthetic data and ML experiments

The included synthetic data uses deterministic seeds so tests, dashboards, and API examples are stable.

