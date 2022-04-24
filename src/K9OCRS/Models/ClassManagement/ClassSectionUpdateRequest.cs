using DataAccess.Entities;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace K9OCRS.Models.ClassManagement
{
    public class ClassSectionUpdateRequest
    {
        /// <example>1</example>
        [Required]
        public int ID { get; set; }
        /// <example>1</example>
        [Required]
        public int ClassTypeID { get; set; }
        /// <example>16</example>
        [Required]
        public int RosterCapacity { get; set; }
        /// <example>1</example>
        [Required]
        public int InstructorID { get; set; }
        public bool isDraft { get; set; }
        public IEnumerable<int> MeetingIdsToDelete { get; set; }
        public List<ClassMeeting> MeetingsToInsert { get; set; } = new List<ClassMeeting>();
    }
}
