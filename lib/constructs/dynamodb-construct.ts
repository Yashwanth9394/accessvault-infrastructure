import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

/**
 * Construct for DynamoDB Tables
 * Creates Users table with role GSI and AccessLogs table
 */
export class DynamoDbConstruct extends Construct {
  public readonly usersTable: dynamodb.Table;
  public readonly accessLogsTable: dynamodb.Table;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    // DynamoDB Users table with userId partition key and GSI on role
    this.usersTable = new dynamodb.Table(this, 'UsersTable', {
      tableName: 'Users',
      partitionKey: {
        name: 'userId',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // For development; use RETAIN in production
    });

    // Add GSI on role
    this.usersTable.addGlobalSecondaryIndex({
      indexName: 'RoleIndex',
      partitionKey: {
        name: 'role',
        type: dynamodb.AttributeType.STRING,
      },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // DynamoDB AccessLogs table with logId partition key
    this.accessLogsTable = new dynamodb.Table(this, 'AccessLogsTable', {
      tableName: 'AccessLogs',
      partitionKey: {
        name: 'logId',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // For development; use RETAIN in production
    });
  }
}
