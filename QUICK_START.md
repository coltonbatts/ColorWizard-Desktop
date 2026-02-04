# ⚡ Quick Start - See It Work Right Now!

## 🎯 Try It in 30 Seconds

```bash
# 1. Create a test app
npm run tauri:new hello-world

# 2. Start it
cd hello-world
npm run dev

# 3. 🎉 Watch it work!
```

That's it! The app will open with a simple UI.

## 🚀 What Just Happened?

1. **Created** a complete Tauri app from the boilerplate
2. **Installed** all dependencies (Node + Rust)
3. **Started** the development server
4. **Opened** the app window

## 📝 Common Commands

### Create New Apps
```bash
npm run tauri:new my-app-name
```

### List All Apps
```bash
npm run tauri:list
```

### Run App in Dev Mode
```bash
npm run tauri:dev app-name
```

### Build for Production
```bash
npm run tauri:build app-name
```

## 🎨 Customize Your New App

After creating an app:

```bash
cd my-app-name

# 1. Update app info
# Edit src-tauri/tauri.conf.json:
#   - productName: "My App"
#   - identifier: "com.you.my-app"

# 2. Add your icon
# Place icon.png in src-tauri/icons/
# Run: npm run tauri icon

# 3. Customize UI
# Edit src/App.tsx

# 4. Add commands
# Edit src-tauri/src/commands/example.rs
```

## 🔌 Add a Plugin

```bash
# Copy plugin
cp -r ../tauri-plugins/storage src-tauri/src/plugins/storage

# Add to Cargo.toml
# [dependencies]
# storage-plugin = { path = "src/plugins/storage" }

# Register in src-tauri/src/main.rs
use storage_plugin::*;
```

## 💡 Pro Tips

1. **Use the CLI** - Faster than manual commands
2. **Reuse plugins** - Copy from `tauri-plugins/`
3. **Check examples** - See `tauri-boilerplate/src-tauri/src/commands/`
4. **Read docs** - Check `WORKFLOW.md` for details

## 🐛 Troubleshooting

### Scripts not working?
```bash
chmod +x scripts/*.sh
```

### Can't find command?
```bash
# Make sure you're in the workspace root
pwd  # Should show: .../Colorwizard Desktop
```

### Build fails?
```bash
# Clean and rebuild
cd my-app-name/src-tauri
cargo clean
cargo build
```

## 🎓 Next Steps

1. ✅ **Try it now** - `npm run tauri:new test-app`
2. 📖 **Read WORKFLOW.md** - Complete workflow guide
3. 🔧 **Customize** - Make it yours
4. 🚀 **Build** - Create something awesome!

---

**Ready?** Run this now:
```bash
npm run tauri:new hello-world && cd hello-world && npm run dev
```
