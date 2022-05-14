CREATE TABLE [dbo].[PaymentMethods]
(
	[ID] INT NOT NULL IDENTITY (1, 1),
	[Name] VARCHAR(70) NOT NULL,
	[Description] VARCHAR(156) NULL,
	[Instructions] VARCHAR(2048) NULL,
	[isIntegration] BIT NOT NULL DEFAULT 0,
	[isArchived] BIT NOT NULL DEFAULT 0,
	[isSystemOwned] BIT NOT NULL DEFAULT 0,
	[ModifiedByID] INT NULL,
    [ModifiedByName] VARCHAR(128) NULL,
    [ModifiedDate] DATETIME NOT NULL DEFAULT GETDATE(),
	CONSTRAINT [PK_PaymentMethods] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [UQ_PaymentMethods_Name] UNIQUE NONCLUSTERED ([Name] ASC),
	CONSTRAINT [CHK_PaymentMethods_Name] CHECK (LEN([Name]) >= 2)
)
