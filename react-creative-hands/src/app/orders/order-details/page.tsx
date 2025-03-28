import { Suspense } from 'react';
import OrderDetailsClient from './OrderDetailsClient';

export default function OrderDetailsWrapper() {
    return (
        <Suspense fallback={<div>تحميل البيانات...</div>}>
            <OrderDetailsClient />
        </Suspense>
    );
}
