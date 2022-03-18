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

:r ..\Seeding\InsertRequiredData.sql


/*
	Debug Specific Scripts
*/
PRINT '*****  Seeding the DB with Test Data  *****';

:r ..\Seeding\InsertTestData.sql
