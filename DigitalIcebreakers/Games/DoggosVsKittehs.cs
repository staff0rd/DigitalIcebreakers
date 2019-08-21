using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DigitalIcebreakers.Hubs;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json.Linq;

namespace DigitalIcebreakers.Games
{
    public class DoggosVsKittehs : Game, IGame
    {
        public string Name => "doggos-vs-kittehs";

        Dictionary<Guid, int> _results = new Dictionary<Guid, int>();

        public async override Task ClientMessage(JToken payload, IGameHub hub)
        {
            // 1 = kittehs
            // 0 = doggos

            string client = payload.ToObject<string>();

            if (!string.IsNullOrWhiteSpace(client))
            {
                int value;
                if (int.TryParse(client, out value))
                    _results[hub.GetPlayerByConnectionId().Id] = value;
            }
            
            var result = new Result { Doggos = _results.Where(p => p.Value == 0).Count(), Kittehs = _results.Where(p => p.Value == 1).Count() };
            result.Undecided = hub.GetPlayers().Count() - result.Kittehs - result.Doggos;
            await hub.SendGameUpdateToPresenter(result);
        }

        public class Result
        {
            public int Doggos { get; set; }

            public int Kittehs { get; set; }

            public int Undecided { get; set; }
        }
    }
}
