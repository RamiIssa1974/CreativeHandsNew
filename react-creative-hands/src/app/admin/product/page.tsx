import { Suspense } from 'react';
import ProductClient from './ProductClient';

export default function ProductPageWrapper() {
    return (
        <Suspense fallback={<div>تحميل البيانات...</div>}>
            <ProductClient />
        </Suspense>
    );
}
