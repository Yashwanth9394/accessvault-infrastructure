import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CognitoConstruct, DynamoDbConstruct, IamConstruct } from './constructs';

/**
 * Main AccessVault Infrastructure Stack
 * Orchestrates all infrastructure components for the AccessVault application
 */
export class AccessvaultInfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create Cognito resources (User Pool and Client)
    const cognito = new CognitoConstruct(this, 'Cognito');

    // Create DynamoDB tables (Users and AccessLogs)
    const dynamodb = new DynamoDbConstruct(this, 'DynamoDb');

    // Create IAM role and policies for backend service
    const iam = new IamConstruct(this, 'Iam', {
      usersTable: dynamodb.usersTable,
      accessLogsTable: dynamodb.accessLogsTable,
      userPool: cognito.userPool,
    });
    

    // CDK Outputs for backend configuration
    new cdk.CfnOutput(this, 'UserPoolId', {
      value: cognito.userPool.userPoolId,
      description: 'Cognito User Pool ID',
      exportName: 'AccessVaultUserPoolId',
    });

    new cdk.CfnOutput(this, 'UserPoolClientId', {
      value: cognito.userPoolClient.userPoolClientId,
      description: 'Cognito User Pool Client ID',
      exportName: 'AccessVaultUserPoolClientId',
    });

    new cdk.CfnOutput(this, 'UsersTableName', {
      value: dynamodb.usersTable.tableName,
      description: 'Users DynamoDB Table Name',
      exportName: 'AccessVaultUsersTableName',
    });

    new cdk.CfnOutput(this, 'AccessLogsTableName', {
      value: dynamodb.accessLogsTable.tableName,
      description: 'AccessLogs DynamoDB Table Name',
      exportName: 'AccessVaultAccessLogsTableName',
    });

    new cdk.CfnOutput(this, 'BackendServiceRoleArn', {
      value: iam.backendServiceRole.roleArn,
      description: 'Backend Service IAM Role ARN',
      exportName: 'AccessVaultBackendServiceRoleArn',
    });
  }
}
