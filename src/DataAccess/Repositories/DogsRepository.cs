using Dapper;
using DataAccess.Constants;
using DataAccess.Entities;
using DataAccess.Repositories.Contracts;
using System.Data;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;


namespace DataAccess.Repositories
{
    public class DogsRepository : BaseRepository<Dog>, IDogRepository
    {

        // Everytime that you create a repository, make sure you include a constructor that calls the "base constructor"
        // passing in the Db table name that is associated to it by using this syntax
        public DogsRepository(IHttpContextAccessor _httpContextAccessor) : base(DbTables.Get(nameof(Dog)), _httpContextAccessor) { }
    }
}
