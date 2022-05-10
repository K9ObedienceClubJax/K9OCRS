using System.ComponentModel.DataAnnotations;

namespace K9OCRS.Models.Billing
{
    public class PaymentMethodAddRequest
    {
        [Required]
        public string Name { get; set; }
        public string Description { get; set; }
        [Required]
        public string Instructions { get; set; }
        public bool isArchived { get; set; } = false;
    }
}
