
using DataAccess.Extensions;

namespace DataAccess.Entities
{
    public class UserRole
    {
        [TransactionIgnore]
        public int ID { get; set; }
        public string Title { get; set; }
    }
}
