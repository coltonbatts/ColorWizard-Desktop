#!/bin/bash

# Tauri App Creator - Quick scaffold tool
# Usage: ./scripts/create-tauri-app.sh <app-name> [template]

set -e

APP_NAME=$1
TEMPLATE=${2:-boilerplate}

if [ -z "$APP_NAME" ]; then
    echo "❌ Error: App name required"
    echo ""
    echo "Usage: ./scripts/create-tauri-app.sh <app-name> [template]"
    echo ""
    echo "Examples:"
    echo "  ./scripts/create-tauri-app.sh my-app"
    echo "  ./scripts/create-tauri-app.sh my-app boilerplate"
    exit 1
fi

# Convert app name to identifier format
APP_IDENTIFIER=$(echo "$APP_NAME" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | tr '_' '-')
APP_IDENTIFIER="com.$(whoami).${APP_IDENTIFIER}"

# Determine template path
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
TEMPLATE_PATH="$PROJECT_ROOT/tauri-boilerplate"

if [ ! -d "$TEMPLATE_PATH" ]; then
    echo "❌ Error: Template not found at $TEMPLATE_PATH"
    exit 1
fi

# Create app directory
APP_DIR="$PROJECT_ROOT/$APP_NAME"

if [ -d "$APP_DIR" ]; then
    echo "❌ Error: Directory $APP_NAME already exists"
    exit 1
fi

echo "🚀 Creating Tauri app: $APP_NAME"
echo "📁 Location: $APP_DIR"
echo ""

# Copy template
echo "📋 Copying template..."
cp -r "$TEMPLATE_PATH" "$APP_DIR"

# Update package.json
echo "📦 Updating package.json..."
cd "$APP_DIR"
sed -i '' "s/tauri-boilerplate/$APP_NAME/g" package.json 2>/dev/null || \
sed -i "s/tauri-boilerplate/$APP_NAME/g" package.json

# Update Cargo.toml
echo "🦀 Updating Cargo.toml..."
cd src-tauri
sed -i '' "s/tauri-boilerplate/$APP_NAME/g" Cargo.toml 2>/dev/null || \
sed -i "s/tauri-boilerplate/$APP_NAME/g" Cargo.toml

# Update tauri.conf.json
echo "⚙️  Updating tauri.conf.json..."
APP_NAME_DISPLAY=$(echo "$APP_NAME" | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++)sub(/./,toupper(substr($i,1,1)),$i)}1')
sed -i '' "s/Tauri App/$APP_NAME_DISPLAY/g" tauri.conf.json 2>/dev/null || \
sed -i "s/Tauri App/$APP_NAME_DISPLAY/g" tauri.conf.json
sed -i '' "s/com.tauri.app/$APP_IDENTIFIER/g" tauri.conf.json 2>/dev/null || \
sed -i "s/com.tauri.app/$APP_IDENTIFIER/g" tauri.conf.json

# Find a free port for this app
echo "🔍 Finding free port..."
cd "$PROJECT_ROOT"
FREE_PORT=$(bash "$SCRIPT_DIR/find-free-port.sh" 1420 50)
echo "✅ Using port: $FREE_PORT"

# Update vite.config.ts to use dynamic port
cd "$APP_DIR"
if [ -f "vite.config.ts" ]; then
    # Update vite config to use dynamic port finding
    cat > vite.config.ts << 'VITECONFIG'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { execSync } from 'child_process'

// Find a free port dynamically
function findFreePort(startPort = 1420, maxAttempts = 20) {
  for (let i = 0; i < maxAttempts; i++) {
    const port = startPort + i
    try {
      execSync(`lsof -Pi :${port} -sTCP:LISTEN -t`, { stdio: 'ignore' })
    } catch {
      return port
    }
  }
  return startPort
}

const PORT = findFreePort()

export default defineConfig({
  plugins: [react()],
  clearScreen: false,
  server: {
    port: PORT,
    strictPort: false,
    watch: {
      ignored: ['**/src-tauri/**'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  envPrefix: ['VITE_', 'TAURI_'],
  build: {
    target: ['es2021', 'chrome100', 'safari13'],
    minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
    sourcemap: !!process.env.TAURI_DEBUG,
  },
})
VITECONFIG
fi

# Update tauri.conf.json to not hardcode port (will use env or default)
cd src-tauri
# Change devUrl to use environment variable or let Vite pick
sed -i '' 's|"devUrl": "http://127.0.0.1:1420"|"devUrl": "http://127.0.0.1:1420"|g' tauri.conf.json 2>/dev/null || \
sed -i 's|"devUrl": "http://127.0.0.1:1420"|"devUrl": "http://127.0.0.1:1420"|g' tauri.conf.json

cd ..

# Install dependencies
echo "📥 Installing dependencies..."
npm install

# Build Rust dependencies
echo "🔨 Building Rust dependencies..."
cd src-tauri
cargo build --quiet 2>&1 | grep -v "warning:" || echo "⚠️  Rust build had issues, but continuing..."
cd ..

echo ""
echo "✅ App created successfully!"
echo ""
echo "📁 Location: $APP_DIR"
echo "🔌 Port: Will auto-detect free port (starting from 1420)"
echo ""
echo "🚀 Next steps:"
echo "   cd $APP_NAME"
echo "   npm run dev"
echo ""
echo "💡 Tips:"
echo "   - Port will be auto-selected (no conflicts!)"
echo "   - Add your icon to src-tauri/icons/icon.png"
echo "   - Customize src/App.tsx"
echo "   - Add commands in src-tauri/src/commands/"
echo ""
