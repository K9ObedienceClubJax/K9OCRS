using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using K9OCRS.DataAccess.Contracts;
using Npgsql;

namespace K9OCRS.DataAccess.Modules
{
    public class ConnectionOwner : IConnectionOwner
    {
        private readonly string connectionString;

        public ConnectionOwner(ConnectionStringResolver connectionStringResolver)
        {
            this.connectionString = connectionStringResolver.getConnectionString;
        }

        public async Task<TResult> Use<TResult>(Func<NpgsqlConnection, Task<TResult>> func)
        {
            using (var cnxn = new NpgsqlConnection(connectionString))
            {
                await cnxn.OpenAsync().ConfigureAwait(false);
                return await func(cnxn).ConfigureAwait(false);
            }
        }

        public async Task Use(Func<NpgsqlConnection, Task> func)
        {
            using (var cnxn = new NpgsqlConnection(connectionString))
            {
                await cnxn.OpenAsync().ConfigureAwait(false);
                await func(cnxn).ConfigureAwait(false);
            }
        }

        public TResult UseSync<TResult>(Func<NpgsqlConnection, TResult> func)
        {
            using (var cnxn = new NpgsqlConnection(connectionString))
            {
                cnxn.Open();
                return func(cnxn);
            }
        }

        public async IAsyncEnumerable<TResult> Use<TResult>(Func<NpgsqlConnection, IAsyncEnumerable<TResult>> func)
        {
            using var conn = new NpgsqlConnection(connectionString);
            await conn.OpenAsync();
            await foreach (var result in func(conn))
            {
                yield return result;
            }
        }

        public async Task<TResult> UseTransaction<TResult>(Func<NpgsqlConnection, NpgsqlTransaction, Task<TResult>> func)
        {
            using (var cnxn = new NpgsqlConnection(connectionString))
            {
                await cnxn.OpenAsync().ConfigureAwait(false);
                var transaction = cnxn.BeginTransaction();
                var result = await func(cnxn, transaction).ConfigureAwait(false);
                transaction.Dispose();
                return result;
            }
        }

        public async Task UseTransaction(Func<NpgsqlConnection, NpgsqlTransaction, Task> func)
        {
            using (var cnxn = new NpgsqlConnection(connectionString))
            {
                await cnxn.OpenAsync().ConfigureAwait(false);
                var transaction = cnxn.BeginTransaction();
                await func(cnxn, transaction).ConfigureAwait(false);
                transaction.Dispose();
            }
        }
    }
}
