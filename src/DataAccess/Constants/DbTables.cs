using DataAccess.Entities;
using System.Collections.Generic;

namespace DataAccess.Constants
{
    /// <summary>
    /// Contains a mapping between entity class names and the database table names they represent
    /// </summary>
    public class DbTables
    {
        private static Dictionary<string, string> mappings = new Dictionary<string, string>
        {
            { nameof(UserRole), "[dbo].[UserRoles]" },
            { nameof(User), "[dbo].[Users]" },
            { nameof(Dog), "[dbo].[Dogs]" },
            { nameof(UserDog), "[dbo].[UserDogs]" },
            { nameof(VaccinationRecord), "[dbo].[VaccinationRecords]" },
            { nameof(ClassPhoto), "[dbo].[ClassPhotos]" },
            { nameof(ClassType), "[dbo].[ClassTypes]" },
            { nameof(ClassSection), "[dbo].[ClassSections]" },
            { nameof(ClassMeeting), "[dbo].[ClassMeetings]" },
            { nameof(SectionApplication), "[dbo].[SectionApplications]" },
        };

        public static string Get(string entity) => mappings[entity];
    }
}
