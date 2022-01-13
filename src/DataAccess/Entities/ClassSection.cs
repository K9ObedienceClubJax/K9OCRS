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
            RosterCapacity = entity.RosterCapacity;
            RosterActual = entity.RosterActual;
        }

        /// <example>1</example>
        [TransactionIgnore]
        public int ID { get; set; }
        /// <example>1</example>
        public int ClassTypeID { get; set; }
        /// <example>1</example>
        public int InstructorID { get; set; }
        /// <example>16</example>
        public int RosterCapacity { get; set; }

        /// <summary>
        ///     Actual count of roster spots taken. This is calculated dynamically so it is ignored when creating or updating sections.
        /// </summary>
        /// <example>12</example>
        [TransactionIgnore]
        public int RosterActual { get; set; }
    }
}
