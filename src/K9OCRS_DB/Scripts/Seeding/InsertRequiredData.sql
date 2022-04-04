
-- User Roles
IF NOT EXISTS (SELECT 1 FROM dbo.UserRoles)
BEGIN
	INSERT INTO dbo.UserRoles (Title)
	VALUES
		('Administrator'),
		('Instructor'),
		('Student');
END

-- Users
IF NOT EXISTS (SELECT 1 FROM dbo.Users)
BEGIN
	INSERT INTO Users ([UserRoleID], FirstName, LastName, Email, [Password], isSystemOwned, isArchived)
	VALUES
		(2, 'Deleted', 'User', 'deleted@test.test', 'thisIsAnInvalidPasswordForAPlaceholderUser', 1, 1)
END

-- Class Types
IF NOT EXISTS (SELECT 1 FROM dbo.ClassTypes)
BEGIN
	INSERT INTO ClassTypes (Title, [Description], Requirements, Duration, Price, isSystemOwned, isArchived)
	VALUES
		('Deleted Class Type','The referenced class type was deleted',NULL,'0 weeks',0, 1, 1)
END

-- Class Sections
IF NOT EXISTS (SELECT 1 FROM dbo.ClassSections)
BEGIN
	INSERT INTO ClassSections ([ClassTypeID], [InstructorID], [RosterCapacity], isSystemOwned)
	VALUES
		(1,1,0,1)
END