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
exports.LambdaSimplePattern = void 0;
const cdk = __importStar(require("aws-cdk-lib"));
const lambda = __importStar(require("aws-cdk-lib/aws-lambda"));
const iam = __importStar(require("aws-cdk-lib/aws-iam"));
const s3 = __importStar(require("aws-cdk-lib/aws-s3"));
const aws_lambda_event_sources_1 = require("aws-cdk-lib/aws-lambda-event-sources");
const base_construct_1 = require("../base/base-construct");
class LambdaSimplePattern extends base_construct_1.BaseConstruct {
    constructor(scope, id, props) {
        super(scope, id, props);
        const lambdaName = `${props.projectPrefix}-${props.baseName}-Lambda`;
        const roleName = `${props.projectPrefix}-${props.baseName}-Lambda-Role`;
        this.lambdaRole = this.createRole(roleName, props.policies);
        this.lambdaFunction = this.createLambda(lambdaName, props.lambdaPath, this.lambdaRole, props);
    }
    createLambda(lambdaName, lambdaPath, lambdaRole, props) {
        var layers = this.loadLayers(lambdaName, props.layerArns);
        const lambdaFunction = new lambda.Function(this, lambdaName, {
            functionName: lambdaName,
            code: lambda.Code.fromAsset(lambdaPath),
            handler: props.handler != undefined ? props.handler : 'handler.handle',
            runtime: lambda.Runtime.PYTHON_3_9,
            timeout: props.timeout != undefined ? props.timeout : cdk.Duration.seconds(60 * 3),
            role: lambdaRole,
            environment: props.environments,
            layers: layers.length > 0 ? layers : undefined,
        });
        if (props.bucket != undefined) {
            const filterList = [];
            if (props.bucketPrefix != undefined && props.bucketPrefix.length > 0) {
                for (var item of props.bucketPrefix) {
                    lambdaFunction.addEventSource(new aws_lambda_event_sources_1.S3EventSource(props.bucket, {
                        events: [s3.EventType.OBJECT_CREATED_PUT, s3.EventType.OBJECT_CREATED_COPY],
                        filters: [{ prefix: item }]
                    }));
                }
            }
            if (props.bucketSuffix != undefined && props.bucketSuffix.length > 0) {
                for (var item of props.bucketSuffix) {
                    lambdaFunction.addEventSource(new aws_lambda_event_sources_1.S3EventSource(props.bucket, {
                        events: [s3.EventType.OBJECT_CREATED_PUT, s3.EventType.OBJECT_CREATED_COPY],
                        filters: [{ suffix: item }]
                    }));
                }
            }
        }
        return lambdaFunction;
    }
    createRole(roleName, policies) {
        const role = new iam.Role(this, roleName, {
            roleName: roleName,
            assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
        });
        role.addManagedPolicy({ managedPolicyArn: 'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole' });
        for (var item of policies) {
            if (item instanceof iam.PolicyStatement) {
                role.addToPolicy(item);
            }
            else {
                role.addManagedPolicy({ managedPolicyArn: item });
            }
        }
        return role;
    }
    loadLayers(lambdaName, layerArns) {
        let layers = [];
        if (layerArns != undefined && layerArns.length > 0) {
            let index = 0;
            for (let arn of layerArns) {
                index++;
                layers.push(lambda.LayerVersion.fromLayerVersionArn(this, `${lambdaName}-${index}-layer`, arn));
            }
        }
        return layers;
    }
}
exports.LambdaSimplePattern = LambdaSimplePattern;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFtYmRhLXB5dGhvbi1wYXR0ZXJuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibGFtYmRhLXB5dGhvbi1wYXR0ZXJuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7OztHQWdCRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVILGlEQUFtQztBQUVuQywrREFBaUQ7QUFDakQseURBQTJDO0FBQzNDLHVEQUF5QztBQUN6QyxtRkFBcUU7QUFFckUsMkRBQTZFO0FBZTdFLE1BQWEsbUJBQW9CLFNBQVEsOEJBQWE7SUFJbEQsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUErQjtRQUNyRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLFVBQVUsR0FBVyxHQUFHLEtBQUssQ0FBQyxhQUFhLElBQUksS0FBSyxDQUFDLFFBQVEsU0FBUyxDQUFDO1FBQzdFLE1BQU0sUUFBUSxHQUFXLEdBQUcsS0FBSyxDQUFDLGFBQWEsSUFBSSxLQUFLLENBQUMsUUFBUSxjQUFjLENBQUM7UUFFaEYsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDNUQsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDbEcsQ0FBQztJQUVPLFlBQVksQ0FBQyxVQUFrQixFQUFFLFVBQWtCLEVBQUUsVUFBb0IsRUFBRSxLQUErQjtRQUM5RyxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsU0FBVSxDQUFDLENBQUM7UUFFM0QsTUFBTSxjQUFjLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxV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RUQsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVPLFVBQVUsQ0FBQyxVQUFrQixFQUFFLFNBQW1CO1FBQ3RELElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUVoQixJQUFJLFNBQVMsSUFBSSxTQUFTLElBQUksU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDaEQsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1lBQ2QsS0FBSyxJQUFJLEdBQUcsSUFBSSxTQUFTLEVBQUU7Z0JBQ3ZCLEtBQUssRUFBRSxDQUFDO2dCQUNSLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLEVBQUUsR0FBRyxVQUFVLElBQUksS0FBSyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQTthQUNsRztTQUNKO1FBRUQsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQztDQUNKO0FBbEZELGtEQWtGQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgQW1hem9uLmNvbSwgSW5jLiBvciBpdHMgYWZmaWxpYXRlcy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBNSVQtMFxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpc1xuICogc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlXG4gKiB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksXG4gKiBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvXG4gKiBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28uXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUiBJTVBMSUVELFxuICogSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEFcbiAqIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFRcbiAqIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTlxuICogT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFXG4gKiBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAqL1xuXG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnYXdzLWNkay1saWIvYXdzLWxhbWJkYSc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBzMyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtczMnO1xuaW1wb3J0IHsgUzNFdmVudFNvdXJjZSB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1sYW1iZGEtZXZlbnQtc291cmNlcyc7XG5cbmltcG9ydCB7IEJhc2VDb25zdHJ1Y3QsIENvbnN0cnVjdENvbW1vblByb3BzIH0gZnJvbSAnLi4vYmFzZS9iYXNlLWNvbnN0cnVjdCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGFtYmRhU2ltcGxlUGF0dGVyblByb3BzIGV4dGVuZHMgQ29uc3RydWN0Q29tbW9uUHJvcHMge1xuICAgIGJhc2VOYW1lOiBzdHJpbmc7XG4gICAgbGFtYmRhUGF0aDogc3RyaW5nO1xuICAgIHBvbGljaWVzOiBzdHJpbmdbXSB8IGlhbS5Qb2xpY3lTdGF0ZW1lbnRbXTtcbiAgICBoYW5kbGVyPzogc3RyaW5nO1xuICAgIGVudmlyb25tZW50cz86IGFueTtcbiAgICB0aW1lb3V0PzogY2RrLkR1cmF0aW9uO1xuICAgIGJ1Y2tldD86IHMzLkJ1Y2tldDtcbiAgICBsYXllckFybnM/OiBzdHJpbmdbXTtcbiAgICBidWNrZXRQcmVmaXg/OiBzdHJpbmdbXTtcbiAgICBidWNrZXRTdWZmaXg/OiBzdHJpbmdbXTtcbn1cblxuZXhwb3J0IGNsYXNzIExhbWJkYVNpbXBsZVBhdHRlcm4gZXh0ZW5kcyBCYXNlQ29uc3RydWN0IHtcbiAgICBwdWJsaWMgcmVhZG9ubHkgbGFtYmRhRnVuY3Rpb246IGxhbWJkYS5GdW5jdGlvbjtcbiAgICBwdWJsaWMgcmVhZG9ubHkgbGFtYmRhUm9sZTogaWFtLlJvbGU7XG5cbiAgICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogTGFtYmRhU2ltcGxlUGF0dGVyblByb3BzKSB7XG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgICAgIGNvbnN0IGxhbWJkYU5hbWU6IHN0cmluZyA9IGAke3Byb3BzLnByb2plY3RQcmVmaXh9LSR7cHJvcHMuYmFzZU5hbWV9LUxhbWJkYWA7XG4gICAgICAgIGNvbnN0IHJvbGVOYW1lOiBzdHJpbmcgPSBgJHtwcm9wcy5wcm9qZWN0UHJlZml4fS0ke3Byb3BzLmJhc2VOYW1lfS1MYW1iZGEtUm9sZWA7XG5cbiAgICAgICAgdGhpcy5sYW1iZGFSb2xlID0gdGhpcy5jcmVhdGVSb2xlKHJvbGVOYW1lLCBwcm9wcy5wb2xpY2llcyk7XG4gICAgICAgIHRoaXMubGFtYmRhRnVuY3Rpb24gPSB0aGlzLmNyZWF0ZUxhbWJkYShsYW1iZGFOYW1lLCBwcm9wcy5sYW1iZGFQYXRoLCB0aGlzLmxhbWJkYVJvbGUsIHByb3BzKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZUxhbWJkYShsYW1iZGFOYW1lOiBzdHJpbmcsIGxhbWJkYVBhdGg6IHN0cmluZywgbGFtYmRhUm9sZTogaWFtLlJvbGUsIHByb3BzOiBMYW1iZGFTaW1wbGVQYXR0ZXJuUHJvcHMpOiBsYW1iZGEuRnVuY3Rpb24ge1xuICAgICAgICB2YXIgbGF5ZXJzID0gdGhpcy5sb2FkTGF5ZXJzKGxhbWJkYU5hbWUsIHByb3BzLmxheWVyQXJucyEpO1xuXG4gICAgICAgIGNvbnN0IGxhbWJkYUZ1bmN0aW9uID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCBsYW1iZGFOYW1lLCB7XG4gICAgICAgICAgICBmdW5jdGlvbk5hbWU6IGxhbWJkYU5hbWUsXG4gICAgICAgICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQobGFtYmRhUGF0aCksXG4gICAgICAgICAgICBoYW5kbGVyOiBwcm9wcy5oYW5kbGVyICE9IHVuZGVmaW5lZCA/IHByb3BzLmhhbmRsZXIgOiAnaGFuZGxlci5oYW5kbGUnLFxuICAgICAgICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuUFlUSE9OXzNfOSxcbiAgICAgICAgICAgIHRpbWVvdXQ6IHByb3BzLnRpbWVvdXQgIT0gdW5kZWZpbmVkID8gcHJvcHMudGltZW91dCA6IGNkay5EdXJhdGlvbi5zZWNvbmRzKDYwICogMyksXG4gICAgICAgICAgICByb2xlOiBsYW1iZGFSb2xlLFxuICAgICAgICAgICAgZW52aXJvbm1lbnQ6IHByb3BzLmVudmlyb25tZW50cyxcbiAgICAgICAgICAgIGxheWVyczogbGF5ZXJzLmxlbmd0aCA+IDAgPyBsYXllcnMgOiB1bmRlZmluZWQsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChwcm9wcy5idWNrZXQgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zdCBmaWx0ZXJMaXN0OiBhbnlbXSA9IFtdO1xuICAgICAgICAgICAgaWYgKHByb3BzLmJ1Y2tldFByZWZpeCAhPSB1bmRlZmluZWQgJiYgcHJvcHMuYnVja2V0UHJlZml4Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpdGVtIG9mIHByb3BzLmJ1Y2tldFByZWZpeCkge1xuICAgICAgICAgICAgICAgICAgICBsYW1iZGFGdW5jdGlvbi5hZGRFdmVudFNvdXJjZShuZXcgUzNFdmVudFNvdXJjZShwcm9wcy5idWNrZXQsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50czogW3MzLkV2ZW50VHlwZS5PQkpFQ1RfQ1JFQVRFRF9QVVQsIHMzLkV2ZW50VHlwZS5PQkpFQ1RfQ1JFQVRFRF9DT1BZXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcnM6IFt7IHByZWZpeDogaXRlbSB9XVxuICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHByb3BzLmJ1Y2tldFN1ZmZpeCAhPSB1bmRlZmluZWQgJiYgcHJvcHMuYnVja2V0U3VmZml4Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpdGVtIG9mIHByb3BzLmJ1Y2tldFN1ZmZpeCkge1xuICAgICAgICAgICAgICAgICAgICBsYW1iZGFGdW5jdGlvbi5hZGRFdmVudFNvdXJjZShuZXcgUzNFdmVudFNvdXJjZShwcm9wcy5idWNrZXQsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50czogW3MzLkV2ZW50VHlwZS5PQkpFQ1RfQ1JFQVRFRF9QVVQsIHMzLkV2ZW50VHlwZS5PQkpFQ1RfQ1JFQVRFRF9DT1BZXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcnM6IFt7IHN1ZmZpeDogaXRlbSB9XVxuICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGxhbWJkYUZ1bmN0aW9uO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlUm9sZShyb2xlTmFtZTogc3RyaW5nLCBwb2xpY2llczogc3RyaW5nW10gfCBpYW0uUG9saWN5U3RhdGVtZW50W10pOiBpYW0uUm9sZSB7XG4gICAgICAgIGNvbnN0IHJvbGUgPSBuZXcgaWFtLlJvbGUodGhpcywgcm9sZU5hbWUsIHtcbiAgICAgICAgICAgIHJvbGVOYW1lOiByb2xlTmFtZSxcbiAgICAgICAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdsYW1iZGEuYW1hem9uYXdzLmNvbScpLFxuICAgICAgICB9KTtcblxuICAgICAgICByb2xlLmFkZE1hbmFnZWRQb2xpY3koeyBtYW5hZ2VkUG9saWN5QXJuOiAnYXJuOmF3czppYW06OmF3czpwb2xpY3kvc2VydmljZS1yb2xlL0FXU0xhbWJkYUJhc2ljRXhlY3V0aW9uUm9sZScgfSk7XG4gICAgICAgIGZvciAodmFyIGl0ZW0gb2YgcG9saWNpZXMpIHtcbiAgICAgICAgICAgIGlmIChpdGVtIGluc3RhbmNlb2YgaWFtLlBvbGljeVN0YXRlbWVudCkge1xuICAgICAgICAgICAgICAgIHJvbGUuYWRkVG9Qb2xpY3koaXRlbSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJvbGUuYWRkTWFuYWdlZFBvbGljeSh7IG1hbmFnZWRQb2xpY3lBcm46IGl0ZW0gfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcm9sZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGxvYWRMYXllcnMobGFtYmRhTmFtZTogc3RyaW5nLCBsYXllckFybnM6IHN0cmluZ1tdKTogYW55W10ge1xuICAgICAgICBsZXQgbGF5ZXJzID0gW107XG5cbiAgICAgICAgaWYgKGxheWVyQXJucyAhPSB1bmRlZmluZWQgJiYgbGF5ZXJBcm5zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGxldCBpbmRleCA9IDA7XG4gICAgICAgICAgICBmb3IgKGxldCBhcm4gb2YgbGF5ZXJBcm5zKSB7XG4gICAgICAgICAgICAgICAgaW5kZXgrKztcbiAgICAgICAgICAgICAgICBsYXllcnMucHVzaChsYW1iZGEuTGF5ZXJWZXJzaW9uLmZyb21MYXllclZlcnNpb25Bcm4odGhpcywgYCR7bGFtYmRhTmFtZX0tJHtpbmRleH0tbGF5ZXJgLCBhcm4pKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGxheWVycztcbiAgICB9XG59Il19