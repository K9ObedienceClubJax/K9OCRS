
namespace DataAccess.Entities
{
    public class ClassType
    {
        public int ID { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Requirements { get; set; }
        public string ImageFilename { get; set; } // Add a default later
        public string Duration { get; set; }
        public decimal Price { get; set; }
    }
}
