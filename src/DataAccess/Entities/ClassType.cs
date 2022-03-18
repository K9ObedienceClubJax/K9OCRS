
using DataAccess.Extensions;
using System.Collections.Generic;

namespace DataAccess.Entities
{
    public class ClassType
    {
        public ClassType() { }
        public ClassType(ClassType entity)
        {
            ID = entity.ID;
            Title = entity.Title;
            Description = entity.Description;
            Requirements = entity.Requirements;
            ImageFilename = entity.ImageFilename;
            Duration = entity.Duration;
            Price = entity.Price;
            isArchived = entity.isArchived;
            isSystemOwned = entity.isSystemOwned;

            Photos = entity.Photos;
            Sections = entity.Sections;
        }

        /// <example>1</example>
        [TransactionIgnore]
        public int ID { get; set; }

        /// <example>Test Class Type 1</example>
        public string Title { get; set; }
        /// <example>This is a placeholder description for the test class type</example>
        public string Description { get; set; }
        /// <example>Two rounds of immunizations and at least 8 months old</example>
        public string Requirements { get; set; }
        /// <example>ClassPlaceholder.png</example>
        [TransactionIgnore]
        public string ImageFilename { get; set; }
        /// <example>7 weeks</example>
        public string Duration { get; set; }
        /// <example>140</example>
        public decimal Price { get; set; }
        /// <example>false</example>
        public bool isArchived { get; set; }
        /// <example>false</example>
        [TransactionIgnore]
        public bool isSystemOwned { get; set; }

        #region Data Optionally Hydrated

        [TransactionIgnore]
        [ExportIgnore]
        public List<ClassPhoto> Photos { get; set; }
        [TransactionIgnore]
        [ExportIgnore]
        public List<ClassSection> Sections { get; set; }

        #endregion
    }
}
