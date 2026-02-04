# 🔗 Integration Guide - Making This Part of Your Workflow

## 🎯 Three Ways to Use This

### Option 1: Workspace Root (Current Setup) ✅

Everything lives together in your project:

```
Colorwizard Desktop/
├── app/                    # Your ColorWizard app
├── tauri-boilerplate/      # Template
├── tauri-plugins/          # Shared plugins
├── scripts/                # CLI tools
├── my-app-1/               # New apps you create
├── my-app-2/               # More apps...
└── package.json            # Workspace commands
```

**Use it:**
```bash
npm run tauri:new my-app
npm run tauri:dev my-app
```

### Option 2: Shell Aliases (Quick Access)

Add shortcuts to your shell:

```bash
# Load aliases for this session
source scripts/setup-aliases.sh

# Now use anywhere:
tauri-new my-app
tauri-dev my-app
tauri-list
```

**Make permanent:**
Add to `~/.zshrc` or `~/.bashrc`:
```bash
source /path/to/Colorwizard\ Desktop/scripts/setup-aliases.sh
```

### Option 3: Global Installation (Use Anywhere)

Install commands globally:

```bash
./scripts/install-global.sh

# Now use from ANY directory:
cd ~/Documents
tauri-new my-app
tauri-dev my-app
```

## 🚀 Daily Workflow Examples

### Starting a New Project

```bash
# Quick way
npm run tauri:new project-name
cd project-name
npm run dev

# Or with aliases
tauri-new project-name
cd project-name
npm run dev
```

### Working on Multiple Apps

```bash
# List all apps
npm run tauri:list
# or
tauri-list

# Switch between apps
tauri-dev app-1
# ... work on app-1 ...

tauri-dev app-2
# ... work on app-2 ...
```

### Adding Plugins

```bash
# List available plugins
npm run tauri:plugin:list

# Copy to your app
cp -r tauri-plugins/storage my-app/src-tauri/src/plugins/storage

# Add to Cargo.toml and register in main.rs
```

## 📋 Quick Reference

### Create App
```bash
npm run tauri:new <name>
# or
tauri-new <name>
```

### List Apps
```bash
npm run tauri:list
# or
tauri-list
```

### Run Dev
```bash
npm run tauri:dev <name>
# or
tauri-dev <name>
```

### Build
```bash
npm run tauri:build <name>
# or
tauri-build <name>
```

## 🎨 VS Code Integration

### Multi-Root Workspace

Create `.vscode/workspace.code-workspace`:

```json
{
  "folders": [
    { "path": "app", "name": "ColorWizard" },
    { "path": "tauri-boilerplate", "name": "Boilerplate" },
    { "path": "tauri-plugins", "name": "Plugins" }
  ],
  "settings": {
    "rust-analyzer.linkedProjects": [
      "app/src-tauri/Cargo.toml",
      "tauri-boilerplate/src-tauri/Cargo.toml"
    ]
  }
}
```

### Tasks

Add to `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Tauri: New App",
      "type": "shell",
      "command": "npm run tauri:new",
      "args": ["${input:appName}"],
      "problemMatcher": []
    },
    {
      "label": "Tauri: Dev",
      "type": "shell",
      "command": "npm run tauri:dev",
      "args": ["${input:appName}"],
      "problemMatcher": []
    }
  ],
  "inputs": [
    {
      "id": "appName",
      "type": "promptString",
      "description": "App name"
    }
  ]
}
```

## 🔧 Customization

### Custom Templates

Create your own templates:

```bash
# Copy boilerplate
cp -r tauri-boilerplate my-custom-template

# Customize it
# - Add your preferred UI library
# - Configure your standard plugins
# - Set up your coding style

# Update create script to use it
# Edit scripts/create-tauri-app.sh
```

### Custom Plugins

Add to `tauri-plugins/`:

```bash
mkdir -p tauri-plugins/my-plugin/src
# Create Cargo.toml and lib.rs
# Document in README.md
```

## 📊 Project Structure Best Practices

### Recommended Structure

```
workspace/
├── templates/              # Your templates
│   ├── boilerplate/        # Base template
│   └── custom/             # Customized template
├── plugins/                # Shared plugins
│   ├── storage/
│   ├── utils/
│   └── your-plugin/
├── apps/                   # Your apps
│   ├── app-1/
│   ├── app-2/
│   └── app-3/
└── scripts/                # CLI tools
```

## 🎓 Learning Path

1. **Start Simple**
   ```bash
   npm run tauri:new hello-world
   cd hello-world
   npm run dev
   ```

2. **Add a Command**
   - Edit `src-tauri/src/commands/example.rs`
   - Use it in `src/App.tsx`

3. **Add a Plugin**
   - Copy from `tauri-plugins/`
   - Integrate into your app

4. **Customize**
   - Update UI
   - Add features
   - Make it yours

5. **Build**
   ```bash
   npm run build
   npm run tauri:build
   ```

## 💡 Pro Tips

1. **Keep boilerplate updated** - Update once, use everywhere
2. **Document your plugins** - Future you will thank you
3. **Use version control** - Track your templates and plugins
4. **Share with team** - Put in shared repo
5. **Iterate** - Improve templates as you learn

## 🐛 Troubleshooting

### Commands not found
```bash
# Check scripts are executable
chmod +x scripts/*.sh

# Check you're in right directory
pwd
```

### Global install not working
```bash
# Check PATH
echo $PATH | grep ~/.local/bin

# Add manually if needed
export PATH="$HOME/.local/bin:$PATH"
```

### Permission denied
```bash
# Fix permissions
chmod +x scripts/*.sh
chmod +x ~/.local/bin/tauri-*  # if using global install
```

## 🎉 You're All Set!

Now you can:
- ✅ Create apps instantly
- ✅ Reuse plugins
- ✅ Work efficiently
- ✅ Build faster

**Try it now:**
```bash
npm run tauri:new test-app
cd test-app
npm run dev
```

Happy building! 🚀
