using System.Linq;
using Microsoft.AspNetCore.SignalR;

namespace DigitalIcebreakers.Hubs
{
    public class ClientHelper 
    {
        IHubClients _clients;

        public ClientHelper(IHubContext<GameHub> context)
        {
            _clients = context.Clients;
        }

        public IClientProxy Players(Lobby lobby) {
            return _clients.Clients(lobby.Players.Where(p => !p.IsAdmin).Select(p => p.ConnectionId).ToList());
        }

        public IClientProxy EveryoneInLobby(Lobby lobby)
        {
            return _clients.Clients(lobby.Players.Select(p => p.ConnectionId).ToList());
        }

        public IClientProxy Admin(Lobby lobby)
        {
            return _clients.Client(lobby.Admin.ConnectionId);
        }

        public IClientProxy Self(string connectionId)
        {
            return _clients.Client(connectionId);
        }

        internal IClientProxy Player(Player player)
        {
            return _clients.Client(player.ConnectionId);
        }
    }
}
