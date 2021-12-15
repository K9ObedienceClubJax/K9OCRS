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
        private readonly IStorageClient storageClient;
        private readonly IConnectionOwner connectionOwner;
        private readonly DbOwner dbOwner;
        public ClassTypesController(
            IStorageClient storageClient,
            IConnectionOwner connectionOwner,
            DbOwner dbOwner
        )
        {
            this.storageClient = storageClient;
            this.connectionOwner = connectionOwner;
            this.dbOwner = dbOwner;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllProducts()
        {
            var result = await connectionOwner.Use(conn =>
            {
                return dbOwner.ClassTypes.GetAll(conn);
            });

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductByID(int id)
        {
            var result = await connectionOwner.Use(conn =>
            {
                return dbOwner.ClassTypes.GetByID(conn, id);
            });

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateProduct(ClassType entity)
        {
            var result = await connectionOwner.Use(conn =>
            {
                return dbOwner.ClassTypes.Add(conn, entity);
            });

            return Ok(result);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateProduct(ClassType entity)
        {
            var result = await connectionOwner.Use(conn =>
            {
                return dbOwner.ClassTypes.Update(conn, entity);
            });

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
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

                await storageClient.UploadFile(UploadType.ClassPicture, filename, file.ContentType, data);

                return Ok();
            }

            return BadRequest();
        }
    }
}
