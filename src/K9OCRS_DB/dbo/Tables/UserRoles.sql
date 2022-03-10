CREATE TABLE [dbo].[UserRoles] (
    [ID]    INT          IDENTITY (1, 1) NOT NULL,
    [Title] VARCHAR (70) NOT NULL,
    PRIMARY KEY CLUSTERED ([ID] ASC),
    UNIQUE NONCLUSTERED ([Title] ASC)
);

