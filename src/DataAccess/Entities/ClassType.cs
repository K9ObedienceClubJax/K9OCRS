using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Entities
{
    public class ClassType
    {
        public int ID { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string SessionLength { get; set; }
        public decimal Price { get; set; }
    }
}
