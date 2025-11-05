# Complete Setup Guide: CircleCI + AWS Deployment

This guide walks you through setting up CircleCI for continuous deployment of your full-stack application to AWS.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Part 1: AWS Infrastructure Setup](#part-1-aws-infrastructure-setup)
3. [Part 2: CircleCI Setup](#part-2-circleci-setup)
4. [Part 3: Deploy Frontend to S3](#part-3-deploy-frontend-to-s3)
5. [Part 4: Deploy Backend to Elastic Beanstalk](#part-4-deploy-backend-to-elastic-beanstalk)
6. [Part 5: Testing the Pipeline](#part-5-testing-the-pipeline)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, ensure you have:

- ✅ AWS Account with administrative access
- ✅ GitHub account with your code repository
- ✅ CircleCI account (free tier is sufficient)
- ✅ Node.js 18+ and npm installed locally
- ✅ AWS CLI installed and configured
- ✅ Git installed

### Install Required Tools

```bash
# Install AWS CLI (Windows - PowerShell)
msiexec.exe /i https://awscli.amazonaws.com/AWSCLIV2.msi

# Install EB CLI
pip install awsebcli --upgrade

# Verify installations
aws --version
eb --version
node --version
npm --version
```

---

## Part 1: AWS Infrastructure Setup

### Step 1.1: Create IAM User for CircleCI

1. **Log in to AWS Console** → Navigate to **IAM**

2. **Create New User**:
   - Click **Users** → **Add users**
   - User name: `circleci-deployer`
   - Access type: ✅ **Programmatic access**
   - Click **Next: Permissions**

3. **Attach Policies**:
   - Click **Attach existing policies directly**
   - Select these policies:
     - ✅ `AmazonS3FullAccess`
     - ✅ `AWSElasticBeanstalkFullAccess`
     - ✅ `CloudFrontFullAccess`
   - Click **Next: Tags** → **Next: Review** → **Create user**

4. **Save Credentials** (IMPORTANT!):
   ```
   Access Key ID: AKIA**************
   Secret Access Key: ****************************
   ```
   ⚠️ **Save these immediately! You won't see them again.**

### Step 1.2: Create S3 Bucket for Frontend

```bash
# Set your bucket name (must be globally unique)
$BUCKET_NAME = "your-app-frontend-prod"
$AWS_REGION = "us-east-1"

# Create bucket
aws s3 mb s3://$BUCKET_NAME --region $AWS_REGION

# Enable static website hosting
aws s3 website s3://$BUCKET_NAME `
  --index-document index.html `
  --error-document index.html

# Create bucket policy file
@"
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
    }
  ]
}
"@ | Out-File -FilePath bucket-policy.json -Encoding utf8

# Apply bucket policy
aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file://bucket-policy.json

# Disable block public access
aws s3api put-public-access-block `
  --bucket $BUCKET_NAME `
  --public-access-block-configuration BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false
```

**Verify**: Navigate to AWS Console → S3 → Your bucket → Properties → Static website hosting (should show "Enabled")

### Step 1.3: Create CloudFront Distribution (Optional but Recommended)

1. **AWS Console** → **CloudFront** → **Create Distribution**

2. **Configure**:
   - **Origin Domain**: Select your S3 bucket
   - **Origin Path**: Leave empty
   - **Name**: `frontend-cdn`
   - **Viewer Protocol Policy**: Redirect HTTP to HTTPS
   - **Allowed HTTP Methods**: GET, HEAD, OPTIONS
   - **Cache Policy**: CachingOptimized
   - **Default Root Object**: `index.html`

3. **Custom Error Responses**:
   - Click **Create custom error response**
   - **HTTP Error Code**: 404
   - **Customize Error Response**: Yes
   - **Response Page Path**: `/index.html`
   - **HTTP Response Code**: 200
   - Click **Create**

4. **Create Distribution** (takes 10-15 minutes to deploy)

5. **Save Distribution ID**:
   ```
   Distribution ID: E1234567890ABC
   Domain Name: d1234567890abc.cloudfront.net
   ```

### Step 1.4: Create RDS PostgreSQL Database

```bash
# Create RDS database
aws rds create-db-instance `
  --db-instance-identifier your-app-db-prod `
  --db-instance-class db.t3.micro `
  --engine postgres `
  --engine-version 14.7 `
  --master-username dbadmin `
  --master-user-password YourSecurePassword123! `
  --allocated-storage 20 `
  --storage-type gp3 `
  --vpc-security-group-ids sg-xxxxxxxxx `
  --backup-retention-period 7 `
  --publicly-accessible
```

**Or via AWS Console**:
1. **RDS** → **Create database**
2. **Standard create** → **PostgreSQL**
3. **Templates**: Free tier (for testing) or Production
4. **DB instance identifier**: `your-app-db-prod`
5. **Master username**: `dbadmin`
6. **Master password**: Create a strong password
7. **DB instance class**: db.t3.micro
8. **Storage**: 20 GB
9. **Connectivity**: Default VPC, Publicly accessible: Yes (for initial setup)
10. **Create database** (takes 5-10 minutes)

**Save Connection Details**:
```
Endpoint: your-app-db-prod.xxxx.us-east-1.rds.amazonaws.com
Port: 5432
Username: dbadmin
Password: YourSecurePassword123!
Database: postgres (default)
```

**Connection String Format**:
```
postgresql://dbadmin:YourSecurePassword123!@your-app-db-prod.xxxx.us-east-1.rds.amazonaws.com:5432/postgres
```

### Step 1.5: Create Elastic Beanstalk Application

```bash
# Initialize EB application (run in your backend folder)
cd backend

# Initialize Elastic Beanstalk
eb init

# Follow prompts:
# - Select region: us-east-1
# - Application name: your-app-backend
# - Platform: Node.js
# - Platform version: Node.js 18 running on 64bit Amazon Linux 2
# - SSH keypair: (optional, select or create)

# Create environment
eb create your-app-backend-prod `
  --instance-type t3.small `
  --envvars NODE_ENV=production,PORT=8080,DATABASE_URL=your-connection-string

# This will take 5-10 minutes to provision
```

**Or via AWS Console**:
1. **Elastic Beanstalk** → **Create Application**
2. **Application name**: `your-app-backend`
3. **Platform**: Node.js
4. **Platform version**: Node.js 18 running on 64bit Amazon Linux 2
5. **Application code**: Sample application (we'll deploy later)
6. **Configure more options**:
   - **Presets**: High availability
   - **Instances**: t3.small
7. **Create application**

**Save Environment Details**:
```
Environment Name: your-app-backend-prod
Environment URL: your-app-backend-prod.us-east-1.elasticbeanstalk.com
```

---

## Part 2: CircleCI Setup

### Step 2.1: Connect GitHub to CircleCI

1. **Go to** [https://circleci.com/](https://circleci.com/)

2. **Sign up/Log in** with your GitHub account

3. **Authorize CircleCI** to access your repositories

4. **Select your organization** (your GitHub username)

### Step 2.2: Add Your Project

1. **Projects** → Find your repository → **Set Up Project**

2. **Choose Config File**:
   - Select "Fastest: Use the `.circleci/config.yml` in my repo"
   - Click **Set Up Project**

3. **First Build** will start automatically (might fail - that's okay!)

### Step 2.3: Configure Environment Variables

1. **Project Settings** (gear icon) → **Environment Variables**

2. **Add Variables** (click "Add Environment Variable" for each):

```
Name: AWS_ACCESS_KEY_ID
Value: AKIA************** (from Step 1.1)

Name: AWS_SECRET_ACCESS_KEY
Value: **************************** (from Step 1.1)

Name: AWS_REGION
Value: us-east-1

Name: AWS_S3_BUCKET
Value: your-app-frontend-prod

Name: CLOUDFRONT_DISTRIBUTION_ID
Value: E1234567890ABC (from Step 1.3)

Name: EB_ENVIRONMENT_NAME
Value: your-app-backend-prod

Name: DATABASE_URL
Value: postgresql://dbadmin:YourSecurePassword123!@your-app-db-prod.xxxx.us-east-1.rds.amazonaws.com:5432/postgres

Name: JWT_SECRET
Value: your-super-secret-jwt-key-change-this-in-production

Name: NODE_ENV
Value: production
```

3. **Take a screenshot** of this page (redact sensitive values) for your submission!

### Step 2.4: Configure Branch Protection (Optional)

1. **Project Settings** → **Advanced**

2. **Only build pull requests**: Enable (recommended)

3. **Auto-cancel redundant builds**: Enable

---

## Part 3: Deploy Frontend to S3

### Step 3.1: Prepare Frontend for Deployment

1. **Navigate to frontend folder**:
```bash
cd frontend
```

2. **Create/Update `package.json` scripts**:
```json
{
  "scripts": {
    "start": "ng serve",
    "build": "ng build --configuration production",
    "test": "ng test",
    "test:ci": "ng test --watch=false --browsers=ChromeHeadless --code-coverage",
    "deploy": "npm run build && aws s3 sync dist/ s3://${AWS_S3_BUCKET} --delete"
  }
}
```

3. **Update environment file** (`src/environments/environment.prod.ts`):
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-app-backend-prod.us-east-1.elasticbeanstalk.com/api'
};
```

### Step 3.2: Test Local Build

```bash
# Install dependencies
npm install

# Run tests
npm run test:ci

# Build production
npm run build

# Check dist folder
ls dist/
```

### Step 3.3: Manual Deploy (First Time)

```bash
# Deploy to S3
aws s3 sync dist/ s3://your-app-frontend-prod --delete

# Invalidate CloudFront (if using)
aws cloudfront create-invalidation `
  --distribution-id E1234567890ABC `
  --paths "/*"
```

### Step 3.4: Test Frontend

Open your browser:
- **S3 URL**: `http://your-app-frontend-prod.s3-website-us-east-1.amazonaws.com`
- **CloudFront URL**: `https://d1234567890abc.cloudfront.net`

---

## Part 4: Deploy Backend to Elastic Beanstalk

### Step 4.1: Prepare Backend for Deployment

1. **Navigate to backend folder**:
```bash
cd backend
```

2. **Create/Update `package.json`**:
```json
{
  "name": "backend-api",
  "version": "1.0.0",
  "scripts": {
    "start": "node dist/server.js",
    "dev": "ts-node-dev src/server.ts",
    "build": "tsc",
    "test": "jest",
    "deploy": "npm run build && eb deploy"
  },
  "engines": {
    "node": "18.x",
    "npm": "9.x"
  }
}
```

3. **Create `.ebextensions/nodecommand.config`**:
```yaml
option_settings:
  aws:elasticbeanstalk:container:nodejs:
    NodeCommand: "npm start"
  aws:elasticbeanstalk:application:environment:
    NODE_ENV: production
    PORT: 8080
```

4. **Create `.ebignore` file**:
```
# Don't upload these to EB
.git/
.gitignore
node_modules/
src/
*.md
.env
.env.*
tsconfig.json
.vscode/
```

### Step 4.2: Test Local Build

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build

# Check dist folder
ls dist/
```

### Step 4.3: Configure EB Environment Variables

```bash
# Set environment variables in EB
eb setenv `
  NODE_ENV=production `
  PORT=8080 `
  DATABASE_URL="postgresql://dbadmin:YourSecurePassword123!@your-app-db-prod.xxxx.us-east-1.rds.amazonaws.com:5432/postgres" `
  JWT_SECRET="your-super-secret-jwt-key" `
  CORS_ORIGIN="https://your-app-frontend-prod.s3-website-us-east-1.amazonaws.com"
```

### Step 4.4: Manual Deploy (First Time)

```bash
# Deploy to Elastic Beanstalk
eb deploy your-app-backend-prod

# This will:
# 1. Create deployment package
# 2. Upload to S3
# 3. Create new application version
# 4. Update EB environment
# 5. Run health checks

# Monitor deployment
eb health

# Check logs if issues
eb logs
```

### Step 4.5: Test Backend

```bash
# Test health endpoint
curl https://your-app-backend-prod.us-east-1.elasticbeanstalk.com/api/health

# Or open in browser
start https://your-app-backend-prod.us-east-1.elasticbeanstalk.com/api/health
```

---

## Part 5: Testing the Pipeline

### Step 5.1: Create Feature Branch

```bash
# Create and switch to new branch
git checkout -b feature/test-deployment

# Make a small change (e.g., update README)
echo "Testing CircleCI deployment" >> README.md

# Commit and push
git add .
git commit -m "Test: CircleCI deployment setup"
git push origin feature/test-deployment
```

### Step 5.2: Monitor Build in CircleCI

1. **Go to CircleCI Dashboard** → Your project

2. **You should see**:
   - Build triggered automatically
   - `build-frontend` job running
   - `build-backend` job running
   - Both should complete successfully

3. **Take screenshots** of:
   - ✅ Successful build phase
   - ✅ Job logs showing tests passing
   - ✅ Build artifacts created

### Step 5.3: Merge to Develop (Staging Deployment)

```bash
# Merge to develop branch
git checkout develop
git merge feature/test-deployment
git push origin develop
```

**CircleCI should**:
1. ✅ Build frontend and backend
2. ✅ Run tests
3. ✅ Automatically deploy to staging (no approval needed)

**Take screenshots**:
- ✅ Build phase
- ✅ Deploy phase showing S3 sync and EB deploy

### Step 5.4: Merge to Main (Production Deployment)

```bash
# Merge to main branch
git checkout main
git merge develop
git push origin main
```

**CircleCI should**:
1. ✅ Build frontend and backend
2. ✅ Run tests
3. ⏸ **Pause at "hold-for-approval"**
4. **Take screenshot** of hold phase!

**Approve Deployment**:
1. Click on the workflow in CircleCI
2. Click **"Approve"** on the `hold-for-approval` job
3. Deployment proceeds automatically
4. **Take screenshot** of deploy phase!

### Step 5.5: Verify Deployment

```bash
# Test frontend
start http://your-app-frontend-prod.s3-website-us-east-1.amazonaws.com

# Test backend
curl https://your-app-backend-prod.us-east-1.elasticbeanstalk.com/api/health
```

---

## Part 6: Capture Screenshots for Submission

### CircleCI Screenshots

1. **Build Phase** (`screenshots/circleci-build.png`):
   - Navigate to successful workflow
   - Expand build-frontend and build-backend jobs
   - Show green checkmarks and success status
   - Capture full workflow view

2. **Hold Phase** (`screenshots/circleci-hold.png`):
   - Show workflow with hold-for-approval paused
   - Show "Approve" button
   - Branch: main

3. **Deploy Phase** (`screenshots/circleci-deploy.png`):
   - Show successful deployment
   - Both deploy-frontend and deploy-backend complete
   - Green checkmarks throughout

4. **Environment Variables** (`screenshots/circleci-environment-variables.png`):
   - Project Settings → Environment Variables
   - Show all variables configured (values will be hidden - that's good!)
   - Redact any visible sensitive information

### AWS Screenshots

1. **RDS** (`screenshots/aws-rds.png`):
   - AWS Console → RDS → Databases
   - Show your database with "Available" status
   - Include endpoint and configuration

2. **Elastic Beanstalk** (`screenshots/aws-elasticbeanstalk.png`):
   - AWS Console → Elastic Beanstalk → Environments
   - Show "Ok" health status (green)
   - Recent events showing deployment

3. **S3** (`screenshots/aws-s3.png`):
   - AWS Console → S3 → Your bucket
   - Show uploaded files (index.html, main.js, etc.)
   - Properties tab showing static website hosting enabled

4. **CloudFront** (`screenshots/aws-cloudfront.png`):
   - AWS Console → CloudFront → Distributions
   - Show enabled distribution with your S3 origin

---

## Troubleshooting

### Issue: CircleCI Build Fails - "Permission Denied"

**Solution**:
- Check AWS credentials in CircleCI environment variables
- Verify IAM user has required permissions
- Ensure no typos in variable names

### Issue: Frontend Deploy Fails - "Access Denied to S3"

**Solution**:
```bash
# Check bucket policy
aws s3api get-bucket-policy --bucket your-app-frontend-prod

# Re-apply public access
aws s3api put-public-access-block `
  --bucket your-app-frontend-prod `
  --public-access-block-configuration BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false
```

### Issue: Backend Deploy Fails - "EB Environment Not Found"

**Solution**:
```bash
# Check EB environment name
eb list

# Update environment name in CircleCI
# Should match exactly: your-app-backend-prod
```

### Issue: Database Connection Failed

**Solution**:
- Check RDS security group allows inbound traffic from EB security group
- Verify DATABASE_URL is correct in EB environment variables
- Test connection manually:
```bash
psql postgresql://dbadmin:password@endpoint:5432/postgres
```

### Issue: Tests Failing in CI

**Solution**:
```bash
# Run tests locally first
npm test

# For Angular: Update karma.conf.js for CI
browsers: ['ChromeHeadless']

# For Node: Ensure test script in package.json
"test": "jest --ci --coverage"
```

### Issue: CloudFront Not Serving Updated Files

**Solution**:
```bash
# Invalidate cache
aws cloudfront create-invalidation `
  --distribution-id E1234567890ABC `
  --paths "/*"

# Wait 2-3 minutes for propagation
```

---

## Next Steps

1. ✅ **Add actual screenshots** to replace .md placeholders
2. ✅ **Update README.md** with real URLs
3. ✅ **Add build status badge** to README
4. ✅ **Test complete deployment flow** end-to-end
5. ✅ **Document any custom configuration** specific to your app

---

## Additional Resources

- [CircleCI Documentation](https://circleci.com/docs/)
- [AWS Elastic Beanstalk Guide](https://docs.aws.amazon.com/elasticbeanstalk/)
- [AWS S3 Static Hosting](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
- [AWS RDS PostgreSQL](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_PostgreSQL.html)

---

**Created**: November 3, 2025  
**Last Updated**: November 3, 2025  
**Version**: 1.0
