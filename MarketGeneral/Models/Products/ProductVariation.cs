using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MarketCoreGeneral.Models.Products
{
    public class ProductVariationModel
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public decimal Price { get; set; }
                       
        public string Description { get; set; }         
    }
}
 