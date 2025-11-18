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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFtYmRhLXB5dGhvbi1wYXR0ZXJuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vbGliL3RlbXBsYXRlL2NvbnN0cnVjdC9wYXR0ZXJuL2xhbWJkYS1weXRob24tcGF0dGVybi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFSCxpREFBbUM7QUFFbkMsK0RBQWlEO0FBQ2pELHlEQUEyQztBQUMzQyx1REFBeUM7QUFDekMsbUZBQXFFO0FBRXJFLDJEQUE2RTtBQWU3RSxNQUFhLG1CQUFvQixTQUFRLDhCQUFhO0lBSWxELFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBK0I7UUFDckUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsTUFBTSxVQUFVLEdBQVcsR0FBRyxLQUFLLENBQUMsYUFBYSxJQUFJLEtBQUssQ0FBQyxRQUFRLFNBQVMsQ0FBQztRQUM3RSxNQUFNLFFBQVEsR0FBVyxHQUFHLEtBQUssQ0FBQyxhQUFhLElBQUksS0FBSyxDQUFDLFFBQVEsY0FBYyxDQUFDO1FBRWhGLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzVELElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ2xHLENBQUM7SUFFTyxZQUFZLENBQUMsVUFBa0IsRUFBRSxVQUFrQixFQUFFLFVBQW9CLEVBQUUsS0FBK0I7UUFDOUcsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLFNBQVUsQ0FBQyxDQUFDO1FBRTNELE1BQU0s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LGdCQUFnQixFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7YUFDckQ7U0FDSjtRQUVELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFTyxVQUFVLENBQUMsVUFBa0IsRUFBRSxTQUFtQjtRQUN0RCxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFFaEIsSUFBSSxTQUFTLElBQUksU0FBUyxJQUFJLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ2hELElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztZQUNkLEtBQUssSUFBSSxHQUFHLElBQUksU0FBUyxFQUFFO2dCQUN2QixLQUFLLEVBQUUsQ0FBQztnQkFDUixNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsbUJBQW1CLENBQUMsSUFBSSxFQUFFLEdBQUcsVUFBVSxJQUFJLEtBQUssUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUE7YUFDbEc7U0FDSjtRQUVELE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7Q0FDSjtBQWxGRCxrREFrRkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEFtYXpvbi5jb20sIEluYy4gb3IgaXRzIGFmZmlsaWF0ZXMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogTUlULTBcbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXNcbiAqIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZVxuICogd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LFxuICogbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0b1xuICogcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1IgSU1QTElFRCxcbiAqIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBXG4gKiBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUXG4gKiBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT05cbiAqIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRVxuICogU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4gKi9cblxuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ2F3cy1jZGstbGliL2F3cy1sYW1iZGEnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ2F3cy1jZGstbGliL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgczMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXMzJztcbmltcG9ydCB7IFMzRXZlbnRTb3VyY2UgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtbGFtYmRhLWV2ZW50LXNvdXJjZXMnO1xuXG5pbXBvcnQgeyBCYXNlQ29uc3RydWN0LCBDb25zdHJ1Y3RDb21tb25Qcm9wcyB9IGZyb20gJy4uL2Jhc2UvYmFzZS1jb25zdHJ1Y3QnO1xuXG5leHBvcnQgaW50ZXJmYWNlIExhbWJkYVNpbXBsZVBhdHRlcm5Qcm9wcyBleHRlbmRzIENvbnN0cnVjdENvbW1vblByb3BzIHtcbiAgICBiYXNlTmFtZTogc3RyaW5nO1xuICAgIGxhbWJkYVBhdGg6IHN0cmluZztcbiAgICBwb2xpY2llczogc3RyaW5nW10gfCBpYW0uUG9saWN5U3RhdGVtZW50W107XG4gICAgaGFuZGxlcj86IHN0cmluZztcbiAgICBlbnZpcm9ubWVudHM/OiBhbnk7XG4gICAgdGltZW91dD86IGNkay5EdXJhdGlvbjtcbiAgICBidWNrZXQ/OiBzMy5CdWNrZXQ7XG4gICAgbGF5ZXJBcm5zPzogc3RyaW5nW107XG4gICAgYnVja2V0UHJlZml4Pzogc3RyaW5nW107XG4gICAgYnVja2V0U3VmZml4Pzogc3RyaW5nW107XG59XG5cbmV4cG9ydCBjbGFzcyBMYW1iZGFTaW1wbGVQYXR0ZXJuIGV4dGVuZHMgQmFzZUNvbnN0cnVjdCB7XG4gICAgcHVibGljIHJlYWRvbmx5IGxhbWJkYUZ1bmN0aW9uOiBsYW1iZGEuRnVuY3Rpb247XG4gICAgcHVibGljIHJlYWRvbmx5IGxhbWJkYVJvbGU6IGlhbS5Sb2xlO1xuXG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IExhbWJkYVNpbXBsZVBhdHRlcm5Qcm9wcykge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgICAgICBjb25zdCBsYW1iZGFOYW1lOiBzdHJpbmcgPSBgJHtwcm9wcy5wcm9qZWN0UHJlZml4fS0ke3Byb3BzLmJhc2VOYW1lfS1MYW1iZGFgO1xuICAgICAgICBjb25zdCByb2xlTmFtZTogc3RyaW5nID0gYCR7cHJvcHMucHJvamVjdFByZWZpeH0tJHtwcm9wcy5iYXNlTmFtZX0tTGFtYmRhLVJvbGVgO1xuXG4gICAgICAgIHRoaXMubGFtYmRhUm9sZSA9IHRoaXMuY3JlYXRlUm9sZShyb2xlTmFtZSwgcHJvcHMucG9saWNpZXMpO1xuICAgICAgICB0aGlzLmxhbWJkYUZ1bmN0aW9uID0gdGhpcy5jcmVhdGVMYW1iZGEobGFtYmRhTmFtZSwgcHJvcHMubGFtYmRhUGF0aCwgdGhpcy5sYW1iZGFSb2xlLCBwcm9wcyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVMYW1iZGEobGFtYmRhTmFtZTogc3RyaW5nLCBsYW1iZGFQYXRoOiBzdHJpbmcsIGxhbWJkYVJvbGU6IGlhbS5Sb2xlLCBwcm9wczogTGFtYmRhU2ltcGxlUGF0dGVyblByb3BzKTogbGFtYmRhLkZ1bmN0aW9uIHtcbiAgICAgICAgdmFyIGxheWVycyA9IHRoaXMubG9hZExheWVycyhsYW1iZGFOYW1lLCBwcm9wcy5sYXllckFybnMhKTtcblxuICAgICAgICBjb25zdCBsYW1iZGFGdW5jdGlvbiA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgbGFtYmRhTmFtZSwge1xuICAgICAgICAgICAgZnVuY3Rpb25OYW1lOiBsYW1iZGFOYW1lLFxuICAgICAgICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0KGxhbWJkYVBhdGgpLFxuICAgICAgICAgICAgaGFuZGxlcjogcHJvcHMuaGFuZGxlciAhPSB1bmRlZmluZWQgPyBwcm9wcy5oYW5kbGVyIDogJ2hhbmRsZXIuaGFuZGxlJyxcbiAgICAgICAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLlBZVEhPTl8zXzksXG4gICAgICAgICAgICB0aW1lb3V0OiBwcm9wcy50aW1lb3V0ICE9IHVuZGVmaW5lZCA/IHByb3BzLnRpbWVvdXQgOiBjZGsuRHVyYXRpb24uc2Vjb25kcyg2MCAqIDMpLFxuICAgICAgICAgICAgcm9sZTogbGFtYmRhUm9sZSxcbiAgICAgICAgICAgIGVudmlyb25tZW50OiBwcm9wcy5lbnZpcm9ubWVudHMsXG4gICAgICAgICAgICBsYXllcnM6IGxheWVycy5sZW5ndGggPiAwID8gbGF5ZXJzIDogdW5kZWZpbmVkLFxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAocHJvcHMuYnVja2V0ICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uc3QgZmlsdGVyTGlzdDogYW55W10gPSBbXTtcbiAgICAgICAgICAgIGlmIChwcm9wcy5idWNrZXRQcmVmaXggIT0gdW5kZWZpbmVkICYmIHByb3BzLmJ1Y2tldFByZWZpeC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaXRlbSBvZiBwcm9wcy5idWNrZXRQcmVmaXgpIHtcbiAgICAgICAgICAgICAgICAgICAgbGFtYmRhRnVuY3Rpb24uYWRkRXZlbnRTb3VyY2UobmV3IFMzRXZlbnRTb3VyY2UocHJvcHMuYnVja2V0LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudHM6IFtzMy5FdmVudFR5cGUuT0JKRUNUX0NSRUFURURfUFVULCBzMy5FdmVudFR5cGUuT0JKRUNUX0NSRUFURURfQ09QWV0sXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJzOiBbeyBwcmVmaXg6IGl0ZW0gfV1cbiAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwcm9wcy5idWNrZXRTdWZmaXggIT0gdW5kZWZpbmVkICYmIHByb3BzLmJ1Y2tldFN1ZmZpeC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaXRlbSBvZiBwcm9wcy5idWNrZXRTdWZmaXgpIHtcbiAgICAgICAgICAgICAgICAgICAgbGFtYmRhRnVuY3Rpb24uYWRkRXZlbnRTb3VyY2UobmV3IFMzRXZlbnRTb3VyY2UocHJvcHMuYnVja2V0LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudHM6IFtzMy5FdmVudFR5cGUuT0JKRUNUX0NSRUFURURfUFVULCBzMy5FdmVudFR5cGUuT0JKRUNUX0NSRUFURURfQ09QWV0sXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJzOiBbeyBzdWZmaXg6IGl0ZW0gfV1cbiAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBsYW1iZGFGdW5jdGlvbjtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZVJvbGUocm9sZU5hbWU6IHN0cmluZywgcG9saWNpZXM6IHN0cmluZ1tdIHwgaWFtLlBvbGljeVN0YXRlbWVudFtdKTogaWFtLlJvbGUge1xuICAgICAgICBjb25zdCByb2xlID0gbmV3IGlhbS5Sb2xlKHRoaXMsIHJvbGVOYW1lLCB7XG4gICAgICAgICAgICByb2xlTmFtZTogcm9sZU5hbWUsXG4gICAgICAgICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnbGFtYmRhLmFtYXpvbmF3cy5jb20nKSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcm9sZS5hZGRNYW5hZ2VkUG9saWN5KHsgbWFuYWdlZFBvbGljeUFybjogJ2Fybjphd3M6aWFtOjphd3M6cG9saWN5L3NlcnZpY2Utcm9sZS9BV1NMYW1iZGFCYXNpY0V4ZWN1dGlvblJvbGUnIH0pO1xuICAgICAgICBmb3IgKHZhciBpdGVtIG9mIHBvbGljaWVzKSB7XG4gICAgICAgICAgICBpZiAoaXRlbSBpbnN0YW5jZW9mIGlhbS5Qb2xpY3lTdGF0ZW1lbnQpIHtcbiAgICAgICAgICAgICAgICByb2xlLmFkZFRvUG9saWN5KGl0ZW0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByb2xlLmFkZE1hbmFnZWRQb2xpY3koeyBtYW5hZ2VkUG9saWN5QXJuOiBpdGVtIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJvbGU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBsb2FkTGF5ZXJzKGxhbWJkYU5hbWU6IHN0cmluZywgbGF5ZXJBcm5zOiBzdHJpbmdbXSk6IGFueVtdIHtcbiAgICAgICAgbGV0IGxheWVycyA9IFtdO1xuXG4gICAgICAgIGlmIChsYXllckFybnMgIT0gdW5kZWZpbmVkICYmIGxheWVyQXJucy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBsZXQgaW5kZXggPSAwO1xuICAgICAgICAgICAgZm9yIChsZXQgYXJuIG9mIGxheWVyQXJucykge1xuICAgICAgICAgICAgICAgIGluZGV4Kys7XG4gICAgICAgICAgICAgICAgbGF5ZXJzLnB1c2gobGFtYmRhLkxheWVyVmVyc2lvbi5mcm9tTGF5ZXJWZXJzaW9uQXJuKHRoaXMsIGAke2xhbWJkYU5hbWV9LSR7aW5kZXh9LWxheWVyYCwgYXJuKSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBsYXllcnM7XG4gICAgfVxufSJdfQ==