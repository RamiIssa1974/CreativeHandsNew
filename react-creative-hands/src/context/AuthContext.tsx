'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import { User } from '../data/User';
import { AuthContextType } from '../data/AuthContextType';
import { useRouter } from 'next/navigation';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    
    const [user, setUser] = useState<User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    // Optional: Auto login if token exists (future JWT/localStorage logic)
    useEffect(() => {
        const storedUser = localStorage.getItem('user');

        if (storedUser) {
            const parsedUser: User = JSON.parse(storedUser);
            setUser(parsedUser);
            setIsLoggedIn(true);
        }

        setLoading(false);
    }, []); 


    const login = async (username: string, password: string): Promise<User> => {
        try {
            const res = await fetch('http://localhost:7163/api/users/user-info', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!res.ok) {
                throw new Error('Login failed');
            }

            const data = await res.json();

            const loggedInUser: User = {
                id: data.Id,
                username: data.UserName,
                fullName: data.FullName,
                isAdmin: data.IsAdmin,
            };

            setUser(loggedInUser);
            setIsLoggedIn(true);
            localStorage.setItem('user', JSON.stringify(loggedInUser));

            const cartToken = localStorage.getItem('cartToken');
            if (cartToken) {
                localStorage.removeItem('cartToken');
            }

            return loggedInUser; // ✅ Return it here
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = () => {
        if (user?.id) {
            localStorage.setItem('cartToken', user.id);
        }

        setUser(null);
        setIsLoggedIn(false);
        localStorage.removeItem('user');

        router.push('/'); // optional redirect
    };


    return (
        <AuthContext.Provider value={{ loading, isLoggedIn, user, login, logout }}>
    { children }
    </AuthContext.Provider>
  );
};

// Hook to use AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used inside AuthProvider');
    }
    return context;
};
