namespace K9OCRS.Models
{
    public class ApplicationsListRequest
    {
        public int? DogID { get; set; }
        public string PaymentMethod { get; set; }

        // Filter by Status
        public bool includePending { get; set; } = true;
        public bool includeActive { get; set; } = true;
        public bool includeCompleted { get; set; } = true;
        public bool includeCancelled { get; set; } = true;
    }
}
