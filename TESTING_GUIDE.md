# ColorWizard Desktop - Testing Guide

## Quick Start

### Running the App

```bash
cd app
npm run desktop:dev
```

**What happens:**
1. Vite dev server starts on `http://127.0.0.1:1420`
2. Rust code compiles (first time takes 2-5 minutes)
3. Tauri window opens automatically
4. Hot reload enabled for React/TypeScript changes

### Stopping the App

Press `Ctrl+C` in the terminal, or close the app window.

## Testing Workflow

### 1. Initial Setup Test

**Goal:** Verify app launches and basic UI loads

- [ ] App window opens (1440x900 default)
- [ ] Title bar shows "ColorWizard Desktop"
- [ ] Three-column layout visible:
  - Left: Reference panel
  - Center: Work Canvas
  - Right: Tools panel
- [ ] Status bar shows "No project open"

### 2. Project Creation Test

**Goal:** Create and save a project

- [ ] Click "Choose root" → select a folder (e.g., `Documents/ColorWizard`)
- [ ] Enter project name (e.g., "Test Project")
- [ ] Click "New"
- [ ] Verify status shows "Created project at..."
- [ ] Check `Documents/ColorWizard/Test Project/` folder exists
- [ ] Verify `project.json` exists with `schemaVersion: 2`

### 3. Reference Import Test

**Goal:** Import and manage reference images

- [ ] Click "Import reference"
- [ ] Select an image file (PNG, JPG, etc.)
- [ ] Verify reference appears in left panel with thumbnail
- [ ] Verify image displays in center viewer
- [ ] Import 2-3 more references
- [ ] Verify all appear in list, sorted by order

### 4. Reference Management Test

**Goal:** Test rename, primary, remove, reorder

**Rename (Label-only):**
- [ ] Click "Rename" on a reference
- [ ] Change label to "My Custom Label"
- [ ] Press Enter
- [ ] Verify label updates in UI
- [ ] Check `reference/` folder → filename unchanged
- [ ] Check `project.json` → `label` field set, `path` unchanged

**Set Primary:**
- [ ] Click "Primary" on second reference
- [ ] Verify it's marked with accent border
- [ ] Verify it becomes default viewer
- [ ] Check `project.json` → `primaryReferenceId` matches

**Remove:**
- [ ] Note filename in `reference/` folder
- [ ] Click "Remove" on a reference
- [ ] Verify reference removed from list
- [ ] Check `reference/` folder → file deleted
- [ ] Verify original source file outside project untouched

**Reorder:**
- [ ] Use Up/Down buttons to reorder references
- [ ] Verify order changes in UI
- [ ] Save project (Cmd/Ctrl+S)
- [ ] Close and reopen project
- [ ] Verify order persists

### 5. Color Sampling Test

**Goal:** Test pan, zoom, and color sampling

- [ ] Hover over reference image
- [ ] Verify HEX/RGB updates in Tools panel
- [ ] Hold Space + drag → image pans
- [ ] Release Space → pan stops
- [ ] Scroll over viewer → zoom changes (0.2x - 8x)
- [ ] Verify sampling still accurate after pan/zoom

### 6. Swatches Test

**Goal:** Add, view, and remove swatches

- [ ] Hover over a color in reference image
- [ ] Click "Add swatch"
- [ ] Verify swatch appears in Tools panel
- [ ] Verify color matches sampled color
- [ ] Add 2-3 more swatches
- [ ] Click "Remove" on a swatch
- [ ] Verify it's removed

### 7. Side-by-Side Compare Test

**Goal:** Test compare mode with multiple references

- [ ] Import 2+ references
- [ ] Enable "Side-by-side" checkbox
- [ ] Verify dropdowns appear for Left/Right selection
- [ ] Verify defaults: Left = Primary, Right = Current viewer
- [ ] Change Left dropdown → verify left image updates
- [ ] Change Right dropdown → verify right image updates
- [ ] Disable side-by-side → verify returns to single viewer

### 8. Save/Load Integrity Test

**Goal:** Verify data persistence

- [ ] Create project with:
  - 2+ references (with labels, reordered)
  - Primary reference set
  - 3+ swatches
- [ ] Save (Cmd/Ctrl+S)
- [ ] Close app completely
- [ ] Reopen app
- [ ] Open same project
- [ ] Verify all data persists:
  - References in correct order
  - Labels preserved
  - Primary reference correct
  - Swatches present

### 9. Migration Test

**Goal:** Test v1 → v2 migration

- [ ] Create a v1 project manually:
  ```json
  {
    "schemaVersion": 1,
    "name": "Legacy Project",
    "referenceImage": "reference/test.png",
    "swatches": []
  }
  ```
- [ ] Open project in app
- [ ] Verify migration note appears
- [ ] Verify `referenceImage` converted to `references` array
- [ ] Verify `primaryReferenceId` set
- [ ] Save project
- [ ] Verify `schemaVersion` is now 2

### 10. Crash Safety Test

**Goal:** Test error recovery

**Malformed JSON:**
- [ ] Manually break `project.json` (remove closing brace)
- [ ] Open project
- [ ] Verify app doesn't crash
- [ ] Verify "Project needs repair" banner appears
- [ ] Verify project loads with safe defaults
- [ ] Save project → verify banner clears on next open

**Missing Fields:**
- [ ] Remove `schemaVersion` from `project.json`
- [ ] Open project
- [ ] Verify defaults applied
- [ ] Verify repair notes appear

**Leftover .tmp file:**
- [ ] Create `project.json.tmp` manually
- [ ] Open project
- [ ] Verify `.tmp` file is cleaned up

### 11. Offline Guard Test

**Goal:** Verify network requests are blocked

- [ ] Ensure Wi-Fi is disabled
- [ ] Start app (`npm run desktop:dev`)
- [ ] Open DevTools (right-click → Inspect Element)
- [ ] In Console, run: `fetch('https://example.com')`
- [ ] Verify error: `[local-only] blocked remote request in dev`
- [ ] Verify app functions normally (create/open/save)

### 12. Keyboard Shortcuts Test

**Goal:** Test all keyboard shortcuts

- [ ] **Space**: Hold + drag → pan image
- [ ] **Cmd/Ctrl+S**: Save project
- [ ] **Cmd/Ctrl+O**: Open project dialog
- [ ] **Cmd/Ctrl+N**: Create new project
- [ ] Verify shortcuts work when not in input fields

## Common Issues & Solutions

### App Won't Launch

**Check:**
- Rust toolchain installed: `rustc --version`
- Node modules installed: `cd app && npm install`
- Port 1420 available: `lsof -i :1420`

### Changes Not Reflecting

**React/TypeScript:**
- Should hot reload automatically
- Check browser console for errors
- Try hard refresh (Cmd/Ctrl+R)

**Rust:**
- Wait for compilation to finish
- Check terminal for errors
- Restart dev server if needed

### File Operations Fail

**Check:**
- File permissions on project folder
- Disk space available
- Path doesn't contain special characters

### DevTools Not Opening

**Enable in code:**
- Add to `tauri.conf.json`:
  ```json
  "windows": [{
    "devtools": true
  }]
  ```

## Performance Testing

### Large Images

- [ ] Import 5MB+ image
- [ ] Verify pan/zoom smooth
- [ ] Verify sampling responsive
- [ ] Check memory usage (Activity Monitor)

### Many References

- [ ] Import 10+ references
- [ ] Verify list scrolls smoothly
- [ ] Verify reorder works
- [ ] Check `project.json` size

### Many Swatches

- [ ] Add 50+ swatches
- [ ] Verify list scrolls
- [ ] Verify save/load performance

## Production Build Test

```bash
cd app
npm run desktop:build
```

**Test the built app:**
- [ ] Launch built app (not dev mode)
- [ ] Run all tests above
- [ ] Verify network guard still works (dev-only)
- [ ] Check app size reasonable
- [ ] Test on clean machine if possible

## Automated Testing (Future)

Consider adding:
- Unit tests for project normalization
- Integration tests for file operations
- E2E tests with Playwright/Tauri Test

## Reporting Issues

When reporting bugs, include:
1. Steps to reproduce
2. Expected behavior
3. Actual behavior
4. Terminal output/errors
5. `project.json` (sanitized)
6. OS version
7. App version
