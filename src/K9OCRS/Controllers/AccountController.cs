using DataAccess;
using DataAccess.Clients.Contracts;
using DataAccess.Entities;
using DataAccess.Modules.Contracts;
using K9OCRS.Configuration;
using K9OCRS.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
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
        public AccountController(
            ServiceConstants serviceConstants,
            IStorageClient storageClient,
            IConnectionOwner connectionOwner,
            DbOwner dbOwner)
        {
            this.storageClient = storageClient;
            this.connectionOwner = connectionOwner;
            this.dbOwner = dbOwner;

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
            if(emailResult.Contains(account.Email))
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


    }
}
