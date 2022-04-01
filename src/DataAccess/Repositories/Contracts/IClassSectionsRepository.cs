using DataAccess.Entities;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace DataAccess.Repositories.Contracts
{
    public interface IClassSectionsRepository : IRepository<ClassSection>
    {
        Task<ClassSection> GetByID(IDbConnection conn, int id, bool includeDrafts = false);
        Task<IReadOnlyList<ClassSection>> GetByID(IDbConnection conn, string idColumn, int id, bool includeDrafts = false);
    }
}
