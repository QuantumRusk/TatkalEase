export default function Home() {
  return (
    <div className="site-shell">
      <div className="prototype-banner">
        Independent Hackathon Prototype — not affiliated with IRCTC or Indian Railways
      </div>

      <header className="topbar">
        <div className="brand">Tatkal<span className="brand-mark">Ease</span></div>
        <span className="demo-label">DEMO MODE</span>
      </header>

      <main className="hero">
        <div className="eyebrow">A calmer booking experience</div>
        <h1>Ready before the rush.</h1>
        <p className="hero-copy">
          Fill in trip details early. TatkalEase securely prepares a mock booking and guides you through availability and payment updates when booking opens.
        </p>

        <div className="hero-actions">
          <a className="primary-button" href="/dashboard" target="_blank" rel="noopener noreferrer">
            Open your dashboard <span aria-hidden="true">↗</span>
          </a>
          <span className="helper-text">Opens your booking dashboard in a new tab</span>
        </div>

        <section className="feature-grid" aria-label="How TatkalEase works">
          <article className="feature">
            <span className="feature-number">01 / PREPARE</span>
            <h2>Pre-fill your trip</h2>
            <p>Add mock passenger and route details ahead of the booking window.</p>
          </article>
          <article className="feature">
            <span className="feature-number">02 / TRACK</span>
            <h2>See what&apos;s happening</h2>
            <p>Plain-language updates keep your booking progress visible at every step.</p>
          </article>
          <article className="feature">
            <span className="feature-number">03 / RECOVER</span>
            <h2>Check, don&apos;t repay</h2>
            <p>If a bank update is delayed, safely check its status before taking another action.</p>
          </article>
        </section>
      </main>

      <footer className="footer">© 2026 Anumeh Patil. All rights reserved.</footer>
    </div>
  );
}
