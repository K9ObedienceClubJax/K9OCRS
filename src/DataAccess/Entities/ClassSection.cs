using DataAccess.Extensions;
using System;

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
            StartDate = entity.StartDate;
            EndDate = entity.EndDate;
            Status = entity.Status;
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
        ///     Actual count of roster spots taken.
        ///     This is calculated dynamically in a view so it is ignored when creating or updating sections.
        /// </summary>
        /// <example>12</example>
        [TransactionIgnore]
        public int RosterActual { get; set; }
        /// <summary>
        ///     Section start date based on its meetings.
        ///     This is calculated dynamically in a view so it is ignored when creating or updating sections.
        /// </summary>
        /// <example>2022-01-13 14:00:00.000</example>
        [TransactionIgnore]
        public DateTime StartDate { get; set; }
        /// <summary>
        ///     Section end date based on its meetings.
        ///     This is calculated dynamically in a view so it is ignored when creating or updating sections.
        /// </summary>
        /// <example>2022-01-27 16:00:00.000</example>
        [TransactionIgnore]
        public DateTime EndDate { get; set; }
        /// <summary>
        ///     The status of the section based on its meetings.
        ///     This is calculated dynamically in a view so it is ignored when creating or updating sections.
        /// </summary>
        /// <example>Scheduled</example>
        [TransactionIgnore]
        public string Status { get; set; }
    }
}
