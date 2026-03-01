import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as cognito from 'aws-cdk-lib/aws-cognito';

/**
 * Props for IAM Construct
 */
export interface IamConstructProps {
  usersTable: dynamodb.Table;
  accessLogsTable: dynamodb.Table;
  userPool: cognito.UserPool;
}

/**
 * Construct for IAM Role and Policies
 * Creates backend service role with DynamoDB and Cognito permissions
 */
export class IamConstruct extends Construct {
  public readonly backendServiceRole: iam.Role;

  constructor(scope: Construct, id: string, props: IamConstructProps) {
    super(scope, id);

    const { usersTable, accessLogsTable, userPool } = props;

    // IAM Role for backend service
    this.backendServiceRole = new iam.Role(this, 'BackendServiceRole', {
      roleName: 'access-vault-backend-service-role',
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'), // Adjust based on your backend service
      description: 'IAM role for AccessVault backend service',
    });

    // IAM Policy for DynamoDB access
    const dynamoDbPolicy = new iam.Policy(this, 'DynamoDbPolicy', {
      policyName: 'access-vault-dynamodb-policy',
      statements: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: [
            'dynamodb:GetItem',
            'dynamodb:PutItem',
            'dynamodb:UpdateItem',
            'dynamodb:DeleteItem',
            'dynamodb:Query',
            'dynamodb:Scan',
            'dynamodb:BatchGetItem',
            'dynamodb:BatchWriteItem',
          ],
          resources: [
            usersTable.tableArn,
            `${usersTable.tableArn}/index/*`,
            accessLogsTable.tableArn,
            `${accessLogsTable.tableArn}/index/*`,
          ],
        }),
      ],
    });

    // IAM Policy for Cognito admin actions
    const cognitoPolicy = new iam.Policy(this, 'CognitoPolicy', {
      policyName: 'access-vault-cognito-policy',
      statements: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: [
            'cognito-idp:SignUp',
            'cognito-idp:AdminGetUser',
            'cognito-idp:InitiateAuth',
            'cognito-idp:AdminInitiateAuth',
            'cognito-idp:AdminConfirmSignUp',
            'cognito-idp:AdminDeleteUser',
            'cognito-idp:AdminUpdateUserAttributes',
            'cognito-idp:ListUsers',
            'cognito-idp:AdminSetUserPassword',
            'cognito-idp:AdminEnableUser',
            'cognito-idp:AdminDisableUser',
          ],
          resources: [userPool.userPoolArn],
        }),
      ],
    });

    // Attach policies to the role
    this.backendServiceRole.attachInlinePolicy(dynamoDbPolicy);
    this.backendServiceRole.attachInlinePolicy(cognitoPolicy);

    // Add basic Lambda execution policy (if using Lambda as backend)
    this.backendServiceRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')
    );
  }
}
