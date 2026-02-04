# Utils Plugin

Common utility functions for Tauri apps.

## Features

- UUID generation
- Timestamp utilities
- Email validation
- Filename sanitization

## Usage

### Add to Cargo.toml

```toml
[dependencies]
utils-plugin = { path = "../tauri-plugins/utils" }
```

### Register in main.rs

```rust
use utils_plugin::*;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            generate_uuid,
            get_timestamp,
            get_timestamp_ms,
            get_timestamp_info,
            validate_email,
            sanitize_filename,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

### Use in TypeScript

```typescript
import { invoke } from '@tauri-apps/api/core';

// Generate UUID
const id = await invoke('generate_uuid');

// Get timestamps
const seconds = await invoke('get_timestamp');
const ms = await invoke('get_timestamp_ms');
const info = await invoke('get_timestamp_info');

// Validate email
const isValid = await invoke('validate_email', { email: 'test@example.com' });

// Sanitize filename
const safe = await invoke('sanitize_filename', { filename: 'test<>file.txt' });
```
