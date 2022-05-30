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
        public bool Approved { get; set; }
        public DateTime? ExpireDate { get; set; } = null;
        public int ReviewedBy { get; set; }
        public DateTime? ReviewedDate { get; set; } = null;

        public VaccinationRecordResult() { }
        public VaccinationRecordResult(VaccinationRecord vr, string storageBasePath)
        {
            ID = vr.ID;
            DogID = vr.DogID;
            Filename = vr.Filename;
            FileUrl = GenerateFileUrl(storageBasePath);
            Approved = vr.Approved;
            ExpireDate = vr.ExpireDate;
            ReviewedBy = vr.ReviewedBy;
            ReviewedDate = vr.ReviewedDate;
        }

        // {basePath}/vaccinationRecords/{dogId}/{filename}
        private string GenerateFileUrl(string storageBasepath) =>
            string.Concat(storageBasepath, StorageContainers.GetWithParams(UploadType.VaccinationRecord, this.DogID), "/", this.Filename);
    }
}
