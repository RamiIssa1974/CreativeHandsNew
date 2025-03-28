'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Product } from '@/data/Product';
import ProductsList from '@/components/ProductsList';
import { searchProducts } from '@/services/productService';

export default function SearchClient() {
    const searchParams = useSearchParams();
    const query = searchParams.get('query') || '';

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!query) return;

            try {
                setLoading(true);
                const results = await searchProducts(query);
                setProducts(results);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [query]);

    if (!query) return <p>أدخل كلمة للبحث</p>;

    return (
        <main>
            <h1>نتائج البحث عن: {query}</h1>
            {loading ? <p>جاري التحميل...</p> : <ProductsList products={products} />}
        </main>
    );
}
