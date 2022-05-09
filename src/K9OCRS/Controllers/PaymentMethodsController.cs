using DataAccess;
using DataAccess.Clients.Contracts;
using DataAccess.Entities;
using DataAccess.Modules.Contracts;
using K9OCRS.Models.Billing;
using K9OCRS.Utils.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace K9OCRS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = nameof(UserRoles.Admin))]
    public class PaymentMethodsController : ControllerBase
    {
        private readonly IStorageClient storageClient;
        private readonly IConnectionOwner connectionOwner;
        private readonly DbOwner dbOwner;
        private readonly ServiceConstants serviceConstants;



        public PaymentMethodsController(
            ServiceConstants serviceConstants,
            IStorageClient storageClient,
            IConnectionOwner connectionOwner,
            DbOwner dbOwner
        )
        {
            this.storageClient = storageClient;
            this.connectionOwner = connectionOwner;
            this.dbOwner = dbOwner;
            this.serviceConstants = serviceConstants;

        }

        [HttpGet]
        [AllowAnonymous]
        [ProducesResponseType(typeof(IEnumerable<PaymentMethod>), 200)]
        public async Task<IActionResult> GetPaymentMethods([FromQuery] bool includeArchived = false)
        {
            var result = await connectionOwner.Use(conn => dbOwner.PaymentMethods.GetAll(conn, includeArchived));
            return Ok(result);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(PaymentMethod), 200)]
        public async Task<IActionResult> GetByID(int id)
        {
            try
            {
                var result = await connectionOwner.Use(conn => dbOwner.PaymentMethods.GetByID(conn, id));
                return Ok(result);
            }
            catch (Exception e)
            {
                if (e is KeyNotFoundException)
                {
                    return BadRequest("No payment method exists with the requested id");
                }
                throw;
            }
        }

        [HttpPost]
        [ProducesResponseType(typeof(PaymentMethod), 200)]
        public async Task<IActionResult> Add([FromBody] PaymentMethodAddRequest request)
        {
            var entity = new PaymentMethod
            {
                Name = request.Name,
                Description = request.Description,
                Instructions = request.Instructions,
                isArchived = request.isArchived,
            };

            var created = await connectionOwner.Use(conn => dbOwner.PaymentMethods.Add(conn, entity));
            return Ok(created);
        }

        [HttpPut]
        [ProducesResponseType(typeof(int), 200)]
        public async Task<IActionResult> Update([FromBody] PaymentMethodUpdateRequest request)
        {
            try
            {
                var result = await connectionOwner.Use(async conn => {
                    var existing = await dbOwner.PaymentMethods.GetByID(conn, request.ID);

                    if (existing.isIntegration) throw new InvalidOperationException();

                    var updatedEntity = new PaymentMethod
                    {
                        ID = request.ID,
                        Name = request.Name,
                        Description = request.Description,
                        Instructions = request.Instructions,
                        isIntegration = existing.isIntegration,
                        isArchived = request.isArchived,
                    };

                    return await dbOwner.PaymentMethods.Update(conn, updatedEntity);
                });

                return Ok(result);
            }
            catch (Exception e)
            {
                if (e is KeyNotFoundException)
                {
                    return BadRequest("No payment method exists with the requested id");
                }
                else if(e is InvalidOperationException)
                {
                    return BadRequest("Integrations can't be updated through the API");
                }
                throw;
            }
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(int), 200)]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await connectionOwner.Use(conn => dbOwner.PaymentMethods.Delete(conn, id));
            return Ok(result);
        }
    }
}
