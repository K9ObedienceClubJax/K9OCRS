using DataAccess.Entities;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace DataAccess.Repositories.Contracts
{
    public interface IDogRepository : IRepository<Dog>
    {
        Task<int> UpdateImage(IDbConnection conn, int dogId, string filename);
        Task<IReadOnlyList<Dog>> GetOwnedDogs(IDbConnection conn);
    }
}
