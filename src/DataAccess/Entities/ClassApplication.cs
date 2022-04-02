using DataAccess.Extensions;
using System;

namespace DataAccess.Entities
{
    public class ClassApplication : BaseEntity
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

        public ClassApplication() { }
        public ClassApplication(ClassApplication entity)
        {
            ID = entity.ID;
            ClassTypeID = entity.ClassTypeID;
            ClassSectionID = entity.ClassSectionID;
            DogID = entity.DogID;
            Status = entity.Status;
            PaymentMethod = entity.PaymentMethod;
            isPaid = entity.isPaid;
            isRefunded = entity.isRefunded;
            ReviewedBy = entity.ReviewedBy;
            ReviewedDate = entity.ReviewedDate;
            ModifiedByID = entity.ModifiedByID;
            ModifiedByName = entity.ModifiedByName;
            ModifiedDate = entity.ModifiedDate;
        }
    }
}
