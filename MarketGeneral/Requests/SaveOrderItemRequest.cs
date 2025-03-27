using MarketCoreGeneral.Models.Products;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarketCoreGeneral.Requests
{
    public class SaveOrderItemRequest
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public int ProductId { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Quantity { get; set; }

        public string? Note { get; set; }
        
        public ProductVariationModel? ProductVariation { get; set; } = null;
        

        // Optional Colours
        public List<string>? Colours { get; set; } = null;
    }

}
