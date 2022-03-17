CREATE TABLE [dbo].[ClassSections] (
    [ID]             INT IDENTITY (1, 1) NOT NULL,
    [ClassTypeID]    INT NOT NULL DEFAULT 1,
    [InstructorID]   INT NOT NULL DEFAULT 1,
    [RosterCapacity] INT NOT NULL,
    [isSystemOwned] BIT NOT NULL DEFAULT 0, 
    [isDraft] BIT NOT NULL DEFAULT 0, 
    CONSTRAINT [PK_ClassSections] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [FK_ClassSections_ClassTypes] FOREIGN KEY ([ClassTypeID]) REFERENCES [dbo].[ClassTypes] ([ID]) ON DELETE SET DEFAULT,
    CONSTRAINT [FK_ClassSections_Users] FOREIGN KEY ([InstructorID]) REFERENCES [dbo].[Users] ([ID]) ON DELETE SET DEFAULT
);


GO
