import api from "../api/axios";

export interface HistoryResponse {
    batchId: string;
    uploadedAt: string;
    totalImages: number;
    successImages: number;
    failedImages: number;
}

export const dashBoardService = {
    getMyHistory() {
        return api.get<HistoryResponse[]>('/user', { withCredentials: true });
    },

    getAllUsers() {
        return api.get('/user/all', { withCredentials: true });
    },

    getBatch(batchId: string) {
        return api.get(`/image/batches/${batchId}`);
    }
};
