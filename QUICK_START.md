# Deployment Project - Quick Start Guide

This guide will help you prepare your full-stack application for final submission.

---

## ✅ What's Already Done

All the required documentation and configuration files have been created in the `deployment` folder:

### 1. Configuration Files
- ✅ `.circleci/config.yml` - Complete CircleCI pipeline configuration
- ✅ `package.json` - Root-level package manager for workspaces

### 2. Documentation (docs/)
- ✅ `architecture_diagram.md` - High-level infrastructure overview
- ✅ `pipeline_diagram.md` - CI/CD pipeline flow visualization
- ✅ `Infrastructure_description.md` - Detailed AWS services documentation
- ✅ `Pipeline_description.md` - Step-by-step pipeline explanation
- ✅ `Application_dependencies.md` - Complete dependency listing

### 3. Main Documentation
- ✅ `README.md` - Comprehensive project documentation

### 4. Screenshots Folder
- ✅ `screenshots/` - Placeholder files for required screenshots

---

## 🔧 Next Steps to Complete

### Step 1: Set Up Your Project Structure

Move the files from the `deployment` folder to your actual project root:

```powershell
# If your project is in a different location, copy files there
# Example:
Copy-Item -Path "C:\deployment\*" -Destination "C:\your-project\" -Recurse
```

Your final project structure should look like:

```
your-project/
├── .circleci/
│   └── config.yml
├── frontend/
│   ├── src/
│   ├── package.json
│   └── angular.json
├── backend/
│   ├── src/
│   ├── package.json
│   └── .ebextensions/
├── docs/
│   ├── architecture_diagram.md
│   ├── pipeline_diagram.md
│   ├── Infrastructure_description.md
│   ├── Pipeline_description.md
│   └── Application_dependencies.md
├── screenshots/
│   ├── circleci-build.png
│   ├── circleci-hold.png
│   ├── circleci-deploy.png
│   ├── aws-rds.png
│   ├── aws-elasticbeanstalk.png
│   └── aws-s3.png
├── package.json
└── README.md
```

### Step 2: Configure CircleCI

1. **Connect Repository to CircleCI**
   - Go to https://circleci.com
   - Connect your GitHub repository
   - CircleCI will automatically detect `.circleci/config.yml`

2. **Set Environment Variables**
   
   Go to Project Settings → Environment Variables and add:
   
   ```
   AWS_ACCESS_KEY_ID=<your-aws-access-key>
   AWS_SECRET_ACCESS_KEY=<your-aws-secret-key>
   AWS_REGION=us-east-1
   AWS_S3_BUCKET=<your-s3-bucket-name>
   CLOUDFRONT_DISTRIBUTION_ID=<your-cloudfront-id>
   EB_ENVIRONMENT_NAME=<your-eb-environment-name>
   DATABASE_URL=<your-rds-connection-string>
   ```

### Step 3: Set Up AWS Infrastructure

Follow the detailed instructions in `docs/Infrastructure_description.md` to create:

1. **RDS Database**
   ```bash
   aws rds create-db-instance \
     --db-instance-identifier your-app-db-prod \
     --db-instance-class db.t3.medium \
     --engine postgres \
     --master-username dbadmin \
     --master-user-password <secure-password> \
     --allocated-storage 100
   ```

2. **S3 Bucket for Frontend**
   ```bash
   aws s3 mb s3://your-app-frontend-prod
   aws s3 website s3://your-app-frontend-prod \
     --index-document index.html \
     --error-document index.html
   ```

3. **Elastic Beanstalk for Backend**
   ```bash
   cd backend
   eb init -p node.js-18 your-app-backend
   eb create your-app-backend-prod --instance-type t3.medium
   ```

4. **CloudFront Distribution (Optional)**
   ```bash
   aws cloudfront create-distribution \
     --origin-domain-name your-app-frontend-prod.s3.amazonaws.com
   ```

### Step 4: Update Configuration Files

1. **Update README.md**
   - Replace placeholder URLs with your actual application URLs
   - Add your specific application features
   - Update contact information

2. **Update .circleci/config.yml**
   - Verify Node.js version matches your project
   - Update test commands if different
   - Adjust build commands as needed

3. **Update package.json**
   - Add your actual project name and description
   - Update author information
   - Verify workspace paths match your structure

### Step 5: Prepare Frontend

In your `frontend/package.json`, ensure these scripts exist:

```json
{
  "scripts": {
    "start": "ng serve",
    "build": "ng build --configuration production",
    "test": "ng test",
    "test:ci": "ng test --watch=false --browsers=ChromeHeadless --code-coverage",
    "lint": "ng lint"
  }
}
```

### Step 6: Prepare Backend

In your `backend/package.json`, ensure these scripts exist:

```json
{
  "scripts": {
    "start": "node dist/server.js",
    "build": "tsc",
    "test": "jest",
    "lint": "eslint . --ext .ts"
  }
}
```

Create `backend/.ebextensions/nodecommand.config`:

```yaml
option_settings:
  aws:elasticbeanstalk:container:nodejs:
    NodeCommand: "npm start"
  aws:elasticbeanstalk:application:environment:
    NODE_ENV: production
```

### Step 7: Test Locally

Before pushing to CircleCI:

```powershell
# Install dependencies
npm run install:all

# Run tests
npm run test:all

# Build everything
npm run build:all
```

### Step 8: First Deployment

1. **Push to develop branch (Staging)**
   ```bash
   git checkout -b develop
   git add .
   git commit -m "Initial deployment setup"
   git push origin develop
   ```
   
   This will trigger automatic deployment to staging.

2. **Push to main branch (Production)**
   ```bash
   git checkout main
   git merge develop
   git push origin main
   ```
   
   This will trigger the pipeline with manual approval gate.

### Step 9: Capture Screenshots

After successful deployment:

1. **CircleCI Screenshots**
   - Go to CircleCI dashboard
   - Navigate to your workflow
   - Take screenshots of Build, Hold, and Deploy phases
   - Save as PNG files in `screenshots/` folder

2. **AWS Screenshots**
   - Log in to AWS Console
   - Take screenshots of:
     - RDS database overview
     - Elastic Beanstalk environment
     - S3 bucket with files
     - CloudFront distribution (optional)
   - Save as PNG files in `screenshots/` folder

3. **Update README.md**
   - Ensure screenshot references point to actual PNG files

### Step 10: Final Verification

Checklist before submission:

- [ ] `.circleci/config.yml` is in repository root
- [ ] Root-level `package.json` exists
- [ ] `README.md` includes:
  - [ ] Project overview
  - [ ] Working application URL
  - [ ] All screenshots referenced
- [ ] `docs/` folder contains all 5 required files
- [ ] `screenshots/` folder contains all required screenshots
- [ ] Application is deployed and accessible
- [ ] All tests pass in CircleCI
- [ ] Infrastructure is properly configured in AWS

---

## 🎯 Stand Out Features

The provided configuration includes these bonus features:

✅ **Frontend Unit Tests in CI**
- Configured in `.circleci/config.yml`
- Runs in headless Chrome
- Includes code coverage

✅ **Pull Request Builds**
- Automatically builds and tests every PR
- Ensures code quality before merging

✅ **Separate Environments**
- Staging: `develop` branch → automatic deployment
- Production: `main` branch → manual approval required

✅ **Zero Downtime Deployments**
- Rolling deployment strategy in Elastic Beanstalk
- CloudFront cache invalidation for frontend

---

## 🆘 Troubleshooting

### CircleCI Build Fails

1. Check the logs in CircleCI dashboard
2. Verify environment variables are set
3. Ensure `package.json` scripts match config.yml commands

### AWS Deployment Fails

1. Verify AWS credentials have correct permissions
2. Check security groups allow necessary traffic
3. Ensure S3 bucket exists and has correct permissions
4. Verify Elastic Beanstalk environment is healthy

### Database Connection Issues

1. Check RDS security group allows inbound from EB
2. Verify DATABASE_URL is correct
3. Ensure RDS instance is in "Available" state
4. Check VPC and subnet configuration

---

## 📚 Additional Resources

- [CircleCI Documentation](https://circleci.com/docs/)
- [AWS Elastic Beanstalk Guide](https://docs.aws.amazon.com/elasticbeanstalk/)
- [AWS S3 Static Website Hosting](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
- [Angular Deployment Guide](https://angular.io/guide/deployment)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

## 🎓 Submission Checklist

Final verification before submission:

### Required Files
- [x] `.circleci/config.yml`
- [x] Root-level `package.json`
- [x] `README.md` with all sections completed
- [x] `docs/architecture_diagram.md`
- [x] `docs/pipeline_diagram.md`
- [x] `docs/Infrastructure_description.md`
- [x] `docs/Pipeline_description.md`
- [x] `docs/Application_dependencies.md`

### Required Screenshots
- [ ] CircleCI Build Phase
- [ ] CircleCI Hold Phase
- [ ] CircleCI Deploy Phase
- [ ] AWS RDS Overview
- [ ] AWS Elastic Beanstalk
- [ ] AWS S3 Bucket

### Deployed Application
- [ ] Frontend is live and accessible
- [ ] Backend API is responding
- [ ] Database is connected and working
- [ ] All features are functional

---

**Good luck with your project! 🚀**

If you encounter any issues, refer to the detailed documentation in the `docs/` folder.
