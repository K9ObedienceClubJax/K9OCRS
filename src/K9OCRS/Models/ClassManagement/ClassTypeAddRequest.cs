using Microsoft.AspNetCore.Http;
using System.Collections.Generic;

namespace K9OCRS.Models.ClassManagement
{
    public class ClassTypeAddRequest
    {
        /// <example>Test Class Type 1</example>
        public string Title { get; set; }
        /// <example>This is a placeholder description for the test class type</example>
        public string Description { get; set; }
        /// <example>Two rounds of immunizations and at least 8 months old</example>
        public string Requirements { get; set; }
        /// <example>7 weeks</example>
        public string Duration { get; set; }
        /// <example>140</example>
        public decimal Price { get; set; }
        public bool isArchived { get; set; } = false;

        public IFormFile Image { get; set; }
        public List<IFormFile> Photos { get; set; }
    }
}
