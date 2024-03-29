﻿
using DataAccess.Entities;

namespace K9OCRS.Models.Reporting
{
    public class ClassSectionExport : BaseEntity
    {
        public ClassSectionExport(ClassSection s)
        {
            ID = s.ID;
            ClassTypeID = s.ClassTypeID;
            RosterCapacity = s.RosterCapacity;
            InstructorID = s.InstructorID;
            isDraft = s.isDraft;

            ModifiedByID = s.ModifiedByID;
            ModifiedByName = s.ModifiedByName;
            ModifiedDate = s.ModifiedDate;
        }

        /// <example>1</example>
        public int ID { get; set; }
        /// <example>1</example>
        public int ClassTypeID { get; set; }
        /// <example>16</example>
        public int RosterCapacity { get; set; }
        /// <example>1</example>
        public int InstructorID { get; set; }
        public bool isDraft { get; set; }
    }
}
