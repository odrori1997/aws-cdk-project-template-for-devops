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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLWhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi90ZW1wbGF0ZS9jb21tb24vY29tbW9uLWhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFHSCxpREFBbUM7QUFDbkMseURBQTBDO0FBc0IxQyxNQUFhLFlBQVk7SUFLckIsWUFBWSxLQUF3QjtRQUNoQyxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUM7UUFDakMsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDO0lBQzdDLENBQUM7SUFFTSxZQUFZLENBQW1CLFFBQVcsRUFBRSxNQUFjO1FBRzdELE1BQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQ2pELHFFQUFxRTtRQUNyRSx5Q0FBeUM7UUFDekMsTUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLEdBQTRCLENBQUMsRUFBWSxDQUNsRSxDQUFDO1FBRUYsTUFBTSxHQUFHLEdBQUcsV0FBc0IsQ0FBQztRQUNuQyxPQUFPLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN6QixDQUFDO0lBRU0sWUFBWSxDQUFDLEdBQVcsRUFBRSxLQUFhLEVBQUUsWUFBWSxHQUFDLElBQUksRUFBRSxnQkFBeUI7UUFDeEYsSUFBSSxZQUFZLEVBQUU7WUFDZCxNQUFNLE1BQU0sR0FBRyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUM7WUFDeEUsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLFVBQVUsR0FBRyxFQUFFLEVBQUU7Z0JBQ3JELFVBQVUsRUFBRSxHQUFHLE1BQU0sSUFBSSxHQUFHLEVBQUU7Z0JBQzlCLEtBQUssRUFBRSxLQUFLO2FBQ2YsQ0FBQyxDQUFDO1NBQ047YUFBTTtZQUNILElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxVQUFVLEdBQUcsRUFBRSxFQUFFO2dCQUNyRCxVQUFVLEVBQUUsR0FBRztnQkFDZixLQUFLLEVBQUUsS0FBSzthQUNmLENBQUMsQ0FBQztTQUNOO0lBQ0wsQ0FBQztJQUVNLFlBQVksQ0FBQyxRQUFnQixFQUFFLFVBQWtCLEVBQUUsWUFBWSxHQUFDLElBQUksRUFBRSxnQkFBeUI7UUFDbEcsSUFBSSxZQUFZLEVBQUU7WUFDZCxNQUFNLGtCQUFrQixHQUFHLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxHQUFHLGdCQUFnQixJQUFJLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxhQUFhLElBQUksUUFBUSxFQUFFLENBQUM7WUFFdEgsSUFBSSxHQUFHLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRTtnQkFDcEQsYUFBYSxFQUFFLGtCQUFrQjtnQkFDakMsV0FBVyxFQUFFLFVBQVU7YUFDMUIsQ0FBQyxDQUFDO1NBQ047YUFBTTtZQUNILElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUU7Z0JBQ3BELGFBQWEsRUFBRSxRQUFRO2dCQUN2QixXQUFXLEVBQUUsVUFBVTthQUMxQixDQUFDLENBQUM7U0FDTjtRQUVELE9BQU8sUUFBUSxDQUFDO0lBQ3BCLENBQUM7SUFFTSxZQUFZLENBQUMsUUFBZ0IsRUFBRSxZQUFZLEdBQUMsSUFBSSxFQUFFLGdCQUF5QjtRQUM5RSxJQUFJLFlBQVksRUFBRTtZQUNkLE1BQU0sa0JBQWtCLEdBQUcsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLEdBQUcsZ0JBQWdCLElBQUksUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLGFBQWEsSUFBSSxRQUFRLEVBQUUsQ0FBQztZQUV0SCxPQUFPLEdBQUcsQ0FBQyxlQUFlLENBQUMsdUJBQXVCLENBQzlDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUNwQixrQkFBa0IsQ0FDckIsQ0FBQztTQUNMO2FBQU07WUFDSCxPQUFPLEdBQUcsQ0FBQyxlQUFlLENBQUMsdUJBQXVCLENBQzlDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUNwQixRQUFRLENBQ1gsQ0FBQztTQUNMO0lBQ0wsQ0FBQztJQUVNLFdBQVcsQ0FBQyxXQUFtQixFQUFFLGFBQXFCO1FBQ3pELElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxHQUFHLGFBQWEsQ0FBQztJQUN0RCxDQUFDO0lBRU0sV0FBVyxDQUFDLFdBQW1CO1FBQ2xDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUVNLGFBQWEsQ0FBQyxRQUFnQixFQUFFLFNBQVMsR0FBQyxHQUFHO1FBQ2hELE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsR0FBRyxRQUFRLEVBQUUsQ0FBQztJQUN0RCxDQUFDO0lBRU0saUJBQWlCLENBQUMsUUFBZ0IsRUFBRSxTQUFTLEdBQUMsR0FBRztRQUNwRCxPQUFPLEdBQUcsSUFBSSxDQUFDLGFBQWEsR0FBRyxTQUFTLEdBQUcsUUFBUSxFQUFFLENBQUM7SUFDMUQsQ0FBQztDQUNKO0FBeEZELG9DQXdGQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgQW1hem9uLmNvbSwgSW5jLiBvciBpdHMgYWZmaWxpYXRlcy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBNSVQtMFxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpc1xuICogc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlXG4gKiB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksXG4gKiBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvXG4gKiBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28uXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUiBJTVBMSUVELFxuICogSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEFcbiAqIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFRcbiAqIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTlxuICogT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFXG4gKiBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAqL1xuXG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyBzc20gZnJvbSAnYXdzLWNkay1saWIvYXdzLXNzbSdcblxuXG5leHBvcnQgaW50ZXJmYWNlIElDb21tb25IZWxwZXIge1xuICAgIGZpbmRFbnVtVHlwZTxUIGV4dGVuZHMgb2JqZWN0PihlbnVtVHlwZTogVCwgdGFyZ2V0OiBzdHJpbmcpOiBUW2tleW9mIFRdO1xuICAgIGV4cG9ydE91dHB1dChrZXk6IHN0cmluZywgdmFsdWU6IHN0cmluZywgcHJlZml4RW5hYmxlPzogYm9vbGVhbiwgcHJlZml4Q3VzdG9tTmFtZT86IHN0cmluZyk6IHZvaWQ7XG4gICAgcHV0UGFyYW1ldGVyKHBhcmFtS2V5OiBzdHJpbmcsIHBhcmFtVmFsdWU6IHN0cmluZywgcHJlZml4RW5hYmxlPzogYm9vbGVhbiwgcHJlZml4Q3VzdG9tTmFtZT86IHN0cmluZyk6IHN0cmluZztcbiAgICBnZXRQYXJhbWV0ZXIocGFyYW1LZXk6IHN0cmluZywgcHJlZml4RW5hYmxlPzogYm9vbGVhbiwgcHJlZml4Q3VzdG9tTmFtZT86IHN0cmluZyk6IHN0cmluZztcbiAgICBwdXRWYXJpYWJsZSh2YXJpYWJsZUtleTogc3RyaW5nLCB2YXJpYWJsZVZhbHVlOiBzdHJpbmcpOiB2b2lkO1xuICAgIGdldFZhcmlhYmxlKHZhcmlhYmxlS2V5OiBzdHJpbmcpOiBzdHJpbmc7XG4gICAgd2l0aFN0YWNrTmFtZShiYXNlTmFtZTogc3RyaW5nLCBkZWxpbWl0ZXI/OiBzdHJpbmcpOiBzdHJpbmc7XG4gICAgd2l0aFByb2plY3RQcmVmaXgoYmFzZU5hbWU6IHN0cmluZywgZGVsaW1pdGVyPzogc3RyaW5nKTogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIENvbW1vbkhlbHBlclByb3BzIHtcbiAgICBzdGFja05hbWU6IHN0cmluZztcbiAgICBwcm9qZWN0UHJlZml4OiBzdHJpbmc7XG4gICAgY29uc3RydWN0OiBDb25zdHJ1Y3Q7XG4gICAgZW52OiBjZGsuRW52aXJvbm1lbnQ7XG4gICAgdmFyaWFibGVzOiBhbnk7XG59XG5cbmV4cG9ydCBjbGFzcyBDb21tb25IZWxwZXIgaW1wbGVtZW50cyBJQ29tbW9uSGVscGVyIHtcbiAgICBwcm90ZWN0ZWQgc3RhY2tOYW1lOiBzdHJpbmc7XG4gICAgcHJvdGVjdGVkIHByb2plY3RQcmVmaXg6IHN0cmluZztcbiAgICBwcm90ZWN0ZWQgcHJvcHM6IENvbW1vbkhlbHBlclByb3BzO1xuXG4gICAgY29uc3RydWN0b3IocHJvcHM6IENvbW1vbkhlbHBlclByb3BzKSB7XG4gICAgICAgIHRoaXMuc3RhY2tOYW1lID0gcHJvcHMuc3RhY2tOYW1lO1xuICAgICAgICB0aGlzLnByb3BzID0gcHJvcHM7XG4gICAgICAgIHRoaXMucHJvamVjdFByZWZpeCA9IHByb3BzLnByb2plY3RQcmVmaXg7XG4gICAgfVxuXG4gICAgcHVibGljIGZpbmRFbnVtVHlwZTxUIGV4dGVuZHMgb2JqZWN0PihlbnVtVHlwZTogVCwgdGFyZ2V0OiBzdHJpbmcpOiBUW2tleW9mIFRdIHtcbiAgICAgICAgdHlwZSBrZXlUeXBlID0ga2V5b2YgdHlwZW9mIGVudW1UeXBlO1xuXG4gICAgICAgIGNvbnN0IGtleUluU3RyaW5nID0gT2JqZWN0LmtleXMoZW51bVR5cGUpLmZpbmQoa2V5ID0+XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhgJHtrZXl9ID0gJHtlbnVtVHlwZVtrZXkgYXMga2V5b2YgdHlwZW9mIGVudW1UeXBlXX1gKTtcbiAgICAgICAgICAgIC8vICg8YW55PkVudW1UeXBlKVsnU3RyaW5nS2V5b2ZFbnVtVHlwZSddXG4gICAgICAgICAgICB0YXJnZXQgPT0gYCR7ZW51bVR5cGVba2V5IGFzIGtleW9mIHR5cGVvZiBlbnVtVHlwZV19YCBhcyBzdHJpbmdcbiAgICAgICAgKTtcblxuICAgICAgICBjb25zdCBrZXkgPSBrZXlJblN0cmluZyBhcyBrZXlUeXBlO1xuICAgICAgICByZXR1cm4gZW51bVR5cGVba2V5XTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZXhwb3J0T3V0cHV0KGtleTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nLCBwcmVmaXhFbmFibGU9dHJ1ZSwgcHJlZml4Q3VzdG9tTmFtZT86IHN0cmluZykge1xuICAgICAgICBpZiAocHJlZml4RW5hYmxlKSB7XG4gICAgICAgICAgICBjb25zdCBwcmVmaXggPSBwcmVmaXhDdXN0b21OYW1lID8gcHJlZml4Q3VzdG9tTmFtZSA6IHRoaXMucHJvamVjdFByZWZpeDtcbiAgICAgICAgICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMucHJvcHMuY29uc3RydWN0LCBgT3V0cHV0LSR7a2V5fWAsIHtcbiAgICAgICAgICAgICAgICBleHBvcnROYW1lOiBgJHtwcmVmaXh9LSR7a2V5fWAsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMucHJvcHMuY29uc3RydWN0LCBgT3V0cHV0LSR7a2V5fWAsIHtcbiAgICAgICAgICAgICAgICBleHBvcnROYW1lOiBrZXksXG4gICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBwdXRQYXJhbWV0ZXIocGFyYW1LZXk6IHN0cmluZywgcGFyYW1WYWx1ZTogc3RyaW5nLCBwcmVmaXhFbmFibGU9dHJ1ZSwgcHJlZml4Q3VzdG9tTmFtZT86IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIGlmIChwcmVmaXhFbmFibGUpIHtcbiAgICAgICAgICAgIGNvbnN0IHBhcmFtS2V5V2l0aFByZWZpeCA9IHByZWZpeEN1c3RvbU5hbWUgPyBgJHtwcmVmaXhDdXN0b21OYW1lfS0ke3BhcmFtS2V5fWAgOiBgJHt0aGlzLnByb2plY3RQcmVmaXh9LSR7cGFyYW1LZXl9YDtcblxuICAgICAgICAgICAgbmV3IHNzbS5TdHJpbmdQYXJhbWV0ZXIodGhpcy5wcm9wcy5jb25zdHJ1Y3QsIHBhcmFtS2V5LCB7XG4gICAgICAgICAgICAgICAgcGFyYW1ldGVyTmFtZTogcGFyYW1LZXlXaXRoUHJlZml4LFxuICAgICAgICAgICAgICAgIHN0cmluZ1ZhbHVlOiBwYXJhbVZhbHVlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXcgc3NtLlN0cmluZ1BhcmFtZXRlcih0aGlzLnByb3BzLmNvbnN0cnVjdCwgcGFyYW1LZXksIHtcbiAgICAgICAgICAgICAgICBwYXJhbWV0ZXJOYW1lOiBwYXJhbUtleSxcbiAgICAgICAgICAgICAgICBzdHJpbmdWYWx1ZTogcGFyYW1WYWx1ZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHBhcmFtS2V5O1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRQYXJhbWV0ZXIocGFyYW1LZXk6IHN0cmluZywgcHJlZml4RW5hYmxlPXRydWUsIHByZWZpeEN1c3RvbU5hbWU/OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICBpZiAocHJlZml4RW5hYmxlKSB7XG4gICAgICAgICAgICBjb25zdCBwYXJhbUtleVdpdGhQcmVmaXggPSBwcmVmaXhDdXN0b21OYW1lID8gYCR7cHJlZml4Q3VzdG9tTmFtZX0tJHtwYXJhbUtleX1gIDogYCR7dGhpcy5wcm9qZWN0UHJlZml4fS0ke3BhcmFtS2V5fWA7XG5cbiAgICAgICAgICAgIHJldHVybiBzc20uU3RyaW5nUGFyYW1ldGVyLnZhbHVlRm9yU3RyaW5nUGFyYW1ldGVyKFxuICAgICAgICAgICAgICAgIHRoaXMucHJvcHMuY29uc3RydWN0LFxuICAgICAgICAgICAgICAgIHBhcmFtS2V5V2l0aFByZWZpeFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBzc20uU3RyaW5nUGFyYW1ldGVyLnZhbHVlRm9yU3RyaW5nUGFyYW1ldGVyKFxuICAgICAgICAgICAgICAgIHRoaXMucHJvcHMuY29uc3RydWN0LFxuICAgICAgICAgICAgICAgIHBhcmFtS2V5XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHB1dFZhcmlhYmxlKHZhcmlhYmxlS2V5OiBzdHJpbmcsIHZhcmlhYmxlVmFsdWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLnByb3BzLnZhcmlhYmxlc1t2YXJpYWJsZUtleV0gPSB2YXJpYWJsZVZhbHVlO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRWYXJpYWJsZSh2YXJpYWJsZUtleTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvcHMudmFyaWFibGVzW3ZhcmlhYmxlS2V5XTtcbiAgICB9XG5cbiAgICBwdWJsaWMgd2l0aFN0YWNrTmFtZShiYXNlTmFtZTogc3RyaW5nLCBkZWxpbWl0ZXI9Jy0nKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIGAke3RoaXMuc3RhY2tOYW1lfSR7ZGVsaW1pdGVyfSR7YmFzZU5hbWV9YDtcbiAgICB9XG5cbiAgICBwdWJsaWMgd2l0aFByb2plY3RQcmVmaXgoYmFzZU5hbWU6IHN0cmluZywgZGVsaW1pdGVyPSctJyk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBgJHt0aGlzLnByb2plY3RQcmVmaXh9JHtkZWxpbWl0ZXJ9JHtiYXNlTmFtZX1gO1xuICAgIH1cbn1cbiJdfQ==