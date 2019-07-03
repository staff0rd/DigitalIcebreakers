using System.Threading.Tasks;
using DigitalIcebreakers.Games;
using DigitalIcebreakers.Hubs;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;

namespace DigitalIcebreakers.Games
{
    public class StartStopContinue : Game, IGame 
    {
        public string Name => "startstopcontinue";
        
        public async override Task ClientMessage(dynamic client, GameHub hub)
        {
            var idea = client.ToObject<Idea>();
            var player = hub.GetPlayerByConnectionId();

            if (idea != null)
                await hub.SendGameUpdateToAdmin(player.Name,  idea);
        }
    }
}