"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VpcBaseStack = void 0;
const ec2 = __importStar(require("aws-cdk-lib/aws-ec2"));
const base = __importStar(require("../base/base-stack"));
class VpcBaseStack extends base.BaseStack {
    constructor(appContext, stackConfig) {
        super(appContext, stackConfig);
        const props = this.onLookupLegacyVpc();
        if (props != undefined) {
            this.baseVpc = this.importVpc(props);
        }
        else {
            this.baseVpc = undefined;
        }
        this.onPostConstructor(this.baseVpc);
    }
    importVpc(props) {
        if (props.vpcIdLegacy != undefined && props.vpcIdLegacy.length > 0) {
            const vpc = ec2.Vpc.fromLookup(this, `BaseVPC`, {
                vpcId: props.vpcIdLegacy,
            });
            return vpc;
        }
        else if (props.vpcNameLegacy != undefined && props.vpcNameLegacy.length > 0) {
            const vpc = ec2.Vpc.fromLookup(this, `BaseVPC`, {
                vpcName: props.vpcNameLegacy
            });
            return vpc;
        }
        else {
            console.error('please check VPC import options: VPCID or VPCName is essential.');
            process.exit(1);
        }
    }
    createVpc(baseName, vpcMaxAzs, vpcCidr, natGateways) {
        if (vpcMaxAzs > 0 && vpcCidr.length > 0) {
            const vpc = new ec2.Vpc(this, baseName, {
                maxAzs: vpcMaxAzs,
                cidr: vpcCidr,
                natGateways: natGateways
            });
            return vpc;
        }
        else {
            console.error('please check the options: VPCMaxAzs, VPCCIDR, NATGateway');
            process.exit(1);
        }
    }
}
exports.VpcBaseStack = VpcBaseStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnBjLWJhc2Utc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ2cGMtYmFzZS1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEseURBQTJDO0FBRTNDLHlEQUEyQztBQVUzQyxNQUFzQixZQUFhLFNBQVEsSUFBSSxDQUFDLFNBQVM7SUFNckQsWUFBWSxVQUFzQixFQUFFLFdBQXdCO1FBQ3hELEtBQUssQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFFL0IsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFFdkMsSUFBSSxLQUFLLElBQUksU0FBUyxFQUFFO1lBQ3BCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUN4QzthQUFNO1lBQ0gsSUFBSSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUM7U0FDNUI7UUFFRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFFUyxTQUFTLENBQUMsS0FBMkI7UUFDM0MsSUFBSSxLQUFLLENBQUMsV0FBVyxJQUFJLFNBQVMsSUFBSSxLQUFLLENBQUMsV0FBVyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDaEUsTUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRTtnQkFDNUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxXQUFXO2FBQzNCLENBQUMsQ0FBQztZQUNILE9BQU8sR0FBRyxDQUFDO1NBQ2Q7YUFBTSxJQUFJLEtBQUssQ0FBQyxhQUFhLElBQUksU0FBUyxJQUFJLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUMzRSxNQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFO2dCQUM1QyxPQUFPLEVBQUUsS0FBSyxDQUFDLGFBQWE7YUFDL0IsQ0FBQyxDQUFDO1lBQ0gsT0FBTyxHQUFHLENBQUM7U0FDZDthQUFNO1lBQ0gsT0FBTyxDQUFDLEtBQUssQ0FBQyxpRUFBaUUsQ0FBQyxDQUFDO1lBQ2pGLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7U0FDbEI7SUFDTCxDQUFDO0lBRVMsU0FBUyxDQUFDLFFBQWdCLEVBQUUsU0FBaUIsRUFBRSxPQUFlLEVBQUUsV0FBbUI7UUFDekYsSUFBSSxTQUFTLEdBQUcsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ3JDLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUNsQztnQkFDSSxNQUFNLEVBQUUsU0FBUztnQkFDakIsSUFBSSxFQUFFLE9BQU87Z0JBQ2IsV0FBVyxFQUFFLFdBQVc7YUFDM0IsQ0FBQyxDQUFDO1lBQ1AsT0FBTyxHQUFHLENBQUM7U0FDZDthQUFNO1lBQ0gsT0FBTyxDQUFDLEtBQUssQ0FBQywwREFBMEQsQ0FBQyxDQUFDO1lBQzFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7U0FDbEI7SUFDTCxDQUFDO0NBQ0o7QUFuREQsb0NBbURDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZWMyIGZyb20gJ2F3cy1jZGstbGliL2F3cy1lYzInO1xuXG5pbXBvcnQgKiBhcyBiYXNlIGZyb20gJy4uL2Jhc2UvYmFzZS1zdGFjayc7XG5pbXBvcnQgeyBBcHBDb250ZXh0IH0gZnJvbSAnLi4vLi4vYXBwLWNvbnRleHQnO1xuaW1wb3J0IHsgU3RhY2tDb25maWcgfSBmcm9tICcuLi8uLi9hcHAtY29uZmlnJ1xuXG5cbmV4cG9ydCBpbnRlcmZhY2UgVnBjTGVnYWN5TG9va3VwUHJvcHMge1xuICAgIHZwY0lkTGVnYWN5Pzogc3RyaW5nO1xuICAgIHZwY05hbWVMZWdhY3k/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBWcGNCYXNlU3RhY2sgZXh0ZW5kcyBiYXNlLkJhc2VTdGFjayB7XG4gICAgcHJpdmF0ZSBiYXNlVnBjPzogZWMyLklWcGM7XG5cbiAgICBhYnN0cmFjdCBvbkxvb2t1cExlZ2FjeVZwYygpOiBWcGNMZWdhY3lMb29rdXBQcm9wcyB8IHVuZGVmaW5lZDtcbiAgICBhYnN0cmFjdCBvblBvc3RDb25zdHJ1Y3RvcihiYXNlVnBjPzogZWMyLklWcGMpOiB2b2lkO1xuXG4gICAgY29uc3RydWN0b3IoYXBwQ29udGV4dDogQXBwQ29udGV4dCwgc3RhY2tDb25maWc6IFN0YWNrQ29uZmlnKSB7XG4gICAgICAgIHN1cGVyKGFwcENvbnRleHQsIHN0YWNrQ29uZmlnKTtcblxuICAgICAgICBjb25zdCBwcm9wcyA9IHRoaXMub25Mb29rdXBMZWdhY3lWcGMoKTtcblxuICAgICAgICBpZiAocHJvcHMgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmJhc2VWcGMgPSB0aGlzLmltcG9ydFZwYyhwcm9wcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmJhc2VWcGMgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm9uUG9zdENvbnN0cnVjdG9yKHRoaXMuYmFzZVZwYyk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGltcG9ydFZwYyhwcm9wczogVnBjTGVnYWN5TG9va3VwUHJvcHMpOiBlYzIuSVZwYyB7XG4gICAgICAgIGlmIChwcm9wcy52cGNJZExlZ2FjeSAhPSB1bmRlZmluZWQgJiYgcHJvcHMudnBjSWRMZWdhY3kubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29uc3QgdnBjID0gZWMyLlZwYy5mcm9tTG9va3VwKHRoaXMsIGBCYXNlVlBDYCwge1xuICAgICAgICAgICAgICAgIHZwY0lkOiBwcm9wcy52cGNJZExlZ2FjeSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHZwYztcbiAgICAgICAgfSBlbHNlIGlmIChwcm9wcy52cGNOYW1lTGVnYWN5ICE9IHVuZGVmaW5lZCAmJiBwcm9wcy52cGNOYW1lTGVnYWN5Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IHZwYyA9IGVjMi5WcGMuZnJvbUxvb2t1cCh0aGlzLCBgQmFzZVZQQ2AsIHtcbiAgICAgICAgICAgICAgICB2cGNOYW1lOiBwcm9wcy52cGNOYW1lTGVnYWN5XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiB2cGM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdwbGVhc2UgY2hlY2sgVlBDIGltcG9ydCBvcHRpb25zOiBWUENJRCBvciBWUENOYW1lIGlzIGVzc2VudGlhbC4nKTtcbiAgICAgICAgICAgIHByb2Nlc3MuZXhpdCgxKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGNyZWF0ZVZwYyhiYXNlTmFtZTogc3RyaW5nLCB2cGNNYXhBenM6IG51bWJlciwgdnBjQ2lkcjogc3RyaW5nLCBuYXRHYXRld2F5czogbnVtYmVyKTogZWMyLklWcGMge1xuICAgICAgICBpZiAodnBjTWF4QXpzID4gMCAmJiB2cGNDaWRyLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHRoaXMsIGJhc2VOYW1lLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbWF4QXpzOiB2cGNNYXhBenMsXG4gICAgICAgICAgICAgICAgICAgIGNpZHI6IHZwY0NpZHIsXG4gICAgICAgICAgICAgICAgICAgIG5hdEdhdGV3YXlzOiBuYXRHYXRld2F5c1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHZwYztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ3BsZWFzZSBjaGVjayB0aGUgb3B0aW9uczogVlBDTWF4QXpzLCBWUENDSURSLCBOQVRHYXRld2F5Jyk7XG4gICAgICAgICAgICBwcm9jZXNzLmV4aXQoMSlcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==