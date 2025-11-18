import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
export interface ICommonHelper {
    findEnumType<T extends object>(enumType: T, target: string): T[keyof T];
    exportOutput(key: string, value: string, prefixEnable?: boolean, prefixCustomName?: string): void;
    putParameter(paramKey: string, paramValue: string, prefixEnable?: boolean, prefixCustomName?: string): string;
    getParameter(paramKey: string, prefixEnable?: boolean, prefixCustomName?: string): string;
    putVariable(variableKey: string, variableValue: string): void;
    getVariable(variableKey: string): string;
    withStackName(baseName: string, delimiter?: string): string;
    withProjectPrefix(baseName: string, delimiter?: string): string;
}
export interface CommonHelperProps {
    stackName: string;
    projectPrefix: string;
    construct: Construct;
    env: cdk.Environment;
    variables: any;
}
export declare class CommonHelper implements ICommonHelper {
    protected stackName: string;
    protected projectPrefix: string;
    protected props: CommonHelperProps;
    constructor(props: CommonHelperProps);
    findEnumType<T extends object>(enumType: T, target: string): T[keyof T];
    exportOutput(key: string, value: string, prefixEnable?: boolean, prefixCustomName?: string): void;
    putParameter(paramKey: string, paramValue: string, prefixEnable?: boolean, prefixCustomName?: string): string;
    getParameter(paramKey: string, prefixEnable?: boolean, prefixCustomName?: string): string;
    putVariable(variableKey: string, variableValue: string): void;
    getVariable(variableKey: string): string;
    withStackName(baseName: string, delimiter?: string): string;
    withProjectPrefix(baseName: string, delimiter?: string): string;
}
