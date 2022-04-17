using DataAccess.Entities;
using Microsoft.AspNetCore.Http;

namespace DataAccess.Repositories
{
    public class VaccinationRecordsRepository : BaseRepository<VaccinationRecord>
    {
        // Everytime that you create a repository, make sure you include a constructor that calls the "base constructor"
        // passing in the Db table name that is associated to it by using this syntax
        public VaccinationRecordsRepository(IHttpContextAccessor _httpContextAccessor) : base(nameof(VaccinationRecord), _httpContextAccessor) { }
    }
}
