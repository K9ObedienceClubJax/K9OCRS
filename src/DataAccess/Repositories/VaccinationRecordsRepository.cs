using DataAccess.Constants;
using DataAccess.Entities;

namespace DataAccess.Repositories
{
    public class VaccinationRecordsRepository : BaseRepository<VaccinationRecord>
    {
        // Everytime that you create a repository, make sure you include a constructor that calls the "base constructor"
        // passing in the Db table name that is associated to it by using this syntax
        public VaccinationRecordsRepository() : base(DbTables.Get(nameof(VaccinationRecord))) { }
    }
}
