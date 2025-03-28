import { Suspense } from 'react';
import SearchClient from './SearchClient';

export default function SearchPage() {
    return (
        <Suspense fallback={<p>🔍 جاري التحميل...</p>}>
            <SearchClient />
        </Suspense>
    );
}
