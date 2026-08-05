from aws_cdk import (
    Stack,
    RemovalPolicy,
    aws_s3 as s3,
    aws_dynamodb as _dynamodb,
)
from constructs import Construct


class StorageStack(Stack):
    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        self.original_bucket = s3.Bucket(
            self,
            "OriginalImageBucket",
            bucket_name="aws-img-opt-original-bucket",
            versioned=True,
            encryption=s3.BucketEncryption.S3_MANAGED,
            block_public_access=s3.BlockPublicAccess.BLOCK_ALL,
            removal_policy=RemovalPolicy.DESTROY,
            auto_delete_objects=True,
            event_bridge_enabled=True,  # bắt buộc để ProcessingStack's EventBridge Rule nhận được sự kiện
        )

        self.optimized_bucket = s3.Bucket(
            self,
            "OptimizedImageBucket",
            bucket_name="aws-img-opt-optimized-bucket",
            versioned=True,
            encryption=s3.BucketEncryption.S3_MANAGED,
            block_public_access=s3.BlockPublicAccess.BLOCK_ALL,
            removal_policy=RemovalPolicy.DESTROY,
            auto_delete_objects=True,
        )

        # Composite key batchId (partition) + processingId (sort) để khớp
        # với handler.py: get_item/update_item đều truy vấn theo cặp key này.
        # (Trước đây chỉ có imageId làm partition key -> không khớp.)
        self.table = _dynamodb.Table(
            self,
            "ImageMetadata",
            table_name="aws-img-opt-metadata-table",
            partition_key=_dynamodb.Attribute(
                name="batchId",
                type=_dynamodb.AttributeType.STRING,
            ),
            sort_key=_dynamodb.Attribute(
                name="processingId",
                type=_dynamodb.AttributeType.STRING,
            ),
            billing_mode=_dynamodb.BillingMode.PAY_PER_REQUEST,
            removal_policy=RemovalPolicy.DESTROY,
        )


        # Bảng UserMetadata: Lưu thông tin người dùng
        self.user_table = _dynamodb.Table(
            self,
            "UserMetadata",
            table_name="aws-img-opt-user-metadata-table",
            partition_key=_dynamodb.Attribute(
                name="userId",
                type=_dynamodb.AttributeType.STRING,
            ),
            billing_mode=_dynamodb.BillingMode.PAY_PER_REQUEST,
            removal_policy=RemovalPolicy.DESTROY,
        )
        self.table.add_global_secondary_index(
            index_name="UserImagesIndex",
            partition_key=_dynamodb.Attribute(
                name="userId",
                type=_dynamodb.AttributeType.STRING,
            ),
            sort_key=_dynamodb.Attribute(
                name="processedAt",
                type=_dynamodb.AttributeType.STRING,
            ),
            projection_type=_dynamodb.ProjectionType.ALL,
        )

        from aws_cdk import CfnOutput

        CfnOutput(
            self,
            "OriginalImageBucketName",
            value=self.original_bucket.bucket_name,
            description="Name of the original image bucket"
        )
        
        CfnOutput(
            self,
            "OptimizedImageBucketName",
            value=self.optimized_bucket.bucket_name,
            description="Name of the optimized image bucket"
        )
        
        CfnOutput(
            self,
            "ImageMetadataTableName",
            value=self.table.table_name,
            description="Name of the DynamoDB table for image metadata"
        )

        CfnOutput(
            self,
            "UserMetadataTableName",
            value=self.user_table.table_name,
            description="Name of the DynamoDB table for user metadata"
        )