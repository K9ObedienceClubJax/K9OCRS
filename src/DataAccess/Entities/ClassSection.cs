using System;
using System.Collections.Generic;
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
            StartDate = entity.StartDate;
            EndDate = entity.EndDate;
            StartTime = entity.StartTime;
            EndTime = entity.EndTime;
            Status = entity.Status;

            Instructor = entity.Instructor;
            ClassType = entity.ClassType;
            Meetings = entity.Meetings;
        }

        /// <example>1</example>
        [TransactionIgnore]
        public int ID { get; set; }
        /// <example>1</example>
        public int ClassTypeID { get; set; }
        /// <example>16</example>
        public int RosterCapacity { get; set; }
        /// <example>1</example>
        public int InstructorID { get; set; }


        #region Data coming from ClassSectionStatus View

        /// <example>12</example>
        [TransactionIgnore]
        public int RosterActual { get; set; }

        /// <example>2022-01-13 14:00:00.000</example>
        [TransactionIgnore]
        public DateTime StartDate { get; set; }

        /// <example>2022-01-27 16:00:00.000</example>
        [TransactionIgnore]
        public DateTime EndDate { get; set; }

        [TransactionIgnore]
        public TimeSpan StartTime { get; set; }

        [TransactionIgnore]
        public TimeSpan EndTime { get; set; }

        /// <summary>
        ///     The status of the section based on its meetings. One of: Scheduled, Ongoing, Completed.
        /// </summary>
        /// <example>Scheduled</example>
        [TransactionIgnore]
        public string Status { get; set; }

        #endregion

        #region Data optionally Hydrated

        [TransactionIgnore]
        public User Instructor { get; set; }
        [TransactionIgnore]
        public ClassType ClassType { get; set; }
        [TransactionIgnore]
        public List<ClassMeeting> Meetings { get; set; }

        #endregion
    }
}
