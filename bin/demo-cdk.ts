#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from '@aws-cdk/core';
import { PipelineStack } from '../lib/pipeline-stack';

const app = new cdk.App();

new PipelineStack(app, "PipelineStack", {
      env: {account: "825286177046", region: "us-east-1"},
  });
  
  app.synth();
