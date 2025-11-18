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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SampleVpcCloud9Stack = void 0;
const ec2 = __importStar(require("aws-cdk-lib/aws-ec2"));
const cloud9 = __importStar(require("aws-cdk-lib/aws-cloud9"));
const base = __importStar(require("../../lib/template/stack/vpc/vpc-base-stack"));
const base_stack_1 = require("../../lib/template/stack/base/base-stack");
class SampleVpcCloud9Stack extends base.VpcBaseStack {
    constructor(appContext, stackConfig) {
        super(appContext, stackConfig);
    }
    onLookupLegacyVpc() {
        return {
            vpcNameLegacy: this.getVariable('VpcName')
        };
    }
    onPostConstructor(baseVpc) {
        var _a;
        const subnet = baseVpc === null || baseVpc === void 0 ? void 0 : baseVpc.publicSubnets[0];
        new cloud9.CfnEnvironmentEC2(this, 'Cloud9Env2', {
            name: this.withProjectPrefix('DatabaseConnection'),
            instanceType: new ec2.InstanceType(this.stackConfig.InstanceType).toString(),
            subnetId: subnet === null || subnet === void 0 ? void 0 : subnet.subnetId,
            ownerArn: `arn:aws:iam::${(_a = this.commonProps.env) === null || _a === void 0 ? void 0 : _a.account}:user/${this.stackConfig.IamUser}`
        });
        const databaseSecurityGroup = ec2.SecurityGroup.fromSecurityGroupId(this, 'DatabaseSecurityGroup', this.getParameter('DatabaseSecurityGroup'));
        databaseSecurityGroup.addIngressRule(ec2.Peer.ipv4(subnet === null || subnet === void 0 ? void 0 : subnet.ipv4CidrBlock), ec2.Port.tcp(3306), 'from cloud9 subnet');
    }
}
__decorate([
    base_stack_1.Override
], SampleVpcCloud9Stack.prototype, "onLookupLegacyVpc", null);
__decorate([
    base_stack_1.Override
], SampleVpcCloud9Stack.prototype, "onPostConstructor", null);
exports.SampleVpcCloud9Stack = SampleVpcCloud9Stack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FtcGxlLXZwYy1jbG91ZDktc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzYW1wbGUtdnBjLWNsb3VkOS1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EseURBQTJDO0FBQzNDLCtEQUFpRDtBQUVqRCxrRkFBb0U7QUFDcEUseUVBQW9FO0FBS3BFLE1BQWEsb0JBQXFCLFNBQVEsSUFBSSxDQUFDLFlBQVk7SUFFdkQsWUFBWSxVQUFzQixFQUFFLFdBQXdCO1FBQ3hELEtBQUssQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUdELGlCQUFpQjtRQUNiLE9BQU87WUFDSCxhQUFhLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUM7U0FDN0MsQ0FBQztJQUNOLENBQUM7SUFHRCxpQkFBaUIsQ0FBQyxPQUFrQjs7UUFDaEMsTUFBTSxNQUFNLEdBQUcsT0FBTyxhQUFQLE9BQU8sdUJBQVAsT0FBTyxDQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV6QyxJQUFJLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFO1lBQzdDLElBQUksRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsb0JBQW9CLENBQUM7WUFDbEQsWUFBWSxFQUFFLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDLFFBQVEsRUFBRTtZQUM1RSxRQUFRLEVBQUUsTUFBTSxhQUFOLE1BQU0sdUJBQU4sTUFBTSxDQUFFLFFBQVE7WUFDMUIsUUFBUSxFQUFFLGdCQUFnQixNQUFBLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRywwQ0FBRSxPQUFPLFNBQVMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUU7U0FDN0YsQ0FBQyxDQUFDO1FBRUgsTUFBTSxxQkFBcUIsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLG1CQUFtQixDQUFDLElBQUksRUFBRSx1QkFBdUIsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQztRQUMvSSxxQkFBcUIsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxhQUFOLE1BQU0sdUJBQU4sTUFBTSxDQUFFLGFBQWMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLG9CQUFvQixDQUFDLENBQUM7SUFDMUgsQ0FBQztDQUNKO0FBcEJHO0lBREMscUJBQVE7NkRBS1I7QUFHRDtJQURDLHFCQUFROzZEQWFSO0FBMUJMLG9EQTJCQyIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0ICogYXMgZWMyIGZyb20gJ2F3cy1jZGstbGliL2F3cy1lYzInO1xuaW1wb3J0ICogYXMgY2xvdWQ5IGZyb20gJ2F3cy1jZGstbGliL2F3cy1jbG91ZDknO1xuXG5pbXBvcnQgKiBhcyBiYXNlIGZyb20gJy4uLy4uL2xpYi90ZW1wbGF0ZS9zdGFjay92cGMvdnBjLWJhc2Utc3RhY2snO1xuaW1wb3J0IHsgT3ZlcnJpZGUgfSBmcm9tICcuLi8uLi9saWIvdGVtcGxhdGUvc3RhY2svYmFzZS9iYXNlLXN0YWNrJztcbmltcG9ydCB7IEFwcENvbnRleHQgfSBmcm9tICcuLi8uLi9saWIvdGVtcGxhdGUvYXBwLWNvbnRleHQnO1xuaW1wb3J0IHsgU3RhY2tDb25maWcgfSBmcm9tICcuLi8uLi9saWIvdGVtcGxhdGUvYXBwLWNvbmZpZydcblxuXG5leHBvcnQgY2xhc3MgU2FtcGxlVnBjQ2xvdWQ5U3RhY2sgZXh0ZW5kcyBiYXNlLlZwY0Jhc2VTdGFjayB7XG5cbiAgICBjb25zdHJ1Y3RvcihhcHBDb250ZXh0OiBBcHBDb250ZXh0LCBzdGFja0NvbmZpZzogU3RhY2tDb25maWcpIHtcbiAgICAgICAgc3VwZXIoYXBwQ29udGV4dCwgc3RhY2tDb25maWcpO1xuICAgIH1cblxuICAgIEBPdmVycmlkZVxuICAgIG9uTG9va3VwTGVnYWN5VnBjKCk6IGJhc2UuVnBjTGVnYWN5TG9va3VwUHJvcHMgfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdnBjTmFtZUxlZ2FjeTogdGhpcy5nZXRWYXJpYWJsZSgnVnBjTmFtZScpXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgQE92ZXJyaWRlXG4gICAgb25Qb3N0Q29uc3RydWN0b3IoYmFzZVZwYz86IGVjMi5JVnBjKSB7XG4gICAgICAgIGNvbnN0IHN1Ym5ldCA9IGJhc2VWcGM/LnB1YmxpY1N1Ym5ldHNbMF07XG5cbiAgICAgICAgbmV3IGNsb3VkOS5DZm5FbnZpcm9ubWVudEVDMih0aGlzLCAnQ2xvdWQ5RW52MicsIHtcbiAgICAgICAgICAgIG5hbWU6IHRoaXMud2l0aFByb2plY3RQcmVmaXgoJ0RhdGFiYXNlQ29ubmVjdGlvbicpLFxuICAgICAgICAgICAgaW5zdGFuY2VUeXBlOiBuZXcgZWMyLkluc3RhbmNlVHlwZSh0aGlzLnN0YWNrQ29uZmlnLkluc3RhbmNlVHlwZSkudG9TdHJpbmcoKSxcbiAgICAgICAgICAgIHN1Ym5ldElkOiBzdWJuZXQ/LnN1Ym5ldElkLFxuICAgICAgICAgICAgb3duZXJBcm46IGBhcm46YXdzOmlhbTo6JHt0aGlzLmNvbW1vblByb3BzLmVudj8uYWNjb3VudH06dXNlci8ke3RoaXMuc3RhY2tDb25maWcuSWFtVXNlcn1gXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IGRhdGFiYXNlU2VjdXJpdHlHcm91cCA9IGVjMi5TZWN1cml0eUdyb3VwLmZyb21TZWN1cml0eUdyb3VwSWQodGhpcywgJ0RhdGFiYXNlU2VjdXJpdHlHcm91cCcsIHRoaXMuZ2V0UGFyYW1ldGVyKCdEYXRhYmFzZVNlY3VyaXR5R3JvdXAnKSk7XG4gICAgICAgIGRhdGFiYXNlU2VjdXJpdHlHcm91cC5hZGRJbmdyZXNzUnVsZShlYzIuUGVlci5pcHY0KHN1Ym5ldD8uaXB2NENpZHJCbG9jayEpLCBlYzIuUG9ydC50Y3AoMzMwNiksICdmcm9tIGNsb3VkOSBzdWJuZXQnKTtcbiAgICB9XG59XG4iXX0=