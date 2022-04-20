using DataAccess.Entities;
using System.Data;
using System.Threading.Tasks;

namespace DataAccess.Repositories.Contracts
{
    public interface IVaccinationRecordRepository : IRepository<VaccinationRecord>
    {
        Task<int> VaccineUpload(IDbConnection conn, int dogId, string vaccinefile);
    }
}
