using DataAccess;
using DataAccess.Clients.Contracts;
using DataAccess.Entities;
using DataAccess.Modules.Contracts;
using K9OCRS.Configuration;
using K9OCRS.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace K9OCRS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : Controller
    {
        private readonly IStorageClient storageClient;
        private readonly IConnectionOwner connectionOwner;
        private readonly DbOwner dbOwner;
        private readonly ServiceConstants serviceConstants;
        private IConfiguration _config;

        public AccountController(
            ServiceConstants serviceConstants,
            IStorageClient storageClient,
            IConnectionOwner connectionOwner,
            DbOwner dbOwner,
            IConfiguration config)
        {
            this.storageClient = storageClient;
            this.connectionOwner = connectionOwner;
            this.dbOwner = dbOwner;
            _config = config;
            this.serviceConstants = serviceConstants;
        }

        // POST
        [HttpPost]
        public async Task<IActionResult> Account([FromBody] CreateAccount account)
        {
            //Validate names
            var pattern = @"^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$";
            String first = account.First;
            if (Regex.Match(first, pattern).Success)
            {
                Console.WriteLine("First valid");
            }
            String last = account.Last;
            if (Regex.Match(last, pattern).Success)
            {
                Console.WriteLine("Last valid");
            }

            //Validate email
            // TODO: Check if email is in database
            pattern = @"[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+";
            String email = account.Email;
            if (Regex.Match(email, pattern).Success)
            {
                Console.WriteLine("Email valid");
            }
            var emailResult = await connectionOwner.Use(conn =>
            {
                return dbOwner.Users.GetByEmail(conn, account.Email);
            });
            if (emailResult.Contains(account.Email))
            {
                return StatusCode(400, "An account with that email already exists");
            }



            //Validate password
            pattern = @"^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$";
            String password = account.Password;
            String confirm = account.Confirm;
            //Password requires 8 characters, should contain at least one upper case, lower case, and digit.
            if (Regex.Match(password, pattern).Success)
            {
                //Passwords do not match
                if (password != confirm)
                {
                    //Display: Passwords do not match
                    return StatusCode(400, "Passwords do not match");
                    //return StatusCode(400, "User already exists");
                }
            }
            else
            {
                //Display: requirements
                return StatusCode(400, "Password requires at least 8 characters, should contain at least one upper case, lower case, and digit");
            }

            var result = await connectionOwner.Use(conn =>
            {
                User user = new();
                user.UserRoleID = 4;
                user.FirstName = account.First;
                user.LastName = account.Last;
                user.Email = account.Email;
                user.Password = account.Password;
                return dbOwner.Users.Add(conn, user);
            });

            return Ok(result);
        }

        // POST: Login
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] Login login)
        {

            var loginResult = await connectionOwner.Use(conn =>
            {
                return dbOwner.Users.GetIdByLogin(conn, login.Email, login.Password);
            });

            
             
            if (login != null && loginResult != null)
            {
                var userResult = new UserResult(loginResult);
                var token = GenerateToken(login, loginResult);

                HttpContext.Response.Cookies.Append(
                    "k9jwt",
                    token.Result,
                    new CookieOptions
                    {
                        HttpOnly = true
                    });

                return Ok(userResult);

            }

            return Forbid();
        }

        [HttpGet("loginstatus")]
        public async Task<IActionResult> LoginStatus()
        {
            var cookie = Request.Cookies["k9jwt"];
             if (cookie != null)
            {
                JwtSecurityToken token = new JwtSecurityTokenHandler().ReadJwtToken(cookie);
                Console.WriteLine(token.Claims);
                int id = Int32.Parse(token.Claims.First(claim => claim.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid").Value);

                var loginResult = await connectionOwner.Use(conn =>
                {
                    return dbOwner.Users.GetByID(conn, id);
                });

                var userResult = new UserResult(loginResult);

                return Ok(userResult);
            }
            return Ok();
        }


        private async Task<string> GenerateToken(Login login, User loginResult)
        {

            {
                var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
                var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

                var claims = new[]
                {
                new Claim(ClaimTypes.Sid, loginResult.ID + ""),
                new Claim(ClaimTypes.Email, loginResult.Email + ""),
                new Claim(ClaimTypes.Name, loginResult.FirstName + " " + loginResult.LastName),
                new Claim(ClaimTypes.Role, loginResult.UserRoleID + "")
            };

                var token = new JwtSecurityToken(_config["Jwt:Issuer"],
                    _config["Jwt:Audience"],
                    claims,
                    expires: DateTime.Now.AddMinutes(15),
                    signingCredentials: credentials);

                return new JwtSecurityTokenHandler().WriteToken(token);

            }


        }
    }
}
