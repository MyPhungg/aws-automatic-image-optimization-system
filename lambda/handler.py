import os
import time
import uuid
import json
import logging
import tempfile
from datetime import datetime, timezone
from typing import Any, Dict, Optional, Tuple
from decimal import Decimal

import boto3
from PIL import Image, ImageOps

# AWS clients
s3 = boto3.client("s3")
dynamodb = boto3.resource("dynamodb")


# Configuration (can be overridden with environment variables)
OUTPUT_BUCKET: str = os.getenv("OUTPUT_BUCKET", "OptimizedImageBucket") #đây nè
MAX_WIDTH: int = int(os.getenv("MAX_WIDTH", "1024"))
JPEG_QUALITY: int = int(os.getenv("JPEG_QUALITY", "80"))
THUMB_SIZE: Tuple[int, int] = (150, 150)
SUPPORTED_FORMATS = {"JPEG", "PNG", "WEBP", "BMP", "TIFF","MPO"}
METADATA_TABLE = os.getenv("METADATA_TABLE", "ImageMetadata")


# Logger setup for JSON logs
logger = logging.getLogger("image-processor")
logger.setLevel(logging.INFO)
if not logger.handlers:
    handler = logging.StreamHandler()
    logger.addHandler(handler)




class ImageProcessingError(Exception):
    """Base exception for image processing errors."""




class UnsupportedFormatError(ImageProcessingError):
    """Raised when an input image format is not supported."""




def log_json(level: str, message: str, **extra: Any) -> None:
    """Emit a single-line JSON structured log entry.


    The log includes a timestamp and any extra key/value pairs passed in.
    """
    payload = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "level": level,
        "message": message,
    }
    payload.update(extra)
    # Use the underlying logger but keep message as JSON string for portability
    logger.info(json.dumps(payload, default=str))




def build_metadata(**kwargs: Any) -> Dict[str, Any]:
    """Build canonical metadata dictionary for processed images.


    Fields follow the group's schema and are intentionally flat to make
    it easy to persist in DynamoDB or other stores without further
    transformation.
    """
    return kwargs




def download_s3_file(bucket: str, key: str) -> str:
    """Download S3 object to a temporary local file and return its path.


    Raises ImageProcessingError on failure.
    """
    try:
        tmp = tempfile.NamedTemporaryFile(prefix="img_in_", delete=False)
        tmp.close()
        local_path = tmp.name
        s3.download_file(bucket, key, local_path)
        return local_path
    except Exception as exc:  # pragma: no cover - external IO
        raise ImageProcessingError(f"Failed to download s3://{bucket}/{key}: {exc}")




def upload_s3_file(local_path: str, bucket: str, key: str) -> None:
    """Upload a local file to S3. Raises ImageProcessingError on failure."""
    try:
        s3.upload_file(local_path, bucket, key)
    except Exception as exc:  # pragma: no cover - external IO
        raise ImageProcessingError(f"Failed to upload {local_path} to s3://{bucket}/{key}: {exc}")




def optimize_image(
    input_path: str,
    max_width: int,
    quality: int,
    resize_enabled: bool,
    output_format: str,
    original_key: str = ""
) -> Tuple[str, int, str]:
    try:
        image = Image.open(input_path)
    except Exception as exc:
        raise ImageProcessingError(f"Unable to open image: {exc}")


    # LẤY FORMAT NGAY TẠI ĐÂY (Trước khi biến đổi ảnh làm mất thuộc tính)
    orig_format = (image.format or "").upper()
    detected_by = "PIL"


    # Apply EXIF orientation
    image = ImageOps.exif_transpose(image)


    if not orig_format:
        # Sử dụng original_key thay vì input_path vì file tạm không có đuôi mở rộng
        _, ext = os.path.splitext(original_key)
        ext_map = {
            ".jpg": "JPEG",
            ".jpeg": "JPEG",
            ".png": "PNG",
            ".webp": "WEBP",
            ".bmp": "BMP",
            ".tif": "TIFF",
            ".tiff": "TIFF",
        }
        orig_format = ext_map.get(ext.lower(), "")
        detected_by = "extension" if orig_format else detected_by


    # (Bỏ đoạn code sử dụng imghdr cũ vì Python 3.14 không còn hỗ trợ)


    if not orig_format:
        orig_format = "UNKNOWN"


    if orig_format not in SUPPORTED_FORMATS:
        raise UnsupportedFormatError(f"Unsupported image format: {orig_format} (detected_by={detected_by})")


    # Resize if needed while preserving aspect ratio
    if resize_enabled and image.width > max_width:
        ratio = max_width / image.width
        new_height = int(image.height * ratio)

        image = image.resize(
            (max_width, new_height),
            Image.Resampling.LANCZOS
        )


    # Convert paletted or alpha images to RGB for JPEG
    if image.mode in ("RGBA", "LA", "P"):
        image = image.convert("RGB")


    extension_map = {
        "JPEG": ".jpg",
        "JPG": ".jpg",
        "PNG": ".png",
        "WEBP": ".webp"
    }

    suffix = extension_map.get(
        output_format,
        ".jpg"
    )

    # out_tmp = tempfile.NamedTemporaryFile(
    #     prefix="img_out_",
    #     suffix=suffix,
    #     delete=False
    # )
    # Save optimized JPEG to a temporary file
    out_tmp = tempfile.NamedTemporaryFile(prefix="img_out_", suffix=suffix, delete=False)
    out_path = out_tmp.name
    out_tmp.close()


    try:
        save_kwargs = {
            "format": output_format,
            "optimize": True
        }

        if output_format in ("JPEG", "WEBP"):
            save_kwargs["quality"] = quality

        image.save(
            out_path,
            **save_kwargs
        )
    except Exception as exc:
        try:
            os.remove(out_path)
        except Exception:
            pass
        raise ImageProcessingError(f"Failed to save optimized image: {exc}")


    processed_size = os.path.getsize(out_path)
    return out_path, processed_size, orig_format




def generate_thumbnail(input_path: str, output_format: str, size: tuple[int, int] = THUMB_SIZE) -> str:
    """Generate a thumbnail JPEG and return its local path."""
    if output_format.upper() == "JPG":
        output_format = "JPEG"
    try:
        image = Image.open(input_path)
    except Exception as exc:
        raise ImageProcessingError(f"Unable to open image for thumbnail: {exc}")


    image = ImageOps.exif_transpose(image)
    if image.mode in ("RGBA", "LA", "P"):
        image = image.convert("RGB")


    thumb = image.copy()
    thumb.thumbnail(size, Image.Resampling.LANCZOS)

    
    suffix = {
        "JPEG": ".jpg",
        "PNG": ".png",
        "WEBP": ".webp"
    }.get(output_format, ".jpg")

    tmp = tempfile.NamedTemporaryFile(
        prefix="img_thumb_",
        suffix=suffix,
        delete=False
    )

    save_kwargs = {
        "format": output_format,
        "optimize": True
    }

    if output_format in ("JPEG", "WEBP"):
        save_kwargs["quality"] = 85
    
    tmp.close()
    try:
        thumb.save(tmp.name, **save_kwargs)
    except Exception as exc:
        try:
            os.remove(tmp.name)
        except Exception:
            pass
        raise ImageProcessingError(f"Failed to save thumbnail: {exc}")


    return tmp.name




def persist_metadata(metadata: Dict[str, Any]) -> None:
    table = dynamodb.Table(METADATA_TABLE)

# Chuyển float -> Decimal
    item = json.loads(
        json.dumps(metadata),
        parse_float=Decimal
    )
    log_json(
        "INFO",
        "saving_metadata",
        table=METADATA_TABLE,
        batchId=item["batchId"],
        processingId=item["processingId"]
    )
    response = table.put_item(Item=item)
    log_json(
        "INFO",
        "metadata_saved",
        table=METADATA_TABLE,
        batchId=item["batchId"],
        processingId=item["processingId"],
        httpStatus=response["ResponseMetadata"]["HTTPStatusCode"]
    )

    log_json(
        "INFO",
        "Metadata saved to DynamoDB",
        batchId=metadata["batchId"],
        processingId=metadata["processingId"]
    )

def get_metadata(batch_id: str, processing_id: str) -> Dict[str, Any]:

    table = dynamodb.Table(METADATA_TABLE)

    response = table.get_item(
        Key={
            "batchId": batch_id,
            "processingId": processing_id
        }
    )

    item = response.get("Item")

    if not item:
        raise ImageProcessingError(
            f"ImageMetadata not found: {batch_id}/{processing_id}"
        )

    return item

def update_success_metadata(metadata: Dict[str, Any]) -> None:

    table = dynamodb.Table(METADATA_TABLE)

    table.update_item(
        Key={
            "batchId": metadata["batchId"],
            "processingId": metadata["processingId"]
        },

        UpdateExpression="""
            SET
            #status = :status,
            outputKey = :outputKey,
            thumbnailKey = :thumbnailKey,
            processedAt = :processedAt,
            processedSize = :processedSize,
            compressionRatio = :compressionRatio,
            processingTimeMs = :processingTimeMs,
            lambdaRequestId = :lambdaRequestId
        """,

        ExpressionAttributeNames={
            "#status": "status"
        },

        ExpressionAttributeValues={

            ":status": metadata["status"],

            ":outputKey": metadata["outputKey"],

            ":thumbnailKey": metadata["thumbnailKey"],

            ":processedAt": metadata["processedAt"],

            ":processedSize": Decimal(
                str(metadata["processedSize"])
            ),

            ":compressionRatio": Decimal(
                str(metadata["compressionRatio"])
            ),

            ":processingTimeMs": Decimal(
                str(metadata["processingTimeMs"])
            ),

            ":lambdaRequestId": metadata["lambdaRequestId"]

        }
    )
    
def update_failed_metadata(

    batch_id: str,
    processing_id: str,
    error_message: str,
    processing_time: float,
    request_id: str

) -> None:

    table = dynamodb.Table(METADATA_TABLE)

    table.update_item(

        Key={

            "batchId": batch_id,
            "processingId": processing_id

        },

        UpdateExpression="""
            SET
            #status = :status,
            errorMessage = :errorMessage,
            processedAt = :processedAt,
            processingTimeMs = :processingTimeMs,
            lambdaRequestId = :lambdaRequestId
        """,

        ExpressionAttributeNames={

            "#status": "status"

        },

        ExpressionAttributeValues={

            ":status": "FAILED",

            ":errorMessage": error_message,

            ":processedAt": datetime.now(
                timezone.utc
            ).isoformat(),

            ":processingTimeMs": Decimal(
                str(processing_time)
            ),

            ":lambdaRequestId": request_id

        }

    )    
def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """AWS Lambda entrypoint for S3-triggered image processing.


    Expects the S3 event format and returns a small JSON response with
    metadata on success. All runtime errors raise and will be visible
    in Lambda logs; we also emit structured JSON logs for observability.
    """
    start = time.time()
    processing_id = None
    
    batch_id = None
    user_id = None


    try:
        # EventBridge "Object Created" format (không có Records[])
        # Payload: {"source":"aws.s3","detail-type":"Object Created",
        #           "detail":{"bucket":{"name":"..."},"object":{"key":"..."}}, "time":"..."}
        detail = event.get("detail", {})
        bucket = detail["bucket"]["name"]
        key    = detail["object"]["key"]
        uploaded_at = event.get("time")
        
        object_metadata = s3.head_object(
            Bucket=bucket,
            Key=key
        )

        s3_metadata = object_metadata.get("Metadata", {})

        batch_id = s3_metadata.get("batchid")
        processing_id = s3_metadata.get("processingid")
        user_id = s3_metadata.get("userid")
        
        if not batch_id or not processing_id:
            raise ImageProcessingError(
                "Missing batchId or processingId in S3 metadata"
            )   
            
        image_metadata = get_metadata(
            batch_id,
            processing_id
        )

        config = image_metadata.get(
            "optimizationConfig",
            {}
        )

        quality = int(
            config.get(
                "quality",
                JPEG_QUALITY
            )
        )

        resize_enabled = config.get(
            "resizeEnabled",
            True
        )

        max_width = int(
            config.get(
                "maxWidth",
                MAX_WIDTH
            )
        )

        output_format = image_metadata.get(
            "format",
            "JPEG"
        ).upper()

        # Normalize image format name
        if output_format == "JPG":
            output_format = "JPEG"
        
    except Exception as exc:
        log_json("ERROR", "Invalid event payload", error=str(exc))
        raise

    log_json(
        "INFO",
        "processing_started",
        batchId=batch_id,
        processingId=processing_id,
        bucket=bucket,
        key=key,
        requestId=getattr(context, "aws_request_id", "")
    )
    metadata: Dict[str, Any]
    input_path = ""
    optimized_path = ""
    thumb_path = ""


    try:

        input_path = download_s3_file(bucket, key)
        original_size = os.path.getsize(input_path)

        log_json(
            "INFO",
            "download_completed",
            bucket=bucket,
            key=key,
            originalSize=original_size
        )
        

        optimized_path, processed_size, orig_format = optimize_image(
            input_path=input_path,
            max_width=max_width,
            quality=quality,
            resize_enabled=resize_enabled,
            output_format=output_format,
            original_key=key
        )        
        log_json(
            "INFO",
            "image_optimized",
            originalSize=original_size,
            processedSize=processed_size,
            format=orig_format
        )

        # optimized_name = f"{processing_id}_{os.path.splitext(os.path.basename(key))[0]}.jpg"
        # output_key = f"optimized/{optimized_name}"
        filename = os.path.splitext(
            os.path.basename(key)
        )[0]

        extension = {
            "JPEG": ".jpg",
            "JPG": ".jpg",
            "PNG": ".png",
            "WEBP": ".webp"
        }.get(
            output_format,
            ".jpg"
        )

        output_key = (
            f"optimized/{user_id}/{batch_id}/{filename}{extension}"
        )

        thumbnail_extension = {
            "JPEG": ".jpg",
            "JPG": ".jpg",
            "PNG": ".png",
            "WEBP": ".webp"
        }.get(
            output_format,
            ".jpg"
        )

        thumbnail_key = (
            f"thumbnails/{user_id}/{batch_id}/{filename}_thumb{thumbnail_extension}"
        )
        upload_s3_file(optimized_path, OUTPUT_BUCKET, output_key)
        log_json(
            "INFO",
            "optimized_uploaded",
            bucket=OUTPUT_BUCKET,
            key=output_key
        )

        # Thumbnail generation and upload

        thumb_path = generate_thumbnail(
            input_path,
            output_format
        )
        # thumbnail_key = f"thumbnails/thumb_{optimized_name}"

        upload_s3_file(thumb_path, OUTPUT_BUCKET, thumbnail_key)
        log_json(
            "INFO",
            "thumbnail_uploaded",
            bucket=OUTPUT_BUCKET,
            key=thumbnail_key
        )

        compression_ratio = round((1 - processed_size / original_size) * 100, 2) if original_size else 0.0
        processing_time = round((time.time() - start) * 1000, 2)

        metadata = {
            "batchId": batch_id,
            "processingId": processing_id,
            "status": "SUCCESS",
            "outputKey": output_key,
            "thumbnailKey": thumbnail_key,
            "processedAt": datetime.now(timezone.utc).isoformat(),
            "processedSize": processed_size,
            "compressionRatio": compression_ratio,
            "processingTimeMs": processing_time,
            "lambdaRequestId": getattr(
                context,
                "aws_request_id",
                ""
            )
        }


        # Emit structured log and persist metadata separately
        log_json("INFO", "image_processed", metadata=metadata)
        update_success_metadata(
            metadata
        )        
        log_json(
            "INFO",
            "processing_completed",
            batchId=batch_id,
            processingId=processing_id,
            processingTimeMs=processing_time,
            status="SUCCESS"
        )

        return {"statusCode": 200, "message": "Image processed successfully", "metadata": metadata}


    except UnsupportedFormatError as exc:
        processing_time = round((time.time() - start) * 1000, 2)
        update_failed_metadata(
            batch_id=batch_id,
            processing_id=processing_id,
            error_message=str(exc),
            processing_time=processing_time,
            request_id=getattr(
                context,
                "aws_request_id",
                ""
            )
        )
        log_json(
            "ERROR",
            "unsupported_format",
            bucket=bucket,
            key=key,
            metadata=metadata
        )
        raise

    except ImageProcessingError as exc:
        processing_time = round((time.time() - start) * 1000, 2)
        update_failed_metadata(
            batch_id=batch_id,
            processing_id=processing_id,
            error_message=str(exc),
            processing_time=processing_time,
            request_id=getattr(
                context,
                "aws_request_id",
                ""
            )
        )
        log_json(
            "ERROR",
            "processing_error",
            bucket=bucket,
            key=key,
            error=str(exc)
        )       
        raise


    except Exception as exc:  # pragma: no cover - unexpected
        processing_time = round((time.time() - start) * 1000, 2)
        update_failed_metadata(
            batch_id=batch_id,
            processing_id=processing_id,
            error_message=str(exc),
            processing_time=processing_time,
            request_id=getattr(
                context,
                "aws_request_id",
                ""
            )
        )
        log_json(
            "ERROR",
            "unexpected_error",
            bucket=bucket,
            key=key,
            error=str(exc)
        )
        raise


    finally:
        # Clean up temporary files if they exist
        for path in (input_path, optimized_path, thumb_path):
            try:
                if path and os.path.exists(path):
                    os.remove(path)
            except Exception:
                pass
