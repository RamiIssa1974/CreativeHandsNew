using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarketCoreGeneral.Requests
{
    public class GetPurchaseRequest
    {
        public int Id { get; set; } = -1;
        public int ProviderId { get; set; } = -1;
        public System.DateTime? FromDate { get; set; } = new DateTime(2000, 01, 01);
        public System.DateTime? ToDate { get; set; } = new DateTime(2000, 01, 01);
    }
}
