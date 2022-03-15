using System;

namespace DataAccess.Extensions
{
    /// <summary>
    /// Makes it so this property never gets exported
    /// </summary>
    [AttributeUsage(AttributeTargets.Property)]
    public class ExportIgnoreAttribute : Attribute
    {
    }
}
