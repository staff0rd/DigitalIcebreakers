using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using PlaywrightSharp;


namespace DigitalIcebreakers.EndToEndTests
{
    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton((x) => x.GetRequiredService<IConfiguration>().Get<TestSettings>());
            services.AddSingleton<DisposableServices>();
            Playwright.InstallAsync().Wait();
            services.AddSingleton<IPlaywright>((x) => {
                var playwright = Playwright.CreateAsync().Result;
                x.GetRequiredService<DisposableServices>().Services.Add(playwright);
                return playwright;
            });
            services.AddSingleton<BrowserFactory>();
        }
        
        public void ConfigureHost(IHostBuilder hostBuilder)
        {
            var config = new ConfigurationBuilder()
                .AddEnvironmentVariables()
                .Build();

            hostBuilder.ConfigureHostConfiguration(x => x.AddConfiguration(config));
        }
    }
}