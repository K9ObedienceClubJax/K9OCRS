﻿CREATE TABLE [dbo].[UserDogs] (
    [UserID] INT NOT NULL DEFAULT 1,
    [DogID]  INT NOT NULL,
    [ModifiedByID] INT NULL,
    [ModifiedByName] VARCHAR(128) NULL,
    [ModifiedDate] DATETIME NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT [FK_UserDogs_Dogs] FOREIGN KEY ([DogID]) REFERENCES [dbo].[Dogs] ([ID]) ON DELETE CASCADE,
    CONSTRAINT [FK_UserDogs_Users] FOREIGN KEY ([UserID]) REFERENCES [dbo].[Users] ([ID]) ON DELETE SET DEFAULT
);

