using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;
using DigitalIcebreakers.Controllers;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace DigitalIcebreakers.Hubs
{
    public class GameHub : Hub
    {
        private ILogger<GameHub> _logger;
        private List<Lobby> _lobbys;

        public GameHub(ILogger<GameHub> logger, List<Lobby> lobbys)
        {
            _lobbys = lobbys;
            _logger = logger;
        }

        public void StartGame(Guid id)
        {
            var player = new Player { Name = "Admin", IsAdmin = true, ConnectionId = Context.ConnectionId, Id = Guid.NewGuid() };
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
            _lobbys.Add(new Lobby
            {
                Id = id,
                Players = new List<Player>
                {
                    new Player { ConnectionId = Context.ConnectionId, Id = user.Id, IsAdmin = true, IsConnected = true, Name = user.Name }
                },
                Name = name
            });
            await Connect(user);
        }

        public async Task CloseLobby()
        {
            var lobby = _lobbys.SingleOrDefault(l => l.Players.Any(p => p.IsAdmin && p.ConnectionId == Context.ConnectionId));
            if (lobby != null)
            {
                _lobbys.Remove(lobby);
                foreach (var player in lobby.Players)
                {
                    await Clients.Client(player.ConnectionId).SendAsync("closelobby");
                }
            }
        }

        public async Task Connect(User user)
        {
            Player player = GetPlayer(user);

            var lobby = _lobbys.SingleOrDefault(p => p.Players.Contains(player));
            await Connect(player, lobby);
        }

        private async Task Connect(Player player, Lobby lobby)
        {
            if (lobby != null)
            {
                var players = lobby.Players.Where(p => !p.IsAdmin).Select(p => new User { Id = p.ExternalId, Name = p.Name }).ToList();
                await Clients.Caller.SendAsync("Reconnect", new Reconnect { PlayerId = player.Id, PlayerName = player.Name, LobbyName = lobby.Name, LobbyId = lobby.Id, IsAdmin = player.IsAdmin, Players = players, CurrentGame = lobby.CurrentGame });
                if (!player.IsAdmin)
                {
                    await Clients.Client(lobby.Admin.ConnectionId).SendAsync("joined", new User { Id = player.ExternalId, Name = player.Name });
                }
            }
            else
                await Clients.Caller.SendAsync("Connected");
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
                lobby.CurrentGame = name;
                Clients.Clients(lobby.Players.Select(p => p.ConnectionId).ToList()).SendAsync("newgame", name);
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

        private Lobby GetLobby()
        {
            var player = GetPlayerByConnectionId();
            return _lobbys.SingleOrDefault(p => p.Players.Contains(player));
        }

        private Player GetPlayerByConnectionId()
        {
            return _lobbys.SelectMany(p => p.Players).SingleOrDefault(p => p.ConnectionId == Context.ConnectionId);
        }

        public async Task ConnectToLobby(User user, Guid lobbyId)
        {
            var player = GetPlayer(user);
            var lobby = _lobbys.SingleOrDefault(p => p.Id == lobbyId);
            lobby.Players.Add(player);
            await Connect(player, lobby);
        }

        public async override Task OnDisconnectedAsync(Exception exception)
        {
            var player = GetPlayerByConnectionId();
            if (player != null)
            {
                var admin = _lobbys.Where(p => p.Players.Contains(player)).SelectMany(p => p.Players).SingleOrDefault(p => p.IsAdmin);
                if (admin != null)
                {
                    await Clients.Client(admin.ConnectionId).SendAsync("left", new User { Id = player.ExternalId, Name = player.Name });
                }
            }

            await base.OnDisconnectedAsync(exception);
        }
    }
}
