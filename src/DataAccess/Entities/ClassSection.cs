using DataAccess.Extensions;

namespace DataAccess.Entities
{
    public class ClassSection
    {
        public ClassSection() { }
        public ClassSection(ClassSection entity)
        {
            ID = entity.ID;
            ClassTypeID = entity.ClassTypeID;
            InstructorID = entity.InstructorID;
            RosterSize = entity.RosterSize;
        }

        [TransactionIgnore]
        public int ID { get; set; }
        public int ClassTypeID { get; set; }
        public int InstructorID { get; set; }
        public int RosterSize { get; set; }
    }
}
