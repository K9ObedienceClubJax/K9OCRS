using DataAccess.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace K9OCRS.Models
{
    public class UserResult
    {
        public UserResult() { }
        public UserResult(User entity)
        {
            ID = entity.ID;
            UserRoleID = entity.UserRoleID;
            FirstName = entity.FirstName;
            LastName = entity.LastName;
            Email = entity.Email;
            ProfilePictureFilename = entity.ProfilePictureFilename;
        }
        public int ID { get; set; }
        public int UserRoleID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string ProfilePictureFilename { get; set; }
    }
}
