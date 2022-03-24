using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace K9OCRS.Models
{
    public class ProfilePictureUpdateRequest
    {
        [Required]
        public int ID { get; set; }
        public IFormFile ImageUpdate { get; set; }
    }
}
