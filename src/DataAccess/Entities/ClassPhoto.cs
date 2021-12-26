using DataAccess.Extensions;

namespace DataAccess.Entities
{
    public class ClassPhoto
    {
        public ClassPhoto() { }
        public ClassPhoto(ClassPhoto entity)
        {
            ID = entity.ID;
            ClassTypeID = entity.ClassTypeID;
            Filename = entity.Filename;
        }

        [TransactionIgnore]
        public int ID { get; set; }
        public int ClassTypeID { get; set; }
        public string Filename { get; set; }
    }
}
