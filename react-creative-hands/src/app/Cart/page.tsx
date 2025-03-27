'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import './CartPage.css'; // We'll make this next!
import SendOrderForm from '../../components/SendOrderForm';

const CartPage = () => {
    const { cartItems, totalQuantity, updateQuantity, removeFromCart, sendOrder } = useCart();

    const handleCheckout = () => {
        // Placeholder, we'll create a form or navigate to customer info page
        alert('فتح نموذج بيانات العميل!');
    };

    //console.log("cartItems: ", cartItems)
    //console.log("cartItems[2].selectedVariation: ", cartItems[2].selectedVariation)
    const totalPrice = cartItems.reduce((acc, item) => {
        const itemPrice = item.selectedVariation?.Price ?? item.price;
        //const itemPrice = item.salePrice && item.salePrice > 0 ? item.salePrice : item.price;
        return acc + itemPrice * item.quantity;
    }, 0);

    return (
        <div className="cart-page-container">
            <h1 className="cart-title">سلة المشتريات</h1>

            {cartItems.length === 0 ? (
                <p className="empty-cart">السلة فارغة</p>
            ) : (
                <>
                    <div className="cart-items">
                        {cartItems.map((item) => (
                            <div
                                key={`${item.productId}${item.selectedVariationId !== null && item.selectedVariationId !== undefined ? `-${item.selectedVariationId}` : ''}`}
                                className="cart-item"
                            >

                                {/* Product Image */}
                                <div className="cart-item-image">
                                    <img
                                        src={`http://creativehandsco.com/assets/Images/${item.productId}.jpg`}
                                        alt={item.productName}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src =
                                                'http://creativehandsco.com/assets/Images/DefaultImage.jpg';
                                        }}
                                    />
                                </div>

                                {/* Product Details */}
                                <div className="cart-item-info">
                                    <h3>{item.productName}</h3>
                                    {item.selectedVariation ? (
                                        <>
                                            <p>الوصف: {item.selectedVariation.Description}</p>
                                            <p>السعر: {item.selectedVariation.Price} ₪</p>
                                        </>
                                    ) : (
                                        <p>السعر: {item.price} ₪</p>
                                    )}
                                    {item.color && <p>اللون: <span className="color-preview" style={{ backgroundColor: item.color }} /></p>}

                                    {/* Quantity Controls */}
                                    <div className="quantity-controls">
                                        <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
                                        <input type="text" readOnly value={item.quantity} />
                                        <button onClick={() => updateQuantity(item.productId, item.quantity - 1)}>−</button>
                                    </div>

                                    {/* Remove Button */}
                                    <button className="remove-btn" onClick={() => removeFromCart(item.productId)}>حذف</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary & Checkout */}
                    <div className="cart-summary">
                        <p>عدد المنتجات: {totalQuantity}</p>
                        <p>السعر الإجمالي: {totalPrice} ₪</p>
                    </div>
                    <SendOrderForm />
                </>
            )}
        </div>
    );
};

export default CartPage;
