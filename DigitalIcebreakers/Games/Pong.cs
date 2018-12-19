using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DigitalIcebreakers.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace DigitalIcebreakers.Games
{
    public class Pong : IGame
    {
        public string Name => "pong";

        public Pong() { }

        public Pong (Dictionary<Guid, int> leftTeam, Dictionary<Guid, int> rightTeam)
        {
            _leftTeam = leftTeam;
            _rightTeam = rightTeam;
        }

        Dictionary<Guid, int> _leftTeam = new Dictionary<Guid, int>();
        Dictionary<Guid, int> _rightTeam = new Dictionary<Guid, int>();

        public async Task Message(string payload, GameHub hub)
        {
            var player = hub.GetPlayerByConnectionId();
            switch (payload)
            {
                case "up": Move(1, hub.GetPlayerByConnectionId().ExternalId); break;
                case "down": Move(-1, hub.GetPlayerByConnectionId().ExternalId); break;
                case "release": Move(0, hub.GetPlayerByConnectionId().ExternalId); break;
                case "leave": Leave(hub.GetPlayerByConnectionId().ExternalId); break;
                case "join": Join(hub.GetPlayerByConnectionId().ExternalId); break;
                default: return;
            }
            await hub.Clients.Client(hub.GetAdmin().ConnectionId).SendAsync("gameUpdate", new Result(Speed(), _rightTeam.Sum(p => p.Value)));
        }

        private int Speed()
        {
            return _leftTeam.Sum(p => p.Value);
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

        internal void Join(Guid id)
        {
            if (_leftTeam.Count == _rightTeam.Count)
                _leftTeam[id] = 0;
            else
                _rightTeam[id] = 0;
            PerformOnDictionary(id, (d) => d[id] = 0);
        }

        public class Result
        {
            public Result(int left, int right)
            {
                Left = left;
                Right = right;
            }

            public decimal Left { get; set; }

            public decimal Right { get; set; }
        }
    }
}
