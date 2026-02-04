#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running on macOS
if [[ "$(uname)" != "Darwin" ]]; then
  echo -e "${RED}Error: This script is macOS-only.${NC}"
  exit 1
fi

# Get script directory and ensure we're in the app directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
PROJECT_ROOT="$(cd "$APP_DIR/.." && pwd)"
cd "$APP_DIR"

# Configuration
APP_NAME="ColorWizard Desktop"
BUNDLE_ID="com.coltonbatts.colorwizard.desktop"
INSTALL_DIR="$PROJECT_ROOT"
BUNDLE_DIR="src-tauri/target/release/bundle/macos"

echo -e "${GREEN}Killing all ${APP_NAME} instances...${NC}"
# Kill ALL instances (ignore errors if not running)
pkill -f "$BUNDLE_ID" 2>/dev/null || true
pkill -f "$APP_NAME" 2>/dev/null || true

# Give it a moment to fully quit
sleep 0.5

# Force kill if still running
if pgrep -f "$BUNDLE_ID" > /dev/null || pgrep -f "$APP_NAME" > /dev/null; then
  echo -e "${YELLOW}Force killing remaining instances...${NC}"
  pkill -9 -f "$BUNDLE_ID" 2>/dev/null || true
  pkill -9 -f "$APP_NAME" 2>/dev/null || true
  sleep 0.5
fi

echo -e "${GREEN}Building ${APP_NAME}...${NC}"
# Unset CI variable if set, as Tauri expects boolean values for --ci flag
unset CI
npm run app:build

# Check if bundle directory exists
if [ ! -d "$BUNDLE_DIR" ]; then
  echo -e "${RED}Error: Bundle directory not found: ${BUNDLE_DIR}${NC}"
  echo -e "${RED}Build may have failed. Check the output above.${NC}"
  exit 1
fi

# Find the .app bundle
BUNDLE_PATH=$(find "$BUNDLE_DIR" -name "*.app" -type d | head -n 1)

if [ -z "$BUNDLE_PATH" ]; then
  echo -e "${RED}Error: Could not find .app bundle in ${BUNDLE_DIR}${NC}"
  echo -e "${RED}Build may have failed. Check the output above.${NC}"
  exit 1
fi

# Check for multiple .app bundles
BUNDLE_COUNT=$(find "$BUNDLE_DIR" -name "*.app" -type d | wc -l | tr -d ' ')
if [ "$BUNDLE_COUNT" -gt 1 ]; then
  echo -e "${RED}Error: Found ${BUNDLE_COUNT} .app bundles. Expected exactly one.${NC}"
  find "$BUNDLE_DIR" -name "*.app" -type d
  exit 1
fi

APP_BASENAME=$(basename "$BUNDLE_PATH")
INSTALLED_APP_PATH="${INSTALL_DIR}/${APP_BASENAME}"

# Ensure install directory exists
mkdir -p "$INSTALL_DIR"

# Remove existing installation if present
if [ -d "$INSTALLED_APP_PATH" ]; then
  echo -e "${YELLOW}Removing existing installation...${NC}"
  rm -rf "$INSTALLED_APP_PATH"
fi

# Copy the app bundle
echo -e "${GREEN}Installing ${APP_NAME} to ${INSTALL_DIR}...${NC}"
cp -R "$BUNDLE_PATH" "$INSTALL_DIR/"

# Remove quarantine attributes
echo -e "${GREEN}Removing quarantine attributes...${NC}"
xattr -dr com.apple.quarantine "$INSTALLED_APP_PATH" 2>/dev/null || true

echo -e "${GREEN}Installation complete!${NC}"
echo -e "${GREEN}Launching ${APP_NAME}...${NC}"

# Launch the app in background (don't steal focus or open Finder)
open -g "$INSTALLED_APP_PATH" 2>/dev/null || open "$INSTALLED_APP_PATH"

echo -e "${GREEN}✓ Done! App launched.${NC}"
