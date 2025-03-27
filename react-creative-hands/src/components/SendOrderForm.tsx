import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { sendOrderAPI } from '@/services/cartService';
import   '@/app/styles/SendOrderForm.css'
const SendOrderForm = () => {
    const { cartId, clearCart } = useCart();
    const { user } = useAuth();

    const [customerName, setCustomerName] = useState('');
    const [customerTel, setCustomerTel] = useState('');
    const [address, setAddress] = useState('');
    const [notes, setNotes] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!cartId || !user?.id) {
            alert('الرجاء تسجيل الدخول أو إضافة منتجات إلى السلة');
            return;
        }

        const request = {
            OrderId: cartId,
            UserID: user.id.toString(), // or cartToken if anonymous
            CustomerName: customerName,
            CustomerTel: customerTel,
            Address: address,
            Notes: notes,
        };

        try {
            await sendOrderAPI(request);
            alert('تم إرسال الطلب بنجاح!');

            clearCart();
        } catch (error) {
            console.error('Send order failed', error);
            alert('فشل إرسال الطلب');
        }
    };

    return (
        <div className="send-order-container">
            <h2>ارسال طلبية</h2>
            <form onSubmit={handleSubmit} className="send-order-form">
                <div className="form-group">
                    <label>الاسم:</label>
                    <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>رقم الهاتف:</label>
                    <input
                        type="text"
                        value={customerTel}
                        onChange={(e) => setCustomerTel(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>العنوان:</label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>ملاحظات:</label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    ></textarea>
                </div>

                <p className="send-order-note">
                    بالضغط على زر إرسال سيتم حفظ طلبك في النظام، يمكنك إلغاء الطلب أو تعديله قبل التأكيد.
                </p>

                <p className="send-order-warning">
                    السعر لا يشمل خدمة التوصيل
                </p>

                <button type="submit" className="send-order-button">إرسال</button>
            </form>
        </div>
    );
};

export default SendOrderForm;
