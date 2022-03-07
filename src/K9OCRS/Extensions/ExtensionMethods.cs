using DataAccess.Entities;
using K9OCRS.Models.DogManagement;
using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Threading.Tasks;

namespace K9OCRS.Extensions
{
    public static class ExtensionMethods
    {
        public static async Task<BinaryData> ToBinaryData(this IFormFile file)
        {
            byte[] fileBytes;

            if (file != null)
            {
                using (var ms = new MemoryStream())
                {
                    await file.CopyToAsync(ms);
                    fileBytes = ms.ToArray();
                }

                return new BinaryData(fileBytes);
            }

            throw new ArgumentNullException();
        }

        #region Entity to Model Conversions

        public static DogResult ToDogResult(this Dog dog, string storageBasePath)
        {
            return new DogResult(dog, storageBasePath);
        }

        #endregion
    }
}
