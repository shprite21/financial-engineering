# Shprite Equity Lab — local portfolio workspace

Choose equities/ETFs by Yahoo ticker, assign percentage weights, and replay a
buy-and-hold portfolio with yfinance adjusted daily closes. This is a research
UI for the existing Python platform, **not a live trading system**.

## Run on this computer

From the repository root, open two PowerShell terminals.

Terminal 1 — Python API:

```powershell
.\.venv\Scripts\python.exe -m uvicorn apps.portfolio_api:app --host 127.0.0.1 --port 8000
```

Terminal 2 — dashboard:

```powershell
.\scripts\run_dashboard.ps1
```

Open http://localhost:3000. The helper finds Node/pnpm on PATH or uses this
computer's bundled Codex runtime. It runs in the foreground; Ctrl+C stops it.
Use Ctrl+C in each terminal to stop both services. Keep the API bound to loopback.

## Fresh installation

Requires Python 3.10+, Node 22.13+, and pnpm. In the repository root:

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -e '.[dev]'
cd apps\portfolio_dashboard
pnpm install
```

For a normal Node installation, `pnpm dev` in this directory is equivalent to
the helper. `pnpm build` produces the frontend build; the Python service is
still separate. This checkout is intentionally local-only, with no deployment
or broker credentials. Port 3000 is fixed because the API restricts browser
origins to localhost/127.0.0.1 on that port.

## Workflow

1. Name the portfolio; add/remove tickers and edit their weights (total 100%).
2. Use **Equal weight** to allocate evenly. The example holdings are not recommendations.
3. Select a history window, same-currency benchmark, initial capital and annual
   risk-free rate. For Indian equities, use Yahoo suffixes such as `.NS` and an
   INR benchmark such as `^NSEI`. USD holdings can use `SPY`.
4. **Analyze portfolio** downloads public history from Yahoo Finance. Invalid
   tickers, missing history and upstream outages display errors, never fake data.
5. Review performance, drawdown, holdings drift and contribution. **CSV** exports
   the analyzed equity curve with a starting-value row and benchmark.
6. **Save / update** stores the allocation/settings in this browser on this device.
   Saving an existing name explicitly replaces that snapshot. Change the name
   to save another version, then use the selector to reload it. Delete asks for
   confirmation. Analysis results are not persisted. Changing browser or origin
   (localhost versus 127.0.0.1) uses a separate local storage area.

Existing saved portfolios from the previous brand remain readable. New saves use
the `shprite.portfolios.v1` key; the legacy browser data is not removed.

## Method and limitations

- Positive weights only, no leverage or cash sleeve; maximum 30 holdings.
- One quote currency for holdings and benchmark; no FX conversion. Unsupported
  instruments (e.g. futures and crypto) are rejected from the portfolio.
- Adjusted closes approximate dividend/split-adjusted returns. Initial allocations
  are fractional and are **not current executable share quantities**.
- Values are `initial capital × initial weight × adjusted close / first close`.
  Holdings drift; there is **no rebalancing**. Contributions reconcile to total
  portfolio return. Fees, taxes, slippage and execution are excluded.
- Use the intersection of available date coverage; minimum 22 common prices.
  Internal missing dates are rejected, not filled. The current exchange calendar
  day's bar is always excluded. Data retrieval time and actual date range are shown.
- Risk metrics use 252 observations/year. Sharpe deducts a constant annual
  risk-free rate divided by 252. Flat-return Sharpe follows the core library's
  zero convention; undefined beta appears as an em dash.
- Retrospectively selected constituents introduce selection/survivorship bias.
  This is not out-of-sample validation or a guarantee of future returns.
- The dashboard does not yet connect to the repository's regime-conditioned
  strategy pipeline or brokerage order execution.
- Yahoo data availability and usage rights are outside this project; validate
  data quality/licensing before relying on it beyond personal research.

## API and checks

`GET /api/health`; `POST /api/portfolio/analyze`. Interactive schema at
http://127.0.0.1:8000/docs. Example request:

```json
{
  "holdings": [{"ticker": "AAPL", "weight": 60}, {"ticker": "MSFT", "weight": 40}],
  "period": "1y", "benchmark": "SPY", "initial_capital": 100000,
  "risk_free_rate": 0
}
```

From the root: `.\.venv\Scripts\python.exe -m pytest`. From this directory:
`pnpm test`, `pnpm typecheck`, `pnpm build`. Python tests mock market data;
they do not depend on Yahoo or silently fall back to synthetic live results.

The optional feature-detected WebMCP tools configure, analyze and read the same
visible workspace. They do not save allocations or place orders. Browsers without
WebMCP work normally.

### Validation performed

- 47 Python tests and 8 frontend contract tests passed; frontend lint, TypeScript,
  Python lint/type checks and production build passed.
- The page and preview image responded HTTP 200. The real API returned USD
  analysis for AAPL/MSFT against SPY. Yahoo's INR index history had internal gaps
  during testing, correctly producing a data-quality error instead of imputation.
- No browser interaction/visual test was performed. A supported WebMCP testing
  context was unavailable, so registration/execution in a supporting browser is
  **not verified**. The optional hooks do not affect the normal portfolio controls.
- One upstream Starlette test-client deprecation warning remains (httpx); it
  does not fail the API tests.

## Brand card

The Sites skill guided the frontend structure and optional WebMCP surface. The
site remains local. The social card `public/og.png` was generated with built-in
imagegen: "Shprite Equity Lab" / "Systematic equities portfolio research", charcoal
#101a20 and emerald #34d399, restrained analytical grid and abstract data lines,
no financial numbers or performance claims. Local metadata uses the trusted
localhost origin; configure a trusted public origin before any future publishing.

The Shprite rename used one built-in imagegen edit, saved as `public/og.png`.
The exact edit prompt was:

```text
Use case: text-localization
Asset type: landscape brand card
Input images: Image 1 is the edit target.
Primary request: Change only the title "Axiom Equity Lab" to the exact title "Shprite Equity Lab". Shprite is spelled S-h-p-r-i-t-e; render it verbatim, with no extra letters or characters. Keep "Shprite" emerald and "Equity Lab" slate, matching the original typography, weight, size, baseline, and title placement as closely as possible.
Text (verbatim): title "Shprite Equity Lab"; subtitle "Systematic equities portfolio research".
Constraints: Preserve the subtitle exactly and leave its placement and styling unchanged. Preserve the landscape aspect ratio and framing, charcoal #101a20 background, emerald/slate palette, analytical grid, abstract data lines and circular markers, all other typography, composition, and layout unchanged. Change only the title text. No extra text, no watermark, no added elements.
```
