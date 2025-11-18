import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as base from '../base/base-stack';
import { AppContext } from '../../app-context';
import { StackConfig } from '../../app-config';
export interface VpcLegacyLookupProps {
    vpcIdLegacy?: string;
    vpcNameLegacy?: string;
}
export declare abstract class VpcBaseStack extends base.BaseStack {
    private baseVpc?;
    abstract onLookupLegacyVpc(): VpcLegacyLookupProps | undefined;
    abstract onPostConstructor(baseVpc?: ec2.IVpc): void;
    constructor(appContext: AppContext, stackConfig: StackConfig);
    protected importVpc(props: VpcLegacyLookupProps): ec2.IVpc;
    protected createVpc(baseName: string, vpcMaxAzs: number, vpcCidr: string, natGateways: number): ec2.IVpc;
}
