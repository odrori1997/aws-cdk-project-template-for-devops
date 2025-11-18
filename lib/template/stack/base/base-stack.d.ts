import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { AppContext } from '../../app-context';
import { AppConfig, StackConfig } from '../../app-config';
import { ICommonHelper } from '../../common/common-helper';
import { ICommonGuardian } from '../../common/common-guardian';
export declare function Override(target: any, propertyKey: string, descriptor: PropertyDescriptor): void;
export interface StackCommonProps extends cdk.StackProps {
    projectPrefix: string;
    appConfig: AppConfig;
    appConfigPath: string;
    variables: any;
}
export declare class BaseStack extends cdk.Stack implements ICommonHelper, ICommonGuardian {
    protected stackConfig: StackConfig;
    protected projectPrefix: string;
    protected commonProps: StackCommonProps;
    private commonHelper;
    private commonGuardian;
    constructor(appContext: AppContext, stackConfig: StackConfig);
    private static getStackCommonProps;
    findEnumType<T extends object>(enumType: T, target: string): T[keyof T];
    exportOutput(key: string, value: string, prefixEnable?: boolean, prefixCustomName?: string): void;
    putParameter(paramKey: string, paramValue: string, prefixEnable?: boolean, prefixCustomName?: string): string;
    getParameter(paramKey: string, prefixEnable?: boolean, prefixCustomName?: string): string;
    putVariable(variableKey: string, variableValue: string): void;
    getVariable(variableKey: string): string;
    createS3BucketName(baseName: string, suffix?: boolean): string;
    createS3Bucket(baseName: string, suffix?: boolean, encryption?: s3.BucketEncryption, versioned?: boolean): s3.Bucket;
    withStackName(baseName: string, delimiter?: string): string;
    withProjectPrefix(baseName: string, delimiter?: string): string;
}
