using DataAccess.Entities;
using K9OCRS.Models.DogManagement;
using K9OCRS.Utils.Extensions;

namespace K9OCRS.Models.ApplicationsManagement
{
    public class RosterEntry
    {
        public int ApplicationID { get; set; }
        public int ClassTypeID { get; set; } = 1;
        public int ClassSectionID { get; set; } = 1;
        public string ApplicationStatus { get; set; } // One of [Pending, Active, Completed, Cancelled]
        public string MainAttendee { get; set; }
        public string AdditionalAttendees { get; set; }
        public string PaymentMethodName { get; set; }
        public bool isPaid { get; set; } = false;
        public bool isRefunded { get; set; } = false;

        public DogResult Dog { get; set; }

        public RosterEntry(ClassApplication ca, string storageBasePath)
        {
            ApplicationID = ca.ID;
            ClassTypeID = ca.ClassTypeID;
            ClassSectionID = ca.ClassSectionID;
            ApplicationStatus = ca.Status;
            MainAttendee = ca.MainAttendee;
            AdditionalAttendees = ca.AdditionalAttendees;
            PaymentMethodName = ca.PaymentMethodName;
            isPaid = ca.isPaid;
            isRefunded = ca.isRefunded;

            Dog = ca.Dog.ToDogResult(storageBasePath);
        }

    }
}
