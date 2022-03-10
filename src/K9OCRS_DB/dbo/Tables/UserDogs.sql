CREATE TABLE [dbo].[UserDogs] (
    [UserID] INT NOT NULL,
    [DogID]  INT NOT NULL,
    FOREIGN KEY ([DogID]) REFERENCES [dbo].[Dogs] ([ID]),
    FOREIGN KEY ([UserID]) REFERENCES [dbo].[Users] ([ID])
);

