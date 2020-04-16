using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace DigitalIcebreakers.Games
{
    public abstract class Game : IGame
    {

        private readonly Sender _sender;
        private readonly LobbyManager _lobbys;

        public abstract string Name { get; }

        public Game(Sender sender, LobbyManager lobbyManager)
        {
            _sender = sender;    
            _lobbys = lobbyManager;
        }

        public virtual Task Start(string connectionId)
        {
            return Task.CompletedTask;
        }

        public virtual Task OnReceivePresenterMessage(JToken admin, string connectionId)
        {
            return Task.CompletedTask;
        }

        public virtual Task OnReceivePlayerMessage(JToken client, string connectionId)
        {
            return Task.CompletedTask;
        }

        public virtual Task OnReceiveSystemMessage(JToken system, string connectionId)
        {
            return Task.CompletedTask;
        }

        public async Task SendToPlayer(string connectionId, object payload)
        {
            var player = _lobbys.GetPlayerByConnectionId(connectionId);
            await SendToPlayer(player, payload);
        }

        public async Task SendToPlayer(Player player, object payload)
        {
            await _sender.SendGameMessageToPlayer(player, payload);
        }
        public async Task SendToPresenter(string connectionId, object payload, Player player = null)
        {
            var lobby = _lobbys.GetLobbyByConnectionId(connectionId);
            await _sender.SendGameMessageToPresenter(lobby, payload, player);
        }

        public async Task SendToPlayers(string connectionId, object payload)
        {
            var lobby = _lobbys.GetLobbyByConnectionId(connectionId);
            await _sender.SendGameMessageToPlayers(lobby, payload);
        }

        public Player GetPlayerByConnectionId(string connectionId)
        {
            return _lobbys.GetPlayerByConnectionId(connectionId);
        }

        public int GetPlayerCount(string connectionId)
        {
            return _lobbys.GetLobbyByConnectionId(connectionId).PlayerCount;
        } 

        public Player[] GetPlayers(string connectionId)
        {
            return _lobbys.GetLobbyByConnectionId(connectionId).GetPlayers();
        }
    }
}