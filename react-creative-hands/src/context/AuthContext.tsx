'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '../data/User';
import { AuthContextType } from '../data/AuthContextType';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Prefer env at build-time; fall back to a sensible dev default.
const API_BASE =                
    process.env.NEXT_PUBLIC_PY_API_BASE ||
    'http://127.0.0.1:7163';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        try {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
                setIsLoggedIn(true);
            }
        } catch {
            // ignore corrupted localStorage
        } finally {
            setLoading(false);
        }
    }, []);

    const login = async (username: string, password: string): Promise<User> => {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // our FastAPI accepts lowercase keys
            body: JSON.stringify({ username, password }),
        });

        if (!res.ok) {
            // surface HTTP status info if possible
            let detail = '';
            try {
                const errJson = await res.json();
                detail = errJson?.detail || '';
            } catch { }
            throw new Error(detail || `Login failed (${res.status})`);
        }

        const data = await res.json();

        // Accept both casings from the backend
        const token = data.token ?? data.Token;
        const u = data.user ?? data.User ?? {};

        const rawId = u.id ?? u.Id;
        const rawUserName =
            u.username ?? u.userName ?? u.UserName; // normalize
        const rawFullName = u.fullName ?? u.FullName;
        const rawIsAdmin = u.isAdmin ?? u.IsAdmin;

        if (!token || rawId === undefined || !rawUserName) {
            // defensive: avoid saving incomplete session
            console.error('Malformed login response:', data);
            throw new Error('Malformed login response');
        }

        const normalizedUser: User = {
            id: String(rawId),
            userName: String(rawUserName),
            fullName: rawFullName ?? undefined,
            isAdmin: Boolean(rawIsAdmin),
        };

        setToken(token);
        setUser(normalizedUser);
        setIsLoggedIn(true);

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(normalizedUser));

        return normalizedUser;
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        setIsLoggedIn(false);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        router.push('/');
    };

    return (
        <AuthContext.Provider value={{ loading, isLoggedIn, user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used inside AuthProvider');
    return context;
};

//'use client';

//import React, { createContext, useState, useEffect, useContext } from 'react';
//import { useRouter } from 'next/navigation';
//import { User } from '../data/User';
//import { AuthContextType } from '../data/AuthContextType';

//const AuthContext = createContext<AuthContextType | undefined>(undefined);

//export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//    const [user, setUser] = useState<User | null>(null);
//    const [token, setToken] = useState<string | null>(null);
//    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
//    const [loading, setLoading] = useState(true);
//    const router = useRouter();

//    const API_URI = 'http://localhost:7163/';

//    useEffect(() => {
//        const storedToken = localStorage.getItem('token');
//        const storedUser = localStorage.getItem('user');

//        if (storedToken && storedUser) {
//            setToken(storedToken);
//            setUser(JSON.parse(storedUser));
//            setIsLoggedIn(true);
//        }

//        setLoading(false);
//    }, []);

//    const login = async (username: string, password: string): Promise<User> => {
//        const res = await fetch(API_URI + 'api/auth/login', {
//            method: 'POST',
//            headers: {
//                'Content-Type': 'application/json',
//            },
//            body: JSON.stringify({ username, password }),
//        });

//        if (!res.ok) throw new Error('Login failed');

//        const data = await res.json();

//        const token = data.token;
//        console.log('Auth Context:data.user:', data.user);
//        const user: User = {
//            id: data.user.id,
//            userName: data.user.userName,
//            fullName: data.user.fullName,
//            isAdmin: data.user.isAdmin
//        };

//        setToken(token);
//        setUser(user);
//        setIsLoggedIn(true);

//        localStorage.setItem('token', token);
//        localStorage.setItem('user', JSON.stringify(user));

//        return user;
//    };

//    const logout = () => {
//        setUser(null);
//        setToken(null);
//        setIsLoggedIn(false);
//        localStorage.removeItem('user');
//        localStorage.removeItem('token');

//        router.push('/');
//    };

//    return (
//        <AuthContext.Provider value={{ loading, isLoggedIn, user, token, login, logout }}>
//            {children}
//        </AuthContext.Provider>
//    );
//};

//export const useAuth = () => {
//    const context = useContext(AuthContext);
//    if (!context) throw new Error('useAuth must be used inside AuthProvider');
//    return context;
//};
