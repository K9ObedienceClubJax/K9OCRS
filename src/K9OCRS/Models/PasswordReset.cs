using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace K9OCRS.Models
{
    public class PasswordReset
    {
        public string Token { get; set; }
        public string Password { get; set; }
    }
}
