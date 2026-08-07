import api from "../api/axios";
import type { AdminUser } from "../types/Admin";

export const userService = {

    getCurrentUser() {
        return api.get("/user");
    },

    getAllUsers() {
        return api.get<AdminUser[]>("/user/all");
    },

    getUserById(id: string) {
        return api.get(`/user/${id}`);
    },

    getUserHistory() {
        return api.get("/user");
    }

};
