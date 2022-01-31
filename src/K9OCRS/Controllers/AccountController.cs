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
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web.Helpers;

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
                var token = GenerateToken(login, loginResult);

                HttpContext.Response.Cookies.Append(
                    "jwt",
                    token.Result,
                    new CookieOptions
                    {
                        HttpOnly = true
                    });

                return Ok("ID:" + loginResult.ElementAt(0).ID + " Name: " + loginResult.ElementAt(0).FirstName + " " + loginResult.ElementAt(0).LastName + " RoleID: " + loginResult.ElementAt(0).UserRoleID);

            }

            return Ok(login.Email + " " + login.Password);
        }

        //[Authorize]
        //[HttpGet("userinfo")]
        //public IActionResult UserInfo()
        //{
        //    var identity = HttpContext.User.Identity as ClaimsIdentity;

        //    if (identity != null)
        //    {
        //        var userClaims = identity.Claims;

        //        return Ok(userClaims.FirstOrDefault(o => o.Type == ClaimTypes.Sid)?.Value + userClaims.FirstOrDefault(o => o.Type == ClaimTypes.Role)?.Value);
        //    }


        //    return null;
        //}

        private async Task<string> GenerateToken(Login login, IEnumerable<User> loginResult)
        {

            {
                var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
                var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

                var claims = new[]
                {
                new Claim(ClaimTypes.Sid, loginResult.ElementAt(0).ID + ""),
                new Claim(ClaimTypes.Role, loginResult.ElementAt(0).UserRoleID + "")
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
