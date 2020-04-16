using System.Threading.Tasks;
using DigitalIcebreakers.Games;
using DigitalIcebreakers.Hubs;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

public class IdeaWall : Game, IGame 
{
    public string Name => "ideawall";

    public override async Task ClientMessage(JToken payload, IGameHub hub)
    {
        var player = hub.GetPlayerByConnectionId();

        string idea = payload.ToObject<string>();

        if (!string.IsNullOrWhiteSpace(idea))
            await hub.SendGameUpdateToPresenter(idea, player);
    }
}