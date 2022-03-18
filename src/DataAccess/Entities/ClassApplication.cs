using DataAccess.Extensions;
using System;

namespace DataAccess.Entities
{
    public class ClassApplication
    {
        [TransactionIgnore]
        public int ID { get; set; }
        public int ClassTypeID { get; set; } = 1;
        public int ClassSectionID { get; set; } = 1;
        public int DogID { get; set; }
        public string Status { get; set; }
        public string PaymentMethod { get; set; }
        public bool isPaid { get; set; } = false;
        public bool isRefunded { get; set; } = false;
        public int? ReviewedBy { get; set; }
        public DateTime? ReviewedDate { get; set; }
    }
}
