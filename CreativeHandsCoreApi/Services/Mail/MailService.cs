using MarketCoreGeneral.Models;
using MarketCoreGeneral.Models.Authintication;
using MarketCoreGeneral.Models.Orders;
using Microsoft.Extensions.Options;
using System.Net;

namespace CreativeHandsCoreApi.Services.Mail
{
    public class MailService : IMailService
    {
        private readonly SmsSettings _smsSettings;
        public MailService(IOptions<SmsSettings> smsSettings)
        {
            _smsSettings = smsSettings.Value;
        }
        public bool SendSmsToSeller(OrderModel sendOrderRequest)
        {
            HttpWebResponse response = null;
            try
            {
                var orderTotalPrice = sendOrderRequest.OrderItems.Sum(it => it.Quantity * it.UnitPrice);
                var orderFinalPrice = orderTotalPrice + sendOrderRequest.DeleveryPrice - (sendOrderRequest.Discount * orderTotalPrice / 100);
                //http://creativehandsco.com/#/order/{0} # changed to %23

                var customerNode = sendOrderRequest.Notes != null ?
                    sendOrderRequest.Notes :
                    sendOrderRequest.Customer != null && sendOrderRequest.Customer.Notes != null ?
                    sendOrderRequest.Customer.Notes : "";


                customerNode = customerNode.Length > 20 ? customerNode.Substring(0, 20) : customerNode;

                var message = @"Order: http://creativehandsco.com/%23/order/{sendOrderRequest.Id} was opened "
                    + sendOrderRequest.Customer?.Name!=null? @"by Customer:{sendOrderRequest.Customer?.Name},":string.Empty
                    + sendOrderRequest.Customer?.Tel1 != null ? @"Tel:{ sendOrderRequest.Customer?.Tel1}," : string.Empty
                    + sendOrderRequest.Customer?.Address != null ? @"From: {sendOrderRequest.Customer?.Address}," : string.Empty
                    + (!string.IsNullOrEmpty(customerNode) ? @"Notes:{customerNode}," : string.Empty)
                    + orderFinalPrice != null ? @"Price:{ orderFinalPrice}" : string.Empty;
                
                                                  

                var baseUrl = _smsSettings.BaseUrl;
                var token = _smsSettings.Token;
                var sellerTel = _smsSettings.SellerTel;
                var siteTel = _smsSettings.SiteTel;
                var maxSmsLength = _smsSettings.MaxSmsLength;

                var maxLenMessage = message.Length > 133 ? message.Substring(0, maxSmsLength) : message;
                var url = string.Format("{0}&token={1}&msg={2}&list={3}&from={4}", baseUrl, token, maxLenMessage, sellerTel, siteTel);

                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);

                request.KeepAlive = true;
                request.Headers.Add("Upgrade-Insecure-Requests", @"1");
                request.UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Safari/537.36";
                request.Accept = "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9";
                request.Headers.Set(HttpRequestHeader.AcceptEncoding, "gzip, deflate");
                request.Headers.Set(HttpRequestHeader.AcceptLanguage, "he-IL,he;q=0.9,en-US;q=0.8,en;q=0.7,ar;q=0.6");
                //request.Headers.Set(HttpRequestHeader.Cookie, @"_ga=GA1.3.946503644.1599141552; _gcl_au=1.1.1580540886.1602790571; _fbp=fb.2.1602790738854.148666567; sysMsg1=1");

                response = (HttpWebResponse)request.GetResponse();
            }
            catch (WebException e)
            {
                if (e.Status == WebExceptionStatus.ProtocolError) response = (HttpWebResponse)e.Response;
                else return false;
            }
            catch (Exception ex)
            {
                if (response != null) response.Close();
                return false;
            }

            return true;
        }
    }
}
