using DataAccess.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace K9OCRS.Models.ClassManagement
{
    public class ClassTypeDetails : ClassTypeResult
    {
        public IEnumerable<ClassPhotoResult> Photos { get; set; }

        public ClassTypeDetails(ClassType entity, string storageBasePath, IEnumerable<ClassPhotoResult> photos) : base(entity, storageBasePath) => Photos = photos;
        public ClassTypeDetails(ClassType entity, string storageBasePath, IEnumerable<ClassPhotoResult> photos, IEnumerable<ClassSectionResult> sections) : base(entity, storageBasePath, sections)
        {
            Photos = photos;
        }
    }
}
