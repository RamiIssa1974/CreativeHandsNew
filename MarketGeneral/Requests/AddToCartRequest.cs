using MarketCoreGeneral.Models.Orders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarketCoreGeneral.Requests
{
    public class AddToCartRequest
    {
        public string UserId { get; set; }
        public int ProductId { get; set; }
        public int? ProductVariationId { get; set; }
        public decimal Quantity { get; set; }
        public decimal ProductPrice { get; set; }
        public decimal ProductSalePrice { get; set; }
        public decimal ProductUnitPrice { get; set; }
        public int OrderId { get; set; }
        public string Note { get; set; }
        public List<string>? OrderItemColours { get; set; }
        //public OrderItemModel OrderItem { get; set; }
    }
}
