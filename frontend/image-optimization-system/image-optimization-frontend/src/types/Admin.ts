// =========================================================
// Admin Types
// =========================================================

export interface AdminUser {
    userId: string;
    email: string;
    name: string;
    avatarUrl?: string;
    role?: string;
    status?: string;
    createdAt?: string;
    lastLogin?: string;
    totalImages: number;
    totalBatches: number;
    totalSuccess?: number;
    totalFailed?: number;
    savedBytes?: number;
}

export interface AdminImage {
    imageId: string;
    userId: string;
    originalName: string;
    status: "SUCCESS" | "FAILED" | "PROCESSING";
    originalSize: number;
    processedSize?: number;
    compressionRatio?: number;
    format?: string;
    processingTimeMs?: number;
    uploadedAt: string;
    processedAt?: string;
    outputKey?: string;
    thumbnailKey?: string;
    errorMessage?: string;
}

export interface DashboardStats {
    totalUsers: number;
    totalUploads: number;
    totalSuccess: number;
    totalFailed: number;
    totalSavedBytes: number;
    avgCompressionRatio: number;
    uploadsToday: number;
    successRate: number;
}
