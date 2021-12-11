using System;

namespace DataAccess.Entities
{
    public class Dog
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Breed { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string ProfilePictureFilename { get; set; }
    }
}
