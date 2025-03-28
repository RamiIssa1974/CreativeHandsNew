import { Suspense } from 'react';
import ProductsListClient from './ProductsListClient';

export default function ProductsListPageWrapper() {
    return (
        <Suspense fallback={<p>جاري التحميل...</p>}>
            <ProductsListClient />
        </Suspense>
    );
}
