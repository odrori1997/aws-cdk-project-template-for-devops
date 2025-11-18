import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import { IWidget } from "aws-cdk-lib/aws-cloudwatch";
import { BaseConstruct, ConstructCommonProps } from '../base/base-construct';
export interface CloudWatchSimplePatternProps extends ConstructCommonProps {
    readonly dashboardName: string;
    readonly commonPeriod: cdk.Duration;
}
export declare class CloudWatchSimplePattern extends BaseConstruct {
    private dashboard;
    private props;
    constructor(scope: Construct, id: string, props: CloudWatchSimplePatternProps);
    addTextTitleWidges(title: string): void;
    addWidgets(...widgets: IWidget[]): void;
    createWidget(name: string, metrics: cloudwatch.IMetric[], width?: number, label?: string): cloudwatch.GraphWidget;
    createWidget2(name: string, metrics: cloudwatch.IMetric[], width?: number): cloudwatch.GraphWidget;
    createLeftRightWidget(name: string, leftMetrics: cloudwatch.IMetric[], rightMetrics: cloudwatch.IMetric[], width?: number): cloudwatch.GraphWidget;
    createDynamoDBMetric(tableName: string, metricName: string, options?: cloudwatch.MetricOptions, operation?: string): cloudwatch.Metric;
    createLambdaMetric(lambdaFunctionName: string, metricName: string, options?: cloudwatch.MetricOptions): cloudwatch.Metric;
    createIotMetric(ruleName: string, metricName: string, actionType: string, options?: cloudwatch.MetricOptions): cloudwatch.Metric;
    createKinesisMetric(streamName: string, metricName: string, options?: cloudwatch.MetricOptions): cloudwatch.Metric;
    createEndpointInstanceMetrics(endpointName: string, variantName: string, metricNames: string[], options?: cloudwatch.MetricOptions): cloudwatch.Metric[];
    createEndpointInvocationMetrics(endpointName: string, variantName: string, metricNames: string[], options?: cloudwatch.MetricOptions): cloudwatch.Metric[];
    createEsDomainMetric(domainName: string, metricName: string, clientId: string, options?: cloudwatch.MetricOptions): cloudwatch.Metric;
    createEsDomainMetric2(domainName: string, metricName: string, clientId: string, options?: cloudwatch.MetricOptions): cloudwatch.Metric;
    createApiGatewayMetric(apiName: string, metricName: string, options?: cloudwatch.MetricOptions): cloudwatch.Metric;
    createSnsMetric(topicName: string, metricName: string, options?: cloudwatch.MetricOptions): cloudwatch.Metric;
    createCustomMetric(namespace: string, metricName: string, dimensions: any, options?: cloudwatch.MetricOptions): cloudwatch.Metric;
}
