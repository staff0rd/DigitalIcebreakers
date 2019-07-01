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

        public async Task Message(dynamic payload, GameHub hub)
        {
            // 1 = kittehs
            // 0 = doggos

            string client = payload.client;

            if (!string.IsNullOrWhiteSpace(client))
            {
                int value;
                if (int.TryParse(client, out value))
                    _results[hub.GetPlayerByConnectionId().Id] = value;
            }
            
            var totalPlayers = hub.GetLobby().Players.Count(p => !p.IsAdmin && p.IsConnected);
            var result = new Result { Doggos = _results.Where(p => p.Value == 0).Count(), Kittehs = _results.Where(p => p.Value == 1).Count() };
            result.Undecided = totalPlayers - result.Kittehs - result.Doggos;
            await hub.SendGameUpdateToAdmin(result);
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
