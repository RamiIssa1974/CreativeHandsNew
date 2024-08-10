using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CreativeHandsCoreApi.Entities.Sql.Products
{
    public class SqlProduct
    {       
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public Nullable<decimal> SalePrice { get; set; }
        public string? Barcode { get; set; }
        public string? Description { get; set; }
          
        public int? StockQuantity { get; set; }
    }
}
 