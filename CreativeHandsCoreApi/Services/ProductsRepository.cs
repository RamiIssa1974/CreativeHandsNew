using AutoMapper;
using CreativeHandsCoreApi.DbContexts;
using CreativeHandsCoreApi.Entities.Sql.Products;
using CreativeHandsCoreApi.Services.Mail;
using MarketCoreGeneral.Models;
using MarketCoreGeneral.Models.Products;
using MarketCoreGeneral.Requests;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace CreativeHandsCoreApi.Services
{
    public class ProductsRepository : IProductsRepository
    {
        private readonly IMemoryCache _memoryCache;
        private ILogger<SqlMarketRepository> _logger;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;
        private readonly MarketContext _context;
        private readonly IMailService _mailer;
        private readonly CacheSettings _cacheSettings;
        private readonly HttpContent? httpContent;
        private readonly HttpClient httpClient;
        public ProductsRepository(IMemoryCache memoryCache,
            MarketContext context,
            ILogger<SqlMarketRepository> logger,
            IConfiguration configuration,
            IMapper mapper,
            IMailService mailer,
            IOptions<CacheSettings> cacheSettings)
        {
            _memoryCache = memoryCache;
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper;
            _configuration = configuration;
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _mailer = mailer;
            _cacheSettings = cacheSettings.Value;
        }
        public async Task<List<ProductColourModel>> GetAvailableColours()
        {
            var sqlData = _context.ProductAvailableColours;
            var dataModel = _mapper.Map<IEnumerable<ProductColourModel>>(sqlData);
            return dataModel.ToList();
        }

        public async Task<List<ProductModel>> GetCachedProductsAsync(GetProductRequest request)
        {
            if (_memoryCache.TryGetValue("cachedAllProducts", out List<ProductModel> cachedProducts))
            {                
                return cachedProducts;
            }
            else
            {                
                List<ProductModel> products = await GetAllProducts();
                _memoryCache.Set("cachedAllProducts", products, TimeSpan.FromHours(_cacheSettings.AllProductsCacheHours)); 
                return products;
            }
        }
        public async Task<List<ProductModel>?> GetAllProducts()
        {
            var sqlProducts = _context.Product;
            var products = _mapper.Map<IEnumerable<ProductModel>>(sqlProducts);
            return products.ToList();
        }
        public async Task<List<CategoryModel>> GetCategories()
        {
            var sqlData = _context.Category;
            var dataModel = _mapper.Map<IEnumerable<CategoryModel>>(sqlData);
            return dataModel.ToList();
        }

        public async Task<List<ProductImageModel>> GetImages()
        {
            var sqlData = _context.Image;
            var dataModel = _mapper.Map<IEnumerable<ProductImageModel>>(sqlData);
            return dataModel.ToList();
        }

        public async Task<List<ProductCategoryModel>> GetProductCategories()
        {
            var sqlData = _context.ProductCategory;
            var dataModel = _mapper.Map<IEnumerable<ProductCategoryModel>>(sqlData);
            return dataModel.ToList();
        }

        public async Task<List<ProductModel>> GetProducts(GetProductRequest request)
        {
            var sqlData = _context.Category;
            var dataModel = _mapper.Map<IEnumerable<ProductModel>>(sqlData);
            return dataModel.ToList();
        }

        public async Task<List<ProductVariationModel>> GetProductVariations()
        {
            var sqlData = _context.ProductVariation;
            var dataModel = _mapper.Map<IEnumerable<ProductVariationModel>>(sqlData);
            return dataModel.ToList();
        }

        public async Task<int> SaveProduct(SaveProductRequest product)
        {
            //var sqlData = _context.Category;
            //var dataModel = _mapper.Map<IEnumerable<CategoryModel>>(sqlData);

            try
            {
                //Update Product
                if (product != null && product.Id > 0)
                {
                    var dbProd = _context.Product.FirstOrDefault(pr => pr.Id == product.Id);
                    if (dbProd != null)
                    {
                        //var catMapper = new CategoryMapper();

                        dbProd.Name = product.Name;
                        dbProd.Price = product.Price;
                        dbProd.SalePrice = product.SalePrice;
                        dbProd.Barcode = product.Barcode;
                        dbProd.Description = product.Description != null ? product.Description : "";
                        dbProd.StockQuantity = product.StockQuantity;
                        _context.SaveChanges();

                        UpdateProductCategories(dbProd.Id, product.Categories);
                        UpdateProductAvailableColours(dbProd.Id, product.AvailableColours);
                        UpdateProductVariations(dbProd.Id, product.ProductVariations);
                        UpdateProductImages(dbProd.Id, product.Images, product.UploadedImages);

                        UpdateProductsCache(dbProd);
                    }

                    return product.Id;
                }
                else if (product.Id <= 0)
                {
                    var dbProd = new SqlProduct()
                    {
                        Name = product.Name,
                        Price = product.Price,
                        SalePrice = product.SalePrice,
                        Barcode = product.Barcode,
                        Description = product.Description != null ? product.Description : "",
                        StockQuantity = product.StockQuantity,
                    };

                    _context.Product.Add(dbProd);
                    _context.SaveChanges();

                    UpdateProductCategories(dbProd.Id, product.Categories);
                    UpdateProductAvailableColours(dbProd.Id, product.AvailableColours);
                    UpdateProductVariations(dbProd.Id, product.ProductVariations);
                    UpdateProductImages(dbProd.Id, product.Images, product.UploadedImages);

                    UpdateProductsCache(dbProd);
                    return dbProd.Id;
                }
                else
                {
                    var requestData = JsonConvert.SerializeObject(product);
                    _logger.LogError("ProductServices.SaveProduct", null, -1, "Error Saving data,product is not legal", requestData);
                    return -1;
                }
            }
            catch (Exception ex)
            {
                var requestData = JsonConvert.SerializeObject(product);
                _logger.LogError("ProductServices.SaveProduct", null, -1, "", ex.Message, requestData);
                return -1;
            }
        }
        private async void UpdateProductsCache(SqlProduct dbProd)
        {
            var allProducts = await GetCachedProductsAsync(new GetProductRequest());
            if (allProducts != null)
            {
                var convertedProd = _mapper.Map<ProductModel>(dbProd);

                var curProd = allProducts.FirstOrDefault(pr => pr.Id == dbProd.Id);
                if (curProd != null)
                {
                    curProd = convertedProd;
                }
                else
                {
                    allProducts.Add(convertedProd);
                }
                _memoryCache.Set("cachedAllProducts", allProducts, TimeSpan.FromMinutes(30)); // Cache for 30 minutes
            }
        }

        private void UpdateProductAvailableColours(int productId, List<string> availableColours)
        {
            if (availableColours != null)
            {
                var product = _context.Product.FirstOrDefault(pr => pr.Id == productId);
                if (product != null)
                {
                    foreach (var colourCode in availableColours)
                    {
                        if (!_context.ProductAvailableColours.Any(pAc => pAc.ProductId == productId && pAc.Code == colourCode))
                        {
                            _context.ProductAvailableColours.Add(new SqlProductAvailableColours { Code = colourCode, ProductId = productId });
                        }
                    }
                    _context.ProductAvailableColours.RemoveRange(_context.ProductAvailableColours.Where(pc => !availableColours.Contains(pc.Code)));
                    _context.SaveChanges();
                }
            }
        }

        private async Task UpdateProductVariations(int productId, List<ProductVariationModel> productVariations)
        {
            try
            {
                //remove deleted items
                // Remove all product variations with the specific ProductId in a single call
                var variationsToRemove = _context.ProductVariation.Where(pv => pv.ProductId == productId).ToList();
                _context.ProductVariation.RemoveRange(variationsToRemove);


                if (productVariations != null)
                {
                    var newVariations = productVariations.Select(pv => new SqlProductVariation
                    {
                        ProductId = productId,
                        Price = pv.Price,
                        Description = pv.Description
                    }).ToList();

                    _context.ProductVariation.AddRange(newVariations);

                }
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {

                Console.WriteLine($"An error occurred while updating product variations: {ex.Message}");
                // Optional: rethrow or handle the exception based on your needs
                throw;
            }

        }


        //private void UpdateProductVariations(int productId, List<ProductVariationModel> productVariations)
        //{
        //    try
        //    {
        //        if (productVariations != null)
        //        {
        //            var product = _context.Product.FirstOrDefault(pr => pr.Id == productId);
        //            if (product != null)
        //            {
        //                foreach (var prodVar in productVariations.Where(pv => pv.Id > 0 && pv.ProductId > 0))
        //                {
        //                    //Add new items
        //                    if (!_context.ProductVariation.Any(pv => pv.ProductId == productId && pv.Price == prodVar.Price && pv.Description == prodVar.Description))
        //                    {
        //                        _context.ProductVariation.Add(new SqlProductVariation { ProductId = productId, Price = prodVar.Price, Description = prodVar.Description });
        //                        _context.SaveChanges();
        //                    }
        //                    else
        //                    {
        //                        //Update exists items
        //                        var pv = _context.ProductVariation.FirstOrDefault(pVar => pVar.ProductId == productId && pVar.Id == prodVar.Id);
        //                        if (pv != null)
        //                        {
        //                            pv.Price = prodVar.Price;
        //                            pv.Description = prodVar.Description;
        //                            _context.SaveChanges();
        //                        }
        //                    }
        //                }

        //                //remove deleted items
        //                _context.ProductVariation.Where(pv => pv.ProductId == productId).ToList().ForEach(pv =>
        //                {
        //                    if (!productVariations.Any(_pv => _pv.Price == pv.Price && _pv.Description == pv.Description))
        //                    {
        //                        _context.ProductVariation.Remove(pv);
        //                    }
        //                });

        //                _context.SaveChanges();
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {

        //        var aa = 1;
        //    }

        //}



        public void UpdateProductCategories(int productId, List<int> categoryIds)
        {
            if (categoryIds != null)
            {
                var product = _context.Product.FirstOrDefault(pr => pr.Id == productId);
                if (product != null)
                {
                    foreach (var catId in categoryIds)
                    {
                        if (!_context.ProductCategory.Any(cat => cat.ProductId == productId && cat.CategoryId == catId))
                        {
                            _context.ProductCategory.Add(new SqlProductCategory { CategoryId = catId, ProductId = productId });
                        }
                    }
                    _context.ProductCategory.RemoveRange(_context.ProductCategory.Where(pc => pc.ProductId == productId && !categoryIds.Contains((int)pc.CategoryId)));
                    _context.SaveChanges();
                }
            }
        }
        public void UpdateProductImages(int productId, List<string> newImages, List<string> uploadedImages)
        {
            if (uploadedImages != null && uploadedImages.Any() && newImages != null && newImages.Any())
            {
                var imageIds = new List<int>();
                newImages.ForEach(im =>
                {
                    int imgId = -1;
                    if (int.TryParse(im.Split('.')[0], out imgId))
                    {
                        imageIds.Add(imgId);
                    }
                });
                uploadedImages.ForEach(im =>
                {
                    int imgId = -1;
                    if (int.TryParse(im.Split('.')[0], out imgId))
                    {
                        imageIds.Add(imgId);
                    }
                });
                var product = _context.Product.FirstOrDefault(pr => pr.Id == productId);
                if (product != null)
                {
                    _context.Image.RemoveRange(_context.Image.Where(im => im.Id == productId && !imageIds.Contains(im.Id)));
                    _context.SaveChanges();
                }
            }
        }
    }
}