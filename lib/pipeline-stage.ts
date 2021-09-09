import {Stage, Construct, StageProps} from "@aws-cdk/core";
import { DemoCdkStack } from "./demo-cdk-stack";

interface PipelineStageProps extends StageProps {
  deployEnv: string;
}

export class PipelineStage extends Stage {
  constructor(scope: Construct, id: string, props: PipelineStageProps) {
    super(scope, id, props);

    new DemoCdkStack(this, `DemoCdkStack-${props.deployEnv}`, {
      deployEnv: props.deployEnv,
    });
  }
}
