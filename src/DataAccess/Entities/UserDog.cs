
namespace DataAccess.Entities
{
    public class UserDog : BaseEntity
    {
        public UserDog () { }
        public UserDog (UserDog entity)
        {
            UserID = entity.UserID;
            DogID = entity.DogID;
            ModifiedByID = entity.ModifiedByID;
            ModifiedByName = entity.ModifiedByName;
            ModifiedDate = entity.ModifiedDate;
        }

        public int UserID { get; set; }
        public int DogID { get; set; }
    }
}
