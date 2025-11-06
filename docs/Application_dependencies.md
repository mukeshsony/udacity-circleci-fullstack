# Application Dependencies

This document lists all the essential dependencies and software required to build, run, and deploy the MyStore application.

---

## What Does This Application Depend On?

### Core Runtime Dependencies

These are the "bigger" essential elements that the application cannot run without:

#### 1. **Node.js** (v20.19.5 or higher)

**Purpose**: JavaScript runtime environment for both development and production

**Why We Need It**:
- Runs the backend Express.js server
- Executes build scripts for frontend and backend
- Required to install all other dependencies via npm
- Provides the V8 JavaScript engine

**Where It's Used**:
- Backend API server runtime
- Frontend build process (Angular CLI)
- CircleCI build environment
- Elastic Beanstalk production environment

---

#### 2. **npm (Node Package Manager)** (v10.0.0 or higher)

**Purpose**: Package manager for installing and managing dependencies

**Why We Need It**:
- Installs all frontend and backend dependencies
- Manages package versions and dependencies
- Runs build, test, and deploy scripts
- Cannot install any other dependencies without it

**What It Installs**:
- 1000+ packages for frontend (Angular, testing tools, etc.)
- 100+ packages for backend (Express, database drivers, etc.)

---

#### 3. **PostgreSQL** (Database Software v16.3 or higher)

**Purpose**: Relational database management system

**Why We Need It**:
- Stores all application data persistently
- Manages user accounts, products, orders
- Provides ACID-compliant transactions
- Handles complex relational queries

**Where It's Used**:
- Development: Local PostgreSQL installation
- Production: AWS RDS PostgreSQL instance

**Database Driver**:
- `pg` npm package - PostgreSQL client for Node.js
- `db-migrate` - Database migration tool

---

#### 4. **TypeScript** (v5.4.2)

**Purpose**: Programming language and compiler

**Why We Need It**:
- Backend code is written in TypeScript
- Frontend (Angular) is written in TypeScript
- Provides type safety and better tooling
- Compiles to JavaScript for execution

**What It Compiles**:
- Backend: `src/**/*.ts` → `dist/src/**/*.js`
- Frontend: Angular TypeScript → JavaScript bundles

---

### Frontend Framework Dependencies

#### 5. **Angular** (v17.3.0)

**Purpose**: Frontend framework for building the user interface

**Why We Need It**:
- Provides the entire frontend architecture
- Manages component-based UI
- Handles routing, forms, HTTP requests
- Cannot build the frontend without it

**Core Angular Packages** (all v17.3.0):
- `@angular/core` - Core framework
- `@angular/common` - Common services and directives
- `@angular/router` - Client-side routing
- `@angular/forms` - Form handling
- `@angular/platform-browser` - Browser support

**Angular CLI**:
- `@angular/cli` - Command-line tools for building and serving

---

#### 6. **RxJS** (v7.8.1)

**Purpose**: Reactive programming library

**Why We Need It**:
- Required by Angular for handling async operations
- Manages HTTP requests and responses
- Handles event streams
- Cannot use Angular without it

---

### Backend Framework Dependencies

#### 7. **Express.js** (v4.18.2)

**Purpose**: Web application framework for Node.js

**Why We Need It**:
- Provides the web server framework
- Handles HTTP routing and middleware
- Manages API endpoints
- Cannot build the backend API without it

**Related Packages**:
- `body-parser` - Parse request bodies
- `cors` - Enable Cross-Origin Resource Sharing
- `helmet` - Security middleware

---

#### 8. **bcrypt** (v5.1.1)

**Purpose**: Password hashing library

**Why We Need It**:
- Securely hashes user passwords
- Prevents storing plain-text passwords
- Provides salt generation
- Essential for authentication security

---

#### 9. **jsonwebtoken** (v9.0.2)

**Purpose**: JWT token generation and verification

**Why We Need It**:
- Creates authentication tokens
- Verifies user identity
- Manages session security
- Required for API authentication

---

### Testing Dependencies

#### 10. **Jasmine** (v5.1.0)

**Purpose**: Testing framework

**Why We Need It**:
- Provides test structure (describe, it, expect)
- Runs unit tests for both frontend and backend
- 102 total unit tests depend on it
- Cannot run tests without it

---

#### 11. **Karma** (v6.4.3)

**Purpose**: Test runner for browser-based tests

**Why We Need It**:
- Runs Angular tests in browser environment
- Executes 81 frontend unit tests
- Integrates with ChromeHeadless for CI
- Required for Angular testing

**Related Packages**:
- `karma-jasmine` - Jasmine adapter for Karma
- `karma-chrome-launcher` - Chrome browser launcher
- `puppeteer` - Headless Chrome for CI environment

---

### Build Tools

#### 12. **Webpack** (Bundled with Angular CLI)

**Purpose**: Module bundler

**Why We Need It**:
- Bundles all frontend files into optimized packages
- Minifies and optimizes code for production
- Handles asset loading (images, fonts, CSS)
- Automatically included with Angular CLI

---

### Database Migration Tools

#### 13. **db-migrate** (v0.11.14)

**Purpose**: Database schema migration tool

**Why We Need It**:
- Manages database schema changes
- Runs SQL migration scripts
- Tracks which migrations have been applied
- Ensures database structure is correct

**Migration Files**:
- `001_create_users.sql`
- `002_create_products.sql`
- `003_create_orders.sql`
- `004_create_order_products.sql`
- `010_seed_sample_data.sql`

---

### Development Tools

#### 14. **Git** (v2.40.0 or higher)

**Purpose**: Version control system

**Why We Need It**:
- Tracks code changes
- Enables collaboration
- Triggers CI/CD pipeline via GitHub
- Cannot deploy without it

---

#### 15. **AWS CLI** (v2.0 or higher)

**Purpose**: Command-line interface for AWS services

**Why We Need It**:
- Deploys frontend to S3
- Manages AWS resources
- Used in CircleCI deployment pipeline
- Cannot deploy to AWS without it

---

#### 16. **EB CLI (Elastic Beanstalk CLI)** (v3.20.0 or higher)

**Purpose**: Command-line interface for Elastic Beanstalk

**Why We Need It**:
- Deploys backend to Elastic Beanstalk
- Sets environment variables (`eb setenv`)
- Manages EB environments
- Cannot deploy backend without it

---

## Complete Dependency Summary

### Essential Software (Cannot Run Without):
1. ✅ **Node.js** - Runtime for everything
2. ✅ **npm** - Install dependencies
3. ✅ **PostgreSQL** - Database software
4. ✅ **TypeScript** - Compile source code
5. ✅ **Angular** - Frontend framework
6. ✅ **Express.js** - Backend framework

### Development Tools (Cannot Build/Deploy Without):
7. ✅ **Angular CLI** - Build frontend
8. ✅ **Jasmine & Karma** - Run tests
9. ✅ **db-migrate** - Manage database
10. ✅ **AWS CLI** - Deploy to S3
11. ✅ **EB CLI** - Deploy to Elastic Beanstalk
12. ✅ **Git** - Version control

### Security & Authentication (Cannot Secure Without):
13. ✅ **bcrypt** - Hash passwords
14. ✅ **jsonwebtoken** - Authenticate users

---

## How Dependencies Are Managed

### Frontend (web-app/package.json)
```json
{
  "dependencies": {
    "@angular/core": "^17.3.0",
    "@angular/common": "^17.3.0",
    "rxjs": "~7.8.0"
  },
  "devDependencies": {
    "@angular/cli": "^17.3.0",
    "karma": "~6.4.0",
    "jasmine-core": "~5.1.0"
  }
}
```

### Backend (web-api/package.json)
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.3",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2"
  },
  "devDependencies": {
    "typescript": "^5.4.2",
    "jasmine": "^5.1.0",
    "db-migrate": "^0.11.14"
  }
}
```

---

## Installation Commands

```bash
# Install all dependencies
npm run install:all

# Or install individually
cd web-app && npm install
cd web-api && npm install
```

---

**Note**: All dependencies are listed in their respective `package.json` files with exact versions to ensure consistent builds across environments.

---

## Backend Dependencies (Node.js/Express)

### Production Dependencies

Located in `backend/package.json`

#### Core Framework

| Package | Version | Purpose |
|---------|---------|---------|
| `express` | ^4.18.2 | Web application framework |
| `cors` | ^2.8.5 | Cross-Origin Resource Sharing |
| `helmet` | ^7.1.0 | Security middleware |
| `compression` | ^1.7.4 | Response compression |
| `dotenv` | ^16.3.1 | Environment variable management |

#### Database & ORM

| Package | Version | Purpose |
|---------|---------|---------|
| `pg` | ^8.11.3 | PostgreSQL client |
| `pg-hstore` | ^2.3.4 | PostgreSQL hstore support |
| `typeorm` | ^0.3.17 | TypeScript ORM for database |
| `sequelize` | ^6.35.0 | Alternative ORM (if used) |
| `reflect-metadata` | ^0.1.13 | Metadata reflection for TypeORM |

#### Authentication & Security

| Package | Version | Purpose |
|---------|---------|---------|
| `jsonwebtoken` | ^9.0.2 | JWT token generation/verification |
| `bcrypt` | ^5.1.1 | Password hashing |
| `passport` | ^0.7.0 | Authentication middleware |
| `passport-jwt` | ^4.0.1 | JWT strategy for Passport |
| `passport-local` | ^1.0.0 | Local strategy for Passport |
| `express-validator` | ^7.0.1 | Request validation |

#### Logging & Monitoring

| Package | Version | Purpose |
|---------|---------|---------|
| `winston` | ^3.11.0 | Logging library |
| `morgan` | ^1.10.0 | HTTP request logger |
| `@aws-sdk/client-cloudwatch-logs` | ^3.450.0 | CloudWatch logs integration |

#### AWS SDK

| Package | Version | Purpose |
|---------|---------|---------|
| `@aws-sdk/client-s3` | ^3.450.0 | S3 client (if needed) |
| `@aws-sdk/client-secrets-manager` | ^3.450.0 | Secrets Manager integration |
| `@aws-sdk/client-ses` | ^3.450.0 | Simple Email Service (if used) |

#### Utilities

| Package | Version | Purpose |
|---------|---------|---------|
| `lodash` | ^4.17.21 | Utility functions |
| `uuid` | ^9.0.1 | UUID generation |
| `dayjs` | ^1.11.10 | Date/time library |
| `axios` | ^1.6.2 | HTTP client for external APIs |
| `joi` | ^17.11.0 | Schema validation |

#### Email (Optional)

| Package | Version | Purpose |
|---------|---------|---------|
| `nodemailer` | ^6.9.7 | Email sending |
| `handlebars` | ^4.7.8 | Email template engine |

### Development Dependencies

#### TypeScript

| Package | Version | Purpose |
|---------|---------|---------|
| `typescript` | ^5.2.2 | TypeScript compiler |
| `ts-node` | ^10.9.1 | TypeScript execution for Node.js |
| `ts-node-dev` | ^2.0.0 | TypeScript development server |
| `@types/node` | ^20.9.0 | Node.js type definitions |
| `@types/express` | ^4.17.21 | Express type definitions |
| `@types/cors` | ^2.8.17 | CORS type definitions |
| `@types/bcrypt` | ^5.0.2 | Bcrypt type definitions |
| `@types/jsonwebtoken` | ^9.0.5 | JWT type definitions |
| `@types/passport` | ^1.0.16 | Passport type definitions |
| `@types/passport-jwt` | ^3.0.13 | Passport JWT type definitions |
| `@types/morgan` | ^1.9.9 | Morgan type definitions |
| `@types/lodash` | ^4.14.200 | Lodash type definitions |

#### Testing

| Package | Version | Purpose |
|---------|---------|---------|
| `jest` | ^29.7.0 | Testing framework |
| `ts-jest` | ^29.1.1 | TypeScript preprocessor for Jest |
| `@types/jest` | ^29.5.8 | Jest type definitions |
| `supertest` | ^6.3.3 | HTTP assertion library |
| `@types/supertest` | ^2.0.16 | Supertest type definitions |

#### Linting & Code Quality

| Package | Version | Purpose |
|---------|---------|---------|
| `eslint` | ^8.53.0 | JavaScript/TypeScript linter |
| `@typescript-eslint/parser` | ^6.10.0 | TypeScript parser for ESLint |
| `@typescript-eslint/eslint-plugin` | ^6.10.0 | TypeScript rules for ESLint |
| `prettier` | ^3.0.3 | Code formatter |
| `eslint-config-prettier` | ^9.0.0 | Prettier config for ESLint |

#### Build & Development

| Package | Version | Purpose |
|---------|---------|---------|
| `nodemon` | ^3.0.1 | Development server with auto-restart |
| `concurrently` | ^8.2.2 | Run multiple commands concurrently |
| `cross-env` | ^7.0.3 | Cross-platform environment variables |

---

## Infrastructure Dependencies

### CI/CD Pipeline

#### CircleCI Orbs

| Orb | Version | Purpose |
|-----|---------|---------|
| `circleci/node` | 5.1.0 | Node.js build environment |
| `circleci/aws-cli` | 4.0.0 | AWS CLI installation |
| `circleci/aws-elastic-beanstalk` | 2.0.1 | Elastic Beanstalk deployment |

### AWS CLI & Tools

| Tool | Version | Purpose |
|------|---------|---------|
| `aws-cli` | 2.x | AWS command-line interface |
| `eb-cli` | 3.x | Elastic Beanstalk CLI |

---

## System Requirements

### Development Environment

#### Required Software

| Software | Minimum Version | Recommended Version |
|----------|----------------|---------------------|
| Node.js | 18.0.0 | 18.17.0 |
| npm | 9.0.0 | 9.8.0 |
| PostgreSQL | 14.0 | 14.x or 15.x |
| Git | 2.30 | Latest |

#### Operating System

- **Windows**: Windows 10 or later
- **macOS**: macOS 11 (Big Sur) or later
- **Linux**: Ubuntu 20.04 LTS or later, or equivalent

#### IDE / Editor (Recommended)

- **Visual Studio Code** with extensions:
  - Angular Language Service
  - ESLint
  - Prettier
  - GitLens
  - Docker (optional)

### Production Environment

#### AWS Services

| Service | Configuration |
|---------|--------------|
| **EC2** | t3.medium or larger |
| **RDS** | db.t3.medium, PostgreSQL 14+ |
| **S3** | Standard storage class |
| **CloudFront** | Standard distribution |
| **Elastic Beanstalk** | Node.js 18 platform |

#### Node.js Runtime

- **Version**: Node.js 18.x (LTS)
- **Architecture**: x64
- **Platform**: Amazon Linux 2

---

## Database Schema Requirements

### PostgreSQL Extensions

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
```

### Connection Pool Settings

```javascript
{
  max: 20,              // Maximum connections
  min: 5,               // Minimum connections
  idle: 10000,          // Idle timeout (ms)
  acquire: 30000,       // Acquire timeout (ms)
  evict: 1000          // Eviction interval (ms)
}
```

---

## Environment Variables

### Frontend (.env)

```bash
# API Configuration
API_URL=https://api.yourdomain.com
API_TIMEOUT=30000

# Feature Flags
ENABLE_ANALYTICS=true
ENABLE_DEBUG_MODE=false

# Environment
NODE_ENV=production
```

### Backend (.env)

```bash
# Server Configuration
NODE_ENV=production
PORT=8080
HOST=0.0.0.0

# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname
DB_POOL_MAX=20
DB_POOL_MIN=5

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRATION=7d
BCRYPT_ROUNDS=10

# AWS
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name

# CORS
CORS_ORIGIN=https://yourdomain.com

# Logging
LOG_LEVEL=info
```

---

## Package Management

### NPM Scripts

#### Frontend (package.json)

```json
{
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build --configuration production",
    "test": "ng test",
    "test:ci": "ng test --watch=false --browsers=ChromeHeadless --code-coverage",
    "lint": "ng lint",
    "e2e": "ng e2e"
  }
}
```

#### Backend (package.json)

```json
{
  "scripts": {
    "start": "node dist/server.js",
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "tsc",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint . --ext .ts",
    "lint:fix": "eslint . --ext .ts --fix"
  }
}
```

---

## Dependency Update Strategy

### Regular Updates

- **Patch Updates**: Weekly (automated via Dependabot)
- **Minor Updates**: Monthly (with testing)
- **Major Updates**: Quarterly (with thorough testing)

### Security Updates

- **Critical**: Immediate
- **High**: Within 7 days
- **Medium**: Within 30 days
- **Low**: Next regular update cycle

### Tools for Dependency Management

- **Dependabot**: Automated dependency updates
- **npm audit**: Security vulnerability scanning
- **npm outdated**: Check for outdated packages

---

## License Information

### Open Source Licenses Used

- **MIT License**: Most npm packages
- **Apache 2.0**: Some AWS SDK packages
- **ISC License**: Some utility packages

### License Compliance

All dependencies are compatible with commercial use. Review individual package licenses for specific terms.

---

## Installation Instructions

### Fresh Installation

```bash
# Clone repository
git clone <repository-url>
cd <project-directory>

# Install all dependencies
npm run install:all

# Or install separately
cd frontend && npm install
cd ../backend && npm install
```

### CI/CD Installation

Dependencies are automatically installed during the CircleCI build phase.

---

## Dependency Size Analysis

### Frontend Bundle Size

- **Initial Bundle**: ~500KB (gzipped)
- **Lazy-loaded Modules**: ~100-200KB each
- **Total node_modules**: ~300MB

### Backend Dependencies

- **Production node_modules**: ~150MB
- **Dev node_modules**: ~400MB

---

## Troubleshooting

### Common Issues

**1. npm install fails**
```bash
# Clear cache and retry
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**2. TypeScript compilation errors**
```bash
# Ensure correct TypeScript version
npm install typescript@~5.2.0
```

**3. Peer dependency warnings**
```bash
# Use --legacy-peer-deps flag
npm install --legacy-peer-deps
```

---

## Additional Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [Angular Documentation](https://angular.io/docs)
- [Express.js Documentation](https://expressjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [AWS SDK Documentation](https://docs.aws.amazon.com/sdk-for-javascript/)

---

**Last Updated**: November 2025

**Dependency Audit Date**: November 2025

**Next Review**: February 2026
