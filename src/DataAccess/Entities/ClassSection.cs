using System;

namespace DataAccess.Entities
{
    public class ClassSection
    {
        public int ID { get; set; }
        public int ClassTypeID { get; set; }
        public int InstructorID { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int RosterSize { get; set; }
    }
}
