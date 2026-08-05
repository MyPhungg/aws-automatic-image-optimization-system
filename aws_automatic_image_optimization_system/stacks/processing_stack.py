import aws_cdk as cdk
from aws_cdk import (
    Stack,
    Duration,
    aws_lambda as _lambda,
    aws_events as events,
    aws_events_targets as targets,
    aws_s3 as s3,
    aws_dynamodb as _dynamodb,
)
from constructs import Construct


class ProcessingStack(Stack):
    def __init__(
        self, scope: Construct, construct_id: str,
        original_bucket: s3.Bucket,
        optimized_bucket: s3.Bucket,
        metadata_table: _dynamodb.Table,
        **kwargs
    ) -> None:
        super().__init__(scope, construct_id, **kwargs)

        self.processor = _lambda.Function(
            self,
            "ImageProcessor",
            runtime=_lambda.Runtime.PYTHON_3_13,
            handler="handler.lambda_handler",
            code=_lambda.Code.from_asset("lambda",
                bundling=cdk.BundlingOptions(
                    image=_lambda.Runtime.PYTHON_3_13.bundling_image,
                    command=["bash", "-c", "pip install -r requirements.txt -t /asset-output && cp -r . /asset-output"],
                ),
            ),
            timeout=Duration.seconds(30),
            memory_size=512,
            environment={
                "METADATA_TABLE": metadata_table.table_name,
                "OUTPUT_BUCKET": optimized_bucket.bucket_name
            }
        )

        # Grant permissions
        original_bucket.grant_read(self.processor)
        optimized_bucket.grant_write(self.processor)
        metadata_table.grant_read_write_data(self.processor)

        # EventBridge Rule để trigger Processing Lambda khi có object mới
        # trong original_bucket. Payload gửi cho Lambda có dạng
        # {"detail-type": "Object Created", "detail": {"bucket": {...},
        # "object": {...}}, ...} -- KHÔNG có "Records" -- nên handler.py
        # đã được cập nhật để parse theo đúng format này.
        # Lưu ý: original_bucket.event_bridge_enabled phải =True
        # (đã bật lại trong StorageStack) thì rule này mới nhận được sự kiện.
        rule = events.Rule(
            self, "S3ObjectCreatedRule",
            event_pattern=events.EventPattern(
                source=["aws.s3"],
                detail_type=["Object Created"],
                detail={
                    "bucket": {
                        "name": [original_bucket.bucket_name]
                    }
                }
            )
        )
        rule.add_target(targets.LambdaFunction(self.processor))