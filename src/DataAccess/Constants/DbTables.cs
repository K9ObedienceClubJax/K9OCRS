using DataAccess.Entities;
using System.Collections.Generic;

namespace DataAccess.Constants
{
    /// <summary>
    /// Contains a mapping between entity class names and the database table names they represent
    /// </summary>
    public class DbTables
    {
        private static Dictionary<string, string> mappings = new Dictionary<string, string>
        {
            { nameof(ClassType), "[dbo].[ClassTypes]" },
        };

        public static string Get(string entity) => mappings[entity];
    }
}
