import { OrderItemModel } from "../data/OrderItemModel";

export const mapClientItemToServer = (item: OrderItemModel) => {
    return {
        Id: item.id,
        OrderId: item.orderId, // Provide the actual OrderId!
        UnitPrice: item.price,
        Quantity: item.quantity,
        Note: item.note, // Optional
        ProductVariation: null, // Optional
        ProductId:   item.productId,           
        Colours: null, // Optional
    };
};


export const getOrderTotalPrice = (orderItems: OrderItemModel[]): number => {
    if (!orderItems || orderItems.length === 0) return 0;

    const total = orderItems.reduce((sum, item) => {
        const itemTotal = item.quantity * item.price;
        return sum + itemTotal;
    }, 0);

    return parseFloat(total.toFixed(2));
}


export const getStatusName = (statusId: number): string => {
    switch (statusId) {
        case 1:
            return 'Cart';
        case 2:
            return 'Accepted';
        case 3:
            return 'Prepared';
        case 4:
            return 'Sent';
        case 5:
            return 'Paid';
        case 6:
            return 'Canceled';
        case 7:
            return 'Closed';
        default:
            return 'Unknown';
    }
};

export const getStatusId = (statusName: string): number => {
    switch (statusName.toLowerCase()) {
        case 'cart':
            return 1;
        case 'accepted':
            return 2;
        case 'prepared':
            return 3;
        case 'sent':
            return 4;
        case 'paid':
            return 5;
        case 'canceled':
            return 6;
        case 'closed':
            return 7;
        default:
            return 0;
    }
};

export function getProductImageUrl(productId: number): string {
    return `http://creativehandsco.com/assets/Images/${productId}.jpg`;
}

export function getDefaultProductImageUrl(): string {
    return 'http://creativehandsco.com/assets/Images/DefaultImage.jpg';
}
