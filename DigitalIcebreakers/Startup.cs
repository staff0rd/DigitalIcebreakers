using DigitalIcebreakers.Hubs;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Collections.Generic;
using System;
using DigitalIcebreakers.Logging;

namespace DigitalIcebreakers
{
    public class Startup
    {
        public Startup(IConfiguration configuration, IWebHostEnvironment env)
        {
            Configuration = configuration;
            Environment = env;
        }

        public IConfiguration Configuration { get; }

        public IWebHostEnvironment Environment { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc();

            services.AddSignalR(options =>
            {
                options.EnableDetailedErrors = Environment.IsDevelopment();
                options.ClientTimeoutInterval = TimeSpan.FromSeconds(4);
                options.KeepAliveInterval = TimeSpan.FromSeconds(2);
            });

            // In production, the publish output packages the Vite build at web/dist
            // (relative to the content root); in development the Vite dev server is proxied instead
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "web/dist";
            });

            services.Configure<AppSettings>(Configuration);

            services.AddSingleton<List<Lobby>>();
            services.AddScoped<ClientHelper>();
            services.AddScoped<LobbyManager>();
            services.AddSingleton<LobbyIdService>();

            services.AddSingleton<LobbyLogger>();
            services.AddHostedService<TimeoutLobbyService>();
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
                app.UseHsts();
            }

            app.UseStaticFiles();
            app.UseSpaStaticFiles();
            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapHub<GameHub>("/gameHub");
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "../web";

                if (env.IsDevelopment())
                {
                    // In development, you'll run Vite separately on port 5173
                    spa.UseProxyToSpaDevelopmentServer("http://localhost:5173");
                }
            });
        }
    }
}
