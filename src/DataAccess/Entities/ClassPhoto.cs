﻿using DataAccess.Extensions;
using System.Text.Json.Serialization;

namespace DataAccess.Entities
{
    public class ClassPhoto : BaseEntity
    {
        public ClassPhoto() { }
        public ClassPhoto(ClassPhoto entity)
        {
            ID = entity.ID;
            ClassTypeID = entity.ClassTypeID;
            Filename = entity.Filename;
            ModifiedByID = entity.ModifiedByID;
            ModifiedByName = entity.ModifiedByName;
            ModifiedDate = entity.ModifiedDate;
        }

        /// <example>1</example>
        [TransactionIgnore]
        [JsonPropertyName("id")]
        public int ID { get; set; }
        /// <example>1</example>
        [JsonPropertyName("classTypeID")]
        public int ClassTypeID { get; set; }
        /// <example>1.jpg</example>
        [JsonPropertyName("filename")]
        public string Filename { get; set; }
    }
}
