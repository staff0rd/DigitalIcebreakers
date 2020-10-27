using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace DigitalIcebreakers
{
    public class TimeoutLobbyService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;

        public TimeoutLobbyService(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        protected async override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                var lobbys = scope.ServiceProvider.GetRequiredService<LobbyManager>();
                while (!stoppingToken.IsCancellationRequested)
                {
                    await Task.Delay(30_000);
                    lobbys.CloseInactive();
                }
            }
        }
    }
}