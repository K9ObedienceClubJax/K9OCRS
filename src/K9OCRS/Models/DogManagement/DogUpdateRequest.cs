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
        public List<IFormFile> VaccinationRecordsToAdd { get; set; }
        // Array of VaccinationRecords objects sent as a json string
        public string VaccinationRecordsToRemove { get; set; }

        public IEnumerable<int> OwnersIdsToDelete { get; set; } = new List<int>();
        public IEnumerable<int> OwnersIdsToInsert { get; set; } = new List<int>();
    }
}
