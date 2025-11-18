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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlwZWxpbmUtc2ltcGxlLXBhdHRlcm4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9saWIvdGVtcGxhdGUvY29uc3RydWN0L3BhdHRlcm4vcGlwZWxpbmUtc2ltcGxlLXBhdHRlcm4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsaURBQW1DO0FBRW5DLDJFQUE2RDtBQUM3RCwyRkFBNkU7QUFDN0UsdUVBQXlEO0FBQ3pELHFFQUF1RDtBQUN2RCx5REFBMkM7QUFDM0MsK0RBQWlEO0FBQ2pELHdFQUEwRDtBQUMxRCx1REFBeUM7QUFFekMsMkRBQTZFO0FBRzdFLE1BQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUV6QixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUM7QUFlckIsSUFBSyxnQkFLSjtBQUxELFdBQUssZ0JBQWdCO0lBQ2pCLHFDQUFpQixDQUFBO0lBQ2pCLHVDQUFtQixDQUFBO0lBQ25CLG1DQUFlLENBQUE7SUFDZix5Q0FBeUM7QUFDN0MsQ0FBQyxFQUxJLGdCQUFnQixLQUFoQixnQkFBZ0IsUUFLcEI7QUFFRCxJQUFZLFVBTVg7QUFORCxXQUFZLFVBQVU7SUFDbEIsbURBQXFDLENBQUE7SUFDckMsK0NBQWlDLENBQUE7SUFDakMsNkNBQStCLENBQUE7SUFDL0IsK0NBQWlDLENBQUE7SUFDakMseURBQXlEO0FBQzdELENBQUMsRUFOVyxVQUFVLEdBQVYsa0JBQVUsS0FBVixrQkFBVSxRQU1yQjtBQWlERCxNQUFhLHFCQUFzQixTQUFRLDhCQUFhO0lBT3BELFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBaUM7UUFDdkUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFIcEIsYUFBUSxHQUFxQyxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBSzNELE1BQU0sZ0JBQWdCLEdBQVcsS0FBSyxDQUFDLFlBQVksQ0FBQztRQUNwRCxNQUFNLFVBQVUsR0FBa0IsS0FBSyxDQUFDLFVBQVUsQ0FBQztRQUNuRCxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUMsZ0JBQWdCLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFFOUUsSUFBSSxXQUFXLEVBQUU7WUFDYixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksWUFBWSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO2dCQUNoRSxZQUFZLEVBQUUsR0FBRyxJQUFJLENBQUMsYUFBYSxJQUFJLGdCQUFnQixFQUFFO2dCQUN6RCxpQkFBaUIsRUFBRSxJQUFJO2FBQzFCLENBQUMsQ0FBQztZQUVILE1BQU0sYUFBYSxHQUFzQyxLQUFLLENBQUMsYUFBYSxDQUFDO1lBQzdFLEtBQUssTUFBTSxXQUFXLElBQUksVUFBVSxFQUFFO2dCQUNsQyxNQUFNLFVBQVUsR0FBZSxJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBRS9FLElBQUksV0FBVyxDQUFDLE1BQU0sRUFBRTtvQkFDcEIsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLEVBQUUsV0FBVyxFQUFFLGFBQWEsQ0FBQyxDQUFDO29CQUM1RSxJQUFJLENBQUMsT0FBTyxFQUFFO3dCQUNWLE1BQU07cUJBQ1Q7aUJBQ0o7YUFDSjtTQUVKO2FBQU07WUFDSCxPQUFPLENBQUMsSUFBSSxDQUFDLHNEQUFzRCxDQUFDLENBQUM7WUFDckUsTUFBTSxLQUFLLENBQUMsMEJBQTBCLENBQUMsQ0FBQztTQUMzQztJQUNMLENBQUM7SUFFTyxzQkFBc0IsQ0FBQyxnQkFBd0IsRUFBRSxVQUF5QjtRQUM5RSxJQUFJLEtBQUssR0FBRyxLQUFLLENBQUM7UUFFbEIsSUFBSSxnQkFBZ0IsSUFBSSxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ3hELElBQUksVUFBVSxJQUFJLFVBQVUsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO2dCQUN0QyxJQUFJLFVBQVUsR0FBRyxLQUFLLENBQUM7Z0JBQ3ZCLElBQUksU0FBUyxHQUFHLEtBQUssQ0FBQztnQkFFdEIsS0FBSyxNQUFNLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxPQUFPLEVBQUUsRUFBRTtvQkFDckQsSUFBSSxLQUFLLElBQUksQ0FBQyxFQUFFO3dCQUNaLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQzt3QkFDN0QsSUFBSSxXQUFXLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLEVBQUU7NEJBQ2hFLFVBQVUsR0FBRyxJQUFJLENBQUM7eUJBQ3JCO3FCQUNKO3lCQUFNO3dCQUNILElBQUksV0FBVyxDQUFDLE1BQU0sRUFBRTs0QkFDcEIsU0FBUyxHQUFHLElBQUksQ0FBQzs0QkFDakIsTUFBTTt5QkFDVDtxQkFDSjtpQkFDSjtnQkFFRCxJQUFJLFVBQVUsSUFBSSxTQUFTLEVBQUU7b0JBQ3pCLEtBQUssR0FBRyxJQUFJLENBQUM7aUJBQ2hCO2FBQ0o7U0FDSjtRQUVELE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFFTyxjQUFjLENBQUMsVUFBc0IsRUFBRSxXQUF3QixFQUFFLGFBQXFDO1FBQzFHLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQztRQUVuQixJQUFJLFVBQVUsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDaEQsSUFBSSxVQUFVLElBQUksVUFBVSxDQUFDLGdCQUFnQixFQUFFO2dCQUMzQyxNQUFNLEtBQUssR0FBRyxXQUFXLENBQUMsTUFBbUMsQ0FBQztnQkFDOUQsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBRS9DLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLDRCQUE0QixDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2FBQ2xHO2lCQUFNLElBQUksVUFBVSxJQUFJLFVBQVUsQ0FBQyxjQUFjLEVBQUU7Z0JBQ2hELE1BQU0sS0FBSyxHQUFHLFdBQVcsQ0FBQyxNQUFpQyxDQUFDO2dCQUM1RCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFFL0MsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsMEJBQTBCLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7YUFDaEc7aUJBQU07Z0JBQ0gsT0FBTyxDQUFDLEtBQUssQ0FBQyxrQ0FBa0MsRUFBRSxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3BFLE9BQU8sR0FBRyxLQUFLLENBQUM7YUFDbkI7U0FDSjthQUFNLElBQUksVUFBVSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUN4RCxJQUFJLFVBQVUsSUFBSSxVQUFVLENBQUMsYUFBYSxFQUFFO2dCQUN4QyxNQUFNLEtBQUssR0FBRyxXQUFXLENBQUMsTUFBZ0MsQ0FBQztnQkFDM0QsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBRS9DLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2FBQy9GO2lCQUFNO2dCQUNILE9BQU8sQ0FBQyxLQUFLLENBQUMsbUNBQW1DLEVBQUUsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNyRSxPQUFPLEdBQUcsS0FBSyxDQUFDO2FBQ25CO1NBQ0o7YUFBTSxJQUFJLFVBQVUsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDdEQsSUFBSSxVQUFVLElBQUksVUFBVSxDQUFDLGNBQWMsRUFBRTtnQkFDekMsTUFBTSxLQUFLLEdBQUcsV0FBVyxDQUFDLE1BQWlDLENBQUM7Z0JBQzVELE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUMvQyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsMEJBQTBCLENBQUMsV0FBVyxFQUFFLEtBQUssRUFBRSxhQUFhLENBQUMsQ0FBQztnQkFFbEYsSUFBSSxNQUFNLEVBQUU7b0JBQ1IsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDeEIsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUMsQ0FBQztpQkFDakQ7cUJBQU07b0JBQ0gsT0FBTyxDQUFDLEtBQUssQ0FBQyxxQ0FBcUMsRUFBRSxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ3ZFLE9BQU8sR0FBRyxLQUFLLENBQUM7aUJBQ25CO2FBQ0o7aUJBQU07Z0JBQ0gsT0FBTyxDQUFDLEtBQUssQ0FBQyxpQ0FBaUMsRUFBRSxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ25FLE9BQU8sR0FBRyxLQUFLLENBQUM7YUFDbkI7U0FDSjtRQUNELGlEQUFpRDtRQUNqRCxxREFBcUQ7UUFDckQsdUVBQXVFO1FBQ3ZFLDBEQUEwRDtRQUMxRCxzR0FBc0c7UUFFdEcsd0JBQXdCO1FBQ3hCLHVDQUF1QztRQUN2Qyw2REFBNkQ7UUFDN0QsbUJBQW1CO1FBQ25CLHVGQUF1RjtRQUN2RiwrQkFBK0I7UUFDL0IsWUFBWTtRQUNaLGVBQWU7UUFDZiwrRUFBK0U7UUFDL0UsMkJBQTJCO1FBQzNCLFFBQVE7UUFDUixJQUFJO1FBRUosT0FBTyxPQUFPLENBQUM7SUFDbkIsQ0FBQztJQUVPLFFBQVEsQ0FBQyxTQUFpQjtRQUM5QixJQUFJLEtBQUssR0FBRyxTQUFTLENBQUM7UUFFdEIsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUM5QixLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDeEM7YUFBTTtZQUNILEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDO1lBQzdELElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztTQUN2QztRQUVELE9BQU8sS0FBTSxDQUFDO0lBQ2xCLENBQUM7SUFFTyw0QkFBNEIsQ0FBQyxVQUFrQixFQUFFLEtBQWdDLEVBQUUsUUFBaUI7UUFDeEcsTUFBTSxJQUFJLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsQ0FDakQsSUFBSSxFQUNKLHVCQUF1QixFQUN2QixLQUFLLENBQUMsY0FBYyxDQUN2QixDQUFDO1FBRUYsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLFlBQVksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUE7UUFDN0QsTUFBTSxNQUFNLEdBQUcsSUFBSSxvQkFBb0IsQ0FBQyxzQkFBc0IsQ0FBQztZQUMzRCxVQUFVLEVBQUUsVUFBVTtZQUN0QixVQUFVLEVBQUUsSUFBSTtZQUNoQixNQUFNLEVBQUUsSUFBSSxDQUFDLFlBQVk7WUFDekIsTUFBTSxFQUFFLEtBQUssQ0FBQyxVQUFVO1lBQ3hCLG9CQUFvQixFQUFFLElBQUk7WUFDMUIsUUFBUSxFQUFFLFFBQVE7U0FDckIsQ0FBQyxDQUFDO1FBRUgsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUVPLDBCQUEwQixDQUFDLFVBQWtCLEVBQUUsS0FBOEIsRUFBRSxRQUFpQjtRQUNwRyxNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLG9CQUFvQixDQUFDLElBQUksRUFBRSxHQUFHLFVBQVUsZ0JBQWdCLEVBQUU7WUFDL0UsVUFBVSxFQUFFLEtBQUssQ0FBQyxVQUFVO1lBQzVCLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTztZQUN0QixNQUFNLEVBQUUsS0FBSyxDQUFDLE1BQU07U0FDdkIsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLFlBQVksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUE7UUFDN0QsTUFBTSxNQUFNLEdBQUcsSUFBSSxvQkFBb0IsQ0FBQyxjQUFjLENBQUM7WUFDbkQsVUFBVSxFQUFFLFVBQVU7WUFDdEIsTUFBTTtZQUNOLFNBQVMsRUFBRSxLQUFLLENBQUMsU0FBUztZQUMxQixNQUFNLEVBQUUsSUFBSSxDQUFDLFlBQVk7WUFDekIsUUFBUSxFQUFFLFFBQVE7U0FDckIsQ0FBQyxDQUFDO1FBRUgsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUVPLHlCQUF5QixDQUFDLFVBQWtCLEVBQUUsS0FBNkIsRUFBRSxRQUFpQjtRQUNsRyxPQUFPLElBQUksb0JBQW9CLENBQUMsb0JBQW9CLENBQUM7WUFDakQsVUFBVSxFQUFFLFVBQVU7WUFDdEIscUJBQXFCLEVBQUUsS0FBSyxDQUFDLFdBQVc7WUFDeEMsUUFBUSxFQUFFLFFBQVE7U0FDckIsQ0FBQyxDQUFBO0lBQ04sQ0FBQztJQUVPLDBCQUEwQixDQUFDLFdBQXdCLEVBQUUsVUFBbUMsRUFBRSxhQUFxQzs7UUFDbkksSUFBSSxTQUFTLEdBQWMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBRTVGLElBQUksU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMxQixNQUFNLGdCQUFnQixHQUFHLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDdEUsSUFBSSxVQUFVLENBQUMsYUFBYSxJQUFJLFVBQVUsQ0FBQyxhQUFhLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUNqRSxTQUFTLEdBQUcsSUFBSSxDQUFDLDRCQUE0QixDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztTQUM3RjthQUFNLElBQUksVUFBVSxDQUFDLGlCQUFpQixJQUFJLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxhQUFhLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUM5RixTQUFTLEdBQUcsSUFBSSxDQUFDLDZCQUE2QixDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1NBQ2xHO2FBQU0sSUFBSSxVQUFVLENBQUMsYUFBYSxJQUFJLFVBQVUsQ0FBQyxhQUFhLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUN4RSxTQUFTLEdBQUcsU0FBUyxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUM7U0FDaEY7YUFBTTtZQUNILE9BQU8sQ0FBQyxLQUFLLENBQUMsaURBQWlELENBQUMsQ0FBQztTQUNwRTtRQUVELElBQUksV0FBVyxHQUFHLFNBQVMsQ0FBQztRQUM1QixJQUFJLFNBQVMsRUFBRTtZQUNYLElBQUksT0FBTyxHQUF1QixJQUFJLFNBQVMsQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLEdBQUcsV0FBVyxDQUFDLEtBQUssSUFBSSxXQUFXLENBQUMsSUFBSSxVQUFVLEVBQUU7Z0JBQ3RILFdBQVcsRUFBRTtvQkFDVCxVQUFVLEVBQUUsU0FBUyxDQUFDLGVBQWUsQ0FBQyxZQUFZO29CQUNsRCxXQUFXLEVBQUUsU0FBUyxDQUFDLFdBQVcsQ0FBQyxNQUFNO29CQUN6QyxVQUFVLEVBQUUsSUFBSTtpQkFDbkI7Z0JBQ0Qsb0JBQW9CLEVBQUU7b0JBQ2xCLE9BQU8sRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUU7b0JBQ2xELE1BQU0sRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUU7b0JBQ2hELFlBQVksRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUU7b0JBQ3BELGFBQWEsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUU7b0JBQ3RELGNBQWMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsRUFBRTtvQkFDbEQsVUFBVSxFQUFFLEVBQUUsS0FBSyxFQUFFLFVBQVUsQ0FBQyxhQUFhLEVBQUU7b0JBQy9DLGVBQWUsRUFBRSxFQUFFLEtBQUssRUFBRSxVQUFVLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO29CQUM5RixXQUFXLEVBQUUsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFO2lCQUNoQztnQkFDRCxTQUFTLEVBQUUsU0FBUztnQkFDcEIsT0FBTyxFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQzthQUNwQyxDQUFDLENBQUM7WUFFSCxPQUFPLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLENBQUM7WUFDdEQsSUFBSSxhQUFhLEVBQUU7Z0JBQ2YsYUFBYSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzthQUNwRTtpQkFBTTtnQkFDSCxNQUFBLE9BQU8sQ0FBQyxJQUFJLDBDQUFFLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsd0JBQXdCLENBQUMscUJBQXFCLENBQUMsRUFBRTthQUNyRztZQUVELGtGQUFrRjtZQUVsRixXQUFXLEdBQUcsSUFBSSxvQkFBb0IsQ0FBQyxlQUFlLENBQUM7Z0JBQ25ELFVBQVUsRUFBRSxXQUFXLENBQUMsSUFBSTtnQkFDNUIsT0FBTztnQkFDUCxLQUFLLEVBQUUsSUFBSSxDQUFDLFlBQVk7Z0JBQ3hCLCtCQUErQjtnQkFDL0IsUUFBUSxFQUFFLFdBQVcsQ0FBQyxLQUFLO2FBQzlCLENBQUMsQ0FBQztTQUNOO1FBRUQsT0FBTyxXQUFXLENBQUM7SUFDdkIsQ0FBQztJQUVPLDRCQUE0QixDQUFDLGFBQXVCLEVBQUUsZ0JBQXlCO1FBQ25GLE1BQU0sU0FBUyxHQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUM1QztZQUNJLE9BQU8sRUFBRSxLQUFLO1lBQ2QsTUFBTSxFQUFFO2dCQUNKLE9BQU8sRUFBRTtvQkFDTCwrRUFBK0U7b0JBQy9FLGtCQUFrQixFQUFFO3dCQUNoQixNQUFNLEVBQUUsRUFBRTtxQkFDYjtvQkFDRCxRQUFRLEVBQUUsSUFBSSxDQUFDLHFCQUFxQixDQUFDLGdCQUFnQixFQUFFLEtBQUssQ0FBQztpQkFDaEU7Z0JBQ0QsU0FBUyxFQUFFO29CQUNQLFFBQVEsRUFBRTt3QkFDTixLQUFLO3dCQUNMLE9BQU87cUJBQ1Y7aUJBQ0o7Z0JBQ0QsS0FBSyxFQUFFO29CQUNILFFBQVEsRUFBRSxhQUFhO2lCQUMxQjtnQkFDRCxVQUFVLEVBQUU7b0JBQ1IsUUFBUSxFQUFFO3dCQUNOLEtBQUs7d0JBQ0wsT0FBTztxQkFDVjtpQkFDSjthQUNKO1lBQ0QsU0FBUyxFQUFFO2dCQUNQLEtBQUssRUFBRTtvQkFDSCxNQUFNO2lCQUNUO2dCQUNELGVBQWUsRUFBRTtvQkFDYixVQUFVO29CQUNWLGVBQWU7b0JBQ2YsT0FBTztpQkFDVjthQUNKO1NBQ0osQ0FDSixDQUFDO1FBQ0YsT0FBTyxTQUFTLENBQUM7SUFDckIsQ0FBQztJQUVELDZFQUE2RTtJQUNyRSw2QkFBNkIsQ0FBQyxLQUE2QixFQUFFLGdCQUF5QjtRQUMxRixNQUFNLHVCQUF1QixHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQ2hFLE1BQU0sSUFBSSxHQUFHLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDekMsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlCLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxlQUFlLGFBQWEsNEJBQTRCLENBQUM7WUFDbkUsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzFCLENBQUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxTQUFTLEdBQUcsU0FBUyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQzVDO1lBQ0ksT0FBTyxFQUFFLEtBQUs7WUFDZCxNQUFNLEVBQUU7Z0JBQ0osT0FBTyxFQUFFO29CQUNMLGtCQUFrQixFQUFFO3dCQUNoQixNQUFNLEVBQUUsRUFBRTtxQkFDYjtvQkFDRCxRQUFRLEVBQUUsSUFBSSxDQUFDLHFCQUFxQixDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQztpQkFDL0Q7Z0JBQ0QsU0FBUyxFQUFFO29CQUNQLFFBQVEsRUFBRSxLQUFLLENBQUMsV0FBVztpQkFDOUI7Z0JBQ0QsS0FBSyxFQUFFO29CQUNILFFBQVEsRUFBRSx1QkFBdUI7aUJBQ3BDO2dCQUNELFVBQVUsRUFBRTtvQkFDUixRQUFRLEVBQUUsS0FBSyxDQUFDLFlBQVk7aUJBQy9CO2FBQ0o7WUFDRCxTQUFTLEVBQUU7Z0JBQ1AsS0FBSyxFQUFFO29CQUNILE1BQU07aUJBQ1Q7Z0JBQ0QsZUFBZSxFQUFFO29CQUNiLFVBQVU7b0JBQ1YsZUFBZTtvQkFDZixPQUFPO2lCQUNWO2FBQ0o7U0FDSixDQUFDLENBQUM7UUFDUCxPQUFPLFNBQVMsQ0FBQztJQUNyQixDQUFDO0lBRU8sMEJBQTBCLENBQUMsVUFBa0IsRUFBRSxLQUE4QixFQUFFLFFBQWlCO1FBQ3BHLE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsb0JBQW9CLENBQUMsSUFBSSxFQUFFLEdBQUcsVUFBVSxnQkFBZ0IsRUFBRTtZQUMvRSxVQUFVLEVBQUUsS0FBSyxDQUFDLFVBQVU7WUFDNUIsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFPO1lBQ3RCLE1BQU0sRUFBRSxLQUFLLENBQUMsTUFBTTtTQUN2QixDQUFDLENBQUM7UUFFSCxNQUFNLE1BQU0sR0FBRyxJQUFJLG9CQUFvQixDQUFDLGNBQWMsQ0FBQztZQUNuRCxVQUFVLEVBQUUsVUFBVTtZQUN0QixLQUFLLEVBQUUsSUFBSSxDQUFDLFdBQVc7WUFDdkIsTUFBTTtTQUNULENBQUMsQ0FBQztRQUVILE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFFTyxxQkFBcUIsQ0FBQyxnQkFBeUIsRUFBRSxXQUFvQjtRQUN6RSxJQUFJLFFBQVEsR0FBYSxFQUFFLENBQUM7UUFFNUIsTUFBTSxrQkFBa0IsR0FBRztZQUN2QiwrQkFBK0I7WUFDL0IsMEZBQTBGO1lBQzFGLCtFQUErRTtZQUMvRSx1RkFBdUY7WUFDdkYsZ0ZBQWdGO1NBQ25GLENBQUE7UUFFRCxNQUFNLG9CQUFvQixHQUFHO1lBQ3pCLHlCQUF5QixPQUFPLEVBQUU7WUFDbEMsYUFBYTtTQUNoQixDQUFBO1FBRUQsSUFBSSxnQkFBZ0IsRUFBRTtZQUNsQixRQUFRLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1NBQ2xEO1FBQ0QsSUFBSSxXQUFXLEVBQUU7WUFDYixRQUFRLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1NBQ3BEO1FBRUQsT0FBTyxRQUFRLENBQUM7SUFDcEIsQ0FBQztJQUVPLHFCQUFxQjtRQUN6QixNQUFNLFNBQVMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUM1QyxTQUFTLENBQUMsVUFBVSxDQUNoQixrQkFBa0IsRUFDbEIsVUFBVSxFQUNWLE1BQU0sRUFDTixPQUFPLEVBQ1AsY0FBYyxFQUNkLE9BQU8sRUFDUCxVQUFVLEVBQ1YsZ0JBQWdCLENBQ25CLENBQUM7UUFDRixTQUFTLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzVCLE9BQU8sU0FBUyxDQUFDO0lBQ3JCLENBQUM7SUFFTyxtQkFBbUIsQ0FBQyxXQUF3QixFQUFFLE1BQTRCO1FBQzlFLElBQUksV0FBVyxDQUFDLGdCQUFnQjtlQUN6QixXQUFXLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxJQUFJLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUM7ZUFDekYsV0FBVyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sSUFBSSxXQUFXLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFFNUYsTUFBTSxhQUFOLE1BQU0sdUJBQU4sTUFBTSxDQUFFLGFBQWEsQ0FDakIsR0FBRyxXQUFXLENBQUMsS0FBSyxJQUFJLFdBQVcsQ0FBQyxJQUFJLGFBQWEsRUFDckQsSUFBSSxPQUFPLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxLQUFLLElBQUksV0FBVyxDQUFDLElBQUksbUJBQW1CLEVBQzlHLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLEVBQUU7U0FDM0M7SUFDTCxDQUFDO0lBRU8sc0JBQXNCLENBQUMsUUFBZ0IsRUFBRSxLQUE0QjtRQUN6RSxNQUFNLElBQUksR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRTtZQUM3QyxZQUFZLEVBQUUsR0FBRyxJQUFJLENBQUMsYUFBYSxJQUFJLFFBQVEsRUFBRTtZQUNqRCxPQUFPLEVBQUUsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUM7WUFDMUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUM7WUFDM0MsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFPO1NBQ3pCLENBQUMsQ0FBQTtRQUVGLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7Q0FDSjtBQXJhRCxzREFxYUMiLCJzb3VyY2VzQ29udGVudCI6WyJcbi8qXG4gKiBDb3B5cmlnaHQgQW1hem9uLmNvbSwgSW5jLiBvciBpdHMgYWZmaWxpYXRlcy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBNSVQtMFxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpc1xuICogc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlXG4gKiB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksXG4gKiBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvXG4gKiBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28uXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUiBJTVBMSUVELFxuICogSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEFcbiAqIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFRcbiAqIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTlxuICogT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFXG4gKiBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAqL1xuXG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyBjb2RlcGlwZWxpbmUgZnJvbSAnYXdzLWNkay1saWIvYXdzLWNvZGVwaXBlbGluZSc7XG5pbXBvcnQgKiBhcyBjb2RlcGlwZWxpbmVfYWN0aW9ucyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY29kZXBpcGVsaW5lLWFjdGlvbnMnO1xuaW1wb3J0ICogYXMgY29kZWNvbW1pdCBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY29kZWNvbW1pdCc7XG5pbXBvcnQgKiBhcyBjb2RlYnVpbGQgZnJvbSAnYXdzLWNkay1saWIvYXdzLWNvZGVidWlsZCc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnYXdzLWNkay1saWIvYXdzLWxhbWJkYSc7XG5pbXBvcnQgKiBhcyB0YXJnZXRzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1ldmVudHMtdGFyZ2V0cyc7XG5pbXBvcnQgKiBhcyBzMyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtczMnO1xuXG5pbXBvcnQgeyBCYXNlQ29uc3RydWN0LCBDb25zdHJ1Y3RDb21tb25Qcm9wcyB9IGZyb20gJy4uL2Jhc2UvYmFzZS1jb25zdHJ1Y3QnO1xuaW1wb3J0IHsgQXBwQ29uZmlnIH0gZnJvbSAnLi4vLi4vYXBwLWNvbmZpZyc7XG5cbmNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKTtcblxuY29uc3QgQ0RLX1ZFUiA9ICdAMic7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUGlwZWxpbmVTaW1wbGVQYXR0ZXJuUHJvcHMgZXh0ZW5kcyBDb25zdHJ1Y3RDb21tb25Qcm9wcyB7XG4gICAgcGlwZWxpbmVOYW1lOiBzdHJpbmc7XG4gICAgYWN0aW9uRmxvdzogQWN0aW9uUHJvcHNbXTtcbiAgICBidWlsZFBvbGljaWVzPzogaWFtLlBvbGljeVN0YXRlbWVudFtdO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEV2ZW50U3RhdGVMYW1iZGFQcm9wcyB7XG4gICAgRnVuY3Rpb25OYW1lPzogc3RyaW5nO1xuICAgIENvZGVQYXRoOiBzdHJpbmc7XG4gICAgUnVudGltZTogc3RyaW5nLFxuICAgIEhhbmRsZXI6IHN0cmluZztcbn1cblxuZW51bSBBY3Rpb25LaW5kUHJlZml4IHtcbiAgICBTb3VyY2UgPSAnU291cmNlJyxcbiAgICBBcHByb3ZlID0gJ0FwcHJvdmUnLFxuICAgIEJ1aWxkID0gJ0J1aWxkJyxcbiAgICAvLyBEZXBsb3kgPSAnRGVwbG95JyAvLyBub3QgeWV0IHN1cHBvcnRlZFxufVxuXG5leHBvcnQgZW51bSBBY3Rpb25LaW5kIHtcbiAgICBTb3VyY2VDb2RlQ29tbWl0ID0gJ1NvdXJjZUNvZGVDb21taXQnLFxuICAgIFNvdXJjZVMzQnVja2V0ID0gJ1NvdXJjZVMzQnVja2V0JyxcbiAgICBBcHByb3ZlTWFudWFsID0gJ0FwcHJvdmVNYW51YWwnLFxuICAgIEJ1aWxkQ29kZUJ1aWxkID0gJ0J1aWxkQ29kZUJ1aWxkJyxcbiAgICAvLyBEZXBsb3lTM0J1Y2tldCA9ICdEZXBsb3lTM0J1Y2tldCcgLy8gbm90IHlldCBzdXBwb3J0ZWRcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBY3Rpb25Qcm9wcyB7XG4gICAgTmFtZTogc3RyaW5nO1xuICAgIEtpbmQ6IEFjdGlvbktpbmQ7XG4gICAgU3RhZ2U6IHN0cmluZztcbiAgICBFbmFibGU6IGJvb2xlYW47XG4gICAgT3JkZXI/OiBudW1iZXI7XG4gICAgRXZlbnRTdGF0ZUxhbWJkYT86IEV2ZW50U3RhdGVMYW1iZGFQcm9wcztcbiAgICBEZXRhaWw6IFNvdXJjZUtpbmRDb2RlQ29tbWl0UHJvcHMgfCBBcHByb3ZlS2luZE1hbnVhbFByb3BzIHwgQnVpbGRLaW5kQ29kZUJ1aWxkUHJvcHMgfCBEZXBsb3lLaW5kUzNCdWNrZXRQcm9wcztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBTb3VyY2VLaW5kQ29kZUNvbW1pdFByb3BzIHtcbiAgICBSZXBvc2l0b3J5TmFtZTogc3RyaW5nO1xuICAgIEJyYW5jaE5hbWU6IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBTb3VyY2VLaW5kUzNCdWNrZXRQcm9wcyB7XG4gICAgQnVja2V0TmFtZTogc3RyaW5nO1xuICAgIEJ1Y2tldEtleTogc3RyaW5nO1xuICAgIEFjY291bnQ/OiBzdHJpbmc7XG4gICAgUmVnaW9uPzogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEFwcHJvdmVLaW5kTWFudWFsUHJvcHMge1xuICAgIERlc2NyaXB0aW9uPzogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEJ1aWxkRGVwbG95U3RhY2tzUHJvcHMge1xuICAgIFByZUNvbW1hbmRzPzogc3RyaW5nW107XG4gICAgU3RhY2tOYW1lTGlzdDogc3RyaW5nW107XG4gICAgUG9zdENvbW1hbmRzPzogc3RyaW5nW107XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQnVpbGRLaW5kQ29kZUJ1aWxkUHJvcHMge1xuICAgIEFwcENvbmZpZ0ZpbGU6IHN0cmluZztcbiAgICBCdWlsZENvbW1hbmRzPzogc3RyaW5nW107XG4gICAgQnVpbGRTcGVjRmlsZT86IHN0cmluZztcbiAgICBCdWlsZEFzc3VtZVJvbGVBcm4/OiBzdHJpbmc7XG4gICAgQnVpbGREZXBsb3lTdGFja3M/OiBCdWlsZERlcGxveVN0YWNrc1Byb3BzO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIERlcGxveUtpbmRTM0J1Y2tldFByb3BzIHtcbiAgICBCdWNrZXROYW1lOiBzdHJpbmc7XG4gICAgQWNjb3VudD86IHN0cmluZztcbiAgICBSZWdpb24/OiBzdHJpbmc7XG59XG5cblxuZXhwb3J0IGNsYXNzIFBpcGVsaW5lU2ltcGxlUGF0dGVybiBleHRlbmRzIEJhc2VDb25zdHJ1Y3Qge1xuICAgIHB1YmxpYyBjb2RlUGlwZWxpbmU6IGNvZGVwaXBlbGluZS5QaXBlbGluZTtcblxuICAgIHByaXZhdGUgc291cmNlT3V0cHV0OiBjb2RlcGlwZWxpbmUuQXJ0aWZhY3Q7XG4gICAgcHJpdmF0ZSBidWlsZE91dHB1dDogY29kZXBpcGVsaW5lLkFydGlmYWN0O1xuICAgIHByaXZhdGUgc3RhZ2VNYXA6IE1hcDxzdHJpbmcsIGNvZGVwaXBlbGluZS5JU3RhZ2U+ID0gbmV3IE1hcCgpO1xuXG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFBpcGVsaW5lU2ltcGxlUGF0dGVyblByb3BzKSB7XG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgICAgIGNvbnN0IHBpcGVsaW5lQmFzZU5hbWU6IHN0cmluZyA9IHByb3BzLnBpcGVsaW5lTmFtZTtcbiAgICAgICAgY29uc3QgYWN0aW9uRmxvdzogQWN0aW9uUHJvcHNbXSA9IHByb3BzLmFjdGlvbkZsb3c7XG4gICAgICAgIGNvbnN0IGNvbmZpZ1ZhbGlkID0gdGhpcy52YWxpZGF0ZVBpcGVsaW5lQ29uZmlnKHBpcGVsaW5lQmFzZU5hbWUsIGFjdGlvbkZsb3cpO1xuXG4gICAgICAgIGlmIChjb25maWdWYWxpZCkge1xuICAgICAgICAgICAgdGhpcy5jb2RlUGlwZWxpbmUgPSBuZXcgY29kZXBpcGVsaW5lLlBpcGVsaW5lKHRoaXMsICdDSUNEUGlwZWxpbmUnLCB7XG4gICAgICAgICAgICAgICAgcGlwZWxpbmVOYW1lOiBgJHt0aGlzLnByb2plY3RQcmVmaXh9LSR7cGlwZWxpbmVCYXNlTmFtZX1gLFxuICAgICAgICAgICAgICAgIGVuYWJsZUtleVJvdGF0aW9uOiB0cnVlXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29uc3QgYnVpbGRQb2xpY2llczogaWFtLlBvbGljeVN0YXRlbWVudFtdIHwgdW5kZWZpbmVkID0gcHJvcHMuYnVpbGRQb2xpY2llcztcbiAgICAgICAgICAgIGZvciAoY29uc3QgYWN0aW9uUHJvcHMgb2YgYWN0aW9uRmxvdykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGFjdGlvbktpbmQ6IEFjdGlvbktpbmQgPSB0aGlzLmZpbmRFbnVtVHlwZShBY3Rpb25LaW5kLCBhY3Rpb25Qcm9wcy5LaW5kKTtcblxuICAgICAgICAgICAgICAgIGlmIChhY3Rpb25Qcm9wcy5FbmFibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3VjY2VzcyA9IHRoaXMucmVnaXN0ZXJBY3Rpb24oYWN0aW9uS2luZCwgYWN0aW9uUHJvcHMsIGJ1aWxkUG9saWNpZXMpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmluZm8oXCJObyBzb3VyY2UgcmVwb3NpdG9yeSwgb3IgQWN0aW9uRmxvdyBDb25maWcgaXMgd3JvbmcuXCIpO1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoJ1BpcGVsaW5lQ29uZmlnIGlzIHdyb25nLicpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB2YWxpZGF0ZVBpcGVsaW5lQ29uZmlnKHBpcGVsaW5lQmFzZU5hbWU6IHN0cmluZywgYWN0aW9uRmxvdzogQWN0aW9uUHJvcHNbXSk6IGJvb2xlYW4ge1xuICAgICAgICBsZXQgdmFsaWQgPSBmYWxzZTtcblxuICAgICAgICBpZiAocGlwZWxpbmVCYXNlTmFtZSAmJiBwaXBlbGluZUJhc2VOYW1lLnRyaW0oKS5sZW5ndGggPiAyKSB7XG4gICAgICAgICAgICBpZiAoYWN0aW9uRmxvdyAmJiBhY3Rpb25GbG93Lmxlbmd0aCA+PSAyKSB7XG4gICAgICAgICAgICAgICAgbGV0IGhhdmVTb3VyY2UgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBsZXQgaGF2ZU90aGVyID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IFtpbmRleCwgYWN0aW9uUHJvcHNdIG9mIGFjdGlvbkZsb3cuZW50cmllcygpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBraW5kID0gdGhpcy5maW5kRW51bVR5cGUoQWN0aW9uS2luZCwgYWN0aW9uUHJvcHMuS2luZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYWN0aW9uUHJvcHMuRW5hYmxlICYmIGtpbmQuc3RhcnRzV2l0aChBY3Rpb25LaW5kUHJlZml4LlNvdXJjZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYXZlU291cmNlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhY3Rpb25Qcm9wcy5FbmFibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYXZlT3RoZXIgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGhhdmVTb3VyY2UgJiYgaGF2ZU90aGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdmFsaWQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZWdpc3RlckFjdGlvbihhY3Rpb25LaW5kOiBBY3Rpb25LaW5kLCBhY3Rpb25Qcm9wczogQWN0aW9uUHJvcHMsIGJ1aWxkUG9saWNpZXM/OiBpYW0uUG9saWN5U3RhdGVtZW50W10pOiBib29sZWFuIHtcbiAgICAgICAgbGV0IHN1Y2Nlc3MgPSB0cnVlO1xuXG4gICAgICAgIGlmIChhY3Rpb25LaW5kLnN0YXJ0c1dpdGgoQWN0aW9uS2luZFByZWZpeC5Tb3VyY2UpKSB7XG4gICAgICAgICAgICBpZiAoYWN0aW9uS2luZCA9PSBBY3Rpb25LaW5kLlNvdXJjZUNvZGVDb21taXQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwcm9wcyA9IGFjdGlvblByb3BzLkRldGFpbCBhcyBTb3VyY2VLaW5kQ29kZUNvbW1pdFByb3BzO1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0YWdlID0gdGhpcy5hZGRTdGFnZShhY3Rpb25Qcm9wcy5TdGFnZSk7XG5cbiAgICAgICAgICAgICAgICBzdGFnZS5hZGRBY3Rpb24odGhpcy5jcmVhdGVBY3Rpb25Tb3VyY2VDb2RlQ29tbWl0KGFjdGlvblByb3BzLk5hbWUsIHByb3BzLCBhY3Rpb25Qcm9wcy5PcmRlcikpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChhY3Rpb25LaW5kID09IEFjdGlvbktpbmQuU291cmNlUzNCdWNrZXQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwcm9wcyA9IGFjdGlvblByb3BzLkRldGFpbCBhcyBTb3VyY2VLaW5kUzNCdWNrZXRQcm9wcztcbiAgICAgICAgICAgICAgICBjb25zdCBzdGFnZSA9IHRoaXMuYWRkU3RhZ2UoYWN0aW9uUHJvcHMuU3RhZ2UpO1xuXG4gICAgICAgICAgICAgICAgc3RhZ2UuYWRkQWN0aW9uKHRoaXMuY3JlYXRlQWN0aW9uU291cmNlUzNCdWNrZXQoYWN0aW9uUHJvcHMuTmFtZSwgcHJvcHMsIGFjdGlvblByb3BzLk9yZGVyKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1tFUlJPUl0gbm90IHN1cHBvcnRlZCBTb3VyY2VLaW5kJywgYWN0aW9uUHJvcHMuS2luZCk7XG4gICAgICAgICAgICAgICAgc3VjY2VzcyA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGFjdGlvbktpbmQuc3RhcnRzV2l0aChBY3Rpb25LaW5kUHJlZml4LkFwcHJvdmUpKSB7XG4gICAgICAgICAgICBpZiAoYWN0aW9uS2luZCA9PSBBY3Rpb25LaW5kLkFwcHJvdmVNYW51YWwpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwcm9wcyA9IGFjdGlvblByb3BzLkRldGFpbCBhcyBBcHByb3ZlS2luZE1hbnVhbFByb3BzO1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0YWdlID0gdGhpcy5hZGRTdGFnZShhY3Rpb25Qcm9wcy5TdGFnZSk7XG5cbiAgICAgICAgICAgICAgICBzdGFnZS5hZGRBY3Rpb24odGhpcy5jcmVhdGVBY3Rpb25BcHByb3ZlTWFudWFsKGFjdGlvblByb3BzLk5hbWUsIHByb3BzLCBhY3Rpb25Qcm9wcy5PcmRlcikpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdbRVJST1JdIG5vdCBzdXBwb3J0ZWQgQXBwcm92ZUtpbmQnLCBhY3Rpb25Qcm9wcy5LaW5kKTtcbiAgICAgICAgICAgICAgICBzdWNjZXNzID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoYWN0aW9uS2luZC5zdGFydHNXaXRoKEFjdGlvbktpbmRQcmVmaXguQnVpbGQpKSB7XG4gICAgICAgICAgICBpZiAoYWN0aW9uS2luZCA9PSBBY3Rpb25LaW5kLkJ1aWxkQ29kZUJ1aWxkKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcHJvcHMgPSBhY3Rpb25Qcm9wcy5EZXRhaWwgYXMgQnVpbGRLaW5kQ29kZUJ1aWxkUHJvcHM7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3RhZ2UgPSB0aGlzLmFkZFN0YWdlKGFjdGlvblByb3BzLlN0YWdlKTtcbiAgICAgICAgICAgICAgICBjb25zdCBhY3Rpb24gPSB0aGlzLmNyZWF0ZUFjdGlvbkJ1aWxkQ29kZUJ1aWxkKGFjdGlvblByb3BzLCBwcm9wcywgYnVpbGRQb2xpY2llcyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoYWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YWdlLmFkZEFjdGlvbihhY3Rpb24pO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlZ2lzdGVyRXZlbnRMYW1iZGEoYWN0aW9uUHJvcHMsIGFjdGlvbik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignW0VSUk9SXSBmYWlsIHRvIGNyZWF0ZSBidWlsZC1hY3Rpb24nLCBhY3Rpb25Qcm9wcy5OYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzcyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignW0VSUk9SXSBub3Qgc3VwcG9ydGVkIEJ1aWxkS2luZCcsIGFjdGlvblByb3BzLktpbmQpO1xuICAgICAgICAgICAgICAgIHN1Y2Nlc3MgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyB9IGVsc2UgaWYgKGFjdGlvblR5cGUgPT09IEFjdGlvblR5cGUuRGVwbG95KSB7XG4gICAgICAgIC8vICAgICBpZiAoYWN0aW9uS2luZCA9PSBBY3Rpb25LaW5kLkRlcGxveVMzQnVja2V0KSB7XG4gICAgICAgIC8vICAgICAgICAgY29uc3QgcHJvcHMgPSBhY3Rpb25Qcm9wcy5EZXRhaWwgYXMgRGVwbG95S2luZFMzQnVja2V0UHJvcHM7XG4gICAgICAgIC8vICAgICAgICAgY29uc3Qgc3RhZ2UgPSB0aGlzLmFkZFN0YWdlKGFjdGlvblByb3BzLlN0YWdlKTtcbiAgICAgICAgLy8gICAgICAgICBjb25zdCBhY3Rpb24gPSB0aGlzLmNyZWF0ZUFjdGlvbkRlcGxveVMzQnVja2V0KGFjdGlvblByb3BzLk5hbWUsIHByb3BzLCBhY3Rpb25Qcm9wcy5PcmRlcik7XG5cbiAgICAgICAgLy8gICAgICAgICBpZiAoYWN0aW9uKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgIHN0YWdlLmFkZEFjdGlvbihhY3Rpb24pO1xuICAgICAgICAvLyAgICAgICAgICAgICB0aGlzLnJlZ2lzdGVyRXZlbnRMYW1iZGEoYWN0aW9uUHJvcHMsIGFjdGlvbik7XG4gICAgICAgIC8vICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgY29uc29sZS5lcnJvcignW0VSUk9SXSBmYWlsIHRvIGNyZWF0ZSBkZXBsb3ktYWN0aW9uJywgYWN0aW9uUHJvcHMuTmFtZSk7XG4gICAgICAgIC8vICAgICAgICAgICAgIHN1Y2Nlc3MgPSBmYWxzZTtcbiAgICAgICAgLy8gICAgICAgICB9XG4gICAgICAgIC8vICAgICB9IGVsc2Uge1xuICAgICAgICAvLyAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1tFUlJPUl0gbm90IHN1cHBvcnRlZCBEZXBsb3lLaW5kJywgYWN0aW9uUHJvcHMuS2luZCk7XG4gICAgICAgIC8vICAgICAgICAgc3VjY2VzcyA9IGZhbHNlO1xuICAgICAgICAvLyAgICAgfVxuICAgICAgICAvLyB9XG5cbiAgICAgICAgcmV0dXJuIHN1Y2Nlc3M7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhZGRTdGFnZShzdGFnZU5hbWU6IHN0cmluZyk6IGNvZGVwaXBlbGluZS5JU3RhZ2Uge1xuICAgICAgICBsZXQgc3RhZ2UgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgaWYgKHRoaXMuc3RhZ2VNYXAuaGFzKHN0YWdlTmFtZSkpIHtcbiAgICAgICAgICAgIHN0YWdlID0gdGhpcy5zdGFnZU1hcC5nZXQoc3RhZ2VOYW1lKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0YWdlID0gdGhpcy5jb2RlUGlwZWxpbmUuYWRkU3RhZ2UoeyBzdGFnZU5hbWU6IHN0YWdlTmFtZSB9KTtcbiAgICAgICAgICAgIHRoaXMuc3RhZ2VNYXAuc2V0KHN0YWdlTmFtZSwgc3RhZ2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHN0YWdlITtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZUFjdGlvblNvdXJjZUNvZGVDb21taXQoYWN0aW9uTmFtZTogc3RyaW5nLCBwcm9wczogU291cmNlS2luZENvZGVDb21taXRQcm9wcywgcnVuT3JkZXI/OiBudW1iZXIpOiBjb2RlcGlwZWxpbmUuSUFjdGlvbiB7XG4gICAgICAgIGNvbnN0IHJlcG8gPSBjb2RlY29tbWl0LlJlcG9zaXRvcnkuZnJvbVJlcG9zaXRvcnlOYW1lKFxuICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgICdDb2RlQ29tbWl0LVJlcG9zaXRvcnknLFxuICAgICAgICAgICAgcHJvcHMuUmVwb3NpdG9yeU5hbWUsXG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5zb3VyY2VPdXRwdXQgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCdTb3VyY2VPdXRwdXQnKVxuICAgICAgICBjb25zdCBhY3Rpb24gPSBuZXcgY29kZXBpcGVsaW5lX2FjdGlvbnMuQ29kZUNvbW1pdFNvdXJjZUFjdGlvbih7XG4gICAgICAgICAgICBhY3Rpb25OYW1lOiBhY3Rpb25OYW1lLFxuICAgICAgICAgICAgcmVwb3NpdG9yeTogcmVwbyxcbiAgICAgICAgICAgIG91dHB1dDogdGhpcy5zb3VyY2VPdXRwdXQsXG4gICAgICAgICAgICBicmFuY2g6IHByb3BzLkJyYW5jaE5hbWUsXG4gICAgICAgICAgICBjb2RlQnVpbGRDbG9uZU91dHB1dDogdHJ1ZSxcbiAgICAgICAgICAgIHJ1bk9yZGVyOiBydW5PcmRlclxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gYWN0aW9uO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlQWN0aW9uU291cmNlUzNCdWNrZXQoYWN0aW9uTmFtZTogc3RyaW5nLCBwcm9wczogU291cmNlS2luZFMzQnVja2V0UHJvcHMsIHJ1bk9yZGVyPzogbnVtYmVyKTogY29kZXBpcGVsaW5lLklBY3Rpb24ge1xuICAgICAgICBjb25zdCBidWNrZXQgPSBzMy5CdWNrZXQuZnJvbUJ1Y2tldEF0dHJpYnV0ZXModGhpcywgYCR7YWN0aW9uTmFtZX1Tb3VyY2VTM0J1Y2tldGAsIHtcbiAgICAgICAgICAgIGJ1Y2tldE5hbWU6IHByb3BzLkJ1Y2tldE5hbWUsXG4gICAgICAgICAgICBhY2NvdW50OiBwcm9wcy5BY2NvdW50LFxuICAgICAgICAgICAgcmVnaW9uOiBwcm9wcy5SZWdpb25cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5zb3VyY2VPdXRwdXQgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCdTb3VyY2VPdXRwdXQnKVxuICAgICAgICBjb25zdCBhY3Rpb24gPSBuZXcgY29kZXBpcGVsaW5lX2FjdGlvbnMuUzNTb3VyY2VBY3Rpb24oe1xuICAgICAgICAgICAgYWN0aW9uTmFtZTogYWN0aW9uTmFtZSxcbiAgICAgICAgICAgIGJ1Y2tldCxcbiAgICAgICAgICAgIGJ1Y2tldEtleTogcHJvcHMuQnVja2V0S2V5LFxuICAgICAgICAgICAgb3V0cHV0OiB0aGlzLnNvdXJjZU91dHB1dCxcbiAgICAgICAgICAgIHJ1bk9yZGVyOiBydW5PcmRlclxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gYWN0aW9uO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlQWN0aW9uQXBwcm92ZU1hbnVhbChhY3Rpb25OYW1lOiBzdHJpbmcsIHByb3BzOiBBcHByb3ZlS2luZE1hbnVhbFByb3BzLCBydW5PcmRlcj86IG51bWJlcik6IGNvZGVwaXBlbGluZS5JQWN0aW9uIHtcbiAgICAgICAgcmV0dXJuIG5ldyBjb2RlcGlwZWxpbmVfYWN0aW9ucy5NYW51YWxBcHByb3ZhbEFjdGlvbih7XG4gICAgICAgICAgICBhY3Rpb25OYW1lOiBhY3Rpb25OYW1lLFxuICAgICAgICAgICAgYWRkaXRpb25hbEluZm9ybWF0aW9uOiBwcm9wcy5EZXNjcmlwdGlvbixcbiAgICAgICAgICAgIHJ1bk9yZGVyOiBydW5PcmRlcixcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZUFjdGlvbkJ1aWxkQ29kZUJ1aWxkKGFjdGlvblByb3BzOiBBY3Rpb25Qcm9wcywgYnVpbGRQcm9wczogQnVpbGRLaW5kQ29kZUJ1aWxkUHJvcHMsIGJ1aWxkUG9saWNpZXM/OiBpYW0uUG9saWN5U3RhdGVtZW50W10pOiBjb2RlcGlwZWxpbmUuSUFjdGlvbiB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGxldCBhcHBDb25maWc6IEFwcENvbmZpZyA9IEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGJ1aWxkUHJvcHMuQXBwQ29uZmlnRmlsZSkudG9TdHJpbmcoKSk7XG5cbiAgICAgICAgbGV0IGJ1aWxkU3BlYyA9IHVuZGVmaW5lZDtcbiAgICAgICAgY29uc3QgYXNzdW1lUm9sZUVuYWJsZSA9IGJ1aWxkUHJvcHMuQnVpbGRBc3N1bWVSb2xlQXJuID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICBpZiAoYnVpbGRQcm9wcy5CdWlsZENvbW1hbmRzICYmIGJ1aWxkUHJvcHMuQnVpbGRDb21tYW5kcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBidWlsZFNwZWMgPSB0aGlzLmNyZWF0ZUJ1aWxkU3BlY1VzaW5nQ29tbWFuZHMoYnVpbGRQcm9wcy5CdWlsZENvbW1hbmRzLCBhc3N1bWVSb2xlRW5hYmxlKTtcbiAgICAgICAgfSBlbHNlIGlmIChidWlsZFByb3BzLkJ1aWxkRGVwbG95U3RhY2tzICYmIGJ1aWxkUHJvcHMuQnVpbGREZXBsb3lTdGFja3MuU3RhY2tOYW1lTGlzdC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBidWlsZFNwZWMgPSB0aGlzLmNyZWF0ZUJ1aWxkU3BlY1VzaW5nU3RhY2tOYW1lKGJ1aWxkUHJvcHMuQnVpbGREZXBsb3lTdGFja3MsIGFzc3VtZVJvbGVFbmFibGUpO1xuICAgICAgICB9IGVsc2UgaWYgKGJ1aWxkUHJvcHMuQnVpbGRTcGVjRmlsZSAmJiBidWlsZFByb3BzLkJ1aWxkU3BlY0ZpbGUubGVuZ3RoID4gMykge1xuICAgICAgICAgICAgYnVpbGRTcGVjID0gY29kZWJ1aWxkLkJ1aWxkU3BlYy5mcm9tU291cmNlRmlsZW5hbWUoYnVpbGRQcm9wcy5CdWlsZFNwZWNGaWxlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1tFUlJPUl0gbm90IHN1cHBvcnRlZCBDb2RlQnVpbGQgLSBCdWlsZFNwZWNUeXBlJyk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgYnVpbGRBY3Rpb24gPSB1bmRlZmluZWQ7XG4gICAgICAgIGlmIChidWlsZFNwZWMpIHtcbiAgICAgICAgICAgIGxldCBwcm9qZWN0OiBjb2RlYnVpbGQuSVByb2plY3QgPSBuZXcgY29kZWJ1aWxkLlBpcGVsaW5lUHJvamVjdCh0aGlzLCBgJHthY3Rpb25Qcm9wcy5TdGFnZX0tJHthY3Rpb25Qcm9wcy5OYW1lfS1Qcm9qZWN0YCwge1xuICAgICAgICAgICAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgICAgICAgICAgICAgIGJ1aWxkSW1hZ2U6IGNvZGVidWlsZC5MaW51eEJ1aWxkSW1hZ2UuU1RBTkRBUkRfNV8wLFxuICAgICAgICAgICAgICAgICAgICBjb21wdXRlVHlwZTogY29kZWJ1aWxkLkNvbXB1dGVUeXBlLk1FRElVTSxcbiAgICAgICAgICAgICAgICAgICAgcHJpdmlsZWdlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVudmlyb25tZW50VmFyaWFibGVzOiB7XG4gICAgICAgICAgICAgICAgICAgIEFDQ09VTlQ6IHsgdmFsdWU6IGAke2FwcENvbmZpZy5Qcm9qZWN0LkFjY291bnR9YCB9LFxuICAgICAgICAgICAgICAgICAgICBSRUdJT046IHsgdmFsdWU6IGAke2FwcENvbmZpZy5Qcm9qZWN0LlJlZ2lvbn1gIH0sXG4gICAgICAgICAgICAgICAgICAgIFBST0pFQ1RfTkFNRTogeyB2YWx1ZTogYCR7YXBwQ29uZmlnLlByb2plY3QuTmFtZX1gIH0sXG4gICAgICAgICAgICAgICAgICAgIFBST0pFQ1RfU1RBR0U6IHsgdmFsdWU6IGAke2FwcENvbmZpZy5Qcm9qZWN0LlN0YWdlfWAgfSxcbiAgICAgICAgICAgICAgICAgICAgUFJPSkVDVF9QUkVGSVg6IHsgdmFsdWU6IGAke3RoaXMucHJvamVjdFByZWZpeH1gIH0sXG4gICAgICAgICAgICAgICAgICAgIEFQUF9DT05GSUc6IHsgdmFsdWU6IGJ1aWxkUHJvcHMuQXBwQ29uZmlnRmlsZSB9LFxuICAgICAgICAgICAgICAgICAgICBBU1NVTUVfUk9MRV9BUk46IHsgdmFsdWU6IGJ1aWxkUHJvcHMuQnVpbGRBc3N1bWVSb2xlQXJuID8gYnVpbGRQcm9wcy5CdWlsZEFzc3VtZVJvbGVBcm4gOiAnJyB9LFxuICAgICAgICAgICAgICAgICAgICBPTl9QSVBFTElORTogeyB2YWx1ZTogJ1lFUycgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgYnVpbGRTcGVjOiBidWlsZFNwZWMsXG4gICAgICAgICAgICAgICAgdGltZW91dDogY2RrLkR1cmF0aW9uLm1pbnV0ZXMoNjApXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcHJvamVjdC5hZGRUb1JvbGVQb2xpY3kodGhpcy5nZXREZXBsb3lDb21tb25Qb2xpY3koKSk7XG4gICAgICAgICAgICBpZiAoYnVpbGRQb2xpY2llcykge1xuICAgICAgICAgICAgICAgIGJ1aWxkUG9saWNpZXMuZm9yRWFjaChwb2xpY3kgPT4gcHJvamVjdC5hZGRUb1JvbGVQb2xpY3kocG9saWN5KSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHByb2plY3Qucm9sZT8uYWRkTWFuYWdlZFBvbGljeShpYW0uTWFuYWdlZFBvbGljeS5mcm9tQXdzTWFuYWdlZFBvbGljeU5hbWUoJ0FkbWluaXN0cmF0b3JBY2Nlc3MnKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHRoaXMuYnVpbGRPdXRwdXQgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KGAke2FjdGlvblByb3BzLk5hbWV9QnVpbGRPdXRwdXRgKTtcblxuICAgICAgICAgICAgYnVpbGRBY3Rpb24gPSBuZXcgY29kZXBpcGVsaW5lX2FjdGlvbnMuQ29kZUJ1aWxkQWN0aW9uKHtcbiAgICAgICAgICAgICAgICBhY3Rpb25OYW1lOiBhY3Rpb25Qcm9wcy5OYW1lLFxuICAgICAgICAgICAgICAgIHByb2plY3QsXG4gICAgICAgICAgICAgICAgaW5wdXQ6IHRoaXMuc291cmNlT3V0cHV0LFxuICAgICAgICAgICAgICAgIC8vIG91dHB1dHM6IFt0aGlzLmJ1aWxkT3V0cHV0XSxcbiAgICAgICAgICAgICAgICBydW5PcmRlcjogYWN0aW9uUHJvcHMuT3JkZXJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGJ1aWxkQWN0aW9uO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlQnVpbGRTcGVjVXNpbmdDb21tYW5kcyhidWlsZENvbW1hbmRzOiBzdHJpbmdbXSwgYXNzdW1lUm9sZUVuYWJsZTogYm9vbGVhbik6IGNvZGVidWlsZC5CdWlsZFNwZWMge1xuICAgICAgICBjb25zdCBidWlsZFNwZWMgPSBjb2RlYnVpbGQuQnVpbGRTcGVjLmZyb21PYmplY3QoXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdmVyc2lvbjogXCIwLjJcIixcbiAgICAgICAgICAgICAgICBwaGFzZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgaW5zdGFsbDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2NvZGVidWlsZC9sYXRlc3QvdXNlcmd1aWRlL3J1bnRpbWUtdmVyc2lvbnMuaHRtbFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3J1bnRpbWUtdmVyc2lvbnMnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZWpzOiAxNFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1hbmRzOiB0aGlzLmNyZWF0ZUluc3RhbGxDb21tYW5kcyhhc3N1bWVSb2xlRW5hYmxlLCBmYWxzZSlcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgcHJlX2J1aWxkOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tYW5kczogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdwd2QnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdscyAtbCdcbiAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgYnVpbGQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1hbmRzOiBidWlsZENvbW1hbmRzXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHBvc3RfYnVpbGQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1hbmRzOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3B3ZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2xzIC1sJ1xuICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBhcnRpZmFjdHM6IHtcbiAgICAgICAgICAgICAgICAgICAgZmlsZXM6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICcqKi8qJ1xuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAnZXhjbHVkZS1wYXRocyc6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICdjZGsub3V0LycsXG4gICAgICAgICAgICAgICAgICAgICAgICAnbm9kZV9tb2R1bGVzLycsXG4gICAgICAgICAgICAgICAgICAgICAgICAnLmdpdC8nXG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiBidWlsZFNwZWM7XG4gICAgfVxuXG4gICAgLy8gaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2NvZGVidWlsZC9sYXRlc3QvdXNlcmd1aWRlL2J1aWxkLXNwZWMtcmVmLmh0bWxcbiAgICBwcml2YXRlIGNyZWF0ZUJ1aWxkU3BlY1VzaW5nU3RhY2tOYW1lKHByb3BzOiBCdWlsZERlcGxveVN0YWNrc1Byb3BzLCBhc3N1bWVSb2xlRW5hYmxlOiBib29sZWFuKTogY29kZWJ1aWxkLkJ1aWxkU3BlYyB7XG4gICAgICAgIGNvbnN0IGNka0RlcGxveVN0YWNrc0NvbW1hbmRzID0gcHJvcHMuU3RhY2tOYW1lTGlzdC5tYXAoc3RhY2tOYW1lID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGFyZ3MgPSBzdGFja05hbWUudHJpbSgpLnNwbGl0KCcgJyk7XG4gICAgICAgICAgICBjb25zdCBwdXJlU3RhY2tOYW1lID0gYXJnc1swXTtcbiAgICAgICAgICAgIGFyZ3NbMF0gPSBgY2RrIGRlcGxveSAqJHtwdXJlU3RhY2tOYW1lfSogLS1yZXF1aXJlLWFwcHJvdmFsIG5ldmVyYDtcbiAgICAgICAgICAgIHJldHVybiBhcmdzLmpvaW4oJyAnKTtcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICBjb25zdCBidWlsZFNwZWMgPSBjb2RlYnVpbGQuQnVpbGRTcGVjLmZyb21PYmplY3QoXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdmVyc2lvbjogXCIwLjJcIixcbiAgICAgICAgICAgICAgICBwaGFzZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgaW5zdGFsbDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3J1bnRpbWUtdmVyc2lvbnMnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZWpzOiAxNFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1hbmRzOiB0aGlzLmNyZWF0ZUluc3RhbGxDb21tYW5kcyhhc3N1bWVSb2xlRW5hYmxlLCB0cnVlKVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBwcmVfYnVpbGQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1hbmRzOiBwcm9wcy5QcmVDb21tYW5kc1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBidWlsZDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tbWFuZHM6IGNka0RlcGxveVN0YWNrc0NvbW1hbmRzXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHBvc3RfYnVpbGQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1hbmRzOiBwcm9wcy5Qb3N0Q29tbWFuZHNcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgYXJ0aWZhY3RzOiB7XG4gICAgICAgICAgICAgICAgICAgIGZpbGVzOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAnKiovKidcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgJ2V4Y2x1ZGUtcGF0aHMnOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAnY2RrLm91dC8nLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ25vZGVfbW9kdWxlcy8nLFxuICAgICAgICAgICAgICAgICAgICAgICAgJy5naXQvJ1xuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBidWlsZFNwZWM7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVBY3Rpb25EZXBsb3lTM0J1Y2tldChhY3Rpb25OYW1lOiBzdHJpbmcsIHByb3BzOiBEZXBsb3lLaW5kUzNCdWNrZXRQcm9wcywgcnVuT3JkZXI/OiBudW1iZXIpOiBjb2RlcGlwZWxpbmUuSUFjdGlvbiB7XG4gICAgICAgIGNvbnN0IGJ1Y2tldCA9IHMzLkJ1Y2tldC5mcm9tQnVja2V0QXR0cmlidXRlcyh0aGlzLCBgJHthY3Rpb25OYW1lfURlcGxveVMzQnVja2V0YCwge1xuICAgICAgICAgICAgYnVja2V0TmFtZTogcHJvcHMuQnVja2V0TmFtZSxcbiAgICAgICAgICAgIGFjY291bnQ6IHByb3BzLkFjY291bnQsXG4gICAgICAgICAgICByZWdpb246IHByb3BzLlJlZ2lvblxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBhY3Rpb24gPSBuZXcgY29kZXBpcGVsaW5lX2FjdGlvbnMuUzNEZXBsb3lBY3Rpb24oe1xuICAgICAgICAgICAgYWN0aW9uTmFtZTogYWN0aW9uTmFtZSxcbiAgICAgICAgICAgIGlucHV0OiB0aGlzLmJ1aWxkT3V0cHV0LFxuICAgICAgICAgICAgYnVja2V0XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBhY3Rpb247XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVJbnN0YWxsQ29tbWFuZHMoYXNzdW1lUm9sZUVuYWJsZTogYm9vbGVhbiwgc2V0dXBFbmFibGU6IGJvb2xlYW4pOiBzdHJpbmdbXSB7XG4gICAgICAgIGxldCBjb21tYW5kczogc3RyaW5nW10gPSBbXTtcblxuICAgICAgICBjb25zdCBhc3N1bWVSb2xlQ29tbWFuZHMgPSBbXG4gICAgICAgICAgICAnY3JlZHM9JChta3RlbXAgLWQpL2NyZWRzLmpzb24nLFxuICAgICAgICAgICAgJ2F3cyBzdHMgYXNzdW1lLXJvbGUgLS1yb2xlLWFybiAkQVNTVU1FX1JPTEVfQVJOIC0tcm9sZS1zZXNzaW9uLW5hbWUgYXNzdW1lX3JvbGUgPiAkY3JlZHMnLFxuICAgICAgICAgICAgYGV4cG9ydCBBV1NfQUNDRVNTX0tFWV9JRD0kKGNhdCAkY3JlZHMgfCBncmVwIFwiQWNjZXNzS2V5SWRcIiB8IGN1dCAtZCAnXCInIC1mIDQpYCxcbiAgICAgICAgICAgIGBleHBvcnQgQVdTX1NFQ1JFVF9BQ0NFU1NfS0VZPSQoY2F0ICRjcmVkcyB8IGdyZXAgXCJTZWNyZXRBY2Nlc3NLZXlcIiB8IGN1dCAtZCAnXCInIC1mIDQpYCxcbiAgICAgICAgICAgIGBleHBvcnQgQVdTX1NFU1NJT05fVE9LRU49JChjYXQgJGNyZWRzIHwgZ3JlcCBcIlNlc3Npb25Ub2tlblwiIHwgY3V0IC1kICdcIicgLWYgNClgLFxuICAgICAgICBdXG5cbiAgICAgICAgY29uc3Qgc2V0dXBJbnN0YWxsQ29tbWFuZHMgPSBbXG4gICAgICAgICAgICBgbnBtIGluc3RhbGwgLWcgYXdzLWNkayR7Q0RLX1ZFUn1gLFxuICAgICAgICAgICAgJ25wbSBpbnN0YWxsJ1xuICAgICAgICBdXG5cbiAgICAgICAgaWYgKGFzc3VtZVJvbGVFbmFibGUpIHtcbiAgICAgICAgICAgIGNvbW1hbmRzID0gY29tbWFuZHMuY29uY2F0KGFzc3VtZVJvbGVDb21tYW5kcyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNldHVwRW5hYmxlKSB7XG4gICAgICAgICAgICBjb21tYW5kcyA9IGNvbW1hbmRzLmNvbmNhdChzZXR1cEluc3RhbGxDb21tYW5kcyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY29tbWFuZHM7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXREZXBsb3lDb21tb25Qb2xpY3koKTogaWFtLlBvbGljeVN0YXRlbWVudCB7XG4gICAgICAgIGNvbnN0IHN0YXRlbWVudCA9IG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KCk7XG4gICAgICAgIHN0YXRlbWVudC5hZGRBY3Rpb25zKFxuICAgICAgICAgICAgXCJjbG91ZGZvcm1hdGlvbjoqXCIsXG4gICAgICAgICAgICBcImxhbWJkYToqXCIsXG4gICAgICAgICAgICBcInMzOipcIixcbiAgICAgICAgICAgIFwic3NtOipcIixcbiAgICAgICAgICAgIFwiaWFtOlBhc3NSb2xlXCIsXG4gICAgICAgICAgICBcImttczoqXCIsXG4gICAgICAgICAgICBcImV2ZW50czoqXCIsXG4gICAgICAgICAgICBcInN0czpBc3N1bWVSb2xlXCJcbiAgICAgICAgKTtcbiAgICAgICAgc3RhdGVtZW50LmFkZFJlc291cmNlcyhcIipcIik7XG4gICAgICAgIHJldHVybiBzdGF0ZW1lbnQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZWdpc3RlckV2ZW50TGFtYmRhKGFjdGlvblByb3BzOiBBY3Rpb25Qcm9wcywgYWN0aW9uOiBjb2RlcGlwZWxpbmUuSUFjdGlvbikge1xuICAgICAgICBpZiAoYWN0aW9uUHJvcHMuRXZlbnRTdGF0ZUxhbWJkYVxuICAgICAgICAgICAgJiYgYWN0aW9uUHJvcHMuRXZlbnRTdGF0ZUxhbWJkYS5Db2RlUGF0aCAmJiBhY3Rpb25Qcm9wcy5FdmVudFN0YXRlTGFtYmRhLkNvZGVQYXRoLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICYmIGFjdGlvblByb3BzLkV2ZW50U3RhdGVMYW1iZGEuSGFuZGxlciAmJiBhY3Rpb25Qcm9wcy5FdmVudFN0YXRlTGFtYmRhLkhhbmRsZXIubGVuZ3RoID4gMCkge1xuXG4gICAgICAgICAgICBhY3Rpb24/Lm9uU3RhdGVDaGFuZ2UoXG4gICAgICAgICAgICAgICAgYCR7YWN0aW9uUHJvcHMuU3RhZ2V9LSR7YWN0aW9uUHJvcHMuTmFtZX0tRXZlbnRTdGF0ZWAsXG4gICAgICAgICAgICAgICAgbmV3IHRhcmdldHMuTGFtYmRhRnVuY3Rpb24odGhpcy5jcmVhdGVFdmVudFN0YXRlTGFtYmRhKGAke2FjdGlvblByb3BzLlN0YWdlfS0ke2FjdGlvblByb3BzLk5hbWV9LUV2ZW50U3RhdGVMYW1iZGFgLFxuICAgICAgICAgICAgICAgICAgICBhY3Rpb25Qcm9wcy5FdmVudFN0YXRlTGFtYmRhKSkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVFdmVudFN0YXRlTGFtYmRhKGJhc2VOYW1lOiBzdHJpbmcsIHByb3BzOiBFdmVudFN0YXRlTGFtYmRhUHJvcHMpOiBsYW1iZGEuRnVuY3Rpb24ge1xuICAgICAgICBjb25zdCBmdW5jID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCBiYXNlTmFtZSwge1xuICAgICAgICAgICAgZnVuY3Rpb25OYW1lOiBgJHt0aGlzLnByb2plY3RQcmVmaXh9LSR7YmFzZU5hbWV9YCxcbiAgICAgICAgICAgIHJ1bnRpbWU6IG5ldyBsYW1iZGEuUnVudGltZShwcm9wcy5SdW50aW1lKSxcbiAgICAgICAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldChwcm9wcy5Db2RlUGF0aCksXG4gICAgICAgICAgICBoYW5kbGVyOiBwcm9wcy5IYW5kbGVyXG4gICAgICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIGZ1bmM7XG4gICAgfVxufVxuIl19