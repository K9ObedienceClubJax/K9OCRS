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
            Approved = entity.Approved;
            ExpireDate = entity.ExpireDate;
            ReviewedBy = entity.ReviewedBy;
            ReviewedDate = entity.ReviewedDate;
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
        public bool Approved { get; set; }
        public DateTime? ExpireDate { get; set; } = null;
        public int ReviewedBy { get; set; }
        public DateTime? ReviewedDate { get; set; } = null;
    }
}
