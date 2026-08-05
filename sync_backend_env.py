import json
import os

# Đường dẫn tới file CDK outputs (kết quả của cdk deploy --outputs-file cdk-outputs.json)
OUTPUTS_FILE = "cdk-outputs.json"
# Đường dẫn tới file .env của backend
ENV_FILE = "backend/image-optimizer/.env"

def main():
    if not os.path.exists(OUTPUTS_FILE):
        print(f"File {OUTPUTS_FILE} không tồn tại. Vui lòng chạy lệnh: cdk deploy --all --outputs-file {OUTPUTS_FILE}")
        return

    with open(OUTPUTS_FILE, "r", encoding="utf-8") as f:
        outputs = json.load(f)

    # Lấy các output từ StorageStack
    storage_stack_outputs = outputs.get("StorageStack", {})
    input_bucket  = storage_stack_outputs.get("OriginalImageBucketName", "")
    output_bucket = storage_stack_outputs.get("OptimizedImageBucketName", "")
    image_table   = storage_stack_outputs.get("ImageMetadataTableName", "")
    user_table    = storage_stack_outputs.get("UserMetadataTableName", "")

    # Lấy API Gateway URL từ ApiStack
    api_stack_outputs  = outputs.get("ApiStack", {})
    api_gateway_url    = api_stack_outputs.get("ApiGatewayUrl", "")

    if not input_bucket:
        print("Không tìm thấy thông tin bucket trong cdk-outputs.json")
        return

    # Đọc file .env hiện tại nếu có
    env_vars = {}
    if os.path.exists(ENV_FILE):
        with open(ENV_FILE, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#"):
                    if "=" in line:
                        key, val = line.split("=", 1)
                        env_vars[key.strip()] = val.strip()

    # Cập nhật các biến môi trường từ CDK outputs
    env_vars["S3_INPUT_BUCKET"]    = input_bucket
    env_vars["S3_OUTPUT_BUCKET"]   = output_bucket
    env_vars["DYNAMODB_IMAGE_TABLE"] = image_table
    if user_table:
        env_vars["DYNAMODB_USER_TABLE"] = user_table
    if api_gateway_url:
        env_vars["API_GATEWAY_URL"] = api_gateway_url

    # Ghi lại file .env
    with open(ENV_FILE, "w", encoding="utf-8") as f:
        for k, v in env_vars.items():
            f.write(f"{k}={v}\n")

    print(f"Đã cập nhật thành công {ENV_FILE}")
    print(f"  S3_INPUT_BUCKET:      {input_bucket}")
    print(f"  S3_OUTPUT_BUCKET:     {output_bucket}")
    print(f"  DYNAMODB_IMAGE_TABLE: {image_table}")
    print(f"  DYNAMODB_USER_TABLE: {user_table}")
    
    if api_gateway_url:
        print(f"  API_GATEWAY_URL:      {api_gateway_url}")

if __name__ == "__main__":
    main()
