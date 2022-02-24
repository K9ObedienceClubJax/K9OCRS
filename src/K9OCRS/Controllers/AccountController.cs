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

            if (await ValidateEmailPassword(account.Email, account.Password))
            {
                //Validate password
                String password = account.Password;
                String confirm = account.Confirm;

                //Passwords do not match
                if (password != confirm)
                {
                    //Display: Passwords do not match
                    return StatusCode(400, "Passwords do not match");
                    //return StatusCode(400, "User already exists");
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
            return StatusCode(400, "Failed to create account.");

               
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

            return StatusCode(400, "That account does not exist. Did you put in the wrong email or password?");
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
            //Check if email is in database
            var accountResult = await connectionOwner.Use(conn =>
            {
                return dbOwner.Users.GetByEmail(conn, email);
            });
            if(accountResult == null)
            {
                return StatusCode(400, "Email does not exist");
            }

            //Write token with account info
            var token = GenerateForgotPasswordToken(email, accountResult); 

            //Create url with token
            var callbackUrl = HttpContext.Request.Scheme + "://" + HttpContext.Request.Host + "/Account/ChangePassword?token=" + token.Result;

            //Send email
            var apiKey = Environment.GetEnvironmentVariable("SENDGRID_KEY");
            var client = new SendGridClient(apiKey);
            var from = new EmailAddress("ignitechk9@gmail.com", "K9 Obedience Club");
            var subject = "K9 Obedience Club Password Reset";
            var to = new EmailAddress(email, email);
            var plainTextContent = "Use the link to reset your password." + callbackUrl;
            var htmlContent = "Click <a href=" + callbackUrl + "> here</a> to reset your password <br/> If you did not request a password change, ignore this email.";
            var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
            await client.SendEmailAsync(msg);
            return Ok("Email sent");
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
            return Ok();
        }

        [HttpPost("changeinfo")]
        public async Task<IActionResult> ChangeInfo([FromBody] User newInfo)
        {
            User user = await connectionOwner.Use(conn =>
            {
                return dbOwner.Users.GetByID(conn, newInfo.ID);
            });
            user.Email = newInfo.Email;
            user.FirstName = newInfo.FirstName;
            user.LastName = newInfo.LastName;

            var tasks = new List<Task>();
            tasks.Add(connectionOwner.UseTransaction(async (conn, tr) =>
            {
                await dbOwner.Users.Update(conn, tr, user);
                tr.Commit();
            }));

            await Task.WhenAll(tasks);
            return Ok();
        }

        [HttpPost("changeinfoadmin")]
        public async Task<IActionResult> ChangeInfoAdmin([FromBody] User newInfo)
        {
            User user = await connectionOwner.Use(conn =>
            {
                return dbOwner.Users.GetByID(conn, newInfo.ID);
            });
            user.Email = newInfo.Email;
            user.FirstName = newInfo.FirstName;
            user.LastName = newInfo.LastName;
            user.UserRoleID = newInfo.UserRoleID;
            user.ProfilePictureFilename = newInfo.ProfilePictureFilename;

            var tasks = new List<Task>();
            tasks.Add(connectionOwner.UseTransaction(async (conn, tr) =>
            {
                await dbOwner.Users.Update(conn, tr, user);
                tr.Commit();
            }));

            await Task.WhenAll(tasks);
            return Ok();
        }

        [HttpPost("createuser")] 
        public async Task<IActionResult> CreateUser([FromBody] CreateUser accountInfo)
        {
            if(await ValidateEmailPassword(accountInfo.Email, accountInfo.Password))
            {
                var result = await connectionOwner.Use(conn =>
                {
                    User user = new();
                    user.FirstName = accountInfo.First;
                    user.LastName = accountInfo.Last;
                    user.Email = accountInfo.Email;
                    user.Password = GetHashedPassword(accountInfo.Password);
                    user.UserRoleID = accountInfo.Role;
                    return dbOwner.Users.Add(conn, user);
                });
                return Ok("Account added");
            }
            return StatusCode(400, "Failed to create user");
        }

        [HttpPost("getuser")]
        public async Task<IActionResult> GetUser([FromBody] int id)
        {
            User user = await connectionOwner.Use(conn =>
            {
                return dbOwner.Users.GetByID(conn, id);
            });
            UserResult userResult = new UserResult(user);

            return Ok(userResult);
        }

        [HttpPost("queryusers")]
        [ProducesResponseType(typeof(IEnumerable<UserResult>), 200)]
        public async Task<IActionResult> QueryUsers([FromBody] int role)
        {
            IEnumerable<User> users;  
            if(role == 0)
            {
                users = await connectionOwner.Use(conn =>
                {
                    return dbOwner.Users.GetAll(conn);
                });
            }
            else
            {
                users = await connectionOwner.Use(conn =>
                {
                    return dbOwner.Users.QueryUsersByRole(conn, role);
                });
            }
            
            var userResults = users.Select(u => new UserResult(u, serviceConstants.storageBasePath));
            
            return Ok(userResults);
        }


        //Non-API functions
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

        private async Task<string> GenerateForgotPasswordToken(string email, User accountResult)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            {

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

        public async Task<bool> ValidateEmailPassword(string email, string password)
        {
            //Validate email
            var pattern = @"[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+";

            if (Regex.Match(email, pattern).Success)
            {
                Console.WriteLine("Email valid");
            }
            else
            {
                return false;
            }
            try
            {
                var emailResult = await connectionOwner.Use(conn =>
                {
                    return dbOwner.Users.GetByEmail(conn, email);
                });
                if (emailResult.Email.Contains(email))
                {
                    return false;
                }
            }
            catch (Exception e)
            {

            }


            //Validate password
            pattern = @"^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$";
   
            //Password requires 8 characters, should contain at least one upper case, lower case, and digit.
            if (Regex.Match(password, pattern).Success)
            {
                return true;
            }
            else
            {
                //Display: requirements
                return false;
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
