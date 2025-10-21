'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import './LoginPage.css'; // optional CSS file for styling
import { useCart } from '../../context/CartContext';
import { useRouter } from 'next/navigation';
import { migrateCartToUser } from '../../services/cartService';


const LoginPage = () => {
    const { login } = useAuth();
    const { loadCart } = useCart();
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            console.log('Attempting login for user:', username);    
            const cartToken = localStorage.getItem('cartToken');
            console.log('Current cartToken:', cartToken);
            const loggedInUser = await login(username, password); // ✅ Get the returned user!
            console.log('Logged in user:', loggedInUser);
            if (cartToken != null && loggedInUser != null) {
                await migrateCartToUser(cartToken, loggedInUser.id); // ✅ Works now!
                console.log('Cart migrated for user:', loggedInUser.id);
            }

            await loadCart();
            console.log('Cart loaded after login.');


            alert('تم تسجيل الدخول بنجاح!');
            router.push('/');
        } catch (err) {
            console.log('handleLogin error: ', err);
            alert('فشل تسجيل الدخول، يرجى المحاولة مرة أخرى.');
        }
    };

    return (
        <div className="login-container">
            <h1>تسجيل الدخول</h1>

            <form onSubmit={handleLogin} className="login-form">
                <label>
                    اسم المستخدم:
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </label>

                <label>
                    كلمة المرور:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>

                <button type="submit" className="login-button">
                    تسجيل الدخول
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
