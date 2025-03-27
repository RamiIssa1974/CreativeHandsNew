"use client";

import React, { useEffect, useState } from "react";
import { Product } from "@/data/Product"; // Assuming you have this
import { OrderItemModel } from "@/data/OrderItemModel"; // Your client model
import { getProducts } from "@/services/productService"; // You already plan this fetcher
import { saveItem } from "../../services/orderService";
import "@/app/styles/FastNewProduct.css";
 

type FastNewProductProps = {
    onAddProduct: (item: OrderItemModel) => void;
    orderId: number;
};

export default function FastNewProduct({ onAddProduct, orderId }: FastNewProductProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [newQuantity, setNewQuantity] = useState(1);
    const [newPrice, setNewPrice] = useState(0);

    // Load products on mount
    useEffect(() => {
        const loadProducts = async () => {
            const fetched = await getProducts();

            //console.log("fetched products", fetched);
            setProducts(fetched);
            setFilteredProducts(fetched);
        };

        loadProducts();
    }, []);

    // Filter products as user types
    useEffect(() => {
        const filtered = products.filter((p) =>
            (p.name?.toLowerCase() ?? "").includes(searchQuery.toLowerCase())
        );
        //console.log("filtered:", filtered)
        setFilteredProducts(filtered);
    }, [searchQuery, products]);

    const handleProductSelect = (product: Product) => {
        setSelectedProduct(product);
        setSearchQuery(product.name);
        setNewPrice(product.price); // Adjust based on your Product Model structure
    };

    const handleAddProduct = async () => {
        if (!selectedProduct) return;

        const newItemRequest: OrderItemModel = {
            id: 0,
            orderId: orderId,
            price: newPrice,
            quantity: newQuantity,
            productId: selectedProduct.id,
            note: "",
            productName: selectedProduct.name,
            imageFileName: selectedProduct.images[0]?.id + "." + selectedProduct.images[0]?.extension
        };
        console.log("newItemRequest: ", newItemRequest);

        const orderItemId = await saveItem(newItemRequest);

        if (orderItemId) {
            const newItem: OrderItemModel = {
                id: orderItemId, 
                orderId: orderId,
                productId: selectedProduct.id,
                productName: selectedProduct.name,
                quantity: newQuantity,
                price: newPrice,
                note: "",
                imageFileName: selectedProduct.images[0]?.id + '.' + selectedProduct.images[0]?.extension
            };

            onAddProduct(newItem);

            // Reset fields
            setSelectedProduct(null);
            setSearchQuery("");
            setNewQuantity(1);
            setNewPrice(0);
        } else {
            alert("فشل في حفظ المنتج ❌");
        }
    };

    const isAddDisabled = !selectedProduct || newQuantity <= 0 || newPrice <= 0;

    return (
        <div className="fast-new-product">
            <div className="search-section">
                <input
                    type="text"
                    placeholder="🔎 ابحث عن منتج..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery.length > 0 && filteredProducts.length > 0 && (
                    <ul className="product-list">
                        {filteredProducts.map((product) => (
                            <li
                                key={product.id}
                                onClick={() => handleProductSelect(product)}
                                className={selectedProduct?.id === product.id ? "selected" : ""}
                            >
                                {product.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="quantity-control">
                <button onClick={() => setNewQuantity(Math.max(1, newQuantity - 1))}>
                    -
                </button>
                <span>{newQuantity}</span>
                <button onClick={() => setNewQuantity(newQuantity + 1)}>+</button>
            </div>

            <div className="price-input">
                <input
                    type="number"
                    value={isNaN(newPrice) ? "" : newPrice}
                    onChange={(e) => {
                        const val = e.target.value;
                        const parsed = val === "" ? 0 : parseFloat(val);
                        setNewPrice(parsed);
                    }}
                />
            </div>

            <button
                disabled={isAddDisabled}
                onClick={handleAddProduct}
                className={`add-product-btn ${isAddDisabled ? "disabled" : ""}`}
            >
                ➕ أضف المنتج
            </button>
        </div>
    );
}
