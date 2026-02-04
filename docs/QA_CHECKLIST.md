# QA Checklist (v1 hardened + reference workflow)

## Workspace + flow

- Start `npm run desktop:dev` from `app/` and verify app boots with Wi-Fi disabled.
- Create a new project in default root (`Documents/ColorWizard`) and verify layout has: Reference (left), Work Canvas (center), Tools (right).
- Toggle `Side-by-side` on and off; close and reopen app; verify toggle state persists.
- Confirm top status bar shows project name, dirty/saved state, and last saved timestamp.

## Reference management

- Import 3 reference images and verify they appear in Reference panel with thumbnails.
- Verify references are ordered (first imported = order 0, etc.).
- Click "Primary" on second reference; verify it's marked as primary and becomes default viewer.
- Click "Rename" on a reference, change label, press Enter; verify label updates and saves.
- Verify file on disk is NOT renamed (check `reference/` folder, filename unchanged).
- Click "Remove" on a reference; verify:
  - Reference removed from list
  - File deleted from `reference/` folder (project-owned copy)
  - Original source file outside project is untouched
- Use Up/Down buttons to reorder references; verify order persists after save/reload.
- Import a v1 project with `referenceImage` field; verify it migrates to `references` array automatically.
- Verify `label` field: if unset, display shows `name` (filename); if set, display shows `label`.

## Compare mode

- Import 2+ references, enable Side-by-side mode.
- Verify dropdowns appear for Left/Right selection.
- Select different references in dropdowns; verify both images display correctly.
- Default: Left = Primary, Right = Current viewer reference.
- Change selections and verify they persist during session.

## Shortcuts + interaction

- Press and hold `Space` while dragging in viewer: image pans; release `Space`: pan stops.
- Scroll over viewer to zoom in/out.
- Use `Cmd/Ctrl + S` to save, `Cmd/Ctrl + O` to open, and `Cmd/Ctrl + N` to create new project.
- Hover over reference image and verify sampled HEX/RGB updates in Tools panel.

## Save/load integrity

- Add two swatches, save, close app, reopen same project.
- Confirm swatches and `references` array persist in `project.json` with correct order.
- Confirm `project.json` includes `schemaVersion` (2), `primaryReferenceId`, and `lastSavedAt`.
- During save, verify `project.json.tmp` is not left behind after successful save.
- Verify no orphan files in `reference/` folder after removing references.

## Repair behavior

- Manually break `project.json` (invalid JSON or remove required fields), then open project.
- Verify app does not crash, shows `Project needs repair` banner, and loads safe defaults.
- Save repaired project and verify banner clears on next open.
- Test v1 → v2 migration: create v1 project.json with `referenceImage`, open it, verify migration note appears.

## Local-only guard

- In dev, execute `fetch('https://example.com')` from DevTools console.
- Verify request is blocked with a local-only warning/error.
- Build production and confirm app still runs (guard remains dev-only).
