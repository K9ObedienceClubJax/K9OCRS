﻿using DataAccess.Extensions;
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

        [TransactionIgnore]
        public int ID { get; set; }
        public int SectionID { get; set; }
        public DateTime Date { get; set; }

        public int CompareTo(object obj)
        {
            ClassMeeting b = (ClassMeeting) obj;
            return DateTime.Compare(this.Date, b.Date);
        }
    }
}
