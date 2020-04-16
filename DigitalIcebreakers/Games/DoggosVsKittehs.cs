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
        public override string Name => "doggos-vs-kittehs";

        Dictionary<Guid, int> _results = new Dictionary<Guid, int>();

        public DoggosVsKittehs(Sender sender, LobbyManager lobbyManager) : base(sender, lobbyManager) {}

        public async override Task OnReceivePlayerMessage(JToken payload, string connectionId)
        {
            // 1 = kittehs
            // 0 = doggos

            string client = payload.ToObject<string>();

            if (!string.IsNullOrWhiteSpace(client))
            {
                int value;
                if (int.TryParse(client, out value))
                    _results[GetPlayerByConnectionId(connectionId).Id] = value;
            }
            
            var result = new Result { Doggos = _results.Where(p => p.Value == 0).Count(), Kittehs = _results.Where(p => p.Value == 1).Count() };
            result.Undecided = GetPlayerCount(connectionId) - result.Kittehs - result.Doggos;
            await SendToPresenter(connectionId, result);
        }

        public class Result
        {
            public int Doggos { get; set; }

            public int Kittehs { get; set; }

            public int Undecided { get; set; }
        }
    }
}
