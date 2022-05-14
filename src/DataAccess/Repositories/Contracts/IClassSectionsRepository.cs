using DataAccess.Entities;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace DataAccess.Repositories.Contracts
{
    public interface IClassSectionsRepository : IRepository<ClassSection>
    {
        Task<IReadOnlyList<ClassSection>> GetByID(IDbConnection conn, string idColumn, int id, bool includeDrafts = false);
        Task<IReadOnlyList<ClassSection>> GetAll(IDbConnection conn, bool includeDrafts = false);
        Task<int> ReassignWholeClassType(IDbConnection conn, IDbTransaction tr, int currentClassTypeId, int targetClassTypeId);
    }
}
