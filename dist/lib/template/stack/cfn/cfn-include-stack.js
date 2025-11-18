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
exports.CfnIncludeStack = void 0;
const cfn_inc = __importStar(require("aws-cdk-lib/cloudformation-include"));
const base = __importStar(require("../base/base-stack"));
class CfnIncludeStack extends base.BaseStack {
    constructor(appContext, stackConfig) {
        super(appContext, stackConfig);
        const props = this.onLoadTemplateProps();
        if (props != undefined) {
            this.cfnTemplate = this.loadTemplate(props);
        }
        else {
            this.cfnTemplate = undefined;
        }
        this.onPostConstructor(this.cfnTemplate);
    }
    loadTemplate(props) {
        const cfnTemplate = new cfn_inc.CfnInclude(this, 'cfn-template', {
            templateFile: props.templatePath,
        });
        if (props.parameters != undefined) {
            for (let param of props.parameters) {
                const paramEnv = cfnTemplate.getParameter(param.Key);
                paramEnv.default = param.Value;
            }
        }
        return cfnTemplate;
    }
}
exports.CfnIncludeStack = CfnIncludeStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2ZuLWluY2x1ZGUtc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9saWIvdGVtcGxhdGUvc3RhY2svY2ZuL2Nmbi1pbmNsdWRlLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw0RUFBOEQ7QUFFOUQseURBQTJDO0FBVTNDLE1BQXNCLGVBQWdCLFNBQVEsSUFBSSxDQUFDLFNBQVM7SUFNeEQsWUFBWSxVQUFzQixFQUFFLFdBQXdCO1FBQ3hELEtBQUssQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFFL0IsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7UUFFekMsSUFBSSxLQUFLLElBQUksU0FBUyxFQUFFO1lBQ3BCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUMvQzthQUFNO1lBQ0gsSUFBSSxDQUFDLFdBQVcsR0FBRyxTQUFTLENBQUM7U0FDaEM7UUFFRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFTyxZQUFZLENBQUMsS0FBdUI7UUFDeEMsTUFBTSxXQUFXLEdBQUcsSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxjQUFjLEVBQUU7WUFDN0QsWUFBWSxFQUFFLEtBQUssQ0FBQyxZQUFZO1NBQ25DLENBQUMsQ0FBQztRQUVILElBQUksS0FBSyxDQUFDLFVBQVUsSUFBSSxTQUFTLEVBQUU7WUFDL0IsS0FBSSxJQUFJLEtBQUssSUFBSSxLQUFLLENBQUMsVUFBVSxFQUFFO2dCQUMvQixNQUFNLFFBQVEsR0FBRyxXQUFXLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDckQsUUFBUSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO2FBQ2xDO1NBQ0o7UUFFRCxPQUFPLFdBQVcsQ0FBQztJQUN2QixDQUFDO0NBQ0o7QUFsQ0QsMENBa0NDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2ZuX2luYyBmcm9tICdhd3MtY2RrLWxpYi9jbG91ZGZvcm1hdGlvbi1pbmNsdWRlJztcblxuaW1wb3J0ICogYXMgYmFzZSBmcm9tICcuLi9iYXNlL2Jhc2Utc3RhY2snO1xuaW1wb3J0IHsgQXBwQ29udGV4dCB9IGZyb20gJy4uLy4uL2FwcC1jb250ZXh0JztcbmltcG9ydCB7IFN0YWNrQ29uZmlnIH0gZnJvbSAnLi4vLi4vYXBwLWNvbmZpZydcblxuXG5leHBvcnQgaW50ZXJmYWNlIENmblRlbXBsYXRlUHJvcHMge1xuICAgIHRlbXBsYXRlUGF0aDogc3RyaW5nO1xuICAgIHBhcmFtZXRlcnM/OiBhbnk7XG59XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBDZm5JbmNsdWRlU3RhY2sgZXh0ZW5kcyBiYXNlLkJhc2VTdGFjayB7XG4gICAgcHJpdmF0ZSBjZm5UZW1wbGF0ZT86IGNmbl9pbmMuQ2ZuSW5jbHVkZTtcblxuICAgIGFic3RyYWN0IG9uTG9hZFRlbXBsYXRlUHJvcHMoKTogQ2ZuVGVtcGxhdGVQcm9wcyB8IHVuZGVmaW5lZDtcbiAgICBhYnN0cmFjdCBvblBvc3RDb25zdHJ1Y3RvcihjZm5UZW1wbGF0ZT86IGNmbl9pbmMuQ2ZuSW5jbHVkZSk6IHZvaWQ7XG5cbiAgICBjb25zdHJ1Y3RvcihhcHBDb250ZXh0OiBBcHBDb250ZXh0LCBzdGFja0NvbmZpZzogU3RhY2tDb25maWcpIHtcbiAgICAgICAgc3VwZXIoYXBwQ29udGV4dCwgc3RhY2tDb25maWcpO1xuXG4gICAgICAgIGNvbnN0IHByb3BzID0gdGhpcy5vbkxvYWRUZW1wbGF0ZVByb3BzKCk7XG5cbiAgICAgICAgaWYgKHByb3BzICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5jZm5UZW1wbGF0ZSA9IHRoaXMubG9hZFRlbXBsYXRlKHByb3BzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY2ZuVGVtcGxhdGUgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm9uUG9zdENvbnN0cnVjdG9yKHRoaXMuY2ZuVGVtcGxhdGUpO1xuICAgIH1cblxuICAgIHByaXZhdGUgbG9hZFRlbXBsYXRlKHByb3BzOiBDZm5UZW1wbGF0ZVByb3BzKTogY2ZuX2luYy5DZm5JbmNsdWRlIHtcbiAgICAgICAgY29uc3QgY2ZuVGVtcGxhdGUgPSBuZXcgY2ZuX2luYy5DZm5JbmNsdWRlKHRoaXMsICdjZm4tdGVtcGxhdGUnLCB7XG4gICAgICAgICAgICB0ZW1wbGF0ZUZpbGU6IHByb3BzLnRlbXBsYXRlUGF0aCxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHByb3BzLnBhcmFtZXRlcnMgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBmb3IobGV0IHBhcmFtIG9mIHByb3BzLnBhcmFtZXRlcnMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwYXJhbUVudiA9IGNmblRlbXBsYXRlLmdldFBhcmFtZXRlcihwYXJhbS5LZXkpO1xuICAgICAgICAgICAgICAgIHBhcmFtRW52LmRlZmF1bHQgPSBwYXJhbS5WYWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjZm5UZW1wbGF0ZTtcbiAgICB9XG59XG4iXX0=