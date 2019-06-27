using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DigitalIcebreakers.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace DigitalIcebreakers.Games
{
    public class DoggosVsKittehs : IGame
    {
        public string Name => "doggos-vs-kittehs";

        Dictionary<Guid, int> _results = new Dictionary<Guid, int>();

        public async Task JsonMessage(string jsonPayload, GameHub gameHub) {}

        public async Task Message(string payload, GameHub hub)
        {
            // 1 = kittehs
            // 0 = doggos

            if (!string.IsNullOrWhiteSpace(payload))
            {
                int value;
                if (int.TryParse(payload, out value))
                    _results[hub.GetPlayerByConnectionId().Id] = value;
            }
            
            var totalPlayers = hub.GetLobby().Players.Count(p => !p.IsAdmin && p.IsConnected);
            var result = new Result { Doggos = _results.Where(p => p.Value == 0).Count(), Kittehs = _results.Where(p => p.Value == 1).Count() };
            result.Undecided = totalPlayers - result.Kittehs - result.Doggos;
            await hub.Clients.Client(hub.GetAdmin().ConnectionId).SendAsync("gameUpdate", result);
        }

        public Task Start(GameHub hub)
        {
            return Task.CompletedTask;
        }

        public class Result
        {
            public int Doggos { get; set; }

            public int Kittehs { get; set; }

            public int Undecided { get; set; }
        }
    }
}
