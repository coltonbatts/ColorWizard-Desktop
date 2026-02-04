# Tauri Shared Plugins

A collection of reusable Tauri plugins for use across multiple apps.

## Structure

```
tauri-plugins/
├── storage/          # Persistent storage plugin
├── utils/            # Utility functions plugin
├── window/           # Window management plugin
└── README.md         # This file
```

## Usage

### Option 1: Copy plugin into your app

```bash
# Copy the plugin directory
cp -r tauri-plugins/storage my-app/src-tauri/src/plugins/storage

# Add to your Cargo.toml
# [dependencies]
# storage-plugin = { path = "src/plugins/storage" }
```

### Option 2: Use as git submodule

```bash
git submodule add <repo-url> tauri-plugins
```

### Option 3: Publish as crates (recommended for team)

Each plugin can be published as a separate crate on crates.io.

## Available Plugins

### Storage Plugin

Persistent key-value storage with JSON serialization.

**Features:**
- Get/set/delete values
- Type-safe with serde
- Automatic JSON serialization
- Scoped storage (per-app)

**Example:**
```rust
use storage_plugin::*;

#[command]
fn save_preference(key: String, value: String) -> Result<(), String> {
    storage_set(key, value)?;
    Ok(())
}
```

### Utils Plugin

Common utility functions used across apps.

**Features:**
- UUID generation
- Timestamp utilities
- String helpers
- Validation functions

### Window Plugin

Enhanced window management.

**Features:**
- Window positioning
- Window state persistence
- Multi-monitor support
- Window grouping

## Creating a New Plugin

1. Create a new directory in `tauri-plugins/`
2. Add a `Cargo.toml` with plugin dependencies
3. Implement commands in `src/lib.rs`
4. Add documentation in `README.md`
5. Export commands in your main app

Example structure:

```
my-plugin/
├── Cargo.toml
├── README.md
└── src/
    └── lib.rs
```

## Best Practices

1. **Keep plugins focused** - One plugin, one responsibility
2. **Use Specta** - For type-safe TypeScript generation
3. **Document everything** - Include examples in README
4. **Version carefully** - Use semantic versioning
5. **Test thoroughly** - Add tests for each command
