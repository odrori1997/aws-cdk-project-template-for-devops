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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLWd1YXJkaWFuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbGliL3RlbXBsYXRlL2NvbW1vbi9jb21tb24tZ3VhcmRpYW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBR0gsaURBQW1DO0FBQ25DLHVEQUF5QztBQWdCekMsTUFBYSxjQUFjO0lBS3ZCLFlBQVksS0FBMEI7UUFDbEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQztJQUM3QyxDQUFDO0lBRUQsa0JBQWtCLENBQUMsUUFBZ0IsRUFBRSxNQUFNLEdBQUMsSUFBSTs7UUFDNUMsSUFBSSxNQUFNLEtBQUssU0FBUyxJQUFJLE1BQU0sS0FBSyxJQUFJLEVBQUU7WUFDekMsTUFBTSxXQUFXLEdBQUcsR0FBRyxNQUFBLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRywwQ0FBRSxNQUFNLElBQUksWUFBQSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsMENBQUUsT0FBTywwQ0FBRSxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUE7WUFDeEYsT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLElBQUksUUFBUSxJQUFJLFdBQVcsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7U0FDekY7YUFBTTtZQUNILE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxJQUFJLFFBQVEsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7U0FDMUU7SUFDTCxDQUFDO0lBRUQsY0FBYyxDQUFDLFFBQWdCLEVBQUUsTUFBTSxHQUFDLElBQUksRUFBRSxVQUFnQyxFQUFFLFNBQW1CO1FBQy9GLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFN0QsTUFBTSxRQUFRLEdBQUcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLEdBQUcsUUFBUSxTQUFTLEVBQUU7WUFDdkUsVUFBVSxFQUFFLFVBQVU7WUFDdEIsVUFBVSxFQUFFLFVBQVUsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFVBQVU7WUFDakYsU0FBUyxFQUFFLFNBQVMsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsU0FBUztZQUNyRCxhQUFhLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxNQUFNO1NBQzFDLENBQUMsQ0FBQztRQUVILE9BQU8sUUFBUSxDQUFDO0lBQ3BCLENBQUM7Q0FDSjtBQWhDRCx3Q0FnQ0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEFtYXpvbi5jb20sIEluYy4gb3IgaXRzIGFmZmlsaWF0ZXMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogTUlULTBcbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXNcbiAqIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZVxuICogd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LFxuICogbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0b1xuICogcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1IgSU1QTElFRCxcbiAqIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBXG4gKiBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUXG4gKiBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT05cbiAqIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRVxuICogU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4gKi9cblxuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgczMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXMzJztcblxuXG5leHBvcnQgaW50ZXJmYWNlIElDb21tb25HdWFyZGlhbiB7XG4gICAgY3JlYXRlUzNCdWNrZXROYW1lKGJhc2VOYW1lOiBzdHJpbmcsIHN1ZmZpeD86IGJvb2xlYW4pOiBzdHJpbmc7XG4gICAgY3JlYXRlUzNCdWNrZXQoYmFzZU5hbWU6IHN0cmluZywgc3VmZml4PzogYm9vbGVhbiwgZW5jcnlwdGlvbj86IHMzLkJ1Y2tldEVuY3J5cHRpb24sIHZlcnNpb25lZD86IGJvb2xlYW4pOiBzMy5CdWNrZXQ7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29tbW9uR3VhcmRpYW5Qcm9wcyB7XG4gICAgc3RhY2tOYW1lOiBzdHJpbmc7XG4gICAgcHJvamVjdFByZWZpeDogc3RyaW5nO1xuICAgIGNvbnN0cnVjdDogQ29uc3RydWN0O1xuICAgIGVudjogY2RrLkVudmlyb25tZW50O1xuICAgIHZhcmlhYmxlczogYW55O1xufVxuXG5leHBvcnQgY2xhc3MgQ29tbW9uR3VhcmRpYW4gaW1wbGVtZW50cyBJQ29tbW9uR3VhcmRpYW4ge1xuICAgIHByb3RlY3RlZCBzdGFja05hbWU6IHN0cmluZztcbiAgICBwcm90ZWN0ZWQgcHJvamVjdFByZWZpeDogc3RyaW5nO1xuICAgIHByb3RlY3RlZCBwcm9wczogQ29tbW9uR3VhcmRpYW5Qcm9wcztcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzOiBDb21tb25HdWFyZGlhblByb3BzKSB7XG4gICAgICAgIHRoaXMuc3RhY2tOYW1lID0gcHJvcHMuc3RhY2tOYW1lO1xuICAgICAgICB0aGlzLnByb3BzID0gcHJvcHM7XG4gICAgICAgIHRoaXMucHJvamVjdFByZWZpeCA9IHByb3BzLnByb2plY3RQcmVmaXg7XG4gICAgfVxuXG4gICAgY3JlYXRlUzNCdWNrZXROYW1lKGJhc2VOYW1lOiBzdHJpbmcsIHN1ZmZpeD10cnVlKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKHN1ZmZpeCA9PT0gdW5kZWZpbmVkIHx8IHN1ZmZpeCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgY29uc3QgZmluYWxTdWZmaXggPSBgJHt0aGlzLnByb3BzLmVudj8ucmVnaW9ufS0ke3RoaXMucHJvcHMuZW52Py5hY2NvdW50Py5zdWJzdHIoMCwgNSl9YFxuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXMuc3RhY2tOYW1lfS0ke2Jhc2VOYW1lfS0ke2ZpbmFsU3VmZml4fWAudG9Mb3dlckNhc2UoKS5yZXBsYWNlKCdfJywgJy0nKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzLnN0YWNrTmFtZX0tJHtiYXNlTmFtZX1gLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgnXycsICctJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjcmVhdGVTM0J1Y2tldChiYXNlTmFtZTogc3RyaW5nLCBzdWZmaXg9dHJ1ZSwgZW5jcnlwdGlvbj86IHMzLkJ1Y2tldEVuY3J5cHRpb24sIHZlcnNpb25lZD86IGJvb2xlYW4pOiBzMy5CdWNrZXQge1xuICAgICAgICBjb25zdCBidWNrZXROYW1lID0gdGhpcy5jcmVhdGVTM0J1Y2tldE5hbWUoYmFzZU5hbWUsIHN1ZmZpeCk7XG5cbiAgICAgICAgY29uc3QgczNCdWNrZXQgPSBuZXcgczMuQnVja2V0KHRoaXMucHJvcHMuY29uc3RydWN0LCBgJHtiYXNlTmFtZX0tYnVja2V0YCwge1xuICAgICAgICAgICAgYnVja2V0TmFtZTogYnVja2V0TmFtZSxcbiAgICAgICAgICAgIGVuY3J5cHRpb246IGVuY3J5cHRpb24gPT0gdW5kZWZpbmVkID8gczMuQnVja2V0RW5jcnlwdGlvbi5TM19NQU5BR0VEIDogZW5jcnlwdGlvbixcbiAgICAgICAgICAgIHZlcnNpb25lZDogdmVyc2lvbmVkID09IHVuZGVmaW5lZCA/IGZhbHNlIDogdmVyc2lvbmVkLFxuICAgICAgICAgICAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuUkVUQUlOXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBzM0J1Y2tldDtcbiAgICB9XG59XG4iXX0=