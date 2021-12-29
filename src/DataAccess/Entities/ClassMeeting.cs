using DataAccess.Extensions;
using System;

namespace DataAccess.Entities
{
    public class ClassMeeting : IComparable
    {
        public ClassMeeting() { }
        public ClassMeeting(ClassMeeting entity)
        {
            ID = entity.ID;
            Date = entity.Date;
        }

        /// <example>1</example>
        [TransactionIgnore]
        public int ID { get; set; }
        /// <example>1</example>
        public int SectionID { get; set; }
        /// <example>2021-12-26T13:00:00</example>
        public DateTime Date { get; set; }

        public int CompareTo(object obj)
        {
            ClassMeeting b = (ClassMeeting) obj;
            return DateTime.Compare(this.Date, b.Date);
        }
    }
}
