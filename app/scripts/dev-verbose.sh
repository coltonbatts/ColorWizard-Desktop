#!/bin/bash
# Verbose Tauri dev mode with step-by-step output

set -e

APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$APP_DIR"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

log_step() {
    echo -e "${CYAN}▶ $1${NC}"
}

log_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

log_error() {
    echo -e "${RED}✗ $1${NC}"
}

log_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🚀 CB Markdown Organizer - Development Mode${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Step 1: Check port
log_step "Checking port 1420..."
if lsof -Pi :1420 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    log_info "Port 1420 is in use, killing existing process..."
    lsof -ti:1420 | xargs kill -9 2>/dev/null || true
    sleep 1
    log_success "Port cleared"
else
    log_success "Port 1420 is available"
fi
echo ""

# Step 2: Check dependencies
log_step "Checking npm dependencies..."
if [ ! -d "node_modules" ]; then
    log_info "Installing dependencies..."
    npm install
    log_success "Dependencies installed"
else
    log_success "Dependencies found"
fi
echo ""

# Step 3: Check Rust
log_step "Checking Rust toolchain..."
if ! command -v cargo &> /dev/null; then
    log_error "Rust/Cargo not found!"
    echo "   Install from: https://rustup.rs/"
    exit 1
fi
log_success "Rust toolchain found: $(cargo --version)"
echo ""

# Step 4: Show what will happen
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}📋 Build Process Overview:${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "1. Starting Vite dev server (frontend)"
echo "   → Compiles TypeScript/React"
echo "   → Serves on http://127.0.0.1:1420"
echo ""
echo "2. Compiling Rust backend"
echo "   → First build: 30-60 seconds"
echo "   → Subsequent builds: 5-10 seconds"
echo ""
echo "3. Launching Tauri window"
echo "   → App window opens automatically"
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
log_info "Starting build... (watch for errors below)"
echo ""

# Step 5: Run with full output
npm run desktop:dev
