CREATE TABLE [dbo].[ClassSections] (
    [ID]             INT IDENTITY (1, 1) NOT NULL,
    [ClassTypeID]    INT NOT NULL,
    [InstructorID]   INT NOT NULL,
    [RosterCapacity] INT NOT NULL,
    CONSTRAINT [PK_ClassSections] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [FK_ClassSections_ClassTypes] FOREIGN KEY ([ClassTypeID]) REFERENCES [dbo].[ClassTypes] ([ID]),
    CONSTRAINT [FK_ClassSections_Users] FOREIGN KEY ([InstructorID]) REFERENCES [dbo].[Users] ([ID])
);


GO

CREATE TRIGGER [dbo].[ClassSections_InsteadOfDELETE]
       ON [dbo].[ClassSections]
INSTEAD OF DELETE
AS
BEGIN
       DECLARE @Id INT
 
       SELECT @Id = DELETED.ID
       FROM DELETED
 
       IF @Id = 1
       BEGIN
              RAISERROR('Section 1 can not be deleted',16 ,1)
              ROLLBACK
       END
       ELSE
       BEGIN
              DELETE FROM [dbo].[ClassSections]
              WHERE ID = @Id
       END
END
