#!/bin/bash
set -e

echo "Building TypeScript application..."
cd /var/app/staging
npm run build

echo "Build completed successfully"
echo "Listing dist directory:"
ls -la dist/ || echo "dist directory not found!"
