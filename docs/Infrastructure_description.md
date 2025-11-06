# Infrastructure Description

This document describes the infrastructure services required to host and run the full-stack MyStore application.

---

## What Services Does This Project Need to Run?

The application requires **4 essential infrastructure services** to operate:

### 1. **AWS S3 (Simple Storage Service)** - Frontend Hosting

**Purpose**: Hosts the compiled Angular application as a static website

**Why We Need It**:
- Stores all frontend files (HTML, CSS, JavaScript, images)
- Serves the Angular single-page application to users
- Provides static website hosting capability
- Low-cost, highly available storage solution

**Configuration**:
- **Bucket Name**: `udacity-web-app`
- **Region**: `us-east-1`
- **Website Hosting**: Enabled with `index.html` as entry point
- **Public Access**: Files are publicly readable for website access
- **Content**: Angular build output from `dist/mystore-angular/browser/`

**Role in Application**: Users access the website through S3, which delivers the Angular frontend to their browsers.

---

### 2. **AWS Elastic Beanstalk** - Backend API Hosting

**Purpose**: Hosts and manages the Node.js/Express backend API

**Why We Need It**:
- Runs the Node.js 20 server application
- Manages EC2 instances automatically
- Handles load balancing and auto-scaling
- Provides easy deployment and monitoring
- Manages application health checks

**Configuration**:
- **Application Name**: `udacity-backend`
- **Environment Name**: `mystore-udacity`
- **Platform**: Node.js 20 running on Amazon Linux 2023
- **Instance Type**: Auto-scaled EC2 instances
- **Port**: 8080 (Node.js server)

**What It Runs**:
- Express.js REST API server
- JWT authentication middleware
- Business logic for orders, products, users
- Database connection pooling

**Role in Application**: Processes all API requests from the frontend, handles authentication, manages business logic, and communicates with the database.

---

### 3. **AWS RDS (Relational Database Service)** - PostgreSQL Database

**Purpose**: Managed PostgreSQL database for persistent data storage

**Why We Need It**:
- Stores all application data (users, products, orders)
- Provides reliable, managed database service
- Handles automatic backups and updates
- Ensures data persistence across deployments

**Configuration**:
- **Database Identifier**: `udacity-app`
- **Engine**: PostgreSQL 16.3
- **Instance Class**: db.t3.micro (or higher for production)
- **Storage**: General Purpose SSD
- **Endpoint**: `udacity-app.c5y4doddjbye.us-east-1.rds.amazonaws.com:5432`

**Database Schema**:
- `users` table - User accounts and authentication
- `products` table - Product catalog
- `orders` table - Customer orders
- `order_products` table - Order line items (many-to-many relationship)

**Role in Application**: Stores all persistent data and provides ACID-compliant transactions for data integrity.

---

### 4. **CircleCI** - CI/CD Pipeline Infrastructure

**Purpose**: Automated build, test, and deployment pipeline

**Why We Need It**:
- Automates the entire deployment process
- Runs tests automatically on every code push
- Builds both frontend and backend applications
- Deploys to AWS infrastructure automatically
- Provides manual approval gates for production

**What CircleCI Does**:
1. **Build Phase**: Compiles TypeScript, builds Angular app
2. **Test Phase**: Runs 81 frontend + 21 backend unit tests
3. **Deploy Phase**: Pushes code to S3 and Elastic Beanstalk
4. **Environment Management**: Sets environment variables in EB

**Role in Application**: Serves as the automation layer that connects development to production, ensuring code quality through testing and enabling rapid, reliable deployments.

---

### 5. **AWS CloudFront (Optional but Recommended)** - CDN

**Purpose**: Content Delivery Network for faster global access

**Why We Need It**:
- Caches frontend assets at edge locations worldwide
- Reduces latency for users far from S3 bucket
- Provides HTTPS support with free SSL certificates
- Improves performance and reduces S3 costs

**Configuration**:
- **Distribution ID**: `E2R5142O5YUCP`
- **Origin**: S3 bucket (`udacity-web-app`)
- **Cache Behavior**: Cache frontend assets, invalidate on deployment

**Role in Application**: Accelerates content delivery to end users by serving cached content from the nearest edge location.

---

## Infrastructure Architecture Summary

The application uses a **three-tier architecture**:

### **Presentation Tier** (Frontend)
```
Users → CloudFront (CDN) → S3 (Angular App)
```
- Serves the user interface
- Handles client-side routing
- Makes API calls to backend

### **Application Tier** (Backend)
```
Frontend → Elastic Beanstalk (Node.js API)
```
- Processes business logic
- Handles authentication (JWT)
- Validates requests
- Queries database

### **Data Tier** (Database)
```
Backend API → RDS PostgreSQL (Data Storage)
```
- Stores persistent data
- Manages data relationships
- Ensures data integrity

---

## AWS Services Used

### 1. Amazon S3 (Simple Storage Service)

**Purpose**: Host the Angular frontend application as a static website

#### Configuration

- **Bucket Name**: `your-app-frontend-prod` / `your-app-frontend-staging`
- **Region**: `us-east-1` (or your preferred region)
- **Access**: Public read access for website hosting
- **Versioning**: Enabled for rollback capability
- **Lifecycle Policy**: Archive old versions after 30 days

#### Setup Steps

```bash
# Create S3 bucket
aws s3 mb s3://your-app-frontend-prod

# Enable static website hosting
aws s3 website s3://your-app-frontend-prod \
  --index-document index.html \
  --error-document index.html

# Set bucket policy for public access
aws s3api put-bucket-policy \
  --bucket your-app-frontend-prod \
  --policy file://bucket-policy.json
```

#### Bucket Policy Example

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-app-frontend-prod/*"
    }
  ]
}
```

#### Cost Estimate
- Storage: ~$0.023 per GB/month
- Requests: $0.0004 per 1,000 GET requests
- Data Transfer: First 100GB free per month

---

### 2. Amazon CloudFront (CDN)

**Purpose**: Content Delivery Network for fast global access to frontend

#### Configuration

- **Distribution Type**: Web
- **Origin**: S3 bucket (your-app-frontend-prod)
- **Price Class**: Use All Edge Locations (or customize based on target audience)
- **SSL Certificate**: AWS Certificate Manager (free)
- **Default Root Object**: `index.html`
- **Error Pages**: Redirect 404 to `index.html` (for Angular routing)

#### Setup Steps

```bash
# Create CloudFront distribution
aws cloudfront create-distribution \
  --origin-domain-name your-app-frontend-prod.s3.amazonaws.com \
  --default-root-object index.html
```

#### Custom Error Responses

- **404 Error**: Redirect to `/index.html` with 200 status (for SPA routing)
- **403 Error**: Redirect to `/index.html` with 200 status

#### Cost Estimate
- Data Transfer: $0.085 per GB (first 10TB/month)
- HTTPS Requests: $0.0100 per 10,000 requests

---

### 3. AWS Elastic Beanstalk

**Purpose**: Host and manage the Node.js/Express backend API

#### Configuration

**Application Settings:**
- **Platform**: Node.js 18 running on Amazon Linux 2
- **Environment Type**: Load Balanced, Auto Scaling
- **Instance Type**: t3.medium (production), t3.small (staging)
- **Deployment Policy**: Rolling with additional batch
- **Health Check URL**: `/api/health`

**Auto Scaling:**
- **Min Instances**: 2 (production), 1 (staging)
- **Max Instances**: 10 (production), 3 (staging)
- **Scale Up**: CPU > 75% for 5 minutes
- **Scale Down**: CPU < 25% for 10 minutes

#### Setup Steps

```bash
# Initialize Elastic Beanstalk
eb init -p node.js-18 your-app-backend

# Create environment
eb create your-app-backend-prod \
  --instance-type t3.medium \
  --envvars NODE_ENV=production,DATABASE_URL=<your-rds-url>

# Configure auto-scaling
eb scale 2
```

#### Environment Variables

```
NODE_ENV=production
PORT=8080
DATABASE_URL=postgresql://user:pass@rds-endpoint:5432/dbname
JWT_SECRET=<your-jwt-secret>
AWS_REGION=us-east-1
CORS_ORIGIN=https://your-frontend-domain.com
```

#### .ebextensions Configuration

Create `.ebextensions/nodecommand.config`:

```yaml
option_settings:
  aws:elasticbeanstalk:container:nodejs:
    NodeCommand: "npm start"
  aws:elasticbeanstalk:application:environment:
    NODE_ENV: production
```

#### Cost Estimate
- EC2 Instances (t3.medium): ~$0.0416/hour × 2 = ~$60/month
- Load Balancer: ~$20/month
- Data Transfer: Variable

---

### 4. Amazon RDS (Relational Database Service)

**Purpose**: Managed PostgreSQL database for persistent data storage

#### Configuration

**Database Settings:**
- **Engine**: PostgreSQL 14.x or later
- **Instance Class**: db.t3.medium (production), db.t3.small (staging)
- **Storage**: 100 GB General Purpose SSD (gp3)
- **Storage Autoscaling**: Enabled (max 500 GB)
- **Multi-AZ**: Enabled for production
- **Backup Retention**: 7 days (production), 3 days (staging)

**Security:**
- **VPC**: Default or custom VPC
- **Subnet Group**: Private subnets across multiple AZs
- **Security Group**: Allow access only from Elastic Beanstalk instances
- **Encryption**: Enabled at rest and in transit

#### Setup Steps

```bash
# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier your-app-db-prod \
  --db-instance-class db.t3.medium \
  --engine postgres \
  --master-username dbadmin \
  --master-user-password <secure-password> \
  --allocated-storage 100 \
  --storage-type gp3 \
  --multi-az \
  --backup-retention-period 7 \
  --vpc-security-group-ids sg-xxxxxx
```

#### Database Credentials Management

Store credentials in **AWS Secrets Manager**:

```bash
aws secretsmanager create-secret \
  --name prod/app/database \
  --secret-string '{"username":"dbadmin","password":"<secure-password>","host":"<rds-endpoint>","port":"5432","database":"appdb"}'
```

#### Backup Strategy

- **Automated Backups**: Daily during maintenance window
- **Manual Snapshots**: Before major deployments
- **Retention**: 7 days for automated, indefinite for manual
- **Cross-Region Backup**: Optional for disaster recovery

#### Cost Estimate
- db.t3.medium: ~$0.068/hour = ~$50/month
- Storage: 100GB × $0.115/GB-month = ~$12/month
- Backup Storage: First 100GB free

---

### 5. Amazon VPC (Virtual Private Cloud)

**Purpose**: Network isolation and security

#### Configuration

**VPC Settings:**
- **CIDR Block**: 10.0.0.0/16
- **Public Subnets**: 2 subnets across 2 AZs (10.0.1.0/24, 10.0.2.0/24)
- **Private Subnets**: 2 subnets across 2 AZs (10.0.10.0/24, 10.0.11.0/24)
- **Internet Gateway**: For public subnet access
- **NAT Gateway**: For private subnet outbound access

#### Security Groups

**Frontend (S3/CloudFront):**
- No security group needed (public access)

**Backend (Elastic Beanstalk):**
- **Inbound Rules:**
  - HTTP (80) from Application Load Balancer
  - HTTPS (443) from Application Load Balancer
- **Outbound Rules:**
  - PostgreSQL (5432) to RDS security group
  - HTTPS (443) to internet (for API calls)

**Database (RDS):**
- **Inbound Rules:**
  - PostgreSQL (5432) from Elastic Beanstalk security group
- **Outbound Rules:**
  - None required

#### Setup

```bash
# Create VPC
aws ec2 create-vpc --cidr-block 10.0.0.0/16

# Create subnets
aws ec2 create-subnet --vpc-id vpc-xxx --cidr-block 10.0.1.0/24 --availability-zone us-east-1a
aws ec2 create-subnet --vpc-id vpc-xxx --cidr-block 10.0.2.0/24 --availability-zone us-east-1b
```

---

### 6. Application Load Balancer (ALB)

**Purpose**: Distribute traffic across backend instances

#### Configuration

- **Type**: Application Load Balancer
- **Scheme**: Internet-facing
- **Listeners**: HTTP (80) and HTTPS (443)
- **Target Groups**: Elastic Beanstalk instances
- **Health Check**: `/api/health` endpoint
- **Stickiness**: Enabled (session affinity)

#### SSL/TLS Certificate

Use **AWS Certificate Manager** for free SSL certificates:

```bash
# Request certificate
aws acm request-certificate \
  --domain-name api.yourdomain.com \
  --validation-method DNS
```

---

### 7. Amazon Route 53 (DNS)

**Purpose**: Domain name management and routing

#### Configuration

**Hosted Zone:**
- Domain: `yourdomain.com`

**DNS Records:**
- `yourdomain.com` (A) → CloudFront distribution
- `www.yourdomain.com` (CNAME) → CloudFront distribution
- `api.yourdomain.com` (A) → Elastic Beanstalk environment

#### Setup

```bash
# Create hosted zone
aws route53 create-hosted-zone --name yourdomain.com

# Create A record for CloudFront
aws route53 change-resource-record-sets \
  --hosted-zone-id Z1234567890ABC \
  --change-batch file://cloudfront-alias.json
```

---

### 8. AWS CloudWatch

**Purpose**: Monitoring, logging, and alerting

#### Configuration

**Metrics to Monitor:**
- EC2 CPU Utilization
- RDS Database Connections
- ALB Response Time
- S3 Request Count
- CloudFront Error Rate

**Alarms:**
- High CPU (> 80% for 5 minutes)
- Database connections (> 80% of max)
- API error rate (> 5%)

**Log Groups:**
- `/aws/elasticbeanstalk/your-app-backend-prod/var/log/nodejs/nodejs.log`
- `/aws/rds/instance/your-app-db-prod/postgresql`

---

### 9. AWS IAM (Identity and Access Management)

**Purpose**: Access control and permissions

#### Required Roles

**1. Elastic Beanstalk Service Role:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "elasticbeanstalk:*",
        "ec2:*",
        "s3:*",
        "cloudformation:*",
        "autoscaling:*",
        "elasticloadbalancing:*"
      ],
      "Resource": "*"
    }
  ]
}
```

**2. EC2 Instance Profile:**
- Access to S3 for deployment packages
- Access to CloudWatch for logs
- Access to Secrets Manager for database credentials

**3. CircleCI Deployment User:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket",
        "cloudfront:CreateInvalidation",
        "elasticbeanstalk:*"
      ],
      "Resource": "*"
    }
  ]
}
```

---

## Infrastructure Cost Summary

### Monthly Cost Estimate (Production)

| Service              | Configuration      | Estimated Cost |
|----------------------|--------------------|----------------|
| EC2 (t3.medium × 2)  | 2 instances        | $60/month      |
| RDS (db.t3.medium)   | Multi-AZ           | $62/month      |
| S3                   | 10GB storage       | $1/month       |
| CloudFront           | 1TB data transfer  | $85/month      |
| Load Balancer        | Application LB     | $20/month      |
| Data Transfer        | Variable           | $10/month      |
| **Total**            |                    | **~$238/month**|

### Monthly Cost Estimate (Staging)

| Service              | Configuration      | Estimated Cost |
|----------------------|--------------------|----------------|
| EC2 (t3.small × 1)   | 1 instance         | $15/month      |
| RDS (db.t3.small)    | Single-AZ          | $25/month      |
| S3                   | 5GB storage        | $1/month       |
| Load Balancer        | Application LB     | $20/month      |
| **Total**            |                    | **~$61/month** |

---

## High Availability & Disaster Recovery

### High Availability Features

1. **Multi-AZ RDS**: Automatic failover in case of AZ failure
2. **Auto Scaling**: Maintains application availability during traffic spikes
3. **Load Balancer**: Health checks and traffic distribution
4. **CloudFront**: Global edge locations for frontend availability

### Disaster Recovery Strategy

1. **RDS Automated Backups**: Daily backups with 7-day retention
2. **S3 Versioning**: Rollback capability for frontend
3. **Elastic Beanstalk Versions**: Keep last 10 application versions
4. **Cross-Region Backup**: Optional RDS snapshot copy to another region

### Recovery Time Objectives (RTO) and Recovery Point Objectives (RPO)

- **RTO**: < 1 hour (time to restore service)
- **RPO**: < 5 minutes (acceptable data loss)

---

## Security Best Practices

✅ **Encryption**: All data encrypted in transit (TLS) and at rest  
✅ **Least Privilege**: IAM roles with minimal required permissions  
✅ **Network Isolation**: RDS in private subnets, no direct internet access  
✅ **Secrets Management**: Database credentials in AWS Secrets Manager  
✅ **Security Groups**: Strict inbound/outbound rules  
✅ **WAF**: Optional Web Application Firewall for CloudFront  
✅ **Regular Updates**: Automated security patches via Elastic Beanstalk  

---

## Infrastructure as Code

Consider using **AWS CloudFormation** or **Terraform** to manage infrastructure:

```bash
# Example: Deploy with CloudFormation
aws cloudformation create-stack \
  --stack-name fullstack-app-infrastructure \
  --template-body file://infrastructure.yml \
  --parameters file://parameters.json
```

---

## Maintenance Windows

- **RDS Maintenance**: Sunday 03:00-04:00 UTC
- **Elastic Beanstalk Updates**: Rolling deployments during business hours
- **Planned Downtime**: None (zero-downtime deployments)

---

**Note**: All resource names, regions, and configurations should be adjusted based on your specific requirements and organizational policies.
