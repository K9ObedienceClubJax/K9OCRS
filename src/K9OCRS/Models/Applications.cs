using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace K9OCRS.Models
{
    public class Applications
    {
        public int ID { get; set; }
        public int ClassTypeID { get; set; } = 1;
        public int ClassSectionID { get; set; } = 1;
        public int DogID { get; set; }
        public string Status { get; set; }
        public string PaymentMethod { get; set; }
        public bool isPaid { get; set; } = false;
        public bool isRefunded { get; set; } = false;
    }
}
