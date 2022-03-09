using System;

namespace DataAccess.Extensions
{
    /// <summary>
    /// Makes it so this property never gets updated on the Database through Update queries from the BaseRepo.
    /// Use it on auto generated columns like IDs or on Columns that shouldn't be overriden using the BaseRepo Update()
    /// </summary>
    [AttributeUsage(AttributeTargets.Property)]
    public class UpdateIgnoreAttribute : Attribute
    {
    }
}
