using AutoMapper;
using CreativeHandsCoreApi.DbContexts;
using CreativeHandsCoreApi.Entities.Sql.Orders;
using MarketCoreGeneral.Models.Authintication;
using MarketCoreGeneral.Models.Orders;
using MarketCoreGeneral.Requests;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System.Globalization;

namespace CreativeHandsCoreApi.Services
{
    public class PurchaseRepository : IPurchaseRepository
    {
        private ILogger<SqlMarketRepository> _logger;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;
        private readonly MarketContext _context;
        private readonly HttpContent? httpContent;
        private readonly HttpClient httpClient;
        public PurchaseRepository(MarketContext context,
            ILogger<SqlMarketRepository> logger,
            IConfiguration configuration,
            IMapper mapper)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper;
            _configuration = configuration;
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<PurchaseModel> GetPurchasesById(int purchaseId)
        {
            try
            {
                var sqlData = await _context.Purchase.FirstOrDefaultAsync(por => por.Id == purchaseId);
                var dataModel = _mapper.Map<PurchaseModel>(sqlData);
                return dataModel;
            }
            catch (Exception ex)
            {
                _logger.LogError("PurchaseServices.GetPurchasesById", null, -1, "", ex.Message, "request: " + purchaseId.ToString());
                throw;
            }
        }

        public async Task<int> SavePurchase(PurchaseModel purchase)
        {
            try
            {
                DateTime purchaseCreateDate = DateTime.Now;
                DateTime.TryParseExact(purchase.CreateDate, "dd/MM/yyyy", System.Globalization.CultureInfo.InvariantCulture, DateTimeStyles.None, out purchaseCreateDate);
                    //new DateTime(int.Parse(purchase.CreateDate.Split('/')[2]), int.Parse(purchase.CreateDate.Split('/')[1]), int.Parse(purchase.CreateDate.Split('/')[0]));
                 


                var dbPurchase = _context.Purchase.FirstOrDefault(o => o.Id == purchase.Id);
                if (dbPurchase != null)
                {
                    //update exist order

                    dbPurchase.Date = purchaseCreateDate;
                    dbPurchase.Amount = purchase.Amount;
                    dbPurchase.Description = purchase.Description;
                    dbPurchase.ProviderId = purchase.ProviderId;
                    dbPurchase.PurchaseLink = purchase.PurchaseLink;
                }
                else
                {
                    dbPurchase = _mapper.Map<SqlPurchase>(purchase);
                    _context.Purchase.Add(dbPurchase);
                    _context.SaveChanges();

                    if (!string.IsNullOrEmpty(purchase.Image))
                    {
                        _context.PurchaseImage.Add(new SqlPurchaseImage()
                        {
                            Extension = purchase.Image.Split('.')[1],
                            PurchaseId = dbPurchase.Id
                        });
                    }
                }
                _context.SaveChanges();
                return dbPurchase.Id;
            }
            catch (Exception ex)
            {
                var requestData = JsonConvert.SerializeObject(purchase);
                _logger.LogError("PurchaseServices.SavePurchase", null, -1, "Error saving purchase", requestData);
                return -1;
            }
        }

        public async Task<IEnumerable<PurchaseModel>> GetPurchases(GetPurchaseRequest request)
        {
            try
            {
                var minDate = new DateTime(2000, 01, 01);
                var _purchases = _context.Purchase.Where(rq => (request.Id == -1 || rq.Id == request.Id)
                                                            && (request.ProviderId == -1 || rq.ProviderId == request.ProviderId)
                                                            && (request.FromDate == null || request.FromDate <= minDate || rq.Date >= request.FromDate)
                                                            && (request.FromDate == null || request.FromDate <= minDate || rq.Date <= request.ToDate)).ToList();
                if (_purchases != null && _purchases.Any())
                {
                    var dataModel = _mapper.Map<IEnumerable<PurchaseModel>>(_purchases);
                    return dataModel;
                }
                return null;
            }
            catch (Exception ex)
            {
                var requestData = JsonConvert.SerializeObject(request);
                _logger.LogError("PurchaseServices.GetPurchases", null, -1, "", ex.Message, requestData);
                throw;
            }
        }

        public async Task<int> SaveProvider(ProviderModel provider)
        {
            try
            {
                var dbProvider = _context.Provider.FirstOrDefault(o => o.Id == provider.Id);
                if (dbProvider != null)
                {
                    //update exist provider
                    dbProvider.Name = provider.Name;
                    dbProvider.IdN = provider.IdN;
                    dbProvider.Description = provider.Description;
                    dbProvider.Address = provider.Address;
                    dbProvider.Tel1 = provider.Tel1;
                    dbProvider.Tel2 = provider.Tel2;
                    dbProvider.Email = provider.Email;
                    dbProvider.WebSite = provider.WebSite;
                    dbProvider.IsActive = provider.IsActive;
                }
                else
                {
                    dbProvider = _mapper.Map<SqlProvider>(provider);
                }
                _context.SaveChanges();
                return dbProvider.Id;
            }
            catch (Exception ex)
            {
                var requestData = JsonConvert.SerializeObject(provider);
                _logger.LogError("PurchaseServices.SaveProvider", null, -1, "", ex.Message, requestData);
                return -1;
            }
        }

        public async Task<IEnumerable<ProviderModel>> GetProviders()
        {
            try
            {
                var providers = _context.Provider.ToList();
                if (providers != null && providers.Any())
                {
                    var dataModel = _mapper.Map<IEnumerable<ProviderModel>>(providers);
                    return dataModel;
                }
                return null;
            }
            catch (Exception ex)
            {
                _logger.LogError("PurchaseServices.GetProviders", null, -1, "", ex.Message, "");
                throw;
            }
        }

        public async Task<ProviderModel> GetProviderById(int id)
        {
            try
            {
                var provider = _context.Provider.FirstOrDefault(pr=>pr.Id == id);
                if (provider !=null)
                {
                    var dataModel = _mapper.Map<ProviderModel>(provider);
                    return dataModel;
                }
                return null;
            }
            catch (Exception ex)
            {
                _logger.LogError("PurchaseServices.GetProviderById", null, -1, "", ex.Message, "");
                throw;
            }
        }
    }
}

