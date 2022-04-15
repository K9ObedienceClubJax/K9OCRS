using DataAccess.Entities;
using Microsoft.AspNetCore.Http;

namespace DataAccess.Repositories
{
    public class UserDogsRepository : BaseRepository<UserDog>
    {
        // Everytime that you create a repository, make sure you include a constructor that calls the "base constructor"
        // passing in the Db table name that is associated to it by using this syntax
        public UserDogsRepository(IHttpContextAccessor _httpContextAccessor) : base(nameof(UserDog), _httpContextAccessor)
        {

        }
    }
}
