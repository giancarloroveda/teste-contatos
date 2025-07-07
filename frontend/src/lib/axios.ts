import Axios from "axios";
import { useAuthStore } from "../Stores/AuthStore.ts";

const axios = Axios.create({
    baseURL: "http://localhost:8000",
    withCredentials: true,
});

axios.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
};

axios.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes("/login") &&
            !originalRequest.url.includes("/refresh")
        ) {
            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token: string) => {
                            originalRequest.headers["Authorization"] =
                                `Bearer ${token}`;
                            resolve(axios(originalRequest));
                        },
                        reject: reject,
                    });
                });
            }

            isRefreshing = true;

            try {
                const res = await axios.post("/refresh");
                const newToken = res.data.accessToken;
                useAuthStore.getState().setAccessToken(newToken);

                originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

                processQueue(null, newToken);
                return axios(originalRequest);
            } catch (err) {
                useAuthStore.getState().setUser(null);
                useAuthStore.getState().setAccessToken(null);
                processQueue(err, null);
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default axios;