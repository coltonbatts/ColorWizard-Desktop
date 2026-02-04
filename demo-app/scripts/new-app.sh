#!/bin/bash

# Script to create a new Tauri app from the boilerplate

if [ -z "$1" ]; then
    echo "Usage: ./scripts/new-app.sh <app-name>"
    exit 1
fi

APP_NAME=$1
APP_DIR="../$APP_NAME"

echo "🚀 Creating new Tauri app: $APP_NAME"

# Copy boilerplate
cp -r . "$APP_DIR"

# Update package.json
cd "$APP_DIR"
sed -i '' "s/tauri-boilerplate/$APP_NAME/g" package.json

# Update Cargo.toml
cd src-tauri
sed -i '' "s/tauri-boilerplate/$APP_NAME/g" Cargo.toml

# Update tauri.conf.json
sed -i '' "s/Tauri App/$APP_NAME/g" tauri.conf.json
sed -i '' "s/com.tauri.app/com.$(echo $APP_NAME | tr '[:upper:]' '[:lower:]' | tr ' ' '.')/g" tauri.conf.json

cd ..

echo "✅ App created at: $APP_DIR"
echo ""
echo "Next steps:"
echo "  cd $APP_DIR"
echo "  npm install"
echo "  npm run dev"
