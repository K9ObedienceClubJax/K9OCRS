using System.Collections.Generic;

namespace K9OCRS.Models
{
    public class ApplicationsListRequest
    {
        public IEnumerable<int> ClassTypeIDs { get;   set; }
        public IEnumerable<int> DogIDs { get; set; }
        public IEnumerable<int> PaymentMethodIDs { get; set; }

        // Filter by Payment Status
        public bool includePaid { get; set; } = true;
        public bool includeRefunded { get; set; } = true;

        // Filter by Status
        public bool includePending { get; set; } = true;
        public bool includeActive { get; set; } = false;
        public bool includeCompleted { get; set; } = false;
        public bool includeCancelled { get; set; } = false;
    }
}
