"use client";

import React from "react";
import "@/app/styles/OrderDetailsPage.css";
import { OrderItemModel } from "@/data/OrderItemModel";


type OrderItemsTableProps = {
    items: OrderItemModel[];
    dirtyItems: number[];
    onQuantityChange: (id: number, delta: number) => void;
    onPriceChange: (id: number, newPrice: number) => void;
    onDeleteItem: (id: number) => void;
    onSaveItem: (item: OrderItemModel) => void;
    imageSize: number;
};


export default function OrderItemsTable({
    items,
    dirtyItems,
    onQuantityChange,
    onPriceChange,
    onDeleteItem,
    onSaveItem,
    imageSize,

}: OrderItemsTableProps) {


    //console.log("OrderItemsTableProps.items:", items);

    return (        
            <div className="order-table" dir="rtl">
                <table>
                    <thead>
                        <tr>
                            <th>رقم</th>
                            <th>صورة</th>
                            <th>اسم المنتج</th>
                            <th>الكمية</th>
                            <th>السعر</th>
                            <th>المجموع</th>
                            <th>save</th>
                            <th>حذف</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>
                                    <img
                                        src={`http://creativehandsco.com/assets/Images/${item.imageFileName}`}
                                        alt={item.name}
                                        width={imageSize}
                                        height={imageSize}
                                        style={{ objectFit: "cover" }}
                                    />
                                </td>
                                <td>{item.productName}</td>
                                <td className="quantity-control">
                                    <button onClick={() => onQuantityChange(item.id, -1)}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => onQuantityChange(item.id, 1)}>+</button>
                                </td>
                                <td>
                                    <input
                                        className="price-input"
                                        type="number"
                                        value={item.price}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const parsed = value.trim() === '' ? 0 : parseFloat(value);
                                            onPriceChange(item.id, parsed);
                                        }}
                                    />
                                </td>
                                <td>{(item.quantity * item.price).toFixed(2)} ₪</td>
                                <td>
                                    <button onClick={() => onDeleteItem(item.id)}>❌</button>
                                </td>
                                <td>
                                    <button
                                        onClick={() => onSaveItem(item)}
                                        disabled={!dirtyItems.includes(item.id)}
                                        className={`save-row-btn ${dirtyItems.includes(item.id) ? "enabled" : "disabled"}`}
                                    >
                                        💾
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>        
    );
}
