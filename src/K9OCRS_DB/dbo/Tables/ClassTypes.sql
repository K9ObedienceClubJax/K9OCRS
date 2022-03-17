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
