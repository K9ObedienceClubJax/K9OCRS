using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace DataAccess.Repositories.Contracts
{
    public interface IRepository<T> where T : class
    {
        Task<T> GetByID(IDbConnection conn, int id);
        Task<IReadOnlyList<T>> GetAll(IDbConnection conn);
        Task<int> Add(IDbConnection conn, T entity);
        Task<int> Update(IDbConnection conn, T entity);
        Task<int> Delete(IDbConnection conn, int id);
    }
}
