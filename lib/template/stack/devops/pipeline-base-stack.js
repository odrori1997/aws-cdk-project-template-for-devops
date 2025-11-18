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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlwZWxpbmUtYmFzZS1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInBpcGVsaW5lLWJhc2Utc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBSUgseURBQTJDO0FBSTNDLDBGQUE0RTtBQUc1RSxNQUFzQixpQkFBa0IsU0FBUSxJQUFJLENBQUMsU0FBUztJQVcxRCxZQUFZLFVBQXNCLEVBQUUsV0FBd0I7UUFDeEQsS0FBSyxDQUFDLFVBQVUsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUUvQixNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDM0MsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBRXZDLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxRQUFRLENBQUMscUJBQXFCLENBQUMsSUFBSSxFQUFFLGdCQUFnQixFQUFFO1lBQzdFLFlBQVk7WUFDWixVQUFVO1lBQ1YsV0FBVztZQUNYLGFBQWEsRUFBRSxJQUFJLENBQUMsYUFBYTtZQUNqQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVM7WUFDekIsR0FBRyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBSTtZQUMxQixTQUFTLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTO1NBQ3hDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQXJCUyxlQUFlO1FBQ3JCLE9BQU8sU0FBUyxDQUFBO0lBQ3BCLENBQUM7Q0FvQko7QUE3QkQsOENBNkJDIiwic291cmNlc0NvbnRlbnQiOlsiXG4vKlxuICogQ29weXJpZ2h0IEFtYXpvbi5jb20sIEluYy4gb3IgaXRzIGFmZmlsaWF0ZXMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogTUlULTBcbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXNcbiAqIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZVxuICogd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LFxuICogbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0b1xuICogcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1IgSU1QTElFRCxcbiAqIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBXG4gKiBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUXG4gKiBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT05cbiAqIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRVxuICogU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4gKi9cblxuaW1wb3J0ICogYXMgaWFtIGZyb20gJ2F3cy1jZGstbGliL2F3cy1pYW0nO1xuXG5pbXBvcnQgKiBhcyBiYXNlIGZyb20gJy4uL2Jhc2UvYmFzZS1zdGFjayc7XG5pbXBvcnQgeyBBcHBDb250ZXh0IH0gZnJvbSAnLi4vLi4vYXBwLWNvbnRleHQnO1xuaW1wb3J0IHsgU3RhY2tDb25maWcgfSBmcm9tICcuLi8uLi9hcHAtY29uZmlnJ1xuXG5pbXBvcnQgKiBhcyBwaXBlbGluZSBmcm9tICcuLi8uLi9jb25zdHJ1Y3QvcGF0dGVybi9waXBlbGluZS1zaW1wbGUtcGF0dGVybic7XG5cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFBpcGVsaW5lQmFzZVN0YWNrIGV4dGVuZHMgYmFzZS5CYXNlU3RhY2sge1xuXG4gICAgcHJpdmF0ZSBzaW1wbGVQaXBlbGluZTogcGlwZWxpbmUuUGlwZWxpbmVTaW1wbGVQYXR0ZXJuO1xuXG4gICAgYWJzdHJhY3Qgb25QaXBlbGluZU5hbWUoKTogc3RyaW5nO1xuICAgIGFic3RyYWN0IG9uQWN0aW9uRmxvdygpOiBwaXBlbGluZS5BY3Rpb25Qcm9wc1tdO1xuICAgIGFic3RyYWN0IG9uUG9zdENvbnN0cnVjdG9yKHBpcGVsaW5lOiBwaXBlbGluZS5QaXBlbGluZVNpbXBsZVBhdHRlcm4pOiB2b2lkO1xuICAgIHByb3RlY3RlZCBvbkJ1aWxkUG9saWNpZXMoKTogaWFtLlBvbGljeVN0YXRlbWVudFtdfHVuZGVmaW5lZCB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihhcHBDb250ZXh0OiBBcHBDb250ZXh0LCBzdGFja0NvbmZpZzogU3RhY2tDb25maWcpIHtcbiAgICAgICAgc3VwZXIoYXBwQ29udGV4dCwgc3RhY2tDb25maWcpO1xuXG4gICAgICAgIGNvbnN0IHBpcGVsaW5lTmFtZSA9IHRoaXMub25QaXBlbGluZU5hbWUoKTtcbiAgICAgICAgY29uc3QgYWN0aW9uRmxvdyA9IHRoaXMub25BY3Rpb25GbG93KCk7XG5cbiAgICAgICAgdGhpcy5zaW1wbGVQaXBlbGluZSA9IG5ldyBwaXBlbGluZS5QaXBlbGluZVNpbXBsZVBhdHRlcm4odGhpcywgJ1NpbXBsZVBpcGVsaW5lJywge1xuICAgICAgICAgICAgcGlwZWxpbmVOYW1lLFxuICAgICAgICAgICAgYWN0aW9uRmxvdyxcbiAgICAgICAgICAgIHN0YWNrQ29uZmlnLFxuICAgICAgICAgICAgcHJvamVjdFByZWZpeDogdGhpcy5wcm9qZWN0UHJlZml4LFxuICAgICAgICAgICAgc3RhY2tOYW1lOiB0aGlzLnN0YWNrTmFtZSxcbiAgICAgICAgICAgIGVudjogdGhpcy5jb21tb25Qcm9wcy5lbnYhLFxuICAgICAgICAgICAgdmFyaWFibGVzOiB0aGlzLmNvbW1vblByb3BzLnZhcmlhYmxlc1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLm9uUG9zdENvbnN0cnVjdG9yKHRoaXMuc2ltcGxlUGlwZWxpbmUpO1xuICAgIH1cbn1cbiJdfQ==