
using DataAccess.Entities;

namespace K9OCRS.Models.Reporting
{
    public class ClassTypeExport
    {
        public ClassTypeExport(ClassType t)
        {
            ID = t.ID;
            Title = t.Title;
            Description = t.Description;
            Requirements = t.Requirements;
            ImageFilename = t.ImageFilename;
            Duration = t.Duration;
            Price = t.Price;
            isArchived = t.isArchived;
        }

        /// <example>1</example>
        public int ID { get; set; }

        /// <example>Test Class Type 1</example>
        public string Title { get; set; }
        /// <example>This is a placeholder description for the test class type</example>
        public string Description { get; set; }
        /// <example>Two rounds of immunizations and at least 8 months old</example>
        public string Requirements { get; set; }
        /// <example>ClassPlaceholder.png</example>
        public string ImageFilename { get; set; }
        /// <example>7 weeks</example>
        public string Duration { get; set; }
        /// <example>140</example>
        public decimal Price { get; set; }
        public bool isArchived { get; set; }
    }
}
