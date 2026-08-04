// =========================================================
// ImageItem Interface
// =========================================================
// Mô tả:
// Đại diện cho một ảnh mà người dùng upload.
//
// Interface này sẽ được sử dụng xuyên suốt dự án:
//
// - Upload Page
// - Preview List
// - Compression Preset
// - Upload lên S3
// - Theo dõi trạng thái xử lý
// - Download kết quả
//
// Vì vậy nên thiết kế đầy đủ ngay từ đầu để tránh
// phải sửa lại ở các giai đoạn sau.
// =========================================================

/**
 * Các Preset hỗ trợ
 *
 * BALANCED      : Cân bằng chất lượng và dung lượng
 * HIGH_QUALITY  : Ưu tiên chất lượng ảnh
 * SAVE_SPACE    : Ưu tiên giảm dung lượng
 */

export type CompressionPreset = | "BALANCED" | "HIGH_QUALITY" | "SAVE_SPACE";

/*** Trạng thái xử lý của ảnh */

export type ImageStatus = | "PENDING" | "PROCESSING" | "UPLOADING" | "SUCCESS" | "FAILED"; 

/** Một ảnh dc upload */
export interface Imageitem {
    id: string;
    file: File;
    previewUrl : string;
    name: string;
    size: number;
    type: string;
    preset: CompressionPreset;
    status: ImageStatus;
    progress:number;
    createdAt: Date;
    width: number;
    height: number;
    totalPixels: number;
    hash: string;
    optimizedSize?: number;
    optimizedUrl?:string;
    thumbnailUrl?:string;
    errorMessage?: string;
    result?: ImageResult;
}
export interface ImageResult {
    originalSize?: number;

    optimizedSize?: number;

    compressionRatio?: number;

    processingTimeMs?: number;

    outputUrl?: string;
    thumbnailUrl?: string;
    s3Key?: string;
}