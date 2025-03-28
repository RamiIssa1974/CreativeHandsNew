import { Suspense } from 'react';
import ProviderClient from './ProviderClient';

export default function ProviderPageWrapper() {
    return (
        <Suspense fallback={<div>تحميل البيانات...</div>}>
            <ProviderClient />
        </Suspense>
    );
}
