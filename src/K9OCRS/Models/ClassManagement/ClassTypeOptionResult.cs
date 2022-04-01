using DataAccess.Entities;

namespace K9OCRS.Models.ClassManagement
{
    public class ClassTypeOptionResult
    {
        public int ID { get; set; }
        public string Title { get; set; }

        public ClassTypeOptionResult(ClassType entity)
        {
            ID = entity.ID;
            Title = entity.Title;
        }
    }
}
