#!/bin/bash
set -e

echo "Pruning devDependencies to reduce deployment size..."
cd /var/app/staging
npm prune --production

echo "devDependencies removed successfully"
