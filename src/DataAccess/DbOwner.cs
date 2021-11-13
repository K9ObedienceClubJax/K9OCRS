using DataAccess.Entities;
using DataAccess.Repositories;
using DataAccess.Repositories.Contracts;

namespace DataAccess
{
    /// <summary>
    /// This acts as a simple collection of repository instances so you can easily access any repository you need
    /// by simply getting this class injected where you need it.
    /// </summary>
    public class DbOwner
    {
        public readonly IRepository<ClassType> ClassTypes;
        
        public DbOwner()
        {
            ClassTypes = new ClassTypesRepository();
        }
    }
}
