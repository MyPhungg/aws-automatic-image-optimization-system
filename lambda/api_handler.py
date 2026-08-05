import os
import json
import uuid
import boto3
from datetime import datetime, timezone
from decimal import Decimal
from typing import Dict, Any

s3_client = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')

ORIGINAL_BUCKET = os.getenv('ORIGINAL_BUCKET')
METADATA_TABLE = os.getenv('METADATA_TABLE')

def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    try:
        body = json.loads(event.get('body', '{}'))
        user_id = body.get('userId', 'anonymous')
        files = body.get('files', [])
        format = body.get('format', 'JPEG')
        config = body.get('config', {})
        
        batch_id = str(uuid.uuid4())
        
        table = dynamodb.Table(METADATA_TABLE) if METADATA_TABLE else None
        
        response_files = []
        uploaded_at = datetime.now(timezone.utc).isoformat()
        
        for file in files:
            processing_id = str(uuid.uuid4())
            file_name = file.get('fileName', f"{processing_id}.jpg")
            content_type = file.get('contentType', 'image/jpeg')
            original_size = file.get('size', 0)
            
            # Save to DynamoDB
            if table:
                config_decimal = json.loads(json.dumps(config), parse_float=Decimal)
                item = {
                    "batchId": batch_id,
                    "processingId": processing_id,
                    "userId": user_id,
                    "originalName": file_name,
                    "format": format,
                    "originalSize": Decimal(str(original_size)),
                    "optimizationConfig": config_decimal,
                    "uploadedAt": uploaded_at,
                    "status": "PENDING",
                    "inputBucket": ORIGINAL_BUCKET,
                    "inputKey": f"uploads/{user_id}/{batch_id}/{processing_id}_{file_name}"
                }
                table.put_item(Item=item)
            
            # Generate pre-signed URL with metadata
            presigned_url = s3_client.generate_presigned_url(
                'put_object',
                Params={
                    'Bucket': ORIGINAL_BUCKET,
                    'Key': f"uploads/{user_id}/{batch_id}/{processing_id}_{file_name}",
                    'ContentType': content_type,
                    'Metadata': {
                        'batchid': batch_id,
                        'processingid': processing_id,
                        'userid': user_id
                    }
                },
                ExpiresIn=3600
            )
            
            response_files.append({
                "processingId": processing_id,
                "fileName": file_name,
                "presignedUrl": presigned_url
            })

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'batchId': batch_id,
                'files': response_files
            })
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)})
        }
