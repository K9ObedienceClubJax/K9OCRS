using DataAccess.Entities;
using DataAccess.Repositories;
using DataAccess.Repositories.Contracts;
using Microsoft.AspNetCore.Http;

namespace DataAccess
{
    /// <summary>
    /// This acts as a simple collection of repository instances so you can easily access any repository you need
    /// by simply getting this class injected where you need it.
    /// </summary>
    public class DbOwner
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public readonly IRepository<UserRole> UserRoles;
        public readonly IUsersRepository Users;
        public readonly IDogRepository Dogs;
        public readonly IRepository<UserDog> UserDogs;
        public readonly IRepository<VaccinationRecord> VaccinationRecords;
        public readonly IClassPhotosRepository ClassPhotos;
        public readonly IClassTypesRepository ClassTypes;
        public readonly IClassSectionsRepository ClassSections;
        public readonly IRepository<ClassMeeting> ClassMeetings;
        public readonly IRepository<ClassApplication> ClassApplications;

        public DbOwner(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;

            UserRoles = new UserRolesRepository(_httpContextAccessor);
            Users = new UsersRepository(_httpContextAccessor);
            Dogs = new DogsRepository(_httpContextAccessor);
            UserDogs = new UserDogsRepository(_httpContextAccessor);
            VaccinationRecords = new VaccinationRecordsRepository(_httpContextAccessor);
            ClassPhotos = new ClassPhotosRepository(_httpContextAccessor);
            ClassTypes = new ClassTypesRepository(_httpContextAccessor);
            ClassSections = new ClassSectionsRepository(_httpContextAccessor);
            ClassMeetings = new ClassMeetingsRepository(_httpContextAccessor);
            ClassApplications = new ClassApplicationsRepository(_httpContextAccessor);
        }
    }
}
