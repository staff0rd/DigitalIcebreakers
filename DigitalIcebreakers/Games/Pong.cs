using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DigitalIcebreakers.Hubs;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json.Linq;

namespace DigitalIcebreakers.Games
{
    public class Pong : Game, IGame
    {
        public override string Name => "pong";

        public Pong(Sender sender, LobbyManager lobbyManager) : base(sender, lobbyManager) {}

        public Pong (Sender sender, LobbyManager lobbyManager, Dictionary<Guid, int> leftTeam, Dictionary<Guid, int> rightTeam) : this(sender, lobbyManager)
        {
            _leftTeam = leftTeam;
            _rightTeam = rightTeam;
        }

        Dictionary<Guid, int> _leftTeam = new Dictionary<Guid, int>();
        Dictionary<Guid, int> _rightTeam = new Dictionary<Guid, int>();

        public async override Task OnReceivePlayerMessage(JToken payload, string connectionId)
        {
            var player = GetPlayerByConnectionId(connectionId);
            var externalId = player.ExternalId;
            string client = payload.ToString();
            switch (client)
            {
                case "release": Move(0, externalId); break;
                case "up": Move(1, externalId); break;
                case "down": Move(-1, externalId); break;
                case "join": await Join(player); break;
            }
            await UpdatePresenter(connectionId);
        }

        public async override Task OnReceiveSystemMessage(JToken payload, string connectionId)
        {
            var player = GetPlayerByConnectionId(connectionId);
            var externalId = player.ExternalId;
            string system = payload.ToString();
            switch (system)
            {
                case "leave": Leave(externalId); Move(0, externalId); break;
                case "join": await Join(player); break;
            }
            await UpdatePresenter(connectionId);
        }

        private async Task UpdatePresenter(string connectionId)
        {
            await SendToPresenter(connectionId, new Result(Speed(_leftTeam), Speed(_rightTeam)));
        }

        private decimal Speed(Dictionary<Guid, int> team)
        {
            if (team.Count() == 0)
                return 0;
            return ((decimal)team.Sum(p => p.Value)) / team.Count();
        }

        private void PerformOnDictionary(Guid id, Action<Dictionary<Guid, int>> action)
        {
            if (_leftTeam.ContainsKey(id))
            {
                action(_leftTeam);
            }

            else if (_rightTeam.ContainsKey(id))
            {
                action(_rightTeam);
            }
        }

        private void Move(int direction, Guid id)
        {
            PerformOnDictionary(id, (d) => d[id] = direction);
        }

        internal void Leave(Guid id)
        {
            PerformOnDictionary(id, (d) => d.Remove(id));
        }

        internal async Task Join(Player player)
        {
            if (!player.IsAdmin)
            {
                var id = player.ExternalId;

                Leave(id);

                if (_leftTeam.Count <= _rightTeam.Count)
                    _leftTeam[id] = 0;
                else
                    _rightTeam[id] = 0;
                PerformOnDictionary(id, (d) => d[id] = 0);

                await SendToPlayer(player, GetGameData(player));
            }
        }

        public override async Task Start(string connectionId)
        {
            var players = GetPlayers(connectionId);

            foreach (var player in players)
            {
                await Join(player);
            }
        }

        private string GetGameData(Player player)
        {
            if (_leftTeam.ContainsKey(player.ExternalId))
                return "team:0";
            else if (_rightTeam.ContainsKey(player.ExternalId))
                return "team:1";

            return null;
        }

        public class Result
        {
            public Result(decimal left, decimal right)
            {
                Left = left;
                Right = right;
            }

            public decimal Left { get; set; }

            public decimal Right { get; set; }
        }
    }
}
