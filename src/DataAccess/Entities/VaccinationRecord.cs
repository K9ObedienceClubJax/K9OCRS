using System;

namespace DataAccess.Entities
{
    public class VaccinationRecord
    {
        public int DogID { get; set; }
        public string Filename { get; set; }
        public bool Approved { get; set; }
        public DateTime ExpireDate { get; set; }
        public int ReviewedBy { get; set; }
        public DateTime ReviewedDate { get; set; }
    }
}
