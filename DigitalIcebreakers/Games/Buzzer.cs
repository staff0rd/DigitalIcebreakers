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
        public override string Name => "buzzer";

        public Buzzer(Sender sender, LobbyManager lobbyManager) : base(sender, lobbyManager) {}
        public override async Task OnReceivePlayerMessage(JToken payload, string connectionId) 
        {
            string client = payload.ToObject<string>();
            var player = GetPlayerByConnectionId(connectionId);
            switch(client)
            {
                case "up": await SendToPresenter(connectionId, "up", player); break;
                case "down": await SendToPresenter(connectionId, "down", player); break;
                default: break;
            }
        }
    }
}
