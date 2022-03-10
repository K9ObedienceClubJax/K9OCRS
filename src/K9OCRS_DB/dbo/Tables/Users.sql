CREATE TABLE [dbo].[Users] (
    [ID]                     INT            IDENTITY (1, 1) NOT NULL,
    [UserRoleID]             INT            NOT NULL,
    [FirstName]              NVARCHAR (35)  NOT NULL,
    [LastName]               NVARCHAR (70)  NOT NULL,
    [Email]                  NVARCHAR (128) NOT NULL,
    [Password]               NVARCHAR (256) NOT NULL,
    [ProfilePictureFilename] VARCHAR (70)   DEFAULT ('UserPlaceholder.png') NULL,
    CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [FK_Users_UserRoles] FOREIGN KEY ([UserRoleID]) REFERENCES [dbo].[UserRoles] ([ID])
);

