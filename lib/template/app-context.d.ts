import * as cdk from 'aws-cdk-lib';
import { AppConfig } from './app-config';
import { StackCommonProps } from './stack/base/base-stack';
export declare class AppContextError extends Error {
    constructor(message: string);
}
export declare enum ProjectPrefixType {
    NameStage = 0,
    NameHyphenStage = 1,
    Name = 2
}
export interface AppContextProps {
    appConfigFileKey: string;
    contextArgs?: string[];
    projectPrefixType?: ProjectPrefixType;
}
export declare class AppContext {
    readonly cdkApp: cdk.App;
    readonly appConfig: AppConfig;
    readonly stackCommonProps: StackCommonProps;
    private readonly appContextProps;
    constructor(props: AppContextProps);
    ready(): boolean;
    private createStackCommonProps;
    private findAppConfigFile;
    private getProjectPrefix;
    private loadAppConfigFile;
    private updateContextArgs;
    private addPrefixIntoStackName;
}
