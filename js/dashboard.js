// Dashboard logic: normalizes the JSON in the textarea, gzips it in the
// browser and fills in the metric cards. No server is needed.

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

const $ = (id) => document.getElementById(id);

const input = $('telemetry-input');
const button = $('optimize-button');
const statusChip = $('status-chip');
const errorBanner = $('error-banner');

input.value = sampleTelemetry;

// Removes empty objects/arrays and collapses runs of whitespace in strings.
// Duplicate keys are already dropped by JSON.parse.
function normalize(value) {
  if (typeof value === 'string') {
    return value.trim().replace(/\s+/g, ' ');
  }
  if (Array.isArray(value)) {
    return value.map(normalize).filter((item) => !isEmpty(item));
  }
  if (value && typeof value === 'object') {
    const out = {};
    for (const [key, child] of Object.entries(value)) {
      const cleaned = normalize(child);
      if (!isEmpty(cleaned)) out[key] = cleaned;
    }
    return out;
  }
  return value;
}

function isEmpty(value) {
  if (Array.isArray(value)) return value.length === 0;
  if (value && typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

async function gzipSize(text) {
  const stream = new Blob([text]).stream().pipeThrough(new CompressionStream('gzip'));
  const buffer = await new Response(stream).arrayBuffer();
  return buffer.byteLength;
}

function setProcessing(active) {
  button.disabled = active;
  button.textContent = active ? 'Optimizing...' : 'Trigger Ingestion Optimization Loop';
  statusChip.dataset.state = active ? 'active' : 'idle';
  statusChip.textContent = active ? 'Processing' : 'Ready';
}

function showError(message) {
  errorBanner.textContent = message;
  errorBanner.hidden = !message;
}

function render(result) {
  const m = result.metrics;
  $('m-status').textContent = result.status;
  $('m-client').textContent = result.client_id;
  $('m-env').textContent = result.environment;
  $('m-original').textContent = m.original_bytes.toLocaleString();
  $('m-optimized').textContent = m.optimized_bytes.toLocaleString();
  $('m-reduction').textContent = `${m.reduction.toFixed(2)}%`;
  $('m-ratio').textContent = `${m.ratio.toFixed(1)}x`;
  $('m-ratio-2').textContent = `${m.ratio.toFixed(1)}x`;
  $('gauge-label').textContent = `${m.reduction.toFixed(2)}%`;
  $('gauge-fill').style.width = `${Math.min(Math.max(m.reduction, 0), 100)}%`;
  $('m-latency').textContent = `${m.latency.toFixed(2)} ms`;
  $('m-latency-2').textContent = `${m.latency.toFixed(2)} ms`;
}

async function handleOptimize() {
  showError('');
  setProcessing(true);

  try {
    const started = performance.now();
    const raw = input.value;
    const parsed = JSON.parse(raw);
    const minified = JSON.stringify(normalize(parsed));

    const originalBytes = new TextEncoder().encode(raw).byteLength;
    const optimizedBytes = await gzipSize(minified);
    const latency = performance.now() - started;

    render({
      status: 'optimized',
      client_id: parsed.client_id || 'unknown-client',
      environment: parsed.environment || 'unknown',
      metrics: {
        original_bytes: originalBytes,
        optimized_bytes: optimizedBytes,
        reduction: originalBytes ? (1 - optimizedBytes / originalBytes) * 100 : 0,
        ratio: optimizedBytes ? originalBytes / optimizedBytes : 0,
        latency,
      },
    });
  } catch (error) {
    showError(error instanceof SyntaxError ? `Invalid JSON: ${error.message}` : error.message);
  } finally {
    setProcessing(false);
  }
}

button.addEventListener('click', handleOptimize);
