#!/bin/bash

# QRLinkHub Startup Script
echo "🚀 Starting QRLinkHub..."

# Set Node.js path
export PATH=/home/jet/Desktop/qr-system/nodejs/bin:$PATH

# Check if MongoDB is running
echo "📊 Checking MongoDB..."
if ! nc -z localhost 27017 2>/dev/null; then
    echo "⚠️  MongoDB is not running on port 27017"
    echo ""
    echo "Please start MongoDB using one of these methods:"
    echo "  1. Docker: docker-compose up -d"
    echo "  2. System: sudo systemctl start mongod"
    echo ""
    exit 1
fi

echo "✅ MongoDB is running"

# Start backend in background
echo "🔧 Starting backend..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 2

# Start frontend
echo "🎨 Starting frontend..."
cd frontend
npm run dev

# Cleanup on exit
trap "kill $BACKEND_PID 2>/dev/null" EXIT
