# 🚀 Hướng Dẫn Setup & Triển Khai: AWS Automatic Image Optimization System

Dự án này sử dụng **AWS CDK (Python)** để triển khai hạ tầng Infrastructure as Code (IaC) toàn diện trên AWS, kết hợp với Frontend React (Vite) host trên AWS Amplify và Backend Spring Boot chạy trên AWS Lambda qua Docker.

Tài liệu này hướng dẫn cách setup môi trường, cấu hình và triển khai dự án từ A đến Z.

---

## 📋 1. Điều Kiện Tiên Quyết (Prerequisites)

Trước khi bắt đầu, hãy đảm bảo máy tính của bạn đã cài đặt các công cụ sau:

1. **[Python 3.13+](https://www.python.org/downloads/)**
2. **[Node.js 24+](https://nodejs.org/)** (Dùng để build frontend & chạy AWS CDK)
3. **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** (Bắt buộc phải mở Docker khi deploy vì CDK cần build Image cho Spring Boot)
4. **[AWS CLI v2](https://aws.amazon.com/cli/)** (Đã cấu hình `aws configure` với tài khoản AWS của bạn)
5. **[AWS CDK CLI](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html)**:
   ```bash
   npm install -g aws-cdk
   ```

---

## 🛠️ 2. Cấu Hình Biến Môi Trường (Environment Variables)

Hệ thống cần các secret keys để hoạt động (đặc biệt là tính năng Đăng nhập bằng Google).

### 2.1 Cấu hình cho Backend (Bắt buộc khi deploy CDK)
Tạo file `.env` bên trong thư mục `backend/image-optimizer/`:
```bash
# Đường dẫn: backend/image-optimizer/.env

GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
JWT_SECRET=mot_chuoi_bi_mat_rat_dai_va_phuc_tap_it_nhat_32_ky_tu_cho_hmac_sha256
```
*(Nếu thiếu file này, CDK sẽ đọc giá trị default dẫn đến lỗi 403 khi login).*

### 2.2 Cấu hình cho Frontend (Dùng khi dev local)
Tạo file `.env` bên trong thư mục `frontend/image-optimization-system/image-optimization-frontend/`:
```bash
# Đường dẫn: frontend/image-optimization-system/image-optimization-frontend/.env

VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
VITE_API_GATEWAY_URL=https://<api-id>.execute-api.us-east-1.amazonaws.com/prod
```
*(Lưu ý: `VITE_API_GATEWAY_URL` sẽ có được SAU KHI bạn deploy CDK thành công).*

---

## 🚀 3. Hướng Dẫn Triển Khai Lên AWS (Manual Deployment)

Nếu bạn muốn tự deploy từ máy cá nhân lên AWS (thay vì qua GitHub Actions), hãy làm theo các bước sau:

### Bước 3.1: Setup môi trường Python ảo cho CDK
Tại thư mục gốc của dự án:
```bash
# MacOS/Linux
python -m venv .venv
source .venv/bin/activate

# Windows
python -m venv .venv
.venv\Scripts\activate.bat
```

Cài đặt các thư viện cần thiết:
```bash
pip install -r requirements.txt
```

### Bước 3.2: Bootstrap môi trường AWS (Chỉ chạy 1 lần duy nhất)
Nếu đây là lần đầu tiên bạn dùng CDK trên tài khoản/region này:
```bash
cdk bootstrap aws://<ACCOUNT-NUMBER>/<REGION>
# Ví dụ: cdk bootstrap aws://123456789012/us-east-1
```

### Bước 3.3: Deploy các AWS Stacks
Đảm bảo **Docker đang chạy**. Sau đó thực thi lệnh deploy:

```bash
cdk deploy --all --outputs-file cdk-outputs.json
```
Quá trình này sẽ mất khoảng 5-10 phút để build Docker image, tạo S3 Buckets, DynamoDB tables, Lambda functions, API Gateway và AWS Amplify app.

### Bước 3.4: Đồng bộ cấu hình cho Frontend
Sau khi deploy xong, AWS sẽ trả về các URL cần thiết trong file `cdk-outputs.json`.
Bạn có thể tự động lấy `ApiGatewayUrl` gán vào thư mục frontend bằng script có sẵn:

```bash
python sync_backend_env.py
```
*(Script này sẽ đọc `cdk-outputs.json` và tạo file `.env` cho Frontend).*

### Bước 3.5: Deploy Frontend lên AWS Amplify
Thực tế, `AmplifyHostingStack` chỉ tạo cấu trúc App trên AWS. Để đẩy code React lên đó, bạn vào thư mục frontend:
```bash
cd frontend/image-optimization-system/image-optimization-frontend
npm install
npm run build
```
*(Hoặc xem file `.github/workflows/deploy.yml` để thấy cách CI/CD zip thư mục `dist` và gọi API của Amplify để deploy).*

---

## 🔄 4. Hướng Dẫn Deploy Tự Động Qua GitHub Actions (CI/CD)

Dự án đã được tích hợp sẵn luồng CI/CD trong `.github/workflows/deploy.yml`. Mỗi khi có thay đổi được push lên nhánh `main`, hệ thống sẽ tự động deploy cả CDK và Frontend.

**Để CI/CD hoạt động, bạn cần vào GitHub Repository > Settings > Secrets and variables > Actions và thêm các Repository Secrets sau:**

1. `AWS_ACCESS_KEY_ID`: Access key của IAM User có quyền admin deploy CDK.
2. `AWS_SECRET_ACCESS_KEY`: Secret key tương ứng.
3. `AWS_SESSION_TOKEN`: (Tuỳ chọn) Dùng nếu bạn dùng tài khoản lab.
4. `VITE_GOOGLE_CLIENT_ID`: Google Client ID.

Pipeline sẽ tự động:
1. Tạo file `.env` cho Backend.
2. Lưu Google Client ID vào AWS Secrets Manager.
3. Chạy `cdk deploy --all`.
4. Lấy API Gateway URL, build React app.
5. Zip mã nguồn và upload thẳng lên AWS Amplify.

---

## 💻 5. Hướng Dẫn Chạy Local (Development)

### 5.1 Chạy Frontend Local
```bash
cd frontend/image-optimization-system/image-optimization-frontend
npm install
npm run dev
```
Truy cập `http://localhost:5173`. Đảm bảo file `.env` của frontend đã có `VITE_API_GATEWAY_URL` trỏ về API Gateway thật trên AWS.

### 5.2 Chạy Backend Spring Boot Local
Nếu muốn sửa code Java và test local (kết nối trực tiếp với DynamoDB & S3 trên AWS):
```bash
cd backend/image-optimizer
# Chạy Spring Boot
./mvnw spring-boot:run
```
(Chú ý: Cần cấu hình AWS CLI credentials chuẩn trên máy tính để Spring Boot có thể gọi các dịch vụ AWS. Bổ sung `GOOGLE_CLIENT_ID` và `JWT_SECRET` trong biến môi trường hoặc `application.yml` khi chạy local).

---

## 🧹 6. Xóa Tài Nguyên (Clean Up)

Để tránh phát sinh chi phí khi không dùng nữa, hãy chạy lệnh sau để xóa toàn bộ tài nguyên đã tạo trên AWS:
```bash
cdk destroy --all
```
*(Lưu ý: S3 Buckets và DynamoDB tables đã được cấu hình `RemovalPolicy.DESTROY` nên sẽ bị xóa sạch dữ liệu. Hãy cẩn thận!)*
