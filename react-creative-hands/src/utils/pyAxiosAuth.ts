// utils/pyAxiosAuth.ts
import axios from 'axios';

const API_BASE =
    process.env.NEXT_PUBLIC_PY_API_BASE ??
    'http://127.0.0.1:7163';

const pyAxiosAuth = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json',
    },
});

pyAxiosAuth.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

export default pyAxiosAuth;
