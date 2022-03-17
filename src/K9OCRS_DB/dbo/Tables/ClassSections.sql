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

CREATE TRIGGER [dbo].[ClassSections_InsteadOfDELETE]
       ON [dbo].[ClassSections]
INSTEAD OF DELETE
AS
BEGIN
    DECLARE @Id INT;
    DECLARE @isSystemOwned BIT;

    SELECT
        @Id = DELETED.ID,
        @isSystemOwned = DELETED.isSystemOwned
    FROM DELETED

    IF @isSystemOwned = 1
        BEGIN
            RAISERROR('A system owned resource can not be deleted',16 ,1)
            ROLLBACK
        END
    ELSE
        BEGIN
            DELETE FROM [dbo].[ClassSections]
            WHERE ID = @Id
        END
END
