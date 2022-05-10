using Dapper;
using DataAccess.Constants;
using DataAccess.Entities;
using DataAccess.Repositories.Contracts;
using Microsoft.AspNetCore.Http;
using SqlKata;
using SqlKata.Compilers;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace DataAccess.Repositories
{
    public class ClassApplicationsRepository : BaseRepository<ClassApplication>, IClassApplicationsRepository
    {
        // Everytime that you create a repository, make sure you include a constructor that calls the "base constructor"
        // passing in the Db table name that is associated to it by using this syntax
        public ClassApplicationsRepository(IHttpContextAccessor _httpContextAccessor) : base(nameof(ClassApplication), _httpContextAccessor) { }

        public async Task<IReadOnlyList<ClassApplication>> GetAll(
            IDbConnection conn,
            IEnumerable<int> ClassTypeIDs,
            IEnumerable<int> DogIDs,
            IEnumerable<int> PaymentMethodIds,
            bool includePaid,
            bool includeRefunded,
            bool includePending,
            bool includeActive,
            bool includeCompleted,
            bool includeCancelled
        )
        {
            var sqlCompiler = new SqlServerCompiler();
            var queryBuilder = new Query($"{_tableNameRaw} as ca")
                .LeftJoin($"{DbTables.GetRaw(nameof(Dog))} as d", "d.ID", "ca.DogID")
                .LeftJoin($"{DbTables.GetRaw(nameof(ClassType))} as ct", "ct.ID", "ca.ClassTypeID")
                .LeftJoin($"{DbTables.GetRaw(nameof(PaymentMethod))} as pm", "pm.ID", "ca.PaymentMethodID")
                .Select(
                    "ca.*",
                    "d.Name as DogName",
                    "d.ProfilePictureFilename as DogProfilePictureFilename",
                    "ct.Title as ClassTypeTitle",
                    "pm.Name as PaymentMethodName"
                );

            // Add DogIDs Filter
            if (ClassTypeIDs.Count() > 0) queryBuilder.WhereRaw("ct.ID IN @ClassTypeIDs");

            // Add DogIDs Filter
            if (DogIDs.Count() > 0) queryBuilder.WhereRaw("ca.DogID IN @DogIDs");

            // Add PaymentMethod Filter
            if (PaymentMethodIds.Count() > 0) queryBuilder.WhereRaw("ca.PaymentMethodID IN @PaymentMethodIds");

            var excludedStatusesList = new List<string>();

            if (!includePending) excludedStatusesList.Add("Pending");
            if (!includeActive) excludedStatusesList.Add("Active");
            if (!includeCompleted) excludedStatusesList.Add("Completed");
            if (!includeCancelled) excludedStatusesList.Add("Cancelled");

            // Add Status Filter
            if (excludedStatusesList.Count > 0) queryBuilder.WhereNotIn("ca.Status", excludedStatusesList);

            // Add Payment Status Filters
            if (!includePaid) queryBuilder.WhereRaw("ca.isPaid = 0");
            if (!includeRefunded) queryBuilder.WhereRaw("ca.isRefunded = 0");

            // Only use this when using Dapper's parameters
            var query = sqlCompiler.Compile(queryBuilder).ToString();

            var result = await conn.QueryAsync<ClassApplication>(query,
            new { PaymentMethodIds, DogIDs, ClassTypeIDs });

            return result.ToList();
        }

        public override async Task<ClassApplication> GetByID(IDbConnection conn, int id)
        {
            var query = $@"
                SELECT
                    ca.ID,
                    ca.ClassTypeID,
                    ca.ClassSectionID,
                    ca.DogID,
                    ca.Status,
                    ca.MainAttendee,
                    ca.AdditionalAttendees,
                    ca.PaymentMethodID,
                    ca.isPaid,
                    ca.isRefunded,
                    ca.ReviewedBy,
                    ca.ReviewedDate,
                    ca.ModifiedByID,
                    ca.ModifiedByName,
                    ca.ModifiedDate,
                    -- Dog Info
                    d.[Name] as DogName,
                    d.ProfilePictureFilename as DogProfilePictureFilename,
                    -- Class Type
                    ct.Title as ClassTypeTitle,
                    -- Payment Method
                    pm.[Name] as PaymentMethodName
                FROM ClassApplications ca
                LEFT JOIN {DbTables.Get(nameof(Dog))} as d ON d.ID = ca.DogID
                LEFT JOIN {DbTables.Get(nameof(ClassType))} as ct ON ct.ID = ca.ClassTypeID
                LEFT JOIN {DbTables.Get(nameof(PaymentMethod))} as pm ON pm.ID = ca.PaymentMethodID
                WHERE ca.ID = @Id
            ";

            var result = await conn.QueryAsync<ClassApplication>(query, new { Id = id });
            return result.FirstOrDefault();
        }

        public override async Task<IReadOnlyList<ClassApplication>> GetByID(IDbConnection conn, string idColumn, int id)
        {
            var query = $@"
                SELECT
                    ca.ID,
                    ca.ClassTypeID,
                    ca.ClassSectionID,
                    ca.DogID,
                    ca.Status,
                    ca.MainAttendee,
                    ca.AdditionalAttendees,
                    ca.PaymentMethodID,
                    ca.isPaid,
                    ca.isRefunded,
                    ca.ReviewedBy,
                    ca.ReviewedDate,
                    ca.ModifiedByID,
                    ca.ModifiedByName,
                    ca.ModifiedDate,
                    -- Dog Info
                    d.[Name] as DogName,
                    d.ProfilePictureFilename as DogProfilePictureFilename,
                    -- Class Type
                    ct.Title as ClassTypeTitle,
                    -- Payment Method
                    pm.[Name] as PaymentMethodName
                FROM ClassApplications ca
                LEFT JOIN {DbTables.Get(nameof(Dog))} as d ON d.ID = ca.DogID
                LEFT JOIN {DbTables.Get(nameof(ClassType))} as ct ON ct.ID = ca.ClassTypeID
                LEFT JOIN {DbTables.Get(nameof(PaymentMethod))} as pm ON pm.ID = ca.PaymentMethodID
                WHERE ca.{idColumn} = @Id
            ";

            var result = await conn.QueryAsync<ClassApplication>(query, new { Id = id });
            return result.ToList();
        }

        public async Task<int> ReassignWholeClassType(IDbConnection conn, IDbTransaction tr, int currentClassTypeId, int targetClassTypeId)
        {
            var query = @$"
                UPDATE {_tableName}
                SET ClassTypeID = @targetClassTypeId, {GenerateTrackingSection()}
                WHERE ClassTypeID = @currentClassTypeId
            ";

            return await conn.ExecuteAsync(query, new { targetClassTypeId, currentClassTypeId }, tr);
        }
    }
}
