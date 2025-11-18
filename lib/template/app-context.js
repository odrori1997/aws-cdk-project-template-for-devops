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
exports.AppContext = exports.ProjectPrefixType = exports.AppContextError = void 0;
const fs = __importStar(require("fs"));
const env = __importStar(require("env-var"));
const cdk = __importStar(require("aws-cdk-lib"));
class AppContextError extends Error {
    constructor(message) {
        super(message);
        this.name = "AppConfigFileFailError";
    }
}
exports.AppContextError = AppContextError;
var ProjectPrefixType;
(function (ProjectPrefixType) {
    ProjectPrefixType[ProjectPrefixType["NameStage"] = 0] = "NameStage";
    ProjectPrefixType[ProjectPrefixType["NameHyphenStage"] = 1] = "NameHyphenStage";
    ProjectPrefixType[ProjectPrefixType["Name"] = 2] = "Name";
})(ProjectPrefixType = exports.ProjectPrefixType || (exports.ProjectPrefixType = {}));
class AppContext {
    constructor(props) {
        this.cdkApp = new cdk.App();
        this.appContextProps = props;
        try {
            const appConfigFile = this.findAppConfigFile(props.appConfigFileKey);
            this.appConfig = this.loadAppConfigFile(appConfigFile, props.contextArgs);
            if (this.appConfig != undefined) {
                this.stackCommonProps = this.createStackCommonProps(appConfigFile);
            }
        }
        catch (e) {
            console.error(`==> CDK App-Config File is empty, 
            set up your environment variable(Usage: export ${props.appConfigFileKey}=config/app-config-xxx.json) 
            or append inline-argurment(Usage: cdk list --context ${props.appConfigFileKey}=config/app-config-xxx.json)`, e);
            throw new AppContextError('Fail to find App-Config json file');
        }
    }
    ready() {
        return this.stackCommonProps ? true : false;
    }
    createStackCommonProps(appConfigFile) {
        const stackProps = {
            projectPrefix: this.getProjectPrefix(this.appConfig.Project.Name, this.appConfig.Project.Stage),
            appConfig: this.appConfig,
            appConfigPath: appConfigFile,
            env: {
                account: this.appConfig.Project.Account,
                region: this.appConfig.Project.Region
            },
            variables: {}
        };
        return stackProps;
    }
    findAppConfigFile(appConfigKey) {
        let fromType = 'InLine-Argument';
        let configFilePath = this.cdkApp.node.tryGetContext(appConfigKey);
        if (configFilePath == undefined) {
            configFilePath = env.get(appConfigKey).asString();
            if (configFilePath != undefined && configFilePath.length > 0) {
                fromType = 'Environment-Variable';
            }
            else {
                configFilePath = undefined;
            }
        }
        if (configFilePath == undefined) {
            throw new Error('Fail to find App-Config json file');
        }
        else {
            console.info(`==> CDK App-Config File is ${configFilePath}, which is from ${fromType}.`);
        }
        return configFilePath;
    }
    getProjectPrefix(projectName, projectStage) {
        let prefix = `${projectName}${projectStage}`;
        if (this.appContextProps.projectPrefixType === ProjectPrefixType.NameHyphenStage) {
            prefix = `${projectName}-${projectStage}`;
        }
        else if (this.appContextProps.projectPrefixType === ProjectPrefixType.Name) {
            prefix = projectName;
        }
        return prefix;
    }
    loadAppConfigFile(filePath, contextArgs) {
        let appConfig = JSON.parse(fs.readFileSync(filePath).toString());
        let projectPrefix = this.getProjectPrefix(appConfig.Project.Name, appConfig.Project.Stage);
        if (contextArgs != undefined) {
            this.updateContextArgs(appConfig, contextArgs);
        }
        this.addPrefixIntoStackName(appConfig, projectPrefix);
        return appConfig;
    }
    updateContextArgs(appConfig, contextArgs) {
        for (let key of contextArgs) {
            const jsonKeys = key.split('.');
            let oldValue = undefined;
            const newValue = this.cdkApp.node.tryGetContext(key);
            if (newValue != undefined && jsonKeys.length > 0) {
                try {
                    oldValue = jsonKeys.reduce((reducer, pointer) => reducer.hasOwnProperty(pointer) ? reducer[pointer] : undefined, appConfig);
                }
                catch (e) {
                    console.error(`[ERROR] updateContextArgs: This key[${key}] is an undefined value in Json-Config file.\n`, e);
                    throw e;
                }
                jsonKeys.reduce((reducer, pointer, count) => {
                    if (count == jsonKeys.length - 1)
                        reducer[pointer] = newValue;
                    return reducer[pointer];
                }, appConfig);
                console.info(`[INFO] updateContextArgs: Updated ${key} = ${oldValue}-->${newValue}`);
            }
        }
    }
    addPrefixIntoStackName(appConfig, projectPrefix) {
        for (const key in appConfig.Stack) {
            const stackOriginalName = appConfig.Stack[key].Name;
            appConfig.Stack[key].ShortStackName = stackOriginalName;
            appConfig.Stack[key].Name = `${projectPrefix}-${stackOriginalName}`;
        }
    }
}
exports.AppContext = AppContext;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLWNvbnRleHQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhcHAtY29udGV4dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFSCx1Q0FBeUI7QUFDekIsNkNBQStCO0FBQy9CLGlEQUFtQztBQU1uQyxNQUFhLGVBQWdCLFNBQVEsS0FBSztJQUN0QyxZQUFZLE9BQWU7UUFDdkIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2YsSUFBSSxDQUFDLElBQUksR0FBRyx3QkFBd0IsQ0FBQztJQUN6QyxDQUFDO0NBQ0o7QUFMRCwwQ0FLQztBQUVELElBQVksaUJBSVg7QUFKRCxXQUFZLGlCQUFpQjtJQUN6QixtRUFBUyxDQUFBO0lBQ1QsK0VBQWUsQ0FBQTtJQUNmLHlEQUFJLENBQUE7QUFDUixDQUFDLEVBSlcsaUJBQWlCLEdBQWpCLHlCQUFpQixLQUFqQix5QkFBaUIsUUFJNUI7QUFRRCxNQUFhLFVBQVU7SUFPbkIsWUFBWSxLQUFzQjtRQUM5QixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQzVCLElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDO1FBRTdCLElBQUk7WUFDQSxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFFckUsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsYUFBYSxFQUFFLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUUxRSxJQUFJLElBQUksQ0FBQyxTQUFTLElBQUksU0FBUyxFQUFFO2dCQUM3QixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUFDLGFBQWEsQ0FBQyxDQUFDO2FBQ3RFO1NBRUo7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNSLE9BQU8s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LE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUM1QixDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7Z0JBRWQsT0FBTyxDQUFDLElBQUksQ0FBQyxxQ0FBcUMsR0FBRyxNQUFNLFFBQVEsTUFBTSxRQUFRLEVBQUUsQ0FBQyxDQUFDO2FBQ3hGO1NBQ0o7SUFDTCxDQUFDO0lBRU8sc0JBQXNCLENBQUMsU0FBYyxFQUFFLGFBQXFCO1FBQ2hFLEtBQUssTUFBTSxHQUFHLElBQUksU0FBUyxDQUFDLEtBQUssRUFBRTtZQUMvQixNQUFNLGlCQUFpQixHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQ3BELFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsY0FBYyxHQUFHLGlCQUFpQixDQUFDO1lBQ3hELFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLEdBQUcsYUFBYSxJQUFJLGlCQUFpQixFQUFFLENBQUM7U0FDdkU7SUFDTCxDQUFDO0NBQ0o7QUE5SEQsZ0NBOEhDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCBBbWF6b24uY29tLCBJbmMuIG9yIGl0cyBhZmZpbGlhdGVzLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVC0wXG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weSBvZiB0aGlzXG4gKiBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmVcbiAqIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSxcbiAqIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG9cbiAqIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzby5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SIElNUExJRUQsXG4gKiBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQVxuICogUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVFxuICogSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OXG4gKiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEVcbiAqIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICovXG5cbmltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcbmltcG9ydCAqIGFzIGVudiBmcm9tICdlbnYtdmFyJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5cbmltcG9ydCB7IEFwcENvbmZpZyB9IGZyb20gJy4vYXBwLWNvbmZpZyc7XG5pbXBvcnQgeyBTdGFja0NvbW1vblByb3BzIH0gZnJvbSAnLi9zdGFjay9iYXNlL2Jhc2Utc3RhY2snO1xuXG5cbmV4cG9ydCBjbGFzcyBBcHBDb250ZXh0RXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gICAgY29uc3RydWN0b3IobWVzc2FnZTogc3RyaW5nKSB7XG4gICAgICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgICAgICB0aGlzLm5hbWUgPSBcIkFwcENvbmZpZ0ZpbGVGYWlsRXJyb3JcIjtcbiAgICB9XG59XG5cbmV4cG9ydCBlbnVtIFByb2plY3RQcmVmaXhUeXBlIHtcbiAgICBOYW1lU3RhZ2UsXG4gICAgTmFtZUh5cGhlblN0YWdlLFxuICAgIE5hbWVcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBcHBDb250ZXh0UHJvcHMge1xuICAgIGFwcENvbmZpZ0ZpbGVLZXk6IHN0cmluZztcbiAgICBjb250ZXh0QXJncz86IHN0cmluZ1tdO1xuICAgIHByb2plY3RQcmVmaXhUeXBlPzogUHJvamVjdFByZWZpeFR5cGU7XG59XG5cbmV4cG9ydCBjbGFzcyBBcHBDb250ZXh0IHtcbiAgICBwdWJsaWMgcmVhZG9ubHkgY2RrQXBwOiBjZGsuQXBwO1xuICAgIHB1YmxpYyByZWFkb25seSBhcHBDb25maWc6IEFwcENvbmZpZztcbiAgICBwdWJsaWMgcmVhZG9ubHkgc3RhY2tDb21tb25Qcm9wczogU3RhY2tDb21tb25Qcm9wcztcblxuICAgIHByaXZhdGUgcmVhZG9ubHkgYXBwQ29udGV4dFByb3BzOiBBcHBDb250ZXh0UHJvcHM7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wczogQXBwQ29udGV4dFByb3BzKSB7XG4gICAgICAgIHRoaXMuY2RrQXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICAgICAgdGhpcy5hcHBDb250ZXh0UHJvcHMgPSBwcm9wcztcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgYXBwQ29uZmlnRmlsZSA9IHRoaXMuZmluZEFwcENvbmZpZ0ZpbGUocHJvcHMuYXBwQ29uZmlnRmlsZUtleSk7XG5cbiAgICAgICAgICAgIHRoaXMuYXBwQ29uZmlnID0gdGhpcy5sb2FkQXBwQ29uZmlnRmlsZShhcHBDb25maWdGaWxlLCBwcm9wcy5jb250ZXh0QXJncyk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmFwcENvbmZpZyAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YWNrQ29tbW9uUHJvcHMgPSB0aGlzLmNyZWF0ZVN0YWNrQ29tbW9uUHJvcHMoYXBwQ29uZmlnRmlsZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihgPT0+IENESyBBcHAtQ29uZmlnIEZpbGUgaXMgZW1wdHksIFxuICAgICAgICAgICAgc2V0IHVwIHlvdXIgZW52aXJvbm1lbnQgdmFyaWFibGUoVXNhZ2U6IGV4cG9ydCAke3Byb3BzLmFwcENvbmZpZ0ZpbGVLZXl9PWNvbmZpZy9hcHAtY29uZmlnLXh4eC5qc29uKSBcbiAgICAgICAgICAgIG9yIGFwcGVuZCBpbmxpbmUtYXJndXJtZW50KFVzYWdlOiBjZGsgbGlzdCAtLWNvbnRleHQgJHtwcm9wcy5hcHBDb25maWdGaWxlS2V5fT1jb25maWcvYXBwLWNvbmZpZy14eHguanNvbilgLCBlKTtcbiAgICAgICAgICAgIHRocm93IG5ldyBBcHBDb250ZXh0RXJyb3IoJ0ZhaWwgdG8gZmluZCBBcHAtQ29uZmlnIGpzb24gZmlsZScpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHJlYWR5KCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5zdGFja0NvbW1vblByb3BzID8gdHJ1ZSA6IGZhbHNlO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlU3RhY2tDb21tb25Qcm9wcyhhcHBDb25maWdGaWxlOiBzdHJpbmcpOiBTdGFja0NvbW1vblByb3BzIHtcbiAgICAgICAgY29uc3Qgc3RhY2tQcm9wczogU3RhY2tDb21tb25Qcm9wcyA9IHtcbiAgICAgICAgICAgIHByb2plY3RQcmVmaXg6IHRoaXMuZ2V0UHJvamVjdFByZWZpeCh0aGlzLmFwcENvbmZpZy5Qcm9qZWN0Lk5hbWUsIHRoaXMuYXBwQ29uZmlnLlByb2plY3QuU3RhZ2UpLFxuICAgICAgICAgICAgYXBwQ29uZmlnOiB0aGlzLmFwcENvbmZpZyxcbiAgICAgICAgICAgIGFwcENvbmZpZ1BhdGg6IGFwcENvbmZpZ0ZpbGUsXG4gICAgICAgICAgICBlbnY6IHtcbiAgICAgICAgICAgICAgICBhY2NvdW50OiB0aGlzLmFwcENvbmZpZy5Qcm9qZWN0LkFjY291bnQsXG4gICAgICAgICAgICAgICAgcmVnaW9uOiB0aGlzLmFwcENvbmZpZy5Qcm9qZWN0LlJlZ2lvblxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHZhcmlhYmxlczoge31cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzdGFja1Byb3BzO1xuICAgIH1cblxuICAgIHByaXZhdGUgZmluZEFwcENvbmZpZ0ZpbGUoYXBwQ29uZmlnS2V5OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICBsZXQgZnJvbVR5cGUgPSAnSW5MaW5lLUFyZ3VtZW50JztcbiAgICAgICAgbGV0IGNvbmZpZ0ZpbGVQYXRoID0gdGhpcy5jZGtBcHAubm9kZS50cnlHZXRDb250ZXh0KGFwcENvbmZpZ0tleSk7XG5cbiAgICAgICAgaWYgKGNvbmZpZ0ZpbGVQYXRoID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uZmlnRmlsZVBhdGggPSBlbnYuZ2V0KGFwcENvbmZpZ0tleSkuYXNTdHJpbmcoKTtcblxuICAgICAgICAgICAgaWYgKGNvbmZpZ0ZpbGVQYXRoICE9IHVuZGVmaW5lZCAmJiBjb25maWdGaWxlUGF0aC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgZnJvbVR5cGUgPSAnRW52aXJvbm1lbnQtVmFyaWFibGUnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25maWdGaWxlUGF0aCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb25maWdGaWxlUGF0aCA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRmFpbCB0byBmaW5kIEFwcC1Db25maWcganNvbiBmaWxlJylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbyhgPT0+IENESyBBcHAtQ29uZmlnIEZpbGUgaXMgJHtjb25maWdGaWxlUGF0aH0sIHdoaWNoIGlzIGZyb20gJHtmcm9tVHlwZX0uYCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY29uZmlnRmlsZVBhdGg7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRQcm9qZWN0UHJlZml4KHByb2plY3ROYW1lOiBzdHJpbmcsIHByb2plY3RTdGFnZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgbGV0IHByZWZpeCA9IGAke3Byb2plY3ROYW1lfSR7cHJvamVjdFN0YWdlfWA7XG5cbiAgICAgICAgaWYgKHRoaXMuYXBwQ29udGV4dFByb3BzLnByb2plY3RQcmVmaXhUeXBlID09PSBQcm9qZWN0UHJlZml4VHlwZS5OYW1lSHlwaGVuU3RhZ2UpIHtcbiAgICAgICAgICAgIHByZWZpeCA9IGAke3Byb2plY3ROYW1lfS0ke3Byb2plY3RTdGFnZX1gO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuYXBwQ29udGV4dFByb3BzLnByb2plY3RQcmVmaXhUeXBlID09PSBQcm9qZWN0UHJlZml4VHlwZS5OYW1lKSB7XG4gICAgICAgICAgICBwcmVmaXggPSBwcm9qZWN0TmFtZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwcmVmaXg7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBsb2FkQXBwQ29uZmlnRmlsZShmaWxlUGF0aDogc3RyaW5nLCBjb250ZXh0QXJncz86IHN0cmluZ1tdKTogYW55IHtcbiAgICAgICAgbGV0IGFwcENvbmZpZyA9IEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGZpbGVQYXRoKS50b1N0cmluZygpKTtcbiAgICAgICAgbGV0IHByb2plY3RQcmVmaXggPSB0aGlzLmdldFByb2plY3RQcmVmaXgoYXBwQ29uZmlnLlByb2plY3QuTmFtZSwgYXBwQ29uZmlnLlByb2plY3QuU3RhZ2UpO1xuXG4gICAgICAgIGlmIChjb250ZXh0QXJncyAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQ29udGV4dEFyZ3MoYXBwQ29uZmlnLCBjb250ZXh0QXJncyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmFkZFByZWZpeEludG9TdGFja05hbWUoYXBwQ29uZmlnLCBwcm9qZWN0UHJlZml4KTtcblxuICAgICAgICByZXR1cm4gYXBwQ29uZmlnO1xuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlQ29udGV4dEFyZ3MoYXBwQ29uZmlnOiBhbnksIGNvbnRleHRBcmdzOiBzdHJpbmdbXSkge1xuICAgICAgICBmb3IgKGxldCBrZXkgb2YgY29udGV4dEFyZ3MpIHtcbiAgICAgICAgICAgIGNvbnN0IGpzb25LZXlzID0ga2V5LnNwbGl0KCcuJyk7XG4gICAgICAgICAgICBsZXQgb2xkVmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjb25zdCBuZXdWYWx1ZTogc3RyaW5nID0gdGhpcy5jZGtBcHAubm9kZS50cnlHZXRDb250ZXh0KGtleSk7XG4gICAgXG4gICAgICAgICAgICBpZiAobmV3VmFsdWUgIT0gdW5kZWZpbmVkICYmIGpzb25LZXlzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBvbGRWYWx1ZSA9IGpzb25LZXlzLnJlZHVjZSgocmVkdWNlcjogYW55LCBwb2ludGVyOiBzdHJpbmcpID0+IHJlZHVjZXIuaGFzT3duUHJvcGVydHkocG9pbnRlcikgPyByZWR1Y2VyW3BvaW50ZXJdIDogdW5kZWZpbmVkLCBhcHBDb25maWcpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGBbRVJST1JdIHVwZGF0ZUNvbnRleHRBcmdzOiBUaGlzIGtleVske2tleX1dIGlzIGFuIHVuZGVmaW5lZCB2YWx1ZSBpbiBKc29uLUNvbmZpZyBmaWxlLlxcbmAsIGUpO1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICAgICAgICBqc29uS2V5cy5yZWR1Y2UoKHJlZHVjZXI6IGFueSwgcG9pbnRlcjogc3RyaW5nLCBjb3VudDogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb3VudCA9PSBqc29uS2V5cy5sZW5ndGggLSAxKSByZWR1Y2VyW3BvaW50ZXJdID0gbmV3VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZWR1Y2VyW3BvaW50ZXJdO1xuICAgICAgICAgICAgICAgIH0sIGFwcENvbmZpZyk7XG4gICAgXG4gICAgICAgICAgICAgICAgY29uc29sZS5pbmZvKGBbSU5GT10gdXBkYXRlQ29udGV4dEFyZ3M6IFVwZGF0ZWQgJHtrZXl9ID0gJHtvbGRWYWx1ZX0tLT4ke25ld1ZhbHVlfWApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhZGRQcmVmaXhJbnRvU3RhY2tOYW1lKGFwcENvbmZpZzogYW55LCBwcm9qZWN0UHJlZml4OiBzdHJpbmcpIHtcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gYXBwQ29uZmlnLlN0YWNrKSB7XG4gICAgICAgICAgICBjb25zdCBzdGFja09yaWdpbmFsTmFtZSA9IGFwcENvbmZpZy5TdGFja1trZXldLk5hbWU7XG4gICAgICAgICAgICBhcHBDb25maWcuU3RhY2tba2V5XS5TaG9ydFN0YWNrTmFtZSA9IHN0YWNrT3JpZ2luYWxOYW1lO1xuICAgICAgICAgICAgYXBwQ29uZmlnLlN0YWNrW2tleV0uTmFtZSA9IGAke3Byb2plY3RQcmVmaXh9LSR7c3RhY2tPcmlnaW5hbE5hbWV9YDtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==