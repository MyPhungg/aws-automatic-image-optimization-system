import axios from "axios";

const rawBaseUrl = import.meta.env.VITE_API_GATEWAY_URL;
const cleanBaseUrl = rawBaseUrl ? rawBaseUrl.replace(/\/+$/, "") : "http://localhost:8080";

const api = axios.create({
    baseURL: `${cleanBaseUrl}/api`,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            window.dispatchEvent(new CustomEvent("api:unauthorized"));
        }
        return Promise.reject(error);
    },
);

export default api;
