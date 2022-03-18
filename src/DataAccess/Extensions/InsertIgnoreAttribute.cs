using System;

namespace DataAccess.Extensions
{
    /// <summary>
    /// Makes it so this property never gets updated on the Database through Insert queries from the BaseRepo.
    /// Use it on auto generated columns like IDs or on Columns that shouldn't be overriden using the BaseRepo Add()
    /// </summary>
    [AttributeUsage(AttributeTargets.Property)]
    public class InsertIgnoreAttribute : Attribute
    {
    }
}
