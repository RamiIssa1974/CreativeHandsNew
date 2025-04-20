using MarketCoreGeneral.Models.Orders;

namespace CreativeHandsCoreApi.Infrastructure.Services.Mail
{
    public interface IMailService
    {
        bool SendSmsToSeller(OrderModel sendOrderRequest);
    }
}
