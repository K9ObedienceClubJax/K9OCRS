using DataAccess.Constants;
using DataAccess.Entities;
using System;

namespace K9OCRS.Models.DogManagement
{
    public class VaccinationRecordResult
    {
        public int ID { get; set; }
        public int DogID { get; set; }
        public string Filename { get; set; }
        public string FileUrl { get; set; }
        public DateTime? ExpireDate { get; set; } = null;

        public VaccinationRecordResult() { }
        public VaccinationRecordResult(VaccinationRecord vr, string storageBasePath)
        {
            ID = vr.ID;
            DogID = vr.DogID;
            Filename = vr.Filename;
            FileUrl = GenerateFileUrl(storageBasePath);
            ExpireDate = vr.ExpireDate;
        }

        // {basePath}/vaccinationRecords/{dogId}/{filename}
        private string GenerateFileUrl(string storageBasepath) =>
            string.Concat(storageBasepath, StorageContainers.GetWithParams(UploadType.VaccinationRecord, this.DogID), "/", this.Filename);
    }
}
