# 🚀 Tauri Development Setup - Complete Guide

**Everything you need to build Tauri apps efficiently, right here in your workspace.**

## ⚡ Quick Start (30 seconds)

```bash
# Create a new app
npm run tauri:new hello-world

# Start it
cd hello-world
npm run dev

# 🎉 Done! App is running
```

## 📁 What's Included

### 1. **tauri-boilerplate/** - Production Template
Complete, ready-to-use Tauri app template with:
- React 18 + TypeScript
- Tailwind CSS + shadcn/ui ready
- Type-safe commands (Specta)
- Hot reload
- Splash screen
- Full documentation

### 2. **tauri-plugins/** - Shared Plugins
Reusable plugins:
- **storage/** - Persistent key-value storage
- **utils/** - UUID, timestamps, validation

### 3. **scripts/** - CLI Tools
- `create-tauri-app.sh` - Create new apps
- `tauri-cli.sh` - Unified command interface
- `setup-aliases.sh` - Shell shortcuts
- `install-global.sh` - Global installation

## 🎯 How to Use

### Method 1: npm Scripts (Easiest)

```bash
# Create app
npm run tauri:new my-app

# List apps
npm run tauri:list

# Run dev
npm run tauri:dev my-app

# Build
npm run tauri:build my-app
```

### Method 2: Direct Scripts

```bash
# Create app
./scripts/create-tauri-app.sh my-app

# Unified CLI
./scripts/tauri-cli.sh new my-app
./scripts/tauri-cli.sh dev my-app
./scripts/tauri-cli.sh list
```

### Method 3: Shell Aliases (Recommended)

```bash
# Load aliases
source scripts/setup-aliases.sh

# Now use shortcuts:
tauri-new my-app
tauri-dev my-app
tauri-list
```

### Method 4: Global Installation

```bash
# Install globally (use from anywhere)
./scripts/install-global.sh

# Now use from any directory:
cd ~/Documents
tauri-new my-app
```

## 📚 Documentation

| File | Purpose |
|------|---------|
| **QUICK_START.md** | 30-second quick start |
| **WORKFLOW.md** | Daily workflow guide |
| **INTEGRATION_GUIDE.md** | Making it part of your routine |
| **TAURI_SETUP.md** | Complete setup overview |
| **DEVELOPMENT.md** | Development guide (in boilerplate) |
| **BEST_PRACTICES.md** | Production best practices (in boilerplate) |
| **QUICK_REFERENCE.md** | Command cheat sheet |

## 🎨 Example Workflow

### Create and Run an App

```bash
# 1. Create
npm run tauri:new todo-app

# 2. Navigate
cd todo-app

# 3. Customize (optional)
# - Edit src-tauri/tauri.conf.json
# - Edit src/App.tsx
# - Add icon to src-tauri/icons/

# 4. Run
npm run dev
```

### Add a Plugin

```bash
# Copy plugin
cp -r ../tauri-plugins/storage src-tauri/src/plugins/storage

# Add to Cargo.toml:
# [dependencies]
# storage-plugin = { path = "src/plugins/storage" }

# Register in src-tauri/src/main.rs:
use storage_plugin::*;

# Use in TypeScript:
import { invoke } from '@tauri-apps/api/core';
await invoke('storage_set', { key: 'theme', value: 'dark' });
```

## 🔧 Available Commands

### Workspace Commands (from root)

```bash
npm run tauri:new <name>        # Create new app
npm run tauri:list              # List all apps
npm run tauri:dev <name>        # Run app in dev
npm run tauri:build <name>      # Build app
npm run tauri:plugin:list        # List plugins
npm run tauri:help              # Show help
```

### App Commands (inside app directory)

```bash
npm run dev              # Start Vite dev server
npm run tauri:dev        # Run Tauri dev mode
npm run build            # Build frontend
npm run tauri:build      # Build Tauri app
npm run lint             # Run ESLint
npm run format           # Format code
```

## 🎓 Learning Path

1. **Try it now** → `npm run tauri:new test-app && cd test-app && npm run dev`
2. **Read QUICK_START.md** → Understand basics
3. **Follow WORKFLOW.md** → Daily workflow
4. **Check examples** → `tauri-boilerplate/src-tauri/src/commands/`
5. **Build something** → Create your first real app

## 💡 Pro Tips

1. **Use aliases** - `source scripts/setup-aliases.sh` for shortcuts
2. **Reuse plugins** - Copy from `tauri-plugins/`
3. **Keep updated** - Update boilerplate once, use everywhere
4. **Document** - Add READMEs to your plugins
5. **Version control** - Track templates and plugins

## 🐛 Troubleshooting

### Scripts not working?
```bash
chmod +x scripts/*.sh
```

### Can't find command?
```bash
# Make sure you're in workspace root
pwd  # Should show: .../Colorwizard Desktop
```

### Build fails?
```bash
cd my-app/src-tauri
cargo clean
cargo build
```

## 🎉 You're Ready!

**Try it right now:**
```bash
npm run tauri:new hello-world
cd hello-world
npm run dev
```

## 📖 Next Steps

1. ✅ **Try it** - Create a test app
2. 📖 **Read docs** - Check QUICK_START.md
3. 🔧 **Customize** - Make it yours
4. 🚀 **Build** - Create something awesome!

---

**Questions?** Check the docs:
- Quick start: `QUICK_START.md`
- Workflow: `WORKFLOW.md`
- Integration: `INTEGRATION_GUIDE.md`

Happy building! 🚀
