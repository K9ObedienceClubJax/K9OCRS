using Microsoft.AspNetCore.Http;
using System;

namespace K9OCRS.Models.DogManagement
{
    public class DogUpdateRequest
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Breed { get; set; }
        public DateTime DateOfBirth { get; set; }
        public IFormFile Image { get; set; }
        public IFormFile VaccinationRecord { get; set; }
    }
}
