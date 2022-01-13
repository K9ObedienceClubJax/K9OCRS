using DataAccess.Entities;
using System;
using System.Collections.Generic;
using System.Linq;

namespace K9OCRS.Models.ClassManagement
{
    public class ClassSectionResult : ClassSection
    {
        public ClassSectionResult(ClassSection entity, IEnumerable<ClassMeeting> meetings) : base(entity)
        {
            Meetings = meetings;
            StartDate = Meetings.Min().StartDate;
            EndDate = Meetings.Max().EndDate;
        }
        public ClassSectionResult(ClassSection entity, IEnumerable<ClassMeeting> meetings, ClassTypeResult classType) : this(entity, meetings) => ClassType = classType;

        public IEnumerable<ClassMeeting> Meetings { get; set; }
        /// <example>2021-12-26T13:00:00</example>
        public DateTime StartDate { get; set; }
        /// <example>2022-02-06T15:00:00</example>
        public DateTime EndDate { get; set; }
    }
}
