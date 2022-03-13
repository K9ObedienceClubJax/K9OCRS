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
using K9OCRS.Extensions;
using Serilog;
using K9OCRS.Models;
using K9OCRS.Models.ClassManagement;
using K9OCRS.Configuration;
using System.Linq;
using Microsoft.AspNetCore.Http;
using System.Text.Json;

namespace K9OCRS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClassTypesController : ControllerBase
    {
        private readonly ILogger logger;
        private readonly IStorageClient storageClient;
        private readonly IConnectionOwner connectionOwner;
        private readonly DbOwner dbOwner;
        private readonly ServiceConstants serviceConstants;

        public ClassTypesController(
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

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<ClassTypeResult>), 200)]
        public async Task<IActionResult> GetClassesList([FromQuery] bool includeSections)
        {
            IEnumerable<ClassTypeResult> result = null;

            var (types, groupedSections) = await connectionOwner.Use(async conn =>
            {
                IEnumerable<ClassType> _types = null;
                Dictionary<int, List<ClassSectionResult>> _groupedSections = null;

                _types = await dbOwner.ClassTypes.GetAll(conn);

                if (includeSections)
                {
                    var sections = await dbOwner.ClassSections.GetAll(conn);

                    // Group sections by classTypeID
                    _groupedSections = sections.Aggregate(new Dictionary<int, List<ClassSectionResult>>(), (agg, s) =>
                    {
                        if (agg.ContainsKey(s.ClassTypeID))
                        {
                            agg[s.ClassTypeID].Add(s.ToClassSectionResult(serviceConstants.storageBasePath));
                        }
                        else
                        {
                            agg.Add(s.ClassTypeID, new List<ClassSectionResult> {
                                s.ToClassSectionResult(serviceConstants.storageBasePath)
                            });
                        }
                        return agg;
                    });
                }

                return (_types, _groupedSections);
            });

            if (includeSections)
            {
                result = types.Select(e => {
                    var r = e.ToClassTypeResult(serviceConstants.storageBasePath);
                    r.Sections = groupedSections.ContainsKey(e.ID) ? groupedSections[e.ID] : null;
                    return r;
                });
            }
            else
            {
                result = types.Select(e => e.ToClassTypeResult(serviceConstants.storageBasePath));
            }

            return Ok(result);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ClassTypeResult), 200)]
        public async Task<IActionResult> GetClassTypeDetails(int id)
        {
            var result = await connectionOwner.Use(async conn =>
            {
                // Get the data from the ClassTypes table
                var entity = (await dbOwner.ClassTypes.GetByID(conn, id)).ToClassTypeResult(serviceConstants.storageBasePath);

                // Get the list of photos related to the class type
                var photos = await dbOwner.ClassPhotos.GetByClassTypeID(conn, id);

                // Get the list of sections related to the class type
                var sections = await dbOwner.ClassSections.GetByID(conn, "ClassTypeID", id);

                // Combine the data using the Models
                var sectionResults = sections.Select(s => s.ToClassSectionResult(serviceConstants.storageBasePath));
                var photoResults = photos.Select(p => p.ToClassPhotoResult(serviceConstants.storageBasePath));

                entity.Photos = photoResults;
                entity.Sections = sectionResults;

                return entity;
            });

            return Ok(result);
        }

        [HttpGet("placeholderImageUrl")]
        [ProducesResponseType(typeof(string), 200)]
        public IActionResult GetPlaceholderImageUrl()
        {
            return Ok((new ClassType { ImageFilename = "ClassPlaceholder.png" })
                .ToClassTypeResult(serviceConstants.storageBasePath)
                .ImageUrl);
        }

        [HttpPost]
        public async Task<IActionResult> CreateClassType([FromForm] ClassTypeAddRequest request)
        {
            var result = await connectionOwner.UseTransaction(async (conn, tr) =>
            {
                try
                {
                    var type = await dbOwner.ClassTypes.Add(conn, tr, new ClassType
                    {
                        Title = request.Title,
                        Description = request.Description,
                        Requirements = request.Requirements,
                        Duration = request.Duration,
                        Price = request.Price,
                    });

                    tr.Commit();
                    return type;
                }
                catch
                {
                    tr.Rollback();
                    throw;
                }
            });

            if (request.Image != null)
            {
                await UpdateImage(result.ID, new FileUpload
                {
                    Files = new List<IFormFile> { request.Image },
                });
            }

            if (request.Photos != null)
            {
                await UploadPhotos(result.ID, new FileUpload
                {
                    Files = request.Photos,
                });
            }

            return Ok(result);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateClassType([FromForm] ClassTypeUpdateRequest request)
        {
            var result = await connectionOwner.UseTransaction(async (conn, tr) => {
                try
                {
                    var type = await dbOwner.ClassTypes.Update(conn, tr, new ClassType
                    {
                        ID = request.ID,
                        Title = request.Title,
                        Description = request.Description,
                        Requirements = request.Requirements,
                        Duration = request.Duration,
                        Price = request.Price,
                    });

                    tr.Commit();
                    return type;
                }
                catch
                {
                    tr.Rollback();
                    throw;
                }
            });

            if (request.ImageUpdate != null)
            {
                await UpdateImage(request.ID, new FileUpload
                {
                    Files = new List<IFormFile> { request.ImageUpdate },
                });
            }

            if (request.PhotosToAdd != null)
            {
                await UploadPhotos(request.ID, new FileUpload
                {
                    Files = request.PhotosToAdd,
                });
            }

            if (request.PhotosToRemove != null)
            {
                var photosToRemove = JsonSerializer.Deserialize<IEnumerable<ClassPhoto>>(request.PhotosToRemove);
                var fileNames = photosToRemove.Select(p => p.Filename).ToList();
                await DeletePhotos(request.ID, fileNames);
            }

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClassType(int id)
        {
            var photos = await GetPhotosByClassType(id);

            if (photos.Count > 0)
            {
                var fileNames = photos.Select(p => p.Filename).ToList();
                await DeletePhotos(id, fileNames);
            }

            var type = await connectionOwner.Use(conn =>
                dbOwner.ClassTypes.GetByID(conn, id));

            var result = await connectionOwner.UseTransaction(async (conn, tr) =>
            {
                try
                {
                    if (!type.ImageFilename.Contains("Placeholder"))
                    {
                        await DeleteImage(id, type.ImageFilename);
                    }

                    var affectedRows = await dbOwner.ClassTypes.Delete(conn, tr, id);

                    tr.Commit();
                    return affectedRows;
                }
                catch
                {
                    throw;
                }
            });

            return Ok(result);
        }

        #region ClassType_Image

        private async Task<int> UpdateImage(int classTypeId, FileUpload upload)
        {
            if (upload.Files != null && upload.Files.Count > 0)
            {
                var data = await upload.Files[0].ToBinaryData();

                var filePath = String.Concat(classTypeId.ToString(), "/", classTypeId, Path.GetExtension(upload.Files[0].FileName));
                var filename = Path.GetFileName(filePath);

                await storageClient.UploadFile(UploadType.ClassPicture, filePath, upload.Files[0].ContentType, data);

                return await connectionOwner.Use(conn =>
                {
                    return dbOwner.ClassTypes.UpdateImage(conn, classTypeId, filename);
                });
            }

            throw new ArgumentException();
        }


        private async Task<int> DeleteImage(int classTypeId, string fileName)
        {
            if (!String.IsNullOrEmpty(fileName) && !String.IsNullOrWhiteSpace(fileName))
            {
                var filename = String.Concat(classTypeId.ToString(), "/", fileName);

                await storageClient.DeleteFile(UploadType.ClassPicture, filename);

                return await connectionOwner.Use(conn =>
                {
                    return dbOwner.ClassTypes.UpdateImage(conn, classTypeId, "ClassPlaceholder.png");
                });
            }

            throw new ArgumentException();
        }

        #endregion

        #region ClassType_Photos

        private async Task<List<ClassPhoto>> GetPhotosByClassType(int classTypeId) =>
            (await connectionOwner.Use(conn => {
                return dbOwner.ClassPhotos.GetByClassTypeID(conn, classTypeId);
            })).ToList();

        private async Task<ActionResult> UploadPhotos(int classTypeId, FileUpload upload)
        {
            var tasks = new List<Task>();

            if (upload.Files != null && upload.Files.Count > 0)
            {
                for (int i = 0; i < upload.Files.Count; i++)
                {
                    var data = await upload.Files[i].ToBinaryData();
                    var ext = Path.GetExtension(upload.Files[i].FileName);
                    var contType = upload.Files[i].ContentType;

                    tasks.Add(connectionOwner.UseTransaction(async (conn, tr) =>
                    {
                        try
                        {
                            var photo = new ClassPhoto
                            {
                                ClassTypeID = classTypeId,
                                Filename = "creating",
                            };

                            var photoResult = await dbOwner.ClassPhotos.Add(conn, tr, photo);

                            var filePath = String.Concat(
                                StorageContainers.GetWithParams(UploadType.ClassPhoto, classTypeId),
                                "/",
                                photoResult.ID,
                                ext
                            );

                            var filename = Path.GetFileName(filePath);

                            await storageClient.UploadFile(UploadType.ClassPicture, filePath, contType, data);

                            photo.ID = photoResult.ID;
                            photo.Filename = filename;

                            await dbOwner.ClassPhotos.Update(conn, tr, photo);

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
                    logger.Error(e, "An error ocurred while uploading class photos");
                }
            }

            return BadRequest();
        }

        private async Task<ActionResult> DeletePhotos(int classTypeId, List<string> fileNames)
        {
            var tasks = new List<Task>();

            if (fileNames != null && fileNames.Count > 0)
            {
                for (int i = 0; i < fileNames.Count; i++)
                {

                    var filePath = String.Concat(
                        StorageContainers.GetWithParams(UploadType.ClassPhoto, classTypeId),
                        "/",
                        fileNames[i]
                    );

                    var photoId = Int32.Parse(fileNames[i].Substring(0, fileNames[i].IndexOf('.')));

                    tasks.Add(connectionOwner.UseTransaction(async (conn, tr) =>
                    {
                        try
                        {
                            await dbOwner.ClassPhotos.Delete(conn, tr, photoId);
                            await storageClient.DeleteFile(UploadType.ClassPicture, filePath);
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
                    logger.Error(e, "An error ocurred while deleting class photos");
                }
            }

            return BadRequest();
        }

        #endregion
    }
}
