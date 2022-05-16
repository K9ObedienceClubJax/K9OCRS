CREATE TABLE [dbo].[UserRoles] (
    [ID]    INT          IDENTITY (1, 1) NOT NULL,
    [Title] VARCHAR (70) NOT NULL,
    [ModifiedByID] INT NULL,
    [ModifiedByName] VARCHAR(128) NULL,
    [ModifiedDate] DATETIME NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT [PK_UserRoles] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [UQ_UserRoles_Title] UNIQUE NONCLUSTERED ([Title] ASC)
);

