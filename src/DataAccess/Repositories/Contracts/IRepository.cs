using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace DataAccess.Repositories.Contracts
{
    public interface IRepository<T> where T : class
    {
        Task<T> GetByID(IDbConnection conn, int id);
        Task<IReadOnlyList<T>> GetByID(IDbConnection conn, string idColumn, int id);
        Task<IReadOnlyList<T>> GetByIDs(IDbConnection conn, IEnumerable<int> ids);
        Task<IReadOnlyList<T>> GetByIDs(IDbConnection conn, string idColumn, IEnumerable<int> ids);
        Task<IReadOnlyList<T>> GetAll(IDbConnection conn);
        Task<int> Add(IDbConnection conn, T entity);
        Task<int> Add(IDbConnection conn, IDbTransaction tr, T entity);
        Task<int> Update(IDbConnection conn, T entity);
        Task<int> Update(IDbConnection conn, IDbTransaction tr, T entity);
        Task<int> Delete(IDbConnection conn, int id);
        Task<int> Delete(IDbConnection conn, IDbTransaction tr, int id);
    }
}
