using Dapper;
using DataAccess.Entities;
using DataAccess.Repositories.Contracts;
using Microsoft.AspNetCore.Http;
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

        public async Task<IReadOnlyList<ClassApplication>> GetAll(IDbConnection conn, string PaymentMethod, bool includePending, bool includeActive, bool includeCompleted, bool includeCancelled)
        {
            var useIncludes = !includePending || !includeActive || !includeCompleted || !includeCancelled;
            var usePaymentMethodFilter = !string.IsNullOrEmpty(PaymentMethod);

            var paymentMethodFilter = usePaymentMethodFilter ? "ca.PaymentMethod = @PaymentMethod" : "";

            var includesList = new List<string>();
            var includes = $"ca.Status NOT IN (";

            if (!includePending) includesList.Add("\'Pending\'");
            if (!includeActive) includesList.Add("\'Active\'");
            if (!includeCompleted) includesList.Add("\'Completed\'");
            if (!includeCancelled) includesList.Add("\'Cancelled\'");

            var idx = 0;
            foreach(string include in includesList)
            {
                if (idx == 0)
                {
                    includes += include;
                } else
                {
                    includes = includes + ',' + include;
                }
                idx++;
            }

            includes += ')';

            var includesFilter = useIncludes ? includes : "";

            var whereSection = (usePaymentMethodFilter || useIncludes)  ? "WHERE" : "";
            var andSection = !string.IsNullOrEmpty(paymentMethodFilter) && !string.IsNullOrEmpty(includesFilter) ? "AND" : "";

            var query = $@"
                SELECT
                    ca.ID,
                    ca.ClassTypeID,
                    ca.ClassSectionID,
                    ca.DogID,
                    ca.Status,
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
                {whereSection}
                {paymentMethodFilter}
                {andSection}
                {includesFilter}
            ";

            var result = await conn.QueryAsync<ClassApplication, string, string, ClassApplication>(query,
            (application, dogName, typeTitle) =>
            {
                application.DogName = dogName;
                application.ClassTypeTitle = typeTitle;
                return application;
            },
            new { PaymentMethod },
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
