using MarketCoreGeneral.Models.Orders;
using MarketCoreGeneral.Requests;

namespace CreativeHandsCoreApi.Services
{
    public interface IPurchaseRepository
    {        
        Task<PurchaseModel> GetPurchasesById(int purchaseId);
        Task<int> SavePurchase(PurchaseModel purchase);
        Task<IEnumerable<PurchaseModel>> GetPurchases(GetPurchaseRequest request);
        Task<int> SaveProvider(ProviderModel provider);
        Task<IEnumerable<ProviderModel>> GetProviders();
        Task<ProviderModel> GetProviderById(int id);
    }
}
