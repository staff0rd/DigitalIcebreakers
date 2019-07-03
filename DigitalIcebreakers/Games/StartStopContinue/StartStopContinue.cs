using System.Threading.Tasks;
using DigitalIcebreakers.Games;
using DigitalIcebreakers.Hubs;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace DigitalIcebreakers.Games
{
    public class StartStopContinue : Game, IGame 
    {
        public string Name => "startstopcontinue";
        
        public async override Task ClientMessage(JToken client, GameHub hub)
        {
            var idea = client.ToObject<Idea>();
            var player = hub.GetPlayerByConnectionId();

            if (idea != null)
                await hub.SendGameUpdateToAdmin(player.Name,  idea);
        }
    }
}