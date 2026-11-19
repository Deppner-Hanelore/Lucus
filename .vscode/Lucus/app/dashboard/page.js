    'use client';

import {useMemo, useState } from 'react';

const sampleTelemetry = `{
  "client_id": "client-uuid-token",
  "environment": "production",
  "timestamp": "2026-05-31T10:14:22.155Z",
  "telemetry_stream": {
    "service": "edge-gateway",
    "debug": true,
    "debug": true,
    "metrics": [
      {
        "name": "request_latency_ms",
        "value": 42.882,
        "metadata": {},
        "metadata": {}
      },
      {
        "name": "egress_bytes",
        "value": 18244,
        "notes": "    repetitive whitespace      padding    "
      }
    ],
    "events": [
      {},
      {},
      {
        "level": "info",
        "message": "telemetry burst observed",
        "message": "telemetry burst observed"
      }
    ]
  }
}`;

function formatPercent(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return '0.00%';
  }

  return `${value.toFixed(2)}%`;
}

function formatRatio(value) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    return '0.0x';
  }

  return `${value.toFixed(1)}x`;
}

export default function DashboardPage() {
  const [telemetry, setTelemetry] = useState(sampleTelemetry);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState({
    status: 'idle',
    client_id: 'client-uuid-token',
    environment: 'production',
    metrics: {
      original_bytes: 0,
      optimized_bytes: 0,
      data_reduction_percentage: '0.00%',
      egress_compression_ratio: '0.0x',
      edge_latency_ms: '0.00',
    },
  });

  const reductionValue = useMemo(() => {
    const numeric = Number.parseFloat(result.metrics.data_reduction_percentage);
    return Number.isFinite(numeric) ? numeric : 0;
  }, [result.metrics.data_reduction_percentage]);

  async function handleOptimize() {
    setError('');
    setIsProcessing(true);

    try {
      const parsed = JSON.parse(telemetry);
      const response = await fetch('/api/v1/telemetry/compress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsed),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || 'Optimization failed');
      }

      setResult(payload);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unexpected error');
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <main className="shell">
      <section className="backdrop backdrop-one" aria-hidden="true" />
      <section className="backdrop backdrop-two" aria-hidden="true" />

      <header className="header">
        <div>
          <p className="eyebrow">StrataLayer Systems</p>
          <h1>Zero-Egress Edge Minimization Framework</h1>
        </div>
        <p className="header-note">
          Serverless compression, operational clarity, and cost reduction in one control surface.
        </p>
      </header>

      <section className="dashboard">
        <section className="panel terminal-panel">
          <div className="panel-heading">
            <h2>Ingestion Simulator</h2>
            <span>Mutable telemetry stream</span>
          </div>
          <label className="terminal-label" htmlFor="telemetry-input">
            Mock payload injection
          </label>
          <textarea
            id="telemetry-input"
            className="terminal-input"
            value={telemetry}
            onChange={(event) => setTelemetry(event.target.value)}
            spellCheck="false"
          />
          <div className="actions">
            <button className="primary-button" onClick={handleOptimize} disabled={isProcessing}>
              {isProcessing ? 'Optimizing...' : 'Trigger Ingestion Optimization Loop'}
            </button>
            <div className="status-chip" data-state={isProcessing ? 'active' : 'idle'}>
              {isProcessing ? 'Processing' : 'Ready'}
            </div>
          </div>
          <p className="supporting-copy">
            The simulator sends the current JSON payload to the serverless compression controller and
            refreshes the diagnostics panel with live metrics.
          </p>
          {error ? <p className="error-banner">{error}</p> : null}
        </section>

        <section className="panel analytics-panel">
          <div className="panel-heading">
            <h2>Diagnostic Control Plane</h2>
            <span>Real-time compression telemetry</span>
          </div>

          <div className="metric-grid">
            <article className="metric-card">
              <span className="metric-label">Status</span>
              <strong className="metric-value status-value">{result.status}</strong>
              <p className="metric-subtext">{result.client_id}</p>
            </article>
            <article className="metric-card">
              <span className="metric-label">Environment</span>
              <strong className="metric-value">{result.environment}</strong>
              <p className="metric-subtext">Edge runtime profile</p>
            </article>
            <article className="metric-card">
              <span className="metric-label">Original bytes</span>
              <strong className="metric-value">{result.metrics.original_bytes.toLocaleString()}</strong>
              <p className="metric-subtext">Raw JSON ingress</p>
            </article>
            <article className="metric-card">
              <span className="metric-label">Optimized bytes</span>
              <strong className="metric-value">{result.metrics.optimized_bytes.toLocaleString()}</strong>
              <p className="metric-subtext">Gzip binary output</p>
            </article>
            <article className="metric-card">
              <span className="metric-label">Reduction</span>
              <strong className="metric-value">{result.metrics.data_reduction_percentage}</strong>
              <p className="metric-subtext">Space removed</p>
            </article>
            <article className="metric-card">
              <span className="metric-label">Compression ratio</span>
              <strong className="metric-value">{result.metrics.egress_compression_ratio}</strong>
              <p className="metric-subtext">Density multiplier</p>
            </article>
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <span>Reduction gauge</span>
              <strong>{formatPercent(reductionValue)}</strong>
            </div>
            <div className="bar-track" aria-hidden="true">
              <div className="bar-fill" style={{ width: `${Math.min(Math.max(reductionValue, 0), 100)}%` }} />
            </div>
            <div className="chart-footer">
              <span>Edge latency</span>
              <strong>{result.metrics.edge_latency_ms} ms</strong>
            </div>
          </div>

          <div className="insight-strip">
            <div>
              <span className="metric-label">Latency profile</span>
              <strong>{result.metrics.edge_latency_ms} ms</strong>
            </div>
            <div>
              <span className="metric-label">Target efficiency</span>
              <strong>{formatRatio(Number.parseFloat(result.metrics.egress_compression_ratio))}</strong>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}