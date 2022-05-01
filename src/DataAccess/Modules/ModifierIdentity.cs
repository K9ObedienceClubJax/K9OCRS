using Microsoft.AspNetCore.Http;
using System;
using System.Linq;
using System.Security.Claims;

namespace DataAccess.Modules
{
    public class ModifierIdentity
    {
        public int ID { get; set; } = 0;
        public string Name { get; set; } = "Unknown";
        public string Email { get; set; } = "unknown";

        public ModifierIdentity(IHttpContextAccessor contextAccessor)
        {
            var user = contextAccessor.HttpContext.User;
            if (user.Identity.IsAuthenticated)
            {
                ID = Int32.Parse(user.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);
                Name = user.Identity.Name;
                Email = user.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email).Value;
            }
        }
    }
}
