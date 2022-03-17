CREATE TABLE [dbo].[ClassTypes] (
    [ID]            INT            IDENTITY (1, 1) NOT NULL,
    [Title]         VARCHAR (156)  NOT NULL,
    [Description]   VARCHAR (2048) NOT NULL,
    [Requirements]  VARCHAR (512)  NULL,
    [ImageFilename] VARCHAR (70)   DEFAULT ('ClassPlaceholder.png') NULL,
    [Duration]      VARCHAR (128)  NOT NULL,
    [Price]         MONEY          NOT NULL,
    [isSystemOwned] BIT NOT NULL DEFAULT 0, 
    [isArchived] BIT NOT NULL DEFAULT 0, 
    CONSTRAINT [PK_ClassTypes] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [UQ_ClassTypes_Title] UNIQUE NONCLUSTERED ([Title] ASC)
);


GO

CREATE TRIGGER [dbo].[ClassTypes_InsteadOfDELETE]
       ON [dbo].[ClassTypes]
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
            DELETE FROM [dbo].[ClassTypes]
            WHERE ID = @Id
        END
END