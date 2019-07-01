using System.Threading.Tasks;
using DigitalIcebreakers.Games;
using DigitalIcebreakers.Hubs;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;

namespace DigitalIcebreakers.Games
{
    public class StartStopContinue : IGame 
    {
        public string Name => "startstopcontinue";
        
        public async Task Message(dynamic payload, GameHub hub)
        {
            var player = hub.GetPlayerByConnectionId();

            string client = payload.client;
            Idea idea = JsonConvert.DeserializeObject<Idea>(client);

            if (idea != null)
                await hub.SendGameUpdateToAdmin(player.Name,  idea);
        }

        public Task Start(GameHub hub)
        {
            return Task.CompletedTask;
        }
    }
}