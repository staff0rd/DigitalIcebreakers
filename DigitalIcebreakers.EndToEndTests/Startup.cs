using System.Reflection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Shouldly;

namespace DigitalIcebreakers.EndToEndTests
{
    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton((x) => x.GetRequiredService<IConfiguration>().Get<TestSettings>());
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