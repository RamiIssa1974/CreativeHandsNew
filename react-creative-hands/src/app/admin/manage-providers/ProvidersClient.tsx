'use client';

import '@/app/styles/ProviderPage.css'
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSearchParams, useRouter } from 'next/navigation';
import { getProviderById, saveProvider } from '@/services/providerService';
import { SiteProvider } from '@/data/SiteProvider';

// (Paste your full component code here without change)
const ProviderClient = () => {
    // ⬅️ your original code goes here
    // (Everything inside ProviderPage)
};

export default ProviderClient;
