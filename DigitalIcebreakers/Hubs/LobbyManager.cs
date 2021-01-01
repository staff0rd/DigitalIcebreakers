using System;
using System.Collections.Generic;
using System.Linq;
using DigitalIcebreakers.Logging;

namespace DigitalIcebreakers
{
    public class LobbyManager
    {
        private readonly List<Lobby> _lobbys;
        private readonly LobbyIdService _lobbyIds;
        static int lobbyNumber = 0;

        private readonly LobbyLogger _logger;
        
        public LobbyManager(List<Lobby> lobbys, LobbyLogger logger, LobbyIdService lobbyIds)
        {
            _lobbys = lobbys;
            _logger = logger;
            _lobbyIds = lobbyIds;
        }

        public Lobby CreateLobby(string lobbyName, Player player)
        {
            var lobby = new Lobby
            {
                Id = _lobbyIds.GetCode(_lobbys),
                Number = ++lobbyNumber,
                Players = new List<Player>
                {
                    player
                },
                Name = lobbyName
            };

            _lobbys.Add(lobby);

            return lobby;
        }

        public void CloseInactive(int timeoutInSeconds = 3600)
        {
            var now = DateTime.Now;
            foreach (var lobby in _lobbys.ToArray())
            {
                var timeout = DateTime.Now.Subtract(lobby.LastModified).TotalSeconds;
                if (timeout >= timeoutInSeconds)
                {
                    _logger.Log(lobby, "{action} inactive lobby, last update {lastModified}", "Closing", lobby.LastModified);
                    _lobbys.Remove(_lobbys.SingleOrDefault(p => p.Id == lobby.Id));
                }
            }
        }

        internal IEnumerable<Lobby> GetByAdminId(Guid adminId)
        {
            return _lobbys.Where(p => p.Admin != null && p.Admin.Id == adminId);
        }

        internal Lobby GetByAdminConnectionId(string connectionId)
        {
            return _lobbys.SingleOrDefault(l => l.Players.Any(p => p.IsAdmin && p.ConnectionId == connectionId));
        }

        internal void Close(Lobby lobby)
        {
            _lobbys.Remove(lobby);
        }

        internal Player GetOrCreatePlayer(Guid userId, string userName)
        {
            var player = _lobbys.SelectMany(p => p.Players).SingleOrDefault(p => p.Id == userId);
            if (player == null)
                return new Player { Id = userId, Name = userName };
            return player;
        }

        public Player GetLobbyAdmin(string connectionId)
        {
            return GetLobbyByConnectionId(connectionId).Admin;
        }

        public Lobby GetLobbyById(string lobbyId)
        {
            return _lobbys.SingleOrDefault(p => p.Id.ToLower() == lobbyId.ToLower());
        }

        public Lobby GetLobbyByConnectionId(string connectionId)
        {
            var player = GetPlayerByConnectionId(connectionId, true);
            return _lobbys.SingleOrDefault(p => p.Players.Contains(player));
        }

        public bool PlayerIsAdmin(string connectionId)
        {
            return GetLobbyAdmin(connectionId).ConnectionId == connectionId;
        }

        public Player GetPlayerByExternalId(Guid externalId)
        {
            var player = _lobbys.SelectMany(p => p.Players).SingleOrDefault(p => p.ExternalId == externalId);
            return player;
        }

        public Player GetPlayerByConnectionId(string connectionId, bool includeAdmin = false)
        {
            var player = _lobbys.SelectMany(p => p.Players).SingleOrDefault(p => p.ConnectionId == connectionId && (includeAdmin || !p.IsAdmin));
            return player;
        }

        public void GetPlayerAndLobby(string connectionId, out Player player, out Lobby lobby)
        {
            player = GetPlayerByConnectionId(connectionId, true);
            lobby = GetLobbyByConnectionId(connectionId);
        }
    }
}