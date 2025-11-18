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
exports.CommonHelper = void 0;
const cdk = __importStar(require("aws-cdk-lib"));
const ssm = __importStar(require("aws-cdk-lib/aws-ssm"));
class CommonHelper {
    constructor(props) {
        this.stackName = props.stackName;
        this.props = props;
        this.projectPrefix = props.projectPrefix;
    }
    findEnumType(enumType, target) {
        const keyInString = Object.keys(enumType).find(key => 
        // console.log(`${key} = ${enumType[key as keyof typeof enumType]}`);
        // (<any>EnumType)['StringKeyofEnumType']
        target == `${enumType[key]}`);
        const key = keyInString;
        return enumType[key];
    }
    exportOutput(key, value, prefixEnable = true, prefixCustomName) {
        if (prefixEnable) {
            const prefix = prefixCustomName ? prefixCustomName : this.projectPrefix;
            new cdk.CfnOutput(this.props.construct, `Output-${key}`, {
                exportName: `${prefix}-${key}`,
                value: value
            });
        }
        else {
            new cdk.CfnOutput(this.props.construct, `Output-${key}`, {
                exportName: key,
                value: value
            });
        }
    }
    putParameter(paramKey, paramValue, prefixEnable = true, prefixCustomName) {
        if (prefixEnable) {
            const paramKeyWithPrefix = prefixCustomName ? `${prefixCustomName}-${paramKey}` : `${this.projectPrefix}-${paramKey}`;
            new ssm.StringParameter(this.props.construct, paramKey, {
                parameterName: paramKeyWithPrefix,
                stringValue: paramValue,
            });
        }
        else {
            new ssm.StringParameter(this.props.construct, paramKey, {
                parameterName: paramKey,
                stringValue: paramValue,
            });
        }
        return paramKey;
    }
    getParameter(paramKey, prefixEnable = true, prefixCustomName) {
        if (prefixEnable) {
            const paramKeyWithPrefix = prefixCustomName ? `${prefixCustomName}-${paramKey}` : `${this.projectPrefix}-${paramKey}`;
            return ssm.StringParameter.valueForStringParameter(this.props.construct, paramKeyWithPrefix);
        }
        else {
            return ssm.StringParameter.valueForStringParameter(this.props.construct, paramKey);
        }
    }
    putVariable(variableKey, variableValue) {
        this.props.variables[variableKey] = variableValue;
    }
    getVariable(variableKey) {
        return this.props.variables[variableKey];
    }
    withStackName(baseName, delimiter = '-') {
        return `${this.stackName}${delimiter}${baseName}`;
    }
    withProjectPrefix(baseName, delimiter = '-') {
        return `${this.projectPrefix}${delimiter}${baseName}`;
    }
}
exports.CommonHelper = CommonHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLWhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi90ZW1wbGF0ZS9jb21tb24vY29tbW9uLWhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBR0gsaURBQW1DO0FBQ25DLHlEQUEwQztBQXNCMUMsTUFBYSxZQUFZO0lBS3JCLFlBQVksS0FBd0I7UUFDaEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQztJQUM3QyxDQUFDO0lBRU0sWUFBWSxDQUFtQixRQUFXLEVBQUUsTUFBYztRQUc3RCxNQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUNqRCxxRUFBcUU7UUFDckUseUNBQXlDO1FBQ3pDLE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxHQUE0QixDQUFDLEVBQVksQ0FDbEUsQ0FBQztRQUVGLE1BQU0sR0FBRyxHQUFHLFdBQXNCLENBQUM7UUFDbkMsT0FBTyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDekIsQ0FBQztJQUVNLFlBQVksQ0FBQyxHQUFXLEVBQUUsS0FBYSxFQUFFLFlBQVksR0FBQyxJQUFJLEVBQUUsZ0JBQXlCO1FBQ3hGLElBQUksWUFBWSxFQUFFO1lBQ2QsTUFBTSxNQUFNLEdBQUcsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDO1lBQ3hFLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxVQUFVLEdBQUcsRUFBRSxFQUFFO2dCQUNyRCxVQUFVLEVBQUUsR0FBRyxNQUFNLElBQUksR0FBRyxFQUFFO2dCQUM5QixLQUFLLEVBQUUsS0FBSzthQUNmLENBQUMsQ0FBQztTQUNOO2FBQU07WUFDSCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsVUFBVSxHQUFHLEVBQUUsRUFBRTtnQkFDckQsVUFBVSxFQUFFLEdBQUc7Z0JBQ2YsS0FBSyxFQUFFLEtBQUs7YUFDZixDQUFDLENBQUM7U0FDTjtJQUNMLENBQUM7SUFFTSxZQUFZLENBQUMsUUFBZ0IsRUFBRSxVQUFrQixFQUFFLFlBQVksR0FBQyxJQUFJLEVBQUUsZ0JBQXlCO1FBQ2xHLElBQUksWUFBWSxFQUFFO1lBQ2QsTUFBTSxrQkFBa0IsR0FBRyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsR0FBRyxnQkFBZ0IsSUFBSSxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsYUFBYSxJQUFJLFFBQVEsRUFBRSxDQUFDO1lBRXRILElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUU7Z0JBQ3BELGFBQWEsRUFBRSxrQkFBa0I7Z0JBQ2pDLFdBQVcsRUFBRSxVQUFVO2FBQzFCLENBQUMsQ0FBQztTQUNOO2FBQU07WUFDSCxJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFO2dCQUNwRCxhQUFhLEVBQUUsUUFBUTtnQkFDdkIsV0FBVyxFQUFFLFVBQVU7YUFDMUIsQ0FBQyxDQUFDO1NBQ047UUFFRCxPQUFPLFFBQVEsQ0FBQztJQUNwQixDQUFDO0lBRU0sWUFBWSxDQUFDLFFBQWdCLEVBQUUsWUFBWSxHQUFDLElBQUksRUFBRSxnQkFBeUI7UUFDOUUsSUFBSSxZQUFZLEVBQUU7WUFDZCxNQUFNLGtCQUFrQixHQUFHLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxHQUFHLGdCQUFnQixJQUFJLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxhQUFhLElBQUksUUFBUSxFQUFFLENBQUM7WUFFdEgsT0FBTyxHQUFHLENBQUMsZUFBZSxDQUFDLHVCQUF1QixDQUM5QyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFDcEIsa0JBQWtCLENBQ3JCLENBQUM7U0FDTDthQUFNO1lBQ0gsT0FBTyxHQUFHLENBQUMsZUFBZSxDQUFDLHVCQUF1QixDQUM5QyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFDcEIsUUFBUSxDQUNYLENBQUM7U0FDTDtJQUNMLENBQUM7SUFFTSxXQUFXLENBQUMsV0FBbUIsRUFBRSxhQUFxQjtRQUN6RCxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsR0FBRyxhQUFhLENBQUM7SUFDdEQsQ0FBQztJQUVNLFdBQVcsQ0FBQyxXQUFtQjtRQUNsQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFTSxhQUFhLENBQUMsUUFBZ0IsRUFBRSxTQUFTLEdBQUMsR0FBRztRQUNoRCxPQUFPLEdBQUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLEdBQUcsUUFBUSxFQUFFLENBQUM7SUFDdEQsQ0FBQztJQUVNLGlCQUFpQixDQUFDLFFBQWdCLEVBQUUsU0FBUyxHQUFDLEdBQUc7UUFDcEQsT0FBTyxHQUFHLElBQUksQ0FBQyxhQUFhLEdBQUcsU0FBUyxHQUFHLFFBQVEsRUFBRSxDQUFDO0lBQzFELENBQUM7Q0FDSjtBQXhGRCxvQ0F3RkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEFtYXpvbi5jb20sIEluYy4gb3IgaXRzIGFmZmlsaWF0ZXMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogTUlULTBcbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXNcbiAqIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZVxuICogd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LFxuICogbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0b1xuICogcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1IgSU1QTElFRCxcbiAqIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBXG4gKiBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUXG4gKiBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT05cbiAqIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRVxuICogU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4gKi9cblxuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgc3NtIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zc20nXG5cblxuZXhwb3J0IGludGVyZmFjZSBJQ29tbW9uSGVscGVyIHtcbiAgICBmaW5kRW51bVR5cGU8VCBleHRlbmRzIG9iamVjdD4oZW51bVR5cGU6IFQsIHRhcmdldDogc3RyaW5nKTogVFtrZXlvZiBUXTtcbiAgICBleHBvcnRPdXRwdXQoa2V5OiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcsIHByZWZpeEVuYWJsZT86IGJvb2xlYW4sIHByZWZpeEN1c3RvbU5hbWU/OiBzdHJpbmcpOiB2b2lkO1xuICAgIHB1dFBhcmFtZXRlcihwYXJhbUtleTogc3RyaW5nLCBwYXJhbVZhbHVlOiBzdHJpbmcsIHByZWZpeEVuYWJsZT86IGJvb2xlYW4sIHByZWZpeEN1c3RvbU5hbWU/OiBzdHJpbmcpOiBzdHJpbmc7XG4gICAgZ2V0UGFyYW1ldGVyKHBhcmFtS2V5OiBzdHJpbmcsIHByZWZpeEVuYWJsZT86IGJvb2xlYW4sIHByZWZpeEN1c3RvbU5hbWU/OiBzdHJpbmcpOiBzdHJpbmc7XG4gICAgcHV0VmFyaWFibGUodmFyaWFibGVLZXk6IHN0cmluZywgdmFyaWFibGVWYWx1ZTogc3RyaW5nKTogdm9pZDtcbiAgICBnZXRWYXJpYWJsZSh2YXJpYWJsZUtleTogc3RyaW5nKTogc3RyaW5nO1xuICAgIHdpdGhTdGFja05hbWUoYmFzZU5hbWU6IHN0cmluZywgZGVsaW1pdGVyPzogc3RyaW5nKTogc3RyaW5nO1xuICAgIHdpdGhQcm9qZWN0UHJlZml4KGJhc2VOYW1lOiBzdHJpbmcsIGRlbGltaXRlcj86IHN0cmluZyk6IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDb21tb25IZWxwZXJQcm9wcyB7XG4gICAgc3RhY2tOYW1lOiBzdHJpbmc7XG4gICAgcHJvamVjdFByZWZpeDogc3RyaW5nO1xuICAgIGNvbnN0cnVjdDogQ29uc3RydWN0O1xuICAgIGVudjogY2RrLkVudmlyb25tZW50O1xuICAgIHZhcmlhYmxlczogYW55O1xufVxuXG5leHBvcnQgY2xhc3MgQ29tbW9uSGVscGVyIGltcGxlbWVudHMgSUNvbW1vbkhlbHBlciB7XG4gICAgcHJvdGVjdGVkIHN0YWNrTmFtZTogc3RyaW5nO1xuICAgIHByb3RlY3RlZCBwcm9qZWN0UHJlZml4OiBzdHJpbmc7XG4gICAgcHJvdGVjdGVkIHByb3BzOiBDb21tb25IZWxwZXJQcm9wcztcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzOiBDb21tb25IZWxwZXJQcm9wcykge1xuICAgICAgICB0aGlzLnN0YWNrTmFtZSA9IHByb3BzLnN0YWNrTmFtZTtcbiAgICAgICAgdGhpcy5wcm9wcyA9IHByb3BzO1xuICAgICAgICB0aGlzLnByb2plY3RQcmVmaXggPSBwcm9wcy5wcm9qZWN0UHJlZml4O1xuICAgIH1cblxuICAgIHB1YmxpYyBmaW5kRW51bVR5cGU8VCBleHRlbmRzIG9iamVjdD4oZW51bVR5cGU6IFQsIHRhcmdldDogc3RyaW5nKTogVFtrZXlvZiBUXSB7XG4gICAgICAgIHR5cGUga2V5VHlwZSA9IGtleW9mIHR5cGVvZiBlbnVtVHlwZTtcblxuICAgICAgICBjb25zdCBrZXlJblN0cmluZyA9IE9iamVjdC5rZXlzKGVudW1UeXBlKS5maW5kKGtleSA9PlxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYCR7a2V5fSA9ICR7ZW51bVR5cGVba2V5IGFzIGtleW9mIHR5cGVvZiBlbnVtVHlwZV19YCk7XG4gICAgICAgICAgICAvLyAoPGFueT5FbnVtVHlwZSlbJ1N0cmluZ0tleW9mRW51bVR5cGUnXVxuICAgICAgICAgICAgdGFyZ2V0ID09IGAke2VudW1UeXBlW2tleSBhcyBrZXlvZiB0eXBlb2YgZW51bVR5cGVdfWAgYXMgc3RyaW5nXG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3Qga2V5ID0ga2V5SW5TdHJpbmcgYXMga2V5VHlwZTtcbiAgICAgICAgcmV0dXJuIGVudW1UeXBlW2tleV07XG4gICAgfVxuXG4gICAgcHVibGljIGV4cG9ydE91dHB1dChrZXk6IHN0cmluZywgdmFsdWU6IHN0cmluZywgcHJlZml4RW5hYmxlPXRydWUsIHByZWZpeEN1c3RvbU5hbWU/OiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKHByZWZpeEVuYWJsZSkge1xuICAgICAgICAgICAgY29uc3QgcHJlZml4ID0gcHJlZml4Q3VzdG9tTmFtZSA/IHByZWZpeEN1c3RvbU5hbWUgOiB0aGlzLnByb2plY3RQcmVmaXg7XG4gICAgICAgICAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLnByb3BzLmNvbnN0cnVjdCwgYE91dHB1dC0ke2tleX1gLCB7XG4gICAgICAgICAgICAgICAgZXhwb3J0TmFtZTogYCR7cHJlZml4fS0ke2tleX1gLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLnByb3BzLmNvbnN0cnVjdCwgYE91dHB1dC0ke2tleX1gLCB7XG4gICAgICAgICAgICAgICAgZXhwb3J0TmFtZToga2V5LFxuICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgcHV0UGFyYW1ldGVyKHBhcmFtS2V5OiBzdHJpbmcsIHBhcmFtVmFsdWU6IHN0cmluZywgcHJlZml4RW5hYmxlPXRydWUsIHByZWZpeEN1c3RvbU5hbWU/OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICBpZiAocHJlZml4RW5hYmxlKSB7XG4gICAgICAgICAgICBjb25zdCBwYXJhbUtleVdpdGhQcmVmaXggPSBwcmVmaXhDdXN0b21OYW1lID8gYCR7cHJlZml4Q3VzdG9tTmFtZX0tJHtwYXJhbUtleX1gIDogYCR7dGhpcy5wcm9qZWN0UHJlZml4fS0ke3BhcmFtS2V5fWA7XG5cbiAgICAgICAgICAgIG5ldyBzc20uU3RyaW5nUGFyYW1ldGVyKHRoaXMucHJvcHMuY29uc3RydWN0LCBwYXJhbUtleSwge1xuICAgICAgICAgICAgICAgIHBhcmFtZXRlck5hbWU6IHBhcmFtS2V5V2l0aFByZWZpeCxcbiAgICAgICAgICAgICAgICBzdHJpbmdWYWx1ZTogcGFyYW1WYWx1ZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3IHNzbS5TdHJpbmdQYXJhbWV0ZXIodGhpcy5wcm9wcy5jb25zdHJ1Y3QsIHBhcmFtS2V5LCB7XG4gICAgICAgICAgICAgICAgcGFyYW1ldGVyTmFtZTogcGFyYW1LZXksXG4gICAgICAgICAgICAgICAgc3RyaW5nVmFsdWU6IHBhcmFtVmFsdWUsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwYXJhbUtleTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0UGFyYW1ldGVyKHBhcmFtS2V5OiBzdHJpbmcsIHByZWZpeEVuYWJsZT10cnVlLCBwcmVmaXhDdXN0b21OYW1lPzogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKHByZWZpeEVuYWJsZSkge1xuICAgICAgICAgICAgY29uc3QgcGFyYW1LZXlXaXRoUHJlZml4ID0gcHJlZml4Q3VzdG9tTmFtZSA/IGAke3ByZWZpeEN1c3RvbU5hbWV9LSR7cGFyYW1LZXl9YCA6IGAke3RoaXMucHJvamVjdFByZWZpeH0tJHtwYXJhbUtleX1gO1xuXG4gICAgICAgICAgICByZXR1cm4gc3NtLlN0cmluZ1BhcmFtZXRlci52YWx1ZUZvclN0cmluZ1BhcmFtZXRlcihcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmNvbnN0cnVjdCxcbiAgICAgICAgICAgICAgICBwYXJhbUtleVdpdGhQcmVmaXhcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gc3NtLlN0cmluZ1BhcmFtZXRlci52YWx1ZUZvclN0cmluZ1BhcmFtZXRlcihcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmNvbnN0cnVjdCxcbiAgICAgICAgICAgICAgICBwYXJhbUtleVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBwdXRWYXJpYWJsZSh2YXJpYWJsZUtleTogc3RyaW5nLCB2YXJpYWJsZVZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5wcm9wcy52YXJpYWJsZXNbdmFyaWFibGVLZXldID0gdmFyaWFibGVWYWx1ZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0VmFyaWFibGUodmFyaWFibGVLZXk6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLnByb3BzLnZhcmlhYmxlc1t2YXJpYWJsZUtleV07XG4gICAgfVxuXG4gICAgcHVibGljIHdpdGhTdGFja05hbWUoYmFzZU5hbWU6IHN0cmluZywgZGVsaW1pdGVyPSctJyk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBgJHt0aGlzLnN0YWNrTmFtZX0ke2RlbGltaXRlcn0ke2Jhc2VOYW1lfWA7XG4gICAgfVxuXG4gICAgcHVibGljIHdpdGhQcm9qZWN0UHJlZml4KGJhc2VOYW1lOiBzdHJpbmcsIGRlbGltaXRlcj0nLScpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gYCR7dGhpcy5wcm9qZWN0UHJlZml4fSR7ZGVsaW1pdGVyfSR7YmFzZU5hbWV9YDtcbiAgICB9XG59XG4iXX0=