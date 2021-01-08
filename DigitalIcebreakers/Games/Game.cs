using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace DigitalIcebreakers.Games
{
    public abstract class Game : IGame
    {

        private readonly Sender _sender;
        private readonly LobbyManager _lobbys;

        public string Name => GetType().Name.PascalToKebabCase();

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
            if (player != null && !player.IsPresenter)
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

        public async Task SendToEachPlayer(string connectionId, Func<Player, object> payloadFunction)
        {
            var lobby = _lobbys.GetLobbyByConnectionId(connectionId);

            await Task.WhenAll(
                lobby.GetConnectedPlayers()
                .Select(player => _sender.SendGameMessageToPlayer(player, payloadFunction(player))));
        }

        public Player GetPlayerByConnectionId(string connectionId)
        {
            return _lobbys.GetPlayerByConnectionId(connectionId);
        }

        public Player GetAdminByConnectionId(string connectionId)
        {
            var admin = _lobbys.GetLobbyAdmin(connectionId);
            if (admin.ConnectionId == connectionId)
            {
                return admin;
            }
            return null;
        }

        public Player GetPlayerByExternalId(Guid externalId)
        {
            return _lobbys.GetPlayerByExternalId(externalId);
        }

        public int GetPlayerCount(string connectionId)
        {
            return _lobbys.GetLobbyByConnectionId(connectionId).PlayerCount;
        }

        public Player[] GetPlayers(string connectionId)
        {
            return _lobbys.GetLobbyByConnectionId(connectionId).GetConnectedPlayers();
        }

        static List<Type> GetAllGames()
        {
            return AppDomain.CurrentDomain.GetAssemblies().SelectMany(x => x.GetTypes())
                 .Where(x => typeof(IGame).IsAssignableFrom(x) && !x.IsInterface && !x.IsAbstract)
                 .ToList();
        }

        public static IGame GetGame(string name, Sender sender, LobbyManager lobbys)
        {
            var game = GetAllGames().FirstOrDefault(p => p.Name == name.KebabCaseToPascalCase());
            if (game == null)
                return null;
            ConstructorInfo ctor = game.GetConstructor(new[] { typeof(Sender), typeof(LobbyManager) });
            object instance = ctor.Invoke(new object[] { sender, lobbys });
            return (IGame)instance;
        }
    }
}