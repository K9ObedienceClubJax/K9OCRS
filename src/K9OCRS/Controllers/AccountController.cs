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
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web.Helpers;
using SendGrid;
using SendGrid.Helpers.Mail;

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
            try {
                var emailResult = await connectionOwner.Use(conn =>
                {
                    return dbOwner.Users.GetByEmail(conn, account.Email);
                });
                 if (emailResult.Email.Contains(account.Email))
                {
                    return StatusCode(400, "An account with that email already exists");
                }
            }
            catch (Exception e){

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
                user.Password = GetHashedPassword(account.Password);
                return dbOwner.Users.Add(conn, user);
            });

            return Ok(result);
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] Login login)
        {

            var loginResult = await connectionOwner.Use(conn =>
            {
                return dbOwner.Users.GetIdByLogin(conn, login.Email, GetHashedPassword(login.Password));
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

        [HttpGet("logout")]
        public IActionResult Logout()
        {
            //Delete the cookie
            if (Request.Cookies["k9jwt"] != null)
            {
                HttpContext.Response.Cookies.Delete("k9jwt");
            }
            return Ok();
        }

        [AllowAnonymous]
        [HttpPost("forgotpassword")]
        public async Task<IActionResult> ForgotPassword([FromBody] string email)
        {
            //Write token with account info
            var token = GenerateForgotPasswordToken(email); 
            //Create url with token

            //var callbackUrl = Url.Action("ChangePassword", "Account",
            //new { token = token.Result }, Request.Scheme);

            var callbackUrl = HttpContext.Request.Scheme + "://" + HttpContext.Request.Host + "/Account/ChangePassword?token=" + token.Result;
            //Send email
            var apiKey = Environment.GetEnvironmentVariable("WELOVEDOGS");
            var client = new SendGridClient(apiKey);
            var from = new EmailAddress("ignitechk9@gmail.com", "K9 Obedience Club");
            var subject = "K9 Obedience Club Password Reset";
            var to = new EmailAddress(email, email);
            var plainTextContent = "Use the link to reset your password." + callbackUrl;
            var htmlContent = "Click <a href=" + callbackUrl + "> here</a> to reset your password <br/> If you did not request a password change, ignore this email.";
            var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
            await client.SendEmailAsync(msg);
            return Ok(callbackUrl);
        }

        [AllowAnonymous]
        [HttpPost("changepassword")]
        public async Task<IActionResult> ChangePassword(PasswordReset passwordReset)
        {
            string tokenString = passwordReset.Token;
            JwtSecurityToken token = new JwtSecurityTokenHandler().ReadJwtToken(tokenString);
            string email = token.Claims.First(claim => claim.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress").Value;
            string password = token.Claims.First(claim => claim.Type.Contains("Password")).Value;

            var accountResult = await connectionOwner.Use(conn =>
            {
                return dbOwner.Users.GetIdByLogin(conn, email, password);
            });

            User user = await connectionOwner.Use(conn =>
            {
                return dbOwner.Users.GetByID(conn, accountResult.ID);
            });

            if (accountResult.Email != null)
            {
                var tasks = new List<Task>();
                tasks.Add(connectionOwner.UseTransaction(async (conn, tr) =>
                {
                    user.Password = GetHashedPassword(passwordReset.Password);
                    await dbOwner.Users.Update(conn, tr, user);
                    tr.Commit();
                }));

                await Task.WhenAll(tasks);
            }
            //Create another controller that uses Request.QueryString to read token. If valid, load page, reset password.
            return Ok();
        }


        private async Task<string> GenerateToken(Login login, User loginResult)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            {
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

        private async Task<string> GenerateForgotPasswordToken(string email)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            {
                var accountResult = await connectionOwner.Use(conn =>
                {
                    return dbOwner.Users.GetByEmail(conn, email);
                });

                var claims = new[]
                {
                    new Claim(ClaimTypes.Sid, accountResult.ID + ""),
                  new Claim(ClaimTypes.Email, email + ""),
                  new Claim(type: "Password", accountResult.Password)
                };

                var token = new JwtSecurityToken(_config["Jwt:Issuer"],
                    _config["Jwt:Audience"],
                    claims,
                    expires: DateTime.Now.AddMinutes(15),
                    signingCredentials: credentials);

                return new JwtSecurityTokenHandler().WriteToken(token);
            }

        }

        public static string GetHashedPassword(string password)
        {
            var encryptor = SHA256.Create();

            byte[] passBytes = Encoding.ASCII.GetBytes(password);
            byte[] hashBytes = encryptor.ComputeHash(passBytes);
            string hashedPassword = Convert.ToBase64String(hashBytes);

            return hashedPassword;
        }
    }
}
