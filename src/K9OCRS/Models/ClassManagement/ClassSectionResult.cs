using DataAccess.Entities;

namespace K9OCRS.Models.ClassManagement
{
    public class ClassSectionResult : ClassSection
    {
        public new UserResult Instructor { get; set; }
        public new ClassTypeResult ClassType { get; set; }

        public ClassSectionResult(ClassSection entity, string storageBasePath) : base(entity)
        {
            if (entity.Instructor != null)
                Instructor = new UserResult(entity.Instructor, storageBasePath);

            if (entity.ClassType != null)
                ClassType = new ClassTypeResult(entity.ClassType, storageBasePath);
        }
    }
}
