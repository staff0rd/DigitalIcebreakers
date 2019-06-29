using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DigitalIcebreakers.Hubs;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;

namespace DigitalIcebreakers.Games
{
    public class YesNoMaybe : IGame
    {
        public string Name => "yes-no-maybe";
        Dictionary<Guid, int> _results = new Dictionary<Guid, int>();
        public async Task JsonMessage(dynamic payload, GameHub hub)
        {
            string admin = payload.admin;
            string client = payload.client;

            if (!string.IsNullOrEmpty(admin) && hub.IsAdmin) {
                if (admin == "reset")
                    _results.Clear();
            }

            if (!string.IsNullOrEmpty(client))
            {
                // 1 = no
                // 0 = yes
                int value;
                if (int.TryParse(client, out value))
                    _results[hub.GetPlayerByConnectionId().Id] = value;
            }
            
            var totalPlayers = hub.GetLobby().Players.Count(p => !p.IsAdmin && p.IsConnected);
            var result = new Result { Yes = _results.Where(p => p.Value == 0).Count(), No = _results.Where(p => p.Value == 1).Count() };
            result.Maybe = totalPlayers - result.No - result.Yes;
            await hub.Clients.Client(hub.GetAdmin().ConnectionId).SendAsync("gameUpdate", result);

        }

        public Task Start(GameHub hub)
        {
            return Task.CompletedTask;
        }

        public class Result
        {
            public int Yes { get; set; }

            public int No { get; set; }

            public int Maybe { get; set; }
        }
    }
}
