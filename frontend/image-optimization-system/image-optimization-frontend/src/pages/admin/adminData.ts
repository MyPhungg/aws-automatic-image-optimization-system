import type { AdminUser, AdminImage, DashboardStats } from "../../types/Admin";

// ─── Mock data – thay bằng API thực khi backend sẵn sàng ────────────────────

export const mockStats: DashboardStats = {
    totalUsers: 128,
    totalUploads: 3_847,
    totalSuccess: 3_712,
    totalFailed: 135,
    totalSavedBytes: 2_340_000_000, // ~2.34 GB
    avgCompressionRatio: 72.4,
    uploadsToday: 94,
    successRate: 96.5,
};

export const mockUsers: AdminUser[] = [
    {
        userId: "google-101",
        email: "alice@gmail.com",
        name: "Alice Nguyễn",
        avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Alice",
        role: "ADMIN",
        status: "ACTIVE",
        createdAt: "2026-01-10T08:00:00Z",
        lastLogin: "2026-08-04T02:00:00Z",
        totalImages: 412,
        totalBatches: 35,
        totalSuccess: 408,
        totalFailed: 4,
        savedBytes: 520_000_000,
    },
    {
        userId: "google-102",
        email: "bob@gmail.com",
        name: "Bob Trần",
        avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Bob",
        role: "USER",
        status: "ACTIVE",
        createdAt: "2026-02-15T09:30:00Z",
        lastLogin: "2026-08-03T14:00:00Z",
        totalImages: 86,
        totalBatches: 5,
        totalSuccess: 80,
        totalFailed: 6,
        savedBytes: 95_000_000,
    },
    {
        userId: "google-103",
        email: "carol@gmail.com",
        name: "Carol Lê",
        avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Carol",
        role: "USER",
        status: "ACTIVE",
        createdAt: "2026-03-20T11:00:00Z",
        lastLogin: "2026-08-01T08:00:00Z",
        totalImages: 231,
        totalBatches: 18,
        totalSuccess: 225,
        totalFailed: 6,
        savedBytes: 278_000_000,
    },
    {
        userId: "google-104",
        email: "dave@gmail.com",
        name: "Dave Phạm",
        avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Dave",
        role: "USER",
        status: "DELETED",
        createdAt: "2026-01-05T07:00:00Z",
        lastLogin: "2026-05-10T10:00:00Z",
        totalImages: 19,
        totalBatches: 2,
        totalSuccess: 15,
        totalFailed: 4,
        savedBytes: 12_000_000,
    },
    {
        userId: "google-105",
        email: "eva@gmail.com",
        name: "Eva Hoàng",
        avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Eva",
        role: "USER",
        status: "ACTIVE",
        createdAt: "2026-04-01T13:00:00Z",
        lastLogin: "2026-08-04T01:00:00Z",
        totalImages: 549,
        totalBatches: 42,
        totalSuccess: 541,
        totalFailed: 8,
        savedBytes: 680_000_000,
    },
];

export const mockImagesByUser: Record<string, AdminImage[]> = {
    "google-101": [
        {
            imageId: "uploads/google-101/batch-001/photo1.jpg",
            userId: "google-101",
            originalName: "photo1.jpg",
            status: "SUCCESS",
            originalSize: 3_200_000,
            processedSize: 640_000,
            compressionRatio: 80,
            format: "JPEG",
            processingTimeMs: 1240,
            uploadedAt: "2026-08-04T01:00:00Z",
            processedAt: "2026-08-04T01:00:02Z",
            outputKey: "optimized/google-101/batch-001/photo1.jpg",
            thumbnailKey: "thumbnails/google-101/batch-001/thumb_photo1.jpg",
        },
        {
            imageId: "uploads/google-101/batch-001/photo2.png",
            userId: "google-101",
            originalName: "photo2.png",
            status: "SUCCESS",
            originalSize: 5_800_000,
            processedSize: 980_000,
            compressionRatio: 83,
            format: "JPEG",
            processingTimeMs: 2100,
            uploadedAt: "2026-08-04T01:01:00Z",
            processedAt: "2026-08-04T01:01:03Z",
            outputKey: "optimized/google-101/batch-001/photo2.jpg",
            thumbnailKey: "thumbnails/google-101/batch-001/thumb_photo2.jpg",
        },
        {
            imageId: "uploads/google-101/batch-002/broken.bmp",
            userId: "google-101",
            originalName: "broken.bmp",
            status: "FAILED",
            originalSize: 1_200_000,
            uploadedAt: "2026-08-03T10:00:00Z",
            errorMessage: "UnsupportedFormatError: BMP format not supported",
        },
    ],
    "google-102": [
        {
            imageId: "uploads/google-102/batch-001/landscape.jpg",
            userId: "google-102",
            originalName: "landscape.jpg",
            status: "SUCCESS",
            originalSize: 8_400_000,
            processedSize: 1_260_000,
            compressionRatio: 85,
            format: "JPEG",
            processingTimeMs: 3200,
            uploadedAt: "2026-08-03T14:00:00Z",
            processedAt: "2026-08-03T14:00:04Z",
        },
    ],
    "google-105": [
        {
            imageId: "uploads/google-105/batch-001/avatar.png",
            userId: "google-105",
            originalName: "avatar.png",
            status: "SUCCESS",
            originalSize: 900_000,
            processedSize: 135_000,
            compressionRatio: 85,
            format: "JPEG",
            processingTimeMs: 820,
            uploadedAt: "2026-08-04T01:00:00Z",
            processedAt: "2026-08-04T01:00:01Z",
        },
        {
            imageId: "uploads/google-105/batch-001/banner.jpg",
            userId: "google-105",
            originalName: "banner.jpg",
            status: "PROCESSING",
            originalSize: 12_000_000,
            uploadedAt: "2026-08-04T01:05:00Z",
        },
    ],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function formatBytes(bytes: number): string {
    if (bytes >= 1_000_000_000) return `${(bytes / 1_000_000_000).toFixed(2)} GB`;
    if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
    if (bytes >= 1_000) return `${(bytes / 1_000).toFixed(0)} KB`;
    return `${bytes} B`;
}

export function formatDate(iso: string): string {
    return new Date(iso).toLocaleString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function timeAgo(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60_000);
    if (mins < 60) return `${mins} mins ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hours ago`;
    return `${Math.floor(hours / 24)} days ago`;
}
