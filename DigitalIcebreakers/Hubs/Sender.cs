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

        public async Task SendGameMessageToPlayers(Lobby lobby, object payload)
        {
            var clients = _clients.Players(lobby);
            await SendGameMessage(clients, payload);
        }

        public async Task SendGameMessageToPlayer(Player player, object payload)
        {
            var clients = _clients.Player(player);
            await SendGameMessage(clients, payload);
        }

        private async Task SendGameMessage(IClientProxy clients, object payload)
        {
            await clients.SendAsync("gameMessage", payload);
        }

        public async virtual Task SendGameMessageToPresenter<T>(Lobby lobby, T payload, Player player = null)
        {
            var client = _clients.Admin(lobby);
            await SendGameMessage(client, new GameMessage<T>(payload, player));
        }

        public async Task Reconnect(Lobby lobby, Player player)
        {
            var players = lobby.Players.Where(p => !p.IsAdmin).Select(p => new User { Id = p.ExternalId, Name = p.Name }).ToList();
            await _clients.Self(player.ConnectionId).SendAsync("Reconnect", new Reconnect { PlayerId = player.Id, PlayerName = player.Name, LobbyName = lobby.Name, LobbyId = lobby.Id, IsAdmin = player.IsAdmin, Players = players, CurrentGame = lobby.CurrentGame?.Name });
        }

        public async Task PlayerLeft(Lobby lobby, Player player)
        {
            await _clients.Admin(lobby).SendAsync("left", new User { Id = player.ExternalId, Name = player.Name });
        }

        internal async Task CloseLobby(string connectionId, Lobby lobby = null)
        {
            await (lobby != null ? _clients.EveryoneInLobby(lobby) : _clients.Self(connectionId))
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

        internal async Task Connected(string connectionId)
        {
            await _clients.Self(connectionId).SendAsync("Connected");
        }
    }
}