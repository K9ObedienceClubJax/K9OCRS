
using DataAccess.Entities;

namespace K9OCRS.Models.Reporting
{
    public class ClassSectionExport
    {
        public ClassSectionExport(ClassSection s)
        {
            ID = s.ID;
            ClassTypeID = s.ClassTypeID;
            RosterCapacity = s.RosterCapacity;
            InstructorID = s.InstructorID;
        }

        /// <example>1</example>
        public int ID { get; set; }
        /// <example>1</example>
        public int ClassTypeID { get; set; }
        /// <example>16</example>
        public int RosterCapacity { get; set; }
        /// <example>1</example>
        public int InstructorID { get; set; }
    }
}
