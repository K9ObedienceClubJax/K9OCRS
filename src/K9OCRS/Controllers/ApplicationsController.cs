﻿using DataAccess;
using DataAccess.Clients.Contracts;
using DataAccess.Entities;
using DataAccess.Modules.Contracts;
using K9OCRS.Models;
using K9OCRS.Models.ApplicationsManagement;
using K9OCRS.Utils.Constants;
using K9OCRS.Utils.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace K9OCRS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ApplicationsController : ControllerBase
    {
        private readonly ILogger logger;
        private readonly IStorageClient storageClient;
        private readonly IConnectionOwner connectionOwner;
        private readonly DbOwner dbOwner;
        private readonly ServiceConstants serviceConstants;

        public ApplicationsController(
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

        //Get all
        [HttpPost("query")]
        [Authorize(Roles = nameof(UserRoles.Admin))]
        [ProducesResponseType(typeof(IEnumerable<ClassApplication>), 200)]
        public async Task<IActionResult> GetAllApplications([FromBody] ApplicationsListRequest request)
        {
            var result = await connectionOwner.Use(conn =>
                dbOwner.ClassApplications.GetAll(
                    conn,
                    request.ClassTypeIDs,
                    request.DogIDs,
                    request.PaymentMethodIDs,
                    request.includePaid,
                    request.includeRefunded,
                    request.includePending,
                    request.includeActive,
                    request.includeCompleted,
                    request.includeCancelled
                )
            );

            var mappedResults = result.Select(ca => {
                var dogEntity = new Dog
                {
                    ProfilePictureFilename = ca.DogProfilePictureFilename,
                };
                var dogResult = dogEntity.ToDogResult(serviceConstants.storageBasePath);

                var updatedEntity = new ClassApplication(ca);
                updatedEntity.DogProfilePictureUrl = dogResult.ProfilePictureUrl;
                return updatedEntity;
            });

            return Ok(mappedResults);
        }

        // Get details
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ClassApplication), 200)]
        public async Task<IActionResult> GetApplication(int id)
        {
            var result = await connectionOwner.Use(conn => dbOwner.ClassApplications.GetByID(conn, id));

            var dogEntity = new Dog
            {
                ProfilePictureFilename = result.DogProfilePictureFilename,
            };
            var dogResult = dogEntity.ToDogResult(serviceConstants.storageBasePath);

            var updatedResult = new ClassApplication(result);
            updatedResult.DogProfilePictureUrl = dogResult.ProfilePictureUrl;

            return Ok(updatedResult);
        }

        // Create
        [HttpPost]
        [ProducesResponseType(typeof(ClassApplication), 200)]
        public async Task<IActionResult> CreateApplication([FromBody] ApplicationAddRequest request)
        {
            var entity = new ClassApplication
            {
                ClassTypeID = request.ClassTypeID,
                ClassSectionID = request.ClassSectionID,
                DogID = request.DogID,
                Status = request.Status,
                MainAttendee = request.MainAttendee,
                AdditionalAttendees = request.AdditionalAttendees,
                PaymentMethodID = request.PaymentMethodID,
                isPaid = request.isPaid,
            };

            var result = await connectionOwner.Use(conn => dbOwner.ClassApplications.Add(conn, entity));

            return Ok(result);
        }

        // Update
        [HttpPut("{id}")]
        [Authorize(Roles = nameof(UserRoles.Admin))]
        [ProducesResponseType(typeof(int), 200)]
        public async Task<IActionResult> UpdateApplication([FromBody] ClassApplication entity)
        {
            var result = await connectionOwner.Use(conn => dbOwner.ClassApplications.Update(conn, entity));

            return Ok(result);
        }

        //Delete
        [HttpDelete("{id}")]
        [Authorize(Roles = nameof(UserRoles.Admin))]
        [ProducesResponseType(typeof(int), 200)]
        public async Task<IActionResult> DeleteApplication(int id)
        {
            var result = await connectionOwner.Use(conn => dbOwner.ClassApplications.Delete(conn, id));

            return Ok(result);
        }
    }
}
