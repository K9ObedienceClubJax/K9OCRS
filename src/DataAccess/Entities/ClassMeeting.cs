using DataAccess.Extensions;
using System;

namespace DataAccess.Entities
{
    public class ClassMeeting
    {
        [TransactionIgnore]
        public int ID { get; set; }
        public DateTime Date { get; set; }
    }
}
