using Dapper;
using DataAccess.Constants;
using DataAccess.Entities;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace DataAccess.Repositories
{
    public class ClassSectionsRepository : BaseRepository<ClassSection>
    {
        // Everytime that you create a repository, make sure you include a constructor that calls the "base constructor"
        // passing in the Db table name that is associated to it by using this syntax
        public ClassSectionsRepository() : base(DbTables.Get(nameof(ClassSection))) { }

        public override async Task<IReadOnlyList<ClassSection>> GetAll(IDbConnection conn)
        {
            var query = @$"
                SELECT
	                cs.ID,
	                cs.ClassTypeID,
	                cs.InstructorID,
	                cs.isDraft,
	                cs.isSystemOwned,
	                cs.RosterCapacity,
	                css.RosterActual,
	                css.StartDate,
	                css.EndDate,
	                css.StartTime,
	                css.EndTime,
	                css.[Status],
	                -- Hydrate Instructor
	                u.FirstName,
	                u.LastName,
	                u.Email,
	                u.ProfilePictureFilename,
                    u.UserRoleID
                FROM ClassSections cs
                LEFT JOIN ClassSectionsStatus css ON css.ClassSectionID = cs.ID
                LEFT JOIN Users u ON cs.InstructorID = u.ID
                WHERE cs.isSystemOwned = 0
            ";

            var result = await conn.QueryAsync<ClassSection, User, ClassSection>(query,
            (section, instructor) =>
            {
                section.Instructor = new User
                {
                    ID = section.InstructorID,
                    UserRoleID = instructor.UserRoleID,
                    FirstName = instructor.FirstName,
                    LastName = instructor.LastName,
                    Email = instructor.Email,
                    ProfilePictureFilename = instructor.ProfilePictureFilename,
                };
                return section;
            },
            splitOn: "FirstName");
            return result.ToList();
        }

        public override async Task<ClassSection> GetByID(IDbConnection conn, int id)
        {
            var query = @"
                SELECT
	                cs.ID,
	                cs.ClassTypeID,
	                cs.InstructorID,
	                cs.isDraft,
	                cs.isSystemOwned,
	                cs.RosterCapacity,
	                css.RosterActual,
	                css.StartDate,
	                css.EndDate,
	                css.StartTime,
	                css.EndTime,
	                css.[Status],
	                -- Hydrate Instructor
	                u.FirstName,
	                u.LastName,
	                u.Email,
	                u.ProfilePictureFilename,
                    u.UserRoleID,
	                -- Hydrate Class Type
	                ct.Title,
	                ct.Price,
	                ct.Duration,
	                ct.[Description],
	                ct.Requirements,
	                ct.ImageFilename
                FROM ClassSections cs
                LEFT JOIN ClassSectionsStatus css ON css.ClassSectionID = cs.ID
                LEFT JOIN Users u ON cs.InstructorID = u.ID
                LEFT JOIN ClassTypes ct ON cs.ClassTypeID = ct.ID
                WHERE cs.ID = @Id
            ";

            var meetingsQuery = @"
                SELECT *
                FROM ClassMeetings cm
                WHERE cm.ClassSectionID = @ClassSectionID
            ";

            var classSection = (await conn.QueryAsync<ClassSection, User, ClassType, ClassSection>(query,
                (section, instructor, type) =>
                {
                    section.Instructor = new User
                    {
                        ID = section.InstructorID,
                        UserRoleID = instructor.UserRoleID,
                        FirstName = instructor.FirstName,
                        LastName = instructor.LastName,
                        Email = instructor.Email,
                        ProfilePictureFilename = instructor.ProfilePictureFilename,
                    };

                    section.ClassType = new ClassType
                    {
                        ID = section.ClassTypeID,
                        Title = type.Title,
                        Description = type.Description,
                        Duration = type.Duration,
                        Requirements = type.Requirements,
                        Price = type.Price,
                        ImageFilename = type.ImageFilename,
                    };

                    return section;
                },
                new { Id = id },
                splitOn: "FirstName,Title")).FirstOrDefault();

            var meetings = await conn.QueryAsync<ClassMeeting>(meetingsQuery, new { ClassSectionID = classSection.ID });

            classSection.Meetings = meetings.ToList();

            return classSection;
        }

        public override async Task<IReadOnlyList<ClassSection>> GetByID(IDbConnection conn, string idColumn, int id)
        {
            var query = @$"
                SELECT
	                cs.ID,
	                cs.ClassTypeID,
	                cs.InstructorID,
	                cs.isDraft,
	                cs.isSystemOwned,
	                cs.RosterCapacity,
	                css.RosterActual,
	                css.StartDate,
	                css.EndDate,
	                css.StartTime,
	                css.EndTime,
	                css.[Status],
	                -- Hydrate Instructor
	                u.FirstName,
	                u.LastName,
	                u.Email,
	                u.ProfilePictureFilename,
                    u.UserRoleID
                FROM ClassSections cs
                LEFT JOIN ClassSectionsStatus css ON css.ClassSectionID = cs.ID
                LEFT JOIN Users u ON cs.InstructorID = u.ID
                WHERE cs.[{idColumn}] = @Id
            ";

            var result = await conn.QueryAsync<ClassSection, User, ClassSection>(query,
            (section, instructor) =>
            {
                section.Instructor = new User
                {
                    ID = section.InstructorID,
                    UserRoleID = instructor.UserRoleID,
                    FirstName = instructor.FirstName,
                    LastName = instructor.LastName,
                    Email = instructor.Email,
                    ProfilePictureFilename = instructor.ProfilePictureFilename,
                };
                return section;
            },
            new { Id = id },
            splitOn: "FirstName");
            return result.ToList();
        }
    }
}
