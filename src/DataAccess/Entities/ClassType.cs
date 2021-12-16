
using DataAccess.Extensions;

namespace DataAccess.Entities
{
    public class ClassType
    {
        [TransactionIgnore]
        public int ID { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Requirements { get; set; }
        [TransactionIgnore]
        public string ImageFilename { get; set; }
        public string Duration { get; set; }
        public decimal Price { get; set; }
    }
}
