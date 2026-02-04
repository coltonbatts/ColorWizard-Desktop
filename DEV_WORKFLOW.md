# Development Workflow

## The Standard Way (Recommended) 🚀

**Use Tauri's dev mode** - this is how Tauri developers work:

```bash
cd app && npm run desktop:dev
```

**What happens:**
- ✅ Vite dev server starts (hot reload for React/TypeScript)
- ✅ Rust compiles once, then watches for changes
- ✅ App window opens automatically
- ✅ **Frontend changes reload instantly** (no rebuild needed!)
- ✅ Rust changes auto-restart the app
- ✅ **No Finder windows, no focus stealing**
- ✅ Stays in your terminal/Cursor

**To stop:** Press `Ctrl+C` in terminal

**This is the normal Tauri workflow** - you edit code, save, see changes instantly.

---

## The "Offline" Way (For Testing Production Builds)

If you specifically need to test the production build (no dev server):

```bash
cd app && npm run app:restart
```

**What happens:**
- Kills app
- Full rebuild (~15-20 seconds)
- Installs to project folder
- Launches app (now quieter - won't open Finder)

**Use this when:**
- Testing production builds
- Verifying the final .app bundle
- Before distributing

---

## Which Should You Use?

**99% of the time:** Use `npm run desktop:dev`

**Only use `app:restart` when:**
- You need to test the actual production build
- You're preparing for distribution
- You want to verify the offline workflow

---

## Pro Tips

1. **Keep dev mode running** - Just leave `npm run desktop:dev` running in a terminal
2. **Edit code** - Frontend changes appear instantly
3. **Rust changes** - Auto-restart when you save Rust files
4. **No interruptions** - Everything stays in Cursor/terminal

The dev mode workflow is smooth and standard - that's why Tauri provides it!
