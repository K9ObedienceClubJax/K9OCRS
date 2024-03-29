﻿using Dapper;
using DataAccess.Entities;
using DataAccess.Repositories.Contracts;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace DataAccess.Repositories
{
    public class ClassTypesRepository : BaseRepository<ClassType>, IClassTypesRepository
    {
        // Everytime that you create a repository, make sure you include a constructor that calls the "base constructor"
        // passing in the Db table name that is associated to it by using this syntax
        public ClassTypesRepository(IHttpContextAccessor _httpContextAccessor) : base(nameof(ClassType), _httpContextAccessor) { }

        public async Task<IReadOnlyList<ClassType>> GetOptions(IDbConnection conn)
        {
            var query = $@"
                SELECT
                    ID,
                    Title,
                    isArchived
                FROM {_tableName}
                WHERE isSystemOwned = 0
            ";
            return (await conn.QueryAsync<ClassType>(query)).ToList();
        }

        public async Task<int> UpdateImage(IDbConnection conn, int classTypeId, string filename)
        {
            var query = $"UPDATE {_tableName} SET ImageFilename=@Filename, {GenerateTrackingSection()} WHERE ID=@ID";
            return await conn.ExecuteAsync(query, new { ID = classTypeId, Filename = filename });
        }
    }
}
