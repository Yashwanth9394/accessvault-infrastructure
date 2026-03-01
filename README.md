# AccessVault Infrastructure

AWS CDK infrastructure for AccessVault - a secure access management system. Provisions authentication, authorization, and data storage resources on AWS.

## Features

- AWS Cognito user pools for authentication
- DynamoDB tables for data storage
- IAM roles and policies for fine-grained access control
- Modular CDK construct design

## Tech Stack

- **IaC:** AWS CDK (TypeScript)
- **Auth:** Amazon Cognito
- **Database:** Amazon DynamoDB
- **Security:** AWS IAM

## Architecture

```
AWS CDK Stack
├── Cognito Construct   # User pools, identity pools
├── DynamoDB Construct   # Tables, indexes, capacity
└── IAM Construct        # Roles, policies, permissions
```

## Getting Started

### Prerequisites
- Node.js 18+
- AWS CLI configured
- AWS CDK CLI (`npm install -g aws-cdk`)

### Installation
```bash
npm install
```

### Deploy
```bash
npx cdk synth    # Synthesize CloudFormation template
npx cdk deploy   # Deploy to AWS
```

### Useful Commands
```bash
npx cdk diff     # Compare deployed stack with current state
npx cdk destroy  # Remove all resources
```
