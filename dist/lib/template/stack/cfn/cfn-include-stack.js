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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2ZuLWluY2x1ZGUtc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9saWIvdGVtcGxhdGUvc3RhY2svY2ZuL2Nmbi1pbmNsdWRlLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNEVBQThEO0FBRTlELHlEQUEyQztBQVUzQyxNQUFzQixlQUFnQixTQUFRLElBQUksQ0FBQyxTQUFTO0lBTXhELFlBQVksVUFBc0IsRUFBRSxXQUF3QjtRQUN4RCxLQUFLLENBQUMsVUFBVSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBRS9CLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1FBRXpDLElBQUksS0FBSyxJQUFJLFNBQVMsRUFBRTtZQUNwQixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDL0M7YUFBTTtZQUNILElBQUksQ0FBQyxXQUFXLEdBQUcsU0FBUyxDQUFDO1NBQ2hDO1FBRUQsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRU8sWUFBWSxDQUFDLEtBQXVCO1FBQ3hDLE1BQU0sV0FBVyxHQUFHLElBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQzdELFlBQVksRUFBRSxLQUFLLENBQUMsWUFBWTtTQUNuQyxDQUFDLENBQUM7UUFFSCxJQUFJLEtBQUssQ0FBQyxVQUFVLElBQUksU0FBUyxFQUFFO1lBQy9CLEtBQUksSUFBSSxLQUFLLElBQUksS0FBSyxDQUFDLFVBQVUsRUFBRTtnQkFDL0IsTUFBTSxRQUFRLEdBQUcsV0FBVyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ3JELFFBQVEsQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQzthQUNsQztTQUNKO1FBRUQsT0FBTyxXQUFXLENBQUM7SUFDdkIsQ0FBQztDQUNKO0FBbENELDBDQWtDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNmbl9pbmMgZnJvbSAnYXdzLWNkay1saWIvY2xvdWRmb3JtYXRpb24taW5jbHVkZSc7XG5cbmltcG9ydCAqIGFzIGJhc2UgZnJvbSAnLi4vYmFzZS9iYXNlLXN0YWNrJztcbmltcG9ydCB7IEFwcENvbnRleHQgfSBmcm9tICcuLi8uLi9hcHAtY29udGV4dCc7XG5pbXBvcnQgeyBTdGFja0NvbmZpZyB9IGZyb20gJy4uLy4uL2FwcC1jb25maWcnXG5cblxuZXhwb3J0IGludGVyZmFjZSBDZm5UZW1wbGF0ZVByb3BzIHtcbiAgICB0ZW1wbGF0ZVBhdGg6IHN0cmluZztcbiAgICBwYXJhbWV0ZXJzPzogYW55O1xufVxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQ2ZuSW5jbHVkZVN0YWNrIGV4dGVuZHMgYmFzZS5CYXNlU3RhY2sge1xuICAgIHByaXZhdGUgY2ZuVGVtcGxhdGU/OiBjZm5faW5jLkNmbkluY2x1ZGU7XG5cbiAgICBhYnN0cmFjdCBvbkxvYWRUZW1wbGF0ZVByb3BzKCk6IENmblRlbXBsYXRlUHJvcHMgfCB1bmRlZmluZWQ7XG4gICAgYWJzdHJhY3Qgb25Qb3N0Q29uc3RydWN0b3IoY2ZuVGVtcGxhdGU/OiBjZm5faW5jLkNmbkluY2x1ZGUpOiB2b2lkO1xuXG4gICAgY29uc3RydWN0b3IoYXBwQ29udGV4dDogQXBwQ29udGV4dCwgc3RhY2tDb25maWc6IFN0YWNrQ29uZmlnKSB7XG4gICAgICAgIHN1cGVyKGFwcENvbnRleHQsIHN0YWNrQ29uZmlnKTtcblxuICAgICAgICBjb25zdCBwcm9wcyA9IHRoaXMub25Mb2FkVGVtcGxhdGVQcm9wcygpO1xuXG4gICAgICAgIGlmIChwcm9wcyAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuY2ZuVGVtcGxhdGUgPSB0aGlzLmxvYWRUZW1wbGF0ZShwcm9wcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNmblRlbXBsYXRlID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5vblBvc3RDb25zdHJ1Y3Rvcih0aGlzLmNmblRlbXBsYXRlKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGxvYWRUZW1wbGF0ZShwcm9wczogQ2ZuVGVtcGxhdGVQcm9wcyk6IGNmbl9pbmMuQ2ZuSW5jbHVkZSB7XG4gICAgICAgIGNvbnN0IGNmblRlbXBsYXRlID0gbmV3IGNmbl9pbmMuQ2ZuSW5jbHVkZSh0aGlzLCAnY2ZuLXRlbXBsYXRlJywge1xuICAgICAgICAgICAgdGVtcGxhdGVGaWxlOiBwcm9wcy50ZW1wbGF0ZVBhdGgsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChwcm9wcy5wYXJhbWV0ZXJzICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZm9yKGxldCBwYXJhbSBvZiBwcm9wcy5wYXJhbWV0ZXJzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcGFyYW1FbnYgPSBjZm5UZW1wbGF0ZS5nZXRQYXJhbWV0ZXIocGFyYW0uS2V5KTtcbiAgICAgICAgICAgICAgICBwYXJhbUVudi5kZWZhdWx0ID0gcGFyYW0uVmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY2ZuVGVtcGxhdGU7XG4gICAgfVxufVxuIl19