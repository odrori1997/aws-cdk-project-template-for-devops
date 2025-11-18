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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FtcGxlLXZwYy1lY3Mtc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzYW1wbGUtdnBjLWVjcy1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EseURBQTJDO0FBQzNDLHlEQUEyQztBQUMzQyxtRUFBcUQ7QUFDckQsMEVBQTREO0FBRTVELGtGQUFvRTtBQUNwRSx5RUFBb0U7QUFLcEUsTUFBYSxpQkFBa0IsU0FBUSxJQUFJLENBQUMsWUFBWTtJQUVwRCxZQUFZLFVBQXNCLEVBQUUsV0FBd0I7UUFDeEQsS0FBSyxDQUFDLFVBQVUsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBR0QsaUJBQWlCO1FBQ2IsT0FBTztZQUNILGFBQWEsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQztTQUM3QyxDQUFDO0lBQ04sQ0FBQztJQUdELGlCQUFpQixDQUFDLE9BQWtCO1FBQ2hDLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQy9ELE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDdkQsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDakUsTUFBTSxjQUFjLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLGlCQUFpQixDQUFDLENBQUM7UUFFMUYsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMscUJBQXFCLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQy9ELE9BQU8sQ0FBQyxZQUFZLENBQUMsa0JBQWtCLEVBQUU7WUFDckMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDO1lBQzlELE9BQU8sRUFBRSxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUM7Z0JBQzFCLFlBQVksRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsaUJBQWlCLENBQUM7YUFDMUQsQ0FBQztZQUNGLFdBQVcsRUFBRTtnQkFDVCxTQUFTLEVBQUUsZ0JBQWdCO2dCQUMzQixhQUFhLEVBQUUsWUFBWTtnQkFDM0IsVUFBVSxFQUFFLGlCQUFpQjthQUNoQztZQUNELFlBQVksRUFBRSxDQUFDO29CQUNYLGFBQWEsRUFBRSxFQUFFO29CQUNqQixRQUFRLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHO2lCQUM3QixDQUFDO1NBQ0wsQ0FBQyxDQUFDO1FBQ0gsY0FBYyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFM0MsTUFBTSxhQUFhLEdBQUcsSUFBSSxXQUFXLENBQUMscUNBQXFDLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRTtZQUN6RixPQUFPLEVBQUUsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUU7Z0JBQ3RDLEdBQUcsRUFBRSxPQUFPO2dCQUNaLFdBQVcsRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUM7YUFDcEUsQ0FBQztZQUNGLGNBQWMsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU07WUFDdkMsR0FBRyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRztZQUN6QixjQUFjLEVBQUUsT0FBTztZQUN2QixrQkFBa0IsRUFBRSxLQUFLO1lBQ3pCLFlBQVksRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUM7U0FDeEQsQ0FBQyxDQUFDO1FBRUgsTUFBTSxxQkFBcUIsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLG1CQUFtQixDQUFDLElBQUksRUFBRSx1QkFBdUIsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQztRQUMvSSxxQkFBcUIsQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLGlCQUFpQixDQUFDLENBQUM7SUFDckksQ0FBQztDQUNKO0FBOUNHO0lBREMscUJBQVE7MERBS1I7QUFHRDtJQURDLHFCQUFROzBEQXVDUjtBQXBETCw4Q0FxREMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWMyJztcbmltcG9ydCAqIGFzIGVjcyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWNzJztcbmltcG9ydCAqIGFzIHNtIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zZWNyZXRzbWFuYWdlcic7XG5pbXBvcnQgKiBhcyBlY3NQYXR0ZXJucyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWNzLXBhdHRlcm5zJztcblxuaW1wb3J0ICogYXMgYmFzZSBmcm9tICcuLi8uLi9saWIvdGVtcGxhdGUvc3RhY2svdnBjL3ZwYy1iYXNlLXN0YWNrJztcbmltcG9ydCB7IE92ZXJyaWRlIH0gZnJvbSAnLi4vLi4vbGliL3RlbXBsYXRlL3N0YWNrL2Jhc2UvYmFzZS1zdGFjayc7XG5pbXBvcnQgeyBBcHBDb250ZXh0IH0gZnJvbSAnLi4vLi4vbGliL3RlbXBsYXRlL2FwcC1jb250ZXh0JztcbmltcG9ydCB7IFN0YWNrQ29uZmlnIH0gZnJvbSAnLi4vLi4vbGliL3RlbXBsYXRlL2FwcC1jb25maWcnXG5cblxuZXhwb3J0IGNsYXNzIFNhbXBsZVZwY0Vjc1N0YWNrIGV4dGVuZHMgYmFzZS5WcGNCYXNlU3RhY2sge1xuXG4gICAgY29uc3RydWN0b3IoYXBwQ29udGV4dDogQXBwQ29udGV4dCwgc3RhY2tDb25maWc6IFN0YWNrQ29uZmlnKSB7XG4gICAgICAgIHN1cGVyKGFwcENvbnRleHQsIHN0YWNrQ29uZmlnKTtcbiAgICB9XG5cbiAgICBAT3ZlcnJpZGVcbiAgICBvbkxvb2t1cExlZ2FjeVZwYygpOiBiYXNlLlZwY0xlZ2FjeUxvb2t1cFByb3BzIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHZwY05hbWVMZWdhY3k6IHRoaXMuZ2V0VmFyaWFibGUoJ1ZwY05hbWUnKVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIEBPdmVycmlkZVxuICAgIG9uUG9zdENvbnN0cnVjdG9yKGJhc2VWcGM/OiBlYzIuSVZwYykge1xuICAgICAgICBjb25zdCBkYXRhYmFzZUhvc3ROYW1lID0gdGhpcy5nZXRQYXJhbWV0ZXIoJ0RhdGFiYXNlSG9zdE5hbWUnKTtcbiAgICAgICAgY29uc3QgZGF0YWJhc2VOYW1lID0gdGhpcy5nZXRQYXJhbWV0ZXIoJ0RhdGFiYXNlTmFtZScpO1xuICAgICAgICBjb25zdCBkYXRhYmFzZVNlY3JldEFybiA9IHRoaXMuZ2V0UGFyYW1ldGVyKCdEYXRhYmFzZVNlY3JldEFybicpO1xuICAgICAgICBjb25zdCBkYXRhYmFzZVNlY3JldCA9IHNtLlNlY3JldC5mcm9tU2VjcmV0Q29tcGxldGVBcm4odGhpcywgJ3NlY3JldCcsIGRhdGFiYXNlU2VjcmV0QXJuKTtcblxuICAgICAgICBjb25zdCB0YXNrRGVmID0gbmV3IGVjcy5GYXJnYXRlVGFza0RlZmluaXRpb24odGhpcywgJ1Rhc2tEZWYnKTtcbiAgICAgICAgdGFza0RlZi5hZGRDb250YWluZXIoJ0RlZmF1bHRDb250YWluZXInLCB7XG4gICAgICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21Bc3NldCh0aGlzLnN0YWNrQ29uZmlnLkZpbGVQYXRoKSxcbiAgICAgICAgICAgIGxvZ2dpbmc6IG5ldyBlY3MuQXdzTG9nRHJpdmVyKHtcbiAgICAgICAgICAgICAgICBzdHJlYW1QcmVmaXg6IHRoaXMud2l0aFByb2plY3RQcmVmaXgoJ2JhY2tlbmQtZmFzdGFwaScpXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgICAgICAgICAgSE9TVF9OQU1FOiBkYXRhYmFzZUhvc3ROYW1lLFxuICAgICAgICAgICAgICAgIERBVEFCQVNFX05BTUU6IGRhdGFiYXNlTmFtZSxcbiAgICAgICAgICAgICAgICBTRUNSRVRfQVJOOiBkYXRhYmFzZVNlY3JldEFybixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwb3J0TWFwcGluZ3M6IFt7XG4gICAgICAgICAgICAgICAgY29udGFpbmVyUG9ydDogODAsXG4gICAgICAgICAgICAgICAgcHJvdG9jb2w6IGVjcy5Qcm90b2NvbC5UQ1BcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuICAgICAgICBkYXRhYmFzZVNlY3JldC5ncmFudFJlYWQodGFza0RlZi50YXNrUm9sZSk7XG5cbiAgICAgICAgY29uc3QgYWxiRWNzU2VydmljZSA9IG5ldyBlY3NQYXR0ZXJucy5BcHBsaWNhdGlvbkxvYWRCYWxhbmNlZEZhcmdhdGVTZXJ2aWNlKHRoaXMsICdTZXJ2aWNlJywge1xuICAgICAgICAgICAgY2x1c3RlcjogbmV3IGVjcy5DbHVzdGVyKHRoaXMsICdjbHVzdGVyJywge1xuICAgICAgICAgICAgICAgIHZwYzogYmFzZVZwYyxcbiAgICAgICAgICAgICAgICBjbHVzdGVyTmFtZTogdGhpcy53aXRoUHJvamVjdFByZWZpeCh0aGlzLnN0YWNrQ29uZmlnLkNsdXN0ZXJOYW1lKVxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBtZW1vcnlMaW1pdE1pQjogdGhpcy5zdGFja0NvbmZpZy5NZW1vcnksXG4gICAgICAgICAgICBjcHU6IHRoaXMuc3RhY2tDb25maWcuQ3B1LFxuICAgICAgICAgICAgdGFza0RlZmluaXRpb246IHRhc2tEZWYsXG4gICAgICAgICAgICBwdWJsaWNMb2FkQmFsYW5jZXI6IGZhbHNlLFxuICAgICAgICAgICAgZGVzaXJlZENvdW50OiBwYXJzZUludCh0aGlzLnN0YWNrQ29uZmlnLkRlc2lyZWRDb3VudClcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgZGF0YWJhc2VTZWN1cml0eUdyb3VwID0gZWMyLlNlY3VyaXR5R3JvdXAuZnJvbVNlY3VyaXR5R3JvdXBJZCh0aGlzLCAnRGF0YWJhc2VTZWN1cml0eUdyb3VwJywgdGhpcy5nZXRQYXJhbWV0ZXIoJ0RhdGFiYXNlU2VjdXJpdHlHcm91cCcpKTtcbiAgICAgICAgZGF0YWJhc2VTZWN1cml0eUdyb3VwLmFkZEluZ3Jlc3NSdWxlKGFsYkVjc1NlcnZpY2Uuc2VydmljZS5jb25uZWN0aW9ucy5zZWN1cml0eUdyb3Vwc1swXSwgZWMyLlBvcnQudGNwKDMzMDYpLCAnZnJvbSBiYWNrZW5kIHNnJyk7XG4gICAgfVxufVxuIl19