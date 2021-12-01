using System;
using System.Data;
using System.Threading.Tasks;

namespace DataAccess.Modules.Contracts
{
    public interface IConnectionOwner
    {
        Task<TResult> Use<TResult>(Func<IDbConnection, Task<TResult>> func);
        Task Use(Func<IDbConnection, Task> func);
        Task<TResult> UseTransaction<TResult>(Func<IDbConnection, IDbTransaction, Task<TResult>> func);
        Task UseTransaction(Func<IDbConnection, IDbTransaction, Task> func);
    }
}
