using DataAccess;
using DataAccess.Clients.Contracts;
using DataAccess.Constants;
using DataAccess.Entities;
using DataAccess.Modules.Contracts;
using K9OCRS.Models;
using K9OCRS.Utils.Constants;
using K9OCRS.Utils.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SendGrid;
using SendGrid.Helpers.Mail;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace K9OCRS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
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
        [AllowAnonymous]
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


                var result = await connectionOwner.Use(conn => {
                    User user = new User
                    {
                        UserRoleID = (int)UserRoles.Student,
                        FirstName = account.First,
                        LastName = account.Last,
                        Email = account.Email,
                        Password = GetHashedPassword(account.Password),
                    };

                    return dbOwner.Users.Add(conn, user);
                });

                return Ok(result);
            }
            return StatusCode(400, "Failed to create account.");


        }

        [HttpPost("login")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(IEnumerable<UserResult>), 200)]
        public async Task<IActionResult> Login([FromBody] Login login)
        {

            var loginResult = await connectionOwner.Use(conn => {
                return dbOwner.Users.GetIdByLogin(conn, login.Email, GetHashedPassword(login.Password));
            });



            if (login != null && loginResult != null)
            {
                var userResult = new UserResult(loginResult, serviceConstants.storageBasePath);
                var token = GenerateToken(login, loginResult);

                HttpContext.Response.Cookies.Append(
                    _config["Jwt:CookieName"],
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
        [AllowAnonymous]
        public async Task<IActionResult> LoginStatus()
        {
            var cookie = Request.Cookies[_config["Jwt:CookieName"]];
            if (!String.IsNullOrEmpty(cookie))
            {
                try
                {
                    JwtSecurityToken token = new JwtSecurityTokenHandler().ReadJwtToken(cookie);
                    int id = Int32.Parse(token.Claims.First(claim => claim.Type == ClaimTypes.NameIdentifier).Value);

                    var loginResult = await connectionOwner.Use(conn => {
                        return dbOwner.Users.GetByID(conn, id);
                    });

                    var userResult = new UserResult(loginResult, serviceConstants.storageBasePath);

                    return Ok(userResult);
                }
                catch (Exception ex)
                {
                    if (ex is KeyNotFoundException)
                    {
                        return Logout();
                    }
                    else
                    {
                        throw;
                    }
                }
            }
            return Ok();
        }

        [HttpGet("logout")]
        public IActionResult Logout()
        {
            //Delete the cookie
            if (Request.Cookies[_config["Jwt:CookieName"]] != null)
            {
                HttpContext.Response.Cookies.Delete(_config["Jwt:CookieName"]);
            }
            return Ok();
        }

        [HttpPost("forgotpassword")]
        [AllowAnonymous]
        public async Task<IActionResult> ForgotPassword([FromBody] string email)
        {
            //Check if email is in database
            var accountResult = await connectionOwner.Use(conn => {
                return dbOwner.Users.GetByEmail(conn, email);
            });
            if (accountResult == null)
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

        [HttpPost("changepassword")]
        [AllowAnonymous]
        public async Task<IActionResult> ChangePassword(PasswordReset passwordReset)
        {
            string tokenString = passwordReset.Token;
            JwtSecurityToken token = new JwtSecurityTokenHandler().ReadJwtToken(tokenString);
            string email = token.Claims.First(claim => claim.Type == ClaimTypes.Email).Value;
            // TODO: This is a security issue, find another way to do the password change
            string password = token.Claims.First(claim => claim.Type.Contains("Password")).Value;

            var accountResult = await connectionOwner.Use(conn => {
                return dbOwner.Users.GetIdByLogin(conn, email, password);
            });

            User user = await connectionOwner.Use(conn => {
                return dbOwner.Users.GetByID(conn, accountResult.ID);
            });

            if (accountResult.Email != null)
            {
                var tasks = new List<Task>();
                tasks.Add(connectionOwner.UseTransaction(async (conn, tr) => {
                    user.Password = GetHashedPassword(passwordReset.Password);
                    await dbOwner.Users.Update(conn, tr, user);
                    tr.Commit();
                }));

                await Task.WhenAll(tasks);
            }
            return Ok();
        }

        [HttpPut("changeinfo")]
        [ProducesResponseType(typeof(int), 200)]
        public async Task<IActionResult> ChangeInfo([FromForm] ChangeUserInfoRequest request)
        {
            User user = await connectionOwner.Use(conn => {
                return dbOwner.Users.GetByID(conn, request.ID);
            });
            user.Email = request.Email;
            user.FirstName = request.FirstName;
            user.LastName = request.LastName;
            var tasks = new List<Task>();
            tasks.Add(connectionOwner.UseTransaction(async (conn, tr) => {
                await dbOwner.Users.Update(conn, tr, user);
                tr.Commit();
            }));

            if (request.ImageUpdate != null)
            {
                await UpdateImage(request.ID, new FileUpload
                {
                    Files = new List<IFormFile> { request.ImageUpdate },
                });
            }

            await Task.WhenAll(tasks);
            return Ok();
        }

        [HttpPut("changeinfoadmin")]
        [ProducesResponseType(typeof(int), 200)]
        public async Task<IActionResult> ChangeInfoAdmin([FromForm] ChangeUserInfoRequest request)
        {
            User user = await connectionOwner.Use(conn => {
                return dbOwner.Users.GetByID(conn, request.ID);
            });
            user.Email = request.Email;
            user.FirstName = request.FirstName;
            user.LastName = request.LastName;
            user.UserRoleID = request.UserRoleID;
            var tasks = new List<Task>();
            tasks.Add(connectionOwner.UseTransaction(async (conn, tr) => {
                await dbOwner.Users.Update(conn, tr, user);
                tr.Commit();
            }));

            if (request.ImageUpdate != null)
            {
                await UpdateImage(request.ID, new FileUpload
                {
                    Files = new List<IFormFile> { request.ImageUpdate },
                });
            }

            await Task.WhenAll(tasks);
            return Ok();
        }

        [HttpPut("createuser")]
        [ProducesResponseType(typeof(int), 200)]
        public async Task<IActionResult> CreateUser([FromForm] ChangeUserInfoRequest request)
        {
            if (await ValidateEmailPassword(request.Email, request.Password))
            {
                var result = await connectionOwner.Use(conn => {
                    User user = new();
                    user.FirstName = request.FirstName;
                    user.LastName = request.LastName;
                    user.Email = request.Email;
                    user.Password = GetHashedPassword(request.Password);
                    user.UserRoleID = request.UserRoleID;
                    return dbOwner.Users.Add(conn, user);
                });

                if (request.ImageUpdate != null)
                {
                    await UpdateImage(result.ID, new FileUpload
                    {
                        Files = new List<IFormFile> { request.ImageUpdate },
                    });
                }

                return Ok("Account added");
            }
            return StatusCode(400, "Failed to create user");
        }

        [HttpPost("getuser")]
        public async Task<IActionResult> GetUser([FromBody] int id)
        {
            User user = await connectionOwner.Use(conn => {
                return dbOwner.Users.GetByID(conn, id);
            });
            UserResult userResult = new UserResult(user, serviceConstants.storageBasePath);

            return Ok(userResult);
        }

        [HttpPost("queryusers")]
        [Authorize(Roles = nameof(UserRoles.Admin))]
        [ProducesResponseType(typeof(IEnumerable<UserResult>), 200)]
        public async Task<IActionResult> QueryUsers([FromBody] int role)
        {
            IEnumerable<User> users;
            if (role == 0)
            {
                users = await connectionOwner.Use(conn => {
                    return dbOwner.Users.GetAll(conn);
                });
            }
            else
            {
                users = await connectionOwner.Use(conn => {
                    return dbOwner.Users.QueryUsersByRole(conn, role);
                });
            }

            var userResults = users.Select(u => new UserResult(u, serviceConstants.storageBasePath));

            return Ok(userResults);
        }

        [HttpGet("options")]
        [Authorize(Roles = nameof(UserRoles.Admin))]
        [ProducesResponseType(typeof(IEnumerable<UserResult>), 200)]
        public async Task<IActionResult> GetInstructorOptions()
        {
            var users = await connectionOwner.Use(conn => dbOwner.Users.GetInstructorOptions(conn));
            var userResults = users.Select(u => new UserResult(u, serviceConstants.storageBasePath));
            return Ok(userResults);
        }


        //Non-API functions
        private async Task<string> GenerateToken(Login login, User loginResult)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(serviceConstants.jwtKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var userRole = Enum.GetName(typeof(UserRoles), loginResult.UserRoleID);

            var claims = new[]
            {
            new Claim(ClaimTypes.NameIdentifier, loginResult.ID.ToString()),
            new Claim(ClaimTypes.Email, loginResult.Email),
            new Claim(ClaimTypes.Name, $"{loginResult.FirstName} {loginResult.LastName}"),
            new Claim(ClaimTypes.Role, userRole)
            };

            var token = new JwtSecurityToken(_config["Jwt:Issuer"],
                _config["Jwt:Audience"],
                claims,
                expires: DateTime.Now.AddDays(7),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private async Task<string> GenerateForgotPasswordToken(string email, User accountResult)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(serviceConstants.jwtKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            {

                var claims = new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, accountResult.ID + ""),
                    new Claim(ClaimTypes.Email, email + ""),
                    // TODO: This is a security issue, find another way to do the password change
                    new Claim(type: "Password", accountResult.Password)
                };

                var token = new JwtSecurityToken(_config["Jwt:Issuer"],
                    _config["Jwt:Audience"],
                    claims,
                    expires: DateTime.Now.AddMinutes(30),
                    signingCredentials: credentials);

                return new JwtSecurityTokenHandler().WriteToken(token);
            }

        }

        private async Task<bool> ValidateEmailPassword(string email, string password)
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
                var emailResult = await connectionOwner.Use(conn => {
                    return dbOwner.Users.GetByEmail(conn, email);
                });
                if (emailResult != null)
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

        private static string GetHashedPassword(string password)
        {
            var encryptor = SHA256.Create();

            byte[] passBytes = Encoding.ASCII.GetBytes(password);
            byte[] hashBytes = encryptor.ComputeHash(passBytes);
            string hashedPassword = Convert.ToBase64String(hashBytes);

            return hashedPassword;
        }

        private async Task<int> UpdateImage(int id, FileUpload upload)
        {
            if (upload.Files != null && upload.Files.Count > 0)
            {
                var data = await upload.Files[0].ToBinaryData();

                var filePath = String.Concat(id.ToString(), "/", id, Path.GetExtension(upload.Files[0].FileName));
                var filename = Path.GetFileName(filePath);

                await storageClient.UploadFile(UploadType.ProfilePicture, filePath, upload.Files[0].ContentType, data);

                return await connectionOwner.Use(conn => {
                    return dbOwner.Users.UpdateProfilePicture(conn, id, filename);
                });
            }

            throw new ArgumentException();
        }

    }
}
