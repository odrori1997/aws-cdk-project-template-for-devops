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
exports.PipelineSimplePattern = exports.ActionKind = void 0;
const cdk = __importStar(require("aws-cdk-lib"));
const codepipeline = __importStar(require("aws-cdk-lib/aws-codepipeline"));
const codepipeline_actions = __importStar(require("aws-cdk-lib/aws-codepipeline-actions"));
const codecommit = __importStar(require("aws-cdk-lib/aws-codecommit"));
const codebuild = __importStar(require("aws-cdk-lib/aws-codebuild"));
const iam = __importStar(require("aws-cdk-lib/aws-iam"));
const lambda = __importStar(require("aws-cdk-lib/aws-lambda"));
const targets = __importStar(require("aws-cdk-lib/aws-events-targets"));
const s3 = __importStar(require("aws-cdk-lib/aws-s3"));
const base_construct_1 = require("../base/base-construct");
const fs = require('fs');
const CDK_VER = '@2';
var ActionKindPrefix;
(function (ActionKindPrefix) {
    ActionKindPrefix["Source"] = "Source";
    ActionKindPrefix["Approve"] = "Approve";
    ActionKindPrefix["Build"] = "Build";
    // Deploy = 'Deploy' // not yet supported
})(ActionKindPrefix || (ActionKindPrefix = {}));
var ActionKind;
(function (ActionKind) {
    ActionKind["SourceCodeCommit"] = "SourceCodeCommit";
    ActionKind["SourceS3Bucket"] = "SourceS3Bucket";
    ActionKind["ApproveManual"] = "ApproveManual";
    ActionKind["BuildCodeBuild"] = "BuildCodeBuild";
    // DeployS3Bucket = 'DeployS3Bucket' // not yet supported
})(ActionKind = exports.ActionKind || (exports.ActionKind = {}));
class PipelineSimplePattern extends base_construct_1.BaseConstruct {
    constructor(scope, id, props) {
        super(scope, id, props);
        this.stageMap = new Map();
        const pipelineBaseName = props.pipelineName;
        const actionFlow = props.actionFlow;
        const configValid = this.validatePipelineConfig(pipelineBaseName, actionFlow);
        if (configValid) {
            this.codePipeline = new codepipeline.Pipeline(this, 'CICDPipeline', {
                pipelineName: `${this.projectPrefix}-${pipelineBaseName}`,
                enableKeyRotation: true
            });
            const buildPolicies = props.buildPolicies;
            for (const actionProps of actionFlow) {
                const actionKind = this.findEnumType(ActionKind, actionProps.Kind);
                if (actionProps.Enable) {
                    const success = this.registerAction(actionKind, actionProps, buildPolicies);
                    if (!success) {
                        break;
                    }
                }
            }
        }
        else {
            console.info("No source repository, or ActionFlow Config is wrong.");
            throw Error('PipelineConfig is wrong.');
        }
    }
    validatePipelineConfig(pipelineBaseName, actionFlow) {
        let valid = false;
        if (pipelineBaseName && pipelineBaseName.trim().length > 2) {
            if (actionFlow && actionFlow.length >= 2) {
                let haveSource = false;
                let haveOther = false;
                for (const [index, actionProps] of actionFlow.entries()) {
                    if (index == 0) {
                        const kind = this.findEnumType(ActionKind, actionProps.Kind);
                        if (actionProps.Enable && kind.startsWith(ActionKindPrefix.Source)) {
                            haveSource = true;
                        }
                    }
                    else {
                        if (actionProps.Enable) {
                            haveOther = true;
                            break;
                        }
                    }
                }
                if (haveSource && haveOther) {
                    valid = true;
                }
            }
        }
        return valid;
    }
    registerAction(actionKind, actionProps, buildPolicies) {
        let success = true;
        if (actionKind.startsWith(ActionKindPrefix.Source)) {
            if (actionKind == ActionKind.SourceCodeCommit) {
                const props = actionProps.Detail;
                const stage = this.addStage(actionProps.Stage);
                stage.addAction(this.createActionSourceCodeCommit(actionProps.Name, props, actionProps.Order));
            }
            else if (actionKind == ActionKind.SourceS3Bucket) {
                const props = actionProps.Detail;
                const stage = this.addStage(actionProps.Stage);
                stage.addAction(this.createActionSourceS3Bucket(actionProps.Name, props, actionProps.Order));
            }
            else {
                console.error('[ERROR] not supported SourceKind', actionProps.Kind);
                success = false;
            }
        }
        else if (actionKind.startsWith(ActionKindPrefix.Approve)) {
            if (actionKind == ActionKind.ApproveManual) {
                const props = actionProps.Detail;
                const stage = this.addStage(actionProps.Stage);
                stage.addAction(this.createActionApproveManual(actionProps.Name, props, actionProps.Order));
            }
            else {
                console.error('[ERROR] not supported ApproveKind', actionProps.Kind);
                success = false;
            }
        }
        else if (actionKind.startsWith(ActionKindPrefix.Build)) {
            if (actionKind == ActionKind.BuildCodeBuild) {
                const props = actionProps.Detail;
                const stage = this.addStage(actionProps.Stage);
                const action = this.createActionBuildCodeBuild(actionProps, props, buildPolicies);
                if (action) {
                    stage.addAction(action);
                    this.registerEventLambda(actionProps, action);
                }
                else {
                    console.error('[ERROR] fail to create build-action', actionProps.Name);
                    success = false;
                }
            }
            else {
                console.error('[ERROR] not supported BuildKind', actionProps.Kind);
                success = false;
            }
        }
        // } else if (actionType === ActionType.Deploy) {
        //     if (actionKind == ActionKind.DeployS3Bucket) {
        //         const props = actionProps.Detail as DeployKindS3BucketProps;
        //         const stage = this.addStage(actionProps.Stage);
        //         const action = this.createActionDeployS3Bucket(actionProps.Name, props, actionProps.Order);
        //         if (action) {
        //             stage.addAction(action);
        //             this.registerEventLambda(actionProps, action);
        //         } else {
        //             console.error('[ERROR] fail to create deploy-action', actionProps.Name);
        //             success = false;
        //         }
        //     } else {
        //         console.error('[ERROR] not supported DeployKind', actionProps.Kind);
        //         success = false;
        //     }
        // }
        return success;
    }
    addStage(stageName) {
        let stage = undefined;
        if (this.stageMap.has(stageName)) {
            stage = this.stageMap.get(stageName);
        }
        else {
            stage = this.codePipeline.addStage({ stageName: stageName });
            this.stageMap.set(stageName, stage);
        }
        return stage;
    }
    createActionSourceCodeCommit(actionName, props, runOrder) {
        const repo = codecommit.Repository.fromRepositoryName(this, 'CodeCommit-Repository', props.RepositoryName);
        this.sourceOutput = new codepipeline.Artifact('SourceOutput');
        const action = new codepipeline_actions.CodeCommitSourceAction({
            actionName: actionName,
            repository: repo,
            output: this.sourceOutput,
            branch: props.BranchName,
            codeBuildCloneOutput: true,
            runOrder: runOrder
        });
        return action;
    }
    createActionSourceS3Bucket(actionName, props, runOrder) {
        const bucket = s3.Bucket.fromBucketAttributes(this, `${actionName}SourceS3Bucket`, {
            bucketName: props.BucketName,
            account: props.Account,
            region: props.Region
        });
        this.sourceOutput = new codepipeline.Artifact('SourceOutput');
        const action = new codepipeline_actions.S3SourceAction({
            actionName: actionName,
            bucket,
            bucketKey: props.BucketKey,
            output: this.sourceOutput,
            runOrder: runOrder
        });
        return action;
    }
    createActionApproveManual(actionName, props, runOrder) {
        return new codepipeline_actions.ManualApprovalAction({
            actionName: actionName,
            additionalInformation: props.Description,
            runOrder: runOrder,
        });
    }
    createActionBuildCodeBuild(actionProps, buildProps, buildPolicies) {
        var _a;
        let appConfig = JSON.parse(fs.readFileSync(buildProps.AppConfigFile).toString());
        let buildSpec = undefined;
        const assumeRoleEnable = buildProps.BuildAssumeRoleArn ? true : false;
        if (buildProps.BuildCommands && buildProps.BuildCommands.length > 0) {
            buildSpec = this.createBuildSpecUsingCommands(buildProps.BuildCommands, assumeRoleEnable);
        }
        else if (buildProps.BuildDeployStacks && buildProps.BuildDeployStacks.StackNameList.length > 0) {
            buildSpec = this.createBuildSpecUsingStackName(buildProps.BuildDeployStacks, assumeRoleEnable);
        }
        else if (buildProps.BuildSpecFile && buildProps.BuildSpecFile.length > 3) {
            buildSpec = codebuild.BuildSpec.fromSourceFilename(buildProps.BuildSpecFile);
        }
        else {
            console.error('[ERROR] not supported CodeBuild - BuildSpecType');
        }
        let buildAction = undefined;
        if (buildSpec) {
            let project = new codebuild.PipelineProject(this, `${actionProps.Stage}-${actionProps.Name}-Project`, {
                environment: {
                    buildImage: codebuild.LinuxBuildImage.STANDARD_5_0,
                    computeType: codebuild.ComputeType.MEDIUM,
                    privileged: true,
                },
                environmentVariables: {
                    ACCOUNT: { value: `${appConfig.Project.Account}` },
                    REGION: { value: `${appConfig.Project.Region}` },
                    PROJECT_NAME: { value: `${appConfig.Project.Name}` },
                    PROJECT_STAGE: { value: `${appConfig.Project.Stage}` },
                    PROJECT_PREFIX: { value: `${this.projectPrefix}` },
                    APP_CONFIG: { value: buildProps.AppConfigFile },
                    ASSUME_ROLE_ARN: { value: buildProps.BuildAssumeRoleArn ? buildProps.BuildAssumeRoleArn : '' },
                    ON_PIPELINE: { value: 'YES' }
                },
                buildSpec: buildSpec,
                timeout: cdk.Duration.minutes(60)
            });
            project.addToRolePolicy(this.getDeployCommonPolicy());
            if (buildPolicies) {
                buildPolicies.forEach(policy => project.addToRolePolicy(policy));
            }
            else {
                (_a = project.role) === null || _a === void 0 ? void 0 : _a.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess'));
            }
            // this.buildOutput = new codepipeline.Artifact(`${actionProps.Name}BuildOutput`);
            buildAction = new codepipeline_actions.CodeBuildAction({
                actionName: actionProps.Name,
                project,
                input: this.sourceOutput,
                // outputs: [this.buildOutput],
                runOrder: actionProps.Order
            });
        }
        return buildAction;
    }
    createBuildSpecUsingCommands(buildCommands, assumeRoleEnable) {
        const buildSpec = codebuild.BuildSpec.fromObject({
            version: "0.2",
            phases: {
                install: {
                    // https://docs.aws.amazon.com/codebuild/latest/userguide/runtime-versions.html
                    'runtime-versions': {
                        nodejs: 14
                    },
                    commands: this.createInstallCommands(assumeRoleEnable, false)
                },
                pre_build: {
                    commands: [
                        'pwd',
                        'ls -l'
                    ]
                },
                build: {
                    commands: buildCommands
                },
                post_build: {
                    commands: [
                        'pwd',
                        'ls -l'
                    ]
                }
            },
            artifacts: {
                files: [
                    '**/*'
                ],
                'exclude-paths': [
                    'cdk.out/',
                    'node_modules/',
                    '.git/'
                ]
            }
        });
        return buildSpec;
    }
    // https://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html
    createBuildSpecUsingStackName(props, assumeRoleEnable) {
        const cdkDeployStacksCommands = props.StackNameList.map(stackName => {
            const args = stackName.trim().split(' ');
            const pureStackName = args[0];
            args[0] = `cdk deploy *${pureStackName}* --require-approval never`;
            return args.join(' ');
        });
        const buildSpec = codebuild.BuildSpec.fromObject({
            version: "0.2",
            phases: {
                install: {
                    'runtime-versions': {
                        nodejs: 14
                    },
                    commands: this.createInstallCommands(assumeRoleEnable, true)
                },
                pre_build: {
                    commands: props.PreCommands
                },
                build: {
                    commands: cdkDeployStacksCommands
                },
                post_build: {
                    commands: props.PostCommands
                }
            },
            artifacts: {
                files: [
                    '**/*'
                ],
                'exclude-paths': [
                    'cdk.out/',
                    'node_modules/',
                    '.git/'
                ]
            }
        });
        return buildSpec;
    }
    createActionDeployS3Bucket(actionName, props, runOrder) {
        const bucket = s3.Bucket.fromBucketAttributes(this, `${actionName}DeployS3Bucket`, {
            bucketName: props.BucketName,
            account: props.Account,
            region: props.Region
        });
        const action = new codepipeline_actions.S3DeployAction({
            actionName: actionName,
            input: this.buildOutput,
            bucket
        });
        return action;
    }
    createInstallCommands(assumeRoleEnable, setupEnable) {
        let commands = [];
        const assumeRoleCommands = [
            'creds=$(mktemp -d)/creds.json',
            'aws sts assume-role --role-arn $ASSUME_ROLE_ARN --role-session-name assume_role > $creds',
            `export AWS_ACCESS_KEY_ID=$(cat $creds | grep "AccessKeyId" | cut -d '"' -f 4)`,
            `export AWS_SECRET_ACCESS_KEY=$(cat $creds | grep "SecretAccessKey" | cut -d '"' -f 4)`,
            `export AWS_SESSION_TOKEN=$(cat $creds | grep "SessionToken" | cut -d '"' -f 4)`,
        ];
        const setupInstallCommands = [
            `npm install -g aws-cdk${CDK_VER}`,
            'npm install'
        ];
        if (assumeRoleEnable) {
            commands = commands.concat(assumeRoleCommands);
        }
        if (setupEnable) {
            commands = commands.concat(setupInstallCommands);
        }
        return commands;
    }
    getDeployCommonPolicy() {
        const statement = new iam.PolicyStatement();
        statement.addActions("cloudformation:*", "lambda:*", "s3:*", "ssm:*", "iam:PassRole", "kms:*", "events:*", "sts:AssumeRole");
        statement.addResources("*");
        return statement;
    }
    registerEventLambda(actionProps, action) {
        if (actionProps.EventStateLambda
            && actionProps.EventStateLambda.CodePath && actionProps.EventStateLambda.CodePath.length > 0
            && actionProps.EventStateLambda.Handler && actionProps.EventStateLambda.Handler.length > 0) {
            action === null || action === void 0 ? void 0 : action.onStateChange(`${actionProps.Stage}-${actionProps.Name}-EventState`, new targets.LambdaFunction(this.createEventStateLambda(`${actionProps.Stage}-${actionProps.Name}-EventStateLambda`, actionProps.EventStateLambda)));
        }
    }
    createEventStateLambda(baseName, props) {
        const func = new lambda.Function(this, baseName, {
            functionName: `${this.projectPrefix}-${baseName}`,
            runtime: new lambda.Runtime(props.Runtime),
            code: lambda.Code.fromAsset(props.CodePath),
            handler: props.Handler
        });
        return func;
    }
}
exports.PipelineSimplePattern = PipelineSimplePattern;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlwZWxpbmUtc2ltcGxlLXBhdHRlcm4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwaXBlbGluZS1zaW1wbGUtcGF0dGVybi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFSCxpREFBbUM7QUFFbkMsMkVBQTZEO0FBQzdELDJGQUE2RTtBQUM3RSx1RUFBeUQ7QUFDekQscUVBQXVEO0FBQ3ZELHlEQUEyQztBQUMzQywrREFBaUQ7QUFDakQsd0VBQTBEO0FBQzFELHVEQUF5QztBQUV6QywyREFBNkU7QUFHN0UsTUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBRXpCLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQztBQWVyQixJQUFLLGdCQUtKO0FBTEQsV0FBSyxnQkFBZ0I7SUFDakIscUNBQWlCLENBQUE7SUFDakIsdUNBQW1CLENBQUE7SUFDbkIsbUNBQWUsQ0FBQTtJQUNmLHlDQUF5QztBQUM3QyxDQUFDLEVBTEksZ0JBQWdCLEtBQWhCLGdCQUFnQixRQUtwQjtBQUVELElBQVksVUFNWDtBQU5ELFdBQVksVUFBVTtJQUNsQixtREFBcUMsQ0FBQTtJQUNyQywrQ0FBaUMsQ0FBQTtJQUNqQyw2Q0FBK0IsQ0FBQTtJQUMvQiwrQ0FBaUMsQ0FBQTtJQUNqQyx5REFBeUQ7QUFDN0QsQ0FBQyxFQU5XLFVBQVUsR0FBVixrQkFBVSxLQUFWLGtCQUFVLFFBTXJCO0FBaURELE1BQWEscUJBQXNCLFNBQVEsOEJBQWE7SUFPcEQsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFpQztRQUN2RSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUhwQixhQUFRLEdBQXFDLElBQUksR0FBRyxFQUFFLENBQUM7UUFLM0QsTUFBTSxnQkFBZ0IsR0FBVyxLQUFLLENBQUMsWUFBWSxDQUFDO1FBQ3BELE1BQU0sVUFB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O2VBQ3pCLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLElBQUksV0FBVyxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQztlQUN6RixXQUFXLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxJQUFJLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUU1RixNQUFNLGFBQU4sTUFBTSx1QkFBTixNQUFNLENBQUUsYUFBYSxDQUNqQixHQUFHLFdBQVcsQ0FBQyxLQUFLLElBQUksV0FBVyxDQUFDLElBQUksYUFBYSxFQUNyRCxJQUFJLE9BQU8sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLEdBQUcsV0FBVyxDQUFDLEtBQUssSUFBSSxXQUFXLENBQUMsSUFBSSxtQkFBbUIsRUFDOUcsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUMsRUFBRTtTQUMzQztJQUNMLENBQUM7SUFFTyxzQkFBc0IsQ0FBQyxRQUFnQixFQUFFLEtBQTRCO1FBQ3pFLE1BQU0sSUFBSSxHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFO1lBQzdDLFlBQVksRUFBRSxHQUFHLElBQUksQ0FBQyxhQUFhLElBQUksUUFBUSxFQUFFO1lBQ2pELE9BQU8sRUFBRSxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQztZQUMxQyxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQztZQUMzQyxPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQU87U0FDekIsQ0FBQyxDQUFBO1FBRUYsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztDQUNKO0FBcmFELHNEQXFhQyIsInNvdXJjZXNDb250ZW50IjpbIlxuLypcbiAqIENvcHlyaWdodCBBbWF6b24uY29tLCBJbmMuIG9yIGl0cyBhZmZpbGlhdGVzLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVC0wXG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weSBvZiB0aGlzXG4gKiBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmVcbiAqIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSxcbiAqIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG9cbiAqIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzby5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SIElNUExJRUQsXG4gKiBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQVxuICogUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVFxuICogSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OXG4gKiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEVcbiAqIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICovXG5cbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIGNvZGVwaXBlbGluZSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY29kZXBpcGVsaW5lJztcbmltcG9ydCAqIGFzIGNvZGVwaXBlbGluZV9hY3Rpb25zIGZyb20gJ2F3cy1jZGstbGliL2F3cy1jb2RlcGlwZWxpbmUtYWN0aW9ucyc7XG5pbXBvcnQgKiBhcyBjb2RlY29tbWl0IGZyb20gJ2F3cy1jZGstbGliL2F3cy1jb2RlY29tbWl0JztcbmltcG9ydCAqIGFzIGNvZGVidWlsZCBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY29kZWJ1aWxkJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtbGFtYmRhJztcbmltcG9ydCAqIGFzIHRhcmdldHMgZnJvbSAnYXdzLWNkay1saWIvYXdzLWV2ZW50cy10YXJnZXRzJztcbmltcG9ydCAqIGFzIHMzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMyc7XG5cbmltcG9ydCB7IEJhc2VDb25zdHJ1Y3QsIENvbnN0cnVjdENvbW1vblByb3BzIH0gZnJvbSAnLi4vYmFzZS9iYXNlLWNvbnN0cnVjdCc7XG5pbXBvcnQgeyBBcHBDb25maWcgfSBmcm9tICcuLi8uLi9hcHAtY29uZmlnJztcblxuY29uc3QgZnMgPSByZXF1aXJlKCdmcycpO1xuXG5jb25zdCBDREtfVkVSID0gJ0AyJztcblxuZXhwb3J0IGludGVyZmFjZSBQaXBlbGluZVNpbXBsZVBhdHRlcm5Qcm9wcyBleHRlbmRzIENvbnN0cnVjdENvbW1vblByb3BzIHtcbiAgICBwaXBlbGluZU5hbWU6IHN0cmluZztcbiAgICBhY3Rpb25GbG93OiBBY3Rpb25Qcm9wc1tdO1xuICAgIGJ1aWxkUG9saWNpZXM/OiBpYW0uUG9saWN5U3RhdGVtZW50W107XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRXZlbnRTdGF0ZUxhbWJkYVByb3BzIHtcbiAgICBGdW5jdGlvbk5hbWU/OiBzdHJpbmc7XG4gICAgQ29kZVBhdGg6IHN0cmluZztcbiAgICBSdW50aW1lOiBzdHJpbmcsXG4gICAgSGFuZGxlcjogc3RyaW5nO1xufVxuXG5lbnVtIEFjdGlvbktpbmRQcmVmaXgge1xuICAgIFNvdXJjZSA9ICdTb3VyY2UnLFxuICAgIEFwcHJvdmUgPSAnQXBwcm92ZScsXG4gICAgQnVpbGQgPSAnQnVpbGQnLFxuICAgIC8vIERlcGxveSA9ICdEZXBsb3knIC8vIG5vdCB5ZXQgc3VwcG9ydGVkXG59XG5cbmV4cG9ydCBlbnVtIEFjdGlvbktpbmQge1xuICAgIFNvdXJjZUNvZGVDb21taXQgPSAnU291cmNlQ29kZUNvbW1pdCcsXG4gICAgU291cmNlUzNCdWNrZXQgPSAnU291cmNlUzNCdWNrZXQnLFxuICAgIEFwcHJvdmVNYW51YWwgPSAnQXBwcm92ZU1hbnVhbCcsXG4gICAgQnVpbGRDb2RlQnVpbGQgPSAnQnVpbGRDb2RlQnVpbGQnLFxuICAgIC8vIERlcGxveVMzQnVja2V0ID0gJ0RlcGxveVMzQnVja2V0JyAvLyBub3QgeWV0IHN1cHBvcnRlZFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEFjdGlvblByb3BzIHtcbiAgICBOYW1lOiBzdHJpbmc7XG4gICAgS2luZDogQWN0aW9uS2luZDtcbiAgICBTdGFnZTogc3RyaW5nO1xuICAgIEVuYWJsZTogYm9vbGVhbjtcbiAgICBPcmRlcj86IG51bWJlcjtcbiAgICBFdmVudFN0YXRlTGFtYmRhPzogRXZlbnRTdGF0ZUxhbWJkYVByb3BzO1xuICAgIERldGFpbDogU291cmNlS2luZENvZGVDb21taXRQcm9wcyB8IEFwcHJvdmVLaW5kTWFudWFsUHJvcHMgfCBCdWlsZEtpbmRDb2RlQnVpbGRQcm9wcyB8IERlcGxveUtpbmRTM0J1Y2tldFByb3BzO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFNvdXJjZUtpbmRDb2RlQ29tbWl0UHJvcHMge1xuICAgIFJlcG9zaXRvcnlOYW1lOiBzdHJpbmc7XG4gICAgQnJhbmNoTmFtZTogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFNvdXJjZUtpbmRTM0J1Y2tldFByb3BzIHtcbiAgICBCdWNrZXROYW1lOiBzdHJpbmc7XG4gICAgQnVja2V0S2V5OiBzdHJpbmc7XG4gICAgQWNjb3VudD86IHN0cmluZztcbiAgICBSZWdpb24/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQXBwcm92ZUtpbmRNYW51YWxQcm9wcyB7XG4gICAgRGVzY3JpcHRpb24/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQnVpbGREZXBsb3lTdGFja3NQcm9wcyB7XG4gICAgUHJlQ29tbWFuZHM/OiBzdHJpbmdbXTtcbiAgICBTdGFja05hbWVMaXN0OiBzdHJpbmdbXTtcbiAgICBQb3N0Q29tbWFuZHM/OiBzdHJpbmdbXTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBCdWlsZEtpbmRDb2RlQnVpbGRQcm9wcyB7XG4gICAgQXBwQ29uZmlnRmlsZTogc3RyaW5nO1xuICAgIEJ1aWxkQ29tbWFuZHM/OiBzdHJpbmdbXTtcbiAgICBCdWlsZFNwZWNGaWxlPzogc3RyaW5nO1xuICAgIEJ1aWxkQXNzdW1lUm9sZUFybj86IHN0cmluZztcbiAgICBCdWlsZERlcGxveVN0YWNrcz86IEJ1aWxkRGVwbG95U3RhY2tzUHJvcHM7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRGVwbG95S2luZFMzQnVja2V0UHJvcHMge1xuICAgIEJ1Y2tldE5hbWU6IHN0cmluZztcbiAgICBBY2NvdW50Pzogc3RyaW5nO1xuICAgIFJlZ2lvbj86IHN0cmluZztcbn1cblxuXG5leHBvcnQgY2xhc3MgUGlwZWxpbmVTaW1wbGVQYXR0ZXJuIGV4dGVuZHMgQmFzZUNvbnN0cnVjdCB7XG4gICAgcHVibGljIGNvZGVQaXBlbGluZTogY29kZXBpcGVsaW5lLlBpcGVsaW5lO1xuXG4gICAgcHJpdmF0ZSBzb3VyY2VPdXRwdXQ6IGNvZGVwaXBlbGluZS5BcnRpZmFjdDtcbiAgICBwcml2YXRlIGJ1aWxkT3V0cHV0OiBjb2RlcGlwZWxpbmUuQXJ0aWZhY3Q7XG4gICAgcHJpdmF0ZSBzdGFnZU1hcDogTWFwPHN0cmluZywgY29kZXBpcGVsaW5lLklTdGFnZT4gPSBuZXcgTWFwKCk7XG5cbiAgICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogUGlwZWxpbmVTaW1wbGVQYXR0ZXJuUHJvcHMpIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICAgICAgY29uc3QgcGlwZWxpbmVCYXNlTmFtZTogc3RyaW5nID0gcHJvcHMucGlwZWxpbmVOYW1lO1xuICAgICAgICBjb25zdCBhY3Rpb25GbG93OiBBY3Rpb25Qcm9wc1tdID0gcHJvcHMuYWN0aW9uRmxvdztcbiAgICAgICAgY29uc3QgY29uZmlnVmFsaWQgPSB0aGlzLnZhbGlkYXRlUGlwZWxpbmVDb25maWcocGlwZWxpbmVCYXNlTmFtZSwgYWN0aW9uRmxvdyk7XG5cbiAgICAgICAgaWYgKGNvbmZpZ1ZhbGlkKSB7XG4gICAgICAgICAgICB0aGlzLmNvZGVQaXBlbGluZSA9IG5ldyBjb2RlcGlwZWxpbmUuUGlwZWxpbmUodGhpcywgJ0NJQ0RQaXBlbGluZScsIHtcbiAgICAgICAgICAgICAgICBwaXBlbGluZU5hbWU6IGAke3RoaXMucHJvamVjdFByZWZpeH0tJHtwaXBlbGluZUJhc2VOYW1lfWAsXG4gICAgICAgICAgICAgICAgZW5hYmxlS2V5Um90YXRpb246IHRydWVcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb25zdCBidWlsZFBvbGljaWVzOiBpYW0uUG9saWN5U3RhdGVtZW50W10gfCB1bmRlZmluZWQgPSBwcm9wcy5idWlsZFBvbGljaWVzO1xuICAgICAgICAgICAgZm9yIChjb25zdCBhY3Rpb25Qcm9wcyBvZiBhY3Rpb25GbG93KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYWN0aW9uS2luZDogQWN0aW9uS2luZCA9IHRoaXMuZmluZEVudW1UeXBlKEFjdGlvbktpbmQsIGFjdGlvblByb3BzLktpbmQpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGFjdGlvblByb3BzLkVuYWJsZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzdWNjZXNzID0gdGhpcy5yZWdpc3RlckFjdGlvbihhY3Rpb25LaW5kLCBhY3Rpb25Qcm9wcywgYnVpbGRQb2xpY2llcyk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbyhcIk5vIHNvdXJjZSByZXBvc2l0b3J5LCBvciBBY3Rpb25GbG93IENvbmZpZyBpcyB3cm9uZy5cIik7XG4gICAgICAgICAgICB0aHJvdyBFcnJvcignUGlwZWxpbmVDb25maWcgaXMgd3JvbmcuJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHZhbGlkYXRlUGlwZWxpbmVDb25maWcocGlwZWxpbmVCYXNlTmFtZTogc3RyaW5nLCBhY3Rpb25GbG93OiBBY3Rpb25Qcm9wc1tdKTogYm9vbGVhbiB7XG4gICAgICAgIGxldCB2YWxpZCA9IGZhbHNlO1xuXG4gICAgICAgIGlmIChwaXBlbGluZUJhc2VOYW1lICYmIHBpcGVsaW5lQmFzZU5hbWUudHJpbSgpLmxlbmd0aCA+IDIpIHtcbiAgICAgICAgICAgIGlmIChhY3Rpb25GbG93ICYmIGFjdGlvbkZsb3cubGVuZ3RoID49IDIpIHtcbiAgICAgICAgICAgICAgICBsZXQgaGF2ZVNvdXJjZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGxldCBoYXZlT3RoZXIgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgW2luZGV4LCBhY3Rpb25Qcm9wc10gb2YgYWN0aW9uRmxvdy5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGtpbmQgPSB0aGlzLmZpbmRFbnVtVHlwZShBY3Rpb25LaW5kLCBhY3Rpb25Qcm9wcy5LaW5kKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhY3Rpb25Qcm9wcy5FbmFibGUgJiYga2luZC5zdGFydHNXaXRoKEFjdGlvbktpbmRQcmVmaXguU291cmNlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhdmVTb3VyY2UgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFjdGlvblByb3BzLkVuYWJsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhdmVPdGhlciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoaGF2ZVNvdXJjZSAmJiBoYXZlT3RoZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsaWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB2YWxpZDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlZ2lzdGVyQWN0aW9uKGFjdGlvbktpbmQ6IEFjdGlvbktpbmQsIGFjdGlvblByb3BzOiBBY3Rpb25Qcm9wcywgYnVpbGRQb2xpY2llcz86IGlhbS5Qb2xpY3lTdGF0ZW1lbnRbXSk6IGJvb2xlYW4ge1xuICAgICAgICBsZXQgc3VjY2VzcyA9IHRydWU7XG5cbiAgICAgICAgaWYgKGFjdGlvbktpbmQuc3RhcnRzV2l0aChBY3Rpb25LaW5kUHJlZml4LlNvdXJjZSkpIHtcbiAgICAgICAgICAgIGlmIChhY3Rpb25LaW5kID09IEFjdGlvbktpbmQuU291cmNlQ29kZUNvbW1pdCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHByb3BzID0gYWN0aW9uUHJvcHMuRGV0YWlsIGFzIFNvdXJjZUtpbmRDb2RlQ29tbWl0UHJvcHM7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3RhZ2UgPSB0aGlzLmFkZFN0YWdlKGFjdGlvblByb3BzLlN0YWdlKTtcblxuICAgICAgICAgICAgICAgIHN0YWdlLmFkZEFjdGlvbih0aGlzLmNyZWF0ZUFjdGlvblNvdXJjZUNvZGVDb21taXQoYWN0aW9uUHJvcHMuTmFtZSwgcHJvcHMsIGFjdGlvblByb3BzLk9yZGVyKSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFjdGlvbktpbmQgPT0gQWN0aW9uS2luZC5Tb3VyY2VTM0J1Y2tldCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHByb3BzID0gYWN0aW9uUHJvcHMuRGV0YWlsIGFzIFNvdXJjZUtpbmRTM0J1Y2tldFByb3BzO1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0YWdlID0gdGhpcy5hZGRTdGFnZShhY3Rpb25Qcm9wcy5TdGFnZSk7XG5cbiAgICAgICAgICAgICAgICBzdGFnZS5hZGRBY3Rpb24odGhpcy5jcmVhdGVBY3Rpb25Tb3VyY2VTM0J1Y2tldChhY3Rpb25Qcm9wcy5OYW1lLCBwcm9wcywgYWN0aW9uUHJvcHMuT3JkZXIpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignW0VSUk9SXSBub3Qgc3VwcG9ydGVkIFNvdXJjZUtpbmQnLCBhY3Rpb25Qcm9wcy5LaW5kKTtcbiAgICAgICAgICAgICAgICBzdWNjZXNzID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoYWN0aW9uS2luZC5zdGFydHNXaXRoKEFjdGlvbktpbmRQcmVmaXguQXBwcm92ZSkpIHtcbiAgICAgICAgICAgIGlmIChhY3Rpb25LaW5kID09IEFjdGlvbktpbmQuQXBwcm92ZU1hbnVhbCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHByb3BzID0gYWN0aW9uUHJvcHMuRGV0YWlsIGFzIEFwcHJvdmVLaW5kTWFudWFsUHJvcHM7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3RhZ2UgPSB0aGlzLmFkZFN0YWdlKGFjdGlvblByb3BzLlN0YWdlKTtcblxuICAgICAgICAgICAgICAgIHN0YWdlLmFkZEFjdGlvbih0aGlzLmNyZWF0ZUFjdGlvbkFwcHJvdmVNYW51YWwoYWN0aW9uUHJvcHMuTmFtZSwgcHJvcHMsIGFjdGlvblByb3BzLk9yZGVyKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1tFUlJPUl0gbm90IHN1cHBvcnRlZCBBcHByb3ZlS2luZCcsIGFjdGlvblByb3BzLktpbmQpO1xuICAgICAgICAgICAgICAgIHN1Y2Nlc3MgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChhY3Rpb25LaW5kLnN0YXJ0c1dpdGgoQWN0aW9uS2luZFByZWZpeC5CdWlsZCkpIHtcbiAgICAgICAgICAgIGlmIChhY3Rpb25LaW5kID09IEFjdGlvbktpbmQuQnVpbGRDb2RlQnVpbGQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwcm9wcyA9IGFjdGlvblByb3BzLkRldGFpbCBhcyBCdWlsZEtpbmRDb2RlQnVpbGRQcm9wcztcbiAgICAgICAgICAgICAgICBjb25zdCBzdGFnZSA9IHRoaXMuYWRkU3RhZ2UoYWN0aW9uUHJvcHMuU3RhZ2UpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGFjdGlvbiA9IHRoaXMuY3JlYXRlQWN0aW9uQnVpbGRDb2RlQnVpbGQoYWN0aW9uUHJvcHMsIHByb3BzLCBidWlsZFBvbGljaWVzKTtcblxuICAgICAgICAgICAgICAgIGlmIChhY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhZ2UuYWRkQWN0aW9uKGFjdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJFdmVudExhbWJkYShhY3Rpb25Qcm9wcywgYWN0aW9uKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdbRVJST1JdIGZhaWwgdG8gY3JlYXRlIGJ1aWxkLWFjdGlvbicsIGFjdGlvblByb3BzLk5hbWUpO1xuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdbRVJST1JdIG5vdCBzdXBwb3J0ZWQgQnVpbGRLaW5kJywgYWN0aW9uUHJvcHMuS2luZCk7XG4gICAgICAgICAgICAgICAgc3VjY2VzcyA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIH0gZWxzZSBpZiAoYWN0aW9uVHlwZSA9PT0gQWN0aW9uVHlwZS5EZXBsb3kpIHtcbiAgICAgICAgLy8gICAgIGlmIChhY3Rpb25LaW5kID09IEFjdGlvbktpbmQuRGVwbG95UzNCdWNrZXQpIHtcbiAgICAgICAgLy8gICAgICAgICBjb25zdCBwcm9wcyA9IGFjdGlvblByb3BzLkRldGFpbCBhcyBEZXBsb3lLaW5kUzNCdWNrZXRQcm9wcztcbiAgICAgICAgLy8gICAgICAgICBjb25zdCBzdGFnZSA9IHRoaXMuYWRkU3RhZ2UoYWN0aW9uUHJvcHMuU3RhZ2UpO1xuICAgICAgICAvLyAgICAgICAgIGNvbnN0IGFjdGlvbiA9IHRoaXMuY3JlYXRlQWN0aW9uRGVwbG95UzNCdWNrZXQoYWN0aW9uUHJvcHMuTmFtZSwgcHJvcHMsIGFjdGlvblByb3BzLk9yZGVyKTtcblxuICAgICAgICAvLyAgICAgICAgIGlmIChhY3Rpb24pIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgc3RhZ2UuYWRkQWN0aW9uKGFjdGlvbik7XG4gICAgICAgIC8vICAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJFdmVudExhbWJkYShhY3Rpb25Qcm9wcywgYWN0aW9uKTtcbiAgICAgICAgLy8gICAgICAgICB9IGVsc2Uge1xuICAgICAgICAvLyAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdbRVJST1JdIGZhaWwgdG8gY3JlYXRlIGRlcGxveS1hY3Rpb24nLCBhY3Rpb25Qcm9wcy5OYW1lKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgc3VjY2VzcyA9IGZhbHNlO1xuICAgICAgICAvLyAgICAgICAgIH1cbiAgICAgICAgLy8gICAgIH0gZWxzZSB7XG4gICAgICAgIC8vICAgICAgICAgY29uc29sZS5lcnJvcignW0VSUk9SXSBub3Qgc3VwcG9ydGVkIERlcGxveUtpbmQnLCBhY3Rpb25Qcm9wcy5LaW5kKTtcbiAgICAgICAgLy8gICAgICAgICBzdWNjZXNzID0gZmFsc2U7XG4gICAgICAgIC8vICAgICB9XG4gICAgICAgIC8vIH1cblxuICAgICAgICByZXR1cm4gc3VjY2VzcztcbiAgICB9XG5cbiAgICBwcml2YXRlIGFkZFN0YWdlKHN0YWdlTmFtZTogc3RyaW5nKTogY29kZXBpcGVsaW5lLklTdGFnZSB7XG4gICAgICAgIGxldCBzdGFnZSA9IHVuZGVmaW5lZDtcblxuICAgICAgICBpZiAodGhpcy5zdGFnZU1hcC5oYXMoc3RhZ2VOYW1lKSkge1xuICAgICAgICAgICAgc3RhZ2UgPSB0aGlzLnN0YWdlTWFwLmdldChzdGFnZU5hbWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RhZ2UgPSB0aGlzLmNvZGVQaXBlbGluZS5hZGRTdGFnZSh7IHN0YWdlTmFtZTogc3RhZ2VOYW1lIH0pO1xuICAgICAgICAgICAgdGhpcy5zdGFnZU1hcC5zZXQoc3RhZ2VOYW1lLCBzdGFnZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc3RhZ2UhO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlQWN0aW9uU291cmNlQ29kZUNvbW1pdChhY3Rpb25OYW1lOiBzdHJpbmcsIHByb3BzOiBTb3VyY2VLaW5kQ29kZUNvbW1pdFByb3BzLCBydW5PcmRlcj86IG51bWJlcik6IGNvZGVwaXBlbGluZS5JQWN0aW9uIHtcbiAgICAgICAgY29uc3QgcmVwbyA9IGNvZGVjb21taXQuUmVwb3NpdG9yeS5mcm9tUmVwb3NpdG9yeU5hbWUoXG4gICAgICAgICAgICB0aGlzLFxuICAgICAgICAgICAgJ0NvZGVDb21taXQtUmVwb3NpdG9yeScsXG4gICAgICAgICAgICBwcm9wcy5SZXBvc2l0b3J5TmFtZSxcbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLnNvdXJjZU91dHB1dCA9IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoJ1NvdXJjZU91dHB1dCcpXG4gICAgICAgIGNvbnN0IGFjdGlvbiA9IG5ldyBjb2RlcGlwZWxpbmVfYWN0aW9ucy5Db2RlQ29tbWl0U291cmNlQWN0aW9uKHtcbiAgICAgICAgICAgIGFjdGlvbk5hbWU6IGFjdGlvbk5hbWUsXG4gICAgICAgICAgICByZXBvc2l0b3J5OiByZXBvLFxuICAgICAgICAgICAgb3V0cHV0OiB0aGlzLnNvdXJjZU91dHB1dCxcbiAgICAgICAgICAgIGJyYW5jaDogcHJvcHMuQnJhbmNoTmFtZSxcbiAgICAgICAgICAgIGNvZGVCdWlsZENsb25lT3V0cHV0OiB0cnVlLFxuICAgICAgICAgICAgcnVuT3JkZXI6IHJ1bk9yZGVyXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBhY3Rpb247XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVBY3Rpb25Tb3VyY2VTM0J1Y2tldChhY3Rpb25OYW1lOiBzdHJpbmcsIHByb3BzOiBTb3VyY2VLaW5kUzNCdWNrZXRQcm9wcywgcnVuT3JkZXI/OiBudW1iZXIpOiBjb2RlcGlwZWxpbmUuSUFjdGlvbiB7XG4gICAgICAgIGNvbnN0IGJ1Y2tldCA9IHMzLkJ1Y2tldC5mcm9tQnVja2V0QXR0cmlidXRlcyh0aGlzLCBgJHthY3Rpb25OYW1lfVNvdXJjZVMzQnVja2V0YCwge1xuICAgICAgICAgICAgYnVja2V0TmFtZTogcHJvcHMuQnVja2V0TmFtZSxcbiAgICAgICAgICAgIGFjY291bnQ6IHByb3BzLkFjY291bnQsXG4gICAgICAgICAgICByZWdpb246IHByb3BzLlJlZ2lvblxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnNvdXJjZU91dHB1dCA9IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoJ1NvdXJjZU91dHB1dCcpXG4gICAgICAgIGNvbnN0IGFjdGlvbiA9IG5ldyBjb2RlcGlwZWxpbmVfYWN0aW9ucy5TM1NvdXJjZUFjdGlvbih7XG4gICAgICAgICAgICBhY3Rpb25OYW1lOiBhY3Rpb25OYW1lLFxuICAgICAgICAgICAgYnVja2V0LFxuICAgICAgICAgICAgYnVja2V0S2V5OiBwcm9wcy5CdWNrZXRLZXksXG4gICAgICAgICAgICBvdXRwdXQ6IHRoaXMuc291cmNlT3V0cHV0LFxuICAgICAgICAgICAgcnVuT3JkZXI6IHJ1bk9yZGVyXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBhY3Rpb247XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVBY3Rpb25BcHByb3ZlTWFudWFsKGFjdGlvbk5hbWU6IHN0cmluZywgcHJvcHM6IEFwcHJvdmVLaW5kTWFudWFsUHJvcHMsIHJ1bk9yZGVyPzogbnVtYmVyKTogY29kZXBpcGVsaW5lLklBY3Rpb24ge1xuICAgICAgICByZXR1cm4gbmV3IGNvZGVwaXBlbGluZV9hY3Rpb25zLk1hbnVhbEFwcHJvdmFsQWN0aW9uKHtcbiAgICAgICAgICAgIGFjdGlvbk5hbWU6IGFjdGlvbk5hbWUsXG4gICAgICAgICAgICBhZGRpdGlvbmFsSW5mb3JtYXRpb246IHByb3BzLkRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgcnVuT3JkZXI6IHJ1bk9yZGVyLFxuICAgICAgICB9KVxuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlQWN0aW9uQnVpbGRDb2RlQnVpbGQoYWN0aW9uUHJvcHM6IEFjdGlvblByb3BzLCBidWlsZFByb3BzOiBCdWlsZEtpbmRDb2RlQnVpbGRQcm9wcywgYnVpbGRQb2xpY2llcz86IGlhbS5Qb2xpY3lTdGF0ZW1lbnRbXSk6IGNvZGVwaXBlbGluZS5JQWN0aW9uIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgbGV0IGFwcENvbmZpZzogQXBwQ29uZmlnID0gSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoYnVpbGRQcm9wcy5BcHBDb25maWdGaWxlKS50b1N0cmluZygpKTtcblxuICAgICAgICBsZXQgYnVpbGRTcGVjID0gdW5kZWZpbmVkO1xuICAgICAgICBjb25zdCBhc3N1bWVSb2xlRW5hYmxlID0gYnVpbGRQcm9wcy5CdWlsZEFzc3VtZVJvbGVBcm4gPyB0cnVlIDogZmFsc2U7XG4gICAgICAgIGlmIChidWlsZFByb3BzLkJ1aWxkQ29tbWFuZHMgJiYgYnVpbGRQcm9wcy5CdWlsZENvbW1hbmRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGJ1aWxkU3BlYyA9IHRoaXMuY3JlYXRlQnVpbGRTcGVjVXNpbmdDb21tYW5kcyhidWlsZFByb3BzLkJ1aWxkQ29tbWFuZHMsIGFzc3VtZVJvbGVFbmFibGUpO1xuICAgICAgICB9IGVsc2UgaWYgKGJ1aWxkUHJvcHMuQnVpbGREZXBsb3lTdGFja3MgJiYgYnVpbGRQcm9wcy5CdWlsZERlcGxveVN0YWNrcy5TdGFja05hbWVMaXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGJ1aWxkU3BlYyA9IHRoaXMuY3JlYXRlQnVpbGRTcGVjVXNpbmdTdGFja05hbWUoYnVpbGRQcm9wcy5CdWlsZERlcGxveVN0YWNrcywgYXNzdW1lUm9sZUVuYWJsZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoYnVpbGRQcm9wcy5CdWlsZFNwZWNGaWxlICYmIGJ1aWxkUHJvcHMuQnVpbGRTcGVjRmlsZS5sZW5ndGggPiAzKSB7XG4gICAgICAgICAgICBidWlsZFNwZWMgPSBjb2RlYnVpbGQuQnVpbGRTcGVjLmZyb21Tb3VyY2VGaWxlbmFtZShidWlsZFByb3BzLkJ1aWxkU3BlY0ZpbGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignW0VSUk9SXSBub3Qgc3VwcG9ydGVkIENvZGVCdWlsZCAtIEJ1aWxkU3BlY1R5cGUnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBidWlsZEFjdGlvbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgaWYgKGJ1aWxkU3BlYykge1xuICAgICAgICAgICAgbGV0IHByb2plY3Q6IGNvZGVidWlsZC5JUHJvamVjdCA9IG5ldyBjb2RlYnVpbGQuUGlwZWxpbmVQcm9qZWN0KHRoaXMsIGAke2FjdGlvblByb3BzLlN0YWdlfS0ke2FjdGlvblByb3BzLk5hbWV9LVByb2plY3RgLCB7XG4gICAgICAgICAgICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgYnVpbGRJbWFnZTogY29kZWJ1aWxkLkxpbnV4QnVpbGRJbWFnZS5TVEFOREFSRF81XzAsXG4gICAgICAgICAgICAgICAgICAgIGNvbXB1dGVUeXBlOiBjb2RlYnVpbGQuQ29tcHV0ZVR5cGUuTUVESVVNLFxuICAgICAgICAgICAgICAgICAgICBwcml2aWxlZ2VkOiB0cnVlLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZW52aXJvbm1lbnRWYXJpYWJsZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgQUNDT1VOVDogeyB2YWx1ZTogYCR7YXBwQ29uZmlnLlByb2plY3QuQWNjb3VudH1gIH0sXG4gICAgICAgICAgICAgICAgICAgIFJFR0lPTjogeyB2YWx1ZTogYCR7YXBwQ29uZmlnLlByb2plY3QuUmVnaW9ufWAgfSxcbiAgICAgICAgICAgICAgICAgICAgUFJPSkVDVF9OQU1FOiB7IHZhbHVlOiBgJHthcHBDb25maWcuUHJvamVjdC5OYW1lfWAgfSxcbiAgICAgICAgICAgICAgICAgICAgUFJPSkVDVF9TVEFHRTogeyB2YWx1ZTogYCR7YXBwQ29uZmlnLlByb2plY3QuU3RhZ2V9YCB9LFxuICAgICAgICAgICAgICAgICAgICBQUk9KRUNUX1BSRUZJWDogeyB2YWx1ZTogYCR7dGhpcy5wcm9qZWN0UHJlZml4fWAgfSxcbiAgICAgICAgICAgICAgICAgICAgQVBQX0NPTkZJRzogeyB2YWx1ZTogYnVpbGRQcm9wcy5BcHBDb25maWdGaWxlIH0sXG4gICAgICAgICAgICAgICAgICAgIEFTU1VNRV9ST0xFX0FSTjogeyB2YWx1ZTogYnVpbGRQcm9wcy5CdWlsZEFzc3VtZVJvbGVBcm4gPyBidWlsZFByb3BzLkJ1aWxkQXNzdW1lUm9sZUFybiA6ICcnIH0sXG4gICAgICAgICAgICAgICAgICAgIE9OX1BJUEVMSU5FOiB7IHZhbHVlOiAnWUVTJyB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBidWlsZFNwZWM6IGJ1aWxkU3BlYyxcbiAgICAgICAgICAgICAgICB0aW1lb3V0OiBjZGsuRHVyYXRpb24ubWludXRlcyg2MClcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBwcm9qZWN0LmFkZFRvUm9sZVBvbGljeSh0aGlzLmdldERlcGxveUNvbW1vblBvbGljeSgpKTtcbiAgICAgICAgICAgIGlmIChidWlsZFBvbGljaWVzKSB7XG4gICAgICAgICAgICAgICAgYnVpbGRQb2xpY2llcy5mb3JFYWNoKHBvbGljeSA9PiBwcm9qZWN0LmFkZFRvUm9sZVBvbGljeShwb2xpY3kpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcHJvamVjdC5yb2xlPy5hZGRNYW5hZ2VkUG9saWN5KGlhbS5NYW5hZ2VkUG9saWN5LmZyb21Bd3NNYW5hZ2VkUG9saWN5TmFtZSgnQWRtaW5pc3RyYXRvckFjY2VzcycpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gdGhpcy5idWlsZE91dHB1dCA9IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoYCR7YWN0aW9uUHJvcHMuTmFtZX1CdWlsZE91dHB1dGApO1xuXG4gICAgICAgICAgICBidWlsZEFjdGlvbiA9IG5ldyBjb2RlcGlwZWxpbmVfYWN0aW9ucy5Db2RlQnVpbGRBY3Rpb24oe1xuICAgICAgICAgICAgICAgIGFjdGlvbk5hbWU6IGFjdGlvblByb3BzLk5hbWUsXG4gICAgICAgICAgICAgICAgcHJvamVjdCxcbiAgICAgICAgICAgICAgICBpbnB1dDogdGhpcy5zb3VyY2VPdXRwdXQsXG4gICAgICAgICAgICAgICAgLy8gb3V0cHV0czogW3RoaXMuYnVpbGRPdXRwdXRdLFxuICAgICAgICAgICAgICAgIHJ1bk9yZGVyOiBhY3Rpb25Qcm9wcy5PcmRlclxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYnVpbGRBY3Rpb247XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVCdWlsZFNwZWNVc2luZ0NvbW1hbmRzKGJ1aWxkQ29tbWFuZHM6IHN0cmluZ1tdLCBhc3N1bWVSb2xlRW5hYmxlOiBib29sZWFuKTogY29kZWJ1aWxkLkJ1aWxkU3BlYyB7XG4gICAgICAgIGNvbnN0IGJ1aWxkU3BlYyA9IGNvZGVidWlsZC5CdWlsZFNwZWMuZnJvbU9iamVjdChcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2ZXJzaW9uOiBcIjAuMlwiLFxuICAgICAgICAgICAgICAgIHBoYXNlczoge1xuICAgICAgICAgICAgICAgICAgICBpbnN0YWxsOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY29kZWJ1aWxkL2xhdGVzdC91c2VyZ3VpZGUvcnVudGltZS12ZXJzaW9ucy5odG1sXG4gICAgICAgICAgICAgICAgICAgICAgICAncnVudGltZS12ZXJzaW9ucyc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlanM6IDE0XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbWFuZHM6IHRoaXMuY3JlYXRlSW5zdGFsbENvbW1hbmRzKGFzc3VtZVJvbGVFbmFibGUsIGZhbHNlKVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBwcmVfYnVpbGQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1hbmRzOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3B3ZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2xzIC1sJ1xuICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBidWlsZDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tbWFuZHM6IGJ1aWxkQ29tbWFuZHNcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgcG9zdF9idWlsZDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tbWFuZHM6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAncHdkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnbHMgLWwnXG4gICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGFydGlmYWN0czoge1xuICAgICAgICAgICAgICAgICAgICBmaWxlczogW1xuICAgICAgICAgICAgICAgICAgICAgICAgJyoqLyonXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICdleGNsdWRlLXBhdGhzJzogW1xuICAgICAgICAgICAgICAgICAgICAgICAgJ2Nkay5vdXQvJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdub2RlX21vZHVsZXMvJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICcuZ2l0LydcbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIGJ1aWxkU3BlYztcbiAgICB9XG5cbiAgICAvLyBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY29kZWJ1aWxkL2xhdGVzdC91c2VyZ3VpZGUvYnVpbGQtc3BlYy1yZWYuaHRtbFxuICAgIHByaXZhdGUgY3JlYXRlQnVpbGRTcGVjVXNpbmdTdGFja05hbWUocHJvcHM6IEJ1aWxkRGVwbG95U3RhY2tzUHJvcHMsIGFzc3VtZVJvbGVFbmFibGU6IGJvb2xlYW4pOiBjb2RlYnVpbGQuQnVpbGRTcGVjIHtcbiAgICAgICAgY29uc3QgY2RrRGVwbG95U3RhY2tzQ29tbWFuZHMgPSBwcm9wcy5TdGFja05hbWVMaXN0Lm1hcChzdGFja05hbWUgPT4ge1xuICAgICAgICAgICAgY29uc3QgYXJncyA9IHN0YWNrTmFtZS50cmltKCkuc3BsaXQoJyAnKTtcbiAgICAgICAgICAgIGNvbnN0IHB1cmVTdGFja05hbWUgPSBhcmdzWzBdO1xuICAgICAgICAgICAgYXJnc1swXSA9IGBjZGsgZGVwbG95ICoke3B1cmVTdGFja05hbWV9KiAtLXJlcXVpcmUtYXBwcm92YWwgbmV2ZXJgO1xuICAgICAgICAgICAgcmV0dXJuIGFyZ3Muam9pbignICcpO1xuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IGJ1aWxkU3BlYyA9IGNvZGVidWlsZC5CdWlsZFNwZWMuZnJvbU9iamVjdChcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2ZXJzaW9uOiBcIjAuMlwiLFxuICAgICAgICAgICAgICAgIHBoYXNlczoge1xuICAgICAgICAgICAgICAgICAgICBpbnN0YWxsOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAncnVudGltZS12ZXJzaW9ucyc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlanM6IDE0XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbWFuZHM6IHRoaXMuY3JlYXRlSW5zdGFsbENvbW1hbmRzKGFzc3VtZVJvbGVFbmFibGUsIHRydWUpXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHByZV9idWlsZDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tbWFuZHM6IHByb3BzLlByZUNvbW1hbmRzXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGJ1aWxkOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tYW5kczogY2RrRGVwbG95U3RhY2tzQ29tbWFuZHNcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgcG9zdF9idWlsZDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tbWFuZHM6IHByb3BzLlBvc3RDb21tYW5kc1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBhcnRpZmFjdHM6IHtcbiAgICAgICAgICAgICAgICAgICAgZmlsZXM6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICcqKi8qJ1xuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAnZXhjbHVkZS1wYXRocyc6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICdjZGsub3V0LycsXG4gICAgICAgICAgICAgICAgICAgICAgICAnbm9kZV9tb2R1bGVzLycsXG4gICAgICAgICAgICAgICAgICAgICAgICAnLmdpdC8nXG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGJ1aWxkU3BlYztcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZUFjdGlvbkRlcGxveVMzQnVja2V0KGFjdGlvbk5hbWU6IHN0cmluZywgcHJvcHM6IERlcGxveUtpbmRTM0J1Y2tldFByb3BzLCBydW5PcmRlcj86IG51bWJlcik6IGNvZGVwaXBlbGluZS5JQWN0aW9uIHtcbiAgICAgICAgY29uc3QgYnVja2V0ID0gczMuQnVja2V0LmZyb21CdWNrZXRBdHRyaWJ1dGVzKHRoaXMsIGAke2FjdGlvbk5hbWV9RGVwbG95UzNCdWNrZXRgLCB7XG4gICAgICAgICAgICBidWNrZXROYW1lOiBwcm9wcy5CdWNrZXROYW1lLFxuICAgICAgICAgICAgYWNjb3VudDogcHJvcHMuQWNjb3VudCxcbiAgICAgICAgICAgIHJlZ2lvbjogcHJvcHMuUmVnaW9uXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IGFjdGlvbiA9IG5ldyBjb2RlcGlwZWxpbmVfYWN0aW9ucy5TM0RlcGxveUFjdGlvbih7XG4gICAgICAgICAgICBhY3Rpb25OYW1lOiBhY3Rpb25OYW1lLFxuICAgICAgICAgICAgaW5wdXQ6IHRoaXMuYnVpbGRPdXRwdXQsXG4gICAgICAgICAgICBidWNrZXRcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGFjdGlvbjtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZUluc3RhbGxDb21tYW5kcyhhc3N1bWVSb2xlRW5hYmxlOiBib29sZWFuLCBzZXR1cEVuYWJsZTogYm9vbGVhbik6IHN0cmluZ1tdIHtcbiAgICAgICAgbGV0IGNvbW1hbmRzOiBzdHJpbmdbXSA9IFtdO1xuXG4gICAgICAgIGNvbnN0IGFzc3VtZVJvbGVDb21tYW5kcyA9IFtcbiAgICAgICAgICAgICdjcmVkcz0kKG1rdGVtcCAtZCkvY3JlZHMuanNvbicsXG4gICAgICAgICAgICAnYXdzIHN0cyBhc3N1bWUtcm9sZSAtLXJvbGUtYXJuICRBU1NVTUVfUk9MRV9BUk4gLS1yb2xlLXNlc3Npb24tbmFtZSBhc3N1bWVfcm9sZSA+ICRjcmVkcycsXG4gICAgICAgICAgICBgZXhwb3J0IEFXU19BQ0NFU1NfS0VZX0lEPSQoY2F0ICRjcmVkcyB8IGdyZXAgXCJBY2Nlc3NLZXlJZFwiIHwgY3V0IC1kICdcIicgLWYgNClgLFxuICAgICAgICAgICAgYGV4cG9ydCBBV1NfU0VDUkVUX0FDQ0VTU19LRVk9JChjYXQgJGNyZWRzIHwgZ3JlcCBcIlNlY3JldEFjY2Vzc0tleVwiIHwgY3V0IC1kICdcIicgLWYgNClgLFxuICAgICAgICAgICAgYGV4cG9ydCBBV1NfU0VTU0lPTl9UT0tFTj0kKGNhdCAkY3JlZHMgfCBncmVwIFwiU2Vzc2lvblRva2VuXCIgfCBjdXQgLWQgJ1wiJyAtZiA0KWAsXG4gICAgICAgIF1cblxuICAgICAgICBjb25zdCBzZXR1cEluc3RhbGxDb21tYW5kcyA9IFtcbiAgICAgICAgICAgIGBucG0gaW5zdGFsbCAtZyBhd3MtY2RrJHtDREtfVkVSfWAsXG4gICAgICAgICAgICAnbnBtIGluc3RhbGwnXG4gICAgICAgIF1cblxuICAgICAgICBpZiAoYXNzdW1lUm9sZUVuYWJsZSkge1xuICAgICAgICAgICAgY29tbWFuZHMgPSBjb21tYW5kcy5jb25jYXQoYXNzdW1lUm9sZUNvbW1hbmRzKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2V0dXBFbmFibGUpIHtcbiAgICAgICAgICAgIGNvbW1hbmRzID0gY29tbWFuZHMuY29uY2F0KHNldHVwSW5zdGFsbENvbW1hbmRzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb21tYW5kcztcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldERlcGxveUNvbW1vblBvbGljeSgpOiBpYW0uUG9saWN5U3RhdGVtZW50IHtcbiAgICAgICAgY29uc3Qgc3RhdGVtZW50ID0gbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoKTtcbiAgICAgICAgc3RhdGVtZW50LmFkZEFjdGlvbnMoXG4gICAgICAgICAgICBcImNsb3VkZm9ybWF0aW9uOipcIixcbiAgICAgICAgICAgIFwibGFtYmRhOipcIixcbiAgICAgICAgICAgIFwiczM6KlwiLFxuICAgICAgICAgICAgXCJzc206KlwiLFxuICAgICAgICAgICAgXCJpYW06UGFzc1JvbGVcIixcbiAgICAgICAgICAgIFwia21zOipcIixcbiAgICAgICAgICAgIFwiZXZlbnRzOipcIixcbiAgICAgICAgICAgIFwic3RzOkFzc3VtZVJvbGVcIlxuICAgICAgICApO1xuICAgICAgICBzdGF0ZW1lbnQuYWRkUmVzb3VyY2VzKFwiKlwiKTtcbiAgICAgICAgcmV0dXJuIHN0YXRlbWVudDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlZ2lzdGVyRXZlbnRMYW1iZGEoYWN0aW9uUHJvcHM6IEFjdGlvblByb3BzLCBhY3Rpb246IGNvZGVwaXBlbGluZS5JQWN0aW9uKSB7XG4gICAgICAgIGlmIChhY3Rpb25Qcm9wcy5FdmVudFN0YXRlTGFtYmRhXG4gICAgICAgICAgICAmJiBhY3Rpb25Qcm9wcy5FdmVudFN0YXRlTGFtYmRhLkNvZGVQYXRoICYmIGFjdGlvblByb3BzLkV2ZW50U3RhdGVMYW1iZGEuQ29kZVBhdGgubGVuZ3RoID4gMFxuICAgICAgICAgICAgJiYgYWN0aW9uUHJvcHMuRXZlbnRTdGF0ZUxhbWJkYS5IYW5kbGVyICYmIGFjdGlvblByb3BzLkV2ZW50U3RhdGVMYW1iZGEuSGFuZGxlci5sZW5ndGggPiAwKSB7XG5cbiAgICAgICAgICAgIGFjdGlvbj8ub25TdGF0ZUNoYW5nZShcbiAgICAgICAgICAgICAgICBgJHthY3Rpb25Qcm9wcy5TdGFnZX0tJHthY3Rpb25Qcm9wcy5OYW1lfS1FdmVudFN0YXRlYCxcbiAgICAgICAgICAgICAgICBuZXcgdGFyZ2V0cy5MYW1iZGFGdW5jdGlvbih0aGlzLmNyZWF0ZUV2ZW50U3RhdGVMYW1iZGEoYCR7YWN0aW9uUHJvcHMuU3RhZ2V9LSR7YWN0aW9uUHJvcHMuTmFtZX0tRXZlbnRTdGF0ZUxhbWJkYWAsXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvblByb3BzLkV2ZW50U3RhdGVMYW1iZGEpKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZUV2ZW50U3RhdGVMYW1iZGEoYmFzZU5hbWU6IHN0cmluZywgcHJvcHM6IEV2ZW50U3RhdGVMYW1iZGFQcm9wcyk6IGxhbWJkYS5GdW5jdGlvbiB7XG4gICAgICAgIGNvbnN0IGZ1bmMgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHRoaXMsIGJhc2VOYW1lLCB7XG4gICAgICAgICAgICBmdW5jdGlvbk5hbWU6IGAke3RoaXMucHJvamVjdFByZWZpeH0tJHtiYXNlTmFtZX1gLFxuICAgICAgICAgICAgcnVudGltZTogbmV3IGxhbWJkYS5SdW50aW1lKHByb3BzLlJ1bnRpbWUpLFxuICAgICAgICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0KHByb3BzLkNvZGVQYXRoKSxcbiAgICAgICAgICAgIGhhbmRsZXI6IHByb3BzLkhhbmRsZXJcbiAgICAgICAgfSlcblxuICAgICAgICByZXR1cm4gZnVuYztcbiAgICB9XG59XG4iXX0=