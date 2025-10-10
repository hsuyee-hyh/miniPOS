using Azure.Core;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using ReactApp1.Server.Database;
using ReactApp1.Server.Database.Models;
using ReactApp1.Server.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;

namespace ReactApp1.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
      

        private readonly AppDbContext _context;
        private readonly JwtSettings _jwtSettings;
        public UsersController(AppDbContext context, IOptions<JwtSettings> jwtSettings)
        {
            _context = context;
            _jwtSettings = jwtSettings.Value;

            // Debug: Check if key is being read
            if (string.IsNullOrEmpty(_jwtSettings.SecretKey))
            {
                throw new Exception("JWT SecretKey is missing or empty from appsettings.json!");
            }
        }

        [HttpPost("login")]
        public IActionResult Login(LoginUser user)
        {
            if(string.IsNullOrEmpty(user.Email) || string.IsNullOrEmpty(user.Password))
            {
                return BadRequest(new { message = "Email and password are required." });
            }

            var foundUser = _context.Users.FirstOrDefault(x => x.Email == user.Email);
            if (foundUser == null)
            {
                return BadRequest(new { message = "User not found" });
            }
            

            if (user.Email != foundUser.Email && user.Password != foundUser.Password)
            {
                return Unauthorized(new { message = "Wrong email or password" });
            }

            // Claims
            var claims = new[] { new Claim(ClaimTypes.Name, user.Email) };

            // SymmetricSecurityKey
            var key = Convert.FromBase64String(_jwtSettings.SecretKey);
            var signingKey = new SymmetricSecurityKey(key);

            // SigningCredentials
            var creds = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

            // to create token, it needs claims, expires and signingCredentials
            var token = new JwtSecurityToken(
                issuer: "https://localhost:7299",
                audience: "http://localhost:5183",
                claims: claims,
                expires: DateTime.Now.AddMinutes(60),
                signingCredentials: creds
            );
            return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token) });

        }


        [HttpPost("register")]
        public async Task<IActionResult> RegisterAsync(User user)
        {
            if(string.IsNullOrEmpty(user.Fullname) || string.IsNullOrEmpty(user.Email) || string.IsNullOrEmpty(user.Password))
            {
                return BadRequest("Fullname or Email or Password cannot be null.");
            }

            var existingUser = _context.Users.FirstOrDefault(x => x.Email == user.Email);
            if(existingUser != null)
            {
                return BadRequest(new { message = "Email is already taken." });
            }

            string pattern = @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,4}$";
            if( !Regex.IsMatch(user.Email, pattern))
            {
                return BadRequest(new { message = "Invalid email format" });
            }
            await _context.Users.AddAsync(user);
            var result = await _context.SaveChangesAsync();

            if (result == 0)
            {
                return BadRequest(new { message = "Failed to create" });
            }
            return Ok(new {message = "Create success"});
        }

    }
}
