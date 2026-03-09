import React, { useState, useEffect } from 'react'

const API_BASE_URL = "/api"

interface StatsData {
  totalRuns: number
  byStatus: { running: number; finished: number; failed: number }
  avgAccuracy: number
  bestAccuracy: { runId: string; runName: string; accuracy: number }
  avgTrainingTime: number
  uniqueTags: string[]
}

interface StatsPanelProps {
  projectId: string
}

/**
 * Displays aggregated statistics for a project's runs.
 *
 * TODO 1: Add state for `stats` (StatsData | null) and `loading` (boolean)
 *
 * TODO 2: Use useEffect to fetch stats when the component mounts
 *   - Fetch from: GET /api/runs/stats?projectId={projectId}
 *   - Set loading state appropriately
 *   - Parse JSON and update stats state
 *
 * The display cards below are pre-built — once you populate the `stats` state,
 * they will render automatically.
 */
export function StatsPanel({ projectId }: StatsPanelProps) {
  // TODO: Add state for stats and loading
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(false)

  // TODO: Fetch stats on mount
  useEffect(() => {
    const fetchProjectRunStats = async (projectId: string) => {
      try {
        setLoading(true)

        const res = await fetch(`${API_BASE_URL}/runs/stats?projectId=${projectId}`)
        const {data, error} = await res.json()

        if (!res.ok) {
          console.error("Error fetching project run stats", error)
          setStats(null)
          return
        }

        setStats(data)

      } catch (err) {
        console.error("Error fetching project run stats", err)

      } finally {
        setLoading(false)
      }
    }

    fetchProjectRunStats(projectId)
  }, [projectId])

  if (loading) {
    return <div className="stats-panel"><p className="loading">Loading statistics...</p></div>
  }

  if (!stats) {
    return (
      <div className="stats-panel">
        <div className="stat-card">
          <p className="empty-state">Implement the TODO to load stats</p>
        </div>
      </div>
    )
  }

  return (
    <div className="stats-panel">
      <div className="stat-card">
        <h4>Total Runs</h4>
        <div className="stat-value">{stats.totalRuns}</div>
        <div className="status-counts">
          <span className="status-count">
            <span className="status-badge status-finished">{stats.byStatus.finished} finished</span>
          </span>
          <span className="status-count">
            <span className="status-badge status-running">{stats.byStatus.running} running</span>
          </span>
          <span className="status-count">
            <span className="status-badge status-failed">{stats.byStatus.failed} failed</span>
          </span>
        </div>
      </div>

      <div className="stat-card">
        <h4>Best Accuracy</h4>
        <div className="stat-value">{(stats.bestAccuracy.accuracy * 100).toFixed(1)}%</div>
        <div className="stat-detail">{stats.bestAccuracy.runName}</div>
      </div>

      <div className="stat-card">
        <h4>Avg Accuracy (Finished)</h4>
        <div className="stat-value">{(stats.avgAccuracy * 100).toFixed(1)}%</div>
      </div>

      <div className="stat-card">
        <h4>Avg Training Time (Finished)</h4>
        <div className="stat-value">{Math.round(stats.avgTrainingTime / 3600)}h {Math.round((stats.avgTrainingTime % 3600) / 60)}m</div>
      </div>

      <div className="stat-card">
        <h4>Tags</h4>
        <div className="tag-list">
          {stats.uniqueTags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
