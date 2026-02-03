# QA Checklist (v1 hardened)

## Workspace + flow

- Start `npm run desktop:dev` from `app/` and verify app boots with Wi-Fi disabled.
- Create a new project in default root (`Documents/ColorWizard`) and verify layout has: Reference (left), Work Canvas (center), Tools (right).
- Toggle `Side-by-side` on and off; close and reopen app; verify toggle state persists.
- Confirm top status bar shows project name, dirty/saved state, and last saved timestamp.

## Shortcuts + interaction

- Press and hold `Space` while dragging in viewer: image pans; release `Space`: pan stops.
- Scroll over viewer to zoom in/out.
- Use `Cmd/Ctrl + S` to save, `Cmd/Ctrl + O` to open, and `Cmd/Ctrl + N` to create new project.
- Hover over reference image and verify sampled HEX/RGB updates in Tools panel.

## Save/load integrity

- Add two swatches, save, close app, reopen same project.
- Confirm swatches and `referenceImage` persist in `project.json` and files exist under `reference/`.
- Confirm `project.json` includes `schemaVersion` and `lastSavedAt`.
- During save, verify `project.json.tmp` is not left behind after successful save.

## Repair behavior

- Manually break `project.json` (invalid JSON or remove required fields), then open project.
- Verify app does not crash, shows `Project needs repair` banner, and loads safe defaults.
- Save repaired project and verify banner clears on next open.

## Local-only guard

- In dev, execute `fetch('https://example.com')` from DevTools console.
- Verify request is blocked with a local-only warning/error.
- Build production and confirm app still runs (guard remains dev-only).
