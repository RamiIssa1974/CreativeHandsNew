using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;

namespace CreativeHandsCoreApi.Authorization
{
    public class ConditionalAuthorizeFilter : IAuthorizationFilter
    {
        private readonly IConfiguration _config;

        public ConditionalAuthorizeFilter(IConfiguration config)
        {
            _config = config;
        }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            bool authEnabled = _config.GetValue<bool>("Authentication:Enabled");
            if (authEnabled && !context.HttpContext.User.Identity.IsAuthenticated)
            {
                context.Result = new UnauthorizedResult();
            }
        }
    }
}
