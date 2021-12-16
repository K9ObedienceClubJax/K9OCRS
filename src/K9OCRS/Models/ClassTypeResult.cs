using System.Collections.Generic;
using DataAccess.Constants;
using DataAccess.Entities;

namespace K9OCRS.Models
{
    public class ClassTypeResult : ClassType
    {
        public ClassTypeResult(ClassType entity, string storageBasePath)
        {
            this.ID = entity.ID;
            this.Title = entity.Title;
            this.Description = entity.Description;
            this.Requirements = entity.Requirements;
            this.ImageFilename = entity.ImageFilename;
            this.Duration = entity.Duration;
            this.Price = entity.Price;

            this.ImageUrl = GenerateImageUrl(storageBasePath);
        }

        public string ImageUrl { get; set; }
        public IEnumerable<ClassPhoto> Photos { get; set; }

        private string GenerateImageUrl(string storageBasepath)
        {
            var ending = this.ImageFilename.Contains("Placeholder") ? this.ImageFilename : string.Concat(this.ID, "/", this.ImageFilename);

            return string.Concat(storageBasepath, StorageContainers.Get(UploadType.ClassPicture), "/", ending);
        }
    }
}
