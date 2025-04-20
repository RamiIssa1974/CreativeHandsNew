using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CreativeHandsCoreApi.Domain.Repositories;
using MarketCoreGeneral.Requests;

namespace CreativeHandsCoreApi.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IMarketRepository _marketRepository;
        private readonly IConfiguration _config;

        public AuthController(IMarketRepository marketRepository, 
                              IConfiguration config)
        {
            _marketRepository = marketRepository;
            _config = config;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] GetUserRequest request)
        {
            var users = await _marketRepository.GetUsersAsynch(request);
            var user = users.FirstOrDefault();

            if (user == null)
                return Unauthorized("Invalid username or password.");

            var token = GenerateJwtToken(user.UserName, user.IsAdmin);

            return Ok(new
            {
                token,
                user = new
                {
                    user.Id,
                    user.UserName,
                    user.FullName,
                    user.IsAdmin
                }
            });
        }

        private string GenerateJwtToken(string username, bool isAdmin)
        {
            var jwtSecret = _config["Authentication:JwtSecret"];
            var issuer = _config["Authentication:Issuer"];
            var audience = _config["Authentication:Audience"];

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, username),
                new Claim(ClaimTypes.Role, isAdmin ? "Admin" : "User")
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(12),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
