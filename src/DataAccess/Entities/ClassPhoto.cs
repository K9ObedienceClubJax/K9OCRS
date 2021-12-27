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

        /// <example>1</example>
        [TransactionIgnore]
        public int ID { get; set; }
        /// <example>1</example>
        public int ClassTypeID { get; set; }
        /// <example>1.jpg</example>
        public string Filename { get; set; }
    }
}
