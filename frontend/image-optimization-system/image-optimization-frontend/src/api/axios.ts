import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_GATEWAY_URL 
        ? `${import.meta.env.VITE_API_GATEWAY_URL}/api`
        : "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

export default api;