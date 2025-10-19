import axiosAuth from '@/utils/axiosAuth';
import { CartItem } from '@/data/CartItem';
import { AddToCartRequest, SendOrderRequest } from '@/data/Requests';
import { OrderItemResponse } from '@/data/Responses';

const BASE_URL = 'orders'; // Axios base is already set to /api/

export const migrateCartToUser = async (cartToken: string, userId: string | number) => {
    const payload = {
        CartToken: cartToken,
        UserId: userId.toString(),
    };

    try {
        const res = await axiosAuth.post(`${BASE_URL}/migrate-cart`, payload);
        return res.data;
    } catch (err: any) {
        if (err.response?.status === 404) {
            console.warn('No cart found to migrate.');
            return null;
        }

        console.error('migrateCartToUser error:', err);
        throw new Error(`Failed to migrate cart: ${err.response?.status}`);
    }
};

export const fetchCartFromAPI = async (userId: string) => {
    try {
        const res = await axiosAuth.get(`${BASE_URL}/cart`, {
            params: { userId }
        });

        const data = res.data;
        return {
            id: data.Id,
            items: data.OrderItems.map((item: OrderItemResponse) => ({
                productId: item.Product.Id,
                productName: item.Product.Name,
                quantity: item.Quantity,
                price: item.UnitPrice,
                selectedVariationId: item.ProductVariation?.Id || null,
                selectedVariation: item.ProductVariation,
                color: item.Colours?.[0] || '',
            }))
        };
    } catch (error) {
        console.error('Failed to fetch cart:', error);
        throw error;
    }
};

export const addToCartAPI = async (cartItem: CartItem, cartId: number | null, userId: string) => {
    const payload: AddToCartRequest = {
        UserId: userId,
        ProductId: cartItem.productId,
        ProductVariationId: cartItem.selectedVariationId,
        Quantity: cartItem.quantity,
        ProductPrice: cartItem.price,
        ProductSalePrice: cartItem.salePrice ?? 0,
        ProductUnitPrice: cartItem.salePrice ?? cartItem.price,
        OrderId: cartId ?? 0,
        Note: cartItem.note || '',
        OrderItemColours: cartItem.color ? [cartItem.color] : [],
    };
    logCartAction("Add Item", payload);

    try {
        await axiosAuth.post(`${BASE_URL}/add-to-cart`, payload);
        const updatedCart = await fetchCartFromAPI(userId);
        return updatedCart;
    } catch (error) {
        console.error('Failed to add to cart:', error);
        throw error;
    }
};

export const sendOrderAPI = async (request: SendOrderRequest) => {
    try {
        const res = await axiosAuth.post(`${BASE_URL}/SendOrder`, request);
        return res.data;
    } catch (err) {
        const errorBody = err.response?.data ?? 'Unknown error';
        console.error('Send order failed:', errorBody);
        throw new Error('Failed to send order');
    }
};


function logCartAction(action: string, details: any) {
    if (process.env.NODE_ENV === "development") {
        console.log(`[Cart] ${action}`, details);
    }
}
