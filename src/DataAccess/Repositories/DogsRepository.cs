using Dapper;
using DataAccess.Constants;
using DataAccess.Entities;
using DataAccess.Repositories.Contracts;
using System.Data;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace DataAccess.Repositories
{
    public class DogsRepository : BaseRepository<Dog>, IDogRepository
    {

        // Everytime that you create a repository, make sure you include a constructor that calls the "base constructor"
        // passing in the Db table name that is associated to it by using this syntax
        public DogsRepository(IHttpContextAccessor _httpContextAccessor) : base(DbTables.Get(nameof(Dog)), _httpContextAccessor) { }

        public async Task<int> UpdateImage(IDbConnection conn, int dogId, string filename)
        {
            var query = $"UPDATE {_tableName} SET ImageFilename=@Filename WHERE ID=@ID";
            return await conn.ExecuteAsync(query, new { ID = dogId, Filename = filename });
        }
    }
}
