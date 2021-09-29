using System;
using System.Diagnostics;
using System.IO;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Autofac;
using K9OCRS.DataAccess;
using K9OCRS.DataAccess.Modules;
// using K9OCRS.Repositories;
// using K9OCRS.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Serilog;

namespace K9OCRS
{
    public class Startup
    {
        private readonly IConfiguration configuration;

        public Startup(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            LogStartup();

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidateAudience = false,
                    ValidIssuer = configuration.GetValue<string>("Jwt:Issuer"),
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration.GetValue<string>("JWT_KEY")))
                };
                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        context.Token = context.Request.Cookies["jwt"];
                        return Task.CompletedTask;
                    }
                };
            });

            services.AddMvc();

            services
                .AddHttpContextAccessor()
                .AddControllersWithViews();

            // Http Clients
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            // Serilog Logging
            Log.Logger = new LoggerConfiguration()
                .ReadFrom.Configuration(configuration)
                .Enrich.WithProperty("App Name", "K9OCRS")
                .WriteTo.Console()
                .CreateLogger();

            void LogStartup()
            {
                var pid = Process.GetCurrentProcess().Id;
                var name = GetType().Namespace;
                Console.WriteLine("[{0}] service started as pid [{1}]", name, pid);
            }

            services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1",
                    new Microsoft.OpenApi.Models.OpenApiInfo
                    {
                        Title = "K9OCRS API",
                        Description = "API for the K9 Obedience Club Registration System",
                        Version = "v1"
                    });

                var fileName = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var filePath = Path.Combine(AppContext.BaseDirectory, fileName);
                options.IncludeXmlComments(filePath);

                options.EnableAnnotations();
            });
        }

        // Here we'll register repositories and services
        public void ConfigureContainer(ContainerBuilder builder)
        {
            var connectionStringResolver = new ConnectionStringResolver
            {
                DB_HOST = configuration.GetValue<string>("DB_HOST"),
                DB_PORT = configuration.GetValue<string>("DB_PORT"),
                DB_NAME = configuration.GetValue<string>("DB_NAME"),
                DB_USER = configuration.GetValue<string>("DB_USER"),
                DB_PASS = configuration.GetValue<string>("DB_PASS")
            };

            // Modules
            builder.RegisterModule(new ModuleBuilder()
                .UseConnectionOwner(connectionStringResolver)
                .Build());

            // Repositories
            //builder.RegisterType<AuthRepository>().AsImplementedInterfaces().SingleInstance();

            // Services
            //builder.RegisterType<AuthService>()
            //    .WithParameter("jwtkey", configuration.GetValue<string>("JWT_KEY"))
            //    .WithParameter("jwtissuer", configuration.GetValue<string>("Jwt:Issuer"))
            //    .AsImplementedInterfaces()
            //    .SingleInstance();
            //builder.RegisterType<VolunteerService>().AsImplementedInterfaces().SingleInstance();
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
                app.UseExceptionHandler("/Home/Error");
            }

            var forwardedHeadersOptions = new ForwardedHeadersOptions
            {
                RequireHeaderSymmetry = false,
                ForwardedHeaders = ForwardedHeaders.All
            };
            forwardedHeadersOptions.KnownNetworks.Clear();
            forwardedHeadersOptions.KnownProxies.Clear();

            app.UseHttpsRedirection();

            app
                .UseStaticFiles()
                .UseRouting();

            app
                .UseAuthentication()
                .UseAuthorization();

            app.UseSwagger();

            app.UseSwaggerUI(options =>
            {
                options.SwaggerEndpoint("/swagger/v1/swagger.json", "K9OCRS API");
            });

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapFallbackToController("Index", "Home");
            });

            app.UseCors(policy =>
            {
                var allowedOrigins = configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? new string[] { };
                policy.WithOrigins(allowedOrigins);
                policy.AllowAnyHeader();
                policy.AllowAnyMethod();
            });
        }
    }
}
