'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import './CartIcon.css'; // We'll create this file next!

const CartIcon: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
    const { totalQuantity } = useCart();

    return (
        <div className="cart-icon-container" onClick={onClick}>
            <div className="cart-icon">
                🛒
                {totalQuantity > 0 && (
                    <span className="cart-badge">{totalQuantity}</span>
                )}
            </div>
        </div>
    );
};

export default CartIcon;
