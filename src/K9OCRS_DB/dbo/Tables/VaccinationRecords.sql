CREATE TABLE [dbo].[VaccinationRecords] (
    [DogID]        INT          NOT NULL,
    [Filename]     VARCHAR (70) NOT NULL,
    [Approved]     BIT          NOT NULL,
    [ExpireDate]   DATE         NULL,
    [ReviewedBy]   INT          NULL,
    [ReviewedDate] DATE         NULL,
    PRIMARY KEY CLUSTERED ([DogID] ASC),
    FOREIGN KEY ([DogID]) REFERENCES [dbo].[Dogs] ([ID])
);

