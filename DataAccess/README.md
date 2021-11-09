# K9OCRS - DataAccess Project

This project is meant to be a middleman between the Database and the web project. Below I will include a brief explanation on the components within it. You won't need to modify any of the files not mentioned here.

## Table of Contents

1. [Definitions](#definitions)
2. [How is this used?](#how-is-this-used?)
3. [Using Custom Repositories](#using-custom-repositories)

---

## Definitions

- **Entity**: This is a 1-to-1 representation of a database table structure, each of its properties represents one column on the table. If you need to add anything that is not a database column then create a **Model** on the web project, not an entity.
- **Repository**: This is a class that contains all database queries that interact directly with the database. There should be one of these for each Entity.
- **Contracts**: These are simply interfaces that contain definitions of public methods that their implementing classes must, well, implement.
- **ConnectionOwner**: This class ensures that connections and transactions are disposed of properly.
- **DbOwner**: This class is simply a collection of repositories so that you can access all repositories without having to inject many of them all over the place.

## How is this used?

Example table: dbo.Books

| ID : int, not null |    Title : nvarchar(128), not null    |
| :----------------: | :-----------------------------------: |
|         1          | Harry Potter and the Sorcerer's Stone |

The process of making a new database table usable through a repository goes like this:

1. Add the table name to the `Constants/DbTables.cs` table name's mapping

```c#
public class DbTables {
        private static Dictionary<string, string> mappings = new Dictionary<string, string>
        {
            { nameof(Book), "[dbo].[Books]" },
        };
	...
}
```

2. Create an **entity** that represents the table

```c#
public class Book {
    public int ID { get; set; }
    public string Title { get; set; }
}
```

3. Create a **repository** for your new **entity**. If your entity doesn't have an ID property or needs more fine grained control when doing any of the CRUD operations, you'll need to create a custom repository, which I'll cover after this section. For now lets create a basic repository that simply extends the `BaseRepository`

```c#
public class BooksRepository : BaseRepository<Book>
{
    // Everytime that you create a repository, make sure you include a constructor that calls the "base constructor"
    // passing in the Db table name that is associated to it by using this syntax
    public BooksRepository() : base(DbTables.Get(nameof(Book))) { }
}
```

4. Register your **repository** with the **DbOwner** class

```c#
public class DbOwner
{
    public readonly IRepository<Book> Books;

    public DbOwner()
    {
        Books = new BooksRepository();
    }
}
```

5. You're done! now you can use the repository from another class like this

```c#
public class ExampleBooksController : ControllerBase
{
    // Using dependency injection to get these
    private readonly IConnectionOwner connectionOwner;
    private readonly DbOwner dbOwner;
    
    public ClassTypesController(
        IConnectionOwner connectionOwner,
        DbOwner dbOwner
    )
    {
        this.connectionOwner = connectionOwner;
        this.dbOwner = dbOwner;
    }
    
    // Creating a Get endpoint that returns all Books in the DB table
    [HttpGet]
    public async Task<IActionResult> GetAllBooks()
    {
        // Get the connection from the connectionOwner
        var result = await connectionOwner.Use(dbConnection =>
		{
            // Call our repository passing in the connection
            return dbOwner.Books.GetAll(dbConnection);
        });
        return Ok(result);
    }
}
```



## Using Custom Repositories

Example table: dbo.Books (modified)

| BookID : int, not null |    Title : nvarchar(128), not null    |
| :--------------------: | :-----------------------------------: |
|           1            | Harry Potter and the Sorcerer's Stone |

If your entity doesn't use an ID column as its primary key, or you require more fine grained control over how it does a CRUD operation, you can override the methods provided by the **BaseRepository**. Or you can add new methods for new functionality.

In this case all steps except #3 and #4 remain pretty much the same, excluding the obvious differences, so let me show you step #3 which splits into two steps, and #4 which is now #5

3. Create a new contract for your **repository** under `Repositories/Contracts/`. This is necessary to include any new methods that you create on top of the ones already provided by the base repo.

```c#
// Make sure to extend the IRepository contract
public interface IBooksRepository : IRepository<Book>
{
    // You only need to include those not already defined inside IRepository
    Task<Book> GetByTitle(IDbConnection conn, string title);
}
```

4. Create a **custom repository** for your new entity, that includes overrides and new methods.

```c#
// Make sure to also extend your newly created contract IBooksRepository
public class BooksRepository : BaseRepository<Book>, IBooksRepository
{
    // Same constructor passing the table name to the base constructor
    public BooksRepository() : base(DbTables.Get(nameof(Book))) { }
    
    // Because our entity's ID column is called BookID instead of just ID
    // We would need to override every method in the BaseRepository that
    // we want to use, since they all expect an ID column. For this reason
    // it's better to just stick to naming it ID. But for demonstration purposes
    // we'll override one of the methods
    public async override Task<Book> GetByID(IDbConnection conn, int id)
    {
        // This is the only thing that's different from the base implementation
        // since we're just changing the column name on the WHERE clause.
        // Also, note that the _tableName variable is comming from the BaseRepository
        var query = $"SELECT * FROM {_tableName} WHERE BookID=@Id";

        var result = await conn.QuerySingleOrDefaultAsync<Book>(query, new
        {
            Id = id
        });
        
        if (result == null)
            throw new KeyNotFoundException($"{_tableName} with id [{id}] could not be found.");

        return result;
    }
    
    // Now we'll add a method to get a book by the exact title instead of ID
    public async Task<Book> GetByTitle(IDbConnection conn, string title)
    {
        var query = $"SELECT * FROM {_tableName} WHERE Title=@Title"
        
        var result = await conn.QuerySingleOrDefaultAsync<Book>(query, new
        {
            Title = title
        });
        
        // This is probably not the best exception in this case but we'll go with it
        // for the example
        if (result == null)
            throw new KeyNotFoundException($"{_tableName} with title [{title}] could not be found.");

        return result;
    }
}
```

5. Register your new repository with the **DbOwner** using your new contract

```c#
public class DbOwner
{
    public readonly IBooksRepository Books;

    public DbOwner()
    {
        Books = new BooksRepository();
    }
}
```

6. Here's a quick example of using the new GetByTitle method

```c#
public class ExampleBooksController : ControllerBase
{
    ...
    // Creating a Post endpoint that returns a Book by its title
    // which would be passed on the body of the request
    [HttpPost]
    public async Task<IActionResult> GetAllBooks([FromBody] string title)
    {
        var result = await connectionOwner.Use(dbConnection =>
		{
            return dbOwner.Books.GetByTitle(dbConnection, title);
        });
        return Ok(result);
    }
}
```

