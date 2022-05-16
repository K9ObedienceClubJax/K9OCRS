using DataAccess.Extensions;
using System;

namespace DataAccess.Entities
{
    public abstract class BaseEntity
    {
        [UpdateIgnore]
        public int ModifiedByID { get; set; }
        [UpdateIgnore]
        public string ModifiedByName { get; set; }
        [TransactionIgnore]
        public DateTime ModifiedDate { get; set; }
    }
}
