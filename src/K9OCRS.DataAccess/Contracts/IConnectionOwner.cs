using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using Npgsql;

namespace K9OCRS.DataAccess.Contracts
{
    // Create and open a connection, then execute the specified function within the scope of that connection.
    public interface IConnectionOwner
    {
        Task<TResult> Use<TResult>(Func<NpgsqlConnection, Task<TResult>> func);
        Task Use(Func<NpgsqlConnection, Task> func);
        TResult UseSync<TResult>(Func<NpgsqlConnection, TResult> func);
        IAsyncEnumerable<TResult> Use<TResult>(Func<NpgsqlConnection, IAsyncEnumerable<TResult>> func);
        Task<TResult> UseTransaction<TResult>(Func<NpgsqlConnection, NpgsqlTransaction, Task<TResult>> func);
        Task UseTransaction(Func<NpgsqlConnection, NpgsqlTransaction, Task> func);
    }
}
