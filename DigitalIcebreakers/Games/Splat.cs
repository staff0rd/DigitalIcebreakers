using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace DigitalIcebreakers.Games
{
    public class Splat : Game, IGame
    {
        public string Name => "splat";

        public override async Task ClientMessage(JToken payload, IGameHub hub) 
        {
            string client = payload.ToObject<string>();
            var player = hub.GetPlayerByConnectionId();
            switch(client)
            {
                case "up": await hub.SendGameUpdateToPresenter(player.ExternalId, player.Name, "up"); break;
                case "down": await hub.SendGameUpdateToPresenter(player.ExternalId, player.Name, "down"); break;
                default: break;
            }
        }
    }
}
