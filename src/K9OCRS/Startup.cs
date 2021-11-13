using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Autofac;
using Serilog;
using System;
using System.Diagnostics;
using DataAccess;

namespace K9OCRS
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            LogStartup();

            services.AddControllersWithViews();
            services.AddRazorPages().WithRazorPagesRoot("/Views");

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            // Http Clients
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            // Serilog Logging
            Log.Logger = new LoggerConfiguration()
                .ReadFrom.Configuration(Configuration)
                .Enrich.WithProperty("App Name", "K9OCRS")
                .WriteTo.Console()
                .CreateLogger();

            void LogStartup()
            {
                var pid = Process.GetCurrentProcess().Id;
                var name = GetType().Namespace;
                Console.WriteLine("[{0}] service started as pid [{1}]", name, pid);
            }

            // Add Swagger
            services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1",
                    new Microsoft.OpenApi.Models.OpenApiInfo
                    {
                        Title = "K9OCRS API",
                        Description = "API for the K9 Obedience Club Registration System",
                        Version = "v1"
                    });
            });
        }

        // Here we'll register repositories and services
        public void ConfigureContainer(ContainerBuilder builder)
        {
            // Creates the connection string from environment variables set in the .env file
            // and a template connection string from appsettings.json
            var connectionString = String.Format(
                    Configuration.GetConnectionString("Template"),
                    Configuration.GetValue<string>("DB_SERVER"),
                    Configuration.GetValue<string>("DB_NAME"),
                    Configuration.GetValue<string>("DB_USERNAME"),
                    Configuration.GetValue<string>("DB_PASSWORD")
            );

            // Modules
            builder.RegisterModule(new ModuleBuilder()
                .UseConnectionOwner(connectionString)
                .Build());
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                // app.UseHsts();
            }

            var forwardedHeadersOptions = new ForwardedHeadersOptions
            {
                RequireHeaderSymmetry = false,
                ForwardedHeaders = ForwardedHeaders.All
            };
            forwardedHeadersOptions.KnownNetworks.Clear();
            forwardedHeadersOptions.KnownProxies.Clear();

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseRouting();

            app.UseSwagger();

            app.UseSwaggerUI(options =>
            {
                options.SwaggerEndpoint("/swagger/v1/swagger.json", "K9OCRS API");
            });

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapRazorPages();
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });

            app.UseCors(policy =>
            {
                var allowedOrigins = Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? new string[] { };
                policy.WithOrigins(allowedOrigins);
                policy.AllowAnyHeader();
                policy.AllowAnyMethod();
            });
        }
    }
}
