import { Request, Response } from 'express'
import { MetricsAPIManager } from './MetricsAPIManager'

const manager = new MetricsAPIManager()

/**
 * Handler: Get a paginated list of runs for a project.
 * Route: GET /api/runs?projectId=llm-finetune&cursor=5&limit=5
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
 * Route: GET /api/runs/stats?projectId=llm-finetune
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
 * Route: GET /api/runs/:runId/metrics/:metricName
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
