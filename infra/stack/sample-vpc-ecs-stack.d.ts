import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as base from '../../lib/template/stack/vpc/vpc-base-stack';
import { AppContext } from '../../lib/template/app-context';
import { StackConfig } from '../../lib/template/app-config';
export declare class SampleVpcEcsStack extends base.VpcBaseStack {
    constructor(appContext: AppContext, stackConfig: StackConfig);
    onLookupLegacyVpc(): base.VpcLegacyLookupProps | undefined;
    onPostConstructor(baseVpc?: ec2.IVpc): void;
}
