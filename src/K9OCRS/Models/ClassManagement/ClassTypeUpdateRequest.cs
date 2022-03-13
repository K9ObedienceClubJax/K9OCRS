using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace K9OCRS.Models.ClassManagement
{
    public class ClassTypeUpdateRequest
    {
        /// <example>15</example>
        [Required]
        public int ID { get; set; }
        /// <example>Test Class Type 1</example>
        [Required]
        public string Title { get; set; }
        /// <example>This is a placeholder description for the test class type</example>
        [Required]
        public string Description { get; set; }
        /// <example>Two rounds of immunizations and at least 8 months old</example>
        public string Requirements { get; set; }
        /// <example>7 weeks</example>
        [Required]
        public string Duration { get; set; }
        /// <example>140</example>
        [Required]
        public decimal Price { get; set; }

        public IFormFile ImageUpdate { get; set; }
        public List<IFormFile> PhotosToAdd { get; set; }
        // Array of ClassPhoto objects sent as a json string
        public string PhotosToRemove { get; set; }
    }
}
