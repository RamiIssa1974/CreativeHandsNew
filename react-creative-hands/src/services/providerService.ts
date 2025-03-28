import { ServerSiteProvider, SiteProvider } from '@/data/SiteProvider';

//const PROVIDERS_API_BASE_URL = 'http://localhost:7163/api/purchases';
const PROVIDERS_API_BASE_URL = 'http://194.36.89.39:7163/api/purchases';

export async function getProviderById(providerId: number): Promise<SiteProvider | null> {
    try {
        const response = await fetch(`${PROVIDERS_API_BASE_URL}/GetProviderById/${providerId}`, {
            method: "GET",
        });

        if (!response.ok) {
            console.error(`Get provider failed for ID: ${providerId}, Status:`, response.status);
            return null;
        }

        const rawProvider: ServerSiteProvider = await response.json();
        const siteProvider = mapServerToClientProvider(rawProvider);

        return siteProvider;
    } catch (error) {
        console.error("Get provider error:", error);
        return null;
    }
}

export async function saveProvider(request: SiteProvider): Promise<number | null> {
    try {
        const mappedRequest = mapClientToServerProvider(request);
        console.log("📤 Sending request to server:", mappedRequest);

        const response = await fetch(`${PROVIDERS_API_BASE_URL}/SaveProvider`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mappedRequest)
        });

        console.log("📥 Got response status:", response.status);

        if (!response.ok) {
            const errText = await response.text();
            console.error("❌ Save provider failed", errText);
            return null;
        }

        const providerId = await response.json();
        console.log("✅ Response JSON (ID):", providerId);
        return providerId;
    } catch (error) {
        console.error("❌ Save provider error", error);
        return null;
    }
}

export async function getProviders(): Promise<SiteProvider[]> {
    try {
        const response = await fetch(`${PROVIDERS_API_BASE_URL}/GetProviders`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            console.error("Failed to fetch providers");
            return [];
        }

        const rawProviders: ServerSiteProvider[] = await response.json();
        const mappedProviders = rawProviders.map(mapServerToClientProvider);

        return mappedProviders;
    } catch (error) {
        console.error("Error fetching providers", error);
        return [];
    }
}
export async function deleteProvider(providerId: number): Promise<boolean> {
    try {
        const response = await fetch(`${PROVIDERS_API_BASE_URL}/DeleteProvider/${providerId}`, {
            method: 'DELETE',
        });

        return response.ok;
    } catch (error) {
        console.error("Delete provider error:", error);
        return false;
    }
}

export function mapServerToClientProvider(sProvider: ServerSiteProvider): SiteProvider {
    return {
        id: sProvider.Id,
        name: sProvider.Name,
        idN: sProvider.IdN,
        tel1: sProvider.Tel1,
        tel2: sProvider.Tel2,
        address: sProvider.Address,
        description: sProvider.Description, // or Description
        webSite: sProvider.WebSite,
        email: sProvider.Email, // or Email
        isActive: sProvider.IsActive,
    };
}

export function mapClientToServerProvider(siteProvider: SiteProvider): ServerSiteProvider {
    return {
        Id: siteProvider.id,
        Name: siteProvider.name,
        IdN: siteProvider.idN,
        Tel1: siteProvider.tel1,
        Tel2: siteProvider.tel2,
        Address: siteProvider.address,
        Description: siteProvider.description, // or Description
        WebSite: siteProvider.webSite,
        Email: siteProvider.email, // or Email
        IsActive: siteProvider.isActive,
    };
}
 