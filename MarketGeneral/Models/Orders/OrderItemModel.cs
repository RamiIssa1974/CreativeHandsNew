using MarketCoreGeneral.Models.Products;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MarketCoreGeneral.Models.Orders
{
    public class OrderItemModel
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Quantity { get; set; }
        public string? Note { get; set; }
        public ProductVariationModel? ProductVariation { get; set; } = null;
        public ProductModel Product { get; set; }
        public List<string>? Colours { get; set; } = null;
    }
}