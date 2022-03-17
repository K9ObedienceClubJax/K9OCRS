CREATE TABLE [dbo].[Dogs] (
    [ID]                     INT           IDENTITY (1, 1) NOT NULL,
    [Name]                   NVARCHAR (35) NOT NULL,
    [Breed]                  NVARCHAR (35) NOT NULL,
    [DateOfBirth]            DATE          NOT NULL,
    [ProfilePictureFilename] VARCHAR (70)  DEFAULT ('DogPlaceholder.png') NULL,
    [isArchived] BIT NOT NULL DEFAULT 0, 
    CONSTRAINT [PK_Dogs] PRIMARY KEY CLUSTERED ([ID] ASC)
);

