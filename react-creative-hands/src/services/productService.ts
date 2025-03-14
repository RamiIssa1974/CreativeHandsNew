import { Category } from '@/data/Category';

const API_BASE_URL = 'http://localhost:7163/api/products';
 

export async function fetchCategories(): Promise<Category[]> {
    const res = await fetch(`${API_BASE_URL}/Categories`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch categories');
    }

    const data = await res.json();

    console.log('Raw API data:', data); // 🔍 Debugging this

    // ✅ Normalize properly
    const normalized: Category[] = data.map((item: any) => ({
        Id: item.Id,   // Must match API response key
        Name: item.Name, // Must match API response key
    }));

    console.log('Normalized data:', normalized); // Should show lowercase id/name

    return normalized;
}
