import React, { useState, useEffect } from 'react'
import type { RunSummary } from '../../server/sdk-do-not-edit/wandbMetricsSDK'

const API_BASE_URL = "/api"

interface RunsTableProps {
  projectId: string
  selectedRunId: string | null,
  onSelectRun: (runId: string) => void
}

/**
 * Displays a paginated table of experiment runs.
 *
 * TODO 1: Add state for:
 *   - runs: RunSummary[]
 *   - loading: boolean
 *   - nextCursor: string | undefined
 *   - totalCount: number
 *   - cursorHistory: string[] — stack of previous cursors for "Previous" navigation
 *
 * TODO 2: Implement a fetchRuns(cursor?) function
 *   - Fetch from: GET /api/runs?projectId={projectId}&limit=5&cursor={cursor}
 *   - Parse JSON and update: runs, nextCursor, totalCount
 *   - Set loading state appropriately
 *
 * TODO 3: Call fetchRuns() on mount (with no cursor)
 *
 * TODO 4: Implement "Next Page" button
 *   - Push the current cursor onto cursorHistory before fetching
 *   - Fetch with nextCursor
 *
 * TODO 5: Implement "Previous Page" button
 *   - Pop the last cursor from cursorHistory
 *   - Fetch with that cursor
 *
 * TODO 6: Display "Showing X-Y of Z runs" in the pagination area
 *   - X = (page number - 1) * pageSize + 1
 *   - Y = X + runs.length - 1
 *   - Z = totalCount
 *
 * TODO 7: Wire up row click to call onSelectRun, highlight selected row
 */
export function RunsTable({ projectId, selectedRunId, onSelectRun }: RunsTableProps) {
  // Add state variables
  const [runs, setRuns] = useState<RunSummary[]>([])
  const [loading, setLoading] = useState(false)
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined)
  const [cursorHistory, setCursorHistory] = useState<string[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [limit, setLimit] = useState(5)
  const [error, setError] = useState<string | null>(null)

  const reset = () => {
    setRuns([])
    setTotalCount(0)
    setLimit(5)
  }

  const fetchRuns = async (projectId: string) => {
    try {
      setLoading(true)

      // build query params
      const qParams = new URLSearchParams()
      qParams.append('projectId', projectId)
      if (nextCursor) qParams.append('cursor', nextCursor)
      if (limit) qParams.append('limit', String(limit))

      // fetch paginated project runs
      const res = await fetch(`${API_BASE_URL}/runs?${qParams.toString()}`)
      const {data, error} = await res.json()

      if (!res.ok) {
        setError(error)
        reset()
        return
      }

      const {runs, nextCursor: nCursor, totalCount} = data

      setRuns(runs)
      setTotalCount(totalCount)
      setNextCursor(nCursor)

    } catch(err) {
      console.error('Error fetching runs', err)
      setError('Something went wrong')
      reset()

    } finally {
      setLoading(false)
    }

  }

  useEffect(() => {
    fetchRuns(projectId)
  }, [projectId, cursorHistory])

  const onClickNext = () => {
    if (nextCursor) {
      setCursorHistory(prev => [...prev, nextCursor])
    }
  }

  const onClickPrev = () => {
    if (cursorHistory.length) {
      const prev = cursorHistory.at(-2)
      setNextCursor(prev)
      setCursorHistory(cursorHistory.slice(0, -1))
    }
  }

  return (
    <div>
      <h2>Runs</h2>

      {loading && <p className='loading'>Loading...</p>}

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Accuracy</th>
            <th>Loss</th>
            <th>Epochs</th>
            <th>Tags</th>
          </tr>
        </thead>
        <tbody>
          {/* Map over runs to render table rows
            Each row should display:
            - name
            - status (as a badge using status-badge CSS classes)
            - accuracy (as percentage, e.g., "72.3%")
            - loss (toFixed(3))
            - epochs
            - tags (as pill badges using the .tag CSS class)

            Row should be clickable and highlight when selected.
          */}
          {
            runs.map(run => (
            <tr key={run.id} className={selectedRunId === run.id ? 'selected' : ''} onClick={() => onSelectRun(run.id)}>
              <td>{run.name ?? ''}</td>
              <td className={`status-badge status-${run.status ?? ''}`}>{run.status}</td>
              <td>{run.summary?.accuracy ? `${(run.summary?.accuracy * 100).toFixed(1)}%` : ''}</td>
              <td>{run.summary?.loss?.toFixed(3) ?? ''}</td>
              <td>{run.summary.epochs}</td>
              <td>{run.tags.map(tag => (<span key={tag} className={'.tag'}>{tag}</span>))}</td>
            </tr>))
          }
        </tbody>
      </table>

      {/* Pagination controls */}
      <div className="pagination">
        <button disabled={!cursorHistory.length} onClick={onClickPrev}>
          Previous
        </button>
        <span className="page-info">
          {/* TODO: Show "Showing X-Y of Z runs" */}
          Implement pagination
        </span>
        <button disabled={nextCursor === undefined} onClick={onClickNext}>
          Next
        </button>
      </div>
    </div>
  )
}
