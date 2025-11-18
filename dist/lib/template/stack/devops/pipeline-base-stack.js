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
exports.PipelineBaseStack = void 0;
const base = __importStar(require("../base/base-stack"));
const pipeline = __importStar(require("../../construct/pattern/pipeline-simple-pattern"));
class PipelineBaseStack extends base.BaseStack {
    onBuildPolicies() {
        return undefined;
    }
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
}
exports.PipelineBaseStack = PipelineBaseStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlwZWxpbmUtYmFzZS1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2xpYi90ZW1wbGF0ZS9zdGFjay9kZXZvcHMvcGlwZWxpbmUtYmFzZS1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBSUgseURBQTJDO0FBSTNDLDBGQUE0RTtBQUc1RSxNQUFzQixpQkFBa0IsU0FBUSxJQUFJLENBQUMsU0FBUztJQU9oRCxlQUFlO1FBQ3JCLE9BQU8sU0FBUyxDQUFBO0lBQ3BCLENBQUM7SUFFRCxZQUFZLFVBQXNCLEVBQUUsV0FBd0I7UUFDeEQsS0FBSyxDQUFDLFVBQVUsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUUvQixNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDM0MsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBRXZDLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxRQUFRLENBQUMscUJBQXFCLENBQUMsSUFBSSxFQUFFLGdCQUFnQixFQUFFO1lBQzdFLFlBQVk7WUFDWixVQUFVO1lBQ1YsV0FBVztZQUNYLGFBQWEsRUFBRSxJQUFJLENBQUMsYUFBYTtZQUNqQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVM7WUFDekIsR0FBRyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBSTtZQUMxQixTQUFTLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTO1NBQ3hDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDaEQsQ0FBQztDQUNKO0FBN0JELDhDQTZCQyIsInNvdXJjZXNDb250ZW50IjpbIlxuLypcbiAqIENvcHlyaWdodCBBbWF6b24uY29tLCBJbmMuIG9yIGl0cyBhZmZpbGlhdGVzLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVC0wXG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weSBvZiB0aGlzXG4gKiBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmVcbiAqIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSxcbiAqIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG9cbiAqIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzby5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SIElNUExJRUQsXG4gKiBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQVxuICogUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVFxuICogSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OXG4gKiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEVcbiAqIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICovXG5cbmltcG9ydCAqIGFzIGlhbSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJztcblxuaW1wb3J0ICogYXMgYmFzZSBmcm9tICcuLi9iYXNlL2Jhc2Utc3RhY2snO1xuaW1wb3J0IHsgQXBwQ29udGV4dCB9IGZyb20gJy4uLy4uL2FwcC1jb250ZXh0JztcbmltcG9ydCB7IFN0YWNrQ29uZmlnIH0gZnJvbSAnLi4vLi4vYXBwLWNvbmZpZydcblxuaW1wb3J0ICogYXMgcGlwZWxpbmUgZnJvbSAnLi4vLi4vY29uc3RydWN0L3BhdHRlcm4vcGlwZWxpbmUtc2ltcGxlLXBhdHRlcm4nO1xuXG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBQaXBlbGluZUJhc2VTdGFjayBleHRlbmRzIGJhc2UuQmFzZVN0YWNrIHtcblxuICAgIHByaXZhdGUgc2ltcGxlUGlwZWxpbmU6IHBpcGVsaW5lLlBpcGVsaW5lU2ltcGxlUGF0dGVybjtcblxuICAgIGFic3RyYWN0IG9uUGlwZWxpbmVOYW1lKCk6IHN0cmluZztcbiAgICBhYnN0cmFjdCBvbkFjdGlvbkZsb3coKTogcGlwZWxpbmUuQWN0aW9uUHJvcHNbXTtcbiAgICBhYnN0cmFjdCBvblBvc3RDb25zdHJ1Y3RvcihwaXBlbGluZTogcGlwZWxpbmUuUGlwZWxpbmVTaW1wbGVQYXR0ZXJuKTogdm9pZDtcbiAgICBwcm90ZWN0ZWQgb25CdWlsZFBvbGljaWVzKCk6IGlhbS5Qb2xpY3lTdGF0ZW1lbnRbXXx1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IoYXBwQ29udGV4dDogQXBwQ29udGV4dCwgc3RhY2tDb25maWc6IFN0YWNrQ29uZmlnKSB7XG4gICAgICAgIHN1cGVyKGFwcENvbnRleHQsIHN0YWNrQ29uZmlnKTtcblxuICAgICAgICBjb25zdCBwaXBlbGluZU5hbWUgPSB0aGlzLm9uUGlwZWxpbmVOYW1lKCk7XG4gICAgICAgIGNvbnN0IGFjdGlvbkZsb3cgPSB0aGlzLm9uQWN0aW9uRmxvdygpO1xuXG4gICAgICAgIHRoaXMuc2ltcGxlUGlwZWxpbmUgPSBuZXcgcGlwZWxpbmUuUGlwZWxpbmVTaW1wbGVQYXR0ZXJuKHRoaXMsICdTaW1wbGVQaXBlbGluZScsIHtcbiAgICAgICAgICAgIHBpcGVsaW5lTmFtZSxcbiAgICAgICAgICAgIGFjdGlvbkZsb3csXG4gICAgICAgICAgICBzdGFja0NvbmZpZyxcbiAgICAgICAgICAgIHByb2plY3RQcmVmaXg6IHRoaXMucHJvamVjdFByZWZpeCxcbiAgICAgICAgICAgIHN0YWNrTmFtZTogdGhpcy5zdGFja05hbWUsXG4gICAgICAgICAgICBlbnY6IHRoaXMuY29tbW9uUHJvcHMuZW52ISxcbiAgICAgICAgICAgIHZhcmlhYmxlczogdGhpcy5jb21tb25Qcm9wcy52YXJpYWJsZXNcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5vblBvc3RDb25zdHJ1Y3Rvcih0aGlzLnNpbXBsZVBpcGVsaW5lKTtcbiAgICB9XG59XG4iXX0=