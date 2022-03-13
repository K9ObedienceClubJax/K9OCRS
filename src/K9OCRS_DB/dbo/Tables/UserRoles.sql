CREATE TABLE [dbo].[UserRoles] (
    [ID]    INT          IDENTITY (1, 1) NOT NULL,
    [Title] VARCHAR (70) NOT NULL,
    CONSTRAINT [PK_UserRoles] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [UQ_UserRoles_Title] UNIQUE NONCLUSTERED ([Title] ASC)
);

