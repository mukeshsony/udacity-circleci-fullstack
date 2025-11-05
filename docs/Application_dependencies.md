# Application Dependencies

This document provides a comprehensive list of all dependencies required for the full-stack application, including frontend (Angular), backend (Node.js), and infrastructure components.

---

## Frontend Dependencies (Angular)

### Production Dependencies

Located in `frontend/package.json`

#### Core Framework

| Package | Version | Purpose |
|---------|---------|---------|
| `@angular/animations` | ^17.0.0 | Animation framework for Angular |
| `@angular/common` | ^17.0.0 | Common Angular services and directives |
| `@angular/compiler` | ^17.0.0 | Angular template compiler |
| `@angular/core` | ^17.0.0 | Core Angular framework |
| `@angular/forms` | ^17.0.0 | Form handling and validation |
| `@angular/platform-browser` | ^17.0.0 | Browser-specific functionality |
| `@angular/platform-browser-dynamic` | ^17.0.0 | Dynamic compilation support |
| `@angular/router` | ^17.0.0 | Client-side routing |

#### UI Components & Styling

| Package | Version | Purpose |
|---------|---------|---------|
| `@angular/material` | ^17.0.0 | Material Design components |
| `@angular/cdk` | ^17.0.0 | Component Dev Kit for custom components |
| `bootstrap` | ^5.3.0 | CSS framework (if used) |
| `@fortawesome/angular-fontawesome` | ^0.14.0 | Font Awesome icons |
| `@fortawesome/fontawesome-svg-core` | ^6.5.0 | Font Awesome core |
| `@fortawesome/free-solid-svg-icons` | ^6.5.0 | Font Awesome solid icons |

#### HTTP & State Management

| Package | Version | Purpose |
|---------|---------|---------|
| `@angular/common/http` | ^17.0.0 | HTTP client for API calls |
| `rxjs` | ^7.8.0 | Reactive extensions for async operations |
| `@ngrx/store` | ^17.0.0 | State management (if used) |
| `@ngrx/effects` | ^17.0.0 | Side effects for NgRx (if used) |

#### Authentication & Security

| Package | Version | Purpose |
|---------|---------|---------|
| `@auth0/angular-jwt` | ^5.2.0 | JWT authentication helper |
| `angular-oauth2-oidc` | ^15.0.0 | OAuth2/OIDC authentication (if used) |

#### Utilities

| Package | Version | Purpose |
|---------|---------|---------|
| `tslib` | ^2.6.0 | TypeScript runtime library |
| `zone.js` | ^0.14.0 | Zone support for Angular change detection |
| `lodash` | ^4.17.21 | Utility functions |
| `moment` | ^2.29.4 | Date/time manipulation |
| `uuid` | ^9.0.0 | UUID generation |

### Development Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@angular-devkit/build-angular` | ^17.0.0 | Angular build tools |
| `@angular/cli` | ^17.0.0 | Angular command-line interface |
| `@angular/compiler-cli` | ^17.0.0 | Angular compiler for build |
| `typescript` | ~5.2.0 | TypeScript compiler |

#### Testing

| Package | Version | Purpose |
|---------|---------|---------|
| `@angular/testing` | ^17.0.0 | Angular testing utilities |
| `karma` | ^6.4.0 | Test runner |
| `karma-chrome-launcher` | ^3.2.0 | Chrome launcher for Karma |
| `karma-coverage` | ^2.2.0 | Code coverage reporter |
| `karma-jasmine` | ^5.1.0 | Jasmine adapter for Karma |
| `karma-jasmine-html-reporter` | ^2.1.0 | HTML reporter for Karma |
| `jasmine-core` | ^5.1.0 | Jasmine testing framework |
| `@types/jasmine` | ^5.1.0 | TypeScript types for Jasmine |

#### Linting & Code Quality

| Package | Version | Purpose |
|---------|---------|---------|
| `eslint` | ^8.53.0 | JavaScript/TypeScript linter |
| `@typescript-eslint/parser` | ^6.10.0 | TypeScript parser for ESLint |
| `@typescript-eslint/eslint-plugin` | ^6.10.0 | TypeScript rules for ESLint |
| `@angular-eslint/builder` | ^17.0.0 | Angular-specific ESLint builder |
| `@angular-eslint/eslint-plugin` | ^17.0.0 | Angular-specific ESLint rules |
| `prettier` | ^3.0.0 | Code formatter |

#### Type Definitions

| Package | Version | Purpose |
|---------|---------|---------|
| `@types/node` | ^20.9.0 | Node.js type definitions |
| `@types/lodash` | ^4.14.200 | Lodash type definitions |

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
