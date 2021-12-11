using DataAccess.Constants;
using DataAccess.Entities;

namespace DataAccess.Repositories
{
    public class ClassSectionsRepository : BaseRepository<ClassSection>
    {
        // Everytime that you create a repository, make sure you include a constructor that calls the "base constructor"
        // passing in the Db table name that is associated to it by using this syntax
        public ClassSectionsRepository() : base(DbTables.Get(nameof(ClassSection))) { }
    }
}
