﻿using DataAccess.Entities;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace DataAccess.Repositories.Contracts
{
    public interface IClassTypesRepository : IRepository<ClassType>
    {
        Task<int> UpdateImage(IDbConnection conn, int classTypeId, string filename);
        Task<IReadOnlyList<ClassType>> GetOptions(IDbConnection conn);
    }
}
