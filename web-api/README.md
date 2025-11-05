# Storefront API (TypeScript + Express + PostgreSQL)

## Overview
This project is a scaffold for a storefront backend: Users, Products, Orders, and authentication (JWT). It satisfies the rubric: TypeScript, tests, migrations, bcrypt password hashing, and RESTful CRUD endpoints.

---
## Quick setup (local development)

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 12+ (local installation or Docker)

### Step 1: Package Installation
Clone or unzip the project and install all dependencies:
```bash
npm install
```

### Step 2: Database Setup and Connection

#### Option A: Local PostgreSQL Installation
1. **Install PostgreSQL** (if not already installed):
   - Windows: Download from https://www.postgresql.org/download/
   - macOS: `brew install postgresql`
   - Linux: `sudo apt-get install postgresql postgresql-contrib`

2. **Start PostgreSQL service**:
   - Windows: Use Services app or `net start postgresql-x64-XX`
   - macOS/Linux: `sudo service postgresql start` or `brew services start postgresql`

3. **Create database and user**:
   Connect to PostgreSQL as superuser and run:
   ```sql
   CREATE DATABASE store_dev;
   CREATE DATABASE store_dev_test;  -- for testing
   CREATE USER store_user WITH PASSWORD 'store_pass';
   GRANT ALL PRIVILEGES ON DATABASE store_dev TO store_user;
   GRANT ALL PRIVILEGES ON DATABASE store_dev_test TO store_user;
   ```

#### Option B: Docker PostgreSQL
```bash
docker run --name storefront-postgres \
  -e POSTGRES_DB=store_dev \
  -e POSTGRES_USER=store_user \
  -e POSTGRES_PASSWORD=store_pass \
  -p 5432:5432 \
  -d postgres:14
```

### Step 3: Environment Configuration
1. **Copy the example environment file**:
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` file** with your database connection details:
   ```env
   # Application Configuration
   PORT=3000
   NODE_ENV=development
   
   # Database Configuration
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USER=store_user
   DATABASE_PASSWORD=store_pass
   DATABASE_NAME=store_dev
   DATABASE_TEST_NAME=store_dev_test
   
   # JWT Configuration
   JWT_SECRET=your_jwt_secret_here_change_this_in_production
   ```

**IMPORTANT:** Replace `your_jwt_secret_here_change_this_in_production` with a secure random string.

### Step 4: Database Migration
Run the database migrations to create all required tables:
```bash
npm run db:migrate
```
This creates the following tables: `users`, `products`, `orders`, and `order_products`.

### Step 5: Build and Start the Server
```bash
# Build the TypeScript code
npm run build

# Start the production server
npm start
```

**OR** for development with auto-reload:
```bash
npm run dev
```

The server will start at: **http://localhost:3000**

### Step 6: Verify Installation
Test that everything is working:
```bash
# Run all tests (requires test database)
npm run test:all

# Run only mock tests (no database required)
npm test
```

---
## Ports and Services

### Backend API Server
- **Port**: `3000` (default)
- **Configurable via**: `PORT` environment variable in `.env` file
- **Access**: http://localhost:3000
- **Health check**: GET http://localhost:3000/api/users (returns 401 without auth, which is expected)

### Database (PostgreSQL)
- **Port**: `5432` (default PostgreSQL port)
- **Configurable via**: `DATABASE_PORT` environment variable in `.env` file
- **Connection**: Configured through environment variables in `.env` file

## Troubleshooting

### Common Issues

**Database Connection Errors**:
- Ensure PostgreSQL is running: `pg_isready -h localhost -p 5432`
- Verify database credentials in `.env` file match your PostgreSQL setup
- Check if databases exist: `psql -U store_user -l`

**Port Already in Use**:
- Change the PORT in `.env` file to use a different port (e.g., 3001)
- Or kill the process using the port: `lsof -ti:3000 | xargs kill` (macOS/Linux)

**Migration Errors**:
- Ensure database exists before running migrations
- Check database user has proper privileges
- Verify connection settings in `.env` file

**Test Failures**:
- Mock tests should always pass (no database required)
- Full tests require a working database connection
- Ensure test database exists and is accessible

### Verifying Setup
Test your API endpoints with curl or a tool like Postman:

```bash
# Create a user (should return 201)
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# List products (should return 200 with empty array initially)
curl http://localhost:3000/api/products
```

## Submission Details
To allow a reviewer to inspect environment variables, include a copy of your `.env` values in the submission notes (but do NOT commit .env to the repo). See `.env.example` for required keys.

## API Documentation
See `REQUIREMENTS.md` for complete REST API documentation including:
- All available endpoints with HTTP verbs
- Request/response schemas
- Authentication requirements
- Database schema details

