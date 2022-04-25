using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace K9OCRS.Models
{
    public class PasswordResetRequest
    {
        public string Email { get; set; }
        public bool Send { get; set; }
    }
}
