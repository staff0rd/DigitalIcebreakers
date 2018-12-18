using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DigitalIcebreakers.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace DigitalIcebreakers.Games
{
    public class YesNoMaybe : IGame
    {
        public string Name => "yes-no-maybe";

        Dictionary<Guid, int> _results = new Dictionary<Guid, int>();

        public async Task Message(string payload, GameHub hub)
        {
            // 1 = no
            // 0 = yes

            if (!string.IsNullOrWhiteSpace(payload))
            {
                if (payload == "reset" && hub.GetAdmin().ConnectionId == hub.Context.ConnectionId)
                {
                    _results.Clear();
                }
                else
                {
                    int value;
                    if (int.TryParse(payload, out value))
                        _results[hub.GetPlayerByConnectionId().Id] = value;
                }
            }
            
            var totalPlayers = hub.GetLobby().Players.Count(p => !p.IsAdmin);
            var result = new Result { Yes = _results.Where(p => p.Value == 0).Count(), No = _results.Where(p => p.Value == 1).Count() };
            result.Maybe = totalPlayers - result.No - result.Yes;
            await hub.Clients.Client(hub.GetAdmin().ConnectionId).SendAsync("gameUpdate", result);
        }

        public class Result
        {
            public int Yes { get; set; }

            public int No { get; set; }

            public int Maybe { get; set; }
        }
    }
}
