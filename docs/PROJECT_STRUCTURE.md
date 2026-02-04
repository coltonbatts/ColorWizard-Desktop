# ColorWizard Desktop - Complete Project Structure

## Overview

This is a Tauri desktop application workspace containing multiple projects, boilerplates, and development tools. The main application is the **CB Markdown Organizer** located in the `app/` directory.

## Root Directory Structure

```
Colorwizard Desktop/
├── .gitignore                    # Git ignore rules
├── .DS_Store                     # macOS system file
├── package.json                  # Root workspace package.json
│
├── app/                          # 🎯 MAIN APPLICATION (CB Markdown Organizer)
├── demo-app/                     # Demo/test Tauri app
├── tauri-boilerplate/            # Reusable Tauri app template
├── tauri-plugins/                # Custom Tauri plugins
├── projects/                     # Project data storage
├── scripts/                      # Development utility scripts
├── docs/                         # Documentation
├── DECISIONS/                    # Architecture decision records
│
├── ColorWizard Desktop.app/      # Built macOS application bundle
│
└── [Documentation Files]         # Various .md files (see below)
```

---

## 📁 Main Application: `app/`

The **CB Markdown Organizer** - A terminal-style markdown file organizer.

### Frontend Structure (`app/src/`)

```
app/src/
├── App.tsx                       # Main React component
├── SplashScreen.tsx              # Splash screen component (1.5s display)
├── main.tsx                      # React entry point
├── styles.css                    # Global styles + terminal cursor animation
├── vite-env.d.ts                 # Vite type definitions
│
└── lib/
    └── core/
        ├── networkGuard.ts       # Network-related utilities
        └── project.ts            # Project management logic
```

### Backend Structure (`app/src-tauri/`)

```
app/src-tauri/
├── Cargo.toml                    # Rust dependencies & project config
├── Cargo.lock                    # Locked dependency versions
├── build.rs                      # Rust build script
├── tauri.conf.json               # Tauri configuration
│
├── src/
│   ├── main.rs                   # Rust entry point
│   └── lib.rs                    # Main Rust code with Tauri commands:
│                                 #   - get_default_markdown_dir
│                                 #   - pick_folder
│                                 #   - pick_markdown_file
│                                 #   - list_markdown_files
│                                 #   - read_markdown_file
│                                 #   - write_markdown_file
│                                 #   - delete_markdown_file
│
├── capabilities/
│   └── default.json              # Tauri permissions/capabilities
│
└── icons/                        # App icons (CB branding)
    ├── icon.png                  # Main icon
    ├── icon.icns                 # macOS icon bundle
    ├── icon.ico                  # Windows icon
    ├── 32x32.png                 # Small icon
    ├── 128x128.png               # Medium icon
    ├── 128x128@2x.png            # Retina medium icon
    └── [Various Square logos]    # Store/Windows Store icons
```

### Configuration Files (`app/`)

```
app/
├── package.json                  # Node dependencies & npm scripts
├── package-lock.json             # Locked npm versions
├── index.html                    # HTML entry point (includes JetBrains Mono font)
├── vite.config.ts                # Vite configuration
├── tailwind.config.js            # Tailwind CSS config (JetBrains Mono font)
├── postcss.config.js             # PostCSS configuration
├── tsconfig.json                 # TypeScript config for app
├── tsconfig.node.json            # TypeScript config for Node scripts
└── BUILD_VISIBILITY.md           # Build process documentation
```

### Development Scripts (`app/scripts/`)

```
app/scripts/
├── dev-verbose.sh                # Verbose dev mode with checks
├── dev-with-output.sh            # Dev mode with output logging
├── monitor-build.sh              # Real-time build monitor
├── generate-cb-icon.py           # Python script to generate CB icons
├── generate-icon.js              # JavaScript icon generator
├── install-app.sh                # Install built app
├── kill-app.sh                   # Kill running app instance
└── restart-app.sh                # Restart app script
```

---

## 📁 Demo App: `demo-app/`

A demo/test Tauri application for experimentation.

```
demo-app/
├── package.json                  # Demo app dependencies
├── index.html                    # HTML entry
├── vite.config.ts                # Vite config
├── tailwind.config.js            # Tailwind config
├── tsconfig.json                 # TypeScript config
│
├── src/
│   ├── App.tsx                   # Demo app component
│   ├── main.tsx                  # Entry point
│   ├── styles.css                # Styles
│   ├── vite-env.d.ts            # Vite types
│   │
│   └── lib/
│       ├── tauri-commands.ts     # Tauri command wrappers
│       └── utils.ts              # Utility functions
│
├── src-tauri/
│   ├── Cargo.toml                # Rust dependencies
│   ├── tauri.conf.json           # Tauri config
│   ├── build.rs                  # Build script
│   │
│   ├── src/
│   │   ├── main.rs               # Entry point
│   │   ├── lib.rs                # Main Rust code
│   │   │
│   │   └── commands/
│   │       ├── mod.rs            # Command module
│   │       └── example.rs        # Example Tauri commands
│   │
│   ├── capabilities/
│   │   └── default.json          # Permissions
│   │
│   ├── gen/                      # Generated Tauri types
│   │   └── schemas/
│   │       ├── acl-manifests.json
│   │       ├── capabilities.json
│   │       ├── desktop-schema.json
│   │       └── macOS-schema.json
│   │
│   └── icons/                    # Demo app icons
│
├── public/
│   └── splashscreen.html         # Splash screen HTML
│
├── scripts/
│   ├── generate-types.sh         # Generate TypeScript types
│   ├── new-app.sh                # Create new app script
│   └── setup.sh                  # Setup script
│
├── .vscode/
│   └── extensions.json           # Recommended VS Code extensions
│
├── .eslintrc.cjs                 # ESLint config
├── .prettierrc.json              # Prettier config
├── BEST_PRACTICES.md             # Development best practices
├── DEVELOPMENT.md                # Development guide
└── README.md                     # Demo app documentation
```

---

## 📁 Tauri Boilerplate: `tauri-boilerplate/`

Reusable template for creating new Tauri applications.

```
tauri-boilerplate/
├── package.json                  # Template dependencies
├── index.html                    # HTML template
├── vite.config.ts                # Vite config template
├── tailwind.config.js            # Tailwind template
├── tsconfig.json                 # TypeScript template
│
├── src/
│   ├── App.tsx                   # Template app component
│   ├── main.tsx                  # Entry point template
│   ├── styles.css                # Base styles
│   ├── vite-env.d.ts            # Vite types
│   │
│   └── lib/
│       ├── tauri-commands.ts     # Command wrapper template
│       └── utils.ts              # Utility template
│
├── src-tauri/
│   ├── Cargo.toml                # Rust template
│   ├── tauri.conf.json           # Tauri config template
│   ├── build.rs                  # Build script template
│   │
│   ├── src/
│   │   ├── main.rs               # Entry point template
│   │   ├── lib.rs                # Main Rust template
│   │   │
│   │   └── commands/
│   │       ├── mod.rs            # Command module template
│   │       └── example.rs        # Example commands template
│   │
│   └── capabilities/
│       └── default.json          # Permissions template
│
├── public/
│   └── splashscreen.html         # Splash screen template
│
├── scripts/
│   ├── generate-types.sh         # Type generation script
│   ├── new-app.sh                # Create new app from template
│   └── setup.sh                  # Setup script
│
├── .vscode/
│   └── extensions.json           # VS Code extensions
│
├── .eslintrc.cjs                 # ESLint config
├── .prettierrc.json              # Prettier config
├── BEST_PRACTICES.md             # Best practices guide
├── DEVELOPMENT.md                # Development guide
└── README.md                     # Boilerplate documentation
```

---

## 📁 Tauri Plugins: `tauri-plugins/`

Custom Tauri plugins for shared functionality.

```
tauri-plugins/
├── README.md                     # Plugins documentation
│
├── storage/                      # Storage plugin
│   ├── Cargo.toml                # Plugin dependencies
│   ├── README.md                 # Storage plugin docs
│   └── src/
│       └── lib.rs                # Storage plugin implementation
│
└── utils/                        # Utils plugin
    ├── Cargo.toml                # Plugin dependencies
    ├── README.md                 # Utils plugin docs
    └── src/
        └── lib.rs                # Utils plugin implementation
```

---

## 📁 Projects: `projects/`

Storage directory for project data.

```
projects/
├── dev-1770162310838/
│   └── project.json              # Project metadata
│
├── dev-1770162386858/
│   ├── project.json              # Project metadata
│   └── reference/
│       └── reference-1770162397542.png  # Reference image
│
└── dev-1770162427762/
    └── project.json              # Project metadata
```

---

## 📁 Scripts: `scripts/`

Root-level development utility scripts.

```
scripts/
├── create-tauri-app.sh           # Create new Tauri app
├── find-free-port.sh              # Find available port
├── install-global.sh              # Install global dependencies
├── setup-aliases.sh               # Setup shell aliases
└── tauri-cli.sh                   # Tauri CLI wrapper
```

---

## 📁 Documentation: `docs/`

Project documentation.

```
docs/
├── CB_HANDOFF_SUMMARY.md         # CB app hand-off documentation
├── FILE_FORMAT.md                # File format specifications
├── OFFLINE_DEV_WORKFLOW.md       # Offline development guide
└── QA_CHECKLIST.md               # Quality assurance checklist
```

---

## 📁 Decisions: `DECISIONS/`

Architecture Decision Records (ADRs).

```
DECISIONS/
└── 2026-02-colorwizard-desktop-pivot.md  # Pivot decision record
```

---

## 📁 Built Application: `ColorWizard Desktop.app/`

macOS application bundle (built output).

```
ColorWizard Desktop.app/
└── Contents/
    ├── Info.plist                # App metadata
    ├── MacOS/
    │   └── colorwizard_desktop    # Compiled binary
    └── Resources/
        └── icon.icns              # App icon
```

---

## 📄 Root Documentation Files

Various markdown documentation files at the root:

```
├── AGENT_WORKFLOW.md             # Agent workflow guide
├── DEBUG_IMAGE_LOADING.md        # Image loading debugging guide
├── DEMO_APP_CREATION_LOG.md      # Demo app creation log
├── DEV_WORKFLOW.md               # Development workflow
├── INTEGRATION_GUIDE.md          # Integration guide
├── PHILOSOPHY.md                 # Project philosophy
├── PORT_MANAGEMENT.md            # Port management guide
├── QUICK_FIXES_REFERENCE.md      # Quick fixes reference
├── QUICK_REFERENCE.md            # Quick reference guide
├── QUICK_RESTART.md              # Quick restart guide
├── QUICK_START.md                # Quick start guide
├── README.md                     # Main README
├── README_TAURI_SETUP.md         # Tauri setup guide
├── SOLUTION_SUMMARY.md           # Solution summary
├── TAURI_SETUP.md                # Tauri setup documentation
├── TESTING_GUIDE.md              # Testing guide
├── TRY_IT_NOW.md                 # Try it now guide
├── V1_SCOPE.md                   # Version 1 scope
└── WORKFLOW.md                   # Workflow documentation
```

---

## Key Technologies

### Frontend Stack
- **React** + **TypeScript** - UI framework
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Styling
- **react-markdown** + **remark-gfm** - Markdown rendering

### Backend Stack
- **Rust** - System programming
- **Tauri v2** - Desktop app framework
- **rfd** - File dialogs

### Development Tools
- **npm** - Package management
- **Cargo** - Rust package management
- **TypeScript** - Type safety
- **ESLint** + **Prettier** - Code quality

---

## Main Application Entry Points

### Frontend Entry
- **`app/src/main.tsx`** → **`app/src/App.tsx`**

### Backend Entry
- **`app/src-tauri/src/main.rs`** → **`app/src-tauri/src/lib.rs`**

### Build Entry
- **`app/index.html`** → Loads React app via Vite

---

## Development Commands

### Main App (`app/`)
```bash
cd app
npm run desktop:dev              # Standard dev mode
npm run desktop:dev:verbose      # Verbose dev mode
npm run desktop:dev:monitor      # Monitor build process
npm run desktop:build            # Production build
```

### Root Workspace
```bash
npm run tauri:new                # Create new Tauri app
npm run tauri:list               # List Tauri apps
npm run tauri:dev                # Dev mode
npm run tauri:build              # Build
```

---

## Project Purpose Summary

1. **`app/`** - Production CB Markdown Organizer application
2. **`demo-app/`** - Testing/experimentation app
3. **`tauri-boilerplate/`** - Template for creating new apps
4. **`tauri-plugins/`** - Shared Tauri plugins
5. **`projects/`** - Data storage for projects
6. **`scripts/`** - Development utilities
7. **`docs/`** - Documentation
8. **`DECISIONS/`** - Architecture decisions

---

## Notes

- The main application is **CB Markdown Organizer** in `app/`
- Default markdown folder: `~/Documents/CB Markdown`
- Uses sea green terminal theme with JetBrains Mono font
- Hot reload enabled for frontend changes
- Rust backend recompiles only when `.rs` files change
