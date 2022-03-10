CREATE TABLE [dbo].[SectionApplications] (
    [ID]             INT          IDENTITY (1, 1) NOT NULL,
    [ClassSectionID] INT          DEFAULT ((1)) NOT NULL,
    [DogID]          INT          NOT NULL,
    [Status]         VARCHAR (15) NOT NULL,
    [Refunded]       BIT          NOT NULL,
    [ReviewedBy]     INT          NULL,
    [ReviewedDate]   DATE         NULL,
    CONSTRAINT [PK_SectionApplications] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [CHK_SectionApplications_Status] CHECK ([Status]='Cancelled' OR [Status]='Completed' OR [Status]='Active' OR [Status]='Pending'),
    CONSTRAINT [FK_SectionApplications_ClassSections] FOREIGN KEY ([ClassSectionID]) REFERENCES [dbo].[ClassSections] ([ID]) ON DELETE SET DEFAULT,
    CONSTRAINT [FK_SectionApplications_Dogs] FOREIGN KEY ([DogID]) REFERENCES [dbo].[Dogs] ([ID])
);

