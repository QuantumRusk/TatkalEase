"use client";

import { useEffect, useState } from "react";
import { defaultSavedRoute, getSavedRoute, routeStations, saveSavedRoute, type SavedRoute } from "@/lib/savedRoute";

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true });
}

function formatDate(date: Date) {
  return date.toLocaleDateString([], { weekday: "short", day: "numeric", month: "short" });
}

export default function Dashboard() {
  const [now, setNow] = useState<Date | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [savedRoute, setSavedRoute] = useState<SavedRoute>(defaultSavedRoute);
  const [routeDraft, setRouteDraft] = useState<SavedRoute>(defaultSavedRoute);
  const [editingRoute, setEditingRoute] = useState(false);
  const [routeError, setRouteError] = useState("");
  const [routeSaved, setRouteSaved] = useState(false);

  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const route = getSavedRoute();
    setSavedRoute(route);
    setRouteDraft(route);
  }, []);

  function beginRouteEdit() {
    setRouteDraft(savedRoute);
    setRouteError("");
    setRouteSaved(false);
    setEditingRoute(true);
  }

  function saveRoute() {
    if (routeDraft.from === routeDraft.to) {
      setRouteError("Choose two different stations.");
      return;
    }
    saveSavedRoute(routeDraft);
    setSavedRoute(routeDraft);
    setRouteSaved(true);
    setEditingRoute(false);
  }

  return (
    <div className="dashboard-shell">
      <div className="prototype-banner">Independent Hackathon Prototype — not affiliated with IRCTC or Indian Railways</div>
      <header className="dashboard-header">
        <div className="dashboard-nav-left">
          <a className="brand" href="/">Tatkal<span className="brand-mark">Ease</span></a>
          <a className="home-link" href="/dashboard">Home</a>
        </div>
        <div className="dashboard-nav-right">
          <div className="live-clock" aria-label="Your device time">{now ? <><strong>{formatTime(now)}</strong><span>{formatDate(now)}</span></> : <span>Loading time...</span>}</div>
          <div className="menu-wrap">
            <button className="icon-button" onClick={() => { setAlertsOpen((open) => !open); setProfileOpen(false); }} aria-label="Open notifications">🔔<i /></button>
            {alertsOpen && <div className="popover alert-popover"><p className="micro-label">UP NEXT</p><strong>Booking opens tomorrow</strong><p>Tatkal booking opens for your saved route tomorrow, 10:00 AM.</p></div>}
          </div>
          <div className="menu-wrap">
            <button className="profile-button" onClick={() => { setProfileOpen((open) => !open); setAlertsOpen(false); }} aria-expanded={profileOpen}><span>AP</span><b>Demo Citizen</b><em>⌄</em></button>
            {profileOpen && <div className="popover profile-popover"><div className="profile-card-head"><span>DC</span><div><strong>Demo Citizen</strong><small>Signed in</small></div></div><dl><div><dt>Contact</dt><dd>+91 XXXXXXXXX</dd></div><div><dt>Address</dt><dd>Mumbai, Maharashtra</dd></div><div><dt>Documents</dt><dd className="verified">✓ Verified</dd></div></dl><button className="edit-route-button" onClick={beginRouteEdit}>Edit saved route</button>{editingRoute && <div className="route-editor"><p className="micro-label">EDIT SAVED ROUTE</p><label>From<select value={routeDraft.from} onChange={(event) => setRouteDraft((route) => ({ ...route, from: event.target.value }))}>{routeStations.map((station) => <option key={station}>{station}</option>)}</select></label><label>To<select value={routeDraft.to} onChange={(event) => setRouteDraft((route) => ({ ...route, to: event.target.value }))}>{routeStations.map((station) => <option key={station}>{station}</option>)}</select></label>{routeError && <p className="route-error">{routeError}</p>}<div><button className="save-route-button" onClick={saveRoute}>Save route</button><button className="cancel-route-button" onClick={() => setEditingRoute(false)}>Cancel</button></div></div>}{routeSaved && <p className="route-saved">✓ Saved route updated</p>}</div>}
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <p className="micro-label">HOME / YOUR BOOKING SPACE</p>
        <h1>Good to see you, DC.</h1>
        <p className="dashboard-intro">Your next-day booking details are ready when you are.</p>
        <section className="dashboard-hero-card">
          <div><p className="micro-label">READY TO PREPARE</p><h2>Plan tomorrow&apos;s journey now.</h2><p>Save your passenger details early, then let TatkalEase guide you through the mock booking window.</p><a className="primary-button" href="/book">Start a booking <span aria-hidden="true">→</span></a></div>
          <div className="route-preview"><span>YOUR SAVED ROUTE</span><strong>{savedRoute.from} <i>→</i> {savedRoute.to}</strong><small>Tomorrow · 3AC · Tatkal demo</small>{routeSaved && <b className="route-preview-saved">✓ Route updated</b>}</div>
        </section>
        <section className="dashboard-grid">
          <article className="dashboard-card"><p className="micro-label">PROFILE STATUS</p><h3>Ready to book</h3><p>Your mock profile and passenger details are verified for this demo.</p><span className="small-status">✓ Profile complete</span></article>
          <article className="dashboard-card"><p className="micro-label">HOW IT WORKS</p><h3>Prepare before 10:00 AM</h3><p>We will show every update clearly, including safe bank-status checks if needed.</p><a href="/book">View booking flow →</a></article>
        </section>
      </main>
      <footer className="footer">© 2026 Anumeh Patil. All rights reserved.</footer>
    </div>
  );
}
