"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("@aws-cdk/assert");
const base_stack_1 = require("../../lib/template/stack/base/base-stack");
const app_context_1 = require("../../lib/template/app-context");
class SampleStack extends base_stack_1.BaseStack {
    constructor(appContext, appConfig) {
        super(appContext, appConfig);
        const bucket = this.createS3Bucket(appConfig.BucketBaseName);
    }
}
//https://docs.aws.amazon.com/cdk/v2/guide/testing.html
test('Sample Stack for Guiding', () => {
    // SETUP
    process.env['APP_CONFIG'] = 'config/app-config-demo.json';
    const appContext = new app_context_1.AppContext({
        appConfigFileKey: 'APP_CONFIG'
    });
    // WHEN
    const stack = new SampleStack(appContext, {
        "Name": "SampleStack",
        "BucketBaseName": 'test-s3-bucket'
    });
    // THEN
    assert_1.expect(stack).to(assert_1.matchTemplate({
        "Resources": {}
    }, assert_1.MatchStyle.NO_REPLACES));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FtcGxlLXN0YWNrLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzYW1wbGUtc3RhY2sudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDRDQUFpRjtBQUVqRix5RUFBcUU7QUFDckUsZ0VBQTREO0FBRzVELE1BQU0sV0FBWSxTQUFRLHNCQUFTO0lBRS9CLFlBQVksVUFBc0IsRUFBRSxTQUFjO1FBQzlDLEtBQUssQ0FBQyxVQUFVLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFFN0IsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDakUsQ0FBQztDQUNKO0FBQ0QsdURBQXVEO0FBQ3ZELElBQUksQ0FBQywwQkFBMEIsRUFBRSxHQUFHLEVBQUU7SUFDbEMsUUFBUTtJQUNSLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLEdBQUcsNkJBQTZCLENBQUE7SUFDekQsTUFBTSxVQUFVLEdBQUcsSUFBSSx3QkFBVSxDQUFDO1FBQzlCLGdCQUFnQixFQUFFLFlBQVk7S0FDakMsQ0FBQyxDQUFBO0lBRUYsT0FBTztJQUNQLE1BQU0sS0FBSyxHQUFHLElBQUksV0FBVyxDQUFDLFVBQVUsRUFBRTtRQUN0QyxNQUFNLEVBQUUsYUFBYTtRQUVyQixnQkFBZ0IsRUFBRSxnQkFBZ0I7S0FDckMsQ0FBQyxDQUFDO0lBRUgsT0FBTztJQUNQLGVBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsc0JBQWEsQ0FBQztRQUM5QixXQUFXLEVBQUUsRUFBRTtLQUNsQixFQUFFLG1CQUFVLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQTtBQUMvQixDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGV4cGVjdCBhcyBleHBlY3RDREssIG1hdGNoVGVtcGxhdGUsIE1hdGNoU3R5bGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnQnO1xuXG5pbXBvcnQgeyBCYXNlU3RhY2sgfSBmcm9tICcuLi8uLi9saWIvdGVtcGxhdGUvc3RhY2svYmFzZS9iYXNlLXN0YWNrJztcbmltcG9ydCB7IEFwcENvbnRleHQgfSBmcm9tICcuLi8uLi9saWIvdGVtcGxhdGUvYXBwLWNvbnRleHQnO1xuXG5cbmNsYXNzIFNhbXBsZVN0YWNrIGV4dGVuZHMgQmFzZVN0YWNrIHtcblxuICAgIGNvbnN0cnVjdG9yKGFwcENvbnRleHQ6IEFwcENvbnRleHQsIGFwcENvbmZpZzogYW55KSB7XG4gICAgICAgIHN1cGVyKGFwcENvbnRleHQsIGFwcENvbmZpZyk7XG5cbiAgICAgICAgY29uc3QgYnVja2V0ID0gdGhpcy5jcmVhdGVTM0J1Y2tldChhcHBDb25maWcuQnVja2V0QmFzZU5hbWUpO1xuICAgIH1cbn1cbi8vaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Nkay92Mi9ndWlkZS90ZXN0aW5nLmh0bWxcbnRlc3QoJ1NhbXBsZSBTdGFjayBmb3IgR3VpZGluZycsICgpID0+IHtcbiAgICAvLyBTRVRVUFxuICAgIHByb2Nlc3MuZW52WydBUFBfQ09ORklHJ10gPSAnY29uZmlnL2FwcC1jb25maWctZGVtby5qc29uJ1xuICAgIGNvbnN0IGFwcENvbnRleHQgPSBuZXcgQXBwQ29udGV4dCh7XG4gICAgICAgIGFwcENvbmZpZ0ZpbGVLZXk6ICdBUFBfQ09ORklHJ1xuICAgIH0pXG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU2FtcGxlU3RhY2soYXBwQ29udGV4dCwge1xuICAgICAgICBcIk5hbWVcIjogXCJTYW1wbGVTdGFja1wiLFxuXG4gICAgICAgIFwiQnVja2V0QmFzZU5hbWVcIjogJ3Rlc3QtczMtYnVja2V0J1xuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdENESyhzdGFjaykudG8obWF0Y2hUZW1wbGF0ZSh7XG4gICAgICAgIFwiUmVzb3VyY2VzXCI6IHt9XG4gICAgfSwgTWF0Y2hTdHlsZS5OT19SRVBMQUNFUykpXG59KTtcbiJdfQ==