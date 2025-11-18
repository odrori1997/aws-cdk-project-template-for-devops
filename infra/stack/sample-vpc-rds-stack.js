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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FtcGxlLXZwYy1yZHMtc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzYW1wbGUtdnBjLXJkcy1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsaURBQW1DO0FBRW5DLHlEQUEyQztBQUUzQyxrRkFBb0U7QUFDcEUseUVBQW9FO0FBS3BFLE1BQWEsaUJBQWtCLFNBQVEsSUFBSSxDQUFDLFlBQVk7SUFFcEQsWUFBWSxVQUFzQixFQUFFLFdBQXdCO1FBQ3hELEtBQUssQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUdELGlCQUFpQjtRQUNiLE9BQU87WUFDSCxhQUFhLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUM7U0FDN0MsQ0FBQztJQUNOLENBQUM7SUFHRCxpQkFBaUIsQ0FBQyxPQUFrQjs7UUFDaEMsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLGdCQUFnQixFQUFFO1lBQzlELEdBQUcsRUFBRSxPQUFRO1lBQ2IsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsaUJBQWlCLENBQUM7WUFDN0UsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZO1lBQ2xELE1BQU0sRUFBRSxHQUFHLENBQUMscUJBQXFCLENBQUMsWUFBWTtZQUM5QyxPQUFPLEVBQUU7Z0JBQ0wsU0FBUyxFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztnQkFDbkMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLO2dCQUN6QyxXQUFXLEVBQUUsR0FBRyxDQUFDLGtCQUFrQixDQUFDLE1BQU07YUFDN0M7WUFDRCxhQUFhLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxNQUFNO1NBQzFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxZQUFZLENBQUMsa0JBQWtCLEVBQUUsT0FBTyxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN4RSxJQUFJLENBQUMsWUFBWSxDQUFDLGlCQUFpQixFQUFFLE9BQU8sQ0FBQyxlQUFlLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDNUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUNqRSxJQUFJLENBQUMsWUFBWSxDQUFDLG1CQUFtQixFQUFFLE1BQUEsT0FBTyxDQUFDLE1BQU0sMENBQUUsU0FBVSxDQUFDLENBQUM7UUFDbkUsSUFBSSxDQUFDLFlBQVksQ0FBQyx1QkFBdUIsRUFBRSxPQUFPLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUN0RyxDQUFDO0NBQ0o7QUEzQkc7SUFEQyxxQkFBUTswREFLUjtBQUdEO0lBREMscUJBQVE7MERBb0JSO0FBakNMLDhDQWtDQyIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWMyJztcbmltcG9ydCAqIGFzIHJkcyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtcmRzJztcblxuaW1wb3J0ICogYXMgYmFzZSBmcm9tICcuLi8uLi9saWIvdGVtcGxhdGUvc3RhY2svdnBjL3ZwYy1iYXNlLXN0YWNrJztcbmltcG9ydCB7IE92ZXJyaWRlIH0gZnJvbSAnLi4vLi4vbGliL3RlbXBsYXRlL3N0YWNrL2Jhc2UvYmFzZS1zdGFjayc7XG5pbXBvcnQgeyBBcHBDb250ZXh0IH0gZnJvbSAnLi4vLi4vbGliL3RlbXBsYXRlL2FwcC1jb250ZXh0JztcbmltcG9ydCB7IFN0YWNrQ29uZmlnIH0gZnJvbSAnLi4vLi4vbGliL3RlbXBsYXRlL2FwcC1jb25maWcnXG5cblxuZXhwb3J0IGNsYXNzIFNhbXBsZVZwY1Jkc1N0YWNrIGV4dGVuZHMgYmFzZS5WcGNCYXNlU3RhY2sge1xuXG4gICAgY29uc3RydWN0b3IoYXBwQ29udGV4dDogQXBwQ29udGV4dCwgc3RhY2tDb25maWc6IFN0YWNrQ29uZmlnKSB7XG4gICAgICAgIHN1cGVyKGFwcENvbnRleHQsIHN0YWNrQ29uZmlnKTtcbiAgICB9XG5cbiAgICBAT3ZlcnJpZGVcbiAgICBvbkxvb2t1cExlZ2FjeVZwYygpOiBiYXNlLlZwY0xlZ2FjeUxvb2t1cFByb3BzIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHZwY05hbWVMZWdhY3k6IHRoaXMuZ2V0VmFyaWFibGUoJ1ZwY05hbWUnKVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIEBPdmVycmlkZVxuICAgIG9uUG9zdENvbnN0cnVjdG9yKGJhc2VWcGM/OiBlYzIuSVZwYykge1xuICAgICAgICBjb25zdCBjbHVzdGVyID0gbmV3IHJkcy5TZXJ2ZXJsZXNzQ2x1c3Rlcih0aGlzLCAnc2VydmVybGVzcy1yZHMnLCB7XG4gICAgICAgICAgICB2cGM6IGJhc2VWcGMhLFxuICAgICAgICAgICAgY2x1c3RlcklkZW50aWZpZXI6IHRoaXMud2l0aFByb2plY3RQcmVmaXgodGhpcy5zdGFja0NvbmZpZy5DbHVzdGVySWRlbnRpZmllciksXG4gICAgICAgICAgICBkZWZhdWx0RGF0YWJhc2VOYW1lOiB0aGlzLnN0YWNrQ29uZmlnLkRhdGFiYXNlTmFtZSxcbiAgICAgICAgICAgIGVuZ2luZTogcmRzLkRhdGFiYXNlQ2x1c3RlckVuZ2luZS5BVVJPUkFfTVlTUUwsXG4gICAgICAgICAgICBzY2FsaW5nOiB7XG4gICAgICAgICAgICAgICAgYXV0b1BhdXNlOiBjZGsuRHVyYXRpb24ubWludXRlcygxMCksXG4gICAgICAgICAgICAgICAgbWluQ2FwYWNpdHk6IHJkcy5BdXJvcmFDYXBhY2l0eVVuaXQuQUNVXzgsXG4gICAgICAgICAgICAgICAgbWF4Q2FwYWNpdHk6IHJkcy5BdXJvcmFDYXBhY2l0eVVuaXQuQUNVXzMyLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LlJFVEFJTixcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLnB1dFBhcmFtZXRlcignRGF0YWJhc2VIb3N0TmFtZScsIGNsdXN0ZXIuY2x1c3RlckVuZHBvaW50Lmhvc3RuYW1lKTtcbiAgICAgICAgdGhpcy5wdXRQYXJhbWV0ZXIoJ0RhdGFiYXNlQWRkcmVzcycsIGNsdXN0ZXIuY2x1c3RlckVuZHBvaW50LnNvY2tldEFkZHJlc3MpO1xuICAgICAgICB0aGlzLnB1dFBhcmFtZXRlcignRGF0YWJhc2VOYW1lJywgdGhpcy5zdGFja0NvbmZpZy5EYXRhYmFzZU5hbWUpO1xuICAgICAgICB0aGlzLnB1dFBhcmFtZXRlcignRGF0YWJhc2VTZWNyZXRBcm4nLCBjbHVzdGVyLnNlY3JldD8uc2VjcmV0QXJuISk7XG4gICAgICAgIHRoaXMucHV0UGFyYW1ldGVyKCdEYXRhYmFzZVNlY3VyaXR5R3JvdXAnLCBjbHVzdGVyLmNvbm5lY3Rpb25zLnNlY3VyaXR5R3JvdXBzWzBdLnNlY3VyaXR5R3JvdXBJZCk7XG4gICAgfVxufVxuIl19