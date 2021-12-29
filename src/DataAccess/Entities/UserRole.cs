
using DataAccess.Extensions;

namespace DataAccess.Entities
{
    public class UserRole
    {
        public UserRole() { }

        public UserRole(UserRole entity)
        {
            ID = entity.ID;
            Title = entity.Title;
        }

        [TransactionIgnore]
        public int ID { get; set; }
        public string Title { get; set; }
    }
}
