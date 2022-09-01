using DataAccess.Constants;
using DataAccess.Entities;
using System.Collections.Generic;

namespace K9OCRS.Models.DogManagement
{
    public class DogResult : Dog
    {
        public string ProfilePictureUrl { get; set; }
        public List<UserResult> Owners { get; set; }
        public List<VaccinationRecordResult> VaccinationRecords { get; set; }

        public DogResult() { }
        public DogResult(Dog entity): base(entity) { }
        public DogResult(Dog entity, string storageBasePath) : this(entity) => ProfilePictureUrl = GenerateImageUrl(storageBasePath);

        // {basePath}/profilePictures/{userId}/{filename} or {basePath}/dogProfilePictures/{filename} if placeholder
        private string GenerateImageUrl(string storageBasepath)
        {
            var ending = this.ProfilePictureFilename.Contains("Placeholder") ? this.ProfilePictureFilename : string.Concat(this.ID, "/", this.ProfilePictureFilename);

            return string.Concat(storageBasepath, StorageContainers.Get(UploadType.DogProfilePicture), "/", ending);
        }
    }
}
