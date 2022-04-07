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
using K9OCRS.Configuration;
using System.Linq;
using System.Collections.Generic;
using K9OCRS.Models.DogManagement;
using K9OCRS.Utils.Constants;
using K9OCRS.Utils.Extensions;
using Microsoft.AspNetCore.Authorization;

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
        public async Task<IActionResult> CreateDog(Dog entity)
        {
            try
            {
                var result = await connectionOwner.Use(conn =>
                {
                    return dbOwner.Dogs.Add(conn, entity);
                });

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

        //get a dog by Id
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(IEnumerable<DogResult>), 200)]
        public async Task<IActionResult> GetDog(int Id)
        {
            try
            {
                var dog = await connectionOwner.Use(conn =>
                {
                    return dbOwner.Dogs.GetByID(conn, Id);
                });

                var dogResult = dog.ToDogResult(serviceConstants.storageBasePath);

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
        public async Task<IActionResult> UpdateDog(Dog entity)
        {
            try
            {
                var result = await connectionOwner.Use(conn =>
                {
                    return dbOwner.Dogs.Update(conn, entity);
                });

                return Ok(result);
            }
            catch(Exception e)
            {
                return StatusCode(500, e.Message);
            }
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

        #endregion
    }
}
