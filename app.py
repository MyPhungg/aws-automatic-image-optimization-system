#!/usr/bin/env python3
import os
import aws_cdk as cdk
from aws_automatic_image_optimization_system.stacks import (
    StorageStack,
    ProcessingStack,
    ApiStack
)

app = cdk.App()
env = cdk.Environment(
    account=os.getenv("CDK_DEFAULT_ACCOUNT"),
    region=os.getenv("CDK_DEFAULT_REGION")
)

# 1. Storage Stack
storage_stack = StorageStack(
    app, "StorageStack",
    env=env
)

# 2. Processing Stack
processing_stack = ProcessingStack(
    app, "ProcessingStack",
    original_bucket=storage_stack.original_bucket,
    optimized_bucket=storage_stack.optimized_bucket,
    metadata_table=storage_stack.table,
    env=env
)

# 3. API Stack
api_stack = ApiStack(
    app, "ApiStack",
    original_bucket=storage_stack.original_bucket,
    env=env
)

app.synth()
