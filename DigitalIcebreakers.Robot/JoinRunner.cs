using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http.Connections;

namespace DigitalIcebreakers.Robot
{
    class JoinRunner
    {
        private string _targetUrl;
        private int _numberOfConnections;
        private HttpTransportType _transportType;
        private string _lobbyId;
        protected List<Client> _clients;

        public JoinRunner(string targetUrl, int numberOfConnections, HttpTransportType transportType, string lobbyId)
        {
            _targetUrl = targetUrl;
            _numberOfConnections = numberOfConnections;
            _transportType = transportType;
            _lobbyId = lobbyId;
        }

        internal virtual async Task RunAsync()
        {
            await Join();

            await Task.Delay(TimeSpan.FromSeconds(300));
        }

        protected async Task Join()
        {
            _clients = new List<Client>();
            var tasks = new List<Task>();

            for (int i = 0; i < _numberOfConnections; i++)
            {
                var client = new Client();
                _clients.Add(client);
                tasks.Add(Task.Run(async () =>
                {
                    await client.CreateAndStartConnectionAsync(_targetUrl, _transportType);
                    await client.Connect();
                    await client.JoinLobby(_lobbyId);
                }));
            }

            await Task.WhenAll(tasks);

            Console.WriteLine("All connected");
        }
    }
}
