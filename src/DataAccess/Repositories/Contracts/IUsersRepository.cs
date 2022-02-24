﻿using DataAccess.Entities;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace DataAccess.Repositories.Contracts
{
    public interface IUsersRepository : IRepository<User>
    {
        Task<User> GetByEmail(IDbConnection conn, string email);
        Task<User> GetIdByLogin(IDbConnection conn, string email, string password);
        Task<IEnumerable<User>> QueryUsersByRole(IDbConnection conn, int role);
    }
}
