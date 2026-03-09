import React, { useState } from 'react'
import './App.css'

import { RunsTable } from "./components/RunsTable"
import { StatsPanel } from "./components/StatsPanel"
import { MetricChart } from "./components/MetricChart"

const PROJECT_ID = "llm-finetune"

/**
 * Root application component.
 *
 * TODO: Add state to track the currently selected run ID (string | null).
 * Pass selectedRunId to MetricChart and an onSelectRun callback to RunsTable.
 */
function App() {
  // TODO: Add state for selectedRunId
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null)

  return (
    <div className="app">
      <h1>Experiment Metrics Explorer</h1>
      <p className="subtitle">Project: {PROJECT_ID}</p>

      <StatsPanel projectId={PROJECT_ID} />

      <div className="main-layout">
        <div className="table-section">
          {/* TODO: Pass onSelectRun and selectedRunId props */}
          <RunsTable projectId={PROJECT_ID} selectedRunId={selectedRunId} onSelectRun={setSelectedRunId}/>
        </div>
        <div className="metric-section">
          {/* TODO: Pass selectedRunId prop */}
          <MetricChart selectedRunId={selectedRunId} />
        </div>
      </div>
    </div>
  )
}

export default App
