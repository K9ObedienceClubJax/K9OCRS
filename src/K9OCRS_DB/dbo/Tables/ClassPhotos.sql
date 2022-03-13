CREATE TABLE [dbo].[ClassPhotos] (
    [ID]          INT          IDENTITY (1, 1) NOT NULL,
    [ClassTypeID] INT          NOT NULL,
    [Filename]    VARCHAR (70) NOT NULL,
    CONSTRAINT [PK_ClassPhotos] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [FK_ClassPhotos_ClassTypes] FOREIGN KEY ([ClassTypeID]) REFERENCES [dbo].[ClassTypes] ([ID])
);

