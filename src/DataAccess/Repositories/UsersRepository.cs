using Dapper;
using DataAccess.Entities;
using DataAccess.Repositories.Contracts;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace DataAccess.Repositories
{
    public class UsersRepository : BaseRepository<User>, IUsersRepository
    {
        // Everytime that you create a repository, make sure you include a constructor that calls the "base constructor"
        // passing in the Db table name that is associated to it by using this syntax
        public UsersRepository(IHttpContextAccessor _httpContextAccessor) : base(nameof(User), _httpContextAccessor) { }

        public async Task<User> GetByEmail(IDbConnection conn, string email)
        {
            var query = $"SELECT Email, Password FROM {_tableName} WHERE Email = @Email";
            return conn.QueryFirstOrDefault<User>(query, new { Email = email });
        }

        public async Task<User> GetIdByLogin(IDbConnection conn, string email, string password)
        {
            var query = $@"SELECT * FROM {_tableName} WHERE Email = @Email AND Password = @Password";
            return await conn.QueryFirstOrDefaultAsync<User>(query, new { Email = email, Password = password });
        }

        public async Task<IEnumerable<User>> QueryUsersByRole(IDbConnection conn, int role)
        {
            var query = $"SELECT * FROM {_tableName} WHERE UserRoleID = @Role AND isSystemOwned = 0";
            return await conn.QueryAsync<User>(query, new { Role = role });
        }

        public async Task<IEnumerable<User>> GetInstructorOptions(IDbConnection conn)
        {
            var query = $"SELECT * FROM {_tableName} WHERE UserRoleID IN (1,2) AND isSystemOwned = 0 AND isArchived = 0";
            return await conn.QueryAsync<User>(query);
        }

        public async Task<int> UpdateProfilePicture(IDbConnection conn, int userId, string filename)
        {
            var query = $"UPDATE {_tableName} SET ProfilePictureFilename=@Filename, {GenerateTrackingSection()} WHERE ID=@ID";
            return await conn.ExecuteAsync(query, new { ID = userId, Filename = filename });
        }
    }
}
