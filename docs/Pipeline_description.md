# Pipeline Description

This document explains the CI/CD pipeline implemented using CircleCI for automated building, testing, and deployment of the full-stack application.

---

## Pipeline Overview

The pipeline automates the software delivery process from code commit to production deployment. It consists of three main phases:

1. **Build Phase**: Compile and test the application
2. **Hold Phase**: Manual approval gate for production
3. **Deploy Phase**: Deploy to AWS infrastructure

---

## Pipeline Trigger

### Automatic Triggers

The pipeline is triggered automatically on:

- **Push to `main` branch**: Triggers production pipeline (with approval)
- **Push to `develop` branch**: Triggers staging pipeline (automatic deployment)
- **Pull Request to `main` or `develop`**: Triggers build and test only

### Manual Triggers

Pipeline can also be triggered manually from CircleCI dashboard for:
- Re-running failed builds
- Deploying specific versions
- Testing pipeline changes

---

## Phase 1: Build Phase

The build phase runs in parallel for both frontend and backend to optimize pipeline execution time.

### Job 1: build-frontend

**Purpose**: Build and test the Angular frontend application

**Execution Environment**:
- Docker Image: `cimg/node:18.17`
- Working Directory: `~/project/frontend`

**Steps**:

1. **Checkout Code**
   ```yaml
   - checkout:
       path: ~/project
   ```
   - Clones the Git repository
   - Ensures all source code is available

2. **Restore Dependency Cache**
   ```yaml
   - restore_cache:
       keys:
         - v1-frontend-dependencies-{{ checksum "package.json" }}
   ```
   - Retrieves cached `node_modules` if available
   - Significantly speeds up build time
   - Cache key based on `package.json` checksum

3. **Install Dependencies**
   ```yaml
   - run:
       name: Install Frontend Dependencies
       command: npm install
   ```
   - Installs npm packages defined in `package.json`
   - Only installs if cache miss occurs

4. **Run Unit Tests**
   ```yaml
   - run:
       name: Run Frontend Unit Tests
       command: npm run test:ci
   ```
   - Executes Angular unit tests using Karma/Jasmine
   - Runs in headless Chrome for CI environment
   - Fails the build if any test fails
   - Generates code coverage reports

5. **Run Linting** (Optional but Recommended)
   ```yaml
   - run:
       name: Lint Frontend Code
       command: npm run lint
   ```
   - Checks code style and quality
   - Enforces coding standards
   - Catches potential errors

6. **Build Application**
   ```yaml
   - run:
       name: Build Frontend
       command: npm run build
   ```
   - Compiles TypeScript to JavaScript
   - Bundles and minifies application
   - Optimizes for production
   - Outputs to `dist/` directory

7. **Save Dependency Cache**
   ```yaml
   - save_cache:
       paths:
         - node_modules
       key: v1-frontend-dependencies-{{ checksum "package.json" }}
   ```
   - Caches `node_modules` for future builds
   - Cache invalidated when `package.json` changes

8. **Persist Build Artifacts**
   ```yaml
   - persist_to_workspace:
       root: ~/project
       paths:
         - frontend/dist
         - frontend/node_modules
   ```
   - Saves build output for deployment phase
   - Available to downstream jobs

**Typical Duration**: 3-5 minutes

---

### Job 2: build-backend

**Purpose**: Build and test the Node.js backend API

**Execution Environment**:
- Docker Image: `cimg/node:18.17`
- Working Directory: `~/project/backend`

**Steps**:

1. **Checkout Code**
   ```yaml
   - checkout:
       path: ~/project
   ```
   - Clones the Git repository

2. **Restore Dependency Cache**
   ```yaml
   - restore_cache:
       keys:
         - v1-backend-dependencies-{{ checksum "package.json" }}
   ```
   - Retrieves cached dependencies

3. **Install Dependencies**
   ```yaml
   - run:
       name: Install Backend Dependencies
       command: npm install
   ```
   - Installs npm packages

4. **Run Unit Tests**
   ```yaml
   - run:
       name: Run Backend Unit Tests
       command: npm run test
   ```
   - Executes Jest/Mocha unit tests
   - Tests API endpoints and business logic
   - Generates coverage reports
   - Fails build on test failure

5. **Run Linting** (Optional but Recommended)
   ```yaml
   - run:
       name: Lint Backend Code
       command: npm run lint
   ```
   - Checks TypeScript/JavaScript code quality

6. **Build Application**
   ```yaml
   - run:
       name: Build Backend
       command: npm run build
   ```
   - Compiles TypeScript to JavaScript
   - Outputs to `dist/` directory

7. **Save Dependency Cache**
   ```yaml
   - save_cache:
       paths:
         - node_modules
       key: v1-backend-dependencies-{{ checksum "package.json" }}
   ```
   - Caches dependencies for future builds

8. **Persist Build Artifacts**
   ```yaml
   - persist_to_workspace:
       root: ~/project
       paths:
         - backend/dist
         - backend/node_modules
         - backend/package.json
   ```
   - Saves build output and dependencies for deployment

**Typical Duration**: 2-4 minutes

---

### Build Phase Success Criteria

✅ All unit tests pass  
✅ Code linting passes  
✅ Build completes without errors  
✅ Artifacts persisted successfully  

If any step fails, the pipeline stops and notifies the team.

---

## Phase 2: Hold Phase (Production Only)

**Purpose**: Prevent accidental deployments to production by requiring manual approval

### Configuration

```yaml
- hold-for-approval:
    type: approval
    requires:
      - build-frontend
      - build-backend
    filters:
      branches:
        only: main
```

### Behavior

**For `main` branch (Production)**:
- Pipeline pauses after successful build
- Displays "Hold for Approval" status in CircleCI UI
- Awaits manual approval from authorized team member
- Timeout: 7 days (configurable)

**For `develop` branch (Staging)**:
- This phase is skipped
- Deployment proceeds automatically after build

### Approval Process

1. **Build Completes**: Both frontend and backend build successfully
2. **Notification Sent**: Team receives notification (email/Slack)
3. **Review**: Team member reviews changes and build status
4. **Decision**:
   - **Approve**: Pipeline continues to deployment phase
   - **Reject**: Pipeline stops, no deployment occurs

### Who Can Approve?

Configure in CircleCI project settings:
- Team leads
- DevOps engineers
- Release managers
- Specific GitHub users/teams

---

## Phase 3: Deploy Phase

The deploy phase runs in parallel for frontend and backend after approval (production) or automatically (staging).

### Job 1: deploy-frontend

**Purpose**: Deploy Angular application to AWS S3 and invalidate CloudFront cache

**Execution Environment**:
- Docker Image: `cimg/node:18.17`
- AWS CLI configured with credentials

**Steps**:

1. **Checkout Code**
   ```yaml
   - checkout
   ```
   - Retrieves source code

2. **Setup AWS CLI**
   ```yaml
   - aws-cli/setup
   ```
   - Configures AWS credentials from environment variables
   - Sets default region

3. **Attach Workspace**
   ```yaml
   - attach_workspace:
       at: ~/project
   ```
   - Retrieves build artifacts from build phase

4. **Deploy to S3**
   ```yaml
   - run:
       name: Deploy Frontend to S3
       command: |
         cd frontend/dist
         aws s3 sync . s3://${AWS_S3_BUCKET} --delete
   ```
   - Syncs build files to S3 bucket
   - `--delete` removes old files not in new build
   - Preserves only current version

5. **Invalidate CloudFront Cache**
   ```yaml
   - run:
       name: Invalidate CloudFront Cache
       command: |
         aws cloudfront create-invalidation \
           --distribution-id ${CLOUDFRONT_DISTRIBUTION_ID} \
           --paths "/*"
   ```
   - Clears CDN cache
   - Ensures users get latest version
   - Takes 1-2 minutes to propagate

**Typical Duration**: 1-2 minutes

**Required Environment Variables**:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `AWS_S3_BUCKET`
- `CLOUDFRONT_DISTRIBUTION_ID`

---

### Job 2: deploy-backend

**Purpose**: Deploy Node.js API to AWS Elastic Beanstalk

**Execution Environment**:
- Docker Image: `cimg/node:18.17`
- AWS CLI and EB CLI installed

**Steps**:

1. **Checkout Code**
   ```yaml
   - checkout
   ```
   - Retrieves source code

2. **Setup AWS CLI**
   ```yaml
   - aws-cli/setup
   ```
   - Configures AWS credentials

3. **Setup Elastic Beanstalk CLI**
   ```yaml
   - eb/setup
   ```
   - Installs and configures EB CLI

4. **Attach Workspace**
   ```yaml
   - attach_workspace:
       at: ~/project
   ```
   - Retrieves build artifacts

5. **Prepare Deployment Package**
   ```yaml
   - run:
       name: Prepare Backend Deployment Package
       command: |
         cd backend
         zip -r deploy.zip dist node_modules package.json .ebextensions
   ```
   - Creates ZIP archive with:
     - Compiled code (`dist/`)
     - Dependencies (`node_modules/`)
     - Package configuration (`package.json`)
     - EB extensions (`.ebextensions/`)

6. **Deploy to Elastic Beanstalk**
   ```yaml
   - run:
       name: Deploy Backend to Elastic Beanstalk
       command: |
         cd backend
         eb deploy ${EB_ENVIRONMENT_NAME}
   ```
   - Uploads ZIP to S3
   - Creates new application version
   - Updates EB environment
   - Performs rolling deployment
   - Health checks ensure successful deployment

**Deployment Strategy**: Rolling with additional batch
- Maintains full capacity during deployment
- Launches new instances before terminating old ones
- Zero downtime deployment

**Typical Duration**: 3-5 minutes

**Required Environment Variables**:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `EB_ENVIRONMENT_NAME`

---

## Deployment Strategies

### Staging Environment (develop branch)

```
Code Push → Build → Test → Deploy (Auto) → Staging
```

- Automatic deployment after successful build
- No manual approval required
- Fast feedback for developers
- Safe environment for testing

### Production Environment (main branch)

```
Code Push → Build → Test → Hold → Approve → Deploy → Production
```

- Manual approval gate
- Controlled release process
- Scheduled deployments possible
- Change management compliance

---

## Branch Strategy

### Feature Branches

```bash
feature/new-feature → Build + Test Only (No Deployment)
```

- Validates code before merging
- Ensures tests pass
- PR builds for code review

### Develop Branch (Staging)

```bash
develop → Build + Test + Deploy to Staging
```

- Integration branch
- Automatic deployment
- Continuous testing environment

### Main Branch (Production)

```bash
main → Build + Test + Hold + Approve + Deploy to Production
```

- Protected branch
- Requires PR approval
- Manual deployment approval

---

## Pipeline Workflow Examples

### Scenario 1: Feature Development

1. Developer creates feature branch: `feature/user-authentication`
2. Commits and pushes code
3. CircleCI runs build and test (no deployment)
4. Creates PR to `develop`
5. PR build runs (validates merge)
6. After PR approval, merges to `develop`
7. Automatic deployment to staging
8. QA team tests on staging
9. Creates PR to `main`
10. PR approved and merged
11. CircleCI builds for production
12. Team lead approves deployment
13. Automatic deployment to production

### Scenario 2: Hotfix

1. Developer creates hotfix branch from `main`
2. Commits fix
3. Creates PR to `main`
4. Expedited review and approval
5. Merge to `main`
6. CircleCI builds
7. Immediate approval and deployment

---

## Environment Variables

### Required in CircleCI

Configure these in CircleCI Project Settings → Environment Variables:

**AWS Credentials**:
- `AWS_ACCESS_KEY_ID`: IAM user access key
- `AWS_SECRET_ACCESS_KEY`: IAM user secret key
- `AWS_REGION`: Target AWS region (e.g., `us-east-1`)

**Frontend Deployment**:
- `AWS_S3_BUCKET`: S3 bucket name (e.g., `my-app-frontend-prod`)
- `CLOUDFRONT_DISTRIBUTION_ID`: CloudFront distribution ID (e.g., `E1234567890ABC`)

**Backend Deployment**:
- `EB_ENVIRONMENT_NAME`: Elastic Beanstalk environment (e.g., `my-app-backend-prod`)

**Application Configuration**:
- `DATABASE_URL`: RDS connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `NODE_ENV`: Environment (`production`, `staging`)

---

## Monitoring & Notifications

### Build Status Notifications

Configure in CircleCI:

**Slack Integration**:
```yaml
- slack/notify:
    event: fail
    mentions: '@devops-team'
    template: basic_fail_1
```

**Email Notifications**:
- Build failures
- Deployment success
- Approval requests

### Pipeline Metrics

Monitor in CircleCI dashboard:
- Build success rate
- Average build duration
- Deployment frequency
- Time to deployment

---

## Troubleshooting

### Common Issues

**1. Build Fails - Tests Don't Pass**
- Review test logs in CircleCI
- Run tests locally: `npm test`
- Fix failing tests before pushing

**2. Deployment Fails - S3 Upload Error**
- Verify AWS credentials
- Check S3 bucket permissions
- Ensure bucket exists

**3. Deployment Fails - Elastic Beanstalk Error**
- Check EB environment health
- Review application logs in AWS console
- Verify environment variables

**4. Cache Issues**
- Clear CircleCI cache in project settings
- Update cache key version in config.yml

---

## Performance Optimization

### Cache Strategy

- Cache dependencies between builds
- Invalidate cache on `package.json` changes
- Separate caches for frontend/backend

### Parallel Execution

- Build frontend and backend simultaneously
- Deploy frontend and backend simultaneously
- Reduces total pipeline time by 40-50%

### Resource Optimization

- Use appropriate Docker images (smaller = faster)
- Optimize test execution (parallel test runners)
- Minimize artifact sizes

---

## Security Best Practices

✅ **Never commit secrets** to repository  
✅ **Use CircleCI environment variables** for sensitive data  
✅ **Rotate AWS credentials** regularly  
✅ **Use IAM roles** with least privilege  
✅ **Enable branch protection** on `main` and `develop`  
✅ **Require PR reviews** before merging  
✅ **Use signed commits** (optional)  

---

## Pipeline Maintenance

### Regular Tasks

- **Weekly**: Review failed builds and address issues
- **Monthly**: Update dependencies and Docker images
- **Quarterly**: Review and optimize pipeline performance
- **Annually**: Audit IAM permissions and rotate credentials

### Version Control

- Keep `.circleci/config.yml` in version control
- Document pipeline changes in commit messages
- Test pipeline changes in feature branches

---

## Success Metrics

### Key Performance Indicators (KPIs)

- **Deployment Frequency**: 5-10 deployments per week
- **Lead Time**: < 30 minutes from commit to production
- **Change Failure Rate**: < 15%
- **Mean Time to Recovery (MTTR)**: < 1 hour

### Goals

- 95%+ successful build rate
- < 10 minute average build time
- < 5 minute average deployment time
- Zero downtime deployments

---

## Rollback Procedure

If deployment fails or issues are discovered:

### Frontend Rollback

```bash
# Option 1: Re-deploy previous version from CircleCI
# Option 2: Restore from S3 versioning
aws s3api list-object-versions --bucket your-bucket
aws s3api copy-object --copy-source bucket/key?versionId=xxx
```

### Backend Rollback

```bash
# Elastic Beanstalk keeps previous versions
eb deploy --version previous-version-label

# Or via AWS Console:
# Elastic Beanstalk → Environment → Application Versions → Deploy
```

---

## Future Enhancements

### Planned Improvements

- [ ] Add integration tests to pipeline
- [ ] Implement blue-green deployments
- [ ] Add performance testing
- [ ] Implement automated rollback on failure
- [ ] Add security scanning (SAST/DAST)
- [ ] Implement canary deployments

---

**Last Updated**: November 2025

**Maintained By**: DevOps Team

**Pipeline Version**: 2.1
