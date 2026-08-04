import api from "../api/axios";

export const userService = {

    getCurrentUser() {

        return api.get("/user");

    },

    getAllUsers() {

        return api.get("/user/all");

    }

};