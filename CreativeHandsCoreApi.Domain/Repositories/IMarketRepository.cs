using MarketCoreGeneral.Models.Authintication;
using MarketCoreGeneral.Requests;

namespace CreativeHandsCoreApi.Domain.Repositories
{
    public interface IMarketRepository
    {
        Task<IEnumerable<UserModel>> GetUsersAsynch(GetUserRequest request);
    }
}
