CREATE TABLE [dbo].[ClassPhotos] (
    [ID]          INT          IDENTITY (1, 1) NOT NULL,
    [ClassTypeID] INT          NOT NULL,
    [Filename]    VARCHAR (70) NOT NULL,
    PRIMARY KEY CLUSTERED ([ID] ASC),
    FOREIGN KEY ([ClassTypeID]) REFERENCES [dbo].[ClassTypes] ([ID])
);

