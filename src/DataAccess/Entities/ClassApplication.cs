﻿using DataAccess.Extensions;
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
        public string Status { get; set; } // One of [Pending, Active, Completed, Cancelled]
        public string MainAttendee { get; set; }
        public string AdditionalAttendees { get; set; }
        public int PaymentMethodID { get; set; }
        public bool isPaid { get; set; } = false;
        public bool isRefunded { get; set; } = false;
        public int? ReviewedBy { get; set; }
        public DateTime? ReviewedDate { get; set; }

        #region Data optionally Hydrated

        [TransactionIgnore]
        [ExportIgnore]
        public string ClassTypeTitle { get; set; }
        [TransactionIgnore]
        [ExportIgnore]
        public string DogName { get ; set; }
        [TransactionIgnore]
        [ExportIgnore]
        public string DogProfilePictureFilename { get; set; }
        [TransactionIgnore]
        [ExportIgnore]
        public string DogProfilePictureUrl { get; set; }
        [TransactionIgnore]
        [ExportIgnore]
        public string PaymentMethodName { get; set; }

        [TransactionIgnore]
        [ExportIgnore]
        public Dog Dog { get; set; }

        #endregion

        public ClassApplication() { }
        public ClassApplication(ClassApplication entity)
        {
            ID = entity.ID;
            ClassTypeID = entity.ClassTypeID;
            ClassSectionID = entity.ClassSectionID;
            DogID = entity.DogID;
            Status = entity.Status;
            MainAttendee = entity.MainAttendee;
            AdditionalAttendees = entity.AdditionalAttendees;
            PaymentMethodID = entity.PaymentMethodID;
            isPaid = entity.isPaid;
            isRefunded = entity.isRefunded;
            ReviewedBy = entity.ReviewedBy;
            ReviewedDate = entity.ReviewedDate;

            ClassTypeTitle = entity.ClassTypeTitle;
            DogName = entity.DogName;
            DogProfilePictureFilename = entity.DogProfilePictureFilename;
            DogProfilePictureUrl = entity.DogProfilePictureUrl;
            PaymentMethodName = entity.PaymentMethodName;

            ModifiedByID = entity.ModifiedByID;
            ModifiedByName = entity.ModifiedByName;
            ModifiedDate = entity.ModifiedDate;
        }
    }
}
