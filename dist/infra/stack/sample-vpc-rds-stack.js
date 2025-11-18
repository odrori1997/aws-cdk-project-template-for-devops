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
exports.SampleVpcRdsStack = void 0;
const cdk = __importStar(require("aws-cdk-lib"));
const rds = __importStar(require("aws-cdk-lib/aws-rds"));
const base = __importStar(require("../../lib/template/stack/vpc/vpc-base-stack"));
const base_stack_1 = require("../../lib/template/stack/base/base-stack");
class SampleVpcRdsStack extends base.VpcBaseStack {
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
        const cluster = new rds.ServerlessCluster(this, 'serverless-rds', {
            vpc: baseVpc,
            clusterIdentifier: this.withProjectPrefix(this.stackConfig.ClusterIdentifier),
            defaultDatabaseName: this.stackConfig.DatabaseName,
            engine: rds.DatabaseClusterEngine.AURORA_MYSQL,
            scaling: {
                autoPause: cdk.Duration.minutes(10),
                minCapacity: rds.AuroraCapacityUnit.ACU_8,
                maxCapacity: rds.AuroraCapacityUnit.ACU_32,
            },
            removalPolicy: cdk.RemovalPolicy.RETAIN,
        });
        this.putParameter('DatabaseHostName', cluster.clusterEndpoint.hostname);
        this.putParameter('DatabaseAddress', cluster.clusterEndpoint.socketAddress);
        this.putParameter('DatabaseName', this.stackConfig.DatabaseName);
        this.putParameter('DatabaseSecretArn', (_a = cluster.secret) === null || _a === void 0 ? void 0 : _a.secretArn);
        this.putParameter('DatabaseSecurityGroup', cluster.connections.securityGroups[0].securityGroupId);
    }
}
__decorate([
    base_stack_1.Override
], SampleVpcRdsStack.prototype, "onLookupLegacyVpc", null);
__decorate([
    base_stack_1.Override
], SampleVpcRdsStack.prototype, "onPostConstructor", null);
exports.SampleVpcRdsStack = SampleVpcRdsStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FtcGxlLXZwYy1yZHMtc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9pbmZyYS9zdGFjay9zYW1wbGUtdnBjLXJkcy1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLGlEQUFtQztBQUVuQyx5REFBMkM7QUFFM0Msa0ZBQW9FO0FBQ3BFLHlFQUFvRTtBQUtwRSxNQUFhLGlCQUFrQixTQUFRLElBQUksQ0FBQyxZQUFZO0lBRXBELFlBQVksVUFBc0IsRUFBRSxXQUF3QjtRQUN4RCxLQUFLLENBQUMsVUFBVSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFHRCxpQkFBaUI7UUFDYixPQUFPO1lBQ0gsYUFBYSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDO1NBQzdDLENBQUM7SUFDTixDQUFDO0lBR0QsaUJBQWlCLENBQUMsT0FBa0I7O1FBQ2hDLE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLGlCQUFpQixDQUFDLElBQUksRUFBRSxnQkFBZ0IsRUFBRTtZQUM5RCxHQUFHLEVBQUUsT0FBUTtZQUNiLGlCQUFpQixFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGlCQUFpQixDQUFDO1lBQzdFLG1CQUFtQixFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWTtZQUNsRCxNQUFNLEVBQUUsR0FBRyxDQUFDLHFCQUFxQixDQUFDLFlBQVk7WUFDOUMsT0FBTyxFQUFFO2dCQUNMLFNBQVMsRUFBRSxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7Z0JBQ25DLFdBQVcsRUFBRSxHQUFHLENBQUMsa0JBQWtCLENBQUMsS0FBSztnQkFDekMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNO2FBQzdDO1lBQ0QsYUFBYSxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsTUFBTTtTQUMxQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsWUFBWSxDQUFDLGtCQUFrQixFQUFFLE9BQU8sQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDeEUsSUFBSSxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsRUFBRSxPQUFPLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzVFLElBQUksQ0FBQyxZQUFZLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDakUsSUFBSSxDQUFDLFlBQVksQ0FBQyxtQkFBbUIsRUFBRSxNQUFBLE9BQU8sQ0FBQyxNQUFNLDBDQUFFLFNBQVUsQ0FBQyxDQUFDO1FBQ25FLElBQUksQ0FBQyxZQUFZLENBQUMsdUJBQXVCLEVBQUUsT0FBTyxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDdEcsQ0FBQztDQUNKO0FBM0JHO0lBREMscUJBQVE7MERBS1I7QUFHRDtJQURDLHFCQUFROzBEQW9CUjtBQWpDTCw4Q0FrQ0MiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyByZHMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXJkcyc7XG5cbmltcG9ydCAqIGFzIGJhc2UgZnJvbSAnLi4vLi4vbGliL3RlbXBsYXRlL3N0YWNrL3ZwYy92cGMtYmFzZS1zdGFjayc7XG5pbXBvcnQgeyBPdmVycmlkZSB9IGZyb20gJy4uLy4uL2xpYi90ZW1wbGF0ZS9zdGFjay9iYXNlL2Jhc2Utc3RhY2snO1xuaW1wb3J0IHsgQXBwQ29udGV4dCB9IGZyb20gJy4uLy4uL2xpYi90ZW1wbGF0ZS9hcHAtY29udGV4dCc7XG5pbXBvcnQgeyBTdGFja0NvbmZpZyB9IGZyb20gJy4uLy4uL2xpYi90ZW1wbGF0ZS9hcHAtY29uZmlnJ1xuXG5cbmV4cG9ydCBjbGFzcyBTYW1wbGVWcGNSZHNTdGFjayBleHRlbmRzIGJhc2UuVnBjQmFzZVN0YWNrIHtcblxuICAgIGNvbnN0cnVjdG9yKGFwcENvbnRleHQ6IEFwcENvbnRleHQsIHN0YWNrQ29uZmlnOiBTdGFja0NvbmZpZykge1xuICAgICAgICBzdXBlcihhcHBDb250ZXh0LCBzdGFja0NvbmZpZyk7XG4gICAgfVxuXG4gICAgQE92ZXJyaWRlXG4gICAgb25Mb29rdXBMZWdhY3lWcGMoKTogYmFzZS5WcGNMZWdhY3lMb29rdXBQcm9wcyB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB2cGNOYW1lTGVnYWN5OiB0aGlzLmdldFZhcmlhYmxlKCdWcGNOYW1lJylcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBAT3ZlcnJpZGVcbiAgICBvblBvc3RDb25zdHJ1Y3RvcihiYXNlVnBjPzogZWMyLklWcGMpIHtcbiAgICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyByZHMuU2VydmVybGVzc0NsdXN0ZXIodGhpcywgJ3NlcnZlcmxlc3MtcmRzJywge1xuICAgICAgICAgICAgdnBjOiBiYXNlVnBjISxcbiAgICAgICAgICAgIGNsdXN0ZXJJZGVudGlmaWVyOiB0aGlzLndpdGhQcm9qZWN0UHJlZml4KHRoaXMuc3RhY2tDb25maWcuQ2x1c3RlcklkZW50aWZpZXIpLFxuICAgICAgICAgICAgZGVmYXVsdERhdGFiYXNlTmFtZTogdGhpcy5zdGFja0NvbmZpZy5EYXRhYmFzZU5hbWUsXG4gICAgICAgICAgICBlbmdpbmU6IHJkcy5EYXRhYmFzZUNsdXN0ZXJFbmdpbmUuQVVST1JBX01ZU1FMLFxuICAgICAgICAgICAgc2NhbGluZzoge1xuICAgICAgICAgICAgICAgIGF1dG9QYXVzZTogY2RrLkR1cmF0aW9uLm1pbnV0ZXMoMTApLFxuICAgICAgICAgICAgICAgIG1pbkNhcGFjaXR5OiByZHMuQXVyb3JhQ2FwYWNpdHlVbml0LkFDVV84LFxuICAgICAgICAgICAgICAgIG1heENhcGFjaXR5OiByZHMuQXVyb3JhQ2FwYWNpdHlVbml0LkFDVV8zMixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZW1vdmFsUG9saWN5OiBjZGsuUmVtb3ZhbFBvbGljeS5SRVRBSU4sXG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5wdXRQYXJhbWV0ZXIoJ0RhdGFiYXNlSG9zdE5hbWUnLCBjbHVzdGVyLmNsdXN0ZXJFbmRwb2ludC5ob3N0bmFtZSk7XG4gICAgICAgIHRoaXMucHV0UGFyYW1ldGVyKCdEYXRhYmFzZUFkZHJlc3MnLCBjbHVzdGVyLmNsdXN0ZXJFbmRwb2ludC5zb2NrZXRBZGRyZXNzKTtcbiAgICAgICAgdGhpcy5wdXRQYXJhbWV0ZXIoJ0RhdGFiYXNlTmFtZScsIHRoaXMuc3RhY2tDb25maWcuRGF0YWJhc2VOYW1lKTtcbiAgICAgICAgdGhpcy5wdXRQYXJhbWV0ZXIoJ0RhdGFiYXNlU2VjcmV0QXJuJywgY2x1c3Rlci5zZWNyZXQ/LnNlY3JldEFybiEpO1xuICAgICAgICB0aGlzLnB1dFBhcmFtZXRlcignRGF0YWJhc2VTZWN1cml0eUdyb3VwJywgY2x1c3Rlci5jb25uZWN0aW9ucy5zZWN1cml0eUdyb3Vwc1swXS5zZWN1cml0eUdyb3VwSWQpO1xuICAgIH1cbn1cbiJdfQ==