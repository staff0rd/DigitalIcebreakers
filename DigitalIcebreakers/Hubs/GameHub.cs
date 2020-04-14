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
using Newtonsoft.Json.Linq;

namespace DigitalIcebreakers.Hubs
{
    public class GameHub : Hub, IGameHub
    {
        static int lobbyNumber = 0;
        private ILogger<GameHub> _logger;
        private List<Lobby> _lobbys;
        private AppSettings _settings;

        private SendHelper _clients;
        private SendHelper SendTo {
            get 
            {
                if (_clients == null)
                    _clients = new SendHelper(Clients);
                return _clients;
            }
        }

        public GameHub(ILogger<GameHub> logger, List<Lobby> lobbys, IOptions<AppSettings> settings)
        {
            _lobbys = lobbys;
            _logger = logger;
            _settings = settings?.Value;
        }

        public int GetConnectedPlayerCount()
        {
            return GetLobby().Players.Count(p => !p.IsAdmin && p.IsConnected);
        }

        public async Task SendGameUpdateToPlayers(params object[] parameters)
        {
            var clients =  SendTo.Players(GetLobby());
            await SendGameUpdate(clients, parameters);
        }

        public async Task SendGameUpdateToPlayer(Player player, params object[] parameters)
        {
            var clients =  SendTo.Player(player);
            await SendGameUpdate(clients, parameters);
        }

        private async Task SendGameUpdate(IClientProxy clients, params object[] parameters)
        {
            var method = "gameUpdate";
            switch (parameters.Length) {
                case 1: await clients.SendAsync(method, parameters[0]); break;
                case 2: await clients.SendAsync(method, parameters[0], parameters[1]); break;
                case 3: await clients.SendAsync(method, parameters[0], parameters[1], parameters[2]); break;
                default: throw new NotImplementedException();
            }
        }

        public async virtual Task SendGameUpdateToPresenter(params object[] parameters)
        {
            var client = SendTo.Admin(GetLobby());
            await SendGameUpdate(client, parameters);
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
                await SendTo.EveryoneInLobby(lobby).SendAsync("closelobby");
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
                await SendTo.Self().SendAsync("Reconnect", new Reconnect { PlayerId = player.Id, PlayerName = player.Name, LobbyName = lobby.Name, LobbyId = lobby.Id, IsAdmin = player.IsAdmin, Players = players, CurrentGame = lobby.CurrentGame?.Name });
                if (!player.IsAdmin)
                {
                    await SendTo.Admin(lobby).SendAsync("joined", new User { Id = player.ExternalId, Name = player.Name });
                    await SystemMessage("join");
                }
            }
            else {
                _logger.LogInformation("{player} {action} ({transportType})", player, "connected", this.GetTransportType());
                await SendTo.Self().SendAsync("Connected");
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
                SendTo.EveryoneInLobby(lobby).SendAsync("newgame", name);
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
                case "slideshow": return new Slideshow();
                case "react": return new Reaction();
                case "splat": return new Splat();
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
                SendTo.EveryoneInLobby(lobby).SendAsync("endgame");
            }
        }

        private Player GetAdmin()
        {
            return GetLobby().Admin;
        }

        public Player[] GetPlayers()
        {
            return GetLobby().GetPlayers();
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
            if (existingLobby != null && existingLobby.Id != lobbyId)
                await LeaveLobby(player, existingLobby);
           
            var lobby = _lobbys.SingleOrDefault(p => p.Id == lobbyId);
            if (lobby == null)            
                await SendTo.Self().SendAsync("closelobby");
            else
            {
                if (!lobby.Players.Any(p => p.Id == player.Id))
                    lobby.Players.Add(player);
                await Connect(player, lobby);
            }
        }

        private async Task LeaveLobby(Player player, Lobby lobby)
        {
            _logger.LogInformation("{player} has left {lobbyName} (#{lobbyNumber}, {lobbyPlayers} players)", player, lobby.Name, lobby.Number, lobby.PlayerCount);
            await SendTo.Admin(lobby).SendAsync("left", new User { Id = player.ExternalId, Name = player.Name });
            lobby.Players.Remove(player);
        }

        public async override Task OnDisconnectedAsync(Exception exception)
        {
            // disconnects only logged for players
            await SystemMessage("leave");
            var player = GetPlayerByConnectionId();
            if (player != null)
            {
                _logger.LogInformation("{player} {action}", player, "disconnected");
                player.IsConnected = false;
                var lobby = GetLobby();
                if (lobby != null)
                {
                    await SendTo.Admin(lobby).SendAsync("left", new User { Id = player.ExternalId, Name = player.Name });
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
            var lobby = GetLobby();
            if (lobby != null && lobby.CurrentGame != null) 
            {
                var message = JObject.Parse(json);
                
                var system = message["system"];
                var admin = message["admin"];
                var client = message["client"];

                if (system != null) {
                    await lobby.CurrentGame.SystemMessage(system, this);
                }

                if (admin != null && IsAdmin) {
                    await lobby.CurrentGame.AdminMessage(admin, this);
                }

                if (client != null) {
                    await lobby.CurrentGame.ClientMessage(client, this);
                }
            }
        }
    }
}
