
-- Users (The password for all is "Test123456")
IF NOT EXISTS (SELECT 1 FROM dbo.Users WHERE isSystemOwned = 0)
BEGIN
	INSERT INTO Users ([UserRoleID], FirstName, LastName, Email, [Password], [isMember])
	VALUES
		(1, 'John', 'Doe', 'admin@test.test', 'mpMcVawCvyFlUMRksZkqMMUi36v2yzHeraXHFrwTomM=', 1),
		(2, 'Cloud', 'Strife', 'instructor@test.test', 'mpMcVawCvyFlUMRksZkqMMUi36v2yzHeraXHFrwTomM=', 1),
		(3, 'Jack', 'Sparrow', 'member@test.test', 'mpMcVawCvyFlUMRksZkqMMUi36v2yzHeraXHFrwTomM=', 1),
		(3, 'Tom', 'Riddle', 'student@test.test', 'mpMcVawCvyFlUMRksZkqMMUi36v2yzHeraXHFrwTomM=', 0),
		(2, 'Darude', 'Sandstorm', 'guestinstructor@test.test', 'mpMcVawCvyFlUMRksZkqMMUi36v2yzHeraXHFrwTomM=', 0);
END

-- Dogs
IF NOT EXISTS (SELECT 1 FROM dbo.Dogs)
BEGIN
	INSERT INTO Dogs ([Name], [Breed], [DateOfBirth])
	VALUES
		('Max', 'Golden Retriever', '2021-08-07'),
		('Peanut', 'Pomeranian', '2020-09-02'),
		('Jeff', 'Pug', '2021-04-03'),
		('Max', 'German Shepherd', '2020-12-16'),
		('Juan', 'Chihuahua', '2020-07-26'),
		('Coin', 'Shiba Inu', '2021-02-15'),
		('Fred', 'Bulldog', '2020-05-19');
END


-- User-Dogs
IF NOT EXISTS (SELECT 1 FROM dbo.UserDogs)
BEGIN
	INSERT INTO UserDogs ([UserID], [DogID])
	VALUES
		(2,1),
		(2,6),
		(3,2),
		(4,3),
		(4,4),
		(5,5),
		(5,7);
END

-- Class Types
IF NOT EXISTS (SELECT 1 FROM dbo.ClassTypes WHERE isSystemOwned = 0)
BEGIN
	INSERT INTO ClassTypes (Title, [Description], Requirements, Duration, Price)
	VALUES
		('S.T.A.R Puppy','Raising a puppy can be fun and very rewarding and also a big challenge!  The K-9 Obedience Club offers classes to help you train your puppy to become a self-confident, happy and easy-to-live-with companion. Do not underestimate what your puppy can do and learn even at a very young age. This class is suitable for puppies from 3-6 months of age that have had two sets of immunization shots (8 & 10 weeks.)   We use positive reinforcement methods and games to make training fun for both the owner and the puppy.','3-6 months with 2 sets of inoculations (8 & 10 weeks)','7 weeks',140.00),
		('Advanced Puppy','Exercises perfected include walking on a loose leash with distractions including other people. Meeting and greeting other people with appropriate manners. �Come" from greater distances with distractions. Both sit and down stays from a distance with distractions.','Completion of S.T.A.R. PUPPY or demonstration of equivalent skills','7 weeks', 140.00),
		('Pet Therapy','K9 Obedience Club of Jacksonville has a long history within the pet therapy community.  Many club members took their beloved dog(s) to facilities in the Jacksonville and Orange Park areas.   We offered pre-assessments and specific classes to help owners hone up their dogs training or give guidance to help meet their goals for this rewarding work.',NULL,'7 weeks',140),
		('Family Dog','We use positive reinforcement methods and games to make training fun for both the owner and the dog. Tips and guidance for impulse control and discussions about many common behavioral issues such as biting, chewing, jumping, barking, socialization, separation anxiety and more. The subject of safety issues for kids & dog interactions will include the various stress signals dogs use daily.','This class is suitable for dogs over the age of 6 months that have completed their immunization shots, including rabies','7 weeks',140),
		('Obedience and Rally Skills','This course provides an introduction to the fundamental skills for all Obedience and Rally exercises, including an introduction to attentive heeling, fronts, recalls and stays.','Dog must walk on lead without excessive pulling, sit and down on verbal command and come when called.','6 Weeks',120),
		('Novice','This course will prepare you to compete in the AKC Beginner Novice and Novice classes. This includes on and off-lead heeling, recall and stays.','Completion of the skills class or equivalent skills','7 weeks',120),
		('Open','If you and your dog are getting a little bored with Novice training, why not start some Open training? This class will be geared toward learning CDX training techniques. We will be working on jumping, drops, teaching and perfecting retrieves as well as signals for Command Discrimination, and as always, polishing our heeling.','Dog must be able to perform all AKC Novice Obedience Exercises. A CD is not required.','7 weeks',120),
		('Utility','This course introduces dogs to the Utility exercises, including signals, scent discrimination, moving stand, directed retrieve, go-outs and directed jumping.  There will be very limited heeling work in this class. This class is intended for anyone who is interested in training these exercises.','Dog must be reliable off-lead around other dogs and distractions. They must also have basic retrieve skills (i.e. dumbbell).  It is not required that your dog have a CDX title.','7 weeks',120),
		('Agility Intro Level 1 & 2','Handler skills: (shaping luring, and molding techniques are explained).Overview of cues and importance of keeping criteria clear and consistent for the dogs.Handler mechanics (treat placement, type of treats to use, hierarchy of treat value what it means and why it matters). Body line and how to teach our dogs to move with us on the agility field. Introduces �it�s your choice� game to start building some impulse control for the dogs. Targeting (used to build forward drive). Hand touch targets. Foot targets. Contact safety.','Completion/concurrent enrollment in Puppy class or approval of instructor','6 weeks',120),
		('Intro Level Rally','Rally is a great way to learn how to start competing for the first time or with a new dog.  You can talk to your dog, give praise, encouragement and body cues to perform each sign.  Remember, all dogs including mixed breeds can now compete in AKC dog sports.','Dog can walk on Loose Leash while in the "heel" position. Solid Stays while handler circles the dog in a Sit, Down, & Stand position.','7 weeks',120),
		('Advanced Rally','Rally Advanced is for the handler and dog team that has taken Rally Intro Level (or a similar class) or has competed in Rally at some time.  Handlers must have a basic knowledge of the Rally Novice signs and Rally rules.  Dogs must be able to walk on a loose leash at the handlers side, and follow basic commands such as: sit, down, stay, and be able to work in a group setting.',NULL,'7 weeks',120),
		('Special Topics in Obedience','Topics might include a class which focuses on teaching tricks for the AKC trick titles or may on Jumping or on retrieves. It might be a class on the sport of �dancing with your dog.� It might focus on teaching puppies how to begin utility exercises. Out instructors have many and varied interests and this class provides them with an opportunity to share this knowledge.','Varies depending on the topics covered','4 weeks',70),
		('Conformation','This class includes conformation ring procedures, stacking, patterns, physical exam presentations, showmanship presentation skills as specified per breed, and sportsmanship criteria as well.','Minimum of 3 months with 2 sets of inoculations (usually given at 8 & 10 weeks). If dog is over 6 months, it must have proof of rabies inoculations.','6 weeks',150),
		('Trick Dog','Dogs want and crave mental workouts. What better way to satisfy this need through fun tricks while earning titles! AKC Trick Dog titles are official AKC titles listed on the dog�s title record. Purebreds and mixed breeds are eligible to earn AKC Trick Dog titles as well as many other sports like Obedience, Rally, Agility, Field Events, Herding and many more.',NULL,'7 weeks',120);
END

-- Class Sections
IF NOT EXISTS (SELECT 1 FROM dbo.ClassSections WHERE isSystemOwned = 0)
BEGIN
	INSERT INTO ClassSections ([ClassTypeID], [InstructorID], [RosterCapacity], [isDraft])
	VALUES
		(2, 2, 9, 0),
		(2, 3, 8, 0),
		(3, 6, 12, 0),
		(4, 3, 8, 1);
END

-- Class Meetings
INSERT INTO ClassMeetings ([ClassSectionID], [StartDate], [EndDate])
VALUES
	(2, '2022-01-13 13:00:00.000', '2022-01-13 15:00:00.000'),
	(2, '2022-01-20 14:00:00.000', '2022-01-20 16:00:00.000'),
	(2, '2022-01-27 14:00:00.000', '2022-01-27 16:00:00.000'),
	(3, '2022-01-13 13:00:00.000', '2022-01-13 15:00:00.000'),
	(3, '2022-02-17 14:00:00.000', '2022-02-17 16:00:00.000'),
	(3, '2022-04-20 15:00:00.000', '2022-04-20 17:00:00.000'),
	(4, '2022-07-13 16:00:00.000', '2022-07-13 18:00:00.000'),
	(4, '2022-07-17 16:00:00.000', '2022-07-17 18:00:00.000'),
	(4, '2022-07-20 14:00:00.000', '2022-07-20 16:00:00.000'),
	(4, '2022-07-24 14:00:00.000', '2022-07-24 16:00:00.000'),
	(5, '2022-01-13 13:00:00.000', '2022-01-13 15:00:00.000'),
	(5, '2022-02-17 14:00:00.000', '2022-02-17 16:00:00.000'),
	(5, '2022-04-20 15:00:00.000', '2022-04-20 17:00:00.000');

-- Section Applications
IF NOT EXISTS (SELECT 1 FROM dbo.[ClassApplications])
BEGIN
	INSERT INTO [ClassApplications] (ClassTypeID, ClassSectionID, DogID, [Status], [PaymentMethod], [isPaid], [isRefunded])
	VALUES
		(2, 2, 3, 'Active', 'PayPal', 1, 0),
		(2, 3, 4, 'Cancelled', 'Check', 0, 0),
		(2, 3, 5, 'Pending', 'Zelle', 0, 0),
		(2, 2, 7, 'Cancelled', 'PayPal', 1, 1),
		(3, 4, 6, 'Pending', 'PayPal', 1, 0),
		(3, 4, 4, 'Active', 'Check', 1, 0);
END