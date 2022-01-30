﻿using Microsoft.AspNetCore.Mvc;
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

namespace K9OCRS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
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
            catch(Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }

        //get list of dogs
        [HttpGet]
        public async Task<IActionResult> GetDogs()
        {
            try
            {
                var entities = await connectionOwner.Use(conn =>
                {
                    return dbOwner.Dogs.GetAll(conn);
                });

                //returns list of dogs
                return Ok(entities);
            }
            catch(Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }

        //get a dog by Id
        [HttpGet]
        public async Task<IActionResult> GetDog(int Id)
        {
            try
            {
                var entities = await connectionOwner.Use(conn =>
                {
                    return dbOwner.Dogs.GetByID(conn, Id);
                });

                //returns list of dogs
                return Ok(entities);
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }

        //update dog
        [HttpPost]
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
        [HttpDelete]
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


    }
}
