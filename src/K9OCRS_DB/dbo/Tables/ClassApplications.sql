CREATE TABLE [dbo].[ClassApplications] (
    [ID]             INT          IDENTITY (1, 1) NOT NULL,
    [ClassTypeID]    INT           NOT NULL,
    [ClassSectionID] INT          DEFAULT (1) NOT NULL,
    [DogID]          INT          NOT NULL,
    [Status]         VARCHAR (15) NOT NULL,
    [PaymentMethod]  VARCHAR (70) NOT NULL,
    [isPaid]         BIT          NOT NULL DEFAULT 0,
    [isRefunded]     BIT          NOT NULL DEFAULT 0,
    [ReviewedBy]     INT          NULL,
    [ReviewedDate]   DATE         NULL,
    [ModifiedByID] INT NULL,
    [ModifiedByName] VARCHAR(128) NULL,
    [ModifiedDate] DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [PK_ClassApplications] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [CHK_ClassApplications_Status] CHECK ([Status]='Cancelled' OR [Status]='Completed' OR [Status]='Active' OR [Status]='Pending'),
    CONSTRAINT [FK_ClassApplications_ClassTypes] FOREIGN KEY ([ClassTypeID]) REFERENCES [dbo].[ClassTypes] ([ID]),
    CONSTRAINT [FK_ClassApplications_ClassSections] FOREIGN KEY ([ClassSectionID]) REFERENCES [dbo].[ClassSections] ([ID]) ON DELETE SET DEFAULT,
    CONSTRAINT [FK_ClassApplications_Dogs] FOREIGN KEY ([DogID]) REFERENCES [dbo].[Dogs] ([ID]) ON DELETE CASCADE
);

