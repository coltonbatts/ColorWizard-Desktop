# Tauri Quick Reference

Quick commands and snippets for Tauri development.

## 🚀 Creating New Apps

```bash
# From boilerplate
cd tauri-boilerplate
./scripts/new-app.sh my-app
cd ../my-app && npm install && npm run dev

# Or use create-tauri-app
npm create tauri-app@latest
```

## 📝 Common Commands

### Development
```bash
npm run dev              # Vite dev server
npm run tauri:dev        # Tauri dev mode
npm run build            # Build frontend
npm run tauri:build      # Build app
```

### Code Quality
```bash
npm run lint             # ESLint
npm run format           # Prettier
npm run type-check       # TypeScript
```

## 🔌 Adding Plugins

### Official Plugins
```bash
npm run tauri add dialog
npm run tauri add fs
npm run tauri add shell
npm run tauri add http
```

### Shared Plugins
```bash
# Copy plugin
cp -r tauri-plugins/storage src-tauri/src/plugins/

# Add to Cargo.toml
# storage-plugin = { path = "src/plugins/storage" }

# Register in main.rs
use storage_plugin::*;
```

## 💻 Rust Command Template

```rust
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

## 📱 TypeScript Usage

```typescript
import { invoke } from '@tauri-apps/api/core';

// Call command
const result = await invoke('my_command', { param: 'world' });

// With error handling
try {
  const result = await invoke<string>('my_command', { param: 'world' });
  console.log(result);
} catch (error) {
  console.error('Command failed:', error);
}
```

## 🎨 UI Components (shadcn/ui)

```bash
# Install CLI
npm install -g shadcn-ui

# Add components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add input
```

## 🔧 Configuration Files

### tauri.conf.json
```json
{
  "productName": "My App",
  "identifier": "com.example.app",
  "app": {
    "windows": [{
      "title": "My App",
      "width": 1200,
      "height": 800
    }]
  }
}
```

### Cargo.toml
```toml
[dependencies]
tauri = { version = "2.10.0", features = ["protocol-asset"] }
specta = { version = "2.0.0", features = ["tauri"] }
```

## 🐛 Debugging

### Web Inspector
- **macOS**: `Cmd + Option + I`
- **Windows/Linux**: `Ctrl + Shift + I`
- Or: Right-click → Inspect

### Rust Logging
```rust
use log::{info, warn, error};

info!("Info message");
warn!("Warning message");
error!("Error message");
```

## 📦 Building

### Development Build
```bash
npm run tauri:dev
```

### Production Build
```bash
npm run build
npm run tauri:build
```

Outputs:
- **macOS**: `.app` in `src-tauri/target/release/bundle/macos/`
- **Windows**: `.exe` in `src-tauri/target/release/bundle/msi/`
- **Linux**: `.AppImage` in `src-tauri/target/release/bundle/appimage/`

## 🔐 Security Checklist

- [ ] Validate all input in Rust commands
- [ ] Use capabilities to limit permissions
- [ ] Configure CSP in tauri.conf.json
- [ ] Never trust frontend data
- [ ] Use secure file paths (app data dir)
- [ ] Sanitize file paths (prevent traversal)

## 📚 File Paths

### App Directories
```rust
// App data directory
app.path().app_data_dir()

// App config directory
app.path().app_config_dir()

// App cache directory
app.path().app_cache_dir()

// Desktop directory
app.path().desktop_dir()
```

## 🎯 Common Patterns

### State Management
```rust
use std::sync::Mutex;

struct AppState {
    data: Mutex<Vec<String>>,
}

#[command]
fn get_data(state: tauri::State<AppState>) -> Result<Vec<String>, String> {
    Ok(state.data.lock().unwrap().clone())
}
```

### Async Commands
```rust
#[command]
async fn async_operation() -> Result<String, String> {
    tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
    Ok("Done".to_string())
}
```

### File Operations
```rust
use std::fs;

#[command]
fn read_file(path: String) -> Result<String, String> {
    fs::read_to_string(path)
        .map_err(|e| format!("Failed to read file: {}", e))
}
```

## 🔗 Useful Links

- [Tauri Docs](https://v2.tauri.app/)
- [Tauri Specta](https://github.com/oscartbeaumont/tauri-specta)
- [Awesome Tauri](https://github.com/tauri-apps/awesome-tauri)
- [Tauri Discord](https://discord.gg/tauri)

## 💡 Tips

1. **Use Specta** - Auto-generate TypeScript types
2. **Batch IPC calls** - Minimize round trips
3. **Validate in Rust** - Never trust frontend
4. **Use async** - For I/O operations
5. **Handle errors** - Always return Result<T, String>
