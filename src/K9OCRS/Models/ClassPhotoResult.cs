using DataAccess.Constants;
using DataAccess.Entities;

namespace K9OCRS.Models
{
    public class ClassPhotoResult : ClassPhoto
    {
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
