using System;
using System.Collections.Generic;
using Autofac;
using K9OCRS.DataAccess.Contracts;
using K9OCRS.DataAccess.Modules;

namespace K9OCRS.DataAccess
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
        public ModuleBuilder UseConnectionOwner(ConnectionStringResolver connectionStringResolver)
        {
            actions.Add(builder =>
                builder.RegisterType<ConnectionOwner>()
                    .As<IConnectionOwner>()
                    .WithParameter("connectionStringResolver", connectionStringResolver)
                    .SingleInstance()
                    .PreserveExistingDefaults());

            return this;
        }

        // Construct the module based on the configuration methods.
        public Module Build()
        {
            return new DynamicModule(actions);
        }
    }
}