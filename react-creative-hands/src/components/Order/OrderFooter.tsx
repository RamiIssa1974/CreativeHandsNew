"use client";

import React from "react";
import "@/app/styles/OrderDetailsPage.css";

type OrderFooterProps = {
    totalQuantity: number;
    subtotal: number;
    deliveryCost: number;
    setDeliveryCost: (val: number) => void;
    discountAmount: number;
    setDiscountAmount: (val: number) => void;
    discountPercent: number;
    setDiscountPercent: (val: number) => void;
    discountMode: "amount" | "percent";
    finalTotal: number;
    toggleDiscountMode: () => void;
    onSave: () => void;
};

export default function OrderFooter({
    totalQuantity,
    subtotal,
    deliveryCost,
    setDeliveryCost,
    discountAmount,
    setDiscountAmount,
    discountPercent,
    setDiscountPercent,
    discountMode,
    finalTotal,
    toggleDiscountMode,
    onSave,
    
}: OrderFooterProps) {
    //const finalTotal = subtotal + deliveryCost - (discountMode === "amount" ? discountAmount : (discountPercent / 100) * subtotal);

    return (
        <div className="order-footer">
            <div className="footer-item">
                <strong className='footer-item-label'>إجمالي الكمية:</strong> {totalQuantity}
            </div>

            <div className="footer-item">
                <strong className='footer-item-label'>المجموع الفرعي:</strong> {subtotal.toFixed(2)} ₪
            </div>

            <div className="footer-item">
                <strong className='footer-item-label'>تكلفة التوصيل:</strong>
                <input
                    type="number"
                    value={deliveryCost}
                    onChange={(e) => {
                        const value = e.target.value;
                        setDeliveryCost(value === "" ? 0 : parseFloat(value));
                    }}
                    className="footer-input"
                /> ₪
            </div>

            <div className="footer-item">
                <strong className='footer-item-label'>الخصم:</strong>
                {discountMode === "amount" ? (
                    <>
                        <input
                            type="number"
                            value={discountAmount}
                            onChange={(e) => setDiscountAmount(parseFloat(e.target.value))}
                            className="footer-input"
                        /> ₪
                    </>
                ) : (
                    <>
                        <input
                            type="number"
                            value={discountPercent}
                            onChange={(e) => setDiscountPercent(parseFloat(e.target.value))}
                            className="footer-input"
                        /> %
                    </>
                )}
                <button onClick={toggleDiscountMode} className="toggle-btn">
                    {discountMode === "amount" ? ">>" : "<<"}
                </button>
            </div>

            <div className="footer-item">
                <strong className='footer-item-label'>الإجمالي النهائي:</strong> {finalTotal.toFixed(2)} ₪
            </div>
            <div className="footer-actions">
                <button onClick={onSave} className="save-button">
                    💾 حفظ الطلب
                </button>
            </div>
        </div>
    );
}
