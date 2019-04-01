using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;
using DigitalIcebreakers.Controllers;
using DigitalIcebreakers.Games;
using Microsoft.AspNetCore.Http.Connections;
using Microsoft.AspNetCore.Http.Connections.Features;
using Microsoft.AspNetCore.Http.Connections.Internal;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace DigitalIcebreakers.Hubs
{
    public class GameHub : Hub
    {
        static int lobbyNumber = 0;
        private ILogger<GameHub> _logger;
        private List<Lobby> _lobbys;

        public GameHub(ILogger<GameHub> logger, List<Lobby> lobbys)
        {
            _lobbys = lobbys;
            _logger = logger;
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

        public async Task<Player> TryRejoin(Guid id)
        {
            var game = _lobbys.SingleOrDefault(g => g.Id == id);
            if (game != null)
                return game.Players.SingleOrDefault(p => p.ConnectionId == Context.ConnectionId);
            await Clients.Caller.SendAsync("Stop");
            return null;
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

            _logger.LogInformation($"Created lobby {lobby} for {id}");

            await Connect(user);
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
                _logger.LogInformation($"Lobby {lobby.Label} has been closed");
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

        public async Task Connect(User user)
        {
            Player player = GetPlayer(user);
            var lobby = _lobbys.SingleOrDefault(p => p.Players.Contains(player));
            await Connect(player, lobby);
        }

        private async Task Connect(Player player, Lobby lobby)
        {
            player.IsConnected = true;
            if (lobby != null)
            {
                _logger.LogInformation($"{player.Name} re-connected to lobby {lobby.Label}");
                var players = lobby.Players.Where(p => !p.IsAdmin).Select(p => new User { Id = p.ExternalId, Name = p.Name }).ToList();
                await Clients.Caller.SendAsync("Reconnect", new Reconnect { PlayerId = player.Id, PlayerName = player.Name, LobbyName = lobby.Name, LobbyId = lobby.Id, IsAdmin = player.IsAdmin, Players = players, CurrentGame = lobby.CurrentGame?.Name });
                if (!player.IsAdmin)
                {
                    await Clients.Client(lobby.Admin.ConnectionId).SendAsync("joined", new User { Id = player.ExternalId, Name = player.Name });
                    await GameMessage("join");
                }
            }
            else {
                _logger.LogInformation($"{player.Name} connected ({this.GetTransportType()})");
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
                _logger.LogInformation($"Lobby {lobby.Label} is now playing {name}");
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

        public Player GetPlayerByConnectionId()
        {
            return _lobbys.SelectMany(p => p.Players).SingleOrDefault(p => p.ConnectionId == Context.ConnectionId);
        }

        public async Task ConnectToLobby(User user, Guid lobbyId)
        {
            var player = GetPlayer(user);
            var existingLobby = GetLobby();
            if (existingLobby != null)
            {
                _logger.LogInformation($"{player.Name} has left lobby {existingLobby.Label}");
                await Clients.Client(existingLobby.Admin.ConnectionId).SendAsync("left", new User { Id = player.ExternalId, Name = player.Name });
                existingLobby.Players.Remove(player);
            }

            var lobby = _lobbys.SingleOrDefault(p => p.Id == lobbyId);
            if (lobby == null)
            {
                await Clients.Caller.SendAsync("closelobby");
            }
            else
            {
                _logger.LogInformation($"{player.Name} has joined lobby {lobby.Label}");
                lobby.Players.Add(player);
                await Connect(player, lobby);
            }
        }

        public async override Task OnDisconnectedAsync(Exception exception)
        {
            await GameMessage("leave");
            var player = GetPlayerByConnectionId();
            if (player != null)
            {          
                _logger.LogInformation($"{player.Name} disconnected");
                player.IsConnected = false;
                var admin = GetAdmin();
                if (admin != null)
                {
                    await Clients.Client(admin.ConnectionId).SendAsync("left", new User { Id = player.ExternalId, Name = player.Name });
                }
            }

            await base.OnDisconnectedAsync(exception);
        }

        public async Task GameMessage(string payload)
        {
            var lobby = GetLobby();
            if (lobby != null && lobby.CurrentGame != null)
                await lobby.CurrentGame.Message(payload, this);
        }
    }
}
