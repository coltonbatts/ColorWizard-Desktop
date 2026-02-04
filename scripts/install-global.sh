#!/bin/bash

# Install Tauri CLI globally
# This makes commands available from anywhere

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Create global bin directory
GLOBAL_BIN="$HOME/.local/bin"
mkdir -p "$GLOBAL_BIN"

# Create wrapper scripts
cat > "$GLOBAL_BIN/tauri-new" << EOF
#!/bin/bash
cd "$PROJECT_ROOT" && npm run tauri:new "\$@"
EOF

cat > "$GLOBAL_BIN/tauri-list" << EOF
#!/bin/bash
cd "$PROJECT_ROOT" && npm run tauri:list
EOF

cat > "$GLOBAL_BIN/tauri-dev" << EOF
#!/bin/bash
cd "$PROJECT_ROOT" && npm run tauri:dev "\$@"
EOF

cat > "$GLOBAL_BIN/tauri-build" << EOF
#!/bin/bash
cd "$PROJECT_ROOT" && npm run tauri:build "\$@"
EOF

# Make executable
chmod +x "$GLOBAL_BIN"/tauri-*

# Check if PATH includes ~/.local/bin
if [[ ":$PATH:" != *":$GLOBAL_BIN:"* ]]; then
    echo "⚠️  Adding $GLOBAL_BIN to PATH..."
    
    # Detect shell
    if [ -n "$ZSH_VERSION" ]; then
        SHELL_RC="$HOME/.zshrc"
    elif [ -n "$BASH_VERSION" ]; then
        SHELL_RC="$HOME/.bashrc"
    else
        SHELL_RC="$HOME/.profile"
    fi
    
    echo "" >> "$SHELL_RC"
    echo "# Tauri CLI" >> "$SHELL_RC"
    echo "export PATH=\"\$HOME/.local/bin:\$PATH\"" >> "$SHELL_RC"
    
    echo "✅ Added to $SHELL_RC"
    echo "   Run: source $SHELL_RC"
fi

echo "✅ Tauri CLI installed globally!"
echo ""
echo "Available commands:"
echo "  tauri-new <name>        - Create new app"
echo "  tauri-list              - List all apps"
echo "  tauri-dev <name>        - Run app in dev"
echo "  tauri-build <name>      - Build app"
echo ""
echo "You can now use these commands from anywhere!"
echo ""
echo "Try it:"
echo "  tauri-new test-app"
