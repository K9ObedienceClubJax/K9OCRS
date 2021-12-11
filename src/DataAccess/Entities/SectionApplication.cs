using System;

namespace DataAccess.Entities
{
    public class SectionApplication
    {
        public int ID { get; set; }
        public int ClassSectionID { get; set; }
        public int DogID { get; set; }
        public string Status { get; set; }
        public bool Approved { get; set; }
        public bool Refunded { get; set; }
        public int ReviewedBy { get; set; }
        public DateTime ReviewedDate { get; set; }
    }
}
