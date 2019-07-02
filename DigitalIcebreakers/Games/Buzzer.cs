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

        public async Task Message(dynamic payload, GameHub hub) 
        {
            string client = payload.client;
            var player = hub.GetPlayerByConnectionId();
            switch(client)
            {
                case "up": await hub.SendGameUpdateToAdmin(player.ExternalId, player.Name, "up"); break;
                case "down": await hub.SendGameUpdateToAdmin(player.ExternalId, player.Name, "down"); break;
                default: break;
            }
        }

        public Task Start(GameHub hub)
        {
            return Task.CompletedTask;
        }
    }
}
