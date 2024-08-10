using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MarketCoreGeneral.Models.Products
{
    public class ProductModel
    {       
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public Nullable<decimal> SalePrice { get; set; }
        public string Barcode { get; set; }
        public string Description { get; set; }
        public virtual List<ProductImageModel> Images { get; set; }
        public virtual int[] ImagesIds
        {
            get
            {
                if(Images == null) { return new int[0]; }
                return Images.Select(x => x.Id).ToArray();
            }
        }
        public List<CategoryModel> Categories { get; set; }

        public virtual int[] CategoriesIds
        {
            get
            {
                if (Categories == null) { return new int[0]; }
                return Categories.Select(x => x.Id).ToArray();
            }
        }
        public List<ProductVariationModel> ProductVariations { get; set; }
        public virtual int[] ProductVariationsIds
        {
            get
            {
                if (ProductVariations == null) { return new int[0]; }
                return ProductVariations.Select(x => x.Id).ToArray();
            }
        }
        public List<ProductColourModel> AvailableColours { get; set; }
        public virtual int[] AvailableColoursIds
        {
            get
            {
                if (AvailableColours == null) { return new int[0]; }
                return AvailableColours.Select(x => x.Id).ToArray();
            }
        }        
        public int StockQuantity { get; set; }
    }
}
 