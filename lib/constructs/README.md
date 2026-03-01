# AccessVault Infrastructure Constructs

This directory contains modular CDK constructs that make up the AccessVault infrastructure.

## Structure

```
lib/constructs/
├── cognito-construct.ts      # User authentication resources
├── dynamodb-construct.ts     # Database tables
├── iam-construct.ts          # IAM roles and policies
├── index.ts                  # Central export file
└── README.md                 # This file
```

## Constructs

### 1. CognitoConstruct (`cognito-construct.ts`)
**Purpose:** Manages user authentication and authorization

**Resources:**
- **User Pool:** Configured with email sign-in, auto-verification, and password policies
- **User Pool Client:** Public client without client secret for frontend applications

**Exports:**
- `userPool`: The Cognito User Pool instance
- `userPoolClient`: The User Pool Client instance

**Use Case:** Handles user registration, login, and authentication for the AccessVault application

---

### 2. DynamoDbConstruct (`dynamodb-construct.ts`)
**Purpose:** Creates and manages database tables

**Resources:**
- **Users Table:**
  - Partition Key: `userId` (String)
  - Global Secondary Index: `RoleIndex` on `role` attribute
  - Billing: Pay-per-request
  
- **AccessLogs Table:**
  - Partition Key: `logId` (String)
  - Billing: Pay-per-request

**Exports:**
- `usersTable`: The Users DynamoDB table
- `accessLogsTable`: The AccessLogs DynamoDB table

**Use Case:** Stores user data with role-based querying and audit logs for access tracking

---

### 3. IamConstruct (`iam-construct.ts`)
**Purpose:** Manages IAM permissions for backend services

**Resources:**
- **Backend Service Role:** IAM role assumable by Lambda (or other services)
- **DynamoDB Policy:** Grants read/write access to both tables and their indexes
- **Cognito Policy:** Grants admin actions for user management

**Permissions Granted:**
- DynamoDB: GetItem, PutItem, UpdateItem, DeleteItem, Query, Scan, BatchGet/Write
- Cognito: SignUp, AdminGetUser, InitiateAuth, AdminInitiateAuth, AdminConfirmSignUp, AdminDeleteUser, AdminUpdateUserAttributes, ListUsers, AdminSetUserPassword, AdminEnableUser, AdminDisableUser

**Exports:**
- `backendServiceRole`: The IAM role for backend services

**Use Case:** Provides secure, least-privilege access for backend services to interact with Cognito and DynamoDB

---

## Usage

Import constructs in your stack:

```typescript
import { CognitoConstruct, DynamoDbConstruct, IamConstruct } from './constructs';

// In your stack constructor
const cognito = new CognitoConstruct(this, 'Cognito');
const dynamodb = new DynamoDbConstruct(this, 'DynamoDb');
const iam = new IamConstruct(this, 'Iam', {
  usersTable: dynamodb.usersTable,
  accessLogsTable: dynamodb.accessLogsTable,
  userPool: cognito.userPool,
});
```

## Benefits of This Structure

1. **Separation of Concerns:** Each construct handles a specific domain (auth, data, permissions)
2. **Reusability:** Constructs can be reused across different stacks
3. **Testability:** Each construct can be unit tested independently
4. **Maintainability:** Changes to one service don't affect others
5. **Readability:** Clear, focused files that are easy to understand
6. **Scalability:** Easy to add new constructs as the application grows
