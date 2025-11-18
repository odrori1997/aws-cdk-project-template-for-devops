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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLWNvbnRleHQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvdGVtcGxhdGUvYXBwLWNvbnRleHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsdUNBQXlCO0FBQ3pCLDZDQUErQjtBQUMvQixpREFBbUM7QUFNbkMsTUFBYSxlQUFnQixTQUFRLEtBQUs7SUFDdEMsWUFBWSxPQUFlO1FBQ3ZCLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNmLElBQUksQ0FBQyxJQUFJLEdBQUcsd0JBQXdCLENBQUM7SUFDekMsQ0FBQztDQUNKO0FBTEQsMENBS0M7QUFFRCxJQUFZLGlCQUlYO0FBSkQsV0FBWSxpQkFBaUI7SUFDekIsbUVBQVMsQ0FBQTtJQUNULCtFQUFlLENBQUE7SUFDZix5REFBSSxDQUFBO0FBQ1IsQ0FBQyxFQUpXLGlCQUFpQixHQUFqQix5QkFBaUIsS0FBakIseUJBQWlCLFFBSTVCO0FBUUQsTUFBYSxVQUFVO0lBT25CLFlBQVksS0FBc0I7UUFDOUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUM1QixJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQztRQUU3QixJQUFJO1lBQ0EsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBRXJFLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7WUFFMUUsSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLFNBQVMsRUFBRTtnQkFDN0IsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxhQUFhLENBQUMsQ0FBQzthQUN0RTtTQUVKO1FBQUMsT0FB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LEdBQUcsUUFBUSxDQUFDO29CQUM5RCxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDNUIsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO2dCQUVkLE9BQU8sQ0FBQyxJQUFJLENBQUMscUNBQXFDLEdBQUcsTUFBTSxRQUFRLE1BQU0sUUFBUSxFQUFFLENBQUMsQ0FBQzthQUN4RjtTQUNKO0lBQ0wsQ0FBQztJQUVPLHNCQUFzQixDQUFDLFNBQWMsRUFBRSxhQUFxQjtRQUNoRSxLQUFLLE1BQU0sR0FBRyxJQUFJLFNBQVMsQ0FBQyxLQUFLLEVBQUU7WUFDL0IsTUFBTSxpQkFBaUIsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUNwRCxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLGNBQWMsR0FBRyxpQkFBaUIsQ0FBQztZQUN4RCxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxHQUFHLGFBQWEsSUFBSSxpQkFBaUIsRUFBRSxDQUFDO1NBQ3ZFO0lBQ0wsQ0FBQztDQUNKO0FBOUhELGdDQThIQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgQW1hem9uLmNvbSwgSW5jLiBvciBpdHMgYWZmaWxpYXRlcy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBNSVQtMFxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpc1xuICogc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlXG4gKiB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksXG4gKiBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvXG4gKiBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28uXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUiBJTVBMSUVELFxuICogSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEFcbiAqIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFRcbiAqIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTlxuICogT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFXG4gKiBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAqL1xuXG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5pbXBvcnQgKiBhcyBlbnYgZnJvbSAnZW52LXZhcic7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuXG5pbXBvcnQgeyBBcHBDb25maWcgfSBmcm9tICcuL2FwcC1jb25maWcnO1xuaW1wb3J0IHsgU3RhY2tDb21tb25Qcm9wcyB9IGZyb20gJy4vc3RhY2svYmFzZS9iYXNlLXN0YWNrJztcblxuXG5leHBvcnQgY2xhc3MgQXBwQ29udGV4dEVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2U6IHN0cmluZykge1xuICAgICAgICBzdXBlcihtZXNzYWdlKTtcbiAgICAgICAgdGhpcy5uYW1lID0gXCJBcHBDb25maWdGaWxlRmFpbEVycm9yXCI7XG4gICAgfVxufVxuXG5leHBvcnQgZW51bSBQcm9qZWN0UHJlZml4VHlwZSB7XG4gICAgTmFtZVN0YWdlLFxuICAgIE5hbWVIeXBoZW5TdGFnZSxcbiAgICBOYW1lXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQXBwQ29udGV4dFByb3BzIHtcbiAgICBhcHBDb25maWdGaWxlS2V5OiBzdHJpbmc7XG4gICAgY29udGV4dEFyZ3M/OiBzdHJpbmdbXTtcbiAgICBwcm9qZWN0UHJlZml4VHlwZT86IFByb2plY3RQcmVmaXhUeXBlO1xufVxuXG5leHBvcnQgY2xhc3MgQXBwQ29udGV4dCB7XG4gICAgcHVibGljIHJlYWRvbmx5IGNka0FwcDogY2RrLkFwcDtcbiAgICBwdWJsaWMgcmVhZG9ubHkgYXBwQ29uZmlnOiBBcHBDb25maWc7XG4gICAgcHVibGljIHJlYWRvbmx5IHN0YWNrQ29tbW9uUHJvcHM6IFN0YWNrQ29tbW9uUHJvcHM7XG5cbiAgICBwcml2YXRlIHJlYWRvbmx5IGFwcENvbnRleHRQcm9wczogQXBwQ29udGV4dFByb3BzO1xuXG4gICAgY29uc3RydWN0b3IocHJvcHM6IEFwcENvbnRleHRQcm9wcykge1xuICAgICAgICB0aGlzLmNka0FwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgICAgIHRoaXMuYXBwQ29udGV4dFByb3BzID0gcHJvcHM7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGFwcENvbmZpZ0ZpbGUgPSB0aGlzLmZpbmRBcHBDb25maWdGaWxlKHByb3BzLmFwcENvbmZpZ0ZpbGVLZXkpO1xuXG4gICAgICAgICAgICB0aGlzLmFwcENvbmZpZyA9IHRoaXMubG9hZEFwcENvbmZpZ0ZpbGUoYXBwQ29uZmlnRmlsZSwgcHJvcHMuY29udGV4dEFyZ3MpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5hcHBDb25maWcgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGFja0NvbW1vblByb3BzID0gdGhpcy5jcmVhdGVTdGFja0NvbW1vblByb3BzKGFwcENvbmZpZ0ZpbGUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYD09PiBDREsgQXBwLUNvbmZpZyBGaWxlIGlzIGVtcHR5LCBcbiAgICAgICAgICAgIHNldCB1cCB5b3VyIGVudmlyb25tZW50IHZhcmlhYmxlKFVzYWdlOiBleHBvcnQgJHtwcm9wcy5hcHBDb25maWdGaWxlS2V5fT1jb25maWcvYXBwLWNvbmZpZy14eHguanNvbikgXG4gICAgICAgICAgICBvciBhcHBlbmQgaW5saW5lLWFyZ3VybWVudChVc2FnZTogY2RrIGxpc3QgLS1jb250ZXh0ICR7cHJvcHMuYXBwQ29uZmlnRmlsZUtleX09Y29uZmlnL2FwcC1jb25maWcteHh4Lmpzb24pYCwgZSk7XG4gICAgICAgICAgICB0aHJvdyBuZXcgQXBwQ29udGV4dEVycm9yKCdGYWlsIHRvIGZpbmQgQXBwLUNvbmZpZyBqc29uIGZpbGUnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyByZWFkeSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhY2tDb21tb25Qcm9wcyA/IHRydWUgOiBmYWxzZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZVN0YWNrQ29tbW9uUHJvcHMoYXBwQ29uZmlnRmlsZTogc3RyaW5nKTogU3RhY2tDb21tb25Qcm9wcyB7XG4gICAgICAgIGNvbnN0IHN0YWNrUHJvcHM6IFN0YWNrQ29tbW9uUHJvcHMgPSB7XG4gICAgICAgICAgICBwcm9qZWN0UHJlZml4OiB0aGlzLmdldFByb2plY3RQcmVmaXgodGhpcy5hcHBDb25maWcuUHJvamVjdC5OYW1lLCB0aGlzLmFwcENvbmZpZy5Qcm9qZWN0LlN0YWdlKSxcbiAgICAgICAgICAgIGFwcENvbmZpZzogdGhpcy5hcHBDb25maWcsXG4gICAgICAgICAgICBhcHBDb25maWdQYXRoOiBhcHBDb25maWdGaWxlLFxuICAgICAgICAgICAgZW52OiB7XG4gICAgICAgICAgICAgICAgYWNjb3VudDogdGhpcy5hcHBDb25maWcuUHJvamVjdC5BY2NvdW50LFxuICAgICAgICAgICAgICAgIHJlZ2lvbjogdGhpcy5hcHBDb25maWcuUHJvamVjdC5SZWdpb25cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB2YXJpYWJsZXM6IHt9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc3RhY2tQcm9wcztcbiAgICB9XG5cbiAgICBwcml2YXRlIGZpbmRBcHBDb25maWdGaWxlKGFwcENvbmZpZ0tleTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgbGV0IGZyb21UeXBlID0gJ0luTGluZS1Bcmd1bWVudCc7XG4gICAgICAgIGxldCBjb25maWdGaWxlUGF0aCA9IHRoaXMuY2RrQXBwLm5vZGUudHJ5R2V0Q29udGV4dChhcHBDb25maWdLZXkpO1xuXG4gICAgICAgIGlmIChjb25maWdGaWxlUGF0aCA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbmZpZ0ZpbGVQYXRoID0gZW52LmdldChhcHBDb25maWdLZXkpLmFzU3RyaW5nKCk7XG5cbiAgICAgICAgICAgIGlmIChjb25maWdGaWxlUGF0aCAhPSB1bmRlZmluZWQgJiYgY29uZmlnRmlsZVBhdGgubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGZyb21UeXBlID0gJ0Vudmlyb25tZW50LVZhcmlhYmxlJztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uZmlnRmlsZVBhdGggPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnRmlsZVBhdGggPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZhaWwgdG8gZmluZCBBcHAtQ29uZmlnIGpzb24gZmlsZScpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmluZm8oYD09PiBDREsgQXBwLUNvbmZpZyBGaWxlIGlzICR7Y29uZmlnRmlsZVBhdGh9LCB3aGljaCBpcyBmcm9tICR7ZnJvbVR5cGV9LmApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNvbmZpZ0ZpbGVQYXRoO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0UHJvamVjdFByZWZpeChwcm9qZWN0TmFtZTogc3RyaW5nLCBwcm9qZWN0U3RhZ2U6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIGxldCBwcmVmaXggPSBgJHtwcm9qZWN0TmFtZX0ke3Byb2plY3RTdGFnZX1gO1xuXG4gICAgICAgIGlmICh0aGlzLmFwcENvbnRleHRQcm9wcy5wcm9qZWN0UHJlZml4VHlwZSA9PT0gUHJvamVjdFByZWZpeFR5cGUuTmFtZUh5cGhlblN0YWdlKSB7XG4gICAgICAgICAgICBwcmVmaXggPSBgJHtwcm9qZWN0TmFtZX0tJHtwcm9qZWN0U3RhZ2V9YDtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmFwcENvbnRleHRQcm9wcy5wcm9qZWN0UHJlZml4VHlwZSA9PT0gUHJvamVjdFByZWZpeFR5cGUuTmFtZSkge1xuICAgICAgICAgICAgcHJlZml4ID0gcHJvamVjdE5hbWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcHJlZml4O1xuICAgIH1cblxuICAgIHByaXZhdGUgbG9hZEFwcENvbmZpZ0ZpbGUoZmlsZVBhdGg6IHN0cmluZywgY29udGV4dEFyZ3M/OiBzdHJpbmdbXSk6IGFueSB7XG4gICAgICAgIGxldCBhcHBDb25maWcgPSBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhmaWxlUGF0aCkudG9TdHJpbmcoKSk7XG4gICAgICAgIGxldCBwcm9qZWN0UHJlZml4ID0gdGhpcy5nZXRQcm9qZWN0UHJlZml4KGFwcENvbmZpZy5Qcm9qZWN0Lk5hbWUsIGFwcENvbmZpZy5Qcm9qZWN0LlN0YWdlKTtcblxuICAgICAgICBpZiAoY29udGV4dEFyZ3MgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUNvbnRleHRBcmdzKGFwcENvbmZpZywgY29udGV4dEFyZ3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5hZGRQcmVmaXhJbnRvU3RhY2tOYW1lKGFwcENvbmZpZywgcHJvamVjdFByZWZpeCk7XG5cbiAgICAgICAgcmV0dXJuIGFwcENvbmZpZztcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZUNvbnRleHRBcmdzKGFwcENvbmZpZzogYW55LCBjb250ZXh0QXJnczogc3RyaW5nW10pIHtcbiAgICAgICAgZm9yIChsZXQga2V5IG9mIGNvbnRleHRBcmdzKSB7XG4gICAgICAgICAgICBjb25zdCBqc29uS2V5cyA9IGtleS5zcGxpdCgnLicpO1xuICAgICAgICAgICAgbGV0IG9sZFZhbHVlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgY29uc3QgbmV3VmFsdWU6IHN0cmluZyA9IHRoaXMuY2RrQXBwLm5vZGUudHJ5R2V0Q29udGV4dChrZXkpO1xuICAgIFxuICAgICAgICAgICAgaWYgKG5ld1ZhbHVlICE9IHVuZGVmaW5lZCAmJiBqc29uS2V5cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgb2xkVmFsdWUgPSBqc29uS2V5cy5yZWR1Y2UoKHJlZHVjZXI6IGFueSwgcG9pbnRlcjogc3RyaW5nKSA9PiByZWR1Y2VyLmhhc093blByb3BlcnR5KHBvaW50ZXIpID8gcmVkdWNlcltwb2ludGVyXSA6IHVuZGVmaW5lZCwgYXBwQ29uZmlnKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihgW0VSUk9SXSB1cGRhdGVDb250ZXh0QXJnczogVGhpcyBrZXlbJHtrZXl9XSBpcyBhbiB1bmRlZmluZWQgdmFsdWUgaW4gSnNvbi1Db25maWcgZmlsZS5cXG5gLCBlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgICAgICAganNvbktleXMucmVkdWNlKChyZWR1Y2VyOiBhbnksIHBvaW50ZXI6IHN0cmluZywgY291bnQ6IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY291bnQgPT0ganNvbktleXMubGVuZ3RoIC0gMSkgcmVkdWNlcltwb2ludGVyXSA9IG5ld1ZhbHVlO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVkdWNlcltwb2ludGVyXTtcbiAgICAgICAgICAgICAgICB9LCBhcHBDb25maWcpO1xuICAgIFxuICAgICAgICAgICAgICAgIGNvbnNvbGUuaW5mbyhgW0lORk9dIHVwZGF0ZUNvbnRleHRBcmdzOiBVcGRhdGVkICR7a2V5fSA9ICR7b2xkVmFsdWV9LS0+JHtuZXdWYWx1ZX1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYWRkUHJlZml4SW50b1N0YWNrTmFtZShhcHBDb25maWc6IGFueSwgcHJvamVjdFByZWZpeDogc3RyaW5nKSB7XG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIGFwcENvbmZpZy5TdGFjaykge1xuICAgICAgICAgICAgY29uc3Qgc3RhY2tPcmlnaW5hbE5hbWUgPSBhcHBDb25maWcuU3RhY2tba2V5XS5OYW1lO1xuICAgICAgICAgICAgYXBwQ29uZmlnLlN0YWNrW2tleV0uU2hvcnRTdGFja05hbWUgPSBzdGFja09yaWdpbmFsTmFtZTtcbiAgICAgICAgICAgIGFwcENvbmZpZy5TdGFja1trZXldLk5hbWUgPSBgJHtwcm9qZWN0UHJlZml4fS0ke3N0YWNrT3JpZ2luYWxOYW1lfWA7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=