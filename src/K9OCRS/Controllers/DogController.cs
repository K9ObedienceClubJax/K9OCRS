using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace K9OCRS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DogController : ControllerBase
    {
        //access cofiguration from appsettings.json
        private readonly IConfiguration _configuration;

        public DogController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        //get dog details
        //[HttpGet]
        //public JsonResult Get()
        //{
            
        //}
    }
}
