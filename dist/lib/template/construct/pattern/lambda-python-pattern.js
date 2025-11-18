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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFtYmRhLXB5dGhvbi1wYXR0ZXJuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vbGliL3RlbXBsYXRlL2NvbnN0cnVjdC9wYXR0ZXJuL2xhbWJkYS1weXRob24tcGF0dGVybi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsaURBQW1DO0FBRW5DLCtEQUFpRDtBQUNqRCx5REFBMkM7QUFDM0MsdURBQXlDO0FBQ3pDLG1GQUFxRTtBQUVyRSwyREFBNkU7QUFlN0UsTUFBYSxtQkFBb0IsU0FBUSw4QkFBYTtJQUlsRCxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQStCO1FBQ3JFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sVUFBVSxHQUFXLEdBQUcsS0FBSyxDQUFDLGFBQWEsSUFBSSxLQUFLLENBQUMsUUFBUSxTQUFTLENBQUM7UUFDN0UsTUFBTSxRQUFRLEdBQVcsR0FBRyxLQUFLLENBQUMsYUFBYSxJQUFJLEtBQUssQ0FBQyxRQUFRLGNBQWMsQ0FBQztRQUVoRixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM1RCxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNsRyxDQUFDO0lBRU8sWUFBWSxDQUFDLFVBQWtCLEVBQUUsVUFBa0IsRUFBRSxVQUFvQixFQUFFLEtBQStCO1FBQzlHLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxTQUFVLENBQUMsQ0FBQztRQUUzRCxN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RUFBRSxnQkFBZ0IsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO2FBQ3JEO1NBQ0o7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRU8sVUFBVSxDQUFDLFVBQWtCLEVBQUUsU0FBbUI7UUFDdEQsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBRWhCLElBQUksU0FBUyxJQUFJLFNBQVMsSUFBSSxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUNoRCxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7WUFDZCxLQUFLLElBQUksR0FBRyxJQUFJLFNBQVMsRUFBRTtnQkFDdkIsS0FBSyxFQUFFLENBQUM7Z0JBQ1IsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLG1CQUFtQixDQUFDLElBQUksRUFBRSxHQUFHLFVBQVUsSUFBSSxLQUFLLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFBO2FBQ2xHO1NBQ0o7UUFFRCxPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0NBQ0o7QUFsRkQsa0RBa0ZDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCBBbWF6b24uY29tLCBJbmMuIG9yIGl0cyBhZmZpbGlhdGVzLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVC0wXG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weSBvZiB0aGlzXG4gKiBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmVcbiAqIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSxcbiAqIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG9cbiAqIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzby5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SIElNUExJRUQsXG4gKiBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQVxuICogUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVFxuICogSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OXG4gKiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEVcbiAqIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICovXG5cbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtbGFtYmRhJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJztcbmltcG9ydCAqIGFzIHMzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMyc7XG5pbXBvcnQgeyBTM0V2ZW50U291cmNlIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWxhbWJkYS1ldmVudC1zb3VyY2VzJztcblxuaW1wb3J0IHsgQmFzZUNvbnN0cnVjdCwgQ29uc3RydWN0Q29tbW9uUHJvcHMgfSBmcm9tICcuLi9iYXNlL2Jhc2UtY29uc3RydWN0JztcblxuZXhwb3J0IGludGVyZmFjZSBMYW1iZGFTaW1wbGVQYXR0ZXJuUHJvcHMgZXh0ZW5kcyBDb25zdHJ1Y3RDb21tb25Qcm9wcyB7XG4gICAgYmFzZU5hbWU6IHN0cmluZztcbiAgICBsYW1iZGFQYXRoOiBzdHJpbmc7XG4gICAgcG9saWNpZXM6IHN0cmluZ1tdIHwgaWFtLlBvbGljeVN0YXRlbWVudFtdO1xuICAgIGhhbmRsZXI/OiBzdHJpbmc7XG4gICAgZW52aXJvbm1lbnRzPzogYW55O1xuICAgIHRpbWVvdXQ/OiBjZGsuRHVyYXRpb247XG4gICAgYnVja2V0PzogczMuQnVja2V0O1xuICAgIGxheWVyQXJucz86IHN0cmluZ1tdO1xuICAgIGJ1Y2tldFByZWZpeD86IHN0cmluZ1tdO1xuICAgIGJ1Y2tldFN1ZmZpeD86IHN0cmluZ1tdO1xufVxuXG5leHBvcnQgY2xhc3MgTGFtYmRhU2ltcGxlUGF0dGVybiBleHRlbmRzIEJhc2VDb25zdHJ1Y3Qge1xuICAgIHB1YmxpYyByZWFkb25seSBsYW1iZGFGdW5jdGlvbjogbGFtYmRhLkZ1bmN0aW9uO1xuICAgIHB1YmxpYyByZWFkb25seSBsYW1iZGFSb2xlOiBpYW0uUm9sZTtcblxuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBMYW1iZGFTaW1wbGVQYXR0ZXJuUHJvcHMpIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICAgICAgY29uc3QgbGFtYmRhTmFtZTogc3RyaW5nID0gYCR7cHJvcHMucHJvamVjdFByZWZpeH0tJHtwcm9wcy5iYXNlTmFtZX0tTGFtYmRhYDtcbiAgICAgICAgY29uc3Qgcm9sZU5hbWU6IHN0cmluZyA9IGAke3Byb3BzLnByb2plY3RQcmVmaXh9LSR7cHJvcHMuYmFzZU5hbWV9LUxhbWJkYS1Sb2xlYDtcblxuICAgICAgICB0aGlzLmxhbWJkYVJvbGUgPSB0aGlzLmNyZWF0ZVJvbGUocm9sZU5hbWUsIHByb3BzLnBvbGljaWVzKTtcbiAgICAgICAgdGhpcy5sYW1iZGFGdW5jdGlvbiA9IHRoaXMuY3JlYXRlTGFtYmRhKGxhbWJkYU5hbWUsIHByb3BzLmxhbWJkYVBhdGgsIHRoaXMubGFtYmRhUm9sZSwgcHJvcHMpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlTGFtYmRhKGxhbWJkYU5hbWU6IHN0cmluZywgbGFtYmRhUGF0aDogc3RyaW5nLCBsYW1iZGFSb2xlOiBpYW0uUm9sZSwgcHJvcHM6IExhbWJkYVNpbXBsZVBhdHRlcm5Qcm9wcyk6IGxhbWJkYS5GdW5jdGlvbiB7XG4gICAgICAgIHZhciBsYXllcnMgPSB0aGlzLmxvYWRMYXllcnMobGFtYmRhTmFtZSwgcHJvcHMubGF5ZXJBcm5zISk7XG5cbiAgICAgICAgY29uc3QgbGFtYmRhRnVuY3Rpb24gPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHRoaXMsIGxhbWJkYU5hbWUsIHtcbiAgICAgICAgICAgIGZ1bmN0aW9uTmFtZTogbGFtYmRhTmFtZSxcbiAgICAgICAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldChsYW1iZGFQYXRoKSxcbiAgICAgICAgICAgIGhhbmRsZXI6IHByb3BzLmhhbmRsZXIgIT0gdW5kZWZpbmVkID8gcHJvcHMuaGFuZGxlciA6ICdoYW5kbGVyLmhhbmRsZScsXG4gICAgICAgICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5QWVRIT05fM185LFxuICAgICAgICAgICAgdGltZW91dDogcHJvcHMudGltZW91dCAhPSB1bmRlZmluZWQgPyBwcm9wcy50aW1lb3V0IDogY2RrLkR1cmF0aW9uLnNlY29uZHMoNjAgKiAzKSxcbiAgICAgICAgICAgIHJvbGU6IGxhbWJkYVJvbGUsXG4gICAgICAgICAgICBlbnZpcm9ubWVudDogcHJvcHMuZW52aXJvbm1lbnRzLFxuICAgICAgICAgICAgbGF5ZXJzOiBsYXllcnMubGVuZ3RoID4gMCA/IGxheWVycyA6IHVuZGVmaW5lZCxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHByb3BzLmJ1Y2tldCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IGZpbHRlckxpc3Q6IGFueVtdID0gW107XG4gICAgICAgICAgICBpZiAocHJvcHMuYnVja2V0UHJlZml4ICE9IHVuZGVmaW5lZCAmJiBwcm9wcy5idWNrZXRQcmVmaXgubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGl0ZW0gb2YgcHJvcHMuYnVja2V0UHJlZml4KSB7XG4gICAgICAgICAgICAgICAgICAgIGxhbWJkYUZ1bmN0aW9uLmFkZEV2ZW50U291cmNlKG5ldyBTM0V2ZW50U291cmNlKHByb3BzLmJ1Y2tldCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRzOiBbczMuRXZlbnRUeXBlLk9CSkVDVF9DUkVBVEVEX1BVVCwgczMuRXZlbnRUeXBlLk9CSkVDVF9DUkVBVEVEX0NPUFldLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyczogW3sgcHJlZml4OiBpdGVtIH1dXG4gICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocHJvcHMuYnVja2V0U3VmZml4ICE9IHVuZGVmaW5lZCAmJiBwcm9wcy5idWNrZXRTdWZmaXgubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGl0ZW0gb2YgcHJvcHMuYnVja2V0U3VmZml4KSB7XG4gICAgICAgICAgICAgICAgICAgIGxhbWJkYUZ1bmN0aW9uLmFkZEV2ZW50U291cmNlKG5ldyBTM0V2ZW50U291cmNlKHByb3BzLmJ1Y2tldCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRzOiBbczMuRXZlbnRUeXBlLk9CSkVDVF9DUkVBVEVEX1BVVCwgczMuRXZlbnRUeXBlLk9CSkVDVF9DUkVBVEVEX0NPUFldLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyczogW3sgc3VmZml4OiBpdGVtIH1dXG4gICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbGFtYmRhRnVuY3Rpb247XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVSb2xlKHJvbGVOYW1lOiBzdHJpbmcsIHBvbGljaWVzOiBzdHJpbmdbXSB8IGlhbS5Qb2xpY3lTdGF0ZW1lbnRbXSk6IGlhbS5Sb2xlIHtcbiAgICAgICAgY29uc3Qgcm9sZSA9IG5ldyBpYW0uUm9sZSh0aGlzLCByb2xlTmFtZSwge1xuICAgICAgICAgICAgcm9sZU5hbWU6IHJvbGVOYW1lLFxuICAgICAgICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2xhbWJkYS5hbWF6b25hd3MuY29tJyksXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJvbGUuYWRkTWFuYWdlZFBvbGljeSh7IG1hbmFnZWRQb2xpY3lBcm46ICdhcm46YXdzOmlhbTo6YXdzOnBvbGljeS9zZXJ2aWNlLXJvbGUvQVdTTGFtYmRhQmFzaWNFeGVjdXRpb25Sb2xlJyB9KTtcbiAgICAgICAgZm9yICh2YXIgaXRlbSBvZiBwb2xpY2llcykge1xuICAgICAgICAgICAgaWYgKGl0ZW0gaW5zdGFuY2VvZiBpYW0uUG9saWN5U3RhdGVtZW50KSB7XG4gICAgICAgICAgICAgICAgcm9sZS5hZGRUb1BvbGljeShpdGVtKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcm9sZS5hZGRNYW5hZ2VkUG9saWN5KHsgbWFuYWdlZFBvbGljeUFybjogaXRlbSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByb2xlO1xuICAgIH1cblxuICAgIHByaXZhdGUgbG9hZExheWVycyhsYW1iZGFOYW1lOiBzdHJpbmcsIGxheWVyQXJuczogc3RyaW5nW10pOiBhbnlbXSB7XG4gICAgICAgIGxldCBsYXllcnMgPSBbXTtcblxuICAgICAgICBpZiAobGF5ZXJBcm5zICE9IHVuZGVmaW5lZCAmJiBsYXllckFybnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgbGV0IGluZGV4ID0gMDtcbiAgICAgICAgICAgIGZvciAobGV0IGFybiBvZiBsYXllckFybnMpIHtcbiAgICAgICAgICAgICAgICBpbmRleCsrO1xuICAgICAgICAgICAgICAgIGxheWVycy5wdXNoKGxhbWJkYS5MYXllclZlcnNpb24uZnJvbUxheWVyVmVyc2lvbkFybih0aGlzLCBgJHtsYW1iZGFOYW1lfS0ke2luZGV4fS1sYXllcmAsIGFybikpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbGF5ZXJzO1xuICAgIH1cbn0iXX0=