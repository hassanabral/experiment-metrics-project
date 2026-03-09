import React, { useState, useEffect } from 'react'
import type { MetricPoint } from '../../server/sdk-do-not-edit/wandbMetricsSDK'

const API_BASE_URL = "/api"

/**
 * Displays the metric time-series for a selected run as an HTML table.
 *
 * Props (you'll need to define these):
 *   - selectedRunId: string | null — the run to show metrics for
 *
 * TODO 1: Add state for:
 *   - metricPoints: MetricPoint[]
 *   - loading: boolean
 *   - metricName: string (default "accuracy")
 *
 * TODO 2: Use useEffect to fetch metric history when selectedRunId or metricName changes
 *   - If selectedRunId is null, clear metricPoints and return
 *   - Fetch from: GET /api/runs/{selectedRunId}/metrics/{metricName}
 *   - Set loading state appropriately
 *   - Handle 404 (no metric data) by setting metricPoints to empty array
 *
 * TODO 3: Render the metric selector dropdown (pre-built below, just wire the state)
 *
 * TODO 4: Render the metric data as a table showing step and value columns
 *
 * Hint: The display JSX below is mostly pre-built. Focus on the state and data fetching.
 */

type Props = {
  selectedRunId: string | null
}

export function MetricChart({ selectedRunId }: Props) {
  // Add state for metricPoints, loading, metricName
  const [loading, setLoading] = useState(false)
  const [metricPoints, setMetricPoints] = useState<MetricPoint[]>([])
  const [metricName, setMetricName] = useState<string>('accuracy')

  // Fetch metric history when selectedRunId or metricName changes
  useEffect(() => {
    if (!selectedRunId || !metricName) {
      setMetricPoints([])
      return
    }

    const fetchRunMetrics = async (runId: string, metricName: string) => {
      try {
        setLoading(true)
        const res = await fetch(`${API_BASE_URL}/runs/${runId}/metrics/${metricName}`)
        const {data, error} = await res.json()

        if (!res.ok) {
          console.error("Error fetching run metrics:", error)
          setMetricPoints([])
          return
        }

        setMetricPoints(data)

      } catch (err) {
        console.error("Error fetching run metrics:", err)

      } finally {
        setLoading(false)
      }

    }

    fetchRunMetrics(selectedRunId, metricName)

  }, [selectedRunId, metricName])


  if (!selectedRunId) {
    return (
      <div className="metric-card">
        <h3>Metric History</h3>
        <p className="empty-state">Select a run to view metrics</p>
      </div>
    )
  }

  return (
    <div className="metric-card">
      <h3>Metric History</h3>

      <div className="metric-selector">
        <label>Metric: </label>
        {/* Wire onChange to update metricName state */}
        <select value={metricName} onChange={(e) => setMetricName(e.target.value)}>
          <option value="accuracy">Accuracy</option>
          <option value="loss">Loss</option>
        </select>
      </div>

      {loading ? (
        <p className="loading">Loading metrics...</p>
      ) : metricPoints.length === 0 ? (
        <p className="empty-state">No metric data available</p>
      ) : (
        <div className="metric-table">
          <table>
            <thead>
              <tr>
                <th>Step</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {/* Map over metricPoints to render rows */}
              {metricPoints.map(point => (
                <tr key={point.step}>
                  <td>{point.step}</td>
                  <td>{point.value.toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
