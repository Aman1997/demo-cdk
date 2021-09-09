import * as cdk from "@aws-cdk/core";
import * as apigateway from "@aws-cdk/aws-apigateway";
import * as lambda from "@aws-cdk/aws-lambda";
import { NodejsFunction } from "@aws-cdk/aws-lambda-nodejs";
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import * as path from "path";

export interface BackendStackProps extends cdk.StackProps {
  deployEnv: string;
}
export class DemoCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: BackendStackProps) {
    super(scope, id, props);

    const userTable = new dynamodb.Table(this, "UserTable", {
      tableName: `Users-${props.deployEnv}`,
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    const userService = new NodejsFunction(this, "UserService", {
      functionName: `UserAPI-${props.deployEnv}`,
      memorySize: 1024,
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "handler",
      entry: path.join(__dirname, `/../resources/userAPI/index.ts`),
      environment: {
        USER_TABLE: userTable.tableName,
      },
      bundling: {
        minify: true,
        externalModules: ["aws-sdk"],
      },
    });

    userTable.grantReadWriteData(userService);

    const api = new apigateway.LambdaRestApi(this, "UserAPI", {
      restApiName: `UserAPI-${props.deployEnv}`,
      description: "API for user related actions",
      handler: userService,
      proxy: false,
      deploy: false,
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_ORIGINS,
      },
    });

    const items = api.root.addResource("/");
    items.addMethod("GET");
    items.addMethod("POST");
    items.addMethod("PUT");
    items.addMethod("DELETE");
  }
}
