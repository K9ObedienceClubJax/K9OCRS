CREATE TABLE [dbo].[ClassMeetings] (
    [ID]             INT      IDENTITY (1, 1) NOT NULL,
    [ClassSectionID] INT      NOT NULL,
    [StartDate]      DATETIME NOT NULL,
    [EndDate]        DATETIME NOT NULL,
    CONSTRAINT [PK_ClassMeetings] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [CHK_Dates] CHECK (datediff(day,[StartDate],[EndDate])=(0)),
    CONSTRAINT [FK_ClassMeetings_ClassSections] FOREIGN KEY ([ClassSectionID]) REFERENCES [dbo].[ClassSections] ([ID]) ON DELETE CASCADE
);

