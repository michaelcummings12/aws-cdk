"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("aws-cdk-lib");
const ec2 = require("aws-cdk-lib/aws-ec2");
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-ec2-vpn');
const vpc = new ec2.Vpc(stack, 'MyVpc', {
    ipAddresses: ec2.IpAddresses.cidr('10.10.0.0/16'),
    vpnConnections: {
        Dynamic: {
            ip: '52.85.255.164',
            tunnelOptions: [
                {
                    preSharedKeySecret: cdk.SecretValue.unsafePlainText('ssmpwaaa'),
                },
            ],
        },
    },
});
vpc.addVpnConnection('Static', {
    ip: '52.85.255.197',
    staticRoutes: [
        '192.168.10.0/24',
        '192.168.20.0/24',
    ],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcudnBuLXByZS1zaGFyZWQta2V5LXRva2VuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcudnBuLXByZS1zaGFyZWQta2V5LXRva2VuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBQW1DO0FBQ25DLDJDQUEyQztBQUUzQyxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMxQixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLGlCQUFpQixDQUFDLENBQUM7QUFFcEQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUU7SUFDdEMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQztJQUNqRCxjQUFjLEVBQUU7UUFDZCxPQUFPLEVBQUU7WUFDUCxFQUFFLEVBQUUsZUFBZTtZQUNuQixhQUFhLEVBQUU7Z0JBQ2I7b0JBQ0Usa0JBQWtCLEVBQUUsR0FBRyxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDO2lCQUNoRTthQUNGO1NBQ0Y7S0FDRjtDQUNGLENBQUMsQ0FBQztBQUVILEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUU7SUFDN0IsRUFBRSxFQUFFLGVBQWU7SUFDbkIsWUFBWSxFQUFFO1FBQ1osaUJBQWlCO1FBQ2pCLGlCQUFpQjtLQUNsQjtDQUNGLENBQUMsQ0FBQztBQUVILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjMic7XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5jb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnYXdzLWNkay1lYzItdnBuJyk7XG5cbmNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnTXlWcGMnLCB7XG4gIGlwQWRkcmVzc2VzOiBlYzIuSXBBZGRyZXNzZXMuY2lkcignMTAuMTAuMC4wLzE2JyksXG4gIHZwbkNvbm5lY3Rpb25zOiB7XG4gICAgRHluYW1pYzogeyAvLyBEeW5hbWljIHJvdXRpbmdcbiAgICAgIGlwOiAnNTIuODUuMjU1LjE2NCcsXG4gICAgICB0dW5uZWxPcHRpb25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBwcmVTaGFyZWRLZXlTZWNyZXQ6IGNkay5TZWNyZXRWYWx1ZS51bnNhZmVQbGFpblRleHQoJ3NzbXB3YWFhJyksXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gIH0sXG59KTtcblxudnBjLmFkZFZwbkNvbm5lY3Rpb24oJ1N0YXRpYycsIHsgLy8gU3RhdGljIHJvdXRpbmdcbiAgaXA6ICc1Mi44NS4yNTUuMTk3JyxcbiAgc3RhdGljUm91dGVzOiBbXG4gICAgJzE5Mi4xNjguMTAuMC8yNCcsXG4gICAgJzE5Mi4xNjguMjAuMC8yNCcsXG4gIF0sXG59KTtcblxuYXBwLnN5bnRoKCk7XG4iXX0=