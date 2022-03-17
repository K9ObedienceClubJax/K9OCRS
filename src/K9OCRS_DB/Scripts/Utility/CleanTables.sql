DELETE FROM ClassMeetings;
DBCC CHECKIDENT ('[ClassMeetings]', RESEED, 0);

DELETE FROM VaccinationRecords;

DELETE FROM [ClassApplications];
DBCC CHECKIDENT ('[SectionApplications]', RESEED, 0);

DELETE FROM UserDogs;

DELETE FROM ClassPhotos;
DBCC CHECKIDENT ('[ClassPhotos]', RESEED, 0);

DELETE FROM ClassSections;
DBCC CHECKIDENT ('[ClassSections]', RESEED, 0);

DELETE FROM ClassTypes;
DBCC CHECKIDENT ('[ClassTypes]', RESEED, 0);

DELETE FROM Users;
DBCC CHECKIDENT ('[Users]', RESEED, 0);

DELETE FROM UserRoles;
DBCC CHECKIDENT ('[UserRoles]', RESEED, 0);

DELETE FROM Dogs;
DBCC CHECKIDENT ('[Dogs]', RESEED, 0);