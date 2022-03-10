
CREATE VIEW ClassSectionsStatus
AS
SELECT
	cs.ID as ClassSectionID,
	CAST(cm.StartDate as date) as StartDate,
	CAST(cm.EndDate as date) as EndDate,
	t.StartTime,
	t.EndTime,
	CASE
		WHEN GETDATE() > StartDate AND GETDATE() < EndDate THEN 'Ongoing'
		WHEN GETDATE() > EndDate THEN 'Completed'
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
-- Get the start and end times for the section for each class meeting
OUTER APPLY (
	SELECT TOP 1
		CAST(StartDate as time) as StartTime,
		CAST(EndDate as time) as EndTime
	FROM ClassMeetings cm
	WHERE cm.ClassSectionID = cs.ID
	GROUP BY CAST(StartDate as time), CAST(EndDate as time)
	ORDER  BY COUNT(*) DESC
) as t
-- Get the count of how many student applications are active or completed
LEFT JOIN (
	SELECT
		sa.ClassSectionID,
		COUNT(ID) as RosterActual
	FROM SectionApplications sa
	WHERE sa.[Status] != 'Cancelled'
	GROUP BY sa.ClassSectionID
) as sa ON cs.ID = sa.ClassSectionID;