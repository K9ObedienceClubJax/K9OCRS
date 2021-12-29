using Microsoft.AspNetCore.Http;
using System.Collections.Generic;

namespace K9OCRS.Models
{
    /// <summary>
    /// This is necessary for Swagger to function with file uploads
    /// </summary>
    public class FileUpload
    {
        public List<IFormFile> Files { get; set; }
    }
}
