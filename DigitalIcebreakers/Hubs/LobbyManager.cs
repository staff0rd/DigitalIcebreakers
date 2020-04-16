using System;
using System.Collections.Generic;
using System.Linq;

namespace DigitalIcebreakers
{
    public class LobbyManager
    {
        private List<Lobby> _lobbys;
        static int lobbyNumber = 0;
        
        public LobbyManager(List<Lobby> lobbys)
        {
            _lobbys = lobbys;
        }

        public Lobby CreateLobby(Guid lobbyId, string lobbyName, Player player)
        {
            var lobby = new Lobby
            {
                Id = lobbyId,
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

        public Lobby GetLobbyById(Guid lobbyId)
        {
            return _lobbys.SingleOrDefault(p => p.Id == lobbyId);
        }

        public Lobby GetLobbyByConnectionId(string connectionId)
        {
            var player = GetPlayerByConnectionId(connectionId);
            return _lobbys.SingleOrDefault(p => p.Players.Contains(player));
        }

        public bool PlayerIsAdmin(string connectionId)
        {
            return GetLobbyAdmin(connectionId).ConnectionId == connectionId;
        }

        public Player GetPlayerByConnectionId(string connectionId)
        {
            var player = _lobbys.SelectMany(p => p.Players).SingleOrDefault(p => p.ConnectionId == connectionId);
            return player;
        }

        public void GetPlayerAndLobby(string connectionId, out Player player, out Lobby lobby)
        {
            player = GetPlayerByConnectionId(connectionId);
            lobby = GetLobbyByConnectionId(connectionId);
        }
    }
}