#!/bin/bash
set -e  # Exit immediately if a command fails

echo "🔹 Stashing changes..."
git stash

echo "🔹 Pulling latest changes from origin/main..."
git pull origin main

echo "🔹 Applying stashed changes..."
git stash pop || true   # '|| true' prevents errors if there's nothing to pop

echo "🔹 Installing backend dependencies..."
cd backend/data-api
npm install
cd ../..

echo "🔹 Installing frontend dependencies..."
cd frontend
npm install

echo "🔹 Building frontend..."
npm run build

echo "✅ Deployment script finished successfully!"
