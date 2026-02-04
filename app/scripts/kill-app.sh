#!/bin/bash
# Kill all ColorWizard Desktop instances aggressively

APP_NAME="ColorWizard Desktop"
BUNDLE_ID="com.coltonbatts.colorwizard.desktop"

echo "Killing all ColorWizard Desktop instances..."

# Kill by exact app name (macOS way)
killall -9 "$APP_NAME" 2>/dev/null || true

# Kill by bundle ID
pkill -9 -f "$BUNDLE_ID" 2>/dev/null || true

# Kill by app name pattern
pkill -9 -f "$APP_NAME" 2>/dev/null || true

# Kill by any colorwizard pattern (case insensitive)
pkill -9 -i -f "colorwizard" 2>/dev/null || true

# Kill any tauri dev processes that might be related
pkill -9 -f "tauri dev" 2>/dev/null || true

# Kill Rust dev binaries (target/debug/colorwizard_desktop)
pkill -9 -f "target/debug/colorwizard_desktop" 2>/dev/null || true
pkill -9 -f "colorwizard_desktop" 2>/dev/null || true

# Give it a moment
sleep 1

# Double check and force kill anything remaining
if pgrep -i -f "colorwizard" > /dev/null; then
  echo "Force killing remaining instances..."
  killall -9 "$APP_NAME" 2>/dev/null || true
  pkill -9 -i -f "colorwizard" 2>/dev/null || true
  sleep 0.5
fi

echo "All ColorWizard instances killed."
