using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using DataAccess;
using DataAccess.Entities;
using DataAccess.Modules.Contracts;
using DataAccess.Clients.Contracts;
using System;
using DataAccess.Constants;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using System.IO;
using K9OCRS.Extensions;
using Serilog;

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
        public ClassTypesController(
            ILogger logger,
            IStorageClient storageClient,
            IConnectionOwner connectionOwner,
            DbOwner dbOwner
        )
        {
            this.logger = logger;
            this.storageClient = storageClient;
            this.connectionOwner = connectionOwner;
            this.dbOwner = dbOwner;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllClassTypes()
        {
            var result = await connectionOwner.Use(conn =>
            {
                return dbOwner.ClassTypes.GetAll(conn);
            });

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetClassTypeByID(int id)
        {
            var result = await connectionOwner.Use(conn =>
            {
                return dbOwner.ClassTypes.GetByID(conn, id);
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

        [HttpPut("{classTypeId}/image")]
        public async Task<IActionResult> UpdateImage(int classTypeId, [FromForm] IFormFile file)
        {
            if (file != null)
            {
                var data = await file.ToBinaryData();

                var filename =  Path.Combine(classTypeId.ToString(), String.Concat(classTypeId, Path.GetExtension(file.FileName)));

                await storageClient.UploadFile(UploadType.ClassPicture, filename, file.ContentType, data);

                return Ok();
            }

            return BadRequest();
        }

        [HttpDelete("{classTypeId}/image/{filename}")]
        public async Task<IActionResult> DeleteImage(int classTypeId, string fileName)
        {
            if (fileName != null && fileName != "")
            {
                var filename = Path.Combine(classTypeId.ToString(), fileName);

                await storageClient.DeleteFile(UploadType.ClassPicture, filename);

                return Ok();
            }

            return BadRequest();
        }

        [HttpPost("{classTypeId}/photos")]
        public async Task<ActionResult> UploadPhotos(int classTypeId, [FromForm] List<IFormFile> files)
        {
            var tasks = new List<Task>();

            if (files != null && files.Count > 0)
            {
                for (int i = 0; i < files.Count; i++)
                {
                    var guid = Guid.NewGuid().ToString().ToUpper();
                    var data = await files[i].ToBinaryData();

                    var filename = Path.Combine(StorageContainers.GetWithParams(UploadType.ClassPhoto, classTypeId), String.Concat(guid, Path.GetExtension(files[i].FileName)));

                    tasks.Add(storageClient.UploadFile(UploadType.ClassPicture, filename, files[i].ContentType, data));
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

                    var filePath = Path.Combine(StorageContainers.GetWithParams(UploadType.ClassPhoto, classTypeId), fileNames[i]);

                    tasks.Add(storageClient.DeleteFile(UploadType.ClassPicture, filePath));
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
