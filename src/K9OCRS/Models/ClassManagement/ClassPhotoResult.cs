using DataAccess.Constants;
using DataAccess.Entities;

namespace K9OCRS.Models.ClassManagement
{
    public class ClassPhotoResult : ClassPhoto
    {
        /// <example>K9Storage/classpictures/1/photos/1.jpg</example>
        public string ImageUrl { get; set; }

        public ClassPhotoResult(ClassPhoto entity, string storageBasePath) : base(entity) => ImageUrl = GenerateImageUrl(storageBasePath);

        // {basePath}/classpictures/{classTypeId}/photos/{filename}
        private string GenerateImageUrl(string storageBasepath) => string.Concat(
            storageBasepath,
            StorageContainers.Get(UploadType.ClassPicture), "/",
            StorageContainers.GetWithParams(UploadType.ClassPhoto, this.ClassTypeID), "/",
            this.Filename
        );
    }
}
