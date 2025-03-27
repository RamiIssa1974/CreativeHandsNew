import { ProductImage } from './ProductImage';
import { Category } from './Category';
import { ProductVariationModel } from './ProductVariationModel';
import { ProductColour } from './ProductColour';

export interface Product {
    id: number;
    name: string;
    price: number;
    salePrice: number | null;
    barcode: string;
    description: string;

    images: ProductImage[];
    imagesIds: number[];

    categories: Category[];
    categoriesIds: number[];

    productVariations: ProductVariationModel[];
    productVariationsIds: number[];

    availableColours: ProductColour[];
    availableColoursIds: number[];

    stockQuantity: number;
}
