/*
Debug Post-Deployment Script
--------------------------------------------------------------------------------------
	This script runs other scripts that seed the database with test data
--------------------------------------------------------------------------------------
*/

/*
	Generally Required Scripts
*/
PRINT '*****  Executing Generally Required Scripts  *****';

-- Insert Placeholder Rows for Deletable Entities


/*
	Debug Specific Scripts
*/
PRINT '*****  Seeding the DB with Test Data  *****';

:r ..\Seeding\InsertTestData.sql