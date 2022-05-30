using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using DataAccess;
using DataAccess.Entities;
using DataAccess.Modules.Contracts;
using DataAccess.Clients.Contracts;
using System;
using DataAccess.Constants;
using System.Collections.Generic;
using System.IO;
using K9OCRS.Utils.Extensions;
using Serilog;
using System.Linq;
using K9OCRS.Models.DogManagement;
using K9OCRS.Utils.Constants;
using Microsoft.AspNetCore.Authorization;
using K9OCRS.Models;
using Microsoft.AspNetCore.Http;
using System.Text.Json;

namespace K9OCRS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DogsController : ControllerBase
    {
        private readonly ILogger logger;
        private readonly IStorageClient storageClient;
        //uses repo
        private readonly IConnectionOwner connectionOwner;
        private readonly DbOwner dbOwner;
        //contains storage-based paths
        private readonly ServiceConstants serviceConstants;

        public DogsController(
            ILogger logger,
            ServiceConstants serviceConstants,
            IStorageClient storageClient,
            IConnectionOwner connectionOwner,
            DbOwner dbOwner
        )
        {
            this.logger = logger;
            //safe to storage
            this.storageClient = storageClient;
            //open connection to database
            this.connectionOwner = connectionOwner;
            this.dbOwner = dbOwner;

            this.serviceConstants = serviceConstants;
        }

        #region Dogs
        //create dog
        [HttpPost]
        public async Task<IActionResult> CreateDog([FromForm] DogAddRequest request)
        {
            try
            {
                var entity = new Dog
                {
                    Name = request.Name,
                    Breed = request.Breed,
                    DateOfBirth = request.DateOfBirth,
                };

                var result = await connectionOwner.UseTransaction(async (conn, tr) =>
                {
                    var dog = await dbOwner.Dogs.Add(conn, tr, entity);

                    if (request.OwnersIdsToInsert.Any())
                    {
                        var assignments = request.OwnersIdsToInsert.Select(userId => new UserDog
                        {
                            DogID = dog.ID,
                            UserID = userId,
                        }).ToList();

                        // Add all requested user-dog relationships
                        await dbOwner.UserDogs.AddMany(conn, tr, assignments);
                    }
                    else
                    {
                        // Assign dog to the user that created it
                        await dbOwner.UserDogs.AssignDogToCurrentUser(conn, tr, dog.ID);
                    }
                    
                    tr.Commit();
                    return dog;
                });

                if (request.Image != null)
                {
                    await UpdateImage(result.ID, new FileUpload
                    {
                        Files = new List<IFormFile> { request.Image },
                    });
                }

                if (request.VaccinationRecordsToAdd != null && request.VaccinationRecordsToAdd.Count > 0)
                {
                    await UploadRecords(result.ID, request.VaccinationRecordsToAdd);
                }

                return Ok(result);
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }

        //get list of dogs
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<DogResult>), 200)]
        public async Task<IActionResult> GetDogs()
        {
            try
            {
                var dogs = await connectionOwner.Use(conn =>
                {
                    return dbOwner.Dogs.GetAll(conn);
                });

                var dogResults = dogs.Select(d => d.ToDogResult(serviceConstants.storageBasePath));

                //returns list of dogs
                return Ok(dogResults);
            }
            catch(Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }

        // Get current user's dogs
        [HttpGet("owned")]
        [ProducesResponseType(typeof(IEnumerable<DogResult>), 200)]
        public async Task<IActionResult> GetCurrentUserDogs()
        {
            try
            {
                var dogs = await connectionOwner.Use(conn =>
                {
                    return dbOwner.Dogs.GetOwnedDogs(conn);
                });

                var dogResults = dogs.Select(d => d.ToDogResult(serviceConstants.storageBasePath));

                //returns list of dogs
                return Ok(dogResults);
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }

        //get a dog by Id
        [HttpGet("{Id}")]
        [ProducesResponseType(typeof(IEnumerable<DogResult>), 200)]
        public async Task<IActionResult> GetDog(int Id)
        {
            try
            {
                var (dog, owners, vaccinationRecords) = await connectionOwner.Use(async conn =>
                {
                    var _dog = await dbOwner.Dogs.GetByID(conn, Id);
                    var _owners = await dbOwner.Users.GetDogOwners(conn, Id);
                    var _vaccinationRecords = await dbOwner.VaccinationRecords.GetByID(conn, "DogID", Id);

                    return (_dog, _owners, _vaccinationRecords);
                });

                var dogResult = dog.ToDogResult(serviceConstants.storageBasePath);
                var ownerResults = owners.Select(o => o.ToUserResult(serviceConstants.storageBasePath)).ToList();
                var vaccinationRecordResults = vaccinationRecords
                    .Select(vr => vr.ToVaccinationRecordResult(serviceConstants.storageBasePath))
                    .ToList();

                dogResult.Owners = ownerResults;
                dogResult.VaccinationRecords = vaccinationRecordResults;

                //returns a dog
                return Ok(dogResult);
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }

        //update dog
        [HttpPut]
        public async Task<IActionResult> UpdateDog([FromForm] DogUpdateRequest request)
        {
            try
            {
                var existingDog = await connectionOwner.Use(conn => dbOwner.Dogs.GetByID(conn, request.ID));
                var result = await connectionOwner.UseTransaction(async (conn, tr) =>
                {
                    var entity = new Dog(existingDog);

                    entity.Name = request.Name;
                    entity.Breed = request.Breed;
                    entity.DateOfBirth = request.DateOfBirth;

                    var updatedCount = await dbOwner.Dogs.Update(conn, tr, entity);

                    if (updatedCount < 1) throw new KeyNotFoundException();

                    var deletedCount = 0;
                    var insertedCount = 0;

                    if (request.OwnersIdsToDelete.Any())
                    {
                        deletedCount = await dbOwner.UserDogs.DeleteManyByUserIds(conn, tr, request.ID, request.OwnersIdsToDelete);
                    }

                    if (request.OwnersIdsToInsert.Any())
                    {
                        var userDogs = request.OwnersIdsToInsert.Select(userId => new UserDog
                        {
                            DogID = request.ID,
                            UserID = userId,
                        }).ToList();

                        insertedCount = (await dbOwner.UserDogs.AddMany(conn, tr, userDogs)).Count();
                    }

                    if (
                        request.OwnersIdsToDelete.Count() != deletedCount ||
                        request.OwnersIdsToInsert.Count() != insertedCount
                    )
                    {
                        throw new Exception();
                    }

                    tr.Commit();

                    return updatedCount;
                });

                if (request.Image != null)
                {
                    await UpdateImage(request.ID, new FileUpload
                    {
                        Files = new List<IFormFile> { request.Image },
                    });
                }

                if (request.VaccinationRecordsToAdd != null && request.VaccinationRecordsToAdd.Count > 0)
                {
                    await UploadRecords(request.ID, request.VaccinationRecordsToAdd);
                }

                if (request.VaccinationRecordsToRemove != null)
                {
                    var vRecordsToRemove = JsonSerializer.Deserialize<IEnumerable<VaccinationRecord>>(request.VaccinationRecordsToRemove);
                    var fileNames = vRecordsToRemove.Select(vr => vr.Filename).ToList();
                    await DeleteRecords(request.ID, fileNames);
                }

                return Ok(result);
            }
            catch (Exception e)
            {
                if (e is KeyNotFoundException)
                {
                    return NotFound();
                }

                logger.Error(e, e.Message);
                return StatusCode(500, e.Message);
            }
        }

        [HttpPost("archive/{id}")]
        public async Task<IActionResult> ArchiveDog(int id)
        {
            var result = await connectionOwner.Use(conn => dbOwner.Dogs.Archive(conn, id));

            if (result < 1) NotFound("Could not find the requested dog");

            return Ok(result);
        }

        [HttpPost("unarchive/{id}")]
        public async Task<IActionResult> UnarchiveDog(int id)
        {
            var result = await connectionOwner.Use(conn => dbOwner.Dogs.Unarchive(conn, id));

            if (result < 1) NotFound("Could not find the requested dog");

            return Ok(result);
        }

        //delete dog
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDog(int id)
        {
            try
            {
                var result = await connectionOwner.Use(conn =>
                {
                    return dbOwner.Dogs.Delete(conn, id);
                });

                return Ok(result);
            }
            catch(Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }
        #endregion

        #region Dog_Photos
        [HttpGet("placeholderImageUrl")]
        [ProducesResponseType(typeof(string), 200)]
        public IActionResult GetPlaceholderImageUrl()
        {
            return Ok((new Dog { ProfilePictureFilename = "DogPlaceholder.png" })
                .ToDogResult(serviceConstants.storageBasePath)
                .ProfilePictureUrl);
        }

        [HttpPut("{dogId}/image")]
        public async Task<IActionResult> UpdateImage(int dogId, [FromForm] FileUpload upload)
        {
            if(upload.Files != null && upload.Files.Count > 0)
            {
                var data = await upload.Files[0].ToBinaryData();

                var filePath = String.Concat(dogId.ToString(), "/", dogId, Path.GetExtension(upload.Files[0].FileName));
                var filename = Path.GetFileName(filePath);

                await storageClient.UploadFile(UploadType.DogProfilePicture, filePath, upload.Files[0].ContentType, data);

                await connectionOwner.Use(conn =>
                {
                    return dbOwner.Dogs.UpdateImage(conn, dogId, filename);
                });

                return Ok();
            }

            return BadRequest();
        }

        [HttpDelete("{dogId}/image")]
        public async Task<int> DeleteImage(int dogId, [FromQuery] string fileName)
        {
            if (!String.IsNullOrEmpty(fileName) && !String.IsNullOrWhiteSpace(fileName))
            {
                var filename = String.Concat(dogId.ToString(), "/", fileName);

                await storageClient.DeleteFile(UploadType.DogProfilePicture, filename);

                return await connectionOwner.Use(conn => {
                    return dbOwner.Dogs.UpdateImage(conn, dogId, "DogPlaceholder.png");
                });
            }

            throw new ArgumentException();
        }

        #endregion

        #region Vaccination Records

        private async Task<ActionResult> UploadRecords(int dogId, List<IFormFile> files)
        {
            var tasks = new List<Task>();

            if (files != null && files.Count > 0)
            {
                for (int i = 0; i < files.Count; i++)
                {
                    var data = await files[i].ToBinaryData();
                    var ext = Path.GetExtension(files[i].FileName);
                    var contType = files[i].ContentType;

                    tasks.Add(connectionOwner.UseTransaction(async (conn, tr) => {
                        try
                        {
                            var vaccinationRecord = new VaccinationRecord
                            {
                                DogID = dogId,
                                Filename = "creating",
                            };

                            var vaccinationRecordResult = await dbOwner.VaccinationRecords.Add(conn, tr, vaccinationRecord);

                            var filePath = $"{dogId}/{vaccinationRecordResult.ID}-{dogId}-vrecord{ext}";

                            var filename = Path.GetFileName(filePath);

                            await storageClient.UploadFile(UploadType.VaccinationRecord, filePath, contType, data);

                            vaccinationRecord.ID = vaccinationRecordResult.ID;
                            vaccinationRecord.Filename = filename;

                            await dbOwner.VaccinationRecords.Update(conn, tr, vaccinationRecord);

                            tr.Commit();
                        }
                        catch (Exception ex)
                        {
                            tr.Rollback();
                            throw new Exception(ex.Message);
                        }
                    }));
                }

                try
                {
                    await Task.WhenAll(tasks);
                    return Ok();
                }
                catch (Exception e)
                {
                    logger.Error(e, "An error ocurred while uploading dog Vaccination Records");
                }
            }

            return BadRequest();
        }

        private async Task<ActionResult> DeleteRecords(int dogId, List<string> fileNames)
        {
            var tasks = new List<Task>();

            if (fileNames != null && fileNames.Count > 0)
            {
                for (int i = 0; i < fileNames.Count; i++)
                {
                    var filePath = $"{dogId}/{fileNames[i]}";

                    var vrecordId = Int32.Parse(fileNames[i].Substring(0, fileNames[i].IndexOf('-')));

                    tasks.Add(connectionOwner.UseTransaction(async (conn, tr) => {
                        try
                        {
                            await dbOwner.VaccinationRecords.Delete(conn, tr, vrecordId);
                            await storageClient.DeleteFile(UploadType.VaccinationRecord, filePath);
                            tr.Commit();
                        }
                        catch (Exception ex)
                        {
                            tr.Rollback();
                        }
                    }));
                }

                try
                {
                    await Task.WhenAll(tasks);
                    return Ok();
                }
                catch (Exception e)
                {
                    logger.Error(e, "An error ocurred while deleting vaccination records");
                }
            }

            return BadRequest();
        }

        #endregion
    }
}
