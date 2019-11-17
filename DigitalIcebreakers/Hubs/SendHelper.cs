using System.Linq;
using Microsoft.AspNetCore.SignalR;

namespace DigitalIcebreakers.Hubs
{
    public class SendHelper 
    {
        IHubCallerClients _clients;

        public SendHelper(IHubCallerClients clients)
        {
            _clients = clients;
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

        public IClientProxy Self()
        {
            return _clients.Caller;
        }

        internal IClientProxy Player(Player player)
        {
            return _clients.Client(player.ConnectionId);
        }
    }
}
