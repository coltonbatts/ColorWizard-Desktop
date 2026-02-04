# CB Markdown Organizer - Hand-off Summary

## Project Overview

Built a Tauri desktop app called "CB" — a markdown file organizer with a terminal/cyberpunk aesthetic.

## What Was Built

### Core Features

- **Markdown file organizer** — Browse, view, edit, create, and delete markdown files
- **File management** — Import existing files, create new ones, select folders
- **Markdown rendering** — Uses react-markdown with GitHub Flavored Markdown support
- **Dark mode** — Terminal-style dark theme (locked in)
- **Splash screen** — Shows "CB" on white background for 1.5 seconds
- **App icon** — White background with black "CB" text (all sizes generated)

### UI Features

- Sidebar file browser with file list
- Markdown viewer/editor with edit mode toggle
- Refresh button to reload file list
- Error display banner
- Status messages
- Terminal-style UI elements (prompts, brackets, ASCII separators)

## Design System (Locked In)

### Color Scheme - Sea Green Terminal

- **Primary**: `#6B9A8A` (muted sea green)
- **Accent**: `#7AB8A8` (brighter sea green for text)
- **Light**: `#8AC8B8` (light sea green for secondary text)
- **Dark BG**: `#1a2e28` (dark green-tinted background for panels)
- **Background**: Pure black (`#000000`)

### Typography

- **Font**: JetBrains Mono (loaded from Google Fonts)
- **Fallback stack**: SF Mono, Monaco, Inconsolata, Fira Code, etc.
- **Style**: Monospace throughout for terminal aesthetic

### Terminal Aesthetic Elements

- `>` prompt indicators
- `[COMMAND]` style buttons
- ASCII separators (`─`)
- Tree-style file info (`└─`)
- Terminal-style status indicators
- Subtle borders (no heavy glow effects)

## Technical Stack

### Frontend

- React + TypeScript
- Vite for dev server
- Tailwind CSS for styling
- react-markdown + remark-gfm for markdown rendering
- Tauri v2 for desktop app

### Backend (Rust)

Custom Tauri commands for file operations:

- `get_default_markdown_dir` - Gets default Documents/CB Markdown folder
- `pick_folder` - Folder picker dialog
- `pick_markdown_file` - File picker for importing
- `list_markdown_files` - Lists .md files in directory
- `read_markdown_file` - Reads file content
- `write_markdown_file` - Writes/creates files
- `delete_markdown_file` - Deletes files

## File Structure

```
app/
├── src/
│   ├── App.tsx              # Main app component
│   ├── SplashScreen.tsx     # Splash screen component
│   ├── main.tsx             # Entry point
│   └── styles.css           # Global styles
├── src-tauri/
│   ├── src/
│   │   └── lib.rs           # Rust backend with file operations
│   ├── icons/               # App icons (CB branding)
│   └── tauri.conf.json      # Tauri config
├── index.html               # HTML entry (includes JetBrains Mono font)
└── tailwind.config.js       # Tailwind config (mono font set to JetBrains Mono)
```

## Key Files

### `app/src/App.tsx`
- Main application component
- Handles file operations, dark mode toggle, markdown rendering
- Terminal-style UI with sea green color scheme

### `app/src-tauri/src/lib.rs`
- Rust backend with all file system operations
- Uses rfd for file dialogs
- Handles markdown file CRUD operations

### `app/src/styles.css`
- Global styles
- Terminal cursor animation
- Markdown prose styles

## Running the App

### Development Mode (with visibility)

```bash
cd app
npm run desktop:dev:verbose
```

This shows:
- Port conflict checks
- Dependency verification
- Step-by-step build progress
- Real-time output

### Standard Dev Mode

```bash
cd app
npm run desktop:dev
```

### Other Commands

- `npm run desktop:dev:monitor` - Monitor build process in separate terminal
- `npm run desktop:build` - Production build

## Default Behavior

- **Default folder**: `~/Documents/CB Markdown` (auto-created)
- **Splash screen**: Shows for 1.5 seconds on startup
- **Welcome file**: Creates "Welcome.md" if folder is empty
- **Dark mode**: Persists preference in localStorage

## Build Visibility Tools

Created scripts for better build process visibility:

- `scripts/dev-verbose.sh` - Verbose dev mode with checks
- `scripts/monitor-build.sh` - Real-time build monitor
- `scripts/dev-with-output.sh` - Output logging version

See `app/BUILD_VISIBILITY.md` for details.

## Current State

✅ Fully functional markdown organizer  
✅ Sea green terminal theme (locked in)  
✅ JetBrains Mono font (locked in)  
✅ All file operations working  
✅ Markdown rendering with proper styling  
✅ Dark mode with terminal aesthetic  
✅ Hot reload working perfectly  
✅ Icons generated and working  
✅ Build visibility tools created  

## Notes

- **Colors are locked in** — sea green terminal theme
- **Font is locked in** — JetBrains Mono
- The app hot-reloads instantly for frontend changes
- Rust backend only recompiles when .rs files change
- All markdown files are stored in user-selected folder (default: `~/Documents/CB Markdown`)

## Next Steps (if needed)

- Add search/filter functionality
- Add file tags/categories
- Add markdown preview improvements
- Add keyboard shortcuts
- Add file organization features (folders, etc.)

---

**The app is production-ready and fully functional!**
