using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DigitalIcebreakers.Hubs;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json.Linq;

namespace DigitalIcebreakers.Games
{
    public class Buzzer : Game, IGame
    {
        public string Name => "buzzer";

        public override async Task ClientMessage(JToken payload, IGameHub hub) 
        {
            string client = payload.ToObject<string>();
            var player = hub.GetPlayerByConnectionId();
            switch(client)
            {
                case "up": await hub.SendGameUpdateToPresenter("up", player); break;
                case "down": await hub.SendGameUpdateToPresenter("down", player); break;
                default: break;
            }
        }
    }
}
