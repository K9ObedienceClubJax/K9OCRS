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

namespace K9OCRS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClassTypesController : ControllerBase
    {
        private readonly ICloudStorageClient cloudStorageClient;
        private readonly IConnectionOwner connectionOwner;
        private readonly DbOwner dbOwner;
        public ClassTypesController(
            ICloudStorageClient cloudStorageClient,
            IConnectionOwner connectionOwner,
            DbOwner dbOwner
        )
        {
            this.cloudStorageClient = cloudStorageClient;
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

        [HttpPost("testImageUpload")]
        public async Task<ActionResult> UploadImage([FromForm] IFormFile file)
        {
            if (file != null)
            {
                var data = await file.ToBinaryData();

                var filename = "testImageUpload" + Path.GetExtension(file.FileName);

                await cloudStorageClient.UploadFile(UploadType.ClassPicture, filename, file.ContentType, data);

                return Ok();
            }

            return BadRequest();
        }
    }
}
