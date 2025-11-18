import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { ICommonHelper } from '../../common/common-helper';
import { ICommonGuardian } from '../../common/common-guardian';
export interface ConstructCommonProps {
    stackConfig: any;
    stackName: string;
    projectPrefix: string;
    env: cdk.Environment;
    variables?: any;
}
export declare class BaseConstruct extends Construct implements ICommonHelper, ICommonGuardian {
    protected stackConfig: any;
    protected projectPrefix: string;
    protected stackName: string;
    protected commonProps: ConstructCommonProps;
    private commonHelper;
    private commonGuardian;
    constructor(scope: Construct, id: string, props: ConstructCommonProps);
    findEnumType<T extends object>(enumType: T, target: string): T[keyof T];
    exportOutput(key: string, value: string): void;
    putParameter(paramKey: string, paramValue: string): string;
    getParameter(paramKey: string): string;
    putVariable(variableKey: string, variableValue: string): void;
    getVariable(variableKey: string): string;
    createS3BucketName(baseName: string, suffix?: boolean): string;
    createS3Bucket(baseName: string, suffix?: boolean, encryption?: s3.BucketEncryption, versioned?: boolean): s3.Bucket;
    withStackName(baseName: string, delimiter?: string): string;
    withProjectPrefix(baseName: string, delimiter?: string): string;
}
