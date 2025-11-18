"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FtcGxlLXZwYy1jbG91ZDktc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9pbmZyYS9zdGFjay9zYW1wbGUtdnBjLWNsb3VkOS1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLHlEQUEyQztBQUMzQywrREFBaUQ7QUFFakQsa0ZBQW9FO0FBQ3BFLHlFQUFvRTtBQUtwRSxNQUFhLG9CQUFxQixTQUFRLElBQUksQ0FBQyxZQUFZO0lBRXZELFlBQVksVUFBc0IsRUFBRSxXQUF3QjtRQUN4RCxLQUFLLENBQUMsVUFBVSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFHRCxpQkFBaUI7UUFDYixPQUFPO1lBQ0gsYUFBYSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDO1NBQzdDLENBQUM7SUFDTixDQUFDO0lBR0QsaUJBQWlCLENBQUMsT0FBa0I7O1FBQ2hDLE1BQU0sTUFBTSxHQUFHLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFekMsSUFBSSxNQUFNLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRTtZQUM3QyxJQUFJLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLG9CQUFvQixDQUFDO1lBQ2xELFlBQVksRUFBRSxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxRQUFRLEVBQUU7WUFDNUUsUUFBUSxFQUFFLE1BQU0sYUFBTixNQUFNLHVCQUFOLE1BQU0sQ0FBRSxRQUFRO1lBQzFCLFFBQVEsRUFBRSxnQkFBZ0IsTUFBQSxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsMENBQUUsT0FBTyxTQUFTLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFO1NBQzdGLENBQUMsQ0FBQztRQUVILE1BQU0scUJBQXFCLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLEVBQUUsdUJBQXVCLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUM7UUFDL0kscUJBQXFCLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sYUFBTixNQUFNLHVCQUFOLE1BQU0sQ0FBRSxhQUFjLENBQUMsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO0lBQzFILENBQUM7Q0FDSjtBQXBCRztJQURDLHFCQUFROzZEQUtSO0FBR0Q7SUFEQyxxQkFBUTs2REFhUjtBQTFCTCxvREEyQkMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWMyJztcbmltcG9ydCAqIGFzIGNsb3VkOSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY2xvdWQ5JztcblxuaW1wb3J0ICogYXMgYmFzZSBmcm9tICcuLi8uLi9saWIvdGVtcGxhdGUvc3RhY2svdnBjL3ZwYy1iYXNlLXN0YWNrJztcbmltcG9ydCB7IE92ZXJyaWRlIH0gZnJvbSAnLi4vLi4vbGliL3RlbXBsYXRlL3N0YWNrL2Jhc2UvYmFzZS1zdGFjayc7XG5pbXBvcnQgeyBBcHBDb250ZXh0IH0gZnJvbSAnLi4vLi4vbGliL3RlbXBsYXRlL2FwcC1jb250ZXh0JztcbmltcG9ydCB7IFN0YWNrQ29uZmlnIH0gZnJvbSAnLi4vLi4vbGliL3RlbXBsYXRlL2FwcC1jb25maWcnXG5cblxuZXhwb3J0IGNsYXNzIFNhbXBsZVZwY0Nsb3VkOVN0YWNrIGV4dGVuZHMgYmFzZS5WcGNCYXNlU3RhY2sge1xuXG4gICAgY29uc3RydWN0b3IoYXBwQ29udGV4dDogQXBwQ29udGV4dCwgc3RhY2tDb25maWc6IFN0YWNrQ29uZmlnKSB7XG4gICAgICAgIHN1cGVyKGFwcENvbnRleHQsIHN0YWNrQ29uZmlnKTtcbiAgICB9XG5cbiAgICBAT3ZlcnJpZGVcbiAgICBvbkxvb2t1cExlZ2FjeVZwYygpOiBiYXNlLlZwY0xlZ2FjeUxvb2t1cFByb3BzIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHZwY05hbWVMZWdhY3k6IHRoaXMuZ2V0VmFyaWFibGUoJ1ZwY05hbWUnKVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIEBPdmVycmlkZVxuICAgIG9uUG9zdENvbnN0cnVjdG9yKGJhc2VWcGM/OiBlYzIuSVZwYykge1xuICAgICAgICBjb25zdCBzdWJuZXQgPSBiYXNlVnBjPy5wdWJsaWNTdWJuZXRzWzBdO1xuXG4gICAgICAgIG5ldyBjbG91ZDkuQ2ZuRW52aXJvbm1lbnRFQzIodGhpcywgJ0Nsb3VkOUVudjInLCB7XG4gICAgICAgICAgICBuYW1lOiB0aGlzLndpdGhQcm9qZWN0UHJlZml4KCdEYXRhYmFzZUNvbm5lY3Rpb24nKSxcbiAgICAgICAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUodGhpcy5zdGFja0NvbmZpZy5JbnN0YW5jZVR5cGUpLnRvU3RyaW5nKCksXG4gICAgICAgICAgICBzdWJuZXRJZDogc3VibmV0Py5zdWJuZXRJZCxcbiAgICAgICAgICAgIG93bmVyQXJuOiBgYXJuOmF3czppYW06OiR7dGhpcy5jb21tb25Qcm9wcy5lbnY/LmFjY291bnR9OnVzZXIvJHt0aGlzLnN0YWNrQ29uZmlnLklhbVVzZXJ9YFxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBkYXRhYmFzZVNlY3VyaXR5R3JvdXAgPSBlYzIuU2VjdXJpdHlHcm91cC5mcm9tU2VjdXJpdHlHcm91cElkKHRoaXMsICdEYXRhYmFzZVNlY3VyaXR5R3JvdXAnLCB0aGlzLmdldFBhcmFtZXRlcignRGF0YWJhc2VTZWN1cml0eUdyb3VwJykpO1xuICAgICAgICBkYXRhYmFzZVNlY3VyaXR5R3JvdXAuYWRkSW5ncmVzc1J1bGUoZWMyLlBlZXIuaXB2NChzdWJuZXQ/LmlwdjRDaWRyQmxvY2shKSwgZWMyLlBvcnQudGNwKDMzMDYpLCAnZnJvbSBjbG91ZDkgc3VibmV0Jyk7XG4gICAgfVxufVxuIl19