import { Construct } from 'constructs';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as iam from 'aws-cdk-lib/aws-iam';
import { BaseConstruct, ConstructCommonProps } from '../base/base-construct';
export interface PipelineSimplePatternProps extends ConstructCommonProps {
    pipelineName: string;
    actionFlow: ActionProps[];
    buildPolicies?: iam.PolicyStatement[];
}
export interface EventStateLambdaProps {
    FunctionName?: string;
    CodePath: string;
    Runtime: string;
    Handler: string;
}
export declare enum ActionKind {
    SourceCodeCommit = "SourceCodeCommit",
    SourceS3Bucket = "SourceS3Bucket",
    ApproveManual = "ApproveManual",
    BuildCodeBuild = "BuildCodeBuild"
}
export interface ActionProps {
    Name: string;
    Kind: ActionKind;
    Stage: string;
    Enable: boolean;
    Order?: number;
    EventStateLambda?: EventStateLambdaProps;
    Detail: SourceKindCodeCommitProps | ApproveKindManualProps | BuildKindCodeBuildProps | DeployKindS3BucketProps;
}
export interface SourceKindCodeCommitProps {
    RepositoryName: string;
    BranchName: string;
}
export interface SourceKindS3BucketProps {
    BucketName: string;
    BucketKey: string;
    Account?: string;
    Region?: string;
}
export interface ApproveKindManualProps {
    Description?: string;
}
export interface BuildDeployStacksProps {
    PreCommands?: string[];
    StackNameList: string[];
    PostCommands?: string[];
}
export interface BuildKindCodeBuildProps {
    AppConfigFile: string;
    BuildCommands?: string[];
    BuildSpecFile?: string;
    BuildAssumeRoleArn?: string;
    BuildDeployStacks?: BuildDeployStacksProps;
}
export interface DeployKindS3BucketProps {
    BucketName: string;
    Account?: string;
    Region?: string;
}
export declare class PipelineSimplePattern extends BaseConstruct {
    codePipeline: codepipeline.Pipeline;
    private sourceOutput;
    private buildOutput;
    private stageMap;
    constructor(scope: Construct, id: string, props: PipelineSimplePatternProps);
    private validatePipelineConfig;
    private registerAction;
    private addStage;
    private createActionSourceCodeCommit;
    private createActionSourceS3Bucket;
    private createActionApproveManual;
    private createActionBuildCodeBuild;
    private createBuildSpecUsingCommands;
    private createBuildSpecUsingStackName;
    private createActionDeployS3Bucket;
    private createInstallCommands;
    private getDeployCommonPolicy;
    private registerEventLambda;
    private createEventStateLambda;
}
