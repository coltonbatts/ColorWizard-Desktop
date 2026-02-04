# Storage Plugin

A simple persistent key-value storage plugin for Tauri apps.

## Features

- ✅ Persistent storage across app restarts
- ✅ JSON serialization
- ✅ Type-safe with Specta
- ✅ Automatic directory management
- ✅ List and clear operations

## Usage

### Add to Cargo.toml

```toml
[dependencies]
storage-plugin = { path = "../tauri-plugins/storage" }
```

### Register in main.rs

```rust
use storage_plugin::*;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            storage_get,
            storage_set,
            storage_delete,
            storage_list,
            storage_clear,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

### Use in TypeScript

```typescript
import { invoke } from '@tauri-apps/api/core';

// Set a value
await invoke('storage_set', { key: 'theme', value: 'dark' });

// Get a value
const theme = await invoke('storage_get', { key: 'theme' });

// Delete a value
await invoke('storage_delete', { key: 'theme' });

// List all keys
const keys = await invoke('storage_list');

// Clear all storage
await invoke('storage_clear');
```

## Storage Location

Storage files are saved in the app's data directory:
- **macOS**: `~/Library/Application Support/com.yourapp/storage/`
- **Windows**: `%APPDATA%\com.yourapp\storage\`
- **Linux**: `~/.local/share/com.yourapp/storage/`

## File Format

Each key is stored as a JSON file:

```json
{
  "value": "your value here",
  "timestamp": 1234567890
}
```
