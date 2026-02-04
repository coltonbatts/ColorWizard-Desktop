# Offline App Development Workflow

This document describes how to build, install, and run ColorWizard Desktop as a normal macOS application without using a dev server.

## Quick Start

**One command to update your local app:**

```bash
cd app && npm run app:install
```

This will:
1. Build a release bundle of the app
2. Install it to the project root folder (`ColorWizard Desktop.app` - same folder as `app/`)
3. Remove macOS quarantine attributes
4. Launch the app

## Available Scripts

### `npm run app:build`
Builds a release bundle of the app. The `.app` bundle will be created in `app/src-tauri/target/release/bundle/macos/`.

### `npm run app:install`
Builds the app, installs it to the project root folder (same level as `app/`), removes quarantine attributes, and launches it. This is the main workflow command.

### `npm run app:open`
Opens the installed app from the project root folder (if it's already installed).

## Installation Location

By default, the app is installed to:
- **Project root folder** (`ColorWizard Desktop/ColorWizard Desktop.app`) - same folder that contains the `app/` directory

This keeps everything self-contained in one place. The app lives right next to your source code.

To install to a different location (e.g., `~/Applications`):

```bash
COLORWIZARD_INSTALL_DIR=~/Applications npm run app:install
```

Or edit `app/scripts/install-app.sh` and change the `INSTALL_DIR` variable.

## Workflow

### Normal Development Cycle

1. Make your code changes
2. Run `cd app && npm run app:install`
3. The app will build, install, and launch automatically
4. Test your changes
5. Repeat

### If App is Already Running

If ColorWizard Desktop is already running when you try to install:

1. The install script will detect this and exit with a warning
2. Quit the app (from the menu bar or `Cmd+Q`)
3. Run `npm run app:install` again

You can also force-quit if needed:
```bash
pkill -f "com.coltonbatts.colorwizard.desktop"
```

## Known Caveats

### macOS Quarantine Attributes
After copying the `.app` bundle, the script automatically removes quarantine attributes using `xattr`. This allows macOS to run the app without Gatekeeper warnings. If you see security warnings, you may need to manually remove quarantine:

```bash
xattr -dr com.apple.quarantine "ColorWizard Desktop.app"
```

(From the project root folder)

### App Must Be Quit Before Overwrite
The install script checks if the app is running before overwriting. If it's running, you'll need to quit it first. This prevents file system conflicts.

### Bundle Detection
The script automatically finds the `.app` bundle in `src-tauri/target/release/bundle/macos/`. If multiple `.app` bundles are found, the script will error out. This shouldn't happen in normal usage.

## Uninstalling

To uninstall ColorWizard Desktop, simply delete the app from the project root folder:

```bash
rm -rf "ColorWizard Desktop.app"
```

(From the project root folder, same level as `app/`)

Or drag it to Trash from Finder.

## Troubleshooting

### "Could not find .app bundle"
- Make sure you've run `npm run app:build` first, or use `npm run app:install` which builds automatically
- Check that `src-tauri/target/release/bundle/macos/` exists and contains a `.app` bundle

### "App appears to be running"
- Quit ColorWizard Desktop before installing
- Check running processes: `ps aux | grep -i colorwizard`
- Force quit if needed: `pkill -f "com.coltonbatts.colorwizard.desktop"`

### Permission Errors
- Installing to the project root folder requires no special permissions
- If installing to `/Applications` or `~/Applications` via env var, you may need `sudo` for `/Applications`
- Make sure the install script is executable: `chmod +x app/scripts/install-app.sh`

### Gatekeeper Warnings
- The script removes quarantine attributes automatically
- If warnings persist, manually remove: `xattr -dr com.apple.quarantine "ColorWizard Desktop.app"` (from project root)
- You may need to allow the app in System Settings > Privacy & Security

## Technical Details

- **Build Output**: `app/src-tauri/target/release/bundle/macos/ColorWizard Desktop.app`
- **Bundle Identifier**: `com.coltonbatts.colorwizard.desktop`
- **Install Script**: `app/scripts/install-app.sh`
- **Build Command**: `tauri build --bundles app`

The install script uses standard macOS tools:
- `cp -R` to copy the app bundle
- `xattr` to remove quarantine attributes
- `open` to launch the app
- `pgrep` to check if the app is running
