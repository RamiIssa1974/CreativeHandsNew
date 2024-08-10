using MarketCoreGeneral.Models.Orders;

namespace CreativeHandsCoreApi.Services.Mail
{
    public interface IMailService
    {
        bool SendSmsToSeller(OrderModel sendOrderRequest);
    }
}
