import { Suspense } from 'react';
import VideoListClient from './VideoListClient';

export default function ProviderPageWrapper() {
    return (
        <Suspense fallback={<div>تحميل البيانات...</div>}>
            <VideoListClient />
        </Suspense>
    );
}
