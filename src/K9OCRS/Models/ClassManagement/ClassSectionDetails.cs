using DataAccess.Entities;
using System.Collections.Generic;

namespace K9OCRS.Models.ClassManagement
{
    public class ClassSectionDetails : ClassSectionResult
    {
        public ClassTypeResult ClassType { get; set; }

        // Change the data type to a DTO when available
        public IEnumerable<User> Roster { get; set; }

        public ClassSectionDetails(ClassSection entity) : base(entity) { }
        public ClassSectionDetails(ClassSection entity, IEnumerable<ClassMeeting> meetings) : base(entity, meetings) { }
        public ClassSectionDetails(ClassSection entity, IEnumerable<ClassMeeting> meetings, UserResult instructor) : base(entity, meetings, instructor) { }
        public ClassSectionDetails(ClassSection entity, IEnumerable<ClassMeeting> meetings, UserResult instructor, ClassTypeResult classType)
            : base(entity, meetings, instructor) => ClassType = classType;
        public ClassSectionDetails(ClassSection entity, IEnumerable<ClassMeeting> meetings, UserResult instructor, ClassTypeResult classType, IEnumerable<User> roster)
            : this(entity, meetings, instructor, classType) => Roster = roster;
    }
}
