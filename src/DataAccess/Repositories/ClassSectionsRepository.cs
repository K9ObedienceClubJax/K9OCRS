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
            var query = @"
                SELECT
	                cs.*,
	                css.RosterActual,
	                css.StartDate,
	                css.EndDate,
	                css.[Status],
	                u.FirstName,
	                u.LastName,
	                u.Email,
	                u.ProfilePictureFilename
                FROM ClassSections cs
                JOIN ClassSectionsStatus css ON css.ClassSectionID = cs.ID
                JOIN Users u ON cs.InstructorID = u.ID
            ";

            var result = await conn.QueryAsync<ClassSection>(query);
            return result.ToList();
        }

        public override async Task<ClassSection> GetByID(IDbConnection conn, int id)
        {
            var query = @"
                SELECT
                    cs.*,
	                css.RosterActual,
	                css.StartDate,
	                css.EndDate,
	                css.[Status],
	                u.FirstName,
	                u.LastName,
	                u.Email,
	                u.ProfilePictureFilename
                FROM ClassSections cs
                JOIN ClassSectionsStatus css ON css.ClassSectionID = cs.ID
                JOIN Users u ON cs.InstructorID = u.ID
                WHERE ID = @Id
            ";

            var result = await conn.QuerySingleOrDefaultAsync<ClassSection>(query, new { Id = id });
            return result;
        }

        public override async Task<IReadOnlyList<ClassSection>> GetByID(IDbConnection conn, string idColumn, int id)
        {
            var query = $@"
                SELECT
                    cs.*,
	                css.RosterActual,
	                css.StartDate,
	                css.EndDate,
	                css.[Status],
	                u.FirstName,
	                u.LastName,
	                u.Email,
	                u.ProfilePictureFilename
                FROM ClassSections cs
                JOIN ClassSectionsStatus css ON css.ClassSectionID = cs.ID
                JOIN Users u ON cs.InstructorID = u.ID
                WHERE [{idColumn}] = @Id
            ";

            var result = await conn.QueryAsync<ClassSection>(query, new { Id = id });
            return result.ToList();
        }
    }
}
