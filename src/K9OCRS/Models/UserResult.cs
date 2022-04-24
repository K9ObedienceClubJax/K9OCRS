using DataAccess.Constants;
using DataAccess.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace K9OCRS.Models
{
    public class UserResult : BaseEntity
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
            isMember = entity.isMember;
            isArchived = entity.isArchived;
            isSystemOwned = entity.isSystemOwned;

            ModifiedByID = entity.ModifiedByID;
            ModifiedByName = entity.ModifiedByName;
            ModifiedDate = entity.ModifiedDate;
        }
        public UserResult(User entity, string storageBasePath) : this(entity) => ProfilePictureUrl = GenerateImageUrl(storageBasePath);
        public int ID { get; set; }
        public int UserRoleID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string ProfilePictureFilename { get; set; }
        public string ProfilePictureUrl { get; set; }
        public bool isMember { get; set; }
        public bool isArchived { get; set; }
        public bool isSystemOwned { get; set; }

        // {basePath}/profilePictures/{userId}/{filename} or {basePath}/profilePictures/{filename} if placeholder
        private string GenerateImageUrl(string storageBasepath)
        {
            var ending = this.ProfilePictureFilename.Contains("Placeholder") ? this.ProfilePictureFilename : string.Concat(this.ID, "/", this.ProfilePictureFilename);

            return string.Concat(storageBasepath, StorageContainers.Get(UploadType.ProfilePicture), "/", ending);
        }
    }
}
