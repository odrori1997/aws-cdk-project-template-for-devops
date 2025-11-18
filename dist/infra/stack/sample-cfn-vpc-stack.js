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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FtcGxlLWNmbi12cGMtc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9pbmZyYS9zdGFjay9zYW1wbGUtY2ZuLXZwYy1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUdBLHFGQUF1RTtBQUN2RSx5RUFBb0U7QUFLcEUsTUFBYSxpQkFBa0IsU0FBUSxJQUFJLENBQUMsZUFBZTtJQUV2RCxZQUFZLFVBQXNCLEVBQUUsV0FBd0I7UUFDeEQsS0FBSyxDQUFDLFVBQVUsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBR0QsbUJBQW1CO1FBQ2YsT0FBTztZQUNILFlBQVksRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVk7WUFDM0MsVUFBVSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVTtTQUMxQyxDQUFDO0lBQ04sQ0FBQztJQUdELGlCQUFpQixDQUFDLFdBQWdDO1FBQzlDLE1BQU0sTUFBTSxHQUFHLFdBQVcsYUFBWCxXQUFXLHVCQUFYLFdBQVcsQ0FBRSxXQUFXLENBQUMsS0FBSyxDQUFlLENBQUM7UUFFN0QsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDeEQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDekMsQ0FBQztDQUNKO0FBZEc7SUFEQyxxQkFBUTs0REFNUjtBQUdEO0lBREMscUJBQVE7MERBTVI7QUFwQkwsOENBcUJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZWMyIGZyb20gJ2F3cy1jZGstbGliL2F3cy1lYzInO1xuaW1wb3J0ICogYXMgY2ZuX2luYyBmcm9tICdhd3MtY2RrLWxpYi9jbG91ZGZvcm1hdGlvbi1pbmNsdWRlJztcblxuaW1wb3J0ICogYXMgYmFzZSBmcm9tICcuLi8uLi9saWIvdGVtcGxhdGUvc3RhY2svY2ZuL2Nmbi1pbmNsdWRlLXN0YWNrJztcbmltcG9ydCB7IE92ZXJyaWRlIH0gZnJvbSAnLi4vLi4vbGliL3RlbXBsYXRlL3N0YWNrL2Jhc2UvYmFzZS1zdGFjayc7XG5pbXBvcnQgeyBBcHBDb250ZXh0IH0gZnJvbSAnLi4vLi4vbGliL3RlbXBsYXRlL2FwcC1jb250ZXh0JztcbmltcG9ydCB7IFN0YWNrQ29uZmlnIH0gZnJvbSAnLi4vLi4vbGliL3RlbXBsYXRlL2FwcC1jb25maWcnXG5cblxuZXhwb3J0IGNsYXNzIFNhbXBsZUNmblZwY1N0YWNrIGV4dGVuZHMgYmFzZS5DZm5JbmNsdWRlU3RhY2sge1xuXG4gICAgY29uc3RydWN0b3IoYXBwQ29udGV4dDogQXBwQ29udGV4dCwgc3RhY2tDb25maWc6IFN0YWNrQ29uZmlnKSB7XG4gICAgICAgIHN1cGVyKGFwcENvbnRleHQsIHN0YWNrQ29uZmlnKTtcbiAgICB9XG5cbiAgICBAT3ZlcnJpZGVcbiAgICBvbkxvYWRUZW1wbGF0ZVByb3BzKCk6IGJhc2UuQ2ZuVGVtcGxhdGVQcm9wcyB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0ZW1wbGF0ZVBhdGg6IHRoaXMuc3RhY2tDb25maWcuVGVtcGxhdGVQYXRoLFxuICAgICAgICAgICAgcGFyYW1ldGVyczogdGhpcy5zdGFja0NvbmZpZy5QYXJhbWV0ZXJzXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgQE92ZXJyaWRlXG4gICAgb25Qb3N0Q29uc3RydWN0b3IoY2ZuVGVtcGxhdGU/OiBjZm5faW5jLkNmbkluY2x1ZGUpIHtcbiAgICAgICAgY29uc3QgY2ZuVnBjID0gY2ZuVGVtcGxhdGU/LmdldFJlc291cmNlKCdWUEMnKSBhcyBlYzIuQ2ZuVlBDO1xuXG4gICAgICAgIGNvbnN0IHZwY05hbWUgPSB0aGlzLnN0YWNrQ29uZmlnLlBhcmFtZXRlcnNbMF1bJ1ZhbHVlJ107XG4gICAgICAgIHRoaXMucHV0VmFyaWFibGUoJ1ZwY05hbWUnLCB2cGNOYW1lKTtcbiAgICB9XG59XG4iXX0=