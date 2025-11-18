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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLWNvbnRleHQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvdGVtcGxhdGUvYXBwLWNvbnRleHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVILHVDQUF5QjtBQUN6Qiw2Q0FBK0I7QUFDL0IsaURBQW1DO0FBTW5DLE1BQWEsZUFBZ0IsU0FBUSxLQUFLO0lBQ3RDLFlBQVksT0FBZTtRQUN2QixLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDZixJQUFJLENBQUMsSUFBSSxHQUFHLHdCQUF3QixDQUFDO0lBQ3pDLENBQUM7Q0FDSjtBQUxELDBDQUtDO0FBRUQsSUFBWSxpQkFJWDtBQUpELFdBQVksaUJBQWlCO0lBQ3pCLG1FQUFTLENBQUE7SUFDVCwrRUFBZSxDQUFBO0lBQ2YseURBQUksQ0FBQTtBQUNSLENBQUMsRUFKVyxpQkFBaUIsR0FBakIseUJBQWlCLEtBQWpCLHlCQUFpQixRQUk1QjtBQVFELE1BQWEsVUFBVTtJQU9uQixZQUFZLEtBQXNCO1FBQzlCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDNUIsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7UUFFN0IsSUFBSTtZQUNBLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUVyRSxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBRTFFLElBQUksSUFBSSxDQUFDLFNBQVMsSUFBSSxTQUFTLEVBQUU7Z0JBQzdCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUMsYUFBYSxDQUFDLENBQUM7YUFDdEU7U0FFSjtRQUFD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Q0FBQyxHQUFHLFFBQVEsQ0FBQztvQkFDOUQsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQzVCLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztnQkFFZCxPQUFPLENBQUMsSUFBSSxDQUFDLHFDQUFxQyxHQUFHLE1BQU0sUUFBUSxNQUFNLFFBQVEsRUFBRSxDQUFDLENBQUM7YUFDeEY7U0FDSjtJQUNMLENBQUM7SUFFTyxzQkFBc0IsQ0FBQyxTQUFjLEVBQUUsYUFBcUI7UUFDaEUsS0FBSyxNQUFNLEdBQUcsSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFO1lBQy9CLE1BQU0saUJBQWlCLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDcEQsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxjQUFjLEdBQUcsaUJBQWlCLENBQUM7WUFDeEQsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsR0FBRyxhQUFhLElBQUksaUJBQWlCLEVBQUUsQ0FBQztTQUN2RTtJQUNMLENBQUM7Q0FDSjtBQTlIRCxnQ0E4SEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEFtYXpvbi5jb20sIEluYy4gb3IgaXRzIGFmZmlsaWF0ZXMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogTUlULTBcbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXNcbiAqIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZVxuICogd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LFxuICogbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0b1xuICogcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1IgSU1QTElFRCxcbiAqIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBXG4gKiBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUXG4gKiBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT05cbiAqIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRVxuICogU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4gKi9cblxuaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgZW52IGZyb20gJ2Vudi12YXInO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcblxuaW1wb3J0IHsgQXBwQ29uZmlnIH0gZnJvbSAnLi9hcHAtY29uZmlnJztcbmltcG9ydCB7IFN0YWNrQ29tbW9uUHJvcHMgfSBmcm9tICcuL3N0YWNrL2Jhc2UvYmFzZS1zdGFjayc7XG5cblxuZXhwb3J0IGNsYXNzIEFwcENvbnRleHRFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlOiBzdHJpbmcpIHtcbiAgICAgICAgc3VwZXIobWVzc2FnZSk7XG4gICAgICAgIHRoaXMubmFtZSA9IFwiQXBwQ29uZmlnRmlsZUZhaWxFcnJvclwiO1xuICAgIH1cbn1cblxuZXhwb3J0IGVudW0gUHJvamVjdFByZWZpeFR5cGUge1xuICAgIE5hbWVTdGFnZSxcbiAgICBOYW1lSHlwaGVuU3RhZ2UsXG4gICAgTmFtZVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEFwcENvbnRleHRQcm9wcyB7XG4gICAgYXBwQ29uZmlnRmlsZUtleTogc3RyaW5nO1xuICAgIGNvbnRleHRBcmdzPzogc3RyaW5nW107XG4gICAgcHJvamVjdFByZWZpeFR5cGU/OiBQcm9qZWN0UHJlZml4VHlwZTtcbn1cblxuZXhwb3J0IGNsYXNzIEFwcENvbnRleHQge1xuICAgIHB1YmxpYyByZWFkb25seSBjZGtBcHA6IGNkay5BcHA7XG4gICAgcHVibGljIHJlYWRvbmx5IGFwcENvbmZpZzogQXBwQ29uZmlnO1xuICAgIHB1YmxpYyByZWFkb25seSBzdGFja0NvbW1vblByb3BzOiBTdGFja0NvbW1vblByb3BzO1xuXG4gICAgcHJpdmF0ZSByZWFkb25seSBhcHBDb250ZXh0UHJvcHM6IEFwcENvbnRleHRQcm9wcztcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzOiBBcHBDb250ZXh0UHJvcHMpIHtcbiAgICAgICAgdGhpcy5jZGtBcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgICAgICB0aGlzLmFwcENvbnRleHRQcm9wcyA9IHByb3BzO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBhcHBDb25maWdGaWxlID0gdGhpcy5maW5kQXBwQ29uZmlnRmlsZShwcm9wcy5hcHBDb25maWdGaWxlS2V5KTtcblxuICAgICAgICAgICAgdGhpcy5hcHBDb25maWcgPSB0aGlzLmxvYWRBcHBDb25maWdGaWxlKGFwcENvbmZpZ0ZpbGUsIHByb3BzLmNvbnRleHRBcmdzKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuYXBwQ29uZmlnICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhY2tDb21tb25Qcm9wcyA9IHRoaXMuY3JlYXRlU3RhY2tDb21tb25Qcm9wcyhhcHBDb25maWdGaWxlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGA9PT4gQ0RLIEFwcC1Db25maWcgRmlsZSBpcyBlbXB0eSwgXG4gICAgICAgICAgICBzZXQgdXAgeW91ciBlbnZpcm9ubWVudCB2YXJpYWJsZShVc2FnZTogZXhwb3J0ICR7cHJvcHMuYXBwQ29uZmlnRmlsZUtleX09Y29uZmlnL2FwcC1jb25maWcteHh4Lmpzb24pIFxuICAgICAgICAgICAgb3IgYXBwZW5kIGlubGluZS1hcmd1cm1lbnQoVXNhZ2U6IGNkayBsaXN0IC0tY29udGV4dCAke3Byb3BzLmFwcENvbmZpZ0ZpbGVLZXl9PWNvbmZpZy9hcHAtY29uZmlnLXh4eC5qc29uKWAsIGUpO1xuICAgICAgICAgICAgdGhyb3cgbmV3IEFwcENvbnRleHRFcnJvcignRmFpbCB0byBmaW5kIEFwcC1Db25maWcganNvbiBmaWxlJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgcmVhZHkoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YWNrQ29tbW9uUHJvcHMgPyB0cnVlIDogZmFsc2U7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVTdGFja0NvbW1vblByb3BzKGFwcENvbmZpZ0ZpbGU6IHN0cmluZyk6IFN0YWNrQ29tbW9uUHJvcHMge1xuICAgICAgICBjb25zdCBzdGFja1Byb3BzOiBTdGFja0NvbW1vblByb3BzID0ge1xuICAgICAgICAgICAgcHJvamVjdFByZWZpeDogdGhpcy5nZXRQcm9qZWN0UHJlZml4KHRoaXMuYXBwQ29uZmlnLlByb2plY3QuTmFtZSwgdGhpcy5hcHBDb25maWcuUHJvamVjdC5TdGFnZSksXG4gICAgICAgICAgICBhcHBDb25maWc6IHRoaXMuYXBwQ29uZmlnLFxuICAgICAgICAgICAgYXBwQ29uZmlnUGF0aDogYXBwQ29uZmlnRmlsZSxcbiAgICAgICAgICAgIGVudjoge1xuICAgICAgICAgICAgICAgIGFjY291bnQ6IHRoaXMuYXBwQ29uZmlnLlByb2plY3QuQWNjb3VudCxcbiAgICAgICAgICAgICAgICByZWdpb246IHRoaXMuYXBwQ29uZmlnLlByb2plY3QuUmVnaW9uXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdmFyaWFibGVzOiB7fVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHN0YWNrUHJvcHM7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmaW5kQXBwQ29uZmlnRmlsZShhcHBDb25maWdLZXk6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIGxldCBmcm9tVHlwZSA9ICdJbkxpbmUtQXJndW1lbnQnO1xuICAgICAgICBsZXQgY29uZmlnRmlsZVBhdGggPSB0aGlzLmNka0FwcC5ub2RlLnRyeUdldENvbnRleHQoYXBwQ29uZmlnS2V5KTtcblxuICAgICAgICBpZiAoY29uZmlnRmlsZVBhdGggPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25maWdGaWxlUGF0aCA9IGVudi5nZXQoYXBwQ29uZmlnS2V5KS5hc1N0cmluZygpO1xuXG4gICAgICAgICAgICBpZiAoY29uZmlnRmlsZVBhdGggIT0gdW5kZWZpbmVkICYmIGNvbmZpZ0ZpbGVQYXRoLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBmcm9tVHlwZSA9ICdFbnZpcm9ubWVudC1WYXJpYWJsZSc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbmZpZ0ZpbGVQYXRoID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZ0ZpbGVQYXRoID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdGYWlsIHRvIGZpbmQgQXBwLUNvbmZpZyBqc29uIGZpbGUnKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5pbmZvKGA9PT4gQ0RLIEFwcC1Db25maWcgRmlsZSBpcyAke2NvbmZpZ0ZpbGVQYXRofSwgd2hpY2ggaXMgZnJvbSAke2Zyb21UeXBlfS5gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb25maWdGaWxlUGF0aDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFByb2plY3RQcmVmaXgocHJvamVjdE5hbWU6IHN0cmluZywgcHJvamVjdFN0YWdlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICBsZXQgcHJlZml4ID0gYCR7cHJvamVjdE5hbWV9JHtwcm9qZWN0U3RhZ2V9YDtcblxuICAgICAgICBpZiAodGhpcy5hcHBDb250ZXh0UHJvcHMucHJvamVjdFByZWZpeFR5cGUgPT09IFByb2plY3RQcmVmaXhUeXBlLk5hbWVIeXBoZW5TdGFnZSkge1xuICAgICAgICAgICAgcHJlZml4ID0gYCR7cHJvamVjdE5hbWV9LSR7cHJvamVjdFN0YWdlfWA7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5hcHBDb250ZXh0UHJvcHMucHJvamVjdFByZWZpeFR5cGUgPT09IFByb2plY3RQcmVmaXhUeXBlLk5hbWUpIHtcbiAgICAgICAgICAgIHByZWZpeCA9IHByb2plY3ROYW1lO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHByZWZpeDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGxvYWRBcHBDb25maWdGaWxlKGZpbGVQYXRoOiBzdHJpbmcsIGNvbnRleHRBcmdzPzogc3RyaW5nW10pOiBhbnkge1xuICAgICAgICBsZXQgYXBwQ29uZmlnID0gSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoZmlsZVBhdGgpLnRvU3RyaW5nKCkpO1xuICAgICAgICBsZXQgcHJvamVjdFByZWZpeCA9IHRoaXMuZ2V0UHJvamVjdFByZWZpeChhcHBDb25maWcuUHJvamVjdC5OYW1lLCBhcHBDb25maWcuUHJvamVjdC5TdGFnZSk7XG5cbiAgICAgICAgaWYgKGNvbnRleHRBcmdzICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVDb250ZXh0QXJncyhhcHBDb25maWcsIGNvbnRleHRBcmdzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYWRkUHJlZml4SW50b1N0YWNrTmFtZShhcHBDb25maWcsIHByb2plY3RQcmVmaXgpO1xuXG4gICAgICAgIHJldHVybiBhcHBDb25maWc7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVDb250ZXh0QXJncyhhcHBDb25maWc6IGFueSwgY29udGV4dEFyZ3M6IHN0cmluZ1tdKSB7XG4gICAgICAgIGZvciAobGV0IGtleSBvZiBjb250ZXh0QXJncykge1xuICAgICAgICAgICAgY29uc3QganNvbktleXMgPSBrZXkuc3BsaXQoJy4nKTtcbiAgICAgICAgICAgIGxldCBvbGRWYWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGNvbnN0IG5ld1ZhbHVlOiBzdHJpbmcgPSB0aGlzLmNka0FwcC5ub2RlLnRyeUdldENvbnRleHQoa2V5KTtcbiAgICBcbiAgICAgICAgICAgIGlmIChuZXdWYWx1ZSAhPSB1bmRlZmluZWQgJiYganNvbktleXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIG9sZFZhbHVlID0ganNvbktleXMucmVkdWNlKChyZWR1Y2VyOiBhbnksIHBvaW50ZXI6IHN0cmluZykgPT4gcmVkdWNlci5oYXNPd25Qcm9wZXJ0eShwb2ludGVyKSA/IHJlZHVjZXJbcG9pbnRlcl0gOiB1bmRlZmluZWQsIGFwcENvbmZpZyk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYFtFUlJPUl0gdXBkYXRlQ29udGV4dEFyZ3M6IFRoaXMga2V5WyR7a2V5fV0gaXMgYW4gdW5kZWZpbmVkIHZhbHVlIGluIEpzb24tQ29uZmlnIGZpbGUuXFxuYCwgZSk7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgICAgIGpzb25LZXlzLnJlZHVjZSgocmVkdWNlcjogYW55LCBwb2ludGVyOiBzdHJpbmcsIGNvdW50OiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvdW50ID09IGpzb25LZXlzLmxlbmd0aCAtIDEpIHJlZHVjZXJbcG9pbnRlcl0gPSBuZXdWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlZHVjZXJbcG9pbnRlcl07XG4gICAgICAgICAgICAgICAgfSwgYXBwQ29uZmlnKTtcbiAgICBcbiAgICAgICAgICAgICAgICBjb25zb2xlLmluZm8oYFtJTkZPXSB1cGRhdGVDb250ZXh0QXJnczogVXBkYXRlZCAke2tleX0gPSAke29sZFZhbHVlfS0tPiR7bmV3VmFsdWV9YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFkZFByZWZpeEludG9TdGFja05hbWUoYXBwQ29uZmlnOiBhbnksIHByb2plY3RQcmVmaXg6IHN0cmluZykge1xuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBhcHBDb25maWcuU3RhY2spIHtcbiAgICAgICAgICAgIGNvbnN0IHN0YWNrT3JpZ2luYWxOYW1lID0gYXBwQ29uZmlnLlN0YWNrW2tleV0uTmFtZTtcbiAgICAgICAgICAgIGFwcENvbmZpZy5TdGFja1trZXldLlNob3J0U3RhY2tOYW1lID0gc3RhY2tPcmlnaW5hbE5hbWU7XG4gICAgICAgICAgICBhcHBDb25maWcuU3RhY2tba2V5XS5OYW1lID0gYCR7cHJvamVjdFByZWZpeH0tJHtzdGFja09yaWdpbmFsTmFtZX1gO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19