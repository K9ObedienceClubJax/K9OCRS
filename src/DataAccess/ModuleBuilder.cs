using System;
using System.Collections.Generic;
using Autofac;
using DataAccess.Modules;
using DataAccess.Modules.Contracts;

namespace DataAccess
{
    /// <summary>
    /// All of the ModuleBuilder methods register to autofac
    /// </summary>
    public sealed class ModuleBuilder
    {
        private readonly IList<Action<ContainerBuilder>> actions = new List<Action<ContainerBuilder>>();

        /// <summary>
        /// Setup a database to be able to be resolved.
        /// </summary>
        /// <returns></returns>
        public ModuleBuilder UseConnectionOwner(string connectionString)
        {
            actions.Add(builder =>
            {
                builder.RegisterType<ConnectionOwner>()
                 .As<IConnectionOwner>()
                 .WithParameter("connectionString", connectionString)
                 .SingleInstance()
                 .PreserveExistingDefaults();

                // Repositories
                builder.RegisterType<DbOwner>().SingleInstance();
            });

            return this;
        }

        // Construct the module based on the configuration methods.
        public Module Build()
        {
            return new DynamicModule(actions);
        }
    }
}
