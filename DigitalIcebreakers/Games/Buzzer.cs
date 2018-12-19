using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DigitalIcebreakers.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace DigitalIcebreakers.Games
{
    public class Buzzer : Game, IGame
    {
        public Buzzer(GameHub hub) : base(hub) {}

        public string Name => "buzzer";

        public async Task Message(string payload)
        {
            var player = _hub.GetPlayerByConnectionId();
            switch(payload)
            {
                case "up": await _hub.Clients.Client(_hub.GetAdmin().ConnectionId).SendAsync("gameUpdate", player.ExternalId, player.Name, "up"); break;
                case "down": await _hub.Clients.Client(_hub.GetAdmin().ConnectionId).SendAsync("gameUpdate", player.ExternalId, player.Name, "down"); break;
                default: break;
            }
        }
    }
}
