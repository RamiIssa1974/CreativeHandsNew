// utils/axiosAuth.ts
import axios from 'axios';

const axiosAuth = axios.create({
    baseURL: process.env.NEXT_PUBLIC_PY_API_BASE,//http://194.36.89.39:7163/api/ , http://localhost:7163/api/ 
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosAuth.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosAuth;
