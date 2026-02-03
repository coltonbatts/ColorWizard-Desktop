# Decision: ColorWizard Desktop Pivot (2026-02)

We are explicitly moving from Firebase/Stripe/SaaS infrastructure to an offline-owned desktop product.

## Why

1. Reliability: color workflows must not depend on network availability.
2. Ownership: users should keep projects as local files they can inspect and back up.
3. Focus: SaaS infrastructure (auth, billing, cloud state) created complexity not needed for the core tool.
4. Sustainability: a small desktop codebase is easier to maintain long-term than a cloud stack.

## Resulting Direction

- Tauri desktop app with local filesystem project storage.
- No Firebase, Stripe, auth, analytics, or telemetry in v1.
- Project format is folder-based (`project.json` + assets) for portability.
