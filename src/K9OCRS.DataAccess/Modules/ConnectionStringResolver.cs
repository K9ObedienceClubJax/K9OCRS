
namespace K9OCRS.DataAccess.Modules
{
    public class ConnectionStringResolver
    {
        public string DB_HOST { get; set; }
        public string DB_PORT { get; set; }
        public string DB_NAME { get; set; }
        public string DB_USER { get; set; }
        public string DB_PASS { get; set; }

        public string getConnectionString => $"Host={DB_HOST};Port={DB_PORT};Username={DB_USER};Password={DB_PASS};Database={DB_NAME};SSL Mode=Require;Trust Server Certificate=true";
    }
}
