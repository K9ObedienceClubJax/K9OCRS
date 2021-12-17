using DataAccess.Extensions;
using System;

namespace DataAccess.Entities
{
    public class Dog
    {
        [TransactionIgnore]
        public int ID { get; set; }
        public string Name { get; set; }
        public string Breed { get; set; }
        public DateTime DateOfBirth { get; set; }
        [TransactionIgnore]
        public string ProfilePictureFilename { get; set; }
    }
}
