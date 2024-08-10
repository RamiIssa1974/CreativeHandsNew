using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MarketCoreGeneral.Models.Products
{
    public class ProductImageModel
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string Extension { get; set; }        
    }
}
 