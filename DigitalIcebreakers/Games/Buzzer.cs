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
        public string Name => "buzzer";

        public override async Task ClientMessage(dynamic payload, GameHub hub) 
        {
            string client = payload;
            var player = hub.GetPlayerByConnectionId();
            switch(client)
            {
                case "up": await hub.SendGameUpdateToAdmin(player.ExternalId, player.Name, "up"); break;
                case "down": await hub.SendGameUpdateToAdmin(player.ExternalId, player.Name, "down"); break;
                default: break;
            }
        }
    }
}
