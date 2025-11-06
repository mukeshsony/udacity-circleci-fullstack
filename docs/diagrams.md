# Project Diagrams

This document contains the infrastructure architecture and CI/CD pipeline diagrams for the Udacity Full-Stack Deployment Project.

---

## 1. Infrastructure Architecture Diagram

### Overview

The application follows a three-tier architecture deployed on AWS:

![Infrastructure Architecture](../screenshots/Flow%20diagram%201.png)

### Components

#### **Frontend Layer (Presentation)**
- **Amazon S3** (`udacity-web-app`): Hosts the Angular 17 static website
- **Amazon CloudFront** (Distribution ID: `E2R5142O5YUCP`): CDN for global content delivery and caching
- **Purpose**: Serves the compiled Angular application to end users worldwide

#### **Application Layer (Business Logic)**
- **AWS Elastic Beanstalk** (`mystore-udacity`): Manages the Node.js/Express API
  - Platform: Node.js 20 on Amazon Linux 2023
  - Auto-scaling EC2 instances
  - Application Load Balancer for traffic distribution
- **Purpose**: Processes business logic, authentication, and API requests

#### **Data Layer (Persistence)**
- **Amazon RDS PostgreSQL** (`udacity-app`): Managed relational database
  - Engine: PostgreSQL 16.3
  - Multi-AZ capability for high availability
  - Automated backups and snapshots
- **Purpose**: Stores users, products, orders, and order_products data

### Communication Flow

```
End User → CloudFront (CDN) → S3 (Angular App)
    ↓
API Request (HTTPS)
    ↓
Elastic Beanstalk (Node.js API)
    ↓
RDS PostgreSQL (Database)
```

**Data Flow:**
1. User accesses the application via browser
2. CloudFront serves cached Angular application from S3
3. Frontend makes API calls to Elastic Beanstalk endpoint
4. Load Balancer distributes requests to EC2 instances
5. Node.js API processes requests and queries RDS database
6. Response flows back through the layers to the user

### Security Features

- **VPC Isolation**: Private subnets for database and application
- **Security Groups**: Restricted access between components
- **HTTPS/TLS**: Encrypted communication at all layers
- **IAM Roles**: Principle of least privilege access
- **Environment Variables**: Secrets stored in EB configuration

---

## 2. CI/CD Pipeline Diagram

### Pipeline Overview

The CI/CD pipeline automates the build, test, and deployment process:

![CI/CD Pipeline - Phase 1](../screenshots/Flow%20diagram%202.png)

![CI/CD Pipeline - Phase 2](../screenshots/Flow%20diagram%203.png)

### Pipeline Stages

#### **Stage 1: Source Control**
```
Developer → git commit → git push → GitHub → Webhook → CircleCI
```
- Developer pushes code to GitHub repository
- GitHub webhook automatically triggers CircleCI pipeline
- Pipeline runs on push to `main` branch

#### **Stage 2: Build & Test (Parallel Execution)**

**Frontend Job (`udacity-web-app`):**
1. Checkout code from GitHub
2. Restore cached npm dependencies
3. Install dependencies (`npm ci`)
4. Run 81 unit tests with Karma/Jasmine
5. Build Angular application (`ng build --configuration=production`)
6. Save cache for future builds
7. Store build artifacts

**Backend Job (`udacity-web-api`):**
1. Checkout code from GitHub
2. Restore cached npm dependencies
3. Install dependencies (`npm ci`)
4. Run 21 unit tests with Jasmine
5. Compile TypeScript (`tsc`)
6. Save cache for future builds
7. Store build artifacts

**Both jobs run in parallel** to reduce total pipeline execution time.

#### **Stage 3: Manual Approval Gate**

```
┌──────────────────────────────┐
│   hold-for-approval          │
│   (Production Only)          │
│                              │
│   ⏸  Pipeline Paused         │
│   ✓ Approve / ✗ Reject       │
└──────────────────────────────┘
```

- **Purpose**: Prevent accidental production deployments
- **Who**: Team lead or authorized reviewer
- **Timeout**: 7 days
- **Actions**: Approve to continue, Reject to stop

#### **Stage 4: Deploy (Parallel Execution)**

**Frontend Deployment (`deploy-frontend`):**
1. Attach workspace with build artifacts
2. Configure AWS CLI with credentials
3. Sync files to S3 bucket
   - Delete old files
   - Upload new Angular build
4. Invalidate CloudFront cache
   - Clear CDN cache
   - Force fresh content delivery
5. Verify deployment success

**Backend Deployment (`deploy-backend`):**
1. Attach workspace with build artifacts
2. Configure AWS CLI with credentials
3. Initialize Elastic Beanstalk CLI
4. Set environment variables using `eb setenv`:
   - `POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_DB`
   - `POSTGRES_USER`, `POSTGRES_PASSWORD`
   - `JWT_SECRET`, `BCRYPT_PASSWORD`, `SALT_ROUNDS`
5. Deploy to Elastic Beanstalk environment
   - Upload application version to S3
   - Update environment with new version
   - Platform hooks run:
     - Install dependencies
     - Compile TypeScript
     - Run database migrations
     - Prune dev dependencies
6. Health check verification
7. Confirm deployment success

**Both deployments run in parallel** after approval.

#### **Stage 5: Post-Deployment**

- Health checks for both frontend and backend
- Smoke tests to verify functionality
- Deployment status updates
- Optional: Slack/Email notifications

### Environment Variables Flow

```
CircleCI Environment Variables
         ↓
    eb setenv command
         ↓
Elastic Beanstalk Configuration
         ↓
  Node.js Application (process.env)
```

### Pipeline Execution Time

| Stage                | Duration     |
|---------------------|--------------|
| Build Frontend      | 3-5 minutes  |
| Build Backend       | 2-4 minutes  |
| Manual Approval     | Variable     |
| Deploy Frontend     | 1-2 minutes  |
| Deploy Backend      | 3-5 minutes  |
| **Total (Auto)**    | **6-11 min** |

### Success Criteria

✅ All 102 tests pass (81 frontend + 21 backend)  
✅ Builds complete without errors  
✅ Deployments successful  
✅ Health checks pass  
✅ Applications accessible via endpoints

---

## 3. Complete End-to-End Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    DEVELOPMENT PHASE                        │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ git push
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                   SOURCE CONTROL (GitHub)                   │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ Webhook Trigger
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                  CI/CD PIPELINE (CircleCI)                  │
│                                                             │
│  Build & Test → Manual Approval → Deploy                   │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ Deployments
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                AWS INFRASTRUCTURE (Production)              │
│                                                             │
│  S3 + CloudFront  →  Elastic Beanstalk  →  RDS PostgreSQL  │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ HTTPS
                      ▼
              ┌──────────────┐
              │  End Users   │
              └──────────────┘
```

---

## Additional Resources

- **Architecture Details**: [Infrastructure_description.md](Infrastructure_description.md)
- **Pipeline Details**: [Pipeline_description.md](Pipeline_description.md)
- **Dependencies**: [Application_dependencies.md](Application_dependencies.md)
- **AWS Setup**: [AWS_SETUP_GUIDE.md](AWS_SETUP_GUIDE.md)

---

**Last Updated**: November 6, 2025  
**Project**: Udacity Full-Stack JavaScript Developer Nanodegree
