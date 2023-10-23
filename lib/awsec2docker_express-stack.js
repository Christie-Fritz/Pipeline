"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("@aws-cdk/cdk");
const ec2 = require("@aws-cdk/aws-ec2");
const ecs = require("@aws-cdk/aws-ecs");
const elbv2 = require("@aws-cdk/aws-elasticloadbalancingv2");
class Awsec2dockerExpressStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const vpc = new ec2.VpcNetwork(this, 'helloVpc', { maxAZs: 2 });
        // Create an ECS cluster
        var cluster = new ecs.Cluster(this, 'Cluster', { vpc });
        cluster.addCapacity('DefaultAutoScalingGroup', {
            instanceType: new ec2.InstanceType('t2.micro'),
            maxCapacity: 3
        });
        // hello service
        const helloTaskDefinition = new ecs.Ec2TaskDefinition(this, 'hello-task-definition', {});
        const helloContainer = helloTaskDefinition.addContainer('hello', {
            image: ecs.ContainerImage.fromDockerHub('jrwtango/expresscolor'),
            memoryLimitMiB: 128
        });
        helloContainer.addPortMappings({
            containerPort: 3000
        });
        const helloService = new ecs.Ec2Service(this, 'hello-service', {
            cluster: cluster,
            desiredCount: 3,
            taskDefinition: helloTaskDefinition
        });
        // Internet facing load balancer for the frontend services
        const externalLB = new elbv2.ApplicationLoadBalancer(this, 'external', {
            vpc: vpc,
            internetFacing: true
        });
        const externalListener = externalLB.addListener('PublicListener', { port: 80, open: true });
        externalListener.addTargets('greeter', {
            port: 80,
            targets: [helloService]
        });
        new cdk.Output(this, 'ExternalDNS', { value: externalLB.dnsName });
    }
}
exports.Awsec2dockerExpressStack = Awsec2dockerExpressStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXdzZWMyZG9ja2VyX2V4cHJlc3Mtc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhd3NlYzJkb2NrZXJfZXhwcmVzcy1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9DQUFxQztBQUNyQyx3Q0FBeUM7QUFDekMsd0NBQXlDO0FBQ3pDLDZEQUE4RDtBQUM5RCxNQUFhLHdCQUF5QixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQ3JELFlBQVksS0FBYyxFQUFFLEVBQVUsRUFBRSxLQUFzQjtRQUM1RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRWhFLHdCQUF3QjtRQUN4QixJQUFJLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDeEQsT0FBTyxDQUFDLFdBQVcsQ0FBQyx5QkFBeUIsRUFBRTtZQUM3QyxZQUFZLEVBQUUsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQztZQUM5QyxXQUFXLEVBQUUsQ0FBQztTQUNmLENBQUMsQ0FBQztRQUVQLGdCQUFnQjtRQUNmLE1BQU0sbUJBQW1CLEdBQUcsSUFBSSxHQUFHLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLHVCQUF1QixFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRXhGLE1BQU0sY0FBYyxHQUFHLG1CQUFtQixDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUU7WUFDL0QsS0FBSyxFQUFFLEdBQUcsQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFFLHVCQUF1QixDQUFDO1lBQ2pFLGNBQWMsRUFBRSxHQUFHO1NBQ3BCLENBQUMsQ0FBQztRQUVILGNBQWMsQ0FBQyxlQUFlLENBQUM7WUFDN0IsYUFBYSxFQUFFLElBQUk7U0FDcEIsQ0FBQyxDQUFDO1FBRUgsTUFBTSxZQUFZLEdBQUcsSUFBSSxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxlQUFlLEVBQUU7WUFDN0QsT0FBTyxFQUFFLE9BQU87WUFDaEIsWUFBWSxFQUFFLENBQUM7WUFDZixjQUFjLEVBQUUsbUJBQW1CO1NBQ3BDLENBQUMsQ0FBQztRQUNELDBEQUEwRDtRQUU1RCxNQUFNLFVBQVUsR0FBRyxJQUFJLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ3JFLEdBQUcsRUFBRSxHQUFHO1lBQ1IsY0FBYyxFQUFFLElBQUk7U0FDckIsQ0FBQyxDQUFDO1FBRUgsTUFBTSxnQkFBZ0IsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLGdCQUFnQixFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUU1RixnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFO1lBQ3JDLElBQUksRUFBRSxFQUFFO1lBQ1IsT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDO1NBQ3hCLENBQUMsQ0FBQztRQUVILElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFLEVBQUUsS0FBSyxFQUFFLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0lBQ25FLENBQUM7Q0FDRjtBQTlDRCw0REE4Q0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2RrID0gcmVxdWlyZSgnQGF3cy1jZGsvY2RrJyk7XG5pbXBvcnQgZWMyID0gcmVxdWlyZSgnQGF3cy1jZGsvYXdzLWVjMicpOyBcbmltcG9ydCBlY3MgPSByZXF1aXJlKCdAYXdzLWNkay9hd3MtZWNzJyk7XG5pbXBvcnQgZWxidjIgPSByZXF1aXJlKCdAYXdzLWNkay9hd3MtZWxhc3RpY2xvYWRiYWxhbmNpbmd2MicpO1xuZXhwb3J0IGNsYXNzIEF3c2VjMmRvY2tlckV4cHJlc3NTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQXBwLCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwY05ldHdvcmsodGhpcywgJ2hlbGxvVnBjJywgeyBtYXhBWnM6IDIgfSk7XG4gICAgXG4gICAgLy8gQ3JlYXRlIGFuIEVDUyBjbHVzdGVyXG4gICAgdmFyIGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIodGhpcywgJ0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICBjbHVzdGVyLmFkZENhcGFjaXR5KCdEZWZhdWx0QXV0b1NjYWxpbmdHcm91cCcsIHtcbiAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ3QyLm1pY3JvJyksXG4gICAgICBtYXhDYXBhY2l0eTogM1xuICAgIH0pO1xuXG4vLyBoZWxsbyBzZXJ2aWNlXG4gY29uc3QgaGVsbG9UYXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRWMyVGFza0RlZmluaXRpb24odGhpcywgJ2hlbGxvLXRhc2stZGVmaW5pdGlvbicsIHt9KTtcblxuICBjb25zdCBoZWxsb0NvbnRhaW5lciA9IGhlbGxvVGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCdoZWxsbycsIHtcbiAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21Eb2NrZXJIdWIgKCdqcnd0YW5nby9leHByZXNzY29sb3InKSxcbiAgICBtZW1vcnlMaW1pdE1pQjogMTI4XG4gIH0pO1xuXG4gIGhlbGxvQ29udGFpbmVyLmFkZFBvcnRNYXBwaW5ncyh7XG4gICAgY29udGFpbmVyUG9ydDogMzAwMFxuICB9KTtcblxuICBjb25zdCBoZWxsb1NlcnZpY2UgPSBuZXcgZWNzLkVjMlNlcnZpY2UodGhpcywgJ2hlbGxvLXNlcnZpY2UnLCB7XG4gICAgY2x1c3RlcjogY2x1c3RlcixcbiAgICBkZXNpcmVkQ291bnQ6IDMsXG4gICAgdGFza0RlZmluaXRpb246IGhlbGxvVGFza0RlZmluaXRpb25cbiAgfSk7XG4gICAgLy8gSW50ZXJuZXQgZmFjaW5nIGxvYWQgYmFsYW5jZXIgZm9yIHRoZSBmcm9udGVuZCBzZXJ2aWNlc1xuICBcbiAgY29uc3QgZXh0ZXJuYWxMQiA9IG5ldyBlbGJ2Mi5BcHBsaWNhdGlvbkxvYWRCYWxhbmNlcih0aGlzLCAnZXh0ZXJuYWwnLCB7XG4gICAgdnBjOiB2cGMsXG4gICAgaW50ZXJuZXRGYWNpbmc6IHRydWVcbiAgfSk7XG5cbiAgY29uc3QgZXh0ZXJuYWxMaXN0ZW5lciA9IGV4dGVybmFsTEIuYWRkTGlzdGVuZXIoJ1B1YmxpY0xpc3RlbmVyJywgeyBwb3J0OiA4MCwgb3BlbjogdHJ1ZSB9KTtcblxuICBleHRlcm5hbExpc3RlbmVyLmFkZFRhcmdldHMoJ2dyZWV0ZXInLCB7XG4gICAgcG9ydDogODAsXG4gICAgdGFyZ2V0czogW2hlbGxvU2VydmljZV1cbiAgfSk7XG5cbiAgbmV3IGNkay5PdXRwdXQodGhpcywgJ0V4dGVybmFsRE5TJywgeyB2YWx1ZTogZXh0ZXJuYWxMQi5kbnNOYW1lIH0pO1xuICB9XG59XG4iXX0=