﻿CREATE TABLE [dbo].[Users] (
    [ID]                     INT            IDENTITY (1, 1) NOT NULL,
    [UserRoleID]             INT            NOT NULL,
    [FirstName]              NVARCHAR (35)  NOT NULL,
    [LastName]               NVARCHAR (70)  NOT NULL,
    [Email]                  NVARCHAR (128) NOT NULL,
    [Password]               NVARCHAR (256) NOT NULL,
    [ProfilePictureFilename] VARCHAR (70)   DEFAULT ('UserPlaceholder.png') NULL,
    [isSystemOwned]          BIT NOT NULL DEFAULT 0, 
    [isArchived] BIT NOT NULL DEFAULT 0, 
    CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [FK_Users_UserRoles] FOREIGN KEY ([UserRoleID]) REFERENCES [dbo].[UserRoles] ([ID])
);


GO

CREATE TRIGGER [dbo].[Users_InsteadOfDELETE]
       ON [dbo].[Users]
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
            DELETE FROM [dbo].[Users]
            WHERE ID = @Id
        END
END