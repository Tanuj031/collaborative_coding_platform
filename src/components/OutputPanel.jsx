// OutputPanel component: Simulated execution console at bottom of Room workspace
// Features execution indicator, clear output capability, and collapse toggle
import React from 'react';
import './OutputPanel.css';

export default function OutputPanel({
  output = '',
  isRunning = false,
  onClear,
  isCollapsed = false,
  onToggleCollapse
}) {
  return (
    <div className="output-panel-container" aria-label="Execution Output Panel">
      {/* Console Header Bar */}
      <div className="output-header">
        <div className="output-header-left">
          {/* Status indicator (green when ready, pulsing amber when executing) */}
          <span
            className={`output-status-indicator ${isRunning ? 'running' : ''}`}
            title={isRunning ? 'Execution in progress' : 'Ready'}
          ></span>
          <span className="output-title-text">Execution Output</span>
        </div>

        <div className="output-header-right">
          {/* Clear Console Action */}
          <button
            type="button"
            className="output-action-btn output-clear-btn"
            onClick={onClear}
            title="Clear output console"
          >
            Clear
          </button>

          {/* Panel Collapse / Expand Action */}
          <button
            type="button"
            className="output-action-btn"
            onClick={onToggleCollapse}
            title={isCollapsed ? 'Expand panel' : 'Collapse panel'}
          >
            {isCollapsed ? '▲ Expand' : '▼ Collapse'}
          </button>
        </div>
      </div>

      {/* Terminal Body (shown only when expanded) */}
      {!isCollapsed && (
        <div className="output-body">
          {isRunning ? (
            <div className="output-running-text">
              <span className="output-prompt-symbol">$</span>
              <span>Running code simulation...</span>
            </div>
          ) : (
            <pre className="output-content">
              <span className="output-prompt-symbol">$</span>
              {output || 'No output to display. Click "▶ Run" to execute.'}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
