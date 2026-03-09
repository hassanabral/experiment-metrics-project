/**
 * This file sets up the Express router and defines API routes.
 * You may edit this file if needed, but it should work as-is once
 * the resolvers are implemented.
 */
import express from 'express'

import { getRunsPage, getRunStats, getMetricHistory } from "./apiResolvers"

const router = express.Router()

/**
 * API endpoints:
 * GET /api/runs?projectId=X&cursor=Y&limit=Z  — Paginated runs list
 * GET /api/runs/stats?projectId=X              — Aggregated statistics
 * GET /api/runs/:runId/metrics/:metricName     — Metric time-series
 */
router.get('/runs/stats', getRunStats)
router.get('/runs/:runId/metrics/:metricName', getMetricHistory)
router.get('/runs', getRunsPage)

export { router as api }
