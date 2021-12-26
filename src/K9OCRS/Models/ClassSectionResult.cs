using DataAccess.Entities;
using System;
using System.Collections.Generic;
using System.Linq;

namespace K9OCRS.Models
{
    public class ClassSectionResult : ClassSection
    {
        public ClassSectionResult(ClassSection entity, IEnumerable<ClassMeeting> meetings) : base(entity)
        {
            Meetings = meetings;
            StartDate = Meetings.Min().Date;
            EndDate = Meetings.Max().Date;
        }
        public ClassSectionResult(ClassSection entity, IEnumerable<ClassMeeting> meetings, ClassTypeResult classType) : this(entity, meetings) => ClassType = classType;

        public IEnumerable<ClassMeeting> Meetings { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public ClassTypeResult ClassType { get; set; }
    }
}
