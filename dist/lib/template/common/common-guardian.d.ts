import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
export interface ICommonGuardian {
    createS3BucketName(baseName: string, suffix?: boolean): string;
    createS3Bucket(baseName: string, suffix?: boolean, encryption?: s3.BucketEncryption, versioned?: boolean): s3.Bucket;
}
export interface CommonGuardianProps {
    stackName: string;
    projectPrefix: string;
    construct: Construct;
    env: cdk.Environment;
    variables: any;
}
export declare class CommonGuardian implements ICommonGuardian {
    protected stackName: string;
    protected projectPrefix: string;
    protected props: CommonGuardianProps;
    constructor(props: CommonGuardianProps);
    createS3BucketName(baseName: string, suffix?: boolean): string;
    createS3Bucket(baseName: string, suffix?: boolean, encryption?: s3.BucketEncryption, versioned?: boolean): s3.Bucket;
}
