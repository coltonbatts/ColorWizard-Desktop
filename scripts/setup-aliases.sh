#!/bin/bash

# Setup shell aliases for Tauri commands
# Run: source scripts/setup-aliases.sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Create aliases
alias tauri-new="cd $PROJECT_ROOT && npm run tauri:new"
alias tauri-list="cd $PROJECT_ROOT && npm run tauri:list"
alias tauri-dev="cd $PROJECT_ROOT && npm run tauri:dev"
alias tauri-build="cd $PROJECT_ROOT && npm run tauri:build"
alias tauri-plugin-list="cd $PROJECT_ROOT && npm run tauri:plugin:list"

echo "✅ Tauri aliases loaded!"
echo ""
echo "Available commands:"
echo "  tauri-new <name>        - Create new app"
echo "  tauri-list              - List all apps"
echo "  tauri-dev <name>        - Run app in dev"
echo "  tauri-build <name>      - Build app"
echo "  tauri-plugin-list       - List plugins"
echo ""
echo "To make permanent, add to ~/.zshrc or ~/.bashrc:"
echo "  source $(pwd)/scripts/setup-aliases.sh"
