#!/bin/bash
# Tauri dev mode with visible output and status messages

set -e

APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$APP_DIR"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 Starting CB Markdown Organizer"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check for port conflicts
PORT=1420
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "⚠️  Port $PORT is already in use!"
    echo "   Killing existing process..."
    lsof -ti:$PORT | xargs kill -9 2>/dev/null || true
    sleep 1
    echo "✅ Port cleared"
    echo ""
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing npm dependencies..."
    npm install
    echo "✅ Dependencies installed"
    echo ""
fi

# Check Rust toolchain
if ! command -v cargo &> /dev/null; then
    echo "❌ Rust/Cargo not found. Please install Rust: https://rustup.rs/"
    exit 1
fi

echo "📋 Build Status:"
echo "   • Frontend: React + TypeScript + Vite"
echo "   • Backend: Rust + Tauri"
echo "   • Port: $PORT"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔄 Starting build process..."
echo "   (This may take 30-60 seconds on first run)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Run with explicit output
npm run desktop:dev 2>&1 | tee /tmp/cb-tauri-dev.log
