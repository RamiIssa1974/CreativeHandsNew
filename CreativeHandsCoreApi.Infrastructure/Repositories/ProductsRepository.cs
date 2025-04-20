using AutoMapper;
 
using CreativeHandsCoreApi.Domain.Repositories;
using CreativeHandsCoreApi.Infrastructure.Entities.Products;
using CreativeHandsCoreApi.Infrastructure.Persistence;
using CreativeHandsCoreApi.Infrastructure.Services.Ftp;
using CreativeHandsCoreApi.Infrastructure.Services.Mail;
using MarketCoreGeneral.Models;
using MarketCoreGeneral.Models.Products;
using MarketCoreGeneral.Requests;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace CreativeHandsCoreApi.Infrastructure.Repositories
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
        private readonly IFtpService _ftpService;
        public ProductsRepository(IMemoryCache memoryCache,
                                MarketContext context,
                                ILogger<SqlMarketRepository> logger,
                                IConfiguration configuration,
                                IMapper mapper,
                                IMailService mailer,
                                IOptions<CacheSettings> cacheSettings,
                                IFtpService ftpService)
        {
            _memoryCache = memoryCache;
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper;
            _configuration = configuration;
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _mailer = mailer;
            _cacheSettings = cacheSettings.Value;
            _ftpService = ftpService;
        }
        public async Task<List<ProductColourModel>> GetAvailableColours()
        {
            var sqlData = _context.ProductAvailableColours;
            var dataModel = _mapper.Map<IEnumerable<ProductColourModel>>(sqlData);
            return dataModel.ToList();
        }

        public async Task<List<ProductModel>> GetCachedProductsAsync(GetProductRequest request)
        {
            List<ProductModel> products;

            if (_memoryCache.TryGetValue("cachedAllProducts", out List<ProductModel> cachedProducts))
            {
                products = cachedProducts;
            }
            else
            {
                products = await GetAllProducts();
                _memoryCache.Set("cachedAllProducts", products, TimeSpan.FromHours(_cacheSettings.AllProductsCacheHours));
            }

            // Apply filtering based on request
            var filteredProducts = products.AsQueryable();

            if (request != null)
            {
                if (request.Id > 0)
                    filteredProducts = filteredProducts.Where(p => p.Id == request.Id);

                if (!string.IsNullOrEmpty(request.Name))
                    filteredProducts = filteredProducts.Where(p => p.Name.Contains(request.Name));

                if (!string.IsNullOrEmpty(request.Description))
                    filteredProducts = filteredProducts.Where(p => p.Description.Contains(request.Description));

                if (!string.IsNullOrEmpty(request.Barcode))
                    filteredProducts = filteredProducts.Where(p => p.Barcode == request.Barcode);

                if (request.CategoryId > 0)
                    filteredProducts = filteredProducts.Where(p => p.CategoriesIds.Contains(request.CategoryId));

                if (request.SubCategoryId > 0)
                    filteredProducts = filteredProducts.Where(p => p.CategoriesIds.Contains(request.SubCategoryId));
            }

            return filteredProducts.ToList();
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

                        await UpdateProductsCache(dbProd);
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

                    await UpdateProductsCache(dbProd);

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
        private async Task UpdateProductsCache(SqlProduct dbProd)
        {
            try
            {
                var allProducts = await GetCachedProductsAsync(new GetProductRequest());

                if (allProducts == null)
                    return;
                
                var convertedProd = _mapper.Map<ProductModel>(dbProd);

                var curProd = allProducts.FirstOrDefault(pr => pr.Id == dbProd.Id);

                if (curProd != null)
                {
                    curProd.Id = convertedProd.Id;
                    curProd.Price = convertedProd.Price;
                    curProd.SalePrice = convertedProd.SalePrice;
                    curProd.Barcode = convertedProd.Barcode;
                    curProd.Name = convertedProd.Name;
                    curProd.Description = convertedProd.Description;
                    curProd.Categories = convertedProd.Categories;
                    curProd.Images = convertedProd.Images;
                    curProd.AvailableColours = convertedProd.AvailableColours;
                    curProd.ProductVariations = convertedProd.ProductVariations;
                    curProd.StockQuantity = convertedProd.StockQuantity;                   
                }
                else
                {
                    allProducts.Add(convertedProd);
                }

                _memoryCache.Set("cachedAllProducts", allProducts, TimeSpan.FromMinutes(30));
            }
            catch (Exception ex)
            {
                _logger.LogError($"❌ UpdateProductsCache failed: {ex.Message}");
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
                    _context.ProductAvailableColours.RemoveRange(_context.ProductAvailableColours.Where(pc => pc.ProductId == productId && !availableColours.Contains(pc.Code)));
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

        public async Task<bool> DeleteProduct(int productId)
        {            
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    List<string> fileNames = null;

                    var product = await _context.Product
                        .FirstOrDefaultAsync(p => p.Id == productId);

                    if (product == null)
                    {
                        return false;  
                    }
                    var productCats = await _context.ProductCategory
                       .Where(pc => pc.ProductId == productId)
                       .ToListAsync();

                    if (productCats.Any())
                    {
                        _context.ProductCategory.RemoveRange(productCats);
                    }

                    var productColors = await _context.ProductAvailableColours
                        .Where(pc => pc.ProductId == productId)
                        .ToListAsync();

                    if (productColors.Any())
                    {
                        _context.ProductAvailableColours.RemoveRange(productColors);
                    }
                     
                    var productVariations = await _context.ProductVariation
                        .Where(pv => pv.ProductId == productId)
                        .ToListAsync();

                    if (productVariations.Any())
                    {
                        _context.ProductVariation.RemoveRange(productVariations);
                    }
                    
                    var productImages = await _context.Image
                        .Where(img => img.ProductId == productId)
                        .ToListAsync();

                    if (productImages.Any())
                    {
                        fileNames = productImages.Select(img => $"{img.Id}.{img.Extension}").ToList();
                        _context.Image.RemoveRange(productImages);
                    }
                    await _context.SaveChangesAsync();
                    //Delete product
                    _context.Product.Remove(product);
                     
                    await _context.SaveChangesAsync();
                    
                    await transaction.CommitAsync();

                    await UpdateProductsCache(product);

                    if (fileNames != null)
                    {
                        var failedFiles = await _ftpService.DeleteFilesFromFTP(fileNames, "Images");

                        if (failedFiles.Any())
                        {
                            _logger.LogWarning($"⚠️ some images failed to delete from FTP: {string.Join(", ", failedFiles)}");
                        }

                    }
                    return true;
                }
                catch (Exception ex)
                {                    
                    await transaction.RollbackAsync();

                    _logger.LogError("ProductsRepository.DeleteProduct", null, -1, "", ex.Message, "productId: " + productId.ToString());
                    throw;
                }
            }
        }         
    }
}