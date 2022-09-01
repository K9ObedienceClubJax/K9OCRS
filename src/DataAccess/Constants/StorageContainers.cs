using System;
using System.Collections.Generic;

namespace DataAccess.Constants
{
    public class StorageContainers
    {
        private static Dictionary<UploadType, string> mappings = new Dictionary<UploadType, string>
        {
            { UploadType.ProfilePicture, "profilepictures" },
            { UploadType.DogProfilePicture, "dogprofilepictures" },
            { UploadType.VaccinationRecord, "vaccinationrecords" },
            { UploadType.ClassPicture, "classpictures" },
        };

        private static Dictionary<UploadType, string> parameterizedMappings = new Dictionary<UploadType, string>
        {
            { UploadType.ClassPhoto, "{0}/photos" },
            { UploadType.VaccinationRecord, "vaccinationrecords/{0}" }
        };

        public static string Get(UploadType type) => mappings[type];
        public static string GetWithParams(UploadType type, params object[] values) =>
            String.Format(parameterizedMappings[type], values);
    }
}
