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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2xpYi90ZW1wbGF0ZS9zdGFjay9iYXNlL2Jhc2Utc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVILGlEQUFtQztBQUtuQyw4REFBd0U7QUFDeEUsa0VBQThFO0FBRzlFLFNBQWdCLFFBQVEsQ0FBQyxNQUFXLEVBQUUsV0FBbUIsRUFBRSxVQUE4QixJQUFFLENBQUM7QUFBNUYsNEJBQTRGO0FBUzVGLE1BQWEsU0FBVSxTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBUXBDLFlBQVksVUFBc0IsRUFBRSxXQUF3QjtRQUN4RCxJQUFJLFFBQVEsR0FBRyxTQUFTLENBQUMsbUJBQW1CLENBQUMsVUFBVSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ3RFLEtBQUssQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFFckQsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7UUFDL0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUM7UUFDNUIsSUFBSSxDQUFDLGFBQWEsR0FBRyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDO1FBRS9ELElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSw0QkFBWSxDQUFDO1lBQ2pDLFNBQVMsRUFBRSxJQUFJO1lBQ2YsR0FBRyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBSTtZQUMxQixTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVM7WUFDekIsYUFBYSxFQUFFLElBQUksQ0FBQyxhQUFhO1lBQ2pDLFNBQVMsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVM7U0FDeEMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLGdDQUFjLENBQUM7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QzdDLE9BQU8sR0FBRyxJQUFJLENBQUMsYUFBYSxHQUFHLFNBQVMsR0FBRyxRQUFRLEVBQUUsQ0FBQztJQUMxRCxDQUFDO0NBQ0o7QUExRkQsOEJBMEZDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCBBbWF6b24uY29tLCBJbmMuIG9yIGl0cyBhZmZpbGlhdGVzLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVC0wXG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weSBvZiB0aGlzXG4gKiBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmVcbiAqIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSxcbiAqIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG9cbiAqIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzby5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SIElNUExJRUQsXG4gKiBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQVxuICogUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVFxuICogSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OXG4gKiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEVcbiAqIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICovXG5cbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyBzMyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtczMnXG5cbmltcG9ydCB7IEFwcENvbnRleHQgfSBmcm9tICcuLi8uLi9hcHAtY29udGV4dCdcbmltcG9ydCB7IEFwcENvbmZpZywgU3RhY2tDb25maWcgfSBmcm9tICcuLi8uLi9hcHAtY29uZmlnJ1xuaW1wb3J0IHsgQ29tbW9uSGVscGVyLCBJQ29tbW9uSGVscGVyIH0gZnJvbSAnLi4vLi4vY29tbW9uL2NvbW1vbi1oZWxwZXInXG5pbXBvcnQgeyBDb21tb25HdWFyZGlhbiwgSUNvbW1vbkd1YXJkaWFuIH0gZnJvbSAnLi4vLi4vY29tbW9uL2NvbW1vbi1ndWFyZGlhbidcblxuXG5leHBvcnQgZnVuY3Rpb24gT3ZlcnJpZGUodGFyZ2V0OiBhbnksIHByb3BlcnR5S2V5OiBzdHJpbmcsIGRlc2NyaXB0b3I6IFByb3BlcnR5RGVzY3JpcHRvcil7fVxuXG5leHBvcnQgaW50ZXJmYWNlIFN0YWNrQ29tbW9uUHJvcHMgZXh0ZW5kcyBjZGsuU3RhY2tQcm9wcyB7XG4gICAgcHJvamVjdFByZWZpeDogc3RyaW5nO1xuICAgIGFwcENvbmZpZzogQXBwQ29uZmlnO1xuICAgIGFwcENvbmZpZ1BhdGg6IHN0cmluZztcbiAgICB2YXJpYWJsZXM6IGFueTtcbn1cblxuZXhwb3J0IGNsYXNzIEJhc2VTdGFjayBleHRlbmRzIGNkay5TdGFjayBpbXBsZW1lbnRzIElDb21tb25IZWxwZXIsIElDb21tb25HdWFyZGlhbiB7XG4gICAgcHJvdGVjdGVkIHN0YWNrQ29uZmlnOiBTdGFja0NvbmZpZztcbiAgICBwcm90ZWN0ZWQgcHJvamVjdFByZWZpeDogc3RyaW5nO1xuICAgIHByb3RlY3RlZCBjb21tb25Qcm9wczogU3RhY2tDb21tb25Qcm9wcztcblxuICAgIHByaXZhdGUgY29tbW9uSGVscGVyOiBJQ29tbW9uSGVscGVyO1xuICAgIHByaXZhdGUgY29tbW9uR3VhcmRpYW46IElDb21tb25HdWFyZGlhbjtcblxuICAgIGNvbnN0cnVjdG9yKGFwcENvbnRleHQ6IEFwcENvbnRleHQsIHN0YWNrQ29uZmlnOiBTdGFja0NvbmZpZykge1xuICAgICAgICBsZXQgbmV3UHJvcHMgPSBCYXNlU3RhY2suZ2V0U3RhY2tDb21tb25Qcm9wcyhhcHBDb250ZXh0LCBzdGFja0NvbmZpZyk7XG4gICAgICAgIHN1cGVyKGFwcENvbnRleHQuY2RrQXBwLCBzdGFja0NvbmZpZy5OYW1lLCBuZXdQcm9wcyk7XG5cbiAgICAgICAgdGhpcy5zdGFja0NvbmZpZyA9IHN0YWNrQ29uZmlnO1xuICAgICAgICB0aGlzLmNvbW1vblByb3BzID0gbmV3UHJvcHM7XG4gICAgICAgIHRoaXMucHJvamVjdFByZWZpeCA9IGFwcENvbnRleHQuc3RhY2tDb21tb25Qcm9wcy5wcm9qZWN0UHJlZml4O1xuXG4gICAgICAgIHRoaXMuY29tbW9uSGVscGVyID0gbmV3IENvbW1vbkhlbHBlcih7XG4gICAgICAgICAgICBjb25zdHJ1Y3Q6IHRoaXMsXG4gICAgICAgICAgICBlbnY6IHRoaXMuY29tbW9uUHJvcHMuZW52ISxcbiAgICAgICAgICAgIHN0YWNrTmFtZTogdGhpcy5zdGFja05hbWUsXG4gICAgICAgICAgICBwcm9qZWN0UHJlZml4OiB0aGlzLnByb2plY3RQcmVmaXgsXG4gICAgICAgICAgICB2YXJpYWJsZXM6IHRoaXMuY29tbW9uUHJvcHMudmFyaWFibGVzXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuY29tbW9uR3VhcmRpYW4gPSBuZXcgQ29tbW9uR3VhcmRpYW4oe1xuICAgICAgICAgICAgY29uc3RydWN0OiB0aGlzLFxuICAgICAgICAgICAgZW52OiB0aGlzLmNvbW1vblByb3BzLmVudiEsXG4gICAgICAgICAgICBzdGFja05hbWU6IHRoaXMuc3RhY2tOYW1lLFxuICAgICAgICAgICAgcHJvamVjdFByZWZpeDogdGhpcy5wcm9qZWN0UHJlZml4LFxuICAgICAgICAgICAgdmFyaWFibGVzOiB0aGlzLmNvbW1vblByb3BzLnZhcmlhYmxlc1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyBnZXRTdGFja0NvbW1vblByb3BzKGFwcENvbnRleHQ6IEFwcENvbnRleHQsIHN0YWNrQ29uZmlnOiBTdGFja0NvbmZpZyk6IFN0YWNrQ29tbW9uUHJvcHN7XG4gICAgICAgIGxldCBuZXdQcm9wcyA9IGFwcENvbnRleHQuc3RhY2tDb21tb25Qcm9wcztcbiAgICAgICAgaWYgKHN0YWNrQ29uZmlnLlVwZGF0ZVJlZ2lvbk5hbWUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBbSU5GT10gUmVnaW9uIGlzIHVwZGF0ZWQ6ICR7c3RhY2tDb25maWcuTmFtZX0gLT4+ICR7c3RhY2tDb25maWcuVXBkYXRlUmVnaW9uTmFtZX1gKTtcbiAgICAgICAgICAgIG5ld1Byb3BzID0ge1xuICAgICAgICAgICAgICAgIC4uLmFwcENvbnRleHQuc3RhY2tDb21tb25Qcm9wcyxcbiAgICAgICAgICAgICAgICBlbnY6IHtcbiAgICAgICAgICAgICAgICAgICAgcmVnaW9uOiBzdGFja0NvbmZpZy5VcGRhdGVSZWdpb25OYW1lLFxuICAgICAgICAgICAgICAgICAgICBhY2NvdW50OiBhcHBDb250ZXh0LmFwcENvbmZpZy5Qcm9qZWN0LkFjY291bnRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ25vdCB1cGRhdGUgcmVnaW9uJylcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXdQcm9wcztcbiAgICB9XG5cbiAgICBmaW5kRW51bVR5cGU8VCBleHRlbmRzIG9iamVjdD4oZW51bVR5cGU6IFQsIHRhcmdldDogc3RyaW5nKTogVFtrZXlvZiBUXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbW1vbkhlbHBlci5maW5kRW51bVR5cGUoZW51bVR5cGUsIHRhcmdldCk7XG4gICAgfVxuXG4gICAgZXhwb3J0T3V0cHV0KGtleTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nLCBwcmVmaXhFbmFibGU9dHJ1ZSwgcHJlZml4Q3VzdG9tTmFtZT86IHN0cmluZykge1xuICAgICAgICB0aGlzLmNvbW1vbkhlbHBlci5leHBvcnRPdXRwdXQoa2V5LCB2YWx1ZSwgcHJlZml4RW5hYmxlLCBwcmVmaXhDdXN0b21OYW1lKTtcbiAgICB9XG5cbiAgICBwdXRQYXJhbWV0ZXIocGFyYW1LZXk6IHN0cmluZywgcGFyYW1WYWx1ZTogc3RyaW5nLCBwcmVmaXhFbmFibGU9dHJ1ZSwgcHJlZml4Q3VzdG9tTmFtZT86IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbW1vbkhlbHBlci5wdXRQYXJhbWV0ZXIocGFyYW1LZXksIHBhcmFtVmFsdWUsIHByZWZpeEVuYWJsZSwgcHJlZml4Q3VzdG9tTmFtZSk7XG4gICAgfVxuXG4gICAgZ2V0UGFyYW1ldGVyKHBhcmFtS2V5OiBzdHJpbmcsIHByZWZpeEVuYWJsZT10cnVlLCBwcmVmaXhDdXN0b21OYW1lPzogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29tbW9uSGVscGVyLmdldFBhcmFtZXRlcihwYXJhbUtleSwgcHJlZml4RW5hYmxlLCBwcmVmaXhDdXN0b21OYW1lKTtcbiAgICB9XG5cbiAgICBwdXRWYXJpYWJsZSh2YXJpYWJsZUtleTogc3RyaW5nLCB2YXJpYWJsZVZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5jb21tb25IZWxwZXIucHV0VmFyaWFibGUodmFyaWFibGVLZXksIHZhcmlhYmxlVmFsdWUpO1xuICAgIH1cblxuICAgIGdldFZhcmlhYmxlKHZhcmlhYmxlS2V5OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5jb21tb25IZWxwZXIuZ2V0VmFyaWFibGUodmFyaWFibGVLZXkpO1xuICAgIH1cblxuICAgIGNyZWF0ZVMzQnVja2V0TmFtZShiYXNlTmFtZTogc3RyaW5nLCBzdWZmaXg/OiBib29sZWFuKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29tbW9uR3VhcmRpYW4uY3JlYXRlUzNCdWNrZXROYW1lKGJhc2VOYW1lLCBzdWZmaXgpO1xuICAgIH1cblxuICAgIGNyZWF0ZVMzQnVja2V0KGJhc2VOYW1lOiBzdHJpbmcsIHN1ZmZpeD86IGJvb2xlYW4sIGVuY3J5cHRpb24/OiBzMy5CdWNrZXRFbmNyeXB0aW9uLCB2ZXJzaW9uZWQ/OiBib29sZWFuKTogczMuQnVja2V0IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29tbW9uR3VhcmRpYW4uY3JlYXRlUzNCdWNrZXQoYmFzZU5hbWUsIHN1ZmZpeCwgZW5jcnlwdGlvbiwgdmVyc2lvbmVkKTtcbiAgICB9XG5cbiAgICB3aXRoU3RhY2tOYW1lKGJhc2VOYW1lOiBzdHJpbmcsIGRlbGltaXRlcj0nLScpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gYCR7dGhpcy5zdGFja05hbWV9JHtkZWxpbWl0ZXJ9JHtiYXNlTmFtZX1gO1xuICAgIH1cblxuICAgIHdpdGhQcm9qZWN0UHJlZml4KGJhc2VOYW1lOiBzdHJpbmcsIGRlbGltaXRlcj0nLScpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gYCR7dGhpcy5wcm9qZWN0UHJlZml4fSR7ZGVsaW1pdGVyfSR7YmFzZU5hbWV9YDtcbiAgICB9XG59XG4iXX0=