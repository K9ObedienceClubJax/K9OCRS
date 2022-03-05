using Dapper;
using DataAccess.Extensions;
using DataAccess.Repositories.Contracts;
using System.Collections.Generic;
using System.ComponentModel;
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
    public abstract class BaseRepository<T> : IRepository<T> where T : class
    {
        public readonly string _tableName;

        protected BaseRepository(string tablename)
        {
            _tableName = tablename;
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
            var result = await conn.QueryAsync<T>($"SELECT * FROM {_tableName}");
            return result.ToList();
        }

        public virtual async Task<int> Add(IDbConnection conn, T entity)
        {
            var insertQuery = GenerateInsertQuery();
            return await conn.QueryFirstOrDefaultAsync<int>(insertQuery, entity);
        }

        public virtual async Task<int> Add(IDbConnection conn, IDbTransaction tr, T entity)
        {
            var insertQuery = GenerateInsertQuery();
            return await conn.QueryFirstOrDefaultAsync<int>(insertQuery, entity, tr);
        }

        public virtual async Task<int> Update(IDbConnection conn, T entity)
        {
            var updateQuery = GenerateUpdateQuery();
            return await conn.ExecuteAsync(updateQuery, entity);
        }

        public virtual async Task<int> Update(IDbConnection conn, IDbTransaction tr, T entity)
        {
            var updateQuery = GenerateUpdateQuery();
            return await conn.ExecuteAsync(updateQuery, entity, tr);
        }

        public virtual async Task<int> Delete(IDbConnection conn, int id)
        {
            return await conn.ExecuteAsync($"DELETE FROM {_tableName} WHERE ID=@Id", new { Id = id });
        }

        public virtual async Task<int> Delete(IDbConnection conn, IDbTransaction tr, int id)
        {
            return await conn.ExecuteAsync($"DELETE FROM {_tableName} WHERE ID=@Id", new { Id = id }, tr);
        }

        private IEnumerable<PropertyInfo> GetProperties => typeof(T).GetProperties();

        private static List<string> GenerateListOfProperties(IEnumerable<PropertyInfo> listOfProperties, bool isUpdate = false)
        {
            return (from prop in listOfProperties
                    let attributes = getIgnoredAttributes(prop, isUpdate)
                    //where attributes.Length <= 0 || (attributes[0] as DescriptionAttribute)?.Description != "RepoIgnore"
                    where attributes.Length <= 0
                    select prop.Name).ToList();
        }

        private static object[] getIgnoredAttributes(PropertyInfo prop, bool isUpdate = false)
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

        private string GenerateInsertQuery()
        {
            var insertQuery = new StringBuilder($"INSERT INTO {_tableName} ");

            insertQuery.Append("(");

            var properties = GenerateListOfProperties(GetProperties);
            properties.ForEach(prop => {
                if (prop != "ID")
                {
                    insertQuery.Append($"[{prop}],");
                }

            });

            insertQuery
                .Remove(insertQuery.Length - 1, 1)
                .Append(") OUTPUT INSERTED.ID VALUES (");

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
            var properties = GenerateListOfProperties(GetProperties, true);

            properties.ForEach(property =>
            {
                if (!property.Equals("ID"))
                {
                    updateQuery.Append($"{property}=@{property},");
                }
            });

            updateQuery.Remove(updateQuery.Length - 1, 1); //remove last comma
            updateQuery.Append(" WHERE ID=@ID");

            return updateQuery.ToString();
        }
    }
}
