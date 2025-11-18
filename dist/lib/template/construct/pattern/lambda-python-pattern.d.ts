import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { BaseConstruct, ConstructCommonProps } from '../base/base-construct';
export interface LambdaSimplePatternProps extends ConstructCommonProps {
    baseName: string;
    lambdaPath: string;
    policies: string[] | iam.PolicyStatement[];
    handler?: string;
    environments?: any;
    timeout?: cdk.Duration;
    bucket?: s3.Bucket;
    layerArns?: string[];
    bucketPrefix?: string[];
    bucketSuffix?: string[];
}
export declare class LambdaSimplePattern extends BaseConstruct {
    readonly lambdaFunction: lambda.Function;
    readonly lambdaRole: iam.Role;
    constructor(scope: Construct, id: string, props: LambdaSimplePatternProps);
    private createLambda;
    private createRole;
    private loadLayers;
}
