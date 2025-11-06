# Udacity Full-Stack Deployment Project

## Project Overview

This is a full-stack e-commerce web application (MyStore) built with **Angular 17** (frontend) and **Node.js/Express** (backend). The application is deployed on AWS infrastructure using a fully automated CI/CD pipeline powered by CircleCI.

### Technology Stack

- **Frontend**: Angular 17.3.0, TypeScript, HTML5, CSS3
- **Backend**: Node.js 20.19.5, Express.js, TypeScript 5.4.2
- **Database**: PostgreSQL (AWS RDS)
- **Cloud Infrastructure**: 
  - AWS S3 (frontend hosting)
  - AWS CloudFront (CDN)
  - AWS Elastic Beanstalk (backend hosting)
  - AWS RDS PostgreSQL (database)
- **CI/CD**: CircleCI
- **Testing**: Jasmine, Karma, Puppeteer
- **Version Control**: Git/GitHub

## Application Features

**MyStore E-commerce Platform:**

- Product catalog with detailed product pages
- Shopping cart functionality
- Order management system
- User authentication with JWT
- RESTful API with Express.js
- Responsive Angular SPA
- Database migrations with sample data
- Comprehensive unit test coverage (102 tests total)

## Architecture

The application follows a three-tier architecture:

1. **Presentation Layer**: Angular 17 SPA hosted on AWS S3 with CloudFront CDN for global content delivery
2. **Application Layer**: Node.js/Express RESTful API hosted on AWS Elastic Beanstalk (Node.js 20 on Amazon Linux 2023)
3. **Data Layer**: PostgreSQL database hosted on AWS RDS with automated migrations

**Key Infrastructure Components:**
- **S3 Bucket**: `udacity-web-app` (static website hosting)
- **CloudFront Distribution**: `E2R5142O5YUCP` (CDN with cache invalidation)
- **Elastic Beanstalk**: `mystore-udacity` environment
- **RDS Database**: `udacity-app` (PostgreSQL 16.3)

For detailed architecture information, see [docs/Infrastructure_description.md](docs/Infrastructure_description.md) and [docs/architecture_diagram.md](docs/architecture_diagram.md).

## Deployment Pipeline

The CI/CD pipeline is fully automated with CircleCI and includes:

1. **Build & Test Phase**: 
   - `udacity-web-app`: Run 81 Angular unit tests + production build
   - `udacity-web-api`: Run 21 backend unit tests + TypeScript compilation
   - Parallel execution for faster feedback
2. **Manual Approval Gate**: `hold-for-approval` job prevents accidental production deployments
3. **Deploy Phase**:
   - `deploy-frontend`: Deploy to S3 + invalidate CloudFront cache
   - `deploy-backend`: Deploy to Elastic Beanstalk + run database migrations via platform hooks

**Platform Hooks (Elastic Beanstalk):**
- `.platform/hooks/prebuild/01_install_build_deps.sh`: Install all dependencies
- `.platform/hooks/prebuild/02_build_typescript.sh`: Compile TypeScript to dist/
- `.platform/hooks/prebuild/04_run_migrations.sh`: Run database migrations (idempotent)
- `.platform/hooks/prebuild/03_prune_deps.sh`: Remove devDependencies

For detailed pipeline information, see [docs/Pipeline_description.md](docs/Pipeline_description.md) and [docs/pipeline_diagram.md](docs/pipeline_diagram.md).

## Live Application

🌐 **Frontend Application**: 
- S3 Website: `http://udacity-web-app.s3-website-us-east-1.amazonaws.com`
- CloudFront CDN: `https://d3xxxxxxxxx.cloudfront.net` (Distribution ID: E2R5142O5YUCP)

🔗 **Backend API**: 
- `http://mystore-udacity.us-east-1.elasticbeanstalk.com`
- Health Check: `http://mystore-udacity.us-east-1.elasticbeanstalk.com/health`

💾 **Database**: 
- `udacity-app.c5y4doddjbye.us-east-1.rds.amazonaws.com:5432`
- Engine: PostgreSQL 16.3

## Screenshots

All deployment and infrastructure screenshots are located in the `screenshots/` folder. See [screenshots/README.md](screenshots/README.md) for guidance on capturing required screenshots.

### Required Screenshots for Udacity Submission:

1. **CircleCI Build** - Successful test execution (81 + 21 tests passing)
2. **CircleCI Hold** - Manual approval gate
3. **CircleCI Deploy** - Successful deployment to AWS
4. **AWS RDS** - Database status and configuration
5. **AWS Elastic Beanstalk** - Backend environment health (Green status)
6. **AWS S3** - Frontend files at bucket root
7. **AWS CloudFront** - CDN distribution configuration

## Project Structure

```
udacity-circleci-fullstack/
├── .circleci/
│   └── config.yml                    # CircleCI pipeline (747 lines)
├── testing/                          # Angular testing project
│   ├── src/
│   ├── karma.conf.js
│   └── package.json                  # 3 unit tests
├── web-app/                          # Angular 17 frontend (MyStore)
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/          # Cart, Checkout, Product components
│   │   │   ├── models/              # TypeScript models
│   │   │   └── services/            # Cart, Product, Notification services
│   │   ├── assets/
│   │   └── index.html
│   ├── angular.json
│   ├── karma.conf.js
│   └── package.json                  # 81 unit tests
├── web-api/                          # Node.js/Express backend
│   ├── src/
│   │   ├── routes/                  # orders, products, users
│   │   ├── models/                  # Database models
│   │   ├── middleware/              # JWT authentication
│   │   └── server.ts                # Express app entry point
│   ├── migrations/
│   │   └── sql/                     # Database migration scripts
│   ├── scripts/
│   │   └── run_migrations.js        # Migration runner
│   ├── .platform/
│   │   └── hooks/
│   │       └── prebuild/            # EB deployment hooks
│   ├── database.json                # db-migrate configuration
│   ├── tsconfig.json
│   └── package.json                  # 21 unit tests
├── docs/                            # Udacity required documentation
│   ├── architecture_diagram.md
│   ├── pipeline_diagram.md
│   ├── Infrastructure_description.md
│   ├── Pipeline_description.md
│   ├── Application_dependencies.md
│   └── AWS_SETUP_GUIDE.md           # Complete AWS setup instructions
├── screenshots/                     # Deployment evidence
│   └── README.md                    # Screenshot requirements
├── package.json                     # Workspace scripts
└── README.md                        # This file
```

## Getting Started

### Prerequisites

- Node.js v20.19.5 or higher
- npm v10+ 
- PostgreSQL 16+ (for local development)
- AWS CLI configured with appropriate credentials
- CircleCI account connected to GitHub repository
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/mukeshsony/udacity-circleci-fullstack.git
   cd udacity-circleci-fullstack
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```
   This installs dependencies for both `web-app` and `web-api`.

3. **Set up environment variables**
   
   Create `web-api/.env`:
   ```env
   PORT=8080
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432
   POSTGRES_DB=mystore_db
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=your_local_password
   JWT_SECRET=your_local_jwt_secret_here
   BCRYPT_PASSWORD=your_bcrypt_pepper_here
   SALT_ROUNDS=10
   ```
   
   Create `web-app/src/environments/environment.ts`:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:8080'
   };
   ```

4. **Set up local database**
   ```bash
   # Create database
   createdb mystore_db
   
   # Run migrations
   cd web-api
   npm run db:migrate
   ```

5. **Run the application**
   
   Terminal 1 (Backend):
   ```bash
   npm run backend:start
   # Backend runs on http://localhost:8080
   ```
   
   Terminal 2 (Frontend):
   ```bash
   npm run frontend:start
   # Frontend runs on http://localhost:4200
   ```

### Running Tests

```bash
# Run all tests (frontend + backend)
npm run test:all

# Run frontend tests only (81 tests)
cd web-app
npm run test

# Run backend tests only (21 tests)
cd web-api
npm run test

# Run tests in CI mode (headless)
cd web-app
npm run test:ci
```

**Test Coverage:**
- **Frontend (web-app)**: 81 unit tests using Jasmine/Karma with ChromeHeadless
- **Backend (web-api)**: 21 unit tests using Jasmine
- **Testing project**: 3 unit tests
- **Total**: 105 tests

## Deployment

### Automated Deployment (via CircleCI)

**Workflow:**
1. **Push to main branch** → Triggers CircleCI pipeline
2. **Build & Test Phase** → Runs all 102 tests in parallel
3. **Manual Approval** → Click "Approve" in CircleCI dashboard
4. **Deploy Phase** → Automatic deployment to AWS

**What happens during deployment:**
- Frontend: Build → Upload to S3 → Invalidate CloudFront cache
- Backend: Build TypeScript → Deploy to Elastic Beanstalk → Run migrations → Start app

### Manual Deployment

#### Deploy Frontend to S3

```bash
cd web-app
npm run build
aws s3 sync dist/mystore-angular/browser/ s3://udacity-web-app --delete
aws cloudfront create-invalidation --distribution-id E2R5142O5YUCP --paths "/*"
```

#### Deploy Backend to Elastic Beanstalk

```bash
cd web-api
npm run build
eb deploy mystore-udacity
```

### First-Time AWS Setup

See [docs/AWS_SETUP_GUIDE.md](docs/AWS_SETUP_GUIDE.md) for complete instructions on:
- Creating IAM roles and users
- Setting up S3 bucket with static website hosting
- Creating RDS PostgreSQL database
- Configuring Elastic Beanstalk environment
- Setting up CloudFront distribution
- Configuring CircleCI environment variables

## Environment Variables

### CircleCI Environment Variables

Configure the following in CircleCI Project Settings → Environment Variables:

**AWS Credentials:**
- `AWS_ACCESS_KEY_ID`: IAM user access key with deployment permissions
- `AWS_SECRET_ACCESS_KEY`: IAM user secret key
- `AWS_DEFAULT_REGION`: `us-east-1`

**Frontend Deployment:**
- `AWS_S3_BUCKET`: `udacity-web-app`
- `CLOUDFRONT_DISTRIBUTION_ID`: `E2R5142O5YUCP`

**Backend Deployment:**
- `EB_APP_NAME`: `udacity-backend`
- `EB_ENV_NAME`: `mystore-udacity`

**Database Configuration:**
- `POSTGRES_HOST`: RDS endpoint
- `POSTGRES_PORT`: `5432`
- `POSTGRES_DB`: Database name
- `POSTGRES_USER`: Master username
- `POSTGRES_PASSWORD`: Master password (masked)

**Application Secrets:**
- `JWT_SECRET`: Secret key for JWT token generation (masked)
- `BCRYPT_PASSWORD`: Pepper for password hashing (masked)
- `SALT_ROUNDS`: `10`

### Elastic Beanstalk Environment Properties

Set in EB Console → Configuration → Software → Environment properties:
- All `POSTGRES_*` variables
- `JWT_SECRET`
- `BCRYPT_PASSWORD`
- `SALT_ROUNDS`
- `PORT`: `8080`

## Documentation

- [Architecture Diagram](docs/architecture_diagram.md) - Infrastructure diagram
- [Pipeline Diagram](docs/pipeline_diagram.md) - CI/CD workflow diagram
- [Infrastructure Description](docs/Infrastructure_description.md) - AWS services overview
- [Pipeline Description](docs/Pipeline_description.md) - CircleCI pipeline details
- [Application Dependencies](docs/Application_dependencies.md) - All project dependencies
- [AWS Setup Guide](docs/AWS_SETUP_GUIDE.md) - Complete AWS infrastructure setup

## Database Schema

**Tables:**
- `users` - User accounts with authentication
- `products` - Product catalog
- `orders` - Customer orders
- `order_products` - Order line items (many-to-many)

See `web-api/migrations/sql/` for detailed schema definitions.

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## Stand Out Features Implemented

✅ **Comprehensive Testing**
- 105 total unit tests across all projects
- Frontend: 81 tests with Karma/Jasmine
- Backend: 21 tests with Jasmine
- All tests run in CI environment with ChromeHeadless

✅ **Advanced CI/CD Pipeline**
- Parallel test execution for faster feedback
- Manual approval gate for production safety
- Automated CloudFront cache invalidation
- Zero-downtime deployments via Elastic Beanstalk

✅ **Infrastructure as Code**
- Platform hooks for Elastic Beanstalk deployment
- Automated database migrations on deployment
- Environment-specific configuration management

✅ **Production-Ready Features**
- JWT-based authentication
- Password hashing with bcrypt
- Database connection pooling
- TypeScript for type safety
- Comprehensive error handling
- Security best practices (no secrets in repository)

✅ **AWS Best Practices**
- CloudFront CDN for global performance
- RDS automated backups and Multi-AZ option
- Elastic Beanstalk auto-scaling capability
- S3 static website hosting with versioning

## Troubleshooting

### Common Issues

**1. CircleCI Build Failures**
- Check test output in CircleCI logs
- Verify all environment variables are set
- Ensure npm dependencies are installed correctly
- For Chrome/Karma issues: Check puppeteer configuration in `karma.conf.js`

**2. Deployment Failures**

*Frontend (S3):*
- Verify AWS credentials have S3 write permissions
- Check bucket name is correct: `udacity-web-app`
- Ensure build output path is `dist/mystore-angular/browser/`

*Backend (Elastic Beanstalk):*
- Check EB logs: `eb logs` or AWS Console → Elastic Beanstalk → Logs
- Verify TypeScript compilation: Check `.platform/hooks/prebuild/02_build_typescript.sh`
- Check Node.js version matches: 20.19.5
- Verify package.json main entry: `dist/src/server.js`

**3. Database Connection Issues**
- Check RDS security group allows inbound on port 5432
- Verify VPC configuration (EB and RDS in same VPC)
- Test connection: `psql -h <RDS_ENDPOINT> -U postgres -d mystore_db`
- Check environment variables in EB Configuration

**4. Migration Failures**
- Migrations run via `.platform/hooks/prebuild/04_run_migrations.sh`
- Check EB logs for migration output
- Migrations are idempotent (safe to run multiple times)
- Manual run: SSH to EB instance and run `npm run db:migrate`

**5. CloudFront Cache Issues**
- Invalidation takes 5-15 minutes to propagate
- Force refresh: Clear browser cache + new incognito window
- Check invalidation status in CloudFront console

### Getting Help

- Check [docs/AWS_SETUP_GUIDE.md](docs/AWS_SETUP_GUIDE.md) for setup instructions
- Review CircleCI build logs for specific error messages
- Verify all environment variables match between CircleCI and EB
- Check AWS service health dashboards

## Contributing

This is a Udacity Full Stack JavaScript Developer Nanodegree project submission.

If you'd like to suggest improvements:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Make your changes with tests
4. Commit your changes (`git commit -m 'Add improvement'`)
5. Push to the branch (`git push origin feature/improvement`)
6. Open a Pull Request

## License

[MIT](LICENSE)

## Acknowledgments

- **Udacity Full Stack JavaScript Developer Nanodegree** - Project requirements and guidance
- **AWS** - Cloud infrastructure platform
- **CircleCI** - CI/CD platform
- **Angular Team** - Frontend framework
- **Node.js & Express** - Backend framework

## Project Status

✅ **Production Ready** - Fully deployed and operational

**Last Updated**: November 6, 2025

**GitHub Repository**: [github.com/mukeshsony/udacity-circleci-fullstack](https://github.com/mukeshsony/udacity-circleci-fullstack)

**CircleCI**: Connected and running automated deployments
