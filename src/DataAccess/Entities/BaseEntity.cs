using DataAccess.Extensions;
using System;

namespace DataAccess.Entities
{
    public abstract class BaseEntity
    {
        public int ModifiedByID { get; set; }
        public string ModifiedByName { get; set; }
        [TransactionIgnore]
        public DateTime ModifiedDate { get; set; }
    }
}
