import { CartItem } from '@/data/CartItem';
import { AddToCartRequest } from '@/data/Requests';
import { SendOrderRequest } from '@/data/Requests';
import { OrderItemResponse } from '@/data/Responses';
import { CustomerDetails } from '@/data/CustomerDetails';

const BASE_URL = 'http://localhost:7163/api/orders';

// Example of fetching userId/guestToken (optional logic)

export const migrateCartToUser = async (cartToken: string, userId: string | number) => {
    const payload = {
        CartToken: cartToken,
        UserId: userId.toString(),
    };

    console.log('Sending migrateCartToUser payload:', payload);

    const res = await fetch('http://localhost:7163/api/orders/migrate-cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    const text = await res.text();
    if (res.status === 404) {
        console.warn('No cart found to migrate. This is normal if no anonymous cart exists.');
        return null;  // Or any value you want to represent "no cart"
    }
    if (!res.ok) {
        console.error('migrateCartToUser error:', text);
        throw new Error(`Failed to migrate cart: ${res.status}`);
    }

    console.log('migrateCartToUser success:', text);

    return JSON.parse(text);
};



/**
 * GET: Fetch cart from backend
 */
export const fetchCartFromAPI = async (userId: string) => {
    console.log('Loading cart for userId:', userId);
    const res = await fetch(`${BASE_URL}/cart?userId=${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    //console.log('GetCart response:', res);

    if (!res.ok) {
        throw new Error('Failed to fetch cart');
    }

    const data = await res.json();
    //console.log('GetCart response data:', data);
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
        })),
    };
};


/**
 * POST: Add item to cart
 */
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

    // Send item to backend ➔ add to cart
    const res = await fetch(`${BASE_URL}/add-to-cart`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        throw new Error('Failed to add item to cart');
    }

    // Instead of parsing "data", fetch the full cart now!
    const updatedCart = await fetchCartFromAPI(userId);

    return updatedCart; // Return the full cart object!
};

/**
 * POST: Send order (checkout)
 */
export const sendOrderAPI = async (request: SendOrderRequest) => {
    const res = await fetch(`${BASE_URL}/SendOrder`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    if (!res.ok) {
        const errorBody = await res.text();
        console.error('Send order failed: ', errorBody);
        throw new Error('Failed to send order');
    }

    return res.json();
};
