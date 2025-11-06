#!/bin/bash
set -e

echo "Installing dependencies including devDependencies for TypeScript build..."
cd /var/app/staging
npm install --production=false

echo "Dependencies installed successfully"
