using Microsoft.AspNetCore.Http.Connections;
using Microsoft.AspNetCore.SignalR.Client;
using System;
using System.Diagnostics;
using System.Threading.Tasks;

namespace DigitalIcebreakers.Robot
{
    public class Client
    {
        private HubConnection _connection;
        private bool _sendInProgress;
        private volatile ConnectionState _connectionState = ConnectionState.Connecting;
        private User _user;

        public Client()
        {
            var id = Guid.NewGuid();
            _user = new User(id, id.ToString().Substring(0, 6));
        }


        public ConnectionState State => _connectionState;

        private void LogFault(string description, Exception exception)
        {
            var message = $"{description}: {exception.GetType()}: {exception.Message}";
            Trace.WriteLine(message);
        }

        public async Task Connect()
        {
            var id = Guid.NewGuid().ToString();
            await _connection.InvokeAsync("connect", _user, null);
        }

        public async Task JoinLobby(string lobbyId)
        {
            await _connection.InvokeAsync("connectToLobby", _user, lobbyId);
        }

        public async Task CreateAndStartConnectionAsync(string url, HttpTransportType transportType)
        {
            _connection = new HubConnectionBuilder()
                .WithUrl(url, options => options.Transports = transportType)
                .Build();

            _connection.Closed += (ex) =>
            {
                if (ex == null)
                {
                    Trace.WriteLine("Connection terminated");
                    _connectionState = ConnectionState.Disconnected;
                }
                else
                {
                    LogFault("Connection terminated with error", ex);
                    _connectionState = ConnectionState.Faulted;
                }

                return Task.CompletedTask;
            };

            await ConnectAsync();
        }

        private async Task ConnectAsync()
        {
            for (int connectCount = 0; connectCount <= 3; connectCount++)
            {
                try
                {
                    await _connection.StartAsync();
                    _connectionState = ConnectionState.Connected;
                    Trace.WriteLine("Connected");
                    break;
                }
                catch (Exception ex)
                {
                    LogFault("Connection.Start Failed", ex);

                    if (connectCount == 3)
                    {
                        _connectionState = ConnectionState.Faulted;
                        throw;
                    }
                }

                await Task.Delay(1000);
            }
        }
    }
}
