using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DigitalIcebreakers.Games;
using Microsoft.AspNetCore.Http.Connections;
using Microsoft.AspNetCore.Http.Connections.Features;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace DigitalIcebreakers.Hubs
{
    public class GameHub : Hub
    {
        static int lobbyNumber = 0;
        private ILogger<GameHub> _logger;
        private List<Lobby> _lobbys;
        private AppSettings _settings;

        public GameHub(ILogger<GameHub> logger, List<Lobby> lobbys, IOptions<AppSettings> settings)
        {
            _lobbys = lobbys;
            _logger = logger;
            _settings = settings?.Value;
        }

        public async Task StopGame()
        {
            var games = _lobbys.SelectMany(p => p.Players, (g, p) => new { g, p }).Where(p => p.p.IsAdmin && p.p.ConnectionId == Context.ConnectionId).Select(p => p.g).ToList();
            foreach (var game in games)
            {
                foreach (var player in game.Players)
                {
                    await Clients.Client(player.ConnectionId).SendAsync("stop");
                }
                _lobbys.Remove(_lobbys.Single(p => p.Id == game.Id));
            }
        }

        public async Task CreateLobby(Guid id, string name, User user)
        {
            _lobbys.Where(p => p.Admin != null && p.Admin.Id == user.Id)
                .ToList()
                .ForEach(async l => await CloseLobby(l));

            var lobby = new Lobby
            {
                Id = id,
                Number = ++lobbyNumber,
                Players = new List<Player>
                {
                    new Player { ConnectionId = Context.ConnectionId, Id = user.Id, IsAdmin = true, IsConnected = true, Name = user.Name }
                },
                Name = name
            };

            _lobbys.Add(lobby);

            _logger.LogInformation("{action} {lobbyName} for {id}", "created", lobby.Name, id);

            await Connect(user, id);
        }

        public async Task CloseLobby()
        {
            var lobby = _lobbys.SingleOrDefault(l => l.Players.Any(p => p.IsAdmin && p.ConnectionId == Context.ConnectionId));
            await CloseLobby(lobby);
        }

        private async Task CloseLobby(Lobby lobby)
        {
            if (lobby != null)
            {
                _logger.LogInformation("Lobby {lobbyName} (#{lobbyNumber}, {lobbyPlayers} players) has been {action}", lobby.Name, lobby.Number, lobby.PlayerCount, "closed");
                _lobbys.Remove(lobby);
                foreach (var player in lobby.Players)
                {
                    await Clients.Client(player.ConnectionId).SendAsync("closelobby");
                }
            }
        }

        private HttpTransportType? GetTransportType() {
            return Context.Features.Get<IHttpTransportFeature>()?.TransportType;
        }

        public async Task Connect(User user, Guid? lobbyId = null)
        {
            var player = GetPlayer(user);
            var lobby = GetLobby();

            if (lobbyId.HasValue && lobby != null && lobbyId.Value != lobby.Id)
                await LeaveLobby(player, lobby);
            else
            {
                await Connect(player, lobby);
            }
        }

        private async Task Connect(Player player, Lobby lobby)
        {
            player.IsConnected = true;
            if (lobby != null)
            {
                _logger.LogInformation("{player} {action} to lobby {lobbyName} (#{lobbyNumber}, {lobbyPlayers} players)", player, "re-connected", lobby.Name, lobby.Number, lobby.PlayerCount);
                var players = lobby.Players.Where(p => !p.IsAdmin).Select(p => new User { Id = p.ExternalId, Name = p.Name }).ToList();
                await Clients.Caller.SendAsync("Reconnect", new Reconnect { PlayerId = player.Id, PlayerName = player.Name, LobbyName = lobby.Name, LobbyId = lobby.Id, IsAdmin = player.IsAdmin, Players = players, CurrentGame = lobby.CurrentGame?.Name });
                if (!player.IsAdmin)
                {
                    await Clients.Client(lobby.Admin.ConnectionId).SendAsync("joined", new User { Id = player.ExternalId, Name = player.Name });
                    await SystemMessage("join");
                }
            }
            else {
                _logger.LogInformation("{player} {action} ({transportType})", player, "connected", this.GetTransportType());
                await Clients.Caller.SendAsync("Connected");
            }
        }

        private Player GetPlayer(User user)
        {
            var player = _lobbys.SelectMany(p => p.Players).SingleOrDefault(p => p.Id == user.Id) ?? new Player { Id = user.Id, Name = user.Name };
            
            player.ConnectionId = Context.ConnectionId;

            return player;
        }

        public void NewGame(string name)
        {
            var player = GetPlayerByConnectionId();
            var lobby = GetLobby();

            if (lobby != null && player.IsAdmin)
            {
                _logger.LogInformation("Lobby {lobbyName} (#{lobbyNumber}, {lobbyPlayers} players) has {action} {game}", lobby.Name, lobby.Number, lobby.PlayerCount, "started", name);
                lobby.CurrentGame = GetGame(name);
                Clients.Clients(lobby.Players.Select(p => p.ConnectionId).ToList()).SendAsync("newgame", name);
                lobby.CurrentGame.Start(this);
            }
        }

        private static IGame GetGame(string name)
        {
            switch (name)
            {
                case "doggos-vs-kittehs": return new DoggosVsKittehs();
                case "yes-no-maybe": return new YesNoMaybe();
                case "buzzer": return new Buzzer();
                case "pong": return new Pong();
                case "ideawall": return new IdeaWall();
                case "broadcast": return new Broadcast();
                case "startstopcontinue": return new StartStopContinue();
                default: throw new ArgumentOutOfRangeException("Unknown game");
            }
        }

        public void EndGame()
        {
            var player = GetPlayerByConnectionId();
            var lobby = GetLobby();

            if (lobby != null && player.IsAdmin)
            {
                lobby.CurrentGame = null;
                Clients.Clients(lobby.Players.Select(p => p.ConnectionId).ToList()).SendAsync("endgame");
            }
        }

        public Player GetAdmin()
        {
            return GetLobby().Admin;
        }

        public Lobby GetLobby()
        {
            var player = GetPlayerByConnectionId();
            return _lobbys.SingleOrDefault(p => p.Players.Contains(player));
        }

        public bool IsAdmin => GetAdmin().ConnectionId == Context.ConnectionId;

        public Player GetPlayerByConnectionId()
        {
            var player = _lobbys.SelectMany(p => p.Players).SingleOrDefault(p => p.ConnectionId == Context.ConnectionId);
            return player;
        }

        public async Task ConnectToLobby(User user, Guid lobbyId)
        {
            var player = GetPlayer(user);
            var existingLobby = GetLobby();
            if (existingLobby != null)
            {
                if (existingLobby.Id != lobbyId)
                {
                    await LeaveLobby(player, existingLobby);
                }
                else
                {
                    await Connect(player, existingLobby);
                }
            }
            else
            {
                var lobby = _lobbys.SingleOrDefault(p => p.Id == lobbyId);
                if (lobby == null)
                {
                    await Clients.Caller.SendAsync("closelobby");
                }
                else
                {
                    _logger.LogInformation("{player} has joined {lobbyName} (#{lobbyNumber}, {lobbyPlayers} players)", player, lobby.Name, lobby.Number, lobby.PlayerCount);
                    lobby.Players.Add(player);
                    await Connect(player, lobby);
                }
            }
        }

        private async Task LeaveLobby(Player player, Lobby lobby)
        {
            _logger.LogInformation("{player} has left {lobbyName} (#{lobbyNumber}, {lobbyPlayers} players)", player, lobby.Name, lobby.Number, lobby.PlayerCount);
            await Clients.Client(lobby.Admin.ConnectionId).SendAsync("left", new User { Id = player.ExternalId, Name = player.Name });
            lobby.Players.Remove(player);
        }

        public async override Task OnDisconnectedAsync(Exception exception)
        {
            await SystemMessage("leave");
            var player = GetPlayerByConnectionId();
            if (player != null)
            {
                _logger.LogInformation("{player} {action}", player, "disconnected");
                player.IsConnected = false;
                var admin = GetAdmin();
                if (admin != null)
                {
                    await Clients.Client(admin.ConnectionId).SendAsync("left", new User { Id = player.ExternalId, Name = player.Name });
                }
            }

            await base.OnDisconnectedAsync(exception);
        }

        private async Task SystemMessage(string action)
        {
            var payload = JsonConvert.SerializeObject(new HubMessage { System = action });
            await HubMessage(payload);
        }

        public async Task HubMessage(string json) 
        {
            var lobby = GetLobby();
            if (lobby != null && lobby.CurrentGame != null) 
            {
                dynamic payload = JsonConvert.DeserializeObject(json);
                await lobby.CurrentGame.Message(payload, this);
            }
        }
    }
}
