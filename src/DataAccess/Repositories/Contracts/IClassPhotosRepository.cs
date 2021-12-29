using DataAccess.Entities;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace DataAccess.Repositories.Contracts
{
    public interface IClassPhotosRepository : IRepository<ClassPhoto>
    {
        Task<IEnumerable<ClassPhoto>> GetByClassTypeID(IDbConnection conn, int classTypeId);
    }
}
