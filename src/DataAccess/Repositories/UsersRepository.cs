using Dapper;
using DataAccess.Constants;
using DataAccess.Entities;
using DataAccess.Repositories.Contracts;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace DataAccess.Repositories
{
    public class UsersRepository : BaseRepository<User>, IUsersRepository
    {
        // Everytime that you create a repository, make sure you include a constructor that calls the "base constructor"
        // passing in the Db table name that is associated to it by using this syntax
        public UsersRepository() : base(DbTables.Get(nameof(User))) { }

        public async Task<User> GetByEmail(IDbConnection conn, string email)
        {
            var query = $"SELECT Email, Password FROM {_tableName} WHERE Email = @Email";
            return conn.QueryFirstOrDefault<User>(query, new { Email = email });
        }

        public async Task<User> GetIdByLogin(IDbConnection conn, string email, string password)
        {
            var query = $"SELECT ID, UserRoleID, Email, FirstName, LastName, ProfilePictureFilename FROM {_tableName} WHERE Email = @Email AND Password = @Password";
            return await conn.QueryFirstOrDefaultAsync<User>(query, new { Email = email, Password = password});
        }

        public async Task<IEnumerable<User>> QueryUsersByRole(IDbConnection conn, int role)
        {
            var query = $"SELECT ID, UserRoleID, Email, FirstName, LastName, ProfilePictureFilename FROM {_tableName} WHERE UserRoleID = @Role";
            return await conn.QueryAsync<User>(query, new { Role = role });
        }
    }
}
