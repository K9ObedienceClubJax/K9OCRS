using DataAccess.Entities;
using System;
using System.Collections.Generic;
using System.Linq;

namespace K9OCRS.Models.ClassManagement
{
    public class ClassSectionResult : ClassSection
    {
        public IEnumerable<ClassMeeting> Meetings { get; set; }
        // Change the data type to a DTO when available
        public User Instructor { get; set; }

        public ClassSectionResult(ClassSection entity) : base(entity) { }
        public ClassSectionResult(ClassSection entity, IEnumerable<ClassMeeting> meetings) : base(entity) => Meetings = meetings;
        public ClassSectionResult(ClassSection entity, IEnumerable<ClassMeeting> meetings, User instructor) : this(entity, meetings) => Instructor = instructor;
    }
}
