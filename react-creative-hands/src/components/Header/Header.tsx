'use client';
import CartIcon from './CartIcon';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Menu from '../Menu/Menu';
import SearchBar from '../SearchBar/SearchBar'; // Assuming we already made this
import { fetchCategories } from '@/services/productService';
import { Category } from '@/data/Category';
import './Header.css';
import { useAuth } from '../../context/AuthContext';
import LogoutIcon from './LogoutIcon';
import { MenuItem } from '../../data/MenuItem';

const Header: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    //const [showCart, setShowCart] = useState(false);
    const { isLoggedIn, user } = useAuth();


    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await fetchCategories();
                setCategories(data);
            } catch (error) {
                console.error('Failed to load categories', error);
            }
        };

        loadCategories();
    }, []);

    const menuItems: MenuItem[] = [
        { name: 'الرئيسية', href: '/' },
        {
            name: 'الفئات',
            submenu: categories.map((category) => ({
                id: category.Id,
                name: category.Name,
                href: `/products-list/${category.Id}?name=${encodeURIComponent(category.Name)}`,
            })),
        },
        { name: 'حول', href: '/about' },
        { name: 'سلة المشتريات', href: '/Cart' },
        { name: 'فيديوهات', href: '/videos-list' },
        ...(isLoggedIn && user?.isAdmin
            ? [
                {
                    name: 'الإدارة',
                    submenu: [
                        { id: 1000, name: 'إدارة الطلبات', href: '/admin/manage-orders' },
                        { id: 1001, name: 'إدارة المنتجات', href: '/admin/manage-products' },
                        { id: 1002, name: 'إضافة منتج', href: '/admin/product/0' },
                        { id: 1003, name: 'إدارة المزودين', href: '/admin/manage-providers' },
                        { id: 1004, name: 'إضافة مزود', href: '/admin/provider/0' },
                        { id: 1005, name: 'اضافة فيديو', href: '/admin/video/0' },
                        // Add more admin links here later
                    ],
                },
            ]
            : []),
        ...(!isLoggedIn
            ? [{ name: 'تسجيل الدخول', href: '/login' }]
            : []),
    ];



    return (
        <header className="header">
            {/*<div className="banner-container">*/}
            {/*    <Link href="/">*/}
            {/*        <div className="banner-image desktop-banner"></div>*/}
            {/*        <div className="banner-image mobile-banner"></div>*/}
            {/*    </Link>*/}
            {/*</div>*/}
            <div className="banner-container">
                <div className="banner-content">
                    <div className="block-text">
                        {"CREATIVE".split("").map((letter, idx) => (
                            <span key={idx} className="letter-block">{letter}</span>
                        ))}
                    </div>

                    <div className="sun-icon">🌞</div>

                    <div className="block-text">
                        {"HANDS".split("").map((letter, idx) => (
                            <span key={idx} className="letter-block">{letter}</span>
                        ))}
                    </div>
                </div>
            </div>
            <div className="banner-image mobile-banner"></div>

            <div className="header-bar">
                <div className="menu-container">
                    <Menu items={menuItems} />
                </div>

                <div className="right-container">
                    <LogoutIcon />
                    <div className="search-container">
                        <SearchBar />
                    </div>
                    <Link href="/Cart">
                        <CartIcon />
                    </Link>


                </div>
            </div>
        </header>
    );
};

export default Header;
