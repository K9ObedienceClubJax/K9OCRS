using Dapper;
using DataAccess.Entities;
using DataAccess.Modules;
using DataAccess.Repositories.Contracts;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace DataAccess.Repositories
{
    public class UserDogsRepository : BaseRepository<UserDog>, IUserDogsRepository
    {
        // Everytime that you create a repository, make sure you include a constructor that calls the "base constructor"
        // passing in the Db table name that is associated to it by using this syntax
        public UserDogsRepository(IHttpContextAccessor _httpContextAccessor) : base(nameof(UserDog), _httpContextAccessor) { }

        public Task<UserDog> AssignDogToCurrentUser(IDbConnection conn, IDbTransaction tr, int dogId)
        {
            var identity = new ModifierIdentity(_httpContextAccessor);
            var userDog = new UserDog
            {
                DogID = dogId,
                UserID = identity.ID,
            };
            return base.Add(conn, tr, userDog);
        }

        public Task<int> DeleteManyByUserIds(IDbConnection conn, IDbTransaction tr, int dogId, IEnumerable<int> userIds)
        {
            var query = $"DELETE FROM {_tableName} WHERE DogID = @dogId AND UserID IN @userIds";

            return conn.ExecuteAsync(query, new { dogId, userIds }, tr);
        }
    }
}
