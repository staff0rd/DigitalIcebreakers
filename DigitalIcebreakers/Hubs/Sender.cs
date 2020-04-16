using System;
using System.Linq;
using System.Threading.Tasks;
using DigitalIcebreakers.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace DigitalIcebreakers
{
    public class Sender
    {
        private readonly ClientHelper _clients;
        
        public Sender(ClientHelper clients)
        {
            _clients = clients;
        }

        public async Task SendGameUpdateToPlayers(Lobby lobby, object payload)
        {
            var clients = _clients.Players(lobby);
            await SendGameUpdate(clients, payload);
        }

        public async Task SendGameUpdateToPlayer(Player player, object payload)
        {
            var clients = _clients.Player(player);
            await SendGameUpdate(clients, payload);
        }

        private async Task SendGameUpdate(IClientProxy clients, object payload)
        {
            var method = "gameUpdate";
            await clients.SendAsync(method, payload);
        }

        public async virtual Task SendGameUpdateToPresenter<T>(Lobby lobby, T payload, Player player = null)
        {
            var client = _clients.Admin(lobby);
            await SendGameUpdate(client, new GameUpdate<T>(payload, player));
        }

        public async Task Reconnect(Lobby lobby, Player player)
        {
            var players = lobby.Players.Where(p => !p.IsAdmin).Select(p => new User { Id = p.ExternalId, Name = p.Name }).ToList();
            await _clients.Self().SendAsync("Reconnect", new Reconnect { PlayerId = player.Id, PlayerName = player.Name, LobbyName = lobby.Name, LobbyId = lobby.Id, IsAdmin = player.IsAdmin, Players = players, CurrentGame = lobby.CurrentGame?.Name });
        }

        public async Task PlayerLeft(Lobby lobby, Player player)
        {
            await _clients.Admin(lobby).SendAsync("left", new User { Id = player.ExternalId, Name = player.Name });
        }

        internal async Task CloseLobby(Lobby lobby = null)
        {
            await (lobby != null ? _clients.EveryoneInLobby(lobby) : _clients.Self())
                .SendAsync("closelobby");
        }

        internal async Task EndGame(Lobby lobby)
        {
            await _clients.EveryoneInLobby(lobby).SendAsync("endgame");
        }

        internal async Task NewGame(Lobby lobby, string gameName)
        {
            await _clients.EveryoneInLobby(lobby).SendAsync("newgame", gameName);
        }

        internal async Task Joined(Lobby lobby, Player player)
        {
            await _clients.Admin(lobby).SendAsync("joined", new User { Id = player.ExternalId, Name = player.Name });
        }

        internal async Task Connected()
        {
            await _clients.Self().SendAsync("Connected");
        }
    }
}