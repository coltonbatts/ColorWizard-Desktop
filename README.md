# ColorWizard Desktop

ColorWizard Desktop is a local-first color workflow tool built as an offline desktop app.

No account is required. No subscription is required. Your files stay on your machine.

## Principles

- Offline-first: the app works without a network connection.
- Ownership: projects are plain folders on your disk.
- Calm scope: no cloud sync, no telemetry, no analytics, no remote API dependency.

## What v1 does

- Create a local project folder.
- Import a reference image and view it.
- Pan and zoom the image.
- Sample color under cursor and inspect RGB + HEX.
- Save swatches in `project.json`.

## What v1 does not do

- Accounts, auth, or collaboration.
- Cloud sync or SaaS backend features.
- Payments in app.
- AI-assisted palette generation.

## Project Storage

Default root: `Documents/ColorWizard` (changeable in app).

Each project is:

- `project.json`
- `reference/` (copied source image)
- `exports/` (reserved for later)

## App Commands

From `app/`:

- `pnpm dev` runs the frontend.
- `npm run desktop:dev` launches Tauri desktop dev mode.
- `npm run desktop:build` builds the desktop app.

## Licensing

One-time purchase licensing will be handled at distribution time (for example via Gumroad, itch.io, direct license key, or app store tooling). No Stripe or payment SDK is included in this app.
