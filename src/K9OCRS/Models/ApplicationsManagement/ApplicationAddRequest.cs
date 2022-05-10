using System.ComponentModel.DataAnnotations;

namespace K9OCRS.Models.ApplicationsManagement
{
    public class ApplicationAddRequest
    {
        [Required]
        public int ClassTypeID { get; set; } = 1;
        [Required]
        public int ClassSectionID { get; set; } = 1;
        [Required]
        public int DogID { get; set; }
        public string Status { get; set; } = "Pending"; // One of [Pending, Active, Completed, Cancelled]
        [Required]
        public string MainAttendee { get; set; }
        public string AdditionalAttendees { get; set; }
        [Required]
        public int PaymentMethodID { get; set; }
        public bool isPaid { get; set; } = false;
    }
}
