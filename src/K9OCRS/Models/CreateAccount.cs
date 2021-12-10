using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace K9OCRS.Models
{
    public class CreateAccount
    {
        public String First { get; set; }
        public String Last { get; set; }
        public String Email { get; set; }
        public String Password { get; set; }
        public String Confirm { get; set; }
    }
}
