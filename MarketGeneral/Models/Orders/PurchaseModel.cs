
using MarketCoreGeneral.Models.Customers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MarketCoreGeneral.Models.Orders
{
    public class PurchaseModel
    {
        public int Id { get; set; }
        public int ProviderId { get; set; }
        public decimal Amount { get; set; }
        public string CreateDate { get; set; }
        public string Description { get; set; }
        public string PurchaseLink { get; set; }
        public string Image { get; set; }
        //public ProviderModel Provider { get; set; }
    }
}