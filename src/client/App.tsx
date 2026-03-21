import React, { useState } from 'react'
import './App.css'

import { RunsTable } from "./components/RunsTable"
import { StatsPanel } from "./components/StatsPanel"
import { MetricChart } from "./components/MetricChart"

const PROJECT_ID = "llm-finetune"

/** Root application component. */
function App() {
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null)

  return (
    <div className="app">
      <h1>Experiment Metrics Explorer</h1>
      <p className="subtitle">Project: {PROJECT_ID}</p>

      <StatsPanel projectId={PROJECT_ID} />

      <div className="main-layout">
        <div className="table-section">
          <RunsTable projectId={PROJECT_ID} selectedRunId={selectedRunId} onSelectRun={setSelectedRunId}/>
        </div>
        <div className="metric-section">
          <MetricChart selectedRunId={selectedRunId} />
        </div>
      </div>
    </div>
  )
}

export default App
