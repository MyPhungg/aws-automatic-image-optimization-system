from aws_cdk import (
    Stack,
    Duration,
    aws_lambda as _lambda,
    aws_s3 as s3,
    aws_dynamodb as _dynamodb,
)
from constructs import Construct
import os

class BackendStack(Stack):
    def __init__(
        self, scope: Construct, construct_id: str,
        original_bucket: s3.Bucket,
        optimized_bucket: s3.Bucket,
        metadata_table: _dynamodb.Table,
        user_table: _dynamodb.Table,
        **kwargs
    ) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # Deploy Spring Boot as a Lambda function using AWS Lambda Web Adapter
        # Đọc file .env để lấy Secret (trong thực tế CI/CD nên dùng AWS Secrets Manager)
        env_file_path = os.path.join("backend", "image-optimizer", ".env")
        google_client_id = "default_client_id"
        jwt_secret = "default_jwt_secret_must_be_at_least_32_characters_long_for_hmac_sha256"
        
        if os.path.exists(env_file_path):
            with open(env_file_path, "r") as f:
                for line in f:
                    if line.startswith("GOOGLE_CLIENT_ID="):
                        google_client_id = line.strip().split("=", 1)[1]
                    elif line.startswith("JWT_SECRET="):
                        jwt_secret = line.strip().split("=", 1)[1]

        self.spring_boot_lambda = _lambda.DockerImageFunction(
            self,
            "SpringBootApiLambda",
            code=_lambda.DockerImageCode.from_image_asset(
                directory="backend/image-optimizer"
            ),
            memory_size=512,  # Set to 512 to satisfy AWS Lab constraints
            timeout=Duration.seconds(30), # API Gateway has 29s timeout anyway
            environment={
                "S3_INPUT_BUCKET": original_bucket.bucket_name,
                "S3_OUTPUT_BUCKET": optimized_bucket.bucket_name,
                "DYNAMODB_IMAGE_TABLE": metadata_table.table_name,
                "DYNAMODB_USER_TABLE": user_table.table_name,
                "GOOGLE_CLIENT_ID": google_client_id,
                "JWT_SECRET": jwt_secret
            }
        )

        # Grant necessary permissions
        original_bucket.grant_read_write(self.spring_boot_lambda)
        optimized_bucket.grant_read_write(self.spring_boot_lambda)
        metadata_table.grant_read_write_data(self.spring_boot_lambda)
        user_table.grant_read_write_data(self.spring_boot_lambda)
