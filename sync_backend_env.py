import json
import os

# Đường dẫn tới file CDK outputs (kết quả của cdk deploy --outputs-file cdk-outputs.json)
OUTPUTS_FILE = "cdk-outputs.json"
# Đường dẫn tới file .env của backend
ENV_FILE = "backend/image-optimizer/.env"
# Đường dẫn tới file .env của frontend
FRONTEND_ENV_FILE = "frontend/image-optimization-system/image-optimization-frontend/.env"

def main():
    if not os.path.exists(OUTPUTS_FILE):
        print(f"File {OUTPUTS_FILE} not found. Please run: cdk deploy --all --outputs-file {OUTPUTS_FILE}")
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
        print("Could not find bucket info in cdk-outputs.json")
        return

    # --- Cập nhật Backend .env ---
    env_vars = {}
    if os.path.exists(ENV_FILE):
        with open(ENV_FILE, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#"):
                    if "=" in line:
                        key, val = line.split("=", 1)
                        env_vars[key.strip()] = val.strip()

    env_vars["S3_INPUT_BUCKET"]    = input_bucket
    env_vars["S3_OUTPUT_BUCKET"]   = output_bucket
    env_vars["DYNAMODB_IMAGE_TABLE"] = image_table
    if user_table:
        env_vars["DYNAMODB_USER_TABLE"] = user_table
    if api_gateway_url:
        env_vars["API_GATEWAY_URL"] = api_gateway_url

    with open(ENV_FILE, "w", encoding="utf-8") as f:
        for k, v in env_vars.items():
            f.write(f"{k}={v}\n")

    print(f"Successfully updated {ENV_FILE}")
    print(f"  S3_INPUT_BUCKET:      {input_bucket}")
    print(f"  S3_OUTPUT_BUCKET:     {output_bucket}")
    print(f"  DYNAMODB_IMAGE_TABLE: {image_table}")
    print(f"  DYNAMODB_USER_TABLE: {user_table}")
    
    # --- Cập nhật Frontend .env ---
    frontend_env_vars = {}
    if os.path.exists(FRONTEND_ENV_FILE):
        with open(FRONTEND_ENV_FILE, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#"):
                    if "=" in line:
                        key, val = line.split("=", 1)
                        frontend_env_vars[key.strip()] = val.strip()
    
    # URL lấy từ CDK có dấu / ở cuối, ta có thể bỏ nó nếu muốn hoặc giữ nguyên.
    if api_gateway_url:
        # Nếu URL có dấu / ở cuối, ta loại bỏ để khi dùng không bị "//"
        clean_url = api_gateway_url.rstrip('/')
        frontend_env_vars["VITE_API_GATEWAY_URL"] = clean_url
        
    with open(FRONTEND_ENV_FILE, "w", encoding="utf-8") as f:
        for k, v in frontend_env_vars.items():
            f.write(f"{k}={v}\n")
            
    print(f"\nSuccessfully updated {FRONTEND_ENV_FILE}")
    if api_gateway_url:
        print(f"  VITE_API_GATEWAY_URL: {frontend_env_vars['VITE_API_GATEWAY_URL']}")

if __name__ == "__main__":
    main()
