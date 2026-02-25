#!/bin/bash

# Kill process on port 5000
echo "Killing process on port 5000..."
lsof -ti:5000 | xargs kill -9 2>/dev/null || echo "No process found on port 5000"

echo "Port 5000 is now free!"
echo "You can now start the backend server with: cd server && npm run dev"
