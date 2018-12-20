using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DigitalIcebreakers.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace DigitalIcebreakers.Games
{
    public class Buzzer : IGame
    {
        public string Name => "buzzer";

        public async Task Message(string payload, GameHub hub)
        {
            var player = hub.GetPlayerByConnectionId();
            switch(payload)
            {
                case "up": await hub.Clients.Client(hub.GetAdmin().ConnectionId).SendAsync("gameUpdate", player.ExternalId, player.Name, "up"); break;
                case "down": await hub.Clients.Client(hub.GetAdmin().ConnectionId).SendAsync("gameUpdate", player.ExternalId, player.Name, "down"); break;
                default: break;
            }
        }

        public Task Start(GameHub hub)
        {
            return Task.CompletedTask;
        }
    }
}
