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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLWNvbnRleHQudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Rlc3QvdGVtcGxhdGUvYXBwLWNvbnRleHQudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxtREFBcUM7QUFHckMsZ0VBQTREO0FBRzVELElBQUksTUFBTSxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBRTNCLElBQUksQ0FBQywyQ0FBMkMsRUFBRSxHQUFHLEVBQUU7SUFDbkQsUUFBUTtJQUNSLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxFQUFFLEVBQUU7U0FDaEMsbUJBQW1CLENBQUMsb0NBQW9DLENBQUM7U0FDekQsbUJBQW1CLENBQUMsT0FBTyxDQUFDLENBQUM7SUFFbEMsT0FBTztJQUNQLE1BQU0sT0FBTyxHQUFHLElBQUksd0JBQVUsQ0FBQztRQUMzQixnQkFBZ0IsRUFBRSxZQUFZO1FBQzlCLFdBQVcsRUFBRTtZQUNULFVBQVU7U0FDYjtLQUNKLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFFWCxPQUFPO0lBQ1AsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN2QyxDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQyx5Q0FBeUMsRUFBRSxHQUFHLEVBQUU7SUFDakQsUUFBUTtJQUNSLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxFQUFFLEVBQUU7U0FDaEMsbUJBQW1CLENBQUMsb0NBQW9DLENBQUM7U0FDekQsbUJBQW1CLENBQUMsT0FBTyxDQUFDLENBQUM7SUFFbEMsT0FBTztJQUNQLElBQUksT0FBTyxHQUFHLFNBQVMsQ0FBQztJQUN4QixJQUFJO1FBQ0EsT0FBTyxHQUFHLElBQUksd0JBQVUsQ0FBQztZQUNyQixnQkFBZ0IsRUFBRSxZQUFZO1lBQzlCLFdBQVcsRUFBRTtnQkFDVCxXQUFXO2FBQ2Q7U0FDSixFQUFFLE1BQU0sQ0FBQyxDQUFDO0tBQ2Q7SUFBQyxPQUFNLENBQUMsRUFBRTtLQUVWO0lBRUQsT0FBTztJQUNQLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDcEMsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBhc3NlcnQgfSBmcm9tICdjb25zb2xlJztcblxuaW1wb3J0IHsgQXBwQ29udGV4dCB9IGZyb20gJy4uLy4uL2xpYi90ZW1wbGF0ZS9hcHAtY29udGV4dCc7XG5cblxubGV0IGNka0FwcCA9IG5ldyBjZGsuQXBwKCk7XG5cbnRlc3QoJ1tURVNUQ2FzZTAxXSB1cGRhdGVDb250ZXh0QXJnczogSGFwcHlDYXNlJywgKCkgPT4ge1xuICAgIC8vIFNFVFVQXG4gICAgY2RrQXBwLm5vZGUudHJ5R2V0Q29udGV4dCA9IGplc3QuZm4oKVxuICAgICAgICAubW9ja1JldHVyblZhbHVlT25jZSgndGVzdC90ZW1wbGF0ZS9hcHAtY29uZmlnLXRlc3QuanNvbicpXG4gICAgICAgIC5tb2NrUmV0dXJuVmFsdWVPbmNlKCd0aGVyZScpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGNvbnRleHQgPSBuZXcgQXBwQ29udGV4dCh7XG4gICAgICAgIGFwcENvbmZpZ0ZpbGVLZXk6ICdBUFBfQ09ORklHJyxcbiAgICAgICAgY29udGV4dEFyZ3M6IFtcbiAgICAgICAgICAgICdhYS5iYi5jYydcbiAgICAgICAgXVxuICAgIH0sIGNka0FwcCk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KGNvbnRleHQucmVhZHkoKSkudG9CZSh0cnVlKTtcbn0pO1xuXG50ZXN0KCdbVEVTVENhc2UwMl0gdXBkYXRlQ29udGV4dEFyZ3M6IEJhZENhc2UnLCAoKSA9PiB7XG4gICAgLy8gU0VUVVBcbiAgICBjZGtBcHAubm9kZS50cnlHZXRDb250ZXh0ID0gamVzdC5mbigpXG4gICAgICAgIC5tb2NrUmV0dXJuVmFsdWVPbmNlKCd0ZXN0L3RlbXBsYXRlL2FwcC1jb25maWctdGVzdC5qc29uJylcbiAgICAgICAgLm1vY2tSZXR1cm5WYWx1ZU9uY2UoJ3RoZXJlJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgbGV0IGNvbnRleHQgPSB1bmRlZmluZWQ7XG4gICAgdHJ5IHtcbiAgICAgICAgY29udGV4dCA9IG5ldyBBcHBDb250ZXh0KHtcbiAgICAgICAgICAgIGFwcENvbmZpZ0ZpbGVLZXk6ICdBUFBfQ09ORklHJyxcbiAgICAgICAgICAgIGNvbnRleHRBcmdzOiBbXG4gICAgICAgICAgICAgICAgJ2FhLmJiMS5jYydcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSwgY2RrQXBwKTtcbiAgICB9IGNhdGNoKGUpIHtcbiAgICAgICBcbiAgICB9XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KGNvbnRleHQpLnRvQmUodW5kZWZpbmVkKTtcbn0pO1xuIl19