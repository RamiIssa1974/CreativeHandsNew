"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import CustomerHeader from "@/components/order/CustomerHeader";
import OrderItemsTable from "@/components/order/OrderItemsTable";
import OrderFooter from "@/components/order/OrderFooter";
import '@/app/styles/OrderDetailsPage.css';
import { fetchOrders, saveOrder, saveItem, deleteItem } from "@/services/orderService";
import { OrderModel } from "@/data/OrdelModel";
import { GetOrderRequest } from "@/data/Requests";
import { OrderItemModel } from "@/data/OrderItemModel";
//import { getProducts } from "@/services/productService";
import FastNewProduct from "@/components/Order/FastNewProduct";
import OrderItemsTableMobile from "@/components/Order/OrderItemsTableMobile";
 
export default function OrderDetailsPage() {
    const params = useParams();

    const orderId = Number(params.orderId);
    const [order, setOrder] = useState<OrderModel | null>(null);
    const [imageSize, setImageSize] = useState(100);

    const [items, setItems] = useState<OrderItemModel[]>([]);
    const [dirtyItems, setDirtyItems] = useState<number[]>([]);
    const [deliveryCost, setDeliveryCost] = useState(20);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [discountPercent, setDiscountPercent] = useState(0);
    const [discountMode, setDiscountMode] = useState<"amount" | "percent">("amount");

    // Fetch order on mount
    useEffect(() => {
        async function loadOrder() {
            const request: GetOrderRequest = {
                orderId: orderId,
                customerId: 0,
                customerName: '',
                customerTel: '',
                statusId: 0
            };

            try {
                const orders = await fetchOrders(request);
                
                if (orders.length > 0) {
                    const selectedOrder = orders[0]; // Or however you pick the right one
                    console.log("selectedOrder: ", orders[0]);
                    setOrder(selectedOrder);
                    setItems(selectedOrder.orderItems)
                    setDeliveryCost(selectedOrder.deleveryPrice ?? 0);
                    setDiscountAmount(selectedOrder.discount ?? 0);
                } else {
                    console.error("No order found with this ID");
                }
            } catch (error) {
                console.error("Failed to load order", error);
            }
        }

        loadOrder();
    }, [orderId]);

    // Calculations at the page level
    const calculateTotalQuantity = () => {
        return items.reduce((total, item) => total + item.quantity, 0);
    };

    const calculateTotalPrice = () => {
        return items.reduce((total, item) => total + item.quantity * item.price, 0);
    };

    const subtotal = calculateTotalPrice();
    const totalQuantity = calculateTotalQuantity();

    const toggleDiscountMode = () => {
        if (discountMode === "amount") {
            const percent = subtotal > 0 ? (discountAmount / subtotal) * 100 : 0;
            setDiscountPercent(parseFloat(percent.toFixed(2)));
            setDiscountMode("percent");
        } else {
            const amount = (discountPercent / 100) * subtotal;
            setDiscountAmount(parseFloat(amount.toFixed(2)));
            setDiscountMode("amount");
        }
    };

    // Item Handlers       
    const calculateFinalTotal = () => {
        const discountValue =
            discountMode === "amount"
                ? discountAmount
                : (discountPercent / 100) * subtotal;

        return subtotal + deliveryCost - discountValue;
    };

    const finalTotal = calculateFinalTotal();

    const handleSaveOrder = async () => {
        if (!order) {
            alert("لا يوجد طلب لحفظه");
            return;
        }

        const updatedOrder = {
            ...order,
            deleveryPrice: deliveryCost,
            discount: discountAmount,
            orderItems: items,
        };

        const success = await saveOrder(updatedOrder);

        if (success) {
            alert("تم حفظ الطلب بنجاح ✅");
        } else {
            alert("فشل في حفظ الطلب ❌");
        }
    };

    const markItemAsDirty = (id: number) => {
        setDirtyItems((prev) => (prev.includes(id) ? prev : [...prev, id]));
    };
    const handleQuantityChange = (id: number, delta: number) => {
        setItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id
                    ? { ...item, quantity: Math.max(item.quantity + delta, 1) }
                    : item
            )
        );
        markItemAsDirty(id);
    };

    const handlePriceChange = (id: number, newPrice: number) => {
        //console.log("Rami Issa parsed:", newPrice)
        setItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id ? { ...item, price: newPrice } : item
            )
        );
        markItemAsDirty(id);
    };

    const handleDeleteItem = async (id: number) => {
        const confirmDelete = confirm("هل أنت متأكد أنك تريد حذف هذا المنتج؟");
        if (!confirmDelete) return;
        const success = await deleteItem(id);

        if (success) {
            // Remove from state if backend delete succeeded
            setItems((prevItems) => prevItems.filter((item) => item.id !== id));

            // Optional: remove from dirtyItems too
            setDirtyItems((prev) => prev.filter((dirtyId) => dirtyId !== id));

            alert("✅ تم حذف المنتج بنجاح");
        } else {
            alert("❌ فشل في حذف المنتج");
        }       
    };

    const handleSaveItem = async (item: OrderItemModel) => {
        const success = await saveItem(item); // Use your orderService method
        if (success) {
            setDirtyItems((prev) => prev.filter((id) => id !== item.id));
            alert(`تم حفظ العنصر ${item.productName} بنجاح ✅`);
        } else {
            alert(`فشل في حفظ العنصر ${item.productName} ❌`);
        }
    };
    
    if (!order) {
        return (
            <div className="page-loading-container">
                <div className="spinner"></div>
                <p>جاري تحميل الطلبات...</p>
            </div>
        );
    }
    return (
        <div className="order-details-container">
            <CustomerHeader
                customer={order.customer}
                imageSize={imageSize}
                setImageSize={setImageSize}
            />

            <div className="order-items-desktop">
                <OrderItemsTable
                    items={items}
                    dirtyItems={dirtyItems}
                    onQuantityChange={handleQuantityChange}
                    onPriceChange={handlePriceChange}
                    onDeleteItem={handleDeleteItem}
                    onSaveItem={handleSaveItem}
                    imageSize={imageSize}
                />
            </div>

            <div className="order-items-mobile">
                <OrderItemsTableMobile
                    items={items}
                    dirtyItems={dirtyItems}
                    onQuantityChange={handleQuantityChange}
                    onPriceChange={handlePriceChange}
                    onDeleteItem={handleDeleteItem}
                    onSaveItem={handleSaveItem}
                    imageSize={imageSize}
                />
            </div>


            <OrderFooter
                totalQuantity={totalQuantity}
                subtotal={subtotal}
                deliveryCost={deliveryCost}
                setDeliveryCost={setDeliveryCost}
                discountAmount={discountAmount}
                setDiscountAmount={setDiscountAmount}
                discountPercent={discountPercent}
                setDiscountPercent={setDiscountPercent}
                discountMode={discountMode}
                finalTotal={finalTotal}
                toggleDiscountMode={toggleDiscountMode}
                onSave={handleSaveOrder }
            />
            <FastNewProduct
                onAddProduct={(newItem) => {
                    setItems((prevItems) => {
                        const existingItemIndex = prevItems.findIndex((item) => item.id === newItem.id);
                        if (existingItemIndex !== -1) {
                            //Item exists ➜ update quantity and price
                            const updatedItems = [...prevItems];
                            updatedItems[existingItemIndex] = {
                                ...updatedItems[existingItemIndex],
                                quantity: newItem.quantity,
                                price: newItem.price,
                            };

                            console.log(`✅ Updated existing item ID: ${newItem.id}`);
                            return updatedItems;
                        } else {
                            // ✅ New item ➜ add it to the list
                            console.log(`✅ Added new item ID: ${newItem.id}`);
                            return [...prevItems, newItem];
                        }

                    });
                }}
                orderId={orderId }
            />
        </div>
    );
}
