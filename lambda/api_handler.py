import os
import json
import uuid
import boto3
from typing import Dict, Any

s3_client = boto3.client('s3')
ORIGINAL_BUCKET = os.getenv('ORIGINAL_BUCKET')

def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    try:
        # Example API logic to generate a pre-signed URL for upload
        body = json.loads(event.get('body', '{}'))
        file_name = body.get('file_name', f"{uuid.uuid4()}.jpg")
        content_type = body.get('content_type', 'image/jpeg')

        presigned_url = s3_client.generate_presigned_url(
            'put_object',
            Params={
                'Bucket': ORIGINAL_BUCKET,
                'Key': file_name,
                'ContentType': content_type
            },
            ExpiresIn=3600
        )

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'upload_url': presigned_url,
                'file_name': file_name
            })
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
