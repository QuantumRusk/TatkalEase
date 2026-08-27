# Codex build log — TatkalEase

This file documents how Codex was used throughout the build, as required by the hackathon brief. Entries below are representative real prompts from the build conversation; the Stage 2 prompt covered the Prepare, Track, Payment, and Confirmed states together.

---

## Stage: Landing page

### Prompt 1

**Given to Codex:**

> Alright build the landing page. Will refine it again later. Make sure on npm run dev, it opens first and there is CTA button which opens main-workspace opens in new page, not same page. Also Add footer at bottom: c 2026 Anumeh Patil All right resereved. Go ahead.

**What Codex generated:** A mobile-first TatkalEase landing page using the cream, charcoal, lime, and orange design system; a persistent independence banner; hero copy; three feature cards; a CTA that opens `/book` in a separate tab; and the requested copyright footer.

**Manual changes after:** None recorded. The landing page was intentionally left open for later visual refinement.

---

## Stage: Prepare (booking form)

### Prompt 1

**Given to Codex:**

> Project: TatkalEase — Booking Page (Stage 2 of the prototype). Context: Landing page is done (cream/black theme, lime-green CTA, orange accents, monospace micro-labels like "01 / PREPARE"). This booking page must visually match that established design system. All 4 stages live on ONE page/route, transitioning in place (no full page reloads) — treat it as a single-page state machine.
>
> Stage 1 — Prepare: Build a next-day mock booking form with From/To stations, class, passenger blocks (up to four), berth preference, required-field checks, a "Pre-authorize & Prepare Booking" CTA, countdown confirmation, and a demo-mode "Simulate 10:00 AM" control.

**What Codex generated:** A client-side `/book` state machine with a persistent banner, header, demo toggle, and four-step progress indicator. The Prepare step includes mock station data, next-day date restriction, repeatable passenger rows, simple form validation, countdown confirmation, and a demo skip control.

**Manual changes after:** None recorded.

---

## Stage: Track (waiting room)

### Prompt 1

**Given to Codex:**

> In Stage 2 — Track, show a vertical timeline/log inside a card. Append new availability messages every 1.5–2.5 seconds. Simulate either seats found or, about 40% of the time, a full train and an alternate train offer. "Accept alternate" proceeds; "Decline & keep waiting" retries before showing a visible no-seat fallback state.

**What Codex generated:** A timer-based, append-only activity log that preserves each availability event; randomized mock availability; an inline alternate-train decision card; and retry/fallback behavior, all within the same booking route.

**Manual changes after:** None recorded.

---

## Stage: Payment status

### Prompt 1

**Given to Codex:**

> In Stage 3 — Payment Status, create a three-step tracker: Payment Received → Verifying Seat → Ticket Issued. Include pending, active, and done states. Add a delayed-bank-response branch, keyed to one generated Order_ID, with a "Check Bank Status" action instead of "Pay Again." Include a visible demo control so judges can trigger the delayed state.

**What Codex generated:** A live three-stage payment tracker with soft active-state animation, generated session Order ID, a randomized delayed-bank branch, a demo trigger, and idempotent status checking. A pending bank response never displays a second payment action; repeated checks show a timestamp and count until mock confirmation resumes the flow.

**Manual changes after:** None recorded.

---

## Stage: Confirmed + PDF ticket

### Prompt 1

**Given to Codex:**

> See first when downloading ticket, make it pdf. Create a sperate file for PDF code. Sections, top to bottom: dark disclaimer strip; TatkalEase brand row with E-ticket / mock data and PNR; dashed divider; From → To route; Train/Date/Class cards; passenger table; and Order ID plus status pill.

**What Codex generated:** A separate `src/lib/mockTicketPdf.ts` module using jsPDF, then connected the Confirmed-screen download button to it. The client-side PDF uses mock-only ticket content, the generated PNR, the same Order ID used during payment checks, route details, passenger seats, and a confirmed status pill.

**Manual changes after:** Replaced the earlier plain-text mock-ticket export with the styled PDF export requested in this prompt.

---

## Notes

- Codex produced approximately 95% of the current source code. Manual input focused on product direction, detailed interaction requirements, copy, and visual acceptance criteria; no direct manual source edits were recorded in this build conversation.
- The design system (cream background, charcoal structural text, lime primary actions, orange status labels, Manrope/DM Mono typography, and rounded bordered cards) was specified up front and reused across the landing page, booking flow, and PDF ticket.
- TatkalEase uses mock data only and is clearly labeled throughout as an independent hackathon prototype, not affiliated with IRCTC or Indian Railways.
