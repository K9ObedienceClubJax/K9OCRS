using K9OCRS.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Helpers;

namespace K9OCRS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PasswordResetController : Controller
    {
        [HttpPost]
        public IActionResult PasswordReset([FromBody] PasswordReset passwordReset)
        {
            try
            {
                // Initialize WebMail helper
                WebMail.SmtpServer = "smtp.sendgrid.net";
                WebMail.SmtpPort = 25;
                WebMail.UserName = "apikey";
                WebMail.Password = "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";
                WebMail.From = "n01384687@unf.edu";

                // Send email
                WebMail.Send(to: passwordReset.Email,
                    subject: "K9 Obedience Club Password Reset - ",
                    body: "Follow the link to reset your password"
                );
            }
            catch (Exception ex)
            {

            }
            return Redirect("/account/passwordreset");
        }
    }
}
