using DataAccess.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Repositories.Contracts
{
    public interface IClassApplicationsRepository : IRepository<ClassApplication>
    {
        Task<IReadOnlyList<ClassApplication>> GetAll(IDbConnection conn, string PaymentMethod, bool includePending, bool includeActive, bool includeCompleted, bool includeCancelled);
    }
}
