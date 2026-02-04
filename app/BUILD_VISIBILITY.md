# Build Process Visibility Guide

## The Problem

When running `npm run desktop:dev`, it's a "black box" - you don't know:
- Is it building?
- Is it stuck?
- Are there errors?
- What stage is it at?

## Solutions

### Option 1: Verbose Dev Mode (Recommended) 🎯

**Use this for maximum visibility:**

```bash
npm run desktop:dev:verbose
```

**What it does:**
- ✅ Checks port conflicts before starting
- ✅ Verifies dependencies are installed
- ✅ Checks Rust toolchain
- ✅ Shows step-by-step progress
- ✅ Displays all build output in real-time
- ✅ Color-coded status messages

**Output shows:**
```
🚀 CB Markdown Organizer - Development Mode
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
▶ Checking port 1420...
✓ Port 1420 is available
▶ Checking npm dependencies...
✓ Dependencies found
▶ Checking Rust toolchain...
✓ Rust toolchain found: cargo 1.xx.x
📋 Build Process Overview:
1. Starting Vite dev server (frontend)
2. Compiling Rust backend
3. Launching Tauri window
```

### Option 2: Monitor in Separate Terminal

**Run the dev server normally, then monitor it:**

Terminal 1:
```bash
npm run desktop:dev
```

Terminal 2:
```bash
npm run desktop:dev:monitor
```

**Monitor shows:**
- ✅ Process status (Vite, Cargo, Tauri)
- ✅ Port status
- ✅ Recent log output
- ✅ Updates every 2 seconds

### Option 3: Standard Dev Mode (Less Verbose)

**For normal development (once everything works):**

```bash
npm run desktop:dev
```

This is the standard Tauri command, but you won't see as much detail.

## Understanding the Build Process

### Stage 1: Vite Dev Server (Frontend)
- **Time:** 1-3 seconds
- **What:** Compiles TypeScript/React
- **Output:** `VITE v5.x.x  ready in xxx ms`
- **Port:** 1420

### Stage 2: Rust Compilation (Backend)
- **First build:** 30-60 seconds
- **Subsequent builds:** 5-10 seconds
- **What:** Compiles Rust code
- **Output:** `Compiling colorwizard_desktop_lib v0.1.0`
- **Look for:** `Finished dev [unoptimized + debuginfo]`

### Stage 3: Tauri Window Launch
- **Time:** 1-2 seconds
- **What:** Opens the app window
- **Output:** Window appears on screen

## Common Issues & Solutions

### Port Already in Use

**Error:**
```
Error: Port 1420 is already in use
```

**Solution:**
```bash
# Kill the process on port 1420
lsof -ti:1420 | xargs kill -9

# Or use the verbose script (auto-fixes this)
npm run desktop:dev:verbose
```

### Rust Not Found

**Error:**
```
error: could not find `cargo` in PATH
```

**Solution:**
```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env
```

### Build Stuck / No Output

**Symptoms:**
- No output for > 60 seconds
- Terminal appears frozen

**Debug:**
1. Check if processes are running:
   ```bash
   ps aux | grep -E "(vite|cargo|tauri)"
   ```

2. Check port:
   ```bash
   lsof -i :1420
   ```

3. Check Rust compilation:
   ```bash
   cd src-tauri
   cargo build --verbose
   ```

4. Kill everything and restart:
   ```bash
   npm run app:kill
   npm run desktop:dev:verbose
   ```

## Quick Reference

| Command | Use Case | Visibility |
|---------|----------|------------|
| `npm run desktop:dev` | Normal dev | Low |
| `npm run desktop:dev:verbose` | First run / debugging | **High** |
| `npm run desktop:dev:monitor` | Monitor running build | Medium |
| `npm run dev:clean` | Clean restart | Low |

## Pro Tips

1. **First time?** Always use `desktop:dev:verbose`
2. **Stuck?** Check the monitor: `npm run desktop:dev:monitor`
3. **Port issues?** The verbose script auto-fixes them
4. **Want logs?** Check `/tmp/cb-tauri-dev.log` (created by verbose mode)

## What Success Looks Like

When everything works, you'll see:

```
✓ Port 1420 is available
✓ Dependencies found
✓ Rust toolchain found

VITE v5.x.x  ready in 500 ms
  ➜  Local:   http://127.0.0.1:1420/
  ➜  Network: use --host to expose

   Compiling colorwizard_desktop_lib v0.1.0
   Finished dev [unoptimized + debuginfo] target(s) in 45.23s

[App] Window opened
```

Then the app window appears! 🎉
