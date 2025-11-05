# Full-Stack Deployment Project

## Project Overview

This is a full-stack web application built with **Angular** (frontend) and **Node.js/Express** (backend). The application is deployed on AWS infrastructure using a CI/CD pipeline powered by CircleCI.

### Technology Stack

- **Frontend**: Angular, TypeScript, HTML5, CSS3
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL (AWS RDS)
- **Cloud Infrastructure**: AWS (S3, Elastic Beanstalk, RDS, CloudFront)
- **CI/CD**: CircleCI
- **Version Control**: Git/GitHub

## Application Features

[Add your application-specific features here]

- User authentication and authorization
- RESTful API integration
- Responsive design
- Real-time data processing
- [Add more features as needed]

## Architecture

The application follows a three-tier architecture:

1. **Presentation Layer**: Angular frontend hosted on AWS S3 with CloudFront CDN
2. **Application Layer**: Node.js/Express API hosted on AWS Elastic Beanstalk
3. **Data Layer**: PostgreSQL database hosted on AWS RDS

For detailed architecture information, see [docs/Infrastructure_description.md](docs/Infrastructure_description.md).

## Deployment Pipeline

The CI/CD pipeline is configured with CircleCI and includes:

1. **Build Phase**: Compile and test both frontend and backend
2. **Hold Phase**: Manual approval gate for production deployments
3. **Deploy Phase**: Automated deployment to AWS infrastructure

For detailed pipeline information, see [docs/Pipeline_description.md](docs/Pipeline_description.md).

## Live Application

🌐 **Frontend Application**: [https://your-app-name.s3-website-region.amazonaws.com](https://your-app-name.s3-website-region.amazonaws.com)

🔗 **Backend API**: [https://your-api-name.region.elasticbeanstalk.com](https://your-api-name.region.elasticbeanstalk.com)

> **Note**: Replace the above URLs with your actual deployed application URLs.

## Screenshots

### Successful CircleCI Build

#### Build Phase
![CircleCI Build Phase](screenshots/circleci-build.png)

The build phase shows successful compilation and testing of both frontend and backend applications.

#### Hold Phase
![CircleCI Hold Phase](screenshots/circleci-hold.png)

Manual approval gate before deploying to production environment.

#### Deploy Phase
![CircleCI Deploy Phase](screenshots/circleci-deploy.png)

Automated deployment to AWS S3 and Elastic Beanstalk.

### AWS Infrastructure

#### AWS RDS Database
![AWS RDS](screenshots/aws-rds.png)

PostgreSQL database instance configuration and status.

#### AWS Elastic Beanstalk (Backend API)
![AWS Elastic Beanstalk](screenshots/aws-elasticbeanstalk.png)

Backend API deployment environment and health status.

#### AWS S3 (Frontend Hosting)
![AWS S3](screenshots/aws-s3.png)

Frontend static files hosted on S3 with public access configuration.

#### AWS CloudFront (Optional CDN)
![AWS CloudFront](screenshots/aws-cloudfront.png)

Content Delivery Network for improved frontend performance.

## Project Structure

```
.
├── .circleci/
│   └── config.yml              # CircleCI pipeline configuration
├── frontend/                   # Angular frontend application
│   ├── src/
│   ├── package.json
│   └── angular.json
├── backend/                    # Node.js backend application
│   ├── src/
│   ├── package.json
│   └── .ebextensions/         # Elastic Beanstalk configuration
├── docs/                      # Documentation
│   ├── architecture_diagram.md
│   ├── pipeline_diagram.md
│   ├── Infrastructure_description.md
│   ├── Pipeline_description.md
│   └── Application_dependencies.md
├── screenshots/               # Deployment screenshots
├── package.json              # Root package.json for workspace
└── README.md                 # This file
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm (v9+)
- AWS CLI configured with appropriate credentials
- CircleCI account connected to your repository

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   
   Frontend (.env):
   ```
   API_URL=http://localhost:3000
   ```
   
   Backend (.env):
   ```
   PORT=3000
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=your_database
   DB_USER=your_user
   DB_PASSWORD=your_password
   ```

4. **Run the application**
   
   Terminal 1 (Backend):
   ```bash
   npm run backend:start
   ```
   
   Terminal 2 (Frontend):
   ```bash
   npm run frontend:start
   ```

5. **Access the application**
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:3000

### Running Tests

```bash
# Run all tests
npm run test:all

# Run frontend tests only
npm run frontend:test

# Run backend tests only
npm run backend:test
```

## Deployment

### Automated Deployment (via CircleCI)

1. **Push to develop branch**: Automatically deploys to staging environment
2. **Push to main branch**: Requires manual approval before deploying to production

### Manual Deployment

#### Deploy Frontend to S3

```bash
cd frontend
npm run build
aws s3 sync dist/ s3://your-bucket-name --delete
```

#### Deploy Backend to Elastic Beanstalk

```bash
cd backend
npm run build
eb deploy your-environment-name
```

## Environment Variables

### CircleCI Environment Variables

Configure the following in CircleCI project settings:

- `AWS_ACCESS_KEY_ID`: AWS access key
- `AWS_SECRET_ACCESS_KEY`: AWS secret key
- `AWS_REGION`: AWS region (e.g., us-east-1)
- `AWS_S3_BUCKET`: S3 bucket name for frontend
- `CLOUDFRONT_DISTRIBUTION_ID`: CloudFront distribution ID
- `EB_ENVIRONMENT_NAME`: Elastic Beanstalk environment name
- `DATABASE_URL`: RDS database connection string

## Documentation

- [Architecture Diagram](docs/architecture_diagram.md)
- [Pipeline Diagram](docs/pipeline_diagram.md)
- [Infrastructure Description](docs/Infrastructure_description.md)
- [Pipeline Description](docs/Pipeline_description.md)
- [Application Dependencies](docs/Application_dependencies.md)

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## Stand Out Features Implemented

- ✅ Frontend unit tests run in CI environment
- ✅ Pull Request builds execute tests and builds for each PR
- ✅ Separate staging and production environments
- ✅ Automatic deployment to staging on develop branch
- ✅ Manual approval gate for production deployments

## Troubleshooting

### Common Issues

1. **Build Failures**: Check CircleCI logs for specific error messages
2. **Deployment Failures**: Verify AWS credentials and permissions
3. **Database Connection Issues**: Check RDS security groups and connection strings

## License

[MIT](LICENSE)

## Contact

[Your Name] - [your.email@example.com]

Project Link: [https://github.com/yourusername/your-repo](https://github.com/yourusername/your-repo)
