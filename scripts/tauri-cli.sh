#!/bin/bash

# Tauri CLI - Unified command interface
# Usage: ./scripts/tauri-cli.sh <command> [args...]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

COMMAND=$1
shift || true

case "$COMMAND" in
    "new"|"create")
        APP_NAME=$1
        if [ -z "$APP_NAME" ]; then
            echo "❌ Error: App name required"
            echo "Usage: ./scripts/tauri-cli.sh new <app-name>"
            exit 1
        fi
        "$SCRIPT_DIR/create-tauri-app.sh" "$APP_NAME"
        ;;
    
    "list"|"ls")
        echo "📦 Available Tauri apps:"
        echo ""
        for dir in "$PROJECT_ROOT"/*/; do
            if [ -f "$dir/package.json" ] && [ -d "$dir/src-tauri" ]; then
                APP_NAME=$(basename "$dir")
                if [ "$APP_NAME" != "tauri-boilerplate" ] && [ "$APP_NAME" != "tauri-plugins" ]; then
                    echo "  📱 $APP_NAME"
                fi
            fi
        done
        ;;
    
    "dev")
        APP_NAME=$1
        if [ -z "$APP_NAME" ]; then
            echo "❌ Error: App name required"
            echo "Usage: ./scripts/tauri-cli.sh dev <app-name>"
            exit 1
        fi
        APP_DIR="$PROJECT_ROOT/$APP_NAME"
        if [ ! -d "$APP_DIR" ]; then
            echo "❌ Error: App '$APP_NAME' not found"
            exit 1
        fi
        cd "$APP_DIR"
        npm run dev
        ;;
    
    "build")
        APP_NAME=$1
        if [ -z "$APP_NAME" ]; then
            echo "❌ Error: App name required"
            echo "Usage: ./scripts/tauri-cli.sh build <app-name>"
            exit 1
        fi
        APP_DIR="$PROJECT_ROOT/$APP_NAME"
        if [ ! -d "$APP_DIR" ]; then
            echo "❌ Error: App '$APP_NAME' not found"
            exit 1
        fi
        cd "$APP_DIR"
        npm run build && npm run tauri:build
        ;;
    
    "plugin")
        PLUGIN_CMD=$1
        case "$PLUGIN_CMD" in
            "list"|"ls")
                echo "🔌 Available plugins:"
                echo ""
                for plugin in "$PROJECT_ROOT/tauri-plugins"/*/; do
                    if [ -d "$plugin" ] && [ -f "$plugin/Cargo.toml" ]; then
                        PLUGIN_NAME=$(basename "$plugin")
                        echo "  🔧 $PLUGIN_NAME"
                    fi
                done
                ;;
            *)
                echo "❌ Unknown plugin command: $PLUGIN_CMD"
                echo "Usage: ./scripts/tauri-cli.sh plugin list"
                exit 1
                ;;
        esac
        ;;
    
    "help"|"--help"|"-h"|"")
        echo "🚀 Tauri CLI - Unified command interface"
        echo ""
        echo "Usage: ./scripts/tauri-cli.sh <command> [args...]"
        echo ""
        echo "Commands:"
        echo "  new <name>        Create a new Tauri app"
        echo "  list              List all Tauri apps"
        echo "  dev <name>        Run app in development mode"
        echo "  build <name>      Build app for production"
        echo "  plugin list       List available plugins"
        echo "  help              Show this help message"
        echo ""
        echo "Examples:"
        echo "  ./scripts/tauri-cli.sh new my-app"
        echo "  ./scripts/tauri-cli.sh dev my-app"
        echo "  ./scripts/tauri-cli.sh list"
        ;;
    
    *)
        echo "❌ Unknown command: $COMMAND"
        echo "Run './scripts/tauri-cli.sh help' for usage"
        exit 1
        ;;
esac
