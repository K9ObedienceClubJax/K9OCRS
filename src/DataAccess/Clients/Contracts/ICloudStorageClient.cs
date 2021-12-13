using System;
using System.Threading.Tasks;
using DataAccess.Constants;

namespace DataAccess.Clients.Contracts
{
    public interface ICloudStorageClient
    {
        public Task UploadFile(UploadType type, string name, BinaryData content);
        public Task DeleteFile(UploadType type, string name);
    }
}
