using System.Collections.Generic;
using DataAccess.Entities;

namespace K9OCRS.Models
{
    public class ClassTypeResult : ClassType
    {
        public ClassTypeResult(ClassType entity)
        {
            this.ID = entity.ID;
            this.Title = entity.Title;
            this.Description = entity.Description;
            this.Requirements = entity.Requirements;
            this.ImageFilename = entity.ImageFilename;
            this.Price = entity.Price;
        }

        public IEnumerable<ClassPhoto> Photos { get; set; }
    }
}
