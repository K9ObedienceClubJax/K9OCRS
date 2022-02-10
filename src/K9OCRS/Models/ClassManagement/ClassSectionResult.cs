using DataAccess.Entities;
using System;
using System.Collections.Generic;
using System.Linq;

namespace K9OCRS.Models.ClassManagement
{
    public class ClassSectionResult : ClassSection
    {
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public IEnumerable<ClassMeeting> Meetings { get; set; }
        // Change the data type to a DTO when available
        public User Instructor { get; set; }

        public ClassSectionResult(ClassSection entity) : base(entity) { }
        public ClassSectionResult(ClassSection entity, IEnumerable<ClassMeeting> meetings) : base(entity)
        {
            Meetings = meetings;
            
            // group Meetings by the time they start and end
            var grouped = meetings.Aggregate(new List<List<ClassMeeting>>(), (prev, curr) =>
            {
                var existingList = prev.Find(li =>
                {
                    var first = li.FirstOrDefault();

                    return first.StartDate.TimeOfDay == curr.StartDate.TimeOfDay && first.EndDate.TimeOfDay == curr.EndDate.TimeOfDay;
                });

                if (existingList != null)
                {
                    existingList.Add(curr);
                } else
                {
                    prev.Add(new List<ClassMeeting> { curr });
                }
                
                return prev;
            });

            // Get the most reocurring start/end time combination by getting the count of the groups
            var maxCount = grouped.Max(li => li.Count());

            // Find the mode of the data set by taking the first element of the list with the most ocurrences
            var mode = grouped.Find(li => li.Count() == maxCount).First();

            // Use the mode to set the start and end times for the overall section
            StartTime = new DateTime() + mode.StartDate.TimeOfDay;
            EndTime = new DateTime() + mode.EndDate.TimeOfDay;
        }
        public ClassSectionResult(ClassSection entity, IEnumerable<ClassMeeting> meetings, User instructor) : this(entity, meetings) => Instructor = instructor;
    }
}
