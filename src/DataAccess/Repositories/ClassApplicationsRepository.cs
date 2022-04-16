using Dapper;
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
            int? DogID,
            string PaymentMethod,
            bool includePending,
            bool includeActive,
            bool includeCompleted,
            bool includeCancelled
        )
        {
            var sqlCompiler = new SqlServerCompiler();
            var queryBuilder = new Query($"{_tableNameRaw} as ca")
                .LeftJoin("Dogs as d", "d.ID", "ca.DogID")
                .LeftJoin("ClassTypes as ct", "ct.ID", "ca.ClassTypeID")
                .Select(
                    "ca.*",
                    "d.Name as DogName",
                    "ct.Title"
                );

            // Add DogID Filter
            if (DogID != null) queryBuilder.WhereRaw("ca.DogID = @DogID");

            // Add PaymentMethod Filter
            if (!string.IsNullOrEmpty(PaymentMethod)) queryBuilder.WhereRaw("ca.PaymentMethod = @PaymentMethod");

            var excludedStatusesList = new List<string>();

            if (!includePending) excludedStatusesList.Add("Pending");
            if (!includeActive) excludedStatusesList.Add("Active");
            if (!includeCompleted) excludedStatusesList.Add("Completed");
            if (!includeCancelled) excludedStatusesList.Add("Cancelled");

            // Add Status Filter
            if (excludedStatusesList.Count > 0) queryBuilder.WhereNotIn("ca.Status", excludedStatusesList);

            // Only use this when using Dapper's parameters
            var query = sqlCompiler.Compile(queryBuilder).ToString();

            var result = await conn.QueryAsync<ClassApplication, string, string, ClassApplication>(query,
            (application, dogName, typeTitle) => {
                application.DogName = dogName;
                application.ClassTypeTitle = typeTitle;
                return application;
            },
            new { PaymentMethod, DogID },
            splitOn: "DogName,Title");

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
                    ca.PaymentMethod,
                    ca.isPaid,
                    ca.isRefunded,
                    ca.ReviewedBy,
                    ca.ReviewedDate,
                    ca.ModifiedByID,
                    ca.ModifiedByName,
                    ca.ModifiedDate,
                    -- Dog Info
                    d.[Name] as DogName,
                    -- Class Type
                    ct.Title
                FROM ClassApplications ca
                LEFT JOIN Dogs d ON d.ID = ca.DogID
                LEFT JOIN ClassTypes ct ON ct.ID = ca.ClassTypeID
                WHERE ca.ID = @Id
            ";

            var result = await conn.QueryAsync<ClassApplication, string, string, ClassApplication>(query,
            (application, dogName, typeTitle) => {
                application.DogName = dogName;
                application.ClassTypeTitle = typeTitle;
                return application;
            },
            new { Id = id },
            splitOn: "DogName,Title");
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
                    ca.PaymentMethod,
                    ca.isPaid,
                    ca.isRefunded,
                    ca.ReviewedBy,
                    ca.ReviewedDate,
                    ca.ModifiedByID,
                    ca.ModifiedByName,
                    ca.ModifiedDate,
                    -- Dog Info
                    d.[Name] as DogName,
                    -- Class Type
                    ct.Title
                FROM ClassApplications ca
                LEFT JOIN Dogs d ON d.ID = ca.DogID
                LEFT JOIN ClassTypes ct ON ct.ID = ca.ClassTypeID
                WHERE ca.{idColumn} = @Id
            ";

            var result = await conn.QueryAsync<ClassApplication, string, string, ClassApplication>(query,
            (application, dogName, typeTitle) => {
                application.DogName = dogName;
                application.ClassTypeTitle = typeTitle;
                return application;
            },
            new { Id = id },
            splitOn: "DogName,Title");
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
