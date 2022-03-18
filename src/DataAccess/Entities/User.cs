
using DataAccess.Extensions;
using System.Collections.Generic;

namespace DataAccess.Entities
{
    public class User
    {
        public User() { }
        public User(User entity)
        {
            ID = entity.ID;
            UserRoleID = entity.UserRoleID;
            FirstName = entity.FirstName;
            LastName = entity.LastName;
            Email = entity.Email;
            Password = entity.Password;
            ProfilePictureFilename = entity.ProfilePictureFilename;
            isArchived = entity.isArchived;
            isSystemOwned = entity.isSystemOwned;
        }

        [TransactionIgnore]
        public int ID { get; set; }
        public int UserRoleID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        [ExportIgnore]
        public string Password { get; set; }
        [TransactionIgnore]
        public string ProfilePictureFilename { get; set; }
        public bool isArchived { get; set; }
        [TransactionIgnore]
        public bool isSystemOwned { get; set; }
    }
}
