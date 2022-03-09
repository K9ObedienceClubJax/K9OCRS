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
using K9OCRS.Configuration;
using System.IO;
using System.Reflection;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

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
            services.AddHttpContextAccessor();
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = Configuration["Jwt:Issuer"],
                    ValidAudience = Configuration["Jwt:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["Jwt:Key"]))
                };
              
            });

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

                if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") != "Production")
                {

                    var srcPath = Path.GetFullPath(Path.Combine(System.AppContext.BaseDirectory, "..", "..", "..", ".."));
                    var dataAccessPath = Path.Combine(srcPath, "DataAccess", "bin", "Debug");

                    var mainName = typeof(Startup).GetTypeInfo().Assembly.GetName().Name;
                    var dataAccessName = typeof(ModuleBuilder).GetTypeInfo().Assembly.GetName().Name;

                    options.IncludeXmlComments("bin/Debug/" + mainName + ".xml");
                    options.IncludeXmlComments(Path.Combine(dataAccessPath, dataAccessName + ".xml"));
                }
            });
        }

        // Here we'll register repositories and services
        public void ConfigureContainer(ContainerBuilder builder)
        {
            

            // Modules

            var dataAccessModule = new ModuleBuilder();
            string databaseConnectionString;
            string storageBasePath;

            if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Local")
            {
                // This relative path will be used for generating the file urls
                storageBasePath = Configuration.GetValue<string>("StorageBasePaths:LocalStorage");
                // This one will be used for actually storing files
                var fullStorageBasePath = Path.Combine(Environment.CurrentDirectory, "ClientApp", "public", storageBasePath);
                databaseConnectionString = Configuration.GetConnectionString("LocalDB");
                
                dataAccessModule.UseLocalStorage(fullStorageBasePath);
            }
            else
            {
                // Creates the connection strings from environment variables set in the .env file
                // and a template connection string from appsettings.json
                databaseConnectionString = String.Format(
                        Configuration.GetConnectionString("Database"),
                        Configuration.GetValue<string>("DB_SERVER"),
                        Configuration.GetValue<string>("DB_NAME"),
                        Configuration.GetValue<string>("DB_USERNAME"),
                        Configuration.GetValue<string>("DB_PASSWORD")
                );

                var blobStorageConnectionString = String.Format(
                    Configuration.GetConnectionString("BlobStorage"),
                    Configuration.GetValue<string>("STORAGE_NAME"),
                    Configuration.GetValue<string>("STORAGE_KEY")
                );

                storageBasePath = Configuration.GetValue<string>("StorageBasePaths:AzureBlobStorage");

                dataAccessModule.UseAzureBlobStorage(blobStorageConnectionString);
            }

            dataAccessModule.UseSqlDatabase(databaseConnectionString);

            builder.RegisterModule(dataAccessModule.Build());

            builder.RegisterType<ServiceConstants>()
                    .WithParameter("storageBasePath", storageBasePath)
                    .SingleInstance()
                    .AsSelf();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment() || env.IsEnvironment("Local"))
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
            app.UseAuthentication();
            app.UseAuthorization();

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
                //spa.Options.DevServerPort = 5002;

                //if (env.IsDevelopment())
                //{
                //    spa.UseReactDevelopmentServer(npmScript: "start");
                //}
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
