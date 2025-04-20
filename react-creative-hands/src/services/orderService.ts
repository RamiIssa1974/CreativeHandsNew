import axiosAuth from '@/utils/axiosAuth';
import { OrderModel } from "@/data/OrdelModel";
import { OrderItemModel } from "@/data/OrderItemModel";
import { GetOrderRequest } from "@/data/Requests";
import { mapClientItemToServer } from "@/utils/Helpers";

const BASE_URL = 'orders';

export async function deleteItem(itemId: number): Promise<boolean> {
    try {
        await axiosAuth.delete(`${BASE_URL}/DeleteOrderItem/${itemId}`);
        return true;
    } catch (error) {
        console.error("Delete item error:", error);
        return false;
    }
}

export async function saveItem(item: OrderItemModel): Promise<number | null> {
    try {
        const serverRequestItem = mapClientItemToServer(item);
        const response = await axiosAuth.post(`${BASE_URL}/SaveOrderItem`, serverRequestItem);
        return response.data as number;
    } catch (error) {
        console.error("Save item error:", error);
        return null;
    }
}

export async function saveOrder(order: OrderModel): Promise<boolean> {
    try {
        await axiosAuth.post(`${BASE_URL}/SaveOrder`, order);
        return true;
    } catch (error) {
        console.error("Save order error:", error);
        return false;
    }
}

export async function fetchOrders(request: GetOrderRequest): Promise<OrderModel[]> {
    try {
        const res = await axiosAuth.post(`${BASE_URL}/Orders`, request);
        const data = res.data;
        const mappedOrders: OrderModel[] = Array.isArray(data)
            ? data.map(mapOrder)
            : [mapOrder(data)];

        return mappedOrders;
    } catch (error) {
        console.error("Failed to fetch orders:", error);
        throw error;
    }
}

export async function updateOrderStatus(orderId: number, statusId: number) {
    const order: Partial<OrderModel> = {
        id: orderId,
        statusId: statusId,
    };

    const res = await axiosAuth.post(`${BASE_URL}/ChangeOrderStatusByChangeOrderStatusRequest`, order);
    return res.data;
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
            productId: item.Product?.Id || 0,
            productName: item.Product?.Name || 'Unknown Product',
            quantity: item.Quantity,
            price: item.UnitPrice,
            imageFileName: item.Product.Images?.[0]?.Id + '.' + item.Product.Images?.[0]?.Extension,
            note: item.Note
        }))
    };
}
