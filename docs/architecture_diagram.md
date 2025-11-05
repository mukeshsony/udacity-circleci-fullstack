# Architecture Diagram

## High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          End Users / Clients                         │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             │ HTTPS
                             ▼
                    ┌─────────────────┐
                    │   Amazon Route  │
                    │      53 (DNS)   │
                    └────────┬────────┘
                             │
                             ▼
        ┌────────────────────────────────────────┐
        │                                        │
        │    ┌────────────────────┐             │
        │    │  Amazon CloudFront │             │
        │    │       (CDN)        │             │
        │    └──────────┬─────────┘             │
        │               │                        │
        │               ▼                        │
        │    ┌────────────────────┐             │
        │    │    Amazon S3       │             │
        │    │  (Static Hosting)  │             │
        │    │                    │             │
        │    │  - Angular App     │             │
        │    │  - HTML/CSS/JS     │             │
        │    │  - Assets          │             │
        │    └────────────────────┘             │
        │                                        │
        │        Frontend Layer                 │
        └────────────────────────────────────────┘
                             │
                             │ API Calls (HTTPS)
                             ▼
        ┌────────────────────────────────────────┐
        │                                        │
        │    ┌────────────────────┐             │
        │    │ Application Load   │             │
        │    │     Balancer       │             │
        │    └──────────┬─────────┘             │
        │               │                        │
        │               ▼                        │
        │    ┌────────────────────┐             │
        │    │    AWS Elastic     │             │
        │    │    Beanstalk       │             │
        │    │                    │             │
        │    │  ┌──────────────┐  │             │
        │    │  │  Node.js API │  │             │
        │    │  │  (Express)   │  │             │
        │    │  └──────────────┘  │             │
        │    │                    │             │
        │    │  Auto Scaling      │             │
        │    │  EC2 Instances     │             │
        │    └──────────┬─────────┘             │
        │               │                        │
        │        Application Layer              │
        └───────────────┼────────────────────────┘
                        │
                        │ Database Queries
                        ▼
        ┌────────────────────────────────────────┐
        │                                        │
        │    ┌────────────────────┐             │
        │    │    Amazon RDS      │             │
        │    │   (PostgreSQL)     │             │
        │    │                    │             │
        │    │  - Primary DB      │             │
        │    │  - Read Replicas   │             │
        │    │  - Automated       │             │
        │    │    Backups         │             │
        │    └────────────────────┘             │
        │                                        │
        │         Database Layer                │
        └────────────────────────────────────────┘
                        │
                        │
                        ▼
        ┌────────────────────────────────────────┐
        │                                        │
        │    ┌────────────────────┐             │
        │    │   Amazon VPC       │             │
        │    │                    │             │
        │    │  - Security Groups │             │
        │    │  - Private Subnets │             │
        │    │  - Public Subnets  │             │
        │    │  - NAT Gateway     │             │
        │    └────────────────────┘             │
        │                                        │
        │      Network & Security Layer         │
        └────────────────────────────────────────┘


        ┌────────────────────────────────────────┐
        │                                        │
        │         CI/CD Pipeline                │
        │                                        │
        │    ┌────────────────────┐             │
        │    │     CircleCI       │             │
        │    │                    │             │
        │    │  - Build           │             │
        │    │  - Test            │             │
        │    │  - Deploy          │             │
        │    └──────────┬─────────┘             │
        │               │                        │
        │               ▼                        │
        │    ┌────────────────────┐             │
        │    │      GitHub        │             │
        │    │   (Source Code)    │             │
        │    └────────────────────┘             │
        │                                        │
        └────────────────────────────────────────┘
```

## Architecture Components

### 1. Frontend (Presentation Layer)
- **Amazon S3**: Hosts the compiled Angular application
- **Amazon CloudFront**: CDN for fast global content delivery
- **Route 53**: DNS service for domain management

### 2. Backend (Application Layer)
- **AWS Elastic Beanstalk**: Manages the Node.js/Express API
- **Application Load Balancer**: Distributes traffic across instances
- **Auto Scaling**: Automatically scales based on demand
- **EC2 Instances**: Compute resources running the application

### 3. Database (Data Layer)
- **Amazon RDS (PostgreSQL)**: Managed relational database
- **Read Replicas**: Improves read performance
- **Automated Backups**: Data protection and recovery

### 4. Security & Networking
- **Amazon VPC**: Isolated network environment
- **Security Groups**: Firewall rules for resources
- **IAM Roles**: Fine-grained access control

### 5. CI/CD Pipeline
- **CircleCI**: Automated build, test, and deployment
- **GitHub**: Version control and code repository

## Data Flow

1. **User Request**: User accesses the application via browser
2. **DNS Resolution**: Route 53 resolves domain to CloudFront
3. **Content Delivery**: CloudFront serves cached content from S3
4. **API Call**: Frontend makes API requests to Elastic Beanstalk
5. **Load Balancing**: ALB distributes request to available EC2 instance
6. **Processing**: Node.js API processes the request
7. **Database Query**: API queries PostgreSQL on RDS
8. **Response**: Data flows back through the layers to the user

## Security Features

- **HTTPS/TLS**: Encrypted communication at all layers
- **VPC Isolation**: Private subnets for database and application
- **Security Groups**: Restricted access between components
- **IAM Roles**: Principle of least privilege access
- **Secrets Manager**: Secure storage of database credentials
- **Regular Backups**: Automated RDS snapshots

## Scalability Features

- **Auto Scaling**: EC2 instances scale based on load
- **CDN**: CloudFront reduces origin server load
- **Read Replicas**: Database read operations can be distributed
- **Load Balancing**: Traffic distributed across multiple instances
- **Serverless Frontend**: S3 hosting scales automatically

## Monitoring & Logging

- **CloudWatch**: Application and infrastructure metrics
- **CloudWatch Logs**: Centralized log aggregation
- **X-Ray**: Distributed tracing for API requests
- **CloudTrail**: AWS API activity logging

## Disaster Recovery

- **Multi-AZ Deployment**: RDS failover capability
- **Automated Backups**: Daily RDS snapshots
- **Version Control**: All code in GitHub
- **Infrastructure as Code**: Reproducible deployments

---

**Note**: This diagram represents the production environment. Staging environment follows the same architecture with separate resources.
