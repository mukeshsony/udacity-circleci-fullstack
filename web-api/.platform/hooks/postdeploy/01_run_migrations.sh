#!/bin/bash
set -e

echo "=========================================="
echo "Running database migrations..."
echo "=========================================="

cd /var/app/current

# Check if migration script exists
if [ ! -f "scripts/run_migrations.js" ]; then
  echo "Migration script not found, skipping..."
  exit 0
fi

# Set environment variables for migration script
export DATABASE_HOST=${POSTGRES_HOST}
export DATABASE_PORT=${POSTGRES_PORT:-5432}
export DATABASE_NAME=${POSTGRES_DB}
export DATABASE_USER=${POSTGRES_USERNAME}
export DATABASE_PASSWORD=${POSTGRES_PASSWORD}

echo "Running migrations..."
echo "Database Host: ${DATABASE_HOST}"
echo "Database Name: ${DATABASE_NAME}"

# Run migrations
npm run db:migrate

echo "=========================================="
echo "Migrations completed successfully!"
echo "=========================================="
