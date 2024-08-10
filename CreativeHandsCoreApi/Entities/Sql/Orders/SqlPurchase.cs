
using MarketCoreGeneral.Models.Customers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CreativeHandsCoreApi.Entities.Sql.Orders
{
    public class SqlPurchase
    {
        public int Id { get; set; }
        public int ProviderId { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public string? Description { get; set; }
        public string? PurchaseLink { get; set; }        
    }
}