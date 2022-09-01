using Dapper;
using DataAccess.Entities;
using DataAccess.Modules;
using DataAccess.Repositories.Contracts;
using Microsoft.AspNetCore.Http;
using System;
using System.Data;
using System.Threading.Tasks;

namespace DataAccess.Repositories
{
    public class VaccinationRecordsRepository : BaseRepository<VaccinationRecord>, IVaccinationRecordRepository
    {
        // Everytime that you create a repository, make sure you include a constructor that calls the "base constructor"
        // passing in the Db table name that is associated to it by using this syntax
        public VaccinationRecordsRepository(IHttpContextAccessor _httpContextAccessor) : base(nameof(VaccinationRecord), _httpContextAccessor) { }

        public async Task<int> VaccineUpload(IDbConnection conn, int dogId, string vaccinefile)
        {
            var query = $"UPDATE {_tableName} SET Filename=@Filename WHERE DogID=@DogID";
            return await conn.ExecuteAsync(query, new { DogID = dogId, Filename = vaccinefile });
        }

        public async Task<int> ReviewRecord(IDbConnection conn, int recordId, bool approved, DateTime expirationDate)
        {
            var identity = new ModifierIdentity(_httpContextAccessor);
            var expireDateString = approved ? "@expirationDate" : "GETUTCDATE()";

            var query = $@"
                UPDATE {_tableName}
                SET
                    ExpireDate={expireDateString},
                    {GenerateTrackingSection()}
                WHERE ID=@recordId
            ";

            return await conn.ExecuteAsync(query, new { recordId, expirationDate, Name = identity.Name });
        }
    }
}
