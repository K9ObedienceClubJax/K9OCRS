using System;

namespace K9OCRS.Models.DogManagement
{
    public class VaccinationRecordReview
    {
        public int ID { get; set; }
        public bool Approved { get; set; }
        public DateTime ExpireDate { get; set; }
    }
}
