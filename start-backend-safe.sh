#!/bin/bash
# Development startup script for backend
# Checks if port is in use and provides alternatives

PORT=${1:-8001}
HOST="127.0.0.1"

echo "Attempting to start backend on $HOST:$PORT..."

# Check if port is in use
if netstat -an | grep LISTEN | grep $PORT > /dev/null; then
    echo "Port $PORT is in use. Trying alternative port..."
    PORT=8002
    if netstat -an | grep LISTEN | grep $PORT > /dev/null; then
        echo "Port $PORT is also in use. Trying port 8003..."
        PORT=8003
        if netstat -an | grep LISTEN | grep $PORT > /dev/null; then
            echo "All ports (8001, 8002, 8003) are in use. Please free up a port."
            exit 1
        fi
    fi
    echo "Using alternative port: $PORT"
fi

echo "Starting backend on http://$HOST:$PORT"
cd backend && uvicorn main:app --reload --port $PORT --host $HOST