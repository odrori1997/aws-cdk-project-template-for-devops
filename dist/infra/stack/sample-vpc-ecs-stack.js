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
exports.SampleVpcEcsStack = void 0;
const ec2 = __importStar(require("aws-cdk-lib/aws-ec2"));
const ecs = __importStar(require("aws-cdk-lib/aws-ecs"));
const sm = __importStar(require("aws-cdk-lib/aws-secretsmanager"));
const ecsPatterns = __importStar(require("aws-cdk-lib/aws-ecs-patterns"));
const base = __importStar(require("../../lib/template/stack/vpc/vpc-base-stack"));
const base_stack_1 = require("../../lib/template/stack/base/base-stack");
class SampleVpcEcsStack extends base.VpcBaseStack {
    constructor(appContext, stackConfig) {
        super(appContext, stackConfig);
    }
    onLookupLegacyVpc() {
        return {
            vpcNameLegacy: this.getVariable('VpcName')
        };
    }
    onPostConstructor(baseVpc) {
        const databaseHostName = this.getParameter('DatabaseHostName');
        const databaseName = this.getParameter('DatabaseName');
        const databaseSecretArn = this.getParameter('DatabaseSecretArn');
        const databaseSecret = sm.Secret.fromSecretCompleteArn(this, 'secret', databaseSecretArn);
        const taskDef = new ecs.FargateTaskDefinition(this, 'TaskDef');
        taskDef.addContainer('DefaultContainer', {
            image: ecs.ContainerImage.fromAsset(this.stackConfig.FilePath),
            logging: new ecs.AwsLogDriver({
                streamPrefix: this.withProjectPrefix('backend-fastapi')
            }),
            environment: {
                HOST_NAME: databaseHostName,
                DATABASE_NAME: databaseName,
                SECRET_ARN: databaseSecretArn,
            },
            portMappings: [{
                    containerPort: 80,
                    protocol: ecs.Protocol.TCP
                }]
        });
        databaseSecret.grantRead(taskDef.taskRole);
        const albEcsService = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'Service', {
            cluster: new ecs.Cluster(this, 'cluster', {
                vpc: baseVpc,
                clusterName: this.withProjectPrefix(this.stackConfig.ClusterName)
            }),
            memoryLimitMiB: this.stackConfig.Memory,
            cpu: this.stackConfig.Cpu,
            taskDefinition: taskDef,
            publicLoadBalancer: false,
            desiredCount: parseInt(this.stackConfig.DesiredCount)
        });
        const databaseSecurityGroup = ec2.SecurityGroup.fromSecurityGroupId(this, 'DatabaseSecurityGroup', this.getParameter('DatabaseSecurityGroup'));
        databaseSecurityGroup.addIngressRule(albEcsService.service.connections.securityGroups[0], ec2.Port.tcp(3306), 'from backend sg');
    }
}
__decorate([
    base_stack_1.Override
], SampleVpcEcsStack.prototype, "onLookupLegacyVpc", null);
__decorate([
    base_stack_1.Override
], SampleVpcEcsStack.prototype, "onPostConstructor", null);
exports.SampleVpcEcsStack = SampleVpcEcsStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FtcGxlLXZwYy1lY3Mtc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9pbmZyYS9zdGFjay9zYW1wbGUtdnBjLWVjcy1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLHlEQUEyQztBQUMzQyx5REFBMkM7QUFDM0MsbUVBQXFEO0FBQ3JELDBFQUE0RDtBQUU1RCxrRkFBb0U7QUFDcEUseUVBQW9FO0FBS3BFLE1BQWEsaUJBQWtCLFNBQVEsSUFBSSxDQUFDLFlBQVk7SUFFcEQsWUFBWSxVQUFzQixFQUFFLFdBQXdCO1FBQ3hELEtBQUssQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUdELGlCQUFpQjtRQUNiLE9BQU87WUFDSCxhQUFhLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUM7U0FDN0MsQ0FBQztJQUNOLENBQUM7SUFHRCxpQkFBaUIsQ0FBQyxPQUFrQjtRQUNoQyxNQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUMvRCxNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ3ZELE1BQU0saUJBQWlCLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQ2pFLE1BQU0sY0FBYyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMscUJBQXFCLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1FBRTFGLE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLHFCQUFxQixDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztRQUMvRCxPQUFPLENBQUMsWUFBWSxDQUFDLGtCQUFrQixFQUFFO1lBQ3JDLEtBQUssRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQztZQUM5RCxPQUFPLEVBQUUsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDO2dCQUMxQixZQUFZLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGlCQUFpQixDQUFDO2FBQzFELENBQUM7WUFDRixXQUFXLEVBQUU7Z0JBQ1QsU0FBUyxFQUFFLGdCQUFnQjtnQkFDM0IsYUFBYSxFQUFFLFlBQVk7Z0JBQzNCLFVBQVUsRUFBRSxpQkFBaUI7YUFDaEM7WUFDRCxZQUFZLEVBQUUsQ0FBQztvQkFDWCxhQUFhLEVBQUUsRUFBRTtvQkFDakIsUUFBUSxFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRztpQkFDN0IsQ0FBQztTQUNMLENBQUMsQ0FBQztRQUNILGNBQWMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRTNDLE1BQU0sYUFBYSxHQUFHLElBQUksV0FBVyxDQUFDLHFDQUFxQyxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUU7WUFDekYsT0FBTyxFQUFFLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFO2dCQUN0QyxHQUFHLEVBQUUsT0FBTztnQkFDWixXQUFXLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDO2FBQ3BFLENBQUM7WUFDRixjQUFjLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNO1lBQ3ZDLEdBQUcsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUc7WUFDekIsY0FBYyxFQUFFLE9BQU87WUFDdkIsa0JBQWtCLEVBQUUsS0FBSztZQUN6QixZQUFZLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDO1NBQ3hELENBQUMsQ0FBQztRQUVILE1BQU0scUJBQXFCLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLEVBQUUsdUJBQXVCLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUM7UUFDL0kscUJBQXFCLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO0lBQ3JJLENBQUM7Q0FDSjtBQTlDRztJQURDLHFCQUFROzBEQUtSO0FBR0Q7SUFEQyxxQkFBUTswREF1Q1I7QUFwREwsOENBcURDIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyBlY3MgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjcyc7XG5pbXBvcnQgKiBhcyBzbSBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtc2VjcmV0c21hbmFnZXInO1xuaW1wb3J0ICogYXMgZWNzUGF0dGVybnMgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjcy1wYXR0ZXJucyc7XG5cbmltcG9ydCAqIGFzIGJhc2UgZnJvbSAnLi4vLi4vbGliL3RlbXBsYXRlL3N0YWNrL3ZwYy92cGMtYmFzZS1zdGFjayc7XG5pbXBvcnQgeyBPdmVycmlkZSB9IGZyb20gJy4uLy4uL2xpYi90ZW1wbGF0ZS9zdGFjay9iYXNlL2Jhc2Utc3RhY2snO1xuaW1wb3J0IHsgQXBwQ29udGV4dCB9IGZyb20gJy4uLy4uL2xpYi90ZW1wbGF0ZS9hcHAtY29udGV4dCc7XG5pbXBvcnQgeyBTdGFja0NvbmZpZyB9IGZyb20gJy4uLy4uL2xpYi90ZW1wbGF0ZS9hcHAtY29uZmlnJ1xuXG5cbmV4cG9ydCBjbGFzcyBTYW1wbGVWcGNFY3NTdGFjayBleHRlbmRzIGJhc2UuVnBjQmFzZVN0YWNrIHtcblxuICAgIGNvbnN0cnVjdG9yKGFwcENvbnRleHQ6IEFwcENvbnRleHQsIHN0YWNrQ29uZmlnOiBTdGFja0NvbmZpZykge1xuICAgICAgICBzdXBlcihhcHBDb250ZXh0LCBzdGFja0NvbmZpZyk7XG4gICAgfVxuXG4gICAgQE92ZXJyaWRlXG4gICAgb25Mb29rdXBMZWdhY3lWcGMoKTogYmFzZS5WcGNMZWdhY3lMb29rdXBQcm9wcyB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB2cGNOYW1lTGVnYWN5OiB0aGlzLmdldFZhcmlhYmxlKCdWcGNOYW1lJylcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBAT3ZlcnJpZGVcbiAgICBvblBvc3RDb25zdHJ1Y3RvcihiYXNlVnBjPzogZWMyLklWcGMpIHtcbiAgICAgICAgY29uc3QgZGF0YWJhc2VIb3N0TmFtZSA9IHRoaXMuZ2V0UGFyYW1ldGVyKCdEYXRhYmFzZUhvc3ROYW1lJyk7XG4gICAgICAgIGNvbnN0IGRhdGFiYXNlTmFtZSA9IHRoaXMuZ2V0UGFyYW1ldGVyKCdEYXRhYmFzZU5hbWUnKTtcbiAgICAgICAgY29uc3QgZGF0YWJhc2VTZWNyZXRBcm4gPSB0aGlzLmdldFBhcmFtZXRlcignRGF0YWJhc2VTZWNyZXRBcm4nKTtcbiAgICAgICAgY29uc3QgZGF0YWJhc2VTZWNyZXQgPSBzbS5TZWNyZXQuZnJvbVNlY3JldENvbXBsZXRlQXJuKHRoaXMsICdzZWNyZXQnLCBkYXRhYmFzZVNlY3JldEFybik7XG5cbiAgICAgICAgY29uc3QgdGFza0RlZiA9IG5ldyBlY3MuRmFyZ2F0ZVRhc2tEZWZpbml0aW9uKHRoaXMsICdUYXNrRGVmJyk7XG4gICAgICAgIHRhc2tEZWYuYWRkQ29udGFpbmVyKCdEZWZhdWx0Q29udGFpbmVyJywge1xuICAgICAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tQXNzZXQodGhpcy5zdGFja0NvbmZpZy5GaWxlUGF0aCksXG4gICAgICAgICAgICBsb2dnaW5nOiBuZXcgZWNzLkF3c0xvZ0RyaXZlcih7XG4gICAgICAgICAgICAgICAgc3RyZWFtUHJlZml4OiB0aGlzLndpdGhQcm9qZWN0UHJlZml4KCdiYWNrZW5kLWZhc3RhcGknKVxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICAgICAgICAgIEhPU1RfTkFNRTogZGF0YWJhc2VIb3N0TmFtZSxcbiAgICAgICAgICAgICAgICBEQVRBQkFTRV9OQU1FOiBkYXRhYmFzZU5hbWUsXG4gICAgICAgICAgICAgICAgU0VDUkVUX0FSTjogZGF0YWJhc2VTZWNyZXRBcm4sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcG9ydE1hcHBpbmdzOiBbe1xuICAgICAgICAgICAgICAgIGNvbnRhaW5lclBvcnQ6IDgwLFxuICAgICAgICAgICAgICAgIHByb3RvY29sOiBlY3MuUHJvdG9jb2wuVENQXG4gICAgICAgICAgICB9XVxuICAgICAgICB9KTtcbiAgICAgICAgZGF0YWJhc2VTZWNyZXQuZ3JhbnRSZWFkKHRhc2tEZWYudGFza1JvbGUpO1xuXG4gICAgICAgIGNvbnN0IGFsYkVjc1NlcnZpY2UgPSBuZXcgZWNzUGF0dGVybnMuQXBwbGljYXRpb25Mb2FkQmFsYW5jZWRGYXJnYXRlU2VydmljZSh0aGlzLCAnU2VydmljZScsIHtcbiAgICAgICAgICAgIGNsdXN0ZXI6IG5ldyBlY3MuQ2x1c3Rlcih0aGlzLCAnY2x1c3RlcicsIHtcbiAgICAgICAgICAgICAgICB2cGM6IGJhc2VWcGMsXG4gICAgICAgICAgICAgICAgY2x1c3Rlck5hbWU6IHRoaXMud2l0aFByb2plY3RQcmVmaXgodGhpcy5zdGFja0NvbmZpZy5DbHVzdGVyTmFtZSlcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgbWVtb3J5TGltaXRNaUI6IHRoaXMuc3RhY2tDb25maWcuTWVtb3J5LFxuICAgICAgICAgICAgY3B1OiB0aGlzLnN0YWNrQ29uZmlnLkNwdSxcbiAgICAgICAgICAgIHRhc2tEZWZpbml0aW9uOiB0YXNrRGVmLFxuICAgICAgICAgICAgcHVibGljTG9hZEJhbGFuY2VyOiBmYWxzZSxcbiAgICAgICAgICAgIGRlc2lyZWRDb3VudDogcGFyc2VJbnQodGhpcy5zdGFja0NvbmZpZy5EZXNpcmVkQ291bnQpXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IGRhdGFiYXNlU2VjdXJpdHlHcm91cCA9IGVjMi5TZWN1cml0eUdyb3VwLmZyb21TZWN1cml0eUdyb3VwSWQodGhpcywgJ0RhdGFiYXNlU2VjdXJpdHlHcm91cCcsIHRoaXMuZ2V0UGFyYW1ldGVyKCdEYXRhYmFzZVNlY3VyaXR5R3JvdXAnKSk7XG4gICAgICAgIGRhdGFiYXNlU2VjdXJpdHlHcm91cC5hZGRJbmdyZXNzUnVsZShhbGJFY3NTZXJ2aWNlLnNlcnZpY2UuY29ubmVjdGlvbnMuc2VjdXJpdHlHcm91cHNbMF0sIGVjMi5Qb3J0LnRjcCgzMzA2KSwgJ2Zyb20gYmFja2VuZCBzZycpO1xuICAgIH1cbn1cbiJdfQ==