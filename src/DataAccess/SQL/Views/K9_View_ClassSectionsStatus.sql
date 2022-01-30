USE k9ocrs
GO

CREATE VIEW ClassSectionsStatus
AS
SELECT
	cs.ID as ClassSectionID,
	cm.StartDate,
	cm.EndDate,
	CASE
		WHEN GETDATE() > StartDate THEN 'Ongoing'
		WHEN GETDATE() < EndDate THEN 'Completed'
		ELSE 'Scheduled'
	END as [Status],
	IIF(sa.RosterActual IS NOT NULL, sa.RosterActual, 0) as RosterActual
FROM ClassSections cs
-- Get the start and end dates for the section based on all class meetings
JOIN (
	SELECT
		cm.ClassSectionID,
		MIN(StartDate) as StartDate,
		MAX(EndDate) as EndDate
	FROM ClassMeetings cm
	GROUP BY cm.ClassSectionID
) as cm ON cs.ID = cm.ClassSectionID
-- Get the count of how many student applications are active or completed
LEFT JOIN (
	SELECT
		sa.ClassSectionID,
		COUNT(ID) as RosterActual
	FROM SectionApplications sa
	WHERE sa.[Status] != 'Cancelled'
	GROUP BY sa.ClassSectionID
) as sa ON cs.ID = sa.ClassSectionID;