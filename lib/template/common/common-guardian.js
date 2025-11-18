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
exports.CommonGuardian = void 0;
const cdk = __importStar(require("aws-cdk-lib"));
const s3 = __importStar(require("aws-cdk-lib/aws-s3"));
class CommonGuardian {
    constructor(props) {
        this.stackName = props.stackName;
        this.props = props;
        this.projectPrefix = props.projectPrefix;
    }
    createS3BucketName(baseName, suffix = true) {
        var _a, _b, _c;
        if (suffix === undefined || suffix === true) {
            const finalSuffix = `${(_a = this.props.env) === null || _a === void 0 ? void 0 : _a.region}-${(_c = (_b = this.props.env) === null || _b === void 0 ? void 0 : _b.account) === null || _c === void 0 ? void 0 : _c.substr(0, 5)}`;
            return `${this.stackName}-${baseName}-${finalSuffix}`.toLowerCase().replace('_', '-');
        }
        else {
            return `${this.stackName}-${baseName}`.toLowerCase().replace('_', '-');
        }
    }
    createS3Bucket(baseName, suffix = true, encryption, versioned) {
        const bucketName = this.createS3BucketName(baseName, suffix);
        const s3Bucket = new s3.Bucket(this.props.construct, `${baseName}-bucket`, {
            bucketName: bucketName,
            encryption: encryption == undefined ? s3.BucketEncryption.S3_MANAGED : encryption,
            versioned: versioned == undefined ? false : versioned,
            removalPolicy: cdk.RemovalPolicy.RETAIN
        });
        return s3Bucket;
    }
}
exports.CommonGuardian = CommonGuardian;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLWd1YXJkaWFuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29tbW9uLWd1YXJkaWFuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7OztHQWdCRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUdILGlEQUFtQztBQUNuQyx1REFBeUM7QUFnQnpDLE1BQWEsY0FBYztJQUt2QixZQUFZLEtBQTBCO1FBQ2xDLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQztRQUNqQyxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUM7SUFDN0MsQ0FBQztJQUVELGtCQUFrQixDQUFDLFFBQWdCLEVBQUUsTUFBTSxHQUFDLElBQUk7O1FBQzVDLElBQUksTUFBTSxLQUFLLFNBQVMsSUFBSSxNQUFNLEtBQUssSUFBSSxFQUFFO1lBQ3pDLE1BQU0sV0FBVyxHQUFHLEdBQUcsTUFBQSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsMENBQUUsTUFBTSxJQUFJLFlBQUEsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLDBDQUFFLE9BQU8sMENBQUUsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFBO1lBQ3hGLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxJQUFJLFFBQVEsSUFBSSxXQUFXLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1NBQ3pGO2FBQU07WUFDSCxPQUFPLEdBQUcsSUFBSSxDQUFDLFNBQVMsSUFBSSxRQUFRLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1NBQzFFO0lBQ0wsQ0FBQztJQUVELGNBQWMsQ0FBQyxRQUFnQixFQUFFLE1BQU0sR0FBQyxJQUFJLEVBQUUsVUFBZ0MsRUFBRSxTQUFtQjtRQUMvRixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRTdELE1BQU0sUUFBUSxHQUFHLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxHQUFHLFFBQVEsU0FBUyxFQUFFO1lBQ3ZFLFVBQVUsRUFBRSxVQUFVO1lBQ3RCLFVBQVUsRUFBRSxVQUFVLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxVQUFVO1lBQ2pGLFNBQVMsRUFBRSxTQUFTLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFNBQVM7WUFDckQsYUFBYSxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsTUFBTTtTQUMxQyxDQUFDLENBQUM7UUFFSCxPQUFPLFFBQVEsQ0FBQztJQUNwQixDQUFDO0NBQ0o7QUFoQ0Qsd0NBZ0NDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCBBbWF6b24uY29tLCBJbmMuIG9yIGl0cyBhZmZpbGlhdGVzLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVC0wXG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weSBvZiB0aGlzXG4gKiBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmVcbiAqIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSxcbiAqIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG9cbiAqIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzby5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SIElNUExJRUQsXG4gKiBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQVxuICogUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVFxuICogSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OXG4gKiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEVcbiAqIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICovXG5cbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCAqIGFzIHMzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMyc7XG5cblxuZXhwb3J0IGludGVyZmFjZSBJQ29tbW9uR3VhcmRpYW4ge1xuICAgIGNyZWF0ZVMzQnVja2V0TmFtZShiYXNlTmFtZTogc3RyaW5nLCBzdWZmaXg/OiBib29sZWFuKTogc3RyaW5nO1xuICAgIGNyZWF0ZVMzQnVja2V0KGJhc2VOYW1lOiBzdHJpbmcsIHN1ZmZpeD86IGJvb2xlYW4sIGVuY3J5cHRpb24/OiBzMy5CdWNrZXRFbmNyeXB0aW9uLCB2ZXJzaW9uZWQ/OiBib29sZWFuKTogczMuQnVja2V0O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIENvbW1vbkd1YXJkaWFuUHJvcHMge1xuICAgIHN0YWNrTmFtZTogc3RyaW5nO1xuICAgIHByb2plY3RQcmVmaXg6IHN0cmluZztcbiAgICBjb25zdHJ1Y3Q6IENvbnN0cnVjdDtcbiAgICBlbnY6IGNkay5FbnZpcm9ubWVudDtcbiAgICB2YXJpYWJsZXM6IGFueTtcbn1cblxuZXhwb3J0IGNsYXNzIENvbW1vbkd1YXJkaWFuIGltcGxlbWVudHMgSUNvbW1vbkd1YXJkaWFuIHtcbiAgICBwcm90ZWN0ZWQgc3RhY2tOYW1lOiBzdHJpbmc7XG4gICAgcHJvdGVjdGVkIHByb2plY3RQcmVmaXg6IHN0cmluZztcbiAgICBwcm90ZWN0ZWQgcHJvcHM6IENvbW1vbkd1YXJkaWFuUHJvcHM7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wczogQ29tbW9uR3VhcmRpYW5Qcm9wcykge1xuICAgICAgICB0aGlzLnN0YWNrTmFtZSA9IHByb3BzLnN0YWNrTmFtZTtcbiAgICAgICAgdGhpcy5wcm9wcyA9IHByb3BzO1xuICAgICAgICB0aGlzLnByb2plY3RQcmVmaXggPSBwcm9wcy5wcm9qZWN0UHJlZml4O1xuICAgIH1cblxuICAgIGNyZWF0ZVMzQnVja2V0TmFtZShiYXNlTmFtZTogc3RyaW5nLCBzdWZmaXg9dHJ1ZSk6IHN0cmluZyB7XG4gICAgICAgIGlmIChzdWZmaXggPT09IHVuZGVmaW5lZCB8fCBzdWZmaXggPT09IHRydWUpIHtcbiAgICAgICAgICAgIGNvbnN0IGZpbmFsU3VmZml4ID0gYCR7dGhpcy5wcm9wcy5lbnY/LnJlZ2lvbn0tJHt0aGlzLnByb3BzLmVudj8uYWNjb3VudD8uc3Vic3RyKDAsIDUpfWBcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzLnN0YWNrTmFtZX0tJHtiYXNlTmFtZX0tJHtmaW5hbFN1ZmZpeH1gLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgnXycsICctJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpcy5zdGFja05hbWV9LSR7YmFzZU5hbWV9YC50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoJ18nLCAnLScpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlUzNCdWNrZXQoYmFzZU5hbWU6IHN0cmluZywgc3VmZml4PXRydWUsIGVuY3J5cHRpb24/OiBzMy5CdWNrZXRFbmNyeXB0aW9uLCB2ZXJzaW9uZWQ/OiBib29sZWFuKTogczMuQnVja2V0IHtcbiAgICAgICAgY29uc3QgYnVja2V0TmFtZSA9IHRoaXMuY3JlYXRlUzNCdWNrZXROYW1lKGJhc2VOYW1lLCBzdWZmaXgpO1xuXG4gICAgICAgIGNvbnN0IHMzQnVja2V0ID0gbmV3IHMzLkJ1Y2tldCh0aGlzLnByb3BzLmNvbnN0cnVjdCwgYCR7YmFzZU5hbWV9LWJ1Y2tldGAsIHtcbiAgICAgICAgICAgIGJ1Y2tldE5hbWU6IGJ1Y2tldE5hbWUsXG4gICAgICAgICAgICBlbmNyeXB0aW9uOiBlbmNyeXB0aW9uID09IHVuZGVmaW5lZCA/IHMzLkJ1Y2tldEVuY3J5cHRpb24uUzNfTUFOQUdFRCA6IGVuY3J5cHRpb24sXG4gICAgICAgICAgICB2ZXJzaW9uZWQ6IHZlcnNpb25lZCA9PSB1bmRlZmluZWQgPyBmYWxzZSA6IHZlcnNpb25lZCxcbiAgICAgICAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LlJFVEFJTlxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gczNCdWNrZXQ7XG4gICAgfVxufVxuIl19