import aws_cdk as cdk
from aws_cdk import (
    # Duration,
    Duration,
    RemovalPolicy,
    Stack,
    # aws_sqs as sqs,
    aws_s3 as s3,
    aws_s3_notifications as s3n,
    aws_lambda as _lambda,
    aws_dynamodb as _dynamodb,

)

from constructs import Construct

class AwsAutomaticImageOptimizationSystemStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)
        original_bucket = s3.Bucket(
                                    self,
                                    "OriginalImageBucket",

                                    versioned=True,

                                    encryption=s3.BucketEncryption.S3_MANAGED,

                                    block_public_access=s3.BlockPublicAccess.BLOCK_ALL,

                                    removal_policy=RemovalPolicy.DESTROY,

                                    auto_delete_objects=True
                                )
        optimized_bucket = s3.Bucket(
                                    self,
                                    "OptimizedImageBucket",

                                    versioned=True,

                                    encryption=s3.BucketEncryption.S3_MANAGED,

                                    block_public_access=s3.BlockPublicAccess.BLOCK_ALL,

                                    removal_policy=RemovalPolicy.DESTROY,

                                    auto_delete_objects=True
                                )
        table = _dynamodb.Table(
                                self,
                                "ImageMetadata",
                                partition_key=_dynamodb.Attribute(
                                    name="imageId",
                                    type=_dynamodb.AttributeType.STRING

                                ),
                                billing_mode=_dynamodb.BillingMode.PAY_PER_REQUEST,
                                removal_policy=RemovalPolicy.DESTROY
                        )
        processor = _lambda.Function(

                                    self,
                                    "ImageProcessor",
                                    runtime=_lambda.Runtime.PYTHON_3_13,
                                    handler="handler.lambda_handler",
                                    code=_lambda.Code.from_asset("lambda", # đợi Tânn
                                            bundling=cdk.BundlingOptions(
                                                image=_lambda.Runtime.PYTHON_3_13.bundling_image,
                                               command=["bash", "-c", "pip install -r requirements.txt -t /asset-output && cp -r . /asset-output"],
                                            ),
                                        ),
                                    timeout=Duration.seconds(30),
                                    memory_size=512,
                                    environment={
                                        "METADATA_TABLE": table.table_name,
                                        "OUTPUT_BUCKET": optimized_bucket.bucket_name
                                    }
                                )
        original_bucket.add_event_notification(
        s3.EventType.OBJECT_CREATED,
        s3n.LambdaDestination(processor),
                )
        original_bucket.grant_read(processor)
        optimized_bucket.grant_write(processor)
        table.grant_read_write_data(processor)