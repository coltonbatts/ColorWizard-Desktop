#!/bin/bash
# Monitor Tauri build process with real-time status updates

APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$APP_DIR"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🔍 CB Build Monitor${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Function to check process status
check_status() {
    local process_name=$1
    if pgrep -f "$process_name" > /dev/null; then
        echo -e "${GREEN}✅ $process_name is running${NC}"
        return 0
    else
        echo -e "${RED}❌ $process_name is not running${NC}"
        return 1
    fi
}

# Function to check port
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Port $port is in use (Vite server running)${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  Port $port is free${NC}"
        return 1
    fi
}

# Monitor loop
monitor() {
    echo "Monitoring build process..."
    echo "Press Ctrl+C to stop monitoring"
    echo ""
    
    while true; do
        clear
        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${BLUE}🔍 CB Build Monitor - $(date '+%H:%M:%S')${NC}"
        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo ""
        
        echo "Process Status:"
        check_status "vite"
        check_status "cargo"
        check_status "tauri"
        echo ""
        
        echo "Port Status:"
        check_port 1420
        echo ""
        
        echo "Recent Log Output (last 10 lines):"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        if [ -f /tmp/cb-tauri-dev.log ]; then
            tail -n 10 /tmp/cb-tauri-dev.log 2>/dev/null || echo "No log file yet"
        else
            echo "No log file found. Start the dev server first."
        fi
        echo ""
        
        sleep 2
    done
}

monitor
