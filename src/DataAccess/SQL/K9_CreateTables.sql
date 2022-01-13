USE k9ocrs
GO

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='UserRoles' and xtype='U')
	CREATE TABLE UserRoles (
		ID INTEGER IDENTITY NOT NULL,
		Title VARCHAR(70) NOT NULL,
		PRIMARY KEY (ID),
		UNIQUE (Title)
	);

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Users' and xtype='U')
	CREATE TABLE Users (
		ID INTEGER IDENTITY NOT NULL,
		UserRoleID INTEGER NOT NULL,
		FirstName NVARCHAR(35) NOT NULL,
		LastName NVARCHAR(70) NOT NULL,
		Email NVARCHAR(128) NOT NULL,
		Password NVARCHAR(256) NOT NULL,
		ProfilePictureFilename VARCHAR(70) DEFAULT 'UserPlaceholder.png',
		PRIMARY KEY (ID)
	);

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='UserDogs' and xtype='U')
	CREATE TABLE UserDogs (
		UserID INTEGER NOT NULL,
		DogID INTEGER NOT NULL
	);

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Dogs' and xtype='U')
	CREATE TABLE Dogs (
		ID INTEGER IDENTITY NOT NULL,
		Name NVARCHAR(35) NOT NULL,
		Breed NVARCHAR(35) NOT NULL,
		DateOfBirth DATE NOT NULL,
		ProfilePictureFilename VARCHAR(70) DEFAULT 'DogPlaceholder.png',
		PRIMARY KEY (ID)
	);

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='VaccinationRecords' and xtype='U')
	CREATE TABLE VaccinationRecords (
		DogID INTEGER NOT NULL,
		Filename VARCHAR(70) NOT NULL,
		Approved BIT NOT NULL,
		ExpireDate DATE,
		ReviewedBy INT,
		ReviewedDate DATE,
		PRIMARY KEY (DogID)
	);

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='ClassPhotos' and xtype='U')
	CREATE TABLE ClassPhotos (
		ID INTEGER IDENTITY NOT NULL,
		ClassTypeID INTEGER NOT NULL,
		Filename VARCHAR(70) NOT NULL,
		PRIMARY KEY (ID)
	);

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='ClassTypes' and xtype='U')
	CREATE TABLE ClassTypes (
		ID INTEGER IDENTITY NOT NULL,
		Title VARCHAR(156) NOT NULL,
		Description VARCHAR(2048) NOT NULL,
		Requirements VARCHAR(512),
		ImageFilename VARCHAR(70) DEFAULT 'ClassPlaceholder.png',
		Duration VARCHAR(128) NOT NULL,
		Price MONEY NOT NULL,
		PRIMARY KEY (ID),
		UNIQUE (Title)
	);

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='ClassSections' and xtype='U')
	CREATE TABLE ClassSections (
		ID INTEGER IDENTITY NOT NULL,
		ClassTypeID INTEGER NOT NULL,
		InstructorID INTEGER NOT NULL,
		RosterCapacity INTEGER NOT NULL,
		PRIMARY KEY (ID)
	);

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='ClassMeetings' and xtype='U')
	CREATE TABLE ClassMeetings (
		ID INTEGER IDENTITY NOT NULL,
		ClassSectionID INTEGER NOT NULL,
		StartDate DATETIME NOT NULL,
		EndDate DATETIME NOT NULL,
		PRIMARY KEY (ID),
		-- Start and End should be on the same day
		CONSTRAINT CHK_Dates CHECK (DATEDIFF(Day, StartDate, EndDate) = 0)
	);

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='SectionApplications' and xtype='U')
	CREATE TABLE SectionApplications (
		ID INTEGER IDENTITY NOT NULL,
		ClassSectionID INTEGER NOT NULL,
		DogID INTEGER NOT NULL,
		Status VARCHAR(15) NOT NULL,
		Approved BIT NOT NULL,
		Refunded BIT NOT NULL,
		ReviewedBy INTEGER,
		ReviewedDate DATE,
		PRIMARY KEY (ID)
	);

ALTER TABLE Users ADD FOREIGN KEY (UserRoleID) REFERENCES UserRoles(ID);
ALTER TABLE UserDogs ADD FOREIGN KEY (UserID) REFERENCES Users(ID);
ALTER TABLE UserDogs ADD FOREIGN KEY (DogID) REFERENCES Dogs(ID);
ALTER TABLE VaccinationRecords ADD FOREIGN KEY (DogID) REFERENCES Dogs(ID);
ALTER TABLE ClassPhotos ADD FOREIGN KEY (ClassTypeID) REFERENCES ClassTypes(ID);
ALTER TABLE ClassSections ADD FOREIGN KEY (InstructorID) REFERENCES Users(ID);
ALTER TABLE ClassSections ADD FOREIGN KEY (ClassTypeID) REFERENCES ClassTypes(ID);
ALTER TABLE ClassMeetings ADD FOREIGN KEY (ClassSectionID) REFERENCES ClassSections(ID);
ALTER TABLE SectionApplications ADD FOREIGN KEY (ClassSectionID) REFERENCES ClassSections(ID);
ALTER TABLE SectionApplications ADD FOREIGN KEY (DogID) REFERENCES Dogs(ID);