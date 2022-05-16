CREATE TABLE [dbo].[ClassPhotos] (
    [ID]          INT          IDENTITY (1, 1) NOT NULL,
    [ClassTypeID] INT          NOT NULL,
    [Filename]    VARCHAR (70) NOT NULL,
    [ModifiedByID] INT NULL,
    [ModifiedByName] VARCHAR(128) NULL,
    [ModifiedDate] DATETIME NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT [PK_ClassPhotos] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [FK_ClassPhotos_ClassTypes] FOREIGN KEY ([ClassTypeID]) REFERENCES [dbo].[ClassTypes] ([ID])
);

