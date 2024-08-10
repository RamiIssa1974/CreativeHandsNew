using MarketCoreGeneral.Models.Orders;
using MarketCoreGeneral.Models.Products;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarketCoreGeneral.Requests
{
    public class SaveProductRequest
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Barcode { get; set; }
        public decimal Price { get; set; }
        public Nullable<decimal> SalePrice { get; set; }
        public List<string> Images { get; set; }
        public List<string> UploadedImages { get; set; }
        public List<int> Categories { get; set; }
        public List<ProductVariationModel> ProductVariations { get; set; }
        public List<string> AvailableColours { get; set; }
        public int StockQuantity { get; set; }
    }
}
