"use client";

import React from "react";
import "@/app/styles/OrderDetailsPage.css";
import { CustomerDetails } from "@/data/CustomerDetails";
type CustomerHeaderProps = {
    customer: CustomerDetails
    imageSize: number;
    setImageSize: (size: number) => void;
};

export default function CustomerHeader({ customer, imageSize, setImageSize }: CustomerHeaderProps) {
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setImageSize(e.target.checked ? 30 : 100);
    };
     
    return (
        <div className="customer-header">
            <h2>Customer Details</h2>
            <div className="customer-info">
                <div>
                    <strong>Name:</strong> {customer.name}
                </div>
                <div>
                    <strong>Phone:</strong> {customer.phone}
                </div>
                <div>
                    <strong>Address:</strong> {customer.address}
                </div>
                <div>
                    <strong>Order Date:</strong> {customer.orderDate}
                </div>
            </div>
            <div className="image-toggle">
                <label>
                    <input
                        type="checkbox"
                        checked={imageSize === 30}
                        onChange={handleCheckboxChange}
                    />
                    عرض صور صغيرة
                </label>
            </div>
        </div>        
    );
}
