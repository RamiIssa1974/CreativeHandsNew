using MarketCoreGeneral.Models.Authintication;
using MarketCoreGeneral.Requests;

namespace CreativeHandsCoreApi.Services
{
    public interface IMarketRepository
    {
        Task<IEnumerable<UserModel>> GetUsersAsynch(GetUserRequest request);
    }
}
