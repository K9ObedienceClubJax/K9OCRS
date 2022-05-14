using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace K9OCRS.Models.DogManagement
{
    public class DogUpdateRequest
    {
        [Required]
        public int ID { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Breed { get; set; }
        [Required]
        public DateTime DateOfBirth { get; set; }
        public IFormFile Image { get; set; }
        public IFormFile VaccinationRecord { get; set; }

        public IEnumerable<int> OwnerIdsToDelete { get; set; } = new List<int>();
        public IEnumerable<int> OwnersIdsToInsert { get; set; } = new List<int>();
    }
}
