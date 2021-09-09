import * as cdk from "@aws-cdk/core";
import * as dynamodb from "@aws-cdk/aws-dynamodb";

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
  }
}
