# Tauri Production Boilerplate

A production-ready Tauri template with React, TypeScript, Tailwind CSS, and best practices.

## Features

- ✅ **React 18** with TypeScript
- ✅ **Tailwind CSS** for styling
- ✅ **shadcn/ui** components (ready to install)
- ✅ **Type-safe commands** with Tauri Specta
- ✅ **Hot reload** development
- ✅ **ESLint + Prettier** configured
- ✅ **Path aliases** (`@/` for `src/`)
- ✅ **Production build** optimized
- ✅ **Splash screen** support
- ✅ **Auto-update** ready
- ✅ **Cross-platform** (Windows, macOS, Linux)

## Quick Start

```bash
# Create new app from this template
cp -r tauri-boilerplate my-new-app
cd my-new-app

# Install dependencies
npm install
cd src-tauri && cargo build && cd ..

# Run in development
npm run dev

# Build for production
npm run build
```

## Project Structure

```
tauri-boilerplate/
├── src/                    # Frontend React app
│   ├── components/         # React components
│   ├── lib/                # Utilities and helpers
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript types
│   └── App.tsx            # Main app component
├── src-tauri/              # Rust backend
│   ├── src/
│   │   ├── commands/       # Tauri commands
│   │   ├── lib.rs          # Library entry point
│   │   └── main.rs         # Main entry point
│   ├── Cargo.toml          # Rust dependencies
│   └── tauri.conf.json     # Tauri configuration
├── public/                 # Static assets
└── package.json            # Node dependencies
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run tauri dev` - Run Tauri in dev mode
- `npm run tauri build` - Build Tauri app
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Adding shadcn/ui Components

```bash
# Install shadcn/ui CLI (if not already installed)
npm install -g shadcn-ui

# Add a component
npx shadcn-ui@latest add button
```

## Type-Safe Commands

This boilerplate uses Tauri Specta for type-safe commands. Commands are defined in `src-tauri/src/commands/` and automatically generate TypeScript types.

See `src-tauri/src/commands/example.rs` for an example.

## Customization

1. Update `tauri.conf.json` with your app name and identifier
2. Replace icons in `src-tauri/icons/`
3. Customize `src/App.tsx` with your UI
4. Add commands in `src-tauri/src/commands/`

## Next Steps

- [ ] Add your app icon
- [ ] Customize app name and identifier
- [ ] Add your first Tauri command
- [ ] Install shadcn/ui components
- [ ] Set up auto-updates (optional)
- [ ] Configure code signing (for distribution)
