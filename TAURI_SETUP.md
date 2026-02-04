# 🚀 Tauri Deep Dive Setup

Complete guide to your new Tauri development environment with boilerplates, plugins, and best practices.

## 📁 What's Been Created

### 1. **tauri-boilerplate/** - Production-Ready Template
A complete, production-ready Tauri app template with:
- ✅ React 18 + TypeScript
- ✅ Tailwind CSS + shadcn/ui ready
- ✅ Type-safe commands with Tauri Specta
- ✅ ESLint + Prettier configured
- ✅ Hot reload development
- ✅ Splash screen support
- ✅ Comprehensive documentation

### 2. **tauri-plugins/** - Shared Plugin System
Reusable plugins for common functionality:
- ✅ **storage/** - Persistent key-value storage
- ✅ **utils/** - Common utility functions (UUID, timestamps, validation)

## 🎯 Quick Start

### Create Your First App

```bash
# Option 1: Use the boilerplate directly
cd tauri-boilerplate
npm install
npm run dev

# Option 2: Create a new app from boilerplate
cd tauri-boilerplate
chmod +x scripts/new-app.sh
./scripts/new-app.sh my-awesome-app
cd ../my-awesome-app
npm install
npm run dev
```

### Use Shared Plugins

```bash
# Copy a plugin to your app
cp -r tauri-plugins/storage my-app/src-tauri/src/plugins/storage

# Add to Cargo.toml
# [dependencies]
# storage-plugin = { path = "src/plugins/storage" }

# Register in main.rs
use storage_plugin::*;
```

## 📚 Documentation

### Boilerplate Docs
- **README.md** - Quick start and overview
- **DEVELOPMENT.md** - Complete development guide
- **BEST_PRACTICES.md** - Production best practices

### Plugin Docs
Each plugin has its own README:
- `tauri-plugins/storage/README.md`
- `tauri-plugins/utils/README.md`

## 🛠️ Available Scripts

### Boilerplate Scripts

```bash
# Development
npm run dev              # Start Vite dev server
npm run tauri:dev        # Run Tauri in dev mode

# Building
npm run build            # Build frontend
npm run tauri:build      # Build Tauri app

# Code Quality
npm run lint             # Run ESLint
npm run format           # Format with Prettier
npm run type-check       # TypeScript type checking

# Utilities
./scripts/setup.sh       # Initial setup
./scripts/new-app.sh <name>  # Create new app
./scripts/generate-types.sh  # Generate TypeScript types
```

## 🎨 Features

### Type-Safe Commands

Commands are automatically typed with Specta:

```rust
// Rust
#[command]
#[specta::specta]
pub fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}
```

```typescript
// TypeScript - types auto-generated!
import { invoke } from '@tauri-apps/api/core';
const result = await invoke('greet', { name: 'World' });
```

### Modern UI Stack

- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Ready to install beautiful components
- **React 18** - Latest React features
- **TypeScript** - Full type safety

### Development Experience

- **Hot Reload** - Instant feedback
- **Web Inspector** - Debug like a web app
- **Type Generation** - Auto-generated TypeScript types
- **Error Handling** - Proper error propagation

## 🔌 Using Plugins

### Storage Plugin Example

```typescript
import { invoke } from '@tauri-apps/api/core';

// Save user preference
await invoke('storage_set', { 
  key: 'theme', 
  value: 'dark' 
});

// Retrieve preference
const theme = await invoke('storage_get', { key: 'theme' });

// List all keys
const keys = await invoke('storage_list');
```

### Utils Plugin Example

```typescript
// Generate UUID
const id = await invoke('generate_uuid');

// Get timestamp
const timestamp = await invoke('get_timestamp_ms');

// Validate email
const isValid = await invoke('validate_email', { 
  email: 'user@example.com' 
});
```

## 🏗️ Project Structure

```
.
├── tauri-boilerplate/          # Production template
│   ├── src/                    # Frontend React app
│   ├── src-tauri/              # Rust backend
│   ├── scripts/                # Development scripts
│   └── docs/                   # Documentation
│
├── tauri-plugins/              # Shared plugins
│   ├── storage/                # Storage plugin
│   ├── utils/                  # Utils plugin
│   └── README.md               # Plugin docs
│
└── TAURI_SETUP.md              # This file
```

## 🚀 Next Steps

### 1. Customize Your App

```bash
# Update app info
# Edit src-tauri/tauri.conf.json:
# - productName
# - identifier
# - windows title

# Add your icon
# Place in src-tauri/icons/icon.png
# Run: npm run tauri icon
```

### 2. Add Commands

```bash
# Create new command file
touch src-tauri/src/commands/my_feature.rs

# Follow examples in:
# - src-tauri/src/commands/example.rs
# - DEVELOPMENT.md
```

### 3. Install UI Components

```bash
# Install shadcn/ui CLI
npm install -g shadcn-ui

# Add components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
```

### 4. Add More Plugins

```bash
# Copy from shared plugins
cp -r tauri-plugins/storage my-app/src-tauri/src/plugins/

# Or create your own!
mkdir -p my-app/src-tauri/src/plugins/my-plugin
```

## 📖 Learning Resources

### Official Docs
- [Tauri v2 Docs](https://v2.tauri.app/)
- [Tauri Specta](https://github.com/oscartbeaumont/tauri-specta)
- [Awesome Tauri](https://github.com/tauri-apps/awesome-tauri)

### Examples
- Check `tauri-boilerplate/src-tauri/src/commands/example.rs`
- See plugin examples in `tauri-plugins/`

### Community
- [Tauri Discord](https://discord.gg/tauri)
- [GitHub Discussions](https://github.com/tauri-apps/tauri/discussions)

## 🎓 Best Practices

1. **Always validate input in Rust** - Never trust frontend
2. **Use type-safe commands** - Leverage Specta
3. **Minimize IPC calls** - Batch operations
4. **Handle errors properly** - Use Result<T, String>
5. **Test thoroughly** - Unit and integration tests
6. **Follow security guidelines** - See BEST_PRACTICES.md

## 🔧 Troubleshooting

### Build Issues

```bash
# Clean and rebuild
cd src-tauri
cargo clean
cargo build

# Update dependencies
cargo update
npm update
```

### Port Conflicts

Change port in `vite.config.ts`:
```typescript
server: { port: 1421 } // Change from 1420
```

### Type Generation

```bash
# Generate types manually
cd src-tauri
cargo build --features specta
```

## 🎉 You're Ready!

You now have:
- ✅ A production-ready boilerplate
- ✅ Shared plugin system
- ✅ Type-safe development setup
- ✅ Comprehensive documentation
- ✅ Best practices guide

Start building amazing Tauri apps! 🚀

## 💡 Pro Tips

1. **Use the boilerplate** - Don't start from scratch
2. **Reuse plugins** - Build a library of shared functionality
3. **Generate types** - Always use Specta for type safety
4. **Follow patterns** - Check examples in boilerplate
5. **Read docs** - DEVELOPMENT.md and BEST_PRACTICES.md are your friends

Happy coding! 🎊
