using Microsoft.AspNetCore.Mvc;

namespace CreativeHandsCoreApi.Authorization
{
    public class ConditionalAuthorizeAttribute : TypeFilterAttribute
    {
        public ConditionalAuthorizeAttribute() : base(typeof(ConditionalAuthorizeFilter)) { }
    }
}
