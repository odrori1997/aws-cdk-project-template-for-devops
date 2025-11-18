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
exports.PipelineBaseStack = void 0;
const base = __importStar(require("../base/base-stack"));
const pipeline = __importStar(require("../../construct/pattern/pipeline-simple-pattern"));
class PipelineBaseStack extends base.BaseStack {
    constructor(appContext, stackConfig) {
        super(appContext, stackConfig);
        const pipelineName = this.onPipelineName();
        const actionFlow = this.onActionFlow();
        this.simplePipeline = new pipeline.PipelineSimplePattern(this, 'SimplePipeline', {
            pipelineName,
            actionFlow,
            stackConfig,
            projectPrefix: this.projectPrefix,
            stackName: this.stackName,
            env: this.commonProps.env,
            variables: this.commonProps.variables
        });
        this.onPostConstructor(this.simplePipeline);
    }
    onBuildPolicies() {
        return undefined;
    }
}
exports.PipelineBaseStack = PipelineBaseStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlwZWxpbmUtYmFzZS1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2xpYi90ZW1wbGF0ZS9zdGFjay9kZXZvcHMvcGlwZWxpbmUtYmFzZS1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFJSCx5REFBMkM7QUFJM0MsMEZBQTRFO0FBRzVFLE1BQXNCLGlCQUFrQixTQUFRLElBQUksQ0FBQyxTQUFTO0lBVzFELFlBQVksVUFBc0IsRUFBRSxXQUF3QjtRQUN4RCxLQUFLLENBQUMsVUFBVSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBRS9CLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUMzQyxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFFdkMsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUU7WUFDN0UsWUFBWTtZQUNaLFVBQVU7WUFDVixXQUFXO1lBQ1gsYUFBYSxFQUFFLElBQUksQ0FBQyxhQUFhO1lBQ2pDLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUztZQUN6QixHQUFHLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFJO1lBQzFCLFNBQVMsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVM7U0FDeEMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBckJTLGVBQWU7UUFDckIsT0FBTyxTQUFTLENBQUE7SUFDcEIsQ0FBQztDQW9CSjtBQTdCRCw4Q0E2QkMiLCJzb3VyY2VzQ29udGVudCI6WyJcbi8qXG4gKiBDb3B5cmlnaHQgQW1hem9uLmNvbSwgSW5jLiBvciBpdHMgYWZmaWxpYXRlcy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBNSVQtMFxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpc1xuICogc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlXG4gKiB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksXG4gKiBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvXG4gKiBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28uXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUiBJTVBMSUVELFxuICogSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEFcbiAqIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFRcbiAqIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTlxuICogT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFXG4gKiBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAqL1xuXG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWlhbSc7XG5cbmltcG9ydCAqIGFzIGJhc2UgZnJvbSAnLi4vYmFzZS9iYXNlLXN0YWNrJztcbmltcG9ydCB7IEFwcENvbnRleHQgfSBmcm9tICcuLi8uLi9hcHAtY29udGV4dCc7XG5pbXBvcnQgeyBTdGFja0NvbmZpZyB9IGZyb20gJy4uLy4uL2FwcC1jb25maWcnXG5cbmltcG9ydCAqIGFzIHBpcGVsaW5lIGZyb20gJy4uLy4uL2NvbnN0cnVjdC9wYXR0ZXJuL3BpcGVsaW5lLXNpbXBsZS1wYXR0ZXJuJztcblxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUGlwZWxpbmVCYXNlU3RhY2sgZXh0ZW5kcyBiYXNlLkJhc2VTdGFjayB7XG5cbiAgICBwcml2YXRlIHNpbXBsZVBpcGVsaW5lOiBwaXBlbGluZS5QaXBlbGluZVNpbXBsZVBhdHRlcm47XG5cbiAgICBhYnN0cmFjdCBvblBpcGVsaW5lTmFtZSgpOiBzdHJpbmc7XG4gICAgYWJzdHJhY3Qgb25BY3Rpb25GbG93KCk6IHBpcGVsaW5lLkFjdGlvblByb3BzW107XG4gICAgYWJzdHJhY3Qgb25Qb3N0Q29uc3RydWN0b3IocGlwZWxpbmU6IHBpcGVsaW5lLlBpcGVsaW5lU2ltcGxlUGF0dGVybik6IHZvaWQ7XG4gICAgcHJvdGVjdGVkIG9uQnVpbGRQb2xpY2llcygpOiBpYW0uUG9saWN5U3RhdGVtZW50W118dW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKGFwcENvbnRleHQ6IEFwcENvbnRleHQsIHN0YWNrQ29uZmlnOiBTdGFja0NvbmZpZykge1xuICAgICAgICBzdXBlcihhcHBDb250ZXh0LCBzdGFja0NvbmZpZyk7XG5cbiAgICAgICAgY29uc3QgcGlwZWxpbmVOYW1lID0gdGhpcy5vblBpcGVsaW5lTmFtZSgpO1xuICAgICAgICBjb25zdCBhY3Rpb25GbG93ID0gdGhpcy5vbkFjdGlvbkZsb3coKTtcblxuICAgICAgICB0aGlzLnNpbXBsZVBpcGVsaW5lID0gbmV3IHBpcGVsaW5lLlBpcGVsaW5lU2ltcGxlUGF0dGVybih0aGlzLCAnU2ltcGxlUGlwZWxpbmUnLCB7XG4gICAgICAgICAgICBwaXBlbGluZU5hbWUsXG4gICAgICAgICAgICBhY3Rpb25GbG93LFxuICAgICAgICAgICAgc3RhY2tDb25maWcsXG4gICAgICAgICAgICBwcm9qZWN0UHJlZml4OiB0aGlzLnByb2plY3RQcmVmaXgsXG4gICAgICAgICAgICBzdGFja05hbWU6IHRoaXMuc3RhY2tOYW1lLFxuICAgICAgICAgICAgZW52OiB0aGlzLmNvbW1vblByb3BzLmVudiEsXG4gICAgICAgICAgICB2YXJpYWJsZXM6IHRoaXMuY29tbW9uUHJvcHMudmFyaWFibGVzXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMub25Qb3N0Q29uc3RydWN0b3IodGhpcy5zaW1wbGVQaXBlbGluZSk7XG4gICAgfVxufVxuIl19