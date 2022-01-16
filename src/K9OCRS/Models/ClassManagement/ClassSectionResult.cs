using DataAccess.Entities;
using System;
using System.Collections.Generic;
using System.Linq;

namespace K9OCRS.Models.ClassManagement
{
    public class ClassSectionResult : ClassSection
    {
        public IEnumerable<ClassMeeting> Meetings { get; set; }

        /// <example>2021-12-26T13:00:00</example>
        public DateTime StartDate { get; set; }

        /// <example>2022-02-06T15:00:00</example>
        public DateTime EndDate { get; set; }
        // Change the data type to a DTO when available
        public User Instructor { get; set; }

        public ClassSectionResult(ClassSection entity) : base(entity) { }
        public ClassSectionResult(ClassSection entity, IEnumerable<ClassMeeting> meetings) : base(entity)
        {
            Meetings = meetings;
            StartDate = Meetings.Min().StartDate;
            EndDate = Meetings.Max().EndDate;
        }
        public ClassSectionResult(ClassSection entity, IEnumerable<ClassMeeting> meetings, User instructor) : this(entity, meetings) => Instructor = instructor;
    }
}
