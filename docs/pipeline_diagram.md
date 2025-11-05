# CI/CD Pipeline Diagram

## Pipeline Overview Flow

```
┌──────────────────────────────────────────────────────────────────────┐
│                         Developer Workflow                           │
└──────────────┬───────────────────────────────────────────────────────┘
               │
               │ git push
               ▼
        ┌──────────────┐
        │    GitHub    │
        │  Repository  │
        └──────┬───────┘
               │
               │ Webhook Trigger
               ▼
        ┌──────────────────────────────────────────────────────────────┐
        │                        CircleCI                              │
        │                                                              │
        │  ┌───────────────────────────────────────────────────────┐  │
        │  │               PHASE 1: BUILD                          │  │
        │  │                                                       │  │
        │  │  ┌─────────────────────┐  ┌────────────────────────┐ │  │
        │  │  │  build-frontend     │  │  build-backend         │ │  │
        │  │  │                     │  │                        │ │  │
        │  │  │  1. Checkout code   │  │  1. Checkout code      │ │  │
        │  │  │  2. Restore cache   │  │  2. Restore cache      │ │  │
        │  │  │  3. npm install     │  │  3. npm install        │ │  │
        │  │  │  4. Run unit tests  │  │  4. Run unit tests     │ │  │
        │  │  │  5. Run linting     │  │  5. Run linting        │ │  │
        │  │  │  6. Build (ng)      │  │  6. Build (tsc)        │ │  │
        │  │  │  7. Save cache      │  │  7. Save cache         │ │  │
        │  │  │  8. Persist to      │  │  8. Persist to         │ │  │
        │  │  │     workspace       │  │     workspace          │ │  │
        │  │  └──────────┬──────────┘  └───────────┬────────────┘ │  │
        │  │             │                         │              │  │
        │  │             └─────────┬───────────────┘              │  │
        │  └───────────────────────┼──────────────────────────────┘  │
        │                          │                                 │
        │                          ▼                                 │
        │  ┌───────────────────────────────────────────────────────┐  │
        │  │           BRANCH CHECK                                │  │
        │  │                                                       │  │
        │  │   ┌─────────────────┐      ┌──────────────────────┐  │  │
        │  │   │  develop branch │      │    main branch       │  │  │
        │  │   │    (Staging)    │      │   (Production)       │  │  │
        │  │   └────────┬────────┘      └──────────┬───────────┘  │  │
        │  └────────────┼────────────────────────────┼─────────────┘  │
        │               │                            │                │
        │               │                            ▼                │
        │               │             ┌───────────────────────────┐   │
        │               │             │   PHASE 2: HOLD           │   │
        │               │             │                           │   │
        │               │             │   Manual Approval Gate    │   │
        │               │             │   (Production Only)       │   │
        │               │             │                           │   │
        │               │             │   ⏸ Wait for approval    │   │
        │               │             │   ✓ Approve / ✗ Reject   │   │
        │               │             └─────────┬─────────────────┘   │
        │               │                       │                     │
        │               ▼                       ▼                     │
        │  ┌────────────────────────────────────────────────────────┐ │
        │  │             PHASE 3: DEPLOY                            │ │
        │  │                                                        │ │
        │  │  ┌──────────────────────┐  ┌────────────────────────┐ │ │
        │  │  │  deploy-frontend     │  │  deploy-backend        │ │ │
        │  │  │                      │  │                        │ │ │
        │  │  │  1. Attach workspace │  │  1. Attach workspace   │ │ │
        │  │  │  2. AWS CLI setup    │  │  2. AWS CLI setup      │ │ │
        │  │  │  3. Sync to S3       │  │  3. EB CLI setup       │ │ │
        │  │  │  4. Invalidate       │  │  4. Create ZIP         │ │ │
        │  │  │     CloudFront       │  │  5. Deploy to EB       │ │ │
        │  │  │     cache            │  │  6. Health check       │ │ │
        │  │  └──────────┬───────────┘  └───────────┬────────────┘ │ │
        │  │             │                          │              │ │
        │  │             └──────────┬───────────────┘              │ │
        │  └────────────────────────┼──────────────────────────────┘ │
        │                           │                                │
        │                           ▼                                │
        │  ┌────────────────────────────────────────────────────────┐ │
        │  │          POST-DEPLOYMENT                               │ │
        │  │                                                        │ │
        │  │  - Health checks                                       │ │
        │  │  - Smoke tests                                         │ │
        │  │  - Notification (Slack/Email)                          │ │
        │  │  - Update deployment status                            │ │
        │  └────────────────────────────────────────────────────────┘ │
        │                                                              │
        └──────────────────────────────────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────────────────────────────────┐
        │                    AWS Infrastructure                        │
        │                                                              │
        │  ┌─────────────────┐              ┌────────────────────────┐ │
        │  │   Amazon S3     │              │  AWS Elastic Beanstalk│ │
        │  │   (Frontend)    │              │      (Backend)        │ │
        │  │                 │              │                       │ │
        │  │  + CloudFront   │              │  + Load Balancer      │ │
        │  └─────────────────┘              └────────────────────────┘ │
        │                                                              │
        └──────────────────────────────────────────────────────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  End Users   │
                    └──────────────┘
```

## Pipeline Stages Detail

### Stage 1: Source Control Trigger

```
Developer → git commit → git push → GitHub → Webhook → CircleCI
```

- Developer pushes code to GitHub
- GitHub webhook triggers CircleCI pipeline
- Pipeline starts automatically on push to `main` or `develop` branches

---

### Stage 2: Build Phase (Parallel Execution)

#### Frontend Build Job
```
┌─────────────────────────┐
│   build-frontend        │
├─────────────────────────┤
│ 1. Checkout Code        │
│ 2. Restore Cache        │
│ 3. Install Dependencies │
│ 4. Run Unit Tests       │
│ 5. Run Linter           │
│ 6. Build Angular App    │
│ 7. Save Cache           │
│ 8. Store Artifacts      │
└─────────────────────────┘
```

#### Backend Build Job
```
┌─────────────────────────┐
│   build-backend         │
├─────────────────────────┤
│ 1. Checkout Code        │
│ 2. Restore Cache        │
│ 3. Install Dependencies │
│ 4. Run Unit Tests       │
│ 5. Run Linter           │
│ 6. Build TypeScript     │
│ 7. Save Cache           │
│ 8. Store Artifacts      │
└─────────────────────────┘
```

**Both jobs run in parallel** to reduce pipeline execution time.

---

### Stage 3: Hold Phase (Production Only)

```
┌──────────────────────────────┐
│   Manual Approval Required   │
├──────────────────────────────┤
│  ⏸  Pipeline Paused          │
│                              │
│  Reviewer Actions:           │
│  ✓ Approve → Continue Deploy │
│  ✗ Reject  → Stop Pipeline   │
│                              │
│  Timeout: 7 days             │
└──────────────────────────────┘
```

- **Purpose**: Prevent accidental production deployments
- **Who**: Team lead or designated approver
- **When**: Only for `main` branch deployments
- **Skip**: Automatic deployment for `develop` branch

---

### Stage 4: Deploy Phase (Parallel Execution)

#### Frontend Deployment
```
┌─────────────────────────────┐
│   deploy-frontend           │
├─────────────────────────────┤
│ 1. Attach Build Artifacts   │
│ 2. Configure AWS CLI        │
│ 3. Sync Files to S3         │
│    - Delete old files       │
│    - Upload new build       │
│ 4. Invalidate CloudFront    │
│    - Clear CDN cache        │
│    - Force fresh content    │
│ 5. Verify Deployment        │
└─────────────────────────────┘
```

#### Backend Deployment
```
┌─────────────────────────────┐
│   deploy-backend            │
├─────────────────────────────┤
│ 1. Attach Build Artifacts   │
│ 2. Configure AWS CLI        │
│ 3. Setup EB CLI             │
│ 4. Package Application      │
│    - Create deployment ZIP  │
│    - Include dependencies   │
│ 5. Deploy to EB             │
│    - Upload to S3           │
│    - Create new version     │
│    - Update environment     │
│ 6. Health Check             │
│    - Wait for green status  │
└─────────────────────────────┘
```

---

### Stage 5: Post-Deployment

```
┌──────────────────────────────┐
│   Verification & Monitoring  │
├──────────────────────────────┤
│ ✓ Health Checks              │
│ ✓ Smoke Tests                │
│ ✓ Send Notifications         │
│ ✓ Update Status              │
└──────────────────────────────┘
```

---

## Branch Strategies

### Develop Branch (Staging)
```
develop → Build → Deploy (Auto) → Staging Environment
```
- Automatic deployment without approval
- Used for testing and QA
- Isolated from production

### Main Branch (Production)
```
main → Build → Hold (Approval) → Deploy → Production Environment
```
- Requires manual approval
- Production environment
- Protected branch

### Feature Branches
```
feature/* → Build → Test → (No Deploy)
```
- Builds and tests only
- No deployment
- Validates PR before merge

---

## Environment Variables

Pipeline requires these CircleCI environment variables:

```
AWS_ACCESS_KEY_ID          - AWS authentication
AWS_SECRET_ACCESS_KEY      - AWS authentication
AWS_REGION                 - Target AWS region
AWS_S3_BUCKET             - Frontend hosting bucket
CLOUDFRONT_DISTRIBUTION_ID - CDN invalidation
EB_ENVIRONMENT_NAME        - Backend environment
DATABASE_URL               - RDS connection string
```

---

## Pipeline Execution Time

| Stage                | Typical Duration |
|---------------------|------------------|
| Build Frontend      | 3-5 minutes      |
| Build Backend       | 2-4 minutes      |
| Hold (if required)  | Variable         |
| Deploy Frontend     | 1-2 minutes      |
| Deploy Backend      | 3-5 minutes      |
| **Total (Auto)**    | **6-11 minutes** |

---

## Rollback Strategy

```
1. Identify Failed Deployment
   ↓
2. Revert Git Commit
   ↓
3. Push to Trigger Pipeline
   ↓
4. (OR) Manual Rollback in AWS
   - EB: Deploy previous version
   - S3: Restore from versioning
```

---

## Success Criteria

✅ All tests pass  
✅ Build completes without errors  
✅ Deployment successful  
✅ Health checks pass  
✅ Application accessible  

---

**Note**: This pipeline supports both staging (`develop`) and production (`main`) environments with appropriate safeguards.
