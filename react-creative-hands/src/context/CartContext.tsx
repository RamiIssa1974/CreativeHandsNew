'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

import { fetchCartFromAPI, addToCartAPI, sendOrderAPI } from '@/services/cartService'; // We'll build this soon!
import { CartItem } from '../data/CartItem';
import { CustomerDetails } from '../data/CustomerDetails';
import { useUserIdentifier } from '../utils/useUserIdentifier';

// Context type
interface CartContextType {
    cartItems: CartItem[];
    cartId: number | null;
    totalQuantity: number;
    addToCart: (item: CartItem) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, newQty: number) => void;
    sendOrder: (customerDetails: CustomerDetails) => void;
    clearCart: () => void;
    loadCart: () => void;
}

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider component
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [cartId, setCartId] = useState<number | null>(null);
    const [totalQuantity, setTotalQuantity] = useState<number>(0);

    const userId = useUserIdentifier();

    // Load cart on mount
    useEffect(() => {
        loadCart();
    }, []);

    // Function: Load cart from backend
    const loadCart = async () => {
        try {
            const cart = await fetchCartFromAPI(userId); // We'll build this API soon!
            setCartItems(cart.items);
            setCartId(cart.id);
            calculateTotal(cart.items);
        } catch (error) {
            console.error('Failed to load cart', error);
        }
    };

    // Function: Add to cart (frontend + backend)
    const addToCart = async (item: CartItem) => {
        try {
            const updatedCart = await addToCartAPI(item, cartId, userId); // Backend call
            setCartItems(updatedCart.items);
            setCartId(updatedCart.id);
            calculateTotal(updatedCart.items);
        } catch (error) {
            console.error('Failed to add to cart', error);
        }
    };

    // Function: Remove from cart
    const removeFromCart = (productId: number) => {
        const updatedItems = cartItems.filter(item => item.productId !== productId);
        setCartItems(updatedItems);
        calculateTotal(updatedItems);
        // TODO: Sync with backend if needed
    };

    // Function: Update quantity
    const updateQuantity = (productId: number, newQty: number) => {
        const updatedItems = cartItems.map(item =>
            item.productId === productId ? { ...item, quantity: newQty } : item
        );
        setCartItems(updatedItems);
        calculateTotal(updatedItems);
        // TODO: Sync with backend if needed
    };

    // Function: Send order (checkout)
    const sendOrder = async (customerDetails: CustomerDetails) => {
        if (!cartId) {
            console.error('Cart ID is missing. Cannot send order.');
            return;
        }
        try {
            await sendOrderAPI(cartId, customerDetails, userId);
            clearCart();
            console.log('Order sent!');
        } catch (error) {
            console.error('Failed to send order', error);
        }
    };

    // Function: Clear cart locally
    const clearCart = () => {
        setCartItems([]);
        setCartId(null);
        setTotalQuantity(0);
        // TODO: Clear on backend if needed
    };

    // Helper: Calculate total quantity
    const calculateTotal = (items: CartItem[]) => {
        const total = items.reduce((acc, item) => acc + item.quantity, 0);
        setTotalQuantity(total);
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                cartId,
                totalQuantity,
                addToCart,
                removeFromCart,
                updateQuantity,
                sendOrder,
                clearCart,
                loadCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

// Hook for accessing cart context
export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
