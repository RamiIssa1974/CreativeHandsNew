import "@/app/styles/OrderItemsTableMobile.css";
import React from "react";
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
export default function OrderItemsTableMobile({
    items,
    dirtyItems,
    onQuantityChange,
    onPriceChange,
    onDeleteItem,
    onSaveItem,
    imageSize,
}: OrderItemsTableProps) {
    if (!items || items.length === 0) {
        return <p>لا توجد منتجات</p>;
    }

    return (
        <div className="order-table-mobile">
            {items.map((item) => {
                const isDirty = dirtyItems.includes(item.id);

                return (
                    <div className="order-item-card" key={item.id}>
                        <div className="item-header">
                            <strong>{item.productName}</strong>

                            <div className="actions">
                                {/* Delete Button */}
                                <button
                                    onClick={() => onDeleteItem(item.id)}
                                    className="delete-btn"
                                    title="حذف المنتج"
                                >
                                    ❌
                                </button>

                                {/* Save Button (disabled if not dirty) */}
                                <button
                                    onClick={() => onSaveItem(item.id)}
                                    disabled={!isDirty}
                                    className={`save-btn ${!isDirty ? "disabled" : ""}`}
                                    title="حفظ التعديلات"
                                >
                                    💾
                                </button>
                            </div>
                        </div>

                        <div className="item-content">
                            <img
                                src={`http://creativehandsco.com/assets/Images/${item.imageFileName}`}
                                alt={item.productName}
                                width={imageSize}
                                height={imageSize}
                            />

                            <div className="item-details">
                                <div className="field">
                                    <label>الكمية:</label>
                                    <div className="quantity-controls">
                                        <button onClick={() => onQuantityChange(item.id, -1)}>
                                            -
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => onQuantityChange(item.id, 1)}>
                                            +
                                        </button>
                                    </div>
                                </div>

                                <div className="field">
                                    <label>السعر:</label>
                                    <input
                                        type="number"
                                        value={item.price}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const parsed = value === "" ? 0 : parseFloat(value);
                                            onPriceChange(item.id, parsed);
                                        }}
                                    />
                                </div>

                                <div className="field">
                                    <label>الإجمالي:</label>
                                    <span>{(item.quantity * item.price).toFixed(2)} ₪</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}




