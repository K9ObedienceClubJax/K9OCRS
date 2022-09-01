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
using Serilog;
using K9OCRS.Models;
using K9OCRS.Models.ClassManagement;
using System.Linq;
using System.Data.SqlClient;
using K9OCRS.Utils.Constants;
using K9OCRS.Utils.Extensions;
using Microsoft.AspNetCore.Authorization;
using K9OCRS.Models.ApplicationsManagement;

namespace K9OCRS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ClassSectionsController : ControllerBase
    {
        private readonly ILogger logger;
        private readonly IStorageClient storageClient;
        private readonly IConnectionOwner connectionOwner;
        private readonly DbOwner dbOwner;
        private readonly ServiceConstants serviceConstants;

        public ClassSectionsController(
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
        [AllowAnonymous]
        [ProducesResponseType(typeof(IEnumerable<ClassSectionResult>), 200)]
        public async Task<IActionResult> GetAll()
        {
            var result = await connectionOwner.Use(async conn =>
            {
                var sections = await dbOwner.ClassSections.GetAll(conn);
                return sections.Select(s => s.ToClassSectionResult(serviceConstants.storageBasePath));
            });

            return Ok(result);
        }

        [HttpGet("{classSectionId}")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(ClassSectionResult), 200)]
        public async Task<IActionResult> GetByID(int classSectionId)
        {
            var result = await connectionOwner.Use(async conn =>
            {
                var section = await dbOwner.ClassSections.GetByID(conn, classSectionId);
                return section.ToClassSectionResult(serviceConstants.storageBasePath);
            });

            return Ok(result);
        }

        [HttpGet("roster/{classSectionId}")]
        [Authorize(Roles = nameof(UserRoles.Admin) + "," + nameof(UserRoles.Instructor))]
        [ProducesResponseType(typeof(IEnumerable<RosterEntry>), 200)]
        public async Task<IActionResult> GetRoster(int classSectionId)
        {
            var roster = await connectionOwner.Use(conn => dbOwner.ClassApplications.GetSectionRoster(conn, classSectionId));

            var mappedRoster = roster.Select(ca => new RosterEntry(ca, serviceConstants.storageBasePath));

            return Ok(mappedRoster);
        }

        [HttpPost]
        [Authorize(Roles = nameof(UserRoles.Admin))]
        [ProducesResponseType(typeof(int), 200)]
        public async Task<IActionResult> Add(ClassSectionAddRequest request)
        {
            var result = await connectionOwner.UseTransaction(async (conn, tr) =>
            {
                var section = await dbOwner.ClassSections.Add(conn, tr, new ClassSection
                {
                    ClassTypeID = request.ClassTypeID,
                    InstructorID = request.InstructorID,
                    RosterCapacity = request.RosterCapacity,
                    isDraft = request.isDraft,
                });

                // Update meetings to have the correct section id
                var assignedMeetings = request.Meetings.Select(m =>
                {
                    m.ClassSectionID = section.ID;
                    return m;
                }).ToList();

                var meetings = await dbOwner.ClassMeetings.AddMany(conn, tr, assignedMeetings);

                section.Meetings = meetings.ToList();

                tr.Commit();

                return section;
            });

            return Ok(result.ID);
        }

        [HttpPut]
        [Authorize(Roles = nameof(UserRoles.Admin))]
        public async Task<IActionResult> Update(ClassSectionUpdateRequest request)
        {
            try
            {
                await connectionOwner.UseTransaction(async (conn, tr) =>
                {
                    var updatedCount = await dbOwner.ClassSections.Update(conn, tr, new ClassSection
                    {
                        ID = request.ID,
                        ClassTypeID = request.ClassTypeID,
                        InstructorID = request.InstructorID,
                        RosterCapacity = request.RosterCapacity,
                        isDraft = request.isDraft,
                    });

                    if (updatedCount < 1) throw new KeyNotFoundException();

                    int deletedCount = 0;
                    int insertedCount = 0;

                    if (request.MeetingIdsToDelete.Count() > 0)
                    {
                        deletedCount = await dbOwner.ClassMeetings.DeleteMany(conn, tr, request.MeetingIdsToDelete);
                    }

                    if (request.MeetingsToInsert.Count() > 0)
                    {
                        // Update meetings to have the correct section id
                        var assignedMeetings = request.MeetingsToInsert.Select(m =>
                        {
                            m.ClassSectionID = request.ID;
                            return m;
                        }).ToList();

                        insertedCount = (await dbOwner.ClassMeetings.AddMany(conn, tr, assignedMeetings)).Count();
                    }

                    if (
                        request.MeetingIdsToDelete.Count() != deletedCount ||
                        request.MeetingsToInsert.Count() != insertedCount
                    )
                    {
                        throw new Exception();
                    }

                    tr.Commit();
                });

                return Ok();
            }
            catch (Exception ex)
            {
                if (ex is KeyNotFoundException)
                {
                    return NotFound();
                }

                logger.Error(ex, ex.Message);
                return StatusCode(500);
            }
        }

        [HttpDelete("{classSectionId}")]
        [Authorize(Roles = nameof(UserRoles.Admin))]
        public async Task<IActionResult> Delete(int classSectionId)
        {
            // Prevent deletion of placeholder section
            if (classSectionId <= 1) return BadRequest("ID must be greater than 1");
            try
            {
                await connectionOwner.UseTransaction(async (conn, tr) =>
                {
                    var deletedCount = await dbOwner.ClassSections.Delete(conn, tr, classSectionId);

                    if (deletedCount < 1) throw new KeyNotFoundException();

                    tr.Commit();
                });

                return Ok();
            }
            catch (Exception ex)
            {
                if (ex is KeyNotFoundException)
                {
                    return NotFound();
                }

                logger.Error(ex, ex.Message);
                return StatusCode(500);
            }
        }
    }
}
