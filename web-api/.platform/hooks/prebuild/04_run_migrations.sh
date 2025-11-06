#!/bin/bash
# Do not exit on error - allow build to continue even if migrations fail
set +e

echo "=========================================="
echo "Running database migrations..."
echo "=========================================="

cd /var/app/staging

# Check if migration script exists
if [ ! -f "scripts/run_migrations.js" ]; then
  echo "Migration script not found, skipping..."
  exit 0
fi

# Check if required packages exist
if [ ! -d "node_modules/pg" ]; then
  echo "pg package not found, skipping migrations..."
  exit 0
fi

# Set environment variables for migration script
export DATABASE_HOST=${POSTGRES_HOST}
export DATABASE_PORT=${POSTGRES_PORT:-5432}
export DATABASE_NAME=${POSTGRES_DB}
export DATABASE_USER=${POSTGRES_USERNAME}
export DATABASE_PASSWORD=${POSTGRES_PASSWORD}

echo "Checking database environment variables..."
if [ -z "${DATABASE_HOST}" ] || [ -z "${DATABASE_NAME}" ]; then
  echo "⚠️ WARNING: Database environment variables not set, skipping migrations"
  exit 0
fi

echo "Database Host: ${DATABASE_HOST}"
echo "Database Name: ${DATABASE_NAME}"
echo "Running migrations..."

# Run migrations (allow to fail without breaking deployment)
npm run db:migrate || {
  echo "⚠️ WARNING: Migration failed, but continuing deployment"
  echo "Error code: $?"
  echo "You may need to run migrations manually or check database connectivity"
  exit 0
}

echo "=========================================="
echo "✅ Migrations completed successfully!"
echo "=========================================="
