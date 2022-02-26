using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace K9OCRS.Models
{
    public class CreateUser
    {
        public string First { get; set; }
        public string Last { get; set; }
        public string Email { get; set; }
        public String Password { get; set; }
        public int Role { get; set; }
    }
}
