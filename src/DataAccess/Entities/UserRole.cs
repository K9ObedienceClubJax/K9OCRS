
using DataAccess.Extensions;

namespace DataAccess.Entities
{
    public class UserRole : BaseEntity
    {
        public UserRole() { }

        public UserRole(UserRole entity)
        {
            ID = entity.ID;
            Title = entity.Title;
            ModifiedByID = entity.ModifiedByID;
            ModifiedByName = entity.ModifiedByName;
            ModifiedDate = entity.ModifiedDate;
        }

        [TransactionIgnore]
        public int ID { get; set; }
        public string Title { get; set; }
    }
}
