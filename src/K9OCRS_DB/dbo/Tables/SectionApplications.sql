CREATE TABLE [dbo].[SectionApplications] (
    [ID]             INT          IDENTITY (1, 1) NOT NULL,
    [ClassSectionID] INT          DEFAULT ((1)) NOT NULL,
    [DogID]          INT          NOT NULL,
    [Status]         VARCHAR (15) NOT NULL,
    [Refunded]       BIT          NOT NULL,
    [ReviewedBy]     INT          NULL,
    [ReviewedDate]   DATE         NULL,
    PRIMARY KEY CLUSTERED ([ID] ASC),
    CHECK ([Status]='Cancelled' OR [Status]='Completed' OR [Status]='Active' OR [Status]='Pending'),
    FOREIGN KEY ([ClassSectionID]) REFERENCES [dbo].[ClassSections] ([ID]) ON DELETE SET DEFAULT,
    FOREIGN KEY ([DogID]) REFERENCES [dbo].[Dogs] ([ID])
);

