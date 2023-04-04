"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const lambda = require("aws-cdk-lib/aws-lambda");
const s3 = require("aws-cdk-lib/aws-s3");
const sns = require("aws-cdk-lib/aws-sns");
const cdk = require("aws-cdk-lib");
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const servicecatalog = require("aws-cdk-lib/aws-servicecatalog");
const aws_servicecatalog_1 = require("aws-cdk-lib/aws-servicecatalog");
/**
 * Follow these instructions to manually test provisioning a Product with an Asset with the resources provisioned in this stack:
 *
 * 1. Deploy the stack:
 ```
 $ cdk deploy --app "node integ.product.js" integ-servicecatalog-product
 ```
 *
 * 2. Obtain IAM Principal ARN that will provision product.
 One way this can be done is by using
 ```
 $ aws sts get-caller-identity
 ```
 *
 * 3. Associate your principal to your portfolio. PortfolioId is stored as an output values from the deployed stack.
 ```
 $ aws servicecatalog associate-principal-with-portfolio \
 --portfolio-id=<PLACEHOLDER - PORTFOLIO ID> \
 --principal-arn=<PLACEHOLDER - PRINCIPAL ARN> \
 --principal-type=IAM
 ```
 *
 * 4. Provision Product using the following prefilled values.
 ```
 $ aws servicecatalog provision-product \
 --provisioned-product-name=testAssetProvisioningProduct \
 --product-name=testProduct \
 --provisioning-artifact-name=testAssetProduct
 ```
 *
 * 5. Verify Provision Product was provisioned providing the ProvisionedProductId from the previous step.
 ```
 $ aws servicecatalog describe-provisioned-product --id=<PLACEHOLDER - PROVISIONED PRODUCT ID>
 ```
 *
 * 6. Terminate Provisioned Product providing the ProvisionedProductId from the previous step.
 ```
 $ aws servicecatalog terminate-provisioned-product --provisioned-product-id=<PLACEHOLDER - PROVISIONED PRODUCT ID>
 ```
 *
 * 7. Disassociate your principal from your portfolio.
 ```
 $ aws servicecatalog disassociate-principal-from-portfolio \
 --portfolio-id=<PLACEHOLDER - PORTFOLIO ID> \
 --principal-arn=<PLACEHOLDER - PRINCIPAL ARN> \
 ```
 *
 * 8. Destroy the stack:
 ```
 $ cdk destroy --app "node integ.product.js" integ-servicecatalog-product
 ```
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-servicecatalog-product', {
    env: {
        account: process.env.CDK_INTEG_ACCOUNT ?? process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_INTEG_REGION ?? process.env.CDK_DEFAULT_REGION,
    },
});
class TestProductStack extends servicecatalog.ProductStack {
    constructor(scope, id) {
        super(scope, id);
        new sns.Topic(this, 'TopicProduct');
    }
}
const portfolio = new servicecatalog.Portfolio(stack, 'TestPortfolio', {
    displayName: 'TestPortfolio',
    providerName: 'TestProvider',
    description: 'This is our Service Catalog Portfolio',
    messageLanguage: servicecatalog.MessageLanguage.EN,
});
class TestAssetProductStack extends servicecatalog.ProductStack {
    constructor(scope, id, props) {
        super(scope, id, props);
        new lambda.Function(this, 'HelloHandler', {
            runtime: lambda.Runtime.PYTHON_3_9,
            code: lambda.Code.fromAsset('./assets'),
            handler: 'index.handler',
        });
        new lambda.Function(this, 'HelloHandler2', {
            runtime: lambda.Runtime.PYTHON_3_9,
            code: lambda.Code.fromAsset('./assetsv2'),
            handler: 'index.handler',
        });
    }
}
const productStackHistory = new aws_servicecatalog_1.ProductStackHistory(stack, 'ProductStackHistory', {
    productStack: new TestProductStack(stack, 'SNSTopicProduct3'),
    currentVersionName: 'v1',
    currentVersionLocked: false,
});
const testAssetBucket = new s3.Bucket(stack, 'TestAssetBucket', {
    bucketName: `product-stack-asset-bucket-${stack.account}-${stack.region}`,
    removalPolicy: cdk.RemovalPolicy.DESTROY,
    autoDeleteObjects: true,
});
const product = new servicecatalog.CloudFormationProduct(stack, 'TestProduct', {
    productName: 'testProduct',
    owner: 'testOwner',
    productVersions: [
        {
            validateTemplate: false,
            cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromUrl('https://awsdocs.s3.amazonaws.com/servicecatalog/development-environment.template'),
        },
        {
            cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromAsset(path.join(__dirname, 'product1.template.json')),
        },
        {
            cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromAsset(path.join(__dirname, 'product2.template.json')),
        },
        {
            cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromProductStack(new TestProductStack(stack, 'SNSTopicProduct1')),
        },
        {
            cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromProductStack(new TestProductStack(stack, 'SNSTopicProduct2')),
        },
        {
            productVersionName: 'testAssetProduct',
            validateTemplate: false,
            cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromProductStack(new TestAssetProductStack(stack, 'S3AssetProduct', {
                assetBucket: testAssetBucket,
            })),
        },
        productStackHistory.currentVersion(),
    ],
});
new integ_tests_alpha_1.IntegTest(app, 'integ-product', {
    testCases: [stack],
    enableLookups: true,
});
portfolio.addProduct(product);
new cdk.CfnOutput(stack, 'PortfolioId', { value: portfolio.portfolioId });
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucHJvZHVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLnByb2R1Y3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNkI7QUFDN0IsaURBQWlEO0FBQ2pELHlDQUF5QztBQUN6QywyQ0FBMkM7QUFDM0MsbUNBQW1DO0FBQ25DLGtFQUF1RDtBQUN2RCxpRUFBaUU7QUFDakUsdUVBQXdGO0FBRXhGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FtREc7QUFFSCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMxQixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLDhCQUE4QixFQUFFO0lBQy9ELEdBQUcsRUFBRTtRQUNILE9BQU8sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CO1FBQ3pFLE1BQU0sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCO0tBQ3ZFO0NBQ0YsQ0FBQyxDQUFDO0FBRUgsTUFBTSxnQkFBaUIsU0FBUSxjQUFjLENBQUMsWUFBWTtJQUN4RCxZQUFZLEtBQVUsRUFBRSxFQUFVO1FBQ2hDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxjQUFjLENBQUMsQ0FBQztJQUN0QyxDQUFDO0NBQ0Y7QUFFRCxNQUFNLFNBQVMsR0FBRyxJQUFJLGNBQWMsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLGVBQWUsRUFBRTtJQUNyRSxXQUFXLEVBQUUsZUFBZTtJQUM1QixZQUFZLEVBQUUsY0FBYztJQUM1QixXQUFXLEVBQUUsdUNBQXVDO0lBQ3BELGVBQWUsRUFB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S0FDckM7Q0FDRixDQUFDLENBQUM7QUFFSCxJQUFJLDZCQUFTLENBQUMsR0FBRyxFQUFFLGVBQWUsRUFBRTtJQUNsQyxTQUFTLEVBQUUsQ0FBQyxLQUFLLENBQUM7SUFDbEIsYUFBYSxFQUFFLElBQUk7Q0FDcEIsQ0FBQyxDQUFDO0FBRUgsU0FBUyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUU5QixJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLGFBQWEsRUFBRSxFQUFFLEtBQUssRUFBRSxTQUFTLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztBQUUxRSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ2F3cy1jZGstbGliL2F3cy1sYW1iZGEnO1xuaW1wb3J0ICogYXMgczMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXMzJztcbmltcG9ydCAqIGFzIHNucyBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtc25zJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBJbnRlZ1Rlc3QgfSBmcm9tICdAYXdzLWNkay9pbnRlZy10ZXN0cy1hbHBoYSc7XG5pbXBvcnQgKiBhcyBzZXJ2aWNlY2F0YWxvZyBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtc2VydmljZWNhdGFsb2cnO1xuaW1wb3J0IHsgUHJvZHVjdFN0YWNrSGlzdG9yeSwgUHJvZHVjdFN0YWNrUHJvcHMgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtc2VydmljZWNhdGFsb2cnO1xuXG4vKipcbiAqIEZvbGxvdyB0aGVzZSBpbnN0cnVjdGlvbnMgdG8gbWFudWFsbHkgdGVzdCBwcm92aXNpb25pbmcgYSBQcm9kdWN0IHdpdGggYW4gQXNzZXQgd2l0aCB0aGUgcmVzb3VyY2VzIHByb3Zpc2lvbmVkIGluIHRoaXMgc3RhY2s6XG4gKlxuICogMS4gRGVwbG95IHRoZSBzdGFjazpcbiBgYGBcbiAkIGNkayBkZXBsb3kgLS1hcHAgXCJub2RlIGludGVnLnByb2R1Y3QuanNcIiBpbnRlZy1zZXJ2aWNlY2F0YWxvZy1wcm9kdWN0XG4gYGBgXG4gKlxuICogMi4gT2J0YWluIElBTSBQcmluY2lwYWwgQVJOIHRoYXQgd2lsbCBwcm92aXNpb24gcHJvZHVjdC5cbiBPbmUgd2F5IHRoaXMgY2FuIGJlIGRvbmUgaXMgYnkgdXNpbmdcbiBgYGBcbiAkIGF3cyBzdHMgZ2V0LWNhbGxlci1pZGVudGl0eVxuIGBgYFxuICpcbiAqIDMuIEFzc29jaWF0ZSB5b3VyIHByaW5jaXBhbCB0byB5b3VyIHBvcnRmb2xpby4gUG9ydGZvbGlvSWQgaXMgc3RvcmVkIGFzIGFuIG91dHB1dCB2YWx1ZXMgZnJvbSB0aGUgZGVwbG95ZWQgc3RhY2suXG4gYGBgXG4gJCBhd3Mgc2VydmljZWNhdGFsb2cgYXNzb2NpYXRlLXByaW5jaXBhbC13aXRoLXBvcnRmb2xpbyBcXFxuIC0tcG9ydGZvbGlvLWlkPTxQTEFDRUhPTERFUiAtIFBPUlRGT0xJTyBJRD4gXFxcbiAtLXByaW5jaXBhbC1hcm49PFBMQUNFSE9MREVSIC0gUFJJTkNJUEFMIEFSTj4gXFxcbiAtLXByaW5jaXBhbC10eXBlPUlBTVxuIGBgYFxuICpcbiAqIDQuIFByb3Zpc2lvbiBQcm9kdWN0IHVzaW5nIHRoZSBmb2xsb3dpbmcgcHJlZmlsbGVkIHZhbHVlcy5cbiBgYGBcbiAkIGF3cyBzZXJ2aWNlY2F0YWxvZyBwcm92aXNpb24tcHJvZHVjdCBcXFxuIC0tcHJvdmlzaW9uZWQtcHJvZHVjdC1uYW1lPXRlc3RBc3NldFByb3Zpc2lvbmluZ1Byb2R1Y3QgXFxcbiAtLXByb2R1Y3QtbmFtZT10ZXN0UHJvZHVjdCBcXFxuIC0tcHJvdmlzaW9uaW5nLWFydGlmYWN0LW5hbWU9dGVzdEFzc2V0UHJvZHVjdFxuIGBgYFxuICpcbiAqIDUuIFZlcmlmeSBQcm92aXNpb24gUHJvZHVjdCB3YXMgcHJvdmlzaW9uZWQgcHJvdmlkaW5nIHRoZSBQcm92aXNpb25lZFByb2R1Y3RJZCBmcm9tIHRoZSBwcmV2aW91cyBzdGVwLlxuIGBgYFxuICQgYXdzIHNlcnZpY2VjYXRhbG9nIGRlc2NyaWJlLXByb3Zpc2lvbmVkLXByb2R1Y3QgLS1pZD08UExBQ0VIT0xERVIgLSBQUk9WSVNJT05FRCBQUk9EVUNUIElEPlxuIGBgYFxuICpcbiAqIDYuIFRlcm1pbmF0ZSBQcm92aXNpb25lZCBQcm9kdWN0IHByb3ZpZGluZyB0aGUgUHJvdmlzaW9uZWRQcm9kdWN0SWQgZnJvbSB0aGUgcHJldmlvdXMgc3RlcC5cbiBgYGBcbiAkIGF3cyBzZXJ2aWNlY2F0YWxvZyB0ZXJtaW5hdGUtcHJvdmlzaW9uZWQtcHJvZHVjdCAtLXByb3Zpc2lvbmVkLXByb2R1Y3QtaWQ9PFBMQUNFSE9MREVSIC0gUFJPVklTSU9ORUQgUFJPRFVDVCBJRD5cbiBgYGBcbiAqXG4gKiA3LiBEaXNhc3NvY2lhdGUgeW91ciBwcmluY2lwYWwgZnJvbSB5b3VyIHBvcnRmb2xpby5cbiBgYGBcbiAkIGF3cyBzZXJ2aWNlY2F0YWxvZyBkaXNhc3NvY2lhdGUtcHJpbmNpcGFsLWZyb20tcG9ydGZvbGlvIFxcXG4gLS1wb3J0Zm9saW8taWQ9PFBMQUNFSE9MREVSIC0gUE9SVEZPTElPIElEPiBcXFxuIC0tcHJpbmNpcGFsLWFybj08UExBQ0VIT0xERVIgLSBQUklOQ0lQQUwgQVJOPiBcXFxuIGBgYFxuICpcbiAqIDguIERlc3Ryb3kgdGhlIHN0YWNrOlxuIGBgYFxuICQgY2RrIGRlc3Ryb3kgLS1hcHAgXCJub2RlIGludGVnLnByb2R1Y3QuanNcIiBpbnRlZy1zZXJ2aWNlY2F0YWxvZy1wcm9kdWN0XG4gYGBgXG4gKi9cblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbmNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdpbnRlZy1zZXJ2aWNlY2F0YWxvZy1wcm9kdWN0Jywge1xuICBlbnY6IHtcbiAgICBhY2NvdW50OiBwcm9jZXNzLmVudi5DREtfSU5URUdfQUNDT1VOVCA/PyBwcm9jZXNzLmVudi5DREtfREVGQVVMVF9BQ0NPVU5ULFxuICAgIHJlZ2lvbjogcHJvY2Vzcy5lbnYuQ0RLX0lOVEVHX1JFR0lPTiA/PyBwcm9jZXNzLmVudi5DREtfREVGQVVMVF9SRUdJT04sXG4gIH0sXG59KTtcblxuY2xhc3MgVGVzdFByb2R1Y3RTdGFjayBleHRlbmRzIHNlcnZpY2VjYXRhbG9nLlByb2R1Y3RTdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBhbnksIGlkOiBzdHJpbmcpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgbmV3IHNucy5Ub3BpYyh0aGlzLCAnVG9waWNQcm9kdWN0Jyk7XG4gIH1cbn1cblxuY29uc3QgcG9ydGZvbGlvID0gbmV3IHNlcnZpY2VjYXRhbG9nLlBvcnRmb2xpbyhzdGFjaywgJ1Rlc3RQb3J0Zm9saW8nLCB7XG4gIGRpc3BsYXlOYW1lOiAnVGVzdFBvcnRmb2xpbycsXG4gIHByb3ZpZGVyTmFtZTogJ1Rlc3RQcm92aWRlcicsXG4gIGRlc2NyaXB0aW9uOiAnVGhpcyBpcyBvdXIgU2VydmljZSBDYXRhbG9nIFBvcnRmb2xpbycsXG4gIG1lc3NhZ2VMYW5ndWFnZTogc2VydmljZWNhdGFsb2cuTWVzc2FnZUxhbmd1YWdlLkVOLFxufSk7XG5cbmNsYXNzIFRlc3RBc3NldFByb2R1Y3RTdGFjayBleHRlbmRzIHNlcnZpY2VjYXRhbG9nLlByb2R1Y3RTdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBhbnksIGlkOiBzdHJpbmcsIHByb3BzPzogUHJvZHVjdFN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgJ0hlbGxvSGFuZGxlcicsIHtcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLlBZVEhPTl8zXzksXG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQoJy4vYXNzZXRzJyksXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgfSk7XG5cbiAgICBuZXcgbGFtYmRhLkZ1bmN0aW9uKHRoaXMsICdIZWxsb0hhbmRsZXIyJywge1xuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuUFlUSE9OXzNfOSxcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldCgnLi9hc3NldHN2MicpLFxuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgIH0pO1xuICB9XG59XG5cbmNvbnN0IHByb2R1Y3RTdGFja0hpc3RvcnkgPSBuZXcgUHJvZHVjdFN0YWNrSGlzdG9yeShzdGFjaywgJ1Byb2R1Y3RTdGFja0hpc3RvcnknLCB7XG4gIHByb2R1Y3RTdGFjazogbmV3IFRlc3RQcm9kdWN0U3RhY2soc3RhY2ssICdTTlNUb3BpY1Byb2R1Y3QzJyksXG4gIGN1cnJlbnRWZXJzaW9uTmFtZTogJ3YxJyxcbiAgY3VycmVudFZlcnNpb25Mb2NrZWQ6IGZhbHNlLFxufSk7XG5cbmNvbnN0IHRlc3RBc3NldEJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdUZXN0QXNzZXRCdWNrZXQnLCB7XG4gIGJ1Y2tldE5hbWU6IGBwcm9kdWN0LXN0YWNrLWFzc2V0LWJ1Y2tldC0ke3N0YWNrLmFjY291bnR9LSR7c3RhY2sucmVnaW9ufWAsXG4gIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksXG4gIGF1dG9EZWxldGVPYmplY3RzOiB0cnVlLFxufSk7XG5cbmNvbnN0IHByb2R1Y3QgPSBuZXcgc2VydmljZWNhdGFsb2cuQ2xvdWRGb3JtYXRpb25Qcm9kdWN0KHN0YWNrLCAnVGVzdFByb2R1Y3QnLCB7XG4gIHByb2R1Y3ROYW1lOiAndGVzdFByb2R1Y3QnLFxuICBvd25lcjogJ3Rlc3RPd25lcicsXG4gIHByb2R1Y3RWZXJzaW9uczogW1xuICAgIHtcbiAgICAgIHZhbGlkYXRlVGVtcGxhdGU6IGZhbHNlLFxuICAgICAgY2xvdWRGb3JtYXRpb25UZW1wbGF0ZTogc2VydmljZWNhdGFsb2cuQ2xvdWRGb3JtYXRpb25UZW1wbGF0ZS5mcm9tVXJsKFxuICAgICAgICAnaHR0cHM6Ly9hd3Nkb2NzLnMzLmFtYXpvbmF3cy5jb20vc2VydmljZWNhdGFsb2cvZGV2ZWxvcG1lbnQtZW52aXJvbm1lbnQudGVtcGxhdGUnKSxcbiAgICB9LFxuICAgIHtcbiAgICAgIGNsb3VkRm9ybWF0aW9uVGVtcGxhdGU6IHNlcnZpY2VjYXRhbG9nLkNsb3VkRm9ybWF0aW9uVGVtcGxhdGUuZnJvbUFzc2V0KHBhdGguam9pbihfX2Rpcm5hbWUsICdwcm9kdWN0MS50ZW1wbGF0ZS5qc29uJykpLFxuICAgIH0sXG4gICAge1xuICAgICAgY2xvdWRGb3JtYXRpb25UZW1wbGF0ZTogc2VydmljZWNhdGFsb2cuQ2xvdWRGb3JtYXRpb25UZW1wbGF0ZS5mcm9tQXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJ3Byb2R1Y3QyLnRlbXBsYXRlLmpzb24nKSksXG4gICAgfSxcbiAgICB7XG4gICAgICBjbG91ZEZvcm1hdGlvblRlbXBsYXRlOiBzZXJ2aWNlY2F0YWxvZy5DbG91ZEZvcm1hdGlvblRlbXBsYXRlLmZyb21Qcm9kdWN0U3RhY2sobmV3IFRlc3RQcm9kdWN0U3RhY2soc3RhY2ssICdTTlNUb3BpY1Byb2R1Y3QxJykpLFxuICAgIH0sXG4gICAge1xuICAgICAgY2xvdWRGb3JtYXRpb25UZW1wbGF0ZTogc2VydmljZWNhdGFsb2cuQ2xvdWRGb3JtYXRpb25UZW1wbGF0ZS5mcm9tUHJvZHVjdFN0YWNrKG5ldyBUZXN0UHJvZHVjdFN0YWNrKHN0YWNrLCAnU05TVG9waWNQcm9kdWN0MicpKSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHByb2R1Y3RWZXJzaW9uTmFtZTogJ3Rlc3RBc3NldFByb2R1Y3QnLFxuICAgICAgdmFsaWRhdGVUZW1wbGF0ZTogZmFsc2UsXG4gICAgICBjbG91ZEZvcm1hdGlvblRlbXBsYXRlOiBzZXJ2aWNlY2F0YWxvZy5DbG91ZEZvcm1hdGlvblRlbXBsYXRlLmZyb21Qcm9kdWN0U3RhY2sobmV3IFRlc3RBc3NldFByb2R1Y3RTdGFjayhzdGFjaywgJ1MzQXNzZXRQcm9kdWN0Jywge1xuICAgICAgICBhc3NldEJ1Y2tldDogdGVzdEFzc2V0QnVja2V0LFxuICAgICAgfSkpLFxuICAgIH0sXG4gICAgcHJvZHVjdFN0YWNrSGlzdG9yeS5jdXJyZW50VmVyc2lvbigpLFxuICBdLFxufSk7XG5cbm5ldyBJbnRlZ1Rlc3QoYXBwLCAnaW50ZWctcHJvZHVjdCcsIHtcbiAgdGVzdENhc2VzOiBbc3RhY2tdLFxuICBlbmFibGVMb29rdXBzOiB0cnVlLFxufSk7XG5cbnBvcnRmb2xpby5hZGRQcm9kdWN0KHByb2R1Y3QpO1xuXG5uZXcgY2RrLkNmbk91dHB1dChzdGFjaywgJ1BvcnRmb2xpb0lkJywgeyB2YWx1ZTogcG9ydGZvbGlvLnBvcnRmb2xpb0lkIH0pO1xuXG5hcHAuc3ludGgoKTtcbiJdfQ==