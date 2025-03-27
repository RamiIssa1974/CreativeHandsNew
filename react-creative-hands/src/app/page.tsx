'use client';

import React, { useEffect, useState } from 'react';
import { fetchCategories } from '@/services/productService';
import CategoryCard from '@/components/CategoryCard';
import './styles/HomePage.css'; // Import CSS file
import { Category } from '../data/Category';
 
export default function HomePage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        async function loadCategories() {
            try {
                const data = await fetchCategories();
                //console.log("categories: ", data)
                setCategories(data);
            } catch (err: any) {
                setError(err.message || 'Something went wrong');
            } finally {
                setLoading(false);
            }
        }

        loadCategories();
    }, []);
    
    if (loading) {
        return (
            <div className="page-loading-container">
                <div className="spinner"></div>
                <p>جاري تحميل الفئات...</p>
            </div>
        );
    }
    if (error) return <p className="page-title">{error}</p>;

    return (
        <main className="main-container">
            <h1 className="page-title">الفئات</h1>
            <div className="categories-grid">
                {categories.map((category,index) => (
                    <CategoryCard key={category.Id} id={category.Id} name={category.Name} index={index} />
                ))}
            </div>
        </main>
    );
}
