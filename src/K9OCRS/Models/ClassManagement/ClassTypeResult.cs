using DataAccess.Constants;
using DataAccess.Entities;
using K9OCRS.Extensions;
using System.Collections.Generic;
using System.Linq;

namespace K9OCRS.Models.ClassManagement
{
    public class ClassTypeResult : ClassType
    {
        /// <example>K9Storage/classpictures/ClassPlaceholder.png</example>
        public string ImageUrl { get; set; }
        public new IEnumerable<ClassPhotoResult> Photos { get; set; }
        public new IEnumerable<ClassSectionResult> Sections { get; set; }

        public ClassTypeResult(ClassType entity, string storageBasePath) : base(entity) {
            ImageUrl = GenerateImageUrl(storageBasePath);

            if (entity.Photos != null)
                Photos = entity.Photos.Select(p => p.ToClassPhotoResult(storageBasePath));

            if (entity.Sections != null)
                Sections = entity.Sections.Select(p => p.ToClassSectionResult(storageBasePath));
        }

        // {basePath}/classpictures/{classTypeId}/{filename} or {basePath}/classpictures/{filename} if placeholder
        private string GenerateImageUrl(string storageBasepath)
        {
            var ending = this.ImageFilename.Contains("Placeholder") ? this.ImageFilename : string.Concat(this.ID, "/", this.ImageFilename);

            return string.Concat(storageBasepath, StorageContainers.Get(UploadType.ClassPicture), "/", ending);
        }
    }
}
