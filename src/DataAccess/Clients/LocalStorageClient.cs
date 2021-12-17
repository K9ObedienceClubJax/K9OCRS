using DataAccess.Clients.Contracts;
using DataAccess.Constants;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Clients
{
    public class LocalStorageClient : IStorageClient
    {
        private readonly Dictionary<UploadType, string> containers;

        public LocalStorageClient(string localStorageBasePath)
        {
            containers = new Dictionary<UploadType, string>
            {
                {
                    UploadType.ProfilePicture,  Path.Combine(localStorageBasePath,
                    StorageContainers.Get(UploadType.ProfilePicture))
                },
                {
                    UploadType.DogProfilePicture,  Path.Combine(localStorageBasePath,
                    StorageContainers.Get(UploadType.DogProfilePicture))
                },
                {
                    UploadType.VaccinationRecord,  Path.Combine(localStorageBasePath,
                    StorageContainers.Get(UploadType.VaccinationRecord))
                },
                {
                    UploadType.ClassPicture,
                    Path.Combine(localStorageBasePath, StorageContainers.Get(UploadType.ClassPicture))
                }
            };

            // Setup Folder Structure
            Directory.CreateDirectory(containers[UploadType.ProfilePicture]);
            Directory.CreateDirectory(containers[UploadType.DogProfilePicture]);
            Directory.CreateDirectory(containers[UploadType.VaccinationRecord]);
            Directory.CreateDirectory(containers[UploadType.ClassPicture]);
        }

        // Upload
        public async Task UploadFile(UploadType type, string name, string contentType, BinaryData content)
        {
            var filepath = String.Concat(containers[type], "/", name);
            var dirPath = Path.GetDirectoryName(filepath);
            // Ensures the full directory path exists, necessary for container sub folders
            Directory.CreateDirectory(dirPath);
            await File.WriteAllBytesAsync(filepath, content.ToArray());
        }

        // Delete
        // This needs to stay as an async method for the sake of way the controller will call it
        public async Task DeleteFile(UploadType type, string name)
        {
            var filepath = String.Concat(containers[type], "/", name);
            var dirPath = Path.GetDirectoryName(filepath);
            
            File.Delete(filepath);

            // Delete the directories if empty
            try
            {
                Directory.Delete(dirPath);

                // Also delete the parent directory if empty
                if (type == UploadType.ClassPhoto)
                {
                    var parentPath = Directory.GetParent(dirPath).FullName;
                    Directory.Delete(parentPath);
                }
            }
            catch (Exception ex)
            {
                if (ex is IOException || ex is DirectoryNotFoundException)
                {
                    // Ignore these types of exceptions since the end result is the same as success.
                }
            }
        }
    }
}
