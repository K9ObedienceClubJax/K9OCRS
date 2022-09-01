using Dapper;
using DataAccess.Constants;
using DataAccess.Entities;
using DataAccess.Modules;
using DataAccess.Repositories.Contracts;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace DataAccess.Repositories
{
    public class DogsRepository : BaseRepository<Dog>, IDogRepository
    {

        // Everytime that you create a repository, make sure you include a constructor that calls the "base constructor"
        // passing in the Db table name that is associated to it by using this syntax
        public DogsRepository(IHttpContextAccessor _httpContextAccessor) : base(nameof(Dog), _httpContextAccessor) { }

        string dogLastNameQuery = @$"
            (
	        SELECT TOP 1
		        u.LastName
	        FROM {DbTables.Get(nameof(UserDog))} ud
	        JOIN {DbTables.Get(nameof(User))} u ON ud.UserID = u.ID
	        WHERE ud.DogID = d.ID
	        ) as LastName
        ";

        public async Task<int> UpdateImage(IDbConnection conn, int dogId, string filename)
        {
            var query = $"UPDATE {_tableName} SET ProfilePictureFilename=@Filename WHERE ID=@ID";
            return await conn.ExecuteAsync(query, new { ID = dogId, Filename = filename });
        }

        public override async Task<IReadOnlyList<Dog>> GetAll(IDbConnection conn)
        {
            var query = @$"
                SELECT
                    d.*,
	                {dogLastNameQuery}
                FROM {_tableName} d
            ";

            var result = await conn.QueryAsync<Dog>(query);
            return result.ToList();
        }

        public override async Task<Dog> GetByID(IDbConnection conn, int id)
        {
            var query = @$"
                SELECT
                    d.*,
	                {dogLastNameQuery}
                FROM {_tableName} d
                WHERE d.ID = @id
            ";

            var result = await conn.QuerySingleOrDefaultAsync<Dog>(query, new { id });

            if (result == null)
                throw new KeyNotFoundException($"{_tableName} with id [{id}] could not be found.");

            return result;
        }

        public async Task<IReadOnlyList<Dog>> GetOwnedDogs(IDbConnection conn)
        {
            var identity = new ModifierIdentity(_httpContextAccessor);
            var query = $@"
                SELECT d.*
                FROM {_tableName} d
                JOIN {DbTables.Get(nameof(UserDog))} ud ON d.ID = ud.DogID
                WHERE ud.UserID = {identity.ID}
            ";

            var result = await conn.QueryAsync<Dog>(query);
            return result.ToList();
        }
    }
}
