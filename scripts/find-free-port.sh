#!/bin/bash

# Find a free port starting from a base port
# Usage: find-free-port.sh [base_port] [max_attempts]

BASE_PORT=${1:-1420}
MAX_ATTEMPTS=${2:-10}

for i in $(seq 0 $((MAX_ATTEMPTS - 1))); do
    PORT=$((BASE_PORT + i))
    
    # Check if port is in use (macOS/Linux compatible)
    if ! lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo $PORT
        exit 0
    fi
done

# If no port found, return error
echo "ERROR: No free port found in range $BASE_PORT-$((BASE_PORT + MAX_ATTEMPTS - 1))" >&2
exit 1
