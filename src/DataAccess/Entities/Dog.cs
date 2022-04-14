using DataAccess.Extensions;
using System;

namespace DataAccess.Entities
{
    public class Dog : BaseEntity
    {
        public Dog() { }
        public Dog(Dog entity)
        {
            ID = entity.ID;
            Name = entity.Name;
            Breed = entity.Breed;
            DateOfBirth = entity.DateOfBirth;
            ProfilePictureFilename = entity.ProfilePictureFilename;
            isArchived = entity.isArchived;
            ModifiedByID = entity.ModifiedByID;
            ModifiedByName = entity.ModifiedByName;
            ModifiedDate = entity.ModifiedDate;
        }

        [TransactionIgnore]
        public int ID { get; set; }
        public string Name { get; set; }
        public string Breed { get; set; }
        public DateTime DateOfBirth { get; set; }
        [TransactionIgnore]
        public string ProfilePictureFilename { get; set; }
        public bool isArchived { get; set; }
    }
}
