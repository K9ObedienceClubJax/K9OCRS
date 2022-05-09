using Dapper;
using DataAccess.Constants;
using DataAccess.Entities;
using DataAccess.Extensions;
using DataAccess.Modules;
using DataAccess.Repositories.Contracts;
using Microsoft.AspNetCore.Http;
using SqlKata;
using SqlKata.Compilers;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Repositories
{
    /// <summary>
    /// This is a generic repository that provides basic CRUD functionality for any entity that has an ID column
    /// and that doesn't require excluding columns when updating.
    /// 
    /// If you require more fine grained control, please create a custom repository that extends this one. Keep in mind that
    /// the "abstract" keyword on the class definition means that you can take any of the "virtual" methods and override them to suit your needs.
    /// </summary>
    public abstract class BaseRepository<T> : IRepository<T> where T : BaseEntity
    {
        protected readonly IHttpContextAccessor _httpContextAccessor;
        public readonly string _tableName;
        public readonly string _tableNameRaw;

        protected BaseRepository(string className, IHttpContextAccessor httpContextAccessor)
        {
            // use it like this: var identity = new ModifierIdentity(_httpContextAccessor);
            _httpContextAccessor = httpContextAccessor;
            _tableName = DbTables.Get(className);
            _tableNameRaw = DbTables.GetRaw(className);
        }

        public virtual async Task<T> GetByID(IDbConnection conn, int id)
        {
            var result = await conn.QuerySingleOrDefaultAsync<T>($"SELECT * FROM {_tableName} WHERE ID=@Id", new { Id = id });
            if (result == null)
                throw new KeyNotFoundException($"{_tableName} with id [{id}] could not be found.");

            return result;
        }

        public virtual async Task<IReadOnlyList<T>> GetByID(IDbConnection conn, string idColumn, int id)
        {
            var result = await conn.QueryAsync<T>($"SELECT * FROM {_tableName} WHERE [{idColumn}]=@Id", new { Id = id });
            if (result == null)
                throw new KeyNotFoundException($"{_tableName} with [{idColumn}] = {id} could not be found.");

            return result.ToList();
        }

        public virtual async Task<IReadOnlyList<T>> GetByIDs(IDbConnection conn, IEnumerable<int> ids)
        {
            var result = await conn.QueryAsync<T>($"SELECT * FROM {_tableName} WHERE ID IN @Ids", new { Ids = ids });
            if (result == null)
                throw new KeyNotFoundException($"{_tableName} with ID in the given group of IDs could not be found.");

            return result.ToList();
        }

        public virtual async Task<IReadOnlyList<T>> GetByIDs(IDbConnection conn, string idColumn, IEnumerable<int> ids)
        {
            var result = await conn.QueryAsync<T>($"SELECT * FROM {_tableName} WHERE [{idColumn}] IN @Ids", new { Ids = ids });
            if (result == null)
                throw new KeyNotFoundException($"{_tableName} with [{idColumn}] in the given group of IDs could not be found.");

            return result.ToList();
        }

        public virtual async Task<IReadOnlyList<T>> GetAll(IDbConnection conn)
        {
            var query = $"SELECT * FROM {_tableName}";
            if (DbTables.DoesTableContainPlaceholders(_tableName))
            {
                query += " WHERE isSystemOwned = 0";
            }

            var result = await conn.QueryAsync<T>(query);
            return result.ToList();
        }

        public virtual async Task<IReadOnlyList<T>> GetAll(IDbConnection conn, bool includeArchived = false)
        {
            var sqlCompiler = new SqlServerCompiler();
            var queryBuilder = new Query($"{_tableNameRaw}").Select("*");

            if (ValidateHasPlaceholders()) queryBuilder.WhereRaw("isSystemOwned = 0");
            if (!includeArchived) queryBuilder.WhereRaw("isArchived = 0");

            // Only use this when using Dapper's parameters
            var query = sqlCompiler.Compile(queryBuilder).ToString();

            var result = await conn.QueryAsync<T>(query);
            return result.ToList();
        }

        public virtual async Task<IReadOnlyList<T>> GetTableExport(IDbConnection conn)
        {
            var exportQuery = GenerateExportQuery();
            return (await conn.QueryAsync<T>(exportQuery)).ToList();
        }

        public virtual async Task<T> Add(IDbConnection conn, T entity)
        {
            var identity = new ModifierIdentity(_httpContextAccessor);
            entity.ModifiedByID = identity.ID;
            entity.ModifiedByName = identity.Name;
            var insertQuery = GenerateInsertQuery();
            return await conn.QueryFirstOrDefaultAsync<T>(insertQuery, entity);
        }

        public virtual async Task<T> Add(IDbConnection conn, IDbTransaction tr, T entity)
        {
            var identity = new ModifierIdentity(_httpContextAccessor);
            entity.ModifiedByID = identity.ID;
            entity.ModifiedByName = identity.Name;
            var insertQuery = GenerateInsertQuery();
            return await conn.QueryFirstOrDefaultAsync<T>(insertQuery, entity, tr);
        }

        public virtual async Task<IReadOnlyList<T>> AddMany(IDbConnection conn, IDbTransaction tr, List<T> entities)
        {
            var identity = new ModifierIdentity(_httpContextAccessor);
            var insertQuery = GenerateInsertQuery();
            var results = new List<T>();

            foreach (var entity in entities)
            {
                entity.ModifiedByID = identity.ID;
                entity.ModifiedByName = identity.Name;
                var result = await conn.QuerySingleAsync<T>(insertQuery, entity, tr);
                results.Add(result);
            }

            return results;
        }

        public virtual async Task<int> Update(IDbConnection conn, T entity)
        {
            var identity = new ModifierIdentity(_httpContextAccessor);
            entity.ModifiedByID = identity.ID;
            entity.ModifiedByName = identity.Name;
            var updateQuery = GenerateUpdateQuery();
            return await conn.ExecuteAsync(updateQuery, entity);
        }

        public virtual async Task<int> Update(IDbConnection conn, IDbTransaction tr, T entity)
        {
            var identity = new ModifierIdentity(_httpContextAccessor);
            entity.ModifiedByID = identity.ID;
            entity.ModifiedByName = identity.Name;
            var updateQuery = GenerateUpdateQuery();
            return await conn.ExecuteAsync(updateQuery, entity, tr);
        }

        public virtual async Task<int> Delete(IDbConnection conn, int id)
        {
            var query = $"DELETE FROM {_tableName} WHERE ID=@Id";
            if (DbTables.DoesTableContainPlaceholders(_tableName))
            {
                query += " AND isSystemOwned = 0";
            }

            return await conn.ExecuteAsync(query, new { Id = id });
        }

        public virtual async Task<int> Delete(IDbConnection conn, IDbTransaction tr, int id)
        {
            var query = $"DELETE FROM {_tableName} WHERE ID=@Id";
            if (DbTables.DoesTableContainPlaceholders(_tableName))
            {
                query += " AND isSystemOwned = 0";
            }

            return await conn.ExecuteAsync(query, new { Id = id }, tr);
        }

        public virtual async Task<int> DeleteMany(IDbConnection conn, IDbTransaction tr, IEnumerable<int> ids)
        {
            var query = $"DELETE FROM {_tableName} WHERE ID IN @Ids";
            if (DbTables.DoesTableContainPlaceholders(_tableName))
            {
                query += " AND isSystemOwned = 0";
            }

            return await conn.ExecuteAsync(query, new { Ids = ids }, tr);
        }

        #region Archivable
        public virtual async Task<int> Archive(IDbConnection conn, int id)
        {
            if (!ValidateIsArchivableEntity()) throw new NotSupportedException("The entity does not support archiving");

            var query = $"UPDATE {_tableName} SET IsArchived = 1, {GenerateTrackingSection()} WHERE ID=@Id";
            if (DbTables.DoesTableContainPlaceholders(_tableName))
            {
                query += " AND isSystemOwned = 0";
            }
            return await conn.ExecuteAsync(query, new { Id = id });
        }

        public virtual async Task<int> Unarchive(IDbConnection conn, int id)
        {
            if (!ValidateIsArchivableEntity()) throw new NotSupportedException("The entity does not support archiving");

            var query = $"UPDATE {_tableName} SET IsArchived = 0, {GenerateTrackingSection()} WHERE ID=@Id";
            if (DbTables.DoesTableContainPlaceholders(_tableName))
            {
                query += " AND isSystemOwned = 0";
            }
            return await conn.ExecuteAsync(query, new { Id = id });
        }
        #endregion

        #region Draftable
        public virtual async Task<int> MakeDraft(IDbConnection conn, int id)
        {
            if (!ValidateIsDraftableEntity()) throw new NotSupportedException("The entity does not support drafting");

            var query = $"UPDATE {_tableName} SET IsDraft = 1, {GenerateTrackingSection()} WHERE ID=@Id";
            if (DbTables.DoesTableContainPlaceholders(_tableName))
            {
                query += " AND isSystemOwned = 0";
            }
            return await conn.ExecuteAsync(query, new { Id = id });
        }

        public virtual async Task<int> PublishDraft(IDbConnection conn, int id)
        {
            if (!ValidateIsDraftableEntity()) throw new NotSupportedException("The entity does not support drafting");

            var query = $"UPDATE {_tableName} SET IsDraft = 0, {GenerateTrackingSection()} WHERE ID=@Id";
            if (DbTables.DoesTableContainPlaceholders(_tableName))
            {
                query += " AND isSystemOwned = 0";
            }
            return await conn.ExecuteAsync(query, new { Id = id });
        }
        #endregion

        #region Internal Utility Methods
        internal bool ValidateHasPlaceholders()
        {
            var props = GenerateListOfPropertyNames(GetProperties);
            return props.Contains("isSystemOwned");
        }

        internal bool ValidateIsArchivableEntity()
        {
            var props = GenerateListOfPropertyNames(GetProperties);
            return props.Contains("isArchived");
        }

        internal bool ValidateIsDraftableEntity()
        {
            var props = GenerateListOfPropertyNames(GetProperties);
            return props.Contains("isDraft");
        }

        internal string GenerateTrackingSection()
        {
            var identity = new ModifierIdentity(_httpContextAccessor);
            return $"ModifiedByID = {identity.ID}, ModifiedByName = '{identity.Name}', ModifiedDate=GETDATE()";
        }
        #endregion

        #region Private Methods

        private IEnumerable<PropertyInfo> GetProperties => typeof(T).GetProperties();

        private static List<string> GenerateListOfPropertyNames(IEnumerable<PropertyInfo> listOfProperties, bool isUpdate = false, bool isExport = false)
        {
            return (from prop in listOfProperties
                    let attributes = getIgnoredAttributes(prop, isUpdate, isExport)
                    where attributes.Length <= 0
                    select prop.Name).ToList();
        }

        private static List<PropertyInfo> GenerateListOfProperties(IEnumerable<PropertyInfo> listOfProperties, bool isUpdate = false, bool isExport = false)
        {
            return (from prop in listOfProperties
                    let attributes = getIgnoredAttributes(prop, isUpdate, isExport)
                    where attributes.Length <= 0
                    select prop).ToList();
        }

        private static object[] getIgnoredAttributes(PropertyInfo prop, bool isUpdate = false, bool isExport = false)
        {
            if (!isExport)
            {
                var transactionIgnored = prop.GetCustomAttributes(typeof(TransactionIgnoreAttribute), false);

                if (isUpdate)
                {
                    var updateIgnored = prop.GetCustomAttributes(typeof(UpdateIgnoreAttribute), false);
                    return transactionIgnored.Concat(updateIgnored).ToArray();
                }

                var insertIgnored = prop.GetCustomAttributes(typeof(InsertIgnoreAttribute), false);
                return transactionIgnored.Concat(insertIgnored).ToArray();
            }
            else
            {
                var exportIgnored = prop.GetCustomAttributes(typeof(ExportIgnoreAttribute), false);
                return exportIgnored.ToArray();
            }
        }

        private DynamicParameters GenerateParametersFromList(IEnumerable<T> entities, bool isUpdate = false, bool isExport = false)
        {
            DynamicParameters parameters = new DynamicParameters();

            var properties = GenerateListOfProperties(GetProperties, isUpdate, isExport);

            foreach (var entity in entities)
            {
                foreach (var property in properties)
                {
                    var paramName = $"@{property.Name}";

                    // Generate a type for the List of "x property's type"
                    Type listType = typeof(List<>).MakeGenericType(new[] { property.PropertyType });
                    // Generate the parameter value getter for our dynamically generated type
                    MethodInfo paramValueGetter = typeof(DynamicParameters).GetMethod(nameof(DynamicParameters.Get)).MakeGenericMethod(listType);

                    var propertyValue = property.GetValue(entity);

                    object parameterList;

                    try
                    {
                        // This is equal to parameters.Get<List<[propType]>>(paramName)
                        parameterList = paramValueGetter.Invoke(parameters, new[] { paramName });
                    }
                    // If we got this exception it means the list doesn't exist yet
                    catch (TargetInvocationException ex)
                    {
                        // Add new List<[propType]>
                        parameters.Add(paramName, (IList)Activator.CreateInstance(listType));

                        // This is equal to parameters.Get<List<[propType]>>(paramName)
                        parameterList = paramValueGetter.Invoke(parameters, new[] { paramName });
                    }

                    var addMethod = listType.GetMethod(nameof(IList.Add));

                    addMethod.Invoke(parameterList, new[] { propertyValue });
                }
            }

            return parameters;
        }

        private string GenerateInsertQuery()
        {
            var insertQuery = new StringBuilder($"INSERT INTO {_tableName} ");

            insertQuery.Append("(");

            var properties = GenerateListOfPropertyNames(GetProperties);
            properties.ForEach(prop => {
                if (prop != "ID")
                {
                    insertQuery.Append($"[{prop}],");
                }

            });

            insertQuery
                .Remove(insertQuery.Length - 1, 1)
                .Append(") OUTPUT INSERTED.* VALUES (");

            properties.ForEach(prop => {
                if (prop != "ID")
                {
                    insertQuery.Append($"@{prop},");
                }
            });

            insertQuery
                .Remove(insertQuery.Length - 1, 1)
                .Append(")");

            return insertQuery.ToString();
        }

        private string GenerateUpdateQuery()
        {
            var updateQuery = new StringBuilder($"UPDATE {_tableName} SET ");
            var properties = GenerateListOfPropertyNames(GetProperties, true);

            properties.ForEach(property => {
                if (!property.Equals("ID"))
                {
                    updateQuery.Append($"{property}=@{property},");
                }
            });

            updateQuery.Append($"ModifiedDate=GETDATE()");
            //updateQuery.Remove(updateQuery.Length - 1, 1); //remove last comma
            updateQuery.Append(" WHERE ID=@ID");

            if (DbTables.DoesTableContainPlaceholders(_tableName))
            {
                updateQuery.Append(" AND isSystemOwned = 0");
            }

            return updateQuery.ToString();
        }

        private string GenerateExportQuery()
        {
            var selectQuery = new StringBuilder("SELECT ");
            var properties = GenerateListOfPropertyNames(GetProperties, false, true);
            properties.ForEach(prop => {
                selectQuery.Append($"[{prop}],");
            });

            selectQuery.Remove(selectQuery.Length - 1, 1)
                    .Append($" FROM {_tableName}");

            if (DbTables.DoesTableContainPlaceholders(_tableName))
            {
                selectQuery.Append(" WHERE isSystemOwned = 0");
            }

            return selectQuery.ToString();
        }
        #endregion
    }
}
