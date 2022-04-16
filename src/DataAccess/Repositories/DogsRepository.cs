using Dapper;
using DataAccess.Entities;
using DataAccess.Repositories.Contracts;
using Microsoft.AspNetCore.Http;
using System.Data;
using System.Threading.Tasks;

namespace DataAccess.Repositories
{
    public class DogsRepository : BaseRepository<Dog>, IDogRepository
    {

        // Everytime that you create a repository, make sure you include a constructor that calls the "base constructor"
        // passing in the Db table name that is associated to it by using this syntax
        public DogsRepository(IHttpContextAccessor _httpContextAccessor) : base(nameof(Dog), _httpContextAccessor) { }

        public async Task<int> UpdateImage(IDbConnection conn, int dogId, string filename)
        {
            var query = $"UPDATE {_tableName} SET ProfilePictureFilename=@Filename WHERE ID=@ID";
            return await conn.ExecuteAsync(query, new { ID = dogId, Filename = filename });
        }
    }
}
