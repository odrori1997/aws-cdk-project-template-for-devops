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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnBjLWJhc2Utc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9saWIvdGVtcGxhdGUvc3RhY2svdnBjL3ZwYy1iYXNlLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSx5REFBMkM7QUFFM0MseURBQTJDO0FBVTNDLE1BQXNCLFlBQWEsU0FBUSxJQUFJLENBQUMsU0FBUztJQU1yRCxZQUFZLFVBQXNCLEVBQUUsV0FBd0I7UUFDeEQsS0FBSyxDQUFDLFVBQVUsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUUvQixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztRQUV2QyxJQUFJLEtBQUssSUFBSSxTQUFTLEVBQUU7WUFDcEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ3hDO2FBQU07WUFDSCxJQUFJLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQztTQUM1QjtRQUVELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUVTLFNBQVMsQ0FBQyxLQUEyQjtRQUMzQyxJQUFJLEtBQUssQ0FBQyxXQUFXLElBQUksU0FBUyxJQUFJLEtBQUssQ0FBQyxXQUFXLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUNoRSxNQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFO2dCQUM1QyxLQUFLLEVBQUUsS0FBSyxDQUFDLFdBQVc7YUFDM0IsQ0FBQyxDQUFDO1lBQ0gsT0FBTyxHQUFHLENBQUM7U0FDZDthQUFNLElBQUksS0FBSyxDQUFDLGFBQWEsSUFBSSxTQUFTLElBQUksS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQzNFLE1BQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUU7Z0JBQzVDLE9BQU8sRUFBRSxLQUFLLENBQUMsYUFBYTthQUMvQixDQUFDLENBQUM7WUFDSCxPQUFPLEdBQUcsQ0FBQztTQUNkO2FBQU07WUFDSCxPQUFPLENBQUMsS0FBSyxDQUFDLGlFQUFpRSxDQUFDLENBQUM7WUFDakYsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtTQUNsQjtJQUNMLENBQUM7SUFFUyxTQUFTLENBQUMsUUFBZ0IsRUFBRSxTQUFpQixFQUFFLE9BQWUsRUFBRSxXQUFtQjtRQUN6RixJQUFJLFNBQVMsR0FBRyxDQUFDLElBQUksT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDckMsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQ2xDO2dCQUNJLE1BQU0sRUFBRSxTQUFTO2dCQUNqQixJQUFJLEVBQUUsT0FBTztnQkFDYixXQUFXLEVBQUUsV0FBVzthQUMzQixDQUFDLENBQUM7WUFDUCxPQUFPLEdBQUcsQ0FBQztTQUNkO2FBQU07WUFDSCxPQUFPLENBQUMsS0FBSyxDQUFDLDBEQUEwRCxDQUFDLENBQUM7WUFDMUUsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtTQUNsQjtJQUNMLENBQUM7Q0FDSjtBQW5ERCxvQ0FtREMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBlYzIgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjMic7XG5cbmltcG9ydCAqIGFzIGJhc2UgZnJvbSAnLi4vYmFzZS9iYXNlLXN0YWNrJztcbmltcG9ydCB7IEFwcENvbnRleHQgfSBmcm9tICcuLi8uLi9hcHAtY29udGV4dCc7XG5pbXBvcnQgeyBTdGFja0NvbmZpZyB9IGZyb20gJy4uLy4uL2FwcC1jb25maWcnXG5cblxuZXhwb3J0IGludGVyZmFjZSBWcGNMZWdhY3lMb29rdXBQcm9wcyB7XG4gICAgdnBjSWRMZWdhY3k/OiBzdHJpbmc7XG4gICAgdnBjTmFtZUxlZ2FjeT86IHN0cmluZztcbn1cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFZwY0Jhc2VTdGFjayBleHRlbmRzIGJhc2UuQmFzZVN0YWNrIHtcbiAgICBwcml2YXRlIGJhc2VWcGM/OiBlYzIuSVZwYztcblxuICAgIGFic3RyYWN0IG9uTG9va3VwTGVnYWN5VnBjKCk6IFZwY0xlZ2FjeUxvb2t1cFByb3BzIHwgdW5kZWZpbmVkO1xuICAgIGFic3RyYWN0IG9uUG9zdENvbnN0cnVjdG9yKGJhc2VWcGM/OiBlYzIuSVZwYyk6IHZvaWQ7XG5cbiAgICBjb25zdHJ1Y3RvcihhcHBDb250ZXh0OiBBcHBDb250ZXh0LCBzdGFja0NvbmZpZzogU3RhY2tDb25maWcpIHtcbiAgICAgICAgc3VwZXIoYXBwQ29udGV4dCwgc3RhY2tDb25maWcpO1xuXG4gICAgICAgIGNvbnN0IHByb3BzID0gdGhpcy5vbkxvb2t1cExlZ2FjeVZwYygpO1xuXG4gICAgICAgIGlmIChwcm9wcyAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuYmFzZVZwYyA9IHRoaXMuaW1wb3J0VnBjKHByb3BzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYmFzZVZwYyA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMub25Qb3N0Q29uc3RydWN0b3IodGhpcy5iYXNlVnBjKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgaW1wb3J0VnBjKHByb3BzOiBWcGNMZWdhY3lMb29rdXBQcm9wcyk6IGVjMi5JVnBjIHtcbiAgICAgICAgaWYgKHByb3BzLnZwY0lkTGVnYWN5ICE9IHVuZGVmaW5lZCAmJiBwcm9wcy52cGNJZExlZ2FjeS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb25zdCB2cGMgPSBlYzIuVnBjLmZyb21Mb29rdXAodGhpcywgYEJhc2VWUENgLCB7XG4gICAgICAgICAgICAgICAgdnBjSWQ6IHByb3BzLnZwY0lkTGVnYWN5LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gdnBjO1xuICAgICAgICB9IGVsc2UgaWYgKHByb3BzLnZwY05hbWVMZWdhY3kgIT0gdW5kZWZpbmVkICYmIHByb3BzLnZwY05hbWVMZWdhY3kubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29uc3QgdnBjID0gZWMyLlZwYy5mcm9tTG9va3VwKHRoaXMsIGBCYXNlVlBDYCwge1xuICAgICAgICAgICAgICAgIHZwY05hbWU6IHByb3BzLnZwY05hbWVMZWdhY3lcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHZwYztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ3BsZWFzZSBjaGVjayBWUEMgaW1wb3J0IG9wdGlvbnM6IFZQQ0lEIG9yIFZQQ05hbWUgaXMgZXNzZW50aWFsLicpO1xuICAgICAgICAgICAgcHJvY2Vzcy5leGl0KDEpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgY3JlYXRlVnBjKGJhc2VOYW1lOiBzdHJpbmcsIHZwY01heEF6czogbnVtYmVyLCB2cGNDaWRyOiBzdHJpbmcsIG5hdEdhdGV3YXlzOiBudW1iZXIpOiBlYzIuSVZwYyB7XG4gICAgICAgIGlmICh2cGNNYXhBenMgPiAwICYmIHZwY0NpZHIubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGModGhpcywgYmFzZU5hbWUsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBtYXhBenM6IHZwY01heEF6cyxcbiAgICAgICAgICAgICAgICAgICAgY2lkcjogdnBjQ2lkcixcbiAgICAgICAgICAgICAgICAgICAgbmF0R2F0ZXdheXM6IG5hdEdhdGV3YXlzXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gdnBjO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcigncGxlYXNlIGNoZWNrIHRoZSBvcHRpb25zOiBWUENNYXhBenMsIFZQQ0NJRFIsIE5BVEdhdGV3YXknKTtcbiAgICAgICAgICAgIHByb2Nlc3MuZXhpdCgxKVxuICAgICAgICB9XG4gICAgfVxufVxuIl19