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
import { Home, ShoppingCart, Video, Info, LogIn, LayoutDashboard, Package, Plus, Truck, UserPlus, Film } from 'lucide-react';

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
    
    const menuItems = [
        { name: 'الرئيسية', href: '/', icon: <Home size={18} /> },
        {
            name: 'الفئات',
            submenu: categories.map((category) => ({
                id: category.Id,
                name: category.Name,
                href: `/products-list?categoryId=${category.Id}&name=${encodeURIComponent(category.Name)}`,
            })),
            icon: <Package size={18} />,
        },
        { name: 'حول', href: '/about', icon: <Info size={18} /> },
        { name: 'سلة المشتريات', href: '/Cart', icon: <ShoppingCart size={18} /> },
        { name: 'فيديوهات', href: '/videos-list', icon: <Video size={18} /> },
        ...(isLoggedIn && user?.isAdmin
            ? [
                {
                    name: 'الإدارة',
                    icon: <LayoutDashboard size={18} />,
                    submenu: [
                        { id: 1000, name: 'إدارة الطلبات', href: '/admin/manage-orders', icon: <Package size={16} /> },
                        { id: 1001, name: 'إدارة المنتجات', href: '/admin/manage-products', icon: <Package size={16} /> },
                        { id: 1002, name: 'إضافة منتج', href: '/admin/product?productId=0', icon: <Plus size={16} /> },
                        { id: 1003, name: 'إدارة المزودين', href: '/admin/manage-providers', icon: <Truck size={16} /> },
                        { id: 1004, name: 'إضافة مزود', href: '/admin/provider?providerId=0', icon: <UserPlus size={16} /> },
                        { id: 1005, name: 'اضافة فيديو', href: '/admin/video?videoId=0', icon: <Film size={16} /> },
                    ],
                },
            ]
            : []),
        ...(!isLoggedIn
            ? [{ name: 'تسجيل الدخول', href: '/login', icon: <LogIn size={18} /> }]
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
            <Link href="/">
                <div className="banner-image mobile-banner"></div>
            </Link>
            


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
