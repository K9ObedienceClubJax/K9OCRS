using System;
using Azure;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using DataAccess.Clients.Contracts;
using DataAccess.Constants;
using System.Threading.Tasks;

namespace DataAccess.Clients
{
    public class AzureStorageClient : ICloudStorageClient
    {
        private readonly BlobContainerClient profilePicturesContainerClient;
        private readonly BlobContainerClient dogProfilePicturesContainerClient;
        private readonly BlobContainerClient vaccinationRecordsContainerClient;
        private readonly BlobContainerClient classPicturesContainerClient;

        public AzureStorageClient(string connectionString)
        {
            profilePicturesContainerClient = new BlobContainerClient(connectionString, "profilepictures");
            dogProfilePicturesContainerClient = new BlobContainerClient(connectionString, "dogprofilepictures");
            vaccinationRecordsContainerClient = new BlobContainerClient(connectionString, "vaccinationrecords");
            classPicturesContainerClient = new BlobContainerClient(connectionString, "classpictures");
        }

        // Upload
        public async Task UploadFile(UploadType type, string name, string contentType, BinaryData content)
        {
            BlobContainerClient containerClient = GetContainerClient(type);
            BlobClient blobClient = containerClient.GetBlobClient(name);

            var uploadOptions = new BlobUploadOptions
            {
                HttpHeaders = new BlobHttpHeaders
                {
                    ContentType = contentType,
                },
            };

            await blobClient.UploadAsync(content, uploadOptions);
        }

        // Delete
        public async Task DeleteFile(UploadType type, string name)
        {
            BlobContainerClient containerClient = GetContainerClient(type);

            await containerClient.DeleteBlobIfExistsAsync(name, DeleteSnapshotsOption.IncludeSnapshots);
        }

        // Utility
        private BlobContainerClient GetContainerClient(UploadType type)
        {
            switch (type)
            {
                case UploadType.ProfilePicture:
                    return profilePicturesContainerClient;
                case UploadType.DogProfilePicture:
                    return dogProfilePicturesContainerClient;
                case UploadType.VaccinationRecord:
                    return vaccinationRecordsContainerClient;
                case UploadType.ClassPicture:
                    return classPicturesContainerClient;
                default:
                    throw new ArgumentException("Invalid UploadType");
            }
        }
    }
}
