import { createClient, RunSummary, MetricPoint } from "./sdk-do-not-edit/wandbMetricsSDK"

/**
 * This class wraps the W&B Metrics SDK to provide experiment run data
 * and aggregated statistics for the API endpoints.
 */
const client = createClient()

export interface RunStats {
  totalRuns: number
  byStatus: { running: number; finished: number; failed: number }
  avgAccuracy: number
  bestAccuracy: { runId: string; runName: string; accuracy: number }
  avgTrainingTime: number
  uniqueTags: string[]
}

export class MetricsAPIManager {
  /**
   * Get a single page of runs for a project (pass-through pagination).
   *
   * TODO: Implement this method
   *   - Call the SDK client's listRuns() with the provided options
   *   - Return the result as-is (runs, nextCursor, totalCount)
   *   - Handle errors gracefully
   */
  public async getRunsPage(
    projectId: string,
    cursor?: string,
    limit?: number
  ): Promise<{ runs: RunSummary[]; nextCursor: string | undefined; totalCount: number }> {
    try {
      console.info("APIManager::getRunsPage", { projectId, cursor, limit})
      const runs = await client.listRuns({ projectId, cursor, limit})
      
      return runs
    } catch (err) {
      console.error("Error fetching runs page", err)
      throw Error("Error fetching runs page")
    }
  }

  /**
   * Get ALL runs for a project by looping through all pages.
   *
   * TODO: Implement this method
   *   - Start with no cursor
   *   - Loop: call listRuns, collect the runs, use nextCursor for the next call
   *   - Stop when nextCursor is undefined
   *   - Return the complete array of all runs
   */
  public async getAllRuns(projectId: string): Promise<RunSummary[]> {
    
    try {
      let projectRuns: RunSummary[] = []
      let cursor = undefined

      do {
        const curPageRuns = await client.listRuns({projectId, cursor})
        cursor = curPageRuns.nextCursor

        // append current page runs (new copy) to project runs 
        projectRuns = [...projectRuns, ...curPageRuns.runs]
      } while (cursor !== undefined)

        // return the run summaries
        return projectRuns

    } catch(err) {
      console.error(`Error fetching all runs for prject: ${projectId}`, err)
      throw Error("Error fetching all runs for prject")
      
    }
  }

  /**
   * Compute aggregated statistics for all runs in a project.
   *
   * TODO: Implement this method
   *   - Use getAllRuns() to get all runs for the project
   *   - Compute and return a RunStats object:
   *     - totalRuns: total number of runs
   *     - byStatus: count of runs for each status (running, finished, failed)
   *     - avgAccuracy: average accuracy of FINISHED runs only
   *     - bestAccuracy: the finished run with the highest accuracy (runId, runName, accuracy)
   *     - avgTrainingTime: average training time of FINISHED runs only (in seconds)
   *     - uniqueTags: all unique tags across all runs, sorted alphabetically
   *
   *   Hint: Array.reduce, Array.filter, Set, and Array.sort will be useful here
   */
  public async getRunStats(projectId: string): Promise<RunStats> {
    try {
       const runs = await this.getAllRuns(projectId)

       // total runs
       const totalRuns = runs.length

       // count of runs for each status (running, finished, failed)
       const byStatus = runs.reduce((accum, cur) => {
        if (cur.status in accum) accum[cur.status] += 1
        return accum

       }, { running: 0, finished: 0, failed: 0 })

       // average accuracy of FINISHED runs only
       const finishedRuns = runs.filter(run => run.status === "finished")
       const avgAccuracy = finishedRuns.map(run => run.summary.accuracy).reduce((a, c) => a + c, 0) / finishedRuns.length || 0

       // best accuracy
       const bestAccuracy = finishedRuns.length > 0 ? finishedRuns.reduce(
        (accum, cur) => {
          if (cur.summary.accuracy > accum.accuracy) {
            return { runId: cur.id, runName: cur.name, accuracy: cur.summary.accuracy }
          }
          return accum
        }, 
       { runId: finishedRuns[0].id, runName: finishedRuns[0].name, accuracy: finishedRuns[0].summary.accuracy }
      ) : { runId: '', runName: '', accuracy: 0}

      // average training time of FINISHED runs only (in seconds)
      const avgTrainingTime = finishedRuns.map(run => run.summary.trainingTime).reduce((a, c) => a + c, 0) / finishedRuns.length || 0

      // all unique tags across all runs, sorted alphabetically
      const uniqTags = new Set(runs.flatMap(run => run.tags))
      const sortedUniqTags = [...uniqTags].sort()

      return {
        totalRuns,
        byStatus,
        avgAccuracy,
        bestAccuracy,
        avgTrainingTime,
        uniqueTags: sortedUniqTags,
      }

    } catch (err) {
      console.error(`Error fetching run stats for project ${projectId}:`, err)
      throw Error("Error fetching run stats")
    }

   
  }

  /**
   * Get the metric history for a run.
   *
   * TODO: Implement this method
   *   - Call the SDK client's getMetricHistory() with the runId and metricName
   *   - Return the array of MetricPoints
   */
  public async getMetricHistory(
    runId: string,
    metricName: string
  ): Promise<MetricPoint[]> {
    try {
      const metricsHistory = await client.getMetricHistory(runId, metricName)

      return metricsHistory

    } catch (err) {
      console.error(`Error fetching metric history with runId: ${runId}, metricsName: ${metricName}`, err)
      throw Error("Error fetching metric history")

    }
    
  }
}
