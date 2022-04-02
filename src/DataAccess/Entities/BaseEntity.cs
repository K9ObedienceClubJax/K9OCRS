using System;

namespace DataAccess.Entities
{
    public abstract class BaseEntity
    {
        public int ModifiedByID { get; set; }
        public string ModifiedByName { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}
