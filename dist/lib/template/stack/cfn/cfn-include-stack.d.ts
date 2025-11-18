import * as cfn_inc from 'aws-cdk-lib/cloudformation-include';
import * as base from '../base/base-stack';
import { AppContext } from '../../app-context';
import { StackConfig } from '../../app-config';
export interface CfnTemplateProps {
    templatePath: string;
    parameters?: any;
}
export declare abstract class CfnIncludeStack extends base.BaseStack {
    private cfnTemplate?;
    abstract onLoadTemplateProps(): CfnTemplateProps | undefined;
    abstract onPostConstructor(cfnTemplate?: cfn_inc.CfnInclude): void;
    constructor(appContext: AppContext, stackConfig: StackConfig);
    private loadTemplate;
}
