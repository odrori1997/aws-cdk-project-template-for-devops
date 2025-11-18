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
exports.SampleCfnVpcStack = void 0;
const base = __importStar(require("../../lib/template/stack/cfn/cfn-include-stack"));
const base_stack_1 = require("../../lib/template/stack/base/base-stack");
class SampleCfnVpcStack extends base.CfnIncludeStack {
    constructor(appContext, stackConfig) {
        super(appContext, stackConfig);
    }
    onLoadTemplateProps() {
        return {
            templatePath: this.stackConfig.TemplatePath,
            parameters: this.stackConfig.Parameters
        };
    }
    onPostConstructor(cfnTemplate) {
        const cfnVpc = cfnTemplate === null || cfnTemplate === void 0 ? void 0 : cfnTemplate.getResource('VPC');
        const vpcName = this.stackConfig.Parameters[0]['Value'];
        this.putVariable('VpcName', vpcName);
    }
}
__decorate([
    base_stack_1.Override
], SampleCfnVpcStack.prototype, "onLoadTemplateProps", null);
__decorate([
    base_stack_1.Override
], SampleCfnVpcStack.prototype, "onPostConstructor", null);
exports.SampleCfnVpcStack = SampleCfnVpcStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FtcGxlLWNmbi12cGMtc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzYW1wbGUtY2ZuLXZwYy1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBR0EscUZBQXVFO0FBQ3ZFLHlFQUFvRTtBQUtwRSxNQUFhLGlCQUFrQixTQUFRLElBQUksQ0FBQyxlQUFlO0lBRXZELFlBQVksVUFBc0IsRUFBRSxXQUF3QjtRQUN4RCxLQUFLLENBQUMsVUFBVSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFHRCxtQkFBbUI7UUFDZixPQUFPO1lBQ0gsWUFBWSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWTtZQUMzQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVO1NBQzFDLENBQUM7SUFDTixDQUFDO0lBR0QsaUJBQWlCLENBQUMsV0FBZ0M7UUFDOUMsTUFBTSxNQUFNLEdBQUcsV0FBVyxhQUFYLFdBQVcsdUJBQVgsV0FBVyxDQUFFLFdBQVcsQ0FBQyxLQUFLLENBQWUsQ0FBQztRQUU3RCxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN4RCxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN6QyxDQUFDO0NBQ0o7QUFkRztJQURDLHFCQUFROzREQU1SO0FBR0Q7SUFEQyxxQkFBUTswREFNUjtBQXBCTCw4Q0FxQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBlYzIgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyBjZm5faW5jIGZyb20gJ2F3cy1jZGstbGliL2Nsb3VkZm9ybWF0aW9uLWluY2x1ZGUnO1xuXG5pbXBvcnQgKiBhcyBiYXNlIGZyb20gJy4uLy4uL2xpYi90ZW1wbGF0ZS9zdGFjay9jZm4vY2ZuLWluY2x1ZGUtc3RhY2snO1xuaW1wb3J0IHsgT3ZlcnJpZGUgfSBmcm9tICcuLi8uLi9saWIvdGVtcGxhdGUvc3RhY2svYmFzZS9iYXNlLXN0YWNrJztcbmltcG9ydCB7IEFwcENvbnRleHQgfSBmcm9tICcuLi8uLi9saWIvdGVtcGxhdGUvYXBwLWNvbnRleHQnO1xuaW1wb3J0IHsgU3RhY2tDb25maWcgfSBmcm9tICcuLi8uLi9saWIvdGVtcGxhdGUvYXBwLWNvbmZpZydcblxuXG5leHBvcnQgY2xhc3MgU2FtcGxlQ2ZuVnBjU3RhY2sgZXh0ZW5kcyBiYXNlLkNmbkluY2x1ZGVTdGFjayB7XG5cbiAgICBjb25zdHJ1Y3RvcihhcHBDb250ZXh0OiBBcHBDb250ZXh0LCBzdGFja0NvbmZpZzogU3RhY2tDb25maWcpIHtcbiAgICAgICAgc3VwZXIoYXBwQ29udGV4dCwgc3RhY2tDb25maWcpO1xuICAgIH1cblxuICAgIEBPdmVycmlkZVxuICAgIG9uTG9hZFRlbXBsYXRlUHJvcHMoKTogYmFzZS5DZm5UZW1wbGF0ZVByb3BzIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRlbXBsYXRlUGF0aDogdGhpcy5zdGFja0NvbmZpZy5UZW1wbGF0ZVBhdGgsXG4gICAgICAgICAgICBwYXJhbWV0ZXJzOiB0aGlzLnN0YWNrQ29uZmlnLlBhcmFtZXRlcnNcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBAT3ZlcnJpZGVcbiAgICBvblBvc3RDb25zdHJ1Y3RvcihjZm5UZW1wbGF0ZT86IGNmbl9pbmMuQ2ZuSW5jbHVkZSkge1xuICAgICAgICBjb25zdCBjZm5WcGMgPSBjZm5UZW1wbGF0ZT8uZ2V0UmVzb3VyY2UoJ1ZQQycpIGFzIGVjMi5DZm5WUEM7XG5cbiAgICAgICAgY29uc3QgdnBjTmFtZSA9IHRoaXMuc3RhY2tDb25maWcuUGFyYW1ldGVyc1swXVsnVmFsdWUnXTtcbiAgICAgICAgdGhpcy5wdXRWYXJpYWJsZSgnVnBjTmFtZScsIHZwY05hbWUpO1xuICAgIH1cbn1cbiJdfQ==