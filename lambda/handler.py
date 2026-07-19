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
SUPPORTED_FORMATS = {"JPEG", "PNG", "WEBP", "BMP", "TIFF","JPG","MPO"}
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
    max_width: int = MAX_WIDTH,
    quality: int = JPEG_QUALITY,
    original_key: str = "",  # Thêm tham số này để fallback extension từ S3 Key
) -> Tuple[str, int, str]:
    """Open, auto-rotate, resize and save an optimized JPEG.
    Returns (output_path, processed_size_bytes, original_format).
    """
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
    if image.width and image.width > max_width:
        ratio = max_width / image.width
        new_height = max(1, int(image.height * ratio))
        image = image.resize((max_width, new_height), Image.Resampling.LANCZOS)




    # Convert paletted or alpha images to RGB for JPEG
    if image.mode in ("RGBA", "LA", "P"):
        image = image.convert("RGB")




    # Save optimized JPEG to a temporary file
    out_tmp = tempfile.NamedTemporaryFile(prefix="img_out_", suffix=".jpg", delete=False)
    out_path = out_tmp.name
    out_tmp.close()




    try:
        image.save(out_path, format="JPEG", quality=quality, optimize=True)
    except Exception as exc:
        try:
            os.remove(out_path)
        except Exception:
            pass
        raise ImageProcessingError(f"Failed to save optimized image: {exc}")




    processed_size = os.path.getsize(out_path)
    return out_path, processed_size, orig_format








def generate_thumbnail(input_path: str, size: Tuple[int, int] = THUMB_SIZE) -> str:
    """Generate a thumbnail JPEG and return its local path."""
    try:
        image = Image.open(input_path)
    except Exception as exc:
        raise ImageProcessingError(f"Unable to open image for thumbnail: {exc}")




    image = ImageOps.exif_transpose(image)
    if image.mode in ("RGBA", "LA", "P"):
        image = image.convert("RGB")




    thumb = image.copy()
    thumb.thumbnail(size, Image.Resampling.LANCZOS)




    tmp = tempfile.NamedTemporaryFile(prefix="img_thumb_", suffix=".jpg", delete=False)
    tmp.close()
    try:
        thumb.save(tmp.name, format="JPEG", quality=85, optimize=True)
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




def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """AWS Lambda entrypoint for S3-triggered image processing.




    Expects the S3 event format and returns a small JSON response with
    metadata on success. All runtime errors raise and will be visible
    in Lambda logs; we also emit structured JSON logs for observability.
    """
    start = time.time()
    processing_id = str(uuid.uuid4())
    batch_id = processing_id




    try:
        record = event["Records"][0]
        bucket = record["s3"]["bucket"]["name"]
        key = record["s3"]["object"]["key"]
        uploaded_at = record.get("eventTime")
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


        optimized_path, processed_size, orig_format = optimize_image(input_path, original_key=key)
        log_json(
            "INFO",
            "image_optimized",
            originalSize=original_size,
            processedSize=processed_size,
            format=orig_format
        )


        optimized_name = f"{os.path.splitext(os.path.basename(key))[0]}.jpg"
        output_key = f"optimized/{optimized_name}"
       
        upload_s3_file(optimized_path, OUTPUT_BUCKET, output_key)
        log_json(
            "INFO",
            "optimized_uploaded",
            bucket=OUTPUT_BUCKET,
            key=output_key
        )


        # Thumbnail generation and upload


        thumb_path = generate_thumbnail(input_path)
        thumbnail_key = f"thumbnails/thumb_{optimized_name}"


        upload_s3_file(thumb_path, OUTPUT_BUCKET, thumbnail_key)
        log_json(
            "INFO",
            "thumbnail_uploaded",
            bucket=OUTPUT_BUCKET,
            key=thumbnail_key
        )


        compression_ratio = round((1 - processed_size / original_size) * 100, 2) if original_size else 0.0
        processing_time = round((time.time() - start) * 1000, 2)


        metadata = build_metadata(
            imageId=key, 
            batchId=batch_id,
            processingId=processing_id,
            originalName=os.path.basename(key),
            inputBucket=bucket,
            outputBucket=OUTPUT_BUCKET,
            inputKey=key,
            outputKey=output_key,
            uploadedAt=uploaded_at,
            processedAt=datetime.now(timezone.utc).isoformat(),
            status="SUCCESS",
            errorMessage="",
            lambdaRequestId=getattr(context, "aws_request_id", ""),
            originalSize=original_size,
            processedSize=processed_size,
            compressionRatio=compression_ratio,
            format=orig_format,
            processingTimeMs=processing_time,
            thumbnailKey=thumbnail_key,
        )




        # Emit structured log and persist metadata separately
        log_json("INFO", "image_processed", metadata=metadata)
        persist_metadata(metadata)
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
        metadata = build_metadata(
            imageId=key, 
            batchId=batch_id,
            processingId=processing_id,
            status="FAILED",
            errorMessage=str(exc),
            processedAt=datetime.now(timezone.utc).isoformat(),
            lambdaRequestId=getattr(context, "aws_request_id", ""),
            processingTimeMs=processing_time,
        )
        log_json(
            "ERROR",
            "unsupported_format",
            bucket=bucket,
            key=key,
            metadata=metadata
        )
        persist_metadata(metadata)      
        raise




    except ImageProcessingError as exc:
        processing_time = round((time.time() - start) * 1000, 2)
        metadata = build_metadata(
            imageId=key, 
            batchId=batch_id,
            processingId=processing_id,
            status="FAILED",
            errorMessage=str(exc),
            processedAt=datetime.now(timezone.utc).isoformat(),
            lambdaRequestId=getattr(context, "aws_request_id", ""),
            processingTimeMs=processing_time,
        )
        log_json(
            "ERROR",
            "processing_error",
            bucket=bucket,
            key=key,
            metadata=metadata
        )   
        raise




    except Exception as exc:  # pragma: no cover - unexpected
        processing_time = round((time.time() - start) * 1000, 2)
        metadata = build_metadata(
            imageId=key, 
            batchId=batch_id,
            processingId=processing_id,
            status="FAILED",
            errorMessage=str(exc),
            processedAt=datetime.now(timezone.utc).isoformat(),
            lambdaRequestId=getattr(context, "aws_request_id", ""),
            processingTimeMs=processing_time,
        )
        log_json(
            "ERROR",
            "unexpected_error",
            bucket=bucket,
            key=key,
            metadata=metadata
        )
        persist_metadata(metadata)
        raise




    finally:
        # Clean up temporary files if they exist
        for path in (input_path, optimized_path, thumb_path):
            try:
                if path and os.path.exists(path):
                    os.remove(path)
            except Exception:
                pass

