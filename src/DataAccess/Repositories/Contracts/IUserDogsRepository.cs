using DataAccess.Entities;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace DataAccess.Repositories.Contracts
{
    public interface IUserDogsRepository : IRepository<UserDog>
    {
        public Task<UserDog> AssignDogToCurrentUser(IDbConnection conn, IDbTransaction tr, int dogId);
        public Task<int> DeleteManyByUserIds(IDbConnection conn, IDbTransaction tr, int dogId, IEnumerable<int> userIds);
    }
}
