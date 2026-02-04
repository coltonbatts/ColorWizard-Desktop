# Quick Fixes Reference - Common Tauri Issues

Quick reference for fixing common Tauri app issues.

## 🔧 Port Conflicts

**Error**: `Port 1420 is already in use`

**Fix**: Add auto port detection to `vite.config.ts`:
```typescript
function findFreePort(startPort = 1420, maxAttempts = 20) {
  for (let i = 0; i < maxAttempts; i++) {
    const port = startPort + i
    try {
      execSync(`lsof -Pi :${port} -sTCP:LISTEN -t`, { stdio: 'ignore' })
    } catch {
      return port
    }
  }
  return startPort
}

server: {
  host: '127.0.0.1',
  port: findFreePort(),
  strictPort: false,
}
```

---

## 🔧 Missing Icons

**Error**: `failed to open icon .../icons/32x32.png: No such file or directory`

**Fix**: 
1. Copy icons from another app: `cp -r app/src-tauri/icons new-app/src-tauri/`
2. Or remove icon requirement from `tauri.conf.json` bundle section

---

## 🔧 Invalid Plugin Config

**Error**: `unknown field 'all', expected 'open'`

**Fix**: Remove `"all": false` from plugin config:
```json
// ❌ Wrong
"plugins": {
  "shell": {
    "all": false,
    "open": true
  }
}

// ✅ Correct
"plugins": {
  "shell": {
    "open": true
  }
}
```

---

## 🔧 JSON Trailing Comma

**Error**: `failed to parse JSON: trailing comma at line X`

**Fix**: Remove trailing comma:
```json
// ❌ Wrong
{
  "permissions": [
    "core:default",
    "shell:allow-open",  // <- trailing comma
  ]
}

// ✅ Correct
{
  "permissions": [
    "core:default",
    "shell:allow-open"
  ]
}
```

---

## 🔧 Host Binding Mismatch

**Error**: `Waiting for your frontend dev server to start...` (never connects)

**Fix**: Add explicit host to Vite config:
```typescript
server: {
  host: '127.0.0.1',  // Explicit IPv4
  port: 1420,
}
```

---

## 🔧 Stuck Splash Screen

**Problem**: Splash screen never closes

**Fix**: Add setup handler in `main.rs`:
```rust
.setup(|app| {
    let splashscreen_window = app.get_webview_window("splashscreen");
    let main_window = app.get_webview_window("main");
    
    if let Some(window) = main_window {
        window.show().unwrap();
        if let Some(splash) = splashscreen_window {
            splash.close().unwrap();
        }
    }
    Ok(())
})
```

And in `tauri.conf.json`:
```json
{
  "label": "splashscreen",
  "visible": false  // Hide by default
}
```

---

## 🔧 Specta Version Issues

**Error**: `failed to select a version for 'specta'`

**Fix**: Either:
1. Remove Specta (for simple apps): Remove from `Cargo.toml`
2. Use correct version: `specta = { version = "2.0.0-rc.22" }`

---

## 🔧 Build Fails Silently

**Check**:
1. `cargo build` directly - see actual errors
2. Check `tauri.conf.json` syntax
3. Verify all required files exist
4. Check capabilities JSON is valid

---

## 🚀 Prevention Checklist

Before creating new app:
- [ ] Use updated boilerplate (has all fixes)
- [ ] Check port availability
- [ ] Validate JSON files
- [ ] Test plugin configs
- [ ] Verify icons exist

---

**See `DEMO_APP_CREATION_LOG.md` for full details!**
