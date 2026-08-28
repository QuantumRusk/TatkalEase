"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { downloadMockTicketPdf } from "@/lib/mockTicketPdf";
import { getSavedRoute } from "@/lib/savedRoute";
import { clearPreauthorizedBooking, getPreauthorizedBooking, markBookingOpen, savePreauthorizedBooking } from "@/lib/preauthorizedBooking";

type Passenger = { name: string; age: string; berth: string };
type LogEntry = { id: number; text: string; tone?: "success" | "warning" };

// Static options used by the booking form and progress indicator.
const stations = [
  "Mumbai Central",
  "Surat",
  "Vadodara",
  "Ahmedabad",
  "Pune",
  "Nagpur",
  "Bhopal",
  "New Delhi",
  "Jaipur",
  "Kota",
];
const classes = ["Sleeper", "3AC", "2AC", "1AC"];
const berths = ["Lower", "Middle", "Upper", "Side", "No preference"];
const stageNames = ["Prepare", "Track", "Payment", "Confirmed"];

// The prototype always prepares a journey for the next calendar day.
const tomorrow = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
};

export default function BookingWorkspace() {
  // Booking workflow state.
  const [stage, setStage] = useState(1);
  const [demoMode, setDemoMode] = useState(true);
  const [prepared, setPrepared] = useState(false);
  const [countdown, setCountdown] = useState(20);
  const [from, setFrom] = useState("Mumbai Central");
  const [to, setTo] = useState("Ahmedabad");
  const [travelDate, setTravelDate] = useState(tomorrow);
  const [travelClass, setTravelClass] = useState("3AC");
  const [passengers, setPassengers] = useState<Passenger[]>([
    { name: "Demo Citizen", age: "21", berth: "No preference" },
  ]);
  const [formError, setFormError] = useState("");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [trackAttempt, setTrackAttempt] = useState(0);
  const [alternateOpen, setAlternateOpen] = useState(false);
  const [selectedTrain, setSelectedTrain] = useState({
    number: "12951",
    name: "Western Express",
    time: "10:00",
  });
  const [paymentPhase, setPaymentPhase] = useState(0);
  const [delayed, setDelayed] = useState(false);
  const [orderStatus, setOrderStatus] = useState<"pending" | "confirmed">(
    "pending",
  );
  const [checkCount, setCheckCount] = useState(0);
  const [lastChecked, setLastChecked] = useState("");
  const [orderId, setOrderId] = useState("");
  const [pnr, setPnr] = useState("");

  useEffect(() => {
    const savedRoute = getSavedRoute();
    setFrom(savedRoute.from);
    setTo(savedRoute.to);
    const activeBooking = getPreauthorizedBooking();
    if (!activeBooking) return;
    setFrom(activeBooking.from);
    setTo(activeBooking.to);
    setTravelDate(activeBooking.travelDate);
    setTravelClass(activeBooking.travelClass);
    setPassengers(activeBooking.passengers);
    setOrderId(activeBooking.orderId);
    setPnr(activeBooking.pnr);
    if (Date.now() >= activeBooking.opensAt) {
      setStage(2);
    } else {
      setPrepared(true);
      setCountdown(Math.max(1, Math.ceil((activeBooking.opensAt - Date.now()) / 1000)));
    }
  }, []);

  // Append activity messages while availability is being checked.
  const addLog = (text: string, tone?: LogEntry["tone"]) =>
    setLogs((current) => [
      ...current,
      { id: Date.now() + Math.random(), text, tone },
    ]);
  const passengerSummary = useMemo(
    () =>
      passengers.map((passenger, index) => ({
        ...passenger,
        seat: `${18 + index}${["LB", "MB", "UB", "SL"][index % 4]}`,
      })),
    [passengers],
  );

  // Count down to the simulated booking opening time.
  useEffect(() => {
    if (!prepared || stage !== 1 || countdown <= 0) return;
    const timer = window.setTimeout(
      () => setCountdown((value) => value - 1),
      1000,
    );
    return () => window.clearTimeout(timer);
  }, [prepared, stage, countdown]);

  // Move from preparation to availability tracking when the countdown ends.
  useEffect(() => {
    if (prepared && stage === 1 && countdown === 0) {
      markBookingOpen();
      setStage(2);
    }
  }, [prepared, stage, countdown]);

  // Simulate availability checks and the optional alternate-train offer.
  useEffect(() => {
    if (stage !== 2 || alternateOpen) return;
    let cancelled = false;
    const check = window.setTimeout(() => {
      if (cancelled) return;
      addLog(`Checking availability for Train ${selectedTrain.number}...`);
      window.setTimeout(() => {
        if (cancelled) return;
        const offerAlternate = Math.random() < 0.4 && trackAttempt < 3;
        if (offerAlternate) {
          addLog(`Train ${selectedTrain.number} full.`, "warning");
          setAlternateOpen(true);
        } else if (trackAttempt >= 3)
          addLog("No seats currently available, we'll keep trying.", "warning");
        else {
          addLog(
            `Seats found in batch #${Math.floor(Math.random() * 8) + 12}.`,
            "success",
          );
          window.setTimeout(() => {
            if (!cancelled) {
              addLog("Seats confirmed — proceeding to payment", "success");
              window.setTimeout(() => !cancelled && setStage(3), 1400);
            }
          }, 1600);
        }
      }, 1900);
    }, 350);
    return () => {
      cancelled = true;
      window.clearTimeout(check);
    };
  }, [stage, trackAttempt, alternateOpen, selectedTrain.number]);

  // Progress the simulated payment flow, including delayed bank responses.
  useEffect(() => {
    if (stage !== 3) return;
    if (paymentPhase === 0) {
      const timer = window.setTimeout(() => {
        if (Math.random() < 0.3) setDelayed(true);
        setPaymentPhase(1);
      }, 1900);
      return () => window.clearTimeout(timer);
    }
    if (paymentPhase === 1 && !delayed) {
      const timer = window.setTimeout(() => setPaymentPhase(2), 1900);
      return () => window.clearTimeout(timer);
    }
    if (paymentPhase === 2) {
      const timer = window.setTimeout(() => setStage(4), 1800);
      return () => window.clearTimeout(timer);
    }
  }, [stage, paymentPhase, delayed]);

  // Validate the trip and passenger details before preparing the booking.
  function submitPrepare(event: FormEvent) {
    event.preventDefault();
    const complete = passengers.every(
      (passenger) => passenger.name.trim() && passenger.age && passenger.berth,
    );
    if (from === to || !complete) {
      setFormError(
        from === to
          ? "Choose two different stations."
          : "Complete each passenger detail to continue.",
      );
      return;
    }
    setFormError("");
    const nextOrderId = `TE-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`;
    const nextPnr = `TE${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    setOrderId(nextOrderId);
    setPnr(nextPnr);
    savePreauthorizedBooking({ from, to, travelDate, travelClass, passengers, orderId: nextOrderId, pnr: nextPnr, opensAt: Date.now() + 20000 });
    setPrepared(true);
    setCountdown(20);
  }

  // Update one field without replacing the other passenger details.
  function updatePassenger(
    index: number,
    field: keyof Passenger,
    value: string,
  ) {
    setPassengers((current) =>
      current.map((passenger, passengerIndex) =>
        passengerIndex === index ? { ...passenger, [field]: value } : passenger,
      ),
    );
  }

  // Accept the offered alternate train and continue toward payment.
  function beginPaymentWithAlternate() {
    setSelectedTrain({
      number: "12953",
      name: "Coastal Connect",
      time: "10:20",
    });
    setAlternateOpen(false);
    addLog("Alternate accepted: Train 12953, departure +20 min.", "success");
    window.setTimeout(() => {
      addLog("Seats confirmed — proceeding to payment", "success");
      window.setTimeout(() => setStage(3), 1200);
    }, 1000);
  }

  // Confirm a delayed payment after two status checks.
  function checkBankStatus() {
    const nextChecks = checkCount + 1;
    setCheckCount(nextChecks);
    setLastChecked(
      new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    );
    if (nextChecks >= 2) {
      setOrderStatus("confirmed");
      setDelayed(false);
    }
  }

  // Return the prototype to its initial preparation state.
  function resetBooking() {
    clearPreauthorizedBooking();
    setStage(1);
    setPrepared(false);
    setCountdown(20);
    setLogs([]);
    setTrackAttempt(0);
    setAlternateOpen(false);
    setPaymentPhase(0);
    setDelayed(false);
    setOrderStatus("pending");
    setCheckCount(0);
    setLastChecked("");
    setOrderId("");
    setPnr("");
  }

  // Generate and download the mock ticket using the confirmed booking data.
  function downloadTicket() {
    downloadMockTicketPdf({
      pnr,
      orderId,
      train: selectedTrain,
      from,
      to,
      travelDate,
      travelClass,
      passengers: passengerSummary,
    });
  }

  // Render the booking workflow, showing one stage at a time.
  return (
    <div className="booking-shell">
      <div className="prototype-banner">
        Independent Hackathon Prototype — not affiliated with IRCTC or Indian
        Railways
      </div>
      <header className="booking-header">
        <a className="brand" href="/">
          Tatkal<span className="brand-mark">Ease</span>
        </a>
        <button
          className={`demo-switch ${demoMode ? "is-on" : ""}`}
          onClick={() => setDemoMode(!demoMode)}
          aria-pressed={demoMode}
        >
          DEMO MODE <i />
        </button>
      </header>
      <nav className="stepper" aria-label="Booking progress">
        {stageNames.map((name, index) => (
          <div
            className={`step ${stage === index + 1 ? "active" : ""} ${stage > index + 1 ? "done" : ""}`}
            key={name}
          >
            <span>{stage > index + 1 ? "✓" : `0${index + 1}`}</span>
            <label>{name}</label>
          </div>
        ))}
      </nav>
      <main className="booking-main">
        {stage === 1 && !prepared && (
          <section className="booking-card prepare-card">
            <p className="micro-label">01 / PREPARE</p>
            <h1>Set up your trip.</h1>
            <p className="card-intro">
              We&apos;ll prepare this mock booking for tomorrow&apos;s opening
              window.
            </p>
            <form onSubmit={submitPrepare}>
              <div className="field-grid">
                <Field label="From station">
                  <select
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                  >
                    {stations.map((station) => (
                      <option key={station}>{station}</option>
                    ))}
                  </select>
                </Field>
                <Field label="To station">
                  <select value={to} onChange={(e) => setTo(e.target.value)}>
                    {stations.map((station) => (
                      <option key={station}>{station}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Travel date">
                  <input
                    type="date"
                    value={travelDate}
                    min={tomorrow()}
                    max={tomorrow()}
                    onChange={(e) => setTravelDate(e.target.value)}
                  />
                </Field>
                <Field label="Class">
                  <select
                    value={travelClass}
                    onChange={(e) => setTravelClass(e.target.value)}
                  >
                    {classes.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </Field>
              </div>
              <div className="passenger-heading">
                <p className="field-label">
                  PASSENGERS <span>UP TO 4</span>
                </p>
                {passengers.length < 4 && (
                  <button
                    type="button"
                    className="text-button"
                    onClick={() =>
                      setPassengers((current) => [
                        ...current,
                        { name: "", age: "", berth: "No preference" },
                      ])
                    }
                  >
                    + Add passenger
                  </button>
                )}
              </div>
              <div className="passenger-list">
                {passengers.map((passenger, index) => (
                  <div className="passenger-row" key={index}>
                    <strong>{String(index + 1).padStart(2, "0")}</strong>
                    <input
                      aria-label={`Passenger ${index + 1} full name`}
                      placeholder="Full name"
                      value={passenger.name}
                      onChange={(e) =>
                        updatePassenger(index, "name", e.target.value)
                      }
                    />
                    <input
                      aria-label={`Passenger ${index + 1} age`}
                      className="age-input"
                      type="number"
                      min="1"
                      max="120"
                      placeholder="Age"
                      value={passenger.age}
                      onChange={(e) =>
                        updatePassenger(index, "age", e.target.value)
                      }
                    />
                    <select
                      aria-label={`Passenger ${index + 1} berth preference`}
                      value={passenger.berth}
                      onChange={(e) =>
                        updatePassenger(index, "berth", e.target.value)
                      }
                    >
                      {berths.map((berth) => (
                        <option key={berth}>{berth}</option>
                      ))}
                    </select>
                    {passengers.length > 1 && (
                      <button
                        type="button"
                        className="remove-button"
                        onClick={() =>
                          setPassengers((current) =>
                            current.filter(
                              (_, passengerIndex) => passengerIndex !== index,
                            ),
                          )
                        }
                        aria-label="Remove passenger"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {formError && <p className="form-error">{formError}</p>}
              <button className="primary-button form-cta" type="submit">
                Pre-authorize &amp; Prepare Booking <span>→</span>
              </button>
              <p className="form-note">
                Nothing is charged yet. We&apos;ll auto-submit the moment
                booking opens.
              </p>
            </form>
          </section>
        )}
        {stage === 1 && prepared && (
          <section className="booking-card status-card">
            <p className="micro-label">01 / PREPARE</p>
            <div className="success-seal">✓</div>
            <h1>Pre-authorized ✓</h1>
            <p className="card-intro">
              Your mock booking is ready for the opening window.
            </p>
            <div className="countdown">
              <small>BOOKING OPENS IN</small>
              <strong>00:{String(countdown).padStart(2, "0")}</strong>
            </div>
            <p className="status-copy">
              We&apos;ll check availability automatically when booking opens.
            </p>
            <a className="dashboard-return-link" href="/dashboard">
              Go back and enjoy until booking opens →
            </a>
            {demoMode && (
              <button
                className="secondary-button"
                onClick={() => { markBookingOpen(); setCountdown(0); }}
              >
                Simulate 10:00 AM
              </button>
            )}
          </section>
        )}
        {stage === 2 && (
          <section className="booking-card track-card">
            <p className="micro-label">02 / TRACK</p>
            <h1>We&apos;re on it.</h1>
            <p className="card-intro">
              Your place and progress stay visible while we check.
            </p>
            <div className="activity-log" aria-live="polite">
              {logs.map((log) => (
                <p className={`log-line ${log.tone ?? ""}`} key={log.id}>
                  <span>•</span>
                  {log.text}
                </p>
              ))}
              {logs.length === 0 && (
                <p className="log-line">
                  <span>•</span>Connecting to the mock booking desk...
                </p>
              )}
            </div>
            {alternateOpen && (
              <div className="alternate-card">
                <p className="micro-label">ALTERNATE OFFERED</p>
                <h2>Train 12953, same route.</h2>
                <p>Coastal Connect departs 20 minutes later at 10:20.</p>
                <div className="button-row">
                  <button
                    className="primary-button"
                    onClick={beginPaymentWithAlternate}
                  >
                    Accept alternate
                  </button>
                  <button
                    className="secondary-button"
                    onClick={() => {
                      setAlternateOpen(false);
                      setTrackAttempt((attempt) => attempt + 1);
                    }}
                  >
                    Decline &amp; keep waiting
                  </button>
                </div>
              </div>
            )}
            {trackAttempt >= 3 && !alternateOpen && (
              <button
                className="secondary-button"
                onClick={() => setTrackAttempt(0)}
              >
                Check availability again
              </button>
            )}
          </section>
        )}
        {stage === 3 && (
          <section className="booking-card payment-card">
            <p className="micro-label">03 / PAYMENT</p>
            <h1>Securing your seat.</h1>
            <p className="order-reference">
              ORDER ID <strong>{orderId}</strong>
            </p>
            <div className="payment-tracker">
              {["Payment Received", "Verifying Seat", "Ticket Issued"].map(
                (name, index) => (
                  <div
                    className={`payment-step ${paymentPhase > index ? "complete" : paymentPhase === index ? "current" : ""}`}
                    key={name}
                  >
                    <span>{paymentPhase > index ? "✓" : index + 1}</span>
                    <p>{name}</p>
                  </div>
                ),
              )}
            </div>
            {demoMode && paymentPhase < 2 && !delayed && (
              <button className="demo-action" onClick={() => setDelayed(true)}>
                Simulate delayed bank response
              </button>
            )}
            {delayed && (
              <div className="warning-card">
                <p className="micro-label">STATUS CHECK REQUIRED</p>
                <h2>Bank confirmation delayed</h2>
                <p>
                  Your payment may still be processing. Please don&apos;t retry
                  — check status instead.
                </p>
                {lastChecked && (
                  <p className="checked-time">
                    {orderStatus === "confirmed"
                      ? "Confirmed"
                      : "Still processing"}{" "}
                    as of {lastChecked}. Checked {checkCount} time
                    {checkCount === 1 ? "" : "s"}.
                  </p>
                )}
                <button className="secondary-button" onClick={checkBankStatus}>
                  Check Bank Status
                </button>
              </div>
            )}
          </section>
        )}
        {stage === 4 && (
          <section className="booking-card confirmed-card">
            <p className="micro-label">04 / CONFIRMED</p>
            <div className="success-seal">✓</div>
            <h1>
              Ticket Confirmed <em>✓</em>
            </h1>
            <p className="card-intro">
              Your mock ticket is ready. Have a smooth journey.
            </p>
            <div className="ticket-summary">
              <div>
                <span>MOCK PNR</span>
                <strong>{pnr}</strong>
              </div>
              <div>
                <span>TRAIN</span>
                <strong>
                  {selectedTrain.number} · {selectedTrain.name}
                </strong>
              </div>
              <div>
                <span>JOURNEY</span>
                <strong>
                  {from} → {to}
                </strong>
                <small>
                  {travelDate} · {travelClass}
                </small>
              </div>
              <div className="ticket-passengers">
                <span>PASSENGERS</span>
                {passengerSummary.map((passenger) => (
                  <p key={passenger.name}>
                    {passenger.name} <b>{passenger.seat}</b>
                    <small>{passenger.berth} berth</small>
                  </p>
                ))}
              </div>
            </div>
            <div className="button-row">
              <button className="primary-button" onClick={downloadTicket}>
                Download mock ticket <span>↓</span>
              </button>
              <button className="secondary-button" onClick={resetBooking}>
                Book another
              </button>
            </div>
          </section>
        )}
      </main>
      <footer className="footer">© 2026 Anumeh Patil. All rights reserved.</footer>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}
