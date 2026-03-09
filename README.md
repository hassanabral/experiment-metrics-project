# Experiment Metrics Explorer

## Quick Start

```bash
# Requires Node.js v22+
npm install
npm run dev
```

The app will start at **http://localhost:3000**.

## Project Structure

```
src/
├── server/
│   ├── main.ts                          # Server entry point
│   ├── vite-server.ts                   # Vite + Express bridge
│   ├── api.ts                           # Express router & route definitions
│   ├── apiResolvers.ts                  # API route handlers               ← MODIFY
│   ├── MetricsAPIManager.ts             # SDK wrapper class                ← MODIFY
│   └── sdk-do-not-edit/
│       └── wandbMetricsSDK.ts           # Mocked W&B SDK (DO NOT EDIT)
├── client/
│   ├── main.tsx                         # React entry point
│   ├── App.tsx                          # Root component                   ← MODIFY
│   ├── App.css                          # Styles (pre-built)
│   └── components/
│       ├── RunsTable.tsx                # Paginated runs table             ← MODIFY
│       ├── StatsPanel.tsx               # Aggregated stats display         ← MODIFY
│       └── MetricChart.tsx              # Metric time-series viewer        ← MODIFY
index.html
package.json
tsconfig.json
vite.config.ts
```

## What You're Building

A metrics explorer for the "llm-finetune" project. The dashboard has three main features:

1. **Stats Panel** — Shows aggregated statistics (total runs, accuracy, training time, tags)
2. **Paginated Runs Table** — Browse runs with cursor-based pagination (Next/Previous)
3. **Metric History Viewer** — View accuracy or loss time-series for a selected run

## Files To Modify

### Backend

1. **`src/server/MetricsAPIManager.ts`** — Implement four methods:
   - `getRunsPage(projectId, cursor?, limit?)` — Pass-through pagination from the SDK
   - `getAllRuns(projectId)` — Loop through ALL pages to collect all runs
   - `getRunStats(projectId)` — Compute aggregated stats (counts, averages, best, tags)
   - `getMetricHistory(runId, metricName)` — Fetch metric time-series

2. **`src/server/apiResolvers.ts`** — Implement three route handlers:
   - `getRunsPage` — Parse query params, return paginated results
   - `getRunStats` — Return computed statistics
   - `getMetricHistory` — Return metric history, 404 if empty

### Frontend

3. **`src/client/components/RunsTable.tsx`** — Implement paginated table:
   - State: runs, loading, nextCursor, totalCount, cursorHistory
   - Fetch runs with cursor-based pagination
   - "Next" pushes current cursor to history, fetches with nextCursor
   - "Previous" pops last cursor from history, fetches with it
   - Show "Showing X-Y of Z runs"

4. **`src/client/components/StatsPanel.tsx`** — Fetch and display aggregated stats

5. **`src/client/components/MetricChart.tsx`** — Fetch and display metric history:
   - Dropdown to switch between "accuracy" and "loss"
   - Table of step/value data points

6. **`src/client/App.tsx`** — Wire selectedRunId state between RunsTable and MetricChart

## API Endpoints

| Route | Description |
|-------|-------------|
| `GET /api/runs?projectId=X&cursor=Y&limit=Z` | Paginated runs list |
| `GET /api/runs/stats?projectId=X` | Aggregated statistics |
| `GET /api/runs/:runId/metrics/:metricName` | Metric time-series (metricName: "accuracy" or "loss") |

## SDK Reference

The SDK (`wandbMetricsSDK.ts`) provides:

- **`listRuns({ projectId, cursor?, limit? })`** — Cursor-based pagination. Default limit 5, max 10. Returns `{ runs: RunSummary[], nextCursor: string | undefined, totalCount: number }`.
- **`getMetricHistory(runId, metricName)`** — Returns `MetricPoint[]` (step, value, timestamp).

Available projects: `"llm-finetune"` (13 runs) and `"image-classifier"` (12 runs).

Each `RunSummary` has: `id`, `name`, `status`, `createdAt`, `tags`, `summary` (accuracy, loss, epochs, trainingTime).

## Tips

- Start with the backend: `getRunsPage` (simplest), then `getAllRuns` (pagination loop), then `getRunStats` (aggregation).
- Test the API in your browser: `http://localhost:3000/api/runs?projectId=llm-finetune`.
- For `getRunStats`, remember to filter for `finished` runs when computing averages.
- For frontend pagination, track previous cursors in an array (push on "Next", pop on "Previous").
- If you see "502 Bad Gateway", check the server console for TypeScript errors.
