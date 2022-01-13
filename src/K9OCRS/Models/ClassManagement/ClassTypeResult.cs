using DataAccess.Constants;
using DataAccess.Entities;
using System.Collections.Generic;

namespace K9OCRS.Models.ClassManagement
{
    public class ClassTypeResult : ClassType
    {
        /// <example>K9Storage/classpictures/ClassPlaceholder.png</example>
        public string ImageUrl { get; set; }
        public IEnumerable<ClassPhotoResult> Photos { get; set; }
        public IEnumerable<ClassSectionResult> Sections { get; set; }

        public ClassTypeResult(ClassType entity, string storageBasePath) : base(entity) => ImageUrl = GenerateImageUrl(storageBasePath);
        public ClassTypeResult(ClassType entity, string storageBasePath, IEnumerable<ClassPhotoResult> photos) : this(entity, storageBasePath) => Photos = photos;

        // {basePath}/classpictures/{classTypeId}/{filename} or {basePath}/classpictures/{filename} if placeholder
        private string GenerateImageUrl(string storageBasepath)
        {
            var ending = this.ImageFilename.Contains("Placeholder") ? this.ImageFilename : string.Concat(this.ID, "/", this.ImageFilename);

            return string.Concat(storageBasepath, StorageContainers.Get(UploadType.ClassPicture), "/", ending);
        }
    }
}
