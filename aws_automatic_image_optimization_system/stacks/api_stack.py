from aws_cdk import (
    Stack,
    Duration,
    CfnOutput,
    aws_lambda as _lambda,
    aws_apigateway as apigw,
    aws_s3 as s3,
)
from constructs import Construct

class ApiStack(Stack):
    def __init__(
        self, scope: Construct, construct_id: str, 
        original_bucket: s3.Bucket, 
        **kwargs
    ) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # Upload Lambda for generating pre-signed URLs
        self.upload_api_lambda = _lambda.Function(
            self,
            "UploadApiLambda",
            runtime=_lambda.Runtime.PYTHON_3_13,
            handler="api_handler.lambda_handler",
            code=_lambda.Code.from_asset("lambda"),
            timeout=Duration.seconds(10),
            memory_size=256,
            environment={
                "ORIGINAL_BUCKET": original_bucket.bucket_name
            }
        )

        # Grant permissions to generate pre-signed URL (requires PutObject)
        original_bucket.grant_put(self.upload_api_lambda)

        # API Gateway REST API
        self.api = apigw.RestApi(
            self, "ImageUploadApi",
            rest_api_name="Image Upload Service",
            description="This service handles uploading images to S3.",
            default_cors_preflight_options=apigw.CorsOptions(
                allow_origins=apigw.Cors.ALL_ORIGINS,
                allow_methods=apigw.Cors.ALL_METHODS
            )
        )

        # Integration
        upload_integration = apigw.LambdaIntegration(
        self.upload_api_lambda
        )

        # Resource and Method
        upload_resource = self.api.root.add_resource("upload")
        upload_resource.add_method("POST", upload_integration)

        # Export API Gateway URL so sync_backend_env.py can read it from cdk-outputs.json
        CfnOutput(
            self,
            "ApiGatewayUrl",
            value=self.api.url,
            description="API Gateway endpoint URL (e.g. https://xxx.execute-api.region.amazonaws.com/prod/)"
        )

