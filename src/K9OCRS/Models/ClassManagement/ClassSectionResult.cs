using DataAccess.Entities;

namespace K9OCRS.Models.ClassManagement
{
    public class ClassSectionResult : ClassSection
    {
        public new UserResult Instructor { get; set; }
        public new ClassTypeResult ClassType { get; set; }

        public ClassSectionResult(ClassSection entity, string storageBasePath) : base(entity)
        {
            Instructor = entity.Instructor != null ? new UserResult(entity.Instructor, storageBasePath) : null;
            ClassType = entity.ClassType != null ? new ClassTypeResult(entity.ClassType, storageBasePath) : null;
        }
    }
}
