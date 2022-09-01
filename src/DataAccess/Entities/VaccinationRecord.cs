using DataAccess.Extensions;
using System;
using System.Text.Json.Serialization;

namespace DataAccess.Entities
{
    public class VaccinationRecord : BaseEntity
    {
        public VaccinationRecord() { }
        public VaccinationRecord(VaccinationRecord entity)
        {
            ID = entity.ID;
            DogID = entity.DogID;
            Filename = entity.Filename;
            OriginalFilename = entity.OriginalFilename;
            ExpireDate = entity.ExpireDate;
            ModifiedByID = entity.ModifiedByID;
            ModifiedByName = entity.ModifiedByName;
            ModifiedDate = entity.ModifiedDate;
        }

        [UpdateIgnore]
        [JsonPropertyName("id")]
        public int ID { get; set; }
        [UpdateIgnore]
        [JsonPropertyName("dogID")]
        public int DogID { get; set; }
        [JsonPropertyName("filename")]
        public string Filename { get; set; }
        [JsonPropertyName("originalFilename")]
        public string OriginalFilename { get; set; }
        public DateTime? ExpireDate { get; set; } = null;
    }
}
