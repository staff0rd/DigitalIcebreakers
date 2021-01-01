using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
            }
            await UpdatePresenterSpeed(connectionId);
        }

        public async override Task OnReceiveSystemMessage(JToken payload, string connectionId)
        {
            var player = GetPlayerByConnectionId(connectionId);
            if (player == null)
                return;
            var externalId = player.ExternalId;
            string system = payload.ToString();
            switch (system)
            {
                case "leave": await Leave(externalId); break;
                case "join": await Join(player); break;
            }
            await UpdatePresenterSpeed(connectionId);
            await UpdatePresenterTeamCount(connectionId);
        }

        private async Task UpdatePresenterTeamCount(string connectionId)
        {
            await SendToPresenter(connectionId, new Result("teams", _leftTeam.Count, _rightTeam.Count));
        }

        private async Task UpdatePresenterSpeed(string connectionId)
        {
            await SendToPresenter(connectionId, new Result("paddleDy", Speed(_leftTeam), Speed(_rightTeam)));
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

        private async Task Leave(Guid id)
        {
            PerformOnDictionary(id, (d) => d.Remove(id));
            if (_leftTeam.Count == 0 && _rightTeam.Count > 1) {
                var player = GetPlayerByExternalId(_rightTeam.First().Key);
                await Join(player);
            }
            else if (_rightTeam.Count == 0 && _leftTeam.Count > 1) {
                var player = GetPlayerByExternalId(_leftTeam.First().Key);
                await Join(player);
            }
        }

        private async Task Join(Player player)
        {
            if (!player.IsAdmin)
            {
                var id = player.ExternalId;

                await Leave(id);

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
            public Result(string command, decimal left, decimal right)
            {
                Left = left;
                Right = right;
                Command = command;
            }

            public string Command { get; set; }

            public decimal Left { get; set; }

            public decimal Right { get; set; }
        }
    }
}
