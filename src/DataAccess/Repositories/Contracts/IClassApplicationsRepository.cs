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
            IEnumerable<int> ClassTypeIDs,
            IEnumerable<int> DogIDs,
            IEnumerable<int> PaymentMethodIds,
            bool includePaid,
            bool includeRefunded,
            bool includePending,
            bool includeActive,
            bool includeCompleted,
            bool includeCancelled);
        Task<IReadOnlyList<ClassApplication>> GetSectionRoster(IDbConnection conn, int sectionId);
        Task<int> ReassignWholeClassType(IDbConnection conn, IDbTransaction tr, int currentClassTypeId, int targetClassTypeId);
    }
}
