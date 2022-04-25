using DataAccess.Entities;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace K9OCRS.Models.ClassManagement
{
    public class ClassSectionAddRequest
    {
        /// <example>1</example>
        [Required]
        public int ClassTypeID { get; set; }
        /// <example>16</example>
        [Required]
        public int RosterCapacity { get; set; }
        /// <example>1</example>
        [Required]
        public int InstructorID { get; set; }
        [Required]
        public List<ClassMeeting> Meetings { get; set; }
        public bool isDraft { get; set; } = false;
    }
}
