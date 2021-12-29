using System;
using System.Threading.Tasks;
using DataAccess.Constants;

namespace DataAccess.Clients.Contracts
{
    public interface IStorageClient
    {
        public Task UploadFile(UploadType type, string name, string contentType, BinaryData content);
        public Task DeleteFile(UploadType type, string name);
    }
}
