"use strict";
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
const cdk = __importStar(require("@aws-cdk/core"));
const app_context_1 = require("../../lib/template/app-context");
let cdkApp = new cdk.App();
test('[TESTCase01] updateContextArgs: HappyCase', () => {
    // SETUP
    cdkApp.node.tryGetContext = jest.fn()
        .mockReturnValueOnce('test/template/app-config-test.json')
        .mockReturnValueOnce('there');
    // WHEN
    const context = new app_context_1.AppContext({
        appConfigFileKey: 'APP_CONFIG',
        contextArgs: [
            'aa.bb.cc'
        ]
    }, cdkApp);
    // THEN
    expect(context.ready()).toBe(true);
});
test('[TESTCase02] updateContextArgs: BadCase', () => {
    // SETUP
    cdkApp.node.tryGetContext = jest.fn()
        .mockReturnValueOnce('test/template/app-config-test.json')
        .mockReturnValueOnce('there');
    // WHEN
    let context = undefined;
    try {
        context = new app_context_1.AppContext({
            appConfigFileKey: 'APP_CONFIG',
            contextArgs: [
                'aa.bb1.cc'
            ]
        }, cdkApp);
    }
    catch (e) {
    }
    // THEN
    expect(context).toBe(undefined);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLWNvbnRleHQudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcC1jb250ZXh0LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsbURBQXFDO0FBR3JDLGdFQUE0RDtBQUc1RCxJQUFJLE1BQU0sR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUUzQixJQUFJLENBQUMsMkNBQTJDLEVBQUUsR0FBRyxFQUFFO0lBQ25ELFFBQVE7SUFDUixNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsRUFBRSxFQUFFO1NBQ2hDLG1CQUFtQixDQUFDLG9DQUFvQyxDQUFDO1NBQ3pELG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBRWxDLE9BQU87SUFDUCxNQUFNLE9BQU8sR0FBRyxJQUFJLHdCQUFVLENBQUM7UUFDM0IsZ0JBQWdCLEVBQUUsWUFBWTtRQUM5QixXQUFXLEVBQUU7WUFDVCxVQUFVO1NBQ2I7S0FDSixFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBRVgsT0FBTztJQUNQLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkMsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMseUNBQXlDLEVBQUUsR0FBRyxFQUFFO0lBQ2pELFFBQVE7SUFDUixNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsRUFBRSxFQUFFO1NBQ2hDLG1CQUFtQixDQUFDLG9DQUFvQyxDQUFDO1NBQ3pELG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBRWxDLE9BQU87SUFDUCxJQUFJLE9BQU8sR0FBRyxTQUFTLENBQUM7SUFDeEIsSUFBSTtRQUNBLE9BQU8sR0FBRyxJQUFJLHdCQUFVLENBQUM7WUFDckIsZ0JBQWdCLEVBQUUsWUFBWTtZQUM5QixXQUFXLEVBQUU7Z0JBQ1QsV0FBVzthQUNkO1NBQ0osRUFBRSxNQUFNLENBQUMsQ0FBQztLQUNkO0lBQUMsT0FBTSxDQUFDLEVBQUU7S0FFVjtJQUVELE9BQU87SUFDUCxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3BDLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSAnY29uc29sZSc7XG5cbmltcG9ydCB7IEFwcENvbnRleHQgfSBmcm9tICcuLi8uLi9saWIvdGVtcGxhdGUvYXBwLWNvbnRleHQnO1xuXG5cbmxldCBjZGtBcHAgPSBuZXcgY2RrLkFwcCgpO1xuXG50ZXN0KCdbVEVTVENhc2UwMV0gdXBkYXRlQ29udGV4dEFyZ3M6IEhhcHB5Q2FzZScsICgpID0+IHtcbiAgICAvLyBTRVRVUFxuICAgIGNka0FwcC5ub2RlLnRyeUdldENvbnRleHQgPSBqZXN0LmZuKClcbiAgICAgICAgLm1vY2tSZXR1cm5WYWx1ZU9uY2UoJ3Rlc3QvdGVtcGxhdGUvYXBwLWNvbmZpZy10ZXN0Lmpzb24nKVxuICAgICAgICAubW9ja1JldHVyblZhbHVlT25jZSgndGhlcmUnKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBjb250ZXh0ID0gbmV3IEFwcENvbnRleHQoe1xuICAgICAgICBhcHBDb25maWdGaWxlS2V5OiAnQVBQX0NPTkZJRycsXG4gICAgICAgIGNvbnRleHRBcmdzOiBbXG4gICAgICAgICAgICAnYWEuYmIuY2MnXG4gICAgICAgIF1cbiAgICB9LCBjZGtBcHApO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChjb250ZXh0LnJlYWR5KCkpLnRvQmUodHJ1ZSk7XG59KTtcblxudGVzdCgnW1RFU1RDYXNlMDJdIHVwZGF0ZUNvbnRleHRBcmdzOiBCYWRDYXNlJywgKCkgPT4ge1xuICAgIC8vIFNFVFVQXG4gICAgY2RrQXBwLm5vZGUudHJ5R2V0Q29udGV4dCA9IGplc3QuZm4oKVxuICAgICAgICAubW9ja1JldHVyblZhbHVlT25jZSgndGVzdC90ZW1wbGF0ZS9hcHAtY29uZmlnLXRlc3QuanNvbicpXG4gICAgICAgIC5tb2NrUmV0dXJuVmFsdWVPbmNlKCd0aGVyZScpO1xuXG4gICAgLy8gV0hFTlxuICAgIGxldCBjb250ZXh0ID0gdW5kZWZpbmVkO1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnRleHQgPSBuZXcgQXBwQ29udGV4dCh7XG4gICAgICAgICAgICBhcHBDb25maWdGaWxlS2V5OiAnQVBQX0NPTkZJRycsXG4gICAgICAgICAgICBjb250ZXh0QXJnczogW1xuICAgICAgICAgICAgICAgICdhYS5iYjEuY2MnXG4gICAgICAgICAgICBdXG4gICAgICAgIH0sIGNka0FwcCk7XG4gICAgfSBjYXRjaChlKSB7XG4gICAgICAgXG4gICAgfVxuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChjb250ZXh0KS50b0JlKHVuZGVmaW5lZCk7XG59KTtcbiJdfQ==