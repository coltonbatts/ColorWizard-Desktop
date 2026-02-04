# Quick Restart Guide

## Recommended: Use Dev Mode (Smooth Workflow)

**For normal development, use Tauri's dev mode:**

```bash
cd app && npm run desktop:dev
```

**Benefits:**
- ✅ Hot reload - changes appear instantly
- ✅ No Finder windows opening
- ✅ Stays in Cursor/terminal
- ✅ Standard Tauri workflow
- ✅ Much faster iteration

**Just leave this running** and edit code - changes reload automatically!

---

## Alternative: Production Build Restart

**Only use this when testing production builds:**

```bash
cd app && npm run app:restart
```

This will:
1. ✅ Kill the running app (if it's running)
2. ✅ Build the latest code
3. ✅ Install to project folder
4. ✅ Launch the app (now quieter - won't open Finder)

## All Available Commands

- `npm run app:restart` - **Kill + rebuild + launch** (use this!)
- `npm run app:build` - Just build (no install/launch)
- `npm run app:install` - Build + install + launch (fails if app is running)
- `npm run app:open` - Just open the installed app

## Pro Tips

1. **Keep a terminal open** in the `app/` directory
2. **Use tab completion**: Type `npm run app:` then press Tab
3. **Create an alias** (optional):
   ```bash
   alias cw="cd ~/Desktop/Colorwizard\ Desktop/app && npm run app:restart"
   ```
   Then just type `cw` from anywhere!

4. **Keyboard shortcut** (optional): Set up a macOS Automator Quick Action to run the script

## What Happens

The restart script:
- Kills any running ColorWizard processes
- Waits 0.5s for clean shutdown
- Builds TypeScript + Vite frontend
- Compiles Rust backend
- Bundles the .app
- Copies to project root
- Removes quarantine attributes
- Launches the app

**Total time: ~15-20 seconds** (mostly Rust compilation)
