import { Request, Response } from 'express'
import { MetricsAPIManager } from './MetricsAPIManager'

const manager = new MetricsAPIManager()

/**
 * Handler: Get a paginated list of runs for a project.
 *
 * Route: GET /api/runs?projectId=llm-finetune&cursor=5&limit=5
 *
 * TODO: Implement this handler
 *   - Read projectId, cursor, and limit from query params
 *   - If projectId is missing, return 400
 *   - Call manager.getRunsPage() with the parameters
 *   - Return the result as JSON: { runs, nextCursor, totalCount }
 *
 * Note: limit should be parsed as a number (parseInt). cursor is a string.
 */
export async function getRunsPage(req: Request, res: Response) {
  console.info('Backend::API::getRunsPage')

  // get query params
  try {
    const projectId = req.query.projectId?.toString()
    const cursor = req.query.cursor?.toString()
    const limit = parseInt(req.query.limit as string, 10) || undefined

    console.info({projectId: req.query.projectId, cursor, limit})

    if (!projectId) return res.status(400).json({error: "projectId is required"})

    const runs = await manager.getRunsPage(projectId, cursor, limit)

    res.json({data: runs})
  } catch (err) {
    return res.status(500).json({error: err instanceof Error ? err.message : "Something went wrong"})
  }
}

/**
 * Handler: Get aggregated statistics for all runs in a project.
 *
 * Route: GET /api/runs/stats?projectId=llm-finetune
 *
 * TODO: Implement this handler
 *   - Read projectId from query params
 *   - If projectId is missing, return 400
 *   - Call manager.getRunStats()
 *   - Return the stats as JSON
 */
export async function getRunStats(req: Request, res: Response) {
  try {
    console.info('Backend::API::getRunStats')
    const projectId = req.query.projectId?.toString()

    if (!projectId) return res.status(400).json({error: "projectId is required"})

    const runStats = await manager.getRunStats(projectId)

    res.json({data: runStats})

  } catch (err) {
    res.status(500).json({error: err instanceof Error ? err.message : "Something went wrong"})
  }
}

/**
 * Handler: Get the metric time-series for a run.
 *
 * Route: GET /api/runs/:runId/metrics/:metricName
 *
 * TODO: Implement this handler
 *   - Read runId and metricName from route params
 *   - Call manager.getMetricHistory()
 *   - If the result is an empty array, return 404
 *   - Otherwise return the metric points as JSON
 */
export async function getMetricHistory(req: Request, res: Response) {
  console.info('Backend::API::getMetricHistory')

  try {
    const runId = req.params.runId
    const metricName = req.params.metricName

    const metricsHistory = await manager.getMetricHistory(runId, metricName)

    if (!metricsHistory.length) return res.status(404).json({error: "Metric history not found"})

    return res.json({data: metricsHistory})

  } catch (err) {
    res.status(500).json({error: err instanceof Error ? err.message : "Something went wrong"})
  }
}
