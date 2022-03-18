using DataAccess.Entities;
using System.Collections.Generic;

namespace K9OCRS.Models.ClassManagement
{
    public class ClassSectionAddRequest
    {
        /// <example>1</example>
        public int ClassTypeID { get; set; }
        /// <example>16</example>
        public int RosterCapacity { get; set; }
        /// <example>1</example>
        public int InstructorID { get; set; }
        public List<ClassMeeting> Meetings { get; set; }
        public bool isDraft { get; set; } = false;
    }
}
