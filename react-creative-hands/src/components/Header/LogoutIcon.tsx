'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import './LogoutIcon.css'; // Optional CSS for styling
import { FiLogOut } from 'react-icons/fi';
const LogoutIcon: React.FC = () => {
    const { isLoggedIn, logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/'); // Redirect to home page after logout
    };

    if (!isLoggedIn) return null; //Don't show if not logged in

    return (
        <div className="logout-icon-container"  title="تسجيل الخروج">         
            <button onClick={handleLogout} className="logout-button" title="تسجيل الخروج">
                <FiLogOut size={24} />
            </button>
        </div>

    );
};

export default LogoutIcon;
