using MarketCoreGeneral.Models.Orders;
using MarketCoreGeneral.Requests;

namespace CreativeHandsCoreApi.Domain.Repositories
{
    public interface IOrdersRepository
    {
        Task<OrderModel> GetOrderById(int orderId);
        Task<OrderModel> GetCart(string userId);
        Task<int> ChangeOrderStatus(OrderModel order);
        Task<int> AddToCart(AddToCartRequest request);
        Task<bool> SendOrder(SendOrderRequest request);
        Task<int> SaveOrder(OrderModel saveOrder);
        Task<int> SaveOrderItem(SaveOrderItemRequest orderItem);
        Task<List<OrderModel>> GetOrders(GetOrderRequest request);
        Task<OrderModel?> GetEmptyCart(string userId);
        Task<int> MigrateAnonymousCartToUser(MigrateAnonymousCartToUserRequest request);
        Task<bool> DeleteOrderItem(int id);
    }
}
