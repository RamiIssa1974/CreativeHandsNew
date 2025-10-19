import pyAxiosAuth from '@/utils/pyAxiosAuth';
import { Category } from '@/data/Category';
import { Product } from '@/data/Product';
import { SaveProductRequest } from '../data/SaveProductRequest';
import { UploadFilesResponse } from '../data/UploadFilesResponse';
import { GetProductRequest } from '../data/Requests';
import { withMiddleware } from '../utils/withMiddleware';

export async function deleteProduct(productId: number): Promise<boolean> {
    try {
        await pyAxiosAuth.delete(`products/DeleteProduct/${productId}`);
        return true;
    } catch (error) {
        console.error("Delete product error:", error);
        return false;
    }
}

export async function saveProduct(request: SaveProductRequest): Promise<number | null> {
    try {
        const response = await pyAxiosAuth.post('products/Product', mapClientToServerSaveProductRequest(request));
        return response.data;
    } catch (error) {
        console.error("Save product error:", error);
        return null;
    }
}

export async function uploadProductImages(files: File[], productId: number): Promise<UploadFilesResponse | null> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('productId', productId.toString());

    try {
        const response = await pyAxiosAuth.post(`products/UploadFiles`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    } catch (error) {
        console.error("Upload error", error);
        return null;
    }
}

export async function getProducts(getProductRequest: GetProductRequest): Promise<Product[]> {
    return withMiddleware(async () => {

        try {
            const { data } = await pyAxiosAuth.post('products/GetProducts', getProductRequest);
            return data.map((p: any) => ({
                id: p.Id,
                name: p.Name,
                price: p.Price,
                salePrice: p.SalePrice,
                barcode: p.Barcode,
                description: p.Description,
                stockQuantity: p.StockQuantity,
                images: p.Images,
                imagesIds: p.ImagesIds,
                categories: p.Categories,
                categoriesIds: p.CategoriesIds,
                productVariations: p.ProductVariations,
                productVariationsIds: p.ProductVariationsIds,
                availableColours: p.AvailableColours,
                availableColoursIds: p.AvailableColoursIds,
            }));
        } catch (error) {
            console.error("Error fetching products", error);
            return [];
        }
    }, "Get Products");
}

export async function searchProducts(query: string): Promise<Product[]> {
    return await getProducts({
        Id: -1,
        Name: query,
        Description: '',
        Barcode: '',
        CategoryId: -1,
        SubCategoryId: -1
    });
}

export async function fetchProduct(productId: number): Promise<Product> {
    const products = await getProducts({
        Id: productId,
        Name: '',
        Description: '',
        Barcode: '',
        CategoryId: -1,
        SubCategoryId: -1
    });

    if (!products || products.length === 0) {
        throw new Error(`No product found with ID ${productId}`);
    }

    return products[0];
}

export async function updateProduct(request: SaveProductRequest): Promise<number | null> {
    return await saveProduct(request);
}

export async function fetchCategories(): Promise<Category[]> {
    try {
        const { data } = await pyAxiosAuth.get('products/Categories');
        return data.map((item: any) => ({
            Id: item.Id,
            Name: item.Name,
        }));
    } catch (error) {
        console.error("Failed to fetch categories", error);
        throw error;
    }
}

export async function fetchProductsByCategory(categoryId: number): Promise<Product[]> {
    return await getProducts({
        Id: 0,
        Name: '',
        Description: '',
        Barcode: '',
        CategoryId: categoryId,
        SubCategoryId: -1
    });
}

function mapClientToServerSaveProductRequest(request: SaveProductRequest): any {
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
