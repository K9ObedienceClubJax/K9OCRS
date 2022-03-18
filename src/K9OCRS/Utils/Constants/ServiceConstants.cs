
namespace K9OCRS.Utils.Constants
{
    public class ServiceConstants
    {
        public readonly string storageBasePath;
        public readonly string jwtKey;
        public ServiceConstants(
            string storageBasePath,
            string jwtKey
        )
        {
            this.storageBasePath = storageBasePath;
            this.jwtKey = jwtKey;
        }
    }
}
