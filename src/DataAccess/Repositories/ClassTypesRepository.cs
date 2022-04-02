using Dapper;
using DataAccess.Constants;
using DataAccess.Entities;
using DataAccess.Repositories.Contracts;
using Microsoft.AspNetCore.Http;
using System.Data;
using System.Threading.Tasks;

namespace DataAccess.Repositories
{
    public class ClassTypesRepository : BaseRepository<ClassType>, IClassTypesRepository
    {
        // Everytime that you create a repository, make sure you include a constructor that calls the "base constructor"
        // passing in the Db table name that is associated to it by using this syntax
        public ClassTypesRepository(IHttpContextAccessor _httpContextAccessor) : base(DbTables.Get(nameof(ClassType)), _httpContextAccessor) { }

        public async Task<int> UpdateImage(IDbConnection conn, int classTypeId, string filename)
        {
            var query = $"UPDATE {_tableName} SET ImageFilename=@Filename, {GenerateTrackingSection()} WHERE ID=@ID";
            return await conn.ExecuteAsync(query, new { ID = classTypeId, Filename = filename });
        }
    }
}
