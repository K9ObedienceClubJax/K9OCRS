CREATE TABLE [dbo].[VaccinationRecords] (
    [ID]           INT          IDENTITY(1,1) NOT NULL,
    [DogID]        INT          NOT NULL,
    [Filename]     VARCHAR (70) NOT NULL,
    [OriginalFilename]     VARCHAR (70) NOT NULL,
    [ExpireDate]   DATE         NULL,
    [ModifiedByID] INT NULL,
    [ModifiedByName] VARCHAR(128) NULL,
    [ModifiedDate] DATETIME NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT [PK_VaccinationRecords] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [FK_VaccinationRecords_Dogs] FOREIGN KEY ([DogID]) REFERENCES [dbo].[Dogs] ([ID]) ON DELETE CASCADE
);

