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
        Task<IReadOnlyList<T>> GetAll(IDbConnection conn, bool includeArchived = false);
        Task<IReadOnlyList<T>> GetTableExport(IDbConnection conn);
        Task<T> Add(IDbConnection conn, T entity);
        Task<T> Add(IDbConnection conn, IDbTransaction tr, T entity);
        Task<IReadOnlyList<T>> AddMany(IDbConnection conn, IDbTransaction tr, List<T> entities);
        Task<int> Update(IDbConnection conn, T entity);
        Task<int> Update(IDbConnection conn, IDbTransaction tr, T entity);
        Task<int> Delete(IDbConnection conn, int id);
        Task<int> Delete(IDbConnection conn, IDbTransaction tr, int id);
        Task<int> DeleteMany(IDbConnection conn, IDbTransaction tr, IEnumerable<int> ids);
        Task<int> Archive(IDbConnection conn, int id);
        Task<int> Unarchive(IDbConnection conn, int id);
        Task<int> MakeDraft(IDbConnection conn, int id);
        Task<int> PublishDraft(IDbConnection conn, int id);

    }
}
