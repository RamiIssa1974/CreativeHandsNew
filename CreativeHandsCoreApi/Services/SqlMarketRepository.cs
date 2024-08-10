using AutoMapper;
using CreativeHandsCoreApi.DbContexts;
using MarketCoreGeneral.Models.Authintication;
using MarketCoreGeneral.Requests;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace CreativeHandsCoreApi.Services
{
    public class SqlMarketRepository : IMarketRepository
    {
        private ILogger<SqlMarketRepository> _logger;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;
        private readonly MarketContext _context;
        private readonly HttpContent? httpContent;
        private readonly HttpClient httpClient;
        public SqlMarketRepository(MarketContext context,
            ILogger<SqlMarketRepository> logger,
            IConfiguration configuration,
            IMapper mapper)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper;
            _configuration = configuration;
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<IEnumerable<UserModel>> GetUsersAsynch(GetUserRequest request)
        {
            var sqlUsers = await _context.User.ToListAsync();
            var filtered = sqlUsers.Where(su => request.UserName == "-1" || (
            su.Password == request.Password && su.UserName == request.UserName));
            var users = _mapper.Map<IEnumerable<UserModel>>(filtered);
            return users;
        }
    }
}

