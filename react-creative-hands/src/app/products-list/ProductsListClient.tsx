'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Product } from '@/data/Product';
import { fetchProductsByCategory } from '@/services/productService';
import './styles.css';
import ProductsList from '@/components/ProductsList';

export default function ProductsListClient() {    
    const searchParams = useSearchParams();
     
    const catParam = searchParams.get('categoryId');
    const categoryId = Number(catParam);
    const categoryNameFromQuery = searchParams.get('name') || 'المنتجات';

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        console.log('categoryId:', categoryId);

        if (!categoryId || isNaN(categoryId)) {
            setError('Invalid category id');
            setLoading(false);
            return;
        }
        
        const loadProducts = async () => {
            console.log("execute loadProducts")
            try {
                setLoading(true);
                const data = await fetchProductsByCategory(categoryId);
                setProducts(data);
                setError('');  // clear any previous errors
                console.log("Products Rami Issa:", data);
            } catch (err: any) {
                setError(err.message || 'Something went wrong');
                setProducts([]); // clear previous data if error
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, [categoryId]);
    if (loading) {
        return (
            <div className="page-loading-container">
                <div className="spinner"></div>
                <p>جارٍ تحميل المنتجات...</p>
            </div>
        );
    }
    return (
        <main className="products-list-container">
            <h1 className="category-title">{categoryNameFromQuery}</h1>

            {/* Loading Message */}
            {loading && (
                <p className="loading-text">جارٍ تحميل المنتجات...</p>
            )}

            {/* Error Message */}
            {!loading && error && (
                <p className="error-text">{error}</p>
            )}

            {/* Products Grid */}
            {!loading && !error && (
                <ProductsList products={products} />
            )}
        </main>
    );
}
