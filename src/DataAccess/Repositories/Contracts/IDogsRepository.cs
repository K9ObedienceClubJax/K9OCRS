using DataAccess.Entities;
using System.Data;
using System.Threading.Tasks;

namespace DataAccess.Repositories.Contracts
{
    public interface IDogRepository : IRepository<Dog>
    {
        Task<int> UpdateImage(IDbConnection conn, int dogId, string filename);
    }
}
