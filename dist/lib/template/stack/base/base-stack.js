"use strict";
/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
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
exports.BaseStack = exports.Override = void 0;
const cdk = __importStar(require("aws-cdk-lib"));
const common_helper_1 = require("../../common/common-helper");
const common_guardian_1 = require("../../common/common-guardian");
function Override(target, propertyKey, descriptor) { }
exports.Override = Override;
class BaseStack extends cdk.Stack {
    constructor(appContext, stackConfig) {
        let newProps = BaseStack.getStackCommonProps(appContext, stackConfig);
        super(appContext.cdkApp, stackConfig.Name, newProps);
        this.stackConfig = stackConfig;
        this.commonProps = newProps;
        this.projectPrefix = appContext.stackCommonProps.projectPrefix;
        this.commonHelper = new common_helper_1.CommonHelper({
            construct: this,
            env: this.commonProps.env,
            stackName: this.stackName,
            projectPrefix: this.projectPrefix,
            variables: this.commonProps.variables
        });
        this.commonGuardian = new common_guardian_1.CommonGuardian({
            construct: this,
            env: this.commonProps.env,
            stackName: this.stackName,
            projectPrefix: this.projectPrefix,
            variables: this.commonProps.variables
        });
    }
    static getStackCommonProps(appContext, stackConfig) {
        let newProps = appContext.stackCommonProps;
        if (stackConfig.UpdateRegionName) {
            console.log(`[INFO] Region is updated: ${stackConfig.Name} ->> ${stackConfig.UpdateRegionName}`);
            newProps = {
                ...appContext.stackCommonProps,
                env: {
                    region: stackConfig.UpdateRegionName,
                    account: appContext.appConfig.Project.Account
                }
            };
        }
        else {
            // console.log('not update region')
        }
        return newProps;
    }
    findEnumType(enumType, target) {
        return this.commonHelper.findEnumType(enumType, target);
    }
    exportOutput(key, value, prefixEnable = true, prefixCustomName) {
        this.commonHelper.exportOutput(key, value, prefixEnable, prefixCustomName);
    }
    putParameter(paramKey, paramValue, prefixEnable = true, prefixCustomName) {
        return this.commonHelper.putParameter(paramKey, paramValue, prefixEnable, prefixCustomName);
    }
    getParameter(paramKey, prefixEnable = true, prefixCustomName) {
        return this.commonHelper.getParameter(paramKey, prefixEnable, prefixCustomName);
    }
    putVariable(variableKey, variableValue) {
        this.commonHelper.putVariable(variableKey, variableValue);
    }
    getVariable(variableKey) {
        return this.commonHelper.getVariable(variableKey);
    }
    createS3BucketName(baseName, suffix) {
        return this.commonGuardian.createS3BucketName(baseName, suffix);
    }
    createS3Bucket(baseName, suffix, encryption, versioned) {
        return this.commonGuardian.createS3Bucket(baseName, suffix, encryption, versioned);
    }
    withStackName(baseName, delimiter = '-') {
        return `${this.stackName}${delimiter}${baseName}`;
    }
    withProjectPrefix(baseName, delimiter = '-') {
        return `${this.projectPrefix}${delimiter}${baseName}`;
    }
}
exports.BaseStack = BaseStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2xpYi90ZW1wbGF0ZS9zdGFjay9iYXNlL2Jhc2Utc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsaURBQW1DO0FBS25DLDhEQUF3RTtBQUN4RSxrRUFBOEU7QUFHOUUsU0FBZ0IsUUFBUSxDQUFDLE1BQVcsRUFBRSxXQUFtQixFQUFFLFVBQThCLElBQUUsQ0FBQztBQUE1Riw0QkFBNEY7QUFTNUYsTUFBYSxTQUFVLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFRcEMsWUFBWSxVQUFzQixFQUFFLFdBQXdCO1FBQ3hELElBQUksUUFBUSxHQUFHLFNBQVMsQ0FBQyxtQkFBbUIsQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDdEUsS0FBSyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUVyRCxJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztRQUMvQixJQUFJLENBQUMsV0FBVyxHQUFHLFFBQVEsQ0FBQztRQUM1QixJQUFJLENBQUMsYUFBYSxHQUFHLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUM7UUFFL0QsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLDRCQUFZLENBQUM7WUFDakMsU0FBUyxFQUFFLElBQUk7WUFDZixHQUFHLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFJO1lBQzFCLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUztZQUN6QixhQUFhLEVBQUUsSUFBSSxDQUFDLGFBQWE7WUFDakMsU0FBUyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUztTQUN4QyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksZ0NBQWMsQ0FBQztZQUNyQyxTQUFTLEVBQUUsSUFBSTtZQUNmLEdBQUcsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUk7WUFDMUIsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTO1lBQ3pCLGFBQWEsRUFBRSxJQUFJLENBQUMsYUFBYTtZQUNqQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTO1NBQ3hDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTyxNQUFNLENBQUMsbUJBQW1CLENBQUMsVUFBc0IsRUFBRSxXQUF3QjtRQUMvRSxJQUFJLFFBQVEsR0FBRyxVQUFVLENBQUMsZ0JBQWdCLENBQUM7UUFDM0MsSUFBSSxXQUFXLENBQUMsZ0JBQWdCLEVBQUU7WUFDOUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyw2QkFBNkIsV0FBVyxDQUFDLElBQUksUUFBUSxXQUFXLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDO1lBQ2pHLFFBQVEsR0FBRztnQkFDUCxHQUFHLFVBQVUsQ0FBQyxnQkFBZ0I7Z0JBQzlCLEdBQUcsRUFBRTtvQkFDRCxNQUFNLEVBQUUsV0FBVyxDQUFDLGdCQUFnQjtvQkFDcEMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLE9BQU87aUJBQ2hEO2FBQ0osQ0FBQztTQUNMO2FBQU07WUFDSCxtQ0FBbUM7U0FDdEM7UUFFRCxPQUFPLFFBQVEsQ0FBQztJQUNwQixDQUFDO0lBRUQsWUFBWSxDQUFtQixRQUFXLEVBQUUsTUFBYztRQUN0RCxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBRUQsWUFBWSxDQUFDLEdBQVcsRUFBRSxLQUFhLEVBQUUsWUFBWSxHQUFDLElBQUksRUFBRSxnQkFBeUI7UUFDakYsSUFBSSxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxZQUFZLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztJQUMvRSxDQUFDO0lBRUQsWUFBWSxDQUFDLFFBQWdCLEVBQUUsVUFBa0IsRUFBRSxZQUFZLEdBQUMsSUFBSSxFQUFFLGdCQUF5QjtRQUMzRixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLGdCQUFnQixDQUFDLENBQUM7SUFDaEcsQ0FBQztJQUVELFlBQVksQ0FBQyxRQUFnQixFQUFFLFlBQVksR0FBQyxJQUFJLEVBQUUsZ0JBQXlCO1FBQ3ZFLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLFlBQVksRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ3BGLENBQUM7SUFFRCxXQUFXLENBQUMsV0FBbUIsRUFBRSxhQUFxQjtRQUNsRCxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxXQUFXLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDOUQsQ0FBQztJQUVELFdBQVcsQ0FBQyxXQUFtQjtRQUMzQixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFFRCxrQkFBa0IsQ0FBQyxRQUFnQixFQUFFLE1BQWdCO1FBQ2pELE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDcEUsQ0FBQztJQUVELGNBQWMsQ0FBQyxRQUFnQixFQUFFLE1BQWdCLEVBQUUsVUFBZ0MsRUFBRSxTQUFtQjtRQUNwRyxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ3ZGLENBQUM7SUFFRCxhQUFhLENBQUMsUUFBZ0IsRUFBRSxTQUFTLEdBQUMsR0FBRztRQUN6QyxPQUFPLEdBQUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLEdBQUcsUUFBUSxFQUFFLENBQUM7SUFDdEQsQ0FBQztJQUVELGlCQUFpQixDQUFDLFFBQWdCLEVBQUUsU0FBUyxHQUFDLEdBQUc7UUFDN0MsT0FBTyxHQUFHLElBQUksQ0FBQyxhQUFhLEdBQUcsU0FBUyxHQUFHLFFBQVEsRUFBRSxDQUFDO0lBQzFELENBQUM7Q0FDSjtBQTFGRCw4QkEwRkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEFtYXpvbi5jb20sIEluYy4gb3IgaXRzIGFmZmlsaWF0ZXMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogTUlULTBcbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXNcbiAqIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZVxuICogd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LFxuICogbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0b1xuICogcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1IgSU1QTElFRCxcbiAqIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBXG4gKiBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUXG4gKiBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT05cbiAqIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRVxuICogU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4gKi9cblxuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCAqIGFzIHMzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMydcblxuaW1wb3J0IHsgQXBwQ29udGV4dCB9IGZyb20gJy4uLy4uL2FwcC1jb250ZXh0J1xuaW1wb3J0IHsgQXBwQ29uZmlnLCBTdGFja0NvbmZpZyB9IGZyb20gJy4uLy4uL2FwcC1jb25maWcnXG5pbXBvcnQgeyBDb21tb25IZWxwZXIsIElDb21tb25IZWxwZXIgfSBmcm9tICcuLi8uLi9jb21tb24vY29tbW9uLWhlbHBlcidcbmltcG9ydCB7IENvbW1vbkd1YXJkaWFuLCBJQ29tbW9uR3VhcmRpYW4gfSBmcm9tICcuLi8uLi9jb21tb24vY29tbW9uLWd1YXJkaWFuJ1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBPdmVycmlkZSh0YXJnZXQ6IGFueSwgcHJvcGVydHlLZXk6IHN0cmluZywgZGVzY3JpcHRvcjogUHJvcGVydHlEZXNjcmlwdG9yKXt9XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3RhY2tDb21tb25Qcm9wcyBleHRlbmRzIGNkay5TdGFja1Byb3BzIHtcbiAgICBwcm9qZWN0UHJlZml4OiBzdHJpbmc7XG4gICAgYXBwQ29uZmlnOiBBcHBDb25maWc7XG4gICAgYXBwQ29uZmlnUGF0aDogc3RyaW5nO1xuICAgIHZhcmlhYmxlczogYW55O1xufVxuXG5leHBvcnQgY2xhc3MgQmFzZVN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIGltcGxlbWVudHMgSUNvbW1vbkhlbHBlciwgSUNvbW1vbkd1YXJkaWFuIHtcbiAgICBwcm90ZWN0ZWQgc3RhY2tDb25maWc6IFN0YWNrQ29uZmlnO1xuICAgIHByb3RlY3RlZCBwcm9qZWN0UHJlZml4OiBzdHJpbmc7XG4gICAgcHJvdGVjdGVkIGNvbW1vblByb3BzOiBTdGFja0NvbW1vblByb3BzO1xuXG4gICAgcHJpdmF0ZSBjb21tb25IZWxwZXI6IElDb21tb25IZWxwZXI7XG4gICAgcHJpdmF0ZSBjb21tb25HdWFyZGlhbjogSUNvbW1vbkd1YXJkaWFuO1xuXG4gICAgY29uc3RydWN0b3IoYXBwQ29udGV4dDogQXBwQ29udGV4dCwgc3RhY2tDb25maWc6IFN0YWNrQ29uZmlnKSB7XG4gICAgICAgIGxldCBuZXdQcm9wcyA9IEJhc2VTdGFjay5nZXRTdGFja0NvbW1vblByb3BzKGFwcENvbnRleHQsIHN0YWNrQ29uZmlnKTtcbiAgICAgICAgc3VwZXIoYXBwQ29udGV4dC5jZGtBcHAsIHN0YWNrQ29uZmlnLk5hbWUsIG5ld1Byb3BzKTtcblxuICAgICAgICB0aGlzLnN0YWNrQ29uZmlnID0gc3RhY2tDb25maWc7XG4gICAgICAgIHRoaXMuY29tbW9uUHJvcHMgPSBuZXdQcm9wcztcbiAgICAgICAgdGhpcy5wcm9qZWN0UHJlZml4ID0gYXBwQ29udGV4dC5zdGFja0NvbW1vblByb3BzLnByb2plY3RQcmVmaXg7XG5cbiAgICAgICAgdGhpcy5jb21tb25IZWxwZXIgPSBuZXcgQ29tbW9uSGVscGVyKHtcbiAgICAgICAgICAgIGNvbnN0cnVjdDogdGhpcyxcbiAgICAgICAgICAgIGVudjogdGhpcy5jb21tb25Qcm9wcy5lbnYhLFxuICAgICAgICAgICAgc3RhY2tOYW1lOiB0aGlzLnN0YWNrTmFtZSxcbiAgICAgICAgICAgIHByb2plY3RQcmVmaXg6IHRoaXMucHJvamVjdFByZWZpeCxcbiAgICAgICAgICAgIHZhcmlhYmxlczogdGhpcy5jb21tb25Qcm9wcy52YXJpYWJsZXNcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5jb21tb25HdWFyZGlhbiA9IG5ldyBDb21tb25HdWFyZGlhbih7XG4gICAgICAgICAgICBjb25zdHJ1Y3Q6IHRoaXMsXG4gICAgICAgICAgICBlbnY6IHRoaXMuY29tbW9uUHJvcHMuZW52ISxcbiAgICAgICAgICAgIHN0YWNrTmFtZTogdGhpcy5zdGFja05hbWUsXG4gICAgICAgICAgICBwcm9qZWN0UHJlZml4OiB0aGlzLnByb2plY3RQcmVmaXgsXG4gICAgICAgICAgICB2YXJpYWJsZXM6IHRoaXMuY29tbW9uUHJvcHMudmFyaWFibGVzXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgc3RhdGljIGdldFN0YWNrQ29tbW9uUHJvcHMoYXBwQ29udGV4dDogQXBwQ29udGV4dCwgc3RhY2tDb25maWc6IFN0YWNrQ29uZmlnKTogU3RhY2tDb21tb25Qcm9wc3tcbiAgICAgICAgbGV0IG5ld1Byb3BzID0gYXBwQ29udGV4dC5zdGFja0NvbW1vblByb3BzO1xuICAgICAgICBpZiAoc3RhY2tDb25maWcuVXBkYXRlUmVnaW9uTmFtZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYFtJTkZPXSBSZWdpb24gaXMgdXBkYXRlZDogJHtzdGFja0NvbmZpZy5OYW1lfSAtPj4gJHtzdGFja0NvbmZpZy5VcGRhdGVSZWdpb25OYW1lfWApO1xuICAgICAgICAgICAgbmV3UHJvcHMgPSB7XG4gICAgICAgICAgICAgICAgLi4uYXBwQ29udGV4dC5zdGFja0NvbW1vblByb3BzLFxuICAgICAgICAgICAgICAgIGVudjoge1xuICAgICAgICAgICAgICAgICAgICByZWdpb246IHN0YWNrQ29uZmlnLlVwZGF0ZVJlZ2lvbk5hbWUsXG4gICAgICAgICAgICAgICAgICAgIGFjY291bnQ6IGFwcENvbnRleHQuYXBwQ29uZmlnLlByb2plY3QuQWNjb3VudFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnbm90IHVwZGF0ZSByZWdpb24nKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld1Byb3BzO1xuICAgIH1cblxuICAgIGZpbmRFbnVtVHlwZTxUIGV4dGVuZHMgb2JqZWN0PihlbnVtVHlwZTogVCwgdGFyZ2V0OiBzdHJpbmcpOiBUW2tleW9mIFRdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29tbW9uSGVscGVyLmZpbmRFbnVtVHlwZShlbnVtVHlwZSwgdGFyZ2V0KTtcbiAgICB9XG5cbiAgICBleHBvcnRPdXRwdXQoa2V5OiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcsIHByZWZpeEVuYWJsZT10cnVlLCBwcmVmaXhDdXN0b21OYW1lPzogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuY29tbW9uSGVscGVyLmV4cG9ydE91dHB1dChrZXksIHZhbHVlLCBwcmVmaXhFbmFibGUsIHByZWZpeEN1c3RvbU5hbWUpO1xuICAgIH1cblxuICAgIHB1dFBhcmFtZXRlcihwYXJhbUtleTogc3RyaW5nLCBwYXJhbVZhbHVlOiBzdHJpbmcsIHByZWZpeEVuYWJsZT10cnVlLCBwcmVmaXhDdXN0b21OYW1lPzogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29tbW9uSGVscGVyLnB1dFBhcmFtZXRlcihwYXJhbUtleSwgcGFyYW1WYWx1ZSwgcHJlZml4RW5hYmxlLCBwcmVmaXhDdXN0b21OYW1lKTtcbiAgICB9XG5cbiAgICBnZXRQYXJhbWV0ZXIocGFyYW1LZXk6IHN0cmluZywgcHJlZml4RW5hYmxlPXRydWUsIHByZWZpeEN1c3RvbU5hbWU/OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5jb21tb25IZWxwZXIuZ2V0UGFyYW1ldGVyKHBhcmFtS2V5LCBwcmVmaXhFbmFibGUsIHByZWZpeEN1c3RvbU5hbWUpO1xuICAgIH1cblxuICAgIHB1dFZhcmlhYmxlKHZhcmlhYmxlS2V5OiBzdHJpbmcsIHZhcmlhYmxlVmFsdWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLmNvbW1vbkhlbHBlci5wdXRWYXJpYWJsZSh2YXJpYWJsZUtleSwgdmFyaWFibGVWYWx1ZSk7XG4gICAgfVxuXG4gICAgZ2V0VmFyaWFibGUodmFyaWFibGVLZXk6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbW1vbkhlbHBlci5nZXRWYXJpYWJsZSh2YXJpYWJsZUtleSk7XG4gICAgfVxuXG4gICAgY3JlYXRlUzNCdWNrZXROYW1lKGJhc2VOYW1lOiBzdHJpbmcsIHN1ZmZpeD86IGJvb2xlYW4pOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5jb21tb25HdWFyZGlhbi5jcmVhdGVTM0J1Y2tldE5hbWUoYmFzZU5hbWUsIHN1ZmZpeCk7XG4gICAgfVxuXG4gICAgY3JlYXRlUzNCdWNrZXQoYmFzZU5hbWU6IHN0cmluZywgc3VmZml4PzogYm9vbGVhbiwgZW5jcnlwdGlvbj86IHMzLkJ1Y2tldEVuY3J5cHRpb24sIHZlcnNpb25lZD86IGJvb2xlYW4pOiBzMy5CdWNrZXQge1xuICAgICAgICByZXR1cm4gdGhpcy5jb21tb25HdWFyZGlhbi5jcmVhdGVTM0J1Y2tldChiYXNlTmFtZSwgc3VmZml4LCBlbmNyeXB0aW9uLCB2ZXJzaW9uZWQpO1xuICAgIH1cblxuICAgIHdpdGhTdGFja05hbWUoYmFzZU5hbWU6IHN0cmluZywgZGVsaW1pdGVyPSctJyk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBgJHt0aGlzLnN0YWNrTmFtZX0ke2RlbGltaXRlcn0ke2Jhc2VOYW1lfWA7XG4gICAgfVxuXG4gICAgd2l0aFByb2plY3RQcmVmaXgoYmFzZU5hbWU6IHN0cmluZywgZGVsaW1pdGVyPSctJyk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBgJHt0aGlzLnByb2plY3RQcmVmaXh9JHtkZWxpbWl0ZXJ9JHtiYXNlTmFtZX1gO1xuICAgIH1cbn1cbiJdfQ==