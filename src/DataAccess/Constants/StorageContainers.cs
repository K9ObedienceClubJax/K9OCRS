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
            { UploadType.ClassPhoto, "{0}/photos" }
        };

        public static string Get(UploadType type) => mappings[type];
        public static string GetWithParams(UploadType type, params object[] values) => String.Format(mappings[type], values);
    }
}
