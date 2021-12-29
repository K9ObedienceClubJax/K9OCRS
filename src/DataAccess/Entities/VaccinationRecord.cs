using DataAccess.Extensions;
using System;

namespace DataAccess.Entities
{
    public class VaccinationRecord
    {
        public VaccinationRecord() { }
        public VaccinationRecord(VaccinationRecord entity)
        {
            DogID = entity.DogID;
            Filename = entity.Filename;
            Approved = entity.Approved;
            ExpireDate = entity.ExpireDate;
            ReviewedBy = entity.ReviewedBy;
            ReviewedDate = entity.ReviewedDate;
        }

        [TransactionIgnore]
        public int DogID { get; set; }
        public string Filename { get; set; }
        public bool Approved { get; set; }
        public DateTime ExpireDate { get; set; }
        public int ReviewedBy { get; set; }
        public DateTime ReviewedDate { get; set; }
    }
}
