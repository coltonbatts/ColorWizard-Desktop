#!/bin/bash

# Setup script for new boilerplate instance

echo "🔧 Setting up Tauri boilerplate..."

# Install Node dependencies
echo "📦 Installing Node dependencies..."
npm install

# Install Rust dependencies
echo "🦀 Installing Rust dependencies..."
cd src-tauri
cargo build
cd ..

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p src/components
mkdir -p src/hooks
mkdir -p src/types
mkdir -p src/lib

# Copy placeholder icons if they don't exist
if [ ! -f "src-tauri/icons/icon.png" ]; then
    echo "⚠️  Warning: No icon found. Please add your app icon to src-tauri/icons/"
fi

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Update app name and identifier in src-tauri/tauri.conf.json"
echo "  2. Add your app icon to src-tauri/icons/"
echo "  3. Customize src/App.tsx"
echo "  4. Run 'npm run dev' to start development"
