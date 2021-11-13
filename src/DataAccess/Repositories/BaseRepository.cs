using Dapper;
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

        public virtual async Task<IReadOnlyList<T>> GetAll(IDbConnection conn)
        {
            var result = await conn.QueryAsync<T>($"SELECT * FROM {_tableName}");
            return result.ToList();
        }
        public virtual async Task<int> Add(IDbConnection conn, T entity)
        {
            var insertQuery = GenerateInsertQuery();
            return await conn.ExecuteAsync(insertQuery, entity);
        }
        public virtual async Task<int> Update(IDbConnection conn, T entity)
        {
            var updateQuery = GenerateUpdateQuery();
            return await conn.ExecuteAsync(updateQuery, entity);
        }
        public virtual async Task<int> Delete(IDbConnection conn, int id)
        {
            return await conn.ExecuteAsync($"DELETE FROM {_tableName} WHERE ID=@Id", new { Id = id });
        }

        private IEnumerable<PropertyInfo> GetProperties => typeof(T).GetProperties();

        private static List<string> GenerateListOfProperties(IEnumerable<PropertyInfo> listOfProperties)
        {
            return (from prop in listOfProperties
                    let attributes = prop.GetCustomAttributes(typeof(DescriptionAttribute), false)
                    where attributes.Length <= 0 || (attributes[0] as DescriptionAttribute)?.Description != "ignore"
                    select prop.Name).ToList();
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
                .Append(") VALUES (");

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
            var properties = GenerateListOfProperties(GetProperties);

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
