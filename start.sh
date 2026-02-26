#!/bin/bash

echo "🚀 Starting MindBridge AI Platform..."
echo ""

# Check if Node modules exist
if [ ! -d "server/node_modules" ]; then
  echo "📦 Installing server dependencies..."
  cd server
  npm install
  cd ..
fi

if [ ! -d "client/node_modules" ]; then
  echo "📦 Installing client dependencies..."
  cd client
  npm install
  cd ..
fi

echo ""
echo "✓ Dependencies installed"
echo ""
echo "🔧 Starting Backend Server (port 5000)..."
cd server
npm run dev &
SERVER_PID=$!

echo ""
echo "⏳ Waiting 3 seconds for server to start..."
sleep 3

echo ""
echo "🔧 Starting Frontend Client (port 5173)..."
cd ../client
npm run dev

# Cleanup on exit
trap "kill $SERVER_PID" EXIT
