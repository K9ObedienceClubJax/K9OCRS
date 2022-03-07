USE k9ocrs
GO

CREATE TRIGGER [dbo].[ClassSections_InsteadOfDELETE]
       ON [dbo].[ClassSections]
INSTEAD OF DELETE
AS
BEGIN
       DECLARE @Id INT
 
       SELECT @Id = DELETED.ID
       FROM DELETED
 
       IF @Id = 1
       BEGIN
              RAISERROR('Section 1 can not be deleted',16 ,1)
              ROLLBACK
       END
       ELSE
       BEGIN
              DELETE FROM [dbo].[ClassSections]
              WHERE ID = @Id
       END
END
GO