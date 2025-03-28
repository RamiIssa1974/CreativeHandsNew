import { OrderModel } from "@/data/OrdelModel";
import { OrderItemModel } from "@/data/OrderItemModel";
import { GetOrderRequest } from "@/data/Requests";
import { mapClientItemToServer } from "@/utils/Helpers";

// src/services/ordersService.ts                      
//const API_BASE_URL = 'http://localhost:7163/api/orders';
const API_BASE_URL = 'http://194.36.89.39:7163/api/orders';

export async function deleteItem(itemId: number): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE_URL}/DeleteOrderItem/${itemId}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            console.error("Delete item failed with status:", response.status);
            return false;
        }

        console.log(`Item ${itemId} deleted successfully`);
        return true;
    } catch (error) {
        console.error("Delete item error:", error);
        return false;
    }
}

export async function saveItem(item: OrderItemModel): Promise<number | null> {
    try {             
        const serverRequestItem = mapClientItemToServer(item);

        const response = await fetch(API_BASE_URL + "/SaveOrderItem", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(serverRequestItem),
        });

        if (!response.ok) {
            console.error("Save item failed with status:", response.status);
            return null;
        }
        const orderItemId: number = await response.json();
        return orderItemId;

    } catch (error) {
        console.error("Save item error:", error);
        return null;
    }
}

export async function saveOrder(order: OrderModel): Promise<boolean> {
    try {
        const response = await fetch(API_BASE_URL + "/SaveOrder", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(order),
        });

        if (!response.ok) {
            console.error("Failed to save order:", response.statusText);
            return false;
        }

        return true;
    } catch (error) {
        console.error("Save order error:", error);
        return false;
    }
}

export async function fetchOrders(request: GetOrderRequest): Promise<OrderModel[]> {
     
    const res = await fetch(API_BASE_URL + '/Orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
    });

    if (!res.ok) throw new Error('Failed to fetch orders');

    const data = await res.json();
    const mappedOrders: OrderModel[] = Array.isArray(data)
        ? data.map(mapOrder)
        : [mapOrder(data)];

    console.log('mappedOrders Raw data from API:', mappedOrders);



    return mappedOrders;
}
function mapOrder(order: any): OrderModel {
    return {
        id: order.Id,
        userId: order.UserId,
        customerId: order.CustomerId,
        statusId: order.StatusId,
        deleveryPrice: order.DeleveryPrice,
        createDate: order.CreateDate,
        address: order.Address,
        notes: order.Notes,
        discount: order.Discount,
        customer: {
            name: order.Customer?.Name,
            phone: order.Customer?.Tel1,
            address: order.Customer?.Address,
            notes: order.Customer?.Notes
        },
        orderItems: order.OrderItems.map((item: any): OrderItemModel => ({
            id: item.Id,
            orderId: item.OrderId,
            productId: item.Product?.Id || 0,          // Fallback if Product is missing
            productName: item.Product?.Name || 'Unknown Product',
            quantity: item.Quantity,
            price: item.UnitPrice,
            imageFileName: item.Product.Images[0]?.Id + '.' + item.Product.Images[0]?.Extension,
            note:item.Note
        }))

    };
}

export async function updateOrderStatus(orderId: number, statusId: number) {
    const order: Partial<OrderModel> = {
        id: orderId,
        statusId: statusId,
    };

    const res = await fetch(API_BASE_URL + '/ChangeOrderStatusByChangeOrderStatusRequest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
    });

    if (!res.ok) throw new Error('Failed to update order status');
    return res.json();
}


