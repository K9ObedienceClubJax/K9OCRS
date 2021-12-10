using K9OCRS.Models;
using Microsoft.AspNetCore.Mvc;
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
        // POST
        [HttpPost]
        public IActionResult Account([FromBody] CreateAccount account)
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

            //Validate password
            pattern = @"^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$";
            String password = account.Password;
            String confirm = account.Confirm;
            //Password requires 8 characters, should contain at least one upper case, lower case, and digit. 
            if (Regex.Match(password, pattern).Success)
            {
                //Passwords do not match
                if(password != confirm)
                {
                    //Display: Passwords do not match
                    return StatusCode(400, "Passwords do not match");
                }
            }
            else
            {
                //Display: requirements
                return StatusCode(400, "Password requires at least 8 characters, should contain at least one upper case, lower case, and digit");
            }


            return Ok(account.First + " " + account.Last + " " + account.Email + " " + account.Password);
        }

    }
}
