using DataAccess.Entities;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace DataAccess.Repositories.Contracts
{
    public interface IClassApplicationsRepository : IRepository<ClassApplication>
    {
        Task<IReadOnlyList<ClassApplication>> GetAll(
            IDbConnection conn,
            int? DogID,
            string PaymentMethod,
            bool includePending,
            bool includeActive,
            bool includeCompleted,
            bool includeCancelled);
        Task<int> ReassignWholeClassType(IDbConnection conn, IDbTransaction tr, int currentClassTypeId, int targetClassTypeId);
    }
}
