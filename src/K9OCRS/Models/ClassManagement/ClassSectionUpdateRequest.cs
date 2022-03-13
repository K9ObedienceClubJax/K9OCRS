using DataAccess.Entities;
using System.Collections.Generic;

namespace K9OCRS.Models.ClassManagement
{
    public class ClassSectionUpdateRequest
    {
        /// <example>1</example>
        public int ID { get; set; }
        /// <example>1</example>
        public int ClassTypeID { get; set; }
        /// <example>16</example>
        public int RosterCapacity { get; set; }
        /// <example>1</example>
        public int InstructorID { get; set; }
        public IEnumerable<int> MeetingIdsToDelete { get; set; }
        public List<ClassMeeting> MeetingsToInsert { get; set; } = new List<ClassMeeting>();
    }
}
