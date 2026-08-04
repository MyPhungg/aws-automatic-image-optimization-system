import api from "../api/axios";

interface ImageUploadConfig {
    quality?: number;
    resizeEnabled?: boolean;
    maxWidth?: number;
    maxHeight?: number;
}

export const imageService = {

    upload(files: File[], options?: { format?: string; config?: ImageUploadConfig }) {

        const formData = new FormData();

        files.forEach((file) => {
            formData.append("files", file);
        });

        formData.append("format", options?.format ?? "jpg");
        formData.append("configReq", JSON.stringify(options?.config ?? {}));

        return api.post("/image/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
        });

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