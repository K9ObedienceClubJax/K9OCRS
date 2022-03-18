DELETE FROM ClassMeetings
DBCC CHECKIDENT ('[ClassMeetings]', RESEED, 0)
GO

DELETE FROM VaccinationRecords
GO

DELETE FROM [ClassApplications]
DBCC CHECKIDENT ('[ClassApplications]', RESEED, 0)
GO

DELETE FROM UserDogs
GO

DELETE FROM ClassPhotos
DBCC CHECKIDENT ('[ClassPhotos]', RESEED, 0)
GO

DELETE FROM ClassSections WHERE isSystemOwned = 0
DBCC CHECKIDENT ('[ClassSections]', RESEED, 1)
GO

DELETE FROM ClassTypes WHERE isSystemOwned = 0
DBCC CHECKIDENT ('[ClassTypes]', RESEED, 1)
GO

DELETE FROM Users WHERE isSystemOwned = 0
DBCC CHECKIDENT ('[Users]', RESEED, 1)
GO

DELETE FROM UserRoles WHERE ID > 4
DBCC CHECKIDENT ('[UserRoles]', RESEED, 4)
GO

DELETE FROM Dogs
DBCC CHECKIDENT ('[Dogs]', RESEED, 0)
GO