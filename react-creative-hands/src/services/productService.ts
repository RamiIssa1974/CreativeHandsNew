import { Category } from '@/data/Category';
import { Product } from '@/data/Product';
import { SaveProductRequest } from '../data/SaveProductRequest';
import { UploadFilesResponse } from '../data/UploadFilesResponse';
import { GetProductRequest } from '../data/Requests';

//const API_BASE_URL = 'http://localhost:7163/api/products';
//const API_UPLOAD_BASE_URL = 'http://localhost:7163/Api';
const API_BASE_URL = 'http://194.36.89.39:7163/api/products';
const API_UPLOAD_BASE_URL = 'http://194.36.89.39:7163/';
export async function deleteProduct(productId: number): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE_URL}/DeleteProduct/${productId}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            console.error("Delete product failed with status:", response.status);
            return false;
        }

        console.log(`Item ${productId} deleted successfully`);
        return true;
    } catch (error) {
        console.error("Delete product error:", error);
        return false;
    }
}


export async function saveProduct(request: SaveProductRequest): Promise<number | null> {
    try {
        console.log("request:", request);
        const mappedRequest = mapClientToServerSaveProductRequest(request);
        console.log("mappedRequest:", mappedRequest);
        const response = await fetch(API_BASE_URL+'/Product', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(mappedRequest)
        });

        if (!response.ok) {
            console.error("Save product failed", await response.text());
            return null;
        }

        const productId = await response.json() as number;
        return productId;
    } catch (error) {
        console.error("Save product error", error);

        return null;
    }
}

export async function uploadProductImages(files: File[], productId: number): Promise<UploadFilesResponse | null> {
    const formData = new FormData();

    files.forEach((file) => {
        formData.append('files', file); // Add each file
    });

    formData.append('productId', productId.toString()); // Send productId = 0 to create new product

    try {
        const response = await fetch(API_UPLOAD_BASE_URL+'/UploadFiles', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            console.error("Upload failed", await response.text());
            return null;
        }

        const data = await response.json() as UploadFilesResponse;
        return data;
    } catch (error) {
        console.error("Upload error", error);
        return null;
    }
}

export async function getProducts(getProductRequest: GetProductRequest): Promise<Product[]> {
    try {
        if (!getProductRequest) {
             getProductRequest = {
                Id: -1,
                Name: '',
                Description: '',
                Barcode: '',
                CategoryId: -1,
                SubCategoryId: -1,
            };
        }
        console.log("getProductRequest:", getProductRequest);

        const response = await fetch(API_BASE_URL+"/GetProducts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(getProductRequest),
        });

        if (!response.ok) {
            console.error("Failed to fetch products");
            return [];
        }

        const rawProducts = await response.json();

        // Map PascalCase to camelCase
        const products: Product[] = rawProducts.map((p: any) => ({
            id: p.Id,
            name: p.Name,
            price: p.Price,
            salePrice: p.SalePrice,
            barcode: p.Barcode,
            description: p.Description,

            images: p.Images,
            imagesIds: p.ImagesIds,

            categories: p.Categories,
            categoriesIds: p.CategoriesIds,

            productVariations: p.ProductVariations,
            productVariationsIds: p.ProductVariationsIds,

            availableColours: p.AvailableColours,
            availableColoursIds: p.AvailableColoursIds,

            stockQuantity: p.StockQuantity
        }));
        //console.log("return products:", products)
        return products;
    } catch (error) {
        console.error("Error fetching products", error);
        return [];
    }
}

export async function searchProducts(query: string): Promise<Product[]> {
    const getProductRequest: GetProductRequest = {
        Id: -1,
        Name: query,
        Description: "",
        Barcode: "",
        CategoryId: -1,
        SubCategoryId: -1,
    };
    const result = await getProducts(getProductRequest)
    return result;
}

export async function fetchProduct(productId: number): Promise<Product> {
    const request: GetProductRequest = {
        Id: productId,
        Name: '',
        Description: '',
        Barcode: '',
        CategoryId: -1,
        SubCategoryId: -1,
    };

    try {
        const products = await getProducts(request);

        if (!products || products.length === 0) {
            throw new Error(`No product found with ID ${productId}`);
        }

        return products[0];
    } catch (error) {
        console.error('fetchProduct error:', error);
        throw error;
    }
}

export async function updateProduct(request: SaveProductRequest): Promise<number | null> {
    try {
        // Call the existing saveProduct which handles both add and update
        const updatedProductId = await saveProduct(request);

        if (!updatedProductId) {
            console.error('Product update failed: No ID returned');
            return null;
        }

        return updatedProductId;
    } catch (error) {
        console.error('updateProduct error:', error);
        return null;
    }
}


export async function fetchProductsByCategory(categoryId: number): Promise<Product[]> {
    const res = await fetch(API_BASE_URL+'/GetProducts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-store',
        body: JSON.stringify({
            CategoryId: categoryId,
            // Other fields are optional if you don't need them
            Id: 0,
            Name: '',
            Description: '',
            Barcode: '',
            SubCategoryId: 0,
        }),
    });

    if (!res.ok) {
        throw new Error('Failed to fetch products');
    }

    const data = await res.json();

    const normalized: Product[] = data.map((item: any) => ({
        id: item.Id,
        name: item.Name,
        price: item.Price,
        salePrice: item.SalePrice,
        barcode: item.Barcode,
        description: item.Description,
        stockQuantity: item.StockQuantity,
        images: item.Images || [],
        categories: item.Categories || [],
        productVariations: item.ProductVariations || [],
        availableColours: item.AvailableColours || [],
        imagesIds: item.ImagesIds || [],
        categoriesIds: item.CategoriesIds || [],
        productVariationsIds: item.ProductVariationsIds || [],
        availableColoursIds: item.AvailableColoursIds || [],
    }));

    return normalized;
}


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

    //console.log('Raw API data:', data); 

    // ✅ Normalize properly
    const normalized: Category[] = data.map((item: any) => ({
        Id: item.Id,   // Must match API response key
        Name: item.Name, // Must match API response key
    }));

    //console.log('Normalized data:', normalized); // Should show lowercase id/name

    return normalized;
}

export function mapClientToServerSaveProductRequest(request: SaveProductRequest): any {
    return {
        Id: request.id,
        Name: request.name,
        Description: request.description,
        Barcode: request.barcode,
        Price: request.price,
        SalePrice: request.salePrice,
        Images: request.images || [],
        UploadedImages: request.uploadedImages || [],
        Categories: request.categories,
        ProductVariations: request.productVariations,
        AvailableColours: request.availableColours,
        StockQuantity: request.stockQuantity
    };
}

