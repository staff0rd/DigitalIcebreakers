using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using DigitalIcebreakers.Games;
using DigitalIcebreakers.Logging;
using Microsoft.AspNetCore.Http.Connections;
using Microsoft.AspNetCore.Http.Connections.Features;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace DigitalIcebreakers.Hubs
{
    public class GameHub : Hub
    {
        protected readonly LobbyManager _lobbys;
        private LobbyLogger _logger;
        private AppSettings _settings;
        private readonly ClientHelper _clients;
        protected readonly Sender _send;
        protected virtual string ConnectionId => Context.ConnectionId;

        public GameHub(LobbyLogger logger, LobbyManager lobbyManager, IOptions<AppSettings> settings,
            ClientHelper clients)
        {
            _lobbys = lobbyManager;
            _logger = logger;
            _settings = settings?.Value;
            _clients = clients;
            _send = new Sender(_clients);
        }

        public async Task CreateLobby(string name, User user)
        {
            _lobbys.GetByAdminId(user.Id)
                .ToList()
                .ForEach(async l => await CloseLobby(l));

            var lobby = _lobbys.CreateLobby(name, new Player { ConnectionId = Context.ConnectionId, Id = user.Id, IsPresenter = true, IsConnected = true, IsRegistered = true, Name = user.Name });

            _logger.Log("Created", lobby);

            await Connect(user, lobby.Id);
        }

        public async Task CloseLobby()
        {
            var lobby = _lobbys.GetByAdminConnectionId(Context.ConnectionId);

            await CloseLobby(lobby);
        }

        private async Task CloseLobby(Lobby lobby)
        {
            if (lobby != null)
            {
                _logger.Log("Closed", lobby);
                _lobbys.Close(lobby);
                await _send.CloseLobby(ConnectionId, lobby);
            }
        }

        private HttpTransportType? GetTransportType()
        {
            return Context.Features.Get<IHttpTransportFeature>()?.TransportType;
        }

        public async Task Connect(User user, string lobbyId = null)
        {
            var player = GetOrCreatePlayer(user, ConnectionId);
            var lobby = _lobbys.GetLobbyByConnectionId(ConnectionId);
            _logger.Log(player, "Connect", lobby);
            if (lobbyId != null && _lobbys.GetLobbyById(lobbyId) != lobby)
                await LeaveLobby(player, lobby);
            else
            {
                await Reconnect(player, lobby);
            }
        }

        private async Task Reconnect(Player player, Lobby lobby)
        {
            player.IsConnected = true;
            if (lobby != null)
            {
                _logger.Log(player, "Reconnected", lobby, "({registered})", player.IsRegistered ? "Registered" : "Unregistered");

                await _send.Reconnect(lobby, player);
                if (!player.IsPresenter && player.IsRegistered)
                {
                    await _send.Joined(lobby, player);
                }
                await SystemMessage("join");
            }
            else
            {
                _logger.Log(player, "Connected", lobby, "({transportType})", this.GetTransportType());
                await _send.Connected(ConnectionId);
            }
        }

        private Player GetOrCreatePlayer(User user, string connectionId)
        {
            var player = _lobbys.GetOrCreatePlayer(user.Id, user.Name);

            player.ConnectionId = connectionId;
            if (user.IsRegistered)
            {
                player.IsRegistered = true;
                player.Name = user.Name;
            }

            return player;
        }

        public async Task NewGame(string name)
        {
            _lobbys.GetPlayerAndLobby(ConnectionId, out var player, out var lobby);

            if (lobby != null && player.IsPresenter)
            {
                var game = Game.GetGame(name, _send, _lobbys);
                if (game == null)
                {
                    _logger.Error($"Unknown game: {name}");
                }
                else
                {
                    _logger.Log(lobby, "{action} {game}", new[] { "Started", name });
                    lobby.NewGame(game);
                    await _send.NewGame(lobby, name);
                    await lobby.CurrentGame.Start(ConnectionId);
                }
            }
        }

        public async Task EndGame()
        {
            _lobbys.GetPlayerAndLobby(ConnectionId, out var player, out var lobby);

            if (lobby != null && player.IsPresenter)
            {
                lobby.EndGame();
                await _send.EndGame(lobby);
            }
        }

        public async Task ConnectToLobby(User user, string lobbyId)
        {
            var player = GetOrCreatePlayer(user, ConnectionId);
            var existingLobby = _lobbys.GetLobbyByConnectionId(ConnectionId);
            var lobby = _lobbys.GetLobbyById(lobbyId);

            if (existingLobby != null && existingLobby != lobby)
            {
                _logger.Log(player, "SwitchLobbys", lobby);
                await LeaveLobby(player, existingLobby);
            }

            if (lobby == null)
            {
                _logger.Log(player, "ConnectToClosedLobby", lobby);
                await _send.CloseLobby(ConnectionId);
            }
            else
            {
                if (!lobby.Players.Any(p => p.Id == player.Id))
                {
                    _logger.Log(player, "AddToLobby", lobby);
                    lobby.Players.Add(player);
                }
                await Reconnect(player, lobby);
            }
        }

        private async Task LeaveLobby(Player player, Lobby lobby)
        {
            _logger.Log(player, "Left", lobby);
            await _send.PlayerLeft(lobby, player);
            player.IsRegistered = false;
            lobby.Players.Remove(player);
        }

        public async override Task OnDisconnectedAsync(Exception exception)
        {
            // disconnects only logged for players
            await SystemMessage("leave");
            _lobbys.GetPlayerAndLobby(ConnectionId, out var player, out var lobby);
            if (player != null)
            {
                _logger.Log(player, "Disconnected", lobby);
                player.IsConnected = false;
                if (lobby != null)
                {
                    await _send.PlayerLeft(lobby, player);
                }
            }
            await base.OnDisconnectedAsync(exception);
        }

        private async Task SystemMessage(string action)
        {
            var payload = JsonConvert.SerializeObject(new HubMessage { system = action });
            await HubMessage(payload);
        }

        public async Task HubMessage(string json)
        {
            var lobby = _lobbys.GetLobbyByConnectionId(ConnectionId);
            if (lobby != null && lobby.CurrentGame != null)
            {
                var message = JObject.Parse(json);

                var system = message["system"];
                var admin = message["admin"];
                var client = message["client"];

                try
                {
                    if (system != null)
                    {
                        _logger.Debug($"system: {system}");
                        await lobby.CurrentGame.OnReceiveSystemMessage(system, ConnectionId);
                    }

                    if (admin != null && _lobbys.PlayerIsPresenter(ConnectionId))
                    {
                        _logger.Debug($"admin: {admin.ToString(Formatting.None)}");
                        await lobby.CurrentGame.OnReceivePresenterMessage(admin, ConnectionId);
                    }

                    if (client != null)
                    {
                        _logger.Debug($"client: {client.ToString(Formatting.None)}");
                        await lobby.CurrentGame.OnReceivePlayerMessage(client, ConnectionId);
                    }
                }
                catch (Exception e)
                {
                    // TODO: this occurs because a presenter is sending a message to a game that 
                    // hasn't yet been selected. Race condition during EndToEndTests
                    _logger.Error(e.Message);
                }
            }
        }
    }
}
