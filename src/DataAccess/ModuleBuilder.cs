﻿using System;
using System.Collections.Generic;
using Autofac;
using DataAccess.Clients;
using DataAccess.Clients.Contracts;
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
        public ModuleBuilder UseSqlDatabase(string connectionString)
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

        /// <summary>
        /// Setup the azure storage client
        /// </summary>
        /// <param name="connectionString"></param>
        /// <returns></returns>
        public ModuleBuilder UseAzureBlobStorage(string connectionString)
        {
            actions.Add(builder =>
            {
                builder.RegisterType<AzureStorageClient>()
                 .As<IStorageClient>()
                 .WithParameter("connectionString", connectionString)
                 .SingleInstance()
                 .PreserveExistingDefaults();
            });

            return this;
        }

        /// <summary>
        /// Setup the local storage client
        /// </summary>
        /// <param name="connectionString"></param>
        /// <returns></returns>
        public ModuleBuilder UseLocalStorage(string localStorageBasePath)
        {
            actions.Add(builder =>
            {
                builder.RegisterType<LocalStorageClient>()
                 .As<IStorageClient>()
                 .WithParameter("localStorageBasePath", localStorageBasePath)
                 .SingleInstance()
                 .PreserveExistingDefaults();
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
