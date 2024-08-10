using MarketCoreGeneral.Models.Orders;
using MarketCoreGeneral.Models.Products;
using MarketCoreGeneral.Requests;

namespace CreativeHandsCoreApi.Services
{
    public interface IProductsRepository
    {
        Task<List<ProductModel>> GetCachedProductsAsync(GetProductRequest request);
        Task<List<CategoryModel>> GetCategories();
        Task<List<ProductImageModel>> GetImages();
        Task<List<ProductVariationModel>> GetProductVariations();

        Task<List<ProductColourModel>> GetAvailableColours();
        Task<List<ProductModel>> GetProducts(GetProductRequest request);
        Task<List<ProductCategoryModel>> GetProductCategories();

        Task<int> SaveProduct(SaveProductRequest request);
        Task<List<ProductModel>> GetAllProducts();
    }
}
