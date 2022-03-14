
namespace DataAccess.Entities
{
    public class UserDog
    {
        public UserDog () { }
        public UserDog (UserDog entity)
        {
            UserID = entity.UserID;
            DogID = entity.DogID;
        }

        public int UserID { get; set; }
        public int DogID { get; set; }
    }
}
