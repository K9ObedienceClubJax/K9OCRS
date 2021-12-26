using DataAccess.Extensions;
using System;

namespace DataAccess.Entities
{
    public class ClassMeeting
    {
        public ClassMeeting() { }
        public ClassMeeting(ClassMeeting entity)
        {
            ID = entity.ID;
            Date = entity.Date;
        }

        [TransactionIgnore]
        public int ID { get; set; }
        public DateTime Date { get; set; }
    }
}
