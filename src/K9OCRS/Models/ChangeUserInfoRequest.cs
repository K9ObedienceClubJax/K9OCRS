using Microsoft.AspNetCore.Http;

namespace K9OCRS.Models
{
    public class ChangeUserInfoRequest
    {
        //Do not require ID, so that admins can create new users
        public int ID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public int UserRoleID { get; set; }
        public IFormFile ImageUpdate { get; set; }
        public bool HasDiscounts { get; set; }
        public bool isMember { get; set; }
    }
}
