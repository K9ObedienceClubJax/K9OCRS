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
using K9OCRS.Configuration;
using System.Linq;

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
        public async Task<IActionResult> GetAllClassTypes()
        {
            var entities = await connectionOwner.Use(conn =>
            {
                return dbOwner.ClassTypes.GetAll(conn);
            });

            var result = entities.Select(e => new ClassTypeResult(e, serviceConstants.storageBasePath));

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetClassTypeByID(int id)
        {
            var result = await connectionOwner.Use(async conn =>
            {
                // Get the data from the ClassTypes table
                var entity = await dbOwner.ClassTypes.GetByID(conn, id);

                // Get the list of photos related to the class type
                var photos = await dbOwner.ClassPhotos.GetByClassTypeID(conn, id);

                var photoResults = photos.Select(p => new ClassPhotoResult(p, serviceConstants.storageBasePath));

                // Combine the data using the Model
                var result = new ClassTypeResult(entity, serviceConstants.storageBasePath, photoResults);

                return result;
            });

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateClassType(ClassType entity)
        {
            var result = await connectionOwner.Use(conn =>
            {
                return dbOwner.ClassTypes.Add(conn, entity);
            });

            return Ok(result);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateClassType(ClassType entity)
        {
            var result = await connectionOwner.Use(conn =>
            {
                return dbOwner.ClassTypes.Update(conn, entity);
            });

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClassType(int id)
        {
            var result = await connectionOwner.Use(conn =>
            {
                return dbOwner.ClassTypes.Delete(conn, id);
            });

            return Ok(result);
        }

        [HttpGet("{classTypeId}/photos")]
        public async Task<IActionResult> GetPhotosByClassTypeID(int classTypeId)
        {
            var result = await connectionOwner.Use(conn =>
            {
                return dbOwner.ClassPhotos.GetByClassTypeID(conn, classTypeId);
            });

            var photoResults = result.Select(p => new ClassPhotoResult(p, serviceConstants.storageBasePath));

            return Ok(photoResults);
        }

        [HttpPut("{classTypeId}/image")]
        public async Task<IActionResult> UpdateImage(int classTypeId, [FromForm] FileUpload upload)
        {
            if (upload.Files != null && upload.Files.Count > 0)
            {
                var data = await upload.Files[0].ToBinaryData();

                var filePath = String.Concat(classTypeId.ToString(), "/", classTypeId, Path.GetExtension(upload.Files[0].FileName));
                var filename = Path.GetFileName(filePath);

                await storageClient.UploadFile(UploadType.ClassPicture, filePath, upload.Files[0].ContentType, data);

                await connectionOwner.Use(conn =>
                {
                    return dbOwner.ClassTypes.UpdateImage(conn, classTypeId, filename);
                });

                return Ok();
            }

            return BadRequest();
        }

        [HttpDelete("{classTypeId}/image/{filename}")]
        public async Task<IActionResult> DeleteImage(int classTypeId, string fileName)
        {
            if (!String.IsNullOrEmpty(fileName) && !String.IsNullOrWhiteSpace(fileName))
            {
                var filename = String.Concat(classTypeId.ToString(), "/", fileName);

                await storageClient.DeleteFile(UploadType.ClassPicture, filename);

                await connectionOwner.Use(conn =>
                {
                    return dbOwner.ClassTypes.UpdateImage(conn, classTypeId, "ClassPlaceholder.png");
                });

                return Ok();
            }

            return BadRequest();
        }

        [HttpPost("{classTypeId}/photos")]
        public async Task<ActionResult> UploadPhotos(int classTypeId, [FromForm] FileUpload upload)
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

                            var classPhotoId = await dbOwner.ClassPhotos.Add(conn, tr, photo);

                            var filePath = String.Concat(
                                StorageContainers.GetWithParams(UploadType.ClassPhoto, classTypeId),
                                "/",
                                classPhotoId,
                                ext
                            );

                            var filename = Path.GetFileName(filePath);

                            await storageClient.UploadFile(UploadType.ClassPicture, filePath, contType, data);

                            photo.ID = classPhotoId;
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

        [HttpDelete("{classTypeId}/photos")]
        public async Task<ActionResult> DeletePhotos(int classTypeId, [FromBody] List<string> fileNames)
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
    }
}
