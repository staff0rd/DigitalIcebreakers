using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http.Connections;

namespace DigitalIcebreakers.Robot
{
    class YesNoMaybeRunner : JoinRunner
    {

        public YesNoMaybeRunner(string targetUrl, int numberOfConnections, HttpTransportType transportType, string lobbyId) : base (targetUrl, numberOfConnections, transportType, lobbyId)
        {
        }

        internal async override Task RunAsync()
        {
            await Join();

            await Task.Delay(5000);

            var random = new Random();

            while (true)
            {
                var tasks = new List<Task>();
                foreach (var client in _clients)
                {
                    tasks.Add(Task.Run(async () =>
                    {
                        var choice = random.Next(2);
                        var wait = random.Next(10);

                        await Task.Delay(TimeSpan.FromSeconds(wait));

                        if (choice != 2)
                            await client.InvokeAsync("hubMessage", choice);
                    }));
                }
                await Task.WhenAll(tasks);
            }
        }
    }
}
