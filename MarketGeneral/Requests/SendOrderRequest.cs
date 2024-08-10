using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarketCoreGeneral.Requests
{
    public class SendOrderRequest
    {
        public int OrderId { get; set; }
        public string UserID { get; set; }
        public string CustomerName { get; set; }
        public string CustomerTel { get; set; }
        public string Address { get; set; }
        public string Notes { get; set; }
    }
}
