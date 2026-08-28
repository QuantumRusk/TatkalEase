# TatkalEase

TatkalEase is an independent hackathon prototype that reimagines a calmer, safer Tatkal-style train-ticket booking experience. It is designed to demonstrate early preparation, clear availability updates, and safe payment-status recovery using mock data only.

**Independent Hackathon Prototype - not affiliated with IRCTC or Indian Railways.** No real train data, passenger identity data, payment gateway, OTP, Aadhaar service, PNR, or ticketing system is used.

## Live demo

[Check it out here](https://tatkal-ease.vercel.app/)

## Highlights

- Mobile-first landing page with an original TatkalEase visual identity.
- Logged-in demo dashboard with profile details, live device time, notifications, and editable saved route.
- Four-stage booking flow on one route: Prepare, Track, Payment, and Confirmed.
- Mock next-day booking form with up to four passengers and berth preferences.
- Pre-authorization countdown that remains visible on the dashboard.
- Timed availability activity log, alternate-train choice, and cancellation path.
- Payment tracker with a mock Order ID and safe "Check Bank Status" recovery path. The flow never asks a user to pay again while payment is pending.
- Mock ticket confirmation, downloadable PDF ticket, and device-local booking history.

## Booking flow

1. Open the landing page and choose **Open your dashboard**.
2. From the dashboard, choose **Start a booking**.
3. Fill in the mock journey details and select **Pre-authorize & Prepare Booking**.
4. Return to the dashboard while the 20-second demo countdown runs.
5. When booking opens, select **Fast check availability** to continue to the live availability check.
6. Continue through seat confirmation and the mock payment status.
7. Download the mock PDF ticket after confirmation, or choose **Book another**.

The demo-mode controls can immediately open the booking window or trigger a delayed bank response for demonstrations.

## Local data and privacy

TatkalEase does not use a backend or cloud database. It stores only mock prototype data in the current browser's `localStorage`:

- Saved route
- Active pre-authorized booking
- Confirmed mock-ticket history

This data persists only on the same browser and device. A different browser, device, incognito session, or cloned deployment starts with its own empty local data.

### Clear local demo data

Open browser DevTools on the app, select **Console**, and run one of these commands:

```js
localStorage.removeItem("tatkalease-booking-history");
```

```js
localStorage.removeItem("tatkalease-preauthorized-booking");
localStorage.removeItem("tatkalease-saved-route");
```

Alternatively, clear this site's storage through your browser's site-data settings. Refresh the page afterwards.

## Run locally

### Requirements

- Node.js 20.9 or later
- npm 10 or later, or pnpm 9 or later

### Installation

```bash
git clone <your-repository-url>
cd TatkalEase
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in a browser.

The project also includes a `pnpm-lock.yaml`, so the equivalent pnpm commands are:

```bash
pnpm install
pnpm dev
```

### Production build

```bash
npm run build
npm start
```

## Deploy

The app is a standard Next.js App Router project. For Vercel or Netlify:

1. Push the current branch and commits to GitHub.
2. Import the repository in the deployment provider.
3. Use the repository root as the Root Directory. Do not set it to `src` or `src/app`.
4. Select Next.js as the framework preset, or let it be detected automatically.
5. Leave the output directory unset and deploy.

## Project structure

```text
src/app/                 Next.js routes: landing page, dashboard, booking flow
src/lib/                 Mock PDF ticket, saved-route, pre-authorization, and history helpers
public/                  Static assets
CODEX_PROMPTS.md         Representative Codex build log for the hackathon
```

## Technology

- Next.js and React
- TypeScript
- Browser `localStorage` for mock local state
- jsPDF for the downloadable mock ticket

