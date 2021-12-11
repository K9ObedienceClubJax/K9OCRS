
namespace DataAccess.Entities
{
    public class User
    {
        public int ID { get; set; }
        public int UserRoleID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string ProfilePictureFilename { get; set; } // add a default later
    }
}
