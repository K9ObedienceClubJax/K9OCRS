CREATE TABLE [dbo].[VaccinationRecords] (
    [DogID]        INT          NOT NULL,
    [Filename]     VARCHAR (70) NOT NULL,
    [Approved]     BIT          NOT NULL,
    [ExpireDate]   DATE         NULL,
    [ReviewedBy]   INT          NULL,
    [ReviewedDate] DATE         NULL,
    [ModifiedByID] INT NULL,
    [ModifiedByName] VARCHAR(128) NULL,
    [ModifiedDate] DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [PK_VaccinationRecords] PRIMARY KEY CLUSTERED ([DogID] ASC),
    CONSTRAINT [FK_VaccinationRecords_Dogs] FOREIGN KEY ([DogID]) REFERENCES [dbo].[Dogs] ([ID]) ON DELETE CASCADE
);

