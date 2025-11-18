import * as cfn_inc from 'aws-cdk-lib/cloudformation-include';
import * as base from '../../lib/template/stack/cfn/cfn-include-stack';
import { AppContext } from '../../lib/template/app-context';
import { StackConfig } from '../../lib/template/app-config';
export declare class SampleCfnVpcStack extends base.CfnIncludeStack {
    constructor(appContext: AppContext, stackConfig: StackConfig);
    onLoadTemplateProps(): base.CfnTemplateProps | undefined;
    onPostConstructor(cfnTemplate?: cfn_inc.CfnInclude): void;
}
