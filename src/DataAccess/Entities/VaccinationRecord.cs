using DataAccess.Extensions;
using System;

namespace DataAccess.Entities
{
    public class VaccinationRecord
    {
        [TransactionIgnore]
        public int DogID { get; set; }
        public string Filename { get; set; }
        public bool Approved { get; set; }
        public DateTime ExpireDate { get; set; }
        [TransactionIgnore]
        public int ReviewedBy { get; set; }
        [TransactionIgnore]
        public DateTime ReviewedDate { get; set; }
    }
}
