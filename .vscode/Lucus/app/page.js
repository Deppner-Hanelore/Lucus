import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="landing-shell">
      <section className="backdrop backdrop-one" aria-hidden="true" />
      <section className="backdrop backdrop-two" aria-hidden="true" />

      <header className="top-nav">
        <div>
          <p className="eyebrow">StrataLayer Systems</p>
          <strong className="nav-brand">Core Gateway Engine</strong>
        </div>
        <Link className="secondary-button" href="/dashboard">
          Open dashboard
        </Link>
      </header>

      <section className="hero">
        <div className="hero-copy">
            <p className="section-label">Zero-egress telemetry minimization</p>
            <h1>Cut telemetry bloat before it leaves the edge</h1>
            <p className="hero-lead">
                Lucus compress noisy JSON telemetry, measures the savings and shows the result in a clean operational dashboard.
            </p>

          <div className="cta-row">
            <Link className="primary-button" href="/dashboard">
            Enter the control plane
            </Link>
            <a className="ghost-link" href="#how-it-works">
                How it works
            </a>
          </div>
         </div>
         <aside className="hero-card">
            <span className="metric-label">What this does</span> 
            <p className="hero-summary">
                Simulates an edge gateway that accepts telemetry, normalizes the payload, gzips it, and returns compression metrics for DevOps and FinOps teams.
            </p>
            <dl className="feature-stats">
                <div>
                    <dt>Input</dt>
                    <dd>Bloated JSON payloads</dd>
                </div>
                <div>
                    <dt>Users</dt>
                    <dd>Platform and finance teams</dd>
                </div>
            </dl>
         </aside>
      </section>

        <section className="feature-grid" id="how-it-works">
        <article className="mini-card">
            <span className="metric-label">Step 1</span>
            <h2>Open the dashboard</h2>
            <p>Jump into the ingestion simulator to edit JSON and trigger the optimization loop.</p>
        </article>
        <article className="mini-card">
            <span className="metric-label">Step 3</span>
            <h2>Read the savings</h2>
            <p>Review bytes saved, compression ratio, and latency in the control plane cards.</p>
        </article>
        </section>  
      </main>
    );
}