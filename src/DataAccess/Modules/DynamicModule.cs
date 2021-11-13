using Autofac;
using System;
using System.Collections.Generic;

namespace DataAccess.Modules
{
    internal sealed class DynamicModule : Module
    {
        private readonly IList<Action<ContainerBuilder>> actions;

        public DynamicModule(IList<Action<ContainerBuilder>> actions) =>
            this.actions = actions;

        protected override void Load(ContainerBuilder builder)
        {
            foreach (var action in actions)
                action(builder);
            base.Load(builder);
        }
    }
}
