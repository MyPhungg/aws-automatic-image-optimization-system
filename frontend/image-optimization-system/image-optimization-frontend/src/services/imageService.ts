import api from "../api/axios";

export const imageService = {

    upload(formData: FormData) {

        return api.post("/image/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

    },

    getBatch(batchId: string) {

        return api.get(`/image/batches/${batchId}`);

    },

    downloadImage(imageId: string) {

        return api.get(
            `/image/images/${imageId}/${imageId}/download`,
            {
                responseType: "blob",
            }
        );

    },

    downloadBatch(batchId: string) {

        return api.get(
            `/image/batches/${batchId}/download`,
            {
                responseType: "blob",
            }
        );

    }

};