// utils/pyAxiosAuth.ts
import axios from 'axios';

const pyAxiosAuth = axios.create({
    baseURL: process.env.NEXT_PUBLIC_PY_API_BASE,
    headers: {
        'Content-Type': 'application/json',
    },
});

pyAxiosAuth.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default pyAxiosAuth;
