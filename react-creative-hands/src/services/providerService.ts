import pyAxiosAuth from '@/utils/pyAxiosAuth';
import { ServerSiteProvider, SiteProvider } from '@/data/SiteProvider';

const BASE_URL = 'purchases';

export async function getProviderById(providerId: number): Promise<SiteProvider | null> {
    try {
        const response = await pyAxiosAuth.get(`${BASE_URL}/GetProviderById/${providerId}`);
        const rawProvider: ServerSiteProvider = response.data;
        return mapServerToClientProvider(rawProvider);
    } catch (error) {
        console.error("Get provider error:", error);
        return null;
    }
}

export async function saveProvider(request: SiteProvider): Promise<number | null> {
    try {
        const mappedRequest = mapClientToServerProvider(request);
        console.log("Sending request to server:", mappedRequest);

        const response = await pyAxiosAuth.post(`${BASE_URL}/SaveProvider`, mappedRequest);

        console.log("Got response status:", response.status);

        return response.data as number;
    } catch (error) {
        console.error("Save provider error", error);
        return null;
    }
}

export async function getProviders(): Promise<SiteProvider[]> {
    try {
        const response = await pyAxiosAuth.get(`${BASE_URL}/GetProviders`);
        const rawProviders: ServerSiteProvider[] = response.data;
        return rawProviders.map(mapServerToClientProvider);
    } catch (error) {
        console.error("Error fetching providers", error);
        return [];
    }
}

export async function deleteProvider(providerId: number): Promise<boolean> {
    try {
        const response = await pyAxiosAuth.delete(`${BASE_URL}/DeleteProvider/${providerId}`);
        return response.status === 200;
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
        description: sProvider.Description,
        webSite: sProvider.WebSite,
        email: sProvider.Email,
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
        Description: siteProvider.description,
        WebSite: siteProvider.webSite,
        Email: siteProvider.email,
        IsActive: siteProvider.isActive,
    };
}
