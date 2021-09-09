import * as cdk from "@aws-cdk/core";
import * as codepipeline from "@aws-cdk/aws-codepipeline";
import * as codepipeline_actions from "@aws-cdk/aws-codepipeline-actions";
import {SimpleSynthAction, CdkPipeline} from "@aws-cdk/pipelines";
import { PipelineStage } from "./pipeline-stage";

export class PipelineStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Defines the artifact representing the sourcecode
    const sourceArtifact = new codepipeline.Artifact();
    // Defines the artifact representing the cloud assembly
    // (cloudformation template + all other assets)
    const cloudAssemblyArtifact = new codepipeline.Artifact();

    const pipeline = new CdkPipeline(this, "Pipeline", {
      pipelineName: `WhosthatPipeline`,
      cloudAssemblyArtifact,

      // source information
      sourceAction: new codepipeline_actions.GitHubSourceAction({
        actionName: "GitHub",
        output: sourceArtifact, // where the artifact is stored
        oauthToken: cdk.SecretValue.secretsManager("github-access-token"),
        owner: "Aman1997", // owner username
        repo: "demo-cdk",
        branch: "main",
      }),

      // Builds our source code outlined above into a could assembly artifact
      synthAction: SimpleSynthAction.standardNpmSynth({
        sourceArtifact, // Where to get source code to buil
        cloudAssemblyArtifact, // Where to place built source

        buildCommand: "npm run build", // Language-specific build cmd
      }),
    });

    const deploy = new PipelineStage(this, "Dev", {deployEnv: "dev"});
    pipeline.addApplicationStage(deploy);
  }
}
