using CsvHelper;
using DataAccess;
using DataAccess.Clients.Contracts;
using DataAccess.Extensions;
using DataAccess.Modules.Contracts;
using K9OCRS.Utils.Constants;
using K9OCRS.Utils.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Globalization;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace K9OCRS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ReportingController : ControllerBase
    {
        private readonly ILogger logger;
        private readonly IStorageClient storageClient;
        private readonly IConnectionOwner connectionOwner;
        private readonly DbOwner dbOwner;
        private readonly ServiceConstants serviceConstants;

        public ReportingController(
            ILogger logger,
            ServiceConstants serviceConstants,
            IStorageClient storageClient,
            IConnectionOwner connectionOwner,
            DbOwner dbOwner
        )
        {
            this.logger = logger;
            this.storageClient = storageClient;
            this.connectionOwner = connectionOwner;
            this.dbOwner = dbOwner;

            this.serviceConstants = serviceConstants;
        }

        [HttpGet("export")]
        [Authorize(Roles = nameof(UserRoles.Admin))]
        public async Task<IActionResult> DBExport()
        {
            // Get Data
            var (
                userRoles,
                users,
                dogs,
                userDogs,
                vaccinationRecords,
                classTypes,
                classPhotos,
                classSections,
                classMeetings,
                classApplications
            ) = await connectionOwner.Use(async conn => {
                var userRoles = await dbOwner.UserRoles.GetTableExport(conn);
                var users = await dbOwner.Users.GetTableExport(conn);
                var dogs = await dbOwner.Dogs.GetTableExport(conn);
                var userDogs = await dbOwner.UserDogs.GetTableExport(conn);
                var vaccinationRecords = await dbOwner.VaccinationRecords.GetTableExport(conn);

                var classTypes = (await dbOwner.ClassTypes.GetTableExport(conn)).Select(t => t.ToClassTypeExport());
                var classPhotos = await dbOwner.ClassPhotos.GetTableExport(conn);
                var classSections = (await dbOwner.ClassSections.GetTableExport(conn)).Select(s => s.ToClassSectionExport());
                var classMeetings = await dbOwner.ClassMeetings.GetTableExport(conn);
                var classApplications = await dbOwner.ClassApplications.GetTableExport(conn);

                return (
                    userRoles,
                    users,
                    dogs,
                    userDogs,
                    vaccinationRecords,
                    classTypes,
                    classPhotos,
                    classSections,
                    classMeetings,
                    classApplications
                );
            });

            // Create Zip File
            FileStreamResult fileStreamResult;
            var memoryStream = new MemoryStream();
            using (var archive = new ZipArchive(memoryStream, ZipArchiveMode.Create, true))
            {
                // Create CSV files inside Zip file
                var userRolesFile = archive.CreateEntry("userRoles.csv");
                WriteCsvFile(userRolesFile, userRoles);

                var usersFile = archive.CreateEntry("users.csv");
                WriteCsvFile(usersFile, users);

                var dogsFile = archive.CreateEntry("dogs.csv");
                WriteCsvFile(dogsFile, dogs);

                var userDogsFile = archive.CreateEntry("userDogs.csv");
                WriteCsvFile(userDogsFile, userDogs);

                var vaccinationRecordsFile = archive.CreateEntry("vaccinationRecords.csv");
                WriteCsvFile(vaccinationRecordsFile, vaccinationRecords);

                var classTypesFile = archive.CreateEntry("classTypes.csv");
                WriteCsvFile(classTypesFile, classTypes);

                var classPhotosFile = archive.CreateEntry("classPhotos.csv");
                WriteCsvFile(classPhotosFile, classPhotos);

                var classSectionsFile = archive.CreateEntry("classSections.csv");
                WriteCsvFile(classSectionsFile, classSections);

                var classMeetingsFile = archive.CreateEntry("classMeetings.csv");
                WriteCsvFile(classMeetingsFile, classMeetings);

                var classApplicationsFile = archive.CreateEntry("classApplications.csv");
                WriteCsvFile(classApplicationsFile, classApplications);
            }

            // Must return the position of the stream to zero so it can be used by the FileStreamResult
            memoryStream.Seek(0, SeekOrigin.Begin);

            // Create the HTTP result for the zip file
            fileStreamResult = new FileStreamResult(memoryStream, "application/zip");

            // Name the zip file
            fileStreamResult.FileDownloadName = $"k9ocrs_export-{DateTime.Now.ToString("MM-dd-yyyy-HHmm")}.zip";

            return fileStreamResult;
        }

        private void WriteCsvFile<T>(ZipArchiveEntry entry, IEnumerable<T> records)
        {
            var entryStream = entry.Open();
            var streamWriter = new StreamWriter(entryStream);
            var csv = new CsvWriter(streamWriter, CultureInfo.InvariantCulture);

            // Get list of filtered properties
            var listOfProperties = GenerateListOfProperties(typeof(T).GetProperties());


            // Filter export ignored properties so they don't show on the csv file
            var transformedRecords = records.Select(r => {
                dynamic exo = new ExpandoObject();

                // Build the dynamic object with the filtered properties
                foreach (PropertyInfo prop in listOfProperties)
                {
                    ((IDictionary<String, Object>)exo).Add(prop.Name, prop.GetValue(r));
                }

                return exo;
            });

            csv.WriteRecords(transformedRecords);
            streamWriter.Flush();
            entryStream.Dispose();
        }

        private static List<PropertyInfo> GenerateListOfProperties(IEnumerable<PropertyInfo> listOfProperties)
        {
            return (from prop in listOfProperties
                    let attributes = prop.GetCustomAttributes(typeof(ExportIgnoreAttribute), false)
                    where attributes.Length <= 0
                    select prop).ToList();
        }
    }
}
