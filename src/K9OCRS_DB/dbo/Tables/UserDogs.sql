CREATE TABLE [dbo].[UserDogs] (
    [UserID] INT NOT NULL,
    [DogID]  INT NOT NULL,
    CONSTRAINT [FK_UserDogs_Dogs] FOREIGN KEY ([DogID]) REFERENCES [dbo].[Dogs] ([ID]),
    CONSTRAINT [FK_UserDogs_Users] FOREIGN KEY ([UserID]) REFERENCES [dbo].[Users] ([ID])
);

