import * as iam from 'aws-cdk-lib/aws-iam';
import * as base from '../base/base-stack';
import { AppContext } from '../../app-context';
import { StackConfig } from '../../app-config';
import * as pipeline from '../../construct/pattern/pipeline-simple-pattern';
export declare abstract class PipelineBaseStack extends base.BaseStack {
    private simplePipeline;
    abstract onPipelineName(): string;
    abstract onActionFlow(): pipeline.ActionProps[];
    abstract onPostConstructor(pipeline: pipeline.PipelineSimplePattern): void;
    protected onBuildPolicies(): iam.PolicyStatement[] | undefined;
    constructor(appContext: AppContext, stackConfig: StackConfig);
}
