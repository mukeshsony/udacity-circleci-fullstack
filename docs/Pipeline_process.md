# Pipeline Process

This document describes the complete CI/CD pipeline process from development to deployment, covering every step from writing code to making it available to users.

---

## What is the Pipeline Process?

The pipeline is the **automated process** that takes code from a developer's computer and deploys it to production on AWS, ensuring quality through automated testing and controlled deployments.

---

## Complete Pipeline Flow: From Development to Deployment

### Step 1: **Development** (Your Computer)

**What Happens**:
- Developer writes code on local machine
- Makes changes to frontend (Angular) or backend (Node.js)
- Tests locally using `npm start` and `npm test`
- Reviews changes and prepares for deployment

**Tools Used**:
- Code editor (VS Code, WebStorm, etc.)
- Local Node.js environment
- Local PostgreSQL database

---

### Step 2: **Version Control** (Git → GitHub)

**What Happens**:
```bash
git add .
git commit -m "Add new feature"
git push origin main
```

- Developer commits code changes using Git
- Code is pushed to GitHub repository
- GitHub stores the code and version history
- GitHub webhook is triggered automatically

**Why This Step Matters**:
- Code is backed up in the cloud
- Team members can see changes
- Triggers the automated pipeline
- Provides version history for rollback

**Repository**: `github.com/mukeshsony/udacity-circleci-fullstack`

---

### Step 3: **CI/CD Pipeline Trigger** (GitHub → CircleCI)

**What Happens**:
- GitHub sends a webhook notification to CircleCI
- CircleCI receives the trigger
- Pipeline automatically starts
- CircleCI clones the repository

**Why This Step Matters**:
- Automation begins immediately after code push
- No manual intervention needed
- Ensures every code change goes through the same process

**Trigger Condition**: Only runs on push to `main` branch

---

### Step 4: **Build & Test Phase** (CircleCI - Part 1)

This is where CircleCI builds and tests both frontend and backend in parallel.

#### Job A: Build Frontend (udacity-web-app)

**What Happens**:
1. **Checkout Code**: CircleCI clones the GitHub repository
2. **Restore Cache**: Loads previously cached npm dependencies (faster builds)
3. **Install Dependencies**: Runs `npm ci` in web-app folder
   - Installs ~1000 npm packages
   - Includes Angular framework, testing tools, etc.
4. **Run Unit Tests**: Executes 81 frontend unit tests
   - Uses Karma test runner
   - Runs tests in Chrome Headless
   - All tests must pass to continue
5. **Build Application**: Runs `ng build --configuration=production`
   - Compiles TypeScript to JavaScript
   - Bundles all files
   - Minifies and optimizes code
   - Output: `dist/mystore-angular/browser/` folder
6. **Save Cache**: Caches node_modules for next build
7. **Store Artifacts**: Saves build output for deployment

**Time**: ~3-5 minutes

#### Job B: Build Backend (udacity-web-api)

**What Happens**:
1. **Checkout Code**: CircleCI clones the GitHub repository
2. **Restore Cache**: Loads previously cached npm dependencies
3. **Install Dependencies**: Runs `npm ci` in web-api folder
   - Installs ~100 npm packages
   - Includes Express, PostgreSQL driver, etc.
4. **Run Unit Tests**: Executes 21 backend unit tests
   - Uses Jasmine test framework
   - Tests API endpoints, models, utilities
   - All tests must pass to continue
5. **Build Application**: Runs `tsc` (TypeScript compiler)
   - Compiles TypeScript to JavaScript
   - Output: `dist/src/` folder with compiled .js files
6. **Save Cache**: Caches node_modules for next build
7. **Store Artifacts**: Saves build output for deployment

**Time**: ~2-4 minutes

**Important**: Both jobs run in **parallel** to save time!

**If Any Test Fails**: Pipeline stops immediately, deployment is prevented

---

### Step 5: **Manual Approval Gate** (CircleCI - Part 2)

**What Happens**:
- Pipeline pauses automatically
- Waits for human approval
- Sends notification (email/Slack)
- Authorized person reviews the build
- Clicks "Approve" or "Reject" button in CircleCI dashboard

**Why This Step Matters**:
- Prevents accidental deployments to production
- Allows final review before changes go live
- Gives time to verify tests passed
- Provides control over deployment timing

**Who Approves**: Team lead, project manager, or designated approver

**Timeout**: 7 days (automatic cancellation if not approved)

**This is the HOLD step**: Job name is `hold-for-approval`

---

### Step 6: **Deployment Phase** (CircleCI → AWS - Part 3)

After approval, CircleCI deploys to AWS. This happens in parallel for frontend and backend.

#### Job C: Deploy Frontend (deploy-frontend)

**What Happens**:
1. **Attach Build Artifacts**: Retrieves the built Angular files from Step 4
2. **Configure AWS CLI**: Sets up AWS credentials from CircleCI environment variables
3. **Sync to S3**: Runs `aws s3 sync dist/mystore-angular/browser/ s3://udacity-web-app`
   - Uploads all HTML, CSS, JavaScript files
   - Deletes old files from S3
   - Replaces with new version
4. **Invalidate CloudFront Cache**: Runs `aws cloudfront create-invalidation`
   - Clears CDN cache
   - Ensures users get the latest version immediately
   - Distribution ID: `E2R5142O5YUCP`
5. **Verify Deployment**: Confirms files uploaded successfully

**Destination**: 
- S3 Bucket: `udacity-web-app`
- CloudFront: `E2R5142O5YUCP`

**Time**: ~1-2 minutes

#### Job D: Deploy Backend (deploy-backend)

**What Happens**:
1. **Attach Build Artifacts**: Retrieves the built Node.js files from Step 4
2. **Configure AWS CLI**: Sets up AWS credentials
3. **Initialize Elastic Beanstalk CLI**: Runs `eb init udacity-backend`
4. **Set Environment Variables**: Runs `eb setenv` command
   ```bash
   eb setenv \
     POSTGRES_HOST="${POSTGRES_HOST}" \
     POSTGRES_PORT="${POSTGRES_PORT}" \
     POSTGRES_DB="${POSTGRES_DB}" \
     POSTGRES_USER="${POSTGRES_USER}" \
     POSTGRES_PASSWORD="${POSTGRES_PASSWORD}" \
     JWT_SECRET="${JWT_SECRET}" \
     BCRYPT_PASSWORD="${BCRYPT_PASSWORD}" \
     SALT_ROUNDS="${SALT_ROUNDS}" \
     PORT=8080
   ```
   - **This is CRITICAL**: Passes all secrets from CircleCI to Elastic Beanstalk
   - Without this, the app cannot connect to the database
5. **Deploy to EB**: Runs `eb deploy mystore-udacity`
   - Uploads code to Elastic Beanstalk
   - EB creates new application version
   - Triggers platform hooks on EB instances
6. **Platform Hooks Run on EB**:
   - `01_install_build_deps.sh`: Installs all dependencies
   - `02_build_typescript.sh`: Compiles TypeScript (if needed)
   - `04_run_migrations.sh`: Runs database migrations
   - `03_prune_deps.sh`: Removes dev dependencies
7. **Health Check**: EB checks if app is responding
8. **Verify Deployment**: Confirms application is running

**Destination**: 
- Elastic Beanstalk Environment: `mystore-udacity`
- Application: `udacity-backend`
- URL: `mystore-udacity.us-east-1.elasticbeanstalk.com`

**Time**: ~3-5 minutes

**Important**: Both deployments run in **parallel** to save time!

---

### Step 7: **Application Running** (AWS Production)

**What Happens**:
- Frontend is live on S3 + CloudFront
- Backend is live on Elastic Beanstalk
- Database is connected (RDS PostgreSQL)
- Users can access the application

**Architecture**:
```
User Browser
    ↓
CloudFront CDN (cache)
    ↓
S3 Bucket (Angular files)
    ↓
[User interacts with Angular app]
    ↓
API Request to Backend
    ↓
Elastic Beanstalk (Node.js API)
    ↓
RDS PostgreSQL (Database)
    ↓
Response back to User
```

---

## Complete Pipeline Summary

Here's the complete flow from start to finish:

```
1. Developer Computer
   └─> Write Code
       └─> git commit
           └─> git push origin main

2. GitHub
   └─> Receives code
       └─> Sends webhook to CircleCI

3. CircleCI - Build & Test
   ├─> Build Frontend (3-5 min)
   │   ├─> Install dependencies
   │   ├─> Run 81 tests
   │   └─> Build Angular app
   │
   └─> Build Backend (2-4 min)
       ├─> Install dependencies
       ├─> Run 21 tests
       └─> Compile TypeScript

4. CircleCI - Manual Approval
   └─> Wait for human approval
       └─> Approve button clicked

5. CircleCI - Deploy
   ├─> Deploy Frontend to S3 (1-2 min)
   │   ├─> Upload files to S3
   │   └─> Invalidate CloudFront
   │
   └─> Deploy Backend to EB (3-5 min)
       ├─> Set environment variables (eb setenv)
       ├─> Upload to Elastic Beanstalk
       └─> Run migrations on EB

6. AWS Production
   ├─> S3 + CloudFront (Frontend)
   ├─> Elastic Beanstalk (Backend)
   └─> RDS PostgreSQL (Database)

7. Users Access Application
   └─> https://d3xxxxxxxxx.cloudfront.net
```

---

## Key Points About the Pipeline

### It's NOT Just CircleCI
The pipeline is the **entire process**:
1. Development on your computer
2. Git version control
3. GitHub repository
4. CircleCI automation
5. AWS infrastructure
6. Application available to users

### It's NOT Just the config.yml File
While `.circleci/config.yml` defines the CircleCI jobs, the pipeline includes:
- Git workflow
- GitHub webhooks
- CircleCI execution environment
- AWS CLI commands
- EB platform hooks
- Environment variable management

---

## Pipeline Security

**Secrets Management**:
- Database passwords stored in CircleCI environment variables
- JWT secrets stored in CircleCI environment variables
- AWS credentials stored in CircleCI environment variables
- CircleCI passes secrets to EB using `eb setenv` command
- No secrets in source code or config files

**Where Secrets Are**:
1. CircleCI Project Settings → Environment Variables (12+ variables)
2. CircleCI passes them to Elastic Beanstalk during deployment
3. EB stores them in environment configuration
4. Node.js accesses them via `process.env.POSTGRES_PASSWORD`, etc.

---

## Pipeline Execution Times

| Step | Duration |
|------|----------|
| GitHub webhook trigger | < 1 second |
| Checkout code | ~10 seconds |
| Build Frontend | 3-5 minutes |
| Build Backend | 2-4 minutes |
| Manual approval | Variable (human decision) |
| Deploy Frontend | 1-2 minutes |
| Deploy Backend | 3-5 minutes |
| **Total (without approval)** | **9-16 minutes** |

---

## What Happens If Something Fails?

### Tests Fail
- Pipeline stops immediately
- No deployment happens
- Developer gets notification
- Must fix code and push again

### Build Fails
- Pipeline stops
- No deployment happens
- Check build logs in CircleCI
- Fix errors and push again

### Deployment Fails
- Previous version remains running
- No downtime for users
- Check deployment logs
- Can redeploy or rollback

---

## Benefits of This Pipeline

✅ **Automated**: No manual deployment steps  
✅ **Tested**: 102 tests run on every deployment  
✅ **Safe**: Manual approval prevents accidents  
✅ **Fast**: Parallel jobs save time  
✅ **Reliable**: Same process every time  
✅ **Traceable**: Full history in CircleCI  
✅ **Secure**: Environment variables properly managed  
✅ **Rollback Capable**: Can revert to previous version  

---

**Pipeline File**: `.circleci/config.yml` (620 lines)  
**Total Jobs**: 4 (build-frontend, build-backend, deploy-frontend, deploy-backend)  
**Total Tests**: 102 (81 frontend + 21 backend)  
**Deployment Frequency**: On every push to main (after approval)
