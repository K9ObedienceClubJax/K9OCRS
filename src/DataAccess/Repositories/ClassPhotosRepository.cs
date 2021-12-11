using DataAccess.Constants;
using DataAccess.Entities;

namespace DataAccess.Repositories
{
    public class ClassPhotosRepository : BaseRepository<ClassPhoto>
    {
        // Everytime that you create a repository, make sure you include a constructor that calls the "base constructor"
        // passing in the Db table name that is associated to it by using this syntax
        public ClassPhotosRepository() : base(DbTables.Get(nameof(ClassPhoto))) { }
    }
}
