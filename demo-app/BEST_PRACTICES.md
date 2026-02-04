# Tauri Best Practices

A collection of best practices for building production-ready Tauri applications.

## Architecture

### 1. Separation of Concerns

- **Frontend**: UI, user interactions, client-side logic
- **Backend (Rust)**: File I/O, system calls, heavy computations, security-sensitive operations
- **IPC**: Type-safe communication between frontend and backend

### 2. Command Organization

Organize commands by feature:

```
src-tauri/src/commands/
├── mod.rs
├── storage.rs      # Storage-related commands
├── files.rs        # File operations
├── system.rs       # System information
└── ui.rs           # UI-related commands
```

### 3. Error Handling

Always use `Result<T, String>` for commands:

```rust
#[command]
fn risky_operation() -> Result<String, String> {
    // Use ? for early returns
    let data = read_file()
        .map_err(|e| format!("Failed to read file: {}", e))?;
    
    process_data(&data)
        .map_err(|e| format!("Processing failed: {}", e))
}
```

## Security

### 1. Input Validation

**Always validate input in Rust**, never trust frontend:

```rust
#[command]
fn save_file(path: String, content: String) -> Result<(), String> {
    // Validate path
    if path.contains("..") {
        return Err("Invalid path".to_string());
    }
    
    // Validate content size
    if content.len() > 10_000_000 {
        return Err("File too large".to_string());
    }
    
    // Safe to proceed
    std::fs::write(path, content)?;
    Ok(())
}
```

### 2. Capabilities

Use capabilities to limit permissions:

```json
{
  "capabilities": {
    "default": {
      "windows": ["main"],
      "permissions": [
        "fs:allow-read-file",
        "fs:allow-write-file"
      ]
    }
  }
}
```

### 3. CSP (Content Security Policy)

Configure CSP in `tauri.conf.json`:

```json
{
  "security": {
    "csp": "default-src 'self'; img-src 'self' asset: https://asset.localhost blob: data:"
  }
}
```

## Performance

### 1. Minimize IPC Calls

**Bad:**
```typescript
// Multiple calls
for (const file of files) {
  await invoke('process_file', { file });
}
```

**Good:**
```typescript
// Single batch call
await invoke('process_files', { files });
```

### 2. Use Async Commands

For I/O operations, use async:

```rust
#[command]
async fn read_large_file(path: String) -> Result<String, String> {
    tokio::fs::read_to_string(path)
        .await
        .map_err(|e| e.to_string())
}
```

### 3. Optimize Builds

```bash
# Production build
cargo build --release

# Optimize binary size
# Add to Cargo.toml:
[profile.release]
opt-level = "z"     # Optimize for size
lto = true          # Link-time optimization
```

## Type Safety

### 1. Use Specta

Generate TypeScript types from Rust:

```rust
use specta::Type;

#[derive(Type)]
pub struct User {
    pub id: u32,
    pub name: String,
}

#[command]
#[specta::specta]
pub fn get_user(id: u32) -> Result<User, String> {
    // ...
}
```

### 2. Type Guards

Validate types at runtime:

```typescript
function isUser(obj: any): obj is User {
  return obj && typeof obj.id === 'number' && typeof obj.name === 'string';
}
```

## State Management

### 1. Tauri State

For shared backend state:

```rust
use std::sync::Mutex;

struct AppState {
    counter: Mutex<u32>,
    data: Mutex<Vec<String>>,
}

#[command]
fn increment(state: tauri::State<AppState>) -> Result<u32, String> {
    let mut counter = state.counter.lock().unwrap();
    *counter += 1;
    Ok(*counter)
}
```

### 2. Frontend State

Use React Context or Zustand:

```typescript
import { create } from 'zustand';

interface AppStore {
  count: number;
  increment: () => void;
}

const useStore = create<AppStore>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
```

## File Operations

### 1. Path Handling

Always use Tauri's path API:

```rust
use tauri::path::BaseDirectory;

#[command]
fn get_config_path(app: tauri::AppHandle) -> Result<String, String> {
    app.path()
        .app_config_dir()
        .map(|p| p.join("config.json").to_string_lossy().to_string())
        .ok_or_else(|| "Failed to get config path".to_string())
}
```

### 2. Safe File Operations

```rust
use std::path::PathBuf;

fn safe_read_file(app: &tauri::AppHandle, user_path: &str) -> Result<String, String> {
    // Resolve to absolute path
    let base = app.path().app_data_dir()
        .map_err(|e| format!("Failed to get base path: {}", e))?;
    
    let full_path = base.join(user_path);
    
    // Ensure path is within base directory
    if !full_path.starts_with(&base) {
        return Err("Path traversal detected".to_string());
    }
    
    std::fs::read_to_string(&full_path)
        .map_err(|e| format!("Failed to read file: {}", e))
}
```

## Testing

### 1. Unit Tests

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_command() {
        let result = my_command("test".to_string());
        assert!(result.is_ok());
    }
}
```

### 2. Integration Tests

```rust
#[cfg(test)]
mod tests {
    use tauri::test;

    #[test]
    fn test_invoke() {
        let app = test::mock_app();
        let result = app.handle().invoke("greet", "world".into());
        assert_eq!(result, "Hello, world!");
    }
}
```

## Logging

### 1. Structured Logging

```rust
use log::{info, warn, error};

#[command]
fn process_data(data: String) -> Result<(), String> {
    info!("Processing data: {} bytes", data.len());
    
    if data.is_empty() {
        warn!("Empty data received");
        return Err("Empty data".to_string());
    }
    
    // Process...
    info!("Data processed successfully");
    Ok(())
}
```

### 2. Frontend Logging

```typescript
// Use console for development
if (import.meta.env.DEV) {
  console.log('Debug info:', data);
}

// Send to Rust for production logging
await invoke('log', { level: 'info', message: 'User action' });
```

## Code Organization

### 1. Frontend Structure

```
src/
├── components/        # Reusable components
│   ├── ui/           # Base UI components
│   └── features/     # Feature-specific components
├── hooks/            # Custom React hooks
├── lib/              # Utilities and helpers
├── types/            # TypeScript types
└── App.tsx          # Main app
```

### 2. Backend Structure

```
src-tauri/src/
├── commands/         # Tauri commands
├── models/           # Data models
├── utils/            # Utility functions
├── error.rs          # Error types
└── main.rs           # Entry point
```

## Distribution

### 1. Code Signing

**macOS:**
```bash
# Set in tauri.conf.json
"bundle": {
  "macOS": {
    "signingIdentity": "Developer ID Application: Your Name"
  }
}
```

**Windows:**
```bash
# Use signtool.exe
signtool sign /f certificate.pfx /p password app.exe
```

### 2. Auto-Updates

Use CrabNebula Cloud or self-hosted:

```rust
use tauri_plugin_updater::UpdaterBuilder;

tauri::Builder::default()
    .plugin(
        UpdaterBuilder::new()
            .endpoints(vec!["https://your-update-server.com"])
            .build()
    )
```

## Common Pitfalls

### 1. Blocking the Main Thread

**Bad:**
```rust
#[command]
fn blocking_operation() -> String {
    std::thread::sleep(std::time::Duration::from_secs(5));
    "Done".to_string()
}
```

**Good:**
```rust
#[command]
async fn async_operation() -> String {
    tokio::time::sleep(tokio::time::Duration::from_secs(5)).await;
    "Done".to_string()
}
```

### 2. Memory Leaks

Always clean up resources:

```rust
use std::sync::Arc;

struct Resource {
    // ...
}

impl Drop for Resource {
    fn drop(&mut self) {
        // Cleanup
    }
}
```

### 3. Race Conditions

Use proper synchronization:

```rust
use std::sync::{Arc, Mutex};

let data = Arc::new(Mutex::new(Vec::new()));

// Clone Arc for each thread
let data_clone = Arc::clone(&data);
tokio::spawn(async move {
    let mut vec = data_clone.lock().unwrap();
    vec.push(1);
});
```

## Resources

- [Tauri Security](https://v2.tauri.app/develop/security/)
- [Rust Book](https://doc.rust-lang.org/book/)
- [React Best Practices](https://react.dev/learn)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
