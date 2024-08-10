using CreativeHandsCoreApi.Entities.Sql.Products;
using MarketCoreGeneral.Models.Products;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CreativeHandsCoreApi.Entities.Sql.Orders
{
    public class SqlOrderItem
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public int OrderId { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Quantity { get; set; }
        public string? Note { get; set; }
        public  int? ProductVariationId { get; set; }        
        public string? ColourId { get; set; }
    }
}