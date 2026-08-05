import api from "../api/axios";

interface ImageUploadConfig {
    quality?: number;
    resizeEnabled?: boolean;
    maxWidth?: number;
    maxHeight?: number;
}

export const imageService = {

    async prepareUpload(files: File[], options?: { format?: string; config?: ImageUploadConfig, userId?: string }) {
        const body = {
            userId: options?.userId || "anonymous",
            files: files.map(f => ({ fileName: f.name, contentType: f.type, size: f.size })),
            format: options?.format ?? "JPEG",
            config: options?.config ?? {}
        };
        
        const apiGwUrl = import.meta.env.VITE_API_GATEWAY_URL || "https://0cbbc3p01b.execute-api.us-east-1.amazonaws.com/prod";
        
        const response = await fetch(`${apiGwUrl}/upload`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
        
        if (!response.ok) {
            throw new Error("Failed to prepare upload");
        }
        return response.json();
    },

    async uploadToS3(file: File, presignedUrl: string) {
        const response = await fetch(presignedUrl, {
            method: "PUT",
            headers: {
                "Content-Type": file.type
            },
            body: file
        });
        
        if (!response.ok) {
            throw new Error("Failed to upload to S3");
        }
    },

    getBatch(batchId: string) {

        return api.get(`/image/batches/${batchId}`, {
            withCredentials: true,
        });

    },

    downloadImage(batchId: string, processingId = batchId) {

        return api.get(
            `/image/images/${batchId}/${processingId}/download`,
            {
                responseType: "blob",
                withCredentials: true,
            }
        );

    },

    downloadBatch(batchId: string) {

        return api.get(
            `/image/batches/${batchId}/download`,
            {
                responseType: "blob",
                withCredentials: true,
            }
        );

    }

};