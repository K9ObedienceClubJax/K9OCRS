using Dapper;
using DataAccess.Constants;
using DataAccess.Entities;
using DataAccess.Repositories.Contracts;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace DataAccess.Repositories
{
    public class ClassPhotosRepository : BaseRepository<ClassPhoto>, IClassPhotosRepository
    {
        // Everytime that you create a repository, make sure you include a constructor that calls the "base constructor"
        // passing in the Db table name that is associated to it by using this syntax
        public ClassPhotosRepository() : base(DbTables.Get(nameof(ClassPhoto))) { }

        public async Task<IEnumerable<ClassPhoto>> GetByClassTypeID(IDbConnection conn, int classTypeId)
        {
            var query = $"SELECT * FROM {_tableName} WHERE ClassTypeID=@Id";
            var result = await conn.QueryAsync<ClassPhoto>(query, new { Id = classTypeId });
            if (result == null)
                throw new KeyNotFoundException($"{_tableName} with ClassTypeID [{classTypeId}] could not be found.");

            return result;
        }
    }
}
