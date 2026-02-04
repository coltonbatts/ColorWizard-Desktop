# 🚀 Tauri Development Workflow

Your complete guide to using the Tauri boilerplate and plugins in your daily workflow.

## Quick Start

### Create a New App (3 ways)

**Option 1: Using npm script (recommended)**
```bash
npm run tauri:new my-awesome-app
cd my-awesome-app
npm run dev
```

**Option 2: Using the CLI directly**
```bash
./scripts/create-tauri-app.sh my-awesome-app
cd my-awesome-app
npm run dev
```

**Option 3: Using the unified CLI**
```bash
./scripts/tauri-cli.sh new my-awesome-app
./scripts/tauri-cli.sh dev my-awesome-app
```

## Daily Workflow

### 1. Starting a New Project

```bash
# Create app
npm run tauri:new project-name

# Navigate and start
cd project-name
npm run dev
```

### 2. Working on Existing Apps

```bash
# List all apps
npm run tauri:list

# Start development
npm run tauri:dev app-name

# Or manually
cd app-name
npm run dev
```

### 3. Building for Production

```bash
# Build specific app
npm run tauri:build app-name

# Or manually
cd app-name
npm run build
npm run tauri:build
```

### 4. Using Plugins

```bash
# List available plugins
npm run tauri:plugin:list

# Copy plugin to your app
cp -r tauri-plugins/storage my-app/src-tauri/src/plugins/storage

# Add to Cargo.toml
# [dependencies]
# storage-plugin = { path = "src/plugins/storage" }

# Register in main.rs
use storage_plugin::*;
```

## Integration with Your Current Project

### Option A: Keep Everything Together

```
Colorwizard Desktop/
├── app/                    # Your current ColorWizard app
├── tauri-boilerplate/     # Template
├── tauri-plugins/         # Shared plugins
├── my-new-app/            # New apps you create
├── another-app/           # More apps...
└── scripts/               # Shared scripts
```

### Option B: Separate Workspace

Create a `tauri-workspace/` directory:

```bash
mkdir tauri-workspace
cd tauri-workspace
# Copy boilerplate and plugins here
# Create all new apps here
```

## Making It Part of Your Routine

### 1. Add to Your Shell Profile

Add aliases to `~/.zshrc` or `~/.bashrc`:

```bash
# Tauri shortcuts
alias tauri-new='npm run tauri:new'
alias tauri-list='npm run tauri:list'
alias tauri-dev='npm run tauri:dev'
alias tauri-build='npm run tauri:build'
```

Then reload:
```bash
source ~/.zshrc  # or source ~/.bashrc
```

Now you can use:
```bash
tauri-new my-app
tauri-dev my-app
```

### 2. Create a Global Script

Make scripts available globally:

```bash
# Create global bin directory
mkdir -p ~/.local/bin

# Symlink scripts
ln -s $(pwd)/scripts/create-tauri-app.sh ~/.local/bin/tauri-new
ln -s $(pwd)/scripts/tauri-cli.sh ~/.local/bin/tauri

# Add to PATH (if not already)
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

Now use anywhere:
```bash
tauri-new my-app
tauri dev my-app
```

### 3. VS Code Workspace

Create `.vscode/workspace.code-workspace`:

```json
{
  "folders": [
    {
      "path": "app",
      "name": "ColorWizard Desktop"
    },
    {
      "path": "tauri-boilerplate",
      "name": "Boilerplate Template"
    },
    {
      "path": "tauri-plugins",
      "name": "Shared Plugins"
    }
  ],
  "settings": {
    "files.exclude": {
      "**/node_modules": true,
      "**/target": true,
      "**/dist": true
    }
  }
}
```

## Testing It Right Now

Let's create a test app to see it in action:

```bash
# 1. Create test app
npm run tauri:new test-app

# 2. Start it
cd test-app
npm run dev

# 3. See it work!
# The app should open with a simple UI
```

## Common Patterns

### Pattern 1: Quick Prototype

```bash
# Create app
tauri-new prototype

# Add a plugin
cp -r tauri-plugins/storage prototype/src-tauri/src/plugins/storage

# Start coding
cd prototype
npm run dev
```

### Pattern 2: Production App

```bash
# Create app
tauri-new production-app

# Customize
cd production-app
# - Update tauri.conf.json
# - Add icon
# - Customize UI

# Build
npm run build
npm run tauri:build
```

### Pattern 3: Plugin Development

```bash
# Create new plugin
mkdir -p tauri-plugins/my-plugin/src
cd tauri-plugins/my-plugin

# Create Cargo.toml and lib.rs
# Test in an app
cd ../../test-app
# Add plugin and test
```

## Tips for Daily Use

1. **Keep boilerplate updated** - Update once, use everywhere
2. **Reuse plugins** - Build a library of shared functionality
3. **Use the CLI** - Faster than manual commands
4. **Create templates** - Customize boilerplate for your needs
5. **Document patterns** - Keep notes on what works

## Troubleshooting

### Scripts not executable
```bash
chmod +x scripts/*.sh
```

### npm script not found
```bash
# Make sure you're in the workspace root
cd /path/to/Colorwizard\ Desktop
npm run tauri:help
```

### App creation fails
```bash
# Check template exists
ls -la tauri-boilerplate/

# Check permissions
chmod +x scripts/create-tauri-app.sh
```

## Next Steps

1. **Try it now**: `npm run tauri:new test-app`
2. **Customize**: Add your own templates
3. **Build plugins**: Create reusable functionality
4. **Share**: Use across projects and teams

Happy building! 🚀
