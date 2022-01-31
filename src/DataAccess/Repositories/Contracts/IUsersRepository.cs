using DataAccess.Entities;
using System.Data;
using System.Threading.Tasks;

namespace DataAccess.Repositories.Contracts
{
    public interface IUsersRepository : IRepository<User>
    {
        Task<string> GetByEmail(IDbConnection conn, string email);
    }
}
