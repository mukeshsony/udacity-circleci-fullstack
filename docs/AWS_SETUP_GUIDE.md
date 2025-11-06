# AWS Infrastructure Setup Guide

This guide will walk you through setting up all the required AWS resources for the Udacity Full Stack project.

## Prerequisites
- AWS Account with administrative access
- AWS CLI installed and configured
- PostgreSQL client installed (for testing database connection)

---

## Table of Contents
1. [IAM User Setup](#1-iam-user-setup)
2. [S3 Bucket Setup](#2-s3-bucket-setup)
3. [RDS PostgreSQL Database](#3-rds-postgresql-database)
4. [Elastic Beanstalk Environment](#4-elastic-beanstalk-environment)
5. [CloudFront Distribution](#5-cloudfront-distribution)
6. [Environment Variables Configuration](#6-environment-variables-configuration)

---

## 1. IAM User Setup

### Create IAM User for CircleCI Deployment

1. **Navigate to IAM Console**
   - Go to AWS Console → IAM → Users → Add User

2. **User Details**
   - **User name**: `circleci-deployer`
   - **Access type**: ✅ Programmatic access

3. **Set Permissions**
   - Choose: **Attach existing policies directly**
   - Select the following policies:
     - ✅ `AmazonS3FullAccess`
     - ✅ `CloudFrontFullAccess`
     - ✅ `AWSElasticBeanstalkFullAccess`
     - ✅ `AmazonRDSFullAccess` (for database management)

4. **Tags** (Optional)
   - Key: `Project` | Value: `udacity-fullstack`
   - Key: `Purpose` | Value: `CircleCI Deployment`

5. **Review and Create**
   - Click **Create user**
   - **⚠️ IMPORTANT**: Download and save the credentials:
     - Access Key ID
     - Secret Access Key

6. **Save Credentials Securely**
   ```
   AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXX
   AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxx
   ```

---

## 2. S3 Bucket Setup

### Create S3 Bucket for Frontend Hosting

1. **Navigate to S3 Console**
   - AWS Console → S3 → Create bucket

2. **General Configuration**
   | Field | Value |
   |-------|-------|
   | Bucket name | `udacity-web-app` (must be globally unique) |
   | AWS Region | `us-east-1` (or your preferred region) |

3. **Object Ownership**
   - ✅ **ACLs enabled**
   - ✅ **Bucket owner preferred**

4. **Block Public Access**
   - ❌ **Uncheck** "Block all public access"
   - ✅ Acknowledge the warning

5. **Remaining Settings**
   - Versioning: **Disabled**
   - Encryption: **Disabled** (or use default)
   - Click **Create bucket**

### Configure Bucket Policy

1. **Go to Permissions Tab**
   - Select your bucket → **Permissions** → **Bucket Policy**

2. **Add Bucket Policy**
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::udacity-web-app/*"
       }
     ]
   }
   ```
   ⚠️ Replace `udacity-web-app` with your actual bucket name

### Configure CORS

1. **Go to Permissions Tab**
   - Select your bucket → **Permissions** → **Cross-origin resource sharing (CORS)**

2. **Add CORS Configuration**
   ```json
   [
     {
       "AllowedHeaders": [
         "*",
         "Content-Type",
         "Authorization",
         "Access-Control-Allow-Origin",
         "Access-Control-Allow-Headers",
         "Access-Control-Allow-Methods"
       ],
       "AllowedMethods": [
         "POST",
         "GET",
         "PUT",
         "DELETE",
         "HEAD"
       ],
       "AllowedOrigins": [
         "*"
       ],
       "ExposeHeaders": []
     }
   ]
   ```

### Enable Static Website Hosting

1. **Go to Properties Tab**
   - Select your bucket → **Properties** → **Static website hosting**

2. **Configure Static Hosting**
   - ✅ **Enable**
   - Hosting type: **Host a static website**
   - Index document: `index.html`
   - Error document: `index.html` (for Angular routing)

3. **Save Settings**
   - Note the **S3 website endpoint**: `http://udacity-web-app.s3-website-us-east-1.amazonaws.com`

---

## 3. RDS PostgreSQL Database

### Create PostgreSQL Database

1. **Navigate to RDS Console**
   - AWS Console → RDS → Databases → Create database

2. **Database Creation Method**
   - Choose: ✅ **Standard create**

3. **Engine Options**
   - Engine type: ✅ **PostgreSQL**
   - Version: **PostgreSQL 13.x** or **14.x**

4. **Templates**
   - ✅ **Free tier** (for learning/testing)

5. **Settings**
   | Field | Value |
   |-------|-------|
   | DB instance identifier | `udacity-app` |
   | Master username | `postgres` |
   | Master password | `YOUR_SECURE_PASSWORD_HERE` (choose a strong password) |

6. **Instance Configuration**
   | Field | Value |
   |-------|-------|
   | DB instance class | `db.t3.micro` (free tier eligible) |

7. **Storage**
   | Field | Value |
   |-------|-------|
   | Allocated storage | `20 GiB` |
   | Storage type | `General Purpose SSD (gp2)` |
   | Enable storage autoscaling | ❌ Uncheck (for cost control) |

8. **Connectivity**
   | Field | Value |
   |-------|-------|
   | VPC | Default VPC |
   | Subnet group | Default |
   | **Public access** | ✅ **Yes** (important for external access) |
   | VPC security group | Create new or use existing |
   | Availability Zone | No preference |
   | Database port | `5432` |

9. **Additional Configuration**
   | Field | Value |
   |-------|-------|
   | Initial database name | `postgres` |
   | Backup retention period | `1 day` (minimum) |
   | Enable encryption | ❌ Disable (for simplicity) |

10. **Create Database**
    - Review all settings
    - Click **Create database**
    - Wait 5-10 minutes for creation

### Configure Security Group

1. **Edit Inbound Rules**
   - Go to RDS → Your database → **Connectivity & security**
   - Click on the **VPC security group**
   - Click **Edit inbound rules**

2. **Add Inbound Rule**
   | Type | Protocol | Port | Source | Description |
   |------|----------|------|--------|-------------|
   | PostgreSQL | TCP | 5432 | `0.0.0.0/0` | Allow from anywhere |
   | PostgreSQL | TCP | 5432 | `::/0` | Allow IPv6 |

   ⚠️ **Security Note**: For production, restrict to specific IPs/security groups

3. **Save Rules**

### Test Database Connection

1. **Get Database Endpoint**
   - Go to RDS → Your database → **Connectivity & security**
   - Copy the **Endpoint**: `udacity-app.c5y4doddjbye.us-east-1.rds.amazonaws.com`

2. **Test from Local Machine**
   ```bash
   # Test connection using psql
   psql -h udacity-app.c5y4doddjbye.us-east-1.rds.amazonaws.com -U postgres -d postgres
   
   # Enter password when prompted
   ```

3. **Verify Connection**
   ```sql
   -- List databases
   \list
   
   -- Show current database
   SELECT current_database();
   
   -- Exit
   \q
   ```

### Database Connection Details
Save these for later use:
```
DB_HOST=udacity-app.c5y4doddjbye.us-east-1.rds.amazonaws.com
DB_PORT=5432
DB_NAME=postgres
DB_USERNAME=postgres
DB_PASSWORD=YOUR_SECURE_PASSWORD_HERE
```

**Connection String Format:**
```
postgresql://postgres:YOUR_SECURE_PASSWORD_HERE@udacity-app.c5y4doddjbye.us-east-1.rds.amazonaws.com:5432/postgres
```

---

## 4. Elastic Beanstalk Environment

### Create Elastic Beanstalk Application

1. **Navigate to Elastic Beanstalk Console**
   - AWS Console → Elastic Beanstalk → Create Application

2. **Application Information**
   | Field | Value |
   |-------|-------|
   | Application name | `udacity-backend` |
   | Platform | **Node.js** |
   | Platform branch | **Node.js 18 running on 64bit Amazon Linux 2** |
   | Platform version | Latest |

3. **Application Code**
   - ✅ **Sample application** (for initial setup)

4. **Configure More Options** (Optional)
   - Preset: **Single instance (free tier eligible)**
   - Click **Create application**

### Create Environment

1. **After Application Creation**
   - Click **Create a new environment**

2. **Select Environment Tier**
   - ✅ **Web server environment**

3. **Environment Information**
   | Field | Value |
   |-------|-------|
   | Environment name | `udacity-backend-prod` |
   | Domain | Auto-generated or custom |

4. **Platform**
   - Platform: **Node.js**
   - Keep defaults

5. **Application Code**
   - Use existing or upload new

6. **Presets**
   - ✅ **Single instance (free tier eligible)**

7. **Create Environment**
   - Wait 5-10 minutes for environment creation

### Configure Environment Variables

1. **Go to Configuration**
   - Select your environment → **Configuration** → **Software** → **Edit**

2. **Add Environment Properties**
   ```
   NODE_ENV=production
   POSTGRES_HOST=udacity-app.c5y4doddjbye.us-east-1.rds.amazonaws.com
   POSTGRES_PORT=5432
   POSTGRES_DB=postgres
   POSTGRES_USERNAME=postgres
   POSTGRES_PASSWORD=YOUR_SECURE_PASSWORD_HERE
   JWT_SECRET=YOUR_GENERATED_JWT_SECRET_HERE
   ```

3. **Apply Changes**

### Get Environment Details

Save these for CircleCI:
```
EB_APP_NAME=udacity-backend
EB_ENV_NAME=udacity-backend-prod
EB_URL=udacity-backend-prod.us-east-1.elasticbeanstalk.com
```

---

## 5. CloudFront Distribution

### Create CloudFront Distribution

1. **Navigate to CloudFront Console**
   - AWS Console → CloudFront → Create Distribution

2. **Origin Settings**
   | Field | Value |
   |-------|-------|
   | Origin domain | Select your S3 bucket website endpoint |
   | Origin path | Leave empty |
   | Name | Auto-generated |

3. **Default Cache Behavior**
   | Field | Value |
   |-------|-------|
   | Viewer protocol policy | **Redirect HTTP to HTTPS** |
   | Allowed HTTP methods | **GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE** |
   | Cache policy | **CachingOptimized** |

4. **Settings**
   | Field | Value |
   |-------|-------|
   | Price class | **Use all edge locations (best performance)** |
   | Alternate domain name (CNAME) | Leave empty (or add custom domain) |
   | SSL certificate | **Default CloudFront certificate** |
   | Default root object | `index.html` |

5. **Create Distribution**
   - Click **Create distribution**
   - Wait 15-20 minutes for deployment
   - Status will change from "In Progress" to "Enabled"

### Configure Custom Error Pages (for Angular SPA)

1. **Go to Error Pages Tab**
   - Select your distribution → **Error Pages** → **Create Custom Error Response**

2. **Add Custom Error Response**
   | Field | Value |
   |-------|-------|
   | HTTP error code | `403: Forbidden` |
   | Customize error response | ✅ Yes |
   | Response page path | `/index.html` |
   | HTTP response code | `200: OK` |

3. **Add Another for 404**
   | Field | Value |
   |-------|-------|
   | HTTP error code | `404: Not Found` |
   | Customize error response | ✅ Yes |
   | Response page path | `/index.html` |
   | HTTP response code | `200: OK` |

### Get Distribution Details

Save these for CircleCI:
```
AWS_CLOUDFRONT_DISTRIBUTION_ID=E2R5142O5YUCP
CLOUDFRONT_URL=https://d1234abcd5678.cloudfront.net
```

---

## 6. Environment Variables Configuration

### For Local Development

Create `set_env.sh` file in your project root:

```bash
#!/bin/bash

# AWS Configuration
export AWS_REGION=us-east-1
export AWS_PROFILE=default
export AWS_BUCKET=udacity-web-app

# PostgreSQL Database
export POSTGRES_HOST=udacity-app.c5y4doddjbye.us-east-1.rds.amazonaws.com
export POSTGRES_PORT=5432
export POSTGRES_DB=postgres
export POSTGRES_USERNAME=postgres
export POSTGRES_PASSWORD=YOUR_SECURE_PASSWORD_HERE

# Application Configuration
export JWT_SECRET=YOUR_GENERATED_JWT_SECRET_HERE
export NODE_ENV=development
export PORT=8080

# S3 Configuration
export AWS_S3_BUCKET=udacity-web-app

# Elastic Beanstalk
export EB_APP_NAME=udacity-backend
export EB_ENV_NAME=udacity-backend-prod

# CloudFront
export AWS_CLOUDFRONT_DISTRIBUTION_ID=E2R5142O5YUCP

echo "Environment variables set successfully!"
```

**Usage:**
```bash
# Make executable
chmod +x set_env.sh

# Run in your terminal
source set_env.sh

# Verify
echo $POSTGRES_HOST
```

**Prevent Committing Credentials:**
```bash
# Stop tracking
git rm --cached set_env.sh

# Add to .gitignore
echo "*set_env.sh" >> .gitignore
echo "aws config.txt" >> .gitignore
```

### For CircleCI

Add these environment variables in CircleCI Project Settings:

1. **Go to CircleCI**
   - Your Project → Project Settings → Environment Variables

2. **Add Variables:**

   **AWS Credentials:**
   ```
   AWS_ACCESS_KEY_ID=<your-access-key-id>
   AWS_SECRET_ACCESS_KEY=<your-secret-access-key>
   AWS_DEFAULT_REGION=us-east-1
   ```

   **S3 & CloudFront:**
   ```
   AWS_S3_BUCKET=udacity-web-app
   AWS_CLOUDFRONT_DISTRIBUTION_ID=E2R5142O5YUCP
   ```

   **Elastic Beanstalk:**
   ```
   EB_APP_NAME=udacity-backend
   EB_ENV_NAME=udacity-backend-prod
   ```

   **Database (Optional - if needed for migrations):**
   ```
   POSTGRES_HOST=udacity-app.c5y4doddjbye.us-east-1.rds.amazonaws.com
   POSTGRES_PORT=5432
   POSTGRES_DB=postgres
   POSTGRES_USERNAME=postgres
   POSTGRES_PASSWORD=YOUR_SECURE_PASSWORD_HERE
   ```

   **Application:**
   ```
   JWT_SECRET=YOUR_GENERATED_JWT_SECRET_HERE
   ```

---

## Summary Checklist

- ✅ IAM User created with appropriate permissions
- ✅ S3 bucket created with public access and CORS
- ✅ RDS PostgreSQL database created and accessible
- ✅ Elastic Beanstalk environment created and configured
- ✅ CloudFront distribution created and deployed
- ✅ Environment variables configured in CircleCI
- ✅ Local `set_env.sh` file created and tested
- ✅ Credentials secured and not committed to Git

---

## Quick Reference

### Your AWS Resources

| Resource | Value |
|----------|-------|
| **S3 Bucket** | `udacity-web-app` |
| **S3 Website URL** | `http://udacity-web-app.s3-website-us-east-1.amazonaws.com` |
| **RDS Endpoint** | `udacity-app.c5y4doddjbye.us-east-1.rds.amazonaws.com:5432` |
| **Database Name** | `postgres` |
| **EB Application** | `udacity-backend` |
| **EB Environment** | `udacity-backend-prod` |
| **EB URL** | `udacity-backend-prod.us-east-1.elasticbeanstalk.com` |
| **CloudFront ID** | `E2R5142O5YUCP` |
| **CloudFront URL** | `https://d1234abcd5678.cloudfront.net` |
| **AWS Region** | `us-east-1` |

---

## Troubleshooting

### Database Connection Issues
- Verify security group allows inbound traffic on port 5432
- Check RDS publicly accessible setting is enabled
- Verify credentials are correct
- Test with `psql` client first

### S3 Access Issues
- Verify bucket policy allows public read access
- Check CORS configuration is correct
- Ensure "Block all public access" is disabled

### Elastic Beanstalk Deployment Issues
- Check environment health in EB console
- View logs: EB Console → Logs → Request Logs
- Verify environment variables are set correctly
- Check Node.js version compatibility

### CloudFront Issues
- Wait for distribution to fully deploy (15-20 minutes)
- Check origin domain is correct S3 website endpoint
- Verify custom error responses are configured for SPA routing

---

## Security Best Practices

1. **Rotate credentials regularly**
2. **Use IAM roles instead of access keys when possible**
3. **Restrict database security group to specific IPs in production**
4. **Enable encryption for RDS in production**
5. **Use AWS Secrets Manager for sensitive credentials**
6. **Enable CloudFront logging for monitoring**
7. **Set up CloudWatch alarms for unusual activity**

---

## Cost Optimization Tips

1. **Stop RDS instance when not in use** (free tier: 750 hours/month)
2. **Delete unused S3 objects**
3. **Use S3 lifecycle policies** to transition to cheaper storage
4. **Set up billing alerts** in AWS
5. **Terminate unused Elastic Beanstalk environments**
6. **Use free tier resources** during development

---

## Next Steps

After completing this setup:

1. ✅ Update your application configuration files with the new endpoints
2. ✅ Test local application connectivity to RDS
3. ✅ Configure CircleCI environment variables
4. ✅ Test manual deployment to S3 and Elastic Beanstalk
5. ✅ Commit and push to trigger CircleCI pipeline
6. ✅ Monitor deployment in CircleCI dashboard
7. ✅ Verify application is accessible via CloudFront and EB URLs

---

## Additional Resources

- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [AWS RDS PostgreSQL Guide](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_PostgreSQL.html)
- [AWS Elastic Beanstalk Documentation](https://docs.aws.amazon.com/elasticbeanstalk/)
- [AWS CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/)
- [CircleCI Environment Variables](https://circleci.com/docs/env-vars/)

---

**Document Version**: 1.0  
**Last Updated**: November 6, 2025  
**Project**: Udacity Full Stack JavaScript Developer - CircleCI Deployment
