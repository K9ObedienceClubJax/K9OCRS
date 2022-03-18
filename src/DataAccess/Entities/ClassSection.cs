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
            isDraft = entity.isDraft;
            isSystemOwned = entity.isSystemOwned;

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
        /// <example>false</example>
        public bool isDraft { get; set; }
        /// <example>false</example>
        [TransactionIgnore]
        public bool isSystemOwned { get; set; }


        #region Data coming from ClassSectionStatus View

        /// <example>12</example>
        [TransactionIgnore]
        [ExportIgnore]
        public int RosterActual { get; set; }

        /// <example>2022-01-13 14:00:00.000</example>
        [TransactionIgnore]
        [ExportIgnore]
        public DateTime StartDate { get; set; }

        /// <example>2022-01-27 16:00:00.000</example>
        [TransactionIgnore]
        [ExportIgnore]
        public DateTime EndDate { get; set; }

        [TransactionIgnore]
        [ExportIgnore]
        public TimeSpan StartTime { get; set; }

        [TransactionIgnore]
        [ExportIgnore]
        public TimeSpan EndTime { get; set; }

        /// <summary>
        ///     The status of the section based on its meetings. One of: Scheduled, Ongoing, Completed.
        /// </summary>
        /// <example>Scheduled</example>
        [TransactionIgnore]
        [ExportIgnore]
        public string Status { get; set; }

        #endregion

        #region Data optionally Hydrated

        [TransactionIgnore]
        [ExportIgnore]
        public User Instructor { get; set; }
        [TransactionIgnore]
        [ExportIgnore]
        public ClassType ClassType { get; set; }
        [TransactionIgnore]
        [ExportIgnore]
        public List<ClassMeeting> Meetings { get; set; }

        #endregion
    }
}
