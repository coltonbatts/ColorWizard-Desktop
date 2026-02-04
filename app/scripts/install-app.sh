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
# Install to project root folder (self-contained)
INSTALL_DIR="$PROJECT_ROOT"
BUNDLE_DIR="src-tauri/target/release/bundle/macos"

# Allow override of install directory via environment variable
if [ -n "$COLORWIZARD_INSTALL_DIR" ]; then
  INSTALL_DIR="$COLORWIZARD_INSTALL_DIR"
fi

echo -e "${GREEN}Building ColorWizard Desktop...${NC}"
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

# Check if app is currently running
if pgrep -f "$BUNDLE_ID" > /dev/null || pgrep -f "$APP_BASENAME" > /dev/null; then
  echo -e "${YELLOW}Warning: ${APP_NAME} appears to be running.${NC}"
  echo -e "${YELLOW}Please quit the app before installing.${NC}"
  echo -e "${YELLOW}You can quit it from the menu bar or run: pkill -f '${BUNDLE_ID}'${NC}"
  exit 1
fi

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
