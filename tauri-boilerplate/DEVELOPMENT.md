# Development Guide

## Getting Started

### Prerequisites

- **Node.js** 18+ and npm/pnpm/yarn
- **Rust** (latest stable) - Install from [rustup.rs](https://rustup.rs/)
- **System dependencies**:
  - **macOS**: Xcode Command Line Tools
  - **Linux**: `libwebkit2gtk-4.0-dev`, `build-essential`, `curl`, `wget`, `libssl-dev`, `libgtk-3-dev`, `libayatana-appindicator3-dev`, `librsvg2-dev`
  - **Windows**: Visual Studio C++ Build Tools

### Initial Setup

```bash
# Clone or copy the boilerplate
cp -r tauri-boilerplate my-app
cd my-app

# Run setup script
chmod +x scripts/setup.sh
./scripts/setup.sh

# Or manually:
npm install
cd src-tauri && cargo build && cd ..
```

## Development Workflow

### Running in Development

```bash
npm run dev
# or
npm run tauri:dev
```

This will:
1. Start the Vite dev server on `http://127.0.0.1:1420`
2. Launch the Tauri app with hot reload
3. Watch for changes in both frontend and Rust code

### Building for Production

```bash
npm run build
npm run tauri:build
```

Outputs will be in `src-tauri/target/release/`:
- **macOS**: `.app` bundle
- **Windows**: `.exe` installer
- **Linux**: `.AppImage`, `.deb`, or `.rpm`

## Project Structure

```
├── src/                    # Frontend React app
│   ├── components/         # React components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities
│   │   └── tauri-commands.ts  # Auto-generated types
│   ├── types/              # TypeScript type definitions
│   ├── App.tsx            # Main app component
│   └── main.tsx           # Entry point
├── src-tauri/              # Rust backend
│   ├── src/
│   │   ├── commands/       # Tauri commands
│   │   │   ├── mod.rs      # Command module exports
│   │   │   └── example.rs  # Example commands
│   │   ├── lib.rs          # Library entry
│   │   └── main.rs         # Main entry
│   ├── Cargo.toml          # Rust dependencies
│   └── tauri.conf.json     # Tauri configuration
└── public/                 # Static assets
```

## Adding Commands

### 1. Create a new command file

```rust
// src-tauri/src/commands/my_feature.rs
use serde::{Deserialize, Serialize};
use specta::Type;
use tauri::command;

#[derive(Debug, Serialize, Deserialize, Type)]
pub struct MyData {
    pub field: String,
}

#[command]
#[specta::specta]
pub fn my_command(param: String) -> Result<MyData, String> {
    Ok(MyData {
        field: format!("Hello, {}", param),
    })
}
```

### 2. Export in mod.rs

```rust
// src-tauri/src/commands/mod.rs
pub mod my_feature;
pub use my_feature::*;
```

### 3. Register in main.rs

```rust
// src-tauri/src/main.rs
use commands::*;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            greet,
            get_app_info,
            my_command,  // Add here
        ])
        // ...
}
```

### 4. Use in TypeScript

```typescript
import { invoke } from '@tauri-apps/api/core';

const result = await invoke('my_command', { param: 'world' });
```

## Type Safety with Specta

This boilerplate uses [Tauri Specta](https://github.com/oscartbeaumont/tauri-specta) for type-safe commands.

### Generating Types

```bash
# Build with specta feature
cd src-tauri
cargo build --features specta

# Types will be generated in src/lib/tauri-commands.ts
```

### Using Generated Types

```typescript
import type { GreetParams, GreetResult } from '@/lib/tauri-commands';

async function greet(name: string) {
  const result: GreetResult = await invoke<GreetResult>('greet', { name });
  return result;
}
```

## Adding Plugins

### Using Shared Plugins

```bash
# Copy plugin to your app
cp -r ../tauri-plugins/storage src-tauri/src/plugins/

# Add to Cargo.toml
# [dependencies]
# storage-plugin = { path = "src/plugins/storage" }

# Register in main.rs
use storage_plugin::*;
```

### Installing Official Plugins

```bash
# Using Tauri CLI
npm run tauri add dialog
npm run tauri add fs
npm run tauri add shell

# Or manually add to Cargo.toml
```

## Debugging

### Web Inspector

Right-click in the app window → "Inspect" or:
- **macOS**: `Cmd + Option + I`
- **Windows/Linux**: `Ctrl + Shift + I`

### Rust Debugging

```bash
# Build with debug symbols
cd src-tauri
cargo build

# Run with debugger (VS Code)
# Use Rust Analyzer extension
```

### Logging

```rust
// In Rust
use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            // Enable logging
            #[cfg(debug_assertions)]
            {
                let window = app.get_webview_window("main").unwrap();
                window.open_devtools();
            }
            Ok(())
        })
        // ...
}
```

## Best Practices

### 1. Error Handling

Always return `Result<T, String>` from commands:

```rust
#[command]
fn my_command() -> Result<String, String> {
    // Use ? operator for early returns
    let data = read_file().map_err(|e| e.to_string())?;
    Ok(data)
}
```

### 2. Async Commands

Use `async` for I/O operations:

```rust
#[command]
async fn async_command() -> Result<String, String> {
    tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
    Ok("Done".to_string())
}
```

### 3. State Management

Use Tauri's state for shared data:

```rust
use std::sync::Mutex;

struct AppState {
    counter: Mutex<u32>,
}

#[command]
fn increment_counter(state: tauri::State<AppState>) -> Result<u32, String> {
    let mut counter = state.counter.lock().unwrap();
    *counter += 1;
    Ok(*counter)
}
```

### 4. Security

- Always validate input in Rust commands
- Use CSP in `tauri.conf.json`
- Limit file system access with capabilities
- Never trust frontend data

## Performance Tips

1. **Minimize IPC calls** - Batch operations when possible
2. **Use async commands** - For I/O-bound operations
3. **Optimize builds** - Use release mode for production
4. **Bundle size** - Tree-shake unused dependencies
5. **Lazy load** - Code-split large components

## Troubleshooting

### Build Issues

```bash
# Clean build
cd src-tauri
cargo clean
cargo build

# Update dependencies
cargo update
```

### Port Already in Use

Change port in `vite.config.ts`:
```typescript
server: {
  port: 1421, // Change from 1420
}
```

### Type Generation Fails

Ensure Specta is properly configured:
```toml
[dependencies]
specta = { version = "2.0.0", features = ["tauri"] }
```

## Resources

- [Tauri Documentation](https://v2.tauri.app/)
- [Tauri Specta](https://github.com/oscartbeaumont/tauri-specta)
- [Awesome Tauri](https://github.com/tauri-apps/awesome-tauri)
- [Tauri Discord](https://discord.gg/tauri)
