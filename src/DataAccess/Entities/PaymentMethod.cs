namespace DataAccess.Entities
{
    public class PaymentMethod : BaseEntity
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Instructions { get; set; }
        public bool isIntegration { get; set; }
        public bool isArchived { get; set; }

        public PaymentMethod() { }
        public PaymentMethod(PaymentMethod e)
        {
            ID = e.ID;
            Name = e.Name;
            Description = e.Description;
            Instructions = e.Instructions;
            isIntegration = e.isIntegration;
            isArchived = e.isArchived;
        }
    }
}
