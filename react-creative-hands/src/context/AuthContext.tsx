'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import jwtDecode from 'jwt-decode';
import { useRouter } from 'next/navigation';
import { User } from '../data/User';
import { AuthContextType } from '../data/AuthContextType';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const API_URI = 'http://localhost:7163/';

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            setIsLoggedIn(true);
        }

        setLoading(false);
    }, []);

    const login = async (username: string, password: string): Promise<User> => {
        const res = await fetch(API_URI + 'api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!res.ok) throw new Error('Login failed');

        const data = await res.json();

        const token = data.token;
        const user: User = {
            id: data.user.Id,
            username: data.user.UserName,
            fullName: data.user.FullName,
            isAdmin: data.user.IsAdmin
        };

        setToken(token);
        setUser(user);
        setIsLoggedIn(true);

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        return user;
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
