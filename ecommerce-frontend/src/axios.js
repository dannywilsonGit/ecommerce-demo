import axios from "axios";
import store from "@/store";

const instance = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
});

// Dans axios.js
instance.interceptors.request.use(config => {
    const token = localStorage.getItem('token'); // Fallback au store
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default instance;