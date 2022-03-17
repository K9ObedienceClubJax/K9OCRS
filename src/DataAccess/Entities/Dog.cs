using DataAccess.Extensions;
using System;
using System.Collections.Generic;

namespace DataAccess.Entities
{
    public class Dog
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
