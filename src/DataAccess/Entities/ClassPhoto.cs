using DataAccess.Extensions;

namespace DataAccess.Entities
{
    public class ClassPhoto
    {
        [TransactionIgnore]
        public int ID { get; set; }
        [TransactionIgnore]
        public int ClassTypeID { get; set; }
        public string Filename { get; set; }
    }
}
